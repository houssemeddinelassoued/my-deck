// Assemble the IA134 decks from kit.tsx + part files.
//
//   node .ia134-build/build.mjs 1            → writes slides/ia-agentique-jour-1/index.tsx
//   node .ia134-build/build.mjs 2            → writes slides/ia-agentique-jour-2/index.tsx
//   node .ia134-build/build.mjs all          → writes slides/ia-agentique-feuille-de-route/index.tsx (J1 + J2)
//   node .ia134-build/build.mjs check <part> → type-checks one part alone (kit + part)
//
// Part files: .ia134-build/j<day>-<order>-<name>.tsx, concatenated in filename order.
// Each part = plain page code (no imports) + two marker blocks:
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
const BUILD = path.join(ROOT, '.ia134-build');
const { parse } = require(path.join(ROOT, 'node_modules/@babel/parser'));

const DECKS = {
  1: {
    id: 'ia-agentique-jour-1',
    p: 'ia1',
    title: 'IA agentique · Jour 1 — Comprendre les agents',
    createdAt: '2026-10-07T18:36:02.816Z',
  },
  2: {
    id: 'ia-agentique-jour-2',
    p: 'ia2',
    title: 'IA agentique · Jour 2 — Construire la feuille de route',
    createdAt: '2026-10-07T18:50:58.806Z',
  },
};

// Both days in one deck: Jour 1 parts then Jour 2 parts. The kit derives the
// "Jour N" header/footer from the page number (pages after `split` = day 2).
const FULL = {
  id: 'ia-agentique-feuille-de-route',
  p: 'iafr',
  title: "IA agentique · Feuille de route — Formation complète IA134 (2 jours)",
  createdAt: '2026-10-08T12:00:00.000Z',
};

const kitFor = (day) => {
  const d = typeof day === 'object' ? day : DECKS[day];
  return fs
    .readFileSync(path.join(BUILD, 'kit.tsx'), 'utf8')
    .replaceAll('__SLIDE_ID__', d.id)
    .replaceAll('__P__', d.p)
    .replaceAll('__DAY_SPLIT__', String(d.split ?? 0))
    .replaceAll('__DAY__', String(d.day ?? day));
};

const block = (src, name, file) => {
  const re = new RegExp(`// @@${name}-BEGIN\\n([\\s\\S]*?)// @@${name}-END\\n?`);
  const m = src.replace(/\r\n/g, '\n').match(re);
  if (!m) throw new Error(`${file}: missing // @@${name}-BEGIN … // @@${name}-END`);
  return m;
};

const readPart = (file) => {
  const src = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const pm = block(src, 'PAGES', file);
  const nm = block(src, 'NOTES', file);
  const pAst = parse(pm[1], { sourceType: 'module', plugins: ['typescript'] });
  const pArr = pAst.program.body[0]?.declaration?.declarations?.[0]?.init;
  if (!pArr || pArr.type !== 'ArrayExpression') throw new Error(`${file}: __pages must be an array literal`);
  const pages = pArr.elements.map((e) => {
    if (e?.type !== 'Identifier') throw new Error(`${file}: __pages entries must be identifiers`);
    return e.name;
  });
  const nAst = parse(nm[1], { sourceType: 'module', plugins: ['typescript'] });
  const nArr = nAst.program.body[0]?.declaration?.declarations?.[0]?.init;
  if (!nArr || nArr.type !== 'ArrayExpression') throw new Error(`${file}: __notes must be an array literal`);
  const notes = nArr.elements.map((e) => {
    const ok =
      e &&
      (e.type === 'StringLiteral' ||
        (e.type === 'TemplateLiteral' && e.expressions.length === 0) ||
        (e.type === 'Identifier' && e.name === 'undefined'));
    if (!ok) throw new Error(`${file}: __notes entries must be plain strings / template literals without \${}`);
    return nm[1].slice(e.start, e.end);
  });
  if (pages.length !== notes.length)
    throw new Error(`${file}: ${pages.length} pages but ${notes.length} notes`);
  const code = src.replace(pm[0], '').replace(nm[0], '').trim();
  if (/^\s*import\s/m.test(code)) throw new Error(`${file}: parts must not contain import statements`);
  return { file: path.basename(file), code, pages, notes };
};

const assemble = (day, parts, cfg) => {
  const d = cfg ?? DECKS[day];
  const pages = parts.flatMap((p) => p.pages);
  const notes = parts.flatMap((p) => p.notes);
  const out = [
    kitFor(cfg ? { ...cfg, day } : day)
      .replaceAll('__DAY__', String(day))
      .trimEnd(),
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
  title: ${JSON.stringify(d.title)},
  createdAt: '${d.createdAt}',
};

export default [
${pages.map((n) => `  ${n},`).join('\n')}
] satisfies Page[];

// Speaker notes — one entry per page, same order as the default export.
export const notes: (string | undefined)[] = [
${notes.map((n) => `  ${n},`).join('\n')}
];
`,
  ];
  return { text: out.join('\n'), pages: pages.length, notes: notes.length };
};

const tsc = (configPath, filter) => {
  try {
    execSync(`npx -y -p typescript@5.9 tsc --noEmit -p "${configPath}"`, { cwd: ROOT, stdio: 'pipe' });
    console.log('tsc: OK');
    return true;
  } catch (e) {
    const outText = `${e.stdout ?? ''}${e.stderr ?? ''}`;
    const lines = outText.split('\n').filter((l) => !filter || l.includes(filter) || /^\s/.test(l));
    console.log(lines.slice(0, 80).join('\n'));
    console.log(`tsc: FAILED (${lines.filter((l) => l.includes('error TS')).length} errors shown)`);
    return false;
  }
};

const [mode, arg] = process.argv.slice(2);

if (mode === 'check') {
  const file = path.resolve(BUILD, arg);
  const day = Number(path.basename(file).match(/^j(\d)/)?.[1]);
  if (!DECKS[day]) throw new Error('part file name must start with j1- or j2-');
  const part = readPart(file);
  const { text, pages } = assemble(day, [part]);
  const dir = path.join(BUILD, 'check');
  fs.mkdirSync(dir, { recursive: true });
  const base = path.basename(file, '.tsx');
  fs.writeFileSync(path.join(dir, `${base}.tsx`), text);
  fs.writeFileSync(
    path.join(dir, `tsconfig.${base}.json`),
    JSON.stringify({ extends: '../../tsconfig.json', include: [`./${base}.tsx`] }, null, 2),
  );
  console.log(`${part.file}: ${pages} pages, ${part.notes.length} notes`);
  const words = part.notes.map((n) => n.split(/\s+/).length);
  console.log(`note word counts: ${words.join(', ')}`);
  tsc(path.join(dir, `tsconfig.${base}.json`), `${base}.tsx`);
} else if (mode === '1' || mode === '2') {
  const day = Number(mode);
  const files = fs
    .readdirSync(BUILD)
    .filter((f) => new RegExp(`^j${day}-.*\\.tsx$`).test(f))
    .sort();
  const parts = files.map((f) => readPart(path.join(BUILD, f)));
  for (const p of parts) console.log(`  ${p.file}: ${p.pages.length} pages`);
  const { text, pages, notes } = assemble(day, parts);
  if (pages !== notes) throw new Error(`pages (${pages}) ≠ notes (${notes})`);
  const dest = path.join(ROOT, 'slides', DECKS[day].id);
  fs.mkdirSync(dest, { recursive: true });
  fs.writeFileSync(path.join(dest, 'index.tsx'), text);
  console.log(`→ slides/${DECKS[day].id}/index.tsx: ${pages} pages, ${text.split('\n').length} lines`);
  if (arg !== '--no-tsc') tsc(path.join(ROOT, 'tsconfig.json'), DECKS[day].id);
} else if (mode === 'all') {
  const partsOf = (day) =>
    fs
      .readdirSync(BUILD)
      .filter((f) => new RegExp(`^j${day}-.*\\.tsx$`).test(f))
      .sort()
      .map((f) => readPart(path.join(BUILD, f)));
  const p1 = partsOf(1);
  const p2 = partsOf(2);
  const split = p1.reduce((n, p) => n + p.pages.length, 0);
  for (const p of [...p1, ...p2]) console.log(`  ${p.file}: ${p.pages.length} pages`);
  const { text, pages, notes } = assemble(1, [...p1, ...p2], { ...FULL, split });
  if (pages !== notes) throw new Error(`pages (${pages}) ≠ notes (${notes})`);
  const dest = path.join(ROOT, 'slides', FULL.id);
  fs.mkdirSync(dest, { recursive: true });
  fs.writeFileSync(path.join(dest, 'index.tsx'), text);
  console.log(`→ slides/${FULL.id}/index.tsx: ${pages} pages (Jour 1: 1–${split}, Jour 2: ${split + 1}–${pages}), ${text.split('\n').length} lines`);
  if (arg !== '--no-tsc') tsc(path.join(ROOT, 'tsconfig.json'), FULL.id);
} else if (mode === 'preview' || mode === 'unpreview') {
  // Temporary single-part deck for visual QA: slides/ia134-pv-<base>/ (prefix pv<base>).
  const file = path.resolve(BUILD, arg);
  const day = Number(path.basename(file).match(/^j(\d)/)?.[1]);
  const base = path.basename(file, '.tsx');
  const key = base.replace(/[^a-z0-9]/gi, '').toLowerCase();
  const cfg = { id: `ia134-pv-${key}`, p: `pv${key}`, title: `Aperçu ${base}`, createdAt: '2026-10-08T00:00:00.000Z', day };
  const dest = path.join(ROOT, 'slides', cfg.id);
  if (mode === 'unpreview') {
    fs.rmSync(dest, { recursive: true, force: true });
    console.log(`removed slides/${cfg.id}`);
  } else {
    const { text, pages } = assemble(day, [readPart(file)], cfg);
    fs.mkdirSync(dest, { recursive: true });
    fs.writeFileSync(path.join(dest, 'index.tsx'), text);
    console.log(`preview → slides/${cfg.id}/index.tsx (${pages} pages)`);
    console.log(`screenshots: cd /c/Users/ASUS/AppData/Local/Temp/ia134pw && node shot.mjs ${cfg.id} ${cfg.p} ./${key} 1-${pages}`);
  }
} else {
  console.log('usage: node .ia134-build/build.mjs <1|2|all> | check <part-file> | preview <part-file> | unpreview <part-file>');
}
