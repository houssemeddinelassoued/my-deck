// Per-instance loopback HTTP server: static UI, JSON API, and server-sent events.
import { promises as fs } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = {
  '/': ['ui.html', 'text/html; charset=utf-8'],
  '/ui.css': ['ui.css', 'text/css; charset=utf-8'],
  '/ui.js': ['ui.js', 'text/javascript; charset=utf-8'],
};
const MAX_BODY = 16 * 1024;
const POLL_MS = 1500;

const STATUS = { INVALID_INPUT: 400, UNKNOWN_PAGE: 404, UNKNOWN_BREAK: 404, DECK_NOT_FOUND: 404 };

function send(res, code, body, type = 'application/json; charset=utf-8') {
  res.writeHead(code, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'",
    'Referrer-Policy': 'no-referrer',
  });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) {
        reject(Object.assign(new Error('Request body too large.'), { code: 'INVALID_INPUT' }));
        req.destroy();
      } else chunks.push(c);
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch {
        reject(Object.assign(new Error('Body must be JSON.'), { code: 'INVALID_INPUT' }));
      }
    });
    req.on('error', reject);
  });
}

export async function startServer(planner, log) {
  const clients = new Set();
  let lastSig = null;
  let timer = null;

  const broadcast = (event, data) => {
    const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const res of clients) res.write(msg);
  };

  const checkChanges = async () => {
    try {
      const sig = await planner.signature();
      if (lastSig !== null && sig !== lastSig) broadcast('changed', { sig });
      lastSig = sig;
    } catch (err) {
      log?.(`signature check failed: ${err.message}`, 'warning');
    }
  };

  const mutations = {
    '/api/page-minutes': (b) => planner.setPageMinutes(b),
    '/api/break': (b) => planner.setBreak(b),
    '/api/day': (b) => planner.setDayHours(b),
    '/api/reset': (b) => planner.reset(b),
  };

  let port = 0;
  const server = http.createServer(async (req, res) => {
    try {
      const host = req.headers.host ?? '';
      if (host !== `127.0.0.1:${port}` && host !== `localhost:${port}`) return send(res, 421, { error: 'Bad host' });
      const url = new URL(req.url, `http://${host}`);

      if (req.method === 'GET' && ASSETS[url.pathname]) {
        const [file, type] = ASSETS[url.pathname];
        return send(res, 200, await fs.readFile(path.join(HERE, file)), type);
      }
      if (req.method === 'GET' && url.pathname === '/api/plan') {
        return send(res, 200, await planner.view());
      }
      if (req.method === 'GET' && url.pathname === '/api/events') {
        res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive' });
        res.write('retry: 2000\n\n');
        clients.add(res);
        if (!timer) {
          lastSig = await planner.signature();
          timer = setInterval(checkChanges, POLL_MS);
        }
        req.on('close', () => {
          clients.delete(res);
          if (!clients.size && timer) {
            clearInterval(timer);
            timer = null;
          }
        });
        return undefined;
      }
      if (req.method === 'POST' && mutations[url.pathname]) {
        const origin = req.headers.origin;
        if (origin && origin !== `http://${host}`) return send(res, 403, { error: 'Cross-origin request refused.' });
        if (!/^application\/json\b/.test(req.headers['content-type'] ?? '')) {
          return send(res, 415, { error: 'Content-Type must be application/json.' });
        }
        const result = await mutations[url.pathname](await readJson(req));
        await checkChanges();
        return send(res, 200, { ok: true, result });
      }
      return send(res, 404, { error: 'Not found' });
    } catch (err) {
      const code = STATUS[err.code] ?? 500;
      if (code === 500) log?.(`request failed: ${err.message}`, 'error');
      return send(res, code,  { error: err.message, code: err.code ?? 'INTERNAL' });
    }
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  port = server.address().port;

  return {
    url: `http://127.0.0.1:${port}/`,
    notify: () => checkChanges(),
    isListening: () => server.listening,
    close: () =>
      new Promise((resolve) => {
        if (timer) clearInterval(timer);
        for (const res of clients) res.end();
        clients.clear();
        server.close(() => resolve());
        server.closeAllConnections?.();
      }),
  };
}
