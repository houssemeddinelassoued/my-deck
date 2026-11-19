// One-shot: derive .cla-build/kit.tsx from .cpd2-build/kit.tsx
// (de-branded, black + red palette on a light ground, GoMyCode × Wevioo logos).
//   node .cla-build/make-kit.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');

// kit.tsx has been edited by hand since (2026-11-15: palette driven by design
// tokens, clickable module chips, selectable footer logos). Re-running this
// would wipe those edits — only with --force, then port them back.
if (!process.argv.includes('--force')) {
  console.error('make-kit: kit.tsx was hand-edited after generation (design tokens, module chips, footer logos).\nRe-run with --force only if you will port those edits back.');
  process.exit(1);
}
let s = fs.readFileSync(path.join(ROOT, '.cpd2-build/kit.tsx'), 'utf8').replace(/\r\n/g, '\n');

const must = (from, to, all = false) => {
  if (!s.includes(from)) throw new Error(`anchor not found: ${from.slice(0, 80)}`);
  s = all ? s.split(from).join(to) : s.replace(from, to);
};

// ── Imports: logos ───────────────────────────────────────────────────────────
must(
  "import formateur from '@assets/houssem-formateur.png';",
  "import formateur from '@assets/houssem-formateur.png';\nimport logoGoMyCode from '@assets/gomycode/logo-gomycode.png';\nimport logoWevioo from './assets/logos/logo-wevioo.png';",
);

// ── Fonts: no script font ────────────────────────────────────────────────────
must('&family=Mr+Dafoe', '');
must("'osd-webfont-copilot-debutant-v2'", "'osd-webfont-claude-ia-avancee-developpeurs'");

// ── Identity ─────────────────────────────────────────────────────────────────
must("const SLIDE_ID = 'copilot-debutant-v2';", "const SLIDE_ID = 'claude-ia-avancee-developpeurs';");
must("const P = 'cpd2';", "const P = 'cla';");
must("const COURSE = 'GitHub Copilot · Débutant';", "const COURSE = 'Claude · IA avancée pour les développeurs';");
must("const PROJECT = 'Parafo';", "const PROJECT = 'Guichet';\nconst REPO = 'guichet-claude';\nconst CLIENT = 'Wevioo';\nconst PROVIDER = 'GoMyCode';");
s = s.replace(
  /\/\/ Module numbers:[\s\S]*?\n};\n/,
  `// Module numbers: 0 = ouverture, 1–3 = Jour 1, 10 = reprise Jour 2, 4–6 = Jour 2, 12 = clôture, 13 = bonus.
const MOD_TITLES: Record<number, string> = {
  1: 'Au-delà des bases',
  2: 'Prompt engineering avancé',
  3: 'Harness engineering',
  4: 'API, tool use et automatisation',
  5: 'Agents et Claude Code',
  6: 'Défi final',
  10: 'Jour 2 · Reprise',
  12: 'Synthèse & clôture',
  13: 'Bonus · Docker et bac à sable',
};
`,
);

// ── Palette: black + red on a light ground ───────────────────────────────────
must('// ─── Palette (Docaposte: navy + electric blue, violet accent, light ground) ─', '// ─── Palette (black + GoMyCode red, light ground) ───────────────────────────');
const MAP = [
  // neutrals
  ['#F6F8FC', '#F7F7F8'], ['#101828', '#141418'], ['#3B4558', '#3D3D47'], ['#6B7690', '#6E6E7A'],
  ['#A9B3C6', '#B0B0BA'], ['#DDE3EE', '#E3E3E8'], ['#EBEFF7', '#EFEFF2'], ['#F7FAFC', '#F8F8F9'],
  ['#CDD4E0', '#D2D2D9'], ['#EEF1F6', '#F0F0F2'],
  // navy → black
  ['#0B1F5C', '#18181D'], ['#142C7A', '#2E2E36'], ['#E7EBF5', '#ECECEF'], ['#9EABCF', '#B5B5BF'], ['#AEB9E6', '#C9C9D2'],
  // blue / electric → red
  ['#1E22E8', '#E31E26'], ['#0A62D0', '#C4161C'], ['#E6F0FC', '#FDECEC'], ['#97BFF0', '#F2A5A8'], ['#0A55B5', '#B3121A'], ['#DCE3FB', '#F9D9DA'],
  // violet / plum / pink → bordeaux / rose
  ['#7442E0', '#8E1B2E'], ['#7A2FA6', '#6E1022'], ['#C2369E', '#E0566A'],
  ['#EFE9FC', '#F7E8EB'], ['#BFA8F2', '#DDA1AD'], ['#5A2FC2', '#8E1B2E'],
  ['#FBE8F5', '#FCEBEE'], ['#E9A6D5', '#EEA9B6'], ['#9C2380', '#B42343'],
  // coral (risk) → burnt orange, so that « risk » never reads as the brand red
  ['#E04848', '#D9480F'], ['#FDE8E8', '#FDEDE3'], ['#F0A3A3', '#F4B48E'], ['#B42F2F', '#A93A06'],
  // code panel
  ['#0F1530', '#17171C'], ['#18204A', '#25252C'], ['#7C86A8', '#8A8A98'], ['#E6EAF6', '#ECECF1'],
];
for (const [a, b2] of MAP) s = s.replace(new RegExp(a, 'gi'), b2);
s = s
  .replace(/rgba\(11, ?31, ?92,/g, 'rgba(20,20,24,')
  .replace(/rgba\(16, ?24, ?40,/g, 'rgba(20,20,24,')
  .replace(/rgba\(30, ?34, ?232,/g, 'rgba(227,30,38,')
  .replace(/rgba\(116, ?66, ?224,/g, 'rgba(142,27,46,')
  .replace(/rgba\(10, ?98, ?208,/g, 'rgba(196,22,28,');

// ── Brand motif: neutral « drop » mark + partner logos ───────────────────────
const brandStart = s.indexOf('// ─── Brand motif: Docaposte');
const brandEnd = s.indexOf('// Navy rounded slab (cover / section pages).');
if (brandStart < 0 || brandEnd < 0) throw new Error('brand block not found');
s =
  s.slice(0, brandStart) +
  `// ─── Brand motif: red « drop » mark, black slabs, outlined frames ──────────
// A rounded square with one sharp corner (echoes the red O of the provider
// logo without copying it). Used as bullet / header ornament.
const Mark = ({ h = 22, color = C.electric, cls, style }: { h?: number; color?: string; cls?: string; style?: CSSProperties }) => (
  <span
    aria-hidden
    className={cls}
    style={{ display: 'block', flex: 'none', width: h, height: h, borderRadius: \`\${h / 2}px \${h / 2}px \${h / 2}px \${h * 0.12}px\`, background: color, transform: 'rotate(45deg) scale(.82)', ...style }}
  />
);

// Partner logos (both PNGs have a white ground: always shown on a white plate).
const LogoImg = ({ src, alt, h }: { src: string; alt: string; h: number }) => (
  <img src={src} alt={alt} style={{ display: 'block', height: h, width: 'auto', flex: 'none' }} />
);
const LogoPlate = ({ which = 'both', h = 56, pad = 18, cls, style }: { which?: 'both' | 'provider' | 'client'; h?: number; pad?: number; cls?: string; style?: CSSProperties }) => (
  <div
    className={cls}
    style={{ display: 'inline-flex', alignItems: 'center', gap: pad * 1.4, padding: \`\${pad * 0.7}px \${pad * 1.3}px\`, background: '#fff', borderRadius: 18, boxShadow: SHADOW_SM, ...style }}
  >
    {which !== 'client' ? <LogoImg src={logoGoMyCode} alt={PROVIDER} h={h * 0.62} /> : null}
    {which === 'both' ? <span style={{ width: 2, alignSelf: 'stretch', background: C.rule, margin: \`\${pad * 0.3}px 0\` }} /> : null}
    {which !== 'provider' ? <LogoImg src={logoWevioo} alt={CLIENT} h={h * 1.25} /> : null}
  </div>
);

` +
  s.slice(brandEnd);
must('// Navy rounded slab (cover / section pages).', '// Black rounded slab (cover / section pages).');
must('const MiniMark = ({ size = 22 }: { size?: number }) => <DapMark h={Math.round(size * 0.62)} color={C.electric} />;', 'const MiniMark = ({ size = 22 }: { size?: number }) => <Mark h={Math.round(size * 0.78)} color={C.electric} />;');

// ── Progress: J1 = M1–M3, J2 = M4–M6 ─────────────────────────────────────────
must('const order = [0, 1, 2, 3, 4, 10, 5, 6, 7, 8, 9, 12];', 'const order = [0, 1, 2, 3, 10, 4, 5, 6, 12, 13];');
s = s.replace(
  /\/\/ Matinée M1–M3 · après-midi M4–M6\.\nconst Progress = [\s\S]*?\n\);\n/,
  `// Jour 1 : M1–M3 · Jour 2 : M4–M6.
const Progress = ({ mod }: { mod: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
    <ProgLabel>JOUR 1</ProgLabel>
    <ProgSq n={1} mod={mod} />
    <ProgSq n={2} mod={mod} />
    <ProgSq n={3} mod={mod} />
    <ProgLabel>JOUR 2</ProgLabel>
    <ProgSq n={4} mod={mod} />
    <ProgSq n={5} mod={mod} />
    <ProgSq n={6} mod={mod} />
  </div>
);
`,
);
must('(mod >= 1 && mod <= 9', '(mod >= 1 && mod <= 6');

// ── Footer: provider logo instead of the old lockup ──────────────────────────
must('        <DapLogo size={19} />', '        <LogoImg src={logoGoMyCode} alt={PROVIDER} h={22} />');

// ── Section divider: day label + logo plate ──────────────────────────────────
must("{num <= 4 ? 'MODULE · JOUR 1' : 'MODULE · JOUR 2'}", "{n === 13 ? 'HORS PROGRAMME' : num <= 3 ? 'MODULE · JOUR 1' : 'MODULE · JOUR 2'}");
must('{pad(num)}', "{n === 13 ? '+' : pad(num)}");
must('        <DapLogo size={24} color="#FFFFFF" />', '        <LogoPlate which="provider" h={50} pad={14} />');
must('// ─── Formateur portrait (rounded photo + offset outline, Docaposte style) ───', '// ─── Formateur portrait (rounded photo + offset outline) ────────────────────');

// ── Lab page footer line ─────────────────────────────────────────────────────
s = s.replace(
  /Fil rouge <strong style=\{\{ color: C\.navy \}\}>\{PROJECT\}<\/strong> · dépôt <span style=\{\{ fontFamily: mono, color: C\.electric \}\}>parafo-copilot<\/span> · [^\n]*/,
  'Fil rouge <strong style={{ color: C.navy }}>{PROJECT}</strong> · dépôt <span style={{ fontFamily: mono, color: C.electric }}>{REPO}</span> · TypeScript · Python · Java · .NET · Claude Code',
);

// ── Lab challenges for this course ───────────────────────────────────────────
s = s.replace(
  /const DEFIS = \{[\s\S]*?\n\};\n/,
  `const DEFIS = {
  prompt: { label: 'Prompt mesuré', icon: 'note' as IconName, tone: 'blue' as Tone, aide: 'Une version à la fois, les mêmes tests à chaque fois : seul l’écart mesuré compte.' },
  harnais: { label: 'Harnais', icon: 'shield' as IconName, tone: 'navy' as Tone, aide: 'Ce qui doit être vrai se vérifie par du code, pas par une promesse dans le prompt.' },
  eval: { label: 'Évaluation', icon: 'gauge' as IconName, tone: 'violet' as Tone, aide: 'Mêmes cas, même grille : on compare des chiffres, pas des impressions.' },
  api: { label: 'API & outils', icon: 'plug' as IconName, tone: 'teal' as Tone, aide: 'Le modèle propose, votre code dispose : chaque appel d’outil est exécuté et vérifié par vous.' },
  agent: { label: 'Environnement agentique', icon: 'bot' as IconName, tone: 'violet' as Tone, aide: 'Vous cadrez, l’agent exécute : ce qui est obligatoire passe par un hook, pas par une phrase.' },
  livrer: { label: 'Livraison autonome', icon: 'flag' as IconName, tone: 'navy' as Tone, aide: 'Une fonctionnalité complète : plan, code, garde-fous déclenchés, tests verts, relecture.' },
};
`,
);

// ── Misc comments / leftovers ────────────────────────────────────────────────
s = s.replace(/Docaposte/g, 'deck');
if (/DapLogo|DapMark|Dafoe|Together we grow/.test(s)) throw new Error('brand leftovers');

fs.writeFileSync(path.join(ROOT, '.cla-build/kit.tsx'), s);
console.log('kit.tsx written:', s.split('\n').length, 'lines');
