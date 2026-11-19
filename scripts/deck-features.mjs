#!/usr/bin/env node
// Common features of the training decks (« kit » decks with M1…Mn chips):
//   1. Design panel: every colour of the kit palette `C` becomes a design token
//      (design.palette → --osd-<key>), tones T / gradients G follow via color-mix.
//   2. Footer logos chosen in the Design panel (design.logos → --osd-logo-<key>):
//      client final (slides/<id>/assets/logos/logo-client.*), the deck's own
//      mark (mon client) and National Quantum — several at once.
//   3. Module chips M1…Mn: hover = module name, click = jump to the module's
//      opening page (window event `open-slide:goto`, core patch).
//
// Usage
//   node scripts/deck-features.mjs kit .xxx-build/kit.tsx [more kits…]   → transforms kits in place (idempotent)
//   node scripts/deck-features.mjs parts .xxx-build                        → fixes hex-alpha suffixes on tokens in part files
//   node scripts/deck-features.mjs deck slides/<id>/index.tsx              → same on a standalone (non-generated) deck, then finalizes it
//   node scripts/deck-features.mjs check slides/<id>/index.tsx             → prints what finalize would compute (MOD_START, logos)
//
// In a deck's build.mjs, replace `fs.writeFileSync(<dest>/index.tsx, text)` with
//   import { writeDeck } from '../scripts/deck-features.mjs';
//   writeDeck(path.join(dest, 'index.tsx'), text);
// writeDeck keeps the design saved from the Design panel, wires the client logo
// and appends MOD_START.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { parse } = require(path.join(ROOT, 'node_modules/@babel/parser'));

export const MARK = '// @@deck-features v1';

// ─── Colour fitting (keeps every default within a hair of the original) ─────
const rgb = (h) => [1, 3, 5].map((i) => Number.parseInt(h.slice(i, i + 2), 16));
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const mixRgb = (a, pct, b) => a.map((v, i) => v * (pct / 100) + b[i] * (1 - pct / 100));
const WHITE = [255, 255, 255];
const BLACK = [0, 0, 0];

/** Best expression for `hex` built from the palette: exact C.key, or mix(C.key, p[, 'black']). */
function colourExpr(hex, palette, prefer) {
  const target = rgb(hex);
  let best = null;
  for (const [key, val] of Object.entries(palette)) {
    const base = rgb(val);
    if (val.toUpperCase() === hex.toUpperCase()) return { expr: `C.${key}`, err: 0 };
    for (const [other, name] of [
      [WHITE, ''],
      [BLACK, "'black'"],
    ]) {
      for (let p = 4; p <= 98; p++) {
        const err = dist(mixRgb(base, p, other), target) - (key === prefer ? 6 : 0);
        if (!best || err < best.err) best = { expr: name ? `mix(C.${key}, ${p}, ${name})` : `mix(C.${key}, ${p})`, err };
      }
    }
  }
  return best && best.err <= 16 ? best : null;
}

// ─── Design-panel labels for the kit palette keys ───────────────────────────
const LABELS = {
  ink: 'Encre',
  soft: 'Texte doux',
  muted: 'Texte discret',
  faint: 'Texte estompé',
  rule: 'Filets',
  panel: 'Panneaux',
  card: 'Cartes',
  navy: 'Fond sombre',
  electric: 'Accent vif',
  blue: 'Bleu',
  teal: 'Sarcelle (info)',
  green: 'Vert (succès)',
  yellow: 'Jaune (attention)',
  amber: 'Ambre',
  coral: 'Corail (alerte)',
  violet: 'Violet',
  plum: 'Prune',
  pink: 'Rose',
};

const block = (src, startRe, endStr = '\n};\n') => {
  const m = src.match(startRe);
  if (!m) return null;
  const start = m.index;
  const end = src.indexOf(endStr, start);
  if (end < 0) return null;
  return { start, end: end + endStr.length, text: src.slice(start, end + endStr.length) };
};

// ─── 1. Kit transformation ──────────────────────────────────────────────────
export function transformKit(src, { file = 'kit' } = {}) {
  if (src.includes(MARK)) return { src, changed: false };
  const fail = (msg) => {
    throw new Error(`${file}: ${msg}`);
  };

  // Design object (one-line palette in every kit).
  const pm = src.match(/  palette: \{ bg: '(#[0-9A-Fa-f]{6})', text: '(#[0-9A-Fa-f]{6})', accent: '(#[0-9A-Fa-f]{6})' \},\n/);
  if (!pm) fail('one-line design.palette not found');
  const [, bgHex, textHex, accentHex] = pm;

  // Palette C.
  const cb = block(src, /^const C = \{\n/m);
  if (!cb) fail('const C = { … } not found');
  const C = {};
  for (const m of cb.text.matchAll(/^ {2}([a-zA-Z]+): '(#[0-9A-Fa-f]{6})',/gm)) C[m[1]] = m[2];
  if (Object.keys(C).length < 8) fail('palette C has too few hex entries');
  const token = {};
  let accentKey = null;
  for (const [k, v] of Object.entries(C)) {
    if (k === 'ink' && v.toUpperCase() === textHex.toUpperCase()) token[k] = 'text';
    else if (!accentKey && v.toUpperCase() === accentHex.toUpperCase()) {
      token[k] = 'accent';
      accentKey = k;
    } else token[k] = k;
  }
  const extra = Object.entries(C).filter(([k]) => !['text', 'accent'].includes(token[k]));

  // Footer: deck mark + its rule → <FooterLogos />.
  const fb = block(src, /^const Footer = \(/m);
  if (!fb) fail('const Footer not found');
  const lm = fb.text.match(
    /\n(\s*)(<(?:DapLogo|FlowMark)\b[^\n]*\/>|<img src=\{logoWide\}[^\n]*\/>)\n\s*(<span style=\{\{ width: 1\.5[^\n]*\/>)/,
  );
  if (!lm) fail('footer mark + rule not found');
  const [, , markEl, ruleEl] = lm;
  const gap = (fb.text.match(/display: 'flex', alignItems: 'center', gap: (\d+) \}\}>/) ?? [])[1] ?? '18';
  const providerLabel = markEl.startsWith('<DapLogo')
    ? 'Docaposte Institute · mon client'
    : markEl.startsWith('<img')
      ? 'Technologia · mon client'
      : 'Logo du deck';
  const nqH = markEl.startsWith('<img') ? 34 : 28;

  let s = src;

  // a) design object: tokens + logos + labels
  const labels = [
    ...extra.map(([k]) => `    ${token[k]}: '${LABELS[k] ?? k}',`),
    `    'logos.provider': '${providerLabel}',`,
    `    'logos.nationalQuantum': 'National Quantum',`,
  ];
  s = s.replace(
    pm[0],
    `  palette: {
    bg: '${bgHex}',
    text: '${textHex}',
    accent: '${accentHex}',
${extra.map(([k, v]) => `    ${token[k]}: '${v}',`).join('\n')}
  },
  // Footer logos (Design panel → Footer logos). \`client\` is added by the build
  // when slides/<id>/assets/logos/logo-client.(png|svg|jpg|webp) exists.
  logos: { provider: true, nationalQuantum: false },
  labels: {
${labels.join('\n')}
  },
`,
  );

  // b) palette C → tokens; T / G → derived from C
  const cb2 = block(s, /^const C = \{\n/m);
  let cText = cb2.text;
  for (const [k, v] of Object.entries(C)) cText = cText.replace(`  ${k}: '${v}',`, `  ${k}: tv('${token[k]}', '${v}'),`);
  const helpers = `${MARK} — palette driven by the design tokens (Design panel, key D).
// tv('blue', '#0A62D0') → var(--osd-blue, #0A62D0); tints and gradients use
// color-mix, so changing one token recolours its whole family.
const tv = (key: string, fallback: string) =>
  \`var(--osd-\${key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}, \${fallback})\`;
const mix = (c: string, pct: number, other = 'white') => \`color-mix(in srgb, \${c} \${pct}%, \${other})\`;

`;
  s = s.slice(0, cb2.start) + helpers + cText + s.slice(cb2.end);

  const kept = [];
  const exprOr = (hex, prefer) => {
    const e = colourExpr(hex, C, prefer);
    if (!e) kept.push(hex);
    return e ? e.expr : `'${hex}'`;
  };
  const tb = block(s, /^const T = \{\n/m);
  if (tb) {
    const tText = tb.text.replace(/^ {2}([a-z]+): \{ bg: '(#\w{6})', bd: '(#\w{6})', fg: '(#\w{6})' \},/gm, (_, key, bg, bd, fg) => {
      const pref = C[key] ? key : 'muted';
      return `  ${key}: { bg: ${exprOr(bg, pref)}, bd: ${exprOr(bd, pref)}, fg: ${exprOr(fg, pref)} },`;
    });
    s = s.slice(0, tb.start) + tText + s.slice(tb.end);
  }
  const gb = block(s, /^const G = \{\n/m);
  if (gb) {
    const gText = gb.text.replace(/'(linear-gradient\([^']*\))'/g, (_, g) => {
      const out = g.replace(/#[0-9A-Fa-f]{6}/g, (h) => {
        const e = colourExpr(h, C);
        if (!e) {
          kept.push(h);
          return h;
        }
        return `\${${e.expr}}`;
      });
      return out.includes('${') ? `\`${out}\`` : `'${out}'`;
    });
    s = s.slice(0, gb.start) + gText + s.slice(gb.end);
  }

  // c) module chips: clickable + tooltip
  const pb = block(s, /^const ProgSq = \(/m);
  if (!pb) fail('const ProgSq not found');
  let p = pb.text;
  const pastLine = p.match(/\n {2}const past = [^\n]*;\n/);
  if (!pastLine) fail('ProgSq: const past not found');
  // A chip may display a custom label (`text="M9"` for module 11): the tooltip uses it.
  const tipExpr = /text\?: string/.test(p.split('\n')[0]) ? '${text ?? `Module ${n}`}' : 'Module ${n}';
  p = p.replace(
    pastLine[0],
    `${pastLine[0]}  // Click = jump to the module's opening page (MOD_START, appended by the build);
  // only the live page reacts. data-inspector-ui: the editor inspector lets the click through.
  const live = useIsActivePage();
  const target = MOD_START[n];
  const tip = \`${tipExpr} · \${MOD_TITLES[n] ?? ''}\`;
  const go = (e: { stopPropagation: () => void; preventDefault: () => void }) => {
    e.stopPropagation();
    e.preventDefault();
    if (!live || target === undefined || typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('open-slide:goto', { detail: { index: target } }));
  };
`,
  );
  if (!/\n {4}<span\n {6}style=\{\{\n/.test(p)) fail('ProgSq: <span style={{ not found');
  p = p.replace(
    /\n {4}<span\n {6}style=\{\{\n/,
    `
    <span
      role="button"
      tabIndex={-1}
      className={k('chip')}
      data-inspector-ui=""
      data-tip={tip}
      aria-label={tip}
      onClick={go}
      onPointerDown={(e) => e.stopPropagation()}
      style={{
        position: 'relative',
        cursor: live && target !== undefined ? 'pointer' : 'default',
`,
  );
  const nowColour = (p.match(/background: now \? (C\.[a-z]+) : past \? '(#[0-9A-Fa-f]{6})'/) ?? []);
  if (nowColour[2]) p = p.replace(`past ? '${nowColour[2]}'`, `past ? ${exprOr(nowColour[2], nowColour[1].slice(2))}`);
  const tipBg = C.navy ? 'C.navy' : 'C.ink';
  p += `
CSS.push(\`
.\${P}-chip{transition:transform .15s ease, filter .15s ease}
.\${P}-live .\${P}-chip:hover{transform:translateY(-2px);filter:brightness(1.06)}
.\${P}-chip::after{content:attr(data-tip);position:absolute;top:calc(100% + 12px);right:0;z-index:50;
  padding:10px 16px;border-radius:10px;background:\${${tipBg}};color:#fff;white-space:nowrap;
  font:600 19px/1.2 var(--osd-font-body);letter-spacing:0;text-transform:none;box-shadow:0 14px 30px -12px rgba(0,0,0,.45);
  opacity:0;transform:translateY(-4px);pointer-events:none;transition:opacity .15s ease, transform .15s ease}
.\${P}-chip::before{content:'';position:absolute;top:calc(100% + 4px);right:12px;z-index:50;
  border:8px solid transparent;border-bottom-color:\${${tipBg}};border-top:0;
  opacity:0;pointer-events:none;transition:opacity .15s ease}
.\${P}-live .\${P}-chip:hover::after{opacity:1;transform:none}
.\${P}-live .\${P}-chip:hover::before{opacity:1}
\`);
`;
  s = s.slice(0, pb.start) + p + s.slice(pb.end);

  // d) footer logos
  const fb2 = block(s, /^const Footer = \(/m);
  const footer = fb2.text.replace(lm[0], `\n${lm[1]}<FooterLogos />`);
  const logos = `// Footer logos — each toggled in the Design panel (design.logos), live via
// --osd-logo-<key>: flex | none. All off → the strip and its rules disappear.
// @@client-logo: the build swaps the next line for an import when
// slides/<id>/assets/logos/logo-client.(png|svg|jpg|webp) exists.
const CLIENT_LOGO: string | null = null;
const FOOTER_LOGOS: { key: string; node: ReactNode }[] = [
  ...(CLIENT_LOGO
    ? [{ key: 'client', node: <img src={CLIENT_LOGO} alt="Client" style={{ height: 36, width: 'auto', display: 'block' }} /> }]
    : []),
  { key: 'provider', node: ${markEl} },
  {
    key: 'national-quantum',
    node: <img src={logoNationalQuantum} alt="National Quantum" style={{ height: ${nqH}, width: 'auto', display: 'block' }} />,
  },
];
const FooterLogos = () => (
  <>
    {FOOTER_LOGOS.map((l) => (
      <span key={l.key} style={{ display: \`var(--osd-logo-\${l.key}, flex)\`, alignItems: 'center', gap: ${gap} }}>
        {l.node}
        ${ruleEl}
      </span>
    ))}
  </>
);

`;
  s = s.slice(0, fb2.start) + logos + footer + s.slice(fb2.end);

  // e) National Quantum logo import
  const anchor = "import formateur from '@assets/houssem-formateur.png';";
  if (!s.includes(anchor)) fail('formateur import anchor missing');
  s = s.replace(anchor, `${anchor}\nimport logoNationalQuantum from '@assets/national-quantum/logo-national-quantum.png';`);

  return { src: s, changed: true, tokens: Object.keys(C).length, kept: [...new Set(kept)] };
}

// Part files: `${T.green.bg}88` (hex alpha suffix) no longer works on a CSS var.
export function transformParts(src) {
  return src.replace(/\$\{((?:C|STRONG|T)(?:\.[a-zA-Z]+)+)\}([0-9a-fA-F]{2})\b/g, (_, ref, aa) => {
    const pct = Math.round((Number.parseInt(aa, 16) / 255) * 100);
    return `\${mix(${ref}, ${pct}, 'transparent')}`;
  });
}

// ─── 2. Finalize a generated deck (called by build.mjs) ─────────────────────
const literal = (n) => {
  switch (n.type) {
    case 'StringLiteral':
    case 'NumericLiteral':
    case 'BooleanLiteral':
      return n.value;
    case 'NullLiteral':
      return null;
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
export function findDesign(src) {
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
}
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
    const rows = Object.entries(v).map(([k, x]) => `${pad}${/^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`}: ${ser(x, lvl + 1)},`);
    return `{\n${rows.join('\n')}\n${'  '.repeat(lvl)}}`;
  }
  return typeof v === 'string' ? `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'` : String(v);
};

/** Module number → index of its opening page, from the deck's default export. */
export function moduleStarts(text) {
  const m = text.match(/\nexport default \[\n([\s\S]*?)\n\] satisfies Page\[\];/);
  if (!m) return {};
  const names = m[1].split('\n').map((l) => l.trim().replace(/,$/, '')).filter(Boolean);
  const defs = [...text.matchAll(/^const ([A-Za-z_$][\w$]*)(?:: Page)? = /gm)].map((d) => ({ name: d[1], at: d.index }));
  const bodyOf = (name) => {
    const i = defs.findIndex((d) => d.name === name);
    if (i < 0) return '';
    return text.slice(defs[i].at, defs[i + 1]?.at ?? text.length);
  };
  const starts = {};
  const set = (n, i) => {
    if (starts[n] === undefined) starts[n] = i;
  };
  names.forEach((name, i) => {
    const nm = name.match(/^M(\d+)_(?:Section|Divider)$/);
    if (nm) set(nm[1], i);
    const sm = bodyOf(name).slice(0, 600).match(/<Section\b[\s\S]{0,80}?\bn=\{(\d+)\}/);
    if (sm) set(sm[1], i);
  });
  // Fallback: first page framed with mod={n}.
  names.forEach((name, i) => {
    for (const mm of bodyOf(name).matchAll(/\bmod=\{(\d+)\}/g)) {
      if (starts[mm[1]] === undefined) starts[mm[1]] = i;
    }
  });
  return starts;
}

const CLIENT_EXTS = ['png', 'svg', 'jpg', 'jpeg', 'webp'];
export function finalizeDeck(destFile, text) {
  const dir = path.dirname(destFile);
  let out = text;
  if (!out.includes(MARK)) return out; // deck without the shared features (e.g. hand-made)
  const notes = [];

  // Client logo (convention: slides/<id>/assets/logos/logo-client.*)
  const clientFile = CLIENT_EXTS.map((e) => `logo-client.${e}`).find((f) => fs.existsSync(path.join(dir, 'assets', 'logos', f)));
  if (clientFile && out.includes('const CLIENT_LOGO: string | null = null;')) {
    out = out.replace(
      'const CLIENT_LOGO: string | null = null;',
      `import logoClient from './assets/logos/${clientFile}';\nconst CLIENT_LOGO: string | null = logoClient;`,
    );
    notes.push(`client logo ${clientFile}`);
  }

  // Design: kit defaults ← values saved from the Design panel (labels from the kit).
  const kitDesign = findDesign(out);
  if (kitDesign) {
    let d = kitDesign.value;
    if (clientFile) {
      d = { ...d, logos: { client: true, ...(d.logos ?? {}) }, labels: { ...(d.labels ?? {}), 'logos.client': 'Client final' } };
    }
    let saved = null;
    try {
      saved = findDesign(fs.readFileSync(destFile, 'utf8'))?.value ?? null;
    } catch {}
    if (saved) {
      const labels = d.labels;
      d = deepMerge(d, saved);
      if (labels) d.labels = labels;
      if (d.logos && !clientFile) delete d.logos.client;
      notes.push('design kept from the Design panel');
    }
    out = out.slice(0, kitDesign.start) + ser(d) + out.slice(kitDesign.end);
  }

  // MOD_START for the module chips.
  if (out.includes('MOD_START[') && !/\nconst MOD_START\b/.test(out)) {
    const starts = moduleStarts(out);
    const decl = `// Module → index of its opening page (written by scripts/deck-features.mjs).\nconst MOD_START: Record<number, number> = ${JSON.stringify(starts).replace(/"/g, '')};\n\n`;
    out = out.replace(/\nexport default \[\n/, `\n${decl}export default [\n`);
    notes.push(`MOD_START ${JSON.stringify(starts).replace(/"/g, '')}`);
  }
  if (notes.length) console.log(`  deck-features (${path.basename(dir)}): ${notes.join(' · ')}`);
  return out;
}

export function writeDeck(destFile, text) {
  fs.writeFileSync(destFile, finalizeDeck(destFile, text));
}

// ─── CLI ────────────────────────────────────────────────────────────────────
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [cmd, ...args] = process.argv.slice(2);
  const read = (f) => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
  if (cmd === 'kit') {
    for (const f of args) {
      const r = transformKit(read(f), { file: f });
      if (r.changed) fs.writeFileSync(f, r.src);
      console.log(`${f}: ${r.changed ? `${r.tokens} colour tokens${r.kept.length ? ` · kept literal ${r.kept.join(' ')}` : ''}` : 'already done'}`);
    }
  } else if (cmd === 'parts') {
    for (const d of args) {
      for (const f of fs.readdirSync(d).filter((x) => /^\d\d-.*\.tsx$/.test(x))) {
        const p = path.join(d, f);
        const src = read(p);
        const out = transformParts(src);
        if (out !== src) {
          fs.writeFileSync(p, out);
          console.log(`${p}: hex-alpha suffixes → color-mix`);
        }
      }
    }
  } else if (cmd === 'deck') {
    for (const f of args) {
      const src = read(f);
      const r = transformKit(src, { file: f });
      const body = transformParts(r.src);
      writeDeck(f, body);
      console.log(`${f}: ${r.changed ? `${r.tokens} colour tokens` : 'kit already done'}`);
    }
  } else if (cmd === 'check') {
    for (const f of args) console.log(f, moduleStarts(read(f)));
  } else {
    console.log('usage: node scripts/deck-features.mjs kit|parts|deck|check <paths…>');
  }
}
