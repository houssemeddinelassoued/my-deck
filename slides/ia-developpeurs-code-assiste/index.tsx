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
import labsPack from './assets/labs-ia132.zip?url';

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
const FONT_LINK_ID = 'osd-webfont-ia-developpeurs-code-assiste';
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
const SLIDE_ID = 'ia-developpeurs-code-assiste';
const P = 'dv'; // CSS class prefix, unique per deck
const DAY: number = 1;
// Combined 2-day deck: pages after DAY_SPLIT belong to day 2 (0 = single-day deck).
const DAY_SPLIT: number = 59;
const useDay = (): number => {
  const { current } = useSlidePageNumber();
  return DAY_SPLIT > 0 && current > DAY_SPLIT ? 2 : DAY;
};
const COURSE = 'IA pour développeurs';
const CODE = 'IA132';
// Dépôt GitHub des labs (à créer : voir labs/ia-developpeurs-code-assiste/LISEZMOI-formateur.md).
const REPO = 'github.com/houssemeddinelassoued/ia132-labs';
const AUTHOR = 'Houssem Eddine Lassoued';

const MOD_TITLES: Record<number, string> = {
  1: 'Panorama des assistants de codage',
  2: 'Génération et réécriture de code',
  3: 'Débogage et optimisation avec l’IA',
  4: 'Revue de code et documentation',
  5: 'Tests et assurance qualité',
  6: 'Planification et architecture',
  7: 'Ateliers pratiques',
};
// Module 0 = ouverture / réactivation, module 9 = clôture.
const LAST_MOD = 7;
const DAY1_MODS = [1, 2, 3];
const DAY2_MODS = [4, 5, 6, 7];

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
  bug: (
    <>
      <rect x={7} y={7} width={10} height={14} rx={5} />
      <path d="M12 11v10M9 4l1.5 3M15 4l-1.5 3M3 13h4M17 13h4M4 8l3 2M20 8l-3 2M4 19l3-2M20 19l-3-2" />
    </>
  ),
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
  atelier: { label: 'Atelier', tone: 'yellow' as Tone, icon: 'code' as IconName },
  lab: { label: 'Lab', tone: 'green' as Tone, icon: 'code' as IconName },
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
    {(day === 1 ? DAY1_MODS : DAY2_MODS).map((n) => (
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
  copilot: { name: 'GitHub Copilot', short: 'Copilot', mono: 'Co', bg: 'linear-gradient(135deg, #24292F 0%, #6E40C9 100%)' },
  chatgpt: { name: 'ChatGPT · GPT-5', short: 'GPT-5', mono: 'GPT', bg: 'linear-gradient(135deg, #1F8A70 0%, #11604E 100%)' },
  codex: { name: 'OpenAI Codex', short: 'Codex', mono: 'Cx', bg: 'linear-gradient(135deg, #3A3F44 0%, #111315 100%)' },
  cursor: { name: 'Cursor', short: 'Cursor', mono: 'Cu', bg: 'linear-gradient(135deg, #4B5563 0%, #0B0D10 100%)' },
  jetbrains: { name: 'JetBrains AI Assistant', short: 'JetBrains AI', mono: 'JB', bg: 'linear-gradient(135deg, #FF318C 0%, #7B5CFF 55%, #21D789 100%)' },
  junie: { name: 'Junie (JetBrains)', short: 'Junie', mono: 'Ju', bg: 'linear-gradient(135deg, #21D789 0%, #087CFA 100%)' },
  claude: { name: 'Claude Code', short: 'Claude Code', mono: 'Cl', bg: 'linear-gradient(135deg, #D9774B 0%, #B5532E 100%)' },
  gemini: { name: 'Gemini Code Assist', short: 'Gemini', mono: 'Ge', bg: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)' },
  github: { name: 'GitHub', short: 'GitHub', mono: 'GH', bg: 'linear-gradient(135deg, #3A3F44 0%, #111315 100%)' },
  vscode: { name: 'VS Code', short: 'VS Code', mono: 'VS', bg: 'linear-gradient(135deg, #2A9BEF 0%, #0065A9 100%)' },
  terminal: { name: 'Terminal', short: 'Terminal', mono: '>_', bg: 'linear-gradient(135deg, #2B2F33 0%, #111315 100%)' },
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
const AnswerBox = ({ id = 'copilot', children, label, size = 23, cls, style }: { id?: AppId; children: ReactNode; label?: string; size?: number; cls?: string; style?: CSSProperties }) => (
  <div className={cls} style={{ boxSizing: 'border-box', background: T.violet.bg, borderRadius: 16, boxShadow: `inset 0 0 0 1.5px ${T.violet.bd}`, padding: '16px 22px 18px', ...style }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
      <AppTile id={id} size={28} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 19, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.violet.fg }}>{label ?? `Réponse · ${APPS[id].short}`}</span>
    </div>
    <div style={{ fontSize: size, lineHeight: 1.45, color: C.ink }}>{children}</div>
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

// ─── Code editor (dark), terminal, diff ─────────────────────────────────────
const CD = {
  bg: '#1E252E',
  bar: '#161B22',
  text: '#E6EDF3',
  dim: '#6E7681',
  kw: '#FF7B72',
  st: '#A5D6FF',
  nu: '#79C0FF',
  cm: '#8B949E',
  fn: '#D2A8FF',
  ty: '#FFA657',
  add: 'rgba(46, 160, 67, 0.22)',
  del: 'rgba(248, 81, 73, 0.20)',
};
const Kw = ({ children }: { children: ReactNode }) => <span style={{ color: CD.kw }}>{children}</span>;
const St = ({ children }: { children: ReactNode }) => <span style={{ color: CD.st }}>{children}</span>;
const Nu = ({ children }: { children: ReactNode }) => <span style={{ color: CD.nu }}>{children}</span>;
const Cm = ({ children }: { children: ReactNode }) => <span style={{ color: CD.cm, fontStyle: 'italic' }}>{children}</span>;
const Fn = ({ children }: { children: ReactNode }) => <span style={{ color: CD.fn }}>{children}</span>;
const Ty = ({ children }: { children: ReactNode }) => <span style={{ color: CD.ty }}>{children}</span>;
// Completion suggestion shown as grey "ghost text".
const Ghost = ({ children, cls }: { children: ReactNode; cls?: string }) => (
  <span className={cls} style={{ color: CD.dim, fontStyle: 'italic' }}>
    {children}
  </span>
);
// Whole-line highlight for diffs and focus.
const Ln = ({ children, kind, cls }: { children: ReactNode; kind?: 'add' | 'del' | 'hl'; cls?: string }) => (
  <span
    className={cls}
    style={{
      display: 'block',
      margin: '0 -26px',
      padding: '0 26px',
      background: kind === 'add' ? CD.add : kind === 'del' ? CD.del : kind === 'hl' ? 'rgba(255, 208, 0, 0.16)' : undefined,
      boxShadow: kind === 'add' ? 'inset 4px 0 0 #2EA043' : kind === 'del' ? 'inset 4px 0 0 #F85149' : kind === 'hl' ? `inset 4px 0 0 ${C.yellow}` : undefined,
    }}
  >
    {children}
  </span>
);

const CodeDark = ({
  children,
  file,
  lang,
  size = 22,
  cls,
  style,
}: {
  children: ReactNode;
  file?: string;
  lang?: string;
  size?: number;
  cls?: string;
  style?: CSSProperties;
}) => (
  <div className={cls} style={{ boxSizing: 'border-box', background: CD.bg, borderRadius: 16, boxShadow: '0 24px 50px -28px rgba(10,20,40,.7)', overflow: 'hidden', ...style }}>
    {file ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: CD.bar, padding: '10px 20px' }}>
        <span style={{ display: 'flex', gap: 7 }}>
          <span style={{ width: 12, height: 12, borderRadius: 99, background: '#F85149' }} />
          <span style={{ width: 12, height: 12, borderRadius: 99, background: '#D29922' }} />
          <span style={{ width: 12, height: 12, borderRadius: 99, background: '#2EA043' }} />
        </span>
        <span style={{ fontFamily: mono, fontSize: 18, color: '#C9D1D9', marginLeft: 8 }}>{file}</span>
        {lang ? <span style={{ marginLeft: 'auto', fontFamily: mono, fontSize: 16, color: CD.dim, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang}</span> : null}
      </div>
    ) : null}
    <div style={{ padding: '18px 26px 20px', fontFamily: mono, fontSize: size, lineHeight: 1.55, color: CD.text, whiteSpace: 'pre' }}>{children}</div>
  </div>
);

// Terminal: <Pr> is a command line; <Ok>/<Ko> colour the output.
const Ok = ({ children }: { children: ReactNode }) => <span style={{ color: '#3FB950' }}>{children}</span>;
const Ko = ({ children }: { children: ReactNode }) => <span style={{ color: '#F85149' }}>{children}</span>;
const Pr = ({ children }: { children: ReactNode }) => (
  <span>
    <span style={{ color: '#3FB950' }}>$ </span>
    <span style={{ color: '#E6EDF3' }}>{children}</span>
  </span>
);
const Term = ({ children, title = 'Terminal', size = 21, cls, style }: { children: ReactNode; title?: string; size?: number; cls?: string; style?: CSSProperties }) => (
  <div className={cls} style={{ boxSizing: 'border-box', background: '#0D1117', borderRadius: 16, boxShadow: '0 24px 50px -28px rgba(10,20,40,.7)', overflow: 'hidden', ...style }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#161B22', padding: '9px 20px' }}>
      <span style={{ fontFamily: mono, fontSize: 17, color: '#8B949E' }}>&gt;_ {title}</span>
    </div>
    <div style={{ padding: '16px 24px 18px', fontFamily: mono, fontSize: size, lineHeight: 1.5, color: '#C9D1D9', whiteSpace: 'pre' }}>{children}</div>
  </div>
);

// ─── Labs ────────────────────────────────────────────────────────────────────
const RepoChip = ({ size = 24, path, cls, style }: { size?: number; path?: string; cls?: string; style?: CSSProperties }) => (
  <span
    className={cls}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      padding: `${Math.round(size * 0.35)}px ${Math.round(size * 0.7)}px`,
      borderRadius: 12,
      background: C.card,
      boxShadow: `inset 0 0 0 2px ${T.blue.bd}`,
      fontFamily: mono,
      fontSize: size,
      color: T.blue.fg,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    <AppTile id="github" size={Math.round(size * 1.4)} />
    {REPO}
    {path ? <span style={{ color: C.ink }}>/{path}</span> : null}
  </span>
);

const LabStep = ({ n, t, title, children }: { n: number; t: string; title: ReactNode; children?: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 20px', ...dl(200 + n * 100) }}>
    <Num n={n} tone="green" size={42} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 25, fontWeight: 600, lineHeight: 1.25, color: C.ink }}>{title}</div>
      {children ? <div style={{ marginTop: 2, fontSize: 21, lineHeight: 1.35, color: C.muted }}>{children}</div> : null}
    </div>
    <Tag tone="grey" size={19}>
      {t}
    </Tag>
  </div>
);

// Lab brief page: objective + steps on the left; folder, commands and deliverable on the right.
const LabBrief = ({
  mod,
  n,
  title,
  dur,
  objective,
  folder,
  cmd,
  deliverable,
  children,
}: {
  mod: number;
  n: string;
  title: ReactNode;
  dur: string;
  objective: ReactNode;
  folder: string;
  cmd: ReactNode;
  deliverable: ReactNode;
  children: ReactNode;
}) => (
  <Frame mod={mod} kind="lab" label={`Module ${pad(mod)} · Lab ${n}`}>
    <Title>
      <span style={{ color: C.green }}>Lab {n}</span> · {title}
    </Title>
    <Callout cls={A.in} title="Objectif" tone="green" icon="target" size={26} style={{ position: 'absolute', left: 120, top: 196, width: 1060, padding: '16px 26px', ...dl(80) }}>
      {objective}
    </Callout>
    <div style={{ position: 'absolute', left: 120, top: 380, width: 1060, display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    <div className={A.right} style={{ position: 'absolute', left: 1230, top: 196, width: 570, display: 'flex', flexDirection: 'column', gap: 20, ...dl(250) }}>
      <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 26px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Eyebrow c={C.muted} size={20}>
            Dossier
          </Eyebrow>
          <Tag tone="green" size={20}>
            <Icon name="clock" size={20} /> {dur}
          </Tag>
        </div>
        <div style={{ marginTop: 10, fontFamily: mono, fontSize: 23, color: T.blue.fg }}>labs/{folder}/</div>
        <div style={{ marginTop: 6, fontSize: 21, color: C.muted }}>Python ou TypeScript, au choix</div>
      </div>
      <Term title="Vérifier" size={19}>
        {cmd}
      </Term>
      <Card tone="green" icon="flag" title="Livrable" size={23} pad={24}>
        {deliverable}
      </Card>
    </div>
  </Frame>
);

// Lab work page: timer, checklist of milestones, help.
const LabGo = ({ mod, n, minutes, folder, children }: { mod: number; n: string; minutes: number; folder: string; children: ReactNode }) => (
  <Frame mod={mod} kind="lab" label={`Module ${pad(mod)} · Lab ${n} · À vous`}>
    <Title>À vous : lab {n}</Title>
    <Lede>Chacun sur son poste, guide PDF ouvert. Points d’étape au micro : « étape 1, 2 ou 3 ? »</Lede>
    <Timer id={`lab${n}`} minutes={minutes} label={`Lab ${n}`} cls={A.in} style={{ position: 'absolute', left: 120, top: 290, ...dl(100) }} />
    <Checklist cls={A.in} style={{ position: 'absolute', left: 640, top: 290, width: 1160, ...dl(250) }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </Checklist>
    <Callout cls={A.in} title="Bloqué ?" tone="blue" icon="chat" size={24} style={{ position: 'absolute', left: 120, top: 630, width: 460, ...dl(400) }}>
      Dites-le au micro : partage d’écran de 2 minutes. Ou faites expliquer le test qui échoue.
    </Callout>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 880, ...dl(500) }}>
      <RepoChip size={21} path={`labs/${folder}`} />
    </div>
  </Frame>
);

// Source line for studies and figures.
const Src = ({ children, x = 120, y = 950, w = 1680 }: { children: ReactNode; x?: number; y?: number; w?: number }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, fontSize: 18, lineHeight: 1.3, color: C.muted }}>Sources : {children}</div>
);

// ═══ 00-open ═══════════════════════════════════════════════════════════

// ─── Cover ──────────────────────────────────────────────────────────────────
// An editor where the assistant's suggestion fades in as ghost text.
const DV_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <img src={logoStack} alt="Technologia" className={A.fade} style={{ position: 'absolute', left: 112, top: 78, height: 150, display: 'block' }} />
    <div style={{ position: 'absolute', left: 120, top: 318, width: 900 }}>
      <Eyebrow cls={A.in} size={28}>
        Formation IA132 · 2 jours
      </Eyebrow>
      <h1
        className={A.in}
        style={{ margin: '18px 0 0', fontFamily: display, fontWeight: 700, fontSize: 118, lineHeight: 1.0, letterSpacing: '-0.01em', color: C.ink, ...dl(120) }}
      >
        IA pour
        <br />
        développeurs
      </h1>
      <p className={A.in} style={{ margin: '26px 0 0', fontSize: 36, lineHeight: 1.3, color: C.soft, ...dl(240) }}>
        Code assisté et programmation intelligente : coder, tester, documenter et concevoir avec un assistant d’IA
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

    <Squares s={250} x={1470} y={660} delay={200} />
    <CodeDark cls={A.in} file="reservations.py" lang="python" size={23} style={{ position: 'absolute', left: 1060, top: 250, width: 740, ...dl(300) }}>
      <Kw>def</Kw> <Fn>cout</Fn>(resa: <Ty>Reservation</Ty>) -&gt; <Ty>Decimal</Ty>:{'\n'}
      {'    '}
      <St>"""Coût, arrondi au cent supérieur."""</St>
      {'\n'}
      {'    '}heures = <Fn>duree_heures</Fn>(resa){'\n'}
      <span className={A.fade} style={dl(1300)}>
        <Ghost>{'    '}montant = resa.tarif * heures</Ghost>
        {'\n'}
        <Ghost>{'    '}return arrondir(montant, cents=2)</Ghost>
      </span>
      <span className={A.blink} style={{ display: 'inline-block', width: 3, height: 30, background: C.yellow, verticalAlign: 'middle', marginLeft: 2 }} />
    </CodeDark>
    <div className={A.fade} style={{ position: 'absolute', left: 1060, top: 560, display: 'flex', alignItems: 'center', gap: 14, ...dl(1700) }}>
      <span style={{ fontFamily: mono, fontSize: 20, color: C.muted }}>Tab pour accepter</span>
      <span style={{ fontFamily: mono, fontSize: 20, color: C.faint }}>·</span>
      <span style={{ fontFamily: mono, fontSize: 20, color: C.muted }}>Échap pour refuser</span>
    </div>
    <div className={A.float} style={{ position: 'absolute', left: 1110, top: 660, width: 150, height: 150 }}>
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

const DV_Trainer: Page = () => (
  <Frame mod={0}>
    <Portrait x={210} y={300} w={280} />
    <div style={{ position: 'absolute', left: 720, top: 250, width: 1080 }}>
      <Eyebrow cls={A.in}>Votre formateur</Eyebrow>
      <div className={A.in} style={{ marginTop: 10, fontFamily: display, fontWeight: 700, fontSize: 84, lineHeight: 1.05, color: C.ink, ...dl(100) }}>
        {AUTHOR}
      </div>
      <div className={A.in} style={{ marginTop: 8, fontSize: 30, fontWeight: 600, color: C.blue, ...dl(200) }}>
        Développeur Java et Python depuis 18 ans · ingénieur IT, doctorant en IA
      </div>
      <div className={A.grow} style={{ marginTop: 30, height: 3, width: 1080, background: C.rule, ...dl(300) }} />
      <Eyebrow cls={A.in} c={C.muted} style={{ marginTop: 30, ...dl(380) }}>
        Mes engagements pour ces 2 jours
      </Eyebrow>
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Pledge icon="code" tone="blue" d={500}>
          Du vrai code, dans votre IDE, dès la première heure
        </Pledge>
        <Pledge icon="tool" tone="teal" d={640}>
          Des outils comparés honnêtement : Copilot, Cursor, JetBrains, Claude Code
        </Pledge>
        <Pledge icon="check" tone="green" d={780}>
          12 labs indépendants, avec des tests qui disent quand c’est fini
        </Pledge>
        <Pledge icon="shieldCheck" tone="yellow" d={920}>
          Un regard lucide : quand l’IA accélère… et quand elle vous ralentit
        </Pledge>
      </div>
    </div>
  </Frame>
);

// ─── How we work (virtual classroom) ────────────────────────────────────────
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
    style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 24px', background: C.panel, borderRadius: 14, fontSize: 25, lineHeight: 1.3, color: C.ink, ...dl(d) }}
  >
    <Icon name={icon} size={34} color={C.blue} />
    <span>{children}</span>
  </div>
);

const DV_HowWeWork: Page = () => (
  <Frame mod={0}>
    <Title>Comment nous allons travailler</Title>
    <Lede>Une formation par la pratique : on montre, on essaie, on mesure, on discute.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 390px)', columnGap: 40 }}>
      <ActCard kind="qcm" icon="check" title="Votez, vérifiez" d={100}>
        Vous annoncez A, B, C ou D ; la rétroaction est immédiate. Les pièges sont voulus.
      </ActCard>
      <ActCard kind="demo" icon="play" title="Observez" d={220}>
        Démonstrations en direct dans l’IDE, avec de vraies demandes… et de vrais ratés.
      </ActCard>
      <ActCard kind="exercice" icon="hand" title="Manipulez" d={340}>
        Cartes à retourner, étiquettes à placer, code où repérer les failles.
      </ActCard>
      <ActCard kind="lab" icon="code" title="Codez" d={460}>
        12 labs individuels, en Python ou en TypeScript, avec un minuteur et des tests.
      </ActCard>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 700, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 24 }}>
      <RuleChip icon="chat" d={600}>
        Questions bienvenues, à tout moment
      </RuleChip>
      <RuleChip icon="lock" d={700}>
        Aucun code de votre entreprise dans les outils
      </RuleChip>
      <RuleChip icon="layers" d={800}>
        Labs indépendants : pas de fil rouge
      </RuleChip>
    </div>
    <Callout
      cls={A.in}
      title="Classe virtuelle"
      icon="video"
      tone="blue"
      size={26}
      style={{ position: 'absolute', left: 120, top: 830, width: 1680, padding: '14px 26px', ...dl(900) }}
    >
      Caméra si possible, micro coupé hors échanges. Idéal : deux écrans, la formation d’un côté, votre IDE de l’autre.
    </Callout>
  </Frame>
);

// ─── Round table + poll ─────────────────────────────────────────────────────
const AskCard = ({ n, title, sub, d }: { n: number; title: ReactNode; sub: ReactNode; d: number }) => (
  <div
    className={A.left}
    style={{ boxSizing: 'border-box', height: 128, display: 'flex', alignItems: 'center', gap: 26, padding: '0 30px', background: C.card, borderRadius: 'var(--osd-radius)', boxShadow: SHADOW, ...dl(d) }}
  >
    <Num n={n} size={60} />
    <div>
      <div style={{ fontSize: 31, fontWeight: 600, lineHeight: 1.25, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 24, lineHeight: 1.35, color: C.muted }}>{sub}</div>
    </div>
  </div>
);

const DV_Roundtable: Page = () => (
  <Frame mod={0} label="Ouverture · Faisons connaissance">
    <Title>Tour de table</Title>
    <Lede>Une minute chacun, micro ouvert, trois questions. Puis un sondage éclair.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 800, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AskCard n={1} title="Qui êtes-vous ?" sub="Prénom, rôle, équipe, langages du quotidien" d={100} />
      <AskCard n={2} title="Avec quel IDE et quel assistant ?" sub="VS Code, IntelliJ, PyCharm… Copilot, Cursor, aucun ?" d={220} />
      <AskCard n={3} title="Votre attente n° 1 pour ces 2 jours ?" sub="Tests, débogage, revue, architecture, agents…" d={340} />
    </div>
    <Timer id="tour" minutes={15} label="Tour de table" compact cls={A.in} style={{ position: 'absolute', left: 120, top: 760, ...dl(460) }} />
    <div style={{ position: 'absolute', left: 990, top: 280, width: 810 }}>
      <Eyebrow cls={A.in} c={C.violet} style={dl(200)}>
        Sondage éclair · votre usage aujourd’hui
      </Eyebrow>
      <Hint cls={A.in} style={{ marginTop: 8, ...dl(260) }}>
        Répondez par le numéro de la ligne
      </Hint>
      <Poll cls={A.in} style={{ marginTop: 22, ...dl(360) }}>
        <PollRow id="none" icon="eye" tone="grey" label="1 · Je n’utilise pas d’assistant de code" />
        <PollRow id="chat" icon="chat" tone="blue" label="2 · Un chat à côté (ChatGPT…), en copier-coller" />
        <PollRow id="compl" icon="code" tone="teal" label="3 · La complétion dans mon IDE, tous les jours" />
        <PollRow id="agent" icon="bot" tone="green" label="4 · Le mode agent, qui modifie plusieurs fichiers" />
        <PollRow id="team" icon="users" tone="violet" label="5 · Mon équipe a des règles d’usage écrites" />
      </Poll>
    </div>
  </Frame>
);

// ─── Objectives: a rising staircase ─────────────────────────────────────────
const ObjStep = ({ i, h, tone, verb, day, children }: { i: number; h: number; tone: Tone; verb: string; day: string; children: ReactNode }) => (
  <div style={{ position: 'absolute', left: 120 + (i - 1) * 336, top: 960 - h, width: 316, height: h }}>
    <div className={A.growY} style={{ position: 'absolute', inset: 0, borderRadius: 18, background: C.card, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, ...dl(i * 120) }} />
    <div className={A.in} style={{ position: 'relative', padding: '32px 26px 0', ...dl(420 + i * 140) }}>
      <Num n={i} tone={tone} size={52} />
      <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 38, lineHeight: 1.05, letterSpacing: '0.03em', color: C.ink }}>{verb}</div>
      <div style={{ marginTop: 10, fontSize: 24, lineHeight: 1.38, color: C.soft }}>{children}</div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 26, bottom: 24, ...dl(600 + i * 140) }}>
      <Tag tone={day.startsWith('Jour 1') ? 'blue' : 'green'} size={20}>
        {day}
      </Tag>
    </div>
  </div>
);

const DV_Objectives: Page = () => (
  <Frame mod={0}>
    <Title>Ce que vous saurez faire</Title>
    <Lede>Les cinq objectifs de la formation, du code à l’architecture.</Lede>
    <ObjStep i={1} h={420} tone="blue" verb="GÉNÉRER" day="Jour 1 · M2">
      Et refactoriser du code avec des prompts efficaces
    </ObjStep>
    <ObjStep i={2} h={470} tone="coral" verb="CORRIGER" day="Jour 1 · M3">
      Détecter, corriger, optimiser… et valider ce que l’IA propose
    </ObjStep>
    <ObjStep i={3} h={520} tone="violet" verb="DOCUMENTER" day="Jour 2 · M4">
      Automatiser la documentation et les revues de code
    </ObjStep>
    <ObjStep i={4} h={570} tone="green" verb="TESTER" day="Jour 2 · M5">
      Tests unitaires et d’intégration, intégrés à la CI/CD
    </ObjStep>
    <ObjStep i={5} h={620} tone="yellow" verb="CONCEVOIR" day="Jour 2 · M6">
      Architecture, estimation et planification avec l’IA
    </ObjStep>
  </Frame>
);

// ─── Programme ──────────────────────────────────────────────────────────────
const ProgRow = ({ t, n, icon, tone = 'blue', d, children }: { t: string; n?: number; icon?: IconName; tone?: Tone; d: number; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 18, height: 46, ...dl(d) }}>
    <span style={{ width: 76, fontFamily: mono, fontSize: 21, color: C.muted }}>{t}</span>
    {n ? (
      <Num n={pad(n)} tone={tone} size={38} />
    ) : (
      <span style={{ width: 38, display: 'flex', justifyContent: 'center' }}>
        <Icon name={icon ?? 'star'} size={28} color={C.muted} />
      </span>
    )}
    <span style={{ fontSize: 26, fontWeight: 500, color: C.ink }}>{children}</span>
  </div>
);

const ProgBreak = ({ t, d, children }: { t: string; d: number; children: ReactNode }) => (
  <div className={A.fade} style={{ display: 'flex', alignItems: 'center', gap: 18, height: 30, ...dl(d) }}>
    <span style={{ width: 76, fontFamily: mono, fontSize: 19, color: C.faint }}>{t}</span>
    <span style={{ width: 38, height: 2, background: C.rule }} />
    <span style={{ fontSize: 22, fontStyle: 'italic', color: C.muted }}>{children}</span>
  </div>
);

const DayCol = ({ x, day, sub, now, children }: { x: number; day: number; sub: string; now: boolean; children: ReactNode }) => (
  <div
    className={A.in}
    style={{
      position: 'absolute',
      left: x,
      top: 210,
      width: 816,
      boxSizing: 'border-box',
      padding: '24px 34px 22px',
      background: C.card,
      borderRadius: 'var(--osd-radius)',
      boxShadow: now ? `0 0 0 3px ${C.blue}, ${SHADOW}` : SHADOW,
      ...dl(day === 1 ? 0 : 150),
    }}
  >
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 10 }}>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 44, color: now ? C.blue : C.ink }}>Jour {day}</span>
      <span style={{ fontSize: 25, color: C.muted }}>{sub}</span>
      {now ? (
        <Tag tone="blue" size={20} style={{ marginLeft: 'auto' }}>
          Aujourd’hui
        </Tag>
      ) : null}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>{children}</div>
  </div>
);

const ProgramCols = ({ today }: { today: number }) => (
  <>
    <DayCol x={120} day={1} sub="Écrire et corriger du code" now={today === 1}>
      <ProgRow t="9:00" icon="users" d={150}>
        Accueil, tour de table, lab 00
      </ProgRow>
      <ProgRow t="9:30" n={1} d={200}>
        Panorama des assistants · lab 01
      </ProgRow>
      <ProgBreak t="10:30" d={250}>
        Pause
      </ProgBreak>
      <ProgRow t="10:45" n={2} d={300}>
        Génération de code · lab 02
      </ProgRow>
      <ProgBreak t="12:00" d={350}>
        Dîner
      </ProgBreak>
      <ProgRow t="13:00" n={2} d={400}>
        Refactorisation · lab 03
      </ProgRow>
      <ProgRow t="13:30" n={3} d={450}>
        Débogage avec l’IA · lab 04
      </ProgRow>
      <ProgBreak t="14:30" d={500}>
        Pause
      </ProgBreak>
      <ProgRow t="14:45" n={3} d={550}>
        Optimisation · lab 05 · limites
      </ProgRow>
      <ProgRow t="15:40" icon="star" d={600}>
        Bilan du jour 1
      </ProgRow>
    </DayCol>
    <DayCol x={984} day={2} sub="Qualité, conception, projet" now={today === 2}>
      <ProgRow t="9:00" icon="loop" d={300}>
        Réactivation
      </ProgRow>
      <ProgRow t="9:10" n={4} d={350}>
        Documentation et revue · labs 06, 07
      </ProgRow>
      <ProgBreak t="10:30" d={400}>
        Pause
      </ProgBreak>
      <ProgRow t="10:45" n={5} d={450}>
        Tests, charge et CI/CD · labs 08, 09
      </ProgRow>
      <ProgBreak t="12:00" d={500}>
        Dîner
      </ProgBreak>
      <ProgRow t="13:15" n={6} d={550}>
        Architecture et planification · lab 10
      </ProgRow>
      <ProgBreak t="14:15" d={600}>
        Pause
      </ProgBreak>
      <ProgRow t="14:30" n={7} tone="yellow" d={650}>
        Projet final avec un agent · lab 11
      </ProgRow>
      <ProgRow t="15:30" icon="flag" d={700}>
        Présentations, intégration en entreprise
      </ProgRow>
    </DayCol>
  </>
);

const DV_Program: Page = () => (
  <Frame mod={0}>
    <Title>Programme des 2 jours</Title>
    <ProgramCols today={1} />
  </Frame>
);

// ─── The labs repository ────────────────────────────────────────────────────
const RepoStep = ({ n, title, d, children }: { n: number; title: ReactNode; d: number; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', gap: 20, ...dl(d) }}>
    <Num n={n} size={46} />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 28, fontWeight: 600, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const DV_Repo: Page = () => (
  <Frame mod={0} kind="lab" label="Ouverture · Les labs">
    <Title>Le dépôt des labs</Title>
    <Lede>Un seul dépôt GitHub pour les 12 labs. Je colle le lien dans le clavardage.</Lede>
    <div className={A.pop} style={{ position: 'absolute', left: 120, top: 268, ...dl(100) }}>
      <RepoChip size={34} />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 400, width: 900, display: 'flex', flexDirection: 'column', gap: 28 }}>
      <RepoStep n={1} title="Forkez le dépôt" d={250}>
        Bouton Fork : votre copie, où vous pousserez et ouvrirez vos pull requests.
      </RepoStep>
      <RepoStep n={2} title="Clonez votre fork, vérifiez votre poste" d={370}>
        <span style={{ fontFamily: mono, fontSize: 21 }}>python scripts/verifier_env.py</span>
      </RepoStep>
      <RepoStep n={3} title="Ouvrez le guide PDF des ateliers" d={490}>
        Une fiche par lab : objectif, étapes, livrable, pièges. Aussi dans le bouton « Labs ».
      </RepoStep>
      <RepoStep n={4} title="Choisissez votre langage" d={610}>
        Chaque lab existe en Python (pytest) et en TypeScript (Node 22.18+, sans installation).
      </RepoStep>
    </div>
    <CodeDark cls={A.right} file="ia132-labs/" size={21} style={{ position: 'absolute', left: 1100, top: 400, width: 700, ...dl(400) }}>
      <Fn>labs/</Fn>
      {'\n'}
      {'  '}lab04-debogage/{'\n'}
      {'    '}
      <St>README.md</St>
      {'          '}
      <Cm># la fiche</Cm>
      {'\n'}
      {'    '}rapport-incidents.md{'\n'}
      {'    python/            '}
      <Cm># code + tests</Cm>
      {'\n'}
      {'    typescript/        '}
      <Cm># code + tests</Cm>
      {'\n'}
      <Fn>scripts/</Fn>verifier_env.py{'\n'}
      <Fn>.github/</Fn>copilot-instructions.md{'\n'}
      requirements-dev.txt{'  '}package.json
    </CodeDark>
  </Frame>
);

// ─── Lab map: the 12 labs, their module and objective ───────────────────────
const LabTile = ({ n, mod, tone, title, dur, d, children }: { n: string; mod: string; tone: Tone; title: string; dur: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ boxSizing: 'border-box', height: 218, background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 0 6px 0 ${STRONG[tone]}`, padding: '18px 20px 14px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 38, lineHeight: 1, color: tone === 'yellow' ? C.amber : STRONG[tone] }}>{n}</span>
      <span style={{ fontSize: 18, fontWeight: 600, color: C.muted, letterSpacing: '0.04em' }}>{mod}</span>
      <span style={{ marginLeft: 'auto', fontFamily: mono, fontSize: 17, color: C.muted }}>{dur}</span>
    </div>
    <div style={{ marginTop: 8, fontSize: 23, fontWeight: 700, lineHeight: 1.2, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 6, fontSize: 19, lineHeight: 1.35, color: C.soft }}>{children}</div>
  </div>
);

const DV_LabMap: Page = () => (
  <Frame mod={0} kind="lab" label="Ouverture · Les labs">
    <Title>12 labs, 7 modules, un objectif chacun</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 405px)', columnGap: 20, rowGap: 18 }}>
      <LabTile n="00" mod="OUVERTURE" tone="grey" title="Mise en route" dur="10 min" d={60}>
        Dépôt cloné, tests verts, assistant actif
      </LabTile>
      <LabTile n="01" mod="MODULE 1" tone="blue" title="Les 4 modes" dur="20 min" d={120}>
        Complétion, chat, édition, agent : lequel choisir
      </LabTile>
      <LabTile n="02" mod="MODULE 2" tone="teal" title="Générer depuis une spec" dur="25 min" d={180}>
        Prompt structuré, tests comme critère d’acceptation
      </LabTile>
      <LabTile n="03" mod="MODULE 2" tone="teal" title="Refactoriser l’hérité" dur="25 min" d={240}>
        Petites étapes, tests de caractérisation
      </LabTile>
      <LabTile n="04" mod="MODULE 3" tone="coral" title="Chasse aux bogues" dur="25 min" d={300}>
        Reproduire, expliquer, corriger, prouver
      </LabTile>
      <LabTile n="05" mod="MODULE 3" tone="coral" title="Optimiser et mesurer" dur="20 min" d={360}>
        De O(n²) à O(n), gain prouvé par la mesure
      </LabTile>
      <LabTile n="06" mod="MODULE 4" tone="violet" title="Documentation" dur="20 min" d={420}>
        Docstrings conformes, exemples vérifiés
      </LabTile>
      <LabTile n="07" mod="MODULE 4" tone="violet" title="Revue de code" dur="25 min" d={480}>
        IA + analyseur, tri des constats, failles corrigées
      </LabTile>
      <LabTile n="08" mod="MODULE 5" tone="green" title="Tests unitaires" dur="30 min" d={540}>
        Couverture des branches et mutants tués
      </LabTile>
      <LabTile n="09" mod="MODULE 5" tone="green" title="Intégration, charge, CI" dur="35 min" d={600}>
        Vraie API, objectif de service, GitHub Actions
      </LabTile>
      <LabTile n="10" mod="MODULE 6" tone="yellow" title="Architecture" dur="35 min" d={660}>
        Diagramme, ADR, backlog, risques, dépendances
      </LabTile>
      <LabTile n="11" mod="MODULE 7" tone="blue" title="Projet final" dur="55 min" d={720}>
        Un outil complet avec un agent, jusqu’à la PR
      </LabTile>
    </div>
  </Frame>
);

// ─── Lab 00 ─────────────────────────────────────────────────────────────────
const L00_Brief: Page = () => (
  <LabBrief
    mod={0}
    n="00"
    title="Mise en route"
    dur="10 min"
    folder="lab00-mise-en-route"
    objective="Un poste prêt pour 2 jours : dépôt cloné, tests qui passent, assistant d’IA actif dans votre IDE."
    cmd={
      <>
        <Pr>pytest labs/lab00-mise-en-route</Pr>
        {'\n'}
        <Ok>2 passed</Ok>
        {'\n'}
        <Pr>npm run test:lab00</Pr>
        {'\n'}
        <Ok>ℹ pass 2</Ok>
      </>
    }
    deliverable="2 tests verts, et un assistant qui cite les dossiers du dépôt dans sa réponse."
  >
    <LabStep n={1} t="2 min" title="Forkez, clonez">
      Votre copie du dépôt, sur votre compte GitHub
    </LabStep>
    <LabStep n={2} t="3 min" title="Vérifiez le poste">
      scripts/verifier_env.py, puis l’environnement Python ou Node
    </LabStep>
    <LabStep n={3} t="2 min" title="Lancez les tests du lab 00">
      Deux tests verts, en Python et/ou en TypeScript
    </LabStep>
    <LabStep n={4} t="3 min" title="Interrogez votre assistant">
      « Résume ce dépôt en 5 lignes, puis liste les labs avec leur objectif. »
    </LabStep>
  </LabBrief>
);

// ─── Warm-up quiz (multi-answer) ────────────────────────────────────────────
const DV_Quiz0: Page = () => (
  <Frame mod={0} kind="qcm" beats={2} label="Ouverture · Point de départ">
    <Title>
      <span style={{ color: C.violet }}>Quiz éclair</span> · Vos intuitions de départ
    </Title>
    <Qcm
      multi
      q="Un assistant de code d’aujourd’hui peut…"
      explain="L’assistant lit, écrit et exécute : il peut lancer vos tests et itérer. Mais il prédit du code plausible, sans garantie. La responsabilité du code fusionné reste la vôtre : c’est le fil de ces 2 jours."
    >
      <Opt ok why="Oui : en mode agent, il lit le dépôt, modifie plusieurs fichiers, lance les tests et corrige jusqu’à ce qu’ils passent.">
        Modifier plusieurs fichiers et lancer les tests lui-même
      </Opt>
      <Opt why="Piège ! Il produit du code plausible, pas prouvé. Des études mesurent des failles dans près d’un code généré sur deux : on y revient au module 3.">
        Garantir qu’un code qui compile est sûr et correct
      </Opt>
      <Opt ok why="Oui : à partir d’une trace d’erreur et du code, il formule des hypothèses de cause racine. À vous de les vérifier.">
        Expliquer une trace d’erreur et proposer une cause
      </Opt>
      <Opt why="Piège ! Il ne connaît ni vos contraintes métier, ni ce que l’équipe a décidé hier, sauf si vous le lui écrivez (instructions de projet).">
        Connaître les conventions de votre équipe sans qu’on les lui donne
      </Opt>
    </Qcm>
  </Frame>
);

// ─── Module 1 divider ───────────────────────────────────────────────────────
const M1_Divider: Page = () => (
  <Section n={1} title="Panorama des assistants de codage" sub="D’où ils viennent, comment ils fonctionnent, lequel choisir et pour quoi faire." dur="≈ 1 h">
    <SecItem n={1}>Évolution des outils IA pour développeurs</SecItem>
    <SecItem n={2}>GPT-5, Copilot, JetBrains AI, Cursor, Claude Code</SecItem>
    <SecItem n={3}>Complétion, chat, édition, agent : les 4 modes</SecItem>
    <SecItem n={4}>Cas d’usage et bénéfices réels pour les équipes</SecItem>
  </Section>
);
M1_Divider.transition = BLOOM;

// ═══ 10-m1 ═════════════════════════════════════════════════════════════

// ─── M1 · Timeline: from completion to agents ───────────────────────────────
const Era = ({ n, x, year, tone, icon, title, children }: { n: number; x: number; year: string; tone: Tone; icon: IconName; title: string; children: ReactNode }) => (
  <>
    <div className={b.pop(n)} style={{ position: 'absolute', left: x + 128, top: 448, width: 34, height: 34, borderRadius: 99, background: STRONG[tone], boxShadow: '0 0 0 6px #fff' }} />
    <div className={b.on(n)} style={{ position: 'absolute', left: x, top: 290, width: 290, textAlign: 'center' }}>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 58, lineHeight: 1, color: tone === 'yellow' ? C.amber : STRONG[tone] }}>{year}</div>
    </div>
    <div
      className={b.on(n)}
      style={{ position: 'absolute', left: x, top: 520, width: 270, height: 400, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '26px 22px', ...dl(120) }}
    >
      <IconTile name={icon} tone={tone} size={60} />
      <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 32, lineHeight: 1.08, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 10, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </>
);

const M1_Timeline: Page = () => (
  <Frame mod={1} beats={6}>
    <Title>De l’autocomplétion aux agents</Title>
    <Lede>En cinq ans, l’assistant est passé de « finir ma ligne » à « exécuter ma tâche ».</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <line x1={140} y1={465} x2={1800} y2={465} stroke={C.rule} strokeWidth={6} strokeLinecap="round" />
      <line x1={140} y1={465} x2={1800} y2={465} stroke={C.blue} strokeWidth={6} strokeLinecap="round" pathLength={1} className={b.draw(1)} style={{ transitionDuration: '2600ms' } as CSSProperties} />
    </svg>
    <Era n={1} x={120} year="2021" tone="grey" icon="code" title="Complétion">
      Copilot en préversion : la suite de la ligne ou de la fonction, en gris.
    </Era>
    <Era n={2} x={402} year="2022" tone="blue" icon="chat" title="Chat">
      ChatGPT : on décrit, on copie-colle. Le code sort de l’IDE.
    </Era>
    <Era n={3} x={684} year="2023" tone="teal" icon="layers" title="Chat dans l’IDE">
      Copilot Chat, JetBrains AI, Cursor : le chat voit vos fichiers.
    </Era>
    <Era n={4} x={966} year="2024" tone="violet" icon="doc" title="Édition multi-fichiers">
      Plusieurs modèles au choix, diffs sur plusieurs fichiers, protocole MCP.
    </Era>
    <Era n={5} x={1248} year="2025" tone="green" icon="bot" title="Agents">
      Mode agent, Claude Code, GPT-5 : l’IA lance les tests et itère.
    </Era>
    <Era n={6} x={1530} year="2026" tone="yellow" icon="users" title="Agents en équipe">
      Tâches confiées par ticket, revue de PR, instructions de projet partagées.
    </Era>
  </Frame>
);

// ─── M1 · How an LLM writes code ────────────────────────────────────────────
const TokBar = ({ tok, p, ok, n }: { tok: string; p: number; ok?: boolean; n: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 54 }}>
    <span style={{ width: 230, fontFamily: mono, fontSize: 25, color: ok ? C.green : C.ink, textAlign: 'right', whiteSpace: 'pre' }}>{tok}</span>
    <div style={{ flex: 1, height: 34, background: C.panel, borderRadius: 8, overflow: 'hidden' }}>
      <div className={b.grow(n)} style={{ width: `${p}%`, height: '100%', background: ok ? C.green : '#93C1E8', borderRadius: 8 }} />
    </div>
    <span className={b.fade(n)} style={{ width: 80, fontFamily: mono, fontSize: 23, color: C.muted }}>
      {p} %
    </span>
  </div>
);

const M1_Predict: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>Comment un assistant écrit du code</Title>
    <Lede>Il ne « sait » pas : il prédit le morceau de texte (jeton) le plus probable, puis recommence.</Lede>
    <CodeDark cls={A.in} file="remise.py" size={25} style={{ position: 'absolute', left: 120, top: 290, width: 760, ...dl(100) }}>
      <Kw>def</Kw> <Fn>prix_remise</Fn>(prix, taux):{'\n'}
      {'    '}
      <St>"""Prix après remise de taux %."""</St>
      {'\n'}
      {'    '}
      <Kw>return</Kw> prix * (<Nu>1</Nu> -<span className={A.blink} style={{ display: 'inline-block', width: 3, height: 32, background: C.yellow, verticalAlign: 'middle' }} />
    </CodeDark>
    <div style={{ position: 'absolute', left: 980, top: 290, width: 820 }}>
      <Eyebrow c={C.muted}>Jetons candidats après « (1 - »</Eyebrow>
      <div style={{ marginTop: 18 }}>
        <TokBar tok=" taux / 100" p={71} ok n={1} />
        <TokBar tok=" taux" p={18} n={1} />
        <TokBar tok=" remise" p={6} n={1} />
        <TokBar tok=" 0.01 * taux" p={4} n={1} />
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 28 }}>
      <Card cls={b.on(2)} tone="blue" icon="chart" title="Probable" size={24}>
        Le modèle choisit la suite la plus vraisemblable d’après des milliards de lignes de code.
      </Card>
      <Card cls={b.on(2)} tone="coral" icon="alert" title="Pas prouvé" size={24} style={dl(120)}>
        Plausible ≠ correct : « taux » seul serait accepté par Python… et faux.
      </Card>
      <Card cls={b.on(3)} tone="green" icon="target" title="Guidable" size={24}>
        Noms, types, docstring et tests changent les probabilités. C’est tout l’art du prompt.
      </Card>
    </div>
  </Frame>
);

// ─── M1 · What the assistant sees ───────────────────────────────────────────
const CtxIn = ({ y, icon, tone, children, n }: { y: number; icon: IconName; tone: Tone; children: ReactNode; n: number }) => (
  <div className={b.left(n)} style={{ position: 'absolute', left: 120, top: y, width: 560, height: 78, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '0 22px' }}>
    <IconTile name={icon} tone={tone} size={50} />
    <span style={{ fontSize: 25, color: C.ink, lineHeight: 1.25 }}>{children}</span>
  </div>
);

const M1_Context: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>Ce que voit l’assistant : le contexte</Title>
    <Lede>Ce qui n’est pas dans sa fenêtre de contexte n’existe pas pour lui.</Lede>
    <CtxIn y={270} icon="code" tone="blue" n={1}>
      Le fichier ouvert, autour du curseur
    </CtxIn>
    <CtxIn y={362} icon="layers" tone="blue" n={1}>
      Les onglets ouverts, la sélection
    </CtxIn>
    <CtxIn y={454} icon="link" tone="teal" n={2}>
      Les fichiers joints : #file, @workspace
    </CtxIn>
    <CtxIn y={546} icon="note" tone="teal" n={2}>
      Les instructions de projet (AGENTS.md…)
    </CtxIn>
    <CtxIn y={638} icon="tool" tone="green" n={2}>
      Les résultats d’outils : terminal, tests
    </CtxIn>
    <CtxIn y={730} icon="chat" tone="violet" n={2}>
      L’historique de la conversation
    </CtxIn>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <Arrow x1={700} y1={540} x2={850} y2={540} color={C.blue} w={5} n={1} />
      <Arrow x1={1270} y1={540} x2={1400} y2={540} color={C.green} w={5} n={3} />
    </svg>
    <div className={A.in} style={{ position: 'absolute', left: 870, top: 330, width: 380, height: 420, boxSizing: 'border-box', background: G.blue, borderRadius: 22, boxShadow: SHADOW, padding: 30, color: '#fff', ...dl(100) }}>
      <Icon name="brain" size={64} color="#fff" sw={1.8} />
      <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 40 }}>Fenêtre de contexte</div>
      <div style={{ marginTop: 10, fontSize: 24, lineHeight: 1.4, color: '#EAF4FB' }}>
        Grande, mais limitée et coûteuse. Trop de contexte inutile dilue l’attention du modèle.
      </div>
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 1420, top: 400, width: 380 }}>
      <Card tone="green" icon="sparkles" title="Suggestion" size={24}>
        Aussi bonne que le contexte fourni.
      </Card>
    </div>
    <Callout cls={b.on(3)} title="Règle d’or" tone="yellow" size={26} style={{ position: 'absolute', left: 870, top: 800, width: 930 }}>
      Joignez les bons fichiers, fermez les onglets sans rapport, écrivez vos conventions une fois.
    </Callout>
  </Frame>
);

// ─── M1 · Tools panorama ────────────────────────────────────────────────────
const ToolCard = ({ id, where, d, children }: { id: AppId; where: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ boxSizing: 'border-box', height: 590, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '26px 24px', ...dl(d) }}>
    <AppTile id={id} size={72} />
    <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 32, lineHeight: 1.05, color: C.ink }}>{APPS[id].name}</div>
    <div style={{ marginTop: 8 }}>
      <Tag tone="grey" size={18}>
        {where}
      </Tag>
    </div>
    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
  </div>
);
const Pt = ({ children }: { children: ReactNode }) => (
  <Bullet size={21} tone="blue">
    {children}
  </Bullet>
);

const M1_Tools: Page = () => (
  <Frame mod={1}>
    <Title>Les principaux outils</Title>
    <Lede>Les fonctions convergent ; ce qui change : l’intégration, le choix des modèles, la gouvernance.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(5, 320px)', columnGap: 20 }}>
      <ToolCard id="copilot" where="VS Code, JetBrains, Visual Studio" d={100}>
        <Pt>Complétion, chat, édition, agent</Pt>
        <Pt>Agent de codage sur un ticket GitHub</Pt>
        <Pt>Revue de PR, plusieurs modèles</Pt>
      </ToolCard>
      <ToolCard id="chatgpt" where="Web, API, Codex (CLI et cloud)" d={200}>
        <Pt>Raisonnement à la demande</Pt>
        <Pt>Appels d’outils, longs contextes</Pt>
        <Pt>Intégré à Copilot et à Cursor</Pt>
      </ToolCard>
      <ToolCard id="jetbrains" where="IntelliJ, PyCharm, WebStorm…" d={300}>
        <Pt>Complétion locale et en nuage</Pt>
        <Pt>Actions : tests, doc, commit</Pt>
        <Pt>Junie : l’agent de JetBrains</Pt>
      </ToolCard>
      <ToolCard id="cursor" where="Éditeur dérivé de VS Code" d={400}>
        <Pt>Complétion « Tab » multi-lignes</Pt>
        <Pt>Agent, règles de projet</Pt>
        <Pt>Indexation de tout le dépôt</Pt>
      </ToolCard>
      <ToolCard id="claude" where="Terminal, VS Code, JetBrains" d={500}>
        <Pt>Agent en ligne de commande</Pt>
        <Pt>Plan, modifications, tests</Pt>
        <Pt>Instructions dans CLAUDE.md</Pt>
      </ToolCard>
    </div>
    <Hint cls={A.in} style={{ position: 'absolute', left: 120, top: 900, ...dl(700) }}>
      Les noms de modèles changent tous les trimestres : comparez les modes et l’intégration, pas les versions.
    </Hint>
  </Frame>
);

// ─── M1 · Models: GPT-5 and choosing ────────────────────────────────────────
const ModelRow = ({ task, kind, tone, d }: { task: string; kind: string; tone: Tone; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 70, borderBottom: `1.5px solid ${C.rule}`, ...dl(d) }}>
    <span style={{ flex: 1, fontSize: 25, color: C.ink }}>{task}</span>
    <Tag tone={tone} size={21}>
      {kind}
    </Tag>
  </div>
);

const M1_Models: Page = () => (
  <Frame mod={1}>
    <Title>Un outil, plusieurs modèles</Title>
    <Lede>GPT-5 et ses concurrents raisonnent plus ou moins longtemps selon la tâche. À vous de choisir.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 760, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '28px 32px', ...dl(100) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <AppTile id="chatgpt" size={64} />
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 38, color: C.ink }}>GPT-5 : capacités avancées</div>
      </div>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Bullet size={25}>
          <Strong>Raisonnement à la demande</Strong> : réponse rapide ou réflexion longue
        </Bullet>
        <Bullet size={25}>
          <Strong>Agentique</Strong> : appelle des outils, enchaîne des étapes
        </Bullet>
        <Bullet size={25}>
          <Strong>Long contexte</Strong> : plusieurs fichiers, une longue spec
        </Bullet>
        <Bullet size={25}>
          <Strong>Multimodal</Strong> : une capture d’écran devient une interface
        </Bullet>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 960, top: 280, width: 840 }}>
      <Eyebrow cls={A.in} c={C.muted} style={dl(200)}>
        Quel type de modèle pour quelle tâche ?
      </Eyebrow>
      <div style={{ marginTop: 12 }}>
        <ModelRow task="Compléter une ligne, renommer, petit test" kind="Rapide" tone="green" d={300} />
        <ModelRow task="Expliquer un module, écrire une fonction" kind="Standard" tone="blue" d={400} />
        <ModelRow task="Bogue subtil, concurrence, algorithme" kind="Raisonnement" tone="violet" d={500} />
        <ModelRow task="Plan de migration, architecture" kind="Raisonnement" tone="violet" d={600} />
        <ModelRow task="Tâche agent sur 10 fichiers" kind="Agentique" tone="yellow" d={700} />
      </div>
    </div>
    <Callout cls={A.in} title="Le bon réflexe" tone="blue" icon="gauge" size={25} style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(800) }}>
      Commencez rapide ; passez au raisonnement quand la première réponse est fausse pour une raison de fond. Plus lent et plus cher n’est pas toujours mieux.
    </Callout>
  </Frame>
);

// ─── M1 · The 4 modes ───────────────────────────────────────────────────────
const ModeCol = ({ n, x, tone, icon, title, who, ex, risk }: { n: number; x: number; tone: Tone; icon: IconName; title: string; who: string; ex: string; risk: string }) => (
  <div className={b.on(n)} style={{ position: 'absolute', left: x, top: 330, width: 396, height: 520, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, padding: '28px 28px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <IconTile name={icon} tone={tone} size={64} solid />
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 40, color: C.ink }}>{title}</div>
    </div>
    <Eyebrow c={C.muted} size={19} style={{ marginTop: 22 }}>
      Qui décide de chaque ligne ?
    </Eyebrow>
    <div style={{ marginTop: 6, fontSize: 25, lineHeight: 1.35, color: C.ink }}>{who}</div>
    <Eyebrow c={C.muted} size={19} style={{ marginTop: 18 }}>
      Exemple
    </Eyebrow>
    <div style={{ marginTop: 6, fontSize: 23, lineHeight: 1.4, color: C.soft, fontStyle: 'italic' }}>{ex}</div>
    <div style={{ position: 'absolute', left: 28, bottom: 24 }}>
      <Tag tone={tone} size={19}>
        {risk}
      </Tag>
    </div>
  </div>
);

const M1_Modes: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>Les 4 modes d’interaction</Title>
    <Lede>Plus l’autonomie monte, plus la tâche avance vite… et plus la relecture compte.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <defs>
        <linearGradient id="dv-auto" x1="0" x2="1">
          <stop offset="0" stopColor="#93C1E8" />
          <stop offset="1" stopColor={C.amber} />
        </linearGradient>
      </defs>
      <rect x={120} y={280} width={1680} height={14} rx={7} fill="url(#dv-auto)" />
      <text x={120} y={318} fontFamily="Barlow" fontSize={20} fill={C.muted}>
        AUTONOMIE FAIBLE
      </text>
      <text x={1800} y={318} fontFamily="Barlow" fontSize={20} fill={C.muted} textAnchor="end">
        AUTONOMIE FORTE
      </text>
    </svg>
    <ModeCol n={1} x={120} tone="blue" icon="code" title="Complétion" who="Vous, Tab par Tab." ex="La suite de la ligne, une fonction à partir de sa docstring." risk="Relire chaque suggestion" />
    <ModeCol n={2} x={548} tone="teal" icon="chat" title="Chat" who="Vous : il répond, vous appliquez." ex="« Pourquoi ce test échoue-t-il ? » « Compare ces 2 options. »" risk="Vérifier les affirmations" />
    <ModeCol n={3} x={976} tone="violet" icon="doc" title="Édition" who="L’IA propose un diff, vous l’acceptez." ex="« Extrais cette logique en fonction dans ces 3 fichiers. »" risk="Relire le diff" />
    <ModeCol n={4} x={1404} tone="yellow" icon="bot" title="Agent" who="L’IA, en boucle ; vous validez les étapes." ex="« Ajoute la commande export et fais passer les tests. »" risk="Plan, garde-fous, revue" />
  </Frame>
);

// ─── M1 · Exercise: which mode? ─────────────────────────────────────────────
const ModeBin = ({ x, tone, title }: { x: number; tone: Tone; title: string }) => (
  <div style={{ position: 'absolute', left: x, top: 520, width: 405, height: 440, boxSizing: 'border-box', borderRadius: 18, background: T[tone].bg, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, padding: '16px 20px' }}>
    <div style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: T[tone].fg }}>{title}</div>
  </div>
);

const M1_ModesEx: Page = () => (
  <Frame mod={1} kind="exercice">
    <Title>Quel mode pour quelle tâche ?</Title>
    <Lede>Dites-moi où va chaque étiquette. Plusieurs réponses se défendent : justifiez.</Lede>
    <ModeBin x={120} tone="blue" title="Complétion" />
    <ModeBin x={545} tone="teal" title="Chat" />
    <ModeBin x={970} tone="violet" title="Édition" />
    <ModeBin x={1395} tone="yellow" title="Agent" />
    <Drag x={120} y={270} w={405} tone="grey" size={22}>
      Écrire le corps d’un getter évident
    </Drag>
    <Drag x={545} y={270} w={405} tone="grey" size={22}>
      Comprendre un module de 800 lignes
    </Drag>
    <Drag x={970} y={270} w={405} tone="grey" size={22}>
      Renommer un concept dans 6 fichiers
    </Drag>
    <Drag x={1395} y={270} w={405} tone="grey" size={22}>
      Migrer 40 tests de unittest à pytest
    </Drag>
    <Drag x={120} y={380} w={405} tone="grey" size={22}>
      Choisir entre deux bibliothèques
    </Drag>
    <Drag x={545} y={380} w={405} tone="grey" size={22}>
      Ajouter une commande + ses tests
    </Drag>
    <Drag x={970} y={380} w={405} tone="grey" size={22}>
      Expliquer une trace d’erreur
    </Drag>
    <Drag x={1395} y={380} w={405} tone="grey" size={22}>
      Compléter un tableau de constantes
    </Drag>
  </Frame>
);

// ─── M1 · The agent loop ────────────────────────────────────────────────────
const LoopNode = ({ x, y, icon, tone, title, n }: { x: number; y: number; icon: IconName; tone: Tone; title: string; n: number }) => (
  <div className={b.pop(n)} style={{ position: 'absolute', left: x - 120, top: y - 62, width: 240, height: 124, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 6px 0 ${STRONG[tone]}`, display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px' }}>
    <IconTile name={icon} tone={tone} size={54} />
    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{title}</span>
  </div>
);

const M1_AgentLoop: Page = () => {
  const path = 'M 560 330 L 860 330 L 860 560 L 860 790 L 560 790 L 260 790 L 260 560 L 260 330 Z';
  return (
    <Frame mod={1} beats={3}>
      <Title>Ce que fait un agent</Title>
      <Lede>Une boucle : il agit, observe le résultat (tests, erreurs), et recommence.</Lede>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
        <path d={path} fill="none" stroke={C.rule} strokeWidth={6} strokeDasharray="12 14" className={A.march} />
        <FlowDot path={path} dur={6} color={C.blue} r={9} />
      </svg>
      <LoopNode x={560} y={330} icon="map" tone="blue" title="Planifier" n={1} />
      <LoopNode x={860} y={560} icon="search" tone="teal" title="Lire le code" n={1} />
      <LoopNode x={560} y={790} icon="code" tone="violet" title="Modifier" n={1} />
      <LoopNode x={260} y={560} icon="play" tone="green" title="Exécuter" n={1} />
      <div className={b.on(1)} style={{ position: 'absolute', left: 420, top: 520, width: 280, textAlign: 'center', fontSize: 23, color: C.muted, lineHeight: 1.35 }}>
        tests rouges ?
        <br />
        on recommence
      </div>
      <div style={{ position: 'absolute', left: 1080, top: 280, width: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card cls={b.on(2)} tone="green" icon="humanCheck" title="Vos points de contrôle" size={24}>
          Valider le plan · approuver les commandes sensibles · relire le diff final · décider de fusionner.
        </Card>
        <Card cls={b.on(3)} tone="coral" icon="alert" title="Ce qui peut mal tourner" size={24}>
          Il modifie un test pour le faire passer, sort du périmètre, installe un paquet inconnu, tourne en rond.
        </Card>
        <Callout cls={b.on(3)} title="Garde-fous" tone="yellow" icon="shield" size={24}>
          Instructions de projet, branche dédiée, permissions limitées, tests comme critère d’arrêt.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── M1 · Use cases and benefits ────────────────────────────────────────────
const UseCase = ({ icon, tone, title, gain, d, children }: { icon: IconName; tone: Tone; title: string; gain: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ boxSizing: 'border-box', height: 300, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '24px 26px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <IconTile name={icon} tone={tone} size={56} />
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 30, lineHeight: 1.08, color: C.ink }}>{title}</div>
    </div>
    <div style={{ marginTop: 14, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{children}</div>
    <div style={{ marginTop: 14 }}>
      <Tag tone={tone} size={19}>
        {gain}
      </Tag>
    </div>
  </div>
);

const M1_UseCases: Page = () => (
  <Frame mod={1}>
    <Title>Cas d’usage pour une équipe de développement</Title>
    <Lede>Les gains sont réels là où le travail est répétitif, documenté ou facile à vérifier.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 26, rowGap: 24 }}>
      <UseCase icon="code" tone="blue" title="Code répétitif" gain="Gain élevé, risque faible" d={100}>
        Mappers, validations, appels d’API, scripts : ce qu’on écrit pour la 50ᵉ fois.
      </UseCase>
      <UseCase icon="search" tone="teal" title="Comprendre l’inconnu" gain="Accueil des nouveaux" d={180}>
        Expliquer un module hérité, une expression régulière, une requête SQL de 60 lignes.
      </UseCase>
      <UseCase icon="check" tone="green" title="Tests" gain="Couverture, cas limites" d={260}>
        Première suite de tests, cas limites oubliés, données de test réalistes.
      </UseCase>
      <UseCase icon="doc" tone="violet" title="Documentation" gain="Enfin à jour" d={340}>
        Docstrings, README, notes de version, descriptions de pull request.
      </UseCase>
      <UseCase icon="eye" tone="yellow" title="Revue de code" gain="Premier filtre" d={420}>
        Repérer oublis, failles connues et incohérences avant le relecteur humain.
      </UseCase>
      <UseCase icon="loop" tone="coral" title="Migrations" gain="Gros volume" d={500}>
        Version de framework, bibliothèque obsolète, changement d’API sur tout le dépôt.
      </UseCase>
    </div>
  </Frame>
);

// ─── M1 · What the studies say ──────────────────────────────────────────────
const Evid = ({ value, tone, title, d, children }: { value: ReactNode; tone: Tone; title: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ boxSizing: 'border-box', height: 440, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, padding: '30px 28px', ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 700, fontSize: 96, lineHeight: 1, color: tone === 'yellow' ? C.amber : STRONG[tone] }}>{value}</div>
    <div style={{ marginTop: 14, fontSize: 26, fontWeight: 600, lineHeight: 1.3, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 10, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </div>
);

const M1_Evidence: Page = () => (
  <Frame mod={1}>
    <Title>Ce que disent les études</Title>
    <Lede>Des gains réels sur des tâches ciblées ; des résultats plus nuancés sur du vrai travail.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: 26 }}>
      <Evid value={<CountUp to={55} prefix="+" suffix=" %" />} tone="green" title="plus rapide sur une tâche ciblée" d={100}>
        Écrire un serveur HTTP en JavaScript, avec ou sans Copilot (95 développeurs).
      </Evid>
      <Evid value={<CountUp to={19} prefix="−" suffix=" %" />} tone="coral" title="plus lent… en se croyant plus rapide" d={250}>
        16 développeurs expérimentés, sur leurs propres dépôts. Ils estimaient avoir gagné 20 %.
      </Evid>
      <Evid value={<CountUp to={84} suffix=" %" />} tone="blue" title="utilisent ou vont utiliser l’IA" d={400}>
        Mais 46 % se méfient de l’exactitude des réponses, contre 33 % qui lui font confiance.
      </Evid>
      <Evid value={<CountUp to={66} suffix=" %" />} tone="yellow" title="« presque juste, mais pas tout à fait »" d={550}>
        Première frustration citée : le code presque bon, long à corriger.
      </Evid>
    </div>
    <Callout cls={A.in} title="À retenir" size={25} style={{ position: 'absolute', left: 120, top: 750, width: 1680, ...dl(700) }}>
      Le gain dépend de la tâche, du contexte fourni et de la vérification. Mesurez chez vous, sur vos tâches.
    </Callout>
    <Src y={940}>GitHub Research (2022) · METR (juillet 2025) · Stack Overflow Developer Survey 2025.</Src>
  </Frame>
);

// ─── M1 · Quiz ──────────────────────────────────────────────────────────────
const M1_Quiz: Page = () => (
  <QcmPage
    mod={1}
    n={1}
    title="Une fonction qui n’existe pas"
    q="L’assistant propose df = pandas.read_excelx(chemin). La fonction n’existe pas. Pourquoi ?"
    explain="Le modèle prédit un texte plausible. Un nom d’API qui « sonne juste » peut être inventé : c’est une hallucination. Seuls la documentation, l’exécution et les tests tranchent."
  >
    <Opt ok why="Exact : read_excel existe, read_excelx non. Le modèle a produit un nom vraisemblable sans vérifier qu’il existe.">
      Le modèle a prédit un nom plausible, sans le vérifier
    </Opt>
    <Opt why="Piège ! Aucune version de pandas n’a read_excelx. Croire à une « nouvelle version » est le réflexe qui fait perdre une heure.">
      C’est une fonction d’une version récente de pandas
    </Opt>
    <Opt why="Piège : un mode plus coûteux réduit les erreurs, sans les supprimer. La vérification reste nécessaire.">
      Il fallait utiliser le mode agent, qui ne se trompe pas
    </Opt>
    <Opt why="Non : l’assistant n’exécute pas le code en complétion. Il ne teste rien avant de proposer.">
      L’assistant a testé, mais l’environnement est différent
    </Opt>
  </QcmPage>
);

// ─── Lab 01 ─────────────────────────────────────────────────────────────────
const L01_Brief: Page = () => (
  <LabBrief
    mod={1}
    n="01"
    title="Les 4 modes de votre assistant"
    dur="20 min"
    folder="lab01-decouverte"
    objective="Utiliser la complétion, le chat, l’édition et l’agent sur un même petit module, et savoir lequel choisir."
    cmd={
      <>
        <Pr>pytest labs/lab01-decouverte</Pr>
        {'\n'}
        <Ko>15 failed</Ko>
        {'  '}
        <Cm>au départ</Cm>
        {'\n'}
        <Pr>npm run test:lab01</Pr>
      </>
    }
    deliverable="Tous les tests verts et NOTES.md : une phrase par mode, « utile pour… / à éviter pour… »."
  >
    <LabStep n={1} t="5 min" title="Complétion">
      Effacez le raise, laissez venir la suggestion grise, lisez avant Tab
    </LabStep>
    <LabStep n={2} t="5 min" title="Chat">
      « Explique cette fonction. Quels cas limites ne sont pas testés ? »
    </LabStep>
    <LabStep n={3} t="5 min" title="Édition">
      convertir() avec un dictionnaire de fonctions : relisez le diff
    </LabStep>
    <LabStep n={4} t="5 min" title="Agent">
      Ajouter main(argv) pour faire passer test_cli : observez ce qu’il lance
    </LabStep>
  </LabBrief>
);

const L01_Go: Page = () => (
  <LabGo mod={1} n="01" minutes={20} folder="lab01-decouverte">
    <CheckItem id="l01-1">Étape 1 : les 4 conversions complétées, suggestions lues</CheckItem>
    <CheckItem id="l01-2">Étape 2 : un cas limite pertinent noté, un hors sujet aussi</CheckItem>
    <CheckItem id="l01-3">Étape 3 : convertir() en dictionnaire, diff relu, tests verts</CheckItem>
    <CheckItem id="l01-4">Étape 4 : main() par l’agent, sans toucher aux tests</CheckItem>
    <CheckItem id="l01-5">NOTES.md : une phrase par mode</CheckItem>
  </LabGo>
);

// ─── M1 · Synthesis ─────────────────────────────────────────────────────────
const M1_Synth: Page = () => (
  <SynthPage
    mod={1}
    title="Module 1 · Ce qu’il faut retenir"
    poste={
      <>
        Activez votre assistant dans l’IDE que vous utilisez déjà. Choisissez le mode selon la tâche, pas par habitude. Notez une tâche où il vous a fait gagner du temps… et une où il vous en a fait perdre.
      </>
    }
  >
    <SynthRow n={1} tone="blue" d={100}>
      L’assistant prédit du code plausible : utile, jamais prouvé
    </SynthRow>
    <SynthRow n={2} tone="teal" d={200}>
      La qualité dépend du contexte : fichiers, conventions, tests
    </SynthRow>
    <SynthRow n={3} tone="violet" d={300}>
      4 modes, de la complétion à l’agent : l’autonomie a un prix
    </SynthRow>
    <SynthRow n={4} tone="green" d={400}>
      Les outils convergent : choisissez selon l’intégration et la gouvernance
    </SynthRow>
    <SynthRow n={5} tone="yellow" d={500}>
      Le gain se mesure sur vos tâches, pas dans les annonces
    </SynthRow>
  </SynthPage>
);

// ─── Module 2 divider ───────────────────────────────────────────────────────
const M2_Divider: Page = () => (
  <Section n={2} title="Génération et réécriture de code" sub="Bien demander, donner le bon contexte, et faire évoluer du code existant sans rien casser." dur="≈ 1 h 45">
    <SecItem n={1}>Générer du code à partir de prompts</SecItem>
    <SecItem n={2}>Complétion intelligente et contextuelle</SecItem>
    <SecItem n={3}>Refactoriser et optimiser du code existant</SecItem>
    <SecItem n={4}>Bonnes pratiques pour des prompts efficaces</SecItem>
  </Section>
);
M2_Divider.transition = BLOOM;

// ═══ 20-m2 ═════════════════════════════════════════════════════════════

// ─── M2 · Anatomy of a code prompt ──────────────────────────────────────────
const Ingr = ({ n, letter, tone, title, children }: { n: number; letter: string; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ boxSizing: 'border-box', height: 300, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, padding: '24px 24px' }}>
    <div style={{ fontFamily: display, fontWeight: 700, fontSize: 64, lineHeight: 1, color: tone === 'yellow' ? C.amber : STRONG[tone] }}>{letter}</div>
    <div style={{ marginTop: 10, fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </div>
);

const M2_Anatomy: Page = () => (
  <Frame mod={2} beats={6}>
    <Title>Une demande de code en 5 ingrédients</Title>
    <Lede>Contexte, tâche, contraintes, format, exemples. Plus la tâche est risquée, plus chacun compte.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', columnGap: 20 }}>
      <Ingr n={1} letter="C" tone="blue" title="Contexte">
        Langage, version, fichiers, conventions du projet.
      </Ingr>
      <Ingr n={2} letter="T" tone="teal" title="Tâche">
        Un verbe d’action précis : implémente, refactorise, explique.
      </Ingr>
      <Ingr n={3} letter="C" tone="coral" title="Contraintes">
        Ce qui ne doit pas changer : API, tests, dépendances.
      </Ingr>
      <Ingr n={4} letter="F" tone="violet" title="Format">
        Un diff, une fonction, un plan sans code, des tests.
      </Ingr>
      <Ingr n={5} letter="E" tone="green" title="Exemples">
        Une entrée et la sortie attendue, ou un extrait du style voulu.
      </Ingr>
    </div>
    <PromptBox cls={b.on(6)} label="La même demande, avec les 5 ingrédients" size={23} style={{ position: 'absolute', left: 120, top: 610, width: 1680 }}>
      <Strong>C</Strong> Python 3.12, fichier facture.py, montants en cents (entiers). <Strong>T</Strong> Implémente calculer_facture() selon #SPEC.md.{' '}
      <Strong c={C.coral}>C</Strong> Arrondi demi vers le haut, aucune dépendance, ne modifie pas les tests.{' '}
      <Strong c={C.violet}>F</Strong> Une fonction publique et des fonctions privées nommées d’après les règles.{' '}
      <Strong c={C.green}>E</Strong> Panier de 215,97 $ avec BIENVENUE10 → rabais 21,60 $, total 223,48 $.
    </PromptBox>
  </Frame>
);

// ─── M2 · Vague vs structured ───────────────────────────────────────────────
const M2_BeforeAfter: Page = () => (
  <Frame mod={2} kind="demo" beats={2}>
    <Title>Même besoin, deux demandes</Title>
    <Lede>Le code généré reflète exactement ce que vous avez (ou n’avez pas) dit.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 810 }}>
      <PromptBox cls={A.in} label="Demande vague" size={24} style={dl(100)}>
        Fais une fonction qui calcule le total d’une facture avec les taxes.
      </PromptBox>
      <CodeDark cls={b.on(1)} file="facture.py" size={21} style={{ marginTop: 20 }}>
        <Kw>def</Kw> <Fn>total</Fn>(items):{'\n'}
        {'    '}t = <Fn>sum</Fn>(i[<St>"price"</St>] <Kw>for</Kw> i <Kw>in</Kw> items){'\n'}
        <Ln kind="del">
          {'    '}
          <Kw>return</Kw> <Fn>round</Fn>(t * <Nu>1.15</Nu>, <Nu>2</Nu>)
        </Ln>
      </CodeDark>
      <div className={b.on(1)} style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Bullet tone="coral" size={23}>
          Taux inventé (15 %), TPS et TVQ confondues
        </Bullet>
        <Bullet tone="coral" size={23}>
          Nombres à virgule, round() arrondit 0,5 au pair
        </Bullet>
        <Bullet tone="coral" size={23}>
          Ni rabais, ni livraison, ni erreurs
        </Bullet>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 990, top: 270, width: 810 }}>
      <PromptBox cls={A.in} label="Demande structurée + #SPEC.md + tests" size={24} style={dl(200)}>
        … montants en cents, arrondi demi vers le haut, règles de SPEC.md, sans modifier test_facture.py.
      </PromptBox>
      <CodeDark cls={b.on(2)} file="facture.py" size={21} style={{ marginTop: 20 }}>
        <Ln kind="add">
          TAUX_TVQ = (<Nu>9975</Nu>, <Nu>100_000</Nu>){'  '}
          <Cm># 9,975 %</Cm>
        </Ln>
        <Ln kind="add">
          <Kw>def</Kw> <Fn>arrondi</Fn>(num, den): <Kw>return</Kw> (<Nu>2</Nu>*num + den) // (<Nu>2</Nu>*den)
        </Ln>
        <Ln kind="add">
          <Kw>def</Kw> <Fn>calculer_rabais</Fn>(sous_total, code): …
        </Ln>
      </CodeDark>
      <div className={b.on(2)} style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Bullet tone="green" size={23}>
          Chaque règle est nommée et visible
        </Bullet>
        <Bullet tone="green" size={23}>
          Entiers en cents, arrondi exact
        </Bullet>
        <Bullet tone="green" size={23}>
          Les tests disent si c’est juste
        </Bullet>
      </div>
    </div>
  </Frame>
);

// ─── M2 · Project instructions ──────────────────────────────────────────────
const InstrRow = ({ id, file, d }: { id: AppId; file: string; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 16, height: 64, borderBottom: `1.5px solid ${C.rule}`, ...dl(d) }}>
    <AppTile id={id} size={42} />
    <span style={{ width: 210, fontSize: 24, fontWeight: 600, color: C.ink }}>{APPS[id].short}</span>
    <span style={{ fontFamily: mono, fontSize: 22, color: T.blue.fg }}>{file}</span>
  </div>
);

const M2_Instructions: Page = () => (
  <Frame mod={2}>
    <Title>Écrire ses conventions une fois : les instructions de projet</Title>
    <Lede>Un fichier versionné, lu à chaque demande. Toute l’équipe obtient le même comportement.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 800 }}>
      <InstrRow id="copilot" file=".github/copilot-instructions.md" d={100} />
      <InstrRow id="codex" file="AGENTS.md  (standard ouvert)" d={180} />
      <InstrRow id="cursor" file=".cursor/rules/*.mdc" d={260} />
      <InstrRow id="claude" file="CLAUDE.md" d={340} />
      <InstrRow id="junie" file=".junie/guidelines.md" d={420} />
      <Callout cls={A.in} title="Ce qu’on y met" tone="blue" icon="note" size={24} style={{ marginTop: 28, ...dl(500) }}>
        Langages et versions, conventions, commandes de test, règles d’équipe, ce qui est interdit.
      </Callout>
    </div>
    <CodeDark cls={A.right} file=".github/copilot-instructions.md" lang="md" size={20} style={{ position: 'absolute', left: 990, top: 280, width: 810, ...dl(300) }}>
      <Fn>## Règles de l’équipe</Fn>
      {'\n'}- Montants d’argent en entiers (cents).{'\n'}- Requêtes SQL toujours paramétrées.{'\n'}- Aucun secret dans le code.{'\n'}- Lever une exception explicite,{'\n'}
      {'  '}jamais un except vide.{'\n'}
      {'\n'}
      <Fn>## Ne pas faire</Fn>
      {'\n'}- Modifier un test pour le faire passer.{'\n'}- Ajouter une dépendance sans le dire.{'\n'}- Toucher hors du dossier demandé.
    </CodeDark>
    <Hint cls={A.in} style={{ position: 'absolute', left: 990, top: 870, ...dl(600) }}>
      Celui du dépôt des labs : ouvrez-le, il sert aux labs 02, 07 et 11.
    </Hint>
  </Frame>
);

// ─── M2 · Guiding completion ────────────────────────────────────────────────
const M2_Completion: Page = () => (
  <Frame mod={2} beats={3}>
    <Title>Guider la complétion par l’intention</Title>
    <Lede>Le nom, les types, la docstring et un exemple : la suggestion suit ce que vous écrivez avant.</Lede>
    <CodeDark cls={A.in} file="dates.py" lang="python" size={23} style={{ position: 'absolute', left: 120, top: 280, width: 1020, ...dl(100) }}>
      <Kw>def</Kw> <Fn>jours_ouvrables</Fn>(debut: <Ty>date</Ty>, fin: <Ty>date</Ty>) -&gt; <Ty>int</Ty>:{'\n'}
      {'    '}
      <St>"""Nombre de jours du lundi au vendredi entre debut</St>
      {'\n'}
      {'    '}
      <St>et fin inclus. Lève ValueError si fin &lt; debut.</St>
      {'\n'}
      {'\n'}
      {'    '}
      <St>&gt;&gt;&gt; jours_ouvrables(date(2026, 11, 6), date(2026, 11, 9))</St>
      {'\n'}
      {'    '}
      <St>2</St>
      {'\n'}
      {'    '}
      <St>"""</St>
      {'\n'}
      <span className={b.fade(1)}>
        <Ghost>{'    '}if fin &lt; debut:</Ghost>
        {'\n'}
        <Ghost>{'        '}raise ValueError("fin avant debut")</Ghost>
        {'\n'}
        <Ghost>{'    '}jours = (fin - debut).days + 1</Ghost>
        {'\n'}
        <Ghost>{'    '}return sum(1 for i in range(jours)</Ghost>
        {'\n'}
        <Ghost>{'               '}if (debut + timedelta(i)).weekday() &lt; 5)</Ghost>
      </span>
    </CodeDark>
    <div style={{ position: 'absolute', left: 1200, top: 280, width: 600, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card cls={b.on(2)} tone="blue" icon="target" title="Ce qui guide" size={23}>
        Un nom explicite · des types · une docstring qui dit le cas limite · un exemple doctest · les fichiers liés ouverts.
      </Card>
      <Card cls={b.on(3)} tone="coral" icon="eye" title="Ce qu’il faut relire" size={23}>
        Inclus ou exclus ? Fuseau horaire ? Jours fériés ? La suggestion répond à la docstring, pas au métier.
      </Card>
    </div>
  </Frame>
);

// ─── M2 · Contextual completion (pattern continuation) ──────────────────────
const M2_Pattern: Page = () => (
  <Frame mod={2} kind="demo" beats={2}>
    <Title>Autocomplétion contextuelle : elle continue vos motifs</Title>
    <Lede>Deux exemples écrits à la main ; le troisième est proposé. Idéal pour les tests et les tables de données.</Lede>
    <CodeDark cls={A.in} file="test_dates.py" lang="python" size={22} style={{ position: 'absolute', left: 120, top: 280, width: 1100, ...dl(100) }}>
      <Kw>def</Kw> <Fn>test_meme_jour_ouvrable</Fn>():{'\n'}
      {'    '}
      <Kw>assert</Kw> jours_ouvrables(date(<Nu>2026</Nu>, <Nu>11</Nu>, <Nu>2</Nu>), date(<Nu>2026</Nu>, <Nu>11</Nu>, <Nu>2</Nu>)) == <Nu>1</Nu>
      {'\n'}
      {'\n'}
      <Kw>def</Kw> <Fn>test_week_end_seul</Fn>():{'\n'}
      {'    '}
      <Kw>assert</Kw> jours_ouvrables(date(<Nu>2026</Nu>, <Nu>11</Nu>, <Nu>7</Nu>), date(<Nu>2026</Nu>, <Nu>11</Nu>, <Nu>8</Nu>)) == <Nu>0</Nu>
      {'\n'}
      {'\n'}
      <span className={b.fade(1)}>
        <Ghost>def test_fin_avant_debut():</Ghost>
        {'\n'}
        <Ghost>{'    '}with pytest.raises(ValueError):</Ghost>
        {'\n'}
        <Ghost>{'        '}jours_ouvrables(date(2026, 11, 9), date(2026, 11, 6))</Ghost>
      </span>
    </CodeDark>
    <div style={{ position: 'absolute', left: 1280, top: 280, width: 520, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card cls={b.on(1)} tone="green" icon="check" title="Il a lu la docstring" size={23}>
        Le cas « fin &lt; debut » vient du fichier dates.py, ouvert dans un onglet.
      </Card>
      <Card cls={b.on(2)} tone="yellow" icon="bulb" title="Astuce" size={23}>
        Écrivez le nom du test d’abord : test_un_jour_ferie… La suggestion suit le nom.
      </Card>
    </div>
  </Frame>
);

// ─── M2 · Quiz ──────────────────────────────────────────────────────────────
const M2_Quiz: Page = () => (
  <QcmPage
    mod={2}
    n={2}
    title="Quelle demande ?"
    q="Le test test_arrondi échoue après génération. Quelle demande au chat est la plus efficace ?"
    explain="Donnez à l’IA ce qu’elle ne peut pas deviner : le message d’échec, l’attendu et la contrainte. « Corrige » sans contexte relance une prédiction au hasard."
  >
    <Opt why="Trop vague : l’assistant ne sait pas quel test, ni pourquoi. Il risque de réécrire autre chose.">Corrige le code, il y a un bogue.</Opt>
    <Opt ok why="Oui : la trace, l’attendu et la contrainte. L’assistant peut raisonner sur la cause (round arrondit 0,5 au pair).">
      Voici l’échec de test_arrondi (attendu 51, obtenu 50). Explique la cause, sans modifier le test.
    </Opt>
    <Opt why="Piège ! Changer l’attendu du test, c’est masquer le bogue. Le test décrit la spécification.">Modifie test_arrondi pour qu’il accepte 50.</Opt>
    <Opt why="Réécrire tout le fichier efface le travail juste et rend le diff illisible. Ciblez.">Réécris tout facture.py depuis le début.</Opt>
  </QcmPage>
);

// ─── Lab 02 ─────────────────────────────────────────────────────────────────
const L02_Brief: Page = () => (
  <LabBrief
    mod={2}
    n="02"
    title="Générer à partir d’une spécification"
    dur="25 min"
    folder="lab02-generation"
    objective="Rédiger un prompt structuré et utiliser des tests existants comme critère d’acceptation du code généré."
    cmd={
      <>
        <Pr>pytest labs/lab02-generation</Pr>
        {'\n'}
        <Ko>12 failed</Ko>
        {'  '}
        <Cm>au départ</Cm>
        {'\n'}
        <Pr>npm run test:lab02</Pr>
      </>
    }
    deliverable="12 tests verts sans les modifier, et PROMPT.md : votre prompt final et le nombre d’itérations."
  >
    <LabStep n={1} t="3 min" title="Lisez SPEC.md">
      Repérez les 2 règles les plus piégeuses
    </LabStep>
    <LabStep n={2} t="7 min" title="Rédigez PROMPT.md">
      Contexte, tâche, contraintes, format, exemples
    </LabStep>
    <LabStep n={3} t="5 min" title="Générez">
      Avec SPEC.md et le fichier de tests joints au contexte
    </LabStep>
    <LabStep n={4} t="7 min" title="Itérez sur les échecs">
      Collez le message d’échec, pas « corrige »
    </LabStep>
    <LabStep n={5} t="3 min" title="Relisez">
      Chaque règle de la spec est-elle nommée dans le code ?
    </LabStep>
  </LabBrief>
);

const L02_Go: Page = () => (
  <LabGo mod={2} n="02" minutes={25} folder="lab02-generation">
    <CheckItem id="l02-1">Les 2 règles piégeuses repérées dans SPEC.md</CheckItem>
    <CheckItem id="l02-2">PROMPT.md avec les 5 ingrédients</CheckItem>
    <CheckItem id="l02-3">Première génération : combien de tests verts ?</CheckItem>
    <CheckItem id="l02-4">Itérations avec les messages d’échec</CheckItem>
    <CheckItem id="l02-5">12 tests verts, tests intacts</CheckItem>
  </LabGo>
);

// ─── M2 · Refactoring: the safety net ───────────────────────────────────────
const RfStep = ({ n, x, icon, tone, title, children }: { n: number; x: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ position: 'absolute', left: x, top: 300, width: 300, height: 330, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '24px 22px' }}>
    <IconTile name={icon} tone={tone} size={60} />
    <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 30, lineHeight: 1.08, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </div>
);

const M2_Refactor: Page = () => (
  <Frame mod={2} beats={5}>
    <Title>Refactoriser avec l’IA : d’abord le filet de sécurité</Title>
    <Lede>Refactoriser, c’est changer la structure sans changer le comportement. Il faut pouvoir le prouver.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <Arrow x1={425} y1={465} x2={465} y2={465} color={C.faint} w={4} n={2} head={14} />
      <Arrow x1={770} y1={465} x2={810} y2={465} color={C.faint} w={4} n={3} head={14} />
      <Arrow x1={1115} y1={465} x2={1155} y2={465} color={C.faint} w={4} n={4} head={14} />
      <Arrow x1={1460} y1={465} x2={1500} y2={465} color={C.faint} w={4} n={5} head={14} />
      <path d="M 1650 640 C 1650 740, 1300 740, 1300 640" fill="none" stroke={C.green} strokeWidth={4} strokeDasharray="10 12" className={cx(A.march, b.fade(5))} />
    </svg>
    <RfStep n={1} x={120} icon="shield" tone="blue" title="Tests de caractérisation">
      Figer les sorties actuelles (« golden master »), même bizarres.
    </RfStep>
    <RfStep n={2} x={465} icon="search" tone="teal" title="Diagnostic">
      L’IA liste les problèmes, du plus coûteux au moins coûteux. Sans code.
    </RfStep>
    <RfStep n={3} x={810} icon="map" tone="violet" title="Plan en étapes">
      5 étapes maximum, chacune sans changement de comportement.
    </RfStep>
    <RfStep n={4} x={1155} icon="code" tone="yellow" title="Une étape à la fois">
      Demander, relire le diff, lancer les tests.
    </RfStep>
    <RfStep n={5} x={1500} icon="check" tone="green" title="Commit vert">
      Un commit par étape ; sinon git restore et on reformule.
    </RfStep>
    <Callout cls={b.on(5)} title="Le piège n° 1" tone="coral" icon="alert" size={25} style={{ position: 'absolute', left: 120, top: 790, width: 1680 }}>
      « J’en ai profité pour corriger un bogue » : en refactorisation, aucun changement de comportement. On corrige dans un commit séparé, avec son test.
    </Callout>
  </Frame>
);

// ─── M2 · Before / after ────────────────────────────────────────────────────
const M2_Smells: Page = () => (
  <Frame mod={2} kind="demo" beats={2}>
    <Title>Avant / après : ce que l’IA sait bien réécrire</Title>
    <Lede>Noms d’une lettre, if imbriqués, nombres magiques, code dupliqué : des motifs qu’elle reconnaît.</Lede>
    <CodeDark cls={A.in} file="commandes.py · avant" size={20} style={{ position: 'absolute', left: 120, top: 280, width: 800, ...dl(100) }}>
      <Kw>if</Kw> r == <St>"QC"</St>:{'\n'}
      {'    '}
      <Kw>if</Kw> x[<St>"poids"</St>] &lt;= <Nu>2</Nu>:{'\n'}
      {'        '}f = <Nu>8</Nu>
      {'\n'}
      {'    '}
      <Kw>else</Kw>:{'\n'}
      {'        '}
      <Kw>if</Kw> x[<St>"poids"</St>] &lt;= <Nu>10</Nu>:{'\n'}
      {'            '}f = <Nu>15</Nu>
      {'\n'}
      {'        '}
      <Kw>else</Kw>:{'\n'}
      {'            '}f = <Nu>15</Nu> + (x[<St>"poids"</St>] - <Nu>10</Nu>) * <Nu>1.5</Nu>
      {'\n'}
      <Kw>elif</Kw> r == <St>"ON"</St>:{'\n'}
      {'    '}
      <Cm># … le même bloc, avec 10, 18, 1.75</Cm>
    </CodeDark>
    <CodeDark cls={b.on(1)} file="commandes.py · après" size={20} style={{ position: 'absolute', left: 1000, top: 280, width: 800 }}>
      GRILLES = {'{'}
      {'\n'}
      {'    '}
      <St>"QC"</St>: <Ty>Grille</Ty>(leger=<Nu>8</Nu>, moyen=<Nu>15</Nu>, par_kg=<Nu>1.5</Nu>),{'\n'}
      {'    '}
      <St>"ON"</St>: <Ty>Grille</Ty>(leger=<Nu>10</Nu>, moyen=<Nu>18</Nu>, par_kg=<Nu>1.75</Nu>),{'\n'}
      {'}'}
      {'\n'}
      {'\n'}
      <Kw>def</Kw> <Fn>frais_livraison</Fn>(poids, region):{'\n'}
      {'    '}g = GRILLES.get(region, GRILLE_AUTRES){'\n'}
      {'    '}
      <Kw>if</Kw> poids &lt;= POIDS_LEGER: <Kw>return</Kw> g.leger{'\n'}
      {'    '}
      <Kw>if</Kw> poids &lt;= POIDS_MOYEN: <Kw>return</Kw> g.moyen{'\n'}
      {'    '}
      <Kw>return</Kw> g.moyen + (poids - POIDS_MOYEN) * g.par_kg
    </CodeDark>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 770, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: 20 }}>
      <Tag tone="green" size={22}>Complexité : 17 → 4</Tag>
      <Tag tone="green" size={22}>Une région = une ligne</Tag>
      <Tag tone="green" size={22}>Constantes nommées</Tag>
      <Tag tone="coral" size={22}>À vérifier : arrondis et seuils</Tag>
    </div>
  </Frame>
);

// ─── M2 · Refactoring prompts ───────────────────────────────────────────────
const PromptCard = ({ n, title, tone, d, children }: { n: number; title: string; tone: Tone; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 26px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Num n={n} tone={tone} size={44} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{title}</span>
    </div>
    <div style={{ marginTop: 12, fontSize: 23, lineHeight: 1.45, color: C.ink, fontStyle: 'italic', background: T.blue.bg, borderRadius: 12, padding: '12px 16px' }}>{children}</div>
  </div>
);

const M2_RefactorPrompts: Page = () => (
  <Frame mod={2}>
    <Title>Quatre demandes pour refactoriser et optimiser</Title>
    <Lede>Séparer le diagnostic, le plan et l’exécution : vous gardez la main à chaque étape.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 26, rowGap: 24 }}>
      <PromptCard n={1} title="Diagnostic" tone="blue" d={100}>
        « Liste les problèmes de lisibilité et de maintenabilité de traiter(), du plus coûteux au moins coûteux. Pas encore de code. »
      </PromptCard>
      <PromptCard n={2} title="Plan" tone="teal" d={200}>
        « Propose un plan en 5 étapes maximum. Chaque étape doit garder exactement le même comportement. »
      </PromptCard>
      <PromptCard n={3} title="Une étape" tone="violet" d={300}>
        « Applique uniquement l’étape 2. Ne touche ni aux tests ni aux arrondis. Montre-moi le diff. »
      </PromptCard>
      <PromptCard n={4} title="Optimiser" tone="green" d={400}>
        « Quelle est la complexité de cette fonction ? Propose une version plus rapide qui garde le même résultat et l’ordre des éléments. »
      </PromptCard>
    </div>
    <Hint cls={A.in} style={{ position: 'absolute', left: 120, top: 900, ...dl(600) }}>
      Mesurer la complexité avant et après : ruff check --select C901 (Python), règle complexity d’ESLint (TypeScript).
    </Hint>
  </Frame>
);

// ─── Lab 03 ─────────────────────────────────────────────────────────────────
const L03_Brief: Page = () => (
  <LabBrief
    mod={2}
    n="03"
    title="Refactoriser du code hérité, sans rien casser"
    dur="25 min"
    folder="lab03-refactorisation"
    objective="Refactoriser un module hérité par petites étapes vérifiées : l’IA propose, les tests protègent, Git garde chaque étape."
    cmd={
      <>
        <Pr>pytest labs/lab03-refactorisation</Pr>
        {'\n'}
        <Ok>11 passed</Ok>
        {'  '}
        <Cm>doivent le rester</Cm>
        {'\n'}
        <Pr>ruff check --select C901 …</Pr>
        {'\n'}
        <Ko>C901 traiter is too complex (17)</Ko>
      </>
    }
    deliverable="Tests toujours verts et intacts, 3 à 5 commits « refactor: … », traiter sous le seuil de complexité 8."
  >
    <LabStep n={1} t="5 min" title="Diagnostic">
      Faites lister les problèmes ; notez la complexité de départ
    </LabStep>
    <LabStep n={2} t="3 min" title="Plan">
      5 étapes au plus : validez-les ou réordonnez-les vous-même
    </LabStep>
    <LabStep n={3} t="15 min" title="Une étape, un diff, un test, un commit">
      Si un test casse : git restore . et reformulez
    </LabStep>
    <LabStep n={4} t="2 min" title="Bilan">
      ruff check --select C901 : traiter ne doit plus apparaître
    </LabStep>
  </LabBrief>
);

const L03_Go: Page = () => (
  <LabGo mod={2} n="03" minutes={25} folder="lab03-refactorisation">
    <CheckItem id="l03-1">Diagnostic obtenu, complexité de départ notée (17)</CheckItem>
    <CheckItem id="l03-2">Plan validé : 5 étapes au plus</CheckItem>
    <CheckItem id="l03-3">Étapes 1 et 2 : tests verts, commits faits</CheckItem>
    <CheckItem id="l03-4">Étapes 3 à 5 : tests verts, commits faits</CheckItem>
    <CheckItem id="l03-5">traiter sous le seuil de complexité</CheckItem>
  </LabGo>
);

// ─── M2 · Prompt best practices (flip cards) ────────────────────────────────
const BadGood = ({ bad, good, why }: { bad: ReactNode; good: ReactNode; why: ReactNode }) => (
  <FlipCard
    w={405}
    h={500}
    tone="coral"
    backTone="green"
    front={
      <>
        <Eyebrow c={C.coral} size={20}>
          Demande à améliorer
        </Eyebrow>
        <div style={{ marginTop: 16, fontSize: 28, lineHeight: 1.35, color: C.ink, fontStyle: 'italic' }}>{bad}</div>
      </>
    }
    back={
      <>
        <Eyebrow c={T.green.fg} size={20}>
          Mieux
        </Eyebrow>
        <div style={{ marginTop: 10, fontSize: 23, lineHeight: 1.4, color: C.ink, fontStyle: 'italic' }}>{good}</div>
        <div style={{ marginTop: 'auto', fontSize: 21, lineHeight: 1.35, color: T.green.fg }}>{why}</div>
      </>
    }
  />
);

const M2_Practices: Page = () => (
  <Frame mod={2} kind="exercice">
    <Title>Bonnes pratiques : réécrivez ces demandes</Title>
    <Lede>Proposez une meilleure version à voix haute, puis je retourne la carte.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 405px)', columnGap: 20, ...dl(100) }}>
      <BadGood
        bad="Améliore ce code."
        good="Réduis la complexité de traiter() sans changer son comportement ; les tests de caractérisation doivent rester verts."
        why="Un critère mesurable remplace « améliore »."
      />
      <BadGood
        bad="Écris-moi toute l’API de réservation."
        good="Propose d’abord la liste des routes et les modèles de données. Ensuite, une route à la fois, avec ses tests."
        why="Petites étapes relisibles."
      />
      <BadGood
        bad="Pourquoi ça plante ?"
        good="Voici la trace complète et le code de taux_occupation(). Explique la cause racine en 3 phrases, sans corriger."
        why="La trace et l’attendu valent mieux que toute paraphrase."
      />
      <BadGood
        bad="Fais des tests."
        good="Liste d’abord les comportements à tester : nominaux, limites, erreurs. Puis des tests pytest paramétrés."
        why="Penser avant d’écrire."
      />
    </div>
  </Frame>
);

// ─── M2 · Synthesis ─────────────────────────────────────────────────────────
const M2_Synth: Page = () => (
  <SynthPage
    mod={2}
    title="Module 2 · Ce qu’il faut retenir"
    poste={<>Créez le fichier d’instructions de votre projet avec 5 règles. Gardez un canevas de prompt à portée de main. Pour votre prochaine refactorisation : tests de caractérisation d’abord.</>}
  >
    <SynthRow n={1} tone="blue" d={100}>
      Contexte, tâche, contraintes, format, exemples
    </SynthRow>
    <SynthRow n={2} tone="teal" d={200}>
      Les tests existants sont le meilleur critère d’acceptation
    </SynthRow>
    <SynthRow n={3} tone="violet" d={300}>
      Instructions de projet : écrire ses conventions une fois
    </SynthRow>
    <SynthRow n={4} tone="green" d={400}>
      La complétion suit le nom, les types et la docstring
    </SynthRow>
    <SynthRow n={5} tone="yellow" d={500}>
      Refactoriser : filet de tests, petites étapes, un commit par étape
    </SynthRow>
  </SynthPage>
);

// ─── Module 3 divider ───────────────────────────────────────────────────────
const M3_Divider: Page = () => (
  <Section n={3} title="Débogage et optimisation avec l’IA" sub="Trouver la cause, corriger, accélérer… et savoir quand ne pas faire confiance." dur="≈ 1 h 45">
    <SecItem n={1}>Détection automatique des erreurs</SecItem>
    <SecItem n={2}>Suggestions de correction et explications</SecItem>
    <SecItem n={3}>Optimiser les performances, réduire la complexité</SecItem>
    <SecItem n={4}>Limites et validation humaine</SecItem>
  </Section>
);
M3_Divider.transition = BLOOM;

// ═══ 30-m3 ═════════════════════════════════════════════════════════════

// ─── M3 · Debugging method ──────────────────────────────────────────────────
const DbgStep = ({ n, icon, tone, title, ai, children }: { n: number; icon: IconName; tone: Tone; title: string; ai: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ boxSizing: 'border-box', height: 470, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '24px 22px', display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={n} tone={tone} size={40} />
      <IconTile name={icon} tone={tone} size={48} />
    </div>
    <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</div>
    <div style={{ marginTop: 'auto', background: T.violet.bg, borderRadius: 12, padding: '10px 14px', fontSize: 20, lineHeight: 1.35, color: T.violet.fg }}>
      <strong>IA :</strong> {ai}
    </div>
  </div>
);

const M3_Method: Page = () => (
  <Frame mod={3} beats={6}>
    <Title>Déboguer avec l’IA : une méthode en 6 étapes</Title>
    <Lede>L’IA accélère chaque étape. Elle ne remplace aucune d’entre elles.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', columnGap: 16 }}>
      <DbgStep n={1} icon="play" tone="blue" title="Reproduire" ai="écrire le script ou le test qui reproduit">
        Un cas minimal, toujours le même résultat.
      </DbgStep>
      <DbgStep n={2} icon="filter" tone="teal" title="Isoler" ai="résumer une trace de 200 lignes">
        La plus petite entrée qui échoue.
      </DbgStep>
      <DbgStep n={3} icon="chat" tone="violet" title="Expliquer" ai="expliquer la trace et le code">
        Comprendre avant de toucher au code.
      </DbgStep>
      <DbgStep n={4} icon="bulb" tone="yellow" title="Hypothèses" ai="proposer 2 ou 3 causes possibles">
        Les vérifier une par une, en lisant ou en traçant.
      </DbgStep>
      <DbgStep n={5} icon="tool" tone="coral" title="Corriger" ai="proposer des corrections et leurs limites">
        Traiter la cause, pas le symptôme.
      </DbgStep>
      <DbgStep n={6} icon="shieldCheck" tone="green" title="Prouver" ai="écrire le test de non-régression">
        Un test qui échoue sans la correction.
      </DbgStep>
    </div>
  </Frame>
);

// ─── M3 · What to give the assistant ────────────────────────────────────────
const M3_Context: Page = () => (
  <Frame mod={3} kind="demo" beats={2}>
    <Title>Donner à l’IA ce qu’elle ne peut pas deviner</Title>
    <Lede>La trace complète, le code, l’attendu et l’obtenu. Puis demander une explication, pas un correctif.</Lede>
    <Term cls={A.in} title="python tableau_de_bord.py" size={19} style={{ position: 'absolute', left: 120, top: 280, width: 900, ...dl(100) }}>
      Occupation des salles · lundi 2 novembre{'\n'}
      {'  '}A-101 : 60%{'\n'}
      {'  '}A-102 : 10%{'\n'}
      <Ko>Traceback (most recent call last):</Ko>
      {'\n'}
      {'  '}File "tableau_de_bord.py", line 22, in afficher{'\n'}
      {'  '}File "reservations.py", line 48, in taux_occupation{'\n'}
      {'    '}return round(heures / (heures_ouvertes * len(jours)), 2){'\n'}
      <Ko>ZeroDivisionError: division by zero</Ko>
    </Term>
    <PromptBox cls={A.in} label="Votre demande" size={23} style={{ position: 'absolute', left: 120, top: 640, width: 900, ...dl(250) }}>
      Voici la trace complète et reservations.py (#file). Attendu : 0 % pour une salle sans réservation. Explique la cause racine en 3 phrases, puis propose 2 corrections avec leurs inconvénients. Pas encore de code.
    </PromptBox>
    <AnswerBox cls={b.on(1)} id="copilot" size={22} style={{ position: 'absolute', left: 1080, top: 280, width: 720 }}>
      <strong>Cause :</strong> pour B-204, aucune réservation, donc l’ensemble jours est vide : len(jours) vaut 0.
      <br />
      <strong>Option 1 :</strong> retourner 0 si la salle n’a aucune réservation (au début de la fonction).
      <br />
      <strong>Option 2 :</strong> try/except ZeroDivisionError → 0. Simple, mais masque d’autres erreurs.
    </AnswerBox>
    <Callout cls={b.on(2)} title="Votre décision" tone="green" icon="humanCheck" size={24} style={{ position: 'absolute', left: 1080, top: 640, width: 720 }}>
      Option 1 : elle traite la cause (« pas de jour ») et documente le cas. Puis un test qui le prouve.
    </Callout>
  </Frame>
);

// ─── M3 · Automatic error detection: layers ─────────────────────────────────
const Layer = ({ n, w, tone, icon, title, ex }: { n: number; w: number; tone: Tone; icon: IconName; title: string; ex: string }) => (
  <div className={b.on(n)} style={{ width: w, height: 104, boxSizing: 'border-box', margin: '0 auto', display: 'flex', alignItems: 'center', gap: 18, background: T[tone].bg, borderRadius: 14, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, padding: '0 26px' }}>
    <IconTile name={icon} tone={tone} size={54} solid />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 21, color: T[tone].fg }}>{ex}</div>
    </div>
  </div>
);

const M3_Detection: Page = () => (
  <Frame mod={3} beats={5}>
    <Title>Détecter les erreurs automatiquement : des filets superposés</Title>
    <Lede>L’IA ajoute une couche ; les outils déterministes restent la base.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1100, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Layer n={5} w={620} tone="green" icon="gear" title="CI : à chaque push" ex="tous les filets, sur chaque pull request" />
      <Layer n={4} w={740} tone="violet" icon="sparkles" title="IA : expliquer et proposer" ex="« Expliquer l’erreur », /fix, revue de PR" />
      <Layer n={3} w={860} tone="coral" icon="check" title="Tests" ex="pytest, node --test : le comportement" />
      <Layer n={2} w={980} tone="teal" icon="code" title="Typage" ex="mypy, pyright, tsc --strict : les incohérences" />
      <Layer n={1} w={1100} tone="blue" icon="search" title="Analyse statique dans l’IDE" ex="ruff, ESLint : erreurs, failles connues, complexité" />
    </div>
    <div className={b.on(5)} style={{ position: 'absolute', left: 1290, top: 260, width: 510 }}>
      <Card tone="yellow" icon="bulb" title="Le bon usage de l’IA" size={24}>
        Elle explique un avertissement obscur, propose la correction, écrit le test manquant. Elle ne remplace pas le linter, qui ne se trompe pas et ne coûte rien.
      </Card>
    </div>
  </Frame>
);

// ─── M3 · Symptom vs cause ──────────────────────────────────────────────────
const M3_Symptom: Page = () => (
  <Frame mod={3} beats={2}>
    <Title>Corriger la cause, pas le symptôme</Title>
    <Lede>La correction la plus courte proposée par l’IA est souvent un pansement.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 810 }}>
      <Tag tone="coral" size={22}>
        Pansement
      </Tag>
      <CodeDark size={21} style={{ marginTop: 14 }}>
        <Kw>def</Kw> <Fn>taux_occupation</Fn>(reservations, salle):{'\n'}
        <Ln kind="add">
          {'    '}
          <Kw>try</Kw>:
        </Ln>
        {'        '}…{'\n'}
        {'        '}
        <Kw>return</Kw> <Fn>round</Fn>(heures / (h * <Fn>len</Fn>(jours)), <Nu>2</Nu>){'\n'}
        <Ln kind="add">
          {'    '}
          <Kw>except</Kw> <Ty>Exception</Ty>:
        </Ln>
        <Ln kind="add">
          {'        '}
          <Kw>return</Kw> <Nu>0</Nu>
        </Ln>
      </CodeDark>
      <div className={b.on(1)} style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Bullet tone="coral" size={23}>
          Avale aussi les vraies erreurs (clé absente, None…)
        </Bullet>
        <Bullet tone="coral" size={23}>
          Le prochain bogue affichera « 0 % » sans bruit
        </Bullet>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 990, top: 280, width: 810 }}>
      <Tag tone="green" size={22}>
        Cause traitée
      </Tag>
      <CodeDark size={21} style={{ marginTop: 14 }}>
        <Kw>def</Kw> <Fn>taux_occupation</Fn>(reservations, salle):{'\n'}
        {'    '}de_la_salle = [r <Kw>for</Kw> r <Kw>in</Kw> reservations <Kw>if</Kw> …]{'\n'}
        <Ln kind="add">
          {'    '}
          <Kw>if</Kw> <Kw>not</Kw> de_la_salle:{'  '}
          <Cm># aucune réservation</Cm>
        </Ln>
        <Ln kind="add">
          {'        '}
          <Kw>return</Kw> <Nu>0.0</Nu>
        </Ln>
        {'    '}jours = {'{'}r.debut.date() <Kw>for</Kw> r <Kw>in</Kw> de_la_salle{'}'}
        {'\n'}
        {'    '}…
      </CodeDark>
      <div className={b.on(2)} style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Bullet tone="green" size={23}>
          Le cas métier est explicite et documenté
        </Bullet>
        <Bullet tone="green" size={23}>
          Les autres erreurs restent visibles
        </Bullet>
      </div>
    </div>
  </Frame>
);

// ─── Lab 04 ─────────────────────────────────────────────────────────────────
const L04_Brief: Page = () => (
  <LabBrief
    mod={3}
    n="04"
    title="Chasse aux bogues avec l’IA"
    dur="25 min"
    folder="lab04-debogage"
    objective="Déboguer méthodiquement : reproduire, faire expliquer, formuler des hypothèses, corriger, puis prouver par un test de non-régression."
    cmd={
      <>
        <Pr>pytest labs/lab04-debogage</Pr>
        {'\n'}
        <Ok>4 passed</Ok>, <Ko>5 failed</Ko>
        {'\n'}
        <Pr>npm run test:lab04</Pr>
      </>
    }
    deliverable="9 tests verts (INC-105 en bonus), un commit par ticket avec la cause racine dans le message."
  >
    <LabStep n={1} t="3 min" title="Reproduire INC-101">
      Lancez tableau_de_bord : vous obtenez la trace du rapport d’incidents
    </LabStep>
    <LabStep n={2} t="5 min" title="Faire expliquer, pas corriger">
      Trace complète + code : cause racine et 2 corrections. Vous choisissez.
    </LabStep>
    <LabStep n={3} t="12 min" title="Un ticket à la fois">
      INC-102 à 104 : symptôme + test rouge → hypothèse → vérification
    </LabStep>
    <LabStep n={4} t="5 min" title="Non-régression">
      git stash : le test redevient rouge ? git stash pop.
    </LabStep>
  </LabBrief>
);

const L04_Go: Page = () => (
  <LabGo mod={3} n="04" minutes={25} folder="lab04-debogage">
    <CheckItem id="l04-1">INC-101 reproduit, cause racine expliquée</CheckItem>
    <CheckItem id="l04-2">INC-102 : pagination sans doublon</CheckItem>
    <CheckItem id="l04-3">INC-103 : réservations bout à bout acceptées</CheckItem>
    <CheckItem id="l04-4">INC-104 : arrondi au cent supérieur (sans + 0.0001)</CheckItem>
    <CheckItem id="l04-5">Bonus INC-105 : réservation sur deux jours</CheckItem>
  </LabGo>
);

// ─── M3 · Complexity, measured ──────────────────────────────────────────────
const TimeBar = ({ label, s, max, tone, n, txt }: { label: string; s: number; max: number; tone: Tone; n: number; txt: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 64 }}>
    <span style={{ width: 210, fontSize: 24, color: C.ink, textAlign: 'right' }}>{label}</span>
    <div style={{ flex: 1, height: 40, background: C.panel, borderRadius: 8 }}>
      <div className={b.grow(n)} style={{ width: `${Math.max(0.4, (s / max) * 100)}%`, height: '100%', background: STRONG[tone], borderRadius: 8 }} />
    </div>
    <span className={b.fade(n)} style={{ width: 120, fontFamily: mono, fontSize: 23, color: tone === 'green' ? C.green : C.ink }}>
      {txt}
    </span>
  </div>
);

const M3_Complexity: Page = () => (
  <Frame mod={3} beats={3}>
    <Title>Optimiser : quand la taille double, le temps fait ×4</Title>
    <Lede>Fonction communs() du lab 05, mesurée sur un portable : un « in » sur une liste, dans une boucle.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1100 }}>
      <Eyebrow c={C.coral}>Avant · O(n²)</Eyebrow>
      <div style={{ marginTop: 12 }}>
        <TimeBar label="2 000 courriels" s={0.104} max={12.4} tone="coral" n={1} txt="0,10 s" />
        <TimeBar label="4 000" s={0.433} max={12.4} tone="coral" n={1} txt="0,43 s" />
        <TimeBar label="8 000" s={1.896} max={12.4} tone="coral" n={1} txt="1,90 s" />
        <TimeBar label="20 000" s={12.4} max={12.4} tone="coral" n={1} txt="12,4 s" />
      </div>
      <Eyebrow c={C.green} style={{ marginTop: 34 }}>
        Après · O(n), un ensemble (set)
      </Eyebrow>
      <div style={{ marginTop: 12 }}>
        <TimeBar label="20 000" s={0.017} max={12.4} tone="green" n={2} txt="0,02 s" />
        <TimeBar label="200 000" s={0.268} max={12.4} tone="green" n={2} txt="0,27 s" />
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1290, top: 280, width: 510, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Stat cls={b.on(2)} value="×700" label="plus rapide à 20 000 courriels" tone="green" size={110} />
      <Card cls={b.on(3)} tone="blue" icon="bulb" title="Ce que l’IA voit bien" size={23}>
        Les recherches dans une liste, les count() dans une boucle, les requêtes N+1. Demandez-lui la complexité, ligne par ligne.
      </Card>
    </div>
  </Frame>
);

// ─── M3 · Measure first ─────────────────────────────────────────────────────
const M3_Measure: Page = () => (
  <Frame mod={3}>
    <Title>Mesurer avant, mesurer après</Title>
    <Lede>« C’est plus rapide » sans mesure n’est pas une preuve. Le profileur dit où chercher.</Lede>
    <Term cls={A.in} title="python -m cProfile -s cumtime bench.py" size={20} style={{ position: 'absolute', left: 120, top: 280, width: 1000, ...dl(100) }}>
      {'   ncalls  cumtime  filename:lineno(function)\n'}
      {'        3   14.912  analyse.py:31(communs)\n'}
      <Ko>{'     4000   12.871  analyse.py:13(dedoublonner)'}</Ko>
      {'\n'}
      {'        3    0.191  analyse.py:21(top_domaines)\n'}
      {'    80000    0.031  analyse.py:7(normaliser)'}
    </Term>
    <div style={{ position: 'absolute', left: 120, top: 560, width: 1000, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 20 }}>
      <Card cls={A.in} tone="blue" icon="gauge" title="1 · Mesurer" size={22} style={dl(200)}>
        Banc d’essai à plusieurs tailles, profileur.
      </Card>
      <Card cls={A.in} tone="violet" icon="sparkles" title="2 · Proposer" size={22} style={dl(300)}>
        L’IA explique la ligne coûteuse et propose mieux.
      </Card>
      <Card cls={A.in} tone="green" icon="check" title="3 · Prouver" size={22} style={dl(400)}>
        Mêmes tests de comportement, nouveau chrono.
      </Card>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1190, top: 280, width: 610, ...dl(500) }}>
      <Card tone="coral" icon="alert" title="Les pièges classiques" size={23}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
          <Bullet tone="coral" size={22}>
            list(set(x)) : rapide, mais l’ordre est perdu
          </Bullet>
          <Bullet tone="coral" size={22}>
            Micro-optimisations qui ne changent pas un O(n²)
          </Bullet>
          <Bullet tone="coral" size={22}>
            Cache ajouté sans invalidation
          </Bullet>
          <Bullet tone="coral" size={22}>
            Code illisible pour gagner 3 %
          </Bullet>
        </div>
      </Card>
    </div>
  </Frame>
);

// ─── Lab 05 ─────────────────────────────────────────────────────────────────
const L05_Brief: Page = () => (
  <LabBrief
    mod={3}
    n="05"
    title="Optimiser avec l’IA… et le prouver"
    dur="20 min"
    folder="lab05-performance"
    objective="Faire analyser la complexité par l’IA, appliquer l’optimisation, puis mesurer le gain sans changer le comportement."
    cmd={
      <>
        <Pr>python …/python/bench.py</Pr>
        {'\n'}
        <Pr>pytest labs/lab05-performance</Pr>
        {'\n'}
        <Ok>6 passed</Ok>, <Ko>2 failed</Ko>
        {'  '}
        <Cm>budgets de temps</Cm>
      </>
    }
    deliverable="Tous les tests verts, dont les 2 budgets de temps, et un tableau avant / après dans NOTES.md."
  >
    <LabStep n={1} t="3 min" title="Mesurer d’abord">
      Banc d’essai : quand la taille double, ×2 ou ×4 ?
    </LabStep>
    <LabStep n={2} t="5 min" title="Faire analyser">
      Complexité de chaque fonction, ligne responsable, version O(n) qui garde l’ordre
    </LabStep>
    <LabStep n={3} t="7 min" title="Appliquer et vérifier">
      Une fonction à la fois, tests de comportement après chacune
    </LabStep>
    <LabStep n={4} t="5 min" title="Mesurer après">
      Banc d’essai, puis 200 000 courriels : les budgets passent ?
    </LabStep>
  </LabBrief>
);

const L05_Go: Page = () => (
  <LabGo mod={3} n="05" minutes={20} folder="lab05-performance">
    <CheckItem id="l05-1">Mesure de départ notée (3 tailles)</CheckItem>
    <CheckItem id="l05-2">Complexité de chaque fonction expliquée</CheckItem>
    <CheckItem id="l05-3">dedoublonner et communs en O(n), ordre conservé</CheckItem>
    <CheckItem id="l05-4">top_domaines : égalités par ordre alphabétique</CheckItem>
    <CheckItem id="l05-5">Budgets de temps verts, tableau avant / après</CheckItem>
  </LabGo>
);

// ─── M3 · Limits: hallucinations ────────────────────────────────────────────
const Halluc = ({ icon, tone, title, d, children }: { icon: IconName; tone: Tone; title: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ boxSizing: 'border-box', height: 270, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '24px 26px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={54} />
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{title}</div>
    </div>
    <div style={{ marginTop: 12, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </div>
);

const M3_Hallucinations: Page = () => (
  <Frame mod={3}>
    <Title>Limites : ce que l’IA invente avec aplomb</Title>
    <Lede>Le code est syntaxiquement parfait. C’est justement ce qui rend l’erreur difficile à voir.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1080, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 24, rowGap: 24 }}>
      <Halluc icon="code" tone="coral" title="API inventées" d={100}>
        Une méthode ou une option qui « devrait » exister : read_excelx(), un paramètre timeout imaginaire.
      </Halluc>
      <Halluc icon="archive" tone="coral" title="Paquets fantômes" d={200}>
        Un nom de paquet plausible… qu’un attaquant peut publier ensuite (« slopsquatting »).
      </Halluc>
      <Halluc icon="clock" tone="yellow" title="Connaissances datées" d={300}>
        Une API dépréciée, une version ancienne : le modèle a une date de coupure.
      </Halluc>
      <Halluc icon="chat" tone="yellow" title="Fausse certitude" d={400}>
        « Ce code est thread-safe » : une affirmation n’est pas une preuve.
      </Halluc>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1260, top: 270, width: 540, ...dl(500) }}>
      <Stat value={<CountUp to={19.7} digits={1} suffix=" %" />} label="des paquets cités dans du code généré n’existaient pas (576 000 extraits, 16 modèles)" tone="coral" size={110} />
      <Callout title="Réflexe" tone="blue" icon="search" size={23} style={{ marginTop: 28 }}>
        Avant d’installer un paquet proposé : il existe, il est maintenu, c’est bien celui de la documentation officielle.
      </Callout>
    </div>
    <Src y={950}>Spracklen et al., « We Have a Package for You! », USENIX Security 2025.</Src>
  </Frame>
);

// ─── M3 · Limits: security and data ─────────────────────────────────────────
const M3_Security: Page = () => (
  <Frame mod={3}>
    <Title>Limites : sécurité et confidentialité</Title>
    <Lede>Le modèle reproduit les motifs qu’il a lus, y compris les mauvais.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 520, ...dl(100) }}>
      <Stat value={<CountUp to={45} suffix=" %" />} label="des extraits de code générés contenaient une faille du Top 10 OWASP" tone="coral" size={130} />
    </div>
    <div style={{ position: 'absolute', left: 700, top: 280, width: 1100, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 24, rowGap: 20 }}>
      <Card cls={A.in} tone="coral" icon="database" title="Injection" size={22} style={dl(200)}>
        Requêtes SQL ou commandes construites par concaténation.
      </Card>
      <Card cls={A.in} tone="coral" icon="key" title="Secrets et crypto" size={22} style={dl(300)}>
        Clé en dur, MD5 pour des mots de passe, aléatoire non sûr.
      </Card>
      <Card cls={A.in} tone="yellow" icon="lock" title="Vos données" size={22} style={dl(400)}>
        Ce que vous collez part chez le fournisseur : suivez la politique de votre entreprise.
      </Card>
      <Card cls={A.in} tone="yellow" icon="scale" title="Licences" size={22} style={dl(500)}>
        Activez le filtre de code public si l’outil le propose ; attention aux longs extraits recopiés.
      </Card>
    </div>
    <Callout cls={A.in} title="Conséquence" tone="blue" icon="shieldCheck" size={25} style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(600) }}>
      Le code généré passe par les mêmes contrôles que le vôtre : revue, analyse statique, tests de sécurité. On le pratique au lab 07.
    </Callout>
    <Src y={950}>Veracode, 2025 GenAI Code Security Report (plus de 100 modèles, 80 tâches).</Src>
  </Frame>
);

// ─── M3 · Human validation checklist ────────────────────────────────────────
const M3_Validate: Page = () => (
  <Frame mod={3}>
    <Title>Valider avant d’accepter : la checklist</Title>
    <Lede>Cinq questions avant chaque Tab, chaque diff, chaque fusion. Elles sont dans le guide PDF.</Lede>
    <Checklist cls={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1080, ...dl(100) }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="v1" size={28}>
          Je comprends chaque ligne, et je saurais l’expliquer en revue
        </CheckItem>
        <CheckItem id="v2" size={28}>
          Les tests passent, et l’un d’eux échoue si je casse le code
        </CheckItem>
        <CheckItem id="v3" size={28}>
          Les API, options et paquets cités existent vraiment
        </CheckItem>
        <CheckItem id="v4" size={28}>
          Pas de faille évidente : entrées, secrets, SQL, chemins
        </CheckItem>
        <CheckItem id="v5" size={28}>
          Le diff ne touche que ce que j’ai demandé
        </CheckItem>
      </div>
    </Checklist>
    <div className={A.right} style={{ position: 'absolute', left: 1260, top: 280, width: 540, ...dl(300) }}>
      <Quote by="Règle de l’équipe, à afficher">Vous êtes l’auteur du code que vous fusionnez, quel que soit celui qui l’a tapé.</Quote>
    </div>
  </Frame>
);

// ─── M3 · Quiz ──────────────────────────────────────────────────────────────
const M3_Quiz: Page = () => (
  <QcmPage
    mod={3}
    n={3}
    title="Un paquet inconnu"
    q="L’agent propose : pip install fastapi-jwt-helpers. Vous ne connaissez pas ce paquet. Que faites-vous ?"
    explain="Un paquet proposé par l’IA peut ne pas exister, ou avoir été publié par un attaquant sous ce nom plausible. Vérifiez l’existence, le mainteneur et l’usage avant toute installation."
  >
    <Opt why="Piège ! Installer d’abord, c’est exécuter du code inconnu sur votre poste (scripts d’installation).">
      J’installe et je regarde si les tests passent
    </Opt>
    <Opt ok why="Oui : page du paquet, dépôt source, mainteneur, téléchargements, date. Et la documentation officielle de FastAPI pour l’authentification.">
      Je vérifie qu’il existe, qui le maintient et s’il est vraiment utilisé
    </Opt>
    <Opt why="Le demander à la même IA ne prouve rien : elle peut confirmer son invention avec aplomb.">Je demande à l’agent si le paquet est fiable</Opt>
    <Opt why="Un nom proche d’un paquet connu est justement la technique d’attaque (typosquatting).">
      Il ressemble à un paquet connu, donc c’est bon
    </Opt>
  </QcmPage>
);

// ─── M3 · Synthesis ─────────────────────────────────────────────────────────
const M3_Synth: Page = () => (
  <SynthPage
    mod={3}
    title="Module 3 · Ce qu’il faut retenir"
    poste={<>Au prochain bogue : collez la trace complète et demandez une explication, pas un correctif. Et ajoutez la checklist « valider avant d’accepter » au modèle de pull request de votre équipe.</>}
  >
    <SynthRow n={1} tone="blue" d={100}>
      Reproduire, isoler, expliquer, hypothèses, corriger, prouver
    </SynthRow>
    <SynthRow n={2} tone="teal" d={200}>
      Donner la trace, l’attendu et l’obtenu ; demander une explication
    </SynthRow>
    <SynthRow n={3} tone="coral" d={300}>
      Traiter la cause, pas le symptôme ; un test de non-régression
    </SynthRow>
    <SynthRow n={4} tone="green" d={400}>
      Optimiser : mesurer avant, mesurer après, mêmes tests
    </SynthRow>
    <SynthRow n={5} tone="yellow" d={500}>
      API inventées, paquets fantômes, failles : on valide toujours
    </SynthRow>
  </SynthPage>
);

// ─── Day 1 wrap-up ──────────────────────────────────────────────────────────
const J1Mod = ({ n, tone, title, labs, d, children }: { n: number; tone: Tone; title: string; labs: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ boxSizing: 'border-box', height: 420, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '30px 30px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Num n={pad(n)} tone={tone} size={56} />
      <Tag tone="green" size={20}>
        {labs}
      </Tag>
    </div>
    <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.1, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 12, fontSize: 25, lineHeight: 1.45, color: C.soft }}>{children}</div>
  </div>
);

const J1_Wrap: Page = () => (
  <Frame mod={3} kind="synthese" label="Bilan du jour 1">
    <Title>Bilan du jour 1</Title>
    <Lede>Ce matin, comprendre et générer. Cet après-midi, réécrire, déboguer, optimiser, valider.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 30 }}>
      <J1Mod n={1} tone="blue" title="Panorama" labs="Labs 00, 01" d={100}>
        Un modèle qui prédit, un contexte qui guide, 4 modes d’autonomie croissante.
      </J1Mod>
      <J1Mod n={2} tone="teal" title="Générer, réécrire" labs="Labs 02, 03" d={220}>
        Cinq ingrédients, les tests comme critère, la refactorisation en petites étapes.
      </J1Mod>
      <J1Mod n={3} tone="coral" title="Déboguer, optimiser" labs="Labs 04, 05" d={340}>
        Expliquer avant de corriger, mesurer avant d’optimiser, valider toujours.
      </J1Mod>
    </div>
    <Callout cls={A.in} title="Demain" tone="green" icon="calendar" size={27} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(500) }}>
      Documentation et revue, tests et CI/CD, architecture et planification, puis le projet final avec un agent.
    </Callout>
  </Frame>
);

const Ticket = ({ n, icon, tone, title, children }: { n: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={A.in} style={{ boxSizing: 'border-box', height: 330, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '30px 30px', ...dl(n * 140) }}>
    <IconTile name={icon} tone={tone} size={72} solid />
    <div style={{ marginTop: 20, fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.1, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 10, fontSize: 25, lineHeight: 1.45, color: C.soft }}>{children}</div>
  </div>
);

const J1_Exit: Page = () => (
  <Frame mod={3} label="Fin du jour 1">
    <Title>Billet de sortie</Title>
    <Lede>Avant de partir : trois réponses courtes, chacun à son tour, au micro.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 30 }}>
      <Ticket n={1} icon="bulb" tone="blue" title="Une chose apprise">
        Ce qui vous a le plus surpris aujourd’hui.
      </Ticket>
      <Ticket n={2} icon="chat" tone="violet" title="Une question">
        Ce qui reste flou : on y répond demain matin.
      </Ticket>
      <Ticket n={3} icon="rocket" tone="green" title="Un essai ce soir">
        Une demande en 5 ingrédients sur un vrai ticket.
      </Ticket>
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
// Code → tests → pipeline: three tiles linked by marching arrows.
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
        Formation IA132 · Jour 2
      </Eyebrow>
      <h1 className={A.in} style={{ margin: '18px 0 0', fontFamily: display, fontWeight: 700, fontSize: 118, lineHeight: 1.0, letterSpacing: '-0.01em', color: C.ink, ...dl(120) }}>
        IA pour
        <br />
        développeurs
      </h1>
      <div className={A.in} style={{ marginTop: 46, display: 'inline-flex', alignItems: 'stretch', background: C.card, borderRadius: 14, boxShadow: SHADOW, overflow: 'hidden', ...dl(300) }}>
        <span style={{ display: 'flex', alignItems: 'center', padding: '0 24px', background: G.green, color: '#fff', fontFamily: display, fontWeight: 700, fontSize: 34, letterSpacing: '0.08em' }}>JOUR 2</span>
        <span style={{ padding: '16px 28px', fontSize: 30, fontWeight: 500, color: C.ink }}>Qualité, conception et projet complet</span>
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
    <J2Tile x={1080} y={345} icon="code" tone="violet" label="CODE" d={500} />
    <J2Tile x={1330} y={345} icon="check" tone="blue" label="TESTS" d={800} />
    <J2Tile x={1580} y={345} icon="rocket" tone="green" label="PIPELINE" d={1100} />
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
    back={<div style={{ fontSize: 27, lineHeight: 1.45, color: C.ink }}>{a}</div>}
  />
);

const J2_Recall: Page = () => (
  <Frame mod={0} kind="qcm" label="Jour 2 · Réactivation">
    <Title>Cinq questions pour se réveiller</Title>
    <Lede>Répondez au micro, puis je retourne la carte. Et vos questions d’hier ?</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 530px)', rowGap: 30, columnGap: 45, ...dl(150) }}>
      <J2Flip n={1} q="Comment un assistant choisit-il le code qu’il propose ?" a={<>Il prédit la suite la plus <b>probable</b>. Plausible n’est pas prouvé.</>} />
      <J2Flip n={2} q="Les 5 ingrédients d’une demande de code ?" a={<>Contexte, tâche, contraintes, format, exemples.</>} />
      <J2Flip n={3} q="Avant de refactoriser du code hérité, que faut-il ?" a={<>Des <b>tests de caractérisation</b> qui figent le comportement actuel.</>} />
      <J2Flip n={4} q="Un test échoue : que donner au chat ?" a={<>La trace complète, l’attendu, l’obtenu. Et demander une <b>explication</b>.</>} />
      <J2Flip n={5} q="L’agent propose un paquet inconnu. Réflexe ?" a={<>Vérifier qu’il existe, son mainteneur, son usage. <b>Avant</b> d’installer.</>} />
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
    <Title>Aujourd’hui : qualité, conception, projet</Title>
    <ProgramCols today={2} />
  </Frame>
);

// ─── Module 4 divider ───────────────────────────────────────────────────────
const M4_Divider: Page = () => (
  <Section n={4} title="Revue de code et documentation automatisée" sub="Une documentation juste et à jour, des revues plus rapides et plus sûres." dur="≈ 1 h 15">
    <SecItem n={1}>Générer commentaires et documentation technique</SecItem>
    <SecItem n={2}>Analyse de style et respect des conventions</SecItem>
    <SecItem n={3}>Automatiser les revues de code avec l’IA</SecItem>
  </Section>
);
M4_Divider.transition = BLOOM;

// ═══ 60-m4 ═════════════════════════════════════════════════════════════

// ─── M4 · What to document ──────────────────────────────────────────────────
const DocLevel = ({ n, icon, tone, title, who, children }: { n: number; icon: IconName; tone: Tone; title: string; who: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ boxSizing: 'border-box', height: 420, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '26px 26px', display: 'flex', flexDirection: 'column' }}>
    <IconTile name={icon} tone={tone} size={60} />
    <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{children}</div>
    <div style={{ marginTop: 'auto' }}>
      <Tag tone={tone} size={19}>
        {who}
      </Tag>
    </div>
  </div>
);

const M4_DocLevels: Page = () => (
  <Frame mod={4} beats={4}>
    <Title>Ce que l’IA documente bien… et ce qu’elle ne peut pas savoir</Title>
    <Lede>Le « quoi » se lit dans le code ; le « pourquoi » est dans votre tête. La doc utile parle du pourquoi.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: 22 }}>
      <DocLevel n={1} icon="code" tone="blue" title="Docstrings" who="IA : très bien">
        Paramètres, retour, exceptions, exemple. Format imposé (Google, NumPy, TSDoc).
      </DocLevel>
      <DocLevel n={2} icon="book" tone="teal" title="README" who="IA : bon premier jet">
        But, installation, exemple, limites. À vérifier en lançant chaque commande.
      </DocLevel>
      <DocLevel n={3} icon="list" tone="violet" title="Changelog, PR" who="IA : très bien">
        À partir de git log ou du diff : notes de version, description de pull request.
      </DocLevel>
      <DocLevel n={4} icon="map" tone="yellow" title="Décisions" who="Vous : le pourquoi">
        Pourquoi haversine plutôt qu’une API ? Pourquoi cette limite ? L’IA rédige, vous dictez.
      </DocLevel>
    </div>
    <Callout cls={b.on(4)} title="Le test d’une bonne doc" tone="blue" icon="eye" size={25} style={{ position: 'absolute', left: 120, top: 740, width: 1680 }}>
      Un collègue qui n’a jamais vu le module peut l’utiliser correctement… sans lire le code.
    </Callout>
  </Frame>
);

// ─── M4 · Docstring generation demo ─────────────────────────────────────────
const M4_Docstring: Page = () => (
  <Frame mod={4} kind="demo" beats={3}>
    <Title>Générer une documentation conforme à une convention</Title>
    <Lede>Précisez le format, la langue et l’exemple exécutable : sinon, chaque fonction aura son style.</Lede>
    <PromptBox cls={A.in} size={23} style={{ position: 'absolute', left: 120, top: 270, width: 700, ...dl(100) }}>
      /doc · Docstring au format Google, en français, avec Args, Returns, Raises et un exemple doctest exécutable. Explique le pourquoi (formule, hypothèses), pas le comment.
    </PromptBox>
    <div className={b.on(3)} style={{ position: 'absolute', left: 120, top: 560, width: 700, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card tone="green" icon="check" title="Vérifiable" size={23}>
        python -m doctest -v geo.py exécute l’exemple : s’il est faux, ça se voit.
      </Card>
      <Card tone="coral" icon="alert" title="À traquer" size={23}>
        Les exemples inventés et les promesses fausses (« précis au mètre »).
      </Card>
    </div>
    <CodeDark cls={A.in} file="geo.py" lang="python" size={20} style={{ position: 'absolute', left: 880, top: 270, width: 920, ...dl(200) }}>
      <Kw>def</Kw> <Fn>distance_km</Fn>(a: <Ty>Point</Ty>, b: <Ty>Point</Ty>) -&gt; <Ty>float</Ty>:{'\n'}
      <span className={b.fade(1)}>
        {'    '}
        <St>"""Distance à vol d'oiseau, formule de haversine.</St>
        {'\n'}
        {'\n'}
        {'    '}
        <St>Terre supposée sphérique : précision d'environ 0,5 %.</St>
        {'\n'}
        {'\n'}
        {'    '}
        <St>Args:</St>
        {'\n'}
        {'        '}
        <St>a: Point de départ.</St>
        {'\n'}
        {'        '}
        <St>b: Point d'arrivée.</St>
        {'\n'}
        {'\n'}
        {'    '}
        <St>Returns:</St>
        {'\n'}
        {'        '}
        <St>La distance en kilomètres, arrondie à 0,1 km.</St>
        {'\n'}
        {'\n'}
      </span>
      <span className={b.fade(2)}>
        {'    '}
        <St>Example:</St>
        {'\n'}
        {'        '}
        <St>&gt;&gt;&gt; distance_km(MONTREAL, QUEBEC)</St>
        {'\n'}
        {'        '}
        <St>233.0</St>
        {'\n'}
        {'    '}
        <St>"""</St>
      </span>
    </CodeDark>
  </Frame>
);

// ─── M4 · README, changelog, PR description ─────────────────────────────────
const M4_Readme: Page = () => (
  <Frame mod={4}>
    <Title>README, journal des modifications, description de PR</Title>
    <Lede>Les documents que personne n’aime écrire… et que l’IA rédige bien à partir du code et de l’historique.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 24 }}>
      <div className={A.in} style={dl(100)}>
        <PromptBox label="README" size={22}>
          À partir de geo.py et des tests, écris un README : but, installation, un exemple qui fonctionne, limites connues. Pas de fonctionnalité qui n’existe pas.
        </PromptBox>
      </div>
      <div className={A.in} style={dl(200)}>
        <PromptBox label="Journal des modifications" size={22}>
          À partir de git log --oneline v1.2..HEAD, rédige l’entrée de CHANGELOG au format Keep a Changelog : Ajouté, Modifié, Corrigé.
        </PromptBox>
      </div>
      <div className={A.in} style={dl(300)}>
        <PromptBox label="Description de PR" size={22}>
          À partir du diff, décris la PR : le problème, la solution, comment tester, les risques. Pour un relecteur pressé.
        </PromptBox>
      </div>
    </div>
    <Term cls={A.in} title="CHANGELOG.md" size={20} style={{ position: 'absolute', left: 120, top: 600, width: 1100, ...dl(400) }}>
      <Ok>## [1.3.0] - 2026-11-03</Ok>
      {'\n'}
      ### Ajouté{'\n'}- Export CSV des tâches, étiquettes séparées par « ; ».{'\n'}### Corrigé{'\n'}- Les identifiants ne sont plus réutilisés après une suppression.
    </Term>
    <Callout cls={A.in} title="Toujours" tone="yellow" icon="humanCheck" size={24} style={{ position: 'absolute', left: 1280, top: 600, width: 520, ...dl(500) }}>
      Lancer chaque commande du README. Rayer ce que le code ne fait pas.
    </Callout>
  </Frame>
);

// ─── Lab 06 ─────────────────────────────────────────────────────────────────
const L06_Brief: Page = () => (
  <LabBrief
    mod={4}
    n="06"
    title="Documenter… et vérifier ce qui est écrit"
    dur="20 min"
    folder="lab06-documentation"
    objective="Générer une documentation conforme à une convention, un README et un changelog, puis vérifier que la documentation dit vrai."
    cmd={
      <>
        <Pr>pytest labs/lab06-documentation</Pr>
        {'\n'}
        <Ok>4 passed</Ok>, <Ko>7 failed</Ko>
        {'\n'}
        <Pr>python -m doctest -v …/geo.py</Pr>
      </>
    }
    deliverable="Tous les tests verts (docstrings complètes, exemples justes) et un README revu par vous."
  >
    <LabStep n={1} t="3 min" title="Convention d’abord">
      Une fonction avec, puis sans la convention : comparez
    </LabStep>
    <LabStep n={2} t="7 min" title="Tout le module">
      Module, classe Point, 4 fonctions : /doc, Generate documentation ou chat
    </LabStep>
    <LabStep n={3} t="5 min" title="Vérifier">
      doctest exécute les exemples ; cherchez une phrase fausse
    </LabStep>
    <LabStep n={4} t="5 min" title="README et changelog">
      Puis une entrée de CHANGELOG à partir de git log
    </LabStep>
  </LabBrief>
);

const L06_Go: Page = () => (
  <LabGo mod={4} n="06" minutes={20} folder="lab06-documentation">
    <CheckItem id="l06-1">Comparaison avec / sans convention notée</CheckItem>
    <CheckItem id="l06-2">Module, Point et 4 fonctions documentés</CheckItem>
    <CheckItem id="l06-3">Exemples exécutés et justes (doctest ou à la main)</CheckItem>
    <CheckItem id="l06-4">Une phrase fausse ou invérifiable repérée et corrigée</CheckItem>
    <CheckItem id="l06-5">README et entrée de CHANGELOG</CheckItem>
  </LabGo>
);

// ─── M4 · Style and conventions ─────────────────────────────────────────────
const StyleRow = ({ tool, what, ai, d }: { tool: string; what: string; ai: string; d: number }) => (
  <div className={A.left} style={{ display: 'grid', gridTemplateColumns: '300px 1fr 1fr', alignItems: 'center', columnGap: 24, minHeight: 74, borderBottom: `1.5px solid ${C.rule}`, ...dl(d) }}>
    <span style={{ fontFamily: mono, fontSize: 23, color: T.blue.fg }}>{tool}</span>
    <span style={{ fontSize: 23, color: C.ink }}>{what}</span>
    <span style={{ fontSize: 22, color: T.violet.fg }}>{ai}</span>
  </div>
);

const M4_Style: Page = () => (
  <Frame mod={4}>
    <Title>Style et conventions : les outils décident, l’IA explique</Title>
    <Lede>Un formateur et un linter appliquent les règles sans débat. L’IA intervient là où ils s’arrêtent.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
      <div className={A.in} style={{ display: 'grid', gridTemplateColumns: '300px 1fr 1fr', columnGap: 24, paddingBottom: 10, borderBottom: `3px solid ${C.ink}`, ...dl(50) }}>
        <Eyebrow c={C.muted} size={20}>
          Outil
        </Eyebrow>
        <Eyebrow c={C.muted} size={20}>
          Ce qu’il fait (déterministe)
        </Eyebrow>
        <Eyebrow c={C.violet} size={20}>
          Où l’IA aide
        </Eyebrow>
      </div>
      <StyleRow tool="ruff format · Prettier" what="Mise en forme, sans discussion" ai="Rien : laissez l’outil faire" d={150} />
      <StyleRow tool="ruff · ESLint" what="Règles, erreurs, complexité, sécurité (S)" ai="Expliquer une règle, corriger un avertissement" d={250} />
      <StyleRow tool="mypy · tsc --strict" what="Cohérence des types" ai="Ajouter les annotations manquantes" d={350} />
      <StyleRow tool="Instructions de projet" what="—" ai="Conventions non outillables : nommage métier, gestion d’erreurs" d={450} />
      <StyleRow tool="Revue de PR" what="—" ai="Lisibilité, cohérence avec le reste du dépôt" d={550} />
    </div>
    <Callout cls={A.in} title="Règle d’efficacité" tone="yellow" size={25} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(700) }}>
      Ne demandez jamais à l’IA ce qu’un outil déterministe fait gratuitement : formatage, tri des imports, règles de lint.
    </Callout>
  </Frame>
);

// ─── M4 · Spot the flaws (hotspots on the PR of lab 07) ─────────────────────
const M4_Hotspots: Page = () => (
  <Frame mod={4} kind="exercice" beats={5}>
    <Title>Revue éclair : repérez les failles</Title>
    <Lede>Extrait de la PR n° 42 du lab 07. Dites-moi ce que vous voyez, puis j’ouvre les pastilles.</Lede>
    <CodeDark cls={A.in} file="notes_service.py · PR #42" lang="python" size={22} style={{ position: 'absolute', left: 120, top: 270, width: 1180, ...dl(100) }}>
      SECRET_KEY = <St>"s3cr3t-prod-2026"</St>
      {'\n'}
      {'\n'}
      <Kw>def</Kw> <Fn>connecter</Fn>(self, email, mot_de_passe):{'\n'}
      {'    '}h = hashlib.<Fn>md5</Fn>(mot_de_passe.encode()).hexdigest(){'\n'}
      {'    '}
      <Kw>try</Kw>:{'\n'}
      {'        '}row = self.bd.execute({'\n'}
      {'            '}
      <St>f"select id from users where email = '</St>
      {'{'}email{'}'}
      <St>' and password = '</St>
      {'{'}h{'}'}
      <St>'"</St>){'\n'}
      {'    '}
      <Kw>except</Kw> <Ty>Exception</Ty>:{'\n'}
      {'        '}
      <Kw>return</Kw> <Kw>None</Kw>
      {'\n'}
      {'\n'}
      <Kw>def</Kw> <Fn>lire_note</Fn>(self, user_id, note_id):{'\n'}
      {'    '}row = self.bd.execute(<St>"select contenu from notes where id = ?"</St>, (note_id,))
    </CodeDark>
    <Hotspot n={1} x={430} y={334} at={1} title="Secret en dur" w={460}>
      Il finit dans Git et dans chaque copie du dépôt. À lire dans l’environnement ou un coffre-fort.
    </Hotspot>
    <Hotspot n={2} x={760} y={440} at={2} title="MD5, sans sel" w={460}>
      Cassé en quelques secondes. pbkdf2, scrypt ou argon2, avec un sel par utilisateur.
    </Hotspot>
    <Hotspot n={3} x={1240} y={510} at={3} side="left" title="Injection SQL" w={460}>
      « ana@x.ca' -- » se connecte sans mot de passe. Requête paramétrée.
    </Hotspot>
    <Hotspot n={4} x={480} y={580} at={4} title="Exception avalée" w={460}>
      Cache l’injection et toutes les autres erreurs.
    </Hotspot>
    <Hotspot n={5} x={1240} y={720} at={5} side="left" title="Contrôle d’accès absent" w={480}>
      user_id n’est pas vérifié : Bob lit les notes d’Ana. Aucun outil statique ne le voit.
    </Hotspot>
    <div style={{ position: 'absolute', left: 1360, top: 270, width: 440 }}>
      <Card cls={b.on(5)} tone="violet" icon="eye" title="Qui trouve quoi ?" size={22}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          <span>
            <b>ruff (S)</b> : 1, 2, 3
          </span>
          <span>
            <b>IA</b> : 1 à 4, souvent 5
          </span>
          <span>
            <b>Vous</b> : 5, la règle métier
          </span>
        </div>
      </Card>
    </div>
  </Frame>
);

// ─── M4 · Automating reviews ────────────────────────────────────────────────
const RevStep = ({ n, icon, tone, title, children }: { n: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', alignItems: 'center', gap: 20, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 24px' }}>
    <IconTile name={icon} tone={tone} size={56} />
    <div>
      <div style={{ fontSize: 27, fontWeight: 600, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, color: C.muted, lineHeight: 1.35 }}>{children}</div>
    </div>
  </div>
);

const M4_ReviewFlow: Page = () => (
  <Frame mod={4} beats={4}>
    <Title>Automatiser la revue : l’IA en premier relecteur</Title>
    <Lede>Elle filtre avant l’humain ; elle ne remplace ni l’approbation ni la responsabilité.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 900, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <RevStep n={1} icon="code" tone="blue" title="Avant d’ouvrir la PR">
        Auto-revue dans le chat avec la grille de l’équipe ; description générée et relue.
      </RevStep>
      <RevStep n={2} icon="gear" tone="teal" title="Pipeline CI">
        Lint, types, tests, analyse de sécurité (CodeQL, ruff S) : bloquants.
      </RevStep>
      <RevStep n={3} icon="bot" tone="violet" title="Revue IA de la PR">
        Copilot en relecteur, ou une action de revue : commentaires en ligne, suggestions.
      </RevStep>
      <RevStep n={4} icon="humanCheck" tone="green" title="Revue humaine et approbation">
        Conception, règles métier, pertinence : un humain approuve et fusionne.
      </RevStep>
    </div>
    <div style={{ position: 'absolute', left: 1080, top: 270, width: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card cls={b.on(3)} tone="green" icon="check" title="L’IA repère bien" size={23}>
        Oublis de cas d’erreur, failles connues, incohérences de nommage, tests absents, documentation périmée.
      </Card>
      <Card cls={b.on(4)} tone="coral" icon="alert" title="Elle repère mal" size={23}>
        Règles métier, choix d’architecture, effets sur le reste du système… et elle produit du bruit : il faut trier.
      </Card>
    </div>
  </Frame>
);

// ─── M4 · Review prompt and comment format ──────────────────────────────────
const M4_ReviewPrompt: Page = () => (
  <Frame mod={4}>
    <Title>Une demande de revue qui produit des constats utiles</Title>
    <Lede>Une grille de gravité, un format imposé, un verdict. Sinon : 15 remarques de style.</Lede>
    <PromptBox cls={A.in} label="Demande de revue" size={23} style={{ position: 'absolute', left: 120, top: 270, width: 820, ...dl(100) }}>
      Fais la revue de ce fichier comme un relecteur senior, selon grille-revue.md. Pour chaque constat : ligne, gravité (Bloquant, Majeur, Mineur, Suggestion), problème, correction. Ignore le formatage (ruff s’en charge). Termine par un verdict : approuver ou demander des changements.
    </PromptBox>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 620, width: 820, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: 12, ...dl(250) }}>
      <Tag tone="coral" size={21}>Bloquant</Tag>
      <Tag tone="yellow" size={21}>Majeur</Tag>
      <Tag tone="blue" size={21}>Mineur</Tag>
      <Tag tone="grey" size={21}>Suggestion</Tag>
    </div>
    <AnswerBox cls={A.right} id="copilot" label="Commentaire de revue" size={22} style={{ position: 'absolute', left: 1000, top: 270, width: 800, ...dl(350) }}>
      <span style={{ fontFamily: mono, fontSize: 20, color: T.coral.fg }}>[Bloquant] notes_service.py:31 · Injection SQL</span>
      <br />
      Le courriel est inséré tel quel dans la requête : « ana@x.ca' -- » contourne le mot de passe.
      <br />
      <b>Correction :</b> requête paramétrée, execute("… where email = ?", (email,)).
    </AnswerBox>
    <Callout cls={A.in} title="Un bon commentaire" tone="green" icon="chat" size={24} style={{ position: 'absolute', left: 1000, top: 560, width: 800, ...dl(450) }}>
      Où, quoi, pourquoi c’est grave, comment corriger. Il critique le code, jamais la personne.
    </Callout>
  </Frame>
);

// ─── Lab 07 ─────────────────────────────────────────────────────────────────
const L07_Brief: Page = () => (
  <LabBrief
    mod={4}
    n="07"
    title="Revue de code assistée par l’IA"
    dur="25 min"
    folder="lab07-revue"
    objective="Mener la revue d’une pull request avec l’IA et un analyseur statique, classer et trier les constats, corriger les bloquants."
    cmd={
      <>
        <Pr>ruff check labs/lab07-revue/python</Pr>
        {'\n'}
        <Ko>S105 S324 S608 …</Ko>
        {'\n'}
        <Pr>pytest labs/lab07-revue</Pr>
        {'\n'}
        <Ok>4 passed</Ok>, <Ko>5 failed</Ko>
      </>
    }
    deliverable="REVUE.md (constats classés, « trouvé par : moi / IA / ruff ») et les 9 tests verts."
  >
    <LabStep n={1} t="3 min" title="Revue humaine éclair">
      Lisez la PR sans IA, notez ce qui vous frappe
    </LabStep>
    <LabStep n={2} t="7 min" title="Revue IA + analyseur">
      Demande avec grille-revue.md, puis ruff check
    </LabStep>
    <LabStep n={3} t="5 min" title="Trier, puis révéler">
      Vrai, faux positif, discutable ? Puis lancez les tests de sécurité
    </LabStep>
    <LabStep n={4} t="10 min" title="Corriger les bloquants">
      SQL paramétré, empreinte salée, contrôle d’accès, secret externe
    </LabStep>
  </LabBrief>
);

const L07_Go: Page = () => (
  <LabGo mod={4} n="07" minutes={25} folder="lab07-revue">
    <CheckItem id="l07-1">Ma revue sans IA : constats notés</CheckItem>
    <CheckItem id="l07-2">Revue IA et ruff : trois listes comparées</CheckItem>
    <CheckItem id="l07-3">Constats triés : vrai, faux positif, discutable</CheckItem>
    <CheckItem id="l07-4">Bloquants corrigés : SQL, mot de passe, accès, secret</CheckItem>
    <CheckItem id="l07-5">9 tests verts, REVUE.md rédigé</CheckItem>
  </LabGo>
);

// ─── M4 · Quiz ──────────────────────────────────────────────────────────────
const M4_Quiz: Page = () => (
  <QcmPage
    mod={4}
    n={4}
    title="La revue IA a dit « LGTM »"
    q="La revue automatique par l’IA ne signale rien sur votre PR. Que pouvez-vous en conclure ?"
    explain="L’absence de constat n’est pas une preuve d’absence de défaut. La revue IA est un premier filtre probabiliste : les tests, l’analyse statique et la revue humaine restent nécessaires."
  >
    <Opt why="Piège ! L’IA ne connaît pas vos règles métier et rate des défauts ; « rien à signaler » n’est pas une garantie.">La PR peut être fusionnée sans autre revue</Opt>
    <Opt ok why="Oui : c’est un filtre de plus. Les tests, l’analyse statique et l’approbation humaine restent les garde-fous.">
      Rien de plus : il faut toujours les tests et une revue humaine
    </Opt>
    <Opt why="Non : aucun outil ne prouve l’absence de faille. Même CodeQL a des angles morts.">Il n’y a aucune faille de sécurité</Opt>
    <Opt why="Faux : la revue IA ne connaît que le diff et un peu de contexte, pas vos décisions passées.">Le code respecte toutes les conventions de l’équipe</Opt>
  </QcmPage>
);

// ─── M4 · Synthesis ─────────────────────────────────────────────────────────
const M4_Synth: Page = () => (
  <SynthPage
    mod={4}
    title="Module 4 · Ce qu’il faut retenir"
    poste={<>Ajoutez la convention de documentation à vos instructions de projet. Activez une revue IA sur un dépôt pilote… et mesurez combien de ses constats sont utiles.</>}
  >
    <SynthRow n={1} tone="blue" d={100}>
      Imposer une convention ; exemples exécutables, donc vérifiés
    </SynthRow>
    <SynthRow n={2} tone="teal" d={200}>
      README, changelog, PR : premier jet IA, vérification humaine
    </SynthRow>
    <SynthRow n={3} tone="violet" d={300}>
      Le style aux outils déterministes ; l’IA pour ce qui reste
    </SynthRow>
    <SynthRow n={4} tone="green" d={400}>
      Revue IA : grille, gravité, verdict… puis tri des constats
    </SynthRow>
    <SynthRow n={5} tone="yellow" d={500}>
      Les règles métier et l’approbation restent humaines
    </SynthRow>
  </SynthPage>
);

// ─── Module 5 divider ───────────────────────────────────────────────────────
const M5_Divider: Page = () => (
  <Section n={5} title="Génération de tests et assurance qualité" sub="Des tests qui protègent vraiment, de l’unitaire à la charge, branchés dans le pipeline." dur="≈ 1 h 20">
    <SecItem n={1}>Tests unitaires et d’intégration</SecItem>
    <SecItem n={2}>Simulation de scénarios et tests de charge</SecItem>
    <SecItem n={3}>Intégration CI/CD et pipelines automatisés</SecItem>
  </Section>
);
M5_Divider.transition = BLOOM;

// ═══ 70-m5 ═════════════════════════════════════════════════════════════

// ─── M5 · Test pyramid ──────────────────────────────────────────────────────
const PyrLevel = ({ n, w, y, tone, title, ai }: { n: number; w: number; y: number; tone: Tone; title: string; ai: string }) => (
  <div className={b.on(n)} style={{ position: 'absolute', left: 120 + (900 - w) / 2, top: y, width: w, height: 150, boxSizing: 'border-box', background: STRONG[tone], borderRadius: 14, color: tone === 'yellow' ? C.ink : '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px' }}>
    <div style={{ fontFamily: display, fontWeight: 700, fontSize: 34 }}>{title}</div>
    <div style={{ fontSize: 21, opacity: 0.92 }}>{ai}</div>
  </div>
);

const M5_Pyramid: Page = () => (
  <Frame mod={5} beats={4}>
    <Title>Quels tests demander à l’IA ?</Title>
    <Lede>Beaucoup de tests unitaires rapides, moins de tests d’intégration, quelques scénarios de bout en bout.</Lede>
    <PyrLevel n={3} w={420} y={290} tone="yellow" title="Bout en bout · charge" ai="scénarios, données réalistes, scripts de charge" />
    <PyrLevel n={2} w={660} y={460} tone="teal" title="Intégration" ai="vrais composants : API, base, fichiers" />
    <PyrLevel n={1} w={900} y={630} tone="blue" title="Unitaires" ai="cas nominaux, limites, erreurs : l’IA excelle ici" />
    <div style={{ position: 'absolute', left: 1100, top: 290, width: 700, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card cls={b.on(1)} tone="green" icon="check" title="L’IA est très bonne pour…" size={23}>
        Énumérer les cas limites, écrire des tests paramétrés, fabriquer des données de test, écrire les fixtures.
      </Card>
      <Card cls={b.on(4)} tone="coral" icon="alert" title="… mais attention à" size={23}>
        Des tests qui exécutent sans vérifier, des attendus recalculés avec la même formule que le code, des tests liés entre eux.
      </Card>
    </div>
  </Frame>
);

// ─── M5 · Behaviours first, then code ───────────────────────────────────────
const M5_Behaviours: Page = () => (
  <Frame mod={5} kind="demo" beats={2}>
    <Title>D’abord la liste des comportements, ensuite le code</Title>
    <Lede>Les tests générés d’un coup couvrent ce que le code fait, pas ce qu’il devrait faire.</Lede>
    <PromptBox cls={A.in} size={23} style={{ position: 'absolute', left: 120, top: 270, width: 800, ...dl(100) }}>
      Liste les comportements de la classe Panier à tester : cas nominaux, valeurs limites, erreurs. Un comportement par ligne, sans code.
    </PromptBox>
    <AnswerBox cls={b.on(1)} id="copilot" size={21} style={{ position: 'absolute', left: 120, top: 470, width: 800 }}>
      1. Ajouter cumule les quantités du même article
      <br />
      2. Quantité 0 ou négative → ValueError
      <br />
      3. Maximum 99 par article (99 accepté, 100 refusé)
      <br />
      4. Stock exact accepté, stock + 1 refusé, panier inchangé
      <br />
      5. MOINS10 : 10 % du sous-total ; code insensible à la casse
      <br />
      6. Livraison gratuite <b>exactement</b> à 50,00 $
      <br />
      7. Le rabais peut faire perdre la livraison gratuite
    </AnswerBox>
    <CodeDark cls={b.on(2)} file="test_panier.py" lang="python" size={20} style={{ position: 'absolute', left: 980, top: 270, width: 820 }}>
      <Fn>@pytest.fixture</Fn>
      {'\n'}
      <Kw>def</Kw> <Fn>souris</Fn>():{'\n'}
      {'    '}
      <Kw>return</Kw> Produit(<St>"MS-02"</St>, <St>"Souris"</St>, <Nu>1_500</Nu>, stock=<Nu>3</Nu>){'\n'}
      {'\n'}
      <Fn>@pytest.mark.parametrize</Fn>(<St>"quantite"</St>, [<Nu>0</Nu>, <Nu>-1</Nu>]){'\n'}
      <Kw>def</Kw> <Fn>test_quantite_invalide</Fn>(panier, souris, quantite):{'\n'}
      {'    '}
      <Kw>with</Kw> pytest.raises(<Ty>ValueError</Ty>):{'\n'}
      {'        '}panier.ajouter(souris, quantite){'\n'}
      {'\n'}
      <Kw>def</Kw> <Fn>test_stock_insuffisant</Fn>(panier, souris):{'\n'}
      {'    '}panier.ajouter(souris, <Nu>3</Nu>){'\n'}
      {'    '}
      <Kw>with</Kw> pytest.raises(<Ty>StockInsuffisant</Ty>):{'\n'}
      {'        '}panier.ajouter(souris){'\n'}
      <Ln kind="hl">
        {'    '}
        <Kw>assert</Kw> panier.lignes == {'{'}
        <St>"MS-02"</St>: <Nu>3</Nu>
        {'}'}
        {'  '}
        <Cm># inchangé</Cm>
      </Ln>
    </CodeDark>
  </Frame>
);

// ─── M5 · Coverage vs mutation ──────────────────────────────────────────────
const M5_Mutation: Page = () => (
  <Frame mod={5} beats={3}>
    <Title>100 % de couverture ne veut pas dire « bien testé »</Title>
    <Lede>La couverture mesure ce qui s’exécute. Le test de mutation mesure ce qui est vérifié.</Lede>
    <CodeDark cls={A.in} file="panier.py · mutant n° 7" lang="python" size={22} style={{ position: 'absolute', left: 120, top: 280, width: 900, ...dl(100) }}>
      <Kw>def</Kw> <Fn>livraison</Fn>(self) -&gt; <Ty>int</Ty>:{'\n'}
      {'    '}…{'\n'}
      <Ln kind="del">
        {'    '}
        <Kw>if</Kw> self.sous_total() - self.rabais() &gt;= SEUIL:
      </Ln>
      <Ln kind="add">
        {'    '}
        <Kw>if</Kw> self.sous_total() - self.rabais() &gt; SEUIL:
      </Ln>
      {'        '}
      <Kw>return</Kw> <Nu>0</Nu>
      {'\n'}
      {'    '}
      <Kw>return</Kw> FRAIS_LIVRAISON
    </CodeDark>
    <Term cls={b.on(1)} title="python mutants.py" size={21} style={{ position: 'absolute', left: 120, top: 580, width: 900 }}>
      {'  '}
      <Ok>tué      </Ok> quantité 0 acceptée{'\n'}
      {'  '}
      <Ok>tué      </Ok> rabais de 1 %{'\n'}
      {'  '}
      <Ko>SURVIVANT</Ko> seuil de livraison strict{'\n'}
      {'\n'}
      Score de mutation : <Ko>5/8</Ko>
      {'   '}couverture : <Ok>100 %</Ok>
    </Term>
    <div style={{ position: 'absolute', left: 1080, top: 280, width: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card cls={b.on(2)} tone="violet" icon="bug" title="Le principe" size={23}>
        On introduit un petit bogue (un mutant). Si aucun test n’échoue, le mutant « survit » : ce comportement n’est pas vérifié.
      </Card>
      <Card cls={b.on(3)} tone="green" icon="sparkles" title="Avec l’IA" size={23}>
        Pour chaque survivant : « Écris le test qui tue ce mutant. » Ici : un panier à exactement 50,00 $.
      </Card>
      <Hint cls={b.on(3)}>Outils : mutmut (Python), Stryker (JS/TS, Java, C#). Le lab 08 en fournit un simplifié.</Hint>
    </div>
  </Frame>
);

// ─── M5 · Test smells ───────────────────────────────────────────────────────
const M5_Smells: Page = () => (
  <Frame mod={5} kind="exercice">
    <Title>Ce test généré est-il utile ?</Title>
    <Lede>Votez pour chaque carte : utile ou pas ? Puis je la retourne.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 405px)', columnGap: 20, ...dl(100) }}>
      <FlipCard
        w={405}
        h={520}
        tone="grey"
        backTone="coral"
        front={<div style={{ fontFamily: mono, fontSize: 22, lineHeight: 1.5, color: C.ink, whiteSpace: 'pre' }}>{'def test_panier():\n    p = Panier()\n    p.ajouter(CLAVIER)\n    assert p is not None'}</div>}
        back={<div style={{ fontSize: 24, lineHeight: 1.45, color: C.ink }}><b>Inutile.</b> Il exécute le code sans rien vérifier. Couverture en hausse, protection nulle.</div>}
      />
      <FlipCard
        w={405}
        h={520}
        tone="grey"
        backTone="coral"
        front={<div style={{ fontFamily: mono, fontSize: 22, lineHeight: 1.5, color: C.ink, whiteSpace: 'pre' }}>{'def test_rabais():\n    ...\n    attendu = (\n      p.sous_total() // 10)\n    assert p.rabais() == attendu'}</div>}
        back={<div style={{ fontSize: 24, lineHeight: 1.45, color: C.ink }}><b>Tautologique.</b> L’attendu recopie la formule du code : si la formule est fausse, le test aussi. Écrivez 999.</div>}
      />
      <FlipCard
        w={405}
        h={520}
        tone="grey"
        backTone="green"
        front={<div style={{ fontFamily: mono, fontSize: 22, lineHeight: 1.5, color: C.ink, whiteSpace: 'pre' }}>{'def test_livraison_\n    gratuite_au_seuil(p):\n    p.ajouter(SUPPORT_50)\n    assert p.livraison() == 0'}</div>}
        back={<div style={{ fontSize: 24, lineHeight: 1.45, color: C.ink }}><b>Utile.</b> Une valeur limite exacte, un nom qui dit la règle, une seule vérification claire.</div>}
      />
      <FlipCard
        w={405}
        h={520}
        tone="grey"
        backTone="coral"
        front={<div style={{ fontFamily: mono, fontSize: 22, lineHeight: 1.5, color: C.ink, whiteSpace: 'pre' }}>{'PANIER = Panier()\n\ndef test_1():\n    PANIER.ajouter(A)\n\ndef test_2():\n    assert PANIER.total()\n      == 4999'}</div>}
        back={<div style={{ fontSize: 24, lineHeight: 1.45, color: C.ink }}><b>Fragile.</b> test_2 dépend de test_1 : l’ordre ou l’exécution seule le casse. Une fixture par test.</div>}
      />
    </div>
  </Frame>
);

// ─── Lab 08 ─────────────────────────────────────────────────────────────────
const L08_Brief: Page = () => (
  <LabBrief
    mod={5}
    n="08"
    title="Des tests unitaires qui servent vraiment"
    dur="30 min"
    folder="lab08-tests"
    objective="Faire générer une suite de tests, puis la juger avec deux mesures objectives : la couverture des branches et le score de mutation."
    cmd={
      <>
        <Pr>pytest … --cov=panier --cov-branch</Pr>
        {'\n'}
        <Pr>python …/mutants.py</Pr>
        {'\n'}
        Score de mutation : <Ko>1/8</Ko>
        {'\n'}
        <Pr>npm run cov:lab08</Pr>
      </>
    }
    deliverable="Couverture des branches ≥ 95 %, score de mutation 8/8, tous les tests verts en moins d’une seconde."
  >
    <LabStep n={1} t="5 min" title="Lister les comportements">
      Sans code ; ajoutez celui que l’IA a oublié
    </LabStep>
    <LabStep n={2} t="10 min" title="Générer">
      Fixtures, tests paramétrés, noms en phrases
    </LabStep>
    <LabStep n={3} t="5 min" title="Mesurer">
      Couverture, puis mutants ; un test par survivant
    </LabStep>
    <LabStep n={4} t="5 min" title="Relire">
      Supprimez les tests qui ne vérifient rien
    </LabStep>
    <LabStep n={5} t="5 min" title="Valeurs limites">
      99 articles, 50,00 $, stock exact
    </LabStep>
  </LabBrief>
);

const L08_Go: Page = () => (
  <LabGo mod={5} n="08" minutes={30} folder="lab08-tests">
    <CheckItem id="l08-1">Liste de comportements, complétée par vous</CheckItem>
    <CheckItem id="l08-2">Suite générée : fixtures, paramétrage</CheckItem>
    <CheckItem id="l08-3">Couverture des branches ≥ 95 %</CheckItem>
    <CheckItem id="l08-4">Score de mutation 8/8</CheckItem>
    <CheckItem id="l08-5">Aucun test tautologique ni dépendant d’un autre</CheckItem>
  </LabGo>
);

// ─── M5 · Integration tests ─────────────────────────────────────────────────
const M5_Integration: Page = () => (
  <Frame mod={5} beats={2}>
    <Title>Tests d’intégration : de vrais composants, de vrais échanges</Title>
    <Lede>Un vrai serveur HTTP, une vraie base de test, un port choisi par le système. L’IA écrit les scénarios.</Lede>
    <CodeDark cls={A.in} file="test_integration.py" lang="python" size={21} style={{ position: 'absolute', left: 120, top: 270, width: 960, ...dl(100) }}>
      <Fn>@pytest.fixture</Fn>(scope=<St>"module"</St>){'\n'}
      <Kw>def</Kw> <Fn>serveur</Fn>():{'\n'}
      {'    '}srv = creer_serveur(){'  '}
      <Cm># port 0 : un port libre</Cm>
      {'\n'}
      {'    '}threading.Thread(target=srv.serve_forever, daemon=<Kw>True</Kw>).start(){'\n'}
      {'    '}
      <Kw>yield</Kw> <St>f"http://127.0.0.1:</St>
      {'{'}srv.server_address[<Nu>1</Nu>]{'}'}
      <St>"</St>
      {'\n'}
      {'    '}srv.shutdown(){'\n'}
      {'\n'}
      <Kw>def</Kw> <Fn>test_creer_puis_suivre_un_lien</Fn>(serveur):{'\n'}
      {'    '}code = creer(serveur, <St>"https://exemple.ca/page"</St>){'\n'}
      {'    '}statut, entetes, _ = requete(serveur, <St>"GET"</St>, <St>f"/l/</St>
      {'{'}code{'}'}
      <St>"</St>){'\n'}
      {'    '}
      <Kw>assert</Kw> statut == <Nu>302</Nu>
      {'\n'}
      {'    '}
      <Kw>assert</Kw> entetes[<St>"Location"</St>] == <St>"https://exemple.ca/page"</St>
    </CodeDark>
    <div style={{ position: 'absolute', left: 1140, top: 270, width: 660, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card cls={b.on(1)} tone="teal" icon="list" title="Scénarios à demander" size={22}>
        Nominal de bout en bout · erreurs 4xx (entrée invalide, introuvable) · concurrence (200 créations, codes uniques) · données limites.
      </Card>
      <Card cls={b.on(2)} tone="coral" icon="alert" title="Faux tests d’intégration" size={22}>
        Appeler les fonctions en mémoire, simuler (mock) tout ce qui compte, port fixe 8009 : échecs aléatoires en CI.
      </Card>
    </div>
  </Frame>
);

// ─── M5 · Load testing ──────────────────────────────────────────────────────
const LatBar = ({ label, ms, max, tone, n }: { label: string; ms: number; max: number; tone: Tone; n: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 58 }}>
    <span style={{ width: 70, fontFamily: mono, fontSize: 23, color: C.ink }}>{label}</span>
    <div style={{ flex: 1, height: 36, background: C.panel, borderRadius: 8 }}>
      <div className={b.grow(n)} style={{ width: `${(ms / max) * 100}%`, height: '100%', background: STRONG[tone], borderRadius: 8 }} />
    </div>
    <span className={b.fade(n)} style={{ width: 110, fontFamily: mono, fontSize: 23, color: C.ink }}>
      {fr(ms, 1)} ms
    </span>
  </div>
);

const M5_Load: Page = () => (
  <Frame mod={5} beats={3}>
    <Title>Simuler des scénarios et tester la charge</Title>
    <Lede>L’IA écrit le script de charge et interprète les chiffres. L’objectif de service, c’est vous qui le fixez.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 960 }}>
      <Term cls={A.in} title="python charge.py 2000 20" size={20} style={dl(100)}>
        2000 requêtes · 20 utilisateurs · 3.1 s · 653 req/s{'\n'}
        erreurs  0.10%{'\n'}
        Objectif de service : <Ok>respecté</Ok>
      </Term>
      <Eyebrow c={C.muted} style={{ marginTop: 28 }}>
        Latences mesurées (API du lab 09)
      </Eyebrow>
      <div style={{ marginTop: 10 }}>
        <LatBar label="p50" ms={7.2} max={528} tone="green" n={1} />
        <LatBar label="p95" ms={9.6} max={528} tone="green" n={1} />
        <LatBar label="p99" ms={528.2} max={528} tone="coral" n={2} />
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1140, top: 270, width: 660, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card cls={A.in} tone="blue" icon="target" title="Objectif de service" size={22} style={dl(200)}>
        p95 &lt; 50 ms et moins de 1 % d’erreurs, avec 80 % de lectures : écrit avant le test.
      </Card>
      <Card cls={b.on(2)} tone="yellow" icon="bulb" title="Lire les percentiles" size={22}>
        La moyenne ment : 1 requête sur 100 attend plus d’une demi-seconde. Demandez à l’IA pourquoi (file d’attente, verrou…).
      </Card>
      <Card cls={b.on(3)} tone="violet" icon="tool" title="Outils" size={22}>
        k6, Locust, JMeter, Gatling : l’IA traduit votre scénario dans leur langage.
      </Card>
    </div>
  </Frame>
);

// ─── M5 · CI/CD pipeline ────────────────────────────────────────────────────
const PipeStage = ({ n, x, icon, tone, title, sub }: { n: number; x: number; icon: IconName; tone: Tone; title: string; sub: string }) => (
  <div className={b.pop(n)} style={{ position: 'absolute', left: x, top: 300, width: 250, height: 210, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '22px 20px', textAlign: 'center' }}>
    <IconTile name={icon} tone={tone} size={60} style={{ margin: '0 auto' }} />
    <div style={{ marginTop: 12, fontFamily: display, fontWeight: 700, fontSize: 28, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 4, fontSize: 20, color: C.muted, lineHeight: 1.3 }}>{sub}</div>
  </div>
);

const M5_Pipeline: Page = () => (
  <Frame mod={5} beats={6}>
    <Title>Intégrer les tests au pipeline CI/CD</Title>
    <Lede>À chaque push et chaque pull request, tout se rejoue. Une PR rouge ne se fusionne pas.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <line x1={180} y1={405} x2={1740} y2={405} stroke={C.rule} strokeWidth={5} strokeDasharray="10 12" className={A.march} />
    </svg>
    <PipeStage n={1} x={120} icon="code" tone="blue" title="Push / PR" sub="déclencheur" />
    <PipeStage n={2} x={410} icon="search" tone="teal" title="Lint" sub="ruff, ESLint" />
    <PipeStage n={3} x={700} icon="check" tone="green" title="Tests" sub="matrice de versions" />
    <PipeStage n={4} x={990} icon="gauge" tone="violet" title="Couverture" sub="seuil : 80 %" />
    <PipeStage n={5} x={1280} icon="shield" tone="coral" title="Sécurité" sub="audit, CodeQL" />
    <PipeStage n={6} x={1570} icon="rocket" tone="yellow" title="Déploiement" sub="si tout est vert" />
    <CodeDark cls={b.on(6)} file=".github/workflows/ci.yml" lang="yaml" size={19} style={{ position: 'absolute', left: 120, top: 560, width: 1000 }}>
      <Kw>on</Kw>: {'{'} push: {'{'} branches: [main] {'}'}, pull_request: {'{}'} {'}'}
      {'\n'}
      <Kw>jobs</Kw>:{'\n'}
      {'  '}python:{'\n'}
      {'    '}strategy: {'{'} matrix: {'{'} python-version: [<St>"3.11"</St>, <St>"3.13"</St>] {'}'} {'}'}
      {'\n'}
      {'    '}steps:{'\n'}
      {'      '}- uses: actions/setup-python@v5{'  '}
      <Cm># avec cache: pip</Cm>
      {'\n'}
      {'      '}- run: ruff check labs/lab09-ci{'\n'}
      {'      '}- run: pytest --cov=api --cov-fail-under=<Nu>80</Nu>
    </CodeDark>
    <Callout cls={b.on(6)} title="Avec l’IA" tone="blue" icon="sparkles" size={23} style={{ position: 'absolute', left: 1180, top: 560, width: 620 }}>
      Elle écrit le YAML et explique un job rouge à partir du journal. Vérifiez chaque action et version sur sa page officielle : elle en invente.
    </Callout>
  </Frame>
);

// ─── Lab 09 ─────────────────────────────────────────────────────────────────
const L09_Brief: Page = () => (
  <LabBrief
    mod={5}
    n="09"
    title="Intégration, charge et pipeline CI/CD"
    dur="35 min"
    folder="lab09-ci"
    objective="Écrire avec l’IA des tests d’intégration sur une vraie API, simuler une charge avec un objectif de service, et brancher le tout dans GitHub Actions."
    cmd={
      <>
        <Pr>pytest labs/lab09-ci</Pr>
        {'\n'}
        <Ok>12 passed</Ok>, <Ko>6 failed</Ko>
        {'  '}
        <Cm>ci.yml</Cm>
        {'\n'}
        <Pr>python …/charge.py</Pr>
      </>
    }
    deliverable="Tests d’intégration verts (couverture ≥ 80 %), ci.yml conforme et vert sur GitHub, une phrase sur l’objectif de service."
  >
    <LabStep n={1} t="10 min" title="Scénarios d’intégration">
      Au moins 6, dont 200 créations concurrentes
    </LabStep>
    <LabStep n={2} t="7 min" title="Charge">
      charge.py, puis 5 000 requêtes et 100 utilisateurs : faites interpréter
    </LabStep>
    <LabStep n={3} t="12 min" title="Pipeline">
      ci-a-completer.yml → .github/workflows/ci.yml : les 6 TODO
    </LabStep>
    <LabStep n={4} t="6 min" title="Le voir bloquer">
      Poussez, puis une PR qui casse un test : le pipeline passe au rouge
    </LabStep>
  </LabBrief>
);

const L09_Go: Page = () => (
  <LabGo mod={5} n="09" minutes={35} folder="lab09-ci">
    <CheckItem id="l09-1">6 scénarios d’intégration, dont la concurrence</CheckItem>
    <CheckItem id="l09-2">Couverture de l’API ≥ 80 %</CheckItem>
    <CheckItem id="l09-3">Charge mesurée et interprétée</CheckItem>
    <CheckItem id="l09-4">ci.yml : test_workflow vert, exécution verte sur GitHub</CheckItem>
    <CheckItem id="l09-5">PR fautive bloquée par le pipeline</CheckItem>
  </LabGo>
);

// ─── M5 · Quiz ──────────────────────────────────────────────────────────────
const M5_Quiz: Page = () => (
  <QcmPage
    mod={5}
    n={5}
    title="L’agent a fait passer les tests"
    q="Votre agent annonce : « Les 42 tests passent. » Vous regardez le diff. Que vérifiez-vous en premier ?"
    explain="Un agent qui doit « faire passer les tests » peut modifier les tests eux-mêmes, en supprimer, ou les marquer comme ignorés. Le diff des fichiers de test se relit en premier."
  >
    <Opt why="Utile, mais secondaire : la vitesse ne dit rien de la justesse.">Que les tests s’exécutent en moins d’une seconde</Opt>
    <Opt ok why="Oui : un assert affaibli, un @skip, un attendu modifié, et le vert ne prouve plus rien.">
      Qu’il n’a pas modifié, ignoré ou supprimé de tests
    </Opt>
    <Opt why="Le style compte moins que la validité des tests : ruff le vérifie de toute façon.">Que le code respecte le style de l’équipe</Opt>
    <Opt why="Le nombre de tests ne mesure pas leur qualité : relisez ce qu’ils vérifient.">Qu’il a ajouté au moins 10 nouveaux tests</Opt>
  </QcmPage>
);

// ─── M5 · Synthesis ─────────────────────────────────────────────────────────
const M5_Synth: Page = () => (
  <SynthPage
    mod={5}
    title="Module 5 · Ce qu’il faut retenir"
    poste={<>Sur votre module le moins testé : liste de comportements par l’IA, tests générés, puis un outil de mutation. Et une règle dans votre CI : seuil de couverture et PR rouge non fusionnable.</>}
  >
    <SynthRow n={1} tone="blue" d={100}>
      Lister les comportements avant d’écrire les tests
    </SynthRow>
    <SynthRow n={2} tone="violet" d={200}>
      La mutation mesure ce que la couverture ne mesure pas
    </SynthRow>
    <SynthRow n={3} tone="teal" d={300}>
      Intégration : vrais composants, port libre, concurrence
    </SynthRow>
    <SynthRow n={4} tone="yellow" d={400}>
      Charge : objectif de service fixé avant, percentiles lus après
    </SynthRow>
    <SynthRow n={5} tone="green" d={500}>
      CI : tout se rejoue à chaque PR ; on relit le diff des tests
    </SynthRow>
  </SynthPage>
);

// ─── Module 6 divider ───────────────────────────────────────────────────────
const M6_Divider: Page = () => (
  <Section n={6} title="IA pour la planification et l’architecture logicielle" sub="Un partenaire pour concevoir, estimer, planifier et anticiper les risques." dur="≈ 1 h">
    <SecItem n={1}>Aide à la conception d’architectures logicielles</SecItem>
    <SecItem n={2}>Estimation des tâches et planification agile</SecItem>
    <SecItem n={3}>Gestion des dépendances et des risques</SecItem>
  </Section>
);
M6_Divider.transition = BLOOM;

// ═══ 80-m6 ═════════════════════════════════════════════════════════════

// ─── M6 · AI as an architecture partner ─────────────────────────────────────
const RoleCard = ({ n, icon, tone, title, children }: { n: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ boxSizing: 'border-box', height: 330, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '26px 24px' }}>
    <IconTile name={icon} tone={tone} size={60} />
    <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 30, lineHeight: 1.08, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </div>
);

const M6_Partner: Page = () => (
  <Frame mod={6} beats={5}>
    <Title>L’IA comme partenaire d’architecture</Title>
    <Lede>Elle ne connaît ni votre équipe, ni votre budget, ni votre historique. Elle élargit vos options et challenge vos choix.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: 22 }}>
      <RoleCard n={1} icon="chat" tone="blue" title="Poser les questions">
        Exigences non fonctionnelles, volumes, intégrations, données sensibles : ce qu’on oublie.
      </RoleCard>
      <RoleCard n={2} icon="layers" tone="teal" title="Comparer des options">
        Deux ou trois architectures contrastées, avec leurs compromis face à vos contraintes.
      </RoleCard>
      <RoleCard n={3} icon="doc" tone="violet" title="Documenter">
        Diagrammes Mermaid ou C4, ADR, tableau des composants : en minutes.
      </RoleCard>
      <RoleCard n={4} icon="scale" tone="yellow" title="Avocat du diable">
        « Quel scénario ferait regretter ce choix dans deux ans ? »
      </RoleCard>
    </div>
    <Callout cls={b.on(5)} title="Le biais à connaître" tone="coral" icon="alert" size={25} style={{ position: 'absolute', left: 120, top: 660, width: 1680 }}>
      Sans contraintes, l’IA propose l’architecture « à la mode » : microservices, Kubernetes, files de messages… pour 4 développeurs et un pilote en 6 semaines.
    </Callout>
  </Frame>
);

// ─── M6 · Questions before answers ──────────────────────────────────────────
const M6_Questions: Page = () => (
  <Frame mod={6} kind="demo" beats={2}>
    <Title>Faire poser les questions avant la solution</Title>
    <Lede>Cas du lab 10 : Cantine+, précommande de repas pour 3 cafétérias (projet fictif).</Lede>
    <PromptBox cls={A.in} size={23} style={{ position: 'absolute', left: 120, top: 270, width: 760, ...dl(100) }}>
      Voici le cahier des charges (#cahier-des-charges.md). Avant de proposer une architecture, pose-moi les 8 questions les plus importantes, classées par impact sur l’architecture.
    </PromptBox>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 520, width: 760, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 16, rowGap: 14, ...dl(200) }}>
      <Tag tone="grey" size={21}>1 500 commandes en 45 min</Tag>
      <Tag tone="grey" size={21}>Paie SAP par lot nocturne</Tag>
      <Tag tone="grey" size={21}>Allergènes : risque légal</Tag>
      <Tag tone="grey" size={21}>Loi 25 : données de santé</Tag>
      <Tag tone="grey" size={21}>4 devs, 20 points / sprint</Tag>
      <Tag tone="grey" size={21}>Pilote en 3 sprints</Tag>
    </div>
    <AnswerBox cls={b.on(1)} id="chatgpt" size={21} style={{ position: 'absolute', left: 940, top: 270, width: 860 }}>
      1. Le prestataire a-t-il un logiciel de caisse à intégrer ? <i>(intégration)</i>
      <br />
      2. Qui valide les allergènes, avec quelle traçabilité ? <i>(conformité)</i>
      <br />
      3. Quel délai acceptable entre commande et retenue sur la paie ? <i>(cohérence)</i>
      <br />
      4. Quel hébergement est autorisé par la sécurité ? <i>(plateforme)</i>
      <br />
      5. Les contractuels ont-ils accès ? <i>(identité)</i>
      <br />
      6. Que se passe-t-il si le paiement échoue à 10 h 29 ? <i>(résilience)</i>
      <br />…
    </AnswerBox>
    <Callout cls={b.on(2)} title="Vous jouez le PO" tone="green" icon="humanCheck" size={24} style={{ position: 'absolute', left: 940, top: 720, width: 860 }}>
      Répondez à 3 questions. Vos réponses deviennent du contexte : la proposition suivante sera bien meilleure.
    </Callout>
  </Frame>
);

// ─── M6 · Options and diagram ───────────────────────────────────────────────
const M6_Options: Page = () => (
  <Frame mod={6} beats={2}>
    <Title>Deux options contrastées, un diagramme, une décision</Title>
    <Lede>Demandez des compromis face à vos contraintes, pas « la meilleure architecture ».</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 720, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card cls={A.in} tone="green" icon="layers" title="Monolithe modulaire" size={22} style={dl(100)}>
        Un déploiement, des modules aux frontières nettes, une file de messages pour le pic. <b>Tient en 3 sprints avec 4 personnes.</b>
      </Card>
      <Card cls={A.in} tone="coral" icon="cloud" title="Microservices" size={22} style={dl(200)}>
        Mise à l’échelle indépendante… mais exploitation, traçage distribué et 6 pipelines. <b>Trop lourd pour le pilote.</b>
      </Card>
      <Callout cls={b.on(2)} title="Décision → ADR-001" tone="blue" icon="flag" size={23}>
        Monolithe modulaire ; extraire le module Commande s’il devient le goulot.
      </Callout>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 900, top: 270, width: 900, height: 600, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: 20 }}>
      <Eyebrow c={C.muted} size={19}>
        Diagramme généré (Mermaid, rendu)
      </Eyebrow>
      <svg width={860} height={530} viewBox="0 0 860 530" style={{ display: 'block' }}>
        <g fontFamily="Barlow" fontSize={19} textAnchor="middle">
          <rect x={20} y={40} width={170} height={70} rx={12} fill={T.grey.bg} stroke={T.grey.bd} strokeWidth={2} />
          <text x={105} y={82} fill={C.ink}>Employé · web</text>
          <rect x={20} y={200} width={170} height={70} rx={12} fill={T.grey.bg} stroke={T.grey.bd} strokeWidth={2} />
          <text x={105} y={242} fill={C.ink}>Cuisine · tablette</text>
          <rect x={300} y={110} width={230} height={100} rx={14} fill={T.blue.bg} stroke={C.blue} strokeWidth={3} />
          <text x={415} y={155} fill={C.ink} fontWeight={700}>API Cantine+</text>
          <text x={415} y={182} fill={T.blue.fg} fontSize={16}>monolithe modulaire</text>
          <rect x={620} y={30} width={210} height={64} rx={12} fill={T.violet.bg} stroke={T.violet.bd} strokeWidth={2} />
          <text x={725} y={69} fill={C.ink}>Entra ID (SSO)</text>
          <rect x={620} y={130} width={210} height={64} rx={12} fill={T.teal.bg} stroke={T.teal.bd} strokeWidth={2} />
          <text x={725} y={169} fill={C.ink}>PostgreSQL</text>
          <rect x={300} y={300} width={230} height={64} rx={12} fill={T.yellow.bg} stroke={T.yellow.bd} strokeWidth={2} />
          <text x={415} y={339} fill={C.ink}>File de messages</text>
          <rect x={160} y={430} width={210} height={64} rx={12} fill={T.green.bg} stroke={T.green.bd} strokeWidth={2} />
          <text x={265} y={469} fill={C.ink}>Notifications</text>
          <rect x={460} y={430} width={210} height={64} rx={12} fill={T.green.bg} stroke={T.green.bd} strokeWidth={2} />
          <text x={565} y={469} fill={C.ink}>Adaptateur paie</text>
          <rect x={720} y={430} width={120} height={64} rx={12} fill={T.coral.bg} stroke={T.coral.bd} strokeWidth={2} />
          <text x={780} y={469} fill={C.ink}>SAP</text>
        </g>
        <g stroke={C.faint} strokeWidth={3} fill="none">
          <path d="M190 75 L300 140" />
          <path d="M190 235 L300 185" />
          <path d="M530 140 L620 62" />
          <path d="M530 162 L620 162" />
          <path d="M415 210 L415 300" />
          <path d="M380 364 L285 430" />
          <path d="M450 364 L545 430" />
          <path d="M670 462 L720 462" />
        </g>
      </svg>
    </div>
  </Frame>
);

// ─── M6 · ADR ───────────────────────────────────────────────────────────────
const M6_Adr: Page = () => (
  <Frame mod={6}>
    <Title>Documenter la décision : l’ADR</Title>
    <Lede>Architecture Decision Record : une page, versionnée avec le code. L’IA rédige ; la décision est la vôtre.</Lede>
    <CodeDark cls={A.in} file="docs/adr/001-monolithe-modulaire.md" lang="md" size={20} style={{ position: 'absolute', left: 120, top: 270, width: 1000, ...dl(100) }}>
      <Fn># ADR-001 · Un monolithe modulaire</Fn>
      {'\n'}- Statut : accepté · 2026-11-03{'\n'}
      {'\n'}
      <Fn>## Contexte</Fn>
      {'\n'}4 développeurs, pilote en 3 sprints, pic prévisible,{'\n'}paie SAP par lot. Aucune expérience microservices.{'\n'}
      {'\n'}
      <Fn>## Décision</Fn>
      {'\n'}Nous construirons un monolithe modulaire (Menu,{'\n'}Commande, Paiement, Rapport) et une file de messages.{'\n'}
      {'\n'}
      <Fn>## Alternatives</Fn> · microservices · sans serveur{'\n'}
      <Fn>## Conséquences</Fn> · un pipeline · frontières à tester
    </CodeDark>
    <div style={{ position: 'absolute', left: 1180, top: 270, width: 620, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card cls={A.in} tone="green" icon="check" title="Pourquoi un ADR" size={23} style={dl(200)}>
        Dans un an, on saura pourquoi. Et quand le contexte change, on écrit l’ADR-002 qui le remplace.
      </Card>
      <PromptBox cls={A.in} label="Avocat du diable" size={22} style={dl(300)}>
        Critique cet ADR : quel scénario ferait regretter cette décision dans 2 ans ? Que faudrait-il surveiller ?
      </PromptBox>
    </div>
  </Frame>
);

// ─── M6 · Estimation ────────────────────────────────────────────────────────
const Story = ({ n, id, title, pts, sprint, dep, bad }: { n: number; id: string; title: string; pts: number; sprint: string; dep?: string; bad?: boolean }) => (
  <div className={n ? b.on(n) : undefined} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 70px 90px 120px', alignItems: 'center', columnGap: 12, height: 58, borderBottom: `1.5px solid ${C.rule}`, background: bad ? T.coral.bg : undefined, padding: '0 12px' }}>
    <span style={{ fontFamily: mono, fontSize: 20, color: T.blue.fg }}>{id}</span>
    <span style={{ fontSize: 22, color: C.ink }}>{title}</span>
    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 28, color: bad ? C.coral : C.ink, textAlign: 'center' }}>{pts}</span>
    <span style={{ fontSize: 20, color: C.muted, textAlign: 'center' }}>{sprint}</span>
    <span style={{ fontFamily: mono, fontSize: 18, color: C.muted }}>{dep ?? '—'}</span>
  </div>
);

const M6_Estimate: Page = () => (
  <Frame mod={6} beats={3}>
    <Title>Estimer et planifier : l’IA propose, l’équipe engage</Title>
    <Lede>User stories, critères Gherkin, points de Fibonacci, sprints. Puis vérifier la capacité et les dépendances.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '14px 10px', ...dl(100) }}>
      <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 70px 90px 120px', columnGap: 12, padding: '0 12px 8px', borderBottom: `2px solid ${C.ink}` }}>
        <Eyebrow c={C.muted} size={18}>Id</Eyebrow>
        <Eyebrow c={C.muted} size={18}>Story</Eyebrow>
        <Eyebrow c={C.muted} size={18}>Pts</Eyebrow>
        <Eyebrow c={C.muted} size={18}>Sprint</Eyebrow>
        <Eyebrow c={C.muted} size={18}>Dépend de</Eyebrow>
      </div>
      <Story n={0} id="US-01" title="Connexion avec le compte Microsoft" pts={5} sprint="1" />
      <Story n={0} id="US-02" title="Publier le menu de la semaine" pts={5} sprint="1" />
      <Story n={0} id="US-05" title="Précommander et choisir un créneau" pts={8} sprint="2" dep="US-01 US-02" />
      <Story n={0} id="US-07" title="Payer par carte" pts={8} sprint="2" dep="US-05" />
      <Story n={2} id="US-12" title="Payer par retenue sur la paie" pts={13} sprint="2" dep="US-07" bad />
      <Story n={0} id="US-08" title="Tableau des quantités en cuisine" pts={5} sprint="3" dep="US-05" />
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card cls={b.on(1)} tone="blue" icon="list" title="Ce que l’IA fait bien" size={22}>
        Découper en stories, rédiger les critères d’acceptation, signaler les dépendances.
      </Card>
      <Card cls={b.on(2)} tone="coral" icon="alert" title="Ce qu’elle rate" size={22}>
        Sprint 2 : 29 points pour une vélocité de 20. Et 13 points = trop gros : découpez.
      </Card>
      <Card cls={b.on(3)} tone="green" icon="users" title="Ce qui reste à l’équipe" size={22}>
        L’engagement : le planning poker humain, l’IA en préparation (estimations à justifier).
      </Card>
    </div>
  </Frame>
);

// ─── M6 · Dependencies and risks ────────────────────────────────────────────
const RiskDot = ({ x, y, tone, label }: { x: number; y: number; tone: Tone; label: string }) => (
  <g>
    <circle cx={x} cy={y} r={16} fill={STRONG[tone]} />
    <text x={x + 24} y={y + 7} fontFamily="Barlow" fontSize={21} fill={C.ink}>
      {label}
    </text>
  </g>
);

const M6_Risks: Page = () => (
  <Frame mod={6}>
    <Title>Dépendances et risques : l’IA analyse, un outil vérifie</Title>
    <Lede>Elle recense, classe et propose des mesures. Pour les failles connues, seul un outil d’audit fait foi.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 760, height: 560, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: 20, ...dl(100) }}>
      <Eyebrow c={C.muted} size={19}>
        Registre des risques · probabilité × impact
      </Eyebrow>
      <svg width={720} height={490} viewBox="0 0 720 490" style={{ display: 'block' }}>
        <rect x={60} y={20} width={640} height={420} fill={C.panel} rx={10} />
        <rect x={380} y={20} width={320} height={210} fill={T.coral.bg} rx={10} />
        <line x1={60} y1={230} x2={700} y2={230} stroke={C.rule} strokeWidth={2} />
        <line x1={380} y1={20} x2={380} y2={440} stroke={C.rule} strokeWidth={2} />
        <text x={380} y={475} fontFamily="Barlow" fontSize={19} fill={C.muted} textAnchor="middle">
          Probabilité →
        </text>
        <text x={30} y={230} fontFamily="Barlow" fontSize={19} fill={C.muted} textAnchor="middle" transform="rotate(-90 30 230)">
          Impact →
        </text>
        <RiskDot x={420} y={80} tone="coral" label="Paie SAP en retard" />
        <RiskDot x={450} y={160} tone="coral" label="Dépendances obsolètes" />
        <RiskDot x={110} y={60} tone="yellow" label="Allergène erroné" />
        <RiskDot x={260} y={150} tone="yellow" label="Pic de 10 h 30" />
        <RiskDot x={420} y={330} tone="teal" label="Caisse du prestataire" />
        <RiskDot x={140} y={330} tone="teal" label="Adoption faible" />
      </svg>
    </div>
    <div style={{ position: 'absolute', left: 940, top: 270, width: 860 }}>
      <Term cls={A.in} title="pip-audit --disable-pip --no-deps -r requirements-legacy.txt" size={19} style={dl(250)}>
        {'Name      Version  ID               Fix Versions\n'}
        {'django    2.2.0    '}
        <Ko>PYSEC-2019-13</Ko>
        {'    2.2.4\n'}
        {'requests  2.19.1   '}
        <Ko>PYSEC-2018-28</Ko>
        {'    2.20.0\n'}
        {'pyyaml    5.3      '}
        <Ko>PYSEC-2021-142</Ko>
        {'   5.4\n'}
        {'jinja2    2.10     '}
        <Ko>PYSEC-2019-217</Ko>
        {'   2.10.1\n…\n'}
        <Ko>139 vulnérabilités connues dans 7 paquets sur 7</Ko>
      </Term>
      <Callout cls={A.in} title="Piège mesuré" tone="coral" icon="alert" size={23} style={{ marginTop: 22, ...dl(400) }}>
        L’IA cite des numéros de CVE plausibles… parfois inexistants ou attribués au mauvais paquet. Croisez toujours avec pip-audit, npm audit ou la base OSV.
      </Callout>
      <Hint cls={A.in} style={{ marginTop: 16, ...dl(500) }}>
        Audit réel du 29 octobre 2026, sortie abrégée : le total augmente avec le temps.
      </Hint>
    </div>
  </Frame>
);

// ─── Lab 10 ─────────────────────────────────────────────────────────────────
const L10_Brief: Page = () => (
  <LabBrief
    mod={6}
    n="10"
    title="Concevoir et planifier avec l’IA"
    dur="35 min"
    folder="lab10-architecture"
    objective="Utiliser l’IA comme partenaire d’architecture : questions, options, ADR, backlog estimé, risques et audit des dépendances, en vérifiant chaque affirmation."
    cmd={
      <>
        <Pr>pytest labs/lab10-architecture</Pr>
        {'\n'}
        <Ko>17 failed</Ko>
        {'  '}
        <Cm>livrables à créer</Cm>
        {'\n'}
        <Pr>npm run test:lab10</Pr>
      </>
    }
    deliverable="5 fichiers dans livrables/ : architecture.md, adr-001.md, backlog.csv, risques.md, dependances.md. Tests verts."
  >
    <LabStep n={1} t="5 min" title="Questions d’abord">
      Les 8 questions de l’IA ; répondez à 3 en tant que PO
    </LabStep>
    <LabStep n={2} t="8 min" title="Architecture + ADR">
      2 options contrastées, diagramme Mermaid, décision documentée
    </LabStep>
    <LabStep n={3} t="12 min" title="Backlog et planification">
      12 stories ou plus ; les tests vérifient vélocité et dépendances
    </LabStep>
    <LabStep n={4} t="10 min" title="Risques et dépendances">
      Registre des risques ; audit vérifié par pip-audit / npm audit
    </LabStep>
  </LabBrief>
);

const L10_Go: Page = () => (
  <LabGo mod={6} n="10" minutes={35} folder="lab10-architecture">
    <CheckItem id="l10-1">Questions obtenues, 3 réponses de PO données</CheckItem>
    <CheckItem id="l10-2">architecture.md (Mermaid) et adr-001.md</CheckItem>
    <CheckItem id="l10-3">backlog.csv : vélocité 20 et dépendances respectées</CheckItem>
    <CheckItem id="l10-4">risques.md : 5 risques avec mesures</CheckItem>
    <CheckItem id="l10-5">dependances.md vérifié par un outil d’audit</CheckItem>
  </LabGo>
);

// ─── M6 · Synthesis ─────────────────────────────────────────────────────────
const M6_Synth: Page = () => (
  <SynthPage
    mod={6}
    title="Module 6 · Ce qu’il faut retenir"
    poste={<>À votre prochaine décision technique : faites poser les questions, demandez deux options, écrivez l’ADR. Et ajoutez pip-audit ou npm audit à votre pipeline.</>}
  >
    <SynthRow n={1} tone="blue" d={100}>
      Les questions avant la solution ; vos contraintes en contexte
    </SynthRow>
    <SynthRow n={2} tone="teal" d={200}>
      Options contrastées et compromis, pas « la meilleure »
    </SynthRow>
    <SynthRow n={3} tone="violet" d={300}>
      Diagrammes et ADR en minutes ; la décision reste humaine
    </SynthRow>
    <SynthRow n={4} tone="yellow" d={400}>
      Estimations : à justifier, vérifier vélocité et dépendances
    </SynthRow>
    <SynthRow n={5} tone="coral" d={500}>
      Dépendances et CVE : un outil d’audit fait foi
    </SynthRow>
  </SynthPage>
);

// ─── Module 7 divider ───────────────────────────────────────────────────────
const M7_Divider: Page = () => (
  <Section n={7} title="Ateliers pratiques : un projet complet avec un agent" sub="Tout assembler : instructions, plan, code, tests, documentation, pull request revue." dur="≈ 1 h 30" kind="atelier">
    <SecItem n={1}>Mettre en place un projet avec l’IA</SecItem>
    <SecItem n={2}>Développement complet : code, tests, documentation</SecItem>
    <SecItem n={3}>Débriefing et intégration en entreprise</SecItem>
  </Section>
);
M7_Divider.transition = BLOOM;

// ═══ 85-m7 ═════════════════════════════════════════════════════════════

// ─── M7 · The final project ─────────────────────────────────────────────────
const M7_Project: Page = () => (
  <Frame mod={7} kind="lab">
    <Title>Le projet : taches, un gestionnaire de tâches en ligne de commande</Title>
    <Lede>Petit, complet, et entièrement spécifié : 6 commandes, des règles, des codes de sortie, des tests d’acceptation.</Lede>
    <Term cls={A.in} title="python -m taches" size={21} style={{ position: 'absolute', left: 120, top: 280, width: 960, ...dl(100) }}>
      <Pr>taches ajouter "Préparer la démo" --priorite haute --echeance 2026-11-05 --etiquette ia</Pr>
      {'\n'}Tâche 1 ajoutée : Préparer la démo{'\n'}
      <Pr>taches ajouter "Relire la PR #42" --etiquette revue</Pr>
      {'\n'}Tâche 2 ajoutée : Relire la PR #42{'\n'}
      <Pr>taches lister</Pr>
      {'\n'}[ ] 1  haute    2026-11-05  Préparer la démo  #ia{'\n'}
      [ ] 2  normale  —           Relire la PR #42  #revue{'\n'}
      <Pr>taches terminer 1</Pr>
      {'\n'}Tâche 1 terminée{'\n'}
      <Pr>taches exporter --format csv</Pr>
      {'\n'}id,titre,priorite,echeance,etiquettes,terminee{'\n'}…
    </Term>
    <div style={{ position: 'absolute', left: 1140, top: 280, width: 660, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card cls={A.in} tone="blue" icon="doc" title="SPEC.md" size={22} style={dl(200)}>
        Les commandes, l’ordre d’affichage, les identifiants jamais réutilisés, les formats d’export, les codes de sortie 0 / 1 / 2.
      </Card>
      <Card cls={A.in} tone="green" icon="check" title="Tests d’acceptation" size={22} style={dl(300)}>
        16 en Python, 11 en TypeScript : tous rouges. Interdit de les modifier.
      </Card>
      <Card cls={A.in} tone="violet" icon="note" title="AGENTS.md" size={22} style={dl(400)}>
        Un gabarit d’instructions pour l’agent, à compléter en premier.
      </Card>
    </div>
  </Frame>
);

// ─── M7 · Team workflow with an agent ───────────────────────────────────────
const FlowStep = ({ n, x, icon, tone, title, sub }: { n: number; x: number; icon: IconName; tone: Tone; title: string; sub: string }) => (
  <div className={b.pop(n)} style={{ position: 'absolute', left: x, top: 290, width: 260, height: 300, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '24px 20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={n} tone={tone} size={40} />
      <IconTile name={icon} tone={tone} size={48} />
    </div>
    <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 30, lineHeight: 1.08, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 21, lineHeight: 1.4, color: C.soft }}>{sub}</div>
  </div>
);

const M7_Workflow: Page = () => (
  <Frame mod={7} beats={6}>
    <Title>Le flux de travail d’une équipe avec un agent</Title>
    <Lede>Ce qu’on fait au lab 11, et ce qu’on peut adopter dès lundi.</Lede>
    <FlowStep n={1} x={120} icon="note" tone="violet" title="Instructions" sub="AGENTS.md : conventions, commandes, interdits" />
    <FlowStep n={2} x={404} icon="map" tone="blue" title="Plan validé" sub="L’agent propose, vous corrigez, puis on code" />
    <FlowStep n={3} x={688} icon="code" tone="teal" title="Incréments" sub="Une commande à la fois, tests verts, commit" />
    <FlowStep n={4} x={972} icon="doc" tone="green" title="Documentation" sub="README généré, chaque exemple lancé" />
    <FlowStep n={5} x={1256} icon="eye" tone="yellow" title="PR et revue" sub="Description relue, revue IA, revue humaine" />
    <FlowStep n={6} x={1540} icon="star" tone="coral" title="Rétrospective" sub="Ce que l’agent a bien fait, 2 erreurs détectées" />
    <Callout cls={b.on(6)} title="Le principe" tone="blue" icon="humanCheck" size={25} style={{ position: 'absolute', left: 120, top: 660, width: 1680 }}>
      L’agent accélère chaque étape ; aucune étape ne disparaît. Les points de contrôle humains sont le plan, chaque diff, et la fusion.
    </Callout>
  </Frame>
);

// ─── Lab 11 ─────────────────────────────────────────────────────────────────
const L11_Brief: Page = () => (
  <LabBrief
    mod={7}
    n="11"
    title="Projet final, de la spécification à la PR"
    dur="55 min"
    folder="lab11-projet-final"
    objective="Développer de bout en bout un petit outil avec un agent (plan, code, tests, documentation, pull request revue) en suivant le flux d’une équipe."
    cmd={
      <>
        <Pr>pytest labs/lab11-projet-final</Pr>
        {'\n'}
        <Ko>16 failed</Ko>
        {'\n'}
        <Pr>npm run test:lab11</Pr>
        {'\n'}
        <Ko>ℹ fail 11</Ko>
      </>
    }
    deliverable="Tests d’acceptation verts + 5 tests à vous, README, AGENTS.md, NOTES.md, une PR revue sur votre fork."
  >
    <LabStep n={1} t="5 min" title="Préparer l’agent">
      Branche lab11, AGENTS.md complété avec l’IA
    </LabStep>
    <LabStep n={2} t="5 min" title="Plan avant le code">
      L’agent propose ; vous corrigez le découpage modele / depot / cli
    </LabStep>
    <LabStep n={3} t="25 min" title="Incréments">
      ajouter + lister, terminer / supprimer, en-retard, exporter
    </LabStep>
    <LabStep n={4} t="10 min" title="README et PR">
      Exemples vérifiés ; PR relue, revue IA, réponses aux commentaires
    </LabStep>
    <LabStep n={5} t="5 min" title="Rétrospective">
      NOTES.md : temps, réussites, 2 erreurs de l’agent
    </LabStep>
  </LabBrief>
);

const L11_Go: Page = () => (
  <LabGo mod={7} n="11" minutes={55} folder="lab11-projet-final">
    <CheckItem id="l11-1">AGENTS.md complété, plan validé</CheckItem>
    <CheckItem id="l11-2">ajouter + lister, puis terminer / supprimer</CheckItem>
    <CheckItem id="l11-3">en-retard et exporter : acceptation au vert</CheckItem>
    <CheckItem id="l11-4">5 tests unitaires à vous, README vérifié</CheckItem>
    <CheckItem id="l11-5">PR ouverte, revue, NOTES.md rédigé</CheckItem>
  </LabGo>
);

// ─── M7 · Presentations ─────────────────────────────────────────────────────
const Crit = ({ n, title, children }: { n: number; title: string; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 20px', ...dl(100 + n * 100) }}>
    <Num n={n} tone="yellow" size={44} />
    <div>
      <div style={{ fontSize: 26, fontWeight: 600, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 21, color: C.muted }}>{children}</div>
    </div>
  </div>
);

const M7_Present: Page = () => (
  <Frame mod={7} kind="atelier" label="Module 07 · Présentations">
    <Title>Vos présentations : 2 à 3 minutes en partage d’écran</Title>
    <Lede>Chacun son tour, dans l’ordre de la liste. Au-delà de 10 personnes : 5 ou 6 volontaires, les autres déposent une capture.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1000, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Crit n={1} title="La démo">
        Trois commandes de votre outil, en direct
      </Crit>
      <Crit n={2} title="Le chiffre">
        Tests verts, temps passé, nombre d’itérations
      </Crit>
      <Crit n={3} title="Une erreur de l’agent">
        Et comment vous l’avez détectée
      </Crit>
      <Crit n={4} title="Une leçon pour votre équipe">
        Ce que vous referiez, ce que vous éviteriez
      </Crit>
    </div>
    <Timer id="present" minutes={3} label="Présentation" cls={A.in} style={{ position: 'absolute', left: 1220, top: 290, width: 580, ...dl(400) }} />
    <Callout cls={A.in} title="Rétroaction" tone="green" icon="chat" size={24} style={{ position: 'absolute', left: 1220, top: 600, width: 580, ...dl(500) }}>
      Un point fort et une piste, au micro. Puis « participant suivant ».
    </Callout>
  </Frame>
);

// ─── M7 · Integrating AI in the company ─────────────────────────────────────
const Pillar = ({ n, icon, tone, title, children }: { n: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ boxSizing: 'border-box', height: 470, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '26px 24px' }}>
    <IconTile name={icon} tone={tone} size={60} />
    <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 32, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
  </div>
);
const Pb = ({ children, tone = 'blue' }: { children: ReactNode; tone?: Tone }) => (
  <Bullet size={22} tone={tone}>
    {children}
  </Bullet>
);

const M7_Enterprise: Page = () => (
  <Frame mod={7} beats={4}>
    <Title>Intégrer l’IA dans l’équipe : quatre chantiers</Title>
    <Lede>Les outils sont prêts. Ce qui fait la différence : les règles, les pratiques, la mesure, la formation.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: 22 }}>
      <Pillar n={1} icon="shield" tone="coral" title="Gouvernance">
        <Pb tone="coral">Outils et modèles autorisés</Pb>
        <Pb tone="coral">Offre entreprise : pas d’entraînement sur vos données</Pb>
        <Pb tone="coral">Filtre de code public, journalisation</Pb>
        <Pb tone="coral">Données interdites dans les demandes</Pb>
      </Pillar>
      <Pillar n={2} icon="note" tone="blue" title="Pratiques">
        <Pb>Instructions de projet versionnées</Pb>
        <Pb>Bibliothèque de demandes partagée</Pb>
        <Pb>Checklist dans le modèle de PR</Pb>
        <Pb>Agents sur branche, jamais sur main</Pb>
      </Pillar>
      <Pillar n={3} icon="chart" tone="green" title="Mesure">
        <Pb tone="green">Délai de cycle des PR</Pb>
        <Pb tone="green">Taux de défauts, retours arrière</Pb>
        <Pb tone="green">Couverture et score de mutation</Pb>
        <Pb tone="green">Ressenti de l’équipe, pas seulement la vitesse</Pb>
      </Pillar>
      <Pillar n={4} icon="users" tone="yellow" title="Adoption">
        <Pb tone="yellow">Un projet pilote, 4 à 6 semaines</Pb>
        <Pb tone="yellow">Des référents, une démo par sprint</Pb>
        <Pb tone="yellow">Partager les échecs, pas seulement les succès</Pb>
        <Pb tone="yellow">Garder les juniors dans la boucle</Pb>
      </Pillar>
    </div>
  </Frame>
);

// ─── M7 · Debrief poll ──────────────────────────────────────────────────────
const M7_Debrief: Page = () => (
  <Frame mod={7} label="Module 07 · Débriefing">
    <Title>Débriefing : où l’IA vous a-t-elle le plus aidé ?</Title>
    <Lede>Un numéro chacun, au micro. Puis : où vous a-t-elle le plus ralenti ?</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1000 }}>
      <Poll cls={A.in} style={dl(100)}>
        <PollRow id="gen" icon="code" tone="blue" label="1 · Générer du code à partir d’une spec" />
        <PollRow id="refac" icon="loop" tone="teal" label="2 · Refactoriser, optimiser" />
        <PollRow id="debug" icon="bug" tone="coral" label="3 · Déboguer, expliquer une erreur" />
        <PollRow id="doc" icon="doc" tone="violet" label="4 · Documenter, faire la revue" />
        <PollRow id="tests" icon="check" tone="green" label="5 · Écrire des tests, le pipeline" />
        <PollRow id="archi" icon="map" tone="yellow" label="6 · Concevoir, planifier" />
      </Poll>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1200, top: 280, width: 600, ...dl(300) }}>
      <Card tone="grey" icon="chat" title="Deux questions ouvertes" size={24}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
          <span>Quelle tâche ne confierez-vous jamais à un agent ?</span>
          <span>Quelle règle proposerez-vous à votre équipe la semaine prochaine ?</span>
        </div>
      </Card>
    </div>
  </Frame>
);

// ═══ 90-close ══════════════════════════════════════════════════════════

// ─── Close · The journey ────────────────────────────────────────────────────
const CLMod = ({ n, tone, title, labs, d, children }: { n: number; tone: Tone; title: string; labs: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ boxSizing: 'border-box', height: 330, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '22px 22px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Num n={pad(n)} tone={tone} size={44} />
      <Tag tone="green" size={17}>
        {labs}
      </Tag>
    </div>
    <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 28, lineHeight: 1.1, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 21, lineHeight: 1.4, color: C.soft }}>{children}</div>
  </div>
);

const CL_Journey: Page = () => (
  <Frame mod={9} kind="synthese">
    <Title>Deux jours, sept modules, douze labs</Title>
    <Lede>Du premier Tab à la pull request revue.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', columnGap: 14 }}>
      <CLMod n={1} tone="blue" title="Panorama" labs="00 · 01" d={100}>
        Il prédit ; le contexte guide ; 4 modes.
      </CLMod>
      <CLMod n={2} tone="teal" title="Générer, réécrire" labs="02 · 03" d={170}>
        5 ingrédients, tests, petites étapes.
      </CLMod>
      <CLMod n={3} tone="coral" title="Déboguer, optimiser" labs="04 · 05" d={240}>
        Expliquer, mesurer, valider.
      </CLMod>
      <CLMod n={4} tone="violet" title="Doc et revue" labs="06 · 07" d={310}>
        Convention, exemples vérifiés, tri.
      </CLMod>
      <CLMod n={5} tone="green" title="Tests et CI/CD" labs="08 · 09" d={380}>
        Mutation, intégration, charge, pipeline.
      </CLMod>
      <CLMod n={6} tone="yellow" title="Architecture" labs="10" d={450}>
        Questions, options, ADR, audit.
      </CLMod>
      <CLMod n={7} tone="blue" title="Projet final" labs="11" d={520}>
        Un agent encadré, de la spec à la PR.
      </CLMod>
    </div>
    <Callout cls={A.in} title="Le fil des deux jours" tone="yellow" icon="humanCheck" size={27} style={{ position: 'absolute', left: 120, top: 680, width: 1680, ...dl(700) }}>
      L’IA propose, vous décidez, les tests tranchent. Vous restez l’auteur du code que vous fusionnez.
    </Callout>
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
      q="Lesquelles de ces pratiques recommanderiez-vous à votre équipe ?"
      explain="Contexte écrit une fois, critères objectifs, relecture des tests modifiés, données protégées : l’IA accélère sans que la qualité ne dépende de la chance."
    >
      <Opt ok why="Oui : des instructions versionnées donnent le même comportement à toute l’équipe.">Versionner un fichier d’instructions de projet</Opt>
      <Opt why="Piège ! Une PR dont l’agent a modifié les tests doit être relue en priorité, pas fusionnée plus vite.">
        Fusionner sans revue si l’agent annonce « tous les tests passent »
      </Opt>
      <Opt ok why="Oui : la couverture dit ce qui s’exécute ; la mutation dit ce qui est vérifié.">
        Juger une suite de tests générée par la mutation, pas seulement la couverture
      </Opt>
      <Opt why="Piège ! Un secret collé dans un outil non approuvé est un secret divulgué.">
        Coller la configuration de production pour déboguer plus vite
      </Opt>
    </Qcm>
  </Frame>
);

// ─── Close · Personal action plan ───────────────────────────────────────────
const CLWhen = ({ d, tone, icon, when, children, ex }: { d: number; tone: Tone; icon: IconName; when: string; children: ReactNode; ex: string }) => (
  <div className={A.in} style={{ boxSizing: 'border-box', height: 470, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '30px 32px', display: 'flex', flexDirection: 'column', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={72} solid />
    <div style={{ marginTop: 20, fontFamily: display, fontWeight: 700, fontSize: 44, color: C.ink }}>{when}</div>
    <div style={{ marginTop: 10, fontSize: 28, lineHeight: 1.42, color: C.soft }}>{children}</div>
    <div style={{ marginTop: 'auto', background: T[tone].bg, borderRadius: 12, padding: '14px 18px', fontSize: 23, lineHeight: 1.4, color: C.ink }}>
      <b>Exemple :</b> {ex}
    </div>
  </div>
);

const CL_Action: Page = () => (
  <Frame mod={9} label="Clôture · Plan d’action">
    <Title>Votre plan d’action : trois engagements</Title>
    <Lede>Écrivez-les maintenant, dans un document à vous (la dernière page du guide PDF est prévue pour ça).</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 30 }}>
      <CLWhen d={100} tone="blue" icon="bolt" when="Cette semaine" ex="le fichier d’instructions de mon dépôt, avec 5 règles.">
        Un usage essayé sur un vrai ticket.
      </CLWhen>
      <CLWhen d={250} tone="teal" icon="calendar" when="Ce mois-ci" ex="tests générés + mutation sur mon module le moins testé.">
        Une pratique installée dans votre routine.
      </CLWhen>
      <CLWhen d={400} tone="green" icon="users" when="Dans 3 mois" ex="un pilote d’agent sur un dépôt, avec des mesures avant / après.">
        Une pratique partagée avec l’équipe.
      </CLWhen>
    </div>
    <Callout cls={A.in} title="Petit et précis" tone="yellow" icon="target" size={26} style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(600) }}>
      « Ajouter la checklist de validation à notre modèle de PR » plutôt que « utiliser l’IA plus souvent ».
    </Callout>
  </Frame>
);

// ─── Close · Toolbox ────────────────────────────────────────────────────────
const CLTool = ({ d, icon, tone, title, children }: { d: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <Card tone={tone} icon={icon} title={title} size={23} cls={A.in} style={{ height: 250, ...dl(d) }}>
    {children}
  </Card>
);

const CL_Toolbox: Page = () => (
  <Frame mod={9} label="Clôture · Boîte à outils">
    <Title>Votre boîte à outils</Title>
    <Lede>Tout reste disponible après la formation : le dépôt, le guide PDF et ce support.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', rowGap: 26, columnGap: 26 }}>
      <CLTool d={100} icon="code" tone="blue" title="Le dépôt des labs">
        12 labs indépendants, Python et TypeScript, à refaire dans n’importe quel ordre.
      </CLTool>
      <CLTool d={180} icon="book" tone="teal" title="Le guide PDF">
        Une fiche par lab, le canevas de demande et l’aide-mémoire des commandes.
      </CLTool>
      <CLTool d={260} icon="list" tone="violet" title="Le canevas de demande">
        Contexte, tâche, contraintes, format, exemples. Module 2.
      </CLTool>
      <CLTool d={340} icon="check" tone="green" title="La checklist de validation">
        Cinq questions avant chaque Tab, diff ou fusion. Module 3.
      </CLTool>
      <CLTool d={420} icon="eye" tone="yellow" title="La grille de revue">
        Gravité, format de commentaire, verdict. Lab 07.
      </CLTool>
      <CLTool d={500} icon="note" tone="coral" title="Les gabarits">
        Instructions de projet, AGENTS.md, ADR, workflow CI. Labs 07 à 11.
      </CLTool>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 830, ...dl(600) }}>
      <RepoChip size={26} />
    </div>
  </Frame>
);

// ─── Close · Thanks ─────────────────────────────────────────────────────────
const CL_Thanks: Page = () => (
  <Frame mod={9} chrome={false}>
    <img src={logoStack} alt="Technologia" className={A.fade} style={{ position: 'absolute', left: 112, top: 78, height: 120, display: 'block' }} />
    <div style={{ position: 'absolute', left: 120, top: 300, width: 1000 }}>
      <Eyebrow cls={A.in} size={28}>
        Formation IA132 · Fin
      </Eyebrow>
      <h1 className={A.in} style={{ margin: '18px 0 0', fontFamily: display, fontWeight: 700, fontSize: 128, lineHeight: 1.0, color: C.ink, ...dl(120) }}>
        Merci !
      </h1>
      <p className={A.in} style={{ margin: '26px 0 0', fontSize: 38, lineHeight: 1.35, color: C.soft, ...dl(240) }}>
        L’IA écrit le premier jet. <Hl>Vous signez le commit.</Hl>
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
  title: 'IA132-IA pour développeurs : code assisté e',
  createdAt: '2026-10-28T23:48:17.849Z',
  theme: 'technologia',
  labs: labsPack,
};

export default [
  DV_Cover,
  DV_Trainer,
  DV_HowWeWork,
  DV_Roundtable,
  DV_Objectives,
  DV_Program,
  DV_Repo,
  DV_LabMap,
  L00_Brief,
  DV_Quiz0,
  M1_Divider,
  M1_Timeline,
  M1_Predict,
  M1_Context,
  M1_Tools,
  M1_Models,
  M1_Modes,
  M1_ModesEx,
  M1_AgentLoop,
  M1_UseCases,
  M1_Evidence,
  M1_Quiz,
  L01_Brief,
  L01_Go,
  M1_Synth,
  M2_Divider,
  M2_Anatomy,
  M2_BeforeAfter,
  M2_Instructions,
  M2_Completion,
  M2_Pattern,
  M2_Quiz,
  L02_Brief,
  L02_Go,
  M2_Refactor,
  M2_Smells,
  M2_RefactorPrompts,
  L03_Brief,
  L03_Go,
  M2_Practices,
  M2_Synth,
  M3_Divider,
  M3_Method,
  M3_Context,
  M3_Detection,
  M3_Symptom,
  L04_Brief,
  L04_Go,
  M3_Complexity,
  M3_Measure,
  L05_Brief,
  L05_Go,
  M3_Hallucinations,
  M3_Security,
  M3_Validate,
  M3_Quiz,
  M3_Synth,
  J1_Wrap,
  J1_Exit,
  J2_Cover,
  J2_Recall,
  J2_Program,
  M4_Divider,
  M4_DocLevels,
  M4_Docstring,
  M4_Readme,
  L06_Brief,
  L06_Go,
  M4_Style,
  M4_Hotspots,
  M4_ReviewFlow,
  M4_ReviewPrompt,
  L07_Brief,
  L07_Go,
  M4_Quiz,
  M4_Synth,
  M5_Divider,
  M5_Pyramid,
  M5_Behaviours,
  M5_Mutation,
  M5_Smells,
  L08_Brief,
  L08_Go,
  M5_Integration,
  M5_Load,
  M5_Pipeline,
  L09_Brief,
  L09_Go,
  M5_Quiz,
  M5_Synth,
  M6_Divider,
  M6_Partner,
  M6_Questions,
  M6_Options,
  M6_Adr,
  M6_Estimate,
  M6_Risks,
  L10_Brief,
  L10_Go,
  M6_Synth,
  M7_Divider,
  M7_Project,
  M7_Workflow,
  L11_Brief,
  L11_Go,
  M7_Present,
  M7_Enterprise,
  M7_Debrief,
  CL_Journey,
  CL_Quiz,
  CL_Action,
  CL_Toolbox,
  CL_Thanks,
] satisfies Page[];

// Speaker notes — one entry per page, same order as the default export.
export const notes: (string | undefined)[] = [
  `⏱ 2 min · ACCUEIL (page affichée pendant l'arrivée des participants)

OBJECTIF — Poser le cadre : deux jours pour passer de « j'utilise parfois un assistant » à « je sais quand et comment l'utiliser, et comment vérifier ce qu'il produit ».

DIRE — « Bonjour et bienvenue à la formation IA132, IA pour développeurs. Pendant deux jours, on va écrire, corriger, tester, documenter et concevoir du code avec un assistant d'IA, dans votre IDE. »

Montrer l'animation : « À droite, ce que vous verrez souvent : l'assistant propose la suite en gris. Tab pour accepter, Échap pour refuser. Toute la formation tient dans ce geste : accepter en connaissance de cause. »

LOGISTIQUE — Classe virtuelle, 9 h – 16 h, pauses 10 h 30 et 14 h 30 (14 h 15 le jour 2), dîner 12 h – 13 h. Vérifiez son, caméra, partage d'écran. Demandez à chacun d'ouvrir son IDE et un navigateur sur GitHub.

TRANSITION — « Quelques mots sur moi. »`,
  `⏱ 2 min

OBJECTIF — Établir la crédibilité technique et le contrat pédagogique.

DIRE — Présentez-vous en 60 secondes. À PERSONNALISER : vos langages, un projet où un assistant vous a fait gagner une journée… et un où il vous a fait perdre une heure.

Les quatre engagements :
1. « Du vrai code dès la première heure : le lab 00 se fait dans 20 minutes. »
2. « Je ne vends aucun outil. On compare Copilot, Cursor, JetBrains et Claude Code ; prenez celui que vous avez. »
3. « 12 labs indépendants avec des tests : vous saurez objectivement quand c'est fini. »
4. « Un regard lucide : on verra des études où l'IA accélère, et une où elle ralentit des développeurs expérimentés. »

TRANSITION — « Voici comment on va travailler. »`,
  `⏱ 2 min

OBJECTIF — Expliquer les codes visuels et les règles de la classe virtuelle.

DIRE — « Les étiquettes en haut des pages vous disent ce qu'on fait. »
• QCM (violet) — « Vous annoncez votre lettre à voix haute, je clique la réponse majoritaire. »
• DÉMO (bleu) — « Je partage mon IDE. »
• EXERCICE (vert clair) — « On manipule à l'écran : vous me dites où placer chaque étiquette. »
• LAB (vert) — « Chacun sur son poste, minuteur affiché, tests qui valident. »

RÈGLES — Questions à tout moment. Aucun code de votre entreprise dans les outils pendant la formation : tout est fictif dans les labs. Pas de fil rouge : chaque lab est indépendant, vous pourrez les refaire dans n'importe quel ordre.

CLASSE VIRTUELLE — Caméra si possible, micro coupé hors échanges ; deux écrans idéalement.

TRANSITION — « Faisons connaissance. »`,
  `⏱ 15 min (1 min par personne)

OBJECTIF — Connaître le groupe : langages, IDE, outils, attentes. Adapter les démos (Python ou TypeScript ? VS Code ou JetBrains ?).

ANIMATION — Lancez le minuteur. Appelez chaque personne par son prénom, dans l'ordre de la liste des participants ; micro ouvert, trois réponses. Notez les IDE et les langages : faites vos démos dans le plus fréquent.

SONDAGE — Chacun annonce un numéro de 1 à 5. Cliquez la ligne par réponse (« − » corrige).

LECTURE —
• Majorité 1–2 : prenez le temps au module 1 sur la complétion et le contexte.
• Majorité 3–4 : insistez sur la vérification, les instructions de projet et le mode agent.
• Quelqu'un en 5 : demandez-lui de partager ses règles au module 7.

TRANSITION — « Voici ce que vous saurez faire dans deux jours. »`,
  `⏱ 2 min

OBJECTIF — Présenter les cinq objectifs officiels comme une progression.

DIRE — « Cinq marches, qui suivent les objectifs du programme. »
1. GÉNÉRER — « Générer et refactoriser du code avec de bons prompts : module 2. »
2. CORRIGER — « Détecter, corriger, optimiser, en validant : module 3. »
3. DOCUMENTER — « Documentation et revues automatisées : module 4. »
4. TESTER — « Tests unitaires et d'intégration, branchés dans la CI/CD : module 5. »
5. CONCEVOIR — « Architecture, estimation, planification, risques : module 6. »

« Et le module 7 assemble tout dans un projet final avec un agent. »

INTERACTION — « Quelle marche vous intéresse le plus ? Un chiffre. » Deux ou trois réponses.

TRANSITION — « Voici le déroulé. »`,
  `⏱ 2 min

OBJECTIF — Donner de la visibilité sur les deux jours.

DIRE — « Jour 1 : écrire et corriger. Module 1, le panorama. Module 2, générer et refactoriser. Module 3, déboguer, optimiser, et connaître les limites. »

« Jour 2 : la qualité et la conception. Module 4, documentation et revue. Module 5, tests, charge et CI/CD. Module 6, architecture et planification. Puis le module 7 : un projet complet avec un agent, que vous présenterez en partage d'écran. »

À SOULIGNER — Chaque module se termine par un ou deux labs : environ 40 % du temps est de la pratique.

TRANSITION — « Parlons justement des labs. »`,
  `⏱ 3 min · LE DÉPÔT

OBJECTIF — Donner le lien du dépôt et faire forker tout de suite.

ACTION — Collez le lien du dépôt dans le clavardage : https://github.com/houssemeddinelassoued/ia132-labs (à adapter si vous avez publié le dépôt ailleurs). Collez aussi le lien de téléchargement du bouton « Labs » (guide PDF inclus).

DIRE — « Un seul dépôt pour les 12 labs. Forkez-le maintenant : vous aurez votre copie, pour pousser et ouvrir des pull requests, notamment aux labs 09 et 11. »
« Chaque lab a un README qui est aussi sa fiche dans le guide PDF : objectif, point de départ, étapes, livrable, pièges, bonus. »
« Python ou TypeScript, au choix, pour chaque lab. En TypeScript, Node 22.18 ou plus récent suffit : rien à installer. »

TRANSITION — « Voici la carte des 12 labs. »`,
  `⏱ 2 min · CARTE DES LABS

OBJECTIF — Relier chaque lab à son module et à son objectif.

DIRE — « Chaque carte vous donne le numéro du lab, son module, sa durée et son objectif. La couleur est celle du module. »
« Les labs sont indépendants : si vous manquez un lab, ça ne bloque pas le suivant. Et vous pouvez les refaire après la formation, dans l'ordre que vous voulez. »
« Le lab 11 est le projet final : il réutilise tout, avec un agent. »

ASTUCE — Laissez cette page affichée quelques secondes pendant que les participants terminent le fork.

TRANSITION — « On commence tout de suite par le lab 00. »`,
  `⏱ 10 min · LAB 00

OBJECTIF — Que tous les postes soient prêts avant le module 1.

ANIMATION — Laissez 10 minutes. Point d'étape à 5 minutes : « Où en êtes-vous : étape 1, 2, 3 ou 4 ? »

PROBLÈMES FRÉQUENTS —
• Windows : « python » introuvable → « py ».
• Proxy d'entreprise : pip install --proxy.
• Pas de licence Copilot : essai gratuit, ou Cursor / Claude Code / JetBrains AI.
• Node < 22.18 : faire le lab en Python, ou mettre Node à jour.

Si quelqu'un est bloqué plus de 3 minutes : partage d'écran, on règle ensemble. Le reste du groupe peut lire la carte des labs.

TRANSITION — « Tout le monde est prêt ? Testons vos intuitions. »`,
  `⏱ 4 min · QCM À RÉPONSES MULTIPLES

OBJECTIF — Faire émerger les représentations sans juger.

ANIMATION — Lisez la question. Les participants annoncent leurs lettres (« A et C »). Cochez la majorité, « Valider ma sélection », puis cliquez chaque option pour l'explication. → révèle les bonnes réponses, puis l'essentiel.

RÉPONSES — A et C.
• A ✓ — Le mode agent fait exactement cela : on le pratique au lab 01 et au lab 11.
• B ✗ PIÈGE — « Compiler n'est pas être correct. On verra au module 3 une étude où 45 % des extraits générés contenaient une faille. »
• C ✓ — Expliquer une trace : un des usages les plus rentables (lab 04).
• D ✗ PIÈGE — « Il ne connaît vos conventions que si vous les écrivez : fichiers d'instructions, module 2. »

MESSAGE CLÉ — L'IA propose, vous décidez et vous vérifiez.

TRANSITION — « Commençons par le panorama. »`,
  `⏱ 1 min · DÉBUT DU MODULE 1 (≈ 9 h 30)

OBJECTIF — Annoncer le plan du module.

DIRE — « Module 1 : panorama des assistants de codage. D'où viennent ces outils, comment ils produisent du code, ce qui distingue Copilot, Cursor, JetBrains AI ou Claude Code, et surtout les quatre façons de travailler avec eux. »

RYTHME — Environ 35 minutes de contenu, puis le lab 01 (20 min) avant la pause de 10 h 30.

TRANSITION — « Remontons cinq ans en arrière. »`,
  `⏱ 3 min · 6 CLICS

OBJECTIF — Montrer l'évolution : de l'outil qui complète à l'équipier qui exécute.

→ beat 1 : « 2021 : Copilot arrive en préversion. Il complète la ligne ou la fonction, en gris. Une révolution… sur quelques lignes. »
→ beat 2 : « 2022 : ChatGPT. On décrit en français, on copie-colle le code. Mais le code sort de l'IDE, sans le contexte du projet. »
→ beat 3 : « 2023 : le chat entre dans l'IDE : Copilot Chat, JetBrains AI, Cursor. Il voit vos fichiers. »
→ beat 4 : « 2024 : on choisit son modèle, l'édition porte sur plusieurs fichiers, et un protocole ouvert, MCP, permet de brancher des outils. »
→ beat 5 : « 2025 : les agents. Le mode agent de Copilot, Claude Code, GPT-5 : l'IA lance les tests, lit l'erreur et corrige. »
→ beat 6 : « 2026 : on confie un ticket à un agent, il ouvre une pull request ; les équipes partagent des fichiers d'instructions. »

MESSAGE — « Chaque étape donne plus d'autonomie à l'outil. Et donc plus d'importance à ce que vous vérifiez. »

TRANSITION — « Mais au fond, comment ça produit du code ? »`,
  `⏱ 3 min · 3 CLICS

OBJECTIF — Démystifier : un modèle de langage prédit le jeton suivant.

DIRE — « Le curseur est après "1 -". Le modèle calcule une probabilité pour chaque suite possible. »
→ beat 1 : « 71 % pour "taux / 100", 18 % pour "taux" tout court… Il prend en général la plus probable. » Les chiffres sont illustratifs.
→ beat 2 : « Probable, c'est le résultat de milliards de lignes lues. Mais pas prouvé : "1 - taux" s'exécute très bien… et donne un prix négatif pour une remise de 20 %. »
→ beat 3 : « Bonne nouvelle : vous pouvez déplacer ces probabilités. Le nom de la fonction, la docstring "taux %", un type, un test : tout cela rend la bonne suite plus probable. »

INTERACTION — « Qui a déjà accepté une suggestion qui avait l'air parfaite et ne l'était pas ? » Une anecdote au micro.

TRANSITION — « Ce qui m'amène au contexte. »`,
  `⏱ 3 min · 3 CLICS

OBJECTIF — Faire comprendre que la qualité de la réponse dépend du contexte envoyé au modèle.

→ beat 1 : « Par défaut, l'assistant voit le fichier ouvert autour du curseur, les onglets ouverts, votre sélection. »
→ beat 2 : « Vous pouvez en ajouter : joindre un fichier (#file dans Copilot, @ dans Cursor), tout l'espace de travail, des instructions de projet, et en mode agent, les résultats du terminal et des tests. »
→ beat 3 : « La suggestion est aussi bonne que ce contexte. Trop peu : il invente. Trop : il se perd. »

RÈGLE D'OR — Joindre les bons fichiers, fermer les onglets sans rapport, écrire ses conventions une fois (on le fait au module 2).

TRANSITION — « Quels outils font tout cela ? »`,
  `⏱ 4 min

OBJECTIF — Présenter les outils du programme sans tomber dans la comparaison de versions.

DIRE — Un outil par carte, 40 secondes chacun :
• GitHub Copilot : « Dans VS Code, JetBrains, Visual Studio. Complétion, chat, édition, mode agent ; on peut lui assigner un ticket GitHub et il ouvre une PR ; il fait aussi des revues de PR. »
• GPT-5 / ChatGPT : « Le modèle phare d'OpenAI, utilisable dans ChatGPT, par API, dans Codex, et comme modèle dans Copilot ou Cursor. »
• JetBrains AI Assistant : « Intégré à IntelliJ, PyCharm, WebStorm : complétion, actions sur le code, et Junie, l'agent de JetBrains. »
• Cursor : « Un éditeur dérivé de VS Code, conçu autour de l'IA : complétion multi-lignes, agent, règles de projet. »
• Claude Code : « Un agent en ligne de commande, qui s'intègre aussi aux IDE. Il planifie, modifie, lance les tests. »

MESSAGE — « Les fonctions convergent. Choisissez selon votre IDE, les modèles autorisés par votre entreprise et la gouvernance (journalisation, données). »

ATTENTION — Vérifiez la veille les nouveautés de chaque outil : les noms de modèles et les offres changent souvent.

TRANSITION — « Parlons justement des modèles, dont GPT-5. »`,
  `⏱ 3 min

OBJECTIF — Présenter les capacités avancées de GPT-5 (programme) et apprendre à choisir un type de modèle.

DIRE — « GPT-5 combine une réponse rapide et un raisonnement plus long quand la tâche le demande. Il appelle des outils et enchaîne des étapes : c'est ce qui rend les agents possibles. Il lit de longs contextes et des images : une capture d'écran peut devenir une première interface. »

TABLEAU — Lire 2 ou 3 lignes : « Pour compléter une ligne, un modèle rapide suffit. Pour un bogue de concurrence ou un algorithme, un modèle de raisonnement fait souvent mieux, mais plus lentement et plus cher. »

INTERACTION — « Dans votre outil, savez-vous quel modèle répond ? » Faites ouvrir le sélecteur de modèle (ils l'ont noté au lab 00).

TRANSITION — « Au-delà du modèle, c'est la façon de travailler qui compte : les 4 modes. »`,
  `⏱ 4 min · 4 CLICS

OBJECTIF — Distinguer les 4 modes par le niveau d'autonomie et le type de contrôle.

→ beat 1 : COMPLÉTION — « Vous décidez de chaque ligne avec Tab. Risque : accepter sans lire. »
→ beat 2 : CHAT — « Il répond, vous appliquez. Risque : croire une affirmation fausse. »
→ beat 3 : ÉDITION — « Il propose un diff, sur un ou plusieurs fichiers que vous désignez. Votre contrôle : relire le diff. »
→ beat 4 : AGENT — « Il enchaîne seul : lire, modifier, lancer, corriger. Votre contrôle : le plan, les garde-fous, la revue finale. »

MESSAGE — « Aucun mode n'est meilleur. On choisit selon la taille de la tâche et ce qu'on peut vérifier. »

TRANSITION — « À vous de jouer : quel mode pour quelle tâche ? »`,
  `⏱ 5 min · EXERCICE GLISSER-DÉPOSER

OBJECTIF — Ancrer le choix du mode sur des tâches concrètes.

ANIMATION — « Dites-moi où va chaque étiquette. » Prenez les propositions au micro, déplacez l'étiquette, demandez pourquoi. Double-clic : remet une étiquette à sa place.

PROPOSITION DE CORRIGÉ (plusieurs réponses se défendent) —
• Getter évident, tableau de constantes → Complétion.
• Comprendre un module de 800 lignes, choisir entre deux bibliothèques, expliquer une trace → Chat.
• Renommer un concept dans 6 fichiers → Édition (ou le refactoring de l'IDE, encore plus sûr !).
• Migrer 40 tests, ajouter une commande + ses tests → Agent.

À SOULIGNER — « Le renommage : l'outil de refactorisation de l'IDE est déterministe. L'IA n'est pas toujours le meilleur outil. »

TRANSITION — « Regardons de plus près ce que fait un agent. »`,
  `⏱ 3 min · 3 CLICS

OBJECTIF — Comprendre la boucle d'un agent et où l'humain intervient.

DIRE — « Un agent tourne en boucle : il planifie, lit le code, modifie, exécute. Si les tests sont rouges, il lit l'erreur et recommence. Le point bleu tourne : c'est ça, un agent. »
→ beat 1 : les 4 étapes apparaissent.
→ beat 2 : « Vos points de contrôle : valider le plan, approuver les commandes sensibles, relire le diff, décider de fusionner. »
→ beat 3 : « Ce qui peut mal tourner : il modifie un test pour le faire passer, sort du périmètre, installe un paquet inconnu ou tourne en rond. D'où les garde-fous : instructions de projet, branche dédiée, permissions, tests comme critère d'arrêt. »

TRANSITION — « Concrètement, pour une équipe, où sont les gains ? »`,
  `⏱ 3 min

OBJECTIF — Les cas d'usage et bénéfices pour les équipes (programme).

DIRE — Parcourir les 6 cartes, en reliant chacune à un module :
• Code répétitif → module 2.
• Comprendre l'inconnu : « Le gain le plus sous-estimé : l'accueil d'un nouveau dans l'équipe. »
• Tests → module 5. Documentation et revue → module 4.
• Migrations : « Gros volume, très bon cas pour un agent… avec une très bonne suite de tests. »

INTERACTION — « Lequel de ces 6 vous ferait gagner le plus de temps cette semaine ? Un mot chacun. » 3 ou 4 réponses.

TRANSITION — « Et que disent les études sur ces gains ? »`,
  `⏱ 4 min

OBJECTIF — Donner une vision lucide, chiffres sourcés.

DIRE —
• « +55 % : l'étude de GitHub en 2022. 95 développeurs devaient écrire un serveur HTTP en JavaScript ; ceux avec Copilot ont fini 55 % plus vite. Tâche courte, bien définie. »
• « −19 % : l'étude de METR, juillet 2025. 16 développeurs open source expérimentés, sur leurs propres dépôts, 246 tâches. Avec l'IA, ils ont été 19 % plus lents… alors qu'ils estimaient avoir gagné 20 %. »
• « 84 % : l'enquête Stack Overflow 2025 : 84 % utilisent ou vont utiliser l'IA. Mais 46 % se méfient de l'exactitude. »
• « 66 % : la première frustration citée, c'est le code presque juste. »

MESSAGE — « Les deux études ne se contredisent pas : le gain dépend de la tâche, du contexte et de l'expérience. D'où l'intérêt de mesurer chez vous. »

TRANSITION — « Petit test. »`,
  `⏱ 3 min · QCM

ANIMATION — Les participants annoncent A, B, C ou D. Cliquez la réponse majoritaire, puis les autres. → révèle la bonne réponse, puis l'essentiel.

RÉPONSE — A.
• B ✗ PIÈGE — « Le réflexe "c'est sûrement une nouvelle version" fait perdre beaucoup de temps. »
• C ✗ — Le mode agent peut exécuter et détecter l'erreur, mais il peut aussi se tromper.
• D ✗ — En complétion, rien n'est exécuté.

MESSAGE — On appelle cela une hallucination. On en verra une variante dangereuse au module 3 : les paquets qui n'existent pas.

TRANSITION — « À vous de pratiquer les 4 modes. »`,
  `⏱ 2 min · CONSIGNE DU LAB 01

DIRE — « Lab 01, dossier labs/lab01-decouverte. Un convertisseur d'unités : 5 fonctions avec leur documentation, sans code. Vous allez les écrire avec les 4 modes, dans l'ordre. »
« Étape 1 : la complétion. Effacez la ligne raise, attendez la suggestion grise, lisez-la avant Tab. »
« Étape 2 : le chat explique et cherche des cas limites. »
« Étape 3 : l'édition réécrit convertir() avec un dictionnaire. Lisez le diff. »
« Étape 4 : l'agent ajoute une fonction main() pour faire passer test_cli. Regardez quels fichiers il lit et quelles commandes il lance. »

PIÈGE À ANNONCER — « Si l'agent modifie les tests pour les faire passer, refusez. Écrivez dans votre demande : ne modifie pas les tests. »

TRANSITION — « Minuteur lancé. »`,
  `⏱ 20 min · LAB 01 EN AUTONOMIE

ANIMATION — Lancez le minuteur. Points d'étape à 7 et 14 minutes : « Où en êtes-vous : étape 1, 2, 3 ou 4 ? » Cochez la checklist pour illustrer l'avancement du groupe.

BLOCAGES FRÉQUENTS —
• Pas de suggestion grise : vérifier que l'extension est connectée (icône en bas de l'IDE).
• Mode édition introuvable : Copilot Edits est intégré au chat dans les versions récentes (mode « Edit » ou « Agent » dans la liste).
• Imports en Python : lancer pytest depuis la racine du dépôt.

DÉBRIEF (3 min, en fin de lab) — « Pour chaque mode, une phrase : utile pour… à éviter pour… » Deux ou trois participants au micro.

Puis pause de 10 h 30.`,
  `⏱ 2 min · SYNTHÈSE DU MODULE 1

DIRE — Lire les cinq points en une phrase chacun.
Encadré bleu : « Dès lundi, notez une tâche où l'assistant vous a fait gagner du temps, et une où il vous en a fait perdre. C'est votre propre étude, plus utile que les miennes. »

TRANSITION — « Pause. Au retour : comment bien demander. »

⏸ PAUSE 10 h 30 – 10 h 45.`,
  `⏱ 1 min · DÉBUT DU MODULE 2 (≈ 10 h 45)

DIRE — « Module 2 : génération et réécriture de code. Comment écrire une demande qui produit du code juste du premier coup, comment guider la complétion, et comment refactoriser du code existant sans rien casser. Deux labs : générer à partir d'une spécification avant le dîner, refactoriser du code hérité juste après. »

TRANSITION — « Commençons par l'anatomie d'une bonne demande. »`,
  `⏱ 4 min · 6 CLICS

OBJECTIF — Donner une structure de demande réutilisable (elle est en annexe A du guide PDF).

→ beat 1 : CONTEXTE — « Langage, version, le fichier concerné, les conventions. L'IA ne devine pas que vos montants sont en cents. »
→ beat 2 : TÂCHE — « Un verbe d'action précis. Implémente, refactorise, explique, compare. »
→ beat 3 : CONTRAINTES — « Ce qui ne doit pas changer. C'est souvent ce qu'on oublie, et c'est là que l'IA déborde. »
→ beat 4 : FORMAT — « Un diff ? Un plan sans code ? Des tests ? Dites-le. »
→ beat 5 : EXEMPLES — « Une entrée, la sortie attendue. Le meilleur moyen de lever une ambiguïté. »
→ beat 6 : lire l'exemple complet. « C'est exactement la demande du lab 02, avant le dîner. »

TRANSITION — « Voyons la différence en direct. »`,
  `⏱ 4 min · DÉMO · 2 CLICS

OBJECTIF — Montrer que le code généré reflète la demande.

DÉMO (si possible en direct dans l'IDE, sinon avec la page) —
→ beat 1 : « Demande vague : il invente un taux de 15 %, mélange TPS et TVQ, utilise des nombres à virgule. Et round() en Python arrondit 0,5 au pair : 50,5 donne 50. Ce code passe une revue rapide… et donne des factures fausses. »
→ beat 2 : « Demande structurée, avec SPEC.md et les tests joints : chaque règle est nommée, les montants sont des entiers, l'arrondi est exact. Et surtout : les tests disent si c'est juste. »

MESSAGE — « La demande vague n'est pas plus rapide : elle déplace le travail vers la relecture et le débogage. »

TRANSITION — « Certaines informations reviennent dans toutes vos demandes : écrivez-les une fois. »`,
  `⏱ 3 min

OBJECTIF — Présenter les fichiers d'instructions de projet.

DIRE — « Chaque outil lit un fichier d'instructions à chaque demande : .github/copilot-instructions.md pour Copilot, AGENTS.md, un format ouvert lu par de plus en plus d'agents, les règles de Cursor, CLAUDE.md, les guidelines de Junie. »
« On y met les langages, les conventions, les commandes de test, les règles d'équipe, et surtout ce qui est interdit. »
« Il est versionné avec le code : toute l'équipe obtient le même comportement, et on le fait évoluer par pull request. »

ACTION — Faites ouvrir .github/copilot-instructions.md dans le dépôt des labs.

TRANSITION — « Passons à la complétion : comment la guider. »`,
  `⏱ 3 min · 3 CLICS

OBJECTIF — Montrer que la complétion suit l'intention écrite avant le curseur.

DIRE — « Un nom explicite, des types, une docstring qui dit le cas limite, et un exemple doctest. »
→ beat 1 : la suggestion apparaît. « Il a repris le ValueError de la docstring, et le weekday() < 5. »
→ beat 2 : « Ce qui guide : tout ce qui précède le curseur et les fichiers ouverts. Le commentaire devient une spécification. »
→ beat 3 : « Ce qu'il faut relire : inclus ou exclus ? Jours fériés ? La suggestion répond à la docstring, pas à votre métier. S'il y a des jours fériés au Québec dans votre besoin, il faut le dire. »

TRANSITION — « La complétion est aussi contextuelle : elle continue vos motifs. »`,
  `⏱ 3 min · DÉMO · 2 CLICS

OBJECTIF — L'autocomplétion contextuelle : continuer un motif.

DÉMO — Dans l'IDE : écrivez deux tests, tapez « def test_ » et laissez venir la suggestion.
→ beat 1 : « Il propose le cas d'erreur : il l'a trouvé dans la docstring de dates.py, ouvert dans un autre onglet. »
→ beat 2 : « Astuce : écrivez le nom du test d'abord. test_un_jour_ferie : la suggestion suivra le nom. »

À SOULIGNER — Très efficace pour les tests paramétrés, les tables de données, les mappers. Moins pour la logique métier nouvelle.

TRANSITION — « Un QCM avant le lab. »`,
  `⏱ 3 min · QCM

RÉPONSE — B.
• A ✗ — « Corrige » sans contexte : l'IA reprédit au hasard.
• C ✗ PIÈGE — Changer l'attendu du test masque le bogue. C'est le piège n° 1 des agents.
• D ✗ — Tout réécrire rend le diff illisible.

MESSAGE — Collez le message d'échec, l'attendu, la contrainte. On le refait au lab 02, étape 4.

TRANSITION — « À vous : lab 02. »`,
  `⏱ 2 min · CONSIGNE DU LAB 02

DIRE — « Lab 02, labs/lab02-generation. Une boutique en ligne québécoise : TPS, TVQ, codes promo, livraison gratuite, arrondi au cent. Tout est dans SPEC.md. 12 tests d'acceptation sont rouges. »
« Votre mission : écrire le prompt dans PROMPT.md avec les 5 ingrédients, générer, puis itérer avec les messages d'échec. »
« Interdit de modifier les tests. »

PIÈGES À ANNONCER — round() en Python ; les montants en float ; « le rabais peut faire perdre la livraison gratuite ».

TRANSITION — « Minuteur lancé, 25 minutes. »`,
  `⏱ 25 min · LAB 02 EN AUTONOMIE

ANIMATION — Points d'étape à 8 et 16 minutes : « Combien de tests verts après la première génération ? » (souvent 8 à 10 sur 12). Écoutez les chiffres au micro : c'est un excellent débriefing.

BLOCAGES FRÉQUENTS —
• test_arrondi : round() → arrondi demi vers le haut en entiers.
• test_le_rabais_peut_faire_perdre_la_livraison_gratuite : la livraison se calcule après le rabais.
• TypeScript : RangeError attendue, pas Error.

DÉBRIEF (3 min) — « Combien d'itérations ? Quelle règle l'IA a-t-elle ratée ? » Deux participants partagent leur PROMPT.md au micro ou en capture dans le clavardage.

⏸ DÎNER 12 h – 13 h. Au retour : refactorisation.`,
  `⏱ 4 min · 5 CLICS · RETOUR DU DÎNER (13 h)

OBJECTIF — Poser la méthode de refactorisation sûre avec l'IA.

DIRE — « Refactoriser, c'est changer la structure sans changer le comportement. Comment le prouver ? »
→ beat 1 : « Tests de caractérisation : on fige les sorties actuelles, même bizarres. On ne juge pas, on photographie. »
→ beat 2 : « Diagnostic par l'IA, sans code. »
→ beat 3 : « Un plan en 5 étapes maximum. Vous le validez. »
→ beat 4 : « Une étape à la fois : demander, relire le diff, lancer les tests. »
→ beat 5 : « Un commit par étape verte. Si ça casse : git restore, on reformule. Et la flèche verte : on boucle sur l'étape suivante. »

PIÈGE — « J'en ai profité pour corriger un bogue » : jamais dans un commit de refactorisation.

TRANSITION — « Voyons ce que l'IA sait bien réécrire. »`,
  `⏱ 3 min · DÉMO · 2 CLICS

OBJECTIF — Montrer une refactorisation typique (c'est le code du lab 03).

DIRE — « À gauche, le code hérité : noms d'une lettre, quatre niveaux de if, des nombres magiques, et le même bloc copié pour chaque région. »
→ beat 1 : « Après : une grille de tarifs par région, une fonction frais_livraison avec des retours anticipés. Une nouvelle région, c'est une ligne. »
→ beat 2 : « Complexité de 17 à 4. Mais attention : les arrondis et les seuils stricts (supérieur à 100, pas supérieur ou égal) doivent rester identiques. C'est là que l'IA "améliore" sans le dire. »

TRANSITION — « Les demandes qui mènent là. »`,
  `⏱ 3 min

OBJECTIF — Donner 4 demandes types (diagnostic, plan, une étape, optimiser).

DIRE — Lire les 4 cartes. Insister : « Séparer le diagnostic, le plan et l'exécution, c'est garder la main. L'IA qui fait tout d'un coup produit un diff de 300 lignes impossible à relire. »
« La 4ᵉ demande, optimiser, prépare le module 3. »

OUTILS — Mesurer la complexité : ruff C901 en Python, la règle complexity d'ESLint en TypeScript. On le fait au lab 03.

TRANSITION — « À vous : lab 03. »`,
  `⏱ 1 min · CONSIGNE DU LAB 03

DIRE — « Lab 03, labs/lab03-refactorisation. Une fonction traiter() de 2017. Les tests de caractérisation sont verts : ils doivent le rester à chaque étape. »
« Objectif mesurable : faire passer traiter() sous le seuil de complexité 8, en 3 à 5 commits. »

PIÈGE À ANNONCER — Le print devient une exception ? C'est un changement de comportement. Un logging.warning est acceptable : discutez-en.

TRANSITION — « 25 minutes. »`,
  `⏱ 25 min · LAB 03 EN AUTONOMIE

ANIMATION — Points d'étape à 10 et 18 minutes : « Combien de commits verts ? »

BLOCAGES FRÉQUENTS —
• Test cassé après une étape : git restore . puis demander une étape plus petite.
• L'IA change round(t + f, 2) en round(t, 2) + round(f, 2) : comportement différent, le golden master le détecte.
• TypeScript : pas d'outil de complexité installé : compter les niveaux d'imbrication, ou npx eslint avec la règle complexity.

DÉBRIEF (3 min) — « Quelle étape l'IA a-t-elle ratée ? Combien de git restore ? »`,
  `⏱ 5 min · EXERCICE · CARTES

OBJECTIF — Réinvestir les bonnes pratiques.

ANIMATION — Pour chaque carte : « Comment la réécririez-vous ? » Écoutez une ou deux propositions au micro, puis cliquez la carte pour la retourner.

À SOULIGNER — Les quatre principes : un critère mesurable, de petites étapes, la trace plutôt que la paraphrase, penser avant d'écrire.

TRANSITION — « Synthèse du module 2. »`,
  `⏱ 2 min · SYNTHÈSE DU MODULE 2

DIRE — Lire les cinq points. Encadré : « Créez le fichier d'instructions de votre projet dès lundi, avec 5 règles. Ça prend 15 minutes et ça sert à toute l'équipe. »

TRANSITION — « Module 3 : quand le code ne marche pas. »`,
  `⏱ 1 min · DÉBUT DU MODULE 3 (≈ 13 h 30)

DIRE — « Module 3 : débogage et optimisation avec l'IA. La méthode pour trouver une cause racine, l'optimisation mesurée, et un moment important : les limites. Où l'IA se trompe, avec quelle fréquence, et comment valider. Deux labs : une chasse aux bogues, puis une optimisation. »

TRANSITION — « Commençons par la méthode. »`,
  `⏱ 4 min · 6 CLICS

OBJECTIF — Poser une méthode de débogage où l'IA intervient à chaque étape, sans en sauter aucune.

→ beat 1 : REPRODUIRE — « Un cas minimal qui échoue à chaque fois. L'IA peut écrire le script ou le test de reproduction. »
→ beat 2 : ISOLER — « La plus petite entrée qui échoue. L'IA résume très bien une trace de 200 lignes. »
→ beat 3 : EXPLIQUER — « Avant de toucher au code : comprendre. "Explique cette trace", pas "corrige". »
→ beat 4 : HYPOTHÈSES — « Deux ou trois causes possibles. Vous les vérifiez une par une : lecture, print, débogueur. »
→ beat 5 : CORRIGER — « La cause, pas le symptôme : on y revient dans deux pages. »
→ beat 6 : PROUVER — « Un test qui échoue sans la correction, et passe avec. Sinon, le bogue reviendra. »

TRANSITION — « Que faut-il donner à l'IA pour l'étape 3 ? »`,
  `⏱ 4 min · DÉMO · 2 CLICS

OBJECTIF — Montrer une demande de débogage efficace (c'est le ticket INC-101 du lab 04).

DÉMO — Lancez en direct python labs/lab04-debogage/python/tableau_de_bord.py, collez la trace dans le chat avec le fichier.
DIRE — « La trace complète, le fichier, l'attendu. Et je demande une explication et deux options, pas de code. »
→ beat 1 : la réponse. « La cause : aucun jour, donc len(jours) vaut zéro. Deux options : un test au début, ou un try/except. »
→ beat 2 : « C'est moi qui choisis. L'option 1 traite la cause. Et ensuite : le test qui le prouve. »

TRANSITION — « Avant même de déboguer, des outils détectent beaucoup d'erreurs. »`,
  `⏱ 3 min · 5 CLICS

OBJECTIF — Situer l'IA parmi les outils de détection automatique (programme : détection automatique des erreurs).

→ beat 1 : « La base : l'analyse statique dans l'IDE. ruff, ESLint. Gratuit, instantané, déterministe. »
→ beat 2 : « Le typage : mypy, pyright, tsc en mode strict. »
→ beat 3 : « Les tests : ils vérifient le comportement. »
→ beat 4 : « L'IA : elle explique un avertissement obscur, propose la correction (/fix dans Copilot, "Expliquer l'erreur" dans JetBrains), et fait de la revue de PR. »
→ beat 5 : « Et la CI qui rejoue tout à chaque push. » Carte jaune : « L'IA complète le linter ; elle ne le remplace pas. »

TRANSITION — « Quand l'IA propose une correction, méfiez-vous de la plus courte. »`,
  `⏱ 3 min · 2 CLICS

OBJECTIF — Distinguer pansement et correction de la cause.

DIRE — « À gauche, la correction la plus fréquente proposée : un try/except autour de tout. »
→ beat 1 : « Elle avale toutes les erreurs. Demain, une clé absente affichera 0 % sans un bruit. »
→ beat 2 : « À droite : le cas métier, aucune réservation, est explicite. Les autres erreurs restent visibles. »

INTERACTION — « Qui a déjà vu un except vide en production ? » Une anecdote au micro.

TRANSITION — « À vous de chasser les bogues : lab 04. »`,
  `⏱ 2 min · CONSIGNE DU LAB 04

DIRE — « Lab 04, labs/lab04-debogage. Un module de réservation de salles en production, et un rapport d'incidents : 5 tickets du support. Ils décrivent des symptômes, pas des causes. 4 tests verts, 5 rouges : un par ticket. »
« Méthode : reproduire, faire expliquer, hypothèse, vérifier, corriger, prouver. Un commit par ticket, avec la cause dans le message. »

PIÈGES À ANNONCER — INC-104 : « round(x + 0.0001) "marche"… et échoue ailleurs. Exigez une explication : la représentation binaire des décimaux. » INC-105 en bonus.

TRANSITION — « 25 minutes. »`,
  `⏱ 25 min · LAB 04 EN AUTONOMIE

ANIMATION — Points d'étape à 8 et 16 minutes : « Combien de tickets fermés ? »

INDICES SI BLOCAGE (dans l'ordre) —
• INC-102 : borne de fin d'une tranche (slice) : exclue.
• INC-103 : intervalles semi-ouverts [début, fin[ : < au lieu de <=.
• INC-104 : 31,15 × 1,5 vaut 46,72499… en binaire ; Decimal en Python, calcul en cents en TypeScript.
• INC-105 : timedelta.seconds ignore les jours ; total_seconds(). En TypeScript : getHours() ignore la date.

DÉBRIEF (3 min) — « Quel ticket l'IA a-t-elle résolu du premier coup ? Lequel l'a fait tourner en rond ? »

⏸ PAUSE 14 h 30 – 14 h 45 (si le lab se termine avant, faites la pause ici).`,
  `⏱ 3 min · 3 CLICS · RETOUR DE PAUSE

OBJECTIF — Faire sentir ce qu'est un O(n²), avec des mesures réelles.

DIRE — « La fonction communs() du lab 05 : un "in" sur une liste, à l'intérieur d'une boucle. »
→ beat 1 : « 2 000 courriels : 0,1 seconde. 4 000 : 0,43. 8 000 : 1,9. 20 000 : 12 secondes. Quand la taille double, le temps est multiplié par 4. C'est la signature du quadratique. »
→ beat 2 : « Avec un ensemble (set) : 20 000 courriels en 2 centièmes. 200 000 en un quart de seconde. 700 fois plus rapide. »
→ beat 3 : « L'IA repère très bien ces motifs : recherche dans une liste, count() dans une boucle, requêtes N+1 sur une base. Demandez-lui la complexité ligne par ligne. »

Mesures faites sur un portable pendant la préparation ; vos participants auront d'autres chiffres, mais le même rapport.

TRANSITION — « Encore faut-il savoir où chercher. »`,
  `⏱ 3 min

OBJECTIF — Mesurer avant d'optimiser.

DIRE — « Le profileur dit où le temps passe. Ici, dedoublonner appelée 4 000 fois : c'est elle. »
« La méthode en trois temps : mesurer, faire proposer, prouver avec les mêmes tests et un nouveau chrono. »
Carte rouge : « list(set(...)) est rapide mais perd l'ordre ; un test du lab le détecte. Et une compréhension de liste à la place d'une boucle ne change pas un O(n²). »

Le profil affiché est simplifié pour la lisibilité.

TRANSITION — « Lab 05. »`,
  `⏱ 1 min · CONSIGNE DU LAB 05

DIRE — « Lab 05, labs/lab05-performance. Trois fonctions correctes mais lentes. Les tests de comportement sont verts ; deux budgets de temps sont rouges. »
« Mesurez d'abord, faites analyser, appliquez une fonction à la fois, mesurez après. »

TRANSITION — « 20 minutes. »`,
  `⏱ 20 min · LAB 05 EN AUTONOMIE

ANIMATION — Point d'étape à 10 minutes : « Quel facteur entre avant et après ? » Recueillez les chiffres au micro.

INDICES —
• Python : dict.fromkeys() garde l'ordre ; Counter pour les comptes, mais trier soi-même pour les égalités.
• TypeScript : new Set() garde l'ordre d'insertion ; Map pour les comptes.

DÉBRIEF (2 min) — « Quelqu'un a-t-il eu un list(set()) qui a cassé l'ordre ? »`,
  `⏱ 4 min

OBJECTIF — Les limites (programme : limites et validation humaine) : hallucinations.

DIRE — Les 4 cartes :
• « API inventées : on l'a vu avec read_excelx. »
• « Paquets fantômes : la variante dangereuse. Une étude de 2025 a analysé 576 000 extraits de code produits par 16 modèles : près de 20 % des paquets cités n'existaient pas. Un attaquant peut publier un paquet sous ce nom : c'est le slopsquatting. »
• « Connaissances datées : le modèle a une date de coupure ; il propose parfois une API dépréciée. »
• « Fausse certitude : "ce code est thread-safe". Une affirmation n'est pas une preuve. »

Le taux varie beaucoup selon les modèles (bien plus faible pour les modèles commerciaux de l'étude) : retenez le réflexe, pas le chiffre exact.

TRANSITION — « Autre limite : la sécurité. »`,
  `⏱ 4 min

OBJECTIF — Sécurité, confidentialité, licences.

DIRE — « Veracode a testé en 2025 plus de 100 modèles sur 80 tâches de code : 45 % des extraits générés contenaient une faille du Top 10 OWASP. Le modèle reproduit ce qu'il a lu, y compris le mauvais code. »
Les 4 cartes : injection, secrets et cryptographie faible, vos données (ce que vous collez part chez le fournisseur : suivez la politique de l'entreprise, privilégiez les offres entreprise sans entraînement sur vos données), licences (filtre de code public dans Copilot).

MESSAGE — « Le code généré passe par les mêmes contrôles que le vôtre. On fera une vraie revue de sécurité au lab 07. »

TRANSITION — « Concrètement, que vérifier ? »`,
  `⏱ 3 min · CHECKLIST INTERACTIVE

OBJECTIF — Une checklist de validation humaine réutilisable.

ANIMATION — Lisez les 5 questions. « Pour le code que vous avez accepté aujourd'hui, comptez pour vous combien de cases vous auriez cochées. » Cochez à l'écran pour illustrer, sans demander de score public.

CITATION — « Vous êtes l'auteur du code que vous fusionnez, quel que soit celui qui l'a tapé. » C'est aussi en annexe A du guide PDF.

TRANSITION — « Un dernier QCM. »`,
  `⏱ 3 min · QCM

RÉPONSE — B.
• A ✗ PIÈGE — Installer exécute du code (scripts d'installation, dépendances).
• C ✗ — La même IA peut confirmer son invention.
• D ✗ — Un nom proche d'un paquet connu, c'est précisément le typosquatting.

TRANSITION — « Synthèse du module 3. »`,
  `⏱ 2 min · SYNTHÈSE DU MODULE 3

DIRE — Lire les 5 points. Encadré : « Ajoutez la checklist au modèle de pull request de votre équipe : c'est 5 lignes, et ça change la culture. »

TRANSITION — « Bilan de la journée. »`,
  `⏱ 4 min · BILAN DU JOUR 1 (≈ 15 h 40)

DIRE — « Trois modules, six labs. » Une phrase par carte. Puis : « Demain : documentation et revue, tests et CI/CD, architecture et planification, et le projet final avec un agent. »

INTERACTION — « Un mot pour résumer la journée ? » Trois ou quatre au micro.

TRANSITION — « Avant de partir, le billet de sortie. »`,
  `⏱ 10 min · BILLET DE SORTIE

ANIMATION — Appelez chaque participant par son prénom, dans l'ordre de la liste ; trois réponses courtes, micro ouvert. Notez les questions pour la réactivation de demain matin.

DEVOIR FACULTATIF — « Ce soir ou demain matin, une demande en 5 ingrédients sur un vrai ticket de votre travail, avec du code non confidentiel. On en parle à 9 h. »

FIN DU JOUR 1 — Rappeler l'horaire : 9 h demain. Laissez le dépôt des labs ouvert : tous les labs restent disponibles.`,
  `⏱ 2 min · ACCUEIL DU JOUR 2 (page affichée pendant l'arrivée)

DIRE — « Bonjour et bienvenue au jour 2. Hier : écrire et corriger du code avec l'IA. Aujourd'hui : la qualité et la conception. Documentation et revue, tests et CI/CD, architecture et planification, puis un projet complet avec un agent. »

LOGISTIQUE — Vérifiez son et caméra, et que le dépôt des labs est toujours cloné (git pull si vous avez publié des corrections).

TRANSITION — « On se réveille avec cinq questions. »`,
  `⏱ 8 min · RÉACTIVATION

ANIMATION — Pour chaque carte : lisez la question, appelez un participant par son prénom, écoutez sa réponse, puis cliquez pour retourner la carte.

PUIS — Carte pointillée : reprenez les questions notées dans les billets de sortie d'hier. Répondez brièvement ; si une question relève d'un module du jour, dites où on y reviendra.

INTERACTION — « Qui a essayé une demande en 5 ingrédients hier soir ? » Une ou deux anecdotes.

TRANSITION — « Le programme du jour. »`,
  `⏱ 1 min

DIRE — « Module 4 jusqu'à la pause : documentation et revue, avec deux labs. Module 5 jusqu'au dîner : tests unitaires, intégration, charge et CI/CD. Module 6 au retour : architecture et planification. Puis le module 7 : un projet complet avec un agent, et vos présentations en partage d'écran. »

TRANSITION — « Module 4. »`,
  `⏱ 1 min · DÉBUT DU MODULE 4 (≈ 9 h 10)

DIRE — « Module 4 : revue de code et documentation automatisée. Trois sujets du programme : générer commentaires et documentation, analyser le style et les conventions, automatiser les revues. Deux labs : documenter un module, puis faire la revue d'une pull request piégée. »

TRANSITION — « Commençons par la documentation. »`,
  `⏱ 3 min · 4 CLICS

OBJECTIF — Situer ce que l'IA documente bien et ce qu'elle ne peut pas savoir.

→ beat 1 : « Les docstrings : l'IA est très bonne, à condition d'imposer le format. »
→ beat 2 : « Le README : un bon premier jet, à vérifier en lançant chaque commande. »
→ beat 3 : « Le changelog et les descriptions de PR : très bon, car tout est dans git log et le diff. »
→ beat 4 : « Les décisions : le pourquoi. Pourquoi haversine plutôt qu'une API de cartographie ? L'IA peut rédiger, mais c'est vous qui savez. »
Callout : « Le test d'une bonne doc : un collègue peut utiliser le module sans lire le code. »

TRANSITION — « Démonstration. »`,
  `⏱ 4 min · DÉMO · 3 CLICS

DÉMO — Dans l'IDE, sur labs/lab06-documentation/python/geo.py : sélectionnez distance_km, /doc dans Copilot (ou « Generate documentation » dans JetBrains), avec la consigne affichée.
→ beat 1 : la description et les sections Args / Returns. « Il a expliqué la formule et l'hypothèse de la Terre sphérique : c'est le pourquoi. »
→ beat 2 : l'exemple doctest. « 233.0 km entre Montréal et Québec : python -m doctest l'exécute. S'il avait écrit 250, ce serait visible. »
→ beat 3 : les deux cartes.

À SOULIGNER — Sans préciser la convention, on obtient un style par fonction. C'est l'étape 1 du lab.

TRANSITION — « Au-delà des docstrings. »`,
  `⏱ 3 min

OBJECTIF — Montrer trois documents « corvée » que l'IA rédige bien.

DIRE — Lire les trois demandes. « Le journal des modifications à partir de git log : très efficace si vos messages de commit sont clairs. C'est un argument de plus pour les commits du lab 03. »
« La description de PR : écrite pour un relecteur pressé : problème, solution, comment tester, risques. »
Callout : « Toujours lancer chaque commande du README. Une doc qui ment est pire que pas de doc. »

TRANSITION — « Lab 06. »`,
  `⏱ 1 min · CONSIGNE DU LAB 06

DIRE — « Lab 06, labs/lab06-documentation. Un module géographique de 4 fonctions, zéro commentaire. Les tests de documentation sont rouges : ils exigent les sections et un exemple exécutable, et doctest vérifie que les exemples sont justes. »

TRANSITION — « 20 minutes. »`,
  `⏱ 20 min · LAB 06 EN AUTONOMIE

ANIMATION — Point d'étape à 10 minutes : « Combien de tests de documentation verts ? »

BLOCAGES FRÉQUENTS —
• Python : la docstring de module doit faire plus de 40 caractères ; la classe Point doit avoir « Attributes: ».
• Doctest : l'exemple doit utiliser des valeurs réelles (233.0, pas « environ 230 »).
• TypeScript : @param <nom> pour chaque paramètre, @throws pour dansLeRayon.

DÉBRIEF (2 min) — « Avez-vous trouvé une phrase fausse dans la doc générée ? Laquelle ? »`,
  `⏱ 3 min

OBJECTIF — Analyse de style et respect des conventions (programme).

DIRE — « Pour le style, des outils déterministes existent : ruff format ou Prettier pour la mise en forme, ruff ou ESLint pour les règles, mypy ou tsc pour les types. Ils ne se trompent pas et ne coûtent rien. »
« L'IA intervient là où ils s'arrêtent : expliquer une règle obscure, ajouter des types, et surtout les conventions non outillables : le nommage métier, la façon de gérer les erreurs. Ça, on l'écrit dans les instructions de projet. »

RÈGLE — Ne jamais demander à l'IA de formater ou trier des imports.

TRANSITION — « Passons à la revue. Un exercice d'abord. »`,
  `⏱ 5 min · EXERCICE · 5 CLICS

OBJECTIF — Faire vivre une revue avant de l'automatiser.

ANIMATION — « Prenez 60 secondes. Que voyez-vous dans cet extrait ? » Écoutez 3 ou 4 propositions au micro. Puis → révèle les pastilles une à une (cliquez une pastille pour son explication).
1. Secret en dur. 2. MD5 sans sel. 3. Injection SQL. 4. Exception avalée. 5. Contrôle d'accès absent.

À SOULIGNER (carte violette) — « ruff détecte 1, 2 et 3. L'IA trouve souvent les 5. Mais le contrôle d'accès, c'est une règle métier : c'est vous. »

TRANSITION — « Comment automatiser cette revue ? »`,
  `⏱ 3 min · 4 CLICS

OBJECTIF — Automatiser les revues de code avec l'IA (programme).

→ beat 1 : « Avant d'ouvrir la PR : auto-revue dans le chat, avec la grille de l'équipe. »
→ beat 2 : « La CI : lint, types, tests, analyse de sécurité. Bloquants. »
→ beat 3 : « La revue IA de la PR : Copilot comme relecteur dans GitHub, ou une action de revue. Commentaires en ligne, suggestions applicables. »
→ beat 4 : « Revue humaine et approbation : la conception et les règles métier. »

MESSAGE — « L'IA en premier relecteur fait gagner du temps au second… si on trie le bruit. »

TRANSITION — « Comment lui demander une revue utile ? »`,
  `⏱ 3 min

OBJECTIF — Une demande de revue structurée.

DIRE — « Une grille de gravité, un format, un verdict, et dire ce qu'on ne veut pas : le formatage. » Lire le commentaire de revue : « Où, quoi, pourquoi c'est grave, comment corriger. »
« La grille est dans le dépôt : labs/lab07-revue/grille-revue.md. »

TRANSITION — « Lab 07. »`,
  `⏱ 1 min · CONSIGNE DU LAB 07

DIRE — « Lab 07, labs/lab07-revue. La PR n° 42, "prête pour la prod". Les tests fonctionnels passent. D'abord votre revue, sans IA, 3 minutes. Puis l'IA et ruff. Comparez les trois listes. Ensuite seulement, lancez les tests de sécurité : votre revue avait-elle tout vu ? Puis corrigez les bloquants. »

À SOULIGNER — L'ordre compte : revue humaine d'abord, pour mesurer ce que l'IA ajoute.

TRANSITION — « 25 minutes, jusqu'à la pause. »`,
  `⏱ 25 min · LAB 07 EN AUTONOMIE

ANIMATION — Points d'étape à 10 et 18 minutes : « Combien de bloquants corrigés ? »

INDICES —
• Python : hashlib.pbkdf2_hmac avec os.urandom(16) comme sel ; hmac.compare_digest pour comparer. TypeScript : scryptSync et timingSafeEqual.
• lire_note : « where id = ? and owner = ? ».
• Secret : os.environ["NOTES_SECRET"] (les tests le définissent).

DÉBRIEF (3 min) — « Qui a trouvé le contrôle d'accès sans l'IA ? Et l'IA, l'a-t-elle trouvé ? »`,
  `⏱ 2 min · QCM

RÉPONSE — B.
• A ✗ PIÈGE — « Rien à signaler » n'est pas une garantie.
• C ✗ — Aucun outil ne prouve l'absence de faille.
• D ✗ — La revue IA ne connaît pas vos décisions passées, sauf celles écrites dans les instructions.`,
  `⏱ 2 min · SYNTHÈSE DU MODULE 4

DIRE — Lire les cinq points. Encadré : « Activez une revue IA sur un dépôt pilote pendant deux semaines, et comptez les constats utiles. C'est votre mesure. »

⏸ PAUSE 10 h 30 – 10 h 45. Au retour : module 5, les tests.`,
  `⏱ 1 min · DÉBUT DU MODULE 5 (≈ 10 h 45)

DIRE — « Module 5 : génération de tests et assurance qualité. Trois sujets : tests unitaires et d'intégration, simulation de scénarios et tests de charge, intégration CI/CD. Deux labs : une suite de tests jugée par le score de mutation, puis intégration, charge et pipeline GitHub Actions. »

TRANSITION — « D'abord : qu'est-ce qu'un bon test ? »`,
  `⏱ 3 min · 4 CLICS

OBJECTIF — Situer les tests que l'IA écrit bien.

→ beat 1 : « La base : les tests unitaires. Énumérer les cas limites, écrire des tests paramétrés, fabriquer des données : l'IA excelle. »
→ beat 2 : « L'intégration : de vrais composants qui se parlent. L'IA écrit bien les scénarios, si on lui donne la fixture. »
→ beat 3 : « Au sommet : bout en bout et charge. Moins nombreux, plus lents. L'IA écrit les scripts et les données réalistes. »
→ beat 4 : « Attention : des tests qui exécutent sans vérifier, des attendus recalculés avec la formule du code, des tests liés entre eux. On les voit dans deux pages. »

TRANSITION — « Comment obtenir de bons tests unitaires ? »`,
  `⏱ 4 min · DÉMO · 2 CLICS

DÉMO — Dans le chat, sur labs/lab08-tests/python/panier.py.
DIRE — « Je ne demande pas de tests. Je demande d'abord la liste des comportements. »
→ beat 1 : la liste. « Regardez : "exactement à 50,00 $", "stock exact accepté, stock + 1 refusé" : des valeurs limites. Et j'ajoute ce qu'il a oublié : le code LIVRAISON. »
→ beat 2 : les tests générés. « Fixtures, parametrize, et la ligne surlignée : il vérifie que le panier est inchangé après un refus. C'est le genre de vérification qu'on oublie. »

TRANSITION — « Comment savoir si une suite de tests est bonne ? »`,
  `⏱ 4 min · 3 CLICS

OBJECTIF — Faire comprendre le test de mutation.

DIRE — « Mutant n° 7 : on remplace >= par >. Un bogue d'une lettre. »
→ beat 1 : « Le script relance les tests sur chaque mutant. Celui-ci survit : aucun test n'échoue. Et pourtant la couverture est à 100 % ! »
→ beat 2 : « Le principe : si un bogue peut être introduit sans qu'aucun test échoue, ce comportement n'est pas vérifié. »
→ beat 3 : « Avec l'IA : pour chaque survivant, "écris le test qui tue ce mutant". Ici, un panier à exactement 50,00 $. »

OUTILS — mutmut en Python, Stryker pour JavaScript/TypeScript, Java, C#. Le lab 08 en contient un simplifié, en 50 lignes.

TRANSITION — « Testons votre œil. »`,
  `⏱ 5 min · EXERCICE · CARTES

ANIMATION — Pour chaque carte : « Utile ou pas ? » Votes au micro (un mot), puis cliquez pour retourner.

RÉPONSES — 1 inutile (n'assert rien d'utile), 2 tautologique, 3 utile, 4 fragile (dépendance entre tests).

MESSAGE — « Les 4 défauts les plus fréquents des tests générés. Les cartes 1 et 2 font monter la couverture sans tuer aucun mutant. »

TRANSITION — « Lab 08. »`,
  `⏱ 1 min · CONSIGNE DU LAB 08

DIRE — « Lab 08, labs/lab08-tests. Un panier d'achat sans tests. Deux mesures objectives : couverture des branches au moins 95 %, et score de mutation 8 sur 8. Au départ : 1 sur 8. »
« Commencez par la liste des comportements, pas par le code. »

TRANSITION — « 30 minutes. »`,
  `⏱ 30 min · LAB 08 EN AUTONOMIE

ANIMATION — Points d'étape à 10 et 20 minutes : « Quel score de mutation ? »

INDICES —
• Mutant « maximum 99 décalé » : ajouter exactement 99 doit passer.
• « retrait partiel faux » : retirer exactement la quantité présente supprime la ligne.
• « livraison facturée au panier vide » : panier vide → livraison 0.
• « code sensible à la casse » : appliquer_code("moins10").

DÉBRIEF (3 min) — « Couverture à 100 % et combien de mutants survivants avant vos ajouts ? » Recueillez 2 ou 3 chiffres.`,
  `⏱ 3 min · 2 CLICS

OBJECTIF — Tests d'intégration (programme).

DIRE — « Le lab 09 contient une petite API de liens courts. La fixture démarre un vrai serveur HTTP sur un port choisi par le système, le port 0. Le test fait de vraies requêtes et vérifie la redirection 302. »
→ beat 1 : les scénarios à demander, dont la concurrence.
→ beat 2 : « Les faux tests d'intégration : appeler les fonctions en mémoire, ou tout simuler. Et le port fixe : deux jobs CI en parallèle, et c'est l'échec aléatoire. »

TRANSITION — « Et sous la charge ? »`,
  `⏱ 4 min · 3 CLICS

OBJECTIF — Simulation de scénarios et tests de charge (programme).

DIRE — « Le script charge.py du lab 09 : 2 000 requêtes, 20 utilisateurs simultanés, 80 % de lectures. Objectif de service, fixé avant : p95 sous 50 ms, moins de 1 % d'erreurs. »
→ beat 1 : « p50 : 7 ms, p95 : 10 ms. Respecté. »
→ beat 2 : « Mais p99 : plus d'une demi-seconde ! La moyenne ne le montre pas. Une requête sur cent attend. Pourquoi ? Faites-le interpréter par l'IA : file d'attente du serveur, verrou, ramasse-miettes. »
→ beat 3 : « En vrai projet : k6, Locust, JMeter, Gatling. L'IA traduit votre scénario dans leur format. »

Chiffres mesurés pendant la préparation ; ils varient selon le poste.

TRANSITION — « Tout cela doit tourner à chaque PR. »`,
  `⏱ 4 min · 6 CLICS

OBJECTIF — Intégration CI/CD (programme).

→ beats 1 à 6 : les étapes du pipeline apparaissent : déclencheur, lint, tests avec matrice de versions, couverture avec seuil, sécurité (audit des dépendances, CodeQL), déploiement si tout est vert.
Au beat 6 : le YAML. « C'est le corrigé du lab 09, en résumé. »

AVEC L'IA — « Elle écrit très bien le YAML et explique un job rouge à partir du journal. Mais elle invente des versions d'actions et des options : vérifiez sur la page officielle de l'action. »

TRANSITION — « Lab 09. »`,
  `⏱ 2 min · CONSIGNE DU LAB 09

DIRE — « Lab 09, labs/lab09-ci. Trois parties : tests d'intégration sur la vraie API, test de charge, pipeline GitHub Actions. Le fichier ci-a-completer.yml a 6 TODO ; test_workflow.py vérifie votre pipeline. »
« Étape 4 : sur votre fork, ouvrez une PR qui casse un test, par exemple LONGUEUR_CODE = 5, et regardez le pipeline passer au rouge. »

PRÉREQUIS — Les Actions doivent être activées sur le fork (onglet Actions, bouton « I understand… enable »).

TRANSITION — « 35 minutes, jusqu'au dîner. »`,
  `⏱ 35 min · LAB 09 EN AUTONOMIE

ANIMATION — Points d'étape à 12 et 25 minutes : « Partie 1, 2 ou 3 ? »

BLOCAGES FRÉQUENTS —
• Actions désactivées sur un fork : onglet Actions, les activer.
• test_workflow : il cherche « --cov-fail-under » et au moins deux versions 3.1x dans la matrice.
• Pas de droit de pousser sur GitHub depuis le poste d'entreprise : valider seulement test_workflow en local.

DÉBRIEF (3 min) — « Qui a vu son pipeline bloquer la PR fautive ? »`,
  `⏱ 2 min · QCM

RÉPONSE — B. C'est le piège n° 1 des agents : modifier, ignorer (@skip) ou supprimer un test pour atteindre le vert. Le diff des fichiers de test se relit en premier.`,
  `⏱ 2 min · SYNTHÈSE DU MODULE 5

DIRE — Lire les cinq points. Encadré : « Votre module le moins testé : liste de comportements, tests générés, un outil de mutation. Vous serez surpris. »

⏸ DÎNER 12 h – 13 h 15. Au retour : architecture et planification.`,
  `⏱ 1 min · DÉBUT DU MODULE 6 (≈ 13 h 15)

DIRE — « Module 6 : l'IA pour la planification et l'architecture. Trois sujets du programme : aide à la conception d'architectures, estimation et planification agile, gestion des dépendances et des risques. Un lab de 35 minutes, sur un cahier des charges réaliste. »

TRANSITION — « L'IA peut-elle être un architecte ? »`,
  `⏱ 3 min · 5 CLICS · RETOUR DU DÎNER (13 h 15)

OBJECTIF — Aide à la conception d'architectures (programme) : positionner l'IA.

→ beats 1 à 4 : les quatre rôles. « Poser les questions qu'on oublie. Comparer des options. Documenter vite. Jouer l'avocat du diable. »
→ beat 5 : « Le biais : sans contraintes, l'IA propose l'architecture à la mode. Microservices et Kubernetes pour quatre développeurs. Ce n'est pas de la malveillance : c'est ce qu'elle a le plus lu. »

INTERACTION — « Qui a déjà hérité d'une architecture surdimensionnée ? » Une anecdote au micro.

TRANSITION — « D'abord, les questions. »`,
  `⏱ 4 min · DÉMO · 2 CLICS

DÉMO — Ouvrez labs/lab10-architecture/cahier-des-charges.md, joignez-le au chat, envoyez la demande.
DIRE — « Les contraintes clés sont en gris : un pic de 1 500 commandes en 45 minutes, la paie SAP par lot, les allergènes, la Loi 25, une équipe de 4. »
→ beat 1 : les questions. « Plusieurs sont dans la section "questions ouvertes" du cahier ; d'autres non, comme le paiement qui échoue à 10 h 29. »
→ beat 2 : « Vous jouez le PO : répondez à trois questions. Ces réponses deviennent du contexte. »

TRANSITION — « Ensuite, comparer. »`,
  `⏱ 4 min · 2 CLICS

OBJECTIF — Options contrastées, diagramme, décision.

DIRE — « Je demande deux options contrastées, avec leurs compromis face à mes contraintes. Monolithe modulaire contre microservices. »
→ beat 1 : le diagramme. « Généré en Mermaid, rendu ici. L'adaptateur paie isole SAP ; la file de messages absorbe le pic et découple les notifications. »
→ beat 2 : la décision. « Elle va dans un ADR. »

ASTUCE — Les diagrammes Mermaid se rendent dans GitHub, VS Code (extension) et la plupart des wikis : la doc reste versionnée avec le code.

TRANSITION — « L'ADR justement. »`,
  `⏱ 3 min

OBJECTIF — Documenter une décision d'architecture.

DIRE — « Un ADR, Architecture Decision Record : une page, versionnée avec le code. Contexte, décision, alternatives, conséquences. L'IA le rédige en une minute à partir de notre conversation. »
« Dans un an, quelqu'un demandera "pourquoi pas des microservices ?" La réponse est là. »
Avocat du diable : « Demandez-lui de critiquer votre ADR. C'est souvent la partie la plus utile. »

TRANSITION — « De l'architecture au plan. »`,
  `⏱ 4 min · 3 CLICS

OBJECTIF — Estimation et planification agile (programme).

DIRE — « L'IA découpe en user stories avec critères Gherkin, propose des points et des sprints. »
→ beat 1 : « Ce qu'elle fait bien : découper, rédiger, repérer les dépendances. »
→ beat 2 : la ligne rouge. « Ce qu'elle rate : au sprint 2, 5 + 8 + 8 + 13 = 34 points pour une vélocité de 20. Et une story de 13 points ne tient pas dans un sprint. »
→ beat 3 : « L'engagement reste à l'équipe. L'IA prépare : des estimations qu'on lui demande de justifier ("pourquoi 8 ?"), et l'équipe tranche en planning poker. »

Les tests du lab 10 vérifient exactement cela : vélocité, dépendances, pas de 13 dans un sprint.

TRANSITION — « Dernier volet : dépendances et risques. »`,
  `⏱ 4 min

OBJECTIF — Gestion des dépendances et des risques (programme).

DIRE — « À gauche, le registre des risques en probabilité × impact : l'IA en propose de bons, que vous classez. En haut à droite, ce qu'il faut traiter en premier. »
« À droite : l'équipe veut réutiliser les dépendances d'un prototype de 2019. pip-audit trouve 139 vulnérabilités connues, dans les 7 paquets (dont 43 pour Django 2.2.0 et 69 pour Pillow 8.0.0). »
Callout : « L'IA analyse aussi ces fichiers, mais elle cite parfois des numéros de CVE plausibles et inexistants. Un outil d'audit fait foi. »

ATTENTION — Audit lancé le 29 octobre 2026 (pip-audit --disable-pip --no-deps) ; lancez-le en direct si possible : le total ne fait qu'augmenter.

TRANSITION — « Lab 10. »`,
  `⏱ 2 min · CONSIGNE DU LAB 10

DIRE — « Lab 10, labs/lab10-architecture. Le cahier des charges de Cantine+, des gabarits, et les fichiers de dépendances du vieux prototype. Vous produisez 5 livrables dans livrables/. Les tests ne jugent pas la qualité de votre architecture : ils vérifient que c'est complet et cohérent. Vélocité, dépendances, pilote en 3 sprints : c'est là que l'IA se trompe. »

PRÉREQUIS — pip install pip-audit ; pour npm audit, un npm install --package-lock-only dans le dossier dependances.

TRANSITION — « 35 minutes. »`,
  `⏱ 35 min · LAB 10 EN AUTONOMIE

ANIMATION — Points d'étape à 12 et 25 minutes : « Combien de tests verts sur 17 ? »

BLOCAGES FRÉQUENTS —
• backlog.csv : les champs qui contiennent des virgules doivent être entre guillemets (ou reformulés sans virgule).
• Le critère Gherkin doit contenir « Étant donné … quand … alors ».
• Sprints : une story sans sprint (COULD) est acceptée ; ses dépendances doivent exister.
• Pas d'accès réseau pour pip-audit : consignez l'analyse de l'IA en signalant « non vérifié » ; le test demande au moins le nom de l'outil.

DÉBRIEF (3 min) — « Sur quoi avez-vous corrigé l'IA ? » Deux ou trois réponses.

⏸ PAUSE 14 h 15 – 14 h 30.`,
  `⏱ 2 min · SYNTHÈSE DU MODULE 6

DIRE — Lire les cinq points. Encadré : « Ajoutez pip-audit ou npm audit à votre pipeline : c'est une ligne, et elle tourne à chaque PR. »

TRANSITION — « Dernier module : on assemble tout. »`,
  `⏱ 1 min · DÉBUT DU MODULE 7 (≈ 14 h 30)

DIRE — « Module 7 : les ateliers pratiques. Un projet complet avec un agent : on le met en place avec des instructions, on le développe de bout en bout (code, tests, documentation), et on ouvre une pull request revue. Puis vos présentations, et comment intégrer tout ça en entreprise. »

TRANSITION — « Le projet : un petit outil en ligne de commande. »`,
  `⏱ 3 min

OBJECTIF — Présenter le projet final (programme : mise en place d'un projet avec l'IA).

DIRE — « Un gestionnaire de tâches en ligne de commande. Petit, mais complet : six commandes, un fichier JSON, des règles d'ordre, des exports, des codes de sortie. Tout est dans SPEC.md, et les tests d'acceptation sont tous rouges. »
« Vous allez le construire avec un agent, comme une équipe le ferait : instructions, plan, incréments, documentation, pull request revue. »

À SOULIGNER — Le programme parle de « projet collaboratif » : en classe virtuelle, chacun mène son propre projet, et la collaboration passe par la PR, la revue et vos présentations.

TRANSITION — « Le flux de travail. »`,
  `⏱ 3 min · 6 CLICS

→ beats 1 à 6 : une étape par clic.
1. « Instructions : c'est ce qui rend le travail reproductible pour toute une équipe. »
2. « Plan validé : jamais de code avant. »
3. « Incréments : une commande à la fois, tests verts, commit. »
4. « Documentation : chaque exemple du README est lancé. »
5. « PR et revue : la description est relue, une revue IA, puis la vôtre. »
6. « Rétrospective : ce que l'agent a bien fait, et deux erreurs que vous avez détectées. »
Callout : « L'agent accélère chaque étape ; aucune ne disparaît. »

TRANSITION — « Lab 11. »`,
  `⏱ 2 min · CONSIGNE DU LAB 11

DIRE — « Lab 11, labs/lab11-projet-final. 55 minutes. Points d'étape toutes les 15 minutes. Après, chacun présente en 2 à 3 minutes en partage d'écran. »
« Si vous n'avez pas fini : présentez ce qui marche. Le but n'est pas 100 % des tests, c'est la méthode. »

PIÈGES À ANNONCER — argparse appelle sys.exit sur une erreur : la spec exige un code retourné. Les identifiants ne sont jamais réutilisés. Node : pas de « constructor(readonly x) », le TypeScript est exécuté sans compilation.

TRANSITION — « C'est parti. »`,
  `⏱ 55 min · LAB 11 EN AUTONOMIE

ANIMATION — Points d'étape à 15, 30 et 45 minutes : « Quelles commandes passent ? Combien de tests verts ? » Cochez la checklist selon l'avancement du groupe.

SI QUELQU'UN EST TRÈS EN AVANCE — Bonus du README : commande modifier, tests d'acceptation écrits avant ; ou le job du lab 11 dans le pipeline du lab 09.

SI QUELQU'UN EST BLOQUÉ — Partage d'écran 2 minutes. Souvent : l'agent a tout écrit d'un coup ; revenir au plan, repartir d'une commande.

CORRIGÉS — Dans corriges/lab11-projet-final (réservé au formateur) : modele / depot / cli, en Python et en TypeScript.`,
  `⏱ 25 min · PRÉSENTATIONS (≈ 15 h 25)

ANIMATION — Appelez par prénom, dans l'ordre de la liste. Lancez le minuteur de 3 minutes à chaque présentation (bouton réinitialiser entre deux). Au-delà de 10 participants : 5 ou 6 volontaires, les autres déposent une capture de leur terminal dans le clavardage.

RÉTROACTION — Après chaque présentation : un point fort, une piste, au micro (vous ou un participant). « Participant suivant. »

À NOTER — Les erreurs de l'agent citées : elles nourrissent la page suivante.`,
  `⏱ 4 min · 4 CLICS

OBJECTIF — Bonnes pratiques pour l'intégration en entreprise (programme).

→ beat 1 : GOUVERNANCE — « Quels outils et modèles sont autorisés ? Une offre entreprise qui n'entraîne pas sur vos données ; le filtre de code public ; ce qu'on ne colle jamais : secrets, données clients. »
→ beat 2 : PRATIQUES — « Tout ce qu'on a fait en deux jours : instructions versionnées, bibliothèque de demandes, checklist dans le modèle de PR, agents sur une branche. »
→ beat 3 : MESURE — « Pas seulement la vitesse : délai de cycle des PR, défauts, retours arrière, couverture, mutation. Rappelez-vous l'étude METR : on se croit plus rapide. »
→ beat 4 : ADOPTION — « Un pilote de quelques semaines, des référents, partager les échecs. Et garder les juniors dans la boucle : ils doivent encore apprendre à lire et écrire du code. »

TRANSITION — « Votre bilan. »`,
  `⏱ 5 min · SONDAGE ET DÉBRIEFING

ANIMATION — Chacun annonce un numéro de 1 à 6 ; cliquez la ligne. Puis la question inverse : « où vous a-t-elle le plus ralenti ? » (réponses libres, au micro).

QUESTIONS OUVERTES — Deux ou trois réponses chacune. Notez les règles proposées : elles alimentent le plan d'action de la clôture.

TRANSITION — « Clôture. »`,
  `⏱ 3 min · CLÔTURE (≈ 15 h 45)

OBJECTIF — Remettre en perspective le chemin parcouru.

DIRE — Une phrase par module. « Hier : comprendre comment l'assistant produit du code, bien lui demander, refactoriser sans casser, déboguer en expliquant d'abord, optimiser en mesurant, et connaître ses limites. Aujourd'hui : documenter et faire la revue, tester jusqu'à la mutation et la charge, brancher le pipeline, concevoir et planifier, et un projet complet avec un agent. »
« Le fil : l'IA propose, vous décidez, les tests tranchent. »

QUESTION — « Quel module vous servira le plus lundi ? » Deux ou trois réponses.

TRANSITION — « Un dernier quiz. »`,
  `⏱ 3 min · QCM FINAL À RÉPONSES MULTIPLES

ANIMATION — Les participants annoncent leurs lettres ; cochez la majorité, « Valider », puis cliquez chaque option.

RÉPONSES — A et C.
• B ✗ PIÈGE — « Tous les tests passent » : relire d'abord le diff des tests.
• D ✗ PIÈGE — Les secrets ne se collent jamais.

TRANSITION — « Passons de la formation à votre quotidien. »`,
  `⏱ 6 min · PLAN D'ACTION

ANIMATION — « Prenez 3 minutes pour écrire vos trois engagements, dans un document à vous ou la dernière page du guide. » Minuteur facultatif. Puis tour rapide au micro, par prénom : un engagement chacun (celui de la semaine).

À SOULIGNER — Petit et précis. Reprenez les règles proposées au débriefing du module 7.`,
  `⏱ 2 min

DIRE — « Tout reste à vous : le dépôt et ses 12 labs, à refaire dans n'importe quel ordre ; le guide PDF ; les gabarits : instructions de projet, AGENTS.md, ADR, workflow CI. »
Collez une dernière fois le lien du dépôt dans le clavardage.

RAPPEL — Les corrigés ne sont pas dans le dépôt public ; si vous les partagez, faites-le après la formation.

TRANSITION — « Merci. »`,
  `⏱ 2 min · FIN

DIRE — « Merci pour votre participation et vos questions. L'IA écrit le premier jet ; c'est vous qui signez le commit. »
« Merci de remplir l'évaluation de la formation : elle m'aide vraiment à l'améliorer. »

LOGISTIQUE — Lien d'évaluation dans le clavardage. Restez quelques minutes connecté pour les questions individuelles.`,
];
