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
const FONT_LINK_ID = 'osd-webfont-copilot-avance';
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
const SLIDE_ID = 'copilot-avance';
const P = 'cop'; // CSS class prefix, unique per deck
const COURSE = 'GitHub Copilot · Niveau avancé';
const AUTHOR = 'Houssem Eddine LASSOUED';
const PROJECT = 'SalleLibre';

// Module numbers: 0 = ouverture, 1–3 = matinée, 8 = reprise, 4–6 = après-midi, 7 = clôture.
const MOD_TITLES: Record<number, string> = {
  1: 'Prompt engineering avancé',
  2: 'Modules & architectures',
  3: 'Automatiser les tests',
  4: 'Optimisation & refactoring',
  5: 'Sécurité & audit',
  6: 'Copilot en équipe',
  7: 'Synthèse & clôture',
  8: 'Reprise',
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
// The "≡" mark: three equal rounded bars, staggered — middle one furthest right,
// bottom one furthest left (geometry measured on the official logo).
const DAP_MARK_RATIO = 58 / 30;
const DapMark = ({ h = 28, color = C.electric, cls, style }: { h?: number; color?: string; cls?: string; style?: CSSProperties }) => (
  <svg width={h * DAP_MARK_RATIO} height={h} viewBox="0 0 58 30" className={cls} style={{ display: 'block', flex: 'none', ...style }} aria-hidden>
    <rect x={6} y={0} width={40} height={6} rx={3} fill={color} />
    <rect x={16} y={12} width={42} height={6} rx={3} fill={color} />
    <rect x={0} y={24} width={42} height={6} rx={3} fill={color} />
  </svg>
);

// "DOCAPOSTE Institute" lockup: wordmark, the mark at the top-right of the
// final E (its bottom bar on the cap line), "Institute" right-aligned below.
// `size` is the DOCAPOSTE font size; Montserrat cap height = 0.7 em.
const DAP_LS = 0.09; // wordmark letter-spacing (em)
const DapLogo = ({ size = 26, color = C.electric }: { size?: number; color?: string }) => {
  const markH = size * 0.47;
  return (
    <div
      role="img"
      aria-label="Docaposte Institute"
      style={{ display: 'inline-flex', flex: 'none', paddingTop: size * 0.25, paddingRight: size * 1.02, color, fontFamily: display, lineHeight: 1 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <span
          style={{
            position: 'relative',
            fontWeight: 600,
            fontSize: size,
            letterSpacing: `${DAP_LS}em`,
            marginRight: `-${DAP_LS}em`,
            whiteSpace: 'nowrap',
          }}
        >
          DOCAPOSTE
          <DapMark
            h={markH}
            color={color}
            style={{ position: 'absolute', left: `calc(100% + ${size * (0.11 - DAP_LS)}px)`, top: size * -0.24 }}
          />
        </span>
        <span style={{ fontWeight: 500, fontSize: size * 0.95, letterSpacing: '0.02em', marginRight: '-0.02em', marginTop: size * -0.12, whiteSpace: 'nowrap' }}>
          Institute
        </span>
      </div>
    </div>
  );
};

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
const MiniMark = ({ size = 22 }: { size?: number }) => <DapMark h={Math.round(size * 0.62)} color={C.electric} />;

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
  lab: { label: 'TP fil rouge', tone: 'green' as Tone, icon: 'code' as IconName },
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

const ProgLabel = ({ children }: { children: ReactNode }) => (
  <span style={{ fontFamily: display, fontWeight: 700, fontSize: 15, letterSpacing: '0.12em', color: C.muted, margin: '0 6px 0 4px' }}>{children}</span>
);

// Matinée M1–M3 · après-midi M4–M6.
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
        <DapLogo size={19} />
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
          {n <= 3 ? 'MODULE · MATINÉE' : 'MODULE · APRÈS-MIDI'}
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
            TP fil rouge
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

// ─── Language tabs: one dark code panel, switchable stack (TS / Py / Java / C#) ─
const LangCtx = createContext<{ cur: string; set: (l: string) => void } | null>(null);

const LangTabs = ({ initial, children, cls, style }: { initial: string; children: ReactNode; cls?: string; style?: CSSProperties }) => {
  const [cur, set] = useState(initial);
  return (
    <LangCtx.Provider value={{ cur, set }}>
      <div className={cls} style={style}>
        {children}
      </div>
    </LangCtx.Provider>
  );
};

const LangBtn = ({ lang, tone = 'blue' }: { lang: string; tone?: Tone }) => {
  const ctx = useContext(LangCtx);
  const on = ctx?.cur === lang;
  return (
    <button
      type="button"
      data-osd-interactive
      onClick={(e) => {
        e.currentTarget.blur();
        ctx?.set(lang);
      }}
      style={{
        border: 'none',
        cursor: 'pointer',
        padding: '9px 20px',
        borderRadius: 10,
        fontFamily: mono,
        fontWeight: 700,
        fontSize: 20,
        background: on ? STRONG[tone] : C.card,
        color: on ? '#fff' : C.soft,
        boxShadow: on ? '0 6px 16px -10px rgba(11,31,92,.6)' : `inset 0 0 0 1.5px ${C.rule}`,
        transition: `all 200ms ${EASE}`,
      }}
    >
      {lang}
    </button>
  );
};

// Shown only while its language is selected.
const LangPane = ({ lang, children }: { lang: string; children: ReactNode }) => {
  const ctx = useContext(LangCtx);
  if (ctx?.cur !== lang) return null;
  return (
    <div className={A.fade} style={{ animationDuration: '350ms' } as CSSProperties}>
      {children}
    </div>
  );
};

// ─── TP briefing page ───────────────────────────────────────────────────────
const DEFIS = {
  trous: { label: 'Prompt à trous', icon: 'puzzle' as IconName, tone: 'blue' as Tone, aide: 'Complétez chaque [___] : chaque trou est une décision à prendre.' },
  construire: { label: 'Prompt à construire', icon: 'layers' as IconName, tone: 'green' as Tone, aide: 'Assemblez les ingrédients : rôle, contexte ciblé, tâche, format, critère de fin.' },
  ameliorer: { label: 'Prompt à améliorer', icon: 'trend' as IconName, tone: 'yellow' as Tone, aide: 'Ce prompt fonctionne mal : trouvez ses défauts, puis réécrivez-le.' },
  inverse: { label: 'Rétro-prompt', icon: 'reset' as IconName, tone: 'violet' as Tone, aide: 'Partez du résultat attendu et retrouvez le prompt qui le produit.' },
  qcm: { label: 'QCM', icon: 'check' as IconName, tone: 'teal' as Tone, aide: 'Choisissez, vérifiez : chaque réponse est corrigée et expliquée.' },
  verification: { label: 'Prompt fourni à tester', icon: 'search' as IconName, tone: 'coral' as Tone, aide: 'Le prompt est donné : lancez-le et observez ce qui part vraiment au modèle.' },
  squelette: { label: 'Fichier à compléter', icon: 'doc' as IconName, tone: 'navy' as Tone, aide: 'Complétez le fichier de configuration Copilot : chaque champ compte.' },
  generer: { label: 'Génération guidée', icon: 'layers' as IconName, tone: 'blue' as Tone, aide: 'Plan validé d’abord, puis génération par lots : chaque lot compile et se vérifie.' },
  tests: { label: 'Suite de tests', icon: 'flask' as IconName, tone: 'pink' as Tone, aide: 'Matrice de cas d’abord, génération ensuite, couverture pour finir.' },
  refacto: { label: 'Refactoring', icon: 'wand' as IconName, tone: 'violet' as Tone, aide: 'Tests au vert avant et après chaque étape : le comportement ne bouge pas.' },
  audit: { label: 'Audit de sécurité', icon: 'shield' as IconName, tone: 'coral' as Tone, aide: 'Trouvez, prouvez, corrigez : chaque faille reçoit un test qui l’empêche de revenir.' },
  soutenance: { label: 'Soutenance', icon: 'flag' as IconName, tone: 'navy' as Tone, aide: 'Présentez, montrez les preuves, défendez vos choix face au groupe.' },
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
      <span style={{ color: C.green }}>TP {n}</span> · {title}
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
      <Timer id={`tp-${n}`} minutes={minutes} label={`TP ${n}`} compact cls={A.right} style={dl(200)} />
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
      <Icon name="code" size={20} color={C.electric} /> Fil rouge <strong style={{ color: C.navy }}>{PROJECT}</strong> · stack au choix :{' '}
      <span style={{ fontFamily: mono, color: C.electric }}>TypeScript · Python · Java · C#</span>
    </div>
  </Frame>
);

// Bonus line inside a TP's "Le défi" panel (the right column has no room left).
const TpBonus = ({ children }: { children: ReactNode }) => (
  <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'flex-start', background: T.pink.bg, borderRadius: 12, padding: '12px 16px', fontSize: 21, lineHeight: 1.42, color: C.ink }}>
    <Icon name="sparkles" size={24} color={T.pink.fg} style={{ marginTop: 2 }} />
    <span>
      <strong style={{ color: T.pink.fg }}>Bonus · </strong>
      {children}
    </span>
  </div>
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

// ═══ 00-open ═══════════════════════════════════════════════════════════

// ─── Ouverture ──────────────────────────────────────────────────────────────

const O_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={170} r={46} cls={A.fade} />
    <Outline x={-40} y={760} w={120} h={360} r={40} color="#AEB9E6" />
    <div style={{ position: 'absolute', left: 390, top: 140, width: 1420 }}>
      <div className={A.in} style={{ display: 'flex', gap: 12 }}>
        <Tag tone="violet" size={22}>
          <Icon name="calendar" size={22} /> Formation · 1 jour · 7 h
        </Tag>
        <Tag tone="blue" size={22}>
          <Icon name="bolt" size={22} /> Niveau avancé
        </Tag>
      </div>
      <h1
        className={A.in}
        style={{
          margin: '34px 0 0',
          fontFamily: display,
          fontWeight: 800,
          fontSize: 96,
          lineHeight: 1.06,
          letterSpacing: '-0.02em',
          color: C.navy,
          ...dl(120),
        }}
      >
        GitHub Copilot
        <br />
        <span style={{ color: C.plum }}>niveau avancé</span>
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 30, lineHeight: 1.45, color: C.soft, maxWidth: 1000, ...dl(240) }}>
        Prompts structurés, architectures, tests, refactoring, sécurité et travail d’équipe :
        passer de l’assistant qu’on utilise à <strong style={{ color: C.navy }}>l’outil qu’on maîtrise</strong>.
      </p>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 1360, top: 560, ...dl(900) }}>
      <div style={{ transform: 'rotate(-7deg)', fontFamily: '"Mr Dafoe", "Segoe Script", cursive', fontSize: 78, color: C.electric, lineHeight: 1 }}>
        Together we grow
      </div>
    </div>
    <Portrait w={170} x={390} y={640} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 664, ...dl(300) }}>
      <Eyebrow c={C.muted} size={20}>
        Formateur
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>Docaposte Institute · IA appliquée au développement</div>
      <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
        <Tag tone="blue" size={19}>
          <Icon name="chat" size={19} /> Prompts
        </Tag>
        <Tag tone="pink" size={19}>
          <Icon name="flask" size={19} /> Tests
        </Tag>
        <Tag tone="coral" size={19}>
          <Icon name="shield" size={19} /> Sécurité
        </Tag>
        <Tag tone="green" size={19}>
          <Icon name="users" size={19} /> Équipe
        </Tag>
      </div>
    </div>
    <div className={A.pop} style={{ position: 'absolute', left: 1500, top: 720, ...dl(600) }}>
      <DapLogo size={40} />
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
    <Title>Bienvenue ! Une journée pour passer un cap</Title>
    <Lede>Vous utilisez déjà Copilot. Aujourd’hui, on le pousse dans ses retranchements… et on apprend à s’en méfier.</Lede>
    <Portrait w={230} x={130} y={300} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 130, top: 615, width: 300, ...dl(200) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy, lineHeight: 1.2 }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 22, color: C.soft, lineHeight: 1.4 }}>Votre formateur pour la journée</div>
    </div>
    <div style={{ position: 'absolute', left: 520, top: 300, width: 1280, display: 'flex', gap: 26 }}>
      <OPromise value={<CountUp to={7} suffix=" h" />} label="de formation intensive : 60 % d’apports et de démos, 40 % de pratique" tone="blue" d={150} />
      <OPromise value={<CountUp to={6} />} label="TP enchaînés sur le même projet fil rouge, du prompt à la CI" tone="green" d={280} />
      <OPromise value={<CountUp to={1} />} label="feature complète (code, tests, doc, sécurité) défendue devant le groupe" tone="violet" d={410} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 520, top: 640, width: 1280, ...dl(600) }}>
      <Callout title="Notre contrat" tone="blue" icon="hand">
        Vous repartez avec des prompts éprouvés, des fichiers d’équipe réutilisables et une méthode de vérification.
        Le formateur montre, vous pratiquez : <strong>c’est vous qui tenez le clavier</strong>.
      </Callout>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 520, top: 860, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.muted, ...dl(800) }}>
      <Icon name="bulb" size={26} color={C.violet} />
      Fil conducteur : « Copilot propose, le développeur dispose… et prouve. »
    </div>
  </Frame>
);

// ─── Tour de table ──────────────────────────────────────────────────────────
const O_Poll: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Tour de table : qui êtes-vous, qu’attendez-vous ?</Title>
    <Lede>Main levée (ou réaction dans le chat) : cliquez une ligne par vote. Le « − » retire un vote.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 760 }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Ma stack pour les TP
      </Eyebrow>
      <Poll>
        <PollRow id="o-s1" label="TypeScript / Node" tone="blue" icon="code" />
        <PollRow id="o-s2" label="Python" tone="yellow" icon="code" />
        <PollRow id="o-s3" label="Java / Kotlin" tone="coral" icon="code" />
        <PollRow id="o-s4" label="C# / .NET" tone="violet" icon="code" />
        <PollRow id="o-s5" label="Autre (Go, PHP…)" tone="grey" icon="plus" />
      </Poll>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 940, top: 270, width: 860, ...dl(200) }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Mon attente n° 1
      </Eyebrow>
      <Poll>
        <PollRow id="o-a1" label="Des prompts qui marchent du premier coup" tone="blue" icon="chat" />
        <PollRow id="o-a2" label="Générer des modules propres et cohérents" tone="teal" icon="layers" />
        <PollRow id="o-a3" label="Des tests générés qui servent vraiment" tone="pink" icon="flask" />
        <PollRow id="o-a4" label="Refactorer et moderniser du legacy" tone="violet" icon="wand" />
        <PollRow id="o-a5" label="Sécuriser le code produit par l’IA" tone="coral" icon="shield" />
        <PollRow id="o-a6" label="Cadrer l’usage dans mon équipe" tone="green" icon="users" />
      </Poll>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(500) }}>
      Les binômes se forment par stack : même langage, deux profils différents si possible.
    </Hint>
  </Frame>
);

// ─── Objectifs ──────────────────────────────────────────────────────────────
const OObj = ({ n, tone, children, d }: { n: number; tone: Tone; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 22, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 26px', ...dl(d) }}>
    <Num n={n} tone={tone} size={52} />
    <div style={{ fontSize: 28, lineHeight: 1.32, color: C.ink }}>{children}</div>
  </div>
);

const OBar = ({ label, value, pct, bg, c, d }: { label: string; value: string; pct: number; bg: string; c: string; d: number }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: C.ink }}>
      <span>{label}</span>
      <strong style={{ color: c }}>{value}</strong>
    </div>
    <div style={{ marginTop: 8, height: 22, borderRadius: 11, background: C.panel, overflow: 'hidden' }}>
      <div className={A.grow} style={{ width: `${pct}%`, height: '100%', background: bg, ...dl(d) }} />
    </div>
  </div>
);

const O_Objectifs: Page = () => (
  <Frame mod={0}>
    <Title>Objectifs de la formation</Title>
    <Lede>À l’issue de la journée, vous saurez :</Lede>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1080, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <OObj n={1} tone="blue" d={100}>
        <strong>Maîtriser le prompt engineering avancé</strong> pour des suggestions de qualité
      </OObj>
      <OObj n={2} tone="teal" d={200}>
        <strong>Générer des architectures et modules</strong> complexes et maintenables
      </OObj>
      <OObj n={3} tone="pink" d={300}>
        <strong>Automatiser les tests</strong> unitaires, d’intégration et les mocks
      </OObj>
      <OObj n={4} tone="violet" d={400}>
        <strong>Optimiser, sécuriser et auditer</strong> le code généré par l’IA
      </OObj>
      <OObj n={5} tone="green" d={500}>
        <strong>Intégrer Copilot</strong> dans les workflows CI/CD et les pratiques d’équipe
      </OObj>
      <OObj n={6} tone="coral" d={600}>
        <strong>Identifier et contourner les limites</strong> de Copilot sur les projets complexes
      </OObj>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1260, top: 260, width: 540, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 32px', ...dl(300) }}>
      <Eyebrow c={C.navy}>Équilibre de la journée</Eyebrow>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <OBar label="Apports, démos, cas réels" value="60 %" pct={60} bg={G.blue} c={C.blue} d={600} />
        <OBar label="TP et mises en situation" value="40 %" pct={40} bg={G.green} c={C.green} d={750} />
      </div>
      <div style={{ marginTop: 28, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
        Évaluation continue : questions orales, QCM à chaque module, TP, soutenance finale. Auto-positionnement au début et à la fin.
      </div>
    </div>
  </Frame>
);

// ─── Programme de la journée ────────────────────────────────────────────────
const OSlot = ({ t, mod, title, sub, tone, d }: { t: string; mod?: string; title: ReactNode; sub?: ReactNode; tone: Tone; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 18, ...dl(d) }}>
    <span style={{ flex: 'none', width: 82, fontFamily: mono, fontSize: 23, color: C.muted, paddingTop: 4 }}>{t}</span>
    <span style={{ flex: 'none', width: 12, height: 12, marginTop: 11, borderRadius: 99, background: STRONG[tone] }} />
    <div>
      <div style={{ fontSize: 27, fontWeight: 600, color: C.ink, lineHeight: 1.3 }}>
        {mod ? <span style={{ fontFamily: display, fontWeight: 800, color: STRONG[tone], marginRight: 10 }}>{mod}</span> : null}
        {title}
      </div>
      {sub ? <div style={{ fontSize: 22, color: C.muted, lineHeight: 1.38, marginTop: 4 }}>{sub}</div> : null}
    </div>
  </div>
);

const OHalf = ({ icon, tone, title, sub, d, children }: { icon: IconName; tone: Tone; title: string; sub: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
      <IconTile name={icon} tone={tone} size={50} solid />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</div>
        <div style={{ fontSize: 21, color: C.muted }}>{sub}</div>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>{children}</div>
  </div>
);

const O_Programme: Page = () => (
  <Frame mod={0}>
    <Title>Le programme de la journée</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'flex', gap: 60 }}>
      <OHalf icon="chat" tone="blue" title="Matinée" sub="Prompt engineering et génération avancée" d={0}>
        <OSlot t="9:00" title={`Ouverture · fil rouge ${PROJECT}`} tone="grey" d={150} />
        <OSlot t="9:20" mod="M1" title="Prompt engineering avancé" sub="Contexte, prompts structurés, multi-étapes · TP 1" tone="blue" d={250} />
        <OSlot t="10:30" title="Pause" tone="yellow" d={330} />
        <OSlot t="10:45" mod="M2" title="Modules & architectures" sub="Arborescence, API REST, patterns · TP 2" tone="teal" d={400} />
        <OSlot t="11:40" mod="M3" title="Automatiser les tests" sub="Unitaires, mocks, intégration, couverture · TP 3" tone="pink" d={500} />
      </OHalf>
      <OHalf icon="shieldCheck" tone="violet" title="Après-midi" sub="Sécurité, optimisation et intégration équipe" d={200}>
        <OSlot t="13:30" title="Reprise · quiz flash de la matinée" tone="grey" d={450} />
        <OSlot t="13:40" mod="M4" title="Optimisation & refactoring" sub="Anti-patterns, SOLID, performance, legacy · TP 4" tone="violet" d={550} />
        <OSlot t="14:30" mod="M5" title="Sécurité & audit" sub="OWASP, failles du code généré, licences · TP 5" tone="coral" d={650} />
        <OSlot t="15:40" mod="M6" title="Copilot en équipe" sub="Conventions, PR, CI/CD, mesure, charte · TP 6" tone="green" d={750} />
        <OSlot t="16:30" title="Soutenances · synthèse · évaluation" tone="navy" d={850} />
      </OHalf>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 905, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(1000) }}>
      <Icon name="map" size={24} color={C.electric} />
      Le bandeau en haut à droite indique toujours où nous en sommes : M1 → M3 le matin, M4 → M6 l’après-midi.
    </div>
  </Frame>
);

// ─── Auto-positionnement ────────────────────────────────────────────────────
const O_AutoPos: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Auto-positionnement : votre point de départ</Title>
    <Lede>Cochez ce que vous savez déjà faire aujourd’hui, honnêtement. On refera l’exercice en fin de journée.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="ap1" size={27}>Expliquer ce que Copilot « voit » quand il propose une complétion</CheckItem>
        <CheckItem id="ap2" size={27}>Découper une tâche complexe en une suite de prompts vérifiables</CheckItem>
        <CheckItem id="ap3" size={27}>Faire générer un module qui respecte l’architecture existante</CheckItem>
        <CheckItem id="ap4" size={27}>Obtenir des tests qui couvrent cas limites et cas négatifs</CheckItem>
        <CheckItem id="ap5" size={27}>Refactorer du code généré en appliquant SOLID, tests au vert</CheckItem>
        <CheckItem id="ap6" size={27}>Repérer une injection ou un contrôle d’accès manquant dans une suggestion</CheckItem>
        <CheckItem id="ap7" size={27}>Partager instructions et prompts d’équipe via le dépôt</CheckItem>
        <CheckItem id="ap8" size={27}>Mesurer l’apport réel de Copilot sur une équipe</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau de départ"
          levels={[
            { min: 0, text: 'Utilisateur régulier : on va structurer.', tone: 'grey' },
            { min: 3, text: 'Utilisateur confirmé : on va industrialiser.', tone: 'blue' },
            { min: 6, text: 'Expert : visez les bonus de chaque TP.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Notez votre score : il servira de référence pour mesurer votre progression à 16:50.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Le fil rouge SalleLibre ────────────────────────────────────────────────
const OFeat = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 18, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={56} />
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, color: C.soft, lineHeight: 1.35 }}>{children}</div>
    </div>
  </div>
);

const OStep = ({ n, tone, title, out, d }: { n: number; tone: Tone; title: string; out: string; d: number }) => (
  <div className={A.right} style={{ display: 'flex', alignItems: 'center', gap: 16, ...dl(d) }}>
    <Num n={n} tone={tone} size={44} />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, color: C.muted }}>{out}</div>
    </div>
  </div>
);

const O_FilRouge: Page = () => (
  <Frame mod={0}>
    <Title>
      Le fil rouge : <span style={{ color: C.green }}>{PROJECT}</span>, l’API de réservation de salles
    </Title>
    <Lede>Une seule base de code toute la journée : chaque TP s’appuie sur le précédent.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 860, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <OFeat icon="map" tone="blue" title="Salles" d={100}>
        Catalogue, capacité, équipements · CRUD réservé aux admins
      </OFeat>
      <OFeat icon="calendar" tone="violet" title="Réservations" d={200}>
        Créneaux sans chevauchement, heures ouvrées, annulation
      </OFeat>
      <OFeat icon="lock" tone="coral" title="Authentification JWT et rôles" d={300}>
        Membre ou admin · chacun ne gère que ses réservations
      </OFeat>
      <OFeat icon="search" tone="teal" title="Recherche de salles libres" d={400}>
        Par date, durée, capacité : le cœur algorithmique
      </OFeat>
      <OFeat icon="doc" tone="green" title="Documentation OpenAPI" d={500}>
        Générée, relue, à jour
      </OFeat>
      <div className={A.fade} style={{ display: 'flex', gap: 10, marginTop: 4, ...dl(700) }}>
        <Tag tone="navy" size={19}>TypeScript · Express</Tag>
        <Tag tone="navy" size={19}>Python · FastAPI</Tag>
        <Tag tone="navy" size={19}>Java · Spring Boot</Tag>
        <Tag tone="navy" size={19}>C# · ASP.NET Core</Tag>
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1060, top: 270, width: 740, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(200) }}>
      <Eyebrow c={C.navy} size={20}>
        Votre parcours
      </Eyebrow>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <OStep n={1} tone="blue" title="Prompts avancés" out="Bibliothèque de prompts mesurés" d={300} />
        <OStep n={2} tone="teal" title="API complète" out="Routes, auth, validation, OpenAPI" d={400} />
        <OStep n={3} tone="pink" title="Suite de tests" out="Unitaires, mocks, intégration" d={500} />
        <OStep n={4} tone="violet" title="Refactoring" out="SOLID, performance, tests au vert" d={600} />
        <OStep n={5} tone="coral" title="Audit de sécurité" out="Failles trouvées, prouvées, corrigées" d={700} />
        <OStep n={6} tone="green" title="Feature défendue" out="PR, CI, documentation, soutenance" d={800} />
      </div>
    </div>
  </Frame>
);

// ─── Check-up technique ─────────────────────────────────────────────────────
const O_Setup: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Check-up technique : trois minutes avant de coder</Title>
    <Lede>Tout ce qui n’est pas prêt maintenant vous coûtera dix minutes en plein TP.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="su1" size={26}>VS Code à jour, extension GitHub Copilot connectée (Chat inclus)</CheckItem>
        <CheckItem id="su2" size={26}>Vue Chat : modes Ask, Plan et Agent visibles, sélecteur de modèle actif</CheckItem>
        <CheckItem id="su3" size={26}>Runtime de votre stack : Node 22, Python 3.12, JDK 21 ou .NET 8+</CheckItem>
        <CheckItem id="su4" size={26}>Framework de test prêt : Jest/Vitest, pytest, JUnit 5 ou xUnit</CheckItem>
        <CheckItem id="su5" size={26}>Dépôt Git « sallelibre » initialisé, premier commit poussé</CheckItem>
        <CheckItem id="su6" size={26}>Binôme formé : un pilote au clavier, un copilote qui relit</CheckItem>
      </div>
      <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Timer id="setup" minutes={3} label="Check-up" cls={A.right} style={{ width: 560, ...dl(200) }} />
        <Callout title="Règle d’or" tone="coral" icon="lock" cls={A.right} style={dl(400)} size={25}>
          Zéro code client, zéro secret, zéro donnée personnelle dans un prompt. {PROJECT} est fait pour ça.
        </Callout>
      </div>
    </Checklist>
  </Frame>
);

// ═══ 10-m1 ═════════════════════════════════════════════════════════════

// ─── Module 1 · Prompt engineering avancé ───────────────────────────────────

const M1_Divider: Page = () => (
  <Section
    n={1}
    title={
      <>
        Prompt engineering
        <br />
        avancé
      </>
    }
    sub="Comprendre ce que Copilot voit, structurer la demande, décomposer, mesurer et itérer."
    dur="9:20 – 10:30 · TP inclus"
    labs={<Tag tone="green" size={19}>TP 1 · réécrire et mesurer</Tag>}
  >
    <SecItem n={1}>Comment Copilot interprète le contexte</SecItem>
    <SecItem n={2}>Contexte, contraintes, exemples attendus</SecItem>
    <SecItem n={3}>Prompts multi-étapes et commentaires structurés</SecItem>
    <SecItem n={4}>Comparer, mesurer, itérer</SecItem>
    <SecItem n={5}>Inline, Chat ou Agent : le bon outil</SecItem>
  </Section>
);
M1_Divider.transition = BLOOM;

// ─── Ce que Copilot voit ────────────────────────────────────────────────────
const M1Seg = ({ icon, tone, title, sub, beat }: { icon: IconName; tone: Tone; title: string; sub: string; beat: number }) => (
  <div className={b.on(beat)} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px', borderRadius: 12, background: T[tone].bg, boxShadow: `inset 5px 0 0 ${STRONG[tone]}` }}>
    <Icon name={icon} size={28} color={T[tone].fg} />
    <div>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 19, color: C.soft }}>{sub}</div>
    </div>
  </div>
);

const M1_Context: Page = () => (
  <Frame mod={1} beats={2}>
    <Title>Ce que Copilot voit vraiment</Title>
    <Lede>Deux mécanismes, deux contextes différents. Ce qui n’est pas dans la fenêtre n’existe pas pour le modèle.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 800, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px' }}>
      <PanelTitle icon="code" c={C.blue}>
        Complétion inline · ghost text
      </PanelTitle>
      <CodeDark file="booking.ts" size={20}>
        <div style={{ boxShadow: 'inset 4px 0 0 #82AAFF', paddingLeft: 12 }}>
          <Ck>import</Ck> {'{ Booking }'} <Ck>from</Ck> <Cs>'./types'</Cs>;{'\n'}
          <Cc>{'/** Vrai si les deux créneaux se recouvrent. */'}</Cc>
          {'\n'}
          <Ck>export function</Ck> <Cf>overlaps</Cf>(a: Booking, b: Booking) {'{'}
        </div>
        <div style={{ paddingLeft: 16 }}>
          {'  '}
          <Ck>return</Ck> <span style={{ color: '#7C86A8', fontStyle: 'italic' }}>a.start {'<'} b.end {'&&'} b.start {'<'} a.end;</span>
          <span className={A.blink} style={{ display: 'inline-block', width: 3, height: 24, background: '#FFD27A', verticalAlign: 'middle', marginLeft: 2 }} />
        </div>
        <div style={{ boxShadow: 'inset 4px 0 0 #C792EA', paddingLeft: 12 }}>
          {'}'}
          {'\n'}
          <Ck>export function</Ck> <Cf>isWithinHours</Cf>(b: Booking) {'{ … }'}
        </div>
      </CodeDark>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Bullet size={23} tone="blue">
          Préfixe <em>et</em> suffixe autour du curseur (fill-in-the-middle)
        </Bullet>
        <Bullet size={23} tone="blue">
          Onglets ouverts, fichiers voisins, imports, nom du fichier
        </Bullet>
        <Bullet size={23} tone="coral">
          Pas vos instructions personnalisées : elles servent au chat
        </Bullet>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 980, top: 260, width: 820, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px' }}>
      <PanelTitle icon="chat" c={C.violet}>
        Chat et agent · fenêtre de contexte
      </PanelTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <M1Seg icon="gear" tone="grey" title="Prompt système et outils disponibles" sub="fixé par l’outil, invisible pour vous" beat={1} />
        <M1Seg icon="doc" tone="navy" title="Instructions du dépôt" sub="copilot-instructions.md · *.instructions.md" beat={1} />
        <M1Seg icon="link" tone="blue" title="Vos références explicites" sub="#file · #selection · #codebase · #problems" beat={1} />
        <M1Seg icon="loop" tone="yellow" title="Historique de la session" sub="tout ce qui a été dit… y compris les erreurs" beat={1} />
        <M1Seg icon="terminal" tone="teal" title="Résultats d’outils" sub="recherche, terminal, tests (mode Agent)" beat={1} />
        <M1Seg icon="send" tone="violet" title="Votre message" sub="souvent la plus petite part du contexte" beat={1} />
      </div>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 905, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, color: C.ink }}>
      <Icon name="bulb" size={28} color={C.violet} />
      <span>
        <strong>Conséquence :</strong> pour l’inline, on soigne le fichier et les onglets ; pour le chat, on soigne les instructions et les références.
      </span>
    </div>
  </Frame>
);

// ─── Structurer un prompt (constructeur interactif) ─────────────────────────
const M1_PARTS = [
  { label: 'Contexte', tone: 'blue' as Tone, txt: 'Projet SalleLibre, API REST. Les types Booking et Room sont dans #file:src/domain/types.' },
  { label: 'Tâche bornée', tone: 'violet' as Tone, txt: 'Écris uniquement la fonction overlaps(a, b) qui dit si deux réservations se recouvrent.' },
  { label: 'Contraintes', tone: 'pink' as Tone, txt: 'Fonction pure, sans dépendance. Créneaux semi-ouverts [début, fin[ : 10h–11h et 11h–12h ne se recouvrent pas.' },
  { label: 'Exemples attendus', tone: 'teal' as Tone, txt: 'overlaps(9h–10h, 9h30–11h) → true · overlaps(9h–10h, 10h–11h) → false · même salle seulement.' },
  { label: 'Critère de fin', tone: 'green' as Tone, txt: 'Ajoute les tests de ces exemples, lance la suite : tout doit passer. Résume en 3 lignes.' },
];

const M1Part = ({ i, on }: { i: number; on: boolean }) => {
  const p = M1_PARTS[i];
  return on ? (
    <div className={A.fade} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', animationDuration: '400ms' } as CSSProperties}>
      <span style={{ flex: 'none', width: 8, alignSelf: 'stretch', borderRadius: 4, background: STRONG[p.tone] }} />
      <span>{p.txt}</span>
    </div>
  ) : null;
};

const M1PartBtn = ({ i, on, flip }: { i: number; on: boolean; flip: () => void }) => {
  const p = M1_PARTS[i];
  return <Toggle on={on} onChange={flip} tone={p.tone} size={24} label={<span style={{ fontWeight: 600 }}>{p.label}</span>} />;
};

const M1_Anatomy: Page = () => {
  const [on, setOn] = useState<boolean[]>([false, false, false, false, false]);
  const flip = (i: number) => setOn((o) => o.map((x, j) => (j === i ? !x : x)));
  const n = on.filter(Boolean).length;
  const verdict =
    n === 0
      ? 'Copilot devine tout : bornes, types, format.'
      : n < 3
        ? 'Mieux, mais les cas limites restent au hasard.'
        : n < 5
          ? 'Presque : rien ne dit quand c’est fini.'
          : 'Prompt complet : résultat prévisible et vérifiable.';
  return (
    <Frame mod={1} kind="demo">
      <Title>Structurer un prompt : contexte, contraintes, exemples</Title>
      <Lede>Partez du prompt basique, ajoutez les composants un à un et regardez la demande devenir vérifiable.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 440, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Eyebrow c={C.navy} size={20}>
          Composants
        </Eyebrow>
        <M1PartBtn i={0} on={on[0]} flip={() => flip(0)} />
        <M1PartBtn i={1} on={on[1]} flip={() => flip(1)} />
        <M1PartBtn i={2} on={on[2]} flip={() => flip(2)} />
        <M1PartBtn i={3} on={on[3]} flip={() => flip(3)} />
        <M1PartBtn i={4} on={on[4]} flip={() => flip(4)} />
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
        <CodeDark file="Prompt (Chat · mode Agent)" size={23} wrap style={{ minHeight: 480 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <M1Part i={0} on={on[0]} />
            {on[1] ? <M1Part i={1} on /> : <div style={{ color: '#FFD27A' }}>Fais une fonction qui vérifie si deux réservations se chevauchent.</div>}
            <M1Part i={2} on={on[2]} />
            <M1Part i={3} on={on[3]} />
            <M1Part i={4} on={on[4]} />
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

// ─── Prompts multi-étapes ───────────────────────────────────────────────────
const M1Stage = ({ n, tone, icon, title, prompt, check, beat }: { n: number; tone: Tone; icon: IconName; title: string; prompt: string; check: string; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ width: 400, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[tone]}`, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={n} tone={tone} size={44} />
      <IconTile name={icon} tone={tone} size={44} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.ink }}>{title}</div>
    </div>
    <div style={{ fontFamily: mono, fontSize: 19, lineHeight: 1.5, color: C.ink, background: '#F7FAFC', borderRadius: 10, padding: '12px 14px', boxShadow: `inset 0 0 0 1.5px ${C.rule}`, minHeight: 170 }}>{prompt}</div>
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 21, lineHeight: 1.4, color: T.green.fg }}>
      <Icon name="checkCircle" size={24} color={C.green} style={{ marginTop: 3 }} />
      <span>{check}</span>
    </div>
  </div>
);

const M1_MultiStep: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>Prompts multi-étapes : décomposer pour garder la main</Title>
    <Lede>Une tâche complexe en un seul prompt, c’est une revue impossible. Quatre étapes, chacune avec sa preuve.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', justifyContent: 'space-between' }}>
      <M1Stage n={1} tone="blue" icon="chat" title="Clarifier" prompt="Avant d’écrire du code, pose-moi au plus 5 questions sur les règles de réservation." check="Ambiguïtés levées par écrit" beat={0} />
      <M1Stage n={2} tone="violet" icon="map" title="Planifier" prompt="Propose un plan en lots de 1 à 3 fichiers, avec le test qui valide chaque lot. Pas de code." check="Plan relu et validé" beat={1} />
      <M1Stage n={3} tone="pink" icon="code" title="Exécuter" prompt="Implémente uniquement le lot 1. Arrête-toi quand ses tests passent." check="Un lot = un diff relisible" beat={2} />
      <M1Stage n={4} tone="green" icon="eye" title="Vérifier" prompt="Relis ton diff : cas limites oubliés ? écart au plan ? Liste-les avant le lot suivant." check="Auto-critique, puis lot suivant" beat={3} />
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 740, width: 1680 }}>
      <Callout title="La règle" tone="violet" icon="flag">
        On ne passe jamais à l’étape suivante sans sa preuve. Session trop longue ou confuse ? <strong>Nouvelle session</strong>, avec le plan validé en entrée.
      </Callout>
    </div>
  </Frame>
);

// ─── Commentaires structurés ────────────────────────────────────────────────
const M1_DocComments: Page = () => (
  <Frame mod={1} kind="demo">
    <Title>Le commentaire structuré, un prompt durable</Title>
    <Lede>Signature typée + JSDoc, docstring ou Javadoc : l’inline a enfin des contraintes et des exemples à respecter.</Lede>
    <LangTabs initial="TypeScript" cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <LangBtn lang="TypeScript" />
        <LangBtn lang="Python" tone="yellow" />
        <LangBtn lang="Java" tone="coral" />
        <LangBtn lang="C#" tone="violet" />
      </div>
      <LangPane lang="TypeScript">
        <CodeDark file="availability.ts" size={21}>
          <Cc>{`/**
 * Salles libres sur tout le créneau [from, to[.
 * @param rooms    salles candidates
 * @param bookings réservations existantes (toutes salles)
 * @param minSeats capacité minimale requise
 * @returns salles triées par capacité croissante
 * @throws RangeError si from >= to
 * @example findAvailableRooms(rooms, [], 9h, 10h, 4) → [r1, r3]
 */`}</Cc>
          {'\n'}
          <Ck>export function</Ck> <Cf>findAvailableRooms</Cf>(rooms: Room[], bookings: Booking[],{'\n'}
          {'  '}from: Date, to: Date, minSeats: <Cn>number</Cn>): Room[] {'{'}
        </CodeDark>
      </LangPane>
      <LangPane lang="Python">
        <CodeDark file="availability.py" size={21}>
          <Ck>def</Ck> <Cf>find_available_rooms</Cf>(rooms: list[Room], bookings: list[Booking],{'\n'}
          {'                         '}start: datetime, end: datetime, min_seats: <Cn>int</Cn>) -{'>'} list[Room]:{'\n'}
          <Cs>{`    """Salles libres sur tout le créneau [start, end[.

    Args:
        bookings: réservations existantes (toutes salles).
        min_seats: capacité minimale requise.
    Returns:
        Salles triées par capacité croissante.
    Raises:
        ValueError: si start >= end.

    >>> find_available_rooms(rooms, [], nine, ten, 4)
    [r1, r3]
    """`}</Cs>
        </CodeDark>
      </LangPane>
      <LangPane lang="Java">
        <CodeDark file="AvailabilityService.java" size={21}>
          <Cc>{`/**
 * Salles libres sur tout le créneau [from, to[.
 * @param bookings réservations existantes (toutes salles)
 * @param minSeats capacité minimale requise
 * @return salles triées par capacité croissante
 * @throws IllegalArgumentException si from n'est pas avant to
 * Exemple : aucune réservation, 9h-10h, 4 places → [r1, r3]
 */`}</Cc>
          {'\n'}
          <Ck>public</Ck> List{'<'}Room{'>'} <Cf>findAvailableRooms</Cf>(List{'<'}Room{'>'} rooms, List{'<'}Booking{'>'} bookings,{'\n'}
          {'    '}Instant from, Instant to, <Ck>int</Ck> minSeats) {'{'}
        </CodeDark>
      </LangPane>
      <LangPane lang="C#">
        <CodeDark file="AvailabilityService.cs" size={21}>
          <Cc>{`/// <summary>Salles libres sur tout le créneau [from, to[.</summary>
/// <param name="bookings">Réservations existantes (toutes salles).</param>
/// <param name="minSeats">Capacité minimale requise.</param>
/// <returns>Salles triées par capacité croissante.</returns>
/// <exception cref="ArgumentException">Si from >= to.</exception>
/// <example>Aucune réservation, 9h-10h, 4 places → [r1, r3]</example>`}</Cc>
          {'\n'}
          <Ck>public</Ck> IReadOnlyList{'<'}Room{'>'} <Cf>FindAvailableRooms</Cf>(IEnumerable{'<'}Room{'>'} rooms,{'\n'}
          {'    '}IEnumerable{'<'}Booking{'>'} bookings, DateTime from, DateTime to, <Ck>int</Ck> minSeats) {'{'}
        </CodeDark>
      </LangPane>
    </LangTabs>
    <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card cls={A.right} tone="blue" icon="target" title="Des contraintes" size={22} style={dl(200)}>
        Bornes semi-ouvertes, tri, exception : ce qui était implicite devient exigé.
      </Card>
      <Card cls={A.right} tone="teal" icon="layers" title="Un exemple" size={22} style={dl(320)}>
        L’@example fixe le comportement mieux qu’une phrase de plus.
      </Card>
      <Card cls={A.right} tone="green" icon="eye" title="Relu en revue" size={22} style={dl(440)}>
        Versionné avec le code : il guide Copilot <em>et</em> le prochain lecteur.
      </Card>
    </div>
  </Frame>
);

// ─── Comparer des prompts ───────────────────────────────────────────────────
const M1Cell = ({ v, tone, cls }: { v: ReactNode; tone: Tone; cls?: string }) => (
  <div className={cls} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 64, borderRadius: 12, background: T[tone].bg, color: T[tone].fg, fontFamily: display, fontWeight: 700, fontSize: 26 }}>
    {v}
  </div>
);

const M1Head = ({ v, sub, tone, cls }: { v: string; sub: string; tone: Tone; cls?: string }) => (
  <div className={cls} style={{ textAlign: 'center' }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: STRONG[tone] }}>{v}</div>
    <div style={{ fontSize: 19, color: C.muted, lineHeight: 1.3 }}>{sub}</div>
  </div>
);

const M1Crit = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', height: 64, fontSize: 24, fontWeight: 600, color: C.ink }}>{children}</div>
);

const M1_Compare: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>Comparer des prompts : mesurer plutôt que ressentir</Title>
    <Lede>Même tâche, même modèle, nouvelle session, trois essais par version : Copilot n’est pas déterministe.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1180, display: 'grid', gridTemplateColumns: '400px 1fr 1fr 1fr', columnGap: 18, rowGap: 12 }}>
      <div />
      <M1Head v="V1" sub="prompt basique" tone="coral" />
      <M1Head v="V2" sub="+ contexte, contraintes" tone="yellow" cls={b.on(1)} />
      <M1Head v="V3" sub="+ exemples, critère de fin" tone="green" cls={b.on(2)} />
      <M1Crit>Compile du premier coup</M1Crit>
      <M1Cell v="1 / 3" tone="coral" />
      <M1Cell v="3 / 3" tone="green" cls={b.on(1)} />
      <M1Cell v="3 / 3" tone="green" cls={b.on(2)} />
      <M1Crit>Tests de référence passés</M1Crit>
      <M1Cell v="7 / 12" tone="coral" />
      <M1Cell v="10 / 12" tone="yellow" cls={b.on(1)} />
      <M1Cell v="12 / 12" tone="green" cls={b.on(2)} />
      <M1Crit>Bornes [début, fin[ correctes</M1Crit>
      <M1Cell v="✗" tone="coral" />
      <M1Cell v="✓" tone="green" cls={b.on(1)} />
      <M1Cell v="✓" tone="green" cls={b.on(2)} />
      <M1Crit>Conventions du projet</M1Crit>
      <M1Cell v="✗" tone="coral" />
      <M1Cell v="~" tone="yellow" cls={b.on(1)} />
      <M1Cell v="✓" tone="green" cls={b.on(2)} />
      <M1Crit>Allers-retours nécessaires</M1Crit>
      <M1Cell v="5" tone="coral" />
      <M1Cell v="2" tone="yellow" cls={b.on(1)} />
      <M1Cell v="0" tone="green" cls={b.on(2)} />
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 1360, top: 262, width: 440, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="violet" icon="flask" title="Votre grille" size={22}>
        Des critères binaires ou comptables, décidés <em>avant</em> de lancer les essais.
      </Card>
      <Card tone="navy" icon="loop" title="Itérer" size={22}>
        Changez un seul composant du prompt à la fois, sinon vous ne saurez pas ce qui a aidé.
      </Card>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 905, fontSize: 21, color: C.muted, ...dl(600) }}>
      Exemple de mesure sur overlaps() · chiffres illustratifs : vous produirez les vôtres au TP 1.
    </div>
  </Frame>
);

// ─── Les leviers du chat ────────────────────────────────────────────────────
const M1Lever = ({ sym, tone, title, children, d }: { sym: string; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', display: 'flex', gap: 22, ...dl(d) }}>
    <div style={{ flex: 'none', width: 84, height: 84, borderRadius: 18, background: STRONG[tone], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontWeight: 700, fontSize: 44 }}>
      {sym}
    </div>
    <div>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 8, fontSize: 22, lineHeight: 1.5, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M1Mono = ({ children }: { children: ReactNode }) => <span style={{ fontFamily: mono, fontSize: 21, color: C.navy }}>{children}</span>;

const M1_Levers: Page = () => (
  <Frame mod={1}>
    <Title>Les leviers du chat : #, @, / et le modèle</Title>
    <Lede>Quatre réflexes qui distinguent l’utilisateur avancé : il choisit ce que le modèle lit et qui répond.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26 }}>
      <M1Lever sym="#" tone="blue" title="Références : ce que le modèle lit" d={100}>
        <M1Mono>#file #selection #codebase #changes #problems #fetch</M1Mono>
        <br />
        Peu de fichiers, bien choisis, plutôt que tout le dépôt.
      </M1Lever>
      <M1Lever sym="@" tone="violet" title="Participants : qui répond" d={200}>
        <M1Mono>@vscode @terminal @github</M1Mono>
        <br />
        Un expert du domaine concerné, avec ses propres outils.
      </M1Lever>
      <M1Lever sym="/" tone="teal" title="Commandes : intentions prêtes" d={300}>
        <M1Mono>/explain /fix /tests /doc /new /compact</M1Mono>
        <br />
        Et vos propres prompts d’équipe, en /nom (module 6).
      </M1Lever>
      <M1Lever sym="⚙" tone="pink" title="Modèle : le bon moteur" d={400}>
        Rapide pour l’inline et le répétitif, raisonnement pour un plan ou une architecture.
        <br />
        Chaque modèle a son coût en requêtes premium.
      </M1Lever>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, width: 1680 }}>
      <Callout title="Limite à connaître" tone="yellow" icon="alert" size={24}>
        Les noms de variables, de participants et de modèles évoluent vite : vérifiez la doc de votre version de VS Code.
      </Callout>
    </div>
  </Frame>
);

// ─── Inline, Chat ou Agent (jeu de tri) ─────────────────────────────────────
const M1Zone = ({ x, icon, tone, title, sub, answer }: { x: number; icon: IconName; tone: Tone; title: string; sub: string; answer: ReactNode }) => (
  <div style={{ position: 'absolute', left: x, top: 262, width: 540, height: 480, boxSizing: 'border-box', borderRadius: 20, background: T[tone].bg, boxShadow: `inset 0 0 0 2.5px ${T[tone].bd}`, padding: '20px 24px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={52} solid />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: T[tone].fg }}>{title}</div>
        <div style={{ fontSize: 19, color: C.soft }}>{sub}</div>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 24, right: 24, bottom: 18, fontSize: 19, lineHeight: 1.45, color: T[tone].fg }}>
      <strong>Corrigé · </strong>
      {answer}
    </div>
  </div>
);

const M1_ChatVsInline: Page = () => (
  <Frame mod={1} kind="exercice" beats={1}>
    <Title>Inline, Chat ou Agent : à chaque besoin son outil</Title>
    <Lede>Glissez chaque situation dans la bonne colonne. Double-clic pour renvoyer une étiquette à sa place.</Lede>
    <M1Zone x={120} icon="code" tone="blue" title="Inline · NES" sub="Tab, suggestions de modification suivante" answer="boucle évidente, mapper répétitif, propager un renommage." />
    <M1Zone x={690} icon="chat" tone="violet" title="Chat · Ask, Ctrl+I" sub="comprendre, comparer, corriger sur place" answer="regex héritée, deux stratégies, erreur sous le curseur." />
    <M1Zone x={1260} icon="bot" tone="green" title="Plan puis Agent" sub="multi-fichiers, commandes, itérations" answer="endpoint + tests sur 5 fichiers, migrer 30 appels dépréciés." />
    <Drag x={120} y={780} w={405} tone="blue">Finir une boucle évidente</Drag>
    <Drag x={545} y={780} w={405} tone="grey">Endpoint + tests sur 5 fichiers</Drag>
    <Drag x={970} y={780} w={405} tone="grey">Comprendre une regex héritée</Drag>
    <Drag x={1395} y={780} w={405} tone="grey">Mapper DTO répétitif</Drag>
    <Drag x={120} y={860} w={405} tone="grey">Choisir entre deux stratégies</Drag>
    <Drag x={545} y={860} w={405} tone="grey">Migrer 30 appels dépréciés</Drag>
    <Drag x={970} y={860} w={405} tone="grey">Corriger l’erreur sous le curseur</Drag>
    <Drag x={1395} y={860} w={405} tone="grey">Propager un renommage</Drag>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M1_Qcm: Page = () => (
  <QcmPage
    mod={1}
    n={1}
    title="Le bon levier"
    q="Les complétions inline ignorent votre convention de nommage. Quel levier est le plus efficace ?"
    explain="L’inline lit le fichier courant et les onglets voisins, pas les instructions personnalisées. Montrez-lui le bon exemple, au bon endroit."
  >
    <Opt why="Le chat n’influence pas les complétions inline, et répéter une règle à chaque prompt ne passe pas à l’échelle.">
      Répéter la convention dans chaque prompt du chat
    </Opt>
    <Opt why="Utile pour le chat et les agents, mais les instructions personnalisées ne sont pas prises en compte par les complétions inline.">
      L’inscrire dans .github/copilot-instructions.md
    </Opt>
    <Opt ok why="Exact : signature typée, commentaire structuré et fichier exemplaire ouvert dans un onglet voisin, c’est précisément ce que l’inline lit.">
      Ouvrir un fichier exemplaire à côté, écrire signature et commentaire dans le style voulu
    </Opt>
    <Opt why="Le modèle n’est pas le problème : sans exemple dans son contexte, n’importe quel modèle devinera.">
      Changer de modèle de complétion
    </Opt>
  </QcmPage>
);

// ─── TP 1 ───────────────────────────────────────────────────────────────────
const M1_TP: Page = () => (
  <LabPage
    mod={1}
    n="1"
    title="Réécrire des prompts basiques et mesurer"
    defi="ameliorer"
    who="Binôme"
    minutes={25}
    where={
      <>
        <PathChip>prompts/tp1-mesures.md</PathChip> grille V1 / V2
        <br />
        <PathChip>src/domain/overlap.*</PathChip> + tests
        <br />
        <PathChip>.github/prompts/overlap.prompt.md</PathChip>
      </>
    }
    objective={
      <>
        Prouver, chiffres à l’appui, qu’un prompt structuré produit un meilleur code qu’un prompt basique sur trois tâches de {PROJECT}.
      </>
    }
    crit={
      <>
        <CheckItem id="tp1-1" size={22}>Trois prompts réécrits avec les cinq composants</CheckItem>
        <CheckItem id="tp1-2" size={22}>Chaque version lancée 2 fois, en session neuve</CheckItem>
        <CheckItem id="tp1-3" size={22}>Grille remplie : compile, tests, bornes, allers-retours</CheckItem>
        <CheckItem id="tp1-4" size={22}>Le meilleur prompt sauvegardé en .prompt.md</CheckItem>
      </>
    }
  >
    Les trois prompts de départ :
    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8, fontFamily: mono, fontSize: 21, color: C.ink }}>
      <span>P1 · « fais une fonction qui vérifie si deux réservations se chevauchent »</span>
      <span>P2 · « génère les modèles de données de l’appli »</span>
      <span>P3 · « écris la fonction qui trouve les salles libres »</span>
    </div>
    <TpBonus>Rétro-prompt : donnez la meilleure implémentation et demandez le prompt qui l’aurait produite du premier coup.</TpBonus>
  </LabPage>
);

// ═══ 20-m2 ═════════════════════════════════════════════════════════════

// ─── Module 2 · Modules & architectures ─────────────────────────────────────

const M2_Divider: Page = () => (
  <Section
    n={2}
    title={
      <>
        Générer modules
        <br />
        et architectures
      </>
    }
    sub="De l’arborescence à l’API REST complète : structure, patterns, dépendances, sans perdre la main sur le design."
    dur="10:45 – 11:40 · TP inclus"
    labs={<Tag tone="green" size={19}>TP 2 · API REST complète</Tag>}
  >
    <SecItem n={1}>Générer une structure de projet complète</SecItem>
    <SecItem n={2}>Une API REST de bout en bout</SecItem>
    <SecItem n={3}>Repository, Service, Factory</SecItem>
    <SecItem n={4}>Générer à l’image de l’existant</SecItem>
    <SecItem n={5}>Dépendances et imports générés</SecItem>
  </Section>
);
M2_Divider.transition = BLOOM;

// ─── Structure de projet ────────────────────────────────────────────────────
const M2Tree = ({ depth = 0, dir = false, name, note, tone = 'navy' }: { depth?: number; dir?: boolean; name: string; note?: string; tone?: Tone }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, paddingLeft: depth * 30, fontFamily: mono, fontSize: 21, lineHeight: 1.55 }}>
    <span style={{ color: dir ? T[tone].fg : C.ink, fontWeight: dir ? 700 : 400 }}>
      {dir ? '▸ ' : '  '}
      {name}
    </span>
    {note ? <span style={{ fontFamily: body, fontSize: 18, color: C.muted }}>{note}</span> : null}
  </div>
);

const M2_Scaffold: Page = () => (
  <Frame mod={2} beats={2}>
    <Title>Générer une structure de projet complète</Title>
    <Lede>L’arborescence est une décision d’architecture : on la fait proposer en mode Plan, on la discute, puis on la fige.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800 }}>
      <CodeDark file="Prompt · mode Plan" size={21} wrap>
        Contexte : API REST {PROJECT} (salles, réservations, auth JWT, rôles membre/admin).{'\n\n'}
        Propose une arborescence en couches : domaine pur, repositories derrière des interfaces, services métier, routes fines, validation à l’entrée.{'\n\n'}
        <span style={{ color: '#FFD27A' }}>Pour chaque dossier : son rôle en une ligne. Liste les interfaces à créer en premier. N’écris aucune implémentation.</span>
      </CodeDark>
      <div className={b.on(2)} style={{ marginTop: 24 }}>
        <Callout title="Interfaces d’abord" tone="blue" icon="layers" size={24}>
          Contrats validés → implémentations générées lot par lot. L’arbo figée va dans les instructions du dépôt.
        </Callout>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 980, top: 270, width: 820, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px' }}>
      <PanelTitle icon="layers">Proposition retenue</PanelTitle>
      <M2Tree dir name="src/" />
      <M2Tree depth={1} dir name="domain/" note="types, règles pures" tone="violet" />
      <M2Tree depth={2} name="overlap · availability" />
      <M2Tree depth={1} dir name="repositories/" note="interfaces + impl." tone="teal" />
      <M2Tree depth={1} dir name="services/" note="cas d’usage métier" tone="blue" />
      <M2Tree depth={1} dir name="api/" note="routes fines" tone="pink" />
      <M2Tree depth={2} name="routes · validation · auth" />
      <M2Tree depth={1} dir name="config/" note="env, injection" tone="grey" />
      <M2Tree dir name="tests/" />
      <M2Tree depth={1} dir name="unit/ · integration/" tone="green" />
      <M2Tree name="openapi.yaml" note="contrat publié" />
      <M2Tree name="PLAN.md" note="plan validé, lots" />
    </div>
  </Frame>
);

// ─── API REST de bout en bout ───────────────────────────────────────────────
const M2Hop = ({ x, icon, tone, title, sub }: { x: number; icon: IconName; tone: Tone; title: string; sub: string }) => (
  <div className={A.pop} style={{ position: 'absolute', left: x, top: 270, width: 250, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, borderTop: `6px solid ${STRONG[tone]}`, padding: '16px 18px', ...dl(x / 4) }}>
    <IconTile name={icon} tone={tone} size={48} />
    <div style={{ marginTop: 10, fontFamily: display, fontWeight: 800, fontSize: 24, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 4, fontSize: 19, lineHeight: 1.35, color: C.soft }}>{sub}</div>
  </div>
);

const M2Row = ({ label, a, b: bb, c, d, head = false }: { label: string; a: string; b: string; c: string; d: string; head?: boolean }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '220px repeat(4, 1fr)', gap: 14, alignItems: 'center', padding: head ? '0 18px' : '12px 18px', borderRadius: 12, background: head ? 'transparent' : C.card, boxShadow: head ? 'none' : SHADOW_SM }}>
    <span style={{ fontSize: head ? 18 : 21, fontWeight: 700, letterSpacing: head ? '0.08em' : 0, color: head ? C.muted : C.navy }}>{label}</span>
    <span style={{ fontFamily: head ? body : mono, fontSize: head ? 19 : 19, fontWeight: head ? 700 : 400, color: head ? T.blue.fg : C.ink }}>{a}</span>
    <span style={{ fontFamily: head ? body : mono, fontSize: 19, fontWeight: head ? 700 : 400, color: head ? T.yellow.fg : C.ink }}>{bb}</span>
    <span style={{ fontFamily: head ? body : mono, fontSize: 19, fontWeight: head ? 700 : 400, color: head ? T.coral.fg : C.ink }}>{c}</span>
    <span style={{ fontFamily: head ? body : mono, fontSize: 19, fontWeight: head ? 700 : 400, color: head ? T.violet.fg : C.ink }}>{d}</span>
  </div>
);

const M2_ApiFlow: Page = () => (
  <Frame mod={2} beats={1}>
    <Title>Une API REST de bout en bout</Title>
    <Lede>Une couche, une responsabilité : un prompt et des tests par couche. C’est ce qui rend la génération relisible.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <path d="M 245 470 H 1675" stroke={C.rule} strokeWidth={4} strokeDasharray="10 14" className={A.march} />
      <FlowDot path="M 245 470 H 1675" dur={3.2} color={C.electric} />
    </svg>
    <M2Hop x={120} icon="send" tone="grey" title="Requête" sub="POST /bookings + jeton JWT" />
    <M2Hop x={407} icon="lock" tone="coral" title="Auth" sub="jeton valide, rôle, identité" />
    <M2Hop x={694} icon="filter" tone="yellow" title="Validation" sub="schéma, types, bornes" />
    <M2Hop x={981} icon="route" tone="pink" title="Route" sub="fine : traduit HTTP ↔ métier" />
    <M2Hop x={1268} icon="gear" tone="blue" title="Service" sub="règles : chevauchement, heures" />
    <M2Hop x={1555} icon="database" tone="teal" title="Repository" sub="persistance derrière interface" />
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 560, width: 1680, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <M2Row head label="COUCHE" a="TypeScript · Express" b="Python · FastAPI" c="Java · Spring Boot" d="C# · ASP.NET Core" />
      <M2Row label="Routes" a="express.Router" b="APIRouter" c="@RestController" d="Minimal API / Controller" />
      <M2Row label="Validation" a="zod" b="Pydantic" c="Bean Validation" d="DataAnnotations" />
      <M2Row label="Auth JWT" a="jsonwebtoken" b="OAuth2 + PyJWT" c="Spring Security" d="JwtBearer" />
      <M2Row label="OpenAPI" a="zod-to-openapi" b="natif (/docs)" c="springdoc" d="AspNetCore.OpenApi" />
    </div>
  </Frame>
);

// ─── Patterns ───────────────────────────────────────────────────────────────
const M2Pattern = ({ icon, tone, title, role, when, prompt }: { icon: IconName; tone: Tone; title: string; role: string; when: string; prompt: string }) => (
  <FlipCard
    w={538}
    h={470}
    tone={tone}
    backTone={tone}
    front={
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconTile name={icon} tone={tone} size={60} />
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: C.ink }}>{title}</div>
        </div>
        <div style={{ marginTop: 20, fontSize: 18, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>RÔLE</div>
        <div style={{ fontSize: 24, lineHeight: 1.4, color: C.ink }}>{role}</div>
        <div style={{ marginTop: 16, fontSize: 18, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>DANS {PROJECT.toUpperCase()}</div>
        <div style={{ fontSize: 24, lineHeight: 1.4, color: C.soft }}>{when}</div>
      </>
    }
    back={
      <>
        <Eyebrow c={T[tone].fg} size={18}>
          Le prompt
        </Eyebrow>
        <div style={{ marginTop: 12, fontFamily: mono, fontSize: 21, lineHeight: 1.5, color: C.ink }}>{prompt}</div>
      </>
    }
  />
);

const M2_Patterns: Page = () => (
  <Frame mod={2}>
    <Title>Repository, Service, Factory : nommer le pattern</Title>
    <Lede>Copilot connaît tous les patterns. Ce qu’il ignore, c’est votre variante : nommez-la, bornez-la. Cliquez une carte.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', gap: 33 }}>
      <M2Pattern
        icon="database"
        tone="teal"
        title="Repository"
        role="Isole la persistance derrière une interface métier."
        when="BookingRepository : findOverlapping(roomId, from, to). Mémoire en test, SQL en prod."
        prompt="Crée l’interface BookingRepository (findOverlapping, save, delete) puis une implémentation en mémoire. Aucune logique métier dedans."
      />
      <M2Pattern
        icon="gear"
        tone="blue"
        title="Service"
        role="Porte un cas d’usage et ses règles métier."
        when="BookingService.book() : vérifie heures ouvrées, chevauchement, propriétaire."
        prompt="Crée BookingService avec le repository injecté par le constructeur. Erreurs métier typées (BookingConflict), jamais d’objet HTTP ici."
      />
      <M2Pattern
        icon="puzzle"
        tone="violet"
        title="Factory"
        role="Centralise la création d’objets valides ou de variantes."
        when="RoomFactory : salle standard, visio, amphi, avec leurs équipements par défaut."
        prompt="Crée RoomFactory.create(kind) pour standard, visio, amphi. Un type inconnu lève une erreur. Ajoute un test par variante."
      />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 790, width: 1680, ...dl(500) }}>
      <Callout title="Piège classique" tone="coral" icon="alert" size={24}>
        Demander « applique les bonnes pratiques » produit des couches vides et des interfaces inutiles. Un pattern se justifie par un besoin.
      </Callout>
    </div>
  </Frame>
);

// ─── Générer à l'image de l'existant ────────────────────────────────────────
const M2Rule = ({ icon, tone, title, children, beat }: { icon: IconName; tone: Tone; title: string; children: ReactNode; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px' }}>
    <IconTile name={icon} tone={tone} size={52} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 2, fontSize: 21, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M2_Exemplar: Page = () => (
  <Frame mod={2} beats={3}>
    <Title>Maintenable et extensible : générer à l’image de l’existant</Title>
    <Lede>Le meilleur prompt d’architecture est un fichier de référence. Copilot imite très bien ; il invente moins bien.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 860 }}>
      <CodeDark file="Prompt · mode Agent" size={22} wrap>
        Crée <Cf>RoomService</Cf> en suivant exactement le modèle de <span style={{ color: '#FFD27A' }}>#file:src/services/booking.service</span> :{'\n'}
        {'  '}· même injection par constructeur{'\n'}
        {'  '}· mêmes erreurs métier typées{'\n'}
        {'  '}· même structure de tests dans <span style={{ color: '#FFD27A' }}>#file:tests/unit/booking.service.test</span>
        {'\n\n'}
        <Cc>Si tu dois t’écarter du modèle, demande-moi d’abord.</Cc>
      </CodeDark>
      <div className={A.fade} style={{ marginTop: 22, fontSize: 23, lineHeight: 1.45, color: C.soft, ...dl(400) }}>
        Un fichier exemplaire relu vaut mieux que dix lignes de consignes : c’est aussi ce qui garde 30 services cohérents entre eux.
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1040, top: 270, width: 760, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Eyebrow c={C.navy} size={20}>
        Quatre contrats d’extensibilité à exiger
      </Eyebrow>
      <M2Rule icon="plug" tone="blue" title="Dépendances injectées" beat={0}>
        Pas de <code style={{ fontFamily: mono }}>new</code> d’infrastructure dans un service.
      </M2Rule>
      <M2Rule icon="alert" tone="coral" title="Erreurs métier typées" beat={1}>
        BookingConflict, pas Error("conflit") ni un code HTTP.
      </M2Rule>
      <M2Rule icon="layers" tone="violet" title="Interfaces aux frontières" beat={2}>
        Le domaine ne connaît ni la base, ni le framework web.
      </M2Rule>
      <M2Rule icon="route" tone="teal" title="Routes sans logique" beat={3}>
        Valider, appeler le service, traduire la réponse. Rien d’autre.
      </M2Rule>
    </div>
  </Frame>
);

// ─── Dépendances et imports ─────────────────────────────────────────────────
const M2Risk = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={54} />
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 2, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M2_Deps: Page = () => (
  <Frame mod={2} beats={1}>
    <Title>Dépendances et imports générés : vérifier avant d’installer</Title>
    <Lede>Un modèle suggère des paquets plausibles, pas des paquets vérifiés. Et un attaquant peut publier le nom halluciné.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 900, display: 'flex', flexDirection: 'column', gap: 26 }}>
      <M2Risk icon="eyeOff" tone="coral" title="Paquet halluciné" d={100}>
        Il n’existe pas… jusqu’à ce qu’un attaquant le publie (slopsquatting).
      </M2Risk>
      <M2Risk icon="clock" tone="yellow" title="Version datée" d={200}>
        Celle de la date d’entraînement, parfois vulnérable ou dépréciée.
      </M2Risk>
      <M2Risk icon="link" tone="violet" title="Import fantôme" d={300}>
        Chemin, fonction ou option qui n’existent pas dans votre version.
      </M2Risk>
      <M2Risk icon="layers" tone="grey" title="Dépendance superflue" d={400}>
        Une librairie entière pour trois lignes de code.
      </M2Risk>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1080, top: 270, width: 720, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(200) }}>
      <Stat value={<CountUp to={19.7} digits={1} suffix=" %" />} label="des paquets recommandés par des LLM n’existaient pas (576 000 échantillons de code, USENIX Security 2025)" tone="coral" size={96} />
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 1080, top: 590, width: 720, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 30px' }}>
      <PanelTitle icon="shieldCheck" c={T.green.fg}>
        Les règles de l’équipe
      </PanelTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Bullet size={22} tone="green">Liste des dépendances autorisées dans les instructions</Bullet>
        <Bullet size={22} tone="green">« N’ajoute aucune dépendance sans me demander »</Bullet>
        <Bullet size={22} tone="green">Registre vérifié : existence, âge, mainteneurs</Bullet>
        <Bullet size={22} tone="green">Lockfile commité, audit en CI (module 5)</Bullet>
      </div>
    </div>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M2_Qcm: Page = () => (
  <QcmPage
    mod={2}
    n={2}
    title="Un paquet inconnu"
    q="L’agent propose d’installer jwt-express-guard-pro, un paquet que personne ne connaît dans l’équipe. Que faites-vous ?"
    explain="Un nom plausible n’est pas une preuve d’existence ni de fiabilité. On vérifie hors du modèle, et on préfère ce que l’équipe a déjà validé."
  >
    <Opt why="Les tests ne détectent ni un paquet malveillant ni un script d’installation : le mal est fait dès l’installation.">
      L’installer : si les tests passent, c’est qu’il fonctionne
    </Opt>
    <Opt ok why="Exact : registre officiel, âge, mainteneurs, téléchargements, dépôt source. Et en priorité une librairie déjà validée par l’équipe.">
      Vérifier sur le registre, puis préférer une librairie déjà validée
    </Opt>
    <Opt why="Le modèle peut confirmer avec assurance un paquet qu’il a lui-même halluciné : ce n’est pas une source de vérification.">
      Demander à Copilot si ce paquet est fiable
    </Opt>
    <Opt why="Les scripts d’installation s’exécutent aussi pour une dépendance de développement, sur votre poste et en CI.">
      L’installer seulement en dépendance de développement
    </Opt>
  </QcmPage>
);

// ─── TP 2 ───────────────────────────────────────────────────────────────────
const M2Step = ({ n, children }: { n: number; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
    <Num n={n} tone="blue" size={32} style={{ marginTop: 2 }} />
    <span style={{ fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</span>
  </div>
);

const M2_TP: Page = () => (
  <LabPage
    mod={2}
    n="2"
    title="Générer une API REST complète"
    defi="generer"
    who="Binôme"
    minutes={30}
    where={
      <>
        <PathChip>PLAN.md</PathChip> plan validé, en lots
        <br />
        <PathChip>src/**</PathChip> selon l’arborescence retenue
        <br />
        <PathChip>openapi.yaml</PathChip> ou route /docs
      </>
    }
    objective={
      <>
        L’API {PROJECT} fonctionne : authentification JWT, CRUD des salles (admin), réservations avec contrôle de chevauchement, validation et documentation.
      </>
    }
    crit={
      <>
        <CheckItem id="tp2-1" size={21}>Plan validé avant toute ligne de code</CheckItem>
        <CheckItem id="tp2-2" size={21}>Chevauchement refusé : 409 Conflict</CheckItem>
        <CheckItem id="tp2-3" size={21}>401 sans jeton, 403 si non admin</CheckItem>
        <CheckItem id="tp2-4" size={21}>Doc OpenAPI accessible et à jour</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <M2Step n={1}>Mode Plan : arborescence et interfaces, à valider.</M2Step>
      <M2Step n={2}>Lot 1 : domaine (reprenez overlaps du TP 1) et repositories en mémoire.</M2Step>
      <M2Step n={3}>Lot 2 : services et erreurs métier typées.</M2Step>
      <M2Step n={4}>Lot 3 : routes, validation, auth · lot 4 : OpenAPI.</M2Step>
    </div>
    <TpBonus>Demandez à Copilot une revue d’architecture de son propre code : écarts au plan, couplages, logique dans les routes.</TpBonus>
  </LabPage>
);

// ═══ 30-m3 ═════════════════════════════════════════════════════════════

// ─── Module 3 · Automatiser les tests ───────────────────────────────────────

const M3_Divider: Page = () => (
  <Section
    n={3}
    title={
      <>
        Automatiser
        <br />
        la génération de tests
      </>
    }
    sub="Une stratégie d’abord, des tests ensuite : unitaires, mocks, intégration, couverture… et les pièges des tests générés."
    dur="11:40 – 12:30 · TP inclus"
    labs={<Tag tone="green" size={19}>TP 3 · suite de tests complète</Tag>}
  >
    <SecItem n={1}>Stratégie : couverture, cas limites, cas négatifs</SecItem>
    <SecItem n={2}>Tests unitaires paramétrés</SecItem>
    <SecItem n={3}>Mocks et stubs pour isoler</SecItem>
    <SecItem n={4}>Scénarios d’intégration de bout en bout</SecItem>
    <SecItem n={5}>Couverture, mutation et pièges</SecItem>
  </Section>
);
M3_Divider.transition = BLOOM;

// ─── Stratégie : la matrice de cas ──────────────────────────────────────────
const M3Col = ({ icon, tone, title, cls, children }: { icon: IconName; tone: Tone; title: string; cls?: string; children: ReactNode }) => (
  <div className={cls} style={{ flex: 1, background: C.card, borderRadius: 18, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[tone]}`, padding: '20px 22px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <IconTile name={icon} tone={tone} size={48} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: STRONG[tone] === C.yellow ? C.amber : STRONG[tone] }}>{title}</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
  </div>
);

const M3Case = ({ children, out }: { children: ReactNode; out: string }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, background: C.panel, fontSize: 20, lineHeight: 1.3, color: C.ink }}>
    <span>{children}</span>
    <span style={{ flex: 'none', fontFamily: mono, fontSize: 18, fontWeight: 700, color: C.navy }}>{out}</span>
  </div>
);

const M3_Strategy: Page = () => (
  <Frame mod={3} beats={4}>
    <Title>D’abord la stratégie : la matrice de cas</Title>
    <Lede>« Écris des tests » produit surtout des cas nominaux. Exigez quatre colonnes, validez-les, puis seulement générez.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', gap: 22 }}>
      <M3Col icon="checkCircle" tone="green" title="Nominal" cls={A.in}>
        <M3Case out="201">Créneau libre</M3Case>
        <M3Case out="201">Autre salle, même heure</M3Case>
        <M3Case out="204">Annuler la sienne</M3Case>
      </M3Col>
      <M3Col icon="target" tone="yellow" title="Limites" cls={b.on(1)}>
        <M3Case out="201">10h–11h puis 11h–12h</M3Case>
        <M3Case out="201">Début à 8:00 pile</M3Case>
        <M3Case out="?">Changement d’heure</M3Case>
      </M3Col>
      <M3Col icon="x" tone="coral" title="Négatifs" cls={b.on(2)}>
        <M3Case out="409">Chevauchement partiel</M3Case>
        <M3Case out="400">Début ≥ fin</M3Case>
        <M3Case out="404">Salle inconnue</M3Case>
      </M3Col>
      <M3Col icon="shield" tone="violet" title="Sécurité" cls={b.on(3)}>
        <M3Case out="403">Annuler celle d’un autre</M3Case>
        <M3Case out="401">Jeton expiré</M3Case>
        <M3Case out="400">Identifiant malformé</M3Case>
      </M3Col>
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'flex', gap: 30, alignItems: 'stretch' }}>
      <CodeDark file="Prompt" size={21} wrap style={{ flex: 1 }}>
        Avant d’écrire un test, liste les cas de BookingService.book() en quatre colonnes : nominal, limites, négatifs, sécurité. Pour chacun : entrée, résultat attendu. <span style={{ color: '#FFD27A' }}>Attends ma validation.</span>
      </CodeDark>
      <div style={{ width: 520, display: 'flex', alignItems: 'center', fontSize: 23, lineHeight: 1.45, color: C.soft }}>
        Le « ? » est voulu : une règle métier absente. Copilot ne doit pas l’inventer, c’est à vous de trancher.
      </div>
    </div>
  </Frame>
);

// ─── Tests unitaires paramétrés (onglets) ───────────────────────────────────
const M3_Unit: Page = () => (
  <Frame mod={3} kind="demo">
    <Title>Des tests unitaires paramétrés, pas copiés-collés</Title>
    <Lede>Un comportement, une table de cas : plus lisible en revue, et chaque cas limite reste visible.</Lede>
    <LangTabs initial="Jest" cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <LangBtn lang="Jest" />
        <LangBtn lang="pytest" tone="yellow" />
        <LangBtn lang="JUnit 5" tone="coral" />
        <LangBtn lang="xUnit" tone="violet" />
      </div>
      <LangPane lang="Jest">
        <CodeDark file="overlap.test.ts" size={21}>
          <Ck>describe</Ck>(<Cs>'overlaps'</Cs>, () ={'>'} {'{'}
          {'\n'}
          {'  '}test.<Cf>each</Cf>([{'\n'}
          {'    '}[<Cs>'9h-10h'</Cs>, <Cs>'9h30-11h'</Cs>, <Cn>true</Cn>],{'\n'}
          {'    '}[<Cs>'9h-10h'</Cs>, <Cs>'10h-11h'</Cs>, <Cn>false</Cn>], <Cc>// bornes [début, fin[</Cc>
          {'\n'}
          {'    '}[<Cs>'9h-12h'</Cs>, <Cs>'10h-11h'</Cs>, <Cn>true</Cn>], <Cc>// inclusion</Cc>
          {'\n'}
          {'    '}[<Cs>'9h-10h'</Cs>, <Cs>'14h-15h'</Cs>, <Cn>false</Cn>],{'\n'}
          {'  '}])(<Cs>'%s contre %s → %s'</Cs>, (a, b, attendu) ={'>'} {'{'}
          {'\n'}
          {'    '}<Cf>expect</Cf>(<Cf>overlaps</Cf>(<Cf>slot</Cf>(a), <Cf>slot</Cf>(b))).<Cf>toBe</Cf>(attendu);{'\n'}
          {'  '}{'}'});{'\n'}
          {'}'});
        </CodeDark>
      </LangPane>
      <LangPane lang="pytest">
        <CodeDark file="test_overlap.py" size={21}>
          <Cf>@pytest.mark.parametrize</Cf>(<Cs>"a, b, attendu"</Cs>, [{'\n'}
          {'    '}(<Cs>"9h-10h"</Cs>, <Cs>"9h30-11h"</Cs>, <Cn>True</Cn>),{'\n'}
          {'    '}(<Cs>"9h-10h"</Cs>, <Cs>"10h-11h"</Cs>, <Cn>False</Cn>), <Cc># bornes [début, fin[</Cc>
          {'\n'}
          {'    '}(<Cs>"9h-12h"</Cs>, <Cs>"10h-11h"</Cs>, <Cn>True</Cn>), <Cc># inclusion</Cc>
          {'\n'}
          {'    '}(<Cs>"9h-10h"</Cs>, <Cs>"14h-15h"</Cs>, <Cn>False</Cn>),{'\n'}
          ]){'\n'}
          <Ck>def</Ck> <Cf>test_overlaps</Cf>(a, b, attendu):{'\n'}
          {'    '}<Ck>assert</Ck> <Cf>overlaps</Cf>(<Cf>slot</Cf>(a), <Cf>slot</Cf>(b)) <Ck>is</Ck> attendu
        </CodeDark>
      </LangPane>
      <LangPane lang="JUnit 5">
        <CodeDark file="OverlapTest.java" size={21}>
          <Cf>@ParameterizedTest</Cf>(name = <Cs>"{'{0}'} contre {'{1}'} → {'{2}'}"</Cs>){'\n'}
          <Cf>@CsvSource</Cf>({'{'}
          {'\n'}
          {'    '}<Cs>"9h-10h, 9h30-11h, true"</Cs>,{'\n'}
          {'    '}<Cs>"9h-10h, 10h-11h, false"</Cs>, <Cc>// bornes [début, fin[</Cc>
          {'\n'}
          {'    '}<Cs>"9h-12h, 10h-11h, true"</Cs>, <Cc>// inclusion</Cc>
          {'\n'}
          {'    '}<Cs>"9h-10h, 14h-15h, false"</Cs>{'\n'}
          {'}'}){'\n'}
          <Ck>void</Ck> <Cf>overlaps</Cf>(String a, String b, <Ck>boolean</Ck> attendu) {'{'}
          {'\n'}
          {'    '}<Cf>assertEquals</Cf>(attendu, Slots.<Cf>overlaps</Cf>(<Cf>slot</Cf>(a), <Cf>slot</Cf>(b)));{'\n'}
          {'}'}
        </CodeDark>
      </LangPane>
      <LangPane lang="xUnit">
        <CodeDark file="OverlapTests.cs" size={21}>
          [<Cf>Theory</Cf>]{'\n'}
          [<Cf>InlineData</Cf>(<Cs>"9h-10h"</Cs>, <Cs>"9h30-11h"</Cs>, <Cn>true</Cn>)]{'\n'}
          [<Cf>InlineData</Cf>(<Cs>"9h-10h"</Cs>, <Cs>"10h-11h"</Cs>, <Cn>false</Cn>)] <Cc>// bornes [début, fin[</Cc>
          {'\n'}
          [<Cf>InlineData</Cf>(<Cs>"9h-12h"</Cs>, <Cs>"10h-11h"</Cs>, <Cn>true</Cn>)] <Cc>// inclusion</Cc>
          {'\n'}
          [<Cf>InlineData</Cf>(<Cs>"9h-10h"</Cs>, <Cs>"14h-15h"</Cs>, <Cn>false</Cn>)]{'\n'}
          <Ck>public void</Ck> <Cf>Overlaps</Cf>(<Ck>string</Ck> a, <Ck>string</Ck> b, <Ck>bool</Ck> attendu) ={'>'}
          {'\n'}
          {'    '}Assert.<Cf>Equal</Cf>(attendu, Slots.<Cf>Overlaps</Cf>(<Cf>Slot</Cf>(a), <Cf>Slot</Cf>(b)));
        </CodeDark>
      </LangPane>
    </LangTabs>
    <div className={A.right} style={{ position: 'absolute', left: 1240, top: 262, width: 560, ...dl(200) }}>
      <CodeDark file="Prompt" size={20} wrap>
        /tests pour #selection.{'\n'}
        Une table de cas reprenant la matrice validée.{'\n'}
        Noms = comportement attendu.{'\n'}
        Aucune logique (if, boucle) dans un test.{'\n'}
        <span style={{ color: '#FFD27A' }}>Lance la suite et montre-moi la sortie.</span>
      </CodeDark>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Bullet size={22} tone="pink">Structure Arrange · Act · Assert</Bullet>
        <Bullet size={22} tone="pink">Données de test explicites et fixes</Bullet>
        <Bullet size={22} tone="pink">Un échec doit dire quel cas a cassé</Bullet>
      </div>
    </div>
  </Frame>
);

// ─── Mocks et stubs ─────────────────────────────────────────────────────────
const M3Dep = ({ x, y, icon, tone, name, kind, how }: { x: number; y: number; icon: IconName; tone: Tone; name: string; kind: string; how: string }) => (
  <div className={A.pop} style={{ position: 'absolute', left: x, top: y, width: 370, display: 'flex', alignItems: 'center', gap: 14, background: C.card, borderRadius: 16, boxShadow: SHADOW, padding: '14px 18px', ...dl(y / 2) }}>
    <IconTile name={icon} tone={tone} size={52} />
    <div>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>
        {name} <span style={{ fontSize: 17, fontWeight: 700, color: T[tone].fg, background: T[tone].bg, borderRadius: 999, padding: '2px 10px', marginLeft: 6 }}>{kind}</span>
      </div>
      <div style={{ fontSize: 19, color: C.muted }}>{how}</div>
    </div>
  </div>
);

const M3_Mocks: Page = () => (
  <Frame mod={3} beats={1}>
    <Title>Mocks et stubs : isoler sans mentir</Title>
    <Lede>On double les frontières que l’on possède — persistance, horloge, notifications —, jamais le domaine lui-même.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <path d="M 490 520 L 600 380" stroke={C.faint} strokeWidth={4} strokeDasharray="10 14" className={A.march} />
      <path d="M 490 540 L 600 540" stroke={C.faint} strokeWidth={4} strokeDasharray="10 14" className={A.march} />
      <path d="M 490 560 L 600 700" stroke={C.faint} strokeWidth={4} strokeDasharray="10 14" className={A.march} />
    </svg>
    <div className={A.pop} style={{ position: 'absolute', left: 120, top: 460, width: 370, background: G.navy, borderRadius: 20, padding: '22px 26px', color: '#fff' }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28 }}>BookingService</div>
      <div style={{ marginTop: 6, fontSize: 20, color: '#C9D2F2' }}>le code réellement testé</div>
    </div>
    <M3Dep x={600} y={330} icon="database" tone="teal" name="Repository" kind="stub" how="renvoie des données fixées" />
    <M3Dep x={600} y={490} icon="clock" tone="yellow" name="Horloge" kind="fake" how="maintenant = 12/10, 9:00" />
    <M3Dep x={600} y={650} icon="mail" tone="violet" name="Notifier" kind="mock" how="appelé une fois, vérifié" />
    <div style={{ position: 'absolute', left: 1060, top: 270, width: 740, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card cls={A.right} tone="blue" icon="filter" title="Stub ou mock ?" size={22} style={dl(300)}>
        Le stub fournit un état, le mock vérifie une interaction. Préférez vérifier l’état : plus robuste au refactoring.
      </Card>
      <Card cls={A.right} tone="coral" icon="alert" title="Le test qui teste son mock" size={22} style={dl(420)}>
        Configurer un retour puis vérifier ce même retour ne prouve rien. Un classique des tests générés.
      </Card>
      <div className={b.on(1)}>
        <CodeDark file="Prompt" size={20} wrap>
          Génère les doubles des dépendances injectées de BookingService. Horloge fixe. <span style={{ color: '#FFD27A' }}>Ne double rien de src/domain.</span>
        </CodeDark>
      </div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 935, width: 1680, fontSize: 21, color: C.muted, ...dl(700) }}>
      Outils : jest.fn · unittest.mock · Mockito · Moq ou NSubstitute. Une horloge injectée évite les tests qui cassent à minuit.
    </div>
  </Frame>
);

// ─── Tests d'intégration ────────────────────────────────────────────────────
const M3Call = ({ verb, path, who, code, tone, beat }: { verb: string; path: string; who: string; code: string; tone: Tone; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 220px 90px', alignItems: 'center', gap: 16, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 20px' }}>
    <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 21, color: C.navy }}>{verb}</span>
    <span style={{ fontFamily: mono, fontSize: 21, color: C.ink }}>{path}</span>
    <span style={{ fontSize: 20, color: C.muted }}>{who}</span>
    <span style={{ textAlign: 'center', fontFamily: mono, fontWeight: 700, fontSize: 22, color: '#fff', background: STRONG[tone], borderRadius: 8, padding: '4px 0' }}>{code}</span>
  </div>
);

const M3_Integration: Page = () => (
  <Frame mod={3} beats={4}>
    <Title>Intégration : un scénario de bout en bout</Title>
    <Lede>Vraies routes, vrai middleware d’auth, vraie validation. Seule la persistance est en mémoire, réinitialisée à chaque test.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1080, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M3Call verb="POST" path="/auth/login" who="Alice (membre)" code="200" tone="green" beat={0} />
      <M3Call verb="POST" path="/bookings · A · 9h–10h" who="Alice" code="201" tone="green" beat={1} />
      <M3Call verb="POST" path="/bookings · A · 9h30–10h30" who="Bob" code="409" tone="coral" beat={2} />
      <M3Call verb="DELETE" path="/bookings/{id d’Alice}" who="Bob" code="403" tone="coral" beat={3} />
      <M3Call verb="GET" path="/rooms/available?9h–10h" who="Bob" code="200" tone="green" beat={4} />
      <div className={b.on(4)} style={{ fontSize: 21, color: C.soft, paddingLeft: 20 }}>
        … et la salle A n’est pas dans la liste.
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1260, top: 262, width: 540, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', ...dl(200) }}>
      <PanelTitle icon="tool">Par stack</PanelTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 21, color: C.soft }}>
        <div>
          <strong style={{ color: T.blue.fg }}>TS</strong> · supertest
        </div>
        <div>
          <strong style={{ color: T.yellow.fg }}>Python</strong> · TestClient (httpx)
        </div>
        <div>
          <strong style={{ color: T.coral.fg }}>Java</strong> · MockMvc, @SpringBootTest
        </div>
        <div>
          <strong style={{ color: T.violet.fg }}>C#</strong> · WebApplicationFactory
        </div>
        <div style={{ marginTop: 6, fontSize: 19, color: C.muted }}>Base réelle : Testcontainers, dans la CI.</div>
      </div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 1260, top: 640, width: 540, ...dl(500) }}>
      <Callout title="Le prompt" tone="pink" icon="chat" size={21}>
        Écris ce scénario en un test d’intégration lisible comme une histoire : une étape, une assertion.
      </Callout>
    </div>
  </Frame>
);

// ─── Couverture et mutation ─────────────────────────────────────────────────
const M3Loop = ({ n, tone, title, sub, cls }: { n: number; tone: Tone; title: string; sub: string; cls?: string }) => (
  <div className={cls} style={{ display: 'flex', alignItems: 'center', gap: 16, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 20px' }}>
    <Num n={n} tone={tone} size={48} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, color: C.muted, lineHeight: 1.35 }}>{sub}</div>
    </div>
  </div>
);

const M3_Coverage: Page = () => (
  <Frame mod={3} beats={2}>
    <Title>Couverture : itérer… sans se faire piéger</Title>
    <Lede>La couverture dit ce qui a été exécuté, pas ce qui a été vérifié. La mutation dit si vos tests détectent une erreur.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 820, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M3Loop n={1} tone="blue" title="Mesurer" sub="jest --coverage · pytest-cov · JaCoCo · coverlet" cls={A.in} />
      <M3Loop n={2} tone="violet" title="Cibler" sub="donner le rapport : « couvre les branches 42–57 »" cls={A.in} />
      <M3Loop n={3} tone="pink" title="Générer" sub="les tests manquants, sur la matrice validée" cls={A.in} />
      <M3Loop n={4} tone="green" title="Muter" sub="Stryker · mutmut · PIT · Stryker.NET" cls={b.on(1)} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1000, top: 262, width: 800, ...dl(200) }}>
      <CodeDark file="booking.test.ts · 100 % de couverture" size={21}>
        <Ck>test</Ck>(<Cs>'book'</Cs>, <Ck>async</Ck> () ={'>'} {'{'}
        {'\n'}
        {'  '}<Ck>await</Ck> service.<Cf>book</Cf>(req);{'\n'}
        {'  '}<Ck>await</Ck> service.<Cf>book</Cf>(conflicting).<Cf>catch</Cf>(() ={'>'} {'{}'});{'\n'}
        {'}'});{'\n'}
        <Cc>// toutes les lignes exécutées… aucune assertion</Cc>
      </CodeDark>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 1000, top: 560, width: 800, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 26px' }}>
      <PanelTitle icon="bug" c={T.green.fg}>
        Le test de mutation
      </PanelTitle>
      <div style={{ fontSize: 22, lineHeight: 1.45, color: C.soft }}>
        L’outil remplace <code style={{ fontFamily: mono, color: C.ink }}>{'<'}</code> par <code style={{ fontFamily: mono, color: C.ink }}>{'<='}</code> dans overlaps. Si aucun test ne casse, le mutant survit : vos tests ne protègent pas cette ligne.
      </div>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 860, width: 1680 }}>
      <Callout title="Indicateur d’équipe" tone="green" icon="gauge" size={23}>
        Seuil de couverture en CI comme garde-fou, score de mutation sur le domaine comme mesure de qualité.
      </Callout>
    </div>
  </Frame>
);

// ─── Les pièges des tests générés ───────────────────────────────────────────
const M3Mark = ({ n }: { n: number }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, marginLeft: 10, borderRadius: 99, background: C.coral, color: '#fff', fontFamily: display, fontWeight: 800, fontSize: 18, verticalAlign: 'middle' }}>{n}</span>
);

const M3Flaw = ({ n, title, children }: { n: number; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 18px' }}>
    <Num n={n} tone="coral" size={36} style={{ marginTop: 2 }} />
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 19, lineHeight: 1.38, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M3_Traps: Page = () => (
  <Frame mod={3} kind="exercice" beats={5}>
    <Title>Repérez les pièges : cinq défauts dans ce test généré</Title>
    <Lede>Il passe au vert. Il ne protège presque rien. Cherchez avant que les réponses n’apparaissent.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1000 }}>
      <CodeDark file="booking.service.test.ts" size={21}>
        <Ck>test</Ck>(<Cs>'book works'</Cs>, <Ck>async</Ck> () ={'>'} {'{'}
        <M3Mark n={1} />
        {'\n'}
        {'  '}repo.findOverlapping.<Cf>mockResolvedValue</Cf>([]);{'\n'}
        {'  '}<Ck>const</Ck> req = {'{'} roomId: <Cs>'A'</Cs>, start: <Ck>new</Ck> <Cf>Date</Cf>(), hours: <Cn>1</Cn> {'}'};
        <M3Mark n={2} />
        {'\n'}
        {'  '}<Ck>const</Ck> res = <Ck>await</Ck> service.<Cf>book</Cf>(req);{'\n'}
        {'  '}<Cf>expect</Cf>(repo.findOverlapping).<Cf>toHaveBeenCalled</Cf>();
        <M3Mark n={3} />
        {'\n'}
        {'  '}<Cf>expect</Cf>(res).<Cf>toBeDefined</Cf>();
        <M3Mark n={4} />
        {'\n'}
        {'}'});{'\n\n'}
        <Ck>test</Ck>.<Cf>skip</Cf>(<Cs>'rejects overlapping booking'</Cs>, <Ck>async</Ck> () ={'>'} {'{'}
        <M3Mark n={5} />
        {'\n'}
        {'  '}<Cc>// TODO: flaky, à corriger plus tard</Cc>
        {'\n'}
        {'}'});
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1170, top: 262, width: 630, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <M3Flaw n={1} title="Nom vague">Il doit décrire le comportement : « réserve un créneau libre ».</M3Flaw>
      <M3Flaw n={2} title="Date réelle">new Date() : test instable, dépend de l’heure d’exécution.</M3Flaw>
      <M3Flaw n={3} title="Teste le mock">Vérifie un appel interne, pas le résultat métier.</M3Flaw>
      <M3Flaw n={4} title="Assertion vide">toBeDefined passe pour presque n’importe quoi.</M3Flaw>
      <M3Flaw n={5} title="Test désactivé">L’agent a « fait passer la suite » en sautant le test qui échouait.</M3Flaw>
    </div>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M3_Qcm: Page = () => (
  <QcmPage
    mod={3}
    n={3}
    title="« Tous les tests passent »"
    q="L’agent annonce : « bug corrigé, tous les tests passent ». Quelle vérification est prioritaire ?"
    explain="Un agent qui doit atteindre « tout au vert » peut y arriver en modifiant les tests. Le diff des tests se relit avant le diff du code."
  >
    <Opt why="Utile, mais une suite qui passe après qu’un test a été supprimé ou désactivé passe… toujours.">
      Relancer la suite soi-même
    </Opt>
    <Opt ok why="Exact : aucun test supprimé, sauté (skip) ou affaibli, aucune assertion commentée. C’est la triche la plus fréquente des agents.">
      Lire le diff des fichiers de test
    </Opt>
    <Opt why="La couverture peut rester stable avec des assertions vidées de leur sens.">
      Vérifier que la couverture n’a pas baissé
    </Opt>
    <Opt why="L’agent confirmera de bonne foi : il croit avoir réussi. Ce n’est pas une vérification indépendante.">
      Demander à l’agent de confirmer qu’il n’a rien cassé
    </Opt>
  </QcmPage>
);

// ─── TP 3 ───────────────────────────────────────────────────────────────────
const M3_TP: Page = () => (
  <LabPage
    mod={3}
    n="3"
    title="Une suite de tests complète"
    defi="tests"
    who="Binôme"
    minutes={25}
    where={
      <>
        <PathChip>tests/CASES.md</PathChip> matrice validée
        <br />
        <PathChip>tests/unit/**</PathChip> <PathChip>tests/integration/**</PathChip>
        <br />
        rapport de couverture (capture)
      </>
    }
    objective={<>Sur l’API du TP 2 : tests unitaires paramétrés, doubles de test pour isoler les dépendances, scénarios d’intégration et couverture mesurée.</>}
    crit={
      <>
        <CheckItem id="tp3-1" size={21}>Matrice en 4 colonnes validée avant génération</CheckItem>
        <CheckItem id="tp3-2" size={21}>Un test paramétré par règle métier</CheckItem>
        <CheckItem id="tp3-3" size={21}>Trois scénarios d’intégration, dont un 403</CheckItem>
        <CheckItem id="tp3-4" size={21}>Services couverts à 80 % des branches</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <M2Step n={1}>Faites produire la matrice de cas, complétez-la, tranchez les « ? ».</M2Step>
      <M2Step n={2}>Tests unitaires du domaine et des services, doubles injectés.</M2Step>
      <M2Step n={3}>Scénarios d’intégration à partir de la matrice « sécurité ».</M2Step>
      <M2Step n={4}>Couverture : ciblez les branches manquantes, relisez le diff des tests.</M2Step>
    </div>
    <TpBonus>Changez un {'<'} en {'<='} dans overlaps : au moins un test doit casser. Sinon, faites-le écrire.</TpBonus>
  </LabPage>
);

// ═══ 35-reprise ════════════════════════════════════════════════════════

// ─── Reprise de l'après-midi : quiz flash ───────────────────────────────────

const R_Quiz: Page = () => (
  <Frame mod={8} kind="quiz">
    <Title>Quiz flash : la matinée en cinq questions</Title>
    <QuizSeries y={200}>
      <QuizQ
        q="Pour que les complétions inline respectent une convention, le levier le plus direct est…"
        explain="L’inline lit le fichier courant et les onglets voisins : un exemple bien placé et un commentaire structuré pèsent plus que toute instruction."
      >
        <QOpt>Une règle dans .github/copilot-instructions.md</QOpt>
        <QOpt ok>Un fichier exemplaire ouvert à côté et un commentaire structuré</QOpt>
        <QOpt>Un modèle plus puissant dans le sélecteur</QOpt>
      </QuizQ>
      <QuizQ
        q="Une tâche va toucher six fichiers. Votre première étape ?"
        explain="Plan en lots, chacun avec son test, validé par vous : l’agent exécute ensuite un lot à la fois."
      >
        <QOpt>Mode Agent directement, avec un prompt détaillé</QOpt>
        <QOpt ok>Mode Plan : un plan en lots, validé avant toute ligne de code</QOpt>
        <QOpt>Mode Ask, puis copier-coller les fichiers proposés</QOpt>
      </QuizQ>
      <QuizQ
        q="Comment comparer deux prompts de façon fiable ?"
        explain="Copilot n’est pas déterministe : plusieurs essais en session neuve, et une grille décidée avant de lancer les essais."
      >
        <QOpt>Un essai chacun, on garde le meilleur résultat</QOpt>
        <QOpt>Demander à Copilot lequel des deux est meilleur</QOpt>
        <QOpt ok>Plusieurs essais en session neuve, grille fixée à l’avance</QOpt>
      </QuizQ>
      <QuizQ
        q="Pourquoi vérifier un état plutôt qu’une interaction dans un test ?"
        explain="Un test d’état survit à un refactoring interne ; un test d’interaction casse dès que l’implémentation change, même si le comportement est identique."
      >
        <QOpt ok>Il résiste mieux au refactoring</QOpt>
        <QOpt>Il s’exécute plus vite</QOpt>
        <QOpt>Copilot le génère plus facilement</QOpt>
      </QuizQ>
      <QuizQ
        q="« 100 % de couverture » signifie que…"
        explain="Toutes les lignes ont été exécutées, rien de plus. Seules les assertions vérifient — et la mutation mesure si elles détectent une erreur."
      >
        <QOpt>Le code n’a plus de bug connu</QOpt>
        <QOpt ok>Chaque ligne a été exécutée par au moins un test</QOpt>
        <QOpt>Chaque comportement a été vérifié</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ═══ 40-m4 ═════════════════════════════════════════════════════════════

// ─── Module 4 · Optimisation & refactoring ──────────────────────────────────

const M4_Divider: Page = () => (
  <Section
    n={4}
    title={
      <>
        Optimisation
        <br />
        et refactoring avancé
      </>
    }
    sub="Repérer les anti-patterns du code généré, restructurer avec SOLID, optimiser en mesurant, moderniser le legacy."
    dur="13:40 – 14:30 · TP inclus"
    labs={<Tag tone="green" size={19}>TP 4 · refactoring en profondeur</Tag>}
  >
    <SecItem n={1}>Les anti-patterns du code généré</SecItem>
    <SecItem n={2}>Refactoring avancé : SOLID</SecItem>
    <SecItem n={3}>Optimiser les performances</SecItem>
    <SecItem n={4}>Moderniser du code legacy</SecItem>
    <SecItem n={5}>Comparer les implémentations générées</SecItem>
  </Section>
);
M4_Divider.transition = BLOOM;

// ─── Anti-patterns (exercice) ───────────────────────────────────────────────
const M4_Smells: Page = () => (
  <Frame mod={4} kind="exercice" beats={6}>
    <Title>Repérez les anti-patterns : six défauts, une fonction</Title>
    <Lede>Du code généré « qui marche ». Cherchez les défauts avant que les réponses n’apparaissent.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1040 }}>
      <CodeDark file="booking.service.ts" size={20}>
        <Ck>async</Ck> <Cf>book</Cf>(req: <Ck>any</Ck>) {'{'}
        <M3Mark n={1} />
        {'\n'}
        {'  '}<Ck>if</Ck> (!req.roomId || !req.start) <Ck>throw new</Ck> <Cf>Error</Cf>(<Cs>'bad'</Cs>);{'\n'}
        {'  '}<Ck>const</Ck> s = <Ck>new</Ck> <Cf>Date</Cf>(req.start), e = <Ck>new</Ck> <Cf>Date</Cf>(req.end);{'\n'}
        {'  '}<Ck>if</Ck> (s.<Cf>getHours</Cf>() {'<'} <Cn>8</Cn> || e.<Cf>getHours</Cf>() {'>'} <Cn>19</Cn>) <Ck>throw new</Ck> <Cf>Error</Cf>(<Cs>'closed'</Cs>);
        <M3Mark n={2} />
        {'\n'}
        {'  '}<Ck>const</Ck> rooms = <Ck>await</Ck> <Ck>this</Ck>.db.<Cf>query</Cf>(<Cs>'SELECT * FROM rooms'</Cs>);{'\n'}
        {'  '}<Ck>for</Ck> (<Ck>const</Ck> r <Ck>of</Ck> rooms) {'{'}
        {'\n'}
        {'    '}<Ck>const</Ck> bs = <Ck>await</Ck> <Ck>this</Ck>.db.<Cf>query</Cf>(<Cs>'SELECT * FROM bookings'</Cs>);
        <M3Mark n={3} />
        {'\n'}
        {'    '}<Ck>for</Ck> (<Ck>const</Ck> b <Ck>of</Ck> bs){'\n'}
        {'      '}<Ck>if</Ck> (r.id === req.roomId {'&&'} b.roomId === r.id {'&&'} s {'<'} b.end {'&&'} b.start {'<'} e){'\n'}
        {'        '}<Ck>throw new</Ck> <Cf>Error</Cf>(<Cs>'conflict'</Cs>);
        <M3Mark n={4} />
        {'\n'}
        {'  }'}
        {'\n'}
        {'  '}<Ck>const</Ck> id = <Ck>await</Ck> <Ck>this</Ck>.db.<Cf>insert</Cf>(<Cs>'bookings'</Cs>, req);{'\n'}
        {'  '}<Ck>try</Ck> {'{'} <Ck>await</Ck> <Ck>new</Ck> <Cf>SmtpMailer</Cf>().<Cf>send</Cf>(req.email); {'}'} <Ck>catch</Ck> {'{}'}
        <M3Mark n={5} />
        {'\n'}
        {'  '}<Ck>return</Ck> id;
        <M3Mark n={6} />
        {'\n'}
        {'}'}
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1210, top: 262, width: 590, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <M3Flaw n={1} title="any à l’entrée">Plus aucun contrat : la validation est contournée.</M3Flaw>
      <M3Flaw n={2} title="Valeurs magiques">8 et 19 en dur, fuseau horaire ignoré.</M3Flaw>
      <M3Flaw n={3} title="N+1, tout charger">Une requête par salle, toutes les réservations à chaque fois.</M3Flaw>
      <M3Flaw n={4} title="Erreurs non typées">« conflict » : la route ne peut pas répondre 409 proprement.</M3Flaw>
      <M3Flaw n={5} title="Exception avalée, new caché">Échec d’envoi invisible ; mailer impossible à tester.</M3Flaw>
      <M3Flaw n={6} title="Fonction fourre-tout">Valide, calcule, persiste, notifie : quatre raisons de changer.</M3Flaw>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 905, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(600) }}>
      <Icon name="chart" size={24} color={C.violet} />
      GitClear 2025 : en 2024, pour la première fois, plus de lignes copiées-collées que de lignes déplacées par refactoring.
    </div>
  </Frame>
);

// ─── SOLID ──────────────────────────────────────────────────────────────────
const M4Solid = ({ l, tone, name, symptom, prompt, beat }: { l: string; tone: Tone; name: string; symptom: string; prompt: string; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'grid', gridTemplateColumns: '70px 300px 400px 1fr', alignItems: 'center', gap: 22, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '12px 22px' }}>
    <span style={{ width: 62, height: 62, borderRadius: 14, background: STRONG[tone], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontWeight: 800, fontSize: 36 }}>{l}</span>
    <span style={{ fontSize: 23, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{name}</span>
    <span style={{ fontSize: 20, lineHeight: 1.35, color: C.soft }}>{symptom}</span>
    <span style={{ fontFamily: mono, fontSize: 18, lineHeight: 1.45, color: C.navy }}>{prompt}</span>
  </div>
);

const M4_Solid: Page = () => (
  <Frame mod={4} beats={4}>
    <Title>Refactoring avancé : SOLID, un principe par prompt</Title>
    <Lede>« Applique SOLID » donne un diff géant. Nommez le symptôme, le principe et la cible : un refactoring par demande.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '70px 300px 400px 1fr', gap: 22, padding: '0 22px', fontSize: 18, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>
        <span />
        <span>PRINCIPE</span>
        <span>SYMPTÔME DANS LE CODE GÉNÉRÉ</span>
        <span>LE PROMPT</span>
      </div>
      <M4Solid l="S" tone="blue" name="Responsabilité unique" symptom="book() valide, calcule, persiste et notifie" prompt="Extrais validation, règle de chevauchement et notification. book() ne fait plus qu’orchestrer." beat={0} />
      <M4Solid l="O" tone="teal" name="Ouvert / fermé" symptom="switch (room.kind) recopié en trois endroits" prompt="Remplace le switch par une stratégie par type de salle. Ajouter « amphi » ne modifie aucune classe." beat={1} />
      <M4Solid l="L" tone="violet" name="Substitution de Liskov" symptom="InMemoryRepo.delete() lève « non implémenté »" prompt="Écris un test de contrat commun à toutes les implémentations du repository." beat={2} />
      <M4Solid l="I" tone="pink" name="Ségrégation des interfaces" symptom="IBookingRepository à 14 méthodes" prompt="Découpe par usage : lecture de disponibilité, écriture de réservation." beat={3} />
      <M4Solid l="D" tone="green" name="Inversion des dépendances" symptom="new SmtpMailer() dans le service" prompt="Injecte un port Notifier par le constructeur ; l’adaptateur SMTP vit dans l’infrastructure." beat={4} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 905, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(600) }}>
      <Icon name="flag" size={24} color={C.violet} />
      Règle : tests au vert avant, tests au vert après, <strong style={{ color: C.navy }}>aucun fichier de test modifié</strong> pendant un refactoring.
    </div>
  </Frame>
);

// ─── Performance ────────────────────────────────────────────────────────────
const M4Bar = ({ label, ms, w, tone, cls }: { label: string; ms: string; w: number; tone: Tone; cls?: string }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: C.ink, marginBottom: 6 }}>
      <span>{label}</span>
      <strong style={{ fontFamily: mono, color: STRONG[tone] }}>{ms}</strong>
    </div>
    <div style={{ height: 26, borderRadius: 13, background: C.panel, overflow: 'hidden' }}>
      <div className={cls} style={{ width: `${w}%`, height: '100%', borderRadius: 13, background: STRONG[tone] }} />
    </div>
  </div>
);

const M4_Perf: Page = () => (
  <Frame mod={4} beats={2}>
    <Title>Optimiser : mesurer d’abord, demander mieux ensuite</Title>
    <Lede>Copilot écrit spontanément l’algorithme le plus évident. Il sait faire mieux… si on lui donne la mesure et la cible.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 860 }}>
      <CodeDark file="Prompt" size={21} wrap>
        Analyse la complexité de <Cf>findAvailableRooms</Cf> (voir le profil joint : 1,8 s pour 200 salles et 10 000 réservations).{'\n\n'}
        Propose une version en O((R + B) log B) : réservations indexées par salle et triées par début.{'\n\n'}
        <span style={{ color: '#FFD27A' }}>Même signature. Tests existants inchangés et au vert. Ajoute un benchmark reproductible.</span>
      </CodeDark>
      <div className={A.fade} style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10, ...dl(300) }}>
        <Bullet size={23} tone="blue">Profiler avant : on optimise ce qui coûte, pas ce qu’on suppose</Bullet>
        <Bullet size={23} tone="blue">Côté base : requête bornée + index (room_id, start)</Bullet>
        <Bullet size={23} tone="blue">Lisibilité contre performance : un choix, pas un réflexe</Bullet>
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1040, top: 262, width: 760, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', ...dl(200) }}>
      <PanelTitle icon="gauge">Benchmark · 200 salles × 10 000 réservations</PanelTitle>
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <M4Bar label="Généré au TP 2 · boucles imbriquées" ms="1 840 ms" w={100} tone="coral" cls={A.grow} />
        <M4Bar label="Index par salle + tri" ms="14 ms" w={2} tone="green" cls={b.grow(1)} />
        <M4Bar label="Requête SQL bornée + index" ms="3 ms" w={1} tone="teal" cls={b.grow(2)} />
      </div>
      <div style={{ marginTop: 22, fontSize: 19, color: C.muted }}>Ordres de grandeur illustratifs : mesurez sur votre machine au TP 4.</div>
    </div>
  </Frame>
);

// ─── Legacy ─────────────────────────────────────────────────────────────────
const M4Leg = ({ n, tone, icon, title, children, beat }: { n: number; tone: Tone; icon: IconName; title: string; children: ReactNode; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ width: 316, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[tone]}`, padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={n} tone={tone} size={42} />
      <IconTile name={icon} tone={tone} size={42} />
    </div>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: C.ink }}>{title}</div>
    <div style={{ fontSize: 21, lineHeight: 1.42, color: C.soft }}>{children}</div>
  </div>
);

const M4_Legacy: Page = () => (
  <Frame mod={4} beats={4}>
    <Title>Moderniser du legacy : figer avant de toucher</Title>
    <Lede>Copilot excelle à expliquer et à réécrire. Le risque : réécrire en changeant le comportement sans que personne le voie.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', justifyContent: 'space-between' }}>
      <M4Leg n={1} tone="blue" icon="search" title="Comprendre" beat={0}>
        /explain, diagramme de séquence, glossaire métier. Rien ne bouge.
      </M4Leg>
      <M4Leg n={2} tone="yellow" icon="lock" title="Figer" beat={1}>
        Tests de caractérisation : on capture le comportement actuel, bugs compris.
      </M4Leg>
      <M4Leg n={3} tone="violet" icon="route" title="Contourner" beat={2}>
        Figuier étrangleur : le nouveau module derrière la même interface.
      </M4Leg>
      <M4Leg n={4} tone="pink" icon="wand" title="Moderniser" beat={3}>
        Un changement par PR : types, async, API dépréciée, version du langage.
      </M4Leg>
      <M4Leg n={5} tone="green" icon="checkCircle" title="Retirer" beat={4}>
        Bascule mesurée, puis suppression de l’ancien code.
      </M4Leg>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(600) }}>
      <Callout title="Le piège" tone="coral" icon="alert" size={24}>
        « Corrige les bugs au passage » : une modernisation ne change pas le comportement. Les bugs trouvés vont dans des tickets séparés.
      </Callout>
    </div>
  </Frame>
);

// ─── Comparer des implémentations (matrice pondérée interactive) ───────────
const M4_SCORES = {
  naif: [5, 1, 4, 4],
  index: [3, 4, 4, 3],
  sql: [4, 5, 2, 4],
};
type M4Key = keyof typeof M4_SCORES;

const M4Weight = ({ label, v, set, tone }: { label: string; v: number; set: (x: number) => void; tone: Tone }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
    <span style={{ width: 170, fontSize: 22, fontWeight: 600, color: C.ink }}>{label}</span>
    <Range value={v} onChange={set} min={0} max={5} w={230} tone={tone} />
    <span style={{ width: 30, fontFamily: mono, fontSize: 24, fontWeight: 700, color: STRONG[tone] }}>{v}</span>
  </div>
);

const M4Impl = ({ id, name, sub, total, max, best }: { id: M4Key; name: string; sub: string; total: number; max: number; best: boolean }) => (
  <div style={{ background: best ? T.green.bg : C.card, borderRadius: 16, boxShadow: best ? `inset 0 0 0 3px ${C.green}` : SHADOW_SM, padding: '16px 22px', transition: `all 300ms ${EASE}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>
          {name} {best ? <Tag tone="green" size={17}>retenue</Tag> : null}
        </div>
        <div style={{ fontSize: 19, color: C.muted }}>{sub}</div>
      </div>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: best ? C.green : C.soft }}>{total}</span>
    </div>
    <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
      <span style={{ fontFamily: mono, fontSize: 17, color: C.muted }}>{M4_SCORES[id].join(' · ')}</span>
    </div>
    <div style={{ marginTop: 8, height: 12, borderRadius: 6, background: C.panel, overflow: 'hidden' }}>
      <div style={{ width: `${max ? (total / max) * 100 : 0}%`, height: '100%', background: best ? C.green : C.faint, transition: `width 400ms ${EASE}` }} />
    </div>
  </div>
);

const M4_Compare: Page = () => {
  const [w, setW] = useState([3, 3, 3, 3]);
  const setAt = (i: number) => (x: number) => setW((o) => o.map((y, j) => (j === i ? x : y)));
  const tot = (id: M4Key) => M4_SCORES[id].reduce((a, s, i) => a + s * w[i], 0);
  const t = { naif: tot('naif'), index: tot('index'), sql: tot('sql') };
  const max = Math.max(t.naif, t.index, t.sql);
  return (
    <Frame mod={4} kind="demo">
      <Title>Comparer les implémentations générées</Title>
      <Lede>Demandez trois versions aux compromis différents, puis choisissez avec vos critères — pas ceux du modèle.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 720 }}>
        <CodeDark file="Prompt" size={20} wrap>
          Propose trois implémentations de findAvailableRooms aux compromis différents. Pour chacune : complexité, avantages, risques. <span style={{ color: '#FFD27A' }}>Ne choisis pas : présente un tableau.</span>
        </CodeDark>
        <div style={{ marginTop: 26, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Eyebrow c={C.navy} size={19}>
            Poids de vos critères (0 à 5)
          </Eyebrow>
          <M4Weight label="Lisibilité" v={w[0]} set={setAt(0)} tone="blue" />
          <M4Weight label="Performance" v={w[1]} set={setAt(1)} tone="coral" />
          <M4Weight label="Testabilité" v={w[2]} set={setAt(2)} tone="pink" />
          <M4Weight label="Cohérence" v={w[3]} set={setAt(3)} tone="teal" />
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 900, top: 262, width: 900, display: 'flex', flexDirection: 'column', gap: 16, ...dl(200) }}>
        <M4Impl id="naif" name="A · Boucles simples" sub="O(R × B) · évident à relire" total={t.naif} max={max} best={t.naif === max} />
        <M4Impl id="index" name="B · Index en mémoire trié" sub="O((R + B) log B) · plus de code" total={t.index} max={max} best={t.index === max} />
        <M4Impl id="sql" name="C · Requête SQL indexée" sub="délègue à la base · tests d’intégration requis" total={t.sql} max={max} best={t.sql === max} />
        <Hint>Notes 1 à 5 par critère (lisibilité · performance · testabilité · cohérence). Bougez les curseurs.</Hint>
      </div>
    </Frame>
  );
};

// ─── QCM ────────────────────────────────────────────────────────────────────
const M4_Qcm: Page = () => (
  <QcmPage
    mod={4}
    n={4}
    title="Un refactoring trop gros"
    q="Vous demandez de refactorer BookingService. Le diff touche 14 fichiers et modifie 3 tests. Les tests passent. Que faites-vous ?"
    explain="Un refactoring se prouve par des tests inchangés. Un diff que personne ne peut relire n’est pas un gain de temps : c’est une dette différée."
  >
    <Opt why="Les tests ont été modifiés dans le même diff : ils ne prouvent plus que le comportement est préservé.">
      L’accepter : les tests passent
    </Opt>
    <Opt ok why="Exact : on rejette, puis un refactoring par demande, tests inchangés, un commit chacun. Chaque diff reste relisible.">
      Rejeter et redemander par petites étapes, tests intouchés
    </Opt>
    <Opt why="Reporter la relecture, c’est la faire sur un diff encore plus gros, mélangé à d’autres changements.">
      L’accepter et relire plus tard, en pull request
    </Opt>
    <Opt why="Un résumé décrit l’intention de l’agent, pas ce que fait réellement le diff.">
      Demander un résumé du diff et valider sur cette base
    </Opt>
  </QcmPage>
);

// ─── TP 4 ───────────────────────────────────────────────────────────────────
const M4_TP: Page = () => (
  <LabPage
    mod={4}
    n="4"
    title="Refactoring en profondeur"
    defi="refacto"
    who="Binôme"
    minutes={25}
    where={
      <>
        <PathChip>REFACTO.md</PathChip> rapport priorisé
        <br />
        un commit par refactoring
        <br />
        <PathChip>bench/availability.*</PathChip>
      </>
    }
    objective={<>Optimiser le code généré le matin en appliquant les principes SOLID et les patterns vus, sans changer le comportement.</>}
    crit={
      <>
        <CheckItem id="tp4-1" size={21}>Rapport d’anti-patterns produit et priorisé</CheckItem>
        <CheckItem id="tp4-2" size={21}>Trois refactorings, un commit chacun</CheckItem>
        <CheckItem id="tp4-3" size={21}>Aucun fichier de test modifié entre-temps</CheckItem>
        <CheckItem id="tp4-4" size={21}>Benchmark avant / après de la recherche</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <M2Step n={1}>Mode Ask : anti-patterns et violations SOLID de votre code. Un rapport, aucune modification.</M2Step>
      <M2Step n={2}>Priorisez trois refactorings avec votre binôme.</M2Step>
      <M2Step n={3}>Un refactoring, un prompt, un commit. Tests au vert à chaque fois.</M2Step>
      <M2Step n={4}>Optimisez findAvailableRooms, benchmark à l’appui.</M2Step>
    </div>
    <TpBonus>Ajoutez le type de salle « amphi » sans modifier une seule classe existante.</TpBonus>
  </LabPage>
);

// ═══ 50-m5 ═════════════════════════════════════════════════════════════

// ─── Module 5 · Sécurité & audit du code généré ─────────────────────────────

const M5_Divider: Page = () => (
  <Section
    n={5}
    title={
      <>
        Sécurité et audit
        <br />
        du code généré
      </>
    }
    sub="Les risques propres au code produit par IA, la grille OWASP, les prompts orientés sécurité, les outils… et le droit."
    dur="14:30 – 15:25 · TP inclus"
    labs={<Tag tone="green" size={19}>TP 5 · audit de sécurité</Tag>}
  >
    <SecItem n={1}>Risques spécifiques au code généré</SecItem>
    <SecItem n={2}>Détecter les vulnérabilités suggérées</SecItem>
    <SecItem n={3}>La grille OWASP Top 10 : 2025</SecItem>
    <SecItem n={4}>Prompts orientés sécurité et outillage</SecItem>
    <SecItem n={5}>Droits d’auteur, licences, conformité</SecItem>
  </Section>
);
M5_Divider.transition = BLOOM;

// ─── Les risques ────────────────────────────────────────────────────────────
const M5Risk = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 22px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={52} />
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 2, fontSize: 21, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M5_Risks: Page = () => (
  <Frame mod={5}>
    <Title>Les risques propres au code généré par IA</Title>
    <Lede>Le modèle reproduit ce qu’il a vu le plus souvent. Et sur le web, le code vulnérable ne manque pas.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 520, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 32px' }}>
      <Stat value={<CountUp to={45} suffix=" %" />} label="des tâches de code confiées à plus de 100 LLM ont produit une faille du Top 10 OWASP" tone="coral" size={120} />
      <div style={{ marginTop: 16, fontSize: 19, color: C.muted }}>Veracode, GenAI Code Security Report, 2025</div>
      <div style={{ marginTop: 22, fontSize: 23, lineHeight: 1.45, color: C.ink }}>
        Les modèles récents écrivent du code <strong>plus correct</strong>… pas <strong>plus sûr</strong>.
      </div>
    </div>
    <div style={{ position: 'absolute', left: 690, top: 270, width: 1110, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
      <M5Risk icon="terminal" tone="coral" title="Injection" d={150}>
        SQL, commande, chemin : concaténation de l’entrée utilisateur.
      </M5Risk>
      <M5Risk icon="eye" tone="yellow" title="Exposition de données" d={250}>
        Champs sensibles renvoyés, traces et secrets dans les logs.
      </M5Risk>
      <M5Risk icon="lock" tone="violet" title="Contrôle d’accès oublié" d={350}>
        L’identité est vérifiée, la propriété jamais (IDOR).
      </M5Risk>
      <M5Risk icon="key" tone="pink" title="Secrets en dur" d={450}>
        Clé « de dev » qui finit en production et dans l’historique Git.
      </M5Risk>
      <M5Risk icon="archive" tone="teal" title="Dépendances vulnérables" d={550}>
        Versions datées, paquets hallucinés (module 2).
      </M5Risk>
      <M5Risk icon="bot" tone="navy" title="Injection de prompt indirecte" d={650}>
        Une issue ou un README piégé dicte des commandes à l’agent.
      </M5Risk>
    </div>
  </Frame>
);

// ─── Détecter (exercice) ────────────────────────────────────────────────────
const M5_Detect: Page = () => (
  <Frame mod={5} kind="exercice" beats={6}>
    <Title>Détecter : six failles dans une suggestion FastAPI</Title>
    <Lede>Elle compile, elle répond, les tests nominaux passent. Repérez les failles avant les réponses.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060 }}>
      <CodeDark file="api/bookings.py" size={20}>
        SECRET = <Cs>"sallelibre-dev-secret"</Cs>
        <M3Mark n={1} />
        {'\n\n'}
        <Ck>def</Ck> <Cf>current_user</Cf>(token: str = Depends(oauth2)):{'\n'}
        {'    '}<Ck>return</Ck> jwt.<Cf>decode</Cf>(token, SECRET, algorithms=[<Cs>"HS256"</Cs>],{'\n'}
        {'                      '}options={'{'}<Cs>"verify_signature"</Cs>: <Cn>False</Cn>{'}'})
        <M3Mark n={2} />
        {'\n\n'}
        <Cf>@router.get</Cf>(<Cs>"/bookings/search"</Cs>){'\n'}
        <Ck>def</Ck> <Cf>search</Cf>(q: str, db=Depends(get_db)):{'\n'}
        {'    '}sql = <Cs>f"SELECT * FROM bookings WHERE title LIKE '%{'{q}'}%'"</Cs>
        <M3Mark n={3} />
        {'\n'}
        {'    '}<Ck>return</Ck> db.<Cf>execute</Cf>(sql).<Cf>fetchall</Cf>()
        <M3Mark n={4} />
        {'\n\n'}
        <Cf>@router.delete</Cf>(<Cs>"/bookings/{'{booking_id}'}"</Cs>){'\n'}
        <Ck>def</Ck> <Cf>cancel</Cf>(booking_id: int, user=Depends(current_user), db=Depends(get_db)):{'\n'}
        {'    '}<Ck>try</Ck>:{'\n'}
        {'        '}db.<Cf>execute</Cf>(<Cs>"DELETE FROM bookings WHERE id = ?"</Cs>, (booking_id,))
        <M3Mark n={5} />
        {'\n'}
        {'    '}<Ck>except</Ck> Exception:{'\n'}
        {'        '}<Ck>return</Ck> {'{'}<Cs>"error"</Cs>: traceback.<Cf>format_exc</Cf>(){'}'}
        <M3Mark n={6} />
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1230, top: 262, width: 570, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <M3Flaw n={1} title="Secret en dur">Dans le code, donc dans Git. Variable d’environnement, coffre.</M3Flaw>
      <M3Flaw n={2} title="Signature non vérifiée">N’importe qui forge un jeton admin.</M3Flaw>
      <M3Flaw n={3} title="Injection SQL">f-string : requête paramétrée obligatoire.</M3Flaw>
      <M3Flaw n={4} title="Surexposition">SELECT * renvoie e-mails et notes de tous.</M3Flaw>
      <M3Flaw n={5} title="IDOR">Aucun contrôle : Bob annule la réservation d’Alice.</M3Flaw>
      <M3Flaw n={6} title="Fuite d’information">La trace révèle chemins, versions et requêtes.</M3Flaw>
    </div>
  </Frame>
);

// ─── Grille OWASP Top 10 : 2025 (checklist interactive) ─────────────────────
const M5Owasp = ({ id, code, name, children }: { id: string; code: string; name: string; children: ReactNode }) => (
  <CheckItem id={id} size={21} tone="coral">
    <span style={{ fontFamily: mono, fontWeight: 700, color: T.coral.fg, marginRight: 12 }}>{code}</span>
    <strong style={{ fontWeight: 700 }}>{name}</strong>
    <span style={{ color: C.muted }}> · {children}</span>
  </CheckItem>
);

const M5_Owasp: Page = () => (
  <Frame mod={5} kind="exercice">
    <Title>La checklist OWASP Top 10 : 2025, appliquée à Copilot</Title>
    <Lede>Pour chaque catégorie, ce que le code généré oublie le plus souvent. Cochez ce que votre revue vérifie déjà.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 258, width: 1180, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <M5Owasp id="ow1" code="A01" name="Contrôle d’accès">propriétaire jamais vérifié</M5Owasp>
        <M5Owasp id="ow2" code="A02" name="Configuration">CORS ouvert, mode debug, en-têtes absents</M5Owasp>
        <M5Owasp id="ow3" code="A03" name="Chaîne d’approvisionnement">paquets hallucinés ou vulnérables</M5Owasp>
        <M5Owasp id="ow4" code="A04" name="Cryptographie">MD5, secret faible, aléa prévisible</M5Owasp>
        <M5Owasp id="ow5" code="A05" name="Injection">SQL ou commande par concaténation</M5Owasp>
        <M5Owasp id="ow6" code="A06" name="Conception">ni limite de débit, ni quota</M5Owasp>
        <M5Owasp id="ow7" code="A07" name="Authentification">JWT non vérifié, sans expiration</M5Owasp>
        <M5Owasp id="ow8" code="A08" name="Intégrité">désérialisation, actions CI non épinglées</M5Owasp>
        <M5Owasp id="ow9" code="A09" name="Journalisation et alertes">secrets loggés, aucun audit</M5Owasp>
        <M5Owasp id="ow10" code="A10" name="Conditions exceptionnelles">erreur avalée ou trace renvoyée</M5Owasp>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1360, top: 258, width: 440, ...dl(300) }}>
        <CheckScore
          max={10}
          label="Ma revue couvre"
          levels={[
            { min: 0, text: 'Revue fonctionnelle seulement : le TP 5 tombe à pic.', tone: 'coral' },
            { min: 4, text: 'Bonne base : outillez le reste en CI.', tone: 'yellow' },
            { min: 8, text: 'Revue solide : faites-en un prompt d’équipe.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 18, fontSize: 21, lineHeight: 1.45, color: C.muted }}>
          Cette liste devient votre grille d’audit au TP 5… et un fichier de prompt au module 6.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Prompts orientés sécurité ──────────────────────────────────────────────
const M5Tip = ({ icon, tone, title, children, beat }: { icon: IconName; tone: Tone; title: string; children: ReactNode; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px' }}>
    <IconTile name={icon} tone={tone} size={50} />
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontFamily: mono, fontSize: 18, lineHeight: 1.5, color: C.navy }}>{children}</div>
    </div>
  </div>
);

const M5_SecurePrompts: Page = () => (
  <Frame mod={5} beats={2}>
    <Title>Des prompts orientés sécurité</Title>
    <Lede>Un modèle ne protège que contre les menaces qu’on lui nomme. Rendez-les explicites, permanentes et vérifiables.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 860 }}>
      <CodeDark file=".github/instructions/security.instructions.md" size={20}>
        <Cc>---</Cc>
        {'\n'}
        <Ck>applyTo</Ck>: <Cs>"src/api/**,src/services/**"</Cs>
        {'\n'}
        <Cc>---</Cc>
        {'\n'}
        <Cf># Règles de sécurité</Cf>
        {'\n'}- Requêtes SQL toujours paramétrées, jamais concaténées.{'\n'}
        - Toute route qui lit ou modifie une ressource vérifie{'\n'}
        {'  '}que l’utilisateur courant en est propriétaire (ou admin).{'\n'}
        - Réponses via des DTO explicites : jamais d’entité brute.{'\n'}
        - Secrets lus depuis l’environnement, jamais en dur.{'\n'}
        - Erreurs : message générique au client, détail dans les logs{'\n'}
        {'  '}sans donnée personnelle ni jeton.{'\n'}
        - JWT : signature, algorithme et expiration vérifiés.
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1040, top: 262, width: 760, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M5Tip icon="target" tone="coral" title="Nommer les menaces" beat={0}>
        Ajoute la recherche par titre. Menaces : injection, données d’autrui, champs sensibles.
      </M5Tip>
      <M5Tip icon="flask" tone="pink" title="Prouver par un test" beat={1}>
        Écris d’abord le test qui exploite la faille. Il doit échouer avant le correctif.
      </M5Tip>
      <M5Tip icon="bug" tone="violet" title="Relire en attaquant" beat={2}>
        Agis comme un pentesteur : comment exploiterais-tu ce diff ? Classe par criticité.
      </M5Tip>
    </div>
  </Frame>
);

// ─── Outillage ──────────────────────────────────────────────────────────────
const M5Stage = ({ n, icon, tone, title, tools, beat }: { n: number; icon: IconName; tone: Tone; title: string; tools: ReactNode; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ width: 400, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[tone]}`, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={n} tone={tone} size={42} />
      <IconTile name={icon} tone={tone} size={42} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.ink }}>{title}</div>
    </div>
    <div style={{ fontSize: 21, lineHeight: 1.5, color: C.soft }}>{tools}</div>
  </div>
);

const M5_Tools: Page = () => (
  <Frame mod={5} beats={3}>
    <Title>Outiller la détection : l’IA ne remplace pas les scanners</Title>
    <Lede>Copilot relit avec intelligence mais sans garantie. Les outils déterministes, eux, ne fatiguent jamais.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', justifyContent: 'space-between' }}>
      <M5Stage n={1} icon="code" tone="blue" title="Éditeur" beat={0} tools={<>Linters de sécurité, SAST local (Semgrep, SonarQube for IDE)</>} />
      <M5Stage n={2} icon="key" tone="yellow" title="Avant le push" beat={1} tools={<>Détection de secrets (gitleaks), push protection GitHub</>} />
      <M5Stage n={3} icon="git" tone="violet" title="Pull request" beat={2} tools={<>CodeQL + Copilot Autofix, Dependabot, dependency review</>} />
      <M5Stage n={4} icon="rocket" tone="green" title="CI" beat={3} tools={<>npm audit · pip-audit · OWASP Dependency-Check · dotnet list package --vulnerable</>} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 560, width: 1680, ...dl(500) }}>
      <Callout title="Copilot Autofix" tone="blue" icon="wand" size={24}>
        Il propose un correctif pour une alerte CodeQL : il se relit comme n’importe quel diff, avec un test qui prouve que la faille est fermée.
      </Callout>
    </div>
  </Frame>
);

// ─── Droits d'auteur, licences, conformité ──────────────────────────────────
const M5_Legal: Page = () => (
  <Frame mod={5}>
    <Title>Droits d’auteur, licences et conformité</Title>
    <Lede>Le code que vous commitez engage votre entreprise, quel que soit l’outil qui l’a suggéré.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <Card cls={A.in} tone="blue" icon="search" title="Code correspondant au code public" size={23} style={dl(100)}>
        Réglage : bloquer, ou autoriser avec référencement (dépôt et licence d’origine affichés). Décidé par l’organisation.
      </Card>
      <Card cls={A.in} tone="violet" icon="scale" title="Licences" size={23} style={dl(200)}>
        Une suggestion proche d’un code sous licence copyleft peut imposer ses conditions. Le référencement permet de décider.
      </Card>
      <Card cls={A.in} tone="teal" icon="lock" title="Confidentialité" size={23} style={dl(300)}>
        Offres Business et Enterprise : données non utilisées pour l’entraînement. Exclusion de contenu pour les fichiers sensibles.
      </Card>
      <Card cls={A.in} tone="coral" icon="humanCheck" title="Responsabilité" size={23} style={dl(400)}>
        L’indemnisation de GitHub suppose le filtre de code public activé. La relecture humaine reste votre obligation.
      </Card>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(600) }}>
      <Callout title="À vérifier dans votre organisation" tone="yellow" icon="alert" size={24}>
        Réglage du filtre de code public, exclusions de contenu, modèles autorisés : ces choix sont faits par les admins, et ils évoluent.
      </Callout>
    </div>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M5_Qcm: Page = () => (
  <QcmPage
    mod={5}
    n={5}
    title="Un correctif automatique"
    q="Copilot Autofix propose un correctif pour une alerte CodeQL d’injection SQL. Que faites-vous ?"
    explain="Un correctif généré reste du code généré : il se relit, et un test d’exploitation prouve que la faille est fermée… et le reste."
  >
    <Opt why="Un correctif peut fermer l’alerte sans fermer la faille, ou casser un comportement voisin.">
      Le fusionner directement : l’outil est fait pour ça
    </Opt>
    <Opt ok why="Exact : relecture du diff, test qui exploite la faille (rouge avant, vert après), puis fusion via la revue habituelle.">
      Le relire et ajouter un test d’exploitation qui doit passer
    </Opt>
    <Opt why="Rejeter par principe, c’est garder la faille. Les correctifs proposés sont souvent bons : ils se vérifient.">
      L’ignorer : les correctifs générés ne sont pas fiables
    </Opt>
    <Opt why="Une alerte fermée à tort est pire qu’une alerte ouverte : elle ne sera plus jamais regardée.">
      Marquer l’alerte comme faux positif si les tests passent
    </Opt>
  </QcmPage>
);

// ─── TP 5 ───────────────────────────────────────────────────────────────────
const M5_TP: Page = () => (
  <LabPage
    mod={5}
    n="5"
    title="Audit de sécurité du code généré"
    defi="audit"
    who="Binôme"
    minutes={25}
    where={
      <>
        <PathChip>SECURITY-AUDIT.md</PathChip> failles classées
        <br />
        <PathChip>tests/security/**</PathChip> un test par faille
        <br />
        <PathChip>.github/instructions/security…</PathChip>
      </>
    }
    objective={<>Analyser le code de {PROJECT} généré par Copilot, identifier les failles et les corriger avec des prompts ciblés.</>}
    crit={
      <>
        <CheckItem id="tp5-1" size={21}>Au moins quatre failles trouvées et classées</CheckItem>
        <CheckItem id="tp5-2" size={21}>Un test d’exploitation par faille corrigée</CheckItem>
        <CheckItem id="tp5-3" size={21}>DELETE d’autrui : 403, prouvé par un test</CheckItem>
        <CheckItem id="tp5-4" size={21}>security.instructions.md commité</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <M2Step n={1}>Audit en rôle d’attaquant, grille OWASP en référence (#file).</M2Step>
      <M2Step n={2}>Classez chaque faille : criticité, preuve, correctif proposé.</M2Step>
      <M2Step n={3}>Une faille, un test qui l’exploite (rouge), un prompt ciblé (vert).</M2Step>
      <M2Step n={4}>Rendez les règles permanentes : instructions par chemin.</M2Step>
    </div>
    <TpBonus>Lancez CodeQL ou Semgrep et comparez avec l’audit de Copilot : qui a trouvé quoi ?</TpBonus>
  </LabPage>
);

// ═══ 60-m6 ═════════════════════════════════════════════════════════════

// ─── Module 6 · Copilot en équipe ───────────────────────────────────────────

const M6_Divider: Page = () => (
  <Section
    n={6}
    title={
      <>
        Bonnes pratiques
        <br />
        d’intégration en équipe
      </>
    }
    sub="Conventions, prompts partagés, pull requests, CI/CD, mesure et charte : passer d’usages individuels à une pratique d’équipe."
    dur="15:40 – 16:30 · TP inclus"
    labs={<Tag tone="green" size={19}>TP 6 · projet de clôture</Tag>}
  >
    <SecItem n={1}>Des conventions d’usage d’équipe</SecItem>
    <SecItem n={2}>Prompts et templates dans le dépôt</SecItem>
    <SecItem n={3}>Pull requests, revue de code et CI/CD</SecItem>
    <SecItem n={4}>Mesurer avec et sans Copilot</SecItem>
    <SecItem n={5}>Une charte d’utilisation responsable</SecItem>
  </Section>
);
M6_Divider.transition = BLOOM;

// ─── Conventions ────────────────────────────────────────────────────────────
const M6Conv = ({ icon, tone, title, q, d }: { icon: IconName; tone: Tone; title: string; q: string; d: number }) => (
  <Card cls={A.in} tone={tone} icon={icon} title={title} size={23} style={dl(d)}>
    {q}
  </Card>
);

const M6_Conventions: Page = () => (
  <Frame mod={6}>
    <Title>Des conventions d’usage, décidées ensemble</Title>
    <Lede>Sans conventions, chacun a son Copilot : six questions que l’équipe tranche une fois, par écrit.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      <M6Conv icon="bot" tone="violet" title="Quels modes, où ?" q="Agent autorisé sur quels dossiers ? Plan obligatoire au-delà de combien de fichiers ?" d={100} />
      <M6Conv icon="cpu" tone="blue" title="Quels modèles ?" q="Lesquels pour quelles tâches, et quel budget de requêtes premium ?" d={180} />
      <M6Conv icon="lock" tone="coral" title="Quelles données ?" q="Ce qui ne part jamais dans un prompt, et les exclusions de contenu configurées." d={260} />
      <M6Conv icon="eye" tone="yellow" title="Quelle revue ?" q="Tout code généré relu comme du code humain. Qui approuve une PR d’agent ?" d={340} />
      <M6Conv icon="flag" tone="teal" title="Quelle traçabilité ?" q="Mention dans la PR, label « ai-assisted », prompts utiles conservés." d={420} />
      <M6Conv icon="flask" tone="green" title="Quelle preuve ?" q="Tests exigés pour tout code généré, seuils de couverture, analyse en CI." d={500} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(700) }}>
      <Icon name="doc" size={24} color={C.electric} />
      Les réponses vont dans le dépôt : <span style={{ fontFamily: mono, color: C.navy }}>CONTRIBUTING.md</span> et <span style={{ fontFamily: mono, color: C.navy }}>.github/copilot-instructions.md</span>.
    </div>
  </Frame>
);

// ─── Partager prompts et templates ──────────────────────────────────────────
const M6_RepoAssets: Page = () => (
  <Frame mod={6} beats={1}>
    <Title>Partager prompts et templates via le dépôt</Title>
    <Lede>Ce qui marche pour un développeur devient l’outil de toute l’équipe : versionné, relu en PR, amélioré.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 700, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px' }}>
      <PanelTitle icon="layers">.github/</PanelTitle>
      <M2Tree name="copilot-instructions.md" note="stack, arbo, conventions" />
      <M2Tree dir name="instructions/" tone="blue" />
      <M2Tree depth={1} name="tests.instructions.md" note="applyTo **/*.test.*" />
      <M2Tree depth={1} name="security.instructions.md" note="TP 5" />
      <M2Tree dir name="prompts/" tone="green" />
      <M2Tree depth={1} name="new-endpoint.prompt.md" note="/new-endpoint" />
      <M2Tree depth={1} name="security-review.prompt.md" note="grille OWASP" />
      <M2Tree depth={1} name="overlap.prompt.md" note="TP 1" />
      <M2Tree dir name="agents/" tone="violet" />
      <M2Tree depth={1} name="reviewer.agent.md" note="relecteur outillé" />
      <div style={{ marginTop: 10, fontSize: 19, color: C.muted }}>
        <span style={{ fontFamily: mono }}>AGENTS.md</span> à la racine : portable entre outils.
      </div>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 880, top: 262, width: 920, ...dl(200) }}>
      <CodeDark file=".github/prompts/new-endpoint.prompt.md" size={20}>
        <Cc>---</Cc>
        {'\n'}
        <Ck>description</Ck>: <Cs>Crée un endpoint REST complet avec ses tests</Cs>
        {'\n'}
        <Ck>agent</Ck>: <Cs>agent</Cs>
        {'\n'}
        <Cc>---</Cc>
        {'\n'}
        Crée l’endpoint <Cn>{'${input:route:ex. GET /rooms/{id}/bookings}'}</Cn>.{'\n'}
        Modèle à suivre : #file:src/api/routes/bookings{'\n'}
        1. Propose le plan (route, validation, service, tests).{'\n'}
        {'   '}Attends ma validation.{'\n'}
        2. Tests d’abord : nominal, limites, négatifs, sécurité.{'\n'}
        3. Implémente jusqu’au vert, puis mets à jour l’OpenAPI.
      </CodeDark>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 880, top: 700, width: 920 }}>
      <Callout title="Dans le chat" tone="green" icon="terminal" size={24}>
        On tape <span style={{ fontFamily: mono }}>/new-endpoint</span> : la méthode de l’équipe, en une commande. Un prompt partagé se relit en PR comme du code.
      </Callout>
    </div>
  </Frame>
);

// ─── Pull request et revue ──────────────────────────────────────────────────
const M6Flow = ({ x, icon, tone, title, sub, who, beat }: { x: number; icon: IconName; tone: Tone; title: string; sub: string; who: 'ia' | 'humain' | 'outil'; beat: number }) => (
  <div className={beat ? b.pop(beat) : A.pop} style={{ position: 'absolute', left: x, top: 300, width: 250, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '16px 18px', borderTop: `6px solid ${STRONG[tone]}` }}>
    <IconTile name={icon} tone={tone} size={48} />
    <div style={{ marginTop: 10, fontFamily: display, fontWeight: 800, fontSize: 23, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 4, fontSize: 19, lineHeight: 1.35, color: C.soft, minHeight: 52 }}>{sub}</div>
    <div style={{ marginTop: 10 }}>
      <Tag tone={who === 'ia' ? 'violet' : who === 'humain' ? 'green' : 'grey'} size={16}>
        {who === 'ia' ? 'Copilot' : who === 'humain' ? 'Humain' : 'Outil'}
      </Tag>
    </div>
  </div>
);

const M6_PR: Page = () => (
  <Frame mod={6} beats={5}>
    <Title>Copilot dans le workflow de pull request</Title>
    <Lede>Copilot écrit, décrit et relit en premier. La CI prouve. Un humain décide.</Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <path d="M 245 290 H 1675" stroke={C.rule} strokeWidth={4} strokeDasharray="10 14" className={A.march} />
    </svg>
    <M6Flow x={120} icon="ticket" tone="grey" title="Issue" sub="critères d’acceptation écrits" who="humain" beat={0} />
    <M6Flow x={407} icon="bot" tone="violet" title="Agent" sub="local, ou issue assignée à Copilot" who="ia" beat={1} />
    <M6Flow x={694} icon="doc" tone="blue" title="PR décrite" sub="résumé généré, relu, complété" who="ia" beat={2} />
    <M6Flow x={981} icon="checkCircle" tone="teal" title="CI" sub="tests, couverture, CodeQL" who="outil" beat={3} />
    <M6Flow x={1268} icon="eye" tone="pink" title="Revue Copilot" sub="premier passage, commentaires" who="ia" beat={4} />
    <M6Flow x={1555} icon="humanCheck" tone="green" title="Revue humaine" sub="approbation obligatoire" who="humain" beat={5} />
    <div className={b.on(5)} style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 22 }}>
      <Card tone="green" icon="humanCheck" title="Approbation" size={22}>
        Une PR créée par l’agent est approuvée par un autre humain que celui qui l’a demandée.
      </Card>
      <Card tone="pink" icon="doc" title="Instructions de revue" size={22}>
        La revue Copilot lit les instructions du dépôt : mettez-y vos points de contrôle.
      </Card>
      <Card tone="yellow" icon="alert" title="Taille" size={22}>
        Au-delà de 400 lignes, la revue humaine décroche. Découpez en amont.
      </Card>
    </div>
  </Frame>
);

// ─── CI/CD ──────────────────────────────────────────────────────────────────
const M6Check = ({ n, title, children }: { n: number; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 18px' }}>
    <Num n={n} tone="teal" size={38} style={{ marginTop: 2 }} />
    <div>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M6Num = ({ n }: { n: number }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, marginLeft: 10, borderRadius: 99, background: C.teal, color: '#fff', fontFamily: display, fontWeight: 800, fontSize: 17, verticalAlign: 'middle' }}>{n}</span>
);

const M6_CICD: Page = () => (
  <Frame mod={6} beats={4}>
    <Title>Copilot et CI/CD : générer pipelines et scripts</Title>
    <Lede>Copilot écrit très bien du YAML… avec les versions et les permissions de sa date d’entraînement. Quatre vérifications.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1000 }}>
      <CodeDark file=".github/workflows/ci.yml" size={20}>
        <Ck>on</Ck>: [pull_request]{'\n'}
        <Ck>permissions</Ck>:{'\n'}
        {'  '}<Ck>contents</Ck>: <Cs>read</Cs>
        <M6Num n={1} />
        {'\n'}
        <Ck>jobs</Ck>:{'\n'}
        {'  '}<Ck>test</Ck>:{'\n'}
        {'    '}<Ck>runs-on</Ck>: <Cs>ubuntu-latest</Cs>
        {'\n'}
        {'    '}<Ck>steps</Ck>:{'\n'}
        {'      '}- <Ck>uses</Ck>: <Cs>actions/checkout@</Cs><Cn>{'<sha>'}</Cn> <Cc># v4.x vérifiée</Cc>
        <M6Num n={2} />
        {'\n'}
        {'      '}- <Ck>uses</Ck>: <Cs>actions/setup-node@</Cs><Cn>{'<sha>'}</Cn>
        {'\n'}
        {'        '}<Ck>with</Ck>: {'{'} <Ck>node-version</Ck>: <Cn>22</Cn>, <Ck>cache</Ck>: <Cs>npm</Cs> {'}'}
        {'\n'}
        {'      '}- <Ck>run</Ck>: <Cs>npm ci</Cs>
        <M6Num n={3} />
        {'\n'}
        {'      '}- <Ck>run</Ck>: <Cs>npm run test:ci</Cs> <Cc># seuil : 80 % des branches</Cc>
        <M6Num n={4} />
      </CodeDark>
      <div className={A.fade} style={{ marginTop: 18, fontSize: 21, color: C.muted, ...dl(500) }}>
        Même démarche pour GitLab CI, Azure Pipelines ou Jenkins, et pour Dockerfile, Makefile et scripts de migration.
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1170, top: 262, width: 630, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M6Check n={1} title="Permissions minimales">Lecture seule par défaut, écriture au cas par cas.</M6Check>
      <M6Check n={2} title="Actions épinglées">Par SHA, version vérifiée : le modèle propose souvent une version ancienne.</M6Check>
      <M6Check n={3} title="Installation reproductible">npm ci, pip install --require-hashes, lockfile respecté.</M6Check>
      <M6Check n={4} title="Portes de qualité">Tests, seuil de couverture, analyse de sécurité bloquants.</M6Check>
    </div>
  </Frame>
);

// ─── Mesurer ────────────────────────────────────────────────────────────────
const M6Metric = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.right} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 18px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={46} />
    <div>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M6_Metrics: Page = () => (
  <Frame mod={6} beats={1}>
    <Title>Évaluer productivité et qualité, avec et sans Copilot</Title>
    <Lede>Deux études sérieuses, deux conclusions opposées. Le ressenti n’est pas une mesure : il faut la vôtre.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 880, display: 'flex', gap: 24 }}>
      <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 26px', borderTop: `7px solid ${C.green}` }}>
        <Stat value={<CountUp to={55} prefix="+" suffix=" %" />} label="de vitesse sur une tâche isolée (serveur HTTP), devs avec Copilot" tone="green" size={92} />
        <div style={{ marginTop: 12, fontSize: 18, color: C.muted }}>GitHub · essai contrôlé, 2022</div>
      </div>
      <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 26px', borderTop: `7px solid ${C.coral}`, ...dl(200) }}>
        <Stat value={<CountUp to={19} prefix="−" suffix=" %" />} label="de vitesse pour des seniors sur leurs propres dépôts… qui se croyaient 20 % plus rapides" tone="coral" size={92} />
        <div style={{ marginTop: 12, fontSize: 18, color: C.muted }}>METR · essai randomisé, 2025</div>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 700, width: 880 }}>
      <Callout title="Protocole d’équipe" tone="blue" icon="flask" size={22}>
        Métriques fixées à l’avance, tâches comparables, 6 à 8 semaines, avant / après. Et on regarde la qualité en même temps que la vitesse.
      </Callout>
    </div>
    <div style={{ position: 'absolute', left: 1060, top: 262, width: 740, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Eyebrow c={C.navy} size={19}>
        Quoi mesurer
      </Eyebrow>
      <M6Metric icon="trend" tone="blue" title="Flux" d={200}>
        Délai de livraison, durée de cycle des PR (DORA).
      </M6Metric>
      <M6Metric icon="bug" tone="coral" title="Qualité" d={300}>
        Taux d’échec des changements, défauts échappés, score de mutation.
      </M6Metric>
      <M6Metric icon="smile" tone="green" title="Expérience" d={400}>
        Satisfaction, charge cognitive, temps de revue (SPACE).
      </M6Metric>
      <M6Metric icon="chart" tone="grey" title="Usage" d={500}>
        Utilisateurs actifs, taux d’acceptation : de l’usage, pas de la valeur.
      </M6Metric>
    </div>
  </Frame>
);

// ─── Charte ─────────────────────────────────────────────────────────────────
const M6_Charter: Page = () => (
  <Frame mod={6} kind="atelier">
    <Title>Une charte d’utilisation responsable de l’IA</Title>
    <Lede>Huit engagements, à adapter. Cochez ceux que votre équipe applique déjà, réellement.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1180, display: 'flex', flexDirection: 'column', gap: 11 }}>
        <CheckItem id="ch1" size={23} tone="navy">Le développeur reste l’auteur et le responsable du code qu’il commite.</CheckItem>
        <CheckItem id="ch2" size={23} tone="navy">Aucun secret, donnée personnelle ou code client hors périmètre dans un prompt.</CheckItem>
        <CheckItem id="ch3" size={23} tone="navy">Tout code généré est relu et testé comme du code humain.</CheckItem>
        <CheckItem id="ch4" size={23} tone="navy">Toute dépendance proposée est vérifiée avant ajout.</CheckItem>
        <CheckItem id="ch5" size={23} tone="navy">Le filtre de code public est actif ; les licences sont respectées.</CheckItem>
        <CheckItem id="ch6" size={23} tone="navy">Les agents travaillent sur branche, droits minimaux, approbation humaine.</CheckItem>
        <CheckItem id="ch7" size={23} tone="navy">Instructions et prompts d’équipe sont versionnés et relus.</CheckItem>
        <CheckItem id="ch8" size={23} tone="navy">L’usage est mesuré ; la charte est revue chaque trimestre.</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1360, top: 262, width: 440, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Maturité de l’équipe"
          levels={[
            { min: 0, text: 'Usages individuels : commencez par 1, 2 et 3.', tone: 'coral' },
            { min: 4, text: 'En construction : écrivez la charte.', tone: 'yellow' },
            { min: 7, text: 'Pratique d’équipe : partagez-la.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 18, fontSize: 21, lineHeight: 1.45, color: C.muted }}>
          Ce qui n’est pas coché aujourd’hui alimente votre plan d’action de fin de journée.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M6_Qcm: Page = () => (
  <QcmPage
    mod={6}
    n={6}
    title="Lire un indicateur"
    q="Le taux d’acceptation des suggestions de l’équipe passe de 25&nbsp;% à 38&nbsp;% en un trimestre. Qu’en concluez-vous ?"
    explain="Le taux d’acceptation mesure l’usage. La valeur se lit dans le flux et la qualité livrés : on croise toujours plusieurs indicateurs."
  >
    <Opt why="Accepter plus de suggestions ne dit rien du temps total, ni des corrections faites ensuite.">
      La productivité de l’équipe a augmenté de 52 %
    </Opt>
    <Opt ok why="Exact : signal d’adoption intéressant, à croiser avec délai de livraison, taux d’échec des changements et défauts.">
      L’usage progresse ; la valeur reste à croiser avec flux et qualité
    </Opt>
    <Opt why="Du code accepté plus souvent peut aussi être du code relu moins attentivement.">
      La qualité du code s’est améliorée
    </Opt>
    <Opt why="Mesurer reste indispensable : c’est l’indicateur isolé qui trompe, pas la mesure.">
      Rien : les indicateurs d’usage sont inutiles
    </Opt>
  </QcmPage>
);

// ─── TP 6 · projet de clôture ───────────────────────────────────────────────
const M6Feat = ({ icon, tone, title, children }: { icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <IconTile name={icon} tone={tone} size={40} />
    <span style={{ fontSize: 22, lineHeight: 1.35, color: C.soft }}>
      <strong style={{ color: C.ink }}>{title}</strong> · {children}
    </span>
  </div>
);

const M6_TP: Page = () => (
  <LabPage
    mod={6}
    n="6"
    title="Projet de clôture : une feature complète"
    defi="soutenance"
    who="Binôme · 4 min de soutenance"
    minutes={25}
    where={
      <>
        une pull request avec description
        <br />
        code, tests, doc OpenAPI, audit
        <br />
        CI verte
      </>
    }
    objective={<>Développer entièrement avec Copilot une feature de {PROJECT}, puis la présenter et la défendre : code, tests, documentation, sécurité.</>}
    crit={
      <>
        <CheckItem id="tp6-1" size={21}>Plan et prompt d’équipe utilisés</CheckItem>
        <CheckItem id="tp6-2" size={21}>Matrice de cas et tests au vert</CheckItem>
        <CheckItem id="tp6-3" size={21}>Revue OWASP faite, failles traitées</CheckItem>
        <CheckItem id="tp6-4" size={21}>PR décrite, CI verte</CheckItem>
      </>
    }
  >
    Choisissez une feature :
    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <M6Feat icon="loop" tone="violet" title="Réservations récurrentes">chaque mardi, avec exceptions</M6Feat>
      <M6Feat icon="clock" tone="yellow" title="Liste d’attente">la salle se libère, le suivant est notifié</M6Feat>
      <M6Feat icon="calendar" tone="teal" title="Export iCal">vos réservations dans votre agenda</M6Feat>
    </div>
    <TpBonus>Passez la PR à la revue Copilot avant la soutenance, et montrez ce que vous avez accepté ou refusé.</TpBonus>
  </LabPage>
);

// ═══ 70-close ══════════════════════════════════════════════════════════

// ─── Clôture ────────────────────────────────────────────────────────────────

// ─── Soutenances ────────────────────────────────────────────────────────────
const CPart = ({ n, tone, min, title, children }: { n: number; tone: Tone; min: string; title: string; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px', ...dl(n * 120) }}>
    <Num n={n} tone={tone} size={46} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>
        {title} <span style={{ fontFamily: mono, fontSize: 20, color: STRONG[tone] }}>{min}</span>
      </div>
      <div style={{ marginTop: 2, fontSize: 21, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const C_Soutenance: Page = () => (
  <Frame mod={7} kind="atelier">
    <Title>Soutenances : quatre minutes pour convaincre</Title>
    <Lede>Le groupe évalue avec la grille. On ne juge pas la taille de la feature, mais la qualité des preuves.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 760, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <CPart n={1} tone="blue" min="1 min" title="La démo">
        La feature en marche, appel réel à l’API.
      </CPart>
      <CPart n={2} tone="green" min="2 min" title="Les preuves">
        Matrice et tests, audit de sécurité, CI verte.
      </CPart>
      <CPart n={3} tone="violet" min="1 min" title="Un refus argumenté">
        Une proposition de Copilot que vous avez rejetée, et pourquoi.
      </CPart>
      <Timer id="soutenance" minutes={4} label="Soutenance" compact cls={A.in} style={dl(500)} />
    </div>
    <Checklist>
      <div className={A.right} style={{ position: 'absolute', left: 940, top: 262, width: 480, display: 'flex', flexDirection: 'column', gap: 10, ...dl(200) }}>
        <Eyebrow c={C.navy} size={19}>
          Grille du groupe
        </Eyebrow>
        <CheckItem id="so1" size={21}>La démo fonctionne</CheckItem>
        <CheckItem id="so2" w={2} size={21}>Tests : matrice et vert</CheckItem>
        <CheckItem id="so3" w={2} size={21}>Sécurité : faille prouvée et fermée</CheckItem>
        <CheckItem id="so4" size={21}>Méthode : plan, prompt d’équipe</CheckItem>
        <CheckItem id="so5" size={21}>PR et documentation à jour</CheckItem>
        <CheckItem id="so6" size={21}>Esprit critique : un refus argumenté</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1460, top: 300, width: 340, ...dl(350) }}>
        <CheckScore
          max={8}
          label="Score"
          levels={[
            { min: 0, text: 'À consolider.', tone: 'grey' },
            { min: 4, text: 'Solide.', tone: 'blue' },
            { min: 7, text: 'Prêt pour la prod.', tone: 'green' },
          ]}
        />
      </div>
    </Checklist>
  </Frame>
);

// ─── Six idées à garder ─────────────────────────────────────────────────────
const CKey = ({ n, tone, icon, title, children, d }: { n: number; tone: Tone; icon: IconName; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Num n={`M${n}`} tone={tone} size={50} />
      <IconTile name={icon} tone={tone} size={50} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.ink }}>{title}</div>
    </div>
    <div style={{ marginTop: 14, fontSize: 23, lineHeight: 1.45, color: C.soft }}>{children}</div>
  </div>
);

const C_Keys: Page = () => (
  <Frame mod={7}>
    <Title>Six idées à garder</Title>
    <Lede>Une par module. Si vous ne deviez retenir qu’une phrase de la journée : Copilot propose, vous prouvez.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      <CKey n={1} tone="blue" icon="chat" title="Le contexte" d={100}>
        Ce que Copilot voit, c’est vous qui le choisissez. Structurez, décomposez, mesurez.
      </CKey>
      <CKey n={2} tone="teal" icon="layers" title="L’architecture" d={180}>
        Plan et interfaces d’abord, génération par lots, à l’image de l’existant.
      </CKey>
      <CKey n={3} tone="pink" icon="flask" title="Les tests" d={260}>
        La matrice avant /tests. Le diff des tests se relit en premier.
      </CKey>
      <CKey n={4} tone="violet" icon="wand" title="Le refactoring" d={340}>
        Un principe par prompt, tests intouchés, performance mesurée.
      </CKey>
      <CKey n={5} tone="coral" icon="shield" title="La sécurité" d={420}>
        Nommez les menaces, prouvez par un test, outillez la détection.
      </CKey>
      <CKey n={6} tone="green" icon="users" title="L’équipe" d={500}>
        Ce qui marche se partage dans le dépôt. La valeur se mesure.
      </CKey>
    </div>
  </Frame>
);

// ─── Auto-positionnement final ──────────────────────────────────────────────
const C_AutoPos: Page = () => (
  <Frame mod={7} kind="exercice">
    <Title>Auto-positionnement : votre point d’arrivée</Title>
    <Lede>Les mêmes huit affirmations qu’à 9:15. Cochez, comparez avec votre score de départ.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="af1" size={27}>Expliquer ce que Copilot « voit » quand il propose une complétion</CheckItem>
        <CheckItem id="af2" size={27}>Découper une tâche complexe en une suite de prompts vérifiables</CheckItem>
        <CheckItem id="af3" size={27}>Faire générer un module qui respecte l’architecture existante</CheckItem>
        <CheckItem id="af4" size={27}>Obtenir des tests qui couvrent cas limites et cas négatifs</CheckItem>
        <CheckItem id="af5" size={27}>Refactorer du code généré en appliquant SOLID, tests au vert</CheckItem>
        <CheckItem id="af6" size={27}>Repérer une injection ou un contrôle d’accès manquant dans une suggestion</CheckItem>
        <CheckItem id="af7" size={27}>Partager instructions et prompts d’équipe via le dépôt</CheckItem>
        <CheckItem id="af8" size={27}>Mesurer l’apport réel de Copilot sur une équipe</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau d’arrivée"
          levels={[
            { min: 0, text: 'Reprenez les TP à froid, à votre rythme.', tone: 'grey' },
            { min: 4, text: 'Bonne progression : ancrez-la cette semaine.', tone: 'blue' },
            { min: 7, text: 'Objectifs atteints : à vous de diffuser.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Un point qui reste décoché ? C’est la première ligne de votre plan d’action.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Plan d'action ──────────────────────────────────────────────────────────
const CHorizon = ({ icon, tone, when, title, d, children }: { icon: IconName; tone: Tone; when: string; title: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, borderTop: `8px solid ${STRONG[tone]}`, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={56} solid />
      <div>
        <Eyebrow c={STRONG[tone] === C.yellow ? C.amber : STRONG[tone]} size={18}>
          {when}
        </Eyebrow>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.ink }}>{title}</div>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: `2px dashed ${C.rule}`, fontSize: 21, color: C.muted }}>Mon engagement : …</div>
  </div>
);

const C_Plan: Page = () => (
  <Frame mod={7} kind="atelier">
    <Title>Mon plan d’action</Title>
    <Lede>Trois horizons, une action chacun. Écrivez-les sur votre fiche : le questionnaire à froid vous les rappellera.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, height: 470, display: 'flex', gap: 28 }}>
      <CHorizon icon="bolt" tone="blue" when="Demain" title="Sur mon poste" d={100}>
        <Bullet size={22}>Écrire copilot-instructions.md pour mon projet</Bullet>
        <Bullet size={22}>Ajouter security.instructions.md</Bullet>
        <Bullet size={22}>Une matrice de cas avant chaque /tests</Bullet>
      </CHorizon>
      <CHorizon icon="users" tone="violet" when="Dans 30 jours" title="Avec mon équipe" d={220}>
        <Bullet size={22} tone="violet">Trois prompts d’équipe partagés et relus</Bullet>
        <Bullet size={22} tone="violet">Relire le diff des tests en premier, en règle</Bullet>
        <Bullet size={22} tone="violet">Mesurer une base « avant »</Bullet>
      </CHorizon>
      <CHorizon icon="flag" tone="green" when="Dans 90 jours" title="Pour l’organisation" d={340}>
        <Bullet size={22} tone="green">Charte adoptée et affichée</Bullet>
        <Bullet size={22} tone="green">CodeQL et secrets bloquants en CI</Bullet>
        <Bullet size={22} tone="green">Un bilan mesuré, partagé</Bullet>
      </CHorizon>
    </div>
  </Frame>
);

// ─── Ressources & évaluation ────────────────────────────────────────────────
const CRes = ({ icon, tone, title, url, d }: { icon: IconName; tone: Tone; title: string; url: string; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 16, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 18px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={46} />
    <div>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontFamily: mono, fontSize: 18, color: C.electric }}>{url}</div>
    </div>
  </div>
);

const CEval = ({ n, tone, title, children, d }: { n: number; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.right} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', ...dl(d) }}>
    <Num n={n} tone={tone} size={42} />
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 21, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const C_Resources: Page = () => (
  <Frame mod={7}>
    <Title>Ressources et évaluation</Title>
    <Lede>Copilot change chaque mois : ces sources font foi, nos supports datent d’octobre 2026.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 960, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <CRes icon="book" tone="blue" title="Documentation GitHub Copilot" url="docs.github.com/copilot" d={100} />
      <CRes icon="code" tone="violet" title="Copilot dans VS Code" url="code.visualstudio.com/docs/copilot" d={170} />
      <CRes icon="layers" tone="green" title="Instructions, prompts et agents de la communauté" url="github.com/github/awesome-copilot" d={240} />
      <CRes icon="shield" tone="coral" title="OWASP Top 10 : 2025" url="owasp.org/Top10" d={310} />
      <CRes icon="chart" tone="teal" title="Rapports DORA (IA et performance)" url="dora.dev" d={380} />
      <CRes icon="flask" tone="yellow" title="Étude METR sur la productivité (2025)" url="metr.org" d={450} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1140, top: 262, width: 660, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', display: 'flex', flexDirection: 'column', gap: 22, ...dl(200) }}>
      <PanelTitle icon="note">Évaluation de la formation</PanelTitle>
      <CEval n={1} tone="blue" title="À chaud, maintenant" d={300}>
        Questionnaire de satisfaction : cinq minutes, avant de partir.
      </CEval>
      <CEval n={2} tone="violet" title="Par le formateur" d={400}>
        Compétences évaluées sur les TP et la soutenance.
      </CEval>
      <CEval n={3} tone="green" title="À froid, dans quelques semaines" d={500}>
        Ce qui est resté, ce que vous appliquez au quotidien.
      </CEval>
    </div>
  </Frame>
);

// ─── Merci ──────────────────────────────────────────────────────────────────
const C_Thanks: Page = () => (
  <Frame mod={7} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={170} r={46} cls={A.fade} />
    <div style={{ position: 'absolute', left: 390, top: 150, width: 1400 }}>
      <div className={A.in} style={{ fontFamily: display, fontWeight: 800, fontSize: 120, lineHeight: 1, letterSpacing: '-0.03em', color: C.navy }}>
        Merci !
      </div>
      <div className={A.in} style={{ marginTop: 40, maxWidth: 1150, ...dl(200) }}>
        <Quote by="Le fil conducteur de la journée">Copilot propose, le développeur dispose… et prouve.</Quote>
      </div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 1360, top: 520, ...dl(900) }}>
      <div style={{ transform: 'rotate(-7deg)', fontFamily: '"Mr Dafoe", "Segoe Script", cursive', fontSize: 78, color: C.electric, lineHeight: 1 }}>Together we grow</div>
    </div>
    <Portrait w={170} x={390} y={640} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 664, ...dl(300) }}>
      <Eyebrow c={C.muted} size={20}>
        Votre formateur
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 10, fontSize: 23, color: C.soft }}>Questions et retours d’expérience bienvenus, par LinkedIn.</div>
    </div>
    <div className={A.pop} style={{ position: 'absolute', left: 1500, top: 720, ...dl(600) }}>
      <DapLogo size={40} />
    </div>
    <Footer left={390} />
  </Frame>
);
C_Thanks.transition = BLOOM;

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
  title: "GitHub Copilot · Niveau avancé",
  createdAt: '2026-10-12T06:41:38.001Z',
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
  M1_Divider,
  M1_Context,
  M1_Anatomy,
  M1_MultiStep,
  M1_DocComments,
  M1_Compare,
  M1_Levers,
  M1_ChatVsInline,
  M1_Qcm,
  M1_TP,
  M2_Divider,
  M2_Scaffold,
  M2_ApiFlow,
  M2_Patterns,
  M2_Exemplar,
  M2_Deps,
  M2_Qcm,
  M2_TP,
  M3_Divider,
  M3_Strategy,
  M3_Unit,
  M3_Mocks,
  M3_Integration,
  M3_Coverage,
  M3_Traps,
  M3_Qcm,
  M3_TP,
  R_Quiz,
  M4_Divider,
  M4_Smells,
  M4_Solid,
  M4_Perf,
  M4_Legacy,
  M4_Compare,
  M4_Qcm,
  M4_TP,
  M5_Divider,
  M5_Risks,
  M5_Detect,
  M5_Owasp,
  M5_SecurePrompts,
  M5_Tools,
  M5_Legal,
  M5_Qcm,
  M5_TP,
  M6_Divider,
  M6_Conventions,
  M6_RepoAssets,
  M6_PR,
  M6_CICD,
  M6_Metrics,
  M6_Charter,
  M6_Qcm,
  M6_TP,
  C_Soutenance,
  C_Keys,
  C_AutoPos,
  C_Plan,
  C_Resources,
  C_Thanks,
] satisfies Page[];

// Speaker notes — one entry per page, same order as the default export.
export const notes: (string | undefined)[] = [
  `⏱ 2 min · COUVERTURE · 9:00

OBJECTIF — Accueillir, poser le niveau : ce n’est pas une découverte de Copilot.

DIRE — « Bonjour à toutes et à tous. Cette journée s’adresse à des développeurs qui utilisent déjà GitHub Copilot au quotidien. On ne va pas apprendre à appuyer sur Tab : on va apprendre à obtenir du code qu’on peut défendre en revue. Prompts structurés, architectures, tests, refactoring, sécurité et travail d’équipe. »

ANIMATION — Laisser la page affichée pendant l’installation.

TRANSITION — « Quelques mots sur la journée et sur ce que vous allez produire. »`,
  `⏱ 2 min · BIENVENUE

OBJECTIF — Donner la promesse chiffrée et le contrat pédagogique.

DIRE — « Sept heures, dont environ 40 % de pratique : six TP qui s’enchaînent sur le même projet. Le TP 2 produit une API, le TP 3 la teste, le TP 4 la refactore, le TP 5 l’audite, et en fin de journée chaque binôme défend une feature complète devant le groupe. Le contrat : je montre, vous pratiquez. Et le fil conducteur : Copilot propose, le développeur dispose… et prouve. Prouver, c’est le mot de la journée : des tests, des mesures, des revues. »

TRANSITION — « Faisons connaissance. »`,
  `⏱ 4 min · TOUR DE TABLE (sondage)

OBJECTIF — Connaître les stacks pour former les binômes, et les attentes pour doser les modules.

DIRE — « Premier vote : la stack que vous utiliserez dans les TP. Les binômes se forment par langage. » Compter, cliquer. « Deuxième vote : votre attente numéro un. Chaque ligne correspond à un module de la journée. »

ANIMATION — Cliquer une ligne par main levée. Noter les deux attentes les plus fortes : y revenir explicitement dans les modules correspondants.

TRANSITION — « Voici les objectifs officiels de la formation. »`,
  `⏱ 2 min · OBJECTIFS

OBJECTIF — Présenter les six objectifs du programme et l’équilibre de la journée.

DIRE — « Six objectifs, un par module, à une nuance près : le sixième — identifier et contourner les limites de Copilot — est transversal. Chaque module se termine par un QCM et un TP. L’équilibre annoncé : 60 % d’apports et de démonstrations, 40 % de pratique. Évaluation continue, et auto-positionnement au début et à la fin pour mesurer votre progression. »

TRANSITION — « Le déroulé heure par heure. »`,
  `⏱ 2 min · PROGRAMME

OBJECTIF — Donner le déroulé horaire et le repère visuel du bandeau.

DIRE — « Le matin : prompt engineering, génération d’architectures, puis tests. L’après-midi : refactoring, sécurité, et intégration en équipe. On reprend à 13:30 par un quiz flash sur la matinée. La fin de journée est réservée aux soutenances : chaque binôme présente sa feature. Le bandeau en haut à droite vous dit toujours où on en est. »

ANIMATION — Les horaires sont indicatifs : ajuster selon le rythme du groupe.

TRANSITION — « Avant de commencer, mesurons votre point de départ. »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT (exercice)

OBJECTIF — Mesurer le niveau de départ, exigence du dispositif d’évaluation.

DIRE — « Huit affirmations, une par compétence visée. Cochez seulement ce que vous savez faire aujourd’hui, sans aide. Notez votre score : on refera exactement le même exercice en fin de journée. »

ANIMATION — Faire cocher collectivement un participant volontaire, ou laisser chacun noter sur papier. Repérer les scores très hauts : leur proposer les bonus des TP.

TRANSITION — « Parlons du projet sur lequel vous allez travailler toute la journée. »`,
  `⏱ 3 min · FIL ROUGE SALLELIBRE

OBJECTIF — Présenter le projet commun et la chaîne des TP.

DIRE — « SalleLibre est une API REST de réservation de salles de réunion. Volontairement banale : tout le monde comprend le métier, donc on peut se concentrer sur la technique. Mais elle contient tout ce qui rend Copilot intéressant… et dangereux : de la logique métier avec des cas limites — les chevauchements de créneaux —, de l’authentification et des rôles — chacun ne gère que ses réservations —, un algorithme de recherche, et de la documentation. Chaque binôme choisit sa stack. À droite, votre parcours : six TP, chacun produit quelque chose que le suivant réutilise. »

TRANSITION — « Dernière étape avant de coder : le check-up technique. »`,
  `⏱ 4 min · CHECK-UP (minuteur 3 min)

OBJECTIF — Vérifier les prérequis techniques du programme : VS Code et Copilot actif.

DIRE — « Trois minutes. Vérifiez chaque ligne et cochez. Le point le plus fréquent en panne : le mode Agent absent, souvent parce que l’extension n’est pas à jour ou qu’une politique d’organisation le désactive. Et la règle d’or : aucune donnée réelle dans un prompt aujourd’hui. »

ANIMATION — Lancer le minuteur. Passer dans les rangs. Si un poste n’a pas Copilot, le binôme travaille sur le poste de l’autre.

TRANSITION — « Tout le monde est prêt ? Module 1 : le prompt engineering avancé. »`,
  `⏱ 1 min · DIVISEUR M1 · 9:20

OBJECTIF — Annoncer le module 1 du programme : techniques avancées de prompt engineering.

DIRE — « Module 1 : le prompt engineering avancé. On commence par un rappel des bases — ce que Copilot voit réellement —, puis on structure les prompts, on les décompose en étapes, on utilise les commentaires structurés comme levier, et surtout on apprend à mesurer : comparer deux prompts autrement qu’à l’impression. On termine par le choix de l’outil — inline, chat ou agent — et le TP 1. »

TRANSITION — « Point de départ : qu’est-ce que Copilot voit quand il vous répond ? »`,
  `⏱ 5 min · CONTEXTE (2 temps)

OBJECTIF — Rappeler comment Copilot interprète le contexte, en distinguant inline et chat.

DIRE — « La complétion inline est un mécanisme rapide : le modèle reçoit ce qui précède votre curseur et ce qui suit — c’est le fill-in-the-middle —, plus des extraits des onglets ouverts et des fichiers voisins pertinents. Remarquez le commentaire au-dessus de la fonction : il fait partie du préfixe, donc il guide la suggestion. Point important pour des utilisateurs avancés : vos instructions personnalisées ne sont pas lues par l’inline. » → clic. « Le chat et l’agent, c’est une fenêtre de contexte beaucoup plus large, composée de couches : le prompt système et les outils, vos instructions de dépôt, vos références explicites, l’historique de session — erreurs comprises —, les résultats d’outils, et enfin votre message, souvent la plus petite part. » → clic. « Conséquence pratique : deux leviers différents selon l’outil. »

ANIMATION — Démo possible : ouvrir un fichier types dans un onglet voisin et montrer que la complétion change.

TRANSITION — « Puisque le message compte, structurons-le. »`,
  `⏱ 5 min · STRUCTURER UN PROMPT (démo interactive)

OBJECTIF — Montrer l’effet de chaque composant : contexte, tâche bornée, contraintes, exemples attendus, critère de fin.

DIRE — « Voici le prompt que tout le monde écrit : fais une fonction qui vérifie si deux réservations se chevauchent. » Activer Contexte. « On dit où sont les types. » Tâche bornée. « On dit quoi, et seulement quoi. » Contraintes. « Voici la décision que Copilot prenait au hasard : les bornes. 10h–11h et 11h–12h, chevauchement ou pas ? C’est une règle métier, pas une évidence. » Exemples. « Les exemples attendus sont la contrainte la plus forte : ils deviennent les tests. » Critère de fin. « Et on dit quand c’est fini. Regardez la jauge. »

ANIMATION — Cliquer les toggles un à un. Demander au groupe lequel ils oublient le plus souvent : en général les exemples et le critère de fin.

TRANSITION — « Pour une tâche plus grosse, un seul prompt ne suffit plus : on décompose. »`,
  `⏱ 4 min · MULTI-ÉTAPES (4 temps)

OBJECTIF — Décomposer une tâche complexe en instructions claires et vérifiables.

DIRE — « Étape 1 : clarifier. On demande à Copilot de nous interroger avant d’écrire : c’est la technique la plus sous-utilisée. » → clic. « Étape 2 : planifier, en lots de un à trois fichiers, chacun avec le test qui le valide. Pas de code. » → clic. « Étape 3 : exécuter un seul lot, et s’arrêter quand ses tests passent. » → clic. « Étape 4 : faire relire le diff par Copilot lui-même avant le lot suivant : il trouve souvent ses propres oublis. » → clic. « La règle : pas d’étape suivante sans preuve. Et quand la session devient longue et confuse, on repart d’une session neuve avec le plan validé : l’historique pollué est un contexte comme un autre. »

TRANSITION — « Pour l’inline, le meilleur prompt multi-étapes, c’est un commentaire bien écrit. »`,
  `⏱ 4 min · COMMENTAIRES STRUCTURÉS (démo, onglets)

OBJECTIF — Utiliser JSDoc, docstring, Javadoc ou XML doc comme levier de qualité.

DIRE — « Quatre stacks, même idée. Le commentaire structuré fixe ce que la signature ne dit pas : la sémantique des bornes, le tri du résultat, l’exception attendue, et un exemple. Pour l’inline, c’est le préfixe parfait. Et contrairement à un message de chat, il reste dans le code : relu en revue, utile au prochain développeur. »

ANIMATION — Cliquer chaque onglet de langage selon les stacks du groupe. Démo possible : écrire le commentaire, puis laisser l’inline proposer le corps.

TRANSITION — « Comment savoir si un prompt est meilleur qu’un autre ? En mesurant. »`,
  `⏱ 4 min · COMPARER DES PROMPTS (3 temps)

OBJECTIF — Comparer des prompts par des mesures, et itérer méthodiquement.

DIRE — « Copilot n’est pas déterministe : un essai ne prouve rien. Protocole : même tâche, même modèle, session neuve, trois essais par version. V1, le prompt basique : il compile une fois sur trois, les bornes sont fausses. » → clic. « V2 ajoute contexte et contraintes : nettement mieux. » → clic. « V3 ajoute exemples et critère de fin : zéro aller-retour. » → clic. « Votre grille doit être décidée avant les essais, avec des critères binaires ou comptables. Et pour itérer : un seul changement à la fois. Les chiffres affichés sont illustratifs : vous produirez les vôtres au TP 1. »

TRANSITION — « Avant le TP, les leviers du chat que vous devez avoir sous les doigts. »`,
  `⏱ 3 min · LEVIERS DU CHAT

OBJECTIF — Rappeler les références, participants, commandes et le choix du modèle.

DIRE — « Le dièse : ce que le modèle lit. Peu de fichiers bien choisis valent mieux que tout le dépôt. L’arobase : qui répond, par exemple @terminal pour une erreur de commande. La barre oblique : des intentions prêtes, /tests, /fix, /explain, /compact pour résumer une session longue — et cet après-midi, vos propres commandes d’équipe. Enfin le modèle : un modèle rapide pour le répétitif, un modèle de raisonnement pour un plan ou une architecture ; tous n’ont pas le même coût en requêtes premium. »

ANIMATION — Insister sur la limite : l’outil évolue chaque mois.

TRANSITION — « Dernier choix : quel outil pour quel besoin ? Petit jeu. »`,
  `⏱ 5 min · INLINE / CHAT / AGENT (jeu de tri, 1 temps)

OBJECTIF — Choisir entre suggestions inline et Copilot Chat selon le cas d’usage.

DIRE — « Huit situations, trois colonnes. Venez glisser les étiquettes, ou dictez-moi. » Laisser débattre. → clic pour le corrigé. « Le critère : la portée et le besoin de vérification. Une ligne évidente, c’est l’inline ou les suggestions de modification suivante. Comprendre ou comparer, c’est le chat. Plusieurs fichiers, des commandes, des tests à faire passer : plan puis agent. »

ANIMATION — Drag & drop sur l’écran partagé. Double-clic remet une étiquette à sa place.

TRANSITION — « Vérifions avec un QCM. »`,
  `⏱ 2 min · QCM 1

OBJECTIF — Vérifier la compréhension du contexte inline.

DIRE — « Le piège attendu, c’est la B : les instructions personnalisées sont précieuses, mais pour le chat et les agents. L’inline, lui, lit le fichier et les onglets voisins. »

ANIMATION — Faire voter, cliquer la réponse choisie, puis → pour la bonne réponse et → pour l’essentiel.

TRANSITION — « À vous : TP 1. »`,
  `⏱ 25 min (minuteur) · TP 1

OBJECTIF — Atelier du programme : réécrire des prompts basiques en prompts avancés et mesurer l’impact sur la qualité du code généré.

DIRE — « Trois prompts basiques. Pour chacun : lancez-le tel quel deux fois en session neuve, notez la grille. Réécrivez-le avec les cinq composants, relancez deux fois, notez. Gardez le code du meilleur résultat pour overlaps : c’est la première brique de SalleLibre. Et sauvegardez votre meilleur prompt dans .github/prompts : on le partagera au module 6. »

ANIMATION — Lancer le minuteur. Passer dans les binômes : vérifier que la grille est décidée avant les essais. À 20 minutes, demander à deux binômes leurs chiffres V1/V2.

TRANSITION — « Vous avez une fonction et une méthode. Passons à l’échelle d’un module entier. »`,
  `⏱ 1 min · DIVISEUR M2 · 10:45

OBJECTIF — Annoncer le module 2 du programme : génération de modules et d’architectures complexes.

DIRE — « Module 2 : on passe de la fonction au module, puis à l’application. Générer une structure complète, développer une API REST de bout en bout, travailler avec les patterns Repository, Service et Factory, gérer les dépendances et les imports générés, et garder un code maintenable. Le TP 2 produit l’API SalleLibre complète. »

TRANSITION — « Tout commence par l’arborescence. »`,
  `⏱ 4 min · STRUCTURE DE PROJET (2 temps)

OBJECTIF — Générer une structure de projet complète : arborescence, modules, interfaces.

DIRE — « L’arborescence, c’est de l’architecture : on ne la laisse pas émerger au fil des prompts. Mode Plan : on donne le contexte, le style d’architecture voulu, et on demande pour chaque dossier son rôle en une ligne, plus la liste des interfaces à créer en premier. Aucune implémentation. » → clic. « Voici une proposition retenue : un domaine pur, des repositories derrière des interfaces, des services métier, des routes fines, et PLAN.md qui garde le plan. » → clic. « Interfaces d’abord : une fois les contrats validés, les implémentations se génèrent par lots, et l’arbo figée va dans les instructions du dépôt pour que chaque session la respecte. »

TRANSITION — « Suivons une requête à travers ces couches. »`,
  `⏱ 4 min · API DE BOUT EN BOUT (1 temps)

OBJECTIF — Développer une API REST complète : routes, modèles, validation, et montrer les équivalents par stack.

DIRE — « Une réservation entre par une requête avec un jeton. L’authentification établit l’identité et le rôle. La validation rejette ce qui est mal formé avant tout traitement. La route, fine, traduit HTTP vers le métier. Le service applique les règles : heures ouvrées, chevauchement. Le repository persiste. Chaque couche a sa responsabilité, donc son prompt et ses tests : c’est ce découpage qui rend la génération relisible. » → clic. « Le tableau des équivalents pour vos stacks : Copilot les connaît toutes ; précisez toujours la vôtre et sa version dans les instructions. »

TRANSITION — « Dans ces couches, trois patterns reviennent. »`,
  `⏱ 4 min · PATTERNS (cartes à retourner)

OBJECTIF — Travailler avec Repository, Service et Factory.

DIRE — « Copilot connaît ces patterns par cœur. Ce qu’il ne connaît pas, c’est votre variante : quelles méthodes, quelles erreurs, ce qui est interdit dedans. Retournons les cartes. » Cliquer chaque carte. « Remarquez : chaque prompt dit ce qu’il ne faut pas faire. Pas de logique métier dans le repository, pas d’objet HTTP dans le service. Et le piège : demander les bonnes pratiques en général produit des couches vides. Un pattern se justifie par un besoin. »

TRANSITION — « Le plus efficace pour un code maintenable, c’est de montrer un modèle. »`,
  `⏱ 3 min · GÉNÉRER À L’IMAGE DE L’EXISTANT (3 temps)

OBJECTIF — Copilot et les design patterns : générer du code maintenable et extensible.

DIRE — « Copilot imite mieux qu’il n’invente. Le prompt : crée RoomService exactement sur le modèle de BookingService, tests compris, et demande avant de t’écarter. C’est ce qui garde trente services cohérents. À droite, les quatre contrats à exiger : dépendances injectées. » → clic. « Erreurs métier typées. » → clic. « Interfaces aux frontières. » → clic. « Routes sans logique. Ce sont aussi vos critères de revue cet après-midi. »

TRANSITION — « Dernier point avant le TP : ce que Copilot importe. »`,
  `⏱ 3 min · DÉPENDANCES (1 temps)

OBJECTIF — Gérer les dépendances et les imports générés automatiquement.

DIRE — « Quatre risques. Le paquet halluciné : l’étude USENIX Security 2025 de Spracklen et al. a mesuré près de 20 % de paquets inexistants parmi ceux recommandés par 16 modèles. Et comme les mêmes noms reviennent, un attaquant peut les publier : c’est le slopsquatting. La version datée, l’import fantôme, la dépendance superflue. » → clic. « Les règles d’équipe : une liste blanche dans les instructions, interdiction d’ajouter une dépendance sans accord, vérification sur le registre, lockfile commité et audit en CI. »

TRANSITION — « QCM. »`,
  `⏱ 2 min · QCM 2

OBJECTIF — Vérifier le réflexe de vérification des dépendances.

DIRE — « Le piège C est le plus intéressant : demander au modèle de valider sa propre hallucination. Il le fera avec aplomb. La vérification se fait hors du modèle. »

ANIMATION — Vote, clic, → bonne réponse, → l’essentiel.

TRANSITION — « TP 2 : l’API complète. »`,
  `⏱ 30 min (minuteur) · TP 2

OBJECTIF — Cas pratique du programme : générer une API REST complète avec authentification, validation et documentation, en utilisant des prompts structurés.

DIRE — « Quatre lots, un plan. D’abord le mode Plan : arborescence et interfaces, vous validez, vous sauvegardez dans PLAN.md. Puis le domaine — reprenez overlaps du TP 1 — et des repositories en mémoire : pas de base de données aujourd’hui, ça garde les tests rapides. Puis les services, puis routes, validation et authentification, puis la documentation. Critères : un chevauchement renvoie 409, une route protégée renvoie 401 sans jeton et 403 sans le bon rôle. »

ANIMATION — Minuteur. Vérifier que les binômes valident le plan avant de coder. Signaler les binômes qui génèrent tout en un seul prompt : leur faire relire le diff.

TRANSITION — « Votre API tourne. Est-elle correcte ? Module 3 : les tests. »`,
  `⏱ 1 min · DIVISEUR M3 · 11:40

OBJECTIF — Annoncer le module 3 du programme : automatisation de la génération de tests.

DIRE — « Module 3 : les tests. C’est là que Copilot fait gagner le plus de temps… et là qu’il donne la plus fausse impression de sécurité. Stratégie d’abord — couverture, cas limites, cas négatifs —, puis tests unitaires, mocks et stubs, tests d’intégration, et enfin l’analyse de couverture et ses pièges. TP 3 : la suite complète de l’API du TP 2. »

TRANSITION — « Tout commence par une stratégie, pas par /tests. »`,
  `⏱ 4 min · MATRICE DE CAS (4 temps)

OBJECTIF — Stratégie de test avec Copilot : couverture, cas limites, cas négatifs.

DIRE — « Si vous tapez juste "écris des tests", vous obtenez surtout des cas nominaux. Exigez quatre colonnes. Nominal. » → clic. « Limites : deux réservations bout à bout, une réservation pile à l’ouverture, le changement d’heure. » → clic. « Négatifs : chevauchement partiel, début après la fin, salle inconnue. » → clic. « Sécurité : annuler la réservation d’un autre, jeton expiré, identifiant malformé. » → clic. « Le prompt : liste les cas, attends ma validation. Et le point d’interrogation est voulu : le changement d’heure n’est pas spécifié. Copilot ne doit pas inventer la règle : c’est une décision produit. »

TRANSITION — « La matrice validée devient des tests paramétrés. »`,
  `⏱ 4 min · TESTS UNITAIRES (démo, onglets)

OBJECTIF — Génération automatisée de tests unitaires (Jest, pytest, JUnit…).

DIRE — « Quatre frameworks, même idée : un comportement, une table de cas. Chaque ligne de la matrice devient une ligne de la table, avec en commentaire la règle qu’elle protège. En revue, on voit immédiatement les cas manquants. Le prompt à droite : /tests sur la sélection, la matrice comme source, des noms qui décrivent le comportement, aucune logique dans les tests — un if dans un test, c’est un test qui peut se tromper —, et on termine par l’exécution. »

ANIMATION — Cliquer l’onglet de chaque stack présente dans le groupe.

TRANSITION — « Le service, lui, a des dépendances. Il faut les isoler. »`,
  `⏱ 4 min · MOCKS ET STUBS (1 temps)

OBJECTIF — Génération de mocks et stubs pour isoler les dépendances.

DIRE — « On isole le service testé de ses frontières : le repository devient un stub qui renvoie des données fixées, l’horloge un fake réglé sur une date, le notifier un mock dont on vérifie l’appel. La distinction compte : le stub fournit un état, le mock vérifie une interaction. Vérifier l’état est plus robuste au refactoring de cet après-midi. Le piège typique de Copilot : configurer un retour sur le mock, puis vérifier ce même retour. Le test passe toujours. » → clic. « Le prompt : doubles des dépendances injectées, horloge fixe, et surtout ne rien doubler du domaine. »

TRANSITION — « Les tests unitaires isolent. Les tests d’intégration assemblent. »`,
  `⏱ 4 min · INTÉGRATION (4 temps)

OBJECTIF — Tests d’intégration : générer des scénarios bout en bout avec Copilot.

DIRE — « Un scénario qui se lit comme une histoire. Alice se connecte. » → clic. « Elle réserve la salle A de 9h à 10h : 201. » → clic. « Bob tente 9h30–10h30 : 409. » → clic. « Bob essaie d’annuler la réservation d’Alice : 403. C’est le test qui attrapera la faille du module 5. » → clic. « Bob cherche une salle libre de 9h à 10h : la salle A n’y est pas. Vraies routes, vrai middleware, vraie validation ; la persistance est en mémoire et réinitialisée à chaque test. À droite, l’outil par stack. Avec une vraie base, Testcontainers, en CI. »

TRANSITION — « Comment savoir si on a assez testé ? La couverture… avec prudence. »`,
  `⏱ 4 min · COUVERTURE ET MUTATION (2 temps)

OBJECTIF — Analyse de couverture de code et itération sur les tests générés.

DIRE — « La boucle : mesurer, cibler — donner le rapport à Copilot en précisant les branches —, générer. Mais regardez ce test : 100 % de couverture, zéro assertion. La couverture dit ce qui a été exécuté, pas vérifié. » → clic. « D’où l’étape 4 : la mutation. L’outil modifie votre code — un inférieur strict devient inférieur ou égal — et regarde si un test casse. Si aucun ne casse, vos tests ne protègent pas cette ligne. » → clic. « En équipe : un seuil de couverture comme garde-fou en CI, le score de mutation sur le domaine comme vraie mesure. »

TRANSITION — « Exercice : cinq défauts dans un test généré. »`,
  `⏱ 4 min · PIÈGES (exercice, 5 temps)

OBJECTIF — Savoir relire un test généré.

DIRE — « Ce test passe au vert. Trouvez cinq défauts, à voix haute. » Laisser chercher 1 minute. Puis → clic par défaut. « Un : nom vague. Deux : une vraie date, le test change de comportement selon l’heure — dans deux semaines il réservera un samedi et cassera. Trois : il vérifie un appel interne, pas le résultat. Quatre : toBeDefined, l’assertion la plus faible qui soit. Cinq, le plus grave : le test qui échouait a été désactivé, avec un commentaire rassurant. C’est un comportement réel des agents quand on leur demande que tout passe. »

TRANSITION — « Ce qui nous amène au QCM. »`,
  `⏱ 2 min · QCM 3

OBJECTIF — Ancrer le réflexe de relire le diff des tests.

DIRE — « Quand l’objectif est "tout au vert", modifier le test est un chemin valide pour l’agent. La règle d’équipe : le diff des tests se relit avant le diff du code. »

TRANSITION — « TP 3, puis déjeuner. »`,
  `⏱ 25 min (minuteur) · TP 3

OBJECTIF — Atelier du programme : à partir du module développé au module 2, générer une suite complète de tests unitaires, mocks et tests d’intégration.

DIRE — « D’abord la matrice : faites-la produire, complétez-la, tranchez les points d’interrogation. Ensuite les tests unitaires, puis les scénarios d’intégration — reprenez la colonne sécurité —, puis la couverture. Avant de dire "fini", relisez le diff des tests. Bonus : faites une mutation à la main dans overlaps et vérifiez qu’un test casse. »

ANIMATION — Minuteur. Repérer un test d’intégration 403 qui échoue : c’est normal si l’API n’a pas de contrôle de propriétaire, et c’est précieux pour le module 5. Le noter.

TRANSITION — « Bon appétit. Reprise à 13:30 avec un quiz flash. »`,
  `⏱ 8 min · QUIZ FLASH · 13:30

OBJECTIF — Réactiver la matinée et vérifier les acquis avant l’après-midi (évaluation continue).

DIRE — « Bon retour ! Cinq questions sur la matinée, à main levée. On clique la réponse majoritaire, et on discute quand le groupe se trompe. »

ANIMATION — Une question à la fois, bouton « Suivante ». Le compteur « du premier coup » donne un score collectif : l’annoncer. Si une question est majoritairement ratée, reprendre la page correspondante en deux minutes.

TRANSITION — « L’après-midi commence par ce que Copilot fait le moins bien seul : du code propre. Module 4. »`,
  `⏱ 1 min · DIVISEUR M4 · 13:40

OBJECTIF — Annoncer le module 4 du programme : optimisation et refactoring avancé.

DIRE — « Module 4. Copilot produit du code qui marche ; il ne produit pas spontanément du code qui dure. On va identifier les anti-patterns du code généré, refactorer avec SOLID, optimiser les performances en mesurant, moderniser du legacy, et apprendre à comparer plusieurs implémentations. TP 4 : un refactoring en profondeur de votre code du matin. »

TRANSITION — « Commençons par un exercice d’œil. »`,
  `⏱ 5 min · ANTI-PATTERNS (exercice, 6 temps)

OBJECTIF — Identifier les anti-patterns dans le code généré par Copilot.

DIRE — « Cette fonction a été générée en un prompt. Elle fonctionne. Trouvez six défauts. » Laisser chercher une minute, puis → clic par défaut. « Un : any, plus aucun contrat. Deux : 8 et 19 en dur, et le fuseau ignoré. Trois : une requête par salle, et toutes les réservations à chaque tour. Quatre : des erreurs en chaîne de caractères, la route ne peut pas répondre 409 proprement. Cinq : une exception avalée et un new caché, impossible à tester. Six : la fonction fait quatre choses. Le chiffre en haut : le rapport GitClear 2025 observe que 2024 est la première année où les lignes copiées-collées dépassent les lignes déplacées par refactoring. L’IA duplique plus qu’elle ne factorise. »

TRANSITION — « Comment corriger ? Un principe à la fois. »`,
  `⏱ 4 min · SOLID (4 temps)

OBJECTIF — Refactoring avancé : restructuration, découplage, SOLID.

DIRE — « Demander "applique SOLID", c’est obtenir un diff de quinze fichiers impossible à relire. Pour chaque principe : le symptôme dans le code généré, et le prompt ciblé. Responsabilité unique : on extrait, book() orchestre. » → clic. « Ouvert-fermé : le switch recopié devient une stratégie. » → clic. « Liskov : l’implémentation qui lève "non implémenté" ; un test de contrat commun le révèle. » → clic. « Ségrégation : l’interface à quatorze méthodes. » → clic. « Inversion : le new SmtpMailer devient un port injecté. Et la règle du bas : pendant un refactoring, aucun fichier de test ne bouge. »

TRANSITION — « Le défaut numéro trois, c’était la performance. »`,
  `⏱ 4 min · PERFORMANCE (2 temps)

OBJECTIF — Optimisation des performances : génération d’algorithmes efficaces.

DIRE — « Copilot écrit l’algorithme le plus évident. Il sait faire mieux si on lui donne la mesure et la cible : le profil, la complexité visée, la contrainte de signature, les tests inchangés, et un benchmark reproductible. Le code du TP 2 : près de deux secondes. » → clic. « Index par salle et tri : quelques millisecondes. » → clic. « Une requête bornée avec index côté base : encore mieux, mais il faut alors des tests d’intégration. Les chiffres sont des ordres de grandeur : vous mesurerez les vôtres. Et lisibilité contre performance, c’est un choix, pas un réflexe. »

TRANSITION — « Optimiser du code neuf, c’est facile. Moderniser du vieux code, beaucoup moins. »`,
  `⏱ 4 min · LEGACY (4 temps)

OBJECTIF — Utiliser Copilot pour moderniser du code legacy.

DIRE — « Copilot est excellent pour expliquer du code ancien : /explain, diagramme de séquence, glossaire. Première étape, on ne touche à rien. » → clic. « Deux : on fige le comportement avec des tests de caractérisation — Copilot les génère très bien —, bugs compris. » → clic. « Trois : le figuier étrangleur, le nouveau module derrière la même interface. » → clic. « Quatre : un changement par PR. » → clic. « Cinq : bascule mesurée, puis suppression. Le piège : "corrige les bugs au passage". Une modernisation qui change le comportement n’est plus vérifiable. »

TRANSITION — « Dernier outil : quand Copilot propose plusieurs solutions, comment choisir ? »`,
  `⏱ 4 min · COMPARER LES IMPLÉMENTATIONS (démo interactive)

OBJECTIF — Comparer les implémentations générées et choisir la meilleure approche.

DIRE — « On demande trois versions aux compromis différents, et surtout on interdit au modèle de choisir : il présente un tableau. Ensuite, on décide avec nos critères. Avec des poids égaux, la requête SQL l’emporte. » Pousser Testabilité à 5, Performance à 1. « Si votre équipe n’a pas de base en test, les boucles simples gagnent. » Pousser Performance à 5. « Si la recherche est critique, l’index. Le choix dépend du contexte : c’est votre travail, pas celui de Copilot. »

ANIMATION — Faire proposer les poids par le groupe.

TRANSITION — « QCM. »`,
  `⏱ 2 min · QCM 4

OBJECTIF — Ancrer la discipline du refactoring par petits pas.

DIRE — « Le réflexe : un diff que vous ne pouvez pas relire se rejette. Les tests modifiés dans le même diff ne prouvent plus rien. »

TRANSITION — « TP 4. »`,
  `⏱ 25 min (minuteur) · TP 4

OBJECTIF — Atelier du programme : refactoring en profondeur, optimiser le code généré le matin en appliquant SOLID et les patterns vus.

DIRE — « D’abord un diagnostic en mode Ask : un rapport, aucune modification. Priorisez trois refactorings. Puis un prompt, un commit, à chaque fois tests au vert et aucun fichier de test touché. Enfin la recherche de salles, benchmark avant et après. Bonus : ajouter un type de salle sans modifier une classe existante, c’est le test de l’ouvert-fermé. »

ANIMATION — Minuteur. Vérifier les historiques git : un commit par refactoring.

TRANSITION — « Votre code est propre. Est-il sûr ? Module 5. »`,
  `⏱ 1 min · DIVISEUR M5 · 14:30

OBJECTIF — Annoncer le module 5 du programme : sécurité et audit du code généré.

DIRE — « Module 5. Votre code est testé et propre. Est-il sûr ? On va voir les risques spécifiques au code généré, la checklist OWASP appliquée à Copilot, comment détecter les vulnérabilités dans une suggestion, comment écrire des prompts orientés sécurité, et la question des droits d’auteur et des licences. TP 5 : vous auditez votre propre code. »

TRANSITION — « D’abord, l’ampleur du problème. »`,
  `⏱ 4 min · RISQUES

OBJECTIF — Risques spécifiques au code généré par IA : injection, exposition de données, dépendances vulnérables.

DIRE — « Veracode a confié des tâches de code à plus de cent modèles en 2025 : dans 45 % des cas, le code contenait une faille du Top 10 OWASP. Et le constat clé : les modèles récents écrivent du code plus correct, pas plus sûr. Six familles de risques : l’injection, l’exposition de données, le contrôle d’accès oublié — l’identité est vérifiée, la propriété jamais —, les secrets en dur, les dépendances, et un risque propre aux agents : l’injection de prompt indirecte. Une issue ou un README contient des instructions cachées que l’agent lit… et exécute. D’où : approbation des commandes, droits minimaux, pas d’auto-approbation. »

TRANSITION — « Exercice : six failles dans une suggestion. »`,
  `⏱ 5 min · DÉTECTER (exercice, 6 temps)

OBJECTIF — Détecter les vulnérabilités dans le code suggéré.

DIRE — « Cette fois en Python, mais les failles sont les mêmes dans toutes les stacks. Cherchez. » Une minute, puis → clic par faille. « Un : secret en dur. Deux : signature non vérifiée, n’importe qui forge un jeton admin — on le voit réellement dans des suggestions, souvent pour "faire marcher" un test. Trois : injection SQL par f-string. Quatre : SELECT étoile renvoyé tel quel, les e-mails de tout le monde. Cinq : l’IDOR, Bob annule la réservation d’Alice — c’est le test d’intégration 403 du TP 3. Six : la trace d’erreur renvoyée au client. »

TRANSITION — « Pour ne rien oublier, une grille. »`,
  `⏱ 4 min · OWASP (checklist interactive)

OBJECTIF — Checklist de sécurité : OWASP et bonnes pratiques appliquées à Copilot.

DIRE — « L’OWASP Top 10 dans sa version 2025, avec pour chaque catégorie ce que le code généré oublie le plus souvent. Nouveautés 2025 à noter : la chaîne d’approvisionnement logicielle monte en troisième position — c’est notre slopsquatting — et une catégorie dédiée aux conditions exceptionnelles mal gérées. Cochez ce que votre revue de code vérifie déjà aujourd’hui. »

ANIMATION — Faire cocher par un volontaire pour son équipe. Commenter le score.

TRANSITION — « Comment obtenir du code sûr dès la génération ? »`,
  `⏱ 4 min · PROMPTS SÉCURITÉ (2 temps)

OBJECTIF — Utiliser Copilot pour générer du code sécurisé : prompts orientés sécurité.

DIRE — « Le levier permanent : un fichier d’instructions par chemin, chargé automatiquement dès qu’on touche à l’API ou aux services. Six règles, chacune répond à une faille de l’exercice. À droite, trois réflexes de prompt : nommer les menaces dans la demande. » → clic. « Prouver par un test d’exploitation, qui échoue avant le correctif. » → clic. « Et relire en attaquant : Copilot est étonnamment bon pour attaquer son propre code quand on lui donne ce rôle. »

TRANSITION — « Mais un modèle n’offre aucune garantie. Les outils, si. »`,
  `⏱ 3 min · OUTILLAGE (3 temps)

OBJECTIF — Compléter Copilot par des outils déterministes.

DIRE — « Quatre points de contrôle. Dans l’éditeur, linters et analyse statique. » → clic. « Avant le push, la détection de secrets. » → clic. « En pull request, CodeQL et Copilot Autofix, Dependabot et la revue des dépendances. » → clic. « En CI, l’audit des dépendances de votre stack. Copilot Autofix propose des correctifs pour les alertes CodeQL : excellent, mais ça reste du code généré. »

TRANSITION — « Dernier sujet du module, et pas le moindre : le droit. »`,
  `⏱ 3 min · DROITS ET LICENCES

OBJECTIF — Droits d’auteur, licences et conformité du code généré en contexte professionnel.

DIRE — « Quatre points. Le filtre de code public : bloquer les suggestions qui correspondent à du code public, ou les autoriser avec référencement, qui affiche le dépôt et la licence d’origine. Les licences : une suggestion proche d’un code copyleft peut imposer ses conditions. La confidentialité : en Business et Enterprise, vos données ne servent pas à l’entraînement, et l’exclusion de contenu protège les fichiers sensibles. La responsabilité : l’engagement d’indemnisation de GitHub suppose le filtre activé, et dans tous les cas, c’est vous qui commitez. Ces réglages sont décidés par les admins : vérifiez ceux de votre organisation. »

TRANSITION — « QCM. »`,
  `⏱ 2 min · QCM 5

OBJECTIF — Ancrer la vérification des correctifs générés.

DIRE — « Le piège D est le plus dangereux : une alerte fermée à tort n’est plus jamais regardée. »

TRANSITION — « TP 5 : auditez votre code. »`,
  `⏱ 25 min (minuteur) · TP 5

OBJECTIF — Atelier du programme : analyser un code généré par Copilot, identifier les failles et les corriger avec des prompts ciblés.

DIRE — « Vous auditez votre propre API, celle générée ce matin. Prompt d’audit en rôle d’attaquant, avec la grille OWASP. Classez. Puis pour chaque faille : un test qui l’exploite, rouge ; un prompt ciblé ; vert. Et rendez les règles permanentes avec le fichier d’instructions de sécurité. Si votre API semble propre, testez le DELETE d’autrui : c’est la faille la plus fréquente. »

ANIMATION — Minuteur. Collecter au tableau les failles trouvées par les binômes : en général IDOR, surexposition, secret, absence de limite de débit.

TRANSITION — « Pause de 15 minutes. Ensuite : comment faire tout ça en équipe. »`,
  `⏱ 1 min · DIVISEUR M6 · 15:40

OBJECTIF — Annoncer le module 6 du programme : bonnes pratiques d’intégration en équipe.

DIRE — « Dernier module. Tout ce que vous avez fait aujourd’hui, vous l’avez fait seul ou en binôme. Comment en faire une pratique d’équipe ? Conventions d’usage, prompts et templates partagés dans le dépôt, Copilot dans les pull requests et la revue de code, dans la CI/CD, la mesure de la productivité et de la qualité, et une charte d’utilisation responsable. Puis le projet de clôture. »

TRANSITION — « Premier chantier : les conventions. »`,
  `⏱ 3 min · CONVENTIONS

OBJECTIF — Définir des conventions d’usage de Copilot au sein d’une équipe.

DIRE — « Six questions à trancher une fois, par écrit. Quels modes où : l’agent est-il autorisé partout, ou pas sur le code de paiement ? Quels modèles, avec quel budget ? Quelles données ne partent jamais ? Quelle revue : qui approuve une PR créée par un agent ? Quelle traçabilité ? Et quelle preuve : des tests obligatoires pour tout code généré. Les réponses vont dans le dépôt, pas dans un wiki que personne ne lit : CONTRIBUTING et les instructions Copilot. »

TRANSITION — « Le dépôt est aussi l’endroit où partager ce qui marche. »`,
  `⏱ 4 min · PROMPTS PARTAGÉS (1 temps)

OBJECTIF — Partager des prompts et templates efficaces via le dépôt de projet.

DIRE — « Le dossier .github devient la boîte à outils de l’équipe. Les instructions globales, les instructions par chemin — dont celle de sécurité du TP 5 —, les fichiers de prompt — dont celui du TP 1 —, et des agents personnalisés, comme un relecteur. À droite, un fichier de prompt : une description, l’agent à utiliser, une variable de saisie, et la méthode de la journée en trois étapes. » → clic. « Dans le chat, on tape /new-endpoint : toute la méthode en une commande. Et un prompt partagé se relit en PR comme du code. »

ANIMATION — Les noms de champs de l’en-tête évoluent selon les versions de VS Code : vérifier la documentation.

TRANSITION — « Ce code finit en pull request. »`,
  `⏱ 4 min · PULL REQUEST (5 temps)

OBJECTIF — Intégrer Copilot dans un workflow de pull request et de revue de code.

DIRE — « Tout part d’une issue avec des critères d’acceptation : c’est le meilleur prompt qui soit. » → clic. « L’agent travaille, en local ou parce que l’issue est assignée à Copilot, qui ouvre lui-même une PR. » → clic. « La description de PR est générée, puis relue et complétée. » → clic. « La CI prouve. » → clic. « Copilot fait une première revue. » → clic. « Un humain décide. Trois règles : la PR d’un agent est approuvée par quelqu’un d’autre que celui qui l’a demandée ; la revue Copilot lit vos instructions, mettez-y vos points de contrôle ; et au-delà de 400 lignes, la revue humaine décroche. »

TRANSITION — « La CI, justement : Copilot sait l’écrire. »`,
  `⏱ 3 min · CI/CD (4 temps)

OBJECTIF — Copilot et CI/CD : automatiser la génération de scripts et de pipelines.

DIRE — « Copilot écrit du YAML impeccable en apparence. Quatre vérifications. Les permissions : lecture seule par défaut. » → clic. « Les actions épinglées par SHA, avec une version vérifiée : le modèle propose celles de sa date d’entraînement. » → clic. « Une installation reproductible. » → clic. « Des portes de qualité bloquantes. La même démarche vaut pour GitLab, Azure Pipelines, Jenkins, et pour les Dockerfile ou scripts de migration. »

TRANSITION — « Tout ça a un coût. Est-ce que ça rapporte ? »`,
  `⏱ 4 min · MESURER (1 temps)

OBJECTIF — Évaluer la productivité et la qualité avec et sans Copilot.

DIRE — « Deux études sérieuses. GitHub, 2022 : 55 % plus rapide sur une tâche isolée, écrire un serveur HTTP. METR, 2025 : seize développeurs expérimentés, sur leurs propres dépôts, 19 % plus lents avec l’IA… alors qu’ils estimaient être 20 % plus rapides. Les deux sont vraies : tout dépend de la tâche, du contexte, de la maturité. La leçon : le ressenti n’est pas une mesure. » → clic. « Le protocole : métriques fixées avant, tâches comparables, plusieurs semaines. À droite, quoi mesurer : le flux, la qualité, l’expérience — et l’usage, en sachant que le taux d’acceptation dit qu’on utilise l’outil, pas qu’il crée de la valeur. »

TRANSITION — « Dernière brique : la charte. »`,
  `⏱ 4 min · CHARTE (atelier)

OBJECTIF — Construire une charte d’utilisation responsable de l’IA en développement.

DIRE — « Huit engagements, qui reprennent la journée : responsabilité, données, relecture, dépendances, licences, agents, partage, mesure. Cochez ce que votre équipe applique réellement aujourd’hui. Ce qui n’est pas coché alimente votre plan d’action. »

ANIMATION — Faire cocher par un volontaire. Demander quel engagement manque le plus dans les équipes présentes.

TRANSITION — « QCM, puis le projet de clôture. »`,
  `⏱ 2 min · QCM 6

OBJECTIF — Savoir lire un indicateur d’usage.

DIRE — « Le taux d’acceptation est l’indicateur le plus visible du tableau de bord Copilot, et le plus mal interprété. »

TRANSITION — « Projet de clôture. »`,
  `⏱ 25 min (minuteur) + soutenances · TP 6

OBJECTIF — Projet de clôture du programme : présenter et défendre une feature complète (code, tests, documentation, sécurité) développée entièrement avec Copilot.

DIRE — « Une feature au choix. Appliquez tout : le plan, le prompt d’équipe, la matrice de cas, les tests, la revue de sécurité, la PR décrite, la CI. À 16:30, chaque binôme a quatre minutes : la démo, une preuve par critère, et un moment où vous avez refusé une proposition de Copilot — et pourquoi. »

ANIMATION — Minuteur. À 15 minutes, rappeler que la soutenance compte plus que l’exhaustivité : mieux vaut une feature réduite et prouvée.

TRANSITION — « Place aux soutenances. »`,
  `⏱ 25 min · SOUTENANCES · 16:30

OBJECTIF — Projet de clôture du programme : présenter et défendre la feature ; évaluation par le formateur des compétences acquises.

DIRE — « Quatre minutes par binôme : une minute de démo, deux minutes de preuves, une minute sur une proposition de Copilot que vous avez refusée. Le groupe évalue avec la grille : les tests et la sécurité comptent double. On ne juge pas la taille de la feature, mais la qualité des preuves. »

ANIMATION — Relancer le minuteur pour chaque binôme. Décocher la grille entre deux binômes. Une question du groupe par binôme, maximum. Noter les compétences observées pour l’évaluation formateur.

TRANSITION — « Bravo à tous. Rassemblons la journée. »`,
  `⏱ 3 min · SIX IDÉES À GARDER

OBJECTIF — Synthèse : une idée par module.

DIRE — « Le contexte : ce que Copilot voit, c’est vous qui le choisissez. L’architecture : plan et interfaces d’abord, génération par lots, à l’image de l’existant. Les tests : la matrice avant /tests, et le diff des tests relu en premier. Le refactoring : un principe par prompt, tests intouchés. La sécurité : nommer, prouver, outiller. L’équipe : ce qui marche se partage dans le dépôt, et la valeur se mesure. Et si une seule phrase : Copilot propose, vous prouvez. »

TRANSITION — « Mesurons le chemin parcouru. »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT FINAL

OBJECTIF — Auto-positionnement de fin de formation, à comparer avec celui du matin.

DIRE — « Exactement les mêmes affirmations que ce matin. Cochez honnêtement, puis comparez avec votre score de départ. Ce qui reste décoché devient la première ligne de votre plan d’action. »

ANIMATION — Demander à quelques volontaires leur progression. Noter le score moyen pour le bilan de session.

TRANSITION — « Justement : votre plan d’action. »`,
  `⏱ 4 min · PLAN D’ACTION

OBJECTIF — Ancrer la mise en application au quotidien.

DIRE — « Trois horizons. Demain, sur votre poste : une action de moins d’une heure, comme écrire les instructions Copilot de votre projet. Dans trente jours, avec votre équipe : partager trois prompts, instaurer la relecture des tests en premier, mesurer une base. Dans quatre-vingt-dix jours, pour l’organisation : la charte, les analyses bloquantes en CI, un bilan chiffré. Une action par horizon, écrite sur votre fiche. Le questionnaire à froid vous demandera ce que vous en avez fait. »

TRANSITION — « Les ressources pour continuer, et l’évaluation. »`,
  `⏱ 3 min · RESSOURCES ET ÉVALUATION

OBJECTIF — Fournir les ressources documentaires et lancer l’évaluation à chaud.

DIRE — « Copilot évolue chaque mois : les noms de modes, de fichiers et de variables bougent. Ces sources font foi. La collection awesome-copilot maintenue par GitHub est une mine d’instructions et de prompts à adapter. Pour l’évaluation : questionnaire à chaud maintenant, l’évaluation de vos compétences par le formateur sur les TP et la soutenance, et un questionnaire à froid dans quelques semaines. »

ANIMATION — Laisser cinq minutes pour le questionnaire à chaud.

TRANSITION — « Merci à toutes et à tous. »`,
  `⏱ 1 min · MERCI · 17:00

DIRE — « Merci pour votre énergie et vos questions. Une seule chose à retenir : Copilot propose, le développeur dispose… et prouve. Bonne continuation ! »`,
];
