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
const FONT_LINK_ID = 'osd-webfont-docaposte-dev-ia-j2';
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
const SLIDE_ID = 'docaposte-dev-ia-j2';
const P = 'dap2'; // CSS class prefix, unique per deck
const DAY: number = 2;
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
      <Icon name="link" size={20} color={C.electric} /> Énoncé et indices : <span style={{ fontFamily: mono, color: C.electric }}>{LABS_URL}</span>
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

// ═══ j2-20-m6 ══════════════════════════════════════════════════════════

// ─── Module 6 · Évaluer & fiabiliser le code ────────────────────────────────

const M6_Divider: Page = () => (
  <Section
    n={6}
    title={
      <>
        Évaluer et fiabiliser
        <br />
        le code généré
      </>
    }
    sub="Méthodes d’évaluation, équipe d’agents, garde-fous, optimisation, maintenabilité et rétro-ingénierie des prompts."
    dur="14:00 – 16:55 · atelier en binômes"
    kind="atelier"
    labs={
      <>
        <Tag tone="green" size={19}>6.1</Tag>
        <Tag tone="green" size={19}>6.2</Tag>
        <Tag tone="green" size={19}>6.3</Tag>
        <Tag tone="green" size={19}>8.1</Tag>
        <Tag tone="green" size={19}>8.2</Tag>
        <Tag tone="green" size={19}>7.2</Tag>
        <Tag tone="green" size={19}>7.3</Tag>
      </>
    }
  >
    <SecItem n={1}>Pair programming humain–IA, analyses statique et dynamique</SecItem>
    <SecItem n={2}>Une équipe d’agents qui se contrôlent</SecItem>
    <SecItem n={3}>Hooks et tests : des garde-fous déterministes</SecItem>
    <SecItem n={4}>Optimisation, maintenabilité, rétro-ingénierie</SecItem>
  </Section>
);
M6_Divider.transition = BLOOM;

// ─── Pyramide de vérification ───────────────────────────────────────────────
const M6Lvl = ({ w, tone, title, sub, cost, beat }: { w: number; tone: Tone; title: string; sub: string; cost: string; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
    <div
      style={{
        width: w,
        marginLeft: (1000 - w) / 2,
        flex: 'none',
        height: 104,
        boxSizing: 'border-box',
        borderRadius: 16,
        background: STRONG[tone],
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 20px',
      }}
    >
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 25 }}>{title}</div>
      <div style={{ fontSize: 19, opacity: 0.9 }}>{sub}</div>
    </div>
    <div style={{ fontSize: 22, color: C.soft, width: 620 }}>{cost}</div>
  </div>
);

const M6_Pyramid: Page = () => (
  <Frame mod={6} beats={4}>
    <Title>La pyramide de vérification du code généré</Title>
    <Lede>Du plus automatique et rapide (en bas) au plus humain et coûteux (en haut). Chaque étage attrape ce que l’autre rate.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column-reverse', gap: 14 }}>
      <M6Lvl w={1000} tone="navy" title="Typage strict, lint, formatage" sub="à chaque édition (hook)" cost="Secondes · attrape API inventées, erreurs de types, style." beat={0} />
      <M6Lvl w={850} tone="blue" title="Tests unitaires" sub="à chaque lot, tests d’abord" cost="Minutes · fixe le comportement métier, cas limites." beat={1} />
      <M6Lvl w={700} tone="violet" title="Analyse statique de sécurité + dépendances" sub="SAST, audit, secrets" cost="Minutes · injections, XSS, paquets vulnérables ou inventés." beat={2} />
      <M6Lvl w={550} tone="teal" title="Tests E2E multi-environnements" sub="navigateurs, écrans, hors ligne" cost="Dizaines de minutes · parcours réels, régressions visuelles." beat={3} />
      <M6Lvl w={400} tone="green" title="Revue humaine" sub="intention, conception" cost="Le plus cher et le plus précieux : est-ce le bon code ?" beat={4} />
    </div>
  </Frame>
);

// ─── Pair programming humain–IA ─────────────────────────────────────────────
const M6Pair = ({ icon, tone, title, who, how, when, d }: { icon: IconName; tone: Tone; title: string; who: string; how: string; when: string; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 26px', borderTop: `8px solid ${STRONG[tone]}`, display: 'flex', flexDirection: 'column', gap: 12, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={60} />
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.ink }}>{title}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color: T[tone].fg }}>{who}</div>
    <div style={{ fontSize: 24, lineHeight: 1.42, color: C.soft }}>{how}</div>
    <div style={{ marginTop: 'auto', fontSize: 22, lineHeight: 1.4, color: C.ink }}>
      <strong>Quand · </strong>
      {when}
    </div>
  </div>
);

const M6_Pair: Page = () => (
  <Frame mod={6}>
    <Title>Pair programming humain–IA : trois formations</Title>
    <Lede>Le pilote tient le clavier, le navigateur garde le cap. Avec l’IA, choisissez qui fait quoi… et changez souvent.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, height: 560, display: 'flex', gap: 24 }}>
      <M6Pair icon="bot" tone="violet" title="L’IA pilote" who="Vous naviguez" how="L’agent écrit par lots ; vous validez le plan, relisez chaque diff, corrigez la trajectoire." when="code nouveau, bien spécifié, couvert par des tests." d={100} />
      <M6Pair icon="user" tone="blue" title="Vous pilotez" who="L’IA navigue" how="Vous codez ; l’IA (Ask) challenge, signale les cas oubliés, propose des tests." when="code critique, conception délicate, apprentissage." d={220} />
      <M6Pair icon="loop" tone="green" title="Ping-pong TDD" who="Rôles alternés" how="Vous écrivez un test, l’IA le fait passer ; puis l’inverse. Les tests restent la référence." when="logique métier, refactoring sous contrôle." d={340} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, width: 1680, fontSize: 23, color: C.muted, ...dl(600) }}>
      Et le binôme humain reste précieux : deux personnes qui relisent un prompt et un diff valent mieux qu’une.
    </div>
  </Frame>
);

// ─── Statique vs dynamique ──────────────────────────────────────────────────
const M6Col = ({ tone, icon, title, sub, cls, children }: { tone: Tone; icon: IconName; title: string; sub: string; cls?: string; children: ReactNode }) => (
  <div className={cls} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', borderTop: `8px solid ${STRONG[tone]}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <IconTile name={icon} tone={tone} size={58} />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.ink }}>{title}</div>
        <div style={{ fontSize: 21, color: C.muted }}>{sub}</div>
      </div>
    </div>
    <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
  </div>
);

const M6Tool = ({ what, tools }: { what: string; tools: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
    <span style={{ width: 280, flex: 'none', fontSize: 23, fontWeight: 600, color: C.ink }}>{what}</span>
    <span style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{tools}</span>
  </div>
);

const M6_StaticDyn: Page = () => (
  <Frame mod={6} beats={1}>
    <Title>Analyse statique et analyse dynamique</Title>
    <Lede>Lire le code sans l’exécuter, puis l’exécuter pour l’observer : les deux sont indispensables, surtout pour du code généré.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', gap: 24 }}>
      <M6Col cls={A.in} tone="navy" icon="search" title="Statique" sub="sans exécuter">
        <M6Tool what="Types et lint" tools={<><Tag tone="navy" size={18}>TypeScript strict</Tag><Tag tone="navy" size={18}>ESLint</Tag></>} />
        <M6Tool what="Qualité, dette" tools={<><Tag tone="navy" size={18}>SonarQube</Tag><Tag tone="navy" size={18}>complexité, duplication</Tag></>} />
        <M6Tool what="Sécurité (SAST)" tools={<><Tag tone="navy" size={18}>CodeQL</Tag><Tag tone="navy" size={18}>Semgrep</Tag></>} />
        <M6Tool what="Dépendances, secrets" tools={<><Tag tone="navy" size={18}>npm audit</Tag><Tag tone="navy" size={18}>Dependabot</Tag><Tag tone="navy" size={18}>secret scanning</Tag></>} />
      </M6Col>
      <M6Col cls={b.on(1)} tone="teal" icon="play" title="Dynamique" sub="en exécutant">
        <M6Tool what="Tests unitaires" tools={<><Tag tone="teal" size={18}>Vitest</Tag><Tag tone="teal" size={18}>mutation testing</Tag></>} />
        <M6Tool what="Parcours bout en bout" tools={<><Tag tone="teal" size={18}>Playwright</Tag></>} />
        <M6Tool what="Sécurité (DAST)" tools={<><Tag tone="teal" size={18}>OWASP ZAP</Tag><Tag tone="teal" size={18}>fuzzing</Tag></>} />
        <M6Tool what="Performance, accessibilité" tools={<><Tag tone="teal" size={18}>Lighthouse</Tag><Tag tone="teal" size={18}>axe</Tag></>} />
      </M6Col>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 790, width: 1680, ...dl(300) }}>
      <Callout title="L’IA dans la boucle" tone="violet" icon="sparkles" size={23}>
        Faites-lui expliquer un avertissement et proposer un correctif (Copilot Autofix, chat sur l’alerte)… mais c’est l’outil, pas l’IA, qui dit si c’est
        corrigé : on relance l’analyse.
      </Callout>
    </div>
  </Frame>
);

// ─── Tests multi-environnements ─────────────────────────────────────────────
const M6_ENV = [
  { id: 'chromium', g: 'b', label: 'Chromium' },
  { id: 'firefox', g: 'b', label: 'Firefox' },
  { id: 'webkit', g: 'b', label: 'WebKit (Safari)' },
  { id: 'mobile', g: 'v', label: 'Mobile 360 px' },
  { id: 'desktop', g: 'v', label: 'Bureau 1280 px' },
  { id: 'online', g: 'n', label: 'En ligne' },
  { id: 'offline', g: 'n', label: 'Hors ligne' },
  { id: 'paris', g: 'z', label: 'Europe/Paris' },
  { id: 'utc', g: 'z', label: 'UTC' },
];

const M6Env = ({ i, on, flip }: { i: number; on: boolean; flip: () => void }) => (
  <Toggle on={on} onChange={flip} tone="teal" size={23} label={M6_ENV[i].label} />
);

const M6Group = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
    <Eyebrow c={C.muted} size={17}>
      {title}
    </Eyebrow>
    {children}
  </div>
);

const M6_MultiEnv: Page = () => {
  const [on, setOn] = useState<Record<string, boolean>>({ chromium: true, firefox: false, webkit: false, mobile: true, desktop: false, online: true, offline: false, paris: true, utc: false });
  const flip = (id: string) => setOn((o) => ({ ...o, [id]: !o[id] }));
  const count = (g: string) => Math.max(1, M6_ENV.filter((e) => e.g === g && on[e.id]).length);
  const combos = count('b') * count('v') * count('n') * count('z');
  const runs = combos * 3;
  const minutes = (runs * 20) / 60;
  return (
    <Frame mod={6} kind="exercice">
      <Title>Tests multi-environnements : la matrice</Title>
      <Lede>Activez les dimensions à couvrir. 3 parcours critiques, ~20 s chacun : combien coûte votre matrice ?</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1040, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <M6Group title="Navigateurs">
          <M6Env i={0} on={on.chromium} flip={() => flip('chromium')} />
          <M6Env i={1} on={on.firefox} flip={() => flip('firefox')} />
          <M6Env i={2} on={on.webkit} flip={() => flip('webkit')} />
        </M6Group>
        <M6Group title="Écrans">
          <M6Env i={3} on={on.mobile} flip={() => flip('mobile')} />
          <M6Env i={4} on={on.desktop} flip={() => flip('desktop')} />
        </M6Group>
        <M6Group title="Réseau">
          <M6Env i={5} on={on.online} flip={() => flip('online')} />
          <M6Env i={6} on={on.offline} flip={() => flip('offline')} />
        </M6Group>
        <M6Group title="Fuseau horaire">
          <M6Env i={7} on={on.paris} flip={() => flip('paris')} />
          <M6Env i={8} on={on.utc} flip={() => flip('utc')} />
        </M6Group>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1220, top: 262, width: 580, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(150) }}>
        <Eyebrow c={C.muted} size={18}>
          Votre matrice
        </Eyebrow>
        <div style={{ marginTop: 8, fontFamily: display, fontWeight: 800, fontSize: 88, lineHeight: 1, color: C.teal }}>{combos}</div>
        <div style={{ fontSize: 24, color: C.soft }}>combinaisons · {runs} exécutions</div>
        <div style={{ marginTop: 16, fontSize: 30, fontWeight: 700, color: minutes > 10 ? C.coral : C.green }}>≈ {fr(minutes, 0)} min de CI</div>
        <div style={{ marginTop: 16, fontSize: 22, lineHeight: 1.45, color: C.soft }}>
          {combos >= 12 ? 'Trop pour chaque PR : gardez la matrice complète pour la nuit.' : 'Raisonnable pour chaque PR.'}
        </div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 1220, top: 640, width: 580, ...dl(300) }}>
        <Callout title="Stratégie" tone="teal" icon="route" size={21}>
          À chaque PR : la combinaison la plus risquée (mobile, hors ligne). Chaque nuit : toute la matrice. Le fuseau UTC révèle les bugs de dates.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Sprint 6 : une équipe d'agents ─────────────────────────────────────────
const M6Agent = ({ x, y, icon, tone, name, role, tools, beat }: { x: number; y: number; icon: IconName; tone: Tone; name: string; role: string; tools: string; beat: number }) => (
  <div className={b.pop(beat)} style={{ position: 'absolute', left: x, top: y, width: 290, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '16px 18px', borderTop: `6px solid ${STRONG[tone]}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone={tone} size={46} />
      <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 21, color: T[tone].fg }}>{name}</span>
    </div>
    <div style={{ marginTop: 8, fontSize: 20, lineHeight: 1.35, color: C.ink }}>{role}</div>
    <div style={{ marginTop: 6, fontFamily: mono, fontSize: 16, color: C.muted }}>{tools}</div>
  </div>
);

const M6_Team: Page = () => (
  <Frame mod={6} beats={5} label="Fil rouge · Sprint 6 — Agents & orchestration">
    <Title>Sprint 6 : d’un assistant à une équipe d’agents</Title>
    <Lede>Des spécialistes aux droits limités, un lead qui planifie, délègue et décide sur des comptes rendus courts.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <Arrow x1={700} y1={420} x2={265} y2={560} color={C.faint} n={1} />
      <Arrow x1={760} y1={420} x2={575} y2={560} color={C.faint} n={2} />
      <Arrow x1={860} y1={420} x2={885} y2={560} color={C.faint} n={3} />
      <Arrow x1={920} y1={420} x2={1195} y2={560} color={C.faint} n={4} />
    </svg>
    <div className={A.pop} style={{ position: 'absolute', left: 560, top: 262, width: 500, background: G.navy, borderRadius: 20, padding: '18px 24px', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <IconTile name="org" tone="violet" size={54} solid />
        <div>
          <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 24 }}>feature-lead</div>
          <div style={{ fontSize: 19, color: '#C9D2F2' }}>planifie · délègue · décide · rapporte</div>
        </div>
      </div>
      <div style={{ marginTop: 8, fontFamily: mono, fontSize: 16, color: '#AEB9E6' }}>read, search, todo, agent, edit (rapport seulement)</div>
    </div>
    <M6Agent x={120} y={560} icon="code" tone="blue" name="developer" role="réalise une tâche, sans élargir le périmètre" tools="read search edit execute" beat={1} />
    <M6Agent x={430} y={560} icon="flask" tone="pink" name="tester" role="écrit et lance les tests, rien d’autre" tools="read search edit execute" beat={2} />
    <M6Agent x={740} y={560} icon="wand" tone="green" name="refactorer" role="simplifie, comportement inchangé" tools="read search edit execute" beat={3} />
    <M6Agent x={1050} y={560} icon="shieldCheck" tone="coral" name="security-reviewer" role="audite, signale, ne corrige pas" tools="read search" beat={4} />
    <div className={b.on(5)} style={{ position: 'absolute', left: 1400, top: 262, width: 400 }}>
      <CodeDark file="Compte rendu commun" size={19}>
        Statut : <Cs>OK</Cs> | <Cn>KO</Cn> | <Cn>BLOQUÉ</Cn>
        {'\n'}Fichiers : …{'\n'}Tests : npm test → …{'\n'}Points ouverts : …{'\n'}Recommandation : …
      </CodeDark>
      <div style={{ marginTop: 16, fontSize: 21, lineHeight: 1.42, color: C.soft }}>
        5 lignes maximum : le lead décide sur ce contrat, sans relire les diffs. Son contexte reste compact.
      </div>
    </div>
    <div className={b.on(5)} style={{ position: 'absolute', left: 120, top: 830, width: 1680, ...dl(300) }}>
      <Callout title="Le principe" tone="violet" icon="layers" size={22}>
        Chaque sous-agent démarre avec un contexte neuf et ne renvoie que son compte rendu. Celui qui audite ne corrige pas ; celui qui teste ne touche pas au code.
      </Callout>
    </div>
  </Frame>
);

// ─── Labs 6.1, 6.2, 6.3 ─────────────────────────────────────────────────────
const M6_Lab61: Page = () => (
  <LabPage
    mod={6}
    n="6.1"
    title="Les spécialistes"
    defi="construire"
    who="Tech Leads · Développeurs"
    label="Fil rouge · Sprint 6 — Agents & orchestration"
    where={
      <>
        <PathChip>.github/agents/</PathChip> developer · tester · refactorer · security-reviewer <PathChip>.agent.md</PathChip>
      </>
    }
    objective="Créer 4 agents spécialisés, chacun avec ses outils et son modèle, qui terminent tous par le même compte rendu court."
    feats={
      <>
        <Tag tone="blue" size={18}>tools</Tag>
        <Tag tone="blue" size={18}>model</Tag>
        <Tag tone="blue" size={18}>Compte rendu commun</Tag>
      </>
    }
    minutes={20}
    crit={
      <>
        <CheckItem id="l61a" size={21}>4 agents sélectionnables</CheckItem>
        <CheckItem id="l61b" size={21}>Le security-reviewer ne peut rien modifier</CheckItem>
        <CheckItem id="l61c" size={21}>Section « Tu ne fais jamais » partout</CheckItem>
      </>
    }
  >
    Remplissez d’abord le tableau de conception et le format du compte rendu, faites-les valider, puis écrivez les 4 fichiers et testez chaque agent seul.
    <CodeDark size={18} style={{ marginTop: 12 }}>
      Agent             | Rôle | Outils | Modèle | JAMAIS{'\n'}developer         | <Hole>…</Hole> | <Hole>…</Hole> | <Hole>…</Hole> | <Hole>…</Hole>
      {'\n'}tester            | <Hole>…</Hole> | <Hole>…</Hole> | <Hole>…</Hole> | <Hole>…</Hole>
      {'\n'}refactorer        | <Hole>…</Hole> | <Hole>…</Hole> | <Hole>…</Hole> | <Hole>…</Hole>
      {'\n'}security-reviewer | <Hole>…</Hole> | <Hole>…</Hole> | <Hole>…</Hole> | <Hole>…</Hole>
      {'\n'}Compte rendu commun : <Hole>…</Hole>
    </CodeDark>
  </LabPage>
);

const M6_Lab62: Page = () => (
  <LabPage
    mod={6}
    n="6.2"
    title="Le feature-lead"
    defi="squelette"
    who="Tech Leads"
    label="Fil rouge · Sprint 6 — Agents & orchestration"
    where={
      <>
        <PathChip>.github/agents/feature-lead.agent.md</PathChip> · rapports dans <PathChip>docs/reports/</PathChip>
      </>
    }
    objective="Créer le lead : il planifie, délègue chaque tâche aux spécialistes en sous-agents, décide sur leurs comptes rendus et rédige un rapport. Il ne touche jamais au code."
    feats={
      <>
        <Tag tone="blue" size={18}>Sous-agents</Tag>
        <Tag tone="blue" size={18}>agents:</Tag>
        <Tag tone="blue" size={18}>handoffs (option)</Tag>
      </>
    }
    minutes={15}
    crit={
      <>
        <CheckItem id="l62a" size={21}>N’appelle que les 4 spécialistes</CheckItem>
        <CheckItem id="l62b" size={21}>Décision écrite pour OK, KO, BLOQUÉ</CheckItem>
        <CheckItem id="l62c" size={21}>N’écrit que dans docs/reports/</CheckItem>
      </>
    }
  >
    Complétez l’en-tête et les règles de décision. Que décide le lead pour chaque statut ? Quand rend-il la main ?
    <CodeDark size={18} wrap style={{ marginTop: 10 }}>
      <Ck>tools</Ck>: ['read', 'search', 'todo', <Hole>sous-agents</Hole>, <Hole>rapport</Hole>]{'\n'}
      <Ck>agents</Ck>: <Hole>lesquels ?</Hole> · <Ck>model</Ck>: <Hole>type</Hole>
      {'\n'}Statut OK : <Hole>…</Hole>
      {'\n'}Statut KO (tests rouges) : <Hole>…</Hole>
      {'\n'}Statut BLOQUÉ (audit) : <Hole>…</Hole>
      {'\n'}
      <Hole>au bout de combien d’échecs rends-tu la main ?</Hole>
      {'\n'}Tu ne fais jamais : <Hole>…</Hole>
    </CodeDark>
  </LabPage>
);

const M6_Lab63: Page = () => (
  <LabPage
    mod={6}
    n="6.3"
    title="Orchestration : le mode hors ligne"
    defi="construire"
    who="Tech Leads · Développeurs"
    label="Fil rouge · Sprint 6 — Agents & orchestration"
    where={
      <>
        Aucun nouvel agent. Code dans <PathChip>src/</PathChip> <PathChip>public/</PathChip> · rapport <PathChip>docs/reports/pwa-hors-ligne.md</PathChip>
      </>
    }
    objective="Confier une vraie feature au feature-lead et le laisser orchestrer : plan validé, délégations, décisions sur comptes rendus, rapport final."
    feats={
      <>
        <Tag tone="blue" size={18}>Orchestration</Tag>
        <Tag tone="blue" size={18}>Contexte isolé</Tag>
      </>
    }
    minutes={20}
    crit={
      <>
        <CheckItem id="l63a" size={21}>Plan validé avant toute délégation</CheckItem>
        <CheckItem id="l63b" size={21}>Aucun fichier modifié hors docs/reports/</CheckItem>
        <CheckItem id="l63c" size={21}>Décisions et raisons dans le rapport</CheckItem>
        <CheckItem id="l63d" size={21}>Installable, se recharge hors ligne</CheckItem>
      </>
    }
    bonus={
      <Callout title="Bonus · Lab 6.4" tone="pink" icon="sparkles" size={19}>
        qa-explorer : un agent qui teste l’appli comme un humain, via le serveur MCP Playwright.
      </Callout>
    }
  >
    Écrivez le prompt confié au feature-lead : la feature (PWA installable et hors ligne), le périmètre (manifeste, service worker, icônes, bannière), le hors
    périmètre, les principes, le critère de fin, le rapport attendu.
    <div style={{ marginTop: 12, fontSize: 22, color: C.ink }}>
      Puis analysez le rapport : combien de tâches, combien de retours au developer, et une décision du lead que vous auriez prise autrement.
    </div>
  </LabPage>
);

// ─── Hooks ──────────────────────────────────────────────────────────────────
const M6_Hooks: Page = () => (
  <Frame mod={6} beats={1} label="Fil rouge · Sprint 8 — Garde-fous">
    <Title>Consigne ou hook : probabiliste ou déterministe</Title>
    <Lede>Une consigne peut être oubliée par le modèle. Un hook, jamais : c’est une commande exécutée par l’outil, pas par l’IA.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', gap: 24 }}>
      <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', borderTop: `8px solid ${C.yellow}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconTile name="chat" tone="yellow" size={56} />
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.ink }}>Consigne</div>
        </div>
        <div style={{ marginTop: 14, fontFamily: mono, fontSize: 21, color: C.soft }}>« Pense à lancer le lint après chaque modification. »</div>
        <div style={{ marginTop: 16, fontSize: 24, lineHeight: 1.42, color: C.ink }}>Suivie… la plupart du temps. Le modèle peut l’oublier, surtout quand le contexte est chargé.</div>
      </div>
      <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', borderTop: `8px solid ${C.green}`, ...dl(150) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconTile name="bolt" tone="green" size={56} />
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.ink }}>Hook</div>
        </div>
        <div style={{ marginTop: 14, fontFamily: mono, fontSize: 21, color: C.soft }}>postToolUse → npm run lint:fix && prettier</div>
        <div style={{ marginTop: 16, fontSize: 24, lineHeight: 1.42, color: C.ink }}>Exécuté à chaque édition, quoi que pense le modèle. Rapide, ciblé, vérifiable.</div>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'flex', gap: 24 }}>
      <Card tone="coral" icon="shield" title="Avant un outil" style={{ flex: 1 }} size={22}>
        Bloquer une commande dangereuse (rm -rf, push --force), une écriture hors du dossier autorisé.
      </Card>
      <Card tone="green" icon="checkCircle" title="Après un outil" style={{ flex: 1 }} size={22}>
        Formater, linter, lancer les tests ciblés, renvoyer les erreurs au modèle.
      </Card>
      <Card tone="navy" icon="clock" title="La règle d’or" style={{ flex: 1 }} size={22}>
        Un hook rapide et bien choisi vaut mieux que dix hooks lents qui ralentissent chaque édition.
      </Card>
    </div>
  </Frame>
);

const M6_Lab81: Page = () => (
  <LabPage
    mod={6}
    n="8.1"
    title="Un hook : lint et formatage"
    defi="squelette"
    who="Tech Leads · Développeurs"
    label="Fil rouge · Sprint 8 — Garde-fous"
    where={
      <>
        <PathChip>.github/hooks/quality.json</PathChip>
      </>
    }
    objective="Créer un hook qui lance le lint et le formatage automatiquement chaque fois que l’agent modifie un fichier."
    feats={
      <>
        <Tag tone="blue" size={18}>Hooks</Tag>
        <Tag tone="blue" size={18}>postToolUse</Tag>
      </>
    }
    minutes={10}
    crit={
      <>
        <CheckItem id="l81a" size={21}>Se déclenche après une édition</CheckItem>
        <CheckItem id="l81b" size={21}>Fonctionne sous Windows et Linux</CheckItem>
        <CheckItem id="l81c" size={21}>Un fichier mal formaté est corrigé seul</CheckItem>
      </>
    }
  >
    Complétez le fichier, puis demandez à l’agent une modification mal formatée pour vérifier le déclenchement.
    <CodeDark size={20} style={{ marginTop: 12 }}>
      {'{'}
      {'\n  '}
      <Cs>"version"</Cs>: <Hole>…</Hole>,{'\n  '}
      <Cs>"hooks"</Cs>: {'{'}
      {'\n    '}
      <Cs>"</Cs>
      <Hole>événement APRÈS un outil</Hole>
      <Cs>"</Cs>: [{'{'}
      {'\n      '}
      <Cs>"type"</Cs>: <Cs>"command"</Cs>, <Cs>"matcher"</Cs>: <Hole>quels outils ?</Hole>,{'\n      '}
      <Cs>"bash"</Cs>: <Hole>…</Hole>, <Cs>"powershell"</Cs>: <Hole>…</Hole>,{'\n      '}
      <Cs>"timeoutSec"</Cs>: <Hole>…</Hole>
      {'\n    }]\n  }\n}'}
    </CodeDark>
  </LabPage>
);

const M6_Lab82: Page = () => (
  <LabPage
    mod={6}
    n="8.2"
    title="Tests unitaires & E2E par l’agent tester"
    defi="trous"
    who="Développeurs · QA"
    label="Fil rouge · Sprint 8 — Garde-fous"
    where={
      <>
        <PathChip>src/domain/*.test.ts</PathChip> · <PathChip>tests/e2e/</PathChip>
      </>
    }
    objective="Compléter la couverture : tests unitaires des règles de dates et 3 tests E2E Playwright des parcours critiques, en mobile et bureau."
    feats={
      <>
        <Tag tone="blue" size={18}>Agent tester</Tag>
        <Tag tone="blue" size={18}>Playwright</Tag>
      </>
    }
    minutes={15}
    crit={
      <>
        <CheckItem id="l82a" size={21}>Les tests de dates passent à toute heure</CheckItem>
        <CheckItem id="l82b" size={21}>3 tests E2E verts en local</CheckItem>
        <CheckItem id="l82c" size={21}>Aucun sélecteur CSS fragile</CheckItem>
      </>
    }
    bonus={
      <Callout title="Bonus · Lab 8.3" tone="pink" icon="sparkles" size={19}>
        Revue de PR par Copilot, guidée par vos critères (dont la sécurité front).
      </Callout>
    }
  >
    Complétez le prompt pour l’agent tester.
    <CodeDark size={20} wrap style={{ marginTop: 12 }}>
      Écris les tests manquants pour <Hole>fichier(s)</Hole>.{'\n'}Cas limites de dates : <Hole>au moins 4</Hole>.{'\n'}Puis 3 tests Playwright : <Hole>parcours</Hole>, en{' '}
      <Hole>résolution(s)</Hole>.{'\n'}Règles : <Hole>comment rendre les tests stables ?</Hole>
      {'\n'}Termine par <Hole>…</Hole>.
    </CodeDark>
  </LabPage>
);

// ─── Optimisation & maintenabilité ──────────────────────────────────────────
const M6Smell = ({ smell, fix, d }: { smell: string; fix: string; d: number }) => (
  <div className={A.left} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', alignItems: 'center', gap: 10, ...dl(d) }}>
    <div style={{ background: T.coral.bg, borderRadius: 14, padding: '14px 20px', fontSize: 23, color: C.ink }}>{smell}</div>
    <Icon name="arrow" size={34} color={C.faint} style={{ margin: '0 auto' }} />
    <div style={{ background: T.green.bg, borderRadius: 14, padding: '14px 20px', fontSize: 23, color: C.ink }}>{fix}</div>
  </div>
);

const M6_Maintain: Page = () => (
  <Frame mod={6}>
    <Title>Optimisation et maintenabilité : la dette va vite aussi</Title>
    <Lede>L’IA écrit plus de code, plus vite. Les études (GitClear 2025) observent plus de duplication et moins de refactoring.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', gap: 10, fontSize: 18, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>
        <span>SYMPTÔME FRÉQUENT</span>
        <span />
        <span>RÉPONSE</span>
      </div>
      <M6Smell smell="Code dupliqué plutôt que réutilisé" fix="Instructions : « réutilise src/domain », détection de duplication en CI" d={100} />
      <M6Smell smell="Fonctions longues, complexité élevée" fix="Seuils de complexité dans le lint, agent refactorer tests au vert" d={200} />
      <M6Smell smell="Dépendance ajoutée pour trois lignes" fix="Règle « pas de dépendance sans le signaler », budget de bundle" d={300} />
      <M6Smell smell="Performance ignorée (O(n²), rendus inutiles)" fix="Exiger la complexité attendue, mesurer (Lighthouse, profiler)" d={400} />
      <M6Smell smell="Nommage générique (data, item2, handleStuff)" fix="Glossaire du PRODUCT.md, revue ciblée sur les noms" d={500} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 830, width: 1680, ...dl(700) }}>
      <Callout title="Le critère ultime" tone="navy" icon="users" size={23}>
        Dans six mois, un collègue (ou un agent) devra modifier ce code. Lisible, testé, documenté par ses tests : sinon, l’accélération d’aujourd’hui est un emprunt.
      </Callout>
    </div>
  </Frame>
);

// ─── Labs 7.2 et 7.3 (QCM) ──────────────────────────────────────────────────
const M6_Lab72: Page = () => (
  <Frame mod={6} kind="lab" label="Fil rouge · Sprint 7 — Optimisation">
    <Title>
      <span style={{ color: C.green }}>Lab 7.2</span> · Alléger le contexte
    </Title>
    <Lede>Un contexte plus petit, c’est moins cher… et un modèle plus concentré. Six situations réelles.</Lede>
    <QuizSeries y={255}>
      <QuizQ q="Depuis ce matin, la même session enchaîne inventaire, bug CSS et question Git. Nouvelle tâche :" explain="Une tâche = une session : l’historique précédent est du contexte payé à chaque requête, sans valeur.">
        <QOpt>Continuer dans la même session : l’agent garde tout en mémoire</QOpt>
        <QOpt ok>Ouvrir une nouvelle session (Ctrl+N) dédiée à la tâche</QOpt>
        <QOpt>Coller un résumé des échanges précédents</QOpt>
        <QOpt>Désactiver les fichiers d’instructions</QOpt>
      </QuizQ>
      <QuizQ q="Vous voulez qu’un agent ajoute un filtre à l’écran Inventaire." explain="Des mentions précises donnent un contexte petit et pertinent ; l’agent sait chercher le reste.">
        <QOpt>« Voici tout le projet #codebase, ajoute un filtre »</QOpt>
        <QOpt ok>Nommer les 2 ou 3 fichiers utiles avec #</QOpt>
        <QOpt>Coller le contenu de tous les fichiers de src/</QOpt>
        <QOpt>Ne donner aucun contexte</QOpt>
      </QuizQ>
      <QuizQ q="À chaque exécution, npm test affiche 400 lignes que l’agent relit." explain="Les sorties d’outils sont souvent le premier poste de tokens : une règle de test concise profite à toutes les sessions.">
        <QOpt>Désactiver les tests pendant le développement</QOpt>
        <QOpt>Demander à l’agent de ne jamais lire la sortie</QOpt>
        <QOpt ok>Règle dans tests.instructions.md : tests ciblés, rapporteur concis</QOpt>
        <QOpt>Passer à un modèle avec une plus grande fenêtre</QOpt>
      </QuizQ>
      <QuizQ q="L’agent a besoin de la documentation de Dexie (3 000 lignes)." explain="Un skill n’est chargé que lorsqu’il sert, et sa version réduite coûte peu.">
        <QOpt>La coller en entier à chaque session</QOpt>
        <QOpt ok>Un skill réduit aux 30 lignes utiles, chargé à la demande</QOpt>
        <QOpt>L’ajouter dans copilot-instructions.md</QOpt>
        <QOpt>Laisser l’agent deviner l’API</QOpt>
      </QuizQ>
      <QuizQ q="La session s’allonge, vous voulez continuer sans perdre les décisions prises." explain="/compact résume l’historique ; le faire vous-même évite qu’un compactage automatique efface un détail.">
        <QOpt ok>Lancer /compact au bon moment</QOpt>
        <QOpt>Fermer et rouvrir VS Code</QOpt>
        <QOpt>Ajouter « souviens-toi de tout » au prompt</QOpt>
        <QOpt>Recommencer la tâche depuis le début</QOpt>
      </QuizQ>
      <QuizQ q="Vous voulez essayer une approche alternative sans encombrer la session." explain="/fork copie la session jusqu’au message courant : la variante hérite du contexte, la session principale reste propre.">
        <QOpt ok>Lancer /fork pour explorer la variante</QOpt>
        <QOpt>Créer un nouveau dépôt</QOpt>
        <QOpt>Écrire la variante dans la même session puis l’annuler</QOpt>
        <QOpt>Désactiver les instructions</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M6_Lab73: Page = () => (
  <Frame mod={6} kind="lab" label="Fil rouge · Sprint 7 — Optimisation">
    <Title>
      <span style={{ color: C.green }}>Lab 7.3</span> · Alléger la facture : modèles, outils, scripts
    </Title>
    <Lede>Depuis juin 2026, chaque token est facturé. Six choix, à qualité égale.</Lede>
    <QuizSeries y={255}>
      <QuizQ q="Quel modèle pour planifier une feature, puis pour exécuter un plan clair ?" explain="Le raisonnement sert au plan ; un plan clair s’exécute très bien avec un modèle économique. L’agent fige ce choix par rôle.">
        <QOpt>Le modèle le plus puissant pour les deux</QOpt>
        <QOpt ok>Raisonnement pour planifier (lead), économique ou Auto pour exécuter</QOpt>
        <QOpt>Le moins cher pour les deux</QOpt>
        <QOpt>Le modèle n’a pas d’impact sur le coût</QOpt>
      </QuizQ>
      <QuizQ q="Pour du pur code, les serveurs MCP GitHub et Playwright sont actifs avec tous leurs outils." explain="Chaque outil déclaré ajoute sa définition au contexte : n’exposer que l’utile réduit tokens et erreurs.">
        <QOpt>Les laisser : plus d’outils, plus de capacités</QOpt>
        <QOpt ok>Désactiver les outils inutiles (Configure Tools)</QOpt>
        <QOpt>Ajouter un serveur MCP supplémentaire</QOpt>
        <QOpt>Supprimer .mcp.json</QOpt>
      </QuizQ>
      <QuizQ q="Il faut générer 40 fiches recettes au même format." explain="Une boucle coûte moins cher dans un script que dans une conversation : l’agent écrit le script une fois.">
        <QOpt>Demander 40 fois à l’agent</QOpt>
        <QOpt ok>Faire écrire un script de génération, puis l’exécuter</QOpt>
        <QOpt>Copier-coller 40 fois la même réponse</QOpt>
        <QOpt>Ouvrir 40 sessions en parallèle</QOpt>
      </QuizQ>
      <QuizQ q="En pleine session, vous hésitez à modifier copilot-instructions.md ou à changer de modèle." explain="Le cache de prompt réutilise le début stable de la requête : le modifier en cours de session l’invalide.">
        <QOpt>Aucun impact</QOpt>
        <QOpt ok>Ça casse le cache de prompt : faites-le en début de session</QOpt>
        <QOpt>Ça accélère toujours les réponses</QOpt>
        <QOpt>C’est recommandé toutes les 10 requêtes</QOpt>
      </QuizQ>
      <QuizQ q="Un modèle bon marché échoue trois fois ; un plus cher réussit du premier coup." explain="On compare le coût de tâches réussies, pas le prix au token.">
        <QOpt>Le bon marché reste toujours plus économique</QOpt>
        <QOpt ok>Comparer le coût total à qualité égale</QOpt>
        <QOpt>Toujours prendre le plus cher</QOpt>
        <QOpt>Le nombre d’essais ne compte pas</QOpt>
      </QuizQ>
      <QuizQ q="Où voir le coût d’une réponse pendant que vous travaillez ?" explain="Le survol du pied de réponse affiche la consommation ; le sélecteur de modèles compare les coûts.">
        <QOpt>Uniquement sur la facture mensuelle</QOpt>
        <QOpt ok>Au survol du pied de la réponse (et dans le sélecteur de modèles)</QOpt>
        <QOpt>Dans package.json</QOpt>
        <QOpt>Dans l’onglet Actions de GitHub</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Rétro-ingénierie des prompts ───────────────────────────────────────────
const M6Retro = ({ sym, miss, fix, beat }: { sym: string; miss: string; fix: string; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'grid', gridTemplateColumns: '520px 440px 1fr', gap: 16 }}>
    <div style={{ background: T.coral.bg, borderRadius: 14, padding: '14px 20px', fontSize: 22, color: C.ink }}>{sym}</div>
    <div style={{ background: T.yellow.bg, borderRadius: 14, padding: '14px 20px', fontSize: 22, color: C.ink }}>{miss}</div>
    <div style={{ background: T.green.bg, borderRadius: 14, padding: '14px 20px', fontSize: 22, color: C.ink }}>{fix}</div>
  </div>
);

const M6_Retro: Page = () => (
  <Frame mod={6} beats={4}>
    <Title>Rétro-ingénierie : du mauvais résultat au meilleur prompt</Title>
    <Lede>Un résultat décevant est un diagnostic : quel ingrédient manquait ? Puis on capitalise pour ne plus jamais le redemander.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '520px 440px 1fr', gap: 16, fontSize: 18, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>
        <span>CE QUE L’AGENT A FAIT</span>
        <span>INGRÉDIENT MANQUANT</span>
        <span>CORRECTIF DURABLE</span>
      </div>
      <M6Retro sym="Il a modifié 12 fichiers pour un filtre" miss="Tâche non bornée" fix="« uniquement… » + lots ; règle dans les instructions" beat={0} />
      <M6Retro sym="Il a stocké les données dans localStorage" miss="Contexte : l’ADR n’était pas joint" fix="#docs/adr/0001 ; instruction « stockage via src/data »" beat={1} />
      <M6Retro sym="Ses tests passent… sur du code faux" miss="Tests écrits après le code" fix="TDD ; règle dans tests.instructions.md" beat={2} />
      <M6Retro sym="Il a codé les couleurs en dur" miss="Convention non écrite" fix="skill create-component + script check.mjs" beat={3} />
      <M6Retro sym="Il tourne en boucle sans s’arrêter" miss="Pas de critère de fin" fix="commande de fin + limite d’échecs (feature-lead)" beat={4} />
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 830, width: 1680, ...dl(300) }}>
      <Callout title="Règle de capitalisation" tone="violet" icon="layers" size={23}>
        Une correction de prompt répétée deux fois devient une <strong>instruction</strong>, un <strong>skill</strong> ou un <strong>hook</strong>. Votre configuration
        apprend, pas seulement vous.
      </Callout>
    </div>
  </Frame>
);

// ─── Atelier en binômes ─────────────────────────────────────────────────────
const M6Step = ({ n, title, t, children, d }: { n: number; title: string; t: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', ...dl(d) }}>
    <Num n={n} tone="yellow" size={50} />
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{ fontSize: 27, fontWeight: 700, color: C.ink }}>{title}</span>
        <Tag tone="grey" size={17}>
          {t}
        </Tag>
      </div>
      <div style={{ marginTop: 4, fontSize: 23, lineHeight: 1.42, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M6_AtelierBrief: Page = () => (
  <Frame mod={6} kind="atelier">
    <Title>Atelier en binômes : améliorer un code produit par IA</Title>
    <Lede>Un pilote, un navigateur, on échange à mi-parcours. Objectif : un code plus sûr, plus lisible, testé… et le prompt qui l’aurait produit.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1080, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <M6Step n={1} title="Caractériser" t="5 min" d={100}>
        Écrire des tests qui figent le comportement actuel, y compris les bugs repérés.
      </M6Step>
      <M6Step n={2} title="Analyser" t="5 min" d={200}>
        Lint strict, types, SAST : lister et prioriser les problèmes.
      </M6Step>
      <M6Step n={3} title="Refactorer avec l’IA" t="10 min" d={300}>
        Petits pas, tests au vert à chaque étape ; l’agent refactorer peut aider.
      </M6Step>
      <M6Step n={4} title="Rétro-prompt" t="5 min" d={400}>
        Écrire le prompt qui aurait produit la bonne version du premier coup.
      </M6Step>
      <M6Step n={5} title="Capitaliser" t="5 min" d={500}>
        Une règle ajoutée aux instructions, à un skill ou à la checklist de revue.
      </M6Step>
    </div>
    <div style={{ position: 'absolute', left: 1260, top: 262, width: 540, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Timer id="m6-binome" minutes={30} label="Atelier binômes" cls={A.right} style={{ width: 540 }} />
      <Card tone="green" icon="checkCircle" title="Livrables" cls={A.right} style={dl(200)} size={22}>
        Code amélioré et testé · liste priorisée · prompt amélioré · une règle capitalisée.
      </Card>
    </div>
  </Frame>
);

const M6_AtelierCode: Page = () => {
  const [after, setAfter] = useState(false);
  return (
    <Frame mod={6} kind="atelier">
      <Title>Le code à améliorer : le tableau « kg et € sauvés »</Title>
      <Lede>Généré en une requête, « ça marche » sur l’exemple de la démo. Combien de problèmes ? Puis basculez sur la version améliorée.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 250, display: 'flex', gap: 12 }}>
        <Btn tone={after ? 'grey' : 'coral'} ghost={after} size={21} icon="bug" onClick={() => setAfter(false)}>
          Avant (généré)
        </Btn>
        <Btn tone={after ? 'green' : 'grey'} ghost={!after} size={21} icon="checkCircle" onClick={() => setAfter(true)}>
          Après (amélioré)
        </Btn>
      </div>
      {after ? (
        <CodeDark key="after" file="src/domain/impact.ts — après" size={21} cls={A.fade} style={{ position: 'absolute', left: 120, top: 330, width: 1160 }}>
          <Ck>const</Ck> EURO_PER_KG = <Cn>3.5</Cn>; <Cc>{'// hypothèse documentée dans PRODUCT.md'}</Cc>
          {'\n'}
          <Ck>const</Ck> KG_FACTOR: Record{'<'}Unit, <Ck>number</Ck> | <Ck>null</Ck>{'>'} = {'{'} g: <Cn>0.001</Cn>, kg: <Cn>1</Cn>, ml: <Cn>0.001</Cn>, L: <Cn>1</Cn>, pièce: <Ck>null</Ck> {'}'};
          {'\n\n'}
          <Ck>export function</Ck> <Cf>computeImpact</Cf>(items: <Ck>readonly</Ck> StockItem[], today: IsoDate): Impact {'{'}
          {'\n  '}
          <Ck>const</Ck> unique = <Ck>new</Ck> <Cf>Map</Cf>(items.<Cf>map</Cf>((it) =&gt; [it.id, it]));{'\n  '}
          <Ck>let</Ck> kg = <Cn>0</Cn>;{'\n  '}
          <Ck>for</Ck> (<Ck>const</Ck> it <Ck>of</Ck> unique.<Cf>values</Cf>()) {'{'}
          {'\n    '}
          <Ck>const</Ck> factor = KG_FACTOR[it.unit];{'\n    '}
          <Ck>if</Ck> (factor === <Ck>null</Ck> || !<Cf>isSaved</Cf>(it, today)) <Ck>continue</Ck>; <Cc>{'// règle dans dates.ts'}</Cc>
          {'\n    '}kg += it.quantity * factor;{'\n  }\n  '}
          <Ck>return</Ck> {'{'} kg: <Cf>round2</Cf>(kg), euros: <Cf>round2</Cf>(kg * EURO_PER_KG) {'}'};{'\n}'}
        </CodeDark>
      ) : (
        <CodeDark key="before" file="src/domain/impact.ts — généré par IA" size={21} cls={A.fade} style={{ position: 'absolute', left: 120, top: 330, width: 1160 }}>
          <Ck>export function</Ck> <Cf>computeImpact</Cf>(items: <Cx>any[]</Cx>) {'{'}
          {'\n  '}
          <Ck>let</Ck> kg = <Cn>0</Cn>, euros = <Cn>0</Cn>;{'\n  '}
          <Ck>for</Ck> (<Ck>let</Ck> i = <Cn>0</Cn>; i {'<'} items.length; i++) {'{'}
          {'\n    '}
          <Cx>
            <Ck>for</Ck> (<Ck>let</Ck> j = <Cn>0</Cn>; j {'<'} items.length; j++)
          </Cx>
          {'\n      '}
          <Ck>if</Ck> (i != j && items[i].id == items[j].id) <Cx>items.splice(j, 1)</Cx>;{'\n    '}
          <Ck>const</Ck> it = items[i];{'\n    '}
          <Ck>if</Ck> (it.status == <Cs>'consommé'</Cs> && <Cx>new Date(it.expiresOn) {'>='} new Date()</Cx>) {'{'}
          {'\n      '}kg += <Cx>it.unit == <Cs>'g'</Cs> ? it.quantity / <Cn>1000</Cn> : it.quantity</Cx>;{'\n      '}euros += it.quantity * <Cx>
            <Cn>0.0035</Cn>
          </Cx>;{'\n    }\n  }\n  '}
          <Ck>return</Ck> {'{'} kg: Math.<Cf>round</Cf>(kg * <Cn>100</Cn>) / <Cn>100</Cn>, euros: <Cx>euros.toFixed(2)</Cx> {'}'};{'\n}'}
        </CodeDark>
      )}
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 330, width: 470, display: 'flex', flexDirection: 'column', gap: 12, ...dl(200) }}>
        <Eyebrow c={after ? T.green.fg : T.coral.fg} size={20}>
          {after ? 'Ce qui a changé' : 'À trouver (soulignés)'}
        </Eyebrow>
        {after ? (
          <>
            <Bullet tone="green" size={21}>Types stricts, entrée non modifiée (readonly)</Bullet>
            <Bullet tone="green" size={21}>Doublons en O(n) avec une Map</Bullet>
            <Bullet tone="green" size={21}>« Aujourd’hui » en paramètre : testable, sans fuseau</Bullet>
            <Bullet tone="green" size={21}>Toutes les unités gérées, pièce exclue</Bullet>
            <Bullet tone="green" size={21}>Constantes nommées et documentées</Bullet>
            <Bullet tone="green" size={21}>Types de retour cohérents (nombres)</Bullet>
          </>
        ) : (
          <>
            <Bullet tone="coral" size={21}>any : aucune vérification de type</Bullet>
            <Bullet tone="coral" size={21}>Double boucle O(n²) et splice pendant l’itération</Bullet>
            <Bullet tone="coral" size={21}>new Date() : non testable, piège de fuseau</Bullet>
            <Bullet tone="coral" size={21}>Unités ml, L, pièce comptées en kg</Bullet>
            <Bullet tone="coral" size={21}>Nombre magique 0.0035, appliqué à toute unité</Bullet>
            <Bullet tone="coral" size={21}>euros en texte, kg en nombre</Bullet>
          </>
        )}
      </div>
    </Frame>
  );
};

// ─── QCM M6 ─────────────────────────────────────────────────────────────────
const M6_Qcm: Page = () => (
  <QcmPage
    mod={6}
    n={5}
    title="Le feature-lead"
    q="Pourquoi le feature-lead décide-t-il à partir des comptes rendus de ses spécialistes plutôt qu’en relisant leurs diffs ?"
    explain="Chaque sous-agent travaille dans son propre contexte et ne renvoie qu’un compte rendu de 5 lignes : le lead garde un contexte compact sur toute la feature. La relecture des diffs reste le rôle de l’humain."
  >
    <Opt why="Piège ! Il sait lire du code ; c’est un choix d’architecture, pas une incapacité.">Parce qu’un agent ne sait pas lire un diff</Opt>
    <Opt ok why="Oui : des centaines de lignes lues par les spécialistes n’entrent jamais dans son contexte. Il reste précis et économique.">
      Pour garder son contexte compact et ses décisions fiables
    </Opt>
    <Opt why="Non : les diffs ne sont pas confidentiels entre agents du même dépôt.">Parce que les diffs sont confidentiels</Opt>
    <Opt why="Piège ! Personne ne relirait les diffs : c’est justement le rôle de l’humain à la revue.">Pour que plus personne n’ait à relire les diffs</Opt>
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
  title: "Docaposte · Dev & IA — Jour 2",
  createdAt: '2026-10-10T15:20:00.000Z',
};

export default [
  M6_Divider,
  M6_Pyramid,
  M6_Pair,
  M6_StaticDyn,
  M6_MultiEnv,
  M6_Team,
  M6_Lab61,
  M6_Lab62,
  M6_Lab63,
  M6_Hooks,
  M6_Lab81,
  M6_Lab82,
  M6_Maintain,
  M6_Lab72,
  M6_Lab73,
  M6_Retro,
  M6_AtelierBrief,
  M6_AtelierCode,
  M6_Qcm,
] satisfies Page[];

// Speaker notes — one entry per page, same order as the default export.
export const notes: (string | undefined)[] = [
  `⏱ 1 min · DIVISEUR M6 · 14:00

OBJECTIF — Annoncer le module 6 du programme : méthodes d’évaluation (pair programming humain–IA, analyses statique et dynamique, tests multi-environnements), optimisation et maintenabilité, rétro-ingénierie des prompts, atelier en binômes.

DIRE — « Module 6 : évaluer et fiabiliser le code. C’est le module le plus long et le plus dense. On commence par les méthodes d’évaluation. Puis on construit dans FrigoMalin une équipe d’agents qui se contrôlent mutuellement, avec des garde-fous déterministes : hooks et tests. On parlera optimisation, du code et de la facture, puis de rétro-ingénierie : transformer un mauvais résultat en meilleur prompt. Et on finira par l’atelier du programme en binômes : améliorer un code produit par IA. »

ANIMATION — Annoncer le rythme : pause vers 15:30.

TRANSITION — « D’abord, une vue d’ensemble : la pyramide de vérification. »`,
  `⏱ 3 min · PYRAMIDE (4 temps)

OBJECTIF — Structurer les méthodes d’évaluation par coût et fréquence.

DIRE — « En bas, le moins cher et le plus fréquent : le typage strict, le lint, le formatage. À chaque édition, en secondes, ça attrape les API inventées et les erreurs de types. » → clic. « Les tests unitaires, à chaque lot, tests d’abord. » → clic. « L’analyse statique de sécurité et des dépendances : injections, XSS, paquets vulnérables ou inventés. » → clic. « Les tests de bout en bout, dans plusieurs environnements. » → clic. « Et au sommet, la revue humaine : la plus chère et la plus précieuse, parce qu’elle seule répond à la question : est-ce le bon code ? Le principe : chaque étage attrape ce que l’autre rate, et on automatise tout ce qui peut l’être pour que l’humain se concentre sur l’intention. »

ANIMATION — La pyramide se construit de bas en haut.

TRANSITION — « Commençons par la méthode la plus humaine : le pair programming avec l’IA. »`,
  `⏱ 3 min · PAIR PROGRAMMING

OBJECTIF — Présenter trois formations de pair programming humain–IA (programme M6).

DIRE — « Le pair programming classique : un pilote au clavier, un navigateur qui garde le cap. Avec l’IA, trois formations. L’IA pilote, vous naviguez : l’agent écrit par lots, vous validez le plan et relisez les diffs ; idéal pour du code nouveau bien spécifié. Vous pilotez, l’IA navigue : vous codez, l’IA en mode Ask challenge vos choix, signale les cas oubliés, propose des tests ; idéal pour le code critique ou quand vous apprenez. Et le ping-pong TDD : vous écrivez un test, l’IA le fait passer, puis l’inverse. Changez souvent de formation. Et n’oubliez pas le binôme humain : deux personnes qui relisent un prompt et un diff, c’est ce qu’on fait depuis hier. »

ANIMATION — Demander quelle formation chacun utilise spontanément ; souvent, la première uniquement.

TRANSITION — « Deuxième méthode du programme : les analyses statique et dynamique. »`,
  `⏱ 4 min · STATIQUE / DYNAMIQUE (1 temps)

OBJECTIF — Situer les outils d’analyse statique et dynamique et le rôle de l’IA.

DIRE — « Analyse statique : on lit le code sans l’exécuter. Typage strict et ESLint ; SonarQube pour la qualité et la dette ; CodeQL ou Semgrep pour la sécurité ; npm audit, Dependabot et le secret scanning pour les dépendances et les secrets. » → clic. « Analyse dynamique : on exécute. Tests unitaires avec Vitest, et le mutation testing pour vérifier que vos tests détectent vraiment les erreurs ; Playwright pour les parcours ; OWASP ZAP ou du fuzzing pour la sécurité ; Lighthouse et axe pour la performance et l’accessibilité. L’IA s’insère dans la boucle : elle explique un avertissement, propose un correctif, comme Copilot Autofix. Mais c’est l’outil qui dit si c’est corrigé : on relance l’analyse. »

ANIMATION — Demander quels outils sont déjà en CI chez eux.

TRANSITION — « Troisième méthode : les tests multi-environnements. »`,
  `⏱ 4 min · EXERCICE INTERACTIF · MATRICE

OBJECTIF — Concevoir une stratégie de tests multi-environnements réaliste (programme M6).

DIRE — « Une application web tourne sur plusieurs navigateurs, plusieurs tailles d’écran, en ligne et hors ligne, dans plusieurs fuseaux horaires. Activez les dimensions. » Activer tout : « 24 combinaisons, 72 exécutions, environ 24 minutes de CI à chaque PR. Trop. » Revenir à mobile + hors ligne + Paris + UTC. « La stratégie : à chaque PR, la combinaison la plus risquée — pour FrigoMalin, mobile et hors ligne ; chaque nuit, toute la matrice. Et testez en UTC : c’est là qu’apparaissent les bugs de dates, comme le produit qui “expire” deux heures trop tôt. Playwright permet de déclarer ces combinaisons comme des projets. »

ANIMATION — Laisser un participant composer sa matrice pour son propre projet.

TRANSITION — « Ces méthodes, on va les confier en partie à une équipe d’agents. Sprint 6. »`,
  `⏱ 4 min · SPRINT 6 · ÉQUIPE (5 temps)

OBJECTIF — Présenter l’architecture lead + spécialistes et le compte rendu commun.

DIRE — « On passe d’un assistant généraliste à une équipe. Le feature-lead planifie, délègue, décide et rapporte ; il n’écrit jamais de code. » → clic. « Le developer réalise une tâche, sans élargir le périmètre. » → clic. « Le tester écrit et lance les tests, et ne touche à rien d’autre. » → clic. « Le refactorer simplifie à comportement constant, seulement quand les tests sont verts. » → clic. « Le security-reviewer audite et signale, mais ne corrige pas : il n’a que des outils de lecture. » → clic. « Tous terminent par le même compte rendu de cinq lignes : statut, fichiers, tests, points ouverts, recommandation. Le lead décide sur ce contrat, sans relire les diffs : chaque sous-agent a son propre contexte, le lead reste compact. Et celui qui audite ne corrige pas : séparation des rôles. »

ANIMATION — Les flèches se dessinent une à une.

TRANSITION — « Lab 6.1 : créer les spécialistes. »`,
  `⏱ 20 min (minuteur) · LAB 6.1

OBJECTIF — Concevoir puis créer 4 agents spécialisés aux droits limités.

DIRE — « Conception d’abord : remplissez le tableau et le format du compte rendu, faites-les valider par votre binôme, puis écrivez les quatre fichiers. Testez chaque agent seul sur une petite tâche. »

CORRIGÉ (formateur) — developer : réalise une tâche ; read, search, edit, execute ; modèle économique ; jamais changer le périmètre. tester : read, search, edit, execute ; jamais modifier hors *.test.*. refactorer : préalable npm test (KO → stop) ; jamais modifier un test ni le comportement. security-reviewer : read, search uniquement ; modèle de raisonnement ; checklist FrigoMalin (innerHTML sur données externes, import JSON validé, aucun secret, CSP intacte, dépendances auditées) ; tableau gravité/fichier/risque/correctif ; Statut BLOQUÉ dès un point bloquant ; jamais corriger lui-même. Compte rendu : Statut OK|KO|BLOQUÉ, Fichiers, Tests, Points ouverts, Recommandation.

ANIMATION — Vérifier que le security-reviewer refuse de modifier un fichier.

TRANSITION — « Les spécialistes existent. Il leur faut un chef. »`,
  `⏱ 15 min (minuteur) · LAB 6.2

OBJECTIF — Écrire un lead qui délègue et décide selon des règles explicites.

DIRE — « Le point d’attention : pour chaque statut, que décide le lead ? Et quand vous rend-il la main ? »

CORRIGÉ (formateur) — tools: read, search, todo, agent, edit ; agents: developer, tester, refactorer, security-reviewer ; modèle de raisonnement. 1) Planifier en tâches de 30 min max, présenter le plan, attendre la validation. 2) Déléguer dans l’ordre developer → tester → refactorer → security-reviewer, en transmettant la tâche seule. 3) OK : agent suivant ; KO : retour au developer avec le compte rendu du tester, pas de refactoring sur tests rouges ; BLOQUÉ : retour au developer avec les seuls points bloquants, puis re-tester et re-auditer ; 2 échecs sur la même tâche : s’arrêter et demander. 4) Rapport docs/reports/<feature>.md. Jamais : écrire hors docs/reports/, changer le périmètre, ignorer un point bloquant. Option : handoffs avec send: false pour valider chaque relais.

TRANSITION — « Lançons l’équipe sur une vraie feature. »`,
  `⏱ 20 min (minuteur) · LAB 6.3

OBJECTIF — Orchestrer une feature de bout en bout et analyser les décisions du lead.

DIRE — « Le prompt au lead dit QUOI et QUAND c’est fini ; le COMMENT est dans l’agent. Si vous redictez les étapes, c’est que votre lead est mal écrit. Validez le plan avant toute délégation, puis lisez le rapport. »

CORRIGÉ (formateur) — Feature : PWA installable et hors ligne. Périmètre : manifeste, service worker qui met l’application en cache, icônes 192 et 512 px, bannière « Vous êtes hors ligne ». Hors périmètre : synchronisation, notifications push. Contraintes : principes de copilot-instructions.md, JS initial < 200 Ko gzip, repli Open Food Facts. Fin : npm test et build passent, installable, se recharge hors ligne. Piège classique : le service worker ignore le chemin /frigomalin/ de GitHub Pages. Si l’équipe ne l’a pas vu, l’humain doit le voir.

ANIMATION — Pendant que les agents tournent, faire observer les sous-agents dans la vue Chat. Bonus 6.4 : qa-explorer via MCP Playwright.

TRANSITION — « Nos agents vont vite. Les garde-fous garantissent qu’ils vont dans la bonne direction. »`,
  `⏱ 3 min · HOOKS (1 temps) · ~15:15

OBJECTIF — Distinguer consigne probabiliste et hook déterministe.

DIRE — « “Pense à lancer le lint” : c’est une consigne. Le modèle la suit la plupart du temps, mais il peut l’oublier, surtout quand le contexte est chargé. Un hook, c’est une commande exécutée par l’outil à un moment précis, quoi que pense le modèle. » → clic. « Deux usages. Avant un outil : bloquer une commande dangereuse, comme rm -rf ou un push forcé, ou une écriture hors du dossier autorisé — par exemple, vérifier que le feature-lead n’écrit que dans docs/reports. Après un outil : formater, linter, lancer les tests ciblés, et renvoyer les erreurs au modèle. Règle d’or : un hook rapide et bien choisi. Dix hooks lents ralentissent chaque édition. »

ANIMATION — Relier à l’incident Replit : un gel exprimé en consigne n’est pas un contrôle.

TRANSITION — « Lab 8.1 : votre premier hook. »`,
  `⏱ 10 min (minuteur) · LAB 8.1 · puis pause 15:30

OBJECTIF — Créer un hook postToolUse multiplateforme.

DIRE — « Complétez le fichier, puis demandez à l’agent une modification volontairement mal formatée : le hook doit corriger sans que vous le demandiez. »

CORRIGÉ (formateur) — version: 1 ; hooks.postToolUse : type command, matcher "edit|create", bash "npm run lint:fix --silent && npx prettier --write src --log-level warn", powershell "npm run lint:fix --silent; npx prettier --write src --log-level warn", timeoutSec 60. Le nom exact de l’outil d’édition dépend de la version : le vérifier dans les journaux de debug avant d’écrire le matcher. Pour renvoyer les erreurs restantes au modèle, le hook peut écrire un JSON avec additionalContext sur sa sortie standard.

ANIMATION — Lancer le minuteur. Annoncer la pause de 15 minutes à la fin du lab.

TRANSITION — « Pause ! À la reprise : les tests par l’agent tester. »`,
  `⏱ 15 min (minuteur) · LAB 8.2 · 15:45

OBJECTIF — Faire écrire des tests stables, unitaires et E2E.

DIRE — « Reprise. Prompt à trous pour l’agent tester. Le cœur du sujet : rendre les tests stables. »

CORRIGÉ (formateur) — Fichiers : #src/domain/dates.ts et #src/domain/expiry.ts. Cas limites : ajout à 23 h 59 et consultation à 0 h 01, changements d’heure de mars et d’octobre, Europe/Paris contre UTC, 29 février, DDM dépassée contre DLC dépassée. 3 parcours Playwright : ajouter un produit puis le retrouver trié ; marquer consommé puis voir l’impact mis à jour ; passer hors ligne puis recharger sans perte ; en 360×800 et 1280×800. Règles : date figée (vi.setSystemTime, page.clock), sélecteurs getByRole / getByLabel, aucune attente fixe (waitForTimeout interdit), base IndexedDB vidée avant chaque test. Fin : npm test et npm run test:e2e, résumé en 3 lignes.

ANIMATION — Les sélecteurs par rôle testent aussi l’accessibilité. Bonus 8.3 : revue de PR par Copilot avec vos critères.

TRANSITION — « Les tests protègent le comportement. Parlons de la qualité dans la durée. »`,
  `⏱ 3 min · MAINTENABILITÉ

OBJECTIF — Identifier la dette typique du code généré et ses réponses (programme : optimisation et maintenabilité).

DIRE — « L’IA écrit plus de code, plus vite… et la dette aussi. Les analyses de GitClear sur des millions de lignes observent depuis 2024 plus de code dupliqué et moins de refactoring. Cinq symptômes. Le code dupliqué : on répond par une instruction “réutilise src/domain” et une détection de duplication en CI. Les fonctions longues : des seuils de complexité dans le lint, et l’agent refactorer. La dépendance ajoutée pour trois lignes : une règle “pas de dépendance sans le signaler” et un budget de bundle. La performance ignorée : exiger la complexité attendue et mesurer. Le nommage générique : le glossaire de PRODUCT.md. Le critère ultime : dans six mois, quelqu’un devra modifier ce code. Sinon, l’accélération d’aujourd’hui est un emprunt. »

ANIMATION — Demander quel symptôme ils voient le plus en revue.

TRANSITION — « Optimisation, toujours, mais côté facture : deux QCM rapides. »`,
  `⏱ 5 min · LAB 7.2 (QCM)

OBJECTIF — Réflexes pour garder le contexte petit.

RÉPONSES — 1 : nouvelle session, une tâche = une session. 2 : 2 ou 3 fichiers nommés avec #. 3 : règle de test concise dans tests.instructions.md ; les sorties d’outils sont le premier poste de tokens. 4 : skill réduit aux lignes utiles. 5 : /compact au bon moment, avant le compactage automatique. 6 : /fork pour explorer une variante.

DIRE — « Six situations, votez, cliquez. La technique la plus rentable, c’est presque toujours : une tâche, une session. Et pour constater l’effet, la Chat Debug View vue ce matin. »

ANIMATION — Rythme rapide ; le compteur « du premier coup » motive le groupe.

TRANSITION — « Et maintenant, la facture. »`,
  `⏱ 5 min · LAB 7.3 (QCM)

OBJECTIF — Réduire le coût sans perdre en qualité.

RÉPONSES — 1 : raisonnement pour planifier, économique ou Auto pour exécuter ; l’agent fige ce choix par rôle. 2 : désactiver les outils inutiles (Configure Tools). 3 : faire écrire un script, puis l’exécuter. 4 : modifier les instructions ou changer de modèle en cours de session casse le cache de prompt. 5 : comparer le coût de tâches réussies, pas le prix au token. 6 : survol du pied de réponse, et sélecteur de modèles.

DIRE — « Depuis juin, Copilot facture les tokens. Les plus gros gains viennent du bon modèle pour le bon rôle, et du script plutôt que la boucle dans le chat. Et on compare toujours à qualité égale : mêmes tests au vert. »

TRANSITION — « Dernière méthode du programme : la rétro-ingénierie des prompts. »`,
  `⏱ 4 min · RÉTRO-INGÉNIERIE (4 temps)

OBJECTIF — Transformer un mauvais résultat en meilleur prompt, puis en règle durable (programme M6).

DIRE — « Un résultat décevant n’est pas un échec, c’est un diagnostic. L’agent a modifié douze fichiers pour un filtre ? Il manquait une tâche bornée. Correctif durable : “uniquement…”, des lots, et une règle dans les instructions. » → clic. « Il a utilisé localStorage ? L’ADR n’était pas dans le contexte. » → clic. « Ses tests passent sur du code faux ? Les tests ont été écrits après le code : TDD. » → clic. « Il a codé les couleurs en dur ? Une convention non écrite : le skill et son script de vérification. » → clic. « Il tourne en boucle ? Pas de critère de fin : une commande de fin et une limite d’échecs. La règle : une correction répétée deux fois devient une instruction, un skill ou un hook. Votre configuration apprend. »

ANIMATION — Demander un exemple vécu dans les labs et le classer dans le tableau.

TRANSITION — « Mettons tout ça en pratique : l’atelier en binômes. »`,
  `⏱ 2 min · ATELIER BINÔMES · CONSIGNES (programme : améliorer un code produit par IA)

OBJECTIF — Lancer l’atelier en binômes.

DIRE — « En binômes, un pilote et un navigateur, on échange à mi-parcours. Cinq étapes. Caractériser : des tests qui figent le comportement actuel, même les bugs, pour ne rien casser sans le savoir. Analyser : lint strict, types, SAST. Refactorer avec l’IA, à petits pas, tests au vert. Rétro-prompt : le prompt qui aurait produit la bonne version du premier coup. Capitaliser : une règle pour vos instructions, un skill ou votre checklist de revue. »

ANIMATION — Former les binômes en mélangeant les niveaux (auto-positionnement d’hier). Lancer le minuteur de 30 minutes (à réduire à 20 si le planning a glissé).

TRANSITION — « Voici le code à améliorer. »`,
  `⏱ 25 min (atelier) + 5 min de restitution · ATELIER · CODE

OBJECTIF — Améliorer un code généré, de façon outillée et testée.

DIRE — « La fonction qui calcule les kilos et les euros sauvés. Elle marche sur l’exemple de la démo. Cherchez les problèmes, puis appliquez les cinq étapes. »

RÉPONSES — any ; double boucle O(n²) et splice pendant l’itération (des éléments sautés, et l’entrée de l’appelant modifiée) ; new Date() dans le domaine : non testable, et new Date('2026-10-11') est minuit UTC, donc 2 h à Paris : un produit consommé le jour de sa DLC n’est pas compté ; ml, L et pièce comptés comme des kg (4 yaourts = 4 kg !) ; 0.0035 nombre magique appliqué à toute unité ; euros renvoyé en texte. En restitution, cliquer « Après » : Map, today en paramètre, table de facteurs, constantes nommées, round2.

PROMPT ATTENDU — rôle ; #src/domain/types.ts, #src/domain/dates.ts ; « fonction pure, today en paramètre, aucune mutation, toutes les unités, pièce exclue, constantes nommées, tests d’abord avec cas limites de fuseau ».

TRANSITION — « Dernier QCM de l’après-midi. »`,
  `⏱ 2 min · QCM 5 · ~16:50

OBJECTIF — Vérifier la compréhension de l’orchestration.

RÉPONSES — A ✗ piège : c’est un choix d’architecture. B ✓ contexte compact et décisions fiables. C ✗ rien de confidentiel. D ✗ piège : la relecture des diffs reste le rôle de l’humain, à la revue de PR.

DIRE — « C’est la clé de toute orchestration : des agents qui travaillent dans leur propre contexte et ne remontent que l’essentiel. Et un humain qui garde la décision. »

TRANSITION — « Il est temps de mettre FrigoMalin en ligne et de faire la synthèse : module 7. »`,
];
