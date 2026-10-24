// Assemble « IA appliquée à la gestion de projet » (Technologia IA124, 2 days)
// from kit.tsx + part files (NN-name.tsx, concatenated in filename order).
//
//   node .gp-build/build.mjs            → writes slides/ia-gestion-de-projet/index.tsx, then type-checks it
//   node .gp-build/build.mjs --no-tsc   → same, without the type-check
//
// Parts 00–49 = Jour 1, parts 50–99 = Jour 2 (the kit derives "Jour N" from the page number).
// Part file: plain page code (no imports) + two marker blocks:
//   // @@PAGES-BEGIN
//   export const __pages = [PageA, PageB];
//   // @@PAGES-END
//   // @@NOTES-BEGIN
//   export const __notes = [`…`, `…`];
//   // @@NOTES-END
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const BUILD = path.join(ROOT, '.gp-build');
const { parse } = require(path.join(ROOT, 'node_modules/@babel/parser'));

const DECK = {
  id: 'ia-gestion-de-projet',
  p: 'gp',
  title: 'IA appliquée à la gestion de projet — Formation IA124 (2 jours)',
  createdAt: '2026-10-23T17:27:35.028Z',
};

const block = (src, name, file) => {
  const re = new RegExp(`// @@${name}-BEGIN\\n([\\s\\S]*?)// @@${name}-END\\n?`);
  const m = src.match(re);
  if (!m) throw new Error(`${file}: missing // @@${name}-BEGIN … // @@${name}-END`);
  return m;
};

const arrayOf = (code, file, what) => {
  const ast = parse(code, { sourceType: 'module', plugins: ['typescript'] });
  const arr = ast.program.body[0]?.declaration?.declarations?.[0]?.init;
  if (!arr || arr.type !== 'ArrayExpression') throw new Error(`${file}: ${what} must be an array literal`);
  return arr.elements;
};

// French typography: no line break before ? ! % $ » or after «. Patterns are
// chosen so they never match code (ternaries are always followed by a space).
const NB = ' ';
const frenchSpaces = (s) =>
  s
    .replace(/(\p{L}|\d|»|\)) ([?!])(?=( »|["'`<\n]|$))/gmu, `$1${NB}$2`)
    .replace(/« (?=[\p{L}\d.…])/gu, `«${NB}`)
    .replace(/(?<=[\p{L}\d.…!?]) »/gu, `${NB}»`)
    .replace(/(\d) %/g, `$1${NB}%`)
    .replace(/(\d) \$(?!\{)/g, `$1${NB}$`)
    .replace(/(\d) k\$/g, `$1${NB}k$`);

const readPart = (file) => {
  const src = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const pm = block(src, 'PAGES', file);
  const nm = block(src, 'NOTES', file);
  const pages = arrayOf(pm[1], file, '__pages').map((e) => {
    if (e?.type !== 'Identifier') throw new Error(`${file}: __pages entries must be identifiers`);
    return e.name;
  });
  const notes = arrayOf(nm[1], file, '__notes').map((e) => {
    const ok = e && (e.type === 'StringLiteral' || (e.type === 'TemplateLiteral' && e.expressions.length === 0));
    if (!ok) throw new Error(`${file}: __notes entries must be plain strings / template literals without \${}`);
    return nm[1].slice(e.start, e.end);
  });
  if (pages.length !== notes.length) throw new Error(`${file}: ${pages.length} pages but ${notes.length} notes`);
  const code = frenchSpaces(src.replace(pm[0], '').replace(nm[0], '').trim());
  if (/^\s*import\s/m.test(code)) throw new Error(`${file}: part files must not import (the kit does)`);
  return { file: path.basename(file), day: Number(path.basename(file).slice(0, 2)) < 50 ? 1 : 2, code, pages, notes };
};

const parts = fs
  .readdirSync(BUILD)
  .filter((f) => /^\d\d-.*\.tsx$/.test(f))
  .sort()
  .map((f) => readPart(path.join(BUILD, f)));

const pages = parts.flatMap((p) => p.pages);
const notes = parts.flatMap((p) => p.notes);
const split = parts.filter((p) => p.day === 1).reduce((n, p) => n + p.pages.length, 0);
let from = 1;
for (const p of parts) {
  console.log(`  ${p.file}: ${p.pages.length} pages (${from}–${from + p.pages.length - 1})`);
  from += p.pages.length;
}

const kit = fs
  .readFileSync(path.join(BUILD, 'kit.tsx'), 'utf8')
  .replace(/\r\n/g, '\n')
  .replaceAll('__SLIDE_ID__', DECK.id)
  .replaceAll('__P__', DECK.p)
  .replaceAll('__DAY_SPLIT__', String(split))
  .replaceAll('__DAY__', '1')
  .trimEnd();

const text = [
  kit,
  '',
  ...parts.map((p) => `// ═══ ${p.file.replace(/\.tsx$/, '')} ${'═'.repeat(Math.max(4, 70 - p.file.length))}\n\n${p.code}\n`),
  `// ─── Styles (collected above, injected once; updated in place on HMR) ───────
if (typeof document !== 'undefined') {
  const STYLE_ID = \`osd-styles-\${SLIDE_ID}\`;
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  const css = CSS.join('\\n');
  if (el.textContent !== css) el.textContent = css;
}

export const meta: SlideMeta = {
  title: ${JSON.stringify(DECK.title)},
  createdAt: '${DECK.createdAt}',
  theme: 'technologia',
};

export default [
${pages.map((n) => `  ${n},`).join('\n')}
] satisfies Page[];

// Speaker notes — one entry per page, same order as the default export.
export const notes: (string | undefined)[] = [
${notes.map((n) => `  ${n},`).join('\n')}
];
`,
].join('\n');

const dest = path.join(ROOT, 'slides', DECK.id);
fs.mkdirSync(dest, { recursive: true });
fs.writeFileSync(path.join(dest, 'index.tsx'), text);
console.log(`→ slides/${DECK.id}/index.tsx: ${pages.length} pages (Jour 1: 1–${split}, Jour 2: ${split + 1}–${pages.length}), ${text.split('\n').length} lines`);

if (process.argv[2] !== '--no-tsc') {
  try {
    execSync('npx -y -p typescript@5.9 tsc --noEmit -p tsconfig.json', { cwd: ROOT, stdio: 'pipe' });
    console.log('tsc: OK');
  } catch (e) {
    const out = `${e.stdout ?? ''}${e.stderr ?? ''}`.split('\n');
    const mine = out.filter((l) => l.includes(DECK.id) || /^\s/.test(l));
    console.log(mine.slice(0, 80).join('\n'));
    console.log(`tsc: ${mine.filter((l) => l.includes('error TS')).length} error(s) in ${DECK.id}`);
    process.exitCode = 1;
  }
}
