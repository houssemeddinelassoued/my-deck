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
import logoStack from '@assets/technologia/logo-stack.png';
import logoWide from '@assets/technologia/logo-horizontal.png';

export const design: DesignSystem = {
  palette: { bg: '#F4F7F9', text: '#2B2F33', accent: '#1F78C1' },
  fonts: {
    display: '"Barlow Condensed", "Arial Narrow", "Segoe UI", sans-serif',
    body: '"Barlow", "Segoe UI", system-ui, -apple-system, sans-serif',
  },
  typeScale: { hero: 128, body: 30 },
  radius: 18,
};

// ─── Webfonts (module-level, slide-keyed) ───────────────────────────────────
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Barlow+Condensed:wght@500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap';
const FONT_LINK_ID = 'osd-webfont-ia-gestion-de-projet';
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
const SLIDE_ID = 'ia-gestion-de-projet';
const P = 'gp'; // CSS class prefix, unique per deck
const DAY: number = 1;
// Combined 2-day deck: pages after DAY_SPLIT belong to day 2 (0 = single-day deck).
const DAY_SPLIT: number = 65;
const useDay = (): number => {
  const { current } = useSlidePageNumber();
  return DAY_SPLIT > 0 && current > DAY_SPLIT ? 2 : DAY;
};
const COURSE = 'IA appliquée à la gestion de projet';
const AUTHOR = 'Houssem Eddine Lassoued';

const MOD_TITLES: Record<number, string> = {
  1: 'Introduction à l’IA',
  2: 'L’IA dans la gestion de projet',
  3: 'Atelier 1 · Plan projet avec l’IA',
  4: 'Automatiser et collaborer',
  5: 'Limites, éthique et adoption',
  6: 'Atelier 2 · Mini-projet',
};
// Module 0 = ouverture / réactivation, module 9 = clôture.
const LAST_MOD = 6;

// ─── Palette (Technologia: anthracite + blue/teal, green, yellow squares) ───
const C = {
  ink: '#2B2F33',
  soft: '#4B545B',
  muted: '#77818A',
  faint: '#AFB8C0',
  rule: '#DCE3E8',
  panel: '#EAF0F4',
  card: '#FFFFFF',
  blue: '#1F78C1',
  teal: '#22A6B3',
  green: '#3A9F45',
  yellow: '#FFD000',
  amber: '#E8A600',
  coral: '#E0573D',
  violet: '#6B57C9',
};

const T = {
  blue: { bg: '#E4F0FA', bd: '#93C1E8', fg: '#1A65A3' },
  teal: { bg: '#DFF3F5', bd: '#86D0D6', fg: '#137C87' },
  green: { bg: '#E4F3E3', bd: '#95CD93', fg: '#2B7A33' },
  yellow: { bg: '#FFF5CC', bd: '#F0CB45', fg: '#7D6000' },
  coral: { bg: '#FCE7E2', bd: '#EFA593', fg: '#B3432B' },
  violet: { bg: '#ECE8F9', bd: '#B6A9E6', fg: '#5644A6' },
  grey: { bg: '#EEF2F5', bd: '#CBD4DB', fg: '#4B545B' },
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
  blue: 'linear-gradient(135deg, #2A74BF 0%, #3D9FCB 55%, #6CCBD0 100%)',
  green: 'linear-gradient(135deg, #0F9A4A 0%, #47A83F 60%, #7DB83A 100%)',
  yellow: 'linear-gradient(135deg, #FFE24D 0%, #FFD000 55%, #F4B400 100%)',
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
  return (
    <span
      style={{
        width: 34,
        height: 34,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: display,
        fontWeight: 700,
        fontSize: 18,
        background: now ? C.blue : past ? '#D3E6F5' : 'transparent',
        color: now ? '#fff' : past ? C.blue : C.faint,
        boxShadow: now || past ? 'none' : `inset 0 0 0 2px ${C.rule}`,
      }}
    >
      {pad(n)}
    </span>
  );
};

const Progress = ({ mod }: { mod: number }) => {
  const day = useDay();
  return (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <span
      style={{
        fontFamily: display,
        fontWeight: 600,
        fontSize: 20,
        letterSpacing: '0.14em',
        color: C.muted,
        marginRight: 10,
      }}
    >
      JOUR {day}
    </span>
    {day === 1 ? (
      <>
        <ProgSq n={1} mod={mod} />
        <ProgSq n={2} mod={mod} />
        <ProgSq n={3} mod={mod} />
      </>
    ) : (
      <>
        <ProgSq n={4} mod={mod} />
        <ProgSq n={5} mod={mod} />
        <ProgSq n={6} mod={mod} />
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
        <img src={logoWide} alt="Technologia" style={{ height: 40, display: 'block', mixBlendMode: 'multiply' }} />
        <span style={{ width: 1.5, height: 26, background: C.rule }} />
        <span style={{ fontSize: 20, fontWeight: 600, color: C.soft }}>{AUTHOR}</span>
        <span style={{ width: 1.5, height: 26, background: C.rule }} />
        <span style={{ fontSize: 20, color: C.muted }}>{COURSE} · IA124</span>
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
                  <Num n={1} tone="violet" size={36} /> Votez dans le clavardage : A, B, C ou D.
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
  const day = useDay();
  return (
    <span style={{ position: 'absolute', right: 120, bottom: 48, fontFamily: mono, fontSize: 20, color: C.muted }}>
      Jour {day} · {pad(current)} / {pad(total)}
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
};
type AppId = keyof typeof APPS;

const AppTile = ({ id, size = 44, cls, style }: { id: AppId; size?: number; cls?: string; style?: CSSProperties }) => (
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

// ─── Fil rouge : Vélo Fleuve inc. et le projet Limoilou (fictifs) ───────────
const CAST = {
  karim: { name: 'Karim', role: 'Chargé de projet', tone: 'blue' as Tone, icon: 'target' as IconName },
  luc: { name: 'Luc', role: 'Directeur des opérations', tone: 'teal' as Tone, icon: 'org' as IconName },
  julie: { name: 'Julie', role: 'Conseillère RH', tone: 'green' as Tone, icon: 'users' as IconName },
  maxime: { name: 'Maxime', role: 'Responsable marketing', tone: 'yellow' as Tone, icon: 'megaphone' as IconName },
  annie: { name: 'Annie', role: 'Analyste TI', tone: 'violet' as Tone, icon: 'server' as IconName },
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
    <Icon name="bike" size={22} sw={2.2} /> Fil rouge · {children}
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
// A project schedule draws itself; the AI tile floats over it.
const CovBar = ({ label, x, w, row, tone, d }: { label: string; x: number; w: number; row: number; tone: Tone; d: number }) => (
  <>
    <div
      className={A.fade}
      style={{ position: 'absolute', left: 28, top: 92 + row * 74, width: 170, fontSize: 21, fontWeight: 600, color: C.soft, lineHeight: '40px', ...dl(d - 200) }}
    >
      {label}
    </div>
    <div
      className={A.grow}
      style={{ position: 'absolute', left: 210 + x, top: 92 + row * 74, width: w, height: 40, borderRadius: 8, background: STRONG[tone], ...dl(d) }}
    />
  </>
);

const GP_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <img src={logoStack} alt="Technologia" className={A.fade} style={{ position: 'absolute', left: 112, top: 78, height: 150, display: 'block' }} />
    <div style={{ position: 'absolute', left: 120, top: 318, width: 960 }}>
      <Eyebrow cls={A.in} size={28}>
        Formation IA124 · 2 jours
      </Eyebrow>
      <h1
        className={A.in}
        style={{ margin: '18px 0 0', fontFamily: display, fontWeight: 700, fontSize: 118, lineHeight: 1.0, letterSpacing: '-0.01em', color: C.ink, ...dl(120) }}
      >
        IA appliquée à la
        <br />
        gestion de projet
      </h1>
      <p className={A.in} style={{ margin: '26px 0 0', fontSize: 36, lineHeight: 1.3, color: C.soft, ...dl(240) }}>
        Utiliser l’intelligence artificielle pour planifier, suivre et automatiser efficacement les projets
      </p>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 870, display: 'flex', alignItems: 'center', gap: 22, ...dl(520) }}>
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

    <Squares s={250} x={1470} y={640} delay={200} />
    <div
      className={A.in}
      style={{ position: 'absolute', left: 1130, top: 250, width: 680, height: 560, background: C.card, borderRadius: 22, boxShadow: SHADOW, ...dl(300) }}
    >
      <div style={{ position: 'absolute', left: 28, top: 26, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon name="gantt" size={30} color={C.blue} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 26, letterSpacing: '0.08em', color: C.ink }}>PLAN DE PROJET</span>
      </div>
      <CovBar label="Cadrage" x={0} w={110} row={0} tone="blue" d={700} />
      <CovBar label="Planification" x={70} w={160} row={1} tone="teal" d={900} />
      <CovBar label="Exécution" x={180} w={230} row={2} tone="green" d={1100} />
      <CovBar label="Suivi" x={150} w={290} row={3} tone="violet" d={1300} />
      <CovBar label="Communication" x={30} w={390} row={4} tone="yellow" d={1500} />
      <div className={A.fade} style={{ position: 'absolute', left: 28, top: 462, fontSize: 21, fontWeight: 600, color: C.coral, lineHeight: '40px', ...dl(1700) }}>
        Ouverture
      </div>
      <div style={{ position: 'absolute', left: 622, top: 469, width: 26, height: 26, transform: 'rotate(45deg)' }}>
        <div className={A.pop} style={{ width: 26, height: 26, background: C.coral, ...dl(1800) }} />
      </div>
    </div>
    <div className={A.float} style={{ position: 'absolute', left: 1075, top: 745, width: 150, height: 150 }}>
      <div
        className={A.pop}
        style={{ width: 150, height: 150, borderRadius: 32, background: C.card, boxShadow: '0 30px 60px -28px rgba(20,60,100,.55), 0 0 0 1px rgba(0,0,0,.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...dl(1900) }}
      >
        <Icon name="sparkles" size={84} color={C.blue} sw={1.8} />
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

const GP_Trainer: Page = () => (
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
        Mes engagements pour ces 2 jours
      </Eyebrow>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Pledge icon="bulb" tone="blue" d={500}>
          De l’IA expliquée simplement, sans jargon ni équations
        </Pledge>
        <Pledge icon="tool" tone="teal" d={640}>
          Des outils que vous avez déjà (ou presque), testés en direct
        </Pledge>
        <Pledge icon="note" tone="green" d={780}>
          Des modèles de demandes (prompts) prêts à réutiliser lundi
        </Pledge>
        <Pledge icon="shieldCheck" tone="yellow" d={920}>
          Un regard lucide : ce que l’IA fait bien… et ce qu’elle rate
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

const GP_Roundtable: Page = () => (
  <Frame mod={0} label="Ouverture · Faisons connaissance">
    <Title>Tour de table</Title>
    <Lede>Une minute par personne, micro ouvert, trois questions. Puis un sondage éclair dans le clavardage.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 800, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AskCard n={1} title="Qui êtes-vous ?" sub="Prénom, rôle, service (RH, marketing, TI…)" d={100} />
      <AskCard n={2} title="Quel projet menez-vous en ce moment ?" sub="Une phrase : son objectif et son échéance" d={220} />
      <AskCard n={3} title="Qu’est-ce qui vous prend le plus de temps ?" sub="Planifier, relancer, rédiger, faire des rapports…" d={340} />
    </div>
    <Timer id="tour" minutes={15} label="Tour de table" compact cls={A.in} style={{ position: 'absolute', left: 120, top: 770, ...dl(460) }} />
    <div style={{ position: 'absolute', left: 990, top: 290, width: 810 }}>
      <Eyebrow cls={A.in} c={C.violet} style={dl(200)}>
        Sondage éclair · votre usage de l’IA
      </Eyebrow>
      <Hint cls={A.in} style={{ marginTop: 8, ...dl(260) }}>
        Répondez dans le clavardage par le numéro de la ligne
      </Hint>
      <Poll cls={A.in} style={{ marginTop: 22, ...dl(360) }}>
        <PollRow id="none" icon="eye" tone="grey" label="1 · Je ne l’ai jamais vraiment essayée" />
        <PollRow id="perso" icon="smile" tone="blue" label="2 · Je l’utilise à titre personnel" />
        <PollRow id="work" icon="chat" tone="teal" label="3 · Je l’utilise parfois au travail" />
        <PollRow id="project" icon="kanban" tone="green" label="4 · Je l’utilise déjà dans mes projets" />
        <PollRow id="team" icon="users" tone="violet" label="5 · Mon équipe a des règles d’usage" />
      </Poll>
    </div>
  </Frame>
);

// ─── Objectives: a rising staircase ─────────────────────────────────────────
const ObjStep = ({ i, h, tone, verb, day, children }: { i: number; h: number; tone: Tone; verb: string; day: number; children: ReactNode }) => (
  <div style={{ position: 'absolute', left: 120 + (i - 1) * 336, top: 960 - h, width: 316, height: h }}>
    <div className={A.growY} style={{ position: 'absolute', inset: 0, borderRadius: 18, background: C.card, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, ...dl(i * 120) }} />
    <div className={A.in} style={{ position: 'relative', padding: '34px 26px 0', ...dl(420 + i * 140) }}>
      <Num n={i} tone={tone} size={52} />
      <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 40, lineHeight: 1.05, letterSpacing: '0.03em', color: C.ink }}>{verb}</div>
      <div style={{ marginTop: 10, fontSize: 25, lineHeight: 1.38, color: C.soft }}>{children}</div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 26, bottom: 24, ...dl(600 + i * 140) }}>
      <Tag tone={day === 1 ? 'blue' : 'green'} size={20}>
        Jour {day}
      </Tag>
    </div>
  </div>
);

const GP_Objectives: Page = () => (
  <Frame mod={0}>
    <Title>Ce que vous saurez faire</Title>
    <Lede>À la fin des 2 jours, vous serez capable de…</Lede>
    <ObjStep i={1} h={400} tone="blue" verb="COMPRENDRE" day={1}>
      Les usages concrets de l’IA pour planifier, suivre et communiquer
    </ObjStep>
    <ObjStep i={2} h={450} tone="teal" verb="UTILISER" day={1}>
      Les outils génériques et intégrés pour générer un plan de projet
    </ObjStep>
    <ObjStep i={3} h={500} tone="green" verb="AUTOMATISER" day={2}>
      Comptes rendus, résumés de réunions et suivi des tâches
    </ObjStep>
    <ObjStep i={4} h={550} tone="yellow" verb="COLLABORER" day={2}>
      Mettre en place des pratiques d’équipe efficaces avec l’IA
    </ObjStep>
    <ObjStep i={5} h={600} tone="coral" verb="MAÎTRISER" day={2}>
      Les limites, les risques et les enjeux éthiques de l’IA
    </ObjStep>
  </Frame>
);

// ─── Programme ──────────────────────────────────────────────────────────────
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
    <span style={{ fontSize: 28, fontWeight: 500, color: C.ink }}>{children}</span>
  </div>
);

const ProgBreak = ({ t, d, children }: { t: string; d: number; children: ReactNode }) => (
  <div className={A.fade} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 30, ...dl(d) }}>
    <span style={{ width: 80, fontFamily: mono, fontSize: 19, color: C.faint }}>{t}</span>
    <span style={{ width: 40, height: 2, background: C.rule }} />
    <span style={{ fontSize: 22, fontStyle: 'italic', color: C.muted }}>{children}</span>
  </div>
);

const DayCol = ({ x, day, sub, now, children }: { x: number; day: number; sub: string; now: boolean; children: ReactNode }) => (
  <div
    className={A.in}
    style={{
      position: 'absolute',
      left: x,
      top: 240,
      width: 816,
      boxSizing: 'border-box',
      padding: '26px 36px 24px',
      background: C.card,
      borderRadius: 'var(--osd-radius)',
      boxShadow: now ? `0 0 0 3px ${C.blue}, ${SHADOW}` : SHADOW,
      ...dl(day === 1 ? 0 : 150),
    }}
  >
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 14 }}>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 46, color: now ? C.blue : C.ink }}>Jour {day}</span>
      <span style={{ fontSize: 26, color: C.muted }}>{sub}</span>
      {now ? (
        <Tag tone="blue" size={20} style={{ marginLeft: 'auto' }}>
          Aujourd’hui
        </Tag>
      ) : null}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{children}</div>
  </div>
);

const ProgramCols = ({ today }: { today: number }) => (
  <>
    <DayCol x={120} day={1} sub="Comprendre et planifier" now={today === 1}>
      <ProgRow t="9:00" icon="users" d={150}>
        Accueil et tour de table
      </ProgRow>
      <ProgRow t="9:30" n={1} d={210}>
        Introduction à l’intelligence artificielle
      </ProgRow>
      <ProgBreak t="10:30" d={270}>
        Pause
      </ProgBreak>
      <ProgRow t="11:15" n={2} d={330}>
        L’IA dans la gestion de projet
      </ProgRow>
      <ProgBreak t="12:00" d={390}>
        Dîner
      </ProgBreak>
      <ProgRow t="13:00" n={2} d={450}>
        Outils du quotidien et bonnes demandes
      </ProgRow>
      <ProgRow t="13:45" n={3} tone="yellow" d={510}>
        Atelier 1 · générer un plan de projet
      </ProgRow>
      <ProgBreak t="14:30" d={570}>
        Pause
      </ProgBreak>
      <ProgRow t="15:40" icon="star" d={630}>
        Bilan du jour 1
      </ProgRow>
      <ProgBreak t="16:00" d={690}>
        Fin de la journée
      </ProgBreak>
    </DayCol>
    <DayCol x={984} day={2} sub="Automatiser et adopter" now={today === 2}>
      <ProgRow t="9:00" icon="loop" d={300}>
        Réactivation
      </ProgRow>
      <ProgRow t="9:15" n={4} d={360}>
        Automatiser et collaborer avec l’IA
      </ProgRow>
      <ProgBreak t="10:30" d={420}>
        Pause
      </ProgBreak>
      <ProgRow t="10:45" n={5} d={480}>
        Limites, éthique et adoption
      </ProgRow>
      <ProgBreak t="12:00" d={540}>
        Dîner
      </ProgBreak>
      <ProgRow t="13:00" n={6} tone="yellow" d={600}>
        Atelier 2 · mini-projet avec l’IA
      </ProgRow>
      <ProgBreak t="14:30" d={660}>
        Pause
      </ProgBreak>
      <ProgRow t="14:45" n={6} tone="yellow" d={720}>
        Présentations et rétroaction
      </ProgRow>
      <ProgRow t="15:40" icon="flag" d={780}>
        Plan d’action et clôture
      </ProgRow>
      <ProgBreak t="16:00" d={840}>
        Fin de la formation
      </ProgBreak>
    </DayCol>
  </>
);

const GP_Program: Page = () => (
  <Frame mod={0}>
    <Title>Programme des 2 jours</Title>
    <ProgramCols today={1} />
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

const GP_HowWeWork: Page = () => (
  <Frame mod={0}>
    <Title>Comment nous allons travailler</Title>
    <Lede>Une formation active : on essaie, on compare, on se trompe… et on comprend.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 40 }}>
      <ActCard kind="qcm" icon="check" title="Cliquez, vérifiez" d={100}>
        Rétroaction immédiate. Les pièges sont voulus : c’est là qu’on apprend.
      </ActCard>
      <ActCard kind="exercice" icon="hand" title="Manipulez" d={220}>
        Cartes à retourner, éléments à glisser, simulateurs à l’écran.
      </ActCard>
      <ActCard kind="demo" icon="play" title="Observez" d={340}>
        Des démonstrations en partage d’écran, avec de vraies demandes.
      </ActCard>
      <ActCard kind="atelier" icon="users" title="Pratiquez" d={460}>
        Deux ateliers individuels, guidés pas à pas, avec un livrable.
      </ActCard>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 740, width: 1680, display: 'flex', gap: 24 }}>
      <RuleChip icon="chat" d={600}>
        Questions dans le clavardage, à tout moment
      </RuleChip>
      <RuleChip icon="lock" d={700}>
        Aucune donnée confidentielle dans les outils
      </RuleChip>
      <RuleChip icon="bike" d={800}>
        Fil rouge : Vélo Fleuve inc.
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
      Caméra si possible, micro coupé hors échanges, clavardage ouvert. Idéal : deux écrans, la formation et l’outil d’IA.
    </Callout>
  </Frame>
);

// ─── Running case: Vélo Fleuve inc. ─────────────────────────────────────────
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
    <div style={{ width: 420, flex: 'none' }}>
      <Who id={id} size={28} />
    </div>
    <div style={{ fontSize: 24, lineHeight: 1.35, color: C.soft }}>{children}</div>
  </div>
);

const GP_Velo: Page = () => (
  <Frame mod={0} kind="cas" label="Ouverture · Fil rouge">
    <Title>Notre fil rouge : Vélo Fleuve inc.</Title>
    <Lede>Une entreprise fictive aux chiffres réalistes. Nous la retrouverons dans chaque module.</Lede>
    <div
      className={A.left}
      style={{ position: 'absolute', left: 120, top: 290, width: 540, height: 650, boxSizing: 'border-box', padding: '30px 32px', background: C.card, borderRadius: 'var(--osd-radius)', boxShadow: `${SHADOW}, inset 0 8px 0 ${C.teal}`, display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <IconTile name="bike" tone="teal" size={76} solid />
        <div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 40, lineHeight: 1.05, color: C.ink }}>Vélo Fleuve inc.</div>
          <div style={{ fontSize: 22, color: C.muted }}>Vélos électriques · Lévis</div>
        </div>
      </div>
      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Fact icon="users">180 employés</Fact>
        <Fact icon="store">3 boutiques-ateliers</Fact>
        <Fact icon="map">Lévis, Sherbrooke, Trois-Rivières</Fact>
        <Fact icon="trend">Ventes en hausse de 30 %</Fact>
      </div>
      <Callout title="Le projet" icon="flag" tone="yellow" size={25} style={{ marginTop: 'auto', padding: '16px 22px' }}>
        Ouvrir une 4ᵉ boutique-atelier à Québec, dans Limoilou, au printemps.
      </Callout>
    </div>
    <div style={{ position: 'absolute', left: 700, top: 290, width: 1100, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <CastCard id="karim" d={200}>
        Premier grand projet. Vient de l’atelier, pas de la gestion de projet.
      </CastCard>
      <CastCard id="luc" d={320}>
        Veut une ouverture à la date prévue et un budget tenu.
      </CastCard>
      <CastCard id="julie" d={440}>
        Doit recruter et former 8 personnes pour la boutique.
      </CastCard>
      <CastCard id="maxime" d={560}>
        Prépare la campagne locale et la journée portes ouvertes.
      </CastCard>
      <CastCard id="annie" d={680}>
        Installe la caisse, l’inventaire, le Wi-Fi et la prise de rendez-vous.
      </CastCard>
    </div>
  </Frame>
);

// ─── The project brief ──────────────────────────────────────────────────────
const KeyNum = ({ value, label, tone, d }: { value: ReactNode; label: string; tone: Tone; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 'var(--osd-radius)', boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '30px 30px 24px', ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 700, fontSize: 72, lineHeight: 1, color: tone === 'yellow' ? C.amber : STRONG[tone] }}>{value}</div>
    <div style={{ marginTop: 10, fontSize: 25, lineHeight: 1.35, color: C.soft }}>{label}</div>
  </div>
);

const Pain = ({ icon, d, children }: { icon: IconName; d: number; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, ...dl(d) }}>
    <IconTile name={icon} tone="coral" size={56} />
    <span style={{ fontSize: 27, lineHeight: 1.35, color: C.ink }}>{children}</span>
  </div>
);

const GP_Brief: Page = () => (
  <Frame mod={0} kind="cas" label="Ouverture · Fil rouge">
    <Title>Le projet Limoilou en quatre chiffres</Title>
    <Lede>Karim a reçu le mandat lundi. Il a beaucoup à organiser… et peu de temps pour le faire.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 28 }}>
      <KeyNum value="22 sem." label="pour ouvrir, le samedi 10 avril" tone="blue" d={100} />
      <KeyNum value="420 k$" label="de budget, travaux compris" tone="green" d={220} />
      <KeyNum value="5" label="services impliqués dans l’équipe" tone="yellow" d={340} />
      <KeyNum value="8" label="embauches avant l’ouverture" tone="violet" d={460} />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 560, width: 1000 }}>
      <Eyebrow cls={A.in} c={C.coral} style={dl(560)}>
        Ce qui inquiète Karim
      </Eyebrow>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Pain icon="calendar" d={640}>
          Bâtir un échéancier réaliste à partir de zéro
        </Pain>
        <Pain icon="chat" d={760}>
          Une réunion de suivi par semaine… et ses comptes rendus
        </Pain>
        <Pain icon="bell" d={880}>
          Savoir à temps ce qui glisse, sans relancer tout le monde
        </Pain>
        <Pain icon="mail" d={1000}>
          Informer Luc, l’équipe et les fournisseurs, chacun à sa façon
        </Pain>
      </div>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1200, top: 560, width: 600, ...dl(1100) }}>
      <Callout title="Notre question pour 2 jours" icon="sparkles" tone="blue" size={28} style={{ padding: '26px 30px' }}>
        Où l’IA peut-elle faire gagner du temps à Karim, sans lui faire perdre le contrôle de son projet ?
      </Callout>
    </div>
  </Frame>
);

// ─── Warm-up quiz (multi-answer) ────────────────────────────────────────────
const GP_Quiz0: Page = () => (
  <Frame mod={0} kind="qcm" beats={2} label="Ouverture · Point de départ">
    <Title>
      <span style={{ color: C.violet }}>Quiz éclair</span> · Vos intuitions de départ
    </Title>
    <Qcm
      multi
      q="Pour Karim, que peut faire l’IA dès aujourd’hui ?"
      explain="L’IA accélère la préparation : plans, comptes rendus, rapports. Mais elle ne connaît ni le contexte réel ni les engagements pris. Karim reste responsable de ce qui sort : c’est le fil de ces 2 jours."
    >
      <Opt ok why="Oui : à partir d’un bon brief, un assistant produit en une minute une première découpe des tâches que Karim va ensuite corriger.">
        Proposer une première liste de tâches pour le projet
      </Opt>
      <Opt why="Piège ! L’IA ne sait pas ce que l’entrepreneur ou le fournisseur ont promis. Elle propose des durées plausibles, pas des engagements.">
        Garantir que l’échéancier proposé sera respecté
      </Opt>
      <Opt ok why="Oui : à partir d’une transcription ou de notes, elle sépare décisions, actions et points ouverts. Karim relit avant d’envoyer.">
        Rédiger le compte rendu de la réunion de suivi
      </Opt>
      <Opt why="Piège ! Une décision de budget engage l’organisation : elle reste humaine. L’IA peut préparer les options, pas trancher.">
        Décider seule de couper 30 000 $ dans le budget
      </Opt>
    </Qcm>
  </Frame>
);

// ─── Module 1 divider ───────────────────────────────────────────────────────
const M1_Divider: Page = () => (
  <Section n={1} title="Introduction à l’intelligence artificielle" sub="Ce que c’est, ce que ce n’est pas, et où vous la croisez déjà." dur="≈ 1 h 30">
    <SecItem n={1}>Qu’est-ce que l’IA ? Définitions et exemples</SecItem>
    <SecItem n={2}>Comment une machine apprend, comment un LLM écrit</SecItem>
    <SecItem n={3}>IA, automatisation ou robotisation ?</SecItem>
    <SecItem n={4}>Panorama des usages, au quotidien et en entreprise</SecItem>
  </Section>
);
M1_Divider.transition = BLOOM;

// ═══ 10-m1 ═════════════════════════════════════════════════════════════

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
      <Quote by="Définition simple, pour ces deux jours">
        Des programmes capables de faire des tâches qui demandaient jusqu’ici l’<Hl>intelligence humaine</Hl>.
      </Quote>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 470, width: 1680, display: 'flex', gap: 28 }}>
      <M1Cap n={1} icon="eye" tone="blue" verb="PERCEVOIR" ex="Ex. : transcrire une réunion">
        Voir une image, entendre une voix
      </M1Cap>
      <M1Cap n={2} icon="book" tone="teal" verb="COMPRENDRE" ex="Ex. : résumer 40 courriels">
        Lire un texte et en saisir le sens
      </M1Cap>
      <M1Cap n={3} icon="trend" tone="green" verb="PRÉDIRE" ex="Ex. : repérer une tâche qui va glisser">
        Anticiper à partir du passé
      </M1Cap>
      <M1Cap n={4} icon="sparkles" tone="violet" verb="GÉNÉRER" ex="Ex. : rédiger un plan de projet">
        Produire un texte, une image, un plan
      </M1Cap>
    </div>
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
        <Icon name="alert" size={28} /> « Livraison gratuite de vos vélos » → bloqué à tort
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
      Revers de la médaille : le modèle apprend aussi les <b>erreurs et les biais</b> de ses exemples (module 5).
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

// ─── M1 · Three families ────────────────────────────────────────────────────
const M1Fam = ({ n, icon, tone, name, what, ex, pm }: { n: number; icon: IconName; tone: Tone; name: string; what: string; ex: string; pm: string }) => (
  <div className={b.on(n)} style={{ flex: 1 }}>
    <div style={{ boxSizing: 'border-box', height: 620, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '34px 32px', display: 'flex', flexDirection: 'column' }}>
      <IconTile name={icon} tone={tone} size={84} solid />
      <div style={{ marginTop: 22, fontFamily: display, fontWeight: 700, fontSize: 44, lineHeight: 1.05, color: C.ink }}>{name}</div>
      <div style={{ marginTop: 12, fontSize: 27, lineHeight: 1.4, color: C.soft }}>{what}</div>
      <div style={{ marginTop: 22, fontSize: 24, lineHeight: 1.4, color: C.ink }}>
        <b>Au quotidien :</b> {ex}
      </div>
      <div style={{ marginTop: 'auto', fontSize: 24, lineHeight: 1.4, color: T[tone].fg, background: T[tone].bg, borderRadius: 12, padding: '14px 18px' }}>
        <b>En projet :</b> {pm}
      </div>
    </div>
  </div>
);

const M1_Families: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>Trois grandes familles d’IA</Title>
    <Lede>Toutes apprennent à partir d’exemples. Elles diffèrent par ce qu’elles produisent.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 30 }}>
      <M1Fam n={1} icon="trend" tone="green" name="L’IA qui prédit" what="Elle classe, estime, anticipe." ex="filtre anti-pourriel, détection de fraude bancaire." pm="estimer une durée, signaler une tâche à risque." />
      <M1Fam n={2} icon="eye" tone="teal" name="L’IA qui perçoit" what="Elle voit et entend." ex="reconnaissance du visage, dictée vocale." pm="transcrire une réunion, lire une facture numérisée." />
      <M1Fam n={3} icon="sparkles" tone="violet" name="L’IA qui génère" what="Elle produit du nouveau contenu." ex="ChatGPT, Gemini, Copilot, Claude." pm="rédiger un plan, un compte rendu, un courriel." />
    </div>
  </Frame>
);

// ─── M1 · How an LLM writes: one word at a time (interactive) ───────────────
type M1Cand = { w: string; p: number };
const M1_SEQ: { pick: string; cands: M1Cand[] }[] = [
  { pick: ' lundi', cands: [{ w: 'lundi', p: 38 }, { w: 'demain', p: 31 }, { w: 'jeudi', p: 17 }, { w: 'une date', p: 9 }] },
  { pick: ' prochain', cands: [{ w: 'prochain', p: 46 }, { w: 'matin', p: 29 }, { w: '10 h', p: 12 }, { w: 'midi', p: 8 }] },
  { pick: ',', cands: [{ w: ',', p: 44 }, { w: 'à', p: 30 }, { w: '.', p: 18 }, { w: 'en', p: 5 }] },
  { pick: ' car', cands: [{ w: 'car', p: 35 }, { w: 'en', p: 33 }, { w: 'afin', p: 14 }, { w: 'dans', p: 9 }] },
  { pick: ' le', cands: [{ w: 'le', p: 40 }, { w: 'l’', p: 27 }, { w: 'plusieurs', p: 15 }, { w: 'Luc', p: 6 }] },
  { pick: ' fournisseur', cands: [{ w: 'fournisseur', p: 34 }, { w: 'local', p: 21 }, { w: 'chantier', p: 19 }, { w: 'budget', p: 11 }] },
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
          La réunion de suivi du projet est reportée à<span style={{ color: C.blue, fontWeight: 600 }}>{text}</span>
          <span className={A.blink} style={{ display: 'inline-block', width: 4, height: 40, marginLeft: 4, verticalAlign: '-6px', background: C.blue }} />
        </div>
        <Eyebrow c={C.muted} size={22} style={{ marginTop: 18 }}>
          {done ? 'Phrase terminée' : 'Mots candidats et probabilités'}
        </Eyebrow>
        <div style={{ marginTop: 12, minHeight: 250 }}>
          {done ? (
            <div style={{ fontSize: 28, lineHeight: 1.45, color: C.soft }}>
              Fluide, plausible… mais <b>personne n’a dit</b> que le fournisseur était en cause. Le modèle a choisi ce qui « sonne bien ».
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
    <Lede>Karim demande une durée de travaux. La réponse est claire, précise… et en partie inventée.</Lede>
    <PromptBox cls={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 960, ...dl(100) }}>
      Combien de temps durent en moyenne les travaux d’aménagement d’une boutique de 250 m² à Québec ?
    </PromptBox>
    <AnswerBox cls={A.in} size={27} style={{ position: 'absolute', left: 120, top: 470, width: 960, ...dl(300) }}>
      Comptez en moyenne <span className={k('m1fl1')}>11,4 semaines</span>, selon{' '}
      <span className={k('m1fl2')}>l’étude 2023 de l’Observatoire québécois des chantiers commerciaux</span>. Prévoyez aussi{' '}
      <span className={k('m1fl3')}>2 semaines pour le permis</span> de la Ville de Québec.
    </AnswerBox>
    <div style={{ position: 'absolute', left: 1140, top: 280, width: 660, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M1Why n={1} title="Une fausse précision">
        « 11,4 » sonne scientifique. Rien ne dit d’où vient ce chiffre.
      </M1Why>
      <M1Why n={2} title="Une source introuvable">
        L’IA a produit un nom plausible. Cette étude n’existe pas.
      </M1Why>
      <M1Why n={3} title="Un délai à vérifier">
        Peut-être juste, peut-être pas : seule la Ville le sait.
      </M1Why>
    </div>
    <Callout cls={b.on(4)} title="Ça s’appelle une hallucination" tone="coral" icon="alert" style={{ position: 'absolute', left: 120, top: 790, width: 1680 }}>
      Le modèle comble les trous avec du vraisemblable. Plus la question est précise, plus il faut vérifier.
    </Callout>
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

const M1_History: Page = () => (
  <Frame mod={1}>
    <Title>70 ans d’IA… et une accélération récente</Title>
    <Lede>Ce qui a changé en 2022 : l’IA est devenue accessible à tous, en français, sans programmer.</Lede>
    <div className={A.grow} style={{ position: 'absolute', left: 120, top: 597, width: 1680, height: 6, background: C.rule, ...dl(100) }} />
    <M1Year x={270} i={0} year="1956" up>
      Le terme « intelligence artificielle » est créé.
    </M1Year>
    <M1Year x={467} i={1} year="1997" up={false}>
      Deep Blue bat Kasparov aux échecs.
    </M1Year>
    <M1Year x={664} i={2} year="2011" up>
      Siri arrive dans nos téléphones.
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
    <M1Year x={1650} i={7} year="2023 +" up={false}>
      L’IA entre dans Outlook, Teams, Notion…
    </M1Year>
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
    <Lede>Votez dans le clavardage : « IA » ou « pas IA » ? Puis on retourne la carte.</Lede>
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

// ─── M1 · AI vs automation vs robotics ──────────────────────────────────────
const M1Word = ({ d, icon, tone, name, meta, def, ex }: { d: number; icon: IconName; tone: Tone; name: string; meta: string; def: ReactNode; ex: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 640, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '32px 32px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <IconTile name={icon} tone={tone} size={84} solid />
        <div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 44, lineHeight: 1.05, color: C.ink }}>{name}</div>
          <Tag tone={tone} size={20} style={{ marginTop: 6 }}>
            {meta}
          </Tag>
        </div>
      </div>
      <div style={{ marginTop: 26, fontSize: 28, lineHeight: 1.42, color: C.ink }}>{def}</div>
      <div style={{ marginTop: 'auto', background: T[tone].bg, borderRadius: 12, padding: '16px 20px', fontSize: 24, lineHeight: 1.4, color: C.ink }}>
        <Eyebrow c={T[tone].fg} size={19}>
          Exemple projet
        </Eyebrow>
        <div style={{ marginTop: 4 }}>{ex}</div>
      </div>
    </div>
  </div>
);

const M1_ThreeWords: Page = () => (
  <Frame mod={1}>
    <Title>IA, automatisation, robotisation : trois mots souvent confondus</Title>
    <div style={{ position: 'absolute', left: 120, top: 230, width: 1680, display: 'flex', gap: 30 }}>
      <M1Word
        d={100}
        icon="gear"
        tone="grey"
        name="Automatisation"
        meta="La recette suivie à la lettre"
        def={
          <>
            Exécute des règles fixes : <b>« si… alors… »</b>. Toujours le même résultat.
          </>
        }
        ex="Quand une tâche passe en retard, un courriel part au responsable."
      />
      <M1Word
        d={250}
        icon="arm"
        tone="teal"
        name="Robotisation"
        meta="La main qui exécute"
        def={
          <>
            Un robot <b>physique</b> (bras d’usine) ou <b>logiciel</b> (RPA) qui refait les clics d’un humain.
          </>
        }
        ex="Un robot logiciel recopie chaque facture dans le vieux logiciel comptable."
      />
      <M1Word
        d={400}
        icon="brain"
        tone="blue"
        name="Intelligence artificielle"
        meta="Le jugement appris"
        def={
          <>
            Interprète, prédit ou génère à partir d’exemples. Gère l’<b>imprévu</b>… avec des erreurs possibles.
          </>
        }
        ex="Lire un courriel libre du fournisseur et en déduire le retard annoncé."
      />
    </div>
  </Frame>
);

// ─── M1 · They combine (pipeline) ───────────────────────────────────────────
const M1Station = ({ n, icon, tone, who, title, children }: { n: number; icon: IconName; tone: Tone; who: string; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ width: 340, flex: 'none' }}>
    <div style={{ boxSizing: 'border-box', height: 400, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '28px 26px' }}>
      <IconTile name={icon} tone={tone} size={72} solid />
      <Eyebrow c={T[tone].fg} size={21} style={{ marginTop: 18 }}>
        {who}
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 700, fontSize: 34, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 10, fontSize: 24, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M1_Pipeline: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>Dans la vraie vie, les trois se combinent</Title>
    <Lede>Le fournisseur de comptoirs écrit à Karim : « On aura deux semaines de retard, désolés. »</Lede>
    <div style={{ position: 'absolute', left: 120, top: 300, width: 1680, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <div className={A.left} style={{ width: 200, flex: 'none', textAlign: 'center' }}>
        <IconTile name="mail" tone="grey" size={110} style={{ margin: '0 auto' }} />
        <div style={{ marginTop: 14, fontSize: 24, fontWeight: 600, color: C.ink }}>Courriel reçu</div>
        <div style={{ fontSize: 21, color: C.muted }}>texte libre</div>
      </div>
      <FlowArrow w={60} color={C.blue} dashed />
      <M1Station n={1} icon="brain" tone="blue" who="IA" title="Comprendre">
        Repère le lot touché, le retard annoncé (2 semaines) et l’impact sur l’ouverture.
      </M1Station>
      <div className={b.fade(2)}>
        <FlowArrow w={60} color={C.blue} dashed />
      </div>
      <M1Station n={2} icon="gear" tone="grey" who="Automatisation" title="Appliquer la règle">
        Si un jalon bouge de plus d’une semaine, alors alerte à Karim et à Luc.
      </M1Station>
      <div className={b.fade(3)}>
        <FlowArrow w={60} color={C.blue} dashed />
      </div>
      <M1Station n={3} icon="arm" tone="teal" who="Robot logiciel" title="Saisir">
        Inscrit le changement dans le registre, un vieil outil sans connecteur.
      </M1Station>
    </div>
    <Callout cls={b.on(4)} title="Qui décide ?" tone="yellow" icon="humanCheck" style={{ position: 'absolute', left: 120, top: 760, width: 1680 }}>
      Aucun des trois. Karim valide le nouvel échéancier et Luc arbitre si la date d’ouverture est menacée.
    </Callout>
  </Frame>
);

// ─── M1 · Comparison table ──────────────────────────────────────────────────
const M1Cell = ({ children, tone }: { children: ReactNode; tone?: Tone }) => (
  <div style={{ flex: 1, padding: '0 22px', fontSize: 25, lineHeight: 1.35, color: tone ? T[tone].fg : C.ink, fontWeight: tone ? 600 : 400 }}>{children}</div>
);

const M1Row = ({ n, label, children }: { n: number; label: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', alignItems: 'center', minHeight: 104, borderTop: `2px solid ${C.rule}` }}>
    <div style={{ width: 300, flex: 'none', fontFamily: display, fontWeight: 700, fontSize: 28, color: C.ink }}>{label}</div>
    {children}
  </div>
);

const M1Head = ({ icon, tone, children }: { icon: IconName; tone: Tone; children: ReactNode }) => (
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, padding: '0 22px' }}>
    <IconTile name={icon} tone={tone} size={50} solid />
    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>{children}</span>
  </div>
);

const M1_Compare: Page = () => (
  <Frame mod={1} beats={5}>
    <Title>Comparons-les, critère par critère</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 220, width: 1680, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 30px 10px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 80 }}>
        <div style={{ width: 300, flex: 'none' }} />
        <M1Head icon="gear" tone="grey">
          Automatisation
        </M1Head>
        <M1Head icon="arm" tone="teal">
          Robotisation
        </M1Head>
        <M1Head icon="brain" tone="blue">
          IA
        </M1Head>
      </div>
      <M1Row n={1} label="Fonctionne avec">
        <M1Cell>des règles écrites à l’avance</M1Cell>
        <M1Cell>les écrans et les clics d’un humain</M1Cell>
        <M1Cell>des exemples et des données</M1Cell>
      </M1Row>
      <M1Row n={2} label="Face à l’imprévu">
        <M1Cell tone="coral">bloque</M1Cell>
        <M1Cell tone="coral">bloque si l’écran change</M1Cell>
        <M1Cell tone="green">s’adapte, en partie</M1Cell>
      </M1Row>
      <M1Row n={3} label="Résultat">
        <M1Cell tone="green">toujours identique</M1Cell>
        <M1Cell tone="green">toujours identique</M1Cell>
        <M1Cell tone="yellow">variable, probable</M1Cell>
      </M1Row>
      <M1Row n={4} label="Erreur typique">
        <M1Cell>une règle mal pensée</M1Cell>
        <M1Cell>une mise à jour du logiciel</M1Cell>
        <M1Cell>une erreur dite avec aplomb</M1Cell>
      </M1Row>
      <M1Row n={5} label="Idéal pour">
        <M1Cell>les tâches répétitives et stables</M1Cell>
        <M1Cell>les vieux logiciels sans connecteur</M1Cell>
        <M1Cell>le texte, le langage, l’ambigu</M1Cell>
      </M1Row>
    </div>
  </Frame>
);

// ─── M1 · Exercise: sort the tasks ──────────────────────────────────────────
const M1Zone = ({ x, icon, tone, label }: { x: number; icon: IconName; tone: Tone; label: string }) => (
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

const M1Key = ({ tone, children }: { tone: Tone; children: ReactNode }) => (
  <span className={b.pop(1)} style={{ flex: 'none', marginLeft: 'auto', padding: '2px 10px', borderRadius: 8, background: STRONG[tone], color: tone === 'yellow' ? C.ink : '#fff', fontFamily: display, fontWeight: 700, fontSize: 19 }}>
    {children}
  </span>
);

const M1_Sort: Page = () => (
  <Frame mod={1} kind="exercice" beats={1}>
    <Title>À vous : classez ces tâches du projet Limoilou</Title>
    <Lede>Dites-moi dans le clavardage où va chaque étiquette. Le corrigé apparaît au clic.</Lede>
    <M1Zone x={120} icon="gear" tone="grey" label="Automatisation" />
    <M1Zone x={690} icon="arm" tone="teal" label="Robotisation" />
    <M1Zone x={1260} icon="brain" tone="blue" label="IA" />
    <Drag x={120} y={262} w={405} tone="blue">
      Rappel automatique la veille d’une échéance <M1Key tone="grey">AUTO</M1Key>
    </Drag>
    <Drag x={545} y={262} w={405} tone="blue">
      Résumer un fil de 40 courriels <M1Key tone="blue">IA</M1Key>
    </Drag>
    <Drag x={970} y={262} w={405} tone="blue">
      Recopier les factures PDF dans le logiciel comptable <M1Key tone="teal">ROBOT</M1Key>
    </Drag>
    <Drag x={1395} y={262} w={405} tone="blue">
      Créer une tâche quand un formulaire est rempli <M1Key tone="grey">AUTO</M1Key>
    </Drag>
    <Drag x={120} y={384} w={405} tone="blue">
      Repérer les tâches qui risquent de glisser <M1Key tone="blue">IA</M1Key>
    </Drag>
    <Drag x={545} y={384} w={405} tone="blue">
      Rédiger l’annonce de l’ouverture <M1Key tone="blue">IA</M1Key>
    </Drag>
    <Drag x={970} y={384} w={405} tone="blue">
      Bras qui assemble les cadres de vélo <M1Key tone="teal">ROBOT</M1Key>
    </Drag>
    <Drag x={1395} y={384} w={405} tone="blue">
      Archiver les fichiers du projet chaque vendredi <M1Key tone="grey">AUTO</M1Key>
    </Drag>
  </Frame>
);

// ─── M1 · Panorama in business ──────────────────────────────────────────────
const M1Dept = ({ d, icon, tone, title, children }: { d: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <Card tone={tone} icon={icon} title={title} size={25} cls={A.in} style={{ width: 540, height: 300, ...dl(d) }}>
    {children}
  </Card>
);

const M1_Business: Page = () => (
  <Frame mod={1}>
    <Title>En entreprise : l’IA est déjà dans chaque service</Title>
    <Lede>Les mêmes services que dans vos projets. Repérez le vôtre.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 30, columnGap: 30 }}>
      <M1Dept d={100} icon="users" tone="green" title="Ressources humaines">
        Rédiger des offres d’emploi, répondre aux questions des employés, préparer l’accueil.
      </M1Dept>
      <M1Dept d={200} icon="megaphone" tone="yellow" title="Marketing">
        Textes et visuels de campagne, idées de contenus, analyse des résultats.
      </M1Dept>
      <M1Dept d={300} icon="server" tone="violet" title="Technologies de l’information">
        Soutien aux utilisateurs, documentation, aide à la programmation.
      </M1Dept>
      <M1Dept d={400} icon="money" tone="teal" title="Finance">
        Lecture de factures, prévision de trésorerie, détection d’anomalies.
      </M1Dept>
      <M1Dept d={500} icon="chat" tone="blue" title="Service à la clientèle">
        Agents conversationnels, tri des courriels, réponses suggérées.
      </M1Dept>
      <M1Dept d={600} icon="truck" tone="coral" title="Opérations">
        Prévision de la demande, planification, maintenance prédictive.
      </M1Dept>
    </div>
  </Frame>
);

// ─── M1 · A few figures ─────────────────────────────────────────────────────
const M1Fig = ({ d, tone, value, label, src }: { d: number; tone: Tone; value: ReactNode; label: ReactNode; src: string }) => (
  <div className={A.in} style={{ flex: 1, ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 470, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '36px 34px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 110, lineHeight: 1, color: tone === 'yellow' ? C.amber : STRONG[tone] }}>{value}</div>
      <div style={{ marginTop: 20, fontSize: 28, lineHeight: 1.4, color: C.ink }}>{label}</div>
      <div style={{ marginTop: 'auto', fontSize: 21, color: C.muted }}>{src}</div>
    </div>
  </div>
);

const M1_Figures: Page = () => (
  <Frame mod={1}>
    <Title>Une adoption rapide, au Canada comme ailleurs</Title>
    <Lede>Trois repères pour situer le mouvement, à mettre à jour régulièrement.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 30 }}>
      <M1Fig d={100} tone="blue" value={<CountUp to={800} suffix=" M" delay={300} />} label="d’utilisateurs de ChatGPT chaque semaine" src="Annonce d’OpenAI, octobre 2025" />
      <M1Fig
        d={250}
        tone="green"
        value={<CountUp to={12.2} digits={1} suffix=" %" delay={450} />}
        label="des entreprises canadiennes utilisent l’IA pour produire, deux fois plus qu’un an plus tôt"
        src="Statistique Canada, 2ᵉ trimestre 2025"
      />
      <M1Fig d={400} tone="yellow" value="80 %" label="du travail de gestion de projet « classique » (collecte, suivi, rapports) pris en charge par l’IA d’ici 2030" src="Prédiction de Gartner, 2019" />
    </div>
    <Callout cls={A.in} title="Lecture" tone="blue" icon="bulb" size={26} style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(600) }}>
      Le chargé de projet ne disparaît pas : il passe moins de temps à compiler, plus de temps à décider et à animer.
    </Callout>
  </Frame>
);

// ─── M1 · Good at / bad at ──────────────────────────────────────────────────
const M1Good = ({ ok, children }: { ok: boolean; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 28, lineHeight: 1.3, color: C.ink }}>
    <span style={{ flex: 'none', width: 40, height: 40, borderRadius: 99, background: ok ? C.green : C.coral, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={ok ? 'check' : 'x'} size={24} color="#fff" sw={3} />
    </span>
    <span>{children}</span>
  </div>
);

const M1_GoodBad: Page = () => (
  <Frame mod={1} beats={2}>
    <Title>Ce que l’IA générative fait bien… et moins bien</Title>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 230, width: 810, height: 560, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.green}`, padding: '32px 36px' }}>
      <Eyebrow c={T.green.fg}>Très bonne pour</Eyebrow>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <M1Good ok>Produire un premier jet en quelques secondes</M1Good>
        <M1Good ok>Résumer, reformuler, changer de ton</M1Good>
        <M1Good ok>Structurer : listes, tableaux, plans</M1Good>
        <M1Good ok>Proposer des idées, des risques oubliés</M1Good>
        <M1Good ok>Traduire et corriger</M1Good>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 990, top: 230, width: 810, height: 560, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.coral}`, padding: '32px 36px' }}>
      <Eyebrow c={T.coral.fg}>Moins bonne pour</Eyebrow>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <M1Good ok={false}>Les faits précis, les chiffres, les sources</M1Good>
        <M1Good ok={false}>Les calculs longs, non vérifiés</M1Good>
        <M1Good ok={false}>Ce que vous ne lui dites pas (votre contexte)</M1Good>
        <M1Good ok={false}>Les décisions et les arbitrages</M1Good>
        <M1Good ok={false}>Assumer la responsabilité d’une erreur</M1Good>
      </div>
    </div>
    <Callout cls={b.on(2)} title="Règle d’or" tone="yellow" icon="star" size={30} style={{ position: 'absolute', left: 120, top: 830, width: 1680 }}>
      L’IA fait le <b>premier</b> jet. Vous faites le <b>dernier</b>.
    </Callout>
  </Frame>
);

// ─── M1 · QCMs ──────────────────────────────────────────────────────────────
const M1_Qcm1: Page = () => (
  <QcmPage
    mod={1}
    n={1}
    title="Automatisation ou IA ?"
    q="Chaque lundi, un courriel liste automatiquement les tâches en retard. De quoi s’agit-il ?"
    explain="Une règle fixe (« si échéance dépassée, alors lister ») = automatisation. Ce serait de l’IA si l’outil prédisait les tâches qui VONT prendre du retard."
  >
    <Opt why="Piège ! Rien n’est appris ni interprété : la règle est écrite à l’avance et donne toujours le même résultat.">De l’intelligence artificielle, puisque c’est automatique</Opt>
    <Opt ok why="Exact : un déclencheur (lundi), une condition (échéance dépassée), une action (courriel). C’est une automatisation classique.">
      Une automatisation à base de règles
    </Opt>
    <Opt why="Piège ! Aucun robot ne refait des clics à l’écran ici : l’outil de gestion de tâches envoie lui-même le courriel.">Une robotisation (RPA)</Opt>
    <Opt why="Piège ! Les trois notions sont bien distinctes, même si les outils les combinent souvent.">Les trois, c’est la même chose</Opt>
  </QcmPage>
);

const M1_Qcm2: Page = () => (
  <QcmPage
    mod={1}
    n={2}
    title="Pourquoi l’IA invente-t-elle ?"
    q="ChatGPT cite une étude qui n’existe pas. Quelle est la meilleure explication ?"
    explain="Un LLM produit la suite la plus probable, pas la plus vraie. Une source au nom plausible « sonne bien ». D’où la règle : toute source, tout chiffre se vérifie."
  >
    <Opt why="Piège ! Il n’y a pas d’intention : le modèle ne « sait » pas qu’il ment.">Il cherche volontairement à tromper l’utilisateur</Opt>
    <Opt why="Piège ! Même relié à Internet, il peut mal lire ou combiner des sources. Le problème est le mode de fonctionnement, pas une panne.">Il était déconnecté d’Internet, c’est un bogue</Opt>
    <Opt ok why="Oui : il prédit des mots probables. Un nom d’étude crédible est très probable… sans être vrai.">
      Il génère le texte le plus probable, sans vérifier qu’il est vrai
    </Opt>
    <Opt why="Piège ! Une demande plus précise aide, mais ne supprime pas le risque d’invention.">La question était trop longue</Opt>
  </QcmPage>
);

// ─── M1 · Synthesis ─────────────────────────────────────────────────────────
const M1_Synth: Page = () => (
  <SynthPage
    mod={1}
    title="Module 1 · Ce qu’il faut retenir"
    poste={
      <>
        Notez trois moments de votre semaine où vous utilisez déjà l’IA sans y penser.
        <br />
        <br />
        Puis posez une question de votre métier à un assistant… et vérifiez la réponse.
      </>
    }
  >
    <SynthRow n={1} tone="blue" d={100}>
      L’IA <b>apprend à partir d’exemples</b> au lieu de suivre des règles écrites.
    </SynthRow>
    <SynthRow n={2} tone="teal" d={220}>
      Trois familles : elle <b>prédit</b>, elle <b>perçoit</b>, elle <b>génère</b>.
    </SynthRow>
    <SynthRow n={3} tone="violet" d={340}>
      Un LLM écrit le mot le plus <b>probable</b>, pas le plus vrai.
    </SynthRow>
    <SynthRow n={4} tone="green" d={460}>
      Automatisation = règles, robotisation = clics, IA = jugement appris.
    </SynthRow>
    <SynthRow n={5} tone="yellow" d={580}>
      L’IA fait le premier jet, <b>vous faites le dernier</b>.
    </SynthRow>
  </SynthPage>
);

// ═══ 20-m2 ═════════════════════════════════════════════════════════════

// ─── M2 · Divider ───────────────────────────────────────────────────────────
const M2_Divider: Page = () => (
  <Section n={2} title="L’IA dans la gestion de projet" sub="Planifier, suivre, rendre compte, communiquer : quatre usages, vos outils du quotidien." dur="≈ 1 h 30">
    <SecItem n={1}>L’IA à chaque phase du cycle de vie</SecItem>
    <SecItem n={2}>Quatre cas d’usage : planification, suivi, reporting, communication</SecItem>
    <SecItem n={3}>L’IA dans Outlook, Teams, Google, Notion, Trello…</SecItem>
    <SecItem n={4}>Bien formuler sa demande à l’IA</SecItem>
  </Section>
);
M2_Divider.transition = BLOOM;

// ─── M2 · Lifecycle ─────────────────────────────────────────────────────────
const M2Phase = ({ i, n, tone, name, children }: { i: number; n: number; tone: Tone; name: string; children: ReactNode }) => (
  <div style={{ width: 320, flex: 'none' }}>
    <div
      className={A.left}
      style={{
        height: 96,
        background: STRONG[tone],
        clipPath: i === 1 ? 'polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%)' : 'polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%, 8% 50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: tone === 'yellow' ? C.ink : '#fff',
        fontFamily: display,
        fontWeight: 700,
        fontSize: 30,
        letterSpacing: '0.04em',
        ...dl(i * 120),
      }}
    >
      {name}
    </div>
    <div className={b.on(n)} style={{ marginTop: 22 }}>
      <div style={{ boxSizing: 'border-box', height: 480, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {children}
      </div>
    </div>
  </div>
);

const M2Use = ({ icon, tone, children }: { icon: IconName; tone: Tone; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
    <IconTile name={icon} tone={tone} size={44} />
    <span style={{ fontSize: 24, lineHeight: 1.35, color: C.ink }}>{children}</span>
  </div>
);

const M2_Lifecycle: Page = () => (
  <Frame mod={2} beats={5}>
    <Title>L’IA peut aider à chaque phase du projet</Title>
    <Lede>Le cycle de vie que vous connaissez, phase par phase.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', gap: 20 }}>
      <M2Phase i={1} n={1} tone="blue" name="Démarrer">
        <M2Use icon="doc" tone="blue">
          Premier jet de la charte de projet
        </M2Use>
        <M2Use icon="users" tone="blue">
          Liste des parties prenantes
        </M2Use>
        <M2Use icon="search" tone="blue">
          Questions à poser au commanditaire
        </M2Use>
      </M2Phase>
      <M2Phase i={2} n={2} tone="teal" name="Planifier">
        <M2Use icon="layers" tone="teal">
          Découpage en lots et en tâches
        </M2Use>
        <M2Use icon="gantt" tone="teal">
          Échéancier et jalons de départ
        </M2Use>
        <M2Use icon="alert" tone="teal">
          Registre des risques
        </M2Use>
      </M2Phase>
      <M2Phase i={3} n={3} tone="green" name="Exécuter">
        <M2Use icon="note" tone="green">
          Comptes rendus de réunion
        </M2Use>
        <M2Use icon="mail" tone="green">
          Courriels et relances
        </M2Use>
        <M2Use icon="book" tone="green">
          Procédures et documents
        </M2Use>
      </M2Phase>
      <M2Phase i={4} n={4} tone="violet" name="Suivre">
        <M2Use icon="bell" tone="violet">
          Alertes sur les retards
        </M2Use>
        <M2Use icon="chart" tone="violet">
          Rapport d’avancement
        </M2Use>
        <M2Use icon="trend" tone="violet">
          Écarts de budget expliqués
        </M2Use>
      </M2Phase>
      <M2Phase i={5} n={5} tone="yellow" name="Clôturer">
        <M2Use icon="star" tone="yellow">
          Bilan de projet
        </M2Use>
        <M2Use icon="bulb" tone="yellow">
          Leçons apprises
        </M2Use>
        <M2Use icon="archive" tone="yellow">
          Documentation de transfert
        </M2Use>
      </M2Phase>
    </div>
  </Frame>
);

// ─── M2 · Where the time goes ───────────────────────────────────────────────
const M2Bar = ({ i, label, h, ai, tone }: { i: number; label: string; h: number; ai?: string; tone: Tone }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 22, height: 84 }}>
    <span style={{ width: 340, flex: 'none', fontSize: 27, fontWeight: 500, color: C.ink }}>{label}</span>
    <div className={A.grow} style={{ width: h * 70, height: 50, borderRadius: 8, background: STRONG[tone], flex: 'none', ...dl(200 + i * 120) }} />
    <span className={A.fade} style={{ fontFamily: display, fontWeight: 700, fontSize: 36, color: C.ink, ...dl(700 + i * 120) }}>
      {h} h
    </span>
    {ai ? (
      <span className={b.pop(1)} style={{ ...vars({ o: 'left center' }), ...dl(i * 90) }}>
        <Tag tone="blue" size={22}>
          <Icon name="sparkles" size={22} /> {ai}
        </Tag>
      </span>
    ) : null}
  </div>
);

const M2_Time: Page = () => (
  <Frame mod={2} beats={1}>
    <Title>Où passe la semaine de Karim ?</Title>
    <Lede>Une semaine type de 40 heures, telle qu’il l’a notée. L’IA aide surtout… là où ça déborde.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 40px' }}>
      <M2Bar i={0} label="Réunions" h={11} tone="blue" ai="comptes rendus" />
      <M2Bar i={1} label="Courriels et relances" h={9} tone="blue" ai="rédaction, résumés" />
      <M2Bar i={2} label="Planification" h={6} tone="teal" ai="premiers jets" />
      <M2Bar i={3} label="Rapports et tableaux" h={5} tone="teal" ai="rapport hebdo" />
      <M2Bar i={4} label="Imprévus à régler" h={5} tone="grey" />
      <M2Bar i={5} label="Sur le terrain, avec l’équipe" h={4} tone="grey" />
    </div>
    <Callout cls={b.on(1)} title="Le vrai gain" tone="green" icon="clock" style={{ position: 'absolute', left: 120, top: 860, width: 1680, padding: '14px 26px', ...dl(500) }}>
      Le temps libéré sur la compilation revient à ce que l’IA ne fait pas : les imprévus et l’équipe.
    </Callout>
  </Frame>
);

// ─── M2 · Use-case pages (shared layout) ────────────────────────────────────
const M2Item = ({ d, icon, tone, children }: { d: number; icon: IconName; tone: Tone; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 20px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={52} />
    <span style={{ fontSize: 26, lineHeight: 1.3, color: C.ink }}>{children}</span>
  </div>
);

const M2Case = ({
  n,
  tone,
  icon,
  title,
  lede,
  items,
  prompt,
  answer,
  app = 'chatgpt',
}: {
  n: number;
  tone: Tone;
  icon: IconName;
  title: string;
  lede: string;
  items: ReactNode;
  prompt: ReactNode;
  answer: ReactNode;
  app?: AppId;
}) => (
  <Frame mod={2} beats={2} label={`Module 02 · Cas d’usage ${n} sur 4`}>
    <div className={A.pop} style={{ position: 'absolute', left: 120, top: 104 }}>
      <IconTile name={icon} tone={tone} size={74} solid />
    </div>
    <h2 className={A.in} style={{ position: 'absolute', left: 216, top: 108, margin: 0, fontFamily: display, fontWeight: 700, fontSize: 64, lineHeight: 1.08, color: C.ink }}>
      {title}
    </h2>
    <Lede>{lede}</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 600, display: 'flex', flexDirection: 'column', gap: 16 }}>{items}</div>
    <FilRouge cls={A.fade} style={{ position: 'absolute', left: 780, top: 280, ...dl(300) }}>
      Karim
    </FilRouge>
    <div className={b.on(1)} style={{ position: 'absolute', left: 780, top: 336, width: 1020 }}>
      <PromptBox size={27}>{prompt}</PromptBox>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 780, top: 590, width: 1020 }}>
      <AnswerBox id={app} size={26}>{answer}</AnswerBox>
    </div>
  </Frame>
);

const M2Line = ({ children }: { children: ReactNode }) => <div style={{ marginTop: 4 }}>{children}</div>;

const M2_UcPlan: Page = () => (
  <M2Case
    n={1}
    tone="teal"
    icon="gantt"
    title="Planification"
    lede="Passer de la page blanche à une première structure en quelques minutes."
    items={
      <>
        <M2Item d={100} icon="layers" tone="teal">
          Découper en lots et en tâches
        </M2Item>
        <M2Item d={200} icon="route" tone="teal">
          Proposer un ordre et des dépendances
        </M2Item>
        <M2Item d={300} icon="clock" tone="teal">
          Estimer des durées de départ
        </M2Item>
        <M2Item d={400} icon="alert" tone="teal">
          Lister risques et parties prenantes
        </M2Item>
      </>
    }
    prompt="Tu es chargé de projet. J’ouvre une boutique-atelier de vélos à Québec dans 22 semaines (budget 420 k$, 8 embauches, travaux, TI, campagne). Propose un découpage en 6 lots au maximum, avec les tâches principales de chacun."
    answer={
      <>
        <M2Line>
          <b>1. Cadrage</b> : charte, budget détaillé, comité de suivi
        </M2Line>
        <M2Line>
          <b>2. Local et travaux</b> : plans, soumissions, permis, chantier
        </M2Line>
        <M2Line>
          <b>3. Ressources humaines</b> : postes, affichage, entrevues, formation
        </M2Line>
        <M2Line>
          <b>4. Systèmes TI</b> : caisse, inventaire, réseau, rendez-vous
        </M2Line>
        <M2Line>
          <b>5. Marketing</b> : campagne locale, portes ouvertes · <b>6. Ouverture</b> : essais, inauguration
        </M2Line>
      </>
    }
  />
);

const M2_UcTrack: Page = () => (
  <M2Case
    n={2}
    tone="violet"
    icon="eye"
    title="Suivi"
    lede="Savoir ce qui glisse avant que ça devienne un problème."
    items={
      <>
        <M2Item d={100} icon="inbox" tone="violet">
          Consolider les mises à jour de l’équipe
        </M2Item>
        <M2Item d={200} icon="bell" tone="violet">
          Repérer les retards et leurs effets
        </M2Item>
        <M2Item d={300} icon="search" tone="violet">
          Répondre à « Où en est-on ? »
        </M2Item>
        <M2Item d={400} icon="calendar" tone="violet">
          Préparer la réunion de suivi
        </M2Item>
      </>
    }
    prompt="Voici l’export des tâches de la semaine (statut, responsable, échéance). Quelles tâches sont en retard ou à risque ? Quel effet sur le jalon « Travaux terminés » du 5 mars ?"
    answer={
      <>
        <M2Line>
          <b>3 tâches en retard</b> : soumission de l’électricien (Karim, 4 jours), choix du logiciel de caisse (Annie, 2 jours), affichage des postes (Julie, 1 jour).
        </M2Line>
        <M2Line>
          <b>Effet</b> : la soumission de l’électricien est sur le chemin critique. Sans décision d’ici vendredi, le jalon du 5 mars glisse d’environ une semaine.
        </M2Line>
      </>
    }
  />
);

const M2_UcReport: Page = () => (
  <M2Case
    n={3}
    tone="blue"
    icon="chart"
    title="Reporting"
    lede="Le rapport du vendredi en 5 minutes au lieu d’une heure."
    items={
      <>
        <M2Item d={100} icon="doc" tone="blue">
          Rédiger le rapport d’avancement
        </M2Item>
        <M2Item d={200} icon="target" tone="blue">
          Résumer pour la direction en 5 lignes
        </M2Item>
        <M2Item d={300} icon="gauge" tone="blue">
          Proposer une météo vert, jaune, rouge
        </M2Item>
        <M2Item d={400} icon="chart" tone="blue">
          Mettre des données en tableau
        </M2Item>
      </>
    }
    app="copilot"
    prompt="À partir de mes notes ci-dessous, rédige le rapport hebdomadaire pour Luc : météo globale, avancement, 3 points d’attention, décision attendue. 150 mots au maximum."
    answer={
      <>
        <M2Line>
          <b>Météo : JAUNE</b>. Avancement 38 % (prévu : 40 %).
        </M2Line>
        <M2Line>
          <b>Points d’attention</b> : soumission de l’électricien en retard ; logiciel de caisse à choisir ; 2 postes sans candidat.
        </M2Line>
        <M2Line>
          <b>Décision attendue</b> : approuver un dépassement de 6 000 $ sur le lot électricité.
        </M2Line>
      </>
    }
  />
);

const M2_UcComm: Page = () => (
  <M2Case
    n={4}
    tone="yellow"
    icon="megaphone"
    title="Communication"
    lede="Le bon message, au bon public, dans le bon ton."
    items={
      <>
        <M2Item d={100} icon="users" tone="yellow">
          Adapter un message à chaque public
        </M2Item>
        <M2Item d={200} icon="mail" tone="yellow">
          Rédiger un courriel délicat
        </M2Item>
        <M2Item d={300} icon="calendar" tone="yellow">
          Préparer l’ordre du jour
        </M2Item>
        <M2Item d={400} icon="globe" tone="yellow">
          Simplifier ou traduire un document
        </M2Item>
      </>
    }
    app="claude"
    prompt="Le fournisseur de comptoirs annonce 2 semaines de retard. Rédige trois versions : un courriel à Luc (impact et options), un message Teams à l’équipe (actions), une réponse polie au fournisseur."
    answer={
      <>
        <M2Line>
          <b>À Luc</b> : « Retard des comptoirs : impact limité si on inverse deux tâches. Deux options… »
        </M2Line>
        <M2Line>
          <b>À l’équipe</b> : « Les comptoirs arrivent le 19 au lieu du 5. Annie, on avance le câblage réseau… »
        </M2Line>
        <M2Line>
          <b>Au fournisseur</b> : « Merci de nous avoir prévenus. Pourriez-vous nous transmettre d’ici jeudi… »
        </M2Line>
      </>
    }
  />
);

// ─── M2 · Exercise: what to hand over? (2×2 matrix) ─────────────────────────
const M2Quad = ({ x, y, tone, title, sub }: { x: number; y: number; tone: Tone; title: string; sub: string }) => (
  <div className={A.fade} style={{ position: 'absolute', left: x, top: y, width: 600, height: 300, boxSizing: 'border-box', background: T[tone].bg, borderRadius: 16, padding: '16px 22px' }}>
    <div style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: T[tone].fg }}>{title}</div>
    <div style={{ fontSize: 21, color: C.soft }}>{sub}</div>
  </div>
);

const M2_Matrix: Page = () => (
  <Frame mod={2} kind="exercice">
    <Title>À vous : que confier à l’IA ?</Title>
    <Lede>Proposez une case dans le clavardage pour chaque tâche. Il y a débat… c’est voulu.</Lede>
    <M2Quad x={540} y={270} tone="yellow" title="Avec relecture attentive" sub="Gain élevé, risque élevé" />
    <M2Quad x={1160} y={270} tone="green" title="À confier en priorité" sub="Gain élevé, risque faible" />
    <M2Quad x={540} y={590} tone="coral" title="À garder pour soi" sub="Gain faible, risque élevé" />
    <M2Quad x={1160} y={590} tone="grey" title="Si le temps le permet" sub="Gain faible, risque faible" />
    <svg width={1260} height={660} style={{ position: 'absolute', left: 520, top: 260, overflow: 'visible', pointerEvents: 'none' }}>
      <Arrow x1={10} y1={650} x2={10} y2={0} color={C.soft} w={4} />
      <Arrow x1={1250} y1={650} x2={20} y2={650} color={C.soft} w={4} />
    </svg>
    <div style={{ position: 'absolute', left: 494, top: 600, transform: 'rotate(-90deg)', transformOrigin: 'left top', fontSize: 22, fontWeight: 600, color: C.soft, whiteSpace: 'nowrap' }}>
      Temps gagné →
    </div>
    <div style={{ position: 'absolute', left: 880, top: 930, fontSize: 22, fontWeight: 600, color: C.soft }}>← Risque si l’IA se trompe</div>
    <Drag x={120} y={270} w={360} tone="blue" size={22}>
      Compte rendu de réunion
    </Drag>
    <Drag x={120} y={350} w={360} tone="blue" size={22}>
      Annonce d’un retard au client
    </Drag>
    <Drag x={120} y={430} w={360} tone="blue" size={22}>
      Premier découpage des tâches
    </Drag>
    <Drag x={120} y={510} w={360} tone="blue" size={22}>
      Décision de reporter l’ouverture
    </Drag>
    <Drag x={120} y={590} w={360} tone="blue" size={22}>
      Ordre du jour de la réunion
    </Drag>
    <Drag x={120} y={670} w={360} tone="blue" size={22}>
      Budget final à présenter
    </Drag>
    <Drag x={120} y={750} w={360} tone="blue" size={22}>
      Reformuler une note interne
    </Drag>
    <Drag x={120} y={830} w={360} tone="blue" size={22}>
      Évaluation d’un employé
    </Drag>
  </Frame>
);

// ─── M2 · Two families of tools ─────────────────────────────────────────────
const M2Pro = ({ ok, children }: { ok: boolean; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 28, lineHeight: 1.3, color: C.ink }}>
    <Icon name={ok ? 'plus' : 'x'} size={28} color={ok ? C.green : C.coral} sw={3} />
    <span>{children}</span>
  </div>
);

const M2Family = ({ x, n, tone, icon, name, sub, apps, children }: { x: number; n?: number; tone: Tone; icon: IconName; name: string; sub: string; apps: ReactNode; children: ReactNode }) => (
  <div className={n ? b.on(n) : A.left} style={{ position: 'absolute', left: x, top: 260, width: 820 }}>
    <div style={{ boxSizing: 'border-box', height: 540, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '30px 36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <IconTile name={icon} tone={tone} size={76} solid />
        <div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 46, lineHeight: 1.05, color: C.ink }}>{name}</div>
          <div style={{ fontSize: 24, color: C.muted }}>{sub}</div>
        </div>
      </div>
      <div style={{ marginTop: 26, display: 'flex', flexWrap: 'wrap', gap: 18 }}>{apps}</div>
      <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
    </div>
  </div>
);

const M2_Families: Page = () => (
  <Frame mod={2} beats={1}>
    <Title>Deux familles d’outils</Title>
    <M2Family
      x={120}
      tone="blue"
      icon="chat"
      name="Les assistants génériques"
      sub="Une fenêtre de conversation, pour tout"
      apps={
        <>
          <AppChip id="chatgpt" />
          <AppChip id="gemini" />
          <AppChip id="copilot" />
          <AppChip id="claude" />
        </>
      }
    >
      <M2Pro ok>Polyvalents : rédiger, planifier, analyser</M2Pro>
      <M2Pro ok>Versions gratuites pour commencer</M2Pro>
      <M2Pro ok={false}>Ne voient que ce que vous collez</M2Pro>
      <M2Pro ok={false}>Copier-coller entre les outils</M2Pro>
    </M2Family>
    <M2Family
      x={980}
      n={1}
      tone="green"
      icon="puzzle"
      name="L’IA intégrée"
      sub="Dans l’outil où le travail se fait déjà"
      apps={
        <>
          <AppChip id="teams" />
          <AppChip id="outlook" />
          <AppChip id="google" />
          <AppChip id="notion" />
          <AppChip id="clickup" />
          <AppChip id="trello" />
        </>
      }
    >
      <M2Pro ok>Voit vos courriels, réunions, tâches</M2Pro>
      <M2Pro ok>Agit sur place : crée, résume, met à jour</M2Pro>
      <M2Pro ok={false}>Souvent une licence payante</M2Pro>
      <M2Pro ok={false}>Limitée à son propre outil</M2Pro>
    </M2Family>
    <Callout cls={b.on(1)} title="Les deux se complètent" tone="blue" icon="puzzle" style={{ position: 'absolute', left: 120, top: 840, width: 1680, ...dl(400) }}>
      Le générique pour réfléchir et rédiger, l’intégré pour travailler sur les données du projet.
    </Callout>
  </Frame>
);

// ─── M2 · The four generic assistants ───────────────────────────────────────
const M2Assist = ({ d, id, by, children, tip }: { d: number; id: AppId; by: string; children: ReactNode; tip: string }) => (
  <div className={A.in} style={{ flex: 1, ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 600, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '30px 28px', display: 'flex', flexDirection: 'column' }}>
      <AppTile id={id} size={84} />
      <div style={{ marginTop: 20, fontFamily: display, fontWeight: 700, fontSize: 44, color: C.ink }}>{APPS[id].short}</div>
      <div style={{ fontSize: 22, color: C.muted }}>{by}</div>
      <div style={{ marginTop: 18, fontSize: 25, lineHeight: 1.42, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 'auto', background: T.blue.bg, borderRadius: 12, padding: '12px 16px', fontSize: 22, lineHeight: 1.4, color: T.blue.fg }}>{tip}</div>
    </div>
  </div>
);

const M2_Generic: Page = () => (
  <Frame mod={2}>
    <Title>Les assistants génériques : quatre grands noms</Title>
    <Lede>Ils se ressemblent beaucoup. Le meilleur ? Celui que votre organisation autorise.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 26 }}>
      <M2Assist d={100} id="chatgpt" by="OpenAI" tip="Le plus répandu : beaucoup de tutoriels et d’exemples.">
        Rédaction, analyse de fichiers, recherche sur le web, images.
      </M2Assist>
      <M2Assist d={220} id="gemini" by="Google" tip="Naturel si votre organisation est sur Google Workspace.">
        Relié aux services Google : Gmail, Docs, Drive, Meet.
      </M2Assist>
      <M2Assist d={340} id="copilot" by="Microsoft" tip="Naturel si votre organisation est sur Microsoft 365.">
        Copilot Chat pour tous ; Microsoft 365 Copilot dans Word, Outlook, Teams.
      </M2Assist>
      <M2Assist d={460} id="claude" by="Anthropic" tip="Apprécié pour les longs documents et la rédaction.">
        Rédaction soignée, analyse de documents, raisonnement.
      </M2Assist>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 920, fontSize: 22, color: C.muted, ...dl(700) }}>
      Fonctions et forfaits évoluent tous les mois : vérifiez ce qui est inclus dans votre version.
    </div>
  </Frame>
);

// ─── M2 · Microsoft 365 ─────────────────────────────────────────────────────
const M2Mini = ({ children, tone = 'violet' }: { children: ReactNode; tone?: Tone }) => (
  <div style={{ marginTop: 14, background: T[tone].bg, borderRadius: 12, padding: '14px 18px', fontSize: 23, lineHeight: 1.45, color: C.ink }}>{children}</div>
);

const M2Mail = ({ from, subj, faded }: { from: string; subj: string; faded?: boolean }) => (
  <div style={{ display: 'flex', gap: 14, padding: '9px 0', borderBottom: `1.5px solid ${C.rule}`, opacity: faded ? 0.55 : 1 }}>
    <span style={{ width: 130, flex: 'none', fontSize: 21, fontWeight: 600, color: C.ink }}>{from}</span>
    <span style={{ fontSize: 21, color: C.soft, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subj}</span>
  </div>
);

const M2_Microsoft: Page = () => (
  <Frame mod={2} kind="demo" beats={2}>
    <Title>L’IA dans Outlook et Teams</Title>
    <Lede>Microsoft 365 Copilot travaille directement sur vos courriels et vos réunions.</Lede>
    <AppWin id="outlook" title="Retard comptoirs (14 messages)" cls={A.left} style={{ position: 'absolute', left: 120, top: 280, width: 820, ...dl(100) }}>
      <M2Mail from="Fournisseur" subj="RE: RE: Livraison des comptoirs, nouvelle date" />
      <M2Mail from="Maxime" subj="RE: Est-ce que ça touche les portes ouvertes ?" faded />
      <M2Mail from="Luc" subj="RE: On a une option B ?" faded />
      <div className={b.on(1)}>
        <M2Mini>
          <b>Résumé par Copilot</b> : livraison reportée du 5 au 19 février. Le fournisseur propose une pose le samedi. Luc demande une option B. Aucune décision prise.
        </M2Mini>
      </div>
    </AppWin>
    <AppWin id="teams" title="Suivi hebdo · projet Limoilou" cls={A.right} style={{ position: 'absolute', left: 980, top: 280, width: 820, ...dl(250) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.soft }}>
        <Icon name="video" size={26} color={C.violet} /> Réunion terminée · 52 min · transcription activée
      </div>
      <div className={b.on(2)}>
        <M2Mini>
          <b>Récapitulatif</b>
          <br />• Décision : pose des comptoirs le samedi 20 février.
          <br />• Tâche : Annie avance le câblage réseau (échéance 12 février).
          <br />• Point ouvert : impact sur la date des portes ouvertes.
        </M2Mini>
      </div>
    </AppWin>
    <Callout cls={A.in} title="Avant de promettre ces fonctions à votre équipe" tone="blue" icon="key" size={25} style={{ position: 'absolute', left: 120, top: 840, width: 1680, padding: '14px 26px', ...dl(500) }}>
      Elles dépendent de votre licence et des réglages de vos TI. Le récapitulatif exige que la réunion soit transcrite.
    </Callout>
  </Frame>
);

// ─── M2 · Google Workspace ──────────────────────────────────────────────────
const M2GTile = ({ d, icon, app, children }: { d: number; icon: IconName; app: string; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 420, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.green}`, padding: '28px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <IconTile name={icon} tone="green" size={60} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 38, color: C.ink }}>{app}</span>
      </div>
      <div style={{ marginTop: 20, fontSize: 26, lineHeight: 1.45, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M2_Google: Page = () => (
  <Frame mod={2}>
    <Title>L’IA dans Google Workspace</Title>
    <Lede>Gemini est intégré aux applications Google, selon l’édition de votre organisation.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 26 }}>
      <M2GTile d={100} icon="mail" app="Gmail">
        Résumer un long fil, proposer une réponse, retrouver une information dans vos courriels.
      </M2GTile>
      <M2GTile d={220} icon="doc" app="Docs">
        « Aide-moi à écrire » : premier jet d’une charte, d’une procédure, d’un bilan.
      </M2GTile>
      <M2GTile d={340} icon="chart" app="Sheets">
        Créer un tableau de suivi, expliquer une formule, analyser des données.
      </M2GTile>
      <M2GTile d={460} icon="video" app="Meet">
        « Prendre des notes pour moi » : un document de notes partagé après la réunion.
      </M2GTile>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 760, width: 1680, display: 'flex', gap: 22, alignItems: 'center', ...dl(600) }}>
      <AppTile id="gemini" size={60} />
      <span style={{ fontSize: 27, lineHeight: 1.4, color: C.ink }}>
        Même logique que Microsoft : l’IA travaille <b>là où sont vos documents</b>, avec les droits d’accès que vous avez déjà.
      </span>
    </div>
  </Frame>
);

// ─── M2 · Project tools ─────────────────────────────────────────────────────
const M2Tool = ({ d, id, children }: { d: number; id: AppId; children: ReactNode }) => (
  <div className={A.in} style={{ width: 540, ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 290, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '24px 26px' }}>
      <AppChip id={id} size={30} />
      <div style={{ marginTop: 18, fontSize: 25, lineHeight: 1.45, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M2_PmTools: Page = () => (
  <Frame mod={2}>
    <Title>L’IA dans les outils de gestion de projet</Title>
    <Lede>Tous ajoutent de l’IA. Ce qu’elle fait concrètement, outil par outil.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 30, columnGap: 30 }}>
      <M2Tool d={100} id="notion">
        Notion AI : rédiger et résumer des pages, répondre à des questions sur l’espace, notes de réunion.
      </M2Tool>
      <M2Tool d={200} id="clickup">
        ClickUp Brain : générer des tâches et sous-tâches, résumer un fil, rédiger une mise à jour de statut.
      </M2Tool>
      <M2Tool d={300} id="trello">
        Trello : IA d’Atlassian pour rédiger une carte, la résumer ou en tirer une liste de contrôle.
      </M2Tool>
      <M2Tool d={400} id="planner">
        Microsoft Planner : créer un plan et des tâches à partir d’un objectif, avec Copilot.
      </M2Tool>
      <M2Tool d={500} id="asana">
        Asana : résumés de projet, statuts rédigés à partir des tâches, règles intelligentes.
      </M2Tool>
      <M2Tool d={600} id="monday">
        monday.com : générer des tâches, résumer des mises à jour, remplir des colonnes.
      </M2Tool>
    </div>
  </Frame>
);

// ─── M2 · How to choose (decision path) ─────────────────────────────────────
const M2Q = ({ x, y, n, children }: { x: number; y: number; n?: number; children: ReactNode }) => (
  <div className={n ? b.pop(n) : A.pop} style={{ position: 'absolute', left: x, top: y, width: 560 }}>
    <div style={{ boxSizing: 'border-box', minHeight: 120, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 0 0 3px ${C.blue}`, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <Icon name="search" size={36} color={C.blue} />
      <span style={{ fontSize: 27, fontWeight: 600, lineHeight: 1.3, color: C.ink }}>{children}</span>
    </div>
  </div>
);

const M2A = ({ x, y, n, tone, icon, children }: { x: number; y: number; n: number; tone: Tone; icon: IconName; children: ReactNode }) => (
  <div className={b.on(n)} style={{ position: 'absolute', left: x, top: y, width: 520, ...dl(200) }}>
    <div style={{ boxSizing: 'border-box', background: T[tone].bg, borderRadius: 16, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <Icon name={icon} size={34} color={T[tone].fg} />
      <span style={{ fontSize: 25, lineHeight: 1.35, color: C.ink }}>{children}</span>
    </div>
  </div>
);

const M2YesNo = ({ x, y, yes }: { x: number; y: number; yes: boolean }) => (
  <span style={{ position: 'absolute', left: x, top: y, fontFamily: display, fontWeight: 700, fontSize: 24, color: yes ? C.green : C.coral }}>{yes ? 'OUI' : 'NON'}</span>
);

const M2_Choose: Page = () => (
  <Frame mod={2} beats={3}>
    <Title>Quel outil choisir ? Trois questions</Title>
    <Lede>Avant la puissance de l’outil : la nature de vos données.</Lede>
    <svg width={1680} height={700} style={{ position: 'absolute', left: 120, top: 270, overflow: 'visible' }}>
      <Arrow x1={560} y1={60} x2={700} y2={60} color={C.faint} n={1} />
      <Arrow x1={230} y1={120} x2={230} y2={240} color={C.faint} n={1} />
      <Arrow x1={560} y1={300} x2={700} y2={300} color={C.faint} n={2} />
      <Arrow x1={230} y1={360} x2={230} y2={480} color={C.faint} n={2} />
      <Arrow x1={560} y1={540} x2={700} y2={540} color={C.faint} n={3} />
    </svg>
    <M2Q x={120} y={270}>
      Les données sont-elles confidentielles ou personnelles ?
    </M2Q>
    <M2YesNo x={712} y={284} yes />
    <M2A x={820} y={276} n={1} tone="coral" icon="lock">
      Uniquement un outil <b>approuvé</b> par votre organisation (version entreprise).
    </M2A>
    <M2YesNo x={250} y={410} yes={false} />
    <M2Q x={120} y={510} n={1}>
      L’information est-elle déjà dans Teams, Notion, ClickUp… ?
    </M2Q>
    <M2YesNo x={712} y={524} yes />
    <M2A x={820} y={516} n={2} tone="green" icon="puzzle">
      Utilisez l’<b>IA intégrée</b> : elle voit le contexte, pas de copier-coller.
    </M2A>
    <M2YesNo x={250} y={650} yes={false} />
    <M2Q x={120} y={750} n={2}>
      Besoin ponctuel : un texte, une idée, une analyse ?
    </M2Q>
    <M2YesNo x={712} y={764} yes />
    <M2A x={820} y={756} n={3} tone="blue" icon="chat">
      Un <b>assistant générique</b> fait très bien l’affaire.
    </M2A>
  </Frame>
);

// ─── M2 · Anatomy of a good request ─────────────────────────────────────────
for (let n = 1; n <= 5; n++) {
  CSS.push(`
.${P}-m2pp${n}{transition:background 450ms ${EASE},color 450ms ${EASE};border-radius:6px;color:${C.faint}}
${at(n)} .${P}-m2pp${n}{color:${C.ink};background:var(--pb)}
`);
}

const M2Ing = ({ n, tone, name, q }: { n: number; tone: Tone; name: string; q: string }) => (
  <div className={b.left(n)} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${STRONG[tone]}`, padding: '14px 20px' }}>
    <Num n={n} tone={tone} size={46} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink, lineHeight: 1.1 }}>{name}</div>
      <div style={{ fontSize: 22, color: C.muted }}>{q}</div>
    </div>
  </div>
);

const M2Seg = ({ n, tone, children }: { n: number; tone: Tone; children: ReactNode }) => (
  <span className={k(`m2pp${n}`)} style={vars({ pb: T[tone].bg })}>
    {children}
  </span>
);

const M2_Anatomy: Page = () => (
  <Frame mod={2} beats={5}>
    <Title>Une bonne demande en cinq ingrédients</Title>
    <Lede>Plus l’IA a de contexte, moins elle invente. Un ingrédient par clic.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M2Ing n={1} tone="blue" name="Rôle" q="Qui l’IA doit-elle être ?" />
      <M2Ing n={2} tone="teal" name="Contexte" q="Quelle situation, quelles données ?" />
      <M2Ing n={3} tone="green" name="Tâche" q="Que doit-elle produire ?" />
      <M2Ing n={4} tone="yellow" name="Format" q="Sous quelle forme ?" />
      <M2Ing n={5} tone="violet" name="Contraintes" q="Quelles limites, quel ton ?" />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 740, top: 280, width: 1060, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 6px 0 0 ${C.blue}`, padding: '28px 36px 36px', ...dl(200) }}>
      <Eyebrow c={C.blue} size={22}>
        La demande de Karim
      </Eyebrow>
      <div style={{ marginTop: 16, fontSize: 35, lineHeight: 1.55 }}>
        <M2Seg n={1} tone="blue">
          Tu es un chargé de projet expérimenté dans le commerce de détail.
        </M2Seg>{' '}
        <M2Seg n={2} tone="teal">
          J’ouvre une boutique-atelier de vélos à Québec le 10 avril. Budget : 420 k$. Équipe : RH, marketing, TI, opérations.
        </M2Seg>{' '}
        <M2Seg n={3} tone="green">
          Propose les jalons principaux du projet
        </M2Seg>{' '}
        <M2Seg n={4} tone="yellow">
          sous forme de tableau : jalon, date cible, responsable, condition de réussite.
        </M2Seg>{' '}
        <M2Seg n={5} tone="violet">
          Huit jalons au maximum. Signale les dates que tu as dû deviner.
        </M2Seg>
      </div>
    </div>
  </Frame>
);

// ─── M2 · Before / after (interactive toggle) ───────────────────────────────
const M2_BeforeAfter: Page = () => {
  const [good, setGood] = useState(false);
  return (
    <Frame mod={2} kind="exercice">
      <Title>Même outil, deux demandes, deux résultats</Title>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 204, ...dl(100) }}>
        <Toggle on={good} onChange={setGood} label={good ? 'Demande en cinq ingrédients' : 'Demande vague'} tone="green" size={28} />
      </div>
      <div style={{ position: 'absolute', left: 120, top: 290, width: 760 }}>
        <PromptBox size={30} style={{ boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${good ? C.green : C.coral}` }}>
          {good
            ? 'Tu es chargé de projet. Boutique de vélos à Québec, ouverture le 10 avril, 8 embauches. Propose le plan de recrutement en tableau : poste, date d’affichage, date d’entrée, formation. Signale ce qui est serré.'
            : 'Fais-moi un plan pour recruter du monde.'}
        </PromptBox>
        <div style={{ marginTop: 26, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Tag tone={good ? 'green' : 'grey'}>Rôle</Tag>
          <Tag tone={good ? 'green' : 'grey'}>Contexte</Tag>
          <Tag tone={good ? 'green' : 'coral'}>Tâche</Tag>
          <Tag tone={good ? 'green' : 'grey'}>Format</Tag>
          <Tag tone={good ? 'green' : 'grey'}>Contraintes</Tag>
        </div>
      </div>
      <div key={good ? 'g' : 'b'} className={A.in} style={{ position: 'absolute', left: 940, top: 290, width: 860 }}>
        <AnswerBox size={27}>
          {good ? (
            <>
              <M2Line>
                <b>Mécaniciens (3)</b> : affichage 4 janvier · entrée 8 mars · formation atelier 2 semaines
              </M2Line>
              <M2Line>
                <b>Conseillers vente (4)</b> : affichage 18 janvier · entrée 22 mars · formation produits 1 semaine
              </M2Line>
              <M2Line>
                <b>Gérant(e) (1)</b> : affichage 7 décembre · entrée 1ᵉʳ février
              </M2Line>
              <M2Line>
                <b>Point serré</b> : les mécaniciens. Pénurie dans la région : commencer dès décembre.
              </M2Line>
            </>
          ) : (
            <>
              <M2Line>Voici un plan de recrutement en 7 étapes :</M2Line>
              <M2Line>1. Définir vos besoins · 2. Rédiger une offre attrayante · 3. Publier sur les plateformes d’emploi · 4. Trier les candidatures · 5. Mener les entrevues · 6. Faire une offre · 7. Accueillir la recrue.</M2Line>
              <M2Line>Bonne chance dans votre recrutement !</M2Line>
            </>
          )}
        </AnswerBox>
        <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, fontWeight: 600, color: good ? T.green.fg : T.coral.fg }}>
          <Icon name={good ? 'check' : 'alert'} size={30} />
          {good ? 'Utilisable tel quel, à vérifier avec Julie.' : 'Juste… et inutilisable : rien sur votre projet.'}
        </div>
      </div>
      <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 920, ...dl(500) }}>
        Cliquez l’interrupteur pour comparer
      </Hint>
    </Frame>
  );
};

// ─── M2 · Iterate (conversation) ────────────────────────────────────────────
const M2_Iterate: Page = () => (
  <Frame mod={2} beats={4}>
    <Title>La première réponse n’est qu’un début</Title>
    <Lede>On affine en conversation, comme avec un collègue. Trois relances utiles.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1120, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Bubble who="agent" name="Assistant" w={900} cls={A.in} style={dl(100)}>
        Voici 8 jalons pour l’ouverture de la boutique, du cadrage à l’inauguration…
      </Bubble>
      <div className={b.on(1)}>
        <Bubble who="user" name="Karim" w={900}>
          Ajoute les dépendances entre les jalons et indique le chemin critique.
        </Bubble>
      </div>
      <div className={b.on(2)}>
        <Bubble who="user" name="Karim" w={900}>
          Le permis prend 6 semaines à Québec, pas 2. Recalcule.
        </Bubble>
      </div>
      <div className={b.on(3)}>
        <Bubble who="user" name="Karim" w={900}>
          Qu’est-ce que j’oublie ? Pose-moi 5 questions avant de finaliser.
        </Bubble>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1300, top: 280, width: 500, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card tone="blue" icon="route" title="Approfondir" cls={b.on(1)} size={24}>
        Demander ce qui manque : dépendances, responsables, coûts.
      </Card>
      <Card tone="coral" icon="tool" title="Corriger" cls={b.on(2)} size={24}>
        Donner le fait que vous connaissez, l’IA ajuste le reste.
      </Card>
      <Card tone="green" icon="search" title="Inverser les rôles" cls={b.on(3)} size={24}>
        Laisser l’IA vous questionner : elle révèle les angles morts.
      </Card>
    </div>
    <Callout cls={b.on(4)} title="Astuce" tone="yellow" icon="bulb" size={26} style={{ position: 'absolute', left: 120, top: 790, width: 1120, padding: '14px 26px' }}>
      Une conversation par sujet. Quand elle part dans tous les sens, on en ouvre une nouvelle avec un résumé.
    </Callout>
  </Frame>
);

// ─── M2 · QCM & synthesis ───────────────────────────────────────────────────
const M2_Qcm: Page = () => (
  <QcmPage
    mod={2}
    n={3}
    title="Le bon outil"
    q="Annie veut un résumé de la réunion Teams d’hier, transcrite, à laquelle elle n’a pas assisté. Que lui conseiller ?"
    explain="L’IA intégrée travaille là où sont les données : la transcription est déjà dans Teams. Pas de copier-coller, et les droits d’accès sont respectés."
  >
    <Opt why="Piège ! Possible, mais long et risqué : copier une transcription interne dans un outil public peut exposer des données.">Copier la transcription dans un ChatGPT gratuit</Opt>
    <Opt ok why="Oui : si la licence le permet, le récapitulatif de Copilot dans Teams résume la réunion et liste les tâches, sans sortir les données.">
      Le récapitulatif de Copilot dans Teams
    </Opt>
    <Opt why="Piège ! Gemini fonctionne dans Google Workspace : il ne voit pas une réunion Teams.">Gemini dans Google Docs</Opt>
    <Opt why="Piège ! Possible pour un détail, mais c’est exactement le travail que l’IA fait bien.">Réécouter les 52 minutes d’enregistrement</Opt>
  </QcmPage>
);

const M2_Synth: Page = () => (
  <SynthPage
    mod={2}
    title="Module 2 · Ce qu’il faut retenir"
    poste={
      <>
        Vérifiez quelle IA votre organisation autorise et ce que votre licence inclut.
        <br />
        <br />
        Puis reprenez une demande que vous faites souvent et réécrivez-la en cinq ingrédients.
      </>
    }
  >
    <SynthRow n={1} tone="blue" d={100}>
      Quatre usages : <b>planifier, suivre, rendre compte, communiquer</b>.
    </SynthRow>
    <SynthRow n={2} tone="teal" d={220}>
      Assistants <b>génériques</b> pour tout, IA <b>intégrée</b> là où sont vos données.
    </SynthRow>
    <SynthRow n={3} tone="coral" d={340}>
      Données confidentielles : uniquement un outil <b>approuvé</b>.
    </SynthRow>
    <SynthRow n={4} tone="green" d={460}>
      Rôle, contexte, tâche, format, contraintes : <b>cinq ingrédients</b>.
    </SynthRow>
    <SynthRow n={5} tone="yellow" d={580}>
      On <b>affine en conversation</b> : approfondir, corriger, se faire questionner.
    </SynthRow>
  </SynthPage>
);

// ═══ 30-m3 ═════════════════════════════════════════════════════════════

// ─── M3 · Divider ───────────────────────────────────────────────────────────
const M3_Divider: Page = () => (
  <Section n={3} title="Atelier 1 · Un plan de projet avec l’IA" sub="Explorer Notion AI ou ClickUp, puis générer et vérifier le plan du projet Limoilou." dur="≈ 1 h 45" kind="atelier">
    <SecItem n={1}>Découverte guidée de Notion AI et de ClickUp Brain</SecItem>
    <SecItem n={2}>Charte, découpage, échéancier, risques, RACI</SecItem>
    <SecItem n={3}>Des tâches dans l’outil, prêtes à suivre</SecItem>
    <SecItem n={4}>Vérifier le plan : ce que l’IA rate</SecItem>
  </Section>
);
M3_Divider.transition = BLOOM;

// ─── M3 · Workshop brief ────────────────────────────────────────────────────
const M3Stage = ({ n, t, title, children }: { n: number; t: string; title: string; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '14px 22px', ...dl(n * 110) }}>
    <Num n={n} tone="yellow" size={48} />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 27, fontWeight: 600, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, color: C.muted }}>{children}</div>
    </div>
    <Tag tone="grey" size={21}>
      {t}
    </Tag>
  </div>
);

const M3_Brief: Page = () => (
  <Frame mod={3} kind="atelier">
    <Title>L’atelier en un coup d’œil</Title>
    <Lede>En autonomie, chacun sur son poste. Une seule mission : le plan du projet Limoilou, dans un outil.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1000, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M3Stage n={1} t="15 min" title="Découvrir l’outil">
        Notion AI ou ClickUp, démonstration guidée
      </M3Stage>
      <M3Stage n={2} t="10 min" title="Cadrer">
        Charte du projet en une page
      </M3Stage>
      <M3Stage n={3} t="25 min" title="Planifier">
        Découpage, échéancier, risques, RACI
      </M3Stage>
      <M3Stage n={4} t="10 min" title="Transférer">
        Les tâches dans l’outil, avec responsables et dates
      </M3Stage>
      <M3Stage n={5} t="15 min" title="Vérifier et présenter">
        Grille de contrôle, puis partage d’écran de quelques volontaires
      </M3Stage>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1180, top: 280, width: 620, ...dl(300) }}>
      <Card tone="yellow" icon="flag" title="Le livrable" size={26}>
        Un plan dans l’outil : 6 à 8 lots, des tâches datées avec un responsable, 3 jalons, 5 risques.
      </Card>
      <Card tone="blue" icon="tool" title="Les outils" size={26} style={{ marginTop: 22 }}>
        Notion AI ou ClickUp. À défaut : ChatGPT, Gemini, Copilot ou Claude, puis Excel ou Planner.
      </Card>
    </div>
  </Frame>
);

// ─── M3 · Karim's file (the data teams paste) ───────────────────────────────
const M3Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 18, padding: '11px 0', borderBottom: `1.5px solid ${C.rule}` }}>
    <span style={{ width: 230, flex: 'none', fontFamily: display, fontWeight: 700, fontSize: 25, letterSpacing: '0.04em', color: C.blue }}>{label}</span>
    <span style={{ fontSize: 25, lineHeight: 1.4, color: C.ink }}>{children}</span>
  </div>
);

const M3_File: Page = () => (
  <Frame mod={3} kind="atelier">
    <Title>Le dossier de Karim : vos données de départ</Title>
    <Lede>Tout ce que l’IA doit savoir. Le reste, elle le devinera… et il faudra le vérifier.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 6px 0 0 ${C.teal}`, padding: '14px 36px 18px', ...dl(100) }}>
      <M3Field label="Objectif">Ouvrir la 4ᵉ boutique-atelier Vélo Fleuve, 3ᵉ Avenue, Limoilou (Québec), le samedi 10 avril.</M3Field>
      <M3Field label="Départ">Lundi 2 novembre. Bail signé. Local vide de 250 m².</M3Field>
      <M3Field label="Budget">420 000 $ : travaux 230 k$, équipements et TI 75 k$, inventaire initial 70 k$, marketing 25 k$, réserve 20 k$.</M3Field>
      <M3Field label="Équipe">Karim (chargé de projet), Luc (commanditaire), Julie (RH), Maxime (marketing), Annie (TI).</M3Field>
      <M3Field label="Embauches">1 gérant(e), 3 mécaniciens, 4 conseillers à la vente. Mécaniciens rares dans la région.</M3Field>
      <M3Field label="Contraintes">Permis de la Ville : environ 6 semaines. Chantiers fermés pendant les Fêtes. Travaux : 10 semaines.</M3Field>
      <M3Field label="Déjà connu">Le fournisseur de comptoirs a souvent du retard. Logiciel de caisse à choisir parmi deux offres.</M3Field>
    </div>
  </Frame>
);

// ─── M3 · Guided tour: Notion AI ────────────────────────────────────────────
// Numbered pin on a mock screen + its explanation in the side column.
const M3Pin = ({ n, x, y }: { n: number; x: number; y: number }) => (
  <div className={b.pop(n)} style={{ position: 'absolute', left: x - 24, top: y - 24, width: 48, height: 48, zIndex: 5 }}>
    <div style={{ width: 48, height: 48, borderRadius: 99, background: C.coral, color: '#fff', border: '4px solid #fff', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontWeight: 700, fontSize: 26, boxShadow: '0 6px 16px -6px rgba(180,60,40,.7)' }}>
      {n}
    </div>
  </div>
);

const M3Exp = ({ n, title, tone = 'coral', children }: { n: number; title: string; tone?: Tone; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 16, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 20px' }}>
    <Num n={n} tone={tone} size={42} />
    <div>
      <div style={{ fontWeight: 700, fontSize: 25, color: C.ink, lineHeight: 1.25 }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M3Row = ({ cells, head }: { cells: [string, string, string, string]; head?: boolean }) => (
  <div style={{ display: 'flex', borderBottom: `1.5px solid ${C.rule}`, fontSize: head ? 19 : 22, fontWeight: head ? 600 : 400, color: head ? C.muted : C.ink, textTransform: head ? 'uppercase' : 'none', letterSpacing: head ? '0.06em' : 0 }}>
    <span style={{ width: 380, padding: '10px 12px' }}>{cells[0]}</span>
    <span style={{ width: 160, padding: '10px 12px' }}>{cells[1]}</span>
    <span style={{ width: 160, padding: '10px 12px' }}>{cells[2]}</span>
    <span style={{ flex: 1, padding: '10px 12px', color: head ? C.violet : T.violet.fg }}>{cells[3]}</span>
  </div>
);

const M3_Notion: Page = () => (
  <Frame mod={3} kind="demo" beats={4}>
    <Title>Découverte guidée : Notion AI</Title>
    <Lede>Un espace de pages et de bases de données, avec l’IA partout. Quatre endroits à connaître.</Lede>
    <AppWin id="notion" title="Projet Limoilou · Plan" cls={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1110, height: 650, ...dl(100) }} pad={30}>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 44, color: C.ink }}>Ouverture boutique Limoilou</div>
      <div style={{ marginTop: 14, fontSize: 24, color: C.faint, fontStyle: 'italic' }}>Appuyez sur Espace pour demander à l’IA, ou « / » pour les commandes…</div>
      <div style={{ marginTop: 20, display: 'flex', gap: 14 }}>
        <Tag tone="violet" size={21}>
          <Icon name="sparkles" size={20} /> Rédiger avec l’IA
        </Tag>
        <Tag tone="grey" size={21}>
          Modèle : plan de projet
        </Tag>
      </div>
      <div style={{ marginTop: 26, background: C.card, borderRadius: 12, boxShadow: `inset 0 0 0 1.5px ${C.rule}` }}>
        <M3Row head cells={['Tâche', 'Responsable', 'Échéance', 'Résumé IA']} />
        <M3Row cells={['Obtenir le permis de la Ville', 'Karim', '18 déc.', 'En attente du plan signé']} />
        <M3Row cells={['Afficher les postes de mécanicien', 'Julie', '7 déc.', 'Offre rédigée, à valider']} />
        <M3Row cells={['Choisir le logiciel de caisse', 'Annie', '22 janv.', '2 offres, démo jeudi']} />
      </div>
    </AppWin>
    <M3Pin n={1} x={940} y={441} />
    <M3Pin n={2} x={700} y={493} />
    <M3Pin n={3} x={1170} y={557} />
    <M3Pin n={4} x={1170} y={305} />
    <div style={{ position: 'absolute', left: 1280, top: 280, width: 520, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M3Exp n={1} title="Demander à l’IA">
        Espace sur une ligne vide : rédiger, résumer, traduire, continuer.
      </M3Exp>
      <M3Exp n={2} title="Modèles et rédaction">
        Partir d’un modèle de plan, ou générer une page entière.
      </M3Exp>
      <M3Exp n={3} title="Colonnes remplies par l’IA">
        Une propriété IA résume ou classe chaque ligne.
      </M3Exp>
      <M3Exp n={4} title="Questions sur l’espace">
        « Quelles tâches de Julie sont en retard ? »
      </M3Exp>
      <div className={A.fade} style={{ fontSize: 21, lineHeight: 1.4, color: C.muted, ...dl(600) }}>
        Fonctions selon le forfait Notion de votre organisation.
      </div>
    </div>
  </Frame>
);

// ─── M3 · Guided tour: ClickUp Brain ────────────────────────────────────────
const M3Sub = ({ n, children }: { n: number; children: ReactNode }) => (
  <div className={b.left(1)} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.ink, padding: '6px 0', ...dl(n * 120) }}>
    <span style={{ width: 22, height: 22, borderRadius: 6, boxShadow: `inset 0 0 0 2px ${C.faint}` }} />
    {children}
  </div>
);

const M3_ClickUp: Page = () => (
  <Frame mod={3} kind="demo" beats={4}>
    <Title>Découverte guidée : ClickUp Brain</Title>
    <Lede>Un outil de gestion de tâches où l’IA travaille directement sur les tâches et leurs fils.</Lede>
    <AppWin id="clickup" title="Limoilou › Systèmes TI › Tâche" cls={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1320, height: 650, ...dl(100) }} pad={30}>
      <div style={{ display: 'flex', gap: 30 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Tag tone="violet" size={20}>
              EN COURS
            </Tag>
            <span style={{ fontSize: 21, color: C.muted }}>Annie · échéance 22 janvier</span>
          </div>
          <div style={{ marginTop: 12, fontFamily: display, fontWeight: 700, fontSize: 42, color: C.ink }}>Choisir le logiciel de caisse</div>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 22, fontWeight: 600, color: C.soft }}>Sous-tâches</span>
            <span className={b.hi(1)} style={{ borderRadius: 999, display: 'inline-flex' }}>
              <Tag tone="violet" size={19}>
                <Icon name="sparkles" size={18} /> Générer des sous-tâches
              </Tag>
            </span>
          </div>
          <div style={{ marginTop: 8 }}>
            <M3Sub n={0}>Lister les besoins (caisse, inventaire, rendez-vous)</M3Sub>
            <M3Sub n={1}>Démo des deux fournisseurs</M3Sub>
            <M3Sub n={2}>Comparer coûts sur 3 ans</M3Sub>
            <M3Sub n={3}>Recommandation à Luc</M3Sub>
          </div>
        </div>
        <div style={{ width: 470, flex: 'none', background: C.panel, borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 21, fontWeight: 600, color: C.soft }}>Commentaires (23)</span>
            <span className={b.hi(2)} style={{ borderRadius: 999, display: 'inline-flex' }}>
              <Tag tone="violet" size={18}>
                <Icon name="sparkles" size={17} /> Résumer
              </Tag>
            </span>
          </div>
          <div style={{ marginTop: 12, fontSize: 20, lineHeight: 1.45, color: C.muted }}>Annie : l’offre B inclut le module de rendez-vous…</div>
          <div style={{ marginTop: 6, fontSize: 20, lineHeight: 1.45, color: C.muted }}>Karim : et la formation du personnel ?</div>
          <div className={b.on(2)} style={{ marginTop: 14, background: T.violet.bg, borderRadius: 10, padding: '12px 14px', fontSize: 21, lineHeight: 1.45, color: C.ink }}>
            <b>Résumé</b> : l’offre B coûte 12 % de plus mais inclut les rendez-vous et la formation. Décision attendue de Luc.
          </div>
        </div>
      </div>
    </AppWin>
    <div className={b.on(3)} style={{ position: 'absolute', left: 1480, top: 280, width: 320 }}>
      <Card tone="violet" icon="doc" title="Mises à jour de statut" size={23}>
        Un résumé d’avancement rédigé à partir des tâches de la semaine.
      </Card>
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 1480, top: 600, width: 320 }}>
      <Card tone="violet" icon="search" title="Questions" size={23}>
        « Qu’est-ce qui bloque le lot TI ? » L’IA répond à partir des tâches.
      </Card>
    </div>
  </Frame>
);

// ─── M3 · Step 1: charter ───────────────────────────────────────────────────
const M3Ch = ({ n, label, children }: { n: number; label: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ padding: '10px 0', borderBottom: `1.5px solid ${C.rule}` }}>
    <Eyebrow c={C.teal} size={20}>
      {label}
    </Eyebrow>
    <div style={{ marginTop: 2, fontSize: 23, lineHeight: 1.4, color: C.ink }}>{children}</div>
  </div>
);

const M3_Charter: Page = () => (
  <Frame mod={3} kind="atelier" beats={5} label="Atelier 1 · Étape 1 · Cadrer">
    <Title>Étape 1 · La charte du projet en une page</Title>
    <PromptBox cls={A.left} size={25} style={{ position: 'absolute', left: 120, top: 210, width: 760, ...dl(100) }}>
      Tu es chargé de projet. À partir du dossier ci-dessous, rédige la charte du projet en une page : objectif mesurable, périmètre (inclus / exclu), livrables, parties prenantes, critères de réussite. Signale ce qui manque pour la compléter.
      <div style={{ marginTop: 10, fontFamily: mono, fontSize: 20, color: C.muted }}>[collez ici le dossier de Karim]</div>
    </PromptBox>
    <Callout cls={A.left} title="Le réflexe" tone="yellow" icon="bulb" size={25} style={{ position: 'absolute', left: 120, top: 620, width: 760, ...dl(300) }}>
      « Signale ce qui manque » : l’IA liste les questions à poser à Luc au lieu d’inventer les réponses.
    </Callout>
    <div className={A.right} style={{ position: 'absolute', left: 940, top: 210, width: 860, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.teal}`, padding: '24px 32px 18px', ...dl(200) }}>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 34, color: C.ink }}>Charte · Boutique Limoilou</div>
      <M3Ch n={1} label="Objectif">
        Ouvrir le 10 avril, dans le budget de 420 k$, avec 8 employés formés.
      </M3Ch>
      <M3Ch n={2} label="Périmètre">
        Inclus : local, équipe, systèmes, lancement. Exclu : vente en ligne, location de vélos.
      </M3Ch>
      <M3Ch n={3} label="Livrables">
        Boutique aménagée, équipe formée, caisse et rendez-vous en ligne, campagne d’ouverture.
      </M3Ch>
      <M3Ch n={4} label="Réussite">
        Ouverture à la date, budget ± 5 %, 300 visiteurs aux portes ouvertes.
      </M3Ch>
      <div className={b.on(5)} style={{ marginTop: 12, background: T.coral.bg, borderRadius: 10, padding: '10px 14px', fontSize: 22, lineHeight: 1.4, color: T.coral.fg }}>
        <b>À confirmer avec Luc</b> : « 300 visiteurs » a été proposé par l’IA. Est-ce le bon objectif ?
      </div>
    </div>
  </Frame>
);

// ─── M3 · Step 2: work breakdown (animated tree) ────────────────────────────
const M3Lot = ({ i, n, tone, name, t1, t2, t3, added }: { i: number; n: number; tone: Tone; name: string; t1: string; t2: string; t3: string; added?: boolean }) => (
  <div className={b.on(n)} style={{ position: 'absolute', left: 120 + i * 240, top: 450, width: 222, ...dl(added ? 0 : i * 90) }}>
    <div
      style={{
        boxSizing: 'border-box',
        height: 96,
        borderRadius: 14,
        background: added ? T.coral.bg : STRONG[tone],
        border: added ? `3px dashed ${C.coral}` : 'none',
        color: added ? T.coral.fg : tone === 'yellow' ? C.ink : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 12px',
        fontFamily: display,
        fontWeight: 700,
        fontSize: 27,
        lineHeight: 1.1,
      }}
    >
      {name}
    </div>
    <div className={added ? undefined : b.fade(2)} style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10, ...dl(i * 90) }}>
      <div style={{ background: C.card, borderRadius: 10, boxShadow: SHADOW_SM, padding: '10px 12px', fontSize: 21, lineHeight: 1.3, color: C.ink }}>{t1}</div>
      <div style={{ background: C.card, borderRadius: 10, boxShadow: SHADOW_SM, padding: '10px 12px', fontSize: 21, lineHeight: 1.3, color: C.ink }}>{t2}</div>
      <div style={{ background: C.card, borderRadius: 10, boxShadow: SHADOW_SM, padding: '10px 12px', fontSize: 21, lineHeight: 1.3, color: C.ink }}>{t3}</div>
    </div>
  </div>
);

const M3_Wbs: Page = () => (
  <Frame mod={3} kind="atelier" beats={3} label="Atelier 1 · Étape 2 · Découper">
    <Title>Étape 2 · Le découpage du projet</Title>
    <Lede>Demande : « Découpe en lots, puis en tâches de 1 à 2 semaines. » Puis on complète.</Lede>
    <div className={A.pop} style={{ position: 'absolute', left: 760, top: 280, width: 400, height: 80, borderRadius: 14, background: C.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontWeight: 700, fontSize: 30, ...dl(100) }}>
      Ouverture boutique Limoilou
    </div>
    <svg width={1680} height={100} style={{ position: 'absolute', left: 120, top: 360, overflow: 'visible' }}>
      <path d="M840 0 V40 M111 40 H1551 M111 40 V90 M351 40 V90 M591 40 V90 M831 40 V90 M1071 40 V90 M1311 40 V90" stroke={C.faint} strokeWidth={3} fill="none" pathLength={1} className={b.draw(1)} />
      <path d="M1551 40 V90" stroke={C.coral} strokeWidth={3} strokeDasharray="8 8" fill="none" className={b.fade(3)} />
    </svg>
    <M3Lot i={0} n={1} tone="blue" name="Cadrage" t1="Charte validée" t2="Budget détaillé" t3="Comité de suivi" />
    <M3Lot i={1} n={1} tone="teal" name="Local et travaux" t1="Permis de la Ville" t2="Soumissions" t3="Chantier" />
    <M3Lot i={2} n={1} tone="green" name="Ressources humaines" t1="Affichage des postes" t2="Entrevues" t3="Formation" />
    <M3Lot i={3} n={1} tone="violet" name="Systèmes TI" t1="Logiciel de caisse" t2="Réseau et Wi-Fi" t3="Rendez-vous en ligne" />
    <M3Lot i={4} n={1} tone="yellow" name="Marketing" t1="Campagne locale" t2="Réseaux sociaux" t3="Portes ouvertes" />
    <M3Lot i={5} n={1} tone="grey" name="Ouverture" t1="Inventaire initial" t2="Essais à blanc" t3="Inauguration" />
    <M3Lot i={6} n={3} tone="coral" name="Gestion de projet" t1="Suivi hebdomadaire" t2="Rapports à Luc" t3="Bilan du projet" added />
    <div className={b.on(3)} style={{ position: 'absolute', left: 1100, top: 770, width: 700, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, fontSize: 24, fontWeight: 600, color: T.coral.fg, ...dl(300) }}>
      <Icon name="plus" size={28} sw={3} /> Ajouté par Karim : l’IA avait oublié son propre travail.
    </div>
  </Frame>
);

// ─── M3 · Step 3: schedule (animated Gantt) ─────────────────────────────────
const GX = 300; // grid start (inside the chart card)
const GW = 56; // one week
const M3Month = ({ w0, w1, label }: { w0: number; w1: number; label: string }) => (
  <div style={{ position: 'absolute', left: GX + (w0 - 1) * GW, top: 0, width: (w1 - w0 + 1) * GW, height: 40, boxSizing: 'border-box', borderLeft: `2px solid ${C.rule}`, paddingLeft: 10, fontFamily: display, fontWeight: 600, fontSize: 22, letterSpacing: '0.08em', color: C.muted }}>
    {label}
  </div>
);

const M3Gbar = ({ row, w0, w1, tone, label, crit }: { row: number; w0: number; w1: number; tone: Tone; label: string; crit?: boolean }) => (
  <>
    <div className={A.fade} style={{ position: 'absolute', left: 0, top: 56 + row * 66, width: 290, height: 46, display: 'flex', alignItems: 'center', fontSize: 24, fontWeight: 500, color: C.ink, ...dl(row * 80) }}>
      {label}
    </div>
    <div className={b.grow(1)} style={{ position: 'absolute', left: GX + (w0 - 1) * GW + 3, top: 60 + row * 66, width: (w1 - w0 + 1) * GW - 6, height: 38, ...dl(row * 110) }}>
      <div
        className={crit ? b.hi(3) : undefined}
        style={{ width: '100%', height: '100%', borderRadius: 8, background: STRONG[tone], boxShadow: crit ? undefined : 'none' }}
      />
    </div>
  </>
);

const M3Mile = ({ w, row, label, d, flip }: { w: number; row: number; label: string; d: number; flip?: boolean }) => (
  <div className={b.pop(2)} style={{ position: 'absolute', left: GX + w * GW - 18, top: 64 + row * 66, width: 30, height: 30, ...dl(d) }}>
    <div style={{ width: 30, height: 30, background: C.coral, transform: 'rotate(45deg)' }} />
    <div style={{ position: 'absolute', ...(flip ? { right: 44 } : { left: 40 }), top: 0, whiteSpace: 'nowrap', fontSize: 21, fontWeight: 700, color: T.coral.fg }}>{label}</div>
  </div>
);

const M3_Gantt: Page = () => (
  <Frame mod={3} kind="atelier" beats={3} label="Atelier 1 · Étape 3 · Planifier">
    <Title>Étape 3 · L’échéancier et ses jalons</Title>
    <Lede>Demande : « Place les lots sur 23 semaines, avec dépendances, jalons et chemin critique. »</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, height: 640, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, ...dl(100) }}>
      <div style={{ position: 'absolute', left: 30, top: 24, right: 30, bottom: 20 }}>
        <M3Month w0={1} w1={4} label="NOV." />
        <M3Month w0={5} w1={9} label="DÉC." />
        <M3Month w0={10} w1={13} label="JANV." />
        <M3Month w0={14} w1={17} label="FÉVR." />
        <M3Month w0={18} w1={22} label="MARS" />
        <M3Month w0={23} w1={23} label="AV." />
        <div style={{ position: 'absolute', left: GX + 7 * GW, top: 40, width: 2 * GW, height: 540, background: 'repeating-linear-gradient(135deg, #EEF2F5 0 10px, #F7FAFC 10px 20px)' }} />
        <div style={{ position: 'absolute', left: GX + 7 * GW + 8, top: 518, fontSize: 19, color: C.muted }}>Fêtes</div>
        <M3Gbar row={0} w0={1} w1={2} tone="blue" label="Cadrage" crit />
        <M3Gbar row={1} w0={2} w1={7} tone="teal" label="Permis de la Ville" crit />
        <M3Gbar row={2} w0={10} w1={18} tone="teal" label="Travaux" crit />
        <M3Gbar row={3} w0={5} w1={19} tone="green" label="Recrutement" />
        <M3Gbar row={4} w0={12} w1={21} tone="violet" label="Systèmes TI" crit />
        <M3Gbar row={5} w0={14} w1={23} tone="yellow" label="Marketing" />
        <M3Gbar row={6} w0={20} w1={23} tone="grey" label="Inventaire et essais" crit />
        <M3Mile w={7} row={1} label="Permis" d={0} />
        <M3Mile w={18} row={2} label="Travaux finis · 5 mars" d={200} />
        <M3Mile w={23} row={7} label="Ouverture · 10 avril" d={400} flip />
      </div>
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 120, top: 930, display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, fontWeight: 600, color: C.blue, ...dl(300) }}>
      <Icon name="route" size={28} /> Chemin critique : cadrage → permis → travaux → systèmes → essais. Un jour de retard ici = un jour de retard à l’ouverture.
    </div>
  </Frame>
);

// ─── M3 · Step 4: risks (probability × impact) ──────────────────────────────
const M3Risk = ({ n, x, y, id }: { n: number; x: number; y: number; id: string }) => (
  <div className={b.pop(n)} style={{ position: 'absolute', left: x - 28, top: y - 28, width: 56, height: 56 }}>
    <div style={{ width: 56, height: 56, borderRadius: 99, background: C.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontWeight: 700, fontSize: 26, boxShadow: '0 0 0 4px #fff' }}>{id}</div>
  </div>
);

const M3RiskRow = ({ n, id, name, children }: { n: number; id: string; name: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
    <span style={{ flex: 'none', width: 44, height: 44, borderRadius: 99, background: C.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontWeight: 700, fontSize: 22 }}>{id}</span>
    <div>
      <div style={{ fontSize: 25, fontWeight: 600, color: C.ink, lineHeight: 1.25 }}>{name}</div>
      <div style={{ fontSize: 22, color: C.soft, lineHeight: 1.35 }}>{children}</div>
    </div>
  </div>
);

const M3Cell = ({ c, r, tone }: { c: number; r: number; tone: Tone }) => (
  <div style={{ position: 'absolute', left: 80 + c * 190, top: r * 190, width: 186, height: 186, background: T[tone].bg, borderRadius: 8 }} />
);

const M3_Risks: Page = () => (
  <Frame mod={3} kind="atelier" beats={6} label="Atelier 1 · Étape 4 · Anticiper">
    <Title>Étape 4 · Le registre des risques</Title>
    <Lede>Demande : « Liste 6 risques, note probabilité et impact, propose une mesure pour chacun. »</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 660, height: 650, ...dl(100) }}>
      <M3Cell c={0} r={0} tone="yellow" />
      <M3Cell c={1} r={0} tone="coral" />
      <M3Cell c={2} r={0} tone="coral" />
      <M3Cell c={0} r={1} tone="green" />
      <M3Cell c={1} r={1} tone="yellow" />
      <M3Cell c={2} r={1} tone="coral" />
      <M3Cell c={0} r={2} tone="green" />
      <M3Cell c={1} r={2} tone="green" />
      <M3Cell c={2} r={2} tone="yellow" />
      <div style={{ position: 'absolute', left: 0, top: 0, width: 60, height: 570, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap', fontSize: 22, fontWeight: 600, color: C.soft }}>Impact →</span>
      </div>
      <div style={{ position: 'absolute', left: 80, top: 584, width: 570, textAlign: 'center', fontSize: 22, fontWeight: 600, color: C.soft }}>Probabilité →</div>
      <M3Risk n={1} x={80 + 190 * 1.5} y={95} id="R1" />
      <M3Risk n={2} x={80 + 190 * 2.5} y={95} id="R2" />
      <M3Risk n={3} x={80 + 190 * 2.5} y={285} id="R3" />
      <M3Risk n={4} x={80 + 190 * 1.5} y={285} id="R4" />
      <M3Risk n={5} x={80 + 190 * 0.5} y={95} id="R5" />
      <M3Risk n={6} x={80 + 190 * 0.5} y={285} id="R6" />
    </div>
    <div style={{ position: 'absolute', left: 860, top: 270, width: 940, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <M3RiskRow n={1} id="R1" name="Permis en retard">
        Déposer les plans dès la semaine 2 ; relance hebdomadaire à la Ville.
      </M3RiskRow>
      <M3RiskRow n={2} id="R2" name="Pénurie de mécaniciens">
        Afficher dès décembre ; former un mécanicien de Lévis en renfort.
      </M3RiskRow>
      <M3RiskRow n={3} id="R3" name="Retard du fournisseur de comptoirs">
        Commande ferme en janvier, pénalités au contrat, plan B.
      </M3RiskRow>
      <M3RiskRow n={4} id="R4" name="Dépassement du budget des travaux">
        Réserve de 20 k$ ; trois soumissions par lot.
      </M3RiskRow>
      <M3RiskRow n={5} id="R5" name="Caisse non prête à l’ouverture">
        Essais à blanc deux semaines avant ; caisse mobile de secours.
      </M3RiskRow>
      <M3RiskRow n={6} id="R6" name="Peu de clients à l’ouverture">
        Préinscriptions aux portes ouvertes ; partenariat avec un club local.
      </M3RiskRow>
    </div>
  </Frame>
);

// ─── M3 · Step 5: RACI (with the AI's mistakes) ─────────────────────────────
const M3R = ({ v }: { v: string }) => {
  const tone: Tone = v === 'R' ? 'blue' : v === 'A' ? 'coral' : v === 'C' ? 'yellow' : v === 'I' ? 'grey' : 'grey';
  return (
    <span style={{ width: 150, display: 'flex', justifyContent: 'center' }}>
      {v ? (
        <span style={{ width: 52, height: 52, borderRadius: 10, background: T[tone].bg, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, color: T[tone].fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontWeight: 700, fontSize: 28 }}>{v}</span>
      ) : (
        <span style={{ color: C.faint, fontSize: 26 }}>·</span>
      )}
    </span>
  );
};

const M3RaciRow = ({ d, task, v, flag }: { d: number; task: string; v: [string, string, string, string, string]; flag?: string }) => (
  <div style={{ position: 'relative' }}>
    <div className={b.left(1)} style={{ display: 'flex', alignItems: 'center', height: 76, borderTop: `1.5px solid ${C.rule}`, ...dl(d) }}>
      <span style={{ width: 380, fontSize: 26, color: C.ink }}>{task}</span>
      <M3R v={v[0]} />
      <M3R v={v[1]} />
      <M3R v={v[2]} />
      <M3R v={v[3]} />
      <M3R v={v[4]} />
    </div>
    {flag ? (
      <div className={b.fade(2)} style={{ position: 'absolute', left: -10, top: 4, width: 1140, height: 68, borderRadius: 12, boxShadow: `inset 0 0 0 3px ${C.coral}`, pointerEvents: 'none' }}>
        <span style={{ position: 'absolute', left: 1160, top: 14, whiteSpace: 'nowrap', fontSize: 23, fontWeight: 700, color: T.coral.fg }}>{flag}</span>
      </div>
    ) : null}
  </div>
);

const M3Who = ({ name }: { name: string }) => <span style={{ width: 150, textAlign: 'center', fontFamily: display, fontWeight: 700, fontSize: 26, color: C.ink }}>{name}</span>;

const M3_Raci: Page = () => (
  <Frame mod={3} kind="atelier" beats={2} label="Atelier 1 · Étape 5 · Répartir">
    <Title>Étape 5 · Qui fait quoi ? La matrice RACI</Title>
    <Lede>R réalise · A approuve (un seul !) · C est consulté · I est informé. Premier jet de l’IA :</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1140, ...dl(100) }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 56 }}>
        <span style={{ width: 380 }} />
        <M3Who name="Karim" />
        <M3Who name="Luc" />
        <M3Who name="Julie" />
        <M3Who name="Maxime" />
        <M3Who name="Annie" />
      </div>
      <M3RaciRow d={0} task="Charte et budget" v={['R', 'A', 'C', 'C', 'C']} />
      <M3RaciRow d={100} task="Permis et travaux" v={['R', 'A', '', '', 'I']} />
      <M3RaciRow d={200} task="Recrutement" v={['A', 'A', 'R', '', '']} flag="Deux A" />
      <M3RaciRow d={300} task="Caisse et réseau" v={['A', 'I', 'I', '', 'R']} />
      <M3RaciRow d={400} task="Campagne d’ouverture" v={['A', 'C', 'I', 'R', 'I']} />
      <M3RaciRow d={500} task="Inauguration" v={['R', 'C', 'C', 'C', 'C']} flag="Aucun A" />
    </div>
    <Callout cls={b.on(2)} title="Pourquoi l’IA se trompe ici" tone="coral" icon="alert" size={25} style={{ position: 'absolute', left: 120, top: 860, width: 1680, padding: '14px 26px', ...dl(400) }}>
      Elle ne connaît pas votre organisation : qui a vraiment l’autorité. La RACI se valide avec les personnes concernées.
    </Callout>
  </Frame>
);

// ─── M3 · From list to board ────────────────────────────────────────────────
const M3Col = ({ x, title, tone, children }: { x: number; title: string; tone: Tone; children?: ReactNode }) => (
  <div style={{ position: 'absolute', left: x, top: 0, width: 300, height: 600, boxSizing: 'border-box', background: C.panel, borderRadius: 14, padding: '16px 14px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <span style={{ width: 14, height: 14, borderRadius: 99, background: STRONG[tone] }} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 24, letterSpacing: '0.06em', color: C.soft }}>{title}</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
  </div>
);

const M3Task = ({ i, title, who, due }: { i: number; title: string; who: string; due: string }) => (
  <div className={b.pop(1)} style={{ ...vars({ o: 'left top' }), ...dl(i * 120) }}>
    <div style={{ background: C.card, borderRadius: 10, boxShadow: SHADOW_SM, padding: '12px 14px' }}>
      <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.3, color: C.ink }}>{title}</div>
      <div className={b.fade(2)} style={{ marginTop: 8, display: 'flex', gap: 8, ...dl(i * 80) }}>
        <Tag tone="blue" size={18}>
          {who}
        </Tag>
        <Tag tone="grey" size={18}>
          {due}
        </Tag>
      </div>
    </div>
  </div>
);

const M3_Board: Page = () => (
  <Frame mod={3} kind="atelier" beats={3} label="Atelier 1 · Transférer dans l’outil">
    <Title>Du plan aux tâches : dans l’outil, pas dans un document</Title>
    <Lede>Un plan qui reste dans une conversation ne se suit pas. On le transforme en tâches.</Lede>
    <Code title="Réponse de l’IA (extrait)" size={21} cls={A.left} style={{ position: 'absolute', left: 120, top: 280, width: 560, ...dl(100) }}>
      {'| Tâche               | Resp. | Fin    |\n'}
      {'|---------------------|-------|--------|\n'}
      {'| Déposer les plans   | Karim | 13 nov |\n'}
      {'| Afficher mécaniciens| Julie | 7 déc  |\n'}
      {'| Choisir la caisse   | Annie | 22 jan |\n'}
      {'| Signer comptoirs    | Karim | 15 jan |\n'}
      {'| Lancer la campagne  | Maxime| 1 mars |'}
    </Code>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 640, width: 560, display: 'flex', flexDirection: 'column', gap: 12, ...dl(300) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, color: C.ink }}>
        <AppTile id="notion" size={38} /> Coller le tableau : Notion crée la base
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, color: C.ink }}>
        <AppTile id="clickup" size={38} /> Importer un CSV, ou générer les tâches
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, color: C.ink }}>
        <AppTile id="planner" size={38} /> Planner : créer le plan avec Copilot
      </div>
    </div>
    <div style={{ position: 'absolute', left: 740, top: 280, width: 1060, height: 600 }}>
      <M3Col x={0} title="À FAIRE" tone="grey">
        <M3Task i={0} title="Afficher les postes de mécanicien" who="Julie" due="7 déc." />
        <M3Task i={1} title="Choisir le logiciel de caisse" who="Annie" due="22 janv." />
        <M3Task i={2} title="Signer le contrat des comptoirs" who="Karim" due="15 janv." />
      </M3Col>
      <M3Col x={330} title="EN COURS" tone="blue">
        <M3Task i={3} title="Déposer les plans à la Ville" who="Karim" due="13 nov." />
      </M3Col>
      <M3Col x={660} title="À VALIDER" tone="yellow">
        <M3Task i={4} title="Charte du projet" who="Luc" due="9 nov." />
      </M3Col>
    </div>
    <Callout cls={b.on(3)} title="La valeur" tone="green" icon="check" size={25} style={{ position: 'absolute', left: 740, top: 900, width: 1060, padding: '10px 22px' }}>
      Chaque tâche a un responsable et une date : demain, l’IA pourra suivre et alerter.
    </Callout>
  </Frame>
);

// ─── M3 · Verification checklist ────────────────────────────────────────────
const M3_Check: Page = () => (
  <Frame mod={3} kind="exercice" label="Atelier 1 · Vérifier">
    <Title>Grille de contrôle : votre plan est-il prêt ?</Title>
    <Lede>Passez votre plan à la grille. Ce que l’IA ne coche jamais seule : la réalité.</Lede>
    <Checklist cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, ...dl(100) }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <div style={{ width: 1100, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <CheckItem id="m3-dates" w={2}>
            Les durées clés ont été validées par une personne qui sait
          </CheckItem>
          <CheckItem id="m3-dep">Les dépendances entre tâches sont indiquées</CheckItem>
          <CheckItem id="m3-crit">Le chemin critique est identifié</CheckItem>
          <CheckItem id="m3-owner" w={2}>
            Chaque tâche a un responsable (un seul) et une date
          </CheckItem>
          <CheckItem id="m3-cal">Le calendrier réel est respecté : Fêtes, congés, semaine de relâche</CheckItem>
          <CheckItem id="m3-risk">Chaque risque majeur a une mesure et un responsable</CheckItem>
          <CheckItem id="m3-budget">Les montants concordent avec le budget de 420 k$</CheckItem>
          <CheckItem id="m3-invent" w={2}>
            Aucun fait inventé : délais de permis, règles, chiffres vérifiés
          </CheckItem>
        </div>
        <CheckScore
          max={11}
          label="Plan prêt à présenter ?"
          style={{ width: 540, alignSelf: 'flex-start' }}
          levels={[
            { min: 0, text: 'Premier jet : à retravailler', tone: 'coral' },
            { min: 6, text: 'Presque : complétez les trous', tone: 'yellow' },
            { min: 10, text: 'Prêt à présenter à Luc', tone: 'green' },
          ]}
        />
      </div>
    </Checklist>
  </Frame>
);

// ─── M3 · Spot the traps ────────────────────────────────────────────────────
const M3Line = ({ children, warn }: { children: ReactNode; warn?: boolean }) => (
  <div style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: `1.5px solid ${C.rule}`, fontSize: 25, lineHeight: 1.35, color: C.ink, background: warn ? 'transparent' : 'transparent' }}>
    {children}
  </div>
);

const M3_Traps: Page = () => (
  <Frame mod={3} kind="exercice" beats={4} label="Atelier 1 · Vérifier">
    <Title>Repérez les quatre pièges de ce plan généré</Title>
    <Lede>Il a l’air complet. Cherchez avant de cliquer sur les pastilles.</Lede>
    <AppWin id="chatgpt" title="Plan proposé (extrait)" cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1020, ...dl(100) }} pad={26}>
      <M3Line>
        <b style={{ width: 170, flex: 'none' }}>Sem. 2</b> Dépôt du permis · obtention prévue en 2 semaines
      </M3Line>
      <M3Line>
        <b style={{ width: 170, flex: 'none' }}>Sem. 4 à 13</b> Travaux d’aménagement, 10 semaines continues
      </M3Line>
      <M3Line>
        <b style={{ width: 170, flex: 'none' }}>Sem. 12</b> Formation de l’équipe à la caisse
      </M3Line>
      <M3Line>
        <b style={{ width: 170, flex: 'none' }}>Sem. 15</b> Installation du logiciel de caisse
      </M3Line>
      <M3Line>
        <b style={{ width: 170, flex: 'none' }}>Sem. 16</b> Affichage des postes de mécanicien
      </M3Line>
      <M3Line>
        <b style={{ width: 170, flex: 'none' }}>Sem. 23</b> Ouverture, samedi 10 avril
      </M3Line>
    </AppWin>
    <M3Pin n={1} x={1110} y={377} />
    <M3Pin n={2} x={1110} y={437} />
    <M3Pin n={3} x={1110} y={497} />
    <M3Pin n={4} x={1110} y={616} />
    <div style={{ position: 'absolute', left: 1190, top: 270, width: 610, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M3Exp n={1} title="Une durée inventée">
        Le dossier dit 6 semaines. L’IA a pris une valeur « typique ».
      </M3Exp>
      <M3Exp n={2} title="Les Fêtes oubliées">
        Les semaines 4 à 13 traversent Noël : chantiers fermés 2 semaines.
      </M3Exp>
      <M3Exp n={3} title="Un ordre impossible">
        Former à la caisse avant de l’installer : dépendance inversée.
      </M3Exp>
      <M3Exp n={4} title="Trop tard">
        Mécaniciens rares : en semaine 16, on n’a plus le temps de recruter.
      </M3Exp>
    </div>
    <Callout cls={A.in} title="Votre méthode" tone="yellow" icon="search" size={25} style={{ position: 'absolute', left: 120, top: 780, width: 1020, ...dl(400) }}>
      Confrontez chaque ligne au dossier et au calendrier réel. Demandez à l’IA : « Quelles dates as-tu supposées ? »
    </Callout>
  </Frame>
);

// ─── M3 · Work time ─────────────────────────────────────────────────────────
const M3_Work: Page = () => (
  <Frame mod={3} kind="atelier" label="Atelier 1 · À vous">
    <Title>À vous de jouer !</Title>
    <Lede>Votre plan du projet Limoilou, dans Notion AI, ClickUp ou votre outil de secours.</Lede>
    <Timer id="m3-work" minutes={45} label="Atelier 1" cls={A.in} style={{ position: 'absolute', left: 120, top: 290, ...dl(100) }} />
    <Checklist cls={A.in} style={{ position: 'absolute', left: 640, top: 290, width: 1160, ...dl(250) }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CheckItem id="m3w-1">Charte en une page, avec ce qui manque</CheckItem>
        <CheckItem id="m3w-2">Découpage : 6 à 8 lots, tâches de 1 à 2 semaines</CheckItem>
        <CheckItem id="m3w-3">Échéancier : 3 jalons datés et le chemin critique</CheckItem>
        <CheckItem id="m3w-4">5 risques avec une mesure chacun</CheckItem>
        <CheckItem id="m3w-5">RACI vérifiée : un seul A par ligne</CheckItem>
        <CheckItem id="m3w-6">Les tâches dans l’outil, avec responsable et date</CheckItem>
        <CheckItem id="m3w-7">Grille de contrôle passée</CheckItem>
      </div>
    </Checklist>
    <Callout cls={A.in} title="Coincés ?" tone="blue" icon="chat" size={25} style={{ position: 'absolute', left: 120, top: 760, width: 460, ...dl(400) }}>
      Écrivez « bloqué » dans le clavardage, ou demandez à l’IA ses questions.
    </Callout>
  </Frame>
);

// ─── M3 · Debrief ───────────────────────────────────────────────────────────
const M3_Debrief: Page = () => (
  <Frame mod={3} kind="atelier" label="Atelier 1 · Débriefing">
    <Title>Débriefing : ce que l’IA a fait… et ce que vous avez fait</Title>
    <Lede>Quelques volontaires partagent leur écran 2 minutes. Les autres répondent dans le clavardage.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 820, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AskCard n={1} title="Qu’est-ce que l’IA a bien fait ?" sub="Structure, rapidité, idées de risques…" d={100} />
      <AskCard n={2} title="Qu’avez-vous dû corriger ?" sub="Dates, dépendances, responsables, oublis" d={220} />
      <AskCard n={3} title="Le referiez-vous avec l’IA ?" sub="Sur votre prochain vrai projet" d={340} />
    </div>
    <div style={{ position: 'absolute', left: 1000, top: 280, width: 800 }}>
      <Eyebrow cls={A.in} c={C.violet} style={dl(200)}>
        Sondage · temps gagné par rapport à un plan fait seul
      </Eyebrow>
      <Hint cls={A.in} style={{ marginTop: 8, ...dl(260) }}>
        Dans le clavardage : un numéro par personne
      </Hint>
      <Poll cls={A.in} style={{ marginTop: 22, ...dl(360) }}>
        <PollRow id="lose" icon="clock" tone="coral" label="1 · Aucun, voire du temps perdu" />
        <PollRow id="some" icon="clock" tone="yellow" label="2 · Un peu : environ 25 %" />
        <PollRow id="half" icon="clock" tone="teal" label="3 · Beaucoup : environ la moitié" />
        <PollRow id="lots" icon="rocket" tone="green" label="4 · Énormément : plus de la moitié" />
      </Poll>
    </div>
  </Frame>
);

// ─── Day 1 · Wrap-up ────────────────────────────────────────────────────────
const J1Mod = ({ n, tone, title, d, children }: { n: number; tone: Tone; title: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 400, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '30px 30px' }}>
      <Num n={pad(n)} tone={tone} size={56} />
      <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 12, fontSize: 25, lineHeight: 1.45, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const J1_Wrap: Page = () => (
  <Frame mod={3} kind="synthese" label="Bilan du jour 1">
    <Title>Bilan du jour 1</Title>
    <Lede>Ce matin, comprendre. Cet après-midi, planifier avec l’IA et vérifier.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', gap: 30 }}>
      <J1Mod n={1} tone="blue" title="Introduction à l’IA" d={100}>
        Elle apprend d’exemples, prédit le mot probable, et peut inventer avec aplomb.
      </J1Mod>
      <J1Mod n={2} tone="teal" title="L’IA en gestion de projet" d={220}>
        Planifier, suivre, rendre compte, communiquer. Une demande en cinq ingrédients.
      </J1Mod>
      <J1Mod n={3} tone="yellow" title="Atelier 1" d={340}>
        Un plan généré en minutes, mais vérifié ligne par ligne : dates, dépendances, RACI.
      </J1Mod>
    </div>
    <Callout cls={A.in} title="Demain" tone="green" icon="calendar" size={27} style={{ position: 'absolute', left: 120, top: 740, width: 1680, ...dl(500) }}>
      Comptes rendus et résumés de réunions, suivi et alertes, limites et éthique, puis le mini-projet de l’atelier 2.
    </Callout>
  </Frame>
);

const J1Ticket = ({ n, icon, tone, title, children }: { n: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, ...dl(n * 140) }}>
    <div style={{ boxSizing: 'border-box', height: 330, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '30px 30px' }}>
      <IconTile name={icon} tone={tone} size={72} solid />
      <div style={{ marginTop: 20, fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 10, fontSize: 25, lineHeight: 1.45, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const J1_Exit: Page = () => (
  <Frame mod={3} label="Fin du jour 1">
    <Title>Billet de sortie</Title>
    <Lede>Avant de partir : trois réponses courtes, dans le clavardage.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 30 }}>
      <J1Ticket n={1} icon="bulb" tone="blue" title="Une chose apprise">
        Ce qui vous a le plus surpris aujourd’hui.
      </J1Ticket>
      <J1Ticket n={2} icon="chat" tone="violet" title="Une question">
        Ce qui reste flou, on y répond demain matin.
      </J1Ticket>
      <J1Ticket n={3} icon="rocket" tone="green" title="Un essai ce soir">
        Une demande en cinq ingrédients sur votre vrai projet.
      </J1Ticket>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 700, display: 'flex', alignItems: 'center', gap: 26, ...dl(600) }}>
      <MiniSquares size={56} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 64, color: C.ink }}>Merci, et à demain 9 h !</span>
    </div>
    <Squares s={170} x={1574} y={700} delay={500} />
  </Frame>
);

// ═══ 50-j2 ═════════════════════════════════════════════════════════════

// ─── Day 2 · Cover ──────────────────────────────────────────────────────────
// Meeting → notes → tasks: three tiles linked by marching arrows.
const J2Tile = ({ x, y, icon, tone, label, d }: { x: number; y: number; icon: IconName; tone: Tone; label: string; d: number }) => (
  <div className={A.pop} style={{ position: 'absolute', left: x, top: y, width: 190, ...dl(d) }}>
    <div style={{ width: 190, height: 190, borderRadius: 32, background: C.card, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <IconTile name={icon} tone={tone} size={110} solid />
    </div>
    <div style={{ marginTop: 14, textAlign: 'center', fontFamily: display, fontWeight: 700, fontSize: 28, letterSpacing: '0.06em', color: C.ink }}>{label}</div>
  </div>
);

const J2_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <img src={logoStack} alt="Technologia" className={A.fade} style={{ position: 'absolute', left: 112, top: 78, height: 150, display: 'block' }} />
    <div style={{ position: 'absolute', left: 120, top: 318, width: 960 }}>
      <Eyebrow cls={A.in} size={28}>
        Formation IA124 · Jour 2
      </Eyebrow>
      <h1 className={A.in} style={{ margin: '18px 0 0', fontFamily: display, fontWeight: 700, fontSize: 118, lineHeight: 1.0, letterSpacing: '-0.01em', color: C.ink, ...dl(120) }}>
        IA appliquée à la
        <br />
        gestion de projet
      </h1>
      <div className={A.in} style={{ marginTop: 46, display: 'inline-flex', alignItems: 'stretch', background: C.card, borderRadius: 14, boxShadow: SHADOW, overflow: 'hidden', ...dl(300) }}>
        <span style={{ display: 'flex', alignItems: 'center', padding: '0 24px', background: G.green, color: '#fff', fontFamily: display, fontWeight: 700, fontSize: 34, letterSpacing: '0.08em' }}>JOUR 2</span>
        <span style={{ padding: '16px 28px', fontSize: 30, fontWeight: 500, color: C.ink }}>Automatiser, collaborer et adopter l’IA</span>
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 870, display: 'flex', alignItems: 'center', gap: 22, ...dl(520) }}>
      <img src={formateur} alt={AUTHOR} style={{ width: 96, height: 96, borderRadius: 999, objectFit: 'cover', objectPosition: '50% 20%', display: 'block', boxShadow: `0 0 0 4px #fff, 0 0 0 7px ${C.yellow}` }} />
      <div>
        <div style={{ fontSize: 30, fontWeight: 600, color: C.ink }}>{AUTHOR}</div>
        <div style={{ fontSize: 24, color: C.muted }}>Formateur · Technologia</div>
      </div>
    </div>
    <Squares s={230} x={1500} y={650} delay={200} />
    <svg width={1920} height={120} style={{ position: 'absolute', left: 0, top: 380, overflow: 'visible' }}>
      <path d="M1278 60 H1326" stroke={C.blue} strokeWidth={4} strokeDasharray="10 14" className={A.march} />
      <path d="M1528 60 H1576" stroke={C.blue} strokeWidth={4} strokeDasharray="10 14" className={A.march} />
    </svg>
    <J2Tile x={1080} y={345} icon="video" tone="violet" label="RÉUNION" d={500} />
    <J2Tile x={1330} y={345} icon="note" tone="blue" label="COMPTE RENDU" d={800} />
    <J2Tile x={1580} y={345} icon="kanban" tone="green" label="TÂCHES" d={1100} />
  </Frame>
);

// ─── Day 2 · Reactivation (flip cards) ──────────────────────────────────────
const J2Flip = ({ n, q, a }: { n: number; q: string; a: ReactNode }) => (
  <FlipCard
    w={530}
    h={280}
    tone="violet"
    backTone="green"
    front={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Num n={n} tone="violet" size={50} />
        <div style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.3, color: C.ink }}>{q}</div>
      </div>
    }
    back={<div style={{ fontSize: 28, lineHeight: 1.45, color: C.ink }}>{a}</div>}
  />
);

const J2_Recall: Page = () => (
  <Frame mod={0} kind="qcm" label="Jour 2 · Réactivation">
    <Title>Cinq questions pour se réveiller</Title>
    <Lede>Répondez dans le clavardage, puis on retourne la carte. Et vos questions d’hier ?</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 530px)', rowGap: 30, columnGap: 45, ...dl(150) }}>
      <J2Flip n={1} q="À partir de quoi une IA apprend-elle ?" a={<>D’<b>exemples</b>, pas de règles écrites à la main. Elle en tire un modèle.</>} />
      <J2Flip n={2} q="Comment un LLM choisit-il ses mots ?" a={<>Il prédit le mot le plus <b>probable</b>, pas le plus vrai. D’où les hallucinations.</>} />
      <J2Flip n={3} q="Les cinq ingrédients d’une bonne demande ?" a={<>Rôle, contexte, tâche, format, contraintes.</>} />
      <J2Flip n={4} q="Combien de A par ligne dans une RACI ?" a={<>Un seul. Deux A, c’est personne ; aucun A, c’est personne non plus.</>} />
      <J2Flip n={5} q="Automatisation ou IA : « si retard, alors courriel » ?" a={<>Automatisation : une règle fixe. L’IA <b>anticiperait</b> le retard.</>} />
      <div style={{ width: 530, height: 280, boxSizing: 'border-box', borderRadius: 18, border: `3px dashed ${C.rule}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, color: C.muted }}>
        <Icon name="chat" size={56} color={C.violet} />
        <span style={{ fontSize: 28, fontWeight: 600, color: C.ink }}>Vos questions d’hier</span>
        <span style={{ fontSize: 22 }}>Billets de sortie</span>
      </div>
    </div>
  </Frame>
);

const J2_Program: Page = () => (
  <Frame mod={0} label="Jour 2 · Programme">
    <Title>Aujourd’hui : automatiser, collaborer, adopter</Title>
    <ProgramCols today={2} />
  </Frame>
);

// ═══ 60-m4 ═════════════════════════════════════════════════════════════

// ─── M4 · Divider ───────────────────────────────────────────────────────────
const M4_Divider: Page = () => (
  <Section n={4} title="Automatiser et collaborer avec l’IA" sub="Réunions, comptes rendus, suivi des tâches : ce qui se répète chaque semaine." dur="≈ 1 h 15">
    <SecItem n={1}>Comptes rendus et résumés de réunions</SecItem>
    <SecItem n={2}>Des actions aux tâches, sans ressaisie</SecItem>
    <SecItem n={3}>Suivi des tâches et alertes intelligentes</SecItem>
    <SecItem n={4}>Travailler en équipe avec l’IA</SecItem>
  </Section>
);
M4_Divider.transition = BLOOM;

// ─── M4 · Before / during / after the meeting ───────────────────────────────
const M4Moment = ({ n, tone, icon, when, children }: { n: number; tone: Tone; icon: IconName; when: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ flex: 1 }}>
    <div style={{ boxSizing: 'border-box', height: 470, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '30px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <IconTile name={icon} tone={tone} size={70} solid />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 48, color: C.ink }}>{when}</span>
      </div>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 20 }}>{children}</div>
    </div>
  </div>
);

const M4Do = ({ icon, children }: { icon: IconName; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, fontSize: 26, lineHeight: 1.35, color: C.ink }}>
    <Icon name={icon} size={30} color={C.blue} style={{ marginTop: 3 }} />
    <span>{children}</span>
  </div>
);

const M4_Meeting: Page = () => (
  <Frame mod={4} beats={3}>
    <Title>Une réunion, trois moments où l’IA aide</Title>
    <Lede>11 heures de réunions par semaine pour Karim. Voici où l’IA lui rend du temps.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 30 }}>
      <M4Moment n={1} tone="blue" icon="calendar" when="Avant">
        <M4Do icon="list">Proposer l’ordre du jour à partir des tâches en retard</M4Do>
        <M4Do icon="doc">Résumer les documents à lire</M4Do>
        <M4Do icon="mail">Rédiger l’invitation et l’objectif</M4Do>
      </M4Moment>
      <M4Moment n={2} tone="violet" icon="mic" when="Pendant">
        <M4Do icon="mic">Transcrire, avec l’accord des participants</M4Do>
        <M4Do icon="search">« Qu’a-t-on décidé jusqu’ici ? »</M4Do>
        <M4Do icon="clock">Rattraper quelqu’un qui arrive en retard</M4Do>
      </M4Moment>
      <M4Moment n={3} tone="green" icon="check" when="Après">
        <M4Do icon="note">Compte rendu : décisions, actions, points ouverts</M4Do>
        <M4Do icon="kanban">Créer les tâches dans l’outil</M4Do>
        <M4Do icon="send">Courriel de suivi aux absents</M4Do>
      </M4Moment>
    </div>
  </Frame>
);

// ─── M4 · From transcript to minutes (animated extraction) ──────────────────
CSS.push(`
.${P}-m4t{transition:background 450ms ${EASE},box-shadow 450ms ${EASE}}
${at(1)} .${P}-m4t-dec{background:${T.green.bg};box-shadow:inset 5px 0 0 ${C.green}}
${at(2)} .${P}-m4t-act{background:${T.blue.bg};box-shadow:inset 5px 0 0 ${C.blue}}
${at(3)} .${P}-m4t-open{background:${T.yellow.bg};box-shadow:inset 5px 0 0 ${C.yellow}}
`);

const M4Say = ({ who, kind, children }: { who: string; kind?: 'dec' | 'act' | 'open'; children: ReactNode }) => (
  <div className={cx(k('m4t'), kind && k(`m4t-${kind}`))} style={{ display: 'flex', gap: 14, padding: '9px 14px', borderRadius: 8, fontSize: 23, lineHeight: 1.35 }}>
    <span style={{ width: 92, flex: 'none', fontWeight: 700, color: C.soft }}>{who}</span>
    <span style={{ color: C.ink }}>{children}</span>
  </div>
);

const M4Sec = ({ n, tone, title, children }: { n: number; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ marginTop: 14, ...dl(250) }}>
    <Eyebrow c={T[tone].fg} size={21}>
      {title}
    </Eyebrow>
    <div style={{ marginTop: 6, background: T[tone].bg, borderRadius: 10, padding: '10px 16px', fontSize: 23, lineHeight: 1.45, color: C.ink }}>{children}</div>
  </div>
);

const M4_Transcript: Page = () => (
  <Frame mod={4} kind="demo" beats={3}>
    <Title>De la transcription au compte rendu</Title>
    <Lede>Réunion de suivi du mardi 2 février, 6 personnes, 40 minutes. Extrait de la transcription :</Lede>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 270, width: 880, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 18px', ...dl(100) }}>
      <M4Say who="Karim">Les comptoirs arrivent le 19 au lieu du 5.</M4Say>
      <M4Say who="Luc">On peut faire la pose un samedi ?</M4Say>
      <M4Say who="Karim" kind="dec">
        Le fournisseur dit oui. On part là-dessus : pose le samedi 20.
      </M4Say>
      <M4Say who="Annie" kind="act">
        Moi, j’avance le câblage réseau pendant ce temps, d’ici le 12.
      </M4Say>
      <M4Say who="Maxime" kind="open">
        Et les portes ouvertes ? On garde le 3 avril ?
      </M4Say>
      <M4Say who="Luc" kind="open">
        On en reparle jeudi, je veux voir l’impact.
      </M4Say>
      <M4Say who="Julie" kind="act">
        Je relance les deux candidats mécaniciens demain.
      </M4Say>
      <M4Say who="Karim">Parfait, merci tout le monde.</M4Say>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1060, top: 270, width: 740, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 6px 0 0 ${C.violet}`, padding: '22px 28px 26px', ...dl(250) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon name="note" size={32} color={C.violet} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>Compte rendu · 2 février</span>
      </div>
      <M4Sec n={1} tone="green" title="Décision">
        Pose des comptoirs le samedi 20 février.
      </M4Sec>
      <M4Sec n={2} tone="blue" title="Actions">
        <b>Annie</b> · avancer le câblage réseau · 12 févr.
        <br />
        <b>Julie</b> · relancer 2 candidats · 3 févr.
      </M4Sec>
      <M4Sec n={3} tone="yellow" title="Point ouvert">
        Date des portes ouvertes (3 avril ?) : Luc tranche jeudi.
      </M4Sec>
    </div>
  </Frame>
);

// ─── M4 · The minutes request (reusable template) ───────────────────────────
const M4Slot = ({ children }: { children: ReactNode }) => (
  <span style={{ background: T.yellow.bg, color: T.yellow.fg, borderRadius: 6, padding: '0 6px', fontWeight: 600 }}>{children}</span>
);

const M4Tip = ({ d, icon, children }: { d: number; icon: IconName; children: ReactNode }) => (
  <div className={A.right} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px', ...dl(d) }}>
    <IconTile name={icon} tone="green" size={52} />
    <span style={{ fontSize: 25, lineHeight: 1.35, color: C.ink }}>{children}</span>
  </div>
);

const M4_CrPrompt: Page = () => (
  <Frame mod={4}>
    <Title>La demande de compte rendu, prête à copier</Title>
    <Lede>À enregistrer dans votre bibliothèque. Les zones jaunes changent à chaque réunion.</Lede>
    <PromptBox cls={A.left} size={27} style={{ position: 'absolute', left: 120, top: 280, width: 1000, ...dl(100) }}>
      Tu es l’assistant du projet <M4Slot>Limoilou</M4Slot>. À partir de la transcription ci-dessous de la réunion du <M4Slot>2 février</M4Slot>, rédige le compte rendu en trois parties :
      <br />
      1. <b>Décisions</b> prises (seulement celles qui ont été clairement prises) ;
      <br />
      2. <b>Actions</b> : responsable, action, échéance ;
      <br />
      3. <b>Points ouverts</b> et qui doit trancher.
      <br />
      N’invente rien : si une information manque, écris <b>[à confirmer]</b>. 200 mots au maximum.
      <div style={{ marginTop: 10, fontFamily: mono, fontSize: 20, color: C.muted }}>[collez la transcription ou vos notes]</div>
    </PromptBox>
    <div style={{ position: 'absolute', left: 1170, top: 280, width: 630, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M4Tip d={300} icon="check">
        « Seulement celles clairement prises » évite les fausses décisions.
      </M4Tip>
      <M4Tip d={420} icon="alert">
        « [à confirmer] » rend visibles les trous au lieu de les combler.
      </M4Tip>
      <M4Tip d={540} icon="users">
        Ajoutez la liste des participants : moins d’erreurs de noms.
      </M4Tip>
      <M4Tip d={660} icon="eye">
        Relisez toujours avant de diffuser : vous signez le compte rendu.
      </M4Tip>
    </div>
  </Frame>
);

// ─── M4 · Exercise: find the errors in the generated minutes ────────────────
const M4CrLine = ({ children }: { children: ReactNode }) => <div style={{ fontSize: 25, lineHeight: 1.45, color: C.ink, padding: '4px 0' }}>{children}</div>;

const M4_CrErrors: Page = () => (
  <Frame mod={4} kind="exercice" beats={4}>
    <Title>Repérez les quatre erreurs de ce compte rendu</Title>
    <Lede>Généré à partir de la même réunion, avec une demande trop vague. Comparez avec la transcription.</Lede>
    <AppWin id="teams" title="Compte rendu généré" cls={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1020, ...dl(100) }} pad={28}>
      <Eyebrow c={T.green.fg} size={21}>
        Décisions
      </Eyebrow>
      <M4CrLine>• Pose des comptoirs le samedi 20 février.</M4CrLine>
      <M4CrLine>• Portes ouvertes reportées au 10 avril.</M4CrLine>
      <Eyebrow c={T.blue.fg} size={21} style={{ marginTop: 14 }}>
        Actions
      </Eyebrow>
      <M4CrLine>• Maxime : avancer le câblage réseau, d’ici le 12 février.</M4CrLine>
      <M4CrLine>• Julie : relancer les candidats d’ici le 15 février.</M4CrLine>
      <Eyebrow c={T.yellow.fg} size={21} style={{ marginTop: 14 }}>
        Points ouverts
      </Eyebrow>
      <M4CrLine>• Aucun.</M4CrLine>
    </AppWin>
    <M3Pin n={1} x={1110} y={449} />
    <M3Pin n={2} x={1110} y={532} />
    <M3Pin n={3} x={1110} y={576} />
    <M3Pin n={4} x={1110} y={659} />
    <div style={{ position: 'absolute', left: 1190, top: 280, width: 610, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M3Exp n={1} title="Une fausse décision">
        On a seulement discuté des portes ouvertes. Luc tranche jeudi.
      </M3Exp>
      <M3Exp n={2} title="La mauvaise personne">
        C’est Annie qui avance le câblage, pas Maxime.
      </M3Exp>
      <M3Exp n={3} title="Une date inventée">
        Julie a dit « demain », soit le 3 février.
      </M3Exp>
      <M3Exp n={4} title="Un point ouvert effacé">
        La date des portes ouvertes reste à trancher.
      </M3Exp>
    </div>
  </Frame>
);

// ─── M4 · Meeting summary tools ─────────────────────────────────────────────
const M4ToolRow = ({ d, id, where, what, note }: { d: number; id: AppId; where: string; what: string; note: string }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', minHeight: 104, borderTop: `1.5px solid ${C.rule}`, ...dl(d) }}>
    <span style={{ width: 340, flex: 'none' }}>
      <AppChip id={id} size={26} />
    </span>
    <span style={{ width: 300, flex: 'none', fontSize: 24, color: C.soft, paddingRight: 20 }}>{where}</span>
    <span style={{ width: 520, flex: 'none', fontSize: 24, lineHeight: 1.35, color: C.ink, paddingRight: 20 }}>{what}</span>
    <span style={{ flex: 1, fontSize: 22, lineHeight: 1.35, color: C.muted }}>{note}</span>
  </div>
);

const M4Th = ({ w, children }: { w?: number; children: ReactNode }) => (
  <span style={{ width: w, flex: w ? 'none' : 1, fontFamily: display, fontWeight: 600, fontSize: 21, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.muted }}>{children}</span>
);

const M4_Tools: Page = () => (
  <Frame mod={4}>
    <Title>Résumés de réunions : les principaux outils</Title>
    <Lede>Même promesse : transcrire, résumer, extraire les actions. La différence : où vont vos données.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '14px 32px 8px', ...dl(100) }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 52 }}>
        <M4Th w={340}>Outil</M4Th>
        <M4Th w={300}>Où</M4Th>
        <M4Th w={520}>Ce qu’il produit</M4Th>
        <M4Th>À savoir</M4Th>
      </div>
      <M4ToolRow d={150} id="teams" where="Réunions Teams" what="Récapitulatif, tâches de suivi, questions sur la réunion" note="Licence Copilot ; transcription requise" />
      <M4ToolRow d={250} id="google" where="Google Meet" what="« Prendre des notes pour moi » : notes dans un Doc" note="Selon l’édition Workspace" />
      <M4ToolRow d={350} id="zoom" where="Réunions Zoom" what="Résumé et prochaines étapes (AI Companion)" note="Comptes Zoom payants" />
      <M4ToolRow d={450} id="otter" where="Toute réunion" what="Un assistant rejoint l’appel, transcrit et résume" note="Service externe : à faire approuver" />
      <M4ToolRow d={550} id="notion" where="Dans Notion" what="Notes de réunion transcrites et résumées dans la page" note="Selon le forfait Notion" />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 920, fontSize: 22, color: C.muted, ...dl(800) }}>
      Les offres évoluent vite : vérifiez langue française, licence et lieu d’hébergement des données avant d’adopter un outil.
    </div>
  </Frame>
);

// ─── M4 · Recording rules ───────────────────────────────────────────────────
const M4Rule = ({ d, icon, tone, title, children }: { d: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 22, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 24px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={58} solid />
    <div>
      <div style={{ fontSize: 27, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 23, lineHeight: 1.35, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M4_Consent: Page = () => (
  <Frame mod={4}>
    <Title>Transcrire une réunion : cinq règles</Title>
    <Lede>Une transcription contient des renseignements personnels et des propos spontanés.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1040, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M4Rule d={100} icon="megaphone" tone="blue" title="Annoncer et obtenir l’accord">
        Au début, à l’oral et dans l’invitation.
      </M4Rule>
      <M4Rule d={220} icon="lock" tone="coral" title="Pas pour les sujets sensibles">
        Ressources humaines, santé, conflits, négociations.
      </M4Rule>
      <M4Rule d={340} icon="shieldCheck" tone="green" title="Un outil approuvé">
        Celui que votre organisation a validé, pas un service découvert la veille.
      </M4Rule>
      <M4Rule d={460} icon="archive" tone="violet" title="Une durée de conservation">
        On garde le compte rendu, pas forcément l’enregistrement.
      </M4Rule>
      <M4Rule d={580} icon="eye" tone="yellow" title="Relire avant de diffuser">
        Celui qui envoie le compte rendu en est responsable.
      </M4Rule>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1220, top: 300, width: 580, ...dl(700) }}>
      <Quote by="Une phrase d’ouverture qui suffit">« Je propose d’activer la transcription pour le compte rendu. Quelqu’un s’y oppose ? »</Quote>
    </div>
  </Frame>
);

// ─── M4 · From actions to tasks ─────────────────────────────────────────────
const M4Act = ({ who, what, when }: { who: string; what: string; when: string }) => (
  <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 0', borderBottom: `1.5px solid ${C.rule}`, fontSize: 24, color: C.ink }}>
    <b style={{ width: 90, flex: 'none' }}>{who}</b>
    <span style={{ flex: 1 }}>{what}</span>
    <Tag tone="grey" size={20}>
      {when}
    </Tag>
  </div>
);

const M4Card = ({ n, who, what, when, tone }: { n: number; who: string; what: string; when: string; tone: Tone }) => (
  <div className={b.pop(n)} style={{ ...vars({ o: 'left center' }) }}>
    <div style={{ background: C.card, borderRadius: 14, boxShadow: `${SHADOW}, inset 6px 0 0 ${STRONG[tone]}`, padding: '16px 20px' }}>
      <div style={{ fontSize: 25, fontWeight: 600, color: C.ink }}>{what}</div>
      <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
        <Tag tone={tone} size={20}>
          {who}
        </Tag>
        <Tag tone="grey" size={20}>
          <Icon name="calendar" size={18} /> {when}
        </Tag>
        <Tag tone="violet" size={20}>
          <Icon name="link" size={18} /> CR 2 févr.
        </Tag>
      </div>
    </div>
  </div>
);

const M4_ToTasks: Page = () => (
  <Frame mod={4} beats={3}>
    <Title>Du compte rendu aux tâches, sans ressaisie</Title>
    <Lede>Une action qui reste dans un compte rendu est souvent une action oubliée.</Lede>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 280, width: 620, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 28px', ...dl(100) }}>
      <Eyebrow c={T.blue.fg} size={21}>
        Actions du compte rendu
      </Eyebrow>
      <M4Act who="Annie" what="Avancer le câblage réseau" when="12 févr." />
      <M4Act who="Julie" what="Relancer 2 candidats" when="3 févr." />
      <M4Act who="Karim" what="Confirmer la pose du 20" when="4 févr." />
    </div>
    <svg width={120} height={60} style={{ position: 'absolute', left: 770, top: 400, overflow: 'visible' }}>
      <path d="M0 30 H100" stroke={C.blue} strokeWidth={5} strokeDasharray="10 14" className={cx(A.march, b.fade(1))} />
      <path d="M92 16 L110 30 L92 44" fill="none" stroke={C.blue} strokeWidth={5} strokeLinecap="round" className={b.fade(1)} />
    </svg>
    <AppWin id="planner" title="Projet Limoilou · cette semaine" cls={A.right} style={{ position: 'absolute', left: 920, top: 280, width: 880, ...dl(200) }} pad={24}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <M4Card n={1} who="Annie" what="Avancer le câblage réseau" when="12 févr." tone="violet" />
        <M4Card n={2} who="Julie" what="Relancer 2 candidats mécaniciens" when="3 févr." tone="green" />
        <M4Card n={3} who="Karim" what="Confirmer la pose du samedi 20" when="4 févr." tone="blue" />
      </div>
    </AppWin>
    <Callout cls={A.in} title="Comment ?" tone="blue" icon="plug" size={25} style={{ position: 'absolute', left: 120, top: 640, width: 620, ...dl(500) }}>
      Selon l’outil : tâches proposées par le récapitulatif, demande « crée ces tâches », ou automatisation.
    </Callout>
  </Frame>
);

// ─── M4 · "If… then" rules ──────────────────────────────────────────────────
const M4Chip = ({ tone, label, children }: { tone: Tone; label: string; children: ReactNode }) => (
  <div style={{ flex: 1, background: T[tone].bg, borderRadius: 14, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, padding: '14px 18px' }}>
    <Eyebrow c={T[tone].fg} size={19}>
      {label}
    </Eyebrow>
    <div style={{ marginTop: 4, fontSize: 25, lineHeight: 1.3, color: C.ink }}>{children}</div>
  </div>
);

const M4RuleRow = ({ n, a, c, x, ai }: { n: number; a: ReactNode; c: ReactNode; x: ReactNode; ai?: boolean }) => (
  <div className={b.on(n)} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <M4Chip tone="blue" label="Quand">
      {a}
    </M4Chip>
    <FlowArrow w={46} />
    <M4Chip tone="yellow" label="Si">
      {c}
    </M4Chip>
    <FlowArrow w={46} />
    <M4Chip tone={ai ? 'violet' : 'green'} label={ai ? 'Alors (avec l’IA)' : 'Alors'}>
      {x}
    </M4Chip>
  </div>
);

const M4_Rules: Page = () => (
  <Frame mod={4} beats={3}>
    <Title>Le suivi automatique : des règles « si… alors »</Title>
    <Lede>Ce n’est pas encore de l’IA : c’est de l’automatisation. Et c’est déjà beaucoup de temps gagné.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', flexDirection: 'column', gap: 26 }}>
      <M4RuleRow n={1} a="Une tâche change de statut" c="le nouveau statut est « Bloquée »" x="Message à Karim dans Teams" />
      <M4RuleRow n={2} a="Chaque matin, 8 h" c="échéance dans 2 jours et tâche non commencée" x="Rappel au responsable" />
      <M4RuleRow n={3} a="Chaque vendredi, 14 h" c="tâches terminées cette semaine" x="L’IA rédige le brouillon du rapport" ai />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, display: 'flex', alignItems: 'center', gap: 26, ...dl(400) }}>
      <span style={{ fontSize: 24, fontWeight: 600, color: C.soft }}>Où les créer :</span>
      <AppChip id="clickup" size={24} />
      <AppChip id="planner" size={24} />
      <AppChip id="notion" size={24} />
      <AppChip id="trello" size={24} />
      <AppChip id="monday" size={24} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 840, fontSize: 22, color: C.muted, ...dl(500) }}>
      Planner passe par Power Automate ; Trello par ses règles d’automatisation ; les autres ont un menu « Automatisations ».
    </div>
  </Frame>
);

// ─── M4 · Smart alerts ──────────────────────────────────────────────────────
const M4Signal = ({ n, icon, children }: { n: number; icon: IconName; children: ReactNode }) => (
  <div className={b.left(n)} style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 25, lineHeight: 1.3, color: C.ink }}>
    <IconTile name={icon} tone="violet" size={48} />
    <span>{children}</span>
  </div>
);

const M4_Alerts: Page = () => (
  <Frame mod={4} beats={5}>
    <Title>L’alerte intelligente : voir venir le retard</Title>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 230, width: 620, height: 680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.faint}`, padding: '30px 32px' }}>
      <Eyebrow c={C.soft}>Alerte par règle</Eyebrow>
      <div style={{ marginTop: 8, fontFamily: display, fontWeight: 700, fontSize: 40, color: C.ink }}>Le constat</div>
      <div style={{ marginTop: 26, background: T.coral.bg, borderRadius: 12, padding: '18px 20px', fontSize: 26, lineHeight: 1.4, color: C.ink }}>
        <Icon name="bell" size={30} color={C.coral} style={{ display: 'inline-block', verticalAlign: '-6px', marginRight: 10 }} />
        « Soumission de l’électricien » est en retard de 4 jours.
      </div>
      <div style={{ marginTop: 26, fontSize: 25, lineHeight: 1.45, color: C.soft }}>Utile… mais le retard est déjà là.</div>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 800, top: 230, width: 1000, height: 680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.violet}`, padding: '30px 34px', ...dl(150) }}>
      <Eyebrow c={T.violet.fg}>Alerte intelligente</Eyebrow>
      <div style={{ marginTop: 8, fontFamily: display, fontWeight: 700, fontSize: 40, color: C.ink }}>L’anticipation, en croisant des signaux faibles</div>
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <M4Signal n={1} icon="clock">
          Aucune mise à jour de la tâche depuis 9 jours
        </M4Signal>
        <M4Signal n={2} icon="users">
          Son responsable a 3 autres tâches cette semaine
        </M4Signal>
        <M4Signal n={3} icon="route">
          Elle est sur le chemin critique du 5 mars
        </M4Signal>
        <M4Signal n={4} icon="chat">
          Dernier commentaire : « petit souci avec le maître électricien »
        </M4Signal>
      </div>
      <div className={b.on(5)} style={{ marginTop: 24, background: T.violet.bg, borderRadius: 12, padding: '16px 20px', fontSize: 25, lineHeight: 1.4, color: C.ink }}>
        <b>Risque de glissement du jalon du 5 mars.</b> Suggestion : appeler l’électricien aujourd’hui.
      </div>
    </div>
  </Frame>
);

// ─── M4 · Simulator: the project dashboard week by week ─────────────────────
const M4_DELTA = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 5, 6, 8, 8, 7];

const M4Alert = ({ show, tone, icon, children }: { show: boolean; tone: Tone; icon: IconName; children: ReactNode }) =>
  show ? (
    <div className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 14, background: T[tone].bg, borderRadius: 12, boxShadow: `inset 5px 0 0 ${STRONG[tone]}`, padding: '11px 16px', fontSize: 22, lineHeight: 1.35, color: C.ink, animationDuration: '450ms' }}>
      <Icon name={icon} size={26} color={T[tone].fg} />
      <span>{children}</span>
    </div>
  ) : null;

const M4Kpi = ({ label, value, tone }: { label: string; value: string; tone: Tone }) => (
  <div style={{ flex: 1, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 18px' }}>
    <div style={{ fontSize: 20, color: C.muted }}>{label}</div>
    <div style={{ fontFamily: display, fontWeight: 700, fontSize: 52, lineHeight: 1.05, color: tone === 'yellow' ? C.amber : STRONG[tone] }}>{value}</div>
  </div>
);

const M4_Sim: Page = () => {
  const [wk, setWk] = useState(10);
  const plan = Math.round((wk / 23) * 100);
  const delta = M4_DELTA[wk] ?? 0;
  const real = plan - delta;
  const meteo: Tone = delta < 3 ? 'green' : delta < 6 ? 'yellow' : 'coral';
  return (
    <Frame mod={4} kind="exercice">
      <Title>Simulateur : le tableau de bord de Karim, semaine après semaine</Title>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'flex', alignItems: 'center', gap: 28, ...dl(100) }}>
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 40, color: C.ink, width: 260 }}>Semaine {wk}</span>
        <Range value={wk} onChange={setWk} min={8} max={16} w={900} />
        <Hint>Glissez (ou flèches du clavier)</Hint>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 290, width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <M4Kpi label="Avancement prévu" value={`${plan} %`} tone="grey" />
          <M4Kpi label="Avancement réel" value={`${real} %`} tone={meteo} />
        </div>
        <div style={{ background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '16px 20px' }}>
          <div style={{ fontSize: 20, color: C.muted }}>Météo proposée par l’IA</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 14, alignItems: 'center' }}>
            <span style={{ width: 46, height: 46, borderRadius: 99, background: meteo === 'green' ? C.green : '#DCE3E8' }} />
            <span style={{ width: 46, height: 46, borderRadius: 99, background: meteo === 'yellow' ? C.yellow : '#DCE3E8' }} />
            <span style={{ width: 46, height: 46, borderRadius: 99, background: meteo === 'coral' ? C.coral : '#DCE3E8' }} />
            <span style={{ marginLeft: 8, fontFamily: display, fontWeight: 700, fontSize: 38, color: STRONG[meteo] === C.yellow ? C.amber : STRONG[meteo] }}>
              {meteo === 'green' ? 'VERT' : meteo === 'yellow' ? 'JAUNE' : 'ROUGE'}
            </span>
          </div>
        </div>
        <div style={{ background: C.panel, borderRadius: 14, padding: '16px 20px', fontSize: 23, lineHeight: 1.4, color: C.soft }}>
          L’IA propose, Karim décide. La météo envoyée à Luc reste <b>son</b> jugement.
        </div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 730, top: 290, width: 1070, height: 640, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 26px', ...dl(200) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <Icon name="bell" size={30} color={C.violet} />
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>Alertes et suggestions</span>
          {wk < 10 ? <span style={{ fontSize: 22, color: C.muted }}>· rien à signaler pour l’instant</span> : null}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <M4Alert show={wk >= 10} tone="yellow" icon="clock">
            Soumission de l’électricien : aucune mise à jour depuis 9 jours.
          </M4Alert>
          <M4Alert show={wk >= 11} tone="yellow" icon="users">
            Annie : 3 tâches la même semaine, charge estimée à 140 %.
          </M4Alert>
          <M4Alert show={wk >= 12} tone="coral" icon="alert">
            Logiciel de caisse non choisi : bloque la formation de l’équipe.
          </M4Alert>
          <M4Alert show={wk >= 13} tone="yellow" icon="chat">
            Fournisseur : « petite difficulté d’approvisionnement » (ton inquiet).
          </M4Alert>
          <M4Alert show={wk >= 14} tone="coral" icon="route">
            Jalon « Travaux finis » : glissement probable de 5 jours.
          </M4Alert>
          <M4Alert show={wk >= 15} tone="blue" icon="bulb">
            Suggestion : avancer le câblage réseau pendant l’attente.
          </M4Alert>
        </div>
      </div>
    </Frame>
  );
};

// ─── M4 · Friday report in 3 minutes ────────────────────────────────────────
const M4Flow = ({ n, icon, tone, title, children }: { n: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
    <IconTile name={icon} tone={tone} size={64} solid />
    <div>
      <div style={{ fontSize: 27, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 23, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M4_Report: Page = () => (
  <Frame mod={4} beats={4}>
    <Title>Le rapport du vendredi en trois minutes</Title>
    <Lede>L’automatisation rassemble, l’IA rédige, Karim juge. Chacun son rôle.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 700, display: 'flex', flexDirection: 'column', gap: 30 }}>
      <M4Flow n={1} icon="kanban" tone="grey" title="1. L’outil rassemble">
        Tâches terminées, en retard, à venir
      </M4Flow>
      <M4Flow n={2} icon="sparkles" tone="violet" title="2. L’IA rédige">
        Avancement, points d’attention, décisions
      </M4Flow>
      <M4Flow n={3} icon="humanCheck" tone="blue" title="3. Karim relit et juge">
        Corrige, ajuste la météo, ajoute le contexte
      </M4Flow>
      <M4Flow n={4} icon="send" tone="green" title="4. Luc reçoit">
        Le même format chaque semaine : il sait où regarder
      </M4Flow>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 900, top: 270, width: 900, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${C.yellow}`, padding: '26px 34px', ...dl(200) }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 34, color: C.ink }}>Rapport · semaine 14</span>
        <Tag tone="yellow" size={22}>
          MÉTÉO JAUNE
        </Tag>
      </div>
      <div style={{ marginTop: 16, fontSize: 24, lineHeight: 1.5, color: C.ink }}>
        <b>Avancement</b> : 55 % (prévu : 61 %).
        <br />
        <b>Fait</b> : permis obtenu, 6 embauches sur 8, logiciel de caisse choisi.
        <br />
        <b>Points d’attention</b> : électricité (5 jours de retard), comptoirs livrés le 19.
        <br />
        <b>Décision attendue de Luc</b> : 6 000 $ sur la réserve pour l’électricité.
        <br />
        <b>Semaine prochaine</b> : câblage réseau, essais de la caisse.
      </div>
      <div className={b.on(3)} style={{ marginTop: 16, background: T.blue.bg, borderRadius: 10, padding: '10px 16px', fontSize: 22, color: T.blue.fg }}>
        <Icon name="humanCheck" size={22} style={{ display: 'inline-block', verticalAlign: '-4px', marginRight: 8 }} />
        Relu par Karim : météo passée de vert à jaune, contexte électricité ajouté.
      </div>
    </div>
  </Frame>
);

// ─── M4 · Team practices ────────────────────────────────────────────────────
const M4Prac = ({ d, icon, tone, title, children }: { d: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <Card tone={tone} icon={icon} title={title} size={25} cls={A.in} style={{ width: 540, height: 300, ...dl(d) }}>
    {children}
  </Card>
);

const M4_Team: Page = () => (
  <Frame mod={4}>
    <Title>Collaborer avec l’IA : les pratiques d’équipe</Title>
    <Lede>L’IA individuelle fait gagner des minutes. L’IA d’équipe fait gagner des heures.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 30, columnGap: 30 }}>
      <M4Prac d={100} icon="database" tone="blue" title="Une seule source">
        Tâches, comptes rendus et décisions au même endroit : l’IA y trouve le contexte.
      </M4Prac>
      <M4Prac d={200} icon="book" tone="teal" title="Une bibliothèque">
        Les demandes qui marchent, partagées et améliorées par tous.
      </M4Prac>
      <M4Prac d={300} icon="note" tone="green" title="Une mention claire">
        « Brouillon IA, relu par Karim » : chacun sait ce qui a été vérifié.
      </M4Prac>
      <M4Prac d={400} icon="humanCheck" tone="yellow" title="Un relecteur désigné">
        Pour chaque livrable généré, une personne qui en répond.
      </M4Prac>
      <M4Prac d={500} icon="star" tone="violet" title="Partager les bons coups">
        Cinq minutes en réunion d’équipe : « mon meilleur usage de la semaine ».
      </M4Prac>
      <M4Prac d={600} icon="shieldCheck" tone="coral" title="Des règles communes">
        Outils permis, données interdites : décidé ensemble, écrit quelque part.
      </M4Prac>
    </div>
  </Frame>
);

// ─── M4 · Prompt library ────────────────────────────────────────────────────
const M4Lib = ({ d, icon, tone, title, children }: { d: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={A.in} style={{ width: 540, ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 310, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 6px 0 0 ${STRONG[tone]}`, padding: '22px 26px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <IconTile name={icon} tone={tone} size={48} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{title}</span>
      </div>
      <div style={{ marginTop: 14, fontSize: 22, lineHeight: 1.45, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M4_Library: Page = () => (
  <Frame mod={4}>
    <Title>La bibliothèque de demandes de l’équipe Limoilou</Title>
    <Lede>Six modèles à copier. Les zones entre crochets se remplacent à chaque usage.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 30, columnGap: 30 }}>
      <M4Lib d={100} icon="gantt" tone="teal" title="Plan de projet">
        Tu es chargé de projet. Voici [le contexte]. Découpe en lots et tâches, avec dépendances et jalons, en tableau. Signale les durées supposées.
      </M4Lib>
      <M4Lib d={200} icon="note" tone="violet" title="Compte rendu">
        À partir de [la transcription], liste décisions, actions (qui, quoi, quand) et points ouverts. N’invente rien : [à confirmer].
      </M4Lib>
      <M4Lib d={300} icon="chart" tone="blue" title="Rapport hebdomadaire">
        À partir de [mes notes], rédige le rapport pour [Luc] : météo, avancement, 3 points d’attention, décision attendue. 150 mots.
      </M4Lib>
      <M4Lib d={400} icon="mail" tone="yellow" title="Message délicat">
        Rédige un courriel à [destinataire] pour annoncer [la nouvelle]. Ton : [clair et rassurant]. Propose deux options.
      </M4Lib>
      <M4Lib d={500} icon="alert" tone="coral" title="Risques">
        Pour [le projet], liste 8 risques avec probabilité, impact et une mesure. Classe-les du plus grave au moins grave.
      </M4Lib>
      <M4Lib d={600} icon="calendar" tone="green" title="Préparer une réunion">
        À partir de [l’état des tâches], propose l’ordre du jour de [45 min] : objectifs, points à décider, temps par point.
      </M4Lib>
    </div>
  </Frame>
);

// ─── M4 · QCMs & synthesis ──────────────────────────────────────────────────
const M4_Qcm1: Page = () => (
  <QcmPage
    mod={4}
    n={4}
    title="Avant de diffuser"
    q="Teams vient de produire le compte rendu de la réunion de suivi. Que fait Karim avant de l’envoyer ?"
    explain="Le compte rendu engage celui qui l’envoie. Les erreurs typiques : fausse décision, mauvaise personne, date inventée, point ouvert disparu. Deux minutes de relecture suffisent."
  >
    <Opt why="Piège ! C’est justement là que se glissent les fausses décisions et les mauvaises attributions.">Il l’envoie tel quel : c’est la transcription exacte</Opt>
    <Opt ok why="Oui : décisions, responsables, dates et points ouverts. Le reste peut rester imparfait.">
      Il vérifie décisions, responsables, dates et points ouverts
    </Opt>
    <Opt why="Piège ! On perd tout le temps gagné. On vérifie les éléments à risque, pas chaque virgule.">Il réécoute toute la réunion pour tout vérifier</Opt>
    <Opt why="Piège ! Une IA ne vérifie pas mieux l’autre : seule la personne présente sait ce qui a été dit.">Il demande à une autre IA de le corriger</Opt>
  </QcmPage>
);

const M4_Qcm2: Page = () => (
  <QcmPage
    mod={4}
    n={5}
    title="Règle ou intelligence ?"
    q="Laquelle de ces alertes demande vraiment de l’intelligence artificielle ?"
    explain="Les trois autres sont des règles fixes, très utiles, qui constatent. L’IA croise des signaux faibles (silence, charge, ton des commentaires) pour anticiper."
  >
    <Opt why="Piège ! Une règle suffit : date dépassée → notification.">« La tâche X a dépassé son échéance »</Opt>
    <Opt why="Piège ! Une règle suffit : statut = Bloquée → message.">« La tâche Y vient de passer en statut Bloquée »</Opt>
    <Opt ok why="Oui : aucune règle simple ne le dit. L’IA combine l’absence de mise à jour, la charge et le ton des échanges.">
      « La tâche Z risque de glisser : silence, surcharge, ton inquiet »
    </Opt>
    <Opt why="Piège ! Une règle horaire suffit : chaque vendredi, 14 h.">« Rappel : le rapport hebdomadaire est dû aujourd’hui »</Opt>
  </QcmPage>
);

const M4_Synth: Page = () => (
  <SynthPage
    mod={4}
    title="Module 4 · Ce qu’il faut retenir"
    poste={
      <>
        À votre prochaine réunion : annoncez la transcription, puis testez la demande de compte rendu.
        <br />
        <br />
        Créez une première règle « si… alors » dans votre outil de tâches.
      </>
    }
  >
    <SynthRow n={1} tone="violet" d={100}>
      Compte rendu : <b>décisions, actions, points ouverts</b>, et rien d’inventé.
    </SynthRow>
    <SynthRow n={2} tone="coral" d={220}>
      Transcrire : <b>annoncer</b>, outil approuvé, pas de sujets sensibles.
    </SynthRow>
    <SynthRow n={3} tone="blue" d={340}>
      Les actions deviennent des <b>tâches</b> avec responsable et date.
    </SynthRow>
    <SynthRow n={4} tone="green" d={460}>
      Règles « si… alors » pour constater, <b>IA pour anticiper</b>.
    </SynthRow>
    <SynthRow n={5} tone="yellow" d={580}>
      En équipe : une source, une <b>bibliothèque</b>, un relecteur.
    </SynthRow>
  </SynthPage>
);

// ═══ 70-m5 ═════════════════════════════════════════════════════════════

// ─── M5 · Divider ───────────────────────────────────────────────────────────
const M5_Divider: Page = () => (
  <Section n={5} title="Limites, éthique et adoption" sub="Biais, erreurs, confidentialité… et comment embarquer une équipe." dur="≈ 1 h 15">
    <SecItem n={1}>Les biais : l’IA apprend aussi nos travers</SecItem>
    <SecItem n={2}>Les erreurs, et combien vérifier</SecItem>
    <SecItem n={3}>Confidentialité et cadre légal</SecItem>
    <SecItem n={4}>Accompagner le changement dans une équipe</SecItem>
  </Section>
);
M5_Divider.transition = BLOOM;

// ─── M5 · Three families of risk ────────────────────────────────────────────
const M5Risk = ({ n, icon, tone, name, q, ex }: { n: number; icon: IconName; tone: Tone; name: string; q: string; ex: ReactNode }) => (
  <div className={b.on(n)} style={{ flex: 1 }}>
    <div style={{ boxSizing: 'border-box', height: 560, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '32px 32px', display: 'flex', flexDirection: 'column' }}>
      <IconTile name={icon} tone={tone} size={84} solid />
      <div style={{ marginTop: 22, fontFamily: display, fontWeight: 700, fontSize: 48, color: C.ink }}>{name}</div>
      <div style={{ marginTop: 10, fontSize: 28, lineHeight: 1.4, color: C.soft }}>{q}</div>
      <div style={{ marginTop: 'auto', background: T[tone].bg, borderRadius: 12, padding: '14px 18px', fontSize: 24, lineHeight: 1.4, color: C.ink }}>{ex}</div>
    </div>
  </div>
);

const M5_Three: Page = () => (
  <Frame mod={5} beats={3}>
    <Title>Trois familles de risques</Title>
    <Lede>Aucune n’est une raison de renoncer. Toutes sont une raison d’encadrer.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 30 }}>
      <M5Risk n={1} icon="scale" tone="violet" name="Les biais" q="L’IA reproduit les déséquilibres de ses exemples." ex={<><b>Projet :</b> trier des CV, estimer des durées.</>} />
      <M5Risk n={2} icon="alert" tone="coral" name="Les erreurs" q="Elle se trompe avec aplomb, sans prévenir." ex={<><b>Projet :</b> un chiffre faux dans le rapport à la direction.</>} />
      <M5Risk n={3} icon="lock" tone="blue" name="La confidentialité" q="Ce que vous collez sort de votre organisation." ex={<><b>Projet :</b> un contrat fournisseur dans un outil gratuit.</>} />
    </div>
  </Frame>
);

// ─── M5 · Bias: how it happens (CV screening) ───────────────────────────────
const M5HBar = ({ label, pct, tone, d }: { label: string; pct: number; tone: Tone; d: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 54 }}>
    <span style={{ width: 120, fontSize: 25, color: C.ink }}>{label}</span>
    <div className={A.grow} style={{ width: pct * 5, height: 40, borderRadius: 8, background: STRONG[tone], ...dl(d) }} />
    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>{pct} %</span>
  </div>
);

const M5Cv = ({ name, line, score, tone }: { name: string; line: string; score: number; tone: Tone }) => (
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

const M5_Bias: Page = () => (
  <Frame mod={5} beats={4}>
    <Title>Le biais : l’IA apprend aussi nos travers</Title>
    <Lede>Exemple : un outil de tri de CV entraîné sur dix ans d’embauches passées.</Lede>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 280, width: 860, height: 640, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '26px 32px' }}>
      <Eyebrow c={C.soft} size={22}>
        1 · Les exemples : qui a été embauché ?
      </Eyebrow>
      <div style={{ marginTop: 10 }}>
        <M5HBar label="Hommes" pct={80} tone="blue" d={300} />
        <M5HBar label="Femmes" pct={20} tone="violet" d={450} />
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
          <M5Cv name="CV A" line="Capitaine, club de hockey" score={82} tone="green" />
          <M5Cv name="CV B" line="Capitaine, équipe féminine de hockey" score={61} tone="coral" />
        </div>
      </div>
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 1040, top: 280, width: 760 }}>
      <Card tone="teal" icon="book" title="Un cas réel" size={25}>
        En 2018, Amazon a abandonné un outil expérimental de tri de CV : il pénalisait les candidatures contenant le mot « women’s » (Reuters).
      </Card>
    </div>
    <Callout cls={b.on(4)} title="Pour le recrutement de Julie" tone="violet" icon="humanCheck" size={26} style={{ position: 'absolute', left: 1040, top: 640, width: 760 }}>
      L’IA aide à rédiger l’offre et à préparer les entrevues. Le tri et le choix des candidats restent humains, sur des critères écrits.
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

const M5_BiasPm: Page = () => (
  <Frame mod={5} beats={4}>
    <Title>Quatre biais qui guettent vos projets</Title>
    <div style={{ position: 'absolute', left: 120, top: 220, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, 825px)', rowGap: 30, columnGap: 30 }}>
      <M5BiasCard n={1} icon="smile" tone="yellow" name="La complaisance" fix="Demandez : « Quelles sont les 5 faiblesses de ce plan ? »">
        « Mon échéancier est réaliste, non ? » « Oui, tout à fait ! » L’IA a tendance à vous donner raison.
      </M5BiasCard>
      <M5BiasCard n={2} icon="chat" tone="blue" name="La formulation" fix="Posez des questions ouvertes, sans la réponse dedans.">
        Une question orientée appelle une réponse orientée : « Pourquoi l’option B est-elle meilleure ? »
      </M5BiasCard>
      <M5BiasCard n={3} icon="globe" tone="violet" name="Le biais culturel" fix="Précisez : « au Québec », « en dollars canadiens », « selon nos congés ».">
        Exemples surtout américains : elle oublie les Fêtes, la Saint-Jean, les vacances de la construction.
      </M5BiasCard>
      <M5BiasCard n={4} icon="clock" tone="coral" name="L’optimisme moyen" fix="Comparez avec vos projets passés et ajoutez une marge.">
        Ses durées reflètent un projet « typique », pas votre fournisseur qui a toujours du retard.
      </M5BiasCard>
    </div>
  </Frame>
);

// ─── M5 · Errors: two real cases ────────────────────────────────────────────
const M5Case = ({ n, tone, icon, year, title, children, lesson }: { n: number; tone: Tone; icon: IconName; year: string; title: string; children: ReactNode; lesson: string }) => (
  <div className={b.on(n)} style={{ flex: 1 }}>
    <div style={{ boxSizing: 'border-box', height: 470, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '30px 30px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconTile name={icon} tone={tone} size={64} solid />
        <Tag tone={tone} size={22}>
          {year}
        </Tag>
      </div>
      <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 38, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 12, fontSize: 27, lineHeight: 1.45, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 'auto', background: T[tone].bg, borderRadius: 12, padding: '14px 18px', fontSize: 24, fontWeight: 600, lineHeight: 1.4, color: T[tone].fg }}>{lesson}</div>
    </div>
  </div>
);

const M5_Errors: Page = () => (
  <Frame mod={5} kind="cas" beats={3}>
    <Title>Les erreurs : deux cas réels… et le vôtre</Title>
    <div style={{ position: 'absolute', left: 120, top: 220, width: 1680, display: 'flex', gap: 30 }}>
      <M5Case n={1} tone="coral" icon="chat" year="Canada · 2024" title="Le clavardeur d’Air Canada" lesson="L’organisation répond de ce que dit son IA.">
        Il invente une politique de remboursement pour un deuil. Le tribunal de la C.-B. donne raison au client : Air Canada doit payer.
      </M5Case>
      <M5Case n={2} tone="violet" icon="scale" year="New York · 2023" title="Les jurisprudences inventées" lesson="Toute source se vérifie à la source.">
        Des avocats déposent un mémoire avec six décisions inventées par ChatGPT. Le juge les sanctionne d’une amende.
      </M5Case>
      <M5Case n={3} tone="blue" icon="chart" year="Limoilou · semaine 14" title="Le rapport de Karim" lesson="Un chiffre faux peut fausser une décision.">
        L’IA additionne mal deux lots du budget : 6 000 $ « disponibles » qui n’existent pas. Luc approuve une dépense.
      </M5Case>
    </div>
    <Callout cls={b.on(3)} title="Le point commun" tone="yellow" icon="humanCheck" size={26} style={{ position: 'absolute', left: 120, top: 740, width: 1680, ...dl(400) }}>
      Chaque fois, l’IA a produit un texte plausible et une personne l’a utilisé sans le vérifier.
    </Callout>
  </Frame>
);

// ─── M5 · How much to check ─────────────────────────────────────────────────
const M5Level = ({ n, w, tone, stake, check }: { n: number; w: number; tone: Tone; stake: string; check: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', alignItems: 'center', gap: 26, height: 128 }}>
    <div style={{ width: 520, flex: 'none' }}>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>{stake}</div>
    </div>
    <div style={{ width: 420, flex: 'none', height: 40, background: C.panel, borderRadius: 10, overflow: 'hidden' }}>
      <div className={b.grow(n)} style={{ width: w, height: '100%', background: STRONG[tone], ...dl(200) }} />
    </div>
    <div style={{ flex: 1, fontSize: 25, lineHeight: 1.4, color: C.ink }}>{check}</div>
  </div>
);

const M5_HowMuch: Page = () => (
  <Frame mod={5} beats={4}>
    <Title>Combien vérifier ? Selon l’enjeu</Title>
    <Lede>Tout vérifier tue le gain de temps. Ne rien vérifier tue la confiance.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '14px 36px', ...dl(100) }}>
      <M5Level n={1} w={90} tone="green" stake="Un brouillon pour soi" check="Lecture rapide : est-ce utile ?" />
      <M5Level n={2} w={200} tone="teal" stake="Partagé avec l’équipe" check="Noms, dates, responsables, faits clés." />
      <M5Level n={3} w={320} tone="yellow" stake="Envoyé à la direction, à un client" check="Chaque chiffre et chaque source, plus une relecture par un collègue." />
      <M5Level n={4} w={420} tone="coral" stake="Engage une décision, une personne, un contrat" check={<><b>L’humain décide.</b> L’IA aide à préparer, rien de plus.</>} />
    </div>
  </Frame>
);

// ─── M5 · Where your data goes ──────────────────────────────────────────────
const M5Row = ({ d, label, pub, ent }: { d: number; label: string; pub: ReactNode; ent: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', minHeight: 92, borderTop: `1.5px solid ${C.rule}`, ...dl(d) }}>
    <span style={{ width: 400, flex: 'none', fontWeight: 600, fontSize: 25, color: C.ink }}>{label}</span>
    <span style={{ flex: 1, fontSize: 24, lineHeight: 1.35, color: T.coral.fg, paddingRight: 20 }}>{pub}</span>
    <span style={{ flex: 1, fontSize: 24, lineHeight: 1.35, color: T.green.fg }}>{ent}</span>
  </div>
);

const M5_Data: Page = () => (
  <Frame mod={5}>
    <Title>Où vont vos données ?</Title>
    <Lede>Même outil, deux versions, deux niveaux de protection. Vérifiez toujours les réglages réels.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '10px 36px 6px', ...dl(100) }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 70 }}>
        <span style={{ width: 400, flex: 'none' }} />
        <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>
          <Icon name="user" size={30} color={C.coral} /> Version grand public
        </span>
        <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>
          <Icon name="shieldCheck" size={30} color={C.green} /> Version entreprise approuvée
        </span>
      </div>
      <M5Row d={200} label="Vos échanges entraînent le modèle ?" pub="Possible selon les réglages du compte" ent="Non, selon le contrat de l’organisation" />
      <M5Row d={300} label="Qui contrôle les comptes ?" pub="Vous seul, avec votre adresse" ent="Les TI : accès, départs, journaux" />
      <M5Row d={400} label="Durée de conservation" pub="Selon les réglages du service" ent="Selon la politique de l’organisation" />
      <M5Row d={500} label="Lieu d’hébergement" pub="Pas toujours au Canada" ent="Parfois au choix : Canada, Europe…" />
    </div>
    <Callout cls={A.in} title="Un cas réel · Samsung, 2023" tone="coral" icon="alert" size={25} style={{ position: 'absolute', left: 120, top: 790, width: 1680, ...dl(700) }}>
      Des ingénieurs collent du code confidentiel dans ChatGPT. L’entreprise interdit ensuite temporairement l’IA générative.
    </Callout>
  </Frame>
);

// ─── M5 · Exercise: traffic light for data ──────────────────────────────────
const M5_Traffic: Page = () => (
  <Frame mod={5} kind="exercice" beats={1}>
    <Title>À vous : feu vert, jaune ou rouge ?</Title>
    <Lede>Pour chaque information, votez dans le clavardage : vert, jaune ou rouge. Le corrigé apparaît au clic.</Lede>
    <M1Zone x={120} icon="check" tone="green" label="Vert · tout outil" />
    <M1Zone x={690} icon="shieldCheck" tone="yellow" label="Jaune · outil approuvé" />
    <M1Zone x={1260} icon="lock" tone="coral" label="Rouge · jamais tel quel" />
    <Drag x={120} y={262} w={405} tone="blue" size={22}>
      Le texte de l’affiche des portes ouvertes <M1Key tone="green">VERT</M1Key>
    </Drag>
    <Drag x={545} y={262} w={405} tone="blue" size={22}>
      Les CV des candidats mécaniciens <M1Key tone="coral">ROUGE</M1Key>
    </Drag>
    <Drag x={970} y={262} w={405} tone="blue" size={22}>
      Le budget détaillé du projet <M1Key tone="yellow">JAUNE</M1Key>
    </Drag>
    <Drag x={1395} y={262} w={405} tone="blue" size={22}>
      Une procédure générique d’ouverture de caisse <M1Key tone="green">VERT</M1Key>
    </Drag>
    <Drag x={120} y={384} w={405} tone="blue" size={22}>
      Le salaire offert à la future gérante <M1Key tone="coral">ROUGE</M1Key>
    </Drag>
    <Drag x={545} y={384} w={405} tone="blue" size={22}>
      Le contrat du fournisseur de comptoirs <M1Key tone="yellow">JAUNE</M1Key>
    </Drag>
    <Drag x={970} y={384} w={405} tone="blue" size={22}>
      L’arrêt maladie d’un employé <M1Key tone="coral">ROUGE</M1Key>
    </Drag>
    <Drag x={1395} y={384} w={405} tone="blue" size={22}>
      Le compte rendu de la réunion de suivi <M1Key tone="yellow">JAUNE</M1Key>
    </Drag>
  </Frame>
);

// ─── M5 · Anonymize (interactive toggle) ────────────────────────────────────
const M5Mask = ({ on, real, fake }: { on: boolean; real: string; fake: string }) => (
  <span
    style={{
      background: on ? T.green.bg : T.coral.bg,
      color: on ? T.green.fg : T.coral.fg,
      fontWeight: 600,
      borderRadius: 6,
      padding: '0 6px',
      transition: `background 400ms ${EASE}, color 400ms ${EASE}`,
    }}
  >
    {on ? fake : real}
  </span>
);

const M5Tip = ({ d, icon, children }: { d: number; icon: IconName; children: ReactNode }) => (
  <div className={A.right} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px', ...dl(d) }}>
    <IconTile name={icon} tone="green" size={52} />
    <span style={{ fontSize: 25, lineHeight: 1.35, color: C.ink }}>{children}</span>
  </div>
);

const M5_Anon: Page = () => {
  const [on, setOn] = useState(false);
  return (
    <Frame mod={5} kind="exercice">
      <Title>Anonymiser avant de demander</Title>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 204, ...dl(100) }}>
        <Toggle on={on} onChange={setOn} label={on ? 'Version anonymisée' : 'Version d’origine'} tone="green" size={28} />
      </div>
      <PromptBox cls={A.in} size={30} style={{ position: 'absolute', left: 120, top: 290, width: 1000, boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${on ? C.green : C.coral}`, ...dl(200) }}>
        Rédige une réponse ferme mais polie à <M5Mask on={on} real="Sylvie Bouchard" fake="[RESPONSABLE]" />, de <M5Mask on={on} real="Comptoirs Rive-Sud inc." fake="[FOURNISSEUR]" /> (<M5Mask on={on} real="418 555-0142" fake="[TÉL.]" />). Contrat <M5Mask on={on} real="no 2024-117 de 38 450 $" fake="[CONTRAT]" /> : livraison en retard de deux semaines. Nous appliquons la pénalité <M5Mask on={on} real="de 1 500 $ prévue à l’article 9" fake="prévue au contrat" />.
      </PromptBox>
      <div style={{ position: 'absolute', left: 120, top: 700, width: 1000, display: 'flex', alignItems: 'center', gap: 14, fontSize: 27, fontWeight: 600, color: on ? T.green.fg : T.coral.fg }}>
        <Icon name={on ? 'check' : 'alert'} size={32} />
        {on ? 'La réponse sera aussi bonne. On remet les vrais noms dans le courriel final.' : 'Cinq informations identifiantes ou confidentielles.'}
      </div>
      <div style={{ position: 'absolute', left: 1180, top: 290, width: 620, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <M5Tip d={300} icon="user">
          Remplacer les noms par des rôles
        </M5Tip>
        <M5Tip d={400} icon="x">
          Retirer coordonnées et numéros
        </M5Tip>
        <M5Tip d={500} icon="money">
          Masquer ou arrondir les montants
        </M5Tip>
        <M5Tip d={600} icon="send">
          Remettre les vrais éléments à la fin, hors de l’IA
        </M5Tip>
      </div>
      <Callout cls={A.in} title="Limite" tone="yellow" icon="alert" size={24} style={{ position: 'absolute', left: 120, top: 800, width: 1680, padding: '14px 26px', ...dl(700) }}>
        Anonymiser réduit le risque sans le supprimer : un contexte très précis suffit parfois à reconnaître quelqu’un.
      </Callout>
    </Frame>
  );
};

// ─── M5 · The legal frame ───────────────────────────────────────────────────
const M5_Law: Page = () => (
  <Frame mod={5}>
    <Title>Le cadre : ce qui s’applique déjà</Title>
    <Lede>Pas besoin d’être juriste. Quatre repères suffisent pour un chargé de projet.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, 825px)', rowGap: 30, columnGap: 30 }}>
      <Card tone="blue" icon="shield" title="Loi 25 (Québec)" size={24} cls={A.in} style={{ width: 825, height: 290, ...dl(100) }}>
        Protection des renseignements personnels : évaluation des facteurs relatifs à la vie privée (EFVP) pour un nouveau système, et information de la personne si une décision repose uniquement sur un traitement automatisé.
      </Card>
      <Card tone="green" icon="book" title="La politique de votre organisation" size={24} cls={A.in} style={{ width: 825, height: 290, ...dl(220) }}>
        Outils autorisés, usages interdits, personne à consulter. Votre premier document à lire en rentrant : il prime sur vos habitudes.
      </Card>
      <Card tone="yellow" icon="key" title="Vos contrats" size={24} cls={A.in} style={{ width: 825, height: 290, ...dl(340) }}>
        Les ententes de confidentialité avec vos clients et fournisseurs s’appliquent aussi à ce que vous collez dans une IA.
      </Card>
      <Card tone="violet" icon="globe" title="Si vous travaillez avec l’Europe" size={24} cls={A.in} style={{ width: 825, height: 290, ...dl(460) }}>
        Le règlement européen sur l’IA (AI Act), en vigueur depuis 2024, impose des obligations progressives, plus fortes pour les usages à haut risque comme le recrutement.
      </Card>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 930, fontSize: 22, color: C.muted, ...dl(700) }}>
      Au fédéral, le projet de loi C-27 (qui incluait une loi sur l’IA) est mort au feuilleton en janvier 2025. Vérifiez l’état actuel.
    </div>
  </Frame>
);

// ─── M5 · Self-check: my reflexes ───────────────────────────────────────────
const M5_Reflexes: Page = () => (
  <Frame mod={5} kind="exercice">
    <Title>Vos huit réflexes : où en êtes-vous ?</Title>
    <Lede>Comptez pour vous ceux que vous faites déjà. Honnêtement : personne ne verra votre score.</Lede>
    <Checklist cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, ...dl(100) }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <div style={{ width: 1100, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <CheckItem id="m5-tool">J’utilise uniquement les outils approuvés par mon organisation</CheckItem>
          <CheckItem id="m5-data">Je ne colle jamais de renseignements personnels ou confidentiels</CheckItem>
          <CheckItem id="m5-ctx">Je donne le contexte et le format attendus</CheckItem>
          <CheckItem id="m5-check">Je vérifie chiffres, dates, noms et sources avant de diffuser</CheckItem>
          <CheckItem id="m5-ask">Je demande à l’IA ce qu’elle a supposé ou deviné</CheckItem>
          <CheckItem id="m5-say">Je signale quand un document a été préparé avec l’IA</CheckItem>
          <CheckItem id="m5-dec">Je garde la décision : l’IA propose, je tranche</CheckItem>
          <CheckItem id="m5-share">Je partage mes bonnes demandes avec l’équipe</CheckItem>
        </div>
        <CheckScore
          max={8}
          label="Mon niveau de maîtrise"
          style={{ width: 540, alignSelf: 'flex-start' }}
          levels={[
            { min: 0, text: 'Des réflexes à construire : commencez par les deux premiers', tone: 'coral' },
            { min: 4, text: 'Bonne base : visez la vérification systématique', tone: 'yellow' },
            { min: 7, text: 'Usage maîtrisé : devenez la personne-ressource', tone: 'green' },
          ]}
        />
      </div>
    </Checklist>
  </Frame>
);

// ─── M5 · Change: four reactions (flip cards) ───────────────────────────────
const M5Persona = ({ id, quote, children }: { id: CastId; quote: string; children: ReactNode }) => (
  <FlipCard
    w={825}
    h={300}
    tone={CAST[id].tone}
    backTone="green"
    front={
      <div>
        <Who id={id} size={26} />
        <div style={{ marginTop: 18, fontFamily: display, fontWeight: 600, fontSize: 34, lineHeight: 1.2, color: C.ink }}>{quote}</div>
      </div>
    }
    back={
      <div>
        <Eyebrow c={T.green.fg} size={22}>
          La réponse de Karim
        </Eyebrow>
        <div style={{ marginTop: 10, fontSize: 27, lineHeight: 1.45, color: C.ink }}>{children}</div>
      </div>
    }
  />
);

const M5_Personas: Page = () => (
  <Frame mod={5} kind="exercice">
    <Title>Accompagner l’équipe : quatre réactions, quatre réponses</Title>
    <Lede>Que répondriez-vous ? Une idée dans le clavardage, puis on retourne la carte.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, 825px)', rowGap: 30, columnGap: 30, ...dl(150) }}>
      <M5Persona id="julie" quote="« L’IA va trier mes candidats à ma place ? »">
        Non. Elle t’aide à rédiger les offres et à préparer les entrevues. Le choix reste le tien, sur des critères écrits.
      </M5Persona>
      <M5Persona id="annie" quote="« J’ai déjà tout mis dans ChatGPT, c’est génial ! »">
        Super, deviens notre personne-ressource ! Mais sur l’outil approuvé, et seulement avec des données « vertes ».
      </M5Persona>
      <M5Persona id="maxime" quote="« C’est du texte générique, ça ne vaut rien. »">
        Essayons sur tes variantes de publications. Tu gardes le dernier mot sur le ton : c’est ton métier.
      </M5Persona>
      <M5Persona id="luc" quote="« D’accord, mais qu’est-ce que ça rapporte ? »">
        On mesure pendant 4 semaines le temps gagné sur les comptes rendus et le rapport hebdo, et je te montre les chiffres.
      </M5Persona>
    </div>
  </Frame>
);

// ─── M5 · Adoption curve ────────────────────────────────────────────────────
const m5Curve = (xa: number, xb: number, close = true) => {
  let d = close ? `M${xa} 470` : '';
  for (let x = xa; x <= xb; x += 10) {
    const y = 470 - 400 * Math.exp(-((x - 840) ** 2) / (2 * 260 * 260));
    d += `${d ? ' L' : 'M'}${x} ${y.toFixed(1)}`;
  }
  return close ? `${d} L${xb} 470 Z` : d;
};

const M5Seg = ({ n, x, w, tone, name, pct, who }: { n: number; x: number; w: number; tone: Tone; name: string; pct: string; who?: CastId }) => (
  <>
    <div className={b.on(n)} style={{ position: 'absolute', left: 120 + x, top: 730, width: w, textAlign: 'center' }}>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 27, lineHeight: 1.1, color: T[tone].fg }}>{name}</div>
      <div style={{ fontSize: 22, color: C.soft }}>{pct}</div>
    </div>
    {who ? (
      <div className={b.pop(n)} style={{ position: 'absolute', left: 120 + x, top: 840, width: w, display: 'flex', justifyContent: 'center', ...dl(300) }}>
        <Tag tone={CAST[who].tone} size={22}>
          {CAST[who].name}
        </Tag>
      </div>
    ) : null}
  </>
);

const M5_Curve: Page = () => (
  <Frame mod={5} beats={5}>
    <Title>Dans toute équipe, cinq profils face à la nouveauté</Title>
    <Lede>La courbe d’adoption de Rogers. Commencez par les volontaires : leurs résultats convaincront la majorité.</Lede>
    <svg width={1680} height={480} viewBox="0 0 1680 480" style={{ position: 'absolute', left: 120, top: 250 }}>
      <path d={m5Curve(0, 320)} fill={T.violet.bg} stroke={C.violet} strokeWidth={2} className={b.fade(1)} />
      <path d={m5Curve(320, 580)} fill={T.blue.bg} stroke={C.blue} strokeWidth={2} className={b.fade(2)} />
      <path d={m5Curve(580, 840)} fill={T.teal.bg} stroke={C.teal} strokeWidth={2} className={b.fade(3)} />
      <path d={m5Curve(840, 1100)} fill={T.yellow.bg} stroke={C.amber} strokeWidth={2} className={b.fade(4)} />
      <path d={m5Curve(1100, 1680)} fill={T.grey.bg} stroke={C.faint} strokeWidth={2} className={b.fade(5)} />
      <path d={m5Curve(0, 1680, false)} fill="none" stroke={C.ink} strokeWidth={4} pathLength={1} className={A.draw} />
      <line x1={0} y1={470} x2={1680} y2={470} stroke={C.faint} strokeWidth={3} />
    </svg>
    <M5Seg n={1} x={0} w={320} tone="violet" name="Innovateurs" pct="2,5 %" who="annie" />
    <M5Seg n={2} x={320} w={260} tone="blue" name="Adopteurs précoces" pct="13,5 %" who="karim" />
    <M5Seg n={3} x={580} w={260} tone="teal" name="Majorité précoce" pct="34 %" who="julie" />
    <M5Seg n={4} x={840} w={260} tone="yellow" name="Majorité tardive" pct="34 %" who="maxime" />
    <M5Seg n={5} x={1100} w={580} tone="grey" name="Retardataires" pct="16 %" />
  </Frame>
);

// ─── M5 · 90-day adoption plan ──────────────────────────────────────────────
const M5Phase = ({ n, tone, days, verb, children }: { n: number; tone: Tone; days: string; verb: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ flex: 1 }}>
    <div style={{ boxSizing: 'border-box', height: 420, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '30px 32px' }}>
      <Tag tone={tone} size={22}>
        {days}
      </Tag>
      <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 52, color: C.ink }}>{verb}</div>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
    </div>
  </div>
);

const M5_Plan: Page = () => (
  <Frame mod={5} beats={3}>
    <Title>Un plan d’adoption sur 90 jours</Title>
    <Lede>Petit, mesuré, partagé. C’est ce que Karim propose à Luc pour l’équipe Limoilou.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', gap: 30 }}>
      <M5Phase n={1} tone="blue" days="Jours 1 à 30" verb="Essayer">
        <Bullet size={26}>Deux cas pilotes : comptes rendus et rapport hebdo</Bullet>
        <Bullet size={26}>Une charte d’usage d’une page</Bullet>
        <Bullet size={26}>Annie, personne-ressource</Bullet>
      </M5Phase>
      <M5Phase n={2} tone="teal" days="Jours 31 à 60" verb="Mesurer">
        <Bullet size={26} tone="teal">Temps gagné par semaine</Bullet>
        <Bullet size={26} tone="teal">Erreurs repérées à la relecture</Bullet>
        <Bullet size={26} tone="teal">Satisfaction de l’équipe</Bullet>
      </M5Phase>
      <M5Phase n={3} tone="green" days="Jours 61 à 90" verb="Étendre">
        <Bullet size={26} tone="green">Bibliothèque de demandes partagée</Bullet>
        <Bullet size={26} tone="green">Trois nouveaux cas d’usage</Bullet>
        <Bullet size={26} tone="green">Charte révisée avec l’équipe</Bullet>
      </M5Phase>
    </div>
    <Callout cls={b.on(3)} title="Pour convaincre Luc" tone="yellow" icon="chart" size={26} style={{ position: 'absolute', left: 120, top: 750, width: 1680, ...dl(400) }}>
      Des chiffres mesurés sur deux usages valent mieux que dix promesses : temps gagné, erreurs évitées.
    </Callout>
  </Frame>
);

// ─── M5 · Team charter ──────────────────────────────────────────────────────
const M5Rule = ({ n, children }: { n: number; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
    <Num n={n} size={40} />
    <span style={{ fontSize: 25, lineHeight: 1.4, color: C.ink }}>{children}</span>
  </div>
);

const M5_Charter: Page = () => (
  <Frame mod={5}>
    <Title>La charte d’usage de l’équipe Limoilou</Title>
    <Lede>Une page, huit règles, décidées ensemble. Un modèle à adapter pour votre équipe.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1680, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 8px 0 ${C.blue}`, padding: '32px 44px', ...dl(100) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconTile name="shieldCheck" tone="blue" size={56} solid />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 38, color: C.ink }}>Charte d’usage de l’IA · Projet Limoilou</span>
        <Tag tone="grey" size={20} style={{ marginLeft: 'auto' }}>
          Version 1 · revue toutes les 4 semaines
        </Tag>
      </div>
      <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 50, rowGap: 22 }}>
        <M5Rule n={1}>Outils : Copilot (licence de l’entreprise) et ClickUp. Rien d’autre sans l’accord d’Annie.</M5Rule>
        <M5Rule n={2}>Jamais de CV, salaires, données de santé ni contrats dans un outil non approuvé.</M5Rule>
        <M5Rule n={3}>Tout document généré est relu par son auteur avant diffusion.</M5Rule>
        <M5Rule n={4}>Mention « préparé avec l’IA » sur ce qui sort de l’équipe.</M5Rule>
        <M5Rule n={5}>Budget, embauches et dates : les décisions restent humaines.</M5Rule>
        <M5Rule n={6}>Transcription annoncée en début de réunion, jamais pour un sujet RH.</M5Rule>
        <M5Rule n={7}>Les bonnes demandes vont dans la bibliothèque partagée.</M5Rule>
        <M5Rule n={8}>Un doute ? On demande avant de coller.</M5Rule>
      </div>
    </div>
  </Frame>
);

// ─── M5 · QCMs & synthesis ──────────────────────────────────────────────────
const M5_Qcm1: Page = () => (
  <QcmPage
    mod={5}
    n={6}
    title="Les CV"
    q="Pour aller vite, Annie colle les 12 CV reçus dans un ChatGPT gratuit et demande un classement. Quel est le problème principal ?"
    explain="Deux problèmes : des renseignements personnels dans un outil non approuvé (Loi 25), et un tri automatisé exposé aux biais. L’IA peut aider à préparer les critères ou les questions d’entrevue, pas à classer des personnes."
  >
    <Opt why="Piège ! La longueur n’est pas le sujet : l’outil les lirait sans difficulté.">Les CV sont trop longs pour l’outil</Opt>
    <Opt ok why="Oui : des renseignements personnels sortent de l’organisation, et le classement risque de reproduire des biais.">
      Des données personnelles dans un outil non approuvé, et un tri exposé aux biais
    </Opt>
    <Opt why="Piège ! La plupart des assistants lisent les PDF. Le problème n’est pas technique.">ChatGPT ne sait pas lire les CV en PDF</Opt>
    <Opt why="Piège ! Vérifier le classement ne règle ni la fuite de données ni le biais du tri.">Aucun, si elle vérifie le classement ensuite</Opt>
  </QcmPage>
);

const M5_Qcm2: Page = () => (
  <QcmPage
    mod={5}
    n={7}
    title="La complaisance"
    q="Karim demande : « Mon échéancier est réaliste, n’est-ce pas ? » L’IA répond : « Oui, tout à fait ! » Que doit-il en retenir ?"
    explain="Une question qui contient la réponse attendue appelle une réponse complaisante. Pour un vrai regard critique, on demande explicitement les faiblesses, les risques ou un avis contradictoire."
  >
    <Opt why="Piège ! La question orientait la réponse : ce « oui » ne vaut pas une validation.">Que son échéancier est validé</Opt>
    <Opt ok why="Oui : « Joue l’avocat du diable : quelles sont les 5 faiblesses de cet échéancier ? » donne une réponse bien plus utile.">
      Que la question était orientée : il faut demander les faiblesses
    </Opt>
    <Opt why="Piège ! Une autre IA, avec la même question orientée, risque la même complaisance.">Qu’il faut poser la même question à une autre IA</Opt>
    <Opt why="Piège ! Elle peut très bien repérer des faiblesses… si on le lui demande.">Que l’IA ne sait pas évaluer un échéancier</Opt>
  </QcmPage>
);

const M5_Synth: Page = () => (
  <SynthPage
    mod={5}
    title="Module 5 · Ce qu’il faut retenir"
    poste={
      <>
        Lisez la politique d’usage de l’IA de votre organisation, ou demandez-la.
        <br />
        <br />
        Proposez à votre équipe une charte d’une page, en partant du modèle Limoilou.
      </>
    }
  >
    <SynthRow n={1} tone="violet" d={100}>
      Biais : l’IA reproduit ses exemples, et vous <b>donne raison</b> trop vite.
    </SynthRow>
    <SynthRow n={2} tone="coral" d={220}>
      Erreurs : on vérifie <b>selon l’enjeu</b> ; les décisions restent humaines.
    </SynthRow>
    <SynthRow n={3} tone="blue" d={340}>
      Données : <b>outil approuvé</b>, et on anonymise au moindre doute.
    </SynthRow>
    <SynthRow n={4} tone="green" d={460}>
      Changement : partir des <b>volontaires</b>, mesurer, partager.
    </SynthRow>
    <SynthRow n={5} tone="yellow" d={580}>
      Une <b>charte d’équipe</b> d’une page vaut mieux qu’un long règlement.
    </SynthRow>
  </SynthPage>
);

// ═══ 80-m6 ═════════════════════════════════════════════════════════════

// ─── M6 · Divider ───────────────────────────────────────────────────────────
const M6_Divider: Page = () => (
  <Section n={6} title="Atelier 2 · Un mini-projet avec l’IA" sub="Planifier, suivre, communiquer : un projet complet, un imprévu, une présentation." dur="≈ 2 h 30" kind="atelier">
    <SecItem n={1}>Choisir un projet et le planifier avec l’IA</SecItem>
    <SecItem n={2}>Affronter un imprévu : suivi et compte rendu</SecItem>
    <SecItem n={3}>Communiquer à chaque public</SecItem>
    <SecItem n={4}>Présenter, recevoir et donner de la rétroaction</SecItem>
  </Section>
);
M6_Divider.transition = BLOOM;

// ─── M6 · Mission ───────────────────────────────────────────────────────────
const M6Step = ({ n, tone, icon, t, title, children }: { n: number; tone: Tone; icon: IconName; t: string; title: string; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, ...dl(n * 120) }}>
    <div style={{ boxSizing: 'border-box', height: 330, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '26px 26px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconTile name={icon} tone={tone} size={62} solid />
        <Tag tone="grey" size={21}>
          {t}
        </Tag>
      </div>
      <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 36, color: C.ink }}>
        {n}. {title}
      </div>
      <div style={{ marginTop: 10, fontSize: 26, lineHeight: 1.42, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M6_Brief: Page = () => (
  <Frame mod={6} kind="atelier">
    <Title>La mission : un mini-projet, de bout en bout</Title>
    <Lede>En autonomie, chacun sur son poste. L’IA à chaque étape, et votre jugement à chaque sortie.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', gap: 24 }}>
      <M6Step n={1} tone="teal" icon="gantt" t="30 min" title="Planifier">
        Charte, découpage, échéancier, risques, RACI : dans l’outil.
      </M6Step>
      <M6Step n={2} tone="violet" icon="eye" t="25 min" title="Suivre">
        Un imprévu tombe : compte rendu, plan mis à jour, rapport.
      </M6Step>
      <M6Step n={3} tone="yellow" icon="megaphone" t="20 min" title="Communiquer">
        Trois messages, trois publics, et une mini-charte d’usage.
      </M6Step>
      <M6Step n={4} tone="green" icon="video" t="3 min / pers." title="Présenter">
        En partage d’écran : le résultat, l’imprévu, ce que l’IA a raté.
      </M6Step>
    </div>
    <Callout cls={A.in} title="La règle du jeu" tone="blue" icon="star" size={26} style={{ position: 'absolute', left: 120, top: 680, width: 1680, ...dl(700) }}>
      On ne juge pas le plus beau plan, mais le plus <b>réaliste</b> et la façon dont vous avez <b>vérifié</b> l’IA.
    </Callout>
  </Frame>
);

// ─── M6 · Pick a project ────────────────────────────────────────────────────
const M6Proj = ({ d, icon, tone, title, children, facts }: { d: number; icon: IconName; tone: Tone; title: string; children: ReactNode; facts: string }) => (
  <div className={A.in} style={{ width: 540, ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 320, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '24px 26px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <IconTile name={icon} tone={tone} size={54} solid />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 31, lineHeight: 1.1, color: C.ink }}>{title}</span>
      </div>
      <div style={{ marginTop: 14, fontSize: 24, lineHeight: 1.4, color: C.soft }}>{children}</div>
      <div style={{ marginTop: 'auto', fontSize: 21, fontWeight: 600, color: T[tone].fg }}>{facts}</div>
    </div>
  </div>
);

const M6_Projects: Page = () => (
  <Frame mod={6} kind="atelier" label="Atelier 2 · Choisir un projet">
    <Title>Choisissez votre projet</Title>
    <Lede>Quatre projets du fil rouge, un par profil… ou l’un des vôtres, anonymisé.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 30, columnGap: 30 }}>
      <M6Proj d={100} icon="users" tone="green" title="L’accueil des 8 recrues" facts="RH · 6 semaines · 8 000 $ · Julie">
        Programme d’intégration : premier jour, formations, parrainage, suivi à 30 jours.
      </M6Proj>
      <M6Proj d={200} icon="megaphone" tone="yellow" title="Les portes ouvertes" facts="Marketing · 8 semaines · 15 000 $ · Maxime">
        Une journée pour 300 visiteurs : campagne, essais de vélos, partenaires, bénévoles.
      </M6Proj>
      <M6Proj d={300} icon="calendar" tone="violet" title="Les rendez-vous en ligne" facts="TI · 10 semaines · 12 000 $ · Annie">
        Prise de rendez-vous pour l’atelier de réparation : outil, essais, formation, lancement.
      </M6Proj>
      <M6Proj d={400} icon="archive" tone="teal" title="L’inventaire d’ouverture" facts="Opérations · 7 semaines · 70 000 $ · Karim">
        Choisir, commander, recevoir et étiqueter 400 produits avant le 10 avril.
      </M6Proj>
      <M6Proj d={500} icon="star" tone="blue" title="Votre propre projet" facts="À annoncer dans le clavardage">
        Un de vos vrais projets, sans nom, chiffre ni donnée confidentielle.
      </M6Proj>
      <div className={A.in} style={{ width: 540, height: 320, boxSizing: 'border-box', borderRadius: 18, border: `3px dashed ${C.rule}`, padding: '24px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12, ...dl(600) }}>
        <Icon name="lock" size={44} color={C.coral} />
        <div style={{ fontSize: 25, lineHeight: 1.4, color: C.ink }}>
          Projet réel : appliquez le <b>feu tricolore</b> du module 5 avant de coller quoi que ce soit.
        </div>
      </div>
    </div>
  </Frame>
);

// ─── M6 · Phase pages (shared layout) ───────────────────────────────────────
const M6Do = ({ id, children }: { id: string; children: ReactNode }) => (
  <CheckItem id={id} size={26}>
    {children}
  </CheckItem>
);

const M6Phase = ({
  n,
  tone,
  title,
  lede,
  timer,
  minutes,
  items,
  tip,
}: {
  n: number;
  tone: Tone;
  title: string;
  lede: string;
  timer: string;
  minutes: number;
  items: ReactNode;
  tip: ReactNode;
}) => (
  <Frame mod={6} kind="atelier" label={`Atelier 2 · Étape ${n}`}>
    <Title>{title}</Title>
    <Lede>{lede}</Lede>
    <Checklist cls={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1060, ...dl(100) }}>
      <Eyebrow c={T[tone].fg} size={22} style={{ marginBottom: 12 }}>
        Livrables de l’étape
      </Eyebrow>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{items}</div>
    </Checklist>
    <Timer id={timer} minutes={minutes} label={`Étape ${n}`} cls={A.in} style={{ position: 'absolute', left: 1260, top: 280, width: 540, ...dl(250) }} />
    <div className={A.in} style={{ position: 'absolute', left: 1260, top: 600, width: 540, ...dl(400) }}>
      <Card tone={tone} icon="book" title="Dans la bibliothèque" size={23}>
        {tip}
      </Card>
    </div>
  </Frame>
);

const M6_Plan: Page = () => (
  <M6Phase
    n={1}
    tone="teal"
    title="Étape 1 · Planifier avec l’IA"
    lede="Comme à l’atelier 1, en plus rapide : vous connaissez maintenant les pièges."
    timer="m6-plan"
    minutes={30}
    tip="Modèles « Plan de projet » et « Risques ». N’oubliez pas : « Signale ce que tu as supposé. »"
    items={
      <>
        <M6Do id="m6p-1">Une charte d’une page, avec objectif mesurable</M6Do>
        <M6Do id="m6p-2">Découpage en lots et tâches, avec dépendances</M6Do>
        <M6Do id="m6p-3">Échéancier avec 3 jalons et le chemin critique</M6Do>
        <M6Do id="m6p-4">5 risques, chacun avec une mesure</M6Do>
        <M6Do id="m6p-5">RACI vérifiée, et les tâches dans l’outil</M6Do>
      </>
    }
  />
);

// ─── M6 · The twist: draw an unexpected event ───────────────────────────────
const M6_EVENTS: { icon: IconName; tone: Tone; title: string; text: string }[] = [
  { icon: 'truck', tone: 'coral', title: 'Retard fournisseur', text: 'Votre principal fournisseur annonce 3 semaines de retard, sans solution de rechange.' },
  { icon: 'money', tone: 'yellow', title: 'Budget réduit', text: 'Luc annonce une coupe de 10 % du budget, à appliquer dès cette semaine.' },
  { icon: 'user', tone: 'violet', title: 'Absence', text: 'Une personne clé de l’équipe est absente pour deux semaines, à partir de demain.' },
  { icon: 'calendar', tone: 'coral', title: 'Date avancée', text: 'La direction avance l’échéance d’une semaine pour coïncider avec une annonce.' },
  { icon: 'globe', tone: 'blue', title: 'Nouvelle exigence', text: 'Tout doit maintenant être bilingue, français et anglais, pour un partenaire.' },
  { icon: 'plug', tone: 'teal', title: 'Outil en panne', text: 'L’outil principal du projet est indisponible pendant trois jours.' },
];

const M6_Twist: Page = () => {
  const [i, setI] = useState<number | null>(null);
  const [spin, setSpin] = useState(0);
  const draw = () => {
    let next = Math.floor(Math.random() * M6_EVENTS.length);
    if (next === i) next = (next + 1) % M6_EVENTS.length;
    setI(next);
    setSpin((s) => s + 1);
  };
  const ev = i === null ? null : M6_EVENTS[i];
  return (
    <Frame mod={6} kind="atelier" label="Atelier 2 · L’imprévu">
      <Title>Coup de théâtre : un imprévu pour chacun</Title>
      <Lede>Comme dans la vraie vie : il arrive au pire moment. Chaque participant reçoit le sien.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 290, width: 980, height: 600, ...dl(100) }}>
        {ev ? (
          <div key={spin} className={A.pop} style={{ width: 980, height: 600, boxSizing: 'border-box', background: C.card, borderRadius: 24, boxShadow: `${SHADOW}, inset 0 10px 0 ${STRONG[ev.tone]}`, padding: '44px 52px', animationDuration: '500ms' }}>
            <IconTile name={ev.icon} tone={ev.tone} size={110} solid />
            <div style={{ marginTop: 28, fontFamily: display, fontWeight: 700, fontSize: 72, lineHeight: 1.05, color: C.ink }}>{ev.title}</div>
            <div style={{ marginTop: 18, fontSize: 36, lineHeight: 1.4, color: C.soft }}>{ev.text}</div>
          </div>
        ) : (
          <div style={{ width: 980, height: 600, boxSizing: 'border-box', borderRadius: 24, border: `4px dashed ${C.rule}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
            <div className={A.float}>
              <Icon name="alert" size={120} color={C.coral} sw={1.6} />
            </div>
            <div style={{ fontFamily: display, fontWeight: 700, fontSize: 48, color: C.ink }}>Quel imprévu pour vous ?</div>
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', left: 1160, top: 290, width: 640 }}>
        <Btn icon="sparkles" tone="coral" size={32} onClick={draw}>
          {ev ? 'Tirer un autre imprévu' : 'Tirer un imprévu'}
        </Btn>
        <div className={A.in} style={{ marginTop: 34, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18, ...dl(300) }}>
          <Eyebrow c={C.muted} size={22}>
            Les six imprévus possibles
          </Eyebrow>
          <Tag tone="coral">Retard fournisseur</Tag>
          <Tag tone="yellow">Budget réduit de 10 %</Tag>
          <Tag tone="violet">Personne clé absente</Tag>
          <Tag tone="coral">Échéance avancée</Tag>
          <Tag tone="blue">Tout en bilingue</Tag>
          <Tag tone="teal">Outil en panne</Tag>
        </div>
      </div>
    </Frame>
  );
};

const M6_Track: Page = () => (
  <M6Phase
    n={2}
    tone="violet"
    title="Étape 2 · Suivre : réagir à l’imprévu"
    lede="Écrivez les notes brutes d’une réunion de suivi sur l’imprévu, puis laissez l’IA vous aider."
    timer="m6-track"
    minutes={25}
    tip="Modèles « Compte rendu » et « Rapport hebdomadaire ». Exigez [à confirmer] plutôt que des inventions."
    items={
      <>
        <M6Do id="m6t-1">8 à 10 lignes de notes brutes, comme en sortant de réunion</M6Do>
        <M6Do id="m6t-2">Compte rendu généré : décisions, actions, points ouverts</M6Do>
        <M6Do id="m6t-3">Relecture : les quatre erreurs typiques vérifiées</M6Do>
        <M6Do id="m6t-4">Plan mis à jour dans l’outil, chemin critique revu</M6Do>
        <M6Do id="m6t-5">Rapport au commanditaire avec météo assumée</M6Do>
      </>
    }
  />
);

const M6_Comm: Page = () => (
  <M6Phase
    n={3}
    tone="yellow"
    title="Étape 3 · Communiquer à chaque public"
    lede="Un même imprévu, trois messages. Puis cinq règles d’usage pour votre équipe."
    timer="m6-comm"
    minutes={20}
    tip="Modèle « Message délicat ». Demandez aussi : « Relis ce courriel comme si tu étais le destinataire. »"
    items={
      <>
        <M6Do id="m6c-1">Courriel au commanditaire : impact et deux options</M6Do>
        <M6Do id="m6c-2">Message d’équipe : ce qui change, qui fait quoi</M6Do>
        <M6Do id="m6c-3">Message externe : fournisseur, partenaire ou employés</M6Do>
        <M6Do id="m6c-4">Données anonymisées avant tout copier-coller</M6Do>
        <M6Do id="m6c-5">Mini-charte d’usage de l’IA : 5 règles</M6Do>
      </>
    }
  />
);

// ─── M6 · Presentation format ───────────────────────────────────────────────
const M6Slot = ({ n, t, title, children }: { n: number; t: string; title: string; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 22, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 24px', ...dl(n * 110) }}>
    <Num n={n} tone="green" size={52} />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 28, fontWeight: 600, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 23, color: C.muted }}>{children}</div>
    </div>
    <Tag tone="grey" size={21}>
      {t}
    </Tag>
  </div>
);

const M6_Pitch: Page = () => (
  <Frame mod={6} kind="atelier" label="Atelier 2 · Présenter">
    <Title>Votre présentation : 3 minutes, 5 temps</Title>
    <Lede>En partage d’écran : montrez l’outil, pas des diapositives. Et dites la vérité sur l’IA.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1080, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M6Slot n={1} t="20 s" title="Le projet en une phrase">
        Objectif, date, budget
      </M6Slot>
      <M6Slot n={2} t="50 s" title="Le plan, dans l’outil">
        Lots, jalons, chemin critique, un risque
      </M6Slot>
      <M6Slot n={3} t="40 s" title="L’imprévu et votre réaction">
        Ce qui a changé dans le plan
      </M6Slot>
      <M6Slot n={4} t="30 s" title="Un message, lu à voix haute">
        Au commanditaire ou à l’équipe
      </M6Slot>
      <M6Slot n={5} t="40 s" title="Ce que l’IA a raté">
        Et ce que vous avez corrigé
      </M6Slot>
    </div>
    <Timer id="m6-pitch" minutes={3} label="Présentation" cls={A.in} style={{ position: 'absolute', left: 1260, top: 280, width: 540, ...dl(300) }} />
    <Callout cls={A.in} title="Pour le public" tone="blue" icon="note" size={24} style={{ position: 'absolute', left: 1260, top: 620, width: 540, ...dl(500) }}>
      Dans le clavardage : un point fort et une piste pour chaque présentation.
    </Callout>
  </Frame>
);

// ─── M6 · Work time ─────────────────────────────────────────────────────────
const M6_Work: Page = () => (
  <Frame mod={6} kind="atelier" label="Atelier 2 · À vous">
    <Title>À vous de jouer !</Title>
    <Lede>Un point d’étape dans le clavardage à chaque changement d’étape. L’imprévu tombe après l’étape 1.</Lede>
    <Timer id="m6-work" minutes={75} label="Atelier 2" cls={A.in} style={{ position: 'absolute', left: 120, top: 290, ...dl(100) }} />
    <div style={{ position: 'absolute', left: 640, top: 290, width: 1160, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SynthRow n={1} tone="teal" d={200}>
        <b>0:00 – 0:30</b> · Planifier : charte, découpage, échéancier, risques, RACI
      </SynthRow>
      <SynthRow n={2} tone="violet" d={300}>
        <b>0:30 – 0:55</b> · Suivre : l’imprévu, compte rendu, plan mis à jour, rapport
      </SynthRow>
      <SynthRow n={3} tone="yellow" d={400}>
        <b>0:55 – 1:15</b> · Communiquer : trois messages et la mini-charte
      </SynthRow>
      <SynthRow n={4} tone="green" d={500}>
        <b>Ensuite</b> · Pause, puis présentations : 3 minutes par participant
      </SynthRow>
    </div>
    <Callout cls={A.in} title="Coincés ?" tone="blue" icon="chat" size={25} style={{ position: 'absolute', left: 120, top: 760, width: 460, ...dl(600) }}>
      Écrivez « bloqué » dans le clavardage, ou demandez à l’IA ses questions.
    </Callout>
  </Frame>
);

// ─── M6 · Collective feedback grid (interactive stars) ──────────────────────
const M6StarRow = ({ label, sub, v, set }: { label: string; sub: string; v: number; set: (n: number) => void }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '14px 0', borderTop: `1.5px solid ${C.rule}` }}>
    <div style={{ width: 560, flex: 'none' }}>
      <div style={{ fontSize: 28, fontWeight: 600, color: C.ink }}>{label}</div>
      <div style={{ fontSize: 22, color: C.muted }}>{sub}</div>
    </div>
    <div style={{ display: 'flex', gap: 8 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          data-osd-interactive
          onClick={(e) => {
            e.currentTarget.blur();
            set(v === s ? s - 1 : s);
          }}
          style={{ border: 'none', background: 'none', padding: 2, cursor: 'pointer' }}
          title={`${s} sur 5`}
        >
          <svg width={52} height={52} viewBox="0 0 24 24">
            <path
              d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"
              fill={s <= v ? C.yellow : '#fff'}
              stroke={s <= v ? C.amber : C.faint}
              strokeWidth={1.6}
              strokeLinejoin="round"
              style={{ transition: 'fill 200ms' }}
            />
          </svg>
        </button>
      ))}
    </div>
  </div>
);

const M6_Feedback: Page = () => {
  const [team, setTeam] = useState(1);
  const [r, setR] = useState<number[]>([0, 0, 0, 0]);
  const set = (i: number) => (n: number) => setR((o) => o.map((x, j) => (j === i ? n : x)));
  const total = r.reduce((a, x) => a + x, 0);
  return (
    <Frame mod={6} kind="atelier" label="Atelier 2 · Rétroaction collective">
      <Title>Rétroaction collective</Title>
      <Lede>Après chaque présentation : un point fort et une piste dans le clavardage. Le formateur synthétise la grille.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1140, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '14px 32px 10px', ...dl(100) }}>
        <M6StarRow label="Un plan réaliste" sub="Dates, dépendances et responsables vérifiés" v={r[0]} set={set(0)} />
        <M6StarRow label="Une réaction à l’imprévu" sub="Le plan et le chemin critique mis à jour" v={r[1]} set={set(1)} />
        <M6StarRow label="Des messages adaptés" sub="Le bon ton pour chaque public" v={r[2]} set={set(2)} />
        <M6StarRow label="Un usage lucide de l’IA" sub="Ce qui a été corrigé, les données protégées" v={r[3]} set={set(3)} />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1320, top: 270, width: 480, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '26px 30px', ...dl(250) }}>
        <Eyebrow c={C.muted} size={22}>
          Participant {team}
        </Eyebrow>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 110, lineHeight: 1, color: total >= 15 ? C.green : total >= 10 ? C.amber : C.blue }}>{total}</span>
          <span style={{ fontFamily: display, fontWeight: 600, fontSize: 44, color: C.faint }}>/ 20</span>
        </div>
        <div style={{ marginTop: 22, display: 'flex', gap: 12 }}>
          <Btn
            icon="arrow"
            size={22}
            onClick={() => {
              setTeam((t) => t + 1);
              setR([0, 0, 0, 0]);
            }}
          >
            Participant suivant
          </Btn>
          <Btn icon="reset" ghost tone="grey" size={22} onClick={() => setR([0, 0, 0, 0])} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 1320, top: 600, width: 480, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Callout cls={A.in} title="Un point fort" tone="green" icon="star" size={24} style={dl(400)}>
          « Ce qui m’a convaincu, c’est… »
        </Callout>
        <Callout cls={A.in} title="Une piste" tone="yellow" icon="bulb" size={24} style={dl(500)}>
          « Et si vous essayiez… »
        </Callout>
      </div>
    </Frame>
  );
};

// ─── M6 · Debrief ───────────────────────────────────────────────────────────
const M6_Debrief: Page = () => (
  <Frame mod={6} kind="atelier" label="Atelier 2 · Débriefing">
    <Title>Ce que l’atelier nous apprend</Title>
    <Lede>Un dernier sondage dans le clavardage, puis trois questions pour tous.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 820, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AskCard n={1} title="Où l’IA vous a-t-elle le plus aidés ?" sub="Et où vous a-t-elle ralentis ?" d={100} />
      <AskCard n={2} title="Quelle erreur auriez-vous laissé passer ?" sub="Sans la relecture" d={220} />
      <AskCard n={3} title="Que garderez-vous lundi ?" sub="Un outil, une demande, un réflexe" d={340} />
    </div>
    <div style={{ position: 'absolute', left: 1000, top: 280, width: 800 }}>
      <Eyebrow cls={A.in} c={C.violet} style={dl(200)}>
        Sondage · le plus grand gain de temps
      </Eyebrow>
      <Hint cls={A.in} style={{ marginTop: 8, ...dl(260) }}>
        Dans le clavardage : un numéro par personne
      </Hint>
      <Poll cls={A.in} style={{ marginTop: 22, ...dl(360) }}>
        <PollRow id="plan" icon="gantt" tone="teal" label="1 · Le plan de départ" />
        <PollRow id="cr" icon="note" tone="violet" label="2 · Le compte rendu" />
        <PollRow id="report" icon="chart" tone="blue" label="3 · Le rapport au commanditaire" />
        <PollRow id="msg" icon="mail" tone="yellow" label="4 · Les messages aux publics" />
        <PollRow id="none" icon="clock" tone="coral" label="5 · Aucun : la vérification a tout pris" />
      </Poll>
    </div>
  </Frame>
);

// ═══ 90-close ══════════════════════════════════════════════════════════

// ─── Close · The journey ────────────────────────────────────────────────────
const CLMod = ({ n, tone, title, d, children }: { n: number; tone: Tone; title: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ width: 540, ...dl(d) }}>
    <div style={{ boxSizing: 'border-box', height: 300, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '24px 28px' }}>
      <Num n={pad(n)} tone={tone} size={48} />
      <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 32, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 8, fontSize: 24, lineHeight: 1.42, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const CL_Journey: Page = () => (
  <Frame mod={9} kind="synthese">
    <Title>Deux jours, six modules : le chemin parcouru</Title>
    <div style={{ position: 'absolute', left: 120, top: 230, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 30, columnGap: 30 }}>
      <CLMod n={1} tone="blue" title="Introduction à l’IA" d={100}>
        Elle apprend d’exemples et prédit le mot probable, pas le vrai.
      </CLMod>
      <CLMod n={2} tone="teal" title="L’IA en gestion de projet" d={200}>
        Planifier, suivre, rendre compte, communiquer, en cinq ingrédients.
      </CLMod>
      <CLMod n={3} tone="yellow" title="Atelier 1" d={300}>
        Un plan généré en minutes, vérifié ligne par ligne.
      </CLMod>
      <CLMod n={4} tone="violet" title="Automatiser et collaborer" d={400}>
        Comptes rendus, tâches, alertes, bibliothèque d’équipe.
      </CLMod>
      <CLMod n={5} tone="coral" title="Limites et adoption" d={500}>
        Biais, erreurs, données : encadrer, puis embarquer l’équipe.
      </CLMod>
      <CLMod n={6} tone="green" title="Atelier 2" d={600}>
        Un projet complet, un imprévu, et l’IA sous contrôle.
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
      q="Lesquelles de ces pratiques sont recommandées pour un chargé de projet ?"
      explain="L’IA prépare, l’humain décide et vérifie, sur des outils approuvés, avec des données protégées. C’est la conclusion de ces deux jours."
    >
      <Opt ok why="Oui : le contexte, c’est l’ingrédient qui réduit le plus les inventions.">
        Donner le contexte du projet et le format attendu
      </Opt>
      <Opt why="Piège ! Un compte rendu se relit : fausse décision, mauvaise personne, date inventée, point disparu.">
        Diffuser le compte rendu généré sans relecture
      </Opt>
      <Opt ok why="Oui : « Quelles durées as-tu supposées ? » révèle souvent les inventions.">
        Demander à l’IA ce qu’elle a supposé ou deviné
      </Opt>
      <Opt why="Piège ! Des CV dans un outil non approuvé : renseignements personnels exposés et tri biaisé.">
        Classer les CV des candidats avec un assistant gratuit
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
      <CLWhen d={100} tone="blue" icon="bolt" when="Cette semaine" ex="la demande de compte rendu à ma prochaine réunion.">
        Une demande de la bibliothèque, essayée sur un vrai cas.
      </CLWhen>
      <CLWhen d={250} tone="teal" icon="calendar" when="Ce mois-ci" ex="le rapport hebdo préparé avec l’IA, et le temps mesuré.">
        Un usage installé dans votre routine de projet.
      </CLWhen>
      <CLWhen d={400} tone="green" icon="users" when="Dans 3 mois" ex="une charte d’usage proposée et adoptée par l’équipe.">
        Une pratique partagée avec votre équipe.
      </CLWhen>
    </div>
    <Callout cls={A.in} title="Petit et précis" tone="yellow" icon="target" size={26} style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(600) }}>
      « Faire mon compte rendu du mardi avec le modèle » plutôt que « utiliser l’IA plus souvent ».
    </Callout>
  </Frame>
);

// ─── Close · Toolbox ────────────────────────────────────────────────────────
const CLTool = ({ d, icon, tone, title, children }: { d: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <Card tone={tone} icon={icon} title={title} size={24} cls={A.in} style={{ width: 540, height: 270, ...dl(d) }}>
    {children}
  </Card>
);

const CL_Toolbox: Page = () => (
  <Frame mod={9} label="Clôture · Boîte à outils">
    <Title>Votre boîte à outils</Title>
    <Lede>Tout ce que vous emportez de ces deux jours, à retrouver dans ce support.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', rowGap: 30, columnGap: 30 }}>
      <CLTool d={100} icon="list" tone="blue" title="Les cinq ingrédients">
        Rôle, contexte, tâche, format, contraintes. Module 2.
      </CLTool>
      <CLTool d={200} icon="book" tone="teal" title="La bibliothèque">
        Six demandes types : plan, compte rendu, rapport, message, risques, réunion. Module 4.
      </CLTool>
      <CLTool d={300} icon="check" tone="green" title="La grille de contrôle">
        Huit critères pour vérifier un plan généré. Atelier 1.
      </CLTool>
      <CLTool d={400} icon="filter" tone="coral" title="Le feu tricolore">
        Vert, jaune, rouge : quelles données dans quel outil. Module 5.
      </CLTool>
      <CLTool d={500} icon="shieldCheck" tone="violet" title="La charte d’équipe">
        Huit règles d’usage, à adapter avec votre équipe. Module 5.
      </CLTool>
      <CLTool d={600} icon="shield" tone="yellow" title="Pour aller plus loin">
        Commission d’accès à l’information du Québec (cai.gouv.qc.ca) et l’aide en ligne de vos outils.
      </CLTool>
    </div>
  </Frame>
);

// ─── Close · Thanks ─────────────────────────────────────────────────────────
const CL_Thanks: Page = () => (
  <Frame mod={9} chrome={false}>
    <img src={logoStack} alt="Technologia" className={A.fade} style={{ position: 'absolute', left: 112, top: 78, height: 120, display: 'block' }} />
    <div style={{ position: 'absolute', left: 120, top: 300, width: 1000 }}>
      <Eyebrow cls={A.in} size={28}>
        Formation IA124 · Fin
      </Eyebrow>
      <h1 className={A.in} style={{ margin: '18px 0 0', fontFamily: display, fontWeight: 700, fontSize: 128, lineHeight: 1.0, color: C.ink, ...dl(120) }}>
        Merci !
      </h1>
      <p className={A.in} style={{ margin: '26px 0 0', fontSize: 38, lineHeight: 1.35, color: C.soft, ...dl(240) }}>
        L’IA fait le premier jet. <Hl>Vous faites le dernier.</Hl>
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
  title: "IA appliquée à la gestion de projet — Formation IA124 (2 jours)",
  createdAt: '2026-10-23T17:27:35.028Z',
  theme: 'technologia',
};

export default [
  GP_Cover,
  GP_Trainer,
  GP_Roundtable,
  GP_Objectives,
  GP_Program,
  GP_HowWeWork,
  GP_Velo,
  GP_Brief,
  GP_Quiz0,
  M1_Divider,
  M1_Day,
  M1_Define,
  M1_RulesVsLearn,
  M1_Learn,
  M1_Families,
  M1_NextWord,
  M1_Plausible,
  M1_History,
  M1_AiOrNot,
  M1_ThreeWords,
  M1_Pipeline,
  M1_Compare,
  M1_Sort,
  M1_Business,
  M1_Figures,
  M1_GoodBad,
  M1_Qcm1,
  M1_Qcm2,
  M1_Synth,
  M2_Divider,
  M2_Lifecycle,
  M2_Time,
  M2_UcPlan,
  M2_UcTrack,
  M2_UcReport,
  M2_UcComm,
  M2_Matrix,
  M2_Families,
  M2_Generic,
  M2_Microsoft,
  M2_Google,
  M2_PmTools,
  M2_Choose,
  M2_Anatomy,
  M2_BeforeAfter,
  M2_Iterate,
  M2_Qcm,
  M2_Synth,
  M3_Divider,
  M3_Brief,
  M3_File,
  M3_Notion,
  M3_ClickUp,
  M3_Charter,
  M3_Wbs,
  M3_Gantt,
  M3_Risks,
  M3_Raci,
  M3_Board,
  M3_Check,
  M3_Traps,
  M3_Work,
  M3_Debrief,
  J1_Wrap,
  J1_Exit,
  J2_Cover,
  J2_Recall,
  J2_Program,
  M4_Divider,
  M4_Meeting,
  M4_Transcript,
  M4_CrPrompt,
  M4_CrErrors,
  M4_Tools,
  M4_Consent,
  M4_ToTasks,
  M4_Rules,
  M4_Alerts,
  M4_Sim,
  M4_Report,
  M4_Team,
  M4_Library,
  M4_Qcm1,
  M4_Qcm2,
  M4_Synth,
  M5_Divider,
  M5_Three,
  M5_Bias,
  M5_BiasPm,
  M5_Errors,
  M5_HowMuch,
  M5_Data,
  M5_Traffic,
  M5_Anon,
  M5_Law,
  M5_Reflexes,
  M5_Personas,
  M5_Curve,
  M5_Plan,
  M5_Charter,
  M5_Qcm1,
  M5_Qcm2,
  M5_Synth,
  M6_Divider,
  M6_Brief,
  M6_Projects,
  M6_Plan,
  M6_Twist,
  M6_Track,
  M6_Comm,
  M6_Pitch,
  M6_Work,
  M6_Feedback,
  M6_Debrief,
  CL_Journey,
  CL_Quiz,
  CL_Action,
  CL_Toolbox,
  CL_Thanks,
] satisfies Page[];

// Speaker notes — one entry per page, same order as the default export.
export const notes: (string | undefined)[] = [
  `⏱ 2 min · ACCUEIL (page affichée pendant l'arrivée des participants)

OBJECTIF — Installer un climat chaleureux et poser le cadre : deux jours pour passer de « j'entends parler de l'IA partout » à « je sais où elle m'aide dans mes projets, et où elle ne m'aide pas ».

DIRE — « Bonjour et bienvenue à la formation IA appliquée à la gestion de projet. Pendant deux jours, on va comprendre ce qu'est l'intelligence artificielle, sans jargon, puis l'utiliser pour planifier, suivre et communiquer dans un projet. Aujourd'hui : comprendre et planifier. Demain : automatiser, collaborer, et adopter l'IA de façon responsable. »

Montrer l'animation : « À droite, un plan de projet qui se construit tout seul. Ce n'est pas de la magie : c'est ce qu'on fera ensemble cet après-midi, avec une IA, puis en vérifiant tout. »

LOGISTIQUE — Classe virtuelle : horaire (9 h – 16 h), pauses (10 h 30 et 14 h 30), dîner (12 h – 13 h). Vérifiez son, caméra et clavardage ; demandez à chacun d'ouvrir dès maintenant un assistant d'IA dans un autre onglet ou sur un second écran (un compte gratuit ChatGPT, Gemini, Copilot ou Claude suffit). Évaluation à la fin du jour 2.

TRANSITION — « Avant d'entrer dans le sujet, quelques mots sur moi. »`,
  `⏱ 3 min

OBJECTIF — Établir votre crédibilité et un contrat pédagogique clair.

DIRE — Présentez-vous en 60 à 90 secondes. À PERSONNALISER : votre parcours, les projets que vous avez menés ou accompagnés, et un exemple où l'IA vous a fait gagner du temps (ou vous a joué un tour).

Puis les quatre engagements :
1. Sans jargon — « Vous n'avez besoin d'aucune connaissance technique. Si j'utilise un mot compliqué, arrêtez-moi. »
2. Vos outils — « On travaille avec ce que vous avez déjà : Outlook, Teams, Google, Notion, Trello… ou une version gratuite d'un assistant. »
3. Des modèles réutilisables — « Vous repartez avec des demandes types : plan de projet, compte rendu, rapport d'avancement. »
4. Un regard lucide — « L'IA se trompe. On verra quand, pourquoi, et comment s'en protéger. »

INTERACTION — « Qui a déjà demandé quelque chose à ChatGPT ou à Copilot cette semaine ? » Réponses dans le clavardage (« oui » / « non ») : souvent la majorité. « Parfait, on part de là. »

TRANSITION — « À votre tour maintenant. »`,
  `⏱ 15 min (1 min par personne, ajuster selon la taille du groupe)

OBJECTIF — Connaître le groupe, ses projets et ses irritants, pour adapter les exemples des deux jours.

ANIMATION — Lancez le minuteur. Appelez chaque personne par son prénom (ordre de la liste des participants) ; elle ouvre son micro et répond aux trois questions. Notez dans un document à vous les tâches qui « prennent le plus de temps » : vous y reviendrez au module 2 (cas d'usage) et à l'atelier 2 (mini-projet).

SONDAGE ÉCLAIR — Chacun écrit dans le clavardage le numéro de la ligne qui le décrit (1 à 5). Cliquez une fois la ligne par réponse (le bouton « − » corrige une erreur). Les barres se comparent automatiquement. Variante : le sondage intégré de Teams ou Zoom.

LECTURE DU RÉSULTAT —
• Majorité « jamais / personnel » : prenez votre temps au module 1, multipliez les démonstrations en direct.
• Majorité « au travail / dans mes projets » : accélérez les définitions, insistez sur les outils intégrés et la vérification.
• Quelqu'un répond « Mon équipe a des règles d'usage » : demandez-lui de les partager au module 5.

TRANSITION — « Merci ! Voici ce que je vous propose d'atteindre ensemble. »`,
  `⏱ 2 min

OBJECTIF — Présenter les cinq objectifs officiels comme une progression.

DIRE — « Cinq marches, qui reprennent les objectifs de la formation. »
1. COMPRENDRE — « Ce matin : ce qu'est l'IA, et ce qu'elle fait concrètement dans un projet. »
2. UTILISER — « Cet après-midi : les assistants génériques, ChatGPT, Gemini, Copilot, Claude, et l'IA intégrée dans Notion, ClickUp ou Teams. Atelier : générer un plan de projet. »
3. AUTOMATISER — « Demain matin : comptes rendus, résumés de réunions, suivi des tâches et alertes. »
4. COLLABORER — « Des pratiques d'équipe : bibliothèque de demandes, règles communes. »
5. MAÎTRISER — « Les biais, les erreurs, la confidentialité, et comment embarquer une équipe. »

INTERACTION — « Laquelle de ces marches vous intéresse le plus ? » Deux ou trois réponses rapides suffisent.

TRANSITION — « Voici comment ces deux jours s'organisent. »`,
  `⏱ 2 min

OBJECTIF — Donner de la visibilité sur le déroulement.

DIRE — « Jour 1 : comprendre et planifier. Module 1, l'IA expliquée simplement. Module 2, l'IA dans la gestion de projet : cas d'usage et outils du quotidien. Puis l'atelier 1 : vous générez un plan de projet avec l'IA et vous le vérifiez. »

« Jour 2 : automatiser et adopter. Module 4, comptes rendus, résumés de réunions et suivi des tâches. Module 5, limites, éthique et conduite du changement. Puis l'atelier 2, le gros morceau : un mini-projet complet avec l'IA, que vous présenterez au groupe. »

À SOULIGNER — Les ateliers sont les carrés jaunes (modules 3 et 6). Précisez qu'ils se font en autonomie, chacun sur son poste, avec des points d'étape dans le clavardage.

TRANSITION — « Parlons de la façon dont on va travailler. »`,
  `⏱ 2 min

OBJECTIF — Expliquer les codes visuels et le contrat de participation.

DIRE — « Vous verrez des étiquettes en haut des pages. »
• QCM (violet) — « Vous votez dans le clavardage, je clique la réponse majoritaire, la rétroaction est immédiate. Les mauvaises réponses sont des pièges volontaires. »
• EXERCICE (vert) — « On manipule à l'écran : cartes, glisser-déposer, simulateurs. »
• DÉMO (bleu) — « Je montre en direct, en partage d'écran. »
• ATELIER (jaune) — « Chacun sur son poste, guidé pas à pas, avec un minuteur et un livrable. »

LES TROIS RÈGLES —
1. Questions dans le clavardage, à tout moment ; je les lis aux transitions.
2. « Aucune donnée confidentielle dans les outils pendant la formation. » C'est déjà une bonne pratique : on y reviendra au module 5.
3. Fil rouge : Vélo Fleuve, présenté juste après.

CLASSE VIRTUELLE — Caméra si possible, micro coupé hors échanges. Idéal : deux écrans, ou la formation dans une fenêtre et l'outil d'IA dans l'autre. En atelier, on travaille sur le projet fictif ou sur une version anonymisée du sien.

TRANSITION — « Faisons connaissance avec Vélo Fleuve. »`,
  `⏱ 3 min · FIL ROUGE

OBJECTIF — Ancrer la formation dans un projet concret et transversal, réutilisé dans chaque module et dans les deux ateliers.

DIRE — « Vélo Fleuve est une entreprise fictive, mais réaliste : un fabricant de vélos électriques de Lévis, 180 employés, trois boutiques-ateliers. Les ventes montent, alors la direction ouvre une quatrième boutique à Québec, dans Limoilou. »

Présenter l'équipe (les cartes apparaissent une à une) :
• Karim, chargé de projet. « Il vient de l'atelier. C'est son premier grand projet : il ressemble à beaucoup d'entre vous. »
• Luc, le commanditaire : la date et le budget.
• Julie, RH : huit embauches.
• Maxime, marketing : campagne et portes ouvertes.
• Annie, TI : caisse, inventaire, Wi-Fi, prise de rendez-vous.

INSISTER — Un projet transversal : RH, marketing, TI, opérations. Chacun d'entre vous s'y retrouvera.

TRANSITION — « Regardons le mandat de Karim. »`,
  `⏱ 3 min · FIL ROUGE

OBJECTIF — Poser les données du projet et la question de la formation.

DIRE — « 22 semaines pour ouvrir, le samedi 10 avril. 420 000 $ de budget, travaux compris. Cinq services autour de la table. Huit embauches. »

« Et voici ce qui inquiète Karim. » Lire les quatre irritants : l'échéancier à bâtir, la réunion hebdomadaire et ses comptes rendus, savoir ce qui glisse sans relancer tout le monde, informer chacun à sa façon. « Ces quatre irritants correspondent aux quatre usages de l'IA qu'on verra au module 2 : planifier, suivre, faire rapport, communiquer. »

QUESTION — Pointer l'encadré : « Où l'IA peut-elle faire gagner du temps à Karim, sans lui faire perdre le contrôle ? C'est la question qu'on se posera pendant deux jours. »

INTERACTION — « Lequel de ces quatre irritants vivez-vous en ce moment ? » Réponse dans le clavardage (1 à 4).

TRANSITION — « Testons vos intuitions avant de commencer. »`,
  `⏱ 4 min · QCM À RÉPONSES MULTIPLES

OBJECTIF — Faire émerger les représentations initiales sans juger.

ANIMATION — Lisez la question. Les participants écrivent dans le clavardage les lettres qu'ils retiennent (ex. « A C »). Cochez les options choisies par la majorité, puis « Valider ma sélection ». Cliquez ensuite chaque option pour lire l'explication. Avec →, vous révélez les bonnes réponses, puis l'essentiel.

RÉPONSES — A et C.
• A ✓ — Une première découpe des tâches : l'IA est très bonne pour proposer une structure de départ.
• B ✗ PIÈGE — « L'IA ne connaît ni l'entrepreneur, ni les délais de livraison du fournisseur. Elle propose des durées plausibles, pas des engagements. »
• C ✓ — Le compte rendu : un usage très rentable, à condition de relire.
• D ✗ PIÈGE — « Couper dans le budget, c'est une décision. Elle reste humaine. L'IA peut préparer trois scénarios chiffrés ; Luc tranche. »

MESSAGE CLÉ — L'IA prépare, l'humain décide et vérifie.

TRANSITION — « Mais d'abord : qu'est-ce que c'est, au juste, l'intelligence artificielle ? »`,
  `⏱ 1 min · DÉBUT DU MODULE 1 (≈ 9 h 30)

OBJECTIF — Annoncer le plan du module.

DIRE — « Module 1 : introduction à l'intelligence artificielle. Le but n'est pas de faire de vous des spécialistes, mais que vous compreniez assez bien la machine pour savoir quand lui faire confiance. »

« Au programme : une définition simple et des exemples ; comment une machine apprend et comment un outil comme ChatGPT écrit ses réponses, avec des animations ; la différence entre IA, automatisation et robotisation, trois mots souvent mélangés ; et un panorama des usages, dans votre vie et en entreprise. »

RYTHME — Environ 1 h 30, avec la pause de 10 h 30 vers la page « IA, automatisation, robotisation ».

TRANSITION — « Commençons par une journée ordinaire. »`,
  `⏱ 4 min · UNE JOURNÉE AVEC L'IA (6 clics)

OBJECTIF — Montrer que l'IA n'est pas nouvelle ni lointaine : on l'utilise déjà tous les jours.

DIRE — « Avant de définir quoi que ce soit, suivons une journée ordinaire. »
→ beat 1 : « 7 h : vous déverrouillez votre téléphone avec votre visage. C'est de l'IA qui perçoit. »
→ beat 2 : « 8 h 10 : le GPS vous fait éviter un bouchon. Il prédit la circulation à partir de millions de trajets. »
→ beat 3 : « 9 h : votre boîte de réception est presque sans pourriels. Le filtre a appris à les reconnaître. »
→ beat 4 : « 11 h 30 : un courriel en anglais ? Un clic, il est traduit. »
→ beat 5 : « 14 h : votre clavier finit la phrase à votre place. C'est exactement le principe de ChatGPT, en miniature. »
→ beat 6 : « 20 h 30 : "Vous aimerez aussi…". La plateforme a appris vos goûts. »

QUESTION — « Avant ce matin, combien d'entre vous auraient dit "j'utilise l'IA tous les jours" ? »

TRANSITION — « Alors, comment définir ce qui se cache derrière tout ça ? »`,
  `⏱ 3 min · DÉFINITION (4 clics)

OBJECTIF — Donner une définition simple et quatre capacités concrètes.

DIRE — « Une définition simple, qu'on gardera pour deux jours : des programmes capables de faire des tâches qui demandaient jusqu'ici l'intelligence humaine. Concrètement, quatre capacités. »
→ beat 1 : « Percevoir : voir une image, entendre une voix. Exemple projet : transcrire une réunion. »
→ beat 2 : « Comprendre : lire un texte et en saisir le sens. Exemple : résumer un fil de 40 courriels. »
→ beat 3 : « Prédire : anticiper à partir du passé. Exemple : repérer la tâche qui va glisser. »
→ beat 4 : « Générer : produire un texte, une image, un plan. C'est l'IA générative, celle de ChatGPT. »

INSISTER — L'IA n'est pas « intelligente » comme nous : elle imite certaines capacités, sans conscience ni compréhension du monde.

TRANSITION — « Mais qu'est-ce qui la rend différente d'un logiciel ordinaire ? »`,
  `⏱ 4 min · PROGRAMMER OU APPRENDRE (3 clics)

OBJECTIF — Faire comprendre l'idée centrale de l'apprentissage automatique.

DIRE — « À gauche, la programmation classique. Un humain écrit les règles : si le courriel contient "gratuit", alors c'est un pourriel. »
→ beat 1 : « Problème : le fournisseur écrit "Livraison gratuite de vos vélos", et le courriel est bloqué à tort. Les règles écrites à la main sont fragiles. »
→ beat 2 : « À droite, l'apprentissage automatique. On ne donne plus les règles : on donne 100 000 courriels déjà classés par des humains. La machine en déduit ses propres règles. »
→ beat 3 : « Elle repère seule des centaines d'indices. Ce qu'elle a appris s'appelle un modèle. Et revers de la médaille : elle apprend aussi les erreurs et les biais de ses exemples. On y reviendra demain au module 5. »

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

INSISTER — Le mot clé est « probabilité ». Toutes les IA, y compris ChatGPT, fonctionnent ainsi.

TRANSITION — « Toutes les IA apprennent comme ça. Mais elles ne produisent pas toutes la même chose. »`,
  `⏱ 3 min · TROIS FAMILLES (3 clics)

OBJECTIF — Donner une carte simple des types d'IA.

DIRE — → beat 1 : « L'IA qui prédit : elle classe, estime, anticipe. Le filtre anti-pourriel, la détection de fraude. En projet : estimer une durée, signaler une tâche à risque. »
→ beat 2 : « L'IA qui perçoit : elle voit et entend. Votre visage, votre voix. En projet : transcrire une réunion, lire une facture numérisée. »
→ beat 3 : « L'IA qui génère : elle produit du contenu nouveau. ChatGPT, Gemini, Copilot, Claude. En projet : un plan, un compte rendu, un courriel. C'est celle qui nous occupera le plus. »

À SOULIGNER — Les outils modernes combinent souvent les trois : Teams transcrit (perçoit), puis résume (génère).

TRANSITION — « Ouvrons le capot de l'IA qui génère. »`,
  `⏱ 5 min · EXERCICE INTERACTIF : LE MOT SUIVANT

OBJECTIF — Faire comprendre comment un LLM écrit, et pourquoi il peut se tromper.

ANIMATION — Cliquez « Mot suivant » à six reprises. À chaque clic, lisez à voix haute les candidats et leurs probabilités, puis le mot retenu.

DIRE — « La phrase commence par : "La réunion de suivi du projet est reportée à…". Quel est le mot suivant le plus probable ? » Laissez le groupe proposer. « Le modèle hésite entre lundi, demain, jeudi… Il choisit "lundi". Puis il recommence avec la phrase allongée. »

À droite, les trois étapes : il a lu des milliards de phrases, il calcule la probabilité de chaque mot, il choisit et recommence.

CHUTE — À la fin : « La phrase est fluide. Mais qui a dit que le fournisseur était en cause ? Personne. Le modèle a choisi ce qui sonne bien. Retenez ça : il prédit, il ne vérifie pas. »

ASTUCE — « Recommencer » remet la phrase à zéro si un participant veut refaire l'expérience.

TRANSITION — « Conséquence directe : ce qui est probable n'est pas toujours vrai. »`,
  `⏱ 4 min · HALLUCINATION (4 clics)

OBJECTIF — Montrer une hallucination réaliste, dans le contexte du fil rouge.

DIRE — « Karim demande combien de temps durent des travaux d'aménagement. La réponse est claire, précise, rassurante. »
→ beat 1 : « 11,4 semaines. La virgule fait sérieux. Rien ne dit d'où vient ce chiffre. »
→ beat 2 : « Une étude d'un "Observatoire québécois des chantiers commerciaux". Le nom est plausible. Cette étude n'existe pas : l'IA l'a fabriquée. »
→ beat 3 : « Deux semaines pour le permis : peut-être juste. Seule la Ville le sait. »
→ beat 4 : « Ça s'appelle une hallucination. Le modèle comble les trous avec du vraisemblable. »

INSISTER — Plus la question est précise (chiffre, date, source, loi), plus il faut vérifier.

TRANSITION — « Un petit détour par l'histoire pour comprendre pourquoi tout le monde en parle depuis 2022. »`,
  `⏱ 3 min · HISTORIQUE

OBJECTIF — Situer l'IA dans le temps : un domaine ancien, une rupture récente.

DIRE — « 1956 : le terme intelligence artificielle est inventé lors d'une conférence aux États-Unis. 1997 : Deep Blue bat Kasparov aux échecs. 2011 : Siri. 2012 : l'apprentissage profond se met à reconnaître les images. 2016 : AlphaGo bat un champion du jeu de go. 2017 : des chercheurs de Google inventent le Transformer, le T de GPT. »

Pointer 2022 (en jaune) : « Novembre 2022 : ChatGPT. Pour la première fois, n'importe qui peut parler à une IA, en français, sans rien installer. »

« Depuis 2023, l'IA entre dans les outils que vous utilisez déjà : Outlook, Teams, Google, Notion, ClickUp. C'est ce qui nous intéresse pour la gestion de projet. »

TRANSITION — « Vérifions vos réflexes : IA ou pas IA ? »`,
  `⏱ 6 min · EXERCICE : IA OU PAS IA ?

OBJECTIF — Distinguer IA et simple règle programmée.

ANIMATION — Pour chaque carte : lisez-la, faites voter dans le clavardage (« IA » ou « pas IA »), puis cliquez pour retourner.

RÉPONSES —
• Rappel Outlook 15 min avant : pas d'IA, règle fixe.
• Netflix : IA, apprentissage des goûts.
• Résumé Teams : IA, perception (transcription) puis génération (résumé).
• Excel en rouge : pas d'IA, mise en forme conditionnelle.
• Réponse suggérée Gmail : IA, prédiction de texte.
• Thermostat à 22 h : pas d'IA. « S'il apprenait vos habitudes tout seul, là ce serait de l'IA. »

MESSAGE CLÉ — Tout ce qui est automatique n'est pas de l'IA. Le critère : est-ce que ça apprend ou interprète ?

TRANSITION — « Justement, trois mots se mélangent souvent : IA, automatisation, robotisation. » (Pause de 10 h 30 vers ici selon le rythme.)`,
  `⏱ 4 min · TROIS MOTS

OBJECTIF — Définir clairement automatisation, robotisation et IA.

DIRE — « Automatisation : la recette suivie à la lettre. Des règles "si… alors…", toujours le même résultat. Exemple : une tâche passe en retard, un courriel part au responsable. »

« Robotisation : la main qui exécute. Un robot physique, comme un bras d'usine, ou un robot logiciel, qu'on appelle RPA, qui refait les clics d'un humain dans un logiciel. Exemple : recopier chaque facture dans un vieux logiciel comptable. »

« Intelligence artificielle : le jugement appris. Elle interprète, prédit ou génère. Elle gère l'imprévu… avec des erreurs possibles. Exemple : lire un courriel libre du fournisseur et comprendre qu'il annonce un retard. »

QUESTION — « Dans votre service, vous avez plutôt de l'automatisation, de la robotisation ou de l'IA ? »

TRANSITION — « Et dans la réalité, ils travaillent souvent ensemble. »`,
  `⏱ 3 min · PIPELINE (4 clics)

OBJECTIF — Montrer que les trois se combinent dans un même flux.

DIRE — « Le fournisseur de comptoirs écrit à Karim : "On aura deux semaines de retard, désolés." Un texte libre, comme tous les courriels. »
→ beat 1 : « L'IA comprend : quel lot est touché, quel retard, quel impact sur l'ouverture. »
→ beat 2 : « L'automatisation applique une règle : si un jalon bouge de plus d'une semaine, alerte à Karim et à Luc. »
→ beat 3 : « Le robot logiciel inscrit le changement dans le registre, un vieil outil sans connecteur. »
→ beat 4 : « Et qui décide ? Aucun des trois. Karim valide le nouvel échéancier ; Luc arbitre si l'ouverture est menacée. »

TRANSITION — « Résumons les différences critère par critère. »`,
  `⏱ 3 min · TABLEAU COMPARATIF (5 clics)

OBJECTIF — Fixer les différences de façon mémorisable.

DIRE — Une ligne par clic.
→ beat 1 : « Fonctionne avec : des règles, des clics, ou des exemples. »
→ beat 2 : « Face à l'imprévu : l'automatisation et le robot bloquent. L'IA s'adapte, en partie. »
→ beat 3 : « Le résultat : identique à chaque fois pour les deux premiers. Variable pour l'IA : posez deux fois la même question, vous aurez deux réponses différentes. »
→ beat 4 : « L'erreur typique : une règle mal pensée, une mise à jour du logiciel qui casse le robot… et pour l'IA, une erreur dite avec aplomb. »
→ beat 5 : « Idéal pour : le répétitif et stable, les vieux logiciels, et pour l'IA le texte, le langage, l'ambigu. »

TRANSITION — « À vous de jouer. »`,
  `⏱ 6 min · EXERCICE GLISSER-DÉPOSER (1 clic pour le corrigé)

OBJECTIF — Appliquer la distinction sur des tâches du projet Limoilou.

ANIMATION — Pour chaque étiquette, demandez la colonne dans le clavardage (« auto », « robot » ou « IA ») et glissez-la selon la majorité. Double-cliquer une étiquette la remet à sa place.
→ beat 1 : le corrigé apparaît sur chaque étiquette.

CORRIGÉ —
• Automatisation : rappel la veille d'une échéance, tâche créée par formulaire, archivage du vendredi.
• Robotisation : recopier les factures PDF (robot logiciel), bras qui assemble les cadres (robot physique).
• IA : résumer 40 courriels, repérer les tâches à risque, rédiger l'annonce.

DÉBAT — « Repérer les tâches qui risquent de glisser » : certains diront automatisation. Nuance : une règle signale le retard constaté ; l'IA prédit le retard à venir.

TRANSITION — « Élargissons : où trouve-t-on l'IA en entreprise ? »`,
  `⏱ 3 min · PANORAMA PAR SERVICE

OBJECTIF — Montrer l'IA dans chaque service, en écho aux profils du groupe.

DIRE — Parcourez rapidement les six tuiles, en vous attardant sur les services des participants (notés au tour de table).
• RH : offres d'emploi, questions des employés. « Attention au tri automatique de CV : on parlera des biais demain. »
• Marketing : textes et visuels, idées de contenus.
• TI : soutien, documentation, aide au code.
• Finance : lecture de factures, prévision.
• Service à la clientèle : agents conversationnels, tri des courriels.
• Opérations : prévision de la demande, maintenance prédictive.

QUESTION — « Dans votre service, qu'est-ce qui existe déjà ? »

TRANSITION — « Quelques chiffres pour mesurer la vitesse du mouvement. »`,
  `⏱ 3 min · CHIFFRES

OBJECTIF — Situer l'ampleur du mouvement, avec des sources.

DIRE — « 800 millions d'utilisateurs de ChatGPT chaque semaine, selon OpenAI en octobre 2025. »
« Au Canada, Statistique Canada mesure la part des entreprises qui utilisent l'IA pour produire des biens ou des services : 12,2 % au 2ᵉ trimestre 2025, le double d'un an plus tôt. C'est encore une minorité, mais ça double chaque année. »
« Et une prédiction de Gartner, faite en 2019 : d'ici 2030, 80 % du travail de gestion de projet "classique" (collecte de données, suivi, rapports) serait pris en charge par l'IA. »

LECTURE — « Ça ne veut pas dire que le chargé de projet disparaît. Il passe moins de temps à compiler, plus de temps à décider et à animer. »

À VÉRIFIER — Avant chaque session, vérifiez si des chiffres plus récents sont disponibles (OpenAI, Statistique Canada).

TRANSITION — « Concrètement, à quoi l'IA générative est-elle bonne ? »`,
  `⏱ 3 min · FORCES ET LIMITES (2 clics)

OBJECTIF — Poser un regard équilibré, préparer le module 5.

DIRE — « À gauche, ce qu'elle fait très bien : un premier jet en quelques secondes, résumer, reformuler, structurer, proposer des idées et des risques oubliés, traduire. »
→ beat 1 : « À droite, ce qu'elle fait moins bien : les faits précis, les chiffres et les sources ; les calculs longs ; votre contexte, si vous ne le lui donnez pas ; les décisions ; et surtout, elle n'assume aucune responsabilité. »
→ beat 2 : « La règle d'or de ces deux jours : l'IA fait le premier jet, vous faites le dernier. »

TRANSITION — « Deux questions pour vérifier tout ça. »`,
  `⏱ 3 min · QCM 1

ANIMATION — Votes dans le clavardage (A, B, C ou D). Cliquez l'option majoritaire pour la rétroaction, puis → pour la bonne réponse et → pour l'essentiel.

RÉPONSE — B, une automatisation à base de règles.
• A ✗ PIÈGE — « Automatique ne veut pas dire intelligent. »
• C ✗ PIÈGE — Pas de clics simulés : l'outil envoie lui-même le courriel.
• D ✗ PIÈGE — Les trois notions sont distinctes.

POUR ALLER PLUS LOIN — « Qu'est-ce qui en ferait de l'IA ? Prédire les tâches qui vont prendre du retard, avant qu'elles le soient. »

TRANSITION — « Deuxième question, sur les hallucinations. »`,
  `⏱ 3 min · QCM 2

RÉPONSE — C : il génère le texte le plus probable, sans vérifier qu'il est vrai.
• A ✗ PIÈGE — Pas d'intention : aucune volonté de tromper.
• B ✗ PIÈGE — Ce n'est pas un bogue : c'est le fonctionnement normal du modèle.
• D ✗ PIÈGE — Une demande précise aide, mais ne supprime pas le risque.

MESSAGE CLÉ — Tout chiffre, toute source, toute référence à une loi se vérifie.

TRANSITION — « Faisons le bilan du module 1. »`,
  `⏱ 2 min · SYNTHÈSE MODULE 1

DIRE — Relisez les cinq points en les reliant aux animations vues :
1. L'IA apprend à partir d'exemples (le filtre anti-pourriel).
2. Trois familles : prédire, percevoir, générer.
3. Un LLM écrit le mot le plus probable (le mot suivant), pas le plus vrai (l'étude inventée).
4. Automatisation, robotisation, IA : règles, clics, jugement appris.
5. L'IA fait le premier jet, vous faites le dernier.

À VOTRE POSTE — Lisez la carte bleue : trois moments où vous utilisez déjà l'IA, et une question métier à vérifier.

TRANSITION — « Passons au cœur du sujet : l'IA dans la gestion de projet. »`,
  `⏱ 1 min · DÉBUT DU MODULE 2 (≈ 11 h 15)

OBJECTIF — Annoncer le plan du module.

DIRE — « Module 2 : l'IA dans la gestion de projet. Maintenant qu'on sait ce qu'est l'IA, on la met au service de vos projets. »

« Au programme : l'IA à chaque phase du cycle de vie ; quatre cas d'usage concrets sur le projet de Karim ; l'IA dans les outils que vous utilisez déjà, Outlook, Teams, Google, Notion, Trello, ClickUp ; et la compétence qui fait toute la différence : bien formuler sa demande. »

RYTHME — Le dîner tombe vers la page « Deux familles d'outils ». Les outils et les demandes se font après le dîner.

TRANSITION — « Commençons par le cycle de vie que vous connaissez. »`,
  `⏱ 4 min · CYCLE DE VIE (5 clics)

OBJECTIF — Montrer que l'IA intervient à chaque phase, pas seulement pour « écrire des textes ».

DIRE — « Vous reconnaissez les cinq phases. Voyons ce que l'IA y apporte. »
→ beat 1 : « Démarrer : un premier jet de la charte, la liste des parties prenantes, et les questions à poser au commanditaire avant de commencer. »
→ beat 2 : « Planifier : le découpage en tâches, l'échéancier de départ, le registre des risques. C'est l'atelier de cet après-midi. »
→ beat 3 : « Exécuter : comptes rendus, courriels, documents. Le gros du volume. »
→ beat 4 : « Suivre : alertes, rapport d'avancement, écarts expliqués. Demain matin. »
→ beat 5 : « Clôturer : bilan, leçons apprises, transfert. La phase qu'on bâcle souvent, faute de temps. »

QUESTION — « Dans quelle phase perdez-vous le plus de temps ? »

TRANSITION — « Regardons justement où passe le temps de Karim. »`,
  `⏱ 3 min · LA SEMAINE DE KARIM (1 clic)

OBJECTIF — Relier l'IA à un irritant mesurable : le temps.

DIRE — « Karim a noté sa semaine. 11 heures de réunions, 9 heures de courriels et relances, 6 de planification, 5 de rapports, 5 d'imprévus, et seulement 4 heures sur le terrain avec l'équipe. »
→ beat 1 : « L'IA aide surtout sur les quatre premières lignes : comptes rendus, rédaction, premiers jets, rapport hebdomadaire. Pas sur les imprévus ni sur l'équipe. »

INSISTER — « Le but n'est pas de faire plus de réunions. C'est de rendre du temps à ce que l'IA ne fait pas : régler les imprévus et animer l'équipe. »

PRÉCISION — Ces heures sont un exemple de l'entreprise fictive, pas une statistique.

INTERACTION — « Si vous faisiez l'exercice, quelle serait votre plus grande barre ? »

TRANSITION — « Quatre usages concrets, un par page. Premier : planifier. »`,
  `⏱ 4 min · CAS D'USAGE 1 : PLANIFICATION (2 clics)

OBJECTIF — Montrer une demande de planification réaliste et sa réponse.

DIRE — « À gauche, ce que l'IA fait bien en planification : découper, ordonner, estimer, lister les risques. »
→ beat 1 : « La demande de Karim. Remarquez : il donne le contexte (22 semaines, 420 k$, 8 embauches) et une contrainte (6 lots au maximum). »
→ beat 2 : « La réponse, en quelques secondes : six lots cohérents. Est-ce parfait ? Non. Mais Karim ne part plus d'une page blanche. »

QUESTION — « Que manque-t-il dans ce découpage ? » Réponses possibles : les achats d'inventaire, l'assurance, la gestion de projet elle-même, l'enseigne. « Bravo : c'est exactement votre valeur ajoutée. »

TRANSITION — « Deuxième usage : le suivi. »`,
  `⏱ 4 min · CAS D'USAGE 2 : SUIVI (2 clics)

OBJECTIF — Montrer l'IA comme lecteur rapide d'un état d'avancement.

DIRE — « Le suivi, c'est consolider, repérer ce qui glisse, répondre à "où en est-on ?", préparer la réunion. »
→ beat 1 : « Karim colle l'export de ses tâches et pose une question précise, avec un jalon et une date. »
→ beat 2 : « La réponse liste trois retards et, surtout, identifie celui qui compte : la soumission de l'électricien, sur le chemin critique. »

INSISTER — L'IA peut se tromper sur le chemin critique si les dépendances ne sont pas dans les données. Karim vérifie.

LIEN — « Demain, on verra comment l'outil peut faire ce suivi tout seul, avec des alertes. »

TRANSITION — « Troisième usage : le rapport. »`,
  `⏱ 3 min · CAS D'USAGE 3 : REPORTING (2 clics)

OBJECTIF — Montrer le gain sur le rapport d'avancement hebdomadaire.

DIRE — « Le rapport du vendredi : une heure en moyenne pour beaucoup de chargés de projet. »
→ beat 1 : « Karim donne ses notes en vrac et impose une structure : météo, avancement, trois points d'attention, décision attendue, 150 mots. »
→ beat 2 : « Le résultat est prêt pour Luc. Météo jaune, 38 % contre 40 % prévu, et la décision attendue est claire. »

INSISTER — La météo (vert, jaune, rouge) est un jugement : l'IA la propose, Karim l'assume. Un rapport trop optimiste détruit la confiance.

TRANSITION — « Quatrième usage : communiquer. »`,
  `⏱ 3 min · CAS D'USAGE 4 : COMMUNICATION (2 clics)

OBJECTIF — Montrer l'adaptation d'un même message à plusieurs publics.

DIRE — « Une mauvaise nouvelle : deux semaines de retard sur les comptoirs. Trois publics, trois messages. »
→ beat 1 : « Une seule demande pour trois versions. »
→ beat 2 : « Pour Luc : impact et options. Pour l'équipe : les actions. Pour le fournisseur : poli, mais ferme sur le plan de rattrapage. »

ASTUCE — Pour un message délicat, demandez aussi : « Relis ce courriel comme si tu étais Luc. Qu'est-ce qui pourrait l'irriter ? »

TRANSITION — « À vous de juger : que confier à l'IA ? »`,
  `⏱ 6 min · EXERCICE MATRICE (glisser-déposer)

OBJECTIF — Développer le jugement : gain de temps versus risque en cas d'erreur.

ANIMATION — Pour chaque étiquette, demandez une case dans le clavardage (« priorité », « relecture », « pour soi », « si le temps ») et glissez-la selon la majorité. Double-cliquer une étiquette la remet à sa place. Laissez débattre au micro : il n'y a pas de corrigé unique.

PISTES DE CORRIGÉ —
• À confier en priorité : compte rendu de réunion, ordre du jour, reformuler une note, premier découpage des tâches.
• Avec relecture attentive : annonce d'un retard au client, budget final (l'IA peut mettre en forme, mais les chiffres se vérifient).
• À garder pour soi : décision de reporter l'ouverture, évaluation d'un employé.

DÉBAT ATTENDU — « Évaluation d'un employé » : l'IA peut aider à formuler, mais le jugement et les données personnelles posent problème (module 5).

TRANSITION — « Avec quels outils ? Deux familles. » (Dîner vers ici selon l'heure.)`,
  `⏱ 3 min · DEUX FAMILLES D'OUTILS (1 clic)

OBJECTIF — Distinguer assistants génériques et IA intégrée.

DIRE — « Première famille : les assistants génériques. ChatGPT, Gemini, Copilot, Claude. Une fenêtre de conversation, pour tout. Avantages : polyvalents, et des versions gratuites pour commencer. Limites : ils ne voient que ce que vous leur collez, et on copie-colle entre les outils. »
→ beat 1 : « Deuxième famille : l'IA intégrée, dans Teams, Outlook, Google, Notion, ClickUp, Trello. Elle voit vos courriels, vos réunions, vos tâches, et agit sur place. Limites : souvent une licence payante, et chaque IA reste dans son outil. »

MESSAGE CLÉ — Les deux se complètent. Le générique pour réfléchir et rédiger ; l'intégré pour travailler sur les données du projet.

TRANSITION — « Faisons le tour des génériques. »`,
  `⏱ 3 min · QUATRE ASSISTANTS

OBJECTIF — Présenter les quatre assistants sans faire de palmarès.

DIRE — « ChatGPT, d'OpenAI : le plus répandu. Gemini, de Google : naturel si vous êtes sur Google Workspace. Copilot, de Microsoft : Copilot Chat est accessible avec un compte professionnel ; Microsoft 365 Copilot, payant, s'intègre dans Word, Outlook et Teams. Claude, d'Anthropic : apprécié pour les longs documents et la rédaction. »

MESSAGE CLÉ — « Le meilleur assistant, c'est celui que votre organisation autorise. Les écarts de qualité sont faibles pour nos usages ; les écarts de confidentialité, eux, sont importants. »

À VÉRIFIER — Les offres changent souvent : vérifiez avant chaque session ce qui est gratuit ou inclus.

DÉMO OPTIONNELLE — Posez la même question à deux assistants et comparez en direct.

TRANSITION — « L'IA intégrée maintenant, en commençant par Microsoft. »`,
  `⏱ 4 min · DÉMO OUTLOOK ET TEAMS (2 clics)

OBJECTIF — Montrer concrètement l'IA intégrée de Microsoft 365.

DIRE — « À gauche, Outlook. Un fil de 14 messages sur le retard des comptoirs. »
→ beat 1 : « Copilot le résume : nouvelle date, proposition du fournisseur, question de Luc, et surtout : aucune décision prise. Karim sait quoi faire en 20 secondes. »
« À droite, Teams. La réunion de suivi a été transcrite. »
→ beat 2 : « Le récapitulatif : la décision, la tâche avec son responsable et son échéance, le point ouvert. »

PRÉCAUTION — Lire l'encadré : tout dépend de la licence et des réglages des TI. La transcription doit être activée, et les participants informés (module 5).

DÉMO EN DIRECT — Si vous avez accès à Microsoft 365 Copilot, montrez « Résumer » dans un fil Outlook de démonstration.

TRANSITION — « Même logique chez Google. »`,
  `⏱ 2 min · GOOGLE WORKSPACE

OBJECTIF — Montrer l'équivalent Google pour les participants concernés.

DIRE — « Gemini dans Gmail : résumer un fil, proposer une réponse. Dans Docs : "Aide-moi à écrire", pour un premier jet de charte ou de bilan. Dans Sheets : créer un tableau de suivi, expliquer une formule. Dans Meet : "Prendre des notes pour moi", qui produit un document de notes après la réunion. »

MESSAGE CLÉ — « Même logique que Microsoft : l'IA travaille là où sont vos documents, avec vos droits d'accès. »

QUESTION — « Qui est sur Google, qui est sur Microsoft ? » Adaptez les démonstrations de l'atelier.

TRANSITION — « Et dans les outils de gestion de projet ? »`,
  `⏱ 3 min · OUTILS DE GESTION DE PROJET

OBJECTIF — Panorama des outils de gestion de tâches et de leurs fonctions d'IA.

DIRE — Parcourez les six tuiles :
• Notion AI : rédiger, résumer, questions sur l'espace, notes de réunion.
• ClickUp Brain : générer tâches et sous-tâches, résumer, rédiger des mises à jour de statut.
• Trello : l'IA d'Atlassian pour rédiger, résumer, créer des listes de contrôle.
• Planner : créer un plan à partir d'un objectif, avec Copilot.
• Asana : résumés de projet, statuts, règles intelligentes.
• monday.com : générer des tâches, résumer, remplir des colonnes.

À SOULIGNER — « Notion AI et ClickUp sont nos deux outils de l'atelier 1 cet après-midi. »

À VÉRIFIER — Ces fonctions et leurs forfaits évoluent vite ; vérifiez avant la session.

TRANSITION — « Comment choisir, alors ? Trois questions. »`,
  `⏱ 3 min · CHOISIR L'OUTIL (3 clics)

OBJECTIF — Donner un réflexe de choix fondé sur les données.

DIRE — « Première question, toujours la même : les données sont-elles confidentielles ou personnelles ? »
→ beat 1 : « Si oui : uniquement un outil approuvé par votre organisation, en version entreprise. Si non, on continue. »
→ beat 2 : « L'information est-elle déjà dans Teams, Notion, ClickUp ? Si oui : l'IA intégrée. Elle voit le contexte et respecte les droits d'accès. »
→ beat 3 : « Besoin ponctuel, un texte, une idée ? Un assistant générique fait très bien l'affaire. »

INSISTER — Le choix commence par les données, pas par la puissance de l'outil.

TRANSITION — « Quel que soit l'outil, une compétence fait la différence : bien demander. »`,
  `⏱ 5 min · CINQ INGRÉDIENTS (5 clics)

OBJECTIF — Donner une structure de demande simple et mémorisable.

DIRE — « À droite, la demande de Karim, en gris. À chaque clic, un ingrédient s'allume. »
→ beat 1 : « Le rôle : "Tu es un chargé de projet expérimenté dans le commerce de détail." On oriente le vocabulaire et le niveau. »
→ beat 2 : « Le contexte : date, budget, équipe. C'est l'ingrédient le plus oublié, et le plus important. »
→ beat 3 : « La tâche : proposer les jalons. Un verbe d'action clair. »
→ beat 4 : « Le format : un tableau, avec ses colonnes. »
→ beat 5 : « Les contraintes : huit jalons au maximum, et "signale les dates que tu as dû deviner". Cette dernière phrase est précieuse : elle fait apparaître les inventions. »

MÉMO — Rôle, Contexte, Tâche, Format, Contraintes.

TRANSITION — « Voyons la différence en direct. »`,
  `⏱ 4 min · EXERCICE AVANT / APRÈS (interrupteur)

OBJECTIF — Faire constater l'effet du contexte sur la qualité.

ANIMATION — Commencez sur « Demande vague ». Lisez la demande et la réponse. Puis cliquez l'interrupteur.

DIRE — « Demande vague : "Fais-moi un plan pour recruter du monde." Réponse : sept étapes génériques, justes et inutilisables. Rien sur votre projet. »
Cliquez l'interrupteur : « Même outil, demande en cinq ingrédients. Réponse : des postes, des dates, des formations, et un point d'alerte sur les mécaniciens. Utilisable, à vérifier avec Julie. »

QUESTION — « Qu'est-ce qui a fait la différence ? » Réponse attendue : le contexte et le format.

TRANSITION — « Et si la réponse ne convient pas ? On ne recommence pas : on converse. »`,
  `⏱ 3 min · ITÉRER (4 clics)

OBJECTIF — Montrer que la qualité vient de la conversation.

DIRE — « L'assistant propose huit jalons. Ce n'est qu'un début. »
→ beat 1 : « Approfondir : "Ajoute les dépendances et le chemin critique." »
→ beat 2 : « Corriger : "Le permis prend 6 semaines, pas 2." Vous apportez le fait, l'IA recalcule le reste. »
→ beat 3 : « Inverser les rôles : "Pose-moi 5 questions avant de finaliser." C'est la relance la plus sous-utilisée, et la plus puissante. »
→ beat 4 : « Astuce : une conversation par sujet. Si elle part dans tous les sens, demandez un résumé et ouvrez une nouvelle conversation. »

TRANSITION — « Un dernier QCM sur le choix d'outil. »`,
  `⏱ 3 min · QCM 3

RÉPONSE — B : le récapitulatif de Copilot dans Teams (si la licence le permet).
• A ✗ PIÈGE — Copier une transcription interne dans un outil public peut exposer des données.
• C ✗ PIÈGE — Gemini ne voit pas une réunion Teams.
• D ✗ PIÈGE — Possible, mais c'est justement ce que l'IA fait bien.

NUANCE — Sans licence Copilot, la bonne réponse devient : demander au responsable de la réunion le compte rendu, ou utiliser l'outil approuvé par l'organisation.

TRANSITION — « Faisons le bilan du module 2. »`,
  `⏱ 2 min · SYNTHÈSE MODULE 2

DIRE — Relisez les cinq points :
1. Quatre usages : planifier, suivre, rendre compte, communiquer.
2. Génériques pour tout, intégrés là où sont les données.
3. Données confidentielles : uniquement un outil approuvé.
4. Cinq ingrédients : rôle, contexte, tâche, format, contraintes.
5. On affine en conversation.

À VOTRE POSTE — Lisez la carte bleue.

TRANSITION — « Assez parlé : place à l'atelier 1. Vous allez générer le plan du projet Limoilou. »`,
  `⏱ 1 min · DÉBUT DE L'ATELIER 1 (≈ 13 h 45)

OBJECTIF — Lancer l'atelier avec énergie.

DIRE — « Atelier 1 : un plan de projet avec l'IA. Vous allez faire ce que Karim doit faire cette semaine : bâtir le plan du projet Limoilou. Mais avec l'IA, et en vérifiant tout. »

« D'abord une découverte guidée de deux outils : Notion AI et ClickUp. Puis on construit pas à pas : charte, découpage, échéancier, risques, RACI. On transfère les tâches dans l'outil. Et on termine par la partie la plus importante : vérifier ce que l'IA a raté. »

LOGISTIQUE — Atelier individuel : chacun travaille sur son poste, la classe virtuelle ouverte dans une fenêtre et l'outil dans une autre. Vérifiez que chacun a accès à Notion ou ClickUp (versions d'essai gratuites) ou, à défaut, à un assistant générique. Demandez un « prêt » dans le clavardage avant de commencer.

TRANSITION — « Voici l'atelier en un coup d'œil. »`,
  `⏱ 2 min · CONSIGNES

OBJECTIF — Donner le déroulé, le livrable et les outils.

DIRE — « Cinq étapes : 15 minutes de découverte de l'outil, 10 pour la charte, 25 pour planifier, 10 pour transférer les tâches dans l'outil, 15 pour vérifier et présenter. »

« Le livrable : un plan dans l'outil, pas dans une conversation. Six à huit lots, des tâches datées avec un responsable, trois jalons, cinq risques. »

« Les outils : Notion AI ou ClickUp. Si vous n'y avez pas accès, ChatGPT, Gemini, Copilot ou Claude, puis Excel ou Planner pour les tâches. »

ASTUCE — Notion et ClickUp proposent des versions d'essai gratuites ; créez les comptes avant la formation si possible.

TRANSITION — « Vos données de départ : le dossier de Karim. »`,
  `⏱ 2 min · LE DOSSIER DE KARIM

OBJECTIF — Fournir le contexte à coller dans les demandes.

DIRE — « Voici tout ce que l'IA doit savoir : objectif, date de départ, budget détaillé, équipe, embauches, contraintes, et ce qui est déjà connu. »

INSISTER — « Ce dossier, c'est l'ingrédient "contexte". Plus il est complet, moins l'IA invente. Notez trois pièges cachés dans les contraintes : le permis de 6 semaines, les Fêtes, et les mécaniciens rares. On verra si l'IA en tient compte. »

LOGISTIQUE — Collez ce texte dans le clavardage (ou envoyez-le par courriel) pour que chacun puisse le copier.

TRANSITION — « Découvrons maintenant Notion AI. »`,
  `⏱ 6 min · DÉMO NOTION AI (4 clics)

OBJECTIF — Repérer les quatre points d'entrée de l'IA dans Notion.

DIRE — « Notion, c'est un espace de pages et de bases de données. L'IA y est partout. »
→ beat 1 : « Sur une ligne vide, la touche Espace ouvre l'IA : rédiger, résumer, traduire, continuer. »
→ beat 2 : « On peut partir d'un modèle de plan de projet, ou générer une page entière à partir d'une consigne. »
→ beat 3 : « Dans une base de données, une colonne peut être remplie par l'IA : un résumé ou une catégorie pour chaque tâche. »
→ beat 4 : « Et on peut poser des questions sur tout l'espace : quelles tâches de Julie sont en retard ? »

DÉMO EN DIRECT — Si possible, montrez-le dans un vrai espace Notion de démonstration : créez une page « Projet Limoilou », appuyez sur Espace, demandez un plan.

À VÉRIFIER — L'interface évolue souvent et dépend du forfait. Testez avant la session.

TRANSITION — « Même exercice avec ClickUp. »`,
  `⏱ 6 min · DÉMO CLICKUP BRAIN (4 clics)

OBJECTIF — Repérer les usages de l'IA dans un outil de gestion de tâches.

DIRE — « ClickUp, c'est un outil de tâches. Son IA s'appelle Brain et travaille sur les tâches elles-mêmes. »
→ beat 1 : « Générer des sous-tâches à partir du titre et de la description. Quatre sous-tâches pour choisir la caisse. »
→ beat 2 : « Résumer un fil de commentaires : 23 commentaires en trois lignes, avec la décision attendue. »
→ beat 3 : « Rédiger une mise à jour de statut à partir des tâches de la semaine. »
→ beat 4 : « Poser une question : qu'est-ce qui bloque le lot TI ? »

DÉMO EN DIRECT — Si possible, montrez la génération de sous-tâches dans une vraie tâche.

CHOIX — Chacun choisit son outil et l'écrit dans le clavardage (« Notion » ou « ClickUp »). Laissez 5 minutes d'exploration libre.

TRANSITION — « On construit le plan. Étape 1 : la charte. »`,
  `⏱ 3 min de démonstration + 10 min en autonomie · CHARTE (5 clics)

OBJECTIF — Produire la charte et apprendre le réflexe « signale ce qui manque ».

DIRE — « À gauche, la demande. Remarquez la dernière phrase : "Signale ce qui manque pour la compléter." »
→ beat 1 : « L'objectif : date, budget, équipe formée. Mesurable. »
→ beat 2 : « Le périmètre : inclus et exclu. L'exclu est aussi important que l'inclus : pas de vente en ligne, pas de location. »
→ beat 3 : « Les livrables. »
→ beat 4 : « Les critères de réussite. »
→ beat 5 : « Et voilà le piège : "300 visiteurs aux portes ouvertes". D'où vient ce chiffre ? Nulle part. L'IA l'a proposé. C'est à Luc de le fixer. »

CONSIGNE — Chacun colle le dossier, lance la demande et note les questions que l'IA renvoie.

TRANSITION — « Étape 2 : le découpage. »`,
  `⏱ 3 min · DÉCOUPAGE (3 clics)

OBJECTIF — Montrer un découpage généré et le compléter.

DIRE — « La demande : découpe en lots, puis en tâches de 1 à 2 semaines. »
→ beat 1 : « Six lots apparaissent : cadrage, local et travaux, RH, TI, marketing, ouverture. »
→ beat 2 : « Puis les tâches de chaque lot. »
→ beat 3 : « Qu'est-ce qui manque ? Karim ajoute un septième lot : la gestion de projet elle-même. Le suivi hebdomadaire, les rapports à Luc, le bilan. L'IA oublie très souvent le travail du chargé de projet ! »

QUESTION — « Voyez-vous d'autres oublis ? » Pistes : assurances, enseigne, ouverture du compte marchand, contrat d'entretien.

TRANSITION — « Étape 3 : l'échéancier. »`,
  `⏱ 4 min · ÉCHÉANCIER (3 clics)

OBJECTIF — Lire un diagramme de Gantt et le chemin critique.

DIRE — « 23 semaines, de novembre à avril. En hachuré, les Fêtes : chantiers fermés. »
→ beat 1 : « Les barres apparaissent : cadrage, permis de 6 semaines, travaux après les Fêtes, recrutement qui commence tôt, TI, marketing, essais. »
→ beat 2 : « Trois jalons : permis obtenu, travaux finis le 5 mars, ouverture le 10 avril. »
→ beat 3 : « Le chemin critique, encadré en bleu : cadrage, permis, travaux, systèmes, essais. Un jour de retard ici, c'est un jour de retard à l'ouverture. »

À SOULIGNER — « Ici, l'IA a respecté les Fêtes parce que le dossier les mentionnait. Sans cette ligne dans le contexte, elle les aurait ignorées. On le verra dans les pièges. »

ASTUCE OUTIL — ClickUp, Notion (vue chronologie) et Planner affichent ce type de diagramme dès que les tâches ont des dates.

TRANSITION — « Étape 4 : les risques. »`,
  `⏱ 4 min · RISQUES (6 clics)

OBJECTIF — Construire un registre des risques avec l'IA.

DIRE — « La demande : six risques, probabilité, impact, une mesure chacun. » Un clic par risque :
→ beat 1 : « R1, permis en retard : impact élevé, probabilité moyenne. »
→ beat 2 : « R2, pénurie de mécaniciens : élevé et probable. Zone rouge. »
→ beat 3 : « R3, retard du fournisseur de comptoirs : on le sait déjà. »
→ beat 4 : « R4, dépassement du budget des travaux. »
→ beat 5 : « R5, caisse non prête : peu probable mais grave. »
→ beat 6 : « R6, peu de clients à l'ouverture. »

INSISTER — L'IA est excellente pour proposer des risques auxquels on n'a pas pensé. Mais les notes de probabilité et d'impact sont un jugement : l'équipe les ajuste.

TRANSITION — « Étape 5 : qui fait quoi. »`,
  `⏱ 4 min · RACI (2 clics)

OBJECTIF — Rappeler la RACI et montrer ses erreurs typiques quand l'IA la génère.

DIRE — « R réalise, A approuve, C est consulté, I est informé. Une règle d'or : un seul A par ligne. »
→ beat 1 : « Le premier jet de l'IA. Regardez bien… »
→ beat 2 : « Deux erreurs. Recrutement : deux A, Karim et Luc. Qui tranche ? Inauguration : aucun A. Personne n'approuve. »

« Pourquoi ? L'IA ne connaît pas votre organisation, ni qui a vraiment l'autorité. La RACI se valide avec les personnes concernées. »

TRANSITION — « Dernière étape : les tâches dans l'outil. »`,
  `⏱ 3 min · DANS L'OUTIL (3 clics)

OBJECTIF — Montrer le passage du texte aux tâches suivables.

DIRE — « Un plan qui reste dans une conversation ne se suit pas. À gauche, la réponse de l'IA sous forme de tableau. Trois façons de le transférer : le coller dans Notion, qui crée la base ; l'importer en CSV ou générer les tâches dans ClickUp ; ou créer le plan avec Copilot dans Planner. »
→ beat 1 : « Les tâches apparaissent sur le tableau. »
→ beat 2 : « Chacune avec son responsable et sa date. »
→ beat 3 : « C'est ce qui permettra demain à l'IA de suivre et d'alerter. »

ASTUCE — Demandez à l'IA : « Donne-moi ce plan en tableau Markdown » ou « en CSV avec les colonnes Tâche, Responsable, Début, Fin ».

TRANSITION — « Avant de présenter : la grille de contrôle. »`,
  `⏱ 3 min · GRILLE DE CONTRÔLE (interactive)

OBJECTIF — Donner une grille de vérification réutilisable.

ANIMATION — Lisez chaque critère. Chacun l'applique à son propre plan pendant le travail. Au débriefing, cochez la grille pour un participant qui partage son écran (certains critères comptent double, ×2).

DIRE — « Les trois critères qui comptent double : des durées validées par quelqu'un qui sait, un seul responsable par tâche, et aucun fait inventé. »

INSISTER — « Ce que l'IA ne coche jamais seule : la réalité. Elle ne sait pas que l'électricien est en vacances, ni que la semaine de relâche tombe en mars. »

TRANSITION — « Entraînons-nous à repérer les pièges. »`,
  `⏱ 4 min · EXERCICE : LES QUATRE PIÈGES (4 clics ou clics sur les pastilles)

OBJECTIF — Exercer l'œil critique sur un plan qui « a l'air complet ».

ANIMATION — Laissez 1 minute au groupe pour chercher. Puis révélez un piège par clic (ou cliquez sur les pastilles).
→ beat 1 : Permis en 2 semaines : durée inventée, le dossier dit 6.
→ beat 2 : Travaux des semaines 4 à 13 : traversent les Fêtes.
→ beat 3 : Formation à la caisse (sem. 12) avant son installation (sem. 15) : dépendance inversée.
→ beat 4 : Mécaniciens affichés en semaine 16 : beaucoup trop tard pour des profils rares.

MÉTHODE — « Confrontez chaque ligne au dossier et au calendrier. Et demandez à l'IA : quelles dates as-tu supposées ? Elle vous le dira souvent. »

TRANSITION — « À vous ! »`,
  `⏱ 45 min · TRAVAIL EN ÉQUIPE

OBJECTIF — Produire le plan du projet Limoilou dans un outil.

ANIMATION — Démarrez le minuteur (il continue si vous changez de page). Les participants travaillent seuls, micro coupé. Vous ne voyez pas leurs écrans : faites un point d'étape dans le clavardage toutes les 15 minutes (« Où en êtes-vous : étape 1, 2, 3 ou 4 ? »). La pause de 14 h 30 peut être prise pendant l'atelier, selon le rythme.

QUESTIONS À POSER DANS LE CLAVARDAGE (ou à la personne qui partage son écran) —
• « Montrez-moi votre demande. Où est le contexte ? »
• « Quelles dates l'IA a-t-elle supposées ? »
• « Qui est le A de cette ligne ? »

AIDE — Quelqu'un écrit « bloqué » : invitez-le à partager son écran 2 minutes, ou suggérez « Demandez à l'IA de vous poser les questions qui lui manquent. »

SIGNAL — À 5 minutes de la fin, demandez à chacun de passer son plan à la grille de contrôle.

TRANSITION — « Temps écoulé ! Débriefing. »`,
  `⏱ 15 min · DÉBRIEFING

OBJECTIF — Tirer les leçons de l'atelier.

ANIMATION — Trois ou quatre volontaires partagent leur écran 2 minutes et répondent aux trois questions ; les autres réagissent dans le clavardage ou y déposent une capture de leur plan. Puis sondage : un numéro par personne dans le clavardage, cliquez une ligne par réponse.

POINTS À FAIRE ÉMERGER —
• L'IA donne une structure et des idées très vite.
• Elle se trompe sur les dates, les dépendances, les responsabilités : tout ce qui demande de connaître la réalité.
• Le gain de temps est réel… à condition de vérifier.

LECTURE DU SONDAGE — Souvent « environ la moitié ». Si quelqu'un répond « temps perdu » : demandez pourquoi (demande trop vague ? outil mal maîtrisé ?). C'est précieux.

TRANSITION — « Faisons le bilan de cette journée. »`,
  `⏱ 3 min · BILAN DU JOUR 1

DIRE — « Module 1 : l'IA apprend d'exemples, prédit le mot probable, et peut inventer avec aplomb. Module 2 : quatre usages en gestion de projet et une demande en cinq ingrédients. Atelier 1 : un plan généré en quelques minutes, mais vérifié ligne par ligne. »

« Demain : les comptes rendus et résumés de réunions, le suivi et les alertes, les limites et l'éthique, puis le mini-projet complet de l'atelier 2. »

QUESTION — « Qu'est-ce qui vous a le plus surpris aujourd'hui ? »

TRANSITION — « Avant de partir, un billet de sortie. »`,
  `⏱ 3 min · BILLET DE SORTIE

OBJECTIF — Mesurer les acquis et récolter les questions pour demain.

ANIMATION — Dans le clavardage, chacun écrit trois réponses courtes : une chose apprise, une question, un essai à faire ce soir. Enregistrez le clavardage avant de quitter la réunion.

DIRE — « Je lirai vos questions ce soir et on commencera par y répondre demain matin. Et ce soir, si vous avez cinq minutes : une demande en cinq ingrédients sur votre vrai projet, sans données confidentielles. »

LOGISTIQUE — Rappel : demain 9 h, même lien de classe virtuelle.

CLÔTURE — « Merci pour cette belle journée, et à demain ! »`,
  `⏱ 2 min · ACCUEIL DU JOUR 2 (page affichée à l'arrivée)

OBJECTIF — Relancer l'énergie et annoncer le fil de la journée.

DIRE — « Bonjour et bienvenue au jour 2 ! Hier, on a compris l'IA et on a planifié avec elle. Aujourd'hui, on automatise ce qui se répète dans un projet : les réunions, les comptes rendus, le suivi. On parle des limites et de l'éthique. Et cet après-midi, vous menez un mini-projet complet avec l'IA. »

Montrer l'animation : « Réunion, compte rendu, tâches. C'est la chaîne qu'on va automatiser ce matin. »

LOGISTIQUE — Mêmes horaires qu'hier. Évaluation de la formation en fin de journée.

TRANSITION — « D'abord, réveillons ce qu'on a appris hier. »`,
  `⏱ 10 min · RÉACTIVATION (cartes à retourner)

OBJECTIF — Réactiver les notions clés du jour 1 et répondre aux questions des billets de sortie.

ANIMATION — Lisez chaque question, laissez répondre dans le clavardage (ou au micro), puis cliquez pour retourner la carte.

RÉPONSES —
1. D'exemples : l'IA en tire un modèle.
2. Le mot le plus probable, pas le plus vrai.
3. Rôle, contexte, tâche, format, contraintes.
4. Un seul A par ligne.
5. Automatisation : une règle fixe. L'IA anticiperait le retard.

VOS QUESTIONS D'HIER — Sur la 6ᵉ case, répondez aux questions recueillies dans les billets de sortie (préparez-les la veille). Si quelqu'un a essayé une demande en cinq ingrédients sur son vrai projet, demandez-lui de raconter.

TRANSITION — « Voici le programme de la journée. »`,
  `⏱ 1 min · PROGRAMME DU JOUR 2

DIRE — « Ce matin, module 4 : automatiser et collaborer. Comptes rendus, résumés de réunions, suivi des tâches et alertes, pratiques d'équipe. Après la pause, module 5 : limites, éthique et adoption. Cet après-midi, l'atelier 2 : un mini-projet complet avec l'IA, que vous présenterez au groupe, avec une rétroaction collective. On termine par votre plan d'action. »

TRANSITION — « Commençons par ce qui occupe une grande partie de la semaine de Karim : les réunions. »`,
  `⏱ 1 min · DÉBUT DU MODULE 4 (≈ 9 h 15)

OBJECTIF — Annoncer le plan du module.

DIRE — « Module 4 : automatiser et collaborer. On s'attaque à ce qui se répète chaque semaine dans un projet : les réunions et leurs comptes rendus, le suivi des tâches, les relances, le rapport du vendredi. »

« Quatre temps : comptes rendus et résumés de réunions ; transformer les actions en tâches sans ressaisie ; le suivi automatique et les alertes intelligentes ; et les pratiques d'équipe pour que l'IA profite à tous. »

RYTHME — Environ 1 h 15, de 9 h 15 à 10 h 30. Gardez un bon rythme : le simulateur et l'exercice des erreurs sont les deux moments à ne pas couper.

TRANSITION — « Commençons par la réunion. »`,
  `⏱ 3 min · AVANT, PENDANT, APRÈS (3 clics)

OBJECTIF — Montrer que l'IA aide à chaque moment d'une réunion.

DIRE — « 11 heures de réunions par semaine pour Karim. Trois moments où l'IA aide. »
→ beat 1 : « Avant : proposer l'ordre du jour à partir des tâches en retard, résumer les documents à lire, rédiger l'invitation avec un objectif clair. »
→ beat 2 : « Pendant : transcrire, avec l'accord des participants ; demander "qu'a-t-on décidé jusqu'ici ?" ; rattraper quelqu'un qui arrive en retard. »
→ beat 3 : « Après : le compte rendu, les tâches dans l'outil, le courriel de suivi aux absents. C'est là que le gain est le plus grand. »

QUESTION — « Combien de temps vous prend un compte rendu ? Et combien de temps après la réunion le diffusez-vous ? »

TRANSITION — « Voyons comment l'IA passe d'une transcription à un compte rendu. »`,
  `⏱ 4 min · DÉMO : TRANSCRIPTION → COMPTE RENDU (3 clics)

OBJECTIF — Visualiser l'extraction : décisions, actions, points ouverts.

DIRE — « À gauche, un extrait de la transcription de la réunion du 2 février. Des phrases spontanées, dans le désordre. »
→ beat 1 : « L'IA repère la décision, en vert : la pose des comptoirs le samedi 20. »
→ beat 2 : « Les actions, en bleu : Annie avance le câblage réseau d'ici le 12 ; Julie relance les candidats demain, donc le 3 février. »
→ beat 3 : « Les points ouverts, en jaune : la date des portes ouvertes. Luc tranche jeudi. »

INSISTER — « Remarquez : "on en reparle jeudi" n'est pas une décision. Une bonne extraction distingue ce qui est décidé de ce qui est discuté. »

TRANSITION — « Voici la demande qui produit ce résultat. »`,
  `⏱ 3 min · MODÈLE DE DEMANDE DE COMPTE RENDU

OBJECTIF — Donner un modèle réutilisable et expliquer ses garde-fous.

DIRE — « Les zones jaunes changent à chaque réunion : le projet, la date. Le reste se réutilise tel quel. »

Pointer les quatre conseils :
• « Seulement les décisions clairement prises » : évite les fausses décisions.
• « [à confirmer] » : l'IA montre les trous au lieu de les combler.
• La liste des participants : moins d'erreurs de noms, surtout avec une transcription automatique.
• Relire avant de diffuser : « C'est vous qui signez. »

ASTUCE — Pour une réunion en anglais ou bilingue : ajoutez « Rédige le compte rendu en français ».

TRANSITION — « Et si la demande est trop vague ? Exercice. »`,
  `⏱ 5 min · EXERCICE : QUATRE ERREURS (4 clics)

OBJECTIF — Entraîner l'œil à repérer les erreurs typiques d'un compte rendu généré.

ANIMATION — Laissez 2 minutes : chacun compare avec la transcription de la page précédente (revenez-y si besoin) et écrit dans le clavardage les erreurs trouvées. Puis un clic par erreur.
→ beat 1 : Fausse décision : les portes ouvertes n'ont pas été reportées, on a seulement discuté.
→ beat 2 : Mauvaise personne : c'est Annie qui avance le câblage.
→ beat 3 : Date inventée : Julie a dit « demain », donc le 3 février, pas le 15.
→ beat 4 : Point ouvert effacé : la date des portes ouvertes reste à trancher.

MESSAGE CLÉ — « Ce sont exactement les quatre erreurs à vérifier : décisions, responsables, dates, points ouverts. Deux minutes de relecture. »

TRANSITION — « Quels outils font ces résumés ? »`,
  `⏱ 4 min · OUTILS DE RÉSUMÉ DE RÉUNION

OBJECTIF — Panorama des outils, avec le critère qui compte : où vont les données.

DIRE — Parcourez les cinq lignes :
• Copilot dans Teams : récapitulatif, tâches de suivi, questions sur la réunion. Licence Copilot et transcription nécessaires.
• Google Meet : « Prendre des notes pour moi », dans un Google Doc, selon l'édition Workspace.
• Zoom : AI Companion, résumé et prochaines étapes, avec les comptes payants.
• Otter.ai : un assistant qui rejoint l'appel, transcrit et résume. « Attention : c'est un service externe. Vos réunions partent chez un tiers. À faire approuver. »
• Notion : notes de réunion transcrites directement dans la page.

INSISTER — « La qualité est comparable. La vraie question : est-ce que mon organisation autorise cet outil pour ce type de réunion ? »

À VÉRIFIER — Ces offres évoluent vite ; vérifiez avant chaque session (français, licence, hébergement des données).

TRANSITION — « Justement : les règles pour transcrire une réunion. »`,
  `⏱ 3 min · CINQ RÈGLES POUR TRANSCRIRE

OBJECTIF — Installer de bons réflexes éthiques et légaux.

DIRE — « Une transcription contient des renseignements personnels et des propos spontanés. Cinq règles. »
1. Annoncer et obtenir l'accord, à l'oral et dans l'invitation.
2. Pas pour les sujets sensibles : RH, santé, conflits, négociations.
3. Un outil approuvé par l'organisation.
4. Une durée de conservation : on garde le compte rendu, pas forcément l'enregistrement.
5. Relire avant de diffuser : celui qui envoie en est responsable.

Lire la citation : « Je propose d'activer la transcription pour le compte rendu. Quelqu'un s'y oppose ? » « Ça prend cinq secondes et ça règle la question du consentement. »

LIEN — Au Québec, la Loi 25 encadre les renseignements personnels ; on en reparle au module 5.

TRANSITION — « Le compte rendu est prêt. Que deviennent les actions ? »`,
  `⏱ 3 min · DES ACTIONS AUX TÂCHES (3 clics)

OBJECTIF — Montrer la continuité compte rendu → outil de tâches.

DIRE — « Une action qui reste dans un compte rendu est souvent une action oubliée. »
→ beat 1 : « L'action d'Annie devient une tâche dans Planner, avec responsable, date, et un lien vers le compte rendu. »
→ beat 2 : « Celle de Julie. »
→ beat 3 : « Celle de Karim. »

COMMENT — « Selon l'outil : le récapitulatif propose directement les tâches, on demande à l'IA "crée ces tâches", ou on passe par une automatisation. »

INSISTER — Le lien vers le compte rendu donne le contexte à celui qui ouvre la tâche dans deux semaines.

TRANSITION — « Les tâches sont dans l'outil. Le suivi peut maintenant s'automatiser. »`,
  `⏱ 4 min · RÈGLES « SI… ALORS » (3 clics)

OBJECTIF — Montrer l'automatisation simple du suivi, avant même l'IA.

DIRE — « Une règle a trois parties : quand, si, alors. »
→ beat 1 : « Quand une tâche change de statut, si elle passe à "Bloquée", alors message à Karim dans Teams. Karim n'a plus besoin de demander "où en es-tu ?". »
→ beat 2 : « Chaque matin à 8 h, si une échéance arrive dans 2 jours et que la tâche n'est pas commencée, rappel au responsable. Les relances se font toutes seules. »
→ beat 3 : « Chaque vendredi à 14 h, l'outil rassemble les tâches terminées, et cette fois l'IA rédige le brouillon du rapport. On combine automatisation et IA. »

OÙ — ClickUp, Planner (avec Power Automate), Notion, Trello, monday.

DÉMO OPTIONNELLE — Créez une règle en direct dans ClickUp ou Trello.

TRANSITION — « Les règles constatent. L'IA, elle, peut anticiper. »`,
  `⏱ 4 min · ALERTE INTELLIGENTE (5 clics)

OBJECTIF — Distinguer constat (règle) et anticipation (IA).

DIRE — « À gauche, l'alerte par règle : la soumission est en retard de 4 jours. Utile, mais le retard est déjà là. »
« À droite, l'alerte intelligente : l'IA croise des signaux faibles. »
→ beat 1 : « Pas de mise à jour depuis 9 jours. »
→ beat 2 : « Son responsable est surchargé. »
→ beat 3 : « La tâche est sur le chemin critique. »
→ beat 4 : « Et le dernier commentaire : "petit souci avec le maître électricien". Une règle ne lit pas le ton ; l'IA, si. »
→ beat 5 : « Conclusion : risque de glissement, avec une suggestion d'action. Avant que le retard n'arrive. »

NUANCE — Ces alertes existent à des degrés divers selon les outils ; elles supposent des tâches tenues à jour.

TRANSITION — « Voyons-le évoluer semaine après semaine. »`,
  `⏱ 5 min · SIMULATEUR (curseur)

OBJECTIF — Faire vivre le suivi d'un projet qui dérive, et le rôle de l'humain.

ANIMATION — Commencez en semaine 10 (vous pouvez reculer à 8). Faites glisser le curseur semaine par semaine jusqu'à 16 (ou cliquez le curseur puis utilisez les flèches du clavier). Commentez chaque nouvelle alerte.

DIRE —
• Semaines 9 et 10 : « Tout va bien… puis un premier silence. »
• Semaine 11 : « Annie est surchargée. »
• Semaine 12 : « Le logiciel de caisse bloque la formation : rouge. »
• Semaine 13 : « Le ton du fournisseur change. »
• Semaine 14 : « Le jalon du 5 mars va glisser. Météo rouge. »
• Semaine 15 : « Une suggestion d'action. »

QUESTION — « À quelle semaine Karim aurait-il dû réagir ? » Réponse attendue : dès la 10 ou la 11, pas à la 14.

INSISTER — Encadré : la météo envoyée à Luc reste le jugement de Karim.

TRANSITION — « Justement, le rapport à Luc. »`,
  `⏱ 3 min · LE RAPPORT DU VENDREDI (4 clics)

OBJECTIF — Montrer la chaîne complète et la répartition des rôles.

DIRE —
→ beat 1 : « L'outil rassemble : tâches terminées, en retard, à venir. »
→ beat 2 : « L'IA rédige : avancement, points d'attention, décision attendue. »
→ beat 3 : « Karim relit et juge. Ici, il a fait passer la météo de vert à jaune, et ajouté le contexte sur l'électricité. Voyez l'encadré bleu. »
→ beat 4 : « Luc reçoit le même format chaque semaine : il sait où regarder. »

INSISTER — « Un rapport trop optimiste, c'est la confiance de Luc qui s'en va. L'IA a tendance à arrondir les angles : c'est à vous de nommer les problèmes. »

TRANSITION — « Passons de l'individu à l'équipe. »`,
  `⏱ 4 min · PRATIQUES D'ÉQUIPE

OBJECTIF — Donner six pratiques concrètes pour intégrer l'IA au travail collaboratif.

DIRE — « L'IA individuelle fait gagner des minutes. L'IA d'équipe fait gagner des heures. »
1. Une seule source : tâches, comptes rendus, décisions au même endroit. L'IA y trouve le contexte.
2. Une bibliothèque de demandes, partagée et améliorée.
3. Une mention claire : « Brouillon IA, relu par… ».
4. Un relecteur désigné pour chaque livrable généré.
5. Partager les bons coups : cinq minutes en réunion d'équipe.
6. Des règles communes : outils permis, données interdites, écrites quelque part.

QUESTION — « Laquelle de ces pratiques pourriez-vous lancer dès la semaine prochaine ? »

TRANSITION — « Voici la bibliothèque de l'équipe Limoilou. »`,
  `⏱ 3 min · BIBLIOTHÈQUE DE DEMANDES

OBJECTIF — Remettre six modèles prêts à l'emploi (ils serviront dans l'atelier 2).

DIRE — « Six modèles : plan de projet, compte rendu, rapport hebdomadaire, message délicat, risques, préparer une réunion. Les crochets se remplacent à chaque usage. »

« Remarquez que chacun contient les cinq ingrédients d'hier, et un garde-fou : "signale les durées supposées", "n'invente rien", "150 mots". »

ASTUCE — Stockez-les dans une page Notion, un OneNote d'équipe ou une note épinglée dans Teams. Certains assistants permettent aussi d'enregistrer des instructions ou des « projets » réutilisables.

LOGISTIQUE — Partagez ces modèles aux participants (document ou clavardage) pour l'atelier 2.

TRANSITION — « Deux QCM pour vérifier. »`,
  `⏱ 3 min · QCM 4

RÉPONSE — B : il vérifie décisions, responsables, dates et points ouverts.
• A ✗ PIÈGE — « Ce n'est pas une transcription, c'est une interprétation de la transcription. »
• C ✗ PIÈGE — On perdrait tout le temps gagné.
• D ✗ PIÈGE — Une autre IA ne sait pas ce qui a été dit ; seule une personne présente le sait.

TRANSITION — « Deuxième question : règle ou intelligence ? »`,
  `⏱ 3 min · QCM 5

RÉPONSE — C : la tâche Z risque de glisser.
• A, B, D ✗ — Ce sont des règles fixes : date dépassée, statut, horaire. Très utiles, mais pas de l'IA.
• C ✓ — Aucune règle simple ne peut combiner le silence, la surcharge et le ton des échanges.

LIEN — « C'est la distinction du module 1 : automatisation = règles, IA = jugement appris. »

TRANSITION — « Faisons le bilan du module 4. »`,
  `⏱ 2 min · SYNTHÈSE MODULE 4

DIRE — Relisez les cinq points :
1. Compte rendu : décisions, actions, points ouverts, et rien d'inventé.
2. Transcrire : annoncer, outil approuvé, pas de sujets sensibles.
3. Les actions deviennent des tâches avec responsable et date.
4. Règles pour constater, IA pour anticiper.
5. En équipe : une source, une bibliothèque, un relecteur.

À VOTRE POSTE — Lisez la carte bleue.

TRANSITION — « On a vu tout ce que l'IA peut faire. Parlons maintenant de ses limites, de l'éthique et de la façon d'embarquer une équipe. »`,
  `⏱ 1 min · DÉBUT DU MODULE 5 (≈ 10 h 45)

OBJECTIF — Annoncer un module lucide, sans tomber dans la peur.

DIRE — « Module 5 : limites, éthique et adoption. Depuis hier, on a vu tout ce que l'IA sait faire. Maintenant, ce qui peut mal tourner, et comment l'éviter. Puis une question que tout chargé de projet se pose : comment embarquer une équipe qui n'est pas convaincue ? »

« Quatre temps : les biais ; les erreurs et combien vérifier ; la confidentialité et le cadre légal ; l'accompagnement du changement. »

TRANSITION — « Trois familles de risques. »`,
  `⏱ 2 min · TROIS FAMILLES (3 clics)

DIRE — « Aucune n'est une raison de renoncer. Toutes sont une raison d'encadrer. »
→ beat 1 : « Les biais : l'IA reproduit les déséquilibres de ses exemples. Dans un projet : trier des CV, estimer des durées. »
→ beat 2 : « Les erreurs : elle se trompe avec aplomb. Un chiffre faux dans le rapport à la direction. »
→ beat 3 : « La confidentialité : ce que vous collez sort de votre organisation. Un contrat fournisseur dans un outil gratuit. »

TRANSITION — « Commençons par les biais, avec un exemple très concret. »`,
  `⏱ 5 min · LE BIAIS (4 clics)

OBJECTIF — Faire comprendre mécaniquement d'où vient un biais.

DIRE — « Imaginons un outil de tri de CV, entraîné sur dix ans d'embauches passées. Dans ce poste, 80 % des personnes embauchées étaient des hommes. »
→ beat 1 : « Le modèle n'a aucune intention. Il en déduit simplement qu'un bon profil ressemble aux profils déjà embauchés. »
→ beat 2 : « Deux CV identiques, sauf une ligne : "capitaine de l'équipe féminine de hockey". 82 contre 61. Le mot "féminine" est devenu un signal négatif. »
→ beat 3 : « Ce n'est pas de la fiction : en 2018, Reuters a révélé qu'Amazon avait abandonné un outil expérimental de tri de CV qui pénalisait les candidatures contenant le mot "women's". »
→ beat 4 : « Pour le recrutement de Julie : l'IA aide à rédiger l'offre et à préparer les entrevues. Le tri et le choix restent humains, sur des critères écrits à l'avance. »

PRÉCISION — Les scores 82 / 61 sont illustratifs.

TRANSITION — « Dans vos projets, les biais sont souvent plus discrets. »`,
  `⏱ 4 min · QUATRE BIAIS EN PROJET (4 clics)

DIRE —
→ beat 1 : « La complaisance : "Mon échéancier est réaliste, non ?" "Oui, tout à fait !" Les assistants ont tendance à vous donner raison. Parade : demandez les cinq faiblesses. »
→ beat 2 : « La formulation : une question orientée appelle une réponse orientée. Posez des questions ouvertes. »
→ beat 3 : « Le biais culturel : les exemples sont surtout américains. L'IA oublie les Fêtes, la Saint-Jean, les vacances de la construction. Précisez "au Québec", "en dollars canadiens". »
→ beat 4 : « L'optimisme moyen : ses durées reflètent un projet typique, pas votre fournisseur qui a toujours du retard. Comparez avec vos projets passés. »

INTERACTION — « Avez-vous déjà vu l'IA vous donner raison trop vite ? »

TRANSITION — « Deuxième famille : les erreurs, avec des cas réels. »`,
  `⏱ 5 min · ÉTUDES DE CAS : ERREURS (3 clics)

DIRE —
→ beat 1 : « Février 2024 : le clavardeur d'Air Canada invente une politique de remboursement pour les voyages liés à un deuil. Le Tribunal de résolution civile de la Colombie-Britannique (affaire Moffatt) donne raison au client : Air Canada est responsable de ce que dit son agent conversationnel. Leçon : l'organisation répond de son IA. »
→ beat 2 : « 2023, New York (affaire Mata c. Avianca) : des avocats déposent un mémoire avec six décisions de justice inventées par ChatGPT. Le juge les sanctionne d'une amende de 5 000 $ US. Leçon : toute source se vérifie à la source. »
→ beat 3 : « Et le vôtre : dans le rapport de la semaine 14, l'IA additionne mal deux lots du budget. 6 000 $ "disponibles" qui n'existent pas. Luc approuve une dépense. Personne n'a menti ; personne n'a vérifié. »

TRANSITION — « Alors, faut-il tout vérifier ? Non : selon l'enjeu. »`,
  `⏱ 3 min · COMBIEN VÉRIFIER (4 clics)

DIRE — « Tout vérifier tue le gain de temps. Ne rien vérifier tue la confiance. La règle : vérifier selon l'enjeu. »
→ beat 1 : « Un brouillon pour soi : lecture rapide. »
→ beat 2 : « Partagé avec l'équipe : noms, dates, responsables, faits clés. »
→ beat 3 : « Envoyé à la direction ou à un client : chaque chiffre, chaque source, et un collègue relit. »
→ beat 4 : « Ce qui engage une décision, une personne, un contrat : l'humain décide. L'IA aide à préparer. »

ASTUCE — Pour les calculs, demandez à l'IA de montrer le détail du calcul, ou faites-les dans Excel.

TRANSITION — « Troisième famille : vos données. »`,
  `⏱ 4 min · OÙ VONT VOS DONNÉES

DIRE — « Même outil, deux versions. À gauche la version grand public : selon les réglages, vos échanges peuvent servir à améliorer les modèles ; vous seul contrôlez le compte ; conservation et hébergement selon le service, pas toujours au Canada. À droite la version entreprise approuvée : en général pas d'entraînement sur vos données selon le contrat, comptes gérés par les TI, politique de conservation de l'organisation. »

CAS RÉEL — « Samsung, 2023 : des ingénieurs collent du code confidentiel dans ChatGPT pour le corriger. L'entreprise interdit ensuite temporairement les outils d'IA générative. »

RÈGLE SIMPLE — « Ce que vous ne mettriez pas sur un forum public ne va pas dans un outil non approuvé. »

À VÉRIFIER — Les politiques des fournisseurs changent : présentez-les comme des tendances, et renvoyez aux conditions réelles de l'outil utilisé.

TRANSITION — « Exercice : quelles données, dans quel outil ? »`,
  `⏱ 5 min · EXERCICE FEU TRICOLORE (1 clic pour le corrigé)

ANIMATION — Pour chaque étiquette, demandez la couleur dans le clavardage (« vert », « jaune » ou « rouge ») et glissez-la selon la majorité. Double-clic pour remettre une étiquette à sa place. → révèle le corrigé.

CORRIGÉ —
• Vert (tout outil) : texte de l'affiche (public), procédure générique.
• Jaune (outil approuvé seulement) : budget détaillé, contrat fournisseur (aussi soumis à la confidentialité contractuelle), compte rendu de réunion.
• Rouge (jamais tel quel) : CV, salaire, arrêt maladie. Renseignements personnels, voire sensibles.

DÉBAT ATTENDU — « Le compte rendu » : vert pour certains. Il contient souvent des noms, des retards, des tensions : jaune par prudence.

TRANSITION — « Et si on a besoin d'aide sur un document rouge ou jaune ? On anonymise. »`,
  `⏱ 3 min · ANONYMISER (interrupteur)

ANIMATION — Commencez sur « Version d'origine » : cinq éléments en rouge. Cliquez l'interrupteur : ils sont remplacés par des étiquettes.

DIRE — « La réponse de l'IA sera tout aussi bonne : elle n'a besoin ni du nom de Sylvie, ni du numéro de contrat pour rédiger un courriel ferme et poli. On remet les vrais éléments à la fin, dans Outlook, hors de l'IA. »

Les quatre gestes : noms → rôles ; retirer coordonnées et numéros ; masquer les montants ; remettre les vrais éléments à la fin.

LIMITE — « Anonymiser réduit le risque, sans le supprimer : "la gérante de la boutique de Limoilou" suffit à reconnaître une personne. »

TRANSITION — « Le cadre légal en quatre repères. »`,
  `⏱ 4 min · CADRE LÉGAL

DIRE —
• « Loi 25, au Québec : protection des renseignements personnels. Pour un nouveau système qui traite des renseignements personnels, une évaluation des facteurs relatifs à la vie privée, l'EFVP. Et si une décision concernant une personne repose uniquement sur un traitement automatisé, il faut l'en informer. »
• « La politique de votre organisation : votre premier document à lire en rentrant. »
• « Vos contrats : une entente de confidentialité avec un client s'applique aussi à ce que vous collez dans une IA. »
• « Si vous travaillez avec l'Europe : le règlement européen sur l'IA, l'AI Act, en vigueur depuis 2024, avec des obligations progressives, plus fortes pour les usages à haut risque, dont le recrutement. »

PRÉCISION — Au fédéral, le projet de loi C-27, qui incluait la Loi sur l'intelligence artificielle et les données, est mort au feuilleton lors de la prorogation de janvier 2025. VÉRIFIEZ l'état de la législation avant chaque session.

PRUDENCE — Vous n'êtes pas juriste : pour un cas précis, renvoyez au responsable de la protection des renseignements personnels de l'organisation.

TRANSITION — « Faisons le point sur vos propres réflexes. »`,
  `⏱ 3 min · AUTODIAGNOSTIC (cases à cocher)

ANIMATION — Chacun compte pour soi, sur papier ou dans un document, les réflexes qu'il pratique déjà ; ne demandez pas les scores. Cochez la grille à l'écran pour illustrer, puis demandez dans le clavardage le réflexe qui manque le plus.

DIRE — « Huit réflexes. Personne ne voit votre écran : soyez honnêtes. »

LECTURE —
• 0 à 3 : commencez par les deux premiers, outils approuvés et données.
• 4 à 6 : bonne base ; la vérification systématique est le prochain pas.
• 7 ou 8 : devenez la personne-ressource de votre équipe.

QUESTION — « Quel réflexe vous manque le plus souvent ? » Généralement : « Je signale quand un document a été préparé avec l'IA. » Discutez-en : transparence n'est pas aveu de faiblesse.

TRANSITION — « Passons à l'équipe : comment accompagner le changement ? »`,
  `⏱ 6 min · QUATRE RÉACTIONS (cartes à retourner)

OBJECTIF — Travailler des réponses concrètes aux réactions typiques.

ANIMATION — Pour chaque carte : lisez la phrase, demandez « Que répondriez-vous ? » dans le clavardage, lisez deux réponses, puis retournez la carte.

DIRE —
• Julie, l'inquiète : la peur d'être remplacée ou de perdre le contrôle. Réponse : clarifier ce que l'IA fait et ne fait pas.
• Annie, l'enthousiaste : un atout, à canaliser. En faire la personne-ressource, dans le cadre.
• Maxime, le sceptique : le convaincre par un cas où il gagne du temps, et respecter son expertise.
• Luc, le commanditaire : il veut des résultats. Mesurer et montrer.

MESSAGE CLÉ — « On n'accompagne pas une équipe avec un outil : on l'accompagne avec des réponses à ses craintes. »

TRANSITION — « Ces quatre profils ont un nom : la courbe d'adoption. »`,
  `⏱ 3 min · COURBE D'ADOPTION (5 clics)

DIRE — « Everett Rogers a décrit comment une innovation se diffuse. »
→ beat 1 : « Les innovateurs, 2,5 % : Annie. Ils essaient tout. »
→ beat 2 : « Les adopteurs précoces, 13,5 % : Karim. Ils essaient quand ils voient l'utilité, et les autres les écoutent. »
→ beat 3 : « La majorité précoce, 34 % : Julie. Ils suivent quand ça a fait ses preuves. »
→ beat 4 : « La majorité tardive, 34 % : Maxime. Ils suivent quand c'est devenu la norme. »
→ beat 5 : « Les retardataires, 16 %. Ne forcez pas : rassurez, et laissez les résultats parler. »

MESSAGE CLÉ — « Commencez par les volontaires. Leurs résultats convaincront la majorité. Imposer l'IA à tout le monde le même jour, c'est se mettre la majorité à dos. »

TRANSITION — « Concrètement, un plan sur 90 jours. »`,
  `⏱ 3 min · PLAN SUR 90 JOURS (3 clics)

DIRE —
→ beat 1 : « Jours 1 à 30 : essayer. Deux cas pilotes seulement, les comptes rendus et le rapport hebdo. Une charte d'une page. Annie comme personne-ressource. »
→ beat 2 : « Jours 31 à 60 : mesurer. Temps gagné, erreurs repérées à la relecture, satisfaction de l'équipe. C'est ce que Luc attend. »
→ beat 3 : « Jours 61 à 90 : étendre. Bibliothèque partagée, trois nouveaux cas, charte révisée avec l'équipe. »

INSISTER — Petit, mesuré, partagé. Mieux vaut deux usages bien installés que dix essais abandonnés.

TRANSITION — « Voici la charte de l'équipe Limoilou. »`,
  `⏱ 3 min · CHARTE D'USAGE

DIRE — « Une page, huit règles, décidées ensemble. » Lisez les huit règles en soulignant :
• la règle 1 : des outils nommés, et une personne qui autorise ;
• la règle 2 : le feu rouge de tout à l'heure ;
• la règle 5 : les décisions restent humaines ;
• la règle 8 : « Un doute ? On demande avant de coller. » La plus simple, la plus utile.

ATELIER 2 — « Cet après-midi, votre mini-projet inclura une charte de ce type. Gardez ce modèle. »

TRANSITION — « Deux QCM pour terminer. »`,
  `⏱ 3 min · QCM 6

RÉPONSE — B.
• A ✗ PIÈGE — La longueur n'est pas le problème.
• C ✗ PIÈGE — Les assistants lisent les PDF.
• D ✗ PIÈGE — Vérifier le classement ne règle ni la fuite de données ni le biais.

POUR ALLER PLUS LOIN — « Que peut faire Annie à la place ? » Aider Julie à écrire une grille de critères, préparer des questions d'entrevue, rédiger les réponses aux candidats.

TRANSITION — « Dernière question, sur la complaisance. »`,
  `⏱ 2 min · QCM 7

RÉPONSE — B : la question était orientée.

DÉMO OPTIONNELLE — Posez en direct les deux questions à un assistant : « Mon échéancier est réaliste, n'est-ce pas ? » puis « Joue l'avocat du diable : quelles sont les 5 faiblesses de cet échéancier ? ». Comparez.

TRANSITION — « Faisons le bilan du module 5. »`,
  `⏱ 2 min · SYNTHÈSE MODULE 5

DIRE — Relisez les cinq points :
1. Biais : l'IA reproduit ses exemples et vous donne raison trop vite.
2. Erreurs : on vérifie selon l'enjeu, les décisions restent humaines.
3. Données : outil approuvé, et on anonymise au moindre doute.
4. Changement : partir des volontaires, mesurer, partager.
5. Une charte d'équipe d'une page.

À VOTRE POSTE — Lisez la carte bleue.

TRANSITION — « Bon dîner ! Cet après-midi : votre mini-projet avec l'IA, de la planification à la présentation. »`,
  `⏱ 1 min · DÉBUT DE L'ATELIER 2 (≈ 13 h 00)

OBJECTIF — Lancer l'atelier final avec énergie.

DIRE — « Atelier 2 : un mini-projet avec l'IA, de bout en bout, chacun sur son poste. Vous allez tout mobiliser : planifier comme hier, suivre et rédiger des comptes rendus comme ce matin, communiquer, et appliquer les règles du module 5. Avec une surprise en cours de route. »

LOGISTIQUE — Classe virtuelle : chacun garde la réunion ouverte, micro coupé, et travaille dans son outil (Notion, ClickUp ou un assistant générique). Demandez un « prêt » dans le clavardage.

TRANSITION — « Voici la mission. »`,
  `⏱ 3 min · LA MISSION

DIRE — « Quatre étapes, en autonomie. Planifier en 30 minutes : vous connaissez la méthode. Suivre en 25 minutes : un imprévu va tomber, il faudra réagir. Communiquer en 20 minutes : trois messages et une mini-charte. Puis présenter, 3 minutes chacun en partage d'écran. »

LA RÈGLE DU JEU — « On ne récompense pas le plus beau plan. On regarde le plus réaliste, et la façon dont vous avez vérifié l'IA. Dire "l'IA s'est trompée ici et je l'ai corrigée", c'est un point fort. »

TRANSITION — « Premier choix : votre projet. »`,
  `⏱ 4 min · CHOIX DU PROJET

DIRE — « Quatre projets issus de Vélo Fleuve, un par profil : RH, marketing, TI, opérations. Choisissez celui qui ressemble le plus à votre métier, ou l'un de vos vrais projets, anonymisé. »

ANIMATION — Chacun écrit son choix dans le clavardage (« recrues », « portes ouvertes », « rendez-vous », « inventaire » ou « mon projet »). Notez les choix : ils vous serviront pour l'imprévu et l'ordre de passage.

PROJET RÉEL — Rappelez le feu tricolore du module 5 : aucun nom, aucun chiffre réel, aucune donnée confidentielle.

TRANSITION — « Étape 1 : planifier. »`,
  `⏱ 30 min · ÉTAPE 1 · PLANIFIER

ANIMATION — Lancez le minuteur. Les livrables restent affichés : laissez cette page en partage pendant le travail. À mi-parcours, point d'étape dans le clavardage : « Où en êtes-vous (1 à 5) ? »

DIRE — « Comme hier, mais plus vite. Partez des modèles de la bibliothèque : plan de projet et risques. Et n'oubliez pas : "Signale ce que tu as supposé." »

QUESTIONS À POSER DANS LE CLAVARDAGE —
• « Collez votre chemin critique en une ligne. »
• « Quelles durées l'IA a-t-elle inventées ? »

AIDE — Quelqu'un écrit « bloqué » : invitez-le à partager son écran 2 minutes pendant que les autres continuent.

TRANSITION — À la fin de l'étape 1 : « Vos plans sont prêts ? Parfait. Parce que la réalité arrive. »`,
  `⏱ 5 min · L'IMPRÉVU (bouton interactif)

ANIMATION — Appelez chaque participant par son prénom et cliquez « Tirer un imprévu » pour lui. Annoncez-le avec un peu de théâtre et écrivez-le dans le clavardage (« Julie : budget réduit »). Si l'imprévu n'a pas d'effet sur son projet (ex. bilingue pour l'inventaire), tirez-en un autre. Grand groupe : tirez un imprévu par projet choisi.

LES SIX IMPRÉVUS — retard fournisseur (3 semaines) ; budget réduit de 10 % ; personne clé absente 2 semaines ; échéance avancée d'une semaine ; tout en bilingue ; outil en panne 3 jours.

DIRE — « Comme dans la vraie vie, il arrive au pire moment. Votre plan était beau ; voyons s'il est solide. »

TRANSITION — « Étape 2 : suivre. »`,
  `⏱ 25 min · ÉTAPE 2 · SUIVRE

ANIMATION — Lancez le minuteur. Laissez cette page en partage.

DIRE — « Imaginez que vous sortez de la réunion de suivi où l'imprévu a été discuté. Écrivez en 5 minutes 8 à 10 lignes de notes brutes, en vrac : qui a dit quoi, ce qui a été décidé, ce qui reste ouvert. Puis l'IA en fait le compte rendu, avec le modèle de ce matin. Relisez-le avec les quatre erreurs typiques : fausse décision, mauvaise personne, date inventée, point ouvert disparu. Mettez le plan à jour dans l'outil. Et rédigez le rapport au commanditaire, avec une météo que vous assumez. »

POINT D'ÉTAPE — À mi-parcours : « Dans le clavardage, une erreur que l'IA a faite dans votre compte rendu. » Lisez-en deux ou trois à voix haute : c'est très parlant.

TRANSITION — « Étape 3 : communiquer. »`,
  `⏱ 20 min · ÉTAPE 3 · COMMUNIQUER

ANIMATION — Lancez le minuteur.

DIRE — « Le même imprévu, trois publics. Au commanditaire : impact et deux options. À l'équipe projet : ce qui change et qui fait quoi. À l'externe : le fournisseur, le partenaire ou les employés, selon votre projet. Anonymisez avant de coller. Et terminez par une mini-charte d'usage de l'IA, cinq règles pour votre équipe projet. »

ASTUCE — « Relis ce courriel comme si tu étais le destinataire : qu'est-ce qui pourrait l'irriter ? »

TRANSITION — « Préparez votre présentation : voici le format. »`,
  `⏱ 2 min · FORMAT DE PRÉSENTATION

DIRE — « Trois minutes, cinq temps, en partage d'écran. Le projet en une phrase. Le plan, montré dans l'outil, pas dans des diapositives. L'imprévu et votre réaction. Un message lu à voix haute. Et surtout : ce que l'IA a raté, et ce que vous avez corrigé. »

ORDRE DE PASSAGE — Annoncez-le dans le clavardage (ordre alphabétique ou volontaires d'abord). Rappelez de fermer les onglets personnels avant de partager l'écran.

GRAND GROUPE — Au-delà de 10 participants : 5 ou 6 présentent, les autres déposent une capture de leur plan et leur « ce que l'IA a raté » dans le clavardage.

POUR LE PUBLIC — « Pendant chaque présentation, préparez dans le clavardage un point fort et une piste. »

TRANSITION — « Il vous reste du temps de travail : à vous ! » (Ou passez directement aux présentations après la pause.)`,
  `⏱ 75 min · TRAVAIL INDIVIDUEL (vue d'ensemble)

ANIMATION — Cette page sert de tableau de bord pendant tout l'atelier : le minuteur de 75 minutes continue même si vous changez de page. Laissez-la en partage pendant le travail ; passez aux pages d'étape pour relancer les consignes.

RYTHME — Pause de 14 h 30 entre la fin du travail et les présentations. En virtuel, la fatigue d'écran arrive vite : ne sautez pas la pause.

POINTS D'ÉTAPE — À 0:30, tirez les imprévus (page « Coup de théâtre »). À 0:55, annoncez l'étape 3. À 5 minutes de la fin, demandez à chacun de préparer ses 5 temps. À chaque fois, un mot dans le clavardage pour savoir où chacun en est.

AIDE — Quelqu'un écrit « bloqué » : partage d'écran 2 minutes, ou « Demandez à l'IA de vous poser ses questions. »

TRANSITION — « Temps écoulé ! Pause, puis présentations. »`,
  `⏱ 3 min par participant + 1 min de rétroaction · RÉTROACTION COLLECTIVE (étoiles interactives)

ANIMATION — Après chaque présentation, reprenez votre partage d'écran sur cette page. Lisez le clavardage : points forts et pistes. Cochez les étoiles en synthétisant ce que vous avez vu et lu (vous pouvez aussi demander une note de 1 à 5 par critère dans le clavardage). « Participant suivant » remet la grille à zéro.

LES QUATRE CRITÈRES — plan réaliste ; réaction à l'imprévu ; messages adaptés ; usage lucide de l'IA.

DIRE — « Un point fort d'abord, toujours. Puis une piste, formulée comme une proposition : "Et si vous essayiez…" » Lisez à voix haute un point fort et une piste du clavardage.

TON — Bienveillant et concret. Valorisez explicitement ceux qui montrent ce que l'IA a raté : c'est l'objectif de la formation.

TRANSITION — « Merci à toutes et à tous ! Quelques leçons pour finir. »`,
  `⏱ 8 min · DÉBRIEFING DE L'ATELIER

ANIMATION — Sondage dans le clavardage (un numéro par personne, cliquez une ligne par réponse), puis les trois questions : deux ou trois réponses au micro, les autres dans le clavardage.

LECTURE DU SONDAGE — Souvent : compte rendu ou plan de départ. Si « Aucun » ressort : explorez. La vérification prend du temps au début ; elle devient rapide avec l'habitude et de bonnes demandes.

POINTS À FAIRE ÉMERGER —
• L'IA accélère surtout les premiers jets et la mise en forme.
• Les erreurs portent sur les dates, les responsables et les faits : ce que seul le chargé de projet connaît.
• L'imprévu montre la vraie valeur : mettre à jour plan, compte rendu et messages en quelques minutes.

TRANSITION — « Il est temps de conclure ces deux jours. »`,
  `⏱ 3 min · CLÔTURE (≈ 15 h 40)

OBJECTIF — Remettre en perspective le chemin parcouru.

DIRE — « Deux jours, six modules. Hier matin, on a compris ce qu'est l'IA : elle apprend d'exemples et prédit le mot probable, pas le vrai. On l'a appliquée à la gestion de projet, avec cinq ingrédients pour bien demander. On a généré un plan et appris à le vérifier. Ce matin, on a automatisé comptes rendus, tâches et alertes, on a parlé des biais, des erreurs, des données et de l'adoption en équipe. Et cet après-midi, vous avez tout mis en pratique. »

QUESTION — « Quel module vous servira le plus lundi ? »

TRANSITION — « Un dernier quiz, pour la route. »`,
  `⏱ 3 min · QUIZ FINAL (réponses multiples)

ANIMATION — Faites voter pour chaque option, cochez, validez, puis cliquez chaque option pour l'explication. → révèle les bonnes réponses, puis l'essentiel.

RÉPONSES — A et C.
• A ✓ — Le contexte réduit les inventions.
• B ✗ PIÈGE — Un compte rendu se relit, toujours.
• C ✓ — Demander ce qui a été supposé.
• D ✗ PIÈGE — Données personnelles et tri biaisé.

MESSAGE CLÉ — « L'IA prépare, vous décidez et vous vérifiez. »

TRANSITION — « Passons de la formation à votre quotidien. »`,
  `⏱ 5 min · PLAN D'ACTION PERSONNEL

OBJECTIF — Transformer la formation en engagements concrets.

ANIMATION — Chacun écrit ses trois engagements dans un document ou un carnet. Laissez 3 minutes de silence (caméras allumées si possible). Puis invitez 2 ou 3 personnes à en lire un au micro ; les autres peuvent en déposer un dans le clavardage.

DIRE — « Trois engagements. Cette semaine : une demande de la bibliothèque, essayée sur un vrai cas. Ce mois-ci : un usage installé dans votre routine, et le temps gagné mesuré. Dans trois mois : une pratique partagée avec votre équipe, une charte d'usage par exemple. »

INSISTER — « Petit et précis vaut mieux que grand et vague. "Utiliser l'IA plus souvent" ne marche pas ; "faire mon compte rendu du mardi avec le modèle" marche. »

TRANSITION — « Ce que vous emportez. »`,
  `⏱ 2 min · BOÎTE À OUTILS

DIRE — « Six outils à retrouver dans ce support : les cinq ingrédients, la bibliothèque de demandes, la grille de contrôle, le feu tricolore, la charte d'équipe, et des ressources : le site de la Commission d'accès à l'information du Québec pour la protection des renseignements personnels, et l'aide en ligne de vos outils, qui évoluent tous les mois. »

LOGISTIQUE — Indiquez comment les participants récupèrent le support (courriel, plateforme Technologia, lien de partage).

TRANSITION — « Il ne me reste qu'à vous remercier. »`,
  `⏱ 5 min · REMERCIEMENTS ET ÉVALUATION

DIRE — « Merci pour votre participation, vos questions et vos présentations. Une seule phrase à retenir : l'IA fait le premier jet, vous faites le dernier. »

ÉVALUATION — Laissez 5 minutes pour remplir l'évaluation de la formation (lien ou formulaire Technologia). Restez disponible pour les questions individuelles.

À PERSONNALISER — Vos coordonnées professionnelles si vous souhaitez être joint après la formation.

CLÔTURE — « Bon retour, et bons projets ! »`,
];
