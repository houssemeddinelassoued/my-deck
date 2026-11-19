// Assemble the « Claude · IA avancée pour les développeurs » deck (GoMyCode × Wevioo, 2 days)
// from kit.tsx + part files (NN-name.tsx, concatenated in filename order).
//
//   node .cla-build/build.mjs            → writes slides/claude-ia-avancee-developpeurs/index.tsx, then type-checks it
//   node .cla-build/build.mjs --no-tsc   → same, without the type-check
//
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
const BUILD = path.join(ROOT, '.cla-build');
const { parse } = require(path.join(ROOT, 'node_modules/@babel/parser'));

const DECK = {
  id: 'claude-ia-avancee-developpeurs',
  title: 'Claude · L’IA avancée pour les développeurs — GoMyCode × Wevioo (2 jours)',
  createdAt: '2026-11-14T16:00:00.000Z',
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
  const code = src.replace(pm[0], '').replace(nm[0], '').trim();
  if (/^\s*import\s/m.test(code)) throw new Error(`${file}: part files must not import (the kit does)`);
  return { file: path.basename(file), code, pages, notes };
};

const parts = fs
  .readdirSync(BUILD)
  .filter((f) => /^\d\d-.*\.tsx$/.test(f))
  .sort()
  .map((f) => readPart(path.join(BUILD, f)));

const pages = parts.flatMap((p) => p.pages);
const notes = parts.flatMap((p) => p.notes);
for (const p of parts) console.log(`  ${p.file}: ${p.pages.length} pages`);

// Labs pack (« Labs » toolbar button) — only wired once the zip exists.
const LABS_ZIP = path.join(ROOT, 'slides', DECK.id, 'assets', 'labs-guichet-claude.zip');
const hasLabs = fs.existsSync(LABS_ZIP);
let kit = fs.readFileSync(path.join(BUILD, 'kit.tsx'), 'utf8').replace(/\r\n/g, '\n').trimEnd();
if (hasLabs) {
  const anchor = "import formateur from '@assets/houssem-formateur.png';";
  if (!kit.includes(anchor)) throw new Error('kit: formateur import anchor missing');
  kit = kit.replace(anchor, `${anchor}\nimport labsPack from './assets/labs-guichet-claude.zip?url';`);
}

// ── Design tokens: keep what was saved from the Design panel ────────────────
// The panel writes `design` into slides/<id>/index.tsx; a rebuild would wipe it.
// Merge: kit defaults (new keys appear) ← saved values (user choices win).
const literal = (n) => {
  switch (n.type) {
    case 'StringLiteral':
    case 'NumericLiteral':
    case 'BooleanLiteral':
      return n.value;
    case 'UnaryExpression':
      if (n.operator === '-' && n.argument.type === 'NumericLiteral') return -n.argument.value;
      break;
    case 'TemplateLiteral':
      if (n.expressions.length === 0) return n.quasis[0].value.cooked;
      break;
    case 'ArrayExpression':
      return n.elements.map(literal);
    case 'ObjectExpression':
      return Object.fromEntries(
        n.properties.map((p) => {
          if (p.type !== 'ObjectProperty' || p.computed) throw new Error('design: unsupported property');
          return [p.key.type === 'Identifier' ? p.key.name : p.key.value, literal(p.value)];
        }),
      );
  }
  throw new Error(`design: unsupported node ${n.type}`);
};
const findDesign = (src) => {
  const ast = parse(src, { sourceType: 'module', plugins: ['typescript', 'jsx'], errorRecovery: true });
  for (const node of ast.program.body) {
    const decl = node.type === 'ExportNamedDeclaration' ? node.declaration : node;
    if (decl?.type !== 'VariableDeclaration') continue;
    for (const d of decl.declarations) {
      if (d.id?.name !== 'design') continue;
      let init = d.init;
      if (init?.type === 'TSSatisfiesExpression' || init?.type === 'TSAsExpression') init = init.expression;
      if (init?.type === 'ObjectExpression') return { start: init.start, end: init.end, value: literal(init) };
    }
  }
  return null;
};
const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
const deepMerge = (base, over) => {
  const out = { ...base };
  for (const [k, v] of Object.entries(over)) out[k] = isObj(v) && isObj(base[k]) ? deepMerge(base[k], v) : v;
  return out;
};
const ser = (v, lvl = 0) => {
  if (Array.isArray(v)) return `[${v.map((x) => ser(x, lvl + 1)).join(', ')}]`;
  if (isObj(v)) {
    const pad = '  '.repeat(lvl + 1);
    const keys = Object.entries(v).map(([k, x]) => `${pad}${/^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`}: ${ser(x, lvl + 1)},`);
    return `{\n${keys.join('\n')}\n${'  '.repeat(lvl)}}`;
  }
  return typeof v === 'string' ? `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'` : String(v);
};
const kitDesign = findDesign(kit);
if (!kitDesign) throw new Error('kit: export const design not found');
const DEST_FILE = path.join(ROOT, 'slides', DECK.id, 'index.tsx');
let saved = null;
try {
  saved = findDesign(fs.readFileSync(DEST_FILE, 'utf8'))?.value ?? null;
} catch {}
if (saved) {
  const merged = deepMerge(kitDesign.value, saved);
  // Panel labels always come from the kit (they describe the kit's tokens).
  if (kitDesign.value.labels) merged.labels = kitDesign.value.labels;
  kit = kit.slice(0, kitDesign.start) + ser(merged) + kit.slice(kitDesign.end);
  console.log('  design: kept the values saved from the Design panel');
}

// ── Module chips: first page of each module (click on M1…M6 in the header) ──
const MOD_START = {};
pages.forEach((name, i) => {
  const m = name.match(/^M(\d+)_Section$/);
  if (m && MOD_START[m[1]] === undefined) MOD_START[m[1]] = i;
});
for (const n of [1, 2, 3, 4, 5, 6]) if (MOD_START[n] === undefined) throw new Error(`no M${n}_Section page`);
kit += `\n\n// Module → index of its opening page (generated by build.mjs from the M<n>_Section pages).\nconst MOD_START: Record<number, number> = ${JSON.stringify(MOD_START).replace(/"/g, '')};`;

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
  createdAt: '${DECK.createdAt}',${hasLabs ? '\n  labs: labsPack,' : ''}
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
// Minuteurs (presenter « Minuteurs ») : re-list the timers of the rebuilt deck.
// On Windows the drive letter must be upper-case, or Vite loads React twice (q:/ vs Q:/) and every page fails to render.
const ROOT_UP = ROOT.replace(/^([a-z]):/, (_, d) => `${d.toUpperCase()}:`);
execSync(`node scripts/timers-manifest.mjs ${path.basename(dest)}`, { cwd: ROOT_UP, stdio: 'inherit' });
console.log(`→ slides/${DECK.id}/index.tsx: ${pages.length} pages, ${text.split('\n').length} lines`);

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
