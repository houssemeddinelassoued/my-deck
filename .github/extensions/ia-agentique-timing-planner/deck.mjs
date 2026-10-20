// Parses the deck's page order and speaker-note timings (⏱ N min) from index.tsx.
import { promises as fs } from 'node:fs';

export class DeckError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

function stripLineComments(src) {
  return src
    .split('\n')
    .map((line) => line.replace(/\/\/.*$/, ''))
    .join('\n');
}

function parsePages(src) {
  const start = src.search(/export\s+default\s+\[/);
  if (start < 0) throw new DeckError('DECK_PARSE', 'Could not find `export default [` in the deck.');
  const open = src.indexOf('[', start);
  const close = src.indexOf(']', open);
  if (close < 0) throw new DeckError('DECK_PARSE', 'Unterminated default export array in the deck.');
  const body = stripLineComments(src.slice(open + 1, close)).replace(/\/\*[\s\S]*?\*\//g, '');
  return body
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((name) => {
      if (!/^[A-Za-z_$][\w$]*$/.test(name)) {
        throw new DeckError('DECK_PARSE', `Unsupported entry in default export: ${name.slice(0, 40)}`);
      }
      return name;
    });
}

function readQuoted(src, i, quote) {
  let out = '';
  let depth = 0;
  for (i += 1; i < src.length; i += 1) {
    const ch = src[i];
    if (ch === '\\') {
      const next = src[i + 1];
      out += next === 'n' ? '\n' : next === 't' ? '\t' : next;
      i += 1;
      continue;
    }
    if (quote === '`' && ch === '$' && src[i + 1] === '{') depth += 1;
    else if (quote === '`' && ch === '}' && depth > 0) depth -= 1;
    else if (ch === quote && depth === 0) return { value: out, end: i + 1 };
    out += ch;
  }
  throw new DeckError('DECK_PARSE', 'Unterminated string in the notes array.');
}

function parseNotes(src) {
  const start = src.search(/export\s+const\s+notes\b/);
  if (start < 0) return [];
  let i = src.indexOf('= [', start);
  if (i < 0) throw new DeckError('DECK_PARSE', 'Could not find the notes array literal.');
  i += 3;
  const notes = [];
  while (i < src.length) {
    const ch = src[i];
    if (/\s|,/.test(ch)) {
      i += 1;
    } else if (src.startsWith('//', i)) {
      i = src.indexOf('\n', i);
      if (i < 0) break;
    } else if (src.startsWith('/*', i)) {
      const end = src.indexOf('*/', i);
      if (end < 0) break;
      i = end + 2;
    } else if (ch === ']') {
      return notes;
    } else if (ch === '`' || ch === "'" || ch === '"') {
      const { value, end } = readQuoted(src, i, ch);
      notes.push(value);
      i = end;
    } else {
      const m = /^[^,\]]*/.exec(src.slice(i, i + 200));
      notes.push(null);
      i += Math.max(1, m[0].length);
    }
  }
  throw new DeckError('DECK_PARSE', 'Unterminated notes array.');
}

const toMin = (h, m) => Number(h) * 60 + Number(m);

export function parseTiming(note) {
  if (typeof note !== 'string') return { minutes: null, label: '', anchor: null, endAnchor: null };
  const first = note.split('\n', 1)[0];
  const dur = /⏱\s*(\d+)\s*min/.exec(first);
  let label = dur ? first.slice(dur.index + dur[0].length) : first;
  label = label.replace(/^\s*[·:-]\s*/, '').trim();
  const anchor = /(?:≈|vers|\()\s*(\d{1,2})\s*h\s*(\d{2})/.exec(first);
  const endAnchor = /jusqu['’]à\s*(\d{1,2})\s*h\s*(\d{2})/.exec(first);
  return {
    minutes: dur ? Number(dur[1]) : null,
    label,
    anchor: anchor ? toMin(anchor[1], anchor[2]) : null,
    endAnchor: endAnchor ? toMin(endAnchor[1], endAnchor[2]) : null,
  };
}

let cache = null;

export async function deckSignature(deckPath) {
  try {
    const s = await fs.stat(deckPath);
    return `${s.mtimeMs}:${s.size}`;
  } catch {
    return 'missing';
  }
}

export async function loadDeck(deckPath) {
  let stat;
  try {
    stat = await fs.stat(deckPath);
  } catch (err) {
    throw new DeckError('DECK_NOT_FOUND', `Deck not found at ${deckPath}: ${err.message}`);
  }
  const sig = `${stat.mtimeMs}:${stat.size}`;
  if (cache && cache.path === deckPath && cache.sig === sig) return cache.deck;

  const src = (await fs.readFile(deckPath, 'utf8')).replace(/\r\n/g, '\n');
  const names = parsePages(src);
  const notes = parseNotes(src);
  const titleMatch = /export\s+const\s+meta[\s\S]*?title:\s*(['"`])([\s\S]*?)\1/.exec(src);
  const warnings = [];
  if (notes.length !== names.length) {
    warnings.push(`Le nombre de notes (${notes.length}) diffère du nombre de pages (${names.length}).`);
  }
  const pages = names.map((name, idx) => {
    const t = parseTiming(notes[idx]);
    if (t.minutes == null) warnings.push(`Page ${idx + 1} (${name}) : aucune durée « ⏱ N min » dans les notes.`);
    return { index: idx + 1, name, ...t, minutes: t.minutes ?? 0 };
  });
  const deck = { title: titleMatch ? titleMatch[2] : 'Deck', pages, warnings, sig };
  cache = { path: deckPath, sig, deck };
  return deck;
}
