// Assemble « Automatisation des tâches avec l’IA » (Technologia IA135, 2 days)
// from kit.tsx + part files (NN-name.tsx, concatenated in filename order).
//
//   node .ata-build/build.mjs            → writes slides/automatisation-taches-ia/index.tsx, then type-checks it
//   node .ata-build/build.mjs --no-tsc   → same, without the type-check
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
import { finalizeDeck, writeDeck } from '../scripts/deck-features.mjs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const BUILD = path.join(ROOT, '.ata-build');
const { parse } = require(path.join(ROOT, 'node_modules/@babel/parser'));

const DECK = {
  id: 'automatisation-taches-ia',
  p: 'ata',
  title: 'Automatisation des tâches avec l’IA — Formation IA135 (2 jours)',
  createdAt: '2026-11-19T15:00:00.000Z',
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

// ─── Version light (à envoyer avant la formation) ─────────────────────────────
// No separate deck: index.tsx exports `light` = 0-based indices of the pages of the light
// version, recomputed at every build, so the light version always follows the main deck.
// The deck page's « Télécharger › Version light (PDF) » (core patch) prints only those pages,
// and never the speaker notes. A page is left out when its own code uses <QcmPage>,
// <AtelierPage> or kind="qcm|exercice|atelier" (section dividers <Section> are always kept),
// or when it is listed in LIGHT_DROP. Pages can adapt to the light export with isLightExport().
const LIGHT_DROP = new Set(['OP_Tour', 'OP_Quiz0', 'J1_Bilan', 'J1_Demain', 'J2_Rappel', 'M8_Cible', 'M9_Choix', 'CL_Plan']);
const pageCode = (code, name) => {
  const i = code.indexOf(`const ${name}: Page`);
  if (i < 0) throw new Error(`page ${name}: definition not found`);
  const rest = code.slice(i + 1);
  const j = rest.search(/\n(const |\/\/ ─── )/);
  return j < 0 ? rest : rest.slice(0, j);
};
const isLight = (code, name) => {
  if (LIGHT_DROP.has(name)) return false;
  const c = pageCode(code, name);
  if (/<Section\b/.test(c)) return true;
  return !/<QcmPage\b|<AtelierPage\b|kind="(qcm|exercice|atelier)"/.test(c);
};

// Participant guide (node .ata-labs/guide.mjs) → « Labs » button.
const GUIDE = path.join(ROOT, 'slides', DECK.id, 'assets', 'guide-ia135.pdf');
const hasGuide = fs.existsSync(GUIDE);
const BT = '`';
const DL = '$';

const pages = parts.flatMap((p) => p.pages);
const notes = parts.flatMap((p) => p.notes);
const lightIdx = parts.flatMap((p) => p.pages.map((n) => isLight(p.code, n))).flatMap((keep, i) => (keep ? [i] : []));
const split = parts.filter((p) => p.day === 1).reduce((n, p) => n + p.pages.length, 0);
{
  let from = 1;
  for (const p of parts) {
    console.log(`  ${p.file}: ${p.pages.length} pages (${from}–${from + p.pages.length - 1})`);
    from += p.pages.length;
  }
}
let kit = fs
  .readFileSync(path.join(BUILD, 'kit.tsx'), 'utf8')
  .replace(/\r\n/g, '\n')
  .replaceAll('__SLIDE_ID__', DECK.id)
  .replaceAll('__P__', DECK.p)
  .replaceAll('__DAY_SPLIT__', String(split))
  .replaceAll('__DAY__', '1')
  .trimEnd();
if (hasGuide) {
  const anchor = "import logoWide from '@assets/technologia/logo-horizontal.png';";
  kit = kit.replace(anchor, `${anchor}\nimport guideUrl from './assets/guide-ia135.pdf?url';`);
}
const styles = [
  '// ─── Styles (collected above, injected once; updated in place on HMR) ───────',
  "if (typeof document !== 'undefined') {",
  `  const STYLE_ID = ${BT}osd-styles-${DL}{SLIDE_ID}${BT};`,
  '  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;',
  '  if (!el) {',
  "    el = document.createElement('style');",
  '    el.id = STYLE_ID;',
  '    document.head.appendChild(el);',
  '  }',
  "  const css = CSS.join('\\n');",
  '  if (el.textContent !== css) el.textContent = css;',
  '}',
  '',
  'export const meta: SlideMeta = {',
  `  title: ${JSON.stringify(DECK.title)},`,
  `  createdAt: '${DECK.createdAt}',`,
  "  theme: 'technologia',",
  ...(hasGuide ? ['  labs: guideUrl,'] : []),
  '};',
  '',
  'export default [',
  ...pages.map((n) => `  ${n},`),
  '] satisfies Page[];',
  '',
  '// Speaker notes — one entry per page, same order as the default export.',
  'export const notes: (string | undefined)[] = [',
  ...notes.map((n) => `  ${n},`),
  '];',
  '',
  '// Version light (« Télécharger › Version light (PDF) ») — 0-based page indices, written by the build.',
  `export const light: number[] = [${lightIdx.join(', ')}];`,
  '',
].join('\n');
const text = [kit, '', ...parts.map((p) => `// ═══ ${p.file.replace(/\.tsx$/, '')} ${'═'.repeat(Math.max(4, 70 - p.file.length))}\n\n${p.code}\n`), styles].join('\n');
const dest = path.join(ROOT, 'slides', DECK.id);
fs.mkdirSync(dest, { recursive: true });
writeDeck(path.join(dest, 'index.tsx'), text); // + saved design, client logo, MOD_START
// Upper-case drive letter, or Vite loads React twice (q:/ vs Q:/) and every page fails to render.
execSync(`node scripts/timers-manifest.mjs ${path.basename(dest)}`, { cwd: ROOT.replace(/^([a-z]):/, (_, d) => `${d.toUpperCase()}:`), stdio: 'inherit' });
console.log(`→ slides/${DECK.id}/index.tsx: ${pages.length} pages (Jour 1: 1–${split}, Jour 2: ${split + 1}–${pages.length})${hasGuide ? ' · Labs : guide du participant' : ''} · version light : ${lightIdx.length} pages`);

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
