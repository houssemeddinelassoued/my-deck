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
  'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,500;0,600;0,700;0,800;1,700&family=Open+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;700&family=Mr+Dafoe&display=swap';
const FONT_LINK_ID = 'osd-webfont-docaposte-dev-ia-j1';
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
const SLIDE_ID = 'docaposte-dev-ia-j1';
const P = 'dap1'; // CSS class prefix, unique per deck
const DAY: number = 1;
// Combined 2-day deck: pages after DAY_SPLIT belong to day 2 (0 = single-day deck).
const DAY_SPLIT: number = 0;
const useDay = (): number => {
  const { current } = useSlidePageNumber();
  return DAY_SPLIT > 0 && current > DAY_SPLIT ? 2 : DAY;
};
const COURSE = "Développeurs · Boostez vos performances grâce à l'IA";
const AUTHOR = 'Houssem Eddine LASSOUED';
const LABS_URL = 'houssemeddinelassoued.github.io/ai-labs/frigomalin.html';

// Module numbers: 0 = ouverture / clôture, 1–3 = Jour 1, 8 = intersession, 4–7 = Jour 2.
const MOD_TITLES: Record<number, string> = {
  1: 'Panorama des outils IA',
  2: 'Intégrer l’IA dans le workflow',
  3: 'Limites & précautions',
  4: 'Exploitation de l’intersession',
  5: 'Cybersécurité & IA',
  6: 'Évaluer & fiabiliser le code',
  7: 'Synthèse & plan d’action',
  8: 'Intersession',
};

// ─── Palette (Docaposte: navy + electric blue, violet accent, light ground) ─
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

// ─── Brand motif: Docaposte (three bars, navy slabs, outlined frames) ───────
// The "≡" mark: short bar top, long bar middle, medium bar bottom.
const DapMark = ({ h = 28, color = C.electric, cls, style }: { h?: number; color?: string; cls?: string; style?: CSSProperties }) => (
  <svg width={(h * 100) / 64} height={h} viewBox="0 0 100 64" className={cls} style={{ display: 'block', flex: 'none', ...style }} aria-hidden>
    <rect x={30} y={0} width={50} height={12} rx={6} fill={color} />
    <rect x={10} y={26} width={90} height={12} rx={6} fill={color} />
    <rect x={0} y={52} width={56} height={12} rx={6} fill={color} />
  </svg>
);

// Wordmark (typographic stand-in — swap for the official logo file if needed).
const DapWord = ({ size = 26, color = C.electric }: { size?: number; color?: string }) => (
  <span style={{ fontFamily: display, fontWeight: 800, fontSize: size, letterSpacing: '0.02em', color, lineHeight: 1 }}>DOCAPOSTE</span>
);

const DapLogo = ({ size = 26, stacked = false, color = C.electric }: { size?: number; stacked?: boolean; color?: string }) =>
  stacked ? (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: Math.round(size * 0.45) }}>
      <DapMark h={Math.round(size * 1.5)} color={color} />
      <DapWord size={size} color={color} />
    </div>
  ) : (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(size * 0.5) }}>
      <DapMark h={Math.round(size * 0.95)} color={color} />
      <DapWord size={size} color={color} />
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
const MiniMark = ({ size = 22 }: { size?: number }) => <DapMark h={Math.round(size * 0.82)} color={C.electric} />;

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
  lab: { label: 'Lab FrigoMalin', tone: 'green' as Tone, icon: 'code' as IconName },
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

const ProgSq = ({ n, mod, text }: { n: number; mod: number; text?: string }) => {
  const order = [0, 1, 2, 3, 8, 4, 5, 6, 7];
  const now = n === mod;
  const past = mod !== 0 && order.indexOf(mod) > order.indexOf(n);
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

const Progress = ({ mod }: { mod: number }) => {
  const day = useDay();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <span
        style={{
          fontFamily: display,
          fontWeight: 700,
          fontSize: 16,
          letterSpacing: '0.12em',
          color: C.muted,
          marginRight: 8,
        }}
      >
        JOUR {day}
      </span>
      {day === 1 ? (
        <>
          <ProgSq n={1} mod={mod} />
          <ProgSq n={2} mod={mod} />
          <ProgSq n={3} mod={mod} />
          <ProgSq n={8} mod={mod} text="IS" />
        </>
      ) : (
        <>
          <ProgSq n={4} mod={mod} />
          <ProgSq n={5} mod={mod} />
          <ProgSq n={6} mod={mod} />
          <ProgSq n={7} mod={mod} />
        </>
      )}
    </div>
  );
};

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
          (mod === 8
            ? 'Intersession'
            : mod >= 1 && mod <= 7
              ? `Module ${mod} · ${MOD_TITLES[mod]}`
              : mod === 0
                ? 'Ouverture'
                : 'Clôture')}
      </span>
      {kind ? <KindBadge kind={kind} /> : null}
    </div>
    <Progress mod={mod} />
  </div>
);

const Footer = ({ left = 120 }: { left?: number }) => {
  const { current, total } = useSlidePageNumber();
  const day = useDay();
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
        <DapLogo size={19} />
        <span style={{ width: 1.5, height: 24, background: C.rule }} />
        <span style={{ fontSize: 19, fontWeight: 700, color: C.navy }}>{AUTHOR}</span>
        <span style={{ width: 1.5, height: 24, background: C.rule }} />
        <span style={{ fontSize: 19, color: C.muted }}>{COURSE}</span>
      </div>
      <span style={{ fontFamily: mono, fontSize: 19, color: C.muted, letterSpacing: '0.04em' }}>
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
  const buttons = (
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
      <div className={cls} style={{ ...card, display: 'flex', alignItems: 'center', gap: 22, padding: '18px 26px', ...style }}>
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

// ─── Formateur portrait (rounded photo + offset outline, Docaposte style) ───
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
  title,
  sub,
  dur,
  kind,
  labs,
  children,
}: {
  n: number;
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
          {n === 8 ? 'ENTRE J1 ET J2' : `MODULE · JOUR ${n <= 3 ? 1 : 2}`}
        </div>
        <div
          className={A.pop}
          style={{
            marginTop: 6,
            fontFamily: display,
            fontWeight: 800,
            fontSize: n === 8 ? 200 : 300,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            color: '#fff',
            ...dl(450),
          }}
        >
          {n === 8 ? 'IS' : pad(n)}
        </div>
        <div className={A.grow} style={{ marginTop: 26, width: 150, height: 8, borderRadius: 4, background: G.violet, ...dl(650) }} />
      </div>
      <div style={{ position: 'absolute', left: 150, bottom: 150 }}>
        <DapLogo size={24} color="#FFFFFF" />
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
            Labs FrigoMalin
          </Eyebrow>
          {labs}
        </div>
      ) : null}
    </div>
    <Footer left={760} />
  </Frame>
);

// ─── Dark code panel (VS Code-like) + token colours ─────────────────────────
const CodeDark = ({
  children,
  file,
  size = 22,
  cls,
  style,
}: {
  children: ReactNode;
  file?: string;
  size?: number;
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
    <div style={{ padding: '18px 24px', fontFamily: mono, fontSize: size, lineHeight: 1.55, color: '#E6EAF6', whiteSpace: 'pre' }}>{children}</div>
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

// ─── Lab briefing page (FrigoMalin) ─────────────────────────────────────────
const DEFIS = {
  trous: { label: 'Prompt à trous', icon: 'puzzle' as IconName, tone: 'blue' as Tone, aide: 'Complétez chaque [___] : chaque trou est une décision à prendre.' },
  construire: { label: 'Prompt à construire', icon: 'layers' as IconName, tone: 'green' as Tone, aide: 'Assemblez les ingrédients : rôle, contexte ciblé, tâche, format, critère de fin.' },
  ameliorer: { label: 'Prompt à améliorer', icon: 'trend' as IconName, tone: 'yellow' as Tone, aide: 'Ce prompt fonctionne mal : trouvez ses défauts, puis réécrivez-le.' },
  inverse: { label: 'Rétro-prompt', icon: 'reset' as IconName, tone: 'violet' as Tone, aide: 'Partez du résultat attendu et retrouvez le prompt qui le produit.' },
  qcm: { label: 'QCM', icon: 'check' as IconName, tone: 'teal' as Tone, aide: 'Choisissez, vérifiez : chaque réponse est corrigée et expliquée.' },
  verification: { label: 'Prompt fourni à tester', icon: 'search' as IconName, tone: 'coral' as Tone, aide: 'Le prompt est donné : lancez-le et observez ce qui part vraiment au modèle.' },
  squelette: { label: 'Fichier à compléter', icon: 'doc' as IconName, tone: 'navy' as Tone, aide: 'Complétez le fichier de configuration Copilot : chaque champ compte.' },
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
  children: ReactNode;
}) => (
  <Frame mod={mod} kind="lab" label={label}>
    <Title size={48}>
      <span style={{ color: C.green }}>Lab {n}</span> · {title}
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
          Le défi · {DEFIS[defi].aide}
        </PanelTitle>
        <div style={{ fontSize: 24, lineHeight: 1.45, color: C.soft }}>{children}</div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1170, top: 240, width: 630, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className={A.right} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 24px', ...dl(100) }}>
        <PanelTitle icon="doc">Où créer le fichier ?</PanelTitle>
        <div style={{ fontSize: 22, lineHeight: 1.5, color: C.soft }}>{where}</div>
      </div>
      <Timer id={`lab-${n}`} minutes={minutes} label={`Lab ${n}`} compact cls={A.right} style={dl(200)} />
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
      <Icon name="link" size={20} color={C.electric} /> Énoncé complet, indices et auto-évaluation : <span style={{ fontFamily: mono, color: C.electric }}>{LABS_URL}</span>
    </div>
  </Frame>
);

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
        padding: '12px 20px 12px 12px',
        border: 'none',
        borderRadius: 14,
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: body,
        fontSize: 25,
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
          width: 46,
          height: 46,
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: display,
          fontWeight: 800,
          fontSize: 24,
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
      <div style={{ display: active ? 'flex' : 'none', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.3, color: C.ink, marginBottom: 6 }}>{q}</div>
        {opts.map((o, i) => cloneElement(o, { oi: i, key: i }))}
        <div
          style={{
            marginTop: 6,
            minHeight: 92,
            boxSizing: 'border-box',
            borderRadius: 14,
            padding: '14px 20px',
            background: solved ? T.green.bg : lastWrong ? T.coral.bg : T.grey.bg,
            fontSize: 23,
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
              <strong style={{ color: T.coral.fg }}>✗ Pas tout à fait. </strong>Relisez la situation : quel choix coûte le moins pour le même résultat ? Réessayez.
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

// ═══ j1-10-m1 ══════════════════════════════════════════════════════════

// ─── Module 1 · Panorama des outils IA pour le développement ────────────────

const M1_Divider: Page = () => (
  <Section
    n={1}
    title={
      <>
        Panorama des outils IA
        <br />
        pour le développement
      </>
    }
    sub="Comprendre ce qu’est un LLM pour bien choisir : typologie, critères, forces, limites et scénarios d’usage."
    dur="9:30 – 11:30 · labs inclus"
    labs={
      <>
        <Tag tone="green" size={19}>Lab 1.1</Tag>
        <Tag tone="green" size={19}>Atelier comparatif</Tag>
        <Tag tone="green" size={19}>Lab 1.2</Tag>
        <Tag tone="pink" size={19}>Bonus 1.3</Tag>
      </>
    }
  >
    <SecItem n={1}>Comment un LLM « écrit » du code</SecItem>
    <SecItem n={2}>La typologie des outils en 2026</SecItem>
    <SecItem n={3}>Critères de choix et confidentialité</SecItem>
    <SecItem n={4}>Forces, limites et scénarios d’usage</SecItem>
  </Section>
);
M1_Divider.transition = BLOOM;

// ─── Frise 1950 → 2026 ──────────────────────────────────────────────────────
const M1Ev = ({ x, up, year, title, sub, c, cls }: { x: number; up: boolean; year: string; title: string; sub: string; c: string; cls?: string }) => (
  <div className={cls} style={{ position: 'absolute', left: x - 120, top: up ? 330 : 610, width: 240, textAlign: 'center' }}>
    {up ? null : <div style={{ width: 3, height: 34, background: c, margin: '0 auto 10px', opacity: 0.5 }} />}
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: c }}>{year}</div>
    <div style={{ fontSize: 21, fontWeight: 700, color: C.ink, lineHeight: 1.25, marginTop: 4 }}>{title}</div>
    <div style={{ fontSize: 18, color: C.muted, lineHeight: 1.3, marginTop: 4 }}>{sub}</div>
    {up ? <div style={{ width: 3, height: 34, background: c, margin: '10px auto 0', opacity: 0.5 }} /> : null}
  </div>
);

const M1Dot = ({ x, c, cls, d = 0 }: { x: number; c: string; cls?: string; d?: number }) => (
  <circle cx={x} cy={580} r={13} fill="#fff" stroke={c} strokeWidth={6} className={cls} style={dl(d)} />
);

const M1_Timeline: Page = () => (
  <Frame mod={1} beats={2}>
    <Title>L’IA… depuis quand ?</Title>
    <Lede>75 ans d’histoire, et une accélération brutale depuis 2017. Cliquez pour avancer dans le temps.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
      <line x1={150} y1={580} x2={1790} y2={580} stroke={C.rule} strokeWidth={8} strokeLinecap="round" />
      <line x1={150} y1={580} x2={890} y2={580} stroke={C.navy} strokeWidth={8} strokeLinecap="round" className={A.grow} />
      <line x1={890} y1={580} x2={1330} y2={580} stroke={C.violet} strokeWidth={8} className={b.grow(1)} />
      <line x1={1330} y1={580} x2={1790} y2={580} stroke={C.green} strokeWidth={8} strokeLinecap="round" className={b.grow(2)} />
      <M1Dot x={170} c={C.navy} cls={A.dot} d={100} />
      <M1Dot x={330} c={C.navy} cls={A.dot} d={200} />
      <M1Dot x={490} c={C.navy} cls={A.dot} d={300} />
      <M1Dot x={650} c={C.navy} cls={A.dot} d={400} />
      <M1Dot x={810} c={C.navy} cls={A.dot} d={500} />
      <M1Dot x={970} c={C.violet} cls={b.pop(1)} d={100} />
      <M1Dot x={1130} c={C.violet} cls={b.pop(1)} d={250} />
      <M1Dot x={1290} c={C.violet} cls={b.pop(1)} d={400} />
      <M1Dot x={1450} c={C.green} cls={b.pop(2)} d={100} />
      <M1Dot x={1610} c={C.green} cls={b.pop(2)} d={250} />
      <M1Dot x={1770} c={C.green} cls={b.pop(2)} d={400} />
    </svg>
    <M1Ev x={170} up year="1950" title="Test de Turing" sub="« Une machine peut-elle penser ? »" c={C.navy} cls={A.fade} />
    <M1Ev x={330} up={false} year="1956" title="Dartmouth" sub="Le terme « intelligence artificielle »" c={C.navy} cls={A.fade} />
    <M1Ev x={490} up year="1986" title="Rétropropagation" sub="Les réseaux de neurones apprennent" c={C.navy} cls={A.fade} />
    <M1Ev x={650} up={false} year="1997" title="Deep Blue" sub="Bat Kasparov aux échecs" c={C.navy} cls={A.fade} />
    <M1Ev x={810} up year="2012" title="AlexNet" sub="L’ère du deep learning" c={C.navy} cls={A.fade} />
    <div className={b.fade(1)}>
      <M1Ev x={970} up={false} year="2017" title="Transformer" sub="« Attention is all you need »" c={C.violet} />
      <M1Ev x={1130} up year="2021" title="GitHub Copilot" sub="La complétion de code par IA" c={C.violet} />
      <M1Ev x={1290} up={false} year="2022" title="ChatGPT" sub="L’IA générative pour tous" c={C.violet} />
    </div>
    <div className={b.fade(2)}>
      <M1Ev x={1450} up year="2024" title="MCP" sub="Les modèles se branchent aux outils" c={C.green} />
      <M1Ev x={1610} up={false} year="2025" title="Agents de code" sub="Mode Agent, Claude Code, Codex…" c={C.green} />
      <M1Ev x={1770} up year="2026" title="Équipes d’agents" sub="Orchestration, facturation à l’usage" c={C.green} />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 880, width: 1680, display: 'flex', gap: 18 }}>
      <div className={A.fade} style={{ flex: 5, ...dl(600) }}>
        <Tag tone="navy" size={20}>IA « classique » : règles, puis apprentissage</Tag>
      </div>
      <div className={b.fade(1)} style={{ flex: 3 }}>
        <Tag tone="violet" size={20}>IA générative</Tag>
      </div>
      <div className={b.fade(2)} style={{ flex: 3 }}>
        <Tag tone="green" size={20}>IA agentique</Tag>
      </div>
    </div>
  </Frame>
);

// ─── Déterministe vs probabiliste ───────────────────────────────────────────
const M1_GEN = [
  { t: 'Regex simple', c: 'return /^\\S+@\\S+\\.\\S+$/.test(email);', n: 'Accepte « a@b.c »… et refuse peu de choses.' },
  { t: 'Regex « RFC 5322 »', c: 'return /^[a-z0-9!#$%&*+/=?^_{|}~-]+(?:\\.[a-z0-9…]+)*@…$/i.test(email);', n: 'Plus stricte… et illisible : qui la relira ?' },
  { t: 'Bibliothèque', c: "import isEmail from 'validator/lib/isEmail';\nreturn isEmail(email);", n: 'Propre… si la dépendance existe et est saine.' },
  { t: 'Approche « métier »', c: "const [u, d] = email.split('@');\nreturn !!u && !!d && d.includes('.');", n: 'Lisible, mais laxiste sur les cas limites.' },
];

const M1_Determinism: Page = () => {
  const [run, setRun] = useState(0);
  const [classic, setClassic] = useState(0);
  const g = M1_GEN[run % M1_GEN.length];
  return (
    <Frame mod={1} kind="demo">
      <Title>Programme classique vs IA générative</Title>
      <Lede>Même entrée, même sortie… ou pas. Cliquez « Relancer » de chaque côté et comparez.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <IconTile name="gear" tone="navy" size={54} />
            <div>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>Déterministe</div>
              <div style={{ fontSize: 21, color: C.muted }}>Des règles écrites par un humain</div>
            </div>
          </div>
          <Btn icon="reset" ghost tone="navy" size={20} onClick={() => setClassic((x) => x + 1)}>
            Relancer
          </Btn>
        </div>
        <CodeDark size={21} style={{ marginTop: 20 }}>
          <Ck>function</Ck> <Cf>tva</Cf>(ht, code) {'{'}
          {'\n  '}
          <Ck>const</Ck> taux = {'{'} A: <Cn>0.2</Cn>, B: <Cn>0.1</Cn>, C: <Cn>0.055</Cn> {'}'}[code];
          {'\n  '}
          <Ck>return</Ck> ht * taux;
          {'\n}'}
          {'\n'}
          <Cf>tva</Cf>(<Cn>100</Cn>, <Cs>'B'</Cs>)
        </CodeDark>
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 24, color: C.soft }}>Exécution n° {classic + 1} →</span>
          <span key={classic} className={A.pop} style={{ fontFamily: display, fontWeight: 800, fontSize: 44, color: C.navy }}>
            10,00 €
          </span>
        </div>
        <div style={{ marginTop: 10, fontSize: 22, color: C.green, fontWeight: 600 }}>Toujours le même résultat : testable, explicable.</div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 1000, top: 270, width: 800, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', ...dl(150) }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <IconTile name="sparkles" tone="violet" size={54} />
            <div>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.violet }}>Probabiliste</div>
              <div style={{ fontSize: 21, color: C.muted }}>« Écris une fonction qui valide un email »</div>
            </div>
          </div>
          <Btn icon="reset" tone="violet" size={20} onClick={() => setRun((x) => x + 1)}>
            Relancer
          </Btn>
        </div>
        <div key={run} className={A.fade}>
          <div style={{ marginTop: 20, fontSize: 21, fontWeight: 700, color: T.violet.fg }}>
            Génération n° {run + 1} · {g.t}
          </div>
          <CodeDark size={20} style={{ marginTop: 10, minHeight: 120, whiteSpace: 'pre-wrap' }}>
            {g.c}
          </CodeDark>
          <div style={{ marginTop: 14, fontSize: 22, color: C.coral, fontWeight: 600 }}>{g.n}</div>
        </div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(400) }}>
        <Callout title="Conséquence pour le développeur" tone="violet" icon="alert">
          Un LLM ne « calcule » pas une réponse : il en <strong>génère une plausible</strong>. Deux exécutions, deux codes. D’où trois réflexes :
          un prompt précis, des <strong>tests qui fixent le comportement</strong>, une revue humaine.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Prochain token + température ───────────────────────────────────────────
const M1_CANDS = [
  { tok: ' new Date()', p: 0.58, v: 'ok' },
  { tok: ' Date.now()', p: 0.22, v: 'ok' },
  { tok: ' today', p: 0.1, v: 'warn' },
  { tok: ' item.addedOn', p: 0.06, v: 'bad' },
  { tok: ' 0', p: 0.04, v: 'bad' },
];
const M1_VERDICT: Record<string, { t: string; tone: Tone }> = {
  ok: { t: 'correct', tone: 'green' },
  warn: { t: 'variable inventée', tone: 'yellow' },
  bad: { t: 'logique fausse', tone: 'coral' },
};

const M1Cand = ({ i, probs, picked }: { i: number; probs: number[]; picked: number | null }) => {
  const c = M1_CANDS[i];
  const v = M1_VERDICT[c.v];
  const pct = probs[i] * 100;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 62 }}>
      <span
        style={{
          width: 250,
          flex: 'none',
          fontFamily: mono,
          fontSize: 25,
          color: picked === i ? '#fff' : C.ink,
          background: picked === i ? C.electric : C.panel,
          borderRadius: 10,
          padding: '8px 12px',
          transition: 'all 250ms ease',
        }}
      >
        {c.tok.replace(' ', '·')}
      </span>
      <div style={{ flex: 1, height: 30, borderRadius: 8, background: C.panel, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: STRONG[v.tone], transition: `width 400ms ${EASE}` }} />
      </div>
      <span style={{ width: 92, flex: 'none', textAlign: 'right', fontFamily: display, fontWeight: 800, fontSize: 26, color: C.ink }}>{fr(pct, 0)} %</span>
      <span style={{ width: 210, flex: 'none' }}>
        <Tag tone={v.tone} size={18}>
          {v.t}
        </Tag>
      </span>
    </div>
  );
};

const M1_NextToken: Page = () => {
  const [temp, setTemp] = useState(0.7);
  const [picked, setPicked] = useState<number | null>(null);
  const [hist, setHist] = useState<number[]>([]);
  const w = M1_CANDS.map((c) => c.p ** (1 / Math.max(0.05, temp)));
  const sum = w.reduce((a, x) => a + x, 0);
  const probs = w.map((x) => x / sum);
  const sample = () => {
    let r = Math.random();
    let i = 0;
    while (i < probs.length - 1 && r > probs[i]) {
      r -= probs[i];
      i++;
    }
    setPicked(i);
    setHist((h) => [...h.slice(-11), i]);
  };
  const bad = hist.filter((i) => M1_CANDS[i].v !== 'ok').length;
  return (
    <Frame mod={1} kind="demo">
      <Title>Un LLM prédit le prochain token… rien de plus</Title>
      <Lede>Il choisit une suite probable, pas une suite vraie. Jouez avec la température, puis échantillonnez.</Lede>
      <CodeDark file="src/domain/stock.ts" size={25} cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
        <Cc>{'// Un produit est périmé si sa date limite est passée'}</Cc>
        {'\n'}
        <Ck>export function</Ck> <Cf>isExpired</Cf>(item: StockItem): <Ck>boolean</Ck> {'{'}
        {'\n  '}
        <Ck>return new</Ck> <Cf>Date</Cf>(item.expiresOn) {'<'}
        <span style={{ color: '#FFD27A', background: 'rgba(255,210,122,.15)', borderRadius: 4 }}>{picked === null ? '▌' : M1_CANDS[picked].tok}</span>
      </CodeDark>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 500, width: 1150, display: 'flex', flexDirection: 'column', gap: 8, ...dl(150) }}>
        <M1Cand i={0} probs={probs} picked={picked} />
        <M1Cand i={1} probs={probs} picked={picked} />
        <M1Cand i={2} probs={probs} picked={picked} />
        <M1Cand i={3} probs={probs} picked={picked} />
        <M1Cand i={4} probs={probs} picked={picked} />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 500, width: 470, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', ...dl(250) }}>
        <Eyebrow c={C.muted} size={18}>
          Température
        </Eyebrow>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 4 }}>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 52, color: C.electric }}>{fr(temp, 1)}</span>
          <span style={{ fontSize: 21, color: C.muted }}>{temp < 0.4 ? 'prévisible' : temp < 1.1 ? 'équilibrée' : 'créative… et risquée'}</span>
        </div>
        <Range value={temp} onChange={setTemp} min={0.1} max={2} step={0.1} w={410} />
        <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
          <Btn icon="sparkles" size={21} onClick={sample}>
            Échantillonner
          </Btn>
          <Btn
            icon="reset"
            ghost
            tone="grey"
            size={21}
            onClick={() => {
              setPicked(null);
              setHist([]);
            }}
          />
        </div>
        <div style={{ marginTop: 16, fontSize: 21, color: C.soft }}>
          Tirages : <strong>{hist.length}</strong> · suites fausses : <strong style={{ color: bad ? C.coral : C.green }}>{bad}</strong>
        </div>
      </div>
    </Frame>
  );
};

// ─── Fenêtre de contexte ────────────────────────────────────────────────────
const M1_CTX = [
  { id: 'sys', label: 'Prompt système de l’outil', k: 3, tone: 'grey' as Tone, fixed: true },
  { id: 'ins', label: 'Instructions du dépôt', k: 1.5, tone: 'navy' as Tone, fixed: false },
  { id: 'files', label: 'Fichiers joints avec #', k: 4, tone: 'blue' as Tone, fixed: false },
  { id: 'hist', label: 'Historique de la session', k: 18, tone: 'violet' as Tone, fixed: false },
  { id: 'tools', label: 'Définitions d’outils (MCP…)', k: 12, tone: 'teal' as Tone, fixed: false },
  { id: 'res', label: 'Résultats d’outils (fichiers lus, tests)', k: 25, tone: 'pink' as Tone, fixed: false },
  { id: 'q', label: 'Votre question', k: 0.3, tone: 'green' as Tone, fixed: true },
];

const M1CtxRow = ({ i, on, toggle }: { i: number; on: boolean; toggle: () => void }) => {
  const c = M1_CTX[i];
  return (
    <Toggle
      on={on}
      onChange={() => {
        if (!c.fixed) toggle();
      }}
      tone={c.tone}
      size={24}
      label={
        <span style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
          <span>{c.label}</span>
          <span style={{ fontFamily: mono, fontSize: 20, color: C.muted }}>~{fr(c.k, c.k < 1 ? 1 : 0)} k</span>
          {c.fixed ? <span style={{ fontSize: 18, color: C.faint }}>(toujours)</span> : null}
        </span>
      }
    />
  );
};

const M1CtxSeg = ({ i, on, total }: { i: number; on: boolean; total: number }) => {
  const c = M1_CTX[i];
  return <div style={{ width: on ? `${(c.k / Math.max(total, 64)) * 100}%` : 0, height: '100%', background: STRONG[c.tone], transition: `width 450ms ${EASE}` }} />;
};

const M1_Context: Page = () => {
  const [on, setOn] = useState<Record<string, boolean>>({ sys: true, ins: true, files: true, hist: false, tools: false, res: false, q: true });
  const flip = (id: string) => setOn((o) => ({ ...o, [id]: !o[id] }));
  const total = M1_CTX.reduce((a, c) => a + (on[c.id] ? c.k : 0), 0);
  const level = total < 20 ? { t: 'Contexte léger : rapide, précis, économique.', tone: 'green' as Tone } : total < 45 ? { t: 'Contexte moyen : surveillez l’historique et les sorties d’outils.', tone: 'yellow' as Tone } : { t: 'Contexte lourd : coût ↑, latence ↑, attention diluée. Nouvelle session ou /compact.', tone: 'coral' as Tone };
  return (
    <Frame mod={1} kind="demo">
      <Title>La fenêtre de contexte : tout ce que le modèle « voit »</Title>
      <Lede>Le modèle n’a pas de mémoire : il relit tout, à chaque requête. Activez les sources une à une.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 860, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <M1CtxRow i={0} on={on.sys} toggle={() => flip('sys')} />
        <M1CtxRow i={1} on={on.ins} toggle={() => flip('ins')} />
        <M1CtxRow i={2} on={on.files} toggle={() => flip('files')} />
        <M1CtxRow i={3} on={on.hist} toggle={() => flip('hist')} />
        <M1CtxRow i={4} on={on.tools} toggle={() => flip('tools')} />
        <M1CtxRow i={5} on={on.res} toggle={() => flip('res')} />
        <M1CtxRow i={6} on={on.q} toggle={() => flip('q')} />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1040, top: 270, width: 760, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', ...dl(150) }}>
        <Eyebrow c={C.muted} size={18}>
          Envoyé au modèle à chaque requête
        </Eyebrow>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 88, lineHeight: 1, color: STRONG[level.tone] }}>{fr(total, 0)}</span>
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 34, color: C.faint }}>k tokens</span>
        </div>
        <div style={{ marginTop: 18, height: 40, borderRadius: 10, background: C.panel, overflow: 'hidden', display: 'flex' }}>
          <M1CtxSeg i={0} on={on.sys} total={total} />
          <M1CtxSeg i={1} on={on.ins} total={total} />
          <M1CtxSeg i={2} on={on.files} total={total} />
          <M1CtxSeg i={3} on={on.hist} total={total} />
          <M1CtxSeg i={4} on={on.tools} total={total} />
          <M1CtxSeg i={5} on={on.res} total={total} />
          <M1CtxSeg i={6} on={on.q} total={total} />
        </div>
        <div style={{ marginTop: 18, fontSize: 25, lineHeight: 1.4, fontWeight: 600, color: T[level.tone].fg }}>{level.t}</div>
        <div style={{ marginTop: 18, fontSize: 20, lineHeight: 1.45, color: C.muted }}>
          Ordres de grandeur illustratifs. Votre question pèse souvent moins de 1 % de ce qui est envoyé : l’essentiel vient du contexte.
        </div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 1040, top: 760, width: 760, ...dl(300) }}>
        <Callout title="Trois conséquences" tone="blue" icon="bulb" size={23}>
          Facture : on paie chaque token, à chaque requête. Latence : plus c’est long, plus c’est lent. Qualité : un contexte saturé noie l’essentiel.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Hallucinations ─────────────────────────────────────────────────────────
const M1Kind = ({ icon, title, ex, d }: { icon: IconName; title: string; ex: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 22px', display: 'flex', gap: 16, ...dl(d) }}>
    <IconTile name={icon} tone="coral" size={52} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 21, lineHeight: 1.4, color: C.soft }}>{ex}</div>
    </div>
  </div>
);

const M1_Halluc: Page = () => (
  <Frame mod={1} beats={2}>
    <Title>Hallucinations : plausible n’est pas vrai</Title>
    <Lede>Le modèle complète avec ce qui « ressemble » à une bonne réponse, sans vérifier qu’elle existe.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 900, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Bubble who="user" name="Vous" cls={A.in} w={720}>
        Quel paquet npm pour lire les dates DLC françaises dans une étiquette ?
      </Bubble>
      <Bubble who="agent" name="Assistant" cls={A.in} style={dl(300)} w={760}>
        Utilisez <code style={{ fontFamily: mono }}>french-dlc-parser</code> : <code style={{ fontFamily: mono }}>npm install french-dlc-parser</code>, puis{' '}
        <code style={{ fontFamily: mono }}>parseDLC(label)</code>. Il gère « À consommer jusqu’au » et « de préférence avant ».
      </Bubble>
      <div className={b.on(1)}>
        <Callout title="Vérification" tone="coral" icon="alert">
          Ce paquet n’existe pas. La réponse est fluide, précise… et inventée. Pire : un attaquant peut publier ce nom avec du code malveillant
          (on en reparle au module 3).
        </Callout>
      </div>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 1080, top: 270, width: 720, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Eyebrow c={C.coral}>Les formes les plus fréquentes en code</Eyebrow>
      <M1Kind icon="archive" title="Paquet ou module inexistant" ex="Un nom crédible, assemblé à partir de vrais paquets." d={0} />
      <M1Kind icon="code" title="API ou paramètre inventé" ex="Une méthode qui « devrait » exister… mais pas dans cette version." d={120} />
      <M1Kind icon="clock" title="Connaissance périmée" ex="Une syntaxe dépréciée, connue à la date d’entraînement du modèle." d={240} />
      <M1Kind icon="book" title="Source ou norme fabriquée" ex="Une RFC, une règle RGPD ou un chiffre « cités » sans exister." d={360} />
    </div>
  </Frame>
);

// ─── Software 1.0 / 2.0 / 3.0 ───────────────────────────────────────────────
const M1Sw = ({ v, what, prog, by, when, tone, d }: { v: string; what: string; prog: string; by: string; when: string; tone: Tone; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', borderTop: `8px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: STRONG[tone] }}>Software {v}</div>
    <div style={{ marginTop: 14, fontSize: 30, fontWeight: 700, color: C.ink }}>{what}</div>
    <div style={{ marginTop: 6, fontSize: 23, color: C.soft }}>
      programme <strong>{prog}</strong>
    </div>
    <div style={{ marginTop: 14, fontSize: 21, color: C.muted, lineHeight: 1.4 }}>
      {by} · {when}
    </div>
  </div>
);

const M1_Software3: Page = () => (
  <Frame mod={1} beats={1}>
    <Title>Software 3.0 : le prompt devient un programme</Title>
    <Lede>La lecture d’Andrej Karpathy (ex-Tesla, cofondateur d’OpenAI) : trois façons de programmer coexistent.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 26 }}>
      <M1Sw v="1.0" what="Du code" prog="un ordinateur" by="Écrit par un humain" when="depuis les années 1940" tone="navy" d={100} />
      <M1Sw v="2.0" what="Des poids" prog="un réseau de neurones" by="Appris sur des données" when="depuis ~2012" tone="blue" d={220} />
      <M1Sw v="3.0" what="Des prompts" prog="un LLM" by="Écrits en langue naturelle" when="depuis ~2020" tone="violet" d={340} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 560, width: 1680, ...dl(500) }}>
      <Quote by="Andrej Karpathy, janvier 2023">The hottest new programming language is English.</Quote>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 720, width: 1680, display: 'flex', gap: 26 }}>
      <Card tone="coral" icon="sparkles" title="« Vibe coding » (Karpathy, 2025)" style={{ flex: 1 }} size={23}>
        On décrit, on accepte sans lire, on relance. Acceptable pour un prototype jetable du week-end.
      </Card>
      <Card tone="green" icon="shieldCheck" title="Ingénierie assistée par l’IA" style={{ flex: 1 }} size={23}>
        On spécifie, on découpe, on vérifie (tests, revue), on versionne. <strong>C’est l’objet de ces deux jours.</strong>
      </Card>
    </div>
  </Frame>
);

// ─── Les 5 niveaux d'assistance ─────────────────────────────────────────────
const M1Lvl = ({ n, title, ex, ctl, tone, beat }: { n: number; title: string; ex: string; ctl: string; tone: Tone; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ position: 'absolute', left: 120 + (n - 1) * 337, top: 780 - n * 98, width: 330 }}>
    <div style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW, padding: '16px 20px', borderLeft: `8px solid ${STRONG[tone]}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Num n={n} tone={tone} size={40} />
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: C.ink }}>{title}</span>
      </div>
      <div style={{ marginTop: 8, fontSize: 20, lineHeight: 1.4, color: C.soft }}>{ex}</div>
      <div style={{ marginTop: 6, fontSize: 19, fontWeight: 700, color: T[tone].fg }}>{ctl}</div>
    </div>
  </div>
);

const M1_Levels: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>Cinq niveaux d’assistance, du Tab à l’agent autonome</Title>
    <Lede>Plus l’IA agit seule, plus elle va vite… et plus le contrôle humain doit être organisé.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
      <defs>
        <linearGradient id="m1lv" x1="0" x2="1">
          <stop offset="0" stopColor={C.green} />
          <stop offset="1" stopColor={C.coral} />
        </linearGradient>
      </defs>
      <path d="M 140 930 L 1790 930" stroke="url(#m1lv)" strokeWidth={6} strokeLinecap="round" className={A.grow} />
      <path d="M 1770 916 L 1792 930 L 1770 944" fill="none" stroke={C.coral} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div style={{ position: 'absolute', left: 140, top: 945, fontSize: 20, color: T.green.fg, fontWeight: 700 }}>Vous gardez la main à chaque frappe</div>
    <div style={{ position: 'absolute', right: 130, top: 945, fontSize: 20, color: T.coral.fg, fontWeight: 700 }}>Autonomie ↑ · contrôle à organiser ↑</div>
    <M1Lvl n={1} title="Complétion" ex="Tab, suggestions d’édition suivante (NES)" ctl="Contrôle : vous lisez chaque ligne" tone="green" beat={0} />
    <M1Lvl n={2} title="Chat (Ask)" ex="Expliquer, comparer, poser des questions" ctl="Contrôle : vous copiez ce que vous gardez" tone="teal" beat={1} />
    <M1Lvl n={3} title="Édition guidée" ex="Chat inline (Ctrl+I), modifications ciblées" ctl="Contrôle : vous relisez un diff" tone="blue" beat={2} />
    <M1Lvl n={4} title="Agent dans l’IDE" ex="Lit, modifie plusieurs fichiers, lance des commandes" ctl="Contrôle : plan validé + diffs + tests" tone="violet" beat={3} />
    <M1Lvl n={5} title="Agent autonome" ex="CLI, cloud, PR ouvertes seules (coding agent)" ctl="Contrôle : revue de PR + CI + droits limités" tone="coral" beat={4} />
  </Frame>
);

// ─── Typologie des outils 2026 ──────────────────────────────────────────────
const M1Fam = ({ icon, tone, title, desc, d, children }: { icon: IconName; tone: Tone; title: string; desc: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 24px', borderTop: `7px solid ${STRONG[tone]}`, display: 'flex', flexDirection: 'column', gap: 10, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={52} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: C.ink, lineHeight: 1.2 }}>{title}</div>
    </div>
    <div style={{ fontSize: 21, lineHeight: 1.4, color: C.soft }}>{desc}</div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 'auto' }}>{children}</div>
  </div>
);

const M1_Typology: Page = () => (
  <Frame mod={1}>
    <Title>La typologie des outils en 2026</Title>
    <Lede>Les trois familles du programme (IDE, assistants, outils spécialisés), plus deux qui ont explosé depuis 2025.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: 330, gap: 22 }}>
      <M1Fam icon="code" tone="blue" title="Assistants dans l’IDE" desc="Complétion, chat, édition et mode Agent au cœur de l’éditeur." d={100}>
        <Tag size={17}>GitHub Copilot</Tag>
        <Tag size={17}>Cursor</Tag>
        <Tag size={17}>Windsurf</Tag>
        <Tag size={17}>JetBrains AI · Junie</Tag>
        <Tag size={17}>Gemini Code Assist</Tag>
      </M1Fam>
      <M1Fam icon="chat" tone="violet" title="Assistants conversationnels" desc="Expliquer, concevoir, rédiger : hors de l’éditeur, sans accès au dépôt." d={180}>
        <Tag tone="violet" size={17}>ChatGPT</Tag>
        <Tag tone="violet" size={17}>Claude</Tag>
        <Tag tone="violet" size={17}>Gemini</Tag>
        <Tag tone="violet" size={17}>Le Chat (Mistral)</Tag>
      </M1Fam>
      <M1Fam icon="terminal" tone="coral" title="Agents CLI et cloud" desc="Ils lisent le dépôt, exécutent, testent et ouvrent des PR, parfois seuls." d={260}>
        <Tag tone="coral" size={17}>Claude Code</Tag>
        <Tag tone="coral" size={17}>OpenAI Codex</Tag>
        <Tag tone="coral" size={17}>Gemini CLI</Tag>
        <Tag tone="coral" size={17}>Copilot CLI · coding agent</Tag>
      </M1Fam>
      <M1Fam icon="cloud" tone="teal" title="IDE cloud et générateurs" desc="Un environnement prêt à coder, ou une application générée depuis une idée." d={340}>
        <Tag tone="teal" size={17}>GitHub Codespaces</Tag>
        <Tag tone="teal" size={17}>Replit</Tag>
        <Tag tone="teal" size={17}>Bolt · Lovable · v0</Tag>
        <Tag tone="teal" size={17}>Google Stitch (UI)</Tag>
      </M1Fam>
      <M1Fam icon="tool" tone="green" title="Outils spécialisés" desc="Tests, revue de code, sécurité, documentation, performance." d={420}>
        <Tag tone="green" size={17}>Qodo (tests)</Tag>
        <Tag tone="green" size={17}>Copilot code review</Tag>
        <Tag tone="green" size={17}>CodeRabbit</Tag>
        <Tag tone="green" size={17}>Copilot Autofix · Snyk</Tag>
        <Tag tone="green" size={17}>Mintlify (doc)</Tag>
      </M1Fam>
      <M1Fam icon="server" tone="navy" title="Modèles ouverts, en local" desc="Le code ne quitte pas votre réseau : souveraineté, au prix de la puissance." d={500}>
        <Tag tone="navy" size={17}>Ollama · LM Studio</Tag>
        <Tag tone="navy" size={17}>Mistral · Codestral</Tag>
        <Tag tone="navy" size={17}>Qwen Coder</Tag>
        <Tag tone="navy" size={17}>gpt-oss</Tag>
      </M1Fam>
    </div>
  </Frame>
);

// ─── Le marché en chiffres ──────────────────────────────────────────────────
const M1Fig = ({ value, label, src, tone, d }: { value: ReactNode; label: string; src: string; tone: Tone; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', display: 'flex', flexDirection: 'column', ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 78, lineHeight: 1, color: STRONG[tone] }}>{value}</div>
    <div style={{ marginTop: 14, fontSize: 24, lineHeight: 1.38, color: C.ink }}>{label}</div>
    <div style={{ marginTop: 'auto', paddingTop: 12, fontSize: 18, color: C.muted }}>{src}</div>
  </div>
);

const M1_Market: Page = () => (
  <Frame mod={1} kind="actu">
    <Title>Adoption massive, confiance… sous condition</Title>
    <Lede>Ce que disent les grandes enquêtes développeurs 2025-2026 (chiffres déclaratifs).</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: 310, gap: 24 }}>
      <M1Fig value={<CountUp to={90} suffix=" %" />} label="des professionnels du logiciel utilisent l’IA dans leur travail (médiane : 2 h par jour)" src="Google DORA 2025 · ~5 000 répondants" tone="blue" d={100} />
      <M1Fig value={<CountUp to={66} suffix=" %" />} label="utilisent un assistant ou un agent de code ; 26 % des workflows d’agents automatisés" src="Stack Overflow Survey 2026 · 30 000+ répondants" tone="violet" d={200} />
      <M1Fig value={<CountUp to={46} suffix=" %" />} label="se méfient de l’exactitude des réponses de l’IA, contre 33 % qui lui font confiance" src="Stack Overflow Survey 2025" tone="coral" d={300} />
      <M1Fig value={<CountUp to={6.6} digits={1} suffix=" %" />} label="lui feraient confiance pour des décisions importantes ; la vérification facile est la condition n° 1" src="Stack Overflow Survey 2026" tone="yellow" d={400} />
      <M1Fig value={<CountUp to={79} suffix=" %" />} label="jugent l’attribution des sources importante pour évaluer du code ou une réponse IA" src="Stack Overflow Survey 2026" tone="teal" d={500} />
      <M1Fig value={<CountUp to={80} prefix="> " suffix=" %" />} label="se disent plus productifs ; 59 % voient un effet positif sur la qualité du code" src="Google DORA 2025" tone="green" d={600} />
    </div>
  </Frame>
);

// ─── Le paradoxe de la productivité (METR) ──────────────────────────────────
const M1Bar = ({ label, v, tone, beat, d }: { label: string; v: number; tone: Tone; beat: number; d: number }) => (
  <div className={b.on(beat)} style={{ display: 'flex', alignItems: 'center', gap: 20, ...dl(d) }}>
    <span style={{ width: 300, fontSize: 25, color: C.ink }}>{label}</span>
    <div style={{ position: 'relative', width: 760, height: 56 }}>
      <div style={{ position: 'absolute', left: 380, top: -8, bottom: -8, width: 3, background: C.faint }} />
      <div
        style={{
          position: 'absolute',
          top: 0,
          height: 56,
          borderRadius: 10,
          background: STRONG[tone],
          left: v >= 0 ? 380 : 380 + v * 12,
          width: Math.abs(v) * 12,
        }}
      />
    </div>
    <span style={{ fontFamily: display, fontWeight: 800, fontSize: 44, color: STRONG[tone] }}>
      {v > 0 ? '+' : '−'}
      {Math.abs(v)} %
    </span>
  </div>
);

const M1_Paradox: Page = () => (
  <Frame mod={1} beats={3} kind="actu">
    <Title>Le paradoxe de la productivité</Title>
    <Lede>Étude METR (2025) : 16 développeurs open source expérimentés, 246 tâches réelles, avec ou sans IA.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, fontSize: 30, fontWeight: 600, color: C.ink }}>
      À votre avis, avec l’IA, ont-ils été plus rapides ? Main levée : plus rapides · pareil · plus lents.
    </div>
    <div style={{ position: 'absolute', left: 120, top: 370, display: 'flex', flexDirection: 'column', gap: 34 }}>
      <M1Bar label="Gain attendu (avant)" v={24} tone="blue" beat={1} d={0} />
      <M1Bar label="Gain ressenti (après)" v={20} tone="violet" beat={2} d={0} />
      <M1Bar label="Effet mesuré" v={-19} tone="coral" beat={3} d={0} />
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 120, top: 720, width: 1680, display: 'flex', gap: 24, ...dl(300) }}>
      <Card tone="coral" icon="gauge" title="Mesurez, ne ressentez pas" style={{ flex: 1 }} size={22}>
        L’impression de vitesse n’est pas un indicateur. Comparez des tâches terminées et validées.
      </Card>
      <Card tone="blue" icon="layers" title="Tout dépend du contexte" style={{ flex: 1 }} size={22}>
        Experts sur leur propre code mature : l’IA aide moins. Code nouveau, tests, boilerplate : elle aide plus.
      </Card>
      <Card tone="grey" icon="clock" title="Un résultat daté" style={{ flex: 1 }} size={22}>
        Outils de début 2025 : METR le qualifie lui-même d’historique. Le message de méthode, lui, reste.
      </Card>
    </div>
  </Frame>
);

// ─── Critères de choix (pondération interactive) ────────────────────────────
const M1_CRIT = ['Coût / budget', 'Intégration à l’outillage', 'Langages & frameworks', 'Confidentialité des données', 'Performance des résultats', 'Support & communauté'];
const M1_ARCH = [
  { name: 'Assistant IDE en SaaS (offre entreprise)', s: [3, 5, 5, 4, 5, 5], tone: 'blue' as Tone },
  { name: 'Agent CLI / cloud', s: [2, 4, 5, 3, 5, 4], tone: 'violet' as Tone },
  { name: 'Modèle ouvert hébergé en interne', s: [3, 3, 4, 5, 3, 2], tone: 'navy' as Tone },
];

const M1CritRow = ({ i, w, set }: { i: number; w: number[]; set: (i: number, v: number) => void }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 66 }}>
    <span style={{ width: 340, fontSize: 24, color: C.ink }}>{M1_CRIT[i]}</span>
    <Range value={w[i]} onChange={(v) => set(i, v)} min={0} max={5} step={1} w={330} tone={i === 3 ? 'coral' : 'blue'} />
    <span style={{ width: 40, fontFamily: display, fontWeight: 800, fontSize: 30, color: i === 3 ? C.coral : C.blue }}>{w[i]}</span>
  </div>
);

const M1ArchRow = ({ i, w, best }: { i: number; w: number[]; best: number }) => {
  const a = M1_ARCH[i];
  const tot = w.reduce((x, y) => x + y, 0) || 1;
  const score = a.s.reduce((acc, s, j) => acc + s * w[j], 0) / tot;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: C.ink }}>
        <span style={{ fontWeight: best === i ? 700 : 400 }}>
          {best === i ? '★ ' : ''}
          {a.name}
        </span>
        <strong style={{ color: STRONG[a.tone] }}>{fr(score, 1)} / 5</strong>
      </div>
      <div style={{ marginTop: 6, height: 20, borderRadius: 10, background: C.panel, overflow: 'hidden' }}>
        <div style={{ width: `${(score / 5) * 100}%`, height: '100%', background: STRONG[a.tone], transition: `width 400ms ${EASE}` }} />
      </div>
    </div>
  );
};

const M1_Criteria: Page = () => {
  const [w, setW] = useState([3, 3, 3, 3, 3, 3]);
  const set = (i: number, v: number) => setW((o) => o.map((x, j) => (j === i ? v : x)));
  const scores = M1_ARCH.map((a) => a.s.reduce((acc, s, j) => acc + s * w[j], 0));
  const best = scores.indexOf(Math.max(...scores));
  return (
    <Frame mod={1} kind="exercice">
      <Title>Choisir un outil : six critères, vos priorités</Title>
      <Lede>Réglez le poids de chaque critère selon VOTRE contexte : le classement des familles d’outils change.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <M1CritRow i={0} w={w} set={set} />
        <M1CritRow i={1} w={w} set={set} />
        <M1CritRow i={2} w={w} set={set} />
        <M1CritRow i={3} w={w} set={set} />
        <M1CritRow i={4} w={w} set={set} />
        <M1CritRow i={5} w={w} set={set} />
        <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
          <Btn size={19} ghost tone="coral" onClick={() => setW([2, 2, 2, 5, 3, 2])}>
            Projet sensible
          </Btn>
          <Btn size={19} ghost tone="blue" onClick={() => setW([2, 5, 3, 3, 3, 5])}>
            Grande équipe
          </Btn>
          <Btn size={19} ghost tone="green" onClick={() => setW([5, 3, 3, 2, 4, 2])}>
            Startup
          </Btn>
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1000, top: 270, width: 800, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 24, ...dl(150) }}>
        <Eyebrow c={C.navy}>Score pondéré par famille</Eyebrow>
        <M1ArchRow i={0} w={w} best={best} />
        <M1ArchRow i={1} w={w} best={best} />
        <M1ArchRow i={2} w={w} best={best} />
        <div style={{ fontSize: 20, lineHeight: 1.45, color: C.muted }}>
          Notes indicatives à recalibrer avec vos propres essais (atelier comparatif). Un critère peut être éliminatoire : la confidentialité sur un projet
          sensible, par exemple.
        </div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 1000, top: 790, width: 800, ...dl(300) }}>
        <Callout title="Le bon réflexe" tone="violet" icon="scale" size={23}>
          Pas de « meilleur outil » dans l’absolu : un outil adapté à un usage, à un niveau de risque et à un budget.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Confidentialité & contrat ──────────────────────────────────────────────
const M1Plan = ({ title, tone, children, d }: { title: string; tone: Tone; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 26px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
  </div>
);

const M1_Privacy: Page = () => (
  <Frame mod={1} kind="actu">
    <Title>Vos données : lisez le contrat avant le code</Title>
    <Lede>Exemple GitHub Copilot, deux changements de 2026 qui touchent directement les équipes.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1100, display: 'flex', gap: 22 }}>
      <M1Plan title="Copilot Free, Pro, Pro+" tone="coral" d={100}>
        <Bullet tone="coral" size={22}>
          Depuis le 24 avril 2026 : prompts, extraits de code et contexte peuvent servir à <strong>entraîner les modèles</strong>, sauf opposition
        </Bullet>
        <Bullet tone="coral" size={22}>Réglage : Settings → Copilot → confidentialité (opt-out)</Bullet>
      </M1Plan>
      <M1Plan title="Copilot Business, Enterprise" tone="green" d={220}>
        <Bullet tone="green" size={22}>Données d’interaction non utilisées pour l’entraînement</Bullet>
        <Bullet tone="green" size={22}>Exclusion de contenu, journaux d’audit, politiques d’organisation</Bullet>
      </M1Plan>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 600, width: 1100, ...dl(400) }}>
      <Callout title="Et depuis le 1er juin 2026" tone="blue" icon="euro" size={24}>
        Copilot passe à la <strong>facturation à l’usage</strong> : des crédits IA (1 crédit = 0,01 $) calculés sur les tokens en entrée, en sortie et
        en cache. Une longue session d’agent coûte désormais plus qu’une question rapide.
      </Callout>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1280, top: 260, width: 520, background: G.navy, borderRadius: 20, padding: '26px 30px', color: '#fff', ...dl(300) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26 }}>6 questions à tout fournisseur</div>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14, fontSize: 22, lineHeight: 1.35, color: '#DCE3FA' }}>
        <div>1 · Mes données entraînent-elles vos modèles ?</div>
        <div>2 · Combien de temps sont-elles conservées ?</div>
        <div>3 · Où sont-elles traitées (UE ?)</div>
        <div>4 · Quels sous-traitants y accèdent ?</div>
        <div>5 · Y a-t-il un DPA conforme au RGPD ?</div>
        <div>6 · Puis-je exclure des fichiers et auditer l’usage ?</div>
      </div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, width: 1680, fontSize: 20, color: C.muted, ...dl(700) }}>
      Les conditions évoluent vite : vérifiez la documentation officielle et votre contrat avant chaque déploiement d’outil.
    </div>
  </Frame>
);

// ─── Forces et limites ──────────────────────────────────────────────────────
const M1FL = ({ icon, tone, title, children, cls }: { icon: IconName; tone: Tone; title: string; children: ReactNode; cls?: string }) => (
  <div className={cls} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
    <IconTile name={icon} tone={tone} size={50} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 21, color: C.soft, lineHeight: 1.38 }}>{children}</div>
    </div>
  </div>
);

const M1_ForcesLimits: Page = () => (
  <Frame mod={1} beats={1}>
    <Title>Forces et limites des assistants IA</Title>
    <Lede>Ce qui justifie leur usage… et ce qui impose de les encadrer.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 820, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', borderTop: `8px solid ${C.green}` }}>
      <Eyebrow c={T.green.fg}>Forces</Eyebrow>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <M1FL icon="bolt" tone="green" title="Vitesse sur le répétitif">Boilerplate, tests, migrations, scripts : des heures gagnées.</M1FL>
        <M1FL icon="brain" tone="green" title="Charge cognitive réduite">L’énergie va aux décisions, pas à la syntaxe.</M1FL>
        <M1FL icon="search" tone="green" title="Exploration d’un code inconnu">Expliquer un module, un legacy, une stack nouvelle.</M1FL>
        <M1FL icon="globe" tone="green" title="Multi-langages, multi-rôles">Du SQL au YAML, du test à la doc.</M1FL>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 980, top: 260, width: 820, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', borderTop: `8px solid ${C.coral}` }}>
      <Eyebrow c={T.coral.fg}>Limites</Eyebrow>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <M1FL icon="eyeOff" tone="coral" title="Contexte projet partiel">Il ignore vos conventions… sauf si vous les écrivez.</M1FL>
        <M1FL icon="loop" tone="coral" title="Résultats variables">Même prompt, autre réponse : d’où les tests.</M1FL>
        <M1FL icon="lock" tone="coral" title="Confidentialité et dépendance">Données envoyées, service tiers, coût à l’usage.</M1FL>
        <M1FL icon="humanCheck" tone="coral" title="Vérification indispensable">La responsabilité du code reste la vôtre.</M1FL>
      </div>
    </div>
  </Frame>
);

// ─── Scénarios d'usage en production ────────────────────────────────────────
const M1Scn = ({ icon, tone, title, promise, gain, trap, flipAt }: { icon: IconName; tone: Tone; title: string; promise: string; gain: string; trap: string; flipAt: number }) => (
  <FlipCard
    w={400}
    h={560}
    tone={tone}
    backTone="grey"
    flipAt={flipAt}
    front={
      <>
        <IconTile name={icon} tone={tone} size={72} />
        <div style={{ marginTop: 22, fontFamily: display, fontWeight: 800, fontSize: 30, color: C.ink, lineHeight: 1.2 }}>{title}</div>
        <div style={{ marginTop: 14, fontSize: 24, lineHeight: 1.45, color: C.soft }}>{promise}</div>
      </>
    }
    back={
      <>
        <Eyebrow c={T.green.fg} size={20}>
          Gain réel
        </Eyebrow>
        <div style={{ marginTop: 8, fontSize: 23, lineHeight: 1.45, color: C.ink }}>{gain}</div>
        <Eyebrow c={T.coral.fg} size={20} style={{ marginTop: 22 }}>
          Piège
        </Eyebrow>
        <div style={{ marginTop: 8, fontSize: 23, lineHeight: 1.45, color: C.ink }}>{trap}</div>
      </>
    }
  />
);

const M1_Scenarios: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>Quatre scénarios d’usage en production</Title>
    <Lede>Cliquez une carte (ou avancez) pour voir le gain réel… et le piège qui va avec.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, display: 'flex', gap: 26 }}>
      <M1Scn icon="rocket" tone="blue" title="Prototypage rapide" promise="De l’idée au MVP cliquable en quelques heures." gain="Valider une idée avec des utilisateurs avant d’investir." trap="Le prototype part en production sans tests ni revue." flipAt={1} />
      <M1Scn icon="loop" tone="violet" title="Code legacy" promise="Comprendre, documenter et moderniser un vieux module." gain="Expliquer un code sans auteur, proposer une migration par étapes." trap="Une réécriture « propre » qui change le comportement." flipAt={2} />
      <M1Scn icon="doc" tone="green" title="Documentation" promise="README, JSDoc, ADR et guides générés depuis le code." gain="Une doc à jour, enfin, et des exemples d’usage." trap="Une doc qui décrit ce que le code devrait faire, pas ce qu’il fait." flipAt={3} />
      <M1Scn icon="flask" tone="pink" title="Tests unitaires" promise="Des suites de tests couvrant les cas limites." gain="Couverture et cas limites oubliés, en minutes." trap="Des tests « complaisants » qui valident le bug." flipAt={4} />
    </div>
  </Frame>
);

// ─── QCM M1 ─────────────────────────────────────────────────────────────────
const M1_Qcm: Page = () => (
  <QcmPage
    mod={1}
    n={1}
    title="Choisir un assistant"
    q="Votre équipe démarre un projet pour un client du secteur santé. Avant de choisir un assistant de code, quel critère vérifiez-vous en premier ?"
    explain="Sur un projet sensible, la confidentialité est éliminatoire : un outil brillant mais non conforme est inutilisable. Les autres critères départagent ensuite les outils conformes."
  >
    <Opt why="Piège ! Les benchmarks publics mesurent des tâches génériques, pas votre conformité ni votre contexte.">Le score de l’outil sur les benchmarks publics</Opt>
    <Opt ok why="Oui : entraînement, rétention, localisation, sous-traitants, DPA. Sans réponse satisfaisante, l’outil est exclu.">
      Les conditions d’usage des données : entraînement, rétention, localisation, contrat
    </Opt>
    <Opt why="Non : utile pour départager, mais secondaire si l’outil ne peut pas recevoir votre code.">Le nombre de langages et de frameworks pris en charge</Opt>
    <Opt why="Non : le coût compte, mais un outil bon marché et non conforme coûte bien plus cher en cas d’incident.">Le prix par développeur et par mois</Opt>
  </QcmPage>
);

// ─── Lab 1.1 ────────────────────────────────────────────────────────────────
const M1_Lab11: Page = () => (
  <LabPage
    mod={1}
    n="1.1"
    title="Problème, personas & PRODUCT.md"
    defi="ameliorer"
    who="Product Owners · toute l’équipe"
    label="Fil rouge · Sprint 1 — De l’idée au produit"
    where={
      <>
        <PathChip>PRODUCT.md</PathChip> à la racine du dépôt (le dossier ouvert dans VS Code).
      </>
    }
    objective={
      <>
        Rédiger un <strong>PRODUCT.md</strong> de 2 pages maximum : le problème, les personas et la proposition de valeur de FrigoMalin. Ce fichier deviendra le
        contexte permanent de tous les agents.
      </>
    }
    feats={
      <>
        <Tag tone="blue" size={18}>Agent Ask</Tag>
        <Tag tone="blue" size={18}>Fichier de contexte produit</Tag>
      </>
    }
    minutes={15}
    crit={
      <>
        <CheckItem id="l11a" size={22}>Le problème est chiffré (ou marqué « à vérifier »)</CheckItem>
        <CheckItem id="l11b" size={22}>Chaque persona a un objectif et une frustration</CheckItem>
        <CheckItem id="l11c" size={22}>Une section « Hors périmètre » existe</CheckItem>
      </>
    }
  >
    Ce prompt produit un texte marketing générique. Réécrivez-le pour obtenir un PRODUCT.md exploitable par des développeurs <em>et</em> par Copilot.
    <CodeDark file="Prompt de départ" size={24} style={{ marginTop: 14 }}>
      Écris la description de mon application anti-gaspillage FrigoMalin.
    </CodeDark>
    <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, fontSize: 21, color: C.violet }}>
      <Icon name="bulb" size={22} color={C.violet} /> Indice : et si Copilot vous posait d’abord ses questions ?
    </div>
  </LabPage>
);

// ─── Atelier comparatif : même prompt, deux outils ──────────────────────────
const M1RateCtx = createContext<{ v: Record<string, number>; set: (k: string, n: number) => void } | null>(null);

const M1Dots = ({ id, tone }: { id: string; tone: Tone }) => {
  const ctx = useContext(M1RateCtx);
  const v = ctx?.v[id] ?? 0;
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          data-osd-interactive
          onClick={(e) => {
            e.currentTarget.blur();
            ctx?.set(id, v === n ? 0 : n);
          }}
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            background: n <= v ? STRONG[tone] : C.panel,
            boxShadow: n <= v ? 'none' : `inset 0 0 0 1.5px ${C.rule}`,
            transition: 'background 200ms ease',
          }}
        />
      ))}
    </div>
  );
};

const M1RateRow = ({ k: key, label }: { k: string; label: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 56, borderBottom: `1.5px solid ${C.rule}` }}>
    <span style={{ flex: 1, fontSize: 23, color: C.ink }}>{label}</span>
    <div style={{ width: 230 }}>
      <M1Dots id={`a-${key}`} tone="blue" />
    </div>
    <div style={{ width: 230 }}>
      <M1Dots id={`b-${key}`} tone="violet" />
    </div>
  </div>
);

const M1Total = ({ side, tone }: { side: 'a' | 'b'; tone: Tone }) => {
  const ctx = useContext(M1RateCtx);
  const s = Object.entries(ctx?.v ?? {})
    .filter(([key]) => key.startsWith(`${side}-`))
    .reduce((a, [, n]) => a + n, 0);
  return (
    <div style={{ width: 230 }}>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: STRONG[tone] }}>{s}</span>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 24, color: C.faint }}> / 30</span>
    </div>
  );
};

const M1_Compare: Page = () => {
  const [v, setV] = useState<Record<string, number>>({});
  const set = (key: string, n: number) => setV((o) => ({ ...o, [key]: n }));
  return (
    <Frame mod={1} kind="atelier" label="Fil rouge · Sprint 1 — De l’idée au produit">
      <Title>Atelier : même prompt, deux outils</Title>
      <Lede>Votre prompt amélioré du lab 1.1, dans Copilot Chat ET dans un second assistant. Notez, comparez, argumentez.</Lede>
      <M1RateCtx.Provider value={{ v, set }}>
        <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 1120, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 50 }}>
            <span style={{ flex: 1, fontSize: 20, color: C.muted, fontWeight: 700, letterSpacing: '0.06em' }}>CRITÈRE (1 à 5)</span>
            <span style={{ width: 230, fontSize: 21, fontWeight: 800, color: C.blue }}>Outil A · Copilot</span>
            <span style={{ width: 230, fontSize: 21, fontWeight: 800, color: C.violet }}>Outil B · au choix</span>
          </div>
          <M1RateRow k="pert" label="Pertinence et précision du contenu" />
          <M1RateRow k="quest" label="Pose des questions avant d’écrire" />
          <M1RateRow k="fmt" label="Respect du format demandé" />
          <M1RateRow k="fact" label="Factualité : rien d’inventé" />
          <M1RateRow k="integ" label="Intégration au workflow (dépôt, fichiers)" />
          <M1RateRow k="conf" label="Confidentialité et conditions d’usage" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 66 }}>
            <span style={{ flex: 1, fontSize: 23, fontWeight: 700, color: C.ink }}>Total</span>
            <M1Total side="a" tone="blue" />
            <M1Total side="b" tone="violet" />
          </div>
        </div>
      </M1RateCtx.Provider>
      <div style={{ position: 'absolute', left: 1300, top: 260, width: 500, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Timer id="m1-compare" minutes={10} label="Atelier comparatif" cls={A.right} style={{ width: 500 }} />
        <div className={A.right} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 24px', ...dl(200) }}>
          <PanelTitle icon="users">Consignes</PanelTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 21, lineHeight: 1.4, color: C.soft }}>
            <div>1 · Même prompt, mot pour mot, dans les deux outils.</div>
            <div>2 · Outil B : ChatGPT, Claude, Gemini ou Le Chat.</div>
            <div>3 · Notez sans vous concerter, puis comparez en binôme.</div>
            <div>4 · Une phrase pour le groupe : « on garde A pour…, B pour… ».</div>
          </div>
        </div>
      </div>
    </Frame>
  );
};

// ─── Lab 1.2 ────────────────────────────────────────────────────────────────
const M1_Lab12: Page = () => (
  <LabPage
    mod={1}
    n="1.2"
    title="Périmètre du MVP & critères de succès"
    defi="trous"
    who="Product Owners · binômes"
    label="Fil rouge · Sprint 1 — De l’idée au produit"
    where={
      <>
        <PathChip>docs/mvp.md</PathChip> (créez le dossier <PathChip>docs/</PathChip> à la racine).
      </>
    }
    objective="Prioriser les fonctionnalités (MoSCoW) et définir des critères de succès mesurables pour le POC."
    feats={
      <>
        <Tag tone="blue" size={18}>Agent Plan</Tag>
        <Tag tone="blue" size={18}>Priorisation MoSCoW</Tag>
      </>
    }
    minutes={15}
    crit={
      <>
        <CheckItem id="l12a" size={22}>5 à 7 « Must » maximum</CheckItem>
        <CheckItem id="l12b" size={22}>Chaque « Must » a un critère mesurable</CheckItem>
        <CheckItem id="l12c" size={22}>Le partage familial est en « Won’t » (backend)</CheckItem>
      </>
    }
    bonus={
      <Callout title="Bonus · Lab 1.3" tone="pink" icon="sparkles" size={21}>
        Le backlog dans GitHub Issues via le serveur MCP GitHub (<code style={{ fontFamily: mono }}>.mcp.json</code>), critères Gherkin inclus.
      </Callout>
    }
  >
    Complétez les trous, puis lancez le prompt avec l’agent Plan en joignant PRODUCT.md.
    <CodeDark size={21} style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>
      Agis comme <Hole>rôle</Hole>.{'\n'}À partir de <Cf>#PRODUCT.md</Cf>, propose le périmètre du POC FrigoMalin avec la méthode <Hole>priorisation</Hole>.{'\n'}
      Contraintes : <Hole>3 contraintes techniques non négociables</Hole>.{'\n'}Pour chaque « Must », donne <Hole>critère de réussite</Hole>.{'\n'}
      Format : <Hole>format</Hole>, enregistré dans docs/mvp.md.
    </CodeDark>
  </LabPage>
);

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
  title: "Docaposte · Dev & IA — Jour 1",
  createdAt: '2026-10-10T15:20:00.000Z',
};

export default [
  M1_Divider,
  M1_Timeline,
  M1_Determinism,
  M1_NextToken,
  M1_Context,
  M1_Halluc,
  M1_Software3,
  M1_Levels,
  M1_Typology,
  M1_Market,
  M1_Paradox,
  M1_Criteria,
  M1_Privacy,
  M1_ForcesLimits,
  M1_Scenarios,
  M1_Qcm,
  M1_Lab11,
  M1_Compare,
  M1_Lab12,
] satisfies Page[];

// Speaker notes — one entry per page, same order as the default export.
export const notes: (string | undefined)[] = [
  `⏱ 1 min · DIVISEUR M1 · 9:30

OBJECTIF — Annoncer le module 1 du programme : panorama des outils, critères de choix, forces et limites, scénarios d’usage, atelier comparatif.

DIRE — « Module 1 : le panorama des outils. Avant de choisir un outil, il faut comprendre ce qu’il y a dessous. Je vais donc commencer par vingt minutes sur le fonctionnement d’un LLM, vu par un développeur : prédiction de tokens, contexte, hallucinations. Ce sont trois notions qui expliquent 80 % des surprises que vous aurez avec ces outils. Ensuite, la typologie des outils en 2026, les critères de choix, les forces et les limites. Puis on passe à la pratique : lab 1.1 sur FrigoMalin, un atelier comparatif entre deux outils, et le lab 1.2. »

ANIMATION — Laisser apparaître les items, pointer les badges de labs en bas.

TRANSITION — « Commençons par une question simple : l’IA, depuis quand ? »`,
  `⏱ 4 min · FRISE (3 temps)

OBJECTIF — Situer l’IA générative et agentique dans 75 ans d’histoire ; montrer l’accélération récente.

DIRE — « L’IA n’est pas née avec ChatGPT. 1950, Turing pose la question : une machine peut-elle penser ? 1956, la conférence de Dartmouth invente le terme. 1986, la rétropropagation permet aux réseaux de neurones d’apprendre. 1997, Deep Blue bat Kasparov, avec une IA encore très “règles et calcul”. 2012, AlexNet ouvre l’ère du deep learning. » → clic 1. « 2017, l’article Transformer de Google, “Attention is all you need” : c’est l’architecture de tous les LLM actuels. 2021, GitHub Copilot en preview : la complétion de code par IA. Fin 2022, ChatGPT. » → clic 2. « Et depuis 2024, ça s’accélère encore : MCP permet aux modèles de se brancher aux outils, 2025 est l’année des agents de code, et 2026 celle des équipes d’agents… et de la facturation à l’usage. »

ANIMATION — → beat 1 : époque générative (violet). → beat 2 : époque agentique (vert).

TRANSITION — « Ce qui change fondamentalement, c’est la nature du programme. Démonstration. »`,
  `⏱ 4 min · DÉMO INTERACTIVE

OBJECTIF — Faire sentir la différence déterministe / probabiliste, et en tirer les réflexes de vérification.

DIRE — « À gauche, un programme classique : un calcul de TVA. Je relance, je relance : toujours 10 euros. C’est testable, explicable, reproductible. À droite, je demande à une IA : “écris une fonction qui valide un email”. Je relance… » Cliquer 3 ou 4 fois. « Regex simple, regex illisible, bibliothèque externe, approche maison. Toutes plausibles, aucune identique. Ce n’est pas un bug, c’est la nature du modèle. Conséquence : vous ne pouvez pas juger le code généré sur sa première impression. Trois réflexes : un prompt précis, des tests qui fixent le comportement attendu, et une revue humaine. »

ANIMATION — Cliquer « Relancer » à droite plusieurs fois, puis une fois à gauche. Demander : « Laquelle de ces quatre versions accepteriez-vous en PR ? » Réponse attendue : aucune sans tests.

TRANSITION — « Pourquoi ces variations ? Regardons comment le modèle choisit chaque mot. »`,
  `⏱ 4 min · DÉMO INTERACTIVE

OBJECTIF — Comprendre la prédiction du prochain token et l’effet de la température.

DIRE — « Le modèle lit tout ce qui précède et calcule, pour chaque suite possible, une probabilité. Ici, après “new Date(item.expiresOn) <”, la suite la plus probable est “new Date()”, puis “Date.now()” : deux suites correctes. Mais il existe aussi “today”, une variable qui n’existe pas, et “item.addedOn”, une logique fausse. Le modèle ne sait pas ce qui est vrai : il sait ce qui est probable. La température règle le hasard. Basse : on prend presque toujours la suite la plus probable. Haute : on explore… et on se trompe plus souvent. » Mettre la température à 0,2, échantillonner cinq fois ; puis à 1,8, échantillonner cinq fois.

ANIMATION — Compter les « suites fausses » dans les deux cas. Les outils de code fixent généralement une température basse pour la complétion.

TRANSITION — « Ce que le modèle lit avant de prédire, c’est son contexte. Et il coûte cher. »`,
  `⏱ 4 min · DÉMO INTERACTIVE

OBJECTIF — Comprendre la fenêtre de contexte : ce qui est envoyé à chaque requête et pourquoi ça compte (coût, latence, qualité).

DIRE — « Le modèle n’a aucune mémoire entre deux requêtes. Ce que vous prenez pour de la mémoire, c’est l’outil qui renvoie tout le contexte à chaque fois. Au départ : le prompt système de l’outil, les instructions du dépôt, vos fichiers joints, votre question. Léger. » Activer l’historique. « Une session qui dure depuis le matin : l’historique pèse lourd. » Activer les outils MCP, puis les résultats d’outils. « Les définitions d’outils et surtout leurs résultats — fichiers lus en entier, sorties de tests de 400 lignes — font exploser le contexte. Votre question pèse moins de 1 % de ce qui part. Trois conséquences : la facture, puisqu’on paie au token depuis juin ; la latence ; et la qualité, car un contexte saturé noie l’essentiel. »

ANIMATION — Activer les sources dans l’ordre. Le compteur passe du vert au rouge. Les chiffres sont des ordres de grandeur.

TRANSITION — « Dernière notion clé : quand le modèle ne sait pas, il invente quand même. »`,
  `⏱ 3 min · HALLUCINATIONS (2 temps)

OBJECTIF — Définir l’hallucination et ses formes typiques en développement.

DIRE — « Je demande un paquet npm pour lire des DLC françaises. Réponse fluide, précise, avec le nom du paquet, la commande d’installation et la fonction à appeler. » → clic 1. « Ce paquet n’existe pas. Le modèle a assemblé un nom crédible. Et c’est dangereux : si un attaquant publie ce nom-là avec du code malveillant, la commande d’installation devient un cheval de Troie. On en reparle au module 3. » → clic 2. « Les quatre formes que vous rencontrerez : le paquet inexistant, l’API ou le paramètre inventé, la connaissance périmée — le modèle connaît la version d’il y a deux ans —, et la source fabriquée : une RFC, un article du RGPD, un chiffre. »

ANIMATION — Demander : « Qui a déjà eu une API inventée par une IA ? » Recueillir un ou deux exemples réels.

TRANSITION — « Prenons un peu de recul : qu’est-ce que programmer, à l’ère des LLM ? »`,
  `⏱ 3 min · SOFTWARE 3.0 (1 temps)

OBJECTIF — Donner un cadre mental : coexistence code / poids / prompts ; distinguer vibe coding et ingénierie assistée.

DIRE — « Andrej Karpathy propose une lecture que je trouve utile. Software 1.0 : du code, écrit par un humain, qui programme un ordinateur. Software 2.0 : des poids, appris sur des données, qui programment un réseau de neurones. Software 3.0 : des prompts, écrits en langue naturelle, qui programment un LLM. Les trois coexistent dans vos projets. En 2023, il résumait : “le langage de programmation le plus en vogue, c’est l’anglais”. » → clic. « En 2025, il a aussi popularisé le “vibe coding” : on décrit, on accepte sans lire, on relance. C’est acceptable pour un prototype jetable. Mais dans une entreprise, on fait de l’ingénierie assistée : on spécifie, on découpe, on vérifie, on versionne. C’est exactement ce que nous allons pratiquer. »

ANIMATION — Insister sur la différence entre les deux cartes du bas : elle structure toute la formation.

TRANSITION — « Concrètement, quels niveaux d’assistance avez-vous à disposition ? »`,
  `⏱ 3 min · NIVEAUX D’ASSISTANCE (4 temps)

OBJECTIF — Situer complétion, chat, édition, agent et agent autonome sur un axe autonomie / contrôle.

DIRE — « Niveau 1 : la complétion. Vous tapez, l’IA propose, Tab pour accepter. Les suggestions d’édition suivante devinent la modification d’après. Vous lisez chaque ligne. » → clic. « Niveau 2 : le chat, en mode Ask. On explique, on compare, on questionne. » → clic. « Niveau 3 : l’édition guidée, le chat inline. Vous relisez un diff. » → clic. « Niveau 4 : l’agent dans l’IDE. Il lit plusieurs fichiers, modifie, lance des commandes, les tests. Le contrôle devient : un plan validé avant, des diffs relus, des tests au vert. » → clic. « Niveau 5 : l’agent autonome — en ligne de commande, dans le cloud, qui ouvre des PR tout seul. Là, le contrôle, c’est la revue de PR, la CI et des droits limités. Règle : plus d’autonomie, plus de contrôle organisé. Et on choisit le niveau le plus léger qui suffit à la tâche. »

ANIMATION — Les cinq marches apparaissent une à une.

TRANSITION — « Voyons maintenant qui fournit quoi : la typologie des outils. »`,
  `⏱ 4 min · TYPOLOGIE

OBJECTIF — Couvrir la typologie du programme (IDE avec IA, assistants conversationnels, outils spécialisés) et la mettre à jour pour 2026.

DIRE — « Le programme parle de trois familles : les environnements de développement avec IA, les assistants conversationnels et les outils spécialisés — tests, documentation, performance. En 2026, j’en ajoute deux qui ont explosé. Les assistants dans l’IDE : Copilot, Cursor, Windsurf, JetBrains avec Junie, Gemini Code Assist. Les assistants conversationnels, hors de l’éditeur. Les agents en ligne de commande et dans le cloud : Claude Code, Codex, Gemini CLI, Copilot CLI et le coding agent de GitHub. Les IDE cloud et générateurs d’applications : Codespaces, Replit, Bolt, Lovable, v0, et Google Stitch pour les interfaces, qu’on utilisera. Les outils spécialisés. Et les modèles ouverts, exécutables en local, pour la souveraineté. »

ANIMATION — Demander quels outils sont autorisés dans leur entreprise. Point de vigilance : le paysage change chaque trimestre, ces noms sont des exemples, pas des recommandations.

TRANSITION — « Qui les utilise, et avec quelle confiance ? »`,
  `⏱ 3 min · ACTUALITÉ · CHIFFRES

OBJECTIF — Donner des chiffres récents et sourcés sur l’adoption et la confiance.

DIRE — « Le rapport DORA 2025 de Google : 90 % des professionnels du logiciel utilisent l’IA, avec une médiane de deux heures par jour, et plus de 80 % se disent plus productifs. L’enquête Stack Overflow 2026, plus de 30 000 répondants : 66 % utilisent un assistant ou un agent de code. Mais la confiance ne suit pas : en 2025, 46 % se méfiaient de l’exactitude des réponses, contre 33 % qui lui faisaient confiance. En 2026, la confiance devient conditionnelle : on fait confiance quand on peut vérifier facilement, et seulement 6,6 % confieraient une décision importante à l’IA. 79 % veulent connaître la source. Message : tout le monde utilise l’IA, personne ne la croit sur parole. Ce sont des chiffres déclaratifs : ils mesurent des perceptions. »

ANIMATION — Les compteurs s’animent. Demander : « Ces chiffres ressemblent-ils à votre équipe ? »

TRANSITION — « Et justement, les perceptions peuvent tromper. »`,
  `⏱ 4 min · ACTUALITÉ · PARADOXE (3 temps)

OBJECTIF — Montrer l’écart entre productivité ressentie et mesurée ; installer le réflexe de mesure.

DIRE — « L’étude METR, 2025 : 16 développeurs open source expérimentés, sur leurs propres projets, 246 tâches réelles, tirées au sort avec ou sans IA. Votez : plus rapides, pareil, plus lents ? » Compter. → clic 1. « Avant, ils pensaient gagner 24 %. » → clic 2. « Après, ils estimaient avoir gagné 20 %. » → clic 3. « Mesuré : 19 % plus lents. Pourquoi ? Des experts sur un code qu’ils connaissent par cœur ; du temps passé à formuler, attendre, relire, corriger. Trois leçons : mesurez au lieu de ressentir ; le gain dépend fortement de la tâche et du contexte ; et c’est un résultat daté — METR le qualifie lui-même d’historique, les outils ont beaucoup progressé. Mais la leçon de méthode reste : on va définir des indicateurs au module 2. »

ANIMATION — Laisser le groupe réagir après la révélation du −19 %.

TRANSITION — « Si on veut mesurer et choisir, il faut des critères. »`,
  `⏱ 5 min · EXERCICE INTERACTIF

OBJECTIF — Appliquer les six critères de choix du programme (coût, intégration, langages, confidentialité, performance, support) à des familles d’outils.

DIRE — « Six critères : coût, intégration à votre outillage, langages et frameworks, confidentialité, performance, support et communauté. Il n’y a pas de meilleur outil dans l’absolu : il y a vos poids. » Cliquer « Projet sensible » : la confidentialité monte à 5, le modèle hébergé en interne remonte. Cliquer « Grande équipe » : intégration et support dominent, l’assistant IDE entreprise passe devant. Cliquer « Startup » : le coût pèse. « Ces notes sont indicatives : vous allez les recalibrer avec vos propres essais dans l’atelier comparatif. Et un critère peut être éliminatoire : sur un projet santé, si la confidentialité n’est pas garantie, le reste ne compte plus. »

ANIMATION — Faire régler les curseurs par un participant selon son contexte réel.

TRANSITION — « Parlons justement de ce critère éliminatoire : vos données. »`,
  `⏱ 3 min · ACTUALITÉ · CONFIDENTIALITÉ

OBJECTIF — Montrer que les conditions d’usage changent et doivent être vérifiées ; deux actualités 2026 de Copilot.

DIRE — « Deux changements de 2026 chez GitHub. Un : depuis le 24 avril, pour les offres individuelles Free, Pro et Pro+, les données d’interaction — prompts, extraits de code, contexte — peuvent servir à entraîner les modèles, sauf si vous vous y opposez dans les paramètres. Les offres Business et Enterprise ne sont pas concernées. Conséquence pratique : un développeur qui utilise son compte personnel sur du code d’entreprise pose un problème. Deux : depuis le 1er juin, Copilot est facturé à l’usage, en crédits calculés sur les tokens. Une longue session d’agent coûte plus qu’une question. À droite, six questions à poser à tout fournisseur : entraînement, rétention, localisation, sous-traitants, contrat RGPD, exclusion et audit. »

ANIMATION — Demander : « Qui utilise un compte personnel pour coder au travail ? » sans jugement.

TRANSITION — « Faisons le bilan : forces et limites. »`,
  `⏱ 2 min · FORCES ET LIMITES (1 temps)

OBJECTIF — Synthétiser les forces et limites (point du programme).

DIRE — « Les forces : la vitesse sur le répétitif — boilerplate, tests, migrations ; une charge cognitive réduite, l’énergie va aux décisions ; l’exploration d’un code inconnu ; la polyvalence, du SQL au YAML. » → clic. « Les limites : le contexte projet est partiel, l’IA ignore vos conventions tant que vous ne les écrivez pas ; les résultats varient ; la confidentialité et la dépendance à un service tiers, désormais facturé à l’usage ; et surtout la vérification reste indispensable. La responsabilité du code reste la vôtre. »

ANIMATION — Relier chaque limite à un module : contexte → M2, variabilité → tests M6, confidentialité → M5.

TRANSITION — « Dans quels scénarios ces forces paient-elles vraiment ? »`,
  `⏱ 4 min · SCÉNARIOS (4 temps)

OBJECTIF — Présenter les scénarios d’usage du programme avec leur gain et leur piège.

DIRE — « Quatre scénarios en production. Prototypage rapide : de l’idée au MVP en quelques heures. » → clic. « Gain réel : valider avec des utilisateurs avant d’investir. Piège : le prototype part en production sans tests. » → clic. « Code legacy : comprendre et moderniser. Piège : une réécriture élégante qui change le comportement. On verra comment l’éviter avec des tests de caractérisation. » → clic. « Documentation : enfin à jour. Piège : une doc qui décrit ce que le code devrait faire, pas ce qu’il fait. » → clic. « Tests unitaires : couverture et cas limites. Piège : des tests complaisants, générés à partir du code bogué, qui valident le bug. »

ANIMATION — Les cartes se retournent au clic (ou cliquer directement une carte). Demander quel scénario est le plus utile dans leur équipe.

TRANSITION — « Vérifions que le critère de choix est bien acquis. »`,
  `⏱ 2 min · QCM 1

OBJECTIF — Vérifier que la confidentialité est comprise comme critère éliminatoire.

DIRE — « Projet santé, quel critère en premier ? Votez. »

RÉPONSES — A ✗ piège : les benchmarks publics ne disent rien de votre conformité. B ✓ conditions d’usage des données : entraînement, rétention, localisation, contrat. C ✗ secondaire. D ✗ le coût d’un incident dépasse largement l’économie.

ANIMATION — Laisser cliquer les options, → révèle la bonne réponse, → l’explication. Rebondir : « Dans votre entreprise, qui valide ces conditions ? Le RSSI, le DPO, les achats ? » Les profils RSSI présents peuvent témoigner.

TRANSITION — « Passons à la pratique. Sprint 1 de FrigoMalin : de l’idée au produit. »`,
  `⏱ 15 min (minuteur) · LAB 1.1 · 10:45

OBJECTIF — Écrire un PRODUCT.md exploitable, en améliorant un mauvais prompt ; découvrir l’agent Ask comme sparring partner.

DIRE — « Tout commence par un problème, pas par du code. Le prompt de départ produit un texte marketing générique. Votre mission : le réécrire pour obtenir un PRODUCT.md de deux pages, factuel, qui servira de contexte à tous vos agents. Indice : demandez à Copilot de vous poser ses questions avant d’écrire. »

CORRIGÉ (formateur) — Rôle (PO senior anti-gaspillage) ; contexte (PWA 100 % navigateur, GitHub Pages, pas de backend, pas de comptes) ; « pose-moi au maximum 5 questions » ; structure imposée : problème chiffré et sourcé ou « à vérifier », 3 personas (objectif, frustration, moment d’usage), proposition de valeur en 1 phrase et 3 parcours, hors périmètre, glossaire DLC/DDM ; 2 pages max, ton factuel.

ANIMATION — Lancer le minuteur. Circuler : vérifier que les binômes laissent Copilot poser ses questions. Ce même prompt servira à l’atelier comparatif juste après : demander de le garder.

TRANSITION — « Prompt prêt ? Lancez-le maintenant dans un second outil. »`,
  `⏱ 10 min (minuteur) · ATELIER COMPARATIF (programme : test comparatif de deux outils)

OBJECTIF — Comparer deux outils sur une tâche réelle avec une grille commune ; recalibrer les critères de choix.

DIRE — « L’atelier du programme : tester deux outils sur la même tâche. Vous prenez votre prompt amélioré, mot pour mot, et vous le lancez dans Copilot Chat et dans un second assistant : ChatGPT, Claude, Gemini ou Le Chat de Mistral. Notez chaque critère de 1 à 5 sans vous concerter, puis comparez en binôme. Attention au critère “factualité” : vérifiez que les chiffres cités existent. Et au critère “confidentialité” : quel compte utilisez-vous, avec quelles conditions ? »

ANIMATION — Lancer le minuteur. La grille est cliquable : un clic sur une pastille note, un second clic annule. En restitution, chaque binôme donne sa phrase « on garde A pour…, B pour… ». Constat fréquent : l’assistant de l’IDE gagne sur l’intégration, le chat externe sur la rédaction, et beaucoup ont inventé un chiffre de gaspillage.

TRANSITION — « Vous avez le pourquoi. Passons au périmètre : le MVP. »`,
  `⏱ 15 min (minuteur) · LAB 1.2

OBJECTIF — Cadrer le MVP avec MoSCoW et des critères mesurables, avec l’agent Plan.

DIRE — « Deuxième lab, côté PO. Un prompt à trous : chaque trou est une décision. Le rôle, la méthode de priorisation, trois contraintes techniques non négociables, ce qui prouve qu’une fonctionnalité Must est réussie, et le format. Lancez-le avec l’agent Plan, en joignant PRODUCT.md avec le dièse. »

CORRIGÉ (formateur) — Rôle : PO + architecte front ; méthode MoSCoW ; contraintes : 100 % statique sur GitHub Pages, données locales (IndexedDB), hors ligne ; critère mesurable par Must (ex. « ajout d’un produit en moins de 10 s », « scan reconnu sur 8 produits sur 10 ») ; format : tableau Markdown Must/Should/Could/Won’t + critères, dans docs/mvp.md. Piège attendu : le partage familial doit être en Won’t, car il exige un backend.

ANIMATION — Lancer le minuteur. Pour les rapides : bonus 1.3, créer les issues GitHub via le serveur MCP GitHub (nécessite la politique MCP activée sur les licences Business).

TRANSITION — « Le produit est cadré. Module 2 : comment intégrer l’IA dans tout le cycle de développement. »`,
];
