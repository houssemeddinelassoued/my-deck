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
import formateur from '@assets/houssem-formateur.png';

export const design: DesignSystem = {
  palette: { bg: '#F6F8FC', text: '#101828', accent: '#0A62D0' },
  fonts: {
    display: '"Montserrat", "Segoe UI", system-ui, sans-serif',
    body: '"Open Sans", "Segoe UI", system-ui, -apple-system, sans-serif',
  },
  typeScale: { hero: 112, body: 28 },
  radius: 18,
};

// ─── Webfonts (module-level, slide-keyed) ───────────────────────────────────
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,500;0,600;0,700;0,800;1,700&family=Open+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap';
const FONT_LINK_ID = 'osd-webfont-ia-marketing-communication';
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
const SLIDE_ID = 'ia-marketing-communication';
const P = 'mkt'; // CSS class prefix, unique per deck
const COURSE = 'IA pour le marketing & la communication';
const AUTHOR = 'Houssem Eddine LASSOUED';

// Module numbers: 0 = ouverture, 1–3 = matin, 4–6 = après-midi, 7 = projet final & clôture.
const MOD_TITLES: Record<number, string> = {
  1: 'Comprendre l’IA dans le marketing',
  2: 'Stratégie & création d’idées',
  3: 'Création de contenus',
  4: 'Images & contenus visuels',
  5: 'Personnalisation & adaptation',
  6: 'Analyse marketing',
  7: 'Projet final & clôture',
};
const MORNING = [1, 2, 3];
const AFTERNOON = [4, 5, 6];

// ─── Palette (navy + electric blue, violet accent, light ground) ────────────
const C = {
  ink: '#101828',
  soft: '#3B4558',
  muted: '#6B7690',
  faint: '#A9B3C6',
  rule: '#DDE3EE',
  panel: '#EBEFF7',
  card: '#FFFFFF',
  navy: '#0B1F5C',
  electric: '#1E22E8',
  blue: '#0A62D0',
  teal: '#0E9AAE',
  green: '#0E9F6E',
  yellow: '#F2A20C',
  amber: '#D98A00',
  coral: '#E04848',
  violet: '#7442E0',
  plum: '#7A2FA6',
  pink: '#C2369E',
};

const T = {
  blue: { bg: '#E6F0FC', bd: '#97BFF0', fg: '#0A55B5' },
  navy: { bg: '#E7EBF5', bd: '#9EABCF', fg: '#0B1F5C' },
  teal: { bg: '#E1F5F7', bd: '#86D0DA', fg: '#0B7686' },
  green: { bg: '#E2F6EE', bd: '#8ED3B6', fg: '#0A7A55' },
  yellow: { bg: '#FEF3DC', bd: '#F3C566', fg: '#8A5A00' },
  coral: { bg: '#FDE8E8', bd: '#F0A3A3', fg: '#B42F2F' },
  violet: { bg: '#EFE9FC', bd: '#BFA8F2', fg: '#5A2FC2' },
  pink: { bg: '#FBE8F5', bd: '#E9A6D5', fg: '#9C2380' },
  grey: { bg: '#EEF1F6', bd: '#CDD4E0', fg: '#3B4558' },
};
type Tone = keyof typeof T;

// Saturated version of each tone (bars, markers, filled buttons).
const STRONG: Record<Tone, string> = {
  blue: C.blue,
  navy: C.navy,
  teal: C.teal,
  green: C.green,
  yellow: C.yellow,
  coral: C.coral,
  violet: C.violet,
  pink: C.pink,
  grey: C.faint,
};

const G = {
  blue: 'linear-gradient(120deg, #0A62D0 0%, #1E22E8 100%)',
  navy: 'linear-gradient(160deg, #0B1F5C 0%, #142C7A 100%)',
  violet: 'linear-gradient(120deg, #7442E0 0%, #C2369E 100%)',
  green: 'linear-gradient(120deg, #0E9F6E 0%, #0E9AAE 100%)',
  brand: 'linear-gradient(90deg, #0B1F5C 0%, #1E22E8 55%, #7442E0 100%)',
};

const display = 'var(--osd-font-display)';
const body = 'var(--osd-font-body)';
const mono = '"JetBrains Mono", ui-monospace, Consolas, monospace';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
const EASE_BACK = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

const SHADOW = '0 0 0 1px rgba(16, 24, 40, 0.06), 0 18px 40px -26px rgba(11, 31, 92, 0.40)';
const SHADOW_SM = '0 0 0 1px rgba(16, 24, 40, 0.07), 0 8px 20px -14px rgba(11, 31, 92, 0.45)';

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
@keyframes ${P}-glow{0%,100%{box-shadow:0 0 0 0 rgba(10,98,208,0)}50%{box-shadow:0 0 0 12px rgba(10,98,208,.16)}}
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
${has} .${P}-hi${n}{box-shadow:0 0 0 4px ${C.blue},0 22px 44px -22px rgba(10,98,208,.6) !important;transform:translateY(-4px)}
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
  checkCircle: (
    <>
      <circle cx={12} cy={12} r={9} />
      <path d="M8 12.5l2.8 2.8L16.5 9.5" />
    </>
  ),
  terminal: (
    <>
      <rect x={2.5} y={4} width={19} height={16} rx={2.5} />
      <path d="M6.5 9.5l3 2.5-3 2.5M12 15h5" />
    </>
  ),
  bug: (
    <>
      <rect x={7} y={8} width={10} height={12} rx={5} />
      <path d="M9 8a3 3 0 0 1 6 0M12 12v8M3 13h4M17 13h4M4 7.5l3.2 2M20 7.5l-3.2 2M4 19l3.2-2M20 19l-3.2-2" />
    </>
  ),
  flask: <path d="M9.5 3h5M10 3v6L4.8 18.2A1.9 1.9 0 0 0 6.5 21h11a1.9 1.9 0 0 0 1.7-2.8L14 9V3M7.5 15h9" />,
  palette: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-1.2-1-1.6-1-2.6 0-1 .8-1.7 1.8-1.7H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3z" />
      <circle cx={7.5} cy={11} r={1.2} {...dotFill} />
      <circle cx={10.5} cy={7} r={1.2} {...dotFill} />
      <circle cx={15} cy={7.5} r={1.2} {...dotFill} />
    </>
  ),
  phone: (
    <>
      <rect x={6.5} y={2.5} width={11} height={19} rx={2.5} />
      <path d="M10.5 18.5h3" />
    </>
  ),
  barcode: <path d="M4 5v14M7 5v14M10.5 5v14M13 5v14M16.5 5v14M20 5v14M2.5 3.5h3M18.5 3.5h3M2.5 20.5h3M18.5 20.5h3" />,
  leaf: (
    <>
      <path d="M5 19C5 10 10 5 20 4c0 10-5 15-13 15z" />
      <path d="M5 19l8-8" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.2A9.7 9.7 0 0 1 12 5c5.5 0 9 5.5 9.5 7a13 13 0 0 1-2.6 3.6M6.4 6.5C3.9 8.1 2.7 10.6 2.5 12c.5 1.5 4 7 9.5 7a9.4 9.4 0 0 0 4.3-1" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  git: (
    <>
      <circle cx={6} cy={5.5} r={2.2} />
      <circle cx={6} cy={18.5} r={2.2} />
      <circle cx={18} cy={9} r={2.2} />
      <path d="M6 7.7v8.6M18 11.2c0 3.5-5 3-10.2 5.8" />
    </>
  ),
  wand: (
    <>
      <path d="M4 20L15 9M13 7l4 4" />
      <path d="M18 2.5v3M16.5 4h3M20.5 8.5v2M19.5 9.5h2M9 3v2M8 4h2" />
    </>
  ),
  euro: <path d="M17.5 6.2A7 7 0 1 0 17.5 17.8M4 10.5h9M4 13.5h9" />,
  cart: (
    <>
      <path d="M2.5 3.5h3l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.4-1.1L21 7.5H6.4" />
      <circle cx={9.5} cy={20} r={1.4} />
      <circle cx={17.5} cy={20} r={1.4} />
    </>
  ),
  form: (
    <>
      <rect x={5} y={3.5} width={14} height={18} rx={2.5} />
      <path d="M9 3.5h6v3H9zM8.5 11h7M8.5 14.5h7M8.5 18h4" />
    </>
  ),
  table: (
    <>
      <rect x={3} y={4} width={18} height={16} rx={2.5} />
      <path d="M3 9.5h18M3 15h18M9.5 4v16" />
    </>
  ),
  folder: <path d="M3 7.5a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  bell: (
    <>
      <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z" />
      <path d="M10 21h4" />
    </>
  ),
  split: <path d="M3 12h6l6-6h5M9 12l6 6h5M17.5 3.5 20 6l-2.5 2.5M17.5 15.5 20 18l-2.5 2.5" />,
  pen: <path d="M4 20l1-4.5L16.5 4a2.1 2.1 0 0 1 3 3L8 18.5zM14 6.5l3 3" />,
  camera: (
    <>
      <rect x={3} y={6} width={18} height={14} rx={3} />
      <circle cx={12} cy={13} r={3.6} />
      <path d="M8.5 6l1.5-2.5h4L15.5 6" />
    </>
  ),
  insta: (
    <>
      <rect x={3.5} y={3.5} width={17} height={17} rx={5} />
      <circle cx={12} cy={12} r={4} />
      <circle cx={17} cy={7} r={1.1} {...dotFill} />
    </>
  ),
  linkedin: (
    <>
      <rect x={3} y={3} width={18} height={18} rx={3.5} />
      <path d="M7.5 10.5V17M11.5 17v-6.5M11.5 13.4c0-1.7 1.1-2.9 2.6-2.9s2.4 1.1 2.4 2.9V17" />
      <circle cx={7.5} cy={7.3} r={1.1} {...dotFill} />
    </>
  ),
  image: (
    <>
      <rect x={3} y={4} width={18} height={16} rx={2.5} />
      <circle cx={8.5} cy={9.5} r={1.8} />
      <path d="M3.5 18l5.5-5.5 4 4 3-3 4.5 4.5" />
    </>
  ),
  video: (
    <>
      <rect x={2.5} y={6} width={13.5} height={12} rx={2.5} />
      <path d="M16 10.5l5.5-3v9l-5.5-3z" />
    </>
  ),
  megaphone: (
    <>
      <path d="M3.5 10v4h3l9 5V5l-9 5z" />
      <path d="M6.5 14l1.5 6h3l-1-5" />
      <path d="M19 9.5a3.5 3.5 0 0 1 0 5" />
    </>
  ),
  heart: <path d="M12 20s-8-4.6-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.4 12 20 12 20z" />,
  slides: (
    <>
      <rect x={3} y={4} width={18} height={12} rx={1.5} />
      <path d="M12 16v4M8.5 21h7M7 12.5l3-3 2 2 4-4" />
    </>
  ),
  news: (
    <>
      <path d="M4 5h13v14H6a2 2 0 0 1-2-2z" />
      <path d="M17 9h3v8a2 2 0 0 1-2 2" />
      <path d="M7.5 9h6M7.5 12.5h6M7.5 16h4" />
    </>
  ),
  hash: <path d="M9.5 4L7.5 20M16.5 4l-2 16M4.5 9h16M3.5 15h16" />,
  coffee: (
    <>
      <path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" />
      <path d="M17 10.5h1.5a2.5 2.5 0 0 1 0 5H16.5" />
      <path d="M8.5 3.5c-.8 1 .8 2 0 3M12.5 3.5c-.8 1 .8 2 0 3" />
    </>
  ),
  web: (
    <>
      <rect x={3} y={4} width={18} height={16} rx={2.5} />
      <path d="M3 9h18" />
      <circle cx={6} cy={6.5} r={0.7} {...dotFill} />
      <circle cx={8.5} cy={6.5} r={0.7} {...dotFill} />
    </>
  ),
  type: <path d="M5 7V4.5h14V7M12 4.5v15M9 19.5h6" />,
  fridge: (
    <>
      <rect x={5} y={2.5} width={14} height={19} rx={2.5} />
      <path d="M5 10h14M8.5 5.5v2M8.5 13v3" />
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

// ─── Brand motif: the "signal" mark (an idea broadcasting to an audience) ───
// A neutral glyph: message square → two waves → audience dot. No organisation branding.
const FLOW_RATIO = 64 / 30;
const FlowMark = ({ h = 28, color = C.electric, accent = C.violet, cls, style }: { h?: number; color?: string; accent?: string; cls?: string; style?: CSSProperties }) => (
  <svg width={h * FLOW_RATIO} height={h} viewBox="0 0 64 30" className={cls} style={{ display: 'block', flex: 'none', ...style }} aria-hidden>
    <rect x={2} y={7} width={16} height={16} rx={5} fill={accent} />
    <path d="M26 7 Q 32 15 26 23" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />
    <path d="M35 2 Q 45 15 35 28" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />
    <circle cx={55} cy={15} r={6.5} fill={color} />
  </svg>
);

// Course lockup: the flow mark + short course name (no organisation branding).
const CourseLogo = ({ size = 26, color = C.navy, accent = C.violet }: { size?: number; color?: string; accent?: string }) => (
  <div role="img" aria-label={COURSE} style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.45, flex: 'none', fontFamily: display, lineHeight: 1 }}>
    <FlowMark h={size * 1.05} color={color === C.navy ? C.electric : color} accent={accent} />
    <span style={{ display: 'flex', flexDirection: 'column', gap: size * 0.12 }}>
      <span style={{ fontWeight: 800, fontSize: size, letterSpacing: '0.04em', color, whiteSpace: 'nowrap' }}>IA MARKETING</span>
      <span style={{ fontWeight: 600, fontSize: size * 0.62, letterSpacing: '0.22em', color: color === C.navy ? C.violet : color, whiteSpace: 'nowrap' }}>& COMMUNICATION</span>
    </span>
  </div>
);

// Navy rounded slab (cover / section pages).
const Slab = ({
  x,
  y,
  w,
  h,
  r = 44,
  cls,
  style,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
  cls?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) => (
  <div
    className={cls}
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: r,
      background: G.navy,
      boxShadow: '0 30px 60px -30px rgba(11,31,92,.55)',
      ...style,
    }}
  >
    {children}
  </div>
);

// Outlined rounded frame (decorative, peeks from the edges).
const Outline = ({
  x,
  y,
  w,
  h,
  r = 34,
  color = C.navy,
  cls,
  style,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
  color?: string;
  cls?: string;
  style?: CSSProperties;
}) => (
  <div
    className={cls}
    style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, boxShadow: `inset 0 0 0 2.5px ${color}`, ...style }}
  />
);

// Tiny mark used as a bullet / header ornament.
const MiniMark = ({ size = 22 }: { size?: number }) => <FlowMark h={Math.round(size * 0.62)} />;

const BrandStripe = () => (
  <>
    <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 7, background: G.brand }} />
    <div style={{ position: 'absolute', left: 0, top: 7, bottom: 0, width: 16, background: C.navy, borderRadius: '0 16px 16px 0' }} />
  </>
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
  quiz: { label: 'Quiz', tone: 'violet' as Tone, icon: 'star' as IconName },
  exercice: { label: 'Exercice', tone: 'green' as Tone, icon: 'pointer' as IconName },
  atelier: { label: 'Atelier', tone: 'yellow' as Tone, icon: 'users' as IconName },
  cas: { label: 'Étude de cas', tone: 'teal' as Tone, icon: 'book' as IconName },
  demo: { label: 'Démo', tone: 'blue' as Tone, icon: 'play' as IconName },
  lab: { label: 'Atelier pratique', tone: 'green' as Tone, icon: 'tool' as IconName },
  simu: { label: 'Simulateur', tone: 'teal' as Tone, icon: 'play' as IconName },
  bonus: { label: 'Lab bonus', tone: 'pink' as Tone, icon: 'sparkles' as IconName },
  actu: { label: 'Actualité', tone: 'coral' as Tone, icon: 'bolt' as IconName },
  synthese: { label: 'Synthèse', tone: 'navy' as Tone, icon: 'star' as IconName },
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
        color: '#fff',
        fontFamily: display,
        fontWeight: 700,
        fontSize: 17,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name={kd.icon} size={19} sw={2.5} />
      {kd.label}
    </span>
  );
};

const ORDER = [0, 1, 2, 3, 4, 5, 6, 7];
const ProgSq = ({ n, mod, text }: { n: number; mod: number; text?: string }) => {
  const now = n === mod;
  const past = mod !== 0 && ORDER.indexOf(mod) > ORDER.indexOf(n);
  return (
    <span
      style={{
        minWidth: 34,
        height: 30,
        padding: '0 6px',
        boxSizing: 'border-box',
        borderRadius: 8,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: display,
        fontWeight: 700,
        fontSize: 15,
        background: now ? C.electric : past ? '#DCE3FB' : 'transparent',
        color: now ? '#fff' : past ? C.electric : C.faint,
        boxShadow: now || past ? 'none' : `inset 0 0 0 2px ${C.rule}`,
      }}
    >
      {text ?? `M${n}`}
    </span>
  );
};

const ProgLabel = ({ children }: { children: ReactNode }) => (
  <span style={{ fontFamily: display, fontWeight: 700, fontSize: 15, letterSpacing: '0.12em', color: C.muted, margin: '0 6px 0 4px' }}>{children}</span>
);

// Matin : M1–M3 · Après-midi : M4–M6 · Projet final.
const Progress = ({ mod }: { mod: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
    <ProgLabel>MATIN</ProgLabel>
    <ProgSq n={1} mod={mod} />
    <ProgSq n={2} mod={mod} />
    <ProgSq n={3} mod={mod} />
    <ProgLabel>APRÈS-MIDI</ProgLabel>
    <ProgSq n={4} mod={mod} />
    <ProgSq n={5} mod={mod} />
    <ProgSq n={6} mod={mod} />
    <ProgSq n={7} mod={mod} text="Projet" />
  </div>
);

const Header = ({ mod, label, kind }: { mod: number; label?: string; kind?: Kind }) => (
  <div
    style={{
      position: 'absolute',
      left: 120,
      right: 120,
      top: 40,
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <MiniMark size={26} />
      <span
        style={{
          fontFamily: display,
          fontWeight: 700,
          fontSize: 19,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: C.navy,
        }}
      >
        {label ??
          (mod >= 1 && mod <= 6
            ? `Module ${mod} · ${MOD_TITLES[mod]}`
            : mod === 0
              ? 'Ouverture'
              : (MOD_TITLES[mod] ?? 'Clôture'))}
      </span>
      {kind ? <KindBadge kind={kind} /> : null}
    </div>
    <Progress mod={mod} />
  </div>
);

const Footer = ({ left = 120, short = false }: { left?: number; short?: boolean }) => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left,
        right: 120,
        bottom: 26,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <FlowMark h={22} />
        <span style={{ width: 1.5, height: 24, background: C.rule }} />
        <span style={{ fontSize: 19, fontWeight: 700, color: C.navy, whiteSpace: 'nowrap' }}>{AUTHOR}</span>
        {short ? null : <span style={{ width: 1.5, height: 24, background: C.rule }} />}
        {short ? null : <span style={{ fontSize: 19, color: C.muted, whiteSpace: 'nowrap' }}>{COURSE}</span>}
      </div>
      <span style={{ fontFamily: mono, fontSize: 19, color: C.muted, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
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
        overflow: 'hidden',
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
            'radial-gradient(ellipse 55% 50% at 10% 6%, rgba(255,255,255,0.95), rgba(255,255,255,0) 70%), radial-gradient(ellipse 45% 45% at 100% 100%, rgba(116,66,224,0.07), rgba(116,66,224,0) 70%), radial-gradient(ellipse 40% 40% at 100% 0%, rgba(30,34,232,0.05), rgba(30,34,232,0) 70%)',
        }}
      />
      {chrome ? <BrandStripe /> : null}
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
  top = 104,
  size = 54,
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
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1.12,
      letterSpacing: '-0.01em',
      color: C.navy,
    }}
  >
    {children}
  </h2>
);

const Lede = ({ children, top = 184, w = 1560, cls }: { children: ReactNode; top?: number; w?: number; cls?: string }) => (
  <p
    className={cls}
    style={{
      position: 'absolute',
      left: 120,
      top,
      margin: 0,
      maxWidth: w,
      fontSize: 28,
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

// Marker highlight (soft violet).
const Hl = ({ children, c = 'rgba(116, 66, 224, 0.20)' }: { children: ReactNode; c?: string }) => (
  <mark style={{ background: `linear-gradient(transparent 58%, ${c} 58%)`, color: 'inherit', padding: '0 3px' }}>
    {children}
  </mark>
);

const Strong = ({ children, c = C.blue }: { children: ReactNode; c?: string }) => (
  <strong style={{ fontWeight: 600, color: c }}>{children}</strong>
);

// Uppercase condensed label.
const Eyebrow = ({ children, c = C.electric, size = 22, cls, style }: { children: ReactNode; c?: string; size?: number; cls?: string; style?: CSSProperties }) => (
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
        borderRadius: Math.round(size * 0.12),
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
      borderRadius: Math.round(size * 0.24),
      background: STRONG[tone],
      color: '#fff',
      fontFamily: display,
      fontWeight: 800,
      fontSize: Math.round(size * 0.5),
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
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 28, lineHeight: 1.15, color: C.ink }}>{title}</div>
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
      style={{ position: 'absolute', left: 0, top: -18, fontFamily: display, fontWeight: 800, fontSize: 120, lineHeight: 1, color: C.violet }}
    >
      “
    </span>
    <div style={{ fontFamily: display, fontWeight: 700, fontSize: 40, lineHeight: 1.25, color: C.navy }}>{children}</div>
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
      boxShadow: ghost ? `inset 0 0 0 2px ${STRONG[tone]}` : '0 6px 16px -10px rgba(11,31,92,.6)',
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
  border:none;border-radius:16px;background:#fff;box-shadow:inset 0 0 0 2px ${C.rule},0 8px 20px -16px rgba(11,31,92,.5);
  font-family:${body};font-size:28px;line-height:1.3;color:${C.ink};text-align:left;cursor:pointer;
  transition:box-shadow 300ms ${EASE},background-color 300ms ${EASE},transform 200ms ${EASE}}
.${P}-q-opt:hover{box-shadow:inset 0 0 0 3px ${T.blue.bd},0 12px 24px -16px rgba(11,31,92,.55);transform:translateX(4px)}
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
                  <Num n={1} tone="violet" size={36} /> Votez à main levée (ou dans le chat).
                </div>
                <div style={{ display: 'flex', gap: 14 }}>
                  <Num n={2} tone="violet" size={36} /> {multi ? 'Cochez vos réponses, puis validez.' : 'Cliquez sur une réponse.'}
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
        boxShadow: drag ? `0 0 0 3px ${STRONG[tone]}, 0 24px 40px -18px rgba(11,31,92,.6)` : `inset 5px 0 0 ${STRONG[tone]}, ${SHADOW_SM}`,
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
type TimerRec = { total: number; left: number; t0: number | null };
const TIMERS = new Map<string, TimerRec>();
const timerLeft = (r: TimerRec) => (r.t0 === null ? r.left : Math.max(0, r.left - (Date.now() - r.t0) / 1000));

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
    rec = { total: minutes * 60, left: minutes * 60, t0: null };
    TIMERS.set(key, rec);
  }
  const r = rec;
  const [, tick] = useState(0);
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
    r.total = minutes * 60;
    r.left = minutes * 60;
    r.t0 = null;
    refresh();
  };
  const addMin = () => {
    r.left = timerLeft(r) + 60;
    if (r.t0 !== null) r.t0 = Date.now();
    r.total = Math.max(r.total, r.left);
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
  const buttons = compact ? (
    <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
      {running ? <Btn icon="pause" onClick={pause} size={21} /> : <Btn icon="play" onClick={start} size={21} disabled={secs === 0} />}
      <Btn icon="plus" ghost onClick={addMin} size={21} />
      <Btn icon="reset" ghost tone="grey" onClick={reset} size={21} />
    </div>
  ) : (
    <div style={{ display: 'flex', gap: 12 }}>
      {running ? (
        <Btn icon="pause" onClick={pause} size={22}>
          Pause
        </Btn>
      ) : (
        <Btn icon="play" onClick={start} size={22} disabled={secs === 0}>
          Démarrer
        </Btn>
      )}
      <Btn icon="plus" ghost onClick={addMin} size={22}>
        1 min
      </Btn>
      <Btn icon="reset" ghost tone="grey" onClick={reset} size={22} />
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
      <div className={cls} style={{ ...card, display: 'flex', alignItems: 'center', gap: 20, padding: '14px 22px', ...style }}>
        {clock(false)}
        <div style={{ minWidth: 150 }}>
          <Eyebrow c={secs === 0 ? C.coral : C.muted} size={18}>
            {secs === 0 ? 'Temps écoulé !' : label}
          </Eyebrow>
          {time(50)}
        </div>
        {buttons}
      </div>
    );
  }
  return (
    <div className={cls} style={{ ...card, width: 440, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18, ...style }}>
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

// ─── Formateur portrait (rounded photo + offset outline) ────────────────────
const Portrait = ({ w = 240, x, y, cls }: { w?: number; x: number; y: number; cls?: string }) => {
  const h = Math.round((w * 275) / 230);
  return (
    <div className={cls} style={{ position: 'absolute', left: x, top: y, width: w, height: h }}>
      <div
        style={{
          position: 'absolute',
          left: Math.round(w * 0.1),
          top: Math.round(w * 0.1),
          width: w,
          height: h,
          borderRadius: 26,
          boxShadow: `inset 0 0 0 3px ${C.violet}`,
        }}
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
          borderRadius: 22,
          border: `4px solid ${C.navy}`,
          boxSizing: 'border-box',
          boxShadow: '0 24px 50px -24px rgba(11,31,92,.6)',
        }}
      />
    </div>
  );
};

// ─── Section divider page ───────────────────────────────────────────────────
const SecItem = ({ n, children }: { n: number; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 18, ...dl(700 + n * 140) }}>
    <MiniMark size={26} />
    <span style={{ fontSize: 30, lineHeight: 1.3, color: C.ink }}>{children}</span>
  </div>
);

const Section = ({
  n,
  big,
  title,
  sub,
  dur,
  kind,
  labs,
  children,
}: {
  n: number;
  big?: string;
  title: ReactNode;
  sub: ReactNode;
  dur: string;
  kind?: Kind;
  labs?: ReactNode;
  children: ReactNode;
}) => (
  <Frame mod={n} chrome={false}>
    <Slab x={-60} y={-60} w={700} h={1200} r={56} cls={A.left}>
      <div style={{ position: 'absolute', left: 150, top: 240 }}>
        <div className={A.in} style={{ fontFamily: display, fontWeight: 700, fontSize: 26, letterSpacing: '0.24em', color: '#AEB9E6', ...dl(300) }}>
          {MORNING.includes(n) ? 'MATIN · MODULE' : AFTERNOON.includes(n) ? 'APRÈS-MIDI · MODULE' : 'POUR FINIR'}
        </div>
        <div
          className={A.pop}
          style={{
            marginTop: 6,
            fontFamily: display,
            fontWeight: 800,
            fontSize: 300,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            color: '#fff',
            ...dl(450),
          }}
        >
          {big ?? pad(n)}
        </div>
        <div className={A.grow} style={{ marginTop: 26, width: 150, height: 8, borderRadius: 4, background: G.violet, ...dl(650) }} />
      </div>
      <div style={{ position: 'absolute', left: 150, bottom: 150 }}>
        <CourseLogo size={24} color="#FFFFFF" accent={C.pink} />
      </div>
    </Slab>
    <Outline x={1480} y={-40} w={520} h={150} r={40} />
    <Outline x={1700} y={930} w={300} h={200} r={40} color={C.violet} />
    <div style={{ position: 'absolute', left: 760, top: 200, width: 1040 }}>
      <div className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Tag tone="grey" size={22}>
          <Icon name="clock" size={22} /> {dur}
        </Tag>
        {kind ? <KindBadge kind={kind} /> : null}
      </div>
      <h1
        className={A.in}
        style={{
          margin: '24px 0 0',
          fontFamily: display,
          fontWeight: 800,
          fontSize: 76,
          lineHeight: 1.06,
          letterSpacing: '-0.015em',
          color: C.navy,
          ...dl(120),
        }}
      >
        {title}
      </h1>
      <p className={A.in} style={{ margin: '22px 0 0', fontSize: 30, lineHeight: 1.4, color: C.soft, ...dl(240) }}>
        {sub}
      </p>
      <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
      {labs ? (
        <div className={A.in} style={{ marginTop: 34, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', ...dl(1300) }}>
          <Eyebrow c={C.green} size={20} style={{ marginRight: 6 }}>
            Ateliers
          </Eyebrow>
          {labs}
        </div>
      ) : null}
    </div>
    <Footer left={760} short />
  </Frame>
);

// ─── Dark code panel (VS Code-like) + token colours ─────────────────────────
const CodeDark = ({
  children,
  file,
  size = 22,
  wrap = false,
  cls,
  style,
}: {
  children: ReactNode;
  file?: string;
  size?: number;
  wrap?: boolean;
  cls?: string;
  style?: CSSProperties;
}) => (
  <div
    className={cls}
    style={{
      boxSizing: 'border-box',
      background: '#0F1530',
      borderRadius: 16,
      boxShadow: '0 22px 44px -26px rgba(11,31,92,.8)',
      overflow: 'hidden',
      ...style,
    }}
  >
    {file ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', background: '#18204A' }}>
        <span style={{ width: 12, height: 12, borderRadius: 99, background: '#FF5F57' }} />
        <span style={{ width: 12, height: 12, borderRadius: 99, background: '#FEBC2E' }} />
        <span style={{ width: 12, height: 12, borderRadius: 99, background: '#28C840' }} />
        <span style={{ marginLeft: 12, fontFamily: mono, fontSize: 18, color: '#AEB9E6' }}>{file}</span>
      </div>
    ) : null}
    <div style={{ padding: '18px 24px', fontFamily: mono, fontSize: size, lineHeight: 1.55, color: '#E6EAF6', whiteSpace: wrap ? 'pre-wrap' : 'pre' }}>{children}</div>
  </div>
);
const Ck = ({ children }: { children: ReactNode }) => <span style={{ color: '#C792EA' }}>{children}</span>;
const Cs = ({ children }: { children: ReactNode }) => <span style={{ color: '#9BE29B' }}>{children}</span>;
const Cc = ({ children }: { children: ReactNode }) => <span style={{ color: '#7C86A8', fontStyle: 'italic' }}>{children}</span>;
const Cf = ({ children }: { children: ReactNode }) => <span style={{ color: '#82AAFF' }}>{children}</span>;
const Cn = ({ children }: { children: ReactNode }) => <span style={{ color: '#F7B36B' }}>{children}</span>;
// Flaw marker inside a dark code panel (wavy red underline).
const Cx = ({ children }: { children: ReactNode }) => (
  <span style={{ textDecoration: 'underline wavy #FF6B6B', textUnderlineOffset: 6, textDecorationThickness: 2 }}>{children}</span>
);
// Fill-in hole for "squelette" / "prompt à trous" exercises.
const Hole = ({ children }: { children: ReactNode }) => (
  <span style={{ color: '#FFD27A', background: 'rgba(255,210,122,.12)', borderRadius: 6, boxShadow: 'inset 0 0 0 1.5px rgba(255,210,122,.55)', padding: '0 6px' }}>
    [___ {children} ___]
  </span>
);

// Mono path chip ("où créer le fichier ?").
const PathChip = ({ children, size = 22 }: { children: ReactNode; size?: number }) => (
  <span
    style={{
      display: 'inline-block',
      fontFamily: mono,
      fontSize: size,
      lineHeight: 1.35,
      color: T.navy.fg,
      background: T.navy.bg,
      borderRadius: 8,
      padding: '3px 10px',
      boxShadow: `inset 0 0 0 1.5px ${T.navy.bd}`,
    }}
  >
    {children}
  </span>
);

// Keyboard key.
const Kbd = ({ children }: { children: ReactNode }) => (
  <kbd
    style={{
      fontFamily: mono,
      fontSize: '0.8em',
      padding: '2px 9px',
      borderRadius: 7,
      background: '#fff',
      color: C.ink,
      boxShadow: `inset 0 -3px 0 ${C.rule}, inset 0 0 0 1.5px ${C.faint}`,
    }}
  >
    {children}
  </kbd>
);

// ─── Atelier briefing page ──────────────────────────────────────────────────
const DEFIS = {
  calendrier: { label: 'Calendrier éditorial', icon: 'calendar' as IconName, tone: 'blue' as Tone, aide: 'Cible, piliers, rythme, canaux : un mois de contenus qui tient debout.' },
  declinaison: { label: 'Une idée, plusieurs contenus', icon: 'layers' as IconName, tone: 'violet' as Tone, aide: 'Un message pivot, décliné sans le trahir : article, post, email, script…' },
  campagne: { label: 'Concept de campagne', icon: 'palette' as IconName, tone: 'pink' as Tone, aide: 'Un concept, un brief créatif, des visuels cohérents sur chaque support.' },
  multicanal: { label: 'Campagne multicanale', icon: 'split' as IconName, tone: 'teal' as Tone, aide: 'Même fond, forme adaptée : chaque canal a ses codes, chaque cible ses mots.' },
  analyse: { label: 'Analyse & recommandations', icon: 'chart' as IconName, tone: 'green' as Tone, aide: 'Des données aux décisions : ce qui marche, pourquoi, et quoi tester ensuite.' },
  projet: { label: 'Mini-campagne', icon: 'flag' as IconName, tone: 'navy' as Tone, aide: 'Cible → concept → contenus → visuels → diffusion → analyse, de bout en bout.' },
};
type Defi = keyof typeof DEFIS;

const DefiBadge = ({ defi, size = 20 }: { defi: Defi; size?: number }) => {
  const d = DEFIS[defi];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 14px 6px 10px',
        borderRadius: 999,
        background: T[d.tone].bg,
        color: T[d.tone].fg,
        boxShadow: `inset 0 0 0 1.5px ${T[d.tone].bd}`,
        fontWeight: 700,
        fontSize: size,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name={d.icon} size={size + 2} sw={2.4} />
      {d.label}
    </span>
  );
};

const PanelTitle = ({ icon, children, c = C.navy }: { icon: IconName; children: ReactNode; c?: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
    <Icon name={icon} size={26} color={c} sw={2.3} />
    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 22, letterSpacing: '0.06em', textTransform: 'uppercase', color: c }}>{children}</span>
  </div>
);

const LabPage = ({
  mod,
  n,
  title,
  defi,
  who,
  where,
  objective,
  feats,
  minutes,
  crit,
  bonus,
  label,
  whereTitle = 'Livrables',
  children,
}: {
  mod: number;
  n: string;
  title: ReactNode;
  defi: Defi;
  who: string;
  where: ReactNode;
  objective: ReactNode;
  feats?: ReactNode;
  minutes: number;
  crit: ReactNode;
  bonus?: ReactNode;
  label?: string;
  whereTitle?: string;
  children: ReactNode;
}) => (
  <Frame mod={mod} kind="lab" label={label}>
    <Title size={48}>
      <span style={{ color: C.green }}>Atelier {n}</span> · {title}
    </Title>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 176, right: 120, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <DefiBadge defi={defi} />
      <Tag tone="grey" size={19}>
        <Icon name="users" size={20} /> {who}
      </Tag>
      {feats}
    </div>
    <div style={{ position: 'absolute', left: 120, top: 240, width: 1010, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 28px', borderLeft: `8px solid ${C.green}` }}>
        <PanelTitle icon="target" c={T.green.fg}>
          Objectif
        </PanelTitle>
        <div style={{ fontSize: 27, lineHeight: 1.42, color: C.ink }}>{objective}</div>
      </div>
      <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 28px', ...dl(140) }}>
        <PanelTitle icon={DEFIS[defi].icon} c={T[DEFIS[defi].tone].fg}>
          Le défi
        </PanelTitle>
        <div style={{ fontSize: 21, fontStyle: 'italic', color: C.muted, marginTop: -4, marginBottom: 10 }}>{DEFIS[defi].aide}</div>
        <div style={{ fontSize: 24, lineHeight: 1.45, color: C.soft }}>{children}</div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1170, top: 240, width: 630, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className={A.right} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 24px', ...dl(100) }}>
        <PanelTitle icon="doc">{whereTitle}</PanelTitle>
        <div style={{ fontSize: 22, lineHeight: 1.5, color: C.soft }}>{where}</div>
      </div>
      <Timer id={`atelier-${n}`} minutes={minutes} label={`Atelier ${n}`} compact cls={A.right} style={dl(200)} />
      <div className={A.right} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 24px', ...dl(300) }}>
        <PanelTitle icon="checkCircle" c={T.green.fg}>
          Critères de réussite
        </PanelTitle>
        <Checklist style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{crit}</Checklist>
      </div>
      {bonus ? (
        <div className={A.right} style={{ ...dl(400) }}>
          {bonus}
        </div>
      ) : null}
    </div>
    <div style={{ position: 'absolute', left: 120, bottom: 84, display: 'flex', alignItems: 'center', gap: 10, fontSize: 19, color: C.muted }}>
      <Icon name="sparkles" size={20} color={C.electric} /> Outils au choix :{' '}
      <span style={{ fontWeight: 600, color: C.navy }}>votre assistant IA (ChatGPT, Copilot, Gemini, Claude, Le Chat)</span> · générateur d’images autorisé · tableur
    </div>
  </Frame>
);

// Bonus line inside an atelier's "Le défi" panel (the right column has no room left).
const Bonus = ({ children }: { children: ReactNode }) => (
  <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'flex-start', background: T.pink.bg, borderRadius: 12, padding: '12px 16px', fontSize: 21, lineHeight: 1.42, color: C.ink }}>
    <Icon name="sparkles" size={24} color={T.pink.fg} style={{ marginTop: 2 }} />
    <span>
      <strong style={{ color: T.pink.fg }}>Bonus · </strong>
      {children}
    </span>
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
  human: { label: 'Validation', tone: 'pink' as Tone, icon: 'humanCheck' as IconName },
  out: { label: 'Résultat', tone: 'navy' as Tone, icon: 'flag' as IconName },
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
        boxShadow: `${SHADOW_SM}, inset 0 -5px 0 ${STRONG[nk.tone]}`,
        padding: '16px 18px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <IconTile name={icon ?? nk.icon} tone={nk.tone} size={40} solid={kind === 'ai'} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 15, letterSpacing: '0.1em', textTransform: 'uppercase', color: T[nk.tone].fg }}>{nk.label}</span>
      </div>
      <div style={{ fontSize: 23, fontWeight: 600, lineHeight: 1.25, color: C.ink }}>{label}</div>
      {sub ? <div style={{ fontSize: 19, lineHeight: 1.35, color: C.muted }}>{sub}</div> : null}
    </div>
  );
};

// Legend chip for a node kind.
const NodeChip = ({ kind, size = 19 }: { kind: NodeKind; size?: number }) => (
  <Tag tone={NK[kind].tone} size={size}>
    <Icon name={NK[kind].icon} size={size + 1} /> {NK[kind].label}
  </Tag>
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

const TabBtn = ({ id, children, tone = 'blue', icon }: { id: string; children?: ReactNode; tone?: Tone; icon?: IconName }) => {
  const ctx = useContext(TabCtx);
  const on = ctx?.cur === id;
  return (
    <button
      type="button"
      data-osd-interactive
      onClick={(e) => {
        e.currentTarget.blur();
        ctx?.set(id);
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        border: 'none',
        cursor: 'pointer',
        padding: '10px 18px',
        borderRadius: 10,
        fontFamily: body,
        fontWeight: 600,
        fontSize: 21,
        whiteSpace: 'nowrap',
        background: on ? STRONG[tone] : C.card,
        color: on ? (tone === 'yellow' ? C.ink : '#fff') : C.soft,
        boxShadow: on ? '0 6px 16px -10px rgba(11,31,92,.6)' : `inset 0 0 0 1.5px ${C.rule}`,
        transition: `all 200ms ${EASE}`,
      }}
    >
      {icon ? <Icon name={icon} size={22} /> : null}
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

// ─── Quiz series (one question at a time, instant feedback, score) ──────────
type QuizCtxT = {
  tried: Record<number, number[]>;
  pick: (q: number, o: number, ok: boolean) => void;
  solved: Record<number, 'first' | 'later'>;
};
const QuizCtx = createContext<QuizCtxT | null>(null);
const QItemCtx = createContext<{ qi: number; okIdx: number[] } | null>(null);

const QOpt = ({ ok = false, children, oi = 0 }: { ok?: boolean; children: ReactNode; oi?: number }) => {
  const ctx = useContext(QuizCtx);
  const item = useContext(QItemCtx);
  if (!ctx || !item) return null;
  const tried = ctx.tried[item.qi] ?? [];
  const was = tried.includes(oi);
  const state = was ? (ok ? 'ok' : 'ko') : 'idle';
  return (
    <button
      type="button"
      data-osd-interactive
      onClick={(e) => {
        e.currentTarget.blur();
        ctx.pick(item.qi, oi, ok);
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        width: '100%',
        boxSizing: 'border-box',
        padding: '16px 22px 16px 14px',
        border: 'none',
        borderRadius: 14,
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: body,
        fontSize: 27,
        lineHeight: 1.3,
        color: C.ink,
        background: state === 'ok' ? T.green.bg : state === 'ko' ? T.coral.bg : '#fff',
        boxShadow:
          state === 'ok' ? `inset 0 0 0 3px ${C.green}` : state === 'ko' ? `inset 0 0 0 3px ${C.coral}` : `inset 0 0 0 2px ${C.rule}, 0 8px 18px -14px rgba(11,31,92,.5)`,
        transition: `all 250ms ${EASE}`,
      }}
    >
      <span
        style={{
          flex: 'none',
          width: 52,
          height: 52,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: display,
          fontWeight: 800,
          fontSize: 26,
          background: state === 'ok' ? C.green : state === 'ko' ? C.coral : T.grey.bg,
          color: state === 'idle' ? C.soft : '#fff',
        }}
      >
        {state === 'ok' ? <Icon name="check" size={26} color="#fff" sw={3} /> : state === 'ko' ? <Icon name="x" size={24} color="#fff" sw={3} /> : LETTERS[oi]}
      </span>
      <span style={{ flex: 1 }}>{children}</span>
    </button>
  );
};

const QuizQ = ({ q, explain, children, qi = 0, active = false }: { q: ReactNode; explain: ReactNode; children: ReactNode; qi?: number; active?: boolean }) => {
  const ctx = useContext(QuizCtx);
  const opts = Children.toArray(children).filter(isValidElement) as ReactElement<{ ok?: boolean; oi?: number }>[];
  const okIdx = opts.flatMap((o, i) => (o.props.ok ? [i] : []));
  const tried = ctx?.tried[qi] ?? [];
  const solved = okIdx.some((i) => tried.includes(i));
  const lastWrong = !solved && tried.length > 0;
  return (
    <QItemCtx.Provider value={{ qi, okIdx }}>
      <div style={{ display: active ? 'flex' : 'none', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 33, fontWeight: 600, lineHeight: 1.3, color: C.ink, marginBottom: 8 }}>{q}</div>
        {opts.map((o, i) => cloneElement(o, { oi: i, key: i }))}
        <div
          style={{
            marginTop: 6,
            minHeight: 110,
            boxSizing: 'border-box',
            borderRadius: 14,
            padding: '16px 22px',
            background: solved ? T.green.bg : lastWrong ? T.coral.bg : T.grey.bg,
            fontSize: 25,
            lineHeight: 1.4,
            color: C.ink,
          }}
        >
          {solved ? (
            <>
              <strong style={{ color: T.green.fg }}>✓ Exact. </strong>
              {explain}
            </>
          ) : lastWrong ? (
            <>
              <strong style={{ color: T.coral.fg }}>✗ Pas tout à fait. </strong>Relisez la question : quel choix protège la qualité, la marque et la relecture humaine ? Réessayez.
            </>
          ) : (
            <span style={{ color: C.muted }}>Votez à main levée, puis cliquez sur une réponse.</span>
          )}
        </div>
      </div>
    </QItemCtx.Provider>
  );
};

const QuizSeries = ({ children, x = 120, y = 250, w = 1680 }: { children: ReactNode; x?: number; y?: number; w?: number }) => {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<{ qi?: number; active?: boolean }>[];
  const [idx, setIdx] = useState(0);
  const [tried, setTried] = useState<Record<number, number[]>>({});
  const [solved, setSolved] = useState<Record<number, 'first' | 'later'>>({});
  const pick = (q: number, o: number, ok: boolean) => {
    setTried((t) => ({ ...t, [q]: (t[q] ?? []).includes(o) ? (t[q] ?? []) : [...(t[q] ?? []), o] }));
    if (ok) setSolved((s) => (s[q] ? s : { ...s, [q]: (tried[q] ?? []).length === 0 ? 'first' : 'later' }));
  };
  const reset = () => {
    setTried({});
    setSolved({});
    setIdx(0);
  };
  const first = Object.values(solved).filter((v) => v === 'first').length;
  const n = items.length;
  return (
    <QuizCtx.Provider value={{ tried, pick, solved }}>
      <div style={{ position: 'absolute', left: x, top: y, width: w, display: 'flex', gap: 36 }}>
        <div style={{ flex: 1, minWidth: 0 }}>{items.map((it, i) => cloneElement(it, { qi: i, active: i === idx, key: i }))}</div>
        <div style={{ width: 300, flex: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 22px' }}>
            <Eyebrow c={C.muted} size={18}>
              Question {idx + 1} / {n}
            </Eyebrow>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  data-osd-interactive
                  onClick={(e) => {
                    e.currentTarget.blur();
                    setIdx(i);
                  }}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: display,
                    fontWeight: 800,
                    fontSize: 20,
                    background: solved[i] ? C.green : i === idx ? C.electric : C.panel,
                    color: solved[i] || i === idx ? '#fff' : C.muted,
                    boxShadow: i === idx ? `0 0 0 3px #fff, 0 0 0 5px ${C.electric}` : 'none',
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 18, fontSize: 21, color: C.soft, lineHeight: 1.4 }}>
              Du premier coup : <strong style={{ color: C.green, fontSize: 30, fontFamily: display }}>{first}</strong> / {n}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn icon="arrow" ghost size={20} disabled={idx === 0} onClick={() => setIdx((i) => Math.max(0, i - 1))} style={{ transform: 'scaleX(-1)' }} />
            <Btn icon="arrow" size={20} disabled={idx === n - 1} onClick={() => setIdx((i) => Math.min(n - 1, i + 1))}>
              Suivante
            </Btn>
            <Btn icon="reset" ghost tone="grey" size={20} onClick={reset} />
          </div>
        </div>
      </div>
    </QuizCtx.Provider>
  );
};

// ─── Fil rouge: « Ardente », torréfacteur lyonnais (marque fictive) ─────────
const BRAND = { name: 'Ardente', line: 'Torréfacteur lyonnais', coffee: '#8A4B2A', cream: '#F7EDE1', dark: '#3A2216' };

// Round brand avatar used in every mock-up.
const BrandDot = ({ size = 48 }: { size?: number }) => (
  <span
    style={{
      flex: 'none',
      width: size,
      height: size,
      borderRadius: 999,
      background: BRAND.coffee,
      color: BRAND.cream,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: display,
      fontWeight: 800,
      fontSize: Math.round(size * 0.5),
      lineHeight: 1,
    }}
  >
    A
  </span>
);

// Social post mock-up (LinkedIn / Instagram / Facebook look-alike, neutral styling).
const SocialPost = ({
  net = 'linkedin',
  children,
  img,
  meta,
  w = 640,
  size = 21,
  cls,
  style,
}: {
  net?: 'linkedin' | 'instagram';
  children: ReactNode;
  img?: ReactNode;
  meta?: string;
  w?: number;
  size?: number;
  cls?: string;
  style?: CSSProperties;
}) => (
  <div className={cls} style={{ width: w, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, overflow: 'hidden', ...style }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px 10px' }}>
      <BrandDot size={46} />
      <div style={{ flex: 1, lineHeight: 1.2 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.ink }}>{BRAND.name}</div>
        <div style={{ fontSize: 16, color: C.muted }}>{meta ?? (net === 'linkedin' ? `${BRAND.line} · 2 h` : 'Lyon, France')}</div>
      </div>
      <Icon name={net === 'linkedin' ? 'linkedin' : 'insta'} size={26} color={net === 'linkedin' ? C.blue : C.pink} />
    </div>
    {net === 'instagram' && img ? <div>{img}</div> : null}
    <div style={{ padding: net === 'instagram' ? '14px 20px 6px' : '4px 20px 12px', fontSize: size, lineHeight: 1.45, color: C.ink, whiteSpace: 'pre-line' }}>{children}</div>
    {net === 'linkedin' && img ? <div>{img}</div> : null}
    <div style={{ display: 'flex', gap: 26, padding: '10px 20px 14px', borderTop: `1px solid ${C.rule}`, fontSize: 17, color: C.muted }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <Icon name="heart" size={18} /> J’aime
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <Icon name="chat" size={18} /> Commenter
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <Icon name="send" size={18} /> Partager
      </span>
    </div>
  </div>
);

// Illustrated coffee visual (pure SVG, palette-driven) used as a stand-in for generated images.
const CupArt = ({ w, h, bg = BRAND.cream, cup = '#FFFFFF', accent = BRAND.coffee, bubble = false, cls, style }: { w: number; h: number; bg?: string; cup?: string; accent?: string; bubble?: boolean; cls?: string; style?: CSSProperties }) => {
  const s = Math.min(w, h);
  const cxp = w / 2;
  const cyp = h / 2;
  const r = s * 0.3;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={cls} style={{ display: 'block', ...style }} aria-hidden>
      <rect width={w} height={h} fill={bg} />
      <circle cx={cxp + r * 0.95} cy={cyp - r * 0.85} r={r * 0.5} fill={accent} opacity={0.12} />
      <circle cx={cxp - r * 1.15} cy={cyp + r * 0.9} r={r * 0.35} fill={accent} opacity={0.1} />
      <circle cx={cxp + r * 0.95} cy={cyp + r * 0.1} r={r * 0.32} fill="none" stroke={cup} strokeWidth={s * 0.045} />
      <circle cx={cxp} cy={cyp} r={r * 1.18} fill={cup} opacity={0.55} />
      <circle cx={cxp} cy={cyp} r={r} fill={cup} />
      <circle cx={cxp} cy={cyp} r={r * 0.8} fill={accent} />
      {bubble ? (
        <path
          d={`M ${cxp - r * 0.42} ${cyp - r * 0.28} h ${r * 0.84} a ${r * 0.12} ${r * 0.12} 0 0 1 ${r * 0.12} ${r * 0.12} v ${r * 0.36} a ${r * 0.12} ${r * 0.12} 0 0 1 ${-r * 0.12} ${r * 0.12} h ${-r * 0.5} l ${-r * 0.22} ${r * 0.2} v ${-r * 0.2} h ${-r * 0.12} a ${r * 0.12} ${r * 0.12} 0 0 1 ${-r * 0.12} ${-r * 0.12} v ${-r * 0.36} a ${r * 0.12} ${r * 0.12} 0 0 1 ${r * 0.12} ${-r * 0.12} z`}
          fill={BRAND.cream}
          opacity={0.92}
        />
      ) : (
        <path d={`M ${cxp - r * 0.35} ${cyp + r * 0.1} q ${r * 0.35} ${-r * 0.5} ${r * 0.7} 0 q ${-r * 0.35} ${r * 0.4} ${-r * 0.7} 0 z`} fill={BRAND.cream} opacity={0.85} />
      )}
    </svg>
  );
};

// Phone frame (9:19) for stories, reels, mobile inbox.
const Phone = ({ w = 300, children, cls, style }: { w?: number; children: ReactNode; cls?: string; style?: CSSProperties }) => (
  <div
    className={cls}
    style={{
      width: w,
      height: Math.round(w * 2.02),
      boxSizing: 'border-box',
      borderRadius: Math.round(w * 0.14),
      background: '#0F1530',
      padding: Math.round(w * 0.035),
      boxShadow: '0 30px 60px -30px rgba(11,31,92,.7)',
      ...style,
    }}
  >
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: Math.round(w * 0.11), overflow: 'hidden', background: '#fff' }}>
      {children}
      <div style={{ position: 'absolute', left: '50%', top: 8, width: w * 0.28, height: 18, marginLeft: -w * 0.14, borderRadius: 99, background: '#0F1530' }} />
    </div>
  </div>
);

// Prompt panel (dark, wrapped, with a label) — the house style for every prompt shown.
const PromptBox = ({ children, title = 'Prompt', size = 21, cls, style }: { children: ReactNode; title?: string; size?: number; cls?: string; style?: CSSProperties }) => (
  <CodeDark file={title} size={size} wrap cls={cls} style={style}>
    {children}
  </CodeDark>
);

// ─── Module synthesis rows + "Ma campagne" card ──────────────────────────────
const SynthRow = ({ n, tone, children, d }: { n: number; tone: Tone; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 24px', ...dl(d) }}>
    <Num n={n} tone={tone} size={48} />
    <div style={{ fontSize: 26, lineHeight: 1.35, color: C.ink }}>{children}</div>
  </div>
);
const ProjectCard = ({ mod, children }: { mod: number; children: ReactNode }) => (
  <div className={A.right} style={{ position: 'absolute', left: 1240, top: 270, width: 560, background: G.navy, borderRadius: 20, boxShadow: SHADOW, padding: '28px 32px', color: '#fff', ...dl(500) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Icon name="flag" size={34} color="#C9B6FF" />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 22, letterSpacing: '0.12em', color: '#C9B6FF' }}>MA CAMPAGNE · M{mod}</span>
    </div>
    <div style={{ marginTop: 18, fontSize: 25, lineHeight: 1.5, color: '#E6EAF6' }}>{children}</div>
  </div>
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

// ─── Ouverture ──────────────────────────────────────────────────────────────

// Cover: one idea fans out into six channel tiles, dots travel along each path.
const OCh = ({ icon, tone, label, y, d }: { icon: IconName; tone: Tone; label: string; y: number; d: number }) => (
  <div className={A.right} style={{ position: 'absolute', left: 300, top: y, display: 'flex', alignItems: 'center', gap: 16, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={64} solid />
    <span style={{ fontSize: 25, fontWeight: 600, color: C.ink, whiteSpace: 'nowrap' }}>{label}</span>
  </div>
);
const OPath = ({ y, d }: { y: number; d: number }) => {
  const path = `M 110 380 C 200 380, 210 ${y + 32}, 296 ${y + 32}`;
  return (
    <>
      <path d={path} pathLength={1} fill="none" stroke={C.rule} strokeWidth={4} strokeLinecap="round" className={A.draw} style={dl(d)} />
      <FlowDot path={path} dur={2.6} begin={d / 1000} r={6} color={C.electric} />
    </>
  );
};

const O_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={110} r={46} cls={A.fade} />
    <Outline x={-40} y={760} w={120} h={360} r={40} color="#AEB9E6" />
    <div style={{ position: 'absolute', left: 390, top: 120, width: 900 }}>
      <div className={A.in} style={{ display: 'flex', gap: 12 }}>
        <Tag tone="violet" size={22}>
          <Icon name="calendar" size={22} /> Formation · 1 jour · 7 h
        </Tag>
        <Tag tone="blue" size={22}>
          <Icon name="smile" size={22} /> Niveau débutant
        </Tag>
      </div>
      <h1
        className={A.in}
        style={{ margin: '34px 0 0', fontFamily: display, fontWeight: 800, fontSize: 80, lineHeight: 1.06, letterSpacing: '-0.02em', color: C.navy, ...dl(120) }}
      >
        L’IA pour le
        <br />
        marketing &
        <br />
        <span style={{ color: C.plum }}>la communication</span>
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 30, lineHeight: 1.45, color: C.soft, maxWidth: 860, ...dl(240) }}>
        Créer plus rapidement et plus efficacement : des idées aux contenus, des visuels à l’analyse,{' '}
        <strong style={{ color: C.navy }}>sans perdre la voix de votre marque</strong>.
      </p>
    </div>
    <Portrait w={170} x={390} y={650} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 674, ...dl(300) }}>
      <Eyebrow c={C.muted} size={20}>
        Formateur
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>IA appliquée aux métiers · marketing & communication</div>
    </div>
    <div style={{ position: 'absolute', left: 1290, top: 150, width: 560, height: 800 }}>
      <svg width={560} height={800} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
        <OPath y={20} d={500} />
        <OPath y={150} d={580} />
        <OPath y={280} d={660} />
        <OPath y={410} d={740} />
        <OPath y={540} d={820} />
        <OPath y={670} d={900} />
      </svg>
      <div className={A.pop} style={{ position: 'absolute', left: 0, top: 320, ...dl(300) }}>
        <div className={A.glow} style={{ width: 120, height: 120, borderRadius: 28, background: G.violet, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="bulb" size={66} color="#fff" />
        </div>
        <div style={{ marginTop: 12, width: 120, textAlign: 'center', fontFamily: display, fontWeight: 800, fontSize: 20, letterSpacing: '0.12em', color: C.violet }}>1 IDÉE</div>
      </div>
      <OCh icon="news" tone="navy" label="Article" y={20} d={560} />
      <OCh icon="linkedin" tone="blue" label="Post LinkedIn" y={150} d={640} />
      <OCh icon="insta" tone="pink" label="Instagram" y={280} d={720} />
      <OCh icon="mail" tone="teal" label="Newsletter" y={410} d={800} />
      <OCh icon="image" tone="violet" label="Visuels" y={540} d={880} />
      <OCh icon="video" tone="coral" label="Script vidéo" y={670} d={960} />
    </div>
    <Footer left={390} />
  </Frame>
);
O_Cover.transition = BLOOM;

// ─── Bienvenue ──────────────────────────────────────────────────────────────
const OPromise = ({ value, label, tone, d }: { value: ReactNode; label: ReactNode; tone: Tone; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 84, lineHeight: 1, color: STRONG[tone] }}>{value}</div>
    <div style={{ marginTop: 14, fontSize: 25, lineHeight: 1.4, color: C.soft }}>{label}</div>
  </div>
);

const O_Welcome: Page = () => (
  <Frame mod={0}>
    <Title>Bienvenue ! Une journée pour créer plus vite… et mieux</Title>
    <Lede>Aucun prérequis technique : si vous savez écrire un email, vous savez parler à une IA. On va apprendre à bien lui parler.</Lede>
    <Portrait w={230} x={130} y={300} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 130, top: 615, width: 300, ...dl(200) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy, lineHeight: 1.2 }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 22, color: C.soft, lineHeight: 1.4 }}>Votre formateur pour la journée</div>
    </div>
    <div style={{ position: 'absolute', left: 520, top: 300, width: 1280, display: 'flex', gap: 26 }}>
      <OPromise value={<CountUp to={7} suffix=" h" />} label="dont la moitié en ateliers : vous produisez, je vous accompagne" tone="blue" d={150} />
      <OPromise value={<CountUp to={6} />} label="modules, de la stratégie à l’analyse, chacun avec un livrable concret" tone="violet" d={280} />
      <OPromise value={<CountUp to={1} />} label="mini-campagne complète, construite et présentée en fin de journée" tone="green" d={410} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 520, top: 640, width: 1280, ...dl(600) }}>
      <Callout title="Notre contrat" tone="blue" icon="hand">
        Vous repartez avec une méthode de prompt, une bibliothèque de prompts testés et une mini-campagne prête à adapter.
        Je montre, <strong>vous tenez le clavier</strong>.
      </Callout>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 520, top: 860, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.muted, ...dl(800) }}>
      <Icon name="bulb" size={26} color={C.violet} />
      Fil conducteur : « L’IA propose, le marketeur dispose. »
    </div>
  </Frame>
);

// ─── Tour de table ──────────────────────────────────────────────────────────
const O_Poll: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Tour de table : qui êtes-vous ?</Title>
    <Lede>Main levée (ou réaction dans le chat) : cliquez une ligne par vote. Le « − » retire un vote.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800 }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Mon métier
      </Eyebrow>
      <Poll>
        <PollRow id="o-m1" label="Chargé·e de marketing" tone="blue" icon="target" />
        <PollRow id="o-m2" label="Chargé·e de communication" tone="violet" icon="megaphone" />
        <PollRow id="o-m3" label="Community manager" tone="pink" icon="hash" />
        <PollRow id="o-m4" label="Assistant·e marketing" tone="teal" icon="calendar" />
        <PollRow id="o-m5" label="Responsable communication" tone="navy" icon="org" />
      </Poll>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 980, top: 270, width: 820, ...dl(200) }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Mon usage de l’IA aujourd’hui
      </Eyebrow>
      <Poll>
        <PollRow id="o-u1" label="Jamais essayé, ou presque" tone="grey" icon="smile" />
        <PollRow id="o-u2" label="Quelques essais, résultats décevants" tone="coral" icon="alert" />
        <PollRow id="o-u3" label="De temps en temps, pour reformuler" tone="yellow" icon="pen" />
        <PollRow id="o-u4" label="Chaque semaine, pour plusieurs tâches" tone="blue" icon="calendar" />
        <PollRow id="o-u5" label="Tous les jours, c’est mon assistant" tone="green" icon="rocket" />
      </Poll>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(500) }}>
      On formera des binômes mixtes : un profil « contenus » avec un profil « stratégie » si possible.
    </Hint>
  </Frame>
);

// ─── Objectifs ──────────────────────────────────────────────────────────────
const OGoal = ({ icon, tone, title, d, children }: { icon: IconName; tone: Tone; title: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 26px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
      <IconTile name={icon} tone={tone} size={52} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
  </div>
);

const O_Objectifs: Page = () => (
  <Frame mod={0}>
    <Title>Objectifs : à la fin de la journée, vous saurez…</Title>
    <Lede>Huit objectifs pédagogiques, regroupés en quatre gestes professionnels.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 24 }}>
      <OGoal icon="bulb" tone="blue" title="Comprendre" d={100}>
        <Bullet size={23}>Les usages de l’IA générative en marketing et communication</Bullet>
        <Bullet size={23}>Chercher des idées, analyser une problématique, construire des pistes</Bullet>
      </OGoal>
      <OGoal icon="pen" tone="violet" title="Créer" d={220}>
        <Bullet size={23} tone="violet">Générer et améliorer articles, posts, emails, newsletters, supports</Bullet>
        <Bullet size={23} tone="violet">Rédiger des briefs et concevoir des visuels professionnels</Bullet>
      </OGoal>
      <OGoal icon="split" tone="teal" title="Adapter" d={340}>
        <Bullet size={23} tone="teal">Décliner un contenu par public, canal et format</Bullet>
        <Bullet size={23} tone="teal">Personnaliser pour rendre chaque message plus pertinent</Bullet>
      </OGoal>
      <OGoal icon="shieldCheck" tone="coral" title="Analyser & garantir" d={460}>
        <Bullet size={23} tone="coral">Analyser données, avis clients et performances de campagne</Bullet>
        <Bullet size={23} tone="coral">Vérifier, corriger, garantir qualité et conformité à la marque</Bullet>
      </OGoal>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(800) }}>
      <Icon name="checkCircle" size={24} color={C.green} />
      Évaluation continue : quiz à chaque module, livrables d’atelier, mini-campagne présentée au groupe, auto-positionnement début / fin.
    </div>
  </Frame>
);

// ─── Programme de la journée ────────────────────────────────────────────────
const OSlot = ({ t, mod, title, sub, tone, d }: { t: string; mod?: string; title: ReactNode; sub?: ReactNode; tone: Tone; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, ...dl(d) }}>
    <span style={{ flex: 'none', width: 78, fontFamily: mono, fontSize: 21, color: C.muted, paddingTop: 3 }}>{t}</span>
    <span style={{ flex: 'none', width: 12, height: 12, marginTop: 10, borderRadius: 99, background: STRONG[tone] }} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 600, color: C.ink, lineHeight: 1.3 }}>
        {mod ? <span style={{ fontFamily: display, fontWeight: 800, color: STRONG[tone], marginRight: 10 }}>{mod}</span> : null}
        {title}
      </div>
      {sub ? <div style={{ fontSize: 20, color: C.muted, lineHeight: 1.35, marginTop: 2 }}>{sub}</div> : null}
    </div>
  </div>
);

const OHalf = ({ icon, tone, title, sub, d, children }: { icon: IconName; tone: Tone; title: string; sub: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
      <IconTile name={icon} tone={tone} size={50} solid />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</div>
        <div style={{ fontSize: 21, color: C.muted }}>{sub}</div>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 17 }}>{children}</div>
  </div>
);

const O_Programme: Page = () => (
  <Frame mod={0}>
    <Title>Le programme de la journée</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'flex', gap: 50 }}>
      <OHalf icon="bulb" tone="violet" title="Matin · Penser & écrire" sub="De la stratégie aux contenus" d={0}>
        <OSlot t="9:00" title="Ouverture · le fil rouge de la journée" tone="grey" d={150} />
        <OSlot t="9:20" mod="M1" title="Comprendre l’IA dans le marketing" sub="Outils, formats, opportunités, limites" tone="blue" d={230} />
        <OSlot t="10:00" mod="M2" title="Stratégie et création d’idées" sub="Cible, personas, ligne éditoriale · atelier calendrier" tone="violet" d={310} />
        <OSlot t="11:10" title="Pause" tone="grey" d={390} />
        <OSlot t="11:25" mod="M3" title="Création de contenus" sub="Article, posts, emails, slogans, scripts · atelier" tone="teal" d={470} />
      </OHalf>
      <OHalf icon="palette" tone="green" title="Après-midi · Montrer & mesurer" sub="Visuels, déclinaisons, analyse, projet" d={200}>
        <OSlot t="13:30" mod="M4" title="Images et contenus visuels" sub="Prompt image, brief créatif, déclinaisons · atelier" tone="pink" d={350} />
        <OSlot t="14:20" mod="M5" title="Personnalisation et adaptation" sub="Un contenu, six canaux · atelier multicanal" tone="green" d={430} />
        <OSlot t="15:10" title="Pause" tone="grey" d={510} />
        <OSlot t="15:25" mod="M6" title="Analyse marketing avec l’IA" sub="Données, avis, tendances, recommandations" tone="yellow" d={590} />
        <OSlot t="16:05" title="Projet final · mini-campagne · clôture" tone="navy" d={670} />
      </OHalf>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 920, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(1000) }}>
      <Icon name="map" size={24} color={C.electric} />
      Le bandeau en haut à droite indique toujours où nous en sommes : M1 → M3 le matin, M4 → M6 l’après-midi, puis le projet.
    </div>
  </Frame>
);

// ─── Le fil rouge : Ardente ─────────────────────────────────────────────────
const OFact = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 18, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={54} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, color: C.soft, lineHeight: 1.38 }}>{children}</div>
    </div>
  </div>
);

const OLog = ({ n, tone, title, out, d }: { n: number; tone: Tone; title: string; out: string; d: number }) => (
  <div className={A.right} style={{ display: 'flex', alignItems: 'center', gap: 14, ...dl(d) }}>
    <Num n={`M${n}`} tone={tone} size={42} style={{ fontSize: 16 }} />
    <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 10 }}>
      <span style={{ fontSize: 22, fontWeight: 700, color: C.ink, whiteSpace: 'nowrap' }}>{title}</span>
      <span style={{ fontSize: 20, color: C.muted }}>{out}</span>
    </div>
  </div>
);

const O_FilRouge: Page = () => (
  <Frame mod={0}>
    <Title>
      Notre fil rouge : <span style={{ color: BRAND.coffee }}>Ardente</span>, torréfacteur lyonnais
    </Title>
    <Lede>Une marque fictive, des problèmes très réels. Vous pourrez aussi travailler sur votre propre entreprise.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 880, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 4 }}>
        <BrandDot size={64} />
        <div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: BRAND.dark }}>Ardente · café de spécialité</div>
          <div style={{ fontSize: 21, color: C.muted }}>14 salariés · torréfaction lente · relation directe avec les producteurs</div>
        </div>
      </div>
      <OFact icon="cart" tone="yellow" title="Trois offres" d={150}>
        E-shop (grains et moulu) · abonnement « Ardente Box » · <strong>Ardente Bureau</strong> : le café en entreprise
      </OFact>
      <OFact icon="megaphone" tone="blue" title="Quatre canaux" d={250}>
        Instagram 8 000 abonnés · LinkedIn 2 000 · newsletter 12 000 inscrits · site et blog
      </OFact>
      <OFact icon="clock" tone="coral" title="Le problème" d={350}>
        Une seule chargée de communication, 12 contenus par semaine à produire, aucune analyse des résultats.
      </OFact>
      <OFact icon="flag" tone="green" title="La mission du jour" d={450}>
        Lancer <strong>Ardente Bureau</strong> auprès des entreprises lyonnaises, en novembre.
      </OFact>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1060, top: 270, width: 740, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(200) }}>
      <Eyebrow c={C.navy} size={20}>
        Carnet de campagne
      </Eyebrow>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <OLog n={1} tone="blue" title="Les bons outils" out="et leurs limites" d={300} />
        <OLog n={2} tone="violet" title="Cible & idées" out="persona, ligne, calendrier" d={380} />
        <OLog n={3} tone="teal" title="Contenus" out="une idée, plusieurs textes" d={460} />
        <OLog n={4} tone="pink" title="Visuels" out="brief et concept de campagne" d={540} />
        <OLog n={5} tone="green" title="Déclinaisons" out="six canaux, plusieurs cibles" d={620} />
        <OLog n={6} tone="yellow" title="Analyse" out="ce qui marche, quoi tester" d={700} />
      </div>
      <div className={A.fade} style={{ marginTop: 22, paddingTop: 18, borderTop: `1.5px solid ${C.rule}`, fontSize: 22, color: C.soft, lineHeight: 1.4, ...dl(800) }}>
        <strong style={{ color: C.navy }}>16:05 · Projet final</strong> : vous assemblez tout en une mini-campagne.
      </div>
    </div>
  </Frame>
);

// ─── Auto-positionnement ────────────────────────────────────────────────────
const O_AutoPos: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Auto-positionnement : votre point de départ</Title>
    <Lede>Cochez ce que vous savez déjà faire aujourd’hui, sans aide. On refera l’exercice en fin de journée.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="ap1">Citer trois usages concrets de l’IA dans mon métier</CheckItem>
        <CheckItem id="ap2">Écrire un prompt qui donne un résultat utilisable du premier coup</CheckItem>
        <CheckItem id="ap3">Faire générer un persona et un calendrier éditorial crédibles</CheckItem>
        <CheckItem id="ap4">Transformer une idée en post, email, article et script vidéo</CheckItem>
        <CheckItem id="ap5">Rédiger un prompt d’image et un brief créatif</CheckItem>
        <CheckItem id="ap6">Adapter un même message à LinkedIn, Instagram et une newsletter</CheckItem>
        <CheckItem id="ap7">Faire analyser des avis clients ou des résultats de campagne</CheckItem>
        <CheckItem id="ap8">Repérer une erreur, un biais ou un risque juridique dans un texte d’IA</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau de départ"
          levels={[
            { min: 0, text: 'Découverte : la journée est faite pour vous.', tone: 'grey' },
            { min: 3, text: 'Utilisateur : on va structurer et fiabiliser.', tone: 'blue' },
            { min: 6, text: 'Avancé : visez les bonus de chaque atelier.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Notez votre score : il servira de référence pour mesurer votre progression à 17:00.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Règles du jeu & outils ─────────────────────────────────────────────────
const O_Setup: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Check-up : vos outils et nos règles du jeu</Title>
    <Lede>Un seul assistant IA suffit : prenez celui que votre entreprise autorise.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="su1" size={26}>Un assistant IA ouvert : ChatGPT, Copilot, Gemini, Claude ou Le Chat</CheckItem>
        <CheckItem id="su2" size={26}>Un outil d’image : Canva, Adobe Firefly, Copilot ou l’image de votre assistant</CheckItem>
        <CheckItem id="su3" size={26}>Un tableur (Excel ou Google Sheets) pour le calendrier et l’analyse</CheckItem>
        <CheckItem id="su4" size={26}>Un document vierge : votre « bibliothèque de prompts » de la journée</CheckItem>
        <CheckItem id="su5" size={26}>Votre charte éditoriale ou graphique, si vous en avez une</CheckItem>
      </div>
      <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Timer id="setup" minutes={3} label="Check-up" cls={A.right} style={{ width: 560, ...dl(200) }} />
        <Callout title="Règle d’or" tone="coral" icon="lock" cls={A.right} style={dl(400)} size={25}>
          Aucune donnée client réelle, aucun fichier confidentiel dans un outil grand public. Aujourd’hui : données fictives.
        </Callout>
      </div>
    </Checklist>
  </Frame>
);

// ═══ 10-m1 ═════════════════════════════════════════════════════════════

// ─── Module 1 · Comprendre l’IA dans le marketing ───────────────────────────

const M1_Section: Page = () => (
  <Section
    n={1}
    title={
      <>
        Comprendre l’IA
        <br />
        dans le marketing
      </>
    }
    sub="Ce que l’IA générative sait faire pour un service marketing, avec quels outils, et où sont les pièges."
    dur="9:20 – 10:00"
  >
    <SecItem n={1}>IA générative et marketing : comment ça marche, en une minute</SecItem>
    <SecItem n={2}>Les différents types d’outils</SecItem>
    <SecItem n={3}>Textes, images, vidéos et présentations</SecItem>
    <SecItem n={4}>Opportunités… et limites</SecItem>
  </Section>
);
M1_Section.transition = BLOOM;

// ─── Comment ça marche : prédire le mot suivant ─────────────────────────────
const M1Bar = ({ word, pct, top = false }: { word: string; pct: number; top?: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 20, height: 58 }}>
    <span style={{ width: 170, fontSize: 28, fontWeight: top ? 700 : 500, color: top ? C.navy : C.soft, textAlign: 'right' }}>{word}</span>
    <div style={{ width: 560, height: 36, borderRadius: 10, background: C.panel, overflow: 'hidden' }}>
      <div className={cx(b.grow(1), top && b.hi(2))} style={{ width: `${pct}%`, height: '100%', borderRadius: 10, background: top ? G.blue : C.faint }} />
    </div>
    <span className={b.fade(1)} style={{ width: 90, fontFamily: mono, fontSize: 24, color: top ? C.blue : C.muted }}>
      {pct} %
    </span>
  </div>
);

const M1_Predire: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>L’IA générative, en une minute : elle prédit la suite</Title>
    <Lede>Un modèle de langage a lu des milliards de textes. Il ne « sait » rien : il calcule le mot le plus probable, puis le suivant…</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 300, width: 1000, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '30px 36px', ...dl(150) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: display, fontWeight: 700, fontSize: 40, color: C.ink }}>
        « Ce matin, rien ne vaut un bon
        <span style={{ position: 'relative', display: 'inline-block', width: 150, height: 54, borderRadius: 12, boxShadow: `inset 0 0 0 3px ${C.rule}` }}>
          <span className={b.pop(2)} style={{ position: 'absolute', inset: 0, borderRadius: 12, background: G.blue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            café
          </span>
        </span>
        »
      </div>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <M1Bar word="café" pct={62} top />
        <M1Bar word="croissant" pct={14} />
        <M1Bar word="réveil" pct={9} />
        <M1Bar word="jus" pct={6} />
        <M1Bar word="autre…" pct={9} />
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1180, top: 300, width: 620, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card tone="coral" icon="alert" title="Plausible ≠ vrai" cls={A.right} style={dl(300)} size={23}>
        Elle écrit ce qui « sonne juste ». Un chiffre, une date, une citation peuvent être inventés.
      </Card>
      <Card tone="violet" icon="eyeOff" title="Elle ne connaît pas votre marque" cls={A.right} style={dl(420)} size={23}>
        Vos offres, vos prix, votre ton : seulement si vous les lui donnez.
      </Card>
      <Card tone="green" icon="bulb" title="Plus de contexte, meilleure suite" cls={A.right} style={dl(540)} size={23}>
        Le prompt oriente la prédiction : c’est tout l’art du module 2.
      </Card>
    </div>
    <Callout title="La conséquence pour nous" tone="blue" icon="target" cls={b.on(3)} style={{ position: 'absolute', left: 120, top: 830, width: 1000 }} size={24}>
      L’IA est un excellent <strong>rédacteur de premier jet</strong>, pas une source d’information.
    </Callout>
  </Frame>
);

// ─── Six usages marketing (cartes à retourner) ──────────────────────────────
const M1Use = ({ icon, tone, title, desc, ex }: { icon: IconName; tone: Tone; title: string; desc: string; ex: ReactNode }) => (
  <FlipCard
    w={536}
    h={300}
    tone={tone}
    backTone={tone}
    flipAt={1}
    front={
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <IconTile name={icon} tone={tone} size={60} />
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: C.navy }}>{title}</div>
        </div>
        <div style={{ marginTop: 16, fontSize: 24, lineHeight: 1.42, color: C.soft }}>{desc}</div>
      </>
    }
    back={
      <>
        <Eyebrow c={T[tone].fg} size={19}>
          Chez Ardente
        </Eyebrow>
        <div style={{ marginTop: 12, fontSize: 25, lineHeight: 1.42, color: C.ink }}>{ex}</div>
      </>
    }
  />
);

const M1_Usages: Page = () => (
  <Frame mod={1} beats={1}>
    <Title>Six usages de l’IA générative en marketing</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 210, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 536px)', gap: 36, ...dl(100) }}>
      <M1Use icon="bulb" tone="blue" title="Idéer" desc="Trouver des angles, des sujets, des concepts de campagne, des noms." ex="« 30 idées de posts pour faire connaître Ardente Bureau aux office managers. »" />
      <M1Use icon="pen" tone="violet" title="Rédiger" desc="Produire un premier jet : article, post, email, page web, script." ex="Un article de blog de 800 mots sur « la pause café, rituel d’équipe »." />
      <M1Use icon="split" tone="teal" title="Adapter" desc="Réécrire pour un autre public, un autre canal, une autre longueur." ex="Le même article transformé en post LinkedIn, carrousel Instagram et newsletter." />
      <M1Use icon="image" tone="pink" title="Visualiser" desc="Générer des visuels, des moodboards, des maquettes, des slides." ex="Trois pistes de visuels pour la campagne de novembre, au format story." />
      <M1Use icon="chart" tone="yellow" title="Analyser" desc="Synthétiser des avis, des commentaires, des résultats de campagne." ex="« Que disent nos 200 derniers avis clients ? Quels irritants reviennent ? »" />
      <M1Use icon="users" tone="green" title="Personnaliser" desc="Adapter le message à chaque segment, persona ou étape du parcours." ex="Un email de relance différent pour les PME, les start-up et les grands comptes." />
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(600) }}>
      Cliquez une carte pour la retourner, ou → pour toutes les retourner.
    </Hint>
  </Frame>
);

// ─── Les familles d’outils (onglets) ────────────────────────────────────────
const M1Tool = ({ name, by, children, tone = 'blue' }: { name: string; by: string; children: ReactNode; tone?: Tone }) => (
  <div style={{ width: 536, boxSizing: 'border-box', background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${STRONG[tone]}`, padding: '18px 24px 18px 30px' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy }}>{name}</span>
      <span style={{ fontSize: 18, color: C.muted }}>{by}</span>
    </div>
    <div style={{ marginTop: 6, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </div>
);
const M1Grid = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 536px)', gap: 24 }}>{children}</div>
);

const M1_Outils: Page = () => (
  <Frame mod={1} kind="demo">
    <Title>Les différents types d’outils</Title>
    <Lede>Les noms changent tous les six mois ; les familles restent. Cliquez sur une famille.</Lede>
    <Tabs initial="assist">
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, display: 'flex', gap: 12, ...dl(100) }}>
        <TabBtn id="assist" icon="chat" tone="blue">
          Assistants conversationnels
        </TabBtn>
        <TabBtn id="img" icon="image" tone="pink">
          Images
        </TabBtn>
        <TabBtn id="video" icon="video" tone="coral">
          Vidéo & voix
        </TabBtn>
        <TabBtn id="pres" icon="slides" tone="violet">
          Présentations
        </TabBtn>
        <TabBtn id="integ" icon="puzzle" tone="green">
          Intégrés à vos outils
        </TabBtn>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 370, width: 1680 }}>
        <TabPane id="assist">
          <M1Grid>
            <M1Tool name="ChatGPT" by="OpenAI">Le plus connu : rédaction, idéation, analyse de fichiers, images.</M1Tool>
            <M1Tool name="Copilot" by="Microsoft">Intégré à Word, PowerPoint, Outlook, Excel et Teams dans Microsoft 365.</M1Tool>
            <M1Tool name="Gemini" by="Google">Intégré à Gmail, Docs, Slides et Sheets dans Google Workspace.</M1Tool>
            <M1Tool name="Claude" by="Anthropic">Apprécié pour les textes longs, l’analyse de documents et le style.</M1Tool>
            <M1Tool name="Le Chat" by="Mistral AI">Alternative française et européenne, hébergement en Europe.</M1Tool>
            <M1Tool name="Bon pour…" by="toute la famille" tone="grey">
              Idées, premiers jets, reformulation, synthèse, analyse de textes et de tableaux.
            </M1Tool>
          </M1Grid>
        </TabPane>
        <TabPane id="img">
          <M1Grid>
            <M1Tool name="Assistants" by="ChatGPT, Gemini, Copilot" tone="pink">L’image générée dans la conversation : pratique pour itérer vite.</M1Tool>
            <M1Tool name="Midjourney" by="Midjourney" tone="pink">Très esthétique : moodboards, ambiances, pistes créatives.</M1Tool>
            <M1Tool name="Firefly" by="Adobe" tone="pink">Intégré à Photoshop et Express ; conçu pour un usage commercial.</M1Tool>
            <M1Tool name="Canva" by="Canva" tone="pink">Génération et retouche directement dans vos modèles de marque.</M1Tool>
            <M1Tool name="Ideogram" by="Ideogram" tone="pink">Réputé pour bien écrire du texte dans l’image.</M1Tool>
            <M1Tool name="Bon pour…" by="toute la famille" tone="grey">
              Illustrations, fonds, mises en scène produit, déclinaisons de formats.
            </M1Tool>
          </M1Grid>
        </TabPane>
        <TabPane id="video">
          <M1Grid>
            <M1Tool name="Génération vidéo" by="Runway, Veo, Sora…" tone="coral">Courts plans à partir d’un texte ou d’une image.</M1Tool>
            <M1Tool name="Avatars" by="Synthesia, HeyGen…" tone="coral">Vidéos explicatives avec présentateur virtuel, multilingues.</M1Tool>
            <M1Tool name="Montage" by="CapCut, Descript…" tone="coral">Sous-titres automatiques, découpe, formats courts.</M1Tool>
            <M1Tool name="Voix" by="ElevenLabs…" tone="coral">Voix off et doublage : attention au droit sur la voix.</M1Tool>
            <M1Tool name="Musique" by="Suno, Udio…" tone="coral">Jingles et fonds sonores : vérifier les licences.</M1Tool>
            <M1Tool name="Bon pour…" by="toute la famille" tone="grey">
              Formats courts, tutoriels, déclinaisons linguistiques, prototypes de spots.
            </M1Tool>
          </M1Grid>
        </TabPane>
        <TabPane id="pres">
          <M1Grid>
            <M1Tool name="Gamma" by="Gamma" tone="violet">Une présentation complète générée à partir d’un plan ou d’un texte.</M1Tool>
            <M1Tool name="Copilot" by="PowerPoint" tone="violet">Crée des slides depuis un document Word, dans votre modèle.</M1Tool>
            <M1Tool name="Canva" by="Canva" tone="violet">Présentations et documents commerciaux aux couleurs de la marque.</M1Tool>
            <M1Tool name="Gemini" by="Google Slides" tone="violet">Génère des slides et des images dans Slides.</M1Tool>
            <M1Tool name="Votre assistant" by="pour le fond" tone="violet">Plan, messages clés, notes : la structure avant la forme.</M1Tool>
            <M1Tool name="Bon pour…" by="toute la famille" tone="grey">
              Un premier jet en 5 minutes, à reprendre dans votre charte graphique.
            </M1Tool>
          </M1Grid>
        </TabPane>
        <TabPane id="integ">
          <M1Grid>
            <M1Tool name="Emailing & CRM" by="HubSpot, Brevo…" tone="green">Objets d’email, segments, textes de relance générés sur place.</M1Tool>
            <M1Tool name="Réseaux sociaux" by="Meta, LinkedIn…" tone="green">Variantes d’annonces, ciblage et textes publicitaires assistés.</M1Tool>
            <M1Tool name="Écriture" by="Notion, Word, Docs" tone="green">Reformuler, résumer, traduire sans quitter le document.</M1Tool>
            <M1Tool name="Tableur" by="Excel, Sheets" tone="green">Analyser un export de campagne en langage naturel.</M1Tool>
            <M1Tool name="Site web" by="CMS, SEO" tone="green">Méta-descriptions, textes alternatifs d’images, FAQ.</M1Tool>
            <M1Tool name="Bon pour…" by="toute la famille" tone="grey">
              Gagner du temps là où vous travaillez déjà, sans copier-coller.
            </M1Tool>
          </M1Grid>
        </TabPane>
      </div>
    </Tabs>
    <Callout title="Le bon réflexe" tone="blue" icon="shieldCheck" cls={A.fade} style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(500) }} size={24}>
      Commencez par l’outil <strong>autorisé par votre entreprise</strong> (version professionnelle : vos données ne servent pas à entraîner le modèle).
    </Callout>
  </Frame>
);

// ─── Textes, images, vidéos, présentations ──────────────────────────────────
const M1Dots = ({ n, tone, beat }: { n: number; tone: Tone; beat: number }) => (
  <div style={{ display: 'flex', gap: 8 }}>
    <span className={b.pop(beat)} style={{ width: 34, height: 12, borderRadius: 6, background: n >= 1 ? STRONG[tone] : C.panel, ...dl(0) }} />
    <span className={b.pop(beat)} style={{ width: 34, height: 12, borderRadius: 6, background: n >= 2 ? STRONG[tone] : C.panel, ...dl(80) }} />
    <span className={b.pop(beat)} style={{ width: 34, height: 12, borderRadius: 6, background: n >= 3 ? STRONG[tone] : C.panel, ...dl(160) }} />
    <span className={b.pop(beat)} style={{ width: 34, height: 12, borderRadius: 6, background: n >= 4 ? STRONG[tone] : C.panel, ...dl(240) }} />
    <span className={b.pop(beat)} style={{ width: 34, height: 12, borderRadius: 6, background: n >= 5 ? STRONG[tone] : C.panel, ...dl(320) }} />
  </div>
);
const M1Fmt = ({ icon, tone, title, level, maturity, good, warn, beat }: { icon: IconName; tone: Tone; title: string; level: number; maturity: string; good: ReactNode; warn: ReactNode; beat: number }) => (
  <div className={b.on(beat)} style={{ width: 399, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 26px', borderTop: `7px solid ${STRONG[tone]}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={56} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy }}>{title}</div>
    </div>
    <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <M1Dots n={level} tone={tone} beat={beat} />
      <span style={{ fontSize: 19, fontWeight: 600, color: T[tone].fg }}>{maturity}</span>
    </div>
    <Eyebrow c={T.green.fg} size={17} style={{ marginTop: 24 }}>
      Excellent pour
    </Eyebrow>
    <div style={{ marginTop: 6, fontSize: 22, lineHeight: 1.4, color: C.ink, minHeight: 124 }}>{good}</div>
    <Eyebrow c={T.coral.fg} size={17} style={{ marginTop: 14 }}>
      Attention à
    </Eyebrow>
    <div style={{ marginTop: 6, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{warn}</div>
  </div>
);

const M1_Formats: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>Textes, images, vidéos, présentations : où en est l’IA ?</Title>
    <Lede>Quatre formats, quatre niveaux de maturité. Chaque → révèle un format.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', gap: 28 }}>
      <M1Fmt icon="type" tone="blue" title="Textes" level={5} maturity="Très mature" beat={1} good="Articles, posts, emails, slogans, scripts, reformulations, traductions." warn="Faits inventés, ton générique, répétitions." />
      <M1Fmt icon="image" tone="pink" title="Images" level={4} maturity="Mature" beat={2} good="Illustrations, ambiances, fonds, mises en scène produit, déclinaisons." warn="Texte dans l’image, mains, logos, ressemblance avec des personnes ou des œuvres." />
      <M1Fmt icon="video" tone="coral" title="Vidéos" level={3} maturity="En progrès rapide" beat={3} good="Plans courts, sous-titres, montage, avatars, voix off multilingue." warn="Cohérence entre plans, droit à l’image et à la voix, coût." />
      <M1Fmt icon="slides" tone="violet" title="Présentations" level={3} maturity="Bon premier jet" beat={4} good="Structure, plan, messages clés, notes de présentation, slides brutes." warn="Charte graphique, chiffres à sourcer, slides trop chargées." />
    </div>
    <Callout title="La règle" tone="blue" icon="eye" cls={b.on(4)} style={{ position: 'absolute', left: 120, top: 830, width: 1680 }} size={24}>
      Moins le format est mature, plus la <strong>relecture humaine</strong> doit être attentive… et plus le temps de retouche est à prévoir.
    </Callout>
  </Frame>
);

// ─── Simulateur : combien de temps gagné ? ──────────────────────────────────
const M1Slider = ({ label, value, unit, onChange, min, max, step = 1, tone }: { label: string; value: number; unit: string; onChange: (v: number) => void; min: number; max: number; step?: number; tone: Tone }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', width: 760 }}>
      <span style={{ fontSize: 25, color: C.ink }}>{label}</span>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 34, color: STRONG[tone], fontVariantNumeric: 'tabular-nums' }}>
        {value} <span style={{ fontSize: 22, fontWeight: 600, color: C.muted }}>{unit}</span>
      </span>
    </div>
    <div style={{ marginTop: 10 }}>
      <Range value={value} onChange={onChange} min={min} max={max} step={step} w={760} tone={tone} />
    </div>
  </div>
);

const M1_Gain: Page = () => {
  const [n, setN] = useState(12);
  const [m, setM] = useState(45);
  const [g, setG] = useState(50);
  const [r, setR] = useState(10);
  const before = (n * m * 4.33) / 60;
  const after = (n * (m * (1 - g / 100) + r) * 4.33) / 60;
  const saved = before - after;
  const max = Math.max(before, after, 1);
  return (
    <Frame mod={1} kind="simu">
      <Title>Opportunité : combien de temps gagnez-vous vraiment ?</Title>
      <Lede>Réglez les curseurs avec vos chiffres. Le piège : oublier le temps de relecture.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, display: 'flex', flexDirection: 'column', gap: 34, ...dl(100) }}>
        <M1Slider label="Contenus produits par semaine" value={n} unit="contenus" onChange={setN} min={1} max={40} tone="blue" />
        <M1Slider label="Temps moyen par contenu, sans IA" value={m} unit="min" onChange={setM} min={10} max={180} step={5} tone="navy" />
        <M1Slider label="Temps gagné sur le premier jet" value={g} unit="%" onChange={setG} min={0} max={80} step={5} tone="green" />
        <M1Slider label="Relecture et correction ajoutées" value={r} unit="min / contenu" onChange={setR} min={0} max={40} tone="coral" />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1000, top: 280, width: 800, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '30px 36px', ...dl(250) }}>
        <Eyebrow c={C.muted} size={20}>
          Par mois
        </Eyebrow>
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ width: 130, fontSize: 23, color: C.soft }}>Sans IA</span>
            <div style={{ flex: 1, height: 44, borderRadius: 10, background: C.panel, overflow: 'hidden' }}>
              <div style={{ width: `${(before / max) * 100}%`, height: '100%', background: C.faint, transition: `width 400ms ${EASE}` }} />
            </div>
            <span style={{ width: 100, fontFamily: mono, fontSize: 24, color: C.soft, textAlign: 'right' }}>{fr(before)} h</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ width: 130, fontSize: 23, color: C.soft }}>Avec IA</span>
            <div style={{ flex: 1, height: 44, borderRadius: 10, background: C.panel, overflow: 'hidden' }}>
              <div style={{ width: `${(after / max) * 100}%`, height: '100%', background: G.blue, transition: `width 400ms ${EASE}` }} />
            </div>
            <span style={{ width: 100, fontFamily: mono, fontSize: 24, color: C.blue, textAlign: 'right' }}>{fr(after)} h</span>
          </div>
        </div>
        <div style={{ marginTop: 34, paddingTop: 26, borderTop: `1.5px solid ${C.rule}` }}>
          <Eyebrow c={saved > 0 ? T.green.fg : T.coral.fg} size={20}>
            {saved > 0 ? 'Temps libéré chaque mois' : 'Pas rentable en l’état'}
          </Eyebrow>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 6 }}>
            <span style={{ fontFamily: display, fontWeight: 800, fontSize: 110, lineHeight: 1, color: saved > 0 ? C.green : C.coral, fontVariantNumeric: 'tabular-nums' }}>
              {fr(Math.abs(saved))} h
            </span>
            <span style={{ fontSize: 26, color: C.soft }}>{saved > 0 ? `soit ${fr(saved / 7, 1)} jours` : 'de plus'}</span>
          </div>
          <div style={{ marginTop: 14, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
            {saved > 0 ? 'À réinvestir dans la stratégie, la créativité et la relation client.' : 'La relecture coûte plus que le gain : améliorez le prompt avant d’automatiser.'}
          </div>
        </div>
      </div>
    </Frame>
  );
};

// ─── Limites : le post piégé ────────────────────────────────────────────────
for (let n = 1; n <= 6; n++) {
  CSS.push(`.${P}-flaw${n}{border-radius:6px;transition:background-color 500ms ${EASE},box-shadow 500ms ${EASE}}
${at(n)} .${P}-flaw${n}{background:rgba(224,72,72,.14);box-shadow:inset 0 -3px 0 ${C.coral}}`);
}
const M1Flaw = ({ n, children }: { n: number; children: ReactNode }) => (
  <span className={k(`flaw${n}`)} style={{ padding: '0 3px' }}>
    {children}
    <span className={b.pop(n)} style={{ display: 'inline-flex', verticalAlign: 'super', marginLeft: 4, width: 26, height: 26, borderRadius: 99, background: C.coral, color: '#fff', fontSize: 15, fontWeight: 700, alignItems: 'center', justifyContent: 'center' }}>
      {n}
    </span>
  </span>
);
const M1Why = ({ n, title, children }: { n: number; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 18px' }}>
    <Num n={n} tone="coral" size={36} />
    <div style={{ fontSize: 21, lineHeight: 1.38, color: C.soft }}>
      <strong style={{ color: C.ink }}>{title}</strong> · {children}
    </div>
  </div>
);

const M1_Limites: Page = () => (
  <Frame mod={1} kind="exercice" beats={6}>
    <Title>Limites : trouvez les six problèmes de ce post</Title>
    <Lede>Généré en 3 secondes avec un prompt d’une ligne. Cherchez avant de cliquer : chaque → révèle un problème.</Lede>
    <SocialPost w={860} size={25} cls={A.in} style={{ position: 'absolute', left: 120, top: 270, ...dl(100) }}>
      <M1Flaw n={1}>Dans un monde en constante évolution</M1Flaw>, Ardente révolutionne la pause café ! 🚀☕🔥✨{'\n\n'}
      Notre café est <M1Flaw n={2}>100 % neutre en carbone</M1Flaw> et <M1Flaw n={3}>préféré par 9 Français sur 10</M1Flaw>.{'\n\n'}
      <M1Flaw n={4}>« Le meilleur café de ma vie » — Marie, cliente depuis 2012</M1Flaw>
      {'\n\n'}
      Commandez vite : <M1Flaw n={5}>−50 % pour toujours</M1Flaw> !{'\n\n'}
      <M1Flaw n={6}>#café #coffee #love #instagood #business #lyon #pause #bureau #team #motivation</M1Flaw>
    </SocialPost>
    <div style={{ position: 'absolute', left: 1030, top: 270, width: 770, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M1Why n={1} title="Ton générique">la formule « passe-partout » de l’IA. Aucune voix de marque.</M1Why>
      <M1Why n={2} title="Allégation interdite">« neutre en carbone » est très encadré par la loi : risque de greenwashing.</M1Why>
      <M1Why n={3} title="Chiffre inventé">aucune étude derrière. Une source, ou on retire.</M1Why>
      <M1Why n={4} title="Fausse citation">Ardente existe depuis 2016… et Marie n’existe pas.</M1Why>
      <M1Why n={5} title="Promesse non validée">une offre commerciale engage l’entreprise : pratique trompeuse.</M1Why>
      <M1Why n={6} title="Hashtags hors cible">en anglais, génériques, sans lien avec le B2B lyonnais.</M1Why>
    </div>
  </Frame>
);

// ─── Règles d’or juridiques et éthiques ─────────────────────────────────────
const M1Rule = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <Card tone={tone} icon={icon} title={title} cls={A.in} style={{ width: 536, height: 290, ...dl(d) }} size={23}>
    {children}
  </Card>
);

const M1_Regles: Page = () => (
  <Frame mod={1}>
    <Title>Six règles d’or avant de publier un contenu généré</Title>
    <div style={{ position: 'absolute', left: 120, top: 210, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 536px)', gap: 36 }}>
      <M1Rule icon="lock" tone="coral" title="Confidentialité & RGPD" d={100}>
        Pas de données personnelles de clients ni de documents internes dans un outil grand public. Anonymisez.
      </M1Rule>
      <M1Rule icon="eye" tone="blue" title="Relecture humaine" d={200}>
        Tout fait, chiffre, citation et promesse est vérifié par une personne avant publication.
      </M1Rule>
      <M1Rule icon="scale" tone="yellow" title="Publicité loyale" d={300}>
        Pas d’allégation trompeuse ni de « vert » non prouvé : c’est la marque qui est responsable.
      </M1Rule>
      <M1Rule icon="palette" tone="pink" title="Droits & images" d={400}>
        Ne pas imiter un artiste, une marque ou une personne réelle. Vérifiez les conditions d’usage de l’outil.
      </M1Rule>
      <M1Rule icon="sparkles" tone="violet" title="Transparence" d={500}>
        Signalez les images ou vidéos réalistes générées par IA : c’est une exigence de l’AI Act européen.
      </M1Rule>
      <M1Rule icon="users" tone="green" title="Biais & inclusion" d={600}>
        L’IA reproduit des stéréotypes (âge, genre, origine). Relisez vos personas et vos visuels avec ce filtre.
      </M1Rule>
    </div>
  </Frame>
);

// ─── Quiz flash ─────────────────────────────────────────────────────────────
const M1_Quiz: Page = () => (
  <Frame mod={1} kind="quiz">
    <Title>
      <span style={{ color: C.violet }}>Quiz flash</span> · vrai ou faux ?
    </Title>
    <QuizSeries y={220}>
      <QuizQ q="« L’IA connaît les prix et les offres d’Ardente. »" explain="Elle ne connaît que ce qu’on lui donne dans la conversation. Sinon, elle invente des tarifs plausibles… et faux.">
        <QOpt>Vrai, tout est sur Internet</QOpt>
        <QOpt ok>Faux, sauf si on les lui fournit</QOpt>
        <QOpt>Vrai, si la marque est connue</QOpt>
      </QuizQ>
      <QuizQ q="« Un texte bien écrit par l’IA peut être publié sans relecture. »" explain="Bien écrit ne veut pas dire exact. Un chiffre inventé ou une promesse non validée engage la marque : relecture systématique.">
        <QOpt>Vrai, s’il n’a pas de fautes</QOpt>
        <QOpt ok>Faux : on vérifie faits, ton et promesses</QOpt>
        <QOpt>Vrai, pour les réseaux sociaux</QOpt>
      </QuizQ>
      <QuizQ q="« Je colle notre fichier clients dans un assistant grand public pour le segmenter. »" explain="Ce sont des données personnelles : RGPD. On anonymise (pas de noms, emails, téléphones) ou on utilise un outil validé par l’entreprise.">
        <QOpt>Aucun problème si le compte est à mon nom</QOpt>
        <QOpt>Aucun problème si je supprime la conversation</QOpt>
        <QOpt ok>Non : on anonymise ou on passe par un outil validé</QOpt>
      </QuizQ>
      <QuizQ q="« Plus mon prompt est précis, plus la réponse est utile. »" explain="C’est le principe de base : cible, objectif, ton, format, exemples. Le module 2 vous donne une méthode en six ingrédients.">
        <QOpt ok>Vrai</QOpt>
        <QOpt>Faux, l’IA devine ce que je veux</QOpt>
        <QOpt>Faux, les prompts courts sont meilleurs</QOpt>
      </QuizQ>
      <QuizQ q="« Une image générée par IA est libre de droits par défaut. »" explain="Le régime juridique reste incertain et dépend de l’outil. Lisez ses conditions d’usage commercial et évitez toute ressemblance avec une œuvre, une marque ou une personne.">
        <QOpt>Vrai, puisque personne ne l’a dessinée</QOpt>
        <QOpt ok>Faux : conditions de l’outil et ressemblances à vérifier</QOpt>
        <QOpt>Vrai, si on la modifie un peu</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Synthèse ───────────────────────────────────────────────────────────────
const M1_Synthese: Page = () => (
  <Frame mod={1} kind="synthese">
    <Title>Ce qu’on retient du module 1</Title>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="blue" d={100}>
        L’IA <strong>prédit un texte plausible</strong> : excellent premier jet, mauvaise source d’information.
      </SynthRow>
      <SynthRow n={2} tone="violet" d={200}>
        Six usages : <strong>idéer, rédiger, adapter, visualiser, analyser, personnaliser</strong>.
      </SynthRow>
      <SynthRow n={3} tone="teal" d={300}>
        Cinq familles d’outils ; commencez par <strong>celui autorisé par l’entreprise</strong>.
      </SynthRow>
      <SynthRow n={4} tone="green" d={400}>
        Le gain réel = temps gagné <strong>moins le temps de relecture</strong>.
      </SynthRow>
      <SynthRow n={5} tone="coral" d={500}>
        Avant de publier : <strong>faits, ton, promesses, droits, transparence, biais</strong>.
      </SynthRow>
    </div>
    <ProjectCard mod={1}>
      Vous savez quel outil utiliser pour chaque format, et vous avez noté les six réflexes de vérification dans votre bibliothèque de prompts.
    </ProjectCard>
  </Frame>
);

// ═══ 20-m2 ═════════════════════════════════════════════════════════════

// ─── Module 2 · Stratégie marketing et création d’idées ─────────────────────

const M2_Section: Page = () => (
  <Section
    n={2}
    title={
      <>
        Stratégie marketing
        <br />& création d’idées
      </>
    }
    sub="Bien parler à l’IA, puis s’en servir pour réfléchir : cible, personas, idées, ligne éditoriale, calendrier."
    dur="10:00 – 11:10 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 1 · un calendrier de contenu sur un mois
      </Tag>
    }
  >
    <SecItem n={1}>La méthode du prompt en six ingrédients</SecItem>
    <SecItem n={2}>Définir une cible et créer des personas</SecItem>
    <SecItem n={3}>Trouver des idées de contenus</SecItem>
    <SecItem n={4}>Construire une ligne éditoriale</SecItem>
    <SecItem n={5}>Générer un calendrier éditorial</SecItem>
  </Section>
);
M2_Section.transition = BLOOM;

// ─── Les six ingrédients d’un prompt (constructeur interactif) ──────────────
const M2Ing = ({ id, on, set, name, q, tone }: { id: string; on: Record<string, boolean>; set: (id: string, v: boolean) => void; name: string; q: string; tone: Tone }) => (
  <Toggle
    on={!!on[id]}
    onChange={(v) => set(id, v)}
    tone={tone}
    size={25}
    label={
      <span>
        <strong style={{ color: STRONG[tone] }}>{name}</strong> <span style={{ color: C.muted }}>· {q}</span>
      </span>
    }
  />
);
const M2Line = ({ show, tone, children }: { show: boolean; tone: Tone; children: ReactNode }) =>
  show ? (
    <div className={A.fade} style={{ animationDuration: '400ms', borderLeft: `4px solid ${STRONG[tone]}`, paddingLeft: 12, marginBottom: 8 } as CSSProperties}>
      {children}
    </div>
  ) : null;

const M2_Prompt: Page = () => {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const set = (id: string, v: boolean) => setOn((o) => ({ ...o, [id]: v }));
  const n = Object.values(on).filter(Boolean).length;
  const lvl = n <= 1 ? 0 : n <= 3 ? 1 : n <= 5 ? 2 : 3;
  const res = [
    { tone: 'coral' as Tone, tag: 'Générique, interchangeable', txt: '« Dans un monde où le café est essentiel, découvrez notre offre révolutionnaire ! ☕🚀 »' },
    { tone: 'yellow' as Tone, tag: 'Correct, mais plat', txt: '« Offrez à vos équipes un café de qualité au bureau avec Ardente. Contactez-nous ! »' },
    { tone: 'blue' as Tone, tag: 'Ciblé, utilisable après retouche', txt: '« Votre machine à café fait fuir vos équipes ? Ardente Bureau installe un café de spécialité dans vos locaux… »' },
    { tone: 'green' as Tone, tag: 'Prêt à relire', txt: '« Le bon café ne fait pas de bruit. Il fait parler. » Réservez une dégustation gratuite pour votre équipe.' },
  ][lvl];
  return (
    <Frame mod={2} kind="simu">
      <Title>La méthode : six ingrédients pour un prompt utile</Title>
      <Lede>Activez les ingrédients un par un et regardez la qualité du résultat évoluer.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 640, display: 'flex', flexDirection: 'column', gap: 26, ...dl(100) }}>
        <M2Ing id="role" on={on} set={set} name="Rôle" q="qui parle ?" tone="navy" />
        <M2Ing id="ctx" on={on} set={set} name="Contexte" q="la marque, l’offre" tone="blue" />
        <M2Ing id="cible" on={on} set={set} name="Cible" q="à qui ?" tone="teal" />
        <M2Ing id="obj" on={on} set={set} name="Objectif" q="pour obtenir quoi ?" tone="green" />
        <M2Ing id="fmt" on={on} set={set} name="Format" q="longueur, structure" tone="violet" />
        <M2Ing id="ton" on={on} set={set} name="Ton & exemple" q="notre style" tone="pink" />
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22, color: C.muted, marginRight: 6 }}>Qualité</span>
          <span style={{ width: 52, height: 16, borderRadius: 8, background: n >= 1 ? STRONG[res.tone] : C.panel, transition: 'background 300ms' }} />
          <span style={{ width: 52, height: 16, borderRadius: 8, background: n >= 2 ? STRONG[res.tone] : C.panel, transition: 'background 300ms' }} />
          <span style={{ width: 52, height: 16, borderRadius: 8, background: n >= 3 ? STRONG[res.tone] : C.panel, transition: 'background 300ms' }} />
          <span style={{ width: 52, height: 16, borderRadius: 8, background: n >= 4 ? STRONG[res.tone] : C.panel, transition: 'background 300ms' }} />
          <span style={{ width: 52, height: 16, borderRadius: 8, background: n >= 5 ? STRONG[res.tone] : C.panel, transition: 'background 300ms' }} />
          <span style={{ width: 52, height: 16, borderRadius: 8, background: n >= 6 ? STRONG[res.tone] : C.panel, transition: 'background 300ms' }} />
          <span style={{ marginLeft: 8, fontFamily: display, fontWeight: 800, fontSize: 28, color: STRONG[res.tone] }}>{n} / 6</span>
        </div>
      </div>
      <PromptBox title="mon-prompt.txt" size={21} cls={A.right} style={{ position: 'absolute', left: 820, top: 270, width: 980, height: 470, ...dl(200) }}>
        <M2Line show={!!on.role} tone="navy">Tu es responsable marketing B2B d’un torréfacteur artisanal lyonnais.</M2Line>
        <M2Line show={!!on.ctx} tone="blue">Nous lançons Ardente Bureau : café de spécialité livré et machine installée en entreprise, sans engagement.</M2Line>
        <div style={{ marginBottom: 8, color: '#FFFFFF', fontWeight: 700 }}>Écris un post LinkedIn sur notre offre de café en entreprise.</div>
        <M2Line show={!!on.cible} tone="teal">Cible : office managers et RH de PME lyonnaises de 20 à 150 salariés.</M2Line>
        <M2Line show={!!on.obj} tone="green">Objectif : obtenir des demandes de dégustation gratuite au bureau.</M2Line>
        <M2Line show={!!on.fmt} tone="violet">Format : 120 à 150 mots, accroche de moins de 15 mots, 3 hashtags, un appel à l’action.</M2Line>
        <M2Line show={!!on.ton} tone="pink">Ton : chaleureux et expert, sans superlatifs. Notre style : « Le bon café ne fait pas de bruit. Il fait parler. »</M2Line>
      </PromptBox>
      <div
        className={A.right}
        style={{ position: 'absolute', left: 820, top: 770, width: 980, boxSizing: 'border-box', background: T[res.tone].bg, borderRadius: 18, boxShadow: `inset 0 0 0 2px ${T[res.tone].bd}`, padding: '18px 26px', transition: 'background 300ms', ...dl(300) }}
      >
        <Eyebrow c={T[res.tone].fg} size={19}>
          Résultat probable · {res.tag}
        </Eyebrow>
        <div style={{ marginTop: 8, fontSize: 24, lineHeight: 1.42, color: C.ink }}>{res.txt}</div>
      </div>
    </Frame>
  );
};

// ─── Le prompt est une conversation ─────────────────────────────────────────
const M2_Iterer: Page = () => (
  <Frame mod={2} beats={4}>
    <Title>Le prompt est une conversation, pas un ordre unique</Title>
    <Lede>Le premier résultat est un brouillon. Ce sont les relances qui font la qualité.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Bubble who="user" w={820} cls={A.in} style={dl(100)} size={24}>
        Avant de répondre, <strong>pose-moi les questions</strong> dont tu as besoin pour écrire un excellent post.
      </Bubble>
      <Bubble who="agent" name="Assistant IA" w={860} cls={b.on(1)} size={23}>
        1. Quel est le prix ou la formule d’essai ? 2. Avez-vous un client témoin ? 3. Quelle zone géographique ? 4. Quel ton sur LinkedIn ?
      </Bubble>
      <Bubble who="user" w={820} cls={b.on(2)} size={24}>
        Propose <strong>trois accroches</strong> très différentes : une question, un chiffre, une anecdote.
      </Bubble>
      <Bubble who="user" w={820} cls={b.on(3)} size={24}>
        <strong>Critique ton texte</strong> comme une directrice marketing exigeante, puis améliore-le.
      </Bubble>
      <Bubble who="user" w={820} cls={b.on(4)} size={24}>
        Plus court de 30 %, <strong>sans emoji</strong>, et termine par une question.
      </Bubble>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1240, top: 270, width: 560, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', ...dl(300) }}>
      <Eyebrow c={C.navy} size={20}>
        Cinq relances magiques
      </Eyebrow>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Bullet size={24} tone="blue">Pose-moi d’abord tes questions</Bullet>
        <Bullet size={24} tone="violet">Donne-moi 3 variantes très différentes</Bullet>
        <Bullet size={24} tone="teal">Critique, puis améliore</Bullet>
        <Bullet size={24} tone="green">Plus court, plus concret, plus simple</Bullet>
        <Bullet size={24} tone="pink">Réécris avec cet exemple de notre style</Bullet>
      </div>
      <div style={{ marginTop: 22, paddingTop: 18, borderTop: `1.5px solid ${C.rule}`, fontSize: 22, lineHeight: 1.4, color: C.soft }}>
        Le bon prompt, une fois trouvé, va dans votre <strong style={{ color: C.navy }}>bibliothèque</strong>.
      </div>
    </div>
  </Frame>
);

// ─── Définir une cible (entonnoir) ──────────────────────────────────────────
const M2Level = ({ w, tone, label, sub, beat }: { w: number; tone: Tone; label: string; sub: string; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ width: w, boxSizing: 'border-box', margin: '0 auto', background: beat === 3 ? G.blue : T[tone].bg, borderRadius: 16, boxShadow: beat === 3 ? SHADOW : `inset 0 0 0 2px ${T[tone].bd}`, padding: '16px 24px', textAlign: 'center' }}>
    <div style={{ fontSize: 28, fontWeight: 700, color: beat === 3 ? '#fff' : T[tone].fg }}>{label}</div>
    <div style={{ fontSize: 20, color: beat === 3 ? '#DCE3FB' : C.muted }}>{sub}</div>
  </div>
);

const M2_Cible: Page = () => (
  <Frame mod={2} beats={3}>
    <Title>Définir une cible : « tout le monde » n’est pas une cible</Title>
    <Lede>L’IA aide à resserrer, à condition de lui donner vos vraies informations et de la laisser questionner.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 900, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M2Level w={900} tone="grey" label="Tout le monde boit du café" sub="trop large : aucun message ne porte" beat={0} />
      <M2Level w={760} tone="yellow" label="Les entreprises" sub="mieux, mais une start-up n’est pas un groupe du CAC 40" beat={1} />
      <M2Level w={620} tone="teal" label="PME lyonnaises de 20 à 150 salariés" sub="taille, zone, besoin commun" beat={2} />
      <M2Level w={480} tone="blue" label="Leurs office managers & RH" sub="ceux qui choisissent et achètent" beat={3} />
    </div>
    <div style={{ position: 'absolute', left: 1080, top: 270, width: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PromptBox title="prompt · cible" size={20} cls={A.right} style={dl(200)}>
        Je suis chargée de marketing chez Ardente, torréfacteur lyonnais. Nous lançons une offre de café en entreprise. Voici nos ventes B2B actuelles : [tableau anonymisé].
        {'\n\n'}Aide-moi à choisir une <Cf>cible prioritaire</Cf>. Pose-moi d’abord 5 questions, puis propose 3 segments avec, pour chacun : taille, besoin, décideur, argument clé et risque.
      </PromptBox>
      <Callout title="Votre rôle" tone="coral" icon="humanCheck" cls={A.right} style={dl(400)} size={23}>
        L’IA propose des segments ; <strong>vos données de vente</strong> et votre connaissance terrain tranchent.
      </Callout>
    </div>
  </Frame>
);

// ─── Personas (onglets) ─────────────────────────────────────────────────────
const M2Box = ({ icon, tone, title, children }: { icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 22px', height: 238, boxSizing: 'border-box' }}>
    <PanelTitle icon={icon} c={T[tone].fg}>
      {title}
    </PanelTitle>
    <div style={{ fontSize: 22, lineHeight: 1.45, color: C.soft }}>{children}</div>
  </div>
);
const M2Persona = ({ name, role, tone, quote, goals, pains, chans, msg }: { name: string; role: string; tone: Tone; quote: string; goals: ReactNode; pains: ReactNode; chans: ReactNode; msg: ReactNode }) => (
  <div style={{ display: 'flex', gap: 26 }}>
    <div style={{ width: 500, flex: 'none', boxSizing: 'border-box', background: G.navy, borderRadius: 20, padding: '30px 32px', color: '#fff', height: 500 }}>
      <div style={{ width: 110, height: 110, borderRadius: 999, background: STRONG[tone], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="user" size={64} color="#fff" />
      </div>
      <div style={{ marginTop: 20, fontFamily: display, fontWeight: 800, fontSize: 40 }}>{name}</div>
      <div style={{ marginTop: 6, fontSize: 23, color: '#C9D2F2', lineHeight: 1.4 }}>{role}</div>
      <div style={{ marginTop: 26, fontSize: 25, lineHeight: 1.45, fontStyle: 'italic', color: '#fff' }}>« {quote} »</div>
    </div>
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <M2Box icon="target" tone="green" title="Objectifs">
        {goals}
      </M2Box>
      <M2Box icon="alert" tone="coral" title="Freins">
        {pains}
      </M2Box>
      <M2Box icon="megaphone" tone="blue" title="Où la toucher">
        {chans}
      </M2Box>
      <M2Box icon="chat" tone="violet" title="Le message qui marche">
        {msg}
      </M2Box>
    </div>
  </div>
);

const M2_Persona: Page = () => (
  <Frame mod={2} kind="demo">
    <Title>Créer des personas : trois visages pour Ardente Bureau</Title>
    <Tabs initial="claire">
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 192, display: 'flex', gap: 12 }}>
        <TabBtn id="claire" icon="user" tone="teal">
          Claire · office manager
        </TabBtn>
        <TabBtn id="hugo" icon="rocket" tone="violet">
          Hugo · fondateur de start-up
        </TabBtn>
        <TabBtn id="nadia" icon="org" tone="pink">
          Nadia · DRH d’ETI
        </TabBtn>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 280, width: 1680 }}>
        <TabPane id="claire">
          <M2Persona
            name="Claire, 36 ans"
            role="Office manager · éditeur de logiciels, 80 salariés, Lyon 7e"
            tone="teal"
            quote="Je veux que les équipes aient envie de revenir au bureau, sans exploser mon budget."
            goals="Un lieu de vie agréable, des retours positifs des équipes, zéro gestion compliquée."
            pains="Budget serré, peur de l’engagement long, déjà déçue par un prestataire."
            chans="LinkedIn, newsletters professionnelles, salons RH et bouche-à-oreille."
            msg="« Sans engagement, installé en une semaine, et vos équipes votent pour leur café. »"
          />
        </TabPane>
        <TabPane id="hugo">
          <M2Persona
            name="Hugo, 31 ans"
            role="Cofondateur · start-up de la greentech, 25 salariés, Villeurbanne"
            tone="violet"
            quote="Notre culture d’équipe, c’est notre avantage pour recruter."
            goals="Attirer des talents, cohérence avec ses valeurs, une marque employeur forte."
            pains="Peu de temps, méfiance envers le discours « responsable » non prouvé."
            chans="LinkedIn, Instagram, podcasts entrepreneurs, réseaux de start-up."
            msg="« Un café traçable, du producteur à votre tasse : vos valeurs, servies chaque matin. »"
          />
        </TabPane>
        <TabPane id="nadia">
          <M2Persona
            name="Nadia, 47 ans"
            role="DRH · ETI industrielle, 400 salariés, trois sites en région"
            tone="pink"
            quote="Il me faut une solution simple, qui marche sur tous nos sites."
            goals="Qualité de vie au travail mesurable, un seul interlocuteur, des factures claires."
            pains="Achats centralisés, appels d’offres, besoin de références solides."
            chans="LinkedIn, email direct, recommandations de pairs, événements QVCT."
            msg="« Un interlocuteur unique pour vos trois sites, et un bilan de satisfaction chaque trimestre. »"
          />
        </TabPane>
      </div>
    </Tabs>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(500) }}>
      Personas fictifs générés par IA puis retravaillés : cliquez sur les onglets pour comparer.
    </Hint>
  </Frame>
);

// ─── Le prompt persona et ses pièges ────────────────────────────────────────
const M2_PersonaPrompt: Page = () => (
  <Frame mod={2}>
    <Title>Le prompt persona… et ses trois pièges</Title>
    <PromptBox title="prompt · persona" size={21} cls={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 920, ...dl(100) }}>
      Tu es planneur stratégique. À partir des informations ci-dessous, crée <Cf>3 personas</Cf> distincts pour l’offre Ardente Bureau.
      {'\n\n'}
      <Cc>Informations : [offre, prix, zone, extraits anonymisés d’échanges clients]</Cc>
      {'\n\n'}Pour chaque persona : prénom, âge, poste, entreprise, citation typique, objectifs, freins, canaux, déclencheur d’achat, message clé.
      {'\n\n'}Signale ce qui relève de <Cn>l’hypothèse</Cn> et ce qui vient de mes données. Évite les stéréotypes.
    </PromptBox>
    <div style={{ position: 'absolute', left: 1100, top: 200, width: 700, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card tone="coral" icon="flask" title="Une hypothèse, pas une vérité" cls={A.right} style={dl(250)} size={23}>
        Confrontez-la à vos données : ventes, CRM, interviews, avis clients.
      </Card>
      <Card tone="yellow" icon="users" title="Gare aux clichés" cls={A.right} style={dl(400)} size={23}>
        L’IA associe facilement un métier à un âge ou un genre. Variez, corrigez.
      </Card>
      <Card tone="violet" icon="sparkles" title="Trop beau pour être vrai" cls={A.right} style={dl(550)} size={23}>
        Des détails très précis (« lit Les Échos le mardi ») sont souvent inventés.
      </Card>
    </div>
    <Callout title="Astuce" tone="blue" icon="bulb" cls={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 920, ...dl(700) }} size={23}>
      Donnez des verbatims réels anonymisés : le persona devient <strong>beaucoup plus juste</strong>.
    </Callout>
  </Frame>
);

// ─── La machine à idées ─────────────────────────────────────────────────────
const M2_ANGLES = [
  'les coulisses de la torréfaction',
  'l’erreur n° 1 avec la machine à café du bureau',
  'un chiffre surprenant sur les pauses en équipe',
  'le portrait d’un producteur partenaire',
  'l’avant / après d’une salle de pause',
  'le témoignage d’une entreprise cliente',
  'un mini-tuto pour réussir son café filtre',
  'une question ouverte à la communauté',
];
const M2_FORMATS = ['un carrousel LinkedIn', 'un reel Instagram', 'un article de blog', 'une newsletter', 'un sondage LinkedIn', 'une story Instagram', 'une vidéo de 30 secondes', 'une infographie'];
const M2_WHO = ['Claire, office manager', 'Hugo, fondateur de start-up', 'Nadia, DRH d’ETI'];
const M2_WHEN = ['un lundi matin', 'à la rentrée', 'le 1er octobre, Journée internationale du café', 'avant les fêtes de fin d’année', 'un jeudi midi', 'pendant la semaine de la QVCT'];

const M2Slot = ({ label, value, tone, spin }: { label: string; value: string; tone: Tone; spin: number }) => (
  <div style={{ background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 0 -5px 0 ${STRONG[tone]}`, padding: '16px 22px', height: 120, boxSizing: 'border-box' }}>
    <Eyebrow c={T[tone].fg} size={17}>
      {label}
    </Eyebrow>
    <div key={spin} className={A.down} style={{ marginTop: 8, fontSize: 26, fontWeight: 600, lineHeight: 1.3, color: C.ink, animationDuration: '450ms' } as CSSProperties}>
      {value}
    </div>
  </div>
);

const M2_Idees: Page = () => {
  const [s, setS] = useState({ a: 0, f: 0, w: 0, m: 0, n: 0 });
  const [kept, setKept] = useState(0);
  const roll = () =>
    setS((o) => ({
      a: Math.floor(Math.random() * M2_ANGLES.length),
      f: Math.floor(Math.random() * M2_FORMATS.length),
      w: Math.floor(Math.random() * M2_WHO.length),
      m: Math.floor(Math.random() * M2_WHEN.length),
      n: o.n + 1,
    }));
  return (
    <Frame mod={2} kind="simu">
      <Title>Trouver des idées : croiser angles × formats × cibles</Title>
      <Lede>La technique du « jeu de combinaisons » : demandez à l’IA 30 croisements, gardez les 3 meilleurs.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1080, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, ...dl(100) }}>
        <M2Slot label="Angle" value={M2_ANGLES[s.a]} tone="violet" spin={s.n} />
        <M2Slot label="Format" value={M2_FORMATS[s.f]} tone="blue" spin={s.n} />
        <M2Slot label="Pour" value={M2_WHO[s.w]} tone="teal" spin={s.n} />
        <M2Slot label="Quand" value={M2_WHEN[s.m]} tone="pink" spin={s.n} />
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 560, width: 1080, boxSizing: 'border-box', background: T.violet.bg, borderRadius: 18, padding: '22px 28px', ...dl(200) }}>
        <Eyebrow c={T.violet.fg} size={19}>
          L’idée
        </Eyebrow>
        <div key={s.n} className={A.fade} style={{ marginTop: 8, fontSize: 28, lineHeight: 1.4, color: C.ink, animationDuration: '500ms' } as CSSProperties}>
          Publier <strong>{M2_FORMATS[s.f]}</strong> sur <strong>{M2_ANGLES[s.a]}</strong>, pensé pour <strong>{M2_WHO[s.w]}</strong>, {M2_WHEN[s.m]}.
        </div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 760, display: 'flex', alignItems: 'center', gap: 16, ...dl(300) }}>
        <Btn icon="sparkles" tone="violet" onClick={roll} size={26}>
          Nouvelle idée
        </Btn>
        <Btn icon="star" ghost tone="green" onClick={() => setKept((x) => x + 1)} size={26}>
          On la garde
        </Btn>
        <span style={{ fontSize: 24, color: C.muted }}>
          Idées retenues : <strong style={{ fontFamily: display, fontSize: 34, color: C.green }}>{kept}</strong>
        </span>
      </div>
      <div style={{ position: 'absolute', left: 1260, top: 270, width: 540, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Card tone="blue" icon="filter" title="Demandez 30, gardez 3" cls={A.right} style={dl(250)} size={22}>
          La quantité d’abord, le tri ensuite, avec vos critères : cible, objectif, faisabilité.
        </Card>
        <Card tone="teal" icon="search" title="Partez des questions clients" cls={A.right} style={dl(400)} size={22}>
          FAQ, objections commerciales, avis : chaque question est un sujet.
        </Card>
        <Card tone="pink" icon="calendar" title="Calez sur les temps forts" cls={A.right} style={dl(550)} size={22}>
          Journées thématiques, saisons, actualité du secteur.
        </Card>
      </div>
    </Frame>
  );
};

// ─── Ligne éditoriale (piliers) ─────────────────────────────────────────────
const M2Arc = ({ from, pct, color, d }: { from: number; pct: number; color: string; d: number }) => {
  const R = 150;
  const L = 2 * Math.PI * R;
  return (
    <circle
      cx={190}
      cy={190}
      r={R}
      fill="none"
      stroke={color}
      strokeWidth={60}
      strokeDasharray={`${(pct / 100) * L - 4} ${L}`}
      strokeDashoffset={-(from / 100) * L}
      transform="rotate(-90 190 190)"
      className={A.fade}
      style={dl(d)}
    />
  );
};
const M2Pillar = ({ pct, tone, name, ex, d }: { pct: number; tone: Tone; name: string; ex: string; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 16, ...dl(d) }}>
    <span style={{ width: 84, fontFamily: display, fontWeight: 800, fontSize: 32, color: STRONG[tone], textAlign: 'right' }}>{pct} %</span>
    <span style={{ width: 14, height: 44, borderRadius: 4, background: STRONG[tone] }} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{name}</div>
      <div style={{ fontSize: 20, color: C.muted }}>{ex}</div>
    </div>
  </div>
);

const M2_Ligne: Page = () => (
  <Frame mod={2}>
    <Title>Ligne éditoriale : de quoi on parle, et comment</Title>
    <svg width={380} height={380} className={A.pop} style={{ position: 'absolute', left: 120, top: 260, ...dl(100) }} aria-hidden>
      <M2Arc from={0} pct={30} color={C.blue} d={200} />
      <M2Arc from={30} pct={25} color={C.violet} d={320} />
      <M2Arc from={55} pct={20} color={C.green} d={440} />
      <M2Arc from={75} pct={15} color={C.yellow} d={560} />
      <M2Arc from={90} pct={10} color={C.pink} d={680} />
      <text x={190} y={180} textAnchor="middle" style={{ fontFamily: display, fontWeight: 800, fontSize: 30, fill: C.navy }}>
        5 piliers
      </text>
      <text x={190} y={214} textAnchor="middle" style={{ fontSize: 20, fill: C.muted }}>
        le mix du mois
      </text>
    </svg>
    <div style={{ position: 'absolute', left: 540, top: 270, width: 600, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <M2Pillar pct={30} tone="blue" name="Expertise café" ex="origines, torréfaction, préparation" d={200} />
      <M2Pillar pct={25} tone="violet" name="Coulisses" ex="l’atelier, l’équipe, les producteurs" d={320} />
      <M2Pillar pct={20} tone="green" name="Engagement" ex="traçabilité, prix juste, preuves" d={440} />
      <M2Pillar pct={15} tone="yellow" name="Offres" ex="Ardente Bureau, abonnement, e-shop" d={560} />
      <M2Pillar pct={10} tone="pink" name="Communauté" ex="clients, questions, sondages" d={680} />
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1200, top: 260, width: 600, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(400) }}>
      <Eyebrow c={C.navy} size={20}>
        Charte de ton
      </Eyebrow>
      <div style={{ marginTop: 10, fontSize: 24, lineHeight: 1.42, color: C.ink }}>
        <strong>Promesse :</strong> le bon café rapproche les gens.
        <br />
        <strong>Ton :</strong> chaleureux, expert, jamais pédant.
      </div>
      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 21, lineHeight: 1.45 }}>
        <div style={{ background: T.green.bg, borderRadius: 12, padding: '12px 16px', color: C.ink }}>
          <strong style={{ color: T.green.fg }}>On dit</strong>
          <br />
          « dégustation »
          <br />
          « nos producteurs »
          <br />
          des faits, des preuves
        </div>
        <div style={{ background: T.coral.bg, borderRadius: 12, padding: '12px 16px', color: C.ink }}>
          <strong style={{ color: T.coral.fg }}>On ne dit pas</strong>
          <br />
          « révolutionnaire »
          <br />
          « le meilleur café »
          <br />
          des emojis en rafale
        </div>
      </div>
    </div>
    <Callout title="Avec l’IA" tone="violet" icon="sparkles" cls={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(800) }} size={24}>
      Donnez-lui vos 10 meilleurs posts : « Déduis-en nos piliers, notre ton et nos règles d’écriture. » Puis collez la charte en tête de chaque prompt.
    </Callout>
  </Frame>
);

// ─── Le calendrier éditorial ────────────────────────────────────────────────
const M2Cell = ({ tone, children, beat }: { tone: Tone; children: ReactNode; beat: number }) => (
  <div className={b.pop(beat)} style={{ background: T[tone].bg, boxShadow: `inset 4px 0 0 ${STRONG[tone]}`, borderRadius: 10, padding: '10px 14px', fontSize: 20, lineHeight: 1.3, color: C.ink, height: 96, boxSizing: 'border-box' }}>
    {children}
  </div>
);
const M2Head = ({ children }: { children: ReactNode }) => (
  <div style={{ fontFamily: display, fontWeight: 700, fontSize: 20, letterSpacing: '0.08em', color: C.navy, textTransform: 'uppercase', padding: '0 4px' }}>{children}</div>
);
const M2Chan = ({ icon, tone, children }: { icon: IconName; tone: Tone; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 23, fontWeight: 600, color: C.ink }}>
    <IconTile name={icon} tone={tone} size={44} /> {children}
  </div>
);

const M2_Calendrier: Page = () => (
  <Frame mod={2} beats={4}>
    <Title>Générer un calendrier éditorial : novembre chez Ardente</Title>
    <Lede>Persona + ligne éditoriale + temps forts = un mois cohérent, généré en 2 minutes, ajusté en 15.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: '220px repeat(4, 1fr)', gap: 14, alignItems: 'center', ...dl(100) }}>
      <span />
      <M2Head>Sem. 1 · teasing</M2Head>
      <M2Head>Sem. 2 · lancement</M2Head>
      <M2Head>Sem. 3 · preuves</M2Head>
      <M2Head>Sem. 4 · conversion</M2Head>
      <M2Chan icon="linkedin" tone="blue">
        LinkedIn
      </M2Chan>
      <M2Cell tone="violet" beat={1}>Carrousel : « 5 signes que votre café de bureau démotive »</M2Cell>
      <M2Cell tone="yellow" beat={2}>Annonce Ardente Bureau + offre dégustation</M2Cell>
      <M2Cell tone="green" beat={3}>Témoignage client : une PME du 7e</M2Cell>
      <M2Cell tone="yellow" beat={4}>Dernières dates de dégustation en novembre</M2Cell>
      <M2Chan icon="insta" tone="pink">
        Instagram
      </M2Chan>
      <M2Cell tone="violet" beat={1}>Reel : une matinée à l’atelier de torréfaction</M2Cell>
      <M2Cell tone="blue" beat={2}>Story quiz : « Quel café pour votre équipe ? »</M2Cell>
      <M2Cell tone="green" beat={3}>Portrait : notre productrice au Pérou</M2Cell>
      <M2Cell tone="pink" beat={4}>Sondage : votre rituel café préféré</M2Cell>
      <M2Chan icon="mail" tone="teal">
        Newsletter
      </M2Chan>
      <M2Cell tone="blue" beat={1}>Guide : réussir la pause café en équipe</M2Cell>
      <M2Cell tone="yellow" beat={2}>Lancement : l’offre détaillée et la FAQ</M2Cell>
      <M2Cell tone="violet" beat={3}>Coulisses : comment on choisit nos cafés</M2Cell>
      <M2Cell tone="yellow" beat={4}>Rappel : dégustation offerte avant le 30/11</M2Cell>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, display: 'flex', gap: 12, ...dl(400) }}>
      <Tag tone="blue" size={20}>Expertise</Tag>
      <Tag tone="violet" size={20}>Coulisses</Tag>
      <Tag tone="green" size={20}>Engagement & preuves</Tag>
      <Tag tone="yellow" size={20}>Offres</Tag>
      <Tag tone="pink" size={20}>Communauté</Tag>
    </div>
    <PromptBox title="prompt · calendrier" size={19} cls={A.fade} style={{ position: 'absolute', left: 120, top: 830, width: 1680, ...dl(600) }}>
      À partir du persona et de la ligne éditoriale ci-dessus, crée un calendrier de 4 semaines (LinkedIn 2×/sem., Instagram 3×/sem., newsletter 1×/sem.). <Cf>Tableau</Cf> : date, canal, pilier, sujet, format, appel à l’action.
    </PromptBox>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M2_Qcm: Page = () => (
  <QcmPage
    mod={2}
    n={1}
    title="Personas et IA"
    q="L’IA vient de vous générer trois personas très détaillés. Que faites-vous ?"
    explain="Un persona généré est une hypothèse de travail : on le confronte aux données réelles (ventes, CRM, avis, interviews) et on corrige les stéréotypes."
  >
    <Opt why="Les détails sont plausibles, pas vérifiés : vous risquez de cibler des personnes qui n’existent pas.">Je les utilise tels quels dans la campagne</Opt>
    <Opt ok why="Exact : c’est un point de départ très utile, à valider avec vos données et vos équipes commerciales.">
      Je les confronte à nos données clients et je les corrige
    </Opt>
    <Opt why="L’IA ne remplace pas la connaissance du terrain : elle n’a jamais parlé à vos clients.">J’arrête les études clients, l’IA suffit</Opt>
    <Opt why="Plus on a de personas, moins chacun est utile : choisissez une cible prioritaire.">J’en génère vingt pour couvrir tout le monde</Opt>
  </QcmPage>
);

// ─── Atelier 1 ──────────────────────────────────────────────────────────────
const M2_Atelier: Page = () => (
  <LabPage
    mod={2}
    n="1"
    title="Un calendrier de contenu sur un mois"
    defi="calendrier"
    who="En binôme · Ardente ou votre marque"
    minutes={30}
    objective={
      <>
        Produire avec l’IA un <strong>calendrier éditorial d’un mois</strong>, cohérent avec une cible, une ligne éditoriale et des temps forts.
      </>
    }
    where={
      <>
        1 persona prioritaire · 4 à 5 piliers avec leur poids · un tableau de 4 semaines (12 à 16 publications) · les prompts utilisés, collés dans votre bibliothèque
      </>
    }
    crit={
      <>
        <CheckItem id="a1c1" size={22}>Chaque ligne sert la cible et l’objectif</CheckItem>
        <CheckItem id="a1c2" size={22}>Les piliers sont équilibrés</CheckItem>
        <CheckItem id="a1c3" size={22}>Un appel à l’action par publication</CheckItem>
        <CheckItem id="a1c4" size={22}>Vous avez corrigé au moins 3 idées faibles</CheckItem>
      </>
    }
  >
    <strong>1.</strong> Prompt cible + persona (6 ingrédients). <strong>2.</strong> Demandez 30 idées, gardez-en 12. <strong>3.</strong> Faites générer la ligne éditoriale.{' '}
    <strong>4.</strong> Demandez le calendrier en tableau, puis critiquez-le avec l’IA.
    <Bonus>Demandez une version exportable (CSV) et importez-la dans votre tableur.</Bonus>
  </LabPage>
);

// ─── Exemple de restitution ─────────────────────────────────────────────────
const M2Row = ({ c, children, head = false }: { c: string[]; children?: ReactNode; head?: boolean }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '130px 160px 190px 1fr 200px 300px', gap: 16, padding: '12px 20px', background: head ? C.navy : C.card, color: head ? '#fff' : C.ink, fontSize: head ? 19 : 21, fontWeight: head ? 700 : 400, letterSpacing: head ? '0.06em' : 0, borderBottom: `1px solid ${C.rule}` }}>
    <span>{c[0]}</span>
    <span>{c[1]}</span>
    <span>{c[2]}</span>
    <span>{c[3]}</span>
    <span>{c[4]}</span>
    <span>{c[5]}</span>
    {children}
  </div>
);

const M2_Exemple: Page = () => (
  <Frame mod={2} kind="cas">
    <Title>Exemple de restitution : un extrait du tableau généré</Title>
    <Lede>Ce que l’IA a produit en une minute, après deux relances. Repérez ce que vous changeriez encore.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, borderRadius: 18, overflow: 'hidden', boxShadow: SHADOW, ...dl(100) }}>
      <M2Row head c={['DATE', 'CANAL', 'PILIER', 'SUJET', 'FORMAT', 'APPEL À L’ACTION']} />
      <M2Row c={['Lun. 3/11', 'LinkedIn', 'Expertise', '5 signes que votre café de bureau démotive', 'Carrousel', 'Commentez votre signe n° 1']} />
      <M2Row c={['Mer. 5/11', 'Instagram', 'Coulisses', 'Une matinée à l’atelier de torréfaction', 'Reel 30 s', 'Enregistrez pour plus tard']} />
      <M2Row c={['Jeu. 6/11', 'Newsletter', 'Expertise', 'Réussir la pause café en équipe', 'Guide', 'Téléchargez la check-list']} />
      <M2Row c={['Mar. 11/11', 'LinkedIn', 'Offres', 'Lancement d’Ardente Bureau', 'Post + visuel', 'Réservez une dégustation']} />
      <M2Row c={['Mar. 18/11', 'LinkedIn', 'Engagement', 'Une PME du 7e raconte', 'Témoignage', 'Lire le cas client']} />
      <M2Row c={['Mar. 25/11', 'Newsletter', 'Offres', 'Dégustation offerte avant le 30/11', 'Email court', 'Choisir un créneau']} />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 760, width: 1680, display: 'flex', gap: 24 }}>
      <Callout title="Bien vu" tone="green" icon="check" cls={A.in} style={{ flex: 1, ...dl(400) }} size={23}>
        Progression teasing → lancement → preuves → conversion, un appel à l’action partout.
      </Callout>
      <Callout title="À corriger" tone="coral" icon="pen" cls={A.in} style={{ flex: 1, ...dl(550) }} size={23}>
        Le 11/11 est férié ! Et le témoignage client doit être réel et validé par le client.
      </Callout>
    </div>
  </Frame>
);

// ─── Synthèse ───────────────────────────────────────────────────────────────
const M2_Synthese: Page = () => (
  <Frame mod={2} kind="synthese">
    <Title>Ce qu’on retient du module 2</Title>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="navy" d={100}>
        Six ingrédients : <strong>rôle, contexte, cible, objectif, format, ton & exemple</strong>.
      </SynthRow>
      <SynthRow n={2} tone="blue" d={200}>
        Le prompt est <strong>une conversation</strong> : questions, variantes, critique, réécriture.
      </SynthRow>
      <SynthRow n={3} tone="teal" d={300}>
        Personas et cibles générés = <strong>hypothèses à valider</strong> avec vos données.
      </SynthRow>
      <SynthRow n={4} tone="violet" d={400}>
        Idées : <strong>croiser angles × formats × cibles</strong>, demander 30, garder 3.
      </SynthRow>
      <SynthRow n={5} tone="green" d={500}>
        La <strong>ligne éditoriale</strong> en tête de prompt rend tout le calendrier cohérent.
      </SynthRow>
    </div>
    <ProjectCard mod={2}>
      Vous avez une cible prioritaire, un persona, une ligne éditoriale et un calendrier d’un mois. Vos prompts sont dans la bibliothèque.
    </ProjectCard>
  </Frame>
);

// ═══ 30-m3 ═════════════════════════════════════════════════════════════

// ─── Module 3 · Création de contenus avec l’IA ──────────────────────────────

const M3_Section: Page = () => (
  <Section
    n={3}
    title={
      <>
        Création de contenus
        <br />
        avec l’IA
      </>
    }
    sub="Articles, posts, newsletters, emails, pages web, slogans, scripts : une méthode commune, des codes propres à chaque format."
    dur="11:25 – 12:30 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 2 · une idée, plusieurs contenus
      </Tag>
    }
  >
    <SecItem n={1}>Le cycle de création : brief, jet, critique, réécriture, validation</SecItem>
    <SecItem n={2}>Article, post LinkedIn, publications réseaux sociaux</SecItem>
    <SecItem n={3}>Newsletter, email, page web</SecItem>
    <SecItem n={4}>Slogans et scripts vidéo</SecItem>
    <SecItem n={5}>Trouver le ton juste et relire comme un éditeur</SecItem>
  </Section>
);
M3_Section.transition = BLOOM;

// ─── Le cycle de création ───────────────────────────────────────────────────
const M3Step = ({ n, icon, tone, title, who, children }: { n: number; icon: IconName; tone: Tone; title: string; who: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ width: 300, height: 270, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 -6px 0 ${STRONG[tone]}`, padding: '22px 22px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <IconTile name={icon} tone={tone} size={56} solid />
      <Tag tone={who === 'IA' ? 'violet' : who === 'Vous' ? 'green' : 'blue'} size={18}>
        {who}
      </Tag>
    </div>
    <div style={{ marginTop: 16, fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>
      {n}. {title}
    </div>
    <div style={{ marginTop: 8, fontSize: 21, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </div>
);
const M3Gap = ({ n }: { n: number }) => (
  <div className={b.fade(n)} style={{ width: 45, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <FlowArrow w={40} color={C.faint} />
  </div>
);

const M3_Cycle: Page = () => (
  <Frame mod={3} beats={6}>
    <Title>Le cycle de création : l’IA écrit, vous dirigez</Title>
    <Lede>Le même cycle pour tous les formats. Le gain vient de la boucle critique → réécriture, pas du premier jet.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, display: 'flex' }}>
      <M3Step n={1} icon="note" tone="navy" title="Brief" who="Vous">
        Six ingrédients + la charte de ton.
      </M3Step>
      <M3Gap n={2} />
      <M3Step n={2} icon="sparkles" tone="violet" title="Premier jet" who="IA">
        Deux ou trois variantes, jamais une seule.
      </M3Step>
      <M3Gap n={3} />
      <M3Step n={3} icon="search" tone="blue" title="Critique" who="IA + vous">
        Faites-la relire avec une grille : cible, clarté, preuve, appel à l’action.
      </M3Step>
      <M3Gap n={4} />
      <M3Step n={4} icon="pen" tone="teal" title="Réécriture" who="IA">
        Consignes précises : « plus court », « plus concret », « sans jargon ».
      </M3Step>
      <M3Gap n={5} />
      <M3Step n={5} icon="humanCheck" tone="green" title="Validation" who="Vous">
        Faits, ton, promesses, droits. C’est votre signature.
      </M3Step>
    </div>
    <svg width={1920} height={200} style={{ position: 'absolute', left: 0, top: 560, pointerEvents: 'none' }} aria-hidden>
      <path d="M 1305 30 Q 960 170 615 30" fill="none" stroke={C.violet} strokeWidth={4} strokeDasharray="10 12" className={cx(A.march, b.fade(6))} />
      <polygon points="615,30 640,40 630,58" fill={C.violet} className={b.fade(6)} />
      <text x={960} y={128} textAnchor="middle" className={b.fade(6)} style={{ fontFamily: display, fontWeight: 700, fontSize: 24, fill: C.violet }}>
        on boucle 2 ou 3 fois
      </text>
    </svg>
    <Callout title="Le prompt de critique, à garder" tone="violet" icon="sparkles" cls={b.on(6)} style={{ position: 'absolute', left: 120, top: 780, width: 1680 }} size={24}>
      « Relis ce texte comme une directrice marketing exigeante. Note-le sur 10 pour la cible, la clarté, la preuve et l’appel à l’action. Puis réécris-le pour obtenir 9/10. »
    </Callout>
  </Frame>
);

// ─── Article de blog (onglets) ──────────────────────────────────────────────
const M3H = ({ lvl, children }: { lvl: 1 | 2; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, paddingLeft: lvl === 2 ? 40 : 0 }}>
    <span style={{ flex: 'none', fontFamily: mono, fontSize: 19, fontWeight: 700, color: lvl === 1 ? C.electric : C.violet }}>H{lvl}</span>
    <span style={{ fontSize: lvl === 1 ? 27 : 24, fontWeight: lvl === 1 ? 700 : 500, color: C.ink }}>{children}</span>
  </div>
);

const M3_Article: Page = () => (
  <Frame mod={3} kind="demo">
    <Title>Un article de blog : du plan à l’introduction</Title>
    <Tabs initial="prompt">
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 192, display: 'flex', gap: 12 }}>
        <TabBtn id="prompt" icon="chat" tone="navy">
          1 · Le prompt
        </TabBtn>
        <TabBtn id="plan" icon="layers" tone="blue">
          2 · Le plan
        </TabBtn>
        <TabBtn id="intro" icon="pen" tone="violet">
          3 · L’introduction
        </TabBtn>
        <TabBtn id="seo" icon="search" tone="green">
          4 · Le référencement
        </TabBtn>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 280, width: 1680 }}>
        <TabPane id="prompt">
          <PromptBox title="prompt · article" size={23}>
            Tu es rédacteur web spécialisé en qualité de vie au travail. Rédige le <Cf>plan détaillé</Cf> d’un article de blog pour Ardente.
            {'\n\n'}Sujet : la pause café, rituel d’équipe. Cible : office managers de PME. Objectif : faire découvrir Ardente Bureau sans discours commercial.
            {'\n\n'}Format : titre H1 de moins de 60 caractères, 5 parties H2, une FAQ de 3 questions. Pour chaque partie : idée clé et exemple concret.
            {'\n\n'}<Cn>Ne cite aucun chiffre sans me signaler qu’il faut le sourcer.</Cn>
          </PromptBox>
        </TabPane>
        <TabPane id="plan">
          <div style={{ display: 'flex', gap: 30 }}>
            <div style={{ flex: 1, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '26px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <M3H lvl={1}>La pause café : 5 façons d’en faire un vrai rituel d’équipe</M3H>
              <M3H lvl={2}>Pourquoi la pause café compte plus qu’on ne le croit</M3H>
              <M3H lvl={2}>Un bon café, un lieu accueillant : les deux ingrédients</M3H>
              <M3H lvl={2}>Instaurer des moments partagés (sans les imposer)</M3H>
              <M3H lvl={2}>Impliquer les équipes dans le choix des cafés</M3H>
              <M3H lvl={2}>Concilier qualité, budget et responsabilité</M3H>
              <M3H lvl={2}>FAQ : budget, entretien, engagement</M3H>
            </div>
            <div style={{ width: 520, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <Callout title="Bien" tone="green" icon="check" size={23}>
                Structure claire, angle utile pour la cible, l’offre n’apparaît qu’en fin d’article.
              </Callout>
              <Callout title="À vérifier" tone="coral" icon="alert" size={23}>
                La partie 1 appellera des chiffres : trouvez une vraie étude, ou supprimez-les.
              </Callout>
            </div>
          </div>
        </TabPane>
        <TabPane id="intro">
          <div style={{ display: 'flex', gap: 30 }}>
            <div style={{ flex: 1, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '28px 34px', fontSize: 26, lineHeight: 1.55, color: C.ink }}>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: C.navy, marginBottom: 14 }}>La pause café : 5 façons d’en faire un vrai rituel d’équipe</div>
              Dix heures. Quelqu’un se lève, propose un café, et la conversation qui bloquait en réunion se dénoue en trois minutes devant la machine. La pause café n’est pas du temps perdu : c’est souvent là que l’équipe se
              retrouve. Encore faut-il lui donner un peu d’attention…
            </div>
            <div style={{ width: 520, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <Callout title="Technique" tone="violet" icon="sparkles" size={23}>
                Demandez trois introductions : une scène, une question, un constat. Gardez la meilleure.
              </Callout>
              <Callout title="Votre touche" tone="blue" icon="pen" size={23}>
                Ajoutez une anecdote vraie de l’entreprise : c’est ce que l’IA ne peut pas inventer.
              </Callout>
            </div>
          </div>
        </TabPane>
        <TabPane id="seo">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            <Card tone="green" icon="search" title="Mots-clés" size={23}>
              « Proposez 10 requêtes que tape un office manager qui cherche une solution café. » Puis vérifiez-les dans un outil SEO.
            </Card>
            <Card tone="blue" icon="type" title="Méta-description" size={23}>
              « Écris 3 méta-descriptions de 150 caractères, avec le mot-clé et un bénéfice. »
            </Card>
            <Card tone="violet" icon="image" title="Textes alternatifs" size={23}>
              « Rédige le texte alternatif de chaque image » : référencement et accessibilité d’un coup.
            </Card>
          </div>
        </TabPane>
      </div>
    </Tabs>
  </Frame>
);

// ─── Post LinkedIn (choix de l’accroche) ────────────────────────────────────
const M3_HOOKS = {
  q: 'Votre machine à café fait-elle fuir vos équipes ?',
  c: '3 minutes. C’est le temps qu’il a fallu pour débloquer notre réunion de lundi.',
  a: 'Mardi, une cliente nous a dit : « Depuis votre café, les équipes reviennent au bureau. »',
};

const M3Hook = ({ id, label, set, cur, tone }: { id: keyof typeof M3_HOOKS; label: string; set: (h: keyof typeof M3_HOOKS) => void; cur: string; tone: Tone }) => (
  <button
    type="button"
    data-osd-interactive
    onClick={(e) => {
      e.currentTarget.blur();
      set(id);
    }}
    style={{
      width: '100%',
      textAlign: 'left',
      cursor: 'pointer',
      border: 'none',
      borderRadius: 14,
      padding: '14px 20px',
      fontFamily: body,
      fontSize: 23,
      lineHeight: 1.35,
      color: C.ink,
      background: cur === id ? T[tone].bg : C.card,
      boxShadow: cur === id ? `inset 0 0 0 3px ${STRONG[tone]}` : `inset 0 0 0 1.5px ${C.rule}`,
      transition: `all 200ms ${EASE}`,
    }}
  >
    <strong style={{ color: STRONG[tone] }}>{label}</strong>
    <br />
    {M3_HOOKS[id]}
  </button>
);

const M3_LinkedIn: Page = () => {
  const [h, setH] = useState<keyof typeof M3_HOOKS>('q');
  return (
    <Frame mod={3} kind="exercice">
      <Title>Un post LinkedIn : tout se joue avant « … voir plus »</Title>
      <Lede>Deux lignes visibles, environ 200 caractères. Choisissez l’accroche, regardez l’effet.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 560, display: 'flex', flexDirection: 'column', gap: 14, ...dl(100) }}>
        <Eyebrow c={C.navy} size={20}>
          Trois accroches générées
        </Eyebrow>
        <M3Hook id="q" label="La question" set={setH} cur={h} tone="blue" />
        <M3Hook id="c" label="Le chiffre concret" set={setH} cur={h} tone="violet" />
        <M3Hook id="a" label="L’anecdote client" set={setH} cur={h} tone="green" />
        <div style={{ marginTop: 10, fontSize: 21, lineHeight: 1.4, color: C.muted }}>L’anecdote doit être vraie, et le client d’accord pour être cité.</div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 740, top: 270, ...dl(200) }}>
        <SocialPost w={620} size={22}>
          <span key={h} className={A.fade} style={{ fontWeight: 700, animationDuration: '400ms' } as CSSProperties}>
            {M3_HOOKS[h]}
          </span>
          {'\n'}
          <span style={{ color: C.muted }}>
            La pause café, c’est souvent là que l’équipe se retrouve… <strong style={{ color: C.soft }}>voir plus</strong>
          </span>
          {'\n\n'}
          <span style={{ opacity: 0.35 }}>
            Avec Ardente Bureau, nous installons un café de spécialité torréfié à Lyon dans vos locaux.{'\n'}→ Dégustation gratuite pour votre équipe en novembre.{'\n'}#QVT #Lyon #Café
          </span>
        </SocialPost>
      </div>
      <div style={{ position: 'absolute', left: 1420, top: 270, width: 380, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Eyebrow c={C.navy} size={20} cls={A.fade} style={dl(300)}>
          Anatomie
        </Eyebrow>
        <Card tone="blue" title="Accroche" bar={false} pad={18} size={21} cls={A.right} style={dl(350)}>
          Moins de 15 mots, une tension.
        </Card>
        <Card tone="violet" title="Corps aéré" bar={false} pad={18} size={21} cls={A.right} style={dl(450)}>
          Lignes courtes, une idée par ligne.
        </Card>
        <Card tone="green" title="Preuve" bar={false} pad={18} size={21} cls={A.right} style={dl(550)}>
          Un fait, un client, un chiffre sourcé.
        </Card>
        <Card tone="yellow" title="Appel à l’action" bar={false} pad={18} size={21} cls={A.right} style={dl(650)}>
          Un seul, clair. Et 3 hashtags max.
        </Card>
      </div>
    </Frame>
  );
};

// ─── Instagram et autres réseaux ────────────────────────────────────────────
const M3Net = ({ icon, tone, name, children, d }: { icon: IconName; tone: Tone; name: string; children: ReactNode; d: number }) => (
  <div className={A.right} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={52} solid />
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{name}</div>
      <div style={{ fontSize: 21, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M3_Social: Page = () => (
  <Frame mod={3}>
    <Title>Réseaux sociaux : chaque réseau a sa grammaire</Title>
    <Phone w={330} cls={A.in} style={{ position: 'absolute', left: 140, top: 210, ...dl(100) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '40px 14px 10px' }}>
        <BrandDot size={34} />
        <span style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>ardente.cafe</span>
      </div>
      <CupArt w={307} h={307} bubble />
      <div style={{ padding: '10px 14px', fontSize: 15, lineHeight: 1.45, color: C.ink }}>
        <strong>ardente.cafe</strong> Le café du lundi a un super-pouvoir : il remet l’équipe en route ☕{'\n'}
        <br />
        Et chez vous, c’est qui le premier à la machine ? 👇
        <br />
        <span style={{ color: C.blue }}>#cafedespecialite #lyon #bureau #torrefaction</span>
      </div>
    </Phone>
    <div style={{ position: 'absolute', left: 560, top: 210, width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Eyebrow c={C.navy} size={20} cls={A.fade} style={dl(200)}>
        Une légende Instagram en 3 temps
      </Eyebrow>
      <Card tone="pink" icon="eye" title="1 · Le visuel d’abord" cls={A.in} style={dl(250)} size={22}>
        On regarde avant de lire : la légende complète l’image, elle ne la décrit pas.
      </Card>
      <Card tone="violet" icon="chat" title="2 · Une phrase qui engage" cls={A.in} style={dl(350)} size={22}>
        Une question simple, à laquelle on a envie de répondre.
      </Card>
      <Card tone="blue" icon="hash" title="3 · Des hashtags de niche" cls={A.in} style={dl(450)} size={22}>
        Quelques-uns, précis, en français pour une cible locale.
      </Card>
    </div>
    <div style={{ position: 'absolute', left: 1180, top: 210, width: 620, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Eyebrow c={C.navy} size={20} cls={A.fade} style={dl(300)}>
        Demandez des variantes par réseau
      </Eyebrow>
      <M3Net icon="insta" tone="pink" name="Instagram" d={400}>
        Émotion, coulisses, carrousels éducatifs, stories interactives.
      </M3Net>
      <M3Net icon="users" tone="blue" name="Facebook" d={500}>
        Communauté locale, événements, ton convivial.
      </M3Net>
      <M3Net icon="video" tone="coral" name="TikTok & Reels" d={600}>
        Une accroche dans les 2 premières secondes, sous-titres obligatoires.
      </M3Net>
      <M3Net icon="chat" tone="teal" name="Threads, X, Bluesky" d={700}>
        Phrases courtes, avis tranché, conversation.
      </M3Net>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 560, top: 905, ...dl(900) }}>
      Prompt : « Adapte ce message à Instagram, Facebook et TikTok en respectant les codes de chaque réseau. »
    </Hint>
  </Frame>
);

// ─── Newsletter (anatomie) ──────────────────────────────────────────────────
const M3NlBlock = ({ beat, h, tone, label, children }: { beat: number; h: number; tone: Tone; label: string; children: ReactNode }) => (
  <div className={b.on(beat)} style={{ position: 'relative', height: h, boxSizing: 'border-box', borderRadius: 12, background: T[tone].bg, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, padding: '10px 18px', fontSize: 20, lineHeight: 1.35, color: C.ink }}>
    {children}
    <span style={{ position: 'absolute', right: -250, top: '50%', transform: 'translateY(-50%)', width: 230, fontFamily: display, fontWeight: 700, fontSize: 19, letterSpacing: '0.06em', textTransform: 'uppercase', color: T[tone].fg }}>
      ← {label}
    </span>
  </div>
);

const M3_Newsletter: Page = () => (
  <Frame mod={3} beats={6}>
    <Title>Une newsletter : un objectif, un appel à l’action</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 700, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 10, ...dl(100) }}>
      <M3NlBlock beat={1} h={64} tone="navy" label="Objet + pré-en-tête">
        <strong>La pause qui compte arrive au bureau</strong> · Dégustation offerte en novembre
      </M3NlBlock>
      <M3NlBlock beat={2} h={96} tone="violet" label="Accroche">
        Bonjour Claire, dix heures : la machine du bureau vous fait encore grimacer ? On a peut-être la solution.
      </M3NlBlock>
      <M3NlBlock beat={3} h={150} tone="blue" label="1 idée principale">
        <strong>Ardente Bureau</strong> : café de spécialité torréfié à Lyon, machine installée en une semaine, sans engagement.
        <div style={{ marginTop: 8 }}>
          <CupArt w={160} h={60} />
        </div>
      </M3NlBlock>
      <M3NlBlock beat={4} h={90} tone="teal" label="Preuve">
        « Les équipes votent chaque mois pour le café du mois. » — Office manager, PME lyonnaise (avec son accord)
      </M3NlBlock>
      <M3NlBlock beat={5} h={64} tone="green" label="Un seul bouton">
        <span style={{ display: 'inline-block', background: C.green, color: '#fff', fontWeight: 700, borderRadius: 8, padding: '4px 16px' }}>Réserver ma dégustation</span>
      </M3NlBlock>
      <M3NlBlock beat={6} h={54} tone="grey" label="Pied de page légal">
        Se désinscrire · Mentions légales · Données personnelles
      </M3NlBlock>
    </div>
    <PromptBox title="prompt · newsletter" size={20} cls={A.right} style={{ position: 'absolute', left: 1120, top: 190, width: 680, ...dl(300) }}>
      Rédige la newsletter de lancement d’Ardente Bureau pour nos clients B2B.
      {'\n'}Objectif <Cf>unique</Cf> : réserver une dégustation.
      {'\n'}Structure : objet (moins de 45 caractères) + pré-en-tête, accroche personnalisée avec {'{{prénom}}'}, une idée principale, une preuve, un seul bouton.
      {'\n'}Longueur : 150 mots. Ton : notre charte (ci-dessus).
      {'\n'}Propose 3 objets différents.
    </PromptBox>
    <Callout title="RGPD" tone="coral" icon="lock" cls={A.fade} style={{ position: 'absolute', left: 1120, top: 690, width: 680, ...dl(600) }} size={22}>
      Envoi aux seuls contacts qui ont consenti, lien de désinscription obligatoire. L’IA rédige ; votre outil d’emailing gère les données.
    </Callout>
  </Frame>
);

// ─── Emails : le testeur d’objets ───────────────────────────────────────────
const M3_SUBJECTS = [
  { id: 'a', t: 'Newsletter Ardente – Novembre – Numéro 47', score: 2, len: false, ben: false, perso: false, spam: true, why: 'Aucun bénéfice, et la fin est coupée sur mobile.' },
  { id: 'b', t: 'Votre équipe mérite mieux que ce café 😬', score: 7, len: true, ben: true, perso: false, spam: true, why: 'Curiosité et émotion. Un peu négatif : à tester.' },
  { id: 'c', t: 'Claire, une dégustation offerte pour l’équipe ?', score: 9, len: true, ben: true, perso: true, spam: true, why: 'Personnalisé, bénéfice clair, question : le meilleur.' },
  { id: 'd', t: 'GRATUIT !!! OFFRE EXCEPTIONNELLE CAFÉ 100 % OFFERT', score: 1, len: false, ben: true, perso: false, spam: false, why: 'Majuscules et mots « spam » : direction les indésirables.' },
];
const M3Crit = ({ ok, children }: { ok: boolean; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.ink }}>
    <span style={{ width: 34, height: 34, borderRadius: 99, background: ok ? C.green : C.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 300ms' }}>
      <Icon name={ok ? 'check' : 'x'} size={20} color="#fff" sw={3} />
    </span>
    {children}
  </div>
);
const M3Mail = ({ from, subj, hot = false }: { from: string; subj: string; hot?: boolean }) => (
  <div style={{ padding: '10px 14px', borderBottom: `1px solid ${C.rule}`, background: hot ? T.blue.bg : '#fff' }}>
    <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{from}</div>
    <div style={{ fontSize: 15, color: hot ? C.ink : C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subj}</div>
  </div>
);

const M3_Email: Page = () => {
  const [i, setI] = useState(0);
  const s = M3_SUBJECTS[i];
  return (
    <Frame mod={3} kind="simu">
      <Title>Un email : l’objet décide de tout</Title>
      <Lede>Quatre objets générés. Cliquez pour les tester dans une boîte de réception mobile.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 760, display: 'flex', flexDirection: 'column', gap: 14, ...dl(100) }}>
        <M3SubjBtn n={0} cur={i} set={setI} />
        <M3SubjBtn n={1} cur={i} set={setI} />
        <M3SubjBtn n={2} cur={i} set={setI} />
        <M3SubjBtn n={3} cur={i} set={setI} />
      </div>
      <Phone w={300} cls={A.in} style={{ position: 'absolute', left: 940, top: 240, ...dl(200) }}>
        <div style={{ padding: '40px 14px 10px', fontFamily: display, fontWeight: 800, fontSize: 22, color: C.ink }}>Boîte de réception</div>
        <M3Mail from="Service RH" subj="Planning des congés de fin d’année" />
        <M3Mail from="Ardente" subj={s.t} hot />
        <M3Mail from="Fournisseur papeterie" subj="Votre commande est expédiée" />
        <M3Mail from="Équipe IT" subj="Maintenance prévue ce soir à 20 h" />
      </Phone>
      <div key={i} className={A.right} style={{ position: 'absolute', left: 1300, top: 270, width: 500, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', animationDuration: '400ms', ...dl(0) } as CSSProperties}>
        <Eyebrow c={C.muted} size={19}>
          Score indicatif
        </Eyebrow>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 88, lineHeight: 1, color: s.score >= 7 ? C.green : s.score >= 4 ? C.amber : C.coral }}>
          {s.score}
          <span style={{ fontSize: 36, color: C.faint }}> / 10</span>
        </div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <M3Crit ok={s.len}>Lisible en entier sur mobile</M3Crit>
          <M3Crit ok={s.ben}>Bénéfice clair</M3Crit>
          <M3Crit ok={s.perso}>Personnalisé</M3Crit>
          <M3Crit ok={s.spam}>Sans risque « spam »</M3Crit>
        </div>
        <div style={{ marginTop: 18, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{s.why}</div>
      </div>
      <Callout title="Méthode" tone="blue" icon="flask" cls={A.fade} style={{ position: 'absolute', left: 120, top: 820, width: 760, ...dl(500) }} size={22}>
        Faites générer 10 objets, gardez-en 2, et laissez un <strong>test A/B</strong> trancher.
      </Callout>
    </Frame>
  );
};
const M3SubjBtn = ({ n, cur, set }: { n: number; cur: number; set: (n: number) => void }) => (
  <button
    type="button"
    data-osd-interactive
    onClick={(e) => {
      e.currentTarget.blur();
      set(n);
    }}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      textAlign: 'left',
      cursor: 'pointer',
      border: 'none',
      borderRadius: 14,
      padding: '16px 20px',
      fontFamily: body,
      fontSize: 24,
      color: C.ink,
      background: cur === n ? T.blue.bg : C.card,
      boxShadow: cur === n ? `inset 0 0 0 3px ${C.blue}` : `inset 0 0 0 1.5px ${C.rule}`,
    }}
  >
    <Num n={LETTERS[n]} tone={cur === n ? 'blue' : 'grey'} size={44} />
    {M3_SUBJECTS[n].t}
  </button>
);

// ─── Page web (wireframe) ───────────────────────────────────────────────────
const M3Wire = ({ beat, h, tone, label, children }: { beat: number; h: number; tone: Tone; label: string; children: ReactNode }) => (
  <div className={b.on(beat)} style={{ display: 'flex', gap: 20, alignItems: 'stretch' }}>
    <div style={{ flex: 1, height: h, boxSizing: 'border-box', borderRadius: 12, background: T[tone].bg, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, padding: '12px 20px', fontSize: 21, lineHeight: 1.35, color: C.ink }}>{children}</div>
    <div style={{ width: 300, display: 'flex', alignItems: 'center', fontFamily: display, fontWeight: 700, fontSize: 19, letterSpacing: '0.06em', textTransform: 'uppercase', color: T[tone].fg }}>← {label}</div>
  </div>
);

const M3_PageWeb: Page = () => (
  <Frame mod={3} beats={5}>
    <Title>Une page web : la structure avant les mots</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 1060, background: C.card, borderRadius: 18, boxShadow: SHADOW, overflow: 'hidden', ...dl(100) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: C.panel }}>
        <span style={{ width: 11, height: 11, borderRadius: 99, background: '#FF5F57' }} />
        <span style={{ width: 11, height: 11, borderRadius: 99, background: '#FEBC2E' }} />
        <span style={{ width: 11, height: 11, borderRadius: 99, background: '#28C840' }} />
        <span style={{ marginLeft: 12, fontFamily: mono, fontSize: 17, color: C.muted }}>ardente · /bureau</span>
      </div>
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <M3Wire beat={1} h={120} tone="navy" label="Attention · promesse">
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>Le café de spécialité, installé dans votre entreprise</div>
          Torréfié à Lyon · installé en une semaine · sans engagement
        </M3Wire>
        <M3Wire beat={2} h={90} tone="blue" label="Intérêt · bénéfices">
          Des équipes qui se retrouvent · zéro gestion pour vous · un café qui a du sens
        </M3Wire>
        <M3Wire beat={3} h={90} tone="teal" label="Preuve · confiance">
          Témoignages clients réels · producteurs partenaires · ce qui est inclus
        </M3Wire>
        <M3Wire beat={4} h={90} tone="violet" label="Désir · objections">
          FAQ : combien ça coûte ? qui entretient la machine ? et si on arrête ?
        </M3Wire>
        <M3Wire beat={5} h={70} tone="green" label="Action">
          <span style={{ display: 'inline-block', background: C.green, color: '#fff', fontWeight: 700, borderRadius: 8, padding: '4px 16px' }}>Réserver ma dégustation gratuite</span>
        </M3Wire>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 190, width: 560, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PromptBox title="prompt · page web" size={19} cls={A.right} style={dl(300)}>
        Propose la structure d’une page d’atterrissage pour Ardente Bureau selon le modèle <Cf>AIDA</Cf>. Pour chaque bloc : titre, texte de 30 mots maximum, élément visuel suggéré. Liste aussi les 5 objections probables d’un office manager.
      </PromptBox>
      <Card tone="green" icon="search" title="Bonus référencement" cls={A.right} style={dl(450)} size={21}>
        Balise titre, méta-description, textes alternatifs, FAQ : à demander dans la foulée.
      </Card>
      <Card tone="coral" icon="scale" title="Mentions obligatoires" cls={A.right} style={dl(600)} size={21}>
        Prix, conditions, mentions légales : jamais inventés par l’IA, toujours fournis par vous.
      </Card>
    </div>
  </Frame>
);

// ─── La machine à slogans ───────────────────────────────────────────────────
const M3_SLOGANS: { t: string; note: string; ok: boolean }[] = [
  { t: 'La pause qui compte.', note: 'Court, rythmé, porte la promesse.', ok: true },
  { t: 'Le bon café ne fait pas de bruit. Il fait parler.', note: 'Une signature de marque, réutilisable partout.', ok: true },
  { t: 'Faites infuser vos idées.', note: 'Piège : on infuse du thé, pas du café. L’IA ne vérifie pas le sens.', ok: false },
  { t: 'Votre équipe a du goût.', note: 'Valorise la cible, jeu de mots léger.', ok: true },
  { t: 'Le meilleur café de France.', note: 'Allégation invérifiable : interdit sans preuve.', ok: false },
  { t: 'Torréfié à Lyon, savouré au bureau.', note: 'Ancrage local + bénéfice : solide pour du B2B.', ok: true },
  { t: 'Du grain à moudre pour vos équipes.', note: 'Expression connue, déjà très utilisée : vérifier l’antériorité.', ok: false },
  { t: 'Le café qui réunit.', note: 'Simple, sincère, un peu générique.', ok: true },
];

const M3_Slogans: Page = () => {
  const [i, setI] = useState(0);
  const [keep, setKeep] = useState<number[]>([]);
  const s = M3_SLOGANS[i];
  return (
    <Frame mod={3} kind="simu">
      <Title>Des slogans : générer large, choisir avec des critères</Title>
      <Lede>Huit propositions de l’IA pour Ardente Bureau. Faites défiler, gardez vos favoris, et méfiez-vous des pièges.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 290, width: 1060, height: 300, boxSizing: 'border-box', background: G.navy, borderRadius: 24, boxShadow: SHADOW, padding: '44px 56px', color: '#fff', ...dl(100) }}>
        <Eyebrow c="#C9B6FF" size={20}>
          Proposition {i + 1} / {M3_SLOGANS.length}
        </Eyebrow>
        <div key={i} className={A.in} style={{ marginTop: 18, fontFamily: display, fontWeight: 800, fontSize: 54, lineHeight: 1.12, animationDuration: '500ms' } as CSSProperties}>
          {s.t}
        </div>
      </div>
      <div key={`n${i}`} className={A.fade} style={{ position: 'absolute', left: 120, top: 620, width: 1060, boxSizing: 'border-box', display: 'flex', gap: 14, alignItems: 'center', background: s.ok ? T.green.bg : T.coral.bg, borderRadius: 14, padding: '16px 22px', fontSize: 24, color: C.ink, animationDuration: '400ms' } as CSSProperties}>
        <Icon name={s.ok ? 'check' : 'alert'} size={30} color={s.ok ? T.green.fg : T.coral.fg} />
        {s.note}
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 730, display: 'flex', gap: 14, ...dl(200) }}>
        <Btn icon="arrow" tone="violet" size={24} onClick={() => setI((x) => (x + 1) % M3_SLOGANS.length)}>
          Suivant
        </Btn>
        <Btn icon="star" ghost tone="green" size={24} onClick={() => setKeep((k) => (k.includes(i) ? k : [...k, i].slice(-3)))}>
          Je garde
        </Btn>
        <Btn icon="reset" ghost tone="grey" size={24} onClick={() => setKeep([])} />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1240, top: 280, width: 560, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', ...dl(300) }}>
        <Eyebrow c={C.navy} size={20}>
          Mes 3 favoris
        </Eyebrow>
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 170 }}>
          {keep.length === 0 ? <div style={{ fontSize: 22, color: C.faint }}>Cliquez « Je garde »…</div> : null}
          {keep.map((x) => (
            <div key={x} className={A.left} style={{ fontSize: 24, fontWeight: 600, color: C.ink, animationDuration: '400ms' } as CSSProperties}>
              ★ {M3_SLOGANS[x].t}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, paddingTop: 16, borderTop: `1.5px solid ${C.rule}` }}>
          <Eyebrow c={C.muted} size={18}>
            Grille de choix
          </Eyebrow>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 21, color: C.soft }}>
            <span>Court · rythmé · mémorisable</span>
            <span>Porte un bénéfice ou une promesse</span>
            <span>Vrai, vérifiable, sans superlatif</span>
            <span>Disponible : recherche d’antériorité (INPI)</span>
          </div>
        </div>
      </div>
    </Frame>
  );
};

// ─── Script vidéo (storyboard) ──────────────────────────────────────────────
const M3Shot = ({ beat, t, tone, img, vo, txt }: { beat: number; t: string; tone: Tone; img: ReactNode; vo: ReactNode; txt: ReactNode }) => (
  <div className={b.on(beat)} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 360px', gap: 18, alignItems: 'center', background: C.card, borderRadius: 14, boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${STRONG[tone]}`, padding: '14px 20px 14px 26px', minHeight: 104, boxSizing: 'border-box' }}>
    <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 22, color: STRONG[tone] }}>{t}</span>
    <span style={{ fontSize: 21, lineHeight: 1.38, color: C.ink }}>{img}</span>
    <span style={{ fontSize: 21, lineHeight: 1.38, color: C.soft, fontStyle: 'italic' }}>{vo}</span>
    <span style={{ fontSize: 21, lineHeight: 1.3, fontWeight: 700, color: C.navy }}>{txt}</span>
  </div>
);

const M3_Script: Page = () => (
  <Frame mod={3} beats={4}>
    <Title>Un script vidéo de 30 secondes, prêt à tourner</Title>
    <Lede>Demandez un tableau : temps, image, voix off, texte à l’écran. Le tournage devient simple à organiser.</Lede>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 268, width: 1680, display: 'grid', gridTemplateColumns: '120px 1fr 1fr 360px', gap: 18, padding: '0 20px 0 26px', boxSizing: 'border-box', ...dl(100) }}>
      <Eyebrow c={C.muted} size={17}>Temps</Eyebrow>
      <Eyebrow c={C.muted} size={17}>Image</Eyebrow>
      <Eyebrow c={C.muted} size={17}>Voix off</Eyebrow>
      <Eyebrow c={C.muted} size={17}>Texte à l’écran</Eyebrow>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 310, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M3Shot beat={1} t="0–3 s" tone="coral" img="Gros plan : une tasse tiède oubliée sur un bureau." vo="(bruit de clavier, silence)" txt="Votre café de bureau, honnêtement ?" />
      <M3Shot beat={2} t="3–10 s" tone="yellow" img="Une équipe grimace devant la machine automatique." vo="« La pause café, c’est souvent le meilleur moment. Encore faut-il que le café suive. »" txt="" />
      <M3Shot beat={3} t="10–22 s" tone="blue" img="L’atelier de torréfaction, puis l’installation dans les locaux." vo="« Ardente torréfie à Lyon et installe tout chez vous, sans engagement. »" txt="Torréfié à Lyon · Installé en 1 semaine" />
      <M3Shot beat={4} t="22–30 s" tone="green" img="L’équipe trinque avec ses tasses ; logo Ardente." vo="« Réservez votre dégustation gratuite. »" txt="Dégustation offerte · lien en description" />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 830, width: 1680, display: 'flex', gap: 24 }}>
      <Callout title="Format court" tone="coral" icon="video" cls={A.fade} style={{ flex: 1, ...dl(400) }} size={22}>
        L’accroche se joue en 2 secondes ; sous-titres indispensables (la plupart des vidéos sont vues sans le son).
      </Callout>
      <Callout title="Droit à l’image" tone="yellow" icon="users" cls={A.fade} style={{ flex: 1, ...dl(550) }} size={22}>
        Collaborateurs ou clients filmés : autorisation écrite. Avatar ou voix de synthèse : le signaler.
      </Callout>
    </div>
  </Frame>
);

// ─── Le curseur de ton ──────────────────────────────────────────────────────
const M3_TONES = [
  { name: 'Institutionnel', tone: 'navy' as Tone, ok: false, txt: 'Ardente a le plaisir de vous présenter Ardente Bureau, une offre de café de spécialité destinée aux entreprises. Nous vous proposons une dégustation gratuite dans vos locaux.' },
  { name: 'Professionnel', tone: 'blue' as Tone, ok: true, txt: 'Ardente Bureau apporte le café de spécialité dans votre entreprise. Réservez une dégustation gratuite pour votre équipe, sans engagement.' },
  { name: 'Chaleureux · notre ton', tone: 'green' as Tone, ok: true, txt: 'Et si la meilleure réunion de la semaine se passait autour d’un bon café ? Ardente Bureau vient le faire déguster à votre équipe. C’est offert.' },
  { name: 'Décontracté', tone: 'yellow' as Tone, ok: true, txt: 'Votre café de bureau mérite mieux. On passe vous faire goûter le nôtre ? C’est offert, et on apporte les tasses.' },
  { name: 'Familier', tone: 'coral' as Tone, ok: false, txt: 'Le café du bureau, c’est vraiment pas ouf 😬 On débarque avec nos grains et on vous régale. Gratuit. Deal ? ☕🔥' },
];

const M3_Ton: Page = () => {
  const [v, setV] = useState(2);
  const t = M3_TONES[v];
  return (
    <Frame mod={3} kind="simu">
      <Title>Trouver le ton juste : un message, cinq voix</Title>
      <Lede>Faites glisser le curseur. Même information, même offre… et pourtant cinq marques différentes.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 290, width: 1680, ...dl(100) }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, fontWeight: 600, color: C.muted, marginBottom: 14 }}>
          <span>Formel</span>
          <span>Familier</span>
        </div>
        <Range value={v} onChange={setV} min={0} max={4} step={1} w={1680} tone={t.tone} />
      </div>
      <div key={v} className={A.in} style={{ position: 'absolute', left: 120, top: 400, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 22, boxShadow: `${SHADOW}, inset 8px 0 0 ${STRONG[t.tone]}`, padding: '34px 44px', animationDuration: '400ms' } as CSSProperties}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Tag tone={t.tone} size={22}>
            {t.name}
          </Tag>
          <Tag tone={t.ok ? 'green' : 'coral'} size={22}>
            <Icon name={t.ok ? 'check' : 'x'} size={20} sw={3} /> {t.ok ? 'Compatible avec la charte' : 'Hors charte Ardente'}
          </Tag>
        </div>
        <div style={{ marginTop: 22, fontSize: 38, lineHeight: 1.4, fontWeight: 500, color: C.ink }}>{t.txt}</div>
      </div>
      <PromptBox title="prompt · ton" size={21} cls={A.fade} style={{ position: 'absolute', left: 120, top: 770, width: 1680, ...dl(400) }}>
        Réécris ce texte avec le ton de notre charte : <Cs>chaleureux, expert, jamais pédant</Cs>. Voici deux exemples de notre style : [exemple 1] [exemple 2]. Garde les faits strictement identiques.
      </PromptBox>
    </Frame>
  );
};

// ─── Relire comme un éditeur (grille qualité) ───────────────────────────────
const M3_Relecture: Page = () => (
  <Frame mod={3} kind="exercice">
    <Title>Relire comme un éditeur : la grille avant publication</Title>
    <Lede>Appliquez-la au dernier texte généré. Chaque case non cochée est un risque pour la marque.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CheckItem id="rl1" w={2} size={25}>Exact : chaque fait, chiffre, date et nom est vérifié et sourcé</CheckItem>
        <CheckItem id="rl2" w={2} size={25}>Honnête : aucune promesse, allégation ou citation non validée</CheckItem>
        <CheckItem id="rl3" size={25}>Fidèle : ton, vocabulaire et valeurs conformes à la charte</CheckItem>
        <CheckItem id="rl4" size={25}>Utile : la cible comprend le bénéfice et l’action attendue</CheckItem>
        <CheckItem id="rl5" size={25}>Original : pas de formule cliché, pas de copie d’un concurrent</CheckItem>
        <CheckItem id="rl6" size={25}>Inclusif : pas de stéréotype, langage accessible à tous</CheckItem>
        <CheckItem id="rl7" size={25}>Propre : orthographe, typographie, liens et mentions légales</CheckItem>
        <CheckItem id="rl8" size={25}>Transparent : contenu réaliste généré par IA signalé si nécessaire</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={10}
          label="Prêt à publier ?"
          levels={[
            { min: 0, text: 'Brouillon : ne publiez pas.', tone: 'coral' },
            { min: 6, text: 'Presque : terminez les vérifications.', tone: 'yellow' },
            { min: 10, text: 'Prêt : publiez, c’est votre signature.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>Les deux premiers critères comptent double : ce sont eux qui engagent juridiquement la marque.</div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Atelier 2 ──────────────────────────────────────────────────────────────
const M3_Atelier: Page = () => (
  <LabPage
    mod={3}
    n="2"
    title="Transformer une idée en plusieurs contenus"
    defi="declinaison"
    who="En binôme · une idée de votre calendrier"
    minutes={25}
    objective={
      <>
        À partir d’<strong>une seule idée</strong> de votre calendrier, produire quatre contenus de formats différents, cohérents entre eux et conformes à la charte.
      </>
    }
    where={<>1 article (plan + intro) · 1 post LinkedIn · 1 email (3 objets) · 1 script vidéo de 30 s ou 3 slogans · la grille de relecture remplie</>}
    crit={
      <>
        <CheckItem id="a2c1" size={22}>Le même message clé partout</CheckItem>
        <CheckItem id="a2c2" size={22}>Les codes de chaque format respectés</CheckItem>
        <CheckItem id="a2c3" size={22}>Au moins une boucle critique → réécriture</CheckItem>
        <CheckItem id="a2c4" size={22}>Grille de relecture : 10 / 10</CheckItem>
      </>
    }
  >
    <strong>1.</strong> Collez la charte de ton en tête de conversation. <strong>2.</strong> Rédigez l’article d’abord : c’est le contenu « pivot ». <strong>3.</strong> Demandez les déclinaisons une par une, avec les codes de
    chaque format. <strong>4.</strong> Passez chaque texte à la grille de relecture.
    <Bonus>Demandez à l’IA de jouer votre persona et de réagir à chaque contenu : « Qu’est-ce qui te donnerait envie de cliquer ? »</Bonus>
  </LabPage>
);

// ─── Exemple : une idée, six contenus ───────────────────────────────────────
const M3Out = ({ icon, tone, fmt, children, d }: { icon: IconName; tone: Tone; fmt: string; children: ReactNode; d: number }) => (
  <div className={A.pop} style={{ background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 0 6px 0 ${STRONG[tone]}`, padding: '20px 22px', height: 230, boxSizing: 'border-box', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone={tone} size={46} solid />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: C.navy }}>{fmt}</span>
    </div>
    <div style={{ marginTop: 12, fontSize: 21, lineHeight: 1.42, color: C.soft }}>{children}</div>
  </div>
);

const M3_Exemple: Page = () => (
  <Frame mod={3} kind="cas">
    <Title>Exemple : une idée, six contenus</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 1680, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 20, background: G.violet, borderRadius: 18, padding: '18px 28px', color: '#fff', ...dl(100) }}>
      <Icon name="bulb" size={40} color="#fff" />
      <span style={{ fontSize: 28, fontWeight: 600 }}>L’idée : « La pause café, c’est le meilleur moment pour débloquer une réunion. »</span>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 330, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      <M3Out icon="news" tone="navy" fmt="Article" d={250}>
        « 5 façons d’en faire un rituel d’équipe » : 900 mots, FAQ, méta-description.
      </M3Out>
      <M3Out icon="linkedin" tone="blue" fmt="Post LinkedIn" d={350}>
        Accroche chiffre « 3 minutes » + anecdote + appel à la dégustation.
      </M3Out>
      <M3Out icon="insta" tone="pink" fmt="Carrousel Instagram" d={450}>
        5 slides : « Ce qui se dit vraiment à la machine à café ».
      </M3Out>
      <M3Out icon="mail" tone="teal" fmt="Email" d={550}>
        Objet : « Claire, et si votre prochaine réunion commençait par un café ? »
      </M3Out>
      <M3Out icon="video" tone="coral" fmt="Script 30 s" d={650}>
        Une réunion bloquée… qui se débloque autour d’un café Ardente.
      </M3Out>
      <M3Out icon="megaphone" tone="yellow" fmt="Slogan" d={750}>
        « La pause qui compte. » — signature de toute la campagne.
      </M3Out>
    </div>
    <Callout title="Temps passé" tone="green" icon="clock" cls={A.fade} style={{ position: 'absolute', left: 120, top: 850, width: 1680, ...dl(900) }} size={23}>
      45 minutes au total, relecture comprise, contre une demi-journée sans IA. Le message reste le même partout : c’est ça, la cohérence.
    </Callout>
  </Frame>
);

// ─── Synthèse ───────────────────────────────────────────────────────────────
const M3_Synthese: Page = () => (
  <Frame mod={3} kind="synthese">
    <Title>Ce qu’on retient du module 3</Title>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="navy" d={100}>
        Un cycle unique : <strong>brief → jet → critique → réécriture → validation</strong>.
      </SynthRow>
      <SynthRow n={2} tone="blue" d={200}>
        Chaque format a <strong>ses codes</strong> : accroche, longueur, structure, appel à l’action.
      </SynthRow>
      <SynthRow n={3} tone="violet" d={300}>
        Demandez toujours <strong>plusieurs variantes</strong> : accroches, objets, slogans.
      </SynthRow>
      <SynthRow n={4} tone="green" d={400}>
        Le ton se pilote avec <strong>la charte et des exemples</strong>, pas avec des adjectifs.
      </SynthRow>
      <SynthRow n={5} tone="coral" d={500}>
        <strong>Grille de relecture</strong> avant chaque publication : exact, honnête, fidèle.
      </SynthRow>
    </div>
    <ProjectCard mod={3}>
      Une idée de votre calendrier est déclinée en quatre contenus relus et validés. Votre slogan de campagne est choisi.
    </ProjectCard>
  </Frame>
);

// ═══ 40-m4 ═════════════════════════════════════════════════════════════

// ─── Module 4 · Images et contenus visuels ──────────────────────────────────

const M4_Section: Page = () => (
  <Section
    n={4}
    title={
      <>
        Images & contenus
        <br />
        visuels
      </>
    }
    sub="Générer des images utiles, rédiger un brief créatif, décliner un concept sur tous les supports, et produire une présentation."
    dur="13:30 – 14:20 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 3 · un concept de campagne et ses supports
      </Tag>
    }
  >
    <SecItem n={1}>Génération d’images : l’anatomie d’un prompt visuel</SecItem>
    <SecItem n={2}>Créer des visuels marketing : formats, pièges, droits</SecItem>
    <SecItem n={3}>Le brief créatif</SecItem>
    <SecItem n={4}>Décliner un concept</SecItem>
    <SecItem n={5}>Créer une présentation</SecItem>
  </Section>
);
M4_Section.transition = BLOOM;

// ─── Constructeur de prompt image ───────────────────────────────────────────
const M4_ImgPrompt: Page = () => {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const set = (id: string, v: boolean) => setOn((o) => ({ ...o, [id]: v }));
  const n = Object.values(on).filter(Boolean).length;
  const w = on.fmt ? 380 : 470;
  const h = on.fmt ? 475 : 470;
  return (
    <Frame mod={4} kind="simu">
      <Title>Génération d’images : six ingrédients, là aussi</Title>
      <Lede>Activez les ingrédients : le visuel passe d’une image de banque générique à un visuel de marque.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 560, display: 'flex', flexDirection: 'column', gap: 24, ...dl(100) }}>
        <M2Ing id="style" on={on} set={set} name="Style" q="photo, illustration, 3D…" tone="violet" />
        <M2Ing id="comp" on={on} set={set} name="Composition" q="cadrage, angle" tone="blue" />
        <M2Ing id="light" on={on} set={set} name="Lumière" q="ambiance, moment" tone="yellow" />
        <M2Ing id="pal" on={on} set={set} name="Palette" q="couleurs de marque" tone="pink" />
        <M2Ing id="fmt" on={on} set={set} name="Format" q="ratio du support" tone="teal" />
        <M2Ing id="neg" on={on} set={set} name="Exclusions" q="ce qu’on ne veut pas" tone="coral" />
        <div style={{ marginTop: 6, fontSize: 22, color: C.muted }}>
          Ingrédients actifs : <strong style={{ fontFamily: display, fontSize: 30, color: C.violet }}>{n} / 6</strong>
        </div>
      </div>
      <div className={A.pop} style={{ position: 'absolute', left: 730, top: 270, width: 480, height: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', ...dl(200) }}>
        <div style={{ position: 'relative', width: w, height: h, borderRadius: 18, overflow: 'hidden', boxShadow: SHADOW, transition: `width 400ms ${EASE}, height 400ms ${EASE}` }}>
          <CupArt w={w} h={h} bg={on.pal ? BRAND.cream : '#E4E7EC'} accent={on.style ? BRAND.coffee : '#7A8394'} cup={on.style ? '#FFFFFF' : '#F5F6F8'} bubble={!!on.comp} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 85% 10%, rgba(255,196,120,.55), rgba(255,196,120,0) 70%)', opacity: on.light ? 1 : 0, transition: 'opacity 500ms' }} />
          {on.neg ? null : (
            <div style={{ position: 'absolute', left: 16, bottom: 14, fontFamily: display, fontWeight: 800, fontSize: 22, color: 'rgba(16,24,40,.55)', letterSpacing: '0.02em' }}>CAFFÉ BEST COFEE</div>
          )}
        </div>
      </div>
      <PromptBox title="prompt-image.txt" size={20} cls={A.right} style={{ position: 'absolute', left: 1260, top: 270, width: 540, height: 600, ...dl(300) }}>
        <div style={{ color: '#fff', fontWeight: 700, marginBottom: 8 }}>Une tasse de café vue de dessus sur une table de bureau.</div>
        <M2Line show={!!on.style} tone="violet">Photographie de produit réaliste, mise au point nette sur la tasse.</M2Line>
        <M2Line show={!!on.comp} tone="blue">Vue zénithale, tasse centrée, espace libre à droite pour un texte.</M2Line>
        <M2Line show={!!on.light} tone="yellow">Lumière naturelle douce du matin, venant d’une fenêtre.</M2Line>
        <M2Line show={!!on.pal} tone="pink">Palette : crème, brun torréfié, touches de blanc.</M2Line>
        <M2Line show={!!on.fmt} tone="teal">Format vertical 4:5 pour le fil Instagram.</M2Line>
        <M2Line show={!!on.neg} tone="coral">Sans texte, sans logo, sans personne.</M2Line>
      </PromptBox>
      <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(600) }}>
        Le texte du slogan s’ajoute ensuite dans Canva ou votre outil de mise en page : l’IA écrit encore mal dans les images.
      </Hint>
    </Frame>
  );
};

// ─── Les styles visuels (cartes à retourner) ────────────────────────────────
const M4Style = ({ name, use, bg, accent, cup, bubble = false, prompt }: { name: string; use: string; bg: string; accent: string; cup: string; bubble?: boolean; prompt: string }) => (
  <FlipCard
    w={390}
    h={520}
    tone="violet"
    backTone="violet"
    flipAt={1}
    front={
      <>
        <div style={{ margin: '-6px -6px 0', borderRadius: 12, overflow: 'hidden' }}>
          <CupArt w={342} h={260} bg={bg} accent={accent} cup={cup} bubble={bubble} />
        </div>
        <div style={{ marginTop: 16, fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{name}</div>
        <div style={{ marginTop: 6, fontSize: 21, lineHeight: 1.4, color: C.soft }}>{use}</div>
      </>
    }
    back={
      <>
        <Eyebrow c={T.violet.fg} size={18}>
          Mots-clés de style
        </Eyebrow>
        <div style={{ marginTop: 12, fontFamily: mono, fontSize: 20, lineHeight: 1.55, color: C.ink }}>{prompt}</div>
      </>
    }
  />
);

const M4_Styles: Page = () => (
  <Frame mod={4} beats={1}>
    <Title>Quatre familles de styles pour la même tasse</Title>
    <Lede>Le style se décide comme une ligne éditoriale : un ou deux, pas dix. Retournez les cartes pour les mots-clés.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, display: 'flex', gap: 40, ...dl(100) }}>
      <M4Style name="Photo produit" use="E-shop, publicité, fiches produit." bg="#EFE6DA" accent={BRAND.coffee} cup="#FFFFFF" prompt="photographie produit, lumière studio douce, fond uni, mise au point nette, réaliste" />
      <M4Style name="Illustration plate" use="Infographies, carrousels, newsletters." bg="#E6F0FC" accent={C.blue} cup="#FFFFFF" bubble prompt="illustration vectorielle plate, aplats de couleur, formes simples, sans dégradé" />
      <M4Style name="Rendu 3D doux" use="Lancement, bannières, visuels « tech »." bg="#EFE9FC" accent={C.violet} cup="#F7F3FF" prompt="rendu 3D, matières mates, ombres douces, couleurs pastel, style argile" />
      <M4Style name="Aquarelle" use="Storytelling, producteurs, saisonnalité." bg="#E2F6EE" accent={C.teal} cup="#FBFFFD" prompt="aquarelle, papier texturé, bords irréguliers, couleurs naturelles, touche artisanale" />
    </div>
    <Callout title="Droits" tone="coral" icon="scale" cls={A.fade} style={{ position: 'absolute', left: 120, top: 840, width: 1680, ...dl(600) }} size={22}>
      Décrivez un style avec des mots ; n’écrivez pas « à la manière de » un illustrateur vivant ou d’une marque.
    </Callout>
  </Frame>
);

// ─── Les formats ────────────────────────────────────────────────────────────
const M4Fmt = ({ beat, w, h, ratio, use, tone }: { beat: number; w: number; h: number; ratio: string; use: string; tone: Tone }) => (
  <div className={b.pop(beat)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, ...vars({ o: 'bottom' }) }}>
    <div style={{ width: w, height: h, borderRadius: 12, background: T[tone].bg, boxShadow: `inset 0 0 0 3px ${STRONG[tone]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontWeight: 800, fontSize: 30, color: T[tone].fg }}>
      {ratio}
    </div>
    <div style={{ fontSize: 20, lineHeight: 1.35, color: C.soft, textAlign: 'center', width: Math.max(w, 200) }}>{use}</div>
  </div>
);

const M4_Formats: Page = () => (
  <Frame mod={4} beats={6}>
    <Title>Visuels marketing : le bon format pour chaque support</Title>
    <Lede>Indiquez le ratio dans le prompt : recadrer après coup coupe souvent l’essentiel.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, height: 480, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
      <M4Fmt beat={1} w={240} h={240} ratio="1:1" use="Post carré · 1080 × 1080" tone="blue" />
      <M4Fmt beat={2} w={220} h={275} ratio="4:5" use="Fil Instagram, LinkedIn mobile · 1080 × 1350" tone="pink" />
      <M4Fmt beat={3} w={190} h={338} ratio="9:16" use="Story, Reel, TikTok · 1080 × 1920" tone="coral" />
      <M4Fmt beat={4} w={360} h={203} ratio="16:9" use="Vidéo, présentation · 1920 × 1080" tone="violet" />
      <M4Fmt beat={5} w={300} h={157} ratio="1,91:1" use="Lien partagé, annonce · 1200 × 628" tone="teal" />
      <M4Fmt beat={6} w={300} h={75} ratio="4:1" use="Bannière LinkedIn · 1584 × 396" tone="navy" />
    </div>
    <Callout title="Astuce" tone="blue" icon="layers" cls={b.on(6)} style={{ position: 'absolute', left: 120, top: 830, width: 1680 }} size={23}>
      Générez le visuel principal en 1:1 avec de l’espace autour du sujet, puis utilisez l’<strong>extension d’image</strong> (Canva, Firefly, Photoshop) pour les autres ratios.
    </Callout>
  </Frame>
);

// ─── Pièges d’une image générée (hotspots) ──────────────────────────────────
const M4_Pieges: Page = () => (
  <Frame mod={4} kind="exercice">
    <Title>Ce visuel est-il publiable ? Six points de contrôle</Title>
    <Lede>Cherchez d’abord, puis cliquez les pastilles une à une (re-cliquez pour refermer).</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 960, height: 600, ...dl(100) }}>
      <svg width={960} height={600} viewBox="0 0 960 600" style={{ display: 'block', borderRadius: 22, boxShadow: SHADOW }} aria-hidden>
        <rect width={960} height={600} fill="#EFE3D3" />
        <rect y={430} width={960} height={170} fill="#C9A27E" />
        <rect x={60} y={60} width={360} height={110} rx={12} fill="#3A2216" />
        <text x={240} y={128} textAnchor="middle" style={{ fontFamily: display, fontWeight: 800, fontSize: 40, fill: '#F7EDE1' }}>
          CAFÉ ARDNETE
        </text>
        <circle cx={790} cy={120} r={62} fill="#0E7A55" />
        <circle cx={790} cy={120} r={44} fill="none" stroke="#fff" strokeWidth={6} />
        <text x={790} y={132} textAnchor="middle" style={{ fontFamily: display, fontWeight: 800, fontSize: 30, fill: '#fff' }}>
          ★
        </text>
        <ellipse cx={480} cy={430} rx={150} ry={30} fill="#00000022" />
        <path d="M 370 300 h 220 v 100 a 50 50 0 0 1 -50 50 h -120 a 50 50 0 0 1 -50 -50 z" fill="#fff" />
        <path d="M 590 320 a 40 40 0 0 1 0 70" fill="none" stroke="#fff" strokeWidth={16} />
        <ellipse cx={480} cy={300} rx={110} ry={18} fill={BRAND.coffee} />
        <g fill="#E8B894">
          <rect x={150} y={360} width={110} height={70} rx={30} />
          <rect x={150} y={318} width={16} height={56} rx={8} />
          <rect x={170} y={306} width={16} height={64} rx={8} />
          <rect x={190} y={302} width={16} height={66} rx={8} />
          <rect x={210} y={306} width={16} height={64} rx={8} />
          <rect x={230} y={314} width={16} height={58} rx={8} />
          <rect x={250} y={326} width={16} height={50} rx={8} />
        </g>
        <g fill="#5B6B86">
          <circle cx={720} cy={300} r={26} />
          <rect x={690} y={330} width={60} height={100} rx={20} />
          <circle cx={800} cy={300} r={26} />
          <rect x={770} y={330} width={60} height={100} rx={20} />
          <circle cx={880} cy={300} r={26} />
          <rect x={850} y={330} width={60} height={100} rx={20} />
        </g>
        <text x={480} y={560} textAnchor="middle" style={{ fontFamily: body, fontSize: 24, fill: '#3A2216' }}>
          Le meilleur café du monde, garanti 100 % bio
        </text>
      </svg>
      <Hotspot n={1} x={240} y={115} title="Texte déformé" side="right" w={400}>
        « ARDNETE » : l’IA écrit mal. Le nom de marque s’ajoute toujours en mise en page.
      </Hotspot>
      <Hotspot n={2} x={790} y={120} title="Logo ressemblant" side="left" w={400}>
        Un rond vert avec une étoile : trop proche d’une marque connue. Risque de contrefaçon.
      </Hotspot>
      <Hotspot n={3} x={205} y={300} title="Six doigts" side="right" w={380}>
        Mains, dents, reflets : les détails anatomiques restent un point faible. Zoomez toujours.
      </Hotspot>
      <Hotspot n={4} x={800} y={380} title="Équipe uniforme" side="left" w={420}>
        Tous identiques : manque de diversité. Précisez âges, genres, styles variés et réalistes.
      </Hotspot>
      <Hotspot n={5} x={480} y={555} title="Allégations" side="left" w={400}>
        « Meilleur du monde », « 100 % bio » : interdit sans preuve ni certification.
      </Hotspot>
      <Hotspot n={6} x={480} y={350} title="Produit inexact" side="right" w={400}>
        Ce n’est pas la vraie tasse Ardente : pour le produit réel, partez d’une vraie photo.
      </Hotspot>
    </div>
    <div style={{ position: 'absolute', left: 1140, top: 270, width: 660, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="green" icon="checkCircle" title="La check-list visuelle" cls={A.right} style={dl(300)} size={22}>
        Texte · logos · mains et visages · diversité · allégations · fidélité au produit réel · cohérence avec la charte graphique.
      </Card>
      <Card tone="violet" icon="sparkles" title="Transparence" cls={A.right} style={dl(450)} size={22}>
        Image réaliste de personnes ou de lieux ? Mention « image générée par IA ».
      </Card>
      <Card tone="blue" icon="camera" title="Produit réel = vraie photo" cls={A.right} style={dl(600)} size={22}>
        L’IA peut créer le décor autour d’une photo réelle du produit (retouche, extension de fond).
      </Card>
    </div>
  </Frame>
);

// ─── Le brief créatif ───────────────────────────────────────────────────────
const M4Field = ({ beat, n, label, children }: { beat: number; n: number; label: string; children: ReactNode }) => (
  <div className={b.on(beat)} style={{ display: 'grid', gridTemplateColumns: '48px 220px 1fr', gap: 16, alignItems: 'center', background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '10px 18px', minHeight: 66, boxSizing: 'border-box' }}>
    <Num n={n} tone="pink" size={38} />
    <span style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>{label}</span>
    <span style={{ fontSize: 21, lineHeight: 1.35, color: C.soft }}>{children}</span>
  </div>
);

const M4_Brief: Page = () => (
  <Frame mod={4} beats={8}>
    <Title>Le brief créatif : une page, huit rubriques</Title>
    <Lede>Que vous briefiez une agence, un graphiste ou une IA, c’est le même document. L’IA peut le rédiger avec vous.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 9 }}>
      <M4Field beat={1} n={1} label="Contexte">Ardente lance une offre B2B : le café de spécialité en entreprise.</M4Field>
      <M4Field beat={2} n={2} label="Objectif">150 demandes de dégustation en novembre.</M4Field>
      <M4Field beat={3} n={3} label="Cible">Office managers et RH de PME lyonnaises (persona Claire).</M4Field>
      <M4Field beat={4} n={4} label="Message clé">Le bon café rapproche les équipes, sans aucune contrainte.</M4Field>
      <M4Field beat={5} n={5} label="Ton & style">Chaleureux, artisanal, lumineux. Photo réelle + touches illustrées.</M4Field>
      <M4Field beat={6} n={6} label="Livrables">Post LinkedIn 4:5, story 9:16, bannière web, affiche A4, 6 slides.</M4Field>
      <M4Field beat={7} n={7} label="Contraintes">Charte (crème, brun, typo), logo réel, aucune allégation « bio » ou « vert ».</M4Field>
      <M4Field beat={8} n={8} label="Délais & budget">Validation le 25/10 · mise en ligne le 4/11 · 1 500 € de diffusion.</M4Field>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PromptBox title="prompt · brief" size={19} cls={A.right} style={dl(200)}>
        À partir de notre échange, rédige un <Cf>brief créatif</Cf> d’une page en 8 rubriques : contexte, objectif chiffré, cible, message clé, ton et style, livrables avec formats, contraintes, délais.
        {'\n\n'}Puis liste les <Cn>questions encore ouvertes</Cn> que je dois trancher.
      </PromptBox>
      <Callout title="Le piège" tone="coral" icon="alert" cls={A.right} style={dl(400)} size={22}>
        Un objectif flou (« faire connaître ») donne des visuels flous. Chiffrez-le.
      </Callout>
    </div>
  </Frame>
);

// ─── Décliner un concept ────────────────────────────────────────────────────
const M4Slogan = ({ size, color = BRAND.dark }: { size: number; color?: string }) => (
  <div style={{ fontFamily: display, fontWeight: 800, fontSize: size, lineHeight: 1.05, color }}>La pause qui compte.</div>
);

const M4_Concept: Page = () => (
  <Frame mod={4} beats={4}>
    <Title>Décliner un concept : « La pause qui compte. »</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 400, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 26px', ...dl(100) }}>
      <Eyebrow c={C.navy} size={19}>
        Le concept
      </Eyebrow>
      <div style={{ marginTop: 10, fontSize: 22, lineHeight: 1.45, color: C.soft }}>Une tasse vue de dessus, une bulle de dialogue dans la mousse : le café qui fait parler.</div>
      <Eyebrow c={C.navy} size={19} style={{ marginTop: 20 }}>
        Palette
      </Eyebrow>
      <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
        <span style={{ width: 56, height: 56, borderRadius: 12, background: BRAND.cream, boxShadow: `inset 0 0 0 1.5px ${C.rule}` }} />
        <span style={{ width: 56, height: 56, borderRadius: 12, background: BRAND.coffee }} />
        <span style={{ width: 56, height: 56, borderRadius: 12, background: BRAND.dark }} />
        <span style={{ width: 56, height: 56, borderRadius: 12, background: '#F2A20C' }} />
      </div>
      <Eyebrow c={C.navy} size={19} style={{ marginTop: 20 }}>
        Constantes
      </Eyebrow>
      <div style={{ marginTop: 10, fontSize: 21, lineHeight: 1.5, color: C.soft }}>
        Même motif · même slogan · même typo · logo réel en bas à droite
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 570, top: 190, width: 400, height: 500, borderRadius: 18, overflow: 'hidden', boxShadow: SHADOW }}>
      <CupArt w={400} h={500} bubble />
      <div style={{ position: 'absolute', left: 24, top: 24 }}>
        <M4Slogan size={40} />
      </div>
      <Tag tone="blue" size={18} style={{ position: 'absolute', left: 20, bottom: 18 }}>
        Post LinkedIn 4:5
      </Tag>
    </div>
    <Phone w={250} cls={b.on(2)} style={{ position: 'absolute', left: 1010, top: 190 }}>
      <div style={{ position: 'relative', height: '100%', background: BRAND.dark }}>
        <CupArt w={226} h={280} bg={BRAND.dark} cup="#F7EDE1" bubble style={{ position: 'absolute', top: 60 }} />
        <div style={{ position: 'absolute', left: 16, top: 360, right: 12 }}>
          <M4Slogan size={28} color={BRAND.cream} />
          <div style={{ marginTop: 14, display: 'inline-block', background: '#F2A20C', color: BRAND.dark, fontWeight: 700, fontSize: 15, borderRadius: 99, padding: '6px 14px' }}>Dégustation offerte ↑</div>
        </div>
      </div>
    </Phone>
    <div className={b.on(3)} style={{ position: 'absolute', left: 1300, top: 190, width: 500, height: 210, borderRadius: 16, overflow: 'hidden', boxShadow: SHADOW, background: BRAND.cream }}>
      <CupArt w={210} h={210} bubble style={{ position: 'absolute', right: 0, top: 0 }} />
      <div style={{ position: 'absolute', left: 24, top: 40, width: 270 }}>
        <M4Slogan size={32} />
        <div style={{ marginTop: 10, fontSize: 17, color: BRAND.dark }}>Le café de spécialité, au bureau.</div>
      </div>
      <Tag tone="teal" size={17} style={{ position: 'absolute', left: 20, bottom: 12 }}>
        Bannière web
      </Tag>
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 1300, top: 430, width: 260, height: 368, borderRadius: 10, overflow: 'hidden', boxShadow: SHADOW, background: BRAND.coffee }}>
      <CupArt w={260} h={220} bg={BRAND.coffee} cup={BRAND.cream} accent={BRAND.dark} bubble />
      <div style={{ padding: '10px 18px' }}>
        <M4Slogan size={27} color={BRAND.cream} />
        <div style={{ marginTop: 8, fontSize: 14, color: BRAND.cream }}>Scannez pour réserver votre dégustation</div>
      </div>
    </div>
    <Tag tone="navy" size={17} cls={b.fade(4)} style={{ position: 'absolute', left: 1590, top: 440 }}>
      Affiche A4
    </Tag>
    <Callout title="Le prompt de déclinaison" tone="pink" icon="layers" cls={A.fade} style={{ position: 'absolute', left: 120, top: 830, width: 1680, ...dl(600) }} size={22}>
      « Garde exactement le même sujet, la même palette et le même style. Adapte uniquement la composition au format 9:16, en laissant le tiers bas libre pour le texte. »
    </Callout>
  </Frame>
);

// ─── Créer une présentation ─────────────────────────────────────────────────
const M4Thumb = ({ n, title, tone, beat }: { n: number; title: string; tone: Tone; beat: number }) => (
  <div className={b.pop(beat)} style={{ width: '100%', height: 214, boxSizing: 'border-box', background: C.card, borderRadius: 12, boxShadow: `${SHADOW_SM}, inset 0 5px 0 ${STRONG[tone]}`, padding: '18px 20px', display: 'flex', flexDirection: 'column' }}>
    <span style={{ fontFamily: mono, fontSize: 16, color: C.muted }}>{pad(n)}</span>
    <span style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 23, lineHeight: 1.2, color: C.navy }}>{title}</span>
    <div style={{ marginTop: 'auto', display: 'flex', gap: 6 }}>
      <span style={{ width: 90, height: 8, borderRadius: 4, background: T[tone].bd }} />
      <span style={{ width: 60, height: 8, borderRadius: 4, background: C.panel }} />
    </div>
  </div>
);

const M4_Presentation: Page = () => (
  <Frame mod={4} beats={6}>
    <Title>Une présentation : le fond par l’IA, la forme par vous</Title>
    <PromptBox title="prompt · présentation commerciale" size={19} cls={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 560, ...dl(100) }}>
      Construis une présentation commerciale de <Cf>6 slides</Cf> pour proposer Ardente Bureau à une DRH.
      {'\n\n'}Pour chaque slide : un titre-message (une phrase qui affirme), 3 points maximum, un visuel suggéré, et les notes de l’orateur.
      {'\n\n'}Dernière slide : une proposition d’action concrète.
    </PromptBox>
    <div style={{ position: 'absolute', left: 740, top: 190, display: 'grid', gridTemplateColumns: 'repeat(3, 340px)', gap: 20 }}>
      <M4Thumb n={1} beat={1} tone="navy" title="Vos équipes reviennent au bureau : donnons-leur une raison" />
      <M4Thumb n={2} beat={2} tone="coral" title="Le café actuel coûte cher… en motivation" />
      <M4Thumb n={3} beat={3} tone="blue" title="Ardente Bureau : installé en une semaine" />
      <M4Thumb n={4} beat={4} tone="green" title="Ce qu’en disent nos clients" />
      <M4Thumb n={5} beat={5} tone="yellow" title="Un tarif clair, sans engagement" />
      <M4Thumb n={6} beat={6} tone="violet" title="Proposition : une dégustation le 18 novembre" />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 700, width: 1680, display: 'flex', gap: 24 }}>
      <Card tone="blue" icon="type" title="Titres-messages" cls={A.fade} style={{ flex: 1, ...dl(400) }} size={22}>
        Lire les titres seuls doit raconter toute l’histoire.
      </Card>
      <Card tone="violet" icon="slides" title="Outils" cls={A.fade} style={{ flex: 1, ...dl(500) }} size={22}>
        Gamma, Copilot dans PowerPoint, Canva : un premier jet en 5 minutes.
      </Card>
      <Card tone="coral" icon="palette" title="Toujours reprendre" cls={A.fade} style={{ flex: 1, ...dl(600) }} size={22}>
        Modèle de l’entreprise, vrais chiffres, vrais témoignages.
      </Card>
    </div>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M4_Qcm: Page = () => (
  <QcmPage
    mod={4}
    n={2}
    title="Visuels générés"
    q="Vous voulez montrer la vraie tasse Ardente dans un décor de bureau. Quelle est la meilleure approche ?"
    explain="Le produit réel se photographie ; l’IA excelle pour le décor, l’extension de fond et les variantes. On garde la fidélité au produit et on mentionne l’usage de l’IA si le rendu est réaliste."
  >
    <Opt why="L’IA va inventer une tasse « plausible » : le client recevra un produit différent de l’image. Pratique trompeuse.">Je décris la tasse et je laisse l’IA la générer</Opt>
    <Opt ok why="Exact : produit réel + décor généré. Fidélité garantie, et l’IA fait ce qu’elle fait de mieux.">
      Je pars d’une vraie photo et l’IA génère le décor autour
    </Opt>
    <Opt why="Ce sont des créations protégées : on ne réutilise pas le visuel d’un autre, même retouché.">Je reprends le visuel d’un concurrent et je change le logo</Opt>
    <Opt why="Une banque d’images montre une tasse générique : pas votre produit, et aucun lien avec la marque.">J’achète une photo de tasse en banque d’images</Opt>
  </QcmPage>
);

// ─── Atelier 3 ──────────────────────────────────────────────────────────────
const M4_Atelier: Page = () => (
  <LabPage
    mod={4}
    n="3"
    title="Un concept de campagne et ses supports"
    defi="campagne"
    who="En binôme · campagne de lancement"
    minutes={25}
    objective={
      <>
        Imaginer un <strong>concept de campagne</strong>, rédiger son brief créatif et produire au moins <strong>trois visuels cohérents</strong> sur des formats différents.
      </>
    }
    where={<>1 concept (phrase + motif + palette) · 1 brief créatif en 8 rubriques · 3 visuels déclinés (post, story, bannière ou affiche) · le plan de 6 slides</>}
    crit={
      <>
        <CheckItem id="a3c1" size={22}>Le concept tient en une phrase</CheckItem>
        <CheckItem id="a3c2" size={22}>Les visuels sont reconnaissables comme une même campagne</CheckItem>
        <CheckItem id="a3c3" size={22}>Check-list visuelle passée (texte, logo, mains…)</CheckItem>
        <CheckItem id="a3c4" size={22}>Les formats correspondent aux supports</CheckItem>
      </>
    }
  >
    <strong>1.</strong> Demandez 10 concepts à partir de votre slogan, gardez-en un. <strong>2.</strong> Faites rédiger le brief créatif. <strong>3.</strong> Générez le visuel principal avec les 6 ingrédients.{' '}
    <strong>4.</strong> Déclinez-le en conservant sujet, palette et style. <strong>5.</strong> Ajoutez slogan et logo dans votre outil de mise en page.
    <Bonus>Générez le plan de 6 slides de la présentation commerciale associée.</Bonus>
  </LabPage>
);

// ─── Synthèse ───────────────────────────────────────────────────────────────
const M4_Synthese: Page = () => (
  <Frame mod={4} kind="synthese">
    <Title>Ce qu’on retient du module 4</Title>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="violet" d={100}>
        Prompt image : <strong>sujet, style, composition, lumière, palette, format, exclusions</strong>.
      </SynthRow>
      <SynthRow n={2} tone="pink" d={200}>
        Le <strong>texte et le logo</strong> s’ajoutent en mise en page, pas dans la génération.
      </SynthRow>
      <SynthRow n={3} tone="coral" d={300}>
        Avant publication : <strong>texte, logos, mains, diversité, allégations, produit réel</strong>.
      </SynthRow>
      <SynthRow n={4} tone="blue" d={400}>
        Un <strong>brief créatif</strong> en 8 rubriques, avec un objectif chiffré.
      </SynthRow>
      <SynthRow n={5} tone="green" d={500}>
        Décliner = <strong>garder les constantes</strong>, adapter seulement la composition.
      </SynthRow>
    </div>
    <ProjectCard mod={4}>
      Votre campagne a un concept, un brief créatif et des visuels déclinés sur plusieurs formats. Il reste à adapter les messages à chaque canal et chaque public.
    </ProjectCard>
  </Frame>
);

// ═══ 50-m5 ═════════════════════════════════════════════════════════════

// ─── Module 5 · Personnalisation et adaptation des contenus ─────────────────

const M5_Section: Page = () => (
  <Section
    n={5}
    title={
      <>
        Personnalisation
        <br />& adaptation
      </>
    }
    sub="À partir d’un même contenu : LinkedIn, Instagram, newsletter, email, article, présentation commerciale. Et un message juste pour chaque public."
    dur="14:20 – 15:10 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 4 · une campagne multicanale
      </Tag>
    }
  >
    <SecItem n={1}>Un message, six canaux : ce qui change, ce qui reste</SecItem>
    <SecItem n={2}>Adapter au public : persona et étape du parcours</SecItem>
    <SecItem n={3}>Personnaliser à grande échelle, sans risque</SecItem>
    <SecItem n={4}>Ajuster la longueur et le format</SecItem>
    <SecItem n={5}>Le prompt maître de déclinaison</SecItem>
  </Section>
);
M5_Section.transition = BLOOM;

// ─── Un message, six canaux (onglets) ───────────────────────────────────────
const M5Why = ({ children }: { children: ReactNode }) => (
  <div style={{ width: 640, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 26px' }}>
    <Eyebrow c={C.navy} size={19}>
      Ce qui change ici
    </Eyebrow>
    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
  </div>
);
const M5Pane = ({ mock, children }: { mock: ReactNode; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
    <div style={{ width: 1000, flex: 'none' }}>{mock}</div>
    <M5Why>{children}</M5Why>
  </div>
);
const M5Doc = ({ head, children }: { head: ReactNode; children: ReactNode }) => (
  <div style={{ width: 1000, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, overflow: 'hidden' }}>
    <div style={{ padding: '14px 24px', background: C.panel, fontSize: 19, color: C.muted, lineHeight: 1.5 }}>{head}</div>
    <div style={{ padding: '20px 28px', fontSize: 23, lineHeight: 1.5, color: C.ink }}>{children}</div>
  </div>
);

const M5_Canaux: Page = () => (
  <Frame mod={5} kind="demo">
    <Title>Un message, six canaux</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 172, width: 1680, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 16, background: T.violet.bg, borderRadius: 14, padding: '12px 22px', fontSize: 23, color: C.ink }}>
      <Icon name="bulb" size={28} color={T.violet.fg} />
      <span>
        <strong>Message pivot :</strong> Ardente Bureau installe le café de spécialité dans votre entreprise ; dégustation offerte en novembre.
      </span>
    </div>
    <Tabs initial="li">
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 250, display: 'flex', gap: 10, ...dl(100) }}>
        <TabBtn id="li" icon="linkedin" tone="blue">
          LinkedIn
        </TabBtn>
        <TabBtn id="ig" icon="insta" tone="pink">
          Instagram
        </TabBtn>
        <TabBtn id="nl" icon="news" tone="teal">
          Newsletter
        </TabBtn>
        <TabBtn id="em" icon="mail" tone="green">
          Email direct
        </TabBtn>
        <TabBtn id="ar" icon="doc" tone="navy">
          Article
        </TabBtn>
        <TabBtn id="pc" icon="slides" tone="violet">
          Présentation commerciale
        </TabBtn>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 330, width: 1680 }}>
        <TabPane id="li">
          <M5Pane
            mock={
              <SocialPost w={1000} size={23}>
                <strong>Votre machine à café fait-elle fuir vos équipes ?</strong>
                {'\n'}On l’entend souvent chez les office managers lyonnais. Alors on a créé Ardente Bureau : un café de spécialité torréfié à Lyon, installé chez vous en une semaine, sans engagement.
                {'\n'}→ En novembre, on vient le faire déguster à votre équipe. C’est offert.{'\n'}
                <span style={{ color: C.blue }}>#QVT #Lyon #CaféDeSpécialité</span>
              </SocialPost>
            }
          >
            <Bullet size={22} tone="blue">Accroche en question, visible avant « voir plus »</Bullet>
            <Bullet size={22} tone="blue">Angle professionnel : le problème de la cible</Bullet>
            <Bullet size={22} tone="blue">120 à 150 mots, 3 hashtags</Bullet>
            <Bullet size={22} tone="blue">KPI : commentaires, clics, demandes</Bullet>
          </M5Pane>
        </TabPane>
        <TabPane id="ig">
          <M5Pane
            mock={
              <div style={{ display: 'flex', gap: 30 }}>
                <Phone w={270}>
                  <div style={{ position: 'relative', height: '100%', background: BRAND.dark }}>
                    <CupArt w={251} h={330} bg={BRAND.dark} cup="#F7EDE1" bubble style={{ position: 'absolute', top: 60 }} />
                    <div style={{ position: 'absolute', left: 16, top: 410, right: 12, fontFamily: display, fontWeight: 800, fontSize: 30, color: BRAND.cream }}>La pause qui compte.</div>
                    <div style={{ position: 'absolute', left: 16, bottom: 30, background: '#fff', color: C.ink, borderRadius: 12, padding: '8px 14px', fontSize: 15, fontWeight: 700 }}>
                      Sondage : votre café du bureau ? 😍 / 😬
                    </div>
                  </div>
                </Phone>
                <div style={{ flex: 1, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 26px', fontSize: 23, lineHeight: 1.5, color: C.ink, alignSelf: 'flex-start' }}>
                  <Eyebrow c={T.pink.fg} size={18}>
                    Légende du post associé
                  </Eyebrow>
                  <div style={{ marginTop: 10 }}>
                    Le lundi matin, il y a ceux qui foncent à la machine… et ceux qui la fuient 😅 Ardente Bureau arrive dans les entreprises lyonnaises ☕
                    <br />
                    Taguez la personne qui gère le café chez vous 👇
                  </div>
                </div>
              </div>
            }
          >
            <Bullet size={22} tone="pink">Le visuel porte le message, le texte le complète</Bullet>
            <Bullet size={22} tone="pink">Ton plus léger, emojis mesurés</Bullet>
            <Bullet size={22} tone="pink">Interaction : sondage, tag, question</Bullet>
            <Bullet size={22} tone="pink">KPI : partages, enregistrements, réponses</Bullet>
          </M5Pane>
        </TabPane>
        <TabPane id="nl">
          <M5Pane
            mock={
              <M5Doc
                head={
                  <>
                    <strong style={{ color: C.ink }}>Objet :</strong> La pause qui compte arrive au bureau · <strong style={{ color: C.ink }}>Pré-en-tête :</strong> dégustation offerte en novembre
                  </>
                }
              >
                Bonjour Claire,
                <br />
                Dix heures, la machine du bureau vous fait encore grimacer ? Ce mois-ci, nous lançons <strong>Ardente Bureau</strong> : nos cafés torréfiés à Lyon, installés chez vous en une semaine, sans engagement.
                <br />
                <span style={{ display: 'inline-block', marginTop: 12, background: C.green, color: '#fff', fontWeight: 700, borderRadius: 8, padding: '6px 18px' }}>Réserver ma dégustation</span>
              </M5Doc>
            }
          >
            <Bullet size={22} tone="teal">Lecteurs déjà abonnés : ton complice</Bullet>
            <Bullet size={22} tone="teal">Objet + pré-en-tête travaillés ensemble</Bullet>
            <Bullet size={22} tone="teal">Personnalisation par prénom</Bullet>
            <Bullet size={22} tone="teal">KPI : ouverture, clic, réservation</Bullet>
          </M5Pane>
        </TabPane>
        <TabPane id="em">
          <M5Pane
            mock={
              <M5Doc
                head={
                  <>
                    <strong style={{ color: C.ink }}>À :</strong> Nadia R., DRH · <strong style={{ color: C.ink }}>Objet :</strong> Café sur vos trois sites : une idée pour la QVCT
                  </>
                }
              >
                Bonjour Nadia,
                <br />
                Vous préparez votre plan QVCT 2027 : nous accompagnons des entreprises multi-sites avec un café de spécialité et <strong>un interlocuteur unique</strong> pour tous les sites. Seriez-vous disponible 15 minutes la semaine prochaine
                pour en parler, ou pour organiser une dégustation sur l’un de vos sites ?
                <br />
                Bien à vous, Léa — Ardente
              </M5Doc>
            }
          >
            <Bullet size={22} tone="green">Un destinataire, un contexte précis</Bullet>
            <Bullet size={22} tone="green">Court : 80 mots, aucune image</Bullet>
            <Bullet size={22} tone="green">Une seule question fermée à la fin</Bullet>
            <Bullet size={22} tone="green">KPI : taux de réponse, rendez-vous</Bullet>
          </M5Pane>
        </TabPane>
        <TabPane id="ar">
          <M5Pane
            mock={
              <M5Doc head="ardente · blog · Qualité de vie au travail · 6 min de lecture">
                <div style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: C.navy, lineHeight: 1.2 }}>Café au bureau : 5 critères pour choisir une solution qui plaît vraiment aux équipes</div>
                <div style={{ marginTop: 12, color: C.soft }}>
                  Qualité, entretien, budget, impact, simplicité : le guide pour comparer les offres de café en entreprise… et pourquoi la dégustation reste le meilleur test.
                </div>
              </M5Doc>
            }
          >
            <Bullet size={22} tone="navy">Utile avant d’être commercial</Bullet>
            <Bullet size={22} tone="navy">Titre construit sur une requête réelle</Bullet>
            <Bullet size={22} tone="navy">L’offre arrive en conclusion</Bullet>
            <Bullet size={22} tone="navy">KPI : trafic organique, temps de lecture</Bullet>
          </M5Pane>
        </TabPane>
        <TabPane id="pc">
          <M5Pane
            mock={
              <div style={{ width: 1000, height: 450, boxSizing: 'border-box', background: G.navy, borderRadius: 18, boxShadow: SHADOW, padding: '40px 48px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                <CupArt w={300} h={300} bg="transparent" cup="#F7EDE1" accent={BRAND.coffee} bubble style={{ position: 'absolute', right: 30, top: 70 }} />
                <Eyebrow c="#C9B6FF" size={18}>
                  Slide 3 / 6
                </Eyebrow>
                <div style={{ marginTop: 14, width: 580, fontFamily: display, fontWeight: 800, fontSize: 40, lineHeight: 1.15 }}>Ardente Bureau : installé en une semaine, sans engagement</div>
                <div style={{ marginTop: 22, width: 580, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 23, color: '#DCE3FB' }}>
                  <span>• Machine et cafés fournis, entretien inclus</span>
                  <span>• Un café du mois choisi par vos équipes</span>
                  <span>• Résiliable à tout moment</span>
                </div>
              </div>
            }
          >
            <Bullet size={22} tone="violet">Un titre-message par slide</Bullet>
            <Bullet size={22} tone="violet">Trois points maximum, des faits</Bullet>
            <Bullet size={22} tone="violet">Adaptée au décideur rencontré</Bullet>
            <Bullet size={22} tone="violet">KPI : signature, prochaine étape</Bullet>
          </M5Pane>
        </TabPane>
      </div>
    </Tabs>
  </Frame>
);

// ─── Les codes par canal (tableau) ──────────────────────────────────────────
const M5Row = ({ beat, icon, tone, ch, len, ton, form, cta }: { beat: number; icon: IconName; tone: Tone; ch: string; len: string; ton: string; form: string; cta: string }) => (
  <div className={beat ? b.left(beat) : undefined} style={{ display: 'grid', gridTemplateColumns: '300px 230px 270px 1fr 300px', gap: 16, alignItems: 'center', padding: '12px 22px', background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, fontSize: 21, lineHeight: 1.35, color: C.soft }}>
    <span style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 23, fontWeight: 700, color: C.ink }}>
      <IconTile name={icon} tone={tone} size={42} solid /> {ch}
    </span>
    <span>{len}</span>
    <span>{ton}</span>
    <span>{form}</span>
    <span>{cta}</span>
  </div>
);

const M5_Codes: Page = () => (
  <Frame mod={5} beats={6}>
    <Title>La grille des codes par canal, à coller dans vos prompts</Title>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 196, width: 1680, display: 'grid', gridTemplateColumns: '300px 230px 270px 1fr 300px', gap: 16, padding: '0 22px', boxSizing: 'border-box' }}>
      <Eyebrow c={C.muted} size={17}>Canal</Eyebrow>
      <Eyebrow c={C.muted} size={17}>Longueur</Eyebrow>
      <Eyebrow c={C.muted} size={17}>Ton</Eyebrow>
      <Eyebrow c={C.muted} size={17}>Forme</Eyebrow>
      <Eyebrow c={C.muted} size={17}>Appel à l’action</Eyebrow>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 236, width: 1680, display: 'flex', flexDirection: 'column', gap: 11 }}>
      <M5Row beat={1} icon="linkedin" tone="blue" ch="LinkedIn" len="120–200 mots" ton="Expert, incarné" form="Accroche, lignes courtes, une preuve" cta="Commenter, demander" />
      <M5Row beat={2} icon="insta" tone="pink" ch="Instagram" len="30–80 mots" ton="Léger, visuel" form="Image d’abord, question, hashtags de niche" cta="Taguer, enregistrer" />
      <M5Row beat={3} icon="news" tone="teal" ch="Newsletter" len="150–300 mots" ton="Complice" form="Objet + pré-en-tête, 1 idée, 1 bouton" cta="Un seul clic" />
      <M5Row beat={4} icon="mail" tone="green" ch="Email direct" len="60–100 mots" ton="Personnel, sobre" form="Contexte du destinataire, pas d’image" cta="Une question fermée" />
      <M5Row beat={5} icon="doc" tone="navy" ch="Article" len="800–1 500 mots" ton="Pédagogique" form="H1, H2, FAQ, mots-clés" cta="Lire, télécharger" />
      <M5Row beat={6} icon="slides" tone="violet" ch="Présentation" len="6–10 slides" ton="Factuel, orienté client" form="Titres-messages, 3 points max" cta="Prochaine étape datée" />
    </div>
    <Callout title="Astuce" tone="violet" icon="sparkles" cls={b.on(6)} style={{ position: 'absolute', left: 120, top: 850, width: 1680 }} size={23}>
      Collez cette grille dans la conversation : « Respecte ces codes pour chaque déclinaison. » Les résultats deviennent réguliers d’un canal à l’autre.
    </Callout>
  </Frame>
);

// ─── Adapter au public (persona) ────────────────────────────────────────────
const M5_PERS = {
  claire: { tone: 'teal' as Tone, who: 'Claire · office manager, PME', obj: 'Un café qui fait revenir l’équipe au bureau ?', hook: 'Rendre le bureau plus accueillant sans alourdir votre quotidien, c’est tout un défi', arg: 'installé en une semaine, entretien inclus, et vous ne gérez rien', proof: 'une PME du 7e a vu sa salle de pause redevenir le cœur du bureau', cta: 'Je réserve la dégustation pour mon équipe' },
  hugo: { tone: 'violet' as Tone, who: 'Hugo · fondateur de start-up', obj: 'Une culture d’équipe qui se sent dès le café', hook: 'Votre culture d’équipe est votre meilleur argument pour recruter', arg: 'des cafés traçables, achetés directement à nos producteurs, et un café du mois choisi par vos équipes', proof: 'nous publions le prix payé à chaque producteur', cta: 'Je veux faire goûter l’équipe' },
  nadia: { tone: 'pink' as Tone, who: 'Nadia · DRH d’ETI, 3 sites', obj: 'Café sur vos 3 sites : un seul interlocuteur', hook: 'Bâtir un plan QVCT cohérent sur plusieurs sites n’est jamais simple', arg: 'un contrat unique pour tous vos sites, un interlocuteur dédié et un bilan de satisfaction chaque trimestre', proof: 'des entreprises multi-sites de la région nous font déjà confiance', cta: 'Planifier un échange de 15 minutes' },
};
type M5P = keyof typeof M5_PERS;
const M5Var = ({ children, tone }: { children: ReactNode; tone: Tone }) => (
  <mark style={{ background: T[tone].bg, boxShadow: `inset 0 -3px 0 ${STRONG[tone]}`, color: 'inherit', padding: '0 4px', borderRadius: 4 }}>{children}</mark>
);
const M5PBtn = ({ id, cur, set }: { id: M5P; cur: M5P; set: (p: M5P) => void }) => (
  <button
    type="button"
    data-osd-interactive
    onClick={(e) => {
      e.currentTarget.blur();
      set(id);
    }}
    style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', boxSizing: 'border-box', cursor: 'pointer', border: 'none', borderRadius: 14, padding: '14px 18px', fontFamily: body, fontSize: 23, fontWeight: 600, color: C.ink, textAlign: 'left', background: cur === id ? T[M5_PERS[id].tone].bg : C.card, boxShadow: cur === id ? `inset 0 0 0 3px ${STRONG[M5_PERS[id].tone]}` : `inset 0 0 0 1.5px ${C.rule}` }}
  >
    <span style={{ width: 46, height: 46, borderRadius: 99, background: STRONG[M5_PERS[id].tone], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="user" size={26} color="#fff" />
    </span>
    {M5_PERS[id].who}
  </button>
);

const M5_Public: Page = () => {
  const [p, setP] = useState<M5P>('claire');
  const d = M5_PERS[p];
  return (
    <Frame mod={5} kind="simu">
      <Title>Adapter au public : même offre, trois emails</Title>
      <Lede>Choisissez le destinataire. Les passages surlignés sont ceux que l’IA a adaptés au persona.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 500, display: 'flex', flexDirection: 'column', gap: 14, ...dl(100) }}>
        <M5PBtn id="claire" cur={p} set={setP} />
        <M5PBtn id="hugo" cur={p} set={setP} />
        <M5PBtn id="nadia" cur={p} set={setP} />
        <div style={{ marginTop: 16, fontSize: 22, lineHeight: 1.45, color: C.muted }}>Ce qui ne change pas : l’offre, les faits, la charte, la signature.</div>
      </div>
      <div key={p} className={A.fade} style={{ position: 'absolute', left: 680, top: 270, width: 1120, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, overflow: 'hidden', animationDuration: '400ms' } as CSSProperties}>
        <div style={{ padding: '16px 28px', background: C.panel, fontSize: 22, color: C.soft }}>
          <strong style={{ color: C.ink }}>Objet :</strong> <M5Var tone={d.tone}>{d.obj}</M5Var>
        </div>
        <div style={{ padding: '24px 30px', fontSize: 26, lineHeight: 1.6, color: C.ink }}>
          Bonjour,
          <br />
          <M5Var tone={d.tone}>{d.hook}</M5Var>. Avec Ardente Bureau, le café de spécialité torréfié à Lyon s’installe chez vous : <M5Var tone={d.tone}>{d.arg}</M5Var>.
          <br />
          Preuve à l’appui : <M5Var tone={d.tone}>{d.proof}</M5Var>.
          <div style={{ marginTop: 18 }}>
            <span style={{ display: 'inline-block', background: STRONG[d.tone], color: '#fff', fontWeight: 700, borderRadius: 10, padding: '8px 22px', fontSize: 23 }}>{d.cta}</span>
          </div>
        </div>
      </div>
      <PromptBox title="prompt · adaptation persona" size={19} cls={A.fade} style={{ position: 'absolute', left: 120, top: 820, width: 1680, ...dl(400) }}>
        Adapte cet email au persona <Cf>{'{persona}'}</Cf> : change l’objet, l’accroche, l’argument principal, la preuve et l’appel à l’action. <Cn>Ne modifie ni l’offre, ni les faits, ni les prix.</Cn>
      </PromptBox>
    </Frame>
  );
};

// ─── Selon l’étape du parcours ──────────────────────────────────────────────
const M5Stage = ({ beat, n, tone, icon, name, mind, msg, fmt }: { beat: number; n: number; tone: Tone; icon: IconName; name: string; mind: string; msg: string; fmt: string }) => (
  <div className={b.on(beat)} style={{ width: 390, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '24px 24px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={54} solid />
      <div>
        <Eyebrow c={T[tone].fg} size={16}>
          Étape {n}
        </Eyebrow>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy }}>{name}</div>
      </div>
    </div>
    <div style={{ marginTop: 18, fontSize: 21, fontStyle: 'italic', lineHeight: 1.4, color: C.muted, minHeight: 60 }}>« {mind} »</div>
    <div style={{ marginTop: 14, fontSize: 23, lineHeight: 1.4, fontWeight: 600, color: C.ink, minHeight: 96 }}>{msg}</div>
    <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1.5px solid ${C.rule}`, fontSize: 20, color: C.soft }}>{fmt}</div>
  </div>
);

const M5_Parcours: Page = () => (
  <Frame mod={5} beats={4}>
    <Title>Adapter à l’étape du parcours client</Title>
    <Lede>La même personne n’a pas besoin du même message selon qu’elle découvre la marque ou qu’elle est déjà cliente.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', justifyContent: 'space-between' }}>
      <M5Stage beat={1} n={1} tone="blue" icon="eye" name="Découverte" mind="Notre café du bureau est moyen, mais bon…" msg="Un problème partagé, sans parler de nous." fmt="Post LinkedIn, carrousel, article" />
      <M5Stage beat={2} n={2} tone="violet" icon="scale" name="Considération" mind="Quelles solutions existent ? Combien ça coûte ?" msg="Comparatif honnête, FAQ, coulisses." fmt="Guide, newsletter, page web" />
      <M5Stage beat={3} n={3} tone="green" icon="checkCircle" name="Décision" mind="Est-ce que ça marchera chez nous ?" msg="Preuve, essai gratuit, contact direct." fmt="Dégustation, email, présentation" />
      <M5Stage beat={4} n={4} tone="pink" icon="heart" name="Fidélisation" mind="On est contents… on peut en faire plus ?" msg="Café du mois, nouveautés, parrainage." fmt="Newsletter clients, enquête" />
    </div>
    <Callout title="Le prompt" tone="blue" icon="chat" cls={b.on(4)} style={{ position: 'absolute', left: 120, top: 830, width: 1680 }} size={23}>
      « Pour le persona Claire, propose un contenu par étape du parcours : objectif, message, format, canal, appel à l’action. Présente-le en tableau. »
    </Callout>
  </Frame>
);

// ─── Personnaliser à grande échelle (variables) ─────────────────────────────
const M5_CONTACTS = [
  { prenom: 'Claire', ent: 'Logikio', taille: 80, ville: 'Lyon 7e' },
  { prenom: 'Hugo', ent: 'Verdana Tech', taille: 25, ville: 'Villeurbanne' },
  { prenom: 'Nadia', ent: 'Méca-Rhône', taille: 400, ville: 'Vénissieux' },
];
const m5Arg = (t: number) => (t < 50 ? 'sans engagement, résiliable à tout moment' : t <= 200 ? 'installé en une semaine, entretien inclus' : 'un interlocuteur unique pour tous vos sites');
const M5V = ({ children }: { children: ReactNode }) => (
  <span style={{ color: '#FFD27A', background: 'rgba(255,210,122,.12)', borderRadius: 6, padding: '0 6px' }}>{children}</span>
);

const M5_Variables: Page = () => {
  const [i, setI] = useState(0);
  const c = M5_CONTACTS[i];
  return (
    <Frame mod={5} kind="simu">
      <Title>À grande échelle : l’IA rédige, l’outil remplit</Title>
      <PromptBox title="modèle-email.txt · rédigé avec l’IA" size={21} cls={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 820, ...dl(100) }}>
        Objet : <M5V>{'{{prénom}}'}</M5V>, un vrai café chez <M5V>{'{{entreprise}}'}</M5V> ?{'\n\n'}Bonjour <M5V>{'{{prénom}}'}</M5V>,{'\n'}les équipes de <M5V>{'{{entreprise}}'}</M5V> à <M5V>{'{{ville}}'}</M5V> méritent mieux que le café de la machine.{'\n'}Ardente Bureau : <M5V>{'{{argument_taille}}'}</M5V>.{'\n\n'}
        <Cc>{'{{argument_taille}} = règle : < 50 sal. · 50–200 · > 200'}</Cc>
      </PromptBox>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 570, width: 820, display: 'flex', gap: 12, ...dl(200) }}>
        <Btn ghost={i !== 0} tone="teal" icon="user" size={21} onClick={() => setI(0)}>
          Claire · 80 sal.
        </Btn>
        <Btn ghost={i !== 1} tone="violet" icon="user" size={21} onClick={() => setI(1)}>
          Hugo · 25 sal.
        </Btn>
        <Btn ghost={i !== 2} tone="pink" icon="user" size={21} onClick={() => setI(2)}>
          Nadia · 400 sal.
        </Btn>
      </div>
      <div key={i} className={A.right} style={{ position: 'absolute', left: 1000, top: 200, width: 800, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, overflow: 'hidden', animationDuration: '400ms' } as CSSProperties}>
        <div style={{ padding: '14px 24px', background: C.panel, fontSize: 21, color: C.ink }}>
          <strong>Objet :</strong> {c.prenom}, un vrai café chez {c.ent} ?
        </div>
        <div style={{ padding: '22px 26px', fontSize: 25, lineHeight: 1.55, color: C.ink }}>
          Bonjour {c.prenom},
          <br />
          les équipes de {c.ent} à {c.ville} méritent mieux que le café de la machine.
          <br />
          Ardente Bureau : <strong style={{ color: C.green }}>{m5Arg(c.taille)}</strong>.
        </div>
      </div>
      <div style={{ position: 'absolute', left: 1000, top: 560, width: 800, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card tone="green" icon="gear" title="Qui fait quoi ?" cls={A.right} style={dl(300)} size={22}>
          L’IA écrit le modèle et les variantes ; le CRM ou l’outil d’emailing insère les données. Le fichier clients ne passe jamais par l’assistant IA.
        </Card>
        <Card tone="coral" icon="lock" title="RGPD" cls={A.right} style={dl(450)} size={22}>
          Base légale (consentement ou intérêt légitime en B2B), désinscription facile, pas de données sensibles.
        </Card>
      </div>
      <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 680, width: 820, ...dl(500) }}>
        Cliquez un contact : seules les variables changent, le message reste maîtrisé.
      </Hint>
    </Frame>
  );
};

// ─── L’accordéon de longueur ────────────────────────────────────────────────
const M5_LEN = [
  { fmt: 'Extrait d’article', words: 72, tone: 'navy' as Tone, txt: 'La pause café n’est pas du temps perdu. C’est souvent devant la machine que l’équipe se retrouve, qu’une idée se débloque, qu’un nouveau venu se sent accueilli. Encore faut-il que le café donne envie de s’y arrêter. Avec Ardente Bureau, nous installons dans votre entreprise un café de spécialité torréfié à Lyon, en une semaine et sans engagement. Et en novembre, nous venons le faire déguster à votre équipe.' },
  { fmt: 'Post LinkedIn', words: 39, tone: 'blue' as Tone, txt: 'La pause café, c’est souvent là que l’équipe se retrouve. Encore faut-il que le café suive. Ardente Bureau installe un café de spécialité torréfié à Lyon dans vos locaux, sans engagement. Dégustation offerte en novembre.' },
  { fmt: 'Légende Instagram', words: 18, tone: 'pink' as Tone, txt: 'Le café qui fait revenir l’équipe au bureau ☕ Dégustation offerte en novembre, lien en bio.' },
  { fmt: 'Notification / SMS', words: 11, tone: 'teal' as Tone, txt: 'Ardente Bureau : dégustation offerte pour votre équipe jusqu’au 30/11.' },
  { fmt: 'Objet d’email', words: 5, tone: 'green' as Tone, txt: 'La pause qui compte arrive.' },
];

const M5_Longueur: Page = () => {
  const [v, setV] = useState(0);
  const l = M5_LEN[v];
  return (
    <Frame mod={5} kind="simu">
      <Title>Ajuster la longueur sans perdre le message</Title>
      <Lede>Faites glisser : l’IA résume excellemment, à condition de lui dire ce qui doit absolument rester.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1680, ...dl(100) }}>
        <Range value={v} onChange={setV} min={0} max={4} step={1} w={1680} tone={l.tone} />
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', fontSize: 20, color: C.muted }}>
          <span>Article</span>
          <span>Post</span>
          <span>Instagram</span>
          <span>SMS</span>
          <span>Objet</span>
        </div>
      </div>
      <div key={v} className={A.in} style={{ position: 'absolute', left: 120, top: 400, width: 1680, height: 340, boxSizing: 'border-box', background: C.card, borderRadius: 22, boxShadow: `${SHADOW}, inset 8px 0 0 ${STRONG[l.tone]}`, padding: '28px 40px', animationDuration: '400ms' } as CSSProperties}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Tag tone={l.tone} size={22}>
            {l.fmt}
          </Tag>
          <span style={{ fontFamily: mono, fontSize: 22, color: C.muted }}>{l.words} mots</span>
          <div style={{ flex: 1, height: 12, borderRadius: 6, background: C.panel, overflow: 'hidden' }}>
            <div style={{ width: `${(l.words / 72) * 100}%`, height: '100%', background: STRONG[l.tone], transition: `width 400ms ${EASE}` }} />
          </div>
        </div>
        <div style={{ marginTop: 22, fontSize: v === 0 ? 27 : v === 4 ? 56 : 34, lineHeight: 1.45, fontWeight: v === 4 ? 800 : 500, fontFamily: v === 4 ? display : body, color: C.ink }}>{l.txt}</div>
      </div>
      <Callout title="Le prompt" tone="blue" icon="chat" cls={A.fade} style={{ position: 'absolute', left: 120, top: 780, width: 1680, ...dl(400) }} size={23}>
        « Réduis à {'{N}'} mots. Garde obligatoirement : le nom de l’offre, le bénéfice principal et la date limite. Supprime tout le reste. »
      </Callout>
    </Frame>
  );
};

// ─── Le prompt maître de déclinaison ────────────────────────────────────────
const M5_Maitre: Page = () => (
  <Frame mod={5}>
    <Title>Le prompt maître : toute la déclinaison en une fois</Title>
    <Lede>À enregistrer dans votre bibliothèque. Il réunit tout ce qu’on a vu depuis ce matin.</Lede>
    <PromptBox title="prompt-maitre-multicanal.txt" size={21} cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1100, ...dl(100) }}>
      <Cc># Contexte</Cc>
      {'\n'}Tu es responsable de contenu chez Ardente. Voici notre charte de ton : [charte]. Voici la grille des codes par canal : [grille].
      {'\n\n'}
      <Cc># Matière</Cc>
      {'\n'}Message pivot : [message]. Faits autorisés : [offre, prix, dates]. Preuves : [témoignages validés].
      {'\n\n'}
      <Cc># Tâche</Cc>
      {'\n'}Décline ce message pour : <Cf>LinkedIn, Instagram, newsletter, email direct, article (plan + intro), 3 slides</Cf>.
      {'\n'}Cible : [persona]. Étape du parcours : [étape].
      {'\n\n'}
      <Cc># Contraintes</Cc>
      {'\n'}N’invente aucun fait, chiffre ou citation. Signale toute information manquante.
      {'\n'}Présente le résultat en <Cn>tableau</Cn> : canal · texte · visuel suggéré · appel à l’action.
    </PromptBox>
    <div style={{ position: 'absolute', left: 1280, top: 270, width: 520, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="blue" icon="layers" title="Quatre blocs" cls={A.right} style={dl(250)} size={22}>
        Contexte, matière, tâche, contraintes : on ne remplit que les crochets.
      </Card>
      <Card tone="green" icon="shieldCheck" title="Des faits « autorisés »" cls={A.right} style={dl(400)} size={22}>
        L’IA ne peut utiliser que ce que vous avez listé : fini les chiffres inventés.
      </Card>
      <Card tone="violet" icon="table" title="Un tableau en sortie" cls={A.right} style={dl(550)} size={22}>
        Facile à relire, à faire valider, et à copier dans votre outil de planification.
      </Card>
    </div>
  </Frame>
);

// ─── Quiz ───────────────────────────────────────────────────────────────────
const M5_Quiz: Page = () => (
  <Frame mod={5} kind="quiz">
    <Title>
      <span style={{ color: C.violet }}>Quiz</span> · quel canal, quel format ?
    </Title>
    <QuizSeries y={220}>
      <QuizQ q="Vous écrivez à une DRH que vous n’avez jamais rencontrée. Quel format ?" explain="Email direct : court, contextualisé, sans image, une seule question fermée. La newsletter s’adresse à des abonnés.">
        <QOpt>Une newsletter illustrée de 300 mots</QOpt>
        <QOpt ok>Un email court, personnalisé, avec une question fermée</QOpt>
        <QOpt>Un carrousel Instagram</QOpt>
      </QuizQ>
      <QuizQ q="Sur Instagram, qu’est-ce qui porte le message en premier ?" explain="Le visuel. La légende complète, engage par une question et des hashtags de niche.">
        <QOpt>La légende</QOpt>
        <QOpt>Les hashtags</QOpt>
        <QOpt ok>Le visuel</QOpt>
      </QuizQ>
      <QuizQ q="Un prospect découvre tout juste la marque. Quel message ?" explain="En découverte, on parle de son problème, pas de notre offre. L’essai gratuit vient à l’étape décision.">
        <QOpt ok>Un contenu utile sur son problème, sans parler de nous</QOpt>
        <QOpt>Le tarif détaillé et le bon de commande</QOpt>
        <QOpt>Une remise de 50 % immédiate</QOpt>
      </QuizQ>
      <QuizQ q="Pour personnaliser 2 000 emails, que donnez-vous à l’assistant IA ?" explain="L’IA rédige le modèle avec des variables ; c’est l’outil d’emailing ou le CRM qui insère les données. Le fichier clients reste dans les outils validés.">
        <QOpt>Le fichier clients complet</QOpt>
        <QOpt ok>Rien de personnel : il rédige un modèle avec des variables</QOpt>
        <QOpt>Les prénoms et emails seulement</QOpt>
      </QuizQ>
      <QuizQ q="Vous réduisez un article à un objet d’email. Que doit-on préciser à l’IA ?" explain="Ce qui doit absolument rester : sinon elle garde parfois le détail et perd le bénéfice ou la date limite.">
        <QOpt>Rien, elle sait résumer</QOpt>
        <QOpt>Le nombre exact de caractères seulement</QOpt>
        <QOpt ok>Les éléments à garder obligatoirement</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Atelier 4 ──────────────────────────────────────────────────────────────
const M5_Atelier: Page = () => (
  <LabPage
    mod={5}
    n="4"
    title="Produire une campagne multicanale"
    defi="multicanal"
    who="En binôme · votre campagne"
    minutes={25}
    objective={
      <>
        À partir de votre concept et de votre message pivot, produire la <strong>déclinaison complète</strong> sur six canaux, puis adapter l’email à <strong>deux personas</strong>.
      </>
    }
    where={<>Le tableau de déclinaison : LinkedIn · Instagram · newsletter · email · article (plan + intro) · 3 slides · 2 versions de l’email pour 2 personas</>}
    crit={
      <>
        <CheckItem id="a4c1" size={22}>Le message pivot est reconnaissable partout</CheckItem>
        <CheckItem id="a4c2" size={22}>Les codes de chaque canal sont respectés</CheckItem>
        <CheckItem id="a4c3" size={22}>Aucun fait inventé (faits autorisés seulement)</CheckItem>
        <CheckItem id="a4c4" size={22}>Les deux emails diffèrent vraiment</CheckItem>
      </>
    }
  >
    <strong>1.</strong> Remplissez les crochets du prompt maître. <strong>2.</strong> Lancez-le, puis critiquez canal par canal avec la grille des codes. <strong>3.</strong> Adaptez l’email à deux personas sans toucher aux faits.{' '}
    <strong>4.</strong> Passez la grille de relecture sur les deux contenus les plus visibles.
    <Bonus>Ajoutez une version anglaise de la newsletter et vérifiez-la avec un collègue : la traduction littérale ne suffit pas.</Bonus>
  </LabPage>
);

// ─── Synthèse ───────────────────────────────────────────────────────────────
const M5_Synthese: Page = () => (
  <Frame mod={5} kind="synthese">
    <Title>Ce qu’on retient du module 5</Title>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="violet" d={100}>
        Un <strong>message pivot</strong>, puis une forme adaptée à chaque canal.
      </SynthRow>
      <SynthRow n={2} tone="blue" d={200}>
        La <strong>grille des codes par canal</strong> dans le prompt rend les déclinaisons régulières.
      </SynthRow>
      <SynthRow n={3} tone="teal" d={300}>
        On adapte au <strong>persona</strong> et à l’<strong>étape du parcours</strong>, jamais les faits.
      </SynthRow>
      <SynthRow n={4} tone="green" d={400}>
        À grande échelle : <strong>l’IA écrit le modèle</strong>, l’outil insère les données.
      </SynthRow>
      <SynthRow n={5} tone="coral" d={500}>
        Pour raccourcir, dites <strong>ce qui doit rester</strong>.
      </SynthRow>
    </div>
    <ProjectCard mod={5}>
      Votre campagne est déclinée sur six canaux, avec un email adapté à deux personas. Il reste à prévoir comment mesurer… et à analyser.
    </ProjectCard>
  </Frame>
);

// ═══ 60-m6 ═════════════════════════════════════════════════════════════

// ─── Module 6 · Analyse marketing avec l’IA ─────────────────────────────────

const M6_Section: Page = () => (
  <Section
    n={6}
    title={
      <>
        Analyse marketing
        <br />
        avec l’IA
      </>
    }
    sub="Des données aux décisions : résultats de campagne, avis clients, commentaires, tendances, synthèse et recommandations."
    dur="15:25 – 16:05 · exercice inclus"
  >
    <SecItem n={1}>Analyse de données marketing</SecItem>
    <SecItem n={2}>Analyse de retours clients et de commentaires</SecItem>
    <SecItem n={3}>Identification des tendances</SecItem>
    <SecItem n={4}>Synthèse de résultats</SecItem>
    <SecItem n={5}>Suggestions d’amélioration… et les pièges de l’analyse</SecItem>
  </Section>
);
M6_Section.transition = BLOOM;

// ─── Analyse de données de campagne ─────────────────────────────────────────
const M6Cell = ({ children, strong = false, c }: { children: ReactNode; strong?: boolean; c?: string }) => (
  <span style={{ fontFamily: mono, fontSize: 19, textAlign: 'right', fontWeight: strong ? 700 : 400, color: c ?? C.ink }}>{children}</span>
);
const M6Line = ({ ch, imp, clk, ctr, dem, cost, head = false }: { ch: string; imp: string; clk: string; ctr: string; dem: string; cost: string; head?: boolean }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 1fr 1fr 1fr 1fr', gap: 10, padding: '9px 16px', background: head ? C.navy : C.card, borderBottom: `1px solid ${C.rule}` }}>
    {head ? (
      <>
        <Eyebrow c="#fff" size={15}>{ch}</Eyebrow>
        <Eyebrow c="#fff" size={15} style={{ textAlign: 'right' }}>{imp}</Eyebrow>
        <Eyebrow c="#fff" size={15} style={{ textAlign: 'right' }}>{clk}</Eyebrow>
        <Eyebrow c="#fff" size={15} style={{ textAlign: 'right' }}>{ctr}</Eyebrow>
        <Eyebrow c="#fff" size={15} style={{ textAlign: 'right' }}>{dem}</Eyebrow>
        <Eyebrow c="#fff" size={15} style={{ textAlign: 'right' }}>{cost}</Eyebrow>
      </>
    ) : (
      <>
        <span style={{ fontSize: 20, fontWeight: 600, color: C.ink }}>{ch}</span>
        <M6Cell>{imp}</M6Cell>
        <M6Cell>{clk}</M6Cell>
        <M6Cell>{ctr}</M6Cell>
        <M6Cell strong c={C.blue}>
          {dem}
        </M6Cell>
        <M6Cell>{cost}</M6Cell>
      </>
    )}
  </div>
);
const M6Insight = ({ beat, n, tone, children }: { beat: number; n: number; tone: Tone; children: ReactNode }) => (
  <div className={b.on(beat)} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 18px' }}>
    <Num n={n} tone={tone} size={36} />
    <div style={{ fontSize: 22, lineHeight: 1.4, color: C.ink }}>{children}</div>
  </div>
);

const M6_Donnees: Page = () => (
  <Frame mod={6} beats={4}>
    <Title>Analyser des données : le bilan de novembre chez Ardente</Title>
    <Lede>Un export de vos outils, collé ou joint, et une question précise. L’IA lit le tableau ; le tableur calcule.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 980, borderRadius: 16, overflow: 'hidden', boxShadow: SHADOW, ...dl(100) }}>
      <M6Line head ch="Canal" imp="Vues" clk="Clics" ctr="Taux clic" dem="Demandes" cost="Coût" />
      <M6Line ch="LinkedIn organique" imp="18 400" clk="520" ctr="2,8 %" dem="31" cost="0 €" />
      <M6Line ch="LinkedIn sponsorisé" imp="42 000" clk="610" ctr="1,5 %" dem="22" cost="900 €" />
      <M6Line ch="Instagram" imp="25 300" clk="380" ctr="1,5 %" dem="9" cost="0 €" />
      <M6Line ch="Newsletter" imp="11 800" clk="1 060" ctr="9,0 %" dem="58" cost="0 €" />
      <M6Line ch="Email direct" imp="240" clk="41" ctr="17,1 %" dem="19" cost="0 €" />
      <M6Line ch="Article (SEO)" imp="3 900" clk="210" ctr="5,4 %" dem="7" cost="0 €" />
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', background: T.blue.bg, fontSize: 20, fontWeight: 700, color: C.navy }}>
        <span>Total demandes de dégustation</span>
        <span style={{ fontFamily: mono }}>146 / objectif 150</span>
      </div>
    </div>
    <PromptBox title="prompt · analyse" size={18} cls={A.in} style={{ position: 'absolute', left: 120, top: 740, width: 980, ...dl(300) }}>
      Analyse ce tableau de résultats. Identifie 3 enseignements et 3 actions pour décembre. <Cn>Montre le calcul de chaque chiffre que tu cites</Cn>, et signale ce que les données ne permettent pas de conclure.
    </PromptBox>
    <div style={{ position: 'absolute', left: 1160, top: 270, width: 640, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Eyebrow c={C.violet} size={19} cls={A.fade} style={dl(200)}>
        Ce que l’IA en tire
      </Eyebrow>
      <M6Insight beat={1} n={1} tone="green">
        La <strong>newsletter</strong> apporte 58 demandes sur 146, soit 40 % : le canal le plus rentable.
      </M6Insight>
      <M6Insight beat={2} n={2} tone="blue">
        L’<strong>email direct</strong> convertit fort (19 demandes pour 240 envois) : à étendre aux ETI.
      </M6Insight>
      <M6Insight beat={3} n={3} tone="coral">
        Le <strong>sponsorisé</strong> coûte 41 € par demande (900 / 22) : à cibler ou à couper.
      </M6Insight>
      <M6Insight beat={4} n={4} tone="yellow">
        <strong>Limite :</strong> on ne sait pas combien de dégustations deviennent des contrats. Il manque cette colonne.
      </M6Insight>
    </div>
  </Frame>
);

// ─── Le même tableau, en graphique ──────────────────────────────────────────
const M6Bar = ({ label, v, max, tone, beat, d }: { label: string; v: number; max: number; tone: Tone; beat: number; d: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 64 }}>
    <span style={{ width: 250, fontSize: 24, color: C.ink, textAlign: 'right' }}>{label}</span>
    <div style={{ flex: 1, height: 44 }}>
      <div className={b.grow(beat)} style={{ width: `${(v / max) * 100}%`, height: '100%', borderRadius: 8, background: STRONG[tone], ...dl(d) }} />
    </div>
    <span className={b.fade(beat)} style={{ width: 70, fontFamily: display, fontWeight: 800, fontSize: 30, color: STRONG[tone], ...dl(d + 300) }}>
      {v}
    </span>
  </div>
);

const M6_Graph: Page = () => (
  <Frame mod={6} beats={2}>
    <Title>Le bon graphique : l’IA conseille, le tableur trace</Title>
    <Lede>« Quel graphique montre le mieux la contribution de chaque canal ? » Réponse : des barres horizontales triées.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1100, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 34px', ...dl(100) }}>
      <Eyebrow c={C.navy} size={20}>
        Demandes de dégustation par canal · novembre
      </Eyebrow>
      <div style={{ marginTop: 16 }}>
        <M6Bar label="Newsletter" v={58} max={58} tone="green" beat={1} d={0} />
        <M6Bar label="LinkedIn organique" v={31} max={58} tone="blue" beat={1} d={100} />
        <M6Bar label="LinkedIn sponsorisé" v={22} max={58} tone="coral" beat={1} d={200} />
        <M6Bar label="Email direct" v={19} max={58} tone="blue" beat={1} d={300} />
        <M6Bar label="Instagram" v={9} max={58} tone="grey" beat={1} d={400} />
        <M6Bar label="Article (SEO)" v={7} max={58} tone="grey" beat={1} d={500} />
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1280, top: 280, width: 520, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="green" icon="table" title="Le tableur calcule" cls={A.right} style={dl(250)} size={22}>
        Totaux, taux, coûts : Excel ou Sheets. L’IA peut écrire la formule.
      </Card>
      <Card tone="blue" icon="chart" title="L’IA conseille" cls={A.right} style={dl(400)} size={22}>
        Type de graphique, titre qui affirme, couleur pour l’essentiel seulement.
      </Card>
      <Callout title="Titre-message" tone="violet" icon="type" cls={b.on(2)} size={22}>
        « La newsletter apporte 40 % des demandes » plutôt que « Demandes par canal ».
      </Callout>
    </div>
  </Frame>
);

// ─── Analyse de retours clients ─────────────────────────────────────────────
const M6Theme = ({ beat, name, n, pos, quote }: { beat: number; name: string; n: number; pos: number; quote: string }) => (
  <div className={b.on(beat)} style={{ display: 'grid', gridTemplateColumns: '260px 1fr 520px', gap: 20, alignItems: 'center', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 22px' }}>
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{name}</div>
      <div style={{ fontSize: 19, color: C.muted }}>{n} mentions</div>
    </div>
    <div style={{ display: 'flex', height: 30, borderRadius: 8, overflow: 'hidden', width: `${(n / 86) * 100}%`, minWidth: 120 }}>
      <div style={{ width: `${pos}%`, background: C.green }} />
      <div style={{ flex: 1, background: C.coral }} />
    </div>
    <div style={{ fontSize: 20, fontStyle: 'italic', lineHeight: 1.35, color: C.soft }}>« {quote} »</div>
  </div>
);

const M6_Avis: Page = () => (
  <Frame mod={6} beats={5}>
    <Title>Analyser des retours clients : 200 avis en 2 minutes</Title>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 186, display: 'flex', alignItems: 'center', gap: 22, fontSize: 21, color: C.soft }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 22, height: 14, borderRadius: 4, background: C.green }} /> positif
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 22, height: 14, borderRadius: 4, background: C.coral }} /> négatif
      </span>
      <span>· avis e-shop et Google, anonymisés · un avis peut citer plusieurs thèmes</span>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 236, width: 1680, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M6Theme beat={1} name="Goût & qualité" n={86} pos={92} quote="Enfin un café qui a du goût, on sent le travail de torréfaction." />
      <M6Theme beat={2} name="Livraison" n={54} pos={39} quote="Café excellent mais 9 jours pour le recevoir, c’est long." />
      <M6Theme beat={3} name="Prix" n={41} pos={46} quote="Un peu cher pour un usage quotidien, mais ça se justifie." />
      <M6Theme beat={4} name="Emballage" n={33} pos={70} quote="Le sachet refermable est top, dommage qu’il ne soit pas recyclable." />
      <M6Theme beat={5} name="Service client" n={27} pos={85} quote="Réponse rapide et très humaine quand ma commande s’est perdue." />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 770, width: 1680, display: 'flex', gap: 24 }}>
      <PromptBox title="prompt · avis clients" size={18} cls={A.fade} style={{ flex: 1.3, ...dl(400) }}>
        Voici 200 avis anonymisés. Regroupe-les en 5 à 7 thèmes. Pour chacun : nombre de mentions, part positive / négative, une citation exacte représentative. <Cn>Ne reformule pas les citations.</Cn>
      </PromptBox>
      <Callout title="Enseignement" tone="coral" icon="truck" cls={b.on(5)} style={{ flex: 1 }} size={22}>
        L’irritant n° 1 n’est pas le produit mais la <strong>livraison</strong> : à traiter avant le lancement B2B.
      </Callout>
    </div>
  </Frame>
);

// ─── Analyse de commentaires (modération assistée) ──────────────────────────
const M6_COMMENTS = [
  { who: 'Julie M.', txt: 'On l’a testé au bureau la semaine dernière, toute l’équipe est fan !', cat: 'Positif', tone: 'green' as Tone, rep: 'Merci Julie ! Transmettez nos amitiés à l’équipe ☕ Quel café a eu le plus de succès ?' },
  { who: 'Karim B.', txt: 'C’est combien pour une boîte de 30 personnes ?', cat: 'Question · opportunité', tone: 'blue' as Tone, rep: 'Bonjour Karim, tout dépend de votre consommation : on vous envoie un devis en message privé ?' },
  { who: 'Sophie L.', txt: 'Toujours pas reçu ma commande passée il y a 12 jours…', cat: 'Négatif · urgent', tone: 'coral' as Tone, rep: 'Bonjour Sophie, désolés pour ce retard. On regarde tout de suite : pouvez-vous nous envoyer votre numéro de commande en privé ?' },
  { who: 'Marc T.', txt: 'Encore une boîte qui fait du greenwashing avec ses « producteurs ».', cat: 'Critique · sensible', tone: 'yellow' as Tone, rep: 'Bonjour Marc, question légitime. Nous publions le prix payé à chaque producteur ici : [lien]. Nous répondons volontiers à vos questions.' },
  { who: 'Compte inconnu', txt: '🔥 Gagnez 5000 €/mois depuis chez vous, cliquez ici 🔥', cat: 'Spam', tone: 'grey' as Tone, rep: 'Pas de réponse : masquer ou supprimer, et signaler.' },
];
const M6CBtn = ({ i, cur, set }: { i: number; cur: number; set: (i: number) => void }) => {
  const c = M6_COMMENTS[i];
  return (
    <button
      type="button"
      data-osd-interactive
      onClick={(e) => {
        e.currentTarget.blur();
        set(i);
      }}
      style={{ display: 'flex', gap: 14, alignItems: 'flex-start', width: '100%', boxSizing: 'border-box', textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 14, padding: '14px 18px', fontFamily: body, background: cur === i ? T[c.tone].bg : C.card, boxShadow: cur === i ? `inset 0 0 0 3px ${STRONG[c.tone]}` : `inset 0 0 0 1.5px ${C.rule}` }}
    >
      <Avatar who="user" size={44} />
      <span style={{ fontSize: 22, lineHeight: 1.38, color: C.ink }}>
        <strong>{c.who}</strong> · {c.txt}
      </span>
    </button>
  );
};

const M6_Commentaires: Page = () => {
  const [i, setI] = useState(-1);
  const c = i >= 0 ? M6_COMMENTS[i] : null;
  return (
    <Frame mod={6} kind="simu">
      <Title>Analyser des commentaires : trier, prioriser, répondre</Title>
      <Lede>Votez d’abord : quelle catégorie, quelle urgence ? Puis cliquez pour voir l’analyse et la réponse suggérée.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 980, display: 'flex', flexDirection: 'column', gap: 12, ...dl(100) }}>
        <M6CBtn i={0} cur={i} set={setI} />
        <M6CBtn i={1} cur={i} set={setI} />
        <M6CBtn i={2} cur={i} set={setI} />
        <M6CBtn i={3} cur={i} set={setI} />
        <M6CBtn i={4} cur={i} set={setI} />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1160, top: 270, width: 640, height: 560, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', ...dl(200) }}>
        {c ? (
          <div key={i} className={A.fade} style={{ animationDuration: '400ms' } as CSSProperties}>
            <Eyebrow c={C.muted} size={18}>
              Catégorie proposée
            </Eyebrow>
            <div style={{ marginTop: 10 }}>
              <Tag tone={c.tone} size={24}>
                {c.cat}
              </Tag>
            </div>
            <Eyebrow c={C.muted} size={18} style={{ marginTop: 26 }}>
              Réponse suggérée
            </Eyebrow>
            <div style={{ marginTop: 10, background: T.blue.bg, borderRadius: 14, padding: '16px 20px', fontSize: 23, lineHeight: 1.45, color: C.ink }}>{c.rep}</div>
            <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, color: C.soft }}>
              <Icon name="humanCheck" size={26} color={C.green} /> Un humain relit et publie la réponse.
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 24, lineHeight: 1.45, color: C.muted }}>
            Cliquez un commentaire.
            <br />
            <br />
            Le prompt utilisé : « Classe chaque commentaire (positif, question, négatif, critique sensible, spam), indique l’urgence, et propose une réponse dans notre ton. Ne promets rien que nous n’ayons validé. »
          </div>
        )}
      </div>
      <Callout title="Règle" tone="coral" icon="alert" cls={A.fade} style={{ position: 'absolute', left: 120, top: 860, width: 1680, ...dl(500) }} size={22}>
        Les commentaires négatifs et sensibles ne reçoivent jamais de réponse automatique : l’IA propose, une personne décide et répond.
      </Callout>
    </Frame>
  );
};

// ─── Identification des tendances ───────────────────────────────────────────
const M6_MONTHS = ['nov.', 'déc.', 'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.'];
const m6Path = (vals: number[]) => vals.map((v, i) => `${i ? 'L' : 'M'} ${60 + i * 90} ${400 - v * 3.4}`).join(' ');
const M6_SERIES = {
  filtre: [30, 32, 35, 38, 42, 47, 52, 58, 63, 70, 78, 86],
  bureau: [40, 38, 45, 44, 48, 50, 47, 42, 40, 55, 72, 80],
  capsule: [80, 78, 74, 72, 70, 66, 64, 60, 58, 55, 52, 50],
};

const M6_Tendances: Page = () => (
  <Frame mod={6} beats={3}>
    <Title>Identifier des tendances : ce qui monte, ce qui baisse</Title>
    <Lede>Mentions dans vos commentaires, avis et recherches sur 12 mois (indice 100 = maximum). L’IA repère, vous vérifiez.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1140, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 24px', ...dl(100) }}>
      <svg width={1092} height={450} viewBox="0 0 1092 450" style={{ display: 'block' }} aria-hidden>
        <line x1={50} y1={400} x2={1060} y2={400} stroke={C.rule} strokeWidth={2} />
        <line x1={50} y1={230} x2={1060} y2={230} stroke={C.rule} strokeWidth={1} strokeDasharray="6 8" />
        <line x1={50} y1={60} x2={1060} y2={60} stroke={C.rule} strokeWidth={1} strokeDasharray="6 8" />
        <text x={40} y={405} textAnchor="end" style={{ fontSize: 16, fill: C.muted }}>0</text>
        <text x={40} y={235} textAnchor="end" style={{ fontSize: 16, fill: C.muted }}>50</text>
        <text x={40} y={65} textAnchor="end" style={{ fontSize: 16, fill: C.muted }}>100</text>
        <text x={60} y={430} textAnchor="middle" style={{ fontSize: 16, fill: C.muted }}>{M6_MONTHS[0]}</text>
        <text x={330} y={430} textAnchor="middle" style={{ fontSize: 16, fill: C.muted }}>{M6_MONTHS[3]}</text>
        <text x={600} y={430} textAnchor="middle" style={{ fontSize: 16, fill: C.muted }}>{M6_MONTHS[6]}</text>
        <text x={870} y={430} textAnchor="middle" style={{ fontSize: 16, fill: C.muted }}>{M6_MONTHS[9]}</text>
        <text x={1050} y={430} textAnchor="middle" style={{ fontSize: 16, fill: C.muted }}>{M6_MONTHS[11]}</text>
        <path d={m6Path(M6_SERIES.filtre)} pathLength={1} fill="none" stroke={C.green} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" className={b.draw(1)} />
        <path d={m6Path(M6_SERIES.bureau)} pathLength={1} fill="none" stroke={C.blue} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" className={b.draw(2)} />
        <path d={m6Path(M6_SERIES.capsule)} pathLength={1} fill="none" stroke={C.faint} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" className={b.draw(3)} />
        <text x={1000} y={78} textAnchor="end" className={b.fade(1)} style={{ fontSize: 20, fontWeight: 700, fill: C.green }}>Café filtre ↑</text>
        <text x={1060} y={205} textAnchor="end" className={b.fade(2)} style={{ fontSize: 20, fontWeight: 700, fill: C.blue }}>Café au bureau ↑</text>
        <text x={1060} y={265} textAnchor="end" className={b.fade(3)} style={{ fontSize: 20, fontWeight: 700, fill: C.muted }}>Capsules ↓</text>
      </svg>
    </div>
    <div style={{ position: 'absolute', left: 1320, top: 270, width: 480, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card tone="green" icon="trend" title="Signal" cls={b.on(1)} size={21}>
        Le café filtre progresse toute l’année : un contenu « tutos » à renforcer.
      </Card>
      <Card tone="blue" icon="calendar" title="Saisonnalité" cls={b.on(2)} size={21}>
        « Bureau » remonte chaque rentrée : lancer le B2B en septembre l’an prochain.
      </Card>
      <Card tone="coral" icon="search" title="À vérifier" cls={b.on(3)} size={21}>
        Croisez avec Google Trends, vos ventes et la presse du secteur avant de décider.
      </Card>
    </div>
    <PromptBox title="prompt · tendances" size={18} cls={A.fade} style={{ position: 'absolute', left: 120, top: 790, width: 1140, ...dl(400) }}>
      Voici nos commentaires et avis des 12 derniers mois, datés. Quels sujets sont en hausse ou en baisse ? Donne, pour chacun, le nombre de mentions par trimestre et 2 exemples datés.
    </PromptBox>
  </Frame>
);

// ─── Synthèse de résultats : le rapport en une page ─────────────────────────
const M6Block = ({ beat, tone, title, children }: { beat: number; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(beat)} style={{ background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${STRONG[tone]}`, padding: '16px 22px 16px 28px' }}>
    <Eyebrow c={T[tone].fg} size={17}>
      {title}
    </Eyebrow>
    <div style={{ marginTop: 6, fontSize: 22, lineHeight: 1.42, color: C.ink }}>{children}</div>
  </div>
);
const M6Kpi = ({ v, l, tone }: { v: string; l: string; tone: Tone }) => (
  <div style={{ flex: 1, background: T[tone].bg, borderRadius: 14, padding: '14px 18px' }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 44, lineHeight: 1, color: STRONG[tone] }}>{v}</div>
    <div style={{ marginTop: 6, fontSize: 19, color: C.soft }}>{l}</div>
  </div>
);

const M6_Synthese: Page = () => (
  <Frame mod={6} beats={4}>
    <Title>Synthèse de résultats : le bilan en une page</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1100, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className={b.on(1)} style={{ display: 'flex', gap: 14 }}>
        <M6Kpi v="146" l="demandes de dégustation (objectif 150)" tone="blue" />
        <M6Kpi v="40 %" l="des demandes via la newsletter" tone="green" />
        <M6Kpi v="41 €" l="par demande en sponsorisé" tone="coral" />
      </div>
      <M6Block beat={2} tone="green" title="Ce qui a marché">
        Newsletter et email direct : messages personnalisés, appel à l’action unique. Le slogan « La pause qui compte » est repris en commentaires.
      </M6Block>
      <M6Block beat={3} tone="coral" title="Ce qui n’a pas marché">
        LinkedIn sponsorisé trop large (toutes tailles d’entreprises). Instagram : visibilité forte, peu de demandes B2B.
      </M6Block>
      <M6Block beat={4} tone="violet" title="Trois recommandations pour décembre">
        1. Recentrer le sponsorisé sur les office managers de 50 à 200 salariés. 2. Étendre l’email direct aux ETI. 3. Mesurer la conversion dégustation → contrat.
      </M6Block>
    </div>
    <div style={{ position: 'absolute', left: 1280, top: 190, width: 520, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PromptBox title="prompt · synthèse" size={18} cls={A.right} style={dl(200)}>
        À partir de notre analyse, rédige une synthèse d’une page pour la direction : 3 chiffres clés, ce qui a marché, ce qui n’a pas marché, 3 recommandations priorisées.{'\n'}Phrases courtes. <Cn>Aucun chiffre absent du tableau.</Cn>
      </PromptBox>
      <Callout title="Contrôle" tone="yellow" icon="eye" cls={A.right} style={dl(400)} size={22}>
        Vérifiez chaque chiffre de la synthèse dans le tableau source avant envoi.
      </Callout>
    </div>
  </Frame>
);

// ─── Suggestions d’amélioration : matrice impact / effort ───────────────────
const M6_Matrice: Page = () => (
  <Frame mod={6} kind="exercice">
    <Title>Suggestions d’amélioration : impact × effort</Title>
    <Lede>L’IA a proposé huit actions. Faites-les glisser dans la matrice avec le groupe (double-clic : retour au départ).</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1120, height: 620, ...dl(100) }}>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 8 }}>
        <div style={{ background: T.green.bg, borderRadius: '18px 4px 4px 4px', padding: 18 }}>
          <Eyebrow c={T.green.fg} size={19}>Victoires rapides</Eyebrow>
        </div>
        <div style={{ background: T.blue.bg, borderRadius: '4px 18px 4px 4px', padding: 18 }}>
          <Eyebrow c={T.blue.fg} size={19}>Projets majeurs</Eyebrow>
        </div>
        <div style={{ background: T.grey.bg, borderRadius: '4px 4px 4px 18px', padding: 18, display: 'flex', alignItems: 'flex-end' }}>
          <Eyebrow c={T.grey.fg} size={19}>Si on a le temps</Eyebrow>
        </div>
        <div style={{ background: T.coral.bg, borderRadius: '4px 4px 18px 4px', padding: 18, display: 'flex', alignItems: 'flex-end' }}>
          <Eyebrow c={T.coral.fg} size={19}>À éviter</Eyebrow>
        </div>
      </div>
      <div style={{ position: 'absolute', left: -46, top: 0, bottom: 0, display: 'flex', alignItems: 'center' }}>
        <span style={{ transform: 'rotate(-90deg)', fontFamily: display, fontWeight: 700, fontSize: 18, letterSpacing: '0.12em', color: C.muted, whiteSpace: 'nowrap' }}>IMPACT ↑</span>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: -34, textAlign: 'center', fontFamily: display, fontWeight: 700, fontSize: 18, letterSpacing: '0.12em', color: C.muted }}>EFFORT →</div>
    </div>
    <Drag x={1290} y={270} w={510} size={22} tone="violet">Tester 2 objets d’email (A/B)</Drag>
    <Drag x={1290} y={340} w={510} size={22} tone="violet">Cibler le sponsorisé (50–200 sal.)</Drag>
    <Drag x={1290} y={410} w={510} size={22} tone="violet">Programme de parrainage B2B</Drag>
    <Drag x={1290} y={480} w={510} size={22} tone="violet">Refaire tout le site web</Drag>
    <Drag x={1290} y={550} w={510} size={22} tone="violet">Répondre aux avis sur la livraison</Drag>
    <Drag x={1290} y={620} w={510} size={22} tone="violet">Lancer une chaîne YouTube</Drag>
    <Drag x={1290} y={690} w={510} size={22} tone="violet">Changer de transporteur</Drag>
    <Drag x={1290} y={760} w={510} size={22} tone="violet">Témoignage vidéo sur la page</Drag>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 1290, top: 850, width: 510, ...dl(500) }}>
      L’IA propose et estime ; c’est l’équipe qui connaît ses moyens.
    </Hint>
  </Frame>
);

// ─── Les pièges de l’analyse ────────────────────────────────────────────────
const M6_Pieges: Page = () => (
  <Frame mod={6}>
    <Title>Cinq pièges de l’analyse avec l’IA</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
      <Card tone="coral" icon="money" title="Chiffres inventés ou faux" cls={A.in} style={{ height: 300, ...dl(100) }} size={22}>
        L’IA peut se tromper dans un calcul ou « compléter » une donnée. Calculs dans le tableur, chiffres revérifiés.
      </Card>
      <Card tone="yellow" icon="link" title="Corrélation ≠ causalité" cls={A.in} style={{ height: 300, ...dl(200) }} size={22}>
        Les ventes montent quand on poste plus ? Peut-être la rentrée. Demandez : « Quelles autres explications ? »
      </Card>
      <Card tone="violet" icon="users" title="Échantillon biaisé" cls={A.in} style={{ height: 300, ...dl(300) }} size={22}>
        Les avis viennent surtout des très contents et des très mécontents. 30 commentaires ne font pas un marché.
      </Card>
      <Card tone="blue" icon="lock" title="Données personnelles" cls={A.in} style={{ height: 300, ...dl(400) }} size={22}>
        Exportez sans nom, email ni téléphone. Les avis aussi : retirez les signatures.
      </Card>
      <Card tone="teal" icon="filter" title="Conclusion trop sûre" cls={A.in} style={{ height: 300, ...dl(500) }} size={22}>
        Exigez de l’IA ce que les données ne permettent pas de conclure, et le niveau de confiance.
      </Card>
      <div className={A.in} style={{ height: 300, boxSizing: 'border-box', background: G.navy, borderRadius: 18, padding: '28px 30px', color: '#fff', ...dl(600) }}>
        <Eyebrow c="#C9B6FF" size={19}>
          La phrase à ajouter
        </Eyebrow>
        <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 28, lineHeight: 1.3 }}>« Montre tes calculs, cite tes sources dans les données, et dis-moi ce que tu ne sais pas. »</div>
      </div>
    </div>
  </Frame>
);

// ─── Exercice : analyser 10 avis ────────────────────────────────────────────
const M6Rev = ({ stars, children }: { stars: number; children: ReactNode }) => (
  <div style={{ background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '10px 16px', fontSize: 19, lineHeight: 1.38, color: C.ink }}>
    <span style={{ color: C.amber, letterSpacing: 2 }}>{'★'.repeat(stars)}</span>
    <span style={{ color: C.rule, letterSpacing: 2 }}>{'★'.repeat(5 - stars)}</span> {children}
  </div>
);

const M6_Exercice: Page = () => (
  <Frame mod={6} kind="exercice">
    <Title>Exercice flash : à vous d’analyser ces 10 avis</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 1060, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, ...dl(100) }}>
      <M6Rev stars={5}>Arômes incroyables, le moka d’Éthiopie est devenu notre rituel.</M6Rev>
      <M6Rev stars={2}>Colis arrivé ouvert, la moitié du café renversé.</M6Rev>
      <M6Rev stars={4}>Très bon, mais l’abonnement est compliqué à mettre en pause.</M6Rev>
      <M6Rev stars={5}>Conseils au téléphone parfaits pour choisir la mouture.</M6Rev>
      <M6Rev stars={3}>Bon café, mais 8 jours de livraison pour Lyon même…</M6Rev>
      <M6Rev stars={1}>Impossible de résilier l’abonnement depuis le site.</M6Rev>
      <M6Rev stars={5}>On l’a fait goûter au bureau, tout le monde a adoré.</M6Rev>
      <M6Rev stars={4}>Sachet refermable pratique, j’aimerais une option vrac.</M6Rev>
      <M6Rev stars={2}>Prix en hausse sans prévenir les abonnés.</M6Rev>
      <M6Rev stars={5}>Le petit mot manuscrit dans le colis, quelle attention !</M6Rev>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 190, width: 560, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className={A.right} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 24px', ...dl(200) }}>
        <PanelTitle icon="target" c={T.green.fg}>
          Votre mission
        </PanelTitle>
        <div style={{ fontSize: 22, lineHeight: 1.45, color: C.soft }}>
          <strong>1.</strong> Faites classer ces avis en thèmes par l’IA. <strong>2.</strong> Identifiez l’irritant prioritaire. <strong>3.</strong> Proposez une action et un contenu qui y répondent.
        </div>
      </div>
      <Timer id="m6-avis" minutes={8} label="Exercice" compact cls={A.right} style={dl(300)} />
      <FlipCard
        w={560}
        h={260}
        tone="green"
        cls={A.right}
        style={dl(400)}
        front={
          <>
            <Eyebrow c={T.green.fg} size={18}>
              Correction
            </Eyebrow>
            <div style={{ marginTop: 10, fontSize: 22, color: C.soft }}>Retournez après l’exercice.</div>
          </>
        }
        back={
          <div style={{ fontSize: 20, lineHeight: 1.45, color: C.ink }}>
            <strong>Thèmes :</strong> produit (+), service (+), livraison (−), <strong>abonnement (−)</strong>, prix (−).
            <br />
            <strong>Irritant prioritaire :</strong> la gestion de l’abonnement (pause, résiliation) : risque légal en plus d’être frustrant.
            <br />
            <strong>Action :</strong> résiliation en ligne simple + FAQ « gérer mon abonnement ».
          </div>
        }
      />
    </div>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M6_Qcm: Page = () => (
  <QcmPage
    mod={6}
    n={3}
    title="Analyse"
    q="L’IA vous annonce : « Vos posts du mardi génèrent 3 fois plus de demandes. » Quelle est la bonne réaction ?"
    explain="On vérifie le calcul dans les données, on cherche d’autres explications (sujet, format, période) et on teste avant de généraliser."
  >
    <Opt why="Une conclusion non vérifiée peut reposer sur un calcul erroné ou sur deux posts exceptionnels.">Je publie désormais uniquement le mardi</Opt>
    <Opt ok why="Exact : vérifier le chiffre, chercher les causes alternatives, puis tester sur quelques semaines.">Je vérifie le calcul, je cherche d’autres explications et je teste</Opt>
    <Opt why="L’IA est utile pour repérer des pistes : il ne faut pas la croire aveuglément, ni l’ignorer.">J’ignore l’analyse, l’IA se trompe toujours</Opt>
    <Opt why="Ajouter des données personnelles n’améliore pas la fiabilité de la conclusion et pose un problème RGPD.">Je lui donne la liste nominative des clients pour qu’elle confirme</Opt>
  </QcmPage>
);

// ─── Synthèse du module ─────────────────────────────────────────────────────
const M6_Bilan: Page = () => (
  <Frame mod={6} kind="synthese">
    <Title>Ce qu’on retient du module 6</Title>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="blue" d={100}>
        Données anonymisées + question précise : <strong>l’IA lit, le tableur calcule</strong>.
      </SynthRow>
      <SynthRow n={2} tone="green" d={200}>
        Avis et commentaires : <strong>thèmes, sentiment, citations exactes</strong>, irritant n° 1.
      </SynthRow>
      <SynthRow n={3} tone="teal" d={300}>
        Tendances : l’IA <strong>repère des signaux</strong>, d’autres sources les confirment.
      </SynthRow>
      <SynthRow n={4} tone="violet" d={400}>
        Synthèse en une page : <strong>chiffres clés, réussites, échecs, 3 recommandations</strong>.
      </SynthRow>
      <SynthRow n={5} tone="coral" d={500}>
        « Montre tes calculs et <strong>dis-moi ce que tu ne sais pas</strong>. »
      </SynthRow>
    </div>
    <ProjectCard mod={6}>
      Vous savez quels indicateurs suivre pour chaque canal et comment transformer les résultats en recommandations. Tout est prêt pour la mini-campagne.
    </ProjectCard>
  </Frame>
);

// ═══ 70-close ══════════════════════════════════════════════════════════

// ─── Projet final & clôture ─────────────────────────────────────────────────

const F_Section: Page = () => (
  <Section
    n={7}
    big="GO"
    title={
      <>
        Projet final :
        <br />
        votre mini-campagne
      </>
    }
    sub="Cible → concept → contenus → visuels → diffusion → analyse. Tout ce que vous avez appris, assemblé de bout en bout."
    dur="16:05 – 17:00"
    kind="atelier"
  >
    <SecItem n={1}>Le brief du projet et le canevas</SecItem>
    <SecItem n={2}>Planifier la diffusion et choisir ses indicateurs</SecItem>
    <SecItem n={3}>Pitch de 3 minutes par binôme</SecItem>
    <SecItem n={4}>Votre bibliothèque de prompts</SecItem>
    <SecItem n={5}>Bilan, plan d’action, clôture</SecItem>
  </Section>
);
F_Section.transition = BLOOM;

// ─── Le brief du projet ─────────────────────────────────────────────────────
const FStep = ({ n, icon, tone, title, out, mod, d }: { n: number; icon: IconName; tone: Tone; title: string; out: string; mod: string; d: number }) => (
  <div className={A.pop} style={{ width: 252, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 -6px 0 ${STRONG[tone]}`, padding: '20px 20px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <IconTile name={icon} tone={tone} size={52} solid />
      <span style={{ fontFamily: mono, fontSize: 17, color: C.muted }}>{mod}</span>
    </div>
    <div style={{ marginTop: 14, fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy }}>
      {n}. {title}
    </div>
    <div style={{ marginTop: 8, fontSize: 20, lineHeight: 1.4, color: C.soft, minHeight: 84 }}>{out}</div>
  </div>
);

const F_Brief: Page = () => (
  <Frame mod={7} kind="atelier" label="Projet final · mini-campagne">
    <Title>Le brief : une mini-campagne complète, en 35 minutes</Title>
    <Lede>En binôme, sur Ardente ou votre marque. Réutilisez tout ce que vous avez produit aujourd’hui : rien ne repart de zéro.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', justifyContent: 'space-between' }}>
      <FStep n={1} icon="target" tone="blue" title="Cible" out="1 persona prioritaire, son étape du parcours" mod="M2" d={100} />
      <FStep n={2} icon="bulb" tone="violet" title="Concept" out="Slogan + idée en une phrase + objectif chiffré" mod="M3·M4" d={200} />
      <FStep n={3} icon="pen" tone="teal" title="Contenus" out="3 contenus : post, email, et un format au choix" mod="M3·M5" d={300} />
      <FStep n={4} icon="image" tone="pink" title="Visuels" out="1 visuel clé + 1 déclinaison, check-list passée" mod="M4" d={400} />
      <FStep n={5} icon="send" tone="green" title="Diffusion" out="Plan sur 2 semaines : quand, où, budget" mod="M2·M5" d={500} />
      <FStep n={6} icon="chart" tone="yellow" title="Analyse" out="3 KPI, objectifs, et ce qu’on testera" mod="M6" d={600} />
    </div>
    <svg width={1680} height={30} style={{ position: 'absolute', left: 120, top: 250 }} aria-hidden>
      <path d="M 126 15 H 1554" stroke={C.rule} strokeWidth={4} strokeDasharray="8 10" className={A.march} />
      <FlowDot path="M 126 15 H 1554" dur={5} r={7} color={C.electric} />
    </svg>
    <div style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'flex', gap: 24, alignItems: 'stretch' }}>
      <Timer id="projet" minutes={35} label="Projet final" cls={A.in} style={{ width: 560, ...dl(700) }} />
      <Callout title="Règles" tone="blue" icon="flag" cls={A.in} style={{ flex: 1, ...dl(800) }} size={23}>
        Un seul objectif chiffré. Uniquement des faits autorisés. Grille de relecture sur chaque contenu. À 16:40, chaque binôme présente en <strong>3 minutes</strong>.
      </Callout>
    </div>
  </Frame>
);

// ─── Le canevas ─────────────────────────────────────────────────────────────
const FBox = ({ n, tone, title, children, d }: { n: number; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 0 6px 0 ${STRONG[tone]}`, padding: '18px 22px', height: 268, boxSizing: 'border-box', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={n} tone={tone} size={36} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: C.navy }}>{title}</span>
    </div>
    <div style={{ marginTop: 12, fontSize: 20, lineHeight: 1.45, color: C.soft }}>{children}</div>
  </div>
);

const F_Canevas: Page = () => (
  <Frame mod={7} label="Projet final · mini-campagne">
    <Title>Le canevas d’une page à remplir… et l’exemple Ardente</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
      <FBox n={1} tone="blue" title="Cible" d={100}>
        <strong style={{ color: C.ink }}>Claire</strong>, office manager de PME lyonnaise (50–200 sal.), étape <strong style={{ color: C.ink }}>considération</strong>.
      </FBox>
      <FBox n={2} tone="violet" title="Concept & objectif" d={200}>
        « La pause qui compte. » Le café qui fait parler les équipes. <strong style={{ color: C.ink }}>Objectif : 150 dégustations en novembre.</strong>
      </FBox>
      <FBox n={3} tone="teal" title="Contenus" d={300}>
        Post LinkedIn « 5 signes… » · newsletter de lancement · email direct aux ETI · script vidéo 30 s.
      </FBox>
      <FBox n={4} tone="pink" title="Visuels" d={400}>
        Tasse vue de dessus + bulle dans la mousse, palette crème / brun. Post 4:5, story 9:16, affiche A4.
      </FBox>
      <FBox n={5} tone="green" title="Diffusion" d={500}>
        S1 teasing · S2 lancement · S3 preuves · S4 relance. 900 € sponsorisés ciblés 50–200 salariés.
      </FBox>
      <FBox n={6} tone="yellow" title="Analyse" d={600}>
        Demandes de dégustation · taux de clic newsletter · coût par demande. Test A/B sur 2 objets d’email.
      </FBox>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 800, ...dl(800) }}>
      Astuce : demandez à l’IA de remplir le canevas à partir de toute la conversation de la journée, puis corrigez-le.
    </Hint>
  </Frame>
);

// ─── Planifier la diffusion ─────────────────────────────────────────────────
const FDiff = ({ beat, icon, tone, ch, when, budget, kpi }: { beat: number; icon: IconName; tone: Tone; ch: string; when: string; budget: string; kpi: string }) => (
  <div className={b.left(beat)} style={{ display: 'grid', gridTemplateColumns: '300px 1fr 200px 1fr', gap: 18, alignItems: 'center', background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '14px 22px', fontSize: 22, lineHeight: 1.35, color: C.soft }}>
    <span style={{ display: 'flex', alignItems: 'center', gap: 12, fontWeight: 700, color: C.ink, fontSize: 23 }}>
      <IconTile name={icon} tone={tone} size={42} solid /> {ch}
    </span>
    <span>{when}</span>
    <span style={{ fontFamily: mono, fontSize: 20 }}>{budget}</span>
    <span>{kpi}</span>
  </div>
);

const F_Diffusion: Page = () => (
  <Frame mod={7} beats={5} label="Projet final · mini-campagne">
    <Title>Diffusion : quand, où, combien… et comment on mesure</Title>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'grid', gridTemplateColumns: '300px 1fr 200px 1fr', gap: 18, padding: '0 22px', boxSizing: 'border-box' }}>
      <Eyebrow c={C.muted} size={17}>Canal</Eyebrow>
      <Eyebrow c={C.muted} size={17}>Quand</Eyebrow>
      <Eyebrow c={C.muted} size={17}>Budget</Eyebrow>
      <Eyebrow c={C.muted} size={17}>Indicateur clé</Eyebrow>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 230, width: 1680, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <FDiff beat={1} icon="linkedin" tone="blue" ch="LinkedIn" when="Mar. et jeu., 8 h 30" budget="900 €" kpi="Coût par demande (< 25 €)" />
      <FDiff beat={2} icon="insta" tone="pink" ch="Instagram" when="Lun., mer., ven., 12 h" budget="0 €" kpi="Enregistrements, réponses en story" />
      <FDiff beat={3} icon="news" tone="teal" ch="Newsletter" when="Jeu. 4/11 et 25/11, 9 h" budget="0 €" kpi="Taux de clic (> 8 %)" />
      <FDiff beat={4} icon="mail" tone="green" ch="Email direct" when="S2, 20 ETI ciblées" budget="0 €" kpi="Taux de réponse, rendez-vous" />
      <FDiff beat={5} icon="flag" tone="navy" ch="Objectif global" when="Du 3 au 30 novembre" budget="900 €" kpi="150 demandes de dégustation" />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 760, width: 1680, display: 'flex', gap: 24 }}>
      <PromptBox title="prompt · plan de diffusion" size={18} cls={A.fade} style={{ flex: 1.3, ...dl(400) }}>
        Propose un plan de diffusion sur 4 semaines pour ces contenus : canal, jour et heure, budget, indicateur clé et seuil de réussite. Justifie les horaires pour une cible B2B.
      </PromptBox>
      <Callout title="Vérifiez" tone="yellow" icon="chart" cls={b.on(5)} style={{ flex: 1 }} size={22}>
        Les « meilleurs horaires » de l’IA sont génériques : vos propres statistiques font foi.
      </Callout>
    </div>
  </Frame>
);

// ─── Pitch et évaluation ────────────────────────────────────────────────────
const F_Pitch: Page = () => (
  <Frame mod={7} kind="exercice" label="Projet final · présentations">
    <Title>Pitch : 3 minutes pour convaincre la direction</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 560, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Eyebrow c={C.navy} size={20} cls={A.fade}>
        Votre déroulé
      </Eyebrow>
      <SynthRow n={1} tone="blue" d={100}>
        <strong>30 s</strong> · la cible et l’objectif
      </SynthRow>
      <SynthRow n={2} tone="violet" d={180}>
        <strong>45 s</strong> · le concept et un visuel
      </SynthRow>
      <SynthRow n={3} tone="teal" d={260}>
        <strong>45 s</strong> · deux contenus lus à voix haute
      </SynthRow>
      <SynthRow n={4} tone="green" d={340}>
        <strong>30 s</strong> · diffusion et indicateurs
      </SynthRow>
      <SynthRow n={5} tone="coral" d={420}>
        <strong>30 s</strong> · une correction faite sur l’IA
      </SynthRow>
      <Timer id="pitch" minutes={3} label="Pitch" compact cls={A.in} style={{ marginTop: 14, ...dl(500) }} />
    </div>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 740, top: 190, width: 560, display: 'flex', flexDirection: 'column', gap: 10, ...dl(200) }}>
        <Eyebrow c={C.navy} size={20} style={{ marginBottom: 4 }}>
          Grille du groupe
        </Eyebrow>
        <CheckItem id="pi1" size={22}>Cible précise et objectif chiffré</CheckItem>
        <CheckItem id="pi2" size={22}>Concept mémorisable</CheckItem>
        <CheckItem id="pi3" size={22}>Contenus adaptés à leurs canaux</CheckItem>
        <CheckItem id="pi4" size={22}>Visuels cohérents entre eux</CheckItem>
        <CheckItem id="pi5" size={22}>Diffusion et KPI réalistes</CheckItem>
        <CheckItem id="pi6" size={22}>Aucun fait inventé, risques maîtrisés</CheckItem>
      </div>
      <div style={{ position: 'absolute', left: 1360, top: 190, width: 440, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <CheckScore
          max={6}
          label="Score du binôme"
          style={{ boxShadow: SHADOW }}
          levels={[
            { min: 0, text: 'À retravailler.', tone: 'grey' },
            { min: 3, text: 'Solide : quelques ajustements.', tone: 'blue' },
            { min: 5, text: 'Prête à lancer !', tone: 'green' },
          ]}
        />
      </div>
    </Checklist>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(600) }}>
      Après chaque pitch : un point fort et une suggestion par le groupe. Réinitialisez la grille (re-cliquez) entre deux binômes.
    </Hint>
  </Frame>
);

// ─── La bibliothèque de prompts ─────────────────────────────────────────────
const FPrompt = ({ n, tone, title, children, d }: { n: number; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 18px', height: 112, boxSizing: 'border-box', ...dl(d) }}>
    <Num n={n} tone={tone} size={38} />
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 19, lineHeight: 1.38, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const F_Biblio: Page = () => (
  <Frame mod={7} label="Clôture">
    <Title>Votre bibliothèque : les 10 prompts à garder</Title>
    <Lede>Vous les avez tous testés aujourd’hui. Gardez-les dans un document partagé avec votre équipe, et améliorez-les.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <FPrompt n={1} tone="navy" title="Les 6 ingrédients" d={60}>Rôle, contexte, cible, objectif, format, ton & exemple.</FPrompt>
      <FPrompt n={2} tone="blue" title="Pose-moi d’abord tes questions" d={120}>Avant toute tâche importante.</FPrompt>
      <FPrompt n={3} tone="teal" title="Persona à partir de mes données" d={180}>Avec hypothèses signalées et sans stéréotypes.</FPrompt>
      <FPrompt n={4} tone="violet" title="Calendrier éditorial en tableau" d={240}>Persona + ligne éditoriale + temps forts.</FPrompt>
      <FPrompt n={5} tone="pink" title="Critique puis réécris" d={300}>« Note sur 10, puis réécris pour obtenir 9. »</FPrompt>
      <FPrompt n={6} tone="yellow" title="Réécris dans notre ton" d={360}>Charte + 2 exemples, faits identiques.</FPrompt>
      <FPrompt n={7} tone="coral" title="Prompt image + exclusions" d={420}>Sujet, style, composition, lumière, palette, format.</FPrompt>
      <FPrompt n={8} tone="green" title="Brief créatif en 8 rubriques" d={480}>Avec les questions encore ouvertes.</FPrompt>
      <FPrompt n={9} tone="blue" title="Prompt maître multicanal" d={540}>Contexte, matière, tâche, contraintes, tableau.</FPrompt>
      <FPrompt n={10} tone="navy" title="Analyse : montre tes calculs" d={600}>« … et dis-moi ce que tu ne sais pas. »</FPrompt>
    </div>
  </Frame>
);

// ─── Auto-positionnement de fin ─────────────────────────────────────────────
const F_AutoPos: Page = () => (
  <Frame mod={7} kind="exercice" label="Clôture">
    <Title>Auto-positionnement : votre point d’arrivée</Title>
    <Lede>Les mêmes huit affirmations qu’à 9 heures. Comparez avec votre score du matin.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="fp1">Citer trois usages concrets de l’IA dans mon métier</CheckItem>
        <CheckItem id="fp2">Écrire un prompt qui donne un résultat utilisable du premier coup</CheckItem>
        <CheckItem id="fp3">Faire générer un persona et un calendrier éditorial crédibles</CheckItem>
        <CheckItem id="fp4">Transformer une idée en post, email, article et script vidéo</CheckItem>
        <CheckItem id="fp5">Rédiger un prompt d’image et un brief créatif</CheckItem>
        <CheckItem id="fp6">Adapter un même message à LinkedIn, Instagram et une newsletter</CheckItem>
        <CheckItem id="fp7">Faire analyser des avis clients ou des résultats de campagne</CheckItem>
        <CheckItem id="fp8">Repérer une erreur, un biais ou un risque juridique dans un texte d’IA</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau d’arrivée"
          levels={[
            { min: 0, text: 'Reprenez les fiches synthèse : on en reparle.', tone: 'grey' },
            { min: 4, text: 'Bonne progression : pratiquez chaque semaine.', tone: 'blue' },
            { min: 7, text: 'Objectifs atteints : à vous de jouer !', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>Combien de points gagnés depuis ce matin ? Partagez votre progression au groupe.</div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Plan d’action ──────────────────────────────────────────────────────────
const FAct = ({ when, tone, icon, title, children, d }: { when: string; tone: Tone; icon: IconName; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '26px 28px', ...dl(d) }}>
    <Tag tone={tone} size={20}>
      {when}
    </Tag>
    <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={54} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy, lineHeight: 1.2 }}>{title}</div>
    </div>
    <div style={{ marginTop: 14, fontSize: 22, lineHeight: 1.45, color: C.soft }}>{children}</div>
  </div>
);

const F_Plan: Page = () => (
  <Frame mod={7} label="Clôture">
    <Title>Votre plan d’action : trois étapes, pas plus</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'flex', gap: 26 }}>
      <FAct when="Dès lundi" tone="blue" icon="book" title="Partager la bibliothèque" d={100}>
        Créez le document de prompts de l’équipe et ajoutez-y votre charte de ton.
      </FAct>
      <FAct when="Ce mois-ci" tone="violet" icon="calendar" title="Un usage par semaine" d={250}>
        Choisissez une tâche récurrente (posts, newsletter, avis) et mesurez le temps gagné.
      </FAct>
      <FAct when="Ce trimestre" tone="green" icon="shieldCheck" title="Des règles communes" d={400}>
        Outils autorisés, données interdites, relecture obligatoire, mention IA : écrivez-les.
      </FAct>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 640, width: 1680, boxSizing: 'border-box', background: G.navy, borderRadius: 22, padding: '30px 40px', display: 'flex', alignItems: 'center', gap: 30, color: '#fff', ...dl(600) }}>
      <Icon name="hand" size={60} color="#C9B6FF" />
      <div>
        <Eyebrow c="#C9B6FF" size={20}>
          Mon engagement
        </Eyebrow>
        <div style={{ marginTop: 8, fontSize: 30, lineHeight: 1.4 }}>Écrivez sur un post-it la première tâche que vous confierez à l’IA lundi… et collez-le sur votre écran.</div>
      </div>
    </div>
  </Frame>
);

// ─── Merci ──────────────────────────────────────────────────────────────────
const F_Merci: Page = () => (
  <Frame mod={7} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={110} r={46} cls={A.fade} />
    <div style={{ position: 'absolute', left: 390, top: 150, width: 860 }}>
      <h1 className={A.in} style={{ margin: 0, fontFamily: display, fontWeight: 800, fontSize: 120, lineHeight: 1.02, letterSpacing: '-0.02em', color: C.navy }}>
        Merci !
      </h1>
      <p className={A.in} style={{ margin: '28px 0 0', fontSize: 32, lineHeight: 1.45, color: C.soft, ...dl(150) }}>
        L’IA propose, <strong style={{ color: C.navy }}>le marketeur dispose</strong>. À vous de créer plus vite, et mieux.
      </p>
      <Portrait w={170} x={0} y={330} cls={A.in} />
      <div className={A.in} style={{ position: 'absolute', left: 230, top: 354, ...dl(300) }}>
        <Eyebrow c={C.muted} size={20}>
          Votre formateur
        </Eyebrow>
        <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 36, color: C.navy }}>{AUTHOR}</div>
        <div style={{ marginTop: 8, fontSize: 23, color: C.soft }}>Questions, retours d’expérience : je reste joignable après la formation.</div>
      </div>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1300, top: 160, width: 500, ...dl(300) }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Ce que j’utiliserai en premier…
      </Eyebrow>
      <Poll>
        <PollRow id="fm1" label="Calendrier éditorial" tone="blue" icon="calendar" />
        <PollRow id="fm2" label="Rédaction & déclinaisons" tone="violet" icon="pen" />
        <PollRow id="fm3" label="Visuels & briefs" tone="pink" icon="image" />
        <PollRow id="fm4" label="Analyse des résultats" tone="green" icon="chart" />
      </Poll>
      <div style={{ marginTop: 22, fontSize: 22, lineHeight: 1.45, color: C.muted }}>Pensez à remplir l’évaluation de la formation avant de partir.</div>
    </div>
    <Footer left={390} />
  </Frame>
);
F_Merci.transition = BLOOM;

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
  title: "IA pour le marketing & la communication",
  createdAt: '2026-10-12T21:30:00.000Z',
};

export default [
  O_Cover,
  O_Welcome,
  O_Poll,
  O_Objectifs,
  O_Programme,
  O_FilRouge,
  O_AutoPos,
  O_Setup,
  M1_Section,
  M1_Predire,
  M1_Usages,
  M1_Outils,
  M1_Formats,
  M1_Gain,
  M1_Limites,
  M1_Regles,
  M1_Quiz,
  M1_Synthese,
  M2_Section,
  M2_Prompt,
  M2_Iterer,
  M2_Cible,
  M2_Persona,
  M2_PersonaPrompt,
  M2_Idees,
  M2_Ligne,
  M2_Calendrier,
  M2_Qcm,
  M2_Atelier,
  M2_Exemple,
  M2_Synthese,
  M3_Section,
  M3_Cycle,
  M3_Article,
  M3_LinkedIn,
  M3_Social,
  M3_Newsletter,
  M3_Email,
  M3_PageWeb,
  M3_Slogans,
  M3_Script,
  M3_Ton,
  M3_Relecture,
  M3_Atelier,
  M3_Exemple,
  M3_Synthese,
  M4_Section,
  M4_ImgPrompt,
  M4_Styles,
  M4_Formats,
  M4_Pieges,
  M4_Brief,
  M4_Concept,
  M4_Presentation,
  M4_Qcm,
  M4_Atelier,
  M4_Synthese,
  M5_Section,
  M5_Canaux,
  M5_Codes,
  M5_Public,
  M5_Parcours,
  M5_Variables,
  M5_Longueur,
  M5_Maitre,
  M5_Quiz,
  M5_Atelier,
  M5_Synthese,
  M6_Section,
  M6_Donnees,
  M6_Graph,
  M6_Avis,
  M6_Commentaires,
  M6_Tendances,
  M6_Synthese,
  M6_Matrice,
  M6_Pieges,
  M6_Exercice,
  M6_Qcm,
  M6_Bilan,
  F_Section,
  F_Brief,
  F_Canevas,
  F_Diffusion,
  F_Pitch,
  F_Biblio,
  F_AutoPos,
  F_Plan,
  F_Merci,
] satisfies Page[];

// Speaker notes — one entry per page, same order as the default export.
export const notes: (string | undefined)[] = [
  `⏱ 2 min · COUVERTURE · 9:00

OBJECTIF — Accueillir et poser la promesse : produire plus vite sans perdre la qualité ni la voix de la marque.

DIRE — « Bonjour à toutes et à tous, bienvenue. Aujourd’hui, on va apprendre à faire de l’IA un vrai membre de l’équipe marketing. Regardez le schéma à droite : une seule idée, et six contenus qui en sortent, un article, un post LinkedIn, une publication Instagram, une newsletter, des visuels, un script vidéo. C’est exactement ce que vous saurez faire ce soir. Pas de magie : une méthode, des prompts, et votre regard de professionnel. »

TRANSITION — « Je me présente rapidement, et je vous dis comment va se passer la journée. »`,
  `⏱ 2 min · BIENVENUE

OBJECTIF — Fixer le contrat pédagogique : beaucoup de pratique, des livrables réutilisables.

DIRE — « Je suis Houssem Eddine LASSOUED… » (se présenter en 3 phrases : parcours, usage de l’IA dans des équipes marketing, ce qui vous passionne). « Sept heures, dont la moitié en ateliers. Six modules, chacun se termine par quelque chose que vous pourrez réutiliser lundi. Et à 16 heures, vous assemblez tout en une mini-campagne. Le contrat : je montre, vous tenez le clavier. Et retenez notre fil conducteur : l’IA propose, le marketeur dispose. »

INSISTER — Public débutant : rassurer. « Aucun prérequis technique. Si vous savez rédiger un brief à un stagiaire, vous savez écrire un prompt. »

TRANSITION — « Faisons connaissance. »`,
  `⏱ 4 min · TOUR DE TABLE (sondage)

OBJECTIF — Connaître les métiers et le niveau d’usage pour adapter les exemples et former des binômes.

DIRE — « Premier vote : votre métier. » Compter les mains, cliquer une ligne par vote. « Deuxième vote : votre usage de l’IA aujourd’hui. Pas de jugement : si vous avez essayé et été déçus, c’est très normal, et c’est même le meilleur point de départ. On va voir pourquoi les résultats étaient décevants. »

ANIMATION — Demander à 2 ou 3 personnes « déçues » ce qu’elles avaient demandé : en général un prompt d’une ligne. Le noter au tableau, on le réutilisera en M2. Former des binômes mixtes (contenu + stratégie).

TRANSITION — « Voici ce que vous saurez faire en partant. »`,
  `⏱ 2 min · OBJECTIFS

OBJECTIF — Présenter les huit objectifs du programme, regroupés en quatre gestes.

DIRE — « Le programme compte huit objectifs. Pour les retenir, je les range en quatre gestes. Comprendre : à quoi sert l’IA dans nos métiers, et comment s’en servir pour réfléchir, pas seulement pour écrire. Créer : des textes de tous formats, des briefs et des visuels. Adapter : un même contenu pour plusieurs publics et plusieurs canaux. Et enfin analyser et garantir : exploiter les données et les avis, et surtout vérifier ce que l’IA produit, parce que c’est votre signature qui est en bas du post, pas la sienne. »

TRANSITION — « Voici comment on enchaîne tout ça dans la journée. »`,
  `⏱ 2 min · PROGRAMME

OBJECTIF — Donner la carte de la journée et les horaires.

DIRE — « Le matin, on pense et on écrit : comprendre l’IA, définir une cible et des idées, puis produire des contenus. L’après-midi, on montre et on mesure : visuels, déclinaisons multicanales, analyse. Et à 16:05, le projet final : une mini-campagne complète. Le bandeau en haut à droite vous dit toujours où nous en sommes. »

ANIMATION — Horaires indicatifs : ajuster au rythme du groupe. Pauses 11:10 et 15:10, déjeuner 12:30 – 13:30.

TRANSITION — « Toute la journée, on suivra une marque : Ardente. »`,
  `⏱ 3 min · FIL ROUGE ARDENTE

OBJECTIF — Installer le cas fil rouge qui servira à tous les exemples et ateliers.

DIRE — « Ardente est une marque fictive : un torréfacteur lyonnais de café de spécialité. Trois offres : l’e-shop, un abonnement, et une nouvelle offre B2B, Ardente Bureau, le café en entreprise. Le problème est très réel : une seule chargée de communication, douze contenus par semaine, et personne pour analyser les résultats. La mission du jour : lancer Ardente Bureau en novembre. À droite, le carnet de campagne : chaque module ajoute une pièce. Si vous préférez travailler sur votre propre entreprise, c’est possible, avec des informations non confidentielles. »

ANIMATION — Demander : « Qui veut travailler sur sa propre marque ? » Noter les volontaires.

TRANSITION — « Avant de commencer, mesurons votre point de départ. »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT (exercice)

OBJECTIF — Mesurer le niveau de départ, exigence du dispositif d’évaluation.

DIRE — « Huit affirmations, une par compétence visée. Cochez seulement ce que vous savez faire aujourd’hui, sans aide. Notez votre score sur un coin de feuille : on refera exactement le même exercice à 17 heures. »

ANIMATION — Laisser chacun noter sur papier, puis faire cocher un volontaire à l’écran. Repérer les scores élevés : leur proposer les bonus d’atelier.

TRANSITION — « Dernière étape : vérifions vos outils. »`,
  `⏱ 4 min · CHECK-UP (minuteur 3 min)

OBJECTIF — Vérifier les accès aux outils et poser la règle de confidentialité.

DIRE — « Trois minutes. Un seul assistant IA suffit : celui que votre entreprise autorise. Pour les images, Canva, Firefly ou l’outil intégré à votre assistant. Ouvrez aussi un document vierge : ce sera votre bibliothèque de prompts. Chaque prompt qui fonctionne aujourd’hui, vous le collez dedans. Et la règle d’or : aucune donnée client réelle, aucun document confidentiel dans un outil grand public. Ce que vous tapez peut être conservé, voire utilisé pour entraîner le modèle selon l’offre. »

ANIMATION — Lancer le minuteur. Passer dans les rangs. Si un compte manque, le binôme partage un poste.

TRANSITION — « Tout le monde est prêt ? Module 1 : comprendre l’IA dans le marketing. »`,
  `⏱ 1 min · SECTION M1 · 9:20

OBJECTIF — Annoncer le module : un vocabulaire commun et une vision lucide de l’IA.

DIRE — « Premier module, quarante minutes pour comprendre. Comment fonctionne l’IA générative, sans jargon. Quels outils existent pour les textes, les images, la vidéo, les présentations. Et surtout, ce qu’elle fait bien et ce qu’elle fait mal, parce que c’est ça qui conditionne la façon de s’en servir. »

TRANSITION — « Commençons par le fonctionnement, en une minute. »`,
  `⏱ 4 min · PRÉDIRE LA SUITE (3 clics)

OBJECTIF — Faire comprendre que l’IA prédit du texte plausible, et en tirer les conséquences pratiques.

DIRE — « Je commence une phrase : “Ce matin, rien ne vaut un bon…” Vous avez tous complété dans votre tête. » → « L’IA fait exactement ça : elle calcule la probabilité de chaque mot possible. » → « Elle choisit “café”, puis recommence pour le mot suivant, des centaines de fois. Elle ne cherche pas dans une base de données, elle ne vérifie rien : elle produit ce qui est le plus plausible. » Montrer les trois cartes : « Plausible n’est pas vrai. Elle ne connaît pas votre marque. Et plus vous lui donnez de contexte, meilleure est la suite. » →

INSISTER — La phrase de la callout : excellent rédacteur de premier jet, pas une source d’information.

TRANSITION — « Alors concrètement, à quoi ça sert dans un service marketing ? »`,
  `⏱ 4 min · SIX USAGES (cartes à retourner)

OBJECTIF — Donner une carte mentale des usages, illustrée par le fil rouge.

DIRE — « Six verbes résument presque tout : idéer, rédiger, adapter, visualiser, analyser, personnaliser. Regardez l’ordre : ce n’est pas qu’un outil d’écriture. On peut l’utiliser avant d’écrire, pour réfléchir, et après, pour analyser. » Faire retourner une ou deux cartes par des participants, puis → pour tout retourner et lire les exemples Ardente.

ANIMATION — Demander : « Lequel de ces six usages vous ferait gagner le plus de temps dès lundi ? » Faire voter à main levée, noter le gagnant.

TRANSITION — « Pour chaque usage, il existe des outils. »`,
  `⏱ 5 min · FAMILLES D’OUTILS (onglets)

OBJECTIF — Donner un panorama des outils, sans en faire un catalogue.

DIRE — « Cinq familles. Les assistants conversationnels : ChatGPT, Copilot, Gemini, Claude, Le Chat. Ils font presque tout. » Cliquer Images : « Pour les visuels, les assistants génèrent aussi des images, mais des outils spécialisés comme Midjourney, Firefly ou Canva vont plus loin. » Cliquer Vidéo, Présentations, puis Intégrés : « Et souvent, l’IA est déjà dans vos outils : votre CRM, votre outil d’emailing, Canva, Word. »

INSISTER — La callout : utilisez la version professionnelle autorisée. Dans les offres entreprise, vos données ne servent pas à entraîner le modèle ; dans les versions gratuites, ce n’est pas toujours le cas. Les noms changent vite : ne vous attachez pas à un outil, attachez-vous à la méthode.

TRANSITION — « Selon le format, la maturité n’est pas la même. »`,
  `⏱ 3 min · QUATRE FORMATS (4 clics)

OBJECTIF — Calibrer les attentes par format.

DIRE — → « Les textes : très mature. Le risque, ce sont les faits inventés et le ton générique. » → « Les images : mature. Mais le texte dans l’image, les mains, les logos posent encore problème, et attention aux ressemblances. » → « La vidéo progresse très vite, mais la cohérence entre plans et le droit à l’image restent des sujets. » → « Les présentations : un bon premier jet, à reprendre dans votre charte. »

TRANSITION — « Concrètement, combien de temps peut-on gagner ? »`,
  `⏱ 4 min · SIMULATEUR DE GAIN (interactif)

OBJECTIF — Montrer que le gain est réel mais dépend du temps de relecture.

DIRE — « Prenons Ardente : 12 contenus par semaine, 45 minutes chacun. Si l’IA fait gagner la moitié du temps de premier jet et qu’on ajoute 10 minutes de relecture, on libère environ 20 heures par mois. » Puis pousser la relecture à 30 minutes : « Regardez : le gain fond. Si votre prompt est mauvais, vous passez votre temps à corriger. C’est pour ça que le module 2 est consacré au prompt. »

ANIMATION — Demander à un participant ses propres chiffres et les régler en direct.

TRANSITION — « Ce temps de relecture, il est indispensable. Voyons pourquoi. »`,
  `⏱ 5 min · LE POST PIÉGÉ (exercice, 6 clics)

OBJECTIF — Entraîner l’œil critique : repérer erreurs, risques juridiques et faiblesses de ton.

DIRE — « Ce post a été généré en trois secondes avec un prompt d’une ligne. Il y a six problèmes. Une minute, en binôme : trouvez-les. » Puis → pour chaque problème. 1 : « La formule passe-partout, signature d’un texte d’IA. » 2 : « “Neutre en carbone” : allégation très encadrée en France, et interdite dans l’UE lorsqu’elle repose sur la compensation carbone. » 3 : « Un chiffre sans source. » 4 : « Une citation inventée, et incohérente : Ardente a été fondée en 2016. » 5 : « Une promesse commerciale que personne n’a validée. » 6 : « Des hashtags génériques en anglais pour une cible B2B lyonnaise. »

INSISTER — Les problèmes 2, 4 et 5 ne sont pas des questions de style : ils engagent juridiquement la marque.

TRANSITION — « D’où nos six règles d’or. »`,
  `⏱ 3 min · SIX RÈGLES D’OR

OBJECTIF — Poser le cadre juridique et éthique, sans jargon.

DIRE — « Confidentialité : pas de données clients dans un outil grand public. Relecture humaine : systématique. Publicité loyale : la marque reste responsable de ce qu’elle publie, même si c’est l’IA qui l’a écrit. Droits : ne demandez pas “dans le style de” un illustrateur vivant ou une marque concurrente. Transparence : l’AI Act européen impose de signaler les images et vidéos réalistes générées ou manipulées par IA. Biais : l’IA reproduit les stéréotypes ; vos personas et vos visuels doivent être relus avec ce filtre. »

ANIMATION — Demander si l’entreprise des participants a une charte d’usage de l’IA. Si oui, elle prime.

TRANSITION — « Vérifions que c’est acquis : quiz flash. »`,
  `⏱ 4 min · QUIZ FLASH (5 questions)

OBJECTIF — Ancrer les notions du module.

DIRE — « Cinq affirmations, vote à main levée, puis on clique. » Après chaque réponse, lire l’explication. Insister sur la question 3 (données clients) : c’est l’erreur la plus fréquente et la plus grave.

ANIMATION — Le compteur de droite affiche les bonnes réponses du premier coup.

TRANSITION — « Je résume. »`,
  `⏱ 1 min · SYNTHÈSE M1

OBJECTIF — Clore le module et relier au carnet de campagne.

DIRE — « Cinq idées à retenir. » Les lire. « Dans votre bibliothèque de prompts, notez les six réflexes de vérification : faits, ton, promesses, droits, transparence, biais. Ils vous serviront toute la journée. »

TRANSITION — « Maintenant qu’on sait ce qu’est l’outil, apprenons à lui parler. Module 2 : stratégie et création d’idées. »`,
  `⏱ 1 min · SECTION M2 · 10:00

OBJECTIF — Annoncer le module : bien parler à l’IA, puis l’utiliser pour réfléchir avant d’écrire.

DIRE — « Deuxième module, le plus important de la matinée. D’abord la méthode : comment écrire un prompt qui donne un résultat utile du premier coup. Ensuite, on s’en sert pour la stratégie : définir une cible, créer des personas, trouver des idées, construire une ligne éditoriale et générer un calendrier. Et vous finirez par votre propre calendrier d’un mois, en atelier. »

TRANSITION — « On commence par la recette. »`,
  `⏱ 6 min · SIX INGRÉDIENTS (interactif)

OBJECTIF — Faire découvrir la méthode du prompt en six ingrédients, par la démonstration.

DIRE — « Voici le prompt typique de quelqu’un qui a été déçu par l’IA : “Écris un post LinkedIn sur notre offre de café en entreprise.” Résultat : générique. » Activer Rôle et Contexte : « On dit qui parle et de quoi on parle. C’est déjà mieux, mais plat. » Activer Cible et Objectif : « À qui, pour obtenir quoi. Là, ça devient utilisable. » Activer Format et Ton : « Et avec un exemple de notre style, le texte ressemble enfin à la marque. »

INSISTER — C’est exactement ce que vous feriez avec un stagiaire ou une agence : un brief. Un prompt, c’est un brief.

ANIMATION — Rappeler le prompt « décevant » noté pendant le tour de table et le réécrire ensemble avec les six ingrédients.

TRANSITION — « Et même avec un bon prompt, on ne s’arrête pas au premier résultat. »`,
  `⏱ 3 min · LA CONVERSATION (4 clics)

OBJECTIF — Montrer l’itération : questions, variantes, critique, réécriture.

DIRE — « Première astuce : demandez-lui de vous poser des questions avant de répondre. » → « Elle demande ce qui lui manque : le prix, un client témoin. » → « Demandez toujours plusieurs variantes, très différentes. » → « Faites-la critiquer son propre texte, avec un rôle exigeant : c’est étonnamment efficace. » → « Et enfin les contraintes de finition : plus court, sans emoji, finir par une question. »

INSISTER — Le bon prompt, une fois trouvé, se range dans la bibliothèque : c’est elle qui fait gagner du temps la semaine suivante.

TRANSITION — « Appliquons ça à la stratégie : la cible. »`,
  `⏱ 4 min · DÉFINIR UNE CIBLE (3 clics)

OBJECTIF — Montrer comment l’IA aide à resserrer une cible, et où s’arrête son rôle.

DIRE — « “Tout le monde boit du café” : vrai, mais inutile. » → « Les entreprises : mieux. » → « Les PME lyonnaises de 20 à 150 salariés : on a une taille, une zone, un besoin. » → « Et dans ces PME, les personnes qui choisissent et achètent : office managers et RH. » Montrer le prompt : « On lui donne nos données de vente anonymisées et on lui demande de nous questionner d’abord. »

INSISTER — L’IA propose des segments, ce sont vos données et votre terrain qui tranchent.

TRANSITION — « Une cible, c’est abstrait. Donnons-lui un visage. »`,
  `⏱ 4 min · PERSONAS (onglets)

OBJECTIF — Montrer des personas exploitables et leur utilité pour le message.

DIRE — « Voici trois personas générés puis retravaillés. Claire, office manager : elle veut que les équipes reviennent au bureau sans exploser le budget. » Cliquer sur Hugo : « Hugo, fondateur de start-up, sensible aux valeurs mais méfiant envers le discours responsable non prouvé. » Cliquer sur Nadia : « Nadia, DRH d’une ETI de trois sites : achats centralisés, besoin de références. » « Regardez la dernière case : le message n’est pas le même pour les trois. C’est ça, l’intérêt d’un persona. »

ANIMATION — Demander au groupe : « Lequel de ces trois personas choisiriez-vous en priorité pour un lancement en novembre, et pourquoi ? »

TRANSITION — « Comment les obtenir, et comment ne pas se faire piéger ? »`,
  `⏱ 3 min · PROMPT PERSONA ET PIÈGES

OBJECTIF — Donner un prompt réutilisable et les précautions associées.

DIRE — « Le prompt : un rôle de planneur stratégique, nos informations, la liste des rubriques attendues. Et une consigne précieuse : signale ce qui est une hypothèse. » Lire les trois pièges : « C’est une hypothèse, pas une vérité. L’IA adore les clichés : un métier, un âge, un genre. Et les détails trop précis sont souvent inventés. »

INSISTER — L’astuce : donner des verbatims réels anonymisés, par exemple des extraits d’échanges commerciaux. Le persona devient beaucoup plus juste.

TRANSITION — « Avec une cible et des personas, on peut chercher des idées. »`,
  `⏱ 4 min · MACHINE À IDÉES (interactif)

OBJECTIF — Faire vivre la technique du croisement angles × formats × cibles × moments.

DIRE — « Une technique très simple pour ne jamais être à court d’idées : croiser. Un angle, un format, une cible, un moment. » Cliquer « Nouvelle idée » plusieurs fois et lire. « Certaines sont excellentes, d’autres absurdes : c’est normal. Avec l’IA, on fait pareil : on lui demande trente croisements et on garde les trois meilleurs. » Faire voter la salle : « On la garde ? »

INSISTER — Les trois cartes de droite : quantité puis tri, partir des questions clients, caler sur les temps forts.

TRANSITION — « Pour que ces idées forment un tout, il faut une ligne éditoriale. »`,
  `⏱ 4 min · LIGNE ÉDITORIALE

OBJECTIF — Montrer qu’une ligne éditoriale = piliers + ton, et comment l’IA aide à la formaliser.

DIRE — « Une ligne éditoriale répond à deux questions : de quoi parle-t-on, et comment. De quoi : cinq piliers, avec un poids. Chez Ardente, l’expertise café pèse 30 %, les offres seulement 15 % : on ne parle pas que de vendre. Comment : une promesse, un ton, et une liste de mots qu’on dit ou qu’on ne dit pas. »

INSISTER — L’astuce du bas : donnez à l’IA vos dix meilleurs posts et demandez-lui d’en déduire votre ligne. Ensuite, collez cette charte en tête de chaque prompt : c’est le secret pour que tout sonne « marque ».

TRANSITION — « On a tout pour générer le calendrier. »`,
  `⏱ 4 min · CALENDRIER ÉDITORIAL (4 clics)

OBJECTIF — Montrer un calendrier d’un mois généré à partir des éléments précédents.

DIRE — « Novembre chez Ardente. Quatre semaines avec une logique : teasing, lancement, preuves, conversion. » → révéler semaine par semaine. « Les couleurs correspondent aux piliers : on voit tout de suite si on parle trop de l’offre. » Montrer le prompt en bas : « Il tient en trois lignes parce que le persona et la ligne éditoriale sont déjà dans la conversation. »

INSISTER — Généré en 2 minutes, ajusté en 15 : le temps gagné est dans la structure, pas dans la relecture.

TRANSITION — « Petit QCM avant l’atelier. »`,
  `⏱ 2 min · QCM 1 (personas)

OBJECTIF — Vérifier la bonne posture face à un persona généré.

DIRE — « Vote à main levée. » Puis cliquer les réponses. Bonne réponse : B. « Un persona généré est une hypothèse de travail, à confronter à vos données. »

TRANSITION — « À vous : atelier 1. »`,
  `⏱ 30 min · ATELIER 1 — CALENDRIER D’UN MOIS (minuteur)

OBJECTIF — Produire un calendrier éditorial complet avec l’IA.

DIRE — « Trente minutes, en binôme, sur Ardente ou sur votre marque. Quatre étapes : le prompt cible et persona avec les six ingrédients ; trente idées dont vous gardez douze ; la ligne éditoriale ; puis le calendrier en tableau, que vous faites critiquer par l’IA. Vos livrables sont à droite. Et chaque prompt qui marche va dans votre bibliothèque. »

ANIMATION — Lancer le minuteur. Passer dans les binômes à 10 minutes : vérifier que le persona est précis. À 20 minutes : vérifier qu’ils demandent un tableau. Proposer le bonus CSV aux plus rapides. Faire cocher les critères de réussite à la fin.

TRANSITION — « Regardons un exemple de restitution. »`,
  `⏱ 4 min · EXEMPLE DE RESTITUTION

OBJECTIF — Montrer un résultat type et l’œil critique attendu.

DIRE — « Voici ce que l’IA a produit pour Ardente après deux relances. Ce qui est bien : la progression, un appel à l’action sur chaque ligne. Ce qui est à corriger : le 11 novembre est férié, l’IA ne l’a pas vu. Et le témoignage client doit être réel, validé par le client. L’IA ne peut pas inventer un client. »

ANIMATION — Demander à un ou deux binômes de montrer une ligne de leur calendrier dont ils sont fiers, et une correction qu’ils ont faite.

TRANSITION — « Je résume le module. »`,
  `⏱ 1 min · SYNTHÈSE M2

OBJECTIF — Clore le module, relier au carnet de campagne.

DIRE — « Cinq idées. » Les lire. « Vous avez maintenant une cible, un persona, une ligne éditoriale et un calendrier. C’est la colonne vertébrale de votre mini-campagne. »

TRANSITION — « Pause de 15 minutes. Au retour : on écrit les contenus. »`,
  `⏱ 1 min · SECTION M3 · 11:25

OBJECTIF — Annoncer le module : produire tous les formats avec une méthode commune.

DIRE — « Troisième module : on écrit. Articles, posts LinkedIn, publications sur les réseaux, newsletters, emails, pages web, slogans et scripts vidéo. Huit formats, mais une seule méthode, que je vous montre tout de suite. Puis on voit les codes propres à chaque format. Et l’atelier 2 : transformer une idée en plusieurs contenus. »

TRANSITION — « D’abord, la méthode commune. »`,
  `⏱ 4 min · LE CYCLE DE CRÉATION (6 clics)

OBJECTIF — Installer le cycle brief → jet → critique → réécriture → validation.

DIRE — → « Le brief, c’est vous : les six ingrédients et la charte. » → « Le premier jet, c’est l’IA, et toujours en plusieurs variantes. » → « La critique : on demande à l’IA de se relire avec une grille, et on donne notre avis. » → « La réécriture, avec des consignes précises. » → « La validation, c’est vous, toujours. » → « Et entre critique et réécriture, on boucle deux ou trois fois. C’est là que se fait la qualité. »

INSISTER — Le prompt de critique en bas : à copier dans la bibliothèque, il sert pour tous les formats.

TRANSITION — « Appliquons ce cycle au format le plus long : l’article. »`,
  `⏱ 4 min · ARTICLE DE BLOG (onglets)

OBJECTIF — Montrer la rédaction d’un article en étapes : prompt, plan, introduction, référencement.

DIRE — Onglet 1 : « On demande d’abord un plan, pas un article entier. Notez la dernière consigne : signaler les chiffres à sourcer. » Onglet 2 : « Le plan est clair, l’offre n’arrive qu’à la fin. Mais la partie 1 va appeler des statistiques : il faudra une vraie source. » Onglet 3 : « On demande trois introductions et on garde la meilleure. Votre touche : une anecdote vraie. » Onglet 4 : « Et on profite de l’IA pour le référencement : mots-clés, méta-description, textes alternatifs des images. »

INSISTER — Plan d’abord, puis section par section : un article généré d’un bloc est presque toujours plat.

TRANSITION — « Format beaucoup plus court, mais plus exigeant : le post LinkedIn. »`,
  `⏱ 4 min · POST LINKEDIN (interactif)

OBJECTIF — Montrer l’importance de l’accroche et l’anatomie d’un post.

DIRE — « Sur LinkedIn, on ne voit que deux lignes avant “voir plus”. Tout se joue là. L’IA nous a proposé trois accroches : une question, un chiffre concret, une anecdote. » Cliquer chacune : « Laquelle vous donne envie de cliquer sur “voir plus” ? » Faire voter. « À droite, l’anatomie : accroche courte avec une tension, corps aéré, une preuve, un seul appel à l’action et trois hashtags maximum. »

INSISTER — L’anecdote client est la plus forte… à condition d’être vraie et que le client ait donné son accord.

TRANSITION — « Les autres réseaux ont d’autres codes. »`,
  `⏱ 3 min · RÉSEAUX SOCIAUX

OBJECTIF — Différencier les codes par réseau.

DIRE — « Sur Instagram, l’image passe d’abord, la légende complète, une question engage, des hashtags de niche en français. » Montrer la colonne de droite : « Facebook pour la communauté locale, TikTok et Reels avec une accroche dans les deux premières secondes et des sous-titres, Threads ou Bluesky pour des phrases courtes et un avis tranché. »

INSISTER — Le prompt du bas : demandez les variantes par réseau en une fois, l’IA connaît bien ces codes. À vous de vérifier qu’ils correspondent à votre audience.

TRANSITION — « Passons aux canaux que vous maîtrisez : la newsletter. »`,
  `⏱ 3 min · NEWSLETTER (6 clics)

OBJECTIF — Montrer la structure d’une newsletter efficace et le prompt correspondant.

DIRE — → « Objet et pré-en-tête : c’est ce qui fait ouvrir. » → « Une accroche personnalisée. » → « Une seule idée principale. » → « Une preuve. » → « Un seul bouton : un objectif, une action. » → « Et le pied de page légal. » Montrer le prompt : « Notez la variable prénom entre accolades : l’IA rédige le modèle, votre outil d’emailing remplit les prénoms. »

INSISTER — RGPD : l’IA n’a pas besoin de votre fichier de contacts pour rédiger la newsletter.

TRANSITION — « Et dans un email, l’objet décide de tout. Testons. »`,
  `⏱ 4 min · TESTEUR D’OBJETS (interactif)

OBJECTIF — Apprendre à évaluer un objet d’email.

DIRE — « Quatre objets générés par l’IA. » Cliquer A : « Aucun bénéfice, et sur mobile on ne voit même pas la fin. » Cliquer D : « Majuscules, points d’exclamation, “gratuit” : direction les indésirables. » Cliquer B : « Curiosité, émotion : pas mal, un peu négatif. » Cliquer C : « Personnalisé, un bénéfice clair, une question : le meilleur. » « Et la vraie méthode : faites générer dix objets, gardez les deux meilleurs, et laissez un test A/B trancher. »

ANIMATION — Demander à la salle de voter avant chaque clic.

TRANSITION — « Quand l’email fonctionne, il renvoie vers une page web. »`,
  `⏱ 3 min · PAGE WEB (5 clics)

OBJECTIF — Montrer qu’on demande d’abord une structure, puis les textes.

DIRE — « Pour une page d’atterrissage, on demande la structure avant les mots, avec un modèle classique : AIDA. » → Attention : la promesse. → Intérêt : les bénéfices. → Preuve : la confiance. → Désir : les objections, sous forme de FAQ. → Action : un bouton. « Le prompt demande aussi les cinq objections probables d’un office manager : c’est souvent la partie la plus utile. »

INSISTER — Prix, conditions, mentions légales : toujours fournis par vous, jamais inventés par l’IA.

TRANSITION — « Format très court maintenant, et très créatif : le slogan. »`,
  `⏱ 4 min · MACHINE À SLOGANS (interactif)

OBJECTIF — Générer large, choisir avec des critères, repérer les pièges.

DIRE — « Huit propositions de l’IA. » Faire défiler avec « Suivant ». « “Faites infuser vos idées” : on infuse du thé, pas du café ! L’IA ne vérifie pas le sens. » « “Le meilleur café de France” : allégation invérifiable. » « “Du grain à moudre” : expression déjà très utilisée. » Faire garder trois favoris par vote. « La grille de choix : court, porteur d’un bénéfice, vrai, et disponible : avant d’adopter un slogan, recherche d’antériorité à l’INPI. »

TRANSITION — « Ce slogan, on va le mettre en images. D’abord, en vidéo. »`,
  `⏱ 3 min · SCRIPT VIDÉO (4 clics)

OBJECTIF — Montrer un script structuré en tableau, prêt à tourner.

DIRE — « Demandez toujours un tableau : temps, image, voix off, texte à l’écran. » → « Trois secondes pour accrocher. » → « Le problème. » → « La solution. » → « L’appel à l’action. » « Avec ce tableau, n’importe qui peut organiser le tournage, ou le donner à un outil de montage. »

INSISTER — Sous-titres indispensables. Et droit à l’image : autorisation écrite des personnes filmées ; si avatar ou voix de synthèse, le signaler.

TRANSITION — « Dernier réglage, le plus subtil : le ton. »`,
  `⏱ 3 min · CURSEUR DE TON (interactif)

OBJECTIF — Faire sentir l’impact du ton et la manière de le piloter.

DIRE — « Même information, même offre. » Faire glisser de gauche à droite et lire chaque version. « Institutionnel : correct mais froid. Professionnel : efficace. Chaleureux : c’est le ton d’Ardente. Décontracté : possible sur Instagram. Familier : hors charte. » « Comment obtenir le bon ton ? Pas avec des adjectifs comme “sympa” ou “dynamique”, mais avec la charte et deux exemples de votre style. Et une consigne : garder les faits identiques. »

TRANSITION — « Avant de publier quoi que ce soit, une dernière étape. »`,
  `⏱ 3 min · GRILLE DE RELECTURE (exercice)

OBJECTIF — Donner la grille qualité avant publication (objectif « vérifier, corriger, améliorer »).

DIRE — « Huit critères. Exact et honnête comptent double : ce sont eux qui engagent la marque. Fidèle à la charte, utile pour la cible, original, inclusif, propre, transparent. » Faire appliquer la grille au post LinkedIn vu tout à l’heure, en cochant ensemble.

INSISTER — Cette grille va dans votre bibliothèque. Vous pouvez même la donner à l’IA pour une pré-relecture, mais c’est vous qui cochez.

TRANSITION — « À vous : atelier 2. »`,
  `⏱ 25 min · ATELIER 2 — UNE IDÉE, PLUSIEURS CONTENUS (minuteur)

OBJECTIF — Décliner une idée en quatre contenus cohérents et relus.

DIRE — « Vingt-cinq minutes. Prenez une idée de votre calendrier. Collez la charte en tête de conversation. Commencez par l’article, c’est le contenu pivot. Puis demandez les déclinaisons une par une : post LinkedIn, email avec trois objets, et au choix un script vidéo ou trois slogans. Passez chaque texte à la grille. »

ANIMATION — Lancer le minuteur. À 10 minutes, vérifier que l’article pivot existe. À 20 minutes, rappeler la grille de relecture. Bonus pour les plus rapides : faire jouer le persona par l’IA.

TRANSITION — « Regardons un exemple de restitution. »`,
  `⏱ 3 min · EXEMPLE : UNE IDÉE, SIX CONTENUS

OBJECTIF — Montrer la cohérence d’une déclinaison complète.

DIRE — « L’idée : la pause café débloque les réunions. Six contenus : article, post, carrousel, email, script, slogan. Le message reste le même, la forme change. Quarante-cinq minutes, relecture comprise, contre une demi-journée sans IA. »

ANIMATION — Faire présenter un binôme : son idée, deux contenus, et une correction faite grâce à la grille.

TRANSITION — « Je résume avant la pause déjeuner. »`,
  `⏱ 1 min · SYNTHÈSE M3

OBJECTIF — Clore la matinée.

DIRE — « Cinq idées. » Les lire. « Ce matin, vous avez une cible, un calendrier, et des contenus relus. Cet après-midi : les visuels, la personnalisation, l’analyse, et la mini-campagne. Bon appétit, reprise à 13:30. »

TRANSITION — Pause déjeuner.`,
  `⏱ 1 min · SECTION M4 · 13:30

OBJECTIF — Relancer l’après-midi et annoncer le module visuel.

DIRE — « Bon retour ! Cet après-midi, on montre et on mesure. On commence par les visuels : comment générer une image utile, quels formats, quels pièges, comment rédiger un brief créatif, comment décliner un concept sur tous les supports, et comment produire une présentation. L’atelier 3 : un concept de campagne et ses supports. »

TRANSITION — « Comme pour le texte, une image se brief. »`,
  `⏱ 5 min · PROMPT IMAGE (interactif)

OBJECTIF — Montrer qu’un prompt d’image a ses propres ingrédients.

DIRE — « Prompt de départ : une tasse de café sur un bureau. Résultat : une image de banque, grise, avec un faux texte illisible. » Activer Style : « On choisit un rendu. » Composition : « Un cadrage, et de l’espace pour le texte. » Lumière : « Une ambiance. » Palette : « Nos couleurs de marque. » Format : « Le ratio du support. » Exclusions : « Sans texte, sans logo, sans personne : le faux texte disparaît. »

INSISTER — Le slogan et le logo s’ajoutent après, dans Canva ou votre outil de mise en page. L’IA écrit encore mal dans les images et ne connaît pas votre vrai logo.

TRANSITION — « Le style, justement : il y a quatre grandes familles. »`,
  `⏱ 3 min · STYLES (cartes à retourner)

OBJECTIF — Donner un vocabulaire de styles et la règle de cohérence.

DIRE — « Même tasse, quatre styles : photo produit, illustration plate, 3D douce, aquarelle. Chaque style a son usage. Retournons les cartes : voici les mots-clés à mettre dans le prompt. » → pour tout retourner. « Comme une ligne éditoriale : une marque choisit un ou deux styles, pas dix. »

INSISTER — Droits : décrivez le style avec des mots, ne demandez pas « à la manière de » un illustrateur vivant ou une marque.

TRANSITION — « Deuxième décision : le format. »`,
  `⏱ 3 min · FORMATS (6 clics)

OBJECTIF — Associer chaque ratio à son support.

DIRE — → « Le carré, le post classique. » → « Le 4:5, qui occupe plus d’écran sur mobile. » → « Le 9:16, stories, Reels, TikTok. » → « Le 16:9, vidéo et présentation. » → « Le 1,91:1, lien partagé et annonces. » → « Et la bannière LinkedIn, très étirée. »

INSISTER — L’astuce : générer le visuel principal avec de l’espace autour, puis utiliser l’extension d’image pour les autres formats, plutôt que recadrer.

TRANSITION — « Avant de publier un visuel, on le contrôle. Jeu des erreurs. »`,
  `⏱ 4 min · PIÈGES D’UNE IMAGE (exercice, pastilles cliquables)

OBJECTIF — Entraîner l’œil critique sur une image générée.

DIRE — « Voici un visuel généré, volontairement raté. En binôme, 45 secondes : combien de problèmes voyez-vous ? » Puis cliquer les pastilles une à une (re-cliquer pour refermer avant la suivante). 1 : le nom de marque mal écrit. 2 : un logo trop proche d’une marque connue, risque de contrefaçon. 3 : six doigts. 4 : une équipe uniforme, aucun réalisme ni diversité. 5 : des allégations interdites sans preuve. 6 : ce n’est pas le vrai produit.

INSISTER — La carte de droite : pour montrer le produit réel, on part d’une vraie photo et l’IA crée le décor. Et une image réaliste de personnes ou de lieux se signale comme générée par IA.

TRANSITION — « Pour éviter ces problèmes en amont : un bon brief. »`,
  `⏱ 4 min · BRIEF CRÉATIF (8 clics)

OBJECTIF — Donner la structure d’un brief créatif et le faire rédiger avec l’IA.

DIRE — « Huit rubriques, sur une page. » → les révéler une à une en lisant l’exemple Ardente. « Ce document, vous pouvez l’envoyer à une agence, à un graphiste… ou vous en servir pour piloter l’IA. » Montrer le prompt : « Après une conversation, on lui demande de rédiger le brief, puis de lister les questions encore ouvertes : très utile pour voir ce qu’on n’a pas décidé. »

INSISTER — Un objectif flou donne des visuels flous : 150 demandes de dégustation, pas « faire connaître ».

TRANSITION — « Le brief validé, on crée le concept et on le décline. »`,
  `⏱ 4 min · DÉCLINER UN CONCEPT (4 clics)

OBJECTIF — Montrer la cohérence d’une déclinaison multi-supports.

DIRE — « Le concept : “La pause qui compte.” Une tasse vue de dessus, une bulle de dialogue dans la mousse : le café qui fait parler. Une palette, des constantes. » → le post LinkedIn. → la story, en version sombre. → la bannière web. → l’affiche A4 avec un QR code. « Quatre supports, et on reconnaît la même campagne au premier coup d’œil. »

INSISTER — Le prompt de déclinaison : garder exactement sujet, palette, style ; ne changer que la composition.

TRANSITION — « Dernier support visuel : la présentation commerciale. »`,
  `⏱ 4 min · PRÉSENTATIONS (6 clics)

OBJECTIF — Produire le fond d’une présentation avec l’IA.

DIRE — « Le prompt demande six slides, chacune avec un titre-message : une phrase qui affirme, pas un mot-clé. » → révéler les six vignettes. « Lisez seulement les titres : vous avez toute l’histoire, du problème à la proposition d’action. » « Les outils comme Gamma, Copilot dans PowerPoint ou Canva font un premier jet en cinq minutes. Mais on reprend toujours dans le modèle de l’entreprise, avec les vrais chiffres. »

TRANSITION — « Petit QCM avant l’atelier. »`,
  `⏱ 2 min · QCM 2 (visuels)

OBJECTIF — Vérifier la bonne pratique pour montrer un produit réel.

DIRE — « Vote à main levée. » Bonne réponse : B. « Produit réel photographié, décor généré : fidélité et créativité. Générer le produit lui-même, c’est risquer de montrer quelque chose qui n’existe pas. »

TRANSITION — « À vous : atelier 3. »`,
  `⏱ 25 min · ATELIER 3 — CONCEPT ET SUPPORTS (minuteur)

OBJECTIF — Produire un concept de campagne, son brief et au moins trois visuels cohérents.

DIRE — « Vingt-cinq minutes. Partez de votre slogan du module 3. Demandez dix concepts, gardez-en un. Faites rédiger le brief créatif. Générez le visuel principal avec les ingrédients du prompt image. Déclinez-le en gardant sujet, palette et style. Et ajoutez le slogan et le logo dans votre outil de mise en page. »

ANIMATION — Lancer le minuteur. Vérifier à 10 minutes que chaque binôme a un concept en une phrase. Si un outil d’image n’est pas disponible, accepter des prompts d’image rédigés + maquettes papier. Faire passer la check-list visuelle avant la fin.

TRANSITION — « Je résume. »`,
  `⏱ 1 min · SYNTHÈSE M4

OBJECTIF — Clore le module, relier au carnet de campagne.

DIRE — « Cinq idées. » Les lire. « Votre campagne a maintenant un concept, un brief et des visuels. Prochaine étape : adapter les messages à chaque canal et chaque public. »

TRANSITION — « Module 5 : personnalisation et adaptation. »`,
  `⏱ 1 min · SECTION M5 · 14:20

OBJECTIF — Annoncer le module : adapter un même contenu à plusieurs canaux et publics.

DIRE — « Module 5 : la personnalisation. Le programme dit : “à partir d’un même contenu”, LinkedIn, Instagram, newsletter, email, article, présentation commerciale. C’est là que l’IA fait gagner le plus de temps. Mais aussi : adapter à chaque public, à chaque étape du parcours, et personnaliser à grande échelle sans prendre de risque avec les données. »

TRANSITION — « Prenons un seul message et regardons-le sur six canaux. »`,
  `⏱ 6 min · UN MESSAGE, SIX CANAUX (onglets)

OBJECTIF — Montrer concrètement la même idée déclinée, et ce qui change d’un canal à l’autre.

DIRE — « En haut, le message pivot : il ne change jamais. » Cliquer chaque onglet. LinkedIn : « accroche en question, angle professionnel. » Instagram : « le visuel porte le message, interaction par sondage ou tag. » Newsletter : « des abonnés, un ton complice, un bouton. » Email direct : « une personne précise, 80 mots, une question fermée. » Article : « utile avant d’être commercial. » Présentation : « un titre-message, des faits. »

INSISTER — La colonne de droite indique aussi le KPI : on ne mesure pas la même chose partout. C’est le lien avec le module 6.

TRANSITION — « Ces codes, on peut les résumer dans une grille. »`,
  `⏱ 3 min · GRILLE DES CODES (6 clics)

OBJECTIF — Donner un outil réutilisable : la grille des codes par canal.

DIRE — → révéler canal par canal en lisant longueur, ton, forme, appel à l’action. « Ces chiffres sont des repères, pas des règles absolues : adaptez-les à votre audience et à vos statistiques. »

INSISTER — L’astuce : coller la grille dans la conversation. L’IA respecte remarquablement bien un cadre explicite.

TRANSITION — « Adapter au canal, c’est la forme. Adapter au public, c’est le fond. »`,
  `⏱ 4 min · ADAPTER AU PUBLIC (interactif)

OBJECTIF — Montrer une personnalisation par persona qui ne touche pas aux faits.

DIRE — « Le même email pour nos trois personas. » Cliquer Claire : « sans gestion, entretien inclus. » Hugo : « culture d’équipe, traçabilité. » Nadia : « multi-sites, interlocuteur unique, bilan trimestriel. » « Les passages surlignés sont ceux que l’IA a adaptés. Le reste, l’offre, les faits, la signature, ne bouge pas. »

INSISTER — Le prompt du bas : on dit explicitement ce qu’on ne doit pas modifier.

ANIMATION — Demander : « Lequel de ces emails vous convaincrait, vous ? » Les réponses varient selon les profils : c’est la démonstration.

TRANSITION — « Autre dimension : le moment du parcours. »`,
  `⏱ 3 min · PARCOURS CLIENT (4 clics)

OBJECTIF — Adapter le message à l’étape du parcours.

DIRE — → « Découverte : on parle du problème, pas de nous. » → « Considération : on aide à comparer, honnêtement. » → « Décision : la preuve, l’essai, le contact direct. » → « Fidélisation : on entretient la relation. » « L’erreur classique : envoyer l’offre commerciale à quelqu’un qui découvre la marque. »

INSISTER — Le prompt demande un tableau par étape : c’est un excellent complément au calendrier de ce matin.

TRANSITION — « Et quand on a 2 000 contacts ? »`,
  `⏱ 4 min · VARIABLES (interactif)

OBJECTIF — Montrer la personnalisation à grande échelle et la répartition des rôles IA / outil.

DIRE — « L’IA rédige un modèle avec des variables : prénom, entreprise, ville, et un argument qui dépend de la taille de l’entreprise. » Cliquer les trois contacts : « Seules les variables changent. » « Qui fait quoi ? L’IA écrit le modèle et ses variantes. Le CRM ou l’outil d’emailing insère les données. Le fichier clients ne passe jamais par l’assistant. »

INSISTER — RGPD : en B2B, la prospection par email est possible sur la base de l’intérêt légitime si le message est en lien avec la fonction de la personne, avec une désinscription simple. Vérifiez avec votre DPO.

TRANSITION — « Dernier levier d’adaptation : la longueur. »`,
  `⏱ 3 min · ACCORDÉON DE LONGUEUR (interactif)

OBJECTIF — Montrer la réduction maîtrisée d’un texte.

DIRE — Faire glisser de gauche à droite. « 72 mots, 39, 18, 11, 5. À chaque étape, on garde trois choses : le nom de l’offre, le bénéfice, la date limite. » « Si on ne le précise pas, l’IA garde parfois un détail joli et perd la date limite. »

TRANSITION — « On assemble tout ça dans un seul prompt. »`,
  `⏱ 3 min · PROMPT MAÎTRE

OBJECTIF — Donner le prompt réutilisable de déclinaison multicanale.

DIRE — « Quatre blocs. Contexte : charte et grille des codes. Matière : le message, les faits autorisés, les preuves. Tâche : les six canaux, la cible, l’étape. Contraintes : n’invente rien, signale ce qui manque, présente en tableau. » « La notion la plus importante : les faits autorisés. L’IA ne peut utiliser que ce que vous avez listé. »

ANIMATION — Demander à chacun de copier ce prompt dans sa bibliothèque maintenant : il sert dans l’atelier qui suit.

TRANSITION — « Vérifions les réflexes avant l’atelier. »`,
  `⏱ 4 min · QUIZ (5 questions)

OBJECTIF — Ancrer les choix de canal, de format et de personnalisation.

DIRE — « Cinq situations, vote à main levée, puis on clique. » Insister sur la question 4 : jamais de fichier clients dans l’assistant.

TRANSITION — « À vous : atelier 4. »`,
  `⏱ 25 min · ATELIER 4 — CAMPAGNE MULTICANALE (minuteur)

OBJECTIF — Produire la déclinaison complète de sa campagne sur six canaux et deux personas.

DIRE — « Vingt-cinq minutes. Remplissez les crochets du prompt maître avec votre concept et votre message pivot. Lancez-le, puis critiquez canal par canal avec la grille. Adaptez l’email à deux personas. Et passez la grille de relecture sur les deux contenus les plus visibles. »

ANIMATION — Lancer le minuteur. Vérifier que les « faits autorisés » sont bien listés. Bonus : version anglaise relue par un humain.

TRANSITION — « Je résume, puis pause. »`,
  `⏱ 1 min · SYNTHÈSE M5

OBJECTIF — Clore le module.

DIRE — « Cinq idées. » Les lire. « Votre campagne est prête à être diffusée. Reste une question : comment savoir si elle a marché ? Pause de 15 minutes, et au retour : l’analyse. »

TRANSITION — Pause.`,
  `⏱ 1 min · SECTION M6 · 15:25

OBJECTIF — Annoncer le dernier module de contenu : l’analyse.

DIRE — « Dernier module avant le projet : l’analyse. C’est souvent la partie qu’on n’a jamais le temps de faire, et c’est là que l’IA aide énormément. Six sujets du programme : données marketing, retours clients, commentaires, tendances, synthèse de résultats et suggestions d’amélioration. Et les pièges, parce qu’une analyse fausse est pire que pas d’analyse. »

TRANSITION — « Premier cas : le bilan de la campagne de novembre. »`,
  `⏱ 4 min · ANALYSE DE DONNÉES (4 clics)

OBJECTIF — Montrer l’analyse d’un export de résultats et la répartition IA / tableur.

DIRE — « Voici l’export de la campagne Ardente, données fictives. 146 demandes pour un objectif de 150. » Lire le prompt : « Une question précise, et deux exigences : montre tes calculs, et dis ce que les données ne permettent pas de conclure. » → enseignement 1 : la newsletter. → 2 : l’email direct. → 3 : le coût du sponsorisé, 900 divisé par 22. → 4 : la limite, on ne sait pas combien de dégustations deviennent des contrats.

INSISTER — Le quatrième point est le plus précieux : une bonne analyse dit aussi ce qu’elle ne sait pas.

TRANSITION — « Pour présenter ces résultats, il faut un graphique. »`,
  `⏱ 2 min · GRAPHIQUE (2 clics)

OBJECTIF — Utiliser l’IA comme conseil en visualisation, le tableur pour produire.

DIRE — → « Barres horizontales triées : on voit tout de suite qui contribue. » « L’IA conseille le type de graphique et peut écrire les formules ; le tableur calcule et trace. » → « Et un titre qui affirme : “La newsletter apporte 40 % des demandes”. Le lecteur comprend sans chercher. »

TRANSITION — « Deuxième source d’information : vos clients. »`,
  `⏱ 4 min · AVIS CLIENTS (5 clics)

OBJECTIF — Montrer l’analyse thématique d’avis clients.

DIRE — « 200 avis, anonymisés. On demande des thèmes, la part positive et négative, et une citation exacte. » → révéler les thèmes. « Le goût : excellent. La livraison : l’irritant numéro 1. Le prix : partagé. L’emballage : bien, mais une attente sur le recyclable. Le service client : un point fort. »

INSISTER — « Ne reformule pas les citations » : sinon l’IA les embellit. Et l’enseignement : le problème n’est pas le produit mais la livraison, à régler avant de promettre « installé en une semaine » aux entreprises.

TRANSITION — « Les commentaires, eux, demandent une réponse. »`,
  `⏱ 4 min · COMMENTAIRES (interactif)

OBJECTIF — Montrer la modération assistée : classer, prioriser, proposer une réponse.

DIRE — « Cinq commentaires sous notre post. Pour chacun, votez : quelle catégorie, quelle urgence ? » Puis cliquer. « Julie : positif, on remercie et on relance la conversation. Karim : une question, c’est une opportunité commerciale. Sophie : négatif et urgent, on passe en privé. Marc : critique sensible, on répond avec des preuves, sans se défendre. Et le spam : on masque. »

INSISTER — Jamais de réponse automatique aux commentaires négatifs ou sensibles. L’IA propose, une personne publie.

TRANSITION — « En prenant du recul sur un an, on voit des tendances. »`,
  `⏱ 3 min · TENDANCES (3 clics)

OBJECTIF — Montrer le repérage de tendances et la nécessité de les confirmer.

DIRE — → « Le café filtre monte toute l’année : on renforce les tutos. » → « Le café au bureau remonte à chaque rentrée : l’an prochain, on lance le B2B en septembre, pas en novembre. » → « Les capsules baissent. » « Mais l’IA travaille sur nos données seulement. On croise avec Google Trends, nos ventes, la presse du secteur. »

TRANSITION — « Tout ça doit tenir en une page pour la direction. »`,
  `⏱ 3 min · SYNTHÈSE DE RÉSULTATS (4 clics)

OBJECTIF — Donner la structure d’une synthèse d’une page.

DIRE — → « Trois chiffres clés. » → « Ce qui a marché. » → « Ce qui n’a pas marché. » → « Trois recommandations priorisées. » « Le prompt impose : aucun chiffre absent du tableau. Et le contrôle humain : on vérifie chaque chiffre avant d’envoyer. »

TRANSITION — « Les recommandations, justement : comment choisir ? »`,
  `⏱ 4 min · MATRICE IMPACT / EFFORT (exercice)

OBJECTIF — Prioriser les suggestions d’amélioration en groupe.

DIRE — « L’IA a proposé huit actions. Plaçons-les ensemble. » Faire glisser avec le groupe : test A/B des objets et réponse aux avis = victoires rapides ; changer de transporteur et cibler le sponsorisé = projets majeurs ; refaire le site, chaîne YouTube = à éviter pour l’instant.

INSISTER — L’IA estime l’impact et l’effort de façon générique ; c’est l’équipe qui connaît ses moyens et son contexte.

TRANSITION — « Avant l’exercice, les cinq pièges. »`,
  `⏱ 3 min · PIÈGES DE L’ANALYSE

OBJECTIF — Garantir des analyses fiables (objectif « vérifier, corriger »).

DIRE — « Chiffres inventés : on calcule dans le tableur. Corrélation n’est pas causalité : demandez “quelles autres explications ?”. Échantillon biaisé : les avis viennent des extrêmes. Données personnelles : on anonymise. Conclusion trop sûre : on exige les limites. » « Et la phrase à ajouter à tous vos prompts d’analyse. »

TRANSITION — « À vous : exercice flash. »`,
  `⏱ 8 min · EXERCICE FLASH (minuteur 8 min)

OBJECTIF — Analyser un petit corpus d’avis avec l’IA.

DIRE — « Dix avis. Recopiez-les ou décrivez-les à votre IA, faites-les classer en thèmes, identifiez l’irritant prioritaire et proposez une action, plus un contenu qui y répond. Huit minutes. »

ANIMATION — Lancer le minuteur, puis retourner la carte de correction. Point clé : la résiliation d’abonnement difficile est un irritant ET un risque légal (la résiliation en ligne doit être simple).

TRANSITION — « Dernier QCM. »`,
  `⏱ 2 min · QCM 3 (analyse)

OBJECTIF — Vérifier la posture critique face à une conclusion de l’IA.

DIRE — « Vote. » Bonne réponse : B. « Vérifier, chercher d’autres explications, tester. »

TRANSITION — « Je résume. »`,
  `⏱ 1 min · SYNTHÈSE M6

OBJECTIF — Clore les modules de contenu.

DIRE — « Cinq idées. » Les lire. « Vous avez maintenant toutes les pièces : cible, idées, contenus, visuels, déclinaisons, analyse. Il est temps de tout assembler. »

TRANSITION — « Projet final : votre mini-campagne. »`,
  `⏱ 1 min · SECTION PROJET FINAL · 16:05

OBJECTIF — Lancer le projet final.

DIRE — « Dernière ligne droite. Le programme demande une mini-campagne : cible, concept, contenus, visuels, diffusion, analyse. Bonne nouvelle : vous avez déjà presque tout. Il s’agit d’assembler, de compléter la diffusion et l’analyse, et de présenter. »

TRANSITION — « Voici le brief. »`,
  `⏱ 2 min de consigne + 35 min de travail · BRIEF DU PROJET (minuteur 35 min)

OBJECTIF — Faire produire la mini-campagne de bout en bout.

DIRE — « Six étapes, chacune renvoie à un module de la journée. Cible : votre persona. Concept : slogan, idée, objectif chiffré. Contenus : trois, dont un post et un email. Visuels : un visuel clé et une déclinaison. Diffusion : un plan sur deux semaines. Analyse : trois indicateurs et un test. Trente-cinq minutes. Les règles : un objectif chiffré, des faits autorisés seulement, la grille de relecture. À 16:40, pitch de trois minutes. »

ANIMATION — Lancer le minuteur. Passer dans chaque binôme : à 10 min vérifier cible et objectif ; à 20 min les contenus ; à 30 min la diffusion et les KPI. Montrer la page suivante (canevas) aux binômes qui bloquent.

TRANSITION — « Pour vous aider, le canevas et l’exemple Ardente. »`,
  `⏱ 2 min · CANEVAS (à laisser affiché pendant le travail)

OBJECTIF — Donner un support de restitution d’une page.

DIRE — « Six cases, une page. Voici l’exemple Ardente, rempli avec ce qu’on a fait aujourd’hui. Astuce : demandez à l’IA de remplir ce canevas à partir de toute votre conversation de la journée, puis corrigez-le. Elle a tout en mémoire dans la conversation. »

TRANSITION — « Zoom sur l’étape que nous n’avons pas encore détaillée : la diffusion. »`,
  `⏱ 3 min · DIFFUSION (5 clics)

OBJECTIF — Couvrir l’étape « diffusion » du programme : plan, budget, indicateurs.

DIRE — → LinkedIn : jours et heures pour une cible B2B, budget, coût par demande cible. → Instagram. → Newsletter. → Email direct. → l’objectif global. « Chaque ligne a un indicateur et un seuil : sans seuil, on ne sait pas si c’est réussi. »

INSISTER — Les horaires proposés par l’IA sont des moyennes générales. Vos statistiques de page font foi.

TRANSITION — Laisser travailler, puis à 16:40 : « Place aux pitchs. »`,
  `⏱ 15 min · PITCHS (3 min par binôme, minuteur)

OBJECTIF — Présenter la mini-campagne et recevoir un retour du groupe.

DIRE — « Trois minutes par binôme, comme devant votre direction. Le déroulé à gauche : cible et objectif, concept et visuel, deux contenus lus à voix haute, diffusion et indicateurs, et une correction que vous avez faite sur l’IA. Ce dernier point est important : il montre votre regard professionnel. »

ANIMATION — Lancer le minuteur pour chaque binôme. Le groupe coche la grille ; décocher entre deux binômes. Après chaque pitch : un point fort, une suggestion. Si le groupe est grand, faire pitcher 4 ou 5 binômes et les autres en 1 minute.

TRANSITION — « Bravo à tous. Avant de partir, votre boîte à outils. »`,
  `⏱ 2 min · BIBLIOTHÈQUE DE PROMPTS

OBJECTIF — Récapituler les outils réutilisables de la journée.

DIRE — « Dix prompts, tous testés aujourd’hui. » Les parcourir rapidement. « Mettez-les dans un document partagé avec l’équipe, avec votre charte de ton. C’est cette bibliothèque, enrichie semaine après semaine, qui fait la différence dans la durée. »

TRANSITION — « Mesurons votre progression. »`,
  `⏱ 2 min · AUTO-POSITIONNEMENT FINAL (exercice)

OBJECTIF — Mesurer la progression (dispositif d’évaluation).

DIRE — « Les mêmes huit affirmations qu’à neuf heures. Cochez ce que vous savez faire maintenant. Comparez avec votre score du matin. » Demander à quelques volontaires leur progression.

TRANSITION — « Et maintenant, comment continuer ? »`,
  `⏱ 2 min · PLAN D’ACTION

OBJECTIF — Ancrer le transfert en situation de travail.

DIRE — « Trois étapes, pas plus. Dès lundi : partager la bibliothèque. Ce mois-ci : un usage par semaine, en mesurant le temps gagné. Ce trimestre : écrire des règles communes avec votre équipe : outils autorisés, données interdites, relecture, mention IA. » « Et l’engagement : un post-it avec la première tâche que vous confierez à l’IA lundi. »

TRANSITION — « Merci à toutes et à tous. »`,
  `⏱ 2 min · MERCI

OBJECTIF — Clore la journée.

DIRE — « Merci pour votre énergie. Retenez notre fil conducteur : l’IA propose, le marketeur dispose. Elle vous fait gagner du temps sur le premier jet ; votre valeur, c’est la stratégie, le regard critique et la connaissance de vos clients. » Faire voter : « Qu’utiliserez-vous en premier ? »

ANIMATION — Rappeler l’évaluation de la formation. Rester disponible pour les questions individuelles.`,
];
