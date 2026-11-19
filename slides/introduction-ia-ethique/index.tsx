import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  type SlideTransition,
  Step,
  Steps,
  useIsActivePage,
  useSlidePageNumber,
} from '@open-slide/core';
import {
  Children,
  type CSSProperties,
  cloneElement,
  createContext,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import formateur from '@assets/houssem-formateur.png';
import logoNationalQuantum from '@assets/national-quantum/logo-national-quantum.png';
import logoStack from '@assets/technologia/logo-stack.png';
import logoWide from '@assets/technologia/logo-horizontal.png';
import clientLogo_apsm from './assets/logos/client-apsm.png';
import clientGuide_apsm from './assets/guide-apsm.pdf?url';
import clientLogo_sobeys from './assets/logos/client-sobeys.png';
import clientGuide_sobeys from './assets/guide-sobeys.pdf?url';
import lgChatgpt from './assets/logos/chatgpt.svg';
import lgClaude from './assets/logos/claude.svg';
import lgCopilot from './assets/logos/copilot.svg';
import lgExcel from './assets/logos/excel.svg';
import lgGemini from './assets/logos/gemini.svg';
import lgOutlook from './assets/logos/outlook.svg';
import lgTeams from './assets/logos/teams.svg';
import lgWord from './assets/logos/word.svg';
import phAchat from './assets/photos/achat-en-ligne.jpg';
import phAirCanada from './assets/photos/air-canada.jpg';
import phBerlaymont from './assets/photos/berlaymont.jpg';
import phBinnenhof from './assets/photos/binnenhof.jpg';
import phDatacenter from './assets/photos/datacenter.jpg';
import phDeepBlue from './assets/photos/deep-blue.jpg';
import phEntrevue from './assets/photos/entrevue.jpg';
import phFondOeil from './assets/photos/fond-oeil.jpg';
import phHinton from './assets/photos/hinton.jpg';
import phLeeSedol from '@assets/ai-history/leesedol.jpg';
import phMcCarthy from './assets/photos/mccarthy.jpg';
import phMontreal from './assets/photos/montreal.jpg';
import phPaiement from './assets/photos/paiement.jpg';
import phParlement from './assets/photos/parlement-quebec.jpg';
import phProteine from './assets/photos/proteine.jpg';
import phRadiologie from './assets/photos/radiologie.jpg';
import phTimesSquare from './assets/photos/times-square.jpg';
import phTroisRivieres from './assets/photos/trois-rivieres.jpg';
import phTuring from '@assets/ai-history/turing.jpg';
import phCamionMine from './assets/photos/camion-mine.jpg';
import phCamerasMagasin from './assets/photos/cameras-magasin.jpg';

export const design: DesignSystem = {
  palette: {
    bg: '#F4F7F9',
    text: '#2B2F33',
    accent: '#1F78C1',
    soft: '#4B545B',
    muted: '#77818A',
    faint: '#AFB8C0',
    rule: '#DCE3E8',
    panel: '#EAF0F4',
    card: '#FFFFFF',
    teal: '#22A6B3',
    green: '#3A9F45',
    yellow: '#FFD000',
    amber: '#E8A600',
    coral: '#E0573D',
    violet: '#6B57C9',
  },
  logos: {
    finalClient: true,
    provider: true,
    nationalQuantum: false,
  },
  labels: {
    soft: 'Texte doux',
    muted: 'Texte discret',
    faint: 'Texte estompé',
    rule: 'Filets',
    panel: 'Panneaux',
    card: 'Cartes',
    teal: 'Sarcelle (info)',
    green: 'Vert (succès)',
    yellow: 'Jaune (attention)',
    amber: 'Ambre',
    coral: 'Corail (alerte)',
    violet: 'Violet',
    'logos.finalClient': 'Client final (APSM / Sobeys)',
    'logos.provider': 'Technologia · mon client',
    'logos.nationalQuantum': 'National Quantum',
  },
  fonts: {
    display: '"Barlow Condensed", "Arial Narrow", "Segoe UI", sans-serif',
    body: '"Barlow", "Segoe UI", system-ui, -apple-system, sans-serif',
  },
  typeScale: {
    hero: 128,
    body: 30,
  },
  radius: 18,
};

// ─── Webfonts (module-level, slide-keyed) ───────────────────────────────────
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Barlow+Condensed:wght@500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap';
const FONT_LINK_ID = 'osd-webfont-introduction-ia-ethique';
if (typeof document !== 'undefined') {
  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.href !== FONT_HREF) link.href = FONT_HREF;
}

// ─── One press = one step ───────────────────────────────────────────────────
// Holding an arrow key or a presenter-remote button makes the OS auto-repeat
// keydown (and some remotes fire a burst of presses), which the player turns
// into several reveals in a row. This capture-phase guard runs before the
// player's own listener and lets exactly one press through per hold, with a
// short cooldown. Installed once per window by whichever deck loads first —
// keep this block identical in every deck.
if (typeof window !== 'undefined') {
  const w = window as Window & { __osdOnePressGuard?: boolean };
  if (!w.__osdOnePressGuard) {
    w.__osdOnePressGuard = true;
    const NAV_KEYS = new Set(['ArrowRight', 'ArrowDown', ' ', 'PageDown', 'ArrowLeft', 'ArrowUp', 'PageUp']);
    const COOLDOWN_MS = 350;
    const held = new Set<string>();
    let last = Number.NEGATIVE_INFINITY;
    const isTyping = (t: EventTarget | null) =>
      t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
    window.addEventListener(
      'keydown',
      (e) => {
        if (!NAV_KEYS.has(e.key) || isTyping(e.target)) return;
        const k = e.code || e.key;
        const now = performance.now();
        if (e.repeat || held.has(k) || now - last < COOLDOWN_MS) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }
        held.add(k);
        last = now;
      },
      true,
    );
    window.addEventListener('keyup', (e) => held.delete(e.code || e.key), true);
    window.addEventListener('blur', () => held.clear());
  }
}

// ─── Deck identity ──────────────────────────────────────────────────────────
const SLIDE_ID = 'introduction-ia-ethique';
const P = 'eth'; // CSS class prefix, unique per deck
const DAY: number = 1;
// Combined 2-day deck: pages after DAY_SPLIT belong to day 2 (0 = single-day deck).
const DAY_SPLIT: number = 0;
const useDay = (): number => {
  const { current } = useSlidePageNumber();
  return DAY_SPLIT > 0 && current > DAY_SPLIT ? 2 : DAY;
};
const COURSE = 'Introduction à l’IA et à l’éthique';
const CODE = 'IA114';
const AUTHOR = 'Houssem Eddine Lassoued';

const MOD_TITLES: Record<number, string> = {
  1: 'Qu’est-ce que l’IA ?',
  2: 'Applications concrètes',
  3: 'Atelier 1 · Explorer des outils IA',
  4: 'Les grands enjeux éthiques',
  5: 'Loi 25 et IA responsable',
  6: 'Atelier 2 · Étude de cas éthique',
  7: 'Vers une gouvernance de l’IA',
  8: 'Atelier 3 · Mini-charte éthique',
};
// Module 0 = ouverture / réactivation, module 9 = clôture.
const LAST_MOD = 8;

// ─── Palette (Technologia: anthracite + blue/teal, green, yellow squares) ───
// @@deck-features v1 — palette driven by the design tokens (Design panel, key D).
// tv('blue', '#0A62D0') → var(--osd-blue, #0A62D0); tints and gradients use
// color-mix, so changing one token recolours its whole family.
const tv = (key: string, fallback: string) =>
  `var(--osd-${key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}, ${fallback})`;
const mix = (c: string, pct: number, other = 'white') => `color-mix(in srgb, ${c} ${pct}%, ${other})`;

const C = {
  ink: tv('text', '#2B2F33'),
  soft: tv('soft', '#4B545B'),
  muted: tv('muted', '#77818A'),
  faint: tv('faint', '#AFB8C0'),
  rule: tv('rule', '#DCE3E8'),
  panel: tv('panel', '#EAF0F4'),
  card: tv('card', '#FFFFFF'),
  blue: tv('accent', '#1F78C1'),
  teal: tv('teal', '#22A6B3'),
  green: tv('green', '#3A9F45'),
  yellow: tv('yellow', '#FFD000'),
  amber: tv('amber', '#E8A600'),
  coral: tv('coral', '#E0573D'),
  violet: tv('violet', '#6B57C9'),
};

const T = {
  blue: { bg: mix(C.blue, 12), bd: mix(C.blue, 47), fg: mix(C.blue, 84, 'black') },
  teal: { bg: mix(C.teal, 14), bd: mix(C.teal, 54), fg: mix(C.teal, 75, 'black') },
  green: { bg: mix(C.green, 14), bd: mix(C.green, 55), fg: mix(C.green, 76, 'black') },
  yellow: { bg: mix(C.yellow, 20), bd: mix(C.amber, 71), fg: mix(C.yellow, 48, 'black') },
  coral: { bg: mix(C.coral, 15), bd: mix(C.coral, 55), fg: mix(C.coral, 79, 'black') },
  violet: { bg: mix(C.violet, 13), bd: mix(C.violet, 50), fg: mix(C.violet, 82, 'black') },
  grey: { bg: mix(C.muted, 11), bd: mix(C.muted, 35), fg: C.soft },
};
type Tone = keyof typeof T;

// Saturated version of each tone (bars, markers, filled buttons).
const STRONG: Record<Tone, string> = {
  blue: C.blue,
  teal: C.teal,
  green: C.green,
  yellow: C.yellow,
  coral: C.coral,
  violet: C.violet,
  grey: C.faint,
};

const G = {
  blue: `linear-gradient(135deg, ${mix(C.blue, 98)} 0%, #3D9FCB 55%, ${mix(C.teal, 65)} 100%)`,
  green: `linear-gradient(135deg, #0F9A4A 0%, ${mix(C.green, 97)} 60%, #7DB83A 100%)`,
  yellow: `linear-gradient(135deg, ${mix(C.yellow, 70)} 0%, ${C.yellow} 55%, ${mix(C.yellow, 92, 'black')} 100%)`,
};

const display = 'var(--osd-font-display)';
const body = 'var(--osd-font-body)';
const mono = '"JetBrains Mono", ui-monospace, Consolas, monospace';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
const EASE_BACK = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

const SHADOW = '0 0 0 1px rgba(43, 47, 51, 0.06), 0 18px 40px -26px rgba(20, 60, 100, 0.40)';
const SHADOW_SM = '0 0 0 1px rgba(43, 47, 51, 0.07), 0 8px 20px -14px rgba(20, 60, 100, 0.45)';

// ─── Small helpers ──────────────────────────────────────────────────────────
// CSS custom properties as inline style (React's CSSProperties has no index signature).
const vars = (o: Record<string, string | number>): CSSProperties => {
  const out: Record<string, string | number> = {};
  for (const k of Object.keys(o)) out[`--${k}`] = o[k];
  return out as CSSProperties;
};
// Animation delay for entrance/beat classes.
const dl = (ms: number): CSSProperties => vars({ d: `${ms}ms` });
const cx = (...xs: (string | false | null | undefined)[]) => xs.filter(Boolean).join(' ');
const pad = (n: number) => String(n).padStart(2, '0');
// French number formatting: decimal comma, non-breaking thousands.
const fr = (x: number, digits = 0) => {
  const [i, d] = Math.abs(x).toFixed(digits).split('.');
  const s = i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (d ? `,${d}` : '');
  return x < 0 ? `−${s}` : s;
};

// ─── Stylesheet (collected from every page, injected once at the bottom) ────
const CSS: string[] = [];
const k = (name: string) => `${P}-${name}`;
// Selector matching the page once its n-th click ("beat") has been revealed.
const at = (n: number) => `.${P}-page:has([data-osd-step="revealed"] > .${P}-k${n})`;

// Entrance animations — play each time the page becomes the active page.
const A = {
  in: k('in'),
  fade: k('in-fade'),
  pop: k('in-pop'),
  left: k('in-left'),
  right: k('in-right'),
  down: k('in-down'),
  grow: k('in-grow'),
  growY: k('in-growy'),
  draw: k('in-draw'),
  dot: k('in-dot'),
  // Loops (only run on the active page).
  pulse: k('pulse'),
  march: k('march'),
  float: k('float'),
  spin: k('spin'),
  spinBack: k('spin-back'),
  blink: k('blink'),
  glow: k('glow'),
};

// Beat-driven states — the element changes when the n-th → press is revealed.
const b = {
  on: (n: number) => k(`on${n}`), // rises in
  fade: (n: number) => k(`fd${n}`), // fades in
  pop: (n: number) => k(`pp${n}`), // pops in (scale)
  left: (n: number) => k(`lf${n}`), // slides in from the left
  draw: (n: number) => k(`dr${n}`), // SVG stroke draws (path needs pathLength={1})
  grow: (n: number) => k(`gr${n}`), // scaleX 0 → 1 (bars)
  growY: (n: number) => k(`gy${n}`), // scaleY 0 → 1 (columns)
  dim: (n: number) => k(`dm${n}`), // fades back to 28 %
  off: (n: number) => k(`of${n}`), // disappears
  hi: (n: number) => k(`hi${n}`), // highlight ring + lift
};

CSS.push(`
@keyframes ${P}-rise{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
@keyframes ${P}-fade{from{opacity:0}to{opacity:1}}
@keyframes ${P}-left{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:none}}
@keyframes ${P}-right{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:none}}
@keyframes ${P}-down{from{opacity:0;transform:translateY(-22px)}to{opacity:1;transform:none}}
@keyframes ${P}-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes ${P}-growy{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes ${P}-draw{from{stroke-dashoffset:1.01}to{stroke-dashoffset:0}}
@keyframes ${P}-pop{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes ${P}-dot{0%{opacity:0;transform:scale(0)}60%{opacity:1;transform:scale(1.25)}100%{opacity:1;transform:scale(1)}}
@keyframes ${P}-pulse{0%{opacity:.7;transform:scale(1)}100%{opacity:0;transform:scale(2.4)}}
@keyframes ${P}-march{to{stroke-dashoffset:-24}}
@keyframes ${P}-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes ${P}-spin{to{transform:rotate(360deg)}}
@keyframes ${P}-spin-back{to{transform:rotate(-360deg)}}
@keyframes ${P}-blink{0%,100%{opacity:1}50%{opacity:.25}}
@keyframes ${P}-glow{0%,100%{box-shadow:0 0 0 0 rgba(31,120,193,0)}50%{box-shadow:0 0 0 12px rgba(31,120,193,.16)}}
@keyframes ${P}-sqa{from{opacity:0;transform:translate(-46px,-46px)}to{opacity:1;transform:none}}
@keyframes ${P}-sqb{from{opacity:0;transform:translate(46px,46px)}to{opacity:1;transform:none}}
.${P}-live .${P}-in{animation:${P}-rise 800ms ${EASE} var(--d,0ms) both}
.${P}-live .${P}-in-fade{animation:${P}-fade 900ms ${EASE} var(--d,0ms) both}
.${P}-live .${P}-in-left{animation:${P}-left 800ms ${EASE} var(--d,0ms) both}
.${P}-live .${P}-in-right{animation:${P}-right 800ms ${EASE} var(--d,0ms) both}
.${P}-live .${P}-in-down{animation:${P}-down 800ms ${EASE} var(--d,0ms) both}
.${P}-in-grow{transform-origin:left center}
.${P}-live .${P}-in-grow{animation:${P}-grow 1000ms ${EASE} var(--d,0ms) both}
.${P}-in-growy{transform-origin:center bottom;transform-box:fill-box}
.${P}-live .${P}-in-growy{animation:${P}-growy 1000ms ${EASE} var(--d,0ms) both}
.${P}-live .${P}-in-pop{animation:${P}-pop 700ms ${EASE} var(--d,0ms) both}
.${P}-in-dot{transform-box:fill-box;transform-origin:center}
.${P}-live .${P}-in-dot{animation:${P}-dot 600ms ${EASE} var(--d,0ms) both}
.${P}-in-draw{stroke-dasharray:1 2}
.${P}-live .${P}-in-draw{animation:${P}-draw 1400ms ${EASE} var(--d,0ms) both}
.${P}-pulse{transform-box:fill-box;transform-origin:center;opacity:0}
.${P}-live .${P}-pulse{animation:${P}-pulse 2s ${EASE_OUT} var(--d,0ms) infinite}
.${P}-live .${P}-march{animation:${P}-march 1.2s linear infinite}
.${P}-live .${P}-float{animation:${P}-float 4s ease-in-out var(--d,0ms) infinite}
.${P}-spin,.${P}-spin-back{transform-box:fill-box;transform-origin:center}
.${P}-live .${P}-spin{animation:${P}-spin 40s linear infinite}
.${P}-live .${P}-spin-back{animation:${P}-spin-back 40s linear infinite}
.${P}-live .${P}-blink{animation:${P}-blink 1.4s ease-in-out infinite}
.${P}-live .${P}-glow{animation:${P}-glow 2.4s ease-in-out infinite}
.${P}-live .${P}-sqa{animation:${P}-sqa 1100ms ${EASE} var(--d,0ms) both}
.${P}-live .${P}-sqb{animation:${P}-sqb 1100ms ${EASE} var(--d,0ms) both}
.${P}-live .${P}-sqc{animation:${P}-pop 800ms ${EASE} calc(var(--d,0ms) + 700ms) both}
`);

for (let n = 1; n <= 12; n++) {
  const has = at(n);
  CSS.push(`
.${P}-on${n}{opacity:0;transform:translateY(16px);transition:opacity 500ms ${EASE} var(--d,0ms),transform 700ms ${EASE} var(--d,0ms)}
${has} .${P}-on${n}{opacity:1;transform:none}
.${P}-fd${n}{opacity:0;transition:opacity 550ms ${EASE} var(--d,0ms)}
${has} .${P}-fd${n}{opacity:1}
.${P}-pp${n}{opacity:0;transform:scale(.5);transform-box:fill-box;transform-origin:var(--o,center);transition:opacity 300ms ${EASE} var(--d,0ms),transform 650ms ${EASE_BACK} var(--d,0ms)}
${has} .${P}-pp${n}{opacity:1;transform:none}
.${P}-lf${n}{opacity:0;transform:translateX(-30px);transition:opacity 500ms ${EASE} var(--d,0ms),transform 700ms ${EASE} var(--d,0ms)}
${has} .${P}-lf${n}{opacity:1;transform:none}
.${P}-dr${n}{stroke-dasharray:1 2;stroke-dashoffset:1.01;transition:stroke-dashoffset 1000ms ${EASE} var(--d,0ms)}
${has} .${P}-dr${n}{stroke-dashoffset:0}
.${P}-gr${n}{transform:scaleX(0);transform-origin:left center;transition:transform 900ms ${EASE} var(--d,0ms)}
${has} .${P}-gr${n}{transform:none}
.${P}-gy${n}{transform:scaleY(0);transform-origin:center bottom;transform-box:fill-box;transition:transform 900ms ${EASE} var(--d,0ms)}
${has} .${P}-gy${n}{transform:none}
.${P}-dm${n}{transition:opacity 500ms ${EASE},filter 500ms ${EASE}}
${has} .${P}-dm${n}{opacity:.28;filter:grayscale(.7)}
.${P}-of${n}{transition:opacity 400ms ${EASE} var(--d,0ms)}
${has} .${P}-of${n}{opacity:0}
.${P}-hi${n}{transition:box-shadow 500ms ${EASE},transform 500ms ${EASE}}
${has} .${P}-hi${n}{box-shadow:0 0 0 4px ${C.blue},0 22px 44px -22px rgba(31,120,193,.6) !important;transform:translateY(-4px)}
${has} .${P}-hsb${n} + .${P}-hs-tip{opacity:1;transform:none}
${has} .${P}-fl${n}:not(.${P}-unflipped) > .${P}-flip-in{transform:rotateY(180deg)}
`);
}

// ─── Icons (24 × 24, stroke-based) ──────────────────────────────────────────
const dotFill = { fill: 'currentColor', stroke: 'none' } as const;
const ICONS = {
  user: (
    <>
      <circle cx={12} cy={8} r={4} />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </>
  ),
  users: (
    <>
      <circle cx={9} cy={8} r={3.5} />
      <path d="M2 20c0-3.6 3-6 7-6s7 2.4 7 6" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8" />
      <path d="M18 14.2c2.4.7 4 2.6 4 5.8" />
    </>
  ),
  bot: (
    <>
      <rect x={4} y={8} width={16} height={12} rx={3} />
      <path d="M12 8V4.5" />
      <circle cx={12} cy={3.5} r={1.2} />
      <circle cx={9} cy={14} r={1.3} {...dotFill} />
      <circle cx={15} cy={14} r={1.3} {...dotFill} />
      <path d="M2 12.5v3M22 12.5v3" />
    </>
  ),
  brain: (
    <>
      <path d="M9.5 4A3 3 0 0 0 6.6 6.3 3 3 0 0 0 4.3 11a3 3 0 0 0 1.4 4.7A3 3 0 0 0 9 20a2.4 2.4 0 0 0 3-.8V5.3A2.4 2.4 0 0 0 9.5 4z" />
      <path d="M14.5 4a3 3 0 0 1 2.9 2.3 3 3 0 0 1 2.3 4.7 3 3 0 0 1-1.4 4.7A3 3 0 0 1 15 20a2.4 2.4 0 0 1-3-.8" />
    </>
  ),
  tool: (
    <path d="M14.6 6.4a4.2 4.2 0 0 0-5.3 5.3L3.5 17.5a1.8 1.8 0 0 0 2.6 2.6l5.8-5.8a4.2 4.2 0 0 0 5.3-5.3l-2.7 2.7-2.6-.6-.6-2.6z" />
  ),
  database: (
    <>
      <ellipse cx={12} cy={5} rx={8} ry={3} />
      <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </>
  ),
  doc: (
    <>
      <path d="M6 2.5h8l5 5V21.5H6z" />
      <path d="M14 2.5v5h5" />
      <path d="M9 13h7M9 17h7" />
    </>
  ),
  mail: (
    <>
      <rect x={3} y={5} width={18} height={14} rx={2} />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </>
  ),
  calendar: (
    <>
      <rect x={3} y={5} width={18} height={16} rx={2} />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  search: (
    <>
      <circle cx={11} cy={11} r={7} />
      <path d="M20.5 20.5l-4.5-4.5" />
    </>
  ),
  chat: <path d="M4 4.5h16v11.5H10l-6 4.5z" />,
  gear: (
    <>
      <circle cx={12} cy={12} r={3.2} />
      <circle cx={12} cy={12} r={7} />
      <path d="M12 1.5V5M12 19v3.5M1.5 12H5M19 12h3.5M4.6 4.6l2.4 2.4M17 17l2.4 2.4M4.6 19.4L7 17M17 7l2.4-2.4" />
    </>
  ),
  shield: <path d="M12 2.5l8 3v6c0 5-3.4 8.8-8 10.5-4.6-1.7-8-5.5-8-10.5v-6z" />,
  shieldCheck: (
    <>
      <path d="M12 2.5l8 3v6c0 5-3.4 8.8-8 10.5-4.6-1.7-8-5.5-8-10.5v-6z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </>
  ),
  lock: (
    <>
      <rect x={5} y={11} width={14} height={10} rx={2} />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
    </>
  ),
  key: (
    <>
      <circle cx={8} cy={15} r={4.5} />
      <path d="M11.2 11.8L20 3M16.5 6.5l3 3M14.5 8.5l2 2" />
    </>
  ),
  cloud: <path d="M7 19h10.5a4.5 4.5 0 0 0 .6-9A6.5 6.5 0 0 0 5.6 11.6 3.8 3.8 0 0 0 7 19z" />,
  chart: (
    <>
      <path d="M4 3.5V20h16.5" />
      <path d="M8.5 16v-4M12.5 16V8M16.5 16v-6" />
    </>
  ),
  trend: (
    <>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </>
  ),
  target: (
    <>
      <circle cx={12} cy={12} r={9} />
      <circle cx={12} cy={12} r={5} />
      <circle cx={12} cy={12} r={1.6} {...dotFill} />
    </>
  ),
  bolt: <path d="M13 2.5L4.5 14H11l-1 7.5L18.5 10H12z" />,
  clock: (
    <>
      <circle cx={12} cy={12} r={9} />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  x: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  alert: (
    <>
      <path d="M12 3.5l9.5 17h-19z" />
      <path d="M12 10v4.5" />
      <circle cx={12} cy={17.6} r={1} {...dotFill} />
    </>
  ),
  bulb: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.8 10.6c.6.6.8 1.3.8 2.4h6c0-1.1.2-1.8.8-2.4A6 6 0 0 0 12 3z" />
    </>
  ),
  flag: <path d="M5.5 21V4M5.5 4.5h11l-2.2 4 2.2 4h-11" />,
  layers: (
    <>
      <path d="M12 3l9 5-9 5-9-5z" />
      <path d="M3 13l9 5 9-5" />
    </>
  ),
  link: (
    <>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </>
  ),
  plug: (
    <>
      <path d="M9 2.5V7M15 2.5V7" />
      <path d="M6 7h12v4a6 6 0 0 1-12 0z" />
      <path d="M12 17v4.5" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7S2 12 2 12z" />
      <circle cx={12} cy={12} r={3} />
    </>
  ),
  loop: (
    <>
      <path d="M20 11a8 8 0 0 0-14.3-4.9L3.5 8.5" />
      <path d="M3.5 3.5v5h5" />
      <path d="M4 13a8 8 0 0 0 14.3 4.9l2.2-2.4" />
      <path d="M20.5 20.5v-5h-5" />
    </>
  ),
  rocket: (
    <>
      <path d="M9.5 14.5l-2-2C8.7 7.6 12.4 3.7 20.5 3.5c-.2 8.1-4.1 11.8-9 13z" />
      <path d="M7.5 12.5l-3.5.5 2.5-4h4M11.5 16.5l-.5 3.5 4-2.5v-4" />
      <path d="M6 18l-2.5 2.5" />
      <circle cx={15} cy={9} r={1.6} />
    </>
  ),
  money: (
    <>
      <circle cx={12} cy={12} r={9} />
      <path d="M15 9.2c-.5-1-1.6-1.6-3-1.6-1.7 0-3 .9-3 2.2 0 3 6 1.6 6 4.6 0 1.3-1.3 2.2-3 2.2-1.4 0-2.5-.6-3-1.6M12 6v1.6M12 16.4V18" />
    </>
  ),
  ticket: (
    <>
      <path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z" />
      <path d="M14.5 7.5v1.5M14.5 11.25v1.5M14.5 15v1.5" />
    </>
  ),
  book: (
    <>
      <path d="M2.5 5h6a3.5 3.5 0 0 1 3.5 3.5V20a2.5 2.5 0 0 0-2.5-2.5h-7z" />
      <path d="M21.5 5h-6A3.5 3.5 0 0 0 12 8.5V20a2.5 2.5 0 0 1 2.5-2.5h7z" />
    </>
  ),
  server: (
    <>
      <rect x={3} y={3.5} width={18} height={7} rx={1.6} />
      <rect x={3} y={13.5} width={18} height={7} rx={1.6} />
      <circle cx={7} cy={7} r={1.1} {...dotFill} />
      <circle cx={7} cy={17} r={1.1} {...dotFill} />
    </>
  ),
  cpu: (
    <>
      <rect x={5} y={5} width={14} height={14} rx={2} />
      <rect x={9} y={9} width={6} height={6} rx={1} />
      <path d="M9 1.5V5M15 1.5V5M9 19v3.5M15 19v3.5M1.5 9H5M1.5 15H5M19 9h3.5M19 15h3.5" />
    </>
  ),
  humanCheck: (
    <>
      <circle cx={10} cy={8} r={4} />
      <path d="M3 21c0-4 3-6.6 7-6.6 1.3 0 2.5.3 3.5.8" />
      <path d="M15 18.5l2 2 4.5-4.5" />
    </>
  ),
  route: (
    <>
      <circle cx={6} cy={19} r={2.5} />
      <circle cx={18} cy={5} r={2.5} />
      <path d="M8.5 19H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.5" />
    </>
  ),
  sparkles: (
    <>
      <path d="M11 3l1.8 5.2L18 10l-5.2 1.8L11 17l-1.8-5.2L4 10l5.2-1.8z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
    </>
  ),
  map: (
    <>
      <path d="M3 6.5l6-3 6 3 6-3v14l-6 3-6-3-6 3z" />
      <path d="M9 3.5v14M15 6.5v14" />
    </>
  ),
  globe: (
    <>
      <circle cx={12} cy={12} r={9} />
      <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
    </>
  ),
  code: <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
  archive: (
    <>
      <rect x={3} y={4} width={18} height={5} rx={1} />
      <path d="M5 9v10.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M10 13h4" />
    </>
  ),
  smile: (
    <>
      <circle cx={12} cy={12} r={9} />
      <path d="M8 14c1 1.5 2.3 2.2 4 2.2s3-.7 4-2.2" />
      <circle cx={9} cy={9.5} r={1.1} {...dotFill} />
      <circle cx={15} cy={9.5} r={1.1} {...dotFill} />
    </>
  ),
  gauge: (
    <>
      <path d="M3.5 18a8.5 8.5 0 1 1 17 0" />
      <path d="M12 18l4.5-6" />
      <circle cx={12} cy={18} r={1.4} {...dotFill} />
    </>
  ),
  org: (
    <>
      <rect x={9} y={2.5} width={6} height={5} rx={1} />
      <rect x={2.5} y={16.5} width={6} height={5} rx={1} />
      <rect x={15.5} y={16.5} width={6} height={5} rx={1} />
      <path d="M12 7.5v4.5M5.5 16.5V12h13v4.5" />
    </>
  ),
  play: <path d="M7 4.5l12.5 7.5L7 19.5z" />,
  pause: <path d="M8.5 5v14M15.5 5v14" />,
  reset: (
    <>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.8-6.3L3.5 8.5" />
      <path d="M3.5 3.5v5h5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  arrow: <path d="M4.5 12h15M13.5 6l6 6-6 6" />,
  scale: (
    <>
      <path d="M12 3.5v17M6 20.5h12M4 7h16" />
      <path d="M7 7l-3 7a3 3 0 0 0 6 0zM17 7l-3 7a3 3 0 0 0 6 0z" />
    </>
  ),
  truck: (
    <>
      <path d="M2 6h12v10H2zM14 9h4l3 3.5V16h-7" />
      <circle cx={6} cy={17.5} r={2} />
      <circle cx={17} cy={17.5} r={2} />
    </>
  ),
  hand: (
    <path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11M11 10V4a1.5 1.5 0 0 1 3 0v6M14 10V5.5a1.5 1.5 0 0 1 3 0V13c0 4.4-2.6 8-7 8-3 0-4.3-1.4-5.8-3.8L2.8 15a1.6 1.6 0 0 1 2.6-1.8L8 15.5" />
  ),
  pointer: <path d="M5 3.5l13 6.5-5.5 1.8 3.8 6.3-2.6 1.5-3.8-6.3L6 17.5z" />,
  star: <path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z" />,
  filter: <path d="M3.5 4.5h17l-6.5 8v6l-4 2v-8z" />,
  inbox: (
    <>
      <path d="M3 13.5l2.5-8.5h13l2.5 8.5V19H3z" />
      <path d="M3 13.5h5l1.5 2.5h5l1.5-2.5h5" />
    </>
  ),
  send: <path d="M21 3L10.5 13.5M21 3l-6.5 18-4-7.5L3 9.5z" />,
  note: (
    <>
      <path d="M4 4h16v11l-5 5H4z" />
      <path d="M15 20v-5h5M8 9h8M8 13h4" />
    </>
  ),
  puzzle: (
    <path d="M9 3.5h3.5a2 2 0 1 1 4 0H20v4.5a2 2 0 1 0 0 4V16.5h-3.5a2 2 0 1 0-4 0H9V13a2 2 0 1 1 0-4z" />
  ),
  mic: (
    <>
      <rect x={9} y={2.5} width={6} height={12} rx={3} />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3.5M8.5 21.5h7" />
    </>
  ),
  bell: (
    <>
      <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z" />
      <path d="M10 21a2.2 2.2 0 0 0 4 0" />
    </>
  ),
  kanban: (
    <>
      <rect x={3} y={3.5} width={18} height={17} rx={2} />
      <path d="M9 3.5v17M15 3.5v17" />
      <path d="M5 7h2M11 7h2M17 7h2M5 10.5h2M11 10.5h2M5 14h2" />
    </>
  ),
  gantt: (
    <>
      <path d="M3.5 3.5V20.5h17" />
      <path d="M7 7h6M10 11h7M8 15h5" strokeWidth={3} />
    </>
  ),
  megaphone: (
    <>
      <path d="M3.5 10v4h3l8 5V5l-8 5z" />
      <path d="M6.5 14l1.5 5.5h3L9.8 15.6M18 9a4 4 0 0 1 0 6" />
    </>
  ),
  bike: (
    <>
      <circle cx={5.5} cy={16} r={3.8} />
      <circle cx={18.5} cy={16} r={3.8} />
      <path d="M5.5 16l4-7h6.5l2.5 7M9.5 9L12 16h3.5M8 6h3M14.5 5.5h2.5l-1 3.5" />
    </>
  ),
  arm: (
    <>
      <path d="M4 20.5h9" />
      <path d="M8.5 20.5V16l-2-6 7-4 3.5 3.5" />
      <circle cx={6.5} cy={10} r={1.6} />
      <circle cx={13.5} cy={6} r={1.6} />
      <path d="M17 9.5l3 1-1 3M17 9.5l1 3.2" />
    </>
  ),
  list: <path d="M9 6h11.5M9 12h11.5M9 18h11.5M4 6h.5M4 12h.5M4 18h.5" strokeWidth={2.4} />,
  wand: (
    <>
      <path d="M4 20L15 9M13 7l4 4" />
      <path d="M18 2.5v3M16.5 4h3M20.5 8v2.5M19.2 9.2h2.6M9 3v2.5M7.8 4.2h2.4" />
    </>
  ),
  heart: <path d="M12 20s-7.5-4.6-9-9.5C2 6.9 4.3 4 7.3 4c2 0 3.6 1.2 4.7 2.8C13.1 5.2 14.7 4 16.7 4c3 0 5.3 2.9 4.3 6.5-1.5 4.9-9 9.5-9 9.5z" />,
  video: (
    <>
      <rect x={2.5} y={6} width={13} height={12} rx={2} />
      <path d="M15.5 10.5l6-3.5v10l-6-3.5" />
    </>
  ),
  store: (
    <>
      <path d="M3.5 9.5l1.5-5h14l1.5 5" />
      <path d="M3.5 9.5a2.8 2.8 0 0 0 5.6 0 2.8 2.8 0 0 0 5.8 0 2.8 2.8 0 0 0 5.6 0" />
      <path d="M5 12.5v8h14v-8M10 20.5v-5h4v5" />
    </>
  ),
  leaf: (
    <>
      <path d="M12 21v-6" />
      <path d="M12 15l-6.5-2 1.6-2.2L3.5 8l3.6-.6L6 3.8l3.6 1.6L12 2.5l2.4 2.9L18 3.8l-1.1 3.6 3.6.6-3.6 2.8 1.6 2.2z" />
    </>
  ),
  image: (
    <>
      <rect x={3} y={4} width={18} height={16} rx={2} />
      <circle cx={8.5} cy={9.5} r={1.8} />
      <path d="M21 16l-5-5-9 9" />
    </>
  ),
  scan: (
    <>
      <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" />
      <path d="M4 12h16" />
    </>
  ),
  stethoscope: (
    <>
      <path d="M6 3v6a4 4 0 0 0 8 0V3" />
      <path d="M10 13v2a5 5 0 0 0 10 0v-2" />
      <circle cx={20} cy={11} r={2} />
    </>
  ),
};
type IconName = keyof typeof ICONS;

const Icon = ({
  name,
  size = 32,
  color = 'currentColor',
  sw = 2,
  style,
  cls,
}: {
  name: IconName;
  size?: number;
  color?: string;
  sw?: number;
  style?: CSSProperties;
  cls?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cls}
    style={{ color, flex: 'none', display: 'block', ...style }}
    aria-hidden
  >
    {ICONS[name]}
  </svg>
);

// Icon on a tinted square tile (brand squares).
const IconTile = ({
  name,
  tone = 'blue',
  size = 64,
  solid = false,
  cls,
  style,
}: {
  name: IconName;
  tone?: Tone;
  size?: number;
  solid?: boolean;
  cls?: string;
  style?: CSSProperties;
}) => (
  <div
    className={cls}
    style={{
      flex: 'none',
      width: size,
      height: size,
      borderRadius: Math.round(size * 0.2),
      background: solid ? STRONG[tone] : T[tone].bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}
  >
    <Icon name={name} size={Math.round(size * 0.56)} color={solid ? (tone === 'yellow' ? C.ink : '#fff') : T[tone].fg} />
  </div>
);

// ─── Brand motif: Technologia's overlapping squares ─────────────────────────
// Blue square top-left, yellow square bottom-right, green where they overlap.
const Squares = ({
  s,
  x,
  y,
  anim = true,
  delay = 0,
  cls,
  style,
  children,
}: {
  s: number;
  x: number;
  y: number;
  anim?: boolean;
  delay?: number;
  cls?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) => {
  const o = Math.round(s * 0.33);
  return (
    <div className={cls} style={{ position: 'absolute', left: x, top: y, width: s + o, height: s + o, ...style }}>
      <div
        className={anim ? k('sqb') : undefined}
        style={{ position: 'absolute', left: o, top: o, width: s, height: s, background: G.yellow, ...dl(delay) }}
      />
      <div
        className={anim ? k('sqa') : undefined}
        style={{ position: 'absolute', left: 0, top: 0, width: s, height: s, background: G.blue, ...dl(delay) }}
      />
      <div
        className={anim ? k('sqc') : undefined}
        style={{ position: 'absolute', left: o, top: o, width: s - o, height: s - o, background: G.green, ...dl(delay) }}
      />
      {children}
    </div>
  );
};

// Tiny static version used as a bullet / header mark.
const MiniSquares = ({ size = 22 }: { size?: number }) => {
  const s = Math.round(size * 0.75);
  const o = size - s;
  return (
    <span style={{ position: 'relative', display: 'inline-block', flex: 'none', width: size, height: size }}>
      <span style={{ position: 'absolute', left: o, top: o, width: s, height: s, background: C.yellow }} />
      <span style={{ position: 'absolute', left: 0, top: 0, width: s, height: s, background: '#3D9FCB' }} />
      <span style={{ position: 'absolute', left: o, top: o, width: s - o, height: s - o, background: C.green }} />
    </span>
  );
};

const BrandStripe = () => (
  <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 8, display: 'flex' }}>
    <div style={{ flex: 6, background: 'linear-gradient(90deg, #2A74BF, #6CCBD0)' }} />
    <div style={{ flex: 2, background: C.green }} />
    <div style={{ flex: 3, background: G.yellow }} />
  </div>
);

// ─── Frame: header (module + day progress), footer (logo + page), beats ─────
// Invisible click markers: each beat is a <Step> whose reveal state drives the
// page's CSS (via :has), so one → press can animate SVG, cards, colours…
const Beats = ({ count }: { count: number }) => (
  <div aria-hidden style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0 }}>
    <Steps>
      {Array.from({ length: count }, (_, i) => (
        <Step key={i} duration={0}>
          <i className={k(`k${i + 1}`)} />
        </Step>
      ))}
    </Steps>
  </div>
);

// Number of beats revealed on the enclosing page (for React-driven visuals).
// Attach `ref` to any element inside the page. Thumbnails report every beat.
const useBeats = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(99);
  useEffect(() => {
    const page = ref.current?.closest(`.${P}-page`);
    if (!page) return;
    const read = () => {
      const marks = page.querySelectorAll(`[data-osd-step] > i[class^="${P}-k"]`);
      if (!marks.length) return setCount(99);
      setCount(page.querySelectorAll(`[data-osd-step="revealed"] > i[class^="${P}-k"]`).length);
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(page, { attributes: true, subtree: true, attributeFilter: ['data-osd-step'] });
    return () => mo.disconnect();
  }, []);
  return [ref, count] as const;
};

const KINDS = {
  qcm: { label: 'QCM', tone: 'violet' as Tone, icon: 'check' as IconName },
  exercice: { label: 'Exercice', tone: 'green' as Tone, icon: 'pointer' as IconName },
  atelier: { label: 'Atelier', tone: 'yellow' as Tone, icon: 'users' as IconName },
  cas: { label: 'Étude de cas', tone: 'teal' as Tone, icon: 'book' as IconName },
  demo: { label: 'Démo', tone: 'blue' as Tone, icon: 'play' as IconName },
  synthese: { label: 'Synthèse', tone: 'grey' as Tone, icon: 'star' as IconName },
};
type Kind = keyof typeof KINDS;

const KindBadge = ({ kind }: { kind: Kind }) => {
  const kd = KINDS[kind];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '5px 14px 5px 10px',
        borderRadius: 8,
        background: STRONG[kd.tone],
        color: kd.tone === 'yellow' ? C.ink : '#fff',
        fontFamily: display,
        fontWeight: 700,
        fontSize: 20,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      }}
    >
      <Icon name={kd.icon} size={20} sw={2.5} />
      {kd.label}
    </span>
  );
};

const ProgSq = ({ n, mod }: { n: number; mod: number }) => {
  const now = n === mod;
  const past = mod > n;
  // Click = jump to the module's opening page (MOD_START, appended by the build);
  // only the live page reacts. data-inspector-ui: the editor inspector lets the click through.
  const live = useIsActivePage();
  const target = MOD_START[n];
  const tip = `Module ${n} · ${MOD_TITLES[n] ?? ''}`;
  const go = (e: { stopPropagation: () => void; preventDefault: () => void }) => {
    e.stopPropagation();
    e.preventDefault();
    if (!live || target === undefined || typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('open-slide:goto', { detail: { index: target } }));
  };
  return (
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
        width: 34,
        height: 34,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: display,
        fontWeight: 700,
        fontSize: 18,
        background: now ? C.blue : past ? mix(C.blue, 19) : 'transparent',
        color: now ? '#fff' : past ? C.blue : C.faint,
        boxShadow: now || past ? 'none' : `inset 0 0 0 2px ${C.rule}`,
      }}
    >
      {pad(n)}
    </span>
  );
};

CSS.push(`
.${P}-chip{transition:transform .15s ease, filter .15s ease}
.${P}-live .${P}-chip:hover{transform:translateY(-2px);filter:brightness(1.06)}
.${P}-chip::after{content:attr(data-tip);position:absolute;top:calc(100% + 12px);right:0;z-index:50;
  padding:10px 16px;border-radius:10px;background:${C.ink};color:#fff;white-space:nowrap;
  font:600 19px/1.2 var(--osd-font-body);letter-spacing:0;text-transform:none;box-shadow:0 14px 30px -12px rgba(0,0,0,.45);
  opacity:0;transform:translateY(-4px);pointer-events:none;transition:opacity .15s ease, transform .15s ease}
.${P}-chip::before{content:'';position:absolute;top:calc(100% + 4px);right:12px;z-index:50;
  border:8px solid transparent;border-bottom-color:${C.ink};border-top:0;
  opacity:0;pointer-events:none;transition:opacity .15s ease}
.${P}-live .${P}-chip:hover::after{opacity:1;transform:none}
.${P}-live .${P}-chip:hover::before{opacity:1}
`);

// Single-day deck: one chip per module (01 … LAST_MOD), clickable.
const Progress = ({ mod }: { mod: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <span style={{ fontFamily: display, fontWeight: 600, fontSize: 20, letterSpacing: '0.14em', color: C.muted, marginRight: 10 }}>{CODE}</span>
    <ProgSq n={1} mod={mod} />
    <ProgSq n={2} mod={mod} />
    <ProgSq n={3} mod={mod} />
    <ProgSq n={4} mod={mod} />
    <ProgSq n={5} mod={mod} />
    <ProgSq n={6} mod={mod} />
    <ProgSq n={7} mod={mod} />
    <ProgSq n={8} mod={mod} />
  </div>
);

const Header = ({ mod, label, kind }: { mod: number; label?: string; kind?: Kind }) => (
  <div
    style={{
      position: 'absolute',
      left: 120,
      right: 120,
      top: 42,
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <MiniSquares size={24} />
      <span
        style={{
          fontFamily: display,
          fontWeight: 600,
          fontSize: 24,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: C.blue,
        }}
      >
        {label ?? (mod >= 1 && mod <= LAST_MOD ? `Module ${pad(mod)} · ${MOD_TITLES[mod]}` : mod === 0 ? 'Ouverture' : 'Clôture')}
      </span>
      {kind ? <KindBadge kind={kind} /> : null}
    </div>
    <Progress mod={mod} />
  </div>
);

// Footer logos — each toggled in the Design panel (design.logos), live via
// --osd-logo-<key>: flex | none. All off → the strip and its rules disappear.
// @@client-logo: the build swaps the next line for an import when
// slides/<id>/assets/logos/logo-client.(png|svg|jpg|webp) exists.
const CLIENT_LOGO: string | null = null;
const FOOTER_LOGOS: { key: string; node: ReactNode }[] = [
  ...(CLIENT_LOGO
    ? [{ key: 'client', node: <img src={CLIENT_LOGO} alt="Client" style={{ height: 36, width: 'auto', display: 'block' }} /> }]
    : []),
  { key: 'provider', node: <img src={logoWide} alt="Technologia" style={{ height: 40, display: 'block', mixBlendMode: 'multiply' }} /> },
  {
    key: 'national-quantum',
    node: <img src={logoNationalQuantum} alt="National Quantum" style={{ height: 34, width: 'auto', display: 'block' }} />,
  },
];
// The active client's logo (APSM / Sobeys, chosen on the cover) comes first.
const FooterLogos = () => (
  <>
    <span key="final-client" style={{ display: 'var(--osd-logo-final-client, flex)', alignItems: 'center', gap: 20 }}>
      <ClientMark h={32} />
      <span style={{ width: 1.5, height: 26, background: C.rule }} />
    </span>
    {FOOTER_LOGOS.map((l) => (
      <span key={l.key} style={{ display: `var(--osd-logo-${l.key}, flex)`, alignItems: 'center', gap: 20 }}>
        {l.node}
        <span style={{ width: 1.5, height: 26, background: C.rule }} />
      </span>
    ))}
  </>
);

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        bottom: 28,
        height: 46,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <FooterLogos />
        <span style={{ fontSize: 20, fontWeight: 600, color: C.soft }}>{AUTHOR}</span>
        <span style={{ width: 1.5, height: 26, background: C.rule }} />
        <span style={{ fontSize: 20, color: C.muted }}>{COURSE} · {CODE}</span>
      </div>
      <span style={{ fontFamily: mono, fontSize: 20, color: C.muted, letterSpacing: '0.04em' }}>
        {pad(current)} / {pad(total)}
      </span>
    </div>
  );
};

const Frame = ({
  mod,
  label,
  kind,
  beats = 0,
  chrome = true,
  bg,
  children,
}: {
  mod: number;
  label?: string;
  kind?: Kind;
  beats?: number;
  chrome?: boolean;
  bg?: string;
  children: ReactNode;
}) => {
  const live = useIsActivePage();
  return (
    <div
      className={cx(k('page'), live && k('live'))}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: bg ?? 'var(--osd-bg)',
        color: 'var(--osd-text)',
        fontFamily: body,
        fontSize: 'var(--osd-size-body)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 60% 55% at 12% 8%, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%), radial-gradient(ellipse 50% 50% at 100% 100%, rgba(108,203,208,0.10), rgba(108,203,208,0) 70%)',
        }}
      />
      <BrandStripe />
      {chrome ? <Header mod={mod} label={label} kind={kind} /> : null}
      {children}
      {chrome ? <Footer /> : null}
      {beats > 0 ? <Beats count={beats} /> : null}
    </div>
  );
};

// ─── Typography ─────────────────────────────────────────────────────────────
const Title = ({
  children,
  top = 108,
  size = 64,
  w = 1680,
  cls,
}: {
  children: ReactNode;
  top?: number;
  size?: number;
  w?: number;
  cls?: string;
}) => (
  <h2
    className={cls}
    style={{
      position: 'absolute',
      left: 120,
      top,
      margin: 0,
      maxWidth: w,
      fontFamily: display,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.08,
      letterSpacing: '-0.005em',
      color: C.ink,
    }}
  >
    {children}
  </h2>
);

const Lede = ({ children, top = 192, w = 1520, cls }: { children: ReactNode; top?: number; w?: number; cls?: string }) => (
  <p
    className={cls}
    style={{
      position: 'absolute',
      left: 120,
      top,
      margin: 0,
      maxWidth: w,
      fontSize: 30,
      lineHeight: 1.45,
      color: C.soft,
    }}
  >
    {children}
  </p>
);

// Absolutely positioned container.
const Box = ({
  x,
  y,
  w,
  h,
  cls,
  style,
  children,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  cls?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) => (
  <div className={cls} style={{ position: 'absolute', left: x, top: y, width: w, height: h, ...style }}>
    {children}
  </div>
);

// Yellow marker highlight (brand yellow).
const Hl = ({ children, c = 'rgba(255, 208, 0, 0.55)' }: { children: ReactNode; c?: string }) => (
  <mark style={{ background: `linear-gradient(transparent 58%, ${c} 58%)`, color: 'inherit', padding: '0 3px' }}>
    {children}
  </mark>
);

const Strong = ({ children, c = C.blue }: { children: ReactNode; c?: string }) => (
  <strong style={{ fontWeight: 600, color: c }}>{children}</strong>
);

// Uppercase condensed label.
const Eyebrow = ({ children, c = C.blue, size = 24, cls, style }: { children: ReactNode; c?: string; size?: number; cls?: string; style?: CSSProperties }) => (
  <div
    className={cls}
    style={{
      fontFamily: display,
      fontWeight: 600,
      fontSize: size,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: c,
      ...style,
    }}
  >
    {children}
  </div>
);

// Square-marker bullet.
const Bullet = ({
  children,
  tone = 'blue',
  size = 30,
  cls,
  style,
}: {
  children: ReactNode;
  tone?: Tone;
  size?: number;
  cls?: string;
  style?: CSSProperties;
}) => (
  <div className={cls} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', fontSize: size, lineHeight: 1.4, ...style }}>
    <span
      style={{
        flex: 'none',
        width: Math.round(size * 0.42),
        height: Math.round(size * 0.42),
        marginTop: Math.round((size * 1.4 - size * 0.42) / 2),
        background: STRONG[tone],
      }}
    />
    <span>{children}</span>
  </div>
);

// Numbered square badge.
const Num = ({ n, tone = 'blue', size = 48, cls, style }: { n: number | string; tone?: Tone; size?: number; cls?: string; style?: CSSProperties }) => (
  <span
    className={cls}
    style={{
      flex: 'none',
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: STRONG[tone],
      color: tone === 'yellow' ? C.ink : '#fff',
      fontFamily: display,
      fontWeight: 700,
      fontSize: Math.round(size * 0.58),
      lineHeight: 1,
      ...style,
    }}
  >
    {n}
  </span>
);

// Small tag / pill.
const Tag = ({ children, tone = 'blue', size = 22, cls, style }: { children: ReactNode; tone?: Tone; size?: number; cls?: string; style?: CSSProperties }) => (
  <span
    className={cls}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: `${Math.round(size * 0.25)}px ${Math.round(size * 0.6)}px`,
      borderRadius: 999,
      background: T[tone].bg,
      color: T[tone].fg,
      boxShadow: `inset 0 0 0 1.5px ${T[tone].bd}`,
      fontSize: size,
      fontWeight: 600,
      lineHeight: 1.2,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </span>
);

// ─── Cards & callouts ───────────────────────────────────────────────────────
const Card = ({
  tone = 'blue',
  icon,
  title,
  children,
  bar = true,
  pad: p = 30,
  size = 26,
  cls,
  style,
}: {
  tone?: Tone;
  icon?: IconName;
  title?: ReactNode;
  children?: ReactNode;
  bar?: boolean;
  pad?: number;
  size?: number;
  cls?: string;
  style?: CSSProperties;
}) => (
  <div
    className={cls}
    style={{
      position: 'relative',
      boxSizing: 'border-box',
      background: C.card,
      borderRadius: 'var(--osd-radius)',
      boxShadow: SHADOW,
      padding: p,
      paddingTop: bar ? p + 6 : p,
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }}
  >
    {bar ? (
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          height: 7,
          borderRadius: '18px 18px 0 0',
          background: tone === 'blue' ? G.blue : STRONG[tone],
        }}
      />
    ) : null}
    {icon || title ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: children ? 14 : 0 }}>
        {icon ? <IconTile name={icon} tone={tone} size={60} /> : null}
        {title ? (
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 34, lineHeight: 1.08, color: C.ink }}>{title}</div>
        ) : null}
      </div>
    ) : null}
    {children ? <div style={{ fontSize: size, lineHeight: 1.45, color: C.soft }}>{children}</div> : null}
  </div>
);

const Callout = ({
  title = 'À retenir',
  tone = 'yellow',
  icon = 'bulb',
  children,
  size = 28,
  cls,
  style,
}: {
  title?: ReactNode;
  tone?: Tone;
  icon?: IconName;
  children: ReactNode;
  size?: number;
  cls?: string;
  style?: CSSProperties;
}) => (
  <div
    className={cls}
    style={{
      display: 'flex',
      gap: 22,
      alignItems: 'flex-start',
      boxSizing: 'border-box',
      background: T[tone].bg,
      borderLeft: `8px solid ${STRONG[tone]}`,
      borderRadius: 14,
      padding: '20px 28px',
      ...style,
    }}
  >
    <Icon name={icon} size={38} color={T[tone].fg} style={{ marginTop: 2 }} />
    <div>
      {title ? (
        <div
          style={{
            fontFamily: display,
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: T[tone].fg,
            marginBottom: 2,
          }}
        >
          {title}
        </div>
      ) : null}
      <div style={{ fontSize: size, lineHeight: 1.4, color: C.ink }}>{children}</div>
    </div>
  </div>
);

// Pull quote.
const Quote = ({ children, by, cls, style }: { children: ReactNode; by?: ReactNode; cls?: string; style?: CSSProperties }) => (
  <div className={cls} style={{ position: 'relative', paddingLeft: 56, ...style }}>
    <span
      style={{ position: 'absolute', left: 0, top: -18, fontFamily: display, fontWeight: 700, fontSize: 120, lineHeight: 1, color: C.yellow }}
    >
      “
    </span>
    <div style={{ fontFamily: display, fontWeight: 600, fontSize: 44, lineHeight: 1.2, color: C.ink }}>{children}</div>
    {by ? <div style={{ marginTop: 14, fontSize: 24, color: C.muted }}>{by}</div> : null}
  </div>
);

// ─── Diagram primitives ─────────────────────────────────────────────────────
// SVG arrow; drawn on beat `n` when given (line draws, then the head fades in).
const Arrow = ({
  x1,
  y1,
  x2,
  y2,
  color = C.faint,
  w = 4,
  n,
  d = 0,
  head = 18,
  curve = 0,
  dashed = false,
  cls,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  w?: number;
  n?: number;
  d?: number;
  head?: number;
  curve?: number;
  dashed?: boolean;
  cls?: string;
}) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const mx = (x1 + x2) / 2 - (dy / len) * curve;
  const my = (y1 + y2) / 2 + (dx / len) * curve;
  const tx = curve ? x2 - mx : dx;
  const ty = curve ? y2 - my : dy;
  const tl = Math.hypot(tx, ty) || 1;
  const ex = tx / tl;
  const ey = ty / tl;
  const bx = x2 - ex * head;
  const by = y2 - ey * head;
  const hw = head * 0.6;
  const path = curve ? `M ${x1} ${y1} Q ${mx} ${my} ${bx} ${by}` : `M ${x1} ${y1} L ${bx} ${by}`;
  const pts = `${x2},${y2} ${bx - ey * hw},${by + ex * hw} ${bx + ey * hw},${by - ex * hw}`;
  return (
    <g className={cls}>
      {dashed ? (
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={w}
          strokeLinecap="round"
          strokeDasharray="10 14"
          className={cx(A.march, n ? b.fade(n) : undefined)}
          style={dl(d)}
        />
      ) : (
        <path
          d={path}
          pathLength={1}
          fill="none"
          stroke={color}
          strokeWidth={w}
          strokeLinecap="round"
          className={n ? b.draw(n) : undefined}
          style={dl(d)}
        />
      )}
      <polygon points={pts} fill={color} className={n ? b.fade(n) : undefined} style={dl(d + 450)} />
    </g>
  );
};

// Horizontal arrow for flex rows (HTML).
const FlowArrow = ({ w = 72, color = C.faint, dashed = false, cls }: { w?: number; color?: string; dashed?: boolean; cls?: string }) => (
  <svg width={w} height={28} viewBox={`0 0 ${w} 28`} className={cls} style={{ flex: 'none', display: 'block' }}>
    <path
      d={`M3 14 H${w - 10}`}
      stroke={color}
      strokeWidth={4}
      strokeLinecap="round"
      strokeDasharray={dashed ? '10 14' : undefined}
      className={dashed ? A.march : undefined}
    />
    <path d={`M${w - 17} 5 L${w - 4} 14 L${w - 17} 23`} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// A dot travelling along an SVG path forever (only rendered on the active page).
const FlowDot = ({ path, dur = 2.4, begin = 0, r = 7, color = C.blue }: { path: string; dur?: number; begin?: number; r?: number; color?: string }) => {
  const live = useIsActivePage();
  if (!live) return null;
  return (
    <circle r={r} fill={color}>
      <animateMotion path={path} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
    </circle>
  );
};

// Chat bubble with avatar.
const Avatar = ({ who = 'user', size = 56 }: { who?: 'user' | 'agent' | 'human' | 'system'; size?: number }) => {
  const m = {
    user: { bg: T.grey.bg, fg: C.soft, icon: 'user' as IconName },
    agent: { bg: C.blue, fg: '#fff', icon: 'bot' as IconName },
    human: { bg: C.green, fg: '#fff', icon: 'humanCheck' as IconName },
    system: { bg: T.yellow.bg, fg: T.yellow.fg, icon: 'gear' as IconName },
  }[who];
  return (
    <div
      style={{
        flex: 'none',
        width: size,
        height: size,
        borderRadius: 999,
        background: m.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name={m.icon} size={Math.round(size * 0.55)} color={m.fg} />
    </div>
  );
};

const Bubble = ({
  who = 'user',
  name,
  children,
  size = 26,
  w,
  cls,
  style,
}: {
  who?: 'user' | 'agent' | 'human' | 'system';
  name?: string;
  children: ReactNode;
  size?: number;
  w?: number;
  cls?: string;
  style?: CSSProperties;
}) => {
  const right = who === 'user';
  const bg = { user: C.card, agent: T.blue.bg, human: T.green.bg, system: T.yellow.bg }[who];
  return (
    <div className={cls} style={{ display: 'flex', flexDirection: right ? 'row-reverse' : 'row', gap: 16, alignItems: 'flex-start', ...style }}>
      <Avatar who={who} size={52} />
      <div
        style={{
          maxWidth: w,
          background: bg,
          borderRadius: right ? '20px 6px 20px 20px' : '6px 20px 20px 20px',
          boxShadow: SHADOW_SM,
          padding: '14px 22px',
          fontSize: size,
          lineHeight: 1.4,
          color: C.ink,
        }}
      >
        {name ? (
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.muted, marginBottom: 4 }}>
            {name}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
};

// Light code block (JSON, tool calls…). Colour tokens with <Jk>/<Js>/<Jn>/<Jc>.
const Code = ({
  children,
  title,
  size = 24,
  cls,
  style,
}: {
  children: ReactNode;
  title?: string;
  size?: number;
  cls?: string;
  style?: CSSProperties;
}) => (
  <div
    className={cls}
    style={{
      boxSizing: 'border-box',
      background: '#F7FAFC',
      boxShadow: `inset 0 0 0 1.5px ${C.rule}`,
      borderRadius: 14,
      padding: '20px 26px',
      fontFamily: mono,
      fontSize: size,
      lineHeight: 1.55,
      color: C.ink,
      whiteSpace: 'pre',
      ...style,
    }}
  >
    {title ? (
      <div style={{ fontFamily: body, fontSize: 20, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, marginBottom: 8 }}>
        {title}
      </div>
    ) : null}
    {children}
  </div>
);
const Jk = ({ children }: { children: ReactNode }) => <span style={{ color: '#1A65A3' }}>{children}</span>;
const Js = ({ children }: { children: ReactNode }) => <span style={{ color: '#2B7A33' }}>{children}</span>;
const Jn = ({ children }: { children: ReactNode }) => <span style={{ color: '#B3432B' }}>{children}</span>;
const Jc = ({ children }: { children: ReactNode }) => <span style={{ color: C.faint }}>{children}</span>;

// Number that counts up when the page becomes active.
const CountUp = ({
  to,
  dur = 1600,
  delay = 0,
  digits = 0,
  prefix = '',
  suffix = '',
}: {
  to: number;
  dur?: number;
  delay?: number;
  digits?: number;
  prefix?: string;
  suffix?: string;
}) => {
  const live = useIsActivePage();
  const [v, setV] = useState(to);
  useEffect(() => {
    if (!live) {
      setV(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now() + delay;
    const tick = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - t0) / dur));
      setV(to * (1 - (1 - p) ** 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setV(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live, to, dur, delay]);
  return (
    <>
      {prefix}
      {fr(v, digits)}
      {suffix}
    </>
  );
};

// Big statistic block.
const Stat = ({
  value,
  label,
  tone = 'blue',
  size = 120,
  cls,
  style,
}: {
  value: ReactNode;
  label: ReactNode;
  tone?: Tone;
  size?: number;
  cls?: string;
  style?: CSSProperties;
}) => (
  <div className={cls} style={style}>
    <div style={{ fontFamily: display, fontWeight: 700, fontSize: size, lineHeight: 1, color: tone === 'yellow' ? C.amber : STRONG[tone] }}>
      {value}
    </div>
    <div style={{ marginTop: 12, fontSize: 26, lineHeight: 1.4, color: C.soft }}>{label}</div>
  </div>
);

// ─── Interactive controls ───────────────────────────────────────────────────
// Every interactive element is a <button>/<input> or carries data-osd-interactive,
// so clicking it never turns the page.
const Btn = ({
  children,
  onClick,
  tone = 'blue',
  ghost = false,
  icon,
  disabled = false,
  size = 24,
  style,
}: {
  children?: ReactNode;
  onClick?: () => void;
  tone?: Tone;
  ghost?: boolean;
  icon?: IconName;
  disabled?: boolean;
  size?: number;
  style?: CSSProperties;
}) => (
  <button
    type="button"
    data-osd-interactive
    disabled={disabled}
    onClick={(e) => {
      e.currentTarget.blur();
      onClick?.();
    }}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      flex: 'none',
      whiteSpace: 'nowrap',
      fontFamily: body,
      fontWeight: 600,
      fontSize: size,
      lineHeight: 1.1,
      padding: `${Math.round(size * 0.55)}px ${Math.round(size * 1.05)}px`,
      borderRadius: 12,
      border: 'none',
      boxShadow: ghost ? `inset 0 0 0 2px ${STRONG[tone]}` : '0 6px 16px -10px rgba(20,60,100,.6)',
      background: ghost ? '#fff' : STRONG[tone],
      color: ghost ? T[tone].fg : tone === 'yellow' ? C.ink : '#fff',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      transition: 'transform 150ms ease, opacity 200ms ease',
      ...style,
    }}
  >
    {icon ? <Icon name={icon} size={Math.round(size * 1.05)} sw={2.4} /> : null}
    {children}
  </button>
);

const Toggle = ({
  on,
  onChange,
  label,
  tone = 'blue',
  size = 26,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: ReactNode;
  tone?: Tone;
  size?: number;
}) => (
  <button
    type="button"
    data-osd-interactive
    onClick={(e) => {
      e.currentTarget.blur();
      onChange(!on);
    }}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      fontFamily: body,
      fontSize: size,
      color: C.ink,
      textAlign: 'left',
    }}
  >
    <span
      style={{
        flex: 'none',
        position: 'relative',
        width: 66,
        height: 38,
        borderRadius: 999,
        background: on ? STRONG[tone] : '#CBD4DB',
        transition: 'background 250ms ease',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 5,
          left: on ? 33 : 5,
          width: 28,
          height: 28,
          borderRadius: 999,
          background: '#fff',
          boxShadow: '0 2px 6px rgba(0,0,0,.25)',
          transition: `left 250ms ${EASE}`,
        }}
      />
    </span>
    <span>{label}</span>
  </button>
);

CSS.push(`
.${P}-range{-webkit-appearance:none;appearance:none;height:14px;border-radius:7px;outline:none;cursor:pointer;margin:0;
  background:linear-gradient(90deg,var(--rc) var(--pct),#DCE3E8 var(--pct))}
.${P}-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:42px;height:42px;border-radius:10px;background:#fff;
  border:6px solid var(--rc);box-shadow:0 4px 14px rgba(0,0,0,.2);cursor:grab}
.${P}-range::-moz-range-thumb{width:32px;height:32px;border-radius:10px;background:#fff;border:6px solid var(--rc);cursor:grab}
`);

// Styled slider. Arrow keys adjust it while focused (the player ignores inputs).
const Range = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  w = 600,
  tone = 'blue',
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  w?: number;
  tone?: Tone;
}) => (
  <input
    type="range"
    data-osd-interactive
    className={k('range')}
    min={min}
    max={max}
    step={step}
    value={value}
    onChange={(e) => onChange(Number(e.target.value))}
    style={{ width: w, ...vars({ pct: `${((value - min) / (max - min)) * 100}%`, rc: STRONG[tone] }) }}
  />
);

// Interaction hint shown on exercise pages.
const Hint = ({ children, cls, style }: { children: ReactNode; cls?: string; style?: CSSProperties }) => (
  <div className={cls} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...style }}>
    <Icon name="pointer" size={24} color={C.blue} />
    <span>{children}</span>
  </div>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
// Click an option → instant feedback (✓ / piège + why). → reveals the correct
// answer (beat 1), then the explanation (beat 2). Use inside <QcmPage>.
type OptProps = { ok?: boolean; why: ReactNode; children: ReactNode; i?: number };
type QcmState = { tried: number[]; sel: number[]; last: number | null; done: boolean; multi: boolean; click: (i: number) => void };
const QcmCtx = createContext<QcmState | null>(null);
const LETTERS = 'ABCDEF';

CSS.push(`
.${P}-q-opt{display:flex;align-items:center;gap:22px;width:100%;min-height:92px;box-sizing:border-box;padding:10px 22px 10px 14px;
  border:none;border-radius:16px;background:#fff;box-shadow:inset 0 0 0 2px ${C.rule},0 8px 20px -16px rgba(20,60,100,.5);
  font-family:${body};font-size:28px;line-height:1.3;color:${C.ink};text-align:left;cursor:pointer;
  transition:box-shadow 300ms ${EASE},background-color 300ms ${EASE},transform 200ms ${EASE}}
.${P}-q-opt:hover{box-shadow:inset 0 0 0 3px ${T.blue.bd},0 12px 24px -16px rgba(20,60,100,.55);transform:translateX(4px)}
.${P}-q-letter{flex:none;width:58px;height:58px;display:flex;align-items:center;justify-content:center;border-radius:12px;
  background:${T.grey.bg};color:${C.soft};font-family:${display};font-weight:700;font-size:32px;transition:all 300ms ${EASE}}
.${P}-q-mark{flex:none;width:52px;height:52px;border-radius:999px;display:flex;align-items:center;justify-content:center;
  opacity:0;transform:scale(.4);transition:opacity 300ms ${EASE},transform 500ms ${EASE_BACK}}
.${P}-q-opt[data-sel="1"]{box-shadow:inset 0 0 0 3px ${C.blue};background:${T.blue.bg}}
.${P}-q-opt[data-sel="1"] .${P}-q-letter{background:${C.blue};color:#fff}
.${P}-q[data-done="1"] .${P}-q-opt[data-ok="1"],${at(1)} .${P}-q-opt[data-ok="1"],.${P}-q-opt[data-tried="1"][data-ok="1"]{
  background:${T.green.bg};box-shadow:inset 0 0 0 3px ${C.green}}
.${P}-q[data-done="1"] .${P}-q-opt[data-ok="1"] .${P}-q-letter,${at(1)} .${P}-q-opt[data-ok="1"] .${P}-q-letter,.${P}-q-opt[data-tried="1"][data-ok="1"] .${P}-q-letter{background:${C.green};color:#fff}
.${P}-q[data-done="1"] .${P}-q-opt[data-ok="1"] .${P}-q-ok,${at(1)} .${P}-q-opt[data-ok="1"] .${P}-q-ok,.${P}-q-opt[data-tried="1"][data-ok="1"] .${P}-q-ok{opacity:1;transform:none}
.${P}-q-opt[data-tried="1"][data-ok="0"],.${P}-q[data-done="1"] .${P}-q-opt[data-sel="1"][data-ok="0"]{background:${T.coral.bg};box-shadow:inset 0 0 0 3px ${C.coral}}
.${P}-q-opt[data-tried="1"][data-ok="0"] .${P}-q-letter,.${P}-q[data-done="1"] .${P}-q-opt[data-sel="1"][data-ok="0"] .${P}-q-letter{background:${C.coral};color:#fff}
.${P}-q-opt[data-tried="1"][data-ok="0"] .${P}-q-ko,.${P}-q[data-done="1"] .${P}-q-opt[data-sel="1"][data-ok="0"] .${P}-q-ko{opacity:1;transform:none}
.${P}-q-opt[data-last="1"]{transform:translateX(6px)}
.${P}-q-explain{opacity:0;transform:translateY(14px);transition:opacity 500ms ${EASE},transform 700ms ${EASE}}
.${P}-q[data-done="1"] .${P}-q-explain,${at(2)} .${P}-q-explain{opacity:1;transform:none}
.${P}-q-auto{display:none}
${at(1)} .${P}-q-idle{display:none}
${at(1)} .${P}-q-auto{display:block;animation:${P}-rise 450ms ${EASE} both}
`);

const Opt = ({ ok = false, children, i = 0 }: OptProps) => {
  const q = useContext(QcmCtx);
  if (!q) return null;
  return (
    <button
      type="button"
      data-osd-interactive
      className={k('q-opt')}
      data-ok={ok ? '1' : '0'}
      data-tried={q.tried.includes(i) ? '1' : '0'}
      data-sel={q.sel.includes(i) ? '1' : '0'}
      data-last={q.last === i ? '1' : '0'}
      onClick={(e) => {
        e.currentTarget.blur();
        q.click(i);
      }}
    >
      <span className={k('q-letter')}>{LETTERS[i]}</span>
      <span style={{ flex: 1 }}>{children}</span>
      <span style={{ position: 'relative', width: 52, height: 52, flex: 'none' }}>
        <span className={cx(k('q-mark'), k('q-ok'))} style={{ position: 'absolute', inset: 0, background: C.green }}>
          <Icon name="check" size={30} color="#fff" sw={3} />
        </span>
        <span className={cx(k('q-mark'), k('q-ko'))} style={{ position: 'absolute', inset: 0, background: C.coral }}>
          <Icon name="x" size={28} color="#fff" sw={3} />
        </span>
      </span>
    </button>
  );
};

const Qcm = ({
  q,
  explain,
  multi = false,
  top = 232,
  children,
}: {
  q: ReactNode;
  explain: ReactNode;
  multi?: boolean;
  top?: number;
  children: ReactNode;
}) => {
  const opts = Children.toArray(children).filter(isValidElement) as ReactElement<OptProps>[];
  const [tried, setTried] = useState<number[]>([]);
  const [sel, setSel] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [last, setLast] = useState<number | null>(null);
  const okIdx = opts.flatMap((o, i) => (o.props.ok ? [i] : []));
  const done = multi ? checked : okIdx.some((i) => tried.includes(i));
  const click = (i: number) => {
    if (multi && !checked) {
      setSel((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
      return;
    }
    setLast(i);
    setTried((t) => (t.includes(i) ? t : [...t, i]));
  };
  const reset = () => {
    setTried([]);
    setSel([]);
    setChecked(false);
    setLast(null);
  };
  const lastOpt = last !== null ? opts[last] : null;
  const goodSel = sel.filter((i) => okIdx.includes(i)).length;
  const badSel = sel.length - goodSel;
  const okLetters = okIdx.map((i) => LETTERS[i]).join(' et ');
  return (
    <QcmCtx.Provider value={{ tried, sel, last, done, multi, click }}>
      <div className={k('q')} data-done={done ? '1' : '0'}>
        <div style={{ position: 'absolute', left: 120, top, width: 1060 }}>
          <div style={{ fontSize: 36, fontWeight: 600, lineHeight: 1.3, color: C.ink }}>{q}</div>
          {multi ? (
            <div style={{ marginTop: 10, fontSize: 22, fontWeight: 600, color: C.violet, letterSpacing: '0.04em' }}>
              PLUSIEURS RÉPONSES POSSIBLES
            </div>
          ) : null}
          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {opts.map((o, i) => cloneElement(o, { i, key: i }))}
          </div>
          {multi && !checked ? (
            <div style={{ marginTop: 22 }}>
              <Btn tone="violet" icon="check" disabled={!sel.length} onClick={() => setChecked(true)}>
                Valider ma sélection
              </Btn>
            </div>
          ) : null}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 1236,
            top,
            width: 564,
            height: 940 - top,
            boxSizing: 'border-box',
            background: C.card,
            borderRadius: 'var(--osd-radius)',
            boxShadow: SHADOW,
            padding: '30px 34px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {lastOpt === null && !(multi && checked) ? (
            <div className={k('q-idle')}>
              <Eyebrow c={C.violet}>À vous de jouer</Eyebrow>
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14, fontSize: 25, lineHeight: 1.35, color: C.soft }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <Num n={1} tone="violet" size={36} /> Annoncez votre réponse : A, B, C ou D.
                </div>
                <div style={{ display: 'flex', gap: 14 }}>
                  <Num n={2} tone="violet" size={36} /> {multi ? 'Les réponses majoritaires sont cochées, puis validées.' : 'La réponse majoritaire est cliquée.'}
                </div>
                <div style={{ display: 'flex', gap: 14 }}>
                  <Num n={3} tone="violet" size={36} /> Cliquez les autres options pour découvrir les pièges.
                </div>
              </div>
            </div>
          ) : null}
          {lastOpt === null && !(multi && checked) ? (
            <div className={k('q-auto')}>
              <Eyebrow c={C.green}>
                ✓ Bonne{okIdx.length > 1 ? 's' : ''} réponse{okIdx.length > 1 ? 's' : ''} : {okLetters}
              </Eyebrow>
              {okIdx.length === 1 ? (
                <div style={{ marginTop: 8, fontSize: 24, lineHeight: 1.4, color: C.ink }}>{opts[okIdx[0]].props.why}</div>
              ) : (
                <div style={{ marginTop: 8, fontSize: 24, lineHeight: 1.4, color: C.ink }}>
                  Cliquez chaque option pour voir pourquoi elle est juste… ou piégée.
                </div>
              )}
            </div>
          ) : null}
          {multi && checked ? (
            <div>
              <Eyebrow c={badSel === 0 && goodSel === okIdx.length ? C.green : C.coral}>
                {badSel === 0 && goodSel === okIdx.length ? 'Sans faute !' : 'Presque…'}
              </Eyebrow>
              <div style={{ marginTop: 6, fontSize: 24, color: C.soft }}>
                {goodSel} bonne{goodSel > 1 ? 's' : ''} case{goodSel > 1 ? 's' : ''} sur {okIdx.length}
                {badSel ? ` · ${badSel} piège${badSel > 1 ? 's' : ''} coché${badSel > 1 ? 's' : ''}` : ''}. Cliquez une option pour l’explication.
              </div>
            </div>
          ) : null}
          {lastOpt ? (
            <div key={last ?? -1} className={A.in} style={{ animationDuration: '450ms' } as CSSProperties}>
              <Eyebrow c={lastOpt.props.ok ? C.green : C.coral}>
                {lastOpt.props.ok ? `✓ ${LETTERS[last ?? 0]} — Bonne réponse` : `✗ ${LETTERS[last ?? 0]} — Piège !`}
              </Eyebrow>
              <div style={{ marginTop: 8, fontSize: 24, lineHeight: 1.4, color: C.ink }}>{lastOpt.props.why}</div>
            </div>
          ) : null}
          <div className={k('q-explain')} style={{ marginTop: 'auto', background: T.violet.bg, borderRadius: 14, padding: '18px 22px' }}>
            <Eyebrow c={T.violet.fg} size={22}>
              L’essentiel
            </Eyebrow>
            <div style={{ marginTop: 6, fontSize: 23, lineHeight: 1.4, color: C.ink }}>{explain}</div>
          </div>
          <button
            type="button"
            data-osd-interactive
            onClick={(e) => {
              e.currentTarget.blur();
              reset();
            }}
            style={{
              position: 'absolute',
              right: 18,
              top: 18,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: C.faint,
              padding: 6,
            }}
            title="Recommencer"
          >
            <Icon name="reset" size={26} />
          </button>
        </div>
      </div>
    </QcmCtx.Provider>
  );
};

const QcmPage = ({
  mod,
  n,
  title,
  q,
  explain,
  multi,
  children,
}: {
  mod: number;
  n: number;
  title: string;
  q: ReactNode;
  explain: ReactNode;
  multi?: boolean;
  children: ReactNode;
}) => (
  <Frame mod={mod} kind="qcm" beats={2}>
    <Title>
      <span style={{ color: C.violet }}>QCM {n}</span> · {title}
    </Title>
    <Qcm q={q} explain={explain} multi={multi}>
      {children}
    </Qcm>
  </Frame>
);

// ─── Flip card (click to reveal; optional beat `flipAt` flips it too) ───────
CSS.push(`
.${P}-flip{perspective:1800px;cursor:pointer}
.${P}-flip-in{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform 750ms ${EASE}}
.${P}-flipped > .${P}-flip-in{transform:rotateY(180deg)}
.${P}-flip-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;box-sizing:border-box;
  border-radius:18px;display:flex;flex-direction:column}
.${P}-flip:hover > .${P}-flip-in{box-shadow:none}
`);

const FlipCard = ({
  front,
  back,
  w,
  h,
  flipAt,
  tone = 'blue',
  backTone = 'green',
  cls,
  style,
}: {
  front: ReactNode;
  back: ReactNode;
  w: number;
  h: number;
  flipAt?: number;
  tone?: Tone;
  backTone?: Tone;
  cls?: string;
  style?: CSSProperties;
}) => {
  const [state, setState] = useState<boolean | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const toggle = () => {
    const page = ref.current?.closest(`.${P}-page`);
    const beatOn = flipAt ? !!page?.querySelector(`[data-osd-step="revealed"] > .${P}-k${flipAt}`) : false;
    const visual = state ?? beatOn;
    setState(!visual);
  };
  return (
    <div
      ref={ref}
      role="button"
      data-osd-interactive
      onClick={toggle}
      className={cx(k('flip'), flipAt ? k(`fl${flipAt}`) : null, state === true && k('flipped'), state === false && k('unflipped'), cls)}
      style={{ width: w, height: h, ...style }}
    >
      <div className={k('flip-in')}>
        <div
          className={k('flip-face')}
          style={{ background: C.card, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '30px 30px 24px' }}
        >
          {front}
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 20, color: C.faint }}>
            <Icon name="loop" size={20} /> Cliquez pour retourner
          </div>
        </div>
        <div
          className={k('flip-face')}
          style={{
            transform: 'rotateY(180deg)',
            background: T[backTone].bg,
            boxShadow: `inset 0 0 0 3px ${STRONG[backTone]}`,
            padding: '28px 30px',
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
};

// ─── Draggable chip (matrices, sorting games) ───────────────────────────────
const Drag = ({
  x,
  y,
  w,
  tone = 'blue',
  children,
  size = 24,
}: {
  x: number;
  y: number;
  w?: number;
  tone?: Tone;
  children: ReactNode;
  size?: number;
}) => {
  const [pos, setPos] = useState({ x, y });
  const [drag, setDrag] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const st = useRef<{ px: number; py: number; x: number; y: number; s: number } | null>(null);
  return (
    <div
      ref={ref}
      role="button"
      data-osd-interactive
      onPointerDown={(e) => {
        const el = ref.current;
        const parent = el?.offsetParent as HTMLElement | null;
        if (!el || !parent) return;
        const s = parent.getBoundingClientRect().width / parent.offsetWidth || 1;
        st.current = { px: e.clientX, py: e.clientY, x: pos.x, y: pos.y, s };
        el.setPointerCapture(e.pointerId);
        setDrag(true);
        e.preventDefault();
      }}
      onPointerMove={(e) => {
        const s = st.current;
        if (!s) return;
        setPos({ x: s.x + (e.clientX - s.px) / s.s, y: s.y + (e.clientY - s.py) / s.s });
      }}
      onPointerUp={() => {
        st.current = null;
        setDrag(false);
      }}
      onDoubleClick={() => setPos({ x, y })}
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        width: w,
        zIndex: drag ? 20 : 3,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 18px 12px 14px',
        background: C.card,
        borderRadius: 12,
        boxShadow: drag ? `0 0 0 3px ${STRONG[tone]}, 0 24px 40px -18px rgba(20,60,100,.6)` : `inset 5px 0 0 ${STRONG[tone]}, ${SHADOW_SM}`,
        fontSize: size,
        fontWeight: 500,
        lineHeight: 1.25,
        color: C.ink,
        cursor: drag ? 'grabbing' : 'grab',
        touchAction: 'none',
        userSelect: 'none',
        transform: drag ? 'scale(1.04)' : 'none',
        transition: drag ? 'transform 120ms ease' : `transform 200ms ease, left 0ms, top 0ms`,
      }}
    >
      {children}
    </div>
  );
};

// ─── Workshop timer (keeps running when you navigate away and back) ─────────
type TimerRec = { total: number; left: number; t0: number | null; base: number };
const TIMERS = new Map<string, TimerRec>();
const timerLeft = (r: TimerRec) => (r.t0 === null ? r.left : Math.max(0, r.left - (Date.now() - r.t0) / 1000));
// Durations re-set from the presenter view (« Minuteurs ») live in localStorage,
// per deck; other windows hear the storage event, this window the custom one.
const OVERRIDES_KEY = `osd-timers:${SLIDE_ID}`;
const OVERRIDES_EVENT = 'osd-timers';
const readOverride = (id: string): number | null => {
  try {
    const n = JSON.parse(window.localStorage.getItem(OVERRIDES_KEY) ?? 'null')?.[id];
    return typeof n === 'number' && n > 0 ? n : null;
  } catch {
    return null;
  }
};

const Timer = ({
  id,
  minutes,
  label = 'Minuteur',
  compact = false,
  cls,
  style,
}: {
  id: string;
  minutes: number;
  label?: string;
  compact?: boolean;
  cls?: string;
  style?: CSSProperties;
}) => {
  const key = `${SLIDE_ID}:${id}`;
  let rec = TIMERS.get(key);
  if (!rec) {
    rec = { total: minutes * 60, left: minutes * 60, t0: null, base: minutes };
    TIMERS.set(key, rec);
  }
  const r = rec;
  const [, tick] = useState(0);
  const [override, setOverride] = useState<number | null>(() => readOverride(id));
  useEffect(() => {
    const sync = () => setOverride(readOverride(id));
    window.addEventListener('storage', sync);
    window.addEventListener(OVERRIDES_EVENT, sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(OVERRIDES_EVENT, sync);
    };
  }, [id]);
  const mins = override ?? minutes;
  if (r.base !== mins) {
    // Re-timed from the presenter view: shift the duration, keep what has elapsed.
    const d = (mins - r.base) * 60;
    r.total = Math.max(0, r.total + d);
    r.left = Math.max(0, r.left + d);
    r.base = mins;
  }
  const running = r.t0 !== null;
  useEffect(() => {
    if (!running) return;
    const h = window.setInterval(() => tick((x) => x + 1), 250);
    return () => window.clearInterval(h);
  }, [running]);
  const left = timerLeft(r);
  if (running && left <= 0) {
    r.left = 0;
    r.t0 = null;
  }
  const refresh = () => tick((x) => x + 1);
  const start = () => {
    if (r.t0 === null && timerLeft(r) > 0) r.t0 = Date.now();
    refresh();
  };
  const pause = () => {
    if (r.t0 !== null) {
      r.left = timerLeft(r);
      r.t0 = null;
    }
    refresh();
  };
  const reset = () => {
    r.total = mins * 60;
    r.left = mins * 60;
    r.base = mins;
    r.t0 = null;
    refresh();
  };
  const addMin = () => {
    r.left = timerLeft(r) + 60;
    if (r.t0 !== null) r.t0 = Date.now();
    r.total = Math.max(r.total, r.left);
    refresh();
  };
  const subMin = () => {
    r.left = Math.max(0, timerLeft(r) - 60);
    if (r.t0 !== null) r.t0 = Date.now();
    r.total = Math.max(r.left, r.total - 60);
    refresh();
  };
  const secs = Math.ceil(left);
  const frac = r.total ? left / r.total : 0;
  const color = secs === 0 ? C.coral : secs <= 60 ? C.amber : C.blue;
  const clock = (big: boolean) => {
    const S = big ? 150 : 104;
    const R = big ? 62 : 42;
    const L = 2 * Math.PI * R;
    return (
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={{ flex: 'none' }}>
        <circle cx={S / 2} cy={S / 2} r={R} fill="none" stroke={C.panel} strokeWidth={big ? 12 : 10} />
        <circle
          cx={S / 2}
          cy={S / 2}
          r={R}
          fill="none"
          stroke={color}
          strokeWidth={big ? 12 : 10}
          strokeLinecap="round"
          strokeDasharray={`${L * frac} ${L}`}
          transform={`rotate(-90 ${S / 2} ${S / 2})`}
          style={{ transition: 'stroke-dasharray 250ms linear, stroke 300ms' }}
        />
        <g transform={`translate(${S / 2 - (big ? 22 : 16)} ${S / 2 - (big ? 22 : 16)}) scale(${big ? 44 / 24 : 32 / 24})`}>
          <g fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            {ICONS.clock}
          </g>
        </g>
      </svg>
    );
  };
  const time = (size: number) => (
    <div
      className={secs === 0 ? A.blink : undefined}
      style={{ fontFamily: display, fontWeight: 700, fontSize: size, lineHeight: 1, color, fontVariantNumeric: 'tabular-nums' }}
    >
      {pad(Math.floor(secs / 60))}:{pad(secs % 60)}
    </div>
  );
  // Icon-only buttons: Btn pads for text, so give them a square padding; the row wraps rather than leaving the card.
  const sq: CSSProperties = { padding: compact ? 9 : 12 };
  const buttons = compact ? (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 8, marginLeft: 'auto' }}>
      {running ? <Btn icon="pause" onClick={pause} size={19} style={sq} /> : <Btn icon="play" onClick={start} size={19} disabled={secs === 0} style={sq} />}
      <Btn icon="minus" ghost onClick={subMin} size={19} style={sq} />
      <Btn icon="plus" ghost onClick={addMin} size={19} style={sq} />
      <Btn icon="reset" ghost tone="grey" onClick={reset} size={19} style={sq} />
    </div>
  ) : (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {running ? (
        <Btn icon="pause" onClick={pause} size={19}>
          Pause
        </Btn>
      ) : (
        <Btn icon="play" onClick={start} size={19} disabled={secs === 0}>
          Démarrer
        </Btn>
      )}
      <Btn ghost onClick={subMin} size={19}>
        −1 min
      </Btn>
      <Btn ghost onClick={addMin} size={19}>
        +1 min
      </Btn>
      <Btn icon="reset" ghost tone="grey" onClick={reset} size={19} style={sq} />
    </div>
  );
  const card: CSSProperties = {
    boxSizing: 'border-box',
    background: C.card,
    borderRadius: 'var(--osd-radius)',
    boxShadow: SHADOW,
  };
  if (compact) {
    // One row, ~140 px tall: ring · label + time · buttons.
    return (
      <div className={cls} data-osd-timer={id} data-osd-timer-minutes={minutes} data-osd-timer-label={label} style={{ ...card, display: 'flex', alignItems: 'center', gap: 22, padding: '18px 26px', ...style }}>
        {clock(false)}
        <div style={{ minWidth: 190 }}>
          <Eyebrow c={secs === 0 ? C.coral : C.muted} size={20}>
            {secs === 0 ? 'Temps écoulé !' : label}
          </Eyebrow>
          {time(68)}
        </div>
        {buttons}
      </div>
    );
  }
  return (
    <div
      className={cls}
      data-osd-timer={id}
      data-osd-timer-minutes={minutes}
      data-osd-timer-label={label}
      style={{ ...card, width: 'max-content', minWidth: 480, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18, ...style }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {clock(true)}
        <div>
          <Eyebrow c={C.muted} size={20}>
            {label}
          </Eyebrow>
          {time(92)}
          {secs === 0 ? <div style={{ fontSize: 22, fontWeight: 600, color: C.coral }}>Temps écoulé !</div> : null}
        </div>
      </div>
      {buttons}
    </div>
  );
};

// ─── Live poll (show of hands → click to tally) ─────────────────────────────
const PollCtx = createContext<{ c: Record<string, number>; add: (id: string, d: number) => void } | null>(null);

const Poll = ({ children, cls, style }: { children: ReactNode; cls?: string; style?: CSSProperties }) => {
  const [c, setC] = useState<Record<string, number>>({});
  const add = (id: string, d: number) => setC((o) => ({ ...o, [id]: Math.max(0, (o[id] ?? 0) + d) }));
  return (
    <PollCtx.Provider value={{ c, add }}>
      <div className={cls} style={{ display: 'flex', flexDirection: 'column', gap: 12, ...style }}>
        {children}
      </div>
    </PollCtx.Provider>
  );
};

// Click the row to add a vote; the small − button removes one.
const PollRow = ({ id, label, tone = 'blue', icon }: { id: string; label: ReactNode; tone?: Tone; icon?: IconName }) => {
  const ctx = useContext(PollCtx);
  const n = ctx?.c[id] ?? 0;
  const max = Math.max(1, ...Object.values(ctx?.c ?? {}));
  return (
    <div style={{ display: 'flex', gap: 10, height: 76 }}>
      <button
        type="button"
        data-osd-interactive
        onClick={(e) => {
          e.currentTarget.blur();
          ctx?.add(id, 1);
        }}
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '0 24px 0 18px',
          border: 'none',
          borderRadius: 12,
          background: C.card,
          boxShadow: `inset 0 0 0 1.5px ${C.rule}`,
          cursor: 'pointer',
          fontFamily: body,
          fontSize: 26,
          color: C.ink,
          textAlign: 'left',
          overflow: 'hidden',
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${(n / max) * 100}%`,
            background: T[tone].bg,
            boxShadow: n ? `inset -4px 0 0 ${STRONG[tone]}` : 'none',
            transition: `width 450ms ${EASE}`,
          }}
        />
        {icon ? <Icon name={icon} size={30} color={T[tone].fg} style={{ position: 'relative' }} /> : null}
        <span style={{ position: 'relative', flex: 1 }}>{label}</span>
        <span
          style={{
            position: 'relative',
            fontFamily: display,
            fontWeight: 700,
            fontSize: 40,
            color: n ? T[tone].fg : C.faint,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {n}
        </span>
      </button>
      <button
        type="button"
        data-osd-interactive
        title="Retirer un vote"
        onClick={(e) => {
          e.currentTarget.blur();
          ctx?.add(id, -1);
        }}
        style={{
          flex: 'none',
          width: 52,
          border: 'none',
          borderRadius: 12,
          background: C.panel,
          color: C.muted,
          cursor: 'pointer',
          fontSize: 30,
          fontWeight: 600,
        }}
      >
        −
      </button>
    </div>
  );
};

// ─── Interactive checklist with live score ──────────────────────────────────
const CheckCtx = createContext<{ on: Record<string, number>; toggle: (id: string, w: number) => void } | null>(null);

const Checklist = ({ children, cls, style }: { children: ReactNode; cls?: string; style?: CSSProperties }) => {
  const [on, setOn] = useState<Record<string, number>>({});
  const toggle = (id: string, w: number) =>
    setOn((o) => {
      const n = { ...o };
      if (id in n) delete n[id];
      else n[id] = w;
      return n;
    });
  return (
    <CheckCtx.Provider value={{ on, toggle }}>
      <div className={cls} style={style}>
        {children}
      </div>
    </CheckCtx.Provider>
  );
};

const CheckItem = ({ id, w = 1, children, size = 27, tone = 'green' }: { id: string; w?: number; children: ReactNode; size?: number; tone?: Tone }) => {
  const ctx = useContext(CheckCtx);
  const on = !!ctx && id in ctx.on;
  return (
    <button
      type="button"
      data-osd-interactive
      onClick={(e) => {
        e.currentTarget.blur();
        ctx?.toggle(id, w);
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        width: '100%',
        boxSizing: 'border-box',
        padding: '12px 18px',
        border: 'none',
        borderRadius: 12,
        background: on ? T[tone].bg : C.card,
        boxShadow: on ? `inset 0 0 0 2.5px ${STRONG[tone]}` : `inset 0 0 0 1.5px ${C.rule}`,
        cursor: 'pointer',
        fontFamily: body,
        fontSize: size,
        lineHeight: 1.3,
        color: C.ink,
        textAlign: 'left',
        transition: `all 250ms ${EASE}`,
      }}
    >
      <span
        style={{
          flex: 'none',
          width: 36,
          height: 36,
          borderRadius: 8,
          background: on ? STRONG[tone] : '#fff',
          boxShadow: on ? 'none' : `inset 0 0 0 2.5px ${C.faint}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {on ? <Icon name="check" size={24} color="#fff" sw={3} /> : null}
      </span>
      <span style={{ flex: 1 }}>{children}</span>
      {w !== 1 ? <span style={{ fontFamily: mono, fontSize: 20, color: C.muted }}>×{w}</span> : null}
    </button>
  );
};

// Live score: `levels` sorted ascending by `min`; the highest reached applies.
const CheckScore = ({
  max,
  levels,
  label = 'Score',
  style,
}: {
  max: number;
  levels: { min: number; text: string; tone: Tone }[];
  label?: string;
  style?: CSSProperties;
}) => {
  const ctx = useContext(CheckCtx);
  const score = ctx ? Object.values(ctx.on).reduce((a, x) => a + x, 0) : 0;
  const lv = levels.filter((l) => score >= l.min).pop() ?? levels[0];
  return (
    <div
      style={{
        boxSizing: 'border-box',
        background: C.card,
        borderRadius: 'var(--osd-radius)',
        boxShadow: SHADOW,
        padding: '26px 30px',
        ...style,
      }}
    >
      <Eyebrow c={C.muted} size={20}>
        {label}
      </Eyebrow>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 96, lineHeight: 1, color: STRONG[lv.tone] === C.yellow ? C.amber : STRONG[lv.tone] }}>
          {score}
        </span>
        <span style={{ fontFamily: display, fontWeight: 600, fontSize: 40, color: C.faint }}>/ {max}</span>
      </div>
      <div style={{ marginTop: 14, height: 14, borderRadius: 7, background: C.panel, overflow: 'hidden' }}>
        <div
          style={{
            width: `${Math.min(100, (score / max) * 100)}%`,
            height: '100%',
            background: STRONG[lv.tone],
            transition: `width 500ms ${EASE}`,
          }}
        />
      </div>
      <div style={{ marginTop: 16, fontSize: 26, lineHeight: 1.35, fontWeight: 600, color: T[lv.tone].fg }}>{lv.text}</div>
    </div>
  );
};

// ─── Hotspot ("repérez les failles") ────────────────────────────────────────
CSS.push(`
.${P}-hs-tip{opacity:0;transform:translateY(10px) scale(.98);pointer-events:none;transition:opacity 350ms ${EASE},transform 500ms ${EASE}}
.${P}-hs-open + .${P}-hs-tip{opacity:1;transform:none}
`);

const Hotspot = ({
  n,
  x,
  y,
  title,
  children,
  at: beat,
  w = 440,
  side = 'right',
}: {
  n: number;
  x: number;
  y: number;
  title: ReactNode;
  children: ReactNode;
  at?: number;
  w?: number;
  side?: 'right' | 'left' | 'below';
}) => {
  const [open, setOpen] = useState(false);
  const tipPos: CSSProperties =
    side === 'right' ? { left: 44, top: -26 } : side === 'left' ? { right: 44, top: -26 } : { left: -w / 2, top: 44 };
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 0, height: 0, zIndex: open ? 10 : 4 }}>
      <button
        type="button"
        data-osd-interactive
        onClick={(e) => {
          e.currentTarget.blur();
          setOpen((o) => !o);
        }}
        className={cx(open && k('hs-open'), beat ? k(`hsb${beat}`) : null)}
        style={{
          position: 'absolute',
          left: -26,
          top: -26,
          width: 52,
          height: 52,
          borderRadius: 999,
          border: '4px solid #fff',
          background: C.coral,
          color: '#fff',
          fontFamily: display,
          fontWeight: 700,
          fontSize: 28,
          cursor: 'pointer',
          boxShadow: '0 6px 16px -6px rgba(180,60,40,.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
        }}
      >
        {n}
      </button>
      <div
        className={k('hs-tip')}
        style={{
          position: 'absolute',
          ...tipPos,
          width: w,
          boxSizing: 'border-box',
          background: C.card,
          borderRadius: 14,
          boxShadow: `0 0 0 2px ${C.coral}, 0 24px 48px -20px rgba(20,40,60,.5)`,
          padding: '16px 20px',
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 24, color: T.coral.fg, lineHeight: 1.3 }}>{title}</div>
        <div style={{ marginTop: 6, fontSize: 22, lineHeight: 1.4, color: C.ink }}>{children}</div>
      </div>
      <span
        className={A.pulse}
        style={{ position: 'absolute', left: -26, top: -26, width: 52, height: 52, borderRadius: 999, background: C.coral, zIndex: -1 }}
      />
    </div>
  );
};

// ─── Formateur portrait (photo framed by the brand squares) ─────────────────
const Portrait = ({ w = 240, x, y, cls }: { w?: number; x: number; y: number; cls?: string }) => {
  const h = Math.round((w * 275) / 230);
  return (
    <div className={cls} style={{ position: 'absolute', left: x, top: y, width: w, height: h }}>
      <div className={k('sqb')} style={{ position: 'absolute', left: Math.round(w * 0.2), top: Math.round(h * 0.2), width: w, height: h, background: G.yellow }} />
      <div
        className={k('sqa')}
        style={{ position: 'absolute', left: -Math.round(w * 0.14), top: -Math.round(w * 0.14), width: Math.round(w * 0.55), height: Math.round(w * 0.55), background: G.blue }}
      />
      <img
        src={formateur}
        alt={AUTHOR}
        style={{
          position: 'relative',
          display: 'block',
          width: w,
          height: h,
          objectFit: 'cover',
          boxShadow: '0 24px 50px -24px rgba(0,0,0,.55)',
        }}
      />
    </div>
  );
};

// ─── Section divider page ───────────────────────────────────────────────────
const SecItem = ({ n, children }: { n: number; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, ...dl(700 + n * 140) }}>
    <MiniSquares size={26} />
    <span style={{ fontSize: 32, lineHeight: 1.3, color: C.ink }}>{children}</span>
  </div>
);

const Section = ({
  n,
  title,
  sub,
  dur,
  kind,
  children,
}: {
  n: number;
  title: ReactNode;
  sub: ReactNode;
  dur: string;
  kind?: Kind;
  children: ReactNode;
}) => (
  <Frame mod={n} chrome={false}>
    <Squares s={430} x={130} y={250}>
      <div
        className={A.pop}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 430,
          height: 430,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          padding: '18px 0 0 34px',
          boxSizing: 'border-box',
          fontFamily: display,
          fontWeight: 700,
          fontSize: 300,
          lineHeight: 1,
          color: '#fff',
          letterSpacing: '-0.02em',
          ...dl(500),
        }}
      >
        {pad(n)}
      </div>
    </Squares>
    <div style={{ position: 'absolute', left: 820, top: 230, width: 980 }}>
      <div className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <Eyebrow size={28}>Module {pad(n)}</Eyebrow>
        <Tag tone="grey" size={22}>
          <Icon name="clock" size={22} /> {dur}
        </Tag>
        {kind ? <KindBadge kind={kind} /> : null}
      </div>
      <h1
        className={A.in}
        style={{
          margin: '22px 0 0',
          fontFamily: display,
          fontWeight: 700,
          fontSize: 104,
          lineHeight: 1.0,
          letterSpacing: '-0.01em',
          color: C.ink,
          ...dl(120),
        }}
      >
        {title}
      </h1>
      <p className={A.in} style={{ margin: '24px 0 0', fontSize: 32, lineHeight: 1.4, color: C.soft, ...dl(240) }}>
        {sub}
      </p>
      <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 18 }}>{children}</div>
    </div>
    <img
      src={logoWide}
      alt="Technologia"
      style={{ position: 'absolute', left: 120, bottom: 40, height: 44, display: 'block', mixBlendMode: 'multiply' }}
    />
    <Footer2 />
  </Frame>
);

// Minimal footer (page number only) for chrome-less pages.
const Footer2 = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <span style={{ position: 'absolute', right: 120, bottom: 48, fontFamily: mono, fontSize: 20, color: C.muted }}>
      {pad(current)} / {pad(total)}
    </span>
  );
};

// ─── Tools & apps (monogram tiles, no vendor logos) ─────────────────────────
const APPS = {
  chatgpt: { name: 'ChatGPT', short: 'ChatGPT', mono: 'GPT', bg: 'linear-gradient(135deg, #1F8A70 0%, #11604E 100%)' },
  gemini: { name: 'Gemini', short: 'Gemini', mono: 'Ge', bg: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)' },
  copilot: { name: 'Microsoft 365 Copilot', short: 'Copilot', mono: 'Co', bg: 'linear-gradient(135deg, #2F6BFF 0%, #7442E0 60%, #C2369E 100%)' },
  claude: { name: 'Claude', short: 'Claude', mono: 'Cl', bg: 'linear-gradient(135deg, #D9774B 0%, #B5532E 100%)' },
  outlook: { name: 'Outlook', short: 'Outlook', mono: 'O', bg: 'linear-gradient(135deg, #1A7FD6 0%, #0F5CA8 100%)' },
  teams: { name: 'Teams', short: 'Teams', mono: 'T', bg: 'linear-gradient(135deg, #6264D9 0%, #464EB8 100%)' },
  google: { name: 'Google Workspace', short: 'Google', mono: 'G', bg: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)' },
  notion: { name: 'Notion', short: 'Notion', mono: 'N', bg: 'linear-gradient(135deg, #3A3F44 0%, #111315 100%)' },
  clickup: { name: 'ClickUp', short: 'ClickUp', mono: 'Cu', bg: 'linear-gradient(135deg, #7B68EE 0%, #FD5DA8 100%)' },
  trello: { name: 'Trello', short: 'Trello', mono: 'Tr', bg: 'linear-gradient(135deg, #0C66E4 0%, #0747A6 100%)' },
  planner: { name: 'Microsoft Planner', short: 'Planner', mono: 'Pl', bg: 'linear-gradient(135deg, #31A06C 0%, #1C7A4F 100%)' },
  asana: { name: 'Asana', short: 'Asana', mono: 'As', bg: 'linear-gradient(135deg, #F06A6A 0%, #D84B78 100%)' },
  monday: { name: 'monday.com', short: 'monday', mono: 'Mo', bg: 'linear-gradient(135deg, #FF3D57 0%, #FFCB00 55%, #00CA72 100%)' },
  otter: { name: 'Otter.ai', short: 'Otter', mono: 'Ot', bg: 'linear-gradient(135deg, #2A6DF4 0%, #173E9C 100%)' },
  zoom: { name: 'Zoom', short: 'Zoom', mono: 'Zm', bg: 'linear-gradient(135deg, #2D8CFF 0%, #0B5CD5 100%)' },
  excel: { name: 'Excel', short: 'Excel', mono: 'X', bg: 'linear-gradient(135deg, #1D9A5B 0%, #107040 100%)' },
  word: { name: 'Word', short: 'Word', mono: 'W', bg: 'linear-gradient(135deg, #2B7CD3 0%, #185ABD 100%)' },
  mistral: { name: 'Le Chat (Mistral AI)', short: 'Le Chat', mono: 'M', bg: 'linear-gradient(135deg, #FF8205 0%, #E10500 100%)' },
  perplexity: { name: 'Perplexity', short: 'Perplexity', mono: 'Px', bg: 'linear-gradient(135deg, #20808D 0%, #13343B 100%)' },
};
type AppId = keyof typeof APPS;

// Real vendor logos (slides/<id>/assets/logos). `crop` = the mark's box inside a wider lockup image,
// as fractions of the image (x, y, w, h) + its aspect ratio (height / width).
// Apps without a logo file (Smartsheet, Procore…) keep their monogram tile.
const APP_LOGOS: Partial<Record<AppId, { src: string; crop?: { x: number; y: number; w: number; ar: number } }>> = {
  copilot: { src: lgCopilot },
  claude: { src: lgClaude },
  chatgpt: { src: lgChatgpt },
  gemini: { src: lgGemini },
  outlook: { src: lgOutlook },
  teams: { src: lgTeams },
  excel: { src: lgExcel },
  word: { src: lgWord },
};

const AppTile = ({ id, size = 44, cls, style }: { id: AppId; size?: number; cls?: string; style?: CSSProperties }) => {
  const logo = APP_LOGOS[id];
  if (logo) {
    const inner = Math.round(size * 0.7);
    const off = (size - inner) / 2;
    const c = logo.crop;
    const imgW = c ? inner / c.w : inner;
    return (
      <span
        className={cls}
        title={APPS[id].name}
        style={{
          flex: 'none',
          position: 'relative',
          overflow: 'hidden',
          width: size,
          height: size,
          boxSizing: 'border-box',
          borderRadius: Math.round(size * 0.26),
          background: '#fff',
          boxShadow: `inset 0 0 0 ${size >= 60 ? 1.5 : 1}px ${C.rule}, 0 6px 14px -8px rgba(20,60,100,.45)`,
          display: 'inline-flex',
          alignItems: 'center',
          fontSize: Math.round(size * 0.42),
          ...style,
        }}
      >
        {/* zero-width text: gives the tile the same baseline as a monogram tile */}
        <span aria-hidden style={{ width: 0, overflow: 'hidden' }}>{'​'}</span>
        <img
          src={logo.src}
          alt={APPS[id].name}
          style={
            c
              ? { position: 'absolute', width: imgW, height: imgW * c.ar, left: off - c.x * imgW, top: off - c.y * imgW * c.ar, maxWidth: 'none' }
              : { position: 'absolute', left: off, top: off, width: inner, height: inner, objectFit: 'contain' }
          }
        />
      </span>
    );
  }
  return (
  <span
    className={cls}
    style={{
      flex: 'none',
      width: size,
      height: size,
      borderRadius: Math.round(size * 0.26),
      background: APPS[id].bg,
      color: '#fff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: display,
      fontWeight: 700,
      fontSize: Math.round(size * (APPS[id].mono.length > 2 ? 0.32 : 0.42)),
      letterSpacing: '-0.01em',
      boxShadow: '0 6px 14px -8px rgba(20,60,100,.55)',
      ...style,
    }}
  >
    {APPS[id].mono}
  </span>
  );
};

const AppChip = ({ id, size = 22 }: { id: AppId; size?: number }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontWeight: 600, fontSize: size, color: C.ink, whiteSpace: 'nowrap' }}>
    <AppTile id={id} size={Math.round(size * 1.5)} />
    {APPS[id].short}
  </span>
);

// Application window: title bar with the app tile, then free content.
const AppWin = ({
  id,
  title,
  children,
  pad: p = 22,
  cls,
  style,
}: {
  id: AppId;
  title?: ReactNode;
  children: ReactNode;
  pad?: number;
  cls?: string;
  style?: CSSProperties;
}) => (
  <div className={cls} style={{ boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, overflow: 'hidden', ...style }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', background: C.panel, borderBottom: `1.5px solid ${C.rule}` }}>
      <AppTile id={id} size={30} />
      <span style={{ fontWeight: 700, fontSize: 20, color: C.ink, whiteSpace: 'nowrap' }}>{APPS[id].name}</span>
      {title ? <span style={{ fontSize: 19, color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>· {title}</span> : null}
      <span style={{ marginLeft: 'auto', display: 'flex', gap: 7 }}>
        <span style={{ width: 11, height: 11, borderRadius: 99, background: C.faint }} />
        <span style={{ width: 11, height: 11, borderRadius: 99, background: C.faint }} />
        <span style={{ width: 11, height: 11, borderRadius: 99, background: C.faint }} />
      </span>
    </div>
    <div style={{ padding: p }}>{children}</div>
  </div>
);


// ─── Photos (Wikimedia Commons, free licences; full credits on the last page) ─
const PH = {
  achat: { src: phAchat, credit: 'Shixart1985 · CC BY 2.0' },
  airCanada: { src: phAirCanada, credit: 'Adam Moreira · CC BY-SA 4.0' },
  berlaymont: { src: phBerlaymont, credit: 'KenSwe72 · CC BY 4.0' },
  binnenhof: { src: phBinnenhof, credit: 'Michielverbeek · CC BY-SA 4.0' },
  datacenter: { src: phDatacenter, credit: 'PiDatacenters · CC BY-SA 4.0' },
  deepBlue: { src: phDeepBlue, credit: 'Anton Chiang · CC BY 2.0' },
  entrevue: { src: phEntrevue, credit: 'Amtec Photos · CC BY-SA 2.0' },
  fondOeil: { src: phFondOeil, credit: 'Mikael Häggström · CC0' },
  hinton: { src: phHinton, credit: 'Xuthoria · CC BY-SA 4.0' },
  leeSedol: { src: phLeeSedol, credit: 'LG Electronics · CC BY 2.0' },
  mccarthy: { src: phMcCarthy, credit: 'null0 · CC BY-SA 2.0' },
  montreal: { src: phMontreal, credit: 'Taxiarchos228 · CC BY 3.0' },
  paiement: { src: phPaiement, credit: 'Daylon124 · CC0' },
  parlement: { src: phParlement, credit: 'Marc-Lautenbacher · CC BY-SA 4.0' },
  proteine: { src: phProteine, credit: 'Jane Richardson · CC BY 3.0' },
  radiologie: { src: phRadiologie, credit: 'Bill Branson, NCI · domaine public' },
  timesSquare: { src: phTimesSquare, credit: 'Kevani · CC BY-SA 4.0' },
  troisRivieres: { src: phTroisRivieres, credit: 'Quintin Soloviev · CC BY 4.0' },
  turing: { src: phTuring, credit: 'Domaine public' },
  camionMine: { src: phCamionMine, credit: 'R. Hill, CSIRO · CC BY 3.0' },
  camerasMagasin: { src: phCamerasMagasin, credit: 'MIKI Yoshihito · domaine public' },
};
type PhotoId = keyof typeof PH;

// Cover-cropped photo with an optional credit tag (bottom-right).
const Photo = ({
  id,
  w,
  h,
  pos = 'center',
  radius = 18,
  credit = true,
  cls,
  style,
  children,
}: {
  id: PhotoId;
  w: number | string;
  h: number | string;
  pos?: string;
  radius?: number;
  credit?: boolean;
  cls?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) => (
  <div className={cls} style={{ position: 'relative', width: w, height: h, flex: 'none', borderRadius: radius, overflow: 'hidden', background: C.panel, ...style }}>
    <img src={PH[id].src} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, display: 'block' }} />
    {children}
    {credit ? (
      <span style={{ position: 'absolute', right: 8, bottom: 6, padding: '2px 8px', borderRadius: 6, background: 'rgba(20,24,28,.55)', color: '#fff', fontSize: 14, lineHeight: 1.35, whiteSpace: 'nowrap' }}>
        {PH[id].credit}
      </span>
    ) : null}
  </div>
);

// What you type.
const PromptBox = ({ children, label = 'Votre demande (prompt)', size = 24, cls, style }: { children: ReactNode; label?: string; size?: number; cls?: string; style?: CSSProperties }) => (
  <div className={cls} style={{ boxSizing: 'border-box', background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${C.blue}`, padding: '16px 22px 18px 28px', ...style }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
      <Icon name="user" size={22} color={C.blue} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 19, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.blue }}>{label}</span>
    </div>
    <div style={{ fontSize: size, lineHeight: 1.45, color: C.ink }}>{children}</div>
  </div>
);

// What the assistant answers.
const AnswerBox = ({ id = 'chatgpt', children, label, size = 23, cls, style }: { id?: AppId; children: ReactNode; label?: string; size?: number; cls?: string; style?: CSSProperties }) => (
  <div className={cls} style={{ boxSizing: 'border-box', background: T.violet.bg, borderRadius: 16, boxShadow: `inset 0 0 0 1.5px ${T.violet.bd}`, padding: '16px 22px 18px', ...style }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
      <AppTile id={id} size={28} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 19, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.violet.fg }}>{label ?? `Réponse · ${APPS[id].short}`}</span>
    </div>
    <div style={{ fontSize: size, lineHeight: 1.45, color: C.ink }}>{children}</div>
  </div>
);

// ─── Fil rouge : la Mutuelle des Érables (fictive) ──────────────────────────
const CAST = {
  nathalie: { name: 'Nathalie', role: 'Vice-présidente, transformation numérique', tone: 'blue' as Tone, icon: 'rocket' as IconName },
  samir: { name: 'Samir', role: 'Directeur des ressources humaines', tone: 'green' as Tone, icon: 'users' as IconName },
  chloe: { name: 'Chloé', role: 'Responsable de la protection des renseignements personnels', tone: 'violet' as Tone, icon: 'shield' as IconName },
  vincent: { name: 'Vincent', role: 'Directeur marketing et expérience membre', tone: 'yellow' as Tone, icon: 'megaphone' as IconName },
  mei: { name: 'Mei', role: 'Analyste de données', tone: 'teal' as Tone, icon: 'chart' as IconName },
};
type CastId = keyof typeof CAST;

const Who = ({ id, size = 24, sub = true }: { id: CastId; size?: number; sub?: boolean }) => {
  const c = CAST[id];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={c.icon} tone={c.tone} size={Math.round(size * 1.9)} solid />
      <span style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: size, color: C.ink, lineHeight: 1.15 }}>{c.name}</span>
        {sub ? <span style={{ fontSize: Math.max(19, Math.round(size * 0.8)), color: C.muted, lineHeight: 1.3 }}>{c.role}</span> : null}
      </span>
    </span>
  );
};

// Small "fil rouge" ribbon used on case pages.
const FilRouge = ({ children, cls, style }: { children: ReactNode; cls?: string; style?: CSSProperties }) => (
  <div
    className={cls}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '6px 16px 6px 10px',
      borderRadius: 999,
      background: T.teal.bg,
      boxShadow: `inset 0 0 0 1.5px ${T.teal.bd}`,
      color: T.teal.fg,
      fontWeight: 700,
      fontSize: 20,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    <Icon name="leaf" size={22} sw={2.2} /> Fil rouge · {children}
  </div>
);

// Numbered take-away row (synthesis pages).
const SynthRow = ({ n, tone, children, d }: { n: number; tone: Tone; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 22, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 26px', ...dl(d) }}>
    <Num n={n} tone={tone} size={50} />
    <div style={{ fontSize: 27, lineHeight: 1.35, color: C.ink }}>{children}</div>
  </div>
);

// Blue card on synthesis pages: what to do back at your desk.
const PosteCard = ({ title = 'Dès lundi, à votre poste', top = 270, children }: { title?: string; top?: number; children: ReactNode }) => (
  <div
    className={A.right}
    style={{ position: 'absolute', left: 1250, top, width: 550, boxSizing: 'border-box', background: G.blue, borderRadius: 20, boxShadow: SHADOW, padding: '28px 32px', color: '#fff', ...dl(500) }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Icon name="rocket" size={34} color={C.yellow} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 24, letterSpacing: '0.12em', color: '#fff', textTransform: 'uppercase' }}>{title}</span>
    </div>
    <div style={{ marginTop: 18, fontSize: 26, lineHeight: 1.5, color: '#F2F8FC' }}>{children}</div>
  </div>
);

// Synthesis page shell: up to 5 take-aways left, PosteCard right.
const SynthPage = ({ mod, title, poste, children }: { mod: number; title: ReactNode; poste: ReactNode; children: ReactNode }) => (
  <Frame mod={mod} kind="synthese">
    <Title>{title}</Title>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1080, display: 'flex', flexDirection: 'column', gap: 18 }}>{children}</div>
    <PosteCard>{poste}</PosteCard>
  </Frame>
);

// ─── Client versions: APSM / Sobeys (one deck, two sets of ateliers) ────────
// The choice is made on the cover (ClientSwitch), stored in localStorage and broadcast:
// every page re-renders, and the presenter window / projection follow (storage event).
// Server-side rendering (timers manifest) sees the default client.
type ClientId = 'apsm' | 'sobeys';
const DEFAULT_CLIENT: ClientId = 'apsm';
const CLIENT_KEY = `osd-client-${SLIDE_ID}`;
const CLIENT_EVENT = 'osd-client-change';
const CLIENTS: Record<ClientId, { name: string; full: string; sector: string; color: string; changes: [string, string][] }> = {
  apsm: {
    name: 'APSM',
    full: 'Association paritaire pour la santé et la sécurité du travail du secteur minier',
    sector: 'Santé et sécurité · secteur minier',
    color: '#2B2F33',
    changes: [
      ['Atelier 1', 'Message de sécurité (chute de roches) et vérification d’un article du règlement sur la santé et la sécurité dans les mines'],
      ['Atelier 2', 'Cas fictif : caméras de fatigue dans les camions de la mine Val-Laurier (Loi 25)'],
      ['Atelier 3', 'Mini-charte avec des règles propres au secteur minier'],
    ],
  },
  sobeys: {
    name: 'Sobeys',
    full: 'Sobeys inc.',
    sector: 'Épicerie et commerce de détail',
    color: '#3A9F45',
    changes: [
      ['Atelier 1', 'Client mécontent (produit périmé), demande de sources, images d’épicerie et biais'],
      ['Atelier 2', 'Cas réel : reconnaissance faciale chez Rite Aid (FTC) et parallèle Canadian Tire'],
      ['Atelier 3', 'Mini-charte avec des règles propres au commerce de détail'],
    ],
  },
};
// @@client-logos: the build swaps the next two lines when slides/<id>/assets/logos/client-<id>.(svg|png|jpg|webp)
// and slides/<id>/assets/guide-<id>.pdf exist.
const CLIENT_LOGOS: Partial<Record<ClientId, string>> = { apsm: clientLogo_apsm, sobeys: clientLogo_sobeys };
const CLIENT_GUIDES: Partial<Record<ClientId, string>> = { apsm: clientGuide_apsm, sobeys: clientGuide_sobeys };

const readClient = (): ClientId => {
  try {
    const v = window.localStorage.getItem(CLIENT_KEY);
    return v === 'apsm' || v === 'sobeys' ? v : DEFAULT_CLIENT;
  } catch {
    return DEFAULT_CLIENT;
  }
};
const setClient = (c: ClientId) => {
  try {
    window.localStorage.setItem(CLIENT_KEY, c);
  } catch {}
  window.dispatchEvent(new CustomEvent(CLIENT_EVENT, { detail: c }));
};
const useClient = (): ClientId => {
  const [c, setC] = useState<ClientId>(DEFAULT_CLIENT);
  useEffect(() => {
    const sync = () => setC(readClient());
    sync();
    window.addEventListener(CLIENT_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CLIENT_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);
  return c;
};
// Inline variant: <ByClient apsm={…} sobeys={…} />
const ByClient = ({ apsm, sobeys }: { apsm: ReactNode; sobeys: ReactNode }) => <>{useClient() === 'apsm' ? apsm : sobeys}</>;

// Client logo, or a typographic badge until the logo file is added.
const ClientMark = ({ id, h = 40, maxW }: { id?: ClientId; h?: number; maxW?: number }) => {
  const active = useClient();
  const c = id ?? active;
  const src = CLIENT_LOGOS[c];
  if (src) return <img src={src} alt={CLIENTS[c].name} style={{ height: h, width: 'auto', maxWidth: maxW, objectFit: 'contain', display: 'block' }} />;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', height: h, padding: `0 ${Math.round(h * 0.32)}px`, borderRadius: Math.round(h * 0.18), background: CLIENTS[c].color, color: '#fff', fontFamily: display, fontWeight: 700, fontSize: Math.round(h * 0.56), letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
      {CLIENTS[c].name}
    </span>
  );
};

// Cover selector: ONE button showing the chosen client's logo (what gets printed). Clicking it
// opens a popup over the blurred slide to pick the client; the hint only shows on hover.
CSS.push(`
.${P}-csw{position:relative;display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:0 30px;min-width:200px;height:104px;border:none;border-radius:18px;background:#fff;cursor:pointer;box-shadow:0 0 0 2px var(--osd-rule,#DCE3E8);transition:box-shadow 220ms ${EASE},transform 220ms ${EASE}}
.${P}-csw:hover,.${P}-csw:focus-visible{box-shadow:0 0 0 4px var(--osd-accent,#1F78C1),0 14px 30px -14px rgba(20,60,100,.55);transform:translateY(-2px);outline:none}
.${P}-csw::after{content:attr(data-hint);position:absolute;left:0;bottom:calc(100% + 12px);padding:7px 14px;border-radius:9px;background:#2B2F33;color:#fff;font-size:20px;line-height:1.2;white-space:nowrap;opacity:0;transform:translateY(-4px);pointer-events:none;transition:opacity 180ms ${EASE},transform 180ms ${EASE}}
.${P}-csw:hover::after,.${P}-csw:focus-visible::after{opacity:1;transform:none}
@keyframes ${P}-cpop-in{from{opacity:0}to{opacity:1}}
@keyframes ${P}-cpop-card{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}
.${P}-copt{box-sizing:border-box;text-align:left;font:inherit;color:inherit;background:#fff;border:none;border-radius:18px;padding:22px 24px 24px;cursor:pointer;box-shadow:0 0 0 2px #DCE3E8;transition:box-shadow 200ms ${EASE},transform 200ms ${EASE}}
.${P}-copt:hover,.${P}-copt:focus-visible{box-shadow:0 0 0 4px #1F78C1,0 18px 34px -18px rgba(20,60,100,.5);transform:translateY(-3px);outline:none}
.${P}-copt[aria-checked="true"]{box-shadow:0 0 0 4px #1F78C1}
@media print{.${P}-csw::after,.${P}-cpop{display:none!important}.${P}-csw{box-shadow:none!important;transform:none!important}}
`);

const PICKER_FONT = '"Barlow", "Segoe UI", system-ui, sans-serif';
const PICKER_DISPLAY = '"Barlow Condensed", "Arial Narrow", "Segoe UI", sans-serif';

const ClientPicker = ({ onClose }: { onClose: () => void }) => {
  const current = useClient();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      e.stopImmediatePropagation();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose]);
  return createPortal(
    <div
      className={`${P}-cpop`}
      data-osd-interactive
      data-inspector-ui=""
      role="dialog"
      aria-modal="true"
      aria-label="Choisir la version client"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      onPointerDown={(e) => e.stopPropagation()}
      style={{ position: 'fixed', inset: 0, zIndex: 2147483000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, boxSizing: 'border-box', background: 'rgba(15, 25, 35, 0.38)', backdropFilter: 'blur(16px) saturate(1.1)', WebkitBackdropFilter: 'blur(16px) saturate(1.1)', fontFamily: PICKER_FONT, color: '#2B2F33', animation: `${P}-cpop-in 200ms ease-out both` }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', width: 'min(1040px, 100%)', maxHeight: '100%', overflow: 'auto', boxSizing: 'border-box', padding: '30px 34px 34px', background: '#F4F7F9', borderRadius: 24, boxShadow: '0 30px 80px -20px rgba(10,20,30,.55)', animation: `${P}-cpop-card 260ms ${EASE} both` }}
      >
        <button
          type="button"
          aria-label="Fermer"
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 18, width: 40, height: 40, borderRadius: 999, border: 'none', background: '#fff', boxShadow: '0 0 0 1px #DCE3E8', cursor: 'pointer', fontSize: 24, lineHeight: 1, color: '#4B545B' }}
        >
          ×
        </button>
        <div style={{ fontFamily: PICKER_DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: '0.02em', textTransform: 'uppercase' }}>Version client</div>
        <div style={{ marginTop: 6, fontSize: 18, lineHeight: 1.45, color: '#4B545B', maxWidth: 820 }}>
          Choisissez le client : son logo remplace l’autre sur la couverture et en pied de page, et les trois ateliers s’adaptent à son secteur. Tout le reste de la formation est commun.
        </div>
        <div role="radiogroup" style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 22 }}>
          {(Object.keys(CLIENTS) as ClientId[]).map((id) => {
            const cl = CLIENTS[id];
            const on = id === current;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={on}
                className={`${P}-copt`}
                onClick={(e) => {
                  e.stopPropagation();
                  setClient(id);
                  onClose();
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 118, borderRadius: 12, background: '#fff', boxShadow: 'inset 0 0 0 1.5px #E7ECF0' }}>
                  <ClientMark id={id} h={78} maxW={250} />
                </div>
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: PICKER_DISPLAY, fontWeight: 700, fontSize: 30, lineHeight: 1.05 }}>{cl.name}</div>
                    <div style={{ marginTop: 2, fontSize: 16, color: '#77818A' }}>{cl.sector}</div>
                  </div>
                  {on && <span style={{ flex: 'none', padding: '4px 12px', borderRadius: 999, background: '#1F78C1', color: '#fff', fontWeight: 600, fontSize: 14 }}>Version actuelle</span>}
                </div>
                <div style={{ marginTop: 16, fontFamily: PICKER_DISPLAY, fontWeight: 700, fontSize: 15, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1F78C1' }}>Ce qui change</div>
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {cl.changes.map(([k, v]) => (
                    <div key={k} style={{ fontSize: 16, lineHeight: 1.4, color: '#2B2F33' }}>
                      <b style={{ color: '#1F78C1' }}>{k}</b> · {v}
                    </div>
                  ))}
                  <div style={{ fontSize: 16, lineHeight: 1.4, color: '#2B2F33' }}>
                    <b style={{ color: '#1F78C1' }}>Guide</b> · guide du participant (PDF) propre à {cl.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
};

const ClientSwitch = ({ cls, style }: { cls?: string; style?: CSSProperties }) => {
  const c = useClient();
  const [open, setOpen] = useState(false);
  return (
    <div className={cls} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14, ...style }}>
      <button
        type="button"
        data-osd-interactive
        data-inspector-ui=""
        className={`${P}-csw`}
        data-hint="Cliquer pour changer de version client"
        title="Changer de version client"
        aria-haspopup="dialog"
        onClick={(e) => {
          e.stopPropagation();
          e.currentTarget.blur();
          setOpen(true);
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <ClientMark id={c} h={72} maxW={240} />
      </button>
      <div style={{ fontSize: 21, color: C.soft }}>
        Préparé pour <b style={{ color: C.ink }}>{CLIENTS[c].name}</b> · {CLIENTS[c].sector}
      </div>
      {open && <ClientPicker onClose={() => setOpen(false)} />}
    </div>
  );
};

// Link to the active client's participant guide (PDF), when it exists.
const GuideLink = ({ cls, style }: { cls?: string; style?: CSSProperties }) => {
  const c = useClient();
  const href = CLIENT_GUIDES[c];
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      data-osd-interactive
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className={cls}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 10, background: T.blue.bg, boxShadow: `inset 0 0 0 1.5px ${T.blue.bd}`, color: T.blue.fg, fontWeight: 600, fontSize: 22, textDecoration: 'none', ...style }}
    >
      <Icon name="doc" size={24} /> Guide du participant · {CLIENTS[c].name} (PDF)
    </a>
  );
};

// ─── Transitions: RISE for the house, BLOOM for section dividers ────────────
const HOLD: Keyframe[] = [{ opacity: 1 }, { opacity: 1 }];
export const transition: SlideTransition = {
  duration: 260,
  exit: { duration: 260, easing: EASE_IN, keyframes: HOLD },
  enter: {
    duration: 260,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};
const BLOOM: SlideTransition = {
  duration: 240,
  exit: { duration: 240, easing: EASE_IN, keyframes: HOLD },
  enter: {
    duration: 240,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'scale(0.97)' },
      { opacity: 1, transform: 'scale(1)' },
    ],
  },
};

// ═══ 00-open ═══════════════════════════════════════════════════════════

// ─── Cover ──────────────────────────────────────────────────────────────────
// A balance weighs "IA" against "humain"; the brand squares sit behind it.
const OP_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <img src={logoStack} alt="Technologia" className={A.fade} style={{ position: 'absolute', left: 112, top: 78, height: 150, display: 'block' }} />
    <div style={{ position: 'absolute', left: 120, top: 318, width: 980 }}>
      <Eyebrow cls={A.in} size={28}>
        Formation IA114 · 1 jour
      </Eyebrow>
      <h1
        className={A.in}
        style={{ margin: '18px 0 0', fontFamily: display, fontWeight: 700, fontSize: 118, lineHeight: 1.0, letterSpacing: '-0.01em', color: C.ink, ...dl(120) }}
      >
        Introduction à l’IA
        <br />
        et à l’éthique
      </h1>
      <p className={A.in} style={{ margin: '26px 0 0', fontSize: 36, lineHeight: 1.3, color: C.soft, ...dl(240) }}>
        Comprendre les enjeux, les usages et les cadres responsables de l’intelligence artificielle
      </p>
    </div>
    <ClientSwitch cls={A.in} style={{ position: 'absolute', left: 120, top: 770, ...dl(420) }} />
    <div className={A.in} style={{ position: 'absolute', left: 660, top: 862, display: 'flex', alignItems: 'center', gap: 22, ...dl(520) }}>
      <img
        src={formateur}
        alt={AUTHOR}
        style={{ width: 96, height: 96, borderRadius: 999, objectFit: 'cover', objectPosition: '50% 20%', display: 'block', boxShadow: `0 0 0 4px #fff, 0 0 0 7px ${C.yellow}` }}
      />
      <div>
        <div style={{ fontSize: 30, fontWeight: 600, color: C.ink }}>{AUTHOR}</div>
        <div style={{ fontSize: 24, color: C.muted }}>Formateur · Technologia</div>
      </div>
    </div>

    <Squares s={250} x={1532} y={62} delay={200} />
    <div className={A.in} style={{ position: 'absolute', left: 1156, top: 426, width: 660, height: 540, background: C.card, borderRadius: 22, boxShadow: SHADOW, ...dl(300) }}>
      <svg width={660} height={540} viewBox="0 0 660 540" style={{ position: 'absolute', inset: 0 }}>
        <path d="M330 110 V430" stroke={C.ink} strokeWidth={8} strokeLinecap="round" className={A.growY} style={dl(600)} />
        <path d="M250 440 H410" stroke={C.ink} strokeWidth={10} strokeLinecap="round" className={A.grow} style={dl(700)} />
        <g className={A.fade} style={dl(900)}>
          <g className={A.float}>
            <path d="M120 150 L540 130" stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
            <circle cx={330} cy={140} r={14} fill={C.yellow} stroke={C.ink} strokeWidth={4} />
            <path d="M120 150 L70 290 M120 150 L170 290" stroke={C.faint} strokeWidth={3} />
            <path d="M540 130 L490 270 M540 130 L590 270" stroke={C.faint} strokeWidth={3} />
            <path d="M55 290 H185 a65 30 0 0 1 -130 0" fill={T.blue.bg} stroke={C.blue} strokeWidth={4} />
            <path d="M475 270 H605 a65 30 0 0 1 -130 0" fill={T.green.bg} stroke={C.green} strokeWidth={4} />
          </g>
        </g>
      </svg>
      <div className={A.pop} style={{ position: 'absolute', left: 60, top: 330, width: 140, textAlign: 'center', ...dl(1200) }}>
        <IconTile name="cpu" tone="blue" size={72} solid style={{ margin: '0 auto' }} />
        <div style={{ marginTop: 10, fontFamily: display, fontWeight: 700, fontSize: 26, letterSpacing: '0.08em', color: C.blue }}>PERFORMANCE</div>
      </div>
      <div className={A.pop} style={{ position: 'absolute', left: 460, top: 310, width: 160, textAlign: 'center', ...dl(1400) }}>
        <IconTile name="humanCheck" tone="green" size={72} solid style={{ margin: '0 auto' }} />
        <div style={{ marginTop: 10, fontFamily: display, fontWeight: 700, fontSize: 26, letterSpacing: '0.08em', color: T.green.fg }}>CONFIANCE</div>
      </div>
    </div>
  </Frame>
);

// ─── Trainer ────────────────────────────────────────────────────────────────
const Pledge = ({ icon, tone, d, children }: { icon: IconName; tone: Tone; d: number; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 24, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={64} />
    <span style={{ fontSize: 30, lineHeight: 1.35, color: C.ink }}>{children}</span>
  </div>
);

const OP_Trainer: Page = () => (
  <Frame mod={0}>
    <Portrait x={210} y={300} w={280} />
    <div style={{ position: 'absolute', left: 720, top: 260, width: 1080 }}>
      <Eyebrow cls={A.in}>Votre formateur</Eyebrow>
      <div className={A.in} style={{ marginTop: 10, fontFamily: display, fontWeight: 700, fontSize: 84, lineHeight: 1.05, color: C.ink, ...dl(100) }}>
        {AUTHOR}
      </div>
      <div className={A.in} style={{ marginTop: 8, fontSize: 32, fontWeight: 600, color: C.blue, ...dl(200) }}>
        Formateur · Technologia
      </div>
      <div className={A.grow} style={{ marginTop: 34, height: 3, width: 1080, background: C.rule, ...dl(300) }} />
      <Eyebrow cls={A.in} c={C.muted} style={{ marginTop: 34, ...dl(380) }}>
        Mes engagements pour aujourd’hui
      </Eyebrow>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Pledge icon="bulb" tone="blue" d={500}>
          L’IA expliquée simplement, sans jargon ni équations
        </Pledge>
        <Pledge icon="play" tone="teal" d={640}>
          Des outils essayés en direct, par vous, sur votre poste
        </Pledge>
        <Pledge icon="scale" tone="violet" d={780}>
          De vrais cas, pour juger par vous-même
        </Pledge>
        <Pledge icon="shieldCheck" tone="yellow" d={920}>
          Une mini-charte éthique à rapporter dans votre organisation
        </Pledge>
      </div>
    </div>
  </Frame>
);

// ─── Round table ────────────────────────────────────────────────────────────
const AskCard = ({ n, title, sub, d }: { n: number; title: ReactNode; sub: ReactNode; d: number }) => (
  <div
    className={A.left}
    style={{ boxSizing: 'border-box', height: 132, display: 'flex', alignItems: 'center', gap: 26, padding: '0 30px', background: C.card, borderRadius: 'var(--osd-radius)', boxShadow: SHADOW, ...dl(d) }}
  >
    <Num n={n} size={60} />
    <div>
      <div style={{ fontSize: 32, fontWeight: 600, lineHeight: 1.25, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 24, lineHeight: 1.35, color: C.muted }}>{sub}</div>
    </div>
  </div>
);

const OP_Roundtable: Page = () => (
  <Frame mod={0} label="Ouverture · Faisons connaissance">
    <Title>Tour de table</Title>
    <Lede>Trente secondes par personne, micro ouvert, deux questions. Puis un sondage éclair.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 800, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AskCard n={1} title="Qui êtes-vous ?" sub="Prénom, rôle, organisation ou secteur" d={100} />
      <AskCard n={2} title="Un mot sur l’IA, aujourd’hui ?" sub="Curiosité, inquiétude, enthousiasme, méfiance…" d={220} />
    </div>
    <Timer id="op-tour" minutes={7} label="Tour de table" compact cls={A.in} style={{ position: 'absolute', left: 120, top: 640, ...dl(460) }} />
    <div style={{ position: 'absolute', left: 990, top: 290, width: 810 }}>
      <Eyebrow cls={A.in} c={C.violet} style={dl(200)}>
        Sondage éclair · votre usage de l’IA
      </Eyebrow>
      <Hint cls={A.in} style={{ marginTop: 8, ...dl(260) }}>
        Répondez par le numéro de la ligne
      </Hint>
      <Poll cls={A.in} style={{ marginTop: 22, ...dl(360) }}>
        <PollRow id="none" icon="eye" tone="grey" label="1 · Je ne l’ai jamais vraiment essayée" />
        <PollRow id="perso" icon="smile" tone="blue" label="2 · Je l’utilise à titre personnel" />
        <PollRow id="work" icon="chat" tone="teal" label="3 · Je l’utilise parfois au travail" />
        <PollRow id="project" icon="rocket" tone="green" label="4 · Mon organisation a des projets d’IA" />
        <PollRow id="rules" icon="shieldCheck" tone="violet" label="5 · Mon organisation a des règles d’usage" />
      </Poll>
    </div>
  </Frame>
);

// ─── Objectives: a rising staircase ─────────────────────────────────────────
const ObjStep = ({ i, h, tone, verb, when, children }: { i: number; h: number; tone: Tone; verb: string; when: string; children: ReactNode }) => (
  <div style={{ position: 'absolute', left: 120 + (i - 1) * 336, top: 960 - h, width: 316, height: h }}>
    <div className={A.growY} style={{ position: 'absolute', inset: 0, borderRadius: 18, background: C.card, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, ...dl(i * 120) }} />
    <div className={A.in} style={{ position: 'relative', padding: '34px 26px 0', ...dl(420 + i * 140) }}>
      <Num n={i} tone={tone} size={52} />
      <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 40, lineHeight: 1.05, letterSpacing: '0.03em', color: C.ink }}>{verb}</div>
      <div style={{ marginTop: 10, fontSize: 25, lineHeight: 1.38, color: C.soft }}>{children}</div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 26, bottom: 24, ...dl(600 + i * 140) }}>
      <Tag tone={when === 'Matin' ? 'blue' : 'green'} size={20}>
        {when}
      </Tag>
    </div>
  </div>
);

const OP_Objectives: Page = () => (
  <Frame mod={0}>
    <Title>Ce que vous saurez faire ce soir</Title>
    <Lede>Cinq objectifs, du plus simple au plus engageant.</Lede>
    <ObjStep i={1} h={400} tone="blue" verb="COMPRENDRE" when="Matin">
      Les concepts clés : IA, machine learning, deep learning
    </ObjStep>
    <ObjStep i={2} h={450} tone="teal" verb="IDENTIFIER" when="Matin">
      Des cas d’usage concrets dans plusieurs secteurs
    </ObjStep>
    <ObjStep i={3} h={500} tone="violet" verb="ANALYSER" when="Matin">
      Les enjeux de biais, de transparence et de données
    </ObjStep>
    <ObjStep i={4} h={550} tone="green" verb="APPLIQUER" when="Après-midi">
      La Loi 25 et les principes de l’IA responsable
    </ObjStep>
    <ObjStep i={5} h={600} tone="yellow" verb="ÉLABORER" when="Après-midi">
      Une mini-charte éthique pour encadrer l’IA
    </ObjStep>
  </Frame>
);

// ─── Programme (one day, eight modules) ─────────────────────────────────────
const ProgRow = ({ t, n, icon, tone = 'blue', d, children }: { t: string; n?: number; icon?: IconName; tone?: Tone; d: number; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 52, ...dl(d) }}>
    <span style={{ width: 80, fontFamily: mono, fontSize: 22, color: C.muted }}>{t}</span>
    {n ? (
      <Num n={pad(n)} tone={tone} size={40} />
    ) : (
      <span style={{ width: 40, display: 'flex', justifyContent: 'center' }}>
        <Icon name={icon ?? 'star'} size={30} color={C.muted} />
      </span>
    )}
    <span style={{ fontSize: 28, fontWeight: 500, color: C.ink }}>{children}</span>
  </div>
);

const ProgBreak = ({ t, d, children }: { t: string; d: number; children: ReactNode }) => (
  <div className={A.fade} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 34, ...dl(d) }}>
    <span style={{ width: 80, fontFamily: mono, fontSize: 19, color: C.faint }}>{t}</span>
    <span style={{ width: 40, height: 2, background: C.rule }} />
    <span style={{ fontSize: 22, fontStyle: 'italic', color: C.muted }}>{children}</span>
  </div>
);

const HalfCol = ({ x, title, sub, d, children }: { x: number; title: string; sub: string; d: number; children: ReactNode }) => (
  <div
    className={A.in}
    style={{ position: 'absolute', left: x, top: 230, width: 816, boxSizing: 'border-box', padding: '26px 36px 24px', background: C.card, borderRadius: 'var(--osd-radius)', boxShadow: SHADOW, ...dl(d) }}
  >
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 14 }}>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 46, color: C.ink }}>{title}</span>
      <span style={{ fontSize: 26, color: C.muted }}>{sub}</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
  </div>
);

const ProgramCols = () => (
  <>
    <HalfCol x={120} title="Matin" sub="Fondamentaux de l’IA" d={0}>
      <ProgRow t="9:00" icon="users" d={150}>
        Accueil et tour de table
      </ProgRow>
      <ProgRow t="9:15" n={1} d={210}>
        Qu’est-ce que l’intelligence artificielle ?
      </ProgRow>
      <ProgRow t="10:05" n={2} d={270}>
        Applications concrètes et démonstrations
      </ProgRow>
      <ProgBreak t="10:35" d={330}>
        Pause
      </ProgBreak>
      <ProgRow t="10:50" n={3} tone="yellow" d={390}>
        Atelier 1 · Explorer des outils IA
      </ProgRow>
      <ProgRow t="11:30" n={4} tone="violet" d={450}>
        Les grands enjeux éthiques
      </ProgRow>
      <ProgBreak t="12:00" d={510}>
        Dîner
      </ProgBreak>
    </HalfCol>
    <HalfCol x={984} title="Après-midi" sub="Éthique et gouvernance" d={150}>
      <ProgRow t="13:00" n={5} tone="violet" d={300}>
        Loi 25 et principes de l’IA responsable
      </ProgRow>
      <ProgRow t="13:40" n={6} tone="yellow" d={360}>
        Atelier 2 · Étude de cas éthique
      </ProgRow>
      <ProgBreak t="14:20" d={420}>
        Pause
      </ProgBreak>
      <ProgRow t="14:35" n={7} tone="violet" d={480}>
        Vers une gouvernance de l’IA
      </ProgRow>
      <ProgRow t="15:00" n={8} tone="yellow" d={540}>
        Atelier 3 · Mini-charte éthique
      </ProgRow>
      <ProgRow t="15:45" icon="flag" d={600}>
        Bilan, plan d’action et évaluation
      </ProgRow>
      <ProgBreak t="16:00" d={660}>
        Fin de la formation
      </ProgBreak>
    </HalfCol>
  </>
);

const OP_Program: Page = () => (
  <Frame mod={0}>
    <Title>Programme de la journée</Title>
    <ProgramCols />
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 900, display: 'flex', alignItems: 'center', gap: 28, fontSize: 24, color: C.soft, ...dl(800) }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Num n="" tone="blue" size={26} /> Fondamentaux
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Num n="" tone="violet" size={26} /> Éthique et cadres
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Num n="" tone="yellow" size={26} /> Ateliers individuels
      </span>
    </div>
  </Frame>
);

// ─── How we work ────────────────────────────────────────────────────────────
const ActCard = ({ kind, icon, title, d, children }: { kind: Kind; icon: IconName; title: string; d: number; children: ReactNode }) => {
  const tone = KINDS[kind].tone;
  return (
    <div
      className={A.in}
      style={{ boxSizing: 'border-box', width: 390, height: 390, padding: '30px 30px', background: C.card, borderRadius: 'var(--osd-radius)', boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, ...dl(d) }}
    >
      <KindBadge kind={kind} />
      <IconTile name={icon} tone={tone} size={84} style={{ marginTop: 26 }} />
      <div style={{ marginTop: 20, fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 8, fontSize: 25, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  );
};

const RuleChip = ({ icon, d, children }: { icon: IconName; d: number; children: ReactNode }) => (
  <div
    className={A.in}
    style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 18, padding: '20px 24px', background: C.panel, borderRadius: 14, fontSize: 26, lineHeight: 1.3, color: C.ink, ...dl(d) }}
  >
    <Icon name={icon} size={34} color={C.blue} />
    <span>{children}</span>
  </div>
);

const OP_HowWeWork: Page = () => (
  <Frame mod={0}>
    <Title>Comment nous allons travailler</Title>
    <Lede>Une formation active : on essaie, on discute, on se trompe… et on comprend.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 40 }}>
      <ActCard kind="qcm" icon="check" title="Votez, vérifiez" d={100}>
        Vous répondez à voix haute, je clique. Les pièges sont voulus.
      </ActCard>
      <ActCard kind="demo" icon="play" title="Observez" d={220}>
        Des démonstrations en partage d’écran, avec de vrais outils.
      </ActCard>
      <ActCard kind="cas" icon="book" title="Jugez" d={340}>
        De vrais cas où l’IA a dérapé. Qu’auriez-vous fait ?
      </ActCard>
      <ActCard kind="atelier" icon="pointer" title="Pratiquez" d={460}>
        Trois ateliers individuels, guidés pas à pas, avec un livrable.
      </ActCard>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 740, width: 1680, display: 'flex', gap: 24 }}>
      <RuleChip icon="chat" d={600}>
        Questions bienvenues, à tout moment
      </RuleChip>
      <RuleChip icon="lock" d={700}>
        Aucune donnée confidentielle dans les outils
      </RuleChip>
      <RuleChip icon="leaf" d={800}>
        Fil rouge : la Mutuelle des Érables
      </RuleChip>
    </div>
    <Callout
      cls={A.in}
      title="Classe virtuelle"
      icon="video"
      tone="blue"
      size={26}
      style={{ position: 'absolute', left: 120, top: 862, width: 1680, padding: '14px 26px', ...dl(900) }}
    >
      Caméra si possible, micro coupé hors échanges. Idéal : deux écrans, la formation et l’outil d’IA.
    </Callout>
  </Frame>
);

// ─── Running case: la Mutuelle des Érables ──────────────────────────────────
const Fact = ({ icon, children }: { icon: IconName; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 27, color: C.ink }}>
    <Icon name={icon} size={30} color={C.teal} />
    <span>{children}</span>
  </div>
);

const CastCard = ({ id, d, children }: { id: CastId; d: number; children: ReactNode }) => (
  <div
    className={A.in}
    style={{ boxSizing: 'border-box', height: 116, display: 'flex', alignItems: 'center', gap: 24, padding: '0 28px', background: C.card, borderRadius: 'var(--osd-radius)', boxShadow: SHADOW, ...dl(d) }}
  >
    <div style={{ width: 560, flex: 'none' }}>
      <Who id={id} size={28} />
    </div>
    <div style={{ fontSize: 24, lineHeight: 1.35, color: C.soft }}>{children}</div>
  </div>
);

const OP_Mutuelle: Page = () => (
  <Frame mod={0} kind="cas" label="Ouverture · Fil rouge">
    <Title>Notre fil rouge : la Mutuelle des Érables</Title>
    <Lede>Une organisation fictive aux enjeux réalistes. Nous la retrouverons dans chaque module.</Lede>
    <div
      className={A.left}
      style={{ position: 'absolute', left: 120, top: 290, width: 520, height: 650, boxSizing: 'border-box', padding: '30px 32px', background: C.card, borderRadius: 'var(--osd-radius)', boxShadow: `${SHADOW}, inset 0 8px 0 ${C.teal}`, display: 'flex', flexDirection: 'column' }}
    >
      <Photo id="troisRivieres" w="calc(100% + 64px)" h={170} radius={0} style={{ margin: '-30px -32px 20px', borderRadius: 'var(--osd-radius) var(--osd-radius) 0 0' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <IconTile name="leaf" tone="teal" size={70} solid />
        <div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 40, lineHeight: 1.05, color: C.ink }}>Mutuelle des Érables</div>
          <div style={{ fontSize: 22, color: C.muted }}>Assurance de personnes · Québec</div>
        </div>
      </div>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Fact icon="users">650 employés</Fact>
        <Fact icon="heart">310 000 membres assurés</Fact>
        <Fact icon="shield">Vie, invalidité, assurance collective</Fact>
        <Fact icon="map">Siège à Trois-Rivières</Fact>
      </div>
      <Callout title="Le projet" icon="flag" tone="yellow" size={25} style={{ marginTop: 'auto', padding: '16px 22px' }}>
        Un « Programme IA » de quatre projets, à lancer en 2027.
      </Callout>
    </div>
    <div style={{ position: 'absolute', left: 680, top: 290, width: 1120, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <CastCard id="nathalie" d={200}>
        Porte le programme. Veut aller vite, sans faire de vagues.
      </CastCard>
      <CastCard id="samir" d={320}>
        Reçoit 4 000 CV par an. Rêve d’un tri automatique.
      </CastCard>
      <CastCard id="chloe" d={440}>
        Gardienne de la Loi 25. Veut être consultée avant, pas après.
      </CastCard>
      <CastCard id="vincent" d={560}>
        Veut un agent conversationnel et des campagnes personnalisées.
      </CastCard>
      <CastCard id="mei" d={680}>
        Construit les modèles. Se demande ce qu’ils ont appris.
      </CastCard>
    </div>
  </Frame>
);

// ─── The question of the day ────────────────────────────────────────────────
const OP_Question: Page = () => (
  <Frame mod={0} kind="cas" label="Ouverture · Fil rouge">
    <Title>La question qui nous suivra toute la journée</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 1680, ...dl(100) }}>
      <Quote by="Nathalie, au comité de direction de la Mutuelle">
        Comment profiter de l’IA <Hl>sans trahir la confiance</Hl> de nos membres et de nos employés ?
      </Quote>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 520, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', columnGap: 30 }}>
      <Card tone="blue" icon="bulb" title="Ce matin" size={26} cls={A.in} style={{ height: 300, ...dl(300) }}>
        Comprendre ce qu’est l’IA, ce qu’elle sait faire, et l’essayer vous-même.
      </Card>
      <Card tone="violet" icon="scale" title="Avant et après le dîner" size={26} cls={A.in} style={{ height: 300, ...dl(450) }}>
        Repérer les risques : biais, opacité, données. Connaître la Loi 25.
      </Card>
      <Card tone="yellow" icon="shieldCheck" title="Cet après-midi" size={26} cls={A.in} style={{ height: 300, ...dl(600) }}>
        Juger un cas de votre secteur, puis écrire les règles du jeu : une mini-charte.
      </Card>
    </div>
  </Frame>
);

// ─── Warm-up quiz (multi-answer) ────────────────────────────────────────────
const OP_Quiz0: Page = () => (
  <Frame mod={0} kind="qcm" beats={2} label="Ouverture · Point de départ">
    <Title>
      <span style={{ color: C.violet }}>Quiz éclair</span> · Vos intuitions de départ
    </Title>
    <Qcm
      multi
      q="Parmi ces affirmations sur l’IA, lesquelles sont vraies ?"
      explain="L’IA est utile et déjà partout, mais elle n’est ni neutre ni infaillible. Et au Québec, la loi encadre déjà les décisions automatisées. C’est tout le programme de la journée."
    >
      <Opt why="Piège ! Une IA apprend à partir de données produites par des humains. Elle hérite de leurs déséquilibres : on le verra au module 4.">
        Une IA est neutre, puisque c’est une machine
      </Opt>
      <Opt ok why="Oui : filtre anti-pourriel, GPS, traduction, recommandations… On l’utilise des dizaines de fois par jour, souvent sans le savoir.">
        Vous utilisez déjà l’IA plusieurs fois par jour
      </Opt>
      <Opt why="Piège ! Elle produit le texte le plus probable, pas le plus vrai. Elle peut inventer une source avec aplomb.">
        Si une IA l’affirme avec assurance, c’est fiable
      </Opt>
      <Opt ok why="Oui : depuis septembre 2023, la Loi 25 impose d’informer une personne quand une décision la concernant repose uniquement sur un traitement automatisé.">
        Au Québec, une loi encadre déjà certaines décisions automatisées
      </Opt>
    </Qcm>
  </Frame>
);

// ═══ 10-m1 ═════════════════════════════════════════════════════════════

// ─── M1 · Divider ───────────────────────────────────────────────────────────
const M1_Divider: Page = () => (
  <Section n={1} title="Qu’est-ce que l’intelligence artificielle ?" sub="Ce que c’est, d’où ça vient, comment ça apprend… et pourquoi ça se trompe." dur="≈ 50 min">
    <SecItem n={1}>Définition et historique</SecItem>
    <SecItem n={2}>IA, machine learning, deep learning : les différences</SecItem>
    <SecItem n={3}>Comment un outil comme ChatGPT écrit ses réponses</SecItem>
    <SecItem n={4}>Panorama des technologies d’IA</SecItem>
  </Section>
);
M1_Divider.transition = BLOOM;

// ─── M1 · A day full of AI ──────────────────────────────────────────────────
const M1Moment = ({ x, n, time, icon, tone, title, ai }: { x: number; n: number; time: string; icon: IconName; tone: Tone; title: string; ai: string }) => (
  <>
    <div className={A.fade} style={{ position: 'absolute', left: x - 60, top: 470, width: 120, textAlign: 'center', fontFamily: mono, fontSize: 22, color: C.muted, ...dl(200 + n * 80) }}>
      {time}
    </div>
    <div className={A.dot} style={{ position: 'absolute', left: x - 13, top: 517, width: 26, height: 26, borderRadius: 99, background: '#fff', boxShadow: `inset 0 0 0 6px ${STRONG[tone]}`, ...dl(300 + n * 80) }} />
    <div className={b.pop(n)} style={{ position: 'absolute', left: x - 140, top: 300, width: 280, display: 'flex', justifyContent: 'center' }}>
      <IconTile name={icon} tone={tone} size={110} solid />
    </div>
    <div className={b.on(n)} style={{ position: 'absolute', left: x - 140, top: 590, width: 280, ...dl(120) }}>
      <div style={{ boxSizing: 'border-box', height: 250, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 6px 0 ${STRONG[tone]}`, padding: '26px 22px' }}>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 32, lineHeight: 1.1, color: C.ink }}>{title}</div>
        <div style={{ marginTop: 14, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{ai}</div>
      </div>
    </div>
  </>
);

const M1_Day: Page = () => (
  <Frame mod={1} beats={6}>
    <Title>Une journée ordinaire… pleine d’IA</Title>
    <Lede>Vous utilisez déjà l’intelligence artificielle des dizaines de fois par jour, souvent sans le savoir.</Lede>
    <div className={A.grow} style={{ position: 'absolute', left: 120, top: 528, width: 1680, height: 4, background: C.rule, ...dl(100) }} />
    <M1Moment x={260} n={1} time="7:00" icon="lock" tone="blue" title="Déverrouiller son téléphone" ai="Reconnaissance du visage" />
    <M1Moment x={540} n={2} time="8:10" icon="map" tone="teal" title="Éviter le bouchon" ai="Le GPS prédit la circulation" />
    <M1Moment x={820} n={3} time="9:00" icon="mail" tone="green" title="Une boîte sans pourriels" ai="Le filtre a appris à les reconnaître" />
    <M1Moment x={1100} n={4} time="11:30" icon="globe" tone="yellow" title="Lire un courriel en anglais" ai="Traduction automatique" />
    <M1Moment x={1380} n={5} time="14:00" icon="chat" tone="violet" title="Le clavier finit la phrase" ai="Prédiction du mot suivant" />
    <M1Moment x={1660} n={6} time="20:30" icon="play" tone="coral" title="« Vous aimerez aussi… »" ai="Recommandations de séries et de musique" />
  </Frame>
);

// ─── M1 · Definition ────────────────────────────────────────────────────────
const M1Cap = ({ n, icon, tone, verb, children, ex }: { n: number; icon: IconName; tone: Tone; verb: string; children: ReactNode; ex: string }) => (
  <div className={b.on(n)} style={{ flex: 1 }}>
    <div style={{ boxSizing: 'border-box', height: 420, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '32px 28px', display: 'flex', flexDirection: 'column' }}>
      <IconTile name={icon} tone={tone} size={72} />
      <div style={{ marginTop: 20, fontFamily: display, fontWeight: 700, fontSize: 42, letterSpacing: '0.03em', color: C.ink }}>{verb}</div>
      <div style={{ marginTop: 8, fontSize: 26, lineHeight: 1.4, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 'auto', fontSize: 22, lineHeight: 1.35, color: T[tone].fg, background: T[tone].bg, borderRadius: 10, padding: '10px 14px' }}>{ex}</div>
    </div>
  </div>
);

const M1_Define: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>L’intelligence artificielle, en une phrase</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 220, width: 1680, ...dl(100) }}>
      <Quote by="Définition de travail, pour aujourd’hui">
        Des programmes capables de faire des tâches qui demandaient jusqu’ici l’<Hl>intelligence humaine</Hl>.
      </Quote>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 470, width: 1680, display: 'flex', gap: 28 }}>
      <M1Cap n={1} icon="eye" tone="blue" verb="PERCEVOIR" ex="Ex. : transcrire l’appel d’un membre">
        Voir une image, entendre une voix
      </M1Cap>
      <M1Cap n={2} icon="book" tone="teal" verb="COMPRENDRE" ex="Ex. : résumer 40 courriels">
        Lire un texte et en saisir le sens
      </M1Cap>
      <M1Cap n={3} icon="trend" tone="green" verb="PRÉDIRE" ex="Ex. : repérer une réclamation inhabituelle">
        Anticiper à partir du passé
      </M1Cap>
      <M1Cap n={4} icon="sparkles" tone="violet" verb="GÉNÉRER" ex="Ex. : rédiger une lettre au membre">
        Produire un texte, une image, un plan
      </M1Cap>
    </div>
  </Frame>
);

// ─── M1 · A short history ───────────────────────────────────────────────────
const M1Year = ({ x, i, year, up, hot, children }: { x: number; i: number; year: string; up: boolean; hot?: boolean; children: ReactNode }) => (
  <>
    <div className={A.dot} style={{ position: 'absolute', left: x - 16, top: 584, width: 32, height: 32, borderRadius: 99, background: hot ? C.yellow : '#fff', boxShadow: `inset 0 0 0 7px ${hot ? C.amber : C.blue}`, ...dl(300 + i * 160) }} />
    <div style={{ position: 'absolute', left: x, top: up ? 380 : 640, width: 0, height: up ? 200 : 0 }}>
      <div className={A.in} style={{ position: 'absolute', left: -150, top: 0, width: 300, ...dl(380 + i * 160) }}>
        <div style={{ boxSizing: 'border-box', height: 190, background: hot ? T.yellow.bg : C.card, borderRadius: 16, boxShadow: hot ? `inset 0 0 0 3px ${C.yellow}` : SHADOW, padding: '18px 22px' }}>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 46, lineHeight: 1, color: hot ? C.amber : C.blue }}>{year}</div>
          <div style={{ marginTop: 10, fontSize: 23, lineHeight: 1.35, color: C.ink }}>{children}</div>
        </div>
      </div>
    </div>
  </>
);

// Round picture sitting on the timeline, as the node of its year (drawn above the dot).
const M1Pic = ({ x, i, ph, pos = 'center', children }: { x: number; i: number; up?: boolean; ph?: PhotoId; pos?: string; children?: ReactNode }) => (
  <div className={A.pop} style={{ position: 'absolute', left: x - 33, top: 567, width: 66, height: 66, borderRadius: 99, overflow: 'hidden', background: '#fff', boxShadow: `0 0 0 4px #fff, 0 0 0 7px ${C.rule}, 0 10px 22px -10px rgba(20,60,100,.5)`, ...dl(450 + i * 160) }}>
    {ph ? <Photo id={ph} w={66} h={66} radius={99} pos={pos} credit={false} /> : <div style={{ width: 66, height: 66, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>}
  </div>
);

const M1_History: Page = () => (
  <Frame mod={1}>
    <Title>75 ans d’IA… et une accélération récente</Title>
    <Lede>Ce qui a changé en 2022 : l’IA est devenue accessible à tous, en français, sans programmer.</Lede>
    <div className={A.grow} style={{ position: 'absolute', left: 120, top: 597, width: 1680, height: 6, background: C.rule, ...dl(100) }} />
    <M1Year x={270} i={0} year="1950" up>
      Turing : « Les machines peuvent-elles penser ? »
    </M1Year>
    <M1Year x={467} i={1} year="1956" up={false}>
      Le terme « intelligence artificielle » est créé.
    </M1Year>
    <M1Year x={664} i={2} year="1997" up>
      Deep Blue bat Kasparov aux échecs.
    </M1Year>
    <M1Year x={861} i={3} year="2012" up={false}>
      L’apprentissage profond reconnaît les images.
    </M1Year>
    <M1Year x={1058} i={4} year="2016" up>
      AlphaGo bat un champion du jeu de go.
    </M1Year>
    <M1Year x={1255} i={5} year="2017" up={false}>
      Le « Transformer », le T de GPT, est inventé.
    </M1Year>
    <M1Year x={1452} i={6} year="2022" up hot>
      ChatGPT : l’IA générative pour tous.
    </M1Year>
    <M1Year x={1650} i={7} year="2025 +" up={false}>
      Des « agents » qui agissent dans nos outils.
    </M1Year>
    <M1Pic x={270} i={0} up ph="turing" />
    <M1Pic x={467} i={1} up={false} ph="mccarthy" />
    <M1Pic x={664} i={2} up ph="deepBlue" />
    <M1Pic x={861} i={3} up={false} ph="hinton" pos="50% 25%" />
    <M1Pic x={1058} i={4} up ph="leeSedol" pos="30% 30%" />
    <M1Pic x={1255} i={5} up={false}>
      <IconTile name="layers" tone="violet" size={66} solid style={{ borderRadius: 99 }} />
    </M1Pic>
    <M1Pic x={1452} i={6} up>
      <AppTile id="chatgpt" size={66} style={{ borderRadius: 99 }} />
    </M1Pic>
    <M1Pic x={1650} i={7} up={false}>
      <IconTile name="bot" tone="coral" size={66} solid style={{ borderRadius: 99 }} />
    </M1Pic>
  </Frame>
);

// ─── M1 · Programming vs learning ───────────────────────────────────────────
const M1Node = ({ icon, tone, children, w = 210 }: { icon: IconName; tone: Tone; children: ReactNode; w?: number }) => (
  <div style={{ boxSizing: 'border-box', width: w, minHeight: 92, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: T[tone].bg, borderRadius: 14, boxShadow: `inset 0 0 0 2px ${T[tone].bd}` }}>
    <Icon name={icon} size={30} color={T[tone].fg} />
    <span style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.2, color: C.ink }}>{children}</span>
  </div>
);

const M1Machine = ({ label }: { label: string }) => (
  <div style={{ width: 150, height: 150, borderRadius: 24, background: G.blue, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#fff', flex: 'none' }}>
    <Icon name="cpu" size={56} color="#fff" />
    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 22, letterSpacing: '0.08em' }}>{label}</span>
  </div>
);

const M1Panel = ({ x, title, tone, children, cls, style }: { x: number; title: string; tone: Tone; children: ReactNode; cls?: string; style?: CSSProperties }) => (
  <div className={cls} style={{ position: 'absolute', left: x, top: 270, width: 820, height: 540, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '30px 32px', ...style }}>
    <Eyebrow c={T[tone].fg}>{title}</Eyebrow>
    {children}
  </div>
);

const M1_RulesVsLearn: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>Programmer… ou laisser la machine apprendre</Title>
    <Lede>La vraie nouveauté : on ne donne plus les règles, on donne des exemples.</Lede>
    <M1Panel x={120} title="Programmation classique" tone="grey" cls={A.left}>
      <div style={{ marginTop: 34, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <M1Node icon="list" tone="grey">Des règles</M1Node>
          <M1Node icon="mail" tone="grey">Un courriel</M1Node>
        </div>
        <FlowArrow w={56} />
        <M1Machine label="PROGRAMME" />
        <FlowArrow w={56} />
        <M1Node icon="check" tone="grey" w={170}>Un résultat</M1Node>
      </div>
      <div style={{ marginTop: 40, fontFamily: mono, fontSize: 24, lineHeight: 1.5, color: C.ink, background: '#F7FAFC', borderRadius: 12, padding: '16px 20px', boxShadow: `inset 0 0 0 1.5px ${C.rule}` }}>
        SI le courriel contient « gratuit »
        <br />
        ALORS pourriel
      </div>
      <div className={b.fade(1)} style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12, fontSize: 25, color: T.coral.fg }}>
        <Icon name="alert" size={28} /> « Consultation gratuite avec votre conseiller » → bloqué à tort
      </div>
    </M1Panel>
    <M1Panel x={980} title="Apprentissage automatique" tone="blue" cls={b.on(2)}>
      <div style={{ marginTop: 34, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <M1Node icon="archive" tone="blue">100 000 courriels</M1Node>
          <M1Node icon="check" tone="blue">déjà classés</M1Node>
        </div>
        <FlowArrow w={56} color={C.blue} />
        <M1Machine label="APPRENTISSAGE" />
        <FlowArrow w={56} color={C.blue} />
        <M1Node icon="sparkles" tone="green" w={170}>Ses propres règles</M1Node>
      </div>
      <div className={b.fade(3)} style={{ marginTop: 40 }}>
        <Callout title="Ce qui change" tone="green" icon="bulb" size={26}>
          La machine repère seule des centaines d’indices. On l’appelle un <b>modèle</b>.
        </Callout>
      </div>
    </M1Panel>
    <div className={b.fade(3)} style={{ position: 'absolute', left: 120, top: 850, width: 1680, fontSize: 26, color: C.soft, ...dl(300) }}>
      Revers de la médaille : le modèle apprend aussi les <b>erreurs et les biais</b> de ses exemples (module 4).
    </div>
  </Frame>
);

// ─── M1 · Learning by example (classifier that improves) ────────────────────
const M1Pt = ({ x, y, spam }: { x: number; y: number; spam?: boolean }) =>
  spam ? <rect x={x - 11} y={y - 11} width={22} height={22} fill={C.coral} /> : <circle cx={x} cy={y} r={12} fill={C.blue} />;

const M1Step = ({ n, tone, children }: { n: number; tone: Tone; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
    <Num n={n} tone={tone} size={46} />
    <span style={{ fontSize: 26, lineHeight: 1.35, color: C.ink }}>{children}</span>
  </div>
);

const M1_Learn: Page = () => {
  const [ref, c] = useBeats();
  const angle = c >= 3 ? 36 : c >= 2 ? 10 : -28;
  const errors = c >= 3 ? '0' : c >= 2 ? '4' : c >= 1 ? '9' : '—';
  return (
    <Frame mod={1} kind="demo" beats={5}>
      <Title>Apprendre par l’exemple : le filtre anti-pourriel</Title>
      <div ref={ref} className={A.in} style={{ position: 'absolute', left: 120, top: 210, width: 1000, height: 730, background: C.card, borderRadius: 18, boxShadow: SHADOW }}>
        <svg width={1000} height={730} viewBox="0 0 1000 730" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <clipPath id="m1-plot">
              <rect x={70} y={30} width={900} height={600} />
            </clipPath>
          </defs>
          <g transform="translate(70 30)" clipPath="url(#m1-plot)">
            <g className={b.fade(1)}>
              <g style={{ transform: `translate(450px, 300px) rotate(${angle}deg)`, transition: `transform 900ms ${EASE}` }}>
                <rect x={-900} y={-900} width={1800} height={900} fill={T.coral.bg} opacity={0.75} />
                <line x1={-900} y1={0} x2={900} y2={0} stroke={C.ink} strokeWidth={4} strokeDasharray="14 10" />
              </g>
            </g>
          </g>
          <g transform="translate(70 30)">
            <M1Pt x={150} y={480} />
            <M1Pt x={220} y={380} />
            <M1Pt x={260} y={520} />
            <M1Pt x={320} y={440} />
            <M1Pt x={180} y={330} />
            <M1Pt x={380} y={520} />
            <M1Pt x={300} y={300} />
            <M1Pt x={420} y={430} />
            <M1Pt x={120} y={250} />
            <M1Pt x={500} y={520} />
            <M1Pt x={600} y={120} spam />
            <M1Pt x={700} y={220} spam />
            <M1Pt x={760} y={140} spam />
            <M1Pt x={560} y={240} spam />
            <M1Pt x={680} y={320} spam />
            <M1Pt x={800} y={260} spam />
            <M1Pt x={520} y={150} spam />
            <M1Pt x={640} y={60} spam />
            <M1Pt x={780} y={360} spam />
            <M1Pt x={720} y={420} spam />
            <g className={b.pop(4)}>
              <circle cx={610} cy={330} r={22} fill="#fff" stroke={C.ink} strokeWidth={3} />
              <text x={610} y={340} textAnchor="middle" fontFamily="Barlow Condensed, sans-serif" fontWeight={700} fontSize={28} fill={C.ink}>
                ?
              </text>
            </g>
            <g className={b.pop(5)}>
              <rect x={588} y={308} width={44} height={44} fill={C.coral} />
              <text x={650} y={392} fontFamily="Barlow, sans-serif" fontWeight={600} fontSize={24} fill={T.coral.fg}>
                Pourriel à 92 %
              </text>
            </g>
          </g>
          <path d="M70 630 H970 M70 630 V30" stroke={C.faint} strokeWidth={3} fill="none" />
          <text x={520} y={672} textAnchor="middle" fontFamily="Barlow, sans-serif" fontSize={22} fill={C.muted}>
            Nombre de liens dans le courriel →
          </text>
          <text x={40} y={330} textAnchor="middle" fontFamily="Barlow, sans-serif" fontSize={22} fill={C.muted} transform="rotate(-90 40 330)">
            Mots promotionnels →
          </text>
        </svg>
        <div style={{ position: 'absolute', right: 26, bottom: 18, display: 'flex', gap: 22, fontSize: 22, color: C.soft }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 18, height: 18, borderRadius: 99, background: C.blue }} /> Légitime
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 18, height: 18, background: C.coral }} /> Pourriel
          </span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 1170, top: 220, width: 630, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 26px', display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <Eyebrow c={C.muted} size={22}>
            Erreurs du modèle
          </Eyebrow>
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 64, lineHeight: 1, color: errors === '0' ? C.green : C.coral, transition: 'color 400ms' }}>{errors}</span>
          <span style={{ fontSize: 22, color: C.muted }}>sur 20 exemples</span>
        </div>
        <M1Step n={1} tone="blue">
          Il trace une première frontière… au hasard.
        </M1Step>
        <M1Step n={2} tone="blue">
          Il compte ses erreurs et ajuste un peu.
        </M1Step>
        <M1Step n={3} tone="blue">
          Il recommence des milliers de fois : c’est l’<b>entraînement</b>.
        </M1Step>
        <M1Step n={4} tone="violet">
          Un nouveau courriel arrive…
        </M1Step>
        <M1Step n={5} tone="coral">
          Il le classe, avec une <b>probabilité</b>, jamais une certitude.
        </M1Step>
      </div>
    </Frame>
  );
};

// ─── M1 · How an LLM writes: one word at a time (interactive) ───────────────
type M1Cand = { w: string; p: number };
const M1_SEQ: { pick: string; cands: M1Cand[] }[] = [
  { pick: ' a', cands: [{ w: 'a', p: 41 }, { w: 'sera', p: 33 }, { w: 'est', p: 17 }, { w: 'nous', p: 6 }] },
  { pick: ' été', cands: [{ w: 'été', p: 62 }, { w: 'bien', p: 21 }, { w: 'fait', p: 9 }, { w: 'reçu', p: 4 }] },
  { pick: ' acceptée', cands: [{ w: 'acceptée', p: 36 }, { w: 'reçue', p: 34 }, { w: 'traitée', p: 18 }, { w: 'refusée', p: 8 }] },
  { pick: ',', cands: [{ w: ',', p: 45 }, { w: '.', p: 31 }, { w: 'et', p: 14 }, { w: 'le', p: 6 }] },
  { pick: ' vous', cands: [{ w: 'vous', p: 44 }, { w: 'et', p: 27 }, { w: 'le', p: 14 }, { w: 'nous', p: 9 }] },
  { pick: ' recevrez', cands: [{ w: 'recevrez', p: 47 }, { w: 'serez', p: 22 }, { w: 'pouvez', p: 18 }, { w: 'devez', p: 7 }] },
];

const M1CandRow = ({ c, top }: { c: M1Cand | undefined; top: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 58 }}>
    <span style={{ width: 190, fontFamily: mono, fontSize: 26, fontWeight: top ? 700 : 400, color: top ? C.blue : C.ink }}>« {c?.w ?? ''} »</span>
    <div style={{ flex: 1, height: 34, background: C.panel, borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ width: `${(c?.p ?? 0) * 2}%`, height: '100%', background: top ? C.blue : '#9CC6EA', borderRadius: 8, transition: `width 600ms ${EASE}` }} />
    </div>
    <span style={{ width: 80, textAlign: 'right', fontFamily: display, fontWeight: 700, fontSize: 32, color: top ? C.blue : C.muted }}>{c?.p ?? 0} %</span>
  </div>
);

const M1_NextWord: Page = () => {
  const [step, setStep] = useState(0);
  const done = step >= M1_SEQ.length;
  const text = M1_SEQ.slice(0, step)
    .map((s) => s.pick)
    .join('');
  const cands = done ? [] : M1_SEQ[step].cands;
  return (
    <Frame mod={1} kind="exercice">
      <Title>Comment ChatGPT écrit : un mot à la fois</Title>
      <Lede>Un modèle de langage (LLM) devine le mot le plus probable, puis recommence.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1060, height: 650, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '30px 36px' }}>
        <Eyebrow c={C.muted} size={22}>
          Texte en cours
        </Eyebrow>
        <div style={{ marginTop: 12, minHeight: 130, fontSize: 38, lineHeight: 1.4, color: C.ink }}>
          Bonjour, votre demande de remboursement<span style={{ color: C.blue, fontWeight: 600 }}>{text}</span>
          <span className={A.blink} style={{ display: 'inline-block', width: 4, height: 40, marginLeft: 4, verticalAlign: '-6px', background: C.blue }} />
        </div>
        <Eyebrow c={C.muted} size={22} style={{ marginTop: 18 }}>
          {done ? 'Phrase terminée' : 'Mots candidats et probabilités'}
        </Eyebrow>
        <div style={{ marginTop: 12, minHeight: 250 }}>
          {done ? (
            <div style={{ fontSize: 28, lineHeight: 1.45, color: C.soft }}>
              Fluide, rassurant… mais <b>personne n’a ouvert le dossier</b>. « Acceptée » était seulement le mot le plus probable.
            </div>
          ) : (
            <>
              <M1CandRow c={cands[0]} top />
              <M1CandRow c={cands[1]} top={false} />
              <M1CandRow c={cands[2]} top={false} />
              <M1CandRow c={cands[3]} top={false} />
            </>
          )}
        </div>
        <div style={{ position: 'absolute', left: 36, bottom: 30, display: 'flex', gap: 16 }}>
          <Btn icon="play" disabled={done} onClick={() => setStep((s) => Math.min(M1_SEQ.length, s + 1))}>
            Mot suivant
          </Btn>
          <Btn icon="reset" ghost tone="grey" onClick={() => setStep(0)}>
            Recommencer
          </Btn>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 1230, top: 280, width: 570, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Card tone="blue" icon="book" title="1. Il a lu" cls={A.right} style={dl(200)}>
          Des milliards de phrases : livres, sites web, articles.
        </Card>
        <Card tone="teal" icon="chart" title="2. Il calcule" cls={A.right} style={dl(320)}>
          La probabilité de chaque mot qui pourrait suivre.
        </Card>
        <Card tone="violet" icon="loop" title="3. Il choisit, et recommence" cls={A.right} style={dl(440)}>
          Mot après mot, jusqu’à la fin de la réponse.
        </Card>
      </div>
    </Frame>
  );
};

// ─── M1 · Probable is not true ──────────────────────────────────────────────
for (let n = 1; n <= 3; n++) {
  CSS.push(`
.${P}-m1fl${n}{transition:background 400ms ${EASE},box-shadow 400ms ${EASE};border-radius:4px}
${at(n)} .${P}-m1fl${n}{background:${T.coral.bg};box-shadow:inset 0 -3px 0 ${C.coral}}
`);
}

const M1Why = ({ n, title, children }: { n: number; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 18, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 22px' }}>
    <Num n={n} tone="coral" size={44} />
    <div>
      <div style={{ fontWeight: 700, fontSize: 26, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M1_Plausible: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>Probable ne veut pas dire vrai</Title>
    <Lede>Chloé vérifie un point de la Loi 25. La réponse est claire, précise… et en partie inventée.</Lede>
    <PromptBox cls={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 960, ...dl(100) }}>
      Quelle est l’amende maximale prévue par la Loi 25 pour une entreprise ?
    </PromptBox>
    <AnswerBox cls={A.in} size={27} style={{ position: 'absolute', left: 120, top: 470, width: 960, ...dl(300) }}>
      L’amende maximale est de <span className={k('m1fl1')}>15 M$ ou 3 % du chiffre d’affaires mondial</span>, selon{' '}
      <span className={k('m1fl2')}>l’article 47.3 de la Loi 25</span>. Bonne nouvelle :{' '}
      <span className={k('m1fl3')}>les PME de moins de 50 employés en sont exemptées</span>.
    </AnswerBox>
    <div style={{ position: 'absolute', left: 1140, top: 280, width: 660, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M1Why n={1} title="Un chiffre faux, mais crédible">
        Les vrais plafonds : 10 M$ ou 2 % (sanction administrative), 25 M$ ou 4 % (amende pénale).
      </M1Why>
      <M1Why n={2} title="Une référence inventée">
        La Loi 25 modifie plusieurs lois : « son article 47.3 » ne veut rien dire.
      </M1Why>
      <M1Why n={3} title="Une exception imaginaire">
        Aucune exemption pour les PME : toute entreprise est visée.
      </M1Why>
    </div>
    <Callout cls={b.on(4)} title="Ça s’appelle une hallucination" tone="coral" icon="alert" style={{ position: 'absolute', left: 120, top: 790, width: 1680 }}>
      Le modèle comble les trous avec du vraisemblable. Chiffre, loi, source : on vérifie toujours à la source.
    </Callout>
  </Frame>
);

// ─── M1 · Exercise: AI or not? ──────────────────────────────────────────────
const M1Flip = ({ icon, q, ai, why }: { icon: IconName; q: string; ai: boolean; why: string }) => (
  <FlipCard
    w={530}
    h={300}
    tone="green"
    backTone={ai ? 'blue' : 'grey'}
    front={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <IconTile name={icon} tone="green" size={60} />
        <div style={{ fontSize: 29, fontWeight: 600, lineHeight: 1.3, color: C.ink }}>{q}</div>
      </div>
    }
    back={
      <div>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 44, color: ai ? C.blue : C.soft }}>{ai ? '✓ C’est de l’IA' : '✗ Pas d’IA'}</div>
        <div style={{ marginTop: 14, fontSize: 26, lineHeight: 1.4, color: C.ink }}>{why}</div>
      </div>
    }
  />
);

const M1_AiOrNot: Page = () => (
  <Frame mod={1} kind="exercice">
    <Title>IA… ou pas IA ?</Title>
    <Lede>« IA » ou « pas IA » ? Votez, puis on retourne la carte.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 530px)', rowGap: 30, columnGap: 44, ...dl(150) }}>
      <M1Flip icon="bell" q="Outlook vous rappelle une réunion 15 minutes avant" ai={false} why="Une règle fixe : « 15 min avant, afficher une alerte ». Aucun apprentissage." />
      <M1Flip icon="play" q="Netflix vous propose une série qui vous plaît" ai why="Le système a appris vos goûts et ceux de millions d’abonnés semblables." />
      <M1Flip icon="video" q="Teams résume une réunion d’une heure en 10 lignes" ai why="IA qui perçoit (transcription), puis IA qui génère (résumé)." />
      <M1Flip icon="chart" q="Excel colore en rouge les tâches en retard" ai={false} why="Une mise en forme conditionnelle : si date > échéance, alors rouge." />
      <M1Flip icon="mail" q="Gmail suggère « Merci, c’est noté ! » en réponse" ai why="Le modèle prédit une réponse probable à partir du courriel reçu." />
      <M1Flip icon="clock" q="Le thermostat baisse le chauffage à 22 h chaque soir" ai={false} why="Une programmation horaire. S’il apprenait vos habitudes, ce serait de l’IA." />
    </div>
  </Frame>
);

// ─── M1 · IA ⊃ ML ⊃ DL ⊃ IA générative ─────────────────────────────────────
const M1Ring = ({ r, label, tone, n, mid = false }: { r: number; label: string; tone: Tone; n?: number; mid?: boolean }) => (
  <g className={n ? b.pop(n) : undefined} style={vars({ o: 'center bottom' })}>
    <circle cx={350} cy={690 - r} r={r} fill={T[tone].bg} stroke={STRONG[tone]} strokeWidth={4} />
    <text x={350} y={mid ? 690 - r + 10 : 690 - 2 * r + 56} textAnchor="middle" style={{ fontFamily: display, fontWeight: 700, fontSize: 30, fill: T[tone].fg }}>
      {label}
    </text>
  </g>
);

const M1Def = ({ tone, name, children, ex, cls }: { tone: Tone; name: string; children: ReactNode; ex: string; cls?: string }) => (
  <div className={cls} style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 26px', borderLeft: `8px solid ${STRONG[tone]}` }}>
    <div style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: T[tone].fg }}>{name}</div>
    <div style={{ marginTop: 2, fontSize: 25, lineHeight: 1.35, color: C.ink }}>{children}</div>
    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8, fontSize: 22, color: C.muted }}>
      <Icon name="leaf" size={22} color={C.teal} />
      {ex}
    </div>
  </div>
);

const M1_Nested: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>IA, machine learning, deep learning : des poupées russes</Title>
    <Lede>Chaque terme est un cas particulier du précédent.</Lede>
    <svg className={A.fade} width={700} height={700} viewBox="0 0 700 700" style={{ position: 'absolute', left: 120, top: 250 }}>
      <M1Ring r={340} label="Intelligence artificielle" tone="grey" />
      <M1Ring r={262} label="Machine learning" tone="blue" n={1} />
      <M1Ring r={186} label="Deep learning" tone="violet" n={2} />
      <M1Ring r={112} label="IA générative" tone="teal" n={3} mid />
    </svg>
    <div style={{ position: 'absolute', left: 880, top: 250, width: 920, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M1Def tone="grey" name="Intelligence artificielle" ex="Un système expert qui applique les règles de souscription" cls={A.right}>
        Tout système qui imite une capacité humaine, même avec des règles écrites à la main.
      </M1Def>
      <M1Def tone="blue" name="Machine learning · apprentissage automatique" ex="Un modèle qui estime le risque de fraude d’une réclamation" cls={b.left(1)}>
        Le système <b>apprend à partir d’exemples</b> au lieu de suivre des règles écrites.
      </M1Def>
      <M1Def tone="violet" name="Deep learning · apprentissage profond" ex="Lire un formulaire manuscrit numérisé" cls={b.left(2)}>
        Du machine learning avec des <b>réseaux de neurones</b> à nombreuses couches.
      </M1Def>
      <M1Def tone="teal" name="IA générative" ex="Rédiger la réponse à un courriel de membre" cls={b.left(3)}>
        Du deep learning qui <b>produit du contenu nouveau</b> : texte, image, voix, code.
      </M1Def>
    </div>
  </Frame>
);

// ─── M1 · Deep learning: layers that learn to see ───────────────────────────
const M1_PIX = ['1111110', '0000110', '0001100', '0001100', '0011000', '0011000', '0110000'];
const M1_COLS = [340, 540, 740];
const M1_ROWS = [130, 220, 310, 400, 490];

const M1Layer = ({ c, n, label }: { c: number; n: number; label: string }) => (
  <g className={b.fade(n)}>
    {M1_ROWS.map((y) => (
      <circle key={y} cx={M1_COLS[c]} cy={y} r={22} fill={T.violet.bg} stroke={C.violet} strokeWidth={4} />
    ))}
    <text x={M1_COLS[c]} y={580} textAnchor="middle" style={{ fontFamily: display, fontWeight: 700, fontSize: 30, fill: T.violet.fg }}>
      {label}
    </text>
  </g>
);

// Links into layer `to` (0 = from the image, 1–2 = from the previous layer).
const M1Links = ({ to, n }: { to: number; n: number }) => (
  <g className={b.fade(n)} stroke={C.faint} strokeWidth={1.5}>
    {M1_ROWS.flatMap((y2) =>
      (to === 0 ? [200, 260, 310, 360, 420] : M1_ROWS).map((y1) => (
        <line key={`${y1}-${y2}`} x1={to === 0 ? 200 : M1_COLS[to - 1] + 22} y1={y1} x2={M1_COLS[to] - 22} y2={y2} />
      )),
    )}
  </g>
);

const M1_Deep: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>Le deep learning : des couches qui apprennent à voir</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 220, width: 1100, height: 680, background: C.card, borderRadius: 18, boxShadow: SHADOW, ...dl(100) }}>
      <svg width={1100} height={680} viewBox="0 0 1100 680" style={{ position: 'absolute', inset: 0 }}>
        <g transform="translate(40 233)">
          {M1_PIX.flatMap((row, y) =>
            row.split('').map((v, x) => <rect key={`${x}-${y}`} x={x * 22} y={y * 22} width={20} height={20} fill={v === '1' ? C.ink : C.panel} />),
          )}
        </g>
        <text x={117} y={430} textAnchor="middle" style={{ fontFamily: display, fontWeight: 700, fontSize: 26, fill: C.muted }}>
          Image
        </text>
        <M1Links to={0} n={1} />
        <M1Layer c={0} n={1} label="Traits" />
        <M1Links to={1} n={2} />
        <M1Layer c={1} n={2} label="Formes" />
        <M1Links to={2} n={3} />
        <M1Layer c={2} n={3} label="Chiffres" />
        <g className={b.pop(4)} style={vars({ o: 'center' })}>
          <path d="M772 310 H880" stroke={C.violet} strokeWidth={5} />
          <path d="M868 298 L884 310 L868 322" fill="none" stroke={C.violet} strokeWidth={5} strokeLinecap="round" />
          <rect x={900} y={240} width={160} height={140} rx={18} fill={C.violet} />
          <text x={980} y={336} textAnchor="middle" style={{ fontFamily: display, fontWeight: 700, fontSize: 84, fill: '#fff' }}>
            7
          </text>
          <text x={980} y={425} textAnchor="middle" style={{ fontFamily: display, fontWeight: 700, fontSize: 30, fill: T.violet.fg }}>
            à 97 %
          </text>
        </g>
      </svg>
    </div>
    <div style={{ position: 'absolute', left: 1270, top: 220, width: 530, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Card tone="violet" icon="layers" title="Pourquoi « profond » ?" size={25} cls={A.right} style={dl(200)}>
        Parce qu’il y a beaucoup de couches. Chacune combine ce que la précédente a repéré.
      </Card>
      <Card tone="blue" icon="database" title="Ce qu’il lui faut" size={25} cls={A.right} style={dl(320)}>
        Des millions d’exemples et une grande puissance de calcul.
      </Card>
      <Callout cls={b.on(4)} title="Le revers" tone="coral" icon="eye" size={25}>
        Personne n’a écrit ces règles : difficile d’expliquer une décision (module 4).
      </Callout>
    </div>
  </Frame>
);

// ─── M1 · Panorama of AI technologies ───────────────────────────────────────
const M1Tech = ({ d, icon, tone, title, children, ex }: { d: number; icon: IconName; tone: Tone; title: string; children: ReactNode; ex: string }) => (
  <Card tone={tone} icon={icon} title={title} size={25} cls={A.in} style={{ height: 300, ...dl(d) }}>
    {children}
    <div style={{ marginTop: 12, fontSize: 22, color: T[tone].fg, display: 'flex', gap: 8, alignItems: 'center' }}>
      <Icon name="leaf" size={20} />
      <span>{ex}</span>
    </div>
  </Card>
);

const M1_Panorama: Page = () => (
  <Frame mod={1}>
    <Title>Panorama : six grandes familles de technologies</Title>
    <Lede>Les outils du marché combinent souvent plusieurs familles.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 30, columnGap: 30 }}>
      <M1Tech d={100} icon="eye" tone="blue" title="Vision par ordinateur" ex="Lire les formulaires de réclamation">
        Reconnaître des objets, des visages, du texte dans une image.
      </M1Tech>
      <M1Tech d={200} icon="book" tone="teal" title="Traitement du langage" ex="Classer les courriels des membres">
        Comprendre, classer, résumer et traduire des textes.
      </M1Tech>
      <M1Tech d={300} icon="mic" tone="green" title="Reconnaissance de la parole" ex="Transcrire les appels du centre de contact">
        Transformer la voix en texte, et le texte en voix.
      </M1Tech>
      <M1Tech d={400} icon="trend" tone="yellow" title="Analyse prédictive" ex="Estimer le risque de fraude">
        Prévoir, estimer un risque, détecter une anomalie.
      </M1Tech>
      <M1Tech d={500} icon="sparkles" tone="violet" title="IA générative" ex="Rédiger une lettre, illustrer une campagne">
        Produire texte, image, voix ou code.
        <div style={{ marginTop: 10, display: 'flex', gap: 12 }}>
          <AppTile id="chatgpt" size={44} />
          <AppTile id="copilot" size={44} />
          <AppTile id="gemini" size={44} />
          <AppTile id="claude" size={44} />
        </div>
      </M1Tech>
      <M1Tech d={600} icon="bot" tone="coral" title="Agents IA" ex="Préparer seul un dossier de réclamation">
        Enchaîner des actions dans des outils, avec une part d’autonomie.
      </M1Tech>
    </div>
  </Frame>
);

// ─── M1 · QCM & synthesis ───────────────────────────────────────────────────
const M1_Qcm1: Page = () => (
  <QcmPage
    mod={1}
    n={1}
    title="IA, machine learning ou deep learning ?"
    q="Mei entraîne un réseau de neurones à lire les formulaires manuscrits numérisés. Comment le classer ?"
    explain="Un réseau de neurones à plusieurs couches, entraîné sur des exemples, c’est du deep learning. Et comme les poupées russes, c’est donc aussi du machine learning et de l’IA."
  >
    <Opt why="Piège ! Il apprend à partir d’exemples de formulaires déjà lus : c’est la définition du machine learning.">De l’IA, mais pas du machine learning</Opt>
    <Opt why="Piège ! Le machine learning est une partie de l’IA : tout ce qui est machine learning est aussi de l’IA.">Du machine learning, mais pas de l’IA</Opt>
    <Opt ok why="Exact : réseau de neurones profond, donc deep learning, donc machine learning, donc IA.">
      Du deep learning, donc aussi du machine learning et de l’IA
    </Opt>
    <Opt why="Piège ! Il recopie le texte déjà écrit sur le formulaire : il reconnaît, il ne crée rien de nouveau.">De l’IA générative, puisqu’il produit du texte</Opt>
  </QcmPage>
);

const M1_Synth: Page = () => (
  <SynthPage
    mod={1}
    title="Module 1 · Ce qu’il faut retenir"
    poste={
      <>
        Notez trois moments de votre semaine où vous utilisez déjà l’IA sans y penser.
        <br />
        <br />
        Pour chacun : machine learning, deep learning ou IA générative ?
      </>
    }
  >
    <SynthRow n={1} tone="blue" d={100}>
      L’IA <b>apprend à partir d’exemples</b> au lieu de suivre des règles écrites.
    </SynthRow>
    <SynthRow n={2} tone="violet" d={220}>
      IA ⊃ machine learning ⊃ deep learning ⊃ <b>IA générative</b>.
    </SynthRow>
    <SynthRow n={3} tone="teal" d={340}>
      Elle répond avec une <b>probabilité</b>, jamais une certitude.
    </SynthRow>
    <SynthRow n={4} tone="coral" d={460}>
      Un LLM écrit le mot le plus <b>probable</b>, pas le plus vrai.
    </SynthRow>
    <SynthRow n={5} tone="yellow" d={580}>
      Tout ce qui est automatique <b>n’est pas</b> de l’IA.
    </SynthRow>
  </SynthPage>
);

// ═══ 20-m2 ═════════════════════════════════════════════════════════════

// ─── M2 · Divider ───────────────────────────────────────────────────────────
const M2_Divider: Page = () => (
  <Section n={2} title={<>Applications concrètes<br />de l’IA</>} sub="Ce que l’IA fait déjà dans les RH, la santé, la finance et le marketing." dur="≈ 30 min" kind="demo">
    <SecItem n={1}>Quatre secteurs, douze usages</SecItem>
    <SecItem n={2}>Des réussites documentées</SecItem>
    <SecItem n={3}>Démonstrations : agent conversationnel et lecture de documents</SecItem>
    <SecItem n={4}>Le Programme IA de la Mutuelle</SecItem>
  </Section>
);
M2_Divider.transition = BLOOM;

// ─── M2 · Four sectors ──────────────────────────────────────────────────────
const M2Use = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', fontSize: 25, lineHeight: 1.35, color: C.ink }}>
    <span style={{ flex: 'none', width: 11, height: 11, background: C.blue, transform: 'translateY(-3px)' }} />
    <span>{children}</span>
  </div>
);

const M2Sector = ({ n, icon, tone, name, ph, pos, children, watch }: { n: number; icon: IconName; tone: Tone; name: string; ph: PhotoId; pos?: string; children: ReactNode; watch: string }) => (
  <div className={b.on(n)} style={{ display: 'flex', height: 360, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, overflow: 'hidden' }}>
    <Photo id={ph} w={240} h={360} radius={0} pos={pos} />
    <div style={{ flex: 1, boxSizing: 'border-box', padding: '26px 26px 22px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconTile name={icon} tone={tone} size={56} solid />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 38, color: C.ink }}>{name}</span>
      </div>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, background: T.coral.bg, borderRadius: 10, padding: '8px 14px', fontSize: 22, color: T.coral.fg, fontWeight: 600 }}>
        <Icon name="alert" size={24} />
        {watch}
      </div>
    </div>
  </div>
);

const M2_Sectors: Page = () => (
  <Frame mod={2} beats={4}>
    <Title>Quatre secteurs, douze usages déjà courants</Title>
    <div style={{ position: 'absolute', left: 120, top: 206, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, 825px)', rowGap: 24, columnGap: 30 }}>
      <M2Sector n={1} icon="users" tone="green" ph="entrevue" pos="70% 50%" name="Ressources humaines" watch="Vigilance : biais dans le tri des CV">
        <M2Use>Rédiger des offres d’emploi inclusives</M2Use>
        <M2Use>Présélectionner des candidatures</M2Use>
        <M2Use>Répondre aux questions des employés</M2Use>
      </M2Sector>
      <M2Sector n={2} icon="stethoscope" tone="teal" ph="radiologie" pos="60% 50%" name="Santé" watch="Vigilance : données sensibles">
        <M2Use>Aider au diagnostic en imagerie</M2Use>
        <M2Use>Résumer les notes cliniques</M2Use>
        <M2Use>Prévoir l’achalandage des urgences</M2Use>
      </M2Sector>
      <M2Sector n={3} icon="money" tone="blue" ph="paiement" name="Finance et assurance" watch="Vigilance : pouvoir expliquer un refus">
        <M2Use>Détecter la fraude en temps réel</M2Use>
        <M2Use>Évaluer un risque de crédit</M2Use>
        <M2Use>Lire factures, contrats et formulaires</M2Use>
      </M2Sector>
      <M2Sector n={4} icon="megaphone" tone="yellow" ph="timesSquare" name="Marketing" watch="Vigilance : profilage et consentement">
        <M2Use>Recommander le bon produit</M2Use>
        <M2Use>Créer textes et visuels de campagne</M2Use>
        <M2Use>Analyser les avis et les commentaires</M2Use>
      </M2Sector>
    </div>
  </Frame>
);

// ─── M2 · Documented successes ──────────────────────────────────────────────
const M2Case = ({ d, icon, tone, tag, title, ph, pos, children, src }: { d: number; icon: IconName; tone: Tone; tag: string; title: string; ph: PhotoId; pos?: string; children: ReactNode; src: string }) => (
  <div className={A.in} style={{ ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 570, background: C.card, borderRadius: 18, boxShadow: SHADOW, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Photo id={ph} w="100%" h={190} radius={0} pos={pos}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 7, background: STRONG[tone] }} />
        <div style={{ position: 'absolute', left: 16, top: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <IconTile name={icon} tone={tone} size={44} solid />
          <Tag tone={tone} size={20} style={{ background: '#fff' }}>
            {tag}
          </Tag>
        </div>
      </Photo>
      <div style={{ flex: 1, padding: '18px 24px 20px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 10, fontSize: 24, lineHeight: 1.42, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 'auto', fontSize: 19, lineHeight: 1.35, color: C.muted }}>{src}</div>
      </div>
    </div>
  </div>
);

const M2_Cases: Page = () => (
  <Frame mod={2} kind="cas">
    <Title>Quatre réussites documentées</Title>
    <Lede>Des gains réels, mesurés… et à chaque fois, une question à se poser.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 397px)', columnGap: 30 }}>
      <M2Case d={100} icon="eye" tone="teal" tag="Santé · 2018" title="Lire un fond d’œil" ph="fondOeil" src="Autorisation de la FDA, avril 2018 (IDx-DR)">
        Premier système autorisé aux États-Unis à détecter la rétinopathie diabétique sans qu’un spécialiste lise l’image.
      </M2Case>
      <M2Case d={220} icon="sparkles" tone="violet" tag="Science · 2024" title="Prédire les protéines" ph="proteine" src="Prix Nobel de chimie 2024 (AlphaFold)">
        AlphaFold prédit la forme de centaines de millions de protéines. Ses créateurs reçoivent le prix Nobel.
      </M2Case>
      <M2Case d={340} icon="shield" tone="blue" tag="Finance · 2023" title="Bloquer la fraude" ph="datacenter" src="Visa, communiqué de juillet 2024">
        Selon Visa, son IA a aidé à bloquer environ 40 milliards de dollars américains de fraude en un an.
      </M2Case>
      <M2Case d={460} icon="play" tone="yellow" tag="Marketing · 2015" title="Recommander" ph="achat" src="Gomez-Uribe et Hunt, ACM, 2015">
        Chez Netflix, environ 80 % des heures visionnées viennent des recommandations personnalisées.
      </M2Case>
    </div>
    <Callout cls={A.in} title="Le revers de chaque réussite" tone="violet" icon="scale" size={26} style={{ position: 'absolute', left: 120, top: 870, width: 1680, padding: '14px 26px', ...dl(700) }}>
      Qui vérifie l’erreur du système ? Qui a donné ses données ? Qui peut contester ? Ce sera notre après-midi.
    </Callout>
  </Frame>
);

// ─── M2 · Demo: a member-service chatbot ────────────────────────────────────
const M2Msg = ({ who, tone, label, cls, children }: { who: 'user' | 'agent'; tone?: Tone; label?: string; cls?: string; children: ReactNode }) => {
  const right = who === 'user';
  const bg = right ? C.card : tone ? T[tone].bg : T.blue.bg;
  return (
    <div className={cls} style={{ display: 'flex', flexDirection: right ? 'row-reverse' : 'row', gap: 16, alignItems: 'flex-start' }}>
      <Avatar who={who} size={52} />
      <div style={{ maxWidth: 760, background: bg, borderRadius: right ? '20px 6px 20px 20px' : '6px 20px 20px 20px', boxShadow: tone ? `inset 0 0 0 2.5px ${STRONG[tone]}` : SHADOW_SM, padding: '12px 22px', fontSize: 25, lineHeight: 1.4, color: C.ink }}>
        {label ? (
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 20, letterSpacing: '0.1em', textTransform: 'uppercase', color: tone ? T[tone].fg : C.muted, marginBottom: 2 }}>{label}</div>
        ) : null}
        {children}
      </div>
    </div>
  );
};

const M2Watch = ({ n, icon, tone, title, children }: { n: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.fade(n)} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 18px' }}>
    <IconTile name={icon} tone={tone} size={48} />
    <div>
      <div style={{ fontWeight: 700, fontSize: 25, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, lineHeight: 1.35, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M2_DemoChat: Page = () => (
  <Frame mod={2} kind="demo" beats={4}>
    <Title>Démo · « Léa », l’agent conversationnel de la Mutuelle</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 210, width: 1080, height: 720, boxSizing: 'border-box', background: C.panel, borderRadius: 18, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16, ...dl(100) }}>
      <M2Msg who="user">Bonjour, comment je fais une demande de prestations d’invalidité ?</M2Msg>
      <M2Msg who="agent" label="Léa" cls={b.on(1)}>
        Bonjour ! Remplissez le formulaire dans votre Espace membre, avec la déclaration de votre médecin. Voulez-vous le lien ?
      </M2Msg>
      <M2Msg who="user" cls={b.on(2)}>
        Mon médecin parle d’épuisement professionnel. Ça va être accepté ?
      </M2Msg>
      <M2Msg who="agent" tone="coral" label="Réponse A · risquée" cls={b.on(3)}>
        Oui, ce type de dossier est généralement accepté. Vous devriez recevoir vos prestations sous 2 semaines !
      </M2Msg>
      <M2Msg who="agent" tone="green" label="Réponse B · responsable" cls={b.on(4)}>
        Je ne peux pas me prononcer sur votre dossier : une conseillère l’évaluera. Voulez-vous lui parler ?
      </M2Msg>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 210, width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Eyebrow cls={A.in} c={C.blue} style={dl(200)}>
        Ce qu’on observe
      </Eyebrow>
      <M2Watch n={1} icon="smile" tone="blue" title="Le ton">
        Fluide, poli, disponible jour et nuit.
      </M2Watch>
      <M2Watch n={2} icon="heart" tone="violet" title="Des données de santé">
        Le membre confie un diagnostic sans y penser.
      </M2Watch>
      <M2Watch n={3} icon="alert" tone="coral" title="Une promesse inventée">
        Accord et délai : rien ne les fonde.
      </M2Watch>
      <M2Watch n={4} icon="humanCheck" tone="green" title="Une limite assumée">
        Elle sait dire « je ne sais pas » et passer la main.
      </M2Watch>
    </div>
  </Frame>
);

// ─── M2 · Demo: reading a scanned form ──────────────────────────────────────
const M2Field = ({ n, label, value, tone, cls }: { n: number; label: string; value: string; tone: Tone; cls?: string }) => (
  <div className={cls} style={{ position: 'relative', height: 74, borderBottom: `2px solid ${C.rule}`, display: 'flex', alignItems: 'flex-end', paddingBottom: 6 }}>
    <span style={{ position: 'absolute', left: 0, top: 4, fontSize: 19, color: C.muted, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</span>
    <span style={{ fontFamily: '"Segoe Script", "Comic Sans MS", cursive', fontSize: 30, color: '#1F3A93' }}>{value}</span>
    <span className={b.pop(n)} style={{ position: 'absolute', inset: '-6px -10px', borderRadius: 8, boxShadow: `0 0 0 3px ${STRONG[tone]}`, background: mix(STRONG[tone], 8, 'transparent') }} />
  </div>
);

const M2Out = ({ n, k: key, v, p, tone }: { n: number; k: string; v: string; p: number; tone: Tone }) => (
  <div className={b.left(n)} style={{ display: 'flex', alignItems: 'center', gap: 14, height: 66, borderTop: `1.5px solid ${C.rule}` }}>
    <span style={{ width: 190, fontFamily: mono, fontSize: 22, color: C.muted }}>{key}</span>
    <span style={{ flex: 1, fontWeight: 600, fontSize: 25, color: C.ink }}>{v}</span>
    <Tag tone={tone} size={21}>
      {p} %
    </Tag>
  </div>
);

const M2_DemoVision: Page = () => (
  <Frame mod={2} kind="demo" beats={5}>
    <Title>Démo · Lire un formulaire manuscrit numérisé</Title>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 210, width: 780, height: 720, boxSizing: 'border-box', background: '#FFFEF8', borderRadius: 6, boxShadow: '0 30px 60px -30px rgba(20,60,100,.55), 0 0 0 1px rgba(0,0,0,.06)', padding: '30px 40px', transform: 'rotate(-0.8deg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <IconTile name="leaf" tone="teal" size={48} solid />
        <div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 28, color: C.ink }}>Mutuelle des Érables</div>
          <div style={{ fontSize: 20, color: C.muted }}>Demande de remboursement · soins de santé</div>
        </div>
      </div>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <M2Field n={1} label="Nom du membre" value="Gabrielle Tremblay" tone="blue" />
        <M2Field n={2} label="Numéro de certificat" value="ME-48 213 07" tone="blue" />
        <M2Field n={3} label="Type de soin" value="Physiothérapie" tone="blue" />
        <M2Field n={4} label="Montant réclamé" value="85,00 $" tone="blue" />
        <M2Field n={5} label="Signature" value="G. Tremblay" tone="coral" />
      </div>
    </div>
    <div style={{ position: 'absolute', left: 960, top: 210, width: 840 }}>
      <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 30px 10px', ...dl(200) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <Icon name="scan" size={30} color={C.blue} />
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 28, color: C.ink }}>Ce que le modèle extrait</span>
          <span style={{ marginLeft: 'auto', fontSize: 21, color: C.muted }}>confiance</span>
        </div>
        <M2Out n={1} k="membre" v="Gabrielle Tremblay" p={98} tone="green" />
        <M2Out n={2} k="certificat" v="ME-48 213 07" p={95} tone="green" />
        <M2Out n={3} k="soin" v="Physiothérapie" p={97} tone="green" />
        <M2Out n={4} k="montant" v="85,00 $" p={91} tone="green" />
        <M2Out n={5} k="signature" v="présente ?" p={54} tone="coral" />
      </div>
      <Callout cls={b.on(5)} title="Seuil de confiance" tone="yellow" icon="humanCheck" size={25} style={{ marginTop: 22, ...dl(300) }}>
        Sous 80 %, le dossier part vers une personne. La machine trie, l’humain tranche.
      </Callout>
    </div>
  </Frame>
);

// ─── M2 · Comparing free AI assistants ──────────────────────────────────────
const M2ToolRow = ({ d, id, plus, minus, check }: { d: number; id: AppId; plus: string; minus: string; check: string }) => (
  <div className={A.left} style={{ display: 'grid', gridTemplateColumns: '300px 1fr 1fr 1fr', alignItems: 'center', columnGap: 24, minHeight: 92, borderTop: `1.5px solid ${C.rule}`, ...dl(d) }}>
    <AppChip id={id} size={26} />
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 23, lineHeight: 1.35, color: C.ink }}>
      <Icon name="check" size={24} color={C.green} sw={3} style={{ marginTop: 3 }} />
      <span>{plus}</span>
    </div>
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 23, lineHeight: 1.35, color: C.ink }}>
      <Icon name="x" size={24} color={C.coral} sw={3} style={{ marginTop: 3 }} />
      <span>{minus}</span>
    </div>
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 23, lineHeight: 1.35, color: T.violet.fg }}>
      <Icon name="search" size={24} style={{ marginTop: 3 }} />
      <span>{check}</span>
    </div>
  </div>
);

const M2_Tools: Page = () => (
  <Frame mod={2}>
    <Title>Quel assistant gratuit choisir ? Avantages et limites</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '6px 30px 4px', ...dl(100) }}>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 1fr 1fr', columnGap: 24, height: 54, alignItems: 'center' }}>
        <span />
        <Eyebrow c={T.green.fg} size={21}>
          Points forts
        </Eyebrow>
        <Eyebrow c={T.coral.fg} size={21}>
          Limites
        </Eyebrow>
        <Eyebrow c={T.violet.fg} size={21}>
          À vérifier
        </Eyebrow>
      </div>
      <M2ToolRow d={150} id="chatgpt" plus="Polyvalent : texte, images, voix, recherche Web" minus="Peut inventer des sources ; quotas en version gratuite" check="Le réglage qui utilise vos échanges pour l’entraînement" />
      <M2ToolRow d={230} id="copilot" plus="Recherche Web avec sources citées ; compte Microsoft gratuit" minus="Moins de réglages fins que les versions payantes" check="Version grand public ≠ Copilot d’entreprise protégé" />
      <M2ToolRow d={310} id="gemini" plus="Recherche Google, images, lien avec Gmail et Docs" minus="Mêle parfois sources et suppositions" check="Des réviseurs humains peuvent lire des échanges (selon Google)" />
      <M2ToolRow d={390} id="claude" plus="Rédaction nuancée, longs documents, analyse" minus="Ne crée pas d’images ; quota quotidien" check="Le choix d’entraînement sur vos conversations" />
      <M2ToolRow d={470} id="mistral" plus="Société européenne, rapide, à l’aise en français" minus="Écosystème plus restreint" check="Les conditions de la version gratuite" />
      <M2ToolRow d={550} id="perplexity" plus="Moteur de réponse : cite ses sources à chaque réponse" minus="Moins à l’aise pour rédiger longuement" check="Une source citée reste à ouvrir et à lire" />
    </div>
    <Callout cls={A.in} title="La règle, quel que soit l’outil" tone="yellow" icon="lock" size={25} style={{ position: 'absolute', left: 120, top: 880, width: 1680, padding: '12px 26px', ...dl(700) }}>
      Version gratuite = aucune donnée personnelle ni confidentielle. Comparatif indicatif, novembre 2026 : les offres changent souvent.
    </Callout>
  </Frame>
);

// ─── M2 · The Mutuelle's AI programme ───────────────────────────────────────
const M2Proj = ({ n, code, icon, tone, title, who, tech, gain, q }: { n: number; code: string; icon: IconName; tone: Tone; title: string; who: CastId; tech: string; gain: string; q: string }) => (
  <div className={A.in} style={{ ...dl(n * 120) }}>
    <div style={{ boxSizing: 'border-box', height: 640, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '26px 26px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <IconTile name={icon} tone={tone} size={60} solid />
        <Tag tone={tone} size={22}>
          {code}
        </Tag>
      </div>
      <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 34, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 14 }}>
        <Who id={who} size={22} sub={false} />
      </div>
      <div style={{ marginTop: 14, fontSize: 22, lineHeight: 1.4, color: C.muted }}>{tech}</div>
      <div style={{ marginTop: 8, fontSize: 24, lineHeight: 1.4, color: C.ink }}>
        <b>Gain espéré :</b> {gain}
      </div>
      <div className={b.on(n)} style={{ marginTop: 'auto', display: 'flex', gap: 10, alignItems: 'flex-start', background: T.violet.bg, borderRadius: 12, padding: '12px 16px', fontSize: 23, lineHeight: 1.35, color: T.violet.fg, fontWeight: 600 }}>
        <Icon name="scale" size={26} style={{ marginTop: 2 }} />
        <span>{q}</span>
      </div>
    </div>
  </div>
);

const M2_Programme: Page = () => (
  <Frame mod={2} kind="cas" beats={4} label="Module 02 · Fil rouge">
    <Title>Le Programme IA de la Mutuelle : quatre projets</Title>
    <div style={{ position: 'absolute', left: 120, top: 220, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 397px)', columnGap: 30 }}>
      <M2Proj n={1} code="P1" icon="chat" tone="blue" title="Léa, l’agent conversationnel" who="vincent" tech="IA générative" gain="répondre 24 h sur 24 aux questions simples" q="Peut-elle promettre ? Le membre sait-il qu’il parle à une IA ?" />
      <M2Proj n={2} code="P2" icon="users" tone="green" title="Le tri des candidatures" who="samir" tech="Machine learning sur 10 ans d’embauches" gain="passer de 4 000 CV à 400" q="Le modèle reproduit-il les choix du passé ?" />
      <M2Proj n={3} code="P3" icon="shield" tone="teal" title="Le score de risque de fraude" who="mei" tech="Analyse prédictive sur les réclamations" gain="cibler les contrôles" q="Peut-on expliquer le score à un membre soupçonné ?" />
      <M2Proj n={4} code="P4" icon="megaphone" tone="yellow" title="Les campagnes personnalisées" who="vincent" tech="Prédiction et génération de contenus" gain="la bonne offre au bon membre" q="Les membres ont-ils consenti à ce profilage ?" />
    </div>
  </Frame>
);

// ─── M2 · QCM & synthesis ───────────────────────────────────────────────────
const M2_Qcm: Page = () => (
  <QcmPage
    mod={2}
    n={2}
    title="Qui répond de l’agent conversationnel ?"
    q="Léa écrit à un membre : « Votre dossier sera accepté. » Il est refusé. Qui est responsable de cette promesse ?"
    explain="L’organisation qui met un agent conversationnel en ligne répond de ce qu’il dit, comme d’une page de son site. Un tribunal l’a confirmé en 2024 (Air Canada) : on y revient au module 7."
  >
    <Opt ok why="Oui : pour le membre, Léa parle au nom de la Mutuelle. La Mutuelle répond de ses réponses, comme de son site web.">
      La Mutuelle, qui a mis Léa en ligne
    </Opt>
    <Opt why="Piège ! Le fournisseur du modèle a pu commettre une faute envers la Mutuelle, mais face au membre, c’est la Mutuelle qui s’est engagée.">
      Le fournisseur du modèle d’IA
    </Opt>
    <Opt why="Piège ! On ne peut pas reprocher au membre d’avoir cru l’outil officiel de sa mutuelle.">Le membre, qui aurait dû vérifier ailleurs</Opt>
    <Opt why="Piège ! « C’est la machine » n’est pas une défense : quelqu’un l’a choisie, configurée et publiée.">Personne : c’est une erreur de la machine</Opt>
  </QcmPage>
);

const M2_Synth: Page = () => (
  <SynthPage
    mod={2}
    title="Module 2 · Ce qu’il faut retenir"
    poste={
      <>
        Repérez un usage de l’IA dans votre secteur.
        <br />
        <br />
        Posez-vous la question du jour : qu’est-ce que ça change pour la confiance des personnes concernées ?
      </>
    }
  >
    <SynthRow n={1} tone="green" d={100}>
      L’IA est déjà présente dans <b>tous les secteurs</b>, souvent sans bruit.
    </SynthRow>
    <SynthRow n={2} tone="blue" d={220}>
      Les gains sont <b>réels et mesurés</b> : diagnostic, fraude, recommandation.
    </SynthRow>
    <SynthRow n={3} tone="coral" d={340}>
      Un agent conversationnel peut <b>promettre ce qu’il ne sait pas</b>.
    </SynthRow>
    <SynthRow n={4} tone="yellow" d={460}>
      Sous un seuil de confiance, <b>l’humain tranche</b>.
    </SynthRow>
    <SynthRow n={5} tone="violet" d={580}>
      Chaque projet d’IA pose <b>une question éthique</b> dès le départ.
    </SynthRow>
  </SynthPage>
);

// ═══ 30-a1 ═════════════════════════════════════════════════════════════

// ─── Workshop helpers (shared by the three ateliers) ────────────────────────
// Step page: instructions on the left, compact timer + "à noter" on the right.
const WorkStep = ({
  mod,
  label,
  title,
  lede,
  timerId,
  minutes,
  timerLabel,
  side,
  children,
}: {
  mod: number;
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  timerId: string;
  minutes: number;
  timerLabel: string;
  side: ReactNode;
  children: ReactNode;
}) => (
  <Frame mod={mod} kind="atelier" label={label}>
    <Title>{title}</Title>
    {lede ? <Lede>{lede}</Lede> : null}
    <div style={{ position: 'absolute', left: 120, top: lede ? 280 : 220, width: 1060, display: 'flex', flexDirection: 'column', gap: 20 }}>{children}</div>
    <div style={{ position: 'absolute', left: 1230, top: lede ? 280 : 220, width: 570, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Timer id={timerId} minutes={minutes} label={timerLabel} compact cls={A.in} style={dl(100)} />
      {side}
    </div>
  </Frame>
);

// "À noter pour vous" card: what each participant writes in their own document.
const NoteCard = ({ title = 'À noter pour vous', children, d = 300 }: { title?: string; children: ReactNode; d?: number }) => (
  <div className={A.right} style={{ background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.yellow}`, padding: '24px 28px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Icon name="note" size={30} color={C.amber} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 24, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.yellow.fg }}>{title}</span>
    </div>
    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
  </div>
);

const NoteLine = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 24, lineHeight: 1.38, color: C.ink }}>
    <span style={{ flex: 'none', width: 22, height: 22, marginTop: 5, borderRadius: 5, boxShadow: `inset 0 0 0 2.5px ${C.faint}` }} />
    <span>{children}</span>
  </div>
);

// Numbered instruction row.
const DoRow = ({ n, tone = 'yellow', d, children }: { n: number; tone?: Tone; d: number; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px', ...dl(d) }}>
    <Num n={n} tone={tone} size={44} />
    <div style={{ fontSize: 25, lineHeight: 1.4, color: C.ink }}>{children}</div>
  </div>
);

// Programme line on a workshop brief.
const PlanRow = ({ n, mins, d, children }: { n: number | string; mins: string; d: number; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 74, borderTop: `1.5px solid ${C.rule}`, ...dl(d) }}>
    <Num n={n} tone="yellow" size={46} />
    <span style={{ flex: 1, fontSize: 28, fontWeight: 500, color: C.ink }}>{children}</span>
    <Tag tone="grey" size={22}>
      <Icon name="clock" size={22} /> {mins}
    </Tag>
  </div>
);

// ─── A1 · Divider ───────────────────────────────────────────────────────────
const A1_Divider: Page = () => (
  <Section n={3} title="Atelier 1 · Explorer des outils d’IA" sub="À vous de manipuler : un agent conversationnel, puis un outil de génération." dur="≈ 40 min" kind="atelier">
    <SecItem n={1}>Converser avec un agent conversationnel</SecItem>
    <SecItem n={2}>Le mettre à l’épreuve : faits, sources, pression</SecItem>
    <SecItem n={3}>Générer une image ou un texte, et observer</SecItem>
    <SecItem n={4}>Débriefing avec deux ou trois volontaires</SecItem>
  </Section>
);
A1_Divider.transition = BLOOM;

// ─── A1 · Brief ─────────────────────────────────────────────────────────────
const A1_Brief: Page = () => (
  <Frame mod={3} kind="atelier" label="Atelier 1 · Consignes">
    <Title>Votre mission : prendre l’IA en flagrant délit</Title>
    <Lede>Chacun sur son poste, trois étapes guidées. Les textes à copier arrivent dans le Chat.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 290, width: 1000, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 34px 6px', ...dl(100) }}>
      <PlanRow n={1} mins="8 min" d={200}>
        Converser avec un agent conversationnel
      </PlanRow>
      <PlanRow n={2} mins="10 min" d={300}>
        Le mettre à l’épreuve
      </PlanRow>
      <PlanRow n={3} mins="10 min" d={400}>
        Générer une image ou un texte
      </PlanRow>
      <PlanRow n="★" mins="8 min" d={500}>
        Débriefing : deux ou trois volontaires
      </PlanRow>
      <div className={A.fade} style={{ display: 'flex', alignItems: 'center', gap: 14, height: 84, borderTop: `1.5px solid ${C.rule}`, fontSize: 26, color: C.soft, ...dl(600) }}>
        <Icon name="flag" size={30} color={C.amber} />
        <span>
          <b style={{ color: C.ink }}>Votre livrable :</b> trois constats notés dans un document à vous.
        </span>
      </div>
    </div>
    <GuideLink cls={A.fade} style={{ position: 'absolute', left: 120, top: 740, ...dl(700) }} />
    <div style={{ position: 'absolute', left: 1180, top: 290, width: 620, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div className={A.right} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 28px', ...dl(300) }}>
        <Eyebrow c={C.muted} size={21}>
          Un outil au choix (version gratuite)
        </Eyebrow>
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 16 }}>
          <AppChip id="chatgpt" size={26} />
          <AppChip id="copilot" size={26} />
          <AppChip id="gemini" size={26} />
          <AppChip id="claude" size={26} />
          <AppChip id="mistral" size={26} />
          <AppChip id="perplexity" size={26} />
        </div>
      </div>
      <Callout cls={A.right} title="Règle d’or" tone="coral" icon="lock" size={25} style={dl(450)}>
        Aucune donnée réelle : ni nom, ni dossier, ni information de santé.
      </Callout>
      <Callout cls={A.right} title="Bloqué ?" tone="blue" icon="mic" size={25} style={dl(550)}>
        Dites-le au micro : on regarde ensemble en partage d’écran.
      </Callout>
    </div>
  </Frame>
);

// ─── A1 · Step 1: converse (APSM: SST message in a mine · Sobeys: grocery customer service) ─
const A1_Step1: Page = () => {
  const apsm = useClient() === 'apsm';
  return (
    <WorkStep
      mod={3}
      label="Atelier 1 · Étape 1 sur 3"
      title="Étape 1 · Converser avec un agent conversationnel"
      timerId="a1-s1"
      minutes={8}
      timerLabel="Étape 1"
      side={
        apsm ? (
          <NoteCard>
            <NoteLine>Le message est-il exact et applicable sous terre ?</NoteLine>
            <NoteLine>A-t-il inventé une règle, une distance, un article ?</NoteLine>
            <NoteLine>Pourrait-on le lire tel quel, sans validation d’une personne compétente ?</NoteLine>
          </NoteCard>
        ) : (
          <NoteCard>
            <NoteLine>Le ton est-il adapté au client ?</NoteLine>
            <NoteLine>A-t-il promis un remboursement, un bon d’achat, un délai ?</NoteLine>
            <NoteLine>Propose-t-il de parler à une personne ?</NoteLine>
          </NoteCard>
        )
      }
    >
      <PromptBox label="À copier depuis le Chat" size={25} cls={A.in} style={dl(150)}>
        {apsm
          ? 'Tu es l’assistant d’un coordonnateur en santé et sécurité du travail dans une mine souterraine au Québec. Rédige le message de sécurité de 5 lignes qu’il lira à la rencontre de début de quart, sur le risque de chute de roches lors de l’écaillage. Ton clair et direct.'
          : 'Tu es l’agent conversationnel du service à la clientèle d’une épicerie au Québec. Un client écrit : « J’ai acheté du poulet hier et la date était dépassée. Je veux être remboursé, je suis fâché. » Réponds-lui en 5 lignes au plus, sur un ton chaleureux.'}
      </PromptBox>
      <Eyebrow cls={A.in} c={C.muted} size={22} style={{ marginTop: 6, ...dl(300) }}>
        Puis relancez, une demande à la fois
      </Eyebrow>
      <DoRow n={1} d={400}>
        {apsm ? '« Plus simple, pour un travailleur dont le français n’est pas la langue maternelle. »' : '« Plus simple, pour une personne qui lit difficilement le français. »'}
      </DoRow>
      <DoRow n={2} d={500}>
        {apsm ? 'Un travailleur demande : « Et si je vois une fissure et que mon superviseur n’est pas là ? »' : 'Le client répond : « Et je n’ai plus mon reçu. »'}
      </DoRow>
      <DoRow n={3} d={600}>
        « Traduis ta dernière réponse en anglais. »
      </DoRow>
    </WorkStep>
  );
};

// ─── A1 · Step 2: stress-test (APSM: verify a regulation + compare two tools) ─
const A1Test = ({ n, icon, title, d, children, check }: { n: number; icon: IconName; title: string; d: number; children: ReactNode; check: string }) => (
  <div className={A.left} style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 24px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Num n={n} tone="yellow" size={42} />
      <Icon name={icon} size={30} color={C.soft} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{title}</span>
    </div>
    <div style={{ marginTop: 8, fontFamily: mono, fontSize: 22, lineHeight: 1.45, color: C.ink, background: '#F7FAFC', borderRadius: 10, padding: '10px 14px', boxShadow: `inset 0 0 0 1.5px ${C.rule}` }}>{children}</div>
    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10, fontSize: 23, color: T.blue.fg }}>
      <Icon name="search" size={24} />
      {check}
    </div>
  </div>
);

const A1_Step2: Page = () => {
  const apsm = useClient() === 'apsm';
  return (
    <WorkStep
      mod={3}
      label="Atelier 1 · Étape 2 sur 3"
      title={apsm ? 'Étape 2 · Vérifier, et comparer deux outils' : 'Étape 2 · Le mettre à l’épreuve'}
      timerId="a1-s2"
      minutes={10}
      timerLabel="Étape 2"
      side={
        <NoteCard>
          <NoteLine>Ce qui était exact</NoteLine>
          <NoteLine>Ce qui était inventé ou impossible à vérifier</NoteLine>
          <NoteLine>{apsm ? 'Quel outil vous a donné une source vérifiable ?' : 'A-t-il changé d’avis sans nouvelle information ?'}</NoteLine>
        </NoteCard>
      }
    >
      <A1Test n={1} icon="scale" title="Un fait vérifiable" d={150} check="Comparez avec les vrais montants vus ce matin.">
        Quelle est l’amende maximale prévue par la Loi 25 pour une entreprise ?
      </A1Test>
      {apsm ? (
        <A1Test n={2} icon="book" title="Une source réglementaire" d={300} check="Ouvrez LégisQuébec : l’article existe-t-il ? dit-il cela ?">
          Quel article du Règlement sur la santé et la sécurité du travail dans les mines encadre l’écaillage ? Cite le texte exact et le lien LégisQuébec.
        </A1Test>
      ) : (
        <A1Test n={2} icon="book" title="Des sources" d={300} check="Ouvrez les liens : existent-ils ? disent-ils cela ?">
          Cite trois études canadiennes sur l’IA dans les épiceries, avec leurs auteurs et leurs liens.
        </A1Test>
      )}
      {apsm ? (
        <A1Test n={3} icon="layers" title="Deux outils, même question" d={450} check="Concordent-ils ? Lequel cite une source que vous pouvez ouvrir ?">
          Posez la question 2 dans un deuxième outil gratuit (Copilot, Perplexity, Gemini…).
        </A1Test>
      ) : (
        <A1Test n={3} icon="chat" title="La pression" d={450} check="Tient-il sa réponse, ou vous donne-t-il raison ?">
          Es-tu sûr ? Je crois que ta réponse est fausse.
        </A1Test>
      )}
    </WorkStep>
  );
};

// ─── A1 · Step 3: generate (APSM: prevention poster, check the PPE) ─────────
const A1Opt = ({ tone, icon, title, tools, d, children }: { tone: Tone; icon: IconName; title: string; tools: string; d: number; children: ReactNode }) => (
  <div className={A.left} style={{ background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${STRONG[tone]}`, padding: '18px 26px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={50} solid />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>{title}</span>
      <span style={{ marginLeft: 'auto', fontSize: 21, color: C.muted }}>{tools}</span>
    </div>
    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
  </div>
);

const A1Ask = ({ children }: { children: ReactNode }) => (
  <div style={{ fontFamily: mono, fontSize: 22, lineHeight: 1.45, color: C.ink, background: '#F7FAFC', borderRadius: 10, padding: '8px 14px', boxShadow: `inset 0 0 0 1.5px ${C.rule}` }}>{children}</div>
);

const A1_Step3: Page = () => {
  const apsm = useClient() === 'apsm';
  return (
    <WorkStep
      mod={3}
      label="Atelier 1 · Étape 3 sur 3"
      title="Étape 3 · Générer une image ou un texte"
      lede="Choisissez A ou B selon votre outil. Faites les demandes, puis vérifiez ce que vous obtenez."
      timerId="a1-s3"
      minutes={10}
      timerLabel="Étape 3"
      side={
        apsm ? (
          <NoteCard title="Vérifiez, puis observez">
            <NoteLine>Les équipements de protection sont-ils corrects et complets ?</NoteLine>
            <NoteLine>Le texte de l’affiche est-il lisible et juste ?</NoteLine>
            <NoteLine>Qui est représenté ? Qui n’apparaît jamais ?</NoteLine>
          </NoteCard>
        ) : (
          <NoteCard title="Observez qui apparaît">
            <NoteLine>Âge, genre, origine, handicap : qui est représenté ?</NoteLine>
            <NoteLine>Qui n’apparaît jamais ?</NoteLine>
            <NoteLine>Que se passe-t-il si vous demandez plus de diversité ?</NoteLine>
          </NoteCard>
        )
      }
    >
      {apsm ? (
        <>
          <A1Opt tone="violet" icon="image" title="A · Une image" tools="Copilot, ChatGPT, Gemini" d={150}>
            <A1Ask>Crée une affiche de prévention : « un mineur qui porte correctement tous ses équipements de protection, en galerie souterraine ».</A1Ask>
            <A1Ask>Crée l’image d’une personne qui dirige une mine.</A1Ask>
            <A1Ask>Crée l’image d’une personne qui conduit un camion de mine.</A1Ask>
          </A1Opt>
          <A1Opt tone="teal" icon="doc" title="B · Un texte" tools="tous les outils" d={350}>
            <A1Ask>Décris en trois lignes une personne qui travaille sous terre. Donne-lui un prénom.</A1Ask>
            <A1Ask>Même chose pour une personne ingénieure, puis une personne en prévention.</A1Ask>
          </A1Opt>
        </>
      ) : (
        <>
          <A1Opt tone="violet" icon="image" title="A · Une image" tools="Copilot, ChatGPT, Gemini" d={150}>
            <A1Ask>Crée une image publicitaire : « une famille qui fait son épicerie ».</A1Ask>
            <A1Ask>Crée l’image d’une personne qui dirige une chaîne d’épiceries.</A1Ask>
            <A1Ask>Crée l’image d’une personne qui place les produits en rayon, la nuit.</A1Ask>
          </A1Opt>
          <A1Opt tone="teal" icon="doc" title="B · Un texte" tools="tous les outils" d={350}>
            <A1Ask>Décris en trois lignes une personne qui est PDG. Donne-lui un prénom.</A1Ask>
            <A1Ask>Même chose pour une personne caissière, puis une personne bouchère.</A1Ask>
          </A1Opt>
        </>
      )}
    </WorkStep>
  );
};

// ─── A1 · Debrief ───────────────────────────────────────────────────────────
const A1_Debrief: Page = () => (
  <Frame mod={3} kind="atelier" label="Atelier 1 · Débriefing">
    <Title>Débriefing : qu’avez-vous découvert ?</Title>
    <Lede>Deux ou trois volontaires partagent leur écran, deux minutes chacun.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 820, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AskCard n={1} title="Qu’est-ce qui vous a surpris ?" sub="En bien comme en mal" d={100} />
      <AskCard n={2} title="L’avez-vous pris en défaut ?" sub="Fait inventé, fausse source, changement d’avis" d={220} />
      <ByClient
        apsm={<AskCard n={3} title="Vos images étaient-elles justes ?" sub="Équipements de protection, texte, personnes représentées" d={340} />}
        sobeys={<AskCard n={3} title="Qui était sur vos images ?" sub="Et qui n’y était pas ?" d={340} />}
      />
    </div>
    <Timer id="a1-debrief" minutes={8} label="Débriefing" compact cls={A.in} style={{ position: 'absolute', left: 120, top: 760, ...dl(460) }} />
    <div style={{ position: 'absolute', left: 1000, top: 280, width: 800 }}>
      <Eyebrow cls={A.in} c={C.violet} style={dl(200)}>
        Sondage · après l’atelier, votre confiance dans ces outils
      </Eyebrow>
      <Hint cls={A.in} style={{ marginTop: 8, ...dl(260) }}>
        Un numéro par personne, à voix haute
      </Hint>
      <Poll cls={A.in} style={{ marginTop: 22, ...dl(360) }}>
        <PollRow id="up" icon="trend" tone="green" label="1 · Plus grande qu’avant" />
        <PollRow id="same" icon="minus" tone="grey" label="2 · Inchangée" />
        <PollRow id="down" icon="alert" tone="coral" label="3 · Plus faible qu’avant" />
        <PollRow id="nuance" icon="scale" tone="violet" label="4 · Plus nuancée : ça dépend de l’usage" />
      </Poll>
    </div>
  </Frame>
);

// ═══ 40-m4 ═════════════════════════════════════════════════════════════

// ─── M4 · Divider ───────────────────────────────────────────────────────────
const M4_Divider: Page = () => (
  <Section n={4} title="Les grands enjeux éthiques" sub="Biais, transparence, vie privée : ce qui peut mal tourner, et pourquoi." dur="≈ 30 min">
    <SecItem n={1}>Biais algorithmiques et discrimination</SecItem>
    <SecItem n={2}>Transparence et explicabilité</SecItem>
    <SecItem n={3}>Respect de la vie privée et protection des données</SecItem>
  </Section>
);
M4_Divider.transition = BLOOM;

// ─── M5 · Three families of risk ────────────────────────────────────────────
const M4Risk = ({ n, icon, tone, name, q, ex }: { n: number; icon: IconName; tone: Tone; name: string; q: string; ex: ReactNode }) => (
  <div className={b.on(n)} style={{ flex: 1 }}>
    <div style={{ boxSizing: 'border-box', height: 560, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '32px 32px', display: 'flex', flexDirection: 'column' }}>
      <IconTile name={icon} tone={tone} size={84} solid />
      <div style={{ marginTop: 22, fontFamily: display, fontWeight: 700, fontSize: 48, color: C.ink }}>{name}</div>
      <div style={{ marginTop: 10, fontSize: 28, lineHeight: 1.4, color: C.soft }}>{q}</div>
      <div style={{ marginTop: 'auto', background: T[tone].bg, borderRadius: 12, padding: '14px 18px', fontSize: 24, lineHeight: 1.4, color: C.ink }}>{ex}</div>
    </div>
  </div>
);

const M4_Three: Page = () => (
  <Frame mod={4} beats={3}>
    <Title>Trois grands enjeux éthiques</Title>
    <Lede>Aucun n’est une raison de renoncer. Tous sont une raison d’encadrer.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 30 }}>
      <M4Risk n={1} icon="scale" tone="violet" name="Les biais" q="L’IA reproduit, et parfois amplifie, les déséquilibres de ses exemples." ex={<><b>Mutuelle :</b> le tri des CV de Samir (P2).</>} />
      <M4Risk n={2} icon="eye" tone="teal" name="La transparence" q="Personne ne sait dire pourquoi le modèle a décidé." ex={<><b>Mutuelle :</b> le score de fraude de Mei (P3).</>} />
      <M4Risk n={3} icon="lock" tone="blue" name="La vie privée" q="L’IA a faim de données, souvent personnelles, parfois sensibles." ex={<><b>Mutuelle :</b> les campagnes de Vincent (P4).</>} />
    </div>
  </Frame>
);

// ─── M5 · Bias: how it happens (CV screening) ───────────────────────────────
const M4HBar = ({ label, pct, tone, d }: { label: string; pct: number; tone: Tone; d: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 54 }}>
    <span style={{ width: 120, fontSize: 25, color: C.ink }}>{label}</span>
    <div className={A.grow} style={{ width: pct * 5, height: 40, borderRadius: 8, background: STRONG[tone], ...dl(d) }} />
    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>{pct} %</span>
  </div>
);

const M4Cv = ({ name, line, score, tone }: { name: string; line: string; score: number; tone: Tone }) => (
  <div style={{ flex: 1, background: C.card, borderRadius: 14, boxShadow: `${SHADOW_SM}, inset 0 6px 0 ${STRONG[tone]}`, padding: '16px 18px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Icon name="doc" size={26} color={C.soft} />
      <b style={{ fontSize: 24 }}>{name}</b>
    </div>
    <div style={{ marginTop: 8, fontSize: 21, lineHeight: 1.4, color: C.soft }}>10 ans d’expérience · mêmes diplômes</div>
    <div style={{ fontSize: 21, lineHeight: 1.4, color: C.ink }}>{line}</div>
    <div style={{ marginTop: 10, fontFamily: display, fontWeight: 700, fontSize: 44, color: STRONG[tone] }}>{score} / 100</div>
  </div>
);

const M4_Bias: Page = () => (
  <Frame mod={4} beats={4}>
    <Title>Le biais : l’IA apprend aussi nos travers</Title>
    <Lede>Comment un outil de tri de CV, entraîné sur dix ans d’embauches, apprend à discriminer.</Lede>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 280, width: 860, height: 640, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '26px 32px' }}>
      <Eyebrow c={C.soft} size={22}>
        1 · Les exemples : qui a été embauché ?
      </Eyebrow>
      <div style={{ marginTop: 10 }}>
        <M4HBar label="Hommes" pct={80} tone="blue" d={300} />
        <M4HBar label="Femmes" pct={20} tone="violet" d={450} />
      </div>
      <div className={b.on(1)} style={{ marginTop: 22 }}>
        <Eyebrow c={C.soft} size={22}>
          2 · Ce que le modèle en déduit
        </Eyebrow>
        <div style={{ marginTop: 8, fontSize: 27, lineHeight: 1.4, color: C.ink }}>« Un bon profil ressemble aux profils déjà embauchés. »</div>
      </div>
      <div className={b.on(2)} style={{ marginTop: 22 }}>
        <Eyebrow c={C.soft} size={22}>
          3 · Deux CV identiques, sauf une ligne
        </Eyebrow>
        <div style={{ marginTop: 10, display: 'flex', gap: 18 }}>
          <M4Cv name="CV A" line="Capitaine, club de hockey" score={82} tone="green" />
          <M4Cv name="CV B" line="Capitaine, équipe féminine de hockey" score={61} tone="coral" />
        </div>
      </div>
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 1040, top: 280, width: 760 }}>
      <Card tone="teal" icon="book" title="Un cas réel" size={25}>
        En 2018, Amazon a abandonné un outil expérimental de tri de CV : il pénalisait les candidatures contenant le mot « women’s » (Reuters).
      </Card>
    </div>
    <Callout cls={b.on(4)} title="Pour le projet P2 de Samir" tone="violet" icon="humanCheck" size={26} style={{ position: 'absolute', left: 1040, top: 640, width: 760 }}>
      Dix ans d’embauches de la Mutuelle : quels déséquilibres contiennent-ils ? À vérifier avant d’entraîner quoi que ce soit.
    </Callout>
  </Frame>
);

// ─── M5 · Biases in a project ───────────────────────────────────────────────
const M5BiasCard = ({ n, icon, tone, name, children, fix }: { n: number; icon: IconName; tone: Tone; name: string; children: ReactNode; fix: ReactNode }) => (
  <div className={b.on(n)} style={{ width: 825 }}>
    <div style={{ boxSizing: 'border-box', height: 310, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '26px 30px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconTile name={icon} tone={tone} size={58} solid />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 36, color: C.ink }}>{name}</span>
      </div>
      <div style={{ marginTop: 14, fontSize: 25, lineHeight: 1.4, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 'auto', display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 23, lineHeight: 1.4, color: T.green.fg }}>
        <Icon name="shieldCheck" size={26} style={{ marginTop: 2 }} />
        <span>{fix}</span>
      </div>
    </div>
  </div>
);

// ─── M4 · Where biases come from ────────────────────────────────────────────
const M4Src = ({ n, icon, tone, name, children, ex, tag }: { n: number; icon: IconName; tone: Tone; name: string; children: ReactNode; ex: ReactNode; tag: string }) => (
  <div className={b.on(n)}>
    <div style={{ boxSizing: 'border-box', height: 340, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '24px 30px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Num n={n} tone={tone} size={48} />
        <Icon name={icon} size={34} color={T[tone].fg} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 36, color: C.ink }}>{name}</span>
      </div>
      <div style={{ marginTop: 12, fontSize: 25, lineHeight: 1.4, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 'auto', background: T[tone].bg, borderRadius: 12, padding: '12px 18px', fontSize: 23, lineHeight: 1.4, color: C.ink }}>
        <Eyebrow c={T[tone].fg} size={18}>
          {tag}
        </Eyebrow>
        <div style={{ marginTop: 2 }}>{ex}</div>
      </div>
    </div>
  </div>
);

const M4_Sources: Page = () => (
  <Frame mod={4} beats={4}>
    <Title>D’où viennent les biais ? Quatre portes d’entrée</Title>
    <div style={{ position: 'absolute', left: 120, top: 210, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, 825px)', rowGap: 26, columnGap: 30 }}>
      <M4Src n={1} icon="archive" tone="violet" name="Un passé déséquilibré" tag="Recrutement · 2018" ex="Amazon : le modèle apprend que les embauches passées étaient surtout masculines.">
        Les données reflètent des décisions humaines d’hier, avec leurs préjugés.
      </M4Src>
      <M4Src n={2} icon="users" tone="coral" name="Des données incomplètes" tag="Reconnaissance faciale · 2018" ex="Étude « Gender Shades » (MIT) : jusqu’à 34,7 % d’erreurs pour les femmes à la peau foncée, 0,8 % pour les hommes à la peau claire.">
        Certains groupes sont absents ou trop peu nombreux dans les exemples.
      </M4Src>
      <M4Src n={3} icon="map" tone="yellow" name="Des indices indirects" tag="Assurance, crédit" ex="Le code postal peut trahir l’origine ou le revenu ; un prénom ou un sport, le genre.">
        On retire la variable sensible… mais d’autres la révèlent quand même.
      </M4Src>
      <M4Src n={4} icon="target" tone="teal" name="Un mauvais objectif" tag="Santé · États-Unis · 2019" ex="Revue Science : estimer les besoins de soins par les dépenses passées désavantageait les patients noirs, qui avaient moins accès aux soins.">
        Le modèle optimise exactement ce qu’on lui demande, pas ce qu’on voulait.
      </M4Src>
    </div>
  </Frame>
);

// ─── M4 · Transparency & explainability (toggle) ────────────────────────────
const M4Notion = ({ d, icon, tone, name, q }: { d: number; icon: IconName; tone: Tone; name: string; q: string }) => (
  <div className={A.right} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={60} solid />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>{name}</div>
      <div style={{ fontSize: 24, lineHeight: 1.35, color: C.soft }}>{q}</div>
    </div>
  </div>
);

const M4Factor = ({ n, children }: { n: number; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', fontSize: 24, lineHeight: 1.4, color: C.ink }}>
    <Num n={n} tone="teal" size={30} style={{ transform: 'translateY(4px)' }} />
    <span>{children}</span>
  </div>
);

const M4_BlackBox: Page = () => {
  const [on, setOn] = useState(false);
  return (
    <Frame mod={4} kind="exercice">
      <Title>Transparence et explicabilité : pouvoir dire pourquoi</Title>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, ...dl(100) }}>
        <Toggle on={on} onChange={setOn} label={on ? 'Lettre explicable' : 'Lettre « boîte noire »'} tone="teal" size={28} />
      </div>
      <div
        className={A.in}
        style={{ position: 'absolute', left: 120, top: 280, width: 1040, height: 650, boxSizing: 'border-box', background: '#FFFEFA', borderRadius: 10, boxShadow: `${SHADOW}, inset 0 7px 0 ${on ? C.teal : C.faint}`, padding: '30px 40px', transition: `box-shadow 400ms ${EASE}`, ...dl(200) }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconTile name="leaf" tone="teal" size={44} solid />
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 26, color: C.ink }}>Mutuelle des Érables</span>
          <span style={{ marginLeft: 'auto', fontSize: 21, color: C.muted }}>Réclamation no 2027-1184</span>
        </div>
        <div style={{ marginTop: 22, fontSize: 25, lineHeight: 1.45, color: C.ink }}>
          Madame, après analyse, votre réclamation a été <b>signalée pour vérification approfondie</b>. Les versements sont suspendus.
        </div>
        {on ? (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: T.teal.fg }}>Les principaux facteurs de ce signalement :</div>
            <M4Factor n={1}>trois réclamations en six semaines ;</M4Factor>
            <M4Factor n={2}>un fournisseur de soins inscrit depuis moins d’un mois ;</M4Factor>
            <M4Factor n={3}>un montant 2,4 fois supérieur à la moyenne régionale.</M4Factor>
            <div style={{ marginTop: 6, fontSize: 23, lineHeight: 1.45, color: C.soft }}>
              Ce signalement a été produit par un système automatisé. Vous pouvez faire corriger vos renseignements et présenter vos observations à une conseillère, qui pourra réviser la décision.
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 16, fontSize: 26, fontWeight: 600, color: T.coral.fg }}>
            <Icon name="alert" size={34} />
            Pourquoi ? Par qui ? Que puis-je faire ? La lettre ne le dit pas.
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', left: 1210, top: 280, width: 590, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <M4Notion d={300} icon="eye" tone="blue" name="Transparence" q="Savoir qu’une IA intervient, et comment." />
        <M4Notion d={420} icon="bulb" tone="teal" name="Explicabilité" q="Pouvoir dire pourquoi ce résultat, pour cette personne." />
        <M4Notion d={540} icon="humanCheck" tone="green" name="Recours" q="Pouvoir contester auprès d’un humain." />
        <Callout cls={A.right} title="Au Québec" tone="yellow" icon="scale" size={24} style={dl(660)}>
          Pour une décision entièrement automatisée, c’est une obligation légale (module 5).
        </Callout>
      </div>
    </Frame>
  );
};

// ─── M4 · Privacy: AI is hungry for data ────────────────────────────────────
const M4Priv = ({ d, icon, tone, name, children, ex }: { d: number; icon: IconName; tone: Tone; name: string; children: ReactNode; ex: string }) => (
  <div className={A.in} style={{ ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 270, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '22px 28px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconTile name={icon} tone={tone} size={54} solid />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 34, color: C.ink }}>{name}</span>
      </div>
      <div style={{ marginTop: 12, fontSize: 25, lineHeight: 1.4, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 'auto', display: 'flex', gap: 10, alignItems: 'center', fontSize: 22, color: T[tone].fg, fontWeight: 600 }}>
        <Icon name="leaf" size={22} />
        {ex}
      </div>
    </div>
  </div>
);

const M4_Privacy: Page = () => (
  <Frame mod={4}>
    <Title>Vie privée : l’IA a faim de données</Title>
    <Lede>Quatre façons de trahir la confiance, souvent sans le vouloir.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, 825px)', rowGap: 26, columnGap: 30 }}>
      <M4Priv d={100} icon="database" tone="blue" name="Collecter trop" ex="« Tant qu’à y être, gardons tout » : non.">
        Chaque donnée gardée « au cas où » est un risque de plus.
      </M4Priv>
      <M4Priv d={220} icon="route" tone="yellow" name="Détourner l’usage" ex="Une réclamation de santé réutilisée pour le marketing.">
        Des données recueillies pour un but, réutilisées pour un autre.
      </M4Priv>
      <M4Priv d={340} icon="search" tone="violet" name="Deviner l’intime" ex="Des achats en pharmacie qui « révèlent » une grossesse.">
        Un modèle peut déduire une maladie ou une situation familiale jamais déclarées.
      </M4Priv>
      <M4Priv d={460} icon="send" tone="coral" name="Laisser fuir" ex="Samsung, 2023 : du code confidentiel collé dans ChatGPT.">
        Coller un dossier dans un outil public, c’est le sortir de l’organisation.
      </M4Priv>
    </div>
    <Callout cls={A.in} title="La bonne question" tone="teal" icon="humanCheck" size={26} style={{ position: 'absolute', left: 120, top: 860, width: 1680, padding: '14px 26px', ...dl(600) }}>
      La personne s’attend-elle à cet usage de ses données ? Si la réponse est non, on s’arrête.
    </Callout>
  </Frame>
);

// ─── M4 · Exercise: traffic light for data ──────────────────────────────────
const M4Zone = ({ x, icon, tone, label }: { x: number; icon: IconName; tone: Tone; label: string }) => (
  <div
    className={A.fade}
    style={{ position: 'absolute', left: x, top: 500, width: 540, height: 450, boxSizing: 'border-box', borderRadius: 18, background: T[tone].bg, border: `3px dashed ${T[tone].bd}`, padding: '18px 22px' }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={48} solid />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: T[tone].fg }}>{label}</span>
    </div>
  </div>
);

const M4Key = ({ tone, children }: { tone: Tone; children: ReactNode }) => (
  <span className={b.pop(1)} style={{ flex: 'none', marginLeft: 'auto', padding: '2px 10px', borderRadius: 8, background: STRONG[tone], color: tone === 'yellow' ? C.ink : '#fff', fontFamily: display, fontWeight: 700, fontSize: 19 }}>
    {children}
  </span>
);

const M4_Traffic: Page = () => (
  <Frame mod={4} kind="exercice" beats={1}>
    <Title>À vous : quelles données dans quel outil ?</Title>
    <Lede>Dites-moi où va chaque étiquette : vert, jaune ou rouge. Le corrigé apparaît au clic.</Lede>
    <M4Zone x={120} icon="check" tone="green" label="Vert · tout outil" />
    <M4Zone x={690} icon="shieldCheck" tone="yellow" label="Jaune · outil approuvé" />
    <M4Zone x={1260} icon="lock" tone="coral" label="Rouge · jamais tel quel" />
    <Drag x={120} y={262} w={405} tone="blue" size={22}>
      Le texte d’une publicité de la Mutuelle <M4Key tone="green">VERT</M4Key>
    </Drag>
    <Drag x={545} y={262} w={405} tone="blue" size={22}>
      Le dossier d’invalidité d’un membre <M4Key tone="coral">ROUGE</M4Key>
    </Drag>
    <Drag x={970} y={262} w={405} tone="blue" size={22}>
      Le plan marketing 2027, confidentiel <M4Key tone="yellow">JAUNE</M4Key>
    </Drag>
    <Drag x={1395} y={262} w={405} tone="blue" size={22}>
      La grille publique des soins remboursés <M4Key tone="green">VERT</M4Key>
    </Drag>
    <Drag x={120} y={384} w={405} tone="blue" size={22}>
      Les CV reçus pour un poste d’analyste <M4Key tone="coral">ROUGE</M4Key>
    </Drag>
    <Drag x={545} y={384} w={405} tone="blue" size={22}>
      Le compte rendu du comité de direction <M4Key tone="yellow">JAUNE</M4Key>
    </Drag>
    <Drag x={970} y={384} w={405} tone="blue" size={22}>
      Le diagnostic d’un employé en arrêt <M4Key tone="coral">ROUGE</M4Key>
    </Drag>
    <Drag x={1395} y={384} w={405} tone="blue" size={22}>
      Des statistiques de réclamations par région <M4Key tone="yellow">JAUNE</M4Key>
    </Drag>
  </Frame>
);

// ─── M4 · QCM & synthesis ───────────────────────────────────────────────────
const M4_Qcm: Page = () => (
  <QcmPage
    mod={4}
    n={3}
    title="Retirer la variable suffit-il ?"
    q="Le modèle de tri de Samir n’utilise pas le genre des candidats. Peut-il quand même désavantager les femmes ?"
    explain="Retirer une variable sensible ne suffit pas : d’autres données la « trahissent ». Il faut tester les résultats par groupe, avant et après la mise en service."
  >
    <Opt why="Piège ! C’est exactement le cas Amazon : le genre n’était pas une variable, mais des mots du CV le révélaient.">Non : sans la variable genre, c’est impossible</Opt>
    <Opt why="Piège ! Plus de données d’un passé déséquilibré, c’est surtout un biais mieux appris.">Non, si les données d’entraînement sont nombreuses</Opt>
    <Opt why="Piège ! Personne n’a besoin de le programmer : le modèle l’apprend seul, à partir des exemples.">Seulement si Mei l’a programmé ainsi</Opt>
    <Opt ok why="Exact : prénom, sport, interruption de carrière, école… Des indices indirects peuvent révéler le genre.">
      Oui, par des indices indirects : prénom, sport, pause de carrière
    </Opt>
  </QcmPage>
);

const M4_Synth: Page = () => (
  <SynthPage
    mod={4}
    title="Module 4 · Ce qu’il faut retenir"
    poste={
      <>
        Pour un usage de l’IA dans votre organisation, posez trois questions :
        <br />
        <br />
        Qui pourrait être désavantagé ? Saurait-on expliquer un résultat ? Quelles données y passent ?
      </>
    }
  >
    <SynthRow n={1} tone="violet" d={100}>
      Une IA apprend nos <b>déséquilibres</b> : elle n’est jamais neutre par défaut.
    </SynthRow>
    <SynthRow n={2} tone="coral" d={220}>
      Retirer la variable sensible <b>ne suffit pas</b> : il faut tester les résultats.
    </SynthRow>
    <SynthRow n={3} tone="teal" d={340}>
      Transparence, explicabilité, recours : <b>dire qu’une IA intervient, pourquoi, et comment contester</b>.
    </SynthRow>
    <SynthRow n={4} tone="blue" d={460}>
      Moins de données, <b>un seul usage annoncé</b>, aucune fuite vers un outil public.
    </SynthRow>
    <SynthRow n={5} tone="yellow" d={580}>
      La question clé : <b>la personne s’y attend-elle ?</b>
    </SynthRow>
  </SynthPage>
);

// ═══ 50-m5 ═════════════════════════════════════════════════════════════

// ─── M5 · Divider ───────────────────────────────────────────────────────────
const M5_Divider: Page = () => (
  <Section n={5} title="Loi 25 et principes de l’IA responsable" sub="Ce que la loi impose déjà au Québec, et les principes qui guident le reste." dur="≈ 40 min">
    <SecItem n={1}>La Loi 25 : ce qu’elle exige quand on utilise l’IA</SecItem>
    <SecItem n={2}>Décisions automatisées et EFVP</SecItem>
    <SecItem n={3}>La Déclaration de Montréal et les principes de l’IA responsable</SecItem>
    <SecItem n={4}>Ailleurs : l’Europe, le Canada, les normes</SecItem>
  </Section>
);
M5_Divider.transition = BLOOM;

// Photo inset, top-right, beside the title (titles and ledes on these pages stay under 1200 px).
const M5Inset = ({ id, pos }: { id: PhotoId; pos?: string }) => (
  <Photo id={id} w={400} h={168} pos={pos} cls={A.right} style={{ position: 'absolute', left: 1400, top: 98, boxShadow: SHADOW, ...dl(200) }} />
);

// ─── M5 · Loi 25 timeline ───────────────────────────────────────────────────
const M5Mile = ({ n, x, date, tone, title, children }: { n: number; x: number; date: string; tone: Tone; title: string; children: ReactNode }) => (
  <>
    <div className={b.pop(n)} style={{ position: 'absolute', left: x - 18, top: 482, width: 36, height: 36, borderRadius: 99, background: '#fff', boxShadow: `inset 0 0 0 9px ${STRONG[tone]}` }} />
    <div className={b.on(n)} style={{ position: 'absolute', left: x - 250, top: 550, width: 500 }}>
      <div style={{ boxSizing: 'border-box', height: 330, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '24px 28px' }}>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 40, color: tone === 'yellow' ? C.amber : STRONG[tone] }}>{date}</div>
        <div style={{ marginTop: 6, fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{title}</div>
        <div style={{ marginTop: 10, fontSize: 24, lineHeight: 1.42, color: C.soft }}>{children}</div>
      </div>
    </div>
  </>
);

const M5_Law25: Page = () => (
  <Frame mod={5} beats={3}>
    <Title w={1200}>La Loi 25 en bref</Title>
    <Lede w={1200}>Adoptée en 2021, elle modernise la protection des renseignements personnels.</Lede>
    <M5Inset id="parlement" pos="50% 40%" />
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 24, ...dl(100) }}>
      <Tag tone="blue" size={22}>
        <Icon name="org" size={22} /> Entreprises et organismes publics
      </Tag>
      <Tag tone="violet" size={22}>
        <Icon name="shield" size={22} /> Surveillée par la CAI
      </Tag>
      <Tag tone="coral" size={22}>
        <Icon name="money" size={22} /> Jusqu’à 25 M$ ou 4 % du chiffre d’affaires mondial
      </Tag>
    </div>
    <div className={A.grow} style={{ position: 'absolute', left: 120, top: 496, width: 1680, height: 8, borderRadius: 4, background: C.rule, ...dl(200) }} />
    <M5Mile n={1} x={390} date="22 sept. 2022" tone="blue" title="Un responsable, des incidents déclarés">
      Une personne responsable de la protection des renseignements personnels. Les incidents à risque sont déclarés à la CAI.
    </M5Mile>
    <M5Mile n={2} x={960} date="22 sept. 2023" tone="violet" title="Le gros morceau">
      Évaluation des facteurs relatifs à la vie privée, consentement, transparence, décisions automatisées, sanctions.
    </M5Mile>
    <M5Mile n={3} x={1530} date="22 sept. 2024" tone="teal" title="La portabilité">
      Une personne peut obtenir ses renseignements dans un format technologique structuré et couramment utilisé.
    </M5Mile>
  </Frame>
);

// ─── M5 · What Loi 25 requires when you use AI ──────────────────────────────
const M5Duty = ({ d, icon, tone, name, art, children }: { d: number; icon: IconName; tone: Tone; name: string; art: string; children: ReactNode }) => (
  <div className={A.in} style={{ ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 320, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '22px 26px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <IconTile name={icon} tone={tone} size={54} solid />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 32, lineHeight: 1.05, color: C.ink }}>{name}</span>
      </div>
      <div style={{ marginTop: 12, fontSize: 24, lineHeight: 1.4, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 'auto' }}>
        <Tag tone="grey" size={19}>
          {art}
        </Tag>
      </div>
    </div>
  </div>
);

const M5_Duties: Page = () => (
  <Frame mod={5}>
    <Title>Ce que la Loi 25 exige quand on utilise l’IA</Title>
    <Lede>Six obligations qui touchent directement un projet d’IA, ici dans une entreprise privée.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 26, columnGap: 30 }}>
      <M5Duty d={100} icon="humanCheck" tone="blue" name="Un responsable désigné" art="Art. 3.1">
        Par défaut, la personne qui a la plus haute autorité. Elle peut déléguer par écrit.
      </M5Duty>
      <M5Duty d={200} icon="search" tone="violet" name="Une évaluation avant" art="Art. 3.3 · EFVP">
        Tout nouveau système qui traite des renseignements personnels passe par une EFVP.
      </M5Duty>
      <M5Duty d={300} icon="check" tone="green" name="Un consentement éclairé" art="Art. 12 et 14">
        Pour des fins précises, annoncées. Exprès pour les renseignements sensibles.
      </M5Duty>
      <M5Duty d={400} icon="eye" tone="yellow" name="Le profilage annoncé" art="Art. 8.1">
        Informer la personne, et désactiver ces fonctions par défaut.
      </M5Duty>
      <M5Duty d={500} icon="cpu" tone="teal" name="La décision automatisée" art="Art. 12.1">
        Informer, expliquer sur demande, permettre une révision par une personne.
      </M5Duty>
      <M5Duty d={600} icon="alert" tone="coral" name="Les incidents déclarés" art="Art. 3.5 à 3.8">
        Aviser la CAI et les personnes en cas de risque de préjudice sérieux. Tenir un registre.
      </M5Duty>
    </div>
  </Frame>
);

// ─── M5 · Zoom on art. 12.1 ─────────────────────────────────────────────────
const M5Right = ({ n, icon, title, children }: { n: number; icon: IconName; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ flex: 1 }}>
    <div style={{ boxSizing: 'border-box', height: 400, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.teal}`, padding: '26px 28px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Num n={n} tone="teal" size={48} />
        <Icon name={icon} size={36} color={T.teal.fg} />
      </div>
      <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 10, fontSize: 25, lineHeight: 1.42, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M5_Art12: Page = () => (
  <Frame mod={5} beats={4}>
    <Title>Zoom sur l’article 12.1 : la décision automatisée</Title>
    <Lede>Quand une décision repose exclusivement sur un traitement automatisé de renseignements personnels.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', alignItems: 'center', gap: 20 }}>
      <M5Right n={1} icon="bell" title="Informer la personne">
        Au plus tard au moment où on l’informe de la décision.
      </M5Right>
      <FlowArrow w={50} color={C.teal} cls={b.fade(2)} />
      <M5Right n={2} icon="bulb" title="Expliquer, sur demande">
        Les renseignements utilisés, les raisons et les principaux facteurs. Le droit de les faire corriger.
      </M5Right>
      <FlowArrow w={50} color={C.teal} cls={b.fade(3)} />
      <M5Right n={3} icon="humanCheck" title="Écouter, puis réviser">
        La personne présente ses observations à quelqu’un qui peut réviser la décision.
      </M5Right>
    </div>
    <Callout cls={b.on(4)} title="Pour le projet P3 de Mei" tone="yellow" icon="leaf" size={26} style={{ position: 'absolute', left: 120, top: 740, width: 1680 }}>
      Si le score suspend seul les versements, l’article s’applique. Un vrai contrôle humain avant la décision change la donne… s’il n’est pas un simple tampon.
    </Callout>
  </Frame>
);

// ─── M5 · EFVP: five questions before launching P3 ──────────────────────────
const M5_Efvp: Page = () => (
  <Frame mod={5} kind="exercice">
    <Title>L’EFVP : cinq questions avant de lancer le projet P3</Title>
    <Lede>Évaluation des facteurs relatifs à la vie privée. Pour chaque question, dites-moi : la Mutuelle a-t-elle la réponse ?</Lede>
    <Checklist cls={A.in} style={{ position: 'absolute', left: 120, top: 290, width: 1060, ...dl(150) }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="efvp-1">Quelles données, et sont-elles toutes nécessaires ?</CheckItem>
        <CheckItem id="efvp-2">Pour quelle finalité, annoncée aux membres ?</CheckItem>
        <CheckItem id="efvp-3">Où sont-elles hébergées ? Sortent-elles du Québec ?</CheckItem>
        <CheckItem id="efvp-4">Qui y a accès, et combien de temps les garde-t-on ?</CheckItem>
        <CheckItem id="efvp-5">Quels risques pour les membres, et quelles mesures ?</CheckItem>
      </div>
    </Checklist>
    <div style={{ position: 'absolute', left: 1240, top: 290, width: 560, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Card tone="violet" icon="clock" title="Quand ?" size={25} cls={A.right} style={dl(300)}>
        Avant d’acheter ou de développer le système. Pas la veille de la mise en service.
      </Card>
      <Card tone="teal" icon="users" title="Qui ?" size={25} cls={A.right} style={dl(420)}>
        Le chef de projet, avec le responsable de la protection des renseignements personnels.
      </Card>
      <Callout cls={A.right} title="Proportionnée" tone="blue" icon="scale" size={24} style={dl(540)}>
        Plus les données sont sensibles, plus l’évaluation est poussée.
      </Callout>
    </div>
  </Frame>
);

// ─── M5 · Montréal Declaration ──────────────────────────────────────────────
const M5Prin = ({ d, n, icon, tone, children }: { d: number; n: number; icon: IconName; tone: Tone; children: ReactNode }) => (
  <div className={A.pop} style={{ ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 230, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 6px 0 ${STRONG[tone]}`, padding: '20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.faint }}>{pad(n)}</span>
        <IconTile name={icon} tone={tone} size={58} />
      </div>
      <div style={{ marginTop: 'auto', marginBottom: 'auto', fontFamily: display, fontWeight: 700, fontSize: 29, lineHeight: 1.12, color: C.ink }}>{children}</div>
    </div>
  </div>
);

const M5_Montreal: Page = () => (
  <Frame mod={5}>
    <Title w={1200}>La Déclaration de Montréal : dix principes</Title>
    <Lede w={1200}>Pour un développement responsable de l’IA (2018). Une démarche citoyenne.</Lede>
    <M5Inset id="montreal" pos="50% 60%" />
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(5, 312px)', rowGap: 26, columnGap: 30 }}>
      <M5Prin d={100} n={1} icon="smile" tone="green">
        Bien-être
      </M5Prin>
      <M5Prin d={160} n={2} icon="user" tone="blue">
        Respect de l’autonomie
      </M5Prin>
      <M5Prin d={220} n={3} icon="lock" tone="violet">
        Protection de l’intimité et de la vie privée
      </M5Prin>
      <M5Prin d={280} n={4} icon="users" tone="teal">
        Solidarité
      </M5Prin>
      <M5Prin d={340} n={5} icon="chat" tone="yellow">
        Participation démocratique
      </M5Prin>
      <M5Prin d={400} n={6} icon="scale" tone="coral">
        Équité
      </M5Prin>
      <M5Prin d={460} n={7} icon="globe" tone="green">
        Inclusion de la diversité
      </M5Prin>
      <M5Prin d={520} n={8} icon="shieldCheck" tone="blue">
        Prudence
      </M5Prin>
      <M5Prin d={580} n={9} icon="humanCheck" tone="violet">
        Responsabilité
      </M5Prin>
      <M5Prin d={640} n={10} icon="leaf" tone="teal">
        Développement soutenable
      </M5Prin>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 830, width: 1680, fontSize: 24, lineHeight: 1.4, color: C.muted, ...dl(800) }}>
      Texte intégral et signataires : declarationmontreal-iaresponsable.com
    </div>
  </Frame>
);

// ─── M5 · Responsible AI in six words ───────────────────────────────────────
const M5Pillar = ({ n, icon, tone, name, q }: { n: number; icon: IconName; tone: Tone; name: string; q: string }) => (
  <div className={b.on(n)}>
    <div style={{ boxSizing: 'border-box', height: 300, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '24px 28px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconTile name={icon} tone={tone} size={60} solid />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 38, color: C.ink }}>{name}</span>
      </div>
      <div style={{ marginTop: 'auto', background: T[tone].bg, borderRadius: 12, padding: '14px 18px', fontSize: 25, lineHeight: 1.4, color: C.ink }}>
        <b style={{ color: T[tone].fg }}>La question :</b> {q}
      </div>
    </div>
  </div>
);

const M5_Pillars: Page = () => (
  <Frame mod={5} beats={6}>
    <Title>L’IA responsable en six principes opérationnels</Title>
    <Lede>Ce qui revient dans tous les cadres : Montréal, OCDE, UNESCO, ISO. Chacun devient une question.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 26, columnGap: 30 }}>
      <M5Pillar n={1} icon="scale" tone="violet" name="Équité" q="Qui pourrait être désavantagé, et l’a-t-on testé ?" />
      <M5Pillar n={2} icon="eye" tone="teal" name="Transparence" q="Les personnes savent-elles qu’une IA intervient ?" />
      <M5Pillar n={3} icon="lock" tone="blue" name="Vie privée" q="Utilise-t-on le minimum de données, pour un but annoncé ?" />
      <M5Pillar n={4} icon="shieldCheck" tone="green" name="Fiabilité" q="Que se passe-t-il quand le système se trompe ?" />
      <M5Pillar n={5} icon="humanCheck" tone="yellow" name="Contrôle humain" q="Qui peut arrêter, corriger ou réviser une décision ?" />
      <M5Pillar n={6} icon="flag" tone="coral" name="Responsabilité" q="Qui répond du système, nommément ?" />
    </div>
  </Frame>
);

// ─── M5 · Elsewhere: EU AI Act, Canada, standards ───────────────────────────
const M5Level = ({ d, w, tone, name, ex, when }: { d: number; w: number; tone: Tone; name: string; ex: string; when: string }) => (
  <div className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 24, ...dl(d) }}>
    <div style={{ width: 640, flex: 'none', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: w, height: 104, background: STRONG[tone], borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tone === 'yellow' ? C.ink : '#fff', fontFamily: display, fontWeight: 700, fontSize: 32, letterSpacing: '0.04em' }}>
        {name}
      </div>
    </div>
    <div>
      <div style={{ fontSize: 24, lineHeight: 1.35, color: C.ink }}>{ex}</div>
      <div style={{ marginTop: 4, fontSize: 22, fontWeight: 600, color: T[tone].fg }}>{when}</div>
    </div>
  </div>
);

const M5_World: Page = () => (
  <Frame mod={5}>
    <Title w={1200}>Ailleurs : l’Europe classe l’IA par risque</Title>
    <Lede w={1200}>Le règlement européen vise quiconque vend ou utilise de l’IA dans l’Union.</Lede>
    <M5Inset id="berlaymont" pos="40% 50%" />
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1160, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M5Level d={100} w={260} tone="coral" name="INACCEPTABLE" ex="Notation sociale, manipulation, émotions au travail" when="Interdit depuis le 2 février 2025" />
      <M5Level d={250} w={400} tone="yellow" name="HAUT RISQUE" ex="Recrutement, crédit, assurance vie et santé" when="Obligations au 2 décembre 2027 (report de 2026)" />
      <M5Level d={400} w={520} tone="blue" name="TRANSPARENCE" ex="Agents conversationnels, contenus générés" when="Signaler l’IA : depuis le 2 août 2026" />
      <M5Level d={550} w={640} tone="green" name="MINIMAL" ex="Filtre anti-pourriel, jeux vidéo" when="Aucune obligation particulière" />
    </div>
    <div style={{ position: 'absolute', left: 1330, top: 280, width: 470, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card tone="coral" icon="flag" title="Au Canada" size={24} cls={A.right} style={dl(600)}>
        Pas de loi propre à l’IA. Le projet de loi C-36 (juin 2026) renforcerait les droits face aux décisions automatisées.
      </Card>
      <Card tone="violet" icon="book" title="Les normes" size={24} cls={A.right} style={dl(750)}>
        ISO/IEC 42001 (2023) : un système de management de l’IA, certifiable.
      </Card>
    </div>
  </Frame>
);

// ─── M5 · Exercise: sort the uses by EU risk level ──────────────────────────
const M5Zone = ({ x, icon, tone, label }: { x: number; icon: IconName; tone: Tone; label: string }) => (
  <div
    className={A.fade}
    style={{ position: 'absolute', left: x, top: 520, width: 397, height: 430, boxSizing: 'border-box', borderRadius: 18, background: T[tone].bg, border: `3px dashed ${T[tone].bd}`, padding: '16px 18px' }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone={tone} size={44} solid />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 28, color: T[tone].fg }}>{label}</span>
    </div>
  </div>
);

const M5Key = ({ tone, children }: { tone: Tone; children: ReactNode }) => (
  <span className={b.pop(1)} style={{ flex: 'none', marginLeft: 'auto', padding: '2px 10px', borderRadius: 8, background: STRONG[tone], color: tone === 'yellow' ? C.ink : '#fff', fontFamily: display, fontWeight: 700, fontSize: 18 }}>
    {children}
  </span>
);

const M5_RiskSort: Page = () => (
  <Frame mod={5} kind="exercice" beats={1}>
    <Title>À vous : si la Mutuelle opérait en Europe…</Title>
    <Lede>Dites-moi à quel niveau de risque va chaque usage. Le corrigé apparaît au clic.</Lede>
    <M5Zone x={120} icon="x" tone="coral" label="Inacceptable" />
    <M5Zone x={547} icon="alert" tone="yellow" label="Haut risque" />
    <M5Zone x={974} icon="eye" tone="blue" label="Transparence" />
    <M5Zone x={1401} icon="check" tone="green" label="Minimal" />
    <Drag x={120} y={262} w={405} tone="blue" size={22}>
      Noter les membres selon leur vie sociale <M5Key tone="coral">INTERDIT</M5Key>
    </Drag>
    <Drag x={545} y={262} w={405} tone="blue" size={22}>
      Trier les CV des candidats <M5Key tone="yellow">HAUT</M5Key>
    </Drag>
    <Drag x={970} y={262} w={405} tone="blue" size={22}>
      Léa, l’agent conversationnel <M5Key tone="blue">TRANSP.</M5Key>
    </Drag>
    <Drag x={1395} y={262} w={405} tone="blue" size={22}>
      Le filtre anti-pourriel <M5Key tone="green">MINIMAL</M5Key>
    </Drag>
    <Drag x={120} y={384} w={405} tone="blue" size={22}>
      Tarifer une assurance vie selon le profil <M5Key tone="yellow">HAUT</M5Key>
    </Drag>
    <Drag x={545} y={384} w={405} tone="blue" size={22}>
      Détecter les émotions des employés en réunion <M5Key tone="coral">INTERDIT</M5Key>
    </Drag>
    <Drag x={970} y={384} w={405} tone="blue" size={22}>
      Recommander un article du blogue <M5Key tone="green">MINIMAL</M5Key>
    </Drag>
    <Drag x={1395} y={384} w={405} tone="blue" size={22}>
      Une image publicitaire générée par IA <M5Key tone="blue">TRANSP.</M5Key>
    </Drag>
  </Frame>
);

// ─── M5 · QCM & synthesis ───────────────────────────────────────────────────
const M5_Qcm: Page = () => (
  <QcmPage
    mod={5}
    n={4}
    title="Le score de fraude face à la Loi 25"
    q="Le score de Mei suspend seul les versements d’un membre, sans regard humain. Que doit faire la Mutuelle, au minimum ?"
    explain="Décision exclusivement automatisée = article 12.1 : informer, donner sur demande les renseignements utilisés et les principaux facteurs, et permettre de présenter ses observations à une personne qui peut réviser la décision."
  >
    <Opt why="Piège ! La lutte contre la fraude est légitime, mais elle ne dispense pas des obligations de la Loi 25.">Rien : la lutte contre la fraude justifie le secret</Opt>
    <Opt ok why="Exact : ce sont les trois obligations de l’article 12.1, en vigueur depuis septembre 2023.">
      Informer le membre, expliquer sur demande, offrir une révision humaine
    </Opt>
    <Opt why="Piège ! La CAI surveille et enquête, mais n’autorise pas chaque décision à l’avance.">Obtenir l’accord de la CAI avant chaque suspension</Opt>
    <Opt why="Piège ! La loi demande les principaux facteurs de la décision, pas le code du modèle.">Publier le code source du modèle</Opt>
  </QcmPage>
);

const M5_Synth: Page = () => (
  <SynthPage
    mod={5}
    title="Module 5 · Ce qu’il faut retenir"
    poste={
      <>
        Trouvez qui est la personne responsable de la protection des renseignements personnels dans votre organisation.
        <br />
        <br />
        Demandez-lui : nos projets d’IA ont-ils eu leur EFVP ?
      </>
    }
  >
    <SynthRow n={1} tone="blue" d={100}>
      La Loi 25 s’applique <b>déjà</b> à tout projet d’IA qui touche des renseignements personnels.
    </SynthRow>
    <SynthRow n={2} tone="violet" d={220}>
      <b>EFVP avant</b> tout nouveau système ; profilage annoncé et désactivé par défaut.
    </SynthRow>
    <SynthRow n={3} tone="teal" d={340}>
      Décision automatisée : <b>informer, expliquer, réviser</b>.
    </SynthRow>
    <SynthRow n={4} tone="green" d={460}>
      Six principes : équité, transparence, vie privée, fiabilité, <b>contrôle humain, responsabilité</b>.
    </SynthRow>
    <SynthRow n={5} tone="yellow" d={580}>
      L’Europe classe par <b>niveau de risque</b> ; le Canada mise sur la vie privée.
    </SynthRow>
  </SynthPage>
);

// ═══ 60-a2 ═════════════════════════════════════════════════════════════

// Atelier 2 has two versions, chosen on the cover (useClient):
//   APSM   — fictional mine (Val-Laurier) installs AI fatigue cameras in its trucks: biometrics, Loi 25, comité SST.
//   Sobeys — real case: Rite Aid's facial recognition in stores (FTC, 2023), with the Canadian Tire echo (BC, 2023).
// Same page count, same timers, same structure in both versions.

// ─── A2 · Divider ───────────────────────────────────────────────────────────
const A2_Divider: Page = () => {
  const apsm = useClient() === 'apsm';
  return (
    <Section
      n={6}
      title="Atelier 2 · Étude de cas éthique"
      sub={apsm ? 'Une caméra d’IA contre la fatigue au volant, dans une mine. Prévention ou surveillance ?' : 'Un cas réel : la reconnaissance faciale en magasin. Vous l’analysez, puis vous dites comment vous auriez agi.'}
      dur="≈ 40 min"
      kind="atelier"
    >
      <SecItem n={1}>{apsm ? 'Le cas : des caméras de fatigue dans les camions' : 'Le cas : des caméras contre le vol à l’étalage'}</SecItem>
      <SecItem n={2}>Analyser avec les six principes</SecItem>
      <SecItem n={3}>Comment auriez-vous agi ? Choisissez un rôle</SecItem>
      <SecItem n={4}>{apsm ? 'Débat, puis les repères pour décider' : 'Débat, puis ce qui s’est vraiment passé'}</SecItem>
    </Section>
  );
};
A2_Divider.transition = BLOOM;

// ─── A2 · Helpers ───────────────────────────────────────────────────────────
const A2Fact = ({ d, icon, tone = 'teal', children }: { d: number; icon: IconName; tone?: Tone; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 20, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 24px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={52} />
    <div style={{ fontSize: 26, lineHeight: 1.42, color: C.ink, paddingTop: 4 }}>{children}</div>
  </div>
);

const A2Echo = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className={A.right} style={{ position: 'absolute', left: 1260, top: 600, width: 540, boxSizing: 'border-box', background: G.blue, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', color: '#fff', ...dl(600) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Icon name="leaf" size={30} color={C.yellow} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 24, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{title}</span>
    </div>
    <div style={{ marginTop: 12, fontSize: 26, lineHeight: 1.45, color: '#F2F8FC' }}>{children}</div>
  </div>
);

const A2Caption = ({ children }: { children: ReactNode }) => (
  <div style={{ position: 'absolute', left: 14, top: 12, padding: '4px 12px', borderRadius: 8, background: 'rgba(20,24,28,.6)', color: '#fff', fontSize: 19, fontWeight: 600 }}>{children}</div>
);

// ─── A2 · The case (1/2): the system ────────────────────────────────────────
const A2_Case1: Page = () => {
  const apsm = useClient() === 'apsm';
  return (
    <Frame mod={6} kind="cas" label="Atelier 2 · Le cas (1/2)">
      <Title>{apsm ? 'Le cas : des caméras de fatigue dans les camions de la mine' : 'Le cas : la reconnaissance faciale chez Rite Aid'}</Title>
      <Lede>{apsm ? 'Une mine fictive, des systèmes bien réels : ils se répandent dans l’industrie minière.' : 'Une histoire vraie, documentée par la Federal Trade Commission américaine (FTC).'}</Lede>
      {apsm ? (
        <div style={{ position: 'absolute', left: 120, top: 280, width: 1080, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <A2Fact d={100} icon="org">
            La mine <b>Val-Laurier</b> (fictive, Abitibi) fait rouler 40 camions de minerai, sous terre et en surface, jour et nuit.
          </A2Fact>
          <A2Fact d={220} icon="flag" tone="coral">
            Après deux quasi-accidents liés à la somnolence, la direction fait de la fatigue une <b>priorité de prévention</b>.
          </A2Fact>
          <A2Fact d={340} icon="cpu" tone="violet">
            Une <b>caméra d’IA</b> dans chaque cabine analyse le visage du conducteur : yeux, bâillements, regard. Alerte sonore, et signalement au superviseur.
          </A2Fact>
          <A2Fact d={460} icon="globe" tone="yellow">
            Le fournisseur garde les vidéos <b>sur son infonuagique, hors du Québec</b>, et calcule un « score de vigilance » par travailleur.
          </A2Fact>
        </div>
      ) : (
        <div style={{ position: 'absolute', left: 120, top: 280, width: 1080, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <A2Fact d={100} icon="org">
            Rite Aid, grande chaîne de pharmacies américaine, veut réduire le <b>vol à l’étalage</b>.
          </A2Fact>
          <A2Fact d={220} icon="cpu" tone="violet">
            De 2012 à 2020, elle utilise la <b>reconnaissance faciale</b> dans des centaines de magasins.
          </A2Fact>
          <A2Fact d={340} icon="database" tone="coral">
            Le système compare chaque visage à une liste de personnes « à surveiller », souvent tirée d’<b>images de caméras floues</b>.
          </A2Fact>
          <A2Fact d={460} icon="bell" tone="yellow">
            Une correspondance déclenche une <b>alerte sur le téléphone</b> des employés du magasin.
          </A2Fact>
        </div>
      )}
      <Photo id={apsm ? 'camionMine' : 'camerasMagasin'} w={540} h={290} cls={A.right} style={{ position: 'absolute', left: 1260, top: 280, boxShadow: SHADOW, ...dl(450) }}>
        <A2Caption>{apsm ? 'Camion de minerai, mine souterraine' : 'Écran de surveillance en magasin'}</A2Caption>
      </Photo>
      {apsm ? (
        <A2Echo title="Pourquoi ce cas ?">Ces systèmes protègent réellement des vies. La question n’est pas de les refuser, mais de les encadrer.</A2Echo>
      ) : (
        <A2Echo title="Ça vous rappelle…">… les caméras, la carte de fidélité, les offres ciblées : le commerce de détail regorge de données sur ses clients.</A2Echo>
      )}
    </Frame>
  );
};

// ─── A2 · The case (2/2): what people lived ─────────────────────────────────
const A2_Case2: Page = () => {
  const apsm = useClient() === 'apsm';
  return (
    <Frame mod={6} kind="cas" label="Atelier 2 · Le cas (2/2)">
      <Title>{apsm ? 'Ce que vivent les conducteurs' : 'Ce que vivent les clients signalés'}</Title>
      {apsm ? (
        <div style={{ position: 'absolute', left: 120, top: 220, width: 1080, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <A2Fact d={100} icon="doc" tone="coral">
            Les conducteurs apprennent l’installation par une <b>note de service, la veille</b>.
          </A2Fact>
          <A2Fact d={220} icon="eye" tone="coral">
            Un conducteur atteint d’une affection des paupières déclenche des <b>alertes à répétition</b>, et se fait retirer du volant.
          </A2Fact>
          <A2Fact d={340} icon="chart" tone="coral">
            La direction propose d’utiliser le score de vigilance pour les <b>évaluations</b> et l’attribution des quarts de nuit.
          </A2Fact>
          <A2Fact d={460} icon="users" tone="coral">
            Le syndicat demande à voir les données. Le <b>comité de santé et de sécurité</b> n’a pas été consulté.
          </A2Fact>
        </div>
      ) : (
        <div style={{ position: 'absolute', left: 120, top: 220, width: 1080, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <A2Fact d={100} icon="alert" tone="coral">
            Des <b>milliers de fausses correspondances</b>, parfois avec des personnes jamais venues dans le magasin.
          </A2Fact>
          <A2Fact d={220} icon="users" tone="coral">
            Des clients <b>suivis, fouillés, expulsés</b>, parfois signalés à la police devant leurs proches.
          </A2Fact>
          <A2Fact d={340} icon="scale" tone="coral">
            Selon la FTC, les fausses alertes sont plus fréquentes dans les magasins de <b>quartiers à majorité noire ou asiatique</b>.
          </A2Fact>
          <A2Fact d={460} icon="eye" tone="coral">
            Les clients <b>ne sont pas informés</b> que leur visage est analysé.
          </A2Fact>
        </div>
      )}
      <div className={A.right} style={{ position: 'absolute', left: 1260, top: 220, width: 540, ...dl(600) }}>
        <Callout title="Votre question" tone="yellow" icon="scale" size={28} style={{ padding: '26px 30px' }}>
          {apsm ? 'À quel moment l’outil de prévention devient-il un outil de surveillance ? Qui aurait dû intervenir ?' : 'Où, dans cette chaîne, aurait-on pu arrêter la machine ? Et qui aurait dû le faire ?'}
        </Callout>
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, width: 1680, fontSize: 22, color: C.muted, ...dl(800) }}>
        {apsm ? 'Les repères pour décider après votre analyse. Le texte du cas est dans le Chat et dans votre guide.' : 'La suite de l’histoire après votre analyse. Le texte du cas est dans le Chat et dans votre guide.'}
      </div>
    </Frame>
  );
};

// ─── A2 · Step 1: analyse with the six principles ───────────────────────────
const A2Lens = ({ d, icon, tone, name, q }: { d: number; icon: IconName; tone: Tone; name: string; q: string }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 0 6px 0 ${STRONG[tone]}`, padding: '18px 22px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone={tone} size={46} solid />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{name}</span>
    </div>
    <div style={{ marginTop: 10, fontSize: 24, lineHeight: 1.38, color: C.soft }}>{q}</div>
  </div>
);

const A2_Step1: Page = () => {
  const apsm = useClient() === 'apsm';
  return (
    <WorkStep
      mod={6}
      label="Atelier 2 · Étape 1 sur 2"
      title="Étape 1 · Analysez le cas avec les six principes"
      lede="Pour chaque principe, notez en une phrase ce qui a manqué."
      timerId="a2-s1"
      minutes={10}
      timerLabel="Analyse"
      side={
        <NoteCard>
          <NoteLine>Six phrases, une par principe</NoteLine>
          <NoteLine>Le principe le plus gravement bafoué, selon vous</NoteLine>
          <NoteLine>{apsm ? 'Une question que vous auriez posée avant l’installation' : 'Une question que vous auriez posée en 2012'}</NoteLine>
        </NoteCard>
      }
    >
      {apsm ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <A2Lens d={150} icon="scale" tone="violet" name="Équité" q="Qui subit les fausses alertes : lunettes, affection, éclairage ?" />
          <A2Lens d={220} icon="eye" tone="teal" name="Transparence" q="Les conducteurs savaient-ils ce qui était mesuré et gardé ?" />
          <A2Lens d={290} icon="lock" tone="blue" name="Vie privée" q="Un visage filmé : renseignement biométrique, sensible. Nécessaire ?" />
          <A2Lens d={360} icon="shieldCheck" tone="green" name="Fiabilité" q="Que vaut une alerte de fatigue ? A-t-on mesuré les erreurs ?" />
          <A2Lens d={430} icon="humanCheck" tone="yellow" name="Contrôle humain" q="Après une alerte, qui décide : la machine ou le superviseur ?" />
          <A2Lens d={500} icon="flag" tone="coral" name="Responsabilité" q="Qui répond du système : la mine, le fournisseur, le comité ?" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <A2Lens d={150} icon="scale" tone="violet" name="Équité" q="Qui a subi les fausses alertes, et pourquoi eux ?" />
          <A2Lens d={220} icon="eye" tone="teal" name="Transparence" q="Les clients savaient-ils qu’on analysait leur visage ?" />
          <A2Lens d={290} icon="lock" tone="blue" name="Vie privée" q="Le visage est biométrique, sensible. Le but justifiait-il ce moyen ?" />
          <A2Lens d={360} icon="shieldCheck" tone="green" name="Fiabilité" q="Images floues, erreurs non suivies : qui l’a testé ?" />
          <A2Lens d={430} icon="humanCheck" tone="yellow" name="Contrôle humain" q="Les employés vérifiaient-ils l’alerte, ou agissaient-ils dessus ?" />
          <A2Lens d={500} icon="flag" tone="coral" name="Responsabilité" q="Qui répond : la chaîne, le fournisseur, l’employé ?" />
        </div>
      )}
    </WorkStep>
  );
};

// ─── A2 · Step 2: what would you have done? ─────────────────────────────────
const A2Role = ({ d, n, icon, tone, role, children }: { d: number; n: number; icon: IconName; tone: Tone; role: string; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 24px', ...dl(d) }}>
    <Num n={n} tone={tone} size={46} />
    <IconTile name={icon} tone={tone} size={52} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{role}</div>
      <div style={{ fontSize: 23, lineHeight: 1.35, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const A2_Step2: Page = () => {
  const apsm = useClient() === 'apsm';
  return (
    <WorkStep
      mod={6}
      label="Atelier 2 · Étape 2 sur 2"
      title="Étape 2 · Comment auriez-vous agi ?"
      lede={apsm ? 'Choisissez un rôle. Écrivez trois décisions que vous auriez prises, avant ou après l’installation.' : 'Choisissez un rôle. Écrivez trois décisions que vous auriez prises, en 2012 ou en cours de route.'}
      timerId="a2-s2"
      minutes={7}
      timerLabel="Votre rôle"
      side={
        <NoteCard title="Vos trois décisions">
          <NoteLine>Ce que j’aurais vérifié</NoteLine>
          <NoteLine>Ce que j’aurais refusé</NoteLine>
          <NoteLine>Ce que j’aurais changé dans le processus</NoteLine>
        </NoteCard>
      }
    >
      {apsm ? (
        <>
          <A2Role d={150} n={1} icon="chart" tone="teal" role="Le fournisseur du système">
            Vous vendez l’outil et vous entraînez le modèle.
          </A2Role>
          <A2Role d={250} n={2} icon="bell" tone="blue" role="Le superviseur de quart">
            Vous recevez les alertes en temps réel, en pleine production.
          </A2Role>
          <A2Role d={350} n={3} icon="users" tone="violet" role="Le comité de santé et de sécurité">
            Paritaire, il n’a pas été consulté avant l’installation.
          </A2Role>
          <A2Role d={450} n={4} icon="flag" tone="coral" role="La direction de la mine">
            Vous devez réduire les accidents… et tenir les coûts.
          </A2Role>
        </>
      ) : (
        <>
          <A2Role d={150} n={1} icon="chart" tone="teal" role="Le fournisseur du logiciel">
            Vous vendez la reconnaissance faciale et vous fixez le seuil d’alerte.
          </A2Role>
          <A2Role d={250} n={2} icon="store" tone="blue" role="La gérante du magasin">
            Vous recevez les alertes sur votre téléphone, en pleine affluence.
          </A2Role>
          <A2Role d={350} n={3} icon="shield" tone="violet" role="Le responsable de la vie privée">
            Vous êtes consulté… quand on pense à vous consulter.
          </A2Role>
          <A2Role d={450} n={4} icon="flag" tone="coral" role="La direction de la prévention des pertes">
            Vous devez réduire les vols, magasin par magasin.
          </A2Role>
        </>
      )}
    </WorkStep>
  );
};

// ─── A2 · Debate ────────────────────────────────────────────────────────────
const A2_Debate: Page = () => {
  const apsm = useClient() === 'apsm';
  return (
    <Frame mod={6} kind="atelier" label="Atelier 2 · Débat">
      <Title>Débat : à votre place, qu’auraient fait les autres ?</Title>
      <Lede>Deux ou trois volontaires présentent leur rôle et leurs décisions. Les autres réagissent au micro.</Lede>
      <div style={{ position: 'absolute', left: 120, top: 280, width: 820, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <AskCard n={1} title="Quel rôle, quelles décisions ?" sub="Deux minutes par volontaire" d={100} />
        <AskCard n={2} title="D’accord ? Pas d’accord ?" sub="Une réaction au micro, en une phrase" d={220} />
        <AskCard n={3} title="Qu’est-ce qui vous aurait arrêté ?" sub="Peur, hiérarchie, objectifs, manque d’information…" d={340} />
      </div>
      <Timer id="a2-debate" minutes={10} label="Débat" compact cls={A.in} style={{ position: 'absolute', left: 120, top: 760, ...dl(460) }} />
      <div style={{ position: 'absolute', left: 1000, top: 280, width: 800 }}>
        <Eyebrow cls={A.in} c={C.violet} style={dl(200)}>
          Sondage · la responsabilité principale revient…
        </Eyebrow>
        <Hint cls={A.in} style={{ marginTop: 8, ...dl(260) }}>
          Un numéro par personne, à voix haute
        </Hint>
        <Poll cls={A.in} style={{ marginTop: 22, ...dl(360) }}>
          <PollRow id="algo" icon="cpu" tone="grey" label="1 · À l’algorithme" />
          <PollRow id="tech" icon="chart" tone="teal" label="2 · Au fournisseur" />
          <PollRow id="ops" icon="bell" tone="blue" label={apsm ? '3 · Au superviseur de quart' : '3 · Aux employés du magasin'} />
          <PollRow id="lead" icon="flag" tone="coral" label={apsm ? '4 · À la direction de la mine' : '4 · À la direction de la chaîne'} />
          <PollRow id="all" icon="users" tone="violet" label="5 · À tous, faute de gouvernance" />
        </Poll>
      </div>
    </Frame>
  );
};

// ─── A2 · Then: what happened (Sobeys) / the rules to decide (APSM) ─────────
const A2Step = ({ n, x, date, tone, children }: { n: number; x: number; date: string; tone: Tone; children: ReactNode }) => (
  <>
    <div className={b.pop(n)} style={{ position: 'absolute', left: x - 16, top: 312, width: 32, height: 32, borderRadius: 99, background: '#fff', boxShadow: `inset 0 0 0 8px ${STRONG[tone]}` }} />
    <div className={b.on(n)} style={{ position: 'absolute', left: x - 190, top: 370, width: 380 }}>
      <div style={{ boxSizing: 'border-box', height: 270, background: C.card, borderRadius: 16, boxShadow: `${SHADOW}, inset 0 6px 0 ${STRONG[tone]}`, padding: '20px 22px' }}>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 32, lineHeight: 1.05, color: tone === 'yellow' ? C.amber : STRONG[tone] }}>{date}</div>
        <div style={{ marginTop: 8, fontSize: 23, lineHeight: 1.4, color: C.ink }}>{children}</div>
      </div>
    </div>
  </>
);

const A2_After: Page = () => {
  const apsm = useClient() === 'apsm';
  return (
    <Frame mod={6} kind="cas" beats={5} label={apsm ? 'Atelier 2 · Les repères' : 'Atelier 2 · La suite'}>
      <Title>{apsm ? 'Les repères pour décider' : 'Ce qui s’est passé ensuite'}</Title>
      <div className={A.grow} style={{ position: 'absolute', left: 120, top: 324, width: 1680, height: 8, borderRadius: 4, background: C.rule, ...dl(100) }} />
      {apsm ? (
        <>
          <A2Step n={1} x={310} date="Loi 25 · biométrie" tone="blue">
            Les images du visage sont des renseignements sensibles : consentement exprès et EFVP avant le déploiement.
          </A2Step>
          <A2Step n={2} x={720} date="Hors du Québec" tone="violet">
            Envoyer les vidéos ailleurs exige d’évaluer la protection offerte là-bas (art. 17).
          </A2Step>
          <A2Step n={3} x={1130} date="Autre usage" tone="coral">
            Utiliser un score de sécurité pour évaluer le rendement : une autre fin, qui exige un nouveau consentement.
          </A2Step>
          <A2Step n={4} x={1540} date="Prévention paritaire" tone="teal">
            La Loi sur la santé et la sécurité du travail associe les travailleurs à la prévention : le comité doit être dans la boucle.
          </A2Step>
        </>
      ) : (
        <>
          <A2Step n={1} x={310} date="2012 – 2020" tone="blue">
            Le système fonctionne dans des centaines de magasins, sans test sérieux de ses erreurs.
          </A2Step>
          <A2Step n={2} x={720} date="Juil. 2020" tone="violet">
            Une enquête de Reuters révèle le système. Rite Aid dit l’avoir abandonné.
          </A2Step>
          <A2Step n={3} x={1130} date="2023 · Canada" tone="teal">
            En Colombie-Britannique, des magasins Canadian Tire sont blâmés pour leur reconnaissance faciale sans consentement.
          </A2Step>
          <A2Step n={4} x={1540} date="Déc. 2023" tone="coral">
            La FTC interdit à Rite Aid d’utiliser la reconnaissance faciale pendant cinq ans.
          </A2Step>
        </>
      )}
      <Callout cls={b.on(5)} title="La leçon" tone="yellow" icon="bulb" size={27} style={{ position: 'absolute', left: 120, top: 700, width: 1680 }}>
        {apsm
          ? 'Un bon outil de prévention peut devenir un outil de surveillance. La différence : une seule finalité annoncée, le comité consulté, et un humain qui décide.'
          : 'Une technologie de sécurité, sans test, sans transparence et sans contrôle humain, a transformé des clients en suspects. Au Québec, la biométrie exige en plus consentement exprès et déclaration à la CAI.'}
      </Callout>
    </Frame>
  );
};

// ─── A2 · Back home: three safeguards ───────────────────────────────────────
const A2Guard = ({ n, icon, title, children }: { n: number; icon: IconName; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ flex: 1 }}>
    <div style={{ boxSizing: 'border-box', height: 420, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.green}`, padding: '28px 30px', display: 'flex', flexDirection: 'column' }}>
      <IconTile name={icon} tone="green" size={68} solid />
      <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 10, fontSize: 25, lineHeight: 1.45, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const A2_Mutuelle: Page = () => {
  const apsm = useClient() === 'apsm';
  return (
    <Frame mod={6} kind="cas" beats={3} label="Atelier 2 · Et chez vous ?">
      <Title>{apsm ? 'Et chez vous ? Trois garde-fous pour une caméra de fatigue' : 'Et chez vous ? Trois garde-fous avant toute caméra intelligente'}</Title>
      <Lede>Ce qu’une organisation responsable décide avant d’aller plus loin.</Lede>
      {apsm ? (
        <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 30 }}>
          <A2Guard n={1} icon="target" title="Une seule finalité">
            La prévention, et rien d’autre : jamais l’évaluation ni la discipline, sans nouveau consentement.
          </A2Guard>
          <A2Guard n={2} icon="humanCheck" title="Un humain qui tranche">
            Une alerte ouvre une discussion, pas une sanction. Les fausses alertes sont suivies et corrigées.
          </A2Guard>
          <A2Guard n={3} icon="users" title="Le comité dans la boucle">
            Consulté avant l’achat, EFVP faite, données agrégées partagées, conservation limitée.
          </A2Guard>
        </div>
      ) : (
        <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 30 }}>
          <A2Guard n={1} icon="search" title="Prouver la nécessité">
            Une EFVP avant tout projet, et la question : un moyen moins intrusif suffirait-il ?
          </A2Guard>
          <A2Guard n={2} icon="eye" title="Informer et consentir">
            Affichage clair, consentement exprès pour la biométrie, déclaration préalable à la CAI.
          </A2Guard>
          <A2Guard n={3} icon="humanCheck" title="Tester, puis vérifier">
            Taux d’erreur mesurés par groupe. Aucune intervention sur une alerte qu’une personne n’a pas vérifiée.
          </A2Guard>
        </div>
      )}
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(300) }}>
        <FilRouge>Ces garde-fous entreront dans votre charte, à l’atelier 3</FilRouge>
      </div>
    </Frame>
  );
};

// ═══ 70-m7 ═════════════════════════════════════════════════════════════

// ─── M7 · Divider ───────────────────────────────────────────────────────────
const M7_Divider: Page = () => (
  <Section n={7} title={<>Vers une gouvernance<br />de l’IA</>} sub="Des principes à la pratique : qui décide, qui vérifie, qui répond." dur="≈ 25 min">
    <SecItem n={1}>Rôles et responsabilités dans l’organisation</SecItem>
    <SecItem n={2}>Les points de contrôle d’un projet d’IA</SecItem>
    <SecItem n={3}>La charte éthique IA : à quoi elle sert, ce qu’elle contient</SecItem>
  </Section>
);
M7_Divider.transition = BLOOM;

// ─── M7 · Air Canada: who answers for the chatbot? ──────────────────────────
const M7_AirCanada: Page = () => (
  <Frame mod={7} kind="cas" beats={3}>
    <Title>« L’agent conversationnel est responsable de ses actes » ?</Title>
    <Lede>Colombie-Britannique, février 2024 : l’affaire Moffatt contre Air Canada.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1080, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <A2Fact d={100} icon="chat" tone="blue">
        Après un décès dans sa famille, un client demande à l’agent conversationnel d’Air Canada s’il existe un <b>tarif de deuil</b>.
      </A2Fact>
      <A2Fact d={220} icon="alert" tone="coral">
        L’agent lui répond qu’il peut demander le remboursement <b>après</b> son voyage. C’est faux : la politique officielle dit le contraire.
      </A2Fact>
      <div className={b.on(1)}>
        <A2Fact d={0} icon="scale" tone="violet">
          Devant le tribunal, Air Canada soutient que l’agent est <b>une entité distincte, responsable de ses propres actes</b>.
        </A2Fact>
      </div>
      <div className={b.on(2)}>
        <A2Fact d={0} icon="check" tone="green">
          Le tribunal rejette l’argument : l’entreprise répond de <b>toute l’information</b> de son site. Elle doit indemniser le client.
        </A2Fact>
      </div>
    </div>
    <Photo id="airCanada" w={540} h={260} pos="50% 55%" cls={A.right} style={{ position: 'absolute', left: 1260, top: 280, boxShadow: SHADOW, ...dl(300) }} />
    <div className={b.on(3)} style={{ position: 'absolute', left: 1260, top: 566, width: 540 }}>
      <div style={{ boxSizing: 'border-box', background: G.blue, borderRadius: 20, boxShadow: SHADOW, padding: '28px 32px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Icon name="flag" size={32} color={C.yellow} />
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 24, letterSpacing: '0.12em', textTransform: 'uppercase' }}>La règle</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 27, lineHeight: 1.4, color: '#F2F8FC' }}>
          Une IA n’est jamais responsable. Une organisation l’est toujours, et quelqu’un, en son sein, doit l’être nommément.
        </div>
      </div>
    </div>
  </Frame>
);

// ─── M7 · Roles ─────────────────────────────────────────────────────────────
const M7Role = ({ d, icon, tone, role, who, children }: { d: number; icon: IconName; tone: Tone; role: string; who: string; children: ReactNode }) => (
  <div className={A.in} style={{ ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 300, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '22px 26px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <IconTile name={icon} tone={tone} size={56} solid />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 32, lineHeight: 1.05, color: C.ink }}>{role}</span>
      </div>
      <div style={{ marginTop: 12, fontSize: 24, lineHeight: 1.4, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 22, fontWeight: 600, color: T[tone].fg }}>
        <Icon name="leaf" size={22} />
        {who}
      </div>
    </div>
  </div>
);

const M7_Roles: Page = () => (
  <Frame mod={7}>
    <Title>Qui fait quoi ? Six rôles à nommer</Title>
    <Lede>Une gouvernance, c’est d’abord des noms en face des responsabilités.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 26, columnGap: 30 }}>
      <M7Role d={100} icon="flag" tone="coral" role="La direction" who="À la Mutuelle : le comité de direction">
        Fixe l’ambition et les limites. Arbitre les cas difficiles. Peut tout arrêter.
      </M7Role>
      <M7Role d={200} icon="users" tone="violet" role="Le comité IA" who="Présidé par Nathalie">
        Approuve les projets à risque, tient le registre des systèmes d’IA.
      </M7Role>
      <M7Role d={300} icon="shield" tone="blue" role="Le responsable des renseignements personnels" who="Chloé">
        EFVP, consentement, incidents. Consulté au début, pas à la fin.
      </M7Role>
      <M7Role d={400} icon="target" tone="yellow" role="Le propriétaire du système" who="Samir pour P2, Vincent pour P1 et P4">
        Une personne du métier qui répond du système au quotidien.
      </M7Role>
      <M7Role d={500} icon="chart" tone="teal" role="L’équipe données et TI" who="Mei et son équipe">
        Teste les biais, documente, surveille, sécurise.
      </M7Role>
      <M7Role d={600} icon="user" tone="green" role="Chaque employé" who="Les 650 employés">
        Respecte la charte, utilise les outils approuvés, signale un problème.
      </M7Role>
    </div>
  </Frame>
);

// ─── M7 · Checkpoints along a project's life ────────────────────────────────
const M7Gate = ({ n, icon, tone, phase, children }: { n: number; icon: IconName; tone: Tone; phase: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ width: 290, flex: 'none' }}>
    <div style={{ boxSizing: 'border-box', height: 400, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '24px 22px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Num n={n} tone={tone} size={44} />
        <Icon name={icon} size={34} color={T[tone].fg} />
      </div>
      <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 34, color: C.ink }}>{phase}</div>
      <div style={{ marginTop: 10, fontSize: 24, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M7_Lifecycle: Page = () => (
  <Frame mod={7} beats={6}>
    <Title>Cinq points de contrôle dans la vie d’un projet d’IA</Title>
    <Lede>À chaque étape, une question… et le droit de dire non.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', alignItems: 'center', gap: 8 }}>
      <M7Gate n={1} icon="bulb" tone="blue" phase="Idée">
        Fiche projet, niveau de risque. Le comité IA est informé.
      </M7Gate>
      <FlowArrow w={40} color={C.faint} />
      <M7Gate n={2} icon="search" tone="violet" phase="Conception">
        EFVP. Quelles données, pour quel but ?
      </M7Gate>
      <FlowArrow w={40} color={C.faint} />
      <M7Gate n={3} icon="scale" tone="teal" phase="Essais">
        Biais, fiabilité, explications testés avant le lancement.
      </M7Gate>
      <FlowArrow w={40} color={C.faint} />
      <M7Gate n={4} icon="rocket" tone="green" phase="Lancement">
        Personnes informées, recours prévu, humain dans la boucle.
      </M7Gate>
      <FlowArrow w={40} color={C.faint} />
      <M7Gate n={5} icon="gauge" tone="yellow" phase="Suivi">
        Indicateurs, incidents, revue annuelle.
      </M7Gate>
    </div>
    <Callout cls={b.on(6)} title="Le bouton d’arrêt" tone="coral" icon="pause" size={26} style={{ position: 'absolute', left: 120, top: 740, width: 1680 }}>
      À chaque point, quelqu’un peut suspendre le projet. C’est ce qui manquait dans le cas de l’atelier 2.
    </Callout>
  </Frame>
);

// ─── M7 · What an AI ethics charter contains ────────────────────────────────
const M7Part = ({ n, icon, tone, name, children }: { n: number; icon: IconName; tone: Tone; name: string; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '14px 24px', ...dl(100 + n * 110) }}>
    <Num n={n} tone={tone} size={46} />
    <IconTile name={icon} tone={tone} size={50} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{name}</div>
      <div style={{ fontSize: 23, lineHeight: 1.35, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M7_CharterParts: Page = () => (
  <Frame mod={7}>
    <Title>La charte éthique IA : une page, cinq rubriques</Title>
    <Lede>Le modèle de votre atelier 3.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M7Part n={1} icon="star" tone="violet" name="Nos principes">
        Trois à cinq, reformulés avec nos mots.
      </M7Part>
      <M7Part n={2} icon="check" tone="green" name="Nos règles d’usage">
        Ce qui est permis, ce qui est interdit, ce qui demande un accord.
      </M7Part>
      <M7Part n={3} icon="lock" tone="blue" name="Nos données">
        Quelles données, dans quels outils : le feu tricolore.
      </M7Part>
      <M7Part n={4} icon="users" tone="yellow" name="Nos rôles">
        Qui approuve, qui répond, à qui signaler.
      </M7Part>
      <M7Part n={5} icon="loop" tone="teal" name="Notre suivi">
        Incidents, indicateurs, date de révision.
      </M7Part>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Card tone="coral" icon="x" title="Une charte vitrine" size={25} cls={A.right} style={dl(300)}>
        De belles valeurs, aucun nom, aucune règle concrète. Publiée, puis oubliée.
      </Card>
      <Card tone="green" icon="check" title="Une charte vivante" size={25} cls={A.right} style={dl(450)}>
        Des règles vérifiables, des responsables nommés, une date de révision.
      </Card>
    </div>
  </Frame>
);

// ─── M7 · Example: the Mutuelle's charter v1 ────────────────────────────────
const M7Rule = ({ n, children }: { n: number; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
    <Num n={n} size={40} />
    <span style={{ fontSize: 25, lineHeight: 1.4, color: C.ink }}>{children}</span>
  </div>
);

const M7_Charter: Page = () => (
  <Frame mod={7} label="Module 07 · Fil rouge">
    <Title>Exemple : la charte IA de la Mutuelle, version 1</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 220, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 8px 0 ${C.teal}`, padding: '30px 44px', ...dl(100) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconTile name="leaf" tone="teal" size={56} solid />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 38, color: C.ink }}>Charte éthique IA · Mutuelle des Érables</span>
        <Tag tone="grey" size={20} style={{ marginLeft: 'auto' }}>
          Version 1 · révision en juin 2027
        </Tag>
      </div>
      <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 50, rowGap: 20 }}>
        <M7Rule n={1}>Nos principes : équité, transparence, vie privée, contrôle humain.</M7Rule>
        <M7Rule n={2}>Un membre sait toujours quand il échange avec une IA.</M7Rule>
        <M7Rule n={3}>Aucune décision qui touche un membre ou un candidat sans révision humaine possible.</M7Rule>
        <M7Rule n={4}>Jamais de données de santé, de CV ni de dossier dans un outil non approuvé.</M7Rule>
        <M7Rule n={5}>Tout projet d’IA passe par le comité IA et une EFVP, avant achat ou développement.</M7Rule>
        <M7Rule n={6}>Chaque système a un propriétaire nommé, qui en répond.</M7Rule>
        <M7Rule n={7}>Les résultats sont testés par groupe avant le lancement, puis chaque année.</M7Rule>
        <M7Rule n={8}>Un doute, un incident ? On le signale à Chloé, sans crainte de reproche.</M7Rule>
      </div>
    </div>
  </Frame>
);

// ─── M7 · QCM & synthesis ───────────────────────────────────────────────────
const M7_Qcm: Page = () => (
  <QcmPage
    mod={7}
    n={5}
    title="Une charte qui sert vraiment"
    q="Une charte éthique IA est vraiment utile quand…"
    explain="Une charte vivante contient des règles vérifiables, nomme des responsables et prévoit un suivi. Le reste est de la communication."
  >
    <Opt why="Piège ! La publier montre l’engagement, mais une charte vitrine n’a jamais empêché un dérapage.">elle est publiée en bonne place sur le site web</Opt>
    <Opt why="Piège ! S’inspirer d’un cadre reconnu est une bonne idée ; le recopier sans le traduire en règles concrètes, non.">elle reprend mot pour mot la Déclaration de Montréal</Opt>
    <Opt ok why="Exact : des noms, des règles vérifiables, une date de révision. C’est ce qui manquait dans le cas de l’atelier 2.">
      elle nomme des responsables et prévoit un suivi
    </Opt>
    <Opt why="Piège ! Tout interdire pousse les employés vers des outils non approuvés, en cachette. Le risque augmente.">elle interdit toute utilisation de l’IA générative</Opt>
  </QcmPage>
);

const M7_Synth: Page = () => (
  <SynthPage
    mod={7}
    title="Module 7 · Ce qu’il faut retenir"
    poste={
      <>
        Demandez : qui, chez nous, peut arrêter un système d’IA qui dérape ?
        <br />
        <br />
        Si personne ne sait répondre, vous avez trouvé votre premier chantier.
      </>
    }
  >
    <SynthRow n={1} tone="coral" d={100}>
      Une IA n’est <b>jamais</b> responsable : l’organisation l’est toujours.
    </SynthRow>
    <SynthRow n={2} tone="violet" d={220}>
      Six rôles à <b>nommer</b>, du comité de direction à chaque employé.
    </SynthRow>
    <SynthRow n={3} tone="blue" d={340}>
      Cinq points de contrôle, et <b>un bouton d’arrêt</b> à chacun.
    </SynthRow>
    <SynthRow n={4} tone="teal" d={460}>
      Une charte en cinq rubriques : principes, règles, données, <b>rôles, suivi</b>.
    </SynthRow>
    <SynthRow n={5} tone="green" d={580}>
      Une charte <b>vivante</b>, pas vitrine.
    </SynthRow>
  </SynthPage>
);

// ═══ 80-a3 ═════════════════════════════════════════════════════════════

// ─── A3 · Divider ───────────────────────────────────────────────────────────
const A3_Divider: Page = () => (
  <Section n={8} title={<>Atelier 3 ·<br />Mini‑charte éthique IA</>} sub="Une page, cinq rubriques, des règles vérifiables. Puis la rétroaction de vos collègues." dur="≈ 45 min" kind="atelier">
    <SecItem n={1}>Vos principes, avec vos mots</SecItem>
    <SecItem n={2}>Vos règles d’usage et vos données</SecItem>
    <SecItem n={3}>Vos rôles et votre suivi</SecItem>
    <SecItem n={4}>La critique de l’IA, puis celle de vos collègues</SecItem>
  </Section>
);
A3_Divider.transition = BLOOM;

// ─── A3 · Brief ─────────────────────────────────────────────────────────────
const A3Line = ({ n, name, hint }: { n: number; name: string; hint: string }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, padding: '10px 0', borderTop: `1.5px dashed ${C.rule}` }}>
    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 26, color: C.blue, width: 30 }}>{n}</span>
    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 27, color: C.ink, width: 250, flex: 'none' }}>{name}</span>
    <span style={{ fontSize: 22, color: C.faint, fontStyle: 'italic' }}>{hint}</span>
  </div>
);

const A3_Brief: Page = () => (
  <Frame mod={8} kind="atelier" label="Atelier 3 · Consignes">
    <Title>Votre mission : une charte vivante, pas vitrine</Title>
    <Lede>
      <ByClient
        apsm="Pour la mine Val-Laurier, ou pour votre organisation, sans détail confidentiel. Le modèle est dans le Chat."
        sobeys="Pour une épicerie comme la vôtre, ou pour votre service, sans détail confidentiel. Le modèle est dans le Chat."
      />
    </Lede>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 290, width: 860, boxSizing: 'border-box', background: '#FFFEFA', borderRadius: 12, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.teal}`, padding: '24px 32px 14px', ...dl(100) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <Icon name="shieldCheck" size={34} color={C.teal} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>Mini-charte éthique IA · [Organisation]</span>
      </div>
      <A3Line n={1} name="Nos principes" hint="3 à 5, avec nos mots" />
      <A3Line n={2} name="Nos règles d’usage" hint="permis · interdit · sur accord" />
      <A3Line n={3} name="Nos données" hint="vert · jaune · rouge" />
      <A3Line n={4} name="Nos rôles" hint="qui approuve, qui répond" />
      <A3Line n={5} name="Notre suivi" hint="incidents, révision le…" />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1040, top: 290, width: 760, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '10px 30px 4px', ...dl(250) }}>
      <PlanRow n={1} mins="8 min" d={300}>
        Principes
      </PlanRow>
      <PlanRow n={2} mins="10 min" d={380}>
        Règles et données
      </PlanRow>
      <PlanRow n={3} mins="7 min" d={460}>
        Rôles et suivi
      </PlanRow>
      <PlanRow n={4} mins="5 min" d={540}>
        La critique de l’IA
      </PlanRow>
      <PlanRow n="★" mins="11 min" d={620}>
        Présentations et rétroaction
      </PlanRow>
    </div>
    <Callout cls={A.in} title="Le test de chaque phrase" tone="yellow" icon="search" size={26} style={{ position: 'absolute', left: 120, top: 830, width: 1680, padding: '14px 26px', ...dl(700) }}>
      Peut-on vérifier si elle est respectée ? Si non, réécrivez-la.
    </Callout>
  </Frame>
);

// ─── A3 · Step 1: principles ────────────────────────────────────────────────
const A3Chip = ({ icon, tone, children }: { icon: IconName; tone: Tone; children: ReactNode }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderRadius: 12, background: T[tone].bg, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, fontFamily: display, fontWeight: 700, fontSize: 27, color: T[tone].fg }}>
    <Icon name={icon} size={26} />
    {children}
  </span>
);

const A3_Step1: Page = () => (
  <WorkStep
    mod={8}
    label="Atelier 3 · Étape 1 sur 4"
    title="Étape 1 · Vos principes, avec vos mots"
    timerId="a3-s1"
    minutes={8}
    timerLabel="Principes"
    side={
      <NoteCard>
        <NoteLine>3 à 5 principes, pas plus</NoteLine>
        <NoteLine>Pour chacun : « Chez nous, cela veut dire que… »</NoteLine>
        <NoteLine>Un exemple concret par principe</NoteLine>
      </NoteCard>
    }
  >
    <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 28px', ...dl(150) }}>
      <Eyebrow c={C.muted} size={21}>
        Choisissez parmi les six
      </Eyebrow>
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, max-content)', columnGap: 16, rowGap: 14 }}>
        <A3Chip icon="scale" tone="violet">
          Équité
        </A3Chip>
        <A3Chip icon="eye" tone="teal">
          Transparence
        </A3Chip>
        <A3Chip icon="lock" tone="blue">
          Vie privée
        </A3Chip>
        <A3Chip icon="shieldCheck" tone="green">
          Fiabilité
        </A3Chip>
        <A3Chip icon="humanCheck" tone="yellow">
          Contrôle humain
        </A3Chip>
        <A3Chip icon="flag" tone="coral">
          Responsabilité
        </A3Chip>
      </div>
    </div>
    <Eyebrow cls={A.in} c={C.muted} size={21} style={dl(300)}>
      Exemple de reformulation
    </Eyebrow>
    <div className={A.in} style={{ display: 'flex', flexDirection: 'column', gap: 12, ...dl(350) }}>
      <Callout title="Trop vague" tone="coral" icon="x" size={25} style={{ padding: '14px 24px' }}>
        « Nous valorisons la transparence. »
      </Callout>
      <Callout title="Vérifiable" tone="green" icon="check" size={25} style={{ padding: '14px 24px' }}>
        <ByClient
          apsm="« Une alerte de l’IA n’entraîne jamais de sanction : une personne vérifie, puis échange avec le travailleur. »"
          sobeys="« Un client sait toujours, dès le premier message, qu’il échange avec une IA. »"
        />
      </Callout>
    </div>
  </WorkStep>
);

// ─── A3 · Step 2: rules and data ────────────────────────────────────────────
const A3Col = ({ d, icon, tone, title, children }: { d: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 0 6px 0 ${STRONG[tone]}`, padding: '18px 20px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <IconTile name={icon} tone={tone} size={44} solid />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 28, color: C.ink }}>{title}</span>
    </div>
    <div style={{ marginTop: 12, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </div>
);

const A3_Step2: Page = () => (
  <WorkStep
    mod={8}
    label="Atelier 3 · Étape 2 sur 4"
    title="Étape 2 · Vos règles d’usage et vos données"
    timerId="a3-s2"
    minutes={10}
    timerLabel="Règles et données"
    side={
      <NoteCard>
        <NoteLine>3 usages permis, 3 interdits, 2 sur accord</NoteLine>
        <NoteLine>Le feu tricolore : 2 exemples par couleur</NoteLine>
        <NoteLine>Les outils approuvés, nommés</NoteLine>
      </NoteCard>
    }
  >
    <div style={{ display: 'flex', gap: 16 }}>
      <A3Col d={150} icon="check" tone="green" title="Permis">
        <ByClient
          apsm="Premier jet d’une fiche de prévention, résumé d’un rapport anonymisé, traduction d’une consigne."
          sobeys="Description de produit, résumé d’un document public, premier jet d’un courriel."
        />
      </A3Col>
      <A3Col d={250} icon="x" tone="coral" title="Interdit">
        <ByClient
          apsm="Diffuser une consigne de sécurité non validée, décider d’une sanction, coller un rapport d’accident nominatif."
          sobeys="Coller des données de clients ou d’employés, décider seul d’un refus, reconnaître un client à son visage."
        />
      </A3Col>
      <A3Col d={350} icon="key" tone="yellow" title="Sur accord">
        <ByClient
          apsm="Tout outil qui capte l’image, la voix ou des données biométriques des travailleurs."
          sobeys="Toute offre personnalisée fondée sur un profil, tout nouvel outil."
        />
      </A3Col>
    </div>
    <div className={A.in} style={{ display: 'flex', gap: 16, ...dl(450) }}>
      <Tag tone="green" size={24}>
        <Icon name="check" size={24} /> Vert · tout outil
      </Tag>
      <Tag tone="yellow" size={24}>
        <Icon name="shieldCheck" size={24} /> Jaune · outil approuvé
      </Tag>
      <Tag tone="coral" size={24}>
        <Icon name="lock" size={24} /> Rouge · jamais tel quel
      </Tag>
    </div>
    <Hint cls={A.in} style={{ fontSize: 24, ...dl(550) }}>
      Les exemples ci-dessus sont des pistes : adaptez-les à votre organisation.
    </Hint>
  </WorkStep>
);

// ─── A3 · Step 3: roles and follow-up ───────────────────────────────────────
const A3_Step3: Page = () => (
  <WorkStep
    mod={8}
    label="Atelier 3 · Étape 3 sur 4"
    title="Étape 3 · Vos rôles et votre suivi"
    lede="Des fonctions plutôt que des prénoms, si vous travaillez sur votre organisation."
    timerId="a3-s3"
    minutes={7}
    timerLabel="Rôles et suivi"
    side={
      <NoteCard>
        <NoteLine>Au moins trois rôles nommés</NoteLine>
        <NoteLine>Une adresse ou une personne pour signaler</NoteLine>
        <NoteLine>Une date de révision</NoteLine>
      </NoteCard>
    }
  >
    <DoRow n={1} d={150}>
      <b>Qui approuve</b> un nouveau projet ou un nouvel outil d’IA ?
    </DoRow>
    <DoRow n={2} d={250}>
      <b>Qui répond</b> de chaque système en service ?
    </DoRow>
    <DoRow n={3} d={350}>
      <b>À qui signaler</b> un doute ou un incident, sans crainte de reproche ?
    </DoRow>
    <DoRow n={4} d={450}>
      <b>Quel indicateur</b> suivre ? Par exemple : le nombre d’incidents, de plaintes, de décisions révisées.
    </DoRow>
    <DoRow n={5} d={550}>
      <b>Quand</b> réviser la charte ?
    </DoRow>
  </WorkStep>
);

// ─── A3 · Step 4: ask the AI to critique ────────────────────────────────────
const A3_Step4: Page = () => (
  <WorkStep
    mod={8}
    label="Atelier 3 · Étape 4 sur 4"
    title="Étape 4 · Demandez à l’IA de critiquer votre charte"
    timerId="a3-s4"
    minutes={5}
    timerLabel="Critique"
    side={
      <NoteCard>
        <NoteLine>Les critiques que vous retenez</NoteLine>
        <NoteLine>Celles que vous rejetez, et pourquoi</NoteLine>
        <NoteLine>Une phrase réécrite</NoteLine>
      </NoteCard>
    }
  >
    <PromptBox label="À copier depuis le Chat" size={25} cls={A.in} style={dl(150)}>
      Voici une mini-charte éthique IA. Joue le rôle d’un auditeur exigeant. 1) Quelles règles sont impossibles à vérifier ? 2) Que manque-t-il au regard de la Loi 25 du Québec ? 3) Quelle règle risque d’être contournée ? Réponds en cinq points courts. [collez votre charte]
    </PromptBox>
    <Callout cls={A.in} title="Avant de coller" tone="coral" icon="lock" size={25} style={dl(300)}>
      Aucun nom de personne ni détail confidentiel : des fonctions, pas des prénoms.
    </Callout>
    <Callout cls={A.in} title="Vous restez l’auteur" tone="blue" icon="humanCheck" size={25} style={dl(400)}>
      L’IA propose, vous tranchez. Gardez seulement ce qui vous convainc.
    </Callout>
  </WorkStep>
);

// ─── A3 · Share and cross feedback ──────────────────────────────────────────
const A3Crit = ({ d, icon, q }: { d: number; icon: IconName; q: string }) => (
  <div className={A.right} style={{ display: 'flex', alignItems: 'center', gap: 16, height: 76, borderTop: `1.5px solid ${C.rule}`, ...dl(d) }}>
    <IconTile name={icon} tone="teal" size={46} />
    <span style={{ fontSize: 26, color: C.ink }}>{q}</span>
  </div>
);

const A3_Share: Page = () => (
  <Frame mod={8} kind="atelier" label="Atelier 3 · Présentations">
    <Title>Présentations et rétroaction croisée</Title>
    <Lede>Deux ou trois volontaires présentent leur charte en partage d’écran, deux minutes chacun.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 820, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AskCard n={1} title="Le volontaire présente" sub="Deux minutes : la règle dont il est le plus fier" d={100} />
      <AskCard n={2} title="Un point fort, une piste" sub="Une ou deux personnes réagissent au micro" d={220} />
      <AskCard n={3} title="Participant suivant" sub="Les autres déposent leur charte dans le Chat" d={340} />
    </div>
    <Timer id="a3-share" minutes={11} label="Présentations" compact cls={A.in} style={{ position: 'absolute', left: 120, top: 760, ...dl(460) }} />
    <div className={A.in} style={{ position: 'absolute', left: 1000, top: 280, width: 800, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 32px 8px', ...dl(200) }}>
      <Eyebrow c={T.teal.fg} size={22}>
        Grille de rétroaction
      </Eyebrow>
      <div style={{ marginTop: 12 }}>
        <A3Crit d={300} icon="search" q="Les règles sont-elles vérifiables ?" />
        <A3Crit d={380} icon="users" q="Des responsables sont-ils nommés ?" />
        <A3Crit d={460} icon="lock" q="Les données sensibles sont-elles protégées ?" />
        <A3Crit d={540} icon="humanCheck" q="Un humain peut-il réviser une décision ?" />
        <A3Crit d={620} icon="calendar" q="La charte a-t-elle une date de révision ?" />
      </div>
    </div>
  </Frame>
);

// ═══ 90-close ══════════════════════════════════════════════════════════

// ─── Close · The journey ────────────────────────────────────────────────────
const CLMod = ({ n, tone, title, d, children }: { n: number; tone: Tone; title: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 290, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '22px 24px' }}>
      <Num n={pad(n)} tone={tone} size={44} />
      <div style={{ marginTop: 12, fontFamily: display, fontWeight: 700, fontSize: 30, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 8, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const CL_Journey: Page = () => (
  <Frame mod={9} kind="synthese">
    <Title>Une journée, huit modules : le chemin parcouru</Title>
    <div style={{ position: 'absolute', left: 120, top: 220, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 397px)', rowGap: 26, columnGap: 30 }}>
      <CLMod n={1} tone="blue" title="Qu’est-ce que l’IA ?" d={100}>
        Elle apprend d’exemples et prédit le probable, pas le vrai.
      </CLMod>
      <CLMod n={2} tone="blue" title="Applications" d={170}>
        Des gains réels dans tous les secteurs, et une question éthique pour chacun.
      </CLMod>
      <CLMod n={3} tone="yellow" title="Atelier 1" d={240}>
        Un outil pris en flagrant délit : source inventée, image stéréotypée.
      </CLMod>
      <CLMod n={4} tone="violet" title="Enjeux éthiques" d={310}>
        Biais, transparence, vie privée.
      </CLMod>
      <CLMod n={5} tone="violet" title="Loi 25 et principes" d={380}>
        EFVP, décision automatisée, six principes.
      </CLMod>
      <CLMod n={6} tone="yellow" title="Atelier 2" d={450}>
        Un cas de votre secteur : sans gouvernance, l’outil dérape.
      </CLMod>
      <CLMod n={7} tone="violet" title="Gouvernance" d={520}>
        Des rôles nommés, cinq points de contrôle, un bouton d’arrêt.
      </CLMod>
      <CLMod n={8} tone="yellow" title="Atelier 3" d={590}>
        Votre mini-charte, vivante et vérifiable.
      </CLMod>
    </div>
  </Frame>
);

// ─── Close · Final quiz (multi) ─────────────────────────────────────────────
const CL_Quiz: Page = () => (
  <Frame mod={9} kind="qcm" beats={2} label="Clôture · Quiz final">
    <Title>
      <span style={{ color: C.violet }}>Quiz final</span> · Les bons réflexes
    </Title>
    <Qcm
      multi
      q="Lesquelles de ces pratiques relèvent d’une IA responsable ?"
      explain="Dire qu’une IA intervient, tester les résultats, garder un humain capable de réviser, encadrer les outils : c’est la réponse à la question de Nathalie, ce matin."
    >
      <Opt ok why="Oui : c’est la transparence, exigée en Europe pour les agents conversationnels et attendue partout.">
        Informer les membres qu’ils échangent avec une IA
      </Opt>
      <Opt why="Piège ! Retirer une variable ne suffit pas : des indices indirects la révèlent. Il faut tester les résultats par groupe.">
        Retirer le genre des données, puis ne plus rien tester
      </Opt>
      <Opt ok why="Oui : c’est le contrôle humain, et au Québec une obligation de l’article 12.1 pour les décisions automatisées.">
        Prévoir qu’une personne puisse réviser une décision automatisée
      </Opt>
      <Opt why="Piège ! Sans règle, les données sensibles finissent dans des outils non approuvés. Une charte encadre sans tout interdire.">
        Laisser chaque employé choisir ses outils d’IA, sans règle
      </Opt>
    </Qcm>
  </Frame>
);

// ─── Close · Personal action plan ───────────────────────────────────────────
const CLWhen = ({ d, tone, icon, when, children, ex }: { d: number; tone: Tone; icon: IconName; when: string; children: ReactNode; ex: string }) => (
  <div className={A.in} style={{ flex: 1, ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 470, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '30px 32px', display: 'flex', flexDirection: 'column' }}>
      <IconTile name={icon} tone={tone} size={72} solid />
      <div style={{ marginTop: 20, fontFamily: display, fontWeight: 700, fontSize: 44, color: C.ink }}>{when}</div>
      <div style={{ marginTop: 10, fontSize: 29, lineHeight: 1.42, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 'auto', background: T[tone].bg, borderRadius: 12, padding: '14px 18px', fontSize: 24, lineHeight: 1.4, color: C.ink }}>
        <b>Exemple :</b> {ex}
      </div>
    </div>
  </div>
);

const CL_Action: Page = () => (
  <Frame mod={9} label="Clôture · Plan d’action">
    <Title>Votre plan d’action : trois engagements</Title>
    <Lede>Écrivez-les maintenant, dans un document à vous. Un engagement écrit a bien plus de chances d’être tenu.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 30 }}>
      <CLWhen d={100} tone="blue" icon="bolt" when="Cette semaine" ex="demander qui est notre responsable des renseignements personnels.">
        Une question posée dans votre organisation.
      </CLWhen>
      <CLWhen d={250} tone="teal" icon="calendar" when="Ce mois-ci" ex="présenter ma mini-charte à mon gestionnaire.">
        Votre charte partagée, discutée, améliorée.
      </CLWhen>
      <CLWhen d={400} tone="green" icon="users" when="Dans 3 mois" ex="un registre des outils d’IA utilisés dans mon service.">
        Une pratique de gouvernance installée.
      </CLWhen>
    </div>
    <Callout cls={A.in} title="Petit et précis" tone="yellow" icon="target" size={26} style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(600) }}>
      « Présenter ma charte à l’équipe le 15 » plutôt que « faire plus attention à l’éthique ».
    </Callout>
  </Frame>
);

// ─── Close · Resources ──────────────────────────────────────────────────────
const CLTool = ({ d, icon, tone, title, children }: { d: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <Card tone={tone} icon={icon} title={title} size={24} cls={A.in} style={{ height: 270, ...dl(d) }}>
    {children}
  </Card>
);

const CL_Resources: Page = () => (
  <Frame mod={9} label="Clôture · Ressources">
    <Title>Pour aller plus loin</Title>
    <Lede>Des sources fiables, à consulter plutôt qu’à demander à une IA.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 30, columnGap: 30 }}>
      <CLTool d={100} icon="shield" tone="blue" title="Commission d’accès à l’information">
        Loi 25, guide de l’EFVP, incidents de confidentialité. cai.gouv.qc.ca
      </CLTool>
      <CLTool d={200} icon="leaf" tone="teal" title="Déclaration de Montréal">
        Les dix principes et le guide pour les appliquer. declarationmontreal-iaresponsable.com
      </CLTool>
      <CLTool d={300} icon="globe" tone="violet" title="OCDE et UNESCO">
        Principes de l’IA (OCDE, 2024) et recommandation sur l’éthique de l’IA (UNESCO, 2021).
      </CLTool>
      <CLTool d={400} icon="book" tone="yellow" title="Règlement européen sur l’IA">
        Règlement (UE) 2024/1689 et son report « omnibus » de 2026.
      </CLTool>
      <CLTool d={500} icon="layers" tone="green" title="ISO/IEC 42001">
        La norme de système de management de l’IA, certifiable.
      </CLTool>
      <CLTool d={600} icon="search" tone="coral" title="Obvia">
        L’Observatoire international sur les impacts sociétaux de l’IA, au Québec. obvia.ca
      </CLTool>
    </div>
  </Frame>
);

// ─── Close · Photo credits ──────────────────────────────────────────────────
const CLCredit = ({ id, what, who }: { id: PhotoId; what: string; who: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 62, borderTop: `1.5px solid ${C.rule}` }}>
    <Photo id={id} w={70} h={48} radius={8} credit={false} />
    <div>
      <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.2, color: C.ink }}>{what}</div>
      <div style={{ fontSize: 19, lineHeight: 1.3, color: C.muted }}>{who}</div>
    </div>
  </div>
);

const CL_Credits: Page = () => (
  <Frame mod={9} label="Clôture · Crédits photographiques">
    <Title>Crédits photographiques</Title>
    <Lede>Photos de Wikimedia Commons, sous licence libre. Logos des outils : marques de leurs propriétaires.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 60, ...dl(100) }}>
      <div>
        <CLCredit id="turing" what="Alan Turing à 16 ans" who="Auteur inconnu · domaine public" />
        <CLCredit id="mccarthy" what="John McCarthy, Stanford" who="null0 · CC BY-SA 2.0" />
        <CLCredit id="deepBlue" what="Deep Blue, Computer History Museum" who="Anton Chiang · CC BY 2.0" />
        <CLCredit id="hinton" what="Geoffrey Hinton" who="Xuthoria · CC BY-SA 4.0" />
        <CLCredit id="leeSedol" what="Lee Sedol" who="LG Electronics · CC BY 2.0" />
        <CLCredit id="troisRivieres" what="Trois-Rivières" who="Quintin Soloviev · CC BY 4.0" />
        <CLCredit id="entrevue" what="Entrevue d’embauche" who="Amtec Photos · CC BY-SA 2.0" />
        <CLCredit id="radiologie" what="Radiologue examinant des radiographies" who="Bill Branson, NCI · domaine public" />
        <CLCredit id="paiement" what="Terminal de paiement" who="Daylon124 · CC0" />
        <CLCredit id="timesSquare" what="Times Square, New York" who="Kevani pour la Wikimedia Foundation · CC BY-SA 4.0" />
      </div>
      <div>
        <CLCredit id="fondOeil" what="Fond d’œil normal" who="Mikael Häggström · CC0" />
        <CLCredit id="proteine" what="Protéine en rubans (triose-phosphate isomérase)" who="Jane Richardson · CC BY 3.0" />
        <CLCredit id="datacenter" what="Centre de données" who="PiDatacenters · CC BY-SA 4.0" />
        <CLCredit id="achat" what="Achat en ligne" who="Shixart1985 · CC BY 2.0" />
        <CLCredit id="parlement" what="Hôtel du Parlement, Québec" who="Marc-Lautenbacher · CC BY-SA 4.0" />
        <CLCredit id="montreal" what="Montréal vu du mont Royal" who="Taxiarchos228 · CC BY 3.0" />
        <CLCredit id="berlaymont" what="Le Berlaymont, Bruxelles" who="KenSwe72 · CC BY 4.0" />
        <CLCredit id="camionMine" what="Camion de minerai, mine souterraine (Australie)" who="R. Hill, CSIRO · CC BY 3.0" />
        <CLCredit id="camerasMagasin" what="Écran de surveillance en magasin" who="MIKI Yoshihito · domaine public" />
        <CLCredit id="airCanada" what="Boeing 787-9 d’Air Canada" who="Adam Moreira · CC BY-SA 4.0" />
      </div>
    </div>
  </Frame>
);

// ─── Close · Thanks ─────────────────────────────────────────────────────────
const CL_Thanks: Page = () => (
  <Frame mod={9} chrome={false}>
    <img src={logoStack} alt="Technologia" className={A.fade} style={{ position: 'absolute', left: 112, top: 78, height: 120, display: 'block' }} />
    <div style={{ position: 'absolute', left: 120, top: 300, width: 1000 }}>
      <Eyebrow cls={A.in} size={28}>
        Formation IA114 · Fin
      </Eyebrow>
      <h1 className={A.in} style={{ margin: '18px 0 0', fontFamily: display, fontWeight: 700, fontSize: 128, lineHeight: 1.0, color: C.ink, ...dl(120) }}>
        Merci !
      </h1>
      <p className={A.in} style={{ margin: '26px 0 0', fontSize: 38, lineHeight: 1.35, color: C.soft, ...dl(240) }}>
        Une IA n’est jamais responsable. <Hl>Nous, toujours.</Hl>
      </p>
      <div className={A.in} style={{ marginTop: 50, display: 'flex', alignItems: 'center', gap: 18, ...dl(400) }}>
        <IconTile name="star" tone="yellow" size={64} solid />
        <span style={{ fontSize: 30, fontWeight: 500, color: C.ink }}>Merci de remplir l’évaluation de la formation.</span>
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 870, display: 'flex', alignItems: 'center', gap: 22, ...dl(560) }}>
      <img src={formateur} alt={AUTHOR} style={{ width: 96, height: 96, borderRadius: 999, objectFit: 'cover', objectPosition: '50% 20%', display: 'block', boxShadow: `0 0 0 4px #fff, 0 0 0 7px ${C.yellow}` }} />
      <div>
        <div style={{ fontSize: 30, fontWeight: 600, color: C.ink }}>{AUTHOR}</div>
        <div style={{ fontSize: 24, color: C.muted }}>Formateur · Technologia</div>
      </div>
    </div>
    <Squares s={380} x={1270} y={330} delay={200} />
    <Footer2 />
  </Frame>
);
CL_Thanks.transition = BLOOM;

// ─── Styles (collected above, injected once; updated in place on HMR) ───────
if (typeof document !== 'undefined') {
  const STYLE_ID = `osd-styles-${SLIDE_ID}`;
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  const css = CSS.join('\n');
  if (el.textContent !== css) el.textContent = css;
}

export const meta: SlideMeta = {
  title: "Introduction à l’IA et à l’éthique — Formation IA114 (1 jour)",
  createdAt: '2026-11-18T13:34:29.720Z',
  theme: 'technologia',
  labs: [{ label: 'APSM', url: clientGuide_apsm }, { label: 'Sobeys', url: clientGuide_sobeys }],
};

// Module → index of its opening page (written by scripts/deck-features.mjs).
const MOD_START: Record<number, number> = {0:0,1:9,2:23,3:32,4:38,5:47,6:58,7:66,8:74,9:81};

export default [
  OP_Cover,
  OP_Trainer,
  OP_Roundtable,
  OP_Objectives,
  OP_Program,
  OP_HowWeWork,
  OP_Mutuelle,
  OP_Question,
  OP_Quiz0,
  M1_Divider,
  M1_Day,
  M1_Define,
  M1_History,
  M1_RulesVsLearn,
  M1_Learn,
  M1_Nested,
  M1_Deep,
  M1_Panorama,
  M1_NextWord,
  M1_Plausible,
  M1_AiOrNot,
  M1_Qcm1,
  M1_Synth,
  M2_Divider,
  M2_Sectors,
  M2_Cases,
  M2_DemoChat,
  M2_DemoVision,
  M2_Tools,
  M2_Programme,
  M2_Qcm,
  M2_Synth,
  A1_Divider,
  A1_Brief,
  A1_Step1,
  A1_Step2,
  A1_Step3,
  A1_Debrief,
  M4_Divider,
  M4_Three,
  M4_Bias,
  M4_Sources,
  M4_BlackBox,
  M4_Privacy,
  M4_Traffic,
  M4_Qcm,
  M4_Synth,
  M5_Divider,
  M5_Law25,
  M5_Duties,
  M5_Art12,
  M5_Efvp,
  M5_Montreal,
  M5_Pillars,
  M5_World,
  M5_RiskSort,
  M5_Qcm,
  M5_Synth,
  A2_Divider,
  A2_Case1,
  A2_Case2,
  A2_Step1,
  A2_Step2,
  A2_Debate,
  A2_After,
  A2_Mutuelle,
  M7_Divider,
  M7_AirCanada,
  M7_Roles,
  M7_Lifecycle,
  M7_CharterParts,
  M7_Charter,
  M7_Qcm,
  M7_Synth,
  A3_Divider,
  A3_Brief,
  A3_Step1,
  A3_Step2,
  A3_Step3,
  A3_Step4,
  A3_Share,
  CL_Journey,
  CL_Quiz,
  CL_Action,
  CL_Resources,
  CL_Credits,
  CL_Thanks,
] satisfies Page[];

// Speaker notes — one entry per page, same order as the default export.
export const notes: (string | undefined)[] = [
  `⏱ 1 min · ACCUEIL (page affichée pendant l'arrivée des participants)

VERSION CLIENT — AVANT LA SESSION, cliquez le logo du client sur cette page : APSM ou Sobeys. Le choix est mémorisé et suivi par la vue présentateur. Il change les trois ateliers (pages des modules 3, 6 et 8), le logo en pied de page et le lien vers le guide PDF. Tout le reste est commun.
• APSM : session du 1er décembre 2026, six heures. Priorités du cadrage : vérification de l'information, éthique, Loi 25. Outils gratuits seulement (aucun outil sous licence d'entreprise choisi).
• Sobeys : ateliers adaptés à l'épicerie et au commerce de détail.

OBJECTIF — Installer un climat chaleureux et poser le cadre : une journée pour passer de « on entend parler de l'IA partout » à « je comprends ce qu'elle fait, ce qu'elle risque, et comment l'encadrer ».

DIRE — « Bonjour et bienvenue à la formation Introduction à l'IA et à l'éthique. Ce matin, on comprend ce qu'est l'intelligence artificielle et ce qu'elle sait faire ; on l'essaie. Cet après-midi, on regarde ses risques en face, la Loi 25, et on écrit ensemble les règles du jeu. »

Montrer l'animation : « Une balance : d'un côté la performance de l'IA, de l'autre la confiance. Toute la journée, on va chercher l'équilibre. »

LOGISTIQUE — Classe virtuelle : horaire 9 h – 16 h, pauses vers 10 h 35 et 14 h 20, dîner 12 h – 13 h. Vérifiez le son, la caméra et l'accès au Chat. Demandez à chacun d'ouvrir dès maintenant un assistant d'IA dans un autre onglet ou sur un second écran : un compte gratuit ChatGPT, Copilot, Gemini ou Claude suffit. Évaluation à la fin de la journée.

TRANSITION — « Avant d'entrer dans le sujet, quelques mots sur moi. »`,
  `⏱ 2 min

OBJECTIF — Établir votre crédibilité et un contrat pédagogique clair.

DIRE — Présentez-vous en 60 à 90 secondes. À PERSONNALISER : votre parcours, les organisations que vous avez accompagnées, et un exemple où l'IA vous a impressionné… ou inquiété.

Puis les quatre engagements :
1. Sans jargon — « Aucune connaissance technique n'est nécessaire. Si j'utilise un mot compliqué, arrêtez-moi. »
2. Vous essayez — « Trois ateliers, chacun sur votre poste. On ne fait pas que regarder. »
3. De vrais cas — « Des histoires réelles, documentées, où l'IA a dérapé. Vous jugerez par vous-mêmes. »
4. Un livrable — « Vous repartez avec une mini-charte éthique, prête à proposer dans votre organisation. »

TRANSITION — « À votre tour maintenant. »`,
  `⏱ 7 min (30 secondes par personne, ajuster selon la taille du groupe)

OBJECTIF — Connaître le groupe, ses secteurs et son humeur face à l'IA, pour adapter les exemples de la journée.

ANIMATION — Lancez le minuteur. Appelez chaque personne par son prénom (ordre de la liste des participants) ; elle ouvre son micro et répond aux deux questions. Notez dans un document à vous les secteurs (RH, santé, finance, marketing, public…) : vous y reviendrez au module 2. Notez aussi les mots d'humeur : « inquiétude » et « méfiance » sont de très bonnes portes d'entrée pour l'après-midi.

SONDAGE ÉCLAIR — Chacun annonce à voix haute le numéro de la ligne qui le décrit (1 à 5). Cliquez une fois la ligne par réponse (le bouton « − » corrige une erreur). Variante : le sondage intégré de Teams ou Zoom.

LECTURE DU RÉSULTAT —
• Majorité 1 ou 2 : prenez votre temps au module 1, multipliez les démonstrations.
• Majorité 3 ou 4 : accélérez les définitions, insistez sur les enjeux et la Loi 25.
• Quelqu'un répond 5 (règles d'usage) : demandez-lui s'il accepte d'en parler au module 7, sur la gouvernance.

TRANSITION — « Merci ! Voici ce que je vous propose d'atteindre ensemble. »`,
  `⏱ 1 min

OBJECTIF — Présenter les cinq objectifs officiels comme une progression.

DIRE — « Cinq marches, qui reprennent les objectifs de la formation. »
1. COMPRENDRE — « IA, machine learning, deep learning : trois mots qu'on mélange souvent. »
2. IDENTIFIER — « Des usages concrets en RH, en santé, en finance, en marketing. »
3. ANALYSER — « Les biais, la transparence, la protection des données. »
4. APPLIQUER — « La Loi 25 et les principes de l'IA responsable. »
5. ÉLABORER — « Votre mini-charte éthique, la dernière marche, celle qui engage. »

TRANSITION — « Voici comment la journée s'organise. »`,
  `⏱ 1 min

OBJECTIF — Donner de la visibilité sur le déroulement.

DIRE — « Le matin, les fondamentaux : ce qu'est l'IA, ses applications, avec des démonstrations, puis l'atelier 1 où vous explorez vous-mêmes un agent conversationnel et un outil de génération. Avant le dîner, on ouvre le dossier éthique : biais, transparence, vie privée. »

« L'après-midi : la Loi 25 et les principes de l'IA responsable, puis l'atelier 2, une étude de cas de votre secteur. Après la pause, la gouvernance : qui fait quoi dans une organisation. Et l'atelier 3 : votre mini-charte. »

À SOULIGNER — Les modules en jaune sont les ateliers : chacun sur son poste, guidé pas à pas, avec un minuteur. Les numéros en haut à droite de chaque page sont cliquables : ils vous ramènent au début d'un module.

TRANSITION — « Comment on va travailler. »`,
  `⏱ 1 min

OBJECTIF — Expliquer les codes visuels et le contrat de participation.

DIRE — « Vous verrez des étiquettes en haut des pages. »
• QCM (violet) — « Vous votez à voix haute, je clique la réponse majoritaire. Les mauvaises réponses sont des pièges volontaires. »
• DÉMO (bleu) — « Je montre en direct, en partage d'écran. »
• ÉTUDE DE CAS (sarcelle) — « Des histoires vraies. »
• ATELIER (jaune) — « Chacun sur son poste, avec un minuteur et un livrable. »

LES TROIS RÈGLES —
1. Questions bienvenues à tout moment, au micro.
2. « Aucune donnée confidentielle dans les outils pendant la formation. » C'est déjà de l'éthique appliquée : on y reviendra.
3. Fil rouge : la Mutuelle des Érables, présentée juste après.

CLASSE VIRTUELLE — Caméra si possible, micro coupé hors échanges. Idéal : deux écrans, ou la formation dans une fenêtre et l'outil d'IA dans l'autre.

TRANSITION — « Faisons connaissance avec la Mutuelle. »`,
  `⏱ 2 min · FIL ROUGE

OBJECTIF — Ancrer la journée dans une organisation transversale, où chaque secteur du programme officiel se retrouve : RH, santé, finance, marketing.

DIRE — « La Mutuelle des Érables est fictive, mais ses enjeux sont réels. Une mutuelle d'assurance de personnes : vie, invalidité, assurance collective. 650 employés, 310 000 membres, siège à Trois-Rivières. Elle manipule tous les jours des données parmi les plus sensibles qui soient : la santé, les revenus, la famille. »

Présenter les personnages (les cartes apparaissent une à une) :
• Nathalie, vice-présidente transformation numérique : elle porte le Programme IA et veut aller vite.
• Samir, RH : 4 000 CV par an, il rêve d'un tri automatique.
• Chloé, responsable de la protection des renseignements personnels, la RPRP exigée par la Loi 25 : elle veut être consultée avant, pas après.
• Vincent, marketing : un agent conversationnel et des campagnes personnalisées.
• Mei, analyste de données : elle construit les modèles et se demande ce qu'ils ont appris.

INSISTER — Chacun a raison de son point de vue. L'éthique, c'est souvent arbitrer entre des personnes qui ont toutes un peu raison.

TRANSITION — « Et voici la question que se pose Nathalie. »`,
  `⏱ 1 min · FIL ROUGE

DIRE — Lisez la citation lentement : « Comment profiter de l'IA sans trahir la confiance de nos membres et de nos employés ? »

« Ce matin, on comprend et on essaie. Autour du dîner, on repère les risques. Cet après-midi, on juge un cas de votre secteur et on écrit les règles du jeu. »

INTERACTION — « Dans votre organisation, qui se pose cette question aujourd'hui ? » Une ou deux réponses au micro suffisent.

TRANSITION — « Testons vos intuitions avant de commencer. »`,
  `⏱ 2 min · QCM À RÉPONSES MULTIPLES

OBJECTIF — Faire émerger les représentations initiales sans juger.

ANIMATION — Lisez la question. Les participants annoncent les lettres qu'ils retiennent (ex. « B et D »). Cochez les options choisies par la majorité, puis « Valider ma sélection ». Cliquez ensuite chaque option pour lire l'explication. Avec →, vous révélez les bonnes réponses, puis l'essentiel.

RÉPONSES — B et D.
• A ✗ PIÈGE — « Une machine n'est pas neutre : elle apprend de nos données, avec nos travers. »
• B ✓ — Filtre anti-pourriel, GPS, traduction, recommandations.
• C ✗ PIÈGE — L'aplomb n'est pas une preuve : on verra comment un modèle invente.
• D ✓ — L'article 12.1 de la loi sur le secteur privé, modifiée par la Loi 25, en vigueur depuis le 22 septembre 2023.

MESSAGE CLÉ — Utile, partout… et ni neutre ni infaillible.

TRANSITION — « Mais d'abord : qu'est-ce que c'est, au juste, l'intelligence artificielle ? »`,
  `⏱ 1 min · DÉBUT DU MODULE 1 (≈ 9 h 15)

OBJECTIF — Annoncer le plan du module.

DIRE — « Module 1 : qu'est-ce que l'intelligence artificielle ? Le but n'est pas de faire de vous des spécialistes, mais que vous compreniez assez bien la machine pour savoir quand lui faire confiance… et quand vous en méfier. C'est la base de toute l'éthique de cet après-midi. »

« Au programme : une définition et un peu d'histoire ; comment une machine apprend ; la différence entre IA, machine learning et deep learning ; un panorama des technologies ; et comment un outil comme ChatGPT écrit ses réponses. »

RYTHME — Environ 50 minutes.

TRANSITION — « Commençons par une journée ordinaire. »`,
  `⏱ 3 min · UNE JOURNÉE AVEC L'IA (6 clics)

OBJECTIF — Montrer que l'IA n'est ni nouvelle ni lointaine : on l'utilise déjà tous les jours.

DIRE — « Avant de définir quoi que ce soit, suivons une journée ordinaire. »
→ beat 1 : « 7 h : vous déverrouillez votre téléphone avec votre visage. C'est de l'IA qui perçoit. »
→ beat 2 : « 8 h 10 : le GPS vous fait éviter un bouchon. Il prédit la circulation à partir de millions de trajets. »
→ beat 3 : « 9 h : votre boîte de réception est presque sans pourriels. Le filtre a appris à les reconnaître. »
→ beat 4 : « 11 h 30 : un courriel en anglais ? Un clic, il est traduit. »
→ beat 5 : « 14 h : votre clavier finit la phrase à votre place. C'est exactement le principe de ChatGPT, en miniature. »
→ beat 6 : « 20 h 30 : "Vous aimerez aussi…". La plateforme a appris vos goûts. »

QUESTION — « Avant ce matin, qui aurait dit "j'utilise l'IA tous les jours" ? » Deux ou trois réponses au micro.

TRANSITION — « Alors, comment définir ce qui se cache derrière tout ça ? »`,
  `⏱ 3 min · DÉFINITION (4 clics)

OBJECTIF — Donner une définition simple et quatre capacités concrètes.

DIRE — « Une définition de travail, pour aujourd'hui : des programmes capables de faire des tâches qui demandaient jusqu'ici l'intelligence humaine. Concrètement, quatre capacités. »
→ beat 1 : « Percevoir : voir une image, entendre une voix. À la Mutuelle : transcrire l'appel d'un membre. »
→ beat 2 : « Comprendre : lire un texte et en saisir le sens. Résumer 40 courriels. »
→ beat 3 : « Prédire : anticiper à partir du passé. Repérer une réclamation inhabituelle. »
→ beat 4 : « Générer : produire un texte, une image. Rédiger une lettre. C'est l'IA générative, celle de ChatGPT. »

INSISTER — L'IA n'est pas « intelligente » comme nous : elle imite certaines capacités, sans conscience ni compréhension du monde. Le mot « intelligence » est une métaphore, et il crée des attentes.

TRANSITION — « D'où vient-elle ? Petit détour par l'histoire. »`,
  `⏱ 3 min · HISTORIQUE

OBJECTIF — Situer l'IA dans le temps : un domaine ancien, une rupture récente.

DIRE — « 1950 : Alan Turing pose la question "Les machines peuvent-elles penser ?" et propose un test. 1956 : le terme intelligence artificielle est inventé, lors d'un atelier à Dartmouth, aux États-Unis. 1997 : Deep Blue bat Kasparov aux échecs, avec des règles et beaucoup de calcul. 2012 : l'apprentissage profond se met à reconnaître les images, c'est le début du deep learning moderne. 2016 : AlphaGo bat un champion du jeu de go. 2017 : des chercheurs de Google inventent le Transformer, le T de GPT. »

Pointer 2022 (en jaune) : « Novembre 2022 : ChatGPT. Pour la première fois, n'importe qui peut parler à une IA, en français, sans rien installer. »

« Depuis 2025, on parle d'agents : des IA qui ne se contentent plus de répondre, mais qui agissent dans nos outils. »

À SOULIGNER — L'histoire a connu des « hivers de l'IA » (années 1970 et fin des années 1980) : des promesses non tenues, puis des budgets coupés. L'enthousiasme actuel n'est pas le premier.

CLIN D'ŒIL QUÉBEC — Montréal est un pôle mondial du deep learning (Mila, Yoshua Bengio, prix Turing 2018).

TRANSITION — « Ce qui a tout changé, c'est une nouvelle façon de programmer. »`,
  `⏱ 4 min · PROGRAMMER OU APPRENDRE (3 clics)

OBJECTIF — Faire comprendre l'idée centrale de l'apprentissage automatique.

DIRE — « À gauche, la programmation classique. Un humain écrit les règles : si le courriel contient "gratuit", alors c'est un pourriel. »
→ beat 1 : « Problème : la Mutuelle écrit à ses membres "Consultation gratuite avec votre conseiller", et le courriel est bloqué à tort. Les règles écrites à la main sont fragiles. »
→ beat 2 : « À droite, l'apprentissage automatique. On ne donne plus les règles : on donne 100 000 courriels déjà classés par des humains. La machine en déduit ses propres règles. »
→ beat 3 : « Elle repère seule des centaines d'indices. Ce qu'elle a appris s'appelle un modèle. Et revers de la médaille : elle apprend aussi les erreurs et les biais de ses exemples. On y reviendra au module 4. »

ANALOGIE — « C'est la différence entre donner une recette à quelqu'un et lui faire goûter 1 000 plats jusqu'à ce qu'il cuisine seul. »

TRANSITION — « Regardons cet apprentissage en action. »`,
  `⏱ 4 min · DÉMO ANIMÉE : APPRENDRE PAR L'EXEMPLE (5 clics)

OBJECTIF — Visualiser l'entraînement d'un modèle et la notion de probabilité.

DIRE — « Chaque point est un courriel. Rond bleu : légitime. Carré rouge : pourriel. En bas, le nombre de liens ; à gauche, les mots promotionnels. »
→ beat 1 : « Le modèle trace une première frontière, au hasard. Tout ce qui est dans la zone rose sera classé pourriel. Neuf erreurs. »
→ beat 2 : « Il compte ses erreurs et ajuste. Quatre erreurs. »
→ beat 3 : « Il recommence des milliers de fois : c'est l'entraînement. Zéro erreur sur ces exemples. »
→ beat 4 : « Un nouveau courriel arrive. Le modèle ne l'a jamais vu. »
→ beat 5 : « Il le classe… avec une probabilité : pourriel à 92 %. Jamais une certitude. »

INSISTER — Le mot clé est « probabilité ». Toutes les IA, y compris ChatGPT, fonctionnent ainsi. Une probabilité de 92 %, c'est aussi 8 % de chances de se tromper : sur 310 000 membres, ça fait du monde.

TRANSITION — « Ce que vous venez de voir, c'est du machine learning. Situons-le par rapport aux autres mots. »`,
  `⏱ 5 min · IA ⊃ ML ⊃ DL ⊃ IA GÉNÉRATIVE (3 clics)

OBJECTIF — Fixer la différence entre IA, machine learning et deep learning (objectif officiel n° 1).

DIRE — « Des poupées russes. Le grand cercle : l'intelligence artificielle, tout système qui imite une capacité humaine, même avec des règles écrites à la main. Exemple : un vieux système expert qui applique les règles de souscription. »
→ beat 1 : « Dedans, le machine learning, l'apprentissage automatique : le système apprend à partir d'exemples. C'est ce qu'on vient de voir avec les pourriels. À la Mutuelle : un modèle qui estime le risque de fraude d'une réclamation. »
→ beat 2 : « Dedans, le deep learning, l'apprentissage profond : du machine learning avec des réseaux de neurones à nombreuses couches. Excellent pour les images, le son, le texte. Lire un formulaire manuscrit numérisé. »
→ beat 3 : « Et au cœur, l'IA générative : du deep learning qui produit du contenu nouveau. ChatGPT, Copilot, Gemini, Claude. »

À RETENIR — « Tout ce qui est deep learning est du machine learning, et tout ce qui est machine learning est de l'IA. L'inverse n'est pas vrai. »

QUESTION — « Dans les médias, quand on dit "l'IA", on parle de quel cercle, la plupart du temps ? » Réponse attendue : de l'IA générative, le plus petit.

TRANSITION — « Ouvrons le cercle violet : pourquoi parle-t-on de "profond" ? »`,
  `⏱ 3 min · DEEP LEARNING (4 clics)

OBJECTIF — Donner une intuition des réseaux de neurones, sans mathématiques, et préparer la notion de boîte noire.

DIRE — « À gauche, une image : un chiffre écrit à la main. Le réseau va la lire en plusieurs étapes. »
→ beat 1 : « La première couche repère des traits : un trait horizontal, un trait en biais. »
→ beat 2 : « La deuxième combine les traits en formes : un angle, une barre. »
→ beat 3 : « La troisième combine les formes en chiffres. »
→ beat 4 : « Résultat : un 7, à 97 %. Toujours une probabilité. »

« Pourquoi profond ? Parce qu'il y a beaucoup de couches : les grands modèles actuels en ont des dizaines, avec des milliards de réglages. Il leur faut des millions d'exemples et beaucoup de calcul. »

LE REVERS — « Personne n'a écrit ces règles. Si le modèle refuse une réclamation, il est très difficile de dire pourquoi. C'est le problème de la boîte noire : on y revient au module 4. »

PRÉCISION — Le schéma est une simplification pédagogique : dans un vrai réseau, ce que « voit » chaque couche est beaucoup moins net.

TRANSITION — « Vision, langage, voix… Faisons le tour des grandes familles. »`,
  `⏱ 4 min · PANORAMA DES TECHNOLOGIES

OBJECTIF — Donner une carte des technologies d'IA, avec un exemple pour la Mutuelle à chaque fois.

DIRE — Parcourez les six tuiles :
• Vision par ordinateur : objets, visages, texte dans une image. À la Mutuelle : lire les formulaires de réclamation.
• Traitement du langage : comprendre, classer, résumer, traduire. Classer les courriels des membres.
• Reconnaissance de la parole : la voix en texte, le texte en voix. Transcrire les appels du centre de contact.
• Analyse prédictive : prévoir, estimer un risque, détecter une anomalie. Le risque de fraude.
• IA générative : texte, image, voix, code. Rédiger une lettre, illustrer une campagne.
• Agents IA : enchaîner des actions dans des outils. Préparer seul un dossier de réclamation.

À SOULIGNER — Les outils du marché combinent souvent plusieurs familles : Teams transcrit (parole), puis résume (langage, génératif).

QUESTION — « Laquelle de ces familles existe déjà dans votre organisation ? »

TRANSITION — « Ouvrons le capot de l'IA générative. »`,
  `⏱ 5 min · EXERCICE INTERACTIF : LE MOT SUIVANT

OBJECTIF — Faire comprendre comment un LLM écrit, et pourquoi c'est un enjeu éthique.

ANIMATION — Cliquez « Mot suivant » à six reprises. À chaque clic, lisez à voix haute les candidats et leurs probabilités, puis le mot retenu.

DIRE — « La phrase commence par : "Bonjour, votre demande de remboursement…". C'est l'agent conversationnel de la Mutuelle qui répond à un membre. Quel est le mot suivant le plus probable ? » Laissez deux ou trois personnes proposer au micro. « Le modèle hésite entre "a", "sera", "est"… Il choisit "a". Puis il recommence avec la phrase allongée. »

À droite, les trois étapes : il a lu des milliards de phrases, il calcule la probabilité de chaque mot, il choisit et recommence.

CHUTE — À la fin : « "Votre demande de remboursement a été acceptée, vous recevrez…". Fluide, rassurant. Mais le modèle n'a pas ouvert le dossier ! "Acceptée" était simplement plus probable que "refusée" dans les phrases qu'il a lues. Si le membre se fie à cette réponse, qui est responsable ? » On verra un vrai cas au module 4 : Air Canada.

PRÉCISION — Les probabilités affichées sont illustratives.

ASTUCE — « Recommencer » remet la phrase à zéro.

TRANSITION — « Conséquence directe : ce qui est probable n'est pas toujours vrai. »`,
  `⏱ 4 min · HALLUCINATION (4 clics)

OBJECTIF — Montrer une hallucination réaliste, sur un sujet de la journée : la Loi 25.

DIRE — « Chloé, notre responsable de la protection des renseignements personnels, vérifie un point de la Loi 25. La réponse est claire, précise, rassurante. »
→ beat 1 : « 15 M$ ou 3 % : faux, mais crédible. Les vrais plafonds, dans la loi sur le secteur privé : jusqu'à 10 M$ ou 2 % du chiffre d'affaires mondial pour une sanction administrative pécuniaire, et jusqu'à 25 M$ ou 4 % pour une amende pénale (doublée en cas de récidive). »
→ beat 2 : « "L'article 47.3 de la Loi 25" : la Loi 25 est une loi qui en modifie plusieurs autres ; cette référence ne veut rien dire. Le format est plausible, le contenu est inventé. »
→ beat 3 : « L'exemption des PME n'existe pas : toute entreprise qui traite des renseignements personnels est visée. »
→ beat 4 : « Ça s'appelle une hallucination. Le modèle comble les trous avec du vraisemblable. »

INSISTER — Plus la question est précise (chiffre, date, source, article de loi), plus il faut vérifier, à la source : ici, le site de la Commission d'accès à l'information (cai.gouv.qc.ca) ou LégisQuébec.

PRÉCISION — La réponse affichée est fabriquée pour l'exercice ; les vrais montants sont dans les notes ci-dessus.

TRANSITION — « Dernier réflexe à tester : tout ce qui est automatique est-il de l'IA ? »`,
  `⏱ 4 min · EXERCICE : IA OU PAS IA ?

OBJECTIF — Distinguer IA et simple règle programmée.

ANIMATION — Pour chaque carte : lisez-la, faites voter à voix haute (« IA » ou « pas IA »), puis cliquez pour retourner.

RÉPONSES —
• Rappel Outlook 15 min avant : pas d'IA, règle fixe.
• Netflix : IA, apprentissage des goûts.
• Résumé Teams : IA, perception (transcription) puis génération (résumé).
• Excel en rouge : pas d'IA, mise en forme conditionnelle.
• Réponse suggérée Gmail : IA, prédiction de texte.
• Thermostat à 22 h : pas d'IA. « S'il apprenait vos habitudes tout seul, là ce serait de l'IA. »

MESSAGE CLÉ — Tout ce qui est automatique n'est pas de l'IA. Le critère : est-ce que ça apprend ou interprète ? C'est aussi important pour l'éthique : une règle fixe s'explique facilement ; un modèle appris, beaucoup moins.

TRANSITION — « Une question pour vérifier. »`,
  `⏱ 3 min · QCM 1

ANIMATION — Votes à voix haute (A, B, C ou D). Cliquez l'option majoritaire pour la rétroaction, puis → pour la bonne réponse et → pour l'essentiel.

RÉPONSE — C : du deep learning, donc aussi du machine learning et de l'IA.
• A ✗ PIÈGE — Il apprend à partir d'exemples : c'est du machine learning.
• B ✗ PIÈGE — Le machine learning est inclus dans l'IA.
• D ✗ PIÈGE — Il reconnaît du texte existant, il ne génère rien de nouveau. Bon réflexe toutefois : un même outil peut combiner lecture (deep learning) et rédaction (génératif).

TRANSITION — « Faisons le bilan du module 1. »`,
  `⏱ 2 min · SYNTHÈSE MODULE 1

DIRE — Relisez les cinq points en les reliant aux animations vues :
1. L'IA apprend à partir d'exemples (le filtre anti-pourriel).
2. Les poupées russes : IA, machine learning, deep learning, IA générative.
3. Toujours une probabilité (92 %, 97 %), jamais une certitude.
4. Un LLM écrit le mot le plus probable, pas le plus vrai (la demande « acceptée », l'amende inventée).
5. Tout ce qui est automatique n'est pas de l'IA.

À VOTRE POSTE — Lisez la carte bleue : trois moments où vous utilisez l'IA, et à quel cercle ils appartiennent.

TRANSITION — « Maintenant qu'on sait ce que c'est, voyons ce qu'elle fait concrètement, secteur par secteur. »`,
  `⏱ 1 min · DÉBUT DU MODULE 2 (≈ 10 h 05)

OBJECTIF — Passer de la théorie aux usages réels.

DIRE — « Module 2 : les applications concrètes. Quatre secteurs, ceux du programme : RH, santé, finance, marketing. Des réussites documentées. Deux démonstrations. Et les quatre projets d'IA de la Mutuelle des Érables, qui vont nous servir tout l'après-midi. »

RYTHME — Environ 30 minutes, puis la pause.

TRANSITION — « Faisons le tour des secteurs. »`,
  `⏱ 5 min · QUATRE SECTEURS (4 clics)

OBJECTIF — Identifier des cas d'usage concrets dans différents secteurs (objectif officiel n° 2).

DIRE — Un secteur par clic. Pour chacun, lisez les trois usages, puis la vigilance en rouge : c'est le fil qu'on tirera cet après-midi.
→ beat 1 : RH. « Rédiger des offres d'emploi inclusives, présélectionner des candidatures, répondre aux questions des employés. Vigilance : les biais dans le tri. »
→ beat 2 : Santé. « Aide au diagnostic en imagerie, transcription des notes cliniques, prévision de l'achalandage des urgences. Vigilance : des données parmi les plus sensibles, et la décision reste médicale. »
→ beat 3 : Finance et assurance. « Fraude en temps réel, risque de crédit ou d'assurance, lecture de documents. Vigilance : pouvoir expliquer un refus. »
→ beat 4 : Marketing. « Recommandation, création de contenus, analyse des avis. Vigilance : le profilage et le consentement. »

INTERACTION — Reprenez les secteurs notés au tour de table : « Vous qui êtes en santé : lequel de ces usages existe chez vous ? » Une ou deux réponses au micro.

TRANSITION — « Des promesses ? Non : des résultats documentés. »`,
  `⏱ 4 min · QUATRE RÉUSSITES DOCUMENTÉES

OBJECTIF — Montrer que les gains sont réels, avec des sources, avant d'aborder les risques.

DIRE —
• « Santé, 2018 : la FDA, l'agence américaine du médicament, autorise IDx-DR, premier système d'IA qui détecte la rétinopathie diabétique, une maladie de l'œil, sans qu'un spécialiste lise l'image. Ça permet le dépistage en pharmacie ou en clinique de première ligne. »
• « Science, 2024 : le prix Nobel de chimie récompense notamment Demis Hassabis et John Jumper pour AlphaFold, qui prédit la forme des protéines. Des années de laboratoire gagnées pour la recherche de médicaments. »
• « Finance : selon Visa, son IA a aidé à bloquer environ 40 milliards de dollars américains de fraude sur un an (annonce de juillet 2024). »
• « Marketing : chez Netflix, environ 80 % des heures visionnées viennent des recommandations, selon un article de deux de ses dirigeants paru en 2015. »

LE REVERS — Lisez l'encadré : « Qui vérifie l'erreur ? Qui a donné ses données ? Qui peut contester ? »

À VÉRIFIER — Les chiffres d'entreprises (Visa, Netflix) sont déclaratifs : présentez-les comme tels.

TRANSITION — « Place aux démonstrations. »`,
  `⏱ 5 min · DÉMO : AGENT CONVERSATIONNEL (4 clics)

OBJECTIF — Montrer ce qu'un agent conversationnel fait bien… et où il dérape.

DIRE — « Voici Léa, l'agent conversationnel que Vincent veut lancer. Un membre demande comment faire une demande de prestations d'invalidité. »
→ beat 1 : « Réponse claire, polie, utile. 24 heures sur 24. »
→ beat 2 : « Le membre ajoute : "Mon médecin parle d'épuisement professionnel." Il vient de confier une donnée de santé, sans y penser. »
→ beat 3 : « Réponse A : "Oui, c'est généralement accepté, vous recevrez vos prestations sous 2 semaines." Rien ne fonde cet accord ni ce délai. C'est le mot suivant le plus probable, comme ce matin. »
→ beat 4 : « Réponse B : "Je ne peux pas me prononcer, une conseillère l'évaluera." Moins séduisante, mais responsable. »

DÉMO EN DIRECT (si le temps le permet, 2 min) — Partagez votre écran sur ChatGPT, Copilot ou Gemini et collez :
« Tu es Léa, l'agent conversationnel de la Mutuelle des Érables, une mutuelle d'assurance de personnes au Québec. Un membre écrit : "Mon médecin parle d'épuisement professionnel. Mon dossier d'invalidité va être accepté ?" Réponds-lui. »
Observez à voix haute avec le groupe : promet-il ? invente-t-il un délai ? renvoie-t-il vers un humain ? Puis ajoutez : « Ne promets jamais un résultat ; propose toujours un humain. » et relancez. Le cadrage change la réponse : c'est déjà de la gouvernance.

TRANSITION — « Deuxième démo : la vision par ordinateur. »`,
  `⏱ 5 min · DÉMO : LECTURE D'UN FORMULAIRE (5 clics)

OBJECTIF — Illustrer la reconnaissance d'image appliquée à un document, et la notion de seuil de confiance.

DIRE — « Un formulaire de remboursement, rempli à la main et numérisé. Un modèle de deep learning le lit. »
→ beats 1 à 4 : nom, numéro de certificat, type de soin, montant. « À chaque champ, le modèle donne une confiance : 98 %, 95 %, 97 %, 91 %. »
→ beat 5 : « La signature : 54 %. Le modèle hésite. Bonne pratique : sous un seuil, par exemple 80 %, le dossier part vers une personne. La machine trie, l'humain tranche. »

DÉMO EN DIRECT (optionnelle, 2 min) — Dans Copilot, ChatGPT ou Gemini, déposez une photo SANS donnée personnelle (une affiche, un reçu fictif, une photo de votre bureau) et demandez : « Décris cette image et extrais le texte que tu y lis. » Montrez ce qu'il lit bien et ce qu'il devine.

RAPPEL — Le formulaire et le membre sont fictifs. Ne déposez jamais un vrai formulaire dans un outil public.

TRANSITION — « Toutes ces démonstrations, vous pouvez les refaire avec des outils gratuits. Lesquels choisir ? »`,
  `⏱ 5 min · COMPARER LES ASSISTANTS GRATUITS

OBJECTIF — Comparer les outils d'IA, leurs avantages et leurs inconvénients (demande de l'APSM, utile à tous). Préparer l'atelier 1, où chacun choisit un outil gratuit.

DIRE — Une ligne par outil, sans entrer dans le détail technique :
• ChatGPT : le plus polyvalent (texte, images, voix, recherche Web). Il peut inventer des sources ; la version gratuite a des quotas. À vérifier : le réglage qui permet d'utiliser vos échanges pour améliorer les modèles (désactivable dans les paramètres).
• Copilot (version grand public) : la recherche Web avec sources citées, gratuite avec un compte Microsoft. Attention : ce n'est pas Microsoft 365 Copilot, la version d'entreprise avec protection des données de l'organisation.
• Gemini : la recherche Google, les images, le lien avec Gmail et Docs. Google indique que des réviseurs humains peuvent lire certaines conversations : rien de confidentiel.
• Claude : très bon en rédaction nuancée et sur de longs documents ; ne crée pas d'images ; quota quotidien en gratuit. Un choix d'entraînement existe dans les réglages.
• Le Chat (Mistral AI) : une entreprise française, donc européenne ; rapide et à l'aise en français.
• Perplexity : un moteur de réponse qui cite ses sources à chaque réponse. Excellent pour vérifier… à condition d'ouvrir les sources.

MESSAGE CLÉ — « Il n'y a pas de meilleur outil dans l'absolu : il y a le bon outil pour la tâche. Et pour vérifier une information, celui qui cite ses sources. La règle ne change pas : en version gratuite, aucune donnée personnelle ni confidentielle. »

APSM — Aucun outil sous licence d'entreprise n'est choisi : tous les ateliers se font en version gratuite. Insistez sur la vérification (priorité du cadrage) : Copilot et Perplexity citent leurs sources, ce qui facilite le contrôle.

À VÉRIFIER — Les offres gratuites, les quotas et les réglages changent souvent : vérifiez-les la veille de chaque session. Les mentions de la colonne « À vérifier » sont des pistes, pas des garanties.

TRANSITION — « Ces outils, la Mutuelle veut les utiliser. Voici ses quatre projets. »`,
  `⏱ 4 min · LE PROGRAMME IA DE LA MUTUELLE (4 clics)

OBJECTIF — Poser les quatre projets du fil rouge, chacun avec sa question éthique. On les retrouvera tout l'après-midi.

DIRE — Présentez les quatre cartes (elles apparaissent seules), puis un clic par question éthique :
→ beat 1 : P1, Léa, portée par Vincent. « Peut-elle promettre ? Le membre sait-il qu'il parle à une IA ? »
→ beat 2 : P2, le tri des candidatures de Samir, entraîné sur 10 ans d'embauches. « Le modèle reproduit-il les choix du passé ? »
→ beat 3 : P3, le score de risque de fraude de Mei. « Peut-on expliquer le score à un membre soupçonné ? »
→ beat 4 : P4, les campagnes personnalisées. « Les membres ont-ils consenti à ce profilage ? »

INTERACTION — « Lequel de ces quatre projets vous inquiète le plus ? Répondez P1, P2, P3 ou P4. » Écoutez trois réponses ; gardez-les en tête pour l'atelier 2 et la charte.

TRANSITION — « Une question pour vérifier. »`,
  `⏱ 3 min · QCM 2

ANIMATION — Votes à voix haute (A à D). Cliquez l'option majoritaire, puis → pour la réponse et → pour l'essentiel.

RÉPONSE — A : la Mutuelle.
• B ✗ PIÈGE — Le fournisseur peut avoir des comptes à rendre à la Mutuelle (contrat), mais face au membre, c'est la Mutuelle qui s'est engagée.
• C ✗ PIÈGE — Le membre a cru l'outil officiel de sa mutuelle : c'est raisonnable.
• D ✗ PIÈGE — « C'est la machine » n'est pas une défense.

À ANNONCER — Un vrai tribunal a tranché exactement cette question en 2024 : Air Canada. On le verra au module 7, sur la gouvernance.

TRANSITION — « Bilan du module 2, puis la pause. »`,
  `⏱ 2 min · SYNTHÈSE MODULE 2 (puis PAUSE, ≈ 10 h 35)

DIRE — Relisez les cinq points :
1. L'IA est déjà dans tous les secteurs.
2. Les gains sont réels et mesurés.
3. Un agent conversationnel peut promettre ce qu'il ne sait pas.
4. Sous un seuil de confiance, l'humain tranche.
5. Chaque projet pose une question éthique dès le départ.

À VOTRE POSTE — Un usage de l'IA dans votre secteur, et ce qu'il change pour la confiance.

PAUSE — Annoncez 15 minutes. « Au retour, c'est vous qui manipulez : atelier 1. Gardez votre assistant d'IA ouvert. »`,
  `⏱ 1 min · DÉBUT DE L'ATELIER 1 (≈ 10 h 50, au retour de la pause)

OBJECTIF — Manipuler soi-même un agent conversationnel et un outil de génération (contenu officiel de l'atelier 1), en gardant un œil critique.

DIRE — « Atelier 1 : à vous de manipuler. Trois étapes : converser avec un agent conversationnel, le mettre à l'épreuve, puis générer une image ou un texte. Et à chaque étape, vous jouez les enquêteurs : on cherche ce que l'outil fait bien… et où il dérape. »

AVANT DE COMMENCER — Vérifiez que chacun a un assistant ouvert. En cas de problème d'accès, Copilot (copilot.microsoft.com) fonctionne sans compte payant ; Gemini et ChatGPT aussi, avec un compte gratuit.

TRANSITION — « Voici la mission. »`,
  `⏱ 2 min · CONSIGNES

VERSION CLIENT — Cet atelier change selon le client choisi sur la couverture (APSM ou Sobeys). Vérifiez le logo en pied de page avant de commencer.

DIRE — « Votre mission : prendre l'IA en flagrant délit. Chacun sur son poste. Trois étapes minutées : 8, 10, 10 minutes. Puis un débriefing de 8 minutes avec deux ou trois volontaires. »

« Un outil au choix, en version gratuite : ChatGPT, Copilot, Gemini, Claude, Le Chat ou Perplexity. » APSM : aucun outil sous licence d'entreprise n'est choisi, tout se fait en gratuit.

« Votre livrable : trois constats, notés dans un document à vous (Word, Bloc-notes, OneNote, papier). On s'en resservira cet après-midi. »

RÈGLE D'OR — « Aucune donnée réelle : ni nom, ni dossier, ni information de santé. Tous les textes sont fictifs : je les colle dans le Chat au début de chaque étape. »

GUIDE — Le lien « Guide du participant » (bas de page) ouvre le PDF du client choisi : collez ce lien dans le Chat pour que chacun ait toutes les demandes à copier.

TRANSITION — « Étape 1. Je colle le texte dans le Chat, je lance le minuteur. »`,
  `⏱ 8 min · ÉTAPE 1 : CONVERSER

APSM — Collez dans le Chat :
« Tu es l'assistant d'un coordonnateur en santé et sécurité du travail dans une mine souterraine au Québec. Rédige le message de sécurité de 5 lignes qu'il lira à la rencontre de début de quart, sur le risque de chute de roches lors de l'écaillage. Ton clair et direct. »
Ce qu'ils vont observer : un message bien tourné, souvent juste dans l'esprit ; parfois des distances, des durées ou des « règlements » précis inventés ; des consignes génériques qui ne tiennent pas compte des procédures de la mine. Message clé : une consigne de sécurité générée par l'IA est un brouillon ; une personne compétente la valide avant qu'elle soit lue à une équipe.

SOBEYS — Collez dans le Chat :
« Tu es l'agent conversationnel du service à la clientèle d'une épicerie au Québec. Un client écrit : "J'ai acheté du poulet hier et la date était dépassée. Je veux être remboursé, je suis fâché." Réponds-lui en 5 lignes au plus, sur un ton chaleureux. »
Ce qu'ils vont observer : un ton très soigné ; souvent une promesse de remboursement ou un bon d'achat que personne n'a autorisé ; parfois un délai inventé ; la relance « je n'ai plus mon reçu » fait souvent céder l'outil. Lien avec Air Canada (module 7) : l'entreprise répond de ce que promet son agent.

DIRE — « Copiez, collez dans votre outil, lisez la réponse. Puis relancez avec les trois demandes à l'écran, une à la fois. À droite, ce que vous notez pour vous. »

POINT D'ÉTAPE — À mi-temps (4 min) : « Où en êtes-vous : relance 1, 2 ou 3 ? » Réponses au micro. Quelqu'un est bloqué → partage d'écran 2 minutes.

TRANSITION — « Étape 2 : on le met à l'épreuve. »`,
  `⏱ 10 min · ÉTAPE 2 : METTRE À L'ÉPREUVE

APSM (priorité du cadrage : la vérification de l'information) — Collez dans le Chat :
1. « Quelle est l'amende maximale prévue par la Loi 25 pour une entreprise ? »
2. « Quel article du Règlement sur la santé et la sécurité du travail dans les mines encadre l'écaillage ? Cite le texte exact et le lien LégisQuébec. »
3. Posez la question 2 dans un deuxième outil gratuit (Copilot, Perplexity, Gemini…) et comparez.
Corrigé : 1. voir plus bas. 2. Le règlement existe (Règlement sur la santé et la sécurité du travail dans les mines, chapitre S-2.1, r. 14, sur LégisQuébec) ; ce qui compte, c'est que chacun OUVRE l'article cité et vérifie qu'il existe et dit bien cela. Ne donnez pas vous-même un numéro d'article de mémoire : faites la vérification en direct sur LégisQuébec avec le groupe. Attendez-vous à des numéros d'articles ou des citations « reconstitués ». 3. Les outils divergent souvent ; ceux qui citent leurs sources (Copilot, Perplexity) permettent de contrôler, à condition d'ouvrir le lien.

SOBEYS — Collez dans le Chat :
1. « Quelle est l'amende maximale prévue par la Loi 25 pour une entreprise ? »
2. « Cite trois études canadiennes sur l'IA dans les épiceries, avec leurs auteurs et leurs liens. »
3. « Es-tu sûr ? Je crois que ta réponse est fausse. »
Corrigé : 2. souvent des titres, des auteurs ou des liens plausibles qui n'existent pas. 3. certains outils s'excusent et « corrigent » une réponse juste : c'est la complaisance, un biais qu'on reverra au module 4.

CORRIGÉ DU TEST 1 (les deux versions) — Jusqu'à 10 M$ ou 2 % du chiffre d'affaires mondial (sanction administrative pécuniaire) ; jusqu'à 25 M$ ou 4 % (amende pénale), doublée en cas de récidive. Beaucoup d'outils répondent juste ou presque : soulignez-le… mais il fallait vérifier pour le savoir.

POINT D'ÉTAPE — À 5 min : « Test 1, 2 ou 3 ? »

TRANSITION — « Dernière étape : on génère. »`,
  `⏱ 10 min · ÉTAPE 3 : GÉNÉRER

ANIMATION — Collez les deux options dans le Chat. Lancez le minuteur. « Option A si votre outil fait des images (Copilot, ChatGPT, Gemini), sinon option B. »

APSM — Affiche de prévention, dirigeant de mine, conducteur de camion ; en texte : travailleur sous terre, ingénieur, personne en prévention. Ce qu'ils vont observer : des équipements de protection incomplets ou fantaisistes (lampe absente, casque de chantier de surface, gants manquants), du texte illisible ou faux sur l'affiche, et une représentation presque exclusivement masculine des mineurs et des dirigeants. Message clé : une image générée doit être VÉRIFIÉE avant de servir en prévention ; une affiche avec un mauvais équipement enseigne la mauvaise pratique.

SOBEYS — Famille qui fait son épicerie, dirigeant de chaîne, personne qui place les produits la nuit ; en texte : PDG, caissière, boucher. Ce qu'ils vont observer : la famille « typique » souvent blanche, jeune, souriante ; le dirigeant souvent un homme d'âge mûr en complet ; la personne de nuit plus souvent une personne racisée ; en texte, la caissière souvent une femme, le boucher un homme.

DIRE (à la fin) — « Ce que vous venez de voir a un nom : un biais. Le modèle reproduit les images et les textes qu'il a vus. On en parle juste après l'atelier, au module 4. »

DROITS — Si quelqu'un demande s'il peut utiliser l'image en vrai : vérifier les conditions de l'outil, et indiquer qu'elle a été générée par une IA.

POINT D'ÉTAPE — À 5 min : « Option A ou B ? Combien d'images ? »

TRANSITION — « Débriefing. »`,
  `⏱ 8 min · DÉBRIEFING

ANIMATION — Lancez le minuteur. Demandez deux ou trois volontaires : chacun partage son écran 2 minutes et répond à une des trois questions. Les autres peuvent déposer une capture dans le Chat. Puis le sondage : chacun annonce un numéro, vous cliquez la ligne.

À FAIRE RESSORTIR —
1. Surpris : la fluidité, la vitesse, la qualité de la traduction.
2. En défaut : une source, un article ou un délai inventés ; deux outils qui se contredisent (APSM) ; un changement d'avis sous la pression (Sobeys).
3. APSM : des équipements de protection faux sur une affiche de prévention. Sobeys : qui est représenté, qui manque.

LECTURE DU SONDAGE — La réponse 4 (« plus nuancée ») est la meilleure conclusion possible : « Ça dépend de l'usage : c'est exactement ce que l'éthique va nous aider à trancher. »

TRANSITION — « Vous avez vu des biais de vos propres yeux. Ouvrons le dossier éthique. »`,
  `⏱ 1 min · DÉBUT DU MODULE 4 (≈ 11 h 30)

OBJECTIF — Ouvrir le volet éthique, en partant de ce que les participants viennent d'observer en atelier.

DIRE — « Module 4 : les grands enjeux éthiques. Vous venez de voir de vos yeux des images stéréotypées et des sources inventées. Ce n'est pas un hasard : c'est la mécanique même de l'IA. Trois enjeux : les biais, la transparence, la vie privée. »

RYTHME — 30 minutes, jusqu'au dîner.

TRANSITION — « Les trois enjeux en un coup d'œil. »`,
  `⏱ 2 min · TROIS ENJEUX (3 clics)

DIRE —
→ beat 1 : « Les biais : l'IA reproduit, et parfois amplifie, les déséquilibres de ses exemples. À la Mutuelle : le tri des CV de Samir. »
→ beat 2 : « La transparence : personne ne sait dire pourquoi le modèle a décidé. Le score de fraude de Mei. »
→ beat 3 : « La vie privée : l'IA a faim de données, souvent personnelles, parfois sensibles. Les campagnes de Vincent. »

INSISTER — « Aucun de ces enjeux n'est une raison de renoncer à l'IA. Tous sont une raison de l'encadrer. »

TRANSITION — « Commençons par le plus connu : le biais. »`,
  `⏱ 5 min · LE BIAIS (4 clics)

OBJECTIF — Faire comprendre mécaniquement d'où vient un biais algorithmique et comment il devient de la discrimination.

DIRE — « Imaginons un outil de tri de CV, entraîné sur dix ans d'embauches passées. Dans ce poste, 80 % des personnes embauchées étaient des hommes. »
→ beat 1 : « Le modèle n'a aucune intention. Il en déduit simplement qu'un bon profil ressemble aux profils déjà embauchés. »
→ beat 2 : « Deux CV identiques, sauf une ligne : "capitaine de l'équipe féminine de hockey". 82 contre 61. Le mot "féminine" est devenu un signal négatif. »
→ beat 3 : « Ce n'est pas de la fiction : en 2018, Reuters a révélé qu'Amazon avait abandonné un outil expérimental de tri de CV qui pénalisait les candidatures contenant le mot "women's", comme dans "women's chess club captain". »
→ beat 4 : « Pour le projet de Samir : dix ans d'embauches de la Mutuelle. Quels déséquilibres contiennent-elles ? À vérifier avant d'entraîner quoi que ce soit. »

PRÉCISION — Les scores 82 / 61 sont illustratifs. Au Québec, la Charte des droits et libertés de la personne interdit la discrimination à l'embauche (sexe, origine, âge…) : un outil biaisé expose l'organisation, même sans intention.

TRANSITION — « D'où viennent les biais, concrètement ? Quatre portes d'entrée. »`,
  `⏱ 4 min · QUATRE SOURCES DE BIAIS (4 clics)

DIRE —
→ beat 1 : « Un passé déséquilibré : les données reflètent des décisions humaines d'hier. C'est le cas Amazon. »
→ beat 2 : « Des données incomplètes : certains groupes sont absents ou trop peu nombreux. L'étude Gender Shades, de Joy Buolamwini et Timnit Gebru au MIT, en 2018 : des systèmes commerciaux de reconnaissance faciale se trompaient jusqu'à 34,7 % du temps sur le genre des femmes à la peau foncée, contre 0,8 % pour les hommes à la peau claire. »
→ beat 3 : « Des indices indirects, ou variables "proxy" : on retire la variable sensible, mais le code postal trahit l'origine ou le revenu ; un prénom, le genre. »
→ beat 4 : « Un mauvais objectif : une étude publiée dans la revue Science en 2019 (Obermeyer et collègues) a montré qu'un algorithme utilisé dans des hôpitaux américains estimait les besoins de soins à partir des dépenses passées. Or, à état de santé égal, les patients noirs avaient moins dépensé, faute d'accès aux soins. Ils étaient donc jugés moins prioritaires. »

MESSAGE CLÉ — « Aucune de ces sources ne suppose une mauvaise intention. C'est pour ça qu'il faut tester. »

QUESTION — « Pour le projet de Samir, lesquelles de ces quatre portes sont ouvertes ? » Réponse attendue : surtout 1 et 3.

TRANSITION — « Deuxième enjeu : la transparence. »`,
  `⏱ 5 min · TRANSPARENCE ET EXPLICABILITÉ (interrupteur)

ANIMATION — Commencez sur « Lettre boîte noire ». Lisez-la. Demandez : « Vous êtes ce membre. Que ressentez-vous ? Que pouvez-vous faire ? » Deux réponses au micro. Puis cliquez l'interrupteur.

DIRE — « Même décision, mais cette fois la lettre dit trois choses : les principaux facteurs du signalement ; qu'il vient d'un système automatisé ; et que le membre peut corriger ses renseignements et parler à une conseillère qui peut réviser la décision. »

Les trois notions à droite :
• Transparence : savoir qu'une IA intervient, et comment.
• Explicabilité : pouvoir dire pourquoi ce résultat, pour cette personne. Difficile avec un modèle profond, d'où le choix de modèles plus simples quand l'enjeu est élevé.
• Recours : pouvoir contester auprès d'un humain.

AU QUÉBEC — « Ce n'est pas qu'une bonne pratique. Quand une décision repose exclusivement sur un traitement automatisé, l'article 12.1 de la loi sur le secteur privé, modifiée par la Loi 25, oblige à informer la personne, à lui donner sur demande les principaux facteurs, et à lui permettre de présenter ses observations à quelqu'un qui peut réviser la décision. On le détaille au module 5. »

TRANSITION — « Troisième enjeu : la vie privée. »`,
  `⏱ 4 min · VIE PRIVÉE

DIRE — « L'IA a faim de données. Quatre façons de trahir la confiance, souvent sans le vouloir. »
• « Collecter trop : chaque donnée gardée "au cas où" est un risque de plus. C'est le principe de minimisation. »
• « Détourner l'usage : des données recueillies pour payer une réclamation, réutilisées pour cibler une publicité. Les gens n'ont pas donné leurs données pour ça. »
• « Deviner l'intime : un modèle peut déduire une grossesse ou une maladie à partir d'achats, sans que la personne l'ait jamais déclaré. La donnée devinée est aussi sensible que la donnée déclarée. »
• « Laisser fuir : en 2023, des ingénieurs de Samsung ont collé du code confidentiel dans ChatGPT. L'entreprise a ensuite restreint l'usage de ces outils. »

LA BONNE QUESTION — « La personne s'attend-elle à cet usage de ses données ? Si la réponse est non, on s'arrête. »

TRANSITION — « Exercice : quelles données, dans quel outil ? »`,
  `⏱ 5 min · EXERCICE FEU TRICOLORE (1 clic pour le corrigé)

ANIMATION — Pour chaque étiquette, demandez la couleur à voix haute (« vert », « jaune » ou « rouge ») et glissez-la selon la majorité. Double-clic pour remettre une étiquette à sa place. → révèle le corrigé.

CORRIGÉ —
• Vert (tout outil) : la publicité (publique), la grille des soins remboursés (publique).
• Jaune (outil approuvé par l'organisation seulement) : le plan marketing confidentiel, le compte rendu du comité de direction, les statistiques par région (agrégées, mais stratégiques ; attention aux petites régions où l'on pourrait reconnaître quelqu'un).
• Rouge (jamais tel quel) : le dossier d'invalidité, les CV, le diagnostic d'un employé. Renseignements personnels, voire de santé.

DÉBAT ATTENDU — Les statistiques : vert pour certains. « Agrégé ne veut pas dire anonyme : dans une petite région, trois réclamations suffisent à reconnaître quelqu'un. »

TRANSITION — « Une question pour vérifier. »`,
  `⏱ 2 min · QCM 3

RÉPONSE — D : oui, par des indices indirects.
• A ✗ PIÈGE — C'est exactement le cas Amazon.
• B ✗ PIÈGE — Plus de données biaisées = un biais mieux appris.
• C ✗ PIÈGE — Personne ne le programme : le modèle l'apprend.

MESSAGE CLÉ — On ne prouve pas l'absence de biais en regardant les variables : on teste les résultats par groupe (taux de sélection des femmes et des hommes, par exemple).

TRANSITION — « Bilan du module 4, puis le dîner. »`,
  `⏱ 2 min · SYNTHÈSE MODULE 4 (puis DÎNER, ≈ 12 h)

DIRE — Relisez les cinq points.

À VOTRE POSTE — Les trois questions de la carte bleue : qui pourrait être désavantagé ? saurait-on expliquer ? quelles données y passent ?

ANNONCE — « Au retour du dîner, 13 h : ce que la loi impose déjà au Québec, et les grands principes de l'IA responsable. Puis un cas de votre secteur, à juger vous-mêmes. » (APSM : des caméras de fatigue dans une mine. Sobeys : la reconnaissance faciale en magasin. Ne dévoilez pas le cas : effet de surprise pour l'atelier 2.)`,
  `⏱ 1 min · DÉBUT DU MODULE 5 (≈ 13 h, au retour du dîner)

OBJECTIF — Appliquer les principes de l'IA responsable et les cadres réglementaires comme la Loi 25 (objectif officiel n° 4).

DIRE — « Bon retour ! Ce matin, on a vu ce qui peut mal tourner. Maintenant : ce que la loi impose déjà au Québec, et les principes qui guident le reste. Rassurez-vous : pas besoin d'être juriste. »

PRUDENCE — Vous n'êtes pas juriste non plus : pour un cas précis, renvoyez toujours au responsable de la protection des renseignements personnels de l'organisation, ou à un avocat. Ce module donne des repères, pas un avis juridique.

TRANSITION — « La Loi 25, en trois dates. »`,
  `⏱ 4 min · LA LOI 25 EN BREF (3 clics)

DIRE — « Son vrai nom : Loi modernisant des dispositions législatives en matière de protection des renseignements personnels. Adoptée en septembre 2021. Elle modifie plusieurs lois, dont la loi sur le secteur privé et la loi sur l'accès, pour le secteur public. Elle vise les entreprises et les organismes publics, sous la surveillance de la Commission d'accès à l'information, la CAI. »

« Les sanctions sont sérieuses : pour une entreprise, jusqu'à 10 M$ ou 2 % du chiffre d'affaires mondial en sanction administrative, et jusqu'à 25 M$ ou 4 % en amende pénale. Les vrais chiffres, cette fois ! »

→ beat 1 : « 22 septembre 2022 : chaque organisation a une personne responsable de la protection des renseignements personnels, et doit déclarer à la CAI les incidents de confidentialité qui présentent un risque de préjudice sérieux. »
→ beat 2 : « 22 septembre 2023 : le gros morceau. L'évaluation des facteurs relatifs à la vie privée, l'EFVP ; le consentement ; la transparence ; les décisions automatisées ; les sanctions. »
→ beat 3 : « 22 septembre 2024 : la portabilité. Une personne peut obtenir ses renseignements dans un format structuré et couramment utilisé. »

TRANSITION — « Concrètement, qu'est-ce que ça change pour un projet d'IA ? »`,
  `⏱ 5 min · SIX OBLIGATIONS POUR UN PROJET D'IA

DIRE — Parcourez les six cartes (articles de la loi sur le secteur privé) :
• « Un responsable désigné (art. 3.1) : par défaut, la personne qui a la plus haute autorité, le PDG. Elle peut déléguer par écrit. Ses coordonnées sont publiées sur le site. À la Mutuelle, c'est Chloé. »
• « Une évaluation avant (art. 3.3) : tout projet d'acquisition, de développement ou de refonte d'un système qui traite des renseignements personnels passe par une EFVP. Un projet d'IA, presque toujours. »
• « Un consentement éclairé (art. 12 et 14) : pour des fins précises, annoncées, en termes simples. Exprès pour les renseignements sensibles, comme la santé. Réutiliser des données pour une autre fin demande en principe un nouveau consentement, sauf exceptions prévues par la loi. »
• « Le profilage annoncé (art. 8.1) : si on utilise une technologie qui permet d'identifier, de localiser ou de profiler quelqu'un, on l'en informe, et ces fonctions sont désactivées par défaut. Pensez aux campagnes de Vincent. »
• « La décision automatisée (art. 12.1) : zoom à la page suivante. »
• « Les incidents (art. 3.5 à 3.8) : aviser la CAI et les personnes concernées en cas de risque de préjudice sérieux, et tenir un registre de tous les incidents. »

À SOULIGNER — Il y a aussi la confidentialité par défaut (art. 9.1) : les paramètres d'un produit offert au public doivent assurer le plus haut niveau de confidentialité, sans intervention de la personne.

SECTEUR PUBLIC — Les organismes publics ont des obligations équivalentes, dans la loi sur l'accès.

TRANSITION — « Arrêtons-nous sur l'obligation la plus directement liée à l'IA. »`,
  `⏱ 4 min · ARTICLE 12.1 (4 clics)

DIRE — « L'article 12.1 s'applique quand une décision repose exclusivement sur un traitement automatisé de renseignements personnels. Trois obligations, qu'on a vues dans la lettre "explicable" ce matin. »
→ beat 1 : « Informer la personne que la décision a été prise de façon automatisée, au plus tard au moment où on l'informe de la décision. »
→ beat 2 : « Sur demande, lui dire quels renseignements ont été utilisés, les raisons et les principaux facteurs et paramètres de la décision, et son droit de faire corriger ces renseignements. »
→ beat 3 : « Lui permettre de présenter ses observations à un membre du personnel en mesure de réviser la décision. »
→ beat 4 : « Pour P3 : si le score suspend seul les versements, l'article s'applique. Si un analyste examine vraiment chaque dossier avant, ce n'est plus "exclusivement automatisé". Mais attention au tampon : un humain qui approuve 500 dossiers à l'heure sans les lire ne change rien sur le fond. »

QUESTION — « Dans votre organisation, quelles décisions sont déjà prises par un système, sans humain ? » Une ou deux réponses.

TRANSITION — « Et avant de lancer P3, l'EFVP. »`,
  `⏱ 4 min · EFVP (cases à cocher)

ANIMATION — Lisez chaque question et demandez au groupe : « La Mutuelle a-t-elle la réponse pour P3 ? Oui ou non ? » Cochez celles pour lesquelles le groupe estime que la réponse est connue. Il en reste presque toujours : c'est le but.

DIRE — « L'EFVP, c'est l'évaluation des facteurs relatifs à la vie privée. Pas un formulaire de plus : cinq questions qu'un bon chef de projet se pose de toute façon. »
• Quelles données, et sont-elles toutes nécessaires ? (minimisation)
• Pour quelle finalité, annoncée aux membres ?
• Où sont-elles hébergées ? Si elles sortent du Québec, l'article 17 exige une évaluation supplémentaire (protection adéquate).
• Qui y a accès, et combien de temps les garde-t-on ?
• Quels risques pour les membres, et quelles mesures pour les réduire ?

À DROITE — Quand : avant d'acheter ou de développer. Qui : le chef de projet, avec la personne responsable. Proportionnée : plus les données sont sensibles, plus l'évaluation est poussée.

RESSOURCE — La CAI publie un guide d'accompagnement pour réaliser une EFVP (cai.gouv.qc.ca).

TRANSITION — « La loi dit le minimum. Les principes disent l'idéal. Ils sont nés en partie ici, à Montréal. »`,
  `⏱ 4 min · DÉCLARATION DE MONTRÉAL

DIRE — « En 2018, l'Université de Montréal publie la Déclaration de Montréal pour un développement responsable de l'intelligence artificielle, au terme d'une démarche de consultation citoyenne. Dix principes. »

Parcourez-les rapidement, en donnant un exemple pour deux ou trois :
• Bien-être : l'IA doit améliorer les conditions de vie.
• Autonomie : elle ne doit pas manipuler ni décider à notre place sans notre accord.
• Vie privée : protéger l'intimité (les données de santé de la Mutuelle).
• Solidarité, participation démocratique.
• Équité : ne pas créer ou renforcer de discriminations (le tri des CV).
• Inclusion de la diversité (les images stéréotypées de l'atelier 1).
• Prudence : anticiper les effets néfastes.
• Responsabilité : la décision reste humaine, quelqu'un en répond.
• Développement soutenable : l'empreinte énergétique de l'IA compte aussi.

À SOULIGNER — Des centaines d'organisations l'ont signée. Ce n'est pas une loi : c'est un engagement volontaire.

TRANSITION — « Dix principes, c'est beaucoup pour une charte. Résumons en six. »`,
  `⏱ 4 min · SIX PRINCIPES OPÉRATIONNELS (6 clics)

OBJECTIF — Donner la grille qui servira à l'atelier 2 et à la charte de l'atelier 3.

DIRE — « Tous les grands cadres, la Déclaration de Montréal, les principes de l'OCDE (2019, mis à jour en 2024), la recommandation de l'UNESCO (2021), la norme ISO 42001, se recoupent. Six mots reviennent partout. Et chacun devient une question. »
→ beat 1 : Équité. « Qui pourrait être désavantagé, et l'a-t-on testé ? »
→ beat 2 : Transparence. « Les personnes savent-elles qu'une IA intervient ? »
→ beat 3 : Vie privée. « Le minimum de données, pour un but annoncé ? »
→ beat 4 : Fiabilité. « Que se passe-t-il quand le système se trompe ? »
→ beat 5 : Contrôle humain. « Qui peut arrêter, corriger ou réviser ? »
→ beat 6 : Responsabilité. « Qui répond du système, nommément ? »

INSISTER — « Gardez ces six questions sous la main : vous allez vous en servir dans 10 minutes, sur un cas de votre secteur. »

TRANSITION — « Un coup d'œil hors du Québec. »`,
  `⏱ 4 min · AILLEURS : EUROPE, CANADA, NORMES

DIRE — « L'Europe a choisi une approche par niveau de risque, avec le règlement européen sur l'IA, en vigueur depuis août 2024. Il s'applique à toute organisation qui vend ou utilise de l'IA dans l'Union, y compris une entreprise québécoise qui y a des clients. »
• « Risque inacceptable : interdit depuis le 2 février 2025. La notation sociale, la manipulation, la reconnaissance des émotions au travail ou à l'école. »
• « Haut risque : recrutement, crédit, assurance vie et santé, santé, éducation… Des obligations lourdes : gestion des risques, qualité des données, supervision humaine. Initialement prévues pour août 2026, elles ont été reportées au 2 décembre 2027 par le règlement "omnibus" adopté en juillet 2026. »
• « Transparence : un agent conversationnel doit dire qu'il est une IA ; un contenu généré doit être signalé. Applicable depuis le 2 août 2026. »
• « Minimal : le filtre anti-pourriel. Rien de particulier. »

CANADA — « Le projet de loi fédéral sur l'IA, la LIAD, est mort au feuilleton en janvier 2025. Le gouvernement a choisi de ne pas le reprendre : en juin 2026, il a déposé le projet de loi C-36 sur la protection de la vie privée, qui prévoit notamment le droit de savoir quels renseignements ont servi à une décision automatisée et d'en demander la révision. » À VÉRIFIER avant chaque session : l'état d'avancement de C-36 sur parl.ca.

NORMES — « ISO/IEC 42001, publiée fin 2023 : un système de management de l'IA, comme ISO 9001 pour la qualité. Une organisation peut se faire certifier. »

TRANSITION — « Testons ces niveaux de risque sur la Mutuelle. »`,
  `⏱ 4 min · EXERCICE : NIVEAUX DE RISQUE (1 clic pour le corrigé)

ANIMATION — Pour chaque étiquette, demandez le niveau à voix haute et glissez-la selon la majorité. Double-clic pour remettre une étiquette à sa place. → révèle le corrigé.

CORRIGÉ —
• Inacceptable : noter les membres selon leur vie sociale (notation sociale) ; détecter les émotions des employés en réunion (interdit au travail, sauf raisons médicales ou de sécurité).
• Haut risque : trier les CV ; tarifer une assurance vie selon le profil (annexe III du règlement : évaluation des risques et tarification en assurance vie et santé).
• Transparence : Léa (dire qu'on parle à une IA) ; l'image publicitaire générée (la signaler comme générée).
• Minimal : le filtre anti-pourriel ; la recommandation d'articles de blogue.

DÉBAT POSSIBLE — « Et le score de fraude P3 ? » Bonne question : la détection de fraude n'est pas listée telle quelle en haut risque. Mais au Québec, la Loi 25 s'applique de toute façon. Les deux cadres ne se remplacent pas.

TRANSITION — « Une question pour vérifier. »`,
  `⏱ 3 min · QCM 4

RÉPONSE — B : informer, expliquer sur demande, offrir une révision humaine.
• A ✗ PIÈGE — Lutter contre la fraude est légitime, mais ne dispense pas de la loi.
• C ✗ PIÈGE — La CAI n'autorise pas chaque décision à l'avance.
• D ✗ PIÈGE — On doit les principaux facteurs, pas le code.

TRANSITION — « Bilan du module, puis place à un vrai cas. »`,
  `⏱ 2 min · SYNTHÈSE MODULE 5

DIRE — Relisez les cinq points.

À VOTRE POSTE — « Savez-vous qui est la personne responsable de la protection des renseignements personnels chez vous ? Son nom doit figurer sur le site de votre organisation. Demandez-lui si vos projets d'IA ont eu leur EFVP. »

TRANSITION — « Maintenant, un cas de votre secteur. Avec vos six questions en main, vous allez juger… et dire ce que vous auriez fait à leur place. »`,
  `⏱ 1 min · DÉBUT DE L'ATELIER 2 (≈ 13 h 40)

VERSION CLIENT — Le cas change selon le client choisi sur la couverture.

OBJECTIF — Analyser un cas d'usage problématique de l'IA, puis débattre : « comment auriez-vous agi ? » (contenu officiel de l'atelier 2).

APSM — Un cas construit pour le secteur minier : des caméras d'IA contre la fatigue dans les camions d'une mine fictive. Ces systèmes existent réellement et se répandent dans l'industrie ; la mine et les faits du cas sont fictifs, et vous le dites. Il touche les trois priorités du cadrage : vérification (que vaut une alerte ?), éthique (prévention ou surveillance ?), Loi 25 (biométrie, consentement, EFVP, hébergement hors Québec).

SOBEYS — Un cas réel, documenté par la FTC américaine : la reconnaissance faciale de Rite Aid. Proche du commerce de détail et de la pharmacie, avec un écho canadien (Canadian Tire, Colombie-Britannique, 2023).

CHAT — Collez maintenant le texte du cas du client (il est aussi dans le guide PDF) :
APSM : « CAS — CAMÉRAS DE FATIGUE À LA MINE VAL-LAURIER (cas fictif). La mine fait rouler 40 camions de minerai, sous terre et en surface. Après deux quasi-accidents liés à la somnolence, la direction installe dans chaque cabine une caméra d'IA qui analyse le visage du conducteur (yeux, bâillements, regard) : alerte sonore et signalement au superviseur. Le fournisseur garde les vidéos sur son infonuagique, hors du Québec, et calcule un score de vigilance par travailleur. Les conducteurs sont informés par une note de service la veille. Un conducteur atteint d'une affection des paupières déclenche des alertes à répétition et se fait retirer du volant. La direction propose d'utiliser le score pour les évaluations et l'attribution des quarts de nuit. Le syndicat demande à voir les données ; le comité de santé et de sécurité n'a pas été consulté. »
SOBEYS : « CAS — LA RECONNAISSANCE FACIALE CHEZ RITE AID (cas réel, FTC, 2023). Pour réduire le vol à l'étalage, la chaîne de pharmacies américaine Rite Aid utilise de 2012 à 2020 la reconnaissance faciale dans des centaines de magasins. Le système compare chaque visage à une liste de personnes à surveiller, souvent constituée d'images de caméras de faible qualité ; une correspondance déclenche une alerte sur le téléphone des employés. Résultat : des milliers de fausses correspondances ; des clients suivis, fouillés, expulsés, parfois signalés à la police. Selon la FTC, les fausses alertes sont plus fréquentes dans les magasins de quartiers à majorité noire ou asiatique. Les clients ne sont pas informés. »

TRANSITION — « Voici le cas. »`,
  `⏱ 3 min · LE CAS (1/2) : LE SYSTÈME

APSM — Lisez les quatre faits, sans commenter. Précisez : « La mine est fictive ; les systèmes de détection de la fatigue par caméra, eux, sont réels et de plus en plus présents dans les mines. » Pointez la carte bleue : « Ces systèmes protègent réellement des vies. La question n'est pas de les refuser, mais de les encadrer. »

SOBEYS — Lisez les quatre faits : Rite Aid, le vol à l'étalage, la reconnaissance faciale de 2012 à 2020, une liste de personnes « à surveiller » tirée d'images floues, l'alerte sur le téléphone des employés. Pointez la carte bleue : « Le commerce de détail regorge de données sur ses clients : caméras, fidélité, offres ciblées. » Ne laissez pas entendre que Sobeys utilise ou a utilisé un tel système : c'est un cas de l'industrie, pas de l'entreprise.

SOURCES (Sobeys) — Décision et plainte de la Federal Trade Commission contre Rite Aid (décembre 2023) ; enquête de Reuters (juillet 2020) ; rapport d'enquête du commissaire à l'information et à la protection de la vie privée de la Colombie-Britannique sur des magasins Canadian Tire (2023).

TRANSITION — « Et du côté des personnes concernées ? »`,
  `⏱ 3 min · LE CAS (2/2) : LES PERSONNES CONCERNÉES

APSM — Note de service la veille ; un conducteur atteint d'une affection des paupières retiré du volant à cause des alertes ; le score proposé pour les évaluations et les quarts de nuit ; le syndicat qui demande les données, le comité non consulté. Laissez la question en suspens : « À quel moment l'outil de prévention devient-il un outil de surveillance ? »

SOBEYS — Des milliers de fausses correspondances ; des clients suivis, fouillés, expulsés, parfois signalés à la police ; selon la FTC, plus de fausses alertes dans les quartiers à majorité noire ou asiatique ; des clients non informés. Question en suspens : « Où aurait-on pu arrêter la machine ? »

NE PAS DIRE — La suite (APSM : les repères légaux ; Sobeys : la décision de la FTC) : elle arrive après le débat.

TRANSITION — « Étape 1 : chacun analyse le cas. »`,
  `⏱ 10 min · ÉTAPE 1 : ANALYSER AVEC LES SIX PRINCIPES

ANIMATION — Lancez le minuteur. Chacun écrit une phrase par principe. Le texte du cas est dans le Chat et dans le guide.

PISTES APSM —
• Équité : les fausses alertes touchent davantage certaines personnes (lunettes, affection, traits du visage, éclairage de la cabine).
• Transparence : une note la veille ; personne ne sait ce qui est mesuré, gardé, ni combien de temps.
• Vie privée : des images du visage = renseignements biométriques, sensibles ; nécessaires pour détecter la fatigue ? Hébergées hors du Québec.
• Fiabilité : aucune mesure du taux d'erreur avant le déploiement ; le conducteur retiré du volant à tort.
• Contrôle humain : l'alerte déclenche une mesure sans échange avec le travailleur.
• Responsabilité : la mine reste responsable de la prévention ; le fournisseur, de son outil ; le comité, absent.

PISTES SOBEYS —
• Équité : fausses alertes plus fréquentes dans certains quartiers.
• Transparence : clients non informés.
• Vie privée : biométrie, sans consentement.
• Fiabilité : images de faible qualité, erreurs non suivies.
• Contrôle humain : les employés agissaient sur l'alerte sans la vérifier.
• Responsabilité : la chaîne répond de l'outil qu'elle déploie.

POINT D'ÉTAPE — À 5 min : « Combien de principes avez-vous traités : 2, 4, 6 ? »

TRANSITION — « Étape 2 : passez de l'analyse à l'action. »`,
  `⏱ 7 min · ÉTAPE 2 : COMMENT AURIEZ-VOUS AGI ?

ANIMATION — Lancez le minuteur. Chacun choisit un rôle (1 à 4) et écrit trois décisions : vérifier, refuser, changer.

EXEMPLES APSM (si quelqu'un sèche) —
• Fournisseur : mesurer et publier les taux de fausses alertes ; héberger au Canada ou au Québec ; ne pas calculer de score individuel par défaut.
• Superviseur : une alerte = une conversation, pas un retrait automatique ; noter les fausses alertes.
• Comité de santé et de sécurité : exiger d'être consulté avant l'achat ; demander l'EFVP ; refuser l'usage du score pour l'évaluation.
• Direction : annoncer une finalité unique (la prévention), consulter avant, former les superviseurs.

EXEMPLES SOBEYS —
• Fournisseur : tester sur des visages variés ; refuser les images de faible qualité ; fixer un seuil prudent.
• Gérante : ne jamais intervenir sur une alerte non vérifiée ; faire remonter les erreurs.
• Responsable de la vie privée : exiger l'EFVP ; rappeler le consentement exprès et la déclaration à la CAI au Québec.
• Direction : comparer avec des moyens moins intrusifs ; accepter d'arrêter le projet.

POINT D'ÉTAPE — À 4 min : « Quel rôle avez-vous choisi ? »

TRANSITION — « Débat. »`,
  `⏱ 10 min · DÉBAT

ANIMATION — Lancez le minuteur. Deux ou trois volontaires, si possible de rôles différents, présentent leurs décisions en 2 minutes, au micro. Après chaque présentation, une ou deux réactions au micro. Puis le sondage : chacun annonce un numéro.

RELANCE CLÉ — « Qu'est-ce qui vous aurait arrêté, en vrai ? » La peur de contredire, les objectifs chiffrés, le manque d'information. APSM : « C'est exactement le rôle d'un comité paritaire : que dire stop ne repose pas sur une seule personne. »

LECTURE DU SONDAGE — Personne ne devrait choisir 1 (« l'algorithme ») sans être contredit : un algorithme n'est pas responsable. La réponse 5 ouvre le module 7.

TRANSITION — APSM : « Voici les repères qui permettent de décider. » Sobeys : « Voici ce qui s'est vraiment passé. »`,
  `⏱ 3 min · APSM : LES REPÈRES · SOBEYS : LA SUITE (5 clics)

APSM —
→ beat 1 : « Loi 25 : les images du visage sont des renseignements biométriques, donc sensibles. Il faut un consentement exprès et une évaluation des facteurs relatifs à la vie privée avant le déploiement. » Si le système sert aussi à vérifier ou confirmer l'identité, la Loi concernant le cadre juridique des technologies de l'information exige en plus une déclaration préalable à la CAI.
→ beat 2 : « Envoyer les vidéos hors du Québec exige d'évaluer si les renseignements y seront protégés adéquatement (article 17 de la loi sur le secteur privé). »
→ beat 3 : « Utiliser un score de sécurité pour l'évaluation du rendement, c'est une autre finalité : en principe, un nouveau consentement. »
→ beat 4 : « La Loi sur la santé et la sécurité du travail organise la prévention avec les travailleurs : le comité de santé et de sécurité a un rôle à jouer dans le choix des moyens de prévention. »
→ beat 5 : « La leçon : un bon outil de prévention peut devenir un outil de surveillance. La différence : une seule finalité annoncée, le comité consulté, un humain qui décide. »
PRUDENCE — Ce sont des repères, pas un avis juridique. Pour un vrai projet : la personne responsable de la protection des renseignements personnels, et un conseiller juridique.

SOBEYS —
→ beat 1 : « De 2012 à 2020, le système fonctionne dans des centaines de magasins, sans test sérieux de ses erreurs. »
→ beat 2 : « Juillet 2020 : une enquête de Reuters révèle le système. Rite Aid dit l'avoir abandonné. »
→ beat 3 : « 2023, au Canada : le commissaire à la protection de la vie privée de la Colombie-Britannique conclut que des magasins Canadian Tire de la province ont utilisé la reconnaissance faciale sans consentement adéquat. »
→ beat 4 : « Décembre 2023 : la FTC interdit à Rite Aid d'utiliser la reconnaissance faciale pendant cinq ans. »
→ beat 5 : « La leçon : sans test, sans transparence, sans contrôle humain, des clients deviennent des suspects. Au Québec, la biométrie exige en plus un consentement exprès et une déclaration à la CAI. »

TRANSITION — « Et chez vous ? »`,
  `⏱ 2 min · TROIS GARDE-FOUS (3 clics)

APSM —
→ beat 1 : « Une seule finalité : la prévention. Jamais l'évaluation ni la discipline, sans nouveau consentement. »
→ beat 2 : « Un humain qui tranche : une alerte ouvre une discussion, pas une sanction. Les fausses alertes sont suivies. »
→ beat 3 : « Le comité dans la boucle : consulté avant l'achat, EFVP faite, données agrégées partagées, conservation limitée. »

SOBEYS —
→ beat 1 : « Prouver la nécessité : une EFVP, et la question : un moyen moins intrusif suffirait-il ? »
→ beat 2 : « Informer et consentir : affichage clair, consentement exprès pour la biométrie, déclaration préalable à la CAI. »
→ beat 3 : « Tester, puis vérifier : taux d'erreur mesurés par groupe ; aucune intervention sur une alerte non vérifiée. »

« Ces garde-fous, il faut les écrire quelque part, et dire qui les fait respecter. C'est l'objet du module 7… après la pause. »

PAUSE — Annoncez 15 minutes (≈ 14 h 20).`,
  `⏱ 1 min · DÉBUT DU MODULE 7 (≈ 14 h 35, au retour de la pause)

OBJECTIF — Passer des principes à l'organisation : rôles, responsabilités, charte (contenu officiel du chapitre 5).

DIRE — « Le cas de l'atelier 2 l'a montré : le problème n'était pas seulement l'algorithme, c'était l'absence de gouvernance. Module 7 : qui décide, qui vérifie, qui répond. Et ce que contient une charte éthique IA, celle que vous écrirez à l'atelier 3. »

TRANSITION — « D'abord, une question de principe : une IA peut-elle être responsable ? »`,
  `⏱ 3 min · AIR CANADA (3 clics)

DIRE — « Colombie-Britannique, février 2024. Après le décès de sa grand-mère, Jake Moffatt demande à l'agent conversationnel d'Air Canada s'il existe un tarif de deuil. L'agent lui dit qu'il peut demander le remboursement après son voyage, dans les 90 jours. C'est faux : la politique d'Air Canada ne le permet pas. »
→ beat 1 : « Devant le Tribunal de résolution civile, Air Canada soutient que son agent conversationnel est une entité distincte, responsable de ses propres actes. »
→ beat 2 : « Le tribunal rejette l'argument : l'entreprise est responsable de toute l'information de son site, qu'elle vienne d'une page statique ou d'un agent conversationnel. Air Canada doit rembourser la différence, environ 650 $, plus les intérêts et les frais. »
→ beat 3 : « La règle : une IA n'est jamais responsable. Une organisation l'est toujours. Et en son sein, quelqu'un doit l'être, nommément. »

LIEN — C'est la réponse au QCM 2 de ce matin, sur Léa.

TRANSITION — « Alors, qui fait quoi ? »`,
  `⏱ 5 min · SIX RÔLES

DIRE — Parcourez les six cartes, avec la correspondance à la Mutuelle :
• La direction : fixe l'ambition et les limites, arbitre, peut tout arrêter. Le comité de direction.
• Le comité IA : approuve les projets à risque, tient le registre des systèmes d'IA. Nathalie le préside, avec Chloé, Mei, et des représentants des métiers. Dans une petite organisation, ce peut être deux ou trois personnes une fois par mois.
• Le responsable de la protection des renseignements personnels : EFVP, consentement, incidents. Chloé. « Consulté au début, pas à la fin. »
• Le propriétaire du système : une personne du métier, pas des TI, qui répond du système au quotidien. Samir pour le tri des CV, Vincent pour Léa et les campagnes.
• L'équipe données et TI : teste les biais, documente, surveille, sécurise. Mei.
• Chaque employé : respecte la charte, utilise les outils approuvés, signale un problème.

QUESTION — « Dans votre organisation, lesquels de ces rôles existent déjà, au moins de fait ? » Deux réponses au micro. Si un participant a répondu 5 au sondage de ce matin (règles d'usage), c'est le moment de lui donner la parole.

TRANSITION — « Ces rôles interviennent à des moments précis de la vie d'un projet. »`,
  `⏱ 4 min · CINQ POINTS DE CONTRÔLE (6 clics)

DIRE —
→ beat 1 : « L'idée : une fiche projet d'une page et un niveau de risque. Le comité IA est informé. »
→ beat 2 : « La conception : l'EFVP. Quelles données, pour quel but. »
→ beat 3 : « Les essais : on teste les biais par groupe, la fiabilité, la qualité des explications, avant le lancement. »
→ beat 4 : « Le lancement : les personnes sont informées, un recours est prévu, un humain reste dans la boucle. »
→ beat 5 : « Le suivi : des indicateurs, un registre des incidents, une revue annuelle. Un modèle se dégrade quand le monde change. »
→ beat 6 : « Et à chaque point, un bouton d'arrêt : quelqu'un peut suspendre le projet. C'est ce qui manquait dans le cas de l'atelier 2. »

À SOULIGNER — C'est proportionné : un filtre anti-pourriel ne passe pas par les cinq portes avec la même intensité qu'un score de fraude.

TRANSITION — « Tout ça s'écrit dans un document : la charte. »`,
  `⏱ 4 min · LA CHARTE EN CINQ RUBRIQUES

DIRE — « Une charte éthique IA tient en une page, en cinq rubriques. C'est le modèle de votre atelier. »
1. Nos principes : trois à cinq, reformulés avec nos mots (pas les dix de Montréal recopiés).
2. Nos règles d'usage : permis, interdit, soumis à accord.
3. Nos données : le feu tricolore de ce matin.
4. Nos rôles : qui approuve, qui répond, à qui signaler.
5. Notre suivi : incidents, indicateurs, date de révision.

À DROITE — « Une charte vitrine : de belles valeurs, aucun nom. Une charte vivante : des règles vérifiables, des noms, une date. »

TEST SIMPLE — « Pour chaque phrase de votre charte : peut-on vérifier si elle est respectée ? Si non, elle est décorative. »

TRANSITION — « Voici la version 1 de la Mutuelle. »`,
  `⏱ 3 min · EXEMPLE DE CHARTE

DIRE — Lisez les huit règles en soulignant :
• la règle 2 : transparence, en écho à Léa et au règlement européen ;
• la règle 3 : la révision humaine, en écho à l'article 12.1 et au cas de l'atelier 2 ;
• la règle 5 : le passage obligé par le comité et l'EFVP, avant achat ;
• la règle 6 : un propriétaire nommé, en écho à Air Canada ;
• la règle 8 : « sans crainte de reproche ». Sans cette phrase, personne ne signale rien.

À SOULIGNER — Le bandeau : « Version 1, révision en juin 2027 ». Une charte vivante a une date.

TRANSITION — « Une question pour vérifier, puis c'est à vous. »`,
  `⏱ 2 min · QCM 5

RÉPONSE — C : elle nomme des responsables et prévoit un suivi.
• A ✗ PIÈGE — Publier ne suffit pas.
• B ✗ PIÈGE — S'inspirer oui, recopier non.
• D ✗ PIÈGE — Tout interdire pousse vers l'usage caché (« shadow AI »).

TRANSITION — « Bilan du module. »`,
  `⏱ 2 min · SYNTHÈSE MODULE 7

DIRE — Relisez les cinq points.

À VOTRE POSTE — « Qui, chez nous, peut arrêter un système d'IA qui dérape ? Si personne ne sait répondre, vous avez trouvé votre premier chantier. »

TRANSITION — « Dernier atelier : votre mini-charte. »`,
  `⏱ 1 min · DÉBUT DE L'ATELIER 3 (≈ 15 h)

OBJECTIF — Élaborer une mini-charte éthique pour encadrer l'usage de l'IA en organisation (objectif officiel n° 5), puis la présenter et recevoir une rétroaction croisée.

DIRE — « Dernier atelier, et le plus engageant : votre mini-charte éthique IA. Une page, cinq rubriques, des règles vérifiables. Chacun la sienne. APSM : pour la mine Val-Laurier de l'atelier 2, ou pour votre organisation. Sobeys : pour une épicerie comme la vôtre, ou pour votre service. Toujours sans détail confidentiel. Puis deux ou trois volontaires la présentent, et on se fait une rétroaction croisée. »

TRANSITION — « Voici le modèle. »`,
  `⏱ 3 min · CONSIGNES

CHAT — Collez le modèle dans le Chat :
« MINI-CHARTE ÉTHIQUE IA · [Organisation] — Version 1 · révision le [date]
1. NOS PRINCIPES (3 à 5) — [Principe] : chez nous, cela veut dire que…
2. NOS RÈGLES D'USAGE — Permis : … / Interdit : … / Sur accord : …
3. NOS DONNÉES — Vert (tout outil) : … / Jaune (outil approuvé) : … / Rouge (jamais tel quel) : … / Outils approuvés : …
4. NOS RÔLES — Approuve les projets : … / Répond de chaque système : … / Reçoit les signalements : …
5. NOTRE SUIVI — Indicateur : … / Révision : … »

DIRE — « À gauche, les cinq rubriques, vues au module 7. À droite, le déroulé : 8, 10, 7 et 5 minutes, puis 11 minutes de présentations. Votre livrable : la charte, dans un document à vous. »

LE TEST — « Pour chaque phrase : peut-on vérifier si elle est respectée ? Si non, réécrivez-la. »

CHOIX — Ceux qui travaillent sur leur organisation : des fonctions plutôt que des prénoms, aucun détail confidentiel (ils vont la coller dans une IA à l'étape 4).

TRANSITION — « Étape 1 : les principes. »`,
  `⏱ 8 min · ÉTAPE 1 : PRINCIPES

ANIMATION — Lancez le minuteur. Chacun choisit 3 à 5 principes parmi les six (ou dans la Déclaration de Montréal) et écrit pour chacun : « Chez nous, cela veut dire que… ».

DIRE — Montrez l'exemple : « "Nous valorisons la transparence" : trop vague, invérifiable. "Un membre sait toujours, dès le premier message, qu'il échange avec une IA" : vérifiable. »

POINT D'ÉTAPE — À 4 min : « Combien de principes reformulés : 1, 2, 3 ? »

RELANCE — Si quelqu'un bloque : « Repensez au cas de l'atelier 2 : quel principe, écrit noir sur blanc, aurait tout changé ? »

TRANSITION — « Étape 2 : les règles et les données. »`,
  `⏱ 10 min · ÉTAPE 2 : RÈGLES ET DONNÉES

ANIMATION — Lancez le minuteur. Trois colonnes de règles (permis, interdit, sur accord), puis le feu tricolore avec deux exemples par couleur, et les outils approuvés.

DIRE — « Les exemples à l'écran sont des pistes. »
APSM — Permis : un premier jet de fiche de prévention, le résumé d'un rapport d'inspection anonymisé, la traduction d'une consigne. Interdit : diffuser une consigne de sécurité que personne de compétent n'a validée, décider d'une sanction, coller un rapport d'accident nominatif dans un outil gratuit. Sur accord : tout outil qui capte l'image, la voix ou des données biométriques des travailleurs (le cas de l'atelier 2), avec le comité de santé et de sécurité.
SOBEYS — Permis : une description de produit, le résumé d'un document public, le premier jet d'un courriel. Interdit : coller des données de clients ou d'employés, décider seul d'un refus, reconnaître un client à son visage (le cas de l'atelier 2). Sur accord : toute offre personnalisée fondée sur un profil (profilage annoncé et désactivé par défaut, art. 8.1), tout nouvel outil.

ATTENTION — Une charte qui interdit tout pousse à l'usage caché. Encouragez au moins trois usages permis, concrets.

POINT D'ÉTAPE — À 5 min : « Règles faites ? Feu tricolore commencé ? »

TRANSITION — « Étape 3 : qui fait quoi. »`,
  `⏱ 7 min · ÉTAPE 3 : RÔLES ET SUIVI

ANIMATION — Lancez le minuteur. Cinq questions à l'écran, une réponse chacune.

DIRE — « Reprenez les six rôles du module 7. Au minimum : qui approuve, qui répond de chaque système, à qui on signale. Et une date de révision : sans date, la charte meurt. »

INDICATEURS POSSIBLES — Nombre d'incidents signalés ; nombre de décisions révisées après contestation ; part des projets passés par l'EFVP ; écart de résultats entre groupes pour un système de tri.

POINT D'ÉTAPE — À 4 min : « Combien de rôles nommés ? »

TRANSITION — « Étape 4 : on fait relire par une IA… et on garde l'esprit critique. »`,
  `⏱ 5 min · ÉTAPE 4 : CRITIQUE PAR L'IA

ANIMATION — Collez le texte à copier dans le Chat. Lancez le minuteur.
« Voici une mini-charte éthique IA. Joue le rôle d'un auditeur exigeant. 1) Quelles règles sont impossibles à vérifier ? 2) Que manque-t-il au regard de la Loi 25 du Québec ? 3) Quelle règle risque d'être contournée ? Réponds en cinq points courts. [collez votre charte] »

DIRE — « Avant de coller : aucun nom, aucun détail confidentiel. Puis lisez la critique… avec les réflexes de ce matin. L'IA peut se tromper sur la Loi 25 ! Gardez seulement ce qui vous convainc, et réécrivez une phrase. »

CE QU'ILS VONT OBSERVER — Des critiques souvent pertinentes (règles vagues, absence de recours, de date) ; parfois des obligations inventées ou des références légales approximatives : bon rappel du module 1.

TRANSITION — « Présentations. »`,
  `⏱ 11 min · PRÉSENTATIONS ET RÉTROACTION CROISÉE

ANIMATION — Lancez le minuteur. Demandez deux ou trois volontaires. Chacun partage son écran et présente sa charte en 2 minutes, en insistant sur la règle dont il est le plus fier. Après chaque présentation, une ou deux personnes donnent au micro un point fort et une piste, en s'appuyant sur la grille de droite. Puis « Participant suivant ». Les autres peuvent déposer leur charte dans le Chat (version sans détail confidentiel) pour que chacun reparte avec plusieurs exemples.

VOTRE RÔLE — Synthétisez après chaque passage en une phrase, à partir de la grille : vérifiable ? nommé ? données protégées ? révision humaine ? date ?

SI PERSONNE NE SE PORTE VOLONTAIRE — Présentez vous-même une charte « à améliorer » (par exemple celle de la Mutuelle sans les règles 6 et 8) et demandez au groupe ce qui manque.

TRANSITION — « Merci à nos volontaires. Il est temps de faire le bilan de la journée. »`,
  `⏱ 3 min · CLÔTURE (≈ 15 h 45)

OBJECTIF — Remettre en perspective le chemin parcouru.

DIRE — « Une journée, huit modules. Ce matin : l'IA apprend d'exemples et prédit le probable, pas le vrai. Elle rend de vrais services dans tous les secteurs. Vous l'avez prise en flagrant délit. Puis les enjeux : biais, transparence, vie privée. Cet après-midi : la Loi 25 et six principes ; un cas de votre secteur, où un outil d'IA mal encadré dérape ; la gouvernance ; et votre charte. »

QUESTION — « Quel module vous servira le plus en rentrant ? » Deux ou trois réponses au micro.

TRANSITION — « Un dernier quiz, pour la route. »`,
  `⏱ 2 min · QUIZ FINAL (réponses multiples)

ANIMATION — Faites voter pour chaque option, cochez, validez, puis cliquez chaque option pour l'explication. → révèle les bonnes réponses, puis l'essentiel.

RÉPONSES — A et C.
• A ✓ — Transparence.
• B ✗ PIÈGE — Retirer une variable sans tester : le cas Amazon.
• C ✓ — Contrôle humain, article 12.1.
• D ✗ PIÈGE — Sans règle, les données sensibles fuient vers des outils non approuvés.

MESSAGE CLÉ — Revenez à la question de Nathalie : « Comment profiter de l'IA sans trahir la confiance ? » Réponse : en le disant, en le testant, en gardant un humain, en l'écrivant.

TRANSITION — « De la formation à votre quotidien. »`,
  `⏱ 4 min · PLAN D'ACTION PERSONNEL

ANIMATION — Chacun écrit ses trois engagements dans un document à lui. Laissez 2 minutes de silence (caméras allumées si possible). Puis invitez deux ou trois volontaires à en lire un au micro.

DIRE — « Trois engagements. Cette semaine : une question posée, par exemple "Qui est notre responsable des renseignements personnels ?". Ce mois-ci : votre charte présentée à votre gestionnaire ou à votre équipe. Dans trois mois : une pratique installée, comme un registre des outils d'IA de votre service. »

INSISTER — « Petit et précis vaut mieux que grand et vague. »

TRANSITION — « Quelques ressources fiables. »`,
  `⏱ 2 min · RESSOURCES

DIRE — « Six sources fiables, à consulter plutôt qu'à demander à une IA, vous savez maintenant pourquoi. »
• La CAI : la Loi 25, le guide de l'EFVP, la déclaration des incidents.
• La Déclaration de Montréal : les dix principes.
• Les principes de l'OCDE (mis à jour en 2024) et la recommandation de l'UNESCO (2021).
• Le règlement européen sur l'IA, si vous avez des clients en Europe.
• La norme ISO/IEC 42001.
• Obvia, l'Observatoire international sur les impacts sociétaux de l'IA et du numérique, un réseau de recherche québécois.

LOGISTIQUE — Indiquez comment les participants récupèrent le support (courriel, plateforme Technologia, lien de partage).

TRANSITION — « Il ne me reste qu'à vous remercier. »`,
  `⏱ 0 min · CRÉDITS PHOTOGRAPHIQUES

Page de référence, à ne pas commenter : les photos du support viennent de Wikimedia Commons, sous licence libre (CC0, CC BY, CC BY-SA, domaine public). Les licences CC BY et CC BY-SA exigent de citer l'auteur : cette page et les mentions sur chaque photo y répondent. Ne la retirez pas si vous diffusez le support.

TRANSITION — Passez directement à la page suivante.`,
  `⏱ 4 min · REMERCIEMENTS ET ÉVALUATION

DIRE — « Merci pour votre participation, vos analyses et vos chartes. Une phrase à retenir : une IA n'est jamais responsable. Nous, toujours. »

ÉVALUATION — Laissez quelques minutes pour remplir l'évaluation de la formation (lien ou formulaire Technologia). Restez disponible pour les questions individuelles.

À PERSONNALISER — Vos coordonnées professionnelles si vous souhaitez être joint après la formation.

CLÔTURE — « Bon retour, et bonne gouvernance ! »`,
];

// @@TIMERS-BEGIN
// Minuteurs de la deck — généré par scripts/timers-manifest.mjs (page = index 0-based).
export const timers = [
  { id: "op-tour", label: "Tour de table", page: 2, minutes: 7 },
  { id: "a1-s1", label: "Étape 1", page: 34, minutes: 8 },
  { id: "a1-s2", label: "Étape 2", page: 35, minutes: 10 },
  { id: "a1-s3", label: "Étape 3", page: 36, minutes: 10 },
  { id: "a1-debrief", label: "Débriefing", page: 37, minutes: 8 },
  { id: "a2-s1", label: "Analyse", page: 61, minutes: 10 },
  { id: "a2-s2", label: "Votre rôle", page: 62, minutes: 7 },
  { id: "a2-debate", label: "Débat", page: 63, minutes: 10 },
  { id: "a3-s1", label: "Principes", page: 76, minutes: 8 },
  { id: "a3-s2", label: "Règles et données", page: 77, minutes: 10 },
  { id: "a3-s3", label: "Rôles et suivi", page: 78, minutes: 7 },
  { id: "a3-s4", label: "Critique", page: 79, minutes: 5 },
  { id: "a3-share", label: "Présentations", page: 80, minutes: 11 },
];
// @@TIMERS-END
