// Assemble « Introduction à l’IA et à l’éthique » (Technologia IA114, 1 day)
// from kit.tsx + part files (NN-name.tsx, concatenated in filename order).
//
//   node .eth-build/build.mjs            → writes slides/introduction-ia-ethique/index.tsx, then type-checks it
//   node .eth-build/build.mjs --no-tsc   → same, without the type-check
//
// Single-day deck: every part belongs to the same day (DAY_SPLIT = 0).
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
const BUILD = path.join(ROOT, '.eth-build');
const { parse } = require(path.join(ROOT, 'node_modules/@babel/parser'));

const DECK = {
  id: 'introduction-ia-ethique',
  p: 'eth',
  title: 'Introduction à l’IA et à l’éthique — Formation IA114 (1 jour)',
  createdAt: '2026-11-18T13:34:29.720Z',
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
let from = 1;
for (const p of parts) {
  console.log(`  ${p.file}: ${p.pages.length} pages (${from}–${from + p.pages.length - 1})`);
  from += p.pages.length;
}

// Guides du participant, one per client (node .eth-labs/guide.mjs). meta.labs lists every guide, so the
// « Labs » toolbar buttons (core patch) offer a choice of client; the deck also links the active client's guide.
const ASSETS = path.join(ROOT, 'slides', DECK.id, 'assets');
const CLIENT_IDS = ['apsm', 'sobeys'];
const CLIENT_NAMES = { apsm: 'APSM', sobeys: 'Sobeys' };
const labsIds = CLIENT_IDS.filter((id) => fs.existsSync(path.join(ASSETS, `guide-${id}.pdf`)));
let kit = fs
  .readFileSync(path.join(BUILD, 'kit.tsx'), 'utf8')
  .replace(/\r\n/g, '\n')
  .replaceAll('__SLIDE_ID__', DECK.id)
  .replaceAll('__P__', DECK.p)
  .replaceAll('__DAY_SPLIT__', '0') // single-day deck
  .replaceAll('__DAY__', '1')
  .trimEnd();
// Client logos (assets/logos/client-<id>.svg|png|jpg|webp) and guides (assets/guide-<id>.pdf).
{
  const imports = [];
  const logos = [];
  const guides = [];
  for (const id of CLIENT_IDS) {
    const logo = ['svg', 'png', 'jpg', 'jpeg', 'webp'].map((e) => `client-${id}.${e}`).find((f) => fs.existsSync(path.join(ASSETS, 'logos', f)) && fs.statSync(path.join(ASSETS, 'logos', f)).size > 0);
    if (logo) {
      imports.push(`import clientLogo_${id} from './assets/logos/${logo}';`);
      logos.push(`${id}: clientLogo_${id}`);
    }
    if (fs.existsSync(path.join(ASSETS, `guide-${id}.pdf`))) {
      imports.push(`import clientGuide_${id} from './assets/guide-${id}.pdf?url';`);
      guides.push(`${id}: clientGuide_${id}`);
    }
  }
  const L = 'const CLIENT_LOGOS: Partial<Record<ClientId, string>> = {};';
  const G = 'const CLIENT_GUIDES: Partial<Record<ClientId, string>> = {};';
  if (!kit.includes(L) || !kit.includes(G)) throw new Error('kit: client logos/guides anchors missing');
  kit = kit
    .replace(L, `const CLIENT_LOGOS: Partial<Record<ClientId, string>> = { ${logos.join(', ')} };`)
    .replace(G, `const CLIENT_GUIDES: Partial<Record<ClientId, string>> = { ${guides.join(', ')} };`);
  const anchor = "import logoWide from '@assets/technologia/logo-horizontal.png';";
  kit = kit.replace(anchor, [anchor, ...imports].join('\n'));
  console.log(`  clients: logos {${logos.length ? CLIENT_IDS.filter((i) => logos.some((l) => l.startsWith(i))).join(', ') : '—'}} · guides {${guides.length ? CLIENT_IDS.filter((i) => guides.some((g) => g.startsWith(i))).join(', ') : '—'}}`);
}

// ─── Version light (à envoyer avant la formation) ─────────────────────────────
// No separate deck: index.tsx exports `light` = 0-based indices of the pages of the light version,
// recomputed at every build, so the light version always follows the main deck. The deck page's
// « Télécharger › Version light (PDF) » (core patch) prints only those pages, never the notes,
// in the client version chosen on the cover (APSM / Sobeys). Left out: the three ateliers, pages
// whose code uses <QcmPage>, <AtelierPage> or kind="qcm|exercice|atelier" (Sections kept), LIGHT_DROP.
const LIGHT_DROP_PARTS = new Set(['30-a1.tsx', '60-a2.tsx', '80-a3.tsx']); // the three ateliers
const LIGHT_DROP = new Set(['OP_Roundtable', 'OP_Quiz0', 'CL_Quiz', 'CL_Action']);
const LIGHT_KEEP = new Set(['OP_HowWeWork']); // mentions kind="qcm" in its cards, but useful pre-reading
const lightIdx = (() => {
  const pageCode = (code, name) => {
    const i = code.indexOf(`const ${name}: Page`);
    if (i < 0) throw new Error(`page ${name}: definition not found`);
    const rest = code.slice(i + 1);
    const j = rest.search(/\n(const |\/\/ ─── )/);
    return j < 0 ? rest : rest.slice(0, j);
  };
  const keep = (p, name) => {
    if (LIGHT_KEEP.has(name)) return true;
    if (LIGHT_DROP_PARTS.has(p.file) || LIGHT_DROP.has(name)) return false;
    const c = pageCode(p.code, name);
    if (/<Section\b/.test(c)) return true;
    return !/<QcmPage\b|<AtelierPage\b|kind="(qcm|exercice|atelier)"/.test(c);
  };
  return parts.flatMap((p) => p.pages.map((n) => keep(p, n))).flatMap((k, i) => (k ? [i] : []));
})();

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
  theme: 'technologia',${labsIds.length ? `\n  labs: [${labsIds.map((id) => `{ label: '${CLIENT_NAMES[id]}', url: clientGuide_${id} }`).join(', ')}],` : ''}
};

export default [
${pages.map((n) => `  ${n},`).join('\n')}
] satisfies Page[];

// Speaker notes — one entry per page, same order as the default export.
export const notes: (string | undefined)[] = [
${notes.map((n) => `  ${n},`).join('\n')}
];

// Version light (« Télécharger › Version light (PDF) ») — 0-based page indices, written by the build.
export const light: number[] = [${lightIdx.join(', ')}];
`,
].join('\n');

const dest = path.join(ROOT, 'slides', DECK.id);
fs.mkdirSync(dest, { recursive: true });
writeDeck(path.join(dest, 'index.tsx'), text); // + saved design, client logo, MOD_START

// Minuteurs (presenter « Minuteurs ») : re-list the timers of the rebuilt deck.

// Upper-case drive letter, or Vite loads React twice (q:/ vs Q:/) and every page fails to render.
  execSync(`node scripts/timers-manifest.mjs ${path.basename(dest)}`, { cwd: ROOT.replace(/^([a-z]):/, (_, d) => `${d.toUpperCase()}:`), stdio: 'inherit' });
console.log(`→ slides/${DECK.id}/index.tsx: ${pages.length} pages, ${text.split('\n').length} lines · version light : ${lightIdx.length} pages`);

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
