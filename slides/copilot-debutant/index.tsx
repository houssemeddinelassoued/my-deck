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
import labsPack from './assets/labs-copilot-debutant.zip?url';

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
const FONT_LINK_ID = 'osd-webfont-copilot-debutant';
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
const SLIDE_ID = 'copilot-debutant';
const P = 'cpd'; // CSS class prefix, unique per deck
const COURSE = 'GitHub Copilot · Débutant';
const AUTHOR = 'Houssem Eddine LASSOUED';
const PROJECT = 'TaskFlow';

// Module numbers: 0 = ouverture, 1–4 = Jour 1, 10 = reprise Jour 2, 5–8 = Jour 2, 9 = clôture.
const MOD_TITLES: Record<number, string> = {
  1: 'Introduction à GitHub Copilot',
  2: 'Installation & configuration',
  3: 'Comprendre les suggestions',
  4: 'Génération de code simple',
  5: 'Fonctions & blocs de code',
  6: 'Refactoring avec Copilot',
  7: 'Tests unitaires avec Copilot',
  8: 'Bonnes pratiques & vérification',
  9: 'Synthèse & clôture',
  10: 'Jour 2 · Reprise',
  11: 'Les agents dans Copilot',
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
  lab: { label: 'Atelier individuel', tone: 'green' as Tone, icon: 'code' as IconName },
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
  const order = [0, 1, 2, 3, 4, 10, 5, 6, 7, 8, 11, 9];
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
    <ProgLabel>JOUR 1</ProgLabel>
    <ProgSq n={1} mod={mod} />
    <ProgSq n={2} mod={mod} />
    <ProgSq n={3} mod={mod} />
    <ProgSq n={4} mod={mod} />
    <ProgLabel>JOUR 2</ProgLabel>
    <ProgSq n={5} mod={mod} />
    <ProgSq n={6} mod={mod} />
    <ProgSq n={7} mod={mod} />
    <ProgSq n={8} mod={mod} />
    <ProgSq n={11} mod={mod} text="M9" />
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
          (mod >= 1 && mod <= 8
            ? `Module ${mod} · ${MOD_TITLES[mod]}`
            : mod === 11
            ? `Module 9 · ${MOD_TITLES[11]}`
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
                  <Num n={1} tone="violet" size={36} /> Votez à voix haute (ou dans le clavardage).
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
  num: numIn,
  title,
  sub,
  dur,
  kind,
  labs,
  children,
}: {
  n: number;
  num?: number;
  title: ReactNode;
  sub: ReactNode;
  dur: string;
  kind?: Kind;
  labs?: ReactNode;
  children: ReactNode;
}) => {
  const num = numIn ?? n;
  return (
  <Frame mod={n} chrome={false}>
    <Slab x={-60} y={-60} w={700} h={1200} r={56} cls={A.left}>
      <div style={{ position: 'absolute', left: 150, top: 240 }}>
        <div className={A.in} style={{ fontFamily: display, fontWeight: 700, fontSize: 26, letterSpacing: '0.24em', color: '#AEB9E6', ...dl(300) }}>
          {num <= 4 ? 'MODULE · JOUR 1' : 'MODULE · JOUR 2'}
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
          {pad(num)}
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
            Atelier individuel
          </Eyebrow>
          {labs}
        </div>
      ) : null}
    </div>
    <Footer left={760} short />
  </Frame>
);
};

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
  explorer: { label: 'Exploration guidée', icon: 'search' as IconName, tone: 'blue' as Tone, aide: 'Observez avant d’agir : chaque question a une réponse vérifiable dans le dépôt.' },
  config: { label: 'Configuration', icon: 'gear' as IconName, tone: 'navy' as Tone, aide: 'Chaque réglage se vérifie : un paramètre, un effet visible.' },
  raccourcis: { label: 'Parcours clavier', icon: 'pointer' as IconName, tone: 'teal' as Tone, aide: 'Sans la souris : chaque geste a son raccourci, répétez-le jusqu’au réflexe.' },
  contexte: { label: 'Expérience de contexte', icon: 'eye' as IconName, tone: 'violet' as Tone, aide: 'Même demande, contexte différent : notez ce qui change dans la suggestion.' },
  commentaire: { label: 'Commentaire guide', icon: 'note' as IconName, tone: 'blue' as Tone, aide: 'Le commentaire est votre prompt : précis, testable, avec un exemple.' },
  generer: { label: 'Génération guidée', icon: 'layers' as IconName, tone: 'green' as Tone, aide: 'Signature d’abord, génération ensuite, test immédiat : rien n’est accepté sans preuve.' },
  refacto: { label: 'Refactoring', icon: 'wand' as IconName, tone: 'violet' as Tone, aide: 'Tests au vert avant et après chaque étape : le comportement ne bouge pas.' },
  tests: { label: 'Suite de tests', icon: 'flask' as IconName, tone: 'pink' as Tone, aide: 'Liste des cas d’abord, génération ensuite, mutation pour finir.' },
  revue: { label: 'Revue de code', icon: 'shieldCheck' as IconName, tone: 'coral' as Tone, aide: 'Trouvez, prouvez, corrigez : chaque défaut reçoit un test qui l’empêche de revenir.' },
  agents: { label: 'Équipe d’agents', icon: 'users' as IconName, tone: 'violet' as Tone, aide: 'Vous cadrez, ils exécutent : chaque relais se relit, chaque résultat se prouve par un test.' },
  livrer: { label: 'Livraison', icon: 'flag' as IconName, tone: 'navy' as Tone, aide: 'Une fonctionnalité complète : code, documentation, tests, revue, commit.' },
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
  suivi,
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
  suivi?: ReactNode;
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
      {suivi ? (
        <div className={A.fade} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: T.teal.bg, borderRadius: 12, padding: '12px 18px', fontSize: 21, lineHeight: 1.4, color: C.ink, ...dl(500) }}>
          <Icon name="clock" size={24} color={T.teal.fg} style={{ marginTop: 2 }} />
          <span>{suivi}</span>
        </div>
      ) : null}
    </div>
    <div style={{ position: 'absolute', left: 1170, top: 240, width: 630, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className={A.right} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 24px', ...dl(100) }}>
        <PanelTitle icon="doc">{whereTitle}</PanelTitle>
        <div style={{ fontSize: 22, lineHeight: 1.5, color: C.soft }}>{where}</div>
      </div>
      <Timer id={`at-${n}`} minutes={minutes} label={`Atelier ${n}`} compact cls={A.right} style={dl(200)} />
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
      <Icon name="code" size={20} color={C.electric} /> Fil rouge <strong style={{ color: C.navy }}>{PROJECT}</strong> · dépôt <span style={{ fontFamily: mono, color: C.electric }}>taskflow-copilot</span> · JavaScript (Node 22) · variantes Python / Java
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
            <span style={{ color: C.muted }}>Votez à voix haute (A, B, C…), puis je clique la réponse.</span>
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

// Shared page helpers (used across parts) ─────────────────────────────────────
const BreakPage = ({ mod, title, back, minutes, icon = 'clock' }: { mod: number; title: string; back: string; minutes: number; icon?: IconName }) => (
  <Frame mod={mod}>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1000 }}>
      <div className={A.in}>
        <IconTile name={icon} tone="yellow" size={96} solid />
      </div>
      <h2 className={A.in} style={{ margin: '40px 0 0', fontFamily: display, fontWeight: 800, fontSize: 96, lineHeight: 1.05, color: C.navy, ...dl(120) }}>
        {title}
      </h2>
      <p className={A.in} style={{ margin: '26px 0 0', fontSize: 34, lineHeight: 1.4, color: C.soft, ...dl(240) }}>
        {back}
      </p>
      <div className={A.fade} style={{ marginTop: 40, display: 'flex', gap: 14, ...dl(500) }}>
        <Tag tone="teal" size={22}>
          <Icon name="eyeOff" size={22} /> Loin de l’écran
        </Tag>
        <Tag tone="grey" size={22}>
          <Icon name="user" size={22} /> Caméra coupée si vous voulez
        </Tag>
      </div>
    </div>
    <Timer id={`pause-${mod}-${minutes}-${title}`} minutes={minutes} label={title} cls={A.right} style={{ position: 'absolute', left: 1240, top: 300, width: 560, ...dl(300) }} />
  </Frame>
);

// Two-line "what you see / what it means" row used by several modules.
const Row2 = ({ icon, tone, title, children, d = 0, cls }: { icon: IconName; tone: Tone; title: ReactNode; children: ReactNode; d?: number; cls?: string }) => (
  <div className={cls ?? A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 18, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={54} />
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{title}</div>
      <div style={{ fontSize: 22, color: C.soft, lineHeight: 1.4, marginTop: 2 }}>{children}</div>
    </div>
  </div>
);

// Inline code chip (light).
const Ic = ({ children }: { children: ReactNode }) => (
  <code style={{ fontFamily: mono, fontSize: '0.86em', color: C.electric, background: T.blue.bg, borderRadius: 6, padding: '1px 7px' }}>{children}</code>
);

// Quoted prompt.
const Pr = ({ children }: { children: ReactNode }) => (
  <span style={{ fontStyle: 'italic', color: C.navy, background: T.violet.bg, borderRadius: 6, padding: '1px 8px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>{children}</span>
);

// Numbered step line used in lab "Le défi" panels.
const WStep = ({ n, children }: { n: number; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
    <Num n={n} tone="green" size={34} style={{ marginTop: 2 }} />
    <div style={{ fontSize: 22, lineHeight: 1.42, color: C.soft }}>{children}</div>
  </div>
);

// ─── Couverture ─────────────────────────────────────────────────────────────
const O_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={170} r={46} cls={A.fade} />
    <Outline x={-40} y={760} w={120} h={360} r={40} color="#AEB9E6" />
    <div style={{ position: 'absolute', left: 390, top: 140, width: 1420 }}>
      <div className={A.in} style={{ display: 'flex', gap: 12 }}>
        <Tag tone="violet" size={22}>
          <Icon name="calendar" size={22} /> Formation · 2 jours · 14 h
        </Tag>
        <Tag tone="blue" size={22}>
          <Icon name="sparkles" size={22} /> Débutant
        </Tag>
        <Tag tone="teal" size={22}>
          <Icon name="globe" size={22} /> Classe virtuelle
        </Tag>
      </div>
      <h1 className={A.in} style={{ margin: '34px 0 0', fontFamily: display, fontWeight: 800, fontSize: 104, lineHeight: 1.04, letterSpacing: '-0.02em', color: C.navy, ...dl(120) }}>
        GitHub Copilot
        <br />
        <span style={{ color: C.electric }}>premiers pas maîtrisés</span>
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 30, lineHeight: 1.45, color: C.soft, maxWidth: 1060, ...dl(240) }}>
        Installer, comprendre, générer, refactorer, tester… et surtout <strong style={{ color: C.navy }}>vérifier</strong> :
        intégrer Copilot à votre quotidien de développeur, en autonomie.
      </p>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 1360, top: 600, ...dl(900) }}>
      <div style={{ transform: 'rotate(-7deg)', fontFamily: '"Mr Dafoe", "Segoe Script", cursive', fontSize: 78, color: C.electric, lineHeight: 1 }}>Together we grow</div>
    </div>
    <Portrait w={170} x={390} y={660} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 684, ...dl(300) }}>
      <Eyebrow c={C.muted} size={20}>
        Formateur
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>Docaposte Institute · IA appliquée au développement</div>
    </div>
    <div className={A.pop} style={{ position: 'absolute', left: 1500, top: 790, ...dl(600) }}>
      <DapLogo size={40} />
    </div>
    <Footer left={390} />
  </Frame>
);
O_Cover.transition = BLOOM;

// ─── Formateur ──────────────────────────────────────────────────────────────
const OStatCard = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <Card icon={icon} tone={tone} title={title} size={22} pad={24} cls={A.in} style={dl(d)}>
    {children}
  </Card>
);

const O_Formateur: Page = () => (
  <Frame mod={0}>
    <Title>Votre formateur</Title>
    <Portrait w={250} x={130} y={250} cls={A.in} />
    <div style={{ position: 'absolute', left: 490, top: 240, width: 1310, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className={A.in} style={{ fontFamily: display, fontWeight: 800, fontSize: 42, color: C.navy }}>
        {AUTHOR}
      </div>
      <Bullet size={27} cls={A.left} style={dl(120)}>
        Expert IA &amp; ingénierie logicielle · Ingénieur IT et doctorant en intelligence artificielle
      </Bullet>
      <Bullet size={27} cls={A.left} style={dl(200)}>
        Développeur senior depuis 18 ans (Java, Python, Web) &amp; CEO de National Quantum
      </Bullet>
      <Bullet size={27} cls={A.left} style={dl(280)}>
        Chercheur, enseignant universitaire et consultant en transformation numérique
      </Bullet>
      <Bullet size={27} cls={A.left} style={dl(360)}>
        Formateur professionnel depuis 8 ans auprès de grandes entreprises et d’équipes métiers
      </Bullet>
    </div>
    <div style={{ position: 'absolute', left: 490, top: 660, width: 1310, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 26 }}>
      <OStatCard icon="star" tone="blue" title="250+ sessions" d={500}>
        Formations animées en ingénierie logicielle et IA générative
      </OStatCard>
      <OStatCard icon="globe" tone="violet" title="60+ entreprises" d={600}>
        Accompagnées dans l’adoption concrète des outils IA
      </OStatCard>
      <OStatCard icon="users" tone="green" title="3 000+ apprenants" d={700}>
        Développeurs, profils techniques et débutants complets
      </OStatCard>
    </div>
  </Frame>
);

// ─── Classe virtuelle ───────────────────────────────────────────────────────
const O_Virtuel: Page = () => (
  <Frame mod={0}>
    <Title>Classe virtuelle : nos règles de confort</Title>
    <Lede>Chacun sur son poste : je partage mon écran pour les démos, vous codez sur le vôtre, avec votre propre Copilot.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24 }}>
      <Card title="Caméra & micro" icon="user" tone="blue" size={23} pad={24} cls={A.in} style={dl(100)}>
        Caméra allumée si possible ; micro coupé hors prise de parole, ouvert dès que vous votez, répondez ou posez une question.
      </Card>
      <Card title="Deux écrans, idéalement" icon="code" tone="violet" size={23} pad={24} cls={A.in} style={dl(200)}>
        La classe virtuelle d’un côté, VS Code de l’autre. Un seul écran ? Scindez-le en deux, VS Code en grand.
      </Card>
      <Card title="Ateliers 100 % individuels" icon="target" tone="green" size={23} pad={24} cls={A.in} style={dl(300)}>
        Minuteur affiché, point d’étape oral toutes les 15 à 20 minutes. Bloqué ? Partage d’écran de 2 minutes.
      </Card>
      <Card title="Zéro donnée réelle" icon="shield" tone="coral" size={23} pad={24} cls={A.in} style={dl(400)}>
        Ni code client, ni secret, ni donnée personnelle dans un prompt : le projet TaskFlow est fictif, exprès.
      </Card>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 790, width: 1680 }}>
      <Callout tone="teal" icon="clock" title="Rythme & vraies pauses" size={25} cls={A.in} style={dl(550)}>
        9 h 00 – 12 h 30 et 14 h 00 – 17 h 30, deux pauses de 15 minutes par jour, loin de l’écran. Le texte à copier arrive dans le clavardage.
      </Callout>
    </div>
  </Frame>
);

// ─── Tour de table ──────────────────────────────────────────────────────────
const O_Poll: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Tour de table &amp; point de départ</Title>
    <Lede>Dites-moi à voix haute le numéro qui vous correspond : je compte les voix à l’écran.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 1040 }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Mon expérience de Copilot aujourd’hui
      </Eyebrow>
      <Poll>
        <PollRow id="o-p1" tone="grey" icon="eyeOff" label="1 · Jamais utilisé, je découvre" />
        <PollRow id="o-p2" tone="blue" icon="eye" label="2 · Vu en démo, jamais sur mon poste" />
        <PollRow id="o-p3" tone="teal" icon="code" label="3 · Quelques suggestions acceptées avec Tab" />
        <PollRow id="o-p4" tone="violet" icon="chat" label="4 · J’utilise déjà le chat de temps en temps" />
      </Poll>
      <Eyebrow c={C.navy} style={{ margin: '26px 0 14px' }}>
        Mon langage principal
      </Eyebrow>
      <Poll>
        <PollRow id="o-l1" tone="yellow" icon="code" label="5 · JavaScript / TypeScript" />
        <PollRow id="o-l2" tone="green" icon="code" label="6 · Python" />
        <PollRow id="o-l3" tone="coral" icon="code" label="7 · Java, C# ou autre" />
      </Poll>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1230, top: 260, width: 570, ...dl(250) }}>
      <Card title="Tour de table express (1 min)" icon="chat" tone="navy" size={23} pad={26}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <Strong>1.</Strong> Votre prénom et votre métier
          </div>
          <div>
            <Strong>2.</Strong> Votre langage du quotidien
          </div>
          <div>
            <Strong>3.</Strong> La tâche de code que vous aimeriez déléguer dès lundi
          </div>
        </div>
      </Card>
      <Hint style={{ marginTop: 22 }}>Ordre de la liste des participants, micro ouvert.</Hint>
    </div>
  </Frame>
);

// ─── Objectifs ──────────────────────────────────────────────────────────────
const OObj = ({ n, tone, children, d }: { n: number; tone: Tone; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 22, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 26px', ...dl(d) }}>
    <Num n={n} tone={tone} size={50} />
    <div style={{ fontSize: 27, lineHeight: 1.3, color: C.ink }}>{children}</div>
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
    <Title>Les 6 objectifs de vos deux jours</Title>
    <Lede>Le programme officiel Docaposte Institute. À la fin, vous saurez :</Lede>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1080, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <OObj n={1} tone="blue" d={100}>
        <strong>Découvrir GitHub Copilot</strong> et comprendre son fonctionnement
      </OObj>
      <OObj n={2} tone="navy" d={200}>
        <strong>Installer et configurer</strong> Copilot dans Visual Studio Code
      </OObj>
      <OObj n={3} tone="teal" d={300}>
        <strong>Générer</strong> blocs de code, fonctions et commentaires
      </OObj>
      <OObj n={4} tone="violet" d={400}>
        Effectuer un <strong>premier refactoring</strong> assisté par l’IA
      </OObj>
      <OObj n={5} tone="pink" d={500}>
        Initier la génération de <strong>tests unitaires</strong>
      </OObj>
      <OObj n={6} tone="coral" d={600}>
        <strong>Vérifier et valider</strong> le code généré, avec méthode
      </OObj>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1260, top: 260, width: 540, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 32px', ...dl(300) }}>
      <Eyebrow c={C.navy}>Équilibre des deux jours</Eyebrow>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <OBar label="Ateliers, exercices, échanges" value="≈ 60 %" pct={60} bg={G.green} c={C.green} d={600} />
        <OBar label="Apports et démonstrations" value="≈ 40 %" pct={40} bg={G.blue} c={C.blue} d={750} />
      </div>
      <div style={{ marginTop: 28, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
        8 ateliers individuels sur un même projet, un QCM par module, auto-positionnement au début et à la fin.
      </div>
    </div>
  </Frame>
);

// ─── Programme ──────────────────────────────────────────────────────────────
const OSlot = ({ t, mod, title, sub, tone, d }: { t: string; mod?: string; title: ReactNode; sub?: ReactNode; tone: Tone; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, ...dl(d) }}>
    <span style={{ flex: 'none', width: 82, fontFamily: mono, fontSize: 23, color: C.muted, paddingTop: 3 }}>{t}</span>
    <span style={{ flex: 'none', width: 12, height: 12, marginTop: 10, borderRadius: 99, background: STRONG[tone] }} />
    <div>
      <div style={{ fontSize: 26, fontWeight: 600, color: C.ink, lineHeight: 1.3 }}>
        {mod ? <span style={{ fontFamily: display, fontWeight: 800, color: STRONG[tone], marginRight: 10 }}>{mod}</span> : null}
        {title}
      </div>
      {sub ? <div style={{ fontSize: 21, color: C.muted, lineHeight: 1.35, marginTop: 3 }}>{sub}</div> : null}
    </div>
  </div>
);

const OHalf = ({ icon, tone, title, sub, d, children }: { icon: IconName; tone: Tone; title: string; sub: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
      <IconTile name={icon} tone={tone} size={50} solid />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</div>
        <div style={{ fontSize: 21, color: C.muted }}>{sub}</div>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>{children}</div>
  </div>
);

const O_Programme: Page = () => (
  <Frame mod={0}>
    <Title>Le programme des deux jours</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 48 }}>
      <OHalf icon="rocket" tone="blue" title="Jour 1" sub="Découverte et premières générations" d={0}>
        <OSlot t="9:00" title={`Ouverture · fil rouge ${PROJECT}`} tone="grey" d={150} />
        <OSlot t="9:30" mod="M1" title="Introduction à GitHub Copilot" sub="Histoire de l’IA, LLM, agents, écosystème · Atelier 1" tone="blue" d={230} />
        <OSlot t="11:10" mod="M2" title="Installation et configuration" sub="Licence, réglages, raccourcis, panneau Chat · Atelier 2" tone="navy" d={310} />
        <OSlot t="12:15" mod="M3" title="Comprendre les suggestions" sub="Contexte, inline ou chat, lire avant d’accepter · Atelier 3" tone="teal" d={390} />
        <OSlot t="14:55" mod="M4" title="Génération de code simple" sub="Commentaires guides, 3 langages · Atelier 4 : TaskFlow v1" tone="green" d={470} />
        <OSlot t="16:55" title="Bilan du jour · billet de sortie" tone="grey" d={550} />
      </OHalf>
      <OHalf icon="shieldCheck" tone="violet" title="Jour 2" sub="Approfondissement et bonnes pratiques" d={200}>
        <OSlot t="9:00" title="Reprise · quiz du Jour 1" tone="grey" d={450} />
        <OSlot t="9:15" mod="M5" title="Fonctions et blocs de code" sub="Classes, fichiers, API HTTP, parseurs, JSDoc · Atelier 5" tone="teal" d={530} />
        <OSlot t="11:00" mod="M6" title="Refactoring avec Copilot" sub="Renommer, extraire, comparer, legacy · Atelier 6" tone="violet" d={610} />
        <OSlot t="14:00" mod="M7" title="Tests unitaires avec Copilot" sub="Générer, organiser, vérifier, mocks · Atelier 7" tone="pink" d={690} />
        <OSlot t="15:15" mod="M8" title="Bonnes pratiques et vérification" sub="Checklist, hallucinations, droits, revue · Atelier 8" tone="coral" d={770} />
      <OSlot t="16:40" mod="M9" title="Les agents dans Copilot" sub="Agents, Skills, orchestration · Atelier 9" tone="violet" d={800} />
        <OSlot t="17:20" title="Évaluation · clôture" tone="grey" d={850} />
      </OHalf>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 925, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(1000) }}>
      <Icon name="map" size={24} color={C.electric} />
      Le bandeau en haut à droite indique toujours où nous en sommes : M1 → M4 le Jour 1, M5 → M8 le Jour 2.
    </div>
  </Frame>
);

// ─── Auto-positionnement ────────────────────────────────────────────────────
const O_AutoPos: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Auto-positionnement : votre point de départ</Title>
    <Lede>Comptez pour vous, sur papier, ce que vous savez déjà faire. Je coche à l’écran pour illustrer.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1150, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CheckItem id="ap1" size={26}>Expliquer ce qu’est un LLM et pourquoi Copilot peut se tromper</CheckItem>
        <CheckItem id="ap2" size={26}>Installer Copilot dans VS Code et vérifier ma licence</CheckItem>
        <CheckItem id="ap3" size={26}>Accepter, refuser ou parcourir les suggestions au clavier</CheckItem>
        <CheckItem id="ap4" size={26}>Choisir entre suggestion inline, chat en ligne et vue Chat</CheckItem>
        <CheckItem id="ap5" size={26}>Écrire un commentaire qui guide une génération précise</CheckItem>
        <CheckItem id="ap6" size={26}>Refactorer un code sans changer son comportement</CheckItem>
        <CheckItem id="ap7" size={26}>Faire générer des tests et vérifier leurs assertions</CheckItem>
        <CheckItem id="ap8" size={26}>Relire du code généré : logique, performance, sécurité, licence</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 262, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau de départ"
          levels={[
            { min: 0, text: 'Découverte : vous êtes au bon endroit.', tone: 'grey' },
            { min: 3, text: 'Bonnes bases : on va structurer.', tone: 'blue' },
            { min: 6, text: 'Déjà à l’aise : visez les bonus.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Notez votre score : on refera exactement le même exercice à la fin du Jour 2.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Fil rouge TaskFlow ─────────────────────────────────────────────────────
const OStep = ({ n, tone, title, out, d }: { n: number; tone: Tone; title: string; out: string; d: number }) => (
  <div className={A.right} style={{ display: 'flex', alignItems: 'center', gap: 14, ...dl(d) }}>
    <Num n={n} tone={tone} size={40} />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{title}</div>
      <div style={{ fontSize: 19, color: C.muted, lineHeight: 1.3 }}>{out}</div>
    </div>
  </div>
);

const O_FilRouge: Page = () => (
  <Frame mod={0}>
    <Title>
      Le fil rouge : <span style={{ color: C.green }}>{PROJECT}</span>, votre outil de tickets
    </Title>
    <Lede>Un backlog, un tableau Kanban, des règles métier. Un seul dépôt pour les deux jours : chaque atelier ajoute une brique.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 820, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Row2 icon="ticket" tone="blue" title="Des tickets" d={100}>
        story, bug ou tâche · priorité 1 à 3 · points 1-2-3-5-8-13
      </Row2>
      <Row2 icon="filter" tone="teal" title="Un backlog trié et filtrable" d={200}>
        recherche sans accents, filtres combinés, statistiques
      </Row2>
      <Row2 icon="layers" tone="violet" title="Un Kanban à 4 colonnes" d={300}>
        limite de 3 tickets en cours, ticket non estimé bloqué
      </Row2>
      <Row2 icon="archive" tone="coral" title="Un vieux module à reprendre" d={400}>
        du code « legacy » de 2019 à refactorer, tests à l’appui
      </Row2>
      <div className={A.fade} style={{ display: 'flex', gap: 10, marginTop: 4, ...dl(600) }}>
        <Tag tone="navy" size={19}>JavaScript · Node 22</Tag>
        <Tag tone="navy" size={19}>Tests node:test</Tag>
        <Tag tone="grey" size={19}>Variantes Python · Java</Tag>
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1010, top: 268, width: 790, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', ...dl(200) }}>
      <Eyebrow c={C.navy} size={20}>
        Vos 8 ateliers
      </Eyebrow>
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px 24px' }}>
        <OStep n={1} tone="blue" title="Premier contact" out="explorer TaskFlow" d={300} />
        <OStep n={5} tone="teal" title="Backlog & import" out="fonctions, classe, CSV" d={700} />
        <OStep n={2} tone="navy" title="Configuration" out="réglages, 8 gestes" d={400} />
        <OStep n={6} tone="violet" title="Refactoring" out="le legacy, tests verts" d={800} />
        <OStep n={3} tone="teal" title="Contexte" out="4 expériences" d={500} />
        <OStep n={7} tone="pink" title="Tests" out="suite + mocks" d={900} />
        <OStep n={4} tone="green" title="TaskFlow v1" out="le modèle de ticket" d={600} />
        <OStep n={8} tone="coral" title="Revue & livraison" out="8 défauts à trouver" d={1000} />
      </div>
    </div>
  </Frame>
);

// ─── Le kit d'ateliers ──────────────────────────────────────────────────────
const OKitRow = ({ path, children }: { path: string; children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '230px minmax(0, 1fr)', gap: 16, alignItems: 'baseline' }}>
    <PathChip size={20}>{path}</PathChip>
    <span style={{ fontSize: 21, color: C.soft, lineHeight: 1.35 }}>{children}</span>
  </div>
);

const O_Kit: Page = () => (
  <Frame mod={0}>
    <Title>Votre kit d’ateliers : le dépôt taskflow-copilot</Title>
    <Lede>Sur GitHub (lien à la page suivante) ou via le bouton « Labs » de ce support : le dépôt et le guide PDF des 8 ateliers.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 900, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 13 }}>
      <PanelTitle icon="archive">Ce qu’il contient</PanelTitle>
      <OKitRow path="src/">le code de TaskFlow, à générer, guidé par des commentaires</OKitRow>
      <OKitRow path="test/">les tests d’acceptation fournis : votre juge de paix</OKitRow>
      <OKitRow path="src/legacy/">un vieux code à refactorer (Jour 2)</OKitRow>
      <OKitRow path="katas/">petits exercices du Jour 1, variantes Python / Java</OKitRow>
      <OKitRow path="ateliers/">un énoncé README par atelier</OKitRow>
      <OKitRow path="public/">l’interface Kanban, qui s’allume au fil des ateliers</OKitRow>
      <OKitRow path="JOURNAL.md">votre journal de bord, à remplir</OKitRow>
    </div>
    <div style={{ position: 'absolute', left: 1080, top: 262, width: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <CodeDark file="Terminal · taskflow-copilot" size={21} cls={A.right} style={dl(200)}>
        <Cc>{'# aucune dépendance à installer'}</Cc>
        {'\n'}
        <Cf>node</Cf> --version <Cc>{'      # 22 ou plus'}</Cc>
        {'\n'}
        <Cf>npm</Cf> test <Cc>{'            # rouge : normal !'}</Cc>
        {'\n'}
        <Cf>npm</Cf> run test:atelier4
        {'\n'}
        <Cf>npm</Cf> run serveur <Cc>{'    # localhost:3000'}</Cc>
      </CodeDark>
      <Callout tone="green" icon="flask" title="Des tests rouges au départ" size={23} cls={A.right} style={dl(400)}>
        Chaque atelier les fait passer au vert. Les tests fournis ne se modifient pas : c’est votre code qui s’adapte.
      </Callout>
    </div>
  </Frame>
);

// ─── Dépôt GitHub des ateliers (lien cliquable + copier) ──────────────────────
const REPO_URL = 'https://github.com/houssemeddinelassoued/taskflow-copilot';
const REPO_CLONE = `git clone ${REPO_URL}.git`;

const copierTexte = async (txt: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(txt);
    return true;
  } catch {
    const t = document.createElement('textarea');
    t.value = txt;
    t.style.position = 'fixed';
    t.style.opacity = '0';
    document.body.appendChild(t);
    t.select();
    const ok = document.execCommand('copy');
    t.remove();
    return ok;
  }
};

const O_Depot: Page = () => {
  const [copie, setCopie] = useState<'lien' | 'clone' | null>(null);
  const copier = (quoi: 'lien' | 'clone') => {
    void copierTexte(quoi === 'lien' ? REPO_URL : REPO_CLONE).then((ok) => {
      if (!ok) return;
      setCopie(quoi);
      window.setTimeout(() => setCopie((c) => (c === quoi ? null : c)), 2200);
    });
  };
  return (
    <Frame mod={0}>
      <Title>Le dépôt des ateliers, en ligne sur GitHub</Title>
      <Lede>Un clic pour l’ouvrir, un clic pour copier le lien et le coller dans le clavardage.</Lede>
      <div style={{ position: 'absolute', left: 120, top: 262, width: 1020, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 32px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          <PanelTitle icon="git">Le lien du dépôt</PanelTitle>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-osd-interactive
            style={{ fontFamily: mono, fontSize: 30, fontWeight: 600, color: T.blue.fg, textDecoration: 'underline', textUnderlineOffset: 6, textDecorationThickness: 2, whiteSpace: 'nowrap', userSelect: 'all' }}
          >
            github.com/houssemeddinelassoued/taskflow-copilot
          </a>
          <div style={{ display: 'flex', gap: 18 }}>
            <Btn icon="globe" size={24} onClick={() => window.open(REPO_URL, '_blank', 'noopener')}>
              Ouvrir le dépôt
            </Btn>
            <Btn icon={copie === 'lien' ? 'check' : 'link'} tone={copie === 'lien' ? 'green' : 'blue'} ghost={copie !== 'lien'} size={24} onClick={() => copier('lien')}>
              {copie === 'lien' ? 'Lien copié !' : 'Copier le lien'}
            </Btn>
          </div>
        </div>
        <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 18, ...dl(200) }}>
          <PanelTitle icon="terminal">Ou en ligne de commande</PanelTitle>
          <CodeDark file="Terminal" size={20}>
            <Cf>git</Cf> clone {REPO_URL}.git
            {'\n'}
            <Cf>cd</Cf> taskflow-copilot
            {'\n'}
            <Cf>npm</Cf> test <Cc>{'   # rouge : normal !'}</Cc>
          </CodeDark>
          <div style={{ display: 'flex' }}>
            <Btn icon={copie === 'clone' ? 'check' : 'code'} tone={copie === 'clone' ? 'green' : 'navy'} ghost={copie !== 'clone'} size={22} onClick={() => copier('clone')}>
              {copie === 'clone' ? 'Commande copiée !' : 'Copier la commande git clone'}
            </Btn>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 1200, top: 262, width: 600, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card tone="teal" icon="archive" title="Pas de Git ?" cls={A.right} style={dl(300)}>
          Sur la page du dépôt : bouton vert <b>Code › Download ZIP</b>, puis décompressez. Ou le bouton « Labs » de ce support.
        </Card>
        <Card tone="violet" icon="doc" title="Le guide PDF" cls={A.right} style={dl(450)}>
          Guide-des-ateliers-Copilot-Debutant.pdf, à la racine du dépôt : les 8 énoncés.
        </Card>
        <Callout tone="green" icon="lock" title="Vous codez en local" size={23} cls={A.right} style={dl(600)}>
          Pas besoin de forker ni de pousser : vous codez dans votre copie locale.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Check-up technique ─────────────────────────────────────────────────────
const O_Setup: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Check-up technique : cinq minutes avant de coder</Title>
    <Lede>Chacun vérifie sur son poste. Ce qui n’est pas prêt maintenant vous coûtera dix minutes en plein atelier.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060, display: 'flex', flexDirection: 'column', gap: 13 }}>
        <CheckItem id="su1" size={25}>VS Code à jour (menu Aide › Rechercher les mises à jour)</CheckItem>
        <CheckItem id="su2" size={25}>Compte GitHub accessible (identifiant et double authentification)</CheckItem>
        <CheckItem id="su3" size={25}>Node.js 22 ou plus : node --version dans le terminal</CheckItem>
        <CheckItem id="su4" size={25}>Dépôt taskflow-copilot cloné (ou zip décompressé) et ouvert</CheckItem>
        <CheckItem id="su5" size={25}>npm test s’exécute (des tests rouges : c’est normal)</CheckItem>
        <CheckItem id="su6" size={25}>Deux fenêtres côte à côte : classe virtuelle et VS Code</CheckItem>
      </div>
      <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Timer id="setup" minutes={5} label="Check-up" cls={A.right} style={{ width: 560, ...dl(200) }} />
        <Callout title="Installation de Copilot" tone="blue" icon="plug" cls={A.right} style={dl(400)} size={24}>
          On la fait ensemble au Module 2. Déjà installé ? Parfait, vous aiderez au point d’étape.
        </Callout>
      </div>
    </Checklist>
  </Frame>
);

// ═══ 10-m1 ═════════════════════════════════════════════════════════════

// ─── Module 1 · Introduction à GitHub Copilot ───────────────────────────────

const M1_Divider: Page = () => (
  <Section
    n={1}
    title={
      <>
        Introduction à
        <br />
        GitHub Copilot
      </>
    }
    sub="D’où il vient, comment il fonctionne, ce qu’il sait faire… et ce qu’il ne sait pas faire."
    dur="J1 · 9:30 – 10:55"
    labs={<Tag tone="green" size={19}>Atelier 1 · premier contact</Tag>}
  >
    <SecItem n={1}>80 ans d’IA, cinq ans de Copilot</SecItem>
    <SecItem n={2}>Sous le capot : neurones, entraînement, tokens, Transformer</SecItem>
    <SecItem n={3}>Génération probabiliste, hallucinations, agents</SecItem>
    <SecItem n={4}>Prompt, contexte, harnais · Copilot, offres et nouveautés 2026</SecItem>
    <SecItem n={5}>Avantages, limites et démonstration en direct</SecItem>
  </Section>
);
M1_Divider.transition = BLOOM;

// ─── Histoire ───────────────────────────────────────────────────────────────
const M1Mile = ({ x, year, title, sub, tone, d, now = false }: { x: number; year: string; title: string; sub: string; tone: Tone; d: number; now?: boolean }) => (
  <div className={now ? b.pop(1) : A.in} style={{ position: 'absolute', left: x - 125, top: 380, width: 250, textAlign: 'center', ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: STRONG[tone] }}>{year}</div>
    <div style={{ margin: '18px auto 0', width: 30, height: 30, borderRadius: 99, background: STRONG[tone], boxShadow: `0 0 0 8px ${T[tone].bg}` }} />
    <div style={{ marginTop: 26, fontSize: 25, fontWeight: 700, lineHeight: 1.25, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 20, lineHeight: 1.4, color: C.soft }}>{sub}</div>
  </div>
);

const M1_Histoire: Page = () => (
  <Frame mod={1} beats={1}>
    <Title>Cinq ans d’histoire : de l’autocomplétion aux agents</Title>
    <Lede>Copilot est né d’un partenariat GitHub × OpenAI. Il a changé de nature chaque année.</Lede>
    <div className={A.grow} style={{ position: 'absolute', left: 160, top: 467, width: 1600, height: 6, borderRadius: 3, background: G.brand, ...dl(100) }} />
    <M1Mile x={250} year="2021" title="Préversion" sub="Modèle OpenAI Codex : complétion de code « ghost text »" tone="navy" d={200} />
    <M1Mile x={530} year="2022" title="Disponible pour tous" sub="Abonnement individuel, puis offre entreprise" tone="blue" d={320} />
    <M1Mile x={810} year="2023" title="Copilot Chat" sub="On converse avec son code dans l’éditeur" tone="teal" d={440} />
    <M1Mile x={1090} year="2024" title="Choix du modèle" sub="Plusieurs fournisseurs · offre gratuite Copilot Free" tone="green" d={560} />
    <M1Mile x={1370} year="2025" title="Mode Agent" sub="Modifications multi-fichiers, agent cloud, revue de PR" tone="violet" d={680} />
    <M1Mile x={1650} year="2026" title="Fenêtre Agents" sub="Sessions cloud, automatisations, crédits IA" tone="coral" d={800} now />
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 830, width: 1680 }}>
      <Callout tone="blue" icon="bulb" title="Ce qui ne change pas" size={25}>
        Sous chaque nouveauté, le même moteur : un modèle de langage qui <strong>prédit</strong> du code plausible. Et la même règle : vous relisez.
      </Callout>
    </div>
  </Frame>
);

// ─── Fonctionnement ─────────────────────────────────────────────────────────
const M1Stage = ({ x, n, icon, tone, title, sub, beat }: { x: number; n: number; icon: IconName; tone: Tone; title: string; sub: string; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ position: 'absolute', left: x, top: 300, width: 250, height: 380, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 22px', borderTop: `7px solid ${STRONG[tone]}` }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <IconTile name={icon} tone={tone} size={56} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: T[tone].bd }}>{n}</span>
    </div>
    <div style={{ marginTop: 18, fontSize: 25, fontWeight: 700, lineHeight: 1.25, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 10, fontSize: 21, lineHeight: 1.42, color: C.soft }}>{sub}</div>
  </div>
);

const M1_Fonctionnement: Page = () => (
  <Frame mod={1} beats={5}>
    <Title>Ce qui se passe entre votre clavier et la suggestion</Title>
    <Lede>Une suggestion inline prend quelques centaines de millisecondes. Six étapes, dont la dernière vous appartient.</Lede>
    <M1Stage x={120} n={1} icon="code" tone="navy" title="Vous écrivez" sub="du code, un commentaire, ou une question dans le chat" beat={0} />
    <M1Stage x={406} n={2} icon="layers" tone="blue" title="VS Code assemble le contexte" sub="fichier courant, onglets ouverts, sélection, instructions" beat={1} />
    <M1Stage x={692} n={3} icon="shield" tone="teal" title="Le service Copilot filtre" sub="sécurité, contenus, code public correspondant" beat={2} />
    <M1Stage x={978} n={4} icon="brain" tone="violet" title="Le modèle prédit" sub="la suite la plus probable, morceau par morceau" beat={3} />
    <M1Stage x={1264} n={5} icon="sparkles" tone="green" title="La suggestion s’affiche" sub="texte grisé, réponse du chat ou modification proposée" beat={4} />
    <M1Stage x={1550} n={6} icon="humanCheck" tone="coral" title="Vous décidez" sub="lire, accepter, ajuster ou refuser" beat={5} />
    <div className={b.on(5)} style={{ position: 'absolute', left: 120, top: 730, width: 1680 }}>
      <Callout tone="coral" icon="alert" title="Ce que Copilot ne fait pas pour une suggestion inline" size={25}>
        Il n’exécute pas votre code, ne lance pas vos tests et ne « connaît » pas votre projet : il ne voit que le contexte envoyé à l’étape 2.
      </Callout>
    </div>
  </Frame>
);

// ─── Modèles ────────────────────────────────────────────────────────────────
const M1ModelCol = ({ icon, tone, title, sub, children, d }: { icon: IconName; tone: Tone; title: string; sub: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={56} />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.ink }}>{title}</div>
        <div style={{ fontSize: 20, color: C.muted }}>{sub}</div>
      </div>
    </div>
    <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
  </div>
);

const M1_Modeles: Page = () => (
  <Frame mod={1}>
    <Title>Plusieurs modèles derrière un seul Copilot</Title>
    <Lede>Copilot n’est pas un modèle : c’est un service qui orchestre des modèles de plusieurs fournisseurs (OpenAI, Anthropic, Google…).</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 26 }}>
      <M1ModelCol icon="bolt" tone="blue" title="Complétions inline" sub="un modèle rapide, dédié" d={100}>
        <Bullet size={22}>Répond en quelques centaines de ms</Bullet>
        <Bullet size={22}>Ne se choisit pas dans le chat</Bullet>
        <Bullet size={22}>Ne consomme pas de crédits IA</Bullet>
      </M1ModelCol>
      <M1ModelCol icon="sparkles" tone="green" title="Auto" sub="le choix par défaut du chat" d={220}>
        <Bullet size={22} tone="green">Copilot choisit un modèle adapté</Bullet>
        <Bullet size={22} tone="green">Seul choix sur l’offre Free</Bullet>
        <Bullet size={22} tone="green">Le bon réflexe pour débuter</Bullet>
      </M1ModelCol>
      <M1ModelCol icon="brain" tone="violet" title="Modèles au choix" sub="sélecteur de modèle (offres payantes)" d={340}>
        <Bullet size={22} tone="violet">Légers : rapides et économes</Bullet>
        <Bullet size={22} tone="violet">Avancés : raisonnement, plus coûteux</Bullet>
        <Bullet size={22} tone="violet">Liste qui évolue chaque mois</Bullet>
      </M1ModelCol>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 700, width: 1680 }}>
      <Callout tone="blue" icon="scale" title="Changer de modèle ne change pas la méthode" size={25} cls={A.in} style={dl(600)}>
        Un modèle plus puissant se trompe moins souvent, pas jamais. Le contexte que vous donnez pèse plus lourd que le nom du modèle.
      </Callout>
    </div>
  </Frame>
);

// ─── Écosystème ─────────────────────────────────────────────────────────────
const M1Surface = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <Card icon={icon} tone={tone} title={title} size={22} pad={24} cls={A.in} style={dl(d)}>
    {children}
  </Card>
);

const M1_Ecosysteme: Page = () => (
  <Frame mod={1}>
    <Title>Copilot dans l’écosystème GitHub</Title>
    <Lede>Le même compte, la même licence, plusieurs points d’entrée. Cette formation se concentre sur le premier.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <M1Surface icon="code" tone="blue" title="Dans l’éditeur" d={100}>
        <strong>VS Code</strong> (notre terrain de jeu), Visual Studio, JetBrains, Xcode, Eclipse…
      </M1Surface>
      <M1Surface icon="chat" tone="teal" title="Sur github.com" d={180}>
        Poser une question sur un dépôt, une issue ou une pull request.
      </M1Surface>
      <M1Surface icon="terminal" tone="navy" title="Copilot CLI" d={260}>
        Un agent dans le terminal : expliquer, exécuter, corriger.
      </M1Surface>
      <M1Surface icon="cloud" tone="violet" title="Agent cloud" d={340}>
        On lui confie une issue, il travaille seul et ouvre une pull request.
      </M1Surface>
      <M1Surface icon="shieldCheck" tone="coral" title="Revue de code" d={420}>
        Un premier relecteur automatique sur les pull requests.
      </M1Surface>
      <M1Surface icon="phone" tone="green" title="App Copilot & mobile" d={500}>
        Suivre et reprendre ses sessions d’agent hors de l’éditeur.
      </M1Surface>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 900, ...dl(800) }}>
      Agent cloud et revue de code : offres payantes. Tout ce que nous ferons fonctionne avec Copilot Free.
    </Hint>
  </Frame>
);

// ─── Offres & crédits (actualité) ───────────────────────────────────────────
const M1Plan = ({ name, price, tone, children, d }: { name: string; price: string; tone: Tone; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: C.navy }}>{name}</span>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 23, color: STRONG[tone] }}>{price}</span>
    </div>
    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
  </div>
);

const M1_Offres: Page = () => (
  <Frame mod={1} kind="actu">
    <Title>Offres et crédits IA : ce qui a changé en 2026</Title>
    <Lede>Depuis juin 2026, chat et agents consomment des « GitHub AI Credits ». Les suggestions inline, elles, restent hors crédits.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <M1Plan name="Free" price="0 €" tone="green" d={100}>
        <Bullet size={22} tone="green">2 000 complétions par mois</Bullet>
        <Bullet size={22} tone="green">Chat et agent : usage limité</Bullet>
        <Bullet size={22} tone="green">Modèle Auto, sans revue de PR</Bullet>
      </M1Plan>
      <M1Plan name="Pro / Pro+" price="dès 10 $ / mois" tone="blue" d={220}>
        <Bullet size={22}>Complétions et NES illimitées</Bullet>
        <Bullet size={22}>Choix du modèle, crédits inclus</Bullet>
        <Bullet size={22}>Agent cloud et revue de code</Bullet>
      </M1Plan>
      <M1Plan name="Business / Enterprise" price="par siège" tone="violet" d={340}>
        <Bullet size={22} tone="violet">Licence attribuée par l’entreprise</Bullet>
        <Bullet size={22} tone="violet">Politiques fixées par l’administrateur</Bullet>
        <Bullet size={22} tone="violet">Vos données ne servent pas à l’entraînement</Bullet>
      </M1Plan>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 650, width: 1680, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 24 }}>
      <Callout tone="blue" icon="money" title="1 crédit = 0,01 $" size={23} cls={A.in} style={dl(500)}>
        Une question simple à un modèle léger coûte une fraction de crédit ; une longue session d’agent sur un modèle avancé, beaucoup plus.
      </Callout>
      <Callout tone="green" icon="bolt" title="Pour cette formation" size={23} cls={A.in} style={dl(650)}>
        L’essentiel se fait en suggestions inline et en chat : Copilot Free suffit pour tous les ateliers.
      </Callout>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 905, fontSize: 19, color: C.muted, ...dl(900) }}>
      Source : github.com/features/copilot/plans, consulté le 4 novembre 2026. Les montants évoluent : vérifiez avant de citer un chiffre.
    </div>
  </Frame>
);

// ─── Nouveautés Universe 2026 (actualité) ───────────────────────────────────
const M1News = ({ icon, tone, title, tag, children, d }: { icon: IconName; tone: Tone; title: string; tag: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 24px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={50} />
      <div style={{ flex: 1, fontSize: 25, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>{title}</div>
      <Tag tone={tag === 'GA' ? 'green' : 'yellow'} size={16}>
        {tag}
      </Tag>
    </div>
    <div style={{ marginTop: 10, fontSize: 21, lineHeight: 1.42, color: C.soft }}>{children}</div>
  </div>
);

const M1_Nouveautes: Page = () => (
  <Frame mod={1} kind="actu" beats={1}>
    <Title>Les nouveautés d’octobre 2026 (GitHub Universe)</Title>
    <Lede>Annoncées le 28 octobre pour VS Code : surtout des agents qui travaillent plus longtemps, ailleurs, et plus sûrement.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 22 }}>
      <M1News icon="layers" tone="blue" title="Fenêtre Agents" tag="GA" d={100}>
        Lancer, suivre et comparer des sessions ; les reprendre dans l’app Copilot, sur mobile ou dans le CLI.
      </M1News>
      <M1News icon="server" tone="navy" title="Agent Host" tag="GA" d={180}>
        Les sessions continuent en arrière-plan, même fenêtre ou dossier fermés.
      </M1News>
      <M1News icon="scale" tone="violet" title="Comparer les modèles" tag="Préversion" d={260}>
        Plusieurs modèles sur la même tâche, côte à côte ; un « juge » peut recommander.
      </M1News>
      <M1News icon="clock" tone="teal" title="Automatisations cloud" tag="Préversion" d={340}>
        Des tâches d’agent planifiées ou déclenchées par une pull request (VS Code 1.144).
      </M1News>
      <M1News icon="plug" tone="green" title="Connecteurs Copilot" tag="Préversion" d={420}>
        Slack, Notion, Microsoft Learn… dans une session, sans installer de serveur MCP.
      </M1News>
      <M1News icon="lock" tone="coral" title="Bac à sable local" tag="GA" d={500}>
        Limite l’accès des agents aux fichiers, au réseau et aux identifiants (VS Code 1.141).
      </M1News>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 800, width: 1680 }}>
      <Callout tone="yellow" icon="bulb" title="Et pour vous, cette semaine ?" size={25}>
        Rien de tout cela n’est nécessaire pour bien débuter. Nous travaillons ce qui ne change pas : suggestions inline, chat, et vérification.
      </Callout>
    </div>
  </Frame>
);

// ─── Vrai ou faux ───────────────────────────────────────────────────────────
const M1Myth = ({ claim, verdict, ok, children, n }: { claim: string; verdict: string; ok: boolean; children: ReactNode; n: number }) => (
  <FlipCard
    w={538}
    h={300}
    tone="navy"
    backTone={ok ? 'green' : 'coral'}
    front={
      <>
        <Eyebrow c={C.muted} size={18}>
          Affirmation {n}
        </Eyebrow>
        <div style={{ marginTop: 14, fontSize: 29, fontWeight: 700, lineHeight: 1.3, color: C.ink }}>« {claim} »</div>
        <div style={{ marginTop: 'auto', fontSize: 19, color: C.muted }}>Vrai ou faux ? Votez à voix haute, puis cliquez.</div>
      </>
    }
    back={
      <>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: ok ? T.green.fg : T.coral.fg }}>{verdict}</div>
        <div style={{ marginTop: 12, fontSize: 22, lineHeight: 1.45, color: C.ink }}>{children}</div>
      </>
    }
  />
);

const M1_VraiFaux: Page = () => (
  <Frame mod={1} kind="exercice">
    <Title>Vrai ou faux ? Six idées reçues sur Copilot</Title>
    <Lede>Pour chaque carte, dites « vrai » ou « faux » au micro. Je retourne la carte après le vote.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 538px)', gap: 33, rowGap: 26 }}>
      <M1Myth n={1} claim="Copilot connaît tout mon projet." verdict="Faux" ok={false}>
        Il ne voit que le contexte envoyé : fichier courant, onglets ouverts, références que vous ajoutez.
      </M1Myth>
      <M1Myth n={2} claim="Il teste son code avant de me le proposer." verdict="Faux" ok={false}>
        Une suggestion inline n’est jamais exécutée. Un agent peut lancer des tests… si vous l’y autorisez.
      </M1Myth>
      <M1Myth n={3} claim="Il peut se tromper avec beaucoup d’aplomb." verdict="Vrai" ok>
        Il prédit du texte plausible : une API inventée a l’air aussi sûre qu’une vraie.
      </M1Myth>
      <M1Myth n={4} claim="Je suis responsable du code que j’accepte." verdict="Vrai" ok>
        Une suggestion acceptée devient votre code : en revue, en production, juridiquement.
      </M1Myth>
      <M1Myth n={5} claim="Il apprend mon code en direct, d’une session à l’autre." verdict="Faux" ok={false}>
        Le modèle ne change pas pendant que vous travaillez. Ce qui persiste, ce sont vos fichiers d’instructions.
      </M1Myth>
      <M1Myth n={6} claim="Avec Copilot, plus besoin de revue de code." verdict="Faux" ok={false}>
        Il accélère l’écriture : la relecture humaine et les tests deviennent encore plus importants.
      </M1Myth>
    </div>
  </Frame>
);

// ─── Avantages & limites ────────────────────────────────────────────────────
const M1_AvantagesLimites: Page = () => (
  <Frame mod={1}>
    <Title>Avantages et limites : où Copilot brille, où il trébuche</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 820, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', borderTop: `7px solid ${C.green}` }}>
      <PanelTitle icon="checkCircle" c={T.green.fg}>
        Là où il excelle
      </PanelTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 6 }}>
        <Bullet size={25} tone="green">Code répétitif, structures, conversions</Bullet>
        <Bullet size={25} tone="green">Expliquer un code ou une erreur inconnue</Bullet>
        <Bullet size={25} tone="green">Premier jet de tests et de documentation</Bullet>
        <Bullet size={25} tone="green">Syntaxe d’un langage ou d’une API que l’on connaît mal</Bullet>
        <Bullet size={25} tone="green">Renommer, extraire, simplifier</Bullet>
        <Bullet size={25} tone="green">Rester dans le flux, sans quitter l’éditeur</Bullet>
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 980, top: 200, width: 820, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', borderTop: `7px solid ${C.coral}`, ...dl(200) }}>
      <PanelTitle icon="alert" c={T.coral.fg}>
        Là où il faut redoubler de vigilance
      </PanelTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 6 }}>
        <Bullet size={25} tone="coral">Règles métier subtiles et cas limites</Bullet>
        <Bullet size={25} tone="coral">Sécurité : injections, secrets, droits d’accès</Bullet>
        <Bullet size={25} tone="coral">API récentes ou internes : il invente</Bullet>
        <Bullet size={25} tone="coral">Gros changements sur un code qu’il voit en partie</Bullet>
        <Bullet size={25} tone="coral">Licences : code très proche d’un dépôt public</Bullet>
        <Bullet size={25} tone="coral">Décisions d’architecture : c’est la vôtre</Bullet>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 780, width: 1680 }}>
      <Callout tone="blue" icon="hand" title="La bonne posture" size={26} cls={A.in} style={dl(500)}>
        Traitez Copilot comme un collègue junior très rapide et très cultivé : on lui délègue volontiers, on relit toujours.
      </Callout>
    </div>
  </Frame>
);

// ─── Démo en direct ─────────────────────────────────────────────────────────
const M1DemoStep = ({ n, tone, title, children, beat }: { n: number; tone: Tone; title: string; children: ReactNode; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', background: C.card, borderRadius: 18, boxShadow: SHADOW_SM, padding: '18px 24px' }}>
    <Num n={n} tone={tone} size={46} />
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, color: C.soft, lineHeight: 1.4, marginTop: 4 }}>{children}</div>
    </div>
  </div>
);

const M1_Demo: Page = () => (
  <Frame mod={1} kind="demo" beats={3}>
    <Title>Démo en direct : Copilot sur TaskFlow</Title>
    <Lede>Je partage mon écran. Regardez surtout ce que je fais entre deux suggestions : je lis.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1060, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M1DemoStep n={1} tone="blue" title="Une suggestion inline" beat={0}>
        Un commentaire dans <Ic>katas/01-premiers-pas.js</Ic>, le texte grisé, <Kbd>Tab</Kbd> ou <Kbd>Échap</Kbd>.
      </M1DemoStep>
      <M1DemoStep n={2} tone="teal" title="Une question au chat (Ask)" beat={1}>
        <Pr>« Explique la structure de ce projet en 5 lignes. »</Pr> Puis je vérifie dans le README.
      </M1DemoStep>
      <M1DemoStep n={3} tone="violet" title="Une modification sur place (Ctrl+I)" beat={2}>
        Je sélectionne une fonction : <Pr>« gère le tableau vide »</Pr>, je relis le diff, j’accepte.
      </M1DemoStep>
      <M1DemoStep n={4} tone="green" title="La preuve" beat={3}>
        <Ic>npm test</Ic> : sans test vert, rien n’est terminé.
      </M1DemoStep>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1240, top: 262, width: 560, ...dl(300) }}>
      <Card icon="chat" tone="navy" title="Questions / réponses" size={23} pad={26}>
        Pendant la démo : une question ? Écrivez-la dans le clavardage, j’y réponds à chaque étape.
        <div style={{ marginTop: 16, fontSize: 21, color: C.muted, fontStyle: 'italic' }}>
          Les plus fréquentes : « Il voit mon code ? », « C’est payant ? », « Et la confidentialité ? »
        </div>
      </Card>
    </div>
  </Frame>
);

// ─── Atelier 1 ──────────────────────────────────────────────────────────────
const M1_Lab: Page = () => (
  <LabPage
    mod={1}
    n="1"
    title="Premier contact avec Copilot"
    defi="explorer"
    who="Individuel · 20 min"
    objective={
      <>
        Voir Copilot à l’œuvre sur un vrai dépôt : lui faire <strong>expliquer TaskFlow</strong>, obtenir vos premières <strong>suggestions inline</strong>, et noter ce qui est juste… et ce qui ne l’est pas.
      </>
    }
    where={
      <>
        <PathChip size={19}>katas/01-premiers-pas.js</PathChip> complété et relu
        <br />
        <PathChip size={19}>JOURNAL.md</PathChip> · 3 observations
      </>
    }
    minutes={20}
    crit={
      <>
        <CheckItem id="l1a" size={21}>Une affirmation exacte et une imprécise relevées</CheckItem>
        <CheckItem id="l1b" size={21}>4 blocs du kata traités au clavier</CheckItem>
        <CheckItem id="l1c" size={21}>estBissextile(1900) vérifiée à la main</CheckItem>
      </>
    }
    suivi="Point d’étape au micro à 10 min : « Copilot vous a-t-il déjà dit quelque chose de faux ? »"
  >
    <WStep n={1}>
      Vue Chat (<Kbd>Ctrl+Alt+I</Kbd>), agent <strong>Ask</strong> : <Pr>« Explique la structure de ce projet en 5 lignes. Cite les fichiers. »</Pr> Comparez avec le README.
    </WStep>
    <WStep n={2}>
      Dans le kata, pour chaque ligne ▶ : attendez le texte grisé, lisez, <Kbd>Tab</Kbd> ou <Kbd>Échap</Kbd>.
    </WStep>
    <WStep n={3}>Vérifiez la règle bissextile sur 1900, 2000 et 2024, puis remplissez JOURNAL.md.</WStep>
  </LabPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M1_Qcm: Page = () => (
  <Frame mod={1} kind="qcm">
    <Title>QCM · Module 1 en quatre questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Sur quoi repose une suggestion de Copilot ?" explain="Un modèle de langage prédit la suite la plus probable à partir du contexte envoyé. Il n’exécute rien et ne « comprend » pas votre besoin.">
        <QOpt>Une base de données de solutions validées par GitHub</QOpt>
        <QOpt ok>Une prédiction du code le plus probable, à partir du contexte envoyé</QOpt>
        <QOpt>L’exécution de votre code pour trouver ce qui marche</QOpt>
      </QuizQ>
      <QuizQ q="Sur l’offre Copilot Free, qu’est-ce qui ne consomme pas de crédits IA ?" explain="Depuis juin 2026, complétions et suggestions de modification suivante sont hors crédits (avec un plafond de 2 000 complétions par mois sur Free). Chat et agents consomment des crédits.">
        <QOpt>Les questions dans le chat</QOpt>
        <QOpt ok>Les suggestions inline (complétions)</QOpt>
        <QOpt>Les sessions en mode Agent</QOpt>
      </QuizQ>
      <QuizQ q="Copilot propose une fonction qui « a l’air juste ». Que faites-vous ?" explain="Plausible ne veut pas dire correct : on lit, on teste les cas limites. C’est le réflexe de toute la formation.">
        <QOpt>Je l’accepte : il a été entraîné sur des millions de dépôts</QOpt>
        <QOpt>Je demande au chat si elle est juste, et je le crois</QOpt>
        <QOpt ok>Je la lis ligne à ligne et je la vérifie sur des cas limites</QOpt>
      </QuizQ>
      <QuizQ q="Parmi les nouveautés d’octobre 2026, laquelle permet de faire travailler plusieurs modèles sur la même tâche ?" explain="« Comparer les résultats de modèles », en préversion dans la fenêtre Agents. La fenêtre Agents en est le cadre, les connecteurs apportent du contexte externe.">
        <QOpt>Les connecteurs Copilot</QOpt>
        <QOpt ok>La comparaison des résultats de modèles</QOpt>
        <QOpt>Le bac à sable local</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M1_Pause: Page = () => <BreakPage mod={1} title="Pause" back="Reprise à 11 h 10 : on installe et on configure Copilot." minutes={15} />;

// ═══ 11-m1-moteur ══════════════════════════════════════════════════════

// ─── Module 1 · Sous le capot : histoire de l’IA, ML, deep learning, LLM, agents ─────
// Frise portée depuis .dap-build/j1-10-m1.tsx (portraits Wikimedia Commons, licences libres).

// ─── Frise 1943 → 2026 (interactive : survol d’un jalon = fiche détaillée) ──
// Portraits & visuels : Wikimedia Commons (licences libres), recadrés en 256 px.
const TLI = {
  pitts: new URL('./assets/timeline/pitts.jpg', import.meta.url).href,
  turing: new URL('./assets/timeline/turing.jpg', import.meta.url).href,
  bombe: new URL('./assets/timeline/bombe.jpg', import.meta.url).href,
  mccarthy: new URL('./assets/timeline/mccarthy.jpg', import.meta.url).href,
  minsky: new URL('./assets/timeline/minsky.jpg', import.meta.url).href,
  rosenblatt: new URL('./assets/timeline/rosenblatt.jpg', import.meta.url).href,
  markI: new URL('./assets/timeline/markI.jpg', import.meta.url).href,
  weizenbaum: new URL('./assets/timeline/weizenbaum.jpg', import.meta.url).href,
  eliza: new URL('./assets/timeline/eliza.jpg', import.meta.url).href,
  papert: new URL('./assets/timeline/papert.jpg', import.meta.url).href,
  feigenbaum: new URL('./assets/timeline/feigenbaum.jpg', import.meta.url).href,
  lisp: new URL('./assets/timeline/lisp.jpg', import.meta.url).href,
  rumelhart: new URL('./assets/timeline/rumelhart.jpg', import.meta.url).href,
  hinton: new URL('./assets/timeline/hinton.jpg', import.meta.url).href,
  lecun: new URL('./assets/timeline/lecun.jpg', import.meta.url).href,
  schmidhuber: new URL('./assets/timeline/schmidhuber.jpg', import.meta.url).href,
  deepblue: new URL('./assets/timeline/deepblue.jpg', import.meta.url).href,
  kasparov: new URL('./assets/timeline/kasparov.jpg', import.meta.url).href,
  bengio: new URL('./assets/timeline/bengio.jpg', import.meta.url).href,
  feifeili: new URL('./assets/timeline/feifeili.jpg', import.meta.url).href,
  goodfellow: new URL('./assets/timeline/goodfellow.jpg', import.meta.url).href,
  alphago: new URL('./assets/timeline/alphago.jpg', import.meta.url).href,
  hassabis: new URL('./assets/timeline/hassabis.jpg', import.meta.url).href,
  leesedol: new URL('./assets/timeline/leesedol.jpg', import.meta.url).href,
  transformer: new URL('./assets/timeline/transformer.jpg', import.meta.url).href,
  altman: new URL('./assets/timeline/altman.jpg', import.meta.url).href,
  amodei: new URL('./assets/timeline/amodei.jpg', import.meta.url).href,
  karpathy: new URL('./assets/timeline/karpathy.jpg', import.meta.url).href,
};

type TlEraId = 'a' | 'b' | 'c' | 'd' | 'e' | 'f';
const TL_ERA: Record<TlEraId, { name: string; band?: string; years: string; c: string; tone: Tone; text: string }> = {
  a: { name: 'Fondations', years: '1943 – 1966', c: C.teal, tone: 'teal', text: 'Logique, neurone formel, test de Turing : l’IA naît de la cybernétique, dans un optimisme débordant. Premier âge d’or.' },
  b: { name: 'Hivers de l’IA', band: 'Hivers', years: '1969 – années 80', c: '#6B7690', tone: 'grey', text: 'Promesses non tenues, crédits coupés : deux hivers (1974–1980, 1987–1993). L’IA « symbolique » à base de règles domine.' },
  c: { name: 'Renouveau', years: '1986 – 1997', c: C.blue, tone: 'blue', text: 'Retour de l’apprentissage : rétropropagation, réseaux convolutifs, LSTM… pendant que Deep Blue gagne par la force brute.' },
  d: { name: 'Deep learning', years: '2006 – 2016', c: C.navy, tone: 'navy', text: 'Données massives + GPU + réseaux profonds : la vision, la voix puis le jeu de go tombent l’un après l’autre.' },
  e: { name: 'IA générative', years: '2017 – 2023', c: C.violet, tone: 'violet', text: 'Le Transformer et le pré-entraînement à très grande échelle : les modèles écrivent du texte, du code, des images.' },
  f: { name: 'IA agentique', years: '2024 – 2026', c: C.green, tone: 'green', text: 'Les modèles agissent : ils se branchent aux outils (MCP), lisent le dépôt, lancent les tests, ouvrent la PR… en équipes.' },
};

type TlPerson = { n: string; img?: string };
type TlEvent = {
  i: number;
  year: string;
  title: string;
  era: TlEraId;
  img?: string;
  icon?: IconName;
  pic?: string;
  picCap?: string;
  people: TlPerson[];
  text: string;
  fact: string;
};
type TlHover = ({ kind: 'ev' } & TlEvent) | { kind: 'era'; era: TlEraId; cx: number } | null;
const TlCtx = createContext<{ hover: TlHover; set: (h: TlHover) => void }>({ hover: null, set: () => {} });

// Axis geometry (pixel-constant).
const TL_X0 = 210;
const TL_DX = 62.5;
const TL_BAND = 566; // top of the period band (48 px tall)
const tlX = (i: number) => TL_X0 + i * TL_DX;

CSS.push(`
.${P}-tl-w.${P}-on1,.${P}-tl-w.${P}-on2,.${P}-tl-w.${P}-fd1,.${P}-tl-w.${P}-fd2{pointer-events:none}
${at(1)} .${P}-tl-w.${P}-on1,${at(1)} .${P}-tl-w.${P}-fd1,${at(2)} .${P}-tl-w.${P}-on2,${at(2)} .${P}-tl-w.${P}-fd2{pointer-events:auto}
.${P}-tl-ev{cursor:pointer;outline:none;transition:opacity 260ms ${EASE},filter 260ms ${EASE}}
.${P}-tl-dim{opacity:.26;filter:grayscale(.75)}
.${P}-tl-fade{transition:opacity 260ms ${EASE},filter 260ms ${EASE}}
.${P}-tl-thumb{transition:transform 320ms ${EASE_BACK},box-shadow 320ms ${EASE}}
.${P}-tl-on .${P}-tl-thumb{transform:scale(1.24);box-shadow:0 0 0 7px color-mix(in srgb,var(--c) 22%,transparent),0 16px 30px -12px rgba(11,31,92,.6)}
.${P}-tl-title{transition:color 220ms ${EASE}}
.${P}-tl-on .${P}-tl-title{color:var(--c)}
.${P}-tl-stem{transition:opacity 220ms ${EASE},transform 220ms ${EASE}}
.${P}-tl-on .${P}-tl-stem{opacity:1 !important;transform:scaleX(1.7)}
.${P}-tl-dot{transition:transform 260ms ${EASE_BACK},background 220ms ${EASE}}
.${P}-tl-on .${P}-tl-dot{transform:scale(1.6);background:var(--c) !important}
.${P}-tl-era{cursor:help;transition:filter 220ms ${EASE},transform 260ms ${EASE},opacity 260ms ${EASE}}
.${P}-tl-era:hover{filter:brightness(1.15) saturate(1.1);transform:translateY(-3px)}
.${P}-tl-era-dim{opacity:.35}
@keyframes ${P}-tlpop{from{opacity:0;transform:translateY(var(--dy,10px)) scale(.97)}to{opacity:1;transform:none}}
.${P}-tl-pop{animation:${P}-tlpop 240ms ${EASE} both}
`);

const TlThumb = ({ img, icon, c, size }: { img?: string; icon?: IconName; c: string; size: number }) => (
  <div
    className={k('tl-thumb')}
    style={{
      width: size,
      height: size,
      margin: '0 auto',
      borderRadius: '50%',
      boxSizing: 'border-box',
      border: `4px solid ${c}`,
      background: img ? '#fff' : `linear-gradient(140deg, ${c} 0%, ${C.electric} 130%)`,
      color: '#fff',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {img ? (
      <img src={img} alt="" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    ) : icon ? (
      <Icon name={icon} size={size * 0.48} sw={2.2} />
    ) : null}
  </div>
);

// One milestone. Even index → above the axis, odd → below; every other one on a far lane.
const TlEv = ({ beat = 0, ...ev }: TlEvent & { beat?: number }) => {
  const { hover, set } = useContext(TlCtx);
  const x = tlX(ev.i);
  const up = ev.i % 2 === 0;
  const far = up ? ev.i % 4 === 0 : ev.i % 4 === 3;
  const c = TL_ERA[ev.era].c;
  const stem = far ? 172 : 26;
  const top = up ? (far ? 262 : 408) : TL_BAND + 42;
  const on = hover?.kind === 'ev' && hover.i === ev.i;
  const dim = hover !== null && !on && (hover.kind === 'ev' || hover.era !== ev.era);
  const enter = () => set({ kind: 'ev', ...ev });
  const leave = () => set(null);
  const card = (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 22, lineHeight: 1.1, color: c, marginBottom: 6 }}>{ev.year}</div>
      <TlThumb img={ev.img} icon={ev.icon} c={c} size={72} />
      <div
        className={k('tl-title')}
        style={{ fontSize: 19, fontWeight: 700, color: C.ink, lineHeight: 1.25, marginTop: 8, whiteSpace: 'nowrap' }}
      >
        {ev.title}
      </div>
    </div>
  );
  const stemEl = (
    <div style={{ position: 'relative', height: stem }}>
      <div
        className={k('tl-stem')}
        style={{ position: 'absolute', left: 88.5, top: 0, width: 3, height: '100%', background: c, opacity: 0.4 }}
      />
      <div
        className={k('tl-dot')}
        style={{
          position: 'absolute',
          left: 83,
          ...(up ? { bottom: -7 } : { top: -7 }),
          width: 14,
          height: 14,
          borderRadius: '50%',
          boxSizing: 'border-box',
          border: `3px solid ${c}`,
          background: '#fff',
        }}
      />
    </div>
  );
  return (
    <div
      className={cx(k('tl-w'), beat ? b.on(beat) : A.in)}
      style={{ position: 'absolute', left: x - 90, top, width: 180, zIndex: on ? 5 : 1, ...dl(beat ? (ev.i % 6) * 70 : 150 + ev.i * 45) }}
    >
      <div
        className={cx(k('tl-ev'), on && k('tl-on'), dim && k('tl-dim'))}
        style={vars({ c })}
        tabIndex={0}
        onMouseEnter={enter}
        onMouseLeave={leave}
        onFocus={enter}
        onBlur={leave}
      >
        {up ? card : stemEl}
        {up ? stemEl : card}
      </div>
    </div>
  );
};

// One period of the band (chevron), spanning milestones `from`…`to`.
const TlEra = ({ era, from, to, beat = 0, first }: { era: TlEraId; from: number; to: number; beat?: number; first?: boolean }) => {
  const { hover, set } = useContext(TlCtx);
  const e = TL_ERA[era];
  const left = tlX(from) - TL_DX / 2;
  const w = (to - from + 1) * TL_DX;
  const dim = hover?.kind === 'era' && hover.era !== era;
  const tip = 16;
  return (
    <div
      className={cx(beat ? b.fade(beat) : A.fade, k('tl-w'))}
      style={{ position: 'absolute', left: left - (first ? 0 : tip), top: TL_BAND, width: w + (first ? 0 : tip), height: 48, ...dl(beat ? 0 : 300) }}
    >
      <div
        className={cx(k('tl-era'), dim && k('tl-era-dim'))}
        onMouseEnter={() => set({ kind: 'era', era, cx: left + w / 2 })}
        onMouseLeave={() => set(null)}
        style={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(90deg, ${e.c} 0%, color-mix(in srgb, ${e.c} 78%, #fff) 100%)`,
          clipPath: `polygon(0 0, calc(100% - ${tip}px) 0, 100% 50%, calc(100% - ${tip}px) 100%, 0 100%${first ? '' : `, ${tip}px 50%`})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: first ? 0 : tip,
          paddingRight: tip,
          boxSizing: 'border-box',
          fontFamily: display,
          fontWeight: 800,
          fontSize: 16,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#fff',
          whiteSpace: 'nowrap',
        }}
      >
        {e.band ?? e.name}
      </div>
    </div>
  );
};

const TlChip = ({ p, c }: { p: TlPerson; c: string }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: p.img ? '3px 14px 3px 3px' : '5px 14px',
      borderRadius: 999,
      background: '#fff',
      boxShadow: `inset 0 0 0 2px color-mix(in srgb, ${c} 30%, transparent)`,
      fontSize: 18,
      fontWeight: 600,
      color: C.ink,
      whiteSpace: 'nowrap',
    }}
  >
    {p.img ? <img src={p.img} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} /> : null}
    {p.n}
  </span>
);

// Detail card shown on hover — opposite side of the axis from the hovered milestone.
const TlPop = () => {
  const { hover } = useContext(TlCtx);
  if (!hover) return null;
  if (hover.kind === 'era') {
    const e = TL_ERA[hover.era];
    return (
      <div
        key={`era-${hover.era}`}
        className={k('tl-pop')}
        style={{
          position: 'absolute',
          left: Math.min(Math.max(hover.cx - 400, 120), 1000),
          top: TL_BAND + 70,
          width: 800,
          padding: '26px 32px',
          boxSizing: 'border-box',
          borderRadius: 20,
          background: 'rgba(255,255,255,0.97)',
          boxShadow: `${SHADOW}, inset 0 0 0 2px color-mix(in srgb, ${e.c} 35%, transparent)`,
          pointerEvents: 'none',
          zIndex: 20,
          ...vars({ dy: '10px' }),
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 34, color: e.c }}>{e.name}</span>
          <span style={{ fontFamily: mono, fontSize: 20, color: C.muted }}>{e.years}</span>
        </div>
        <div style={{ fontSize: 22, lineHeight: 1.45, color: C.soft, marginTop: 10 }}>{e.text}</div>
      </div>
    );
  }
  const ev = hover;
  const e = TL_ERA[ev.era];
  const x = tlX(ev.i);
  const up = ev.i % 2 === 0;
  const W = 940;
  const left = Math.min(Math.max(x - W / 2, 120), 1800 - W);
  const pic = ev.pic ?? ev.img;
  return (
    <div
      key={`ev-${ev.i}`}
      className={k('tl-pop')}
      style={{
        position: 'absolute',
        left,
        width: W,
        ...(up ? { top: TL_BAND + 62 } : { bottom: 1080 - TL_BAND + 14 }),
        padding: 24,
        boxSizing: 'border-box',
        display: 'flex',
        gap: 28,
        borderRadius: 22,
        background: 'rgba(255,255,255,0.98)',
        boxShadow: `0 0 0 1px rgba(16,24,40,.06), 0 30px 60px -28px rgba(11,31,92,.55), inset 0 0 0 2px color-mix(in srgb, ${e.c} 35%, transparent)`,
        pointerEvents: 'none',
        zIndex: 20,
        ...vars({ dy: up ? '-10px' : '10px' }),
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: x - left - 12,
          ...(up ? { top: -11 } : { bottom: -11 }),
          width: 24,
          height: 24,
          background: '#fff',
          transform: 'rotate(45deg)',
          boxShadow: up ? `inset 2px 2px 0 color-mix(in srgb, ${e.c} 35%, transparent)` : `inset -2px -2px 0 color-mix(in srgb, ${e.c} 35%, transparent)`,
        }}
      />
      <div style={{ flex: 'none', width: 230 }}>
        <div
          style={{
            width: 230,
            height: 230,
            borderRadius: 16,
            overflow: 'hidden',
            background: pic ? '#fff' : `linear-gradient(140deg, ${e.c} 0%, ${C.electric} 130%)`,
            boxShadow: `inset 0 0 0 1px ${C.rule}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
          }}
        >
          {pic ? (
            <img src={pic} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : ev.icon ? (
            <Icon name={ev.icon} size={110} sw={1.8} />
          ) : null}
        </div>
        {ev.picCap ? (
          <div style={{ fontSize: 16, lineHeight: 1.35, color: C.muted, marginTop: 8, fontStyle: 'italic' }}>{ev.picCap}</div>
        ) : null}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: 22,
              color: '#fff',
              background: e.c,
              borderRadius: 8,
              padding: '3px 12px',
            }}
          >
            {ev.year}
          </span>
          <Tag tone={e.tone} size={17}>{e.name}</Tag>
        </div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, lineHeight: 1.15, color: C.navy, marginTop: 8 }}>{ev.title}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {ev.people.map((p) => (
            <TlChip key={p.n} p={p.img === pic ? { n: p.n } : p} c={e.c} />
          ))}
        </div>
        <div style={{ fontSize: 21, lineHeight: 1.45, color: C.soft, marginTop: 12 }}>{ev.text}</div>
        <div
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
            marginTop: 12,
            padding: '10px 14px',
            borderRadius: 12,
            background: T[e.tone].bg,
            color: T[e.tone].fg,
            fontSize: 19,
            lineHeight: 1.4,
          }}
        >
          <Icon name="bulb" size={24} sw={2.2} style={{ flex: 'none', marginTop: 1 }} />
          <span>
            <b>Le saviez-vous ?</b> {ev.fact}
          </span>
        </div>
      </div>
    </div>
  );
};

const M1_IAHistoire: Page = () => {
  const [hover, set] = useState<TlHover>(null);
  return (
    <Frame mod={1} beats={2}>
      <TlCtx.Provider value={{ hover, set }}>
        <Title>L’IA… depuis quand ?</Title>
        <Lede cls={cx(k('tl-fade'), hover && k('tl-dim'))}>80 ans d’histoire, deux hivers, puis une accélération brutale depuis 2017. Survolez un jalon : qui, quoi, pourquoi.</Lede>

        <div style={{ position: 'absolute', left: 178, top: TL_BAND + 20, width: 1566, height: 8, borderRadius: 4, background: C.rule }} />
        <TlEra era="a" from={0} to={4} first />
        <TlEra era="b" from={5} to={6} />
        <TlEra era="c" from={7} to={10} />
        <TlEra era="d" from={11} to={15} />
        <TlEra era="e" from={16} to={21} beat={1} />
        <TlEra era="f" from={22} to={24} beat={2} />

        <TlEv
          i={0}
          year="1943"
          title="Neurone formel"
          era="a"
          img={TLI.pitts}
          people={[{ n: 'Warren McCulloch' }, { n: 'Walter Pitts', img: TLI.pitts }]}
          text="Premier modèle mathématique du neurone : des entrées pondérées, un seuil, une sortie 0 ou 1. L’ancêtre direct de chaque neurone de vos LLM."
          fact="Walter Pitts, génie autodidacte, avait fugué à 15 ans et n’a jamais obtenu de diplôme."
        />
        <TlEv
          i={1}
          year="1950"
          title="Test de Turing"
          era="a"
          img={TLI.turing}
          pic={TLI.bombe}
          picCap="La « Bombe » de Bletchley Park"
          people={[{ n: 'Alan Turing', img: TLI.turing }]}
          text="« Computing Machinery and Intelligence » : plutôt que « une machine peut-elle penser ? », Turing propose un test, le jeu de l’imitation."
          fact="Pendant la guerre, ses « Bombes » électromécaniques ont aidé à casser le chiffre Enigma."
        />
        <TlEv
          i={2}
          year="1956"
          title="Dartmouth"
          era="a"
          img={TLI.mccarthy}
          people={[{ n: 'John McCarthy', img: TLI.mccarthy }, { n: 'Marvin Minsky', img: TLI.minsky }, { n: 'Claude Shannon' }, { n: 'Nathaniel Rochester' }]}
          text="Un atelier d’été au Dartmouth College. John McCarthy y baptise le domaine : « intelligence artificielle »."
          fact="La proposition estimait qu’un été à dix chercheurs suffirait à faire « des progrès significatifs »."
        />
        <TlEv
          i={3}
          year="1957"
          title="Perceptron"
          era="a"
          img={TLI.rosenblatt}
          pic={TLI.markI}
          picCap="Mark I Perceptron (manuel, 1960)"
          people={[{ n: 'Frank Rosenblatt', img: TLI.rosenblatt }]}
          text="Le premier réseau de neurones qui apprend à partir d’exemples, construit en machine : le Mark I Perceptron et sa caméra de 20 × 20 pixels."
          fact="En 1958, le New York Times annonçait une machine qui saurait « marcher, parler, voir… et avoir conscience d’exister »."
        />
        <TlEv
          i={4}
          year="1966"
          title="ELIZA"
          era="a"
          img={TLI.weizenbaum}
          pic={TLI.eliza}
          picCap="Une conversation avec ELIZA"
          people={[{ n: 'Joseph Weizenbaum', img: TLI.weizenbaum }]}
          text="Le premier chatbot : il imite un psychothérapeute en reformulant vos phrases avec de simples règles de motifs. Aucune compréhension."
          fact="Sa secrétaire lui aurait demandé de sortir pour « parler en privé » à ELIZA : c’est l’« effet ELIZA »."
        />
        <TlEv
          i={5}
          year="1969"
          title="Le mur du XOR"
          era="b"
          img={TLI.papert}
          people={[{ n: 'Marvin Minsky', img: TLI.minsky }, { n: 'Seymour Papert', img: TLI.papert }]}
          text="Le livre « Perceptrons » démontre qu’un perceptron à une couche ne sait pas apprendre le XOR. Les crédits fondent : premier hiver de l’IA."
          fact="Au Royaume-Uni, le rapport Lighthill (1973) achève de couper les financements."
        />
        <TlEv
          i={6}
          year="1980"
          title="Systèmes experts"
          era="b"
          img={TLI.feigenbaum}
          pic={TLI.lisp}
          picCap="Machine LISP Symbolics"
          people={[{ n: 'Edward Feigenbaum', img: TLI.feigenbaum }]}
          text="L’IA « symbolique » : des milliers de règles SI… ALORS écrites avec des experts. XCON configure les ordinateurs VAX de DEC."
          fact="Trop coûteux à maintenir, ils s’effondrent avec le marché des machines LISP en 1987 : second hiver."
        />
        <TlEv
          i={7}
          year="1986"
          title="Rétropropagation"
          era="c"
          img={TLI.rumelhart}
          people={[{ n: 'David Rumelhart', img: TLI.rumelhart }, { n: 'Geoffrey Hinton', img: TLI.hinton }, { n: 'Ronald Williams' }]}
          text="L’article de Nature popularise l’algorithme qui entraîne des réseaux à plusieurs couches… et fait sauter le mur du XOR."
          fact="C’est toujours ainsi qu’on entraîne les LLM : mesurer l’erreur, la propager en arrière, ajuster les poids."
        />
        <TlEv
          i={8}
          year="1989"
          title="LeNet · CNN"
          era="c"
          img={TLI.lecun}
          people={[{ n: 'Yann LeCun', img: TLI.lecun }]}
          text="Les réseaux convolutifs reconnaissent les chiffres manuscrits. À la fin des années 90, ils lisent une grande part des chèques aux États-Unis."
          fact="Yann LeCun est français : ingénieur ESIEE Paris, docteur de l’université Pierre-et-Marie-Curie."
        />
        <TlEv
          i={9}
          year="1997"
          title="LSTM"
          era="c"
          img={TLI.schmidhuber}
          people={[{ n: 'Sepp Hochreiter' }, { n: 'Jürgen Schmidhuber', img: TLI.schmidhuber }]}
          text="Une mémoire à long terme pour les réseaux récurrents : la base de la traduction et de la reconnaissance vocale jusqu’en 2017."
          fact="Google Traduction (2016) et la dictée vocale de nos smartphones tournaient sur des LSTM."
        />
        <TlEv
          i={10}
          year="1997"
          title="Deep Blue"
          era="c"
          img={TLI.deepblue}
          picCap="Deep Blue (IBM), Computer History Museum"
          people={[{ n: 'Garry Kasparov', img: TLI.kasparov }, { n: 'Feng-hsiung Hsu' }, { n: 'Murray Campbell' }]}
          text="Deep Blue bat le champion du monde d’échecs 3½ à 2½. Pure force brute : 200 millions de positions par seconde, aucun apprentissage."
          fact="Un coup déroutant, peut-être dû à un bug, aurait déstabilisé Kasparov dès la première partie."
        />
        <TlEv
          i={11}
          year="2006"
          title="Deep learning"
          era="d"
          img={TLI.hinton}
          people={[{ n: 'Geoffrey Hinton', img: TLI.hinton }, { n: 'Yoshua Bengio', img: TLI.bengio }]}
          text="Le pré-entraînement couche par couche permet enfin d’entraîner des réseaux profonds. Le terme « deep learning » s’impose."
          fact="Geoffrey Hinton a reçu le prix Nobel de physique 2024, avec John Hopfield."
        />
        <TlEv
          i={12}
          year="2009"
          title="ImageNet"
          era="d"
          img={TLI.feifeili}
          people={[{ n: 'Fei-Fei Li', img: TLI.feifeili }]}
          text="14 millions d’images annotées à la main via Amazon Mechanical Turk : le jeu de données qui fera décoller la vision par ordinateur."
          fact="Sans données de qualité, pas d’IA : vrai aussi pour le contexte que vous donnez à votre assistant."
        />
        <TlEv
          i={13}
          year="2012"
          title="AlexNet"
          era="d"
          icon="cpu"
          people={[{ n: 'Alex Krizhevsky' }, { n: 'Ilya Sutskever' }, { n: 'Geoffrey Hinton', img: TLI.hinton }]}
          text="Un réseau convolutif entraîné sur deux cartes graphiques écrase le concours ImageNet : 15,3 % d’erreur contre 26,2 % pour le second."
          fact="Il a été entraîné dans la chambre d’Alex Krizhevsky, sur deux GeForce GTX 580 de joueur."
        />
        <TlEv
          i={14}
          year="2014"
          title="GANs"
          era="d"
          img={TLI.goodfellow}
          people={[{ n: 'Ian Goodfellow', img: TLI.goodfellow }]}
          text="Deux réseaux s’affrontent : un faussaire génère, un critique juge. Premiers visages photoréalistes… et premiers deepfakes."
          fact="L’idée lui serait venue lors d’une discussion dans un bar de Montréal ; il l’a codée dans la nuit."
        />
        <TlEv
          i={15}
          year="2016"
          title="AlphaGo"
          era="d"
          img={TLI.alphago}
          picCap="Partie 4 : la seule victoire de Lee Sedol"
          people={[{ n: 'Demis Hassabis', img: TLI.hassabis }, { n: 'David Silver' }, { n: 'Lee Sedol', img: TLI.leesedol }]}
          text="AlphaGo (DeepMind) bat Lee Sedol 4 à 1 au go, jeu réputé hors de portée. Réseaux profonds + apprentissage par renforcement."
          fact="Le coup 37 de la 2ᵉ partie, jugé « inhumain » par les experts, a changé la façon de jouer au go."
        />
        <TlEv
          i={16}
          beat={1}
          year="2017"
          title="Transformer"
          era="e"
          icon="layers"
          pic={TLI.transformer}
          picCap="L’architecture Transformer"
          people={[{ n: 'Ashish Vaswani' }, { n: 'Noam Shazeer' }, { n: '+ 6 co-auteurs (Google)' }]}
          text="« Attention Is All You Need » : le mécanisme d’attention remplace la récurrence et se parallélise sur GPU. C’est le « T » de GPT."
          fact="Les huit auteurs ont tous quitté Google depuis ; la plupart ont fondé leur start-up (Cohere, Character.AI…)."
        />
        <TlEv
          i={17}
          beat={1}
          year="2018"
          title="Prix Turing"
          era="e"
          img={TLI.bengio}
          people={[{ n: 'Yoshua Bengio', img: TLI.bengio }, { n: 'Geoffrey Hinton', img: TLI.hinton }, { n: 'Yann LeCun', img: TLI.lecun }]}
          text="Le « Nobel de l’informatique » consacre les trois « parrains du deep learning ». La même année naissent GPT-1 et BERT."
          fact="Bengio et Hinton sont aujourd’hui parmi les voix les plus fortes pour alerter sur les risques de l’IA."
        />
        <TlEv
          i={18}
          beat={1}
          year="2020"
          title="GPT-3"
          era="e"
          icon="brain"
          people={[{ n: 'Alec Radford' }, { n: 'Ilya Sutskever' }, { n: 'Dario Amodei', img: TLI.amodei }]}
          text="175 milliards de paramètres : sans réentraînement, il suit des exemples donnés dans le prompt (« few-shot »). Le prompt engineering est né."
          fact="GPT-1 (2018) n’avait que 117 millions de paramètres : × 1 500 en deux ans."
        />
        <TlEv
          i={19}
          beat={1}
          year="2021"
          title="GitHub Copilot"
          era="e"
          icon="code"
          people={[{ n: 'GitHub Next' }, { n: 'OpenAI Codex' }, { n: 'Nat Friedman' }]}
          text="Preview en juin 2021 : la complétion de code par IA arrive dans l’IDE. Disponible pour tous les développeurs en juin 2022."
          fact="Codex, le premier modèle derrière Copilot, est un GPT-3 affiné sur le code public de GitHub."
        />
        <TlEv
          i={20}
          beat={1}
          year="2022"
          title="ChatGPT"
          era="e"
          img={TLI.altman}
          people={[{ n: 'Sam Altman', img: TLI.altman }, { n: 'OpenAI' }]}
          text="Lancé le 30 novembre 2022 : 1 million d’utilisateurs en 5 jours, 100 millions en 2 mois. L’IA générative devient grand public."
          fact="En interne, ChatGPT était présenté comme une simple « démo de recherche »."
        />
        <TlEv
          i={21}
          beat={1}
          year="2023"
          title="GPT-4 · Claude"
          era="e"
          img={TLI.amodei}
          people={[{ n: 'Dario Amodei (Anthropic)', img: TLI.amodei }, { n: 'Arthur Mensch (Mistral AI)' }, { n: 'Meta · Llama' }]}
          text="La course aux modèles : GPT-4, Claude, Llama en poids ouverts, Mistral AI côté français. Multimodal et longs contextes arrivent."
          fact="Mistral AI, fondée à Paris en avril 2023, lève 105 M€ quelques semaines plus tard."
        />
        <TlEv
          i={22}
          beat={2}
          year="2024"
          title="MCP"
          era="f"
          icon="plug"
          people={[{ n: 'Anthropic' }, { n: 'David Soria Parra' }, { n: 'Justin Spahr-Summers' }]}
          text="Model Context Protocol (novembre) : un standard ouvert pour brancher les modèles à vos outils, bases et API. L’« USB-C de l’IA »."
          fact="Adopté en 2025 par OpenAI, Google et Microsoft (GitHub Copilot, VS Code)."
        />
        <TlEv
          i={23}
          beat={2}
          year="2025"
          title="Agents de code"
          era="f"
          img={TLI.karpathy}
          people={[{ n: 'Andrej Karpathy', img: TLI.karpathy }, { n: 'Claude Code' }, { n: 'Codex' }, { n: 'Copilot Agent' }]}
          text="Les agents lisent le dépôt, éditent plusieurs fichiers, lancent les tests et ouvrent la PR. Karpathy invente le « vibe coding »."
          fact="« Vibe coding » a été élu mot de l’année 2025 par le dictionnaire Collins."
        />
        <TlEv
          i={24}
          beat={2}
          year="2026"
          title="Équipes d’agents"
          era="f"
          icon="users"
          people={[{ n: 'Vous, chef d’orchestre' }]}
          text="Plusieurs agents spécialisés (architecte, dev, testeur, relecteur) orchestrés ensemble, avec une facturation à l’usage."
          fact="Votre valeur se déplace : cadrer, découper, vérifier. Ces deux jours en posent les bases."
        />

        <div
          className={A.fade}
          style={{
            position: 'absolute',
            left: 120,
            top: 940,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 20,
            color: C.muted,
            ...dl(1400),
          }}
        >
          <Icon name="pointer" size={24} sw={2.2} color={C.blue} />
          Survolez un jalon pour sa fiche (personnes, contexte, anecdote) · survolez une période pour son résumé.
        </div>
        <TlPop />
      </TlCtx.Provider>
    </Frame>
  );
};

// ═══ 12-m1-llm ═════════════════════════════════════════════════════════

// ─── Module 1 · Sous le capot (suite) : ML, réseaux, entraînement, tokens, Transformer, ───
// génération probabiliste, hallucinations, agents, prompt / contexte / harnais.
// Les pages sont listées (et commentées) dans 10-m1.tsx, dans l’ordre du module.

CSS.push(`
.${P}-nn-e{stroke:${C.rule};stroke-opacity:.6;stroke-width:2}
.${P}-nn-n{fill:#fff;stroke:${C.navy};stroke-width:3}
@keyframes ${P}-nnflash{0%{stroke:${C.rule};stroke-opacity:.6}35%{stroke:${C.electric};stroke-opacity:1;stroke-width:3.6}100%{stroke:${C.rule};stroke-opacity:.6}}
@keyframes ${P}-nnnode{0%{fill:#fff}35%{fill:${C.electric}}100%{fill:#fff}}
.${P}-nn-go .${P}-nn-e{animation:${P}-nnflash 950ms ${EASE} var(--d,0ms) both}
.${P}-nn-go .${P}-nn-n{animation:${P}-nnnode 950ms ${EASE} var(--d,0ms) both}
@keyframes ${P}-arcdraw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
.${P}-arc{stroke-dasharray:1;animation:${P}-arcdraw 650ms ${EASE} var(--d,0ms) both}
@keyframes ${P}-tokpop{0%{opacity:0;transform:translateY(16px) scale(.8)}100%{opacity:1;transform:none}}
.${P}-tok{animation:${P}-tokpop 460ms ${EASE_BACK} var(--d,0ms) both}
@keyframes ${P}-swap{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.${P}-swap{animation:${P}-swap 480ms ${EASE} var(--d,0ms) both}
.${P}-ball{transition:transform 420ms ${EASE_BACK}}
.${P}-layer{cursor:pointer;transition:box-shadow 320ms ${EASE},transform 320ms ${EASE}}
.${P}-agnode{transition:transform 380ms ${EASE_BACK},box-shadow 320ms ${EASE},opacity 320ms ${EASE}}
`);

// Boutons « onglets » réutilisés par plusieurs pages.
const MTabs = ({ items, cur, set, size = 21 }: { items: string[]; cur: number; set: (i: number) => void; size?: number }) => (
  <div style={{ display: 'flex', gap: 12 }}>
    {items.map((t, i) => (
      <Btn key={t} size={size} tone="blue" ghost={i !== cur} onClick={() => set(i)}>
        {t}
      </Btn>
    ))}
  </div>
);

// ─── IA ⊃ machine learning ⊃ deep learning ⊃ LLM ───────────────────────────
const MRing = ({ d, tone, label, cls, solid = false, pt = 22, size = 27 }: { d: number; tone: Tone; label: string; cls: string; solid?: boolean; pt?: number; size?: number }) => (
  <div
    className={cls}
    style={{
      position: 'absolute',
      left: 470 - d / 2,
      top: 630 - d / 2,
      width: d,
      height: d,
      boxSizing: 'border-box',
      borderRadius: '50%',
      background: solid ? G.blue : T[tone].bg,
      boxShadow: solid ? '0 18px 40px -18px rgba(30,34,232,.7)' : `inset 0 0 0 3px ${T[tone].bd}`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: solid ? 'center' : 'flex-start',
      paddingTop: solid ? 0 : pt,
    }}
  >
    <span style={{ fontFamily: display, fontWeight: 800, fontSize: size, lineHeight: 1.1, color: solid ? '#fff' : T[tone].fg, textAlign: 'center' }}>{label}</span>
  </div>
);

const MDef = ({ tone, term, years, children, cls }: { tone: Tone; term: string; years: string; children: ReactNode; cls: string }) => (
  <div className={cls} style={{ display: 'grid', gridTemplateColumns: '20px minmax(0, 1fr)', gap: 18, alignItems: 'start' }}>
    <span style={{ marginTop: 9, width: 20, height: 20, borderRadius: 99, background: STRONG[tone] }} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>
        {term} <span style={{ fontFamily: mono, fontSize: 19, fontWeight: 500, color: C.muted }}>{years}</span>
      </div>
      <div style={{ marginTop: 2, fontSize: 21, lineHeight: 1.35, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const MChip = ({ children, tone, d }: { children: ReactNode; tone: Tone; d: number }) => (
  <div className={k('swap')} style={{ ...dl(d), padding: '10px 14px', borderRadius: 12, background: T[tone].bg, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, color: T[tone].fg, fontSize: 20, fontWeight: 600, textAlign: 'center' }}>
    {children}
  </div>
);

const M1_IAMLDL: Page = () => {
  const [ml, setMl] = useState(false);
  return (
    <Frame mod={1} beats={3}>
      <Title>IA, machine learning, deep learning, LLM : emboîtés</Title>
      <Lede>Chaque cercle est un cas particulier du précédent. Copilot vit dans le plus petit.</Lede>
      <MRing d={700} tone="navy" label="Intelligence artificielle" cls={A.pop} pt={42} size={24} />
      <MRing d={540} tone="blue" label="Machine learning" cls={b.pop(1)} />
      <MRing d={380} tone="violet" label="Deep learning" cls={b.pop(2)} />
      <MRing d={220} tone="blue" label="LLM" cls={b.pop(3)} solid size={40} />
      <div style={{ position: 'absolute', left: 900, top: 280, width: 900, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <MDef tone="navy" term="Intelligence artificielle" years="depuis 1956" cls={A.right}>
          Des machines qui accomplissent des tâches dites « intelligentes ».
        </MDef>
        <MDef tone="blue" term="Machine learning" years="années 1990" cls={b.on(1)}>
          Au lieu d’écrire les règles, on les fait apprendre à partir d’exemples.
        </MDef>
        <MDef tone="violet" term="Deep learning" years="depuis 2012" cls={b.on(2)}>
          L’apprentissage avec des réseaux de neurones à très nombreuses couches.
        </MDef>
        <MDef tone="pink" term="LLM (grand modèle de langage)" years="depuis 2018" cls={b.on(3)}>
          Un réseau géant entraîné sur du texte et du code : GPT, Claude, Gemini…
        </MDef>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 900, top: 610, width: 900, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 16, ...dl(300) }}>
        <PanelTitle icon="loop">Programmer ou apprendre ? Cliquez</PanelTitle>
        <MTabs items={['Programmation classique', 'Machine learning']} cur={ml ? 1 : 0} set={(i) => setMl(i === 1)} size={19} />
        <div key={ml ? 'ml' : 'cl'} style={{ display: 'grid', gridTemplateColumns: '240px 36px 210px 36px minmax(0, 1fr)', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <MChip tone={ml ? 'blue' : 'navy'} d={0}>
              {ml ? 'Des données' : 'Des règles écrites par vous'}
            </MChip>
            <MChip tone={ml ? 'green' : 'blue'} d={90}>
              {ml ? 'Les réponses attendues' : 'Des données'}
            </MChip>
          </div>
          <Icon name="arrow" size={32} color={C.faint} sw={2.4} />
          <div className={k('swap')} style={{ ...dl(180), height: 124, borderRadius: 16, background: ml ? G.blue : G.navy, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 22, fontWeight: 700 }}>
            <Icon name={ml ? 'brain' : 'code'} size={34} sw={2.2} />
            {ml ? 'Entraînement' : 'Programme'}
          </div>
          <Icon name="arrow" size={32} color={C.faint} sw={2.4} />
          <MChip tone={ml ? 'violet' : 'green'} d={280}>
            {ml ? 'Des règles apprises : le modèle' : 'Des réponses'}
          </MChip>
        </div>
        <div key={ml ? 'mlc' : 'clc'} className={k('swap')} style={{ ...dl(360), fontSize: 20, color: C.soft }}>
          {ml ? (
            <>10 000 tickets déjà triés → le modèle apprend seul à trier les suivants.</>
          ) : (
            <>
              <span style={{ fontFamily: mono, fontSize: 19, color: C.ink }}>{"if (titre.includes('bloquant')) priorite = 'haute'"}</span> : une règle à la fois.
            </>
          )}
        </div>
      </div>
    </Frame>
  );
};

// ─── Neurone et réseau de neurones ──────────────────────────────────────────
const NEU_IN = [
  { label: 'Client bloqué', w: 0.7 },
  { label: 'En production', w: 0.5 },
  { label: 'Simple faute de frappe', w: -0.6 },
];
const NEU_BIAS = -0.6;
const NEU_Y = [90, 200, 310];
const NEU_X0 = 400;
const NEU_CX = 610;
const NEU_CY = 200;

const NN_LAYERS = [4, 6, 6, 3];
const NN_X = [70, 250, 430, 610];
const nnY = (n: number, j: number) => 190 + (j - (n - 1) / 2) * 60;

const M1_Neurones: Page = () => {
  const [x, setX] = useState([1, 0, 0]);
  const [wave, setWave] = useState(0);
  const z = NEU_IN.reduce((s, e, i) => s + e.w * x[i], NEU_BIAS);
  const p = 1 / (1 + Math.exp(-8 * z));
  const urgent = p >= 0.5;
  const sgn = (v: number) => (v < 0 ? '−' : '+');
  return (
    <Frame mod={1} beats={2}>
      <Title>Un neurone artificiel : multiplier, additionner, décider</Title>
      <Lede>Exemple jouet : un neurone qui décide si un ticket est urgent. Activez les entrées.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 900, height: 470, background: C.card, borderRadius: 20, boxShadow: SHADOW }}>
        <svg width={900} height={470} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
          {NEU_IN.map((e, i) => {
            const on = x[i] === 1;
            const col = e.w > 0 ? C.green : C.coral;
            return (
              <g key={e.label}>
                <line x1={NEU_X0} y1={NEU_Y[i]} x2={NEU_CX} y2={NEU_CY} stroke={on ? col : C.rule} strokeWidth={2 + Math.abs(e.w) * 9} strokeLinecap="round" style={{ transition: 'stroke 300ms ease' }} />
                <circle cx={NEU_X0} cy={NEU_Y[i]} r={14} fill={on ? col : '#fff'} stroke={col} strokeWidth={3} style={{ transition: 'fill 300ms ease' }} />
                <text x={NEU_X0 + 52} y={NEU_Y[i] + (NEU_CY - NEU_Y[i]) * 0.28 - 12} fontFamily={mono} fontSize={21} fontWeight={700} fill={col} stroke="#fff" strokeWidth={6} paintOrder="stroke">
                  ×{fr(e.w, 1)}
                </text>
              </g>
            );
          })}
          <line x1={NEU_CX} y1={NEU_CY} x2={725} y2={NEU_CY} stroke={urgent ? C.coral : C.green} strokeWidth={6} strokeLinecap="round" />
          <circle cx={NEU_CX} cy={NEU_CY} r={64} fill={C.electric} fillOpacity={0.12 + 0.88 * p} stroke={C.navy} strokeWidth={3} style={{ transition: 'fill-opacity 400ms ease' }} />
          <text x={NEU_CX} y={NEU_CY + 16} textAnchor="middle" fontFamily={display} fontWeight={800} fontSize={46} fill={p > 0.5 ? '#fff' : C.navy}>
            Σ
          </text>
        </svg>
        {NEU_IN.map((e, i) => (
          <div key={e.label} style={{ position: 'absolute', left: 28, top: NEU_Y[i] - 22, width: 345 }}>
            <Toggle on={x[i] === 1} onChange={(v) => setX((o) => o.map((u, j) => (j === i ? (v ? 1 : 0) : u)))} label={e.label} tone={e.w > 0 ? 'green' : 'coral'} size={23} />
          </div>
        ))}
        <div style={{ position: 'absolute', left: 735, top: NEU_CY - 52, width: 140, height: 104, borderRadius: 16, background: urgent ? T.coral.bg : T.green.bg, boxShadow: `inset 0 0 0 3px ${urgent ? C.coral : C.green}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'all 300ms ease' }}>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: urgent ? T.coral.fg : T.green.fg }}>{urgent ? 'URGENT' : 'normal'}</span>
          <span style={{ fontFamily: mono, fontSize: 21, color: C.soft }}>{fr(p * 100, 0)} %</span>
        </div>
        <div style={{ position: 'absolute', left: 28, top: 392, right: 28, fontFamily: mono, fontSize: 22, color: C.ink, background: C.panel, borderRadius: 12, padding: '12px 16px' }}>
          Σ = {NEU_IN.map((e, i) => `${i ? ` ${sgn(e.w)} ` : e.w < 0 ? '−' : ''}${fr(Math.abs(e.w), 1)}×${x[i]}`).join('')} − {fr(Math.abs(NEU_BIAS), 1)} = <strong style={{ color: urgent ? C.coral : C.green }}>{z >= 0 ? '+' : '−'}{fr(Math.abs(z), 1)}</strong>
        </div>
      </div>
      <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 770, width: 900 }}>
        <Callout tone="blue" icon="bulb" title="Ce que fait l’entraînement" size={22}>
          Les poids (0,7 ; 0,5 ; −0,6) ne sont écrits par personne : l’entraînement les trouve. Un LLM, c’est ce calcul répété des milliards de fois.
        </Callout>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1080, top: 270, width: 720, height: 560, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 20px', ...dl(250) }}>
        <PanelTitle icon="brain">Un réseau = des couches de neurones</PanelTitle>
        <svg width={680} height={380} style={{ display: 'block', marginTop: 8 }}>
          <g key={wave} className={wave ? k('nn-go') : undefined}>
            {NN_LAYERS.slice(0, -1).map((n, l) =>
              Array.from({ length: n }, (_, a) =>
                Array.from({ length: NN_LAYERS[l + 1] }, (_, c) => (
                  <line key={`${l}-${a}-${c}`} className={k('nn-e')} x1={NN_X[l]} y1={nnY(n, a)} x2={NN_X[l + 1]} y2={nnY(NN_LAYERS[l + 1], c)} style={dl(l * 300)} />
                )),
              ),
            )}
            {NN_LAYERS.map((n, l) => Array.from({ length: n }, (_, a) => <circle key={`n${l}-${a}`} className={k('nn-n')} cx={NN_X[l]} cy={nnY(n, a)} r={15} style={dl(l * 300)} />))}
          </g>
        </svg>
        <div style={{ display: 'grid', gridTemplateColumns: '150px minmax(0, 1fr) 150px', fontSize: 19, color: C.muted, textAlign: 'center' }}>
          <span>entrées</span>
          <span>couches cachées</span>
          <span>sortie</span>
        </div>
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center' }}>
          <Btn icon="bolt" size={21} onClick={() => setWave((w) => w + 1)}>
            Propager un signal
          </Btn>
        </div>
      </div>
      <div className={b.on(2)} style={{ position: 'absolute', left: 1080, top: 850, width: 720, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20 }}>
        <div style={{ background: T.violet.bg, borderRadius: 16, padding: '14px 20px' }}>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 36, color: T.violet.fg }}>175 Md</div>
          <div style={{ fontSize: 19, color: C.soft }}>de poids dans GPT-3 (2020)</div>
        </div>
        <div style={{ background: T.blue.bg, borderRadius: 16, padding: '14px 20px' }}>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 36, color: T.blue.fg }}>96 couches</div>
          <div style={{ fontSize: 19, color: C.soft }}>empilées ; les modèles de 2026 sont plus grands</div>
        </div>
      </div>
    </Frame>
  );
};

// ─── Entraînement : descente de gradient + 3 phases ─────────────────────────
const LOSS = (w: number) => 3.2 * (w - 0.68) ** 2 + 0.04;
const GX = (w: number) => 30 + w * 780;
const GY = (l: number) => 280 - (l / 1.6) * 250;
const LOSS_PATH = Array.from({ length: 61 }, (_, i) => `${i ? 'L' : 'M'}${GX(i / 60).toFixed(1)} ${GY(LOSS(i / 60)).toFixed(1)}`).join(' ');
type GdState = { w: number; n: number; trail: number[] };
const GD0: GdState = { w: 0.04, n: 0, trail: [] };

const M1_Entrainement: Page = () => {
  const [s, setS] = useState<GdState>(GD0);
  const [lr, setLr] = useState(0.1);
  const lrRef = useRef(lr);
  lrRef.current = lr;
  const pas = () =>
    setS((o) => {
      const w = Math.min(1, Math.max(0, o.w - lrRef.current * 6.4 * (o.w - 0.68)));
      return { w, n: o.n + 1, trail: [...o.trail.slice(-14), o.w] };
    });
  const dix = () => {
    for (let i = 0; i < 10; i++) window.setTimeout(pas, i * 190);
  };
  const verdict = lr < 0.06 ? { t: 'lent', tone: 'yellow' as Tone } : lr < 0.2 ? { t: 'efficace', tone: 'green' as Tone } : lr < 0.3 ? { t: 'ça oscille', tone: 'yellow' as Tone } : { t: 'ça diverge !', tone: 'coral' as Tone };
  return (
    <Frame mod={1} beats={4}>
      <Title>Entraîner un modèle : réduire l’erreur, pas à pas</Title>
      <Lede>Deviner le token suivant, mesurer l’erreur, ajuster les poids… des milliers de milliards de fois.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 900, height: 550, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 30px' }}>
        <PanelTitle icon="trend">Descente de gradient (version jouet)</PanelTitle>
        <svg width={840} height={300} style={{ display: 'block', marginTop: 6 }}>
          <line x1={GX(0.68)} y1={20} x2={GX(0.68)} y2={290} stroke={C.green} strokeWidth={2} strokeDasharray="6 8" />
          <text x={GX(0.68) + 10} y={40} fontSize={19} fill={C.green} fontWeight={700}>
            erreur minimale
          </text>
          <path d={LOSS_PATH} fill="none" stroke={C.navy} strokeWidth={4} strokeLinecap="round" />
          <text x={36} y={30} fontSize={18} fill={C.muted}>
            erreur ↑
          </text>
          <text x={640} y={296} fontSize={18} fill={C.muted}>
            valeur d’un poids →
          </text>
          {s.trail.map((w, i) => (
            <circle key={`${s.n}-${i}`} cx={GX(w)} cy={GY(LOSS(w))} r={6} fill={C.violet} fillOpacity={0.15 + (i / Math.max(1, s.trail.length)) * 0.45} />
          ))}
          <g className={k('ball')} style={{ transform: `translate(${GX(s.w)}px, ${GY(LOSS(s.w))}px)` }}>
            <circle r={17} fill={C.coral} stroke="#fff" strokeWidth={4} />
          </g>
        </svg>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Btn icon="play" size={20} onClick={pas}>
            Un pas
          </Btn>
          <Btn icon="loop" size={20} ghost onClick={dix}>
            10 pas
          </Btn>
          <Btn icon="reset" size={20} ghost tone="grey" onClick={() => setS(GD0)} />
          <span style={{ marginLeft: 'auto', fontFamily: mono, fontSize: 21, color: C.soft }}>
            étape <strong style={{ color: C.ink }}>{s.n}</strong> · erreur <strong style={{ color: LOSS(s.w) < 0.08 ? C.green : C.coral }}>{fr(LOSS(s.w), 2)}</strong>
          </span>
        </div>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 20, color: C.soft, whiteSpace: 'nowrap' }}>Taux d’apprentissage</span>
          <Range value={lr} onChange={setLr} min={0.02} max={0.32} step={0.02} w={330} />
          <span style={{ fontFamily: mono, fontSize: 20, color: C.ink }}>{fr(lr, 2)}</span>
          <Tag tone={verdict.tone} size={18}>
            {verdict.t}
          </Tag>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 1080, top: 280, width: 720, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card tone="navy" icon="database" title="1 · Pré-entraînement" size={20} pad={18} cls={b.on(1)}>
          Prédire le token suivant sur des milliers de milliards de tokens : web, livres, code public. Des semaines sur des milliers de GPU.
        </Card>
        <Card tone="blue" icon="chat" title="2 · Affinage par instructions" size={20} pad={18} cls={b.on(2)}>
          Des exemples « consigne → bonne réponse » : il apprend à suivre une demande et à converser.
        </Card>
        <Card tone="violet" icon="humanCheck" title="3 · Alignement (RLHF)" size={20} pad={18} cls={b.on(3)}>
          Des humains comparent des réponses ; il apprend à préférer les plus utiles et les plus sûres.
        </Card>
      </div>
      <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 860, width: 1680 }}>
        <Callout tone="coral" icon="lock" title="Ensuite, les poids sont figés" size={23}>
          Le modèle n’apprend pas pendant votre session et ses connaissances s’arrêtent à une date de coupure. Ce qu’il « sait » de votre projet vient uniquement du contexte envoyé.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Tokens ─────────────────────────────────────────────────────────────────
const TOK_SAMPLES = [
  { label: 'Du code', text: "const urgents = tickets.filter(t => t.priorite === 'haute');", toks: ['const', ' urg', 'ents', ' =', ' tickets', '.filter', '(t', ' =>', ' t', '.prior', 'ite', ' ===', " '", 'ha', 'ute', "');"] },
  { label: 'Du français', text: 'Le ticket bloque la mise en production depuis hier.', toks: ['Le', ' ticket', ' blo', 'que', ' la', ' mise', ' en', ' production', ' depuis', ' hier', '.'] },
  { label: 'La même chose en anglais', text: 'The ticket has been blocking the release since yesterday.', toks: ['The', ' ticket', ' has', ' been', ' blocking', ' the', ' release', ' since', ' yesterday', '.'] },
  { label: 'Un identifiant', text: 'getTicketsByPriorityAndStatus', toks: ['get', 'Tickets', 'By', 'Priority', 'And', 'Status'] },
];
const TOK_TONES: Tone[] = ['blue', 'violet', 'green', 'yellow', 'pink'];
const tokId = (t: string) => {
  let h = 7;
  for (const c of t) h = (h * 31 + c.charCodeAt(0)) % 99991;
  return h + 100;
};

const M1_Tokens: Page = () => {
  const [cur, setCur] = useState(0);
  const [ids, setIds] = useState(false);
  const s = TOK_SAMPLES[cur];
  return (
    <Frame mod={1} beats={1}>
      <Title>Le modèle ne lit pas des mots : il lit des tokens</Title>
      <Lede>Un token est un morceau de mot. Choisissez un texte pour voir son découpage (illustratif).</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 268 }}>
        <MTabs items={TOK_SAMPLES.map((x) => x.label)} cur={cur} set={setCur} size={20} />
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 344, width: 1680, height: 300, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px', ...dl(120) }}>
        <div key={cur} style={{ minHeight: 180 }}>
          {s.toks.map((t, i) => {
            const tn = T[TOK_TONES[i % TOK_TONES.length]];
            return (
              <span key={`${cur}-${i}`} className={k('tok')} style={{ ...dl(i * 55), display: 'inline-flex', flexDirection: 'column', alignItems: 'center', margin: '0 6px 12px 0', verticalAlign: 'top' }}>
                <span style={{ fontFamily: mono, fontSize: 34, color: C.ink, whiteSpace: 'pre', padding: '5px 10px', borderRadius: 10, background: tn.bg, boxShadow: `inset 0 0 0 2px ${tn.bd}` }}>{t.replace(/^ /, '·')}</span>
                <span style={{ fontFamily: mono, fontSize: 18, color: C.muted, marginTop: 4, visibility: ids ? 'visible' : 'hidden' }}>{tokId(t)}</span>
              </span>
            );
          })}
        </div>
        <div style={{ position: 'absolute', left: 28, right: 28, bottom: 20, display: 'flex', alignItems: 'center', gap: 28, fontSize: 22, color: C.soft }}>
          <span>
            <strong style={{ color: C.ink }}>{s.text.length}</strong> caractères
          </span>
          <span>
            <strong style={{ color: C.electric }}>{s.toks.length}</strong> tokens
          </span>
          <span>
            ≈ <strong style={{ color: C.ink }}>{fr(s.text.length / s.toks.length, 1)}</strong> caractères par token
          </span>
          <span style={{ marginLeft: 'auto' }}>
            <Toggle on={ids} onChange={setIds} label="Ce que voit le modèle : des nombres" tone="violet" size={21} />
          </span>
        </div>
      </div>
      <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 680, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 28 }}>
        <Card tone="yellow" icon="euro" title="La facture" size={21} pad={24}>
          Les crédits IA du chat et des agents se calculent en tokens, en entrée comme en sortie.
        </Card>
        <Card tone="blue" icon="layers" title="La limite" size={21} pad={24}>
          La fenêtre de contexte se mesure en tokens : au-delà, le modèle oublie ou on résume.
        </Card>
        <Card tone="coral" icon="eyeOff" title="Les angles morts" size={21} pad={24}>
          Compter des lettres, épeler, calculer : il voit des morceaux, pas des caractères.
        </Card>
      </div>
    </Frame>
  );
};

// ─── Transformer : l’attention ──────────────────────────────────────────────
type AttMap = Record<number, [number, number][]>;
const ATT_SETS: { label: string; words: string[]; att: AttMap; why: Record<number, string>; def: number }[] = [
  {
    label: 'Une phrase',
    words: ['Le', 'serveur', 'refuse', 'le', 'ticket', 'car', 'il', 'est', 'trop', 'long'],
    att: {
      6: [[4, 0.62], [1, 0.22], [2, 0.08], [9, 0.08]],
      9: [[4, 0.48], [6, 0.28], [8, 0.16], [1, 0.08]],
      2: [[1, 0.52], [4, 0.3], [6, 0.1], [9, 0.08]],
    },
    why: {
      6: '« il » regarde surtout « ticket » : le modèle comprend que c’est le ticket qui est trop long, pas le serveur.',
      9: '« long » se rattache à « ticket » et à « il » : c’est une propriété du ticket.',
      2: '« refuse » cherche qui agit (« serveur ») et sur quoi (« ticket »).',
    },
    def: 6,
  },
  {
    label: 'Du code',
    words: ['tickets', '.filter', '(', 't', '=>', 't', '.statut', '===', "'fini'", ')'],
    att: {
      5: [[0, 0.5], [3, 0.3], [1, 0.12], [6, 0.08]],
      8: [[6, 0.58], [7, 0.22], [5, 0.12], [0, 0.08]],
      6: [[5, 0.46], [0, 0.32], [8, 0.14], [1, 0.08]],
    },
    why: {
      5: '« t » renvoie à un élément de « tickets » : voilà pourquoi Copilot propose ensuite des champs de ticket.',
      8: '« \'fini\' » regarde « .statut » : la valeur proposée doit ressembler à un statut.',
      6: '« .statut » regarde « t » et « tickets » : il cherche quels champs existent.',
    },
    def: 5,
  },
];
const ATT_CW = 18;
const ATT_GAP = 22;
const attLayout = (words: string[]) => {
  const ws = words.map((w) => w.length * ATT_CW + 30);
  const total = ws.reduce((a, x) => a + x, 0) + ATT_GAP * (words.length - 1);
  let x = (1680 - total) / 2;
  return ws.map((w) => {
    const r = { x, w, c: x + w / 2 };
    x += w + ATT_GAP;
    return r;
  });
};
const attOf = (set: (typeof ATT_SETS)[number], i: number): [number, number][] => {
  if (set.att[i]) return set.att[i];
  const out: [number, number][] = [];
  if (i > 0) out.push([i - 1, 0.5]);
  if (i < set.words.length - 1) out.push([i + 1, 0.3]);
  if (i > 1) out.push([0, 0.2]);
  return out;
};

const M1_Transformer: Page = () => {
  const [si, setSi] = useState(0);
  const set = ATT_SETS[si];
  const [sel, setSel] = useState<number>(ATT_SETS[0].def);
  const pos = attLayout(set.words);
  const arcs = attOf(set, sel);
  const wOf = (j: number) => arcs.find(([t]) => t === j)?.[1] ?? 0;
  const Y0 = 262;
  return (
    <Frame mod={1} beats={1}>
      <Title>Le Transformer : chaque token regarde tous les autres</Title>
      <Lede>C’est le mécanisme d’attention (Google, 2017, « Attention Is All You Need »). Cliquez un mot : vers qui regarde-t-il ?</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 268 }}>
        <MTabs
          items={ATT_SETS.map((x) => x.label)}
          cur={si}
          set={(i) => {
            setSi(i);
            setSel(ATT_SETS[i].def);
          }}
          size={20}
        />
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 330, width: 1680, height: 400, background: C.card, borderRadius: 20, boxShadow: SHADOW, ...dl(120) }}>
        <svg width={1680} height={400} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
          {arcs.map(([t, w], r) => {
            const a = pos[sel].c;
            const c = pos[t].c;
            const h = Math.min(230, 50 + Math.abs(a - c) * 0.45);
            return (
              <path
                key={`${si}-${sel}-${t}`}
                className={k('arc')}
                pathLength={1}
                d={`M${a} ${Y0} Q${(a + c) / 2} ${Y0 - h} ${c} ${Y0}`}
                fill="none"
                stroke={C.violet}
                strokeOpacity={0.35 + 0.65 * w}
                strokeWidth={3 + w * 24}
                strokeLinecap="round"
                style={dl(r * 120)}
              />
            );
          })}
        </svg>
        {set.words.map((wd, j) => {
          const w = wOf(j);
          const me = j === sel;
          return (
            <div key={`${si}-${j}`} style={{ position: 'absolute', left: pos[j].x, top: 270, width: pos[j].w }}>
              <button
                type="button"
                data-osd-interactive
                onClick={(e) => {
                  e.currentTarget.blur();
                  setSel(j);
                }}
                style={{
                  width: '100%',
                  height: 60,
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 12,
                  fontFamily: mono,
                  fontSize: 30,
                  fontWeight: 600,
                  color: me ? '#fff' : C.ink,
                  background: me ? C.electric : w ? `color-mix(in srgb, ${C.violet} ${Math.round(12 + w * 60)}%, #fff)` : C.panel,
                  boxShadow: me ? '0 10px 24px -12px rgba(30,34,232,.8)' : 'none',
                  transition: 'background 300ms ease, color 300ms ease',
                }}
              >
                {wd}
              </button>
              <div style={{ marginTop: 8, textAlign: 'center', fontFamily: mono, fontSize: 19, fontWeight: 700, color: C.violet, visibility: w ? 'visible' : 'hidden' }}>{fr(w * 100, 0)} %</div>
            </div>
          );
        })}
      </div>
      <div key={`${si}-${sel}`} className={k('swap')} style={{ position: 'absolute', left: 120, top: 748, width: 1680, display: 'flex', gap: 14, alignItems: 'center', fontSize: 23, color: C.soft }}>
        <Icon name="eye" size={28} color={C.violet} sw={2.2} />
        <span>{set.why[sel] ?? 'Sans lien fort : ce mot regarde surtout ses voisins.'}</span>
      </div>
      <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 820, width: 1680, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 36px minmax(0,1fr) 36px minmax(0,1fr) 36px minmax(0,1fr) 36px minmax(0,1fr)', alignItems: 'center', gap: 6 }}>
        {(
          [
            ['code', 'Tokens', 'le texte découpé', 'navy'],
            ['layers', 'Vecteurs', 'chaque token devient une liste de nombres', 'blue'],
            ['brain', '× N couches', 'attention + calcul, des dizaines de fois', 'violet'],
            ['chart', 'Probabilités', 'pour chaque token possible', 'pink'],
            ['loop', 'Un token choisi', 'ajouté au texte… et on recommence', 'green'],
          ] as [IconName, string, string, Tone][]
        ).flatMap(([ic, t, s2, tone], i) => [
          i ? <Icon key={`a${i}`} name="arrow" size={28} color={C.faint} sw={2.4} /> : null,
          <div key={t} style={{ height: 140, boxSizing: 'border-box', background: T[tone].bg, borderRadius: 16, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, fontWeight: 700, color: T[tone].fg }}>
              <Icon name={ic} size={26} sw={2.2} /> {t}
            </div>
            <div style={{ fontSize: 19, lineHeight: 1.35, color: C.soft }}>{s2}</div>
          </div>,
        ])}
      </div>
    </Frame>
  );
};

// ─── Génération probabiliste + température ──────────────────────────────────
const GEN_CANDS = [
  { tok: ' maintenant', p: 0.46, v: 'ok' },
  { tok: ' new Date()', p: 0.3, v: 'warn' },
  { tok: ' Date.now()', p: 0.12, v: 'warn' },
  { tok: ' ticket.creeLe', p: 0.07, v: 'bad' },
  { tok: ' aujourdhui', p: 0.05, v: 'bad2' },
];
const GEN_VERDICT: Record<string, { t: string; tone: Tone }> = {
  ok: { t: 'correct', tone: 'green' },
  warn: { t: 'ignore le paramètre', tone: 'yellow' },
  bad: { t: 'logique fausse', tone: 'coral' },
  bad2: { t: 'variable inventée', tone: 'coral' },
};

const GenCand = ({ i, probs, picked }: { i: number; probs: number[]; picked: number | null }) => {
  const c = GEN_CANDS[i];
  const v = GEN_VERDICT[c.v];
  const pct = probs[i] * 100;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 62 }}>
      <span style={{ width: 270, flex: 'none', fontFamily: mono, fontSize: 24, color: picked === i ? '#fff' : C.ink, background: picked === i ? C.electric : C.panel, borderRadius: 10, padding: '8px 12px', transition: 'all 250ms ease' }}>
        {c.tok.replace(' ', '·')}
      </span>
      <div style={{ flex: 1, height: 30, borderRadius: 8, background: C.panel, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: STRONG[v.tone], transition: `width 400ms ${EASE}` }} />
      </div>
      <span style={{ width: 92, flex: 'none', textAlign: 'right', fontFamily: display, fontWeight: 800, fontSize: 26, color: C.ink }}>{fr(pct, 0)} %</span>
      <span style={{ width: 250, flex: 'none' }}>
        <Tag tone={v.tone} size={18}>
          {v.t}
        </Tag>
      </span>
    </div>
  );
};

const M1_Generation: Page = () => {
  const [temp, setTemp] = useState(0.7);
  const [picked, setPicked] = useState<number | null>(null);
  const [hist, setHist] = useState<number[]>([]);
  const w = GEN_CANDS.map((c) => c.p ** (1 / Math.max(0.05, temp)));
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
  const bad = hist.filter((i) => GEN_CANDS[i].v !== 'ok').length;
  return (
    <Frame mod={1} kind="demo" beats={1}>
      <Title>Génération probabiliste : le token suivant, tiré au sort</Title>
      <Lede>Le modèle calcule une probabilité pour chaque suite possible, puis en tire une. Réglez la température et tirez.</Lede>
      <CodeDark file="src/tickets.js" size={24} cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
        <Cc>{'// Un ticket est en retard si son échéance est dépassée'}</Cc>
        {'\n'}
        <Ck>export function</Ck> <Cf>estEnRetard</Cf>(ticket, maintenant) {'{'}
        {'\n  '}
        <Ck>return new</Ck> <Cf>Date</Cf>(ticket.echeance) {'<'}
        <span style={{ color: '#FFD27A', background: 'rgba(255,210,122,.15)', borderRadius: 4 }}>{picked === null ? '▌' : GEN_CANDS[picked].tok}</span>
      </CodeDark>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 486, width: 1170, display: 'flex', flexDirection: 'column', gap: 6, ...dl(150) }}>
        {GEN_CANDS.map((c, i) => (
          <GenCand key={c.tok} i={i} probs={probs} picked={picked} />
        ))}
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 486, width: 470, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 26px', ...dl(250) }}>
        <Eyebrow c={C.muted} size={18}>
          Température
        </Eyebrow>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 4 }}>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 50, color: C.electric }}>{fr(temp, 1)}</span>
          <span style={{ fontSize: 21, color: C.muted }}>{temp < 0.4 ? 'prévisible' : temp < 1.1 ? 'équilibrée' : 'créative… et risquée'}</span>
        </div>
        <Range value={temp} onChange={setTemp} min={0.1} max={2} step={0.1} w={410} />
        <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
          <Btn icon="sparkles" size={21} onClick={sample}>
            Tirer un token
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
        <div style={{ marginTop: 14, fontSize: 21, color: C.soft }}>
          Tirages : <strong>{hist.length}</strong> · suites douteuses : <strong style={{ color: bad ? C.coral : C.green }}>{bad}</strong>
        </div>
      </div>
      <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 860, width: 1680 }}>
        <Callout tone="yellow" icon="loop" title="Puis il recommence, token après token" size={23}>
          Le token tiré est ajouté au texte, et il prédit le suivant. Même question, réponse différente : c’est normal. <strong>Plausible</strong> ne veut pas dire <strong>correct</strong>.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Hallucinations ─────────────────────────────────────────────────────────
const HAL = [
  {
    tag: 'Méthode',
    title: 'Une méthode qui n’existe pas',
    code: "const tries = tickets.sortBy('priorite');",
    back: 'Array.prototype.sortBy n’existe pas en JavaScript : le nom vient de Lodash ou d’autres langages. Détecté dès l’exécution… ou par un test.',
  },
  {
    tag: 'Dépendance',
    title: 'Un paquet npm inventé',
    code: 'npm install taskflow-date-utils',
    back: 'Le paquet n’existe pas… ou pire, quelqu’un l’a publié exprès pour piéger les copier-coller (« slopsquatting »). Vérifiez auteur, téléchargements et date sur npmjs.com.',
  },
  {
    tag: 'Réglage',
    title: 'Une option de configuration imaginaire',
    code: '"github.copilot.autoTests": true',
    back: 'Ce réglage n’existe pas. VS Code l’ignore, sans erreur bloquante. Seule la documentation officielle fait foi.',
  },
];

const M1_Hallucinations: Page = () => (
  <Frame mod={1} beats={4}>
    <Title>Hallucination : du faux, dit avec aplomb</Title>
    <Lede>Il ne consulte pas une base de faits : il complète avec le plus plausible, même quand il ne sait pas.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 36 }}>
      {HAL.map((h, i) => (
        <FlipCard
          key={h.tag}
          w={536}
          h={380}
          flipAt={i + 1}
          tone="coral"
          backTone="green"
          cls={A.in}
          style={dl(i * 140)}
          front={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <Tag tone="coral" size={18}>
                  Suggestion · {h.tag}
                </Tag>
              </div>
              <div style={{ fontSize: 27, fontWeight: 700, lineHeight: 1.25, color: C.ink }}>{h.title}</div>
              <div style={{ fontFamily: mono, fontSize: 21, lineHeight: 1.4, background: '#0F1730', color: '#E6EDF7', borderRadius: 12, padding: '14px 16px', whiteSpace: 'pre-wrap' }}>{h.code}</div>
            </div>
          }
          back={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 25, fontWeight: 700, color: T.green.fg }}>
                <Icon name="search" size={28} sw={2.4} /> Ce qui cloche
              </div>
              <div style={{ fontSize: 22, lineHeight: 1.45, color: C.ink }}>{h.back}</div>
            </div>
          }
        />
      ))}
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 700, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 36 }}>
      <Callout tone="coral" icon="alert" title="Pourquoi ça arrive" size={22}>
        Motif rare ou absent des données · contexte incomplet · question qui présuppose la réponse · un modèle entraîné à répondre, pas à dire « je ne sais pas ».
      </Callout>
      <Callout tone="green" icon="shieldCheck" title="Vos parades" size={22}>
        Exécuter et tester · fournir le bon contexte (#fichier, doc) · demander la source et la vérifier · se méfier des API récentes. On y revient au Module 8.
      </Callout>
    </div>
  </Frame>
);

// ─── L’agent et la boucle agentique ─────────────────────────────────────────
type AgK = 'plan' | 'act' | 'obs' | 'done';
const AG_KIND: Record<AgK, { icon: IconName; tone: Tone; label: string }> = {
  plan: { icon: 'brain', tone: 'violet', label: 'Réfléchir' },
  act: { icon: 'tool', tone: 'blue', label: 'Agir' },
  obs: { icon: 'eye', tone: 'teal', label: 'Observer' },
  done: { icon: 'humanCheck', tone: 'green', label: 'Conclure' },
};
const AG_STEPS: { k: AgK; t: string }[] = [
  { k: 'plan', t: 'Lire le test qui échoue avant de toucher au code' },
  { k: 'act', t: 'lire_fichier · test/tickets.test.js' },
  { k: 'obs', t: 'Attendu : points parmi 1, 2, 3, 5, 8, 13' },
  { k: 'act', t: 'éditer · src/tickets.js → estPointsValide()' },
  { k: 'act', t: 'terminal · npm run test:atelier4  (vous approuvez)' },
  { k: 'obs', t: '✗ 1 échec : trim() appelé sur undefined' },
  { k: 'plan', t: 'Un titre absent doit lever une erreur claire' },
  { k: 'act', t: 'éditer · src/tickets.js → validerTicket()' },
  { k: 'obs', t: '✓ tous les tests de l’atelier 4 passent' },
  { k: 'done', t: 'Résumé + diff proposés : à vous de relire' },
];
const AG_NODES: { k: AgK; left: number; top: number }[] = [
  { k: 'plan', left: 390, top: 295 },
  { k: 'act', left: 572, top: 610 },
  { k: 'obs', left: 208, top: 610 },
];

const M1_Agent: Page = () => {
  const [ref, beats] = useBeats();
  const [auto, setAuto] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const N = AG_STEPS.length;
  useEffect(() => {
    setAuto(null);
    setPlaying(false);
  }, [beats]);
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setAuto((a) => Math.min(N, (a ?? 0) + 1)), 1100);
    return () => window.clearInterval(id);
  }, [playing, N]);
  useEffect(() => {
    if (auto !== null && auto >= N) setPlaying(false);
  }, [auto, N]);
  const step = auto ?? Math.min(beats, N);
  const cur = step > 0 ? AG_STEPS[step - 1].k : null;
  return (
    <Frame mod={1} beats={N}>
      <Title>Du chat à l’agent : la boucle agentique</Title>
      <Lede>Un agent, c’est un LLM, des outils et une boucle : il réfléchit, agit, observe le résultat… et recommence jusqu’à l’objectif.</Lede>
      <div className={A.fade} style={{ position: 'absolute', left: 290, top: 350, width: 420, height: 420 }}>
        <svg width={420} height={420} className={A.spin} style={{ display: 'block' }}>
          <circle cx={210} cy={210} r={200} fill="none" stroke={C.faint} strokeWidth={4} strokeDasharray="12 14" />
        </svg>
      </div>
      <div className={A.pop} style={{ position: 'absolute', left: 380, top: 470, width: 240, height: 120, boxSizing: 'border-box', borderRadius: 18, background: cur === 'done' ? G.green : G.navy, color: '#fff', padding: '14px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4, transition: 'background 400ms ease' }}>
        <span style={{ fontSize: 17, letterSpacing: '.1em', textTransform: 'uppercase', opacity: 0.8 }}>Objectif</span>
        <span style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.25 }}>Faire passer les tests de l’atelier 4 au vert</span>
      </div>
      {AG_NODES.map((n, i) => {
        const kd = AG_KIND[n.k];
        const on = cur === n.k;
        return (
          <div
            key={n.k}
            className={cx(A.pop, k('agnode'))}
            style={{
              position: 'absolute',
              left: n.left,
              top: n.top,
              width: 220,
              height: 110,
              boxSizing: 'border-box',
              borderRadius: 18,
              background: on ? T[kd.tone].bg : C.card,
              boxShadow: on ? `0 0 0 4px ${STRONG[kd.tone]}, 0 0 0 14px ${T[kd.tone].bg}` : SHADOW,
              transform: on ? 'scale(1.08)' : 'none',
              opacity: cur && !on ? 0.55 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '0 18px',
              ...dl(200 + i * 150),
            }}
          >
            <IconTile name={kd.icon} tone={kd.tone} size={58} solid={on} />
            <span style={{ fontSize: 25, fontWeight: 700, color: on ? T[kd.tone].fg : C.ink }}>{kd.label}</span>
          </div>
        );
      })}
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 830, width: 820, ...dl(500) }}>
        <Callout tone="blue" icon="humanCheck" title="En mode Agent de Copilot" size={21}>
          Il vous demande avant de lancer une commande, et vous relisez le diff à la fin. L’objectif et le « c’est fini » restent à vous.
        </Callout>
      </div>
      <div ref={ref} className={A.right} style={{ position: 'absolute', left: 990, top: 270, width: 810, height: 600, boxSizing: 'border-box', background: '#0F1730', borderRadius: 20, boxShadow: SHADOW, padding: '20px 24px', ...dl(200) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: mono, fontSize: 19, color: '#9AA6C8', marginBottom: 14 }}>
          <Icon name="terminal" size={24} color="#9AA6C8" /> Journal de l’agent · étape {step} / {N}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {AG_STEPS.slice(0, step).map((s, i) => {
            const kd = AG_KIND[s.k];
            const last = i === step - 1;
            return (
              <div key={i} className={k('swap')} style={{ display: 'grid', gridTemplateColumns: '34px 130px minmax(0, 1fr)', alignItems: 'center', gap: 10, padding: '6px 10px', borderRadius: 10, background: last ? 'rgba(255,255,255,.08)' : 'transparent' }}>
                <Icon name={kd.icon} size={24} color={STRONG[kd.tone]} sw={2.2} />
                <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: STRONG[kd.tone] }}>{kd.label}</span>
                <span style={{ fontFamily: mono, fontSize: 19, color: last ? '#fff' : '#C9D2EA', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.t}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 990, top: 892, display: 'flex', gap: 12, ...dl(300) }}>
        <Btn
          icon="play"
          size={21}
          onClick={() => {
            setAuto(0);
            setPlaying(true);
          }}
        >
          Lecture automatique
        </Btn>
        <Btn
          icon="reset"
          ghost
          tone="grey"
          size={21}
          onClick={() => {
            setPlaying(false);
            setAuto(0);
          }}
        >
          Recommencer
        </Btn>
      </div>
    </Frame>
  );
};

// ─── Prompt, contexte, harnais ──────────────────────────────────────────────
const ENG = [
  {
    name: 'Prompt engineering',
    q: 'Que demandez-vous ?',
    tone: 'green' as Tone,
    icon: 'chat' as IconName,
    era: '2022 – 2023 : l’art de bien formuler',
    items: ['Un objectif précis et vérifiable', 'Les contraintes : langage, style, interdits', 'Le format attendu : fonction, tests, tableau…', 'Un exemple d’entrée et de sortie'],
    cop: ['un commentaire avant la fonction', 'votre message dans le chat', '/explain, /tests, /fix…', 'des fichiers .prompt.md réutilisables'],
  },
  {
    name: 'Context engineering',
    q: 'Que voit le modèle ?',
    tone: 'blue' as Tone,
    icon: 'layers' as IconName,
    era: 'popularisé en 2025',
    items: ['Les bons fichiers, pas tout le dépôt', 'Les règles du projet, écrites une fois', 'Une tâche = une session propre', 'Retirer le bruit : chaque token coûte'],
    cop: ['#fichier, #codebase, la sélection', '.github/copilot-instructions.md', '/compact ou nouvelle session', 'serveurs MCP : doc, tickets…'],
  },
  {
    name: 'Harness engineering',
    q: 'Dans quel cadre l’agent agit-il ?',
    tone: 'violet' as Tone,
    icon: 'shield' as IconName,
    era: 'le chantier de 2026',
    items: ['La boucle : réfléchir, agir, observer', 'Les outils autorisés et les permissions', 'Des garde-fous automatiques : tests, lint, CI', 'Un bac à sable et une revue humaine'],
    cop: ['mode Agent, agents personnalisés', 'approbation des commandes terminal', 'bac à sable local (VS Code)', 'hooks, CI, revue de PR'],
  },
];
const ENG_BOX = [
  { left: 225, top: 495, w: 590, h: 370, cls: A.pop },
  { left: 170, top: 380, w: 700, h: 540, cls: b.pop(1) },
  { left: 120, top: 280, w: 800, h: 690, cls: b.pop(2) },
];

const M1_Engineering: Page = () => {
  const [ref, beats] = useBeats();
  const [pick, setPick] = useState<number | null>(null);
  useEffect(() => setPick(null), [beats]);
  const sel = pick ?? Math.min(beats, 2);
  const e = ENG[sel];
  return (
    <Frame mod={1} beats={2}>
      <Title>Prompt, contexte, harnais : trois façons de guider l’IA</Title>
      <Lede>Trois couches emboîtées : de la phrase que vous écrivez au système dans lequel l’agent travaille. Cliquez une couche.</Lede>
      {[2, 1, 0].map((i) => {
        const bx = ENG_BOX[i];
        const en = ENG[i];
        const on = sel === i;
        return (
          <div
            key={en.name}
            role="button"
            data-osd-interactive
            onClick={() => setPick(i)}
            className={cx(bx.cls, k('layer'))}
            style={{
              position: 'absolute',
              left: bx.left,
              top: bx.top,
              width: bx.w,
              height: bx.h,
              boxSizing: 'border-box',
              borderRadius: 26,
              background: i === 0 ? C.card : T[en.tone].bg,
              boxShadow: on ? `0 0 0 5px ${STRONG[en.tone]}, 0 22px 50px -24px rgba(11,31,92,.55)` : `inset 0 0 0 2px ${T[en.tone].bd}`,
              padding: '20px 26px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <IconTile name={en.icon} tone={en.tone} size={52} solid={on} />
              <div>
                <div style={{ fontSize: 25, fontWeight: 800, color: T[en.tone].fg }}>{en.name}</div>
                <div style={{ fontSize: 19, color: C.soft }}>{en.q}</div>
              </div>
            </div>
            {i === 0 ? (
              <div style={{ marginTop: 22, fontFamily: mono, fontSize: 20, lineHeight: 1.45, background: '#0F1730', color: '#E6EDF7', borderRadius: 12, padding: '14px 16px' }}>
                <span style={{ color: '#7C86A8' }}>{'// Valide un ticket : titre non vide,'}</span>
                <br />
                <span style={{ color: '#7C86A8' }}>{'// points dans {1, 2, 3, 5, 8, 13}.'}</span>
                <br />
                <span style={{ color: '#7C86A8' }}>{'// Lève une Error explicite sinon.'}</span>
              </div>
            ) : null}
          </div>
        );
      })}
      <div ref={ref} style={{ position: 'absolute', left: 980, top: 280, width: 820, height: 690 }}>
        <div key={sel} className={k('swap')} style={{ height: '100%', boxSizing: 'border-box', background: C.card, borderRadius: 22, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[e.tone]}`, padding: '30px 34px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <IconTile name={e.icon} tone={e.tone} size={64} solid />
            <div>
              <div style={{ fontFamily: display, fontSize: 34, fontWeight: 800, color: C.ink }}>{e.name}</div>
              <div style={{ fontSize: 22, color: C.soft }}>{e.q}</div>
            </div>
          </div>
          <div>
            <Tag tone={e.tone} size={19}>
              {e.era}
            </Tag>
          </div>
          <Eyebrow c={C.muted} size={18}>
            Ce que vous réglez
          </Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: -6 }}>
            {e.items.map((t, i) => (
              <div key={t} className={k('swap')} style={{ ...dl(80 + i * 70), display: 'flex', alignItems: 'center', gap: 12, fontSize: 23, color: C.ink }}>
                <Icon name="check" size={24} color={STRONG[e.tone]} sw={2.8} /> {t}
              </div>
            ))}
          </div>
          <Eyebrow c={C.muted} size={18}>
            Dans Copilot
          </Eyebrow>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, marginTop: -6 }}>
            {e.cop.map((t, i) => (
              <div key={t} className={k('swap')} style={{ ...dl(380 + i * 70), fontSize: 20, lineHeight: 1.3, color: T[e.tone].fg, background: T[e.tone].bg, borderRadius: 12, padding: '10px 14px' }}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
};

// ═══ 20-m2 ═════════════════════════════════════════════════════════════

// ─── Module 2 · Installation et configuration ───────────────────────────────

const M2_Divider: Page = () => (
  <Section
    n={2}
    title={
      <>
        Installation et
        <br />
        configuration
      </>
    }
    sub="Un poste prêt, des réglages qui vous ressemblent, et les gestes clavier qui font gagner du temps."
    dur="J1 · 11:10 – 12:15"
    labs={<Tag tone="green" size={19}>Atelier 2 · réglages et 8 gestes</Tag>}
  >
    <SecItem n={1}>Installer Copilot dans VS Code</SecItem>
    <SecItem n={2}>S’authentifier et activer sa licence</SecItem>
    <SecItem n={3}>Paramétrer langue, langages et confidentialité</SecItem>
    <SecItem n={4}>Les raccourcis clavier essentiels</SecItem>
    <SecItem n={5}>Naviguer entre suggestions et piloter le panneau Chat</SecItem>
  </Section>
);
M2_Divider.transition = BLOOM;

// ─── Installer ──────────────────────────────────────────────────────────────
const M2Step = ({ n, title, children, d }: { n: number; title: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', ...dl(d) }}>
    <Num n={n} tone="blue" size={44} />
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, color: C.soft, lineHeight: 1.4, marginTop: 2 }}>{children}</div>
    </div>
  </div>
);

const M2StatusBar = () => (
  <div style={{ background: '#0F1530', borderRadius: 16, overflow: 'hidden', boxShadow: '0 22px 44px -26px rgba(11,31,92,.8)' }}>
    <div style={{ padding: '18px 22px', fontFamily: mono, fontSize: 19, color: '#AEB9E6', lineHeight: 1.6 }}>
      <span style={{ color: '#7C86A8' }}>{'// TaskFlow · src/tickets.js'}</span>
      {'\n'}
      <br />
      <span style={{ color: '#C792EA' }}>export const</span> TYPES = <span style={{ color: '#7C86A8', fontStyle: 'italic' }}>Object.freeze([…])</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', background: '#1E22E8', fontSize: 17, color: '#fff', fontFamily: body }}>
      <span>⎇ main · 0 ⚠ 0 ✕</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span>Ln 3, Col 42</span>
        <span>JavaScript</span>
        <span className={A.glow} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.18)', borderRadius: 6, padding: '2px 10px' }}>
          <Icon name="sparkles" size={18} color="#fff" /> Copilot
        </span>
      </span>
    </div>
  </div>
);

const M2_Installer: Page = () => (
  <Frame mod={2} kind="demo">
    <Title>Installer Copilot dans VS Code</Title>
    <Lede>Copilot est intégré à VS Code : on se connecte avec son compte GitHub, l’extension Copilot Chat suit automatiquement.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 880, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <M2Step n={1} title="Mettre VS Code à jour" d={100}>
        Aide › Rechercher les mises à jour : les nouveautés Copilot arrivent avec VS Code.
      </M2Step>
      <M2Step n={2} title="Cliquer sur l’icône Copilot" d={200}>
        Barre d’état, en bas à droite, ou vue Chat (<Kbd>Ctrl+Alt+I</Kbd>) › « Se connecter ».
      </M2Step>
      <M2Step n={3} title="Se connecter avec GitHub" d={300}>
        Le navigateur s’ouvre : autorisez VS Code, puis revenez dans l’éditeur.
      </M2Step>
      <M2Step n={4} title="Vérifier l’extension" d={400}>
        Vue Extensions (<Kbd>Ctrl+Maj+X</Kbd>) : « GitHub Copilot Chat » installée et activée.
      </M2Step>
      <M2Step n={5} title="Faire un premier essai" d={500}>
        Tapez un commentaire dans un fichier .js : le texte grisé apparaît.
      </M2Step>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1080, top: 280, width: 720, ...dl(300) }}>
      <M2StatusBar />
      <Callout tone="green" icon="checkCircle" title="Installation réussie si…" size={22} style={{ marginTop: 24 }}>
        L’icône Copilot de la barre d’état n’affiche ni barre oblique ni point d’exclamation, et la vue Chat répond.
      </Callout>
    </div>
  </Frame>
);

// ─── Authentification & licence ─────────────────────────────────────────────
const M2Case = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <Card icon={icon} tone={tone} title={title} size={22} pad={24} cls={A.in} style={dl(d)}>
    {children}
  </Card>
);

const M2_Licence: Page = () => (
  <Frame mod={2}>
    <Title>Authentification et activation de la licence</Title>
    <Lede>Le compte GitHub avec lequel vous vous connectez détermine votre offre. Trois situations possibles :</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <M2Case icon="user" tone="green" title="Pas encore de licence" d={100}>
        Copilot Free s’active à la première connexion. Rien à payer, quotas mensuels.
      </M2Case>
      <M2Case icon="key" tone="blue" title="Licence personnelle" d={220}>
        Pro ou Pro+, souscrite sur github.com/settings/copilot avec votre compte.
      </M2Case>
      <M2Case icon="org" tone="violet" title="Licence d’entreprise" d={340}>
        Votre organisation vous attribue un siège Business ou Enterprise. Connectez-vous avec le compte rattaché à l’organisation.
      </M2Case>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 560, width: 1680, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', ...dl(500) }}>
      <PanelTitle icon="search">Vérifier son statut en 10 secondes</PanelTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 28, marginTop: 6 }}>
        <Bullet size={23}>Icône Copilot de la barre d’état : offre et quotas restants</Bullet>
        <Bullet size={23}>Menu Comptes de VS Code : quel compte GitHub est connecté</Bullet>
        <Bullet size={23}>github.com/settings/copilot : offre, réglages, usage</Bullet>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 790, width: 1680 }}>
      <Callout tone="yellow" icon="lock" title="Une fonctionnalité grisée ?" size={24} cls={A.in} style={dl(700)}>
        En entreprise, l’administrateur peut désactiver des modèles, le mode Agent ou les préversions. Ce n’est pas une panne : c’est une politique.
      </Callout>
    </div>
  </Frame>
);

// ─── Paramétrage ────────────────────────────────────────────────────────────
const M2Setting = ({ k: key, children, beat }: { k: string; children: ReactNode; beat: number }) => (
  <div className={b.on(beat)} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '12px 18px', borderRadius: 12, background: T.blue.bg, boxShadow: `inset 5px 0 0 ${C.blue}` }}>
    <span style={{ fontFamily: mono, fontSize: 19, color: T.blue.fg }}>{key}</span>
    <span style={{ fontSize: 22, color: C.ink, lineHeight: 1.35 }}>{children}</span>
  </div>
);

const M2_Parametres: Page = () => (
  <Frame mod={2} kind="demo" beats={4}>
    <Title>Paramétrer son environnement de travail</Title>
    <Lede>Des réglages d’espace de travail, versionnés avec le projet : toute l’équipe partage les mêmes.</Lede>
    <CodeDark file=".vscode/settings.json" size={21} cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 900 }}>
      {'{'}
      {'\n'}
      {'  '}
      <Cs>"github.copilot.chat.localeOverride"</Cs>: <Cs>"fr"</Cs>,{'\n'}
      {'  '}
      <Cs>"github.copilot.enable"</Cs>: {'{'}
      {'\n'}
      {'    '}
      <Cs>"*"</Cs>: <Ck>true</Ck>,{'\n'}
      {'    '}
      <Cs>"markdown"</Cs>: <Ck>false</Ck>,{'\n'}
      {'    '}
      <Cs>"plaintext"</Cs>: <Ck>false</Ck>
      {'\n'}
      {'  },\n'}
      {'  '}
      <Cs>"github.copilot.nextEditSuggestions.enabled"</Cs>: <Ck>true</Ck>,{'\n'}
      {'  '}
      <Cs>"editor.inlineSuggest.enabled"</Cs>: <Ck>true</Ck>
      {'\n'}
      {'}'}
    </CodeDark>
    <div style={{ position: 'absolute', left: 1070, top: 262, width: 730, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M2Setting k="localeOverride" beat={1}>
        Le chat répond en français, quelle que soit la langue de VS Code.
      </M2Setting>
      <M2Setting k="github.copilot.enable" beat={2}>
        Langages ciblés : les suggestions inline restent actives pour le code, coupées pour la prose.
      </M2Setting>
      <M2Setting k="nextEditSuggestions" beat={3}>
        Suggestions de modification suivante : Copilot anticipe la prochaine retouche.
      </M2Setting>
      <M2Setting k="Ctrl+, › « copilot »" beat={4}>
        Tous les réglages se retrouvent aussi dans l’éditeur de paramètres, sans JSON.
      </M2Setting>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(600) }}>
      Ctrl+Maj+P › « Préférences : Ouvrir les paramètres de l’espace de travail (JSON) »
    </Hint>
  </Frame>
);

// ─── Confidentialité ────────────────────────────────────────────────────────
const M2_Confidentialite: Page = () => (
  <Frame mod={2}>
    <Title>Deux réglages de confiance à connaître</Title>
    <Lede>Sur github.com/settings/copilot (compte personnel) ou dans les politiques de votre organisation.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 26 }}>
      <Card icon="globe" tone="violet" title="Suggestions correspondant à du code public" size={23} pad={28} cls={A.in} style={dl(100)}>
        <strong>Bloquer</strong> : Copilot écarte les suggestions qui reproduisent un code public existant.
        <br />
        <strong>Autoriser</strong> : il les propose, avec une référence vers le code d’origine et sa licence.
      </Card>
      <Card icon="database" tone="blue" title="Utilisation de vos données" size={23} pad={28} cls={A.in} style={dl(250)}>
        Compte personnel : vérifiez le réglage qui autorise ou non l’usage de vos interactions pour améliorer les modèles.
        <br />
        Business / Enterprise : vos données ne servent pas à l’entraînement.
      </Card>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 26 }}>
      <Callout tone="teal" icon="eyeOff" title="Exclusion de contenu" size={23} cls={A.in} style={dl(450)}>
        En entreprise, l’administrateur peut interdire à Copilot de lire certains fichiers ou dépôts.
      </Callout>
      <Callout tone="coral" icon="lock" title="La meilleure protection reste vous" size={23} cls={A.in} style={dl(600)}>
        Pas de secret dans le code, pas de donnée réelle dans un prompt, fichier .env exclu du dépôt.
      </Callout>
    </div>
  </Frame>
);

// ─── Raccourcis ─────────────────────────────────────────────────────────────
const M2Key = ({ keys, label, sub, tone, d }: { keys: ReactNode; label: string; sub: string; tone: Tone; d: number }) => (
  <div className={A.in} style={{ display: 'grid', gridTemplateColumns: '250px minmax(0, 1fr)', alignItems: 'center', gap: 20, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '14px 22px', borderLeft: `6px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ fontSize: 28, display: 'flex', gap: 6, flexWrap: 'wrap' }}>{keys}</div>
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{label}</div>
      <div style={{ fontSize: 20, color: C.muted }}>{sub}</div>
    </div>
  </div>
);

const M2_Raccourcis: Page = () => (
  <Frame mod={2}>
    <Title>Les 8 raccourcis qui changent tout</Title>
    <Lede>Windows et Linux. Sur macOS : Ctrl devient Cmd, Alt devient Option.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
      <M2Key keys={<Kbd>Tab</Kbd>} label="Accepter la suggestion" sub="tout le texte grisé" tone="green" d={100} />
      <M2Key keys={<Kbd>Ctrl+I</Kbd>} label="Chat en ligne" sub="demander une modification sur place" tone="violet" d={150} />
      <M2Key keys={<Kbd>Échap</Kbd>} label="Refuser" sub="et continuer à taper" tone="coral" d={200} />
      <M2Key keys={<Kbd>Ctrl+Alt+I</Kbd>} label="Vue Chat" sub="converser, expliquer, planifier" tone="violet" d={250} />
      <M2Key keys={<Kbd>Ctrl+→</Kbd>} label="Accepter mot par mot" sub="garder le début seulement" tone="green" d={300} />
      <M2Key keys={<Kbd>Ctrl+N</Kbd>} label="Nouvelle conversation" sub="dans la vue Chat : repartir d’un contexte propre" tone="violet" d={350} />
      <M2Key keys={<><Kbd>Alt+]</Kbd><Kbd>Alt+[</Kbd></>} label="Suggestion suivante / précédente" sub="ou survol : barre « 1/3 »" tone="blue" d={400} />
      <M2Key keys={<Kbd>Alt+\</Kbd>} label="Déclencher une suggestion" sub="quand rien ne s’affiche" tone="blue" d={450} />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 800, width: 1680 }}>
      <Callout tone="yellow" icon="pointer" title="Clavier AZERTY" size={23} cls={A.in} style={dl(700)}>
        Alt+] ou Alt+\ ne répondent pas ? Survolez le texte grisé, ou réattribuez le raccourci : Ctrl+K Ctrl+S › « inline suggestion ».
      </Callout>
    </div>
  </Frame>
);

// ─── Naviguer entre les suggestions ─────────────────────────────────────────
const M2_Navigation: Page = () => (
  <Frame mod={2} kind="demo" beats={2}>
    <Title>Naviguer entre les suggestions</Title>
    <Lede>Deux familles : la suite de ce que vous tapez (texte grisé), et la prochaine modification probable (flèche dans la gouttière).</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 820 }}>
      <PanelTitle icon="code" c={C.blue}>
        Texte grisé · plusieurs propositions
      </PanelTitle>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', right: 20, top: -18, zIndex: 2, display: 'flex', alignItems: 'center', gap: 10, background: '#fff', borderRadius: 10, boxShadow: SHADOW, padding: '6px 14px', fontSize: 19, color: C.ink }}>
          <span>‹</span>
          <strong>2 / 3</strong>
          <span>›</span>
          <span style={{ color: C.muted }}>Accepter Tab · Mot Ctrl+→</span>
        </div>
        <CodeDark file="katas/02-raccourcis.js" size={21}>
          <Ck>function</Ck> <Cf>diviser</Cf>(a, b) {'{'}
          {'\n'}
          <span style={{ color: '#7C86A8', fontStyle: 'italic' }}>
            {'  if (b === 0) throw new RangeError("division par zéro");\n  return a / b;'}
          </span>
          {'\n}'}
        </CodeDark>
      </div>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Bullet size={23}>Survol ou <Kbd>Alt+]</Kbd> : comparer les alternatives</Bullet>
        <Bullet size={23}><Kbd>Ctrl+→</Kbd> : n’accepter que le premier mot, puis le suivant</Bullet>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 980, top: 270, width: 820 }}>
      <PanelTitle icon="arrow" c={C.violet}>
        Modification suivante (NES)
      </PanelTitle>
      <CodeDark file="katas/02-raccourcis.js" size={21}>
        <Ck>function</Ck> <Cf>moyenne</Cf>(<span style={{ background: 'rgba(155,226,155,.25)' }}>valeurs</span>) {'{'}
        {'\n'}
        <span style={{ display: 'inline-block', width: 26, color: '#FFD27A' }}>➜</span>
        <Ck>return</Ck> <span style={{ textDecoration: 'line-through', color: '#F28B82' }}>nombres</span>
        <span style={{ color: '#9BE29B' }}>valeurs</span>.reduce(…) / …;{'\n}'}
      </CodeDark>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Bullet size={23} tone="violet">Vous renommez un paramètre : une flèche apparaît</Bullet>
        <Bullet size={23} tone="violet"><Kbd>Tab</Kbd> pour y aller, <Kbd>Tab</Kbd> pour appliquer, <Kbd>Échap</Kbd> pour ignorer</Bullet>
      </div>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 800, width: 1680 }}>
      <Callout tone="blue" icon="eye" title="Dans les deux cas" size={24}>
        Rien n’est écrit tant que vous n’avez pas appuyé sur Tab. Le texte grisé est une proposition, pas une décision.
      </Callout>
    </div>
  </Frame>
);

// ─── Le panneau Chat ────────────────────────────────────────────────────────
const M2Badge = ({ n, x, y }: { n: number; x: number; y: number }) => (
  <span style={{ position: 'absolute', left: x, top: y, width: 34, height: 34, borderRadius: 99, background: C.coral, color: '#fff', fontFamily: display, fontWeight: 800, fontSize: 19, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #fff', boxShadow: '0 6px 14px -6px rgba(180,60,40,.7)' }}>
    {n}
  </span>
);

const M2Legend = ({ n, title, children, beat }: { n: number; title: string; children: ReactNode; beat: number }) => (
  <div className={b.on(beat)} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
    <Num n={n} tone="coral" size={36} />
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, color: C.soft, lineHeight: 1.38 }}>{children}</div>
    </div>
  </div>
);

const M2ChatMock = () => (
  <div style={{ position: 'relative', width: 700, height: 650, background: '#1B1F3B', borderRadius: 18, boxShadow: '0 30px 60px -30px rgba(11,31,92,.8)', fontFamily: body, color: '#DCE2F5' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #2C3260', fontSize: 17, letterSpacing: '0.1em' }}>
      <span>CHAT</span>
      <span style={{ display: 'flex', gap: 18, fontSize: 22 }}>
        <span>＋</span>
        <span>⟲</span>
        <span>⋯</span>
      </span>
    </div>
    <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ alignSelf: 'flex-end', maxWidth: 480, background: '#2C3470', borderRadius: 12, padding: '10px 14px', fontSize: 18 }}>Explique trierBacklog en 3 points.</div>
      <div style={{ maxWidth: 560, fontSize: 18, lineHeight: 1.5, color: '#C5CCE8' }}>
        1. Copie le tableau reçu…
        <br />
        2. Trie par priorité, puis par points…
        <br />
        <span style={{ fontSize: 15, color: '#8D96C2' }}>Références : backlog.js, tickets.js</span>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 20, right: 20, bottom: 20, background: '#121633', borderRadius: 14, border: '1.5px solid #3A4280', padding: '12px 14px' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <span style={{ fontSize: 15, background: '#2C3470', borderRadius: 6, padding: '2px 8px' }}>📎 Ajouter du contexte…</span>
        <span style={{ fontSize: 15, background: '#2C3470', borderRadius: 6, padding: '2px 8px' }}>backlog.js</span>
      </div>
      <div style={{ marginTop: 12, fontSize: 18, color: '#7C86A8' }}>Demandez à Copilot, / pour les commandes, # pour le contexte</div>
      <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center', fontSize: 16 }}>
        <span style={{ background: '#2C3470', borderRadius: 6, padding: '3px 10px' }}>Ask ▾</span>
        <span style={{ background: '#2C3470', borderRadius: 6, padding: '3px 10px' }}>Auto ▾</span>
        <span style={{ marginLeft: 'auto', background: C.electric, borderRadius: 6, padding: '3px 12px', color: '#fff' }}>➤</span>
      </div>
    </div>
    <M2Badge n={1} x={560} y={-14} />
    <M2Badge n={2} x={612} y={-14} />
    <M2Badge n={3} x={6} y={498} />
    <M2Badge n={4} x={6} y={578} />
    <M2Badge n={5} x={110} y={578} />
    <M2Badge n={6} x={300} y={536} />
  </div>
);

const M2_PanneauChat: Page = () => (
  <Frame mod={2} kind="demo" beats={6}>
    <Title>Le panneau Copilot Chat, bouton par bouton</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 210 }}>
      <M2ChatMock />
    </div>
    <div style={{ position: 'absolute', left: 900, top: 210, width: 900, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <M2Legend n={1} title="Nouvelle conversation" beat={1}>
        Un sujet = une conversation. <Kbd>Ctrl+N</Kbd> repart d’un contexte propre.
      </M2Legend>
      <M2Legend n={2} title="Historique des sessions" beat={2}>
        Retrouver, renommer ou reprendre une conversation passée.
      </M2Legend>
      <M2Legend n={3} title="Ajouter du contexte" beat={3}>
        <Ic>#file</Ic>, <Ic>#selection</Ic>, <Ic>#codebase</Ic>, ou glisser un fichier : ce que le modèle verra.
      </M2Legend>
      <M2Legend n={4} title="Choisir l’agent" beat={4}>
        <strong>Ask</strong> répond, <strong>Plan</strong> prépare, <strong>Agent</strong> modifie les fichiers.
      </M2Legend>
      <M2Legend n={5} title="Choisir le modèle" beat={5}>
        <strong>Auto</strong> par défaut ; le choix manuel dépend de votre offre.
      </M2Legend>
      <M2Legend n={6} title="Commandes « / »" beat={6}>
        <Ic>/explain</Ic> <Ic>/fix</Ic> <Ic>/tests</Ic> <Ic>/doc</Ic> : des raccourcis de demandes fréquentes.
      </M2Legend>
    </div>
  </Frame>
);

// ─── Ask, Plan, Agent, chat en ligne ────────────────────────────────────────
const M2Mode = ({ icon, tone, title, who, when, risk, d }: { icon: IconName; tone: Tone; title: string; who: string; when: string; risk: string; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 24px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone={tone} size={52} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.ink }}>{title}</div>
    </div>
    <div style={{ marginTop: 16, fontSize: 17, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>CE QU’IL FAIT</div>
    <div style={{ fontSize: 22, lineHeight: 1.4, color: C.ink }}>{who}</div>
    <div style={{ marginTop: 12, fontSize: 17, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>QUAND</div>
    <div style={{ fontSize: 22, lineHeight: 1.4, color: C.soft }}>{when}</div>
    <div style={{ marginTop: 12, fontSize: 17, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>VIGILANCE</div>
    <div style={{ fontSize: 22, lineHeight: 1.4, color: T[tone].fg }}>{risk}</div>
  </div>
);

const M2_Agents: Page = () => (
  <Frame mod={2}>
    <Title>Ask, Plan, Agent… et le chat en ligne</Title>
    <Lede>Quatre façons de parler à Copilot. Pour débuter : Ask et Ctrl+I d’abord, Agent quand vous êtes à l’aise.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 22 }}>
      <M2Mode icon="chat" tone="blue" title="Ask" who="Répond, explique, propose du code dans le chat" when="Comprendre un code, une erreur, une notion" risk="Aucune modification : vous copiez ce que vous voulez" d={100} />
      <M2Mode icon="pointer" tone="violet" title="Ctrl+I" who="Modifie la sélection, sur place, avec un diff" when="Une retouche ciblée sur une fonction" risk="Relire le diff avant d’accepter" d={220} />
      <M2Mode icon="map" tone="teal" title="Plan" who="Analyse et propose un plan, sans écrire de code" when="Avant une tâche qui touche plusieurs fichiers" risk="Le plan peut être faux : discutez-le" d={340} />
      <M2Mode icon="bot" tone="green" title="Agent" who="Modifie des fichiers, lance des commandes, itère" when="Une tâche multi-fichiers bien définie" risk="Il agit : permissions, diff, tests" d={460} />
    </div>
  </Frame>
);

// ─── Atelier 2 ──────────────────────────────────────────────────────────────
const M2_Lab: Page = () => (
  <LabPage
    mod={2}
    n="2"
    title="Configurer son poste, prendre les réflexes"
    defi="config"
    who="Individuel · 30 min"
    objective={
      <>
        Vérifier votre <strong>licence</strong>, écrire votre <PathChip size={22}>.vscode/settings.json</PathChip> (langue, langages, NES) en vérifiant chaque effet, puis enchaîner les <strong>8 gestes clavier</strong> sans souris.
      </>
    }
    where={
      <>
        <PathChip size={19}>.vscode/settings.json</PathChip>
        <br />
        8 gestes cochés · <PathChip size={19}>JOURNAL.md</PathChip>
      </>
    }
    minutes={30}
    crit={
      <>
        <CheckItem id="l2a" size={21}>Le chat répond en français</CheckItem>
        <CheckItem id="l2b" size={21}>Aucune suggestion dans README.md</CheckItem>
        <CheckItem id="l2c" size={21}>Les 8 gestes réussis au clavier</CheckItem>
      </>
    }
    suivi="Points d’étape à 10 min (réglages) et à 25 min (gestes) : « Quel geste résiste ? »"
  >
    <WStep n={1}>Icône Copilot de la barre d’état : notez votre offre et vos quotas.</WStep>
    <WStep n={2}>Écrivez les 4 réglages de l’énoncé, puis vérifiez chacun par son effet visible.</WStep>
    <WStep n={3}>
      Ouvrez <PathChip size={20}>katas/02-raccourcis.js</PathChip> : gestes 1 à 8 dans l’ordre, sans souris.
    </WStep>
  </LabPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M2_Qcm: Page = () => (
  <Frame mod={2} kind="qcm">
    <Title>QCM · Module 2 en quatre questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Vous voulez garder seulement le début d’une suggestion. Quel geste ?" explain="Ctrl+→ accepte mot par mot : on s’arrête où l’on veut. Tab accepte tout, Échap refuse tout.">
        <QOpt>Tab, puis effacer la fin</QOpt>
        <QOpt ok>Ctrl+→, autant de fois que nécessaire</QOpt>
        <QOpt>Alt+], jusqu’à trouver la bonne longueur</QOpt>
      </QuizQ>
      <QuizQ q="Les suggestions inline vous gênent dans vos fichiers Markdown. Que faites-vous ?" explain="github.copilot.enable accepte un objet par langage : on coupe markdown sans toucher au reste. Le chat reste disponible.">
        <QOpt>Je désactive Copilot complètement</QOpt>
        <QOpt ok>« markdown »: false dans github.copilot.enable</QOpt>
        <QOpt>Je change de modèle dans le chat</QOpt>
      </QuizQ>
      <QuizQ q="Le mode Agent est grisé sur votre poste d’entreprise. Explication la plus probable ?" explain="Les offres Business et Enterprise permettent à l’administrateur de désactiver des fonctionnalités par politique. Vérifiez auprès de lui avant de chercher une panne.">
        <QOpt>L’extension est mal installée</QOpt>
        <QOpt ok>Une politique de l’organisation le désactive</QOpt>
        <QOpt>Le mode Agent n’existe que sur macOS</QOpt>
      </QuizQ>
      <QuizQ q="Pour comprendre un code sans risquer de le modifier, quel agent choisir ?" explain="Ask répond sans toucher aux fichiers. Agent peut modifier et exécuter ; Plan prépare un plan d’action.">
        <QOpt ok>Ask</QOpt>
        <QOpt>Agent</QOpt>
        <QOpt>Ctrl+I sur tout le fichier</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ═══ 30-m3 ═════════════════════════════════════════════════════════════

// ─── Module 3 · Comprendre les suggestions de Copilot ───────────────────────

const M3_Divider: Page = () => (
  <Section
    n={3}
    title={
      <>
        Comprendre les
        <br />
        suggestions
      </>
    }
    sub="Ce que Copilot lit avant de proposer, et ce que vous lisez avant d’accepter."
    dur="J1 · 12:15 – 12:30 · 14:00 – 14:55"
    labs={<Tag tone="green" size={19}>Atelier 3 · le contexte fait la suggestion</Tag>}
  >
    <SecItem n={1}>Comment Copilot lit le contexte : fichier, commentaires, imports</SecItem>
    <SecItem n={2}>Suggestion inline ou Copilot Chat</SecItem>
    <SecItem n={3}>Accepter, refuser ou choisir parmi plusieurs suggestions</SecItem>
    <SecItem n={4}>Lire et analyser une suggestion avant de l’accepter</SecItem>
    <SecItem n={5}>Les limites de la fenêtre de contexte</SecItem>
  </Section>
);
M3_Divider.transition = BLOOM;

// ─── Ce que Copilot voit ────────────────────────────────────────────────────
const M3Seg = ({ icon, tone, title, sub, beat }: { icon: IconName; tone: Tone; title: string; sub: string; beat: number }) => (
  <div className={b.on(beat)} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px', borderRadius: 12, background: T[tone].bg, boxShadow: `inset 5px 0 0 ${STRONG[tone]}` }}>
    <Icon name={icon} size={28} color={T[tone].fg} />
    <div>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 19, color: C.soft }}>{sub}</div>
    </div>
  </div>
);

const M3_Contexte: Page = () => (
  <Frame mod={3} beats={2}>
    <Title>Ce que Copilot lit avant de proposer</Title>
    <Lede>Deux mécanismes, deux contextes. Ce qui n’est pas dans le contexte n’existe pas pour le modèle.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 800, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px' }}>
      <PanelTitle icon="code" c={C.blue}>
        Suggestion inline · texte grisé
      </PanelTitle>
      <CodeDark file="src/tickets.js" size={20}>
        <div style={{ boxShadow: 'inset 4px 0 0 #82AAFF', paddingLeft: 12 }}>
          <Ck>import</Ck> {'{ STATUTS }'} <Ck>from</Ck> <Cs>'./constantes.js'</Cs>;{'\n'}
          <Cc>{'// Vrai si le statut fait partie du flux'}</Cc>
          {'\n'}
          <Ck>export function</Ck> <Cf>estStatutValide</Cf>(statut) {'{'}
        </div>
        <div style={{ paddingLeft: 16 }}>
          {'  '}
          <Ck>return</Ck> <span style={{ color: '#7C86A8', fontStyle: 'italic' }}>STATUTS.includes(statut);</span>
          <span className={A.blink} style={{ display: 'inline-block', width: 3, height: 24, background: '#FFD27A', verticalAlign: 'middle', marginLeft: 2 }} />
        </div>
        <div style={{ boxShadow: 'inset 4px 0 0 #C792EA', paddingLeft: 12 }}>
          {'}'}
          {'\n'}
          <Ck>export function</Ck> <Cf>validerTicket</Cf>(ticket) {'{ … }'}
        </div>
      </CodeDark>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Bullet size={23} tone="blue">
          Le code <em>avant</em> et <em>après</em> le curseur
        </Bullet>
        <Bullet size={23} tone="blue">
          Commentaires, noms, imports, nom du fichier
        </Bullet>
        <Bullet size={23} tone="blue">
          Les onglets ouverts à côté (pas les fichiers fermés)
        </Bullet>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 980, top: 260, width: 820, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 28px' }}>
      <PanelTitle icon="chat" c={C.violet}>
        Copilot Chat · ce qui part au modèle
      </PanelTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <M3Seg icon="gear" tone="grey" title="Instructions de l’outil" sub="fixées par VS Code, invisibles pour vous" beat={1} />
        <M3Seg icon="doc" tone="navy" title="Instructions du dépôt" sub=".github/copilot-instructions.md (Module 8)" beat={1} />
        <M3Seg icon="link" tone="blue" title="Vos références" sub="#file · #selection · #codebase · fichiers glissés" beat={1} />
        <M3Seg icon="loop" tone="yellow" title="L’historique de la conversation" sub="tout ce qui a été dit… erreurs comprises" beat={1} />
        <M3Seg icon="send" tone="violet" title="Votre message" sub="souvent la plus petite partie" beat={1} />
      </div>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 905, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, color: C.ink }}>
      <Icon name="bulb" size={28} color={C.violet} />
      <span>
        <strong>Conséquence :</strong> pour l’inline, soignez le fichier et les onglets ; pour le chat, soignez les références et repartez d’une conversation propre.
      </span>
    </div>
  </Frame>
);

// ─── Fenêtre de contexte ────────────────────────────────────────────────────
const M3Block = ({ w, tone, label, cls }: { w: number; tone: Tone; label: string; cls?: string }) => (
  <div className={cls} style={{ width: w, height: 70, boxSizing: 'border-box', borderRadius: 10, background: T[tone].bg, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, fontWeight: 600, color: T[tone].fg, textAlign: 'center', padding: '0 8px', lineHeight: 1.2 }}>
    {label}
  </div>
);

const M3_Fenetre: Page = () => (
  <Frame mod={3} beats={2}>
    <Title>La fenêtre de contexte : une mémoire de taille fixe</Title>
    <Lede>Le modèle ne lit qu’un nombre limité de « tokens » à la fois (un token ≈ ¾ de mot). Quand c’est plein, quelque chose sort.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1680 }}>
      <Eyebrow c={C.navy} size={20}>
        Ce qui tient dans la fenêtre
      </Eyebrow>
      <div style={{ position: 'relative', marginTop: 14, width: 1400, height: 96, borderRadius: 16, boxShadow: `inset 0 0 0 3px ${C.navy}`, display: 'flex', alignItems: 'center', gap: 8, padding: '0 13px', boxSizing: 'border-box' }}>
        <M3Block w={170} tone="grey" label="Instructions" />
        <M3Block w={260} tone="navy" label="Fichier courant" />
        <M3Block w={230} tone="blue" label="Onglets voisins" />
        <M3Block w={300} tone="yellow" label="Historique du chat" cls={b.on(1)} />
        <M3Block w={180} tone="violet" label="Votre message" />
        <div className={b.on(1)} style={{ position: 'absolute', left: 1420, top: 13 }}>
          <M3Block w={240} tone="coral" label="… tronqué" />
        </div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 470, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <Card icon="eyeOff" tone="coral" title="Symptômes" size={22} pad={24} cls={b.on(1)}>
        Il « oublie » une consigne donnée au début, mélange deux sujets, invente une fonction que vous aviez montrée il y a longtemps.
      </Card>
      <Card icon="filter" tone="blue" title="Moins, mais mieux" size={22} pad={24} cls={b.on(2)}>
        Fermez les onglets sans rapport, joignez le fichier utile avec <Ic>#file</Ic>, plutôt que tout le projet.
      </Card>
      <Card icon="reset" tone="green" title="Repartir propre" size={22} pad={24} cls={b.on(2)}>
        Un sujet = une conversation (<Kbd>Ctrl+N</Kbd>). Conversation longue : <Ic>/compact</Ic> la résume.
      </Card>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(600) }}>
      Grands projets : #codebase laisse Copilot chercher les extraits pertinents, au lieu de tout envoyer.
    </Hint>
  </Frame>
);

// ─── Inline ou chat ─────────────────────────────────────────────────────────
const M3Cell = ({ children, head = false, tone = 'grey' }: { children: ReactNode; head?: boolean; tone?: Tone }) => (
  <div style={{ padding: '18px 22px', fontSize: head ? 26 : 24, fontWeight: head ? 800 : 400, fontFamily: head ? display : body, color: head ? T[tone].fg : C.ink, background: head ? T[tone].bg : C.card, lineHeight: 1.35, borderBottom: `1px solid ${C.rule}` }}>
    {children}
  </div>
);

const M3_InlineVsChat: Page = () => (
  <Frame mod={3}>
    <Title>Suggestion inline ou Copilot Chat : quelle différence ?</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'grid', gridTemplateColumns: '260px repeat(3, minmax(0, 1fr))', borderRadius: 20, overflow: 'hidden', boxShadow: SHADOW }}>
      <M3Cell head> </M3Cell>
      <M3Cell head tone="blue">
        Suggestion inline
      </M3Cell>
      <M3Cell head tone="violet">
        Chat en ligne · Ctrl+I
      </M3Cell>
      <M3Cell head tone="teal">
        Vue Chat · Ask
      </M3Cell>
      <M3Cell>
        <strong>Déclencheur</strong>
      </M3Cell>
      <M3Cell>Vous tapez, il propose</M3Cell>
      <M3Cell>Vous sélectionnez et décrivez</M3Cell>
      <M3Cell>Vous posez une question</M3Cell>
      <M3Cell>
        <strong>Contexte</strong>
      </M3Cell>
      <M3Cell>Autour du curseur, onglets ouverts</M3Cell>
      <M3Cell>La sélection, le fichier</M3Cell>
      <M3Cell>Vos références, l’historique</M3Cell>
      <M3Cell>
        <strong>Résultat</strong>
      </M3Cell>
      <M3Cell>Quelques lignes en texte grisé</M3Cell>
      <M3Cell>Un diff à accepter ou rejeter</M3Cell>
      <M3Cell>Une explication, du code à copier</M3Cell>
      <M3Cell>
        <strong>Idéal pour</strong>
      </M3Cell>
      <M3Cell>Écrire vite ce que vous savez déjà</M3Cell>
      <M3Cell>Retoucher une fonction précise</M3Cell>
      <M3Cell>Comprendre, comparer, apprendre</M3Cell>
      <M3Cell>
        <strong>Coût</strong>
      </M3Cell>
      <M3Cell>Hors crédits IA</M3Cell>
      <M3Cell>Crédits IA</M3Cell>
      <M3Cell>Crédits IA</M3Cell>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 800, width: 1680 }}>
      <Callout tone="blue" icon="bulb" title="Règle simple" size={25} cls={A.in} style={dl(500)}>
        Vous savez ce que vous voulez écrire : inline. Vous savez quoi changer : Ctrl+I. Vous ne savez pas encore : Ask.
      </Callout>
    </div>
  </Frame>
);

// ─── Exercice : le bon outil ────────────────────────────────────────────────
const M3Zone = ({ x, icon, tone, title, sub, answer }: { x: number; icon: IconName; tone: Tone; title: string; sub: string; answer: ReactNode }) => (
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

const M3_ChoisirOutil: Page = () => (
  <Frame mod={3} kind="exercice" beats={1}>
    <Title>À vous : quel outil pour quelle situation ?</Title>
    <Lede>Dites-moi au micro dans quelle colonne va chaque étiquette : je la déplace. Double-clic pour la renvoyer.</Lede>
    <M3Zone x={120} icon="code" tone="blue" title="Inline" sub="texte grisé, Tab, NES" answer="boucle évidente, tableau de constantes, renommage propagé." />
    <M3Zone x={690} icon="pointer" tone="violet" title="Ctrl+I" sub="modifier la sélection" answer="gestion d’erreur ajoutée, JSDoc de la fonction sélectionnée." />
    <M3Zone x={1260} icon="chat" tone="teal" title="Ask" sub="comprendre, comparer" answer="regex héritée, deux approches, message d’erreur du terminal." />
    <Drag x={120} y={780} w={405} tone="grey">Finir une boucle évidente</Drag>
    <Drag x={545} y={780} w={405} tone="grey">Comprendre une regex héritée</Drag>
    <Drag x={970} y={780} w={405} tone="grey">Ajouter la gestion d’erreur ici</Drag>
    <Drag x={1395} y={780} w={405} tone="grey">Écrire un tableau de constantes</Drag>
    <Drag x={120} y={860} w={405} tone="grey">Choisir entre deux approches</Drag>
    <Drag x={545} y={860} w={405} tone="grey">Propager un renommage</Drag>
    <Drag x={970} y={860} w={405} tone="grey">Expliquer une erreur du terminal</Drag>
    <Drag x={1395} y={860} w={405} tone="grey">Documenter la fonction choisie</Drag>
  </Frame>
);

// ─── Simulateur : accepter, refuser, choisir ────────────────────────────────
const M3_ALTS = [
  {
    code: 'return tickets.filter((t) => t.statut === "termine").reduce((s, t) => s + t.points, 0);',
    ok: true,
    verdict: 'Correcte : filtre les terminés, valeur initiale 0 (liste vide → 0).',
  },
  {
    code: 'return tickets.reduce((s, t) => s + t.points);',
    ok: false,
    verdict: 'Fausse : oublie le filtre « termine » et la valeur initiale (liste vide → erreur).',
  },
  {
    code: 'let total = 0; for (const t of tickets) if (t.statut === "termine") total += t.points; return total;',
    ok: true,
    verdict: 'Correcte aussi, plus verbeuse : une question de style d’équipe.',
  },
];

const M3Sim = () => {
  const [alt, setAlt] = useState(0);
  const [taken, setTaken] = useState(0);
  const [state, setState] = useState<'ghost' | 'done' | 'no'>('ghost');
  const words = M3_ALTS[alt].code.match(/\S+\s*/g) ?? [];
  const accepted = state === 'done' ? words.join('') : words.slice(0, taken).join('');
  const ghost = state === 'ghost' ? words.slice(taken).join('') : '';
  const reset = () => {
    setTaken(0);
    setState('ghost');
  };
  return (
    <div>
      <CodeDark file="src/backlog.js" size={22} wrap>
        <Cc>{'// Somme des points des tickets terminés'}</Cc>
        {'\n'}
        <Ck>function</Ck> <Cf>pointsTermines</Cf>(tickets) {'{'}
        {'\n  '}
        <span style={{ color: '#E6EAF6' }}>{accepted}</span>
        <span style={{ color: '#7C86A8', fontStyle: 'italic' }}>{ghost}</span>
        {state === 'no' ? <span style={{ color: '#F28B82' }}>{'  // suggestion refusée'}</span> : null}
        {'\n}'}
      </CodeDark>
      <div style={{ marginTop: 18, display: 'flex', gap: 12, alignItems: 'center' }}>
        <Btn size={20} tone="blue" ghost disabled={state !== 'ghost'} onClick={() => { setAlt((alt + 1) % M3_ALTS.length); setTaken(0); }}>
          Alt+] suivante ({alt + 1}/3)
        </Btn>
        <Btn size={20} tone="teal" ghost disabled={state !== 'ghost'} onClick={() => (taken + 1 >= words.length ? setState('done') : setTaken(taken + 1))}>
          Ctrl+→ un mot
        </Btn>
        <Btn size={20} tone="green" disabled={state !== 'ghost'} onClick={() => setState('done')}>
          Tab accepter
        </Btn>
        <Btn size={20} tone="coral" ghost disabled={state !== 'ghost'} onClick={() => setState('no')}>
          Échap refuser
        </Btn>
        <Btn size={20} tone="grey" ghost icon="reset" onClick={reset} />
      </div>
      <div style={{ marginTop: 18, minHeight: 74, boxSizing: 'border-box', borderRadius: 14, padding: '14px 20px', fontSize: 23, lineHeight: 1.4, background: state === 'done' ? (M3_ALTS[alt].ok ? T.green.bg : T.coral.bg) : T.grey.bg, color: C.ink }}>
        {state === 'done' ? (
          <>
            <strong style={{ color: M3_ALTS[alt].ok ? T.green.fg : T.coral.fg }}>{M3_ALTS[alt].ok ? '✓ ' : '✗ Acceptée trop vite : '}</strong>
            {M3_ALTS[alt].verdict}
          </>
        ) : state === 'no' ? (
          <span>Refusée. Continuez à taper : Copilot reproposera en tenant compte de ce que vous écrivez.</span>
        ) : (
          <span style={{ color: C.muted }}>Lisez la proposition {alt + 1} avant d’appuyer sur Tab. Laquelle est juste ?</span>
        )}
      </div>
    </div>
  );
};

const M3_Simulateur: Page = () => (
  <Frame mod={3} kind="exercice">
    <Title>Accepter, refuser ou choisir : entraînez-vous</Title>
    <Lede>Trois propositions pour la même fonction. Dites-moi au micro laquelle garder, puis je joue les touches.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
      <M3Sim />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 760, width: 1680 }}>
      <Callout tone="yellow" icon="eye" title="Ce que l’exercice montre" size={24} cls={A.fade} style={dl(500)}>
        Les trois propositions ont l’air sûres d’elles. Une seule lecture attentive suffit à écarter la mauvaise : c’est le geste le plus rentable de la formation.
      </Callout>
    </div>
  </Frame>
);

// ─── Lire avant d'accepter ──────────────────────────────────────────────────
const M3Q = ({ n, title, children, d }: { n: number; title: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', ...dl(d) }}>
    <Num n={n} tone="violet" size={40} />
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, color: C.soft, lineHeight: 1.38 }}>{children}</div>
    </div>
  </div>
);

const M3_Lire: Page = () => (
  <Frame mod={3} beats={3}>
    <Title>Lire une suggestion avant de l’accepter : 5 questions</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 760, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <M3Q n={1} title="Fait-elle ce que j’ai demandé ?" d={100}>
        Toute la demande, rien de plus.
      </M3Q>
      <M3Q n={2} title="Ce qu’elle appelle existe-t-il ?" d={200}>
        Fonctions, propriétés, bibliothèques : rien d’inventé.
      </M3Q>
      <M3Q n={3} title="Et les cas limites ?" d={300}>
        Liste vide, null, zéro, doublon, très grand nombre.
      </M3Q>
      <M3Q n={4} title="A-t-elle des effets de bord ?" d={400}>
        Modifie-t-elle ses paramètres, un état global, un fichier ?
      </M3Q>
      <M3Q n={5} title="Puis-je l’expliquer ligne à ligne ?" d={500}>
        Sinon : Ask « explique », ou je refuse.
      </M3Q>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 950, top: 210, width: 850, ...dl(300) }}>
      <CodeDark file="suggestion acceptée sans lecture" size={21}>
        <Cc>{'// Renvoie le dernier ticket créé'}</Cc>
        {'\n'}
        <Ck>function</Ck> <Cf>dernierTicket</Cf>(tickets) {'{'}
        {'\n  '}tickets.<span style={{ background: 'rgba(242,139,130,.25)' }}>sort</span>((a, b) =&gt; a.creeLe.<span style={{ background: 'rgba(242,139,130,.25)' }}>localeCompare</span>(b.creeLe));
        {'\n  '}
        <Ck>return</Ck> tickets[<span style={{ background: 'rgba(242,139,130,.25)' }}>tickets.length</span>];{'\n}'}
      </CodeDark>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className={b.on(1)}>
          <Callout tone="coral" icon="bug" title="Question 4 · effet de bord" size={21}>
            <Ic>sort</Ic> trie le tableau reçu sur place : tout le backlog est réordonné.
          </Callout>
        </div>
        <div className={b.on(2)}>
          <Callout tone="coral" icon="bug" title="Question 3 · cas limite" size={21}>
            <Ic>tickets[tickets.length]</Ic> vaut toujours <Ic>undefined</Ic> : il fallait <Ic>length - 1</Ic>.
          </Callout>
        </div>
        <div className={b.on(3)}>
          <Callout tone="green" icon="check" title="Version relue" size={21}>
            <Ic>{'tickets.toSorted(…).at(-1)'}</Ic>, ou un simple <Ic>reduce</Ic> qui garde le plus récent.
          </Callout>
        </div>
      </div>
    </div>
  </Frame>
);

// ─── Déjeuner ───────────────────────────────────────────────────────────────
const M3_Dejeuner: Page = () => <BreakPage mod={3} title="Bon appétit !" back="Reprise à 14 h 00 : quel outil choisir, puis l’Atelier 3." minutes={90} icon="smile" />;

// ─── Atelier 3 ──────────────────────────────────────────────────────────────
const M3_Lab: Page = () => (
  <LabPage
    mod={3}
    n="3"
    title="Le contexte fait la suggestion"
    defi="contexte"
    who="Individuel · 35 min"
    objective={
      <>
        Prouver par l’expérience que la suggestion dépend de ce que Copilot <strong>voit</strong> (nom seul, onglet voisin, commentaire précis, import), puis trouver <strong>en lisant</strong> trois défauts de code accepté trop vite.
      </>
    }
    where={
      <>
        <PathChip size={19}>katas/03-contexte/</PathChip>
        <br />
        Grille « Atelier 3 » de <PathChip size={19}>JOURNAL.md</PathChip>
      </>
    }
    minutes={35}
    crit={
      <>
        <CheckItem id="l3a" size={21}>Les 4 expériences notées dans le journal</CheckItem>
        <CheckItem id="l3b" size={21}>L’expérience 2 affiche 21.7</CheckItem>
        <CheckItem id="l3c" size={21}>Les 3 défauts trouvés avant d’exécuter</CheckItem>
      </>
    }
    suivi="Points d’étape à 15 min (« Exp. 1 et 2 : quelle différence ? ») et à 30 min."
  >
    <WStep n={1}>
      <strong>Nom seul</strong>, puis <strong>avec un onglet voisin et une JSDoc</strong> : comparez les deux suggestions de <Ic>calculerVelocite</Ic>.
    </WStep>
    <WStep n={2}>Commentaire vague contre précis, puis l’effet d’un import ; parcourez les alternatives.</WStep>
    <WStep n={3}>Expérience 4 : trouvez les 3 défauts en lisant, puis exécutez et comparez avec l’avis du chat.</WStep>
  </LabPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M3_Qcm: Page = () => (
  <Frame mod={3} kind="qcm">
    <Title>QCM · Module 3 en quatre questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Pour qu’une suggestion inline utilise votre fichier de données d’exemple, il faut…" explain="L’inline lit le fichier courant et les onglets ouverts. Un fichier fermé n’est pas dans son contexte.">
        <QOpt>Qu’il soit dans le même dossier</QOpt>
        <QOpt ok>Qu’il soit ouvert dans un onglet</QOpt>
        <QOpt>Le mentionner dans le chat</QOpt>
      </QuizQ>
      <QuizQ q="Au bout d’une heure de conversation, Copilot oublie votre première consigne. Que faire ?" explain="La fenêtre de contexte est pleine ou diluée. Nouvelle conversation avec la consigne et les seuls fichiers utiles, ou /compact.">
        <QOpt>Répéter la consigne en majuscules</QOpt>
        <QOpt>Changer de modèle</QOpt>
        <QOpt ok>Repartir d’une nouvelle conversation avec le contexte utile</QOpt>
      </QuizQ>
      <QuizQ q="Copilot propose tickets[tickets.length] pour « le dernier élément ». Quelle question de relecture l’aurait détecté ?" explain="Les cas limites : l’indice length est toujours hors du tableau. Tester mentalement avec [1, 2, 3] suffit.">
        <QOpt>Ce qu’elle appelle existe-t-il ?</QOpt>
        <QOpt ok>Et les cas limites ?</QOpt>
        <QOpt>A-t-elle des effets de bord ?</QOpt>
      </QuizQ>
      <QuizQ q="Vous voulez seulement comprendre une regex héritée, sans risque de la modifier. Quel outil ?" explain="Ask explique sans toucher au fichier. Ctrl+I propose une modification ; l’inline complète ce que vous tapez.">
        <QOpt ok>La vue Chat, agent Ask</QOpt>
        <QOpt>Le chat en ligne, Ctrl+I</QOpt>
        <QOpt>Une suggestion inline sous la regex</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ═══ 40-m4 ═════════════════════════════════════════════════════════════

// ─── Module 4 · Génération de code simple ───────────────────────────────────

const M4_Divider: Page = () => (
  <Section
    n={4}
    title={
      <>
        Génération de
        <br />
        code simple
      </>
    }
    sub="Des noms et des commentaires qui guident, du code qui se vérifie : le premier morceau de TaskFlow."
    dur="J1 · 14:55 – 16:55"
    labs={<Tag tone="green" size={19}>Atelier 4 · TaskFlow v1, le modèle de ticket</Tag>}
  >
    <SecItem n={1}>Variables, constantes et structures de base</SecItem>
    <SecItem n={2}>Compléter une fonction à partir de son nom ou d’un commentaire</SecItem>
    <SecItem n={3}>Le commentaire comme guide de génération</SecItem>
    <SecItem n={4}>Python, JavaScript, Java : même demande, trois langages</SecItem>
    <SecItem n={5}>Patterns courants et comportements attendus</SecItem>
  </Section>
);
M4_Divider.transition = BLOOM;

// ─── Variables, constantes, structures ──────────────────────────────────────
const Gh = ({ children }: { children: ReactNode }) => <span style={{ color: '#7C86A8', fontStyle: 'italic' }}>{children}</span>;

const M4_Structures: Page = () => (
  <Frame mod={4} kind="demo" beats={2}>
    <Title>Variables, constantes et structures : le terrain favori</Title>
    <Lede>Vous tapez le début, Copilot devine la suite à partir des noms et de ce qu’il voit déjà dans le fichier.</Lede>
    <CodeDark file="src/tickets.js" size={21} cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1000 }}>
      <Cc>{'// Statuts, dans l’ordre du flux'}</Cc>
      {'\n'}
      <Ck>export const</Ck> STATUTS = Object.freeze([<Gh>{'\n  "backlog", "afaire", "encours", "termine",\n]);'}</Gh>
      {'\n\n'}
      <span className={b.fade(1)}>
        <Ck>export const</Ck> LIBELLES = {'{'}
        {'\n'}
        <Gh>{'  backlog: "Backlog",\n  afaire: "À faire",\n  encours: "En cours",\n  termine: "Terminé",\n};'}</Gh>
      </span>
      {'\n\n'}
      <span className={b.fade(2)}>
        <Ck>const</Ck> ticketVide = {'{'}<Gh>{'\n  id: 0, titre: "", type: "tache",\n  priorite: 2, points: null,\n};'}</Gh>
      </span>
    </CodeDark>
    <div style={{ position: 'absolute', left: 1170, top: 270, width: 630, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="check" tone="green" title="Ce qui marche" size={22} pad={24} cls={A.right} style={dl(200)}>
        Des noms du domaine (<Ic>STATUTS</Ic>, <Ic>LIBELLES</Ic>) et un premier exemple : la suite devient évidente.
      </Card>
      <Card icon="eye" tone="yellow" title="Ce qu’on vérifie" size={22} pad={24} cls={b.on(1)}>
        L’ordre, l’orthographe exacte des clés, les accents des libellés, aucune valeur inventée.
      </Card>
      <Card icon="bulb" tone="blue" title="L’astuce" size={22} pad={24} cls={b.on(2)}>
        La 2e structure profite de la 1re : Copilot réutilise les mêmes clés. Écrivez d’abord la plus importante.
      </Card>
    </div>
  </Frame>
);

// ─── Le nom de la fonction ──────────────────────────────────────────────────
const M4_NomFonction: Page = () => (
  <Frame mod={4} beats={1}>
    <Title>Un bon nom vaut un bon prompt</Title>
    <Lede>Le nom et les paramètres sont la première chose que Copilot lit. Ils disent ce que la fonction doit faire.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 820 }}>
      <PanelTitle icon="x" c={C.coral}>
        Nom vague : Copilot devine
      </PanelTitle>
      <CodeDark size={22}>
        <Ck>function</Ck> <Cf>calc</Cf>(x, y) {'{'}
        {'\n  '}
        <Gh>return x * y / 100;</Gh>
        {'\n}'}
      </CodeDark>
      <div style={{ marginTop: 14, fontSize: 22, color: C.soft, lineHeight: 1.4 }}>Un pourcentage ? Une surface ? Le modèle choisit le motif le plus fréquent.</div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 980, top: 270, width: 820 }}>
      <PanelTitle icon="check" c={C.green}>
        Nom précis : Copilot exécute
      </PanelTitle>
      <CodeDark size={20}>
        <Ck>function</Ck> <Cf>convertirPointsEnJours</Cf>(points, pointsParJour = <Cn>2</Cn>) {'{'}
        {'\n  '}
        <Gh>if (points == null) return null;</Gh>
        {'\n  '}
        <Gh>return Math.ceil(points / pointsParJour);</Gh>
        {'\n}'}
      </CodeDark>
      <div style={{ marginTop: 14, fontSize: 22, color: C.soft, lineHeight: 1.4 }}>Verbe + objet + unité, une valeur par défaut : l’intention est sans ambiguïté.</div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 720, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <Callout tone="blue" icon="note" title="Verbe d’action" size={22} cls={A.in} style={dl(400)}>
        convertir, valider, trier, filtrer, compter…
      </Callout>
      <Callout tone="blue" icon="ticket" title="Vocabulaire métier" size={22} cls={A.in} style={dl(500)}>
        ticket, statut, points : les mots du projet
      </Callout>
      <Callout tone="blue" icon="gear" title="Paramètres parlants" size={22} cls={A.in} style={dl(600)}>
        unités, valeurs par défaut, types en JSDoc
      </Callout>
    </div>
  </Frame>
);

// ─── Le commentaire comme guide (interactif) ────────────────────────────────
const M4_ING = [
  { key: 'Entrée', tone: 'blue' as Tone, line: '// Entrée : un ticket { points: number | null }' },
  { key: 'Sortie', tone: 'teal' as Tone, line: '// Sortie : true ou false' },
  { key: 'Règle', tone: 'violet' as Tone, line: '// Règle : null (non estimé) ou valeur de 1, 2, 3, 5, 8, 13' },
  { key: 'Exemple', tone: 'green' as Tone, line: '// Ex. : 5 → true · 4 → false · null → true' },
  { key: 'Contrainte', tone: 'coral' as Tone, line: '// Sans bibliothèque ; "5" (texte) → false' },
];
const M4_OUT = [
  'return points > 0;',
  'return typeof points === "number";',
  'return points === null || points > 0;',
  'return points === null || [1, 2, 3, 5, 8, 13].includes(points);',
  'return points === null || [1, 2, 3, 5, 8, 13].includes(points);',
  'return points === null || POINTS_VALIDES.includes(points); // "5" → false',
];

const M4Builder = () => {
  const [on, setOn] = useState([false, false, false, false, false]);
  const n = on.filter(Boolean).length;
  const quality = n <= 1 ? 'coral' : n <= 3 ? 'yellow' : 'green';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '440px minmax(0, 1fr)', gap: 36 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {M4_ING.map((g, i) => (
          <Toggle key={g.key} on={on[i]} tone={g.tone} size={24} label={<span style={{ fontWeight: 600 }}>{g.key}</span>} onChange={(v) => setOn(on.map((x, j) => (j === i ? v : x)))} />
        ))}
        <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
          <Btn size={19} icon="sparkles" onClick={() => setOn([true, true, true, true, true])}>
            Tout
          </Btn>
          <Btn size={19} icon="reset" ghost tone="grey" onClick={() => setOn([false, false, false, false, false])}>
            Rien
          </Btn>
        </div>
      </div>
      <div>
        <CodeDark file="src/tickets.js" size={21}>
          <Cc>{'// Vérifie les points'}</Cc>
          {M4_ING.map((g, i) => (on[i] ? <Cc key={g.key}>{`\n${g.line}`}</Cc> : null))}
          {'\n'}
          <Ck>function</Ck> <Cf>estPointsValide</Cf>(points) {'{'}
          {'\n  '}
          <Gh>{M4_OUT[n]}</Gh>
          {'\n}'}
        </CodeDark>
        <div style={{ marginTop: 16, borderRadius: 14, padding: '14px 20px', fontSize: 23, lineHeight: 1.4, background: T[quality].bg, color: C.ink }}>
          <strong style={{ color: T[quality].fg }}>{n}/5 ingrédients · </strong>
          {n <= 1 ? 'Copilot devine : « 4 » passerait.' : n <= 3 ? 'Mieux, mais un cas limite reste ouvert.' : 'Précis et vérifiable : la suggestion respecte la règle et ses pièges.'}
        </div>
      </div>
    </div>
  );
};

const M4_Commentaire: Page = () => (
  <Frame mod={4} kind="exercice">
    <Title>Le commentaire comme guide : 5 ingrédients</Title>
    <Lede>Dites-moi quel ingrédient ajouter au micro : j’active, et l’on regarde la suggestion probable évoluer.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
      <M4Builder />
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(500) }}>
      Suggestions illustratives : en vrai, chaque essai varie. Mais la tendance est toujours la même.
    </Hint>
  </Frame>
);

// ─── Trois langages ─────────────────────────────────────────────────────────
const M4_Langages: Page = () => (
  <Frame mod={4} kind="demo">
    <Title>Même commentaire, trois langages</Title>
    <Lede>Copilot connaît la syntaxe et les idiomes de chaque langage. Cliquez un onglet : la règle métier ne change pas, l’écriture si.</Lede>
    <LangTabs initial="JavaScript" cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <LangBtn lang="JavaScript" tone="yellow" />
        <LangBtn lang="Python" tone="green" />
        <LangBtn lang="Java" tone="coral" />
      </div>
      <LangPane lang="JavaScript">
        <CodeDark file="src/tickets.js" size={21}>
          <Cc>{'// Vrai si points vaut null ou 1, 2, 3, 5, 8, 13'}</Cc>
          {'\n'}
          <Ck>export function</Ck> <Cf>estPointsValide</Cf>(points) {'{'}
          {'\n  '}
          <Gh>return points === null || POINTS_VALIDES.includes(points);</Gh>
          {'\n}'}
        </CodeDark>
      </LangPane>
      <LangPane lang="Python">
        <CodeDark file="katas/python/tickets.py" size={21}>
          <Cc>{'# Vrai si points vaut None ou 1, 2, 3, 5, 8, 13'}</Cc>
          {'\n'}
          <Ck>def</Ck> <Cf>est_points_valide</Cf>(points) -&gt; <Cn>bool</Cn>:{'\n    '}
          <Gh>{'if points is None:\n        return True\n    return type(points) is int and points in POINTS_VALIDES'}</Gh>
        </CodeDark>
      </LangPane>
      <LangPane lang="Java">
        <CodeDark file="katas/java/Ticket.java" size={21}>
          <Cc>{'// Vrai si points vaut null ou 1, 2, 3, 5, 8, 13'}</Cc>
          {'\n'}
          <Ck>static boolean</Ck> <Cf>estPointsValide</Cf>(Integer points) {'{'}
          {'\n    '}
          <Gh>return points == null || POINTS_VALIDES.contains(points);</Gh>
          {'\n}'}
        </CodeDark>
      </LangPane>
    </LangTabs>
    <div style={{ position: 'absolute', left: 1230, top: 270, width: 570, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="bug" tone="coral" title="Le piège qui change" size={22} pad={24} cls={A.right} style={dl(200)}>
        En Python, <Ic>True == 1</Ic> : sans <Ic>type(points) is int</Ic>, un booléen passerait. Copilot l’oublie presque toujours.
      </Card>
      <Card icon="layers" tone="blue" title="Ce qui ne change pas" size={22} pad={24} cls={A.right} style={dl(350)}>
        Le commentaire, la règle, les tests d’acceptation. Variantes Python et Java fournies dans <Ic>katas/</Ic>.
      </Card>
    </div>
  </Frame>
);

// ─── Patterns courants ──────────────────────────────────────────────────────
const M4Pat = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <Card icon={icon} tone={tone} title={title} size={22} pad={24} cls={A.in} style={dl(d)}>
    {children}
  </Card>
);

const M4_Patterns: Page = () => (
  <Frame mod={4}>
    <Title>Les patterns que Copilot reconnaît au premier coup d’œil</Title>
    <Lede>Plus un motif est répandu, plus la suggestion est rapide et fiable. Écrivez le premier cas, il fait les suivants.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <M4Pat icon="loop" tone="blue" title="La répétition" d={100}>
        Un cas de <Ic>switch</Ic> ou une ligne de table de correspondance : il écrit les autres.
      </M4Pat>
      <M4Pat icon="reset" tone="teal" title="Le miroir" d={180}>
        <Ic>exporterCsv</Ic> après <Ic>parserCsv</Ic>, <Ic>set</Ic> après <Ic>get</Ic> : la fonction inverse.
      </M4Pat>
      <M4Pat icon="layers" tone="violet" title="La série" d={260}>
        Jours, mois, codes HTTP, suite de Fibonacci : il complète la liste.
      </M4Pat>
      <M4Pat icon="doc" tone="navy" title="Le squelette" d={340}>
        <Ic>try / catch</Ic>, boucle de lecture, export de module, en-tête de test.
      </M4Pat>
      <M4Pat icon="route" tone="green" title="La conversion" d={420}>
        Dates, unités, formats : à condition de préciser l’entrée et la sortie.
      </M4Pat>
      <M4Pat icon="flask" tone="pink" title="Le test jumeau" d={500}>
        Un premier test écrit, et les cas voisins arrivent un par un.
      </M4Pat>
    </div>
  </Frame>
);

// ─── Comportements attendus ─────────────────────────────────────────────────
const M4_Comportements: Page = () => (
  <Frame mod={4} beats={1}>
    <Title>Comportement attendu : Copilot imite votre fichier</Title>
    <Lede>Il prolonge le style qu’il voit, le bon comme le mauvais. Même demande, deux fichiers :</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 820 }}>
      <PanelTitle icon="archive" c={C.coral}>
        Dans le vieux fichier legacy
      </PanelTitle>
      <CodeDark file="src/legacy/kanban-legacy.js" size={21}>
        <Ck>var</Ck> LIMITE = <Cn>3</Cn>;{'\n'}
        <Ck>function</Ck> <Cf>compter</Cf>(l, s) {'{'}
        {'\n  '}
        <Gh>{'var n = 0;\n  for (var k = 0; k < l.length; k++)\n    if (l[k].statut == s) n = n + 1;\n  return n;'}</Gh>
        {'\n}'}
      </CodeDark>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 980, top: 262, width: 820 }}>
      <PanelTitle icon="check" c={C.green}>
        Dans le fichier moderne
      </PanelTitle>
      <CodeDark file="src/kanban.js" size={21}>
        <Ck>export const</Ck> LIMITE_WIP = <Cn>3</Cn>;{'\n'}
        <Ck>export function</Ck> <Cf>compterParStatut</Cf>(tickets, statut) {'{'}
        {'\n  '}
        <Gh>{'return tickets.filter((t) => t.statut === statut).length;'}</Gh>
        {'\n}'}
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 690, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <Callout tone="yellow" icon="eye" title="Il imite" size={22} cls={A.in} style={dl(400)}>
        var, ==, noms d’une lettre : il continue. Nettoyez d’abord, générez ensuite.
      </Callout>
      <Callout tone="yellow" icon="sparkles" title="Il invente" size={22} cls={A.in} style={dl(500)}>
        Une fonction voisine plausible mais absente : vérifiez qu’elle existe.
      </Callout>
      <Callout tone="yellow" icon="clock" title="Il date" size={22} cls={A.in} style={dl(600)}>
        Une syntaxe ou une API d’il y a quelques années : vérifiez la version.
      </Callout>
    </div>
  </Frame>
);

// ─── Pause ──────────────────────────────────────────────────────────────────
const M4_Pause: Page = () => <BreakPage mod={4} title="Pause" back="Reprise à 15 h 55 : l’Atelier 4, le premier morceau de TaskFlow." minutes={15} />;

// ─── Atelier 4 ──────────────────────────────────────────────────────────────
const M4_Lab: Page = () => (
  <LabPage
    mod={4}
    n="4"
    title="TaskFlow v1 : le modèle de ticket"
    defi="commentaire"
    who="Individuel · 55 min"
    feats={<Tag tone="grey" size={19}>Variantes Python · Java</Tag>}
    objective={
      <>
        Générer, <strong>commentaire par commentaire</strong>, les constantes, <Ic>estPointsValide</Ic>, <Ic>validerTicket</Ic> et <Ic>creerTicket</Ic>. Les <strong>8 tests d’acceptation</strong> fournis passent au vert, sans être modifiés.
      </>
    }
    where={
      <>
        <PathChip size={19}>src/tickets.js</PathChip>
        <br />
        <PathChip size={19}>npm run test:atelier4</PathChip> au vert
        <br />
        Un commit « Atelier 4 »
      </>
    }
    minutes={55}
    crit={
      <>
        <CheckItem id="l4a" size={21}>8 tests au vert, tests intacts</CheckItem>
        <CheckItem id="l4b" size={21}>Points 4 et "5" refusés</CheckItem>
        <CheckItem id="l4c" size={21}>Aucun new Date() dans tickets.js</CheckItem>
      </>
    }
    suivi="Points d’étape à 15 min (constantes), 30 min (validerTicket), 45 min (tout vert ?)."
  >
    <WStep n={1}>
      <Ic>npm run test:atelier4</Ic> : lisez les échecs, ce sont vos spécifications.
    </WStep>
    <WStep n={2}>Une fonction à la fois : curseur sous le commentaire, lire, accepter ou préciser le commentaire, tester.</WStep>
    <WStep n={3}>Tout est vert ? Commit, puis la variante Python ou Java de votre choix.</WStep>
  </LabPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M4_Qcm: Page = () => (
  <Frame mod={4} kind="qcm">
    <Title>QCM · Module 4 en quatre questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Copilot propose points > 0 && points <= 13 pour valider une estimation. Le problème ?" explain="La suite 1-2-3-5-8-13 est une liste, pas un intervalle : 4, 6 ou 7 passeraient. Un exemple négatif dans le commentaire (« 4 → false ») l’évite.">
        <QOpt>Aucun, c’est plus court</QOpt>
        <QOpt ok>4, 6, 7… passeraient : c’est une liste, pas un intervalle</QOpt>
        <QOpt>Il faudrait points {'>='} 0</QOpt>
      </QuizQ>
      <QuizQ q="Quel ingrédient de commentaire réduit le plus les cas limites oubliés ?" explain="Les exemples, surtout négatifs (4 → false, null → true), forcent la suggestion à couvrir les bords.">
        <QOpt>Le nom de l’auteur</QOpt>
        <QOpt ok>Des exemples, y compris des cas refusés</QOpt>
        <QOpt>La date de création</QOpt>
      </QuizQ>
      <QuizQ q="Dans un fichier rempli de var et de ==, Copilot propose du code… avec var et ==. Pourquoi ?" explain="Il imite le style visible dans le contexte. Nettoyer le fichier (ou générer dans un fichier propre) change les suggestions.">
        <QOpt>Son modèle date de 2015</QOpt>
        <QOpt ok>Il prolonge le style qu’il voit dans le fichier</QOpt>
        <QOpt>Les réglages de VS Code l’imposent</QOpt>
      </QuizQ>
      <QuizQ q="En Python, quel cas Copilot oublie-t-il souvent pour est_points_valide ?" explain="True == 1 en Python : sans vérifier type(points) is int, un booléen serait accepté comme 1 point.">
        <QOpt>None</QOpt>
        <QOpt ok>True, qui vaut 1</QOpt>
        <QOpt>13</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Bilan du Jour 1 ────────────────────────────────────────────────────────
const M4Key = ({ n, tone, title, children, d }: { n: number; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', background: C.card, borderRadius: 18, boxShadow: SHADOW_SM, padding: '20px 24px', ...dl(d) }}>
    <Num n={n} tone={tone} size={46} />
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, color: C.soft, lineHeight: 1.4, marginTop: 4 }}>{children}</div>
    </div>
  </div>
);

const M4_Bilan: Page = () => (
  <Frame mod={4} kind="synthese" label="Bilan du Jour 1">
    <Title>Bilan du Jour 1 : quatre réflexes acquis</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 22 }}>
      <M4Key n={1} tone="blue" title="Copilot prédit, il ne vérifie pas" d={100}>
        Du code plausible, à rendre correct par la lecture et les tests.
      </M4Key>
      <M4Key n={2} tone="navy" title="Un poste réglé, des gestes au clavier" d={200}>
        Tab, Échap, Ctrl+→, Alt+], Ctrl+I, Ctrl+Alt+I : sans souris.
      </M4Key>
      <M4Key n={3} tone="teal" title="Le contexte fait la suggestion" d={300}>
        Onglets utiles ouverts, conversation propre, références explicites.
      </M4Key>
      <M4Key n={4} tone="green" title="Le commentaire est un prompt" d={400}>
        Entrée, sortie, règle, exemple, contrainte : et un test pour prouver.
      </M4Key>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 560, width: 1680, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', ...dl(600) }}>
      <PanelTitle icon="users">Restitution : deux minutes chacun, au micro</PanelTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24, marginTop: 4 }}>
        <Bullet size={23}>Combien de tests verts à l’Atelier 4 ?</Bullet>
        <Bullet size={23}>Une suggestion que vous avez eu raison de refuser</Bullet>
        <Bullet size={23}>Le réglage ou le geste qui vous a le plus servi</Bullet>
      </div>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 830, ...dl(800) }}>
      Au-delà de 10 participants : 5 ou 6 volontaires au micro, les autres dans le clavardage.
    </Hint>
  </Frame>
);

// ─── Billet de sortie ───────────────────────────────────────────────────────
const M4_Sortie: Page = () => (
  <Frame mod={4} kind="exercice" label="Fin du Jour 1">
    <Title>Billet de sortie, et rendez-vous demain</Title>
    <Lede>Une phrase chacun, au micro : ce que vous retenez, ce qui reste flou.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 960, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M4Key n={1} tone="blue" title="Ce que je retiens" d={100}>
        Le geste ou l’idée que vous utiliserez dès demain matin.
      </M4Key>
      <M4Key n={2} tone="yellow" title="Ce qui reste flou" d={200}>
        J’y réponds en ouverture du Jour 2.
      </M4Key>
      <M4Key n={3} tone="green" title="Mon score d’atelier" d={300}>
        Nombre de tests verts sur 8, à noter dans JOURNAL.md.
      </M4Key>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1140, top: 262, width: 660, ...dl(400) }}>
      <Card icon="rocket" tone="violet" title="Demain · Jour 2" size={23} pad={28}>
        TaskFlow grandit : fonctions complètes et classe, import CSV et API, refactoring d’un vieux code, vraie suite de tests, et une revue où vous chasserez 8 défauts.
        <div style={{ marginTop: 18, fontSize: 21, color: C.muted }}>9 h 00 · quiz de reprise sur le Jour 1. Pas fini l’Atelier 4 ? Le point de reprise est dans <Ic>reprises/</Ic>.</div>
      </Card>
    </div>
  </Frame>
);

// ═══ 45-j2 ═════════════════════════════════════════════════════════════

// ─── Jour 2 · Reprise ───────────────────────────────────────────────────────

const J2_Cover: Page = () => (
  <Frame mod={10} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={170} r={46} cls={A.fade} />
    <div style={{ position: 'absolute', left: 390, top: 170, width: 1420 }}>
      <div className={A.in} style={{ display: 'flex', gap: 12 }}>
        <Tag tone="violet" size={22}>
          <Icon name="calendar" size={22} /> Jour 2 · 9 h 00 – 17 h 30
        </Tag>
        <Tag tone="teal" size={22}>
          <Icon name="globe" size={22} /> Classe virtuelle
        </Tag>
      </div>
      <h1 className={A.in} style={{ margin: '34px 0 0', fontFamily: display, fontWeight: 800, fontSize: 104, lineHeight: 1.04, letterSpacing: '-0.02em', color: C.navy, ...dl(120) }}>
        Approfondissement
        <br />
        <span style={{ color: C.violet }}>et bonnes pratiques</span>
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 30, lineHeight: 1.45, color: C.soft, maxWidth: 1100, ...dl(240) }}>
        Fonctions complètes et classes, refactoring, tests unitaires, vérification : TaskFlow devient un vrai petit logiciel, prouvé par ses tests.
      </p>
      <div className={A.in} style={{ marginTop: 40, display: 'flex', gap: 12, ...dl(400) }}>
        <Tag tone="teal" size={20}>M5 · Fonctions</Tag>
        <Tag tone="violet" size={20}>M6 · Refactoring</Tag>
        <Tag tone="pink" size={20}>M7 · Tests</Tag>
        <Tag tone="coral" size={20}>M8 · Vérification</Tag>
      </div>
    </div>
    <div className={A.pop} style={{ position: 'absolute', left: 1500, top: 790, ...dl(600) }}>
      <DapLogo size={40} />
    </div>
    <Footer left={390} />
  </Frame>
);
J2_Cover.transition = BLOOM;

const J2_Quiz: Page = () => (
  <Frame mod={10} kind="quiz">
    <Title>Quiz de reprise : le Jour 1 en cinq questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Pourquoi Copilot peut-il proposer du code faux avec assurance ?" explain="Il prédit la suite la plus probable ; il n’exécute rien et n’a pas d’intention. Plausible n’est pas correct.">
        <QOpt>Parce que son modèle est trop ancien</QOpt>
        <QOpt ok>Parce qu’il prédit du code plausible, sans l’exécuter</QOpt>
        <QOpt>Parce que la connexion est lente</QOpt>
      </QuizQ>
      <QuizQ q="Quel geste accepte une suggestion mot par mot ?" explain="Ctrl+→ (Cmd+→ sur macOS). Tab accepte tout, Alt+] change de proposition.">
        <QOpt>Tab</QOpt>
        <QOpt ok>Ctrl+→</QOpt>
        <QOpt>Alt+]</QOpt>
      </QuizQ>
      <QuizQ q="Une suggestion inline peut-elle s’appuyer sur un fichier fermé du projet ?" explain="Non : l’inline lit le fichier courant et les onglets ouverts. Ouvrez le fichier utile dans un onglet voisin.">
        <QOpt>Oui, il indexe tout le projet</QOpt>
        <QOpt ok>Non, seulement le fichier courant et les onglets ouverts</QOpt>
        <QOpt>Oui, si le fichier est dans le même dossier</QOpt>
      </QuizQ>
      <QuizQ q="Quel ingrédient d’un commentaire ferme le mieux les cas limites ?" explain="Les exemples, surtout négatifs : « 4 → false » empêche la suggestion « intervalle ».">
        <QOpt>La règle seule</QOpt>
        <QOpt ok>Des exemples, dont des cas refusés</QOpt>
        <QOpt>Un ton impératif</QOpt>
      </QuizQ>
      <QuizQ q="À l’Atelier 4, un test d’acceptation échoue. Que faites-vous ?" explain="Les tests fournis sont la spécification : on corrige le code (ou le commentaire qui le guide), jamais le test.">
        <QOpt>Je modifie le test pour qu’il passe</QOpt>
        <QOpt ok>Je corrige le code ou je précise le commentaire-guide</QOpt>
        <QOpt>Je supprime le test</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const J2_Programme: Page = () => (
  <Frame mod={10}>
    <Title>Programme du Jour 2 : TaskFlow devient un vrai logiciel</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1040, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <OSlot t="9:15" mod="M5" title="Fonctions et blocs de code" sub="Fonctions complètes, classe, fichier, API HTTP, CSV, JSDoc · Atelier 5" tone="teal" d={100} />
      <OSlot t="10:45" title="Pause" tone="yellow" d={160} />
      <OSlot t="11:00" mod="M6" title="Refactoring avec Copilot" sub="Le vieux code de 2019 · Atelier 6" tone="violet" d={220} />
      <OSlot t="12:30" title="Déjeuner" tone="yellow" d={280} />
      <OSlot t="14:00" mod="M7" title="Tests unitaires avec Copilot" sub="Générer, organiser, vérifier, mocks · Atelier 7" tone="pink" d={340} />
      <OSlot t="15:15" mod="M8" title="Bonnes pratiques et vérification" sub="Checklist, hallucinations, droits, revue · Atelier 8" tone="coral" d={400} />
      <OSlot t="16:40" mod="M9" title="Les agents dans Copilot" sub="Agents, Skills, orchestration · Atelier 9" tone="violet" d={430} />
      <OSlot t="17:20" title="Auto-positionnement, évaluation, clôture" tone="grey" d={460} />
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1230, top: 210, width: 570, ...dl(300) }}>
      <Card icon="chat" tone="yellow" title="Vos points flous d’hier" size={23} pad={26}>
        Je réponds ici aux questions laissées dans le billet de sortie.
        <div style={{ marginTop: 14, fontSize: 21, color: C.muted, fontStyle: 'italic' }}>Atelier 4 pas terminé ? Copiez reprises/fin-atelier-04/tickets.js dans src/ avant 9 h 55.</div>
      </Card>
    </div>
  </Frame>
);

// ═══ 50-m5 ═════════════════════════════════════════════════════════════

// ─── Module 5 · Génération de fonctions et blocs de code ────────────────────

const M5_Divider: Page = () => (
  <Section
    n={5}
    title={
      <>
        Fonctions et
        <br />
        blocs de code
      </>
    }
    sub="Des fonctions complètes, une classe, un fichier structuré, des appels HTTP et de la documentation."
    dur="J2 · 9:15 – 10:45"
    labs={<Tag tone="green" size={19}>Atelier 5 · backlog, classe et import</Tag>}
  >
    <SecItem n={1}>Fonctions complètes avec paramètres et retours</SecItem>
    <SecItem n={2}>Classes et méthodes</SecItem>
    <SecItem n={3}>Structurer un fichier source avec Copilot</SecItem>
    <SecItem n={4}>Appels HTTP et parseurs</SecItem>
    <SecItem n={5}>Documentation JSDoc et docstring</SecItem>
  </Section>
);
M5_Divider.transition = BLOOM;

// ─── Signature d'abord ──────────────────────────────────────────────────────
const M5Step = ({ n, tone, title, children, beat }: { n: number; tone: Tone; title: string; children: ReactNode; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
    <Num n={n} tone={tone} size={44} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 21, color: C.soft, lineHeight: 1.4 }}>{children}</div>
    </div>
  </div>
);

const M5_Fonction: Page = () => (
  <Frame mod={5} kind="demo" beats={2}>
    <Title>Une fonction complète : la signature d’abord</Title>
    <Lede>Vous fixez le contrat (nom, paramètres, retour), Copilot écrit le corps, le test tranche.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 26 }}>
      <M5Step n={1} tone="blue" title="Le contrat" beat={0}>
        <Ic>/**</Ic> + Entrée au-dessus de la signature : Copilot propose la JSDoc, vous la corrigez.
      </M5Step>
      <M5Step n={2} tone="violet" title="Le corps" beat={1}>
        Curseur dans la fonction : il écrit en respectant le contrat. Lisez avant Tab.
      </M5Step>
      <M5Step n={3} tone="green" title="La preuve" beat={2}>
        <Ic>npm run test:atelier5</Ic> immédiatement, avant la fonction suivante.
      </M5Step>
    </div>
    <CodeDark file="src/backlog.js" size={20} cls={A.in} style={{ position: 'absolute', left: 740, top: 262, width: 1060, ...dl(200) }}>
      <Cc>{'/**\n * Trie le backlog : priorité croissante, puis points (non estimés en bas), puis id.\n * @param {Ticket[]} tickets\n * @returns {Ticket[]} un NOUVEAU tableau ; l’original n’est pas modifié\n */'}</Cc>
      {'\n'}
      <Ck>export function</Ck> <Cf>trierBacklog</Cf>(tickets) {'{'}
      <span className={b.fade(1)}>
        {'\n  '}
        <Gh>{'const pts = (t) => (t.points === null ? Infinity : t.points);\n  return [...tickets].sort(\n    (a, b) => a.priorite - b.priorite || pts(a) - pts(b) || a.id - b.id,\n  );'}</Gh>
      </span>
      {'\n}'}
    </CodeDark>
    <div className={b.on(2)} style={{ position: 'absolute', left: 740, top: 690, width: 1060 }}>
      <Callout tone="green" icon="flask" title="Ce que le test vérifie, et pas vous" size={22}>
        L’ordre exact des 12 tickets, et que le tableau d’origine est intact : le <Ic>[...tickets]</Ic> n’est pas un détail.
      </Callout>
    </div>
  </Frame>
);

// ─── Ce que Copilot oublie ──────────────────────────────────────────────────
const M5Gap = ({ icon, title, children, d }: { icon: IconName; title: string; children: ReactNode; d: number }) => (
  <Card icon={icon} tone="coral" title={title} size={22} pad={24} cls={A.in} style={dl(d)}>
    {children}
  </Card>
);

const M5_Oublis: Page = () => (
  <Frame mod={5}>
    <Title>Les six cas que Copilot oublie le plus souvent</Title>
    <Lede>Mettez-les dans le commentaire, ou vérifiez-les dans la suggestion. Ils font la différence entre « ça marche » et « c’est juste ».</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <M5Gap icon="inbox" title="La liste vide" d={100}>
        <Ic>0 / 0</Ic> donne <Ic>NaN</Ic> ; <Ic>reduce</Ic> sans valeur initiale lève une erreur.
      </M5Gap>
      <M5Gap icon="eyeOff" title="null et undefined" d={180}>
        Un ticket non estimé, un champ absent : chaque accès doit y survivre.
      </M5Gap>
      <M5Gap icon="reset" title="La mutation de l’entrée" d={260}>
        <Ic>sort</Ic>, <Ic>push</Ic>, <Ic>splice</Ic> modifient le tableau reçu.
      </M5Gap>
      <M5Gap icon="scale" title="Les égalités" d={340}>
        Deux tickets de même priorité et mêmes points : quel ordre ?
      </M5Gap>
      <M5Gap icon="gauge" title="Les bornes" d={420}>
        3 caractères, 80 caractères, 3 tickets en cours : inclus ou exclus ?
      </M5Gap>
      <M5Gap icon="alert" title="L’entrée invalide" d={500}>
        Texte au lieu d’un nombre, type inconnu : erreur claire, pas plantage.
      </M5Gap>
    </div>
  </Frame>
);

// ─── Classes ────────────────────────────────────────────────────────────────
const M5_Classe: Page = () => (
  <Frame mod={5} kind="demo" beats={2}>
    <Title>Générer une classe et ses méthodes</Title>
    <Lede>Le nom et le commentaire de la classe donnent le plan ; Copilot propose les méthodes une à une.</Lede>
    <CodeDark file="src/backlog.js" size={20} cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1000 }}>
      <Cc>{'/** Un backlog : une liste de tickets et ses opérations. */'}</Cc>
      {'\n'}
      <Ck>export class</Ck> <Cf>Backlog</Cf> {'{'}
      {'\n  '}#tickets;{'\n  '}#aujourdHui;{'\n\n  '}
      <Ck>constructor</Ck>(tickets = [], {'{ aujourdHui }'}) {'{'}
      {'\n    '}
      <Gh>{'this.#tickets = tickets.map((t) => ({ ...t }));'}</Gh>
      {'\n    '}
      <Gh>this.#aujourdHui = aujourdHui;</Gh>
      {'\n  }'}
      <span className={b.fade(1)}>
        {'\n\n  '}
        <Gh>{'ajouter(donnees) {\n    const id = this.#tickets.reduce((m, t) => Math.max(m, t.id), 0) + 1;\n    …\n  }'}</Gh>
      </span>
      <span className={b.fade(2)}>
        {'\n\n  '}
        <Gh>{'get stats() {\n    return statistiques(this.#tickets);\n  }'}</Gh>
      </span>
      {'\n}'}
    </CodeDark>
    <div style={{ position: 'absolute', left: 1170, top: 262, width: 630, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="lock" tone="violet" title="Champs privés" size={22} pad={22} cls={A.right} style={dl(200)}>
        <Ic>#tickets</Ic> : personne ne modifie la liste sans passer par les méthodes.
      </Card>
      <Card icon="archive" tone="blue" title="Le constructeur copie" size={22} pad={22} cls={b.on(1)}>
        Sinon, supprimer dans le backlog supprimerait aussi dans le tableau d’origine.
      </Card>
      <Card icon="layers" tone="green" title="Il réutilise vos fonctions" size={22} pad={22} cls={b.on(2)}>
        <Ic>statistiques</Ic> existe déjà dans le fichier : Copilot l’appelle au lieu de la réécrire.
      </Card>
    </div>
  </Frame>
);

// ─── Structurer un fichier ──────────────────────────────────────────────────
const M5Part = ({ n, title, sub, tone, d }: { n: number; title: string; sub: string; tone: Tone; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderRadius: 14, background: T[tone].bg, boxShadow: `inset 6px 0 0 ${STRONG[tone]}`, ...dl(d) }}>
    <span style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: T[tone].fg, width: 34 }}>{n}</span>
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, color: C.soft }}>{sub}</div>
    </div>
  </div>
);

const M5_Fichier: Page = () => (
  <Frame mod={5}>
    <Title>Structurer un fichier source avec Copilot</Title>
    <Lede>Demandez d’abord le plan, en Ask ; remplissez-le ensuite, bloc par bloc, en inline.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 820, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px' }}>
      <PanelTitle icon="chat" c={C.teal}>
        Le prompt de plan
      </PanelTitle>
      <div style={{ fontSize: 23, lineHeight: 1.5, color: C.ink }}>
        <Pr>« #file:src/backlog.js — Propose le plan de ce fichier : sections dans l’ordre, signature JSDoc de chaque export, sans écrire les corps. Respecte le style de src/tickets.js. »</Pr>
      </div>
      <div style={{ marginTop: 18, fontSize: 21, color: C.soft, lineHeight: 1.45 }}>
        Vous relisez le plan, vous le corrigez, puis vous collez les signatures dans le fichier : le contexte est prêt pour l’inline.
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1000, top: 262, width: 800, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M5Part n={1} title="Imports" sub="ce dont le fichier dépend, rien de plus" tone="grey" d={200} />
      <M5Part n={2} title="Constantes" sub="valeurs du domaine, figées" tone="navy" d={280} />
      <M5Part n={3} title="Fonctions internes" sub="petites aides non exportées" tone="blue" d={360} />
      <M5Part n={4} title="Fonctions exportées" sub="le contrat public, avec JSDoc" tone="teal" d={440} />
      <M5Part n={5} title="Classe" sub="qui s’appuie sur les fonctions" tone="violet" d={520} />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 800, width: 1680 }}>
      <Callout tone="blue" icon="target" title="Un fichier, une responsabilité" size={23} cls={A.in} style={dl(700)}>
        backlog.js trie et compte, api.js importe, kanban.js déplace : des fichiers courts donnent un meilleur contexte à Copilot.
      </Callout>
    </div>
  </Frame>
);

// ─── Appels HTTP ────────────────────────────────────────────────────────────
const M5_HTTP: Page = () => (
  <Frame mod={5} beats={1}>
    <Title>Travailler avec des API : les appels HTTP</Title>
    <Lede>Copilot écrit un fetch en une seconde. Les trois oublis classiques : le statut HTTP, la forme des données, la testabilité.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 820 }}>
      <PanelTitle icon="x" c={C.coral}>
        Première suggestion, acceptée telle quelle
      </PanelTitle>
      <CodeDark file="src/api.js" size={20}>
        <Ck>export async function</Ck> <Cf>chargerTickets</Cf>(url) {'{'}
        {'\n  '}
        <Ck>const</Ck> r = <Ck>await</Ck> fetch(url);{'\n  '}
        <Ck>return</Ck> r.json();{'\n}'}
      </CodeDark>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Bullet size={22} tone="coral">Une erreur 500 passe pour un succès</Bullet>
        <Bullet size={22} tone="coral">Un objet au lieu d’un tableau casse l’affichage</Bullet>
        <Bullet size={22} tone="coral">Impossible à tester sans réseau</Bullet>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 980, top: 270, width: 820 }}>
      <PanelTitle icon="check" c={C.green}>
        Après un commentaire précis et une relecture
      </PanelTitle>
      <CodeDark file="src/api.js" size={18}>
        <Ck>export async function</Ck> <Cf>chargerTickets</Cf>(url, {'{'} fetchFn = fetch {'}'} = {'{}'}) {'{'}
        {'\n  '}
        <Ck>const</Ck> r = <Ck>await</Ck> fetchFn(url);{'\n  '}
        <Ck>if</Ck> (!r.ok) <Ck>throw new</Ck> Error(<Cs>{'`HTTP ${r.status}`'}</Cs>);{'\n  '}
        <Ck>const</Ck> data = <Ck>await</Ck> r.json();{'\n  '}
        <Ck>if</Ck> (!Array.isArray(data)) <Ck>throw new</Ck> Error(<Cs>"Format inattendu"</Cs>);{'\n  '}
        <Ck>return</Ck> data;{'\n}'}
      </CodeDark>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Bullet size={22} tone="green">Statut vérifié, format vérifié</Bullet>
        <Bullet size={22} tone="green">fetchFn injectable : testable à l’Atelier 7</Bullet>
        <Bullet size={22} tone="green">Aucun jeton ni URL secrète dans le code</Bullet>
      </div>
    </div>
  </Frame>
);

// ─── Parseurs ───────────────────────────────────────────────────────────────
const M5Trap = ({ n, children }: { n: number; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
    <Num n={n} tone="coral" size={32} style={{ marginTop: 2 }} />
    <span style={{ fontSize: 22, color: C.ink, lineHeight: 1.4 }}>{children}</span>
  </div>
);

const M5_Parseurs: Page = () => (
  <Frame mod={5} kind="exercice">
    <Title>Générer un parseur : le fichier réel est toujours piégé</Title>
    <Lede>Ouvrez le fichier de données dans un onglet voisin : Copilot voit son format. Combien de pièges voyez-vous ? Au micro.</Lede>
    <CodeDark file="data/import.csv" size={21} cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 860 }}>
      <Cc>{'1 '}</Cc>titre;type;priorite;points{'\n'}
      <Cc>{'2 '}</Cc>Paiement par carte refusé;bug;<Cn>1</Cn>;<Cn>3</Cn>
      {'\n'}
      <Cc>{'3 '}</Cc>Filtre par date des factures;story;<Cn>2</Cn>;<Cn>5</Cn>
      {'\n'}
      <Cc>{'4 '}</Cc>
      {'\n'}
      <Cc>{'5 '}</Cc>
      <span style={{ background: 'rgba(255,210,122,.2)' }}>{'  Mode sombre  '}</span>;story;<Cn>3</Cn>;{'\n'}
      <Cc>{'6 '}</Cc>Traduction anglaise;tache;<Cn>2</Cn>;<Cn>8</Cn>;<span style={{ background: 'rgba(242,139,130,.3)' }}>en trop</span>
      {'\n'}
      <Cc>{'7 '}</Cc>Synchronisation agenda;story;<Cn>2</Cn>;<span style={{ background: 'rgba(242,139,130,.3)' }}>4</span>
      {'\n'}
      <Cc>{'8 '}</Cc>Lien mort dans le pied de page;bug;<Cn>3</Cn>;<Cn>1</Cn>
      {'\n'}
      <Cc>{'9 '}</Cc>
      <span style={{ background: 'rgba(242,139,130,.3)' }}>{';'}</span>tache;<Cn>2</Cn>;<Cn>1</Cn>
    </CodeDark>
    <div className={A.right} style={{ position: 'absolute', left: 1040, top: 270, width: 760, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 12, ...dl(300) }}>
      <PanelTitle icon="bug" c={C.coral}>
        Les pièges à mettre dans le commentaire
      </PanelTitle>
      <M5Trap n={1}>Séparateur « ; » (CSV à la française), pas « , »</M5Trap>
      <M5Trap n={2}>En-tête à ignorer, lignes vides à sauter</M5Trap>
      <M5Trap n={3}>Espaces autour des champs, points vides → null</M5Trap>
      <M5Trap n={4}>Mauvais nombre de colonnes, titre vide : rejet avec n° de ligne</M5Trap>
      <M5Trap n={5}>Fins de ligne Windows et BOM : invisibles à l’œil nu</M5Trap>
      <M5Trap n={6}>Points « 4 » : syntaxe juste, règle métier fausse</M5Trap>
    </div>
  </Frame>
);

// ─── Documentation ──────────────────────────────────────────────────────────
const M5_Doc: Page = () => (
  <Frame mod={5} kind="demo">
    <Title>Générer la documentation : JSDoc, docstring, Javadoc</Title>
    <Lede>Deux gestes : /** + Entrée au-dessus d’une fonction, ou Ctrl+I puis /doc sur une sélection.</Lede>
    <LangTabs initial="JavaScript" cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <LangBtn lang="JavaScript" tone="yellow" />
        <LangBtn lang="Python" tone="green" />
        <LangBtn lang="Java" tone="coral" />
      </div>
      <LangPane lang="JavaScript">
        <CodeDark file="src/api.js" size={20}>
          <Gh>{'/**\n * Lit un CSV « titre;type;priorite;points ».\n * @param {string} texte contenu du fichier\n * @returns {{ tickets: object[], rejets: { ligne: number, raison: string }[] }}\n * @example parserCsv("titre;type;priorite;points\\nA;bug;1;3")\n */'}</Gh>
          {'\n'}
          <Ck>export function</Ck> <Cf>parserCsv</Cf>(texte) {'{ … }'}
        </CodeDark>
      </LangPane>
      <LangPane lang="Python">
        <CodeDark file="katas/python/tickets.py" size={20}>
          <Ck>def</Ck> <Cf>creer_ticket</Cf>(donnees: dict, *, id: int, aujourd_hui: str) -&gt; dict:{'\n    '}
          <Gh>{'"""Crée un ticket complet.\n\n    Args:\n        donnees: titre, type, priorite, points (partiels).\n        id: identifiant unique.\n        aujourd_hui: date AAAA-MM-JJ.\n\n    Raises:\n        ValueError: si les données sont invalides.\n    """'}</Gh>
        </CodeDark>
      </LangPane>
      <LangPane lang="Java">
        <CodeDark file="katas/java/Ticket.java" size={20}>
          <Gh>{'/**\n * Valide les champs d’un ticket.\n * @param titre    3 à 80 caractères après strip\n * @param priorite 1, 2 ou 3\n * @return toutes les erreurs, dans l’ordre ; liste vide si valide\n */'}</Gh>
          {'\n'}
          <Ck>static</Ck> List&lt;String&gt; <Cf>valider</Cf>(…) {'{ … }'}
        </CodeDark>
      </LangPane>
    </LangTabs>
    <div style={{ position: 'absolute', left: 1230, top: 270, width: 570, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="check" tone="green" title="Une bonne doc dit le contrat" size={22} pad={22} cls={A.right} style={dl(200)}>
        Paramètres, retour, erreurs, un exemple. Ce que l’appelant doit savoir.
      </Card>
      <Card icon="x" tone="coral" title="Une mauvaise doc paraphrase" size={22} pad={22} cls={A.right} style={dl(350)}>
        « Cette fonction parse le CSV » : inutile. Et une doc fausse est pire que pas de doc : relisez-la.
      </Card>
    </div>
  </Frame>
);

// ─── Atelier 5 ──────────────────────────────────────────────────────────────
const M5_Lab: Page = () => (
  <LabPage
    mod={5}
    n="5"
    title="TaskFlow v2 : backlog, classe et import"
    defi="generer"
    who="Individuel · 50 min"
    objective={
      <>
        Générer <Ic>trierBacklog</Ic>, <Ic>filtrerBacklog</Ic>, <Ic>statistiques</Ic>, la classe <Ic>Backlog</Ic>, <Ic>parserCsv</Ic> et <Ic>chargerTickets</Ic>, chacun avec sa <strong>JSDoc</strong>. Les tests passent et l’interface TaskFlow s’allume.
      </>
    }
    where={
      <>
        <PathChip size={19}>src/backlog.js</PathChip> <PathChip size={19}>src/api.js</PathChip>
        <br />
        <PathChip size={19}>npm run serveur</PathChip> → localhost:3000
      </>
    }
    minutes={50}
    crit={
      <>
        <CheckItem id="l5a" size={21}>test:atelier5 au vert</CheckItem>
        <CheckItem id="l5b" size={21}>« securite » trouve « Sécurité »</CheckItem>
        <CheckItem id="l5c" size={21}>Une JSDoc par fonction exportée</CheckItem>
      </>
    }
    suivi="Points d’étape à 15 min (tri), 30 min (classe), 45 min (CSV et interface)."
  >
    <WStep n={1}>Ask + <Ic>#file:src/backlog.js</Ic> : le plan et les signatures JSDoc, sans les corps.</WStep>
    <WStep n={2}>Une fonction à la fois : JSDoc, corps, test. Puis la classe, méthode par méthode.</WStep>
    <WStep n={3}>
      <Ic>parserCsv</Ic> avec <PathChip size={20}>data/import.csv</PathChip> ouvert à côté, puis <Ic>chargerTickets</Ic> et l’interface.
    </WStep>
  </LabPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M5_Qcm: Page = () => (
  <Frame mod={5} kind="qcm">
    <Title>QCM · Module 5 en quatre questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Copilot propose return tickets.sort(…) pour trierBacklog. Que vérifiez-vous en premier ?" explain="sort trie sur place : le tableau reçu est modifié. Il faut trier une copie ([...tickets] ou toSorted).">
        <QOpt>Que sort existe bien en JavaScript</QOpt>
        <QOpt ok>Que le tableau reçu n’est pas modifié</QOpt>
        <QOpt>Que la fonction est assez courte</QOpt>
      </QuizQ>
      <QuizQ q="Pourquoi passer fetchFn en paramètre de chargerTickets ?" explain="L’injection de dépendance permet de remplacer fetch par un faux (mock) dans les tests : aucun réseau, résultats déterministes.">
        <QOpt>Pour aller plus vite</QOpt>
        <QOpt ok>Pour pouvoir le remplacer par un faux dans les tests</QOpt>
        <QOpt>Parce que fetch n’existe pas dans Node</QOpt>
      </QuizQ>
      <QuizQ q="Avant de générer un parseur CSV, le geste le plus utile est…" explain="Ouvrir le fichier réel dans un onglet voisin : Copilot voit le séparateur, l’en-tête et les cas réels.">
        <QOpt>Choisir un modèle plus puissant</QOpt>
        <QOpt ok>Ouvrir le fichier de données dans un onglet voisin</QOpt>
        <QOpt>Écrire « fais un parseur robuste »</QOpt>
      </QuizQ>
      <QuizQ q="Quelle JSDoc est la plus utile ?" explain="Une doc décrit le contrat : paramètres, retour, erreurs, exemple. La paraphrase du nom n’apporte rien.">
        <QOpt>« Cette fonction trie le backlog. »</QOpt>
        <QOpt ok>@param, @returns « un nouveau tableau », @throws, un @example</QOpt>
        <QOpt>Le nom de l’auteur et la date</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M5_Pause: Page = () => <BreakPage mod={5} title="Pause" back="Reprise à 11 h 00 : le refactoring d’un vieux code de 2019." minutes={15} />;

// ═══ 60-m6 ═════════════════════════════════════════════════════════════

// ─── Module 6 · Refactoring avec Copilot ────────────────────────────────────

const M6_Divider: Page = () => (
  <Section
    n={6}
    title={
      <>
        Refactoring
        <br />
        avec Copilot
      </>
    }
    sub="Rendre un code lisible sans changer ce qu’il fait : Copilot propose, les tests tranchent."
    dur="J2 · 11:00 – 12:30"
    labs={<Tag tone="green" size={19}>Atelier 6 · le Kanban legacy de 2019</Tag>}
  >
    <SecItem n={1}>Identifier le code à refactoriser et formuler la demande</SecItem>
    <SecItem n={2}>Simplifier, renommer, extraire des fonctions</SecItem>
    <SecItem n={3}>Refactorer en langage naturel avec Copilot Chat</SecItem>
    <SecItem n={4}>Comparer avant et après pour valider</SecItem>
    <SecItem n={5}>Cas pratique : améliorer un code legacy fourni</SecItem>
  </Section>
);
M6_Divider.transition = BLOOM;

// ─── Les odeurs ─────────────────────────────────────────────────────────────
const M6Smell = ({ icon, title, ex, children, d }: { icon: IconName; title: string; ex: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 24px', borderTop: `6px solid ${C.violet}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone="violet" size={48} />
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
    </div>
    <div style={{ marginTop: 12, fontFamily: mono, fontSize: 19, color: T.violet.fg, background: T.violet.bg, borderRadius: 8, padding: '6px 10px' }}>{ex}</div>
    <div style={{ marginTop: 10, fontSize: 21, color: C.soft, lineHeight: 1.4 }}>{children}</div>
  </div>
);

const M6_Odeurs: Page = () => (
  <Frame mod={6}>
    <Title>Identifier le code à refactoriser : six « odeurs »</Title>
    <Lede>Le code marche, mais on a peur d’y toucher. Tous ces exemples viennent du fichier legacy de TaskFlow.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 22 }}>
      <M6Smell icon="eyeOff" title="Noms obscurs" ex="traiter(l, i, s, opt)" d={100}>
        Il faut lire tout le corps pour deviner le rôle.
      </M6Smell>
      <M6Smell icon="layers" title="Imbrication" ex="if { if { for { if" d={180}>
        Chaque niveau ajoute un cas à garder en tête.
      </M6Smell>
      <M6Smell icon="gauge" title="Nombres magiques" ex="if (n > 3)" d={260}>
        3 quoi ? Une constante nommée le dirait.
      </M6Smell>
      <M6Smell icon="loop" title="Duplication" ex="for (var k…) ×2" d={340}>
        Deux boucles presque identiques à maintenir.
      </M6Smell>
      <M6Smell icon="alert" title="Effets de bord" ex="r.statut = s;" d={420}>
        La fonction modifie la liste qu’on lui passe.
      </M6Smell>
      <M6Smell icon="clock" title="Syntaxe datée" ex="var · == · substring" d={500}>
        Des pièges connus que le JavaScript moderne évite.
      </M6Smell>
    </div>
  </Frame>
);

// ─── Formuler la demande ────────────────────────────────────────────────────
const M6Ing = ({ tone, label, children }: { tone: Tone; label: string; children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '170px minmax(0, 1fr)', gap: 14, alignItems: 'baseline' }}>
    <Tag tone={tone} size={19}>
      {label}
    </Tag>
    <span style={{ fontSize: 22, color: C.ink, lineHeight: 1.4 }}>{children}</span>
  </div>
);

const M6_Formuler: Page = () => (
  <Frame mod={6} beats={1}>
    <Title>Formuler la demande : « améliore ce code » ne suffit pas</Title>
    <Lede>Une demande vague mélange tout : renommage, réécriture, correction de bug. Et le comportement change en silence.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 640 }}>
      <PanelTitle icon="x" c={C.coral}>
        La demande vague
      </PanelTitle>
      <div style={{ background: T.coral.bg, borderRadius: 16, padding: '22px 26px', fontSize: 26, lineHeight: 1.45 }}>
        <Pr>« Améliore ce code. »</Pr>
        <div style={{ marginTop: 16, fontSize: 21, color: C.soft }}>Résultat typique : 40 lignes réécrites, le bug WIP corrigé « au passage », == devenu ===. Trois tests de caractérisation au rouge.</div>
      </div>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 820, top: 280, width: 980, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px' }}>
      <PanelTitle icon="check" c={C.green}>
        La demande en 4 ingrédients
      </PanelTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <M6Ing tone="blue" label="Quoi">
          Remplace var par const/let et extrais trouverTicket et compterEnCours.
        </M6Ing>
        <M6Ing tone="teal" label="Périmètre">
          Uniquement la fonction traiter, rien d’autre dans le fichier.
        </M6Ing>
        <M6Ing tone="violet" label="Contrainte">
          Exactement le même comportement : garde == et la mutation.
        </M6Ing>
        <M6Ing tone="green" label="Vérification">
          Les 9 tests de kanban-legacy.test.js doivent rester verts.
        </M6Ing>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 760, width: 1680 }}>
      <Callout tone="blue" icon="target" title="Petits pas" size={24} cls={b.on(1)}>
        Une transformation par demande, un test après chaque demande. Si un test rougit, on annule le dernier pas, pas toute la matinée.
      </Callout>
    </div>
  </Frame>
);

// ─── Les trois gestes ───────────────────────────────────────────────────────
const M6Geste = ({ tone, title, how, before, after, d }: { tone: Tone; title: string; how: ReactNode; before: string; after: string; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 22px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 6, fontSize: 20, color: C.soft, lineHeight: 1.4, minHeight: 56 }}>{how}</div>
    <div style={{ marginTop: 12, fontFamily: mono, fontSize: 18, lineHeight: 1.5, whiteSpace: 'pre', background: T.coral.bg, color: T.coral.fg, borderRadius: 10, padding: '10px 14px' }}>{before}</div>
    <div style={{ textAlign: 'center', fontSize: 24, color: C.faint, margin: '4px 0' }}>↓</div>
    <div style={{ fontFamily: mono, fontSize: 18, lineHeight: 1.5, whiteSpace: 'pre', background: T.green.bg, color: T.green.fg, borderRadius: 10, padding: '10px 14px' }}>{after}</div>
  </div>
);

const M6_Gestes: Page = () => (
  <Frame mod={6} kind="demo">
    <Title>Simplifier, renommer, extraire : trois gestes de base</Title>
    <Lede>Copilot les accélère ; VS Code les sécurise. Combinez les deux.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <M6Geste
        tone="blue"
        title="Renommer"
        how={
          <>
            <Kbd>F2</Kbd> sur le nom : VS Code renomme partout ; Copilot propose des noms, NES suit.
          </>
        }
        before={'function traiter(l, i, s) {\n  var r = null;'}
        after={'function traiter(tickets, id, versStatut) {\n  let ticket = null;'}
        d={100}
      />
      <M6Geste
        tone="violet"
        title="Extraire"
        how={
          <>
            Sélection › <Kbd>Ctrl+.</Kbd> « Extraire dans une fonction », ou <Kbd>Ctrl+I</Kbd> en la nommant.
          </>
        }
        before={'var n = 0;\nfor (var k2 = 0; …)\n  if (l[k2].statut == "encours") n++;'}
        after={'const n = compterEnCours(tickets);'}
        d={220}
      />
      <M6Geste
        tone="teal"
        title="Simplifier"
        how={<>Retours anticipés, constantes nommées, conditions regroupées.</>}
        before={'if (s == "termine") {\n  if (r.statut != "encours") {\n    return …'}
        after={'if (versStatut === "termine"\n    && ticket.statut !== "encours")\n  return …'}
        d={340}
      />
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(700) }}>
      Simplifier une condition avec === au lieu de == change le comportement : vérifiez les tests à chaque pas.
    </Hint>
  </Frame>
);

// ─── Refactorer avec le chat ────────────────────────────────────────────────
const M6DiffLine = ({ kind, children }: { kind: '+' | '-' | ' '; children: string }) => (
  <div style={{ display: 'flex', gap: 10, background: kind === '+' ? 'rgba(155,226,155,.14)' : kind === '-' ? 'rgba(242,139,130,.16)' : 'transparent', padding: '0 12px' }}>
    <span style={{ width: 14, color: kind === '+' ? '#9BE29B' : kind === '-' ? '#F28B82' : '#7C86A8' }}>{kind}</span>
    <span style={{ whiteSpace: 'pre', color: kind === '-' ? '#F2B8B3' : '#E6EAF6' }}>{children}</span>
  </div>
);

const M6_Chat: Page = () => (
  <Frame mod={6} kind="demo" beats={2}>
    <Title>Refactorer en langage naturel avec Ctrl+I</Title>
    <Lede>Vous décrivez la transformation, Copilot propose un diff. Rien n’est écrit avant votre clic sur « Accepter ».</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060, background: '#0F1530', borderRadius: 16, overflow: 'hidden', boxShadow: '0 22px 44px -26px rgba(11,31,92,.8)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', background: '#18204A', fontSize: 19, color: '#DCE2F5' }}>
        <Icon name="sparkles" size={20} color="#AEB9E6" />
        <span style={{ fontStyle: 'italic' }}>Extrais la boucle de comptage dans compterEnCours(tickets), même comportement</span>
      </div>
      <div style={{ padding: '14px 0', fontFamily: mono, fontSize: 19, lineHeight: 1.6 }}>
        <M6DiffLine kind=" ">{'  if (versStatut == "encours") {'}</M6DiffLine>
        <M6DiffLine kind="-">{'    var n = 0;'}</M6DiffLine>
        <M6DiffLine kind="-">{'    for (var k2 = 0; k2 < l.length; k2++) {'}</M6DiffLine>
        <M6DiffLine kind="-">{'      if (l[k2].statut == "encours") { n = n + 1; }'}</M6DiffLine>
        <M6DiffLine kind="-">{'    }'}</M6DiffLine>
        <M6DiffLine kind="+">{'    const n = compterEnCours(tickets);'}</M6DiffLine>
        <M6DiffLine kind=" ">{'    if (n > LIMITE) return { ok: false, msg: "WIP" };'}</M6DiffLine>
      </div>
      <div style={{ display: 'flex', gap: 10, padding: '12px 18px', borderTop: '1px solid #2C3260' }}>
        <span style={{ background: C.electric, color: '#fff', borderRadius: 6, padding: '4px 14px', fontSize: 18 }}>Accepter</span>
        <span style={{ background: '#2C3470', color: '#DCE2F5', borderRadius: 6, padding: '4px 14px', fontSize: 18 }}>Ignorer</span>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card icon="check" tone="green" title="Ce diff est sûr" size={22} pad={22} cls={b.on(1)}>
        La limite <Ic>n {'>'} LIMITE</Ic> est restée telle quelle : bug compris. C’est voulu.
      </Card>
      <Card icon="flask" tone="blue" title="Puis, toujours" size={22} pad={22} cls={b.on(2)}>
        <Ic>npm run test:atelier6</Ic>, puis commit. Un pas, un test, un commit.
      </Card>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 790, width: 1680, display: 'flex', gap: 28, fontSize: 22, color: C.soft, ...dl(600) }}>
      <span>
        <strong style={{ color: C.navy }}>Ctrl+I</strong> : une fonction
      </span>
      <span>
        <strong style={{ color: C.navy }}>Vue Chat, Ask</strong> : comprendre avant de toucher
      </span>
      <span>
        <strong style={{ color: C.navy }}>Agent</strong> : plusieurs fichiers, à réserver aux tâches bien bornées
      </span>
    </div>
  </Frame>
);

// ─── Comparer avant / après ─────────────────────────────────────────────────
const M6_Comparer: Page = () => (
  <Frame mod={6}>
    <Title>Comparer avant et après pour valider la transformation</Title>
    <Lede>Trois outils, du plus automatique au plus humain. Les trois, à chaque étape.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <Card icon="flask" tone="green" title="1 · Les tests de caractérisation" size={22} pad={26} cls={A.in} style={dl(100)}>
        Ils photographient ce que le code fait <em>aujourd’hui</em>, bugs compris. Verts avant, verts après.
      </Card>
      <Card icon="git" tone="blue" title="2 · Le diff Git" size={22} pad={26} cls={A.in} style={dl(220)}>
        Vue Contrôle de code source ou <Ic>git diff</Ic> : chaque ligne changée doit être un renommage, une extraction ou une simplification.
      </Card>
      <Card icon="eye" tone="violet" title="3 · La relecture" size={22} pad={26} cls={A.in} style={dl(340)}>
        Vous devez pouvoir expliquer chaque changement. Sinon : Ask « pourquoi ce changement ? », ou on annule.
      </Card>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 640, width: 1680, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', ...dl(500) }}>
      <PanelTitle icon="flag" c={C.coral}>
        Refactoring ≠ correction de bug
      </PanelTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 28 }}>
        <div style={{ fontSize: 23, color: C.ink, lineHeight: 1.45 }}>
          <Ic>refactor : kanban legacy lisible</Ic>
          <br />
          même comportement, tests inchangés
        </div>
        <div style={{ fontSize: 23, color: C.ink, lineHeight: 1.45 }}>
          <Ic>fix : limite WIP respectée</Ic>
          <br />
          comportement changé, test mis à jour <em>exprès</em>
        </div>
      </div>
    </div>
  </Frame>
);

// ─── Le legacy de TaskFlow ──────────────────────────────────────────────────
const M6_Legacy: Page = () => (
  <Frame mod={6} kind="exercice">
    <Title>Cas pratique : le Kanban legacy de TaskFlow</Title>
    <Lede>Écrit en 2019, « ça marche, ne touchez à rien ». Combien d’odeurs voyez-vous ? Dites-les : je clique les pastilles.</Lede>
    <CodeDark file="src/legacy/kanban-legacy.js" size={19} cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1100 }}>
      <Ck>var</Ck> LIMITE = <Cn>3</Cn>;{'\n'}
      <Ck>function</Ck> <Cf>traiter</Cf>(l, i, s, opt) {'{'}
      {'\n  '}
      <Ck>var</Ck> r = <Ck>null</Ck>;{'\n  '}
      <Ck>for</Ck> (<Ck>var</Ck> k = <Cn>0</Cn>; k &lt; l.length; k++) {'{ '}
      <Ck>if</Ck> (l[k].id == i) {'{ r = l[k]; } }'}
      {'\n  '}
      <Ck>if</Ck> (r == <Ck>null</Ck>) {'{ '}
      <Ck>return</Ck> {'{ ok: false, msg: '}
      <Cs>"introuvable"</Cs> {'}; }'}
      {'\n  '}
      <Cc>{'// … statut inconnu, ticket non estimé …'}</Cc>
      {'\n  '}
      <Ck>if</Ck> (s == <Cs>"encours"</Cs>) {'{'}
      {'\n    '}
      <Ck>var</Ck> n = <Cn>0</Cn>;{'\n    '}
      <Ck>for</Ck> (<Ck>var</Ck> k2 = <Cn>0</Cn>; k2 &lt; l.length; k2++) {'{ '}
      <Ck>if</Ck> (l[k2].statut == <Cs>"encours"</Cs>) {'{ n = n + 1; } }'}
      {'\n    '}
      <Ck>if</Ck> (n &gt; LIMITE) {'{ '}
      <Ck>return</Ck> {'{ ok: false, msg: '}
      <Cs>"WIP"</Cs> {'}; }'}
      {'\n  }\n  '}
      r.statut = s;{'\n  '}
      <Cc>{'// … termineLe = new Date() …'}</Cc>
      {'\n  '}
      <Ck>return</Ck> {'{ ok: true, msg: "" };\n}'}
    </CodeDark>
    <Hotspot n={1} x={500} y={346} title="Noms d’une lettre" w={420}>
      l, i, s, r, k, k2 : rien ne dit ce qu’ils contiennent.
    </Hotspot>
    <Hotspot n={2} x={1040} y={431} title="Comparaison large ==" w={420} side="left">
      "1" trouve le ticket 1. Le changer est un changement de comportement !
    </Hotspot>
    <Hotspot n={3} x={1110} y={637} title="Duplication" w={420} side="left">
      Deux boucles qui parcourent la liste : à extraire en fonctions nommées.
    </Hotspot>
    <Hotspot n={4} x={640} y={667} title="Nombre magique et bug" w={460}>
      n {'>'} 3 laisse passer un 4e ticket en cours : le bug WIP, à corriger dans un commit séparé.
    </Hotspot>
    <Hotspot n={5} x={330} y={727} title="Effet de bord" w={420}>
      La fonction modifie le ticket de la liste reçue.
    </Hotspot>
    <div className={A.right} style={{ position: 'absolute', left: 1280, top: 262, width: 520, ...dl(300) }}>
      <Card icon="flask" tone="green" title="Le filet de sécurité" size={22} pad={24}>
        9 tests de caractérisation, déjà écrits, déjà verts, y compris le test « ⚠ accepte un 4e ticket en cours ».
        <div style={{ marginTop: 14 }}>
          <Ic>npm run test:atelier6</Ic>
        </div>
      </Card>
    </div>
  </Frame>
);

// ─── Atelier 6 ──────────────────────────────────────────────────────────────
const M6_Lab: Page = () => (
  <LabPage
    mod={6}
    n="6"
    title="Refactorer le Kanban legacy"
    defi="refacto"
    who="Individuel · 45 min"
    objective={
      <>
        Rendre <Ic>traiter</Ic> lisible <strong>sans changer son comportement</strong> (9 tests verts), puis écrire sa version moderne <Ic>deplacerTicket</Ic> : pure, nommée, et <strong>corrigée</strong> du bug WIP.
      </>
    }
    where={
      <>
        <PathChip size={19}>src/legacy/kanban-legacy.js</PathChip>
        <br />
        <PathChip size={19}>src/kanban.js</PathChip>
        <br />2 commits : refactor, puis fix
      </>
    }
    minutes={45}
    crit={
      <>
        <CheckItem id="l6a" size={21}>test:atelier6 : 12 tests verts</CheckItem>
        <CheckItem id="l6b" size={21}>Plus aucun var dans le legacy</CheckItem>
        <CheckItem id="l6c" size={21}>Refactor et fix : 2 commits distincts</CheckItem>
      </>
    }
    suivi="Points d’étape à 15 min (renommages), 30 min (extractions), 40 min (kanban.js)."
  >
    <WStep n={1}>Ask : faites expliquer traiter règle par règle ; comparez avec les noms des tests.</WStep>
    <WStep n={2}>
      <Kbd>F2</Kbd> pour renommer, <Kbd>Ctrl+I</Kbd> pour extraire et simplifier : un pas, un test, puis commit.
    </WStep>
    <WStep n={3}>
      Générez <Ic>src/kanban.js</Ic> depuis ses commentaires : le contrat WIP passe, commit « fix ».
    </WStep>
  </LabPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M6_Qcm: Page = () => (
  <Frame mod={6} kind="qcm">
    <Title>QCM · Module 6 en quatre questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Après « améliore ce code », un test de caractérisation passe au rouge. Que s’est-il passé ?" explain="Le comportement a changé : Copilot a corrigé ou modifié quelque chose au passage. Un refactoring garde tous les tests de caractérisation verts.">
        <QOpt>Le test est faux, on le supprime</QOpt>
        <QOpt ok>Le comportement a changé : ce n’est plus un refactoring</QOpt>
        <QOpt>C’est normal après un refactoring</QOpt>
      </QuizQ>
      <QuizQ q="Remplacer == par === dans le legacy, c’est…" explain="Un changement de comportement : le texte « 1 » ne trouve plus le ticket 1. Peut-être souhaitable, mais à décider et commiter séparément.">
        <QOpt>Un simple nettoyage sans risque</QOpt>
        <QOpt ok>Un changement de comportement, à traiter à part</QOpt>
        <QOpt>Obligatoire pour que les tests passent</QOpt>
      </QuizQ>
      <QuizQ q="Quel est le bon découpage des commits ?" explain="Un commit de refactoring (même comportement) puis un commit de correction (comportement changé, test mis à jour exprès) : la revue et l’annulation restent simples.">
        <QOpt>Un seul gros commit « nettoyage »</QOpt>
        <QOpt ok>Refactoring d’abord, correction du bug ensuite</QOpt>
        <QOpt>Correction d’abord, refactoring jamais</QOpt>
      </QuizQ>
      <QuizQ q="Un test de caractérisation sert à…" explain="Il fige le comportement actuel, bugs compris, pour détecter tout changement involontaire pendant le refactoring.">
        <QOpt>Prouver que le code est correct</QOpt>
        <QOpt ok>Figer ce que le code fait aujourd’hui, bugs compris</QOpt>
        <QOpt>Mesurer la performance</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M6_Dejeuner: Page = () => <BreakPage mod={6} title="Bon appétit !" back="Reprise à 14 h 00 : des tests unitaires générés… et vérifiés." minutes={90} icon="smile" />;

// ═══ 70-m7 ═════════════════════════════════════════════════════════════

// ─── Module 7 · Introduction aux tests unitaires avec Copilot ───────────────

const M7_Divider: Page = () => (
  <Section
    n={7}
    title={
      <>
        Tests unitaires
        <br />
        avec Copilot
      </>
    }
    sub="Copilot écrit vite des tests. Votre travail : vérifier qu’ils détectent vraiment une erreur."
    dur="J2 · 14:00 – 15:15"
    labs={<Tag tone="green" size={19}>Atelier 7 · une vraie suite de tests</Tag>}
  >
    <SecItem n={1}>Rappel : qu’est-ce qu’un test unitaire, et pourquoi en écrire ?</SecItem>
    <SecItem n={2}>Générer des tests à partir d’une fonction existante</SecItem>
    <SecItem n={3}>Nommer, organiser et structurer les tests générés</SecItem>
    <SecItem n={4}>Vérifier la cohérence des assertions</SecItem>
    <SecItem n={5}>Premiers mocks simples</SecItem>
  </Section>
);
M7_Divider.transition = BLOOM;

// ─── Pourquoi ───────────────────────────────────────────────────────────────
const M7Why = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <Row2 icon={icon} tone={tone} title={title} d={d}>
    {children}
  </Row2>
);

const M7_Pourquoi: Page = () => (
  <Frame mod={7}>
    <Title>Un test unitaire vérifie un comportement</Title>
    <Lede>Une fonction, une situation, un résultat attendu. Il s’exécute en millisecondes, des milliers de fois par jour.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 900, display: 'flex', flexDirection: 'column', gap: 26 }}>
      <M7Why icon="shield" tone="green" title="Un filet de sécurité" d={100}>
        Il prévient dès qu’un changement casse quelque chose, même trois mois plus tard.
      </M7Why>
      <M7Why icon="doc" tone="blue" title="Une documentation qui ne ment pas" d={200}>
        « refuse un 4e ticket en cours » : la règle, écrite et vérifiée.
      </M7Why>
      <M7Why icon="wand" tone="violet" title="La liberté de refactorer" d={300}>
        Vous l’avez vécu ce matin : sans tests, on n’ose pas toucher au legacy.
      </M7Why>
      <M7Why icon="sparkles" tone="coral" title="Le juge du code généré" d={400}>
        Avec Copilot, on écrit plus de code, plus vite : les tests disent s’il est juste.
      </M7Why>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1100, top: 280, width: 700, ...dl(300) }}>
      <svg viewBox="0 0 700 430" width={700} height={430}>
        <polygon points="350,20 470,150 230,150" fill={T.coral.bg} stroke={T.coral.bd} strokeWidth={3} />
        <polygon points="230,160 470,160 560,290 140,290" fill={T.yellow.bg} stroke={T.yellow.bd} strokeWidth={3} />
        <polygon points="140,300 560,300 660,420 40,420" fill={T.green.bg} stroke={C.green} strokeWidth={4} />
        <text x={350} y={115} textAnchor="middle" fontSize={22} fontWeight={700} fill={T.coral.fg}>
          Bout en bout
        </text>
        <text x={350} y={235} textAnchor="middle" fontSize={22} fontWeight={700} fill={T.yellow.fg}>
          Intégration
        </text>
        <text x={350} y={368} textAnchor="middle" fontSize={26} fontWeight={800} fill={T.green.fg}>
          Unitaires : nombreux, rapides
        </text>
      </svg>
      <div style={{ textAlign: 'center', fontSize: 21, color: C.muted, marginTop: 6 }}>Aujourd’hui : la base de la pyramide.</div>
    </div>
  </Frame>
);

// ─── AAA ────────────────────────────────────────────────────────────────────
const M7Band = ({ tone, label, children }: { tone: Tone; label: string; children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '150px minmax(0, 1fr)', alignItems: 'stretch' }}>
    <div style={{ background: STRONG[tone], color: '#fff', fontFamily: display, fontWeight: 800, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px 0 0 10px' }}>{label}</div>
    <div style={{ background: '#0F1530', padding: '10px 20px', fontFamily: mono, fontSize: 21, lineHeight: 1.55, color: '#E6EAF6', whiteSpace: 'pre', borderRadius: '0 10px 10px 0' }}>{children}</div>
  </div>
);

const M7_AAA: Page = () => (
  <Frame mod={7}>
    <Title>Anatomie d’un test : Préparer, Agir, Vérifier</Title>
    <Lede>Le motif « AAA » (Arrange, Act, Assert). Exigez-le de Copilot : ses tests deviennent lisibles d’un coup d’œil.</Lede>
    <CodeDark file="test/kanban.test.js" size={20} cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060 }}>
      <Ck>import</Ck> assert <Ck>from</Ck> <Cs>'node:assert/strict'</Cs>;{'\n'}
      <Ck>import</Ck> {'{ describe, it }'} <Ck>from</Ck> <Cs>'node:test'</Cs>;{'\n'}
      <Ck>import</Ck> {'{ deplacerTicket }'} <Ck>from</Ck> <Cs>'../src/kanban.js'</Cs>;{'\n\n'}
      <Cf>describe</Cf>(<Cs>'R1 · limite de travail en cours'</Cs>, () =&gt; {'{'}
      {'\n  '}
      <Cf>it</Cf>(<Cs>'refuse le 4e ticket en cours'</Cs>, () =&gt; {'{'}
    </CodeDark>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 520, width: 1060, display: 'flex', flexDirection: 'column', gap: 8, ...dl(200) }}>
      <M7Band tone="blue" label="Préparer">{'const tickets = [encours(1), encours(2), encours(3), afaire(4)];'}</M7Band>
      <M7Band tone="violet" label="Agir">{'const r = deplacerTicket(tickets, 4, "encours");'}</M7Band>
      <M7Band tone="green" label="Vérifier">{'assert.deepEqual(r, { ok: false, erreur: "WIP atteint (3/3)" });'}</M7Band>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="note" tone="blue" title="Le nom dit le comportement" size={22} pad={22} cls={A.right} style={dl(300)}>
        « refuse le 4e ticket en cours », pas « test 3 ». En cas d’échec, on sait quoi chercher.
      </Card>
      <Card icon="target" tone="green" title="Un comportement par test" size={22} pad={22} cls={A.right} style={dl(450)}>
        Un seul « Agir » ; les vérifications portent sur ce comportement-là.
      </Card>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(700) }}>
      node:test et node:assert sont inclus dans Node : aucune bibliothèque à installer.
    </Hint>
  </Frame>
);

// ─── Générer ────────────────────────────────────────────────────────────────
const M7Way = ({ n, tone, title, prompt, children, d }: { n: number; tone: Tone; title: string; prompt: ReactNode; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 24px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={n} tone={tone} size={40} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.ink }}>{title}</div>
    </div>
    <div style={{ marginTop: 14, fontSize: 21, lineHeight: 1.5 }}>{prompt}</div>
    <div style={{ marginTop: 12, fontSize: 20, color: C.soft, lineHeight: 1.4 }}>{children}</div>
  </div>
);

const M7_Generer: Page = () => (
  <Frame mod={7} kind="demo">
    <Title>Générer des tests à partir d’une fonction existante</Title>
    <Lede>Trois chemins. Le meilleur pour débuter : faire lister les cas d’abord, puis générer.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <M7Way n={1} tone="blue" title="/tests sur la sélection" d={100} prompt={<><Kbd>Ctrl+I</Kbd> sur la fonction, puis <Ic>/tests</Ic></>}>
        Rapide. Mais Copilot choisit seul les cas : souvent les nominaux, rarement les bords.
      </M7Way>
      <M7Way n={2} tone="green" title="La liste des cas d’abord" d={220} prompt={<Pr>« #file:src/kanban.js — Liste les cas à tester pour deplacerTicket : nominaux, limites, erreurs. Pas de code. »</Pr>}>
        Vous relisez et complétez la liste. Puis : « Génère un test par cas, node:test, AAA ».
      </M7Way>
      <M7Way n={3} tone="violet" title="L’agent écrit et exécute" d={340} prompt={<Pr>« Écris test/kanban.test.js et lance npm test. »</Pr>}>
        Il itère jusqu’au vert… parfois en affaiblissant les tests. Relisez le diff.
      </M7Way>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 720, width: 1680 }}>
      <Callout tone="yellow" icon="alert" title="Le piège du « tout vert »" size={24} cls={A.in} style={dl(500)}>
        Un test généré qui passe du premier coup ne prouve rien : il a peut-être été écrit à partir du code… y compris de ses bugs.
      </Callout>
    </div>
  </Frame>
);

// ─── Organiser ──────────────────────────────────────────────────────────────
const M7_Organiser: Page = () => (
  <Frame mod={7}>
    <Title>Nommer, organiser, structurer les tests générés</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 880 }}>
      <CodeDark file="test/kanban.test.js · structure" size={20}>
        <Cc>{'// une fabrique : des données de test lisibles'}</Cc>
        {'\n'}
        <Ck>const</Ck> ticket = (id, statut, points = <Cn>3</Cn>) =&gt; ({'{ id, statut, points }'});{'\n\n'}
        <Cf>describe</Cf>(<Cs>'R1 · limite de travail en cours'</Cs>, …){'\n'}
        {'  '}
        <Cf>it</Cf>(<Cs>'accepte le 3e ticket en cours'</Cs>){'\n'}
        {'  '}
        <Cf>it</Cf>(<Cs>'refuse le 4e ticket en cours'</Cs>){'\n'}
        <Cf>describe</Cf>(<Cs>'R2 · Definition of Ready'</Cs>, …){'\n'}
        {'  '}
        <Cf>it</Cf>(<Cs>'bloque un ticket non estimé dans le backlog'</Cs>){'\n'}
        <Cf>describe</Cf>(<Cs>'R4 · immuabilité'</Cs>, …){'\n'}
        {'  '}
        <Cf>it</Cf>(<Cs>'ne modifie pas le tableau d’origine'</Cs>){'\n'}
        <Cf>describe</Cf>(<Cs>'Erreurs'</Cs>, …){'\n'}
        {'  '}
        <Cf>it</Cf>(<Cs>'signale un id inconnu sans planter'</Cs>)
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1060, top: 210, width: 740, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Row2 icon="doc" tone="blue" title="Un fichier par module" d={200}>
        <Ic>src/kanban.js</Ic> ↔ <Ic>test/kanban.test.js</Ic>
      </Row2>
      <Row2 icon="layers" tone="violet" title="Un describe par règle" d={300}>
        La sortie des tests se lit comme la spécification.
      </Row2>
      <Row2 icon="note" tone="green" title="Des noms en phrases" d={400}>
        « refuse… quand… », « accepte… », « signale… »
      </Row2>
      <Row2 icon="tool" tone="teal" title="Une fabrique de données" d={500}>
        Moins de bruit dans chaque test, les données utiles ressortent.
      </Row2>
      <Row2 icon="target" tone="coral" title="Un comportement par test" d={600}>
        Quand il échoue, une seule raison possible.
      </Row2>
    </div>
  </Frame>
);

// ─── Vérifier les assertions ────────────────────────────────────────────────
const M7Trap = ({ n, title, bad, why, d }: { n: number; title: string; bad: string; why: string; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 22px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Num n={n} tone="coral" size={36} />
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
    </div>
    <div style={{ marginTop: 10, fontFamily: mono, fontSize: 18, lineHeight: 1.5, whiteSpace: 'pre', background: '#0F1530', color: '#E6EAF6', borderRadius: 10, padding: '10px 14px' }}>{bad}</div>
    <div style={{ marginTop: 10, fontSize: 21, color: C.soft, lineHeight: 1.4 }}>{why}</div>
  </div>
);

const M7_Assertions: Page = () => (
  <Frame mod={7}>
    <Title>Vérifier la cohérence des assertions : quatre pièges</Title>
    <Lede>Pour chaque test, une seule question : échouerait-il si le code était faux ?</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 22 }}>
      <M7Trap n={1} title="Le test tautologique" bad={'const attendu = tickets.filter((t) => t.statut === "encours").length;\nassert.equal(compterEnCours(tickets), attendu);'} why="Il recalcule l’attendu avec la même logique que le code : faux et faux donnent vert." d={100} />
      <M7Trap n={2} title="L’assertion trop molle" bad={'const r = deplacerTicket(tickets, 4, "encours");\nassert.ok(r);'} why="Un objet est toujours « vrai » : le refus comme l’acceptation passent." d={200} />
      <M7Trap n={3} title="equal au lieu de deepEqual" bad={'assert.equal(r.tickets, attendu); // deux objets'} why="equal compare des références : il échoue toujours, ou on le « corrige » mal." d={300} />
      <M7Trap n={4} title="L’attendu recopié du résultat" bad={'// généré en lançant le code actuel :\nassert.equal(stats.avancement, NaN);'} why="Le test fige le bug au lieu de le révéler. L’attendu vient de la règle, pas du code." d={400} />
    </div>
  </Frame>
);

// ─── Mutation ───────────────────────────────────────────────────────────────
const M7Res = ({ ok, children }: { ok: boolean; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.ink }}>
    <span style={{ width: 30, height: 30, borderRadius: 99, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: ok ? C.green : C.coral, color: '#fff', fontWeight: 800, fontSize: 18 }}>{ok ? '✓' : '✗'}</span>
    <span>{children}</span>
  </div>
);

const M7Mutant = () => {
  const [mut, setMut] = useState(false);
  const [full, setFull] = useState(false);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '700px minmax(0, 1fr)', gap: 40 }}>
      <div>
        <CodeDark file="src/kanban.js" size={21}>
          <Ck>if</Ck> (enCours <span style={{ background: mut ? 'rgba(242,139,130,.35)' : 'rgba(155,226,155,.2)', borderRadius: 4, padding: '0 4px' }}>{mut ? '>' : '>='}</span> LIMITE_WIP){'\n  '}
          <Ck>return</Ck> {'{ ok: false, erreur: … };'}
        </CodeDark>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Toggle on={mut} onChange={setMut} tone="coral" size={24} label={<span style={{ fontWeight: 600 }}>Introduire la mutation (&gt;= devient &gt;)</span>} />
          <Toggle on={full} onChange={setFull} tone="green" size={24} label={<span style={{ fontWeight: 600 }}>Ajouter le test de la limite exacte</span>} />
        </div>
      </div>
      <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <PanelTitle icon="flask" c={C.pink}>
          npm test
        </PanelTitle>
        <M7Res ok>accepte un ticket estimé hors du backlog</M7Res>
        <M7Res ok>bloque un ticket non estimé</M7Res>
        <M7Res ok>refuse le 6e ticket quand 5 sont en cours</M7Res>
        {full ? <M7Res ok={!mut}>refuse le 4e ticket quand 3 sont en cours</M7Res> : null}
        <div style={{ marginTop: 6, borderRadius: 12, padding: '12px 16px', fontSize: 22, lineHeight: 1.4, background: mut ? (full ? T.green.bg : T.coral.bg) : T.grey.bg }}>
          {!mut ? 'Tout est vert : normal, le code est juste.' : full ? 'Un test rougit : la mutation est « tuée ». Votre filet fonctionne.' : 'Tout reste vert malgré le bug : votre suite a un trou à la limite exacte.'}
        </div>
      </div>
    </div>
  );
};

const M7_Mutation: Page = () => (
  <Frame mod={7} kind="exercice">
    <Title>Le test de mutation : casser exprès pour vérifier le filet</Title>
    <Lede>On introduit volontairement un bug. Si aucun test ne rougit, il manque un test. Que prédisez-vous ? Au micro, puis je bascule.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
      <M7Mutant />
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(500) }}>
      À l’Atelier 7, vous le ferez pour de vrai, à la main, sur votre propre suite.
    </Hint>
  </Frame>
);

// ─── Mocks ──────────────────────────────────────────────────────────────────
const M7_Mocks: Page = () => (
  <Frame mod={7} kind="demo" beats={1}>
    <Title>Premiers mocks : remplacer ce qui est lent ou imprévisible</Title>
    <Lede>Réseau, date du jour, hasard : un test unitaire ne doit dépendre d’aucun. On les injecte, puis on les simule.</Lede>
    <CodeDark file="test/api-charger.test.js" size={20} cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060 }}>
      <Ck>import</Ck> {'{ describe, it, mock }'} <Ck>from</Ck> <Cs>'node:test'</Cs>;{'\n\n'}
      <Ck>const</Ck> reponse = (status, corps) =&gt; ({'{'}
      {'\n  '}ok: status &lt; <Cn>300</Cn>, status, json: <Ck>async</Ck> () =&gt; corps,{'\n'}
      {'});\n\n'}
      <Cf>it</Cf>(<Cs>'lève « HTTP 500 » quand le serveur est en panne'</Cs>, <Ck>async</Ck> () =&gt; {'{'}
      {'\n  '}
      <Ck>const</Ck> fetchFn = mock.fn(<Ck>async</Ck> () =&gt; reponse(<Cn>500</Cn>, {'{}'}));{'\n  '}
      <Ck>await</Ck> assert.rejects(chargerTickets(<Cs>'/api'</Cs>, {'{ fetchFn }'}), /HTTP 500/);{'\n  '}
      assert.equal(fetchFn.mock.callCount(), <Cn>1</Cn>);{'\n'}
      {'});'}
    </CodeDark>
    <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card icon="plug" tone="blue" title="Injecter" size={21} pad={22} cls={A.right} style={dl(200)}>
        <Ic>fetchFn</Ic> en paramètre, <Ic>aujourdHui</Ic> en paramètre : le code est testable par construction.
      </Card>
      <Card icon="flask" tone="green" title="Simuler" size={21} pad={22} cls={A.right} style={dl(350)}>
        <Ic>mock.fn()</Ic> de node:test : une fausse fonction qui compte ses appels.
      </Card>
      <Card icon="alert" tone="coral" title="Sans excès" size={21} pad={22} cls={b.on(1)}>
        Vérifiez le résultat, pas chaque appel interne : un mock trop bavard casse au moindre refactoring.
      </Card>
    </div>
  </Frame>
);

// ─── Atelier 7 ──────────────────────────────────────────────────────────────
const M7_Lab: Page = () => (
  <LabPage
    mod={7}
    n="7"
    title="Une vraie suite de tests, générée et vérifiée"
    defi="tests"
    who="Individuel · 40 min"
    objective={
      <>
        Faire générer une suite <strong>lisible</strong> (AAA, noms en phrases) pour <Ic>deplacerTicket</Ic>, tester <Ic>chargerTickets</Ic> <strong>sans réseau</strong> avec un mock, puis prouver par une mutation que les tests détectent une erreur.
      </>
    }
    where={
      <>
        <PathChip size={19}>test/kanban.test.js</PathChip>
        <br />
        <PathChip size={19}>test/api-charger.test.js</PathChip>
        <br />
        <PathChip size={19}>npm run couverture</PathChip>
      </>
    }
    minutes={40}
    crit={
      <>
        <CheckItem id="l7a" size={21}>10 tests ou plus, groupés par règle</CheckItem>
        <CheckItem id="l7b" size={21}>3 tests de l’API, zéro réseau</CheckItem>
        <CheckItem id="l7c" size={21}>Mutation &gt;= → &gt; détectée</CheckItem>
      </>
    }
    suivi="Points d’étape à 15 min (liste des cas), 30 min (suite verte), 45 min (mutation)."
  >
    <WStep n={1}>Ask : faites lister les cas (nominaux, limites, erreurs) ; complétez la liste vous-même.</WStep>
    <WStep n={2}>Générez un test par cas, puis supprimez ou durcissez chaque test qui ne pourrait pas échouer.</WStep>
    <WStep n={3}>Mock de fetch pour l’API ; mutation à la main ; couverture ; commit.</WStep>
  </LabPage>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M7_Qcm: Page = () => (
  <Frame mod={7} kind="qcm">
    <Title>QCM · Module 7 en quatre questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Un test généré calcule l’attendu avec tickets.filter(…), exactement comme le code testé. Problème ?" explain="C’est un test tautologique : si la logique est fausse, l’attendu l’est aussi, et le test reste vert. L’attendu doit venir de la règle (une valeur écrite à la main).">
        <QOpt>Aucun, c’est plus court</QOpt>
        <QOpt ok>Il ne peut pas détecter une erreur de cette logique</QOpt>
        <QOpt>Il sera trop lent</QOpt>
      </QuizQ>
      <QuizQ q="Pour comparer deux objets dans un test node:test, on utilise…" explain="deepEqual compare le contenu ; equal compare les références (deux objets distincts ne sont jamais « égaux »).">
        <QOpt>assert.equal</QOpt>
        <QOpt ok>assert.deepEqual</QOpt>
        <QOpt>assert.ok</QOpt>
      </QuizQ>
      <QuizQ q="Vous changez >= en > dans la règle WIP et tous les tests restent verts. Conclusion ?" explain="La mutation survit : aucun test ne vérifie la limite exacte (3 en cours → le 4e refusé). Il faut écrire ce test.">
        <QOpt>Le code est robuste</QOpt>
        <QOpt ok>Il manque un test sur la limite exacte</QOpt>
        <QOpt>Les tests sont trop nombreux</QOpt>
      </QuizQ>
      <QuizQ q="Pourquoi passer fetchFn et aujourdHui en paramètres ?" explain="Pour les remplacer dans les tests par des valeurs contrôlées : pas de réseau, pas de date qui change, des tests déterministes.">
        <QOpt>Pour respecter une convention JavaScript</QOpt>
        <QOpt ok>Pour pouvoir les simuler et rendre les tests déterministes</QOpt>
        <QOpt>Pour que Copilot comprenne mieux</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ═══ 80-m8 ═════════════════════════════════════════════════════════════

// ─── Module 8 · Bonnes pratiques et vérification du code généré ─────────────

const M8_Divider: Page = () => (
  <Section
    n={8}
    title={
      <>
        Bonnes pratiques
        <br />
        et vérification
      </>
    }
    sub="Relire, détecter, prouver, et faire de Copilot un membre fiable de la revue de code d’équipe."
    dur="J2 · 15:15 – 16:40"
    labs={<Tag tone="green" size={19}>Atelier 8 · revue de code et livraison</Tag>}
  >
    <SecItem n={1}>Pourquoi ne pas faire confiance au code généré sans vérification</SecItem>
    <SecItem n={2}>Checklist de relecture : logique, performances, sécurité</SecItem>
    <SecItem n={3}>Identifier les hallucinations et les erreurs courantes</SecItem>
    <SecItem n={4}>Droits d’auteur et propriété intellectuelle</SecItem>
    <SecItem n={5}>Copilot dans le workflow de revue de code d’équipe</SecItem>
  </Section>
);
M8_Divider.transition = BLOOM;

// ─── Pourquoi vérifier ──────────────────────────────────────────────────────
const M8_Confiance: Page = () => (
  <Frame mod={8}>
    <Title>Pourquoi ne pas faire confiance sans vérifier</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 220, width: 760 }}>
      <Stat value={<CountUp to={45} suffix=" %" />} tone="coral" size={190} label={<>des échantillons de code générés par IA testés contenaient une faille de sécurité.</>} />
      <div style={{ marginTop: 18, fontSize: 19, color: C.muted }}>Source : Veracode, GenAI Code Security Report, 2025 (plus de 100 modèles, 80 tâches de code).</div>
    </div>
    <div style={{ position: 'absolute', left: 960, top: 220, width: 840, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Row2 icon="brain" tone="violet" title="Il vise le plausible, pas le correct" d={200}>
        La suggestion la plus probable n’est pas toujours la bonne.
      </Row2>
      <Row2 icon="eyeOff" tone="blue" title="Il ne voit qu’une partie du projet" d={300}>
        Règles métier, conventions, contraintes : ce qu’il ne voit pas, il le devine.
      </Row2>
      <Row2 icon="clock" tone="yellow" title="Ses connaissances ont une date" d={400}>
        API récentes, versions, failles connues : il peut avoir un train de retard.
      </Row2>
      <Row2 icon="play" tone="coral" title="Il n’exécute rien" d={500}>
        Aucune suggestion inline n’a tourné avant d’arriver dans votre éditeur.
      </Row2>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 800, width: 1680 }}>
      <Callout tone="blue" icon="humanCheck" title="Le principe" size={25} cls={A.in} style={dl(700)}>
        Une suggestion acceptée devient votre code. Vous le relisez comme celui d’un collègue, et vous le prouvez par des tests.
      </Callout>
    </div>
  </Frame>
);

// ─── Checklist de relecture ─────────────────────────────────────────────────
const M8Col = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 22px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <IconTile name={icon} tone={tone} size={48} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.ink }}>{title}</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
  </div>
);

const M8_Checklist: Page = () => (
  <Frame mod={8} kind="exercice">
    <Title>La checklist de relecture : logique, performances, sécurité</Title>
    <Lede>À garder à côté de VS Code. Pour illustrer, je coche sur une suggestion de l’Atelier 5 que vous me dictez.</Lede>
    <Checklist>
      <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 22 }}>
        <M8Col icon="checkCircle" tone="blue" title="Logique" d={100}>
          <CheckItem id="cl1" size={21} tone="blue">Fait ce qui est demandé, tout ce qui est demandé</CheckItem>
          <CheckItem id="cl2" size={21} tone="blue">Cas limites : vide, null, bornes, doublons</CheckItem>
          <CheckItem id="cl3" size={21} tone="blue">Erreurs gérées, messages clairs</CheckItem>
          <CheckItem id="cl4" size={21} tone="blue">Fonctions et API qui existent vraiment</CheckItem>
        </M8Col>
        <M8Col icon="gauge" tone="yellow" title="Performances" d={220}>
          <CheckItem id="cp1" size={21} tone="yellow">Pas de boucle dans une boucle évitable</CheckItem>
          <CheckItem id="cp2" size={21} tone="yellow">Pas de recalcul inutile dans une boucle</CheckItem>
          <CheckItem id="cp3" size={21} tone="yellow">Set ou Map pour les recherches répétées</CheckItem>
          <CheckItem id="cp4" size={21} tone="yellow">Raisonnable sur 50 000 éléments ?</CheckItem>
        </M8Col>
        <M8Col icon="shield" tone="coral" title="Sécurité" d={340}>
          <CheckItem id="cs1" size={21} tone="coral">Aucun secret, aucun jeton dans le code</CheckItem>
          <CheckItem id="cs2" size={21} tone="coral">Entrées utilisateur jamais injectées telles quelles</CheckItem>
          <CheckItem id="cs3" size={21} tone="coral">Dépendance proposée : existe-t-elle, est-elle sûre ?</CheckItem>
          <CheckItem id="cs4" size={21} tone="coral">Licence : code recopié d’un dépôt public ?</CheckItem>
        </M8Col>
      </div>
    </Checklist>
    <div style={{ position: 'absolute', left: 120, top: 830, width: 1680 }}>
      <Callout tone="green" icon="flask" title="Et toujours, la preuve" size={24} cls={A.in} style={dl(600)}>
        Chaque doute devient un test. Un test qui échoue vaut mieux qu’une impression rassurante.
      </Callout>
    </div>
  </Frame>
);

// ─── Hallucinations ─────────────────────────────────────────────────────────
const M8Hallu = ({ icon, title, ex, detect, d }: { icon: IconName; title: string; ex: ReactNode; detect: string; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 22px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone="coral" size={44} />
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
    </div>
    <div style={{ marginTop: 10, fontSize: 20, color: C.ink, lineHeight: 1.4 }}>{ex}</div>
    <div style={{ marginTop: 8, fontSize: 19, color: T.green.fg, lineHeight: 1.35 }}>
      <strong>Détecter · </strong>
      {detect}
    </div>
  </div>
);

const M8_Hallucinations: Page = () => (
  <Frame mod={8}>
    <Title>Identifier les hallucinations et les erreurs courantes</Title>
    <Lede>Une hallucination, c’est du code ou une affirmation inventés, présentés avec assurance. Six formes fréquentes :</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20 }}>
      <M8Hallu icon="sparkles" title="L’API inventée" ex={<><Ic>tickets.sortBy("priorite")</Ic> : n’existe pas en JavaScript.</>} detect="exécuter ; documentation officielle" d={100} />
      <M8Hallu icon="archive" title="Le paquet fantôme" ex={<><Ic>npm install csv-taskflow-utils</Ic> : nom plausible, inexistant… ou piégé.</>} detect="npm view, page du paquet, popularité" d={180} />
      <M8Hallu icon="gear" title="L’option imaginaire" ex={<>Un paramètre qui « devrait » exister dans une vraie fonction.</>} detect="infobulle de VS Code, types" d={260} />
      <M8Hallu icon="clock" title="La syntaxe périmée" ex={<>Une API dépréciée, une ancienne version de bibliothèque.</>} detect="version installée, avertissements" d={340} />
      <M8Hallu icon="brain" title="La logique plausible" ex={<>Année bissextile « divisible par 4 », points « entre 1 et 13 ».</>} detect="cas limites, tests à partir de la règle" d={420} />
      <M8Hallu icon="chat" title="L’explication assurée" ex={<>« Ce code est sûr et optimal » : une affirmation n’est pas une preuve.</>} detect="demander : « comment le vérifier ? »" d={500} />
    </div>
  </Frame>
);

// ─── Sécurité ───────────────────────────────────────────────────────────────
const M8Sec = ({ tone, title, bad, good, d }: { tone: Tone; title: string; bad: string; good: string; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 22px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 12, fontFamily: mono, fontSize: 18, lineHeight: 1.5, whiteSpace: 'pre', background: T.coral.bg, color: T.coral.fg, borderRadius: 10, padding: '10px 14px' }}>{bad}</div>
    <div style={{ textAlign: 'center', fontSize: 22, color: C.faint, margin: '4px 0' }}>↓</div>
    <div style={{ fontFamily: mono, fontSize: 18, lineHeight: 1.5, whiteSpace: 'pre', background: T.green.bg, color: T.green.fg, borderRadius: 10, padding: '10px 14px' }}>{good}</div>
  </div>
);

const M8_Securite: Page = () => (
  <Frame mod={8}>
    <Title>Sécurité : les trois réflexes du débutant</Title>
    <Lede>Copilot reproduit les motifs les plus fréquents, y compris les mauvaises habitudes. Trois cas reviennent sans cesse :</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <M8Sec tone="coral" title="1 · Les secrets" bad={'const TOKEN = "ghp_…";\nfetch(url + "?token=" + TOKEN)'} good={'const jeton = process.env.TASKFLOW_TOKEN;\nheaders: { Authorization: … }'} d={100} />
      <M8Sec tone="violet" title="2 · Les injections" bad={'carte.innerHTML =\n  "<h3>" + ticket.titre + "</h3>";'} good={'titre.textContent = ticket.titre;\n// requêtes SQL paramétrées'} d={220} />
      <M8Sec tone="blue" title="3 · Les dépendances" bad={'npm install un-paquet-propose\n# jamais vérifié'} good={'npm view un-paquet-propose\n# existe ? maintenu ? populaire ?'} d={340} />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 760, width: 1680 }}>
      <Callout tone="coral" icon="lock" title="Un secret commité est un secret publié" size={24} cls={A.in} style={dl(600)}>
        Même supprimé ensuite, il reste dans l’historique Git. Révoquez-le immédiatement, puis nettoyez.
      </Callout>
    </div>
  </Frame>
);

// ─── Droits d'auteur ────────────────────────────────────────────────────────
const M8_Droits: Page = () => (
  <Frame mod={8}>
    <Title>Droits d’auteur et propriété intellectuelle</Title>
    <Lede>Copilot a appris sur du code public, sous toutes sortes de licences. Ce qu’il faut savoir, sans être juriste :</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 22 }}>
      <Card icon="user" tone="blue" title="Le code accepté vous engage" size={22} pad={24} cls={A.in} style={dl(100)}>
        GitHub ne revendique pas la propriété des suggestions : vous en êtes responsable, comme de tout code que vous intégrez.
      </Card>
      <Card icon="globe" tone="violet" title="Le filtre « code public »" size={22} pad={24} cls={A.in} style={dl(200)}>
        Bloquer les suggestions qui reproduisent un code public, ou les autoriser avec la référence du dépôt d’origine et sa licence.
      </Card>
      <Card icon="scale" tone="teal" title="Les licences « copyleft »" size={22} pad={24} cls={A.in} style={dl(300)}>
        Un long bloc copié d’un projet GPL peut imposer ses conditions à votre code. Un en-tête de licence dans une suggestion : alerte.
      </Card>
      <Card icon="org" tone="green" title="La politique de l’entreprise" size={22} pad={24} cls={A.in} style={dl(400)}>
        En Business et Enterprise, GitHub prévoit une garantie juridique, sous conditions (dont le filtre activé). Suivez les règles internes.
      </Card>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 740, width: 1680 }}>
      <Callout tone="yellow" icon="bulb" title="Règle pratique" size={24} cls={A.in} style={dl(600)}>
        Code court et générique : aucun souci. Long bloc spécifique, en-tête de licence, nom d’auteur : on ne l’intègre pas, on le réécrit ou on demande.
      </Callout>
    </div>
  </Frame>
);

// ─── Workflow de revue ──────────────────────────────────────────────────────
const M8Flow = ({ n, icon, tone, title, sub, who }: { n: number; icon: IconName; tone: Tone; title: string; sub: string; who: string }) => (
  <div className={b.on(n)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: 250 }}>
    <IconTile name={icon} tone={tone} size={70} solid />
    <div style={{ marginTop: 14, fontSize: 23, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{title}</div>
    <div style={{ marginTop: 6, fontSize: 19, color: C.soft, lineHeight: 1.35 }}>{sub}</div>
    <Tag tone={tone} size={16} style={{ marginTop: 10 }}>
      {who}
    </Tag>
  </div>
);

const M8_Revue: Page = () => (
  <Frame mod={8} beats={6}>
    <Title>Intégrer Copilot dans la revue de code d’équipe</Title>
    <Lede>Copilot intervient à plusieurs étapes. Aucune ne remplace la relecture humaine ni les tests automatiques.</Lede>
    <div className={A.grow} style={{ position: 'absolute', left: 245, top: 334, width: 1430, height: 4, background: C.rule }} />
    <div style={{ position: 'absolute', left: 120, top: 300, width: 1680, display: 'flex', justifyContent: 'space-between' }}>
      <M8Flow n={1} icon="code" tone="blue" title="Écrire" sub="avec Copilot, petits commits" who="vous + Copilot" />
      <M8Flow n={2} icon="checkCircle" tone="navy" title="Se relire" sub="checklist, tests au vert" who="vous" />
      <M8Flow n={3} icon="sparkles" tone="violet" title="Second avis" sub="revue Copilot de la sélection" who="Copilot" />
      <M8Flow n={4} icon="git" tone="teal" title="Pull request" sub="description claire, rôle de l’IA" who="vous" />
      <M8Flow n={5} icon="shieldCheck" tone="coral" title="Revue humaine" sub="+ revue Copilot (offres payantes)" who="équipe" />
      <M8Flow n={6} icon="flask" tone="green" title="Intégration" sub="tests automatiques, puis fusion" who="CI" />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 720, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24 }}>
      <Callout tone="blue" icon="doc" title="Dans la pull request" size={22} cls={b.on(4)}>
        Dites ce qui a été généré et comment vous l’avez vérifié : le relecteur sait où regarder.
      </Callout>
      <Callout tone="green" icon="users" title="Des règles partagées" size={22} cls={b.on(6)}>
        Les conventions de l’équipe vont dans le dépôt : un fichier d’instructions lu par Copilot.
      </Callout>
    </div>
  </Frame>
);

// ─── Le fichier d'instructions ──────────────────────────────────────────────
const M8_Instructions: Page = () => (
  <Frame mod={8} kind="demo">
    <Title>Le fichier d’instructions de l’équipe</Title>
    <Lede>Un fichier Markdown versionné, joint automatiquement aux demandes du chat et des agents.</Lede>
    <CodeDark file=".github/copilot-instructions.md" size={20} wrap cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1000 }}>
      <Ck># TaskFlow · conventions</Ck>
      {'\n'}- JavaScript moderne (ES modules), const/let, ===.{'\n'}- Logique métier en fonctions pures : jamais new Date(),{'\n  '}la date du jour est passée en paramètre.{'\n'}- Erreurs métier : {'{ ok: false, erreur }'}, jamais alert().{'\n'}- Affichage : textContent, jamais innerHTML.{'\n'}- Aucun secret dans le code : process.env.{'\n'}- Tests : node:test + node:assert/strict, motif AAA,{'\n  '}noms en phrases (« refuse… quand… »).{'\n'}- Toute fonction exportée a une JSDoc complète.
    </CodeDark>
    <div style={{ position: 'absolute', left: 1170, top: 262, width: 630, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card icon="check" tone="green" title="Bien écrit" size={21} pad={22} cls={A.right} style={dl(200)}>
        Court, concret, vérifiable. Des règles, pas une encyclopédie.
      </Card>
      <Card icon="eye" tone="blue" title="Vérifier qu’il est lu" size={21} pad={22} cls={A.right} style={dl(350)}>
        Sous la réponse du chat, la liste des références cite le fichier.
      </Card>
      <Card icon="bolt" tone="violet" title="Le générer" size={21} pad={22} cls={A.right} style={dl(500)}>
        <Ic>/init</Ic> dans une session d’agent propose un premier jet à partir du projet. À relire !
      </Card>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(700) }}>
      Il guide le chat et les agents ; les suggestions inline, elles, imitent surtout le fichier ouvert.
    </Hint>
  </Frame>
);

const M8_Pause: Page = () => <BreakPage mod={8} title="Pause" back="Reprise à 16 h 00 : l’Atelier 8, la revue de code finale." minutes={15} />;

// ─── Atelier 8 ──────────────────────────────────────────────────────────────
const M8_Lab: Page = () => (
  <LabPage
    mod={8}
    n="8"
    title="Revue de code et livraison"
    defi="revue"
    who="Individuel · 30 min"
    objective={
      <>
        Relire <strong>8 suggestions acceptées trop vite</strong> avec la checklist, prouver chaque défaut par un test, le corriger, puis livrer TaskFlow avec un <PathChip size={22}>.github/copilot-instructions.md</PathChip>.
      </>
    }
    where={
      <>
        <PathChip size={19}>ateliers/atelier-08-revue/</PathChip>
        <br />
        <PathChip size={19}>REVUE.md</PathChip> · <PathChip size={19}>revue.test.js</PathChip>
      </>
    }
    minutes={30}
    crit={
      <>
        <CheckItem id="l8a" size={21}>8 défauts identifiés et classés</CheckItem>
        <CheckItem id="l8b" size={21}>test:revue au vert après correction</CheckItem>
        <CheckItem id="l8c" size={21}>Instructions versionnées, npm test vert</CheckItem>
      </>
    }
    suivi="Points d’étape à 10 min (relecture sans outil) et 30 min. Préparez 2 min de restitution."
  >
    <WStep n={1}>Relire sans outil : défaut soupçonné et catégorie dans REVUE.md. Puis second avis de Copilot sur deux d’entre eux.</WStep>
    <WStep n={2}>Un test qui échoue par défaut (01 à 07), puis la correction jusqu’au vert. Pour 08 : une décision.</WStep>
    <WStep n={3}>Écrivez vos 5 à 8 règles d’équipe, vérifiez-les dans le chat, commit final.</WStep>
  </LabPage>
);

// ─── Restitution ────────────────────────────────────────────────────────────
const M8_Restitution: Page = () => (
  <Frame mod={8} kind="exercice" label="Restitutions">
    <Title>Restitution : deux volontaires, deux minutes</Title>
    <Lede>Partage d’écran, minuteur à l’écran, questions au micro. Les autres : une capture dans le clavardage.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1060, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M4Key n={1} tone="blue" title="Le défaut le mieux caché" d={100}>
        Lequel des 8, et le test qui l’a prouvé.
      </M4Key>
      <M4Key n={2} tone="violet" title="Ce que Copilot a trouvé… ou manqué" d={200}>
        Son second avis face au vôtre.
      </M4Key>
      <M4Key n={3} tone="green" title="Votre règle d’équipe préférée" d={300}>
        Celle de copilot-instructions.md que vous emportez lundi.
      </M4Key>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Timer id="restitution" minutes={2} label="Participant suivant" cls={A.right} style={{ width: 560, ...dl(200) }} />
      <Callout tone="teal" icon="users" title="Rétroaction" size={22} cls={A.right} style={dl(400)}>
        Un point fort, une piste, au micro. Plus de 10 participants : 5 ou 6 volontaires, les autres déposent une capture dans le clavardage.
      </Callout>
    </div>
  </Frame>
);

// ─── QCM ────────────────────────────────────────────────────────────────────
const M8_Qcm: Page = () => (
  <Frame mod={8} kind="qcm">
    <Title>QCM · Module 8 en quatre questions</Title>
    <QuizSeries y={200}>
      <QuizQ q="Copilot propose npm install csv-taskflow-utils. Votre premier réflexe ?" explain="Un paquet suggéré peut ne pas exister, ou avoir été créé par un attaquant sur un nom « halluciné » plausible. On vérifie qu’il existe, qui le maintient, sa popularité.">
        <QOpt>Je l’installe, Copilot connaît l’écosystème</QOpt>
        <QOpt ok>Je vérifie qu’il existe et qu’il est fiable avant tout</QOpt>
        <QOpt>Je demande à Copilot s’il est sûr</QOpt>
      </QuizQ>
      <QuizQ q="Une suggestion arrive avec un en-tête « Licensed under the GPL v3 ». Que faites-vous ?" explain="C’est un signal de code recopié sous licence copyleft. On ne l’intègre pas tel quel : on réécrit, on utilise une alternative (ici structuredClone), ou on suit la politique de l’entreprise.">
        <QOpt>Je supprime l’en-tête et je garde le code</QOpt>
        <QOpt ok>Je ne l’intègre pas tel quel : alternative ou réécriture</QOpt>
        <QOpt>Je l’accepte : Copilot ne propose que du code libre</QOpt>
      </QuizQ>
      <QuizQ q="Où mettre la règle « textContent, jamais innerHTML » pour que toute l’équipe en profite avec Copilot ?" explain="Le fichier .github/copilot-instructions.md est versionné avec le dépôt et joint automatiquement aux demandes du chat et des agents.">
        <QOpt>Dans un message du chat, à chaque fois</QOpt>
        <QOpt ok>Dans .github/copilot-instructions.md</QOpt>
        <QOpt>Dans les réglages personnels de VS Code</QOpt>
      </QuizQ>
      <QuizQ q="La revue Copilot d’une pull request ne trouve rien. Peut-on fusionner ?" explain="La revue automatique est un second avis : elle ne remplace ni la relecture humaine ni les tests de la CI.">
        <QOpt>Oui, elle a tout vérifié</QOpt>
        <QOpt>Oui, si le code a été généré par Copilot</QOpt>
        <QOpt ok>Non : relecture humaine et tests restent nécessaires</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ═══ 85-m9 ═════════════════════════════════════════════════════════════

// ─── Module 9 · Les agents dans Copilot (Jour 2, fin) ───────────────────────
// Numéro interne 11 (le 9 sert à la clôture) ; affiché « Module 9 ».
// Formats vérifiés le 5 novembre 2026 sur code.visualstudio.com :
// .github/agents/*.agent.md (name, description, tools, agents, model, skills, handoffs)
// .github/skills/<nom>/SKILL.md (name = nom du dossier, description), chargement progressif.

CSS.push(`
@keyframes ${P}-pkt{from{transform:translate(var(--x0),var(--y0)) translate(-50%,-50%) scale(.6);opacity:0}12%{opacity:1}to{transform:translate(var(--x1),var(--y1)) translate(-50%,-50%) scale(1);opacity:1}}
.${P}-pkt{position:absolute;left:0;top:0;animation:${P}-pkt 1050ms ${EASE} var(--d,0ms) both;pointer-events:none}
@keyframes ${P}-edge{to{stroke-dashoffset:-28}}
.${P}-edge{stroke-dasharray:10 8;animation:${P}-edge 700ms linear infinite}
.${P}-agn{transition:transform 360ms ${EASE_BACK},box-shadow 300ms ${EASE},opacity 300ms ${EASE},background 300ms ${EASE}}
.${P}-row{cursor:pointer;transition:background 220ms ${EASE}}
.${P}-chip{cursor:pointer;transition:all 220ms ${EASE}}
.${P}-gstep{transition:opacity 300ms ${EASE},transform 300ms ${EASE}}
`);

// ─── Diviseur ───────────────────────────────────────────────────────────────
const M9_Divider: Page = () => (
  <Section
    n={11}
    num={9}
    title={
      <>
        Les agents
        <br />
        dans Copilot
      </>
    }
    sub="Un rôle, des outils, des savoir-faire… et une équipe d’agents qui travaille ensemble, sous votre contrôle."
    dur="J2 · 16:40 – 17:20"
    labs={<Tag tone="green" size={19}>Atelier 9 · votre équipe d’agents</Tag>}
  >
    <SecItem n={1}>Un agent personnalisé : rôle, outils, relais</SecItem>
    <SecItem n={2}>Créer un agent dans VS Code</SecItem>
    <SecItem n={3}>Les Skills : un savoir-faire chargé à la demande</SecItem>
    <SecItem n={4}>Orchestrer une équipe d’agents</SecItem>
    <SecItem n={5}>Le potentiel… et les points d’attention</SecItem>
  </Section>
);
M9_Divider.transition = BLOOM;

// ─── Anatomie d’un agent ────────────────────────────────────────────────────
type AnaField = 'name' | 'desc' | 'tools' | 'skills' | 'handoffs' | 'body';
const ANA_LINES: { f: AnaField; node: ReactNode }[] = [
  { f: 'name', node: <span style={{ color: '#7C86A8' }}>---</span> },
  { f: 'name', node: <><Ck>name</Ck>: Testeur QA</> },
  { f: 'desc', node: <><Ck>description</Ck>: Vérifie une fonctionnalité avec</> },
  { f: 'desc', node: <>{'  '}des tests de cas limites. Ne corrige jamais src/.</> },
  { f: 'tools', node: <><Ck>tools</Ck>: [<Cs>'read'</Cs>, <Cs>'search'</Cs>, <Cs>'edit'</Cs>, <Cs>'execute'</Cs>]</> },
  { f: 'skills', node: <><Ck>skills</Ck>: [<Cs>'tests-node'</Cs>]</> },
  { f: 'handoffs', node: <><Ck>handoffs</Ck>:</> },
  { f: 'handoffs', node: <>{'  - '}<Ck>label</Ck>: Renvoyer au Développeur</> },
  { f: 'handoffs', node: <>{'    '}<Ck>agent</Ck>: Développeur</> },
  { f: 'handoffs', node: <>{'    '}<Ck>prompt</Ck>: Corrige les échecs signalés…</> },
  { f: 'body', node: <span style={{ color: '#7C86A8' }}>---</span> },
  { f: 'body', node: <>Tu es le testeur QA de TaskFlow.</> },
  { f: 'body', node: <>Tu ne fais pas confiance au développeur : tu vérifies.</> },
  { f: 'body', node: <>- Tu modifies uniquement test/*-qa.test.js.</> },
  { f: 'body', node: <>- Un test qui échoue ne s’affaiblit pas.</> },
];
const ANA_INFO: Record<AnaField, { t: string; tone: Tone; icon: IconName; text: ReactNode; tip: string }> = {
  name: { t: 'name · le nom', tone: 'navy', icon: 'user', text: 'Le nom affiché dans la liste des agents du chat. C’est aussi lui qu’on cite pour un relais ou un sous-agent.', tip: 'Court et unique : « Testeur QA », pas « Agent 2 ».' },
  desc: { t: 'description · quand l’utiliser', tone: 'blue', icon: 'note', text: 'Obligatoire. Elle dit ce que fait l’agent et quand le choisir ; un chef d’orchestre la lit pour décider à qui déléguer.', tip: 'Dites aussi ce qu’il ne fait jamais.' },
  tools: { t: 'tools · ce qu’il a le droit de faire', tone: 'coral', icon: 'tool', text: 'La liste des outils : sans « edit », il ne peut pas modifier de fichier ; sans « execute », pas de terminal. Cliquez les outils pour voir le risque.', tip: 'Le minimum nécessaire, jamais « * » par confort.' },
  skills: { t: 'skills · ses savoir-faire', tone: 'violet', icon: 'book', text: 'Les skills chargées dans son contexte : ici la procédure de tests du projet, écrite une fois, réutilisée par chaque agent.', tip: 'Une skill = un dossier .github/skills/<nom>/.' },
  handoffs: { t: 'handoffs · les relais', tone: 'green', icon: 'send', text: 'À la fin de sa réponse, un bouton propose de passer la main à un autre agent, avec une demande pré-remplie. Vous relisez, puis vous cliquez.', tip: 'send: false = vous gardez la main avant chaque relais.' },
  body: { t: 'Le corps · son rôle et ses règles', tone: 'pink', icon: 'chat', text: 'Les consignes en Markdown, ajoutées à chaque demande faite à cet agent : sa mission, sa méthode, ses interdits.', tip: 'Des règles vérifiables, pas des vœux pieux.' },
};
const ANA_ORDER: AnaField[] = ['name', 'desc', 'tools', 'skills', 'handoffs', 'body'];
const TOOLS9 = [
  { id: 'read', what: 'lire les fichiers', risk: 1 },
  { id: 'search', what: 'chercher dans le code', risk: 1 },
  { id: 'todo', what: 'tenir une liste de tâches', risk: 0 },
  { id: 'edit', what: 'créer et modifier des fichiers', risk: 2 },
  { id: 'agent', what: 'déléguer à d’autres agents', risk: 2 },
  { id: 'execute', what: 'lancer des commandes (terminal)', risk: 3 },
  { id: 'web', what: 'lire des pages Internet', risk: 3 },
];

const M9_Anatomie: Page = () => {
  const [ref, beats] = useBeats();
  const [pick, setPick] = useState<AnaField | null>(null);
  const [tools, setTools] = useState<string[]>(['read', 'search', 'edit', 'execute']);
  useEffect(() => setPick(null), [beats]);
  const sel = pick ?? ANA_ORDER[Math.min(beats, 5)];
  const info = ANA_INFO[sel];
  const risk = TOOLS9.filter((t) => tools.includes(t.id)).reduce((a, t) => a + t.risk, 0);
  const lvl = risk <= 3 ? { t: 'faible', tone: 'green' as Tone } : risk <= 7 ? { t: 'modéré', tone: 'yellow' as Tone } : { t: 'élevé', tone: 'coral' as Tone };
  const injection = tools.includes('execute') && tools.includes('web');
  return (
    <Frame mod={11} beats={5}>
      <Title>Un agent personnalisé, c’est un fichier .agent.md</Title>
      <Lede>Un rôle, des outils, des savoir-faire et des relais, écrits une fois et versionnés avec le code. Cliquez une ligne.</Lede>
      <div ref={ref} className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 900, boxSizing: 'border-box', background: '#0F1730', borderRadius: 20, boxShadow: SHADOW, padding: '16px 0 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px 10px', fontFamily: mono, fontSize: 18, color: '#9AA6C8' }}>
          <Icon name="doc" size={22} color="#9AA6C8" /> .github/agents/testeur-qa.agent.md
        </div>
        {ANA_LINES.map((l, i) => {
          const on = l.f === sel;
          return (
            <div
              key={i}
              role="button"
              data-osd-interactive
              className={k('row')}
              onClick={() => setPick(l.f)}
              style={{ display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr)', fontFamily: mono, fontSize: 21, lineHeight: '33px', color: on ? '#fff' : '#C9D2EA', background: on ? 'rgba(116,66,224,.32)' : 'transparent', boxShadow: on ? `inset 5px 0 0 ${STRONG[ANA_INFO[l.f].tone]}` : 'none', whiteSpace: 'pre' }}
            >
              <span style={{ textAlign: 'right', paddingRight: 14, color: '#56607E' }}>{i + 1}</span>
              <span>{l.node}</span>
            </div>
          );
        })}
      </div>
      <div key={sel} className={k('swap')} style={{ position: 'absolute', left: 1070, top: 270, width: 730, boxSizing: 'border-box', background: C.card, borderRadius: 22, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[info.tone]}`, padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconTile name={info.icon} tone={info.tone} size={56} solid />
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.ink }}>{info.t}</span>
        </div>
        <div style={{ fontSize: 23, lineHeight: 1.45, color: C.soft }}>{info.text}</div>
        {sel === 'tools' ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
              {TOOLS9.map((t) => {
                const on = tools.includes(t.id);
                const tone: Tone = t.risk >= 3 ? 'coral' : t.risk === 2 ? 'yellow' : 'green';
                return (
                  <div
                    key={t.id}
                    role="button"
                    data-osd-interactive
                    className={k('chip')}
                    onClick={() => setTools((o) => (o.includes(t.id) ? o.filter((x) => x !== t.id) : [...o, t.id]))}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 12, background: on ? T[tone].bg : C.panel, boxShadow: on ? `inset 0 0 0 2px ${STRONG[tone]}` : 'none', opacity: on ? 1 : 0.6 }}
                  >
                    <Icon name={on ? 'checkCircle' : 'x'} size={22} color={on ? STRONG[tone] : C.faint} sw={2.4} />
                    <span style={{ fontFamily: mono, fontSize: 19, fontWeight: 700, color: C.ink }}>{t.id}</span>
                    <span style={{ fontSize: 17, color: C.soft, lineHeight: 1.2 }}>{t.what}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 21, color: C.soft }}>
              Pouvoir donné :
              <div style={{ flex: 1, height: 16, borderRadius: 8, background: C.panel, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (risk / 12) * 100)}%`, height: '100%', background: STRONG[lvl.tone], transition: `width 400ms ${EASE}` }} />
              </div>
              <Tag tone={lvl.tone} size={18}>
                {lvl.t}
              </Tag>
            </div>
            {injection ? <div style={{ fontSize: 19, color: T.coral.fg, fontWeight: 600 }}>⚠ Terminal + Internet : une page piégée peut lui dicter une commande (injection de prompt).</div> : null}
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: T[info.tone].bg, color: T[info.tone].fg, borderRadius: 14, padding: '14px 18px', fontSize: 21, fontWeight: 600 }}>
            <Icon name="bulb" size={26} sw={2.2} /> {info.tip}
          </div>
        )}
      </div>
    </Frame>
  );
};

// ─── Créer un agent ─────────────────────────────────────────────────────────
const M9Step = ({ n, title, children, on }: { n: number; title: ReactNode; children: ReactNode; on: boolean }) => (
  <div className={k('gstep')} style={{ display: 'grid', gridTemplateColumns: '56px minmax(0, 1fr)', gap: 16, alignItems: 'start', opacity: on ? 1 : 0.35, transform: on ? 'none' : 'translateX(-8px)' }}>
    <span style={{ width: 56, height: 56, borderRadius: 16, background: on ? G.blue : C.panel, color: on ? '#fff' : C.muted, fontFamily: display, fontWeight: 800, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>
    <div>
      <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 20, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const MockBar = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#1B2340', color: '#9AA6C8', fontFamily: mono, fontSize: 17, borderBottom: '1px solid #2A3459' }}>
    <span style={{ width: 11, height: 11, borderRadius: 99, background: '#FF5F57' }} />
    <span style={{ width: 11, height: 11, borderRadius: 99, background: '#FEBC2E' }} />
    <span style={{ width: 11, height: 11, borderRadius: 99, background: '#28C840' }} />
    <span style={{ marginLeft: 10 }}>{children}</span>
  </div>
);

const M9_Creer: Page = () => {
  const [ref, beats] = useBeats();
  const st = Math.min(Math.max(beats, 0), 4);
  const row = (txt: ReactNode, hi = false, icon: IconName = 'doc') => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 14px', borderRadius: 8, background: hi ? 'rgba(30,34,232,.5)' : 'transparent', color: hi ? '#fff' : '#C9D2EA', fontSize: 19 }}>
      <Icon name={icon} size={20} color={hi ? '#fff' : '#7C86A8'} /> {txt}
    </div>
  );
  return (
    <Frame mod={11} beats={4}>
      <Title>Créer un agent : quatre gestes dans VS Code</Title>
      <Lede>Pas d’extension à installer : un fichier dans le dépôt suffit, et toute l’équipe en profite via Git.</Lede>
      <div ref={ref} style={{ position: 'absolute', left: 120, top: 280, width: 820, display: 'flex', flexDirection: 'column', gap: 26 }}>
        <M9Step n={1} on={st >= 1} title="Ouvrir les personnalisations">
          <Kbd>Ctrl+Maj+P</Kbd> › « Chat: Open Customizations »
        </M9Step>
        <M9Step n={2} on={st >= 2} title="Onglet Agents › New Agent (+) › Workspace">
          Workspace = dans ce dépôt, partagé par Git. User = pour tous vos projets.
        </M9Step>
        <M9Step n={3} on={st >= 3} title="Nommer, puis écrire le rôle">
          testeur-qa → <PathChip size={18}>.github/agents/testeur-qa.agent.md</PathChip>
        </M9Step>
        <M9Step n={4} on={st >= 4} title="Le choisir dans la liste des agents du chat">
          Il rejoint Ask, Plan et Agent. Testez-le sur une petite tâche connue.
        </M9Step>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1000, top: 280, width: 800, height: 470, boxSizing: 'border-box', background: '#0F1730', borderRadius: 20, boxShadow: SHADOW, overflow: 'hidden', ...dl(200) }}>
        <MockBar>Visual Studio Code · taskflow-copilot</MockBar>
        <div key={st} className={k('swap')} style={{ padding: 22, fontFamily: mono }}>
          {st <= 1 ? (
            <div style={{ background: '#1B2340', borderRadius: 12, padding: 12, boxShadow: '0 16px 40px -16px rgba(0,0,0,.7)' }}>
              <div style={{ background: '#0F1730', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 20, boxShadow: `inset 0 0 0 2px ${C.electric}` }}>&gt; chat: open custo▌</div>
              <div style={{ marginTop: 8 }}>
                {row('Chat: Open Customizations', st >= 1, 'gear')}
                {row('Chat: New Custom Agent…', false, 'plus')}
                {row('Chat: Configure Instructions', false, 'note')}
              </div>
            </div>
          ) : st === 2 ? (
            <div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {['Agents', 'Skills', 'Instructions', 'Prompts'].map((t, i) => (
                  <span key={t} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 18, background: i === 0 ? C.electric : '#1B2340', color: i === 0 ? '#fff' : '#9AA6C8' }}>{t}</span>
                ))}
              </div>
              {row(<><strong>Workspace</strong> · .github/agents</>, false, 'archive')}
              {row('+ New Agent', true, 'plus')}
              {row(<><strong>User</strong> · ~/.copilot/agents</>, false, 'user')}
            </div>
          ) : st === 3 ? (
            <div>
              {row('taskflow-copilot', false, 'archive')}
              {row('  .github', false, 'archive')}
              {row('    agents', false, 'archive')}
              {row('      testeur-qa.agent.md', true, 'doc')}
              {row('    skills', false, 'archive')}
              {row('    copilot-instructions.md', false, 'note')}
            </div>
          ) : (
            <div>
              <div style={{ color: '#9AA6C8', fontSize: 17, marginBottom: 8 }}>CHAT · choisir un agent</div>
              {row('Agent', false, 'bot')}
              {row('Ask', false, 'chat')}
              {row('Plan', false, 'route')}
              <div style={{ height: 1, background: '#2A3459', margin: '8px 0' }} />
              {row('Analyste PO', false, 'user')}
              {row('Développeur', false, 'code')}
              {row('Testeur QA', true, 'flask')}
            </div>
          )}
        </div>
      </div>
      <div className={b.on(4)} style={{ position: 'absolute', left: 1000, top: 780, width: 800 }}>
        <Callout tone="green" icon="send" title="Les relais (handoffs)" size={21}>
          Quand un agent a fini, un bouton propose « Confier au Testeur QA » avec une demande pré-remplie. Vous relisez, puis vous cliquez.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Skills ─────────────────────────────────────────────────────────────────
type SkLvl = 1 | 2 | 3;
const SKILLS9 = [
  { id: 'conventions-taskflow', desc: 'Conventions de code TaskFlow. À utiliser pour écrire du code dans src/.', res: null as string | null },
  { id: 'tests-node', desc: 'Écrire et lancer des tests node:test pour TaskFlow.', res: 'modele.test.js' },
  { id: 'note-de-version', desc: 'Rédiger la note de version d’un sprint.', res: 'gabarit.md' },
];
const SK_REQ: { q: string; lv: SkLvl[] }[] = [
  { q: 'Ajoute des tests pour echeances.js', lv: [1, 3, 1] },
  { q: 'Implémente ticketsEnRetard dans src/', lv: [2, 1, 1] },
  { q: 'Renomme la variable x en total', lv: [1, 1, 1] },
  { q: '/note-de-version sprint 12', lv: [1, 1, 3] },
];
const SK_TOK = (lv: SkLvl) => (lv === 1 ? 0.1 : lv === 2 ? 1.5 : 2.4);

const M9_Skills: Page = () => {
  const [ref, beats] = useBeats();
  const [pick, setPick] = useState<number | null>(null);
  useEffect(() => setPick(null), [beats]);
  const ri = pick ?? Math.min(Math.max(beats - 1, 0), 3);
  const req = SK_REQ[ri];
  const tok = req.lv.reduce((a, l) => a + SK_TOK(l), 0);
  const LV: Record<SkLvl, { t: string; tone: Tone }> = { 1: { t: 'nom + description', tone: 'grey' }, 2: { t: '+ instructions', tone: 'blue' }, 3: { t: '+ fichiers', tone: 'violet' } };
  return (
    <Frame mod={11} beats={4}>
      <Title>Une Skill : un savoir-faire chargé seulement quand il sert</Title>
      <Lede>Un dossier, un SKILL.md, des fichiers. Copilot lit la description ; le reste n’entre que si la demande le justifie.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 290, width: 700, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <CodeDark file=".github/skills/tests-node/SKILL.md" size={19}>
          <span style={{ color: '#7C86A8' }}>---</span>
          {'\n'}
          <Ck>name</Ck>: tests-node
          {'\n'}
          <Ck>description</Ck>: Écrire et lancer des tests
          {'\n'}
          {'  '}node:test pour TaskFlow (AAA, cas limites).
          {'\n'}
          <span style={{ color: '#7C86A8' }}>---</span>
          {'\n'}
          <Cf># Tests node:test pour TaskFlow</Cf>
          {'\n'}- assert/strict, dates fixes AAAA-MM-JJ
          {'\n'}- cas limites : vide, bornes, 29 février…
          {'\n'}- Modèle : [modele.test.js](./modele.test.js)
        </CodeDark>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
          {[
            ['1', 'Découverte', 'nom + description, toujours lus', 'grey'],
            ['2', 'Instructions', 'le corps du SKILL.md, si pertinent', 'blue'],
            ['3', 'Ressources', 'fichiers cités, si nécessaires', 'violet'],
          ].map(([n, t, s2, tone]) => (
            <div key={n} style={{ background: T[tone as Tone].bg, borderRadius: 14, padding: '12px 14px' }}>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 21, color: T[tone as Tone].fg }}>
                {n} · {t}
              </div>
              <div style={{ marginTop: 4, fontSize: 18, lineHeight: 1.35, color: C.soft }}>{s2}</div>
            </div>
          ))}
        </div>
      </div>
      <div ref={ref} className={A.right} style={{ position: 'absolute', left: 870, top: 290, width: 930, boxSizing: 'border-box', background: C.card, borderRadius: 22, boxShadow: SHADOW, padding: '22px 26px', ...dl(200) }}>
        <PanelTitle icon="chat">Votre demande · cliquez</PanelTitle>
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
          {SK_REQ.map((r, i) => (
            <Btn key={r.q} size={18} ghost={i !== ri} onClick={() => setPick(i)} style={{ justifyContent: 'flex-start', whiteSpace: 'normal', textAlign: 'left' }}>
              {r.q}
            </Btn>
          ))}
        </div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SKILLS9.map((s, i) => {
            const lv = req.lv[i];
            const L = LV[lv];
            return (
              <div key={`${ri}-${s.id}`} className={k('swap')} style={{ ...dl(i * 90), display: 'grid', gridTemplateColumns: '230px minmax(0, 1fr) 170px', gap: 12, alignItems: 'center', padding: '10px 14px', borderRadius: 14, background: lv > 1 ? T[L.tone].bg : C.panel, boxShadow: lv > 1 ? `inset 0 0 0 2px ${STRONG[L.tone]}` : 'none' }}>
                <span style={{ fontFamily: mono, fontSize: 19, fontWeight: 700, color: C.ink }}>{s.id}</span>
                <span style={{ fontSize: 17, lineHeight: 1.3, color: C.soft }}>
                  {s.desc}
                  {lv === 3 && s.res ? <strong style={{ color: T.violet.fg }}> + {s.res}</strong> : null}
                </span>
                <Tag tone={L.tone} size={16}>
                  {L.t}
                </Tag>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 14, fontSize: 20, color: C.soft }}>
          Contexte occupé par les skills :
          <div style={{ flex: 1, height: 16, borderRadius: 8, background: C.panel, overflow: 'hidden' }}>
            <div style={{ width: `${(tok / 7.5) * 100}%`, height: '100%', background: G.violet, transition: `width 450ms ${EASE}` }} />
          </div>
          <strong style={{ fontFamily: mono, color: C.ink }}>~{fr(tok, 1)} k tokens</strong>
        </div>
        <div style={{ marginTop: 6, fontSize: 16, color: C.faint }}>Ordres de grandeur illustratifs.</div>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 870, top: 830, width: 930, ...dl(400) }}>
        <Callout tone="yellow" icon="bulb" title="La description fait tout" size={20}>
          Sans les bons mots dans la description, la skill ne se charge jamais. Elle s’appelle aussi à la main : tapez / dans le chat.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Quel fichier pour quel besoin ? ────────────────────────────────────────
const FILES9 = [
  { name: 'copilot-instructions.md', path: '.github/', icon: 'note' as IconName, tone: 'navy' as Tone, when: 'Chargé à chaque demande', what: 'Les règles d’équipe : langage, style, interdits.' },
  { name: '*.prompt.md', path: '.github/prompts/', icon: 'bolt' as IconName, tone: 'green' as Tone, when: 'Lancé par vous : /nom', what: 'Une tâche répétée, toujours décrite pareil.' },
  { name: '*.agent.md', path: '.github/agents/', icon: 'bot' as IconName, tone: 'blue' as Tone, when: 'Choisi dans la liste, ou délégué', what: 'Un rôle : consignes, outils, relais.' },
  { name: 'SKILL.md', path: '.github/skills/<nom>/', icon: 'book' as IconName, tone: 'violet' as Tone, when: 'Chargé si la demande correspond', what: 'Un savoir-faire, avec ses fichiers.' },
];
const SIT9 = [
  { q: '« Toujours node:test, jamais new Date() dans la logique. »', a: 0 },
  { q: '« Générer la note de version à chaque fin de sprint. »', a: 1 },
  { q: '« Un relecteur qui ne modifie jamais de fichier. »', a: 2 },
  { q: '« Notre procédure de tests, avec un fichier modèle. »', a: 3 },
];

const M9_QuelFichier: Page = () => {
  const [ref, beats] = useBeats();
  const [pick, setPick] = useState<number | null>(null);
  useEffect(() => setPick(null), [beats]);
  const si = pick ?? (beats >= 1 ? Math.min(beats - 1, 3) : null);
  const ans = si === null ? null : SIT9[si].a;
  return (
    <Frame mod={11} kind="exercice" beats={4}>
      <Title>Instructions, prompt, agent ou skill : quel fichier ?</Title>
      <Lede>Quatre fichiers Markdown, quatre usages. Pour chaque besoin, votez à voix haute, puis je clique la réponse.</Lede>
      <div ref={ref} className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
        {SIT9.map((s, i) => (
          <Btn key={s.q} size={20} tone="navy" ghost={si !== i} onClick={() => setPick(i)} style={{ justifyContent: 'flex-start', whiteSpace: 'normal', textAlign: 'left' }}>
            {i + 1}. {s.q}
          </Btn>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 120, top: 430, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 24 }}>
        {FILES9.map((f, i) => {
          const on = ans === i;
          const off = ans !== null && !on;
          return (
            <div key={f.name} className={cx(A.in, k('agn'))} style={{ ...dl(150 + i * 100), height: 420, boxSizing: 'border-box', background: C.card, borderRadius: 22, padding: '24px 24px', boxShadow: on ? `0 0 0 5px ${STRONG[f.tone]}, 0 24px 50px -24px rgba(11,31,92,.6)` : `${SHADOW}, inset 0 7px 0 ${STRONG[f.tone]}`, transform: on ? 'translateY(-10px)' : 'none', opacity: off ? 0.4 : 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <IconTile name={f.icon} tone={f.tone} size={60} solid={on} />
              <div style={{ fontFamily: mono, fontSize: 22, fontWeight: 700, color: C.ink }}>{f.name}</div>
              <div style={{ fontFamily: mono, fontSize: 17, color: C.muted }}>{f.path}</div>
              <div style={{ fontSize: 21, lineHeight: 1.4, color: C.soft }}>{f.what}</div>
              <div style={{ marginTop: 'auto' }}>
                <Tag tone={f.tone} size={17}>
                  {f.when}
                </Tag>
              </div>
              {on ? (
                <div className={k('swap')} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 21, fontWeight: 700, color: T.green.fg }}>
                  <Icon name="checkCircle" size={26} sw={2.4} color={C.green} /> Réponse {(si ?? 0) + 1}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 890, width: 1680, fontSize: 21, color: C.muted, ...dl(700) }}>
        Ils se combinent : l’agent Testeur QA suit les instructions d’équipe et charge la skill tests-node.
      </div>
    </Frame>
  );
};

// ─── Orchestration : la simulation ──────────────────────────────────────────
type NodeId = 'H' | 'HUB' | 'PO' | 'DS' | 'DEV' | 'QA' | 'SEC' | 'REV';
const NODES9: Record<NodeId, { x: number; y: number; label: string; icon: IconName; tone: Tone }> = {
  H: { x: 215, y: 655, label: 'Vous', icon: 'humanCheck', tone: 'green' },
  HUB: { x: 700, y: 655, label: 'Chef d’orchestre', icon: 'route', tone: 'navy' },
  PO: { x: 450, y: 420, label: 'Analyste PO', icon: 'target', tone: 'blue' },
  DS: { x: 745, y: 390, label: 'Designer UX', icon: 'palette', tone: 'pink' },
  DEV: { x: 1040, y: 430, label: 'Développeur', icon: 'code', tone: 'violet' },
  QA: { x: 1110, y: 690, label: 'Testeur QA', icon: 'flask', tone: 'teal' },
  SEC: { x: 905, y: 900, label: 'Sécurité', icon: 'shield', tone: 'coral' },
  REV: { x: 495, y: 900, label: 'Reviewer', icon: 'eye', tone: 'yellow' },
};
type Move = [NodeId, NodeId, string];
type SStep = { m: Move[]; log: string; bad?: boolean; gate?: boolean; cost: number };
const SCEN9: { label: string; kind: string; steps: SStep[] }[] = [
  {
    label: 'Nouvelle fonctionnalité',
    kind: 'Relais séquentiel',
    steps: [
      { m: [['H', 'PO', 'brief']], log: 'Vous : « les tickets en retard, les plus en retard d’abord »', cost: 1 },
      { m: [['PO', 'H', 'story']], log: 'Analyste PO : user story + 6 critères → vous validez', gate: true, cost: 2 },
      { m: [['PO', 'DS', 'story validée']], log: 'Designer UX : maquette du badge « En retard »', cost: 2 },
      { m: [['DS', 'DEV', 'maquette']], log: 'Développeur : echeances.js + badge, tests d’acceptation verts', cost: 4 },
      { m: [['DEV', 'QA', 'code']], log: 'Testeur QA : 5 cas limites ajoutés', cost: 3 },
      { m: [['QA', 'DEV', '✗ 29 février']], log: 'Testeur QA : 1 échec (année bissextile) → retour au Développeur', bad: true, cost: 1 },
      { m: [['DEV', 'QA', 'correctif']], log: 'Développeur : correctif ; tous les tests passent', cost: 2 },
      { m: [['QA', 'SEC', 'tests ✓']], log: 'Sécurité : aucun secret, aucune dépendance ajoutée', cost: 2 },
      { m: [['SEC', 'REV', 'feu vert']], log: 'Reviewer : 2 remarques de lisibilité, appliquées', cost: 2 },
      { m: [['REV', 'H', 'PR prête']], log: 'Vous : relecture du diff et fusion de la PR', gate: true, cost: 0 },
    ],
  },
  {
    label: 'Revue en parallèle',
    kind: 'Éventail puis synthèse',
    steps: [
      { m: [['H', 'HUB', 'PR #42']], log: 'Vous : « fais relire la PR #42 »', cost: 1 },
      { m: [['HUB', 'QA', 'diff'], ['HUB', 'SEC', 'diff'], ['HUB', 'REV', 'diff']], log: 'Chef d’orchestre : 3 sous-agents lancés en même temps', cost: 2 },
      { m: [['QA', 'HUB', '2 tests manquants'], ['SEC', 'HUB', '1 faille'], ['REV', 'HUB', '4 remarques']], log: 'Chacun rend son rapport, dans un contexte séparé', cost: 6 },
      { m: [['HUB', 'H', 'synthèse']], log: 'Synthèse : 1 bloquant (faille), 2 tests à ajouter → vous décidez', gate: true, cost: 1 },
    ],
  },
  {
    label: 'Bug en production',
    kind: 'Boucle courte',
    steps: [
      { m: [['H', 'QA', 'ticket #87']], log: 'Vous : « l’export CSV casse les titres avec ; »', cost: 1 },
      { m: [['QA', 'DEV', 'test ✗']], log: 'Testeur QA : un test qui reproduit le bug (rouge)', cost: 2 },
      { m: [['DEV', 'QA', 'correctif']], log: 'Développeur : correctif minimal', cost: 2 },
      { m: [['QA', 'REV', 'test ✓']], log: 'Testeur QA : le test passe, rien d’autre ne casse', cost: 1 },
      { m: [['REV', 'H', 'PR 6 lignes']], log: 'Vous : relecture rapide et fusion', gate: true, cost: 0 },
    ],
  },
  {
    label: 'Garde-fou sécurité',
    kind: 'Blocage et arbitrage',
    steps: [
      { m: [['H', 'DEV', 'brief']], log: 'Vous : « branche TaskFlow sur l’API tickets de l’entreprise »', cost: 1 },
      { m: [['DEV', 'SEC', 'code']], log: 'Développeur : client HTTP écrit', cost: 3 },
      { m: [['SEC', 'DEV', '✗ jeton en clair']], log: 'Sécurité : BLOQUÉ, jeton dans le code et dans l’URL', bad: true, cost: 1 },
      { m: [['DEV', 'SEC', 'variable d’env.']], log: 'Développeur : jeton lu depuis l’environnement, en-tête Authorization', cost: 2 },
      { m: [['SEC', 'H', 'question']], log: 'Sécurité : « quel coffre-fort pour la production ? » → décision humaine', gate: true, cost: 1 },
    ],
  },
];

const AgNode = ({ id, state }: { id: NodeId; state: 'idle' | 'on' | 'done' | 'bad' }) => {
  const n = NODES9[id];
  const on = state === 'on' || state === 'bad';
  const ring = state === 'bad' ? C.coral : STRONG[n.tone];
  const hub = id === 'HUB';
  return (
    <div
      className={k('agn')}
      style={{
        position: 'absolute',
        left: n.x - 110,
        top: n.y - 42,
        width: 220,
        height: 84,
        boxSizing: 'border-box',
        borderRadius: 18,
        background: hub ? G.navy : on ? T[n.tone].bg : C.card,
        color: hub ? '#fff' : C.ink,
        boxShadow: on ? `0 0 0 4px ${ring}, 0 0 0 14px ${T[n.tone].bg}` : SHADOW,
        transform: on ? 'scale(1.07)' : 'none',
        opacity: state === 'idle' ? 0.72 : 1,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 14px',
        zIndex: 2,
      }}
    >
      <IconTile name={n.icon} tone={n.tone} size={50} solid={on || hub} />
      <span style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.15 }}>{n.label}</span>
      {state === 'done' ? (
        <span style={{ position: 'absolute', right: -8, top: -8, width: 28, height: 28, borderRadius: 99, background: C.green, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={18} sw={3} />
        </span>
      ) : null}
    </div>
  );
};

const M9_Orchestration: Page = () => {
  const [ref, beats] = useBeats();
  const [sc, setSc] = useState(0);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const scen = SCEN9[sc];
  const N = scen.steps.length;
  useEffect(() => {
    if (beats > 3) return;
    setSc(Math.max(0, Math.min(beats, 3)));
    setStep(0);
    setPlaying(true);
  }, [beats]);
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setStep((s) => Math.min(N, s + 1)), 1700);
    return () => window.clearInterval(id);
  }, [playing, N, sc]);
  useEffect(() => {
    if (step >= N) setPlaying(false);
  }, [step, N]);
  const cur = step > 0 ? scen.steps[step - 1] : null;
  const done = new Set<NodeId>();
  scen.steps.slice(0, Math.max(0, step - 1)).forEach((s) => s.m.forEach(([, to]) => done.add(to)));
  const active = new Set<NodeId>();
  cur?.m.forEach(([, to]) => active.add(to));
  const used = new Set<NodeId>();
  scen.steps.slice(0, step).forEach((s) => s.m.forEach(([a, z]) => [a, z].forEach((x) => x !== 'H' && used.add(x))));
  const gates = scen.steps.slice(0, step).filter((s) => s.gate).length;
  const cost = scen.steps.slice(0, step).reduce((a, s) => a + s.cost, 0);
  const choose = (i: number) => {
    setSc(i);
    setStep(0);
    setPlaying(true);
  };
  return (
    <Frame mod={11} kind="demo" beats={3}>
      <Title>Simulation : une équipe d’agents orchestrée</Title>
      <Lede>Chaque agent a son rôle, ses outils et son propre contexte. Choisissez un scénario et regardez circuler le travail.</Lede>
      <div ref={ref} className={A.in} style={{ position: 'absolute', left: 120, top: 262 }}>
        <MTabs items={SCEN9.map((s) => s.label)} cur={sc} set={choose} size={19} />
      </div>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
        {(Object.keys(NODES9) as NodeId[])
          .filter((id) => id !== 'HUB')
          .map((id) => (
            <line key={id} x1={NODES9.HUB.x} y1={NODES9.HUB.y} x2={NODES9[id].x} y2={NODES9[id].y} stroke={C.rule} strokeWidth={3} strokeDasharray="4 10" />
          ))}
        {cur?.m.map(([a, z], i) => (
          <line key={`${sc}-${step}-${i}`} className={k('edge')} x1={NODES9[a].x} y1={NODES9[a].y} x2={NODES9[z].x} y2={NODES9[z].y} stroke={cur.bad ? C.coral : C.electric} strokeWidth={5} strokeLinecap="round" />
        ))}
      </svg>
      {(Object.keys(NODES9) as NodeId[]).map((id) => (
        <AgNode key={id} id={id} state={active.has(id) ? (cur?.bad ? 'bad' : 'on') : done.has(id) ? 'done' : 'idle'} />
      ))}
      {cur?.m.map(([a, z, art], i) => (
        <div
          key={`p-${sc}-${step}-${i}`}
          className={k('pkt')}
          style={{ ['--x0' as string]: `${NODES9[a].x}px`, ['--y0' as string]: `${NODES9[a].y}px`, ['--x1' as string]: `${NODES9[z].x}px`, ['--y1' as string]: `${NODES9[z].y - 62}px`, ...dl(i * 120), zIndex: 3, padding: '6px 14px', borderRadius: 99, background: cur.bad ? C.coral : C.electric, color: '#fff', fontSize: 18, fontWeight: 700, whiteSpace: 'nowrap', boxShadow: '0 10px 24px -10px rgba(11,31,92,.8)' } as CSSProperties}
        >
          {art}
        </div>
      ))}
      <div className={A.right} style={{ position: 'absolute', left: 1320, top: 262, width: 480, height: 700, boxSizing: 'border-box', background: '#0F1730', borderRadius: 20, boxShadow: SHADOW, padding: '18px 20px', display: 'flex', flexDirection: 'column', ...dl(200) }}>
        <div style={{ fontSize: 17, letterSpacing: '.1em', textTransform: 'uppercase', color: '#9AA6C8' }}>{scen.kind}</div>
        <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
          {(
            [
              ['étapes', `${step} / ${N}`],
              ['agents mobilisés', `${used.size}`],
              ['validations humaines', `${gates}`],
              ['crédits (illustratif)', `≈ ${cost * 6}`],
            ] as [string, string][]
          ).map(([l, v]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,.06)', borderRadius: 10, padding: '8px 12px' }}>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: '#fff' }}>{v}</div>
              <div style={{ fontSize: 15, color: '#9AA6C8' }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, flex: 1, display: 'flex', flexDirection: 'column', gap: 6, overflow: 'hidden' }}>
          {scen.steps.slice(Math.max(0, step - 6), step).map((s, i, arr) => {
            const last = i === arr.length - 1;
            return (
              <div key={`${sc}-${step - arr.length + i}`} className={k('swap')} style={{ display: 'grid', gridTemplateColumns: '26px minmax(0, 1fr)', gap: 8, padding: '6px 8px', borderRadius: 8, background: last ? 'rgba(255,255,255,.08)' : 'transparent' }}>
                <Icon name={s.bad ? 'alert' : s.gate ? 'humanCheck' : 'send'} size={20} color={s.bad ? C.coral : s.gate ? '#3DDC97' : '#82AAFF'} sw={2.2} />
                <span style={{ fontSize: 17, lineHeight: 1.3, color: last ? '#fff' : '#C9D2EA' }}>{s.log}</span>
              </div>
            );
          })}
          {step === 0 ? <div style={{ fontSize: 18, color: '#7C86A8' }}>Appuyez sur Lecture…</div> : null}
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1320, top: 980, display: 'flex', gap: 10, ...dl(300) }}>
        <Btn icon={playing ? 'pause' : 'play'} size={19} onClick={() => (step >= N ? choose(sc) : setPlaying((p) => !p))}>
          {playing ? 'Pause' : 'Lecture'}
        </Btn>
        <Btn
          icon="arrow"
          size={19}
          ghost
          onClick={() => {
            setPlaying(false);
            setStep((s) => Math.min(N, s + 1));
          }}
        >
          Pas
        </Btn>
        <Btn
          icon="reset"
          size={19}
          ghost
          tone="grey"
          onClick={() => {
            setPlaying(false);
            setStep(0);
          }}
        />
      </div>
    </Frame>
  );
};

// ─── Le potentiel ───────────────────────────────────────────────────────────
const GANTT_SOLO: [string, number, number, Tone][] = [
  ['Spécifier', 0, 2, 'blue'],
  ['Maquetter', 2, 4, 'pink'],
  ['Coder', 4, 9, 'violet'],
  ['Tester', 9, 12, 'teal'],
  ['Sécurité', 12, 13.5, 'coral'],
  ['Relire', 13.5, 15, 'yellow'],
];
const GANTT_TEAM: [string, number, number, Tone][] = [
  ['Spécifier', 0, 1, 'blue'],
  ['Maquetter', 1, 2.5, 'pink'],
  ['Coder', 1, 5, 'violet'],
  ['Tester', 2.5, 6, 'teal'],
  ['Sécurité', 5, 6.5, 'coral'],
  ['Relire', 5, 6.5, 'yellow'],
];
const GX9 = (u: number) => (u / 15) * 1180;

const M9Gantt = ({ rows, beat, top, gates }: { rows: [string, number, number, Tone][]; beat: number; top: number; gates: number[] }) => (
  <div style={{ position: 'absolute', left: 300, top, width: 1180, height: rows.length * 34 }}>
    {rows.map(([t, a, z, tone], i) => (
      <div key={t} className={beat ? b.grow(beat) : A.grow} style={{ position: 'absolute', left: GX9(a), top: i * 34, width: GX9(z - a), height: 26, borderRadius: 8, background: STRONG[tone], transformOrigin: 'left center', display: 'flex', alignItems: 'center', paddingLeft: 10, boxSizing: 'border-box', color: '#fff', fontSize: 16, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', ...dl(i * 140) }}>
        {t}
      </div>
    ))}
    {gates.map((g) => (
      <div key={g} className={beat ? b.pop(beat) : A.pop} style={{ position: 'absolute', left: GX9(g) - 13, top: -34, width: 26, height: 26, transform: 'rotate(45deg)', background: C.green, borderRadius: 5, ...dl(900) }} />
    ))}
  </div>
);

const M9_Potentiel: Page = () => (
  <Frame mod={11} beats={2}>
    <Title>Le potentiel : spécialiser, paralléliser, se vérifier</Title>
    <Lede>Une équipe ne pense pas mieux qu’un seul modèle : elle découpe, parallélise et se contrôle. Durées illustratives.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 320, width: 170, fontSize: 21, fontWeight: 700, color: C.ink }}>
      Un agent seul
      <div style={{ fontSize: 17, fontWeight: 400, color: C.muted }}>tout dans un contexte</div>
    </div>
    <M9Gantt rows={GANTT_SOLO} beat={0} top={320} gates={[15]} />
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 560, width: 170, fontSize: 21, fontWeight: 700, color: C.ink }}>
      Une équipe orchestrée
      <div style={{ fontSize: 17, fontWeight: 400, color: C.muted }}>un contexte par rôle</div>
    </div>
    <M9Gantt rows={GANTT_TEAM} beat={1} top={560} gates={[1, 6.5]} />
    <div className={b.fade(1)} style={{ position: 'absolute', left: 1500, top: 560, width: 300, fontSize: 19, color: C.soft, lineHeight: 1.4 }}>
      <span style={{ display: 'inline-block', width: 16, height: 16, background: C.green, transform: 'rotate(45deg)', borderRadius: 3, marginRight: 10 }} />
      vos validations : la story, puis la PR
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 800, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 22 }}>
      <Card tone="blue" icon="target" title="Spécialisation" size={19} pad={18}>
        Un contexte court et propre par rôle : moins de bruit, de meilleures réponses.
      </Card>
      <Card tone="violet" icon="layers" title="Parallélisme" size={19} pad={18}>
        Tests, sécurité et relecture en même temps, sur le même diff.
      </Card>
      <Card tone="teal" icon="shieldCheck" title="Contrôle croisé" size={19} pad={18}>
        Le Testeur ne fait pas confiance au Développeur : il le prouve.
      </Card>
      <Card tone="green" icon="note" title="Traçabilité" size={19} pad={18}>
        Chaque relais laisse un artefact relisible : story, tests, rapport.
      </Card>
    </div>
  </Frame>
);

// ─── Points d’attention ─────────────────────────────────────────────────────
const RISK9: { icon: IconName; t: string; f: string; p: string }[] = [
  { icon: 'euro', t: 'La facture', f: 'Chaque agent et chaque aller-retour consomment des crédits IA.', p: 'Un brief précis, 2 allers-retours maximum, des modèles légers pour les rôles simples.' },
  { icon: 'route', t: 'L’erreur en cascade', f: 'Une story fausse au départ : tout le reste est faux, avec aplomb.', p: 'Vous validez la story avant le premier relais. Toujours.' },
  { icon: 'users', t: 'La complaisance', f: 'Même modèle, mêmes angles morts : des tests qui valident le bug.', p: 'Les tests d’acceptation, c’est vous qui les écrivez ou les relisez.' },
  { icon: 'key', t: 'Trop de pouvoir', f: 'Terminal + Internet + secrets : une page piégée peut dicter une commande.', p: 'Outils minimaux par agent, approbation des commandes, bac à sable.' },
  { icon: 'puzzle', t: 'Les agents et skills de tiers', f: 'Une skill peut contenir des scripts : c’est du code exécuté chez vous.', p: 'Relire avant d’installer, source de confiance, versionner dans le dépôt.' },
  { icon: 'eyeOff', t: 'L’humain hors boucle', f: 'Une PR de 2 000 lignes produite en 10 minutes ne sera jamais vraiment relue.', p: 'Petits lots, relecture du diff, et le « c’est fini » reste à vous.' },
];

const M9_Attention: Page = () => (
  <Frame mod={11} beats={6}>
    <Title>Plus d’autonomie, plus de garde-fous</Title>
    <Lede>Six points d’attention propres à l’orchestration, et leurs parades. Les cartes se retournent au clic.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 26 }}>
      {RISK9.map((r, i) => (
        <FlipCard
          key={r.t}
          w={542}
          h={318}
          flipAt={i + 1}
          tone="coral"
          backTone="green"
          cls={A.in}
          style={dl(i * 90)}
          front={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <IconTile name={r.icon} tone="coral" size={54} />
                <span style={{ fontSize: 27, fontWeight: 800, color: C.ink }}>{r.t}</span>
              </div>
              <div style={{ fontSize: 22, lineHeight: 1.42, color: C.soft }}>{r.f}</div>
            </div>
          }
          back={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 24, fontWeight: 800, color: T.green.fg }}>
                <Icon name="shieldCheck" size={28} sw={2.4} /> Parade
              </div>
              <div style={{ fontSize: 22, lineHeight: 1.42, color: C.ink }}>{r.p}</div>
            </div>
          }
        />
      ))}
    </div>
  </Frame>
);

// ─── Atelier 9 ──────────────────────────────────────────────────────────────
const M9_Lab: Page = () => (
  <LabPage
    mod={11}
    n="9"
    title="Votre équipe d’agents livre une fonctionnalité"
    defi="agents"
    who="Individuel · 30 min"
    objective={
      <>
        Créer <strong>3 agents</strong> (Analyste PO, Développeur, Testeur QA) et <strong>2 skills</strong> (conventions, tests), puis leur faire livrer les <strong>tickets en retard</strong> sans écrire le code vous-même.
      </>
    }
    where={
      <>
        <PathChip size={19}>ateliers/atelier-09-agents/</PathChip>
        <br />
        <PathChip size={19}>.github/agents/</PathChip> · <PathChip size={19}>.github/skills/</PathChip>
      </>
    }
    minutes={30}
    crit={
      <>
        <CheckItem id="l9a" size={21}>3 agents et 2 skills, sans TODO, outils minimaux</CheckItem>
        <CheckItem id="l9b" size={21}>test:atelier9 et npm test au vert</CheckItem>
        <CheckItem id="l9c" size={21}>Tests QA ajoutés, relais notés dans JOURNAL.md</CheckItem>
      </>
    }
    bonus={
      <Callout tone="pink" icon="sparkles" title="Bonus" size={19}>
        Même équipe pour l’export CSV, puis un Chef d’orchestre qui délègue aux trois.
      </Callout>
    }
    suivi="Points d’étape à 12 min (agents listés ?) et 24 min (tests verts ?). Ne jamais laisser un agent modifier test/echeances.test.js."
  >
    <WStep n={1}>Copier modeles/.github à la racine, compléter les TODO des 2 skills puis des 3 agents.</WStep>
    <WStep n={2}>Analyste PO : le brief, puis vous validez la story avant le relais.</WStep>
    <WStep n={3}>Développeur, puis Testeur QA : approuvez chaque commande, faites relire chaque relais.</WStep>
  </LabPage>
);

// ═══ 90-close ══════════════════════════════════════════════════════════

// ─── Clôture ────────────────────────────────────────────────────────────────

const CKey = ({ n, tone, title, children, d }: { n: number; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 22px', ...dl(d) }}>
    <Num n={n} tone={tone} size={42} />
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{title}</div>
      <div style={{ fontSize: 21, color: C.soft, lineHeight: 1.35, marginTop: 4 }}>{children}</div>
    </div>
  </div>
);

const C_Cles: Page = () => (
  <Frame mod={9} kind="synthese">
    <Title>Les 10 clés à emporter</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20 }}>
      <CKey n={1} tone="blue" title="Copilot prédit, il ne vérifie pas" d={100}>
        Plausible n’est pas correct : la preuve, ce sont vos tests.
      </CKey>
      <CKey n={2} tone="navy" title="Un poste réglé, des gestes au clavier" d={150}>
        Tab, Échap, Ctrl+→, Alt+], Ctrl+I, Ctrl+Alt+I.
      </CKey>
      <CKey n={3} tone="teal" title="Le contexte fait la suggestion" d={200}>
        Onglets utiles ouverts, références explicites, conversation propre.
      </CKey>
      <CKey n={4} tone="green" title="Le commentaire est un prompt" d={250}>
        Entrée, sortie, règle, exemple, contrainte.
      </CKey>
      <CKey n={5} tone="blue" title="La signature d’abord" d={300}>
        Contrat, corps, test : une fonction à la fois.
      </CKey>
      <CKey n={6} tone="coral" title="Les six oublis" d={350}>
        Vide, null, mutation, égalités, bornes, entrée invalide.
      </CKey>
      <CKey n={7} tone="violet" title="Refactoring ≠ correction" d={400}>
        Même comportement, tests verts, deux commits.
      </CKey>
      <CKey n={8} tone="pink" title="Un test doit pouvoir échouer" d={450}>
        Liste des cas d’abord, mutation pour prouver le filet.
      </CKey>
      <CKey n={9} tone="yellow" title="La checklist avant Tab" d={500}>
        Logique, performances, sécurité, licence.
      </CKey>
      <CKey n={10} tone="green" title="Les règles dans le dépôt" d={550}>
        copilot-instructions.md : l’équipe et Copilot partagent les conventions.
      </CKey>
    </div>
  </Frame>
);

const C_AutoPos: Page = () => (
  <Frame mod={9} kind="exercice">
    <Title>Auto-positionnement final : mesurez le chemin parcouru</Title>
    <Lede>Les mêmes huit compétences qu’hier matin. Comptez pour vous, puis comparez avec votre score de départ.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1150, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CheckItem id="af1" size={26}>Expliquer ce qu’est un LLM et pourquoi Copilot peut se tromper</CheckItem>
        <CheckItem id="af2" size={26}>Installer Copilot dans VS Code et vérifier ma licence</CheckItem>
        <CheckItem id="af3" size={26}>Accepter, refuser ou parcourir les suggestions au clavier</CheckItem>
        <CheckItem id="af4" size={26}>Choisir entre suggestion inline, chat en ligne et vue Chat</CheckItem>
        <CheckItem id="af5" size={26}>Écrire un commentaire qui guide une génération précise</CheckItem>
        <CheckItem id="af6" size={26}>Refactorer un code sans changer son comportement</CheckItem>
        <CheckItem id="af7" size={26}>Faire générer des tests et vérifier leurs assertions</CheckItem>
        <CheckItem id="af8" size={26}>Relire du code généré : logique, performance, sécurité, licence</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 262, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau aujourd’hui"
          levels={[
            { min: 0, text: 'Les bases sont posées : pratiquez avec le guide.', tone: 'grey' },
            { min: 4, text: 'Autonome : gardez la checklist à côté.', tone: 'blue' },
            { min: 7, text: 'Prêt à l’enseigner à votre équipe !', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>Au micro : de combien de points avez-vous progressé ?</div>
      </div>
    </Checklist>
  </Frame>
);

const CHorizon = ({ icon, tone, when, title, children, d }: { icon: IconName; tone: Tone; when: string; title: string; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={54} solid />
      <div>
        <Eyebrow c={T[tone].fg} size={18}>
          {when}
        </Eyebrow>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.ink }}>{title}</div>
      </div>
    </div>
    <div style={{ marginTop: 14, fontSize: 22, color: C.soft, lineHeight: 1.45 }}>{children}</div>
  </div>
);

const C_Plan: Page = () => (
  <Frame mod={9}>
    <Title>Votre plan d’action : 30 jours pour en faire un réflexe</Title>
    <Lede>Écrivez-le dans votre JOURNAL.md, avec une date pour chaque ligne.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <CHorizon icon="rocket" tone="blue" when="Lundi" title="Le poste et les gestes" d={100}>
        Vos réglages dans le projet, les 8 gestes au clavier, et une première tâche répétitive confiée à Copilot.
      </CHorizon>
      <CHorizon icon="flask" tone="green" when="Semaine 2" title="Des tests sur l’existant" d={220}>
        Une fonction importante de votre projet, sa liste de cas, ses tests générés… et une mutation pour les vérifier.
      </CHorizon>
      <CHorizon icon="users" tone="violet" when="Fin du mois" title="Les règles de l’équipe" d={340}>
        Un copilot-instructions.md proposé à l’équipe, et la checklist de relecture partagée en revue de code.
      </CHorizon>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 720, width: 1680 }}>
      <Callout tone="yellow" icon="bulb" title="Le bon indicateur" size={24} cls={A.in} style={dl(600)}>
        Pas « combien de lignes Copilot a écrites », mais « combien de suggestions j’ai refusées à bon escient, et combien de tests protègent mon code ».
      </Callout>
    </div>
  </Frame>
);

const CRes = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <Row2 icon={icon} tone={tone} title={title} d={d}>
    {children}
  </Row2>
);

const C_Ressources: Page = () => (
  <Frame mod={9}>
    <Title>Ressources pour continuer</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1000, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <CRes icon="archive" tone="green" title="Votre kit d’ateliers" d={100}>
        Bouton « Labs » de ce support : dépôt TaskFlow, guide PDF des 8 ateliers, points de reprise.
      </CRes>
      <CRes icon="book" tone="blue" title="Documentation VS Code" d={180}>
        code.visualstudio.com/docs/copilot · aide-mémoire des fonctionnalités et raccourcis
      </CRes>
      <CRes icon="doc" tone="navy" title="Documentation GitHub Copilot" d={260}>
        docs.github.com/copilot · offres, réglages, confidentialité
      </CRes>
      <CRes icon="bolt" tone="coral" title="Le journal des nouveautés" d={340}>
        github.blog/changelog, étiquette « copilot » : les nouveautés chaque semaine
      </CRes>
      <CRes icon="shield" tone="violet" title="Sécurité du code" d={420}>
        OWASP Top 10 · owasp.org : les failles à connaître, avec des exemples
      </CRes>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1200, top: 210, width: 600, ...dl(300) }}>
      <Card icon="git" tone="teal" title="Pour aller plus loin" size={22} pad={26}>
        Le niveau suivant : prompts structurés, modes Plan et Agent, tests d’intégration, audit de sécurité et intégration CI.
        <div style={{ marginTop: 14, fontSize: 21, color: C.muted }}>Formation Docaposte Institute « GitHub Copilot · Niveau avancé ».</div>
      </Card>
    </div>
  </Frame>
);

const C_Eval: Page = () => (
  <Frame mod={9} kind="exercice">
    <Title>Votre avis compte : évaluation de la formation</Title>
    <Lede>Le questionnaire de satisfaction arrive dans le clavardage. Cinq minutes, maintenant, pendant que tout est frais.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <CKey n={1} tone="blue" title="Questionnaire « à chaud »" d={100}>
        Contenu, rythme, ateliers, animation : soyez francs, c’est ce qui améliore la formation.
      </CKey>
      <CKey n={2} tone="violet" title="Questionnaire « à froid »" d={200}>
        Dans quelques semaines : ce que vous avez réellement mis en pratique.
      </CKey>
      <CKey n={3} tone="green" title="Le mot de la fin, au micro" d={300}>
        Une phrase chacun : ce que vous ferez différemment lundi.
      </CKey>
    </div>
    <Timer id="evaluation" minutes={5} label="Questionnaire" cls={A.right} style={{ position: 'absolute', left: 1240, top: 280, width: 560, ...dl(300) }} />
  </Frame>
);

const C_Merci: Page = () => (
  <Frame mod={9} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={170} r={46} cls={A.fade} />
    <div style={{ position: 'absolute', left: 390, top: 200, width: 1400 }}>
      <h1 className={A.in} style={{ margin: 0, fontFamily: display, fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: '-0.02em', color: C.navy }}>
        Merci !
      </h1>
      <p className={A.in} style={{ margin: '34px 0 0', fontSize: 34, lineHeight: 1.45, color: C.soft, maxWidth: 1100, ...dl(200) }}>
        Copilot propose, <strong style={{ color: C.navy }}>vous disposez</strong>… et vous prouvez. Bon code à toutes et à tous !
      </p>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 1360, top: 560, ...dl(700) }}>
      <div style={{ transform: 'rotate(-7deg)', fontFamily: '"Mr Dafoe", "Segoe Script", cursive', fontSize: 78, color: C.electric, lineHeight: 1 }}>Together we grow</div>
    </div>
    <Portrait w={170} x={390} y={640} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 664, ...dl(300) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>Docaposte Institute · IA appliquée au développement</div>
    </div>
    <div className={A.pop} style={{ position: 'absolute', left: 1500, top: 790, ...dl(600) }}>
      <DapLogo size={40} />
    </div>
    <Footer left={390} />
  </Frame>
);
C_Merci.transition = BLOOM;

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
  title: "GitHub Copilot · Débutant — Docaposte Institute (2 jours)",
  createdAt: '2026-11-04T21:19:21.076Z',
  theme: 'docaposte-institute',
  labs: labsPack,
};

export default [
  O_Cover,
  O_Formateur,
  O_Virtuel,
  O_Poll,
  O_Objectifs,
  O_Programme,
  O_AutoPos,
  O_FilRouge,
  O_Kit,
  O_Depot,
  O_Setup,
  M1_Divider,
  M1_IAHistoire,
  M1_Histoire,
  M1_IAMLDL,
  M1_Neurones,
  M1_Entrainement,
  M1_Tokens,
  M1_Transformer,
  M1_Generation,
  M1_Hallucinations,
  M1_Fonctionnement,
  M1_Agent,
  M1_Engineering,
  M1_Modeles,
  M1_Ecosysteme,
  M1_Offres,
  M1_Nouveautes,
  M1_VraiFaux,
  M1_AvantagesLimites,
  M1_Demo,
  M1_Lab,
  M1_Qcm,
  M1_Pause,
  M2_Divider,
  M2_Installer,
  M2_Licence,
  M2_Parametres,
  M2_Confidentialite,
  M2_Raccourcis,
  M2_Navigation,
  M2_PanneauChat,
  M2_Agents,
  M2_Lab,
  M2_Qcm,
  M3_Divider,
  M3_Contexte,
  M3_Fenetre,
  M3_InlineVsChat,
  M3_Dejeuner,
  M3_ChoisirOutil,
  M3_Simulateur,
  M3_Lire,
  M3_Lab,
  M3_Qcm,
  M4_Divider,
  M4_Structures,
  M4_NomFonction,
  M4_Commentaire,
  M4_Langages,
  M4_Patterns,
  M4_Comportements,
  M4_Pause,
  M4_Lab,
  M4_Qcm,
  M4_Bilan,
  M4_Sortie,
  J2_Cover,
  J2_Quiz,
  J2_Programme,
  M5_Divider,
  M5_Fonction,
  M5_Oublis,
  M5_Classe,
  M5_Fichier,
  M5_HTTP,
  M5_Parseurs,
  M5_Doc,
  M5_Lab,
  M5_Qcm,
  M5_Pause,
  M6_Divider,
  M6_Odeurs,
  M6_Formuler,
  M6_Gestes,
  M6_Chat,
  M6_Comparer,
  M6_Legacy,
  M6_Lab,
  M6_Qcm,
  M6_Dejeuner,
  M7_Divider,
  M7_Pourquoi,
  M7_AAA,
  M7_Generer,
  M7_Organiser,
  M7_Assertions,
  M7_Mutation,
  M7_Mocks,
  M7_Lab,
  M7_Qcm,
  M8_Divider,
  M8_Confiance,
  M8_Checklist,
  M8_Hallucinations,
  M8_Securite,
  M8_Droits,
  M8_Revue,
  M8_Instructions,
  M8_Pause,
  M8_Lab,
  M8_Restitution,
  M8_Qcm,
  M9_Divider,
  M9_Anatomie,
  M9_Creer,
  M9_Skills,
  M9_QuelFichier,
  M9_Orchestration,
  M9_Potentiel,
  M9_Attention,
  M9_Lab,
  C_Cles,
  C_AutoPos,
  C_Plan,
  C_Ressources,
  C_Eval,
  C_Merci,
] satisfies Page[];

// Speaker notes — one entry per page, same order as the default export.
export const notes: (string | undefined)[] = [
  `⏱ 2 min · COUVERTURE · J1 9:00

OBJECTIF — Accueillir chaque participant, vérifier le son et poser la promesse : partir de zéro, finir autonome et méfiant à bon escient.

DIRE — « Bonjour à toutes et à tous, bienvenue dans cette formation GitHub Copilot niveau débutant. Deux jours pour passer de “j’ai entendu parler de Copilot” à “je l’utilise tous les jours, et je sais vérifier ce qu’il me propose”. Avant tout : est-ce que tout le monde m’entend bien ? Dites-moi “oui” au micro ou d’un pouce dans le clavardage. »

ANIMATION — Laisser la page affichée pendant les connexions. Saluer chaque arrivant par son prénom.

TRANSITION — « Quelques mots sur moi. »`,
  `⏱ 2 min · FORMATEUR

OBJECTIF — Asseoir la légitimité en une minute, sans s’étendre.

DIRE — « Je suis développeur depuis dix-huit ans, en Java, Python et Web, chercheur en intelligence artificielle, et je forme des équipes à ces outils depuis huit ans. J’utilise Copilot tous les jours dans mon propre travail : ce que je vais vous montrer, ce sont des usages réels, avec leurs limites. »

TRANSITION — « Comme nous sommes en classe virtuelle, fixons quelques règles de confort. »`,
  `⏱ 2 min · CLASSE VIRTUELLE

OBJECTIF — Fixer les règles de la classe virtuelle : caméra, micro, écrans, ateliers individuels, données.

DIRE — « Caméra allumée si vous le pouvez, c’est plus convivial ; micro coupé quand vous ne parlez pas. L’idéal, deux écrans : la classe d’un côté, VS Code de l’autre. Tous les ateliers sont individuels, sur votre poste : je ne vois pas vos écrans, donc je ferai des points d’étape au micro toutes les quinze à vingt minutes. Si vous êtes bloqué, vous le dites, et vous partagez votre écran deux minutes. Et la règle d’or : aucune donnée réelle dans Copilot pendant la formation. »

ANIMATION — Coller dans le clavardage le lien du zip des ateliers.

TRANSITION — « Faisons connaissance. »`,
  `⏱ 6 min · TOUR DE TABLE (vote oral)

OBJECTIF — Connaître le niveau réel et les langages pour doser les démos et les variantes.

DIRE — « Premier vote, à voix haute : votre expérience de Copilot, de 1 à 4. » Cliquer une ligne par voix. « Deuxième vote : votre langage principal, 5, 6 ou 7. » Puis : « Tour de table express, une minute chacun, dans l’ordre de la liste : prénom, métier, langage, et la tâche de code que vous aimeriez déléguer dès lundi. »

ANIMATION — Noter les tâches citées : y revenir dans les modules 4 à 7. Beaucoup de Python ou de Java ? Annoncer les variantes de l’Atelier 4.

TRANSITION — « Voici ce que le programme vous promet. »`,
  `⏱ 2 min · OBJECTIFS

OBJECTIF — Présenter les six objectifs officiels et l’équilibre pratique.

DIRE — « Six objectifs, ceux du programme officiel : découvrir, installer et configurer, générer, refactorer, tester, et surtout vérifier. Le sixième est le plus important : Copilot écrit vite, mais c’est vous qui signez le code. Environ 60 % du temps, vous pratiquez : huit ateliers individuels sur un même projet, un QCM à la fin de chaque module. »

TRANSITION — « Le déroulé des deux jours. »`,
  `⏱ 2 min · PROGRAMME

OBJECTIF — Donner le déroulé horaire et le repère du bandeau.

DIRE — « Jour 1 : découverte et premières générations. On comprend comment Copilot fonctionne, on l’installe, on apprend à lire ses suggestions, et on génère le premier morceau de TaskFlow. Jour 2 : approfondissement. Des fonctions complètes et des classes, du refactoring, des tests, et pour finir une revue de code où vous chasserez huit défauts. Le bandeau en haut à droite vous dit toujours où nous en sommes. »

ANIMATION — Les horaires sont indicatifs : ajuster au rythme du groupe.

TRANSITION — « Mesurons votre point de départ. »`,
  `⏱ 4 min · AUTO-POSITIONNEMENT (exercice)

OBJECTIF — Mesurer le niveau de départ (exigence du dispositif d’évaluation).

DIRE — « Huit compétences, celles que nous allons travailler. Comptez pour vous, sur une feuille, celles que vous savez déjà faire sans aide. Pas de jugement : on refera exactement le même exercice à la fin du Jour 2, et c’est l’écart qui compte. »

ANIMATION — Cocher à l’écran les lignes d’un exemple fictif pour illustrer, puis tout décocher. Demander à chacun de noter son score dans son JOURNAL.md.

TRANSITION — « Parlons du projet sur lequel vous allez travailler. »`,
  `⏱ 3 min · FIL ROUGE TASKFLOW

OBJECTIF — Présenter TaskFlow et la chaîne des 8 ateliers.

DIRE — « TaskFlow est un petit outil de gestion de tickets : un backlog, un tableau Kanban, et quelques règles métier, par exemple pas plus de trois tickets en cours. Le métier est volontairement simple : tout votre cerveau reste disponible pour Copilot. Il est en JavaScript, parce que Node est léger et que vous n’aurez rien à installer, mais vous verrez aussi Python et Java. À droite, vos huit ateliers : chacun ajoute une brique au même dépôt. »

TRANSITION — « Ouvrons ce dépôt. »`,
  `⏱ 3 min · KIT D’ATELIERS

OBJECTIF — Faire télécharger et ouvrir le dépôt ; expliquer le principe des tests rouges.

DIRE — « Le dépôt est sur GitHub, je vous donne le lien à la page suivante ; il est aussi derrière le bouton Labs de ce support. Il contient le code de départ et un guide PDF des huit ateliers. Le code de TaskFlow est presque vide : il contient des commentaires-guides, et c’est Copilot qui va l’écrire avec vous. Les tests, eux, sont fournis. Quand vous lancerez npm test tout à l’heure, vous verrez du rouge partout : c’est normal, c’est votre feuille de route. »

TRANSITION — « Voici le lien du dépôt. »`,
  `⏱ 2 min · DÉPÔT GITHUB DES ATELIERS

OBJECTIF — Que chaque participant ait le dépôt sur son poste avant le check-up.

DIRE — « Le dépôt est public sur GitHub. Je colle le lien dans le clavardage. Ceux qui ont Git : git clone, la commande est juste là. Les autres : sur la page GitHub, bouton vert Code, puis Download ZIP. Le guide PDF est à la racine. Vous ne poussez rien sur ce dépôt : vous travaillez dans votre copie locale. »

ACTION — Cliquer « Copier le lien », le coller dans le clavardage Teams/Zoom : https://github.com/houssemeddinelassoued/taskflow-copilot. Cliquer « Ouvrir le dépôt » pour montrer la page en partage d'écran, puis « Copier la commande git clone » et la coller aussi.

ANIMATION — Point d'étape au micro : « Le dossier est ouvert dans VS Code chez tout le monde ? » Proxy ou Git bloqué : Download ZIP ou bouton Labs.

TRANSITION — « Cinq minutes pour vérifier vos postes. »`,
  `⏱ 5 min · CHECK-UP (minuteur 5 min)

OBJECTIF — Vérifier les prérequis techniques : VS Code, compte GitHub, Node, dépôt ouvert.

DIRE — « Cinq minutes. Chacun vérifie ces six points sur son poste. Copilot lui-même, on l’installe ensemble au Module 2. »

ANIMATION — Lancer le minuteur. Point d’étape au micro à la fin : « Qui a encore une ligne qui coince ? » Si Node manque : nodejs.org, version LTS. Si le compte GitHub est bloqué : avancer en démo partagée jusqu’au Module 2.

TRANSITION — « Tout le monde est prêt ? Module 1 : qu’est-ce que GitHub Copilot ? »`,
  `⏱ 1 min · MODULE 1 · 9:30

OBJECTIF — Annoncer le module : comprendre avant d’utiliser.

DIRE — « Premier module : qu’est-ce que GitHub Copilot, vraiment ? D’où il vient, comment il fabrique une suggestion, ce qu’il sait faire et ce qu’il ne sait pas faire. On termine par une démo et votre premier atelier. »

TRANSITION — « Un peu d’histoire : celle de l’IA, puis celle de Copilot. »`,
  `⏱ 4 min · FRISE DE L’IA (interactive, 3 temps)

OBJECTIF — Situer Copilot dans 80 ans d’histoire de l’IA, mettre des visages sur les grandes étapes, montrer l’accélération depuis 2017.

DIRE — « L’IA n’est pas née avec ChatGPT. 1943, McCulloch et Pitts modélisent le neurone. 1950, Turing pose la question : une machine peut-elle penser ? 1956, Dartmouth invente le mot. 1957, le perceptron de Rosenblatt apprend. Puis deux hivers : promesses non tenues, crédits coupés. Le renouveau vient de l’apprentissage : rétropropagation en 1986, réseaux convolutifs de Yann LeCun, pendant que Deep Blue bat Kasparov par la force brute. Puis le deep learning : ImageNet, AlexNet en 2012, AlphaGo en 2016. » → beat 1 « 2017 : l’article Transformer de Google, “Attention Is All You Need”. C’est l’architecture de tous les LLM actuels. GPT-3 en 2020, GitHub Copilot en 2021, ChatGPT fin 2022. » → beat 2 « Depuis 2024, les modèles agissent : MCP les branche à vos outils, 2025 est l’année des agents de code, 2026 celle des équipes d’agents. »

ANIMATION — Survoler un jalon ouvre sa fiche (personnes, contexte, anecdote) ; survoler une période affiche son résumé. En piocher deux ou trois selon le public : ELIZA, AlexNet entraîné dans une chambre, le coup 37 d’AlphaGo. Ne pas tout lire.

TRANSITION — « Dans cette histoire, Copilot occupe les cinq dernières années. Zoom. »`,
  `⏱ 2 min · HISTOIRE DE COPILOT

OBJECTIF — Situer Copilot : un outil jeune, qui change vite.

DIRE — « 2021 : préversion, basée sur Codex, un modèle d’OpenAI spécialisé dans le code. 2022 : disponible pour tous. 2023 : le chat arrive dans l’éditeur. 2024 : on peut choisir son modèle, et une offre gratuite apparaît. 2025 : le mode Agent, qui modifie plusieurs fichiers et lance des commandes. Et 2026… » → beat 1 « … la fenêtre Agents, des sessions dans le cloud, et un nouveau modèle de facturation par crédits. Mais sous toutes ces couches, le même moteur. »

TRANSITION — « Justement, ouvrons le capot de ce moteur. »`,
  `⏱ 3 min · IA, ML, DEEP LEARNING, LLM (3 temps + interaction)

OBJECTIF — Clarifier le vocabulaire : chaque terme est un cas particulier du précédent ; le machine learning inverse la programmation.

DIRE — « L’intelligence artificielle, c’est le grand cercle : toute machine qui fait une tâche qu’on dirait intelligente, y compris avec des règles écrites à la main. » → beat 1 « Le machine learning est un sous-ensemble : on n’écrit plus les règles, on les fait apprendre à partir d’exemples. » → beat 2 « Le deep learning : de l’apprentissage avec des réseaux de neurones très profonds, depuis 2012. » → beat 3 « Et les LLM, les grands modèles de langage, sont des réseaux profonds géants entraînés sur du texte et du code. Copilot est là, au centre. »

ANIMATION — En bas à droite, cliquer « Programmation classique » puis « Machine learning » : les entrées et la sortie s’inversent. « Avant, vous donniez les règles. Maintenant, vous donnez des exemples et la machine fabrique les règles. »

TRANSITION — « Ces règles apprises sont stockées dans des neurones artificiels. Regardons-en un. »`,
  `⏱ 3 min · NEURONE ET RÉSEAU (interactif, 2 temps)

OBJECTIF — Démystifier le neurone : une somme pondérée et un seuil ; un réseau, ce sont des couches de ces calculs.

DIRE — « Un neurone artificiel fait trois choses : multiplier chaque entrée par un poids, additionner, décider. Ici, un neurone jouet décide si un ticket est urgent. »

ANIMATION — Activer « En production » : la somme devient positive, le ticket passe URGENT. Activer « Simple faute de frappe » : poids négatif, il redevient normal. À droite, cliquer « Propager un signal » : le signal traverse les couches de gauche à droite.

→ beat 1 « Personne n’a écrit 0,7 ou −0,6 : c’est l’entraînement qui trouve ces poids. » → beat 2 « GPT-3, en 2020 : 175 milliards de poids et 96 couches. Les modèles d’aujourd’hui sont plus grands encore. Le principe, lui, est celui de ce petit neurone. »

TRANSITION — « Comment trouve-t-on des milliards de poids ? En s’entraînant. »`,
  `⏱ 3 min · ENTRAÎNEMENT (interactif, 4 temps)

OBJECTIF — Faire comprendre l’entraînement : réduire l’erreur pas à pas ; les trois phases ; un modèle figé après coup.

DIRE — « Entraîner, c’est jouer à “devine le token suivant” sur des milliards d’exemples. À chaque erreur, on ajuste un peu les poids dans la direction qui réduit l’erreur : c’est la descente de gradient. »

ANIMATION — Cliquer « Un pas » plusieurs fois : la boule descend vers l’erreur minimale. Monter le taux d’apprentissage vers 0,30 puis « 10 pas » : la boule oscille ou diverge. « Trop prudent, c’est lent ; trop pressé, ça n’apprend plus. » Réinitialiser.

→ beat 1 « Phase 1, le pré-entraînement : des milliers de milliards de tokens, des semaines sur des milliers de GPU. » → beat 2 « Phase 2 : on lui montre des consignes et de bonnes réponses ; il apprend à suivre une demande. » → beat 3 « Phase 3 : des humains comparent ses réponses, il apprend à préférer les plus utiles et les plus sûres. » → beat 4 « Ensuite, on fige les poids. Le modèle n’apprend rien pendant votre session. Ce qu’il sait de TaskFlow, il le sait uniquement par le contexte que VS Code lui envoie. »

TRANSITION — « On a parlé de tokens. C’est quoi, exactement ? »`,
  `⏱ 3 min · TOKENS (interactif, 1 temps)

OBJECTIF — Faire comprendre l’unité de base du modèle et ses trois conséquences : coût, limite de contexte, angles morts.

DIRE — « Le modèle ne lit ni des lettres ni des mots, il lit des tokens : des morceaux de mots. »

ANIMATION — Cliquer « Du code », puis « Du français », puis « La même chose en anglais » : comparer le nombre de caractères par token (le français coûte un peu plus). Cliquer « Un identifiant » : un nom explicite se découpe en morceaux de sens, Copilot s’y retrouve bien. Activer « Ce que voit le modèle : des nombres » : chaque token est un identifiant numérique. Le découpage affiché est illustratif.

→ beat 1 « Trois conséquences. La facture : les crédits du chat et des agents se comptent en tokens. La limite : la fenêtre de contexte se mesure en tokens. Les angles morts : compter des lettres, c’est difficile pour lui, il ne voit pas les lettres. »

TRANSITION — « Comment le modèle relie-t-il ces tokens entre eux ? Avec l’attention. »`,
  `⏱ 3 min · TRANSFORMER ET ATTENTION (interactif, 1 temps)

OBJECTIF — Donner l’intuition de l’attention : chaque token pondère tous les autres pour comprendre le contexte.

DIRE — « 2017, Google publie le Transformer. Son idée : pour comprendre un mot, chaque token regarde tous les autres et décide lesquels comptent. »

ANIMATION — Phrase : cliquer « il » : les arcs montrent qu’il regarde surtout « ticket ». Cliquer « refuse » puis « long ». Onglet « Du code » : cliquer le second « t » : il regarde « tickets », d’où les suggestions de champs de ticket. Cliquer « 'fini' ». Les poids affichés sont illustratifs.

→ beat 1 « La chaîne complète : texte découpé en tokens, chaque token devient une liste de nombres, des dizaines de couches d’attention et de calcul, puis une probabilité pour chaque token possible. On en choisit un, on l’ajoute… et on recommence. »

TRANSITION — « Ce choix, justement, regardons-le de près. »`,
  `⏱ 4 min · GÉNÉRATION PROBABILISTE (démo interactive, 1 temps)

OBJECTIF — Faire vivre la prédiction probabiliste et la température ; plausible n’est pas correct.

DIRE — « Après “new Date(ticket.echeance) <”, le modèle calcule une probabilité pour chaque suite. “maintenant”, le paramètre, est la bonne. “new Date()” et “Date.now()” marchent… mais ignorent le paramètre, et le code devient difficile à tester. “ticket.creeLe”, c’est une logique fausse. “aujourdhui”, une variable qui n’existe pas. »

ANIMATION — Température 0,2 : cliquer « Tirer un token » cinq fois, presque toujours la même réponse. Monter à 1,8 : tirer cinq fois, les suites douteuses apparaissent. Lire le compteur « suites douteuses ».

→ beat 1 « Le token tiré est ajouté, et il prédit le suivant. C’est pour ça que la même question donne des réponses différentes. Et à l’atelier 1, vous testerez un cas où la réponse la plus fréquente sur Internet est fausse : les années bissextiles. Plausible n’est pas correct. »

TRANSITION — « Et quand le plausible est complètement faux, on parle d’hallucination. »`,
  `⏱ 2 min · HALLUCINATIONS (4 temps, cartes à retourner)

OBJECTIF — Expliquer pourquoi le modèle invente, et donner les premiers réflexes (approfondis au Module 8).

DIRE — « Le modèle ne consulte pas une base de faits. Il complète avec ce qui ressemble le plus à du vrai. » → beat 1 « Une méthode sortBy qui n’existe pas sur les tableaux JavaScript. » → beat 2 « Un paquet npm inventé : danger, quelqu’un a pu le publier exprès. » → beat 3 « Un réglage VS Code imaginaire, ignoré sans bruit. » → beat 4 « Pourquoi ? Motif rare, contexte incomplet, question qui présuppose la réponse. Vos parades : exécuter, tester, donner le contexte, vérifier la source. »

ANIMATION — Les cartes se retournent aussi au clic. Question au micro : « Laquelle de ces trois vous aurait piégé ? » (une ou deux réponses).

TRANSITION — « Revenons à Copilot : que se passe-t-il entre votre clavier et la suggestion ? »`,
  `⏱ 4 min · FONCTIONNEMENT

OBJECTIF — Faire comprendre la chaîne de production d’une suggestion, et surtout ce qui n’y figure pas.

DIRE — « Étape 1 : vous écrivez. » → beat 1 « Étape 2 : VS Code assemble le contexte : le fichier courant, les onglets ouverts, votre sélection, d’éventuelles instructions. C’est la seule chose que le modèle verra. » → beat 2 « Étape 3 : le service Copilot de GitHub applique des filtres : contenus, sécurité, et éventuellement le blocage des suggestions qui recopient du code public. » → beat 3 « Étape 4 : le modèle prédit la suite, morceau par morceau. » → beat 4 « Étape 5 : la suggestion s’affiche. » → beat 5 « Et étape 6, la vôtre : vous décidez. Remarquez ce qui manque : personne n’a exécuté ce code. »

TRANSITION — « Et si on donne des outils au modèle, et le droit de recommencer ? On obtient un agent. »`,
  `⏱ 3 min · LA BOUCLE AGENTIQUE (10 temps ou lecture automatique)

OBJECTIF — Faire comprendre ce qu’est un agent : un LLM + des outils + une boucle ; et la place de l’humain.

DIRE — « Le chat répond avec du texte. Un agent, lui, agit : il lit des fichiers, les modifie, lance des commandes, observe le résultat, et recommence jusqu’à atteindre l’objectif. Exemple sur TaskFlow : faire passer les tests de l’atelier 4 au vert. »

ANIMATION — Avancer clic par clic : chaque clic ajoute une ligne au journal et allume le nœud correspondant (Réfléchir, Agir, Observer). → beat 1 il planifie ; → beat 2 il lit le test ; → beat 3 il observe la règle des points ; → beat 4 il édite ; → beat 5 il lance les tests, et vous approuvez la commande ; → beat 6 un échec ; → beat 7 il replanifie ; → beat 8 il corrige ; → beat 9 tout est vert ; → beat 10 il rend la main avec un résumé et un diff. Variante : bouton « Lecture automatique ».

DIRE (fin) — « Remarquez l’étape 6 : il s’est trompé, et c’est le test qui l’a vu, pas lui. Sans test, l’agent aurait annoncé “terminé”. »

TRANSITION — « Comment guider un modèle ou un agent ? Trois leviers. »`,
  `⏱ 3 min · PROMPT, CONTEXTE, HARNAIS (2 temps + clic sur les couches)

OBJECTIF — Distinguer les trois leviers : ce que l’on demande, ce que le modèle voit, le cadre dans lequel l’agent agit.

DIRE — « Le prompt engineering, c’est l’art de formuler : objectif, contraintes, format, exemple. Exemple : ce commentaire qui guide la génération de validerTicket. » → beat 1 « Le context engineering, terme popularisé en 2025 : choisir ce que le modèle voit. Les bons fichiers, les règles du projet, une session propre, pas de bruit. Vous le pratiquerez au Module 3. » → beat 2 « Le harness engineering, le harnais : le cadre de l’agent. Quels outils, quelles permissions, quels garde-fous automatiques comme les tests, quel bac à sable, et une revue humaine à la fin. Plus vous déléguez, plus le harnais compte. »

ANIMATION — Cliquer chaque couche pour revenir sur un niveau ; le panneau de droite liste ce qu’on règle et où ça se trouve dans Copilot.

TRANSITION — « Ces leviers s’appliquent aux modèles que Copilot vous propose. Lesquels ? »`,
  `⏱ 3 min · MODÈLES

OBJECTIF — Démystifier le sélecteur de modèle.

DIRE — « Copilot n’est pas un modèle, c’est un service. Les suggestions inline utilisent un modèle rapide dédié, que vous ne choisissez pas dans le chat, et qui ne consomme pas de crédits. Dans le chat, le choix par défaut est Auto : Copilot choisit pour vous, et c’est le seul choix sur l’offre gratuite. Avec une offre payante, vous pouvez choisir parmi plusieurs modèles, légers ou avancés ; la liste change tous les mois. Retenez : changer de modèle ne remplace pas un bon contexte. »

TRANSITION — « Et Copilot ne vit pas seulement dans VS Code. »`,
  `⏱ 3 min · ÉCOSYSTÈME

OBJECTIF — Situer l’éditeur parmi les points d’entrée de Copilot.

DIRE — « Le même compte vous donne Copilot dans l’éditeur, sur github.com, dans le terminal avec Copilot CLI, un agent cloud à qui on confie une issue et qui ouvre une pull request, une revue de code automatique, et une app pour suivre ses sessions. Pendant deux jours, on reste dans l’éditeur : c’est là que se joue 90 % de votre quotidien. »

TRANSITION — « Parlons argent : les offres ont changé cette année. »`,
  `⏱ 3 min · OFFRES & CRÉDITS (actualité)

OBJECTIF — Donner une image juste et datée des offres, sans se perdre dans les tarifs.

DIRE — « Depuis juin 2026, GitHub facture l’usage du chat et des agents en crédits IA : un crédit vaut un centime de dollar, et le coût dépend du modèle et de la taille de la tâche. Les suggestions inline et les suggestions de modification suivante ne consomment pas de crédits. L’offre Free donne 2 000 complétions par mois et un usage limité du chat. Les offres Pro ajoutent l’illimité, le choix du modèle, l’agent cloud et la revue de code. En entreprise, Business ou Enterprise : la licence vient de votre organisation, l’administrateur fixe des politiques, et vos données ne servent pas à entraîner les modèles. »

ANIMATION — Insister sur la date : ces chiffres bougent ; renvoyer vers la page officielle.

TRANSITION — « Et le mois dernier, GitHub a annoncé une série de nouveautés. »`,
  `⏱ 3 min · NOUVEAUTÉS UNIVERSE 2026 (actualité)

OBJECTIF — Montrer que l’on suit l’actualité, et rassurer : rien d’indispensable pour débuter.

DIRE — « Le 28 octobre, à GitHub Universe, six annonces pour VS Code. La fenêtre Agents, pour lancer et suivre des sessions, qu’on peut reprendre sur mobile ou dans le terminal. L’Agent Host : les sessions continuent même fenêtre fermée. La comparaison de modèles sur une même tâche, en préversion. Des automatisations dans le cloud, déclenchées par exemple par une pull request. Des connecteurs vers Slack, Notion ou Microsoft Learn. Et un bac à sable qui limite ce que les agents peuvent toucher sur votre poste. » → beat 1 « Bonne nouvelle : rien de tout cela n’est nécessaire pour bien débuter. »

TRANSITION — « Vérifions vos intuitions sur Copilot. »`,
  `⏱ 5 min · VRAI OU FAUX (vote oral)

OBJECTIF — Faire émerger et corriger les idées reçues.

DIRE — « Six affirmations. Pour chacune, dites “vrai” ou “faux” au micro, je compte, puis je retourne la carte. »

ANIMATION — Carte 5 : préciser que la « mémoire » éventuelle d’un agent prend la forme de fichiers de notes visibles, pas d’un modèle qui apprend. Carte 4 : faire le lien avec le Module 8 (droits d’auteur).

TRANSITION — « Synthèse : où Copilot brille, où il trébuche. »`,
  `⏱ 3 min · AVANTAGES & LIMITES

OBJECTIF — Donner une grille de lecture réaliste.

DIRE — « À gauche, ce que Copilot fait très bien : le répétitif, l’explication, le premier jet de tests et de documentation, la syntaxe d’un langage qu’on connaît mal. À droite, les zones de vigilance : la logique métier subtile, la sécurité, les API récentes ou internes qu’il invente, et les licences. La bonne posture : un collègue junior très rapide et très cultivé. On délègue, on relit. »

TRANSITION — « Assez parlé : je vous montre. »`,
  `⏱ 6 min · DÉMO EN DIRECT + Q/R

OBJECTIF — Montrer les trois gestes de base sur TaskFlow, et répondre aux questions.

DIRE — « Je partage mon écran. Un : une suggestion inline sur un commentaire. » → beat 1 « Deux : une question au chat, en mode Ask, et je vérifie sa réponse dans le README. » → beat 2 « Trois : une modification sur place avec Ctrl+I, je relis le diff avant d’accepter. » → beat 3 « Quatre : la preuve, npm test. »

ANIMATION — Faire la démo réellement dans le dépôt taskflow-copilot (pas de capture). Prendre 2 ou 3 questions du clavardage.

TRANSITION — « À vous : premier atelier, vingt minutes. »`,
  `⏱ 20 min · ATELIER 1 (individuel)

OBJECTIF — Premier contact actif : expliquer le projet, premières suggestions, premier esprit critique.

DIRE — « Vingt minutes, chacun sur son poste. L’énoncé complet est dans ateliers/atelier-01-decouverte. Trois étapes : faire expliquer le projet et le comparer au README, traiter les quatre blocs du kata, et vérifier la règle des années bissextiles. Notez tout dans JOURNAL.md. »

ANIMATION — Lancer le minuteur. Point d’étape à 10 min : « Copilot vous a-t-il déjà dit quelque chose de faux ? » Bloqué (pas de suggestion) : vérifier la connexion, ce sera réglé au Module 2 ; avancer avec le chat.

TRANSITION — « On fait le point avec un QCM. »`,
  `⏱ 5 min · QCM MODULE 1 (vote oral)

OBJECTIF — Vérifier les notions clés du module.

DIRE — « Quatre questions. Votez à voix haute, A, B ou C, puis je clique. »

ANIMATION — Question 3 : faire le lien avec les réponses de l’atelier (1900).

TRANSITION — « Pause de quinze minutes. Ensuite, on installe et on configure Copilot proprement. »`,
  `⏱ 15 min · PAUSE · 10:55

DIRE — « Quinze minutes loin de l’écran. On reprend à 11 h 10 avec l’installation. »`,
  `⏱ 1 min · MODULE 2 · 11:10

OBJECTIF — Annoncer un module très concret : à la fin, chaque poste est prêt et réglé.

DIRE — « Module 2 : installation et configuration. On installe, on vérifie la licence, on règle Copilot pour qu’il vous ressemble, et on apprend les raccourcis qui font gagner des heures. »

TRANSITION — « Installation, en cinq étapes. »`,
  `⏱ 6 min · INSTALLER (démo)

OBJECTIF — Faire installer et connecter Copilot sur chaque poste.

DIRE — « Copilot est désormais intégré à VS Code : il suffit de se connecter. Mettez VS Code à jour, cliquez sur l’icône Copilot en bas à droite ou ouvrez la vue Chat, connectez-vous avec GitHub : le navigateur s’ouvre, vous autorisez VS Code, vous revenez. L’extension Copilot Chat s’installe d’elle-même ; vérifiez-la dans la vue Extensions. Puis un premier essai : un commentaire dans un fichier JavaScript. »

ANIMATION — Faire en direct sur mon écran, puis point d’étape : « Qui voit le texte grisé ? Dites “oui” au micro. » Ceux qui ont déjà Copilot vérifient l’icône.

TRANSITION — « Quelle licence avez-vous activée ? »`,
  `⏱ 4 min · AUTHENTIFICATION & LICENCE

OBJECTIF — Que chacun sache quelle offre il utilise et pourquoi certaines fonctions peuvent manquer.

DIRE — « Trois cas. Pas de licence : Copilot Free s’active seul. Licence personnelle : Pro ou Pro+, sur votre compte. Licence d’entreprise : votre organisation vous attribue un siège ; connectez-vous avec le bon compte, c’est l’erreur la plus fréquente. Pour vérifier : l’icône de la barre d’état, le menu Comptes, et la page github.com/settings/copilot. Et si une fonctionnalité est grisée en entreprise, c’est souvent une politique de l’administrateur, pas une panne. »

TRANSITION — « Réglons maintenant votre environnement. »`,
  `⏱ 5 min · PARAMÉTRAGE (démo)

OBJECTIF — Présenter les réglages utiles, dans un fichier versionné.

DIRE — « Je préfère les réglages d’espace de travail : ils vivent dans le projet, toute l’équipe les partage. » → beat 1 « La langue : le chat répond en français. » → beat 2 « Les langages ciblés : on garde les suggestions pour le code, on les coupe pour la prose, Markdown et texte brut. » → beat 3 « Les suggestions de modification suivante : on les active, je vous les montre dans deux pages. » → beat 4 « Et tout cela existe aussi dans l’éditeur de paramètres : tapez “copilot” dans la recherche. »

TRANSITION — « Deux réglages de confiance, côté github.com. »`,
  `⏱ 4 min · CONFIDENTIALITÉ

OBJECTIF — Faire connaître les deux réglages de confiance et la règle d’or.

DIRE — « Premier réglage : les suggestions qui correspondent à du code public. Bloquer, et Copilot les écarte ; autoriser, et il les propose avec une référence vers le dépôt d’origine et sa licence. On en reparle au Module 8. Deuxième réglage : l’utilisation de vos données. Sur un compte personnel, vérifiez ce qui est coché ; en Business et Enterprise, vos données ne servent pas à l’entraînement. En entreprise, l’administrateur peut aussi exclure des fichiers. Mais la meilleure protection, c’est vous : pas de secret dans le code, pas de donnée réelle dans un prompt. »

ANIMATION — Montrer la page github.com/settings/copilot sur mon compte, sans s’y attarder.

TRANSITION — « Passons au clavier. »`,
  `⏱ 4 min · RACCOURCIS

OBJECTIF — Présenter les 8 gestes que l’atelier va entraîner.

DIRE — « Huit raccourcis. À gauche, le texte grisé : Tab accepte, Échap refuse, Ctrl+flèche droite accepte mot par mot, Alt+crochet passe d’une proposition à l’autre. À droite, le chat : Ctrl+I pour une modification sur place, Ctrl+Alt+I pour la vue Chat, Ctrl+N pour une nouvelle conversation. Et Alt+antislash pour forcer une suggestion. Sur un clavier AZERTY, certains crochets sont capricieux : on peut les réattribuer. »

TRANSITION — « Regardons la navigation en détail. »`,
  `⏱ 4 min · NAVIGATION (démo)

OBJECTIF — Montrer les alternatives, l’acceptation partielle et les suggestions de modification suivante.

DIRE — « Quand Copilot a plusieurs idées, survolez le texte grisé : une petite barre affiche 2 sur 3 et des flèches. Ici, la deuxième proposition gère la division par zéro : c’est elle que je veux. » → beat 1 « L’autre famille, ce sont les suggestions de modification suivante. Je renomme un paramètre : une flèche apparaît dans la gouttière, là où il faut répercuter le changement. Tab pour y aller, Tab pour appliquer. » → beat 2 « Dans les deux cas, rien n’est écrit sans votre Tab. »

TRANSITION — « Faisons le tour du panneau Chat. »`,
  `⏱ 5 min · PANNEAU CHAT (démo)

OBJECTIF — Rendre chacun autonome dans la vue Chat.

DIRE — « Six zones. » → beat 1 « Le plus : une nouvelle conversation. Un sujet, une conversation : sinon le contexte s’encombre. » → beat 2 « L’historique, pour reprendre une session. » → beat 3 « Ajouter du contexte : un fichier, la sélection, tout le code du projet avec #codebase. C’est ce que le modèle verra. » → beat 4 « Le choix de l’agent : Ask, Plan ou Agent. » → beat 5 « Le choix du modèle : Auto par défaut. » → beat 6 « Et les commandes slash : explain, fix, tests, doc. »

ANIMATION — Montrer chaque zone dans mon VS Code en parallèle.

TRANSITION — « Quatre façons de parler à Copilot : quand utiliser laquelle ? »`,
  `⏱ 4 min · ASK, PLAN, AGENT, CTRL+I

OBJECTIF — Donner la règle de choix pour un débutant.

DIRE — « Ask répond, sans rien modifier : idéal pour comprendre. Ctrl+I modifie votre sélection sur place, avec un diff à relire. Plan prépare un plan sans écrire de code, avant une tâche plus large. Agent modifie des fichiers et lance des commandes : puissant, mais il agit, donc permissions, diff et tests. Pendant deux jours, on vivra surtout en Ask et en Ctrl+I, et on verra l’Agent ponctuellement. »

TRANSITION — « À vous : trente minutes pour régler votre poste et prendre les réflexes. »`,
  `⏱ 30 min · ATELIER 2 (individuel)

OBJECTIF — Chaque poste est configuré et versionné ; les 8 gestes deviennent des réflexes.

DIRE — « Trente minutes. Énoncé dans ateliers/atelier-02-configuration. D’abord la licence, puis les quatre réglages, chacun vérifié par son effet, puis les huit gestes dans le kata, sans souris. »

ANIMATION — Coller le bloc settings.json dans le clavardage. Points d’étape à 10 min (« Le chat vous répond en français ? ») et 25 min (« Quel geste résiste ? »). AZERTY : montrer la réattribution d’un raccourci en partage d’écran.

TRANSITION — « QCM, puis on comprend vraiment les suggestions. »`,
  `⏱ 5 min · QCM MODULE 2 (vote oral)

OBJECTIF — Vérifier gestes et réglages.

DIRE — « Quatre questions, votez à voix haute. »

TRANSITION — « Module 3 : comprendre ce que Copilot voit, pour comprendre ce qu’il propose. »`,
  `⏱ 1 min · MODULE 3 · 12:15

OBJECTIF — Annoncer le cœur du Jour 1 : comprendre ce que Copilot voit, et apprendre à lire.

DIRE — « Module 3 : comprendre les suggestions. Pourquoi Copilot propose parfois exactement ce qu’il faut, et parfois n’importe quoi ? La réponse tient en un mot : le contexte. Et la parade tient en un geste : lire avant d’accepter. »

TRANSITION — « Qu’est-ce que Copilot lit, exactement ? »`,
  `⏱ 5 min · CE QUE COPILOT VOIT

OBJECTIF — Distinguer le contexte de l’inline et celui du chat.

DIRE — « À gauche, une suggestion inline. Copilot lit le code avant et après le curseur, le commentaire, le nom de la fonction, l’import : ici, il sait que STATUTS existe, donc il propose STATUTS.includes. Il lit aussi les onglets ouverts à côté, mais pas les fichiers fermés. » → beat 1 « À droite, le chat : des instructions fixées par l’outil, les instructions de votre dépôt, vos références, tout l’historique de la conversation, et votre message, souvent la plus petite partie. » → beat 2 « Conséquence pratique : pour l’inline, on soigne le fichier et les onglets ; pour le chat, les références, et on repart d’une conversation propre. »

TRANSITION — « Et ce contexte a une taille limite. »`,
  `⏱ 5 min · FENÊTRE DE CONTEXTE

OBJECTIF — Faire comprendre la limite de la fenêtre et ses effets sur la qualité.

DIRE — « Le modèle lit un nombre limité de tokens, des morceaux de mots. Instructions, fichier courant, onglets, votre message. » → beat 1 « Ajoutez une longue conversation, et la fenêtre déborde : ce qui sort, c’est souvent le plus ancien, par exemple votre première consigne. Symptômes : il oublie, il mélange. » → beat 2 « Parades : moins mais mieux, en joignant le bon fichier plutôt que tout le projet ; et repartir propre, une conversation par sujet, ou /compact pour résumer. »

ANIMATION — Pour les curieux : un autre support de la plateforme détaille la fenêtre de contexte.

TRANSITION — « Inline, chat en ligne, vue Chat : comparons-les. »`,
  `⏱ 3 min · INLINE OU CHAT

OBJECTIF — Fixer la différence et la règle de choix.

DIRE — « Le tableau se lit en colonnes. L’inline se déclenche quand vous tapez, regarde autour du curseur et propose quelques lignes ; il ne consomme pas de crédits. Ctrl+I part de votre sélection et propose un diff. La vue Chat répond à une question, avec vos références. La règle : vous savez ce que vous voulez écrire, inline ; vous savez quoi changer, Ctrl+I ; vous ne savez pas encore, Ask. »

TRANSITION — « Bon appétit ! À 14 h, on vérifie tout ça avec un exercice. »`,
  `⏱ 90 min · DÉJEUNER · 12:30

DIRE — « Bon appétit ! Reprise à 14 h 00 précises : un exercice, puis l’Atelier 3. Laissez VS Code ouvert sur le dépôt. »`,
  `⏱ 5 min · QUEL OUTIL ? (exercice oral)

OBJECTIF — Appliquer la règle de choix sur 8 situations.

DIRE — « Huit étiquettes, trois colonnes. Dites-moi où va chacune, je la déplace. » Puis → beat 1 pour afficher le corrigé.

ANIMATION — Appeler les participants par prénom, une étiquette chacun. Accepter les variantes argumentées : « documenter la fonction » peut aussi se faire en Ask.

TRANSITION — « Entraînons maintenant le geste de base. »`,
  `⏱ 5 min · SIMULATEUR (exercice oral)

OBJECTIF — Entraîner le réflexe : lire, comparer les alternatives, puis seulement accepter.

DIRE — « Trois propositions pour la même fonction. Je les fais défiler avec Alt+crochet. Dites-moi laquelle garder. »

ANIMATION — Faire défiler les 3 propositions, accepter la n° 2 si quelqu’un la choisit (pour montrer le verdict rouge), réinitialiser, puis accepter la n° 1 mot par mot avec Ctrl+→.

TRANSITION — « Comment lire vite et bien ? Cinq questions. »`,
  `⏱ 5 min · LIRE AVANT D’ACCEPTER

OBJECTIF — Donner une grille de relecture rapide, et la faire pratiquer sur un exemple.

DIRE — « Cinq questions, dans l’ordre : fait-elle ce que j’ai demandé ? Ce qu’elle appelle existe-t-il ? Et les cas limites ? A-t-elle des effets de bord ? Puis-je l’expliquer ligne à ligne ? À droite, une suggestion acceptée sans lecture. Qui voit un problème ? » → beat 1 « Effet de bord : sort trie le tableau reçu. » → beat 2 « Cas limite : l’indice length est toujours hors du tableau. » → beat 3 « La version relue. »

TRANSITION — « À vous : l’Atelier 3. »`,
  `⏱ 35 min · ATELIER 3 (individuel) · 14:15

OBJECTIF — Vérifier par l’expérience l’effet du contexte, et pratiquer la lecture critique.

DIRE — « Re-bonjour ! Trente-cinq minutes, énoncé dans ateliers/atelier-03-contexte. Quatre expériences : nom seul, onglet voisin et JSDoc, commentaire vague ou précis, et lire avant d’accepter. Notez vos observations dans la grille du journal : c’est ce que nous partagerons à la fin. »

ANIMATION — Points d’étape à 15 min (« Expériences 1 et 2 : quelle différence avez-vous vue ? ») et 30 min. Faire partager 2 observations au micro à la fin.

TRANSITION — « QCM rapide, puis on génère du vrai code. »`,
  `⏱ 5 min · QCM MODULE 3 (vote oral)

OBJECTIF — Vérifier contexte, fenêtre et grille de lecture.

DIRE — « Quatre questions, votez à voix haute. »

TRANSITION — « Module 4 : générer du code simple, et le premier morceau de TaskFlow. »`,
  `⏱ 1 min · MODULE 4 · 14:55

OBJECTIF — Annoncer le passage à la génération guidée.

DIRE — « Module 4 : générer du code simple. Variables, fonctions à partir d’un nom ou d’un commentaire, trois langages, et les comportements à attendre. Puis vous écrirez avec Copilot le premier morceau de TaskFlow : le modèle de ticket. »

TRANSITION — « Commençons par ce que Copilot fait le mieux. »`,
  `⏱ 5 min · STRUCTURES (démo)

OBJECTIF — Montrer la complétion de constantes et de structures, et ce qu’on y vérifie.

DIRE — « Je tape export const STATUTS, avec un commentaire qui dit “dans l’ordre du flux”, et Copilot propose les quatre statuts. » → beat 1 « Une table de libellés : il reprend les mêmes clés, puisqu’il les voit juste au-dessus. Je vérifie l’orthographe, les accents. » → beat 2 « Un ticket vide : il réutilise les valeurs par défaut probables. L’astuce : écrivez d’abord la structure la plus importante, les suivantes s’en inspirent. »

ANIMATION — Faire en direct dans src/tickets.js d’une copie du dépôt, puis annuler.

TRANSITION — « Pour une fonction, tout commence par son nom. »`,
  `⏱ 4 min · NOM DE FONCTION

OBJECTIF — Faire du nommage un levier de génération.

DIRE — « À gauche, calc de x et y : Copilot choisit le motif le plus fréquent, un pourcentage peut-être. Aucun moyen de savoir. » → beat 1 « À droite, convertirPointsEnJours, avec points et pointsParJour par défaut : l’intention est claire, la suggestion aussi, et elle gère même le ticket non estimé. Trois règles : un verbe d’action, le vocabulaire du métier, des paramètres parlants. »

TRANSITION — « Quand le nom ne suffit pas : le commentaire. »`,
  `⏱ 6 min · LE COMMENTAIRE GUIDE (exercice oral)

OBJECTIF — Faire découvrir les 5 ingrédients d’un commentaire efficace.

DIRE — « Un commentaire vague : “vérifie les points”. Regardez la suggestion : points supérieurs à zéro. 4 passerait. Quel ingrédient ajouter ? Dites-le au micro. »

ANIMATION — Activer les ingrédients dans l’ordre proposé par les participants. Faire remarquer : la règle seule ne suffit pas ; c’est l’exemple négatif (« 4 → false ») et la contrainte (« "5" texte → false ») qui ferment les cas limites. Préciser que les suggestions affichées sont illustratives.

TRANSITION — « Et dans un autre langage ? »`,
  `⏱ 4 min · TROIS LANGAGES (démo)

OBJECTIF — Montrer la génération multi-langage et son piège propre à chaque langage.

DIRE — « Même commentaire en JavaScript, Python et Java. Copilot adopte les idiomes : includes en JavaScript, in en Python, contains en Java. Mais chaque langage a son piège : en Python, True vaut 1, et Copilot oublie presque toujours de l’exclure. La règle métier, elle, ne change pas, et les tests d’acceptation non plus. Les variantes Python et Java sont dans le dossier katas, en bonus de l’atelier. »

ANIMATION — Cliquer les trois onglets. Demander aux pythonistes du tour de table s’ils connaissaient le piège.

TRANSITION — « Quels motifs Copilot reconnaît-il immédiatement ? »`,
  `⏱ 3 min · PATTERNS COURANTS

OBJECTIF — Donner les motifs où l’on peut aller vite.

DIRE — « Six motifs. La répétition : écrivez un cas de switch, il fait les autres. Le miroir : après parserCsv, il propose exporterCsv. La série : jours, mois, Fibonacci. Le squelette : try-catch, export. La conversion, à condition de préciser entrée et sortie. Et le test jumeau : un premier test, les suivants arrivent. »

TRANSITION — « Et un comportement à connaître absolument. »`,
  `⏱ 4 min · COMPORTEMENTS ATTENDUS

OBJECTIF — Faire comprendre que Copilot imite le contexte, et ses deux autres travers.

DIRE — « Même demande, deux fichiers. Dans le legacy, avec des var et des ==, Copilot propose… des var et des ==. » → beat 1 « Dans un fichier moderne, il propose filter et ===. Il imite ce qu’il voit. Deux autres comportements : il invente des fonctions voisines plausibles, et il peut proposer une syntaxe datée. D’où la règle : nettoyer d’abord, générer ensuite, et toujours vérifier. »

TRANSITION — « Quinze minutes de pause, et à vous de générer. »`,
  `⏱ 15 min · PAUSE · 15:40

DIRE — « Quinze minutes loin de l’écran. À 15 h 55, l’Atelier 4 : le modèle de ticket de TaskFlow. »`,
  `⏱ 55 min · ATELIER 4 (individuel) · 15:55

OBJECTIF — Générer le modèle de ticket guidé par des commentaires, et prouver le résultat par les tests.

DIRE — « Cinquante-cinq minutes. Énoncé dans ateliers/atelier-04-modele. Lancez d’abord npm run test:atelier4 : les échecs sont votre cahier des charges. Puis une fonction à la fois : curseur sous le commentaire, lire, accepter ou préciser le commentaire, relancer les tests. On ne modifie jamais les tests. Tout est vert ? Commit, puis variante Python ou Java. »

ANIMATION — Points d’étape à 15, 30 et 45 min. Piège fréquent : points > 0 && points <= 13 ; titre undefined qui fait planter trim. Bloqué à 45 min : le point de reprise est dans reprises/fin-atelier-04.

TRANSITION — « QCM, puis bilan de la journée. »`,
  `⏱ 5 min · QCM MODULE 4 (vote oral)

OBJECTIF — Vérifier les pièges de génération vus en atelier.

DIRE — « Quatre questions, votez à voix haute. »

TRANSITION — « Faisons le bilan de cette première journée. »`,
  `⏱ 15 min · BILAN DU JOUR 1 (restitution)

OBJECTIF — Ancrer les quatre réflexes du jour ; restitution individuelle.

DIRE — « Quatre réflexes aujourd’hui : Copilot prédit, il ne vérifie pas ; un poste réglé et des gestes au clavier ; le contexte fait la suggestion ; le commentaire est un prompt. Maintenant, à vous : deux minutes chacun, dans l’ordre de la liste. Combien de tests verts, une suggestion que vous avez eu raison de refuser, et le geste qui vous a le plus servi. »

ANIMATION — Minuter à 2 min par personne. Au-delà de 10 participants : 5 ou 6 volontaires, les autres écrivent dans le clavardage.

TRANSITION — « Dernier mot avant de nous quitter. »`,
  `⏱ 5 min · BILLET DE SORTIE

OBJECTIF — Recueillir ce qui est acquis et ce qui reste flou, annoncer le Jour 2.

DIRE — « Une phrase chacun : ce que vous retenez, ce qui reste flou. Je réponds aux points flous demain matin. Notez aussi votre score de tests dans le journal. Demain, TaskFlow grandit : fonctions et classe, import CSV, refactoring d’un vieux code, une vraie suite de tests, et une revue de code. Si vous n’avez pas fini l’Atelier 4, le point de reprise est dans le dossier reprises. Très bonne soirée à toutes et à tous ! »

ANIMATION — Noter les points flous : les traiter dans la page de reprise du Jour 2.`,
  `⏱ 2 min · COUVERTURE JOUR 2 · 9:00

OBJECTIF — Accueillir, vérifier le son, relancer la dynamique.

DIRE — « Bonjour à toutes et à tous, bienvenue dans ce deuxième jour ! Hier, on a découvert Copilot, on l’a réglé, on a compris ses suggestions et généré le modèle de ticket. Aujourd’hui, TaskFlow devient un vrai petit logiciel : des fonctions complètes, du refactoring, des tests, et pour finir une revue de code. Tout le monde m’entend bien ? »

TRANSITION — « On commence par réveiller la mémoire. »`,
  `⏱ 8 min · QUIZ DE REPRISE (vote oral)

OBJECTIF — Réactiver les acquis du Jour 1 (évaluation continue).

DIRE — « Cinq questions sur hier. Votez à voix haute, A, B ou C. »

ANIMATION — Après chaque réponse, demander à un participant d’expliquer en une phrase. Noter le score « du premier coup » affiché.

TRANSITION — « Voici le programme de la journée. »`,
  `⏱ 5 min · PROGRAMME DU JOUR 2

OBJECTIF — Donner le déroulé et répondre aux points flous du billet de sortie.

DIRE — « Quatre modules : fonctions et blocs de code, refactoring, tests, et vérification. Chaque module a son atelier, sur le même dépôt. Avant de commencer, vos questions d’hier… » (répondre aux 2 ou 3 points flous notés). « Si l’Atelier 4 n’est pas terminé, copiez le point de reprise maintenant : l’Atelier 5 en a besoin. »

TRANSITION — « Module 5 : des fonctions complètes. »`,
  `⏱ 1 min · MODULE 5 · 9:15

OBJECTIF — Annoncer le passage aux blocs de code complets.

DIRE — « Module 5 : des fonctions complètes, une classe, un fichier structuré, des appels HTTP, un parseur, et la documentation. Hier, on générait ligne par ligne ; aujourd’hui, on génère des blocs entiers, avec une méthode. »

TRANSITION — « La méthode tient en trois temps. »`,
  `⏱ 6 min · SIGNATURE D’ABORD (démo)

OBJECTIF — Installer la méthode contrat → corps → preuve.

DIRE — « Premier temps : le contrat. Je tape barre-oblique étoile étoile au-dessus de la signature, Copilot propose une JSDoc, je la corrige : “un nouveau tableau, l’original n’est pas modifié”. » → beat 1 « Deuxième temps : le corps. Copilot respecte le contrat : il trie une copie. » → beat 2 « Troisième temps : le test, tout de suite. Il vérifie l’ordre des douze tickets et que l’original est intact. »

ANIMATION — Le faire en direct sur une copie du dépôt.

TRANSITION — « Quels cas Copilot oublie-t-il le plus ? »`,
  `⏱ 4 min · LES SIX OUBLIS

OBJECTIF — Donner la liste des cas limites à exiger.

DIRE — « Six oublis classiques. La liste vide : zéro divisé par zéro donne NaN. null et undefined : le ticket non estimé. La mutation de l’entrée : sort, push, splice. Les égalités : deux tickets identiques, quel ordre ? Les bornes : trois caractères, inclus ou exclus ? Et l’entrée invalide : une erreur claire plutôt qu’un plantage. Mettez-les dans le commentaire, ou cherchez-les dans la suggestion. »

TRANSITION — « Passons aux classes. »`,
  `⏱ 5 min · CLASSE (démo)

OBJECTIF — Montrer la génération d’une classe méthode par méthode.

DIRE — « Un commentaire, export class Backlog, deux champs privés. Le constructeur : Copilot propose une copie des tickets. Pourquoi c’est important ? Sinon, supprimer dans le backlog supprimerait aussi dans le tableau d’origine. » → beat 1 « La méthode ajouter : l’id suivant, puis creerTicket. » → beat 2 « Le getter stats : il réutilise statistiques, qui existe déjà dans le fichier, au lieu de la réécrire. Une méthode à la fois, un test à chaque fois. »

TRANSITION — « Et pour organiser tout un fichier ? »`,
  `⏱ 4 min · STRUCTURER UN FICHIER

OBJECTIF — Faire demander le plan avant le code.

DIRE — « Pour un fichier entier, je demande d’abord le plan, en mode Ask, avec le fichier joint : les sections dans l’ordre et les signatures, sans les corps. Je relis, je corrige, je colle les signatures : le contexte est prêt pour l’inline. L’ordre classique : imports, constantes, fonctions internes, fonctions exportées, classe. Et une règle : un fichier, une responsabilité. Des fichiers courts donnent un meilleur contexte. »

TRANSITION — « Un cas fréquent : appeler une API. »`,
  `⏱ 5 min · APPELS HTTP

OBJECTIF — Montrer les trois oublis d’un fetch généré.

DIRE — « La première suggestion de Copilot pour charger des tickets : fetch, puis json. Trois problèmes : une erreur 500 passe pour un succès, un objet au lieu d’un tableau casse l’affichage, et on ne peut pas le tester sans réseau. » → beat 1 « Avec un commentaire précis : le statut vérifié, le format vérifié, et fetchFn injectable, ce qui nous permettra de le simuler à l’Atelier 7. Et jamais de jeton dans le code. »

TRANSITION — « Les données arrivent aussi par fichier. »`,
  `⏱ 5 min · PARSEURS (exercice oral)

OBJECTIF — Faire repérer les pièges d’un fichier réel avant de générer.

DIRE — « Voici le fichier que vous importerez. Combien de pièges voyez-vous ? Dites-les au micro. »

ANIMATION — Laisser chercher 1 minute. Faire citer les lignes : 4 (vide), 5 (espaces, points vides), 6 (colonne en trop), 7 (points 4 : syntaxe juste, règle fausse), 9 (titre vide). Puis montrer la liste à droite ; insister sur les pièges invisibles : fins de ligne Windows et BOM.

TRANSITION — « Dernier bloc : la documentation. »`,
  `⏱ 4 min · DOCUMENTATION (démo)

OBJECTIF — Montrer les deux gestes de génération de doc, et ce qu’est une bonne doc.

DIRE — « Deux gestes : barre-oblique étoile étoile puis Entrée, ou Ctrl+I puis /doc sur une sélection. En JavaScript, une JSDoc ; en Python, une docstring ; en Java, une Javadoc. Une bonne doc dit le contrat : paramètres, retour, erreurs, exemple. Une mauvaise paraphrase le nom de la fonction. Et une doc fausse est pire que pas de doc : relisez-la comme du code. »

ANIMATION — Cliquer les trois onglets.

TRANSITION — « À vous : cinquante minutes pour TaskFlow v2. »`,
  `⏱ 50 min · ATELIER 5 (individuel) · 9:55

OBJECTIF — Générer des fonctions complètes, une classe et un parseur, documentés et prouvés par les tests.

DIRE — « Cinquante minutes. Énoncé dans ateliers/atelier-05-backlog-api. D’abord le plan en Ask, puis une fonction à la fois : JSDoc, corps, test. La classe méthode par méthode. Le parseur avec le CSV ouvert à côté. Et à la fin, npm run serveur : l’interface TaskFlow s’allume avec votre code. »

ANIMATION — Points d’étape à 15 min (tri), 30 min (classe), 45 min (CSV et interface). Pièges fréquents : sort sur place ; toLowerCase sans normalize ; split(',') ; numéro de ligne décalé de 1.

TRANSITION — « QCM, puis pause. »`,
  `⏱ 5 min · QCM MODULE 5 (vote oral)

OBJECTIF — Vérifier méthode, oublis classiques et testabilité.

DIRE — « Quatre questions, votez à voix haute. »

TRANSITION — « Quinze minutes de pause. »`,
  `⏱ 15 min · PAUSE · 10:45

DIRE — « Quinze minutes loin de l’écran. À 11 h, on ouvre un vieux code de 2019, et on le remet à neuf sans rien casser. »`,
  `⏱ 1 min · MODULE 6 · 11:00

OBJECTIF — Annoncer le refactoring : lisible, sans changer le comportement.

DIRE — « Module 6 : le refactoring. Rendre un code lisible sans changer ce qu’il fait. Copilot est très bon pour proposer des transformations ; il est aussi très tenté de corriger ou d’améliorer au passage. Notre arbitre : les tests. »

TRANSITION — « D’abord : comment reconnaître un code à refactoriser ? »`,
  `⏱ 4 min · LES SIX ODEURS

OBJECTIF — Donner un vocabulaire pour repérer le code à refactoriser.

DIRE — « Six odeurs, toutes tirées du vieux fichier de TaskFlow. Des noms d’une lettre ; de l’imbrication ; des nombres magiques ; de la duplication ; des effets de bord, la fonction modifie ce qu’on lui passe ; et une syntaxe datée, var et double égal. Aucune n’empêche le code de marcher. Toutes rendent la modification risquée. »

TRANSITION — « Comment demander à Copilot de nettoyer ça ? »`,
  `⏱ 5 min · FORMULER LA DEMANDE

OBJECTIF — Remplacer « améliore ce code » par une demande en 4 ingrédients.

DIRE — « La demande vague : “améliore ce code”. Résultat typique : quarante lignes réécrites, le bug corrigé au passage, le double égal transformé en triple. Trois tests au rouge, et on ne sait plus pourquoi. » → beat 1 « La bonne demande a quatre ingrédients : quoi, le périmètre, la contrainte “même comportement”, et la vérification. Et des petits pas : une transformation, un test. »

TRANSITION — « Les trois gestes de base. »`,
  `⏱ 5 min · TROIS GESTES (démo)

OBJECTIF — Montrer renommer, extraire, simplifier, avec les outils VS Code et Copilot.

DIRE — « Renommer : F2, VS Code renomme toutes les occurrences sans se tromper, et Copilot peut proposer de meilleurs noms. Extraire : sélection, Ctrl+point, “extraire dans une fonction”, ou Ctrl+I en donnant le nom. Simplifier : retours anticipés, constantes nommées. Attention à la dernière ligne : passer du double au triple égal change le comportement. »

ANIMATION — Faire un renommage F2 en direct dans le legacy, montrer la suggestion de modification suivante.

TRANSITION — « Le geste le plus puissant : décrire la transformation en français. »`,
  `⏱ 5 min · REFACTORER AVEC CTRL+I (démo)

OBJECTIF — Montrer le diff de Ctrl+I et la discipline un pas / un test / un commit.

DIRE — « Je sélectionne la fonction, Ctrl+I : “extrais la boucle de comptage dans compterEnCours, même comportement”. Copilot propose un diff : en rouge ce qui part, en vert ce qui arrive. » → beat 1 « Je lis : la limite est restée “supérieur strict”, le bug est conservé. C’est voulu : on refactore, on ne corrige pas. » → beat 2 « J’accepte, je lance les tests, je commite. »

TRANSITION — « Comment être sûr que rien n’a changé ? »`,
  `⏱ 4 min · COMPARER AVANT / APRÈS

OBJECTIF — Donner les trois outils de validation et la règle des deux commits.

DIRE — « Trois outils. Les tests de caractérisation : ils photographient ce que le code fait aujourd’hui, bugs compris. Le diff Git : chaque ligne doit être un renommage, une extraction ou une simplification. Et votre relecture : si vous ne pouvez pas expliquer un changement, vous l’annulez. Et la règle d’or : refactoring et correction de bug, ce sont deux commits différents. »

TRANSITION — « Voici le code que vous allez reprendre. »`,
  `⏱ 5 min · LE LEGACY (exercice oral)

OBJECTIF — Faire repérer les odeurs sur le code réel de l’atelier.

DIRE — « Le Kanban legacy. Combien d’odeurs voyez-vous ? Dites-les au micro, je clique les pastilles correspondantes. »

ANIMATION — Cliquer les pastilles au fil des réponses. Insister sur la 2 (== : comportement) et la 4 (le bug WIP, conservé pendant le refactoring). Montrer le test « ⚠ accepte un 4e ticket ».

TRANSITION — « À vous : quarante-cinq minutes. »`,
  `⏱ 45 min · ATELIER 6 (individuel) · 11:35

OBJECTIF — Refactorer en petits pas sous la protection des tests, puis réécrire et corriger séparément.

DIRE — « Quarante-cinq minutes, énoncé dans ateliers/atelier-06-refactoring. D’abord comprendre avec Ask. Puis renommer, extraire, simplifier : un pas, un test, un commit. Enfin, générer src/kanban.js : la version moderne, pure, qui corrige le bug WIP. Deux commits distincts. »

ANIMATION — Points d’étape à 15, 30 et 40 min. Piège n° 1 : « améliore ce code » qui casse 3 tests. Piège n° 2 : === dans le legacy. Bloqué : git checkout du fichier et refaire en plus petit ; point de reprise dans reprises/fin-atelier-06.

TRANSITION — « QCM, puis déjeuner. »`,
  `⏱ 5 min · QCM MODULE 6 (vote oral)

OBJECTIF — Vérifier la distinction refactoring / changement de comportement.

DIRE — « Quatre questions, votez à voix haute. »

TRANSITION — « Bon appétit ! Cet après-midi : les tests. »`,
  `⏱ 90 min · DÉJEUNER · 12:30

DIRE — « Bon appétit ! Reprise à 14 h 00 : nous ferons écrire des tests à Copilot… et nous vérifierons qu’ils servent à quelque chose. »`,
  `⏱ 1 min · MODULE 7 · 14:00

OBJECTIF — Annoncer les tests, et l’angle : vérifier les tests générés.

DIRE — « Re-bonjour ! Module 7 : les tests unitaires. Copilot écrit des tests très vite. Notre travail cet après-midi : vérifier qu’ils servent à quelque chose, c’est-à-dire qu’ils échouent quand le code est faux. »

TRANSITION — « Petit rappel : qu’est-ce qu’un test unitaire ? »`,
  `⏱ 4 min · POURQUOI DES TESTS

OBJECTIF — Rappeler la définition et les raisons d’être, en lien avec Copilot.

DIRE — « Un test unitaire, c’est un petit programme qui appelle une fonction dans une situation donnée et vérifie le résultat. Il s’exécute en millisecondes. Quatre raisons d’en écrire : un filet de sécurité, une documentation qui ne ment pas, la liberté de refactorer, vous l’avez vécu ce matin, et le juge du code généré. Avec Copilot, on écrit plus de code, plus vite ; les tests disent s’il est juste. Ce sont les plus nombreux de la pyramide. »

TRANSITION — « À quoi ressemble un bon test ? »`,
  `⏱ 4 min · AAA

OBJECTIF — Fixer la structure Préparer / Agir / Vérifier et le nommage.

DIRE — « Trois temps. Préparer : trois tickets en cours, un à faire. Agir : on essaie de déplacer le quatrième. Vérifier : on attend un refus avec un message précis. Le nom du test dit le comportement, “refuse le 4e ticket en cours”, pas “test 3”. Et un comportement par test. Avec node:test et node:assert, tout est inclus dans Node. »

TRANSITION — « Comment faire écrire ça par Copilot ? »`,
  `⏱ 5 min · GÉNÉRER DES TESTS (démo)

OBJECTIF — Présenter trois chemins de génération et recommander « la liste d’abord ».

DIRE — « Premier chemin : Ctrl+I puis /tests. Rapide, mais Copilot choisit les cas, souvent les plus évidents. Deuxième chemin, celui que je recommande : demander d’abord la liste des cas, sans code, la compléter, puis générer un test par cas. Troisième : l’agent écrit et lance les tests ; il itère jusqu’au vert, parfois en affaiblissant un test pour qu’il passe. Et un piège : un test généré qui passe du premier coup ne prouve rien. »

ANIMATION — Montrer en direct le chemin 2 sur src/kanban.js.

TRANSITION — « Les tests générés, il faut aussi les ranger. »`,
  `⏱ 4 min · ORGANISER

OBJECTIF — Donner les conventions de structure.

DIRE — « Un fichier de tests par module. Un describe par règle : la sortie des tests se lit comme la spécification. Des noms en phrases. Une petite fabrique de données, comme ticket(id, statut), pour que chaque test montre seulement ce qui compte. Et un comportement par test : s’il échoue, une seule raison possible. Demandez explicitement cette structure à Copilot. »

TRANSITION — « Maintenant, le plus important : vérifier les assertions. »`,
  `⏱ 6 min · VÉRIFIER LES ASSERTIONS

OBJECTIF — Faire reconnaître les quatre pièges des tests générés.

DIRE — « Une seule question pour chaque test : échouerait-il si le code était faux ? Piège 1 : le test tautologique, qui recalcule l’attendu avec la même logique que le code. Piège 2 : l’assertion trop molle, assert.ok d’un objet, toujours vrai. Piège 3 : equal au lieu de deepEqual sur des objets. Piège 4, le plus sournois : l’attendu recopié du résultat actuel ; le test fige le bug. L’attendu vient de la règle, pas du code. »

TRANSITION — « Un outil pour vérifier tout ça d’un coup : la mutation. »`,
  `⏱ 5 min · MUTATION (exercice oral)

OBJECTIF — Faire comprendre le test de mutation par la prédiction.

DIRE — « On casse exprès : le supérieur ou égal devient supérieur strict. Notre suite a trois tests. Prédiction : est-ce qu’un test va rougir ? Dites-le au micro. »

ANIMATION — Activer la mutation : tout reste vert (la suite n’a pas de test sur la limite exacte). Puis activer « Ajouter le test de la limite exacte » : un test rougit. Désactiver la mutation : tout redevient vert.

TRANSITION — « Dernier outil : les mocks. »`,
  `⏱ 5 min · MOCKS (démo)

OBJECTIF — Montrer un mock simple de fetch avec node:test.

DIRE — « Un test unitaire ne doit dépendre ni du réseau, ni de la date, ni du hasard. Vous avez déjà préparé le terrain : fetchFn et aujourdHui sont des paramètres. Dans le test, je passe une fausse fonction, créée avec mock.fn, qui répond 500. Je vérifie l’erreur, et que fetch a été appelé une fois. » → beat 1 « Sans excès : vérifiez le résultat, pas chaque appel interne, sinon le moindre refactoring casse vos tests. »

TRANSITION — « À vous : cinquante minutes. »`,
  `⏱ 40 min · ATELIER 7 (individuel) · 14:30

OBJECTIF — Générer, durcir et prouver une suite de tests, avec un mock.

DIRE — « Cinquante minutes, énoncé dans ateliers/atelier-07-tests. La liste des cas d’abord, puis la génération, puis la chasse aux tests qui ne peuvent pas échouer. Ensuite le mock de fetch, la mutation à la main, et la couverture. »

ANIMATION — Points d’étape à 15, 30 et 45 min. Pièges : tests tautologiques ; equal sur objets ; date du jour dans un test. Bloqué sur kanban.js : point de reprise reprises/fin-atelier-06.

TRANSITION — « QCM, et nous attaquons les bonnes pratiques. »`,
  `⏱ 5 min · QCM MODULE 7 (vote oral)

OBJECTIF — Vérifier la lecture critique des tests.

DIRE — « Quatre questions, votez à voix haute. »

TRANSITION — « Module 8 : les bonnes pratiques de vérification. »`,
  `⏱ 1 min · MODULE 8 · 15:15

OBJECTIF — Annoncer le module de vérification, synthèse de toute la formation.

DIRE — « Dernier module : les bonnes pratiques de vérification. Tout ce que nous avons fait depuis hier converge ici : relire, détecter, prouver, et faire de Copilot un membre fiable de la revue de code. »

TRANSITION — « D’abord, pourquoi tant de méfiance ? »`,
  `⏱ 4 min · POURQUOI VÉRIFIER

OBJECTIF — Ancrer la nécessité de vérifier par un chiffre et quatre raisons.

DIRE — « Un chiffre : dans une étude de Veracode publiée en 2025, sur plus de cent modèles et quatre-vingts tâches de code, quarante-cinq pour cent des échantillons générés contenaient une faille de sécurité. Quatre raisons : il vise le plausible ; il ne voit qu’une partie du projet ; ses connaissances ont une date ; il n’exécute rien. Le principe : une suggestion acceptée devient votre code. »

ANIMATION — Si on vous demande la source : Veracode, « 2025 GenAI Code Security Report ».

TRANSITION — « Comment relire efficacement ? Avec une checklist. »`,
  `⏱ 5 min · CHECKLIST (exercice)

OBJECTIF — Donner une checklist de relecture en trois volets et l’appliquer.

DIRE — « Trois colonnes, douze points. Logique : la demande, les cas limites, les erreurs, les fonctions qui existent. Performances : boucles imbriquées, recalculs, Set ou Map, et la question des 50 000 éléments. Sécurité : secrets, injections, dépendances, licences. Dictez-moi une fonction que vous avez générée à l’Atelier 5 : on la passe à la checklist ensemble. »

ANIMATION — Cocher au fil des réponses. Rappeler : chaque doute devient un test.

TRANSITION — « Un type d’erreur mérite une page : les hallucinations. »`,
  `⏱ 2 min · HALLUCINATIONS (rappel du Module 1, aller vite)

OBJECTIF — Faire reconnaître six formes d’hallucination et leur moyen de détection.

DIRE — « Une hallucination, c’est quelque chose d’inventé et présenté avec assurance. L’API inventée : sortBy n’existe pas sur les tableaux. Le paquet fantôme : un nom plausible qui n’existe pas, ou pire, qu’un attaquant a créé pour piéger ceux qui suivent l’IA. L’option imaginaire. La syntaxe périmée. La logique plausible, comme notre année bissextile. Et l’explication assurée : “ce code est sûr”. Pour chacune, un moyen de détection concret. »

TRANSITION — « Côté sécurité, trois réflexes suffisent pour commencer. »`,
  `⏱ 4 min · SÉCURITÉ

OBJECTIF — Installer trois réflexes : secrets, injections, dépendances.

DIRE — « Un : les secrets. Jamais de jeton dans le code ni dans une URL ; une variable d’environnement et un en-tête. Deux : les injections. Ne jamais insérer une entrée utilisateur telle quelle dans du HTML ou une requête SQL : textContent, requêtes paramétrées. Trois : les dépendances. Avant d’installer un paquet proposé, on vérifie qu’il existe et qu’il est maintenu. Et un secret commité est un secret publié : on le révoque immédiatement. »

TRANSITION — « Question fréquente : à qui appartient le code généré ? »`,
  `⏱ 5 min · DROITS D’AUTEUR & PI

OBJECTIF — Donner les repères juridiques essentiels, sans jargon.

DIRE — « Quatre repères. Le code accepté vous engage : GitHub ne revendique pas les suggestions, vous en êtes responsable. Le filtre “code public” : bloquer, ou autoriser avec la référence et la licence du dépôt d’origine. Les licences copyleft comme la GPL : un long bloc recopié peut imposer ses conditions. Et la politique de l’entreprise : en Business et Enterprise, GitHub prévoit une garantie juridique, sous conditions, notamment le filtre activé. Règle pratique : code court et générique, aucun souci ; long bloc spécifique avec un en-tête de licence, on ne l’intègre pas. »

ANIMATION — Je ne suis pas juriste : renvoyer les questions précises vers le service juridique de l’entreprise.

TRANSITION — « Comment tout cela s’organise en équipe ? »`,
  `⏱ 5 min · REVUE D’ÉQUIPE

OBJECTIF — Situer Copilot dans le workflow de revue, sans remplacer l’humain ni la CI.

DIRE — « Six étapes. » → beat 1 « Écrire, avec Copilot, en petits commits. » → beat 2 « Se relire avec la checklist, tests au vert. » → beat 3 « Un second avis : la revue Copilot de votre sélection. » → beat 4 « La pull request : dites ce qui a été généré et comment vous l’avez vérifié. » → beat 5 « La revue humaine, éventuellement précédée d’une revue Copilot sur la PR, avec les offres payantes. » → beat 6 « Et les tests automatiques avant la fusion. Les règles de l’équipe, elles, vont dans le dépôt. »

TRANSITION — « Justement : le fichier d’instructions. »`,
  `⏱ 4 min · FICHIER D’INSTRUCTIONS (démo)

OBJECTIF — Montrer un fichier d’instructions utile et comment vérifier qu’il est lu.

DIRE — « .github/copilot-instructions.md : un fichier Markdown versionné, joint automatiquement aux demandes du chat et des agents. Voici celui de TaskFlow : sept règles, toutes tirées de ces deux jours. Court, concret, vérifiable. Pour vérifier qu’il est lu : sous la réponse du chat, la liste des références le cite. Et /init, dans une session d’agent, en propose un premier jet. Nuance : les suggestions inline, elles, imitent surtout le fichier ouvert. »

ANIMATION — Montrer en direct la référence au fichier sous une réponse du chat.

TRANSITION — « Quinze minutes de pause avant le dernier atelier. »`,
  `⏱ 15 min · PAUSE · 15:45

DIRE — « Dernière pause, quinze minutes. À 16 h 00, l’Atelier 8 : la revue de code finale de TaskFlow. »`,
  `⏱ 30 min · ATELIER 8 (individuel) · 16:00

OBJECTIF — Appliquer la checklist, prouver chaque défaut par un test, livrer avec des règles d’équipe.

DIRE — « Quarante minutes, énoncé dans ateliers/atelier-08-revue. Huit suggestions acceptées trop vite par un collègue. D’abord, relisez sans outil et notez vos soupçons. Puis le second avis de Copilot sur deux d’entre elles. Ensuite, un test qui échoue par défaut, et la correction. Enfin, vos règles d’équipe et le commit final. Préparez deux minutes de restitution. »

ANIMATION — Points d’étape à 10 min (« Combien de défauts trouvés sans outil ? ») et 30 min. Le plus souvent manqué : 07 (dates) et 06 (performance).

TRANSITION — « Place aux restitutions. »`,
  `⏱ 5 min · RESTITUTION (2 volontaires, partage d’écran)

OBJECTIF — Chaque participant présente son travail ; rétroaction collective.

DIRE — « Deux volontaires, deux minutes chacun. Partagez votre écran : le défaut le mieux caché et son test, ce que Copilot a trouvé ou manqué, et votre règle d’équipe préférée. » Après chacun : « Un point fort, une piste. Participant suivant ! »

ANIMATION — Relancer le minuteur à chaque volontaire. Les autres déposent une capture de leur REVUE.md dans le clavardage : le temps gagné sert au Module 9.

TRANSITION — « Un dernier QCM. »`,
  `⏱ 5 min · QCM MODULE 8 (vote oral)

OBJECTIF — Vérifier les réflexes de vérification.

DIRE — « Quatre questions, votez à voix haute. »

TRANSITION — « Dernier module : les agents. »`,
  `⏱ 1 min · MODULE 9 · 16:40

OBJECTIF — Ouvrir le dernier module : passer de « un assistant » à « une équipe d’assistants », sans perdre le contrôle.

DIRE — « Dernier module. Depuis le Module 1, vous savez ce qu’est un agent : un modèle, des outils, une boucle. Dans Copilot, vous pouvez créer vos propres agents, leur donner un rôle précis, des outils limités, des savoir-faire, et les faire travailler ensemble. On voit comment, ce que ça promet, et où ça peut déraper. Puis vous montez votre propre équipe. »

TRANSITION — « Un agent personnalisé, concrètement, c’est un fichier. »`,
  `⏱ 2 min · ANATOMIE D’UN AGENT (5 temps + clics)

OBJECTIF — Lire un fichier .agent.md : chaque champ a un rôle, et les outils sont une décision de sécurité.

DIRE — « Voici le Testeur QA que vous allez créer. En haut, un en-tête : son nom, celui de la liste. » → beat 1 « La description, obligatoire : ce qu’il fait et ce qu’il ne fait jamais ; un chef d’orchestre la lit pour décider à qui confier une tâche. » → beat 2 « Les outils : c’est son permis. Sans edit, il ne modifie rien ; sans execute, pas de terminal. » → beat 3 « Ses skills : la procédure de tests du projet. » → beat 4 « Les relais : un bouton pour passer la main au Développeur, avec une demande pré-remplie. » → beat 5 « Et le corps : son rôle et ses règles, en Markdown. »

ANIMATION — Au beat 2, cliquer web : la jauge monte et l’alerte injection de prompt apparaît. « Terminal plus Internet : une page piégée peut lui souffler une commande. Le minimum d’outils, toujours. » Décocher web.

TRANSITION — « Comment on le crée ? Quatre gestes. »`,
  `⏱ 1 min · CRÉER UN AGENT (4 temps)

OBJECTIF — Montrer le chemin exact dans VS Code et l’emplacement du fichier.

DIRE — → beat 1 « Ctrl+Maj+P, “Chat: Open Customizations”. » → beat 2 « Onglet Agents, New Agent, puis Workspace : le fichier ira dans le dépôt et toute l’équipe l’aura au prochain git pull. User, c’est pour vous seul, dans tous vos projets. » → beat 3 « Un nom, et VS Code crée .github/agents/testeur-qa.agent.md. » → beat 4 « Il apparaît dans la liste des agents du chat, à côté d’Ask, Plan et Agent. Et quand il a fini, un bouton de relais propose de passer au suivant. »

ANIMATION — Si le temps le permet, le faire en direct sur le dépôt (30 s). Les noms de menus peuvent légèrement changer d’une version à l’autre : la commande « Chat: Open Customizations » est le point d’entrée stable.

TRANSITION — « Un agent a un rôle. Une skill, c’est un savoir-faire. »`,
  `⏱ 2 min · SKILLS (4 temps + clics)

OBJECTIF — Comprendre le chargement progressif : la description décide, le reste n’entre que si besoin.

DIRE — « Une skill, c’est un dossier dans .github/skills avec un SKILL.md : un nom, une description, des instructions, et éventuellement des fichiers, ici un modèle de test. Copilot lit en permanence les noms et descriptions de toutes les skills, c’est très léger. » → beat 1 « Je demande des tests : la skill tests-node se charge, et même son fichier modèle. » → beat 2 « J’implémente dans src : c’est conventions-taskflow qui se charge. » → beat 3 « Je renomme une variable : rien ne se charge, le contexte reste léger. » → beat 4 « Et on peut l’appeler à la main, avec une barre oblique. »

ANIMATION — Cliquer les demandes pour montrer la jauge. Insister : « Si la description ne contient pas les mots de vos demandes, la skill dort. » Les tokens sont des ordres de grandeur.

TRANSITION — « Instructions, prompts, agents, skills : on s’y perd. Petit exercice. »`,
  `⏱ 2 min · QUEL FICHIER ? (exercice oral, 4 temps)

OBJECTIF — Distinguer les quatre fichiers de personnalisation.

DIRE — « Quatre besoins. Votez à voix haute : instructions, prompt, agent ou skill ? » → beat 1 « Une règle qui vaut toujours : le fichier d’instructions, chargé à chaque demande. » → beat 2 « Une tâche répétée que vous lancez : un fichier prompt, appelé avec une barre oblique. » → beat 3 « Un rôle avec des outils restreints : un agent. » → beat 4 « Une procédure avec un fichier modèle, utile seulement quand on teste : une skill. »

ANIMATION — Laisser 5 secondes de vote au micro avant chaque clic. Conclure avec la phrase du bas : ils se combinent.

TRANSITION — « Maintenant, faisons travailler plusieurs agents ensemble. »`,
  `⏱ 3 min · SIMULATION D’ORCHESTRATION (démo, 3 temps)

OBJECTIF — Rendre visibles quatre façons d’orchestrer des agents, le potentiel et la place de l’humain.

DIRE — « Sept rôles : vous, un chef d’orchestre, et six agents spécialisés. Scénario 1, une nouvelle fonctionnalité : chacun passe le relais au suivant. Regardez l’étape 2 : vous validez la story. Et l’étape 6 : le Testeur trouve un bug, retour au Développeur. » → beat 1 « Scénario 2 : la revue en parallèle. Le chef d’orchestre lance trois sous-agents en même temps, chacun dans son propre contexte, puis fait la synthèse. » → beat 2 « Scénario 3 : un bug en production. Le Testeur commence par un test qui reproduit le bug. Boucle courte, PR de six lignes. » → beat 3 « Scénario 4 : le garde-fou. La Sécurité bloque un jeton en clair, et finit par une question que seul un humain peut trancher. »

ANIMATION — Chaque clic lance un scénario en lecture automatique ; Pause et Pas permettent de commenter une étape. Montrer les compteurs : agents mobilisés, validations humaines, crédits (illustratifs). Les deux relais avec validation humaine sont marqués d’une icône verte.

TRANSITION — « Pourquoi s’embêter avec une équipe ? »`,
  `⏱ 1 min · LE POTENTIEL (2 temps)

OBJECTIF — Situer le gain réel : découpage, parallélisme, contrôle croisé ; pas une intelligence supérieure.

DIRE — « Un agent seul enchaîne tout dans un seul contexte, qui grossit et se brouille. » → beat 1 « Une équipe : chaque rôle a un contexte court, et plusieurs tâches avancent en parallèle. Les losanges verts, ce sont vos validations : la story au début, la PR à la fin. » → beat 2 « Quatre gains : spécialisation, parallélisme, contrôle croisé, traçabilité. Les durées sont illustratives. »

TRANSITION — « Mais plus d’autonomie, c’est aussi plus de risques. »`,
  `⏱ 2 min · POINTS D’ATTENTION (6 temps, cartes à retourner)

OBJECTIF — Lister les risques propres à l’orchestration et leurs parades.

DIRE — → beat 1 « La facture : chaque agent consomme des crédits ; une boucle mal cadrée coûte cher. » → beat 2 « L’erreur en cascade : si la story est fausse, toute l’équipe se trompe avec aplomb. » → beat 3 « La complaisance : même modèle, mêmes angles morts. Les tests d’acceptation, c’est vous. » → beat 4 « Trop de pouvoir : terminal, Internet et secrets ensemble, c’est la porte ouverte à l’injection de prompt. » → beat 5 « Les skills de tiers peuvent contenir des scripts : relisez avant d’installer. » → beat 6 « L’humain hors boucle : une PR géante ne sera jamais vraiment relue. »

TRANSITION — « À vous de monter votre équipe. »`,
  `⏱ 30 min · ATELIER 9 (individuel) · 16:50

OBJECTIF — Créer 3 agents et 2 skills, et leur faire livrer une fonctionnalité réelle de TaskFlow, en gardant la main.

DIRE — « Dans ateliers/atelier-09-agents, des modèles avec des TODO. Copiez le dossier .github du modèle à la racine. Complétez d’abord les deux skills, puis les trois agents, avec le minimum d’outils. Ensuite, l’Analyste PO reçoit le brief qui est en tête de src/echeances.js. Vous validez sa story, puis relais au Développeur, puis au Testeur QA. Le test d’acceptation test/echeances.test.js est votre garde-fou : aucun agent n’y touche. »

ANIMATION — Lancer le minuteur 30 min. Point d’étape à 12 min : « Vos trois agents sont dans la liste ? » À 24 min : « test:atelier9 au vert ? » Pièges fréquents : un Développeur qui modifie le test d’acceptation (le refuser, renforcer sa règle) ; une skill qui ne se charge pas (description sans les bons mots, ou nom de dossier différent du name) ; le bouton de relais absent (nom de l’agent cible mal orthographié). Corrigés complets dans corriges/ateliers/atelier-09-agents/ : les coller dans le clavardage si quelqu’un est bloqué plus de 10 minutes.

TRANSITION — « Deux volontaires : quel relais avez-vous dû corriger ? Puis on conclut. »`,
  `⏱ 3 min · LES 10 CLÉS · 17:20

OBJECTIF — Récapituler la formation en dix réflexes.

DIRE — « Dix clés, une par ligne. Si vous n’en gardez qu’une : Copilot prédit, il ne vérifie pas ; la preuve, ce sont vos tests. Tout le reste en découle : le contexte, le commentaire, la signature d’abord, les six oublis, refactoring et correction séparés, des tests qui peuvent échouer, la checklist avant Tab, et des règles d’équipe dans le dépôt. »

TRANSITION — « Mesurons le chemin parcouru. »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT FINAL

OBJECTIF — Mesurer la progression (exigence du dispositif d’évaluation).

DIRE — « Les mêmes huit compétences qu’hier matin. Comptez pour vous, puis comparez avec votre score de départ noté dans le journal. Au micro : de combien de points avez-vous progressé ? »

ANIMATION — Cocher à l’écran un exemple puis décocher. Relever les compétences encore fragiles : les citer dans le plan d’action.

TRANSITION — « Comment ne pas tout oublier d’ici lundi ? Un plan. »`,
  `⏱ 2 min · PLAN D’ACTION

OBJECTIF — Transformer la formation en actions datées.

DIRE — « Trois horizons. Lundi : vos réglages et vos gestes, et une première tâche répétitive confiée à Copilot. Semaine deux : des tests générés sur une fonction importante de votre projet, vérifiés par une mutation. Fin du mois : un fichier d’instructions proposé à votre équipe. Et le bon indicateur : combien de suggestions vous avez refusées à bon escient. »

TRANSITION — « Les ressources pour continuer. »`,
  `⏱ 2 min · RESSOURCES

OBJECTIF — Donner les ressources de référence et la suite de parcours.

DIRE — « Votre kit d’ateliers reste à vous : le dépôt et le guide. La documentation de VS Code et de GitHub, le journal des nouveautés, et l’OWASP pour la sécurité. Et si vous voulez aller plus loin : la formation niveau avancé, avec les modes Plan et Agent, les tests d’intégration et l’audit de sécurité. »

TRANSITION — « Votre avis, maintenant. »`,
  `⏱ 5 min · ÉVALUATION (minuteur 5 min)

OBJECTIF — Recueillir la satisfaction à chaud et le mot de la fin.

DIRE — « Le questionnaire est dans le clavardage : cinq minutes, maintenant. Dans quelques semaines, vous recevrez un questionnaire à froid. Puis, une phrase chacun au micro : ce que vous ferez différemment lundi. »

ANIMATION — Coller le lien du questionnaire. Lancer le minuteur. Tour de parole final dans l’ordre de la liste.

TRANSITION — « Merci à toutes et à tous. »`,
  `⏱ 1 min · MERCI

DIRE — « Merci pour votre énergie pendant ces deux jours. Copilot propose, vous disposez, et vous prouvez. Bon code à toutes et à tous, et à bientôt ! »`,
];
