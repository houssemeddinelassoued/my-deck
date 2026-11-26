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
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import formateur from '@assets/houssem-formateur.png';
import logoNationalQuantum from '@assets/national-quantum/logo-national-quantum.png';
import logoStack from '@assets/technologia/logo-stack.png';
import logoWide from '@assets/technologia/logo-horizontal.png';
import guideUrl from './assets/guide-ia135.pdf?url';
import lgAutomate from './assets/logos/automate.svg';
import lgChatgpt from './assets/logos/chatgpt.svg';
import lgClaude from './assets/logos/claude.svg';
import lgCopilot from './assets/logos/copilot.svg';
import lgExcel from './assets/logos/excel.svg';
import lgGemini from './assets/logos/gemini.svg';
import lgGmail from './assets/logos/gmail.svg';
import lgForms from './assets/logos/googleforms.svg';
import lgSheets from './assets/logos/googlesheets.svg';
import lgMake from './assets/logos/make.svg';
import lgN8n from './assets/logos/n8n.svg';
import lgOutlook from './assets/logos/outlook.svg';
import lgTeams from './assets/logos/teams.svg';
import lgWord from './assets/logos/word.svg';
import lgZapier from './assets/logos/zapier.svg';

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
const FONT_LINK_ID = 'osd-webfont-automatisation-taches-ia';
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
const SLIDE_ID = 'automatisation-taches-ia';
const P = 'ata'; // CSS class prefix, unique per deck
const DAY: number = 1;
// Version light: true while the deck page prints « Télécharger › Version light (PDF) »
// (the core patch marks its print root). Pages use it to adapt the cover tag or closing text.
const isLightExport = (): boolean =>
  typeof document !== 'undefined' && !!document.getElementById('os-print-root')?.hasAttribute('data-osd-light');
// Combined 2-day deck: pages after DAY_SPLIT belong to day 2 (0 = single-day deck).
const DAY_SPLIT: number = 67;
const useDay = (): number => {
  const { current } = useSlidePageNumber();
  return DAY_SPLIT > 0 && current > DAY_SPLIT ? 2 : DAY;
};
const COURSE = 'Automatisation des tâches avec l’IA';
const CODE = 'IA135';
const AUTHOR = 'Houssem Eddine Lassoued';

const MOD_TITLES: Record<number, string> = {
  1: 'Introduction à l’automatisation',
  2: 'Identifier les processus répétitifs',
  3: 'Les outils d’automatisation',
  4: 'RPA · les robots logiciels',
  5: 'Automatiser avec l’IA',
  6: 'Atelier · Un premier flux',
  7: 'Méthodologie de conception',
  8: 'Construire un workflow automatisé',
  9: 'Atelier · Un scénario complet',
  10: 'Tester, optimiser, déployer',
};
// Module 0 = ouverture / reprise, module 11 = clôture.
const LAST_MOD = 10;
const DAY_MODS: Record<number, number[]> = { 1: [1, 2, 3, 4, 5], 2: [6, 7, 8, 9, 10] };

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
  split: (
    <>
      <path d="M12 21v-7" />
      <path d="M12 14L6 8M12 14l6-6" />
      <path d="M4 11V6h5M20 11V6h-5" />
    </>
  ),
  checkCircle: (
    <>
      <circle cx={12} cy={12} r={9} />
      <path d="M8 12.5l2.8 2.8L16.5 9.5" />
    </>
  ),
  table: (
    <>
      <rect x={3} y={4} width={18} height={16} rx={2} />
      <path d="M3 9.5h18M3 15h18M9 9.5V20" />
    </>
  ),
  folder: <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2.5h8.5A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z" />,
  download: <path d="M12 3.5v12M7 10.5l5 5 5-5M4 20.5h16" />,
  copy: (
    <>
      <rect x={8} y={8} width={12.5} height={12.5} rx={2} />
      <path d="M16 8V5a1.5 1.5 0 0 0-1.5-1.5h-9A1.5 1.5 0 0 0 4 5v9a1.5 1.5 0 0 0 1.5 1.5H8" />
    </>
  ),
  keyboard: (
    <>
      <rect x={2.5} y={6} width={19} height={12} rx={2} />
      <path d="M6 10h.5M9.5 10h.5M13 10h.5M16.5 10h1M6 14h12" strokeWidth={2.4} />
    </>
  ),
  hourglass: <path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9" />,
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

// Two-day deck: the day's module chips, clickable.
const Progress = ({ mod }: { mod: number }) => {
  const day = useDay();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontFamily: display, fontWeight: 600, fontSize: 20, letterSpacing: '0.14em', color: C.muted, marginRight: 10 }}>
        {CODE} · JOUR {day}
      </span>
      {DAY_MODS[day].map((n) => (
        <ProgSq key={n} n={n} mod={mod} />
      ))}
    </div>
  );
};

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
const FooterLogos = () => (
  <>
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
  const day = useDay();
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
        Jour {day} · {pad(current)} / {pad(total)}
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
    data-osd-toggle
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
        data-osd-hotspot={n}
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
  make: { name: 'Make', short: 'Make', mono: 'M', bg: 'linear-gradient(135deg, #6D00CC 0%, #B02DE0 100%)' },
  zapier: { name: 'Zapier', short: 'Zapier', mono: 'Z', bg: 'linear-gradient(135deg, #FF4F00 0%, #D93A00 100%)' },
  n8n: { name: 'n8n', short: 'n8n', mono: 'n8n', bg: 'linear-gradient(135deg, #EA4B71 0%, #B8304F 100%)' },
  automate: { name: 'Power Automate', short: 'Power Automate', mono: 'PA', bg: 'linear-gradient(135deg, #0F6CBD 0%, #3A96DD 100%)' },
  pad: { name: 'Power Automate Desktop', short: 'PA Desktop', mono: 'PAD', bg: 'linear-gradient(135deg, #0F6CBD 0%, #3A96DD 100%)' },
  gmail: { name: 'Gmail', short: 'Gmail', mono: 'Gm', bg: 'linear-gradient(135deg, #EA4335 0%, #C5221F 100%)' },
  sheets: { name: 'Google Sheets', short: 'Sheets', mono: 'Sh', bg: 'linear-gradient(135deg, #34A853 0%, #188038 100%)' },
  forms: { name: 'Google Forms', short: 'Forms', mono: 'Fo', bg: 'linear-gradient(135deg, #7248B9 0%, #5B2C9F 100%)' },
  ifttt: { name: 'IFTTT', short: 'IFTTT', mono: 'IF', bg: 'linear-gradient(135deg, #33383D 0%, #111315 100%)' },
  uipath: { name: 'UiPath', short: 'UiPath', mono: 'Ui', bg: 'linear-gradient(135deg, #FA4616 0%, #C7350F 100%)' },
  sharepoint: { name: 'SharePoint', short: 'SharePoint', mono: 'S', bg: 'linear-gradient(135deg, #038387 0%, #036C70 100%)' },
  crm: { name: 'CRM', short: 'CRM', mono: 'CRM', bg: 'linear-gradient(135deg, #4B545B 0%, #2B2F33 100%)' },
  drive: { name: 'Google Drive', short: 'Drive', mono: 'Dr', bg: 'linear-gradient(135deg, #1FA463 0%, #FFC107 50%, #4285F4 100%)' },
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
  make: { src: lgMake },
  zapier: { src: lgZapier },
  n8n: { src: lgN8n },
  automate: { src: lgAutomate },
  pad: { src: lgAutomate },
  gmail: { src: lgGmail },
  sheets: { src: lgSheets },
  forms: { src: lgForms },
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

// ─── Cas du module (cas variés : pas d'entreprise fil rouge unique) ───────────
const CasTag = ({ children, cls, style }: { children: ReactNode; cls?: string; style?: CSSProperties }) => (
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
    <Icon name="book" size={22} sw={2.2} /> Cas · {children}
  </div>
);

// ─── Workflow nodes (same colour code on every diagram of the deck) ─────────
const NK = {
  trigger: { label: 'Déclencheur', tone: 'blue' as Tone, icon: 'bolt' as IconName },
  data: { label: 'Données', tone: 'teal' as Tone, icon: 'database' as IconName },
  step: { label: 'Traitement', tone: 'grey' as Tone, icon: 'gear' as IconName },
  ai: { label: 'Étape IA', tone: 'violet' as Tone, icon: 'sparkles' as IconName },
  cond: { label: 'Condition', tone: 'yellow' as Tone, icon: 'split' as IconName },
  action: { label: 'Action', tone: 'green' as Tone, icon: 'send' as IconName },
  human: { label: 'Validation humaine', tone: 'coral' as Tone, icon: 'humanCheck' as IconName },
  robot: { label: 'Robot RPA', tone: 'blue' as Tone, icon: 'bot' as IconName },
  out: { label: 'Résultat', tone: 'grey' as Tone, icon: 'flag' as IconName },
};
type NodeKind = keyof typeof NK;

// One workflow step: type eyebrow + label (+ optional detail line).
const FlowNode = ({
  kind,
  label,
  sub,
  icon,
  w = 250,
  cls,
  style,
}: {
  kind: NodeKind;
  label: ReactNode;
  sub?: ReactNode;
  icon?: IconName;
  w?: number;
  cls?: string;
  style?: CSSProperties;
}) => {
  const nk = NK[kind];
  return (
    <div
      className={cls}
      style={{
        width: w,
        boxSizing: 'border-box',
        background: C.card,
        borderRadius: 16,
        boxShadow: `${SHADOW_SM}, inset 0 -6px 0 ${STRONG[nk.tone]}`,
        padding: '16px 18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <IconTile name={icon ?? nk.icon} tone={nk.tone} size={40} solid={kind === 'ai' || kind === 'robot'} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 17, letterSpacing: '0.1em', textTransform: 'uppercase', color: T[nk.tone].fg }}>{nk.label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.25, color: C.ink }}>{label}</div>
      {sub ? <div style={{ fontSize: 20, lineHeight: 1.35, color: C.muted }}>{sub}</div> : null}
    </div>
  );
};

// Legend chip for a node kind.
const NodeChip = ({ kind, size = 19 }: { kind: NodeKind; size?: number }) => (
  <Tag tone={NK[kind].tone} size={size}>
    <Icon name={NK[kind].icon} size={size + 1} /> {NK[kind].label}
  </Tag>
);

// A row of nodes joined by arrows. `steps`: node 0 shows at once, node i on beat i
// (the page needs beats = nodes.length - 1). Otherwise nodes enter staggered.
type FlowItem = { kind: NodeKind; label: ReactNode; sub?: ReactNode; icon?: IconName };
const FlowRow = ({
  nodes,
  x,
  y,
  w = 250,
  gap = 60,
  steps = false,
  d = 0,
}: {
  nodes: FlowItem[];
  x: number;
  y: number;
  w?: number;
  gap?: number;
  steps?: boolean;
  d?: number;
}) => (
  <div style={{ position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center' }}>
    {nodes.map((n, i) => (
      <Fragment key={i}>
        {i > 0 ? (
          <div className={steps ? b.fade(i) : A.fade} style={{ width: gap, flex: 'none', display: 'flex', justifyContent: 'center', ...dl(steps ? 0 : d + i * 180) }}>
            <FlowArrow w={gap - 10} />
          </div>
        ) : null}
        <FlowNode {...n} w={w} cls={steps && i > 0 ? b.on(i) : A.in} style={dl(steps ? 150 : d + i * 180)} />
      </Fragment>
    ))}
  </div>
);

// ─── Make-style scenario: round modules joined by a dotted line ─────────────
type BubbleItem = { app?: AppId; icon?: IconName; tone?: Tone; label: ReactNode; sub?: ReactNode };
const Bubble2 = ({ app, icon, tone = 'violet', label, sub, size = 112, cls, style }: BubbleItem & { size?: number; cls?: string; style?: CSSProperties }) => (
  <div className={cls} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: size + 90, flex: 'none', ...style }}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: icon ? STRONG[tone] : '#fff',
        boxShadow: `0 0 0 6px ${icon ? T[tone].bg : C.panel}, 0 14px 28px -16px rgba(20,60,100,.6)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 0.5)} color={tone === 'yellow' ? C.ink : '#fff'} sw={2.2} /> : app ? <AppTile id={app} size={Math.round(size * 0.66)} style={{ boxShadow: 'none' }} /> : null}
    </div>
    <div style={{ marginTop: 16, textAlign: 'center', fontSize: 23, fontWeight: 700, lineHeight: 1.2, color: C.ink }}>{label}</div>
    {sub ? <div style={{ marginTop: 4, textAlign: 'center', fontSize: 19, lineHeight: 1.3, color: C.muted }}>{sub}</div> : null}
  </div>
);

const Chain = ({
  items,
  x,
  y,
  size = 112,
  gap = 40,
  steps = false,
  d = 0,
}: {
  items: BubbleItem[];
  x: number;
  y: number;
  size?: number;
  gap?: number;
  steps?: boolean;
  d?: number;
}) => (
  <div style={{ position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'flex-start' }}>
    {items.map((it, i) => (
      <Fragment key={i}>
        {i > 0 ? (
          <svg width={gap} height={size} className={steps ? b.fade(i) : A.fade} style={{ flex: 'none', margin: `0 -45px`, position: 'relative', zIndex: 0, ...dl(steps ? 0 : d + i * 200) }}>
            <path d={`M0 ${size / 2} H${gap}`} stroke={C.faint} strokeWidth={5} strokeDasharray="2 10" strokeLinecap="round" className={A.march} />
          </svg>
        ) : null}
        <Bubble2 {...it} size={size} cls={steps && i > 0 ? b.pop(i) : A.pop} style={{ position: 'relative', zIndex: 1, ...dl(steps ? 0 : d + i * 200) }} />
      </Fragment>
    ))}
  </div>
);

// ─── Generic tabs (cases, tools, examples) ──────────────────────────────────
const TabCtx = createContext<{ cur: string; set: (l: string) => void } | null>(null);

const Tabs = ({ initial, children, cls, style }: { initial: string; children: ReactNode; cls?: string; style?: CSSProperties }) => {
  const [cur, set] = useState(initial);
  return (
    <TabCtx.Provider value={{ cur, set }}>
      <div className={cls} style={style}>
        {children}
      </div>
    </TabCtx.Provider>
  );
};

const TabBtn = ({ id, children, tone = 'blue', icon, app }: { id: string; children?: ReactNode; tone?: Tone; icon?: IconName; app?: AppId }) => {
  const ctx = useContext(TabCtx);
  const on = ctx?.cur === id;
  return (
    <button
      type="button"
      data-osd-interactive
      data-osd-tab={id}
      onClick={(e) => {
        e.currentTarget.blur();
        ctx?.set(id);
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        border: 'none',
        cursor: 'pointer',
        padding: app ? '7px 18px 7px 8px' : '10px 18px',
        borderRadius: 12,
        fontFamily: body,
        fontWeight: 600,
        fontSize: 22,
        whiteSpace: 'nowrap',
        background: on ? STRONG[tone] : C.card,
        color: on ? (tone === 'yellow' ? C.ink : '#fff') : C.soft,
        boxShadow: on ? '0 6px 16px -10px rgba(20,60,100,.6)' : `inset 0 0 0 1.5px ${C.rule}`,
        transition: `all 200ms ${EASE}`,
      }}
    >
      {app ? <AppTile id={app} size={34} /> : icon ? <Icon name={icon} size={24} /> : null}
      {children ?? id}
    </button>
  );
};

// Shown only while its tab is selected.
const TabPane = ({ id, children }: { id: string; children: ReactNode }) => {
  const ctx = useContext(TabCtx);
  if (ctx?.cur !== id) return null;
  return (
    <div className={A.fade} style={{ animationDuration: '350ms' } as CSSProperties}>
      {children}
    </div>
  );
};

// Keyboard key / UI element name.
const Kbd = ({ children }: { children: ReactNode }) => (
  <kbd
    style={{
      fontFamily: body,
      fontWeight: 600,
      fontSize: '0.86em',
      padding: '1px 10px',
      borderRadius: 7,
      background: '#fff',
      color: C.ink,
      boxShadow: `inset 0 -3px 0 ${C.rule}, inset 0 0 0 1.5px ${C.faint}`,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </kbd>
);

// ─── Atelier briefing page (individual, guided, timer, deliverable) ─────────
const PanelTitle = ({ icon, children, c = C.blue }: { icon: IconName; children: ReactNode; c?: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
    <Icon name={icon} size={26} color={c} sw={2.3} />
    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 22, letterSpacing: '0.08em', textTransform: 'uppercase', color: c }}>{children}</span>
  </div>
);

// Numbered step inside a « Pas à pas » panel.
const Do = ({ n, children, tone = 'yellow' }: { n: number | string; children: ReactNode; tone?: Tone }) => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
    <Num n={n} tone={tone} size={38} style={{ marginTop: 1 }} />
    <div style={{ fontSize: 24, lineHeight: 1.42, color: C.ink }}>{children}</div>
  </div>
);

const AtelierPage = ({
  mod,
  n,
  title,
  objective,
  deliver,
  minutes,
  timerId,
  crit,
  tools = 'Make (offre gratuite) · un assistant IA gratuit : Copilot, Gemini ou ChatGPT',
  kind = 'atelier',
  children,
}: {
  mod: number;
  n: string;
  title: ReactNode;
  objective: ReactNode;
  deliver: ReactNode;
  minutes: number;
  timerId: string;
  crit: ReactNode;
  tools?: ReactNode;
  kind?: Kind;
  children: ReactNode;
}) => (
  <Frame mod={mod} kind={kind}>
    <Title size={54}>
      <span style={{ color: C.amber }}>{n}</span> · {title}
    </Title>
    <div style={{ position: 'absolute', left: 120, top: 196, width: 1040, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 28px', borderLeft: `8px solid ${C.yellow}` }}>
        <PanelTitle icon="target" c={T.yellow.fg}>
          Objectif
        </PanelTitle>
        <div style={{ fontSize: 26, lineHeight: 1.42, color: C.ink }}>{objective}</div>
      </div>
      <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 28px', ...dl(140) }}>
        <PanelTitle icon="list">Pas à pas · chacun sur son poste</PanelTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1200, top: 196, width: 600, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className={A.right} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 24px', ...dl(100) }}>
        <PanelTitle icon="doc">Livrable</PanelTitle>
        <div style={{ fontSize: 23, lineHeight: 1.45, color: C.soft }}>{deliver}</div>
      </div>
      <Timer id={timerId} minutes={minutes} label={n} compact cls={A.right} style={dl(200)} />
      <div className={A.right} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 24px', ...dl(300) }}>
        <PanelTitle icon="checkCircle" c={T.green.fg}>
          Critères de réussite
        </PanelTitle>
        <Checklist style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{crit}</Checklist>
      </div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, bottom: 84, display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, color: C.muted, ...dl(500) }}>
      <Icon name="puzzle" size={22} color={C.blue} /> Outils : <span style={{ fontWeight: 600, color: C.soft }}>{tools}</span>
    </div>
  </Frame>
);

// Bonus line (violet) for faster participants.
const Bonus = ({ children, cls, style }: { children: ReactNode; cls?: string; style?: CSSProperties }) => (
  <div className={cls} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: T.violet.bg, borderRadius: 12, padding: '12px 16px', fontSize: 22, lineHeight: 1.42, color: C.ink, ...style }}>
    <Icon name="sparkles" size={24} color={T.violet.fg} style={{ marginTop: 3 }} />
    <span>
      <strong style={{ color: T.violet.fg }}>Bonus · </strong>
      {children}
    </span>
  </div>
);

// Small grey « vérifié le … » stamp for perishable facts (offers, limits).
const Verified = ({ children = 'Offres vérifiées en novembre 2026 : revérifiez avant chaque session.', cls, style }: { children?: ReactNode; cls?: string; style?: CSSProperties }) => (
  <div className={cls} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 19, color: C.muted, ...style }}>
    <Icon name="calendar" size={20} color={C.muted} /> {children}
  </div>
);

// Simple table (header row + rows), cells are ReactNodes.
const Table = ({
  head,
  rows,
  cols,
  size = 22,
  cls,
  style,
  hi,
}: {
  head: ReactNode[];
  rows: ReactNode[][];
  cols: string;
  size?: number;
  cls?: string;
  style?: CSSProperties;
  hi?: number;
}) => (
  <div className={cls} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, overflow: 'hidden', ...style }}>
    <div style={{ display: 'grid', gridTemplateColumns: cols, background: C.panel }}>
      {head.map((h, i) => (
        <div key={i} style={{ padding: '14px 20px', fontFamily: display, fontWeight: 700, fontSize: size - 1, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.soft }}>
          {h}
        </div>
      ))}
    </div>
    {rows.map((r, ri) => (
      <div key={ri} className={hi ? b.on(hi + ri) : undefined} style={{ display: 'grid', gridTemplateColumns: cols, borderTop: `1.5px solid ${C.rule}` }}>
        {r.map((c, ci) => (
          <div key={ci} style={{ padding: '13px 20px', fontSize: size, lineHeight: 1.35, color: ci === 0 ? C.ink : C.soft, fontWeight: ci === 0 ? 600 : 400 }}>
            {c}
          </div>
        ))}
      </div>
    ))}
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
// A request travels through a workflow: courriel → IA → tableau → notification.
const OpNode = ({ x, y, icon, tone, label, d }: { x: number; y: number; icon: IconName; tone: Tone; label: string; d: number }) => (
  <div className={A.pop} style={{ position: 'absolute', left: x - 60, top: y - 44, width: 120, textAlign: 'center', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={88} solid style={{ margin: '0 auto', borderRadius: 999 }} />
    <div style={{ marginTop: 10, fontFamily: display, fontWeight: 700, fontSize: 22, letterSpacing: '0.08em', color: T[tone].fg }}>{label}</div>
  </div>
);

const OP_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <img src={logoStack} alt="Technologia" className={A.fade} style={{ position: 'absolute', left: 112, top: 78, height: 150, display: 'block' }} />
    <div style={{ position: 'absolute', left: 120, top: 318, width: 1000 }}>
      <Eyebrow cls={A.in} size={28}>
        Formation IA135 · 2 jours · Intelligence artificielle
      </Eyebrow>
      <h1
        className={A.in}
        style={{ margin: '18px 0 0', fontFamily: display, fontWeight: 700, fontSize: 116, lineHeight: 1.0, letterSpacing: '-0.01em', color: C.ink, ...dl(120) }}
      >
        Automatisation
        <br />
        des tâches avec l’IA
      </h1>
      <p className={A.in} style={{ margin: '26px 0 0', fontSize: 34, lineHeight: 1.32, color: C.soft, ...dl(240) }}>
        Identifiez, concevez et déployez des workflows automatisés combinant RPA et intelligence artificielle
      </p>
      {isLightExport() ? (
        <Tag cls={A.in} tone="yellow" size={24} style={{ marginTop: 26, ...dl(360) }}>
          <Icon name="book" size={24} /> Version light · à parcourir avant la formation
        </Tag>
      ) : null}
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 842, display: 'flex', alignItems: 'center', gap: 22, ...dl(520) }}>
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
        <path d="M130 150 C 300 150, 360 150, 530 150 C 610 150, 610 390, 530 390 C 360 390, 300 390, 130 390" fill="none" stroke={C.rule} strokeWidth={10} strokeLinecap="round" />
        <path
          d="M130 150 C 300 150, 360 150, 530 150 C 610 150, 610 390, 530 390 C 360 390, 300 390, 130 390"
          pathLength={1}
          fill="none"
          stroke={C.blue}
          strokeWidth={4}
          strokeDasharray="0.02 0.03"
          className={A.fade}
          style={dl(900)}
        />
        <FlowDot path="M130 150 C 300 150, 360 150, 530 150 C 610 150, 610 390, 530 390 C 360 390, 300 390, 130 390" dur={5} r={10} color={C.yellow} />
      </svg>
      <OpNode x={130} y={150} icon="mail" tone="blue" label="DEMANDE" d={1000} />
      <OpNode x={530} y={150} icon="sparkles" tone="violet" label="IA" d={1200} />
      <OpNode x={530} y={390} icon="table" tone="green" label="REGISTRE" d={1400} />
      <OpNode x={130} y={390} icon="bell" tone="yellow" label="ALERTE" d={1600} />
      <div className={A.fade} style={{ position: 'absolute', left: 0, right: 0, top: 258, textAlign: 'center', fontFamily: display, fontWeight: 700, fontSize: 30, letterSpacing: '0.1em', color: C.muted, ...dl(1800) }}>
        0 COPIER-COLLER
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
        Mes engagements pour ces deux jours
      </Eyebrow>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Pledge icon="target" tone="blue" d={500}>
          Partir d’une tâche réelle de votre quotidien, pas d’un cas d’école
        </Pledge>
        <Pledge icon="puzzle" tone="teal" d={640}>
          Des outils gratuits et sans code, utilisables dès lundi
        </Pledge>
        <Pledge icon="play" tone="violet" d={780}>
          Construire vous-même, pas à pas, sur votre poste
        </Pledge>
        <Pledge icon="rocket" tone="yellow" d={920}>
          Repartir avec un workflow qui tourne et une fiche pour le déployer
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

const OP_Tour: Page = () => (
  <Frame mod={0} label="Ouverture · Faisons connaissance">
    <Title>Tour de table</Title>
    <Lede>Quarante secondes par personne, micro ouvert. Puis un sondage éclair.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 800, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AskCard n={1} title="Qui êtes-vous ?" sub="Prénom, rôle, organisation" d={100} />
      <AskCard n={2} title="La tâche qui vous fait perdre le plus de temps" sub="Celle que vous rêvez de ne plus jamais faire à la main" d={220} />
    </div>
    <Timer id="op-tour" minutes={8} label="Tour de table" compact cls={A.in} style={{ position: 'absolute', left: 120, top: 600, ...dl(460) }} />
    <div style={{ position: 'absolute', left: 990, top: 290, width: 810 }}>
      <Eyebrow cls={A.in} c={C.violet} style={dl(200)}>
        Sondage éclair · votre point de départ
      </Eyebrow>
      <Hint cls={A.in} style={{ marginTop: 8, ...dl(260) }}>
        Répondez par le numéro de la ligne
      </Hint>
      <Poll cls={A.in} style={{ marginTop: 22, ...dl(360) }}>
        <PollRow id="none" icon="eye" tone="grey" label="1 · Je n’ai jamais automatisé quoi que ce soit" />
        <PollRow id="macro" icon="table" tone="blue" label="2 · Formules, règles Outlook, petites macros" />
        <PollRow id="nocode" icon="puzzle" tone="teal" label="3 · J’ai déjà testé Make, Zapier ou Power Automate" />
        <PollRow id="ai" icon="sparkles" tone="violet" label="4 · J’utilise une IA générative au travail" />
        <PollRow id="both" icon="rocket" tone="green" label="5 · J’ai déjà relié une IA à un workflow" />
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
      <div style={{ marginTop: 10, fontSize: 24, lineHeight: 1.38, color: C.soft }}>{children}</div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 26, bottom: 24, ...dl(600 + i * 140) }}>
      <Tag tone={when === 'Jour 1' ? 'blue' : 'green'} size={20}>
        {when}
      </Tag>
    </div>
  </div>
);

const OP_Objectives: Page = () => (
  <Frame mod={0}>
    <Title>Ce que vous saurez faire dans deux jours</Title>
    <Lede>Cinq objectifs, de l’analyse à la mise en production.</Lede>
    <ObjStep i={1} h={420} tone="blue" verb="IDENTIFIER" when="Jour 1">
      Les processus automatisables, avec une analyse structurée : SIPOC, cartographie
    </ObjStep>
    <ObjStep i={2} h={470} tone="teal" verb="CONCEVOIR" when="Jour 2">
      Des workflows clairs : déclencheurs, actions, gestion des données
    </ObjStep>
    <ObjStep i={3} h={520} tone="green" verb="METTRE EN ŒUVRE" when="Jour 1">
      Des automatisations RPA pour les tâches répétitives : courriels, rapports, synchronisation
    </ObjStep>
    <ObjStep i={4} h={570} tone="violet" verb="INTÉGRER L’IA" when="Jour 2">
      Classification, extraction et résumé au cœur d’un processus métier
    </ObjStep>
    <ObjStep i={5} h={620} tone="yellow" verb="DÉPLOYER" when="Jour 2">
      Tester, optimiser, mettre en production et mesurer le temps gagné
    </ObjStep>
  </Frame>
);

// ─── Programme (two days, ten modules) ──────────────────────────────────────
const ProgRow = ({ t, n, icon, tone = 'blue', d, children }: { t: string; n?: number; icon?: IconName; tone?: Tone; d: number; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 50, ...dl(d) }}>
    <span style={{ width: 80, fontFamily: mono, fontSize: 22, color: C.muted }}>{t}</span>
    {n ? (
      <Num n={pad(n)} tone={tone} size={40} />
    ) : (
      <span style={{ width: 40, display: 'flex', justifyContent: 'center' }}>
        <Icon name={icon ?? 'star'} size={30} color={C.muted} />
      </span>
    )}
    <span style={{ fontSize: 27, fontWeight: 500, color: C.ink }}>{children}</span>
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
    style={{ position: 'absolute', left: x, top: 210, width: 816, boxSizing: 'border-box', padding: '24px 36px 22px', background: C.card, borderRadius: 'var(--osd-radius)', boxShadow: SHADOW, ...dl(d) }}
  >
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 12 }}>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 46, color: C.ink }}>{title}</span>
      <span style={{ fontSize: 26, color: C.muted }}>{sub}</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>{children}</div>
  </div>
);

const OP_Program: Page = () => (
  <Frame mod={0}>
    <Title>Programme des deux jours</Title>
    <HalfCol x={120} title="Jour 1" sub="Repérer et comprendre" d={0}>
      <ProgRow t="9:00" icon="users" d={150}>
        Accueil, objectifs, votre tâche réelle
      </ProgRow>
      <ProgRow t="9:30" n={1} d={210}>
        Introduction à l’automatisation
      </ProgRow>
      <ProgRow t="10:15" n={2} tone="teal" d={270}>
        Identifier les processus répétitifs
      </ProgRow>
      <ProgBreak t="10:40" d={330}>
        Pause (puis exercices du module 2)
      </ProgBreak>
      <ProgBreak t="12:00" d={390}>
        Dîner
      </ProgBreak>
      <ProgRow t="13:00" n={3} d={450}>
        Les outils d’automatisation
      </ProgRow>
      <ProgRow t="13:50" n={4} d={510}>
        RPA · les robots logiciels
      </ProgRow>
      <ProgBreak t="14:40" d={570}>
        Pause
      </ProgBreak>
      <ProgRow t="14:55" n={5} tone="violet" d={630}>
        Automatiser avec l’IA
      </ProgRow>
      <ProgRow t="15:50" icon="flag" d={690}>
        Bilan du jour 1
      </ProgRow>
    </HalfCol>
    <HalfCol x={984} title="Jour 2" sub="Construire et déployer" d={150}>
      <ProgRow t="9:00" icon="loop" d={300}>
        Reprise et quiz éclair
      </ProgRow>
      <ProgRow t="9:15" n={6} tone="yellow" d={360}>
        Atelier · Un premier flux
      </ProgRow>
      <ProgBreak t="10:15" d={420}>
        Pause
      </ProgBreak>
      <ProgRow t="10:30" n={7} tone="teal" d={480}>
        Méthodologie de conception
      </ProgRow>
      <ProgRow t="11:10" n={8} d={540}>
        Construire un workflow automatisé
      </ProgRow>
      <ProgBreak t="12:00" d={600}>
        Dîner (puis atelier guidé du module 8)
      </ProgBreak>
      <ProgRow t="13:30" n={9} tone="yellow" d={660}>
        Atelier · Un scénario complet
      </ProgRow>
      <ProgBreak t="14:45" d={720}>
        Pause
      </ProgBreak>
      <ProgRow t="15:00" n={10} tone="green" d={780}>
        Tester, optimiser, déployer
      </ProgRow>
      <ProgRow t="15:45" icon="flag" d={840}>
        Plan d’action et évaluation
      </ProgRow>
    </HalfCol>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 916, display: 'flex', alignItems: 'center', gap: 28, fontSize: 23, color: C.soft, ...dl(900) }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Num n="" tone="blue" size={24} /> Notions et démonstrations
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Num n="" tone="teal" size={24} /> Analyse et conception
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Num n="" tone="violet" size={24} /> Intelligence artificielle
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Num n="" tone="yellow" size={24} /> Ateliers individuels
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
      style={{ boxSizing: 'border-box', width: 390, height: 380, padding: '30px 30px', background: C.card, borderRadius: 'var(--osd-radius)', boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, ...dl(d) }}
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
    style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 18, padding: '20px 24px', background: C.panel, borderRadius: 14, fontSize: 25, lineHeight: 1.3, color: C.ink, ...dl(d) }}
  >
    <Icon name={icon} size={34} color={C.blue} />
    <span>{children}</span>
  </div>
);

const OP_HowWeWork: Page = () => (
  <Frame mod={0}>
    <Title>Comment nous allons travailler</Title>
    <Lede>Une formation pratique : on observe, on essaie, on construit… et on mesure.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 40 }}>
      <ActCard kind="qcm" icon="check" title="Votez, vérifiez" d={100}>
        Vous répondez à voix haute, je clique. Les pièges sont voulus.
      </ActCard>
      <ActCard kind="demo" icon="play" title="Observez" d={220}>
        Des démonstrations en partage d’écran, dans de vrais outils.
      </ActCard>
      <ActCard kind="exercice" icon="pointer" title="Analysez" d={340}>
        Votre propre quotidien : tâches, temps perdu, critères.
      </ActCard>
      <ActCard kind="atelier" icon="puzzle" title="Construisez" d={460}>
        Des ateliers individuels, guidés pas à pas, avec minuteur et livrable.
      </ActCard>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 730, width: 1680, display: 'flex', gap: 24 }}>
      <RuleChip icon="chat" d={600}>
        Questions bienvenues, à tout moment, au micro
      </RuleChip>
      <RuleChip icon="lock" d={700}>
        Données fictives seulement dans les outils gratuits
      </RuleChip>
      <RuleChip icon="book" d={800}>
        Un cas différent à chaque module
      </RuleChip>
    </div>
    <Callout
      cls={A.in}
      title="Classe virtuelle"
      icon="video"
      tone="blue"
      size={26}
      style={{ position: 'absolute', left: 120, top: 856, width: 1680, padding: '14px 26px', ...dl(900) }}
    >
      Caméra si possible, micro coupé hors échanges. Idéal : deux écrans, la formation et votre outil d’automatisation.
    </Callout>
  </Frame>
);

// ─── Your real task: the personal thread of the two days ────────────────────
const CarnetStep = ({ n, mod, title, d, children }: { n: number; mod: string; title: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ display: 'flex', alignItems: 'flex-start', gap: 20, ...dl(d) }}>
    <Num n={n} tone={n <= 2 ? 'blue' : n <= 4 ? 'teal' : 'yellow'} size={50} />
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{title}</span>
        <Tag tone="grey" size={18}>
          {mod}
        </Tag>
      </div>
      <div style={{ fontSize: 23, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const OP_Carnet: Page = () => (
  <Frame mod={0} label="Ouverture · Votre fil conducteur">
    <Title>Votre tâche réelle, du constat au déploiement</Title>
    <Lede>Pas d’entreprise fictive commune : votre carnet de bord suit une vraie tâche de votre quotidien.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 300, width: 1060, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <CarnetStep n={1} mod="Module 2" title="Repérer" d={150}>
        Lister vos tâches répétitives et le temps qu’elles prennent.
      </CarnetStep>
      <CarnetStep n={2} mod="Module 2" title="Choisir" d={270}>
        Noter chaque tâche sur quatre critères, garder la meilleure candidate.
      </CarnetStep>
      <CarnetStep n={3} mod="Module 2" title="Analyser" d={390}>
        La décrire avec un SIPOC : fournisseurs, entrées, étapes, sorties, clients.
      </CarnetStep>
      <CarnetStep n={4} mod="Module 7" title="Concevoir" d={510}>
        Rédiger sa fiche de conception : besoin, étapes, diagramme, données.
      </CarnetStep>
      <CarnetStep n={5} mod="Modules 9 et 10" title="Construire et déployer" d={630}>
        La construire, la tester, mesurer le gain et documenter.
      </CarnetStep>
    </div>
    <div
      className={A.right}
      style={{ position: 'absolute', left: 1250, top: 300, width: 550, boxSizing: 'border-box', background: G.blue, borderRadius: 20, boxShadow: SHADOW, padding: '30px 34px', color: '#fff', ...dl(500) }}
    >
      <Icon name="note" size={48} color={C.yellow} />
      <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 40, lineHeight: 1.1 }}>Votre carnet de bord</div>
      <div style={{ marginTop: 14, fontSize: 25, lineHeight: 1.5, color: '#F2F8FC' }}>
        Ouvrez dès maintenant un document personnel (Word, Google Docs, OneNote…). Le modèle est dans votre guide du participant (et collé dans le Chat). Vous le complétez à chaque module.
      </div>
      <div style={{ marginTop: 22, padding: '14px 18px', borderRadius: 12, background: 'rgba(255,255,255,.14)', fontSize: 22, lineHeight: 1.45 }}>
        Pas d’idée de tâche ? Une liste d’exemples vous attend au module 2.
      </div>
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
      q="Parmi ces affirmations sur l’automatisation, lesquelles sont vraies ?"
      explain="On automatise d’abord ce qui est fréquent et bien décrit. L’IA ajoute la lecture du texte libre, mais elle se trompe parfois : on garde un humain là où l’erreur coûte cher."
    >
      <Opt why="Piège ! Automatiser un processus confus, c’est produire des erreurs plus vite. On le clarifie d’abord : c’est tout le module 2.">
        On peut automatiser n’importe quel processus tel qu’il est
      </Opt>
      <Opt ok why="Oui : Make, Zapier ou Power Automate se construisent par blocs, sans écrire de code. Il faut surtout de la méthode.">
        Il n’est pas nécessaire de savoir programmer
      </Opt>
      <Opt ok why="Oui : un courriel rédigé librement, une facture scannée, une plainte… L’IA sait en extraire des champs ou les classer, là où une règle fixe échoue.">
        L’IA permet d’automatiser des tâches sur du texte non structuré
      </Opt>
      <Opt why="Piège ! L’IA reste probabiliste : elle classe juste la plupart du temps, pas toujours. On prévoit des contrôles et une validation humaine quand l’enjeu le demande.">
        Avec l’IA, un workflow n’a plus besoin d’être vérifié
      </Opt>
    </Qcm>
  </Frame>
);

// ═══ 10-m1 ═════════════════════════════════════════════════════════════

// ═══ Module 1 · Introduction à l’automatisation ═════════════════════════════

const M1_Section: Page = () => (
  <Section n={1} title="Introduction à l’automatisation" sub="Ce qu’on automatise, comment, et ce que l’IA change." dur="45 min">
    <SecItem n={1}>Qu’est-ce que l’automatisation ?</SecItem>
    <SecItem n={2}>Automatisation classique ou avec IA</SecItem>
    <SecItem n={3}>Exemples concrets dans les entreprises</SecItem>
  </Section>
);
M1_Section.transition = BLOOM;

// ─── Definition ─────────────────────────────────────────────────────────────
const M1Prop = ({ icon, tone, title, d, children }: { icon: IconName; tone: Tone; title: string; d: number; children: ReactNode }) => (
  <Card tone={tone} icon={icon} title={title} size={24} cls={b.on(3)} style={{ ...dl(d) }}>
    {children}
  </Card>
);

const M1_Definition: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>Automatiser, c’est confier une suite d’actions à un système</Title>
    <Lede>Un événement déclenche des actions selon des règles, sans que vous ayez à intervenir.</Lede>
    <FlowRow
      steps
      x={120}
      y={330}
      w={500}
      gap={90}
      nodes={[
        { kind: 'trigger', label: 'Quand…', sub: 'un courriel arrive, chaque lundi à 8 h, une ligne est ajoutée' },
        { kind: 'cond', label: 'Si…', sub: 'l’objet contient « facture », le montant dépasse 500 $' },
        { kind: 'action', label: 'Alors…', sub: 'enregistrer la pièce jointe, prévenir la comptable' },
      ]}
    />
    <div style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
      <M1Prop icon="loop" tone="blue" title="Répétable" d={0}>
        Il fait la même chose la 1<sup>re</sup> et la 1 000<sup>e</sup> fois, à 3 h du matin comme à midi.
      </M1Prop>
      <M1Prop icon="shieldCheck" tone="green" title="Fiable" d={150}>
        Pas de fatigue, pas d’oubli… tant que les règles et les données sont bonnes.
      </M1Prop>
      <M1Prop icon="eye" tone="teal" title="Traçable" d={300}>
        Chaque exécution laisse une trace : quand, quoi, avec quel résultat.
      </M1Prop>
    </div>
  </Frame>
);

// ─── Before / after ─────────────────────────────────────────────────────────
const M1Line = ({ i, t, children, auto = false }: { i: number; t: string; children: ReactNode; auto?: boolean }) => (
  <div className={auto ? b.left(1) : A.left} style={{ display: 'flex', alignItems: 'center', gap: 16, height: 56, ...dl(auto ? i * 120 : 200 + i * 110) }}>
    <span style={{ width: 70, fontFamily: mono, fontSize: 20, color: auto ? T.green.fg : C.muted }}>{t}</span>
    <span style={{ width: 14, height: 14, flex: 'none', background: auto ? C.green : C.faint }} />
    <span style={{ fontSize: 25, color: C.ink }}>{children}</span>
  </div>
);

const M1_Avant: Page = () => (
  <Frame mod={1} beats={2}>
    <Title>La même tâche, à la main puis automatisée</Title>
    <div style={{ position: 'absolute', left: 120, top: 190 }}>
      <CasTag>Cabinet comptable · une facture fournisseur reçue par courriel</CasTag>
    </div>
    <Card tone="grey" icon="user" title="À la main" size={24} style={{ position: 'absolute', left: 120, top: 270, width: 800, height: 610 }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <M1Line i={0} t="0:00">Ouvrir le courriel, télécharger la pièce jointe</M1Line>
        <M1Line i={1} t="1:30">La renommer « 2026-11_Fournisseur_Montant »</M1Line>
        <M1Line i={2} t="2:30">La ranger dans le bon dossier partagé</M1Line>
        <M1Line i={3} t="4:00">Recopier fournisseur, montant et échéance dans Excel</M1Line>
        <M1Line i={4} t="7:00">Vérifier les doublons</M1Line>
        <M1Line i={5} t="9:00">Écrire à la comptable pour approbation</M1Line>
      </div>
      <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 44, color: C.coral }}>≈ 10 min × 60 factures / mois</div>
    </Card>
    <Card tone="green" icon="bolt" title="Automatisée" size={24} cls={b.on(1)} style={{ position: 'absolute', left: 1000, top: 270, width: 800, height: 610 }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <M1Line auto i={0} t="0:00">Le courriel arrive : le workflow démarre seul</M1Line>
        <M1Line auto i={1} t="0:02">La pièce jointe est renommée et rangée</M1Line>
        <M1Line auto i={2} t="0:05">L’IA lit la facture et extrait les champs</M1Line>
        <M1Line auto i={3} t="0:06">Une ligne est ajoutée au registre, doublon vérifié</M1Line>
        <M1Line auto i={4} t="0:07">La comptable reçoit une demande d’approbation</M1Line>
        <M1Line auto i={5} t="…">Vous ne vérifiez que les cas signalés</M1Line>
      </div>
      <div className={b.fade(2)} style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 44, color: T.green.fg }}>
        ≈ 9 h rendues chaque mois
      </div>
    </Card>
  </Frame>
);

// ─── The ladder of automation ───────────────────────────────────────────────
const M1Rung = ({ i, tone, icon, title, ex, beat }: { i: number; tone: Tone; icon: IconName; title: string; ex: string; beat: number }) => (
  <div className={b.on(beat)} style={{ position: 'absolute', left: 120 + i * 282, top: 870 - (250 + i * 64), width: 264 }}>
    <div style={{ height: 250 + i * 64, boxSizing: 'border-box', background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 0 7px 0 ${STRONG[tone]}`, padding: '22px 20px' }}>
      <IconTile name={icon} tone={tone} size={56} solid={i >= 4} />
      <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 30, lineHeight: 1.05, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 8, fontSize: 20, lineHeight: 1.35, color: C.muted }}>{ex}</div>
    </div>
  </div>
);

const M1_Echelle: Page = () => (
  <Frame mod={1} beats={6}>
    <Title>Six niveaux d’automatisation</Title>
    <Lede>Du simple raccourci à l’agent qui décide de ses étapes : plus on monte, plus c’est puissant… et plus il faut encadrer.</Lede>
    <M1Rung i={0} beat={1} tone="grey" icon="filter" title="Règles et formules" ex="Règle Outlook, formule Excel, filtre Gmail" />
    <M1Rung i={1} beat={2} tone="blue" icon="code" title="Macros et scripts" ex="Macro Excel, Apps Script : du code, souvent fragile" />
    <M1Rung i={2} beat={3} tone="teal" icon="bot" title="RPA" ex="Un robot clique et tape à votre place à l’écran" />
    <M1Rung i={3} beat={4} tone="green" icon="puzzle" title="Workflows sans code" ex="Make, Zapier, n8n, Power Automate relient les applications" />
    <M1Rung i={4} beat={5} tone="violet" icon="sparkles" title="Workflows + IA" ex="Une étape IA lit, classe, extrait, résume" />
    <M1Rung i={5} beat={6} tone="coral" icon="brain" title="Agents IA" ex="L’IA choisit elle-même ses outils et ses étapes" />
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 892, display: 'flex', gap: 14, alignItems: 'center', fontSize: 22, color: C.muted, ...dl(400) }}>
      <Icon name="trend" size={26} color={C.blue} /> Ces deux jours : niveaux 3, 4 et 5. Le niveau 6 est présenté au module 5.
    </div>
  </Frame>
);

// ─── Classic vs AI ──────────────────────────────────────────────────────────
const M1_Classique: Page = () => (
  <Frame mod={1} beats={5}>
    <Title>Automatisation classique ou avec IA ?</Title>
    <Lede>La différence tient en une question : les règles peuvent-elles s’écrire à l’avance ?</Lede>
    <Table
      cls={A.in}
      style={{ position: 'absolute', left: 120, top: 280, width: 1680 }}
      cols="300px 1fr 1fr"
      size={28}
      hi={1}
      head={['', 'Classique (règles)', 'Avec IA']}
      rows={[
        ['Entrées', 'Structurées : formulaire, tableau, champ précis', 'Non structurées : courriel libre, PDF, image, voix'],
        ['Logique', 'Règles explicites : si… alors…', 'Jugement appris : « ressemble à une plainte »'],
        ['Résultat', 'Déterministe : toujours le même', 'Probable : très souvent juste, pas toujours'],
        ['Quand ça rate', 'Il s’arrête ou signale une erreur', 'Il se trompe… avec assurance'],
        ['Contrôle', 'Tests une fois pour toutes', 'Tests + échantillonnage + validation humaine'],
      ]}
    />
    <Callout cls={b.on(5)} title="En pratique" style={{ position: 'absolute', left: 120, top: 800, width: 1680 }}>
      On combine les deux : des règles pour tout ce qui peut s’écrire, l’IA seulement pour l’étape qui demande de <Hl>lire et comprendre</Hl>.
    </Callout>
  </Frame>
);

// ─── Interactive: rule vs AI on four e-mails ───────────────────────────────
const M1_MAILS = [
  { from: 'Bureau Plus', subj: 'Facture F-2291 · novembre', rule: { ok: true, txt: 'Classé dans « Factures »' }, ai: 'Facture fournisseur · 1 248,50 $ · échéance 15 déc.' },
  { from: 'Studio Graphik', subj: 'Ci-joint notre note d’honoraires', rule: { ok: false, txt: 'Non classé : le mot « facture » manque' }, ai: 'Facture fournisseur · 3 400 $ · payable à 30 jours' },
  { from: 'Mme Tremblay (cliente)', subj: 'Re: ma facture est-elle payée ?', rule: { ok: false, txt: 'Rangé à tort dans « Factures fournisseurs »' }, ai: 'Question de cliente · suivi de paiement · à traiter' },
  { from: 'Banque Laurentide', subj: 'Votre relevé mensuel · compte 4471', rule: { ok: false, txt: 'Non classé' }, ai: 'Relevé bancaire · à rapprocher' },
];

const M1_Regle: Page = () => {
  const [ai, setAi] = useState(false);
  return (
    <Frame mod={1} kind="demo">
      <Title>Une règle fixe face à quatre courriels réels</Title>
      <div style={{ position: 'absolute', left: 120, top: 188, display: 'flex', alignItems: 'center', gap: 30 }}>
        <Code size={22} style={{ padding: '10px 18px' }}>
          <Jk>SI</Jk> objet contient <Js>« facture »</Js> <Jk>ALORS</Jk> dossier <Js>Factures</Js>
        </Code>
        <Toggle on={ai} onChange={setAi} tone="violet" label={<strong>{ai ? 'Étape IA activée' : 'Activer l’étape IA'}</strong>} />
      </div>
      <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {M1_MAILS.map((m, i) => (
          <div key={m.subj} className={A.left} style={{ display: 'grid', gridTemplateColumns: '700px 1fr', gap: 24, alignItems: 'center', ...dl(i * 120) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '16px 22px' }}>
              <IconTile name="mail" tone="blue" size={50} />
              <div>
                <div style={{ fontSize: 20, color: C.muted }}>{m.from}</div>
                <div style={{ fontSize: 26, fontWeight: 600, color: C.ink }}>{m.subj}</div>
              </div>
            </div>
            {ai ? (
              <div key="ai" className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 16, background: T.violet.bg, borderRadius: 14, padding: '18px 22px', boxShadow: `inset 0 0 0 2px ${T.violet.bd}`, ...dl(i * 90) }}>
                <Icon name="sparkles" size={30} color={T.violet.fg} />
                <span style={{ fontSize: 25, fontWeight: 600, color: C.ink }}>{m.ai}</span>
              </div>
            ) : (
              <div key="rule" style={{ display: 'flex', alignItems: 'center', gap: 16, background: m.rule.ok ? T.green.bg : T.coral.bg, borderRadius: 14, padding: '18px 22px' }}>
                <Icon name={m.rule.ok ? 'check' : 'x'} size={30} color={m.rule.ok ? T.green.fg : T.coral.fg} sw={3} />
                <span style={{ fontSize: 25, color: C.ink }}>{m.rule.txt}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <Hint style={{ position: 'absolute', left: 120, top: 880 }}>
        {ai ? 'L’IA comprend le sens, pas seulement les mots. Mais qui vérifie quand elle se trompe ?' : 'Une règle sur un mot-clé : 1 courriel sur 4 bien traité.'}
      </Hint>
    </Frame>
  );
};

// ─── Sorting game ───────────────────────────────────────────────────────────
const M1Zone = ({ x, w, tone, icon, title, sub }: { x: number; w: number; tone: Tone; icon: IconName; title: string; sub: string }) => (
  <div style={{ position: 'absolute', left: x, top: 470, width: w, height: 440, boxSizing: 'border-box', borderRadius: 20, background: T[tone].bg, boxShadow: `inset 0 0 0 2.5px ${T[tone].bd}`, padding: '20px 24px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Icon name={icon} size={34} color={T[tone].fg} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: T[tone].fg }}>{title}</span>
    </div>
    <div style={{ marginTop: 4, fontSize: 20, color: C.soft }}>{sub}</div>
  </div>
);

const M1_Trier: Page = () => (
  <Frame mod={1} kind="exercice">
    <Title>Règles, IA… ou ni l’un ni l’autre ?</Title>
    <Lede w={1680}>Dites-moi où va chaque étiquette. Je la déplace.</Lede>
    <M1Zone x={120} w={540} tone="blue" icon="filter" title="Des règles suffisent" sub="Données structurées, logique écrivable" />
    <M1Zone x={690} w={540} tone="violet" icon="sparkles" title="Il faut de l’IA" sub="Texte libre, images, jugement" />
    <M1Zone x={1260} w={540} tone="coral" icon="humanCheck" title="Garder humain" sub="Rare, sensible, relationnel" />
    <Drag x={120} y={280} w={520} tone="grey">Copier chaque ligne d’un formulaire dans Excel</Drag>
    <Drag x={660} y={280} w={560} tone="grey">Trier les courriels du service client par motif</Drag>
    <Drag x={1240} y={280} w={560} tone="grey">Annoncer un licenciement à un employé</Drag>
    <Drag x={120} y={350} w={520} tone="grey">Envoyer un rappel 3 jours avant l’échéance</Drag>
    <Drag x={660} y={350} w={560} tone="grey">Résumer 40 réponses ouvertes d’un sondage</Drag>
    <Drag x={1240} y={350} w={560} tone="grey">Lire les montants sur des factures scannées</Drag>
    <Drag x={380} y={410} w={600} tone="grey">Négocier un contrat avec un client mécontent</Drag>
    <Drag x={1000} y={410} w={600} tone="grey">Sauvegarder les pièces jointes dans un dossier</Drag>
  </Frame>
);

// ─── Examples by function ───────────────────────────────────────────────────
type M1Ex = { t: string; d: string; ai: boolean };
const M1_EX: Record<string, { icon: IconName; tone: Tone; items: M1Ex[] }> = {
  Finance: {
    icon: 'money',
    tone: 'green',
    items: [
      { t: 'Saisie des factures fournisseurs', d: 'Lecture des PDF, extraction des montants, registre, approbation', ai: true },
      { t: 'Relances de paiement', d: 'Rappel automatique à J-3, J+7, J+15 selon le registre', ai: false },
      { t: 'Rapprochement bancaire', d: 'Comparer relevé et grand livre, signaler les écarts', ai: false },
    ],
  },
  'Ressources humaines': {
    icon: 'users',
    tone: 'blue',
    items: [
      { t: 'Accueil d’une nouvelle recrue', d: 'Comptes, courriels de bienvenue, tâches au gestionnaire', ai: false },
      { t: 'Questions fréquentes des employés', d: 'Réponse proposée à partir du guide RH, validée par l’équipe RH', ai: true },
      { t: 'Suivi des demandes de congés', d: 'Formulaire → approbation → calendrier partagé', ai: false },
    ],
  },
  'Service client': {
    icon: 'chat',
    tone: 'violet',
    items: [
      { t: 'Tri des demandes entrantes', d: 'Motif, urgence et ton détectés par l’IA, puis routage', ai: true },
      { t: 'Brouillons de réponse', d: 'Réponse rédigée par l’IA, relue avant envoi', ai: true },
      { t: 'Accusé de réception', d: 'Numéro de dossier et délai annoncé, instantanément', ai: false },
    ],
  },
  Ventes: {
    icon: 'trend',
    tone: 'yellow',
    items: [
      { t: 'Nouveau prospect', d: 'Formulaire web → CRM → courriel de suivi au représentant', ai: false },
      { t: 'Compte rendu de rendez-vous', d: 'Notes résumées, prochaines étapes inscrites au CRM', ai: true },
      { t: 'Rapport hebdomadaire des ventes', d: 'Chiffres agrégés, commentaire rédigé par l’IA', ai: true },
    ],
  },
  Opérations: {
    icon: 'truck',
    tone: 'teal',
    items: [
      { t: 'Synchronisation des fichiers', d: 'Nouveau fichier déposé → copié, renommé, archivé', ai: false },
      { t: 'Bons de livraison scannés', d: 'Lecture des documents (OCR), contrôle des quantités', ai: true },
      { t: 'Alerte de stock bas', d: 'Seuil atteint → courriel au responsable des achats', ai: false },
    ],
  },
};

const M1_Exemples: Page = () => (
  <Frame mod={1}>
    <Title>Ce que les entreprises automatisent déjà</Title>
    <Lede>Choisissez un service : où retrouvez-vous votre propre travail ?</Lede>
    <Tabs initial="Finance" cls={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1680 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        {Object.entries(M1_EX).map(([k, v]) => (
          <TabBtn key={k} id={k} icon={v.icon} tone={v.tone} />
        ))}
      </div>
      {Object.entries(M1_EX).map(([k, v]) => (
        <TabPane key={k} id={k}>
          <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {v.items.map((it) => (
              <Card key={it.t} tone={it.ai ? 'violet' : v.tone} style={{ height: 380 }} size={25}>
                <Tag tone={it.ai ? 'violet' : 'grey'} size={19}>
                  <Icon name={it.ai ? 'sparkles' : 'gear'} size={20} /> {it.ai ? 'Avec IA' : 'Règles seules'}
                </Tag>
                <div style={{ marginTop: 20, fontFamily: display, fontWeight: 700, fontSize: 38, lineHeight: 1.1, color: C.ink }}>{it.t}</div>
                <div style={{ marginTop: 14 }}>{it.d}</div>
              </Card>
            ))}
          </div>
        </TabPane>
      ))}
    </Tabs>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M1_Qcm: Page = () => (
  <QcmPage
    mod={1}
    n={1}
    title="Classique ou IA ?"
    q="Un formulaire web envoie toujours les mêmes champs (nom, courriel, produit). Il faut les copier dans un tableau. Que choisir ?"
    explain="Les données sont déjà structurées : une règle fait le travail, gratuitement et sans erreur. L’IA coûte, ralentit et peut se tromper là où rien n’est à interpréter."
  >
    <Opt why="Piège ! Rien n’est à comprendre ici : les champs sont fixes. L’IA ajouterait un coût et un risque d’erreur inutiles.">
      Une étape IA, pour plus d’intelligence
    </Opt>
    <Opt ok why="Exact : déclencheur « nouvelle réponse » + action « ajouter une ligne ». Les données arrivent déjà rangées.">
      Une automatisation classique, sans IA
    </Opt>
    <Opt why="Piège ! La tâche est fréquente, simple et sans jugement : c’est exactement ce qu’on automatise.">
      Rien : c’est trop simple pour être automatisé
    </Opt>
    <Opt why="Piège ! Un agent IA choisit lui-même ses étapes : beaucoup trop pour une copie de champs fixes.">
      Un agent IA autonome
    </Opt>
  </QcmPage>
);

// ─── Synthesis ──────────────────────────────────────────────────────────────
const M1_Synthese: Page = () => (
  <SynthPage
    mod={1}
    title="Module 1 · Ce qu’il faut retenir"
    poste={
      <>
        Repérez une tâche que vous faites chaque semaine. Écrivez-la sous la forme <b>Quand… Si… Alors…</b> dans votre carnet de bord.
      </>
    }
  >
    <SynthRow n={1} tone="blue" d={100}>
      Automatiser : un <b>déclencheur</b>, des <b>règles</b>, des <b>actions</b>, sans intervention.
    </SynthRow>
    <SynthRow n={2} tone="teal" d={220}>
      Six niveaux, du raccourci à l’agent : on choisit <b>le plus simple</b> qui fait le travail.
    </SynthRow>
    <SynthRow n={3} tone="violet" d={340}>
      L’IA sert quand il faut <b>lire et comprendre</b> : texte libre, document, image.
    </SynthRow>
    <SynthRow n={4} tone="coral" d={460}>
      L’IA est probable, pas certaine : on prévoit <b>contrôles et validation</b>.
    </SynthRow>
  </SynthPage>
);

// ═══ 20-m2 ═════════════════════════════════════════════════════════════

// ═══ Module 2 · Identifier les processus répétitifs ═════════════════════════

const M2_Section: Page = () => (
  <Section n={2} title="Identifier les processus répétitifs" sub="Avant d’automatiser, comprendre. Puis choisir la bonne tâche." dur="1 h 20" kind="exercice">
    <SecItem n={1}>Méthodes d’analyse : SIPOC et cartographie</SecItem>
    <SecItem n={2}>Exercices : analyser son propre quotidien</SecItem>
    <SecItem n={3}>Critères : fréquence, volume, règles, outils</SecItem>
  </Section>
);
M2_Section.transition = BLOOM;

// ─── Don't automate the mess ────────────────────────────────────────────────
const M2Stage = ({ n, tone, icon, title, beat, children }: { n: number; tone: Tone; icon: IconName; title: string; beat: number; children: ReactNode }) => (
  <Card tone={tone} icon={icon} title={`${n} · ${title}`} size={25} cls={b.on(beat)} style={{ height: 300 }}>
    {children}
  </Card>
);

const M2_Desordre: Page = () => (
  <Frame mod={2} beats={3}>
    <Title>On n’automatise pas le désordre</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 210, width: 1680, ...dl(100) }}>
      <Quote by="Principe attribué à Bill Gates, souvent cité en gestion des opérations">
        L’automatisation appliquée à une opération inefficace <Hl>amplifie l’inefficacité</Hl>.
      </Quote>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 470, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
      <M2Stage n={1} beat={1} tone="blue" icon="search" title="Comprendre">
        Qui fait quoi, avec quelles données, pour qui ? On décrit le processus <b>tel qu’il est</b>.
      </M2Stage>
      <M2Stage n={2} beat={2} tone="teal" icon="filter" title="Simplifier">
        On supprime les étapes inutiles, les doubles saisies, les validations qui ne servent à rien.
      </M2Stage>
      <M2Stage n={3} beat={3} tone="green" icon="bolt" title="Automatiser">
        Seulement alors on automatise ce qui reste : moins d’étapes, donc moins de pannes.
      </M2Stage>
    </div>
  </Frame>
);

// ─── SIPOC ──────────────────────────────────────────────────────────────────
const SIPOC: { l: string; w: string; tone: Tone; q: string; ex: string }[] = [
  { l: 'S', w: 'Suppliers · Fournisseurs', tone: 'blue', q: 'Qui fournit ce qui entre ?', ex: 'Employé, banque, client, logiciel' },
  { l: 'I', w: 'Inputs · Entrées', tone: 'teal', q: 'Qu’est-ce qui entre ?', ex: 'Formulaire, courriel, fichier, reçu' },
  { l: 'P', w: 'Process · Étapes', tone: 'green', q: 'Quelles grandes étapes ? (4 à 7)', ex: 'Recevoir, vérifier, saisir, approuver' },
  { l: 'O', w: 'Outputs · Sorties', tone: 'yellow', q: 'Qu’est-ce qui sort ?', ex: 'Paiement, rapport, réponse, mise à jour' },
  { l: 'C', w: 'Customers · Clients', tone: 'violet', q: 'Qui reçoit ce qui sort ?', ex: 'Employé, gestionnaire, client final' },
];

const M2_Sipoc: Page = () => (
  <Frame mod={2} beats={5}>
    <Title>Le SIPOC : un processus sur une seule page</Title>
    <Lede>Cinq colonnes, de gauche à droite. On reste à haut niveau : la vue d’ensemble, pas le détail.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 22 }}>
      {SIPOC.map((c, i) => (
        <div key={c.l} className={b.on(i + 1)} style={{ height: 560, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[c.tone]}`, padding: '26px 24px' }}>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 130, lineHeight: 1, color: c.tone === 'yellow' ? C.amber : STRONG[c.tone] }}>{c.l}</div>
          <div style={{ marginTop: 8, fontFamily: display, fontWeight: 700, fontSize: 26, lineHeight: 1.15, color: C.ink }}>{c.w}</div>
          <div style={{ marginTop: 18, fontSize: 25, fontWeight: 600, lineHeight: 1.35, color: T[c.tone].fg }}>{c.q}</div>
          <div style={{ marginTop: 14, fontSize: 22, lineHeight: 1.4, color: C.muted }}>Ex. : {c.ex}</div>
        </div>
      ))}
    </div>
    <Hint style={{ position: 'absolute', left: 120, top: 880 }}>Astuce : commencez par P (les étapes), puis O et C, puis I et S.</Hint>
  </Frame>
);

// ─── SIPOC example ──────────────────────────────────────────────────────────
const M2Cell = ({ items }: { items: string[] }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {items.map((t) => (
      <div key={t} style={{ background: C.card, borderRadius: 10, boxShadow: SHADOW_SM, padding: '10px 14px', fontSize: 22, lineHeight: 1.3, color: C.ink }}>
        {t}
      </div>
    ))}
  </div>
);

const M2_SipocEx: Page = () => {
  const cols: string[][] = [
    ['Employé', 'Carte de crédit d’entreprise', 'Gestionnaire'],
    ['Formulaire Excel', 'Reçus (photo ou PDF)', 'Politique de remboursement'],
    ['1. Remplir le formulaire', '2. Joindre les reçus', '3. Approuver', '4. Vérifier la conformité', '5. Saisir et payer'],
    ['Virement à l’employé', 'Écriture comptable', 'Dossier archivé'],
    ['Employé', 'Comptabilité', 'Vérificateur externe'],
  ];
  return (
    <Frame mod={2} beats={5} kind="cas">
      <Title>Exemple : les notes de frais</Title>
      <div style={{ position: 'absolute', left: 120, top: 186 }}>
        <CasTag>PME de services · 120 employés · 300 notes de frais par mois</CasTag>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 22 }}>
        {SIPOC.map((c, i) => (
          <div key={c.l} style={{ height: 620, boxSizing: 'border-box', background: T[c.tone].bg, borderRadius: 18, padding: '18px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 14 }}>
              <span style={{ fontFamily: display, fontWeight: 700, fontSize: 54, lineHeight: 1, color: c.tone === 'yellow' ? C.amber : STRONG[c.tone] }}>{c.l}</span>
              <span style={{ fontFamily: display, fontWeight: 600, fontSize: 22, color: T[c.tone].fg }}>{c.w.split(' · ')[1]}</span>
            </div>
            <div className={b.on([3, 4, 1, 2, 5][i])}>
              <M2Cell items={cols[i]} />
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
};

// ─── Process mapping: the symbols ───────────────────────────────────────────
const M2Sym = ({ shape, title, sub, d }: { shape: ReactNode; title: string; sub: string; d: number }) => (
  <div className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 26, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 24px', ...dl(d) }}>
    <div style={{ width: 150, height: 80, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{shape}</div>
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, color: C.muted }}>{sub}</div>
    </div>
  </div>
);

const M2_Carto: Page = () => (
  <Frame mod={2}>
    <Title>La cartographie : le processus étape par étape</Title>
    <Lede w={760}>Le SIPOC donne la vue d’ensemble. La carte montre le détail : qui fait quoi, dans quel ordre, et où ça bloque.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 420, width: 760, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M2Sym d={100} title="Début / fin" sub="Ce qui déclenche, ce qui termine" shape={<div style={{ width: 140, height: 60, borderRadius: 999, background: T.green.bg, boxShadow: `inset 0 0 0 3px ${C.green}` }} />} />
      <M2Sym d={200} title="Étape" sub="Un verbe d’action : « vérifier le montant »" shape={<div style={{ width: 140, height: 64, borderRadius: 10, background: T.blue.bg, boxShadow: `inset 0 0 0 3px ${C.blue}` }} />} />
      <M2Sym d={300} title="Décision" sub="Une question à deux sorties : oui / non" shape={<div style={{ width: 56, height: 56, transform: 'rotate(45deg)', background: T.yellow.bg, boxShadow: `inset 0 0 0 3px ${C.amber}` }} />} />
      <M2Sym d={400} title="Flèche" sub="L’ordre des étapes, le passage de relais" shape={<FlowArrow w={120} color={C.soft} />} />
    </div>
    <Card tone="teal" icon="layers" title="Les couloirs" size={25} cls={A.right} style={{ position: 'absolute', left: 980, top: 230, width: 820, height: 330, ...dl(300) }}>
      Une bande horizontale par acteur (personne, service ou logiciel). Chaque fois qu’une flèche <b>change de couloir</b>, il y a un passage de relais… et souvent une attente.
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {['Employé', 'Gestionnaire', 'Comptabilité'].map((l, i) => (
          <div key={l} style={{ height: 40, display: 'flex', alignItems: 'center', paddingLeft: 14, borderRadius: 8, background: [T.blue.bg, T.yellow.bg, T.green.bg][i], fontSize: 20, fontWeight: 600, color: C.soft }}>
            {l}
          </div>
        ))}
      </div>
    </Card>
    <Callout cls={A.right} title="Règle d’or" style={{ position: 'absolute', left: 980, top: 600, width: 820, ...dl(500) }}>
      Dessinez le processus <b>réel</b>, avec ses contournements et ses relances, pas celui de la procédure officielle.
    </Callout>
  </Frame>
);

// ─── Swimlane map with pain points ──────────────────────────────────────────
const M2Box = ({ cx: x, cy: y, w = 240, children, oval = false, tone = 'blue' }: { cx: number; cy: number; w?: number; children: ReactNode; oval?: boolean; tone?: Tone }) => (
  <div
    style={{
      position: 'absolute',
      left: x - w / 2,
      top: y - 43,
      width: w,
      height: 86,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '0 14px',
      borderRadius: oval ? 999 : 12,
      background: C.card,
      boxShadow: `${SHADOW_SM}, inset 0 0 0 3px ${STRONG[tone]}`,
      fontSize: 22,
      fontWeight: 600,
      lineHeight: 1.2,
      color: C.ink,
    }}
  >
    {children}
  </div>
);

const M2Wire = ({ pts, dir }: { pts: [number, number][]; dir: 'r' | 'u' | 'd' }) => {
  const [ex, ey] = pts[pts.length - 1];
  const head = dir === 'r' ? `${ex},${ey} ${ex - 16},${ey - 10} ${ex - 16},${ey + 10}` : dir === 'd' ? `${ex},${ey} ${ex - 10},${ey - 16} ${ex + 10},${ey - 16}` : `${ex},${ey} ${ex - 10},${ey + 16} ${ex + 10},${ey + 16}`;
  return (
    <g>
      <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={C.soft} strokeWidth={3.5} strokeLinejoin="round" />
      <polygon points={head} fill={C.soft} />
    </g>
  );
};

const M2_CartoEx: Page = () => (
  <Frame mod={2} kind="cas">
    <Title>La carte réelle des notes de frais… et ses irritants</Title>
    <Hint style={{ position: 'absolute', left: 120, top: 186 }}>Cliquez les pastilles rouges : où se perd le temps ?</Hint>
    {['Employé', 'Gestionnaire', 'Comptabilité'].map((l, i) => (
      <div key={l} style={{ position: 'absolute', left: 120, top: 250 + i * 200, width: 1680, height: 190, borderRadius: 14, background: [T.blue.bg, T.yellow.bg, T.green.bg][i] }}>
        <div style={{ position: 'absolute', left: 22, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontFamily: display, fontWeight: 700, fontSize: 28, color: [T.blue.fg, T.yellow.fg, T.green.fg][i] }}>{l}</div>
      </div>
    ))}
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <M2Wire dir="r" pts={[[590, 345], [636, 345]]} />
      <M2Wire dir="d" pts={[[880, 345], [1050, 345], [1050, 500]]} />
      <M2Wire dir="d" pts={[[1050, 588], [1050, 690]]} />
      <M2Wire dir="u" pts={[[968, 745], [760, 745], [760, 392]]} />
      <M2Wire dir="r" pts={[[1132, 745], [1216, 745]]} />
      <M2Wire dir="r" pts={[[1460, 745], [1506, 745]]} />
      <M2Wire dir="u" pts={[[1630, 702], [1630, 392]]} />
      <text x={800} y={730} fontSize={21} fill={C.coral} fontWeight={700}>
        non · relance
      </text>
      <text x={1142} y={728} fontSize={21} fill={T.green.fg} fontWeight={700}>
        oui
      </text>
    </svg>
    <M2Box cx={470} cy={345}>Remplit le formulaire Excel</M2Box>
    <M2Box cx={760} cy={345}>Joint les reçus scannés</M2Box>
    <M2Box cx={1050} cy={545} tone="yellow">Approuve par courriel</M2Box>
    <div style={{ position: 'absolute', left: 990, top: 685, width: 120, height: 120, transform: 'rotate(45deg)', background: C.card, boxShadow: `${SHADOW_SM}, inset 0 0 0 3px ${C.amber}` }} />
    <div style={{ position: 'absolute', left: 980, top: 718, width: 140, textAlign: 'center', fontSize: 20, fontWeight: 700, lineHeight: 1.15, color: C.ink }}>Dossier complet ?</div>
    <M2Box cx={1340} cy={745} tone="green">Ressaisit dans le logiciel</M2Box>
    <M2Box cx={1630} cy={745} tone="green">Effectue le virement</M2Box>
    <M2Box cx={1630} cy={345} oval tone="green">Remboursé</M2Box>
    <Hotspot n={1} x={590} y={302} title="Double saisie">
      L’employé recopie chaque montant des reçus dans Excel : 5 à 10 minutes par note, et des fautes de frappe.
    </Hotspot>
    <Hotspot n={2} x={1170} y={502} title="Attente">
      L’approbation se perd dans la boîte de réception du gestionnaire : 4 jours en moyenne, deux relances.
    </Hotspot>
    <Hotspot n={3} x={1100} y={680} side="left" title="Aller-retour">
      Une note sur quatre est incomplète (reçu manquant) : elle repart au début.
    </Hotspot>
    <Hotspot n={4} x={1460} y={702} side="left" title="Ressaisie">
      La comptabilité retape tout dans le logiciel comptable : la même donnée saisie deux fois.
    </Hotspot>
  </Frame>
);

// ─── Time thieves ───────────────────────────────────────────────────────────
const M2_THIEVES: { icon: IconName; tone: Tone; t: string; s: string }[] = [
  { icon: 'keyboard', tone: 'blue', t: 'Ressaisir', s: 'La même donnée tapée dans deux outils' },
  { icon: 'copy', tone: 'teal', t: 'Copier-coller', s: 'D’un courriel vers un tableau, d’un tableau vers un rapport' },
  { icon: 'search', tone: 'violet', t: 'Chercher', s: 'Retrouver un fichier, une version, un numéro de dossier' },
  { icon: 'bell', tone: 'yellow', t: 'Relancer', s: 'Courir après une approbation, un document, une réponse' },
  { icon: 'chart', tone: 'green', t: 'Mettre en forme', s: 'Le même rapport, reconstruit chaque semaine' },
  { icon: 'inbox', tone: 'coral', t: 'Trier', s: 'Lire, classer, transférer les courriels entrants' },
];

const M2_Voleurs: Page = () => (
  <Frame mod={2}>
    <Title>Six voleurs de temps à traquer</Title>
    <Lede>Quand vous cartographiez, ces gestes trahissent une tâche automatisable.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
      {M2_THIEVES.map((x, i) => (
        <div key={x.t} className={A.in} style={{ display: 'flex', gap: 24, alignItems: 'center', height: 250, boxSizing: 'border-box', padding: '0 30px', background: C.card, borderRadius: 18, boxShadow: SHADOW, ...dl(100 + i * 100) }}>
          <IconTile name={x.icon} tone={x.tone} size={92} />
          <div>
            <div style={{ fontFamily: display, fontWeight: 700, fontSize: 42, color: C.ink }}>{x.t}</div>
            <div style={{ marginTop: 6, fontSize: 24, lineHeight: 1.4, color: C.soft }}>{x.s}</div>
          </div>
        </div>
      ))}
    </div>
  </Frame>
);

// ─── Exercise 1: my daily work ──────────────────────────────────────────────
const M2_Journal: Page = () => (
  <AtelierPage
    mod={2}
    kind="exercice"
    n="Exercice 1"
    title="Analyser son propre quotidien"
    timerId="m2-journal"
    minutes={10}
    tools="Votre carnet de bord (document personnel) · rubrique 1"
    objective="Lister au moins cinq tâches répétitives de votre travail et estimer le temps qu’elles vous prennent."
    deliver={
      <>
        Un tableau de 5 lignes : <b>tâche · fréquence · durée · outils utilisés</b>.
        <div style={{ marginTop: 10, fontSize: 21, color: C.muted }}>
          Pas d’idée ? Courriels à trier, rapport du lundi, relances, saisie de formulaires, comptes rendus, mise à jour d’un tableau de suivi.
        </div>
      </>
    }
    crit={
      <>
        <CheckItem id="a" size={22}>Au moins 5 tâches</CheckItem>
        <CheckItem id="b" size={22}>Une durée et une fréquence pour chacune</CheckItem>
        <CheckItem id="c" size={22}>Les outils nommés (Outlook, Excel, logiciel métier…)</CheckItem>
      </>
    }
  >
    <Do n={1}>Pensez à votre dernière semaine, jour par jour : qu’avez-vous refait plusieurs fois ?</Do>
    <Do n={2}>Notez chaque tâche avec un verbe : « saisir », « relancer », « compiler »…</Do>
    <Do n={3}>Estimez la durée d’une fois et le nombre de fois par semaine.</Do>
    <Do n={4}>Cherchez les six voleurs de temps : ressaisir, copier-coller, chercher, relancer, mettre en forme, trier.</Do>
  </AtelierPage>
);

// ─── The four criteria ──────────────────────────────────────────────────────
const M2_CRIT: { icon: IconName; tone: Tone; t: string; q: string; lo: string; hi: string }[] = [
  { icon: 'loop', tone: 'blue', t: 'Fréquence', q: 'Combien de fois revient-elle ?', lo: '1 · une fois par an', hi: '5 · plusieurs fois par jour' },
  { icon: 'layers', tone: 'teal', t: 'Volume', q: 'Combien de cas à chaque fois ?', lo: '1 · un ou deux', hi: '5 · des dizaines ou des centaines' },
  { icon: 'list', tone: 'yellow', t: 'Règles claires', q: 'La logique peut-elle s’écrire ?', lo: '1 · jugement au cas par cas', hi: '5 · toujours la même logique' },
  { icon: 'plug', tone: 'green', t: 'Outils utilisés', q: 'Les applications sont-elles connectables ?', lo: '1 · logiciel fermé, papier', hi: '5 · applications en ligne, connecteurs' },
];

const M2_Criteres: Page = () => (
  <Frame mod={2}>
    <Title>Quatre critères pour choisir quoi automatiser</Title>
    <Lede>Notez chaque tâche de 1 à 5 sur chacun. Les règles floues ou les vieux logiciels ne disent pas « non » : ils disent « autrement ».</Lede>
    <div style={{ position: 'absolute', left: 120, top: 300, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 26 }}>
      {M2_CRIT.map((c, i) => (
        <div key={c.t} className={A.in} style={{ height: 470, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[c.tone]}`, padding: '28px 26px', display: 'flex', flexDirection: 'column', ...dl(100 + i * 120) }}>
          <IconTile name={c.icon} tone={c.tone} size={70} />
          <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 40, color: C.ink }}>{c.t}</div>
          <div style={{ marginTop: 8, fontSize: 24, lineHeight: 1.35, color: C.soft }}>{c.q}</div>
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Tag tone="grey" size={19} style={{ whiteSpace: 'normal' }}>
              {c.lo}
            </Tag>
            <Tag tone={c.tone} size={19} style={{ whiteSpace: 'normal' }}>
              {c.hi}
            </Tag>
          </div>
        </div>
      ))}
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 806, width: 1680, display: 'flex', gap: 24, ...dl(700) }}>
      <Callout title="Règles floues ?" tone="violet" icon="sparkles" size={24} style={{ flex: 1 }}>
        Candidat pour une <b>étape IA</b> (module 5).
      </Callout>
      <Callout title="Pas de connecteur ?" tone="teal" icon="bot" size={24} style={{ flex: 1 }}>
        Candidat pour un <b>robot RPA</b> (module 4).
      </Callout>
    </div>
  </Frame>
);

// ─── Interactive score ──────────────────────────────────────────────────────
const M2_PRESETS: { t: string; v: number[] }[] = [
  { t: 'Saisie des factures', v: [5, 4, 4, 4] },
  { t: 'Rapport hebdomadaire', v: [3, 2, 5, 4] },
  { t: 'Tri des plaintes', v: [5, 4, 2, 4] },
  { t: 'Copie vers un vieux logiciel', v: [4, 3, 5, 1] },
  { t: 'Plan stratégique annuel', v: [1, 1, 1, 3] },
];

const M2_Score: Page = () => {
  const [v, setV] = useState([5, 4, 4, 4]);
  const set = (i: number, x: number) => setV((o) => o.map((y, j) => (j === i ? x : y)));
  const total = v.reduce((a, x) => a + x, 0);
  const verdict =
    total >= 16
      ? { t: 'Excellent candidat', tone: 'green' as Tone, s: 'Gain rapide : à construire en premier.' }
      : total >= 12
        ? { t: 'Bon candidat', tone: 'blue' as Tone, s: 'À automatiser, après une petite simplification.' }
        : total >= 8
          ? { t: 'À simplifier d’abord', tone: 'yellow' as Tone, s: 'Clarifiez le processus avant de construire.' }
          : { t: 'À laisser de côté', tone: 'coral' as Tone, s: 'Peu de gain : gardez votre énergie pour une autre tâche.' };
  const how = v[2] <= 2 ? { icon: 'sparkles' as IconName, t: 'Workflow + étape IA' } : v[3] <= 2 ? { icon: 'bot' as IconName, t: 'Robot RPA' } : { icon: 'puzzle' as IconName, t: 'Workflow sans code' };
  return (
    <Frame mod={2} kind="exercice">
      <Title>Notez une tâche, voyez le verdict</Title>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 196, display: 'flex', gap: 10 }}>
        {M2_PRESETS.map((p) => (
          <Btn key={p.t} ghost size={20} onClick={() => setV(p.v)}>
            {p.t}
          </Btn>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 120, top: 300, width: 1000, display: 'flex', flexDirection: 'column', gap: 26 }}>
        {M2_CRIT.map((c, i) => (
          <div key={c.t} className={A.left} style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 26px', ...dl(i * 100) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <IconTile name={c.icon} tone={c.tone} size={48} />
              <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink, width: 240 }}>{c.t}</span>
              <Range value={v[i]} onChange={(x) => set(i, x)} min={1} max={5} w={480} tone={c.tone} />
              <span style={{ marginLeft: 'auto', fontFamily: display, fontWeight: 700, fontSize: 48, color: c.tone === 'yellow' ? C.amber : STRONG[c.tone] }}>{v[i]}</span>
            </div>
            <div style={{ marginTop: 6, marginLeft: 64, fontSize: 20, color: C.muted }}>
              {c.lo} → {c.hi}
            </div>
          </div>
        ))}
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1180, top: 300, width: 620, height: 600, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '30px 34px', ...dl(200) }}>
        <Eyebrow c={C.muted}>Score</Eyebrow>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 150, lineHeight: 1, color: verdict.tone === 'yellow' ? C.amber : STRONG[verdict.tone] }}>{total}</span>
          <span style={{ fontFamily: display, fontWeight: 600, fontSize: 48, color: C.faint }}>/ 20</span>
        </div>
        <div style={{ marginTop: 10, height: 14, borderRadius: 7, background: C.panel, overflow: 'hidden' }}>
          <div style={{ width: `${(total / 20) * 100}%`, height: '100%', background: STRONG[verdict.tone], transition: `width 400ms ${EASE}` }} />
        </div>
        <div style={{ marginTop: 22, fontFamily: display, fontWeight: 700, fontSize: 40, color: T[verdict.tone].fg }}>{verdict.t}</div>
        <div style={{ marginTop: 4, fontSize: 24, lineHeight: 1.4, color: C.soft }}>{verdict.s}</div>
        <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 14, background: T.blue.bg }}>
          <Icon name={how.icon} size={34} color={T.blue.fg} />
          <div>
            <div style={{ fontSize: 19, color: C.muted }}>Technique probable</div>
            <div style={{ fontSize: 27, fontWeight: 700, color: C.ink }}>{how.t}</div>
          </div>
        </div>
      </div>
    </Frame>
  );
};

// ─── Gain calculator ────────────────────────────────────────────────────────
const M2Input = ({ label, value, set, min, max, step = 1, unit, tone }: { label: string; value: number; set: (x: number) => void; min: number; max: number; step?: number; unit: string; tone: Tone }) => (
  <div style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 24px' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 24, fontWeight: 600, color: C.ink }}>{label}</span>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 40, color: tone === 'yellow' ? C.amber : STRONG[tone] }}>
        {value} <span style={{ fontSize: 24, color: C.muted }}>{unit}</span>
      </span>
    </div>
    <Range value={value} onChange={set} min={min} max={max} step={step} w={880} tone={tone} />
  </div>
);

const M2_Gain: Page = () => {
  const [min, setMin] = useState(10);
  const [n, setN] = useState(15);
  const [pct, setPct] = useState(80);
  const [setup, setSetup] = useState(6);
  const perWeek = (min * n * pct) / 100 / 60;
  const year = perWeek * 46;
  const payback = perWeek > 0 ? setup / perWeek : 0;
  return (
    <Frame mod={2} kind="exercice">
      <Title>Combien de temps rendrait cette automatisation ?</Title>
      <Lede>Le calcul de base, à refaire pour votre tâche. Il servira de point de comparaison au module 10.</Lede>
      <div className={A.left} style={{ position: 'absolute', left: 120, top: 290, width: 940, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <M2Input label="Durée d’une fois" value={min} set={setMin} min={1} max={60} unit="min" tone="blue" />
        <M2Input label="Fois par semaine" value={n} set={setN} min={1} max={100} unit="fois" tone="teal" />
        <M2Input label="Part réellement automatisée" value={pct} set={setPct} min={30} max={100} step={5} unit="%" tone="violet" />
        <M2Input label="Temps de mise en place" value={setup} set={setSetup} min={1} max={40} unit="h" tone="yellow" />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1120, top: 290, width: 680, display: 'flex', flexDirection: 'column', gap: 22, ...dl(200) }}>
        <div style={{ background: G.blue, borderRadius: 20, boxShadow: SHADOW, padding: '28px 34px', color: '#fff' }}>
          <Eyebrow c="#DDEEFA">Temps rendu par an (46 semaines)</Eyebrow>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 130, lineHeight: 1.05 }}>{fr(year, 0)} h</div>
          <div style={{ fontSize: 24, color: '#E6F2FB' }}>soit {fr(perWeek, 1)} h par semaine, environ {fr(year / 7, 0)} journées de travail</div>
        </div>
        <div style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px' }}>
          <Eyebrow c={C.muted}>Rentabilisé après</Eyebrow>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 80, lineHeight: 1.05, color: payback <= 8 ? T.green.fg : payback <= 26 ? C.amber : C.coral }}>
            {fr(payback, 1)} semaines
          </div>
          <div style={{ fontSize: 22, color: C.soft }}>Ajoutez au module 10 le temps de maintenance : une automatisation s’entretient.</div>
        </div>
      </div>
    </Frame>
  );
};

// ─── Exercise 2: score + SIPOC of my task ───────────────────────────────────
const M2_Atelier: Page = () => (
  <AtelierPage
    mod={2}
    kind="exercice"
    n="Exercice 2"
    title="Choisir sa tâche et la décrire en SIPOC"
    timerId="m2-sipoc"
    minutes={25}
    tools="Votre carnet de bord · rubriques 2 et 3 · un assistant IA gratuit si vous voulez un premier jet"
    objective="Identifier la tâche qui consomme le plus de temps pour le moins de jugement, et la décrire sur une page."
    deliver={
      <>
        Rubrique 2 : vos 5 tâches notées sur 20 et la tâche retenue.
        <br />
        Rubrique 3 : son SIPOC (5 colonnes, 4 à 7 étapes) et son gain estimé en heures par an.
      </>
    }
    crit={
      <>
        <CheckItem id="a" size={22}>Les 4 critères notés pour chaque tâche</CheckItem>
        <CheckItem id="b" size={22}>Une tâche retenue, score ≥ 12</CheckItem>
        <CheckItem id="c" size={22}>Un SIPOC complet, étapes avec des verbes</CheckItem>
        <CheckItem id="d" size={22}>Un gain estimé en heures par an</CheckItem>
      </>
    }
  >
    <Do n={1}>Notez vos 5 tâches sur les 4 critères (1 à 5). Gardez la meilleure.</Do>
    <Do n={2}>Écrivez ses étapes (P) : 4 à 7 verbes d’action, dans l’ordre.</Do>
    <Do n={3}>Complétez O et C (ce qui sort, pour qui), puis I et S (ce qui entre, d’où).</Do>
    <Do n={4}>Repérez les voleurs de temps et estimez le gain (calculateur de la page précédente).</Do>
    <Bonus>Demandez à votre assistant IA de critiquer votre SIPOC : « Quelles étapes manquent ? Quels cas particuliers oublié-je ? » Données fictives seulement.</Bonus>
  </AtelierPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M2_Qcm: Page = () => (
  <QcmPage
    mod={2}
    n={2}
    title="Le meilleur candidat"
    q="Laquelle de ces tâches faut-il automatiser en premier ?"
    explain="On cherche la combinaison fréquence + volume + règles claires + outils connectables. Le rapprochement quotidien coche tout ; les autres manquent de fréquence, de règles ou d’enjeu."
  >
    <Opt why="Piège ! Une fois par an : même parfaitement automatisé, le gain est minime pour un effort réel.">
      Préparer le budget annuel du service
    </Opt>
    <Opt why="Piège ! C’est relationnel et délicat : on peut préparer avec l’IA, pas automatiser l’échange.">
      Répondre aux plaintes d’un client stratégique
    </Opt>
    <Opt why="Piège ! Rare et chaque fois différent : la logique ne s’écrit pas.">
      Organiser le party de fin d’année
    </Opt>
    <Opt ok why="Exact : tous les jours, des dizaines de lignes, une règle claire (même montant, même référence), des fichiers numériques. Score proche de 20.">
      Rapprocher chaque jour les paiements reçus et les factures
    </Opt>
  </QcmPage>
);

// ─── Synthesis ──────────────────────────────────────────────────────────────
const M2_Synthese: Page = () => (
  <SynthPage
    mod={2}
    title="Module 2 · Ce qu’il faut retenir"
    poste={
      <>
        Montrez votre SIPOC à une personne qui fait la même tâche : <b>a-t-elle les mêmes étapes ?</b> Les écarts sont vos cas particuliers.
      </>
    }
  >
    <SynthRow n={1} tone="blue" d={100}>
      Comprendre, <b>simplifier</b>, puis automatiser : jamais dans l’autre sens.
    </SynthRow>
    <SynthRow n={2} tone="teal" d={220}>
      Le <b>SIPOC</b> donne la vue d’ensemble ; la <b>carte</b> montre les relais et les attentes.
    </SynthRow>
    <SynthRow n={3} tone="yellow" d={340}>
      Quatre critères : <b>fréquence, volume, règles, outils</b>. Score sur 20.
    </SynthRow>
    <SynthRow n={4} tone="green" d={460}>
      Le gain se calcule : durée × fréquence × part automatisée, moins la mise en place.
    </SynthRow>
  </SynthPage>
);

// ═══ 30-m3 ═════════════════════════════════════════════════════════════

// ═══ Module 3 · Les outils d’automatisation ═════════════════════════════════

const M3_Section: Page = () => (
  <Section n={3} title="Les outils d’automatisation" sub="Quatre familles d’outils, un même vocabulaire, et votre poste prêt pour demain." dur="50 min">
    <SecItem n={1}>Les familles d’outils et comment ils se connectent</SecItem>
    <SecItem n={2}>Make, Zapier, n8n, Power Automate : lequel choisir ?</SecItem>
    <SecItem n={3}>Prise en main de Make et préparation des comptes</SecItem>
  </Section>
);
M3_Section.transition = BLOOM;

// ─── Families ───────────────────────────────────────────────────────────────
const M3Fam = ({ tone, icon, title, apps, d, children }: { tone: Tone; icon: IconName; title: string; apps: AppId[]; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ height: 560, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, padding: '28px 26px', display: 'flex', flexDirection: 'column', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={72} />
    <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.08, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 10, fontSize: 23, lineHeight: 1.42, color: C.soft }}>{children}</div>
    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {apps.map((a) => (
        <AppChip key={a} id={a} size={21} />
      ))}
    </div>
  </div>
);

const M3_Familles: Page = () => (
  <Frame mod={3}>
    <Title>Quatre familles d’outils</Title>
    <Lede>Elles ne se font pas concurrence : elles se complètent, et se combinent souvent dans un même processus.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 26 }}>
      <M3Fam d={100} tone="violet" icon="puzzle" title="Plateformes sans code" apps={['make', 'zapier', 'n8n']}>
        Relient des applications en ligne par leurs connecteurs. Notre outil principal.
      </M3Fam>
      <M3Fam d={220} tone="blue" icon="layers" title="Automatisation des suites" apps={['automate', 'outlook', 'sheets']}>
        Intégrée à Microsoft 365 ou à Google Workspace : pratique si vous y vivez déjà.
      </M3Fam>
      <M3Fam d={340} tone="teal" icon="bot" title="RPA : robots logiciels" apps={['pad', 'uipath']}>
        Un robot reproduit vos clics et vos frappes à l’écran, même sans connecteur.
      </M3Fam>
      <M3Fam d={460} tone="coral" icon="sparkles" title="Assistants et agents IA" apps={['copilot', 'gemini', 'chatgpt']}>
        Comprennent, rédigent, classent. Certains enchaînent déjà des actions seuls.
      </M3Fam>
    </div>
  </Frame>
);

// ─── How a connector works ──────────────────────────────────────────────────
const M3_Connecteur: Page = () => (
  <Frame mod={3} beats={3}>
    <Title>Comment une plateforme relie deux applications</Title>
    <Lede>Pas de magie : chaque application ouvre une porte, l’API. Le connecteur sait y frapper à votre place.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <path d="M520 520 H860" stroke={C.rule} strokeWidth={8} strokeLinecap="round" />
      <path d="M1060 520 H1400" stroke={C.rule} strokeWidth={8} strokeLinecap="round" />
      <FlowDot path="M520 520 H860" dur={2} color={C.blue} r={9} />
      <FlowDot path="M1060 520 H1400" dur={2} begin={1} color={C.green} r={9} />
    </svg>
    <div className={A.in} style={{ position: 'absolute', left: 220, top: 400, width: 300, textAlign: 'center' }}>
      <AppTile id="gmail" size={150} style={{ margin: '0 auto' }} />
      <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 32 }}>Application A</div>
      <div style={{ fontSize: 22, color: C.muted }}>« un nouveau courriel »</div>
    </div>
    <div className={A.pop} style={{ position: 'absolute', left: 860, top: 400, width: 200, textAlign: 'center', ...dl(300) }}>
      <AppTile id="make" size={150} style={{ margin: '0 auto' }} />
      <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 32 }}>Plateforme</div>
      <div style={{ fontSize: 22, color: C.muted }}>applique vos règles</div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1400, top: 400, width: 300, textAlign: 'center', ...dl(500) }}>
      <AppTile id="sheets" size={150} style={{ margin: '0 auto' }} />
      <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 32 }}>Application B</div>
      <div style={{ fontSize: 22, color: C.muted }}>« ajouter une ligne »</div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 700, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
      <Card tone="blue" icon="key" title="1 · Connexion" size={23} cls={b.on(1)}>
        Vous autorisez une fois la plateforme à agir en votre nom (compte, ou clé d’API).
      </Card>
      <Card tone="yellow" icon="clock" title="2 · Vérification ou signal" size={23} cls={b.on(2)}>
        La plateforme <b>vérifie</b> toutes les X minutes, ou l’application l’<b>avertit</b> à l’instant (webhook).
      </Card>
      <Card tone="green" icon="send" title="3 · Action" size={23} cls={b.on(3)}>
        Elle lit ou écrit les données, puis passe à l’étape suivante.
      </Card>
    </div>
  </Frame>
);

// ─── Panorama (perishable: free offers) ─────────────────────────────────────
const M3_TOOLS: { id: AppId; who: string; plus: string[]; free: string; minus: string }[] = [
  {
    id: 'make',
    who: 'Workflows visuels à plusieurs étapes, avec conditions et IA',
    plus: ['Éditeur visuel très lisible', 'Routeurs, filtres, gestion d’erreurs', 'Modules IA prêts à l’emploi (Gemini, OpenAI…)'],
    free: '1 000 crédits par mois · 2 scénarios actifs · exécution au plus toutes les 15 min',
    minus: 'Chaque module exécuté consomme des crédits : on teste avec parcimonie.',
  },
  {
    id: 'zapier',
    who: 'Automatisations simples et rapides, catalogue d’applications immense',
    plus: ['Le plus simple à prendre en main', 'Des milliers d’applications', 'Assistant IA pour construire'],
    free: '100 tâches par mois · Zaps à 2 étapes (un déclencheur, une action)',
    minus: 'Le multi-étapes et les conditions demandent une offre payante.',
  },
  {
    id: 'n8n',
    who: 'Équipes techniques qui veulent garder la main sur leurs données',
    plus: ['Code source ouvert, très puissant', 'Hébergeable chez soi (données internes)', 'Nœuds IA et agents avancés'],
    free: 'Gratuit en auto-hébergement (Community Edition) · version infonuagique payante après un essai',
    minus: 'L’auto-hébergement demande un serveur et des compétences techniques.',
  },
  {
    id: 'automate',
    who: 'Organisations sous Microsoft 365 (Outlook, Teams, SharePoint)',
    plus: ['Intégré à Microsoft 365', 'Approbations Teams, SharePoint, Excel', 'Volet RPA avec Power Automate Desktop'],
    free: 'Flux infonuagiques inclus dans la plupart des licences Microsoft 365 · connecteurs Premium et AI Builder payants',
    minus: 'Sans licence Microsoft 365, l’accès est limité : vérifiez avec votre service informatique.',
  },
  {
    id: 'pad',
    who: 'Robots sur votre poste Windows : logiciels sans connecteur, fichiers, Excel',
    plus: ['Gratuit pour Windows 10 et 11', 'Enregistreur d’actions', 'Excel, fichiers, navigateur, applications'],
    free: 'Gratuit en mode « assisté » : le robot tourne quand vous le lancez, sur votre poste',
    minus: 'Robots planifiés et sans surveillance : licence payante.',
  },
];

const M3_Panorama: Page = () => (
  <Frame mod={3}>
    <Title>Cinq outils, cinq profils</Title>
    <Tabs initial="make" cls={A.in} style={{ position: 'absolute', left: 120, top: 196, width: 1680 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        {M3_TOOLS.map((t) => (
          <TabBtn key={t.id} id={t.id} app={t.id}>
            {APPS[t.id].short}
          </TabBtn>
        ))}
      </div>
      {M3_TOOLS.map((t) => (
        <TabPane key={t.id} id={t.id}>
          <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
            <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '28px 32px', height: 560, boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <AppTile id={t.id} size={90} />
                <div style={{ fontFamily: display, fontWeight: 700, fontSize: 50, color: C.ink }}>{APPS[t.id].name}</div>
              </div>
              <div style={{ marginTop: 20, fontSize: 26, lineHeight: 1.4, color: C.soft }}>
                <b style={{ color: C.ink }}>Pour qui :</b> {t.who}
              </div>
              <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {t.plus.map((p) => (
                  <Bullet key={p} tone="green" size={25}>
                    {p}
                  </Bullet>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <Callout title="Offre gratuite" tone="green" icon="money" size={26}>
                {t.free}
              </Callout>
              <Callout title="À savoir" tone="coral" icon="alert" size={26}>
                {t.minus}
              </Callout>
            </div>
          </div>
        </TabPane>
      ))}
    </Tabs>
    <Verified style={{ position: 'absolute', left: 120, top: 905 }} />
  </Frame>
);

// ─── Rosetta: same ideas, different words ───────────────────────────────────
const M3_Vocab: Page = () => (
  <Frame mod={3}>
    <Title>Mêmes idées, mots différents</Title>
    <Lede>Apprenez les concepts une fois : vous les retrouverez dans tous les outils.</Lede>
    <Table
      cls={A.in}
      style={{ position: 'absolute', left: 120, top: 280, width: 1680 }}
      cols="330px repeat(4, 1fr)"
      size={23}
      head={[
        'Concept',
        <AppChip key="m" id="make" size={20} />,
        <AppChip key="z" id="zapier" size={20} />,
        <AppChip key="n" id="n8n" size={20} />,
        <AppChip key="p" id="automate" size={20} />,
      ]}
      rows={[
        ['L’automatisation', 'Scénario', 'Zap', 'Workflow', 'Flux (flow)'],
        ['Ce qui la démarre', 'Module déclencheur', 'Trigger', 'Nœud Trigger', 'Déclencheur'],
        ['Une étape', 'Module', 'Action', 'Nœud', 'Action'],
        ['Les conditions', 'Filtre, routeur', 'Filter, Paths', 'IF, Switch', 'Condition, Switch'],
        ['Ce qu’on paie', 'Crédits', 'Tâches', 'Exécutions', 'Licences, exécutions'],
        ['L’historique', 'History', 'Zap history', 'Executions', 'Historique d’exécution'],
      ]}
    />
  </Frame>
);

// ─── Which tool? (interactive) ──────────────────────────────────────────────
const M3_Choisir: Page = () => {
  const [screen, setScreen] = useState(false);
  const [m365, setM365] = useState(false);
  const [it, setIt] = useState(false);
  const [simple, setSimple] = useState(false);
  const pick: { id: AppId; why: string } = screen
    ? { id: 'pad', why: 'Un logiciel sans connecteur : il faut un robot qui agit à l’écran.' }
    : m365
      ? { id: 'automate', why: 'Vous vivez dans Microsoft 365 et la licence est là : restez chez vous.' }
      : it
        ? { id: 'n8n', why: 'Une équipe technique peut l’héberger : les données restent chez vous.' }
        : simple
          ? { id: 'zapier', why: 'Un déclencheur, une action : l’offre gratuite suffit, et c’est le plus simple.' }
          : { id: 'make', why: 'Plusieurs étapes, des conditions, de l’IA, sans budget : le meilleur compromis.' };
  return (
    <Frame mod={3} kind="exercice">
      <Title>Quel outil pour quel besoin ?</Title>
      <Lede w={900}>Répondez aux quatre questions pour la tâche de votre carnet. Je les coche selon vos réponses.</Lede>
      <div className={A.left} style={{ position: 'absolute', left: 120, top: 340, width: 900, display: 'flex', flexDirection: 'column', gap: 30 }}>
        <Toggle on={screen} onChange={setScreen} tone="teal" label="Une application n’a ni connecteur ni API (vieux logiciel, site sans accès)" />
        <Toggle on={m365} onChange={setM365} tone="blue" label="Votre organisation vit dans Microsoft 365, licence comprise" />
        <Toggle on={it} onChange={setIt} tone="coral" label="Une équipe technique peut héberger un outil en interne" />
        <Toggle on={simple} onChange={setSimple} tone="yellow" label="Il suffit d’un déclencheur et d’une seule action" />
      </div>
      <div key={pick.id} className={A.pop} style={{ position: 'absolute', left: 1130, top: 300, width: 670, height: 560, boxSizing: 'border-box', background: C.card, borderRadius: 22, boxShadow: SHADOW, padding: '40px 40px', textAlign: 'center' }}>
        <Eyebrow c={C.muted}>Piste recommandée</Eyebrow>
        <AppTile id={pick.id} size={170} style={{ margin: '30px auto 0' }} />
        <div style={{ marginTop: 24, fontFamily: display, fontWeight: 700, fontSize: 56, color: C.ink }}>{APPS[pick.id].name}</div>
        <div style={{ marginTop: 14, fontSize: 26, lineHeight: 1.4, color: C.soft }}>{pick.why}</div>
      </div>
      <Hint style={{ position: 'absolute', left: 120, top: 900 }}>Les questions sont lues dans l’ordre : la première réponse « oui » l’emporte.</Hint>
    </Frame>
  );
};

// ─── Make: interface tour ───────────────────────────────────────────────────
const M3_Make: Page = () => (
  <Frame mod={3} kind="demo">
    <Title>Make en un coup d’œil</Title>
    <Hint style={{ position: 'absolute', left: 120, top: 184 }}>Cliquez les pastilles : les cinq zones à connaître avant demain.</Hint>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 240, width: 1680, height: 660, borderRadius: 18, overflow: 'hidden', background: C.card, boxShadow: SHADOW }}>
      <div style={{ height: 64, display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px', background: '#2B1A4A', color: '#fff' }}>
        <AppTile id="make" size={40} />
        <span style={{ fontSize: 24, fontWeight: 600 }}>Mon premier scénario</span>
        <span style={{ marginLeft: 'auto', fontSize: 20, opacity: 0.8 }}>Scenarios · Connections · Webhooks · Data stores</span>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 64, right: 0, bottom: 86, backgroundImage: `radial-gradient(${C.rule} 2px, transparent 2px)`, backgroundSize: '28px 28px' }} />
      <Chain
        x={260}
        y={250}
        size={130}
        gap={180}
        items={[
          { app: 'sheets', label: 'Google Sheets', sub: 'Watch New Rows' },
          { app: 'gemini', label: 'Google Gemini AI', sub: 'Generate a response' },
          { app: 'gmail', label: 'Gmail', sub: 'Send an email' },
        ]}
      />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 86, display: 'flex', alignItems: 'center', gap: 22, padding: '0 26px', background: C.panel, borderTop: `1.5px solid ${C.rule}` }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 22px', borderRadius: 12, background: '#6D00CC', color: '#fff', fontWeight: 700, fontSize: 22 }}>
          <Icon name="play" size={22} /> Run once
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.soft }}>
          <span style={{ width: 52, height: 30, borderRadius: 99, background: '#CBD4DB' }} /> Every 15 minutes
        </span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 21, color: C.soft }}>
          <Icon name="clock" size={22} /> History
        </span>
      </div>
    </div>
    <Hotspot n={1} x={460} y={480} title="Le module déclencheur">
      Toujours le premier, à gauche. L’horloge indique qu’il vérifie l’application à intervalles réguliers.
    </Hotspot>
    <Hotspot n={2} x={650} y={556} side="below" title="Le lien entre modules">
      Un clic sur le lien permet d’ajouter un filtre : « ne continuer que si… ».
    </Hotspot>
    <Hotspot n={3} x={330} y={835} title="Run once">
      Exécute le scénario une seule fois, tout de suite : c’est votre bouton de test.
    </Hotspot>
    <Hotspot n={4} x={620} y={835} title="La planification">
      Active le scénario en continu, toutes les X minutes. On l’active seulement quand tout est testé.
    </Hotspot>
    <Hotspot n={5} x={1600} y={835} side="left" title="L’historique">
      Chaque exécution, ses données et ses erreurs : votre outil de diagnostic.
    </Hotspot>
  </Frame>
);

// ─── Setup ──────────────────────────────────────────────────────────────────
const M3_Setup: Page = () => (
  <AtelierPage
    mod={3}
    n="Préparation"
    title="Votre poste prêt pour les ateliers"
    timerId="m3-setup"
    minutes={15}
    tools="make.com · Google Sheets · aistudio.google.com · Copilot, Gemini ou ChatGPT (comptes gratuits)"
    objective="Créer les comptes gratuits et le fichier dont vous aurez besoin demain, pour que les ateliers ne commencent pas par une inscription."
    deliver={
      <>
        Un compte Make actif, un classeur Google Sheets <b>« Demandes IA135 »</b> et une clé d’API Gemini rangée en lieu sûr.
        <div style={{ marginTop: 10, fontSize: 21, color: C.coral, fontWeight: 600 }}>Ne collez jamais votre clé dans le Chat.</div>
      </>
    }
    crit={
      <>
        <CheckItem id="a" size={22}>Connecté à Make (offre gratuite)</CheckItem>
        <CheckItem id="b" size={22}>Classeur créé, en-têtes en ligne 1</CheckItem>
        <CheckItem id="c" size={22}>Clé Gemini créée et notée</CheckItem>
        <CheckItem id="d" size={22}>Un assistant IA ouvert dans un onglet</CheckItem>
      </>
    }
  >
    <Do n={1}>
      <b>make.com</b> › <Kbd>Get started free</Kbd> : inscrivez-vous avec votre compte Google.
    </Do>
    <Do n={2}>
      Dans Google Sheets, créez <b>« Demandes IA135 »</b> avec, en ligne 1 : Date · Nom · Courriel · Message · Catégorie · Priorité · Résumé.
    </Do>
    <Do n={3}>
      <b>aistudio.google.com</b> › <Kbd>Get API key</Kbd> › <Kbd>Create API key</Kbd>. Copiez-la dans un fichier personnel.
    </Do>
    <Do n={4}>Ouvrez un assistant IA gratuit (Copilot, Gemini ou ChatGPT) : il servira au module 5.</Do>
    <Bonus>Sous Windows 10 ou 11 ? Installez Power Automate Desktop (Microsoft Store, gratuit) pour suivre la démo du module 4.</Bonus>
  </AtelierPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M3_Qcm: Page = () => (
  <QcmPage
    mod={3}
    n={3}
    title="Choisir son outil"
    q="Sans budget, vous voulez relier Gmail, Google Sheets et une IA dans un workflow de six étapes avec un routeur. Quel outil ?"
    explain="Plusieurs étapes, des conditions et de l’IA sans payer : Make (offre gratuite) est le bon compromis. Zapier gratuit s’arrête à deux étapes, n8n infonuagique est payant, et un robot d’écran n’est pas fait pour relier des applications en ligne."
  >
    <Opt ok why="Exact : l’offre gratuite accepte routeurs et modules IA. Seule limite : 1 000 crédits par mois, à surveiller.">
      Make, offre gratuite
    </Opt>
    <Opt why="Piège ! L’offre gratuite de Zapier se limite à des Zaps de deux étapes, sans Paths.">
      Zapier, offre gratuite
    </Opt>
    <Opt why="Piège ! La version infonuagique de n8n est payante après l’essai ; la version gratuite demande un serveur.">
      n8n, version infonuagique
    </Opt>
    <Opt why="Piège ! Power Automate Desktop pilote l’écran de votre poste : inutile quand les applications ont des connecteurs.">
      Power Automate Desktop
    </Opt>
  </QcmPage>
);

// ─── Synthesis ──────────────────────────────────────────────────────────────
const M3_Synthese: Page = () => (
  <SynthPage
    mod={3}
    title="Module 3 · Ce qu’il faut retenir"
    poste={
      <>
        Demandez à votre service informatique quels outils sont <b>autorisés</b> chez vous et quelles données peuvent y passer. Notez la réponse dans votre carnet.
      </>
    }
  >
    <SynthRow n={1} tone="violet" d={100}>
      Quatre familles : <b>sans code</b>, suites bureautiques, <b>RPA</b>, assistants IA.
    </SynthRow>
    <SynthRow n={2} tone="blue" d={220}>
      Un connecteur passe par l’<b>API</b> : il vérifie à intervalles, ou reçoit un signal (webhook).
    </SynthRow>
    <SynthRow n={3} tone="teal" d={340}>
      Scénario, Zap, workflow, flux : <b>les mêmes concepts</b> partout.
    </SynthRow>
    <SynthRow n={4} tone="green" d={460}>
      Sans budget et avec plusieurs étapes : <b>Make</b>. Les offres gratuites changent : revérifiez-les.
    </SynthRow>
  </SynthPage>
);

// ═══ 40-m4 ═════════════════════════════════════════════════════════════

// ═══ Module 4 · RPA, les robots logiciels ═══════════════════════════════════

const M4_Section: Page = () => (
  <Section n={4} title="RPA · les robots logiciels" sub="Quand il n’y a pas de connecteur, un robot fait les clics à votre place." dur="50 min" kind="demo">
    <SecItem n={1}>Comment fonctionne un robot logiciel ?</SecItem>
    <SecItem n={2}>Cas d’usage : courriels, fichiers, rapports</SecItem>
    <SecItem n={3}>Démonstration et limites</SecItem>
  </Section>
);
M4_Section.transition = BLOOM;

// ─── The robot at work (animated) ───────────────────────────────────────────
const M4_SPOTS = [
  { x: 80, y: 85 },
  { x: 600, y: 130 },
  { x: 600, y: 220 },
  { x: 600, y: 310 },
  { x: 500, y: 400 },
  { x: 500, y: 400 },
];
const M4Field = ({ label, value, on }: { label: string; value: string; on: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <span style={{ width: 200, fontSize: 21, color: C.muted, textAlign: 'right' }}>{label}</span>
    <span style={{ width: 380, height: 50, boxSizing: 'border-box', padding: '0 14px', display: 'flex', alignItems: 'center', borderRadius: 8, background: '#fff', boxShadow: `inset 0 0 0 2px ${on ? C.blue : C.rule}`, fontFamily: mono, fontSize: 21, color: C.ink, overflow: 'hidden', whiteSpace: 'nowrap' }}>
      {on ? value : ''}
    </span>
  </div>
);

const M4_Robot: Page = () => {
  const live = useIsActivePage();
  const [s, setS] = useState(5);
  useEffect(() => {
    if (!live) {
      setS(5);
      return;
    }
    setS(0);
    const h = window.setInterval(() => setS((x) => (x + 1) % 6), 1100);
    return () => window.clearInterval(h);
  }, [live]);
  const p = M4_SPOTS[s];
  return (
    <Frame mod={4}>
      <Title>Un robot logiciel imite vos gestes à l’écran</Title>
      <Lede w={760}>Il ne « voit » pas comme vous : il repère les éléments de l’interface (champs, boutons) et agit dessus, très vite, sans se lasser.</Lede>
      <div style={{ position: 'absolute', left: 120, top: 430, width: 760, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {(
          [
            ['search', 'blue', 'Repérer', 'un champ, un bouton, une cellule, grâce à ses propriétés (son « sélecteur »)'],
            ['pointer', 'teal', 'Agir', 'cliquer, taper, copier, ouvrir un fichier, lire un texte'],
            ['loop', 'green', 'Enchaîner', 'répéter pour chaque ligne, décider selon une condition, noter ce qu’il a fait'],
          ] as [IconName, Tone, string, string][]
        ).map(([i, t, h, d], n) => (
          <div key={h} className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px', ...dl(200 + n * 150) }}>
            <IconTile name={i} tone={t} size={58} />
            <div style={{ fontSize: 24, lineHeight: 1.35, color: C.soft }}>
              <b style={{ fontFamily: display, fontSize: 30, color: C.ink }}>{h}</b> · {d}
            </div>
          </div>
        ))}
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 960, top: 230, width: 840, height: 620, borderRadius: 16, background: C.card, boxShadow: SHADOW, overflow: 'hidden', ...dl(200) }}>
        <div style={{ height: 52, display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', background: '#5C6670', color: '#fff', fontSize: 20 }}>
          <Icon name="server" size={22} color="#fff" /> GestiDossiers 2009 · Nouveau dossier client
        </div>
        <div style={{ display: 'flex', height: 568 }}>
          <div style={{ width: 200, background: C.panel, padding: '20px 16px', boxSizing: 'border-box' }}>
            <div style={{ padding: '10px 12px', borderRadius: 8, background: s >= 1 && s <= 4 ? T.blue.bg : 'transparent', fontSize: 20, fontWeight: 600, color: C.ink }}>+ Nouveau</div>
            <div style={{ padding: '10px 12px', fontSize: 20, color: C.muted }}>Rechercher</div>
            <div style={{ padding: '10px 12px', fontSize: 20, color: C.muted }}>Rapports</div>
          </div>
          <div style={{ flex: 1, padding: '60px 0 0 0', display: 'flex', flexDirection: 'column', gap: 40 }}>
            <M4Field label="Nom" value="Garage Duval inc." on={s >= 2 && s <= 4} />
            <M4Field label="Courriel" value="info@garageduval.ca" on={s >= 3 && s <= 4} />
            <M4Field label="Montant" value="2 480,00" on={s >= 4} />
            <div style={{ marginLeft: 216, width: 180, height: 56, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: s === 5 ? C.green : C.blue, color: '#fff', fontWeight: 700, fontSize: 22, transition: 'background 300ms' }}>
              {s === 5 ? 'Enregistré ✓' : 'Enregistrer'}
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${p.x}px, ${p.y}px)`, transition: `transform 700ms ${EASE}` }}>
          <Icon name="pointer" size={44} color={C.ink} style={{ filter: 'drop-shadow(0 3px 4px rgba(0,0,0,.3))' }} />
        </div>
      </div>
    </Frame>
  );
};

// ─── UI vs API ──────────────────────────────────────────────────────────────
const M4_Api: Page = () => (
  <Frame mod={4} beats={1}>
    <Title>Par l’écran ou par la porte de service ?</Title>
    <Lede>Le robot RPA passe par l’écran, comme un humain. Un connecteur passe par l’API, la porte prévue pour les programmes.</Lede>
    <Card tone="teal" icon="bot" title="RPA · par l’écran" size={25} cls={A.left} style={{ position: 'absolute', left: 120, top: 300, width: 810, height: 470 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Bullet tone="green">Fonctionne avec <b>n’importe quel logiciel</b>, même ancien</Bullet>
        <Bullet tone="green">Aucun accès technique à demander</Bullet>
        <Bullet tone="coral">Plus lent : il attend que l’écran s’affiche</Bullet>
        <Bullet tone="coral">Fragile : un bouton déplacé, et il se perd</Bullet>
      </div>
    </Card>
    <Card tone="violet" icon="plug" title="Connecteur · par l’API" size={25} cls={A.right} style={{ position: 'absolute', left: 990, top: 300, width: 810, height: 470 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Bullet tone="green">Rapide et <b>robuste</b> : l’interface peut changer</Bullet>
        <Bullet tone="green">Fonctionne sans écran, en continu</Bullet>
        <Bullet tone="coral">Seulement si l’application propose une API</Bullet>
        <Bullet tone="coral">Demande parfois une autorisation technique</Bullet>
      </div>
    </Card>
    <Callout cls={b.on(1)} title="La règle" style={{ position: 'absolute', left: 120, top: 810, width: 1680 }}>
      Un connecteur existe ? On l’utilise. Le RPA est le <Hl>plan B</Hl> pour les logiciels sans porte de service.
    </Callout>
  </Frame>
);

// ─── Attended / unattended ──────────────────────────────────────────────────
const M4_Modes: Page = () => (
  <Frame mod={4}>
    <Title>Robot assisté ou robot autonome</Title>
    <Table
      cls={A.in}
      style={{ position: 'absolute', left: 120, top: 220, width: 1680 }}
      cols="300px 1fr 1fr"
      size={25}
      head={['', 'Assisté (attended)', 'Non assisté (unattended)']}
      rows={[
        ['Qui le lance ?', 'Vous, d’un clic, quand vous en avez besoin', 'Un horaire ou un événement, sans personne'],
        ['Où tourne-t-il ?', 'Sur votre poste, pendant que vous êtes là', 'Sur un poste ou un serveur dédié, même la nuit'],
        ['Pour quoi ?', 'Gagner du temps sur vos propres tâches', 'Traiter des volumes en continu'],
        ['Avec Power Automate Desktop', 'Gratuit sous Windows 10 et 11', 'Licence payante (exécution planifiée)'],
      ]}
    />
    <Callout cls={A.in} tone="teal" icon="bot" title="Pour ces deux jours" style={{ position: 'absolute', left: 120, top: 700, width: 1680, ...dl(400) }}>
      On reste en mode <b>assisté</b> : un robot que vous lancez vous-même, sur votre poste, gratuitement.
    </Callout>
  </Frame>
);

// ─── Building blocks ────────────────────────────────────────────────────────
const M4_BLOCKS: { icon: IconName; tone: Tone; t: string; s: string }[] = [
  { icon: 'database', tone: 'teal', t: 'Variables', s: 'Des « boîtes » qui gardent une valeur : un nom de fichier, un montant.' },
  { icon: 'loop', tone: 'blue', t: 'Boucles', s: 'Pour chaque fichier, chaque ligne, chaque courriel : la même suite d’actions.' },
  { icon: 'split', tone: 'yellow', t: 'Conditions', s: 'Si le montant dépasse 1 000 $, alors… sinon…' },
  { icon: 'target', tone: 'violet', t: 'Sélecteurs', s: 'L’adresse d’un élément à l’écran : le bouton « Enregistrer » de telle fenêtre.' },
  { icon: 'alert', tone: 'coral', t: 'Gestion d’erreurs', s: 'Que faire si une fenêtre n’apparaît pas ? Réessayer, passer, prévenir.' },
  { icon: 'note', tone: 'green', t: 'Journal', s: 'Ce que le robot a fait, ligne par ligne : indispensable pour vérifier.' },
];

const M4_Anatomie: Page = () => (
  <Frame mod={4}>
    <Title>Les six briques de tout robot</Title>
    <Lede>Les mêmes briques se retrouvent dans Power Automate Desktop, UiPath… et dans les workflows sans code.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26 }}>
      {M4_BLOCKS.map((x, i) => (
        <Card key={x.t} tone={x.tone} icon={x.icon} title={x.t} size={24} cls={A.in} style={{ height: 270, ...dl(100 + i * 90) }}>
          {x.s}
        </Card>
      ))}
    </div>
  </Frame>
);

// ─── Use cases (tabs) ───────────────────────────────────────────────────────
const M4_CASES: { id: string; icon: IconName; t: string; cas: string; nodes: FlowItem[]; gain: string }[] = [
  {
    id: 'mails',
    icon: 'mail',
    t: 'Extraction de données d’emails',
    cas: 'Courtier d’assurance · demandes de soumission',
    nodes: [
      { kind: 'trigger', label: 'Nouveau courriel', sub: 'Dossier « Soumissions »' },
      { kind: 'robot', label: 'Lit le corps', sub: 'Nom, adresse, véhicule' },
      { kind: 'robot', label: 'Saisit dans le logiciel', sub: 'Logiciel de courtage sans API' },
      { kind: 'out', label: 'Dossier créé', sub: 'Numéro renvoyé au client' },
    ],
    gain: 'Le formulaire du courriel est toujours le même : des règles suffisent. Texte libre ? On ajoute une étape IA (module 5).',
  },
  {
    id: 'files',
    icon: 'folder',
    t: 'Synchronisation entre fichiers',
    cas: 'Agence immobilière · fiches de propriétés',
    nodes: [
      { kind: 'trigger', label: 'Fichier déposé', sub: 'Dossier « À traiter »' },
      { kind: 'robot', label: 'Renomme et range', sub: 'Date + adresse' },
      { kind: 'robot', label: 'Met à jour Excel', sub: 'Une ligne par propriété' },
      { kind: 'out', label: 'Tout est à jour', sub: 'Dossier partagé + tableau' },
    ],
    gain: 'Plus de version « finale_v3 » : un seul nommage, un seul tableau, toujours synchronisés.',
  },
  {
    id: 'reports',
    icon: 'chart',
    t: 'Automatisation des rapports',
    cas: 'Distributeur alimentaire · rapport des ventes du lundi',
    nodes: [
      { kind: 'trigger', label: 'Lundi 7 h', sub: 'Planifié' },
      { kind: 'robot', label: 'Exporte du logiciel', sub: 'Ventes de la semaine' },
      { kind: 'robot', label: 'Met en forme', sub: 'Tableau croisé, graphique' },
      { kind: 'action', label: 'Envoie le PDF', sub: 'Aux directeurs' },
    ],
    gain: 'Le rapport qui prenait la matinée du lundi est dans les boîtes à 7 h 05.',
  },
];

const M4_Cas: Page = () => (
  <Frame mod={4} kind="cas">
    <Title>Trois cas d’usage du RPA</Title>
    <Tabs initial="mails" cls={A.in} style={{ position: 'absolute', left: 120, top: 196, width: 1680 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        {M4_CASES.map((c) => (
          <TabBtn key={c.id} id={c.id} icon={c.icon} tone="teal">
            {c.t}
          </TabBtn>
        ))}
      </div>
      {M4_CASES.map((c) => (
        <TabPane key={c.id} id={c.id}>
          <div style={{ position: 'relative', height: 640 }}>
            <CasTag style={{ marginTop: 30 }}>{c.cas}</CasTag>
            <FlowRow x={0} y={130} w={360} gap={80} nodes={c.nodes} />
            <Callout title="Ce que ça change" tone="green" icon="trend" style={{ position: 'absolute', left: 0, top: 420, width: 1680 }}>
              {c.gain}
            </Callout>
          </div>
        </TabPane>
      ))}
    </Tabs>
  </Frame>
);

// ─── Demo: Power Automate Desktop ───────────────────────────────────────────
const M4Act = ({ n, icon, children, ind = 0, beat }: { n: number; icon: IconName; children: ReactNode; ind?: number; beat: number }) => (
  <div className={b.left(beat)} style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: ind * 44, background: C.card, borderRadius: 10, boxShadow: SHADOW_SM, padding: '10px 16px' }}>
    <span style={{ width: 28, fontFamily: mono, fontSize: 19, color: C.faint }}>{n}</span>
    <Icon name={icon} size={26} color={C.blue} />
    <span style={{ fontSize: 23, color: C.ink }}>{children}</span>
  </div>
);

const M4_Demo: Page = () => (
  <Frame mod={4} kind="demo" beats={7}>
    <Title>Démo · Power Automate Desktop range les factures</Title>
    <div style={{ position: 'absolute', left: 120, top: 190 }}>
      <CasTag>Cabinet de comptabilité · le dossier « À traiter » déborde</CasTag>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1000, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <M4Act beat={1} n={1} icon="folder">
        Obtenir les fichiers du dossier <b>« À traiter »</b> (*.pdf)
      </M4Act>
      <M4Act beat={2} n={2} icon="loop">
        Pour chaque fichier…
      </M4Act>
      <M4Act beat={3} n={3} icon="clock" ind={1}>
        Lire la date du jour (format AAAA-MM)
      </M4Act>
      <M4Act beat={4} n={4} icon="doc" ind={1}>
        Renommer : <b>AAAA-MM-JJ_nom-du-fichier.pdf</b>
      </M4Act>
      <M4Act beat={5} n={5} icon="archive" ind={1}>
        Déplacer vers <b>Archives\AAAA-MM</b> (créer le dossier s’il manque)
      </M4Act>
      <M4Act beat={6} n={6} icon="table" ind={1}>
        Écrire une ligne dans <b>journal.xlsx</b> : nom, date, emplacement
      </M4Act>
      <M4Act beat={7} n={7} icon="bell">
        Afficher un message : « 12 fichiers traités »
      </M4Act>
    </div>
    <div style={{ position: 'absolute', left: 1180, top: 270, width: 620, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card tone="teal" icon="bot" title="À montrer" size={23} cls={A.right}>
        L’enregistreur d’actions, le volet des variables, l’exécution pas à pas, puis le journal Excel rempli.
      </Card>
      <Callout cls={A.right} title="Pas de Windows ?" tone="blue" icon="eye" size={23} style={dl(200)}>
        Suivez la démo : on reconstruira la même logique dans Make demain.
      </Callout>
      <Verified cls={A.fade} style={dl(400)}>
        Libellés des actions selon la version française de Power Automate Desktop.
      </Verified>
    </div>
  </Frame>
);

// ─── Limits and countermeasures ─────────────────────────────────────────────
const M4Risk = ({ beat, risk, fix }: { beat: number; risk: ReactNode; fix: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 1fr', alignItems: 'center' }}>
    <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 16, background: T.coral.bg, borderRadius: 14, padding: '16px 22px', fontSize: 24, color: C.ink, ...dl(beat * 80) }}>
      <Icon name="alert" size={30} color={T.coral.fg} /> {risk}
    </div>
    <div className={b.fade(beat)} style={{ display: 'flex', justifyContent: 'center' }}>
      <FlowArrow w={64} color={C.green} />
    </div>
    <div className={b.on(beat)} style={{ display: 'flex', alignItems: 'center', gap: 16, background: T.green.bg, borderRadius: 14, padding: '16px 22px', fontSize: 24, color: C.ink }}>
      <Icon name="shieldCheck" size={30} color={T.green.fg} /> {fix}
    </div>
  </div>
);

const M4_Fragile: Page = () => (
  <Frame mod={4} beats={5}>
    <Title>Pourquoi un robot tombe en panne, et comment l’éviter</Title>
    <Lede>Un robot RPA est aussi solide que l’écran qu’il imite. Pour chaque risque, une parade.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M4Risk beat={1} risk="L’interface change (mise à jour du logiciel)" fix="Sélecteurs robustes, tests après chaque mise à jour" />
      <M4Risk beat={2} risk="Une fenêtre inattendue apparaît" fix="Prévoir le cas : fermer, réessayer, ou s’arrêter proprement" />
      <M4Risk beat={3} risk="Le logiciel est lent à répondre" fix="Attendre qu’un élément apparaisse, pas un délai fixe" />
      <M4Risk beat={4} risk="Une donnée imprévue (champ vide, format bizarre)" fix="Vérifier avant de saisir, mettre de côté les cas douteux" />
      <M4Risk beat={5} risk="Personne ne sait ce que le robot a fait" fix="Un journal à chaque exécution, et un responsable nommé" />
    </div>
  </Frame>
);

// ─── Exercise: put the robot steps in order ─────────────────────────────────
const M4_Ordre: Page = () => (
  <Frame mod={4} kind="exercice">
    <Title>Remettez le robot dans l’ordre</Title>
    <Lede w={1680}>Un robot saisit les commandes reçues par courriel dans un vieux logiciel. Dites-moi l’ordre des étapes ; je déplace les étiquettes.</Lede>
    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
      <div key={i} style={{ position: 'absolute', left: 1080, top: 280 + (i - 1) * 88, width: 720, height: 72, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 16, paddingLeft: 16, borderRadius: 12, boxShadow: `inset 0 0 0 2px ${C.rule}`, background: 'rgba(255,255,255,.5)' }}>
        <Num n={i} tone="teal" size={40} />
      </div>
    ))}
    <Drag x={120} y={280} w={860} tone="teal">Pour chaque courriel non lu…</Drag>
    <Drag x={120} y={368} w={860} tone="teal">Ouvrir le dossier « Commandes » dans Outlook</Drag>
    <Drag x={120} y={456} w={860} tone="teal">Lire le numéro de client et les quantités</Drag>
    <Drag x={120} y={544} w={860} tone="teal">Marquer le courriel comme traité et écrire au journal</Drag>
    <Drag x={120} y={632} w={860} tone="teal">Ouvrir le logiciel de commandes et cliquer « Nouvelle »</Drag>
    <Drag x={120} y={720} w={860} tone="teal">Si un champ manque : mettre le courriel de côté</Drag>
    <Drag x={120} y={808} w={860} tone="teal">Saisir les champs et cliquer « Enregistrer »</Drag>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M4_Qcm: Page = () => (
  <QcmPage
    mod={4}
    n={4}
    title="RPA ou connecteur ?"
    q="Chaque soir, il faut copier les nouvelles inscriptions d’un formulaire Google vers un logiciel de paie installé sur un vieux poste Windows, sans API. Quelle solution ?"
    explain="Le logiciel de paie n’a ni connecteur ni API : seul un robot qui agit à l’écran peut y saisir. Côté Google, un connecteur suffit pour récupérer les inscriptions."
  >
    <Opt why="Piège ! Make ne peut pas écrire dans un logiciel qui n’a pas d’API : il n’a pas de porte où frapper.">
      Un scénario Make avec un connecteur vers le logiciel de paie
    </Opt>
    <Opt why="Piège ! Une IA comprend le texte, mais elle ne remplace pas la saisie dans le logiciel.">
      Une IA générative qui lit les inscriptions
    </Opt>
    <Opt ok why="Exact : le robot lit les inscriptions, puis saisit dans le logiciel comme un humain. On ajoute un journal et la gestion des champs manquants.">
      Un robot RPA sur le poste Windows
    </Opt>
    <Opt why="Piège ! La tâche est quotidienne, volumineuse et réglée : un très bon candidat, qu’il serait dommage de garder manuel.">
      Rien : ce n’est pas automatisable
    </Opt>
  </QcmPage>
);

// ─── Synthesis ──────────────────────────────────────────────────────────────
const M4_Synthese: Page = () => (
  <SynthPage
    mod={4}
    title="Module 4 · Ce qu’il faut retenir"
    poste={
      <>
        Sous Windows ? Faites enregistrer à Power Automate Desktop <b>un geste que vous répétez</b> : ranger des fichiers, ouvrir trois applications le matin.
      </>
    }
  >
    <SynthRow n={1} tone="teal" d={100}>
      Un robot RPA <b>repère, agit, enchaîne</b> à l’écran, comme vous, en plus rapide.
    </SynthRow>
    <SynthRow n={2} tone="violet" d={220}>
      Connecteur d’abord ; le RPA est le <b>plan B</b> pour les logiciels sans API.
    </SynthRow>
    <SynthRow n={3} tone="blue" d={340}>
      Six briques : variables, boucles, conditions, sélecteurs, <b>erreurs</b>, journal.
    </SynthRow>
    <SynthRow n={4} tone="coral" d={460}>
      Un robot est fragile : prévoir les imprévus et <b>un responsable</b>.
    </SynthRow>
  </SynthPage>
);

// ═══ 45-m5 ═════════════════════════════════════════════════════════════

// ═══ Module 5 · Automatiser avec l’IA ═══════════════════════════════════════

const M5_Section: Page = () => (
  <Section n={5} title="Automatiser avec l’IA" sub="Lire, classer, extraire, rédiger : l’IA devient une étape du workflow." dur="55 min">
    <SecItem n={1}>Analyse de documents, OCR, classification</SecItem>
    <SecItem n={2}>Réponses automatiques par IA</SecItem>
    <SecItem n={3}>Agents IA (ex. : Copilot) et prompts de workflow</SecItem>
  </Section>
);
M5_Section.transition = BLOOM;

// ─── What AI adds: unstructured → structured ────────────────────────────────
const M5_Apport: Page = () => (
  <Frame mod={5} beats={2}>
    <Title>Ce que l’IA ajoute : du texte libre aux données rangées</Title>
    <Lede>Une règle a besoin de champs. L’IA sait les fabriquer à partir d’un message écrit librement.</Lede>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 300, width: 640 }}>
      <AppWin id="gmail" title="Boîte de réception">
        <div style={{ fontSize: 20, color: C.muted }}>De : Louis Bérubé · objet : petit souci</div>
        <div style={{ marginTop: 12, fontSize: 25, lineHeight: 1.5, color: C.ink }}>
          Bonjour, j’ai commandé deux étagères la semaine passée (commande 88213) et une des deux est arrivée avec une tablette brisée. Pas très content, c’était un cadeau pour Noël… Vous pouvez m’en renvoyer une rapidement ?
        </div>
      </AppWin>
    </div>
    <div className={b.pop(1)} style={{ position: 'absolute', left: 820, top: 440, width: 200, textAlign: 'center' }}>
      <IconTile name="sparkles" tone="violet" size={120} solid style={{ margin: '0 auto', borderRadius: 999 }} />
      <div style={{ marginTop: 12, fontFamily: display, fontWeight: 700, fontSize: 28, color: T.violet.fg }}>ÉTAPE IA</div>
    </div>
    <Code cls={b.on(2)} title="Sortie structurée" size={25} style={{ position: 'absolute', left: 1080, top: 300, width: 720 }}>
      {'{\n'}
      {'  '}<Jk>"categorie"</Jk>: <Js>"produit endommagé"</Js>,{'\n'}
      {'  '}<Jk>"commande"</Jk>: <Js>"88213"</Js>,{'\n'}
      {'  '}<Jk>"produit"</Jk>: <Js>"étagère"</Js>,{'\n'}
      {'  '}<Jk>"demande"</Jk>: <Js>"remplacement"</Js>,{'\n'}
      {'  '}<Jk>"priorite"</Jk>: <Js>"haute"</Js>,{'\n'}
      {'  '}<Jk>"ton"</Jk>: <Js>"mécontent"</Js>,{'\n'}
      {'  '}<Jk>"confiance"</Jk>: <Jn>0.93</Jn>{'\n'}
      {'}'}
    </Code>
    <Hint cls={b.fade(2)} style={{ position: 'absolute', left: 1080, top: 760 }}>
      Ces champs, une règle sait ensuite les router : c’est la combinaison gagnante.
    </Hint>
  </Frame>
);

// ─── Six operations ─────────────────────────────────────────────────────────
const M5_OPS: { icon: IconName; tone: Tone; t: string; ex: string }[] = [
  { icon: 'filter', tone: 'blue', t: 'Classer', ex: 'Ce courriel : plainte, question, commande ou facture ?' },
  { icon: 'scan', tone: 'teal', t: 'Extraire', ex: 'Nom, montant, date et numéro, dans une facture ou un courriel' },
  { icon: 'doc', tone: 'green', t: 'Résumer', ex: 'Un compte rendu de 3 pages en 5 lignes et 3 actions' },
  { icon: 'send', tone: 'violet', t: 'Rédiger', ex: 'Une réponse de premier niveau, à relire avant envoi' },
  { icon: 'globe', tone: 'yellow', t: 'Traduire', ex: 'Une demande reçue en anglais, traitée en français' },
  { icon: 'smile', tone: 'coral', t: 'Analyser le ton', ex: 'Client irrité ? Priorité relevée, gestionnaire averti' },
];

const M5_Ops: Page = () => (
  <Frame mod={5}>
    <Title>Six opérations qu’une étape IA sait faire</Title>
    <Lede>Dans un workflow, l’IA ne « discute » pas : elle fait une seule opération, précise, et rend un résultat exploitable.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26 }}>
      {M5_OPS.map((o, i) => (
        <Card key={o.t} tone={o.tone} icon={o.icon} title={o.t} size={25} cls={A.in} style={{ height: 270, ...dl(100 + i * 90) }}>
          {o.ex}
        </Card>
      ))}
    </div>
  </Frame>
);

// ─── Document analysis / OCR ────────────────────────────────────────────────
const M5_Ocr: Page = () => (
  <Frame mod={5} beats={2}>
    <Title>Analyser un document : OCR puis extraction</Title>
    <Lede>L’OCR (reconnaissance optique de caractères) transforme une image en texte. L’IA comprend ensuite ce texte.</Lede>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 300, width: 470, height: 560, boxSizing: 'border-box', background: '#FBFAF6', borderRadius: 6, boxShadow: SHADOW, padding: '34px 34px', transform: 'rotate(-1.5deg)', fontFamily: mono, fontSize: 20, lineHeight: 1.6, color: '#3B3B3B' }}>
      <div style={{ fontWeight: 700, fontSize: 24 }}>QUINCAILLERIE BEAUDRY</div>
      <div>1420, rue Principale, Granby</div>
      <div style={{ marginTop: 16 }}>Facture n° 7734 · 2026-11-03</div>
      <div style={{ marginTop: 16, borderTop: '2px dashed #bbb', paddingTop: 10 }}>Vis 3 po (500) ...... 42,90</div>
      <div>Planches 2x4 (24) .... 187,20</div>
      <div>Livraison ............ 35,00</div>
      <div style={{ marginTop: 10, borderTop: '2px dashed #bbb', paddingTop: 10 }}>TPS ................. 13,26</div>
      <div>TVQ ................. 26,45</div>
      <div style={{ fontWeight: 700 }}>TOTAL .............. 304,81 $</div>
      <div style={{ marginTop: 14 }}>Payable sous 30 jours</div>
      <Tag tone="grey" size={18} style={{ position: 'absolute', right: 20, bottom: 18 }}>
        <Icon name="image" size={18} /> photo du reçu
      </Tag>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 660, top: 330, width: 520 }}>
      <Eyebrow c={T.teal.fg}>1 · OCR : du texte brut</Eyebrow>
      <Code size={19} style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>
        QUINCAILLERIE BEAUDRY 1420, rue Principale, Granby Facture n° 7734 · 2026-11-03 Vis 3 po (500) ...... 42,90 Planches 2x4 (24) .... 187,20 Livraison 35,00 TPS 13,26 TVQ 26,45 TOTAL 304,81 $ Payable sous 30 jours
      </Code>
      <div style={{ marginTop: 12, fontSize: 21, color: C.muted }}>Lisible par une machine… mais pas encore rangé.</div>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 1250, top: 330, width: 550 }}>
      <Eyebrow c={T.violet.fg}>2 · IA : des champs</Eyebrow>
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          ['Fournisseur', 'Quincaillerie Beaudry'],
          ['N° de facture', '7734'],
          ['Date', '2026-11-03'],
          ['Total TTC', '304,81 $'],
          ['Taxes', 'TPS 13,26 · TVQ 26,45'],
          ['Échéance', '2026-12-03'],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', background: C.card, borderRadius: 10, boxShadow: SHADOW_SM, padding: '10px 16px', fontSize: 22 }}>
            <span style={{ color: C.muted }}>{k}</span>
            <b style={{ color: C.ink }}>{v}</b>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, fontSize: 21, color: T.coral.fg, fontWeight: 600 }}>L’échéance est calculée : à vérifier !</div>
    </div>
  </Frame>
);

// ─── Classification (interactive) ───────────────────────────────────────────
const M5_MSGS = [
  { who: 'Mme Gauthier', txt: 'Ma commande 4521 devait arriver lundi, toujours rien. C’est la deuxième fois. Je veux une réponse aujourd’hui.', cat: 'Livraison en retard', prio: 'Haute', ton: 'Irritée', conf: 0.94, why: 'Retard, récidive, exige une réponse le jour même' },
  { who: 'M. Nguyen', txt: 'Avez-vous la table Nordik en chêne clair ? Merci !', cat: 'Question produit', prio: 'Normale', ton: 'Neutre', conf: 0.97, why: 'Question simple sur la disponibilité' },
  { who: 'Mme Roy', txt: 'Le pied de la chaise est arrivé fendu, photo jointe. Échange ou remboursement ?', cat: 'Produit endommagé', prio: 'Haute', ton: 'Déçue', conf: 0.91, why: 'Dommage à la livraison, demande de solution' },
  { who: 'Atelier Lumen', txt: 'Je suis designer et j’aimerais discuter d’une collaboration avec votre marque.', cat: 'Autre', prio: 'Normale', ton: 'Positif', conf: 0.58, why: 'Ne correspond à aucune catégorie prévue' },
];

const M5_Classif: Page = () => {
  const [i, setI] = useState(0);
  const m = M5_MSGS[i];
  const low = m.conf < 0.75;
  return (
    <Frame mod={5} kind="demo">
      <Title>Classer une demande : catégorie, priorité, ton</Title>
      <div style={{ position: 'absolute', left: 120, top: 186 }}>
        <CasTag>Fabricant de meubles en ligne · 400 messages par semaine</CasTag>
      </div>
      <div className={A.left} style={{ position: 'absolute', left: 120, top: 260, width: 820, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {M5_MSGS.map((x, j) => (
          <button
            key={x.who}
            type="button"
            data-osd-interactive
            onClick={(e) => {
              e.currentTarget.blur();
              setI(j);
            }}
            style={{ display: 'flex', gap: 16, alignItems: 'flex-start', textAlign: 'left', border: 'none', cursor: 'pointer', borderRadius: 14, padding: '16px 20px', fontFamily: body, background: j === i ? T.blue.bg : C.card, boxShadow: j === i ? `inset 0 0 0 3px ${C.blue}` : SHADOW_SM }}
          >
            <IconTile name="mail" tone="blue" size={46} />
            <span>
              <span style={{ display: 'block', fontSize: 19, color: C.muted }}>{x.who}</span>
              <span style={{ display: 'block', fontSize: 23, lineHeight: 1.4, color: C.ink }}>{x.txt}</span>
            </span>
          </button>
        ))}
      </div>
      <div key={i} className={A.in} style={{ position: 'absolute', left: 1010, top: 260, width: 790, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 32px', animationDuration: '450ms' } as CSSProperties}>
        <Eyebrow c={T.violet.fg}>Résultat de l’étape IA</Eyebrow>
        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            ['Catégorie', m.cat],
            ['Priorité', m.prio],
            ['Ton', m.ton],
            ['Confiance', fr(m.conf, 2)],
          ].map(([k, v]) => (
            <div key={k} style={{ background: C.panel, borderRadius: 12, padding: '12px 18px' }}>
              <div style={{ fontSize: 19, color: C.muted }}>{k}</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: k === 'Confiance' && low ? C.coral : C.ink }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, fontSize: 23, lineHeight: 1.4, color: C.soft }}>
          <b>Justification :</b> {m.why}
        </div>
        <Callout
          title={low ? 'Sous le seuil de 0,75' : 'Au-dessus du seuil'}
          tone={low ? 'coral' : 'green'}
          icon={low ? 'humanCheck' : 'route'}
          size={23}
          style={{ marginTop: 18 }}
        >
          {low ? 'Pas de routage automatique : le message va dans la file « à vérifier » d’un humain.' : 'Routage automatique vers la bonne file, avec la priorité indiquée.'}
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Extraction to JSON ─────────────────────────────────────────────────────
const M5_Extraction: Page = () => (
  <Frame mod={5} beats={3}>
    <Title>Extraire des informations, champ par champ</Title>
    <div style={{ position: 'absolute', left: 120, top: 186 }}>
      <CasTag>Entreprise de déménagement · demandes de soumission</CasTag>
    </div>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 260, width: 760 }}>
      <AppWin id="outlook" title="Demande de prix">
        <div style={{ fontSize: 25, lineHeight: 1.55, color: C.ink }}>
          Bonjour, nous déménageons de <Hl>Laval</Hl> à <Hl>Sherbrooke</Hl> le <Hl>12 décembre</Hl>. C’est un <Hl>4 1/2 au 2e étage sans ascenseur</Hl>, avec un <Hl>piano</Hl>. Pouvez-vous m’envoyer un prix ?
          <br />
          <Hl>Julie Martin</Hl>, <Hl>514 555-0182</Hl>
        </div>
      </AppWin>
      <Callout title="Le prompt demande" tone="violet" icon="chat" size={22} style={{ marginTop: 24 }}>
        Extrais client, téléphone, départ, arrivée, date (AAAA-MM-JJ), logement, objets spéciaux. Liste ce qui manque. Réponds en JSON, sans texte autour.
      </Callout>
    </div>
    <Code cls={b.on(1)} title="Réponse de l’IA" size={23} style={{ position: 'absolute', left: 960, top: 260, width: 840 }}>
      {'{\n'}
      {'  '}<Jk>"client"</Jk>: <Js>"Julie Martin"</Js>,{'\n'}
      {'  '}<Jk>"telephone"</Jk>: <Js>"514 555-0182"</Js>,{'\n'}
      {'  '}<Jk>"depart"</Jk>: <Js>"Laval"</Js>,{'\n'}
      {'  '}<Jk>"arrivee"</Jk>: <Js>"Sherbrooke"</Js>,{'\n'}
      {'  '}<Jk>"date"</Jk>: <Js>"2026-12-12"</Js>,{'\n'}
      {'  '}<Jk>"logement"</Jk>: <Js>"4 1/2, 2e étage, sans ascenseur"</Js>,{'\n'}
      {'  '}<Jk>"objets_speciaux"</Jk>: [<Js>"piano"</Js>],{'\n'}
      {'  '}<Jk>"manquant"</Jk>: [<Js>"courriel"</Js>, <Js>"adresse exacte"</Js>]{'\n'}
      {'}'}
    </Code>
    <div className={b.on(2)} style={{ position: 'absolute', left: 960, top: 710, width: 840, display: 'flex', gap: 18 }}>
      <Callout title="L’année ?" tone="yellow" icon="alert" size={22} style={{ flex: 1 }}>
        L’IA a déduit 2026 : une hypothèse à contrôler.
      </Callout>
      <Callout title="Ce qui manque" tone="green" icon="check" size={22} style={{ flex: 1 }}>
        Le workflow peut redemander le courriel automatiquement.
      </Callout>
    </div>
    <Hint cls={b.fade(3)} style={{ position: 'absolute', left: 960, top: 890 }}>
      Un JSON se lit par la plateforme : chaque champ devient une variable du workflow.
    </Hint>
  </Frame>
);

// ─── Automatic replies: three levels of risk ────────────────────────────────
const M5Lvl = ({ n, tone, icon, title, risk, ex, beat }: { n: number; tone: Tone; icon: IconName; title: string; risk: string; ex: string; beat: number }) => (
  <div className={b.on(beat)} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 300px', alignItems: 'center', gap: 24, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 8px 0 0 ${STRONG[tone]}`, padding: '22px 28px' }}>
    <IconTile name={icon} tone={tone} size={80} solid />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 36, color: C.ink }}>
        {n} · {title}
      </div>
      <div style={{ marginTop: 4, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{ex}</div>
    </div>
    <Tag tone={tone} size={21} style={{ justifySelf: 'end' }}>
      Risque {risk}
    </Tag>
  </div>
);

const M5_Reponses: Page = () => (
  <Frame mod={5} beats={4}>
    <Title>Réponses automatiques : trois niveaux d’audace</Title>
    <Lede>Plus la réponse part seule, plus il faut de garde-fous. On commence toujours au niveau 2.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <M5Lvl beat={1} n={1} tone="green" icon="check" title="Accusé de réception" risk="faible" ex="Message type, numéro de dossier, délai annoncé. Pas d’IA nécessaire." />
      <M5Lvl beat={2} n={2} tone="blue" icon="humanCheck" title="Brouillon rédigé par l’IA, relu par un humain" risk="maîtrisé" ex="L’IA prépare la réponse à partir de vos documents ; une personne valide, corrige, envoie." />
      <M5Lvl beat={3} n={3} tone="coral" icon="bolt" title="Envoi automatique de la réponse IA" risk="élevé" ex="Seulement pour des questions simples, sur une base de réponses validées, avec un seuil de confiance et un suivi." />
    </div>
    <Callout cls={b.on(4)} title="Ce qui ne part jamais seul" tone="coral" icon="alert" style={{ position: 'absolute', left: 120, top: 820, width: 1680 }}>
      Un engagement (prix, délai, remboursement), un sujet juridique ou médical, un client irrité : toujours un humain.
    </Callout>
  </Frame>
);

// ─── Agents ─────────────────────────────────────────────────────────────────
const M5_Agents: Page = () => (
  <Frame mod={5} beats={3}>
    <Title>Assistant, workflow avec IA, agent : qui décide des étapes ?</Title>
    <div style={{ position: 'absolute', left: 120, top: 220, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
      {(
        [
          ['chat', 'blue', 'Assistant IA', 'Vous', 'Vous posez une question, il répond. Vous copiez, collez, agissez.', 'Copilot Chat, Gemini, ChatGPT', 'Très prévisible'],
          ['route', 'violet', 'Workflow avec IA', 'Vous, à l’avance', 'Les étapes sont fixées ; l’IA fait une seule opération dans le circuit.', 'Make + Gemini, Power Automate + IA', 'Prévisible et contrôlable'],
          ['brain', 'coral', 'Agent IA', 'L’IA elle-même', 'On lui donne un objectif et des outils ; elle choisit ses étapes et les enchaîne.', 'Agents Copilot, Gems Gemini, agents ChatGPT, agents Make', 'Puissant, moins prévisible'],
        ] as [IconName, Tone, string, string, string, string, string][]
      ).map(([ic, tone, t, who, d, ex, pred], i) => (
        <div key={t} className={b.on(i + 1)} style={{ height: 600, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, padding: '30px 30px', display: 'flex', flexDirection: 'column' }}>
          <IconTile name={ic} tone={tone} size={80} solid />
          <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 42, color: C.ink }}>{t}</div>
          <div style={{ marginTop: 6, fontSize: 23, color: T[tone].fg, fontWeight: 700 }}>Qui décide des étapes : {who}</div>
          <div style={{ marginTop: 14, fontSize: 24, lineHeight: 1.45, color: C.soft }}>{d}</div>
          <div style={{ marginTop: 'auto', fontSize: 21, lineHeight: 1.4, color: C.muted }}>Ex. : {ex}</div>
          <Tag tone={tone} size={20} style={{ marginTop: 14, alignSelf: 'flex-start' }}>
            {pred}
          </Tag>
        </div>
      ))}
    </div>
    <Verified style={{ position: 'absolute', left: 120, top: 860 }}>Noms d’offres vérifiés en novembre 2026 : ils évoluent vite, revérifiez avant chaque session.</Verified>
  </Frame>
);

// ─── Workflow prompt anatomy ────────────────────────────────────────────────
const M5Lbl = ({ beat, y, tone, children }: { beat: number; y: number; tone: Tone; children: ReactNode }) => (
  <div className={b.left(beat)} style={{ position: 'absolute', left: 1330, top: y, width: 470, display: 'flex', alignItems: 'center', gap: 14 }}>
    <span style={{ width: 16, height: 16, background: STRONG[tone], flex: 'none' }} />
    <span style={{ fontSize: 23, lineHeight: 1.35, color: C.ink }}>{children}</span>
  </div>
);

const M5_Prompt: Page = () => {
  const L = ({ tone, children }: { tone: Tone; children: ReactNode }) => (
    <div style={{ borderLeft: `6px solid ${STRONG[tone]}`, paddingLeft: 14, marginBottom: 10 }}>{children}</div>
  );
  return (
    <Frame mod={5} beats={6}>
      <Title>Le prompt de workflow : écrit une fois, exécuté mille fois</Title>
      <Lede>Personne ne le relit avant chaque exécution : il doit être précis, fermé, et prévoir le doute.</Lede>
      <Code cls={A.in} size={22} style={{ position: 'absolute', left: 120, top: 290, width: 1160, whiteSpace: 'pre-wrap' }}>
        <L tone="blue">Tu es l’assistant du service client d’un fabricant de meubles.</L>
        <L tone="teal">Classe le message ci-dessous dans UNE catégorie.</L>
        <L tone="green">Catégories autorisées : livraison, produit endommagé, question produit, facturation, autre.</L>
        <L tone="violet">
          Réponds uniquement en JSON : {'{'}"categorie": "...", "priorite": "haute|normale", "confiance": 0 à 1{'}'}
        </L>
        <L tone="coral">Si tu hésites, mets "autre" et une confiance inférieure à 0,5. N’invente rien.</L>
        <L tone="yellow">Message : {'{{'}Message{'}}'}</L>
      </Code>
      <M5Lbl beat={1} y={300} tone="blue">Un rôle et un contexte</M5Lbl>
      <M5Lbl beat={2} y={370} tone="teal">Une seule tâche</M5Lbl>
      <M5Lbl beat={3} y={440} tone="green">Une liste fermée de choix</M5Lbl>
      <M5Lbl beat={4} y={530} tone="violet">Un format de sortie imposé, lisible par la machine</M5Lbl>
      <M5Lbl beat={5} y={630} tone="coral">Que faire en cas de doute</M5Lbl>
      <M5Lbl beat={6} y={720} tone="yellow">La donnée, insérée par la plateforme (variable)</M5Lbl>
    </Frame>
  );
};

// ─── Exercise: classify six e-mails ─────────────────────────────────────────
const M5_Exercice: Page = () => (
  <AtelierPage
    mod={5}
    kind="exercice"
    n="Exercice 3"
    title="Classer six messages avec votre IA"
    timerId="m5-classif"
    minutes={15}
    tools="Copilot, Gemini ou ChatGPT (compte gratuit) · les six messages fictifs collés dans le Chat"
    objective="Tester un prompt de workflow sur six messages et repérer où l’IA hésite ou se trompe."
    deliver={
      <>
        Un tableau de 6 lignes : <b>message · catégorie · priorité · confiance · juste ou faux</b>, et une version améliorée de votre prompt.
      </>
    }
    crit={
      <>
        <CheckItem id="a" size={22}>Une réponse en JSON pour chaque message</CheckItem>
        <CheckItem id="b" size={22}>Au moins une erreur ou une hésitation repérée</CheckItem>
        <CheckItem id="c" size={22}>Le prompt corrigé et retesté</CheckItem>
      </>
    }
  >
    <Do n={1}>Copiez le prompt de la page précédente (collé dans le Chat) dans votre assistant IA.</Do>
    <Do n={2}>Testez-le sur chacun des six messages, un par un. Notez les résultats.</Do>
    <Do n={3}>Comparez avec ce que vous auriez répondu. Où l’IA hésite-t-elle ? Pourquoi ?</Do>
    <Do n={4}>Améliorez le prompt (catégorie mieux définie, exemple ajouté) et retestez le message le plus difficile.</Do>
    <Bonus>Adaptez le prompt à votre tâche réelle : quelles catégories, quel format ? Notez-le dans votre carnet.</Bonus>
  </AtelierPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M5_Qcm: Page = () => (
  <QcmPage
    mod={5}
    n={5}
    title="L’étape IA bien encadrée"
    q="Votre étape IA classe les plaintes. Pour un message ambigu, que doit faire le workflow ?"
    explain="L’IA peut se tromper avec assurance : on lui demande un indice de confiance, on fixe un seuil, et sous ce seuil un humain tranche. Le flux reste automatique pour la majorité des cas."
  >
    <Opt why="Piège ! L’IA choisira quelque chose, avec aplomb. Le message risque d’atterrir dans la mauvaise file, sans que personne le sache.">
      Laisser l’IA choisir la catégorie la plus probable et continuer
    </Opt>
    <Opt ok why="Exact : confiance sous le seuil → file « à vérifier ». C’est le principe de la validation humaine ciblée.">
      Envoyer le message dans une file « à vérifier » quand la confiance est basse
    </Opt>
    <Opt why="Piège ! On perd tout le gain sur les 90 % de messages clairs.">
      Faire relire tous les messages par un humain
    </Opt>
    <Opt why="Piège ! Relancer la même question donne souvent une autre réponse : ce n’est pas un contrôle.">
      Reposer la question à l’IA jusqu’à obtenir une réponse sûre
    </Opt>
  </QcmPage>
);

// ─── Synthesis ──────────────────────────────────────────────────────────────
const M5_Synthese: Page = () => (
  <SynthPage
    mod={5}
    title="Module 5 · Ce qu’il faut retenir"
    poste={
      <>
        Écrivez le <b>prompt de workflow</b> de votre tâche : rôle, tâche, choix fermés, format JSON, cas de doute. Testez-le sur 5 exemples fictifs.
      </>
    }
  >
    <SynthRow n={1} tone="violet" d={100}>
      L’IA transforme le <b>texte libre en champs</b> que les règles savent router.
    </SynthRow>
    <SynthRow n={2} tone="teal" d={220}>
      Documents : <b>OCR</b> pour lire, IA pour comprendre, humain pour vérifier ce qui est déduit.
    </SynthRow>
    <SynthRow n={3} tone="blue" d={340}>
      Réponses : on commence par le <b>brouillon relu</b>, jamais par l’envoi automatique.
    </SynthRow>
    <SynthRow n={4} tone="coral" d={460}>
      Un prompt de workflow : <b>fermé</b>, en JSON, avec un <b>seuil de confiance</b>.
    </SynthRow>
  </SynthPage>
);

// ═══ 48-j1 ═════════════════════════════════════════════════════════════

// ═══ Fin du jour 1 ═══════════════════════════════════════════════════════════

const J1Row = ({ n, tone, t, s, d }: { n: number; tone: Tone; t: string; s: string; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 22, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 24px', ...dl(d) }}>
    <Num n={pad(n)} tone={tone} size={50} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{t}</div>
      <div style={{ fontSize: 22, color: C.soft }}>{s}</div>
    </div>
  </div>
);

const J1_Bilan: Page = () => (
  <Frame mod={5} label="Bilan du jour 1">
    <Title>Ce que vous avez fait aujourd’hui</Title>
    <div style={{ position: 'absolute', left: 120, top: 220, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <J1Row d={100} n={1} tone="blue" t="Automatiser" s="Quand… Si… Alors… et six niveaux, du raccourci à l’agent" />
      <J1Row d={200} n={2} tone="teal" t="Choisir et analyser" s="Votre tâche notée sur 20, son SIPOC, son gain estimé" />
      <J1Row d={300} n={3} tone="blue" t="Les outils" s="Quatre familles, un vocabulaire commun, votre compte Make" />
      <J1Row d={400} n={4} tone="teal" t="Les robots RPA" s="Repérer, agir, enchaîner, quand il n’y a pas de connecteur" />
      <J1Row d={500} n={5} tone="violet" t="L’IA dans le circuit" s="Classer, extraire, rédiger, avec un seuil de confiance" />
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1250, top: 220, width: 550, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 32px', ...dl(400) }}>
      <Eyebrow c={C.violet}>Tour éclair · un mot</Eyebrow>
      <div style={{ marginTop: 12, fontSize: 27, lineHeight: 1.45, color: C.ink }}>
        Chacun dit <b>un mot</b> sur la journée, puis <b>la tâche</b> qu’il compte automatiser demain.
      </div>
      <Timer id="j1-tour" minutes={5} label="Tour éclair" compact style={{ marginTop: 22 }} />
    </div>
  </Frame>
);

const J1_Demain: Page = () => (
  <Frame mod={5} label="Bilan du jour 1 · Pour demain">
    <Title>Demain, on construit</Title>
    <Lede>Pour gagner du temps à 9 h, vérifiez ce soir ces quatre points.</Lede>
    <Checklist style={{ position: 'absolute', left: 120, top: 290, width: 960, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <CheckItem id="make">Je me connecte à Make sans problème</CheckItem>
      <CheckItem id="sheet">Mon classeur « Demandes IA135 » a ses 7 en-têtes</CheckItem>
      <CheckItem id="key">Ma clé d’API Gemini est rangée dans un fichier personnel</CheckItem>
      <CheckItem id="carnet">Mon carnet contient ma tâche, son SIPOC et son prompt</CheckItem>
    </Checklist>
    <div className={A.right} style={{ position: 'absolute', left: 1160, top: 290, width: 640, boxSizing: 'border-box', background: G.blue, borderRadius: 20, boxShadow: SHADOW, padding: '28px 34px', color: '#fff', ...dl(300) }}>
      <Eyebrow c={C.yellow}>Au programme du jour 2</Eyebrow>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 26, lineHeight: 1.35 }}>
        <div>06 · Un premier flux, de bout en bout</div>
        <div>07 · La fiche de conception de votre tâche</div>
        <div>08 · Un workflow avec une étape IA</div>
        <div>09 · Un scénario complet, au choix</div>
        <div>10 · Tester, mesurer, déployer</div>
      </div>
    </div>
  </Frame>
);

// ═══ 50-j2 ═════════════════════════════════════════════════════════════

// ═══ Jour 2 · Reprise ════════════════════════════════════════════════════════

const J2_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <img src={logoStack} alt="Technologia" className={A.fade} style={{ position: 'absolute', left: 112, top: 78, height: 150, display: 'block' }} />
    <Squares s={300} x={1400} y={300} delay={200} />
    <div style={{ position: 'absolute', left: 120, top: 360, width: 1100 }}>
      <Eyebrow cls={A.in} size={28}>
        Formation IA135 · Jour 2
      </Eyebrow>
      <h1 className={A.in} style={{ margin: '18px 0 0', fontFamily: display, fontWeight: 700, fontSize: 120, lineHeight: 1.0, color: C.ink, ...dl(120) }}>
        Aujourd’hui,
        <br />
        on construit
      </h1>
      <p className={A.in} style={{ margin: '26px 0 0', fontSize: 34, lineHeight: 1.35, color: C.soft, ...dl(240) }}>
        Concevoir, construire, tester et déployer un workflow automatisé avec une étape IA
      </p>
    </div>
    <Footer2 />
  </Frame>
);
J2_Cover.transition = BLOOM;

const J2_Rappel: Page = () => (
  <Frame mod={0} kind="qcm" beats={2} label="Reprise · Quiz éclair">
    <Title>
      <span style={{ color: C.violet }}>Quiz éclair</span> · Ce qui reste d’hier
    </Title>
    <Qcm
      multi
      q="Parmi ces affirmations, lesquelles sont vraies ?"
      explain="On décrit d’abord les étapes, on préfère le connecteur au robot, on ferme les choix de l’IA et on confie le doute à un humain. Ces quatre réflexes guident toute la journée."
    >
      <Opt ok why="Oui : P d’abord (les étapes), puis O et C, puis I et S. On part de ce qu’on fait.">
        Un SIPOC se remplit en commençant par les étapes (P)
      </Opt>
      <Opt why="Piège ! Quand l’application a une API, le connecteur est plus rapide et plus robuste. Le RPA est le plan B.">
        Un robot RPA est le premier choix, même si l’application a une API
      </Opt>
      <Opt why="Piège ! Sans liste fermée, l’IA invente des catégories différentes pour la même chose : impossible à router.">
        Un prompt de workflow doit laisser l’IA libre de nommer les catégories
      </Opt>
      <Opt ok why="Oui : sous le seuil de confiance, la demande va dans une file « à vérifier ». Le reste passe automatiquement.">
        Sous un seuil de confiance, la demande est confiée à un humain
      </Opt>
    </Qcm>
  </Frame>
);

const J2Step = ({ n, t, h, tone, d, children }: { n: number; t: string; h: string; tone: Tone; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ display: 'grid', gridTemplateColumns: '90px 70px 1fr 1fr', alignItems: 'center', gap: 20, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '14px 24px', ...dl(d) }}>
    <span style={{ fontFamily: mono, fontSize: 22, color: C.muted }}>{h}</span>
    <Num n={pad(n)} tone={tone} size={50} />
    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>{t}</span>
    <span style={{ fontSize: 23, color: C.soft }}>{children}</span>
  </div>
);

const J2_Programme: Page = () => (
  <Frame mod={0} label="Reprise · Programme du jour 2">
    <Title>Le fil de la journée : votre workflow, de l’idée à la production</Title>
    <div style={{ position: 'absolute', left: 120, top: 220, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <J2Step d={100} n={6} h="9:15" tone="yellow" t="Un premier flux">
        Démo Power Automate, puis votre premier scénario Make
      </J2Step>
      <J2Step d={200} n={7} h="10:30" tone="teal" t="Méthodologie de conception">
        La fiche de conception de votre tâche
      </J2Step>
      <J2Step d={300} n={8} h="11:10" tone="blue" t="Construire un workflow">
        Sources, déclencheurs, actions, étape IA, routeur
      </J2Step>
      <J2Step d={400} n={9} h="13:30" tone="yellow" t="Un scénario complet">
        Trois scénarios au choix selon votre niveau
      </J2Step>
      <J2Step d={500} n={10} h="15:00" tone="green" t="Tester, optimiser, déployer">
        Plan de test, gain mesuré, documentation
      </J2Step>
    </div>
    <Callout cls={A.in} title="Votre carnet" icon="note" tone="blue" style={{ position: 'absolute', left: 120, top: 820, width: 1680, ...dl(700) }}>
      Gardez-le ouvert : rubriques 4 (fiche de conception) et 5 (tests et gain) se remplissent aujourd’hui.
    </Callout>
  </Frame>
);

// ═══ 60-m6 ═════════════════════════════════════════════════════════════

// ═══ Module 6 · Atelier · Un premier flux ═══════════════════════════════════

const M6_Section: Page = () => (
  <Section n={6} title="Atelier · Un premier flux" sub="Une démonstration Power Automate, puis votre premier scénario, de bout en bout." dur="1 h" kind="atelier">
    <SecItem n={1}>Démonstration d’un flux Power Automate simple</SecItem>
    <SecItem n={2}>Le même flux dans Make</SecItem>
    <SecItem n={3}>Votre premier scénario, testé</SecItem>
  </Section>
);
M6_Section.transition = BLOOM;

// ─── Demo: a simple Power Automate cloud flow ───────────────────────────────
const M6PaCard = ({ app, kind, title, fields, beat }: { app: AppId; kind: NodeKind; title: string; fields: [string, ReactNode][]; beat?: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ width: 760, boxSizing: 'border-box', background: C.card, borderRadius: 12, boxShadow: `${SHADOW_SM}, inset 0 5px 0 ${STRONG[NK[kind].tone]}`, overflow: 'hidden' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', background: C.panel }}>
      <AppTile id={app} size={38} />
      <span style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{title}</span>
      <span style={{ marginLeft: 'auto' }}>
        <NodeChip kind={kind} size={17} />
      </span>
    </div>
    <div style={{ padding: '10px 20px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      {fields.map(([k, v]) => (
        <div key={k} style={{ display: 'flex', gap: 14, fontSize: 21 }}>
          <span style={{ width: 180, color: C.muted }}>{k}</span>
          <span style={{ color: C.ink }}>{v}</span>
        </div>
      ))}
    </div>
  </div>
);

const Pill = ({ children, tone = 'blue' }: { children: ReactNode; tone?: Tone }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '1px 10px', borderRadius: 6, background: T[tone].bg, boxShadow: `inset 0 0 0 1.5px ${T[tone].bd}`, color: T[tone].fg, fontWeight: 600, fontSize: '0.92em', whiteSpace: 'nowrap' }}>
    {children}
  </span>
);

const M6_DemoPA: Page = () => (
  <Frame mod={6} kind="demo" beats={3}>
    <Title>Démo · Un flux Power Automate en trois blocs</Title>
    <div style={{ position: 'absolute', left: 120, top: 186 }}>
      <CasTag>Cabinet d’architectes · les plans reçus des clients se perdent dans les boîtes</CasTag>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <M6PaCard app="outlook" kind="trigger" title="Lors de l’arrivée d’un nouvel e-mail (V3)" fields={[['Dossier', 'Boîte de réception'], ['Avec pièces jointes', 'Oui']]} />
      <div className={b.fade(1)}>
        <Icon name="download" size={36} color={C.faint} />
      </div>
      <M6PaCard beat={1} app="sharepoint" kind="action" title="Créer un fichier" fields={[['Dossier', 'Projets / Plans reçus'], ['Nom', <Pill key="n">Nom de la pièce jointe</Pill>]]} />
      <div className={b.fade(2)}>
        <Icon name="download" size={36} color={C.faint} />
      </div>
      <M6PaCard beat={2} app="teams" kind="action" title="Publier un message dans un canal" fields={[['Canal', 'Projets · Général'], ['Message', <span key="m">Nouveau plan de <Pill>De</Pill> : <Pill>Objet</Pill></span>]]} />
    </div>
    <div style={{ position: 'absolute', left: 960, top: 260, width: 840, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card tone="blue" icon="play" title="Ce que je montre" size={24} cls={A.right}>
        Créer le flux depuis un modèle, choisir le déclencheur, insérer le <b>contenu dynamique</b> (les pastilles), tester, puis lire l’historique.
      </Card>
      <Callout cls={b.on(3)} title="Retenez la structure" tone="green" icon="layers" size={24}>
        Un déclencheur, des actions, des données qui passent d’un bloc à l’autre. <b>Exactement ce que vous allez faire dans Make.</b>
      </Callout>
      <Verified cls={A.fade} style={dl(500)}>
        Power Automate (infonuagique) demande une licence Microsoft 365. Libellés vérifiés en novembre 2026.
      </Verified>
    </div>
  </Frame>
);

// ─── The same idea in Make: our first scenario ──────────────────────────────
const M6_Make: Page = () => (
  <Frame mod={6} beats={2}>
    <Title>Votre premier scénario Make : deux modules</Title>
    <Lede>Une nouvelle demande arrive dans le classeur ; vous recevez un courriel qui la résume. Simple, mais complet.</Lede>
    <Chain
      x={260}
      y={330}
      size={150}
      gap={260}
      steps
      items={[
        { app: 'sheets', label: 'Google Sheets', sub: 'Watch New Rows · « Demandes IA135 »' },
        { app: 'gmail', label: 'Gmail', sub: 'Send an email · à vous-même' },
      ]}
    />
    <div className={b.on(1)} style={{ position: 'absolute', left: 1080, top: 300, width: 720 }}>
      <AppWin id="gmail" title="Courriel reçu">
        <div style={{ fontSize: 22, color: C.muted }}>
          Objet : Nouvelle demande de <Pill>Nom</Pill>
        </div>
        <div style={{ marginTop: 12, fontSize: 24, lineHeight: 1.5, color: C.ink }}>
          Bonjour,
          <br />
          <Pill>Nom</Pill> (<Pill>Courriel</Pill>) a écrit le <Pill>Date</Pill> :
          <br />« <Pill>Message</Pill> »
        </div>
      </AppWin>
    </div>
    <Callout cls={b.on(2)} title="Les pastilles" tone="blue" icon="link" style={{ position: 'absolute', left: 120, top: 760, width: 1680 }}>
      Chaque pastille est une <b>variable</b> : la valeur de la colonne, pour la ligne qui vient d’arriver. C’est le <b>mapping</b>, le cœur de tout workflow.
    </Callout>
  </Frame>
);

// ─── Step by step ───────────────────────────────────────────────────────────
const M6_PasAPas: Page = () => (
  <Frame mod={6} kind="atelier">
    <Title>Pas à pas dans Make</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 820, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Eyebrow cls={A.in}>Module 1 · le déclencheur</Eyebrow>
      <Do n={1}>
        <Kbd>Scenarios</Kbd> › <Kbd>Create a new scenario</Kbd>, puis le grand <Kbd>+</Kbd>.
      </Do>
      <Do n={2}>
        Cherchez <b>Google Sheets</b> › <Kbd>Watch New Rows</Kbd>. Créez la connexion avec votre compte Google.
      </Do>
      <Do n={3}>
        Choisissez le classeur <b>« Demandes IA135 »</b>, la feuille, <i>Table contains headers : Yes</i>, limite : 5.
      </Do>
      <Do n={4}>
        <i>Choose where to start</i> : <b>From now on</b>. Seules les nouvelles lignes compteront.
      </Do>
    </div>
    <div style={{ position: 'absolute', left: 1000, top: 200, width: 800, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Eyebrow cls={A.in} c={T.green.fg} style={dl(200)}>
        Module 2 · l’action, puis le test
      </Eyebrow>
      <Do n={5} tone="green">
        <Kbd>+</Kbd> à droite du module › <b>Gmail</b> › <Kbd>Send an email</Kbd>. Destinataire : votre adresse.
      </Do>
      <Do n={6} tone="green">
        Objet et contenu : cliquez dans le champ, puis sur les pastilles <Pill>Nom</Pill>, <Pill>Message</Pill>…
      </Do>
      <Do n={7} tone="green">
        <Kbd>Save</Kbd>, puis <Kbd>Run once</Kbd> : le scénario attend.
      </Do>
      <Do n={8} tone="green">
        Ajoutez une ligne fictive dans le classeur. Une bulle apparaît sur chaque module : cliquez-la pour voir les données.
      </Do>
    </div>
    <Callout cls={A.in} title="Gmail refuse la connexion ?" tone="yellow" icon="alert" size={23} style={{ position: 'absolute', left: 120, top: 830, width: 1680, ...dl(500) }}>
      Certains comptes professionnels bloquent l’accès. Plan B : remplacez Gmail par <b>Google Sheets › Add a Row</b> dans une feuille « Journal ».
    </Callout>
  </Frame>
);

// ─── Atelier 1 ──────────────────────────────────────────────────────────────
const M6_Atelier: Page = () => (
  <AtelierPage
    mod={6}
    n="Atelier 1"
    title="Votre premier scénario, de bout en bout"
    timerId="m6-atelier"
    minutes={25}
    tools="Make (offre gratuite) · Google Sheets · Gmail (ou une feuille « Journal »)"
    objective="Construire et tester un scénario à deux modules : une nouvelle ligne dans le classeur déclenche un courriel qui la résume."
    deliver={
      <>
        Un scénario <b>« IA135 · Atelier 1 »</b> sauvegardé, exécuté avec succès au moins une fois, et une capture de la bulle de données.
      </>
    }
    crit={
      <>
        <CheckItem id="a" size={22}>Le déclencheur voit la nouvelle ligne</CheckItem>
        <CheckItem id="b" size={22}>Le courriel contient les vraies valeurs</CheckItem>
        <CheckItem id="c" size={22}>L’historique montre une exécution réussie</CheckItem>
        <CheckItem id="d" size={22}>La planification reste désactivée</CheckItem>
      </>
    }
  >
    <Do n={1}>Suivez les 8 étapes de la page précédente (le pas à pas est aussi dans le Chat).</Do>
    <Do n={2}>Testez avec 2 lignes fictives : une demande normale, une avec un champ vide.</Do>
    <Do n={3}>Ouvrez les bulles de données : que reçoit le module 2 quand un champ est vide ?</Do>
    <Do n={4}>Renommez le scénario et sauvegardez. Notez dans votre carnet ce qui vous a bloqué.</Do>
    <Bonus>Ajoutez un filtre sur le lien : ne continuer que si le champ Message n’est pas vide.</Bonus>
  </AtelierPage>
);

// ─── First-time pitfalls ────────────────────────────────────────────────────
const M6_Pieges: Page = () => (
  <Frame mod={6}>
    <Title>Les six pièges du premier scénario</Title>
    <Table
      cls={A.in}
      style={{ position: 'absolute', left: 120, top: 210, width: 1680 }}
      cols="560px 1fr"
      size={24}
      head={['Symptôme', 'Cause et solution']}
      rows={[
        ['Rien ne se passe après Run once', 'Le déclencheur démarre « From now on » : ajoutez une nouvelle ligne après avoir cliqué Run once.'],
        ['Le courriel arrive vide', 'Le texte a été tapé au lieu de cliquer sur les pastilles : refaites le mapping.'],
        ['Les colonnes s’appellent A, B, C', '« Table contains headers » est à No, ou la ligne 1 est vide : corrigez le classeur.'],
        ['Erreur de connexion', 'Connexion expirée ou refusée : recréez-la, ou passez au plan B (feuille Journal).'],
        ['Toutes les anciennes lignes reviennent', 'Point de départ réglé sur « All » : remettez « From now on » (clic droit sur le module).'],
        ['Les crédits fondent', 'Planification activée trop tôt : laissez-la désactivée tant que vous testez.'],
      ]}
    />
  </Frame>
);

// ─── Synthesis ──────────────────────────────────────────────────────────────
const M6_Synthese: Page = () => (
  <SynthPage
    mod={6}
    title="Module 6 · Ce qu’il faut retenir"
    poste={
      <>
        Remplacez le classeur par une vraie source de votre travail (<b>formulaire, boîte partagée</b>), toujours avec des données fictives tant que vous testez.
      </>
    }
  >
    <SynthRow n={1} tone="blue" d={100}>
      Power Automate ou Make : <b>déclencheur, actions, données</b> qui circulent.
    </SynthRow>
    <SynthRow n={2} tone="teal" d={220}>
      Le <b>mapping</b> relie la sortie d’un module à l’entrée du suivant.
    </SynthRow>
    <SynthRow n={3} tone="green" d={340}>
      <b>Run once</b> + une donnée de test + la bulle de données : la boucle de test.
    </SynthRow>
    <SynthRow n={4} tone="coral" d={460}>
      La planification s’active <b>en dernier</b>, quand tout fonctionne.
    </SynthRow>
  </SynthPage>
);

// ═══ 70-m7 ═════════════════════════════════════════════════════════════

// ═══ Module 7 · Méthodologie de conception ══════════════════════════════════

const M7_Section: Page = () => (
  <Section n={7} title="Méthodologie de conception" sub="Dix minutes de conception évitent deux heures de clics." dur="40 min" kind="exercice">
    <SecItem n={1}>Définir un besoin métier clair</SecItem>
    <SecItem n={2}>Formaliser les étapes et réaliser un diagramme simple</SecItem>
    <SecItem n={3}>Déterminer les données d’entrée et de sortie</SecItem>
  </Section>
);
M7_Section.transition = BLOOM;

// ─── A clear business need ──────────────────────────────────────────────────
const M7Part = ({ tone, k: key, v }: { tone: Tone; k: string; v: ReactNode }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', margin: '0 6px 12px 0', verticalAlign: 'top' }}>
    <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: T[tone].fg }}>{key}</span>
    <span style={{ padding: '4px 12px', borderRadius: 8, background: T[tone].bg, boxShadow: `inset 0 0 0 1.5px ${T[tone].bd}`, fontSize: 27, color: C.ink }}>{v}</span>
  </span>
);

const M7_Besoin: Page = () => (
  <Frame mod={7} beats={2}>
    <Title>Définir un besoin métier clair</Title>
    <div style={{ position: 'absolute', left: 120, top: 186 }}>
      <CasTag>Service des ressources humaines · demandes d’attestation d’emploi</CasTag>
    </div>
    <Card tone="coral" icon="x" title="Flou" size={27} cls={A.left} style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
      « Il faudrait automatiser les attestations, ça prend trop de temps. »
    </Card>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 450, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.green}`, padding: '30px 34px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
        <IconTile name="check" tone="green" size={56} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 34, color: C.ink }}>Clair</span>
      </div>
      <M7Part tone="blue" k="Pour qui" v="Les conseillères RH" />
      <M7Part tone="teal" k="Quand" v="un employé demande une attestation par le formulaire" />
      <M7Part tone="green" k="Je veux" v="que l’attestation soit générée et envoyée pour signature" />
      <M7Part tone="violet" k="Afin de" v="passer de 3 jours à 4 heures de délai" />
      <M7Part tone="yellow" k="Sauf" v="les cas particuliers (congé, fin d’emploi) : traités à la main" />
    </div>
    <Callout cls={b.on(2)} title="Le test du besoin clair" style={{ position: 'absolute', left: 120, top: 790, width: 1680 }}>
      Une personne qui ne connaît pas la tâche comprend <b>quoi</b>, <b>quand</b>, <b>pourquoi</b>, et <b>comment on saura que ça marche</b>.
    </Callout>
  </Frame>
);

// ─── Formalise the steps ────────────────────────────────────────────────────
const M7_Etapes: Page = () => (
  <Frame mod={7}>
    <Title>Formaliser les étapes : un verbe, un outil, une règle</Title>
    <Table
      cls={A.in}
      style={{ position: 'absolute', left: 120, top: 210, width: 1680 }}
      cols="70px 1.3fr 1fr 1.3fr 1.2fr"
      size={22}
      head={['#', 'Étape', 'Outil', 'Règle', 'Exception']}
      rows={[
        ['1', 'Recevoir la demande', 'Formulaire', 'Champs obligatoires remplis', 'Champ manquant → redemander'],
        ['2', 'Retrouver l’employé', 'Fichier du personnel', 'Recherche par numéro d’employé', 'Introuvable → conseillère'],
        ['3', 'Vérifier le statut', 'Fichier du personnel', 'Statut « actif »', 'Congé, fin d’emploi → conseillère'],
        ['4', 'Générer l’attestation', 'Modèle de document', 'Nom, poste, date d’embauche, salaire si demandé', '—'],
        ['5', 'Faire signer', 'Signature électronique', 'Envoyée à la directrice RH', 'Pas signée en 24 h → rappel'],
        ['6', 'Envoyer à l’employé', 'Courriel', 'Pièce jointe PDF', '—'],
        ['7', 'Consigner', 'Registre', 'Date, demandeur, délai', '—'],
      ]}
    />
    <Hint style={{ position: 'absolute', left: 120, top: 890 }}>Chaque exception non écrite devient une panne en production.</Hint>
  </Frame>
);

// ─── A simple diagram with the colour code ──────────────────────────────────
const M7_Diagramme: Page = () => (
  <Frame mod={7} beats={2}>
    <Title>Réaliser un diagramme simple</Title>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 186, display: 'flex', gap: 10 }}>
      {(['trigger', 'data', 'cond', 'ai', 'action', 'human', 'out'] as NodeKind[]).map((n) => (
        <NodeChip key={n} kind={n} />
      ))}
    </div>
    <FlowRow
      x={120}
      y={280}
      w={300}
      gap={45}
      nodes={[
        { kind: 'trigger', label: 'Demande reçue', sub: 'Formulaire RH' },
        { kind: 'data', label: 'Fiche employé', sub: 'Recherche par numéro' },
        { kind: 'cond', label: 'Statut actif ?', sub: 'Oui → suite' },
        { kind: 'action', label: 'Attestation générée', sub: 'Modèle + champs' },
        { kind: 'out', label: 'Envoyée et consignée', sub: 'Après signature' },
      ]}
    />
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <path d="M 960 440 V 560" stroke={C.coral} strokeWidth={4} strokeDasharray="10 10" className={b.fade(1)} />
      <polygon points="960,580 950,560 970,560" fill={C.coral} className={b.fade(1)} />
    </svg>
    <FlowNode kind="human" label="Conseillère RH" sub="Statut non actif ou cas particulier : traitement manuel" w={420} cls={b.on(1)} style={{ position: 'absolute', left: 750, top: 590 }} />
    <Callout cls={b.on(2)} title="Où mettre l’IA ?" tone="violet" icon="sparkles" size={24} style={{ position: 'absolute', left: 1230, top: 590, width: 570 }}>
      Nulle part ici : les données sont structurées. Si les demandes arrivaient par courriel libre, une étape IA lirait le type d’attestation voulu.
    </Callout>
  </Frame>
);

// ─── Inputs and outputs ─────────────────────────────────────────────────────
const M7_IO: Page = () => (
  <Frame mod={7}>
    <Title>Déterminer les données d’entrée et de sortie</Title>
    <Lede>Le dictionnaire de données : chaque information, d’où elle vient, à quoi elle ressemble.</Lede>
    <Table
      cls={A.in}
      style={{ position: 'absolute', left: 120, top: 280, width: 1680 }}
      cols="110px 1fr 1fr 1fr 150px 1fr"
      size={22}
      head={['Sens', 'Donnée', 'Source', 'Format', 'Obligatoire', 'Exemple fictif']}
      rows={[
        [<Tag key="e1" tone="blue" size={18}>Entrée</Tag>, 'Numéro d’employé', 'Formulaire', '6 chiffres', 'Oui', '104 233'],
        [<Tag key="e2" tone="blue" size={18}>Entrée</Tag>, 'Type d’attestation', 'Formulaire', 'Liste : simple, avec salaire', 'Oui', 'avec salaire'],
        [<Tag key="e3" tone="blue" size={18}>Entrée</Tag>, 'Date d’embauche', 'Fichier du personnel', 'AAAA-MM-JJ', 'Oui', '2019-04-15'],
        [<Tag key="s1" tone="green" size={18}>Sortie</Tag>, 'Attestation signée', 'Signature électronique', 'PDF', 'Oui', 'Attestation_104233.pdf'],
        [<Tag key="s2" tone="green" size={18}>Sortie</Tag>, 'Ligne du registre', 'Registre', 'Date, demandeur, délai', 'Oui', '2026-11-20 · 104 233 · 3 h'],
      ]}
    />
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, display: 'flex', gap: 24, ...dl(500) }}>
      <Callout title="Le format" tone="yellow" icon="alert" size={23} style={{ flex: 1 }}>
        12/04/2026 : avril ou décembre ? Fixez un format (AAAA-MM-JJ) dès la conception.
      </Callout>
      <Callout title="Le sensible" tone="coral" icon="lock" size={23} style={{ flex: 1 }}>
        Le salaire est un renseignement personnel : qui y accède, où transite-t-il ?
      </Callout>
    </div>
  </Frame>
);

// ─── The design sheet ───────────────────────────────────────────────────────
const M7_FICHE: [IconName, Tone, string, string][] = [
  ['target', 'blue', 'Besoin', 'Pour qui, quand, je veux, afin de, sauf'],
  ['bolt', 'blue', 'Déclencheur', 'Événement, horaire ou condition'],
  ['list', 'teal', 'Étapes', 'Verbe, outil, règle, exception'],
  ['route', 'teal', 'Diagramme', 'Avec le code couleur des étapes'],
  ['database', 'green', 'Données', 'Entrées, sorties, formats, sensibles'],
  ['sparkles', 'violet', 'Étape IA', 'Opération, prompt, seuil de confiance'],
  ['humanCheck', 'coral', 'Validation', 'Qui valide quoi, et quand'],
  ['gauge', 'yellow', 'Indicateurs', 'Gain attendu, taux d’erreur, responsable'],
];

const M7_Fiche: Page = () => (
  <Frame mod={7}>
    <Title>La fiche de conception, en huit rubriques</Title>
    <Lede>Elle tient sur une page. Elle sert à construire, à faire valider, puis à documenter.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
      {M7_FICHE.map(([ic, tone, t, s], i) => (
        <div key={t} className={A.in} style={{ height: 270, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '24px 24px', ...dl(80 + i * 80) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Num n={i + 1} tone={tone} size={44} />
            <Icon name={ic} size={34} color={T[tone].fg} />
          </div>
          <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 36, color: C.ink }}>{t}</div>
          <div style={{ marginTop: 6, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{s}</div>
        </div>
      ))}
    </div>
  </Frame>
);

// ─── Exercise 4 ─────────────────────────────────────────────────────────────
const M7_Atelier: Page = () => (
  <AtelierPage
    mod={7}
    kind="exercice"
    n="Exercice 4"
    title="La fiche de conception de votre tâche"
    timerId="m7-fiche"
    minutes={20}
    tools="Votre carnet de bord · rubrique 4 (modèle dans le Chat) · un assistant IA pour relire"
    objective="Transformer le SIPOC d’hier en une fiche de conception prête à construire."
    deliver={
      <>
        Rubrique 4 du carnet : les <b>8 rubriques</b> remplies pour votre tâche, avec un diagramme simple (papier, draw.io ou liste fléchée).
      </>
    }
    crit={
      <>
        <CheckItem id="a" size={22}>Un besoin qui passe le test du besoin clair</CheckItem>
        <CheckItem id="b" size={22}>Chaque étape : verbe, outil, règle, exception</CheckItem>
        <CheckItem id="c" size={22}>Les données d’entrée et de sortie, avec formats</CheckItem>
        <CheckItem id="d" size={22}>La validation humaine placée</CheckItem>
      </>
    }
  >
    <Do n={1}>Écrivez le besoin : pour qui, quand, je veux, afin de, sauf.</Do>
    <Do n={2}>Reprenez les étapes de votre SIPOC et ajoutez outil, règle et exception à chacune.</Do>
    <Do n={3}>Dessinez le diagramme avec le code couleur ; placez l’étape IA et la validation humaine.</Do>
    <Do n={4}>Listez les données d’entrée et de sortie ; repérez ce qui est sensible.</Do>
    <Bonus>Demandez à votre assistant IA : « Joue le rôle d’un testeur. Quels cas particuliers ma fiche oublie-t-elle ? »</Bonus>
  </AtelierPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M7_Qcm: Page = () => (
  <QcmPage
    mod={7}
    n={6}
    title="Un besoin bien défini"
    q="Laquelle de ces formulations est un besoin métier clair, prêt à concevoir ?"
    explain="Un besoin clair dit pour qui, quand, quoi, pourquoi et comment on mesure, et nomme les exceptions. Les autres décrivent un outil, une envie ou un objectif sans critère."
  >
    <Opt why="Piège ! C’est une solution (un outil), pas un besoin : on ne sait ni quoi automatiser ni pourquoi.">
      « Il nous faut un workflow Make avec de l’IA »
    </Opt>
    <Opt why="Piège ! Aucun déclencheur, aucun critère : comment saura-t-on que c’est réussi ?">
      « Il faut que les demandes clients aillent plus vite »
    </Opt>
    <Opt ok why="Exact : pour qui, quand, quoi, afin de (mesurable) et sauf (exceptions). On peut concevoir et tester.">
      « Pour le service client, quand une demande arrive par le formulaire, je veux qu’elle soit classée et assignée, afin de répondre en moins de 4 h, sauf les plaintes juridiques »
    </Opt>
    <Opt why="Piège ! Tout automatiser n’est pas un besoin : c’est un risque. Et rien n’est mesurable.">
      « Automatiser tout ce qui peut l’être dans le service »
    </Opt>
  </QcmPage>
);

// ─── Synthesis ──────────────────────────────────────────────────────────────
const M7_Synthese: Page = () => (
  <SynthPage
    mod={7}
    title="Module 7 · Ce qu’il faut retenir"
    poste={
      <>
        Faites relire votre fiche par la personne qui fait la tâche <b>et</b> par celle qui en reçoit le résultat. Leurs remarques valent dix tests.
      </>
    }
  >
    <SynthRow n={1} tone="blue" d={100}>
      Un besoin clair : <b>pour qui, quand, je veux, afin de, sauf</b>.
    </SynthRow>
    <SynthRow n={2} tone="teal" d={220}>
      Chaque étape : <b>un verbe, un outil, une règle, une exception</b>.
    </SynthRow>
    <SynthRow n={3} tone="green" d={340}>
      Le dictionnaire de données fixe <b>formats</b> et <b>données sensibles</b>.
    </SynthRow>
    <SynthRow n={4} tone="yellow" d={460}>
      La fiche en 8 rubriques : on construit, on valide, on documente.
    </SynthRow>
  </SynthPage>
);

// ═══ 80-m8 ═════════════════════════════════════════════════════════════

// ═══ Module 8 · Construire un workflow automatisé ═══════════════════════════

const M8_Section: Page = () => (
  <Section n={8} title="Construire un workflow automatisé" sub="Sources, déclencheurs, actions… et une étape IA au milieu." dur="1 h 20">
    <SecItem n={1}>Connexion aux sources : SharePoint, Excel, courriels, CRM…</SecItem>
    <SecItem n={2}>Déclencheurs et actions</SecItem>
    <SecItem n={3}>Intégrer une IA : résumé, extraction, analyse de texte</SecItem>
  </Section>
);
M8_Section.transition = BLOOM;

// ─── Sources ────────────────────────────────────────────────────────────────
const M8_SRC: { apps: AppId[]; t: string; trig: string; act: string; warn: string }[] = [
  { apps: ['sheets', 'excel'], t: 'Tableurs', trig: 'Nouvelle ligne, ligne modifiée', act: 'Ajouter, mettre à jour, chercher des lignes', warn: 'En-têtes stables, pas de cellules fusionnées' },
  { apps: ['gmail', 'outlook'], t: 'Courriels', trig: 'Nouveau courriel (dossier, expéditeur, objet)', act: 'Envoyer, créer un brouillon, déplacer', warn: 'Boîtes partagées : droits à vérifier' },
  { apps: ['sharepoint', 'drive'], t: 'Fichiers et documents', trig: 'Fichier ajouté dans un dossier', act: 'Copier, renommer, lire le contenu', warn: 'Chemins et noms de fichiers sans surprise' },
  { apps: ['crm'], t: 'CRM', trig: 'Nouveau contact, affaire qui change d’étape', act: 'Créer, mettre à jour une fiche, ajouter une note', warn: 'Données clients : renseignements personnels' },
  { apps: ['forms'], t: 'Formulaires', trig: 'Nouvelle réponse', act: '(rarement une action)', warn: 'La meilleure source : des données déjà structurées' },
  { apps: ['make'], t: 'Webhook et API', trig: 'Un autre logiciel appelle une adresse', act: 'Appeler l’API d’un logiciel (module HTTP)', warn: 'Demande un peu de technique : à faire accompagner' },
];

const M8_Sources: Page = () => (
  <Frame mod={8}>
    <Title>Se connecter aux sources de données</Title>
    <Lede>Pour chaque source : ce qui peut déclencher, ce qu’on peut faire, et le point d’attention.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
      {M8_SRC.map((s, i) => (
        <div key={s.t} className={A.in} style={{ height: 300, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 26px', ...dl(80 + i * 80) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {s.apps.map((a) => (
              <AppTile key={a} id={a} size={48} />
            ))}
            <span style={{ marginLeft: 6, fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>{s.t}</span>
          </div>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 21, lineHeight: 1.35 }}>
            <div>
              <NodeChip kind="trigger" size={16} /> <span style={{ color: C.soft }}>{s.trig}</span>
            </div>
            <div>
              <NodeChip kind="action" size={16} /> <span style={{ color: C.soft }}>{s.act}</span>
            </div>
            <div style={{ color: T.coral.fg, fontWeight: 600 }}>⚠ {s.warn}</div>
          </div>
        </div>
      ))}
    </div>
  </Frame>
);

// ─── Triggers ───────────────────────────────────────────────────────────────
const M8_Declencheurs: Page = () => (
  <Frame mod={8}>
    <Title>Trois façons de démarrer un workflow</Title>
    <Tabs initial="evt" cls={A.in} style={{ position: 'absolute', left: 120, top: 196, width: 1680 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <TabBtn id="evt" icon="bolt" tone="blue">
          Un événement
        </TabBtn>
        <TabBtn id="time" icon="clock" tone="teal">
          Un horaire
        </TabBtn>
        <TabBtn id="cond" icon="filter" tone="yellow">
          Une condition
        </TabBtn>
      </div>
      <TabPane id="evt">
        <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          <Card tone="blue" icon="bolt" title="Quand quelque chose arrive" size={25} style={{ height: 520 }}>
            Un courriel, une ligne, un fichier, une réponse de formulaire.
            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Bullet>
                <b>Par vérification</b> : la plateforme regarde toutes les X minutes (Watch New Rows, Watch Emails).
              </Bullet>
              <Bullet>
                <b>Instantané</b> : l’application prévient la plateforme (webhook), sans délai.
              </Bullet>
            </div>
          </Card>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Chain x={40} y={0} size={110} gap={200} items={[{ app: 'forms', label: 'Nouvelle réponse' }, { app: 'sheets', label: 'Ligne ajoutée' }]} />
            <Callout title="Le cas le plus courant" tone="blue" icon="bulb" size={24} style={{ marginTop: 230 }}>
              C’est le déclencheur de vos ateliers : <b>une nouvelle ligne</b> dans le classeur.
            </Callout>
          </div>
        </div>
      </TabPane>
      <TabPane id="time">
        <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          <Card tone="teal" icon="clock" title="À heure fixe" size={25} style={{ height: 520 }}>
            Chaque lundi à 7 h, chaque jour à 17 h, le premier du mois.
            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Bullet tone="teal">Rapports hebdomadaires, relances, sauvegardes, rapprochements.</Bullet>
              <Bullet tone="teal">
                Dans Make : le module de départ peut être <b>n’importe quelle action</b> (chercher des lignes), planifiée.
              </Bullet>
            </div>
          </Card>
          <Callout title="Scénario B du module 9" tone="teal" icon="chart" size={24}>
            Le rapport hebdomadaire : un horaire, une recherche, un résumé IA, un courriel.
          </Callout>
        </div>
      </TabPane>
      <TabPane id="cond">
        <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          <Card tone="yellow" icon="filter" title="Seulement si…" size={25} style={{ height: 520 }}>
            Un déclencheur large, puis un <b>filtre</b> juste après : « seulement si l’objet contient “commande” », « seulement si le montant dépasse 500 $ ».
          </Card>
          <Callout title="Économisez vos crédits" tone="yellow" icon="money" size={24}>
            Filtrez le plus tôt possible : ce qui est filtré ne passe pas dans les modules suivants, donc ne les consomme pas.
          </Callout>
        </div>
      </TabPane>
    </Tabs>
  </Frame>
);

// ─── Actions ────────────────────────────────────────────────────────────────
const M8_Actions: Page = () => (
  <Frame mod={8}>
    <Title>Quatre familles d’actions</Title>
    <Lede>Tous les modules d’action entrent dans une de ces quatre familles.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
      {(
        [
          ['plus', 'green', 'Créer', ['Ajouter une ligne', 'Créer un fichier, un brouillon', 'Créer une fiche CRM']],
          ['loop', 'blue', 'Mettre à jour', ['Modifier une ligne', 'Déplacer, renommer un fichier', 'Changer le statut d’une affaire']],
          ['scan', 'teal', 'Extraire', ['Chercher des lignes', 'Lire le contenu d’un fichier', 'Extraire des champs avec l’IA']],
          ['split', 'yellow', 'Décider', ['Filtre : continuer ou non', 'Routeur : choisir un chemin', 'Classification IA + seuil']],
        ] as [IconName, Tone, string, string[]][]
      ).map(([ic, tone, t, items], i) => (
        <div key={t} className={A.in} style={{ height: 540, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, padding: '30px 28px', ...dl(100 + i * 120) }}>
          <IconTile name={ic} tone={tone} size={76} solid />
          <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 42, color: C.ink }}>{t}</div>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {items.map((x) => (
              <Bullet key={x} tone={tone} size={24}>
                {x}
              </Bullet>
            ))}
          </div>
        </div>
      ))}
    </div>
  </Frame>
);

// ─── Mapping ────────────────────────────────────────────────────────────────
const M8Kv = ({ k: key, v, tone }: { k: string; v: string; tone: Tone }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '9px 14px', borderRadius: 10, background: T[tone].bg, fontSize: 21 }}>
    <b style={{ color: T[tone].fg }}>{key}</b>
    <span style={{ color: C.ink, textAlign: 'right' }}>{v}</span>
  </div>
);
const M8Field = ({ label, children, beat }: { label: string; children: ReactNode; beat: number }) => (
  <div className={b.on(beat)} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <span style={{ width: 170, fontSize: 21, color: C.muted, textAlign: 'right' }}>{label}</span>
    <span style={{ flex: 1, minHeight: 50, boxSizing: 'border-box', padding: '8px 12px', borderRadius: 8, background: '#fff', boxShadow: `inset 0 0 0 2px ${C.rule}`, display: 'flex', alignItems: 'center', gap: 8, fontSize: 21 }}>{children}</span>
  </div>
);

const M8_Mapping: Page = () => (
  <Frame mod={8} beats={4}>
    <Title>Le mapping : brancher les données d’un module à l’autre</Title>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 210, width: 520, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW, padding: '18px 20px' }}>
        <Eyebrow c={T.green.fg} size={20}>
          Sortie du module 1 · Sheets
        </Eyebrow>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <M8Kv tone="green" k="Row number" v="7" />
          <M8Kv tone="green" k="Nom" v="Sophie Lavoie" />
          <M8Kv tone="green" k="Message" v="Mon colis n’est jamais arrivé…" />
        </div>
      </div>
      <div style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW, padding: '18px 20px' }}>
        <Eyebrow c={T.violet.fg} size={20}>
          Sortie du module 3 · Parse JSON
        </Eyebrow>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <M8Kv tone="violet" k="categorie" v="livraison" />
          <M8Kv tone="violet" k="priorite" v="haute" />
          <M8Kv tone="violet" k="resume" v="Colis jamais livré, cliente inquiète" />
        </div>
      </div>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 760, top: 210, width: 1040, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 28px', ...dl(150) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <AppTile id="sheets" size={40} />
        <span style={{ fontSize: 24, fontWeight: 700 }}>Module 4 · Google Sheets › Update a Row</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <M8Field beat={1} label="Row number">
          <Pill tone="green">1. Row number</Pill>
        </M8Field>
        <M8Field beat={2} label="Catégorie">
          <Pill tone="violet">3. categorie</Pill>
        </M8Field>
        <M8Field beat={2} label="Priorité">
          <Pill tone="violet">3. priorite</Pill>
        </M8Field>
        <M8Field beat={3} label="Résumé">
          <Pill tone="violet">3. resume</Pill> <span style={{ color: C.muted }}>(</span>
          <span style={{ color: C.muted }}>par</span> <Pill tone="green">1. Nom</Pill>
          <span style={{ color: C.muted }}>)</span>
        </M8Field>
      </div>
      <Callout cls={b.on(4)} title="Les fonctions" tone="blue" icon="code" size={21} style={{ marginTop: 22 }}>
        On peut transformer une valeur au passage : <code>formatDate(now; "YYYY-MM-DD")</code>, <code>upper()</code>, <code>ifempty(…; "inconnu")</code>.
      </Callout>
    </div>
    <Hint style={{ position: 'absolute', left: 120, top: 860 }}>Le numéro dans la pastille dit de quel module vient la valeur.</Hint>
  </Frame>
);

// ─── The AI step ────────────────────────────────────────────────────────────
const M8_IA: Page = () => (
  <Frame mod={8} beats={3}>
    <Title>Intégrer une IA : le module Gemini dans Make</Title>
    <Chain
      x={120}
      y={200}
      size={100}
      gap={110}
      items={[
        { app: 'sheets', label: 'Demande' },
        { app: 'gemini', label: 'Gemini', sub: 'Generate a response' },
        { icon: 'code', tone: 'teal', label: 'JSON', sub: 'Parse JSON' },
      ]}
    />
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 440, width: 760, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(
        [
          ['doc', 'green', 'Résumé automatique', 'Un compte rendu, un fil de courriels → 3 lignes'],
          ['scan', 'teal', 'Extraction d’informations', 'Un courriel, une facture → des champs'],
          ['smile', 'violet', 'Analyse de texte', 'Catégorie, ton, urgence, langue'],
        ] as [IconName, Tone, string, string][]
      ).map(([ic, tone, t, s]) => (
        <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 20px' }}>
          <IconTile name={ic} tone={tone} size={52} />
          <div>
            <div style={{ fontFamily: display, fontWeight: 700, fontSize: 28, color: C.ink }}>{t}</div>
            <div style={{ fontSize: 21, color: C.soft }}>{s}</div>
          </div>
        </div>
      ))}
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 960, top: 200, width: 840, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 26px', ...dl(200) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <AppTile id="gemini" size={40} />
        <span style={{ fontSize: 24, fontWeight: 700 }}>Google Gemini AI › Generate a response</span>
      </div>
      <div className={b.on(1)} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <M8Field beat={1} label="Connection">
          Ma clé AI Studio <Tag tone="green" size={16}>gratuite</Tag>
        </M8Field>
        <M8Field beat={1} label="Model">
          le modèle « Flash » proposé
        </M8Field>
      </div>
      <div className={b.on(2)} style={{ marginTop: 14 }}>
        <div style={{ fontSize: 21, color: C.muted, marginBottom: 6 }}>Message (prompt)</div>
        <div style={{ boxSizing: 'border-box', padding: '12px 14px', borderRadius: 8, boxShadow: `inset 0 0 0 2px ${C.rule}`, fontSize: 20, lineHeight: 1.5, color: C.ink }}>
          Analyse la demande ci-dessous. Réponds uniquement avec un objet JSON, sans balises de code : {'{'}"categorie", "priorite", "resume", "confiance"{'}'}… Demande : <Pill tone="green">1. Message</Pill>
        </div>
      </div>
      <Callout cls={b.on(3)} title="Puis Parse JSON" tone="teal" icon="code" size={21} style={{ marginTop: 16 }}>
        La réponse est un texte. <b>Parse JSON</b> le découpe en champs utilisables : <Pill tone="violet">categorie</Pill> <Pill tone="violet">priorite</Pill>…
      </Callout>
    </div>
    <Verified style={{ position: 'absolute', left: 960, top: 905 }}>Noms des modules Make vérifiés en novembre 2026 ; l’interface évolue souvent.</Verified>
  </Frame>
);

// ─── Router ─────────────────────────────────────────────────────────────────
const M8B = ({ cx: x, cy: y, size = 96, cls, ...it }: BubbleItem & { cx: number; cy: number; size?: number; cls?: string }) => (
  <div style={{ position: 'absolute', left: x - (size + 90) / 2, top: y - size / 2 }}>
    <Bubble2 {...it} size={size} cls={cls} />
  </div>
);
const M8Filter = ({ x, y, children, beat }: { x: number; y: number; children: ReactNode; beat: number }) => (
  <div className={b.on(beat)} style={{ position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, background: T.yellow.bg, boxShadow: `inset 0 0 0 1.5px ${T.yellow.bd}`, fontSize: 19, fontWeight: 600, color: C.ink, whiteSpace: 'nowrap' }}>
    <Icon name="filter" size={20} color={T.yellow.fg} /> {children}
  </div>
);

const M8_Router: Page = () => (
  <Frame mod={8} beats={3}>
    <Title>Décider : le routeur et ses filtres</Title>
    <Lede>Un routeur ouvre plusieurs chemins. Un filtre sur chaque chemin dit quelles demandes le prennent.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <path d="M 300 560 H 980" stroke={C.faint} strokeWidth={5} strokeDasharray="2 10" strokeLinecap="round" />
      <path d="M 980 560 C 1100 560, 1100 360, 1320 360" stroke={C.faint} strokeWidth={5} strokeDasharray="2 10" strokeLinecap="round" fill="none" className={b.fade(1)} />
      <path d="M 980 560 H 1320" stroke={C.faint} strokeWidth={5} strokeDasharray="2 10" strokeLinecap="round" className={b.fade(2)} />
      <path d="M 980 560 C 1100 560, 1100 760, 1320 760" stroke={C.faint} strokeWidth={5} strokeDasharray="2 10" strokeLinecap="round" fill="none" className={b.fade(3)} />
    </svg>
    <M8B cx={300} cy={560} app="sheets" label="Demande" />
    <M8B cx={520} cy={560} app="gemini" label="Classer" />
    <M8B cx={740} cy={560} icon="code" tone="teal" label="Parse JSON" />
    <M8B cx={980} cy={560} icon="split" tone="yellow" label="Routeur" />
    <M8B cx={1420} cy={360} app="gmail" label="Alerte au responsable" cls={b.pop(1)} />
    <M8B cx={1420} cy={560} app="sheets" label="Registre mis à jour" cls={b.pop(2)} />
    <M8B cx={1420} cy={760} icon="humanCheck" tone="coral" label="File « à vérifier »" cls={b.pop(3)} />
    <M8Filter beat={1} x={1080} y={300}>
      priorite = haute ET confiance ≥ 0,75
    </M8Filter>
    <M8Filter beat={2} x={1100} y={500}>
      confiance ≥ 0,75
    </M8Filter>
    <M8Filter beat={3} x={1080} y={800}>
      confiance &lt; 0,75
    </M8Filter>
    <Hint cls={b.fade(3)} style={{ position: 'absolute', left: 1560, top: 900 }}>
      Aucune demande ne se perd.
    </Hint>
  </Frame>
);

// ─── Target of the guided build ─────────────────────────────────────────────
const M8_Cible: Page = () => (
  <Frame mod={8} beats={1}>
    <Title>L’atelier guidé : ajouter l’IA à votre premier scénario</Title>
    <Lede>On repart du scénario de l’atelier 1. Trois modules s’ajoutent au milieu, l’alerte devient conditionnelle.</Lede>
    <Chain
      x={150}
      y={330}
      size={120}
      gap={150}
      items={[
        { app: 'sheets', label: '1 · Watch New Rows', sub: 'déjà fait' },
        { app: 'gemini', label: '2 · Generate a response', sub: 'nouveau' },
        { icon: 'code', tone: 'teal', label: '3 · Parse JSON', sub: 'nouveau' },
        { app: 'sheets', label: '4 · Update a Row', sub: 'nouveau' },
        { app: 'gmail', label: '5 · Send an email', sub: 'avec un filtre' },
      ]}
    />
    <Callout cls={b.on(1)} title="Le résultat attendu" tone="green" icon="check" style={{ position: 'absolute', left: 120, top: 660, width: 1680 }}>
      Vous ajoutez une demande fictive dans le classeur : les colonnes <b>Catégorie, Priorité, Résumé</b> se remplissent seules, et seule une demande urgente vous envoie un courriel.
    </Callout>
  </Frame>
);

// ─── Guided steps ───────────────────────────────────────────────────────────
const M8_Guide: Page = () => (
  <Frame mod={8} kind="atelier">
    <Title>Pas à pas · l’étape IA et la mise à jour</Title>
    <div style={{ position: 'absolute', left: 120, top: 196, width: 820, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Eyebrow cls={A.in} c={T.violet.fg}>
        L’étape IA
      </Eyebrow>
      <Do n={1} tone="violet">
        Clic droit sur le lien entre Sheets et Gmail › <Kbd>Add a module</Kbd> › <b>Google Gemini AI</b> › <Kbd>Generate a response</Kbd>.
      </Do>
      <Do n={2} tone="violet">
        <Kbd>Create a connection</Kbd> : collez votre clé d’API (dans Make, jamais dans le Chat).
      </Do>
      <Do n={3} tone="violet">Collez le prompt fourni dans le Chat ; remplacez la fin par la pastille Message du module 1.</Do>
      <Do n={4} tone="violet">
        <Kbd>Run once</Kbd> + une ligne de test : la bulle du module montre le JSON reçu.
      </Do>
    </div>
    <div style={{ position: 'absolute', left: 1000, top: 196, width: 800, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Eyebrow cls={A.in} c={T.teal.fg} style={dl(200)}>
        Découper, écrire, alerter
      </Eyebrow>
      <Do n={5} tone="teal">
        Ajoutez <b>JSON</b> › <Kbd>Parse JSON</Kbd>. Structure : <Kbd>Add</Kbd> › <Kbd>Generate</Kbd>, collez un exemple de JSON.
      </Do>
      <Do n={6} tone="teal">
        Ajoutez <b>Google Sheets</b> › <Kbd>Update a Row</Kbd> : Row number = pastille <Pill tone="green">1. Row number</Pill>.
      </Do>
      <Do n={7} tone="teal">Mappez Catégorie, Priorité, Résumé avec les pastilles du module 3.</Do>
      <Do n={8} tone="teal">
        Clic sur le lien avant Gmail › <Kbd>Set up a filter</Kbd> : <i>priorite</i> égal à <b>haute</b>.
      </Do>
    </div>
    <Callout cls={A.in} title="Parse JSON échoue ?" tone="yellow" icon="alert" size={22} style={{ position: 'absolute', left: 120, top: 820, width: 1680, ...dl(500) }}>
      L’IA a sans doute entouré sa réponse de balises <code>```json</code>. Renforcez le prompt (« sans balises de code »), ou retirez-les avec la fonction <code>replace()</code>.
    </Callout>
  </Frame>
);

// ─── Atelier 2 ──────────────────────────────────────────────────────────────
const M8_Atelier: Page = () => (
  <AtelierPage
    mod={8}
    n="Atelier 2"
    title="Ajouter l’IA à votre flux"
    timerId="m8-atelier"
    minutes={30}
    tools="Make · Google Gemini AI (votre clé AI Studio) · JSON · Google Sheets · Gmail"
    objective="Faire classer et résumer chaque nouvelle demande par l’IA, écrire le résultat dans le classeur et n’alerter que pour les demandes urgentes."
    deliver={
      <>
        Le scénario <b>« IA135 · Atelier 2 »</b> (5 modules) testé sur 3 demandes fictives : une urgente, une normale, une ambiguë.
      </>
    }
    crit={
      <>
        <CheckItem id="a" size={22}>Gemini renvoie un JSON valide</CheckItem>
        <CheckItem id="b" size={22}>Les 3 colonnes se remplissent seules</CheckItem>
        <CheckItem id="c" size={22}>Seule la demande urgente déclenche le courriel</CheckItem>
        <CheckItem id="d" size={22}>La demande ambiguë est repérée (confiance basse)</CheckItem>
      </>
    }
  >
    <Do n={1}>Dupliquez votre scénario de l’atelier 1 (… › Clone) et renommez-le.</Do>
    <Do n={2}>Suivez les 8 étapes de la page précédente.</Do>
    <Do n={3}>Testez les 3 demandes fictives collées dans le Chat, une par une, avec Run once.</Do>
    <Do n={4}>Ouvrez chaque bulle : la catégorie et la confiance sont-elles justes ? Notez-le dans votre carnet.</Do>
    <Bonus>Remplacez le filtre par un routeur à trois chemins, comme sur la page « Décider ».</Bonus>
  </AtelierPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M8_Qcm: Page = () => (
  <QcmPage
    mod={8}
    n={7}
    title="Le bon module au bon endroit"
    q="Gemini renvoie le texte {&quot;categorie&quot;: &quot;livraison&quot;, &quot;priorite&quot;: &quot;haute&quot;}. Pour écrire la catégorie dans le classeur, que faut-il ajouter avant Update a Row ?"
    explain="La réponse d’une IA est un texte. Parse JSON le transforme en champs séparés que l’on peut mapper un à un. Sans lui, on écrirait tout le texte dans une seule cellule."
  >
    <Opt ok why="Exact : Parse JSON découpe le texte en champs ; on mappe ensuite categorie dans la colonne Catégorie.">
      Un module Parse JSON
    </Opt>
    <Opt why="Piège ! Un routeur choisit un chemin ; il ne découpe pas le texte en champs.">
      Un routeur
    </Opt>
    <Opt why="Piège ! Une seconde étape IA coûterait du temps et des crédits, sans garantir un meilleur découpage.">
      Une seconde étape Gemini qui extrait la catégorie
    </Opt>
    <Opt why="Piège ! Un filtre laisse passer ou arrête ; il ne transforme pas les données.">
      Un filtre sur le lien
    </Opt>
  </QcmPage>
);

// ─── Synthesis ──────────────────────────────────────────────────────────────
const M8_Synthese: Page = () => (
  <SynthPage
    mod={8}
    title="Module 8 · Ce qu’il faut retenir"
    poste={
      <>
        Reprenez votre fiche de conception : écrivez à côté de chaque étape <b>le module Make</b> qui la réalisera.
      </>
    }
  >
    <SynthRow n={1} tone="blue" d={100}>
      Déclencheur : un <b>événement</b>, un <b>horaire</b> ou une <b>condition</b>.
    </SynthRow>
    <SynthRow n={2} tone="green" d={220}>
      Actions : <b>créer, mettre à jour, extraire, décider</b>.
    </SynthRow>
    <SynthRow n={3} tone="violet" d={340}>
      Étape IA → <b>Parse JSON</b> → mapping des champs.
    </SynthRow>
    <SynthRow n={4} tone="yellow" d={460}>
      Routeur + filtres : <b>aucune demande ne se perd</b>, le doute va à un humain.
    </SynthRow>
  </SynthPage>
);

// ═══ 90-m9 ═════════════════════════════════════════════════════════════

// ═══ Module 9 · Atelier · Un scénario complet ═══════════════════════════════

const M9_Section: Page = () => (
  <Section n={9} title="Atelier · Un scénario complet" sub="Trois scénarios au choix selon votre niveau, ou votre propre tâche." dur="1 h 15" kind="atelier">
    <SecItem n={1}>Suivi des demandes clients</SecItem>
    <SecItem n={2}>Rapport hebdomadaire automatique</SecItem>
    <SecItem n={3}>Réponses automatiques intelligentes</SecItem>
  </Section>
);
M9_Section.transition = BLOOM;

// ─── Choose your scenario ───────────────────────────────────────────────────
const M9Choice = ({ l, tone, icon, t, lvl, s, d }: { l: string; tone: Tone; icon: IconName; t: string; lvl: string; s: string; d: number }) => (
  <div className={A.in} style={{ height: 560, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, padding: '28px 28px', display: 'flex', flexDirection: 'column', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Num n={l} tone={tone} size={60} />
      <IconTile name={icon} tone={tone} size={60} />
    </div>
    <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 38, lineHeight: 1.08, color: C.ink }}>{t}</div>
    <Tag tone={tone} size={19} style={{ marginTop: 12, alignSelf: 'flex-start' }}>
      {lvl}
    </Tag>
    <div style={{ marginTop: 16, fontSize: 24, lineHeight: 1.42, color: C.soft }}>{s}</div>
  </div>
);

const M9_Choix: Page = () => (
  <Frame mod={9}>
    <Title>Choisissez votre scénario</Title>
    <Lede>Exemples proposés selon le niveau. Votre propre tâche est prête et réaliste ? Elle est la bienvenue.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
      <M9Choice d={100} l="A" tone="blue" icon="inbox" t="Suivi des demandes clients" lvl="Niveau intermédiaire" s="Extraction, classification IA, enregistrement, notification. Prolonge l’atelier 2." />
      <M9Choice d={220} l="B" tone="teal" icon="chart" t="Rapport hebdomadaire" lvl="Niveau débutant" s="Chaque lundi, les demandes de la semaine résumées par l’IA, envoyées par courriel." />
      <M9Choice d={340} l="C" tone="violet" icon="send" t="Réponses intelligentes" lvl="Niveau avancé" s="L’IA rédige un brouillon de réponse à partir d’une FAQ ; un humain valide avant l’envoi." />
      <M9Choice d={460} l="D" tone="yellow" icon="target" t="Votre propre tâche" lvl="Si votre fiche est prête" s="Votre fiche de conception, construite avec des données fictives. Le plus utile… et le plus exigeant." />
    </div>
  </Frame>
);

// ─── Scenario A ─────────────────────────────────────────────────────────────
const M9_ScA: Page = () => (
  <Frame mod={9} kind="atelier" beats={4}>
    <Title>
      <span style={{ color: C.blue }}>Scénario A</span> · Suivi des demandes clients
    </Title>
    <div style={{ position: 'absolute', left: 120, top: 186 }}>
      <CasTag>Boutique en ligne de cosmétiques québécoise · demandes via un formulaire</CasTag>
    </div>
    <FlowRow
      steps
      x={120}
      y={270}
      w={360}
      gap={80}
      nodes={[
        { kind: 'trigger', label: 'Extraction', sub: 'Google Forms → nouvelle ligne : nom, courriel, commande, message' },
        { kind: 'ai', label: 'Classification IA', sub: 'Gemini : catégorie, priorité, résumé, confiance (JSON)' },
        { kind: 'data', label: 'Enregistrement', sub: 'Update a Row + n° de dossier : DEM-{{date}}-{{ligne}}' },
        { kind: 'action', label: 'Notification', sub: 'Routeur : urgent → courriel au responsable ; doute → « à vérifier »' },
      ]}
    />
    <div style={{ position: 'absolute', left: 120, top: 560, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
      <Card tone="blue" icon="list" title="Modules Make" size={22} cls={b.on(4)}>
        Google Forms (ou Sheets) › Watch Responses · Google Gemini AI › Generate a response · JSON › Parse JSON · Google Sheets › Update a Row · Router · Gmail › Send an email
      </Card>
      <Bonus cls={b.on(4)} style={{ fontSize: 22 }}>
        Envoyez au client un accusé de réception avec son numéro de dossier et le délai annoncé selon la priorité.
      </Bonus>
    </div>
  </Frame>
);

// ─── Scenario B ─────────────────────────────────────────────────────────────
const M9_ScB: Page = () => (
  <Frame mod={9} kind="atelier" beats={4}>
    <Title>
      <span style={{ color: T.teal.fg }}>Scénario B</span> · Rapport hebdomadaire automatique
    </Title>
    <div style={{ position: 'absolute', left: 120, top: 186 }}>
      <CasTag>Firme de services informatiques · le directeur veut son point du lundi</CasTag>
    </div>
    <FlowRow
      steps
      x={120}
      y={270}
      w={360}
      gap={80}
      nodes={[
        { kind: 'trigger', label: 'Chaque lundi 7 h', sub: 'Planification du scénario (pour tester : Run once)' },
        { kind: 'data', label: 'Les demandes de la semaine', sub: 'Search Rows : date ≥ il y a 7 jours' },
        { kind: 'ai', label: 'Synthèse IA', sub: 'Text aggregator → Gemini : chiffres, tendances, 3 points d’attention' },
        { kind: 'action', label: 'Envoi du rapport', sub: 'Gmail : objet daté, synthèse en corps de message' },
      ]}
    />
    <div style={{ position: 'absolute', left: 120, top: 560, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
      <Card tone="teal" icon="list" title="Modules Make" size={22} cls={b.on(4)}>
        Google Sheets › Search Rows · Tools › Text aggregator · Google Gemini AI › Generate a response · Gmail › Send an email
      </Card>
      <Callout cls={b.on(4)} title="Le piège" tone="yellow" icon="alert" size={22}>
        Les chiffres : faites-les <b>calculer</b> par Make (nombre de lignes, compteurs), pas par l’IA. L’IA commente, elle ne compte pas.
      </Callout>
    </div>
  </Frame>
);

// ─── Scenario C ─────────────────────────────────────────────────────────────
const M9_ScC: Page = () => (
  <Frame mod={9} kind="atelier" beats={4}>
    <Title>
      <span style={{ color: C.violet }}>Scénario C</span> · Réponses automatiques intelligentes
    </Title>
    <div style={{ position: 'absolute', left: 120, top: 186 }}>
      <CasTag>Centre de formation · questions répétitives sur les inscriptions</CasTag>
    </div>
    <FlowRow
      steps
      x={120}
      y={270}
      w={360}
      gap={80}
      nodes={[
        { kind: 'trigger', label: 'Question reçue', sub: 'Nouvelle ligne (ou courriel avec étiquette « Questions »)' },
        { kind: 'ai', label: 'Brouillon de réponse', sub: 'Gemini + votre FAQ collée dans le prompt : répond seulement à partir de la FAQ' },
        { kind: 'human', label: 'Validation humaine', sub: 'Gmail › Create a draft : rien ne part sans relecture' },
        { kind: 'out', label: 'Journal', sub: 'Question, brouillon, « hors FAQ » oui ou non' },
      ]}
    />
    <div style={{ position: 'absolute', left: 120, top: 560, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
      <Card tone="violet" icon="list" title="La règle du prompt" size={22} cls={b.on(4)}>
        « Réponds uniquement à partir de la FAQ ci-dessous. Si la réponse n’y est pas, écris HORS_FAQ et rien d’autre. Ne promets ni prix, ni date, ni remboursement. »
      </Card>
      <Callout cls={b.on(4)} title="Pourquoi un brouillon" tone="coral" icon="humanCheck" size={22}>
        L’IA parle au nom de l’organisation. Le brouillon garde l’humain responsable de ce qui part.
      </Callout>
    </div>
  </Frame>
);

// ─── Atelier 3 ──────────────────────────────────────────────────────────────
const M9_Atelier: Page = () => (
  <AtelierPage
    mod={9}
    n="Atelier 3"
    title="Votre scénario complet"
    timerId="m9-atelier"
    minutes={50}
    tools="Make · Gemini · Google Sheets, Forms, Gmail · données fictives fournies dans le Chat"
    objective="Construire de bout en bout le scénario choisi (A, B, C ou votre tâche) et le tester sur au moins trois cas différents."
    deliver={
      <>
        Un scénario sauvegardé, testé sur 3 cas (normal, limite, ambigu), et dans le carnet : <b>ce qui marche, ce qui reste à faire</b>.
      </>
    }
    crit={
      <>
        <CheckItem id="a" size={22}>Les 4 étapes du scénario fonctionnent</CheckItem>
        <CheckItem id="b" size={22}>L’IA est encadrée (choix fermés, JSON, seuil)</CheckItem>
        <CheckItem id="c" size={22}>Un humain intervient là où l’erreur coûte</CheckItem>
        <CheckItem id="d" size={22}>3 cas testés, résultats notés</CheckItem>
      </>
    }
  >
    <Do n={1}>Annoncez votre choix (A, B, C ou D) au micro quand je vous appelle.</Do>
    <Do n={2}>Partez de votre scénario de l’atelier 2 (A, C) ou d’un nouveau scénario (B, D).</Do>
    <Do n={3}>Construisez étape par étape, et testez après chaque module ajouté (Run once).</Do>
    <Do n={4}>Testez les 3 cas fictifs ; notez les résultats et les surprises dans votre carnet.</Do>
    <Bonus>Ajoutez un gestionnaire d’erreur sur le module Gemini (clic droit › Add error handler › Resume ou Ignore) : voyez le module 10.</Bonus>
  </AtelierPage>
);

// ─── Milestones (live poll) ─────────────────────────────────────────────────
const M9_Jalons: Page = () => (
  <Frame mod={9} kind="atelier" label="Module 09 · Point d’étape">
    <Title>Où en êtes-vous ?</Title>
    <Lede w={800}>Annoncez le numéro de la dernière étape franchie. Je compte.</Lede>
    <Poll cls={A.in} style={{ position: 'absolute', left: 120, top: 290, width: 920 }}>
      <PollRow id="1" icon="bolt" tone="blue" label="1 · Mon déclencheur voit les données" />
      <PollRow id="2" icon="sparkles" tone="violet" label="2 · Mon étape IA renvoie un JSON" />
      <PollRow id="3" icon="table" tone="teal" label="3 · Le résultat est enregistré" />
      <PollRow id="4" icon="bell" tone="green" label="4 · La notification ou le brouillon part" />
      <PollRow id="5" icon="checkCircle" tone="yellow" label="5 · J’ai testé mes 3 cas" />
    </Poll>
    <div className={A.right} style={{ position: 'absolute', left: 1120, top: 290, width: 680, display: 'flex', flexDirection: 'column', gap: 20, ...dl(200) }}>
      <Card tone="coral" icon="hand" title="Bloqué depuis 5 minutes ?" size={24}>
        Dites-le au micro : vous partagez votre écran 2 minutes, on regarde ensemble. Souvent, la réponse aide tout le monde.
      </Card>
      <Card tone="green" icon="rocket" title="Déjà fini ?" size={24}>
        Bonus de votre scénario, ou commencez le plan de test du module 10 sur votre carnet.
      </Card>
    </div>
  </Frame>
);

// ─── Restitution by volunteers ──────────────────────────────────────────────
const M9_Restitution: Page = () => (
  <Frame mod={9} kind="atelier" label="Module 09 · Restitution">
    <Title>Deux ou trois volontaires montrent leur scénario</Title>
    <Lede>Trois minutes chacun, en partage d’écran. Les autres peuvent déposer une capture de leur scénario dans le Chat.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 290, width: 1000, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 32px' }}>
      <Eyebrow>La grille, pour chaque présentation</Eyebrow>
      <Checklist style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CheckItem id="a">Ça tourne de bout en bout sur un cas réel (fictif)</CheckItem>
        <CheckItem id="b">L’étape IA est encadrée : choix fermés, JSON, seuil</CheckItem>
        <CheckItem id="c">Un humain garde la main là où il faut</CheckItem>
        <CheckItem id="d">Aucune donnée réelle ou sensible</CheckItem>
        <CheckItem id="e">Le gain est estimé, en heures par an</CheckItem>
      </Checklist>
    </div>
    <div style={{ position: 'absolute', left: 1180, top: 290, width: 620, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Timer id="m9-resto" minutes={3} label="Présentation" cls={A.right} />
      <Callout cls={A.right} title="Rétroaction" tone="blue" icon="chat" size={23} style={dl(200)}>
        Un point fort et une piste, au micro. Puis « participant suivant ».
      </Callout>
    </div>
  </Frame>
);

// ─── Synthesis ──────────────────────────────────────────────────────────────
const M9_Synthese: Page = () => (
  <SynthPage
    mod={9}
    title="Module 9 · Ce qu’il faut retenir"
    poste={
      <>
        Exportez votre scénario (… › <b>Export Blueprint</b>) et rangez le fichier avec votre carnet : c’est votre point de départ au bureau.
      </>
    }
  >
    <SynthRow n={1} tone="blue" d={100}>
      Extraction → <b>classification IA</b> → enregistrement → notification : le schéma universel.
    </SynthRow>
    <SynthRow n={2} tone="teal" d={220}>
      Les <b>chiffres</b> se calculent par des modules ; l’IA commente.
    </SynthRow>
    <SynthRow n={3} tone="violet" d={340}>
      Une réponse IA part d’abord en <b>brouillon</b>, à partir d’une source validée.
    </SynthRow>
    <SynthRow n={4} tone="green" d={460}>
      On construit <b>module par module</b>, en testant à chaque ajout.
    </SynthRow>
  </SynthPage>
);

// ═══ 93-m10 ════════════════════════════════════════════════════════════

// ═══ Module 10 · Tester, optimiser, déployer ════════════════════════════════

const M10_Section: Page = () => (
  <Section n={10} title="Tester, optimiser, déployer" sub="Qu’il tourne lundi, sans vous, et qu’on sache ce qu’il rapporte." dur="45 min">
    <SecItem n={1}>Identifier les erreurs fréquentes</SecItem>
    <SecItem n={2}>Test unitaire et test global</SecItem>
    <SecItem n={3}>Mesure du temps gagné, mise en production, documentation</SecItem>
  </Section>
);
M10_Section.transition = BLOOM;

// ─── Frequent errors ────────────────────────────────────────────────────────
const M10_ERR: { icon: IconName; tone: Tone; sym: string; cause: string }[] = [
  { icon: 'bolt', tone: 'blue', sym: 'Le scénario ne démarre jamais', cause: 'Déclencheur mal réglé (dossier, feuille), planification désactivée' },
  { icon: 'link', tone: 'teal', sym: 'Des champs vides à l’arrivée', cause: 'Mapping cassé après une modification du classeur ou du module' },
  { icon: 'calendar', tone: 'yellow', sym: 'Des dates absurdes', cause: 'Formats différents : 04/12 lu comme le 12 avril' },
  { icon: 'copy', tone: 'violet', sym: 'Des doublons', cause: 'Scénario relancé sur les mêmes données, pas de contrôle d’unicité' },
  { icon: 'sparkles', tone: 'coral', sym: 'L’étape IA plante ou dérive', cause: 'JSON entouré de balises, catégorie inventée, quota gratuit atteint' },
  { icon: 'key', tone: 'green', sym: 'Tout s’arrête un matin', cause: 'Connexion expirée, mot de passe changé, crédits épuisés' },
];

const M10_Erreurs: Page = () => (
  <Frame mod={10}>
    <Title>Les six erreurs les plus fréquentes</Title>
    <Lede>Vous en avez croisé plusieurs aujourd’hui. Chacune a un symptôme reconnaissable.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      {M10_ERR.map((e, i) => (
        <FlipCard
          key={e.sym}
          w={544}
          h={270}
          tone={e.tone}
          backTone="green"
          cls={A.in}
          style={dl(80 + i * 80)}
          front={
            <>
              <IconTile name={e.icon} tone={e.tone} size={58} />
              <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 32, lineHeight: 1.1, color: C.ink }}>{e.sym}</div>
            </>
          }
          back={
            <>
              <Eyebrow c={T.green.fg} size={20}>
                Cause probable
              </Eyebrow>
              <div style={{ marginTop: 10, fontSize: 26, lineHeight: 1.4, color: C.ink }}>{e.cause}</div>
            </>
          }
        />
      ))}
    </div>
    <Hint style={{ position: 'absolute', left: 120, top: 890 }}>Demandez la cause probable avant de retourner chaque carte.</Hint>
  </Frame>
);

// ─── Unit test vs end-to-end ────────────────────────────────────────────────
const M10_Tests: Page = () => (
  <Frame mod={10} beats={2}>
    <Title>Test unitaire, puis test global</Title>
    <Card tone="blue" icon="puzzle" title="Test unitaire · un module à la fois" size={25} cls={A.left} style={{ position: 'absolute', left: 120, top: 220, width: 810, height: 560 }}>
      On vérifie qu’un module fait bien son travail, avec une donnée connue.
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Bullet>
          Make : clic droit › <Kbd>Run this module only</Kbd>
        </Bullet>
        <Bullet>L’étape IA : 10 messages dont on connaît la bonne catégorie</Bullet>
        <Bullet>On compare sortie attendue et sortie obtenue</Bullet>
      </div>
      <Tag tone="blue" size={20} style={{ marginTop: 20 }}>
        Pendant la construction
      </Tag>
    </Card>
    <Card tone="green" icon="route" title="Test global · de bout en bout" size={25} cls={b.on(1)} style={{ position: 'absolute', left: 990, top: 220, width: 810, height: 560 }}>
      On vérifie que tout le circuit produit le bon résultat, dans les vraies applications.
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Bullet tone="green">Une vraie demande fictive, du formulaire au courriel</Bullet>
        <Bullet tone="green">Les cas limites et les erreurs, pas seulement le cas heureux</Bullet>
        <Bullet tone="green">Idéalement fait par la personne qui fait la tâche</Bullet>
      </div>
      <Tag tone="green" size={20} style={{ marginTop: 20 }}>
        Avant la mise en production
      </Tag>
    </Card>
    <Callout cls={b.on(2)} title="Pour l’étape IA" tone="violet" icon="sparkles" style={{ position: 'absolute', left: 120, top: 820, width: 1680 }}>
      Une IA ne répond pas toujours pareil : on teste <b>plusieurs fois</b> et on mesure un <b>taux de bonnes réponses</b>, pas un « ça a marché ».
    </Callout>
  </Frame>
);

// ─── The test set ───────────────────────────────────────────────────────────
const M10_Jeu: Page = () => (
  <Frame mod={10} beats={5}>
    <Title>Un jeu de test : cinq types de cas</Title>
    <Table
      cls={A.in}
      style={{ position: 'absolute', left: 120, top: 210, width: 1680 }}
      cols="250px 1.3fr 1.2fr 160px"
      size={28}
      hi={1}
      head={['Type', 'Exemple (scénario A)', 'Résultat attendu', 'Obtenu ?']}
      rows={[
        ['Normal', 'Colis en retard, client poli', 'Livraison · normale · ligne remplie', '✓'],
        ['Urgent', 'Produit endommagé, cliente irritée', 'Priorité haute · courriel au responsable', '✓'],
        ['Limite', 'Message de 2 mots, ou de 2 pages', 'Pas d’erreur ; résumé correct', '?'],
        ['Invalide', 'Champ courriel vide, caractères spéciaux', 'Pas de plantage ; mis de côté', '✗'],
        ['Ambigu', 'Demande de partenariat', 'Autre · confiance basse · à vérifier', '✓'],
      ]}
    />
    <Hint style={{ position: 'absolute', left: 120, top: 820 }}>Chaque ✗ devient une correction ; on rejoue tout le jeu après chaque correction.</Hint>
  </Frame>
);

// ─── Optimise: robustness and credits ───────────────────────────────────────
const M10_Robuste: Page = () => (
  <Frame mod={10}>
    <Title>Optimiser : plus robuste, plus économe</Title>
    <div style={{ position: 'absolute', left: 120, top: 210, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26 }}>
      <Card tone="coral" icon="alert" title="Gérer les erreurs" size={23} cls={A.in} style={{ height: 520 }}>
        Clic droit sur un module › <b>Add error handler</b> :
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Bullet tone="coral" size={22}>
            <b>Ignore</b> : on passe à la suite
          </Bullet>
          <Bullet tone="coral" size={22}>
            <b>Resume</b> : on continue avec une valeur de secours
          </Bullet>
          <Bullet tone="coral" size={22}>
            <b>Break</b> : on met de côté et on réessaie plus tard
          </Bullet>
        </div>
        Et un courriel d’alerte à vous-même.
      </Card>
      <Card tone="yellow" icon="money" title="Économiser les crédits" size={23} cls={A.in} style={{ height: 520, ...dl(150) }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Bullet tone="yellow" size={22}>Filtrer juste après le déclencheur</Bullet>
          <Bullet tone="yellow" size={22}>Espacer la planification : toutes les heures suffit souvent</Bullet>
          <Bullet tone="yellow" size={22}>Traiter par lots (limite de lignes)</Bullet>
          <Bullet tone="yellow" size={22}>Pas d’étape IA quand une règle suffit</Bullet>
        </div>
      </Card>
      <Card tone="teal" icon="gauge" title="Améliorer la qualité" size={23} cls={A.in} style={{ height: 520, ...dl(300) }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Bullet tone="teal" size={22}>Ajuster le seuil de confiance avec les résultats réels</Bullet>
          <Bullet tone="teal" size={22}>Ajouter au prompt les exemples mal classés</Bullet>
          <Bullet tone="teal" size={22}>Échantillonner : relire 1 résultat sur 20 chaque semaine</Bullet>
        </div>
      </Card>
    </div>
    <Verified style={{ position: 'absolute', left: 120, top: 780 }}>Noms des gestionnaires d’erreur de Make vérifiés en novembre 2026.</Verified>
  </Frame>
);

// ─── Measuring the time saved (net) ─────────────────────────────────────────
const M10_Mesure: Page = () => {
  const [brut, setBrut] = useState(90);
  const [verif, setVerif] = useState(15);
  const [maint, setMaint] = useState(12);
  const net = Math.max(0, brut - verif - maint);
  return (
    <Frame mod={10} kind="exercice">
      <Title>Mesurer le temps réellement gagné</Title>
      <Lede>Le gain brut estimé au module 2, moins ce que l’automatisation coûte encore en temps humain.</Lede>
      <div className={A.left} style={{ position: 'absolute', left: 120, top: 290, width: 940, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <M2Input label="Gain brut estimé (module 2)" value={brut} set={setBrut} min={10} max={300} step={5} unit="h/an" tone="blue" />
        <M2Input label="Vérifications et cas « à vérifier »" value={verif} set={setVerif} min={0} max={100} unit="h/an" tone="coral" />
        <M2Input label="Maintenance (pannes, ajustements)" value={maint} set={setMaint} min={0} max={60} unit="h/an" tone="yellow" />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1120, top: 290, width: 680, display: 'flex', flexDirection: 'column', gap: 22, ...dl(200) }}>
        <div style={{ background: G.green, borderRadius: 20, boxShadow: SHADOW, padding: '28px 34px', color: '#fff' }}>
          <Eyebrow c="#E4F6E6">Gain net par an</Eyebrow>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 130, lineHeight: 1.05 }}>{fr(net, 0)} h</div>
          <div style={{ fontSize: 24 }}>soit {fr((net / Math.max(1, brut)) * 100, 0)} % du gain brut</div>
        </div>
        <div style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px' }}>
          <Eyebrow c={C.muted}>Mesurez aussi</Eyebrow>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 23, color: C.soft }}>
            <div>· Le <b>délai</b> de traitement, avant et après</div>
            <div>· Le <b>taux d’erreur</b> (saisie, classement)</div>
            <div>· La <b>satisfaction</b> de qui reçoit le résultat</div>
          </div>
        </div>
      </div>
    </Frame>
  );
};

// ─── Going to production ────────────────────────────────────────────────────
const M10_Prod: Page = () => (
  <Frame mod={10}>
    <Title>Mettre en production : la liste de contrôle</Title>
    <Lede>Ce qui sépare une démonstration d’un outil sur lequel on compte.</Lede>
    <Checklist style={{ position: 'absolute', left: 120, top: 280, width: 1000, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <CheckItem id="a" size={25}>Outil et compte approuvés par l’organisation (pas un compte personnel)</CheckItem>
      <CheckItem id="b" size={25}>Données réelles autorisées : politique interne, Loi 25, offre IA adaptée</CheckItem>
      <CheckItem id="c" size={25}>Jeu de test complet passé, résultats consignés</CheckItem>
      <CheckItem id="d" size={25}>Un responsable et un suppléant nommés</CheckItem>
      <CheckItem id="e" size={25}>Alertes d’erreur actives, vers une boîte surveillée</CheckItem>
      <CheckItem id="f" size={25}>Plan B : comment refaire à la main si ça s’arrête</CheckItem>
      <CheckItem id="g" size={25}>Utilisateurs informés : ce qui change, à qui signaler un problème</CheckItem>
    </Checklist>
    <div style={{ position: 'absolute', left: 1180, top: 280, width: 620, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card tone="green" icon="rocket" title="Démarrer petit" size={24} cls={A.right}>
        Deux semaines en <b>parallèle</b> du processus manuel, puis on compare. Ensuite seulement, on arrête le manuel.
      </Card>
      <Callout cls={A.right} title="Données et IA gratuite" tone="coral" icon="lock" size={23} style={dl(200)}>
        Une offre gratuite peut réutiliser vos données. En production, des renseignements personnels exigent une offre et un outil approuvés.
      </Callout>
    </div>
  </Frame>
);

// ─── Documentation ──────────────────────────────────────────────────────────
const M10_DOC: [string, string][] = [
  ['But', 'Le besoin, en une phrase (fiche de conception)'],
  ['Déclencheur et fréquence', 'Quoi, quand, combien de fois'],
  ['Applications et comptes', 'Lesquels, au nom de qui'],
  ['Données', 'Entrées, sorties, ce qui est sensible'],
  ['Étape IA', 'Prompt, modèle, seuil, version'],
  ['En cas d’erreur', 'Symptômes, que faire, qui appeler'],
  ['Responsables', 'Responsable, suppléant'],
  ['Historique', 'Date, changement, testé par'],
];

const M10_Doc: Page = () => (
  <Frame mod={10}>
    <Title>Documenter : la fiche d’exploitation</Title>
    <Lede>Écrite pour la personne qui reprendra votre workflow le jour où vous serez en vacances.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
      {M10_DOC.map(([k, v], i) => (
        <div key={k} className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 20, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '16px 22px', ...dl(60 + i * 60) }}>
          <Num n={i + 1} tone={i < 4 ? 'blue' : 'teal'} size={44} />
          <div>
            <div style={{ fontFamily: display, fontWeight: 700, fontSize: 28, color: C.ink }}>{k}</div>
            <div style={{ fontSize: 22, color: C.soft }}>{v}</div>
          </div>
        </div>
      ))}
    </div>
    <Hint style={{ position: 'absolute', left: 120, top: 830 }}>Les rubriques 1 à 5 se recopient de votre fiche de conception : la documentation est déjà à moitié écrite.</Hint>
  </Frame>
);

// ─── Final exercise ─────────────────────────────────────────────────────────
const M10_Atelier: Page = () => (
  <AtelierPage
    mod={10}
    kind="exercice"
    n="Exercice 5"
    title="Plan de test, gain et fiche d’exploitation"
    timerId="m10-plan"
    minutes={15}
    tools="Votre carnet de bord · rubrique 5 · votre scénario du module 9"
    objective="Préparer le passage en production de votre workflow : le tester, chiffrer son gain net, le documenter."
    deliver={
      <>
        Rubrique 5 : un <b>jeu de test de 5 cas</b> avec résultats, le <b>gain net</b> estimé, et la fiche d’exploitation (8 rubriques, même brèves).
      </>
    }
    crit={
      <>
        <CheckItem id="a" size={22}>Les 5 types de cas, avec résultat attendu</CheckItem>
        <CheckItem id="b" size={22}>Gain net = brut − vérification − maintenance</CheckItem>
        <CheckItem id="c" size={22}>Un responsable et un plan B nommés</CheckItem>
      </>
    }
  >
    <Do n={1}>Écrivez un cas de chaque type : normal, urgent, limite, invalide, ambigu.</Do>
    <Do n={2}>Jouez-en au moins deux sur votre scénario ; notez ✓ ou ✗.</Do>
    <Do n={3}>Reprenez votre gain brut du module 2 et calculez le gain net.</Do>
    <Do n={4}>Remplissez la fiche d’exploitation, même en une ligne par rubrique.</Do>
  </AtelierPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M10_Qcm: Page = () => (
  <QcmPage
    mod={10}
    n={8}
    title="Prêt pour la production ?"
    q="Votre workflow a bien fonctionné sur cinq demandes de test. Que faites-vous avant de couper le processus manuel ?"
    explain="Cinq tests heureux ne prouvent rien sur les cas limites ni sur la durée. On complète le jeu de test, on nomme un responsable, on active les alertes, puis on fait tourner en parallèle avant d’arrêter le manuel."
  >
    <Opt why="Piège ! Cinq cas, probablement tous « normaux » : ni les cas limites ni les erreurs n’ont été testés.">
      Rien : cinq tests réussis suffisent
    </Opt>
    <Opt why="Piège ! Plus d’IA n’améliore pas la fiabilité : c’est même une source d’incertitude supplémentaire.">
      Ajouter une seconde étape IA qui vérifie la première
    </Opt>
    <Opt why="Piège ! Activer partout d’un coup, sans responsable ni alerte, c’est découvrir les pannes par les plaintes.">
      L’activer pour tout le service dès lundi, puis corriger au fil de l’eau
    </Opt>
    <Opt ok why="Exact : jeu de test complet, responsable, alertes, puis deux semaines en parallèle du manuel avant de l’arrêter.">
      Compléter les tests, nommer un responsable, activer les alertes et tourner en parallèle quelques semaines
    </Opt>
  </QcmPage>
);

// ─── Synthesis ──────────────────────────────────────────────────────────────
const M10_Synthese: Page = () => (
  <SynthPage
    mod={10}
    title="Module 10 · Ce qu’il faut retenir"
    poste={
      <>
        Fixez une date dans un mois pour <b>mesurer le gain réel</b> et comparer avec votre estimation. Inscrivez-la à votre agenda maintenant.
      </>
    }
  >
    <SynthRow n={1} tone="coral" d={100}>
      Six erreurs fréquentes : déclencheur, mapping, dates, doublons, <b>IA</b>, connexions.
    </SynthRow>
    <SynthRow n={2} tone="blue" d={220}>
      Test <b>unitaire</b> en construisant, test <b>global</b> avant la production, 5 types de cas.
    </SynthRow>
    <SynthRow n={3} tone="green" d={340}>
      Le gain se mesure <b>net</b> : brut − vérifications − maintenance.
    </SynthRow>
    <SynthRow n={4} tone="teal" d={460}>
      Production : responsable, alertes, plan B, <b>fiche d’exploitation</b>.
    </SynthRow>
  </SynthPage>
);

// ═══ 95-close ══════════════════════════════════════════════════════════

// ═══ Clôture ═════════════════════════════════════════════════════════════════

const CL_TILES: { n: number; tone: Tone; t: string; k: string }[] = [
  { n: 1, tone: 'blue', t: 'Automatiser', k: 'Quand… Si… Alors…' },
  { n: 2, tone: 'teal', t: 'Identifier', k: 'SIPOC, carte, score /20' },
  { n: 3, tone: 'blue', t: 'Les outils', k: 'Connecteur d’abord' },
  { n: 4, tone: 'teal', t: 'RPA', k: 'Le plan B à l’écran' },
  { n: 5, tone: 'violet', t: 'L’IA', k: 'Texte libre → champs' },
  { n: 6, tone: 'yellow', t: 'Premier flux', k: 'Le mapping' },
  { n: 7, tone: 'teal', t: 'Concevoir', k: 'La fiche en 8 rubriques' },
  { n: 8, tone: 'blue', t: 'Construire', k: 'IA → Parse JSON → routeur' },
  { n: 9, tone: 'yellow', t: 'Scénario complet', k: 'Module par module' },
  { n: 10, tone: 'green', t: 'Déployer', k: 'Tests, gain net, doc' },
];

const CL_Recap: Page = () => (
  <Frame mod={11} label="Clôture · Les deux jours en une page">
    <Title>Dix modules, dix réflexes</Title>
    <div style={{ position: 'absolute', left: 120, top: 220, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 22 }}>
      {CL_TILES.map((x, i) => (
        <div key={x.n} className={A.pop} style={{ height: 300, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[x.tone]}`, padding: '24px 22px', ...dl(60 + i * 70) }}>
          <Num n={pad(x.n)} tone={x.tone} size={50} />
          <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 34, lineHeight: 1.05, color: C.ink }}>{x.t}</div>
          <div style={{ marginTop: 10, fontSize: 23, lineHeight: 1.35, color: C.soft }}>{x.k}</div>
        </div>
      ))}
    </div>
  </Frame>
);

const CL_Plan: Page = () => (
  <Frame mod={11} label="Clôture · Plan d’action">
    <Title>Votre plan d’action en trois horizons</Title>
    <Lede>Écrivez-le dans votre carnet, puis une phrase au micro : ce que vous ferez cette semaine.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
      <Card tone="blue" icon="bolt" title="Cette semaine" size={25} cls={A.in} style={{ height: 470 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Bullet>Faire relire votre fiche de conception</Bullet>
          <Bullet>Demander quels outils et données sont autorisés</Bullet>
          <Bullet>Exporter votre scénario (blueprint)</Bullet>
        </div>
      </Card>
      <Card tone="teal" icon="calendar" title="Ce mois-ci" size={25} cls={A.in} style={{ height: 470, ...dl(150) }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Bullet tone="teal">Construire votre workflow dans l’outil approuvé</Bullet>
          <Bullet tone="teal">Jouer le jeu de test complet</Bullet>
          <Bullet tone="teal">Deux semaines en parallèle du manuel</Bullet>
        </div>
      </Card>
      <Card tone="green" icon="trend" title="Ce trimestre" size={25} cls={A.in} style={{ height: 470, ...dl(300) }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Bullet tone="green">Mesurer le gain net réel</Bullet>
          <Bullet tone="green">Partager le résultat avec votre gestionnaire</Bullet>
          <Bullet tone="green">Choisir la deuxième tâche de votre liste</Bullet>
        </div>
      </Card>
    </div>
    <Timer id="cl-plan" minutes={8} label="Plan d’action" compact cls={A.in} style={{ position: 'absolute', left: 120, top: 800, ...dl(500) }} />
  </Frame>
);

const CL_RES: { icon: IconName; tone: Tone; t: string; s: string }[] = [
  { icon: 'book', tone: 'violet', t: 'Make Academy', s: 'academy.make.com · cours gratuits, du débutant à l’avancé' },
  { icon: 'doc', tone: 'blue', t: 'Aide de Make', s: 'help.make.com · modules, fonctions, gestion des erreurs' },
  { icon: 'bot', tone: 'teal', t: 'Power Automate Desktop', s: 'learn.microsoft.com · documentation et tutoriels en français' },
  { icon: 'sparkles', tone: 'violet', t: 'Google AI Studio', s: 'ai.google.dev · clés, modèles, conditions de l’offre gratuite' },
  { icon: 'puzzle', tone: 'green', t: 'Zapier et n8n', s: 'zapier.com/learn · docs.n8n.io · pour comparer' },
  { icon: 'shield', tone: 'coral', t: 'Loi 25', s: 'cai.gouv.qc.ca · obligations sur les renseignements personnels' },
];

const CL_Ressources: Page = () => (
  <Frame mod={11} label="Clôture · Pour aller plus loin">
    <Title>Pour continuer après la formation</Title>
    <div style={{ position: 'absolute', left: 120, top: 220, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      {CL_RES.map((r, i) => (
        <Card key={r.t} tone={r.tone} icon={r.icon} title={r.t} size={23} cls={A.in} style={{ height: 250, ...dl(60 + i * 80) }}>
          {r.s}
        </Card>
      ))}
    </div>
    <Callout cls={A.in} title="Votre carnet" icon="note" tone="blue" style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(600) }}>
      Tâches, score, SIPOC, prompt, fiche de conception, tests, gain : vous repartez avec un dossier complet pour convaincre et construire.
    </Callout>
  </Frame>
);

const CL_Merci: Page = () => (
  <Frame mod={11} chrome={false}>
    <img src={logoStack} alt="Technologia" className={A.fade} style={{ position: 'absolute', left: 112, top: 78, height: 150, display: 'block' }} />
    <Squares s={300} x={1400} y={330} delay={200} />
    <div style={{ position: 'absolute', left: 120, top: 380, width: 1100 }}>
      <h1 className={A.in} style={{ margin: 0, fontFamily: display, fontWeight: 700, fontSize: 150, lineHeight: 1, color: C.ink }}>
        {isLightExport() ? 'À bientôt !' : 'Merci !'}
      </h1>
      <p className={A.in} style={{ margin: '28px 0 0', fontSize: 36, lineHeight: 1.35, color: C.soft, ...dl(150) }}>
        {isLightExport()
          ? 'Avant la formation : créez vos comptes gratuits (Make, Google) et pensez à une tâche répétitive de votre travail. Le guide du participant explique tout.'
          : 'Votre avis compte : prenez trois minutes pour remplir l’évaluation de la formation.'}
      </p>
      <div className={A.in} style={{ marginTop: 50, display: 'flex', alignItems: 'center', gap: 22, ...dl(300) }}>
        <img src={formateur} alt={AUTHOR} style={{ width: 96, height: 96, borderRadius: 999, objectFit: 'cover', objectPosition: '50% 20%', display: 'block', boxShadow: `0 0 0 4px #fff, 0 0 0 7px ${C.yellow}` }} />
        <div>
          <div style={{ fontSize: 30, fontWeight: 600, color: C.ink }}>{AUTHOR}</div>
          <div style={{ fontSize: 24, color: C.muted }}>Formateur · Technologia · IA135</div>
        </div>
      </div>
    </div>
    <Footer2 />
  </Frame>
);
CL_Merci.transition = BLOOM;

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
  title: "Automatisation des tâches avec l’IA — Formation IA135 (2 jours)",
  createdAt: '2026-11-19T15:00:00.000Z',
  theme: 'technologia',
  labs: guideUrl,
};

// Module → index of its opening page (written by scripts/deck-features.mjs).
const MOD_START: Record<number, number> = {0:0,1:8,2:18,3:32,4:42,5:53,6:70,7:77,8:86,9:98,10:107,11:118};

export default [
  OP_Cover,
  OP_Trainer,
  OP_Tour,
  OP_Objectives,
  OP_Program,
  OP_HowWeWork,
  OP_Carnet,
  OP_Quiz0,
  M1_Section,
  M1_Definition,
  M1_Avant,
  M1_Echelle,
  M1_Classique,
  M1_Regle,
  M1_Trier,
  M1_Exemples,
  M1_Qcm,
  M1_Synthese,
  M2_Section,
  M2_Desordre,
  M2_Sipoc,
  M2_SipocEx,
  M2_Carto,
  M2_CartoEx,
  M2_Voleurs,
  M2_Journal,
  M2_Criteres,
  M2_Score,
  M2_Gain,
  M2_Atelier,
  M2_Qcm,
  M2_Synthese,
  M3_Section,
  M3_Familles,
  M3_Connecteur,
  M3_Panorama,
  M3_Vocab,
  M3_Choisir,
  M3_Make,
  M3_Setup,
  M3_Qcm,
  M3_Synthese,
  M4_Section,
  M4_Robot,
  M4_Api,
  M4_Modes,
  M4_Anatomie,
  M4_Cas,
  M4_Demo,
  M4_Fragile,
  M4_Ordre,
  M4_Qcm,
  M4_Synthese,
  M5_Section,
  M5_Apport,
  M5_Ops,
  M5_Ocr,
  M5_Classif,
  M5_Extraction,
  M5_Reponses,
  M5_Agents,
  M5_Prompt,
  M5_Exercice,
  M5_Qcm,
  M5_Synthese,
  J1_Bilan,
  J1_Demain,
  J2_Cover,
  J2_Rappel,
  J2_Programme,
  M6_Section,
  M6_DemoPA,
  M6_Make,
  M6_PasAPas,
  M6_Atelier,
  M6_Pieges,
  M6_Synthese,
  M7_Section,
  M7_Besoin,
  M7_Etapes,
  M7_Diagramme,
  M7_IO,
  M7_Fiche,
  M7_Atelier,
  M7_Qcm,
  M7_Synthese,
  M8_Section,
  M8_Sources,
  M8_Declencheurs,
  M8_Actions,
  M8_Mapping,
  M8_IA,
  M8_Router,
  M8_Cible,
  M8_Guide,
  M8_Atelier,
  M8_Qcm,
  M8_Synthese,
  M9_Section,
  M9_Choix,
  M9_ScA,
  M9_ScB,
  M9_ScC,
  M9_Atelier,
  M9_Jalons,
  M9_Restitution,
  M9_Synthese,
  M10_Section,
  M10_Erreurs,
  M10_Tests,
  M10_Jeu,
  M10_Robuste,
  M10_Mesure,
  M10_Prod,
  M10_Doc,
  M10_Atelier,
  M10_Qcm,
  M10_Synthese,
  CL_Recap,
  CL_Plan,
  CL_Ressources,
  CL_Merci,
] satisfies Page[];

// Speaker notes — one entry per page, same order as the default export.
export const notes: (string | undefined)[] = [
  `⏱ 1 min · ACCUEIL (page affichée pendant l'arrivée des participants)

OBJECTIF — Installer un climat chaleureux et annoncer la promesse : en deux jours, chacun transforme une vraie tâche de son quotidien en workflow automatisé.

DIRE — « Bonjour et bienvenue à la formation Automatisation des tâches avec l'IA. Regardez l'animation : une demande arrive, l'IA la lit, elle est enregistrée dans un registre, quelqu'un est prévenu. Zéro copier-coller. Dans deux jours, vous aurez construit ce genre de circuit vous-mêmes. »

LOGISTIQUE — Classe virtuelle, 9 h – 16 h les deux jours. Pauses vers 10 h 40 et 14 h 40 le jour 1, 10 h 15 et 14 h 45 le jour 2, dîner 12 h – 13 h. Vérifiez le son, la caméra et l'accès au Chat. Rappelez les prérequis techniques : un navigateur récent, un compte Google (gratuit) et un accès à un assistant d'IA gratuit (Copilot, Gemini ou ChatGPT). Les comptes Make se créent ensemble au module 3.

TRANSITION — « Quelques mots sur moi avant de commencer. »`,
  `⏱ 2 min

OBJECTIF — Établir votre crédibilité et un contrat pédagogique clair.

DIRE — Présentez-vous en 60 à 90 secondes. À PERSONNALISER : votre parcours, une automatisation qui vous a fait gagner du temps, une qui a mal tourné.

Puis les quatre engagements :
1. « On part de votre réalité : chacun choisit une tâche de son travail. »
2. « Des outils gratuits et sans code : vous pourrez continuer lundi sans budget. »
3. « Vous construisez vous-mêmes, sur votre poste, pas à pas. »
4. « Vous repartez avec un workflow qui tourne et une fiche pour le déployer proprement. »

TRANSITION — « À votre tour maintenant. »`,
  `⏱ 8 min (40 secondes par personne, ajuster selon la taille du groupe)

OBJECTIF — Connaître le groupe et récolter déjà des tâches candidates.

ANIMATION — Lancez le minuteur. Appelez chaque personne par son prénom (ordre de la liste des participants) ; micro ouvert, deux réponses. Notez dans un document à vous les tâches citées : ce sont d'excellents exemples pour les modules 2 et 7, et vous pourrez y revenir par prénom.

SONDAGE — Chacun annonce le numéro de la ligne qui le décrit le mieux (1 à 5). Cliquez une fois la ligne par réponse (« − » corrige une erreur).

LECTURE —
• Majorité 1-2 : prenez votre temps aux modules 3 et 6, montrez chaque clic.
• Majorité 3-4 : accélérez le module 3, approfondissez l'IA (module 5) et les routeurs (module 8).
• Des 5 : proposez-leur les bonus des ateliers et demandez s'ils acceptent de montrer leur réalisation au module 9.

TRANSITION — « Voici ce qu'on vise ensemble. »`,
  `⏱ 1 min

OBJECTIF — Présenter les cinq objectifs officiels comme une progression.

DIRE — « Cinq marches, qui reprennent les objectifs de la formation. »
1. IDENTIFIER — « Repérer ce qui mérite d'être automatisé, avec des outils d'analyse simples : le SIPOC et la cartographie. »
2. CONCEVOIR — « Dessiner un workflow clair avant de cliquer : déclencheur, actions, données. »
3. METTRE EN ŒUVRE — « Les robots logiciels, le RPA, pour les tâches répétitives : courriels, rapports, synchronisation de fichiers. »
4. INTÉGRER L'IA — « Classer, extraire, résumer : l'IA comme une étape du workflow. »
5. DÉPLOYER — « Tester, mettre en production, et mesurer le temps réellement gagné. »

TRANSITION — « Voici comment les deux jours s'organisent. »`,
  `⏱ 1 min

OBJECTIF — Donner de la visibilité sur le déroulement des deux jours.

DIRE — « Le jour 1, on repère et on comprend : ce qu'est l'automatisation, comment choisir une tâche, le panorama des outils, les robots logiciels, puis ce que l'IA ajoute. »

« Le jour 2, on construit : un premier flux simple, une méthode de conception, la construction d'un vrai workflow avec une étape IA, un scénario complet, et pour finir les tests, la mesure du gain et le déploiement. »

À SOULIGNER — Les modules en jaune sont des ateliers : chacun sur son poste, avec un minuteur. Les numéros en haut à droite des pages sont cliquables : ils ramènent au début d'un module.

TRANSITION — « Comment on va travailler. »`,
  `⏱ 1 min

OBJECTIF — Expliquer les codes visuels et le contrat de participation.

DIRE — « Les étiquettes en haut des pages : QCM en violet, vous votez à voix haute et je clique ; DÉMO en bleu, je montre en partage d'écran ; EXERCICE en vert, vous analysez votre propre travail ; ATELIER en jaune, vous construisez. »

LES TROIS RÈGLES —
1. Questions bienvenues à tout moment, au micro.
2. « Dans les outils gratuits, on travaille avec des données fictives. Les offres gratuites d'IA peuvent réutiliser ce que vous envoyez : jamais de données clients ou personnelles réelles pendant la formation. »
3. Un cas différent à chaque module : comptabilité, service client, RH, ventes… pour que chacun s'y retrouve.

CLASSE VIRTUELLE — Caméra si possible, micro coupé hors échanges. Idéal : deux écrans, la formation d'un côté et Make de l'autre.

TRANSITION — « Et le fil qui relie tout : votre propre tâche. »`,
  `⏱ 2 min · CARNET DE BORD

OBJECTIF — Lancer le fil conducteur personnel des deux jours.

DIRE — « Pas d'entreprise imaginaire commune : votre fil rouge, c'est votre travail. Une tâche réelle, qu'on va repérer, choisir, analyser, concevoir, puis construire et déployer. »

LOGISTIQUE — Collez dans le Chat le modèle du carnet de bord (5 rubriques : 1. Mes tâches répétitives · 2. Ma tâche choisie et son score · 3. Mon SIPOC · 4. Ma fiche de conception · 5. Mon plan de test et mon gain). Chacun l'ouvre dans un document personnel.

À DIRE — « Si votre tâche contient des données sensibles, gardez la vraie tâche pour la conception, mais construisez avec des données inventées. »

TRANSITION — « Avant de commencer, testons vos intuitions. »`,
  `⏱ 2 min · QCM À RÉPONSES MULTIPLES

OBJECTIF — Faire émerger les représentations initiales sans juger.

ANIMATION — Lisez la question. Les participants annoncent les lettres qu'ils retiennent (ex. « B et C »). Cochez les options choisies par la majorité, puis « Valider ma sélection ». Cliquez ensuite chaque option pour lire l'explication. Avec →, vous révélez les bonnes réponses, puis l'essentiel.

RÉPONSES — B et C.
• A ✗ PIÈGE — On n'automatise pas le chaos : on clarifie d'abord (module 2).
• B ✓ — Les outils sans code se construisent par blocs.
• C ✓ — C'est l'apport majeur de l'IA : lire du texte libre (module 5).
• D ✗ PIÈGE — L'IA se trompe parfois : tests et validation humaine (modules 8 et 10).

TRANSITION — « Commençons par le commencement : qu'est-ce qu'automatiser ? »`,
  `⏱ 1 min · MODULE 1 (45 min)

DIRE — « Premier module : on pose les bases. Qu'est-ce qu'automatiser, et qu'est-ce que l'IA change vraiment ? On termine par des exemples concrets, service par service. »

TRANSITION — « Commençons par une définition simple. »`,
  `⏱ 4 min

OBJECTIF — Donner une définition opérationnelle, réutilisée toute la formation.

DIRE — « Automatiser, c'est confier une suite d'actions à un système. Toujours trois morceaux. » Cliquez (→) à chaque bloc :
→ beat 1 « Si… » — « Une règle : la condition qui décide. »
→ beat 2 « Alors… » — « Des actions : ce que le système fait à votre place. »
Avant le premier clic, lisez le bloc « Quand… » : « Un déclencheur : un événement, une heure, une nouvelle donnée. »
→ beat 3 — Les trois propriétés : répétable, fiable, traçable.

INSISTER — « Fiable… tant que les règles et les données sont bonnes. Une automatisation reproduit aussi les erreurs, mille fois et très vite. »

INTERACTION — « Donnez-moi une tâche de votre semaine sous la forme Quand… Si… Alors… » Écoutez deux réponses au micro.

TRANSITION — « Voyons ce que ça change sur une vraie tâche. »`,
  `⏱ 4 min · CAS : CABINET COMPTABLE

OBJECTIF — Rendre le gain concret, en minutes.

DIRE — « Un cabinet comptable reçoit ses factures fournisseurs par courriel. À la main : six gestes, environ dix minutes par facture. » Lisez la colonne de gauche.
→ beat 1 — La version automatisée apparaît : « Le courriel déclenche tout. Remarquez l'étape 3 : l'IA lit la facture. Sans elle, il faudrait un formulaire. »
→ beat 2 — « Soixante factures par mois : environ neuf heures rendues. Et vous ne regardez plus que les cas signalés. »

À SOULIGNER — L'humain ne disparaît pas : il approuve et traite les exceptions.

TRANSITION — « Il existe plusieurs façons d'automatiser. Rangeons-les. »`,
  `⏱ 5 min

OBJECTIF — Situer RPA, workflows et IA sur une même échelle.

DIRE — Révélez les niveaux un à un (→ beats 1 à 6) :
1. Règles et formules : « Vous en avez déjà : une règle Outlook, un filtre Gmail. »
2. Macros et scripts : « Du code. Puissant, mais fragile et dépendant de la personne qui l'a écrit. »
3. RPA : « Un robot logiciel qui clique et tape à l'écran comme vous. Module 4. »
4. Workflows sans code : « Make, Zapier, n8n, Power Automate relient les applications par leurs connecteurs. Notre outil principal. »
5. Workflows + IA : « Une étape IA dans le circuit : elle lit, classe, extrait. Modules 5 et 8. »
6. Agents IA : « L'IA choisit ses étapes elle-même. Prometteur, mais plus difficile à contrôler. »

MESSAGE CLÉ — « On choisit toujours le niveau le plus bas qui fait le travail. »

TRANSITION — « Arrêtons-nous sur la différence entre classique et IA. »`,
  `⏱ 5 min

OBJECTIF — Comprendre quand l'IA est utile et ce qu'elle change dans le contrôle.

DIRE — Révélez les lignes (→ beats 1 à 5).
• Entrées : « Classique : des données rangées. IA : du texte libre, un PDF, une photo. »
• Logique : « Une règle s'écrit. Un jugement comme “ce courriel est une plainte” ne s'écrit pas facilement. »
• Résultat : « Une règle donne toujours la même réponse. L'IA donne la réponse la plus probable. »
• Quand ça rate : « C'est la différence la plus importante. Une règle échoue en s'arrêtant. L'IA échoue en se trompant avec assurance. »
• Contrôle : « D'où les tests, l'échantillonnage et la validation humaine. »
→ beat 5 — À retenir : on combine les deux.

TRANSITION — « Démonstration : une règle face à quatre courriels. »`,
  `⏱ 6 min · DÉMO INTERACTIVE

OBJECTIF — Faire sentir la limite des règles et l'apport de l'IA.

DIRE — « La règle : si l'objet contient “facture”, on classe dans Factures. Regardez les résultats. » Commentez : 1 seul courriel bien traité sur 4. La note d'honoraires est manquée, la question de la cliente est mal rangée, le relevé est ignoré.

INTERACTION — « Comment amélioreriez-vous la règle ? » Écoutez deux réponses (ajouter “honoraires”, exclure “Re:”…). « Chaque mot ajouté corrige un cas et en casse un autre. »

Puis cliquez « Activer l'étape IA » : « L'IA comprend le sens. Elle classe, et en plus elle extrait le montant et l'échéance. »

QUESTION — « Et quand elle se trompe ? » C'est la bonne question : on y répond aux modules 8 et 10.

TRANSITION — « À vous de juger : règles, IA ou humain ? »`,
  `⏱ 7 min · EXERCICE ORAL

OBJECTIF — Exercer le premier réflexe : la bonne solution pour chaque tâche.

ANIMATION — Appelez un participant par son prénom pour chaque étiquette : « Où va-t-elle ? » Déplacez-la. Demandez parfois « Qui voit les choses autrement ? » et faites intervenir une deuxième personne au micro.

PROPOSITION DE CORRIGÉ —
• Règles : copier un formulaire, rappel à J-3, sauvegarder les pièces jointes.
• IA : trier par motif, résumer 40 réponses ouvertes, lire des factures scannées (OCR + extraction).
• Humain : annoncer un licenciement, négocier avec un client mécontent.

NUANCE — « Le résumé du sondage : IA, mais une personne relit avant diffusion. Négocier : l'IA peut préparer les arguments, la conversation reste humaine. » Double-cliquer sur une étiquette la remet à sa place.

TRANSITION — « Voyons ce que les entreprises automatisent déjà. »`,
  `⏱ 6 min

OBJECTIF — Donner des exemples concrets par service, et nourrir le choix de la tâche réelle.

ANIMATION — Cliquez les onglets en fonction du groupe (notes du tour de table). Pour chaque carte : « règles seules » ou « avec IA ». Faites remarquer que la majorité des automatisations utiles n'ont pas besoin d'IA.

INTERACTION — « Quelle carte ressemble le plus à votre travail ? » Deux ou trois réponses au micro, par prénom.

À SOULIGNER — Service client et ventes : beaucoup de texte libre, donc beaucoup d'IA. Finance et opérations : surtout des règles, l'IA pour lire les documents.

TRANSITION — « Vérifions avec un QCM. »`,
  `⏱ 3 min · QCM 1

ANIMATION — Votes à voix haute (A, B, C ou D). Cliquez la réponse majoritaire, puis les autres pour les pièges. → révèle la bonne réponse, puis l'essentiel.

RÉPONSE — B. Données structurées : une automatisation classique suffit.
• A ✗ — « L'IA partout » est le piège le plus courant : coût, lenteur, erreurs possibles.
• C ✗ — Fréquent et simple : candidat idéal.
• D ✗ — Un agent est disproportionné.

TRANSITION — « Synthèse du module. »`,
  `⏱ 2 min · SYNTHÈSE

DIRE — Relisez les quatre points. Insistez sur le 2 : « le plus simple qui fait le travail ».

À VOTRE POSTE — « Dans votre carnet, rubrique 1 : une première tâche écrite en Quand… Si… Alors… On la mettra à l'épreuve au module 2. »

TRANSITION — « Comment trouver les bonnes tâches à automatiser ? C'est le module 2. »`,
  `⏱ 1 min · MODULE 2 (1 h 20, pause de 15 min vers 10 h 40 incluse dans le déroulé)

DIRE — « Le module le plus important des deux jours. Une bonne automatisation commence par une bonne analyse. On voit deux outils, le SIPOC et la cartographie, puis vous les appliquez à votre propre travail. »

TRANSITION — « Premier principe. »`,
  `⏱ 3 min

OBJECTIF — Ancrer la règle « simplifier avant d'automatiser ».

DIRE — Lisez la citation. « Si un processus est mal conçu, l'automatiser produit les mêmes erreurs, mais plus vite. »
→ beat 1 Comprendre — « On décrit la réalité, pas la procédure officielle. »
→ beat 2 Simplifier — « Souvent, 20 à 30 % des étapes disparaissent : une validation que plus personne ne lit, un fichier intermédiaire. »
→ beat 3 Automatiser — « Ce qui reste est plus court, donc plus simple à construire et à maintenir. »

INTERACTION — « Avez-vous une étape dans votre travail dont personne ne sait plus pourquoi elle existe ? » Une ou deux réponses.

TRANSITION — « Premier outil pour comprendre : le SIPOC. »`,
  `⏱ 5 min

OBJECTIF — Expliquer le SIPOC simplement.

DIRE — « SIPOC vient de l'anglais : Suppliers, Inputs, Process, Outputs, Customers. Cinq colonnes qui tiennent sur une page. » Révélez les colonnes (→ beats 1 à 5) avec la question de chacune.

INSISTER — « P, ce sont 4 à 7 grandes étapes. Si vous en avez 25, vous êtes dans la cartographie détaillée, c'est trop tôt. »

ASTUCE — On remplit dans l'ordre P, O, C, I, S : on part de ce qu'on fait, puis on regarde à qui ça sert, puis ce dont on a besoin.

TRANSITION — « Un exemple complet. »`,
  `⏱ 5 min · CAS : NOTES DE FRAIS

OBJECTIF — Montrer un SIPOC rempli, dans l'ordre recommandé.

DIRE — « Une PME de services : 120 employés, 300 notes de frais par mois. » Révélez dans l'ordre (→) :
→ beat 1 P — les 5 étapes.
→ beat 2 O — virement, écriture comptable, dossier archivé.
→ beat 3 S, beat 4 I — l'employé, la carte de crédit ; le formulaire, les reçus, la politique.
→ beat 5 C — l'employé, la comptabilité… et le vérificateur externe, qu'on oublie souvent.

QUESTION — « Quel client du processus est le plus pressé ? » L'employé, qui attend son argent. « Et le plus exigeant ? » Le vérificateur : il faut la traçabilité.

TRANSITION — « Le SIPOC ne montre pas où ça coince. Pour ça : la carte. »`,
  `⏱ 4 min

OBJECTIF — Donner les quatre symboles et la notion de couloir.

DIRE — Présentez les symboles : début/fin, étape (un verbe), décision (une question oui/non), flèche. « Quatre symboles suffisent. Pas besoin de norme compliquée. »

Couloirs — « Une bande par acteur. Chaque fois qu'une flèche change de couloir, quelqu'un attend quelqu'un d'autre. C'est là que se cachent les délais. »

RÈGLE D'OR — « Dessinez le vrai processus, avec ses relances et ses contournements. »

OUTILS — Papier, PowerPoint, draw.io (gratuit), ou demander à une IA de proposer un diagramme à partir d'une liste d'étapes.

TRANSITION — « Voici la carte réelle des notes de frais. »`,
  `⏱ 6 min · CAS INTERACTIF

OBJECTIF — Lire une carte pour y trouver les gains.

DIRE — Suivez le parcours avec le pointeur : formulaire, reçus, approbation par courriel, décision « dossier complet ? », ressaisie, virement.

ANIMATION — « Où perd-on du temps ? » Laissez proposer, puis cliquez les pastilles 1 à 4 :
1. Double saisie des montants par l'employé.
2. Attente de l'approbation : 4 jours, deux relances.
3. Une note sur quatre revient au début.
4. Ressaisie par la comptabilité.

QUESTION — « Que simplifieriez-vous avant d'automatiser ? » Pistes : un formulaire en ligne avec photo du reçu (supprime 1 et 4), une approbation par bouton avec rappel automatique (2), des champs obligatoires (3). « L'IA n'apparaît qu'à un endroit : lire le reçu. »

TRANSITION — « Ces irritants ont des familles. »`,
  `⏱ 3 min

OBJECTIF — Donner une grille de repérage pour l'exercice suivant.

DIRE — Parcourez les six cartes. « Si vous vous surprenez à faire un de ces gestes plusieurs fois par semaine, notez-le. »

INTERACTION — « Lequel de ces six est votre pire ennemi ? » Trois réponses rapides, par prénom.

TRANSITION — « À vous : on analyse votre quotidien. »`,
  `⏱ 10 min · EXERCICE 1 INDIVIDUEL

OBJECTIF — Chacun liste au moins cinq tâches répétitives, avec fréquence, durée et outils.

ANIMATION — Lancez le minuteur. Collez dans le Chat le gabarit du tableau (tâche · fréquence · durée · outils). Rappelez : on pense à la dernière semaine, jour par jour.

POINT D'ÉTAPE à 5 min — « Combien de tâches avez-vous déjà ? » Réponses au micro ou un chiffre dans le Chat. Quelqu'un est bloqué : proposez la liste d'exemples du livrable.

À LA FIN — Deux volontaires lisent leur tâche la plus chronophage. Ne commentez pas encore : on va les noter.

NOTE — Si la pause n'a pas encore eu lieu, placez-la ici (10 h 40, 15 min).

TRANSITION — « Comment savoir laquelle automatiser ? Quatre critères. »`,
  `⏱ 4 min

OBJECTIF — Présenter les quatre critères du programme.

DIRE — Parcourez les cartes.
• Fréquence : « Une fois par an, même automatisée, ne rapporte presque rien. »
• Volume : « Dix cas d'un coup valent mieux qu'un. »
• Règles claires : « Si deux personnes font la tâche de la même façon, la règle s'écrit. »
• Outils : « Applications en ligne avec connecteurs : facile. Vieux logiciel sans connecteur : plus difficile. »

INSISTER — Les deux encadrés : règles floues → IA ; pas de connecteur → RPA. « Une note basse oriente vers une technique, elle n'élimine pas forcément la tâche. »

TRANSITION — « Essayons avec un outil de notation. »`,
  `⏱ 5 min · OUTIL INTERACTIF

OBJECTIF — S'entraîner à noter et lire le verdict.

ANIMATION — Cliquez les exemples un à un et commentez :
• Saisie des factures (17) : excellent candidat, workflow sans code.
• Rapport hebdomadaire (14) : bon candidat ; volume faible mais règles claires.
• Tri des plaintes (15) : bon candidat, mais règles floues → étape IA.
• Copie vers un vieux logiciel (13) : outils à 1 → robot RPA.
• Plan stratégique (6) : on laisse de côté.

INTERACTION — Demandez à un volontaire sa tâche la plus chronophage (exercice 1) et notez-la ensemble avec les curseurs, à voix haute.

TRANSITION — « Et en heures, ça représente combien ? »`,
  `⏱ 4 min · CALCULATEUR

OBJECTIF — Chiffrer le gain, et introduire la notion de rentabilité.

DIRE — « Exemple : 10 minutes, 15 fois par semaine, 80 % automatisés : 2 heures par semaine, environ 92 heures par an. Avec 6 heures de mise en place, c'est rentabilisé en trois semaines. »

ANIMATION — Bougez les curseurs : « Que se passe-t-il pour une tâche de 3 minutes, une fois par semaine ? » Quelques heures par an : la rentabilité dépasse l'année.

INSISTER — « Gardez ce chiffre dans votre carnet : au module 10, vous le comparerez au gain réel. Et on ajoutera la maintenance. »

TRANSITION — « À vous : choisir votre tâche et la décrire. »`,
  `⏱ 25 min · EXERCICE 2 INDIVIDUEL

OBJECTIF — Chacun choisit sa tâche réelle et la décrit en SIPOC, avec un gain estimé.

ANIMATION — Lancez le minuteur. Collez dans le Chat le gabarit SIPOC (5 colonnes). Rappelez l'ordre P, O, C, I, S.

POINTS D'ÉTAPE —
• à 8 min : « Votre tâche est-elle choisie ? Score ? » Un chiffre au micro.
• à 18 min : « Où en êtes-vous : P, O-C, ou I-S ? » Quelqu'un est bloqué → partage d'écran 2 minutes.

RESTITUTION (5 min, incluse) — Deux ou trois volontaires partagent leur SIPOC en 1 minute chacun. Questions à poser : « Combien d'étapes ? » « Quel client oublié ? » « Où serait l'étape IA ? »

ATTENTION — Tâche avec données sensibles : on la garde, mais on construira plus tard avec des données fictives.

TRANSITION — « Un dernier QCM avant le dîner. »`,
  `⏱ 2 min · QCM 2

RÉPONSE — D. Le rapprochement quotidien coche les quatre critères.
• A ✗ — Annuel : trop rare.
• B ✗ — Relationnel et sensible.
• C ✗ — Rare et toujours différent.

TRANSITION — « Synthèse. »`,
  `⏱ 2 min · SYNTHÈSE

DIRE — Relisez les quatre points. « Votre carnet contient maintenant votre tâche, son score, son SIPOC et son gain estimé. C'est la base de tout le jour 2. »

LOGISTIQUE — Dîner 12 h – 13 h. « En revenant, on découvre les outils et on crée les comptes : ayez votre compte Google sous la main. »

TRANSITION — « Après le dîner : les outils d'automatisation. »`,
  `⏱ 1 min · MODULE 3 (50 min)

DIRE — « Bon retour ! Cet après-midi, on découvre les outils. On fait le tour du marché, on apprend le vocabulaire commun, et surtout : on prépare vos comptes pour que demain matin, on construise directement. »

TRANSITION — « Quatre grandes familles d'outils. »`,
  `⏱ 4 min

OBJECTIF — Situer chaque outil dans une famille.

DIRE — Parcourez les quatre cartes.
• Sans code : « Make, Zapier, n8n relient des applications en ligne. C'est l'outil des deux jours. »
• Suites : « Power Automate chez Microsoft, les automatisations de Google Workspace : intégrés, si vous y vivez déjà. »
• RPA : « Le robot qui clique à votre place, quand il n'y a pas de connecteur. Module 4. »
• IA : « Les assistants comprennent et rédigent. Ils deviennent une étape du workflow. Module 5. »

INSISTER — « Dans la vraie vie, on combine : Make déclenche, une IA classe, un robot saisit dans un vieux logiciel. »

TRANSITION — « Comment une plateforme parle-t-elle à Gmail ou à Sheets ? »`,
  `⏱ 4 min

OBJECTIF — Démystifier la connexion entre applications.

DIRE — « Chaque application en ligne ouvre une porte, l'API : une interface prévue pour les programmes, pas pour les humains. La plateforme passe par cette porte. »
→ beat 1 Connexion — « Vous l'autorisez une fois, avec votre compte ou une clé. C'est aussi un enjeu de sécurité : elle agit en votre nom. »
→ beat 2 Vérification ou signal — « Soit la plateforme regarde toutes les 15 minutes s'il y a du nouveau ; soit l'application la prévient immédiatement, c'est un webhook. »
→ beat 3 Action — « Elle lit ou écrit, puis passe à la suite. »

TRANSITION — « Faisons le tour des outils. »`,
  `⏱ 7 min · PAGE PÉRISSABLE

OBJECTIF — Présenter cinq outils, leurs offres gratuites et leurs limites.

AVANT CHAQUE SESSION — Revérifiez les offres gratuites (make.com/pricing, zapier.com/pricing, n8n.io/pricing) : elles changent souvent. Vérifié en novembre 2026 : Make 1 000 crédits par mois et 2 scénarios actifs ; Zapier 100 tâches et Zaps à 2 étapes ; n8n gratuit en auto-hébergement seulement ; Power Automate Desktop gratuit sous Windows en mode assisté.

ANIMATION — Cliquez les onglets un à un. Pour chacun : pour qui, points forts, offre gratuite, limite.

MESSAGE — « Make est notre choix pour les ateliers : visuel, multi-étapes, avec des modules IA, et gratuit pour apprendre. Ce que vous apprenez se transpose aux autres. »

TRANSITION — « Justement : le vocabulaire change, pas les idées. »`,
  `⏱ 3 min

OBJECTIF — Donner une table de correspondance réutilisable.

DIRE — « Make parle de scénario et de modules, Zapier de Zaps et d'étapes, n8n de nœuds, Power Automate de flux. Ce sont les mêmes concepts. »

INSISTER — La ligne « Ce qu'on paie » : « Chez Make, chaque module exécuté consomme un crédit. Un scénario de 5 modules qui tourne 200 fois : 1 000 crédits, toute l'offre gratuite du mois. D'où l'importance des filtres en tête de scénario. »

TRANSITION — « Et pour votre tâche, quel outil ? »`,
  `⏱ 5 min · EXERCICE ORAL

OBJECTIF — Appliquer une logique de choix à la tâche du carnet.

ANIMATION — Demandez à un volontaire de présenter sa tâche en une phrase. Posez les quatre questions à voix haute ; il répond, vous basculez les interrupteurs. Lisez la recommandation.

Recommencez avec un deuxième volontaire dont la tâche est différente (idéalement un vieux logiciel, pour voir apparaître Power Automate Desktop).

NUANCE — « C'est une piste, pas une vérité : la politique de votre organisation passe avant. »

TRANSITION — « Visite guidée de Make. »`,
  `⏱ 5 min · DÉMO

OBJECTIF — Familiariser avec l'interface de Make avant de l'utiliser.

ANIMATION — Cliquez les pastilles dans l'ordre. Idéalement, montrez ensuite l'interface réelle en partage d'écran (make.com, après connexion).
1. Le module déclencheur, toujours à gauche.
2. Le lien : un clic pour ajouter un filtre.
3. Run once : le bouton de test.
4. La planification : on l'active quand tout fonctionne.
5. L'historique : votre outil de diagnostic.

À SOULIGNER — L'interface de Make est en anglais. Les noms de modules affichés ici (Watch New Rows, Generate a response, Send an email) peuvent varier légèrement d'une version à l'autre.

TRANSITION — « Préparons vos postes. »`,
  `⏱ 15 min · PRÉPARATION INDIVIDUELLE

OBJECTIF — Tous les comptes prêts avant le jour 2.

ANIMATION — Lancez le minuteur. Collez dans le Chat : le lien make.com, le lien aistudio.google.com et la liste des en-têtes du classeur (Date · Nom · Courriel · Message · Catégorie · Priorité · Résumé).

POINT D'ÉTAPE à 7 min — « Qui a son compte Make ? Son classeur ? Sa clé ? » Réponses au micro.

DIFFICULTÉS FRÉQUENTES —
• Compte Google professionnel bloqué pour AI Studio : utiliser un compte Google personnel, avec des données fictives seulement.
• Make demande une région : choisir celle proposée par défaut.
• SÉCURITÉ : la clé d'API donne accès à votre compte Gemini. On ne la colle jamais dans le Chat, un courriel ou une capture partagée.

DONNÉES — Rappel : l'offre gratuite de Gemini peut utiliser vos requêtes pour améliorer les produits de Google. Données inventées uniquement.

BONUS — Power Automate Desktop pour les participants sous Windows.

TRANSITION — « Un QCM pour fixer les choix d'outils. »`,
  `⏱ 2 min · QCM 3

RÉPONSE — A. Make, offre gratuite.
• B ✗ — Zapier gratuit : deux étapes.
• C ✗ — n8n infonuagique : payant après l'essai.
• D ✗ — Un robot d'écran n'est pas fait pour relier des applications en ligne.

TRANSITION — « Synthèse. »`,
  `⏱ 2 min · SYNTHÈSE

DIRE — Relisez les quatre points.

À VOTRE POSTE — « Une question à poser chez vous : quels outils sont autorisés, et pour quelles données ? C'est souvent ce qui décide, avant la technique. »

TRANSITION — « Et quand il n'y a pas de connecteur ? On fait appel à un robot. Module 4 : le RPA. »`,
  `⏱ 1 min · MODULE 4 (50 min)

DIRE — « Le RPA, Robotic Process Automation : l'automatisation par des robots logiciels. Pas de robot physique : un programme qui utilise votre ordinateur comme vous. »

TRANSITION — « Regardez-le travailler. »`,
  `⏱ 4 min · ANIMATION

OBJECTIF — Faire comprendre le principe : le robot repère des éléments et agit dessus.

DIRE — « Un vieux logiciel de dossiers clients, sans aucun connecteur. Le robot clique sur Nouveau, remplit le nom, le courriel, le montant, et enregistre. En boucle. »

Commentez les trois verbes à gauche :
• Repérer : « Il ne voit pas l'écran comme vous : il connaît l'adresse technique de chaque champ, son sélecteur. »
• Agir : « Cliquer, taper, copier, ouvrir. »
• Enchaîner : « Répéter pour chaque ligne, décider, noter ce qu'il a fait. »

QUESTION — « Que se passe-t-il si l'éditeur déplace le bouton Enregistrer ? » Le robot se perd : on y revient dans les limites.

TRANSITION — « Écran ou API : quelle différence ? »`,
  `⏱ 4 min

OBJECTIF — Positionner le RPA par rapport aux connecteurs.

DIRE — « Deux façons d'entrer dans une application : par la porte d'entrée, l'écran, comme un humain ; ou par la porte de service, l'API. » Lisez les deux cartes.
→ beat 1 — La règle : connecteur d'abord, RPA en plan B.

EXEMPLES — « Gmail, Sheets, un CRM en ligne : connecteur. Un logiciel comptable des années 2000 installé sur un poste : RPA. »

TRANSITION — « Deux modes de robots. »`,
  `⏱ 3 min

OBJECTIF — Distinguer robot assisté et non assisté, et ce qui est gratuit.

DIRE — Lisez le tableau ligne par ligne. « Le robot assisté, c'est votre assistant personnel : vous le lancez. Le robot non assisté travaille seul, la nuit, sur un serveur. »

INSISTER — « Power Automate Desktop est gratuit sous Windows 10 et 11 en mode assisté. Pour le mode non assisté, il faut une licence. » Revérifiez avant la session.

TRANSITION — « De quoi est fait un robot ? »`,
  `⏱ 4 min

OBJECTIF — Donner les six briques, réutilisées dans les workflows.

DIRE — Parcourez les cartes. « Ces six mots, vous les retrouverez demain dans Make : variables, boucles (on dit itérateur), conditions (filtres, routeurs), et gestion des erreurs. »

INSISTER — Le journal : « Un robot sans journal, c'est un collègue qui ne dit jamais ce qu'il a fait. »

TRANSITION — « Les trois cas d'usage du programme. »`,
  `⏱ 6 min · CAS

OBJECTIF — Illustrer les trois usages du programme : courriels, fichiers, rapports.

ANIMATION — Cliquez les trois onglets. Pour chacun, lisez le cas (secteur différent à chaque fois), le circuit, et ce que ça change.

À SOULIGNER —
• Courriels : un formulaire toujours identique → règles ; un texte libre → IA.
• Fichiers : la discipline de nommage, c'est déjà la moitié du gain.
• Rapports : l'exemple le plus parlant pour les gestionnaires.

INTERACTION — « Lequel de ces trois ressemble à votre tâche ? » Deux réponses.

TRANSITION — « Démonstration. »`,
  `⏱ 10 min · DÉMO EN PARTAGE D'ÉCRAN

OBJECTIF — Montrer un vrai robot, construit en quelques minutes.

PRÉPARATION — Avant la session : un dossier « À traiter » avec une dizaine de PDF fictifs, un dossier « Archives » vide, un journal.xlsx avec les en-têtes Nom · Date · Emplacement. Power Automate Desktop installé.

DÉROULÉ — Révélez les actions (→ beats 1 à 7) à mesure que vous les construisez réellement dans Power Automate Desktop. Montrez : le volet des variables qui se remplit, l'exécution pas à pas, le message final, le journal Excel.

PLAN B — Si la démo échoue, déroulez la page : chaque clic révèle une action et vous la commentez.

SANS WINDOWS — Les participants sous Mac suivent : la même logique sera reconstruite dans Make au jour 2.

TRANSITION — « Ce robot est utile… mais fragile. »`,
  `⏱ 5 min

OBJECTIF — Connaître les causes de panne et les parades.

DIRE — Révélez chaque parade (→ beats 1 à 5).
1. Mise à jour du logiciel : « Testez le robot après chaque mise à jour. »
2. Fenêtre inattendue : « Le robot doit savoir quoi faire, sinon il s'arrête au milieu. »
3. Lenteur : « Attendre un élément, pas trois secondes. »
4. Donnée imprévue : « On ne saisit pas un dossier douteux : on le met de côté pour un humain. »
5. Journal et responsable : « Quand le robot tombe en panne un vendredi soir, qui le sait ? »

TRANSITION — « À vous de construire mentalement un robot. »`,
  `⏱ 6 min · EXERCICE ORAL

OBJECTIF — Exercer la logique séquentielle d'un robot.

ANIMATION — Appelez des participants par leur prénom : « Quelle est l'étape 1 ? » Déplacez l'étiquette dans la case. Laissez débattre au micro quand il y a désaccord.

CORRIGÉ —
1. Ouvrir le dossier « Commandes » dans Outlook
2. Pour chaque courriel non lu…
3. Lire le numéro de client et les quantités
4. Si un champ manque : mettre le courriel de côté
5. Ouvrir le logiciel de commandes et cliquer « Nouvelle »
6. Saisir les champs et cliquer « Enregistrer »
7. Marquer le courriel comme traité et écrire au journal

À SOULIGNER — L'étape 4 avant la saisie : on vérifie avant d'écrire. Les étapes 3 à 7 sont à l'intérieur de la boucle.

TRANSITION — « QCM. »`,
  `⏱ 2 min · QCM 4

RÉPONSE — C. Le logiciel de paie n'a pas d'API : il faut un robot à l'écran.
• A ✗ — Pas d'API, pas de connecteur.
• B ✗ — L'IA ne saisit pas dans le logiciel.
• D ✗ — Quotidien, volumineux, réglé : très bon candidat.

TRANSITION — « Synthèse. »`,
  `⏱ 2 min · SYNTHÈSE

DIRE — Relisez les quatre points.

LOGISTIQUE — Pause de 15 minutes. « Au retour : ce que l'IA ajoute à tout ça. Gardez votre assistant IA ouvert. »

TRANSITION — « Après la pause : automatiser avec l'IA. »`,
  `⏱ 1 min · MODULE 5 (55 min)

DIRE — « Dernier module du jour : l'IA dans l'automatisation. Pas l'IA qui discute avec vous : l'IA comme une étape du circuit, qui lit, classe, extrait ou rédige. »

TRANSITION — « Ce qu'elle ajoute, en une image. »`,
  `⏱ 4 min

OBJECTIF — Montrer la transformation centrale : texte libre → données structurées.

DIRE — Lisez le courriel de Louis : « Une règle ne peut rien en faire : pas de champ, pas de mot-clé fiable. »
→ beat 1 — L'étape IA.
→ beat 2 — La sortie : catégorie, commande, produit, demande, priorité, ton, confiance. « Ce format s'appelle JSON : des paires nom-valeur que la plateforme lit sans effort. »

MESSAGE — « L'IA fabrique les champs, les règles font le routage. C'est la combinaison gagnante. »

TRANSITION — « Six opérations possibles. »`,
  `⏱ 3 min

OBJECTIF — Inventorier ce qu'une étape IA sait faire.

DIRE — Parcourez les cartes. « Une étape IA ne fait qu'une chose à la fois : plus la tâche est précise, plus le résultat est fiable. Si vous voulez classer ET résumer, faites deux étapes. »

INTERACTION — « Laquelle de ces six opérations servirait votre tâche ? » Deux ou trois réponses.

TRANSITION — « Et quand l'entrée est un document papier ? »`,
  `⏱ 5 min

OBJECTIF — Expliquer la chaîne OCR + IA (programme : analyse de documents, OCR).

DIRE — « Un reçu de quincaillerie, photographié. »
→ beat 1 — L'OCR : « La machine reconnaît les caractères. On obtient du texte brut, dans le désordre. »
→ beat 2 — L'IA : « Elle comprend que 304,81 est le total, que 7734 est le numéro de facture. »

INSISTER — L'échéance : « Elle n'est pas écrite, l'IA l'a calculée (30 jours). Tout ce qui est déduit doit être vérifié. Et une photo floue donne un OCR faux. »

OUTILS — Les assistants gratuits (Copilot, Gemini, ChatGPT) lisent une photo directement. Dans Make, les modules IA acceptent souvent une image ou un PDF.

TRANSITION — « La classification, en démonstration. »`,
  `⏱ 6 min · DÉMO INTERACTIVE

OBJECTIF — Montrer une classification avec seuil de confiance.

ANIMATION — Cliquez les messages un à un.
• Mme Gauthier : livraison, haute, irritée, 0,94.
• M. Nguyen : question produit, normale.
• Mme Roy : produit endommagé, haute.
• Atelier Lumen : « autre », 0,58 → sous le seuil, file « à vérifier ».

MESSAGE — « Le seuil de 0,75 est un choix métier. Trop haut : un humain revoit tout. Trop bas : des erreurs passent. On l'ajuste avec les tests du module 10. »

NUANCE — La « confiance » donnée par un modèle de langage est une auto-évaluation, pas une probabilité rigoureuse. Elle reste utile comme signal d'alerte.

TRANSITION — « L'extraction, maintenant. »`,
  `⏱ 4 min

OBJECTIF — Montrer une extraction structurée et ses pièges.

DIRE — Lisez la demande : les passages surlignés sont ce que l'IA doit trouver.
→ beat 1 — La réponse JSON.
→ beat 2 — Deux remarques : l'année est déduite ; la liste « manquant » permet de redemander automatiquement le courriel.
→ beat 3 — « Chaque champ devient une variable du workflow : on l'écrit dans Sheets, on s'en sert dans un courriel. »

TRANSITION — « L'IA peut aussi répondre. Jusqu'où ? »`,
  `⏱ 4 min

OBJECTIF — Graduer l'automatisation des réponses (programme : réponses automatiques par IA).

DIRE — Révélez les niveaux (→ beats 1 à 3).
1. Accusé de réception : « Aucun risque, et déjà très apprécié. »
2. Brouillon relu : « Notre recommandation : l'IA fait 80 % du travail, l'humain garde la responsabilité. »
3. Envoi automatique : « Pour les questions simples et fréquentes, sur une base de réponses validées, avec un seuil et un suivi. »
→ beat 4 — Ce qui ne part jamais seul.

EXEMPLE — Le cas Air Canada (2024) : un agent conversationnel a promis un remboursement qui n'existait pas ; l'entreprise a été tenue responsable. « L'IA parle en votre nom. »

TRANSITION — « Et les agents IA, dont on parle tant ? »`,
  `⏱ 5 min · PAGE PÉRISSABLE

OBJECTIF — Situer les agents IA (programme : agents IA, ex. Copilot).

DIRE — Révélez les colonnes (→ beats 1 à 3). La question clé : « Qui décide des étapes ? »
• Assistant : vous. Copilot Chat, Gemini, ChatGPT.
• Workflow avec IA : vous, à l'avance. « C'est ce qu'on construit demain. »
• Agent : l'IA elle-même. « Vous lui donnez un objectif et des outils (lire les courriels, consulter le CRM, écrire un brouillon) ; elle enchaîne. Microsoft propose des agents dans Copilot, Google des Gems, OpenAI des agents dans ChatGPT, Make ses propres agents. »

MESSAGE — « Plus d'autonomie, moins de prévisibilité. Pour un processus métier répétitif, le workflow avec IA reste le plus sûr aujourd'hui. »

AVANT CHAQUE SESSION — Revérifiez les noms et la disponibilité des offres d'agents.

TRANSITION — « Comment écrire l'instruction de l'étape IA ? »`,
  `⏱ 5 min

OBJECTIF — Donner l'anatomie d'un prompt de workflow.

DIRE — « Un prompt de conversation, vous le corrigez en direct. Un prompt de workflow tourne mille fois sans vous. » Révélez (→ beats 1 à 6) : rôle, tâche unique, choix fermés, format JSON, cas de doute, variable.

INSISTER — Les choix fermés : « Sans liste, l'IA invente des catégories : “livraison tardive”, “retard de livraison”, “problème de livraison”… trois noms pour une même file. »

LOGISTIQUE — Collez ce prompt dans le Chat pour l'exercice suivant, avec les six messages fictifs :
1. « Bonjour, la facture 2231 compte deux fois les frais de livraison. »
2. « Mon canapé devait arriver hier entre 8 h et 12 h. Personne. Je suis en congé pour rien. »
3. « Le tissu du fauteuil Alba existe-t-il en vert ? »
4. « La porte de l'armoire est arrivée rayée, mais ce n'est pas grave, je la garde. »
5. « Super service, merci à l'équipe de livraison ! »
6. « Je veux annuler ma commande avant qu'elle parte et être remboursé. »

TRANSITION — « À vous de tester. »`,
  `⏱ 15 min · EXERCICE 3 INDIVIDUEL

OBJECTIF — Tester un prompt de workflow et voir ses limites.

ANIMATION — Lancez le minuteur. Chacun dans son assistant gratuit.

POINT D'ÉTAPE à 7 min — « Combien de messages traités ? Une hésitation ? »

CE QU'ON OBSERVE SOUVENT —
• Message 4 : produit endommagé… mais pas de demande : priorité ?
• Message 5 : un compliment, aucune catégorie : « autre » attendu.
• Message 6 : annulation : aucune catégorie ne convient → c'est le prompt qui est incomplet.
• D'une IA à l'autre, les résultats diffèrent : d'où les tests.

RESTITUTION (4 min, incluse) — Deux ou trois volontaires : « Quelle erreur ? Quelle correction du prompt ? »

TRANSITION — « QCM. »`,
  `⏱ 2 min · QCM 5

RÉPONSE — B. Seuil de confiance et file « à vérifier ».
• A ✗ — L'IA se trompe avec aplomb.
• C ✗ — On perd tout le gain.
• D ✗ — Redemander n'est pas vérifier.

TRANSITION — « Synthèse. »`,
  `⏱ 2 min · SYNTHÈSE

DIRE — Relisez les quatre points. « Demain, ce prompt entre dans Make. »

À VOTRE POSTE — Le prompt de votre tâche réelle, testé sur cinq exemples fictifs, dans le carnet.

TRANSITION — « Bilan de la journée. »`,
  `⏱ 6 min · BILAN DU JOUR 1

OBJECTIF — Consolider la journée et faire émerger les intentions pour demain.

DIRE — Parcourez les cinq lignes rapidement : « Voilà le chemin parcouru. »

TOUR ÉCLAIR — Lancez le minuteur. Appelez chacun par son prénom : un mot sur la journée, puis la tâche qu'il veut automatiser demain. Notez les tâches : elles orienteront vos exemples au module 7 et le choix des scénarios au module 9.

SIGNAUX À REPÉRER — « Perdu », « technique » : prévoyez plus de temps au module 6. Quelqu'un n'a pas encore de compte Make ou de clé : proposez 5 minutes avant le début demain (8 h 55).`,
  `⏱ 2 min · POUR DEMAIN

DIRE — « Quatre vérifications ce soir, deux minutes chacune. » Cliquez les cases à titre d'exemple ; chacun vérifie pour soi.

INSISTER — « Demain, on construit dès 9 h 15. Si un compte bloque, écrivez-moi ce soir ou arrivez cinq minutes plus tôt. »

CLÔTURE — Remerciez, rappelez l'heure de début (9 h) et le lien de la classe virtuelle.`,
  `⏱ 2 min · ACCUEIL DU JOUR 2

DIRE — « Bonjour ! Hier, on a repéré et compris. Aujourd'hui, on construit. »

LOGISTIQUE — Vérifiez le son et la caméra. Demandez : « Qui a eu un souci de compte Make ou de clé Gemini ? » Traitez-le pendant le quiz si besoin (un participant en partage d'écran 2 minutes, ou en aparté à la pause). Pauses : 10 h 15 et 14 h 45, dîner 12 h – 13 h.

TRANSITION — « Petit échauffement. »`,
  `⏱ 4 min · QCM À RÉPONSES MULTIPLES

ANIMATION — Les participants annoncent leurs lettres. Cochez la sélection majoritaire, « Valider ma sélection », puis cliquez chaque option. → révèle les bonnes réponses, puis l'essentiel.

RÉPONSES — A et D.
• A ✓ — P, O, C, I, S.
• B ✗ — Connecteur d'abord.
• C ✗ — Choix fermés.
• D ✓ — Seuil de confiance et file « à vérifier ».

TRANSITION — « Le programme du jour. »`,
  `⏱ 2 min

DIRE — Parcourez les cinq étapes. « Le matin, la méthode et la construction guidée. L'après-midi, votre scénario complet, puis les tests et le déploiement. »

INSISTER — « Chaque module ajoute une brique à votre workflow. Si vous prenez du retard, les corrigés et les pas à pas sont dans le Chat. »

TRANSITION — « On commence par voir un flux en entier. »`,
  `⏱ 1 min · MODULE 6 (1 h)

DIRE — « On passe à la pratique. D'abord je vous montre un flux simple dans Power Automate, l'outil de Microsoft. Puis vous construisez le même genre de flux dans Make. »

TRANSITION — « La démonstration. »`,
  `⏱ 10 min · DÉMO EN PARTAGE D'ÉCRAN

OBJECTIF — Montrer un flux Power Automate simple (programme : démonstration d'un flux Power Automate).

PRÉPARATION — Un compte Microsoft 365 avec Power Automate, un site SharePoint (ou OneDrive) avec un dossier « Plans reçus », un canal Teams de test. Envoyez-vous un courriel avec un PDF fictif juste avant.

DÉROULÉ — Sur make.powerautomate.com : Créer › Flux de cloud automatisé. Révélez les blocs (→ beats 1 et 2) au fil de la construction :
1. Déclencheur Outlook « Lors de l'arrivée d'un nouvel e-mail (V3) », avec pièces jointes.
2. « Créer un fichier » dans SharePoint : montrez le contenu dynamique (les pastilles) et la boucle « Appliquer à chacun » qui apparaît seule pour les pièces jointes.
3. « Publier un message » dans Teams.
Testez, puis ouvrez l'historique d'exécution.
→ beat 3 — La structure à retenir.

PLAN B — Sans licence Microsoft 365 : montrez le flux de bureau Power Automate Desktop du module 4, ou déroulez la page bloc par bloc.

TRANSITION — « Le même principe, dans Make. »`,
  `⏱ 4 min

OBJECTIF — Présenter le scénario de l'atelier et la notion de mapping.

DIRE — « Deux modules : Google Sheets surveille les nouvelles lignes, Gmail vous envoie un courriel. »
→ beat 1 — Le courriel reçu : les pastilles sont remplacées par les vraies valeurs.
→ beat 2 — « Le mapping : relier ce qui sort d'un module à ce qui entre dans le suivant. C'est 80 % du travail dans un workflow. »

TRANSITION — « Le pas à pas. »`,
  `⏱ 5 min · DÉMONSTRATION GUIDÉE

OBJECTIF — Montrer chaque clic avant que les participants se lancent.

DÉROULÉ — Faites les 8 étapes en direct, en partage d'écran, lentement. Collez ensuite le pas à pas dans le Chat.

POINTS D'ATTENTION —
• Étape 2 : la fenêtre de connexion Google peut s'ouvrir derrière le navigateur.
• Étape 4 : « From now on » explique le piège n° 1.
• Étape 6 : il faut cliquer dans le champ pour voir les pastilles du module 1.
• Plan B Gmail : expliquez-le dès maintenant pour éviter les blocages.

TRANSITION — « À vous. »`,
  `⏱ 25 min · ATELIER 1 INDIVIDUEL

OBJECTIF — Chacun a un scénario qui tourne.

ANIMATION — Lancez le minuteur.

POINTS D'ÉTAPE —
• à 8 min : « Où en êtes-vous : module 1, module 2, test ? » Réponses au micro, par prénom.
• à 18 min : « Qui a reçu son courriel ? » Quelqu'un bloque : il partage son écran 2 minutes ; les autres continuent.

CORRIGÉ — Le scénario de démonstration, exporté (menu … › Export Blueprint), peut être partagé par lien ; chacun peut l'importer (… › Import Blueprint) s'il est très en retard.

FIN — Deux volontaires montrent la bulle de données de leur module 2 (1 minute chacun). Pause de 15 minutes juste après.

TRANSITION — « Avant la pause : les pièges que vous avez peut-être rencontrés. »`,
  `⏱ 3 min

OBJECTIF — Capitaliser sur les erreurs de l'atelier.

DIRE — Parcourez le tableau. Pour chaque ligne : « Qui l'a rencontré ? » Une ou deux réponses au micro.

INSISTER — Le dernier piège : « L'offre gratuite donne 1 000 crédits par mois. Un scénario planifié toutes les 15 minutes vérifie le classeur près de 3 000 fois par mois : chaque vérification peut coûter un crédit, même sans nouvelle ligne. »

TRANSITION — « Synthèse. »`,
  `⏱ 2 min · SYNTHÈSE

DIRE — Relisez les quatre points.

LOGISTIQUE — Pause de 15 minutes (10 h 15). « Au retour : on arrête de cliquer et on conçoit, sur papier, le workflow de votre tâche. »`,
  `⏱ 1 min · MODULE 7 (40 min)

DIRE — « On lâche la souris. Avant de construire le workflow de votre tâche, on le conçoit. Quatre étapes du programme : le besoin, les étapes, le diagramme, les données. »

TRANSITION — « D'abord, le besoin. »`,
  `⏱ 4 min · CAS : RH

OBJECTIF — Apprendre à formuler un besoin métier clair.

DIRE — Lisez la version floue. « Que faut-il automatiser exactement ? Pour qui ? Comment saura-t-on que c'est réussi ? »
→ beat 1 — La version claire, morceau par morceau : pour qui, quand, je veux, afin de, sauf.
→ beat 2 — Le test du besoin clair.

INSISTER — « Afin de » doit être mesurable (3 jours → 4 heures) : c'est ce qu'on vérifiera au module 10. « Sauf » : les exceptions dites dès le départ.

TRANSITION — « Ensuite, les étapes. »`,
  `⏱ 4 min

OBJECTIF — Formaliser des étapes exploitables.

DIRE — « Sept étapes, et pour chacune quatre colonnes. » Parcourez 2 ou 3 lignes. « La colonne la plus importante, c'est la dernière : l'exception. Le processus heureux, tout le monde le connaît. Ce sont les exceptions qui font tomber les automatisations. »

QUESTION — « Quelle exception manque ? » Pistes : demande en double, employé qui demande pour un autre, attestation en anglais.

TRANSITION — « On le dessine. »`,
  `⏱ 4 min

OBJECTIF — Réaliser un diagramme simple avec le code couleur du deck.

DIRE — Présentez le code couleur (déclencheur bleu, données sarcelle, condition jaune, IA violet, action vert, validation corail, résultat gris). « Ce code, vous le retrouverez dans tous les schémas d'aujourd'hui. »
→ beat 1 — La branche « non » : la conseillère RH.
→ beat 2 — « Où mettre l'IA ? Nulle part ici. » Bon rappel : on ne met pas de l'IA par principe.

OUTILS — Papier, draw.io (gratuit), PowerPoint, ou une IA qui produit un diagramme à partir de la liste d'étapes.

TRANSITION — « Les données. »`,
  `⏱ 4 min

OBJECTIF — Déterminer les données d'entrée et de sortie (programme).

DIRE — Lisez le tableau. « Pour chaque donnée : d'où elle vient, son format, si elle est obligatoire, un exemple. »

INSISTER —
• Formats : la date est la source d'erreur n° 1 entre logiciels.
• Sensible : « Le salaire est un renseignement personnel au sens de la Loi 25. Il ne passe pas par une IA gratuite, et l'accès doit être limité. »

TRANSITION — « Tout ça tient dans une fiche. »`,
  `⏱ 2 min

OBJECTIF — Présenter le modèle de fiche de conception.

DIRE — Parcourez les huit rubriques. « Six viennent de ce qu'on a vu ; deux sont nouvelles : la validation humaine, et les indicateurs avec un responsable. »

LOGISTIQUE — Collez le modèle de fiche dans le Chat.

TRANSITION — « À vous, pour votre tâche. »`,
  `⏱ 20 min · EXERCICE 4 INDIVIDUEL

OBJECTIF — Chacun produit la fiche de conception de sa tâche réelle.

ANIMATION — Lancez le minuteur.

POINTS D'ÉTAPE —
• à 7 min : « Votre besoin passe-t-il le test ? » Un volontaire lit le sien ; le groupe vérifie les cinq morceaux.
• à 15 min : « Où est votre validation humaine ? » Deux réponses au micro.

SI UNE TÂCHE EST TROP GROSSE — Proposez d'en automatiser seulement une portion (les 3 premières étapes).

TRANSITION — « QCM. »`,
  `⏱ 2 min · QCM 6

RÉPONSE — C.
• A ✗ — Une solution, pas un besoin.
• B ✗ — Pas de déclencheur ni de critère.
• D ✗ — Ni mesurable, ni prudent.

TRANSITION — « Synthèse. »`,
  `⏱ 1 min · SYNTHÈSE

DIRE — Relisez les quatre points. « Votre fiche est votre plan de construction pour le module 8 et l'atelier du module 9. »

TRANSITION — « On construit : module 8. »`,
  `⏱ 1 min · MODULE 8 (50 min avant le dîner + 30 min d'atelier guidé après)

DIRE — « Le module central du jour 2 : on construit un vrai workflow avec une étape IA. Avant le dîner, les briques ; après le dîner, vous les assemblez. »

TRANSITION — « D'abord, les sources. »`,
  `⏱ 5 min

OBJECTIF — Connaître les sources du programme : SharePoint, Excel, courriels, CRM…

DIRE — Parcourez les six cartes : déclencheur typique, action typique, point d'attention.

INSISTER —
• Formulaires : « La meilleure source : les données arrivent déjà rangées. Souvent, la vraie amélioration, c'est de remplacer un courriel libre par un formulaire. »
• CRM et boîtes partagées : droits et renseignements personnels.
• Webhook et HTTP : « Pour un logiciel sans module tout prêt mais avec une API. À faire accompagner par l'informatique. »

TRANSITION — « Comment démarrer un workflow ? »`,
  `⏱ 5 min

OBJECTIF — Distinguer événements, horaires et conditions (programme).

ANIMATION — Cliquez les trois onglets.
• Événement : vérification périodique ou instantané (webhook).
• Horaire : rapports, relances.
• Condition : un filtre juste après le déclencheur.

INSISTER — « Filtrer tôt économise des crédits : ce qui est arrêté ne passe pas dans les modules suivants. »

INTERACTION — « Quel est le déclencheur de votre tâche ? » Deux réponses, par prénom, à partir de la fiche de conception.

TRANSITION — « Et une fois démarré, que fait-il ? »`,
  `⏱ 3 min

OBJECTIF — Classer les actions (programme : création, mise à jour, extraction, décision).

DIRE — Parcourez les quatre familles. « Regardez votre fiche : chaque étape entre dans une de ces familles. Si ce n'est pas le cas, elle est sans doute trop vague. »

TRANSITION — « Le geste qu'on fait le plus : le mapping. »`,
  `⏱ 5 min

OBJECTIF — Comprendre le mapping entre modules.

DIRE — « À gauche, ce qui sort des modules précédents. À droite, le module qui met à jour la ligne. »
→ beat 1 — Row number vient du module 1 : « C'est ce qui permet d'écrire sur la bonne ligne. »
→ beat 2 — Catégorie et priorité viennent du module 3, l'IA découpée.
→ beat 3 — On peut combiner plusieurs pastilles et du texte.
→ beat 4 — Les fonctions : formatDate, upper, ifempty.

TRANSITION — « L'étape IA elle-même. »`,
  `⏱ 6 min · PAGE PÉRISSABLE

OBJECTIF — Montrer comment l'IA s'intègre (programme : résumé automatique, extraction d'informations, analyse de texte).

DIRE — Les trois usages à gauche. Puis la configuration du module (→ beats) :
→ beat 1 — La connexion avec votre clé AI Studio, et le modèle « Flash » proposé (rapide, inclus dans l'offre gratuite).
→ beat 2 — Le prompt, avec la pastille Message à la fin.
→ beat 3 — Parse JSON : « L'IA renvoie du texte ; Parse JSON le découpe en champs. »

AVANT CHAQUE SESSION — Vérifiez dans Make le nom exact du module Gemini et des champs (l'interface évolue).

DONNÉES — Offre gratuite de Gemini : les requêtes peuvent servir à améliorer les produits de Google. Données fictives uniquement.

TRANSITION — « Et pour décider où va chaque demande ? »`,
  `⏱ 5 min

OBJECTIF — Expliquer routeur et filtres (programme : décision).

DIRE — « Après la classification, un routeur ouvre trois chemins. » Révélez (→ beats 1 à 3) :
1. Urgent et sûr → alerte au responsable.
2. Sûr → registre mis à jour.
3. Pas sûr → file « à vérifier ».

INSISTER — « Les filtres doivent couvrir tous les cas. Sinon, une demande peut passer entre les mailles sans que personne ne le sache. Dans Make, on peut aussi marquer une route comme route par défaut (fallback). »

TRANSITION — « Avant le dîner, je vous montre ce qu'on va construire. »`,
  `⏱ 3 min

OBJECTIF — Présenter la cible de l'atelier guidé.

DIRE — « On repart du scénario de ce matin. Entre Sheets et Gmail, on insère trois modules : Gemini, Parse JSON, Update a Row. Et on met un filtre devant Gmail. »
→ beat 1 — Le résultat attendu.

LOGISTIQUE — Dîner 12 h – 13 h. Avant de partir, collez dans le Chat : le prompt de l'atelier, un exemple de JSON pour Parse JSON, et les 3 demandes de test.

PROMPT (à coller) —
Tu es l'assistant du service client. Analyse la demande ci-dessous. Réponds uniquement avec un objet JSON, sans balises de code ni texte autour : {"categorie": "livraison | produit endommagé | question produit | facturation | autre", "priorite": "haute | normale", "resume": "une phrase de 15 mots maximum", "confiance": nombre entre 0 et 1}. Si tu hésites, categorie = "autre" et confiance inférieure à 0.5. Demande : [pastille Message]

EXEMPLE JSON — {"categorie": "livraison", "priorite": "haute", "resume": "Colis non livré", "confiance": 0.9}

DEMANDES DE TEST — 1. « Mon colis devait arriver mardi, toujours rien, c'est urgent pour un anniversaire samedi. » 2. « Faites-vous la livraison à Rimouski ? » 3. « J'ai une idée pour améliorer votre site, on peut en parler ? »`,
  `⏱ 5 min · DÉMONSTRATION GUIDÉE (au retour du dîner, 13 h)

OBJECTIF — Montrer les 8 étapes avant l'atelier.

DÉROULÉ — En partage d'écran, faites les étapes 1 à 8 sur votre propre scénario, rapidement. Montrez la bulle de Gemini (le JSON en texte), puis celle de Parse JSON (les champs séparés).

PIÈGE FRÉQUENT — Les balises \`\`\`json autour de la réponse : montrez le symptôme (erreur de Parse JSON) et le remède.

TRANSITION — « À vous. »`,
  `⏱ 30 min · ATELIER 2 INDIVIDUEL

OBJECTIF — Chacun a un workflow avec une étape IA qui fonctionne.

ANIMATION — Lancez le minuteur.

POINTS D'ÉTAPE —
• à 10 min : « Votre module Gemini renvoie-t-il un JSON ? » Réponses au micro.
• à 20 min : « Les colonnes se remplissent ? » Quelqu'un bloque : partage d'écran 2 minutes.

CORRIGÉ — Le blueprint du scénario corrigé peut être partagé (… › Export Blueprint) pour ceux qui sont très en retard.

FIN — Deux volontaires montrent la demande ambiguë : quelle confiance l'IA a-t-elle donnée ? Comparez : les résultats diffèrent d'une exécution à l'autre, c'est normal, d'où les tests du module 10.

TRANSITION — « QCM. »`,
  `⏱ 2 min · QCM 7

RÉPONSE — A. Parse JSON.
• B ✗ — Le routeur choisit un chemin.
• C ✗ — Une seconde IA : coût et incertitude.
• D ✗ — Un filtre ne transforme rien.

TRANSITION — « Synthèse. »`,
  `⏱ 2 min · SYNTHÈSE

DIRE — Relisez les quatre points. « Vous avez construit le cœur d'un workflow avec IA. Le module 9 : un scénario complet, au choix. »

TRANSITION — « Module 9. »`,
  `⏱ 1 min · MODULE 9 (1 h 15)

DIRE — « L'atelier principal de la formation : un scénario complet, de bout en bout. Trois exemples proposés selon votre niveau, comme le prévoit le programme, ou votre propre tâche si votre fiche est prête. »

TRANSITION — « Les choix. »`,
  `⏱ 3 min

OBJECTIF — Aider chacun à choisir un scénario réaliste pour 50 minutes.

DIRE — Présentez les quatre cartes. Orientez :
• A : ceux dont l'atelier 2 fonctionne bien.
• B : ceux qui ont eu du mal ce matin : moins de modules, gain très visible.
• C : les plus à l'aise ; enjeu de validation humaine.
• D : seulement si la fiche de conception est claire et l'outil accessible avec des données fictives.

TRANSITION — « Les trois scénarios en détail. »`,
  `⏱ 3 min · SCÉNARIO A

DIRE — Révélez les étapes (→ beats 1 à 3) : extraction, classification IA, enregistrement, notification. « C'est exactement l'exemple du programme. » → beat 4 : modules Make et bonus.

POINT TECHNIQUE — Le numéro de dossier se construit avec formatDate et le numéro de ligne. Google Forms écrit dans un classeur : on peut surveiller le classeur ou le formulaire.

TRANSITION — « Scénario B. »`,
  `⏱ 2 min · SCÉNARIO B

DIRE — Révélez les étapes. « Un horaire au lieu d'un événement. Search Rows trouve les lignes de la semaine ; le Text aggregator les assemble en un seul texte ; Gemini rédige la synthèse. »

INSISTER — Le piège : les modèles de langage comptent mal. Le nombre de demandes se calcule dans Make (agrégateur numérique ou nombre de lignes renvoyées), puis on le donne à l'IA.

TRANSITION — « Scénario C. »`,
  `⏱ 2 min · SCÉNARIO C

DIRE — Révélez les étapes. « L'IA répond seulement à partir de votre FAQ, collée dans le prompt. Si la réponse n'y est pas : HORS_FAQ. Et rien ne part sans relecture : Gmail crée un brouillon. »

LOGISTIQUE — Collez dans le Chat une FAQ fictive de 8 questions (dates, prix, annulation, attestation, prérequis, accès à distance, matériel, contact) et 5 questions de test, dont 2 hors FAQ.

TRANSITION — « À vous. »`,
  `⏱ 50 min · ATELIER 3 INDIVIDUEL

OBJECTIF — Chacun a un scénario complet testé sur trois cas.

ANIMATION — Appelez chaque participant par son prénom : « A, B, C ou D ? » Notez les choix. Lancez le minuteur.

POINTS D'ÉTAPE — à 15, 30 et 45 minutes, passez à la page suivante (le sondage « Où en êtes-vous ? »), faites annoncer les numéros, puis revenez ici. Le minuteur continue de tourner.

AIDE — Quelqu'un est bloqué depuis 5 minutes : il partage son écran 2 minutes. Les erreurs les plus fréquentes : mapping vide, JSON entouré de balises, Row number oublié, filtre mal réglé.

DONNÉES — Collez dans le Chat les jeux de données fictifs des trois scénarios (une dizaine de lignes chacun).

TRANSITION — « Restitution. »`,
  `⏱ (pendant l'atelier) · POINT D'ÉTAPE

ANIMATION — Chacun annonce le numéro de la dernière étape franchie ; cliquez la ligne correspondante (« − » corrige). Ne réinitialisez pas entre deux points d'étape : cliquez seulement les changements, ou rechargez la page pour repartir de zéro.

LECTURE — Beaucoup bloqués à 2 : refaites une démonstration de 3 minutes de Parse JSON et des balises \`\`\`json. Beaucoup à 5 : avancez la restitution.`,
  `⏱ 10 min · RESTITUTION PAR VOLONTAIRES

ANIMATION — Demandez deux ou trois volontaires, idéalement des scénarios différents. Trois minutes chacun, en partage d'écran, minuteur. Cochez la grille à l'écran pendant qu'ils présentent (à titre indicatif, sans note).

RÉTROACTION — Après chaque présentation : un point fort et une piste, au micro, d'un ou deux participants. Synthétisez, puis « participant suivant ». Les autres peuvent déposer une capture dans le Chat.

TRANSITION — « Synthèse. »`,
  `⏱ 2 min · SYNTHÈSE

DIRE — Relisez les quatre points.

LOGISTIQUE — Pause de 15 minutes (14 h 45). « Au retour : comment s'assurer que ça marche aussi lundi, et mesurer le gain. »`,
  `⏱ 1 min · MODULE 10 (45 min)

DIRE — « Dernier module. Un workflow qui marche en formation, c'est bien. Un workflow sur lequel votre organisation peut compter lundi, c'est autre chose : tests, optimisation, mise en production et documentation. »

TRANSITION — « D'abord, les erreurs fréquentes. »`,
  `⏱ 5 min · CARTES À RETOURNER

OBJECTIF — Identifier les erreurs fréquentes (programme).

ANIMATION — Pour chaque carte, lisez le symptôme et demandez : « Cause probable ? » Écoutez une ou deux réponses au micro, puis cliquez pour retourner.

À SOULIGNER — « Vous en avez rencontré plusieurs aujourd'hui : c'est normal, c'est même le but. » L'erreur IA spécifique : balises \`\`\`json, catégories inventées, quota gratuit atteint (message d'erreur de limite de requêtes).

TRANSITION — « Comment les attraper avant vos utilisateurs ? »`,
  `⏱ 4 min

OBJECTIF — Distinguer test unitaire et test global (programme).

DIRE — « Le test unitaire, vous l'avez fait toute la journée : Run once, une donnée, on ouvre la bulle. Dans Make, “Run this module only” teste un module isolé. »
→ beat 1 — Le test global : tout le circuit, dans les vraies applications, avec les cas limites.
→ beat 2 — Pour l'IA : un taux de bonnes réponses sur un échantillon. « Sur 20 messages connus, combien sont bien classés ? 18 ? Alors 10 % iront à la vérification, ou on améliore le prompt. »

TRANSITION — « Quels cas tester ? »`,
  `⏱ 4 min

OBJECTIF — Construire un jeu de test.

DIRE — Révélez les lignes (→ beats 1 à 5) : normal, urgent, limite, invalide, ambigu. « Le ✗ sur l'invalide : un champ courriel vide a fait planter le module Gmail. On ajoute un filtre ou un gestionnaire d'erreur, puis on rejoue tout. »

TRANSITION — « Optimiser. »`,
  `⏱ 4 min

OBJECTIF — Optimiser : robustesse, coût, qualité.

DIRE — Parcourez les trois cartes.
• Erreurs : « Les gestionnaires d'erreur décident de ce qui se passe quand un module échoue, au lieu que tout s'arrête. »
• Crédits : « Toutes les 15 minutes, c'est souvent inutile : une fois par heure suffit pour la plupart des tâches de bureau. »
• Qualité : « L'IA s'améliore par le prompt : ajoutez les exemples qu'elle a mal classés. Et relisez un échantillon chaque semaine. »

TRANSITION — « Combien rapporte réellement le workflow ? »`,
  `⏱ 4 min · CALCULATEUR

OBJECTIF — Mesurer le temps gagné (programme), en net.

DIRE — « Au module 2, on a estimé un gain brut. En réalité, il reste du temps humain : vérifier les cas douteux, réparer, ajuster. » Exemple : 90 h brutes − 15 h de vérification − 12 h de maintenance = 63 h nettes, 70 % du brut.

INSISTER — Mesurez aussi le délai, le taux d'erreur, la satisfaction : « Parfois, le vrai gain n'est pas le temps, c'est le délai de réponse au client. »

TRANSITION — « Passer en production. »`,
  `⏱ 5 min

OBJECTIF — Mise en production (programme).

DIRE — Cliquez les cases au fil des explications.
• Compte approuvé : « Un workflow sur votre compte personnel s'arrête le jour où vous partez. »
• Données : « La Loi 25 encadre les renseignements personnels ; l'offre gratuite de Gemini peut réutiliser les données. En production, on passe par les outils et offres approuvés. »
• Responsable et suppléant, alertes, plan B, utilisateurs informés.

DÉMARRER PETIT — Deux semaines en parallèle du manuel, puis comparaison.

TRANSITION — « Et la documentation. »`,
  `⏱ 3 min

OBJECTIF — Documenter (programme : documentation).

DIRE — « Huit rubriques. Les cinq premières viennent de votre fiche de conception : la documentation est déjà à moitié écrite. » Insistez sur « En cas d'erreur » et « Historique » : ce sont les rubriques qu'on oublie et qui servent le plus.

TRANSITION — « À vous, pour votre workflow. »`,
  `⏱ 15 min · EXERCICE 5 INDIVIDUEL

OBJECTIF — Chacun prépare le passage en production de son workflow.

ANIMATION — Lancez le minuteur. Collez dans le Chat le modèle de fiche d'exploitation.

POINT D'ÉTAPE à 8 min — « Votre gain net ? » Deux ou trois chiffres au micro : comparez avec les estimations du module 2.

TRANSITION — « Dernier QCM. »`,
  `⏱ 2 min · QCM 8

RÉPONSE — D.
• A ✗ — Cinq cas heureux ne prouvent rien.
• B ✗ — Plus d'IA, plus d'incertitude.
• C ✗ — Pas de responsable ni d'alertes.

TRANSITION — « Synthèse. »`,
  `⏱ 2 min · SYNTHÈSE

DIRE — Relisez les quatre points.

À VOTRE POSTE — « Une date dans un mois pour mesurer le gain réel. Mettez-la à votre agenda maintenant, pendant qu'on y est. »

TRANSITION — « Bouclons ces deux jours. »`,
  `⏱ 3 min · CLÔTURE

OBJECTIF — Récapituler les deux jours en dix réflexes.

DIRE — Parcourez les tuiles, une phrase chacune. « Si vous ne gardez qu'une chose : on comprend et on simplifie avant d'automatiser, et l'IA travaille sous contrôle. »

TRANSITION — « Et maintenant, que ferez-vous lundi ? »`,
  `⏱ 8 min · PLAN D'ACTION

OBJECTIF — Engager chacun sur une action concrète.

ANIMATION — Laissez 3 minutes pour écrire dans le carnet. Puis lancez le minuteur : appelez chacun par son prénom, une phrase au micro : « Cette semaine, je… ».

ÉCOUTER — Les obstacles évoqués (outils non autorisés, données sensibles, temps) : répondez brièvement en renvoyant aux modules 3 et 10.`,
  `⏱ 2 min · RESSOURCES

DIRE — Parcourez les ressources. Collez la liste des liens dans le Chat.

PÉRISSABLE — Vérifiez les adresses avant la session.

TRANSITION — « Merci. »`,
  `⏱ 3 min · FIN

DIRE — « Merci pour votre énergie pendant ces deux jours. Vous repartez avec une tâche analysée, un workflow qui tourne, et la méthode pour en faire d'autres. »

LOGISTIQUE — Collez le lien de l'évaluation dans le Chat et laissez 3 minutes pour la remplir. Rappelez : supprimez votre clé d'API Gemini si vous ne l'utilisez plus (aistudio.google.com), et désactivez les scénarios Make de test.`,
];

// Version light (« Télécharger › Version light (PDF) ») — 0-based page indices, written by the build.
export const light: number[] = [0, 1, 3, 4, 6, 8, 9, 10, 11, 12, 13, 15, 17, 18, 19, 20, 21, 22, 23, 24, 26, 31, 32, 33, 34, 35, 36, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 64, 67, 69, 70, 71, 72, 75, 76, 77, 78, 79, 80, 81, 82, 85, 86, 87, 88, 89, 90, 91, 92, 97, 98, 106, 107, 108, 109, 110, 111, 113, 114, 117, 118, 120, 121];

// @@TIMERS-BEGIN
// Minuteurs de la deck — généré par scripts/timers-manifest.mjs (page = index 0-based).
export const timers = [
  { id: "op-tour", label: "Tour de table", page: 2, minutes: 8 },
  { id: "m2-journal", label: "Exercice 1", page: 25, minutes: 10 },
  { id: "m2-sipoc", label: "Exercice 2", page: 29, minutes: 25 },
  { id: "m3-setup", label: "Préparation", page: 39, minutes: 15 },
  { id: "m5-classif", label: "Exercice 3", page: 62, minutes: 15 },
  { id: "j1-tour", label: "Tour éclair", page: 65, minutes: 5 },
  { id: "m6-atelier", label: "Atelier 1", page: 74, minutes: 25 },
  { id: "m7-fiche", label: "Exercice 4", page: 83, minutes: 20 },
  { id: "m8-atelier", label: "Atelier 2", page: 95, minutes: 30 },
  { id: "m9-atelier", label: "Atelier 3", page: 103, minutes: 50 },
  { id: "m9-resto", label: "Présentation", page: 105, minutes: 3 },
  { id: "m10-plan", label: "Exercice 5", page: 115, minutes: 15 },
  { id: "cl-plan", label: "Plan d’action", page: 119, minutes: 8 },
];
// @@TIMERS-END
