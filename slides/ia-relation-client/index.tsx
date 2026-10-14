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
const FONT_LINK_ID = 'osd-webfont-ia-relation-client';
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
const SLIDE_ID = 'ia-relation-client';
const P = 'irc'; // CSS class prefix, unique per deck
const COURSE = 'IA pour la relation client';
const AUTHOR = 'Houssem Eddine LASSOUED';

// Module numbers: 0 = ouverture, 1–3 = matin, 4–7 = après-midi, 11 = clôture.
const MOD_TITLES: Record<number, string> = {
  1: 'L’IA au service de la relation client',
  2: 'Analyser une demande client',
  3: 'Rédiger des réponses avec l’IA',
  4: 'Réclamations & situations difficiles',
  5: 'Base de connaissances client',
  6: 'Analyser les interactions clients',
  7: 'Projet final & bonnes pratiques',
  11: 'Clôture',
};
const DAY1 = [1, 2, 3];
const DAY2 = [4, 5, 6, 7];

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
  fridge: (
    <>
      <rect x={5} y={2.5} width={14} height={19} rx={2.5} />
      <path d="M5 10h14M8.5 5.5v2M8.5 13v3" />
    </>
  ),
  headset: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x={3} y={13} width={4} height={6} rx={1.5} />
      <rect x={17} y={13} width={4} height={6} rx={1.5} />
      <path d="M19 19c0 1.7-1.6 2.5-4 2.5h-2" />
    </>
  ),
  heart: <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10C19.5 15.4 12 20 12 20Z" />,
  frown: (
    <>
      <circle cx={12} cy={12} r={9} />
      <path d="M8 16.2c1-1.5 2.3-2.2 4-2.2s3 .7 4 2.2" />
      <circle cx={9} cy={9.5} r={1.1} {...dotFill} />
      <circle cx={15} cy={9.5} r={1.1} {...dotFill} />
    </>
  ),
  meh: (
    <>
      <circle cx={12} cy={12} r={9} />
      <path d="M8.5 15h7" />
      <circle cx={9} cy={9.5} r={1.1} {...dotFill} />
      <circle cx={15} cy={9.5} r={1.1} {...dotFill} />
    </>
  ),
  thumbUp: (
    <>
      <path d="M7 10v10H4V10h3Z" />
      <path d="M7 10l4-7c1.4 0 2.3 1 2 2.4L12.4 9H18a2 2 0 0 1 2 2.3l-1.2 6.8A2 2 0 0 1 16.8 20H7" />
    </>
  ),
  megaphone: (
    <>
      <path d="M3 10v4l3 .5V9.5L3 10Z" />
      <path d="M6 9.5 18 5v14L6 14.5" />
      <path d="M8.5 15l1.2 4.5h2.6l-1-4" />
      <path d="M21 10v4" />
    </>
  ),
  translate: (
    <>
      <path d="M3 5h9M7.5 3v2M5 5c.8 3 2.8 5.4 6 7M10 5c-.8 3-2.8 5.4-6 7" />
      <path d="M12.5 21l4-10 4 10M14 17.5h5" />
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

// ─── Brand motif: the "flow" mark (three nodes on a path) ────────────────────
// A neutral workflow glyph: trigger → AI step → action, joined by one stroke.
const FLOW_RATIO = 64 / 30;
const FlowMark = ({ h = 28, color = C.electric, accent = C.violet, cls, style }: { h?: number; color?: string; accent?: string; cls?: string; style?: CSSProperties }) => (
  <svg width={h * FLOW_RATIO} height={h} viewBox="0 0 64 30" className={cls} style={{ display: 'block', flex: 'none', ...style }} aria-hidden>
    <path d="M8 22 C 20 22, 20 8, 32 8 S 44 22, 56 22" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />
    <circle cx={8} cy={22} r={6} fill={color} />
    <rect x={25} y={1} width={14} height={14} rx={4} fill={accent} />
    <circle cx={56} cy={22} r={6} fill={color} />
  </svg>
);

// Course lockup: the flow mark + short course name (no organisation branding).
const CourseLogo = ({ size = 26, color = C.navy, accent = C.violet }: { size?: number; color?: string; accent?: string }) => (
  <div role="img" aria-label={COURSE} style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.45, flex: 'none', fontFamily: display, lineHeight: 1 }}>
    <FlowMark h={size * 1.05} color={color === C.navy ? C.electric : color} accent={accent} />
    <span style={{ display: 'flex', flexDirection: 'column', gap: size * 0.12 }}>
      <span style={{ fontWeight: 800, fontSize: size, letterSpacing: '0.04em', color, whiteSpace: 'nowrap' }}>IA & RELATION</span>
      <span style={{ fontWeight: 600, fontSize: size * 0.62, letterSpacing: '0.22em', color: color === C.navy ? C.violet : color, whiteSpace: 'nowrap' }}>CLIENT</span>
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
  role: { label: 'Jeu de rôle', tone: 'coral' as Tone, icon: 'users' as IconName },
  jeu: { label: 'Jeu', tone: 'pink' as Tone, icon: 'puzzle' as IconName },
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

const ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 11];
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

// Matin : M1–M3 · Après-midi : M4–M7.
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
    <ProgSq n={7} mod={mod} />
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
          (mod >= 1 && mod <= 7
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
          {DAY1.includes(n) ? 'MATIN · MODULE' : DAY2.includes(n) ? 'APRÈS-MIDI · MODULE' : 'ÉTAPE'}
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
          {pad(n)}
        </div>
        <div className={A.grow} style={{ marginTop: 26, width: 150, height: 8, borderRadius: 4, background: G.violet, ...dl(650) }} />
      </div>
      <div style={{ position: 'absolute', left: 150, bottom: 150 }}>
        <CourseLogo size={24} color="#FFFFFF" accent={C.pink} />
      </div>
    </Slab>
    <Outline x={1480} y={-40} w={520} h={150} r={40} />
    <Outline x={1830} y={900} w={300} h={200} r={40} color={C.violet} />
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
  analyse: { label: 'Analyse de demandes', icon: 'search' as IconName, tone: 'blue' as Tone, aide: 'Intention, catégorie, informations, urgence, émotion : la fiche avant la réponse.' },
  redaction: { label: 'Rédaction de réponses', icon: 'pen' as IconName, tone: 'violet' as Tone, aide: 'Claire, juste, personnalisée, au bon ton : l’IA propose, vous validez.' },
  reclamation: { label: 'Simulation de réclamation', icon: 'alert' as IconName, tone: 'coral' as Tone, aide: 'L’IA joue le client mécontent, vous menez l’échange jusqu’à la solution.' },
  connaissances: { label: 'Base de connaissances', icon: 'book' as IconName, tone: 'teal' as Tone, aide: 'D’un document touffu à des réponses prêtes à l’emploi, avec leur source.' },
  interactions: { label: 'Analyse des interactions', icon: 'chart' as IconName, tone: 'green' as Tone, aide: 'Conversations → analyse IA → tendances → recommandations.' },
  projet: { label: 'Cas fil rouge', icon: 'flag' as IconName, tone: 'navy' as Tone, aide: 'Une demande traitée de bout en bout, de l’analyse au suivi de satisfaction.' },
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
      <Icon name="sparkles" size={20} color={C.electric} /> Outil :{' '}
      <span style={{ fontWeight: 600, color: C.navy }}>l’assistant IA autorisé par votre entreprise</span> · données fictives uniquement · kit de cas
      clients fourni
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
              <strong style={{ color: T.coral.fg }}>✗ Pas tout à fait. </strong>Relisez la question en pensant au client et au contrôle humain, puis réessayez.
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

// ═══ 00-open ═══════════════════════════════════════════════════════════

// ─── Ouverture ──────────────────────────────────────────────────────────────

// Vertical mini-parcours on the cover: five steps, one dot travelling down.
const OCoverStep = ({ icon, tone, eyebrow, label, y, d, solid = true }: { icon: IconName; tone: Tone; eyebrow: string; label: string; y: number; d: number; solid?: boolean }) => (
  <div className={A.right} style={{ position: 'absolute', left: 0, top: y, width: 420, display: 'flex', alignItems: 'center', gap: 18, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={64} solid={solid} style={{ boxShadow: '0 0 0 6px var(--osd-bg)' }} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 15, letterSpacing: '0.12em', textTransform: 'uppercase', color: T[tone].fg }}>{eyebrow}</div>
      <div style={{ fontSize: 25, fontWeight: 600, color: C.ink, lineHeight: 1.25 }}>{label}</div>
    </div>
  </div>
);

const O_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={110} r={46} cls={A.fade} />
    <Outline x={-40} y={760} w={120} h={360} r={40} color="#AEB9E6" />
    <div style={{ position: 'absolute', left: 390, top: 140, width: 960 }}>
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
        style={{ margin: '34px 0 0', fontFamily: display, fontWeight: 800, fontSize: 96, lineHeight: 1.06, letterSpacing: '-0.02em', color: C.navy, ...dl(120) }}
      >
        L’IA pour la
        <br />
        <span style={{ color: C.plum }}>relation client</span>
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 30, lineHeight: 1.45, color: C.soft, maxWidth: 900, ...dl(240) }}>
        Améliorer la qualité et l’efficacité du service client grâce à l’IA : répondre plus vite, répondre mieux,{' '}
        <strong style={{ color: C.navy }}>et garder la main sur chaque réponse</strong>.
      </p>
    </div>
    <Portrait w={170} x={390} y={640} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 664, ...dl(300) }}>
      <Eyebrow c={C.muted} size={20}>
        Formateur
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>IA appliquée aux métiers · relation client</div>
      <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
        <Tag tone="blue" size={19}>
          <Icon name="search" size={19} /> Analyser
        </Tag>
        <Tag tone="violet" size={19}>
          <Icon name="pen" size={19} /> Rédiger
        </Tag>
        <Tag tone="coral" size={19}>
          <Icon name="heart" size={19} /> Apaiser
        </Tag>
        <Tag tone="green" size={19}>
          <Icon name="chart" size={19} /> Améliorer
        </Tag>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1420, top: 150, width: 420, height: 720 }}>
      <svg width={64} height={720} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
        <path d="M32 32 V 672" stroke={C.rule} strokeWidth={4} strokeDasharray="8 10" className={A.march} />
        <FlowDot path="M32 32 V 672" dur={3.2} r={8} color={C.electric} />
      </svg>
      <OCoverStep icon="mail" tone="blue" eyebrow="Demande" label="Un client écrit" y={0} d={400} />
      <OCoverStep icon="sparkles" tone="violet" eyebrow="Analyse IA" label="Intention, urgence, émotion" y={160} d={520} />
      <OCoverStep icon="pen" tone="violet" eyebrow="Brouillon IA" label="Une réponse proposée" y={320} d={640} />
      <OCoverStep icon="humanCheck" tone="pink" eyebrow="Conseiller" label="Je vérifie, j’ajuste, j’envoie" y={480} d={760} />
      <OCoverStep icon="smile" tone="green" eyebrow="Client" label="Satisfait, et ça se mesure" y={640} d={880} />
    </div>
    <Footer left={390} />
  </Frame>
);
O_Cover.transition = BLOOM;

// ─── Bienvenue & promesse ───────────────────────────────────────────────────
const OPromise = ({ value, label, tone, d }: { value: ReactNode; label: ReactNode; tone: Tone; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 84, lineHeight: 1, color: STRONG[tone] }}>{value}</div>
    <div style={{ marginTop: 14, fontSize: 25, lineHeight: 1.4, color: C.soft }}>{label}</div>
  </div>
);

const O_Welcome: Page = () => (
  <Frame mod={0}>
    <Title>Bienvenue ! Une journée pour travailler mieux, pas plus</Title>
    <Lede>Aucun prérequis technique : si vous savez écrire un email, vous savez parler à une IA.</Lede>
    <Portrait w={230} x={130} y={300} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 130, top: 615, width: 300, ...dl(200) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy, lineHeight: 1.2 }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 22, color: C.soft, lineHeight: 1.4 }}>Votre formateur aujourd’hui</div>
    </div>
    <div style={{ position: 'absolute', left: 520, top: 300, width: 1280, display: 'flex', gap: 26 }}>
      <OPromise value={<CountUp to={7} suffix=" h" />} label="de formation, dont la moitié en ateliers sur des cas clients réalistes" tone="blue" d={150} />
      <OPromise value={<CountUp to={7} />} label="modules, de l’analyse d’une demande jusqu’à l’analyse de la satisfaction" tone="violet" d={280} />
      <OPromise value={<CountUp to={6} />} label="ateliers pratiques : vous repartez avec vos propres prompts et modèles" tone="green" d={410} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 520, top: 640, width: 1280, ...dl(600) }}>
      <Callout title="Notre contrat" tone="blue" icon="hand">
        Je montre, vous pratiquez. Chaque technique est testée tout de suite, sur des demandes clients comme celles que vous traitez tous
        les jours. <strong>Toutes les questions sont bonnes</strong>, surtout les plus simples.
      </Callout>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 520, top: 860, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.muted, ...dl(800) }}>
      <Icon name="bulb" size={26} color={C.violet} />
      Fil conducteur de la journée : « L’IA propose, le conseiller dispose. »
    </div>
  </Frame>
);

// ─── Tour de table (sondage) ────────────────────────────────────────────────
const O_Poll: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Tour de table : qui êtes-vous ?</Title>
    <Lede>Main levée : cliquez une ligne par vote. Le « − » retire un vote.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800 }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Mon métier
      </Eyebrow>
      <Poll>
        <PollRow id="o-m1" label="Conseiller(ère) / téléconseiller(ère)" tone="blue" icon="headset" />
        <PollRow id="o-m2" label="Service après-vente (SAV)" tone="teal" icon="tool" />
        <PollRow id="o-m3" label="Chargé(e) de clientèle / back-office" tone="violet" icon="inbox" />
        <PollRow id="o-m4" label="Superviseur / manager d’équipe" tone="green" icon="users" />
        <PollRow id="o-m5" label="Autre métier en contact client" tone="grey" icon="plus" />
      </Poll>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 980, top: 270, width: 820, ...dl(200) }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Mon usage de l’IA aujourd’hui
      </Eyebrow>
      <Poll>
        <PollRow id="o-u1" label="Jamais essayé" tone="grey" icon="smile" />
        <PollRow id="o-u2" label="Un peu, à titre personnel" tone="teal" icon="chat" />
        <PollRow id="o-u3" label="De temps en temps au travail" tone="blue" icon="sparkles" />
        <PollRow id="o-u4" label="Tous les jours au travail" tone="violet" icon="bolt" />
        <PollRow id="o-u5" label="Notre outil client intègre déjà de l’IA" tone="green" icon="bot" />
      </Poll>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(500) }}>
      Pour les ateliers, on forme des binômes qui mélangent les métiers et les niveaux.
    </Hint>
  </Frame>
);

// ─── Objectifs pédagogiques ─────────────────────────────────────────────────
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
    <Lede>Huit objectifs pédagogiques, regroupés en quatre gestes du quotidien.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 24 }}>
      <OGoal icon="search" tone="blue" title="Comprendre" d={100}>
        <Bullet size={23}>Connaître les principaux usages de l’IA générative en relation client</Bullet>
        <Bullet size={23}>Analyser et reformuler efficacement une demande client</Bullet>
      </OGoal>
      <OGoal icon="pen" tone="violet" title="Répondre" d={220}>
        <Bullet size={23} tone="violet">Rédiger des réponses claires, personnalisées, adaptées au contexte</Bullet>
        <Bullet size={23} tone="violet">Préparer les réponses aux réclamations et désamorcer les tensions</Bullet>
        <Bullet size={23} tone="violet">Créer et améliorer des modèles de réponses</Bullet>
      </OGoal>
      <OGoal icon="chart" tone="green" title="Capitaliser" d={340}>
        <Bullet size={23} tone="green">Structurer et enrichir une base de connaissances</Bullet>
        <Bullet size={23} tone="green">Analyser les échanges : tendances, irritants, axes d’amélioration</Bullet>
      </OGoal>
      <OGoal icon="shieldCheck" tone="coral" title="Sécuriser" d={460}>
        <Bullet size={23} tone="coral">Protéger la confidentialité des données clients</Bullet>
        <Bullet size={23} tone="coral">Contrôler chaque réponse et garder la validation humaine</Bullet>
      </OGoal>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(800) }}>
      <Icon name="checkCircle" size={24} color={C.green} />
      Évaluation continue : quiz à chaque module, productions d’atelier, cas fil rouge final, auto-positionnement début / fin.
    </div>
  </Frame>
);

// ─── Programme de la journée ────────────────────────────────────────────────
const OSlot = ({ t, mod, title, sub, tone, d }: { t: string; mod?: string; title: ReactNode; sub?: ReactNode; tone: Tone; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, ...dl(d) }}>
    <span style={{ flex: 'none', width: 78, fontFamily: mono, fontSize: 21, color: C.muted, paddingTop: 3 }}>{t}</span>
    <span style={{ flex: 'none', width: 12, height: 12, marginTop: 10, borderRadius: 99, background: STRONG[tone] }} />
    <div>
      <div style={{ fontSize: 24, fontWeight: 600, color: C.ink, lineHeight: 1.3 }}>
        {mod ? <span style={{ fontFamily: display, fontWeight: 800, color: STRONG[tone], marginRight: 10 }}>{mod}</span> : null}
        {title}
      </div>
      {sub ? <div style={{ fontSize: 19, color: C.muted, lineHeight: 1.35, marginTop: 2 }}>{sub}</div> : null}
    </div>
  </div>
);

const OHalf = ({ icon, tone, title, sub, d, children }: { icon: IconName; tone: Tone; title: string; sub: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
      <IconTile name={icon} tone={tone} size={50} solid />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</div>
        <div style={{ fontSize: 21, color: C.muted }}>{sub}</div>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>{children}</div>
  </div>
);

const O_Programme: Page = () => (
  <Frame mod={0}>
    <Title>Le programme de la journée</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'flex', gap: 50 }}>
      <OHalf icon="search" tone="blue" title="Matin · Comprendre et répondre" sub="De la demande à la réponse" d={0}>
        <OSlot t="9:00" title="Ouverture · le cas Nova Maison" tone="grey" d={150} />
        <OSlot t="9:20" mod="M1" title="L’IA au service de la relation client" sub="Usages, assistance au conseiller, limites" tone="blue" d={230} />
        <OSlot t="10:00" mod="M2" title="Comprendre et analyser une demande" sub="Intention, catégorie, urgence, émotion · atelier 1" tone="teal" d={310} />
        <OSlot t="10:55" title="Pause" tone="grey" d={390} />
        <OSlot t="11:10" mod="M3" title="Rédiger des réponses clients avec l’IA" sub="Clarté, ton, personnalisation, traduction · atelier 2" tone="violet" d={470} />
        <OSlot t="12:30" title="Déjeuner" tone="grey" d={550} />
      </OHalf>
      <OHalf icon="heart" tone="coral" title="Après-midi · Apaiser et améliorer" sub="Des situations difficiles au pilotage" d={200}>
        <OSlot t="13:30" mod="M4" title="Réclamations et situations difficiles" sub="Désamorcer, escalader · atelier 3 (simulations)" tone="coral" d={350} />
        <OSlot t="14:30" mod="M5" title="Créer une base de connaissances" sub="FAQ, procédures, scripts, arbre de décision · atelier 4" tone="teal" d={430} />
        <OSlot t="15:20" title="Pause" tone="grey" d={510} />
        <OSlot t="15:35" mod="M6" title="Analyser les interactions clients" sub="Motifs, irritants, reporting · atelier 5" tone="green" d={590} />
        <OSlot t="16:25" mod="M7" title="Cas fil rouge et bonnes pratiques" sub="Confidentialité, contrôle humain · atelier 6" tone="navy" d={670} />
        <OSlot t="17:15" title="Quiz final · bilan · clôture" tone="grey" d={750} />
      </OHalf>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 920, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(1000) }}>
      <Icon name="map" size={24} color={C.electric} />
      Le bandeau en haut à droite indique toujours où nous en sommes : M1 → M3 le matin, M4 → M7 l’après-midi.
    </div>
  </Frame>
);

// ─── Auto-positionnement ────────────────────────────────────────────────────
const O_AutoPos: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Auto-positionnement : votre point de départ</Title>
    <Lede>Cochez ce que vous savez déjà faire aujourd’hui avec une IA, sans aide. On refera l’exercice ce soir.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="ap1">Citer trois usages concrets de l’IA dans un service client</CheckItem>
        <CheckItem id="ap2">Faire identifier l’intention, l’urgence et l’émotion d’un message</CheckItem>
        <CheckItem id="ap3">Obtenir une réponse claire, au bon ton, personnalisée</CheckItem>
        <CheckItem id="ap4">Préparer une réponse à une réclamation tendue</CheckItem>
        <CheckItem id="ap5">Créer un modèle de réponse réutilisable par toute l’équipe</CheckItem>
        <CheckItem id="ap6">Transformer une procédure en FAQ ou en arbre de décision</CheckItem>
        <CheckItem id="ap7">Faire ressortir les motifs de contact d’un lot de conversations</CheckItem>
        <CheckItem id="ap8">Savoir quelles données ne jamais coller dans une IA</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau de départ"
          levels={[
            { min: 0, text: 'Découverte : vous êtes au bon endroit, on part de zéro.', tone: 'grey' },
            { min: 3, text: 'Premiers pas : on va structurer vos usages.', tone: 'blue' },
            { min: 6, text: 'À l’aise : visez les bonus de chaque atelier.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Notez votre score sur un coin de feuille : il servira de référence pour mesurer votre progression.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Le cas fil rouge : Nova Maison ─────────────────────────────────────────
const OFact = ({ icon, tone, children, d }: { icon: IconName; tone: Tone; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 16, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={50} />
    <div style={{ fontSize: 24, lineHeight: 1.35, color: C.soft }}>{children}</div>
  </div>
);

const O_FilRouge: Page = () => (
  <Frame mod={0} beats={1}>
    <Title>
      Le fil rouge : <span style={{ color: C.violet }}>le service client de Nova Maison</span>
    </Title>
    <Lede>Une enseigne fictive, des situations bien réelles. On suivra une de ses clientes toute la journée.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 760, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', ...dl(100) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 22 }}>
        <IconTile name="cart" tone="violet" size={64} solid />
        <div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 34, color: C.navy }}>Nova Maison</div>
          <div style={{ fontSize: 22, color: C.muted }}>Vente en ligne d’électroménager et de mobilier</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <OFact icon="users" tone="blue" d={250}>
          <strong style={{ color: C.ink }}>45 conseillers</strong> · téléphone, email, chat, réseaux sociaux
        </OFact>
        <OFact icon="inbox" tone="teal" d={350}>
          <strong style={{ color: C.ink }}>2 800 contacts</strong> par semaine, +40 % en période de soldes
        </OFact>
        <OFact icon="truck" tone="yellow" d={450}>
          Motifs : livraison, SAV, retours, remboursements, garanties
        </OFact>
        <OFact icon="target" tone="green" d={550}>
          Objectif : répondre en moins de 24 h, sans perdre en qualité
        </OFact>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 940, top: 280, width: 860 }}>
      <Eyebrow c={C.coral} size={20} cls={A.fade} style={dl(500)}>
        Lundi, 8 h 42 · email reçu
      </Eyebrow>
      <Bubble who="user" name="Mme Léa Moreau · commande NM-48213" cls={A.in} style={{ marginTop: 14, ...dl(650) }} size={25}>
        Bonjour, mon lave-linge est arrivé avec <strong>6 jours de retard</strong> et il <strong>fuit dès le premier lavage</strong> ! J’ai
        dû éponger toute la buanderie. C’est la <strong>deuxième fois</strong> que je vous écris et personne ne répond. Je veux une solution
        rapide, sinon j’annule tout et je laisse un avis.
      </Bubble>
      <div className={b.on(1)} style={{ marginTop: 26 }}>
        <Callout title="Toute la journée" tone="violet" icon="route" size={24}>
          Ce message va passer par chaque module : on l’<strong>analyse</strong> (M2), on y <strong>répond</strong> (M3), on{' '}
          <strong>désamorce</strong> (M4), on <strong>cherche la procédure</strong> (M5), on <strong>mesure</strong> (M6), puis on le traite
          de bout en bout (M7).
        </Callout>
      </div>
    </div>
  </Frame>
);

// ─── Règles du jeu & check-up ───────────────────────────────────────────────
const O_Setup: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Check-up : prêts pour les ateliers ?</Title>
    <Lede>Un seul outil suffit : l’assistant IA que votre entreprise autorise.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="su1" size={26}>Un assistant IA professionnel ouvert (Copilot, ChatGPT Entreprise, Gemini…)</CheckItem>
        <CheckItem id="su2" size={26}>Le kit de cas Nova Maison (messages, procédures, conversations)</CheckItem>
        <CheckItem id="su3" size={26}>Un document vierge pour garder vos meilleurs prompts</CheckItem>
        <CheckItem id="su4" size={26}>Votre binôme identifié pour les ateliers</CheckItem>
        <CheckItem id="su5" size={26}>Téléphone en silencieux, pas sur vos files de contact</CheckItem>
      </div>
      <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Timer id="setup" minutes={3} label="Check-up" cls={A.right} style={{ width: 560, ...dl(200) }} />
        <Callout title="Règle d’or" tone="coral" icon="lock" cls={A.right} style={dl(400)} size={25}>
          Aucune donnée réelle de client dans les ateliers : pas de nom, d’adresse, de numéro de contrat ou de carte. Le kit est 100 % fictif.
        </Callout>
      </div>
    </Checklist>
  </Frame>
);

// ═══ 10-m1 ═════════════════════════════════════════════════════════════

// ─── Module 1 · L’IA au service de la relation client ──────────────────────

const M1_Section: Page = () => (
  <Section
    n={1}
    title={
      <>
        L’IA au service
        <br />
        de la relation client
      </>
    }
    sub="Ce que l’IA générative sait faire pour un conseiller, ce qu’elle ne sait pas faire, et pourquoi la validation humaine reste au cœur."
    dur="9:20 – 10:00"
  >
    <SecItem n={1}>Les usages de l’IA dans la relation client</SecItem>
    <SecItem n={2}>L’assistance au conseiller</SecItem>
    <SecItem n={3}>L’analyse des demandes et la personnalisation</SecItem>
    <SecItem n={4}>Les limites et la validation humaine</SecItem>
    <SecItem n={5}>Bien demander : la recette d’un bon prompt</SecItem>
  </Section>
);
M1_Section.transition = BLOOM;

// ─── Où part le temps d’un conseiller ───────────────────────────────────────
const M1Seg = ({ w, tone, label, pct, ia, d }: { w: number; tone: Tone; label: string; pct: string; ia: boolean; d: number }) => (
  <div style={{ position: 'relative', width: w, flex: 'none' }}>
    <div
      className={A.grow}
      style={{ height: 120, background: STRONG[tone], borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', ...dl(d) }}
    >
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: tone === 'yellow' ? C.ink : '#fff' }}>{pct}</span>
    </div>
    <div style={{ marginTop: 14, fontSize: 23, lineHeight: 1.3, fontWeight: 600, color: C.ink }}>{label}</div>
    {ia ? (
      <div className={b.pop(1)} style={{ position: 'absolute', right: 10, top: -24, ...vars({ o: 'center' }) }}>
        <Tag tone="violet" size={18} style={{ background: C.violet, color: '#fff', boxShadow: 'none' }}>
          <Icon name="sparkles" size={18} /> IA
        </Tag>
      </div>
    ) : null}
  </div>
);

const M1_Temps: Page = () => (
  <Frame mod={1} beats={2}>
    <Title>Une journée de conseiller : où part le temps ?</Title>
    <Lede>Ordre de grandeur sur un traitement d’email client. → montre où l’IA peut aider, puis ce qu’on y gagne.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 330, width: 1680, display: 'flex', gap: 12 }}>
      <M1Seg w={400} tone="blue" label="Lire, comprendre, retrouver l’historique" pct="25 %" ia d={100} />
      <M1Seg w={320} tone="teal" label="Chercher la bonne info, la procédure" pct="20 %" ia d={250} />
      <M1Seg w={480} tone="violet" label="Rédiger la réponse" pct="30 %" ia d={400} />
      <M1Seg w={240} tone="yellow" label="Saisir, résumer, classer" pct="15 %" ia d={550} />
      <M1Seg w={192} tone="green" label="Relation, conseil, geste" pct="10 %" ia={false} d={700} />
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'flex', gap: 26 }}>
      <Card tone="violet" icon="clock" title="Ce que l’IA accélère" style={{ flex: 1 }} size={24}>
        Lire et résumer un long historique, retrouver la procédure, proposer un premier brouillon, remplir la fiche de contact.
      </Card>
      <Card tone="green" icon="heart" title="Ce que vous gagnez" style={{ flex: 1 }} size={24}>
        Du temps pour l’écoute, le conseil, les cas complexes et les clients fragiles : la part que l’IA ne fait pas.
      </Card>
      <Card tone="coral" icon="eye" title="Ce qui ne change pas" style={{ flex: 1 }} size={24}>
        Vous restez responsable de chaque réponse envoyée : l’IA prépare, vous relisez et validez.
      </Card>
    </div>
  </Frame>
);

// ─── L’IA générative en une minute ──────────────────────────────────────────
const M1Next = ({ word, p, w, d, best = false }: { word: string; p: string; w: number; d: number; best?: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
    <span style={{ width: 250, flex: 'none', fontSize: 27, fontWeight: best ? 700 : 500, color: best ? C.violet : C.soft }}>{word}</span>
    <div style={{ flex: 1, height: 34, background: C.panel, borderRadius: 8, overflow: 'hidden' }}>
      <div className={A.grow} style={{ width: w, height: '100%', background: best ? G.violet : C.faint, borderRadius: 8, ...dl(d) }} />
    </div>
    <span style={{ width: 80, flex: 'none', fontFamily: mono, fontSize: 24, color: best ? C.violet : C.muted, textAlign: 'right' }}>{p}</span>
  </div>
);

const M1_CestQuoi: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>L’IA générative en une minute</Title>
    <Lede>Elle ne « sait » pas : elle prédit, mot après mot, la suite la plus probable d’un texte.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 900, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 34px', ...dl(100) }}>
      <Eyebrow c={C.muted} size={19}>
        Le texte commence par…
      </Eyebrow>
      <div style={{ marginTop: 10, fontFamily: display, fontWeight: 700, fontSize: 36, color: C.navy, lineHeight: 1.3 }}>
        « Votre commande sera livrée <span className={A.blink} style={{ color: C.violet }}>▌</span> »
      </div>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <M1Next word="demain" p="41 %" w={300} d={500} best />
        <M1Next word="sous 48 heures" p="27 %" w={200} d={650} />
        <M1Next word="lundi" p="14 %" w={104} d={800} />
        <M1Next word="par transporteur" p="9 %" w={66} d={950} />
      </div>
      <div style={{ marginTop: 22, fontSize: 22, color: C.muted, lineHeight: 1.4 }}>
        Elle choisit un mot plausible… pas forcément le vrai délai de <em>cette</em> commande.
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1080, top: 270, width: 720, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Card tone="blue" icon="book" title="Elle a beaucoup lu" cls={b.on(1)} size={24}>
        Entraînée sur d’immenses volumes de textes : elle écrit très bien, dans toutes les langues et tous les tons.
      </Card>
      <Card tone="yellow" icon="lock" title="Elle ne connaît pas Nova Maison" cls={b.on(2)} size={24}>
        Ni vos procédures, ni vos délais, ni le dossier du client, sauf si vous les lui donnez dans la demande.
      </Card>
      <Card tone="coral" icon="alert" title="Elle peut se tromper avec aplomb" cls={b.on(3)} size={24}>
        Quand l’info manque, elle complète avec du plausible. C’est ce qu’on appelle une « hallucination ».
      </Card>
    </div>
  </Frame>
);

// ─── Six usages (cartes à retourner) ────────────────────────────────────────
const M1Use = ({ icon, tone, title, desc, ex }: { icon: IconName; tone: Tone; title: string; desc: string; ex: ReactNode }) => (
  <FlipCard
    w={536}
    h={296}
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
          Chez Nova Maison
        </Eyebrow>
        <div style={{ marginTop: 12, fontSize: 25, lineHeight: 1.42, color: C.ink }}>{ex}</div>
      </>
    }
  />
);

const M1_Usages: Page = () => (
  <Frame mod={1} kind="exercice" beats={1}>
    <Title>Six usages de l’IA dans la relation client</Title>
    <Lede>Cliquez une carte pour voir l’exemple concret. → retourne toutes les cartes.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 536px)', gap: 36, ...dl(100) }}>
      <M1Use icon="search" tone="blue" title="Analyser" desc="Comprendre une demande : intention, catégorie, urgence, émotion." ex="Un email de 20 lignes devient une fiche : « panne + retard, urgent, cliente très mécontente, 2e relance »." />
      <M1Use icon="pen" tone="violet" title="Rédiger" desc="Proposer un brouillon de réponse clair, complet et au bon ton." ex="Le conseiller obtient un brouillon en 10 secondes, le relit, corrige un délai et l’envoie." />
      <M1Use icon="user" tone="pink" title="Personnaliser" desc="Adapter la réponse au client, à son historique, à son canal." ex="« Comme indiqué lors de votre appel de jeudi… » plutôt qu’un modèle impersonnel." />
      <M1Use icon="translate" tone="teal" title="Traduire" desc="Répondre dans la langue du client, et comprendre la sienne." ex="Une cliente écrit en espagnol : on comprend, on répond en espagnol, avec la même qualité." />
      <M1Use icon="book" tone="yellow" title="Rechercher" desc="Trouver la bonne procédure dans une documentation volumineuse." ex="« Que faire si un appareil fuit sous garantie ? » → la procédure SAV, avec sa source." />
      <M1Use icon="chart" tone="green" title="Synthétiser" desc="Résumer un appel, repérer les motifs et les irritants récurrents." ex="Chaque lundi : les 5 motifs de contact de la semaine et les 3 irritants qui montent." />
    </div>
  </Frame>
);

// ─── L’assistant du conseiller (maquette) ───────────────────────────────────
const M1Sugg = ({ icon, tone, title, children, n }: { icon: IconName; tone: Tone; title: string; children: ReactNode; n: number }) => (
  <div className={b.on(n)} style={{ background: C.card, borderRadius: 14, boxShadow: `${SHADOW_SM}, inset 5px 0 0 ${STRONG[tone]}`, padding: '14px 20px 14px 24px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Icon name={icon} size={22} color={T[tone].fg} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 17, letterSpacing: '0.1em', textTransform: 'uppercase', color: T[tone].fg }}>{title}</span>
    </div>
    <div style={{ marginTop: 6, fontSize: 22, lineHeight: 1.4, color: C.ink }}>{children}</div>
  </div>
);

const M1_Assistance: Page = () => (
  <Frame mod={1} kind="demo" beats={4}>
    <Title>L’assistance au conseiller : un copilote, pas un pilote</Title>
    <Lede>Pendant que le client écrit, l’IA prépare. → fait apparaître chaque aide, une par une.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 820, height: 690, boxSizing: 'border-box', background: C.panel, borderRadius: 20, padding: 26, display: 'flex', flexDirection: 'column', gap: 18, ...dl(100) }}>
      <Eyebrow c={C.muted} size={18}>
        Chat en cours · client n° 77 104
      </Eyebrow>
      <Bubble who="user" name="Client" size={23}>
        Bonjour, j’ai commandé un canapé le 3, on m’annonçait 10 jours, toujours rien. Je reçois du monde samedi…
      </Bubble>
      <Bubble who="human" name="Conseiller" size={23}>
        Bonjour, je regarde votre commande tout de suite.
      </Bubble>
      <Bubble who="user" name="Client" size={23}>
        Et le suivi colis ne marche pas non plus.
      </Bubble>
    </div>
    <div style={{ position: 'absolute', left: 980, top: 260, width: 820, height: 690, boxSizing: 'border-box', background: T.violet.bg, borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className={A.fade} style={{ display: 'flex', alignItems: 'center', gap: 12, ...dl(300) }}>
        <IconTile name="sparkles" tone="violet" size={40} solid />
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: T.violet.fg }}>Assistant IA du conseiller</span>
      </div>
      <M1Sugg icon="note" tone="blue" title="Résumé" n={1}>
        Canapé commandé le 3, délai annoncé dépassé, suivi colis inaccessible, contrainte : samedi.
      </M1Sugg>
      <M1Sugg icon="target" tone="yellow" title="Intention · urgence" n={2}>
        Obtenir une date de livraison ferme · urgence moyenne (échéance samedi).
      </M1Sugg>
      <M1Sugg icon="book" tone="teal" title="Procédure suggérée" n={3}>
        « Retard transporteur » : contacter le transporteur, proposer un créneau, geste si plus de 7 jours.
      </M1Sugg>
      <M1Sugg icon="pen" tone="violet" title="Réponse proposée" n={4}>
        « Je comprends, surtout avec votre réception samedi. Je contacte le transporteur et je reviens vers vous avant 16 h… »
      </M1Sugg>
    </div>
  </Frame>
);

// ─── Personnalisation : avant / après ───────────────────────────────────────
const M1_Perso: Page = () => {
  const [perso, setPerso] = useState(false);
  return (
    <Frame mod={1} kind="demo">
      <Title>La personnalisation : le même message, deux expériences</Title>
      <Lede>Basculez l’interrupteur : l’IA a reçu, en plus, l’historique et le contexte du client.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, ...dl(100) }}>
        <Toggle on={perso} onChange={setPerso} label={perso ? 'Réponse personnalisée (avec contexte)' : 'Réponse générique (sans contexte)'} tone="violet" size={28} />
      </div>
      <div
        className={A.in}
        style={{
          position: 'absolute',
          left: 120,
          top: 350,
          width: 1060,
          height: 560,
          boxSizing: 'border-box',
          background: C.card,
          borderRadius: 20,
          boxShadow: perso ? `0 0 0 3px ${C.violet}, ${SHADOW}` : SHADOW,
          padding: '30px 36px',
          fontSize: 26,
          lineHeight: 1.5,
          color: C.ink,
          transition: `box-shadow 400ms ${EASE}`,
          ...dl(200),
        }}
      >
        {perso ? (
          <div key="p" className={A.fade} style={{ animationDuration: '400ms' } as CSSProperties}>
            <p style={{ margin: 0 }}>
              Bonjour <Hl>Monsieur Petit</Hl>,
            </p>
            <p style={{ margin: '14px 0 0' }}>
              Merci pour votre retour sur <Hl>le réfrigérateur Glacia livré mardi</Hl>. Je comprends qu’un bruit la nuit soit pénible,{' '}
              <Hl>d’autant que c’est votre deuxième appareil chez nous</Hl>.
            </p>
            <p style={{ margin: '14px 0 0' }}>
              Comme il est <Hl>sous garantie jusqu’en mars 2028</Hl>, je vous propose la visite d’un technicien <Hl>jeudi ou vendredi matin</Hl>.
              Lequel vous convient ?
            </p>
            <p style={{ margin: '14px 0 0' }}>Bien cordialement, Inès, service client Nova Maison</p>
          </div>
        ) : (
          <div key="g" className={A.fade} style={{ animationDuration: '400ms' } as CSSProperties}>
            <p style={{ margin: 0 }}>Bonjour,</p>
            <p style={{ margin: '14px 0 0' }}>
              Nous avons bien reçu votre demande concernant votre produit. Nous sommes désolés pour la gêne occasionnée.
            </p>
            <p style={{ margin: '14px 0 0' }}>
              Votre demande a été transmise au service concerné, qui reviendra vers vous dans les meilleurs délais.
            </p>
            <p style={{ margin: '14px 0 0' }}>Cordialement, le service client</p>
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', left: 1230, top: 350, width: 570, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card tone="violet" icon="user" title="Ce qui personnalise" cls={A.right} style={dl(300)} size={23}>
          Le nom, le produit, l’historique, la garantie, une solution concrète et un choix laissé au client.
        </Card>
        <Card tone="coral" icon="alert" title="Ce qui la rend possible" cls={A.right} style={dl(450)} size={23}>
          Le contexte que <strong>vous</strong> donnez à l’IA. Sans contexte, elle ne peut produire que du générique… ou inventer.
        </Card>
        <Callout title="Attention" tone="yellow" icon="lock" cls={A.right} style={dl(600)} size={22}>
          Personnaliser ≠ tout coller : seulement le nécessaire, dans un outil autorisé.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Quiz flash : vrai ou faux ? ────────────────────────────────────────────
const M1_QuizFlash: Page = () => (
  <Frame mod={1} kind="quiz">
    <Title>Quiz flash : vrai ou faux ?</Title>
    <QuizSeries y={220}>
      <QuizQ q="« L’IA connaît nos conditions de retour et nos délais de livraison. »" explain="Elle ne connaît que ce que vous lui donnez : la procédure collée dans la demande, ou une base de connaissances branchée sur l’outil. Sinon, elle invente un délai plausible.">
        <QOpt>Vrai, elle a été entraînée sur Internet</QOpt>
        <QOpt ok>Faux, sauf si on les lui fournit</QOpt>
        <QOpt>Vrai, si notre site est public</QOpt>
      </QuizQ>
      <QuizQ q="« L’IA peut se tromper tout en ayant l’air sûre d’elle. »" explain="C’est l’hallucination : une réponse fausse, bien rédigée. D’où la relecture systématique avant envoi, surtout sur les montants, les délais et les engagements.">
        <QOpt ok>Vrai, et c’est le principal piège</QOpt>
        <QOpt>Faux, elle dit toujours « je ne sais pas »</QOpt>
        <QOpt>Faux, avec les versions récentes</QOpt>
      </QuizQ>
      <QuizQ q="« Je peux coller l’email d’un client avec son adresse et son IBAN dans une IA grand public. »" explain="Jamais dans un outil non autorisé : les données peuvent être conservées ou réutilisées. On utilise l’outil validé par l’entreprise et on retire les données inutiles (module 7).">
        <QOpt>Vrai, si je supprime l’échange après</QOpt>
        <QOpt>Vrai, c’est pour aider le client</QOpt>
        <QOpt ok>Faux : outil autorisé et données minimales</QOpt>
      </QuizQ>
      <QuizQ q="« Le même prompt donne toujours exactement la même réponse. »" explain="La génération comporte une part de hasard : deux essais donnent deux formulations. C’est pour cela qu’on crée des modèles cadrés et qu’on relit toujours.">
        <QOpt>Vrai</QOpt>
        <QOpt ok>Faux : la formulation varie d’un essai à l’autre</QOpt>
        <QOpt>Vrai, si on écrit en majuscules</QOpt>
      </QuizQ>
      <QuizQ q="« Avec l’IA, le conseiller n’est plus responsable de la réponse envoyée. »" explain="La réponse part au nom de l’entreprise et du conseiller. L’IA est un outil de préparation : la décision et la responsabilité restent humaines.">
        <QOpt>Vrai, c’est l’outil qui a écrit</QOpt>
        <QOpt ok>Faux : celui qui envoie reste responsable</QOpt>
        <QOpt>Ça dépend de l’outil</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Les limites ────────────────────────────────────────────────────────────
const M1Lim = ({ icon, tone, title, children, n }: { icon: IconName; tone: Tone; title: string; children: ReactNode; n: number }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 26px' }}>
    <IconTile name={icon} tone={tone} size={58} solid />
    <div>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M1_Limites: Page = () => (
  <Frame mod={1} beats={6}>
    <Title>Cinq limites à connaître avant de s’y fier</Title>
    <Lede>→ fait apparaître chaque limite, puis la parade.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
      <M1Lim icon="alert" tone="coral" title="Elle invente quand elle ne sait pas" n={1}>
        Un délai, un montant, un geste commercial qui n’existent pas.
      </M1Lim>
      <M1Lim icon="eyeOff" tone="yellow" title="Elle ne voit pas vos systèmes" n={2}>
        Elle ignore l’état réel de la commande, du stock ou du dossier.
      </M1Lim>
      <M1Lim icon="lock" tone="navy" title="Elle peut exposer des données" n={3}>
        Ce qu’on colle dans un outil non autorisé peut sortir de l’entreprise.
      </M1Lim>
      <M1Lim icon="frown" tone="pink" title="Elle peut rater le ton" n={4}>
        Trop formelle, trop enjouée, ou maladroite face à un client fragile.
      </M1Lim>
      <M1Lim icon="scale" tone="violet" title="Elle ne décide pas" n={5}>
        Un remboursement, une exception, un geste : c’est une décision humaine.
      </M1Lim>
      <div className={b.pop(6)} style={{ display: 'flex', alignItems: 'center', gap: 20, background: G.navy, borderRadius: 18, padding: '20px 28px', color: '#fff' }}>
        <Icon name="humanCheck" size={58} color="#fff" />
        <div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28 }}>La parade : la validation humaine</div>
          <div style={{ marginTop: 4, fontSize: 23, lineHeight: 1.4, color: '#D6DCF5' }}>Fournir le contexte, relire, corriger, décider.</div>
        </div>
      </div>
    </div>
  </Frame>
);

// ─── Repérez les erreurs (soulignement + corrections au fil des →) ─────────
// Faulty phrase: a red bar grows under it on beat `n`.
const Cx2 = ({ n, children }: { n: number; children: ReactNode }) => (
  <span style={{ position: 'relative' }}>
    {children}
    <span className={b.grow(n)} style={{ position: 'absolute', left: 0, right: 0, bottom: -3, height: 5, borderRadius: 3, background: C.coral }} />
  </span>
);

const M1Err = ({ n, title, children }: { n: number; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 5px 0 0 ${C.coral}`, padding: '14px 20px 14px 22px' }}>
    <Num n={n} tone="coral" size={40} />
    <div>
      <div style={{ fontWeight: 700, fontSize: 24, color: T.coral.fg }}>{title}</div>
      <div style={{ marginTop: 2, fontSize: 21, lineHeight: 1.38, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M1Pin = ({ n, y }: { n: number; y: number }) => (
  <Num n={n} tone="coral" size={44} cls={b.pop(n)} style={{ position: 'absolute', left: 1100, top: y - 22, boxShadow: '0 0 0 4px #fff' }} />
);

const M1_Erreurs: Page = () => (
  <Frame mod={1} kind="exercice" beats={5}>
    <Title>À vous : repérez les quatre erreurs de l’IA</Title>
    <Lede>Brouillon généré pour Mme Moreau sans lui donner le dossier. Cherchez d’abord, puis → révèle chaque erreur.</Lede>
    <div
      className={A.in}
      style={{ position: 'absolute', left: 120, top: 270, width: 1060, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '30px 38px', fontSize: 27, lineHeight: 1.55, color: C.ink, ...dl(100) }}
    >
      <Eyebrow c={C.violet} size={18} style={{ marginBottom: 10 }}>
        Brouillon IA · non relu
      </Eyebrow>
      <p style={{ margin: 0 }}>
        Bonjour <Cx2 n={1}>Madame Morel</Cx2>,
      </p>
      <p style={{ margin: '12px 0 0' }}>
        Nous sommes désolés pour la fuite de votre <Cx2 n={2}>lave-vaisselle</Cx2>.
      </p>
      <p style={{ margin: '12px 0 0' }}>
        Un technicien passera chez vous <Cx2 n={3}>demain entre 8 h et 10 h</Cx2>.
      </p>
      <p style={{ margin: '12px 0 0' }}>
        Pour nous excuser, nous vous offrons <Cx2 n={4}>un bon d’achat de 100 €</Cx2>.
      </p>
      <p style={{ margin: '12px 0 0' }}>Cordialement, le service client</p>
    </div>
    <M1Pin n={1} y={353} />
    <M1Pin n={2} y={407} />
    <M1Pin n={3} y={461} />
    <M1Pin n={4} y={515} />
    <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M1Err n={1} title="Mauvais nom">
        La cliente s’appelle Mme Moreau : la confiance est rompue dès la 1re ligne.
      </M1Err>
      <M1Err n={2} title="Mauvais produit">
        C’est un lave-linge : l’IA a « complété » avec un produit plausible.
      </M1Err>
      <M1Err n={3} title="Engagement inventé">
        Aucun créneau n’a été réservé : promesse impossible à tenir.
      </M1Err>
      <M1Err n={4} title="Geste non autorisé">
        Un geste commercial se décide selon la procédure, par une personne habilitée.
      </M1Err>
    </div>
    <div className={b.on(5)} style={{ position: 'absolute', left: 120, top: 690, width: 1060, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Callout title="La leçon" tone="green" icon="checkCircle" size={25}>
        Le texte est fluide et poli… et pourtant faux sur quatre points. <strong>La forme ne garantit jamais le fond.</strong>
      </Callout>
      <Callout title="Réflexe" tone="blue" icon="eye" size={25}>
        Vérifiez toujours : <strong>nom, produit, dates, montants, engagements</strong>.
      </Callout>
    </div>
  </Frame>
);

// ─── L’IA propose, le conseiller dispose ────────────────────────────────────
const M1Check = ({ n, tone, q, children }: { n: number; tone: Tone; q: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 26px', borderTop: `7px solid ${STRONG[tone]}` }}>
    <Num n={n} tone={tone} size={50} />
    <div style={{ marginTop: 16, fontFamily: display, fontWeight: 800, fontSize: 32, color: C.navy }}>{q}</div>
    <div style={{ marginTop: 10, fontSize: 23, lineHeight: 1.42, color: C.soft }}>{children}</div>
  </div>
);

const M1_Validation: Page = () => (
  <Frame mod={1} beats={5}>
    <Title>« L’IA propose, le conseiller dispose » : les 4 vérifications</Title>
    <Lede>Avant chaque envoi, quatre questions. Trente secondes qui évitent une réclamation de plus.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', gap: 24 }}>
      <M1Check n={1} tone="blue" q="Exact ?">
        Noms, produits, numéros, dates, montants, délais : tout correspond au dossier.
      </M1Check>
      <M1Check n={2} tone="teal" q="Complet ?">
        Toutes les questions du client ont une réponse, et la prochaine étape est claire.
      </M1Check>
      <M1Check n={3} tone="violet" q="Adapté ?">
        Le ton convient à la situation et au client ; pas de jargon, pas de copier-coller visible.
      </M1Check>
      <M1Check n={4} tone="coral" q="Conforme ?">
        Rien d’interdit : pas d’engagement non autorisé, pas de donnée d’un autre client.
      </M1Check>
    </div>
    <div className={b.on(5)} style={{ position: 'absolute', left: 120, top: 760, width: 1680 }}>
      <Callout title="Règle d’équipe" tone="green" icon="humanCheck" size={26}>
        Aucun texte généré ne part sans avoir été lu en entier. Si vous ne pouvez pas vérifier une information, vous ne l’envoyez pas.
      </Callout>
    </div>
  </Frame>
);

// ─── La recette du prompt (constructeur interactif) ─────────────────────────
const M1Ing = ({ on, set, tone, label }: { on: boolean; set: (v: boolean) => void; tone: Tone; label: string }) => (
  <Toggle on={on} onChange={set} label={<span style={{ fontWeight: 600 }}>{label}</span>} tone={tone} size={25} />
);

const M1_Recette: Page = () => {
  const [role, setRole] = useState(false);
  const [ctx, setCtx] = useState(false);
  const [fmt, setFmt] = useState(false);
  const [ton, setTon] = useState(false);
  const score = 1 + Number(role) + Number(ctx) + Number(fmt) + Number(ton);
  const lv = score <= 2 ? 0 : score <= 4 ? 1 : 2;
  const tone: Tone = lv === 0 ? 'coral' : lv === 1 ? 'yellow' : 'green';
  return (
    <Frame mod={1} kind="simu">
      <Title>Bien demander : la recette d’un bon prompt</Title>
      <Lede>Activez les ingrédients un à un et regardez la réponse s’améliorer.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 420, display: 'flex', flexDirection: 'column', gap: 22, ...dl(100) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 25, fontWeight: 600, color: C.ink }}>
          <span style={{ width: 66, height: 38, borderRadius: 999, background: C.blue, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="check" size={22} color="#fff" sw={3} />
          </span>
          Tâche (toujours)
        </div>
        <M1Ing on={role} set={setRole} tone="violet" label="Rôle" />
        <M1Ing on={ctx} set={setCtx} tone="teal" label="Contexte" />
        <M1Ing on={fmt} set={setFmt} tone="yellow" label="Format" />
        <M1Ing on={ton} set={setTon} tone="pink" label="Ton" />
        <div style={{ marginTop: 10, background: C.card, borderRadius: 16, boxShadow: SHADOW, padding: '16px 20px' }}>
          <Eyebrow c={C.muted} size={17}>
            Qualité de la réponse
          </Eyebrow>
          <div style={{ marginTop: 10, height: 14, borderRadius: 7, background: C.panel, overflow: 'hidden' }}>
            <div style={{ width: `${score * 20}%`, height: '100%', background: STRONG[tone], transition: `width 450ms ${EASE}, background 300ms` }} />
          </div>
          <div style={{ marginTop: 8, fontSize: 22, fontWeight: 700, color: T[tone].fg }}>{['Générique', 'Correcte', 'Prête à relire'][lv]}</div>
        </div>
      </div>
      <CodeDark file="mon-prompt.txt" size={20} wrap cls={A.in} style={{ position: 'absolute', left: 580, top: 262, width: 600, height: 670, ...dl(200) }}>
        {role ? (
          <>
            <Ck>Rôle · </Ck>Tu es conseiller du service client de Nova Maison (électroménager en ligne).{'\n\n'}
          </>
        ) : null}
        {ctx ? (
          <>
            <Ck>Contexte · </Ck>Lave-linge livré avec 6 jours de retard, fuite au 1er lavage, 2e relance. Procédure : échange ou technicien sous 72 h, au choix
            du client.{'\n\n'}
          </>
        ) : null}
        <Ck>Tâche · </Ck>Rédige une réponse à l’email ci-dessous.{'\n\n'}
        {fmt ? (
          <>
            <Ck>Format · </Ck>Email de 120 mots max, 3 paragraphes, prochaine étape claire.{'\n\n'}
          </>
        ) : null}
        {ton ? (
          <>
            <Ck>Ton · </Ck>Empathique et professionnel, vouvoiement, sans jargon.{'\n\n'}
          </>
        ) : null}
        <Cc>[email de la cliente]</Cc>
      </CodeDark>
      <div
        style={{
          position: 'absolute',
          left: 1220,
          top: 262,
          width: 580,
          height: 670,
          boxSizing: 'border-box',
          background: C.card,
          borderRadius: 20,
          boxShadow: `inset 0 0 0 3px ${STRONG[tone]}, ${SHADOW}`,
          padding: '24px 28px',
          fontSize: 22,
          lineHeight: 1.5,
          color: C.ink,
          transition: `box-shadow 300ms ${EASE}`,
        }}
      >
        <Eyebrow c={T[tone].fg} size={17} style={{ marginBottom: 10 }}>
          Réponse obtenue
        </Eyebrow>
        {lv === 0 ? (
          <div key="0" className={A.fade} style={{ animationDuration: '350ms' } as CSSProperties}>
            Bonjour, nous sommes désolés pour la gêne occasionnée. Votre demande a bien été prise en compte et sera traitée dans les meilleurs délais.
            N’hésitez pas à nous recontacter. Cordialement.
          </div>
        ) : lv === 1 ? (
          <div key="1" className={A.fade} style={{ animationDuration: '350ms' } as CSSProperties}>
            Bonjour Madame, nous sommes désolés pour le retard de livraison et le problème rencontré avec votre lave-linge. Nous allons organiser une
            solution rapidement : un conseiller vous recontactera. Cordialement, le service client Nova Maison.
          </div>
        ) : (
          <div key="2" className={A.fade} style={{ animationDuration: '350ms' } as CSSProperties}>
            Bonjour Madame Moreau,
            <br />
            <br />
            Je suis sincèrement désolé : un retard de 6 jours, puis une fuite dès le premier lavage, et une deuxième relance sans réponse. Ce
            n’est pas le service que vous méritez.
            <br />
            <br />
            Je vous propose, au choix : l’échange de l’appareil ou la venue d’un technicien sous 72 h. Répondez simplement « échange » ou
            « technicien » et je m’en occupe aujourd’hui.
            <br />
            <br />
            Bien cordialement, Karim, service client Nova Maison
          </div>
        )}
      </div>
    </Frame>
  );
};

// ─── QCM ────────────────────────────────────────────────────────────────────
const M1_Qcm: Page = () => (
  <QcmPage
    mod={1}
    n={1}
    title="Le bon réflexe"
    q="L’IA propose une réponse parfaite… avec un remboursement « sous 48 h ». Vous ne connaissez pas ce délai. Que faites-vous ?"
    explain="Une information que vous ne pouvez pas vérifier ne part pas. Vous vérifiez dans la procédure ou le dossier, ou vous la retirez : le client retiendra la promesse."
  >
    <Opt why="Le texte est fluide, mais un délai inventé devient une promesse que l’entreprise devra tenir… ou une réclamation.">J’envoie : la réponse est très bien écrite</Opt>
    <Opt ok why="Exact : on vérifie la procédure ou le dossier ; à défaut, on retire le délai ou on le remplace par la bonne information.">
      Je vérifie le délai, sinon je le retire
    </Opt>
    <Opt why="L’IA confirmera souvent sa propre réponse : elle n’a pas accès à vos procédures. Ce n’est pas une vérification.">Je demande à l’IA si elle est sûre</Opt>
    <Opt why="Le reste du brouillon est peut-être utile : il suffit de corriger le point douteux.">Je supprime tout et j’écris tout seul</Opt>
  </QcmPage>
);

// ─── Synthèse ───────────────────────────────────────────────────────────────
const SynthRow = ({ n, tone, children }: { n: number; tone: Tone; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 22, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 26px', ...dl(150 + n * 120) }}>
    <Num n={n} tone={tone} size={48} />
    <div style={{ fontSize: 27, lineHeight: 1.4, color: C.ink }}>{children}</div>
  </div>
);

const M1_Synthese: Page = () => (
  <Frame mod={1} kind="synthese">
    <Title>Module 1 · ce qu’il faut retenir</Title>
    <div style={{ position: 'absolute', left: 120, top: 210, width: 1680, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <SynthRow n={1} tone="blue">
        L’IA générative <strong>prédit du texte</strong> : excellente pour lire, résumer, rédiger, traduire ; elle ne connaît pas vos dossiers.
      </SynthRow>
      <SynthRow n={2} tone="violet">
        Six usages clés : <strong>analyser, rédiger, personnaliser, traduire, rechercher, synthétiser</strong>.
      </SynthRow>
      <SynthRow n={3} tone="teal">
        Un bon prompt = <strong>rôle + contexte + tâche + format + ton</strong>. Plus de contexte, moins d’invention.
      </SynthRow>
      <SynthRow n={4} tone="coral">
        Elle peut inventer avec aplomb : vérifiez <strong>nom, produit, dates, montants, engagements</strong>.
      </SynthRow>
      <SynthRow n={5} tone="green">
        <strong>L’IA propose, le conseiller dispose</strong> : exact, complet, adapté, conforme… puis envoyé.
      </SynthRow>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(1000) }}>
      <Icon name="note" size={24} color={C.violet} />
      Dans votre document : copiez la recette du prompt, elle servira dans tous les ateliers.
    </div>
  </Frame>
);

// ═══ 20-m2 ═════════════════════════════════════════════════════════════

// ─── Module 2 · Comprendre et analyser une demande client ──────────────────

// Marker sweep: the highlight paints itself across the words on beat `n`.
for (let n = 1; n <= 8; n++) {
  CSS.push(`
.${P}-mk${n}{background-size:0% 100%;background-repeat:no-repeat;transition:background-size 700ms ${EASE}}
${at(n)} .${P}-mk${n}{background-size:100% 100%}
`);
}
const Mk = ({ n, tone = 'blue', children }: { n: number; tone?: Tone; children: ReactNode }) => (
  <span
    className={k(`mk${n}`)}
    style={{ backgroundImage: `linear-gradient(${T[tone].bd}, ${T[tone].bd})`, borderRadius: 4, padding: '0 3px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}
  >
    {children}
  </span>
);

const M2_Section: Page = () => (
  <Section
    n={2}
    title={
      <>
        Comprendre et analyser
        <br />
        une demande client
      </>
    }
    sub="Avant de répondre, comprendre : ce que le client veut, de quoi il parle, ce qui presse, et ce qu’il ressent."
    dur="10:00 – 10:55 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 1 · analyser plusieurs demandes clients
      </Tag>
    }
  >
    <SecItem n={1}>Identifier l’intention du client</SecItem>
    <SecItem n={2}>Classer les demandes</SecItem>
    <SecItem n={3}>Extraire les informations importantes</SecItem>
    <SecItem n={4}>Détecter l’urgence</SecItem>
    <SecItem n={5}>Identifier les émotions et le niveau d’insatisfaction</SecItem>
  </Section>
);
M2_Section.transition = BLOOM;

// ─── La grille d’analyse en 5 questions ─────────────────────────────────────
const M2Q = ({ n, icon, tone, q, children }: { n: number; icon: IconName; tone: Tone; q: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 22px 24px', borderTop: `7px solid ${STRONG[tone]}` }}>
    <IconTile name={icon} tone={tone} size={54} solid />
    <div style={{ marginTop: 14, fontFamily: display, fontWeight: 800, fontSize: 25, lineHeight: 1.2, color: C.navy }}>{q}</div>
    <div style={{ marginTop: 12, fontSize: 22, lineHeight: 1.42, color: C.soft }}>{children}</div>
  </div>
);

const M2_Grille: Page = () => (
  <Frame mod={2} beats={5}>
    <Title>Cinq questions à poser à chaque message</Title>
    <Lede>Appliquées au message de Mme Moreau. → répond à chaque question.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 1680, ...dl(100) }}>
      <Bubble who="user" name="Mme Moreau · email" size={23} w={1580}>
        Mon lave-linge est arrivé avec 6 jours de retard et il fuit dès le premier lavage ! C’est la deuxième fois que je vous écris et personne ne
        répond. Je veux une solution rapide, sinon j’annule tout et je laisse un avis.
      </Bubble>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 470, width: 1680, display: 'flex', gap: 20 }}>
      <M2Q n={1} icon="target" tone="blue" q="Que veut-elle ?">
        Une solution rapide à la fuite (réparation ou échange), et être enfin entendue.
      </M2Q>
      <M2Q n={2} icon="filter" tone="teal" q="De quoi parle-t-elle ?">
        SAV · produit défectueux, avec un retard de livraison en toile de fond.
      </M2Q>
      <M2Q n={3} icon="note" tone="violet" q="Quelles infos ?">
        Commande NM-48213 · lave-linge · retard 6 jours · fuite au 1er lavage · 2e contact.
      </M2Q>
      <M2Q n={4} icon="clock" tone="yellow" q="Est-ce urgent ?">
        Oui : appareil inutilisable, 2e relance, menace d’annulation et d’avis public.
      </M2Q>
      <M2Q n={5} icon="frown" tone="coral" q="Que ressent-elle ?">
        Exaspération : « personne ne répond », point d’exclamation, ultimatum.
      </M2Q>
    </div>
  </Frame>
);

// ─── Identifier l’intention (ce qui est dit / ce qui est voulu) ─────────────
const M2Int = ({ said, want, tone, flipAt }: { said: string; want: ReactNode; tone: Tone; flipAt: number }) => (
  <FlipCard
    w={396}
    h={440}
    tone={tone}
    backTone={tone}
    flipAt={flipAt}
    front={
      <>
        <Eyebrow c={C.muted} size={17}>
          Le client écrit
        </Eyebrow>
        <div style={{ marginTop: 16, fontFamily: display, fontWeight: 700, fontSize: 29, lineHeight: 1.3, color: C.navy }}>« {said} »</div>
      </>
    }
    back={
      <>
        <Eyebrow c={T[tone].fg} size={17}>
          Il veut vraiment
        </Eyebrow>
        <div style={{ marginTop: 14, fontSize: 25, lineHeight: 1.42, color: C.ink }}>{want}</div>
      </>
    }
  />
);

const M2_Intention: Page = () => (
  <Frame mod={2} kind="exercice" beats={4}>
    <Title>L’intention : ce que le client veut, pas seulement ce qu’il dit</Title>
    <Lede>Devinez l’intention réelle, puis retournez la carte (clic ou →).</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'flex', gap: 32, ...dl(100) }}>
      <M2Int said="Je suis très déçu par votre service." tone="blue" flipAt={1} want="Être reconnu dans sa déception… et savoir ce qui va être fait. Sans question explicite, il attend quand même une action." />
      <M2Int said="Vous avez bien reçu mon retour ?" tone="teal" flipAt={2} want="Être rassuré sur son remboursement : la vraie question, c’est « quand vais-je être remboursé ? »." />
      <M2Int said="C’est quoi ces frais de 9,90 € ?" tone="violet" flipAt={3} want="Contester des frais qu’il juge injustifiés, et probablement en obtenir le remboursement." />
      <M2Int said="Je déménage le 15 du mois prochain." tone="pink" flipAt={4} want="Faire livrer sa commande à la nouvelle adresse, ou décaler la livraison." />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 750, width: 1680, ...dl(500) }}>
      <Callout title="Avec l’IA" tone="blue" icon="sparkles" size={25}>
        Demandez-lui : « Quelle est l’<strong>intention principale</strong> du client ? Y a-t-il une <strong>intention secondaire</strong> ? Cite la
        phrase qui le montre. » La citation vous permet de vérifier en deux secondes.
      </Callout>
    </div>
  </Frame>
);

// ─── Classer les demandes (jeu de tri) ──────────────────────────────────────
const M2Zone = ({ x, y, tone, icon, label }: { x: number; y: number; tone: Tone; icon: IconName; label: string }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 560,
      height: 330,
      boxSizing: 'border-box',
      borderRadius: 20,
      background: T[tone].bg,
      boxShadow: `inset 0 0 0 2.5px ${T[tone].bd}`,
      padding: '16px 20px',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Icon name={icon} size={28} color={T[tone].fg} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: T[tone].fg }}>{label}</span>
    </div>
  </div>
);

const M2_Classer: Page = () => (
  <Frame mod={2} kind="jeu" beats={1}>
    <Title>Jeu : rangez chaque demande dans sa catégorie</Title>
    <Lede>Glissez les étiquettes (double-clic = retour à la place). → affiche le corrigé.</Lede>
    <M2Zone x={660} y={250} tone="blue" icon="truck" label="Livraison" />
    <M2Zone x={1240} y={250} tone="coral" icon="tool" label="SAV · panne" />
    <M2Zone x={660} y={600} tone="violet" icon="euro" label="Facturation · remboursement" />
    <M2Zone x={1240} y={600} tone="teal" icon="cart" label="Commande · modification" />
    <Drag x={120} y={250} w={500} tone="grey" size={21}>
      « Colis indiqué livré, mais rien reçu »
    </Drag>
    <Drag x={120} y={330} w={500} tone="grey" size={21}>
      « Le four affiche une erreur E3 »
    </Drag>
    <Drag x={120} y={410} w={500} tone="grey" size={21}>
      « Je n’ai jamais reçu ma facture »
    </Drag>
    <Drag x={120} y={490} w={500} tone="grey" size={21}>
      « Ajouter une extension de garantie ? »
    </Drag>
    <Drag x={120} y={570} w={500} tone="grey" size={21}>
      « Le livreur a rayé mon parquet »
    </Drag>
    <Drag x={120} y={650} w={500} tone="grey" size={21}>
      « Retour fait, toujours pas remboursé »
    </Drag>
    <Drag x={120} y={730} w={500} tone="grey" size={21}>
      « Puis-je annuler ma commande d’hier ? »
    </Drag>
    <Drag x={120} y={810} w={500} tone="grey" size={21}>
      « Le lave-vaisselle ne vidange plus »
    </Drag>
    <div
      className={b.on(1)}
      style={{ position: 'absolute', left: 660, top: 945, width: 1140, display: 'flex', alignItems: 'center', gap: 14, fontSize: 21, color: C.ink, zIndex: 25 }}
    >
      <Tag tone="blue" size={18}>Livraison : colis, parquet</Tag>
      <Tag tone="coral" size={18}>SAV : four, lave-vaisselle</Tag>
      <Tag tone="violet" size={18}>Factu. : facture, retour</Tag>
      <Tag tone="teal" size={18}>Commande : garantie, annulation</Tag>
    </div>
  </Frame>
);

// ─── Extraire les informations importantes ──────────────────────────────────
const M2Field = ({ n, label, value, tone }: { n: number; label: string; value: ReactNode; tone: Tone }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, padding: '12px 0', borderBottom: `1.5px solid ${C.rule}` }}>
    <span style={{ width: 200, flex: 'none', fontFamily: display, fontWeight: 700, fontSize: 18, letterSpacing: '0.08em', textTransform: 'uppercase', color: T[tone].fg }}>{label}</span>
    <span className={b.left(n)} style={{ fontSize: 24, fontWeight: 600, color: C.ink, lineHeight: 1.3 }}>
      {value}
    </span>
  </div>
);

const M2_Extraire: Page = () => (
  <Frame mod={2} beats={6}>
    <Title>Extraire les informations importantes</Title>
    <Lede>Le message est long et désordonné ; la fiche, elle, se lit en cinq secondes. → extrait chaque information.</Lede>
    <div
      className={A.in}
      style={{ position: 'absolute', left: 120, top: 270, width: 820, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 32px', fontSize: 25, lineHeight: 1.62, color: C.ink, ...dl(100) }}
    >
      <Eyebrow c={C.muted} size={17} style={{ marginBottom: 8 }}>
        Chat · samedi 14 h 05
      </Eyebrow>
      Bonjour, alors voilà, j’ai commandé <Mk n={2} tone="violet">la cave à vin Vinea 40</Mk> il y a deux semaines (commande{' '}
      <Mk n={1}>NM-51870</Mk>) et elle a été livrée <Mk n={3} tone="yellow">mardi dernier</Mk>. Depuis hier,{' '}
      <Mk n={4} tone="coral">elle ne refroidit plus du tout</Mk>, j’ai dû tout mettre au frigo. Je voudrais savoir{' '}
      <Mk n={5} tone="teal">si vous pouvez me l’échanger</Mk>, ou au pire la réparer. Je suis{' '}
      <Mk n={6} tone="green">joignable plutôt le soir après 18 h</Mk>. Merci d’avance, Thomas
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1000, top: 270, width: 800, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 32px', ...dl(200) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <IconTile name="table" tone="navy" size={42} solid />
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.navy }}>Fiche de contact</span>
      </div>
      <M2Field n={1} label="Commande" value="NM-51870" tone="blue" />
      <M2Field n={2} label="Produit" value="Cave à vin Vinea 40" tone="violet" />
      <M2Field n={3} label="Livraison" value="Mardi dernier (moins de 15 jours)" tone="yellow" />
      <M2Field n={4} label="Problème" value="Ne refroidit plus depuis hier" tone="coral" />
      <M2Field n={5} label="Demande" value="Échange, à défaut réparation" tone="teal" />
      <M2Field n={6} label="Disponibilité" value="Le soir, après 18 h" tone="green" />
    </div>
    <div className={b.on(6)} style={{ position: 'absolute', left: 120, top: 760, width: 820 }}>
      <Callout title="Le piège" tone="coral" icon="alert" size={23}>
        Si une info manque (le n° de commande, par exemple), l’IA doit écrire « non précisé », jamais inventer. Dites-le dans le prompt.
      </Callout>
    </div>
  </Frame>
);

// ─── Détecter l’urgence ─────────────────────────────────────────────────────
const M2Prio = ({ n, p, tone, when, children }: { n: number; p: string; tone: Tone; when: string; children: ReactNode }) => (
  <div className={b.left(n)} style={{ display: 'flex', alignItems: 'center', gap: 20, background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 8px 0 0 ${STRONG[tone]}`, padding: '16px 24px 16px 30px' }}>
    <span style={{ width: 74, flex: 'none', fontFamily: display, fontWeight: 800, fontSize: 40, color: tone === 'yellow' ? C.amber : STRONG[tone] }}>{p}</span>
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 24, color: C.navy }}>{when}</div>
      <div style={{ marginTop: 2, fontSize: 21, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M2Sig = ({ icon, children, d }: { icon: IconName; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 14, ...dl(d) }}>
    <IconTile name={icon} tone="yellow" size={46} />
    <span style={{ fontSize: 23, lineHeight: 1.35, color: C.ink }}>{children}</span>
  </div>
);

const M2_Urgence: Page = () => (
  <Frame mod={2} beats={5}>
    <Title>Détecter l’urgence : des signaux, puis une priorité</Title>
    <Lede>L’IA repère les signaux ; la grille de priorité, c’est votre entreprise qui la fixe.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 640, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Eyebrow c={C.amber} size={20} cls={A.fade}>
        Signaux d’urgence
      </Eyebrow>
      <M2Sig icon="alert" d={150}>
        Sécurité : étincelles, fuite, odeur de brûlé
      </M2Sig>
      <M2Sig icon="euro" d={250}>
        Impact financier : double prélèvement, loyer
      </M2Sig>
      <M2Sig icon="calendar" d={350}>
        Échéance proche : livraison demain, événement
      </M2Sig>
      <M2Sig icon="loop" d={450}>
        Relances : « deuxième fois », « troisième appel »
      </M2Sig>
      <M2Sig icon="megaphone" d={550}>
        Menaces : annulation, avis public, association
      </M2Sig>
      <M2Sig icon="heart" d={650}>
        Fragilité : âge, santé, situation difficile
      </M2Sig>
    </div>
    <div style={{ position: 'absolute', left: 820, top: 270, width: 980, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M2Prio n={1} p="P1" tone="coral" when="Immédiat">
        Sécurité ou fragilité : consigne de sécurité tout de suite, puis traitement prioritaire.
      </M2Prio>
      <M2Prio n={2} p="P2" tone="yellow" when="Dans la journée">
        Préjudice financier, 3e relance, menace de départ, échéance sous 48 h.
      </M2Prio>
      <M2Prio n={3} p="P3" tone="blue" when="Sous 24 h">
        Panne ou retard sans aggravation, demande de modification.
      </M2Prio>
      <M2Prio n={4} p="P4" tone="grey" when="Sous 72 h">
        Demande d’information, question générale, suggestion.
      </M2Prio>
      <div className={b.on(5)} style={{ marginTop: 6 }}>
        <Callout title="Attention" tone="coral" icon="eye" size={23}>
          Un client <strong>poli</strong> peut être en <strong>danger</strong> : « Ma plaque fait des étincelles, est-ce normal ? » est P1. L’urgence ne
          se lit pas qu’au ton.
        </Callout>
      </div>
    </div>
  </Frame>
);

// ─── Émotions : le thermomètre (interactif) ─────────────────────────────────
const EMO = [
  { label: 'Neutre', tone: 'green' as Tone, icon: 'smile' as IconName },
  { label: 'Inquiet', tone: 'teal' as Tone, icon: 'meh' as IconName },
  { label: 'Agacé', tone: 'yellow' as Tone, icon: 'meh' as IconName },
  { label: 'En colère', tone: 'coral' as Tone, icon: 'frown' as IconName },
  { label: 'Rupture', tone: 'violet' as Tone, icon: 'alert' as IconName },
];
const EMO_COL = [C.green, C.teal, C.yellow, C.coral, C.plum];

const M2Msg = ({ i, cur, set, children }: { i: number; cur: number; set: (i: number) => void; children: ReactNode }) => (
  <button
    type="button"
    data-osd-interactive
    onClick={(e) => {
      e.currentTarget.blur();
      set(i);
    }}
    style={{
      display: 'block',
      width: '100%',
      textAlign: 'left',
      border: 'none',
      cursor: 'pointer',
      boxSizing: 'border-box',
      padding: '14px 20px',
      borderRadius: 14,
      fontFamily: body,
      fontSize: 23,
      lineHeight: 1.4,
      color: C.ink,
      background: cur === i ? '#fff' : C.panel,
      boxShadow: cur === i ? `0 0 0 3px ${EMO_COL[i]}, ${SHADOW_SM}` : 'none',
      transition: `all 250ms ${EASE}`,
    }}
  >
    {children}
  </button>
);

const M2_Emotions: Page = () => {
  const [cur, set] = useState(0);
  const ang = -90 + cur * 45;
  const cues = [
    'Formule de politesse, question simple, aucun reproche.',
    '« Je commence à m’inquiéter » : besoin d’être rassuré.',
    '« 2e fois », « pas sérieux » : relance et reproche.',
    'MAJUSCULES, « !!! », demande d’un responsable.',
    'Ultimatum : avocat, avis négatifs. Risque de départ.',
  ];
  return (
    <Frame mod={2} kind="simu">
      <Title>Émotions : prendre la température du client</Title>
      <Lede>Cliquez un message : l’aiguille indique le niveau d’insatisfaction, et les indices qui le trahissent.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 840, display: 'flex', flexDirection: 'column', gap: 12, ...dl(100) }}>
        <M2Msg i={0} cur={cur} set={set}>
          « Bonjour, pourriez-vous me dire quand arrive ma commande ? Merci. »
        </M2Msg>
        <M2Msg i={1} cur={cur} set={set}>
          « Je commence à m’inquiéter, toujours aucune nouvelle de ma livraison… »
        </M2Msg>
        <M2Msg i={2} cur={cur} set={set}>
          « C’est la deuxième fois que je pose la question. Pas très sérieux. »
        </M2Msg>
        <M2Msg i={3} cur={cur} set={set}>
          « C’EST INADMISSIBLE !!! Je veux parler à un responsable. »
        </M2Msg>
        <M2Msg i={4} cur={cur} set={set}>
          « Dernier message avant mon avocat, et un avis 1 étoile partout. »
        </M2Msg>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1020, top: 262, width: 780, height: 670, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(200) }}>
        <svg width={720} height={380} viewBox="0 0 720 380" style={{ display: 'block' }}>
          <path d="M 80 340 A 280 280 0 0 1 136 172" fill="none" stroke={EMO_COL[0]} strokeWidth={46} />
          <path d="M 140 166 A 280 280 0 0 1 271 74" fill="none" stroke={EMO_COL[1]} strokeWidth={46} />
          <path d="M 277 72 A 280 280 0 0 1 443 72" fill="none" stroke={EMO_COL[2]} strokeWidth={46} />
          <path d="M 449 74 A 280 280 0 0 1 580 166" fill="none" stroke={EMO_COL[3]} strokeWidth={46} />
          <path d="M 584 172 A 280 280 0 0 1 640 340" fill="none" stroke={EMO_COL[4]} strokeWidth={46} />
          <g style={{ transform: `rotate(${ang}deg)`, transformOrigin: '360px 340px', transition: `transform 900ms ${EASE_BACK}` }}>
            <path d="M 352 340 L 360 110 L 368 340 Z" fill={C.navy} />
          </g>
          <circle cx={360} cy={340} r={24} fill={C.navy} />
          <circle cx={360} cy={340} r={9} fill="#fff" />
        </svg>
        <div key={cur} className={A.fade} style={{ animationDuration: '400ms', textAlign: 'center' } as CSSProperties}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontFamily: display, fontWeight: 800, fontSize: 44, color: EMO_COL[cur] === C.yellow ? C.amber : EMO_COL[cur] }}>
            <Icon name={EMO[cur].icon} size={46} color={EMO_COL[cur] === C.yellow ? C.amber : EMO_COL[cur]} />
            {EMO[cur].label}
          </div>
          <div style={{ marginTop: 14, fontSize: 24, lineHeight: 1.45, color: C.soft }}>{cues[cur]}</div>
        </div>
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 830, width: 840, fontSize: 22, lineHeight: 1.45, color: C.muted, ...dl(500) }}>
        Avec l’IA : « Évalue l’émotion dominante (neutre → rupture) et cite les indices. » Elle détecte vite ; vous confirmez, car l’ironie et
        l’implicite la piègent encore.
      </div>
    </Frame>
  );
};

// ─── Reformuler la demande ──────────────────────────────────────────────────
const M2_Reformuler: Page = () => (
  <Frame mod={2} beats={3}>
    <Title>Reformuler la demande : « Si je comprends bien… »</Title>
    <Lede>Une reformulation courte prouve au client qu’il a été compris, et vous évite de répondre à côté.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800, ...dl(100) }}>
      <Bubble who="user" name="Client · message vocal retranscrit" size={23}>
        Oui bonjour euh… c’est pour le frigo, enfin le combiné, celui que j’ai pris en promo, là, il fait un bruit, enfin pas tout le temps, surtout la
        nuit, et puis ma femme dit que la porte ferme mal, du coup je sais pas si c’est lié, bref, faudrait voir, merci.
      </Bubble>
    </div>
    <div style={{ position: 'absolute', left: 980, top: 270, width: 820, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className={b.on(1)}>
        <Code title="Prompt" size={21} style={{ whiteSpace: 'pre-wrap' }}>
          Reformule cette demande en 2 phrases maximum, en commençant par « Si je comprends bien ». Liste ensuite les points à faire préciser au client.
        </Code>
      </div>
      <div className={b.on(2)} style={{ background: T.violet.bg, borderRadius: 18, padding: '20px 26px', fontSize: 24, lineHeight: 1.45, color: C.ink }}>
        <Eyebrow c={T.violet.fg} size={17} style={{ marginBottom: 6 }}>
          Reformulation proposée
        </Eyebrow>
        Si je comprends bien, votre réfrigérateur combiné fait un bruit inhabituel, surtout la nuit, et sa porte ferme mal. Vous souhaitez savoir si les
        deux sont liés et ce qui peut être fait.
      </div>
      <div className={b.on(3)} style={{ background: T.yellow.bg, borderRadius: 18, padding: '18px 26px', fontSize: 23, lineHeight: 1.45, color: C.ink }}>
        <Eyebrow c={T.yellow.fg} size={17} style={{ marginBottom: 6 }}>
          À faire préciser
        </Eyebrow>
        Référence ou n° de commande · date d’achat · type de bruit · le joint de porte est-il abîmé ?
      </div>
    </div>
  </Frame>
);

// ─── Prompt d’analyse + analyseur interactif ────────────────────────────────
const M2Row = ({ label, value, tone, d }: { label: string; value: ReactNode; tone: Tone; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'baseline', gap: 14, padding: '9px 0', borderBottom: `1.5px solid ${C.rule}`, ...dl(d) }}>
    <span style={{ width: 150, flex: 'none', fontFamily: display, fontWeight: 700, fontSize: 16, letterSpacing: '0.08em', textTransform: 'uppercase', color: T[tone].fg }}>{label}</span>
    <span style={{ fontSize: 22, fontWeight: 600, color: C.ink, lineHeight: 1.3 }}>{value}</span>
  </div>
);

const M2Res = ({ cat, intent, infos, urg, emo, next }: { cat: string; intent: string; infos: string; urg: string; emo: string; next: string }) => (
  <div>
    <M2Row label="Catégorie" value={cat} tone="teal" d={0} />
    <M2Row label="Intention" value={intent} tone="blue" d={120} />
    <M2Row label="Infos clés" value={infos} tone="violet" d={240} />
    <M2Row label="Urgence" value={urg} tone="yellow" d={360} />
    <M2Row label="Émotion" value={emo} tone="coral" d={480} />
    <M2Row label="À faire" value={next} tone="green" d={600} />
  </div>
);

const M2_Analyseur: Page = () => {
  const [cur, setCur] = useState('a');
  const [run, setRun] = useState(0);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const pick = (id: string) => setCur(id);
  const go = () => {
    setDone((d) => ({ ...d, [cur]: true }));
    setRun((r) => r + 1);
  };
  const MSG: Record<string, string> = {
    a: '« J’ai été prélevée deux fois de 649 € pour la commande NM-50122. Remboursez-moi vite, c’est mon loyer qui part ! »',
    b: '« Hello, est-ce que je peux changer la couleur du frigo commandé hier soir avant qu’il parte ? Merci ! »',
    c: '« Bonjour, ma plaque de cuisson fait des étincelles quand je l’allume, est-ce normal ? »',
  };
  return (
    <Frame mod={2} kind="simu">
      <Title>Le prompt d’analyse, en action</Title>
      <Lede>Un modèle à réutiliser tel quel. Choisissez un message, puis lancez l’analyse.</Lede>
      <CodeDark file="prompt-analyse.txt" size={19} wrap cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 700, height: 680, ...dl(100) }}>
        <Ck>Rôle · </Ck>Tu assistes un conseiller du service client de Nova Maison.{'\n\n'}
        <Ck>Tâche · </Ck>Analyse le message client ci-dessous et remplis la fiche :{'\n'}
        {'  '}- <Cf>Catégorie</Cf> : <Cs>Livraison | SAV | Facturation | Commande | Autre</Cs>
        {'\n'}
        {'  '}- <Cf>Intention</Cf> principale (et secondaire s’il y en a une){'\n'}
        {'  '}- <Cf>Infos clés</Cf> : n° de commande, produit, dates, montants{'\n'}
        {'  '}- <Cf>Urgence</Cf> : <Cs>P1 | P2 | P3 | P4</Cs> + le signal qui la justifie{'\n'}
        {'  '}- <Cf>Émotion</Cf> : <Cs>neutre → rupture</Cs> + l’indice{'\n'}
        {'  '}- <Cf>À faire</Cf> : la prochaine action conseillée{'\n\n'}
        <Ck>Règles · </Ck>N’invente rien : si une info manque, écris <Cs>« non précisé »</Cs>. Réponds sous forme de liste courte.{'\n\n'}
        <Cc>Message : """[coller le message]"""</Cc>
      </CodeDark>
      <div className={A.right} style={{ position: 'absolute', left: 870, top: 262, width: 930, ...dl(200) }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <M2Tab id="a" cur={cur} pick={pick} label="Message A" />
          <M2Tab id="b" cur={cur} pick={pick} label="Message B" />
          <M2Tab id="c" cur={cur} pick={pick} label="Message C" />
          <div style={{ marginLeft: 'auto' }}>
            <Btn icon="sparkles" tone="violet" size={22} onClick={go}>
              Analyser
            </Btn>
          </div>
        </div>
        <div style={{ marginTop: 16, background: C.panel, borderRadius: 16, padding: '16px 22px', fontSize: 23, lineHeight: 1.45, color: C.ink, minHeight: 104 }}>{MSG[cur]}</div>
        <div style={{ marginTop: 16, height: 400, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '14px 24px' }}>
          {!done[cur] ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 24, color: C.faint }}>
              <Icon name="sparkles" size={28} /> Cliquez sur « Analyser »
            </div>
          ) : cur === 'a' ? (
            <M2Res key={`a${run}`} cat="Facturation" intent="Remboursement du double prélèvement" infos="NM-50122 · 2 × 649 €" urg="P2 · préjudice financier, « loyer »" emo="Inquiète, pressée" next="Vérifier les paiements, lancer le remboursement, rassurer" />
          ) : cur === 'b' ? (
            <M2Res key={`b${run}`} cat="Commande" intent="Changer la couleur avant expédition" infos="Frigo · commandé hier soir · n° non précisé" urg="P3 · à traiter avant l’expédition" emo="Neutre, cordial" next="Demander le n°, vérifier le stock et le statut" />
          ) : (
            <M2Res key={`c${run}`} cat="SAV · sécurité" intent="Savoir si c’est normal (non : danger)" infos="Plaque de cuisson · étincelles · n° non précisé" urg="P1 · risque électrique" emo="Inquiet mais calme" next="Consigne : ne plus utiliser, couper le disjoncteur" />
          )}
        </div>
      </div>
    </Frame>
  );
};
const M2Tab = ({ id, cur, pick, label }: { id: string; cur: string; pick: (id: string) => void; label: string }) => (
  <button
    type="button"
    data-osd-interactive
    onClick={(e) => {
      e.currentTarget.blur();
      pick(id);
    }}
    style={{
      border: 'none',
      cursor: 'pointer',
      padding: '10px 18px',
      borderRadius: 10,
      fontFamily: body,
      fontWeight: 600,
      fontSize: 21,
      background: cur === id ? C.electric : C.card,
      color: cur === id ? '#fff' : C.soft,
      boxShadow: cur === id ? '0 6px 16px -10px rgba(11,31,92,.6)' : `inset 0 0 0 1.5px ${C.rule}`,
    }}
  >
    {label}
  </button>
);

// ─── Le kit de l’atelier 1 : 5 demandes ─────────────────────────────────────
const M2Kit = ({ l, chan, icon, tone, children, d }: { l: string; chan: string; icon: IconName; tone: Tone; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 22px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
      <Num n={l} tone={tone} size={40} />
      <Tag tone="grey" size={17}>
        <Icon name={icon} size={18} /> {chan}
      </Tag>
    </div>
    <div style={{ fontSize: 22, lineHeight: 1.45, color: C.ink }}>{children}</div>
  </div>
);

const M2_Kit: Page = () => (
  <Frame mod={2} kind="atelier">
    <Title>Atelier 1 · les six demandes à analyser</Title>
    <Lede>Messages fictifs reçus par le service client de Nova Maison ce lundi matin.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
      <M2Kit l="A" chan="Email" icon="mail" tone="blue" d={100}>
        « Bonjour, j’ai été prélevée deux fois de 649 € pour la commande NM-50122. Merci de me rembourser au plus vite, c’est mon loyer qui part. »
      </M2Kit>
      <M2Kit l="B" chan="Chat" icon="chat" tone="teal" d={200}>
        « Hello, je voudrais savoir si je peux changer la couleur de mon frigo avant qu’il parte ? Commande passée hier soir. Merci ! »
      </M2Kit>
      <M2Kit l="C" chan="Appel retranscrit" icon="phone" tone="coral" d={300}>
        « TROISIÈME appel. Le technicien n’est jamais venu, j’ai posé une journée de congé pour rien. Je contacte une association de consommateurs. »
      </M2Kit>
      <M2Kit l="D" chan="Formulaire web" icon="form" tone="yellow" d={400}>
        « Ma plaque de cuisson fait des étincelles quand je l’allume, est-ce normal ? »
      </M2Kit>
      <M2Kit l="E" chan="Email" icon="mail" tone="violet" d={500}>
        « Bonjour, la livraison est prévue jeudi mais je serai absent, est-il possible de la décaler à samedi ? Cdt, M. Haddad »
      </M2Kit>
      <M2Kit l="F" chan="Réseau social" icon="megaphone" tone="pink" d={600}>
        « Super, Nova Maison : 3 semaines pour rembourser un retour. Bravo le service client 👏 #jamaisplus »
      </M2Kit>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 905, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(900) }}>
      <Icon name="eye" size={24} color={C.violet} />
      Message F : attention à l’ironie. « Super » et « bravo » ne veulent pas dire que le client est content.
    </div>
  </Frame>
);

const M2_Atelier: Page = () => (
  <LabPage
    mod={2}
    n="1"
    title="Analyser plusieurs demandes clients"
    defi="analyse"
    who="En binôme · 15 min"
    minutes={15}
    objective={
      <>
        Produire, avec l’IA, une <strong>fiche d’analyse</strong> pour chacun des six messages, puis la <strong>vérifier</strong> vous-même.
      </>
    }
    where={
      <>
        Six fiches d’analyse (A à F)
        <br />
        Votre prompt d’analyse, amélioré
        <br />
        Un désaccord IA / humain à partager
      </>
    }
    crit={
      <>
        <CheckItem id="a1-1" size={21}>
          Catégorie prise dans la liste fermée
        </CheckItem>
        <CheckItem id="a1-2" size={21}>
          Urgence justifiée par un signal
        </CheckItem>
        <CheckItem id="a1-3" size={21}>
          Aucune information inventée
        </CheckItem>
        <CheckItem id="a1-4" size={21}>
          L’ironie du message F détectée
        </CheckItem>
      </>
    }
  >
    <strong>1.</strong> Copiez le prompt d’analyse dans votre outil IA. <strong>2.</strong> Analysez les messages un par un (ou les six d’un coup, en
    demandant un tableau). <strong>3.</strong> Relisez chaque fiche : seriez-vous d’accord ? <strong>4.</strong> Notez un cas où vous corrigez l’IA, et
    pourquoi.
    <Bonus>Demandez à l’IA de trier les six messages par ordre de traitement, et comparez avec votre propre ordre.</Bonus>
  </LabPage>
);

// ─── Corrigé de l’atelier 1 ─────────────────────────────────────────────────
const M2Cell = ({ children, tone, w }: { children: ReactNode; tone?: Tone; w: number }) => (
  <div style={{ width: w, flex: 'none', fontSize: 21, lineHeight: 1.3, color: tone ? T[tone].fg : C.ink, fontWeight: tone ? 700 : 500 }}>{children}</div>
);

const M2Line = ({ n, l, tone, cat, intent, urg, urgTone, emo }: { n: number; l: string; tone: Tone; cat: string; intent: string; urg: string; urgTone: Tone; emo: string }) => (
  <div className={b.left(n)} style={{ display: 'flex', alignItems: 'center', gap: 20, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 22px' }}>
    <Num n={l} tone={tone} size={40} />
    <M2Cell w={250}>{cat}</M2Cell>
    <M2Cell w={560}>{intent}</M2Cell>
    <M2Cell w={300} tone={urgTone}>
      {urg}
    </M2Cell>
    <M2Cell w={340}>{emo}</M2Cell>
  </div>
);

const M2Head = ({ children, w }: { children: ReactNode; w: number }) => (
  <div style={{ width: w, flex: 'none', fontFamily: display, fontWeight: 700, fontSize: 16, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted }}>{children}</div>
);

const M2_Corrige: Page = () => (
  <Frame mod={2} kind="synthese" beats={6}>
    <Title>Atelier 1 · mise en commun</Title>
    <Lede>Comparez avec vos fiches. → affiche une ligne à la fois : où l’IA et vous n’étiez pas d’accord ?</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 20, padding: '0 22px' }}>
        <div style={{ width: 40, flex: 'none' }} />
        <M2Head w={250}>Catégorie</M2Head>
        <M2Head w={560}>Intention</M2Head>
        <M2Head w={300}>Urgence</M2Head>
        <M2Head w={340}>Émotion</M2Head>
      </div>
      <M2Line n={1} l="A" tone="blue" cat="Facturation" intent="Être remboursée du double prélèvement" urg="P2 · financier" urgTone="yellow" emo="Inquiète, pressée" />
      <M2Line n={2} l="B" tone="teal" cat="Commande" intent="Modifier la couleur avant expédition" urg="P3 · avant envoi" urgTone="blue" emo="Neutre, cordial" />
      <M2Line n={3} l="C" tone="coral" cat="SAV" intent="Obtenir l’intervention + réparation du préjudice" urg="P2 · 3e relance" urgTone="yellow" emo="Colère, menace" />
      <M2Line n={4} l="D" tone="yellow" cat="SAV · sécurité" intent="Savoir si c’est normal (non)" urg="P1 · sécurité" urgTone="coral" emo="Inquiet, calme" />
      <M2Line n={5} l="E" tone="violet" cat="Livraison" intent="Décaler la livraison à samedi" urg="P3 · avant jeudi" urgTone="blue" emo="Neutre" />
      <M2Line n={6} l="F" tone="pink" cat="Facturation" intent="Être remboursé · public : réponse rapide" urg="P2 · visibilité" urgTone="yellow" emo="Ironie, exaspération" />
    </div>
  </Frame>
);

// ─── Quiz ───────────────────────────────────────────────────────────────────
const M2_Quiz: Page = () => (
  <Frame mod={2} kind="quiz">
    <Title>Quiz : analyser une demande</Title>
    <QuizSeries y={220}>
      <QuizQ q="Pourquoi donner à l’IA une liste fermée de catégories ?" explain="Avec une liste fermée, chaque demande tombe dans une case connue : les statistiques sont comparables d’un jour à l’autre et le routage reste fiable.">
        <QOpt>Pour qu’elle aille plus vite</QOpt>
        <QOpt ok>Pour que les catégories restent cohérentes et exploitables</QOpt>
        <QOpt>Ce n’est pas utile, elle trouve seule</QOpt>
      </QuizQ>
      <QuizQ q="« Ma plaque fait des étincelles, est-ce normal ? » Message calme et poli. Priorité ?" explain="La sécurité passe avant le ton. On donne immédiatement la consigne (ne plus utiliser, couper l’alimentation), puis on traite en priorité.">
        <QOpt>P4 : simple question, client calme</QOpt>
        <QOpt>P3 : panne classique</QOpt>
        <QOpt ok>P1 : risque pour la sécurité</QOpt>
      </QuizQ>
      <QuizQ q="Le numéro de commande n’apparaît pas dans le message. L’IA doit…" explain="« Non précisé » est une réponse utile : elle vous dit quoi demander au client. Un numéro inventé, lui, peut faire traiter le mauvais dossier.">
        <QOpt ok>Écrire « non précisé »</QOpt>
        <QOpt>Proposer le numéro le plus probable</QOpt>
        <QOpt>Laisser le champ vide sans le signaler</QOpt>
      </QuizQ>
      <QuizQ q="« Bravo le service client 👏 » publié sur un réseau social. Émotion ?" explain="C’est de l’ironie : le client est mécontent, et en public. L’IA peut s’y tromper ; c’est typiquement un point que le conseiller vérifie.">
        <QOpt>Satisfait, il félicite l’équipe</QOpt>
        <QOpt ok>Exaspéré, sur le ton de l’ironie</QOpt>
        <QOpt>Neutre</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M2_Synthese: Page = () => (
  <Frame mod={2} kind="synthese">
    <Title>Module 2 · ce qu’il faut retenir</Title>
    <div style={{ position: 'absolute', left: 120, top: 210, width: 1680, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <SynthRow n={1} tone="blue">
        Cinq questions avant de répondre : <strong>intention, catégorie, infos clés, urgence, émotion</strong>.
      </SynthRow>
      <SynthRow n={2} tone="teal">
        L’intention réelle se cache souvent derrière la phrase : demandez à l’IA de <strong>citer l’indice</strong>.
      </SynthRow>
      <SynthRow n={3} tone="violet">
        Catégories et priorités : une <strong>liste fermée</strong> fixée par l’entreprise, et « non précisé » plutôt qu’inventé.
      </SynthRow>
      <SynthRow n={4} tone="yellow">
        L’urgence ne se lit pas qu’au ton : <strong>sécurité et fragilité d’abord</strong>.
      </SynthRow>
      <SynthRow n={5} tone="coral">
        L’IA détecte vite les émotions mais rate l’ironie : <strong>vous confirmez</strong>, puis vous reformulez.
      </SynthRow>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(1000) }}>
      <Icon name="note" size={24} color={C.violet} />
      Dans votre document : votre prompt d’analyse amélioré pendant l’atelier.
    </div>
  </Frame>
);

// ═══ 30-m3 ═════════════════════════════════════════════════════════════

// ─── Module 3 · Rédiger des réponses clients avec l’IA ─────────────────────

const M3_Section: Page = () => (
  <Section
    n={3}
    title={
      <>
        Rédiger des réponses
        <br />
        clients avec l’IA
      </>
    }
    sub="Des réponses claires, justes et personnalisées, au bon ton et dans la bonne langue : l’IA rédige le brouillon, vous signez la réponse."
    dur="11:10 – 12:30 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 2 · créer plusieurs réponses à partir de situations clients
      </Tag>
    }
  >
    <SecItem n={1}>Une réponse claire et professionnelle</SecItem>
    <SecItem n={2}>Reformuler et retoucher un brouillon</SecItem>
    <SecItem n={3}>Personnaliser et adapter le ton au canal</SecItem>
    <SecItem n={4}>Modèles de réponses et demandes complexes</SecItem>
    <SecItem n={5}>Traduire sans perdre le sens</SecItem>
  </Section>
);
M3_Section.transition = BLOOM;

// ─── Anatomie d’une bonne réponse ───────────────────────────────────────────
const M3Part = ({ n, tone, title, children }: { n: number; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.left(n)} style={{ display: 'flex', alignItems: 'center', gap: 16, background: C.card, borderRadius: 14, boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${STRONG[tone]}`, padding: '12px 20px 12px 24px' }}>
    <Num n={n} tone={tone} size={40} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 23, color: C.navy }}>{title}</div>
      <div style={{ fontSize: 20, lineHeight: 1.35, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M3_Anatomie: Page = () => (
  <Frame mod={3} beats={5}>
    <Title>Anatomie d’une bonne réponse client</Title>
    <Lede>Cinq briques, toujours dans le même ordre. → les repère dans la réponse à Mme Moreau.</Lede>
    <div
      className={A.in}
      style={{ position: 'absolute', left: 120, top: 262, width: 1000, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 36px', fontSize: 25, lineHeight: 1.62, color: C.ink, ...dl(100) }}
    >
      <p style={{ margin: 0 }}>
        <Mk n={1} tone="blue">
          Bonjour Madame Moreau,
        </Mk>
      </p>
      <p style={{ margin: '14px 0 0' }}>
        <Mk n={2} tone="coral">
          Je suis sincèrement désolé : un retard de 6 jours, puis une fuite dès le premier lavage, et un premier message resté sans réponse. Je comprends
          votre exaspération.
        </Mk>
      </p>
      <p style={{ margin: '14px 0 0' }}>
        <Mk n={3} tone="violet">
          Votre lave-linge est sous garantie : je vous propose, au choix, son échange ou l’intervention d’un technicien sous 72 h.
        </Mk>
      </p>
      <p style={{ margin: '14px 0 0' }}>
        <Mk n={4} tone="green">
          Répondez simplement « échange » ou « technicien » : je m’occupe de la suite dès réception et je vous confirme le rendez-vous par SMS.
        </Mk>
      </p>
      <p style={{ margin: '14px 0 0' }}>
        <Mk n={5} tone="teal">Bien cordialement, Karim · service client Nova Maison · 01 23 45 67 89</Mk>
      </p>
    </div>
    <div style={{ position: 'absolute', left: 1160, top: 262, width: 640, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M3Part n={1} tone="blue" title="Saluer, personnellement">
        Le nom du client, sans formule toute faite.
      </M3Part>
      <M3Part n={2} tone="coral" title="Reconnaître la situation">
        Reprendre les faits et l’émotion : il a été lu.
      </M3Part>
      <M3Part n={3} tone="violet" title="Répondre, apporter la solution">
        La réponse d’abord, l’explication ensuite.
      </M3Part>
      <M3Part n={4} tone="green" title="Donner la prochaine étape">
        Qui fait quoi, quand, et comment le client agit.
      </M3Part>
      <M3Part n={5} tone="teal" title="Conclure et signer">
        Un prénom, un service, un moyen de recontacter.
      </M3Part>
    </div>
  </Frame>
);

// ─── Clair et professionnel : avant / après ─────────────────────────────────
const M3Fix = ({ n, bad, good }: { n: number; bad: string; good: string }) => (
  <div style={{ display: 'flex', alignItems: 'stretch', gap: 18 }}>
    <div style={{ flex: 1, background: T.coral.bg, borderRadius: 14, padding: '14px 20px', fontSize: 22, lineHeight: 1.4, color: C.ink, display: 'flex', gap: 12, alignItems: 'center' }}>
      <Icon name="x" size={24} color={C.coral} sw={3} />
      <span>{bad}</span>
    </div>
    <FlowArrow w={56} color={C.faint} />
    <div className={b.left(n)} style={{ flex: 1, background: T.green.bg, borderRadius: 14, padding: '14px 20px', fontSize: 22, lineHeight: 1.4, color: C.ink, display: 'flex', gap: 12, alignItems: 'center' }}>
      <Icon name="check" size={24} color={C.green} sw={3} />
      <span>{good}</span>
    </div>
  </div>
);

const M3_Clair: Page = () => (
  <Frame mod={3} beats={5}>
    <Title>Clair et professionnel : cinq défauts que l’IA corrige bien</Title>
    <Lede>Demandez-lui : « Réécris en phrases courtes, sans jargon, la réponse en premier. » → corrige chaque défaut.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1680, display: 'flex', gap: 18, fontFamily: display, fontWeight: 700, fontSize: 18, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
      <span style={{ flex: 1, color: T.coral.fg }}>Ce qu’on lit souvent</span>
      <span style={{ width: 56 }} />
      <span style={{ flex: 1, color: T.green.fg }}>Ce que le client comprend</span>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 292, width: 1680, display: 'flex', flexDirection: 'column', gap: 14, ...dl(100) }}>
      <M3Fix n={1} bad="« Votre dossier est en cours de traitement par le service compétent. »" good="« Le service SAV examine votre demande ; vous aurez sa réponse vendredi au plus tard. »" />
      <M3Fix n={2} bad="« Conformément à l’article 7.2 de nos CGV relatives aux modalités de rétractation… »" good="« Vous avez 14 jours à partir de la livraison pour nous retourner l’article. »" />
      <M3Fix n={3} bad="« Le RMA a été créé, l’AR transporteur suivra sous J+2. »" good="« Votre retour est enregistré ; vous recevrez l’étiquette d’envoi d’ici 2 jours. »" />
      <M3Fix n={4} bad="Une phrase de 6 lignes qui explique tout avant de répondre." good="La réponse dans la 1re phrase, l’explication ensuite, en phrases courtes." />
      <M3Fix n={5} bad="« N’hésitez pas à revenir vers nous pour toute information. »" good="« Si l’étiquette n’arrive pas jeudi, répondez à ce message : je vous la renvoie. »" />
    </div>
  </Frame>
);

// ─── Retoucher un brouillon (boutons) ───────────────────────────────────────
const M3_VERS: Record<string, { label: string; prompt: string; text: ReactNode }> = {
  base: {
    label: 'Brouillon du conseiller',
    prompt: '—',
    text: (
      <>
        Bonjour, suite à votre réclamation concernant le retard de votre commande, nous vous informons que conformément à nos CGV le délai de livraison
        est donné à titre indicatif et que le transporteur a rencontré des difficultés logistiques indépendantes de notre volonté, nous avons relancé ce
        dernier et votre colis devrait vous parvenir sous 3 jours ouvrés. Cordialement.
      </>
    ),
  },
  clair: {
    label: 'Plus clair',
    prompt: 'Réécris ce brouillon : réponse en premier, phrases courtes, sans jargon. Ne change aucun fait.',
    text: (
      <>
        Bonjour Madame Leroy,
        <br />
        Votre colis arrivera sous 3 jours ouvrés. Notre transporteur a pris du retard ; je l’ai relancé ce matin.
        <br />
        Je vous envoie le lien de suivi dès qu’il est actif.
        <br />
        Bien cordialement, Inès
      </>
    ),
  },
  court: {
    label: 'Plus court',
    prompt: 'Réduis à 3 phrases maximum pour un chat, en gardant toutes les informations.',
    text: <>Bonjour Mme Leroy, votre colis a été retardé par le transporteur, que j’ai relancé. Il arrivera sous 3 jours ouvrés. Je vous envoie le suivi dès que possible.</>,
  },
  chaleur: {
    label: 'Plus chaleureux',
    prompt: 'Rends le ton plus chaleureux et empathique, sans en faire trop et sans promesse nouvelle.',
    text: (
      <>
        Bonjour Madame Leroy,
        <br />
        Je suis vraiment désolée pour ce retard, j’imagine que vous attendiez ce colis avec impatience. J’ai relancé notre transporteur ce matin : il
        arrivera sous 3 jours ouvrés, et je vous envoie le suivi dès qu’il est actif.
        <br />
        Belle journée, Inès
      </>
    ),
  },
  formel: {
    label: 'Plus formel',
    prompt: 'Adopte un registre formel et soutenu, adapté à un courrier officiel.',
    text: (
      <>
        Madame,
        <br />
        Nous vous prions de bien vouloir nous excuser pour le retard de livraison de votre commande. Notre transporteur, que nous avons relancé, nous
        indique une livraison sous 3 jours ouvrés. Nous vous adresserons le lien de suivi dès sa mise à disposition.
        <br />
        Veuillez agréer, Madame, l’expression de nos salutations distinguées.
      </>
    ),
  },
};

const M3VBtn = ({ id, cur, set, tone }: { id: string; cur: string; set: (s: string) => void; tone: Tone }) => (
  <Btn tone={tone} ghost={cur !== id} size={22} onClick={() => set(id)} style={{ width: '100%', justifyContent: 'flex-start' }}>
    {M3_VERS[id].label}
  </Btn>
);

const M3_Retouches: Page = () => {
  const [cur, set] = useState('base');
  const v = M3_VERS[cur];
  return (
    <Frame mod={3} kind="simu">
      <Title>Reformuler : retoucher un brouillon en un clic</Title>
      <Lede>Votre brouillon est juste, mais lourd. Choisissez une retouche : regardez ce qui change… et ce qui ne change pas.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 380, display: 'flex', flexDirection: 'column', gap: 14, ...dl(100) }}>
        <M3VBtn id="base" cur={cur} set={set} tone="grey" />
        <M3VBtn id="clair" cur={cur} set={set} tone="blue" />
        <M3VBtn id="court" cur={cur} set={set} tone="teal" />
        <M3VBtn id="chaleur" cur={cur} set={set} tone="pink" />
        <M3VBtn id="formel" cur={cur} set={set} tone="navy" />
        <div style={{ marginTop: 14 }}>
          <Callout title="Règle d’or" tone="coral" icon="lock" size={21}>
            Une retouche ne change jamais les faits : « 3 jours ouvrés » reste 3 jours ouvrés.
          </Callout>
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 550, top: 262, width: 1250, ...dl(200) }}>
        <Code title="Prompt de retouche" size={21} style={{ whiteSpace: 'pre-wrap', minHeight: 70 }}>
          {v.prompt}
        </Code>
        <div
          key={cur}
          className={A.fade}
          style={{ marginTop: 18, height: 470, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 34px', fontSize: 26, lineHeight: 1.55, color: C.ink, animationDuration: '400ms' } as CSSProperties}
        >
          <Eyebrow c={cur === 'base' ? C.muted : C.violet} size={17} style={{ marginBottom: 10 }}>
            {cur === 'base' ? 'Avant' : `Après · ${v.label.toLowerCase()}`}
          </Eyebrow>
          {v.text}
        </div>
      </div>
    </Frame>
  );
};

// ─── Le ton selon le canal (onglets) ────────────────────────────────────────
const M3Chan = ({ icon, tone, rules, children }: { icon: IconName; tone: Tone; rules: ReactNode; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 30, marginTop: 22 }}>
    <div style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '30px 34px', fontSize: 25, lineHeight: 1.55, color: C.ink, minHeight: 440, boxSizing: 'border-box' }}>
      {children}
    </div>
    <div style={{ width: 520, flex: 'none', background: T[tone].bg, borderRadius: 20, padding: '24px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <Icon name={icon} size={28} color={T[tone].fg} />
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 22, letterSpacing: '0.06em', textTransform: 'uppercase', color: T[tone].fg }}>Les codes du canal</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{rules}</div>
    </div>
  </div>
);

const M3_Canal: Page = () => (
  <Frame mod={3} kind="demo">
    <Title>Adapter le ton : la même réponse, quatre canaux</Title>
    <Lede>Situation : remboursement d’un retour en retard. Cliquez un canal ; le fond ne bouge pas, la forme s’adapte.</Lede>
    <Tabs initial="mail" cls={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 1680, ...dl(100) }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <TabBtn id="mail" icon="mail" tone="blue">
          Email
        </TabBtn>
        <TabBtn id="chat" icon="chat" tone="teal">
          Chat
        </TabBtn>
        <TabBtn id="tel" icon="phone" tone="violet">
          Téléphone
        </TabBtn>
        <TabBtn id="rs" icon="megaphone" tone="pink">
          Réseau social (public)
        </TabBtn>
      </div>
      <TabPane id="mail">
        <M3Chan
          icon="mail"
          tone="blue"
          rules={
            <>
              <Bullet size={22}>Structuré : salutation, 3 paragraphes, signature</Bullet>
              <Bullet size={22}>Peut contenir le détail et les références</Bullet>
              <Bullet size={22}>Vouvoiement, registre professionnel</Bullet>
            </>
          }
        >
          Bonjour Monsieur Garnier,
          <br />
          Votre retour a bien été reçu le 2 octobre et votre remboursement de 189 € a été validé aujourd’hui. Je suis désolé pour ce délai, plus long
          que nos 14 jours habituels.
          <br />
          Il apparaîtra sur votre compte sous 3 à 5 jours ouvrés, selon votre banque.
          <br />
          Bien cordialement, Julien · service client Nova Maison
        </M3Chan>
      </TabPane>
      <TabPane id="chat">
        <M3Chan
          icon="chat"
          tone="teal"
          rules={
            <>
              <Bullet size={22} tone="teal">Messages courts, une idée par message</Bullet>
              <Bullet size={22} tone="teal">Réactif et direct, toujours poli</Bullet>
              <Bullet size={22} tone="teal">Vérifier que le client a tout compris</Bullet>
            </>
          }
        >
          Merci pour votre patience, M. Garnier.
          <br />
          Bonne nouvelle : votre remboursement de 189 € est validé aujourd’hui ✅
          <br />
          Comptez 3 à 5 jours ouvrés pour le voir sur votre compte.
          <br />
          Désolé pour l’attente. Puis-je vous aider pour autre chose ?
        </M3Chan>
      </TabPane>
      <TabPane id="tel">
        <M3Chan
          icon="phone"
          tone="violet"
          rules={
            <>
              <Bullet size={22} tone="violet">Phrases simples, faciles à dire à voix haute</Bullet>
              <Bullet size={22} tone="violet">Chiffres répétés, reformulation finale</Bullet>
              <Bullet size={22} tone="violet">Une trame, pas un texte à lire mot à mot</Bullet>
            </>
          }
        >
          <em style={{ color: C.muted }}>Trame d’appel :</em>
          <br />
          « Monsieur Garnier, j’ai une bonne nouvelle pour vous. »
          <br />
          « Votre remboursement est validé aujourd’hui : <strong>189 euros</strong>. »
          <br />
          « Il faut compter 3 à 5 jours ouvrés selon votre banque. »
          <br />
          « Je suis désolé pour l’attente. Avez-vous d’autres questions ? »
        </M3Chan>
      </TabPane>
      <TabPane id="rs">
        <M3Chan
          icon="megaphone"
          tone="pink"
          rules={
            <>
              <Bullet size={22} tone="pink">Réponse publique : visible par tous</Bullet>
              <Bullet size={22} tone="pink">Aucune donnée personnelle, aucun montant</Bullet>
              <Bullet size={22} tone="pink">Reconnaître, puis basculer en message privé</Bullet>
            </>
          }
        >
          Bonjour @agarnier, nous sommes désolés pour ce délai, ce n’est pas l’expérience que nous voulons vous offrir. Nous venons de vous écrire en
          message privé pour faire le point sur votre remboursement. L’équipe Nova Maison
        </M3Chan>
      </TabPane>
    </Tabs>
  </Frame>
);

// ─── Personnaliser : les bons ingrédients ───────────────────────────────────
const M3Ing = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ display: 'flex', gap: 16, alignItems: 'center', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '14px 20px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={50} />
    <div>
      <div style={{ fontWeight: 700, fontSize: 24, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 21, lineHeight: 1.35, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M3_Perso: Page = () => (
  <Frame mod={3}>
    <Title>Personnaliser sans en dire trop</Title>
    <Lede>Ce qu’on donne à l’IA pour qu’elle personnalise, et ce qu’on garde pour soi.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 860, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Eyebrow c={T.green.fg} size={20} cls={A.fade}>
        Utile à la réponse
      </Eyebrow>
      <M3Ing icon="user" tone="green" title="Civilité et nom d’usage" d={100}>
        « Madame Moreau », plutôt que « Cher client »
      </M3Ing>
      <M3Ing icon="cart" tone="green" title="Produit et situation" d={180}>
        Lave-linge, livré le 6, fuite au 1er lavage
      </M3Ing>
      <M3Ing icon="loop" tone="green" title="Historique utile" d={260}>
        2e relance, ancien client, appel de jeudi
      </M3Ing>
      <M3Ing icon="calendar" tone="green" title="Contraintes exprimées" d={340}>
        Absent jeudi, joignable après 18 h, réception samedi
      </M3Ing>
      <M3Ing icon="book" tone="green" title="Procédure applicable" d={420}>
        Garantie, délais, options proposées au client
      </M3Ing>
    </div>
    <div style={{ position: 'absolute', left: 1040, top: 262, width: 760, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Eyebrow c={T.coral.fg} size={20} cls={A.fade} style={dl(500)}>
        Inutile, et risqué
      </Eyebrow>
      <M3Ing icon="lock" tone="coral" title="Coordonnées bancaires, IBAN, carte" d={560}>
        Jamais dans une IA, même autorisée
      </M3Ing>
      <M3Ing icon="eyeOff" tone="coral" title="Adresse, téléphone, email complets" d={640}>
        Remplacez par [ADRESSE], [TÉL]
      </M3Ing>
      <M3Ing icon="heart" tone="coral" title="Santé, situation familiale, opinions" d={720}>
        Données sensibles : on n’en a pas besoin
      </M3Ing>
      <div className={A.in} style={dl(820)}>
        <Callout title="Le test" tone="blue" icon="eye" size={23}>
          « Cette information change-t-elle ma réponse ? » Si non, elle ne va pas dans le prompt.
        </Callout>
      </div>
    </div>
  </Frame>
);

// ─── Modèles de réponses ────────────────────────────────────────────────────
const M3_Modele: Page = () => (
  <Frame mod={3} beats={3}>
    <Title>Un modèle de réponse pour toute l’équipe</Title>
    <Lede>Des parties fixes, validées une fois ; des variables, remplies à chaque fois. → montre comment l’IA l’améliore.</Lede>
    <CodeDark file="modele-retard-livraison.txt" size={21} wrap cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 900, height: 600, ...dl(100) }}>
      Bonjour <Hole>civilité + nom</Hole>,{'\n\n'}
      Je suis désolé(e) : votre commande <Hole>n° commande</Hole> n’est pas arrivée à la date prévue, le <Hole>date prévue</Hole>.{'\n\n'}
      Notre transporteur m’indique une livraison le <Hole>nouvelle date</Hole>. <Cc>{'{Si retard > 7 jours}'}</Cc> Pour ce désagrément,{' '}
      <Hole>geste prévu par la procédure</Hole>.{'\n\n'}
      Votre lien de suivi : <Hole>lien</Hole>. Si le colis n’est pas arrivé le <Hole>date + 1</Hole>, répondez à ce message : je m’en occupe
      en priorité.{'\n\n'}
      Bien cordialement,{'\n'}
      <Hole>prénom</Hole> · service client Nova Maison
    </CodeDark>
    <div style={{ position: 'absolute', left: 1070, top: 262, width: 730, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className={b.on(1)}>
        <Code title="Prompt d’amélioration" size={20} style={{ whiteSpace: 'pre-wrap' }}>
          Voici notre modèle de réponse « retard de livraison ». Propose 3 améliorations pour le rendre plus clair et plus chaleureux. Garde toutes les
          variables entre crochets et ne crée aucun engagement nouveau.
        </Code>
      </div>
      <div className={b.on(2)} style={{ background: T.violet.bg, borderRadius: 18, padding: '18px 24px', fontSize: 22, lineHeight: 1.45, color: C.ink }}>
        <Eyebrow c={T.violet.fg} size={17} style={{ marginBottom: 6 }}>
          Suggestions de l’IA
        </Eyebrow>
        1. Donner la nouvelle date dès la 1re phrase.
        <br />
        2. Remplacer « désolé(e) » par une phrase qui reconnaît la gêne.
        <br />
        3. Ajouter une variante si la date est inconnue.
      </div>
      <div className={b.on(3)}>
        <Callout title="Qui valide ?" tone="green" icon="humanCheck" size={22}>
          Le modèle est relu par le référent qualité avant d’être partagé : c’est lui qui engage l’entreprise.
        </Callout>
      </div>
    </div>
  </Frame>
);

// ─── Demandes complexes ─────────────────────────────────────────────────────
const M3QA = ({ n, q, a, todo = false }: { n: number; q: string; a: ReactNode; todo?: boolean }) => (
  <div className={b.on(n + 1)} style={{ background: C.card, borderRadius: 14, boxShadow: `${SHADOW_SM}, inset 5px 0 0 ${todo ? C.yellow : C.violet}`, padding: '12px 20px 12px 24px' }}>
    <div style={{ fontWeight: 700, fontSize: 21, color: C.navy }}>
      {n}. {q}
    </div>
    <div style={{ marginTop: 3, fontSize: 21, lineHeight: 1.4, color: todo ? T.yellow.fg : C.soft, fontWeight: todo ? 700 : 400 }}>{a}</div>
  </div>
);

const M3_Complexe: Page = () => (
  <Frame mod={3} beats={5}>
    <Title>Les demandes complexes : découper avant de répondre</Title>
    <Lede>Quatre questions dans un seul email. L’IA les liste, répond à ce qu’elle sait, et signale ce qu’elle ne sait pas.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 760, ...dl(100) }}>
      <Bubble who="user" name="M. Lambert · email" size={22}>
        Bonjour, j’ai reçu la table et les 6 chaises, mais une chaise est abîmée. Est-ce qu’on peut m’en renvoyer une seule ? Au passage, la facture
        indique 5 chaises au lieu de 6. Et le montage est-il compris dans la garantie de 2 ans ? Enfin, je voudrais commander le buffet assorti : il y a
        une remise si je le prends maintenant ?
      </Bubble>
      <div className={b.on(1)} style={{ marginTop: 22 }}>
        <Code title="Prompt" size={19} style={{ whiteSpace: 'pre-wrap' }}>
          Liste chaque question du client, numérotée. Pour chacune, réponds uniquement à partir de la procédure fournie. Si l’information n’y est pas,
          écris [À COMPLÉTER PAR LE CONSEILLER].
        </Code>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 930, top: 262, width: 870, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M3QA n={1} q="Renvoyer une seule chaise ?" a="Oui : remplacement à l’unité, sur photo du dommage, sous 10 jours." />
      <M3QA n={2} q="Facture : 5 chaises au lieu de 6" a="Facture rectificative à demander au service facturation." />
      <M3QA n={3} q="Montage couvert par la garantie ?" a="[À COMPLÉTER PAR LE CONSEILLER] · absent de la procédure" todo />
      <M3QA n={4} q="Remise sur le buffet ?" a="[À COMPLÉTER PAR LE CONSEILLER] · offres du moment" todo />
    </div>
  </Frame>
);

// ─── Traduction ─────────────────────────────────────────────────────────────
const M3TStep = ({ n, icon, tone, title, children }: { n: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 24px', borderTop: `7px solid ${STRONG[tone]}`, display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone={tone} size={46} solid />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 23, color: C.navy }}>{title}</span>
    </div>
    <div style={{ marginTop: 14, fontSize: 21, lineHeight: 1.48, color: C.ink }}>{children}</div>
  </div>
);

const M3_Traduction: Page = () => (
  <Frame mod={3} beats={4}>
    <Title>Traduire : répondre dans la langue du client</Title>
    <Lede>Une cliente écrit en espagnol. Quatre étapes, dont une que l’on oublie souvent : le contrôle.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', gap: 20 }}>
      <M3TStep n={1} icon="translate" tone="blue" title="1 · Comprendre">
        <em>« Hola, el sofá llegó con una pata rota. ¿Pueden cambiarla rápido? Gracias. »</em>
        <br />
        <span style={{ color: C.muted }}>→ Le canapé est arrivé avec un pied cassé. Pouvez-vous le changer rapidement ?</span>
      </M3TStep>
      <M3TStep n={2} icon="pen" tone="violet" title="2 · Rédiger en français">
        Vous rédigez (avec l’IA) la réponse en français, comme d’habitude, avec la procédure : envoi d’un pied de remplacement sous 5 jours.
      </M3TStep>
      <M3TStep n={3} icon="translate" tone="teal" title="3 · Traduire">
        « Traduis en espagnol, registre poli (usted). Garde les chiffres, dates et références à l’identique. »
        <br />
        <span style={{ color: C.muted }}>→ « Le enviaremos una pata de repuesto en 5 días… »</span>
      </M3TStep>
      <M3TStep n={4} icon="loop" tone="green" title="4 · Contrôler">
        Retraduisez la réponse en français dans une nouvelle conversation : le sens, les chiffres et le ton sont-ils intacts ?
      </M3TStep>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 720, width: 1680, ...dl(400) }}>
      <Callout title="Limites" tone="yellow" icon="alert" size={24}>
        Expressions locales, humour, termes juridiques : la traduction peut trahir le sens. Pour un litige ou un document contractuel, faites valider par
        une personne qui maîtrise la langue.
      </Callout>
    </div>
  </Frame>
);

// ─── Quiz : le bon ton ──────────────────────────────────────────────────────
const M3_Quiz: Page = () => (
  <Frame mod={3} kind="quiz">
    <Title>Quiz : la bonne réponse, au bon ton</Title>
    <QuizSeries y={220}>
      <QuizQ q="Un client poste une critique publique sur un réseau social. Votre réponse publique contient…" explain="En public : on reconnaît, on s’excuse si besoin, et on bascule en privé. Aucun montant, aucun numéro de commande, aucune donnée personnelle.">
        <QOpt>Le détail de sa commande, pour montrer qu’on suit le dossier</QOpt>
        <QOpt ok>Une reconnaissance brève et une invitation en message privé</QOpt>
        <QOpt>Rien : on ne répond jamais en public</QOpt>
      </QuizQ>
      <QuizQ q="Vous demandez à l’IA de rendre une réponse « plus chaleureuse ». Elle ajoute « nous vous offrons la livraison ». Que faites-vous ?" explain="L’IA a créé un engagement qui n’existe pas. On le retire, et on précise dans le prompt : « sans promesse ni geste nouveau ».">
        <QOpt>Je garde : c’est sympa pour le client</QOpt>
        <QOpt ok>Je retire l’offre, qui n’est pas autorisée</QOpt>
        <QOpt>Je demande à un collègue s’il a déjà vu ça</QOpt>
      </QuizQ>
      <QuizQ q="Où placer la réponse à la question du client ?" explain="Le client cherche d’abord sa réponse. Elle vient tout de suite après la reconnaissance de la situation ; l’explication suit.">
        <QOpt>À la fin, après toutes les explications</QOpt>
        <QOpt ok>Au début, juste après avoir reconnu la situation</QOpt>
        <QOpt>Dans une pièce jointe</QOpt>
      </QuizQ>
      <QuizQ q="Pour traduire une réponse en allemand, la bonne pratique est…" explain="Rédiger en français (là où vous maîtrisez le fond), traduire en imposant de garder chiffres et références, puis contrôler par une rétro-traduction.">
        <QOpt>Demander directement à l’IA de répondre en allemand</QOpt>
        <QOpt ok>Rédiger en français, traduire, puis rétro-traduire pour contrôler</QOpt>
        <QOpt>Utiliser un traducteur différent pour chaque phrase</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Atelier 2 ──────────────────────────────────────────────────────────────
const M3Case = ({ l, tone, title, children, d }: { l: string; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '22px 24px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={l} tone={tone} size={42} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: C.navy }}>{title}</span>
    </div>
    <div style={{ marginTop: 12, fontSize: 22, lineHeight: 1.45, color: C.soft }}>{children}</div>
  </div>
);

const M3_Kit: Page = () => (
  <Frame mod={3} kind="atelier">
    <Title>Atelier 2 · quatre situations, quatre réponses</Title>
    <Lede>Vous reprenez les messages analysés à l’atelier 1. Chaque situation impose un canal et une contrainte.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
      <M3Case l="A" tone="blue" title="Double prélèvement · email" d={100}>
        Procédure : remboursement du doublon sous 48 h ouvrées après vérification. Contrainte : la cliente est inquiète pour son loyer, rassurez-la
        sans promettre plus que la procédure.
      </M3Case>
      <M3Case l="C" tone="coral" title="Technicien jamais venu · email" d={200}>
        Procédure : nouveau créneau prioritaire sous 48 h, geste commercial possible (validé par le superviseur). Contrainte : client en colère,
        3e relance.
      </M3Case>
      <M3Case l="E" tone="violet" title="Décaler une livraison · chat" d={300}>
        Procédure : report gratuit jusqu’à 10 jours si la demande arrive 24 h avant. Contrainte : 3 messages courts maximum.
      </M3Case>
      <M3Case l="F" tone="pink" title="Critique publique · réseau social" d={400}>
        Procédure : réponse publique sous 2 h, puis message privé. Contrainte : aucune donnée personnelle en public, pas d’ironie en retour.
      </M3Case>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(700) }}>
      <Icon name="translate" size={24} color={C.violet} />
      Variante pour les binômes rapides : le client E écrit en anglais. Répondez-lui en anglais, avec contrôle par rétro-traduction.
    </div>
  </Frame>
);

const M3_Atelier: Page = () => (
  <LabPage
    mod={3}
    n="2"
    title="Créer plusieurs réponses à partir de situations clients"
    defi="redaction"
    who="En binôme · 20 min"
    minutes={20}
    objective={
      <>
        Rédiger avec l’IA <strong>quatre réponses prêtes à envoyer</strong>, chacune adaptée à son canal, puis les passer au crible des
        4 vérifications.
      </>
    }
    where={
      <>
        4 réponses relues et corrigées
        <br />
        Le meilleur prompt du binôme
        <br />
        1 modèle de réponse réutilisable
      </>
    }
    crit={
      <>
        <CheckItem id="a2-1" size={21}>
          Les 5 briques présentes
        </CheckItem>
        <CheckItem id="a2-2" size={21}>
          Ton et longueur adaptés au canal
        </CheckItem>
        <CheckItem id="a2-3" size={21}>
          Aucun engagement hors procédure
        </CheckItem>
        <CheckItem id="a2-4" size={21}>
          Exact · complet · adapté · conforme
        </CheckItem>
      </>
    }
  >
    <strong>1.</strong> Construisez votre prompt : rôle, contexte (fiche d’analyse + procédure), tâche, format, ton. <strong>2.</strong> Générez la
    réponse A, puis retouchez-la (« plus clair », « plus court »…). <strong>3.</strong> Faites C, E et F en adaptant canal et ton.{' '}
    <strong>4.</strong> Transformez votre meilleure réponse en modèle avec des [variables].
    <Bonus>Comparez deux versions de la réponse C : l’une générée sans la fiche d’analyse, l’autre avec. Qu’est-ce qui change ?</Bonus>
  </LabPage>
);

// ─── Exemple commenté (réponse C) ───────────────────────────────────────────
const M3Note = ({ n, tone, label }: { n: number; tone: Tone; label: string }) => (
  <div className={b.pop(n)} style={{ display: 'flex', alignItems: 'center', gap: 12, ...vars({ o: 'left center' }) }}>
    <span style={{ width: 16, height: 16, borderRadius: 4, background: STRONG[tone], flex: 'none' }} />
    <span style={{ fontSize: 22, fontWeight: 600, color: C.ink }}>{label}</span>
  </div>
);

const M3_Exemple: Page = () => (
  <Frame mod={3} kind="synthese" beats={6}>
    <Title>Mise en commun · une réponse possible au client C</Title>
    <Lede>Lisez d’abord la vôtre. → décortique celle-ci, brique par brique.</Lede>
    <div
      className={A.in}
      style={{ position: 'absolute', left: 120, top: 262, width: 1180, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 34px', fontSize: 24, lineHeight: 1.6, color: C.ink, ...dl(100) }}
    >
      <Mk n={1} tone="blue">
        Bonjour Monsieur Benali,
      </Mk>
      <br />
      <Mk n={2} tone="coral">
        Vous avez posé une journée de congé et le technicien n’est pas venu : c’est inacceptable, et c’est votre troisième appel. Je vous présente nos
        excuses.
      </Mk>{' '}
      <Mk n={3} tone="violet">
        J’ai réservé un créneau prioritaire jeudi 16 octobre entre 8 h et 10 h ; le technicien vous appellera 30 minutes avant son arrivée.
      </Mk>{' '}
      <Mk n={4} tone="yellow">
        Mon responsable a validé, pour ce désagrément, le remboursement de vos frais de livraison.
      </Mk>
      <br />
      <Mk n={5} tone="green">
        Si ce créneau ne vous convient pas, répondez à ce message avant mardi soir : je vous en propose un autre en priorité.
      </Mk>
      <br />
      <Mk n={6} tone="teal">
        Bien cordialement, Sarah · service client Nova Maison
      </Mk>
    </div>
    <div style={{ position: 'absolute', left: 1360, top: 262, width: 440, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <M3Note n={1} tone="blue" label="Salutation personnelle" />
      <M3Note n={2} tone="coral" label="Faits + émotion reconnus" />
      <M3Note n={3} tone="violet" label="Solution concrète, datée" />
      <M3Note n={4} tone="yellow" label="Geste validé par un humain" />
      <M3Note n={5} tone="green" label="Prochaine étape claire" />
      <M3Note n={6} tone="teal" label="Signature identifiable" />
    </div>
    <div className={b.on(6)} style={{ position: 'absolute', left: 120, top: 790, width: 1680 }}>
      <Callout title="Le point de vigilance" tone="coral" icon="eye" size={23}>
        Le créneau et le geste ont été <strong>vérifiés</strong> par le conseiller dans l’outil de planification et auprès du responsable : l’IA ne
        les a pas inventés.
      </Callout>
    </div>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M3_Qcm: Page = () => (
  <QcmPage
    mod={3}
    n={2}
    title="Le modèle de réponse"
    q="Votre équipe veut un modèle « retard de livraison » généré par l’IA. Quelle est la bonne démarche ?"
    explain="L’IA accélère la rédaction du modèle ; un référent le valide une fois ; chacun ne remplit plus que les variables, et relit avant envoi."
  >
    <Opt why="Chaque conseiller aurait sa version : les clients recevraient des réponses différentes pour la même situation.">Chacun génère son modèle quand il en a besoin</Opt>
    <Opt ok why="Exact : parties fixes validées une fois, variables entre crochets, relecture à chaque utilisation.">
      L’IA propose, un référent valide, l’équipe réutilise avec des variables
    </Opt>
    <Opt why="Un modèle doit refléter vos procédures et vos engagements : il faut le relire avant de le diffuser.">On reprend la première version de l’IA telle quelle</Opt>
    <Opt why="Le modèle n’empêche pas la personnalisation : les variables (nom, produit, dates) sont là pour ça.">On abandonne les modèles : trop impersonnels</Opt>
  </QcmPage>
);

const M3_Synthese: Page = () => (
  <Frame mod={3} kind="synthese">
    <Title>Module 3 · ce qu’il faut retenir</Title>
    <div style={{ position: 'absolute', left: 120, top: 210, width: 1680, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <SynthRow n={1} tone="blue">
        Cinq briques : <strong>saluer, reconnaître, répondre, donner la suite, signer</strong>. La réponse avant l’explication.
      </SynthRow>
      <SynthRow n={2} tone="violet">
        Retoucher un brouillon : plus clair, plus court, plus chaleureux… <strong>sans jamais changer les faits</strong>.
      </SynthRow>
      <SynthRow n={3} tone="teal">
        Le fond ne change pas, la forme s’adapte au <strong>canal</strong> : email, chat, téléphone, réseau social public.
      </SynthRow>
      <SynthRow n={4} tone="yellow">
        Demandes complexes : <strong>lister chaque question</strong>, répondre à partir de la procédure, signaler le « à compléter ».
      </SynthRow>
      <SynthRow n={5} tone="green">
        Modèles validés une fois, variables remplies à chaque fois ; traduction contrôlée par <strong>rétro-traduction</strong>.
      </SynthRow>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(1000) }}>
      <Icon name="note" size={24} color={C.violet} />
      Dans votre document : votre meilleur prompt de rédaction et votre premier modèle de réponse. Bon appétit !
    </div>
  </Frame>
);

// ═══ 40-m4 ═════════════════════════════════════════════════════════════

// ─── Module 4 · Gérer les réclamations et situations difficiles ────────────

const M4_Section: Page = () => (
  <Section
    n={4}
    title={
      <>
        Réclamations et
        <br />
        situations difficiles
      </>
    }
    sub="Comprendre le problème, reconnaître l’insatisfaction, désamorcer, et savoir passer la main : l’IA prépare, vous gardez le lien."
    dur="13:30 – 14:30 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 3 · simulations de réclamations avec l’IA
      </Tag>
    }
  >
    <SecItem n={1}>Identifier le problème et reformuler la demande</SecItem>
    <SecItem n={2}>Reconnaître l’insatisfaction</SecItem>
    <SecItem n={3}>Construire une réponse adaptée</SecItem>
    <SecItem n={4}>Désamorcer un conflit</SecItem>
    <SecItem n={5}>Préparer une escalade vers un responsable</SecItem>
  </Section>
);
M4_Section.transition = BLOOM;

// ─── Citation ───────────────────────────────────────────────────────────────
const M4_Citation: Page = () => (
  <Frame mod={4}>
    <div className={A.left} style={{ position: 'absolute', left: 120, top: 250, width: 10, height: 420, borderRadius: 5, background: G.violet }} />
    <div style={{ position: 'absolute', left: 200, top: 250, width: 1500 }}>
      <Quote
        cls={A.in}
        style={{ paddingLeft: 90, ...dl(150) }}
        by={
          <>
            Le « paradoxe de la réparation de service », observé en marketing des services : une réclamation bien traitée peut renforcer la confiance du
            client.
          </>
        }
      >
        <span style={{ fontSize: 64, lineHeight: 1.18 }}>
          Une réclamation n’est pas un problème à fermer : c’est un client qui vous donne <span style={{ color: C.violet }}>une deuxième chance</span>.
        </span>
      </Quote>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 200, top: 780, width: 1500, display: 'flex', gap: 22, ...dl(800) }}>
      <Tag tone="coral" size={22}>
        <Icon name="frown" size={22} /> Il aurait pu partir sans rien dire
      </Tag>
      <Tag tone="green" size={22}>
        <Icon name="smile" size={22} /> Il a pris le temps de vous écrire
      </Tag>
    </div>
  </Frame>
);

// ─── La méthode en six temps ────────────────────────────────────────────────
const M4Step = ({ n, icon, tone, title, ia, moi }: { n: number; icon: IconName; tone: Tone; title: string; ia: string; moi: string }) => (
  <div className={b.on(n)} style={{ flex: 1, background: C.card, borderRadius: 18, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[tone]}`, padding: '18px 18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Num n={n} tone={tone} size={38} />
      <IconTile name={icon} tone={tone} size={38} />
    </div>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 23, lineHeight: 1.2, color: C.navy, minHeight: 56 }}>{title}</div>
    <div style={{ background: T.violet.bg, borderRadius: 10, padding: '10px 12px', fontSize: 19, lineHeight: 1.38, color: C.ink }}>
      <strong style={{ color: T.violet.fg }}>IA · </strong>
      {ia}
    </div>
    <div style={{ background: T.green.bg, borderRadius: 10, padding: '10px 12px', fontSize: 19, lineHeight: 1.38, color: C.ink }}>
      <strong style={{ color: T.green.fg }}>Vous · </strong>
      {moi}
    </div>
  </div>
);

const M4_Methode: Page = () => (
  <Frame mod={4} beats={6}>
    <Title>La méthode en six temps</Title>
    <Lede>À chaque étape, ce que l’IA prépare… et ce qui reste à vous. → déroule les étapes.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 14 }}>
      <M4Step n={1} icon="search" tone="blue" title="Identifier le problème" ia="sépare faits, ressentis et demandes" moi="vérifiez les faits dans le dossier" />
      <M4Step n={2} icon="loop" tone="teal" title="Reformuler la demande" ia="propose « Si je comprends bien… »" moi="validez avec le client" />
      <M4Step n={3} icon="heart" tone="pink" title="Reconnaître l’insatisfaction" ia="suggère des phrases d’empathie" moi="choisissez des mots sincères" />
      <M4Step n={4} icon="pen" tone="violet" title="Construire la réponse" ia="rédige à partir de la procédure" moi="décidez de la solution et du geste" />
      <M4Step n={5} icon="hand" tone="yellow" title="Désamorcer le conflit" ia="vous souffle des formulations calmes" moi="gardez le lien, ne cédez pas au ton" />
      <M4Step n={6} icon="send" tone="coral" title="Préparer l’escalade" ia="résume le dossier pour le responsable" moi="décidez de passer la main" />
    </div>
  </Frame>
);

// ─── Identifier le problème : faits / ressentis / demandes ──────────────────
const M4Col = ({ n, tone, icon, title, children }: { n: number; tone: Tone; icon: IconName; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ flex: 1, background: T[tone].bg, borderRadius: 20, padding: '20px 24px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
      <Icon name={icon} size={30} color={T[tone].fg} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: T[tone].fg }}>{title}</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
  </div>
);

const M4_Probleme: Page = () => (
  <Frame mod={4} beats={4}>
    <Title>Identifier le problème : trier faits, ressentis et demandes</Title>
    <Lede>Une réclamation mélange tout. Prompt : « Sépare les faits, les ressentis et les demandes du client. »</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, ...dl(100) }}>
      <Bubble who="user" name="M. Benali · 3e appel retranscrit" size={23} w={1580}>
        C’est la troisième fois que j’appelle ! Le technicien devait venir mardi, j’ai posé ma journée, personne. Vous vous moquez de vos clients. Je veux
        un rendez-vous cette semaine et qu’on me rembourse ma journée perdue, sinon je vais voir une association de consommateurs.
      </Bubble>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 480, width: 1680, display: 'flex', gap: 22 }}>
      <M4Col n={1} tone="blue" icon="note" title="Les faits">
        <Bullet size={22}>Rendez-vous technicien prévu mardi</Bullet>
        <Bullet size={22}>Personne n’est venu</Bullet>
        <Bullet size={22}>3e contact pour ce problème</Bullet>
      </M4Col>
      <M4Col n={2} tone="coral" icon="frown" title="Les ressentis">
        <Bullet size={22} tone="coral">Colère : « vous vous moquez »</Bullet>
        <Bullet size={22} tone="coral">Sentiment de perte (journée de congé)</Bullet>
        <Bullet size={22} tone="coral">Lassitude : 3 appels</Bullet>
      </M4Col>
      <M4Col n={3} tone="green" icon="target" title="Les demandes">
        <Bullet size={22} tone="green">Un rendez-vous cette semaine</Bullet>
        <Bullet size={22} tone="green">Une compensation de la journée</Bullet>
        <Bullet size={22} tone="green">Implicite : être pris au sérieux</Bullet>
      </M4Col>
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 830, width: 1680 }}>
      <Callout title="Pourquoi trier ?" tone="violet" icon="bulb" size={23}>
        On répond aux <strong>faits</strong> par une solution, aux <strong>ressentis</strong> par de la reconnaissance, aux <strong>demandes</strong> par
        une réponse claire (oui, non, ou ce qui est possible).
      </Callout>
    </div>
  </Frame>
);

// ─── Jeu : apaise ou envenime ? ─────────────────────────────────────────────
const M4Phrase = ({ phrase, ok, why, flipAt }: { phrase: string; ok: boolean; why: string; flipAt: number }) => (
  <FlipCard
    w={536}
    h={262}
    tone="grey"
    backTone={ok ? 'green' : 'coral'}
    flipAt={flipAt}
    front={<div style={{ fontFamily: display, fontWeight: 700, fontSize: 28, lineHeight: 1.3, color: C.navy }}>« {phrase} »</div>}
    back={
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name={ok ? 'check' : 'x'} size={30} color={ok ? C.green : C.coral} sw={3} />
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: ok ? T.green.fg : T.coral.fg }}>{ok ? 'Apaise' : 'Envenime'}</span>
        </div>
        <div style={{ marginTop: 10, fontSize: 23, lineHeight: 1.42, color: C.ink }}>{why}</div>
      </>
    }
  />
);

const M4_Mots: Page = () => (
  <Frame mod={4} kind="jeu" beats={2}>
    <Title>Reconnaître l’insatisfaction : apaise ou envenime ?</Title>
    <Lede>Votez pour chaque phrase, puis retournez la carte. → retourne la première ligne, puis la seconde.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 536px)', gap: 36, ...dl(100) }}>
      <M4Phrase flipAt={1} ok={false} phrase="Calmez-vous, monsieur." why="Personne ne se calme sur ordre : la phrase nie l’émotion et la fait monter." />
      <M4Phrase flipAt={1} ok phrase="Je comprends : vous avez posé une journée pour rien." why="Elle reprend un fait précis : le client sait qu’il a été écouté." />
      <M4Phrase flipAt={1} ok={false} phrase="Ce n’est pas de notre faute, c’est le transporteur." why="Le client ne fait pas la différence : il attend une solution, pas un coupable." />
      <M4Phrase flipAt={2} ok phrase="Voici ce que je peux faire dès maintenant." why="On passe de la plainte à l’action, et le conseiller reprend la main." />
      <M4Phrase flipAt={2} ok={false} phrase="Comme indiqué dans mon précédent message…" why="Sous-entend que le client n’a pas lu : à éviter même si c’est vrai." />
      <M4Phrase flipAt={2} ok phrase="Vous avez raison d’insister, ce délai n’est pas normal." why="Reconnaître ce qui est légitime désamorce, sans reconnaître de faute juridique." />
    </div>
  </Frame>
);

// ─── Construire une réponse adaptée : le prompt réclamation ─────────────────
const M4_Prompt: Page = () => (
  <Frame mod={4} beats={3}>
    <Title>Construire une réponse adaptée : le prompt réclamation</Title>
    <Lede>Plus de garde-fous qu’une réponse ordinaire : c’est là que l’IA peut le plus vous coûter.</Lede>
    <CodeDark file="prompt-reclamation.txt" size={20} wrap cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 960, height: 680, ...dl(100) }}>
      <Ck>Rôle · </Ck>Tu aides un conseiller à répondre à une réclamation.{'\n\n'}
      <Ck>Contexte · </Ck>
      <Hole>fiche : faits, ressentis, demandes</Hole>
      {'\n'}
      <Ck>Procédure · </Ck>
      <Hole>solutions et gestes autorisés</Hole>
      {'\n\n'}
      <Ck>Tâche · </Ck>Rédige une réponse en 5 temps :{'\n'}
      {'  '}1. reconnaître la situation et l’émotion, avec un fait précis{'\n'}
      {'  '}2. présenter des excuses pour la gêne (pas de faute juridique){'\n'}
      {'  '}3. la solution, datée{'\n'}
      {'  '}4. la prochaine étape et le moyen de recontacter{'\n'}
      {'  '}5. une signature personnelle{'\n\n'}
      <Ck>Règles · </Ck>
      <Cf>N’invente aucun geste</Cf> : utilise seulement ceux de la procédure.{'\n'}
      Si une demande du client est impossible, dis-le clairement et propose une alternative.{'\n'}
      Pas de « calmez-vous », pas de justification qui accuse un tiers.{'\n'}
      Ton : <Cs>calme, respectueux, direct</Cs>. 150 mots maximum.
    </CodeDark>
    <div style={{ position: 'absolute', left: 1130, top: 262, width: 670, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="violet" icon="layers" title="Le contexte trié" cls={b.on(1)} size={22}>
        La fiche faits / ressentis / demandes : l’IA répond à chaque niveau.
      </Card>
      <Card tone="coral" icon="lock" title="Les gestes listés" cls={b.on(2)} size={22}>
        L’IA ne peut proposer que ce que la procédure autorise. Le reste, c’est vous (ou votre responsable) qui décidez.
      </Card>
      <Card tone="green" icon="scale" title="Le « non » bien dit" cls={b.on(3)} size={22}>
        « Je ne peux pas rembourser votre journée ; je peux en revanche… » : clair, et tourné vers une solution.
      </Card>
    </div>
  </Frame>
);

// ─── Désamorcer un conflit (chat + coach) ───────────────────────────────────
const M4Tip = ({ n, tone, label }: { n: number; tone: Tone; label: string }) => (
  <div className={b.pop(n)} style={{ ...vars({ o: 'left center' }) }}>
    <Tag tone={tone} size={20}>
      <Icon name="bulb" size={20} /> {label}
    </Tag>
  </div>
);

const M4_Desamorcer: Page = () => (
  <Frame mod={4} kind="demo" beats={4}>
    <Title>Désamorcer un conflit : l’IA en coach discret</Title>
    <Lede>Un chat qui monte en tension. À chaque message, l’assistant souffle une technique. → avance dans l’échange.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060, height: 680, boxSizing: 'border-box', background: C.panel, borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 14, ...dl(100) }}>
      <Bubble who="user" name="Client" size={22}>
        Ça fait 20 minutes que j’attends. VOUS ÊTES TOUS INCOMPÉTENTS.
      </Bubble>
      <Bubble who="human" name="Conseiller" size={22} cls={b.on(1)}>
        Je suis désolée pour cette attente. Je suis là maintenant et je m’occupe de vous personnellement.
      </Bubble>
      <Bubble who="user" name="Client" size={22} cls={b.on(2)}>
        Mon colis est perdu depuis 10 jours, personne ne sait où il est !
      </Bubble>
      <Bubble who="human" name="Conseiller" size={22} cls={b.on(2)}>
        Si je comprends bien, vous n’avez aucune nouvelle de votre colis depuis 10 jours. C’est très inquiétant, je comprends.
      </Bubble>
      <Bubble who="human" name="Conseiller" size={22} cls={b.on(3)}>
        Je vous propose deux options : un renvoi immédiat, ou le remboursement sous 5 jours. Laquelle préférez-vous ?
      </Bubble>
    </div>
    <div style={{ position: 'absolute', left: 1230, top: 262, width: 570, height: 680, boxSizing: 'border-box', background: T.violet.bg, borderRadius: 20, padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <IconTile name="sparkles" tone="violet" size={40} solid />
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 23, color: T.violet.fg }}>Coach IA</span>
      </div>
      <M4Tip n={1} tone="blue" label="Ne pas relever l’insulte, prendre la main" />
      <M4Tip n={2} tone="teal" label="Reformuler, nommer l’émotion" />
      <M4Tip n={3} tone="green" label="Proposer un choix : le client reprend le contrôle" />
      <div className={b.on(4)} style={{ marginTop: 'auto', background: '#fff', borderRadius: 14, padding: '16px 20px', fontSize: 21, lineHeight: 1.45, color: C.ink }}>
        <strong style={{ color: T.coral.fg }}>Et si les insultes continuent ?</strong> On applique la procédure : un avertissement poli, puis on met fin à
        l’échange et on le signale. Votre respect compte aussi.
      </div>
    </div>
  </Frame>
);

// ─── Préparer une escalade ──────────────────────────────────────────────────
const M4Crit = ({ icon, children, d }: { icon: IconName; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 14, ...dl(d) }}>
    <IconTile name={icon} tone="coral" size={46} />
    <span style={{ fontSize: 23, lineHeight: 1.35, color: C.ink }}>{children}</span>
  </div>
);

const M4NoteLine = ({ label, children }: { label: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 14, padding: '8px 0', borderBottom: `1.5px solid ${C.rule}` }}>
    <span style={{ width: 170, flex: 'none', fontFamily: display, fontWeight: 700, fontSize: 16, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.navy.fg, paddingTop: 3 }}>{label}</span>
    <span style={{ fontSize: 21, lineHeight: 1.4, color: C.ink }}>{children}</span>
  </div>
);

const M4_Escalade: Page = () => (
  <Frame mod={4} beats={1}>
    <Title>Préparer une escalade : passer la main, pas le problème</Title>
    <Lede>Quand escalader ? Et comment éviter que le responsable reparte de zéro ? → la note générée par l’IA.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 640, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Eyebrow c={T.coral.fg} size={20} cls={A.fade}>
        On escalade quand…
      </Eyebrow>
      <M4Crit icon="euro" d={150}>
        Le geste demandé dépasse votre délégation
      </M4Crit>
      <M4Crit icon="scale" d={250}>
        Menace juridique, association, médias
      </M4Crit>
      <M4Crit icon="loop" d={350}>
        3e contact sans solution, ou échec de la solution
      </M4Crit>
      <M4Crit icon="heart" d={450}>
        Client vulnérable, situation sensible
      </M4Crit>
      <M4Crit icon="alert" d={550}>
        Risque pour la sécurité des personnes
      </M4Crit>
      <M4Crit icon="hand" d={650}>
        Le client le demande expressément
      </M4Crit>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 820, top: 262, width: 980, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 30px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <IconTile name="send" tone="coral" size={42} solid />
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: C.navy }}>Note d’escalade · M. Benali</span>
        <Tag tone="yellow" size={17} style={{ marginLeft: 'auto' }}>
          P2 · réponse sous 24 h
        </Tag>
      </div>
      <M4NoteLine label="Situation">Intervention SAV non honorée mardi ; 3e contact ; journée de congé posée.</M4NoteLine>
      <M4NoteLine label="Déjà fait">Excuses, nouveau créneau jeudi 8 h–10 h proposé et accepté.</M4NoteLine>
      <M4NoteLine label="Demande">Compensation de la journée perdue (hors délégation conseiller).</M4NoteLine>
      <M4NoteLine label="Risque">Menace de saisir une association de consommateurs.</M4NoteLine>
      <M4NoteLine label="Proposition">Geste à valider : remboursement des frais de livraison + suivi personnalisé.</M4NoteLine>
      <div style={{ marginTop: 12, fontSize: 20, color: C.muted, lineHeight: 1.4 }}>
        Prompt : « Résume ce dossier pour mon responsable en 5 rubriques : situation, déjà fait, demande, risque, proposition. Factuel, sans adjectif. »
      </div>
    </div>
  </Frame>
);

// ─── S’entraîner : l’IA joue le client ──────────────────────────────────────
const M4Prof = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.right} style={{ display: 'flex', gap: 16, alignItems: 'center', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '14px 20px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={52} solid />
    <div>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: C.navy }}>{title}</div>
      <div style={{ fontSize: 21, lineHeight: 1.38, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M4_Simu: Page = () => (
  <Frame mod={4} kind="role">
    <Title>S’entraîner : l’IA joue le client mécontent</Title>
    <Lede>Un simulateur d’entraînement disponible à toute heure, sans risque pour un vrai client.</Lede>
    <CodeDark file="prompt-simulation.txt" size={20} wrap cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 960, height: 680, ...dl(100) }}>
      <Ck>Jeu de rôle · </Ck>Tu joues un client de Nova Maison. Je suis le conseiller.{'\n\n'}
      <Ck>Ton personnage · </Ck>
      <Hole>profil</Hole>
      {'\n'}
      <Ck>Ta situation · </Ck>
      <Hole>scénario</Hole>
      {'\n\n'}
      <Ck>Règles · </Ck>
      {'\n'}- Reste dans ton rôle, réponds en 1 à 3 phrases.{'\n'}- Ta colère baisse seulement si je reconnais ta situation et propose une
      solution concrète. Elle monte si je me justifie ou si je reste vague.{'\n'}- Ne m’aide pas : c’est moi qui m’entraîne.{'\n\n'}
      <Ck>Fin · </Ck>Quand j’écris <Cs>STOP</Cs>, sors du rôle et donne-moi un retour : 3 points forts, 3 axes de progrès, une note d’apaisement sur 10.
    </CodeDark>
    <div style={{ position: 'absolute', left: 1130, top: 262, width: 670, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Eyebrow c={C.navy} size={20} cls={A.fade} style={dl(200)}>
        Trois profils pour l’atelier
      </Eyebrow>
      <M4Prof icon="frown" tone="coral" title="Le furieux" d={300}>
        Majuscules, interruptions, veut un responsable tout de suite.
      </M4Prof>
      <M4Prof icon="book" tone="navy" title="Le procédurier" d={400}>
        Cite la loi et les CGV, exige des réponses écrites et précises.
      </M4Prof>
      <M4Prof icon="meh" tone="teal" title="Le déçu silencieux" d={500}>
        Poli, froid, répond par monosyllabes : il est déjà en train de partir.
      </M4Prof>
      <Callout title="Le vrai bénéfice" tone="green" icon="star" cls={A.right} style={dl(650)} size={22}>
        Répéter les phrases difficiles avant de les dire à un vrai client.
      </Callout>
    </div>
  </Frame>
);

// ─── Atelier 3 ──────────────────────────────────────────────────────────────
const M4_Atelier: Page = () => (
  <LabPage
    mod={4}
    n="3"
    title="Simulations de réclamations avec l’IA"
    defi="reclamation"
    who="En binôme · 20 min"
    minutes={20}
    objective={
      <>
        Mener jusqu’au bout <strong>deux réclamations simulées</strong> par l’IA, puis rédiger la réponse écrite et, si besoin, la{' '}
        <strong>note d’escalade</strong>.
      </>
    }
    where={
      <>
        2 conversations simulées + le retour de l’IA
        <br />
        1 réponse écrite à une réclamation
        <br />
        1 note d’escalade (si nécessaire)
      </>
    }
    crit={
      <>
        <CheckItem id="a3-1" size={21}>
          Faits, ressentis, demandes identifiés
        </CheckItem>
        <CheckItem id="a3-2" size={21}>
          Émotion reconnue avec un fait précis
        </CheckItem>
        <CheckItem id="a3-3" size={21}>
          Solution ou alternative concrète
        </CheckItem>
        <CheckItem id="a3-4" size={21}>
          Note d’apaisement de l’IA ≥ 7/10
        </CheckItem>
      </>
    }
  >
    <strong>1.</strong> Personne A : lancez le prompt de simulation avec un profil et un scénario (M. Benali, colis perdu, frais contestés).{' '}
    <strong>2.</strong> Menez l’échange 6 à 8 messages, puis écrivez STOP. <strong>3.</strong> Inversez les rôles. <strong>4.</strong> Ensemble :
    rédigez la réponse écrite au cas le plus difficile, avec le prompt réclamation.
    <Bonus>Demandez à l’IA de rejouer la même scène avec un client « déçu silencieux » : quelles phrases ne marchent plus ?</Bonus>
  </LabPage>
);

// ─── Débrief : grille d’auto-évaluation ─────────────────────────────────────
const M4_Debrief: Page = () => (
  <Frame mod={4} kind="exercice">
    <Title>Débrief · comment s’est passée votre simulation ?</Title>
    <Lede>Cochez ce que vous avez réussi à faire. Les « ×2 » sont les gestes qui apaisent le plus.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1150, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CheckItem id="db1" size={25}>Je n’ai pas relevé les provocations</CheckItem>
        <CheckItem id="db2" w={2} size={25}>J’ai reformulé avec un fait précis (« vous avez posé une journée… »)</CheckItem>
        <CheckItem id="db3" w={2} size={25}>J’ai nommé l’émotion sans la juger</CheckItem>
        <CheckItem id="db4" size={25}>Je ne me suis pas justifié(e) en accusant un tiers</CheckItem>
        <CheckItem id="db5" w={2} size={25}>J’ai proposé une solution concrète, ou un choix</CheckItem>
        <CheckItem id="db6" size={25}>J’ai dit « non » clairement quand c’était impossible</CheckItem>
        <CheckItem id="db7" size={25}>J’ai conclu par la prochaine étape</CheckItem>
        <CheckItem id="db8" size={25}>J’ai su quand proposer l’escalade</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 262, width: 470, ...dl(300) }}>
        <CheckScore
          max={11}
          label="Mon score d’apaisement"
          levels={[
            { min: 0, text: 'Normal au début : rejouez la scène ce soir avec l’IA.', tone: 'grey' },
            { min: 5, text: 'Les bases sont là : travaillez la reformulation.', tone: 'blue' },
            { min: 9, text: 'Excellent : vous êtes prêt(e) pour les vrais cas.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Partagez au groupe la phrase qui a le mieux marché… et celle qui a fait monter la tension.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Quiz ───────────────────────────────────────────────────────────────────
const M4_Quiz: Page = () => (
  <Frame mod={4} kind="quiz">
    <Title>Quiz : réclamations et situations difficiles</Title>
    <QuizSeries y={220}>
      <QuizQ q="L’IA propose « En compensation, nous vous offrons 50 € ». Ce geste n’est pas dans la procédure. Vous…" explain="Un geste commercial engage l’entreprise : il suit la procédure ou la décision d’un responsable. On le retire du brouillon et on escalade si le cas le justifie.">
        <QOpt>Gardez-le : le client est très en colère</QOpt>
        <QOpt ok>Le retirez, et demandez l’avis de votre responsable si besoin</QOpt>
        <QOpt>Le réduisez à 20 €</QOpt>
      </QuizQ>
      <QuizQ q="Quelle phrase reconnaît l’insatisfaction sans reconnaître de faute juridique ?" explain="On reconnaît la gêne et ce qui est légitime (« ce délai n’est pas normal ») sans écrire « c’est notre faute » ni « nous sommes responsables du préjudice ».">
        <QOpt>« Nous reconnaissons notre entière responsabilité. »</QOpt>
        <QOpt ok>« Je comprends votre exaspération, ce délai n’est pas normal. »</QOpt>
        <QOpt>« Ce n’est pas de notre faute. »</QOpt>
      </QuizQ>
      <QuizQ q="Une bonne note d’escalade contient surtout…" explain="Le responsable doit pouvoir décider sans tout relire : situation, ce qui a déjà été fait, la demande, le risque, et votre proposition. Factuel, sans adjectifs.">
        <QOpt>Tout l’historique copié-collé</QOpt>
        <QOpt>Votre avis sur le client</QOpt>
        <QOpt ok>Situation, déjà fait, demande, risque, proposition</QOpt>
      </QuizQ>
      <QuizQ q="À quoi sert la simulation de réclamation avec l’IA ?" explain="C’est un entraînement : répéter les phrases difficiles, sans risque pour un vrai client, et recevoir un retour immédiat. Jamais avec des données réelles.">
        <QOpt ok>À s’entraîner sans risque, et à recevoir un retour</QOpt>
        <QOpt>À laisser l’IA répondre aux vrais clients en colère</QOpt>
        <QOpt>À évaluer officiellement les conseillers</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M4_Synthese: Page = () => (
  <Frame mod={4} kind="synthese">
    <Title>Module 4 · ce qu’il faut retenir</Title>
    <div style={{ position: 'absolute', left: 120, top: 210, width: 1680, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <SynthRow n={1} tone="blue">
        Trier <strong>faits, ressentis, demandes</strong> : une solution pour les faits, de la reconnaissance pour les ressentis.
      </SynthRow>
      <SynthRow n={2} tone="pink">
        Reconnaître avec un <strong>fait précis</strong> ; bannir « calmez-vous » et la justification qui accuse un tiers.
      </SynthRow>
      <SynthRow n={3} tone="violet">
        Le prompt réclamation liste les <strong>gestes autorisés</strong> : l’IA n’en invente aucun.
      </SynthRow>
      <SynthRow n={4} tone="yellow">
        Désamorcer : ne pas relever, reformuler, nommer l’émotion, <strong>proposer un choix</strong>.
      </SynthRow>
      <SynthRow n={5} tone="coral">
        Escalader au bon moment, avec une <strong>note en 5 rubriques</strong> : le responsable ne repart pas de zéro.
      </SynthRow>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(1000) }}>
      <Icon name="note" size={24} color={C.violet} />
      Dans votre document : le prompt réclamation et le prompt de simulation, pour vous entraîner quand vous voulez.
    </div>
  </Frame>
);

// ═══ 50-m5 ═════════════════════════════════════════════════════════════

// ─── Module 5 · Créer une base de connaissances client ─────────────────────

const M5_Section: Page = () => (
  <Section
    n={5}
    title={
      <>
        Créer une base
        <br />
        de connaissances client
      </>
    }
    sub="Transformer une documentation touffue en réponses prêtes à l’emploi : la même bonne information, pour tous les conseillers, en quelques secondes."
    dur="14:30 – 15:20 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 4 · transformer une documentation en base de réponses
      </Tag>
    }
  >
    <SecItem n={1}>FAQ et questions fréquentes</SecItem>
    <SecItem n={2}>Procédures pas à pas</SecItem>
    <SecItem n={3}>Scripts de réponse</SecItem>
    <SecItem n={4}>Arbre de décision</SecItem>
    <SecItem n={5}>Recherche dans la documentation</SecItem>
  </Section>
);
M5_Section.transition = BLOOM;

// ─── Le problème : une question, cinq réponses ──────────────────────────────
const M5Ans = ({ n, who, ans, tone }: { n: number; who: string; ans: string; tone: Tone }) => (
  <div className={b.on(n)} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '14px 22px' }}>
    <IconTile name="headset" tone={tone} size={48} />
    <span style={{ width: 170, flex: 'none', fontSize: 22, fontWeight: 600, color: C.muted }}>{who}</span>
    <span style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>« {ans} »</span>
  </div>
);

const M5_Probleme: Page = () => (
  <Frame mod={5} beats={6}>
    <Title>Le problème : une question, cinq réponses</Title>
    <Lede>Un client pose la même question à cinq conseillers différents. → écoutez les réponses.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 760, ...dl(100) }}>
      <Bubble who="user" name="Client" size={27}>
        J’ai renvoyé mon aspirateur. Sous combien de temps serai-je remboursé ?
      </Bubble>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 430, width: 760, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M5Ans n={1} who="Conseiller 1" ans="Sous 7 jours." tone="blue" />
      <M5Ans n={2} who="Conseiller 2" ans="Comptez 14 jours." tone="teal" />
      <M5Ans n={3} who="Conseiller 3" ans="Dès réception du colis." tone="violet" />
      <M5Ans n={4} who="Conseiller 4" ans="Ça dépend de la banque." tone="yellow" />
      <M5Ans n={5} who="Conseiller 5" ans="Je me renseigne et je vous rappelle." tone="pink" />
    </div>
    <div className={b.on(6)} style={{ position: 'absolute', left: 960, top: 262, width: 840, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: G.navy, borderRadius: 20, padding: '28px 34px', color: '#fff' }}>
        <Eyebrow c="#AEB9E6" size={18}>
          La bonne réponse (procédure)
        </Eyebrow>
        <div style={{ marginTop: 10, fontFamily: display, fontWeight: 800, fontSize: 34, lineHeight: 1.25 }}>
          Remboursement sous 14 jours après réception et contrôle du retour, puis 3 à 5 jours ouvrés selon la banque.
        </div>
      </div>
      <Card tone="coral" icon="alert" title="Ce que ça coûte" size={23}>
        Des clients qui rappellent, comparent, s’agacent. Et des conseillers qui perdent du temps à chercher.
      </Card>
      <Card tone="green" icon="book" title="La solution" size={23}>
        Une base de connaissances : <strong>une seule vérité</strong>, à jour, trouvable en quelques secondes.
      </Card>
    </div>
  </Frame>
);

// ─── Du document à la FAQ ───────────────────────────────────────────────────
const M5QR = ({ n, q, a }: { n: number; q: string; a: string }) => (
  <div className={b.left(n)} style={{ background: C.card, borderRadius: 14, boxShadow: `${SHADOW_SM}, inset 5px 0 0 ${C.teal}`, padding: '12px 20px 12px 24px' }}>
    <div style={{ fontWeight: 700, fontSize: 22, color: C.navy }}>{q}</div>
    <div style={{ marginTop: 3, fontSize: 21, lineHeight: 1.4, color: C.soft }}>{a}</div>
  </div>
);

const M5_FAQ: Page = () => (
  <Frame mod={5} beats={5}>
    <Title>Du document à la FAQ, en une demande</Title>
    <Lede>Prompt : « Transforme ce texte en FAQ : questions formulées comme un client, réponses de 2 phrases maximum, sans rien ajouter. »</Lede>
    <div
      className={A.in}
      style={{ position: 'absolute', left: 120, top: 270, width: 760, boxSizing: 'border-box', background: '#FBFBF8', borderRadius: 14, boxShadow: `inset 0 0 0 1.5px ${C.rule}`, padding: '24px 30px', fontFamily: 'Georgia, serif', fontSize: 21, lineHeight: 1.6, color: C.soft, ...dl(100) }}
    >
      <div style={{ fontWeight: 700, color: C.ink, marginBottom: 8 }}>Art. 7 · Droit de rétractation et retours</div>
      Conformément aux dispositions légales, le Client dispose d’un délai de quatorze (14) jours calendaires à compter de la réception du Produit pour
      exercer son droit de rétractation, sans avoir à justifier de motifs. Les frais de retour sont à la charge du Client, sauf pour les Produits
      volumineux (plus de 30 kg), pour lesquels Nova Maison organise l’enlèvement à ses frais. Le Produit doit être retourné complet, dans son
      emballage d’origine ou un emballage équivalent. Le remboursement intervient dans un délai de quatorze (14) jours suivant la réception et le
      contrôle du Produit retourné, par le même moyen de paiement que celui utilisé lors de la commande.
    </div>
    <div style={{ position: 'absolute', left: 940, top: 270, width: 860, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M5QR n={1} q="J’ai combien de temps pour changer d’avis ?" a="14 jours à partir de la réception, sans avoir à vous justifier." />
      <M5QR n={2} q="Qui paie le retour ?" a="Vous, sauf pour les produits de plus de 30 kg : nous venons les chercher gratuitement." />
      <M5QR n={3} q="Faut-il garder le carton d’origine ?" a="Le produit doit revenir complet, dans son emballage d’origine ou un emballage équivalent." />
      <M5QR n={4} q="Quand serai-je remboursé ?" a="Sous 14 jours après réception et contrôle du retour, sur le moyen de paiement utilisé." />
      <div className={b.on(5)}>
        <Callout title="À vérifier" tone="yellow" icon="eye" size={22}>
          Chaque réponse est comparée au texte source : aucune condition oubliée, aucune ajoutée.
        </Callout>
      </div>
    </div>
  </Frame>
);

// ─── Trouver les vraies questions fréquentes ────────────────────────────────
const M5Bar = ({ n, q, v, w, tone }: { n: number; q: string; v: number; w: number; tone: Tone }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
    <span style={{ width: 600, flex: 'none', fontSize: 23, color: C.ink }}>« {q} »</span>
    <div style={{ flex: 1, height: 38, background: C.panel, borderRadius: 8, overflow: 'hidden' }}>
      <div className={b.grow(n)} style={{ width: w, height: '100%', background: STRONG[tone], borderRadius: 8 }} />
    </div>
    <span className={b.fade(n)} style={{ width: 70, flex: 'none', fontFamily: display, fontWeight: 800, fontSize: 30, color: tone === 'yellow' ? C.amber : STRONG[tone], textAlign: 'right' }}>
      {v}
    </span>
  </div>
);

const M5_Frequentes: Page = () => (
  <Frame mod={5} beats={2}>
    <Title>Les vraies questions fréquentes sont dans vos messages</Title>
    <Lede>Pas celles qu’on imagine : celles que les clients posent vraiment, avec leurs mots. → l’analyse de 200 messages.</Lede>
    <CodeDark size={20} wrap cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, ...dl(100) }}>
      <Ck>Prompt · </Ck>Voici 200 messages clients anonymisés. Regroupe-les par question posée. Pour chaque groupe : formule la question{' '}
      <Cf>avec les mots des clients</Cf>, compte les messages, et signale si notre FAQ actuelle y répond.
    </CodeDark>
    <div style={{ position: 'absolute', left: 120, top: 420, width: 1680, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M5Bar n={1} q="Où est mon colis ?" v={46} w={820} tone="blue" />
      <M5Bar n={1} q="Quand serai-je remboursé ?" v={31} w={553} tone="violet" />
      <M5Bar n={1} q="Comment je renvoie un gros appareil ?" v={22} w={392} tone="teal" />
      <M5Bar n={1} q="Le livreur peut-il monter à l’étage ?" v={17} w={303} tone="yellow" />
      <M5Bar n={1} q="Ma garantie couvre-t-elle cette panne ?" v={14} w={250} tone="pink" />
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 780, width: 1680 }}>
      <Callout title="Découverte" tone="coral" icon="search" size={24}>
        Deux de ces cinq questions (« monter à l’étage », « gros appareil ») <strong>n’ont aucune réponse dans la FAQ actuelle</strong>. C’est par elles
        qu’on commence.
      </Callout>
    </div>
  </Frame>
);

// ─── Procédure pas à pas ────────────────────────────────────────────────────
const M5PStep = ({ n, children, check }: { n: number; children: ReactNode; check?: string }) => (
  <div className={b.on(n)} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
    <Num n={n} tone="navy" size={44} />
    <div style={{ flex: 1, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 20px' }}>
      <div style={{ fontSize: 23, lineHeight: 1.4, color: C.ink }}>{children}</div>
      {check ? (
        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8, fontSize: 20, color: T.yellow.fg, fontWeight: 600 }}>
          <Icon name="eye" size={20} /> {check}
        </div>
      ) : null}
    </div>
  </div>
);

const M5_Procedure: Page = () => (
  <Frame mod={5} beats={5}>
    <Title>Procédures : du paragraphe aux étapes numérotées</Title>
    <Lede>Prompt : « Transforme cette procédure en étapes numérotées, une action par étape, avec les points de contrôle. »</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 620, ...dl(100) }}>
      <Card tone="grey" icon="doc" title="Procédure « Colis non reçu » · avant" size={21}>
        En cas de colis indiqué livré mais non reçu, vérifier d’abord l’adresse et la preuve de livraison, puis demander au client de vérifier auprès
        des voisins et du gardien ; s’il n’est pas retrouvé sous 48 h, ouvrir une enquête transporteur (formulaire T-12) qui prend 5 jours ouvrés, à
        l’issue de laquelle on renvoie ou on rembourse selon le choix du client, sauf si la commande dépasse 1 000 € auquel cas le superviseur valide.
      </Card>
    </div>
    <div style={{ position: 'absolute', left: 800, top: 270, width: 1000, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M5PStep n={1} check="Adresse identique à la commande ?">
        Vérifier l’adresse et la preuve de livraison (photo, signature).
      </M5PStep>
      <M5PStep n={2}>Demander au client de vérifier auprès des voisins et du gardien.</M5PStep>
      <M5PStep n={3} check="Délai de 48 h écoulé ?">
        Si le colis n’est pas retrouvé : ouvrir l’enquête transporteur (formulaire T-12).
      </M5PStep>
      <M5PStep n={4}>Prévenir le client : résultat de l’enquête sous 5 jours ouvrés.</M5PStep>
      <M5PStep n={5} check="Commande > 1 000 € ? → validation superviseur">
        Renvoyer ou rembourser, au choix du client.
      </M5PStep>
    </div>
  </Frame>
);

// ─── Script de réponse téléphonique ─────────────────────────────────────────
const M5Line = ({ n, tone, label, children }: { n: number; tone: Tone; label: string; children: ReactNode }) => (
  <div className={b.left(n)} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
    <span style={{ width: 150, flex: 'none', paddingTop: 6 }}>
      <Tag tone={tone} size={17}>
        {label}
      </Tag>
    </span>
    <div style={{ flex: 1, fontSize: 23, lineHeight: 1.45, color: C.ink }}>{children}</div>
  </div>
);

const M5_Script: Page = () => (
  <Frame mod={5} beats={5}>
    <Title>Scripts de réponse : une trame, pas un texte à réciter</Title>
    <Lede>Généré par l’IA à partir de la procédure « colis non reçu », puis relu par le référent. → déroule le script.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1120, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 16, ...dl(100) }}>
      <M5Line n={1} tone="blue" label="Accueil">
        « Je comprends, c’est très frustrant de voir un colis livré sans l’avoir reçu. On va le retrouver ensemble. »
      </M5Line>
      <M5Line n={2} tone="teal" label="Vérifier">
        « Je vérifie l’adresse avec vous : … » · « Le livreur a laissé une photo, je vous la décris. »
      </M5Line>
      <M5Line n={3} tone="yellow" label="Si… alors">
        <strong>Si</strong> photo devant une autre porte → voisins / gardien. <strong>Sinon</strong> → enquête T-12 tout de suite.
      </M5Line>
      <M5Line n={4} tone="violet" label="Engager">
        « J’ouvre l’enquête maintenant. Vous aurez la réponse sous 5 jours ouvrés, par email. »
      </M5Line>
      <M5Line n={5} tone="green" label="Conclure">
        « Je récapitule : … Avez-vous d’autres questions ? »
      </M5Line>
    </div>
    <div style={{ position: 'absolute', left: 1290, top: 262, width: 510, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="blue" icon="phone" title="Fait pour l’oral" cls={A.right} style={dl(300)} size={22}>
        Phrases courtes, faciles à dire ; des branches « si… alors » au lieu d’un bloc.
      </Card>
      <Card tone="pink" icon="user" title="Votre voix" cls={A.right} style={dl(450)} size={22}>
        Le script donne les étapes et les mots clés ; vous gardez votre façon de parler.
      </Card>
    </div>
  </Frame>
);

// ─── Arbre de décision (interactif) ─────────────────────────────────────────
type M5Node = { q?: string; yes?: string; no?: string; end?: string; tone?: Tone };
const M5_TREE: Record<string, M5Node> = {
  s: { q: 'Y a-t-il un risque : fumée, étincelles, grosse fuite ?', yes: 'e1', no: 'q2' },
  q2: { q: 'L’appareil a-t-il été livré il y a moins de 14 jours ?', yes: 'e2', no: 'q3' },
  q3: { q: 'Est-il encore sous garantie (moins de 2 ans) ?', yes: 'q4', no: 'e3' },
  q4: { q: 'La panne figure-t-elle dans le guide de dépannage ?', yes: 'e4', no: 'e5' },
  e1: { end: 'Consigne de sécurité : débrancher, ne plus utiliser. Priorité P1, technicien sous 24 h.', tone: 'coral' },
  e2: { end: 'Panne à la livraison : échange direct de l’appareil, enlèvement offert.', tone: 'green' },
  e3: { end: 'Hors garantie : proposer un devis de réparation, ou l’extension si elle a été souscrite.', tone: 'yellow' },
  e4: { end: 'Guider le client pas à pas avec la fiche de dépannage. En cas d’échec : technicien.', tone: 'blue' },
  e5: { end: 'Intervention d’un technicien sous garantie, sous 72 h.', tone: 'violet' },
};

const M5_Arbre: Page = () => {
  const [path, setPath] = useState<{ id: string; a?: 'Oui' | 'Non' }[]>([{ id: 's' }]);
  const cur = M5_TREE[path[path.length - 1].id];
  const go = (a: 'Oui' | 'Non') => {
    const next = a === 'Oui' ? cur.yes : cur.no;
    if (!next) return;
    setPath((p) => [...p.slice(0, -1), { ...p[p.length - 1], a }, { id: next }]);
  };
  return (
    <Frame mod={5} kind="simu">
      <Title>Arbre de décision : « Mon appareil est en panne »</Title>
      <Lede>Répondez aux questions comme avec un client au téléphone. L’arbre mène toujours à la bonne procédure.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 12, ...dl(100) }}>
        <Eyebrow c={C.muted} size={18}>
          Chemin parcouru
        </Eyebrow>
        {path.slice(0, -1).map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '10px 16px' }}>
            <Num n={i + 1} tone="grey" size={32} />
            <span style={{ flex: 1, fontSize: 19, lineHeight: 1.35, color: C.soft }}>{M5_TREE[s.id].q}</span>
            <Tag tone={s.a === 'Oui' ? 'green' : 'coral'} size={17}>
              {s.a}
            </Tag>
          </div>
        ))}
        {path.length === 1 ? <div style={{ fontSize: 21, color: C.faint }}>Aucune réponse pour l’instant.</div> : null}
        <div style={{ marginTop: 8 }}>
          <Btn icon="reset" ghost tone="grey" size={20} onClick={() => setPath([{ id: 's' }])}>
            Recommencer
          </Btn>
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 740, top: 262, width: 1060, height: 520, ...dl(200) }}>
        {cur.end ? (
          <div
            key={path.length}
            className={A.pop}
            style={{ height: '100%', boxSizing: 'border-box', background: T[cur.tone ?? 'green'].bg, borderRadius: 24, boxShadow: `inset 0 0 0 3px ${STRONG[cur.tone ?? 'green']}`, padding: '44px 54px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}
          >
            <Eyebrow c={T[cur.tone ?? 'green'].fg} size={22}>
              Procédure à appliquer
            </Eyebrow>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 44, lineHeight: 1.22, color: C.navy }}>{cur.end}</div>
          </div>
        ) : (
          <div key={path.length} className={A.fade} style={{ height: '100%', boxSizing: 'border-box', background: C.card, borderRadius: 24, boxShadow: SHADOW, padding: '44px 54px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 34, animationDuration: '350ms' } as CSSProperties}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <IconTile name="split" tone="yellow" size={52} solid />
              <Eyebrow c={T.yellow.fg} size={20}>
                Question {path.length}
              </Eyebrow>
            </div>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 46, lineHeight: 1.2, color: C.navy }}>{cur.q}</div>
            <div style={{ display: 'flex', gap: 18 }}>
              <Btn tone="green" icon="check" size={28} onClick={() => go('Oui')}>
                Oui
              </Btn>
              <Btn tone="coral" icon="x" size={28} onClick={() => go('Non')}>
                Non
              </Btn>
            </div>
          </div>
        )}
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 740, top: 812, width: 1060, ...dl(400) }}>
        <Callout title="Avec l’IA" tone="violet" icon="sparkles" size={22}>
          « À partir de ces trois procédures, construis un arbre de décision : une question fermée par étape, chaque branche finit par une action. »
          Puis testez chaque branche avec un cas réel.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Recherche dans la documentation ────────────────────────────────────────
const M5_Recherche: Page = () => (
  <Frame mod={5} kind="demo">
    <Title>Rechercher dans la documentation, sources à l’appui</Title>
    <Lede>Trois règles dans le prompt, et l’IA cite ses sources. Comparez les deux cas.</Lede>
    <CodeDark size={20} wrap cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 640, height: 640, ...dl(100) }}>
      <Ck>Document · </Ck>
      <Cc>[procédures SAV jointes, 40 pages]</Cc>
      {'\n\n'}
      <Ck>Règles · </Ck>
      {'\n'}1. Réponds <Cf>uniquement</Cf> à partir du document joint.{'\n\n'}2. Cite la <Cf>section</Cf> d’où vient chaque information.{'\n\n'}3. Si
      la réponse n’est pas dans le document, écris : <Cs>« Information absente du document. »</Cs> N’essaie pas de deviner.{'\n\n'}
      <Ck>Question · </Ck>
      <Cc>[question du conseiller]</Cc>
    </CodeDark>
    <Tabs initial="in" cls={A.right} style={{ position: 'absolute', left: 810, top: 262, width: 990, ...dl(200) }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <TabBtn id="in" icon="checkCircle" tone="green">
          Question couverte
        </TabBtn>
        <TabBtn id="out" icon="alert" tone="coral">
          Question non couverte
        </TabBtn>
      </div>
      <TabPane id="in">
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Bubble who="human" name="Conseiller" size={23}>
            Un client a un four sous garantie qui affiche l’erreur E3. Que faire ?
          </Bubble>
          <Bubble who="agent" name="Assistant" size={23}>
            L’erreur E3 indique une sonde de température défaillante <Tag tone="blue" size={16}>§ 4.2 Codes erreur</Tag>. Sous garantie, on programme un
            technicien sous 72 h <Tag tone="blue" size={16}>§ 2.1 Interventions</Tag>. Ne pas proposer de réinitialisation : elle ne corrige pas E3{' '}
            <Tag tone="blue" size={16}>§ 4.2</Tag>.
          </Bubble>
        </div>
      </TabPane>
      <TabPane id="out">
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Bubble who="human" name="Conseiller" size={23}>
            Le client peut-il faire réparer son four par un réparateur indépendant sans perdre la garantie ?
          </Bubble>
          <Bubble who="agent" name="Assistant" size={23}>
            Information absente du document. Les procédures SAV ne traitent pas des réparateurs indépendants. Je vous suggère de poser la question au
            service juridique.
          </Bubble>
          <Callout title="C’est une bonne réponse" tone="green" icon="thumbUp" size={22}>
            « Je ne sais pas » vaut mieux qu’une règle de garantie inventée.
          </Callout>
        </div>
      </TabPane>
    </Tabs>
  </Frame>
);

// ─── La fiche de connaissance idéale ────────────────────────────────────────
const M5FL = ({ label, tone, children }: { label: string; tone: Tone; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 16, padding: '9px 0', borderBottom: `1.5px solid ${C.rule}` }}>
    <span style={{ width: 210, flex: 'none', paddingTop: 3, fontFamily: display, fontWeight: 700, fontSize: 16, letterSpacing: '0.08em', textTransform: 'uppercase', color: T[tone].fg }}>{label}</span>
    <span style={{ fontSize: 22, lineHeight: 1.4, color: C.ink }}>{children}</span>
  </div>
);

const M5_Fiche: Page = () => (
  <Frame mod={5}>
    <Title>La fiche de connaissance : un format pour toutes</Title>
    <Lede>Le même gabarit pour chaque fiche : l’IA le remplit, le référent le valide, tout le monde le retrouve.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1100, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 34px', ...dl(100) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
        <IconTile name="book" tone="teal" size={46} solid />
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>KB-042 · Livraison à l’étage</span>
      </div>
      <M5FL label="Question client" tone="blue">
        « Le livreur peut-il monter mon lave-linge au 4e sans ascenseur ? »
      </M5FL>
      <M5FL label="Réponse courte" tone="violet">
        Oui, avec l’option « livraison en étage » (29 €), à choisir avant l’expédition.
      </M5FL>
      <M5FL label="Conditions" tone="yellow">
        Escalier praticable ; jusqu’au 6e étage ; produits de plus de 30 kg uniquement.
      </M5FL>
      <M5FL label="Mots-clés" tone="teal">
        étage, escalier, monter, porter, installation
      </M5FL>
      <M5FL label="Source" tone="navy">
        Conditions de livraison, § 3.4
      </M5FL>
      <M5FL label="Mise à jour" tone="green">
        12/10/2026 · validée par S. Martin (référente qualité)
      </M5FL>
    </div>
    <div style={{ position: 'absolute', left: 1270, top: 262, width: 530, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="blue" icon="chat" title="Les mots du client" cls={A.right} style={dl(300)} size={22}>
        La question et les mots-clés sont écrits comme le client parle : on retrouve la fiche avec ses mots.
      </Card>
      <Card tone="green" icon="calendar" title="Daté et signé" cls={A.right} style={dl(450)} size={22}>
        Une fiche sans date ni responsable finit par mentir. Prévoyez une révision régulière.
      </Card>
    </div>
  </Frame>
);

// ─── Kit + atelier 4 ────────────────────────────────────────────────────────
const M5_Kit: Page = () => (
  <Frame mod={5} kind="atelier">
    <Title>Atelier 4 · la documentation à transformer</Title>
    <Lede>Extrait de la note interne « Garantie et SAV » de Nova Maison : dense, juste… et inutilisable pendant un appel.</Lede>
    <div
      className={A.in}
      style={{ position: 'absolute', left: 120, top: 262, width: 1680, boxSizing: 'border-box', background: '#FBFBF8', borderRadius: 14, boxShadow: `inset 0 0 0 1.5px ${C.rule}`, padding: '26px 36px', fontFamily: 'Georgia, serif', fontSize: 22, lineHeight: 1.62, color: C.soft, ...dl(100) }}
    >
      <div style={{ fontWeight: 700, color: C.ink, marginBottom: 8 }}>Note interne SAV-07 · Garantie, pannes et interventions (v3)</div>
      Tous les appareils électroménagers bénéficient de la garantie légale de conformité de deux ans à compter de la livraison. Toute panne constatée
      dans les 14 jours suivant la livraison donne lieu à un échange standard sans diagnostic préalable, l’enlèvement étant pris en charge. Au-delà, le
      conseiller oriente d’abord le client vers le guide de dépannage (codes erreur, réinitialisation), sauf code E3, E7 ou F2 qui nécessitent
      systématiquement un technicien. Les interventions sous garantie sont planifiées sous 72 h ouvrées, sur créneau de 2 h ; un SMS est envoyé la
      veille. En cas de seconde intervention infructueuse sur le même appareil, l’échange est proposé, sous validation du superviseur. Toute situation
      présentant un risque (fumée, étincelles, odeur de brûlé, fuite importante) impose une consigne de mise hors tension immédiate et une intervention
      prioritaire sous 24 h. Les appareils hors garantie font l’objet d’un devis (déplacement 49 €, déductible en cas de réparation). L’extension de
      garantie, si souscrite, prolonge les mêmes conditions de trois ans.
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 870, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(600) }}>
      <Icon name="eye" size={24} color={C.violet} />
      Neuf règles cachées dans un seul paragraphe. Combien en trouvez-vous à la première lecture ?
    </div>
  </Frame>
);

const M5_Atelier: Page = () => (
  <LabPage
    mod={5}
    n="4"
    title="Transformer une documentation en base de réponses"
    defi="connaissances"
    who="En binôme · 15 min"
    minutes={15}
    objective={
      <>
        À partir de la note SAV-07, produire avec l’IA une <strong>mini-base de connaissances</strong> utilisable pendant un appel.
      </>
    }
    where={
      <>
        Une FAQ de 6 questions client
        <br />
        Un arbre de décision « panne »
        <br />
        Une fiche de connaissance complète
      </>
    }
    crit={
      <>
        <CheckItem id="a4-1" size={21}>
          Les 9 règles de la note retrouvées
        </CheckItem>
        <CheckItem id="a4-2" size={21}>
          Questions écrites avec les mots du client
        </CheckItem>
        <CheckItem id="a4-3" size={21}>
          Chaque branche de l’arbre se termine par une action
        </CheckItem>
        <CheckItem id="a4-4" size={21}>
          Rien d’ajouté qui ne soit dans la note
        </CheckItem>
      </>
    }
  >
    <strong>1.</strong> Demandez à l’IA de lister toutes les règles de la note (numérotées). <strong>2.</strong> Générez la FAQ (6 questions).{' '}
    <strong>3.</strong> Générez l’arbre de décision « panne ». <strong>4.</strong> Remplissez une fiche au format KB. <strong>5.</strong> Testez :
    posez à l’IA une question hors note, avec la règle « réponds seulement à partir du document ».
    <Bonus>Demandez un script téléphonique pour le cas « code E3 » et faites-le jouer à votre binôme.</Bonus>
  </LabPage>
);

// ─── Quiz ───────────────────────────────────────────────────────────────────
const M5_Quiz: Page = () => (
  <Frame mod={5} kind="quiz">
    <Title>Quiz : la base de connaissances</Title>
    <QuizSeries y={220}>
      <QuizQ q="Vous posez une question absente de la documentation fournie. La meilleure réponse de l’IA est…" explain="Avec la règle « uniquement à partir du document », l’IA doit signaler l’absence d’information. Une réponse inventée serait diffusée à tous les clients.">
        <QOpt>Une réponse générale tirée de ses connaissances</QOpt>
        <QOpt ok>« Information absente du document. »</QOpt>
        <QOpt>La règle la plus probable dans le secteur</QOpt>
      </QuizQ>
      <QuizQ q="Pourquoi écrire les questions de la FAQ avec les mots des clients ?" explain="Le conseiller et le client cherchent avec leurs propres mots (« mon colis », pas « litige transporteur ») : la fiche doit être trouvable avec ces mots.">
        <QOpt>Pour faire plus sympathique</QOpt>
        <QOpt ok>Pour qu’on retrouve la fiche avec les mots qu’on tape vraiment</QOpt>
        <QOpt>Parce que l’IA ne comprend pas le vocabulaire métier</QOpt>
      </QuizQ>
      <QuizQ q="Qu’est-ce qui rend une fiche de connaissance fiable dans le temps ?" explain="Une source, une date et un responsable : on sait d’où vient l’information, quand elle a été vérifiée, et qui la met à jour.">
        <QOpt>Sa longueur</QOpt>
        <QOpt>Le fait qu’elle ait été générée par l’IA</QOpt>
        <QOpt ok>Sa source, sa date de mise à jour et son responsable</QOpt>
      </QuizQ>
      <QuizQ q="Un arbre de décision bien construit…" explain="Une question fermée par étape (oui / non), et chaque branche se termine par une action concrète. Sinon, le conseiller reste bloqué au milieu.">
        <QOpt ok>Pose des questions fermées et finit toujours par une action</QOpt>
        <QOpt>Contient toutes les exceptions possibles</QOpt>
        <QOpt>Remplace la procédure écrite</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M5_Synthese: Page = () => (
  <Frame mod={5} kind="synthese">
    <Title>Module 5 · ce qu’il faut retenir</Title>
    <div style={{ position: 'absolute', left: 120, top: 210, width: 1680, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <SynthRow n={1} tone="blue">
        Une base de connaissances = <strong>une seule vérité</strong>, trouvable en quelques secondes par tous.
      </SynthRow>
      <SynthRow n={2} tone="teal">
        Les vraies questions fréquentes sont <strong>dans vos messages</strong> : l’IA les regroupe et les compte.
      </SynthRow>
      <SynthRow n={3} tone="violet">
        FAQ, procédures, scripts, arbres : l’IA <strong>transforme le format</strong>, jamais le fond.
      </SynthRow>
      <SynthRow n={4} tone="yellow">
        Recherche : « <strong>seulement à partir du document</strong>, cite la section, sinon dis-le ».
      </SynthRow>
      <SynthRow n={5} tone="green">
        Chaque fiche a une <strong>source, une date et un responsable</strong>, et elle est validée avant publication.
      </SynthRow>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(1000) }}>
      <Icon name="note" size={24} color={C.violet} />
      Dans votre document : le prompt de recherche documentaire et le gabarit de fiche KB.
    </div>
  </Frame>
);

// ═══ 60-m6 ═════════════════════════════════════════════════════════════

// ─── Module 6 · Analyser les interactions clients ──────────────────────────

const M6_Section: Page = () => (
  <Section
    n={6}
    title={
      <>
        Analyser les
        <br />
        interactions clients
      </>
    }
    sub="Des milliers d’échanges racontent ce qui ne va pas : l’IA les lit tous, fait ressortir les tendances, et vous aide à proposer des améliorations."
    dur="15:35 – 16:25 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 5 · conversations → analyse IA → tendances → recommandations
      </Tag>
    }
  >
    <SecItem n={1}>Synthèse d’appels et analyse des conversations</SecItem>
    <SecItem n={2}>Identifier les motifs de contact</SecItem>
    <SecItem n={3}>Analyser les réclamations et les problèmes récurrents</SecItem>
    <SecItem n={4}>Produire un reporting</SecItem>
    <SecItem n={5}>Identifier des pistes d’amélioration</SecItem>
  </Section>
);
M6_Section.transition = BLOOM;

// ─── Synthèse d’appel ───────────────────────────────────────────────────────
const M6Tr = ({ who, children }: { who: 'C' | 'K'; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 12, fontSize: 20, lineHeight: 1.45 }}>
    <span style={{ width: 92, flex: 'none', fontFamily: mono, fontSize: 17, paddingTop: 2, color: who === 'C' ? C.coral : C.blue }}>{who === 'C' ? 'CLIENT' : 'CONSEIL.'}</span>
    <span style={{ color: C.soft }}>{children}</span>
  </div>
);

const M6_SyntheseAppel: Page = () => (
  <Frame mod={6} beats={2}>
    <Title>La synthèse d’appel : 8 minutes, 6 lignes</Title>
    <Lede>La transcription est longue et répétitive. L’IA en tire la fiche à coller dans l’outil client. → génère la synthèse.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 820, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 10, ...dl(100) }}>
      <Eyebrow c={C.muted} size={17}>
        Transcription · appel du 13/10 · 8 min 12 s (extrait)
      </Eyebrow>
      <M6Tr who="C">Oui bonjour, c’est pour ma commande de canapé, enfin, d’angle, le gris…</M6Tr>
      <M6Tr who="K">Je vous écoute, vous avez votre numéro de commande ?</M6Tr>
      <M6Tr who="C">Euh attendez… NM-52210. Il devait arriver hier, j’ai attendu toute la journée.</M6Tr>
      <M6Tr who="K">Je vois, le transporteur indique un échec de livraison, adresse incomplète.</M6Tr>
      <M6Tr who="C">Incomplète ? Il manque le bâtiment B, c’est vrai… mais personne ne m’a appelé !</M6Tr>
      <M6Tr who="K">Je comprends. Je corrige l’adresse et je vous propose jeudi ou samedi matin.</M6Tr>
      <M6Tr who="C">Samedi. Et je veux être appelé une heure avant cette fois.</M6Tr>
      <M6Tr who="K">C’est noté : samedi 8 h–12 h, appel une heure avant.</M6Tr>
      <div style={{ fontSize: 19, color: C.faint, fontStyle: 'italic' }}>[… 6 minutes de plus …]</div>
    </div>
    <div style={{ position: 'absolute', left: 1000, top: 262, width: 800, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className={b.on(1)} style={{ boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <IconTile name="note" tone="violet" size={42} solid />
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: C.navy }}>Synthèse · NM-52210</span>
        </div>
        <M2Row label="Motif" value="Livraison · échec (adresse incomplète)" tone="blue" d={0} />
        <M2Row label="Cause" value="Bâtiment B absent de l’adresse" tone="yellow" d={0} />
        <M2Row label="Action" value="Adresse corrigée · relivraison samedi 8 h–12 h" tone="green" d={0} />
        <M2Row label="Engagement" value="Appel du livreur 1 h avant" tone="violet" d={0} />
        <M2Row label="Émotion" value="Agacé → apaisé en fin d’appel" tone="coral" d={0} />
        <M2Row label="Résolu ?" value="Oui, au 1er contact" tone="teal" d={0} />
      </div>
      <div className={b.on(2)}>
        <Callout title="Le vrai gain" tone="green" icon="clock" size={22}>
          Moins de saisie après l’appel, et des fiches toutes au même format : elles deviennent analysables en masse.
        </Callout>
      </div>
    </div>
  </Frame>
);

// ─── Le pipeline d’analyse ──────────────────────────────────────────────────
const M6Stage = ({ n, icon, tone, title, children }: { n: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ width: 360, flex: 'none', background: C.card, borderRadius: 20, boxShadow: `${SHADOW}, inset 0 -6px 0 ${STRONG[tone]}`, padding: '22px 24px 26px' }}>
    <IconTile name={icon} tone={tone} size={60} solid />
    <div style={{ marginTop: 14, fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 21, lineHeight: 1.42, color: C.soft }}>{children}</div>
  </div>
);

const M6_Pipeline: Page = () => (
  <Frame mod={6} beats={4}>
    <Title>De mille conversations à trois décisions</Title>
    <Lede>Le chemin de l’atelier 5, et de tout bon reporting. → déroule le pipeline.</Lede>
    <svg width={1680} height={60} style={{ position: 'absolute', left: 120, top: 300 }} aria-hidden>
      <path d="M 180 30 H 1500" stroke={C.rule} strokeWidth={4} strokeDasharray="8 10" className={A.march} />
      <FlowDot path="M 180 30 H 1500" dur={3.6} r={9} color={C.violet} />
    </svg>
    <div style={{ position: 'absolute', left: 120, top: 380, width: 1680, display: 'flex', justifyContent: 'space-between' }}>
      <M6Stage n={1} icon="inbox" tone="blue" title="Conversations">
        Emails, chats, synthèses d’appels, avis : anonymisés, sur une période.
      </M6Stage>
      <M6Stage n={2} icon="sparkles" tone="violet" title="Analyse IA">
        Chaque échange classé : motif, émotion, résolu ou non, irritant.
      </M6Stage>
      <M6Stage n={3} icon="trend" tone="teal" title="Tendances">
        Ce qui revient, ce qui monte, ce qui fâche le plus.
      </M6Stage>
      <M6Stage n={4} icon="target" tone="green" title="Recommandations">
        Des actions concrètes, avec un responsable et un indicateur.
      </M6Stage>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 790, width: 1680, ...dl(600) }}>
      <Callout title="Répartition des rôles" tone="yellow" icon="table" size={23}>
        L’IA <strong>lit et classe</strong> ; le tableur <strong>compte</strong> ; l’humain <strong>interprète et décide</strong>. Ne demandez pas à
        l’IA de faire des additions sur 1 000 lignes.
      </Callout>
    </div>
  </Frame>
);

// ─── Motifs de contact ──────────────────────────────────────────────────────
const M6Bar = ({ n, label, pct, w, tone }: { n: number; label: string; pct: string; w: number; tone: Tone }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
    <span style={{ width: 380, flex: 'none', fontSize: 24, fontWeight: 600, color: C.ink, textAlign: 'right' }}>{label}</span>
    <div style={{ flex: 1, height: 52, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div className={b.grow(n)} style={{ width: w, height: 52, background: STRONG[tone], borderRadius: 10, ...dl(0) }} />
      <span className={b.fade(n)} style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: tone === 'grey' ? C.muted : STRONG[tone], ...dl(400) }}>
        {pct}
      </span>
    </div>
  </div>
);

const M6_Motifs: Page = () => (
  <Frame mod={6} beats={1}>
    <Title>Les motifs de contact : pourquoi on nous sollicite</Title>
    <Lede>Semaine 41 · 2 812 contacts de Nova Maison classés par l’IA (données fictives). → affiche la répartition.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', flexDirection: 'column', gap: 20, ...dl(100) }}>
      <M6Bar n={1} label="Suivi de livraison" pct="38 %" w={760} tone="blue" />
      <M6Bar n={1} label="Retour / remboursement" pct="21 %" w={420} tone="grey" />
      <M6Bar n={1} label="Panne / SAV" pct="17 %" w={340} tone="grey" />
      <M6Bar n={1} label="Modification de commande" pct="11 %" w={220} tone="grey" />
      <M6Bar n={1} label="Facturation" pct="8 %" w={160} tone="grey" />
      <M6Bar n={1} label="Autre" pct="5 %" w={100} tone="grey" />
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 520, top: 790, width: 1280, ...dl(900) }}>
      <Callout title="La question à se poser" tone="blue" icon="search" size={24}>
        Parmi ces contacts, lesquels auraient pu être <strong>évités</strong> par une meilleure information envoyée au bon moment ?
      </Callout>
    </div>
  </Frame>
);

// ─── Grand chiffre ──────────────────────────────────────────────────────────
const M6_BigNumber: Page = () => (
  <Frame mod={6}>
    <div className={A.pop} style={{ position: 'absolute', left: 120, top: 150, fontFamily: display, fontWeight: 800, fontSize: 400, lineHeight: 1, letterSpacing: '-0.04em', color: C.electric, ...dl(100) }}>
      <CountUp to={38} suffix=" %" dur={1400} delay={200} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 130, top: 600, width: 1300, ...dl(700) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 58, lineHeight: 1.15, color: C.navy }}>
        des contacts posent la même question :<br />
        <span style={{ color: C.violet, whiteSpace: 'nowrap' }}>« Où est mon colis ? »</span>
      </div>
      <div style={{ marginTop: 22, fontSize: 28, lineHeight: 1.45, color: C.soft }}>
        Plus d’un contact sur trois. Un SMS de suivi envoyé automatiquement à chaque étape pourrait en éviter une grande partie.
      </div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 130, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(1200) }}>
      <Icon name="table" size={22} color={C.muted} /> Nova Maison, semaine 41 · données fictives de formation
    </div>
    <Outline x={1500} y={160} w={300} h={300} r={60} color={C.violet} cls={A.fade} />
    <Outline x={1580} y={240} w={300} h={300} r={60} cls={A.fade} />
  </Frame>
);

// ─── Analyse des réclamations : irritants ───────────────────────────────────
const M6Irr = ({ n, rank, title, count, verb, tone }: { n: number; rank: number; title: string; count: number; verb: string; tone: Tone }) => (
  <div className={b.left(n)} style={{ display: 'flex', alignItems: 'center', gap: 22, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 7px 0 0 ${STRONG[tone]}`, padding: '18px 26px 18px 30px' }}>
    <span style={{ fontFamily: display, fontWeight: 800, fontSize: 52, color: STRONG[tone], width: 60 }}>{rank}</span>
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 22, fontStyle: 'italic', color: C.soft }}>« {verb} »</div>
    </div>
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: C.ink }}>{count}</div>
      <div style={{ fontSize: 18, color: C.muted }}>réclamations</div>
    </div>
  </div>
);

const M6_Irritants: Page = () => (
  <Frame mod={6} beats={4}>
    <Title>Analyser les réclamations : le top 3 des irritants</Title>
    <Lede>312 réclamations du mois, chacune résumée en un irritant par l’IA, puis regroupées. → du 3e au 1er.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', flexDirection: 'column-reverse', gap: 16 }}>
      <M6Irr n={3} rank={1} title="Personne ne me rappelle" count={96} verb="On m’a promis un rappel, j’attends toujours depuis jeudi." tone="coral" />
      <M6Irr n={2} rank={2} title="Créneau de livraison non respecté" count={71} verb="J’ai posé ma journée et le livreur est passé à 19 h." tone="yellow" />
      <M6Irr n={1} rank={3} title="Remboursement jugé trop lent" count={58} verb="Trois semaines pour un remboursement, c’est abusé." tone="blue" />
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 760, width: 1680 }}>
      <Callout title="Lecture" tone="violet" icon="bulb" size={24}>
        L’irritant n° 1 n’est pas un produit : c’est une <strong>promesse non tenue</strong> par le service client lui-même. Bonne nouvelle : c’est
        celui qu’on maîtrise le mieux.
      </Callout>
    </div>
  </Frame>
);

// ─── Problème récurrent : la courbe qui décroche ────────────────────────────
const M6_Recurrent: Page = () => {
  const xs = [90, 260, 430, 600, 770, 940, 1110];
  const vs = [4, 5, 3, 6, 5, 18, 27];
  const y = (v: number) => 420 - v * 13;
  const d = xs.map((x, i) => `${i ? 'L' : 'M'} ${x} ${y(vs[i])}`).join(' ');
  return (
    <Frame mod={6} beats={2}>
      <Title>Détecter un problème récurrent avant qu’il n’explose</Title>
      <Lede>Contacts mentionnant « fuite » + « lave-linge Aquaflow 8 », par semaine. → trace la courbe, puis l’alerte.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1200, height: 560, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, ...dl(100) }}>
        <svg width={1200} height={540} viewBox="0 0 1200 540" style={{ display: 'block', marginTop: 10 }}>
          <line x1={60} x2={1150} y1={420} y2={420} stroke={C.rule} strokeWidth={2} />
          <line x1={60} x2={1150} y1={290} y2={290} stroke={C.rule} strokeWidth={1.5} strokeDasharray="6 8" />
          <text x={1150} y={280} textAnchor="end" fontSize={18} fill={C.muted} fontFamily="Open Sans, sans-serif">
            seuil d’alerte : 10 / semaine
          </text>
          {xs.map((x, i) => (
            <text key={x} x={x} y={460} textAnchor="middle" fontSize={20} fill={C.muted} fontFamily="Open Sans, sans-serif">
              S{35 + i}
            </text>
          ))}
          <path d={d} fill="none" stroke={C.blue} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" pathLength={1} className={b.draw(1)} />
          {xs.map((x, i) => (
            <circle key={x} cx={x} cy={y(vs[i])} r={i >= 5 ? 10 : 7} fill={i >= 5 ? C.coral : C.blue} className={b.fade(1)} style={dl(600 + i * 60)} />
          ))}
          <text x={1110} y={y(27) - 22} textAnchor="end" fontSize={26} fontWeight={700} fill={C.coral} fontFamily="Montserrat, sans-serif" className={b.fade(1)} style={dl(1000)}>
            27 contacts
          </text>
        </svg>
      </div>
      <div style={{ position: 'absolute', left: 1370, top: 262, width: 430, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className={b.on(2)} style={{ background: T.coral.bg, borderRadius: 18, boxShadow: `inset 0 0 0 2.5px ${C.coral}`, padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="bell" size={28} color={C.coral} />
            <span style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: T.coral.fg }}>Alerte · S41</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 21, lineHeight: 1.45, color: C.ink }}>
            Hausse ×5 en 2 semaines. Point commun relevé par l’IA dans les verbatims : <strong>joint de hublot</strong>, lot livré fin septembre.
          </div>
        </div>
        <Card tone="green" icon="send" title="Action" cls={b.on(2)} size={21}>
          Alerte qualité au fournisseur ; fiche KB « fuite Aquaflow » pour les conseillers ; contact proactif des acheteurs du lot.
        </Card>
      </div>
    </Frame>
  );
};

// ─── Reporting ──────────────────────────────────────────────────────────────
const M6Kpi = ({ label, value, delta, good, d }: { label: string; value: ReactNode; delta: string; good: boolean; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 22px', ...dl(d) }}>
    <Eyebrow c={C.muted} size={16}>
      {label}
    </Eyebrow>
    <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 52, lineHeight: 1.05, color: C.navy }}>{value}</div>
    <div style={{ marginTop: 4, fontSize: 20, fontWeight: 700, color: good ? C.green : C.coral }}>{delta}</div>
  </div>
);

const M6_Reporting: Page = () => (
  <Frame mod={6} kind="demo">
    <Title>Produire un reporting : les chiffres, puis le récit</Title>
    <Lede>Le tableur calcule les indicateurs ; l’IA rédige la synthèse hebdomadaire pour l’équipe et la direction.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', gap: 20 }}>
      <M6Kpi label="Contacts" value={<CountUp to={2812} />} delta="▲ 6 % vs S40" good={false} d={100} />
      <M6Kpi label="1re réponse" value={<CountUp to={19} suffix=" h" />} delta="▼ 3 h vs S40" good d={200} />
      <M6Kpi label="Résolu au 1er contact" value={<CountUp to={71} suffix=" %" />} delta="▲ 4 pts" good d={300} />
      <M6Kpi label="Satisfaction" value={<CountUp to={3.9} digits={1} suffix=" / 5" />} delta="▼ 0,1 pt" good={false} d={400} />
    </div>
    <CodeDark size={19} wrap cls={A.in} style={{ position: 'absolute', left: 120, top: 470, width: 760, height: 470, ...dl(500) }}>
      <Ck>Prompt · </Ck>À partir de ces indicateurs et du top des motifs et irritants, rédige la synthèse hebdomadaire du service client :{'\n'}- 3
      faits marquants, chiffrés{'\n'}- 1 signal faible à surveiller{'\n'}- 3 recommandations, chacune avec un responsable proposé{'\n\n'}Ton factuel,
      10 lignes maximum. N’invente aucun chiffre : utilise uniquement ceux fournis.{'\n\n'}
      <Cc>[indicateurs S41] [top motifs] [top irritants]</Cc>
    </CodeDark>
    <div className={A.right} style={{ position: 'absolute', left: 930, top: 470, width: 870, height: 470, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 30px', fontSize: 21, lineHeight: 1.5, color: C.ink, ...dl(650) }}>
      <Eyebrow c={C.violet} size={17} style={{ marginBottom: 6 }}>
        Synthèse S41 · générée, puis relue
      </Eyebrow>
      <strong>Faits marquants.</strong> Volume en hausse (+6 %), porté par le suivi de livraison (38 %). Délai de 1re réponse amélioré (19 h). Résolution au
      1er contact à 71 % (+4 pts).
      <br />
      <strong>Signal faible.</strong> Fuites sur lave-linge Aquaflow 8 : 27 contacts en S41 (×5).
      <br />
      <strong>Recommandations.</strong> 1. SMS de suivi automatique (resp. logistique). 2. Rappels promis tracés dans l’outil (resp. superviseurs).
      3. Alerte qualité Aquaflow (resp. achats).
    </div>
  </Frame>
);

// ─── Pistes d’amélioration ──────────────────────────────────────────────────
const M6Row = ({ n, irr, cause, action, owner, kpi }: { n: number; irr: string; cause: string; action: string; owner: string; kpi: string }) => (
  <div className={b.left(n)} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 22px' }}>
    <M2Cell w={300} tone="coral">
      {irr}
    </M2Cell>
    <M2Cell w={300}>{cause}</M2Cell>
    <M2Cell w={420}>{action}</M2Cell>
    <M2Cell w={220}>{owner}</M2Cell>
    <M2Cell w={300} tone="green">
      {kpi}
    </M2Cell>
  </div>
);

const M6_Pistes: Page = () => (
  <Frame mod={6} beats={3}>
    <Title>Des irritants aux pistes d’amélioration</Title>
    <Lede>« Pour chaque irritant : cause probable, action, responsable, indicateur. » → une ligne par irritant.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 18, padding: '0 22px' }}>
        <M2Head w={300}>Irritant</M2Head>
        <M2Head w={300}>Cause probable</M2Head>
        <M2Head w={420}>Action proposée</M2Head>
        <M2Head w={220}>Responsable</M2Head>
        <M2Head w={300}>Indicateur</M2Head>
      </div>
      <M6Row n={1} irr="Personne ne me rappelle" cause="Rappels notés sur papier, non suivis" action="Tâche de rappel datée dans l’outil, alerte à J+1" owner="Superviseurs" kpi="% de rappels tenus à J+1" />
      <M6Row n={2} irr="Créneau non respecté" cause="Créneaux de 4 h, pas d’appel préalable" action="Appel ou SMS du livreur 1 h avant" owner="Logistique" kpi="Réclamations « créneau » / sem." />
      <M6Row n={3} irr="Remboursement trop lent" cause="Contrôle des retours en file unique" action="Contrôle prioritaire des retours < 200 €" owner="Entrepôt" kpi="Délai moyen de remboursement" />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(500) }}>
      <Callout title="L’IA propose, l’équipe décide" tone="blue" icon="users" size={24}>
        Les causes sont des <strong>hypothèses</strong> : on les vérifie avec les équipes concernées avant de lancer l’action. Et on mesure, pour savoir
        si ça a marché.
      </Callout>
    </div>
  </Frame>
);

// ─── Atelier 5 : kit + consignes ────────────────────────────────────────────
const M6V = ({ ch, children, d }: { ch: IconName; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '10px 16px', fontSize: 19, lineHeight: 1.4, color: C.ink, ...dl(d) }}>
    <Icon name={ch} size={22} color={C.muted} style={{ marginTop: 2 }} />
    <span>{children}</span>
  </div>
);

const M6_Kit: Page = () => (
  <Frame mod={6} kind="atelier">
    <Title>Atelier 5 · un extrait des 40 conversations du kit</Title>
    <Lede>Conversations anonymisées de la semaine 42. Le kit complet est dans vos documents.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
      <M6V ch="mail" d={100}>« Livraison prévue mardi, toujours rien jeudi. Aucun SMS. »</M6V>
      <M6V ch="chat" d={140}>« Le lave-linge fuit par le hublot, il a 3 semaines. »</M6V>
      <M6V ch="phone" d={180}>« On devait me rappeler lundi pour le remboursement… »</M6V>
      <M6V ch="megaphone" d={220}>« Livreur adorable, il a même repris les cartons 👍 »</M6V>
      <M6V ch="mail" d={260}>« Facture introuvable dans mon espace client. »</M6V>
      <M6V ch="chat" d={300}>« Encore une fuite sur mon Aquaflow, c’est un défaut de série ? »</M6V>
      <M6V ch="phone" d={340}>« 3e appel, toujours pas de rappel du SAV. »</M6V>
      <M6V ch="mail" d={380}>« Où en est mon colis ? Le lien de suivi ne marche pas. »</M6V>
      <M6V ch="form" d={420}>« Je souhaite annuler, la date est trop lointaine. »</M6V>
      <M6V ch="chat" d={460}>« Merci Inès, problème réglé en 5 minutes ! »</M6V>
      <M6V ch="mail" d={500}>« Remboursement reçu après 22 jours. Trop long. »</M6V>
      <M6V ch="phone" d={540}>« Le technicien n’avait pas la pièce, il faut revenir. »</M6V>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(800) }}>
      <Callout title="Pensez aussi au positif" tone="green" icon="thumbUp" size={23}>
        Les remerciements disent ce qui marche : à garder, à généraliser, à valoriser auprès de l’équipe.
      </Callout>
    </div>
  </Frame>
);

const M6_Atelier: Page = () => (
  <LabPage
    mod={6}
    n="5"
    title="Des conversations aux recommandations"
    defi="interactions"
    who="En binôme · 15 min"
    minutes={15}
    objective={
      <>
        Analyser les 40 conversations du kit avec l’IA et produire une <strong>synthèse d’une page</strong> : motifs, irritants, signal faible,
        trois recommandations.
      </>
    }
    where={
      <>
        Le tableau de classement (40 lignes)
        <br />
        Top 3 motifs + top 3 irritants
        <br />
        3 recommandations argumentées
      </>
    }
    crit={
      <>
        <CheckItem id="a5-1" size={21}>
          Catégories fermées, appliquées partout
        </CheckItem>
        <CheckItem id="a5-2" size={21}>
          Comptages vérifiés (tableur ou à la main)
        </CheckItem>
        <CheckItem id="a5-3" size={21}>
          Le signal faible Aquaflow repéré
        </CheckItem>
        <CheckItem id="a5-4" size={21}>
          Chaque reco : action, responsable, indicateur
        </CheckItem>
      </>
    }
  >
    <strong>1.</strong> Faites classer chaque conversation dans un tableau : motif, émotion, résolu, irritant. <strong>2.</strong> Collez le tableau
    dans un tableur et comptez. <strong>3.</strong> Demandez à l’IA les tendances et un signal faible. <strong>4.</strong> Faites-lui proposer les
    recommandations, puis challengez-les : sont-elles réalistes chez vous ?
    <Bonus>Demandez la synthèse en deux versions : une pour l’équipe (concrète), une pour la direction (5 lignes).</Bonus>
  </LabPage>
);

// ─── Quiz ───────────────────────────────────────────────────────────────────
const M6_Quiz: Page = () => (
  <Frame mod={6} kind="quiz">
    <Title>Quiz : analyser les interactions</Title>
    <QuizSeries y={220}>
      <QuizQ q="Pour connaître le nombre exact de contacts par motif sur 1 000 conversations, on…" explain="L’IA classe très bien chaque conversation ; pour compter, un tableur est exact à coup sûr. Les additions de l’IA sur de gros volumes peuvent être fausses.">
        <QOpt>Demande le total directement à l’IA</QOpt>
        <QOpt ok>Fait classer par l’IA, puis compte avec un tableur</QOpt>
        <QOpt>Estime à l’œil</QOpt>
      </QuizQ>
      <QuizQ q="Avant d’envoyer 500 conversations à l’IA, il faut…" explain="Noms, emails, téléphones, adresses, numéros de commande : on anonymise, et on n’utilise que l’outil autorisé par l’entreprise.">
        <QOpt>Les traduire en anglais</QOpt>
        <QOpt>Les raccourcir à une phrase</QOpt>
        <QOpt ok>Les anonymiser et utiliser un outil autorisé</QOpt>
      </QuizQ>
      <QuizQ q="L’IA propose une cause à un irritant. C’est…" explain="Une hypothèse plausible, pas un constat. On la vérifie avec les équipes concernées avant d’agir, puis on mesure l’effet de l’action.">
        <QOpt>Un fait établi</QOpt>
        <QOpt ok>Une hypothèse à vérifier avec les équipes</QOpt>
        <QOpt>Inutile : seules les données comptent</QOpt>
      </QuizQ>
      <QuizQ q="Une bonne recommandation contient…" explain="Une action précise, un responsable et un indicateur : sans eux, la recommandation reste un vœu pieux.">
        <QOpt>Un constat bien formulé</QOpt>
        <QOpt ok>Une action, un responsable et un indicateur</QOpt>
        <QOpt>Un graphique</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M6_Synthese: Page = () => (
  <Frame mod={6} kind="synthese">
    <Title>Module 6 · ce qu’il faut retenir</Title>
    <div style={{ position: 'absolute', left: 120, top: 210, width: 1680, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <SynthRow n={1} tone="violet">
        Synthèses d’appel au <strong>même format</strong> : moins de saisie, et des données analysables en masse.
      </SynthRow>
      <SynthRow n={2} tone="blue">
        Conversations → <strong>analyse IA → tendances → recommandations</strong> ; l’IA classe, le tableur compte.
      </SynthRow>
      <SynthRow n={3} tone="teal">
        Les motifs révèlent les <strong>contacts évitables</strong> ; les irritants, les promesses non tenues.
      </SynthRow>
      <SynthRow n={4} tone="coral">
        Surveiller les <strong>signaux faibles</strong> : une courbe qui décroche vaut une alerte.
      </SynthRow>
      <SynthRow n={5} tone="green">
        Chaque recommandation : <strong>action, responsable, indicateur</strong>, et une cause vérifiée par l’équipe.
      </SynthRow>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(1000) }}>
      <Icon name="note" size={24} color={C.violet} />
      Dans votre document : le prompt de synthèse d’appel et le prompt de reporting hebdomadaire.
    </div>
  </Frame>
);

// ═══ 70-m7 ═════════════════════════════════════════════════════════════

// ─── Module 7 · Projet final et bonnes pratiques ───────────────────────────

const M7_Section: Page = () => (
  <Section
    n={7}
    title={
      <>
        Cas fil rouge
        <br />
        et bonnes pratiques
      </>
    }
    sub="Assembler tout ce qu’on a vu sur une demande traitée de bout en bout, et fixer les règles qui protègent vos clients… et vous."
    dur="16:25 – 17:15 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 6 · cas fil rouge de bout en bout
      </Tag>
    }
  >
    <SecItem n={1}>Demande → analyse → réponse → validation → suivi → satisfaction</SecItem>
    <SecItem n={2}>Confidentialité et données clients</SecItem>
    <SecItem n={3}>Contrôle humain : qui décide quoi</SecItem>
    <SecItem n={4}>Les limites de l’IA</SecItem>
    <SecItem n={5}>Votre charte de bonnes pratiques</SecItem>
  </Section>
);
M7_Section.transition = BLOOM;

// ─── Le parcours complet (onglets) ──────────────────────────────────────────
const M7Pane = ({ tone, title, ia, moi, children }: { tone: Tone; title: string; ia: ReactNode; moi: ReactNode; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 24, marginTop: 22 }}>
    <div style={{ flex: 1, minHeight: 470, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '26px 32px' }}>
      <Eyebrow c={T[tone].fg} size={18}>
        Mme Moreau · {title}
      </Eyebrow>
      <div style={{ marginTop: 12, fontSize: 24, lineHeight: 1.5, color: C.ink }}>{children}</div>
    </div>
    <div style={{ width: 560, flex: 'none', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ flex: 1, background: T.violet.bg, borderRadius: 18, padding: '20px 24px' }}>
        <PanelTitle icon="sparkles" c={T.violet.fg}>
          L’IA
        </PanelTitle>
        <div style={{ fontSize: 22, lineHeight: 1.45, color: C.ink }}>{ia}</div>
      </div>
      <div style={{ flex: 1, background: T.green.bg, borderRadius: 18, padding: '20px 24px' }}>
        <PanelTitle icon="humanCheck" c={T.green.fg}>
          Vous
        </PanelTitle>
        <div style={{ fontSize: 22, lineHeight: 1.45, color: C.ink }}>{moi}</div>
      </div>
    </div>
  </div>
);

const M7_Parcours: Page = () => (
  <Frame mod={7} kind="demo">
    <Title>Le parcours complet d’une demande, en six étapes</Title>
    <Lede>Retour sur Mme Moreau, de son email de lundi à son avis. Cliquez chaque étape.</Lede>
    <Tabs initial="1" cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, ...dl(100) }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <TabBtn id="1" icon="mail" tone="blue">
          1 · Demande
        </TabBtn>
        <TabBtn id="2" icon="search" tone="teal">
          2 · Analyse
        </TabBtn>
        <TabBtn id="3" icon="pen" tone="violet">
          3 · Réponse
        </TabBtn>
        <TabBtn id="4" icon="humanCheck" tone="pink">
          4 · Validation
        </TabBtn>
        <TabBtn id="5" icon="calendar" tone="yellow">
          5 · Suivi
        </TabBtn>
        <TabBtn id="6" icon="smile" tone="green">
          6 · Satisfaction
        </TabBtn>
      </div>
      <TabPane id="1">
        <M7Pane tone="blue" title="la demande" ia="Rien encore : le message arrive dans la file, avec l’historique du dossier." moi="Vous ouvrez le message et le dossier client, dans l’outil autorisé.">
          « Mon lave-linge est arrivé avec 6 jours de retard et il fuit dès le premier lavage ! C’est la deuxième fois que je vous écris et personne ne
          répond. Je veux une solution rapide, sinon j’annule tout et je laisse un avis. »
        </M7Pane>
      </TabPane>
      <TabPane id="2">
        <M7Pane tone="teal" title="l’analyse" ia="Remplit la fiche avec le prompt d’analyse : catégorie, intention, infos, urgence, émotion." moi="Vérifiez les faits dans le dossier : retard confirmé, 1er message bien resté sans réponse.">
          <strong>SAV · produit défectueux</strong> (+ retard) · Intention : solution rapide · NM-48213, lave-linge, fuite au 1er lavage, 2e contact ·{' '}
          <strong>P2</strong> (2e relance, menace d’avis) · Émotion : exaspération.
        </M7Pane>
      </TabPane>
      <TabPane id="3">
        <M7Pane tone="violet" title="la réponse" ia="Rédige le brouillon en 5 briques, à partir de la fiche et de la procédure garantie." moi="Choisissez la solution et le ton ; retirez tout engagement que vous ne pouvez pas tenir.">
          « Je suis sincèrement désolé : un retard de 6 jours, puis une fuite dès le premier lavage, et un premier message resté sans réponse. Je vous
          propose, au choix, l’échange de l’appareil ou un technicien sous 72 h… »
        </M7Pane>
      </TabPane>
      <TabPane id="4">
        <M7Pane tone="pink" title="la validation" ia="Peut relire l’orthographe et vérifier que chaque question a une réponse." moi="Les 4 vérifications : exact, complet, adapté, conforme. Puis vous envoyez, sous votre nom.">
          ✓ Nom et produit exacts · ✓ délai de 72 h conforme à la procédure garantie · ✓ ton empathique, sans « calmez-vous » · ✓ aucun geste hors
          délégation · <strong>→ envoyé lundi 9 h 05.</strong>
        </M7Pane>
      </TabPane>
      <TabPane id="5">
        <M7Pane tone="yellow" title="le suivi" ia="Rédige le message de suivi et la synthèse du dossier pour l’outil client." moi="Programmez la relance, vérifiez que l’intervention a bien eu lieu, clôturez le dossier.">
          Mme Moreau choisit « technicien ». Intervention jeudi : joint changé. <strong>Vendredi</strong>, message de suivi : « L’intervention d’hier
          a-t-elle bien réglé le problème ? Votre lave-linge fonctionne-t-il normalement ? »
        </M7Pane>
      </TabPane>
      <TabPane id="6">
        <M7Pane tone="green" title="la satisfaction" ia="Analyse le verbatim : émotion, points positifs, irritant restant ; l’ajoute au reporting." moi="Remontez l’irritant « 1er message sans réponse » : c’est lui qui a tout aggravé.">
          Enquête : <strong>4 / 5</strong>. « Le technicien était top et le conseiller très réactif. Dommage qu’il ait fallu écrire deux fois. »
        </M7Pane>
      </TabPane>
    </Tabs>
  </Frame>
);

// ─── Confidentialité : jeu de tri ───────────────────────────────────────────
const M7Zone = ({ x, tone, icon, label, sub }: { x: number; tone: Tone; icon: IconName; label: string; sub: string }) => (
  <div style={{ position: 'absolute', left: x, top: 250, width: 370, height: 640, boxSizing: 'border-box', borderRadius: 20, background: T[tone].bg, boxShadow: `inset 0 0 0 2.5px ${T[tone].bd}`, padding: '16px 20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Icon name={icon} size={28} color={T[tone].fg} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: T[tone].fg }}>{label}</span>
    </div>
    <div style={{ marginTop: 4, fontSize: 18, color: T[tone].fg, opacity: 0.8 }}>{sub}</div>
  </div>
);

const M7_Donnees: Page = () => (
  <Frame mod={7} kind="jeu" beats={1}>
    <Title>Confidentialité : que peut-on donner à l’IA ?</Title>
    <Lede>Même dans l’outil autorisé par l’entreprise. Glissez chaque donnée dans sa colonne ; → affiche le corrigé.</Lede>
    <M7Zone x={660} tone="green" icon="checkCircle" label="Utile, je peux" sub="nécessaire à la réponse" />
    <M7Zone x={1045} tone="yellow" icon="eyeOff" label="Je remplace" sub="par [CLIENT], [ADRESSE]…" />
    <M7Zone x={1430} tone="coral" icon="lock" label="Jamais" sub="aucune raison valable" />
    <Drag x={120} y={250} w={500} tone="grey" size={21}>
      La description de la panne
    </Drag>
    <Drag x={120} y={322} w={500} tone="grey" size={21}>
      Le nom et le prénom du client
    </Drag>
    <Drag x={120} y={394} w={500} tone="grey" size={21}>
      Le numéro de carte bancaire
    </Drag>
    <Drag x={120} y={466} w={500} tone="grey" size={21}>
      La procédure SAV interne
    </Drag>
    <Drag x={120} y={538} w={500} tone="grey" size={21}>
      L’adresse postale complète
    </Drag>
    <Drag x={120} y={610} w={500} tone="grey" size={21}>
      Un certificat médical joint au dossier
    </Drag>
    <Drag x={120} y={682} w={500} tone="grey" size={21}>
      La date de livraison
    </Drag>
    <Drag x={120} y={754} w={500} tone="grey" size={21}>
      L’email et le téléphone du client
    </Drag>
    <Drag x={120} y={826} w={500} tone="grey" size={21}>
      Le mot de passe de l’espace client
    </Drag>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 920, width: 1680, display: 'flex', gap: 12, zIndex: 25 }}>
      <Tag tone="green" size={18}>
        Utile : panne, procédure, date
      </Tag>
      <Tag tone="yellow" size={18}>
        Remplacer : nom, adresse, email / tél.
      </Tag>
      <Tag tone="coral" size={18}>
        Jamais : carte bancaire, certificat médical, mot de passe
      </Tag>
    </div>
  </Frame>
);

// ─── Anonymiser (interrupteur) ──────────────────────────────────────────────
const M7Pii = ({ on, real, ph }: { on: boolean; real: string; ph: string }) =>
  on ? (
    <span style={{ fontFamily: mono, fontSize: '0.86em', color: T.yellow.fg, background: T.yellow.bg, borderRadius: 6, padding: '1px 6px', boxShadow: `inset 0 0 0 1.5px ${T.yellow.bd}` }}>{ph}</span>
  ) : (
    <span style={{ background: 'rgba(224,72,72,.14)', borderRadius: 4, padding: '0 3px' }}>{real}</span>
  );

const M7_Anonymiser: Page = () => {
  const [on, set] = useState(false);
  return (
    <Frame mod={7} kind="demo">
      <Title>Anonymiser en dix secondes, avant de coller</Title>
      <Lede>Basculez l’interrupteur : l’IA a tout ce qu’il faut pour aider… sans savoir qui est la cliente.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, ...dl(100) }}>
        <Toggle on={on} onChange={set} label={on ? 'Version anonymisée : prête à coller' : 'Version brute : à ne pas coller telle quelle'} tone="yellow" size={27} />
      </div>
      <div
        className={A.in}
        style={{ position: 'absolute', left: 120, top: 350, width: 1100, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: on ? `0 0 0 3px ${C.yellow}, ${SHADOW}` : `0 0 0 3px ${C.coral}, ${SHADOW}`, padding: '28px 36px', fontSize: 25, lineHeight: 1.65, color: C.ink, transition: `box-shadow 400ms ${EASE}`, ...dl(200) }}
      >
        Bonjour, je suis <M7Pii on={on} real="Léa Moreau" ph="[CLIENTE]" />, j’habite <M7Pii on={on} real="14 rue des Lilas, 69003 Lyon" ph="[ADRESSE]" />.
        Mon lave-linge (commande <M7Pii on={on} real="NM-48213" ph="[COMMANDE]" />) est arrivé avec 6 jours de retard et il fuit dès le premier lavage.
        Vous pouvez me joindre au <M7Pii on={on} real="06 12 34 56 78" ph="[TÉL]" /> ou à <M7Pii on={on} real="lea.moreau@mail.fr" ph="[EMAIL]" />. Le
        prélèvement a été fait sur ma carte <M7Pii on={on} real="4974 •••• •••• 2291" ph="[SUPPRIMÉ]" />.
      </div>
      <div style={{ position: 'absolute', left: 1270, top: 350, width: 530, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Card tone="yellow" icon="eyeOff" title="Remplacer, pas supprimer" cls={A.right} style={dl(300)} size={22}>
          Les crochets gardent le sens : l’IA sait qu’il y a une adresse, sans la connaître. Vous remettez les vraies valeurs après.
        </Card>
        <Card tone="coral" icon="lock" title="Ce qui ne sert à rien part" cls={A.right} style={dl(450)} size={22}>
          La carte bancaire n’aide pas à répondre : elle est supprimée, pas remplacée.
        </Card>
        <Callout title="Règle d’entreprise" tone="blue" icon="shieldCheck" cls={A.right} style={dl(600)} size={21}>
          Outil autorisé, données minimales, et respect du RGPD : en cas de doute, demandez à votre référent.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Contrôle humain : qui décide quoi ──────────────────────────────────────
const M7Lvl = ({ n, tone, icon, title, sub, children }: { n: number; tone: Tone; icon: IconName; title: string; sub: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, borderTop: `8px solid ${STRONG[tone]}`, padding: '22px 26px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={56} solid />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.navy, lineHeight: 1.2 }}>{title}</div>
        <div style={{ fontSize: 19, color: T[tone].fg, fontWeight: 600 }}>{sub}</div>
      </div>
    </div>
    <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
  </div>
);

const M7_Controle: Page = () => (
  <Frame mod={7} beats={3}>
    <Title>Contrôle humain : trois niveaux, une règle claire</Title>
    <Lede>Plus l’enjeu pour le client est fort, plus l’humain est présent. → du moins au plus encadré.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 24 }}>
      <M7Lvl n={1} tone="teal" icon="sparkles" title="L’IA m’aide" sub="pour moi, rien ne part au client">
        <Bullet size={22} tone="teal">Résumer un dossier, un appel</Bullet>
        <Bullet size={22} tone="teal">Analyser une demande</Bullet>
        <Bullet size={22} tone="teal">Chercher dans la documentation (source vérifiée)</Bullet>
        <Bullet size={22} tone="teal">Classer des conversations pour un reporting</Bullet>
      </M7Lvl>
      <M7Lvl n={2} tone="yellow" icon="eye" title="Je valide" sub="relecture systématique avant envoi">
        <Bullet size={22} tone="yellow">Toute réponse envoyée à un client</Bullet>
        <Bullet size={22} tone="yellow">Toute réponse publique</Bullet>
        <Bullet size={22} tone="yellow">Toute traduction</Bullet>
        <Bullet size={22} tone="yellow">Tout modèle partagé à l’équipe</Bullet>
      </M7Lvl>
      <M7Lvl n={3} tone="coral" icon="humanCheck" title="Je décide" sub="l’IA ne fait que préparer">
        <Bullet size={22} tone="coral">Un geste commercial, un remboursement</Bullet>
        <Bullet size={22} tone="coral">Une exception à la procédure</Bullet>
        <Bullet size={22} tone="coral">Un client vulnérable, un litige</Bullet>
        <Bullet size={22} tone="coral">Mettre fin à un échange, escalader</Bullet>
      </M7Lvl>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 830, display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, color: C.navy, fontWeight: 600, ...dl(500) }}>
      <Icon name="shieldCheck" size={30} color={C.green} />
      Dans tous les cas : la réponse part sous votre nom, et c’est vous qui en êtes responsable.
    </div>
  </Frame>
);

// ─── Les limites de l’IA (et leurs parades) ─────────────────────────────────
const M7Lim = ({ icon, tone, title, parade }: { icon: IconName; tone: Tone; title: string; parade: ReactNode }) => (
  <FlipCard
    w={536}
    h={250}
    tone={tone}
    backTone="green"
    flipAt={1}
    front={
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconTile name={icon} tone={tone} size={60} solid />
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, lineHeight: 1.2, color: C.navy }}>{title}</div>
      </div>
    }
    back={
      <>
        <Eyebrow c={T.green.fg} size={18}>
          La parade
        </Eyebrow>
        <div style={{ marginTop: 10, fontSize: 24, lineHeight: 1.42, color: C.ink }}>{parade}</div>
      </>
    }
  />
);

const M7_Limites: Page = () => (
  <Frame mod={7} kind="exercice" beats={1}>
    <Title>Les limites de l’IA, et la parade pour chacune</Title>
    <Lede>Avant de retourner une carte, demandez au groupe : « Quelle parade avons-nous vue aujourd’hui ? » → retourne tout.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 536px)', gap: 36, ...dl(100) }}>
      <M7Lim icon="alert" tone="coral" title="Elle invente quand elle ne sait pas" parade="Fournir le contexte, « non précisé » plutôt qu’inventé, relire nom, dates, montants." />
      <M7Lim icon="calendar" tone="yellow" title="Elle n’est pas à jour" parade="Elle ignore vos derniers tarifs et procédures : base de connaissances datée, source citée." />
      <M7Lim icon="lock" tone="navy" title="Elle peut exposer des données" parade="Outil autorisé uniquement, données minimales, anonymisation avant de coller." />
      <M7Lim icon="eyeOff" tone="pink" title="Elle rate l’implicite et l’ironie" parade="Vous confirmez l’émotion et l’intention ; l’IA détecte, l’humain interprète." />
      <M7Lim icon="heart" tone="violet" title="Elle n’éprouve pas d’empathie" parade="Elle imite les mots ; la sincérité, la décision et le geste viennent de vous." />
      <M7Lim icon="brain" tone="teal" title="Elle peut nous rendre passifs" parade="Gardez la main : écrivez parfois sans elle, challengez ses propositions." />
    </div>
  </Frame>
);

// ─── Charte de bonnes pratiques ─────────────────────────────────────────────
const M7_Charte: Page = () => (
  <Frame mod={7} kind="exercice">
    <Title>Ma charte de l’IA en relation client</Title>
    <Lede>Dix règles à garder sous les yeux. Cochez celles que vous appliquez déjà ; les autres sont vos objectifs.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1180, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, ...dl(100) }}>
        <CheckItem id="ch1" size={22}>J’utilise uniquement l’outil autorisé</CheckItem>
        <CheckItem id="ch2" size={22}>Je ne colle que les données utiles</CheckItem>
        <CheckItem id="ch3" size={22}>J’anonymise avant de coller</CheckItem>
        <CheckItem id="ch4" size={22}>Je donne le contexte et la procédure</CheckItem>
        <CheckItem id="ch5" size={22}>Je relis chaque réponse en entier</CheckItem>
        <CheckItem id="ch6" size={22}>Je vérifie nom, dates, montants</CheckItem>
        <CheckItem id="ch7" size={22}>Aucun engagement hors procédure</CheckItem>
        <CheckItem id="ch8" size={22}>Je décide des gestes et exceptions</CheckItem>
        <CheckItem id="ch9" size={22}>Je signale les erreurs de l’IA</CheckItem>
        <CheckItem id="ch10" size={22}>Je partage mes bons prompts à l’équipe</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1350, top: 262, width: 450, ...dl(300) }}>
        <CheckScore
          max={10}
          label="Ma charte aujourd’hui"
          levels={[
            { min: 0, text: 'Choisissez 3 règles à appliquer dès demain.', tone: 'grey' },
            { min: 5, text: 'Bonne base : visez les 10 d’ici un mois.', tone: 'blue' },
            { min: 9, text: 'Exemplaire : devenez le relais de votre équipe.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 21, lineHeight: 1.45, color: C.muted }}>Photographiez cette page : c’est votre aide-mémoire.</div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Atelier 6 : cas fil rouge ──────────────────────────────────────────────
const M7_Kit: Page = () => (
  <Frame mod={7} kind="atelier">
    <Title>Atelier 6 · le cas à traiter de bout en bout</Title>
    <Lede>Un nouveau message, plus délicat. Lisez-le attentivement : il contient un piège de confidentialité.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060, ...dl(100) }}>
      <Bubble who="user" name="Mme Nadia Ferreira · formulaire web · vendredi 17 h 40" size={25}>
        Bonjour, mon réfrigérateur livré il y a trois semaines ne refroidit plus depuis ce matin. J’ai 78 ans, je suis diabétique et mon insuline doit
        rester au frais. Ma fille m’a aidée à écrire ce message. Je ne peux pas me déplacer et je ne sais pas quoi faire. Pouvez-vous m’aider très
        vite ? Mon numéro : 06 98 76 54 32.
      </Bubble>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card tone="yellow" icon="split" title="Ce que vous avez" cls={A.right} style={dl(300)} size={21}>
        La note SAV-07 (module 5), vos prompts d’analyse et de réponse, la charte.
      </Card>
      <Card tone="green" icon="smile" title="Après la résolution" cls={A.right} style={dl(450)} size={21}>
        Réponse à l’enquête : « 3/5. Technicien venu lundi, très gentil. Mais tout le week-end sans frigo, c’était long. »
      </Card>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 700, width: 1060, ...dl(600) }}>
      <Callout title="Questions à vous poser" tone="coral" icon="eye" size={23}>
        Quelle priorité ? Quelles données ne doivent pas aller dans l’IA ? Qui décide d’un geste exceptionnel ? Que faire avant lundi ?
      </Callout>
    </div>
  </Frame>
);

const M7_Atelier: Page = () => (
  <LabPage
    mod={7}
    n="6"
    title="Cas fil rouge : de la demande à la satisfaction"
    defi="projet"
    who="En binôme · 20 min"
    minutes={20}
    objective={
      <>
        Traiter la demande de Mme Ferreira <strong>en six étapes</strong>, avec l’IA, en appliquant la charte, puis présenter votre traitement en 2 minutes.
      </>
    }
    where={
      <>
        Fiche d’analyse + réponse validée
        <br />
        Note d’escalade + message de suivi
        <br />
        Analyse de l’avis + 1 amélioration
      </>
    }
    crit={
      <>
        <CheckItem id="a6-1" size={21}>
          Données de santé et téléphone hors IA
        </CheckItem>
        <CheckItem id="a6-2" size={21}>
          Priorité et vulnérabilité reconnues
        </CheckItem>
        <CheckItem id="a6-3" size={21}>
          Escalade pour une solution d’urgence
        </CheckItem>
        <CheckItem id="a6-4" size={21}>
          Amélioration tirée de l’avis
        </CheckItem>
      </>
    }
  >
    <strong>1. Analyse</strong> (en anonymisant) · <strong>2. Réponse</strong> avec la note SAV-07 · <strong>3. Validation</strong> par les 4 vérifications ·{' '}
    <strong>4. Escalade</strong> : un geste d’urgence (prêt, intervention samedi) est-il possible ? · <strong>5. Suivi</strong> : message de lundi soir ·{' '}
    <strong>6. Satisfaction</strong> : analysez l’avis 3/5 et proposez une amélioration du process.
    <Bonus>Rédigez aussi la fiche KB « client vulnérable sans froid le week-end » que l’équipe pourra réutiliser.</Bonus>
  </LabPage>
);

// ─── Restitution ────────────────────────────────────────────────────────────
const M7_Restitution: Page = () => (
  <Frame mod={7} kind="atelier" beats={3}>
    <Title>Restitution : 2 minutes par binôme</Title>
    <Lede>Trois questions, pas de diaporama. Le groupe vote pour la meilleure idée d’amélioration.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1080, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M3Part n={1} tone="blue" title="Qu’avez-vous laissé faire à l’IA, et qu’avez-vous corrigé ?">
        Un exemple précis de correction vaut mieux qu’un long discours.
      </M3Part>
      <M3Part n={2} tone="coral" title="Qu’avez-vous refusé de lui donner ?">
        Données, décisions : où avez-vous gardé la main ?
      </M3Part>
      <M3Part n={3} tone="green" title="Quelle amélioration proposez-vous ?">
        Tirée de l’avis client : action, responsable, indicateur.
      </M3Part>
    </div>
    <div style={{ position: 'absolute', left: 1260, top: 262, width: 540 }}>
      <Timer id="restitution" minutes={2} label="Temps de parole" cls={A.right} style={{ width: 540, ...dl(300) }} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(500) }}>
      <Callout title="Le point clé attendu" tone="violet" icon="heart" size={23}>
        Ici, le plus important n’est pas le texte : c’est d’avoir repéré la <strong>vulnérabilité</strong>, protégé la donnée de santé, et{' '}
        <strong>escaladé</strong> pour trouver une solution avant lundi.
      </Callout>
    </div>
  </Frame>
);

// ═══ 95-close ══════════════════════════════════════════════════════════

// ─── Clôture ────────────────────────────────────────────────────────────────

const F_Quiz: Page = () => (
  <Frame mod={11} kind="quiz">
    <Title>Quiz final : huit questions pour toute la journée</Title>
    <QuizSeries y={220}>
      <QuizQ q="Les cinq ingrédients d’un bon prompt sont…" explain="Rôle, contexte, tâche, format, ton. Le contexte (faits + procédure) est celui qui réduit le plus les inventions.">
        <QOpt>Politesse, longueur, mots-clés, langue, date</QOpt>
        <QOpt ok>Rôle, contexte, tâche, format, ton</QOpt>
        <QOpt>Question, réponse, source, signature, émoji</QOpt>
      </QuizQ>
      <QuizQ q="Analyser une demande, c’est identifier…" explain="Intention, catégorie, informations clés, urgence, émotion : la fiche d’analyse du module 2.">
        <QOpt ok>Intention, catégorie, infos clés, urgence, émotion</QOpt>
        <QOpt>Le nom, l’âge et l’adresse du client</QOpt>
        <QOpt>Le nombre de mots et de fautes</QOpt>
      </QuizQ>
      <QuizQ q="Dans une bonne réponse, la solution arrive…" explain="Saluer, reconnaître, puis répondre : la solution vient tôt, l’explication ensuite, puis la prochaine étape.">
        <QOpt>Tout à la fin</QOpt>
        <QOpt ok>Juste après avoir reconnu la situation</QOpt>
        <QOpt>Dans un second message</QOpt>
      </QuizQ>
      <QuizQ q="Face à un client en colère, quelle phrase éviter ?" explain="« Calmez-vous » nie l’émotion et la fait monter. On reformule avec un fait précis et on propose une action.">
        <QOpt>« Voici ce que je peux faire dès maintenant. »</QOpt>
        <QOpt ok>« Calmez-vous, s’il vous plaît. »</QOpt>
        <QOpt>« Je comprends, vous avez attendu toute la journée. »</QOpt>
      </QuizQ>
      <QuizQ q="Pour une recherche fiable dans la documentation, l’IA doit…" explain="Répondre uniquement à partir du document, citer la section, et dire quand l’information est absente.">
        <QOpt>Compléter avec ses connaissances générales</QOpt>
        <QOpt ok>Répondre seulement à partir du document, en citant la section</QOpt>
        <QOpt>Donner la réponse la plus probable</QOpt>
      </QuizQ>
      <QuizQ q="Pour compter les motifs de contact sur 1 000 conversations…" explain="L’IA classe, le tableur compte, l’humain interprète.">
        <QOpt>On demande le total à l’IA</QOpt>
        <QOpt ok>L’IA classe, un tableur compte</QOpt>
        <QOpt>On lit un échantillon de 10</QOpt>
      </QuizQ>
      <QuizQ q="Laquelle de ces données ne doit jamais aller dans une IA ?" explain="Les données bancaires, les mots de passe et les données de santé ne servent pas à rédiger une réponse : jamais, même dans l’outil autorisé.">
        <QOpt>La description de la panne</QOpt>
        <QOpt>La date de livraison</QOpt>
        <QOpt ok>Le numéro de carte bancaire</QOpt>
      </QuizQ>
      <QuizQ q="Qui décide d’un geste commercial ?" explain="Le conseiller dans sa délégation, ou son responsable au-delà, selon la procédure. L’IA peut préparer la note, jamais décider.">
        <QOpt>L’IA, si elle le propose</QOpt>
        <QOpt ok>Le conseiller ou son responsable, selon la procédure</QOpt>
        <QOpt>Le client</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Auto-positionnement final ──────────────────────────────────────────────
const F_AutoPos: Page = () => (
  <Frame mod={11} kind="exercice">
    <Title>Auto-positionnement : votre point d’arrivée</Title>
    <Lede>Les mêmes huit affirmations que ce matin. Comparez avec votre score de départ.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="fp1">Citer trois usages concrets de l’IA dans un service client</CheckItem>
        <CheckItem id="fp2">Faire identifier l’intention, l’urgence et l’émotion d’un message</CheckItem>
        <CheckItem id="fp3">Obtenir une réponse claire, au bon ton, personnalisée</CheckItem>
        <CheckItem id="fp4">Préparer une réponse à une réclamation tendue</CheckItem>
        <CheckItem id="fp5">Créer un modèle de réponse réutilisable par toute l’équipe</CheckItem>
        <CheckItem id="fp6">Transformer une procédure en FAQ ou en arbre de décision</CheckItem>
        <CheckItem id="fp7">Faire ressortir les motifs de contact d’un lot de conversations</CheckItem>
        <CheckItem id="fp8">Savoir quelles données ne jamais coller dans une IA</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau d’arrivée"
          levels={[
            { min: 0, text: 'Reprenez les fiches de synthèse et refaites les ateliers.', tone: 'grey' },
            { min: 4, text: 'Bonne progression : pratiquez chaque jour, ça viendra vite.', tone: 'blue' },
            { min: 7, text: 'Objectifs atteints : à vous de jouer lundi !', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Ce matin : ___ / 8. Ce soir : ___ / 8. La différence, c’est votre journée.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Plan d’action ──────────────────────────────────────────────────────────
const F_Plan: Page = () => (
  <Frame mod={11} kind="exercice">
    <Title>Mon plan d’action : trois usages dès lundi</Title>
    <Lede>Choisissez-en trois, pas plus. Le meilleur usage est celui que vous ferez vraiment, chaque jour.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1180, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, ...dl(100) }}>
        <CheckItem id="pl1" size={22} tone="violet">Analyser les messages longs avec la fiche</CheckItem>
        <CheckItem id="pl2" size={22} tone="violet">Retoucher mes brouillons (plus clair, plus court)</CheckItem>
        <CheckItem id="pl3" size={22} tone="violet">Créer 3 modèles pour mes cas fréquents</CheckItem>
        <CheckItem id="pl4" size={22} tone="violet">Préparer mes réponses aux réclamations</CheckItem>
        <CheckItem id="pl5" size={22} tone="violet">M’entraîner avec la simulation de client</CheckItem>
        <CheckItem id="pl6" size={22} tone="violet">Chercher dans la doc avec citation des sources</CheckItem>
        <CheckItem id="pl7" size={22} tone="violet">Synthétiser mes appels au même format</CheckItem>
        <CheckItem id="pl8" size={22} tone="violet">Proposer une amélioration tirée des irritants</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1350, top: 262, width: 450, ...dl(300) }}>
        <CheckScore
          max={3}
          label="Mes engagements"
          levels={[
            { min: 0, text: 'Choisissez trois usages.', tone: 'grey' },
            { min: 1, text: 'Encore un peu…', tone: 'blue' },
            { min: 3, text: 'Parfait : notez-les, et faites le point dans 15 jours.', tone: 'green' },
            { min: 4, text: 'Trop d’un coup : gardez-en trois.', tone: 'coral' },
          ]}
        />
      </div>
    </Checklist>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1180, ...dl(600) }}>
      <Callout title="Votre boîte à outils" tone="blue" icon="note" size={23}>
        Votre document contient désormais : la recette du prompt, les prompts d’analyse, de rédaction, de réclamation, de simulation, de recherche
        documentaire, de synthèse d’appel et de reporting, et vos modèles.
      </Callout>
    </div>
  </Frame>
);

// ─── Merci ──────────────────────────────────────────────────────────────────
const F_Merci: Page = () => (
  <Frame mod={11} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={110} r={46} cls={A.fade} />
    <Outline x={1830} y={900} w={300} h={200} r={40} color={C.violet} />
    <div style={{ position: 'absolute', left: 390, top: 150, width: 1000 }}>
      <Eyebrow c={C.violet} size={24} cls={A.in}>
        Merci pour votre énergie !
      </Eyebrow>
      <h1 className={A.in} style={{ margin: '24px 0 0', fontFamily: display, fontWeight: 800, fontSize: 104, lineHeight: 1.04, letterSpacing: '-0.02em', color: C.navy, ...dl(120) }}>
        L’IA propose,
        <br />
        <span style={{ color: C.plum }}>vous disposez.</span>
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 30, lineHeight: 1.45, color: C.soft, maxWidth: 900, ...dl(240) }}>
        Elle vous fait gagner du temps sur ce qui se répète. Vous gardez ce qui fait la différence : l’écoute, le jugement, et la relation.
      </p>
    </div>
    <Portrait w={170} x={390} y={640} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 664, ...dl(300) }}>
      <Eyebrow c={C.muted} size={20}>
        Questions, retours, suite
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
        <Tag tone="blue" size={20}>
          <Icon name="form" size={20} /> Questionnaire d’évaluation
        </Tag>
        <Tag tone="green" size={20}>
          <Icon name="note" size={20} /> Votre boîte à prompts
        </Tag>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1440, top: 200, width: 360, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <OCoverStep icon="search" tone="blue" eyebrow="Comprendre" label="Analyser la demande" y={0} d={400} solid={false} />
      <OCoverStep icon="pen" tone="violet" eyebrow="Répondre" label="Rédiger, au bon ton" y={130} d={500} solid={false} />
      <OCoverStep icon="heart" tone="coral" eyebrow="Apaiser" label="Désamorcer, escalader" y={260} d={600} solid={false} />
      <OCoverStep icon="book" tone="teal" eyebrow="Capitaliser" label="Partager la connaissance" y={390} d={700} solid={false} />
      <OCoverStep icon="chart" tone="green" eyebrow="Améliorer" label="Écouter tous les clients" y={520} d={800} solid={false} />
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
  title: "IA pour la relation client",
  createdAt: '2026-10-12T20:10:00.000Z',
};

export default [
  O_Cover,
  O_Welcome,
  O_Poll,
  O_Objectifs,
  O_Programme,
  O_AutoPos,
  O_FilRouge,
  O_Setup,
  M1_Section,
  M1_Temps,
  M1_CestQuoi,
  M1_Usages,
  M1_Assistance,
  M1_Perso,
  M1_QuizFlash,
  M1_Limites,
  M1_Erreurs,
  M1_Validation,
  M1_Recette,
  M1_Qcm,
  M1_Synthese,
  M2_Section,
  M2_Grille,
  M2_Intention,
  M2_Classer,
  M2_Extraire,
  M2_Urgence,
  M2_Emotions,
  M2_Reformuler,
  M2_Analyseur,
  M2_Kit,
  M2_Atelier,
  M2_Corrige,
  M2_Quiz,
  M2_Synthese,
  M3_Section,
  M3_Anatomie,
  M3_Clair,
  M3_Retouches,
  M3_Canal,
  M3_Perso,
  M3_Modele,
  M3_Complexe,
  M3_Traduction,
  M3_Quiz,
  M3_Kit,
  M3_Atelier,
  M3_Exemple,
  M3_Qcm,
  M3_Synthese,
  M4_Section,
  M4_Citation,
  M4_Methode,
  M4_Probleme,
  M4_Mots,
  M4_Prompt,
  M4_Desamorcer,
  M4_Escalade,
  M4_Simu,
  M4_Atelier,
  M4_Debrief,
  M4_Quiz,
  M4_Synthese,
  M5_Section,
  M5_Probleme,
  M5_FAQ,
  M5_Frequentes,
  M5_Procedure,
  M5_Script,
  M5_Arbre,
  M5_Recherche,
  M5_Fiche,
  M5_Kit,
  M5_Atelier,
  M5_Quiz,
  M5_Synthese,
  M6_Section,
  M6_SyntheseAppel,
  M6_Pipeline,
  M6_Motifs,
  M6_BigNumber,
  M6_Irritants,
  M6_Recurrent,
  M6_Reporting,
  M6_Pistes,
  M6_Kit,
  M6_Atelier,
  M6_Quiz,
  M6_Synthese,
  M7_Section,
  M7_Parcours,
  M7_Donnees,
  M7_Anonymiser,
  M7_Controle,
  M7_Limites,
  M7_Charte,
  M7_Kit,
  M7_Atelier,
  M7_Restitution,
  F_Quiz,
  F_AutoPos,
  F_Plan,
  F_Merci,
] satisfies Page[];

// Speaker notes — one entry per page, same order as the default export.
export const notes: (string | undefined)[] = [
  `⏱ 2 min · COUVERTURE · 9:00

OBJECTIF — Accueillir, rassurer : la formation est pensée pour des débutants et pour le quotidien d’un service client.

DIRE — « Bonjour à toutes et à tous, et bienvenue. Aujourd’hui, on va voir comment l’IA peut vous aider dans votre métier : comprendre plus vite ce que veut un client, lui répondre mieux, gérer les situations tendues, et tirer des enseignements de tous vos échanges. À droite, vous avez le parcours d’une demande : un client écrit, l’IA aide à analyser, elle propose une réponse… et c’est vous qui vérifiez, ajustez et envoyez. »

INSISTER — L’IA ne remplace pas le conseiller : elle lui fait gagner du temps sur ce qui est répétitif, pour qu’il en ait plus pour ce qui compte.

TRANSITION — « Quelques mots sur la journée. »`,
  `⏱ 2 min · BIENVENUE

OBJECTIF — Poser le cadre : 7 heures, 7 modules, 6 ateliers, beaucoup de pratique.

DIRE — « Je suis votre formateur aujourd’hui. Sept heures, sept modules, six ateliers. La moitié du temps, c’est vous qui pratiquez, sur des demandes clients réalistes. Pas besoin d’être à l’aise avec la technique : si vous savez écrire un email, vous savez parler à une IA. Et une phrase à garder en tête toute la journée : l’IA propose, le conseiller dispose. »

ANIMATION — Les chiffres s’animent tout seuls. Laisser le temps de lire le contrat.

TRANSITION — « Faisons connaissance. »`,
  `⏱ 4 min · TOUR DE TABLE (sondage)

OBJECTIF — Connaître les métiers et les niveaux pour adapter les exemples et former les binômes.

DIRE — « Premier vote : votre métier. » Compter les mains, cliquer. « Deuxième vote : votre usage de l’IA aujourd’hui. Aucun jugement : « jamais essayé » est une excellente réponse, c’est même pour vous que cette journée est faite. »

ANIMATION — Cliquer une ligne par main levée. Repérer les personnes à l’aise pour les associer à des débutants. Si l’outil client intègre déjà de l’IA, demander lequel et ce qu’il fait : cela donnera des exemples concrets au module 1.

TRANSITION — « Voici ce que vous saurez faire ce soir. »`,
  `⏱ 2 min · OBJECTIFS

OBJECTIF — Présenter les huit objectifs pédagogiques, regroupés en quatre gestes.

DIRE — « Le programme compte huit objectifs. Pour les retenir, je les range en quatre gestes. Comprendre : savoir ce que l’IA peut faire pour vous, et analyser une demande. Répondre : rédiger, gérer les réclamations, créer des modèles. Capitaliser : construire une base de connaissances et analyser les échanges pour améliorer le service. Et sécuriser : confidentialité et contrôle humain, qui reviennent dans tous les modules. »

TRANSITION — « Concrètement, voici le déroulé. »`,
  `⏱ 2 min · PROGRAMME

OBJECTIF — Donner la carte de la journée.

DIRE — « Le matin, on comprend et on répond : les usages, l’analyse d’une demande, puis la rédaction des réponses. L’après-midi, on apaise et on améliore : les réclamations, la base de connaissances, l’analyse des interactions, et pour finir le cas fil rouge complet avec les bonnes pratiques. Le bandeau en haut à droite vous indique toujours où nous en sommes. »

ANIMATION — Horaires indicatifs : ajuster au rythme du groupe. Les pauses peuvent glisser de 10 minutes.

TRANSITION — « Avant de commencer, mesurons votre point de départ. »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT (exercice)

OBJECTIF — Mesurer le niveau de départ pour pouvoir constater la progression en fin de journée.

DIRE — « Huit affirmations, une par compétence visée. Cochez seulement ce que vous savez faire aujourd’hui, sans aide. Si vous avez zéro, c’est parfait : vous allez voir la différence. Notez votre score : on refait exactement le même exercice ce soir. »

ANIMATION — Faire cocher un volontaire à l’écran, ou chacun sur papier. Ne pas commenter les scores individuels.

TRANSITION — « Je vous présente maintenant l’entreprise qui va nous accompagner toute la journée. »`,
  `⏱ 4 min · LE CAS FIL ROUGE : NOVA MAISON (→ fait apparaître l’encadré)

OBJECTIF — Installer le cas fil rouge et la cliente qui reviendra à chaque module.

DIRE — « Nova Maison est une enseigne fictive de vente en ligne d’électroménager et de mobilier. Quarante-cinq conseillers, deux mille huit cents contacts par semaine, beaucoup plus en période de soldes. Et lundi matin, Mme Moreau écrit. » Lire le message à voix haute, avec le ton. « Retard, panne, deuxième relance, menace d’annulation et d’avis négatif. Tout y est. »

ANIMATION — Demander : « Qui a déjà reçu ce genre de message cette semaine ? » → révéler l’encadré : ce message va passer par chaque module.

INSISTER — Toutes les données sont fictives : c’est une règle de la journée, on en reparle tout de suite.

TRANSITION — « Dernière vérification avant de démarrer. »`,
  `⏱ 4 min · CHECK-UP (minuteur 3 min)

OBJECTIF — Vérifier que chacun a un outil IA autorisé et le kit de cas, et poser la règle d’or des données.

DIRE — « Trois minutes. Vérifiez chaque ligne. Un seul outil suffit : celui que votre entreprise autorise. Ouvrez aussi un document vierge : vous y collerez vos meilleurs prompts au fil de la journée, ce sera votre boîte à outils. Et la règle d’or : aucune donnée réelle de client. Pas de nom, pas d’adresse, pas de numéro de contrat. Le kit Nova Maison est entièrement fictif. »

ANIMATION — Lancer le minuteur, passer dans les rangs. Si un outil manque, travailler en binôme sur un seul poste.

TRANSITION — « Tout le monde est prêt ? Module 1 : l’IA au service de la relation client. »`,
  `⏱ 1 min · MODULE 1 · OUVERTURE DE SECTION · 9:20

OBJECTIF — Annoncer le module : comprendre ce que l’IA peut faire pour un conseiller, et ses limites.

DIRE — « Premier module : l’IA au service de la relation client. On va voir ce qu’elle sait faire, à quoi ressemble concrètement l’assistance au conseiller, comment elle personnalise, et surtout ses limites, parce que c’est ce qui vous permettra de l’utiliser en confiance. On finira par la recette d’un bon prompt, qui servira toute la journée. »

TRANSITION — « Commençons par votre quotidien. »`,
  `⏱ 4 min · OÙ PART LE TEMPS (→ badges IA, → cartes)

OBJECTIF — Partir du réel : la plupart du temps passé sur un contact n’est pas de la relation.

DIRE — « Voici un ordre de grandeur pour le traitement d’un email client. Un quart du temps à lire, comprendre, retrouver l’historique. Un cinquième à chercher la bonne info. Presque un tiers à rédiger. Et du temps de saisie et de classement. La vraie relation, le conseil, le geste : une petite part. » → « L’IA peut aider sur les quatre premiers blocs. » → « Ce qu’on gagne, c’est du temps pour la partie verte, celle où vous faites la différence. Et ce qui ne change pas : c’est vous qui envoyez. »

ANIMATION — Demander : « Chez vous, quel bloc est le plus gros ? » Les chiffres sont illustratifs : l’important est la répartition.

TRANSITION — « Mais au fait, comment ça marche, une IA générative ? »`,
  `⏱ 4 min · L’IA GÉNÉRATIVE EN UNE MINUTE (→ ×3)

OBJECTIF — Donner un modèle mental simple et juste : une machine à prédire le texte.

DIRE — « Une IA générative, c’est une machine qui prédit la suite la plus probable d’un texte. Si j’écris « Votre commande sera livrée… », elle calcule que « demain » est très probable, « sous 48 heures » aussi. Elle choisit un mot plausible. Pas forcément le vrai délai de cette commande-là. » → « Elle a énormément lu : elle écrit très bien. » → « Mais elle ne connaît pas Nova Maison : ni vos procédures, ni le dossier du client, sauf si vous les lui donnez. » → « Et quand l’information manque, elle complète avec du plausible : c’est l’hallucination. »

INSISTER — C’est la clé de toute la journée : la qualité de la réponse dépend de ce qu’on lui fournit.

TRANSITION — « Concrètement, à quoi peut-elle servir chez vous ? »`,
  `⏱ 4 min · SIX USAGES (cartes à retourner, → retourne tout)

OBJECTIF — Montrer l’étendue des usages avec des exemples concrets.

DIRE — « Six usages. Analyser une demande. Rédiger un brouillon. Personnaliser. Traduire. Rechercher dans la documentation. Synthétiser les échanges. » Faire retourner une ou deux cartes par des participants. « Chacun de ces usages, on va le pratiquer aujourd’hui : l’analyse au module 2, la rédaction au 3, la recherche au 5, la synthèse au 6. »

ANIMATION — Demander quel usage leur parle le plus. → retourne toutes les cartes.

TRANSITION — « Zoom sur le premier usage, le plus courant : l’assistance au conseiller. »`,
  `⏱ 3 min · L’ASSISTANCE AU CONSEILLER (démo, → ×4)

OBJECTIF — Rendre concret le « copilote » intégré à l’outil du conseiller.

DIRE — « À gauche, un chat en cours. À droite, ce que de plus en plus d’outils de relation client proposent : un assistant qui travaille en parallèle. » → « Un résumé de la situation. » → « L’intention et l’urgence. » → « La procédure suggérée, tirée de la base de connaissances. » → « Et une proposition de réponse. Le conseiller garde la main : il prend, il modifie, ou il ignore. »

INSISTER — Copilote, pas pilote : c’est le conseiller qui envoie. Si votre outil intègre déjà ce type d’assistant, demander aux participants d’en témoigner.

TRANSITION — « Autre usage clé : la personnalisation. »`,
  `⏱ 3 min · PERSONNALISATION (interrupteur)

OBJECTIF — Montrer la différence entre réponse générique et personnalisée, et d’où elle vient : le contexte.

DIRE — « Voici la réponse générique, celle qu’on reçoit tous. » Lire. « Maintenant, je donne à l’IA l’historique et le contexte. » Basculer. « Le nom, le produit, la date, l’historique, la garantie, une solution concrète, un choix. Le client se sent reconnu. »

INSISTER — Ce qui personnalise, c’est le contexte fourni. Mais seulement le nécessaire, et dans un outil autorisé.

ANIMATION — Basculer plusieurs fois, demander : « Laquelle vous aimeriez recevoir ? »

TRANSITION — « Petit quiz pour vérifier ce qu’on a vu. »`,
  `⏱ 4 min · QUIZ FLASH (5 questions)

OBJECTIF — Ancrer les notions : connaissance limitée, hallucination, données, variabilité, responsabilité.

DIRE — Lire chaque affirmation, faire voter à main levée, puis cliquer. Commenter l’explication.

ANIMATION — Utiliser « Suivante ». Le score « du premier coup » se met à jour : en faire un petit jeu collectif.

TRANSITION — « On a évoqué les erreurs. Regardons les limites en face. »`,
  `⏱ 3 min · CINQ LIMITES (→ ×6)

OBJECTIF — Lister les limites concrètes, et la parade unique.

DIRE — → « Elle invente quand elle ne sait pas. » → « Elle ne voit pas vos systèmes : l’état de la commande, elle ne le connaît pas. » → « Elle peut exposer des données si l’outil n’est pas autorisé. » → « Elle peut rater le ton, notamment avec un client en difficulté. » → « Elle ne décide pas : un remboursement, une exception, c’est vous. » → « Et la parade, c’est la validation humaine. »

TRANSITION — « Mettons ça en pratique : chasse aux erreurs. »`,
  `⏱ 4 min · REPÉREZ LES ERREURS (exercice, → ×5)

OBJECTIF — Entraîner l’œil à relire un brouillon IA.

DIRE — « Voici un brouillon que l’IA a produit pour Mme Moreau, sans qu’on lui donne le dossier. Une minute en silence : combien d’erreurs trouvez-vous ? » Laisser chercher, recueillir les réponses. Puis → à chaque erreur : « Mauvais nom. » → « Mauvais produit. » → « Un rendez-vous technicien inventé. » → « Et un bon d’achat de 100 € que personne n’a autorisé. » → la leçon et le réflexe.

INSISTER — Le texte est poli et fluide, et pourtant faux sur quatre points. La forme ne garantit jamais le fond.

TRANSITION — « D’où notre règle : l’IA propose, le conseiller dispose. »`,
  `⏱ 3 min · LES 4 VÉRIFICATIONS (→ ×5)

OBJECTIF — Donner une routine de relecture simple et mémorisable.

DIRE — « Quatre questions avant chaque envoi. » → « Exact : noms, dates, montants. » → « Complet : toutes les questions ont une réponse, la prochaine étape est claire. » → « Adapté : le ton convient. » → « Conforme : pas d’engagement non autorisé. » → « Et la règle d’équipe : aucun texte généré ne part sans avoir été lu en entier. »

ANIMATION — Proposer un moyen mnémotechnique : « E-C-A-C ».

TRANSITION — « Dernier point du module : comment bien demander. »`,
  `⏱ 5 min · LA RECETTE DU PROMPT (simulateur, interrupteurs)

OBJECTIF — Faire comprendre par l’expérience que la qualité de la réponse dépend des ingrédients du prompt.

DIRE — « Au départ, seulement la tâche : « Réponds à cet email. » Résultat : générique. » Activer Rôle. « On dit à l’IA qui elle est. » Activer Contexte. « On lui donne les faits et la procédure. C’est l’ingrédient le plus important. » Activer Format, puis Ton. « Et maintenant : une réponse prête à relire, personnalisée, avec une vraie solution. »

ANIMATION — Faire choisir aux participants l’ordre des ingrédients. Montrer que le contexte fait le plus grand saut.

INSISTER — Rôle, contexte, tâche, format, ton : à copier dans votre document.

TRANSITION — « Vérifions avec un QCM. »`,
  `⏱ 2 min · QCM 1 (→ bonne réponse, → l’essentiel)

OBJECTIF — Vérifier le réflexe de vérification.

DIRE — Lire la question, faire voter, cliquer. Faire cliquer les pièges pour les commentaires. Insister sur la réponse C : demander à l’IA si elle est sûre n’est pas une vérification.

TRANSITION — « Ce qu’il faut retenir du module 1. »`,
  `⏱ 1 min · SYNTHÈSE MODULE 1

OBJECTIF — Récapituler en cinq phrases.

DIRE — Lire les cinq points. « Copiez la recette du prompt dans votre document : vous allez vous en servir dès le prochain module. »

TRANSITION — « Module 2 : on prend un message client et on apprend à le décortiquer. »`,
  `⏱ 1 min · MODULE 2 · OUVERTURE DE SECTION · 10:00

OBJECTIF — Annoncer le module : comprendre avant de répondre.

DIRE — « Combien de réponses à côté viennent d’une demande mal lue ? Ce module, c’est l’art de décortiquer un message : ce que le client veut, de quoi il parle, les infos utiles, ce qui presse, et ce qu’il ressent. L’IA est très forte pour ça, à condition de bien cadrer. Et vous le pratiquerez dans l’atelier 1. »

TRANSITION — « Cinq questions, appliquées à Mme Moreau. »`,
  `⏱ 3 min · LA GRILLE EN 5 QUESTIONS (→ ×5)

OBJECTIF — Installer la grille d’analyse qui servira tout le module.

DIRE — « Voici le message de Mme Moreau. Cinq questions. » → « Que veut-elle ? Une solution rapide, et être entendue. » → « De quoi parle-t-elle ? Du SAV : un produit défectueux, avec un retard en toile de fond. » → « Quelles infos ? Le numéro, le produit, le retard, la fuite, la relance. » → « Est-ce urgent ? Oui : l’appareil est inutilisable, c’est sa deuxième relance, et il y a une menace. » → « Que ressent-elle ? De l’exaspération. »

ANIMATION — Avant chaque →, faire répondre la salle.

TRANSITION — « Zoom sur chaque question, à commencer par l’intention. »`,
  `⏱ 4 min · L’INTENTION (cartes à retourner, → ×4)

OBJECTIF — Distinguer ce que le client dit de ce qu’il veut.

DIRE — Pour chaque carte : lire la phrase, demander « Que veut-il vraiment ? », puis retourner. « Je suis très déçu » : il attend une action. « Vous avez reçu mon retour ? » : la vraie question est « quand suis-je remboursé ? ». « C’est quoi ces frais ? » : il les conteste. « Je déménage le 15 » : il faut changer l’adresse ou la date.

INSISTER — Avec l’IA, demandez l’intention principale, la secondaire, et la phrase qui le prouve : vous vérifiez en deux secondes.

TRANSITION — « Deuxième question : de quoi parle-t-il ? Petit jeu. »`,
  `⏱ 4 min · JEU DE TRI (glisser-déposer, → corrigé)

OBJECTIF — Faire sentir la nécessité d’une liste de catégories commune, et ses cas limites.

DIRE — « Huit demandes, quatre catégories. Qui vient les ranger ? » Faire venir un ou deux volontaires. Discuter le cas du parquet rayé : livraison ou réclamation ? « Il n’y a pas de bonne réponse universelle : c’est à l’entreprise de fixer la règle, et à vous de la donner à l’IA. » → corrigé.

INSISTER — Liste fermée de catégories dans le prompt : sinon l’IA invente une catégorie différente à chaque fois, et vos statistiques deviennent inutilisables.

ANIMATION — Double-clic sur une étiquette = retour à sa place initiale.

TRANSITION — « Troisième question : les informations clés. »`,
  `⏱ 3 min · EXTRAIRE LES INFORMATIONS (→ ×6)

OBJECTIF — Montrer la transformation d’un message désordonné en fiche structurée.

DIRE — « Thomas écrit sur le chat, comme on parle. » → à chaque appui, une info est surlignée et rejoint la fiche : commande, produit, date de livraison, problème, demande, disponibilité. « En cinq secondes, le conseiller sait tout. Et la fiche peut être collée dans votre outil. »

INSISTER — Le piège : une info absente. L’IA doit écrire « non précisé », jamais inventer. Il faut l’écrire dans le prompt.

TRANSITION — « Quatrième question : est-ce urgent ? »`,
  `⏱ 4 min · DÉTECTER L’URGENCE (→ ×5)

OBJECTIF — Distinguer les signaux d’urgence et la grille de priorité.

DIRE — « À gauche, les signaux que l’IA sait repérer : sécurité, argent, échéance, relances, menaces, fragilité. » → P1 à P4. « La grille de priorité, c’est votre entreprise qui la fixe ; l’IA l’applique et justifie. » → « Attention : un client très poli peut être en danger. La plaque qui fait des étincelles, c’est P1, même si le message est calme. »

ANIMATION — Demander : « Chez vous, qui fixe les priorités ? Elles sont écrites quelque part ? »

TRANSITION — « Dernière question : l’émotion. »`,
  `⏱ 4 min · LE THERMOMÈTRE DES ÉMOTIONS (simulateur)

OBJECTIF — Repérer les indices d’émotion et les niveaux d’insatisfaction.

DIRE — Cliquer les messages un par un. « Neutre : politesse, question simple. Inquiet : besoin d’être rassuré. Agacé : relance et reproche. En colère : majuscules, points d’exclamation, demande d’un responsable. Rupture : ultimatum. » « Le niveau d’émotion change la réponse : on ne répond pas pareil à un client inquiet et à un client en rupture. On le verra au module 4. »

INSISTER — L’IA détecte vite, mais l’ironie et l’implicite la piègent encore : le conseiller confirme.

TRANSITION — « Une fois la demande comprise, on peut la reformuler. »`,
  `⏱ 3 min · REFORMULER (→ ×3)

OBJECTIF — Utiliser l’IA pour reformuler une demande confuse et repérer ce qu’il faut faire préciser.

DIRE — « Un message vocal retranscrit, comme on en reçoit beaucoup. » Le lire. → le prompt. → « La reformulation : deux phrases claires. Au téléphone, vous pouvez la dire telle quelle : « Si je comprends bien… ». Le client se sent compris. » → « Et la liste de ce qu’il faut lui demander. Vous gagnez un aller-retour. »

TRANSITION — « Assemblons tout ça dans un seul prompt d’analyse. »`,
  `⏱ 4 min · LE PROMPT D’ANALYSE EN ACTION (simulateur)

OBJECTIF — Donner un modèle de prompt d’analyse prêt à l’emploi et en montrer le résultat.

DIRE — Parcourir le prompt : rôle, tâche, les six champs, les listes fermées, la règle « n’invente rien ». Puis cliquer Message A → Analyser. Puis B, puis C. « Sur le message C, l’IA classe en P1 et donne la consigne de sécurité. Mais c’est vous qui vérifiez que la consigne est bien celle de votre procédure. »

ANIMATION — Si possible, faire la démonstration en direct dans votre outil IA avec le même prompt.

TRANSITION — « À vous de jouer : atelier 1. »`,
  `⏱ 2 min · LE KIT DE L’ATELIER 1

OBJECTIF — Présenter les six messages à analyser.

DIRE — « Six messages fictifs, reçus lundi matin. Des canaux différents : email, chat, appel retranscrit, formulaire, réseau social. Lisez-les rapidement. Attention au message F : de l’ironie. »

ANIMATION — Les messages sont aussi dans le kit distribué : chacun peut les copier.

TRANSITION — « Voici les consignes. »`,
  `⏱ 15 min · ATELIER 1 (minuteur 15 min)

OBJECTIF — Appliquer la grille d’analyse avec l’IA sur six cas variés et la vérifier.

DIRE — « En binôme. Copiez le prompt d’analyse, passez les six messages, et surtout relisez chaque fiche : seriez-vous d’accord ? Notez au moins un désaccord avec l’IA. Les critères de réussite sont à droite. »

ANIMATION — Lancer le minuteur. Passer dans les binômes : vérifier la liste fermée, le « non précisé », l’ironie du F. Bonus pour les plus rapides : faire trier les six messages par ordre de traitement.

TRANSITION — « On met en commun. »`,
  `⏱ 5 min · MISE EN COMMUN (→ ×6)

OBJECTIF — Comparer, discuter les écarts, valoriser les corrections humaines.

DIRE — Afficher les lignes une à une, demander à un binôme son analyse avant chaque →. Points de discussion : C (colère + menace : P2, et c’est un candidat à l’escalade, module 4) ; D (P1 malgré le calme) ; F (ironie, et c’est public : réponse rapide).

INSISTER — Recueillir les désaccords IA / humain : ce sont eux qui montrent pourquoi la validation humaine reste indispensable.

TRANSITION — « Petit quiz avant la pause. »`,
  `⏱ 3 min · QUIZ MODULE 2 (4 questions)

OBJECTIF — Vérifier : liste fermée, priorité sécurité, « non précisé », ironie.

DIRE — Lire, faire voter, cliquer, commenter l’explication.

TRANSITION — « Ce qu’il faut retenir. »`,
  `⏱ 1 min · SYNTHÈSE MODULE 2

OBJECTIF — Récapituler.

DIRE — Lire les cinq points. « Gardez votre prompt d’analyse dans votre document. Après la pause, on passe à la rédaction des réponses. »

TRANSITION — « Pause de quinze minutes. »`,
  `⏱ 1 min · MODULE 3 · OUVERTURE DE SECTION · 11:10

OBJECTIF — Annoncer le module le plus attendu : la rédaction.

DIRE — « On a compris la demande ; maintenant, on répond. Dans ce module : ce qui fait une bonne réponse, comment l’IA retouche un brouillon, comment adapter le ton au canal, comment créer des modèles réutilisables, traiter une demande à plusieurs questions, et traduire. Puis atelier 2 : vous rédigerez quatre vraies réponses. »

TRANSITION — « Qu’est-ce qu’une bonne réponse ? »`,
  `⏱ 4 min · ANATOMIE D’UNE BONNE RÉPONSE (→ ×5)

OBJECTIF — Donner une structure en cinq briques, réutilisable partout.

DIRE — « Voici la réponse à Mme Moreau. » → « Saluer, avec son nom. » → « Reconnaître : on reprend les faits et l’émotion. Elle sait qu’on l’a lue. » → « Répondre : la solution d’abord. » → « La prochaine étape : qui fait quoi, quand, et ce qu’elle doit faire, elle. » → « Conclure et signer : un prénom, un service, un moyen de nous recontacter. »

INSISTER — Ces cinq briques, vous pouvez les écrire dans votre prompt : « Structure ta réponse en cinq parties : … ».

TRANSITION — « Ensuite, la clarté. »`,
  `⏱ 4 min · CLAIR ET PROFESSIONNEL (→ ×5)

OBJECTIF — Montrer les défauts d’écriture courants et la version claire.

DIRE — Lire chaque phrase de gauche, demander « Le client comprend quoi ? », puis → la version claire. Insister sur le jargon interne (RMA, AR, J+2) que le client ne connaît pas, et sur la phrase finale vide « N’hésitez pas… » remplacée par une vraie consigne.

ANIMATION — Demander : « Quel jargon interne utilisez-vous sans vous en rendre compte ? » Noter deux ou trois exemples.

TRANSITION — « L’IA est excellente pour corriger ces défauts. Démonstration. »`,
  `⏱ 4 min · RETOUCHER UN BROUILLON (simulateur, boutons)

OBJECTIF — Montrer les commandes de retouche et la règle « on ne change pas les faits ».

DIRE — « Voici un brouillon de conseiller : juste, mais lourd. » Cliquer Plus clair, puis Plus court, Plus chaleureux, Plus formel. « À chaque fois, regardez : le délai reste 3 jours ouvrés. Une retouche change la forme, jamais le fond. »

INSISTER — C’est un usage très rentable : vous écrivez vite, à votre façon, et l’IA met en forme. Toujours ajouter « ne change aucun fait » au prompt.

TRANSITION — « Le ton dépend aussi du canal. »`,
  `⏱ 4 min · LE TON SELON LE CANAL (onglets)

OBJECTIF — Adapter la même réponse à l’email, au chat, au téléphone et au réseau social.

DIRE — Cliquer chaque onglet. « Email : structuré, détaillé. Chat : messages courts, réactifs. Téléphone : une trame à dire, pas un texte à lire, avec les chiffres répétés. Réseau social : c’est public ; aucune donnée personnelle, aucun montant, et on bascule en privé. »

ANIMATION — Demander quel canal est le plus utilisé chez eux, et faire préciser les codes maison (tutoiement en chat ? emojis ?).

TRANSITION — « Et la personnalisation : quoi donner à l’IA ? »`,
  `⏱ 3 min · PERSONNALISER SANS EN DIRE TROP

OBJECTIF — Distinguer les informations utiles à la réponse des données à ne pas transmettre.

DIRE — « À gauche, ce qui personnalise vraiment : le nom, le produit, l’historique, les contraintes, la procédure. À droite, ce qui n’apporte rien à la réponse et crée un risque : coordonnées bancaires, adresse complète, données de santé. » « Le test : est-ce que cette information change ma réponse ? Si non, elle ne va pas dans le prompt. »

TRANSITION — « Gagner du temps au quotidien : les modèles. »`,
  `⏱ 4 min · MODÈLES DE RÉPONSES (→ ×3)

OBJECTIF — Créer et améliorer des modèles réutilisables (objectif pédagogique dédié).

DIRE — « Un bon modèle a des parties fixes, validées une fois, et des variables entre crochets. » Montrer les variables et la condition « si retard > 7 jours ». → « On peut demander à l’IA de l’améliorer, en lui interdisant de créer des engagements. » → « Ses suggestions. » → « Et le modèle est validé par un référent avant d’être partagé. »

ANIMATION — Demander : « Avez-vous une bibliothèque de modèles ? Qui la tient à jour ? »

TRANSITION — « Et quand un email contient quatre questions ? »`,
  `⏱ 3 min · DEMANDES COMPLEXES (→ ×5)

OBJECTIF — Découper une demande multiple et faire apparaître ce que l’IA ne sait pas.

DIRE — « M. Lambert pose quatre questions dans le même email. Le risque : répondre à deux et oublier les deux autres. » → le prompt. → → « Pour les deux premières, la procédure donne la réponse. » → → « Pour les deux suivantes, l’IA écrit « à compléter » : c’est exactement ce qu’on veut. Elle ne devine pas une garantie ou une remise. »

TRANSITION — « Dernière technique : la traduction. »`,
  `⏱ 3 min · TRADUCTION (→ ×4)

OBJECTIF — Donner une méthode sûre en quatre étapes.

DIRE — → « Comprendre : l’IA traduit le message du client. » → « Rédiger en français, là où vous maîtrisez le fond. » → « Traduire, en imposant de garder chiffres et références. » → « Contrôler : on retraduit dans une nouvelle conversation et on compare. »

INSISTER — Pour un litige ou un document contractuel, validation par une personne qui maîtrise la langue.

TRANSITION — « Un quiz rapide avant l’atelier. »`,
  `⏱ 3 min · QUIZ MODULE 3 (4 questions)

OBJECTIF — Vérifier : réseau social, engagement inventé, place de la réponse, traduction.

DIRE — Lire, faire voter, cliquer, commenter.

TRANSITION — « À vous d’écrire : atelier 2. »`,
  `⏱ 2 min · LE KIT DE L’ATELIER 2

OBJECTIF — Présenter les quatre situations, reprises de l’atelier 1.

DIRE — « Vous retrouvez quatre messages déjà analysés. Votre fiche d’analyse va devenir le contexte de votre prompt. Chaque situation a sa procédure et sa contrainte : email pour A et C, chat pour E, réseau social pour F. Les plus rapides : le client E écrit en anglais. »

TRANSITION — « Les consignes. »`,
  `⏱ 20 min · ATELIER 2 (minuteur 20 min)

OBJECTIF — Rédiger quatre réponses adaptées et créer un premier modèle.

DIRE — « Vingt minutes, en binôme. Construisez le prompt complet, générez, retouchez, et passez chaque réponse au crible des quatre vérifications. Enfin, transformez votre meilleure réponse en modèle. »

ANIMATION — Passer dans les binômes : vérifier que la fiche d’analyse et la procédure sont bien dans le prompt, traquer les engagements inventés (geste commercial, dates). Bonus : comparer une réponse générée avec et sans la fiche d’analyse.

TRANSITION — « Mise en commun. »`,
  `⏱ 5 min · EXEMPLE COMMENTÉ (→ ×6)

OBJECTIF — Comparer les productions à une réponse de référence.

DIRE — Faire lire une ou deux réponses de binômes à voix haute. Puis dérouler l’exemple : → salutation, → reconnaissance des faits et de l’émotion, → solution datée, → geste validé par le responsable, → prochaine étape, → signature et point de vigilance.

INSISTER — Le créneau et le geste ont été vérifiés par le conseiller : c’est ce qui fait la différence avec le brouillon fautif du module 1.

TRANSITION — « Dernière vérification. »`,
  `⏱ 2 min · QCM 2 (→ bonne réponse, → l’essentiel)

OBJECTIF — Vérifier la démarche de création des modèles.

DIRE — Lire, faire voter, cliquer. Commenter les pièges.

TRANSITION — « Synthèse avant le déjeuner. »`,
  `⏱ 1 min · SYNTHÈSE MODULE 3 · 12:30

OBJECTIF — Récapituler et lancer la pause déjeuner.

DIRE — Lire les cinq points. « Sauvegardez votre meilleur prompt et votre modèle. Cet après-midi, on attaque les situations difficiles. Bon appétit ! »

TRANSITION — Reprise à 13:30 avec le module 4.`,
  `⏱ 1 min · MODULE 4 · OUVERTURE DE SECTION · 13:30

OBJECTIF — Relancer l’énergie après le déjeuner et annoncer les situations difficiles.

DIRE — « Bon retour ! On attaque le module que beaucoup d’entre vous attendent : les réclamations et les situations tendues. On verra comment identifier le problème, reconnaître l’insatisfaction, construire la réponse, désamorcer, et préparer une escalade. Et vous allez vous entraîner contre un client simulé par l’IA. »

TRANSITION — « D’abord, changeons de regard sur la réclamation. »`,
  `⏱ 2 min · CITATION

OBJECTIF — Recadrer la réclamation comme une opportunité.

DIRE — « En marketing des services, on parle du paradoxe de la réparation : un client dont la réclamation est bien traitée peut sortir de l’expérience avec plus de confiance qu’avant. Pas toujours, mais souvent assez pour que ça vaille l’effort. Un client mécontent qui vous écrit vous donne une deuxième chance ; celui qui part sans rien dire, non. »

ANIMATION — Demander : « Vous avez déjà retourné un client très mécontent ? Qu’est-ce qui a marché ? » Un ou deux témoignages.

TRANSITION — « Pour y arriver, une méthode en six temps. »`,
  `⏱ 3 min · LA MÉTHODE EN SIX TEMPS (→ ×6)

OBJECTIF — Donner la trame du module, en séparant ce que fait l’IA et ce que fait le conseiller.

DIRE — À chaque →, lire l’étape, puis « l’IA prépare… et vous ». Insister : à l’étape 4, c’est vous qui décidez de la solution et du geste ; à l’étape 6, c’est vous qui décidez de passer la main.

TRANSITION — « Étape 1 : identifier le problème. »`,
  `⏱ 4 min · FAITS / RESSENTIS / DEMANDES (→ ×4)

OBJECTIF — Apprendre à trier une réclamation.

DIRE — Lire le message de M. Benali avec le ton. → « Les faits : ce qui s’est passé, vérifiable. » → « Les ressentis : la colère, la perte, la lassitude. » → « Les demandes : explicites, et une implicite : être pris au sérieux. » → « Et pourquoi trier : chaque niveau appelle une réponse différente. »

ANIMATION — Faire trier par la salle avant chaque →.

TRANSITION — « Les ressentis appellent de la reconnaissance. Mais avec quels mots ? »`,
  `⏱ 4 min · JEU : APAISE OU ENVENIME (cartes, → ×2)

OBJECTIF — Distinguer les formulations qui désamorcent de celles qui enveniment.

DIRE — Pour chaque carte, faire voter « apaise » ou « envenime » à main levée, puis retourner. Commenter : « calmez-vous » nie l’émotion ; « ce n’est pas notre faute » cherche un coupable ; « comme indiqué » sous-entend que le client n’a pas lu. Les bonnes phrases s’appuient sur un fait précis et tournent vers l’action.

INSISTER — On peut reconnaître ce qui est légitime sans reconnaître de faute juridique.

TRANSITION — « Ces mots, on va les mettre dans un prompt. »`,
  `⏱ 4 min · LE PROMPT RÉCLAMATION (→ ×3)

OBJECTIF — Donner un prompt avec garde-fous pour les réclamations.

DIRE — Parcourir le prompt. → « Le contexte trié : faits, ressentis, demandes. » → « Les gestes listés : l’IA ne peut proposer que ceux-là. C’est le garde-fou le plus important. » → « Et le non bien dit : clair, et tourné vers une alternative. »

INSISTER — C’est en réclamation que l’IA peut le plus vous coûter : un geste inventé, une reconnaissance de faute. Relecture obligatoire.

TRANSITION — « Et à l’oral, ou en chat, quand ça monte ? »`,
  `⏱ 4 min · DÉSAMORCER (démo, → ×4)

OBJECTIF — Montrer les techniques de désamorçage et l’IA comme coach.

DIRE — Lire le premier message du client. → « Le conseiller ne relève pas l’insulte et reprend la main. » → « Il reformule et nomme l’émotion. » → « Il propose un choix : le client reprend le contrôle, la tension baisse. » → « Et si les insultes continuent ? On applique la procédure : votre respect compte aussi. »

ANIMATION — Demander si leur outil propose déjà des suggestions en temps réel.

TRANSITION — « Parfois, il faut passer la main. »`,
  `⏱ 3 min · PRÉPARER UNE ESCALADE (→ note)

OBJECTIF — Savoir quand escalader et rédiger une note efficace.

DIRE — Parcourir les six critères. « Escalader n’est pas un échec : c’est reconnaître les limites de votre délégation. » → « Voici la note générée par l’IA à partir du dossier : situation, déjà fait, demande, risque, proposition. Votre responsable décide en deux minutes, et le client n’a pas à tout réexpliquer. »

TRANSITION — « Place à l’entraînement. »`,
  `⏱ 3 min · S’ENTRAÎNER AVEC L’IA (jeu de rôle)

OBJECTIF — Présenter le prompt de simulation et les trois profils.

DIRE — « L’IA va jouer le client. Les règles sont importantes : elle reste dans son rôle, sa colère baisse seulement si vous reconnaissez la situation et proposez une solution. Et quand vous écrivez STOP, elle vous fait un retour. Trois profils : le furieux, le procédurier, le déçu silencieux, souvent le plus difficile car il ne se plaint plus. »

INSISTER — Données fictives uniquement. C’est un outil d’entraînement, à refaire seul après la formation.

TRANSITION — « À vous ! »`,
  `⏱ 20 min · ATELIER 3 (minuteur 20 min)

OBJECTIF — S’entraîner à mener une réclamation difficile et rédiger la réponse.

DIRE — « En binôme. A mène la conversation, B observe et note les phrases qui marchent. Puis on inverse. Ensuite, ensemble, la réponse écrite au cas le plus difficile, avec le prompt réclamation. »

ANIMATION — Passer dans les binômes, lire des extraits. Repérer une très bonne phrase à partager au débrief. Si l’IA est trop gentille, conseiller d’ajouter : « Sois plus difficile, interromps-moi. »

TRANSITION — « Débrief. »`,
  `⏱ 4 min · DÉBRIEF (grille d’auto-évaluation)

OBJECTIF — Auto-évaluer sa pratique et partager les phrases efficaces.

DIRE — « Cochez ce que vous avez réussi. Les ×2 sont les gestes qui apaisent le plus : reformuler avec un fait, nommer l’émotion, proposer une solution. » Faire partager une phrase qui a marché et une qui a fait monter la tension.

TRANSITION — « Petit quiz. »`,
  `⏱ 3 min · QUIZ MODULE 4 (4 questions)

OBJECTIF — Vérifier : geste inventé, reconnaissance sans faute, note d’escalade, usage de la simulation.

DIRE — Lire, faire voter, cliquer, commenter.

TRANSITION — « Ce qu’il faut retenir. »`,
  `⏱ 1 min · SYNTHÈSE MODULE 4

OBJECTIF — Récapituler.

DIRE — Lire les cinq points. « Gardez le prompt de simulation : c’est un excellent entraînement avant une semaine chargée. »

TRANSITION — « Module 5 : comment ne plus chercher la bonne information pendant dix minutes. »`,
  `⏱ 1 min · MODULE 5 · OUVERTURE DE SECTION · 14:30

OBJECTIF — Annoncer le module : capitaliser l’information.

DIRE — « Combien de temps passez-vous chaque jour à chercher une information ? Ce module, c’est la base de connaissances : la FAQ, les procédures, les scripts, les arbres de décision, et la recherche dans la documentation. L’IA est redoutable pour transformer un document touffu en réponses prêtes à l’emploi. »

TRANSITION — « Partons d’un problème que vous connaissez. »`,
  `⏱ 3 min · UNE QUESTION, CINQ RÉPONSES (→ ×6)

OBJECTIF — Faire ressentir le coût d’une information non partagée.

DIRE — Lire la question. → → → → → les cinq réponses. « Cinq conseillers, cinq réponses. Le client qui rappelle tombe sur quelqu’un d’autre et entend autre chose : il perd confiance. » → « La bonne réponse, c’est celle de la procédure. Une base de connaissances, c’est une seule vérité, accessible à tous. »

ANIMATION — Demander : « Ça vous arrive ? Sur quelle question ? »

TRANSITION — « Comment la construire vite ? En partant de vos documents. »`,
  `⏱ 3 min · DU DOCUMENT À LA FAQ (→ ×5)

OBJECTIF — Montrer la transformation d’un article de CGV en FAQ client.

DIRE — « À gauche, l’article 7 des conditions générales : juste, complet, illisible pour un client. Le prompt : transforme en FAQ, questions formulées comme un client, réponses courtes, rien d’ajouté. » → → → → les quatre questions. → « Et on vérifie : aucune condition oubliée, aucune ajoutée. Ici, l’exception des 30 kg est bien là. »

TRANSITION — « Mais quelles questions mettre dans la FAQ ? »`,
  `⏱ 3 min · LES VRAIES QUESTIONS FRÉQUENTES (→ ×2)

OBJECTIF — Utiliser les messages clients pour trouver les questions réelles.

DIRE — « On fournit à l’IA 200 messages anonymisés. Elle les regroupe par question, avec les mots des clients, et les compte. » → les barres. → « Et la découverte : deux des cinq questions les plus posées n’ont pas de réponse dans la FAQ. On commence par elles. »

INSISTER — Messages anonymisés, outil autorisé.

TRANSITION — « Pour les conseillers, les procédures. »`,
  `⏱ 3 min · PROCÉDURES PAS À PAS (→ ×5)

OBJECTIF — Transformer un paragraphe de procédure en étapes avec points de contrôle.

DIRE — « La procédure « colis non reçu » tient en une phrase de six lignes. Pendant un appel, impossible à suivre. » Dérouler les cinq étapes. « Chaque étape une action, et des points de contrôle en jaune : c’est là qu’on se trompe le plus. Notez l’exception à plus de 1 000 € : elle était cachée à la fin de la phrase. »

TRANSITION — « Au téléphone, on a besoin d’un script. »`,
  `⏱ 3 min · SCRIPTS DE RÉPONSE (→ ×5)

OBJECTIF — Produire une trame téléphonique à partir de la procédure.

DIRE — Dérouler : accueil, vérification, branche « si… alors », engagement, conclusion. « Ce n’est pas un texte à réciter : c’est une trame. Vous gardez votre voix ; le script garantit que vous n’oubliez aucune étape. »

TRANSITION — « Quand les cas se ramifient, un arbre de décision. »`,
  `⏱ 4 min · ARBRE DE DÉCISION (simulateur)

OBJECTIF — Faire vivre un arbre de décision et montrer qu’il mène toujours à une action.

DIRE — « Un client appelle : son appareil est en panne. » Faire répondre la salle à chaque question. Parcourir au moins deux chemins : risque → P1 ; puis livré il y a 3 semaines, sous garantie, panne non répertoriée → technicien sous 72 h. « Chaque branche se termine par une action. Le conseiller ne reste jamais bloqué. »

ANIMATION — Bouton « Recommencer » pour un autre chemin. Montrer le prompt qui génère l’arbre.

TRANSITION — « Et quand la documentation fait 40 pages ? »`,
  `⏱ 4 min · RECHERCHE DANS LA DOCUMENTATION (onglets)

OBJECTIF — Utiliser l’IA comme moteur de recherche documentaire fiable.

DIRE — « Trois règles : seulement le document, citer la section, et dire quand l’information est absente. » Onglet 1 : « Réponse avec ses sources : vous vérifiez en un clic. » Onglet 2 : « Question non couverte : l’IA le dit. C’est la meilleure réponse possible. »

INSISTER — Beaucoup d’outils professionnels intègrent cette recherche dans la base de l’entreprise : le principe est le même.

TRANSITION — « Dernier élément : le format des fiches. »`,
  `⏱ 2 min · LA FICHE DE CONNAISSANCE

OBJECTIF — Donner un gabarit standard de fiche.

DIRE — Parcourir les rubriques. « La question et les mots-clés avec les mots du client. Une réponse courte, les conditions, la source, et surtout la date et le responsable. Une fiche sans date finit par mentir. »

TRANSITION — « À vous : atelier 4. »`,
  `⏱ 2 min · LE KIT DE L’ATELIER 4

OBJECTIF — Présenter la note SAV-07 à transformer.

DIRE — « Voici une vraie note interne type : un seul paragraphe, neuf règles. Combien en trouvez-vous en le lisant ? » Laisser 30 secondes, recueillir. « L’IA va les extraire toutes, et vous allez vérifier. »

TRANSITION — « Les consignes. »`,
  `⏱ 15 min · ATELIER 4 (minuteur 15 min)

OBJECTIF — Produire une mini-base de connaissances à partir d’une documentation.

DIRE — « En binôme : listez les règles, générez la FAQ, l’arbre « panne » et une fiche KB. Et testez la recherche avec une question hors note. »

ANIMATION — Vérifier que les exceptions sont présentes (codes E3, E7, F2 ; 2e intervention ; frais de déplacement déductibles). Les neuf règles : garantie 2 ans ; panne < 14 jours = échange ; enlèvement pris en charge ; guide de dépannage d’abord ; E3/E7/F2 = technicien ; intervention sous 72 h, créneau 2 h, SMS la veille ; 2e échec = échange validé superviseur ; risque = mise hors tension + 24 h ; hors garantie = devis 49 € déductible (+ extension 3 ans).

TRANSITION — « Un quiz avant la pause. »`,
  `⏱ 3 min · QUIZ MODULE 5 (4 questions)

OBJECTIF — Vérifier : information absente, mots du client, fiabilité, arbre.

DIRE — Lire, faire voter, cliquer, commenter.

TRANSITION — « Synthèse, puis pause. »`,
  `⏱ 1 min · SYNTHÈSE MODULE 5 · 15:20

OBJECTIF — Récapituler.

DIRE — Lire les cinq points. « Après la pause, on prend de la hauteur : on va analyser des centaines de conversations pour améliorer le service. »

TRANSITION — Pause de quinze minutes.`,
  `⏱ 1 min · MODULE 6 · OUVERTURE DE SECTION · 15:35

OBJECTIF — Changer d’échelle : du message individuel à l’ensemble des échanges.

DIRE — « Jusqu’ici, on a traité les clients un par un. Maintenant, on prend de la hauteur : que nous disent des milliers d’échanges ? Synthèse d’appels, motifs de contact, réclamations, problèmes récurrents, reporting, et surtout des pistes d’amélioration. »

TRANSITION — « Ça commence par chaque appel. »`,
  `⏱ 3 min · SYNTHÈSE D’APPEL (→ ×2)

OBJECTIF — Montrer la synthèse automatique d’un appel et son intérêt collectif.

DIRE — « Une transcription d’appel : longue, répétitive, mais tout y est. » → « L’IA en tire six lignes : motif, cause, action, engagement, émotion, résolu ou non. Vous la relisez et la collez dans l’outil client. » → « Le vrai gain : toutes les fiches ont le même format. On peut les analyser par centaines. »

INSISTER — Beaucoup d’outils de téléphonie proposent désormais la transcription et la synthèse automatiques ; le conseiller relit toujours l’engagement pris.

TRANSITION — « Comment passe-t-on de centaines de fiches à des décisions ? »`,
  `⏱ 3 min · LE PIPELINE (→ ×4)

OBJECTIF — Poser la méthode de l’atelier 5.

DIRE — → « Les conversations, anonymisées. » → « L’analyse IA : chaque échange classé. » → « Les tendances : ce qui revient, ce qui monte. » → « Les recommandations : des actions. » « Et la répartition des rôles : l’IA lit et classe, le tableur compte, l’humain interprète et décide. »

INSISTER — Les modèles de langage peuvent se tromper dans les additions sur de gros volumes : on compte avec un tableur.

TRANSITION — « Premier résultat : les motifs de contact. »`,
  `⏱ 3 min · MOTIFS DE CONTACT (→ barres)

OBJECTIF — Lire une répartition des motifs et repérer les contacts évitables.

DIRE — « 2 812 contacts en une semaine, classés par l’IA dans une liste fermée. » → « Le suivi de livraison écrase tout. » « La question à se poser n’est pas « comment répondre plus vite ? » mais « comment éviter que le client ait besoin d’appeler ? ». »

ANIMATION — Demander : « Chez vous, quel est le motif n° 1 ? »

TRANSITION — « Ce chiffre mérite une page à lui seul. »`,
  `⏱ 1 min · GRAND CHIFFRE : 38 %

OBJECTIF — Marquer les esprits avec un chiffre clé (données fictives du cas).

DIRE — « 38 %. Plus d’un contact sur trois pose la même question : « Où est mon colis ? ». Un SMS de suivi automatique à chaque étape pourrait en éviter une bonne partie. C’est le genre d’enseignement qu’on ne voit pas en traitant les messages un par un. »

INSISTER — Données fictives de formation ; l’ordre de grandeur est fréquent dans le e-commerce, mais mesurez le vôtre.

TRANSITION — « Et les réclamations ? »`,
  `⏱ 3 min · TOP 3 DES IRRITANTS (→ ×4)

OBJECTIF — Montrer l’analyse des réclamations par irritant, avec verbatims.

DIRE — Dérouler du 3e au 1er. « Remboursement trop lent. Créneau non respecté. Et le premier : personne ne me rappelle. » → « L’irritant n° 1 n’est pas un produit : c’est une promesse non tenue par le service client lui-même. Bonne nouvelle : c’est celui sur lequel on a le plus de prise. »

ANIMATION — Les verbatims rendent les chiffres concrets : en lire un à voix haute.

TRANSITION — « L’IA peut aussi détecter un problème qui commence. »`,
  `⏱ 3 min · PROBLÈME RÉCURRENT (→ courbe, → alerte)

OBJECTIF — Illustrer la détection d’un signal faible.

DIRE — → « Les contacts mentionnant une fuite sur l’Aquaflow 8 : stables pendant cinq semaines, puis ça décroche. » → « L’alerte : ×5 en deux semaines, et l’IA a relevé dans les verbatims un point commun, le joint de hublot. Actions : alerte qualité, fiche pour les conseillers, et contact proactif des acheteurs. »

INSISTER — Plus on détecte tôt, moins il y a de réclamations, et de clients perdus.

TRANSITION — « Tout ça se retrouve dans le reporting. »`,
  `⏱ 4 min · REPORTING (démo)

OBJECTIF — Montrer la répartition indicateurs (tableur) / récit (IA).

DIRE — « En haut, les indicateurs calculés : volume, délai de première réponse, résolution au premier contact, satisfaction. En bas, le prompt : trois faits, un signal faible, trois recommandations, et surtout « n’invente aucun chiffre ». Et la synthèse, relue avant envoi. »

ANIMATION — Les chiffres s’animent. Demander qui produit un reporting chez eux, et combien de temps ça prend.

TRANSITION — « Les recommandations, justement. »`,
  `⏱ 3 min · PISTES D’AMÉLIORATION (→ ×3)

OBJECTIF — Transformer un irritant en action mesurable.

DIRE — Dérouler les trois lignes : irritant, cause probable, action, responsable, indicateur. « La cause est une hypothèse : on la vérifie avec les équipes. Et sans indicateur, on ne saura jamais si l’action a marché. »

TRANSITION — « À vous : atelier 5. »`,
  `⏱ 2 min · LE KIT DE L’ATELIER 5

OBJECTIF — Présenter les conversations à analyser.

DIRE — « Quarante conversations anonymisées de la semaine 42 ; en voici douze. Vous reconnaissez des thèmes ? Il y a aussi des messages positifs : ils disent ce qui marche. »

TRANSITION — « Les consignes. »`,
  `⏱ 15 min · ATELIER 5 (minuteur 15 min)

OBJECTIF — Réaliser le pipeline complet : conversations → analyse IA → tendances → recommandations.

DIRE — « En binôme. Classement en tableau, comptage au tableur, tendances et signal faible, puis trois recommandations que vous challengez. »

ANIMATION — Vérifier : liste fermée de catégories, comptages faits hors IA, signal Aquaflow repéré (3 mentions sur 40 dans le kit), recommandations avec responsable et indicateur.

TRANSITION — « Quiz. »`,
  `⏱ 3 min · QUIZ MODULE 6 (4 questions)

OBJECTIF — Vérifier : comptage, anonymisation, hypothèse, recommandation.

DIRE — Lire, faire voter, cliquer, commenter.

TRANSITION — « Synthèse. »`,
  `⏱ 1 min · SYNTHÈSE MODULE 6

OBJECTIF — Récapituler.

DIRE — Lire les cinq points. « Dernier module : on assemble tout sur le cas fil rouge, et on fait le point sur les bonnes pratiques. »

TRANSITION — « Module 7. »`,
  `⏱ 1 min · MODULE 7 · OUVERTURE DE SECTION · 16:25

OBJECTIF — Annoncer la mise en pratique finale et les bonnes pratiques.

DIRE — « Dernier module. On assemble tout sur un parcours complet, de la demande à la satisfaction. Et on fixe les règles du jeu : confidentialité, contrôle humain, limites de l’IA. Puis atelier 6, le cas fil rouge final. »

TRANSITION — « Retour sur Mme Moreau. »`,
  `⏱ 4 min · LE PARCOURS COMPLET (onglets 1 → 6)

OBJECTIF — Visualiser les six étapes du programme sur le cas fil rouge.

DIRE — Cliquer chaque onglet. Demande, analyse, réponse, validation, suivi, satisfaction. À chaque étape, la répartition : ce que fait l’IA, ce que vous faites. Insister sur l’étape 6 : « L’avis 4/5 contient un irritant : il a fallu écrire deux fois. C’est lui qui a tout aggravé, et il remonte dans le reporting du module 6. »

INSISTER — La boucle est bouclée : l’analyse de satisfaction améliore le traitement des prochaines demandes.

TRANSITION — « Avant de vous lâcher sur le cas final, les règles. D’abord, les données. »`,
  `⏱ 4 min · CONFIDENTIALITÉ : JEU DE TRI (→ corrigé)

OBJECTIF — Savoir quelles données donner, remplacer ou ne jamais donner à l’IA.

DIRE — « Même dans l’outil autorisé, on applique le principe de minimisation : seulement ce qui est utile à la réponse. » Faire glisser les étiquettes par des volontaires, discuter les hésitations. → corrigé.

INSISTER — Données bancaires, mots de passe, données de santé : jamais. Les données de santé sont des données sensibles au sens du RGPD.

TRANSITION — « Comment remplacer vite ? »`,
  `⏱ 2 min · ANONYMISER (interrupteur)

OBJECTIF — Montrer une anonymisation rapide et efficace.

DIRE — Basculer. « On remplace par des crochets : l’IA garde le sens. On supprime ce qui ne sert à rien, comme la carte bancaire. Et on remet les vraies valeurs dans la réponse finale, dans l’outil client. »

TRANSITION — « Deuxième règle : le contrôle humain. »`,
  `⏱ 3 min · CONTRÔLE HUMAIN (→ ×3)

OBJECTIF — Clarifier qui décide quoi.

DIRE — → « Niveau 1 : l’IA m’aide, rien ne part au client. » → « Niveau 2 : je valide, toute réponse envoyée est relue. » → « Niveau 3 : je décide ; l’IA ne fait que préparer. Gestes, exceptions, clients vulnérables, litiges. » « Et dans tous les cas, la réponse part sous votre nom. »

TRANSITION — « Troisième point : les limites. »`,
  `⏱ 3 min · LIMITES ET PARADES (cartes, → retourne tout)

OBJECTIF — Récapituler les limites de l’IA et les parades vues dans la journée.

DIRE — Pour chaque carte, demander la parade avant de retourner. C’est une révision active de la journée. Insister sur la dernière : « Gardez la main. Une IA qui écrit tout à votre place, c’est une compétence que vous perdez. »

TRANSITION — « Tout ça tient en une charte. »`,
  `⏱ 2 min · CHARTE DE BONNES PRATIQUES

OBJECTIF — Donner un aide-mémoire personnel.

DIRE — « Dix règles. Cochez celles que vous appliquez déjà. Les autres sont vos objectifs. Photographiez la page. »

TRANSITION — « Place au cas final. »`,
  `⏱ 2 min · LE KIT DE L’ATELIER 6

OBJECTIF — Présenter le cas Ferreira et son piège.

DIRE — Lire le message lentement. « Qu’est-ce qui change par rapport à Mme Moreau ? » Laisser répondre : une personne âgée, une donnée de santé, un vendredi soir, une urgence réelle. « Vous avez la note SAV-07, vos prompts, la charte. Et après la résolution, l’avis de la cliente : 3 sur 5. »

TRANSITION — « Les consignes. »`,
  `⏱ 20 min · ATELIER 6 (minuteur 20 min)

OBJECTIF — Traiter une demande de bout en bout, en appliquant la charte.

DIRE — « Six étapes, en binôme. L’IA vous aide à chaque étape, mais certaines décisions sont à vous : lesquelles ? »

ANIMATION — Vérifier : l’insuline et le téléphone ne sont pas collés dans l’IA (on écrit « cliente vulnérable, besoin urgent de froid ») ; la priorité est P1 (fragilité + santé) ; une escalade est faite pour une solution d’urgence (intervention samedi, prêt d’appareil, geste) ; l’amélioration tirée de l’avis porte sur la prise en charge le week-end des clients vulnérables.

TRANSITION — « Restitution. »`,
  `⏱ 8 min · RESTITUTION (→ ×3 questions, minuteur 2 min par binôme)

OBJECTIF — Partager les traitements et valoriser les bonnes décisions.

DIRE — « Deux minutes, trois questions. » Lancer le minuteur pour chaque binôme. Après chaque passage, une remarque positive et une question.

INSISTER — Le point clé : vulnérabilité repérée, donnée de santé protégée, escalade avant lundi.

ANIMATION — Si le groupe est grand, faire passer 4 binômes et recueillir les autres améliorations à l’oral.

TRANSITION — « Il est temps de mesurer le chemin parcouru. »`,
  `⏱ 6 min · QUIZ FINAL (8 questions) · 17:15

OBJECTIF — Évaluer les acquis sur l’ensemble de la journée.

DIRE — « Huit questions, une par grand thème de la journée. On vote à main levée, puis je clique. Le score « du premier coup » est celui du groupe. »

ANIMATION — Rythme rapide : 40 secondes par question. Commenter brièvement les erreurs fréquentes.

TRANSITION — « Et vous, où en êtes-vous ? »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT FINAL

OBJECTIF — Mesurer la progression (même grille que ce matin).

DIRE — « Les mêmes huit affirmations que ce matin. Cochez ce que vous savez faire maintenant. Comparez avec votre score de départ. » Demander qui a progressé de 3 points ou plus.

TRANSITION — « Le plus important : ce que vous ferez lundi. »`,
  `⏱ 3 min · PLAN D’ACTION

OBJECTIF — Ancrer le transfert en situation de travail.

DIRE — « Trois usages, pas plus. Le meilleur est celui que vous ferez vraiment, tous les jours. Notez-les, et faites le point dans quinze jours. Votre document contient tous les prompts de la journée : c’est votre boîte à outils. »

ANIMATION — Faire lire trois ou quatre plans d’action à voix haute.

TRANSITION — « Pour finir. »`,
  `⏱ 3 min · MERCI · 17:30

OBJECTIF — Conclure sur le message clé et recueillir l’évaluation.

DIRE — « Merci pour votre énergie et votre participation. Si vous ne retenez qu’une phrase : l’IA propose, vous disposez. Elle vous fait gagner du temps sur ce qui se répète ; vous gardez l’écoute, le jugement et la relation. Merci de remplir le questionnaire d’évaluation, et n’hésitez pas à revenir vers moi avec vos questions. »

ANIMATION — Distribuer ou afficher le lien du questionnaire d’évaluation. Rappeler de sauvegarder le document de prompts.`,
];
