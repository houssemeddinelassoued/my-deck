// Lists the countdown timers of a deck — page (0-based index), id, label and
// default minutes — and writes that list into the deck's index.tsx as
// `export const timers`, between the // @@TIMERS-BEGIN / // @@TIMERS-END markers.
//
// The presenter view (« Minuteurs ») reads that list to re-time the remaining
// workshops from the real clock. The list is read from the rendered pages
// (each Timer exposes data-osd-timer* attributes), so it follows the code even
// when a timer is a prop of a wrapper component (TP 1…6, LabPage…).
//
//   node scripts/timers-manifest.mjs <slideId> [<slideId>…]
//   node scripts/timers-manifest.mjs --all          (every slides/*/index.tsx that uses <Timer)
//   node scripts/timers-manifest.mjs <slideId> --dry-run   (print, do not write)
//
// Run it again after regenerating a deck from its build kit (the build
// rewrites index.tsx and drops the block).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BEGIN = '// @@TIMERS-BEGIN';
const END = '// @@TIMERS-END';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const ids = args.includes('--all')
  ? fs
      .readdirSync(path.join(ROOT, 'slides'), { withFileTypes: true })
      .filter((d) => d.isDirectory() && fs.existsSync(path.join(ROOT, 'slides', d.name, 'index.tsx')))
      .map((d) => d.name)
      .filter((id) => /<Timer\b/.test(fs.readFileSync(path.join(ROOT, 'slides', id, 'index.tsx'), 'utf8')))
  : args.filter((a) => !a.startsWith('--'));
if (ids.length === 0) {
  console.error('usage: node scripts/timers-manifest.mjs <slideId>… | --all [--dry-run]');
  process.exit(1);
}

// Virtual modules of the open-slide dev server are not needed to render a page.
const virtualStub = {
  name: 'timers-manifest-virtual-stub',
  enforce: 'pre',
  resolveId(id) {
    if (id.startsWith('virtual:open-slide/')) return `\0${id}`;
    return null;
  },
  load(id) {
    if (id.startsWith('\0virtual:open-slide/')) return 'export default {};';
    return null;
  },
};

const { createServer } = await import('vite');
const React = await import('react');
const { renderToStaticMarkup } = await import('react-dom/server');

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");

// Pulls the data-osd-timer* attributes out of one rendered page.
function timersOnPage(html) {
  const out = [];
  for (const tag of html.match(/<[a-zA-Z][^>]*data-osd-timer="[^"]*"[^>]*>/g) ?? []) {
    const attr = (name) => {
      const m = tag.match(new RegExp(`${name}="([^"]*)"`));
      return m ? decode(m[1]) : null;
    };
    out.push({ id: attr('data-osd-timer'), label: attr('data-osd-timer-label') ?? '', minutes: Number(attr('data-osd-timer-minutes')) });
  }
  return out;
}

const server = await createServer({
  root: ROOT,
  configFile: false,
  logLevel: 'error',
  appType: 'custom',
  plugins: [virtualStub],
  resolve: { alias: [{ find: /^@assets\//, replacement: `${path.join(ROOT, 'assets').replaceAll('\\', '/')}/` }] },
  server: { middlewareMode: true, hmr: false, watch: null },
  ssr: { noExternal: ['@open-slide/core'] },
  optimizeDeps: { noDiscovery: true, include: [] },
});

let failed = 0;
try {
  for (const id of ids) {
    const file = path.join(ROOT, 'slides', id, 'index.tsx');
    const mod = await server.ssrLoadModule(`/slides/${id}/index.tsx`);
    const entries = [];
    mod.default.forEach((Page, page) => {
      let html;
      try {
        // Pages read their number from the core's page context (global, created by the core module).
        const Ctx = globalThis.__open_slide_page_context__;
        html = renderToStaticMarkup(
          React.createElement(Ctx.Provider, { value: { index: page, total: mod.default.length } }, React.createElement(Page)),
        );
      } catch (err) {
        failed++;
        console.error(`${id} p.${page + 1}: render failed: ${err.message}`);
        return;
      }
      const seen = new Set();
      for (const t of timersOnPage(html)) {
        if (!t.id || seen.has(t.id) || !Number.isFinite(t.minutes)) continue;
        seen.add(t.id);
        entries.push({ id: t.id, label: t.label, page, minutes: t.minutes });
      }
    });

    const block = [
      BEGIN,
      '// Minuteurs de la deck — généré par scripts/timers-manifest.mjs (page = index 0-based).',
      'export const timers = [',
      ...entries.map((e) => `  { id: ${JSON.stringify(e.id)}, label: ${JSON.stringify(e.label)}, page: ${e.page}, minutes: ${e.minutes} },`),
      '];',
      END,
    ].join('\n');

    // A timer id used on several pages is one timer (shared state and re-timing):
    // keep its last page, so it counts as remaining while any of its pages is ahead.
    const byId = new Map();
    for (const e of entries) byId.set(e.id, e);
    const unique = [...byId.values()];
    entries.length = 0;
    entries.push(...unique);

    console.log(`${id}: ${entries.length} timer(s)`);
    for (const e of entries) console.log(`  p.${String(e.page + 1).padStart(3)}  ${e.id.padEnd(14)} ${e.minutes} min  ${e.label}`);
    if (dryRun) continue;

    let src = fs.readFileSync(file, 'utf8');
    const crlf = src.includes('\r\n');
    if (crlf) src = src.replace(/\r\n/g, '\n');
    const a = src.indexOf(BEGIN);
    const b = src.indexOf(END);
    if (a !== -1 && b !== -1 && b > a) {
      src = src.slice(0, a) + block + src.slice(b + END.length);
    } else {
      src = `${src.replace(/\s*$/, '')}\n\n${block}\n`;
    }
    if (crlf) src = src.replace(/\n/g, '\r\n');
    fs.writeFileSync(file, src);
  }
} finally {
  await server.close();
}
if (failed) process.exitCode = 1;
