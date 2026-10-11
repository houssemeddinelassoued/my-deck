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

const Footer = ({ left = 120, short = false }: { left?: number; short?: boolean }) => {
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
        <span style={{ fontSize: 19, fontWeight: 700, color: C.navy, whiteSpace: 'nowrap' }}>{AUTHOR}</span>
        {short ? null : <span style={{ width: 1.5, height: 24, background: C.rule }} />}
        {short ? null : <span style={{ fontSize: 19, color: C.muted, whiteSpace: 'nowrap' }}>{COURSE}</span>}
      </div>
      <span style={{ fontFamily: mono, fontSize: 19, color: C.muted, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
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
          {time(60)}
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
          Le défi
        </PanelTitle>
        <div style={{ fontSize: 21, fontStyle: 'italic', color: C.muted, marginTop: -4, marginBottom: 10 }}>{DEFIS[defi].aide}</div>
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

// ═══ j1-20-m2 ══════════════════════════════════════════════════════════

// ─── Module 2 · Intégrer l'IA dans le workflow ──────────────────────────────

const M2_Divider: Page = () => (
  <Section
    n={2}
    title={
      <>
        Intégrer l’IA dans
        <br />
        le workflow
      </>
    }
    sub="L’IA à chaque étape du cycle : modes, prompting, contexte, collaboration humain–IA et indicateurs."
    dur="11:30 – 15:30 · labs inclus"
    labs={
      <>
        <Tag tone="green" size={19}>2.1</Tag>
        <Tag tone="green" size={19}>2.2</Tag>
        <Tag tone="green" size={19}>2.3</Tag>
        <Tag tone="green" size={19}>3.1</Tag>
        <Tag tone="green" size={19}>3.3</Tag>
        <Tag tone="green" size={19}>3.4</Tag>
      </>
    }
  >
    <SecItem n={1}>Le cycle de développement augmenté</SecItem>
    <SecItem n={2}>Ask, Plan, Agent : le bon mode au bon moment</SecItem>
    <SecItem n={3}>Prompting : les cinq ingrédients</SecItem>
    <SecItem n={4}>Context engineering : instructions, skills, MCP</SecItem>
    <SecItem n={5}>Collaboration humain–IA et indicateurs</SecItem>
  </Section>
);
M2_Divider.transition = BLOOM;

// ─── Le cycle augmenté ──────────────────────────────────────────────────────
const M2Phase = ({ icon, tone, name, ia, you, lab, d }: { icon: IconName; tone: Tone; name: string; ia: ReactNode; you: ReactNode; lab: string; d: number }) => (
  <div className={A.in} style={{ width: 262, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 20px', borderTop: `7px solid ${STRONG[tone]}`, display: 'flex', flexDirection: 'column', gap: 12, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={56} />
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.ink }}>{name}</div>
    <div style={{ fontSize: 20, lineHeight: 1.4, color: C.soft }}>
      <strong style={{ color: STRONG[tone] }}>IA · </strong>
      {ia}
    </div>
    <div style={{ fontSize: 20, lineHeight: 1.4, color: C.soft }}>
      <strong style={{ color: C.navy }}>Vous · </strong>
      {you}
    </div>
    <div style={{ marginTop: 'auto' }}>
      <Tag tone="green" size={17}>
        {lab}
      </Tag>
    </div>
  </div>
);

const M2_Cycle: Page = () => (
  <Frame mod={2}>
    <Title>L’IA à chaque étape du cycle de développement</Title>
    <Lede>Pas un outil de plus : un coéquipier présent de la conception à la maintenance, toujours sous votre contrôle.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, height: 540, display: 'flex', justifyContent: 'space-between' }}>
      <M2Phase icon="bulb" tone="blue" name="Conception" ia="challenge l’idée, propose options et schémas" you="tranchez et documentez (ADR)" lab="Labs 1.x · 2.x" d={100} />
      <M2Phase icon="code" tone="violet" name="Codage" ia="complète, implémente par lots, applique les skills" you="validez le plan, relisez les diffs" lab="Labs 4.x · 5.x" d={200} />
      <M2Phase icon="flask" tone="pink" name="Tests" ia="écrit les tests d’abord, cas limites, E2E" you="vérifiez qu’ils testent la bonne chose" lab="Labs 5.2 · 8.2" d={300} />
      <M2Phase icon="doc" tone="teal" name="Documentation" ia="README, JSDoc, notes de version" you="corrigez ce qui est faux ou daté" lab="Labs 2.2 · 10.2" d={400} />
      <M2Phase icon="eye" tone="yellow" name="Revue" ia="première revue, sécurité, conventions" you="décidez, la responsabilité reste humaine" lab="Labs 6.1 · 8.3" d={500} />
      <M2Phase icon="rocket" tone="green" name="Livraison" ia="écrit la CI, explique un échec, analyse un log" you="gardez les portes de qualité" lab="Lab 9.1" d={600} />
    </div>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <path d="M 250 840 C 250 905, 1670 905, 1670 840" fill="none" stroke={C.faint} strokeWidth={4} strokeDasharray="10 14" className={A.march} />
      <path d="M 262 852 L 250 836 L 238 852" fill="none" stroke={C.faint} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div className={A.fade} style={{ position: 'absolute', left: 0, right: 0, top: 905, textAlign: 'center', fontSize: 22, color: C.muted, ...dl(800) }}>
      Une boucle courte : petites itérations, chaque sortie de l’IA vérifiée avant l’étape suivante.
    </div>
  </Frame>
);

// ─── Ask / Plan / Agent ─────────────────────────────────────────────────────
const M2Mode = ({ icon, tone, name, what, when, risk, cls }: { icon: IconName; tone: Tone; name: string; what: string; when: string; risk: string; cls?: string }) => (
  <div className={cls} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', borderTop: `8px solid ${STRONG[tone]}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={60} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 36, color: STRONG[tone] }}>{name}</div>
    </div>
    <div style={{ marginTop: 18, fontSize: 19, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>CE QU’IL FAIT</div>
    <div style={{ fontSize: 24, lineHeight: 1.4, color: C.ink }}>{what}</div>
    <div style={{ marginTop: 14, fontSize: 19, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>QUAND L’UTILISER</div>
    <div style={{ fontSize: 24, lineHeight: 1.4, color: C.ink }}>{when}</div>
    <div style={{ marginTop: 14, fontSize: 19, fontWeight: 700, letterSpacing: '0.08em', color: T.coral.fg }}>VIGILANCE</div>
    <div style={{ fontSize: 22, lineHeight: 1.4, color: C.soft }}>{risk}</div>
  </div>
);

const M2_Modes: Page = () => (
  <Frame mod={2} beats={2}>
    <Title>Ask, Plan, Agent : le bon mode au bon moment</Title>
    <Lede>Les trois agents intégrés de Copilot dans VS Code, du plus prudent au plus autonome.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'flex', gap: 26 }}>
      <M2Mode cls={A.in} icon="chat" tone="teal" name="Ask" what="Répond, explique, compare. Ne modifie rien." when="Comprendre un code, explorer des options, se faire poser des questions." risk="Les réponses restent des propositions : rien n’est vérifié." />
      <M2Mode cls={b.on(1)} icon="map" tone="blue" name="Plan" what="Analyse le dépôt et produit un plan d’action, sans écrire de code." when="Avant toute tâche de plus d’un fichier : vous validez le plan." risk="Un plan flou donne une exécution floue : relisez-le vraiment." />
      <M2Mode cls={b.on(2)} icon="bot" tone="violet" name="Agent" what="Lit, modifie plusieurs fichiers, lance commandes et tests, itère." when="Exécuter un plan validé, par petits lots, avec un critère de fin." risk="Commandes exécutées, fichiers modifiés : diffs relus, droits limités." />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, width: 1680, display: 'flex', gap: 28, alignItems: 'center', fontSize: 22, color: C.soft, ...dl(600) }}>
      <span>
        <Kbd>Tab</Kbd> complétion
      </span>
      <span>
        <Kbd>Ctrl+I</Kbd> chat inline
      </span>
      <span>
        <Kbd>Ctrl+Alt+I</Kbd> vue Chat
      </span>
      <span>
        <Kbd>#</Kbd> joindre un fichier
      </span>
      <span>
        <Kbd>/compact</Kbd> <Kbd>/fork</Kbd> gérer la session
      </span>
    </div>
  </Frame>
);

// ─── Les 5 ingrédients ──────────────────────────────────────────────────────
const M2Ing = ({ n, tone, title, ex, beat }: { n: number; tone: Tone; title: string; ex: ReactNode; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'flex', gap: 22, alignItems: 'center', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 24px', borderLeft: `8px solid ${STRONG[tone]}` }}>
    <Num n={n} tone={tone} size={54} />
    <div style={{ width: 380, flex: 'none', fontFamily: display, fontWeight: 800, fontSize: 28, color: C.ink }}>{title}</div>
    <div style={{ fontSize: 23, lineHeight: 1.4, color: C.soft, fontStyle: 'italic' }}>{ex}</div>
  </div>
);

const M2_Ingredients: Page = () => (
  <Frame mod={2} beats={4}>
    <Title>Les cinq ingrédients d’un bon prompt</Title>
    <Lede>La grille que vous utiliserez dans chaque lab. Un ingrédient manquant, c’est une décision laissée au hasard.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 265, width: 1680, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M2Ing n={1} tone="blue" title="Un rôle" ex="« Agis comme un développeur TypeScript senior »… ou mieux : le bon agent sélectionné." beat={0} />
      <M2Ing n={2} tone="violet" title="Un contexte ciblé" ex="2 ou 3 fichiers nommés avec # (#PRODUCT.md, #src/domain/types.ts), pas tout le projet." beat={1} />
      <M2Ing n={3} tone="pink" title="Une seule tâche, bornée" ex="« Uniquement le filtre par emplacement. N’écris aucun composant. »" beat={2} />
      <M2Ing n={4} tone="teal" title="Contraintes et format" ex="Où écrire, quel format, quelle longueur : « tests Vitest dans stock.test.ts »." beat={3} />
      <M2Ing n={5} tone="green" title="Un critère de fin" ex="La commande qui prouve que c’est fini : « termine par npm test, tout doit passer »." beat={4} />
    </div>
  </Frame>
);

// ─── Constructeur de prompt interactif ──────────────────────────────────────
const M2_PARTS = [
  { k: 'role', label: 'Rôle', tone: 'blue' as Tone, txt: 'Agis comme un développeur React + TypeScript senior du projet FrigoMalin.' },
  { k: 'ctx', label: 'Contexte ciblé', tone: 'violet' as Tone, txt: 'Fichiers : #src/ui/Inventory/Inventory.tsx et #src/domain/stock.ts.' },
  { k: 'task', label: 'Tâche bornée', tone: 'pink' as Tone, txt: 'Ajoute uniquement un filtre par emplacement (frigo, congélateur, placard). Ne modifie aucun autre écran.' },
  { k: 'fmt', label: 'Contraintes & format', tone: 'teal' as Tone, txt: 'Logique de filtre en fonction pure dans src/domain ; tests Vitest d’abord dans stock.test.ts.' },
  { k: 'done', label: 'Critère de fin', tone: 'green' as Tone, txt: 'Termine par npm test (tout au vert) et résume en 3 lignes les fichiers modifiés.' },
];

const M2Part = ({ i, on }: { i: number; on: boolean }) => {
  const p = M2_PARTS[i];
  return on ? (
    <div className={A.fade} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', animationDuration: '400ms' } as CSSProperties}>
      <span style={{ flex: 'none', width: 8, alignSelf: 'stretch', borderRadius: 4, background: STRONG[p.tone] }} />
      <span>{p.txt}</span>
    </div>
  ) : null;
};

const M2PartBtn = ({ i, on, flip }: { i: number; on: boolean; flip: () => void }) => {
  const p = M2_PARTS[i];
  return (
    <Toggle on={on} onChange={flip} tone={p.tone} size={24} label={<span style={{ fontWeight: 600 }}>{p.label}</span>} />
  );
};

const M2_PromptLab: Page = () => {
  const [on, setOn] = useState<boolean[]>([false, false, false, false, false]);
  const flip = (i: number) => setOn((o) => o.map((x, j) => (j === i ? !x : x)));
  const n = on.filter(Boolean).length;
  const verdict =
    n === 0 ? 'Le modèle devine tout : où, comment, jusqu’où.' : n < 3 ? 'Mieux, mais des décisions restent au hasard.' : n < 5 ? 'Presque : il manque de quoi savoir quand c’est fini.' : 'Prompt complet : résultat prévisible et vérifiable.';
  return (
    <Frame mod={2} kind="demo">
      <Title>Un prompt, cinq améliorations</Title>
      <Lede>Partez du prompt vague, ajoutez les ingrédients un à un et regardez la demande devenir vérifiable.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 440, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Eyebrow c={C.navy} size={20}>
          Ingrédients
        </Eyebrow>
        <M2PartBtn i={0} on={on[0]} flip={() => flip(0)} />
        <M2PartBtn i={1} on={on[1]} flip={() => flip(1)} />
        <M2PartBtn i={2} on={on[2]} flip={() => flip(2)} />
        <M2PartBtn i={3} on={on[3]} flip={() => flip(3)} />
        <M2PartBtn i={4} on={on[4]} flip={() => flip(4)} />
        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <Btn size={19} icon="sparkles" onClick={() => setOn([true, true, true, true, true])}>
            Tout
          </Btn>
          <Btn size={19} icon="reset" ghost tone="grey" onClick={() => setOn([false, false, false, false, false])}>
            Vider
          </Btn>
        </div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 620, top: 270, width: 1180, ...dl(150) }}>
        <CodeDark file="Prompt (mode Agent)" size={24} wrap style={{ minHeight: 470 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <M2Part i={0} on={on[0]} />
            <M2Part i={1} on={on[1]} />
            {on[2] ? <M2Part i={2} on /> : <div style={{ color: '#FFD27A' }}>Ajoute un filtre à l’inventaire.</div>}
            <M2Part i={3} on={on[3]} />
            <M2Part i={4} on={on[4]} />
          </div>
        </CodeDark>
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ width: 54, height: 16, borderRadius: 8, background: n >= 1 ? C.coral : C.panel }} />
            <span style={{ width: 54, height: 16, borderRadius: 8, background: n >= 2 ? C.yellow : C.panel }} />
            <span style={{ width: 54, height: 16, borderRadius: 8, background: n >= 3 ? C.yellow : C.panel }} />
            <span style={{ width: 54, height: 16, borderRadius: 8, background: n >= 4 ? C.green : C.panel }} />
            <span style={{ width: 54, height: 16, borderRadius: 8, background: n >= 5 ? C.green : C.panel }} />
          </div>
          <span style={{ fontSize: 25, fontWeight: 600, color: n === 5 ? T.green.fg : n >= 3 ? T.yellow.fg : T.coral.fg }}>{verdict}</span>
        </div>
      </div>
    </Frame>
  );
};

// ─── Techniques de prompting (cartes à retourner) ───────────────────────────
const M2Tech = ({ icon, tone, title, when, ex }: { icon: IconName; tone: Tone; title: string; when: string; ex: ReactNode }) => (
  <FlipCard
    w={538}
    h={320}
    tone={tone}
    backTone={tone}
    front={
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconTile name={icon} tone={tone} size={54} />
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.ink }}>{title}</div>
        </div>
        <div style={{ marginTop: 16, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{when}</div>
      </>
    }
    back={
      <>
        <Eyebrow c={T[tone].fg} size={18}>
          Exemple
        </Eyebrow>
        <div style={{ marginTop: 10, fontFamily: mono, fontSize: 20, lineHeight: 1.5, color: C.ink }}>{ex}</div>
      </>
    }
  />
);

const M2_Techniques: Page = () => (
  <Frame mod={2}>
    <Title>Six techniques qui changent tout</Title>
    <Lede>Cliquez une carte pour voir un exemple de formulation sur FrigoMalin.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 538px)', gap: 33, rowGap: 30 }}>
      <M2Tech icon="chat" tone="blue" title="Questions d’abord" when="Quand le besoin est flou : faites-vous interroger avant toute écriture." ex="Avant d’écrire, pose-moi au maximum 5 questions pour lever les ambiguïtés." />
      <M2Tech icon="map" tone="violet" title="Le plan avant le code" when="Toute tâche de plus d’un fichier : plan validé, puis exécution par lots." ex="Propose un plan en lots de 1 à 3 fichiers. N’écris aucun code avant mon accord." />
      <M2Tech icon="layers" tone="teal" title="Des exemples (few-shot)" when="Pour un format ou un style précis : montrez 1 ou 2 exemples." ex="Nomme les tests comme ceci : « signale un produit périmé hier »." />
      <M2Tech icon="flask" tone="pink" title="Les tests d’abord" when="Pour la logique métier : les tests fixent le comportement attendu." ex="Écris uniquement les tests de suggestRecipes. Lance-les : ils doivent échouer." />
      <M2Tech icon="reset" tone="yellow" title="Le rétro-prompt" when="Vous avez le résultat voulu : faites retrouver la consigne qui le produit." ex="Voici le résultat attendu (types.ts). Quel prompt l’aurait produit du premier coup ?" />
      <M2Tech icon="checkCircle" tone="green" title="Un critère de fin vérifiable" when="Toujours : sinon l’agent décide seul quand il a « fini »." ex="Termine par npm test et npm run lint. Tout doit passer, sinon corrige." />
    </div>
  </Frame>
);

// ─── Context engineering : 4 couches ────────────────────────────────────────
const M2Layer = ({ w, tone, title, files, desc, beat }: { w: number; tone: Tone; title: string; files: ReactNode; desc: string; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
    <div
      style={{
        width: w,
        flex: 'none',
        height: 128,
        borderRadius: 18,
        background: T[tone].bg,
        boxShadow: `inset 0 0 0 2.5px ${T[tone].bd}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 26px',
        boxSizing: 'border-box',
        marginLeft: (900 - w) / 2,
      }}
    >
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: T[tone].fg }}>{title}</div>
      <div style={{ marginTop: 6, fontFamily: mono, fontSize: 19, color: C.ink }}>{files}</div>
    </div>
    <div style={{ width: 700, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{desc}</div>
  </div>
);

const M2_Layers: Page = () => (
  <Frame mod={2} beats={3}>
    <Title>Context engineering : quatre couches</Title>
    <Lede>Le vrai levier n’est pas le prompt du jour : c’est ce que l’assistant sait déjà… ou ne voit jamais.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <M2Layer w={420} tone="navy" title="Toujours chargé" files="copilot-instructions.md · AGENTS.md" desc="Court et dense : stack, commandes, structure, principes, interdits. Payé à chaque requête." beat={0} />
      <M2Layer w={600} tone="blue" title="Selon le fichier" files="*.instructions.md (applyTo)" desc="Règles des tests, de l’UI, du domaine : chargées seulement quand ces fichiers sont en jeu." beat={1} />
      <M2Layer w={780} tone="green" title="À la demande" files="skills · # fichiers · outils MCP" desc="Savoir-faire et documentation chargés quand la tâche les réclame (la description décide)." beat={2} />
      <M2Layer w={900} tone="coral" title="Jamais" files=".copilotignore · exclusion de contenu · .gitignore" desc="Secrets, données réelles, fichiers lourds : hors contexte. On y revient au module 3." beat={3} />
    </div>
  </Frame>
);

// ─── Les fichiers de personnalisation ───────────────────────────────────────
const M2FRow = ({ file, when, role, lab, tone, d }: { file: string; when: string; role: string; lab: string; tone: Tone; d: number }) => (
  <div className={A.left} style={{ display: 'grid', gridTemplateColumns: '460px 360px 1fr 150px', alignItems: 'center', gap: 20, padding: '14px 22px', borderRadius: 14, background: C.card, boxShadow: SHADOW_SM, ...dl(d) }}>
    <span style={{ fontFamily: mono, fontSize: 21, fontWeight: 700, color: T[tone].fg }}>{file}</span>
    <span style={{ fontSize: 21, color: C.ink }}>{when}</span>
    <span style={{ fontSize: 21, color: C.soft }}>{role}</span>
    <span>
      <Tag tone="green" size={17}>
        {lab}
      </Tag>
    </span>
  </div>
);

const M2_Files: Page = () => (
  <Frame mod={2}>
    <Title>Les fichiers qui personnalisent votre assistant</Title>
    <Lede>Tous versionnés dans le dépôt. Retenez surtout la colonne « chargé quand » : elle fait la facture.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '460px 360px 1fr 150px', gap: 20, padding: '0 22px', fontSize: 18, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>
        <span>FICHIER</span>
        <span>CHARGÉ QUAND</span>
        <span>SERT À</span>
        <span>LAB</span>
      </div>
      <M2FRow file=".github/copilot-instructions.md" when="à chaque requête" role="stack, commandes, principes, interdits" lab="3.3" tone="navy" d={100} />
      <M2FRow file="*.instructions.md (applyTo)" when="si un fichier correspond" role="règles par type de fichier" lab="3.4" tone="blue" d={170} />
      <M2FRow file=".github/skills/*/SKILL.md" when="si la tâche correspond" role="savoir-faire, gabarits, scripts" lab="4.2 · 4.3" tone="green" d={240} />
      <M2FRow file=".github/agents/*.agent.md" when="agent choisi ou appelé" role="rôle, outils, modèle, interdits" lab="2.1 · 6.x" tone="violet" d={310} />
      <M2FRow file=".github/hooks/*.json" when="à chaque événement" role="contrôles déterministes (lint…)" lab="8.1" tone="coral" d={380} />
      <M2FRow file=".mcp.json" when="au démarrage des serveurs" role="brancher GitHub, Playwright…" lab="1.3 · 6.4" tone="teal" d={450} />
      <M2FRow file="AGENTS.md" when="lu par plusieurs agents" role="instructions portables multi-outils" lab="option" tone="grey" d={520} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 890, width: 1680, fontSize: 21, color: C.muted, ...dl(700) }}>
      Noms et emplacements vérifiés pour VS Code en octobre 2026 : Copilot évolue vite, contrôlez la documentation avant chaque projet.
    </div>
  </Frame>
);

// ─── MCP ────────────────────────────────────────────────────────────────────
const M2Srv = ({ x, y, icon, tone, name, desc, beat }: { x: number; y: number; icon: IconName; tone: Tone; name: string; desc: string; beat: number }) => (
  <div className={b.pop(beat)} style={{ position: 'absolute', left: x, top: y, width: 330, display: 'flex', alignItems: 'center', gap: 14, background: C.card, borderRadius: 16, boxShadow: SHADOW, padding: '14px 18px' }}>
    <IconTile name={icon} tone={tone} size={52} />
    <div>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{name}</div>
      <div style={{ fontSize: 18, color: C.muted, lineHeight: 1.3 }}>{desc}</div>
    </div>
  </div>
);

const M2_MCP: Page = () => (
  <Frame mod={2} beats={2}>
    <Title>MCP : le port USB-C des agents</Title>
    <Lede>Model Context Protocol : un standard ouvert pour brancher un agent sur des outils et des données.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
      <path d="M 560 560 L 760 380" stroke={C.faint} strokeWidth={4} strokeDasharray="10 14" className={cx(A.march, b.fade(1))} />
      <path d="M 560 580 L 760 560" stroke={C.faint} strokeWidth={4} strokeDasharray="10 14" className={cx(A.march, b.fade(1))} />
      <path d="M 560 600 L 760 740" stroke={C.faint} strokeWidth={4} strokeDasharray="10 14" className={cx(A.march, b.fade(1))} />
    </svg>
    <div className={A.pop} style={{ position: 'absolute', left: 140, top: 450, width: 420, background: G.navy, borderRadius: 22, padding: '24px 28px', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <IconTile name="bot" tone="violet" size={58} solid />
        <div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28 }}>Agent (Copilot)</div>
          <div style={{ fontSize: 19, color: '#C9D2F2' }}>client MCP</div>
        </div>
      </div>
      <div style={{ marginTop: 14, fontSize: 21, lineHeight: 1.4, color: '#DCE3FA' }}>Découvre les outils de chaque serveur et décide quand les appeler.</div>
    </div>
    <M2Srv x={770} y={320} icon="git" tone="navy" name="GitHub" desc="issues, PR, revues (lab 1.3)" beat={1} />
    <M2Srv x={770} y={505} icon="globe" tone="green" name="Playwright" desc="piloter un vrai navigateur (lab 6.4)" beat={1} />
    <M2Srv x={770} y={690} icon="palette" tone="pink" name="Google Stitch" desc="maquettes d’écrans (lab 4.1)" beat={1} />
    <div className={b.on(2)} style={{ position: 'absolute', left: 1180, top: 300, width: 620, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="blue" icon="flag" title="Un standard neutre" size={22}>
        Créé par Anthropic (nov. 2024), confié en déc. 2025 à l’Agentic AI Foundation (Linux Foundation), avec AGENTS.md et goose. Supporté par
        VS Code, ChatGPT, Cursor, Gemini…
      </Card>
      <Card tone="coral" icon="alert" title="Trois vigilances" size={22}>
        Un serveur MCP est du code tiers avec des droits. Chaque outil ajoute sa définition au contexte. Les données qu’il renvoie peuvent contenir
        des instructions malveillantes.
      </Card>
    </div>
  </Frame>
);

// ─── Que confier à l'IA ? (glisser-déposer) ─────────────────────────────────
const M2Zone = ({ x, title, sub, tone }: { x: number; title: string; sub: string; tone: Tone }) => (
  <div style={{ position: 'absolute', left: x, top: 500, width: 540, height: 460, boxSizing: 'border-box', borderRadius: 20, background: T[tone].bg, boxShadow: `inset 0 0 0 2.5px ${T[tone].bd}`, padding: '18px 22px' }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: T[tone].fg }}>{title}</div>
    <div style={{ fontSize: 20, color: C.soft, marginTop: 2 }}>{sub}</div>
  </div>
);

const M2_Automate: Page = () => (
  <Frame mod={2} kind="exercice">
    <Title>Que confier à l’IA ? Triez les tâches</Title>
    <Lede>Glissez chaque tâche dans une colonne. Double-clic : la pastille revient à sa place. On débat ensuite.</Lede>
    <M2Zone x={120} title="L’IA fait, je relis" sub="répétitif, vérifiable, faible risque" tone="green" />
    <M2Zone x={690} title="L’IA propose, je décide" sub="options utiles, décision humaine" tone="yellow" />
    <M2Zone x={1260} title="Je garde la main" sub="ou un outil déterministe" tone="coral" />
    <Drag x={120} y={262} w={405} tone="blue" size={21}>Snippets et boilerplate</Drag>
    <Drag x={545} y={262} w={405} tone="blue" size={21}>Tests d’une fonction pure</Drag>
    <Drag x={970} y={262} w={405} tone="blue" size={21}>Commentaires JSDoc</Drag>
    <Drag x={1395} y={262} w={405} tone="blue" size={21}>Renommer un symbole partout</Drag>
    <Drag x={120} y={330} w={405} tone="blue" size={21}>Migration vers une version majeure</Drag>
    <Drag x={545} y={330} w={405} tone="blue" size={21}>Choix d’architecture</Drag>
    <Drag x={970} y={330} w={405} tone="blue" size={21}>Revue de sécurité finale</Drag>
    <Drag x={1395} y={330} w={405} tone="blue" size={21}>Rotation d’une clé d’API</Drag>
    <Drag x={120} y={398} w={405} tone="blue" size={21}>Message de commit</Drag>
    <Drag x={545} y={398} w={405} tone="blue" size={21}>Jeu de données de test</Drag>
    <Drag x={970} y={398} w={405} tone="blue" size={21}>Décision de mise en production</Drag>
    <Drag x={1395} y={398} w={405} tone="blue" size={21}>Expliquer un log d’erreur</Drag>
  </Frame>
);

// ─── Collaboration humain–IA ────────────────────────────────────────────────
const M2Gate = ({ n, title, sub, beat }: { n: number; title: string; sub: string; beat: number }) => (
  <div className={b.on(beat)} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <div style={{ width: 62, height: 62, flex: 'none', borderRadius: 16, background: C.green, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="humanCheck" size={34} color="#fff" />
    </div>
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>
        {n} · {title}
      </div>
      <div style={{ fontSize: 21, color: C.soft }}>{sub}</div>
    </div>
  </div>
);

const M2_Collab: Page = () => (
  <Frame mod={2} beats={4}>
    <Title>Collaboration humain–IA : qui fait quoi ?</Title>
    <Lede>Un partenariat efficace où chacun apporte ce qu’il fait de mieux… et où la décision reste humaine.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 265, width: 560, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card tone="navy" icon="user" title="Le développeur" cls={A.in} size={22}>
        <strong>Architecte</strong> des choix · <strong>validateur</strong> du code · <strong>décideur</strong> final, responsable · <strong>expert métier</strong> qui
        connaît le contexte.
      </Card>
      <Card tone="violet" icon="bot" title="L’IA" cls={A.in} style={dl(150)} size={22}>
        <strong>Assistant</strong> sur le standard · <strong>accélérateur</strong> du répétitif · <strong>générateur</strong> d’options · <strong>amplificateur</strong> de vos
        compétences.
      </Card>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 740, top: 265, width: 1060, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 32px', ...dl(250) }}>
      <Eyebrow c={T.green.fg}>Quatre points de contrôle humains, à chaque tâche</Eyebrow>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <M2Gate n={1} title="Plan validé" sub="Avant toute modification : périmètre, fichiers, ordre, critère de fin." beat={1} />
        <M2Gate n={2} title="Diff relu" sub="Chaque lot lu comme une PR externe : compréhensible, nécessaire, sûr." beat={2} />
        <M2Gate n={3} title="Tests au vert" sub="Les tests et le lint passent, et testent vraiment ce qui compte." beat={3} />
        <M2Gate n={4} title="Merge par un humain" sub="Celui qui merge assume : jamais de mise en production sans revue." beat={4} />
      </div>
    </div>
  </Frame>
);

// ─── Indicateurs d'efficacité ───────────────────────────────────────────────
const M2Kpi = ({ label, verdict, why }: { label: string; verdict: 'ok' | 'mid' | 'bad'; why: string }) => {
  const [open, setOpen] = useState(false);
  const v = { ok: { t: 'Utile', tone: 'green' as Tone, icon: 'check' as IconName }, mid: { t: 'À interpréter', tone: 'yellow' as Tone, icon: 'alert' as IconName }, bad: { t: 'Trompeur', tone: 'coral' as Tone, icon: 'x' as IconName } }[verdict];
  return (
    <button
      type="button"
      data-osd-interactive
      onClick={(e) => {
        e.currentTarget.blur();
        setOpen((o) => !o);
      }}
      style={{
        boxSizing: 'border-box',
        height: 124,
        textAlign: 'left',
        border: 'none',
        cursor: 'pointer',
        borderRadius: 16,
        padding: '14px 20px',
        fontFamily: body,
        background: open ? T[v.tone].bg : C.card,
        boxShadow: open ? `inset 0 0 0 3px ${STRONG[v.tone]}` : SHADOW_SM,
        transition: `all 250ms ${EASE}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{label}</span>
        {open ? (
          <Tag tone={v.tone} size={17}>
            <Icon name={v.icon} size={17} sw={3} /> {v.t}
          </Tag>
        ) : (
          <Icon name="eye" size={24} color={C.faint} />
        )}
      </div>
      <div style={{ marginTop: 8, fontSize: 19, lineHeight: 1.35, color: open ? C.ink : C.faint }}>{open ? why : 'Utile, à interpréter ou trompeur ? Votez, puis cliquez.'}</div>
    </button>
  );
};

const M2_KPI: Page = () => (
  <Frame mod={2} kind="exercice">
    <Title>Indicateurs d’efficacité : lesquels garder ?</Title>
    <Lede>Le programme demande de mesurer. Encore faut-il mesurer ce qui compte. Votez pour chaque indicateur, puis révélez.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
      <M2Kpi label="Délai issue → mise en production" verdict="ok" why="Mesure le flux de bout en bout (métrique DORA)." />
      <M2Kpi label="Lignes de code générées" verdict="bad" why="Plus de code, c’est plus de dette : mesure de vanité." />
      <M2Kpi label="Taux de suggestions acceptées" verdict="mid" why="Indique l’adoption, pas la valeur ni la qualité." />
      <M2Kpi label="Défauts échappés en production" verdict="ok" why="La qualité réelle, celle que voient les utilisateurs." />
      <M2Kpi label="Temps de revue par PR" verdict="ok" why="Si l’IA gonfle les PR, la revue devient le goulot." />
      <M2Kpi label="Nombre de prompts envoyés" verdict="bad" why="Mesure l’activité, pas le résultat." />
      <M2Kpi label="Couverture de tests" verdict="mid" why="Utile si les assertions sont pertinentes, sinon illusoire." />
      <M2Kpi label="Crédits IA par feature livrée" verdict="ok" why="Le coût rapporté à la valeur : clé depuis juin 2026." />
      <M2Kpi label="Taux de retouche (rework, revert)" verdict="ok" why="Révèle le code accepté trop vite." />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 900, width: 1680, fontSize: 21, color: C.muted, ...dl(600) }}>
      Pour aller plus loin : les métriques DORA (délai, fréquence, échecs, restauration) et le cadre SPACE (satisfaction, performance, activité, collaboration, flux).
    </div>
  </Frame>
);

// ─── Sprint 2 · Architecture 100 % navigateur ───────────────────────────────
const M2Box = ({ x, y, w, h, tone, title, sub, cls }: { x: number; y: number; w: number; h: number; tone: Tone; title: string; sub: string; cls?: string }) => (
  <div className={cls} style={{ position: 'absolute', left: x, top: y, width: w, height: h, boxSizing: 'border-box', borderRadius: 16, background: T[tone].bg, boxShadow: `inset 0 0 0 2.5px ${T[tone].bd}`, padding: '12px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div style={{ fontSize: 22, fontWeight: 700, color: T[tone].fg }}>{title}</div>
    <div style={{ fontSize: 18, color: C.soft, lineHeight: 1.3 }}>{sub}</div>
  </div>
);

const M2_SprintArchi: Page = () => (
  <Frame mod={2} label="Fil rouge · Sprint 2 — Architecture 100 % navigateur">
    <Title>Sprint 2 : une architecture 100 % navigateur</Title>
    <Lede>GitHub Pages ne sert que des fichiers statiques : toute l’application tourne sur le téléphone de l’utilisateur.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 265, width: 1000, height: 640, background: C.card, borderRadius: 20, boxShadow: SHADOW }}>
      <div style={{ position: 'absolute', left: 24, top: 18, fontSize: 18, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>SCHÉMA C4 · NIVEAU 2 (SIMPLIFIÉ)</div>
      <div style={{ position: 'absolute', left: 30, top: 60, width: 640, height: 555, borderRadius: 18, boxShadow: `inset 0 0 0 2.5px ${C.navy}`, background: 'rgba(11,31,92,0.03)' }}>
        <div style={{ position: 'absolute', left: 18, top: 12, fontSize: 19, fontWeight: 700, color: C.navy }}>Navigateur · PWA FrigoMalin</div>
      </div>
      <M2Box x={60} y={110} w={580} h={92} tone="blue" title="Interface (SPA)" sub="React + TypeScript · src/ui" cls={A.fade} />
      <M2Box x={60} y={222} w={580} h={92} tone="violet" title="Domaine" sub="TypeScript pur, testable · src/domain" cls={A.fade} />
      <M2Box x={60} y={334} w={280} h={110} tone="green" title="IndexedDB" sub="Dexie · données du foyer" cls={A.fade} />
      <M2Box x={360} y={334} w={280} h={110} tone="teal" title="Service worker" sub="cache · hors ligne" cls={A.fade} />
      <M2Box x={60} y={464} w={580} h={120} tone="grey" title="Publié sur GitHub Pages" sub="fichiers statiques · chemin /frigomalin/ · aucun secret" cls={A.fade} />
      <M2Box x={720} y={222} w={250} h={130} tone="yellow" title="Open Food Facts" sub="API publique, sans clé · repli manuel" cls={A.right} />
      <svg width={1000} height={640} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
        <path d="M 640 287 L 712 287" stroke={C.amber} strokeWidth={4} strokeDasharray="10 14" className={A.march} />
      </svg>
    </div>
    <div style={{ position: 'absolute', left: 1170, top: 265, width: 630, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="violet" icon="bot" title="Premier agent personnalisé" cls={A.in} style={dl(200)} size={22}>
        Un <strong>architecte en lecture seule</strong> : il propose schémas et ADR, mais ne peut pas toucher au code.
      </Card>
      <Card tone="blue" icon="doc" title="Décisions tracées (ADR)" cls={A.in} style={dl(320)} size={22}>
        Stockage, framework, routage : chaque choix documenté, avec ses conséquences négatives.
      </Card>
      <Card tone="green" icon="layers" title="Les types comme contexte" cls={A.in} style={dl(440)} size={22}>
        Des types stricts guident ensuite tous les agents : c’est le contexte le moins cher et le plus précis.
      </Card>
    </div>
  </Frame>
);

// ─── Labs 2.1, 2.2, 2.3 ─────────────────────────────────────────────────────
const M2_Lab21: Page = () => (
  <LabPage
    mod={2}
    n="2.1"
    title="Un agent architecte en lecture seule"
    defi="squelette"
    who="Architectes · Tech Leads"
    label="Fil rouge · Sprint 2 — Architecture 100 % navigateur"
    where={
      <>
        <PathChip>.github/agents/architect.agent.md</PathChip>
      </>
    }
    objective="Créer l’agent architect, puis lui faire produire le schéma C4 (niveaux 1 et 2) de FrigoMalin en Mermaid."
    feats={
      <>
        <Tag tone="blue" size={18}>Agent personnalisé</Tag>
        <Tag tone="blue" size={18}>*.agent.md</Tag>
        <Tag tone="blue" size={18}>Mermaid</Tag>
      </>
    }
    minutes={20}
    crit={
      <>
        <CheckItem id="l21a" size={22}>L’agent apparaît dans la liste des agents</CheckItem>
        <CheckItem id="l21b" size={22}>Il refuse de modifier un fichier</CheckItem>
        <CheckItem id="l21c" size={22}>Le Mermaid s’affiche dans l’aperçu</CheckItem>
      </>
    }
  >
    Complétez l’en-tête et le corps, sélectionnez l’agent, puis demandez-lui le schéma en une phrase.
    <CodeDark size={21} wrap style={{ marginTop: 12 }}>
      <Cc>---</Cc>
      {'\n'}
      <Ck>name</Ck>: architect{'\n'}
      <Ck>description</Ck>: <Hole>quand utiliser cet agent ?</Hole>
      {'\n'}
      <Ck>tools</Ck>: <Hole>lecture et recherche uniquement</Hole>
      {'\n'}
      <Cc>---</Cc>
      {'\n'}Tu es <Hole>rôle</Hole>.{'\n'}Contraintes d’architecture : <Hole>au moins 4</Hole>
      {'\n'}Tu ne modifies jamais <Hole>…</Hole>
      {'\n'}Tes livrables : <Hole>format(s)</Hole>
    </CodeDark>
  </LabPage>
);

const M2_Lab22: Page = () => (
  <LabPage
    mod={2}
    n="2.2"
    title="Trois décisions d’architecture (ADR)"
    defi="construire"
    who="Architectes · Tech Leads"
    label="Fil rouge · Sprint 2 — Architecture 100 % navigateur"
    where={
      <>
        <PathChip>docs/adr/0001-stockage.md</PathChip> <PathChip>0002-framework.md</PathChip> <PathChip>0003-routage.md</PathChip>
      </>
    }
    objective="Documenter 3 ADR : IndexedDB ou localStorage, choix du framework, routage par hash ou repli 404.html."
    feats={
      <>
        <Tag tone="blue" size={18}>Agent architect</Tag>
        <Tag tone="blue" size={18}>Contexte explicite (#)</Tag>
      </>
    }
    minutes={15}
    crit={
      <>
        <CheckItem id="l22a" size={22}>3 fichiers docs/adr/000X-*.md</CheckItem>
        <CheckItem id="l22b" size={22}>Au moins 2 options comparées par ADR</CheckItem>
        <CheckItem id="l22c" size={22}>Conséquences négatives explicites</CheckItem>
      </>
    }
  >
    Construisez le prompt à partir des ingrédients. Un prompt pour les 3 ADR, ou un prompt réutilisable pour un ADR à la fois : à vous de choisir et de
    justifier.
    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 22, color: C.ink }}>
      <Bullet tone="green" size={22}>l’agent architect (lab 2.1)</Bullet>
      <Bullet tone="green" size={22}>#PRODUCT.md et #docs/mvp.md</Bullet>
      <Bullet tone="green" size={22}>le format MADR : contexte · options · décision · conséquences</Bullet>
      <Bullet tone="green" size={22}>un critère de comparaison chiffré par option</Bullet>
      <Bullet tone="green" size={22}>le dossier docs/adr/ (numérotation 0001-…)</Bullet>
    </div>
  </LabPage>
);

const M2_Lab23: Page = () => (
  <LabPage
    mod={2}
    n="2.3"
    title="Modèle de données & types TypeScript"
    defi="inverse"
    who="Développeurs"
    label="Fil rouge · Sprint 2 — Architecture 100 % navigateur"
    where={
      <>
        <PathChip>src/domain/types.ts</PathChip> <PathChip>src/data/db.ts</PathChip> <PathChip>src/data/seed.ts</PathChip>
      </>
    }
    objective="Produire les types du domaine, le schéma de base Dexie et un générateur de 40 produits de test réalistes."
    feats={
      <>
        <Tag tone="blue" size={18}>Mode Agent</Tag>
        <Tag tone="blue" size={18}>Types comme contexte</Tag>
      </>
    }
    minutes={15}
    crit={
      <>
        <CheckItem id="l23a" size={22}>npm run build compile sans erreur</CheckItem>
        <CheckItem id="l23b" size={22}>Produits périmés, du jour et à venir</CheckItem>
        <CheckItem id="l23c" size={22}>Aucun type any</CheckItem>
      </>
    }
  >
    Voici un extrait du résultat attendu. Écrivez le prompt qui le produit (types + base + 40 produits de test).
    <CodeDark file="src/domain/types.ts (extrait attendu)" size={19} style={{ marginTop: 12 }}>
      <Ck>export type</Ck> DateKind = <Cs>'DLC'</Cs> | <Cs>'DDM'</Cs>;{'\n'}
      <Ck>export interface</Ck> <Cf>StockItem</Cf> {'{'}
      {'\n  '}id: <Ck>string</Ck>; name: <Ck>string</Ck>; barcode?: <Ck>string</Ck>;{'\n  '}quantity: <Ck>number</Ck>; unit: <Cs>'pièce'</Cs> | <Cs>'g'</Cs> |{' '}
      <Cs>'kg'</Cs> | <Cs>'ml'</Cs> | <Cs>'L'</Cs>;{'\n  '}expiresOn: <Ck>string</Ck>; <Cc>{'// ISO 8601'}</Cc>
      {'\n  '}dateKind: DateKind; location: <Cs>'frigo'</Cs> | <Cs>'congélateur'</Cs> | <Cs>'placard'</Cs>;{'\n  '}status: <Cs>'en-stock'</Cs> |{' '}
      <Cs>'consommé'</Cs> | <Cs>'jeté'</Cs>;{'\n}'}
      {'\n'}
      <Cc>{'// + src/data/db.ts (Dexie, index expiresOn, status)'}</Cc>
      {'\n'}
      <Cc>{'// + src/data/seed.ts (40 produits de test)'}</Cc>
    </CodeDark>
  </LabPage>
);

// ─── Sprint 3 · Workspace & context engineering ─────────────────────────────
const M2Q = ({ icon, tone, q, a, ex, d }: { icon: IconName; tone: Tone; q: string; a: string; ex: ReactNode; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', borderTop: `8px solid ${STRONG[tone]}`, display: 'flex', flexDirection: 'column', gap: 14, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={64} />
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.ink, lineHeight: 1.2 }}>{q}</div>
    <div style={{ fontSize: 24, fontWeight: 700, color: STRONG[tone] }}>{a}</div>
    <div style={{ fontSize: 22, lineHeight: 1.45, color: C.soft }}>{ex}</div>
  </div>
);

const M2_SprintCtx: Page = () => (
  <Frame mod={2} label="Fil rouge · Sprint 3 — Workspace & context engineering">
    <Title>Sprint 3 : préparer ce que Copilot verra</Title>
    <Lede>Avant la première ligne de code métier : trois questions, trois réponses, trois fichiers.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 26 }}>
      <M2Q icon="book" tone="blue" q="Que doit-il savoir ?" a="Les instructions" d={100} ex={<>Stack, commandes, structure, principes, interdits : <PathChip size={20}>copilot-instructions.md</PathChip> (lab 3.3), puis règles ciblées (lab 3.4).</>} />
      <M2Q icon="filter" tone="yellow" q="Que n’a-t-il pas besoin de voir ?" a="Les exclusions" d={220} ex={<><PathChip size={20}>dist/</PathChip> <PathChip size={20}>node_modules/</PathChip> <PathChip size={20}>coverage/</PathChip> : hors index et hors recherche (lab 3.1).</>} />
      <M2Q icon="lock" tone="coral" q="Que ne doit-il jamais voir ?" a="Les données sensibles" d={340} ex={<>Secrets, exports réels, fichiers lourds : <PathChip size={20}>.copilotignore</PathChip> et défense en profondeur (lab 3.2, module 3).</>} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(500) }}>
      <Callout title="Le socle de l’optimisation" tone="violet" icon="gauge">
        Chaque ligne d’instruction est payée à chaque requête, chaque fichier inutile dilue l’attention. Un bon contexte, c’est des réponses meilleures{' '}
        <strong>et</strong> une facture plus basse.
      </Callout>
    </div>
  </Frame>
);

// ─── Labs 3.1, 3.3, 3.4 ─────────────────────────────────────────────────────
const M2_Lab31: Page = () => (
  <LabPage
    mod={2}
    n="3.1"
    title="Créer le projet, exclure ce qui pollue"
    defi="trous"
    who="Développeurs"
    label="Fil rouge · Sprint 3 — Workspace & context engineering"
    where={
      <>
        <PathChip>.gitignore</PathChip> <PathChip>vite.config.ts</PathChip> <PathChip>.vscode/settings.json</PathChip>
      </>
    }
    objective="Créer le projet Vite + TypeScript en mode Agent, puis exclure les dossiers générés de l’index et des recherches de Copilot."
    feats={
      <>
        <Tag tone="blue" size={18}>Mode Agent</Tag>
        <Tag tone="blue" size={18}>files.exclude · search.exclude</Tag>
      </>
    }
    minutes={15}
    crit={
      <>
        <CheckItem id="l31a" size={22}>npm run dev affiche la page</CheckItem>
        <CheckItem id="l31b" size={22}>Scripts lint, test et build présents</CheckItem>
        <CheckItem id="l31c" size={22}>Aucune recherche ne renvoie dist/</CheckItem>
      </>
    }
  >
    Complétez le prompt. Vérifiez ensuite que l’agent n’est pas resté bloqué sur une commande interactive.
    <CodeDark size={21} wrap style={{ marginTop: 12 }}>
      Crée le projet FrigoMalin dans le dossier courant avec <Hole>outil</Hole> et le modèle <Hole>framework + TS</Hole>.{'\n'}Ajoute <Hole>outils qualité</Hole> et les
      scripts npm : <Hole>liste</Hole>.{'\n'}Configure Vite pour GitHub Pages : <Hole>réglage</Hole>.{'\n'}Mets à jour .gitignore et .vscode/settings.json pour exclure{' '}
      <Hole>dossiers</Hole> de <Hole>…</Hole>.{'\n'}Utilise uniquement des commandes <Hole>…</Hole>.
    </CodeDark>
  </LabPage>
);

const M2_Lab33: Page = () => (
  <LabPage
    mod={2}
    n="3.3"
    title="copilot-instructions.md : l’essentiel"
    defi="ameliorer"
    who="Tech Leads · Développeurs"
    label="Fil rouge · Sprint 3 — Workspace & context engineering"
    where={
      <>
        <PathChip>.github/copilot-instructions.md</PathChip> (dans .github/, pas à la racine).
      </>
    }
    objective="Écrire un copilot-instructions.md de moins de 60 lignes, chargé à chaque requête : chaque ligne doit changer le comportement du modèle."
    feats={
      <>
        <Tag tone="blue" size={18}>Instructions globales</Tag>
        <Tag tone="blue" size={18}>AGENTS.md (variante)</Tag>
      </>
    }
    minutes={20}
    crit={
      <>
        <CheckItem id="l33a" size={22}>Moins de 60 lignes</CheckItem>
        <CheckItem id="l33b" size={22}>Commandes et structure présentes</CheckItem>
        <CheckItem id="l33c" size={22}>Au moins 3 interdits propres au projet</CheckItem>
        <CheckItem id="l33d" size={22}>Principes non négociables vérifiables</CheckItem>
      </>
    }
  >
    Ce premier jet, typique d’un fichier généré automatiquement, est trop long et flou. Réécrivez-le, ou écrivez le prompt qui le fait réécrire.
    <CodeDark file="copilot-instructions.md (premier jet)" size={20} wrap style={{ marginTop: 12 }}>
      # Instructions{'\n'}Tu es un assistant très compétent et bienveillant. Écris toujours du code propre, lisible, maintenable, performant et sécurisé. Respecte les
      bonnes pratiques. Utilise TypeScript. Commente bien le code. Fais attention aux erreurs. Pense à l’accessibilité.{'\n'}Le projet est une application qui
      s’appelle FrigoMalin et qui aide les gens à ne pas gaspiller…{'\n'}
      <Cc>[… 150 lignes de ce style …]</Cc>
    </CodeDark>
  </LabPage>
);

const M2_Lab34: Page = () => (
  <LabPage
    mod={2}
    n="3.4"
    title="Instructions ciblées (applyTo)"
    defi="squelette"
    who="Développeurs"
    label="Fil rouge · Sprint 3 — Workspace & context engineering"
    where={
      <>
        <PathChip>.github/instructions/</PathChip> tests · ui · domain<PathChip>.instructions.md</PathChip>
      </>
    }
    objective="Découper les règles par type de fichier (tests, UI, domaine) pour qu’elles ne soient chargées qu’au besoin."
    feats={
      <>
        <Tag tone="blue" size={18}>*.instructions.md</Tag>
        <Tag tone="blue" size={18}>applyTo</Tag>
      </>
    }
    minutes={15}
    crit={
      <>
        <CheckItem id="l34a" size={22}>3 fichiers avec un applyTo précis</CheckItem>
        <CheckItem id="l34b" size={22}>Aucune règle dupliquée avec le fichier global</CheckItem>
      </>
    }
  >
    Complétez les trois fichiers : en-tête + 3 à 5 règles chacun.
    <CodeDark file=".github/instructions/tests.instructions.md" size={21} wrap style={{ marginTop: 12 }}>
      <Cc>---</Cc>
      {'\n'}
      <Ck>applyTo</Ck>: <Cs>"</Cs>
      <Hole>motif des fichiers de test</Hole>
      <Cs>"</Cs>
      {'\n'}
      <Ck>description</Ck>: <Hole>…</Hole>
      {'\n'}
      <Cc>---</Cc>
      {'\n'}
      <Hole>3 à 5 règles</Hole>
      {'\n\n'}
      <Cc>{'// puis ui.instructions.md (applyTo ?) et domain.instructions.md : à vous'}</Cc>
    </CodeDark>
  </LabPage>
);

// ─── QCM M2 ─────────────────────────────────────────────────────────────────
const M2_Qcm: Page = () => (
  <QcmPage
    mod={2}
    n={2}
    title="Où écrire la règle ?"
    q="Vous voulez que vos règles d’écriture des tests ne soient chargées que lorsque l’agent touche un fichier *.test.ts. Où les écrivez-vous ?"
    explain="Chaque couche de contexte a son déclencheur : toujours (instructions globales), par fichier (applyTo), par tâche (skills). Placer une règle au bon niveau, c’est payer moins et mieux guider."
  >
    <Opt why="Piège ! Ce fichier est chargé à CHAQUE requête : vous payez les règles de test même pour du CSS.">Dans .github/copilot-instructions.md</Opt>
    <Opt why="Non : un skill se déclenche selon la tâche (sa description), pas selon le fichier ouvert. Utile pour un savoir-faire, pas pour une règle.">Dans un skill « tests »</Opt>
    <Opt ok why="Oui : applyTo: &quot;**/*.test.ts&quot; charge ces règles seulement quand un fichier de test est en jeu.">
      Dans .github/instructions/tests.instructions.md avec un applyTo
    </Opt>
    <Opt why="Non : vous les oublierez une fois sur deux, et elles ne sont ni versionnées ni partagées.">Dans chaque prompt, au cas par cas</Opt>
  </QcmPage>
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
  M2_Divider,
  M2_Cycle,
  M2_Modes,
  M2_Ingredients,
  M2_PromptLab,
  M2_Techniques,
  M2_Layers,
  M2_Files,
  M2_MCP,
  M2_Automate,
  M2_Collab,
  M2_KPI,
  M2_Qcm,
  M2_SprintArchi,
  M2_Lab21,
  M2_Lab22,
  M2_Lab23,
  M2_SprintCtx,
  M2_Lab31,
  M2_Lab33,
  M2_Lab34,
] satisfies Page[];

// Speaker notes — one entry per page, same order as the default export.
export const notes: (string | undefined)[] = [
  `⏱ 1 min · DIVISEUR M2 · 11:30

OBJECTIF — Annoncer le module 2 du programme : l’IA à chaque étape du cycle, l’automatisation (snippets, tests, commentaires), les stratégies de prompting, la collaboration humain–IA et les indicateurs.

DIRE — « Module 2 : intégrer l’IA dans le workflow. C’est le cœur de la journée. On va voir comment l’IA s’insère à chaque étape du cycle, comment choisir le bon mode d’assistance, comment écrire des prompts qui donnent des résultats prévisibles, et surtout comment préparer le contexte — ce que l’assistant sait déjà avant même que vous tapiez. On terminera par la collaboration humain–IA et les indicateurs pour mesurer l’efficacité. Ensuite, deux sprints FrigoMalin : l’architecture, puis le contexte Copilot. C’est l’atelier du programme : un workflow multi-outils, de la génération à l’analyse. »

ANIMATION — Pointer les six labs.

TRANSITION — « Premier point : où l’IA intervient-elle dans le cycle ? »`,
  `⏱ 3 min · CYCLE AUGMENTÉ

OBJECTIF — Montrer l’IA à chaque étape, avec le rôle humain correspondant.

DIRE — « Six étapes. En conception, l’IA challenge l’idée et propose des options ; vous tranchez et documentez. En codage, elle complète et implémente par lots ; vous validez le plan et relisez les diffs. En tests, elle écrit les tests d’abord, les cas limites, les E2E ; vous vérifiez qu’ils testent la bonne chose. En documentation, elle produit README, JSDoc, notes de version ; vous corrigez ce qui est faux. En revue, elle fait une première passe ; la décision et la responsabilité restent humaines. En livraison, elle écrit la CI et explique un échec ; vous gardez les portes de qualité. Chaque carte renvoie aux labs FrigoMalin correspondants : vous allez tout pratiquer. Et c’est une boucle courte : petites itérations, chaque sortie vérifiée. »

ANIMATION — Les cartes apparaissent en séquence ; la flèche pointillée symbolise la boucle.

TRANSITION — « Pour chaque étape, il faut le bon niveau d’assistance. Dans Copilot, ce sont les modes. »`,
  `⏱ 3 min · MODES (2 temps)

OBJECTIF — Distinguer Ask, Plan et Agent, et donner les raccourcis utiles.

DIRE — « Copilot propose trois agents intégrés. Ask répond, explique, compare : il ne modifie rien. C’est votre sparring partner du lab 1.1. » → clic. « Plan analyse le dépôt et produit un plan, sans écrire de code. Règle d’équipe : toute tâche de plus d’un fichier commence par un plan que vous validez. » → clic. « Agent exécute : il lit, modifie plusieurs fichiers, lance des commandes et les tests, et itère jusqu’au critère de fin. C’est puissant, donc on relit les diffs et on limite les droits. En bas, les raccourcis : Tab pour la complétion, Ctrl+I pour le chat inline, Ctrl+Alt+I pour la vue Chat, le dièse pour joindre un fichier, et /compact, /fork pour gérer la session — on les reverra au module 6. »

ANIMATION — Démonstration rapide possible : basculer entre les trois agents dans la liste déroulante de la vue Chat.

TRANSITION — « Quel que soit le mode, la qualité dépend du prompt. Cinq ingrédients. »`,
  `⏱ 3 min · INGRÉDIENTS (4 temps)

OBJECTIF — Installer la grille des cinq ingrédients utilisée dans tous les labs.

DIRE — « Un : un rôle. “Agis comme…”, ou mieux, le bon agent sélectionné, qui porte déjà son rôle. » → clic. « Deux : un contexte ciblé. Deux ou trois fichiers nommés avec le dièse. Pas tout le projet : on a vu que le contexte se paie et se dilue. » → clic. « Trois : une seule tâche, bornée. “Uniquement…”, “n’écris pas…” : c’est ce qui empêche l’agent de déborder. » → clic. « Quatre : contraintes et format. Où écrire, quel format, quelle longueur. » → clic. « Cinq, le plus oublié : le critère de fin. La commande qui prouve que c’est terminé. Sans lui, c’est l’agent qui décide quand il a fini. Ces cinq ingrédients sont votre checklist de relecture de prompt pour les deux jours. »

ANIMATION — Révéler un ingrédient par clic ; demander après chacun « qu’est-ce qui se passe s’il manque ? ».

TRANSITION — « Voyons l’effet concret, ingrédient par ingrédient. »`,
  `⏱ 3 min · DÉMO INTERACTIVE

OBJECTIF — Montrer la transformation d’un prompt vague en prompt vérifiable.

DIRE — « Prompt de départ : “Ajoute un filtre à l’inventaire.” Quel filtre ? Où ? Testé comment ? Le modèle devine tout. » Activer le rôle. « On sait qui parle. » Activer le contexte. « On sait où regarder. » Activer la tâche bornée : le prompt vague est remplacé. « On sait exactement quoi faire, et quoi ne pas faire. » Activer les contraintes. « On sait où va la logique et comment elle est testée. » Activer le critère de fin. « Et on sait quand c’est fini : npm test au vert. Ce prompt fait cinq lignes. Il vous fait gagner trois allers-retours. C’est d’ailleurs, mot pour mot, le prompt du lab 7.1 qu’on utilisera pour regarder ce qui part réellement au modèle. »

ANIMATION — Activer les interrupteurs un à un ; la jauge et le verdict évoluent. Demander à un participant de proposer l’ordre.

TRANSITION — « Au-delà des ingrédients, quelques techniques font une grande différence. »`,
  `⏱ 4 min · TECHNIQUES (cartes)

OBJECTIF — Donner six techniques de prompting concrètes, avec un exemple chacune.

DIRE — « Six techniques. Les questions d’abord, quand le besoin est flou. Le plan avant le code, pour toute tâche multi-fichiers. Les exemples, ou few-shot, pour imposer un format ou un style. Les tests d’abord, pour fixer le comportement métier avant l’implémentation. Le rétro-prompt : vous avez le résultat voulu, faites retrouver la consigne — c’est le lab 2.3. Et toujours un critère de fin vérifiable. » Retourner deux ou trois cartes à la demande du groupe.

ANIMATION — Demander : « Laquelle utilisez-vous déjà ? Laquelle allez-vous essayer en premier ? » Les anti-patterns à citer à l’oral : « fais-le bien », « corrige tout », « voici tout le projet ».

TRANSITION — « Le prompt, c’est la demande du moment. Le vrai levier, c’est ce que l’assistant sait déjà : le contexte. »`,
  `⏱ 3 min · COUCHES DE CONTEXTE (3 temps)

OBJECTIF — Structurer le context engineering en quatre couches selon leur déclencheur.

DIRE — « Quatre couches. Toujours chargé : copilot-instructions.md, ou AGENTS.md, le format portable. Il part à chaque requête, donc il doit être court et dense. » → clic. « Selon le fichier : les fichiers d’instructions avec applyTo. Les règles de test ne partent que si on touche un test. » → clic. « À la demande : les skills, les fichiers joints, les outils MCP. Ils sont chargés quand la tâche les réclame ; pour un skill, c’est sa description qui décide. » → clic. « Et jamais : ce qui ne doit pas entrer dans le contexte. Secrets, données réelles, fichiers lourds. C’est le sujet du module 3. Retenez la forme : plus c’est souvent chargé, plus ce doit être petit. »

ANIMATION — La pyramide inversée se construit couche par couche.

TRANSITION — « Concrètement, quels fichiers ? Voici la carte complète. »`,
  `⏱ 3 min · FICHIERS DE PERSONNALISATION

OBJECTIF — Donner la carte de référence des fichiers Copilot, leur déclencheur et le lab associé.

DIRE — « Voici votre aide-mémoire. Les instructions globales, à chaque requête. Les instructions ciblées, si un fichier correspond. Les skills, si la tâche correspond. Les agents, quand on les choisit ou qu’un autre agent les appelle. Les hooks, à chaque événement, de façon déterministe. Le fichier .mcp.json, qui branche les serveurs. Et AGENTS.md, le standard ouvert lu par plusieurs outils : utile si votre équipe mélange Copilot, Claude Code ou Codex. La colonne à retenir, c’est “chargé quand” : c’est elle qui fait votre facture. Tout est dans le dépôt, versionné. Dernier point : Copilot évolue tous les mois, ces noms sont vérifiés pour octobre 2026, contrôlez la documentation avant chaque projet. »

ANIMATION — Proposer une photo de la page : c’est un mémo utile.

TRANSITION — « Une ligne mérite un zoom : .mcp.json, et le protocole MCP. »`,
  `⏱ 3 min · MCP (2 temps)

OBJECTIF — Comprendre MCP, son statut de standard, et ses risques.

DIRE — « MCP, Model Context Protocol, c’est le port USB-C des agents : un standard pour brancher un agent sur des outils et des données. L’agent est un client MCP ; il découvre les outils de chaque serveur et décide quand les appeler. » → clic 1. « Dans FrigoMalin : le serveur GitHub pour créer les issues, Playwright pour piloter un vrai navigateur, Stitch pour les maquettes. » → clic 2. « C’est devenu un standard neutre : créé par Anthropic fin 2024, confié en décembre 2025 à l’Agentic AI Foundation, sous l’égide de la Linux Foundation, avec AGENTS.md et goose. Trois vigilances : un serveur MCP est du code tiers qui agit avec vos droits ; chaque outil exposé ajoute sa définition au contexte, donc des tokens ; et les données renvoyées peuvent contenir des instructions malveillantes — c’est l’injection de prompt indirecte, module 5. Sur les licences Business, les serveurs MCP doivent être autorisés par l’administrateur. »

ANIMATION — Les serveurs apparaissent, puis les deux cartes.

TRANSITION — « Maintenant, une question d’équipe : que confier à l’IA ? »`,
  `⏱ 5 min · EXERCICE DE TRI (glisser-déposer)

OBJECTIF — Décider collectivement du niveau de délégation par type de tâche (automatisation : snippets, tests, commentaires, programme M2).

DIRE — « Douze tâches, trois colonnes. Ce que l’IA fait et que je relis. Ce que l’IA propose et que je décide. Ce que je garde, ou que je confie à un outil déterministe. Faites glisser, on débat. »

RÉPONSES TYPES — L’IA fait : snippets, tests d’une fonction pure, JSDoc, message de commit, jeu de données de test. L’IA propose : migration majeure (par lots, tests de caractérisation), choix d’architecture (options + ADR), expliquer un log. Je garde : décision de mise en production, revue de sécurité finale, rotation d’une clé. PIÈGE : « renommer un symbole partout » n’est pas une tâche d’IA, c’est la commande Renommer (F2) de l’éditeur : exacte, instantanée, gratuite.

ANIMATION — Inviter deux participants à déplacer les pastilles. Double-clic pour remettre une pastille.

TRANSITION — « Ce tri dessine les rôles. Formalisons qui fait quoi. »`,
  `⏱ 3 min · COLLABORATION (4 temps)

OBJECTIF — Définir les rôles et les quatre points de contrôle humains (programme : collaboration humain–IA).

DIRE — « Le développeur est architecte, validateur, décideur final et expert métier. L’IA est assistant, accélérateur, générateur d’options, amplificateur. Ce partage se traduit en quatre points de contrôle, à chaque tâche. » → clic. « Un : le plan validé, avant toute modification. » → clic. « Deux : le diff relu, comme une PR externe. » → clic. « Trois : les tests au vert, et des tests qui testent vraiment. » → clic. « Quatre : le merge par un humain. Celui qui merge assume. Pas de mise en production sans revue, c’est une règle de prudence du module 3 et une exigence de sécurité du module 5. »

ANIMATION — Les quatre portes s’allument une à une.

TRANSITION — « Et pour savoir si tout ça marche, il faut mesurer. »`,
  `⏱ 4 min · EXERCICE · INDICATEURS

OBJECTIF — Distinguer indicateurs utiles et indicateurs de vanité (programme : indicateurs d’efficacité).

DIRE — « Neuf indicateurs. Pour chacun : utile, à interpréter, ou trompeur ? Votez, puis je révèle. »

RÉPONSES — Délai issue → production : utile (DORA). Lignes générées : trompeur. Taux d’acceptation : à interpréter (adoption, pas valeur). Défauts échappés : utile. Temps de revue par PR : utile, l’IA peut gonfler les PR. Nombre de prompts : trompeur. Couverture : à interpréter (qualité des assertions). Crédits IA par feature livrée : utile, le coût rapporté à la valeur, essentiel depuis la facturation à l’usage. Taux de retouche : utile.

ANIMATION — Cliquer chaque carte après le vote. Rappeler le paradoxe METR : on mesure des tâches terminées et validées, pas des impressions. Mentionner DORA et SPACE pour aller plus loin.

TRANSITION — « Petit QCM avant de repasser au clavier. »`,
  `⏱ 2 min · QCM 2

OBJECTIF — Vérifier la compréhension des couches de contexte.

DIRE — « Règles de test chargées seulement quand on touche un test : où les écrivez-vous ? »

RÉPONSES — A ✗ piège : chargé à chaque requête. B ✗ un skill se déclenche selon la tâche, pas le fichier. C ✓ tests.instructions.md avec applyTo « **/*.test.ts ». D ✗ oubli garanti, rien de versionné.

ANIMATION — Cliquer les options, → bonne réponse, → l’essentiel. Rebondir : « Et le lint, on le met où ? » Réponse : ni dans une instruction ni dans un skill, dans un hook (module 6) : c’est déterministe.

TRANSITION — « Retour à FrigoMalin : sprint 2, l’architecture. » (Si 12:15 est dépassé, lancer le lab 2.1 et faire les labs 2.2 et 2.3 après le déjeuner.)`,
  `⏱ 3 min · SPRINT 2 · ARCHITECTURE

OBJECTIF — Poser les contraintes d’architecture qui guideront les agents.

DIRE — « GitHub Pages ne sert que des fichiers statiques. Donc tout tourne dans le navigateur : l’interface, la logique métier en TypeScript pur, les données dans IndexedDB, un service worker pour le hors ligne. Seule dépendance externe : l’API Open Food Facts, publique, sans clé, avec un repli en saisie manuelle si elle ne répond pas. Aucun secret possible : tout ce qui est publié est lisible. Dans ce sprint, trois labs. Un : votre premier agent personnalisé, un architecte en lecture seule. Deux : trois décisions d’architecture documentées en ADR, avec leurs conséquences négatives. Trois : les types TypeScript, qui deviennent le contexte le moins cher et le plus précis pour tous les agents suivants. »

ANIMATION — Laisser le schéma C4 s’afficher ; pointer le flux en pointillé vers Open Food Facts.

TRANSITION — « Lab 2.1 : un agent qui ne peut pas coder. »`,
  `⏱ 20 min (minuteur) · LAB 2.1 · 12:10

OBJECTIF — Créer un agent personnalisé, comprendre que restreindre les outils garantit le rôle.

DIRE — « Un agent qui ne peut pas éditer ne peut pas se lancer dans le code : il reste dans son rôle. Complétez l’en-tête : la description, c’est le “quand m’utiliser” que Copilot lit pour proposer l’agent et, plus tard, pour l’appeler en sous-agent. Les outils : lecture, recherche, et web pour la documentation. Le bouton Configure Tools donne les noms exacts. »

CORRIGÉ (formateur) — description : « Architecte de FrigoMalin. À utiliser pour les choix techniques, les ADR et les schémas, jamais pour écrire du code applicatif. » tools: ['read', 'search', 'web']. Contraintes : statique sur GitHub Pages, aucun secret ; IndexedDB + export JSON ; hors ligne (PWA) ; chemin /frigomalin/ ; seule API Open Food Facts avec repli manuel. « Tu ne modifies jamais de fichier. » Livrables : Mermaid C4 niveaux 1 et 2, ADR MADR, risques. Test : lui demander de modifier un fichier, il doit refuser.

TRANSITION — « Déjeuner. À 14 h : les ADR. »`,
  `⏱ 15 min (minuteur) · LAB 2.2 · 14:00

OBJECTIF — Construire un prompt réutilisable et produire des ADR qui assument leurs conséquences.

DIRE — « Reprise. Votre agent architecte va rédiger trois ADR. Vous construisez le prompt à partir des ingrédients. Choix stratégique : un prompt pour les trois, ou un prompt pour un ADR à la fois ? Justifiez. »

CORRIGÉ (formateur) — Recommandé : un ADR par requête (réponses courtes, relisibles, contexte léger). Exemple 0001 : « Options : localStorage, IndexedDB via Dexie, IndexedDB via idb. Pour chaque option : limite de stockage, requêtes (index, tri par date), poids ajouté au bundle, facilité de test. Termine par la décision, ses conséquences positives et négatives, et ce qui nous ferait revenir sur ce choix. Ne rédige que cet ADR. » Décisions attendues : Dexie ; React + TS ; routage par hash OU repli 404.html (GitHub Pages ne réécrit pas les URL). Conséquence négative de 0001 : données sur un seul appareil (d’où le partage en V2). Un prompt réutilisable est un futur skill.

TRANSITION — « Les décisions sont prises, traduisons-les en types. »`,
  `⏱ 15 min (minuteur) · LAB 2.3

OBJECTIF — Pratiquer le rétro-prompt et produire des types stricts qui guideront tous les agents.

DIRE — « Cette fois, vous avez le résultat. Retrouvez le prompt qui le produit du premier coup : les types, la base Dexie et un générateur de 40 produits de test. »

CORRIGÉ (formateur) — Rôle TS senior ; contexte #PRODUCT.md (glossaire) et #docs/adr/0001-stockage.md ; 1) types.ts : StockItem, Recipe, ImpactEntry, unions littérales, aucun any ; 2) db.ts : base « frigomalin » v1, index expiresOn, status, barcode ; 3) seed.ts : fonction qui génère 40 produits avec des dates RELATIVES à aujourd’hui (3 DLC dépassées, 3 qui expirent aujourd’hui, 2 DDM dépassées, le reste sur 30 jours) ; « ne crée aucun composant d’interface ». Point clé : dates relatives, sinon la démo casse dans une semaine. DLC dépassée = à jeter, DDM dépassée = encore consommable.

TRANSITION — « Le domaine existe. Sprint 3 : préparer ce que Copilot verra à chaque requête. »`,
  `⏱ 2 min · SPRINT 3 · CONTEXTE

OBJECTIF — Introduire les trois labs de context engineering par trois questions.

DIRE — « Avant d’écrire du code métier, on prépare le contexte. Trois questions. Que doit-il savoir ? Ce sont les instructions : le fichier global et les règles ciblées. Que n’a-t-il pas besoin de voir ? Les dossiers générés, dist, node_modules, coverage : hors index, hors recherche. Que ne doit-il jamais voir ? Les secrets, les données réelles : on le traite au module 3 avec le lab 3.2. Chaque ligne d’instruction est payée à chaque requête et chaque fichier inutile dilue l’attention. Un bon contexte, c’est de meilleures réponses et une facture plus basse. »

ANIMATION — Relier les trois cartes aux couches de contexte vues tout à l’heure.

TRANSITION — « Lab 3.1 : créer le projet proprement. »`,
  `⏱ 15 min (minuteur) · LAB 3.1

OBJECTIF — Créer le projet en mode Agent sans blocage, configurer Vite pour Pages, exclure ce qui pollue.

DIRE — « Prompt à trous. Attention au piège numéro un : l’outil de création pose des questions au clavier, et l’agent reste bloqué. Exigez des commandes non interactives et demandez à voir chaque commande avant exécution. »

CORRIGÉ (formateur) — « Crée le projet avec Vite et le modèle react-ts. Ajoute ESLint, Prettier, Vitest et Testing Library, scripts dev, build, preview, lint, lint:fix, test, test:e2e. Configure Vite pour GitHub Pages : base: '/frigomalin/'. Mets à jour .gitignore (dist, coverage, playwright-report, test-results) et .vscode/settings.json (files.exclude et search.exclude, + node_modules). Commandes non interactives (--yes), montre chaque commande avant de l’exécuter. » Sans base, page blanche garantie sur Pages. files.exclude masque aussi dans l’explorateur ; search.exclude laisse visible mais hors recherche.

TRANSITION — « Le projet tourne. Écrivons ce que Copilot lira à chaque requête. »`,
  `⏱ 20 min (minuteur) · LAB 3.3

OBJECTIF — Écrire des instructions globales courtes, denses et vérifiables.

DIRE — « Ce premier jet est typique d’un fichier généré : 150 lignes de bonnes intentions. “Écris du code propre” ne change rien au comportement du modèle. Critère : chaque ligne doit changer le comportement, sinon on la supprime. Moins de 60 lignes. »

CORRIGÉ (formateur) — Sections : renvois (PRODUCT.md, docs/adr/, issues) ; stack ; commandes ; structure (domain pur, data, ui, e2e) ; 5 principes non négociables vérifiables (zéro backend/secret, hors ligne d’abord, tests d’abord, accessibilité AA mobile 360 px, budget JS < 200 Ko gzip et Lighthouse ≥ 90) ; règles projet (dates ISO via dates.ts, DLC dépassée = à jeter / DDM dépassée = consommable, seul appel réseau Open Food Facts avec repli) ; interdits (pas de backend ni secret, ne jamais lire .env* ni exports/, pas de dépendance sans le signaler). Variante : AGENTS.md, mais jamais deux fichiers contradictoires.

TRANSITION — « Les règles générales sont posées. Les règles spécifiques vont dans des fichiers ciblés. »`,
  `⏱ 15 min (minuteur) · LAB 3.4 · fin vers 15:30, puis pause

OBJECTIF — Découper les règles par type de fichier avec applyTo.

DIRE — « Trois fichiers : tests, interface, domaine. Un en-tête avec applyTo, trois à cinq règles. Vérifiez ensuite, dans les références d’une réponse, que seul le bon fichier a été chargé. »

CORRIGÉ (formateur) — tests : applyTo "**/*.test.ts,**/*.test.tsx" ; figer la date (vi.useFakeTimers + vi.setSystemTime) ; un describe par règle, noms en français ; pas de mock du domaine ; fake-indexeddb. ui : applyTo "src/ui/**" ; couleurs uniquement via tokens.css ; mobile d’abord ; accessibilité AA ; aucune logique métier. domain : applyTo "src/domain/**" ; fonctions pures sans React, Dexie ni API navigateur ; un test par règle ; recevoir « aujourd’hui » en paramètre, jamais new Date() dans une règle. Erreur fréquente : un applyTo sur « ** » qui recharge tout.

TRANSITION — « Pause de quinze minutes. Ensuite, module 3 : les limites et les précautions. »`,
];
