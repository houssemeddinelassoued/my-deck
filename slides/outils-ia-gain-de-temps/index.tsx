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
const FONT_LINK_ID = 'osd-webfont-outils-ia-gain-de-temps';
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
const SLIDE_ID = 'outils-ia-gain-de-temps';
const P = 'o20'; // CSS class prefix, unique per deck
const COURSE = 'Les 20 outils IA qui font gagner du temps';
const AUTHOR = 'Houssem Eddine LASSOUED';

// Module numbers: 0 = ouverture, 1–3 = matin, 4–8 = après-midi, 9 = clôture.
const MOD_TITLES: Record<number, string> = {
  1: 'Découvrir l’IA et ses opportunités',
  2: 'Les fondamentaux du prompting',
  3: 'Les assistants IA',
  4: 'Rechercher & exploiter l’information',
  5: 'Rédiger plus vite, mieux',
  6: 'Réunions & organisation',
  7: 'Images, vidéos & contenus',
  8: 'Automatisation & bonnes pratiques',
  9: 'Bilan & clôture',
};
const DAY1 = [1, 2, 3];
const DAY2 = [4, 5, 6, 7, 8];

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
  mic: (
    <>
      <rect x={9} y={2.5} width={6} height={12} rx={3} />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3.5M8.5 21.5h7" />
    </>
  ),
  video: (
    <>
      <rect x={2.5} y={6} width={13.5} height={12} rx={2.5} />
      <path d="M16 10.5l5.5-3.5v10L16 13.5" />
    </>
  ),
  image: (
    <>
      <rect x={3} y={4} width={18} height={16} rx={2.5} />
      <circle cx={8.5} cy={9.5} r={1.8} />
      <path d="M21 16l-5-5-9 9" />
    </>
  ),
  translate: (
    <>
      <path d="M3 5.5h10M8 3.5v2M5 5.5c.8 3.4 3.2 6 6.5 7.5M11 5.5c-.8 3.6-3.5 6.6-7.5 8" />
      <path d="M12.5 21l4-9.5 4 9.5M14 17.5h5" />
    </>
  ),
  slides: (
    <>
      <rect x={2.5} y={3.5} width={19} height={13} rx={2} />
      <path d="M12 16.5v4M8 20.5h8M7 12.5l3-3 2.5 2 4-4" />
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
      <span style={{ fontWeight: 800, fontSize: size, letterSpacing: '0.04em', color, whiteSpace: 'nowrap' }}>20 OUTILS IA</span>
      <span style={{ fontWeight: 600, fontSize: size * 0.62, letterSpacing: '0.16em', color: color === C.navy ? C.violet : color, whiteSpace: 'nowrap' }}>QUI FONT GAGNER DU TEMPS</span>
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
  outil: { label: 'Outil', tone: 'blue' as Tone, icon: 'tool' as IconName },
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

const ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
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

// Matin : M1–M3 · Après-midi : M4–M8.
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
    <ProgSq n={8} mod={mod} />
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

// ─── The tools of the programme (n = number in the official programme) ──────
// Monogram tiles in each tool's own colour — no logos, just recognisable cues.
type ToolRec = { name: string; short?: string; by: string; mono: string; c: string; url: string; n: number[] };
const TOOLS = {
  chatgpt: { name: 'ChatGPT', by: 'OpenAI', mono: 'GPT', c: '#10A37F', url: 'chatgpt.com', n: [1] },
  copilot: { name: 'Microsoft Copilot', short: 'Copilot', by: 'Microsoft', mono: 'Co', c: '#0F6CBD', url: 'copilot.microsoft.com', n: [2] },
  gemini: { name: 'Google Gemini', short: 'Gemini', by: 'Google', mono: 'Ge', c: '#4C6EF5', url: 'gemini.google.com', n: [3] },
  claude: { name: 'Claude', by: 'Anthropic', mono: 'Cl', c: '#C96442', url: 'claude.ai', n: [4] },
  perplexity: { name: 'Perplexity', by: 'Perplexity AI', mono: 'Px', c: '#1F7A7A', url: 'perplexity.ai', n: [5, 6] },
  notebooklm: { name: 'NotebookLM', by: 'Google', mono: 'NB', c: '#4B3FB8', url: 'notebooklm.google.com', n: [7] },
  elicit: { name: 'Elicit', by: 'Elicit', mono: 'El', c: '#2F6F4F', url: 'elicit.com', n: [8] },
  consensus: { name: 'Consensus', by: 'Consensus', mono: 'Cs', c: '#D97706', url: 'consensus.app', n: [9] },
  grammarly: { name: 'Grammarly', by: 'Grammarly', mono: 'Gr', c: '#11A683', url: 'grammarly.com', n: [10] },
  deepl: { name: 'DeepL / DeepL Write', short: 'DeepL', by: 'DeepL', mono: 'DL', c: '#0F2B46', url: 'deepl.com', n: [11] },
  canva: { name: 'Canva AI', short: 'Canva', by: 'Canva', mono: 'Ca', c: '#7D2AE8', url: 'canva.com', n: [12, 18] },
  gamma: { name: 'Gamma', by: 'Gamma', mono: 'Ga', c: '#B83280', url: 'gamma.app', n: [13] },
  otter: { name: 'Otter.ai', short: 'Otter', by: 'Otter.ai', mono: 'Ot', c: '#2563EB', url: 'otter.ai', n: [14] },
  fireflies: { name: 'Fireflies.ai', short: 'Fireflies', by: 'Fireflies.ai', mono: 'Ff', c: '#E8590C', url: 'fireflies.ai', n: [15] },
  notion: { name: 'Notion AI', short: 'Notion', by: 'Notion', mono: 'N', c: '#191919', url: 'notion.so', n: [16] },
  firefly: { name: 'Adobe Firefly', short: 'Firefly', by: 'Adobe', mono: 'Fi', c: '#D7261E', url: 'firefly.adobe.com', n: [17] },
  runway: { name: 'Runway', by: 'Runway', mono: 'Rw', c: '#3F3F46', url: 'runwayml.com', n: [19] },
  capcut: { name: 'CapCut AI', short: 'CapCut', by: 'CapCut', mono: 'CC', c: '#0F172A', url: 'capcut.com', n: [20] },
  zapier: { name: 'Zapier', by: 'Zapier', mono: 'Za', c: '#FF4F00', url: 'zapier.com', n: [] },
  make: { name: 'Make', by: 'Make', mono: 'Mk', c: '#6D00CC', url: 'make.com', n: [] },
  powerautomate: { name: 'Power Automate', by: 'Microsoft', mono: 'PA', c: '#0066FF', url: 'make.powerautomate.com', n: [] },
} satisfies Record<string, ToolRec>;
type ToolId = keyof typeof TOOLS;
const tool = (id: ToolId): ToolRec => TOOLS[id];

const ToolTile = ({ id, size = 56, cls, style }: { id: ToolId; size?: number; cls?: string; style?: CSSProperties }) => {
  const t = tool(id);
  return (
    <span
      className={cls}
      aria-label={t.name}
      style={{
        flex: 'none',
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.26),
        background: t.c,
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: display,
        fontWeight: 800,
        fontSize: Math.round(size * (t.mono.length > 2 ? 0.32 : 0.4)),
        letterSpacing: '-0.02em',
        lineHeight: 1,
        boxShadow: '0 6px 14px -8px rgba(11,31,92,.55)',
        ...style,
      }}
    >
      {t.mono}
    </span>
  );
};

// Tile + name, inline.
const ToolChip = ({ id, size = 22, full = false, cls, style }: { id: ToolId; size?: number; full?: boolean; cls?: string; style?: CSSProperties }) => {
  const t = tool(id);
  return (
    <span className={cls} style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(size * 0.45), whiteSpace: 'nowrap', ...style }}>
      <ToolTile id={id} size={Math.round(size * 1.6)} />
      <span style={{ fontWeight: 700, fontSize: size, color: C.ink }}>{full ? t.name : (t.short ?? t.name)}</span>
    </span>
  );
};

// Mock application window in the tool's colour.
const ToolWindow = ({
  id,
  title,
  children,
  cls,
  style,
  pad: p = 24,
}: {
  id: ToolId;
  title?: ReactNode;
  children: ReactNode;
  cls?: string;
  style?: CSSProperties;
  pad?: number;
}) => {
  const t = tool(id);
  return (
    <div className={cls} style={{ boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, overflow: 'hidden', display: 'flex', flexDirection: 'column', ...style }}>
      <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', background: T.grey.bg, borderBottom: `1.5px solid ${C.rule}` }}>
        <ToolTile id={id} size={30} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 19, color: C.ink, whiteSpace: 'nowrap' }}>{t.short ?? t.name}</span>
        {title ? <span style={{ fontSize: 18, color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>· {title}</span> : null}
        <span style={{ marginLeft: 'auto', fontFamily: mono, fontSize: 16, color: C.faint }}>{t.url}</span>
      </div>
      <div style={{ flex: 1, padding: p, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>{children}</div>
    </div>
  );
};

// Prompt line inside a ToolWindow (what the user types).
const PromptBox = ({ children, size = 21, cls, style }: { children: ReactNode; size?: number; cls?: string; style?: CSSProperties }) => (
  <div
    className={cls}
    style={{
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start',
      background: T.blue.bg,
      borderRadius: 14,
      padding: '12px 18px',
      fontSize: size,
      lineHeight: 1.42,
      color: C.ink,
      ...style,
    }}
  >
    <Icon name="user" size={size + 5} color={T.blue.fg} style={{ marginTop: 1 }} />
    <span>{children}</span>
  </div>
);

// AI answer inside a ToolWindow; three "typing" dots disappear on the reveal beat.
const AnswerBox = ({ id, n = 1, children, size = 21, style }: { id: ToolId; n?: number; children: ReactNode; size?: number; style?: CSSProperties }) => (
  <div style={{ position: 'relative', flex: 1, minHeight: 0, ...style }}>
    <div className={b.off(n)} style={{ position: 'absolute', left: 0, top: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
      <ToolTile id={id} size={34} />
      <span className={A.blink} style={{ fontSize: 34, letterSpacing: 4, color: C.faint, lineHeight: 1 }}>
        •••
      </span>
    </div>
    <div className={b.on(n)} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', fontSize: size, lineHeight: 1.45, color: C.ink }}>
      <ToolTile id={id} size={34} />
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  </div>
);

type Feat = [IconName, ReactNode, ReactNode];

// Standard page for one tool: what it does best (left), a concrete example
// (right, answer revealed on →), vigilance + tip (bottom).
const ToolPage = ({
  mod,
  id,
  tagline,
  feats,
  exTitle,
  prompt,
  answer,
  watch,
  tip,
  tone = 'blue',
}: {
  mod: number;
  id: ToolId;
  tagline: ReactNode;
  feats: Feat[];
  exTitle: ReactNode;
  prompt: ReactNode;
  answer: ReactNode;
  watch: ReactNode;
  tip: ReactNode;
  tone?: Tone;
}) => {
  const t = tool(id);
  return (
    <Frame mod={mod} kind="outil" beats={2}>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 100, right: 120, display: 'flex', alignItems: 'center', gap: 26 }}>
        <ToolTile id={id} size={96} cls={A.pop} />
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {t.n.map((n) => (
              <Tag key={n} tone="violet" size={18}>
                Outil n° {n}
              </Tag>
            ))}
            <span style={{ fontFamily: mono, fontSize: 19, color: C.muted }}>
              {t.by} · {t.url}
            </span>
          </div>
          <h2 style={{ margin: '8px 0 0', fontFamily: display, fontWeight: 800, fontSize: 52, lineHeight: 1.1, color: C.navy, whiteSpace: 'nowrap' }}>
            {t.name} <span style={{ fontWeight: 700, fontSize: 36, color: STRONG[tone] }}>· {tagline}</span>
          </h2>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 250, width: 760, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Eyebrow size={19} c={C.muted} cls={A.fade}>
          Ce qu’il fait de mieux
        </Eyebrow>
        {feats.map(([icon, title, text], i) => (
          <div
            key={i}
            className={A.left}
            style={{ display: 'flex', gap: 18, alignItems: 'flex-start', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '14px 20px', ...dl(150 + i * 110) }}
          >
            <IconTile name={icon} tone={tone} size={50} />
            <div>
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: 23, color: C.ink, lineHeight: 1.25 }}>{title}</div>
              <div style={{ marginTop: 3, fontSize: 20, lineHeight: 1.38, color: C.soft }}>{text}</div>
            </div>
          </div>
        ))}
      </div>
      <ToolWindow id={id} title={exTitle} cls={A.right} style={{ position: 'absolute', left: 930, top: 250, width: 870, height: 500, ...dl(250) }}>
        <PromptBox>{prompt}</PromptBox>
        <AnswerBox id={id}>{answer}</AnswerBox>
      </ToolWindow>
      <div className={b.on(2)} style={{ position: 'absolute', left: 930, top: 776, width: 870 }}>
        <Callout title="Vigilance" tone="coral" icon="alert" size={21}>
          {watch}
        </Callout>
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 830, width: 760, display: 'flex', gap: 14, alignItems: 'flex-start', fontSize: 21, lineHeight: 1.42, color: C.soft, ...dl(800) }}>
        <Icon name="bulb" size={28} color={C.violet} />
        <span>
          <strong style={{ color: C.violet }}>Astuce · </strong>
          {tip}
        </span>
      </div>
    </Frame>
  );
};

// ─── Atelier briefing page ──────────────────────────────────────────────────
const DEFIS = {
  taches: { label: 'Mes tâches chronophages', icon: 'clock' as IconName, tone: 'blue' as Tone, aide: 'Fréquente, répétitive, peu risquée : c’est là que l’IA rapporte le plus.' },
  prompt: { label: 'Prompt structuré', icon: 'chat' as IconName, tone: 'violet' as Tone, aide: 'Contexte · objectif · rôle · contraintes · format : les cinq briques d’un bon prompt.' },
  comparatif: { label: 'Banc d’essai', icon: 'scale' as IconName, tone: 'teal' as Tone, aide: 'Même prompt, plusieurs assistants : on compare sur des critères, pas sur une impression.' },
  recherche: { label: 'Recherche vérifiée', icon: 'search' as IconName, tone: 'navy' as Tone, aide: 'Rechercher → vérifier → synthétiser : une réponse IA n’est pas une information vérifiée.' },
  redaction: { label: 'Circuit rédaction', icon: 'pen' as IconName, tone: 'green' as Tone, aide: 'Notes → email → texte poli → traduction → slides → visuel : un outil par étape.' },
  reunion: { label: 'Après-réunion', icon: 'mic' as IconName, tone: 'yellow' as Tone, aide: 'Transcription → synthèse → décisions → tâches → email de suivi.' },
  campagne: { label: 'Mini-campagne', icon: 'image' as IconName, tone: 'pink' as Tone, aide: 'Un seul brief, cinq formats : texte, visuel, présentation, vidéo courte.' },
  plan: { label: 'Mon mini-plan IA', icon: 'flag' as IconName, tone: 'coral' as Tone, aide: 'Tâche → outil IA → méthode → résultat attendu → contrôle humain.' },
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
  tools = [],
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
  tools?: ToolId[];
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
    {tools.length ? (
      <div className={A.fade} style={{ position: 'absolute', left: 120, bottom: 84, display: 'flex', alignItems: 'center', gap: 18, fontSize: 19, color: C.muted, ...dl(500) }}>
        <Icon name="tool" size={22} color={C.electric} />
        <span style={{ fontWeight: 600 }}>Outils de l’atelier :</span>
        {tools.map((t) => (
          <ToolChip key={t} id={t} size={19} />
        ))}
      </div>
    ) : null}
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
              <strong style={{ color: T.coral.fg }}>✗ Pas tout à fait. </strong>Relisez la question, éliminez les réponses trop absolues, et réessayez.
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

// The 20 numbered slots of the programme (Perplexity and Canva AI appear twice).
const PROG20: ToolId[] = [
  'chatgpt', 'copilot', 'gemini', 'claude', 'perplexity',
  'perplexity', 'notebooklm', 'elicit', 'consensus', 'grammarly',
  'deepl', 'canva', 'gamma', 'otter', 'fireflies',
  'notion', 'firefly', 'canva', 'runway', 'capcut',
];

const O_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={110} r={46} cls={A.fade} />
    <Outline x={-40} y={760} w={120} h={360} r={40} color="#AEB9E6" />
    <div style={{ position: 'absolute', left: 390, top: 130, width: 940 }}>
      <div className={A.in} style={{ display: 'flex', gap: 12 }}>
        <Tag tone="violet" size={22}>
          <Icon name="calendar" size={22} /> Formation · 1 jour · 7 h
        </Tag>
        <Tag tone="blue" size={22}>
          <Icon name="smile" size={22} /> Débutant · aucun prérequis
        </Tag>
      </div>
      <h1
        className={A.in}
        style={{ margin: '34px 0 0', fontFamily: display, fontWeight: 800, fontSize: 84, lineHeight: 1.06, letterSpacing: '-0.02em', color: C.navy, ...dl(120) }}
      >
        Les 20 outils IA
        <br />
        <span style={{ color: C.plum }}>
          qui font gagner
          <br />
          du temps
        </span>
      </h1>
      <p className={A.in} style={{ margin: '26px 0 0', fontSize: 27, lineHeight: 1.45, color: C.soft, maxWidth: 920, ...dl(240) }}>
        Rédiger, rechercher, analyser, résumer, créer, automatiser : apprendre à confier à l’IA{' '}
        <strong style={{ color: C.navy }}>ce qui vous prend du temps sans vous apporter de valeur</strong>.
      </p>
    </div>
    <Portrait w={160} x={390} y={720} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 610, top: 740, ...dl(300) }}>
      <Eyebrow c={C.muted} size={20}>
        Formateur
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>IA appliquée aux métiers · productivité augmentée</div>
    </div>
    <div style={{ position: 'absolute', left: 1390, top: 190, width: 420, display: 'grid', gridTemplateColumns: 'repeat(4, 96px)', gap: 12 }}>
      {PROG20.map((id, i) => (
        <div key={i} className={A.pop} style={{ position: 'relative', ...dl(400 + i * 55) }}>
          <ToolTile id={id} size={96} />
          <span
            style={{
              position: 'absolute',
              right: -6,
              top: -6,
              minWidth: 30,
              height: 30,
              borderRadius: 99,
              background: '#fff',
              boxShadow: SHADOW_SM,
              fontFamily: display,
              fontWeight: 800,
              fontSize: 15,
              color: C.navy,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {i + 1}
          </span>
        </div>
      ))}
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 1390, top: 760, width: 420, fontSize: 20, lineHeight: 1.45, color: C.muted, ...dl(1700) }}>
      + Zapier, Make et Power Automate pour découvrir l’automatisation.
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
    <Title>Bienvenue ! Une journée pour reprendre du temps</Title>
    <Lede>Pas de jargon, pas de code : des outils concrets, testés ensemble, sur des tâches de votre quotidien.</Lede>
    <Portrait w={230} x={130} y={300} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 130, top: 615, width: 300, ...dl(200) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy, lineHeight: 1.2 }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 22, color: C.soft, lineHeight: 1.4 }}>Votre formateur pour la journée</div>
    </div>
    <div style={{ position: 'absolute', left: 520, top: 300, width: 1280, display: 'flex', gap: 26 }}>
      <OPromise value={<CountUp to={7} suffix=" h" />} label="de formation, dont plus de la moitié en pratique sur les outils" tone="blue" d={150} />
      <OPromise value={<CountUp to={20} />} label="outils IA présentés, classés par usage : écrire, chercher, résumer, créer…" tone="violet" d={280} />
      <OPromise value={<CountUp to={8} />} label="ateliers : vous repartez avec des prompts, des modèles et un plan d’action" tone="green" d={410} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 520, top: 640, width: 1280, ...dl(600) }}>
      <Callout title="Notre contrat" tone="blue" icon="hand">
        Aucune question n’est naïve, aucun outil n’est imposé. Je montre, <strong>vous testez sur vos propres cas</strong>, et
        chacun garde les outils qui lui servent vraiment.
      </Callout>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 520, top: 860, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.muted, ...dl(800) }}>
      <Icon name="bulb" size={26} color={C.violet} />
      Fil conducteur de la journée : « L’IA propose, vous disposez. »
    </div>
  </Frame>
);

// ─── Tour de table ──────────────────────────────────────────────────────────
const O_Poll: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Tour de table : d’où partez-vous ?</Title>
    <Lede>Main levée : cliquez une ligne par vote. Le « − » retire un vote.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800 }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Aujourd’hui, j’utilise l’IA…
      </Eyebrow>
      <Poll>
        <PollRow id="o-u1" label="Jamais, je découvre" tone="grey" icon="smile" />
        <PollRow id="o-u2" label="De temps en temps, pour essayer" tone="teal" icon="sparkles" />
        <PollRow id="o-u3" label="Chaque semaine" tone="blue" icon="calendar" />
        <PollRow id="o-u4" label="Tous les jours, pour mon travail" tone="green" icon="rocket" />
      </Poll>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 980, top: 270, width: 820, ...dl(200) }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Ce qui me prend le plus de temps
      </Eyebrow>
      <Poll>
        <PollRow id="o-t1" label="Mes emails" tone="blue" icon="mail" />
        <PollRow id="o-t2" label="Réunions et comptes rendus" tone="yellow" icon="mic" />
        <PollRow id="o-t3" label="Chercher et vérifier des informations" tone="navy" icon="search" />
        <PollRow id="o-t4" label="Documents, rapports, présentations" tone="green" icon="doc" />
        <PollRow id="o-t5" label="Visuels, vidéos, réseaux sociaux" tone="pink" icon="image" />
      </Poll>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(500) }}>
      Le second vote nous dit où mettre l’accent cet après-midi.
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
    <Lede>Neuf objectifs pédagogiques, regroupés en quatre gestes professionnels.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 24 }}>
      <OGoal icon="search" tone="blue" title="Comprendre" d={100}>
        <Bullet size={22}>Les principaux usages de l’IA générative au travail</Bullet>
        <Bullet size={22}>Repérer les tâches de votre quotidien que l’IA peut alléger</Bullet>
      </OGoal>
      <OGoal icon="chat" tone="violet" title="Demander" d={220}>
        <Bullet size={22} tone="violet">Maîtriser les fondamentaux du prompting</Bullet>
        <Bullet size={22} tone="violet">Rédiger des demandes efficaces pour de meilleurs résultats</Bullet>
      </OGoal>
      <OGoal icon="rocket" tone="green" title="Produire" d={340}>
        <Bullet size={22} tone="green">Utiliser 20 outils IA adaptés à vos besoins</Bullet>
        <Bullet size={22} tone="green">Rédiger, rechercher, analyser, synthétiser, créer</Bullet>
        <Bullet size={22} tone="green">Gagner du temps sur emails, documents, réunions, présentations</Bullet>
        <Bullet size={22} tone="green">Découvrir ce que l’on peut automatiser</Bullet>
      </OGoal>
      <OGoal icon="shieldCheck" tone="coral" title="Encadrer" d={460}>
        <Bullet size={22} tone="coral">Utiliser l’IA de manière responsable et sécurisée</Bullet>
        <Bullet size={22} tone="coral">Garder le contrôle humain sur ce qui compte</Bullet>
      </OGoal>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(800) }}>
      <Icon name="checkCircle" size={24} color={C.green} />
      Évaluation continue : un quiz par module, huit ateliers, un mini-plan d’action personnel, auto-positionnement début / fin.
    </div>
  </Frame>
);

// ─── Programme ──────────────────────────────────────────────────────────────
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>{children}</div>
  </div>
);

const O_Programme: Page = () => (
  <Frame mod={0}>
    <Title>Le programme de la journée</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'flex', gap: 50 }}>
      <OHalf icon="bulb" tone="violet" title="Matin · Comprendre et demander" sub="Les bases qui servent à tous les outils" d={0}>
        <OSlot t="9:00" title="Ouverture · vos attentes" tone="grey" d={150} />
        <OSlot t="9:20" mod="M1" title="Découvrir l’IA et ses opportunités" sub="Usages, limites, tâches chronophages · atelier 1" tone="blue" d={230} />
        <OSlot t="10:15" title="Pause" tone="grey" d={290} />
        <OSlot t="10:30" mod="M2" title="Les fondamentaux du prompting" sub="Les 5 briques d’un bon prompt · atelier 2" tone="violet" d={350} />
        <OSlot t="11:20" mod="M3" title="Les assistants IA" sub="ChatGPT, Copilot, Gemini, Claude, Perplexity · atelier 3" tone="teal" d={410} />
        <OSlot t="12:30" title="Déjeuner" tone="grey" d={470} />
      </OHalf>
      <OHalf icon="rocket" tone="green" title="Après-midi · Produire" sub="Un outil pour chaque tâche" d={200}>
        <OSlot t="13:30" mod="M4" title="Rechercher et exploiter l’information" sub="Perplexity, NotebookLM, Elicit, Consensus · cas" tone="navy" d={350} />
        <OSlot t="14:15" mod="M5" title="Rédiger plus vite, mieux" sub="Grammarly, DeepL, Canva AI, Gamma · ateliers" tone="green" d={410} />
        <OSlot t="15:05" mod="M6" title="Réunions et organisation" sub="Otter, Fireflies, Notion AI · cas · pause 15:45" tone="yellow" d={470} />
        <OSlot t="16:00" mod="M7" title="Images, vidéos et contenus" sub="Firefly, Canva AI, Runway, CapCut · atelier" tone="pink" d={530} />
        <OSlot t="16:40" mod="M8" title="Automatisation et bonnes pratiques" sub="Zapier, Make, Power Automate · atelier final" tone="coral" d={590} />
        <OSlot t="17:20" title="Bilan et clôture" tone="grey" d={650} />
      </OHalf>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 920, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(1000) }}>
      <Icon name="map" size={24} color={C.electric} />
      Le bandeau en haut à droite indique toujours où nous en sommes : M1 → M3 le matin, M4 → M8 l’après-midi.
    </div>
  </Frame>
);

// ─── La boîte à outils ──────────────────────────────────────────────────────
const OFamily = ({ icon, tone, title, mod, ids, d }: { icon: IconName; tone: Tone; title: string; mod: string; ids: ToolId[]; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 28px', minHeight: 250, boxSizing: 'border-box', borderLeft: `8px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={46} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.navy }}>{title}</div>
      <Tag tone={tone} size={17} style={{ marginLeft: 'auto' }}>
        {mod}
      </Tag>
    </div>
    <div style={{ marginTop: 22, display: 'flex', flexWrap: 'wrap', gap: '18px 28px' }}>
      {ids.map((id, i) => (
        <ToolChip key={id} id={id} size={25} cls={A.pop} style={dl(d + 250 + i * 90)} />
      ))}
    </div>
  </div>
);

const O_Toolbox: Page = () => (
  <Frame mod={0}>
    <Title>Votre boîte à outils du jour</Title>
    <Lede>Six familles d’usages. On ne retient pas 20 noms : on retient quel outil sert à quoi.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
      <OFamily icon="chat" tone="blue" title="Assistants" mod="M3" ids={['chatgpt', 'copilot', 'gemini', 'claude', 'perplexity']} d={100} />
      <OFamily icon="search" tone="navy" title="Recherche" mod="M4" ids={['perplexity', 'notebooklm', 'elicit', 'consensus']} d={200} />
      <OFamily icon="pen" tone="green" title="Rédaction" mod="M5" ids={['grammarly', 'deepl', 'canva', 'gamma']} d={300} />
      <OFamily icon="mic" tone="yellow" title="Réunions" mod="M6" ids={['otter', 'fireflies', 'notion']} d={400} />
      <OFamily icon="image" tone="pink" title="Création" mod="M7" ids={['firefly', 'canva', 'runway', 'capcut']} d={500} />
      <OFamily icon="loop" tone="coral" title="Automatisation" mod="M8" ids={['zapier', 'make', 'powerautomate']} d={600} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, width: 1680, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(1400) }}>
      <Icon name="bulb" size={24} color={C.violet} />
      Perplexity et Canva AI apparaissent deux fois : on les voit sous deux angles (assistant / recherche, rédaction / création).
    </div>
  </Frame>
);

// ─── Auto-positionnement ────────────────────────────────────────────────────
const O_AutoPos: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Auto-positionnement : votre point de départ</Title>
    <Lede>Cochez ce que vous savez déjà faire aujourd’hui, sans aide. On refera l’exercice ce soir.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="ap1">Expliquer simplement ce qu’est une IA générative et ses limites</CheckItem>
        <CheckItem id="ap2">Citer trois tâches de mon poste que l’IA peut accélérer</CheckItem>
        <CheckItem id="ap3">Écrire un prompt avec contexte, objectif, rôle, contraintes et format</CheckItem>
        <CheckItem id="ap4">Choisir entre ChatGPT, Copilot, Gemini, Claude et Perplexity selon la tâche</CheckItem>
        <CheckItem id="ap5">Vérifier une information donnée par une IA avant de l’utiliser</CheckItem>
        <CheckItem id="ap6">Transformer des notes en email, en présentation ou en visuel avec l’IA</CheckItem>
        <CheckItem id="ap7">Obtenir automatiquement le compte rendu et les actions d’une réunion</CheckItem>
        <CheckItem id="ap8">Savoir quelles données je n’ai pas le droit de confier à une IA</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau de départ"
          levels={[
            { min: 0, text: 'Découverte : la journée est faite pour vous.', tone: 'grey' },
            { min: 3, text: 'Curieux outillé : on va structurer vos usages.', tone: 'blue' },
            { min: 6, text: 'Déjà à l’aise : visez les bonus des ateliers.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Notez votre score : il servira de référence pour mesurer votre progression en fin de journée.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Règles du jeu & équipement ─────────────────────────────────────────────
const O_Setup: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Check-up : prêts pour les ateliers ?</Title>
    <Lede>Les versions gratuites suffisent pour la journée. Ouvrez les comptes au fil des modules.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="su1" size={26}>Un ordinateur avec un navigateur récent (Chrome, Edge ou Firefox)</CheckItem>
        <CheckItem id="su2" size={26}>Au moins un assistant : ChatGPT, Copilot, Gemini ou Claude</CheckItem>
        <CheckItem id="su3" size={26}>Un compte Google (Gemini, NotebookLM) ou Microsoft (Copilot)</CheckItem>
        <CheckItem id="su4" size={26}>Les comptes gratuits ouverts au fil de l’eau : Perplexity, Canva, Gamma, DeepL…</CheckItem>
        <CheckItem id="su5" size={26}>Le dossier d’exercices fictifs fourni (notes, transcription, brief)</CheckItem>
        <CheckItem id="su6" size={26}>Votre liste mentale de tâches qui vous agacent : on en aura besoin !</CheckItem>
      </div>
      <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Timer id="setup" minutes={3} label="Check-up" cls={A.right} style={{ width: 560, ...dl(200) }} />
        <Callout title="Règle d’or" tone="coral" icon="lock" cls={A.right} style={dl(400)} size={25}>
          Aucune donnée réelle de client, de collègue ou de contrat dans les ateliers. Nous utilisons des cas fictifs.
        </Callout>
      </div>
    </Checklist>
  </Frame>
);

// ═══ 10-m1 ═════════════════════════════════════════════════════════════

// ─── Module 1 · Découvrir l’IA et identifier ses opportunités ───────────────

const M1_Section: Page = () => (
  <Section
    n={1}
    title="Découvrir l’IA et ses opportunités"
    sub="Ce qu’est l’IA générative, ce qu’on peut lui demander, ce qu’il ne faut pas lui confier — et où se cache votre temps perdu."
    dur="55 min"
    labs={<DefiBadge defi="taches" />}
  >
    <SecItem n={1}>Comprendre l’IA générative et ses limites</SecItem>
    <SecItem n={2}>Les 9 verbes de l’IA au quotidien professionnel</SecItem>
    <SecItem n={3}>Identifier les tâches chronophages à lui confier</SecItem>
    <SecItem n={4}>Choisir le bon outil pour la bonne tâche</SecItem>
  </Section>
);
M1_Section.transition = BLOOM;

// ─── IA classique vs IA générative ──────────────────────────────────────────
const M1Out = ({ icon, label, ex, tone, d }: { icon: IconName; label: string; ex: string; tone: Tone; d: number }) => (
  <div className={b.pop(1)} style={{ display: 'flex', gap: 16, alignItems: 'center', background: T[tone].bg, borderRadius: 14, padding: '14px 18px', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={50} solid />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 24, color: C.ink }}>{label}</div>
      <div style={{ fontSize: 19, color: C.soft, lineHeight: 1.35 }}>{ex}</div>
    </div>
  </div>
);

const M1_GenAI: Page = () => (
  <Frame mod={1} beats={2}>
    <Title>Qu’est-ce que l’IA générative ?</Title>
    <Lede>Vous utilisez de l’IA depuis des années sans le savoir. Ce qui change : elle ne fait plus que trier, elle crée.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 760, height: 560, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 32px' }}>
      <Eyebrow c={C.muted}>L’IA « classique » · elle prédit, elle classe</Eyebrow>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Bullet size={26} tone="grey">Le filtre anti-spam de votre messagerie</Bullet>
        <Bullet size={26} tone="grey">Le GPS qui recalcule l’itinéraire selon le trafic</Bullet>
        <Bullet size={26} tone="grey">Les recommandations d’une plateforme vidéo</Bullet>
        <Bullet size={26} tone="grey">La détection de fraude sur votre carte bancaire</Bullet>
      </div>
      <div style={{ position: 'absolute', left: 32, right: 32, bottom: 28, fontSize: 22, color: C.muted, lineHeight: 1.4 }}>
        Réponse attendue : <strong style={{ color: C.ink }}>oui / non, une catégorie, un score</strong>.
      </div>
    </div>
    <div style={{ position: 'absolute', left: 920, top: 280, width: 880 }}>
      <Eyebrow c={C.violet} cls={b.fade(1)}>
        L’IA générative · elle produit du contenu nouveau
      </Eyebrow>
      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <M1Out icon="doc" label="Du texte" ex="emails, synthèses, rapports" tone="blue" d={0} />
        <M1Out icon="image" label="Des images" ex="visuels, illustrations" tone="pink" d={120} />
        <M1Out icon="mic" label="Du son" ex="voix, podcasts, musique" tone="yellow" d={240} />
        <M1Out icon="video" label="De la vidéo" ex="clips, sous-titres, montage" tone="violet" d={360} />
      </div>
      <div className={b.on(2)} style={{ marginTop: 26 }}>
        <Callout title="Définition simple" tone="violet" icon="sparkles" size={25}>
          Une IA générative est un programme entraîné sur d’immenses volumes de contenus, capable de{' '}
          <strong>produire un contenu nouveau à partir d’une simple demande en langage courant</strong> : le prompt.
        </Callout>
      </div>
    </div>
  </Frame>
);

// ─── Comment fonctionne un assistant : prédire le mot suivant ───────────────
const M1Cand = ({ w, p, top, n }: { w: string; p: number; top?: boolean; n: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
    <span style={{ width: 150, fontFamily: mono, fontSize: 26, fontWeight: top ? 700 : 400, color: top ? C.electric : C.soft }}>{w}</span>
    <div style={{ flex: 1, height: 30, borderRadius: 8, background: C.panel, overflow: 'hidden' }}>
      <div className={b.grow(n)} style={{ width: `${p * 1.8}%`, height: '100%', borderRadius: 8, background: top ? G.blue : C.faint }} />
    </div>
    <span className={b.fade(n)} style={{ width: 70, textAlign: 'right', fontFamily: mono, fontSize: 24, color: top ? C.electric : C.muted }}>
      {p} %
    </span>
  </div>
);

const M1_How: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>Comment fonctionne un assistant IA ?</Title>
    <Lede>Un seul mécanisme, répété des milliers de fois : deviner le mot suivant le plus probable.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1000, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 34px' }}>
      <Eyebrow c={C.muted} size={19}>
        Votre demande, déjà en partie écrite
      </Eyebrow>
      <div style={{ marginTop: 14, fontSize: 30, lineHeight: 1.45, color: C.ink }}>
        « Bonjour Paul, je vous propose de décaler notre réunion à{' '}
        <span className={b.fade(2)} style={{ fontWeight: 700, color: C.electric, background: T.blue.bg, borderRadius: 8, padding: '0 8px' }}>
          demain
        </span>
        <span className={cx(A.blink, b.off(2))} style={{ color: C.electric, fontWeight: 700 }}>
          ▍
        </span>{' '}
        »
      </div>
      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Eyebrow c={C.violet} size={19} cls={b.fade(1)}>
          Ce que le modèle calcule pour le mot suivant
        </Eyebrow>
        <M1Cand w="demain" p={46} top n={1} />
        <M1Cand w="jeudi" p={21} n={1} />
        <M1Cand w="lundi" p={14} n={1} />
        <M1Cand w="14 h" p={9} n={1} />
        <M1Cand w="Paris" p={2} n={1} />
      </div>
      <div className={b.fade(1)} style={{ marginTop: 16, fontSize: 19, color: C.faint }}>
        Probabilités illustratives.
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1170, top: 270, width: 630, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="blue" icon="book" title="Il a beaucoup lu" cls={b.on(3)} size={22}>
        Entraîné sur des milliards de textes, il connaît les tournures, les styles, les formats.
      </Card>
      <Card tone="violet" icon="sparkles" title="Il prédit, il ne vérifie pas" cls={b.on(3)} style={dl(150)} size={22}>
        Un texte fluide et sûr de lui peut être faux. Plausible ≠ exact.
      </Card>
      <Card tone="green" icon="user" title="Il ne sait de vous que ce que vous lui dites" cls={b.on(3)} style={dl(300)} size={22}>
        Votre contexte, votre client, vos contraintes : c’est à vous de les donner.
      </Card>
    </div>
  </Frame>
);

// ─── Que peut-on demander ? Les 9 verbes ────────────────────────────────────
type Verb = { id: string; icon: IconName; tone: Tone; prompt: string; tools: ToolId[]; mod: string };
const VERBS: Verb[] = [
  { id: 'Rédiger', icon: 'pen', tone: 'blue', prompt: 'Rédige un email de relance courtois pour une facture impayée depuis 30 jours.', tools: ['chatgpt', 'copilot', 'claude'], mod: 'M2 · M3' },
  { id: 'Reformuler', icon: 'loop', tone: 'violet', prompt: 'Reformule ce paragraphe pour un public non technique, en trois phrases maximum.', tools: ['deepl', 'grammarly', 'chatgpt'], mod: 'M5' },
  { id: 'Résumer', icon: 'layers', tone: 'teal', prompt: 'Résume ce compte rendu en 5 points et liste les décisions prises.', tools: ['copilot', 'claude', 'notebooklm'], mod: 'M3 · M4' },
  { id: 'Traduire', icon: 'translate', tone: 'navy', prompt: 'Traduis cette fiche produit en anglais en gardant un ton commercial.', tools: ['deepl', 'chatgpt'], mod: 'M5' },
  { id: 'Rechercher', icon: 'search', tone: 'blue', prompt: 'Quels dispositifs financent la formation des salariés en PME ? Cite tes sources.', tools: ['perplexity', 'gemini'], mod: 'M4' },
  { id: 'Analyser', icon: 'chart', tone: 'green', prompt: 'Voici 200 réponses d’enquête : quels sont les 3 irritants principaux ?', tools: ['chatgpt', 'claude', 'copilot'], mod: 'M3' },
  { id: 'Créer', icon: 'image', tone: 'pink', prompt: 'Crée un visuel pour annoncer notre webinaire du 14 novembre.', tools: ['canva', 'firefly', 'gamma'], mod: 'M5 · M7' },
  { id: 'Organiser', icon: 'calendar', tone: 'yellow', prompt: 'Transforme ces notes de réunion en tâches avec responsable et échéance.', tools: ['notion', 'fireflies', 'otter'], mod: 'M6' },
  { id: 'Automatiser', icon: 'bolt', tone: 'coral', prompt: 'À chaque formulaire reçu : résumé IA, ligne dans le tableur, email de confirmation.', tools: ['zapier', 'make', 'powerautomate'], mod: 'M8' },
];

const M1VerbBtn = ({ v, i }: { v: Verb; i: number }) => {
  const ctx = useContext(TabCtx);
  const on = ctx?.cur === v.id;
  return (
    <button
      type="button"
      data-osd-interactive
      className={A.pop}
      onClick={(e) => {
        e.currentTarget.blur();
        ctx?.set(v.id);
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        height: 168,
        border: 'none',
        borderRadius: 18,
        cursor: 'pointer',
        background: on ? STRONG[v.tone] : C.card,
        color: on ? '#fff' : C.ink,
        boxShadow: on ? `0 16px 30px -16px ${STRONG[v.tone]}` : SHADOW_SM,
        transform: on ? 'translateY(-4px)' : 'none',
        transition: `all 250ms ${EASE}`,
        fontFamily: display,
        fontWeight: 700,
        fontSize: 25,
        ...dl(100 + i * 70),
      }}
    >
      <Icon name={v.icon} size={44} color={on ? '#fff' : STRONG[v.tone]} />
      {v.id}
    </button>
  );
};

const M1_Verbs: Page = () => (
  <Frame mod={1} kind="exercice">
    <Title>Que peut-on demander à une IA ? Neuf verbes</Title>
    <Lede>Cliquez sur un verbe : un exemple de demande, et les outils de la journée qui s’y prêtent le mieux.</Lede>
    <Tabs initial="Rédiger">
      <div style={{ position: 'absolute', left: 120, top: 270, width: 900, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {VERBS.map((v, i) => (
          <M1VerbBtn key={v.id} v={v} i={i} />
        ))}
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1080, top: 270, width: 720, height: 540, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '30px 34px', ...dl(300) }}>
        {VERBS.map((v) => (
          <TabPane key={v.id} id={v.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <IconTile name={v.icon} tone={v.tone} size={64} solid />
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 44, color: C.navy }}>{v.id}</div>
              <Tag tone="grey" size={18} style={{ marginLeft: 'auto' }}>
                vu en {v.mod}
              </Tag>
            </div>
            <Eyebrow c={C.muted} size={18} style={{ marginTop: 28 }}>
              Exemple de demande
            </Eyebrow>
            <div style={{ marginTop: 10 }}>
              <PromptBox size={25}>{v.prompt}</PromptBox>
            </div>
            <Eyebrow c={C.muted} size={18} style={{ marginTop: 30 }}>
              Outils à essayer
            </Eyebrow>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {v.tools.map((t) => (
                <ToolChip key={t} id={t} size={25} full />
              ))}
            </div>
          </TabPane>
        ))}
      </div>
    </Tabs>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 860, ...dl(900) }}>
      Question au groupe : lequel de ces verbes occupe le plus votre semaine ?
    </Hint>
  </Frame>
);

// ─── Les limites : repérez les erreurs ──────────────────────────────────────
const M1_ERRS: [string, string][] = [
  ['Chiffres inventés', 'L’IA n’a jamais vu votre rapport. Faute de source, elle produit des chiffres plausibles : c’est une « hallucination ».'],
  ['Source fictive', 'Ce cabinet et cette étude n’existent pas. Une citation n’est une preuve que si vous pouvez l’ouvrir et la lire.'],
  ['Erreur de calcul', '3 × 1,2 = 3,6 M€, pas 4,6. Un modèle de langage prédit des mots : sans outil de calcul, il se trompe.'],
  ['Connaissances datées', 'Le modèle s’arrête à sa date d’entraînement : ce qu’il appelle « le plus récent » ne l’est souvent plus.'],
  ['Excès de confiance', 'Le ton assuré ne dit rien de la fiabilité. L’IA n’a ni jugement, ni responsabilité : vous, si.'],
];

const M1Err = ({ n, sel, set, children }: { n: number; sel: number[]; set: (n: number) => void; children: ReactNode }) => {
  const on = sel.includes(n);
  return (
    <span style={{ background: on ? 'rgba(224,72,72,.16)' : 'transparent', borderRadius: 6, transition: `background 300ms ${EASE}` }}>
      {children}
      <button
        type="button"
        data-osd-interactive
        onClick={(e) => {
          e.currentTarget.blur();
          set(n);
        }}
        className={on ? undefined : A.glow}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 34,
          height: 34,
          margin: '0 4px',
          verticalAlign: 'middle',
          borderRadius: 99,
          border: 'none',
          cursor: 'pointer',
          background: on ? C.coral : '#fff',
          color: on ? '#fff' : C.coral,
          boxShadow: `inset 0 0 0 2.5px ${C.coral}`,
          fontFamily: display,
          fontWeight: 800,
          fontSize: 18,
        }}
      >
        {n}
      </button>
    </span>
  );
};

const M1_Limits: Page = () => {
  const [sel, setSel] = useState<number[]>([]);
  const set = (n: number) => setSel((s) => [...s.filter((x) => x !== n), n]);
  const last = sel.length ? sel[sel.length - 1] : 0;
  return (
    <Frame mod={1} kind="exercice">
      <Title>Les principales limites : repérez les 5 erreurs</Title>
      <Lede>Demande : « Résume le rapport annuel 2025 de notre société. » — sans joindre le rapport. Cliquez les numéros.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1100, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 32px' }}>
        <Bubble who="agent" name="Assistant IA" size={25} w={960}>
          <span style={{ lineHeight: 1.7 }}>
            Bien sûr ! En 2025, votre société a{' '}
            <M1Err n={1} sel={sel} set={set}>réalisé un chiffre d’affaires de 48,3 M€, en hausse de 12,4 %</M1Err>. Selon{' '}
            <M1Err n={2} sel={sel} set={set}>une étude du cabinet Markovia de mars 2024</M1Err>, votre secteur reste porteur. Avec trois trimestres à 1,2 M€ de
            résultat, <M1Err n={3} sel={sel} set={set}>le résultat cumulé atteint 4,6 M€</M1Err>.{' '}
            <M1Err n={4} sel={sel} set={set}>Le modèle d’IA le plus récent à ce jour</M1Err> vous aidera à poursuivre cette dynamique.{' '}
            <M1Err n={5} sel={sel} set={set}>C’est certain</M1Err> : 2026 sera une année record.
          </span>
        </Bubble>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 640, width: 1100, height: 210, boxSizing: 'border-box', background: last ? T.coral.bg : T.grey.bg, borderRadius: 18, padding: '22px 30px', transition: `background 300ms ${EASE}` }}>
        {last ? (
          <div key={last} className={A.in} style={{ animationDuration: '450ms' } as CSSProperties}>
            <Eyebrow c={T.coral.fg} size={22}>
              Erreur {last} · {M1_ERRS[last - 1][0]}
            </Eyebrow>
            <div style={{ marginTop: 10, fontSize: 26, lineHeight: 1.45, color: C.ink }}>{M1_ERRS[last - 1][1]}</div>
          </div>
        ) : (
          <div style={{ fontSize: 26, color: C.muted }}>Lisez la réponse : elle a l’air parfaite. Où sont les pièges ?</div>
        )}
        <div style={{ position: 'absolute', right: 26, bottom: 18, fontFamily: display, fontWeight: 800, fontSize: 22, color: sel.length === 5 ? C.green : C.muted }}>
          {sel.length} / 5 trouvées
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1280, top: 270, width: 520, display: 'flex', flexDirection: 'column', gap: 12, ...dl(300) }}>
        <Eyebrow c={C.coral} size={20}>
          Les limites à garder en tête
        </Eyebrow>
        {(
          [
            ['alert', 'Hallucinations : invente avec aplomb'],
            ['clock', 'Connaissances arrêtées à une date'],
            ['chart', 'Calculs et chiffres peu fiables'],
            ['scale', 'Biais hérités des données'],
            ['lock', 'Confidentialité de ce que vous collez'],
            ['humanCheck', 'Aucune responsabilité : c’est vous qui signez'],
          ] as [IconName, string][]
        ).map(([ic, t]) => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 14, background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '12px 16px', fontSize: 22, color: C.ink }}>
            <Icon name={ic} size={26} color={C.coral} /> {t}
          </div>
        ))}
      </div>
    </Frame>
  );
};

// ─── Calculateur : votre temps récupérable ──────────────────────────────────
const M1Slider = ({ label, value, set, min, max, step = 1, unit, tone }: { label: string; value: number; set: (v: number) => void; min: number; max: number; step?: number; unit: string; tone: Tone }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', fontSize: 23, color: C.ink }}>
      <span>{label}</span>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: STRONG[tone] }}>
        {value} <span style={{ fontSize: 19, fontWeight: 600, color: C.muted }}>{unit}</span>
      </span>
    </div>
    <div style={{ marginTop: 8 }}>
      <Range value={value} onChange={set} min={min} max={max} step={step} w={880} tone={tone} />
    </div>
  </div>
);

const M1Bar = ({ label, min, max, tone }: { label: string; min: number; max: number; tone: Tone }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 21, color: C.soft }}>
    <span style={{ width: 150 }}>{label}</span>
    <div style={{ flex: 1, height: 18, borderRadius: 9, background: C.panel, overflow: 'hidden' }}>
      <div style={{ width: `${Math.min(100, (min / Math.max(1, max)) * 100)}%`, height: '100%', background: STRONG[tone], transition: `width 400ms ${EASE}` }} />
    </div>
    <span style={{ width: 90, textAlign: 'right', fontFamily: mono, fontSize: 20 }}>{Math.round(min)} min</span>
  </div>
);

const M1_Calc: Page = () => {
  const [mails, setMails] = useState(25);
  const [meet, setMeet] = useState(5);
  const [docs, setDocs] = useState(4);
  const [search, setSearch] = useState(3);
  // Weekly minutes saved, with deliberately cautious gain hypotheses.
  const g = {
    mails: mails * 3 * 5 * 0.2,
    meet: meet * 20 * 0.5,
    docs: docs * 60 * 0.25,
    search: search * 60 * 0.25,
  };
  const total = g.mails + g.meet + g.docs + g.search;
  const max = Math.max(g.mails, g.meet, g.docs, g.search);
  const hours = total / 60;
  const days = (hours * 45) / 7;
  return (
    <Frame mod={1} kind="simu">
      <Title>Combien de temps pourriez-vous récupérer ?</Title>
      <Lede>Réglez les curseurs sur votre semaine type. Hypothèses prudentes, affichées en bas : à vous de les discuter.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 960, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 40px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <M1Slider label="Emails écrits par jour (≈ 3 min chacun)" value={mails} set={setMails} min={0} max={80} unit="/ jour" tone="blue" />
        <M1Slider label="Réunions à résumer par semaine (≈ 20 min de CR)" value={meet} set={setMeet} min={0} max={20} unit="/ sem." tone="yellow" />
        <M1Slider label="Heures de rédaction de documents par semaine" value={docs} set={setDocs} min={0} max={20} unit="h / sem." tone="green" />
        <M1Slider label="Heures de recherche d’information par semaine" value={search} set={setSearch} min={0} max={15} unit="h / sem." tone="navy" />
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1130, top: 270, width: 670, boxSizing: 'border-box', background: C.navy, borderRadius: 20, boxShadow: SHADOW, padding: '28px 34px', color: '#fff', ...dl(200) }}>
        <Eyebrow c="#AEB9E6" size={19}>
          Temps potentiellement récupérable
        </Eyebrow>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 10 }}>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 120, lineHeight: 1 }}>{fr(hours, 1)}</span>
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 36, color: '#AEB9E6' }}>h / semaine</span>
        </div>
        <div style={{ marginTop: 10, fontSize: 26, color: '#DCE3FB' }}>
          soit environ <strong style={{ color: '#fff', fontSize: 34 }}>{fr(days, 0)} jours</strong> de travail par an
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1130, top: 560, width: 670, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 30px', display: 'flex', flexDirection: 'column', gap: 14, ...dl(350) }}>
        <Eyebrow c={C.muted} size={18}>
          Gain par semaine, par poste
        </Eyebrow>
        <M1Bar label="Emails" min={g.mails} max={max} tone="blue" />
        <M1Bar label="Réunions" min={g.meet} max={max} tone="yellow" />
        <M1Bar label="Documents" min={g.docs} max={max} tone="green" />
        <M1Bar label="Recherche" min={g.search} max={max} tone="navy" />
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, width: 1680, fontSize: 19, lineHeight: 1.45, color: C.muted, ...dl(700) }}>
        Hypothèses de gain : emails −20 %, comptes rendus −50 %, documents −25 %, recherche −25 % · 45 semaines travaillées · journées de 7 h. Estimation pédagogique, pas une promesse : le gain réel dépend de la tâche et de la relecture.
      </div>
    </Frame>
  );
};

// ─── Tri : IA, ensemble ou humain ? ─────────────────────────────────────────
const M1Zone = ({ x, title, tone, icon, answer }: { x: number; title: string; tone: Tone; icon: IconName; answer: string }) => (
  <div className={A.in} style={{ position: 'absolute', left: x, top: 470, width: 540, height: 430, boxSizing: 'border-box', borderRadius: 20, background: T[tone].bg, boxShadow: `inset 0 0 0 2.5px ${T[tone].bd}`, padding: '18px 22px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone={tone} size={44} solid />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: T[tone].fg }}>{title}</span>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 22, right: 22, bottom: 18, fontSize: 19, lineHeight: 1.4, color: T[tone].fg, background: '#fff', borderRadius: 12, padding: '10px 14px' }}>
      <strong>Proposition : </strong>
      {answer}
    </div>
  </div>
);

const M1_Sort: Page = () => (
  <Frame mod={1} kind="exercice" beats={1}>
    <Title>Confier à l’IA… ou pas ? Le jeu du tri</Title>
    <Lede>Glissez chaque tâche dans une colonne (double-clic pour la remettre). Puis → pour notre proposition.</Lede>
    <M1Zone x={120} title="L’IA peut s’en charger" tone="green" icon="bot" answer="premier jet de relance, idées de titres, orthographe." />
    <M1Zone x={690} title="L’IA aide, je valide" tone="yellow" icon="humanCheck" answer="résumé de 30 pages, traduction d’une fiche, trame de contrat." />
    <M1Zone x={1260} title="Je garde la main" tone="coral" icon="user" answer="annonce sensible, décision d’augmentation, client en colère." />
    <Drag x={120} y={262} w={530} tone="grey">Premier jet d’un email de relance</Drag>
    <Drag x={690} y={262} w={530} tone="grey">Résumer un document de 30 pages</Drag>
    <Drag x={1260} y={262} w={540} tone="grey">Annoncer une mauvaise nouvelle</Drag>
    <Drag x={120} y={330} w={530} tone="grey">Traduire une fiche produit en anglais</Drag>
    <Drag x={690} y={330} w={530} tone="grey">Décider d’une augmentation de salaire</Drag>
    <Drag x={1260} y={330} w={540} tone="grey">Trouver 10 idées de titres pour un article</Drag>
    <Drag x={120} y={398} w={530} tone="grey">Rédiger la trame d’un contrat client</Drag>
    <Drag x={690} y={398} w={530} tone="grey">Corriger l’orthographe d’un rapport</Drag>
    <Drag x={1260} y={398} w={540} tone="grey">Gérer un client mécontent au téléphone</Drag>
  </Frame>
);

// ─── Comment choisir le bon outil ───────────────────────────────────────────
const M1Q = ({ n, q, children, d }: { n: number; q: string; children: ReactNode; d: number }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 22, alignItems: 'flex-start', ...dl(d) }}>
    <Num n={n} tone="violet" size={56} />
    <div style={{ flex: 1, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 26px' }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{q}</div>
      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: '12px 26px', alignItems: 'center', fontSize: 22, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M1Arrow = () => <Icon name="arrow" size={22} color={C.faint} />;

const M1_Choose: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>Comment choisir le bon outil ? Trois questions</Title>
    <Lede>Dans cet ordre. La première question peut à elle seule éliminer la moitié des outils.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <M1Q n={1} q="Mes données sont-elles sensibles ?" d={0}>
        <Tag tone="coral" size={21}>Oui</Tag> <M1Arrow /> uniquement l’outil validé par mon entreprise (version professionnelle, données protégées)
        <Tag tone="green" size={21}>Non</Tag> <M1Arrow /> je peux tester librement
      </M1Q>
      <M1Q n={2} q="Où est-ce que je travaille déjà ?" d={0}>
        <span>Outlook, Word, Teams</span> <M1Arrow /> <ToolChip id="copilot" size={22} />
        <span style={{ marginLeft: 20 }}>Gmail, Docs, Drive</span> <M1Arrow /> <ToolChip id="gemini" size={22} />
        <span style={{ marginLeft: 20 }}>Ailleurs</span> <M1Arrow /> <ToolChip id="chatgpt" size={22} /> <ToolChip id="claude" size={22} />
      </M1Q>
      <M1Q n={3} q="De quoi ai-je besoin précisément ?" d={0}>
        <span>Des sources</span> <M1Arrow /> <ToolChip id="perplexity" size={22} />
        <span style={{ marginLeft: 14 }}>Mes documents</span> <M1Arrow /> <ToolChip id="notebooklm" size={22} />
        <span style={{ marginLeft: 14 }}>Traduire</span> <M1Arrow /> <ToolChip id="deepl" size={22} />
        <span style={{ marginLeft: 14 }}>Des slides</span> <M1Arrow /> <ToolChip id="gamma" size={22} />
        <span style={{ marginLeft: 14 }}>Une réunion</span> <M1Arrow /> <ToolChip id="otter" size={22} /> <ToolChip id="fireflies" size={22} />
      </M1Q>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, width: 1680, ...dl(400) }}>
      <Callout title="Règle simple" tone="blue" icon="target" size={24}>
        Un généraliste pour 80 % des tâches, un spécialiste quand la tâche revient souvent et mérite mieux.
      </Callout>
    </div>
  </Frame>
);

// ─── Atelier 1 ──────────────────────────────────────────────────────────────
const M1_Lab: Page = () => (
  <LabPage
    mod={1}
    n="1"
    title="Mes 5 tâches à confier à l’IA"
    defi="taches"
    who="Individuel, puis partage en binôme"
    minutes={12}
    tools={['chatgpt', 'copilot', 'gemini', 'claude']}
    objective={
      <>
        Identifier <strong>5 tâches de votre quotidien</strong> pour lesquelles l’IA pourrait vous faire gagner du temps, et estimer ce gain.
      </>
    }
    where={
      <>
        Une fiche de 5 lignes : <strong>tâche · fréquence · temps passé · verbe IA · outil pressenti</strong>. Gardez-la : elle sert à l’atelier final.
      </>
    }
    crit={
      <>
        <CheckItem id="l1-c1" size={21}>5 tâches réelles, concrètes, nommées</CheckItem>
        <CheckItem id="l1-c2" size={21}>Fréquence et temps estimés</CheckItem>
        <CheckItem id="l1-c3" size={21}>Un verbe IA et un outil par tâche</CheckItem>
        <CheckItem id="l1-c4" size={21}>Aucune tâche « à garder humaine »</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div><strong style={{ color: C.navy }}>1.</strong> Listez seul ce qui vous prend du temps cette semaine (5 min).</div>
      <div><strong style={{ color: C.navy }}>2.</strong> Demandez de l’aide à votre assistant avec le prompt de la page suivante.</div>
      <div><strong style={{ color: C.navy }}>3.</strong> Gardez les 5 tâches les plus fréquentes et les moins risquées.</div>
      <div><strong style={{ color: C.navy }}>4.</strong> En binôme : chacun challenge le choix de l’autre (2 min chacun).</div>
    </div>
    <Bonus>Classez vos 5 tâches par gain estimé : la première sera votre fil rouge de l’atelier final.</Bonus>
  </LabPage>
);

const M1Row = ({ t, f, time, v, id, g, d }: { t: string; f: string; time: string; v: string; id: ToolId; g: string; d: number }) => (
  <div className={A.left} style={{ display: 'grid', gridTemplateColumns: '1.9fr 0.9fr 0.8fr 0.9fr 1.2fr 0.7fr', alignItems: 'center', gap: 14, padding: '12px 18px', background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, fontSize: 21, color: C.ink, ...dl(d) }}>
    <span style={{ fontWeight: 600 }}>{t}</span>
    <span>{f}</span>
    <span>{time}</span>
    <Tag tone="violet" size={17}>{v}</Tag>
    <ToolChip id={id} size={19} />
    <span style={{ fontFamily: display, fontWeight: 800, color: C.green }}>{g}</span>
  </div>
);

const M1_LabSheet: Page = () => (
  <Frame mod={1} kind="lab" label="Atelier 1 · Exemple et prompt d’aide">
    <Title size={46}>Exemple : la fiche de Léa, assistante commerciale</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className={A.fade} style={{ display: 'grid', gridTemplateColumns: '1.9fr 0.9fr 0.8fr 0.9fr 1.2fr 0.7fr', gap: 14, padding: '0 18px', fontSize: 17, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted }}>
        <span>Tâche</span>
        <span>Fréquence</span>
        <span>Temps</span>
        <span>Verbe</span>
        <span>Outil pressenti</span>
        <span>Gain</span>
      </div>
      <M1Row t="Répondre aux demandes de devis" f="10 / jour" time="5 min" v="Rédiger" id="copilot" g="≈ 2 h/sem" d={100} />
      <M1Row t="Compte rendu de la réunion d’équipe" f="1 / sem." time="45 min" v="Résumer" id="fireflies" g="≈ 30 min" d={180} />
      <M1Row t="Traduire les fiches produits" f="3 / sem." time="30 min" v="Traduire" id="deepl" g="≈ 1 h/sem" d={260} />
      <M1Row t="Préparer la présentation mensuelle" f="1 / mois" time="3 h" v="Créer" id="gamma" g="≈ 2 h/mois" d={340} />
      <M1Row t="Veille sur les concurrents" f="1 / sem." time="1 h" v="Rechercher" id="perplexity" g="≈ 30 min" d={420} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 640, width: 1680, ...dl(500) }}>
      <CodeDark file="Prompt d’aide · à copier dans votre assistant" size={22} wrap>
        Je suis <Hole>votre poste</Hole> dans <Hole>votre secteur</Hole>. Mes journées comprennent surtout <Hole>3 activités</Hole>.{'\n'}
        Propose-moi 15 tâches de ce type de poste pour lesquelles l’IA peut faire gagner du temps.{'\n'}
        Pour chacune : le verbe (rédiger, résumer, traduire…), un exemple de demande, et le risque si l’IA se trompe.{'\n'}
        <Cc>Présente le résultat sous forme de tableau, du gain le plus élevé au plus faible.</Cc>
      </CodeDark>
    </div>
  </Frame>
);

// ─── Quiz M1 ────────────────────────────────────────────────────────────────
const M1_Quiz: Page = () => (
  <Frame mod={1} kind="quiz">
    <Title>Quiz · Module 1</Title>
    <QuizSeries y={200}>
      <QuizQ q="Une IA générative comme ChatGPT produit sa réponse…" explain="Elle prédit, mot après mot, la suite la plus probable. Elle ne consulte pas une base de faits vérifiés.">
        <QOpt>en cherchant la bonne réponse dans une base de faits vérifiés</QOpt>
        <QOpt ok>en prédisant la suite de mots la plus probable</QOpt>
        <QOpt>en comprenant le sens comme un humain</QOpt>
      </QuizQ>
      <QuizQ q="Vous demandez « Résume notre rapport annuel » sans le joindre. Le risque principal ?" explain="Sans source, l’IA peut inventer un résumé plausible : chiffres, études, citations. C’est une hallucination.">
        <QOpt>Elle refuse toujours de répondre</QOpt>
        <QOpt ok>Elle invente un résumé plausible, avec de faux chiffres</QOpt>
        <QOpt>Elle va chercher le rapport sur votre intranet</QOpt>
      </QuizQ>
      <QuizQ q="Quelle tâche devez-vous garder humaine ?" explain="Les situations à forte charge émotionnelle ou à enjeu de décision restent humaines. L’IA peut aider à préparer, pas à annoncer.">
        <QOpt>Corriger l’orthographe d’un rapport</QOpt>
        <QOpt ok>Annoncer une mauvaise nouvelle à un collaborateur</QOpt>
        <QOpt>Proposer dix idées de titres</QOpt>
      </QuizQ>
      <QuizQ q="Vous travaillez toute la journée dans Outlook, Word et Teams. L’assistant le plus intégré ?" explain="Microsoft Copilot est intégré à l’environnement Microsoft 365 : il travaille là où sont vos emails et documents.">
        <QOpt ok>Microsoft Copilot</QOpt>
        <QOpt>Runway</QOpt>
        <QOpt>Consensus</QOpt>
      </QuizQ>
      <QuizQ q="La tâche idéale à confier en premier à l’IA est…" explain="Fréquente, répétitive, à faible risque : c’est là que le gain cumulé est le plus fort et l’erreur la moins grave.">
        <QOpt>rare, mais à très fort enjeu</QOpt>
        <QOpt ok>fréquente, répétitive et à faible risque</QOpt>
        <QOpt>confidentielle et urgente</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ═══ 20-m2 ═════════════════════════════════════════════════════════════

// ─── Module 2 · Les fondamentaux du prompting ───────────────────────────────

const M2_Section: Page = () => (
  <Section
    n={2}
    title="Les fondamentaux du prompting"
    sub="Les bases pour obtenir de bons résultats de n’importe quel outil présenté aujourd’hui : savoir formuler, préciser, itérer et vérifier."
    dur="50 min"
    labs={<DefiBadge defi="prompt" />}
  >
    <SecItem n={1}>Qu’est-ce qu’un prompt, et pourquoi ça rate</SecItem>
    <SecItem n={2}>Les 5 briques : contexte, objectif, rôle, contraintes, format</SecItem>
    <SecItem n={3}>Donner des exemples, itérer, faire préciser</SecItem>
    <SecItem n={4}>Vérifier et corriger une réponse générée</SecItem>
  </Section>
);
M2_Section.transition = BLOOM;

// ─── Qu’est-ce qu’un prompt ? ───────────────────────────────────────────────
const M2_What: Page = () => (
  <Frame mod={2} beats={3}>
    <Title>Qu’est-ce qu’un prompt ?</Title>
    <Lede>La demande que vous écrivez à l’IA. Le bon réflexe : l’imaginer comme le brief d’un nouveau stagiaire.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 720 }}>
      <Quote by="La règle d’or de la journée">Un prompt, c’est un brief. Ce que vous ne dites pas, l’IA l’invente.</Quote>
      <div style={{ marginTop: 50, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <PromptBox size={26}>Rédige un compte rendu.</PromptBox>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.muted, paddingLeft: 10 }}>
          <Icon name="arrow" size={24} color={C.faint} /> De quelle réunion ? Pour qui ? Quelle longueur ? Quel ton ?
        </div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 920, top: 280, width: 880, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Eyebrow c={C.violet} size={20} cls={A.fade}>
        Votre stagiaire IA…
      </Eyebrow>
      <Card tone="blue" icon="brain" title="…est brillant et très rapide" cls={b.on(1)} size={23}>
        Il écrit, résume, traduit en quelques secondes, dans un français impeccable.
      </Card>
      <Card tone="violet" icon="eyeOff" title="…ne connaît rien de vous" cls={b.on(2)} size={23}>
        Ni votre entreprise, ni votre client, ni l’historique du dossier, ni vos habitudes.
      </Card>
      <Card tone="green" icon="target" title="…fait exactement ce que vous dites" cls={b.on(3)} size={23}>
        Une demande vague donne une réponse moyenne. Une demande précise donne une réponse utile.
      </Card>
    </div>
  </Frame>
);

// ─── Pourquoi ça rate ───────────────────────────────────────────────────────
const M2Cause = ({ n, icon, title, children }: { n: number; icon: IconName; title: string; children: ReactNode }) => (
  <div className={b.left(n)} style={{ display: 'flex', gap: 18, alignItems: 'center', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 20px' }}>
    <IconTile name={icon} tone="coral" size={50} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 24, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, color: C.soft, lineHeight: 1.35 }}>{children}</div>
    </div>
  </div>
);

const M2_Bad: Page = () => (
  <Frame mod={2} beats={5}>
    <Title>Pourquoi certaines demandes échouent ?</Title>
    <Lede>La réponse est rarement « l’IA est nulle ». Elle est presque toujours dans la demande.</Lede>
    <ToolWindow id="chatgpt" title="une demande vague" cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800, height: 580 }}>
      <PromptBox size={24}>Fais-moi un mail pour la réunion.</PromptBox>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', fontSize: 21, lineHeight: 1.5, color: C.soft }}>
        <ToolTile id="chatgpt" size={34} />
        <div>
          Objet : Réunion
          <br />
          Bonjour à tous,
          <br />
          Je vous propose une réunion afin d’échanger sur les sujets en cours. Merci de me faire part de vos disponibilités.
          <br />
          Cordialement,
          <br />
          [Votre nom]
        </div>
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, fontWeight: 600, color: C.coral }}>
        <Icon name="x" size={24} color={C.coral} sw={3} /> Correct… et inutilisable : il faut tout réécrire.
      </div>
    </ToolWindow>
    <div style={{ position: 'absolute', left: 980, top: 270, width: 820, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M2Cause n={1} icon="eyeOff" title="Trop vague">
        Quelle réunion, quand, avec qui, pour décider de quoi ?
      </M2Cause>
      <M2Cause n={2} icon="book" title="Pas de contexte">
        L’IA ignore le projet, les enjeux, l’historique.
      </M2Cause>
      <M2Cause n={3} icon="users" title="Pas de destinataire">
        Un mail à la direction ne s’écrit pas comme un mail à l’équipe.
      </M2Cause>
      <M2Cause n={4} icon="table" title="Pas de format">
        Longueur, ton, structure : rien n’est dit, tout est deviné.
      </M2Cause>
      <M2Cause n={5} icon="layers" title="Tout à la fois">
        Une demande géante en un bloc : mieux vaut découper en étapes.
      </M2Cause>
    </div>
  </Frame>
);

// ─── Le constructeur de prompt (interactif) ─────────────────────────────────
type Brick = { id: string; label: string; tone: Tone; icon: IconName; hint: string; text: string };
const BRICKS: Brick[] = [
  { id: 'role', label: 'Rôle', tone: 'violet', icon: 'user', hint: 'Qui l’IA doit-elle incarner ?', text: 'Tu es responsable de la communication interne d’une PME de 80 personnes.' },
  { id: 'ctx', label: 'Contexte', tone: 'blue', icon: 'book', hint: 'Quelle est la situation ?', text: 'Notre séminaire annuel a lieu le 21 novembre à Lyon. C’est le premier depuis le rachat de l’entreprise et certains salariés sont inquiets.' },
  { id: 'obj', label: 'Objectif', tone: 'green', icon: 'target', hint: 'Que voulez-vous obtenir, et pour quoi faire ?', text: 'Rédige le message d’annonce : il doit donner envie de venir et rassurer sur l’avenir.' },
  { id: 'cons', label: 'Contraintes', tone: 'yellow', icon: 'filter', hint: 'Ton, longueur, à inclure, à éviter.', text: 'Ton chaleureux, 150 mots maximum, sans jargon. Mentionne l’inscription avant le 7 novembre.' },
  { id: 'fmt', label: 'Format', tone: 'teal', icon: 'table', hint: 'Sous quelle forme voulez-vous la réponse ?', text: 'Donne un objet, le message, puis 3 variantes de phrase d’accroche.' },
];

const M2_RESULT: [string, Tone][] = [
  ['« Chers collègues, nous avons le plaisir de vous convier à notre séminaire… » : générique, sans date, sans âme. À réécrire.', 'coral'],
  ['Le ton est plus juste, mais l’IA invente la date, le lieu et le programme.', 'coral'],
  ['Les faits sont bons. Reste à deviner ce que le message doit produire.', 'yellow'],
  ['Le message a un cap : donner envie et rassurer. Longueur et ton encore aléatoires.', 'yellow'],
  ['Presque prêt : bon ton, bonne longueur, la date limite y est. Il manque la mise en forme.', 'blue'],
  ['Prêt à relire et envoyer : objet, message, et trois accroches au choix. Gain : 20 minutes.', 'green'],
];

const M2_Builder: Page = () => {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const n = BRICKS.filter((x) => on[x.id]).length;
  const [res, tone] = M2_RESULT[n];
  return (
    <Frame mod={2} kind="simu">
      <Title>Les 5 briques d’un bon prompt</Title>
      <Lede>Activez les briques une à une et regardez la demande… et le résultat attendu, changer.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 640, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {BRICKS.map((x) => (
          <div key={x.id} style={{ background: on[x.id] ? T[x.tone].bg : C.card, borderRadius: 16, boxShadow: on[x.id] ? `inset 0 0 0 2.5px ${STRONG[x.tone]}` : SHADOW_SM, padding: '14px 20px', transition: `all 250ms ${EASE}` }}>
            <Toggle on={!!on[x.id]} onChange={(v) => setOn((o) => ({ ...o, [x.id]: v }))} tone={x.tone} label={<strong style={{ fontFamily: display, fontSize: 26 }}>{x.label}</strong>} />
            <div style={{ marginTop: 4, marginLeft: 82, fontSize: 20, color: C.muted }}>{x.hint}</div>
          </div>
        ))}
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 820, top: 260, width: 980, height: 400, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(150) }}>
        <Eyebrow c={C.muted} size={18}>
          Votre prompt
        </Eyebrow>
        <div style={{ marginTop: 12, fontSize: 24, lineHeight: 1.55, color: C.ink }}>
          {BRICKS.filter((x) => on[x.id]).map((x) => (
            <span key={x.id} className={A.fade} style={{ background: T[x.tone].bg, boxShadow: `inset 0 -3px 0 ${STRONG[x.tone]}`, borderRadius: 6, padding: '1px 6px', marginRight: 6 }}>
              {x.text}
            </span>
          ))}
          {n === 0 ? <span style={{ fontWeight: 600 }}>Écris une annonce pour le séminaire.</span> : null}
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 820, top: 690, width: 980, boxSizing: 'border-box', background: T[tone].bg, borderRadius: 20, padding: '20px 30px', borderLeft: `8px solid ${STRONG[tone]}`, transition: `background 300ms ${EASE}`, ...dl(300) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Eyebrow c={T[tone].fg} size={19}>
            Résultat attendu
          </Eyebrow>
          <div style={{ display: 'flex', gap: 6 }}>
            {BRICKS.map((x, i) => (
              <span key={x.id} style={{ width: 34, height: 12, borderRadius: 6, background: i < n ? STRONG[tone] : '#fff', transition: `background 300ms ${EASE}` }} />
            ))}
          </div>
          <span style={{ marginLeft: 'auto', fontFamily: display, fontWeight: 800, fontSize: 30, color: T[tone].fg }}>{n} / 5</span>
        </div>
        <div key={n} className={A.fade} style={{ marginTop: 10, fontSize: 24, lineHeight: 1.42, color: C.ink, animationDuration: '400ms' } as CSSProperties}>
          {res}
        </div>
      </div>
    </Frame>
  );
};

// ─── Donner des exemples ────────────────────────────────────────────────────
const M2_Examples: Page = () => (
  <Frame mod={2} beats={2}>
    <Title>Donner des exemples à l’IA</Title>
    <Lede>Montrer vaut mieux qu’expliquer : deux exemples suffisent souvent pour imposer votre style ou votre classement.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 960 }}>
      <CodeDark file="Prompt avec exemples · tri des emails clients" size={21} wrap>
        Classe chaque email client dans une catégorie et donne sa priorité.{'\n\n'}
        <Cc>Exemple 1</Cc>
        {'\n'}Email : « Ma commande n° 4471 n’est toujours pas arrivée, c’est la 3e relance. »{'\n'}
        <Cs>→ Livraison · priorité haute</Cs>
        {'\n\n'}
        <Cc>Exemple 2</Cc>
        {'\n'}Email : « Pouvez-vous m’envoyer votre catalogue 2027 ? »{'\n'}
        <Cs>→ Information · priorité basse</Cs>
        {'\n\n'}
        <Cf>À toi :</Cf> « Le produit reçu est cassé, je veux un remboursement rapidement. »
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1130, top: 270, width: 670, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className={b.pop(1)} style={{ background: T.green.bg, borderRadius: 18, padding: '22px 26px', boxShadow: `inset 0 0 0 2.5px ${C.green}` }}>
        <Eyebrow c={T.green.fg} size={18}>
          Réponse de l’IA
        </Eyebrow>
        <div style={{ marginTop: 8, fontFamily: mono, fontSize: 28, fontWeight: 700, color: C.ink }}>→ Réclamation · priorité haute</div>
        <div style={{ marginTop: 8, fontSize: 20, color: C.soft }}>Même format, même logique que vos exemples : réutilisable tel quel.</div>
      </div>
      <Card tone="violet" icon="pen" title="Pour votre style d’écriture" cls={b.on(2)} size={22}>
        Collez deux de vos emails : « Écris dans le même style, aussi concis. »
      </Card>
      <Card tone="blue" icon="table" title="Pour un format exact" cls={b.on(2)} style={dl(150)} size={22}>
        Montrez une ligne de tableau remplie : l’IA remplit les suivantes à l’identique.
      </Card>
    </div>
  </Frame>
);

// ─── Itérer : reformuler, améliorer, faire préciser ─────────────────────────
const M2_Iterate: Page = () => (
  <Frame mod={2} kind="demo">
    <Title>Un prompt n’est pas un coup unique : on dialogue</Title>
    <Lede>Trois réflexes pour transformer une réponse moyenne en réponse excellente. Cliquez sur chaque onglet.</Lede>
    <Tabs initial="ask">
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, display: 'flex', gap: 12 }}>
        <TabBtn id="ask" tone="violet" icon="chat">
          Faire préciser sa demande
        </TabBtn>
        <TabBtn id="improve" tone="blue" icon="loop">
          Demander une amélioration
        </TabBtn>
        <TabBtn id="meta" tone="green" icon="wand">
          Faire améliorer son prompt
        </TabBtn>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 340, width: 1680, height: 520, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 34px', ...dl(150) }}>
        <TabPane id="ask">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Bubble who="user" size={23} w={1200}>
              Je dois préparer un discours pour le départ en retraite de Martine, 32 ans de maison. <strong>Avant de l’écrire, pose-moi les questions dont tu as besoin.</strong>
            </Bubble>
            <Bubble who="agent" name="Assistant" size={23} w={1300}>
              Avec plaisir. 1) Combien de temps doit durer le discours ? 2) Quel était son poste et ses grandes réalisations ? 3) Une anecdote ou un trait de caractère à évoquer ? 4) Ton plutôt émouvant ou plutôt humoristique ? 5) Qui prend la parole : son responsable, un collègue ?
            </Bubble>
            <Callout title="Pourquoi ça marche" tone="violet" icon="bulb" size={22}>
              L’IA identifie elle-même ce qui lui manque. Vous répondez en 2 minutes, et le premier jet est le bon.
            </Callout>
          </div>
        </TabPane>
        <TabPane id="improve">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Bubble who="user" size={23} w={1200}>
              C’est bien, mais <strong>plus court de moitié, plus direct</strong>, et termine par une question qui appelle une réponse.
            </Bubble>
            <Bubble who="user" size={23} w={1200}>
              Propose-moi <strong>3 versions</strong> : une formelle, une chaleureuse, une très courte pour Teams.
            </Bubble>
            <Bubble who="user" size={23} w={1200}>
              <strong>Relis ta réponse comme un client exigeant</strong> : qu’est-ce qui pourrait le gêner ? Corrige.
            </Bubble>
            <Callout title="Pourquoi ça marche" tone="blue" icon="bulb" size={22}>
              L’IA garde le fil de la conversation : inutile de tout réexpliquer, précisez seulement ce qui ne va pas.
            </Callout>
          </div>
        </TabPane>
        <TabPane id="meta">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Bubble who="user" size={23} w={1200}>
              Voici mon prompt : « Fais un résumé du rapport pour le comité. » <strong>Améliore-le</strong> en ajoutant ce qui manque (contexte, objectif, rôle, contraintes, format), puis explique tes ajouts.
            </Bubble>
            <Bubble who="agent" name="Assistant" size={23} w={1300}>
              Version améliorée : « Tu es analyste financier. Résume ce rapport trimestriel pour un comité de direction qui a 5 minutes : 5 points clés, 3 risques, 1 recommandation, 200 mots maximum, en puces. » Ajouts : rôle, destinataire, temps de lecture…
            </Bubble>
            <Callout title="Pourquoi ça marche" tone="green" icon="bulb" size={22}>
              L’IA connaît les bonnes pratiques du prompting : utilisez-la comme coach, puis gardez le prompt amélioré dans vos modèles.
            </Callout>
          </div>
        </TabPane>
      </div>
    </Tabs>
  </Frame>
);

// ─── Vérifier et corriger ───────────────────────────────────────────────────
const M2_Verify: Page = () => (
  <Frame mod={2} kind="exercice">
    <Title>Vérifier et corriger une réponse générée</Title>
    <Lede>Avant d’envoyer quoi que ce soit, trois relectures : les faits, le fond, la forme. Cochez votre routine.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1130, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Eyebrow c={C.coral} size={19}>
          1 · Les faits
        </Eyebrow>
        <CheckItem id="v1" tone="coral" size={24}>Les chiffres, dates, noms et citations sont vérifiés à la source</CheckItem>
        <CheckItem id="v2" tone="coral" size={24}>Rien n’a été inventé pour combler un manque d’information</CheckItem>
        <Eyebrow c={C.blue} size={19} style={{ marginTop: 10 }}>
          2 · Le fond
        </Eyebrow>
        <CheckItem id="v3" tone="blue" size={24}>La réponse traite vraiment ma demande, sans hors-sujet</CheckItem>
        <CheckItem id="v4" tone="blue" size={24}>Rien de faux, d’engageant ou de risque juridique n’est promis</CheckItem>
        <Eyebrow c={C.green} size={19} style={{ marginTop: 10 }}>
          3 · La forme
        </Eyebrow>
        <CheckItem id="v5" size={24}>Le ton convient au destinataire, et ça sonne comme moi</CheckItem>
        <CheckItem id="v6" size={24}>Les formules creuses typiques de l’IA ont été retirées</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1310, top: 270, width: 490, display: 'flex', flexDirection: 'column', gap: 20, ...dl(300) }}>
        <CheckScore
          max={6}
          label="Ma routine de relecture"
          levels={[
            { min: 0, text: 'Risqué : vous signez sans lire.', tone: 'coral' },
            { min: 3, text: 'Correct, mais un fait peut passer.', tone: 'yellow' },
            { min: 6, text: 'Professionnel : l’IA propose, vous disposez.', tone: 'green' },
          ]}
        />
        <Callout title="Corriger" tone="blue" icon="pen" size={22}>
          Ne réécrivez pas tout : dites à l’IA ce qui ne va pas (« le 2e paragraphe est faux : la date est le 12 »).
        </Callout>
      </div>
    </Checklist>
  </Frame>
);

// ─── Formules utiles ────────────────────────────────────────────────────────
const M2Formula = ({ icon, tone, text, use, d }: { icon: IconName; tone: Tone; text: string; use: string; d: number }) => (
  <div className={A.pop} style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 20px', borderTop: `6px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Icon name={icon} size={26} color={STRONG[tone]} />
      <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T[tone].fg }}>{use}</span>
    </div>
    <div style={{ marginTop: 10, fontSize: 23, lineHeight: 1.38, fontWeight: 600, color: C.ink }}>« {text} »</div>
  </div>
);

const M2_Formulas: Page = () => (
  <Frame mod={2} kind="synthese">
    <Title>Huit formules à garder sous la main</Title>
    <Lede>À ajouter à la fin de n’importe quel prompt, dans n’importe quel assistant.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
      <M2Formula icon="chat" tone="violet" use="Faire préciser" text="Pose-moi des questions avant de répondre." d={100} />
      <M2Formula icon="layers" tone="blue" use="Choisir" text="Propose 3 versions différentes." d={180} />
      <M2Formula icon="smile" tone="teal" use="Simplifier" text="Explique comme à un débutant." d={260} />
      <M2Formula icon="eye" tone="coral" use="Contrôler" text="Critique ta réponse et corrige-la." d={340} />
      <M2Formula icon="alert" tone="yellow" use="Limiter les inventions" text="Si tu ne sais pas, dis-le." d={420} />
      <M2Formula icon="table" tone="navy" use="Structurer" text="Présente le résultat en tableau." d={500} />
      <M2Formula icon="filter" tone="green" use="Synthétiser" text="Résume en 5 points, 100 mots max." d={580} />
      <M2Formula icon="link" tone="pink" use="Vérifier" text="Cite tes sources avec leur lien." d={660} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(900) }}>
      <Callout title="Astuce de pro" tone="green" icon="archive" size={24}>
        Créez un document « Mes prompts » : chaque prompt qui a bien marché y entre, avec ses trous à remplir. C’est votre premier gain de temps durable.
      </Callout>
    </div>
  </Frame>
);

// ─── Atelier 2 ──────────────────────────────────────────────────────────────
const M2_Lab: Page = () => (
  <LabPage
    mod={2}
    n="2"
    title="De « Rédige un email à mon client » au prompt structuré"
    defi="prompt"
    who="Binômes"
    minutes={15}
    tools={['chatgpt', 'copilot', 'gemini', 'claude']}
    objective={
      <>
        Transformer <strong>« Rédige un email à mon client »</strong> en un prompt structuré qui produit un email professionnel adapté à une situation précise.
      </>
    }
    where={
      <>
        Le prompt structuré (5 briques), l’email obtenu, et <strong>une phrase</strong> : ce qui a le plus changé entre le prompt brut et le prompt structuré.
      </>
    }
    crit={
      <>
        <CheckItem id="l2-c1" size={21}>Les 5 briques sont présentes</CheckItem>
        <CheckItem id="l2-c2" size={21}>Aucune information n’a été inventée par l’IA</CheckItem>
        <CheckItem id="l2-c3" size={21}>L’email est envoyable après relecture</CheckItem>
        <CheckItem id="l2-c4" size={21}>Le prompt est rangé dans « Mes prompts »</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div><strong style={{ color: C.navy }}>1.</strong> Testez le prompt brut tel quel. Notez ce qui ne va pas.</div>
      <div><strong style={{ color: C.navy }}>2.</strong> Choisissez une situation : retard de livraison, relance de devis, erreur de facturation, ou la vôtre.</div>
      <div><strong style={{ color: C.navy }}>3.</strong> Écrivez le prompt avec les 5 briques. Comparez les deux emails.</div>
      <div><strong style={{ color: C.navy }}>4.</strong> Itérez au moins une fois : « plus court », « plus empathique »…</div>
    </div>
    <Bonus>Ajoutez « Pose-moi des questions avant de rédiger » : combien de questions l’IA vous pose-t-elle ?</Bonus>
  </LabPage>
);

const M2_LabFix: Page = () => (
  <Frame mod={2} kind="lab" label="Atelier 2 · Un corrigé possible" beats={2}>
    <Title size={46}>Un corrigé possible : le retard de livraison</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 880 }}>
      <CodeDark file="Prompt structuré" size={19} wrap>
        <Ck>Rôle</Ck> · Tu es responsable de compte chez un fournisseur de mobilier de bureau.{'\n'}
        <Ck>Contexte</Ck> · Notre client Alvéa attend 40 bureaux pour le 3 novembre, date de son déménagement. Notre transporteur a un retard : livraison le 13 novembre.{'\n'}
        <Ck>Objectif</Ck> · Prévenir le client, présenter nos excuses et proposer deux solutions : 10 bureaux de prêt dès le 3, ou 5 % de remise.{'\n'}
        <Ck>Contraintes</Ck> · Ton professionnel et empathique, 150 mots max, ne pas accuser le transporteur.{'\n'}
        <Ck>Format</Ck> · Objet, corps du message, signature.
      </CodeDark>
    </div>
    <ToolWindow id="claude" title="résultat" cls={b.on(1)} style={{ position: 'absolute', left: 1050, top: 190, width: 750, height: 660 }} pad={22}>
      <div style={{ fontSize: 20, lineHeight: 1.5, color: C.ink }}>
        <strong>Objet : Votre livraison du 3 novembre : deux solutions pour vous</strong>
        <br />
        <br />
        Bonjour Madame Leroy,
        <br />
        <br />
        Je vous dois une information importante : vos 40 bureaux ne pourront pas être livrés le 3 novembre, mais le 13. Je mesure la gêne que ce décalage représente en pleine période de déménagement, et je vous prie de nous en excuser.
        <br />
        <br />
        Pour que vos équipes soient installées dès le premier jour, je vous propose : <strong>10 bureaux de prêt livrés le 3 novembre</strong>, ou <strong>une remise de 5 %</strong> sur la commande.
        <br />
        <br />
        Je vous appelle demain pour en parler.
        <br />
        Bien cordialement, Thomas Garnier
      </div>
    </ToolWindow>
    <div className={b.on(2)} style={{ position: 'absolute', left: 120, top: 630, width: 880, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Callout title="Ce qui a changé" tone="green" icon="checkCircle" size={22}>
        Faits exacts, solutions concrètes, bon ton : l’email part après une relecture de 30 secondes, au lieu d’une réécriture de 10 minutes.
      </Callout>
      <Callout title="À vérifier quand même" tone="coral" icon="eye" size={22}>
        Le nom de la cliente et la promesse d’appel « demain » : l’IA les a ajoutés, sont-ils justes ?
      </Callout>
    </div>
  </Frame>
);

// ─── Quiz M2 ────────────────────────────────────────────────────────────────
const M2_Quiz: Page = () => (
  <Frame mod={2} kind="quiz">
    <Title>Quiz · Module 2</Title>
    <QuizSeries y={200}>
      <QuizQ q="« Ton chaleureux, 150 mots maximum, sans jargon » : de quelle brique s’agit-il ?" explain="Ce sont des contraintes : elles cadrent le ton, la longueur, ce qu’il faut inclure ou éviter.">
        <QOpt>Le contexte</QOpt>
        <QOpt ok>Les contraintes</QOpt>
        <QOpt>Le rôle</QOpt>
      </QuizQ>
      <QuizQ q="La réponse de l’IA est générique et passe à côté de votre situation. La cause la plus probable ?" explain="L’IA ne connaît que ce que vous lui dites : sans contexte, elle comble les trous avec du générique.">
        <QOpt ok>Le prompt manque de contexte</QOpt>
        <QOpt>L’IA est en panne</QOpt>
        <QOpt>Il faut écrire le prompt en anglais</QOpt>
      </QuizQ>
      <QuizQ q="Vous voulez que l’IA classe des emails exactement comme vous le faites. La meilleure méthode ?" explain="Deux ou trois exemples résolus montrent le format et la logique attendus : c’est plus efficace qu’une longue explication.">
        <QOpt>Lui demander de « bien classer »</QOpt>
        <QOpt ok>Lui donner deux ou trois exemples déjà classés</QOpt>
        <QOpt>Lui envoyer tous vos emails de l’année</QOpt>
      </QuizQ>
      <QuizQ q="La réponse est presque bonne mais trop longue. Que faites-vous ?" explain="On itère dans la même conversation : l’IA garde le contexte, il suffit de préciser ce qui ne va pas.">
        <QOpt>Vous recommencez une nouvelle conversation de zéro</QOpt>
        <QOpt ok>Vous demandez « plus court de moitié » dans la même conversation</QOpt>
        <QOpt>Vous raccourcissez à la main en supprimant la fin</QOpt>
      </QuizQ>
      <QuizQ q="Quelle formule limite le risque d’invention ?" explain="Autoriser explicitement l’IA à dire qu’elle ne sait pas réduit sa tendance à combler les manques par des inventions plausibles.">
        <QOpt>« Réponds vite. »</QOpt>
        <QOpt>« Sois créatif. »</QOpt>
        <QOpt ok>« Si tu ne sais pas, dis-le. »</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ═══ 30-m3 ═════════════════════════════════════════════════════════════

// ─── Module 3 · Les assistants IA pour gagner du temps ──────────────────────

const M3_Section: Page = () => (
  <Section
    n={3}
    title="Les assistants IA pour gagner du temps"
    sub="Cinq assistants généralistes, cinq personnalités : savoir ce que chacun fait le mieux, et le tester sur une même tâche."
    dur="70 min"
    labs={<DefiBadge defi="comparatif" />}
  >
    <SecItem n={1}>ChatGPT · Microsoft Copilot · Google Gemini</SecItem>
    <SecItem n={2}>Claude · Perplexity</SecItem>
    <SecItem n={3}>Banc d’essai : une même tâche, plusieurs assistants</SecItem>
    <SecItem n={4}>Quel assistant pour quelle situation ?</SecItem>
  </Section>
);
M3_Section.transition = BLOOM;

// ─── Panorama ───────────────────────────────────────────────────────────────
const M3Col = ({ id, best, lives, free, d }: { id: ToolId; best: string; lives: string; free: string; d: number }) => {
  const t = tool(id);
  return (
    <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 22px', borderTop: `8px solid ${t.c}`, display: 'flex', flexDirection: 'column', gap: 14, ...dl(d) }}>
      <ToolTile id={id} size={72} cls={A.pop} style={dl(d + 200)} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy, lineHeight: 1.15 }}>{t.short ?? t.name}</div>
      <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted }}>Idéal pour</div>
      <div style={{ fontSize: 22, lineHeight: 1.35, color: C.ink, minHeight: 90 }}>{best}</div>
      <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted }}>Il vit dans</div>
      <div style={{ fontSize: 21, lineHeight: 1.35, color: C.soft, minHeight: 60 }}>{lives}</div>
      <div style={{ marginTop: 'auto', fontSize: 19, color: C.muted, lineHeight: 1.35 }}>
        <Icon name="ticket" size={20} color={C.faint} style={{ display: 'inline-block', verticalAlign: '-4px', marginRight: 6 }} />
        {free}
      </div>
    </div>
  );
};

const M3_Panorama: Page = () => (
  <Frame mod={3}>
    <Title>Cinq assistants, cinq personnalités</Title>
    <Lede>Tous savent rédiger, résumer et répondre. Ce qui les distingue : leur terrain de jeu et leur point fort.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, height: 620, display: 'flex', gap: 20 }}>
      <M3Col id="chatgpt" best="Rédaction, brainstorming, analyse de fichiers : le polyvalent" lives="Son site, son application, le mobile" free="Gratuit · offres payantes" d={100} />
      <M3Col id="copilot" best="Vos emails, documents et réunions Microsoft" lives="Outlook, Word, Excel, PowerPoint, Teams" free="Chat gratuit · M365 Copilot payant" d={200} />
      <M3Col id="gemini" best="Vos emails et fichiers Google, la recherche approfondie" lives="Gmail, Docs, Drive, Android" free="Gratuit · offres Workspace" d={300} />
      <M3Col id="claude" best="Les longs documents et l’écriture nuancée" lives="Son site, son application" free="Gratuit · offres payantes" d={400} />
      <M3Col id="perplexity" best="Les réponses actuelles avec leurs sources" lives="Son site, son navigateur, le mobile" free="Gratuit · offre Pro" d={500} />
    </div>
  </Frame>
);

// ─── Outil 1 · ChatGPT ──────────────────────────────────────────────────────
const M3Idea = ({ n, t, time }: { n: number; t: string; time: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 19, lineHeight: 1.3 }}>
    <Num n={n} tone="green" size={28} />
    <span style={{ flex: 1 }}>{t}</span>
    <span style={{ fontFamily: mono, fontSize: 16, color: C.muted }}>{time}</span>
  </div>
);

const M3_ChatGPT: Page = () => (
  <ToolPage
    mod={3}
    id="chatgpt"
    tone="green"
    tagline="le couteau suisse"
    feats={[
      ['pen', 'Rédiger et reformuler', 'Emails, comptes rendus, posts, procédures : un premier jet en quelques secondes.'],
      ['bulb', 'Brainstormer', 'Idées de titres, plans, objections clients, questions d’entretien.'],
      ['chart', 'Analyser des fichiers', 'Un tableur ou un PDF joint : il calcule, trace des graphiques, résume.'],
      ['archive', 'Personnaliser', 'Projets et GPT personnalisés : vos consignes et documents, réutilisés à chaque fois.'],
    ]}
    exTitle="brainstorming"
    prompt="Je lance une newsletter interne mensuelle pour 300 salariés. Propose 8 rubriques récurrentes, avec le temps de préparation de chacune."
    answer={
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 26px' }}>
        <M3Idea n={1} t="Portrait d’un collègue" time="1 h" />
        <M3Idea n={2} t="Le chiffre du mois" time="15 min" />
        <M3Idea n={3} t="Bienvenue aux arrivants" time="20 min" />
        <M3Idea n={4} t="Trois questions à la direction" time="30 min" />
        <M3Idea n={5} t="L’astuce outil" time="20 min" />
        <M3Idea n={6} t="Coulisses d’un projet" time="1 h" />
        <M3Idea n={7} t="Agenda et événements" time="10 min" />
        <M3Idea n={8} t="La photo du mois" time="10 min" />
        <div style={{ gridColumn: '1 / 3', marginTop: 6, fontSize: 19, color: C.muted }}>Voulez-vous que je propose aussi un nom pour la newsletter ?</div>
      </div>
    }
    watch="Version gratuite : vos échanges peuvent servir à entraîner les modèles (désactivable dans les paramètres). Rien de confidentiel sans offre entreprise validée."
    tip="les « Projets » regroupent conversations, fichiers et consignes d’un même dossier : plus besoin de réexpliquer le contexte."
  />
);

// ─── Outil 2 · Microsoft Copilot ────────────────────────────────────────────
const M3Line = ({ icon, c, children }: { icon: IconName; c: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 19, lineHeight: 1.38 }}>
    <Icon name={icon} size={22} color={c} style={{ marginTop: 3 }} />
    <span>{children}</span>
  </div>
);

const M3_Copilot: Page = () => (
  <ToolPage
    mod={3}
    id="copilot"
    tone="blue"
    tagline="l’IA dans Microsoft 365"
    feats={[
      ['mail', 'Outlook', 'Résumer un long fil d’emails, proposer une réponse, ajuster le ton.'],
      ['doc', 'Word et PowerPoint', 'Rédiger à partir de vos fichiers, transformer un document en présentation.'],
      ['mic', 'Teams', 'Récapitulatif de réunion, décisions, tâches : « qu’est-ce que j’ai raté ? »'],
      ['table', 'Excel', 'Analyser un tableau, créer formules et graphiques en langage courant.'],
    ]}
    exTitle="Teams · après la réunion"
    prompt="Résume la réunion de ce matin sur le projet Horizon : décisions, actions avec responsable, points en suspens."
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <strong style={{ fontSize: 18, letterSpacing: '0.06em', color: C.blue }}>DÉCISIONS</strong>
        <M3Line icon="check" c={C.green}>Lancement reporté au 2 décembre · budget communication validé (12 k€)</M3Line>
        <strong style={{ fontSize: 18, letterSpacing: '0.06em', color: C.blue }}>ACTIONS</strong>
        <M3Line icon="user" c={C.blue}>Nadia : planning révisé, vendredi · Karim : devis agence, le 20</M3Line>
        <strong style={{ fontSize: 18, letterSpacing: '0.06em', color: C.blue }}>EN SUSPENS</strong>
        <M3Line icon="alert" c={C.amber}>Choix du prestataire de formation : à trancher au comité du 18</M3Line>
      </div>
    }
    watch="Copilot voit tout ce à quoi vous avez accès : un partage trop large devient visible. L’intégration à Outlook, Word et Teams demande une licence Microsoft 365 Copilot."
    tip="connectez-vous avec votre compte professionnel : vos échanges bénéficient alors de la protection des données de l’entreprise."
  />
);

// ─── Outil 3 · Google Gemini ────────────────────────────────────────────────
const M3_Gemini: Page = () => (
  <ToolPage
    mod={3}
    id="gemini"
    tone="violet"
    tagline="l’IA de Google Workspace"
    feats={[
      ['mail', 'Gmail, Docs, Drive', 'Résumer des emails, rédiger dans Docs, retrouver une info dans vos fichiers.'],
      ['search', 'Recherche approfondie', 'Deep Research parcourt des dizaines de pages et livre un rapport sourcé.'],
      ['video', 'Formats variés', 'Longs PDF, images, vidéos YouTube : il les lit et les résume.'],
      ['bot', 'Gems', 'Des assistants personnalisés avec vos consignes, réutilisables.'],
    ]}
    exTitle="Gmail · suivi fournisseur"
    prompt="@Gmail Résume mes échanges avec le fournisseur Brévia sur les deux dernières semaines et liste ce qui reste à régler."
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div>6 emails échangés entre le 28 septembre et le 9 octobre.</div>
        <M3Line icon="check" c={C.green}>Tarifs 2027 acceptés (+3,5 %), contrat signé le 2 octobre</M3Line>
        <M3Line icon="alert" c={C.amber}>À régler : facture n° 2291 en double, avoir promis mais non reçu</M3Line>
        <M3Line icon="alert" c={C.amber}>À régler : date de la livraison de novembre toujours pas confirmée</M3Line>
        <div style={{ fontSize: 19, color: C.muted }}>Je peux rédiger une relance groupée sur ces deux points.</div>
      </div>
    }
    watch="Avec un compte Gmail personnel, vos échanges peuvent être relus pour améliorer le service. Pour le travail, utilisez un compte Google Workspace professionnel."
    tip="tapez @Gmail, @Drive ou @Docs dans Gemini pour interroger directement vos emails ou vos fichiers."
  />
);

// ─── Outil 4 · Claude ───────────────────────────────────────────────────────
const M3_Claude: Page = () => (
  <ToolPage
    mod={3}
    id="claude"
    tone="yellow"
    tagline="la plume et l’analyste"
    feats={[
      ['doc', 'Longs documents', 'Rapports, contrats, appels d’offres de centaines de pages, analysés finement.'],
      ['pen', 'Qualité d’écriture', 'Un français naturel et nuancé, qui suit bien les consignes de ton.'],
      ['archive', 'Projets', 'Documents de référence et consignes partagés par toutes vos conversations.'],
      ['layers', 'Artefacts', 'Crée documents, tableaux ou mini-outils affichés à côté de la conversation.'],
    ]}
    exTitle="analyse d’un appel d’offres"
    prompt="Voici le cahier des charges (60 pages, joint). Liste les exigences éliminatoires, les dates clés et les points flous à clarifier avec l’acheteur."
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <M3Line icon="x" c={C.coral}>
          <strong>Éliminatoire :</strong> certification ISO 27001 en cours de validité (p. 12) ; références de 3 marchés similaires (p. 14)
        </M3Line>
        <M3Line icon="calendar" c={C.blue}>
          <strong>Dates :</strong> questions avant le 4 novembre · remise des offres le 18 novembre, 12 h (p. 3)
        </M3Line>
        <M3Line icon="alert" c={C.amber}>
          <strong>Flou :</strong> volume annuel « estimé » sans fourchette (p. 22) ; pénalités de retard non chiffrées (p. 41)
        </M3Line>
      </div>
    }
    watch="Vérifiez chaque point à la page citée : une page mal attribuée arrive. Aucun document client confidentiel sans offre professionnelle validée par votre entreprise."
    tip="demandez-lui de citer le passage exact et la page pour chaque point : la vérification devient immédiate."
  />
);

// ─── Outil 5 · Perplexity ───────────────────────────────────────────────────
const Src = ({ n }: { n: number }) => (
  <sup style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 22, height: 22, borderRadius: 6, background: T.teal.bg, color: T.teal.fg, fontSize: 14, fontWeight: 700, margin: '0 2px', verticalAlign: '4px' }}>
    {n}
  </sup>
);

const M3_Perplexity: Page = () => (
  <ToolPage
    mod={3}
    id="perplexity"
    tone="teal"
    tagline="la réponse avec ses sources"
    feats={[
      ['globe', 'Recherche web en temps réel', 'Une réponse rédigée à partir de pages actuelles, pas d’une mémoire figée.'],
      ['link', 'Sources numérotées', 'Chaque affirmation renvoie à sa source : on clique, on vérifie.'],
      ['loop', 'Questions de suivi', 'Il suggère les questions suivantes pour creuser le sujet.'],
    ]}
    exTitle="question réglementaire"
    prompt="Facturation électronique : quelles obligations pour une PME française, et à partir de quand ? Sources officielles en priorité."
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          Depuis le <strong>1er septembre 2026</strong>, toutes les entreprises doivent pouvoir <strong>recevoir</strong> des factures électroniques
          <Src n={1} />. Les PME devront les <strong>émettre</strong> à partir du <strong>1er septembre 2027</strong>
          <Src n={1} />
          <Src n={2} />, via une plateforme agréée
          <Src n={3} />.
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 17 }}>
          <Tag tone="teal" size={16}>1 · impots.gouv.fr</Tag>
          <Tag tone="teal" size={16}>2 · economie.gouv.fr</Tag>
          <Tag tone="teal" size={16}>3 · blog d’un éditeur</Tag>
        </div>
      </div>
    }
    watch="Une source citée n’est pas une source fiable : ouvrez-la. Site officiel, presse ou blog commercial ? Et dit-elle vraiment ce qui est affirmé ?"
    tip="pour une question réglementaire, ajoutez « sources officielles en priorité (.gouv.fr) » et vérifiez la date de chaque page."
  />
);

// ─── Atelier 3 · banc d’essai ───────────────────────────────────────────────
const M3_Lab: Page = () => (
  <LabPage
    mod={3}
    n="3"
    title="Une même tâche, plusieurs assistants"
    defi="comparatif"
    who="Binômes · 2 assistants par binôme"
    minutes={20}
    tools={['perplexity', 'chatgpt', 'copilot', 'gemini', 'claude']}
    objective={
      <>
        Réaliser la même chaîne <strong>rechercher → analyser → synthétiser → produire une réponse professionnelle</strong> avec deux assistants, et comparer.
      </>
    }
    where={
      <>
        Les deux emails finaux côte à côte, la grille de comparaison remplie, et <strong>une recommandation</strong> : quel assistant pour quelle étape ?
      </>
    }
    crit={
      <>
        <CheckItem id="l3-c1" size={21}>Les 4 étapes faites avec les 2 outils</CheckItem>
        <CheckItem id="l3-c2" size={21}>Mêmes prompts pour les deux</CheckItem>
        <CheckItem id="l3-c3" size={21}>Au moins une source vérifiée</CheckItem>
        <CheckItem id="l3-c4" size={21}>La grille est notée et argumentée</CheckItem>
      </>
    }
  >
    <div style={{ marginBottom: 10 }}>
      <strong style={{ color: C.navy }}>Le cas :</strong> votre directrice vous demande « un point rapide » sur la <strong>semaine de quatre jours</strong> : est-ce une piste
      sérieuse pour votre entreprise de services de 120 salariés ?
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div><strong style={{ color: C.navy }}>1.</strong> Chaque binôme choisit deux assistants (dont si possible Perplexity).</div>
      <div><strong style={{ color: C.navy }}>2.</strong> Copiez les 4 prompts de la page suivante, dans l’ordre, dans chaque outil.</div>
      <div><strong style={{ color: C.navy }}>3.</strong> Notez chaque assistant avec la grille, puis restitution en 1 minute.</div>
    </div>
  </LabPage>
);

const M3Step = ({ n, tone, verb, ids, children, d }: { n: number; tone: Tone; verb: string; ids: ToolId[]; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', gap: 18, alignItems: 'stretch', ...dl(d) }}>
    <div style={{ flex: 'none', width: 230, background: STRONG[tone], color: tone === 'yellow' ? C.ink : '#fff', borderRadius: 16, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 18, opacity: 0.85 }}>ÉTAPE {n}</span>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 30 }}>{verb}</span>
      <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }}>
        {ids.map((id) => (
          <ToolTile key={id} id={id} size={30} />
        ))}
      </div>
    </div>
    <div style={{ flex: 1, background: '#0F1530', borderRadius: 16, padding: '16px 22px', fontFamily: mono, fontSize: 20, lineHeight: 1.5, color: '#E6EAF6' }}>{children}</div>
  </div>
);

const M3_LabPrompts: Page = () => (
  <Frame mod={3} kind="lab" label="Atelier 3 · Les 4 prompts à enchaîner">
    <Title size={46}>Les quatre prompts, à enchaîner dans la même conversation</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <M3Step n={1} tone="teal" verb="Rechercher" ids={['perplexity', 'gemini']} d={100}>
        Quels retours d’expérience existent en France sur la semaine de quatre jours en entreprise depuis 2022 ? Donne des exemples concrets et <Cs>cite tes sources avec leur date</Cs>.
      </M3Step>
      <M3Step n={2} tone="blue" verb="Analyser" ids={['chatgpt', 'claude']} d={200}>
        À partir de ces informations, dresse un tableau <Cs>avantages / risques / conditions de réussite</Cs> pour une entreprise de services de 120 salariés.
      </M3Step>
      <M3Step n={3} tone="violet" verb="Synthétiser" ids={['claude', 'copilot']} d={300}>
        Résume l’essentiel en <Cs>5 points</Cs> pour une directrice qui a deux minutes. Signale ce qui reste incertain.
      </M3Step>
      <M3Step n={4} tone="green" verb="Produire" ids={['copilot', 'chatgpt']} d={400}>
        Rédige l’email de réponse à ma directrice : synthèse, <Cs>recommandation prudente</Cs> et prochaine étape proposée. 180 mots maximum, ton factuel.
      </M3Step>
    </div>
  </Frame>
);

// ─── Grille de comparaison (interactive) ────────────────────────────────────
const M3_CRIT = ['Pertinence', 'Sources', 'Rédaction', 'Rapidité', 'Facilité'];
const M3_IDS: ToolId[] = ['chatgpt', 'copilot', 'gemini', 'claude', 'perplexity'];

const M3_Grid: Page = () => {
  const [sc, setSc] = useState<Record<string, number>>({});
  const total = (id: string) => M3_CRIT.reduce((a, c) => a + (sc[`${id}-${c}`] ?? 0), 0);
  const best = Math.max(...M3_IDS.map(total));
  return (
    <Frame mod={3} kind="exercice">
      <Title>La grille du banc d’essai</Title>
      <Lede>Cliquez une case pour noter de 0 à 3 étoiles (un clic de plus repart à zéro). Le total s’affiche à droite.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '18px 26px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px repeat(5, 1fr) 150px', alignItems: 'center', gap: 10, padding: '6px 0 12px', borderBottom: `2px solid ${C.rule}` }}>
          <span />
          {M3_CRIT.map((c) => (
            <span key={c} style={{ textAlign: 'center', fontFamily: display, fontWeight: 700, fontSize: 20, color: C.navy }}>
              {c}
            </span>
          ))}
          <span style={{ textAlign: 'center', fontFamily: display, fontWeight: 700, fontSize: 20, color: C.navy }}>Total</span>
        </div>
        {M3_IDS.map((id) => (
          <div key={id} style={{ display: 'grid', gridTemplateColumns: '300px repeat(5, 1fr) 150px', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: `1.5px solid ${C.panel}` }}>
            <ToolChip id={id} size={24} />
            {M3_CRIT.map((c) => {
              const key = `${id}-${c}`;
              const v = sc[key] ?? 0;
              return (
                <button
                  key={c}
                  type="button"
                  data-osd-interactive
                  onClick={(e) => {
                    e.currentTarget.blur();
                    setSc((o) => ({ ...o, [key]: ((o[key] ?? 0) + 1) % 4 }));
                  }}
                  style={{ height: 62, border: 'none', borderRadius: 12, cursor: 'pointer', background: v ? T.yellow.bg : C.panel, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                >
                  {[1, 2, 3].map((i) => (
                    <Icon key={i} name="star" size={28} color={i <= v ? C.amber : C.faint} sw={1.8} style={i <= v ? { fill: C.yellow } : undefined} />
                  ))}
                </button>
              );
            })}
            <span style={{ textAlign: 'center', fontFamily: display, fontWeight: 800, fontSize: 38, color: total(id) && total(id) === best ? C.green : C.navy }}>
              {total(id)}
              <span style={{ fontSize: 20, color: C.faint }}> /15</span>
            </span>
          </div>
        ))}
      </div>
      <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(600) }}>
        Pas de vainqueur absolu : la conclusion attendue est « tel outil pour telle étape ».
      </Hint>
    </Frame>
  );
};

// ─── Quel assistant pour quelle situation ? (cartes à retourner) ────────────
const M3Flip = ({ situation, id, why, d }: { situation: string; id: ToolId; why: string; d: number }) => (
  <FlipCard
    w={530}
    h={270}
    cls={A.in}
    style={dl(d)}
    tone="violet"
    backTone="green"
    front={
      <>
        <Eyebrow c={C.violet} size={17}>
          Situation
        </Eyebrow>
        <div style={{ marginTop: 10, fontSize: 26, lineHeight: 1.35, fontWeight: 600, color: C.ink }}>{situation}</div>
      </>
    }
    back={
      <>
        <ToolChip id={id} size={30} full />
        <div style={{ marginTop: 16, fontSize: 22, lineHeight: 1.4, color: C.ink }}>{why}</div>
      </>
    }
  />
);

const M3_Which: Page = () => (
  <Frame mod={3} kind="exercice">
    <Title>Quel assistant pour quelle situation ?</Title>
    <Lede>Le groupe vote, puis on retourne la carte. Plusieurs réponses sont parfois défendables : argumentez !</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 530px)', gap: 45, rowGap: 30 }}>
      <M3Flip d={100} situation="Résumer un fil de 40 emails reçu dans Outlook" id="copilot" why="Il est déjà dans Outlook : un clic sur « Résumer », sans copier-coller." />
      <M3Flip d={180} situation="Trouver les chiffres récents d’un marché, avec sources" id="perplexity" why="Recherche web en temps réel et sources numérotées à vérifier." />
      <M3Flip d={260} situation="Analyser un appel d’offres de 80 pages" id="claude" why="Excellent sur les longs documents, et capable de citer les pages. Gemini fait aussi l’affaire." />
      <M3Flip d={340} situation="Trouver 20 idées de noms pour un nouveau service" id="chatgpt" why="Brainstorming : le polyvalent par excellence. Tous les assistants s’en sortent bien." />
      <M3Flip d={420} situation="Retrouver une information perdue dans ma messagerie Gmail" id="gemini" why="Avec @Gmail, il interroge directement vos emails Google." />
      <M3Flip d={500} situation="Préparer des slides à partir d’un document Word" id="copilot" why="Dans PowerPoint, Copilot crée une présentation à partir d’un fichier Word." />
    </div>
  </Frame>
);

// ─── Quiz M3 ────────────────────────────────────────────────────────────────
const M3_Quiz: Page = () => (
  <Frame mod={3} kind="quiz">
    <Title>Quiz · Module 3</Title>
    <QuizSeries y={200}>
      <QuizQ q="Quel assistant affiche systématiquement des sources numérotées issues du web ?" explain="Perplexity rédige sa réponse à partir de pages web actuelles et numérote chaque source citée.">
        <QOpt>Claude</QOpt>
        <QOpt ok>Perplexity</QOpt>
        <QOpt>Microsoft Copilot dans Excel</QOpt>
      </QuizQ>
      <QuizQ q="Copilot dans Microsoft 365 peut accéder…" explain="Copilot respecte vos droits : il voit ce que vous pouvez voir. Un partage trop large devient donc visible. D’où l’importance de bien gérer les droits.">
        <QOpt>à tous les fichiers de l’entreprise, sans exception</QOpt>
        <QOpt ok>aux fichiers et emails auxquels vous avez déjà accès</QOpt>
        <QOpt>uniquement à internet</QOpt>
      </QuizQ>
      <QuizQ q="Pour analyser un contrat de 120 pages, le meilleur réflexe est…" explain="Les assistants à large contexte comme Claude ou Gemini lisent de longs documents ; demander la page citée rend la vérification rapide.">
        <QOpt>de demander un résumé sans joindre le contrat</QOpt>
        <QOpt ok>de le joindre et demander de citer la page de chaque point</QOpt>
        <QOpt>de le coller dans un outil de traduction</QOpt>
      </QuizQ>
      <QuizQ q="Vous utilisez un compte personnel gratuit. Que pouvez-vous y coller ?" explain="Avec un compte personnel gratuit, vos échanges peuvent servir à l’entraînement ou être relus : uniquement des contenus non sensibles.">
        <QOpt>Le fichier clients pour le segmenter</QOpt>
        <QOpt>Les bulletins de salaire de l’équipe</QOpt>
        <QOpt ok>Un texte public ou un cas anonymisé</QOpt>
      </QuizQ>
      <QuizQ q="Au banc d’essai, la bonne conclusion est généralement…" explain="Chaque assistant a ses forces : on choisit l’outil selon l’étape (rechercher, analyser, rédiger) et selon l’environnement de travail.">
        <QOpt>« un seul outil est le meilleur pour tout »</QOpt>
        <QOpt ok>« tel outil pour telle étape, selon mon environnement »</QOpt>
        <QOpt>« le plus cher est toujours le meilleur »</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ═══ 40-m4 ═════════════════════════════════════════════════════════════

// ─── Module 4 · Rechercher, analyser et exploiter l’information ─────────────

const M4_Section: Page = () => (
  <Section
    n={4}
    title="Rechercher, analyser et exploiter l’information"
    sub="Trouver vite, vérifier toujours : des outils qui citent leurs sources, et une méthode pour ne jamais prendre une réponse IA pour une information vérifiée."
    dur="45 min"
    labs={<DefiBadge defi="recherche" />}
  >
    <SecItem n={1}>Perplexity · la recherche assistée par IA</SecItem>
    <SecItem n={2}>NotebookLM · interroger ses propres documents</SecItem>
    <SecItem n={3}>Elicit et Consensus · la recherche scientifique</SecItem>
    <SecItem n={4}>Cas pratique : de la recherche à la note professionnelle</SecItem>
  </Section>
);
M4_Section.transition = BLOOM;

// ─── D’où vient la réponse ? ────────────────────────────────────────────────
const M4Src = ({ id, icon, where, good, d }: { id: ToolId; icon: IconName; where: string; good: string; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 24px', display: 'flex', flexDirection: 'column', gap: 16, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <ToolTile id={id} size={58} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{tool(id).short ?? tool(id).name}</div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: T.grey.bg, borderRadius: 14, padding: '14px 16px' }}>
      <Icon name={icon} size={38} color={tool(id).c} />
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted }}>Il cherche dans</div>
        <div style={{ fontSize: 23, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{where}</div>
      </div>
    </div>
    <div style={{ fontSize: 22, lineHeight: 1.4, color: C.soft }}>{good}</div>
  </div>
);

const M4_Where: Page = () => (
  <Frame mod={4} beats={1}>
    <Title>La première question : d’où vient la réponse ?</Title>
    <Lede>Quatre outils de recherche, quatre réservoirs d’information différents. Le bon choix dépend de ce que vous cherchez.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, height: 440, display: 'flex', gap: 22 }}>
      <M4Src id="perplexity" icon="globe" where="Le web, en temps réel" good="Actualité, réglementation, marché, veille : ce qui a changé récemment." d={100} />
      <M4Src id="notebooklm" icon="folder" where="Vos documents, et eux seuls" good="Procédures, contrats, rapports internes : répondre à partir de vos sources." d={200} />
      <M4Src id="elicit" icon="book" where="Les publications scientifiques" good="Revue de littérature, extraction de données d’études, en profondeur." d={300} />
      <M4Src id="consensus" icon="flask" where="Les publications scientifiques" good="Une question fermée : que disent les études ? Oui, non, peut-être." d={400} />
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 750, width: 1680 }}>
      <Callout title="Le piège à éviter" tone="coral" icon="alert" size={25}>
        Un assistant sans accès au web répond <strong>de mémoire</strong> : il peut être daté, et inventer. Pour une information factuelle, choisissez un outil qui montre ses sources.
      </Callout>
    </div>
  </Frame>
);

// ─── Outil 6 · Perplexity (angle recherche) ─────────────────────────────────
const M4_Perplexity: Page = () => (
  <ToolPage
    mod={4}
    id="perplexity"
    tone="teal"
    tagline="la recherche assistée par IA"
    feats={[
      ['search', 'Recherche approfondie', 'Il lance des dizaines de recherches et livre un rapport structuré et sourcé.'],
      ['folder', 'Espaces', 'Regroupez une veille : consignes, fichiers et recherches d’un même sujet.'],
      ['filter', 'Choix des sources', 'Web, publications académiques, vos fichiers : vous orientez la recherche.'],
    ]}
    exTitle="recherche approfondie"
    prompt="Recherche approfondie : le télétravail en France aujourd’hui. Chiffres clés, tendances, débats en cours. Sources de moins de 2 ans."
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Tag tone="teal" size={16}>
            <Icon name="doc" size={16} /> Rapport de 4 pages
          </Tag>
          <Tag tone="teal" size={16}>
            <Icon name="link" size={16} /> Plusieurs dizaines de sources
          </Tag>
          <Tag tone="teal" size={16}>
            <Icon name="clock" size={16} /> Quelques minutes
          </Tag>
        </div>
        <M3Line icon="check" c={C.teal}>1. Qui télétravaille, et combien de jours par semaine</M3Line>
        <M3Line icon="check" c={C.teal}>2. Ce que disent les accords d’entreprise récents</M3Line>
        <M3Line icon="check" c={C.teal}>3. Effets observés : productivité, bien-être, immobilier</M3Line>
        <M3Line icon="check" c={C.teal}>4. Débats : retour au bureau, équité entre métiers</M3Line>
        <M3Line icon="alert" c={C.amber}>5. Limites : chiffres d’enquêtes aux méthodes différentes</M3Line>
      </div>
    }
    watch="Vérifiez au moins les 3 sources qui portent les chiffres clés : date, auteur, et la phrase exacte. Un rapport sourcé n’est pas un rapport vérifié."
    tip="demandez « signale les points où les sources se contredisent » : c’est souvent là que se cache l’information utile."
  />
);

// ─── Outil 7 · NotebookLM ───────────────────────────────────────────────────
const M4_NotebookLM: Page = () => (
  <ToolPage
    mod={4}
    id="notebooklm"
    tone="violet"
    tagline="interrogez vos documents"
    feats={[
      ['folder', 'Vos sources uniquement', 'PDF, Docs, sites, vidéos : il ne répond qu’à partir de ce que vous chargez.'],
      ['link', 'Citations cliquables', 'Chaque phrase renvoie au passage exact du document.'],
      ['mic', 'Résumé audio', 'Vos documents transformés en discussion façon podcast, à écouter.'],
      ['map', 'Cartes mentales et guides', 'FAQ, fiches de synthèse, chronologies générées en un clic.'],
    ]}
    exTitle="3 sources RH chargées (fictives)"
    prompt="Un salarié en télétravail peut-il se faire rembourser son abonnement internet ?"
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <strong>Pas séparément.</strong> L’accord télétravail prévoit une indemnité forfaitaire par jour télétravaillé, qui couvre les frais de connexion
          <Src n={1} />. Le guide des notes de frais exclut tout remboursement distinct de l’abonnement
          <Src n={2} />.
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Tag tone="violet" size={16}>1 · Accord télétravail, art. 6</Tag>
          <Tag tone="violet" size={16}>2 · Guide notes de frais, p. 4</Tag>
        </div>
        <div style={{ fontSize: 18, color: C.muted }}>Le règlement intérieur ne traite pas cette question.</div>
      </div>
    }
    watch="Il ne connaît que vos sources : si elles sont obsolètes ou incomplètes, la réponse aussi. Documents internes : uniquement avec un compte professionnel autorisé."
    tip="le « résumé audio » transforme 50 pages en 10 minutes d’écoute : idéal pour découvrir un dossier dans les transports."
  />
);

// ─── Outil 8 · Elicit ───────────────────────────────────────────────────────
const M4Row = ({ cells, head = false }: { cells: string[]; head?: boolean }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr 1.4fr',
      gap: 12,
      padding: '7px 10px',
      fontSize: head ? 15 : 18,
      fontWeight: head ? 700 : 400,
      letterSpacing: head ? '0.08em' : 0,
      textTransform: head ? 'uppercase' : 'none',
      color: head ? C.muted : C.ink,
      background: head ? 'transparent' : T.grey.bg,
      borderRadius: 8,
    }}
  >
    {cells.map((c) => (
      <span key={c}>{c}</span>
    ))}
  </div>
);

const M4_Elicit: Page = () => (
  <ToolPage
    mod={4}
    id="elicit"
    tone="green"
    tagline="l’assistant de recherche scientifique"
    feats={[
      ['search', 'Recherche par question', 'Posez une question, il trouve les articles scientifiques pertinents.'],
      ['table', 'Extraction en tableau', 'Population, méthode, résultats : une colonne par information, une ligne par étude.'],
      ['layers', 'Synthèse des résultats', 'Un résumé des principaux constats, avec lien vers chaque article.'],
    ]}
    exTitle="revue de littérature"
    prompt="Quels sont les effets du télétravail sur la productivité ? Extrais : population, méthode, résultat principal."
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <M4Row head cells={['Étude', 'Population', 'Résultat principal']} />
        <M4Row cells={['Étude A · 2021', 'Centre d’appels', 'Productivité en hausse']} />
        <M4Row cells={['Étude B · 2023', 'Ingénieurs', 'Effet neutre, moins de départs']} />
        <M4Row cells={['Étude C · 2022', 'Enquête multi-secteurs', 'Variable selon le métier']} />
        <div style={{ fontSize: 16, color: C.faint }}>Illustration : études et résultats fictifs.</div>
      </div>
    }
    watch="Corpus surtout anglophone et académique. Une étude n’est pas une vérité : lisez au moins le résumé des articles clés avant de citer un résultat."
    tip="posez la question en anglais pour des résultats plus complets, puis demandez la synthèse en français."
  />
);

// ─── Outil 9 · Consensus ────────────────────────────────────────────────────
const M4Meter = ({ label, pct, c }: { label: string; pct: number; c: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 19 }}>
    <span style={{ width: 120 }}>{label}</span>
    <div style={{ flex: 1, height: 20, borderRadius: 10, background: C.panel, overflow: 'hidden' }}>
      <div className={b.grow(1)} style={{ width: `${pct}%`, height: '100%', background: c, ...dl(300) }} />
    </div>
    <span style={{ width: 54, textAlign: 'right', fontFamily: mono, fontSize: 18 }}>{pct} %</span>
  </div>
);

const M4_Consensus: Page = () => (
  <ToolPage
    mod={4}
    id="consensus"
    tone="yellow"
    tagline="ce que disent les études"
    feats={[
      ['flask', 'Réponses issues de la science', 'Il cherche uniquement dans des publications scientifiques évaluées par des pairs.'],
      ['gauge', 'Le « Consensus Meter »', 'Pour une question oui / non : la répartition des études qui disent oui, non, peut-être.'],
      ['filter', 'Filtres de qualité', 'Méta-analyses, essais contrôlés, année, domaine : on trie les preuves.'],
    ]}
    exTitle="question fermée"
    prompt="Les pauses courtes et régulières améliorent-elles la concentration au travail ?"
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <M4Meter label="Oui" pct={68} c={C.green} />
        <M4Meter label="Peut-être" pct={21} c={C.yellow} />
        <M4Meter label="Non" pct={11} c={C.coral} />
        <div style={{ fontSize: 19, lineHeight: 1.4 }}>La majorité des études trouvent un effet positif, surtout sur la fatigue ; les effets sur la performance varient.</div>
        <div style={{ fontSize: 16, color: C.faint }}>Illustration : répartition fictive.</div>
      </div>
    }
    watch="Le compteur additionne des études, il ne pèse pas leur qualité : une méta-analyse vaut plus que dix petites études. Ouvrez les plus citées."
    tip="filtrez sur « méta-analyses » et « revues systématiques » : vous obtenez directement les synthèses les plus solides."
  />
);

// ─── Méthode : 4 questions avant de croire ──────────────────────────────────
const M4Check = ({ n, icon, q, children }: { n: number; icon: IconName; q: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 26px', borderTop: `7px solid ${C.navy}`, display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Num n={n} tone="navy" size={50} />
      <IconTile name={icon} tone="navy" size={50} />
    </div>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: C.navy }}>{q}</div>
    <div style={{ fontSize: 22, lineHeight: 1.42, color: C.soft }}>{children}</div>
  </div>
);

const M4_Method: Page = () => (
  <Frame mod={4} beats={5}>
    <Title>Quatre questions avant de croire une réponse IA</Title>
    <Lede>Trente secondes par affirmation importante. C’est le prix d’une note que l’on peut signer.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
      <M4Check n={1} icon="user" q="Qui ?">
        Qui parle ? Un organisme officiel, un média, un chercheur… ou une entreprise qui vend quelque chose ?
      </M4Check>
      <M4Check n={2} icon="calendar" q="Quand ?">
        De quand date la source ? Une règle de 2019 a peut-être changé depuis.
      </M4Check>
      <M4Check n={3} icon="eye" q="Quoi ?">
        La source dit-elle vraiment ce que l’IA affirme ? Lisez la phrase, pas le résumé.
      </M4Check>
      <M4Check n={4} icon="layers" q="Recoupé ?">
        Une deuxième source indépendante dit-elle la même chose ?
      </M4Check>
    </div>
    <div className={b.on(5)} style={{ position: 'absolute', left: 120, top: 760, width: 1680 }}>
      <Callout title="Règle de la journée" tone="coral" icon="shieldCheck" size={25}>
        Une réponse IA, même sourcée, est une <strong>piste</strong>. Elle devient une <strong>information</strong> quand vous l’avez vérifiée.
      </Callout>
    </div>
  </Frame>
);

// ─── Jeu : fiable ou pas ? ──────────────────────────────────────────────────
const M4Flip = ({ src, kind, verdict, ok, d }: { src: string; kind: string; verdict: string; ok: 'ok' | 'mid' | 'ko'; d: number }) => (
  <FlipCard
    w={530}
    h={250}
    cls={A.in}
    style={dl(d)}
    tone="navy"
    backTone={ok === 'ok' ? 'green' : ok === 'mid' ? 'yellow' : 'coral'}
    front={
      <>
        <Eyebrow c={C.muted} size={16}>
          {kind}
        </Eyebrow>
        <div style={{ marginTop: 10, fontSize: 25, lineHeight: 1.35, fontWeight: 600, color: C.ink }}>{src}</div>
      </>
    }
    back={
      <>
        <Eyebrow c={ok === 'ok' ? T.green.fg : ok === 'mid' ? T.yellow.fg : T.coral.fg} size={20}>
          {ok === 'ok' ? '✓ Fiable' : ok === 'mid' ? '≈ À recouper' : '✗ Insuffisant seul'}
        </Eyebrow>
        <div style={{ marginTop: 12, fontSize: 22, lineHeight: 1.4, color: C.ink }}>{verdict}</div>
      </>
    }
  />
);

const M4_Game: Page = () => (
  <Frame mod={4} kind="exercice">
    <Title>Fiable, à recouper, ou insuffisant ?</Title>
    <Lede>Perplexity vous cite ces six sources. Votez pour chacune, puis retournez la carte.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 530px)', gap: 45, rowGap: 30 }}>
      <M4Flip d={100} kind="Site officiel" src="Une page service-public.fr mise à jour le mois dernier" ok="ok" verdict="Source officielle et récente : la référence pour une règle. Vérifiez quand même la date d’entrée en vigueur." />
      <M4Flip d={180} kind="Presse" src="Un article de grand quotidien… de 2019" ok="mid" verdict="Média sérieux, mais daté : la situation a pu changer. Cherchez une source plus récente." />
      <M4Flip d={260} kind="Blog d’entreprise" src="« 10 chiffres clés » sur le blog d’un éditeur de logiciel" ok="ko" verdict="Contenu marketing : chiffres souvent sans méthode, et un intérêt à vendre. Remontez à l’étude d’origine." />
      <M4Flip d={340} kind="Forum" src="Une discussion très populaire sur un forum d’entraide" ok="ko" verdict="Témoignages utiles pour comprendre un problème, jamais pour établir un fait ou une règle." />
      <M4Flip d={420} kind="Étude scientifique" src="Une méta-analyse publiée dans une revue à comité de lecture" ok="ok" verdict="Le plus haut niveau de preuve : elle synthétise de nombreuses études. Lisez au moins le résumé." />
      <M4Flip d={500} kind="Communiqué" src="Le communiqué de presse d’une entreprise sur ses résultats" ok="mid" verdict="Fiable sur ce que dit l’entreprise d’elle-même, pas sur ce qu’en pensent les autres. À recouper." />
    </div>
  </Frame>
);

// ─── Cas pratique ───────────────────────────────────────────────────────────
const M4Pipe = ({ steps }: { steps: [string, ToolId[]][] }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
    {steps.map(([s, ids], i) => (
      <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ background: T.navy.bg, borderRadius: 12, padding: '8px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 19, color: C.navy }}>{s}</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {ids.map((id) => (
              <ToolTile key={id} id={id} size={26} />
            ))}
          </div>
        </div>
        {i < steps.length - 1 ? <Icon name="arrow" size={22} color={C.faint} /> : null}
      </div>
    ))}
  </div>
);

const M4_Lab: Page = () => (
  <LabPage
    mod={4}
    n="4"
    title="De la recherche à la note professionnelle"
    defi="recherche"
    who="Binômes"
    minutes={20}
    tools={['perplexity', 'notebooklm', 'claude', 'copilot']}
    label="Module 4 · Cas pratique"
    objective={
      <>
        Produire une <strong>note d’une page</strong>, vérifiée et sourcée, à partir de plusieurs sources : recherche → vérification → synthèse → note.
      </>
    }
    where={
      <>
        La note d’une page (modèle page suivante) et la <strong>fiche de vérification</strong> : chaque affirmation clé avec sa source et son statut.
      </>
    }
    crit={
      <>
        <CheckItem id="l4-c1" size={21}>Au moins 3 sources ouvertes et lues</CheckItem>
        <CheckItem id="l4-c2" size={21}>Chaque chiffre a sa source datée</CheckItem>
        <CheckItem id="l4-c3" size={21}>Une affirmation écartée et pourquoi</CheckItem>
        <CheckItem id="l4-c4" size={21}>La note tient sur une page</CheckItem>
      </>
    }
  >
    <div>
      <strong style={{ color: C.navy }}>Le sujet :</strong> votre direction RH se demande si elle doit proposer le <strong>forfait mobilités durables</strong> aux salariés. Que dit la règle,
      combien ça coûte, qui l’a fait ?
    </div>
    <M4Pipe
      steps={[
        ['Rechercher', ['perplexity']],
        ['Vérifier', ['perplexity']],
        ['Synthétiser', ['notebooklm']],
        ['Rédiger', ['claude', 'copilot']],
      ]}
    />
    <div style={{ marginTop: 12, fontSize: 21 }}>
      Étape 3 : chargez dans NotebookLM <strong>uniquement les sources vérifiées</strong>, puis interrogez-les.
    </div>
  </LabPage>
);

// ─── Fiche de vérification (interactive) ────────────────────────────────────
const M4_KINDS = ['Officiel', 'Presse', 'Étude', 'Blog', 'Forum'];
const M4_STATES: { t: string; tone: Tone; icon: IconName }[] = [
  { t: 'À vérifier', tone: 'grey', icon: 'eye' },
  { t: 'Confirmé', tone: 'green', icon: 'check' },
  { t: 'Incertain', tone: 'yellow', icon: 'alert' },
  { t: 'Écarté', tone: 'coral', icon: 'x' },
];

const M4Cycle = ({ label, tone, icon, onClick, w }: { label: string; tone: Tone; icon?: IconName; onClick: () => void; w: number }) => (
  <button
    type="button"
    data-osd-interactive
    onClick={(e) => {
      e.currentTarget.blur();
      onClick();
    }}
    style={{ width: w, height: 52, border: 'none', borderRadius: 12, cursor: 'pointer', background: T[tone].bg, color: T[tone].fg, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: body, fontWeight: 700, fontSize: 20 }}
  >
    {icon ? <Icon name={icon} size={22} sw={2.6} /> : null}
    {label}
  </button>
);

const M4_Sheet: Page = () => {
  const [kind, setKind] = useState<Record<number, number>>({});
  const [st, setSt] = useState<Record<number, number>>({});
  const rows = [1, 2, 3, 4, 5];
  const done = rows.filter((r) => (st[r] ?? 0) !== 0).length;
  return (
    <Frame mod={4} kind="lab" label="Cas pratique · Fiche de vérification">
      <Title size={46}>La fiche de vérification</Title>
      <Lede top={164}>Une ligne par affirmation clé. Cliquez le type de source, puis le statut, pour la faire évoluer en direct.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 250, width: 1680, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '18px 26px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 200px 220px', gap: 16, padding: '4px 0 12px', borderBottom: `2px solid ${C.rule}`, fontSize: 17, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted }}>
          <span>N°</span>
          <span>Affirmation · source · date</span>
          <span style={{ textAlign: 'center' }}>Type de source</span>
          <span style={{ textAlign: 'center' }}>Statut</span>
        </div>
        {rows.map((r) => {
          const s = M4_STATES[st[r] ?? 0];
          return (
            <div key={r} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 200px 220px', gap: 16, alignItems: 'center', padding: '12px 0', borderBottom: `1.5px solid ${C.panel}` }}>
              <Num n={r} tone="navy" size={40} />
              <div style={{ height: 52, borderRadius: 12, boxShadow: `inset 0 0 0 1.5px ${C.rule}`, display: 'flex', alignItems: 'center', padding: '0 18px', fontSize: 20, color: C.faint }}>
                « … » · nom du site ou du document · date de publication
              </div>
              <M4Cycle w={200} label={M4_KINDS[kind[r] ?? 0]} tone="navy" onClick={() => setKind((o) => ({ ...o, [r]: ((o[r] ?? 0) + 1) % M4_KINDS.length }))} />
              <M4Cycle w={220} label={s.t} tone={s.tone} icon={s.icon} onClick={() => setSt((o) => ({ ...o, [r]: ((o[r] ?? 0) + 1) % M4_STATES.length }))} />
            </div>
          );
        })}
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 890, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 22, color: C.muted, ...dl(500) }}>
        <Icon name="checkCircle" size={26} color={done === 5 ? C.green : C.faint} />
        {done} affirmation{done > 1 ? 's' : ''} sur 5 traitée{done > 1 ? 's' : ''} · seules les affirmations « Confirmé » entrent dans la note.
      </div>
    </Frame>
  );
};

// ─── Modèle de note professionnelle ─────────────────────────────────────────
const M4Part = ({ n, title, children, d }: { n: number; title: string; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', ...dl(d) }}>
    <Num n={n} tone="blue" size={40} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 24, color: C.navy }}>{title}</div>
      <div style={{ fontSize: 20, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M4_Note: Page = () => (
  <Frame mod={4} kind="lab" label="Cas pratique · Modèle de note">
    <Title size={46}>Le modèle de note d’une page</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 760, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M4Part n={1} title="Objet" d={100}>
        La question posée, en une phrase.
      </M4Part>
      <M4Part n={2} title="L’essentiel en 3 points" d={180}>
        Ce que le lecteur doit retenir s’il ne lit que ça.
      </M4Part>
      <M4Part n={3} title="Éléments clés" d={260}>
        Règle, coûts, exemples : chaque chiffre avec sa source.
      </M4Part>
      <M4Part n={4} title="Recommandation" d={340}>
        Ce que vous proposez, et la prochaine étape.
      </M4Part>
      <M4Part n={5} title="Sources et limites" d={420}>
        Liste datée des sources ; ce qui reste incertain.
      </M4Part>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 930, top: 190, width: 870, ...dl(300) }}>
      <CodeDark file="Prompt de rédaction · dans NotebookLM ou votre assistant" size={21} wrap>
        Tu es chargé d’études RH. À partir <Cs>uniquement des sources fournies</Cs>, rédige une note d’une page pour la directrice des ressources humaines sur le forfait mobilités durables.{'\n\n'}
        Structure : objet · l’essentiel en 3 points · éléments clés · recommandation · sources et limites.{'\n\n'}
        Cite la source de chaque chiffre. <Cs>Si une information manque, écris « non trouvé dans les sources »</Cs>. 350 mots maximum.
      </CodeDark>
      <Callout title="Dernier contrôle" tone="coral" icon="eye" cls={A.fade} style={{ marginTop: 22, ...dl(700) }} size={22}>
        Relisez chaque chiffre de la note face à votre fiche de vérification : ce n’est pas l’IA qui signe, c’est vous.
      </Callout>
    </div>
  </Frame>
);

// ─── Quiz M4 ────────────────────────────────────────────────────────────────
const M4_Quiz: Page = () => (
  <Frame mod={4} kind="quiz">
    <Title>Quiz · Module 4</Title>
    <QuizSeries y={200}>
      <QuizQ q="Vous voulez interroger uniquement le règlement intérieur et l’accord télétravail de votre entreprise. Quel outil ?" explain="NotebookLM répond uniquement à partir des documents que vous lui donnez, avec des citations vers le passage exact.">
        <QOpt>Consensus</QOpt>
        <QOpt ok>NotebookLM</QOpt>
        <QOpt>Runway</QOpt>
      </QuizQ>
      <QuizQ q="Perplexity cite 5 sources dans sa réponse. Vous pouvez donc…" explain="Une source citée doit être ouverte et lue : vérifier qui parle, la date, et que la phrase dit bien ce qui est affirmé.">
        <QOpt>copier la réponse : elle est vérifiée</QOpt>
        <QOpt ok>ouvrir les sources clés et vérifier ce qu’elles disent vraiment</QOpt>
        <QOpt>citer Perplexity comme source dans votre note</QOpt>
      </QuizQ>
      <QuizQ q="« Les études montrent-elles que X améliore Y ? » Quel outil donne une répartition oui / non / peut-être ?" explain="Le Consensus Meter de Consensus montre la répartition des conclusions des études sur une question fermée.">
        <QOpt ok>Consensus</QOpt>
        <QOpt>Gamma</QOpt>
        <QOpt>DeepL</QOpt>
      </QuizQ>
      <QuizQ q="Quelle source est la plus fiable pour une règle administrative ?" explain="Un site officiel à jour fait foi pour une règle ; les blogs commerciaux et forums ne suffisent jamais seuls.">
        <QOpt>Un forum très fréquenté</QOpt>
        <QOpt>Le blog d’un éditeur de logiciel</QOpt>
        <QOpt ok>Un site officiel mis à jour récemment</QOpt>
      </QuizQ>
      <QuizQ q="Elicit vous extrait un résultat d’étude intéressant. Avant de le citer…" explain="Une étude isolée n’est pas une vérité : on lit au moins le résumé de l’article pour vérifier le contexte, la population et la méthode.">
        <QOpt ok>vous lisez au moins le résumé de l’article</QOpt>
        <QOpt>vous le citez : Elicit ne se trompe jamais</QOpt>
        <QOpt>vous le traduisez dans DeepL</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ═══ 50-m5 ═════════════════════════════════════════════════════════════

// ─── Module 5 · Rédiger plus rapidement et améliorer ses documents ──────────

const M5_Section: Page = () => (
  <Section
    n={5}
    title="Rédiger plus vite, et mieux"
    sub="Corriger, reformuler, traduire, mettre en slides, illustrer : un outil spécialisé par étape, et vos documents prennent forme en quelques minutes."
    dur="50 min"
    labs={<DefiBadge defi="redaction" />}
  >
    <SecItem n={1}>Grammarly · corriger et améliorer ses textes</SecItem>
    <SecItem n={2}>DeepL et DeepL Write · traduire et reformuler</SecItem>
    <SecItem n={3}>Canva AI · créer des supports visuels</SecItem>
    <SecItem n={4}>Gamma · créer une présentation en une minute</SecItem>
  </Section>
);
M5_Section.transition = BLOOM;

// ─── La chaîne rédactionnelle ───────────────────────────────────────────────
const M5Stage = ({ n, icon, verb, ids, sub }: { n: number; icon: IconName; verb: string; ids: ToolId[]; sub: string }) => (
  <div className={b.pop(n)} style={{ width: 300, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
    <IconTile name={icon} tone="green" size={64} solid />
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{verb}</div>
    <div style={{ fontSize: 19, color: C.soft, lineHeight: 1.35, minHeight: 52 }}>{sub}</div>
    <div style={{ display: 'flex', gap: 8 }}>
      {ids.map((id) => (
        <ToolChip key={id} id={id} size={19} />
      ))}
    </div>
  </div>
);

const M5_Chain: Page = () => (
  <Frame mod={5} beats={5}>
    <Title>Un document, cinq étapes, un outil par étape</Title>
    <Lede>L’assistant écrit le premier jet. Les spécialistes le rendent impeccable, multilingue et présentable.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 300, width: 1680, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <M5Stage n={1} icon="pen" verb="Écrire" ids={['chatgpt']} sub="Le premier jet à partir de notes" />
      <Icon name="arrow" size={34} color={C.faint} cls={b.fade(2)} />
      <M5Stage n={2} icon="check" verb="Corriger" ids={['grammarly']} sub="Fautes, clarté, ton" />
      <Icon name="arrow" size={34} color={C.faint} cls={b.fade(3)} />
      <M5Stage n={3} icon="translate" verb="Traduire" ids={['deepl']} sub="Texte ou document entier" />
      <Icon name="arrow" size={34} color={C.faint} cls={b.fade(4)} />
      <M5Stage n={4} icon="slides" verb="Présenter" ids={['gamma']} sub="Des slides en une minute" />
      <Icon name="arrow" size={34} color={C.faint} cls={b.fade(5)} />
      <M5Stage n={5} icon="image" verb="Illustrer" ids={['canva']} sub="Affiche, post, visuel" />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 720, width: 1680, ...dl(600) }}>
      <Callout title="Le bon réflexe" tone="green" icon="bulb" size={24}>
        Ne demandez pas tout à un seul outil. Un assistant généraliste fait tout « correctement » ; un spécialiste fait sa tâche <strong>très bien</strong>.
      </Callout>
    </div>
  </Frame>
);

// ─── Outil 10 · Grammarly ───────────────────────────────────────────────────
const Fix = ({ from, to }: { from: string; to: string }) => (
  <span>
    <span style={{ textDecoration: 'line-through', textDecorationColor: C.coral, color: C.muted }}>{from}</span>{' '}
    <span style={{ background: T.green.bg, color: T.green.fg, fontWeight: 700, borderRadius: 5, padding: '0 5px' }}>{to}</span>
  </span>
);

const M5_Grammarly: Page = () => (
  <ToolPage
    mod={5}
    id="grammarly"
    tone="green"
    tagline="le correcteur intelligent"
    feats={[
      ['check', 'Correction en temps réel', 'Orthographe, grammaire, ponctuation, pendant que vous tapez.'],
      ['smile', 'Détecteur de ton', 'Votre message sonne-t-il sec, hésitant, confiant ? Il vous le dit.'],
      ['loop', 'Reformulation', 'Plus clair, plus court, plus formel : une phrase réécrite en un clic.'],
      ['globe', 'Partout où vous écrivez', 'Extension navigateur, Outlook, Word, Google Docs.'],
    ]}
    exTitle="email en anglais"
    prompt="We was not able to deliver your order in time, sorry for that. We will try to send it asap if it's possible for you."
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ lineHeight: 1.7 }}>
          We <Fix from="was" to="were" /> not able to deliver your order <Fix from="in time, sorry for that" to="on time, and we apologize" />. We will{' '}
          <Fix from="try to send it asap if it's possible for you" to="ship it as soon as possible" />.
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Tag tone="green" size={16}>3 corrections</Tag>
          <Tag tone="yellow" size={16}>Ton : hésitant → confiant</Tag>
          <Tag tone="blue" size={16}>Clarté : +2 points</Tag>
        </div>
      </div>
    }
    watch="Pensé d’abord pour l’anglais : idéal pour vos emails internationaux. Pour le français, préférez DeepL Write ou le correcteur de votre suite bureautique."
    tip="activez la définition d’objectifs (destinataire, intention) : les suggestions s’adaptent à un client, un collègue, un recruteur."
  />
);

// ─── Outil 11 · DeepL / DeepL Write ─────────────────────────────────────────
const M5_DeepL: Page = () => (
  <ToolPage
    mod={5}
    id="deepl"
    tone="navy"
    tagline="traduire et reformuler"
    feats={[
      ['translate', 'Traduction de texte', 'Une traduction naturelle, qui respecte les tournures de chaque langue.'],
      ['doc', 'Traduction de documents', 'Word, PowerPoint, PDF : traduits en gardant la mise en page.'],
      ['book', 'Glossaire', 'Vos termes métier traduits toujours de la même façon.'],
      ['pen', 'DeepL Write', 'Reformule votre texte avec le style et le ton choisis.'],
    ]}
    exTitle="DeepL Write · style professionnel"
    prompt="Suite à votre mail, je reviens vers vous pour vous dire qu’on a bien pris en compte votre demande et qu’on va faire le nécessaire au plus vite."
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 22, lineHeight: 1.5 }}>Nous avons bien reçu votre demande et la traitons en priorité. Je vous tiens informé de son avancement.</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Tag tone="navy" size={16}>Style : professionnel</Tag>
          <Tag tone="navy" size={16}>Ton : confiant</Tag>
          <Tag tone="green" size={16}>36 → 20 mots</Tag>
        </div>
        <div style={{ fontSize: 18, color: C.muted }}>Cliquez sur un mot pour voir d’autres formulations.</div>
      </div>
    }
    watch="Version gratuite : vos textes peuvent être conservés pour améliorer le service. DeepL Pro garantit leur suppression. Relisez toujours les termes métier."
    tip="créez un glossaire avec vos termes métier et noms de produits : ils seront traduits toujours de la même façon."
  />
);

// ─── Outil 12 · Canva AI ────────────────────────────────────────────────────
const M5Thumb = ({ bg, fg, title, sub }: { bg: string; fg: string; title: string; sub: string }) => (
  <div style={{ flex: 1, height: 230, borderRadius: 12, background: bg, color: fg, padding: '16px 14px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8, boxShadow: SHADOW_SM }}>
    <div style={{ width: 40, height: 40, borderRadius: 99, background: 'rgba(255,255,255,.35)' }} />
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 21, lineHeight: 1.1 }}>{title}</div>
    <div style={{ fontSize: 15, opacity: 0.9 }}>{sub}</div>
    <div style={{ marginTop: 'auto', height: 46, borderRadius: 8, background: 'rgba(255,255,255,.25)' }} />
  </div>
);

const M5_Canva: Page = () => (
  <ToolPage
    mod={5}
    id="canva"
    tone="violet"
    tagline="le studio graphique assisté"
    feats={[
      ['wand', 'Création assistée', 'Décrivez votre support : il propose des mises en page prêtes à modifier.'],
      ['pen', 'Rédaction intégrée', 'Titres, accroches, textes courts écrits directement dans le design.'],
      ['image', 'Images générées', 'Une illustration créée à partir d’une description, ou retouchée.'],
      ['layers', 'Redimensionnement magique', 'Un visuel décliné en affiche, post, story, bannière.'],
    ]}
    exTitle="affiche A4"
    prompt="Affiche A4 pour notre journée portes ouvertes du samedi 15 novembre, ton familial et chaleureux, dominante verte."
    answer={
      <div style={{ display: 'flex', gap: 12 }}>
        <M5Thumb bg="#1F7A4D" fg="#fff" title="Portes ouvertes" sub="Samedi 15 novembre · 10 h – 17 h" />
        <M5Thumb bg="#E8F5E9" fg="#1F5132" title="Venez nous rencontrer !" sub="Ateliers · visite · goûter" />
        <M5Thumb bg="#2E7D32" fg="#FFF8E1" title="On vous ouvre nos portes" sub="Le 15/11, en famille" />
      </div>
    }
    watch="Images générées : vérifiez les conditions d’usage commercial de votre offre. Et personnalisez : un modèle non retouché se reconnaît au premier coup d’œil."
    tip="le kit de marque (logo, couleurs, polices) applique automatiquement votre charte graphique à chaque création."
  />
);

// ─── Outil 13 · Gamma ───────────────────────────────────────────────────────
const M5Slide = ({ n, t, c }: { n: number; t: string; c: string }) => (
  <div style={{ height: 92, borderRadius: 10, background: '#fff', boxShadow: `inset 0 0 0 1.5px ${C.rule}`, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6, boxSizing: 'border-box' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontFamily: mono, fontSize: 13, color: C.faint }}>{n}</span>
      <span style={{ width: 22, height: 6, borderRadius: 3, background: c }} />
    </div>
    <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2, color: C.ink }}>{t}</div>
  </div>
);

const M5_Gamma: Page = () => (
  <ToolPage
    mod={5}
    id="gamma"
    tone="pink"
    tagline="une présentation en une minute"
    feats={[
      ['slides', 'Génération complète', 'Présentation, document ou page web à partir d’un sujet, de notes ou d’un fichier.'],
      ['palette', 'Mise en forme en un clic', 'Changez de thème : tout le contenu se remet en page.'],
      ['send', 'Export', 'PowerPoint, PDF, Google Slides, ou un simple lien à partager.'],
    ]}
    exTitle="à partir de notes"
    prompt="Crée 8 slides : bilan du projet Horizon pour le comité de direction, à partir des notes jointes. Ton factuel, une idée par slide."
    answer={
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <M5Slide n={1} t="Projet Horizon : le bilan" c={C.pink} />
        <M5Slide n={2} t="Objectifs de départ" c={C.violet} />
        <M5Slide n={3} t="Ce qui a été livré" c={C.green} />
        <M5Slide n={4} t="Chiffres clés" c={C.blue} />
        <M5Slide n={5} t="Ce qui a coincé" c={C.coral} />
        <M5Slide n={6} t="Leçons apprises" c={C.yellow} />
        <M5Slide n={7} t="Prochaines étapes" c={C.teal} />
        <M5Slide n={8} t="Décisions attendues" c={C.navy} />
      </div>
    }
    watch="Si vos notes sont maigres, Gamma comble avec du contenu générique, voire inventé. L’export PowerPoint peut perdre une partie de la mise en forme."
    tip="collez un plan détaillé et choisissez de « conserver » votre texte plutôt que de le « générer » : Gamma met en forme sans réinventer."
  />
);

// ─── Reformuler : avant / après ─────────────────────────────────────────────
const M5Flip = ({ how, id, before, after, d }: { how: string; id: ToolId; before: string; after: string; d: number }) => (
  <FlipCard
    w={530}
    h={470}
    cls={A.in}
    style={dl(d)}
    tone="grey"
    backTone="green"
    front={
      <>
        <Eyebrow c={C.muted} size={17}>
          Avant · {how}
        </Eyebrow>
        <div style={{ marginTop: 14, fontSize: 23, lineHeight: 1.45, color: C.soft, fontStyle: 'italic' }}>« {before} »</div>
      </>
    }
    back={
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ToolTile id={id} size={36} />
          <Eyebrow c={T.green.fg} size={17}>
            Après · {how}
          </Eyebrow>
        </div>
        <div style={{ marginTop: 14, fontSize: 24, lineHeight: 1.45, color: C.ink, fontWeight: 600 }}>« {after} »</div>
      </>
    }
  />
);

const M5_Rewrite: Page = () => (
  <Frame mod={5} kind="demo">
    <Title>Reformuler : trois avant / après</Title>
    <Lede>Cliquez sur chaque carte. Même information, trois intentions différentes.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'flex', gap: 45 }}>
      <M5Flip
        d={100}
        how="simplifier"
        id="deepl"
        before="Dans le cadre de l’optimisation de nos process, il a été acté la mise en œuvre d’un dispositif de dématérialisation des notes de frais impactant l’ensemble des collaborateurs à compter du T1."
        after="À partir de janvier, toutes les notes de frais passeront en ligne. Fini le papier : vous les déclarerez depuis votre téléphone."
      />
      <M5Flip
        d={200}
        how="raccourcir"
        id="chatgpt"
        before="Je me permets de revenir vers vous concernant le devis que nous vous avons adressé il y a maintenant deux semaines, afin de savoir si vous aviez eu l’occasion d’en prendre connaissance et si vous aviez des questions éventuelles."
        after="Avez-vous pu consulter notre devis du 1er octobre ? Je reste disponible pour en parler."
      />
      <M5Flip
        d={300}
        how="adoucir le ton"
        id="claude"
        before="Comme je vous l’ai déjà dit trois fois, le dossier est incomplet. Merci de lire mes messages et d’envoyer enfin les pièces manquantes."
        after="Il nous manque encore deux pièces pour finaliser votre dossier : le justificatif de domicile et le RIB. Pouvez-vous nous les transmettre d’ici vendredi ?"
      />
    </div>
  </Frame>
);

// ─── Atelier 5 ──────────────────────────────────────────────────────────────
const M5_Lab: Page = () => (
  <LabPage
    mod={5}
    n="5"
    title="Le circuit rédactionnel : cinq tâches"
    defi="redaction"
    who="Binômes · au moins 3 tâches sur 5"
    minutes={25}
    tools={['copilot', 'chatgpt', 'grammarly', 'deepl', 'gamma', 'canva']}
    objective={
      <>
        Utiliser l’outil le plus adapté à chaque tâche rédactionnelle, et <strong>mesurer le temps gagné</strong> par rapport à votre façon habituelle de faire.
      </>
    }
    where={
      <>
        Pour chaque tâche réalisée : le résultat, l’outil utilisé, le temps passé, et <strong>une limite</strong> constatée.
      </>
    }
    crit={
      <>
        <CheckItem id="l5-c1" size={21}>3 tâches au moins, 3 outils différents</CheckItem>
        <CheckItem id="l5-c2" size={21}>Chaque résultat relu et corrigé</CheckItem>
        <CheckItem id="l5-c3" size={21}>Temps passé noté pour chaque tâche</CheckItem>
        <CheckItem id="l5-c4" size={21}>Une limite repérée par outil</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div><strong style={{ color: C.navy }}>1.</strong> Transformer des notes en email professionnel</div>
      <div><strong style={{ color: C.navy }}>2.</strong> Reformuler un texte jargonneux</div>
      <div><strong style={{ color: C.navy }}>3.</strong> Traduire et améliorer un document</div>
      <div><strong style={{ color: C.navy }}>4.</strong> Transformer un contenu en présentation</div>
      <div><strong style={{ color: C.navy }}>5.</strong> Créer un support visuel à partir d’un brief</div>
    </div>
    <Bonus>Enchaînez les tâches 4 et 5 : la présentation Gamma et l’affiche Canva sur le même sujet.</Bonus>
  </LabPage>
);

// ─── Matériaux de l’atelier (onglets) ───────────────────────────────────────
const M5Mat = ({ material, prompt, ids }: { material: ReactNode; prompt: ReactNode; ids: ToolId[] }) => (
  <div style={{ display: 'flex', gap: 28 }}>
    <div style={{ flex: 1 }}>
      <Eyebrow c={C.muted} size={17}>
        Le matériau (fictif)
      </Eyebrow>
      <div style={{ marginTop: 10, background: '#FFFBEA', borderRadius: 14, boxShadow: `inset 0 0 0 1.5px ${T.yellow.bd}`, padding: '18px 22px', fontSize: 22, lineHeight: 1.5, color: C.ink, minHeight: 260, boxSizing: 'border-box' }}>{material}</div>
    </div>
    <div style={{ flex: 1 }}>
      <Eyebrow c={C.muted} size={17}>
        Prompt de départ
      </Eyebrow>
      <div style={{ marginTop: 10 }}>
        <CodeDark size={20} wrap style={{ minHeight: 260 }}>
          {prompt}
        </CodeDark>
      </div>
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 16, fontSize: 20, color: C.muted }}>
        Outils :
        {ids.map((id) => (
          <ToolChip key={id} id={id} size={21} />
        ))}
      </div>
    </div>
  </div>
);

const M5_LabMat: Page = () => (
  <Frame mod={5} kind="lab" label="Atelier 5 · Les matériaux">
    <Title size={46}>Les cinq tâches : matériaux et prompts</Title>
    <Tabs initial="t1">
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 180, display: 'flex', gap: 10 }}>
        <TabBtn id="t1" tone="blue" icon="mail">1 · Notes → email</TabBtn>
        <TabBtn id="t2" tone="navy" icon="loop">2 · Reformuler</TabBtn>
        <TabBtn id="t3" tone="teal" icon="translate">3 · Traduire</TabBtn>
        <TabBtn id="t4" tone="pink" icon="slides">4 · Présentation</TabBtn>
        <TabBtn id="t5" tone="violet" icon="image">5 · Visuel</TabBtn>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 1680, height: 610, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px', ...dl(150) }}>
        <TabPane id="t1">
          <M5Mat
            ids={['copilot', 'chatgpt']}
            material={
              <span style={{ fontFamily: mono, fontSize: 20 }}>
                RDV client Dupuis 10/10
                <br />– ok devis v2 sauf option maintenance
                <br />– veulent démarrer en janvier
                <br />– envoyer planning + nouveau devis avant le 20/10
                <br />– contact : Mme Roux, achats
              </span>
            }
            prompt={
              <>
                Transforme ces notes en email professionnel à Mme Roux : remerciements, récapitulatif des décisions, prochaines étapes avec dates. <Cs>120 mots, ton cordial.</Cs> N’invente aucune information.
              </>
            }
          />
        </TabPane>
        <TabPane id="t2">
          <M5Mat
            ids={['deepl', 'chatgpt']}
            material="Dans le cadre de l’optimisation de nos process, il a été acté la mise en œuvre d’un dispositif de dématérialisation des notes de frais impactant l’ensemble des collaborateurs à compter du T1, conformément aux orientations stratégiques validées en CODIR."
            prompt={
              <>
                Dans DeepL Write : collez le texte, style <Cs>« simple »</Cs>, puis <Cs>« professionnel »</Cs>. Comparez.{'\n\n'}
                Dans un assistant : « Réécris pour des salariés non spécialistes, 2 phrases, sans jargon. »
              </>
            }
          />
        </TabPane>
        <TabPane id="t3">
          <M5Mat
            ids={['deepl', 'grammarly']}
            material="La fiche produit « Bureau assis-debout Alto » (Word, 1 page, avec tableau des dimensions), à traduire en anglais pour un distributeur britannique."
            prompt={
              <>
                1. DeepL · onglet <Cs>Documents</Cs> : déposez le fichier Word, langue cible anglais (britannique).{'\n'}
                2. Ouvrez le résultat : la mise en page est-elle conservée ?{'\n'}
                3. Grammarly : vérifiez le ton du texte d’introduction en anglais.
              </>
            }
          />
        </TabPane>
        <TabPane id="t4">
          <M5Mat
            ids={['gamma', 'copilot']}
            material="La note d’une page du cas pratique du module 4 (forfait mobilités durables), ou le rapport d’activité fictif fourni."
            prompt={
              <>
                Crée une présentation de <Cs>6 slides</Cs> pour le comité de direction à partir de ce texte. Une idée par slide, des titres qui affirment, un dernier slide « décision attendue ». <Cs>Conserve mes chiffres, n’en ajoute aucun.</Cs>
              </>
            }
          />
        </TabPane>
        <TabPane id="t5">
          <M5Mat
            ids={['canva']}
            material={
              <>
                <strong>Brief :</strong> un « Café IA » ouvert à tous les salariés, jeudi 6 novembre à 12 h 30, salle Lumière. 30 minutes pour partager une astuce IA. Ton convivial, pas de jargon. Formats : affiche A4 + post pour l’intranet.
              </>
            }
            prompt={
              <>
                Dans Canva, création assistée : « Affiche A4 conviviale pour un Café IA, jeudi 6 novembre 12 h 30, salle Lumière, ouvert à tous. » Puis <Cs>redimensionnement magique</Cs> → post carré.
              </>
            }
          />
        </TabPane>
      </div>
    </Tabs>
  </Frame>
);

// ─── Quiz M5 ────────────────────────────────────────────────────────────────
const M5_Quiz: Page = () => (
  <Frame mod={5} kind="quiz">
    <Title>Quiz · Module 5</Title>
    <QuizSeries y={200}>
      <QuizQ q="Vous devez traduire une plaquette PowerPoint en allemand sans casser la mise en page. Quel outil ?" explain="DeepL traduit des documents Word, PowerPoint ou PDF entiers en conservant leur mise en page.">
        <QOpt>Grammarly</QOpt>
        <QOpt ok>DeepL (traduction de documents)</QOpt>
        <QOpt>Consensus</QOpt>
      </QuizQ>
      <QuizQ q="Grammarly est surtout recommandé pour…" explain="Grammarly est pensé d’abord pour l’anglais : idéal pour corriger et ajuster le ton de vos écrits en anglais.">
        <QOpt ok>vos emails et documents en anglais</QOpt>
        <QOpt>traduire des vidéos</QOpt>
        <QOpt>créer des affiches</QOpt>
      </QuizQ>
      <QuizQ q="Gamma a ajouté des chiffres absents de vos notes. Que faites-vous ?" explain="Quand le contenu fourni est maigre, Gamma comble avec du générique. On supprime les ajouts et on lui demande de conserver le texte fourni.">
        <QOpt>Vous les gardez : ils rendent la présentation plus crédible</QOpt>
        <QOpt ok>Vous les supprimez et demandez de conserver uniquement votre texte</QOpt>
        <QOpt>Vous exportez en PDF pour les figer</QOpt>
      </QuizQ>
      <QuizQ q="Votre affiche Canva doit exister aussi en post carré et en story. Le plus rapide ?" explain="Le redimensionnement magique décline un design en plusieurs formats en un clic, à retoucher ensuite.">
        <QOpt>Tout refaire trois fois</QOpt>
        <QOpt ok>Le redimensionnement magique</QOpt>
        <QOpt>Une capture d’écran recadrée</QOpt>
      </QuizQ>
      <QuizQ q="Avec la version gratuite de DeepL, vous pouvez traduire…" explain="En version gratuite, les textes peuvent être conservés pour améliorer le service : réservez-la aux contenus non confidentiels.">
        <QOpt>le contrat de travail d’un salarié</QOpt>
        <QOpt ok>une fiche produit déjà publique</QOpt>
        <QOpt>le fichier clients</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ═══ 60-m6 ═════════════════════════════════════════════════════════════

// ─── Module 6 · Réunions, organisation et productivité ──────────────────────

const M6_Section: Page = () => (
  <Section
    n={6}
    title="Réunions, organisation et productivité"
    sub="Transcription, compte rendu, décisions, tâches, email de suivi : tout ce qui suit une réunion peut être préparé par l’IA."
    dur="45 min"
    labs={<DefiBadge defi="reunion" />}
  >
    <SecItem n={1}>Otter.ai · transcription et synthèse de réunions</SecItem>
    <SecItem n={2}>Fireflies.ai · compte rendu et extraction des actions</SecItem>
    <SecItem n={3}>Notion AI · organiser, rédiger, retrouver</SecItem>
    <SecItem n={4}>Enregistrer une réunion : les règles du jeu</SecItem>
  </Section>
);
M6_Section.transition = BLOOM;

// ─── Le temps caché d’une réunion ───────────────────────────────────────────
const M6Bar = ({ label, sans, avec }: { label: string; sans: number; avec: number }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', alignItems: 'center', gap: 20 }}>
    <span style={{ fontSize: 24, color: C.ink }}>{label}</span>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className={b.grow(1)} style={{ width: sans * 22, height: 26, borderRadius: 6, background: C.faint }} />
        <span className={b.fade(1)} style={{ fontFamily: mono, fontSize: 20, color: C.muted }}>
          {sans} min
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className={b.grow(2)} style={{ width: Math.max(4, avec * 22), height: 26, borderRadius: 6, background: G.green }} />
        <span className={b.fade(2)} style={{ fontFamily: mono, fontSize: 20, color: C.green, fontWeight: 700 }}>
          {avec} min
        </span>
      </div>
    </div>
  </div>
);

const M6_Cost: Page = () => (
  <Frame mod={6} beats={3}>
    <Title>Après la réunion, le vrai travail commence</Title>
    <Lede>Pour une réunion d’une heure, voici ce qui suit habituellement. En gris sans IA, en vert avec.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 26 }}>
      <M6Bar label="Prendre des notes" sans={20} avec={0} />
      <M6Bar label="Rédiger le compte rendu" sans={30} avec={5} />
      <M6Bar label="Lister les tâches" sans={10} avec={2} />
      <M6Bar label="Écrire l’email de suivi" sans={10} avec={3} />
    </div>
    <div className={b.pop(3)} style={{ position: 'absolute', left: 1340, top: 290, width: 460, background: C.navy, borderRadius: 22, padding: '30px 34px', color: '#fff', boxShadow: SHADOW }}>
      <Eyebrow c="#AEB9E6" size={19}>
        Temps administratif
      </Eyebrow>
      <div style={{ marginTop: 10, fontFamily: display, fontWeight: 800, fontSize: 96, lineHeight: 1 }}>
        70 → 10
      </div>
      <div style={{ marginTop: 6, fontSize: 28, color: '#DCE3FB' }}>minutes</div>
      <div style={{ marginTop: 18, fontSize: 21, lineHeight: 1.45, color: '#DCE3FB' }}>
        Et surtout : vous écoutez vraiment pendant la réunion, au lieu de prendre des notes.
      </div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, fontSize: 19, color: C.muted, ...dl(600) }}>
      Ordres de grandeur illustratifs : le temps de relecture reste indispensable.
    </div>
  </Frame>
);

// ─── Outil 14 · Otter.ai ────────────────────────────────────────────────────
const M6Quote = ({ t, who, children }: { t: string; who: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 19, lineHeight: 1.4 }}>
    <span style={{ flex: 'none', fontFamily: mono, fontSize: 15, color: C.blue, background: T.blue.bg, borderRadius: 6, padding: '2px 7px', marginTop: 2 }}>{t}</span>
    <span>
      <strong>{who} : </strong>
      {children}
    </span>
  </div>
);

const M6_Otter: Page = () => (
  <ToolPage
    mod={6}
    id="otter"
    tone="blue"
    tagline="la transcription en direct"
    feats={[
      ['mic', 'Transcription en temps réel', 'Le texte s’affiche pendant que l’on parle, avec le nom de chaque intervenant.'],
      ['bot', 'Assistant de réunion', 'Il rejoint seul vos réunions Zoom, Teams ou Meet et prend les notes.'],
      ['layers', 'Résumé et actions', 'À la fin : synthèse, points clés et actions à mener.'],
      ['chat', 'Interroger la réunion', '« Qu’a dit Julie sur le budget ? » : réponse avec l’horodatage.'],
    ]}
    exTitle="poser une question à la réunion"
    prompt="Qu’a dit Julie sur le budget du salon ? Y a-t-il eu une décision ?"
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>Julie a proposé de plafonner le budget à 18 000 €. Aucune décision : le sujet est reporté au comité du 20.</div>
        <M6Quote t="12:41" who="Julie">« Je propose qu’on ne dépasse pas 18 000 €, stand compris. »</M6Quote>
        <M6Quote t="14:05" who="Paul">« On tranchera au comité du 20, avec les devis. »</M6Quote>
      </div>
    }
    watch="Vérifiez que le français est bien pris en charge pour vos usages avant d’en faire votre outil. Et informez toujours les participants qu’ils sont enregistrés."
    tip="cliquez sur une phrase de la transcription pour réécouter le passage : idéal pour vérifier un chiffre ou une citation."
  />
);

// ─── Outil 15 · Fireflies.ai ────────────────────────────────────────────────
const M6Task = ({ who, what, when }: { who: string; what: string; when: string }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '28px 110px 1fr 110px', alignItems: 'center', gap: 10, fontSize: 19, background: T.grey.bg, borderRadius: 8, padding: '6px 10px' }}>
    <span style={{ width: 20, height: 20, borderRadius: 5, boxShadow: `inset 0 0 0 2px ${C.faint}` }} />
    <strong>{who}</strong>
    <span>{what}</span>
    <span style={{ fontFamily: mono, fontSize: 16, color: C.muted, textAlign: 'right' }}>{when}</span>
  </div>
);

const M6_Fireflies: Page = () => (
  <ToolPage
    mod={6}
    id="fireflies"
    tone="coral"
    tagline="compte rendu et actions"
    feats={[
      ['users', 'Il assiste à vos réunions', 'Transcription dans de nombreuses langues, dont le français.'],
      ['checkCircle', 'Extraction des actions', 'Qui fait quoi, pour quand : les engagements pris à l’oral, listés.'],
      ['search', 'Recherche dans l’historique', 'Retrouvez ce qui a été dit sur un sujet, toutes réunions confondues.'],
      ['plug', 'Envoi automatique', 'Compte rendu poussé vers Notion, Slack, le CRM ou par email.'],
    ]}
    exTitle="compte rendu automatique"
    prompt="Réunion « Lancement salon Pro’Expo » · 42 min · 5 participants"
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 19 }}>
          <strong>Résumé :</strong> stand de 24 m² validé, budget à confirmer le 20, recrutement de deux hôtesses.
        </div>
        <strong style={{ fontSize: 16, letterSpacing: '0.08em', color: C.coral }}>ACTIONS DÉTECTÉES</strong>
        <M6Task who="Julie" what="Envoyer les 3 devis de stand" when="17 oct." />
        <M6Task who="Paul" what="Réserver l’hôtel pour l’équipe" when="24 oct." />
        <M6Task who="Amina" what="Brief agence d’hôtesses" when="31 oct." />
      </div>
    }
    watch="Le robot qui rejoint la réunion doit être annoncé : informez et recueillez l’accord des participants. Pas d’enregistrement d’entretiens RH ou de sujets confidentiels."
    tip="paramétrez l’envoi automatique du compte rendu vers Notion ou par email : plus aucun copier-coller après la réunion."
  />
);

// ─── Outil 16 · Notion AI ───────────────────────────────────────────────────
const M6Page = ({ t, d }: { t: string; d: string }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 16, background: T.grey.bg, borderRadius: 6, padding: '3px 8px', color: C.soft }}>
    <Icon name="doc" size={16} /> {t} · {d}
  </span>
);

const M6_Notion: Page = () => (
  <ToolPage
    mod={6}
    id="notion"
    tone="navy"
    tagline="organiser, rédiger, retrouver"
    feats={[
      ['pen', 'Rédiger dans vos pages', 'Résumer, reformuler, continuer un texte, sans quitter votre document.'],
      ['search', 'Questions sur tout l’espace', '« Où en est le projet X ? » : la réponse, avec les pages sources.'],
      ['mic', 'Notes de réunion', 'Transcription et résumé enregistrés directement dans la bonne page.'],
      ['table', 'Bases de données auto-remplies', 'Résumé, catégorie, priorité : des colonnes remplies par l’IA.'],
    ]}
    exTitle="question sur l’espace de travail"
    prompt="Quelles décisions ont été prises sur le projet Horizon ce mois-ci, et qu’est-ce qui est en retard ?"
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <M3Line icon="check" c={C.green}>Lancement décalé au 2 décembre ; budget communication validé</M3Line>
        <M3Line icon="alert" c={C.coral}>En retard : le planning révisé (attendu le 10), la maquette de la page d’accueil</M3Line>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <M6Page t="CR comité Horizon" d="3 oct." />
          <M6Page t="Planning Horizon" d="mis à jour le 8 oct." />
          <M6Page t="Tâches Horizon" d="base" />
        </div>
      </div>
    }
    watch="Il ne répond qu’à partir des pages auxquelles vous avez accès : un espace mal tenu donne des réponses incomplètes. Fonctions IA selon l’offre souscrite."
    tip="dans une base de tâches, ajoutez une colonne « Résumé IA » : chaque fiche se résume toute seule, toujours à jour."
  />
);

// ─── Enregistrer une réunion : les règles ───────────────────────────────────
const M6Flip = ({ sit, verdict, ok, d }: { sit: string; verdict: string; ok: 'ok' | 'mid' | 'ko'; d: number }) => (
  <FlipCard
    w={390}
    h={330}
    cls={A.in}
    style={dl(d)}
    tone="yellow"
    backTone={ok === 'ok' ? 'green' : ok === 'mid' ? 'yellow' : 'coral'}
    front={
      <>
        <Eyebrow c={T.yellow.fg} size={16}>
          Peut-on enregistrer ?
        </Eyebrow>
        <div style={{ marginTop: 12, fontSize: 26, lineHeight: 1.35, fontWeight: 600, color: C.ink }}>{sit}</div>
      </>
    }
    back={
      <>
        <Eyebrow c={ok === 'ok' ? T.green.fg : ok === 'mid' ? T.yellow.fg : T.coral.fg} size={20}>
          {ok === 'ok' ? '✓ Oui, en informant' : ok === 'mid' ? '≈ Avec accord explicite' : '✗ Non'}
        </Eyebrow>
        <div style={{ marginTop: 12, fontSize: 22, lineHeight: 1.4, color: C.ink }}>{verdict}</div>
      </>
    }
  />
);

const M6_Rules: Page = () => (
  <Frame mod={6} kind="exercice">
    <Title>Enregistrer une réunion : les règles du jeu</Title>
    <Lede>Une voix est une donnée personnelle. Votez pour chaque situation, puis retournez la carte.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'flex', gap: 40 }}>
      <M6Flip d={100} sit="Le point d’équipe hebdomadaire" ok="ok" verdict="Oui, si l’outil est autorisé par l’entreprise et que chacun est informé en début de réunion." />
      <M6Flip d={200} sit="Une réunion avec un client" ok="mid" verdict="Uniquement avec son accord explicite, demandé avant de lancer l’enregistrement." />
      <M6Flip d={300} sit="Un entretien annuel ou un entretien RH" ok="ko" verdict="Non : échange individuel, sensible et confidentiel. On prend des notes à la main." />
      <M6Flip d={400} sit="Une réunion sur un sujet juridique ou de santé" ok="ko" verdict="Non : données sensibles. Aucune transcription dans un outil grand public." />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, ...dl(700) }}>
      {(
        [
          ['bell', 'Informer', 'Annoncer l’enregistrement au début, et le rappeler dans l’invitation.'],
          ['hand', 'Recueillir l’accord', 'Toute personne peut refuser : on coupe alors l’enregistrement.'],
          ['shieldCheck', 'Outil autorisé', 'Uniquement les outils validés par votre entreprise.'],
          ['archive', 'Supprimer', 'Ne gardez la transcription que le temps nécessaire.'],
        ] as [IconName, string, string][]
      ).map(([ic, t, s]) => (
        <div key={t} style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <IconTile name={ic} tone="yellow" size={46} />
          <div>
            <div style={{ fontFamily: display, fontWeight: 700, fontSize: 22, color: C.ink }}>{t}</div>
            <div style={{ fontSize: 19, lineHeight: 1.38, color: C.soft }}>{s}</div>
          </div>
        </div>
      ))}
    </div>
  </Frame>
);

// ─── Cas pratique : la chaîne après-réunion ─────────────────────────────────
const M6Node = ({ n, icon, label, ids, out }: { n: number; icon: IconName; label: string; ids: ToolId[]; out: string }) => (
  <div className={b.pop(n)} style={{ width: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
    <IconTile name={icon} tone="yellow" size={74} solid />
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: C.navy }}>{label}</div>
    <div style={{ display: 'flex', gap: 6 }}>
      {ids.map((id) => (
        <ToolTile key={id} id={id} size={32} />
      ))}
    </div>
    <div style={{ fontSize: 18, lineHeight: 1.35, color: C.soft, background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '10px 12px', minHeight: 72, boxSizing: 'border-box' }}>{out}</div>
  </div>
);

const M6_Pipeline: Page = () => (
  <Frame mod={6} kind="demo" beats={6}>
    <Title>La chaîne après-réunion, étape par étape</Title>
    <Lede>Réunion → transcription → synthèse → décisions → tâches → email de suivi. Chaque → ajoute une étape.</Lede>
    <svg width={1680} height={60} style={{ position: 'absolute', left: 120, top: 297 }} aria-hidden>
      <path d="M125 30 H1555" stroke={C.rule} strokeWidth={4} strokeDasharray="8 10" className={A.march} />
      <FlowDot path="M125 30 H1555" dur={4} r={8} color={C.amber} />
    </svg>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', justifyContent: 'space-between' }}>
      <M6Node n={1} icon="users" label="Réunion" ids={['otter', 'fireflies']} out="Le robot rejoint la visio, annoncé à tous" />
      <M6Node n={2} icon="mic" label="Transcription" ids={['otter', 'fireflies']} out="Texte intégral, intervenants, horodatage" />
      <M6Node n={3} icon="layers" label="Synthèse" ids={['fireflies', 'notion']} out="L’essentiel en 5 lignes" />
      <M6Node n={4} icon="flag" label="Décisions" ids={['fireflies', 'claude']} out="Ce qui est acté, ce qui est reporté" />
      <M6Node n={5} icon="checkCircle" label="Tâches" ids={['notion']} out="Qui, quoi, quand, dans la base projet" />
      <M6Node n={6} icon="send" label="Email de suivi" ids={['copilot', 'chatgpt']} out="Envoyé après relecture humaine" />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(400) }}>
      <Callout title="Le point de contrôle" tone="pink" icon="humanCheck" size={24}>
        Entre « décisions » et « email », un humain relit : une décision mal comprise par l’IA, envoyée à dix personnes, devient une vraie décision.
      </Callout>
    </div>
  </Frame>
);

// ─── Atelier 6 ──────────────────────────────────────────────────────────────
const M6_Lab: Page = () => (
  <LabPage
    mod={6}
    n="6"
    title="De la réunion à l’email de suivi"
    defi="reunion"
    who="Groupes de 3 ou 4"
    minutes={20}
    tools={['fireflies', 'otter', 'notion', 'copilot', 'chatgpt']}
    label="Module 6 · Cas pratique"
    objective={
      <>
        À partir d’une réunion, produire <strong>synthèse, décisions, tâches et email de suivi</strong>, en mesurant le temps gagné sur l’administratif.
      </>
    }
    where={
      <>
        Une page de compte rendu (synthèse · décisions · tâches avec responsable et échéance) et l’email de suivi <strong>prêt à envoyer</strong>.
      </>
    }
    crit={
      <>
        <CheckItem id="l6-c1" size={21}>Toutes les décisions retrouvées</CheckItem>
        <CheckItem id="l6-c2" size={21}>Chaque tâche : qui, quoi, quand</CheckItem>
        <CheckItem id="l6-c3" size={21}>Un point en suspens identifié</CheckItem>
        <CheckItem id="l6-c4" size={21}>L’email relu par un humain</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>
        <strong style={{ color: C.navy }}>Option A · en direct :</strong> jouez 3 minutes du comité projet (rôles page suivante) avec Fireflies ou Otter qui transcrit.
      </div>
      <div>
        <strong style={{ color: C.navy }}>Option B · transcription fournie :</strong> utilisez l’extrait de la page suivante.
      </div>
      <div>
        Puis : synthèse et décisions (Notion AI ou assistant) → tâches dans une base Notion → email de suivi (Copilot ou ChatGPT).
      </div>
    </div>
  </LabPage>
);

// ─── La transcription fournie ───────────────────────────────────────────────
const M6Line = ({ t, who, c, children }: { t: string; who: string; c: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', fontSize: 21, lineHeight: 1.42 }}>
    <span style={{ flex: 'none', width: 62, fontFamily: mono, fontSize: 17, color: C.muted, paddingTop: 3 }}>{t}</span>
    <span style={{ flex: 'none', width: 92, fontWeight: 700, color: c }}>{who}</span>
    <span style={{ color: C.ink }}>{children}</span>
  </div>
);

const M6_Transcript: Page = () => (
  <Frame mod={6} kind="lab" label="Cas pratique · La transcription">
    <Title size={46}>Comité projet « Nouveaux bureaux » · 9 octobre</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 180, width: 1100, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 9 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <ToolTile id="fireflies" size={32} />
        <span style={{ fontSize: 18, color: C.muted }}>Transcription · 35 min · 4 participants · extrait (fictif)</span>
      </div>
      <M6Line t="00:02" who="Sophie" c={C.violet}>On doit trancher la date du déménagement. Le bailleur propose le 15 ou le 29 janvier.</M6Line>
      <M6Line t="03:40" who="Marc" c={C.teal}>Le 15, c’est trop juste pour le câblage. Je préfère le 29.</M6Line>
      <M6Line t="05:12" who="Sophie" c={C.violet}>D’accord, on part sur le 29 janvier.</M6Line>
      <M6Line t="08:30" who="Inès" c={C.pink}>Il faut prévenir les équipes au moins un mois avant. Je m’occupe de la communication.</M6Line>
      <M6Line t="12:05" who="Marc" c={C.teal}>Il nous manque encore deux devis de déménageurs.</M6Line>
      <M6Line t="14:20" who="Sophie" c={C.violet}>Marc, tu peux les avoir pour le 24 octobre ? — Marc : Oui, c’est jouable.</M6Line>
      <M6Line t="19:50" who="Inès" c={C.pink}>Et le parking ? On ne sait toujours pas combien de places on aura.</M6Line>
      <M6Line t="21:10" who="Sophie" c={C.violet}>On en reparle au prochain comité, le 6 novembre.</M6Line>
      <M6Line t="30:00" who="Karim" c={C.blue}>Côté informatique, je dois tester le réseau sur place avant le 15 décembre.</M6Line>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1270, top: 180, width: 530, ...dl(200) }}>
      <CodeDark file="Prompt de traitement" size={19} wrap>
        À partir de cette transcription :{'\n'}
        1. <Cs>Synthèse</Cs> en 3 lignes.{'\n'}
        2. <Cs>Décisions</Cs> prises (et options écartées).{'\n'}
        3. <Cs>Tâches</Cs> en tableau : responsable, action, échéance.{'\n'}
        4. <Cs>Points en suspens</Cs>.{'\n'}
        5. <Cs>Email de suivi</Cs> aux participants, 120 mots.{'\n\n'}
        <Cc>N’invente aucune date ni aucun responsable : écris « à définir ».</Cc>
      </CodeDark>
      <div style={{ marginTop: 18, fontSize: 20, lineHeight: 1.45, color: C.muted }}>
        <strong style={{ color: C.navy }}>Option A, rôles :</strong> Sophie (direction), Marc (services généraux), Inès (RH), Karim (informatique).
      </div>
    </div>
  </Frame>
);

// ─── Corrigé ────────────────────────────────────────────────────────────────
const M6_Fix: Page = () => (
  <Frame mod={6} kind="lab" label="Cas pratique · Un corrigé possible" beats={3}>
    <Title size={46}>Un corrigé possible</Title>
    <div style={{ position: 'absolute', left: 120, top: 180, width: 900, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className={b.on(1)} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 24px' }}>
        <PanelTitle icon="layers">Synthèse et décisions</PanelTitle>
        <div style={{ fontSize: 21, lineHeight: 1.45, color: C.ink }}>
          Déménagement <strong>fixé au 29 janvier</strong> (le 15 est écarté : câblage trop juste). Devis et communication lancés ; parking en suspens.
        </div>
      </div>
      <div className={b.on(2)} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <PanelTitle icon="checkCircle">Tâches</PanelTitle>
        <M6Task who="Marc" what="Obtenir 2 devis de déménageurs" when="24 oct." />
        <M6Task who="Karim" what="Tester le réseau sur place" when="15 déc." />
        <M6Task who="Inès" what="Prévenir les équipes" when="avant le 29 déc." />
        <M6Task who="Sophie" what="Parking à l’ordre du jour" when="6 nov." />
      </div>
    </div>
    <ToolWindow id="copilot" title="email de suivi" cls={b.on(3)} style={{ position: 'absolute', left: 1070, top: 180, width: 730, height: 600 }} pad={22}>
      <div style={{ fontSize: 20, lineHeight: 1.5, color: C.ink }}>
        <strong>Objet : Nouveaux bureaux · relevé de décisions du 9 octobre</strong>
        <br />
        <br />
        Bonjour à tous,
        <br />
        Merci pour ce comité. La date du déménagement est fixée au <strong>29 janvier</strong>.
        <br />
        <br />
        Prochaines étapes : Marc nous transmet deux devis de déménageurs d’ici le 24 octobre ; Karim teste le réseau sur place avant le 15 décembre ; Inès informe les équipes au plus tard un mois avant.
        <br />
        <br />
        Le parking reste à traiter : il sera à l’ordre du jour du comité du 6 novembre.
        <br />
        <br />
        Bonne journée, Sophie
      </div>
    </ToolWindow>
    <div className={b.on(3)} style={{ position: 'absolute', left: 120, top: 810, width: 1680 }}>
      <Callout title="Remarquez" tone="coral" icon="eye" size={22}>
        L’échéance d’Inès n’a pas été dite en réunion : elle est <strong>déduite</strong> (« un mois avant »). Un humain doit la confirmer avant l’envoi.
      </Callout>
    </div>
  </Frame>
);

// ─── Quiz M6 ────────────────────────────────────────────────────────────────
const M6_Quiz: Page = () => (
  <Frame mod={6} kind="quiz">
    <Title>Quiz · Module 6</Title>
    <QuizSeries y={200}>
      <QuizQ q="Avant de lancer Fireflies ou Otter en réunion, vous devez…" explain="La voix est une donnée personnelle : on informe les participants et on recueille leur accord, avec un outil autorisé par l’entreprise.">
        <QOpt>rien : le robot est discret</QOpt>
        <QOpt ok>informer les participants et recueillir leur accord</QOpt>
        <QOpt>couper les caméras</QOpt>
      </QuizQ>
      <QuizQ q="Quel outil sert d’abord à extraire automatiquement les actions (qui, quoi, quand) d’une réunion ?" explain="Fireflies.ai produit le compte rendu et détecte les actions et engagements pris à l’oral.">
        <QOpt ok>Fireflies.ai</QOpt>
        <QOpt>DeepL</QOpt>
        <QOpt>Adobe Firefly</QOpt>
      </QuizQ>
      <QuizQ q="« Où en est le projet Horizon ? » Pour une réponse tirée de vos pages de projet, quel outil ?" explain="Notion AI répond à partir de tout votre espace de travail Notion, avec les pages sources.">
        <QOpt>Consensus</QOpt>
        <QOpt ok>Notion AI</QOpt>
        <QOpt>CapCut</QOpt>
      </QuizQ>
      <QuizQ q="Peut-on transcrire un entretien annuel avec un outil grand public ?" explain="Non : un entretien individuel RH est sensible et confidentiel. On prend des notes à la main.">
        <QOpt>Oui, si le salarié ne parle pas trop</QOpt>
        <QOpt>Oui, en supprimant le fichier ensuite</QOpt>
        <QOpt ok>Non : c’est un échange sensible et confidentiel</QOpt>
      </QuizQ>
      <QuizQ q="Le compte rendu IA attribue une échéance que personne n’a dite. Que faites-vous ?" explain="L’IA peut déduire ou inventer une information. On la fait confirmer par la personne concernée avant d’envoyer.">
        <QOpt>Vous l’envoyez : elle paraît logique</QOpt>
        <QOpt ok>Vous la faites confirmer avant l’envoi</QOpt>
        <QOpt>Vous supprimez toutes les échéances</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ═══ 70-m7 ═════════════════════════════════════════════════════════════

// ─── Module 7 · Créer des images, vidéos et contenus avec l’IA ──────────────

const M7_Section: Page = () => (
  <Section
    n={7}
    title="Créer des images, vidéos et contenus"
    sub="Du brief au visuel, du visuel à la vidéo : produire en une heure une mini-campagne qui demandait une semaine — en respectant les droits."
    dur="40 min"
    labs={<DefiBadge defi="campagne" />}
  >
    <SecItem n={1}>Adobe Firefly · créer et modifier des images</SecItem>
    <SecItem n={2}>Canva AI · la création graphique assistée</SecItem>
    <SecItem n={3}>Runway et CapCut AI · créer et monter des vidéos</SecItem>
    <SecItem n={4}>Droits, éthique et transparence</SecItem>
  </Section>
);
M7_Section.transition = BLOOM;

// ─── Anatomie d’un prompt d’image (simulateur) ──────────────────────────────
const IMG_BRICKS: Brick[] = [
  { id: 'sub', label: 'Sujet', tone: 'blue', icon: 'target', hint: 'Quoi, qui, en train de faire quoi ?', text: 'Une tasse de café fumante sur un bureau en bois,' },
  { id: 'sty', label: 'Style', tone: 'violet', icon: 'palette', hint: 'Photo, illustration, aquarelle, 3D…', text: 'illustration flat, couleurs pastel,' },
  { id: 'cmp', label: 'Composition', tone: 'teal', icon: 'layers', hint: 'Cadrage, point de vue, espace libre.', text: 'tasse à gauche, espace libre à droite pour un titre,' },
  { id: 'lum', label: 'Lumière', tone: 'yellow', icon: 'bulb', hint: 'Ambiance, moment de la journée.', text: 'lumière chaude du matin,' },
  { id: 'fmt', label: 'Format', tone: 'pink', icon: 'image', hint: 'Où sera-t-elle publiée ?', text: 'format carré pour un post LinkedIn.' },
];

const M7Scene = ({ on }: { on: Record<string, boolean> }) => {
  const sq = !!on.fmt;
  const W = sq ? 440 : 760;
  const H = sq ? 440 : 428;
  const flat = !!on.sty;
  const warm = !!on.lum;
  const cx0 = on.cmp ? W * 0.3 : W * 0.5;
  const ty = H * 0.68;
  const cup = flat ? '#FFFFFF' : '#F2F2F2';
  const bgA = warm ? (flat ? '#FFE3C2' : '#FFD9A0') : flat ? '#E6F2F0' : '#D9DEE6';
  const bgB = warm ? (flat ? '#FFF5E6' : '#FFF1D6') : flat ? '#F7EEF5' : '#EEF1F6';
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', borderRadius: 16, boxShadow: SHADOW, transition: 'all 400ms ease' }}>
      <defs>
        <radialGradient id={`${P}-m7bg`} cx="25%" cy="20%" r="90%">
          <stop offset="0%" stopColor={bgB} />
          <stop offset="100%" stopColor={bgA} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${P}-m7bg)`} />
      {warm ? <circle cx={W * 0.12} cy={H * 0.14} r={H * 0.09} fill={flat ? '#FFC98B' : '#FFE08A'} opacity={0.9} /> : null}
      {on.sub ? (
        <>
          <rect x={0} y={ty} width={W} height={H - ty} fill={flat ? '#F4C7A1' : '#9A6B47'} />
          {flat ? null : <rect x={0} y={ty} width={W} height={6} fill="#7A5236" />}
          <ellipse cx={cx0} cy={ty + 6} rx={78} ry={14} fill={flat ? '#E8B48C' : '#5E3E28'} opacity={0.6} />
          <path d={`M ${cx0 - 56} ${ty - 110} h 112 v 70 a 56 56 0 0 1 -112 0 z`} fill={cup} stroke={flat ? '#7FB8B0' : '#C9CED6'} strokeWidth={flat ? 5 : 3} />
          <path d={`M ${cx0 + 56} ${ty - 92} a 26 26 0 0 1 0 52`} fill="none" stroke={flat ? '#7FB8B0' : '#C9CED6'} strokeWidth={10} />
          <ellipse cx={cx0} cy={ty - 110} rx={56} ry={10} fill={flat ? '#B9785A' : '#4A2E1E'} />
          <g className={A.float}>
            <path d={`M ${cx0 - 18} ${ty - 130} q -14 -24 0 -46 q 14 -22 0 -44`} fill="none" stroke={flat ? '#C9D8F0' : '#FFFFFF'} strokeWidth={6} strokeLinecap="round" opacity={0.85} />
            <path d={`M ${cx0 + 16} ${ty - 128} q -14 -24 0 -46 q 14 -22 0 -44`} fill="none" stroke={flat ? '#C9D8F0' : '#FFFFFF'} strokeWidth={6} strokeLinecap="round" opacity={0.85} />
          </g>
        </>
      ) : (
        <text x={W / 2} y={H / 2} textAnchor="middle" dominantBaseline="middle" fontFamily="Montserrat, sans-serif" fontWeight={800} fontSize={40} fill="#A9B3C6">
          ? image au hasard ?
        </text>
      )}
      {on.cmp ? (
        <g>
          <rect x={W * 0.56} y={H * 0.18} width={W * 0.38} height={H * 0.36} rx={12} fill="none" stroke={C.teal} strokeWidth={3} strokeDasharray="10 8" />
          <text x={W * 0.75} y={H * 0.36} textAnchor="middle" dominantBaseline="middle" fontFamily="Open Sans, sans-serif" fontWeight={700} fontSize={20} fill={C.teal}>
            zone titre
          </text>
        </g>
      ) : null}
    </svg>
  );
};

const M7_ImgPrompt: Page = () => {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const n = IMG_BRICKS.filter((x) => on[x.id]).length;
  return (
    <Frame mod={7} kind="simu">
      <Title>Anatomie d’un prompt d’image</Title>
      <Lede>Cinq briques, comme pour le texte. Activez-les et regardez l’image se préciser.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 600, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {IMG_BRICKS.map((x) => (
          <div key={x.id} style={{ background: on[x.id] ? T[x.tone].bg : C.card, borderRadius: 16, boxShadow: on[x.id] ? `inset 0 0 0 2.5px ${STRONG[x.tone]}` : SHADOW_SM, padding: '14px 20px', transition: `all 250ms ${EASE}` }}>
            <Toggle on={!!on[x.id]} onChange={(v) => setOn((o) => ({ ...o, [x.id]: v }))} tone={x.tone} label={<strong style={{ fontFamily: display, fontSize: 26 }}>{x.label}</strong>} />
            <div style={{ marginTop: 4, marginLeft: 82, fontSize: 20, color: C.muted }}>{x.hint}</div>
          </div>
        ))}
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 780, top: 260, width: 1020, height: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', ...dl(150) }}>
        <M7Scene on={on} />
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 780, top: 770, width: 1020, minHeight: 110, boxSizing: 'border-box', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px', fontSize: 21, lineHeight: 1.5, ...dl(300) }}>
        <span style={{ fontWeight: 700, color: C.muted, marginRight: 8 }}>Prompt ({n}/5) :</span>
        {n === 0 ? <span style={{ color: C.ink }}>Un café.</span> : null}
        {IMG_BRICKS.filter((x) => on[x.id]).map((x) => (
          <span key={x.id} style={{ background: T[x.tone].bg, boxShadow: `inset 0 -3px 0 ${STRONG[x.tone]}`, borderRadius: 5, padding: '0 5px', marginRight: 5 }}>
            {x.text}
          </span>
        ))}
      </div>
    </Frame>
  );
};

// ─── Outil 17 · Adobe Firefly ───────────────────────────────────────────────
const M7Var = ({ a, b: bb, label }: { a: string; b: string; label: string }) => (
  <div style={{ position: 'relative', height: 140, borderRadius: 12, background: `linear-gradient(135deg, ${a}, ${bb})`, overflow: 'hidden', boxShadow: SHADOW_SM }}>
    <div style={{ position: 'absolute', left: '18%', bottom: 0, width: '64%', height: '46%', borderRadius: '50% 50% 0 0', background: 'rgba(255,255,255,.35)' }} />
    <div style={{ position: 'absolute', left: '30%', bottom: '38%', width: 26, height: 26, borderRadius: 99, background: 'rgba(255,255,255,.6)' }} />
    <div style={{ position: 'absolute', left: '52%', bottom: '40%', width: 24, height: 24, borderRadius: 99, background: 'rgba(255,255,255,.6)' }} />
    <span style={{ position: 'absolute', left: 8, top: 6, fontSize: 14, fontWeight: 700, color: '#fff' }}>{label}</span>
  </div>
);

const M7_Firefly: Page = () => (
  <ToolPage
    mod={7}
    id="firefly"
    tone="coral"
    tagline="créer et modifier des images"
    feats={[
      ['image', 'Texte → image', 'Une description, quatre propositions, des réglages de style et de cadrage.'],
      ['wand', 'Remplissage génératif', 'Ajouter, retirer ou remplacer un élément dans une photo existante.'],
      ['layers', 'Extension d’image', 'Agrandir le cadre d’une photo pour l’adapter à une bannière.'],
      ['shieldCheck', 'Pensé pour l’usage professionnel', 'Modèles maison entraînés sur des contenus sous licence ou libres de droits.'],
    ]}
    exTitle="texte → image"
    prompt="Photo réaliste d’une équipe de quatre personnes en réunion dans un bureau lumineux, plantes vertes, ambiance chaleureuse, format 16:9."
    answer={
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <M7Var a="#5B8DEF" b="#9BD3AE" label="Variante 1" />
        <M7Var a="#F2A65A" b="#F7D9A8" label="Variante 2" />
        <M7Var a="#4E7D6B" b="#B6E0C8" label="Variante 3" />
        <M7Var a="#7A6FF0" b="#E3C8F5" label="Variante 4" />
      </div>
    }
    watch="Firefly propose aussi des modèles partenaires qui n’offrent pas les mêmes garanties : vérifiez lequel vous utilisez. Ni personne réelle, ni marque existante."
    tip="ajoutez une image de référence de style : tous les visuels d’une campagne garderont la même patte."
  />
);

// ─── Outil 18 · Canva AI (création graphique) ───────────────────────────────
const M7Fmt = ({ w, h, label, c }: { w: number; h: number; label: string; c: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
    <div style={{ width: w, height: h, borderRadius: 8, background: `linear-gradient(160deg, ${c}, #F3E8FF)`, boxShadow: SHADOW_SM, display: 'flex', alignItems: 'flex-end', padding: 6, boxSizing: 'border-box' }}>
      <div style={{ width: '70%', height: 8, borderRadius: 4, background: 'rgba(255,255,255,.8)' }} />
    </div>
    <span style={{ fontSize: 15, color: C.muted, fontWeight: 600 }}>{label}</span>
  </div>
);

const M7_Canva: Page = () => (
  <ToolPage
    mod={7}
    id="canva"
    tone="violet"
    tagline="la création graphique assistée"
    feats={[
      ['image', 'Génération d’images', 'Des illustrations et photos créées dans le design, au bon format.'],
      ['wand', 'Retouche magique', 'Gomme, détourage, arrière-plan supprimé, élément remplacé.'],
      ['layers', 'Une campagne, tous formats', 'Affiche, post, story, bannière : déclinés en un clic.'],
      ['video', 'Animation et vidéo', 'Animer un visuel, monter une courte vidéo avec des modèles.'],
    ]}
    exTitle="déclinaison de campagne"
    prompt="Décline mon affiche « Café IA » en post carré, story verticale, bannière intranet et vignette d’email."
    answer={
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 22, justifyContent: 'center', paddingTop: 8 }}>
        <M7Fmt w={120} h={170} label="Affiche A4" c="#7D2AE8" />
        <M7Fmt w={140} h={140} label="Post carré" c="#9B5DE5" />
        <M7Fmt w={96} h={170} label="Story" c="#B983FF" />
        <M7Fmt w={220} h={70} label="Bannière" c="#6A1BD1" />
      </div>
    }
    watch="Relisez chaque déclinaison : le texte peut être coupé ou mal placé. Et gardez la cohérence : même police, mêmes couleurs, mêmes images."
    tip="commencez par le format le plus contraint (la story verticale) : les autres se déclinent plus facilement."
  />
);

// ─── Outil 19 · Runway ──────────────────────────────────────────────────────
const M7Frame = ({ t, x }: { t: string; x: number }) => (
  <div style={{ flex: 1, height: 150, borderRadius: 10, background: 'linear-gradient(180deg, #2B2D42, #4A4E69)', position: 'relative', overflow: 'hidden', boxShadow: SHADOW_SM }}>
    <div style={{ position: 'absolute', left: `${x}%`, bottom: 18, width: 34, height: 90, borderRadius: '12px 12px 6px 6px', background: 'linear-gradient(180deg, #9BE29B, #2F855A)' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 18, background: '#1B1C2B' }} />
    <span style={{ position: 'absolute', left: 8, top: 6, fontFamily: mono, fontSize: 13, color: '#E6EAF6' }}>{t}</span>
  </div>
);

const M7_Runway: Page = () => (
  <ToolPage
    mod={7}
    id="runway"
    tone="navy"
    tagline="la vidéo générée par IA"
    feats={[
      ['video', 'Texte ou image → vidéo', 'Des plans de quelques secondes générés à partir d’une description ou d’une image.'],
      ['pointer', 'Mouvements de caméra', 'Travelling, zoom, rotation : vous dirigez le plan.'],
      ['wand', 'Retouche vidéo', 'Retirer un objet, changer l’arrière-plan, créer un ralenti.'],
    ]}
    exTitle="image → vidéo"
    prompt="À partir de cette photo du produit, crée un plan de 5 secondes : travelling lent autour de la bouteille, lumière de studio."
    answer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <M7Frame t="0 s" x={30} />
          <M7Frame t="2 s" x={44} />
          <M7Frame t="5 s" x={58} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Tag tone="grey" size={16}>Clip de 5 s</Tag>
          <Tag tone="grey" size={16}>Haute définition</Tag>
          <Tag tone="yellow" size={16}>Consomme des crédits</Tag>
        </div>
      </div>
    }
    watch="Clips courts, incohérences fréquentes (mains, texte, objets qui changent). Jamais le visage ou la voix d’une personne réelle : c’est un hypertrucage."
    tip="partez d’une image validée (Firefly ou Canva) plutôt que d’un texte : vous gardez le contrôle du rendu."
  />
);

// ─── Outil 20 · CapCut AI ───────────────────────────────────────────────────
const M7_CapCut: Page = () => (
  <ToolPage
    mod={7}
    id="capcut"
    tone="teal"
    tagline="le montage vidéo assisté"
    feats={[
      ['note', 'Sous-titres automatiques', 'Générés en quelques secondes, stylés, synchronisés.'],
      ['wand', 'Détourage et arrière-plan', 'Le sujet isolé sans fond vert.'],
      ['mic', 'Texte → voix', 'Une voix off synthétique pour une vidéo explicative.'],
      ['phone', 'Formats réseaux', 'Recadrage vertical, modèles, montage automatique.'],
    ]}
    exTitle="sous-titres automatiques"
    prompt="Ajoute des sous-titres automatiques à cette interview de 45 secondes et recadre-la en vertical."
    answer={
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <div style={{ width: 150, height: 250, borderRadius: 20, background: 'linear-gradient(180deg, #334155, #0F172A)', position: 'relative', boxShadow: SHADOW, flex: 'none' }}>
          <div style={{ position: 'absolute', left: 45, top: 50, width: 60, height: 60, borderRadius: 99, background: '#94A3B8' }} />
          <div style={{ position: 'absolute', left: 30, top: 118, width: 90, height: 70, borderRadius: '40px 40px 0 0', background: '#94A3B8' }} />
          <div style={{ position: 'absolute', left: 10, right: 10, bottom: 26, background: 'rgba(0,0,0,.55)', borderRadius: 6, padding: '4px 6px', color: '#FFE066', fontSize: 14, fontWeight: 800, textAlign: 'center' }}>
            « On a gagné 3 heures par semaine »
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 19 }}>
          <M3Line icon="check" c={C.green}>87 sous-titres générés</M3Line>
          <M3Line icon="check" c={C.green}>Format 9:16 prêt à publier</M3Line>
          <M3Line icon="alert" c={C.amber}>2 noms propres mal orthographiés à corriger</M3Line>
        </div>
      </div>
    }
    watch="Lisez les conditions d’utilisation (droits accordés sur vos contenus) et la politique de votre entreprise. Musiques : souvent réservées à certains usages."
    tip="relisez les sous-titres : noms propres, chiffres et sigles sont les erreurs les plus fréquentes."
  />
);

// ─── Droits, éthique et transparence ────────────────────────────────────────
const M7Rule = ({ n, icon, title, children }: { n: number; icon: IconName; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px' }}>
    <IconTile name={icon} tone="coral" size={52} solid />
    <div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 25, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 21, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M7_Rights: Page = () => (
  <Frame mod={7} beats={5}>
    <Title>Images et vidéos IA : cinq règles avant de publier</Title>
    <Lede>Un visuel généré engage votre entreprise comme n’importe quelle publication.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
      <M7Rule n={1} icon="ticket" title="Vérifier la licence de l’outil">
        Usage commercial autorisé ? Avec quelle offre ? Chaque outil a ses conditions.
      </M7Rule>
      <M7Rule n={2} icon="user" title="Pas de personne réelle sans accord">
        Visage, voix, nom : imiter quelqu’un, c’est un hypertrucage (deepfake).
      </M7Rule>
      <M7Rule n={3} icon="x" title="Pas de marque ni d’œuvre d’autrui">
        Logos, personnages, « à la manière de » tel artiste : risque de contrefaçon.
      </M7Rule>
      <M7Rule n={4} icon="eye" title="Être transparent">
        Le règlement européen sur l’IA impose de signaler les contenus hypertruqués. Mentionnez « image générée par IA ».
      </M7Rule>
      <M7Rule n={5} icon="humanCheck" title="Relire comme un client">
        Mains à six doigts, texte déformé, détail absurde : un défaut ruine la crédibilité.
      </M7Rule>
    </div>
  </Frame>
);

// ─── Atelier 7 · mini-campagne ──────────────────────────────────────────────
const M7_Lab: Page = () => (
  <LabPage
    mod={7}
    n="7"
    title="Une mini-campagne à partir d’un même brief"
    defi="campagne"
    who="Groupes de 3 · un rôle par étape"
    minutes={25}
    tools={['chatgpt', 'firefly', 'canva', 'gamma', 'capcut', 'runway']}
    objective={
      <>
        À partir d’un même brief professionnel : <strong>brief → texte → visuel → présentation → courte vidéo</strong>, cohérents entre eux.
      </>
    }
    where={
      <>
        Un slogan et un texte d’annonce, un visuel (affiche ou post), 3 slides de présentation, une vidéo de 15 secondes. <strong>Une même charte</strong> pour tout.
      </>
    }
    crit={
      <>
        <CheckItem id="l7-c1" size={21}>Les 4 livrables existent</CheckItem>
        <CheckItem id="l7-c2" size={21}>Même message, mêmes couleurs partout</CheckItem>
        <CheckItem id="l7-c3" size={21}>Aucune personne ni marque réelle</CheckItem>
        <CheckItem id="l7-c4" size={21}>Mention « contenu généré par IA »</CheckItem>
      </>
    }
  >
    <div style={{ marginBottom: 10 }}>
      <strong style={{ color: C.navy }}>Le brief :</strong> lancer « <strong>Pause Verte</strong> », un service fictif de paniers de fruits bio livrés chaque semaine dans les entreprises de la ville.
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div><strong style={{ color: C.navy }}>Rôle 1 · Plume :</strong> slogan et texte avec l’assistant.</div>
      <div><strong style={{ color: C.navy }}>Rôle 2 · Graphiste :</strong> visuel dans Firefly ou Canva, puis présentation Gamma.</div>
      <div><strong style={{ color: C.navy }}>Rôle 3 · Vidéaste :</strong> 15 secondes dans CapCut (ou un plan Runway).</div>
    </div>
  </LabPage>
);

const M7_LabSteps: Page = () => (
  <Frame mod={7} kind="lab" label="Atelier 7 · Les prompts de la chaîne">
    <Title size={46}>La chaîne de création, prompt par prompt</Title>
    <div style={{ position: 'absolute', left: 120, top: 180, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M3Step n={1} tone="blue" verb="Texte" ids={['chatgpt', 'claude']} d={100}>
        Tu es concepteur-rédacteur. Pour « Pause Verte » (paniers de fruits bio livrés au bureau), propose <Cs>5 slogans</Cs> de moins de 6 mots, puis un texte d’annonce de 60 mots pour LinkedIn. Ton frais, sans superlatifs.
      </M3Step>
      <M3Step n={2} tone="coral" verb="Visuel" ids={['firefly', 'canva']} d={200}>
        Illustration flat, couleurs vert tendre et orange, panier de fruits colorés sur un bureau moderne, <Cs>espace libre en haut pour le slogan</Cs>, format carré.
      </M3Step>
      <M3Step n={3} tone="pink" verb="Slides" ids={['gamma']} d={300}>
        3 slides pour présenter Pause Verte aux services RH : le problème, notre offre, comment commander. <Cs>Reprends le slogan et les couleurs du visuel.</Cs>
      </M3Step>
      <M3Step n={4} tone="navy" verb="Vidéo" ids={['capcut', 'runway']} d={400}>
        15 s verticales : visuel animé + slogan + voix off (texte → voix), <Cs>sous-titres automatiques</Cs>, mention « contenu généré par IA ».
      </M3Step>
    </div>
  </Frame>
);

// ─── Quiz M7 ────────────────────────────────────────────────────────────────
const M7_Quiz: Page = () => (
  <Frame mod={7} kind="quiz">
    <Title>Quiz · Module 7</Title>
    <QuizSeries y={200}>
      <QuizQ q="Vous voulez retirer un objet gênant dans une photo existante. Quelle fonction ?" explain="Le remplissage génératif (Firefly, aussi intégré à Photoshop) ajoute, retire ou remplace un élément d’une image.">
        <QOpt>La traduction de documents</QOpt>
        <QOpt ok>Le remplissage génératif</QOpt>
        <QOpt>Le Consensus Meter</QOpt>
      </QuizQ>
      <QuizQ q="Quel outil sert d’abord à monter une vidéo avec sous-titres automatiques ?" explain="CapCut AI génère des sous-titres automatiques, recadre en vertical et propose des voix off synthétiques.">
        <QOpt ok>CapCut AI</QOpt>
        <QOpt>Elicit</QOpt>
        <QOpt>Grammarly</QOpt>
      </QuizQ>
      <QuizQ q="Pour une vidéo promotionnelle, faire parler un célèbre chef cuisinier grâce à l’IA est…" explain="Imiter le visage ou la voix d’une personne réelle sans accord est un hypertrucage : atteinte à ses droits et obligation de transparence.">
        <QOpt>une bonne idée si la vidéo est courte</QOpt>
        <QOpt>autorisé si on cite son nom</QOpt>
        <QOpt ok>interdit sans son accord : c’est un hypertrucage</QOpt>
      </QuizQ>
      <QuizQ q="Dans un prompt d’image, « espace libre à droite pour un titre » relève de…" explain="C’est la composition : cadrage, point de vue, placement des éléments et espaces réservés.">
        <QOpt>du style</QOpt>
        <QOpt ok>de la composition</QOpt>
        <QOpt>de la lumière</QOpt>
      </QuizQ>
      <QuizQ q="Pour garder le contrôle du rendu d’une vidéo Runway, le mieux est de partir…" explain="Partir d’une image validée donne beaucoup plus de contrôle qu’une description textuelle seule.">
        <QOpt>d’un texte très court</QOpt>
        <QOpt ok>d’une image déjà validée</QOpt>
        <QOpt>d’une musique</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ═══ 80-m8 ═════════════════════════════════════════════════════════════

// ─── Module 8 · Automatisation et bonnes pratiques ──────────────────────────

const M8_Section: Page = () => (
  <Section
    n={8}
    title="Automatisation et bonnes pratiques"
    sub="Comprendre ce qu’on peut faire tourner tout seul, utiliser l’IA de façon responsable, et repartir avec votre plan d’action."
    dur="40 min"
    labs={<DefiBadge defi="plan" />}
  >
    <SecItem n={1}>Qu’est-ce qu’un workflow, que peut-on automatiser ?</SecItem>
    <SecItem n={2}>Zapier · Make · Microsoft Power Automate</SecItem>
    <SecItem n={3}>Utiliser l’IA de manière responsable</SecItem>
    <SecItem n={4}>Atelier final : votre mini-plan IA</SecItem>
  </Section>
);
M8_Section.transition = BLOOM;

// ─── Qu’est-ce qu’un workflow ? ─────────────────────────────────────────────
const M8_Workflow: Page = () => (
  <Frame mod={8} beats={4}>
    <Title>Qu’est-ce qu’un workflow ?</Title>
    <Lede>Une recette que l’ordinateur suit tout seul : « quand ceci arrive, fais cela, puis cela ».</Lede>
    <div style={{ position: 'absolute', left: 120, top: 300, width: 1680, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <FlowNode kind="trigger" label="Quand un email arrive" sub="dans la boîte « contact »" w={360} cls={b.pop(1)} />
      <FlowArrow w={70} cls={b.fade(2)} />
      <FlowNode kind="ai" label="L’IA le résume et le classe" sub="demande, réclamation, devis…" w={360} cls={b.pop(2)} />
      <FlowArrow w={70} cls={b.fade(3)} />
      <FlowNode kind="action" label="Une ligne s’ajoute au tableau" sub="et l’équipe est prévenue" w={360} cls={b.pop(3)} />
      <FlowArrow w={70} cls={b.fade(4)} dashed />
      <FlowNode kind="human" label="Un humain répond" sub="avec le brouillon préparé" w={300} cls={b.pop(4)} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 620, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22, ...dl(400) }}>
      <Card tone="blue" icon="bolt" title="Un déclencheur" size={22}>
        L’événement qui lance tout : un email, un formulaire, une date, un fichier déposé.
      </Card>
      <Card tone="violet" icon="sparkles" title="Des étapes" size={22}>
        Ce que le workflow fait : transformer, résumer, classer — l’IA est une étape parmi d’autres.
      </Card>
      <Card tone="green" icon="send" title="Une action" size={22}>
        Le résultat : un tableau mis à jour, un message envoyé, une tâche créée.
      </Card>
    </div>
  </Frame>
);

// ─── Ma tâche est-elle automatisable ? ──────────────────────────────────────
const M8_Fit: Page = () => (
  <Frame mod={8} kind="exercice">
    <Title>Quelles tâches peut-on automatiser ?</Title>
    <Lede>Prenez une tâche de votre liste de l’atelier 1. Cochez les critères qu’elle remplit.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1130, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="f1">Elle revient souvent (au moins chaque semaine)</CheckItem>
        <CheckItem id="f2">Elle suit toujours les mêmes étapes</CheckItem>
        <CheckItem id="f3">Elle part d’un élément numérique : email, formulaire, fichier</CheckItem>
        <CheckItem id="f4">Les règles s’expliquent en quelques phrases</CheckItem>
        <CheckItem id="f5">Une erreur serait gênante, mais pas grave</CheckItem>
        <CheckItem id="f6">Elle passe d’un outil à l’autre (copier-coller)</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1310, top: 270, width: 490, display: 'flex', flexDirection: 'column', gap: 20, ...dl(300) }}>
        <CheckScore
          max={6}
          label="Potentiel d’automatisation"
          levels={[
            { min: 0, text: 'Faible : gardez l’IA en assistant, à la demande.', tone: 'grey' },
            { min: 3, text: 'Moyen : automatisez une partie, gardez la main.', tone: 'yellow' },
            { min: 5, text: 'Fort : un bon candidat pour un workflow !', tone: 'green' },
          ]}
        />
        <Callout title="À ne pas automatiser" tone="coral" icon="hand" size={21}>
          Décisions sur des personnes, engagements juridiques ou financiers, situations émotionnelles.
        </Callout>
      </div>
    </Checklist>
  </Frame>
);

// ─── Trois exemples (onglets) ───────────────────────────────────────────────
const M8Chain = ({ nodes, ids }: { nodes: [NodeKind, string, string][]; ids: ToolId[] }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      {nodes.map(([kind, label, sub], i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <FlowNode kind={kind} label={label} sub={sub} w={280} cls={A.pop} style={dl(i * 120)} />
          {i < nodes.length - 1 ? <FlowArrow w={46} /> : null}
        </div>
      ))}
    </div>
    <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 18, fontSize: 21, color: C.muted }}>
      Réalisable avec :
      {ids.map((id) => (
        <ToolChip key={id} id={id} size={22} />
      ))}
    </div>
  </div>
);

const M8_Examples: Page = () => (
  <Frame mod={8} kind="demo">
    <Title>Trois workflows typiques</Title>
    <Lede>Cliquez sur chaque onglet. Remarquez où se place, à chaque fois, le contrôle humain.</Lede>
    <Tabs initial="mail">
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, display: 'flex', gap: 12 }}>
        <TabBtn id="mail" tone="blue" icon="mail">
          Email → résumé → réponse
        </TabBtn>
        <TabBtn id="form" tone="teal" icon="form">
          Formulaire → analyse → rapport
        </TabBtn>
        <TabBtn id="meet" tone="yellow" icon="mic">
          Réunion → compte rendu → tâches
        </TabBtn>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 350, width: 1680, height: 480, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '40px 40px', ...dl(150) }}>
        <TabPane id="mail">
          <M8Chain
            ids={['zapier', 'make', 'powerautomate']}
            nodes={[
              ['trigger', 'Email reçu', 'boîte support@'],
              ['ai', 'Résumé et catégorie', 'assistant IA'],
              ['ai', 'Brouillon de réponse', 'selon la catégorie'],
              ['human', 'Relu et envoyé', 'par un conseiller'],
            ]}
          />
        </TabPane>
        <TabPane id="form">
          <M8Chain
            ids={['make', 'zapier', 'powerautomate']}
            nodes={[
              ['trigger', 'Formulaire rempli', 'enquête de satisfaction'],
              ['data', 'Réponses stockées', 'tableur'],
              ['ai', 'Analyse hebdomadaire', 'tendances, irritants'],
              ['out', 'Rapport envoyé', 'au manager, chaque lundi'],
            ]}
          />
        </TabPane>
        <TabPane id="meet">
          <M8Chain
            ids={['fireflies', 'zapier', 'notion']}
            nodes={[
              ['trigger', 'Réunion terminée', 'transcription prête'],
              ['ai', 'Compte rendu', 'synthèse, décisions'],
              ['human', 'Validé par l’animateur', 'en 2 minutes'],
              ['action', 'Tâches créées', 'dans l’outil projet'],
            ]}
          />
        </TabPane>
      </div>
    </Tabs>
  </Frame>
);

// ─── Zapier · Make · Power Automate ─────────────────────────────────────────
const M8Tool = ({ id, tone, pitch, who, pros, ai, d }: { id: ToolId; tone: Tone; pitch: string; who: string; pros: string[]; ai: string; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 26px', borderTop: `8px solid ${tool(id).c}`, display: 'flex', flexDirection: 'column', gap: 14, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <ToolTile id={id} size={64} />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy }}>{tool(id).name}</div>
        <div style={{ fontSize: 20, color: STRONG[tone], fontWeight: 600 }}>{pitch}</div>
      </div>
    </div>
    <div style={{ fontSize: 20, color: C.muted }}>
      <strong style={{ color: C.ink }}>Pour qui : </strong>
      {who}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {pros.map((p) => (
        <Bullet key={p} size={21} tone={tone}>
          {p}
        </Bullet>
      ))}
    </div>
    <div style={{ marginTop: 'auto', background: T.violet.bg, borderRadius: 12, padding: '12px 16px', fontSize: 19, lineHeight: 1.4, color: C.ink }}>
      <Icon name="sparkles" size={20} color={C.violet} style={{ display: 'inline-block', verticalAlign: '-3px', marginRight: 6 }} />
      {ai}
    </div>
  </div>
);

const M8_Tools: Page = () => (
  <Frame mod={8}>
    <Title>Trois outils pour automatiser sans coder</Title>
    <Lede>Le but n’est pas de devenir expert : c’est de savoir ce qui est possible, et à qui en parler.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, height: 600, display: 'flex', gap: 24 }}>
      <M8Tool
        id="zapier"
        tone="coral"
        pitch="le plus simple pour débuter"
        who="tout le monde, en quelques clics"
        pros={['Des milliers d’applications connectées', 'Logique « quand… alors… » très lisible', 'Modèles prêts à l’emploi']}
        ai="Étapes IA intégrées, et création d’un workflow à partir d’une simple description."
        d={100}
      />
      <M8Tool
        id="make"
        tone="violet"
        pitch="le plus visuel et flexible"
        who="les profils à l’aise avec la logique"
        pros={['Scénarios dessinés comme un schéma', 'Embranchements, filtres, boucles', 'Souvent économique à volume égal']}
        ai="Modules IA (ChatGPT, Claude, Gemini…) à glisser dans le scénario."
        d={220}
      />
      <M8Tool
        id="powerautomate"
        tone="blue"
        pitch="le natif de Microsoft 365"
        who="les entreprises sous Outlook, Teams, SharePoint"
        pros={['Souvent déjà inclus dans vos licences', 'Outlook, Teams, Excel, SharePoint connectés', 'Cadre de sécurité de l’entreprise']}
        ai="Décrivez le flux en langage courant, Copilot le construit."
        d={340}
      />
    </div>
  </Frame>
);

// ─── Démo : un Zap en 4 étapes ──────────────────────────────────────────────
const M8ZapStep = ({ n, icon, app, what, c }: { n: number; icon: IconName; app: string; what: string; c: string }) => (
  <div className={b.pop(n)} style={{ display: 'flex', alignItems: 'center', gap: 18, background: '#fff', borderRadius: 14, boxShadow: `inset 0 0 0 2px ${C.rule}`, padding: '14px 18px', width: 720 }}>
    <span style={{ flex: 'none', width: 50, height: 50, borderRadius: 12, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icon} size={28} color="#fff" />
    </span>
    <div>
      <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted }}>
        {n === 1 ? 'Déclencheur' : `Action ${n - 1}`} · {app}
      </div>
      <div style={{ fontSize: 22, fontWeight: 600, color: C.ink }}>{what}</div>
    </div>
  </div>
);

const M8_Demo: Page = () => (
  <Frame mod={8} kind="demo" beats={5}>
    <Title>Démo : les demandes de devis triées toutes seules</Title>
    <ToolWindow id="zapier" title="Zap · demandes de devis" cls={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 800, height: 700 }} pad={28}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <M8ZapStep n={1} icon="mail" app="Gmail / Outlook" what="Nouvel email avec « devis » dans l’objet" c="#EA4335" />
        <Icon name="arrow" size={26} color={C.faint} style={{ transform: 'rotate(90deg)' }} />
        <M8ZapStep n={2} icon="sparkles" app="Assistant IA" what="Extraire : client, besoin, budget, urgence" c={C.violet} />
        <Icon name="arrow" size={26} color={C.faint} style={{ transform: 'rotate(90deg)' }} />
        <M8ZapStep n={3} icon="table" app="Google Sheets / Excel" what="Ajouter une ligne au suivi des devis" c="#0F9D58" />
        <Icon name="arrow" size={26} color={C.faint} style={{ transform: 'rotate(90deg)' }} />
        <M8ZapStep n={4} icon="bell" app="Teams / Slack" what="Prévenir le commercial si urgence = haute" c="#5B5FC7" />
      </div>
    </ToolWindow>
    <div style={{ position: 'absolute', left: 980, top: 190, width: 820, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className={b.on(2)}>
        <Eyebrow c={C.violet} size={18}>
          Le prompt de l’étape IA
        </Eyebrow>
        <div style={{ marginTop: 8 }}>
          <CodeDark size={19} wrap>
            Extrais de cet email : nom du client, besoin en une phrase, budget (ou « non précisé »), urgence (haute / normale).{'\n'}
            <Cs>Réponds uniquement en JSON.</Cs> N’invente rien.
          </CodeDark>
        </div>
      </div>
      <div className={b.on(5)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Stat value="0 min" label="de saisie manuelle par demande, au lieu de 5" tone="green" size={80} />
        <Callout title="Et le contrôle ?" tone="pink" icon="humanCheck" size={22}>
          Le workflow trie et prévient ; <strong>c’est le commercial qui répond</strong>. Chaque semaine, il vérifie quelques lignes du tableau.
        </Callout>
      </div>
    </div>
  </Frame>
);

// ─── Feu tricolore des données ──────────────────────────────────────────────
const M8Zone = ({ x, title, tone, icon, answer }: { x: number; title: string; tone: Tone; icon: IconName; answer: string }) => (
  <div className={A.in} style={{ position: 'absolute', left: x, top: 480, width: 540, height: 420, boxSizing: 'border-box', borderRadius: 20, background: T[tone].bg, boxShadow: `inset 0 0 0 2.5px ${T[tone].bd}`, padding: '18px 22px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconTile name={icon} tone={tone} size={44} solid />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: T[tone].fg }}>{title}</span>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 22, right: 22, bottom: 18, fontSize: 19, lineHeight: 1.4, color: T[tone].fg, background: '#fff', borderRadius: 12, padding: '10px 14px' }}>
      <strong>Proposition : </strong>
      {answer}
    </div>
  </div>
);

const M8_Data: Page = () => (
  <Frame mod={8} kind="exercice" beats={1}>
    <Title>Le feu tricolore des données</Title>
    <Lede>Que peut-on coller dans un assistant IA ? Glissez chaque donnée dans sa couleur, puis → pour notre proposition.</Lede>
    <M8Zone x={120} title="Vert · librement" tone="green" icon="check" answer="texte public, brouillon de post, cas anonymisé." />
    <M8Zone x={690} title="Orange · outil pro validé" tone="yellow" icon="shieldCheck" answer="CR interne, proposition commerciale, email client." />
    <M8Zone x={1260} title="Rouge · jamais" tone="coral" icon="lock" answer="mots de passe, paie, santé, données bancaires." />
    <Drag x={120} y={262} w={530} tone="grey">Un article de presse public</Drag>
    <Drag x={690} y={262} w={530} tone="grey">Un mot de passe ou un accès</Drag>
    <Drag x={1260} y={262} w={540} tone="grey">Un compte rendu de réunion interne</Drag>
    <Drag x={120} y={330} w={530} tone="grey">Les fiches de paie de l’équipe</Drag>
    <Drag x={690} y={330} w={530} tone="grey">Le brouillon d’un post LinkedIn</Drag>
    <Drag x={1260} y={330} w={540} tone="grey">Un email client avec nom et adresse</Drag>
    <Drag x={120} y={398} w={530} tone="grey">Un cas client anonymisé</Drag>
    <Drag x={690} y={398} w={530} tone="grey">Un arrêt maladie, un dossier médical</Drag>
    <Drag x={1260} y={398} w={540} tone="grey">Une proposition commerciale confidentielle</Drag>
  </Frame>
);

// ─── Six réflexes d’un usage responsable ────────────────────────────────────
const M8Rule = ({ n, icon, tone, title, children }: { n: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 24px', borderTop: `7px solid ${STRONG[tone]}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={52} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: C.navy, lineHeight: 1.2 }}>{title}</div>
    </div>
    <div style={{ fontSize: 21, lineHeight: 1.42, color: C.soft }}>{children}</div>
  </div>
);

const M8_Responsible: Page = () => (
  <Frame mod={8} beats={6}>
    <Title>Utiliser l’IA de manière responsable : six réflexes</Title>
    <Lede>Ce que nous avons vu toute la journée, rassemblé sur une page. À afficher à côté de votre écran.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
      <M8Rule n={1} icon="search" tone="blue" title="Vérifier les informations">
        Chiffres, dates, noms, citations : on remonte à la source avant d’utiliser.
      </M8Rule>
      <M8Rule n={2} icon="alert" tone="yellow" title="Repérer les hallucinations">
        Trop précis, trop sûr, invérifiable : les signes d’une invention plausible.
      </M8Rule>
      <M8Rule n={3} icon="lock" tone="coral" title="Protéger les données confidentielles">
        Rien de sensible sans vérifier les règles de l’entreprise et l’outil autorisé.
      </M8Rule>
      <M8Rule n={4} icon="users" tone="teal" title="Respecter clients et collègues">
        Données personnelles : RGPD. Anonymisez, minimisez, informez.
      </M8Rule>
      <M8Rule n={5} icon="ticket" tone="violet" title="Propriété intellectuelle">
        Conditions d’usage des contenus générés, droits des œuvres et des marques d’autrui.
      </M8Rule>
      <M8Rule n={6} icon="humanCheck" tone="green" title="Garder la validation humaine">
        Dès qu’il y a un enjeu, c’est un humain qui relit, décide et signe.
      </M8Rule>
    </div>
  </Frame>
);

// ─── Atelier final ──────────────────────────────────────────────────────────
const M8_Lab: Page = () => (
  <LabPage
    mod={8}
    n="8"
    title="Mon mini-plan IA"
    defi="plan"
    who="Individuel, puis partage au groupe"
    minutes={15}
    tools={['chatgpt', 'copilot', 'perplexity', 'notebooklm', 'gamma', 'fireflies']}
    label="Module 8 · Atelier final"
    objective={
      <>
        Choisir <strong>une tâche chronophage</strong> de votre activité et construire votre mini-plan : tâche → outil IA → méthode → résultat attendu → contrôle humain.
      </>
    }
    where={
      <>
        Votre mini-plan sur une ligne (modèle page suivante), et <strong>une date</strong> : quand le testerez-vous pour de vrai ?
      </>
    }
    crit={
      <>
        <CheckItem id="l8-c1" size={21}>Une tâche réelle et fréquente</CheckItem>
        <CheckItem id="l8-c2" size={21}>L’outil est autorisé pour ces données</CheckItem>
        <CheckItem id="l8-c3" size={21}>Le prompt ou la méthode est écrit</CheckItem>
        <CheckItem id="l8-c4" size={21}>Le contrôle humain est précis</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div><strong style={{ color: C.navy }}>1.</strong> Reprenez votre fiche de l’atelier 1 : choisissez la tâche n° 1.</div>
      <div><strong style={{ color: C.navy }}>2.</strong> Choisissez l’outil parmi les 20 vus aujourd’hui (ou un workflow).</div>
      <div><strong style={{ color: C.navy }}>3.</strong> Écrivez la méthode : le prompt, les étapes.</div>
      <div><strong style={{ color: C.navy }}>4.</strong> Définissez le résultat attendu et le gain de temps visé.</div>
      <div><strong style={{ color: C.navy }}>5.</strong> Précisez le contrôle : qui vérifie quoi, quand.</div>
    </div>
    <Bonus>Volontaires : présentez votre mini-plan au groupe en 1 minute.</Bonus>
  </LabPage>
);

// ─── Le canevas du mini-plan (éditable) ─────────────────────────────────────
const PLAN_COLS: { t: string; icon: IconName; tone: Tone; ph: string }[] = [
  { t: 'Tâche', icon: 'clock', tone: 'blue', ph: 'Quelle tâche, à quelle fréquence, combien de temps ?' },
  { t: 'Outil IA', icon: 'tool', tone: 'violet', ph: 'Lequel des 20 outils ? Autorisé ?' },
  { t: 'Méthode', icon: 'chat', tone: 'teal', ph: 'Le prompt, les étapes, le workflow' },
  { t: 'Résultat attendu', icon: 'target', tone: 'green', ph: 'Le livrable et le temps gagné' },
  { t: 'Contrôle humain', icon: 'humanCheck', tone: 'pink', ph: 'Qui vérifie quoi, quand ?' },
];

const PLAN_EX: Record<string, string[]> = {
  devis: [
    'Répondre aux demandes de devis · 10 par jour · 5 min chacune',
    'Copilot dans Outlook (licence entreprise)',
    'Prompt modèle « Mes prompts » : contexte client + grille tarifaire jointe + ton maison, 120 mots',
    'Brouillon prêt en 1 min · ≈ 2 h gagnées par semaine',
    'Je relis prix, délais et nom du client avant chaque envoi',
  ],
  veille: [
    'Veille concurrentielle hebdomadaire · 1 h chaque lundi',
    'Perplexity (Espace « Veille ») puis NotebookLM',
    'Même recherche chaque lundi, sources de moins de 7 jours ; synthèse en 5 points',
    'Note de veille en 15 min au lieu d’1 h',
    'J’ouvre les 3 sources principales ; rien de non vérifié dans la note',
  ],
  vide: ['', '', '', '', ''],
};

const M8_Plan: Page = () => {
  const [v, setV] = useState<string[]>(PLAN_EX.devis);
  return (
    <Frame mod={8} kind="lab" label="Atelier final · Le canevas">
      <Title size={46}>Le canevas de votre mini-plan</Title>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 172, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 21, color: C.muted, marginRight: 4 }}>Charger :</span>
        <Btn size={19} ghost tone="blue" icon="mail" onClick={() => setV(PLAN_EX.devis)}>
          Exemple devis
        </Btn>
        <Btn size={19} ghost tone="teal" icon="search" onClick={() => setV(PLAN_EX.veille)}>
          Exemple veille
        </Btn>
        <Btn size={19} ghost tone="grey" icon="reset" onClick={() => setV(PLAN_EX.vide)}>
          Canevas vide
        </Btn>
        <span style={{ fontSize: 19, color: C.faint, marginLeft: 10 }}>Cliquez dans une case pour écrire en direct.</span>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'flex', alignItems: 'stretch', gap: 10 }}>
        {PLAN_COLS.map((c, i) => (
          <div key={c.t} style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
            <div className={A.in} style={{ flex: 1, minWidth: 0, height: 560, boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, borderTop: `7px solid ${STRONG[c.tone]}`, padding: '18px 18px', display: 'flex', flexDirection: 'column', gap: 12, ...dl(i * 100) }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <IconTile name={c.icon} tone={c.tone} size={44} solid />
                <span style={{ fontFamily: display, fontWeight: 800, fontSize: 22, color: C.navy }}>{c.t}</span>
              </div>
              <textarea
                data-osd-interactive
                value={v[i]}
                placeholder={c.ph}
                onChange={(e) => {
                  const val = e.target.value;
                  setV((o) => o.map((x, j) => (j === i ? val : x)));
                }}
                style={{ flex: 1, width: '100%', minWidth: 0, boxSizing: 'border-box', resize: 'none', border: 'none', outline: 'none', borderRadius: 12, background: T[c.tone].bg, padding: '14px 16px', fontFamily: body, fontSize: 22, lineHeight: 1.45, color: C.ink }}
              />
            </div>
            {i < PLAN_COLS.length - 1 ? <Icon name="arrow" size={26} color={C.faint} /> : null}
          </div>
        ))}
      </div>
      <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 860, ...dl(700) }}>
        Recopiez votre plan sur papier ou dans votre document « Mes prompts » : la page se réinitialise à chaque ouverture.
      </Hint>
    </Frame>
  );
};

// ─── Quiz M8 ────────────────────────────────────────────────────────────────
const M8_Quiz: Page = () => (
  <Frame mod={8} kind="quiz">
    <Title>Quiz · Module 8</Title>
    <QuizSeries y={200}>
      <QuizQ q="Dans un workflow, « un nouvel email arrive dans la boîte contact » est…" explain="C’est le déclencheur : l’événement qui lance le workflow.">
        <QOpt ok>le déclencheur</QOpt>
        <QOpt>l’action finale</QOpt>
        <QOpt>la validation humaine</QOpt>
      </QuizQ>
      <QuizQ q="Votre entreprise travaille sous Outlook, Teams et SharePoint. L’outil d’automatisation le plus naturel ?" explain="Power Automate est intégré à l’écosystème Microsoft 365 et souvent déjà inclus dans les licences.">
        <QOpt>CapCut</QOpt>
        <QOpt ok>Microsoft Power Automate</QOpt>
        <QOpt>Consensus</QOpt>
      </QuizQ>
      <QuizQ q="Quelle tâche ne faut-il pas automatiser entièrement ?" explain="Une décision qui touche une personne ou engage l’entreprise exige une validation humaine.">
        <QOpt>Classer les demandes de devis entrantes</QOpt>
        <QOpt ok>Refuser une candidature à un poste</QOpt>
        <QOpt>Ajouter une ligne dans un tableau de suivi</QOpt>
      </QuizQ>
      <QuizQ q="Un email client avec nom, adresse et réclamation : où peut-il aller ?" explain="Données personnelles : uniquement dans un outil professionnel validé par l’entreprise, en minimisant ce qui est transmis.">
        <QOpt>Dans n’importe quel assistant gratuit</QOpt>
        <QOpt ok>Seulement dans un outil professionnel validé</QOpt>
        <QOpt>Sur un forum pour demander conseil</QOpt>
      </QuizQ>
      <QuizQ q="Dans votre mini-plan, la colonne « contrôle humain » doit préciser…" explain="Un contrôle efficace est précis : qui vérifie, quoi exactement, et à quel moment.">
        <QOpt>« je ferai attention »</QOpt>
        <QOpt ok>qui vérifie quoi, et quand</QOpt>
        <QOpt>rien si l’outil est payant</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ═══ 90-close ══════════════════════════════════════════════════════════

// ─── Bilan & clôture ────────────────────────────────────────────────────────

// ─── Mémo : quel outil pour quelle tâche ────────────────────────────────────
const CMemo = ({ icon, tone, verb, ids, d }: { icon: IconName; tone: Tone; verb: string; ids: ToolId[]; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 22px', borderLeft: `8px solid ${STRONG[tone]}`, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Icon name={icon} size={30} color={STRONG[tone]} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy }}>{verb}</span>
    </div>
    <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: '12px 22px' }}>
      {ids.map((id) => (
        <ToolChip key={id} id={id} size={21} />
      ))}
    </div>
  </div>
);

const C_Memo: Page = () => (
  <Frame mod={9} kind="synthese">
    <Title>Le mémo : quel outil pour quelle tâche ?</Title>
    <Lede>Les neuf verbes du matin, et les outils de la journée qui y répondent le mieux.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
      <CMemo d={100} icon="pen" tone="blue" verb="Rédiger" ids={['chatgpt', 'copilot', 'claude', 'gemini']} />
      <CMemo d={160} icon="loop" tone="violet" verb="Reformuler, corriger" ids={['deepl', 'grammarly', 'claude']} />
      <CMemo d={220} icon="layers" tone="teal" verb="Résumer" ids={['copilot', 'notebooklm', 'claude']} />
      <CMemo d={280} icon="translate" tone="navy" verb="Traduire" ids={['deepl', 'chatgpt']} />
      <CMemo d={340} icon="search" tone="blue" verb="Rechercher" ids={['perplexity', 'gemini', 'elicit', 'consensus']} />
      <CMemo d={400} icon="chart" tone="green" verb="Analyser" ids={['chatgpt', 'claude', 'notebooklm']} />
      <CMemo d={460} icon="image" tone="pink" verb="Créer" ids={['canva', 'gamma', 'firefly', 'runway', 'capcut']} />
      <CMemo d={520} icon="calendar" tone="yellow" verb="Organiser" ids={['otter', 'fireflies', 'notion']} />
      <CMemo d={580} icon="bolt" tone="coral" verb="Automatiser" ids={['zapier', 'make', 'powerautomate']} />
    </div>
  </Frame>
);

// ─── Grand quiz final ───────────────────────────────────────────────────────
const C_Quiz: Page = () => (
  <Frame mod={9} kind="quiz">
    <Title>Le grand quiz de la journée</Title>
    <QuizSeries y={200}>
      <QuizQ q="Pourquoi une IA générative peut-elle inventer un chiffre avec assurance ?" explain="Elle prédit la suite de mots la plus plausible ; sans source fournie ou consultée, elle comble les manques par des inventions vraisemblables.">
        <QOpt>Parce qu’elle ment volontairement</QOpt>
        <QOpt ok>Parce qu’elle prédit des mots plausibles, sans vérifier</QOpt>
        <QOpt>Parce qu’elle manque de mémoire vive</QOpt>
      </QuizQ>
      <QuizQ q="Quelles sont les 5 briques d’un bon prompt ?" explain="Contexte, objectif, rôle, contraintes, format : avec elles, l’IA ne devine plus, elle exécute.">
        <QOpt ok>Contexte, objectif, rôle, contraintes, format</QOpt>
        <QOpt>Politesse, longueur, anglais, émojis, urgence</QOpt>
        <QOpt>Titre, sous-titre, image, lien, signature</QOpt>
      </QuizQ>
      <QuizQ q="Vous voulez une réponse fondée uniquement sur vos procédures internes. Quel outil ?" explain="NotebookLM répond uniquement à partir des documents chargés, avec des citations vers les passages exacts.">
        <QOpt>Runway</QOpt>
        <QOpt ok>NotebookLM</QOpt>
        <QOpt>Grammarly</QOpt>
      </QuizQ>
      <QuizQ q="Votre réunion est terminée. Pour obtenir actions et responsables automatiquement ?" explain="Fireflies.ai (ou Otter.ai) transcrit la réunion et extrait les actions — après information et accord des participants.">
        <QOpt ok>Fireflies.ai, annoncé aux participants</QOpt>
        <QOpt>Adobe Firefly</QOpt>
        <QOpt>Consensus</QOpt>
      </QuizQ>
      <QuizQ q="Transformer une note en présentation de 8 slides en une minute ?" explain="Gamma génère une présentation complète à partir d’un texte ; choisissez de conserver votre texte pour éviter les ajouts.">
        <QOpt>DeepL</QOpt>
        <QOpt>Otter.ai</QOpt>
        <QOpt ok>Gamma</QOpt>
      </QuizQ>
      <QuizQ q="La règle qui résume la journée ?" explain="L’IA propose un premier jet, vous vérifiez, ajustez et décidez. La responsabilité reste humaine.">
        <QOpt>« L’IA décide, je valide sans lire »</QOpt>
        <QOpt ok>« L’IA propose, vous disposez »</QOpt>
        <QOpt>« Plus l’outil est cher, plus il est fiable »</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Auto-positionnement final ──────────────────────────────────────────────
const C_AutoPos: Page = () => (
  <Frame mod={9} kind="exercice">
    <Title>Auto-positionnement : votre point d’arrivée</Title>
    <Lede>Les huit affirmations de ce matin. Cochez ce que vous savez faire maintenant.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="af1">Expliquer simplement ce qu’est une IA générative et ses limites</CheckItem>
        <CheckItem id="af2">Citer trois tâches de mon poste que l’IA peut accélérer</CheckItem>
        <CheckItem id="af3">Écrire un prompt avec contexte, objectif, rôle, contraintes et format</CheckItem>
        <CheckItem id="af4">Choisir entre ChatGPT, Copilot, Gemini, Claude et Perplexity selon la tâche</CheckItem>
        <CheckItem id="af5">Vérifier une information donnée par une IA avant de l’utiliser</CheckItem>
        <CheckItem id="af6">Transformer des notes en email, en présentation ou en visuel avec l’IA</CheckItem>
        <CheckItem id="af7">Obtenir automatiquement le compte rendu et les actions d’une réunion</CheckItem>
        <CheckItem id="af8">Savoir quelles données je n’ai pas le droit de confier à une IA</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau d’arrivée"
          levels={[
            { min: 0, text: 'Reprenez le mémo et testez un outil par semaine.', tone: 'yellow' },
            { min: 4, text: 'Bien parti : appliquez votre mini-plan dès demain.', tone: 'blue' },
            { min: 7, text: 'Bravo : vous pouvez aider vos collègues !', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Comparez avec votre score de ce matin : de combien de points avez-vous progressé ?
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Vos 30 prochains jours ─────────────────────────────────────────────────
const CStep = ({ when, tone, icon, title, items, d }: { when: string; tone: Tone; icon: IconName; title: string; items: string[]; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 26px', borderTop: `7px solid ${STRONG[tone]}`, ...dl(d) }}>
    <Tag tone={tone} size={18}>
      {when}
    </Tag>
    <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={54} solid />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy, lineHeight: 1.2 }}>{title}</div>
    </div>
    <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((x) => (
        <Bullet key={x} size={22} tone={tone}>
          {x}
        </Bullet>
      ))}
    </div>
  </div>
);

const C_Next: Page = () => (
  <Frame mod={9}>
    <Title>Vos 30 prochains jours</Title>
    <Lede>Une formation ne fait gagner du temps que si elle devient une habitude. Trois étapes simples.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 24 }}>
      <CStep
        when="Dès demain"
        tone="blue"
        icon="rocket"
        title="Tester votre mini-plan"
        items={['Lancez la tâche n° 1 avec l’outil choisi', 'Créez votre document « Mes prompts »', 'Vérifiez l’outil autorisé par votre entreprise']}
        d={100}
      />
      <CStep
        when="Semaines 2 et 3"
        tone="violet"
        icon="tool"
        title="Ajouter un spécialiste"
        items={['Un nouvel outil par semaine, sur une vraie tâche', 'Gardez les prompts qui marchent', 'Abandonnez sans regret ce qui ne sert pas']}
        d={250}
      />
      <CStep
        when="Jour 30"
        tone="green"
        icon="chart"
        title="Mesurer et partager"
        items={['Combien de temps gagné par semaine ?', 'Partagez une astuce avec votre équipe', 'Identifiez une tâche à automatiser']}
        d={400}
      />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 800, width: 1680, ...dl(700) }}>
      <Callout title="Le fil conducteur" tone="violet" icon="humanCheck" size={26}>
        L’IA propose, <strong>vous disposez</strong> : vous vérifiez, vous décidez, vous signez.
      </Callout>
    </div>
  </Frame>
);

// ─── Votre avis ─────────────────────────────────────────────────────────────
const C_Feedback: Page = () => (
  <Frame mod={9} kind="exercice">
    <Title>Votre avis, à chaud</Title>
    <Lede>Deux votes à main levée avant de nous quitter. Le questionnaire d’évaluation détaillé suit par email.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800 }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Cette journée m’a été…
      </Eyebrow>
      <Poll>
        <PollRow id="c-f1" label="Très utile" tone="green" icon="star" />
        <PollRow id="c-f2" label="Utile" tone="blue" icon="checkCircle" />
        <PollRow id="c-f3" label="Moyennement utile" tone="yellow" icon="smile" />
        <PollRow id="c-f4" label="Peu utile" tone="coral" icon="alert" />
      </Poll>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 980, top: 270, width: 820, ...dl(200) }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        L’outil que j’utilise dès demain
      </Eyebrow>
      <Poll>
        <PollRow id="c-t1" label="Un assistant : ChatGPT, Copilot, Gemini, Claude" tone="blue" icon="chat" />
        <PollRow id="c-t2" label="Perplexity ou NotebookLM" tone="teal" icon="search" />
        <PollRow id="c-t3" label="DeepL, Grammarly ou Gamma" tone="green" icon="pen" />
        <PollRow id="c-t4" label="Fireflies, Otter ou Notion AI" tone="yellow" icon="mic" />
        <PollRow id="c-t5" label="Canva, Firefly, Runway ou CapCut" tone="pink" icon="image" />
      </Poll>
    </div>
  </Frame>
);

// ─── Merci ──────────────────────────────────────────────────────────────────
const C_Thanks: Page = () => (
  <Frame mod={9} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={110} r={46} cls={A.fade} />
    <Outline x={1700} y={930} w={300} h={200} r={40} color={C.violet} />
    <div style={{ position: 'absolute', left: 390, top: 170, width: 1000 }}>
      <Eyebrow c={C.violet} cls={A.in}>
        Fin de la formation
      </Eyebrow>
      <h1 className={A.in} style={{ margin: '20px 0 0', fontFamily: display, fontWeight: 800, fontSize: 130, lineHeight: 1, letterSpacing: '-0.03em', color: C.navy, ...dl(120) }}>
        Merci !
      </h1>
      <p className={A.in} style={{ margin: '34px 0 0', fontSize: 34, lineHeight: 1.4, color: C.soft, ...dl(240) }}>
        Vingt outils, une méthode, et une règle :<br />
        <strong style={{ color: C.plum }}>l’IA propose, vous disposez.</strong>
      </p>
      <p className={A.in} style={{ margin: '28px 0 0', fontSize: 26, lineHeight: 1.45, color: C.muted, ...dl(360) }}>
        Des questions ? C’est le moment.
      </p>
    </div>
    <Portrait w={170} x={390} y={690} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 610, top: 715, ...dl(400) }}>
      <Eyebrow c={C.muted} size={20}>
        Formateur
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>IA appliquée aux métiers · productivité augmentée</div>
    </div>
    <div style={{ position: 'absolute', left: 1440, top: 230, width: 400, display: 'grid', gridTemplateColumns: 'repeat(4, 84px)', gap: 12 }}>
      {PROG20.map((id, i) => (
        <div key={i} className={A.pop} style={dl(500 + i * 50)}>
          <div className={A.float} style={dl((i % 4) * 400)}>
            <ToolTile id={id} size={84} />
          </div>
        </div>
      ))}
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
  title: "Les 20 outils IA qui font gagner du temps",
  createdAt: '2026-10-12T20:28:49.000Z',
};

export default [
  O_Cover,
  O_Welcome,
  O_Poll,
  O_Objectifs,
  O_Programme,
  O_Toolbox,
  O_AutoPos,
  O_Setup,
  M1_Section,
  M1_GenAI,
  M1_How,
  M1_Verbs,
  M1_Limits,
  M1_Calc,
  M1_Sort,
  M1_Choose,
  M1_Lab,
  M1_LabSheet,
  M1_Quiz,
  M2_Section,
  M2_What,
  M2_Bad,
  M2_Builder,
  M2_Examples,
  M2_Iterate,
  M2_Verify,
  M2_Formulas,
  M2_Lab,
  M2_LabFix,
  M2_Quiz,
  M3_Section,
  M3_Panorama,
  M3_ChatGPT,
  M3_Copilot,
  M3_Gemini,
  M3_Claude,
  M3_Perplexity,
  M3_Lab,
  M3_LabPrompts,
  M3_Grid,
  M3_Which,
  M3_Quiz,
  M4_Section,
  M4_Where,
  M4_Perplexity,
  M4_NotebookLM,
  M4_Elicit,
  M4_Consensus,
  M4_Method,
  M4_Game,
  M4_Lab,
  M4_Sheet,
  M4_Note,
  M4_Quiz,
  M5_Section,
  M5_Chain,
  M5_Grammarly,
  M5_DeepL,
  M5_Canva,
  M5_Gamma,
  M5_Rewrite,
  M5_Lab,
  M5_LabMat,
  M5_Quiz,
  M6_Section,
  M6_Cost,
  M6_Otter,
  M6_Fireflies,
  M6_Notion,
  M6_Rules,
  M6_Pipeline,
  M6_Lab,
  M6_Transcript,
  M6_Fix,
  M6_Quiz,
  M7_Section,
  M7_ImgPrompt,
  M7_Firefly,
  M7_Canva,
  M7_Runway,
  M7_CapCut,
  M7_Rights,
  M7_Lab,
  M7_LabSteps,
  M7_Quiz,
  M8_Section,
  M8_Workflow,
  M8_Fit,
  M8_Examples,
  M8_Tools,
  M8_Demo,
  M8_Data,
  M8_Responsible,
  M8_Lab,
  M8_Plan,
  M8_Quiz,
  C_Memo,
  C_Quiz,
  C_AutoPos,
  C_Next,
  C_Feedback,
  C_Thanks,
] satisfies Page[];

// Speaker notes — one entry per page, same order as the default export.
export const notes: (string | undefined)[] = [
  `⏱ 2 min · COUVERTURE · 9:00

OBJECTIF — Accueillir, rassurer : c’est une formation pour débutants, orientée gain de temps concret.

DIRE — « Bonjour à toutes et à tous, et bienvenue. Aujourd’hui, on va parler d’intelligence artificielle, mais surtout de temps : le temps que vous passez sur des emails, des comptes rendus, des recherches, des présentations. À droite, vous voyez les vingt outils numérotés du programme. Rassurez-vous : personne ne vous demandera de les retenir par cœur. L’objectif, c’est que ce soir vous sachiez lequel ouvrir pour quelle tâche, et comment lui parler. »

ANIMATION — Laisser les tuiles apparaître. Pointer deux ou trois noms connus (ChatGPT, Copilot, Canva) pour montrer qu’on part de choses familières.

TRANSITION — « Quelques mots sur la journée et sur moi. »`,
  `⏱ 2 min · BIENVENUE

OBJECTIF — Poser le contrat pédagogique et le fil conducteur.

DIRE — « Sept heures, vingt outils, huit ateliers. Plus de la moitié du temps, c’est vous qui tenez la souris. Mon rôle : vous montrer, vous éviter les pièges, et vous aider à choisir. Votre rôle : tester sur vos propres cas — avec des données fictives, j’y reviendrai. Et le fil conducteur, que vous allez entendre souvent : l’IA propose, vous disposez. Elle produit un premier jet ; c’est vous qui décidez de ce qui part. »

INSISTER — Il n’y a pas de question naïve. Beaucoup de participants ont peur de « mal utiliser » l’IA : désamorcer dès maintenant.

TRANSITION — « Faisons connaissance avec un petit vote. »`,
  `⏱ 4 min · TOUR DE TABLE (sondage)

OBJECTIF — Connaître le niveau du groupe et ses irritants pour adapter les démonstrations.

DIRE — « Premier vote : à quelle fréquence utilisez-vous l’IA aujourd’hui ? » Compter les mains, cliquer. « Deuxième vote, le plus important : qu’est-ce qui vous prend le plus de temps ? Vous pouvez voter deux fois. »

ANIMATION — Cliquer une ligne par main levée. Noter les deux irritants les plus votés : ce sont les exemples à privilégier dans les démonstrations de l’après-midi (M5 pour les emails et documents, M6 pour les réunions, M4 pour la recherche). Repérer les utilisateurs quotidiens : leur proposer d’aider un voisin débutant pendant les ateliers.

TRANSITION — « Voici ce que vous saurez faire ce soir. »`,
  `⏱ 2 min · OBJECTIFS

OBJECTIF — Présenter les neuf objectifs du programme en quatre gestes faciles à retenir.

DIRE — « Le programme compte neuf objectifs. Je les range en quatre gestes. Comprendre : ce que fait l’IA générative, et ce qu’elle peut faire pour vous. Demander : le prompting, c’est-à-dire l’art de formuler une demande. Produire : c’est le gros de la journée, avec les vingt outils, pour vos emails, documents, réunions, présentations, et un aperçu de l’automatisation. Encadrer : utiliser tout cela de manière responsable, sans mettre en danger vos données ni celles de vos clients. »

TRANSITION — « Et voici comment la journée est découpée. »`,
  `⏱ 2 min · PROGRAMME

OBJECTIF — Donner la carte de la journée.

DIRE — « Le matin, on pose les bases qui servent partout : comprendre l’IA, savoir lui parler, et découvrir les cinq grands assistants. L’après-midi, on produit : un module par grande famille de tâches — rechercher, rédiger, les réunions, la création visuelle — et on termine par l’automatisation et les bonnes pratiques, avec votre plan d’action personnel. Le bandeau en haut à droite vous dit toujours où nous en sommes. »

ANIMATION — Les horaires sont indicatifs : ajuster au rythme du groupe. Garder les 40 dernières minutes pour M8 et le bilan, c’est là que se construit le plan d’action.

TRANSITION — « Voici les outils, rangés par famille. »`,
  `⏱ 2 min · LA BOÎTE À OUTILS

OBJECTIF — Montrer que les 20 outils se rangent en six familles d’usages.

DIRE — « Six familles. Les assistants, les généralistes qui savent presque tout faire. La recherche, pour trouver et vérifier de l’information. La rédaction, pour corriger, traduire, mettre en forme. Les réunions, pour ne plus prendre de notes. La création, pour les images et les vidéos. Et l’automatisation, pour que certaines tâches se fassent toutes seules. Vous remarquerez que Perplexity et Canva apparaissent deux fois : c’est voulu, ce sont deux outils polyvalents que l’on verra sous deux angles. »

INSISTER — On retient une famille et un usage, pas un nom d’outil. Les outils changent vite ; les usages restent.

TRANSITION — « Avant de commencer, mesurons votre point de départ. »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT (exercice)

OBJECTIF — Mesurer le niveau de départ, exigence du dispositif d’évaluation.

DIRE — « Huit affirmations, une par compétence visée aujourd’hui. Cochez seulement ce que vous savez faire maintenant, sans aide. Notez votre score sur une feuille : on refera exactement le même exercice ce soir, et vous verrez la différence. »

ANIMATION — Faire cocher un volontaire à l’écran, ou laisser chacun noter sur papier. Repérer les scores élevés : leur proposer les bonus des ateliers.

TRANSITION — « Dernière vérification : votre équipement. »`,
  `⏱ 3 min · CHECK-UP (minuteur 3 min)

OBJECTIF — Vérifier l’accès aux outils et poser la règle d’or sur les données.

DIRE — « Trois minutes : vérifiez chaque ligne. Pas besoin d’ouvrir les vingt comptes maintenant, on le fera au fil des modules. Les versions gratuites suffisent pour la journée. Et la règle d’or, que je répéterai : aucune donnée réelle de client, de collègue ou de contrat dans les ateliers. Les versions grand public de ces outils peuvent conserver vos échanges. Nous travaillons sur des cas fictifs que je vous fournis. »

ANIMATION — Lancer le minuteur. Passer dans les rangs. Si quelqu’un n’a pas d’accès, il travaille en binôme.

TRANSITION — « Tout le monde est prêt ? Module 1 : découvrir l’IA et ses opportunités. »`,
  `⏱ 1 min · MODULE 1 · 9:20

OBJECTIF — Annoncer le module : comprendre avant d’utiliser.

DIRE — « Avant d’ouvrir les outils, prenons vingt minutes pour comprendre ce qu’il y a sous le capot. Pas pour devenir ingénieur : pour savoir quand faire confiance à l’IA, et quand s’en méfier. Puis on cherchera ensemble où se cache votre temps perdu. »

TRANSITION — « Première question : qu’est-ce qui est nouveau avec l’IA générative ? »`,
  `⏱ 4 min · QU’EST-CE QUE L’IA GÉNÉRATIVE ? (2 clics)

OBJECTIF — Distinguer l’IA qui classe de l’IA qui crée.

DIRE — « Vous utilisez de l’IA depuis longtemps : le filtre anti-spam, le GPS qui recalcule, les recommandations de films, la détection de fraude. Toutes ces IA répondent par oui ou non, une catégorie, un score. » Clic 1. « Depuis fin 2022, une autre famille s’est imposée : l’IA générative. Elle produit du contenu nouveau — texte, image, son, vidéo. » Clic 2. « Et surtout, on lui parle en français courant. Cette demande, c’est le prompt. »

ANIMATION — Demander : « Qui a déjà utilisé l’une de ces IA classiques aujourd’hui ? » Tout le monde, en général : le filtre anti-spam.

TRANSITION — « Mais comment fait-elle pour écrire ? »`,
  `⏱ 5 min · COMMENT FONCTIONNE UN ASSISTANT (3 clics)

OBJECTIF — Faire comprendre le principe de prédiction, source de ses forces et de ses limites.

DIRE — « Prenons une phrase en cours d’écriture. » Clic 1. « Le modèle calcule pour chaque mot possible une probabilité. “Demain” est le plus probable, “Paris” très peu. » Clic 2. « Il choisit, ajoute le mot, et recommence. Des milliers de fois. C’est tout. » Clic 3. « Trois conséquences. Il a énormément lu, donc il écrit bien. Il prédit, il ne vérifie pas : un texte fluide peut être faux. Et il ne sait de vous que ce que vous lui dites : c’est pour cela que le prompt est si important. »

INSISTER — Plausible n’est pas exact. C’est la phrase à retenir du module.

TRANSITION — « Alors, que peut-on lui demander ? »`,
  `⏱ 6 min · LES 9 VERBES (interactif)

OBJECTIF — Couvrir les usages du programme : rédiger, reformuler, résumer, traduire, rechercher, analyser, créer, organiser, automatiser.

DIRE — « Neuf verbes résument presque tout ce que l’IA fait pour vous au travail. » Cliquer Rédiger : « Exemple : une relance de facture. ChatGPT, Copilot ou Claude le font très bien. » Puis Résumer, Rechercher (« ici on veut des sources : Perplexity »), Créer (« on passe aux outils visuels : Canva, Firefly »), Automatiser (« ce sera le dernier module »).

ANIMATION — Laisser le groupe choisir 3 ou 4 verbes à explorer. Poser la question du bas : quel verbe occupe le plus votre semaine ? Noter les réponses, elles serviront à l’atelier.

TRANSITION — « Mais attention : l’IA a des limites. Jouons à les repérer. »`,
  `⏱ 6 min · LES LIMITES (hotspots)

OBJECTIF — Rendre concrètes les limites : hallucination, sources fictives, calcul, date de connaissance, excès de confiance.

DIRE — « Quelqu’un a demandé à un assistant de résumer le rapport annuel de son entreprise, sans le lui fournir. Voici la réponse. Elle a l’air parfaite. Trouvez les cinq erreurs. » Laisser chercher 1 minute, puis cliquer chaque numéro au fil des propositions du groupe. « Un : les chiffres sont inventés, l’IA n’a jamais vu le rapport. Deux : le cabinet n’existe pas. Trois : trois fois 1,2, c’est 3,6, pas 4,6. Quatre : “le modèle le plus récent”, l’IA ne le sait pas. Cinq : “c’est certain” — le ton assuré ne prouve rien. »

INSISTER — À droite, les six limites à retenir. La dernière est clé : c’est vous qui signez, pas l’IA.

TRANSITION — « Ces limites posées, voyons ce que vous pouvez gagner. »`,
  `⏱ 5 min · CALCULATEUR DE TEMPS (simulateur)

OBJECTIF — Rendre tangible le gain potentiel, avec des hypothèses explicites et discutables.

DIRE — « Prenons un volontaire. Combien d’emails écrivez-vous par jour ? Combien de réunions à résumer par semaine ? » Régler les curseurs avec lui. « Avec des hypothèses volontairement prudentes, on arrive à plusieurs heures par semaine. Regardez la ligne du bas : ce sont des estimations pédagogiques. Le vrai gain dépend de la tâche, et il faut toujours compter le temps de relecture. »

ANIMATION — Faire réagir : « Ces hypothèses vous paraissent-elles réalistes pour vous ? » C’est souvent sur les comptes rendus de réunion que le gain surprend le plus.

TRANSITION — « Toutes les tâches ne se valent pas. Jouons au tri. »`,
  `⏱ 6 min · LE JEU DU TRI (glisser-déposer, 1 clic)

OBJECTIF — Distinguer ce qu’on peut confier, ce qu’on partage avec validation, ce qu’on garde.

DIRE — « Neuf tâches. Trois colonnes. Vous me dites où les mettre, je les déplace. » Faire voter le groupe pour chaque tâche et glisser. Puis clic : « Voici notre proposition. Ce qui compte, ce n’est pas la colonne exacte, c’est le raisonnement : quel est le risque si l’IA se trompe ? Une faute dans un titre : aucun. Une erreur dans un contrat : grave, donc validation. Une annonce difficile : c’est une relation humaine. »

ANIMATION — Les désaccords sont précieux : « traduire une fiche produit » peut aller en colonne 1 ou 2 selon l’enjeu commercial. Double-clic pour remettre une étiquette à sa place initiale.

TRANSITION — « Et comment choisir l’outil ? Trois questions. »`,
  `⏱ 4 min · CHOISIR LE BON OUTIL (3 clics)

OBJECTIF — Donner une méthode de choix simple et sûre.

DIRE — Clic 1 : « Première question, toujours : mes données sont-elles sensibles ? Si oui, uniquement l’outil validé par votre entreprise. » Clic 2 : « Deuxième : où je travaille déjà ? Dans Microsoft 365, Copilot. Dans Google Workspace, Gemini. Sinon, ChatGPT ou Claude. » Clic 3 : « Troisième : de quoi ai-je besoin ? Des sources : Perplexity. Interroger mes documents : NotebookLM. Traduire : DeepL. Des slides : Gamma. Une réunion : Otter ou Fireflies. »

INSISTER — La règle du bas : un généraliste pour 80 % des besoins, un spécialiste pour ce qui revient souvent.

TRANSITION — « À vous : atelier 1. »`,
  `⏱ 12 min · ATELIER 1 · MES 5 TÂCHES (minuteur)

OBJECTIF — Chaque participant identifie 5 tâches de son quotidien où l’IA peut lui faire gagner du temps.

DIRE — « Douze minutes. Cinq minutes seul : listez ce qui vous a pris du temps cette semaine. Puis utilisez votre assistant avec le prompt d’aide de la page suivante pour compléter. Gardez cinq tâches fréquentes et peu risquées. Enfin, en binôme, challengez-vous. »

ANIMATION — Afficher la page suivante pendant l’atelier. Lancer le minuteur. Passer dans les rangs : vérifier qu’aucune tâche de la colonne « je garde la main » ne s’est glissée. Cocher les critères avec un volontaire à la fin.

TRANSITION — « Gardez précieusement cette fiche : elle revient dans l’atelier final. »`,
  `⏱ (support de l’atelier 1) · EXEMPLE ET PROMPT D’AIDE

OBJECTIF — Donner un modèle rempli et un prompt prêt à l’emploi.

DIRE — « Voici la fiche de Léa, assistante commerciale. Cinq tâches, avec la fréquence, le temps, le verbe, l’outil et le gain estimé. Ses devis avec Copilot, la réunion d’équipe avec Fireflies, les traductions avec DeepL, la présentation mensuelle avec Gamma, la veille avec Perplexity. Et en bas, le prompt d’aide : remplacez les trous jaunes, collez-le dans votre assistant, il vous propose quinze tâches typiques de votre poste. »

INSISTER — Le prompt demande aussi « le risque si l’IA se trompe » : on prend déjà l’habitude de penser au contrôle.

TRANSITION — « Petit quiz pour clore le module. »`,
  `⏱ 4 min · QUIZ MODULE 1

OBJECTIF — Vérifier les acquis : principe de prédiction, hallucination, tâches à garder humaines, choix de l’outil, bonne tâche à confier.

DIRE — « Cinq questions. Votez à main levée, puis je clique. »

ANIMATION — Utiliser les numéros à droite pour naviguer. Sur chaque erreur, faire expliquer par un participant pourquoi la réponse est piégée.

TRANSITION — « Pause de quinze minutes. Ensuite : comment parler à l’IA pour obtenir ce que l’on veut. »`,
  `⏱ 1 min · MODULE 2 · 10:30

OBJECTIF — Annoncer le module le plus transversal de la journée.

DIRE — « Ce module est le plus important de la journée. Tous les outils que vous verrez cet après-midi — ChatGPT, Gamma, Canva, Firefly, Notion — fonctionnent avec un prompt. Si vous savez formuler une demande, vous savez utiliser les vingt outils. »

TRANSITION — « Commençons par la définition. »`,
  `⏱ 4 min · QU’EST-CE QU’UN PROMPT ? (3 clics)

OBJECTIF — Installer la métaphore du brief au stagiaire.

DIRE — « Un prompt, c’est la demande que vous écrivez à l’IA. Le meilleur modèle mental : imaginez un nouveau stagiaire. » Clic 1 : « Il est brillant et très rapide. » Clic 2 : « Mais il ne connaît rien de vous : ni votre entreprise, ni votre client, ni l’historique. » Clic 3 : « Et il fait exactement ce que vous dites. Si vous lui dites “rédige un compte rendu”, il va deviner tout le reste. Ce que vous ne dites pas, l’IA l’invente. »

ANIMATION — Demander : « Si vous briefiez un vrai stagiaire pour ce compte rendu, que lui diriez-vous ? » Les réponses du groupe sont exactement les briques qu’on verra dans deux pages.

TRANSITION — « Voyons concrètement pourquoi une demande échoue. »`,
  `⏱ 4 min · POURQUOI ÇA RATE (5 clics)

OBJECTIF — Diagnostiquer les cinq causes classiques d’une mauvaise réponse.

DIRE — « Voici une demande que nous avons tous faite : “Fais-moi un mail pour la réunion.” La réponse est correcte… et inutilisable. Pourquoi ? » Cliquer chaque cause : trop vague, pas de contexte, pas de destinataire, pas de format, tout à la fois.

INSISTER — Quand le résultat est mauvais, le premier réflexe n’est pas de changer d’outil mais de relire sa demande.

TRANSITION — « La solution : cinq briques. »`,
  `⏱ 6 min · LES 5 BRIQUES (simulateur)

OBJECTIF — Faire découvrir contexte, objectif, rôle, contraintes, format, et leur effet cumulatif.

DIRE — « Demande de départ : “Écris une annonce pour le séminaire.” Activons les briques une par une. » Activer Rôle : « L’IA adopte le bon point de vue. » Contexte : « Elle n’invente plus la date ni le lieu. » Objectif : « Elle sait ce que le message doit produire. » Contraintes : « Ton, longueur, info obligatoire. » Format : « Je reçois exactement ce que je peux utiliser. Cinq sur cinq. »

ANIMATION — Faire choisir au groupe l’ordre d’activation. Montrer que le contexte et l’objectif ont le plus d’impact. Il n’y a pas d’ordre imposé dans le prompt final.

INSISTER — Pas besoin des cinq briques pour une question simple. Pour un livrable, oui.

TRANSITION — « Une sixième astuce : les exemples. »`,
  `⏱ 4 min · DONNER DES EXEMPLES (2 clics)

OBJECTIF — Montrer la puissance des exemples pour imposer un format ou un style.

DIRE — « Je veux que l’IA trie des emails clients exactement comme moi. Au lieu d’expliquer ma logique, je lui montre deux exemples déjà triés. » Clic 1 : « Elle reproduit le format et la logique : réclamation, priorité haute. » Clic 2 : « Même principe pour votre style d’écriture : collez deux de vos emails. Ou pour un tableau : montrez une ligne remplie. »

ATTENTION — Les exemples doivent être anonymisés : pas de vrais emails clients dans un outil non validé.

TRANSITION — « Et si la réponse ne convient pas ? On dialogue. »`,
  `⏱ 5 min · DIALOGUER (démo, onglets)

OBJECTIF — Couvrir : faire préciser sa demande, demander une reformulation ou amélioration.

DIRE — Onglet 1 : « Le réflexe le plus sous-estimé : demander à l’IA de vous poser des questions avant d’écrire. Elle identifie elle-même ce qui lui manque. » Onglet 2 : « Si la réponse est presque bonne, ne recommencez pas : précisez. Plus court, trois versions, relis comme un client exigeant. » Onglet 3 : « Et vous pouvez même faire améliorer votre prompt par l’IA. »

ANIMATION — Si le temps le permet, faire la démo en direct dans l’assistant de la salle avec le discours de départ en retraite.

TRANSITION — « Dernière étape, non négociable : vérifier. »`,
  `⏱ 4 min · VÉRIFIER ET CORRIGER (checklist)

OBJECTIF — Installer une routine de relecture en trois temps.

DIRE — « Trois relectures. Les faits : chiffres, dates, noms. Le fond : la réponse traite-t-elle vraiment ma demande, promet-elle quelque chose d’engageant ? La forme : le ton, et ces formules creuses typiques de l’IA — “n’hésitez pas”, “dans un monde en constante évolution”. Cochez ce que vous faites déjà. »

ANIMATION — Faire cocher un volontaire. Commenter le score.

INSISTER — Pour corriger, ne réécrivez pas tout à la main : dites à l’IA ce qui est faux.

TRANSITION — « Voici votre boîte de formules utiles. »`,
  `⏱ 3 min · HUIT FORMULES (synthèse)

OBJECTIF — Donner un mémo réutilisable immédiatement.

DIRE — « Huit formules à ajouter à n’importe quel prompt. Faire préciser, obtenir plusieurs versions, simplifier, faire critiquer, limiter les inventions, structurer en tableau, résumer, citer ses sources. » Puis l’astuce : « Créez dès aujourd’hui un document “Mes prompts”. Chaque prompt qui marche y entre. C’est ce qui fait gagner du temps sur la durée. »

TRANSITION — « À vous : atelier 2. »`,
  `⏱ 15 min · ATELIER 2 · PROMPT STRUCTURÉ (minuteur)

OBJECTIF — Transformer « Rédige un email à mon client » en prompt structuré produisant un email professionnel adapté.

DIRE — « Quinze minutes en binôme. D’abord, testez le prompt brut : “Rédige un email à mon client.” Regardez le résultat. Puis choisissez une situation — retard de livraison, relance de devis, erreur de facture, ou une vraie situation de votre métier, anonymisée. Écrivez le prompt avec les cinq briques et comparez. »

ANIMATION — Lancer le minuteur. Passer dans les rangs et vérifier que les situations sont fictives ou anonymisées. Faire lire deux prompts à voix haute à la fin.

TRANSITION — « Voici un corrigé possible. »`,
  `⏱ 4 min · CORRIGÉ ATELIER 2 (2 clics)

OBJECTIF — Montrer un exemple de prompt structuré et son résultat, et le contrôle qui reste nécessaire.

DIRE — « Voici un prompt structuré pour un retard de livraison : rôle, contexte précis, objectif avec deux solutions, contraintes dont “ne pas accuser le transporteur”, et le format. » Clic 1 : « Voici l’email obtenu, ici avec Claude. Il est précis, empathique, les deux solutions y sont. » Clic 2 : « Ce qui a changé : 30 secondes de relecture au lieu de 10 minutes d’écriture. Mais regardez : l’IA a ajouté un nom de cliente et la promesse d’appeler demain. À vérifier ! »

INSISTER — Même avec un excellent prompt, l’IA ajoute parfois des détails : la relecture reste indispensable.

TRANSITION — « Quiz du module 2. »`,
  `⏱ 4 min · QUIZ MODULE 2

OBJECTIF — Vérifier les acquis : briques, causes d’échec, exemples, itération, limiter les inventions.

DIRE — « Cinq questions. Votez à main levée. »

ANIMATION — Sur chaque question, faire justifier la bonne réponse par un participant.

TRANSITION — « On passe maintenant aux outils : les cinq grands assistants IA. »`,
  `⏱ 1 min · MODULE 3 · 11:20

OBJECTIF — Annoncer les cinq assistants généralistes (outils n° 1 à 5 du programme).

DIRE — « Place aux outils. On commence par les cinq assistants généralistes : ChatGPT, Microsoft Copilot, Google Gemini, Claude et Perplexity. Ils savent tous rédiger et résumer ; la vraie question, c’est lequel utiliser, quand. Et vous le découvrirez en les comparant vous-mêmes. »

TRANSITION — « D’abord, la carte d’identité de chacun. »`,
  `⏱ 3 min · PANORAMA

OBJECTIF — Donner une carte mentale des cinq assistants.

DIRE — « ChatGPT, le polyvalent. Copilot, l’assistant qui vit dans vos outils Microsoft. Gemini, son équivalent chez Google, très fort en recherche approfondie. Claude, excellent sur les longs documents et l’écriture. Perplexity, le spécialiste des réponses sourcées. Tous ont une version gratuite. »

INSISTER — Le meilleur assistant est souvent celui qui est déjà dans votre environnement de travail et validé par votre entreprise.

TRANSITION — « Regardons-les un par un, avec un exemple concret à chaque fois. »`,
  `⏱ 4 min · OUTIL 1 · CHATGPT (2 clics)

OBJECTIF — Rédaction, brainstorming, synthèse, analyse et assistance quotidienne.

DIRE — « ChatGPT, d’OpenAI, est le plus connu. Ses forces : rédiger, brainstormer, analyser des fichiers, et se personnaliser avec les Projets ou les GPT. Exemple : je lance une newsletter interne. » Clic 1 : « En quelques secondes, huit rubriques avec le temps de préparation. Ce n’est pas un texte final, c’est un accélérateur de réflexion. » Clic 2 : « Vigilance : en version gratuite, vos échanges peuvent servir à entraîner les modèles. Ça se désactive dans les paramètres, mais rien de confidentiel sans offre entreprise. »

ANIMATION — Démo en direct possible avec une idée du groupe.

TRANSITION — « Si vous êtes dans l’univers Microsoft, voici votre assistant. »`,
  `⏱ 4 min · OUTIL 2 · MICROSOFT COPILOT (2 clics)

OBJECTIF — L’assistance dans l’environnement Microsoft.

DIRE — « Copilot est intégré à Outlook, Word, Excel, PowerPoint et Teams. Sa force : il travaille là où sont déjà vos emails, vos fichiers et vos réunions. Exemple dans Teams, après une réunion. » Clic 1 : « Décisions, actions avec responsables, points en suspens. Le compte rendu qui prenait vingt minutes. » Clic 2 : « Deux points de vigilance : Copilot voit tout ce à quoi vous avez accès, donc un dossier partagé trop largement devient visible. Et l’intégration dans les applications demande une licence payante ; Copilot Chat, lui, est accessible avec votre compte professionnel. »

TRANSITION — « Même logique chez Google. »`,
  `⏱ 4 min · OUTIL 3 · GOOGLE GEMINI (2 clics)

OBJECTIF — Recherche, rédaction et assistance.

DIRE — « Gemini est l’assistant de Google : intégré à Gmail, Docs et Drive, très fort en recherche approfondie avec Deep Research, et capable de lire des PDF, des images ou des vidéos. Exemple : je retrouve où en est un dossier fournisseur. » Clic 1 : « Il a lu six emails et sort ce qui reste à régler. » Clic 2 : « Vigilance : compte personnel ou professionnel, ce n’est pas la même protection des données. »

ASTUCE — Le symbole @ pour cibler Gmail ou Drive.

TRANSITION — « Pour les longs documents et l’écriture : Claude. »`,
  `⏱ 4 min · OUTIL 4 · CLAUDE (2 clics)

OBJECTIF — Rédaction et analyse de contenus et documents.

DIRE — « Claude, d’Anthropic, est réputé pour deux choses : l’analyse de longs documents et la qualité de son écriture. Exemple : un appel d’offres de soixante pages. » Clic 1 : « Exigences éliminatoires, dates clés, points flous, avec la page. Le travail d’une demi-journée de lecture préparé en une minute. » Clic 2 : « Mais on vérifie chaque point à la page citée. Et pas de document client confidentiel dans un outil non validé. »

TRANSITION — « Dernier assistant, et premier outil de recherche : Perplexity. »`,
  `⏱ 4 min · OUTIL 5 · PERPLEXITY (2 clics)

OBJECTIF — Recherche d’informations et synthèse avec sources.

DIRE — « Perplexity ne répond pas de mémoire : il cherche sur le web en temps réel et cite ses sources, numérotées. Exemple : la facturation électronique. » Clic 1 : « Une réponse claire, et trois sources. Regardez-les : deux sites officiels, et un blog d’éditeur de logiciel — qui a quelque chose à vendre. » Clic 2 : « Une source citée n’est pas une source fiable. On l’ouvre, on vérifie qu’elle dit bien ce qui est affirmé, et qu’elle est à jour. »

INSISTER — On reverra Perplexity au module 4, sous l’angle de la recherche.

TRANSITION — « Maintenant, testez-les vous-mêmes. »`,
  `⏱ 20 min · ATELIER 3 · BANC D’ESSAI (minuteur)

OBJECTIF — Réaliser une même tâche avec plusieurs assistants et comparer.

DIRE — « Le cas : votre directrice veut un point rapide sur la semaine de quatre jours. Chaque binôme prend deux assistants, si possible dont Perplexity, et enchaîne les quatre mêmes prompts : rechercher, analyser, synthétiser, produire l’email. Puis vous notez avec la grille. »

ANIMATION — Répartir les outils pour couvrir les cinq assistants dans la salle. Afficher la page des prompts pendant l’atelier. Lancer le minuteur. Restitution : une minute par binôme, en commençant par « pour telle étape, on préfère tel outil parce que… ».

TRANSITION — « Les prompts à copier. »`,
  `⏱ (support de l’atelier 3) · LES 4 PROMPTS

OBJECTIF — Fournir des prompts identiques pour une comparaison équitable.

DIRE — « Quatre prompts, à enchaîner dans la même conversation pour que l’outil garde le fil. Étape 1, rechercher, avec sources datées. Étape 2, analyser en tableau. Étape 3, synthétiser en cinq points pour quelqu’un qui a deux minutes, en signalant les incertitudes. Étape 4, produire l’email avec une recommandation prudente. Les petites icônes indiquent les outils les plus adaptés à chaque étape, mais testez vos deux outils sur toutes les étapes. »

TRANSITION — « Et la grille pour noter. »`,
  `⏱ (pendant / après l’atelier 3) · GRILLE DE COMPARAISON (interactive)

OBJECTIF — Objectiver la comparaison avec des critères.

DIRE — « Cinq critères : la pertinence, la qualité des sources, la rédaction, la rapidité, la facilité. De zéro à trois étoiles. Je remplis avec vos retours. »

ANIMATION — Pendant la restitution, cliquer les cases selon les retours des binômes. Insister sur le message du bas : la bonne conclusion n’est pas un classement, c’est une répartition par étape.

TRANSITION — « Testons vos réflexes. »`,
  `⏱ 5 min · QUEL ASSISTANT POUR QUELLE SITUATION ? (cartes)

OBJECTIF — Ancrer le choix de l’outil selon la situation.

DIRE — « Six situations. Pour chacune, votez, puis je retourne la carte. » Retourner une à une. « Notez que plusieurs réponses sont souvent défendables : pour le brainstorming, tous se valent ; pour l’appel d’offres, Gemini marche aussi. Ce qui compte, c’est l’argument. »

TRANSITION — « Quiz du module 3, puis déjeuner. »`,
  `⏱ 4 min · QUIZ MODULE 3

OBJECTIF — Vérifier : sources, droits d’accès de Copilot, longs documents, données en compte personnel, choix par étape.

DIRE — « Cinq questions avant le déjeuner. »

TRANSITION — « Bon appétit ! On se retrouve à 13 h 30 pour rechercher et exploiter l’information. »`,
  `⏱ 1 min · MODULE 4 · 13:30

OBJECTIF — Lancer l’après-midi sur la recherche d’information (outils n° 6 à 9).

DIRE — « Bon retour ! Cet après-midi, on produit. Et on commence par l’information : la trouver vite, et surtout la vérifier. Quatre outils : Perplexity, NotebookLM, Elicit et Consensus. Et une règle qui va nous suivre tout le module : une réponse IA n’est pas une information vérifiée. »

TRANSITION — « Première question à se poser : d’où vient la réponse ? »`,
  `⏱ 3 min · D’OÙ VIENT LA RÉPONSE ? (1 clic)

OBJECTIF — Distinguer les réservoirs d’information : web, vos documents, publications scientifiques.

DIRE — « Perplexity cherche sur le web, en temps réel : parfait pour l’actualité et la réglementation. NotebookLM ne cherche que dans vos documents : parfait pour vos procédures. Elicit et Consensus cherchent dans les publications scientifiques : l’un pour creuser en profondeur, l’autre pour une réponse rapide à une question fermée. » Clic : « Et le piège : un assistant sans accès au web répond de mémoire. »

TRANSITION — « Perplexity, cette fois côté recherche. »`,
  `⏱ 4 min · OUTIL 6 · PERPLEXITY RECHERCHE (2 clics)

OBJECTIF — La recherche assistée par IA : recherche approfondie, espaces, choix des sources.

DIRE — « Ce matin, on a vu Perplexity comme assistant. Sa vraie force est la recherche approfondie : il lance des dizaines de recherches et livre un rapport structuré. Exemple : le télétravail en France. » Clic 1 : « Un rapport de quatre pages, plusieurs dizaines de sources, en quelques minutes. Remarquez le point 5 : il signale lui-même les limites. » Clic 2 : « Vigilance : vérifiez au moins les trois sources qui portent les chiffres clés. »

ASTUCE — Demander où les sources se contredisent.

TRANSITION — « Et quand l’information est dans vos propres documents ? »`,
  `⏱ 5 min · OUTIL 7 · NOTEBOOKLM (2 clics)

OBJECTIF — Analyse et interrogation de ses propres documents.

DIRE — « NotebookLM, de Google, fonctionne à l’envers des autres : il ne répond qu’à partir des documents que vous chargez. Résultat : beaucoup moins d’inventions, et chaque phrase renvoie au passage exact. Exemple : trois documents RH fictifs. » Clic 1 : « La réponse est nuancée, sourcée, et il dit aussi ce que les documents ne traitent pas. » Clic 2 : « Vigilance : si vos documents sont obsolètes, la réponse l’est aussi. Et les documents internes uniquement avec un compte professionnel autorisé. »

ANIMATION — Si possible, démo du résumé audio : c’est souvent le « effet waouh » de la journée.

TRANSITION — « Pour aller dans la recherche scientifique : Elicit. »`,
  `⏱ 3 min · OUTIL 8 · ELICIT (2 clics)

OBJECTIF — Recherche et synthèse de publications et informations spécialisées.

DIRE — « Elicit est un assistant de recherche scientifique. On pose une question, il trouve les articles pertinents et, surtout, il extrait les informations dans un tableau : population, méthode, résultat. Ce qui prenait des jours de lecture prend une heure. » Clic 1 : « Ici un exemple illustratif, avec des études fictives. » Clic 2 : « Vigilance : corpus surtout anglophone, et une étude n’est pas une vérité. »

ADAPTER — Pour un public non chercheur, présenter Elicit comme l’outil des études de marché, des dossiers RH ou santé au travail où l’on veut s’appuyer sur des preuves.

TRANSITION — « Et pour une réponse rapide fondée sur la science : Consensus. »`,
  `⏱ 3 min · OUTIL 9 · CONSENSUS (2 clics)

OBJECTIF — Recherche d’informations issues de travaux scientifiques.

DIRE — « Consensus répond à une question à partir de publications scientifiques. Son outil phare : le Consensus Meter, qui montre combien d’études disent oui, non, peut-être. » Clic 1 : « Ici, la majorité dit oui — répartition illustrative. » Clic 2 : « Mais attention : le compteur additionne les études sans peser leur qualité. Une méta-analyse vaut plus que dix petites études. »

TRANSITION — « Vous avez des outils qui citent leurs sources. Reste à vérifier. Méthode. »`,
  `⏱ 4 min · QUATRE QUESTIONS (5 clics)

OBJECTIF — Donner une méthode simple de vérification.

DIRE — Clic par clic : « Qui parle ? Quand ? La source dit-elle vraiment ça ? Est-ce recoupé ? Trente secondes par affirmation importante. » Clic 5 : « Et la règle : une réponse IA, même sourcée, est une piste. Elle devient une information quand vous l’avez vérifiée. »

INSISTER — C’est l’objectif explicite du module : ne pas considérer automatiquement une réponse IA comme une information vérifiée.

TRANSITION — « Entraînons-nous. »`,
  `⏱ 5 min · FIABLE OU PAS ? (cartes)

OBJECTIF — Exercer le jugement sur le type de source.

DIRE — « Perplexity vous cite ces six sources. Pour chacune : fiable, à recouper, ou insuffisant seul ? Votez, je retourne. »

ANIMATION — Les cartes « presse 2019 » et « communiqué » provoquent souvent des débats : c’est l’objectif. Rappeler la question « Quand ? ».

TRANSITION — « À vous : le cas pratique. »`,
  `⏱ 20 min · CAS PRATIQUE · NOTE PROFESSIONNELLE (minuteur)

OBJECTIF — Recherche → vérification → synthèse → production d’une note professionnelle.

DIRE — « Le sujet : votre DRH se demande s’il faut proposer le forfait mobilités durables. Étape 1 : recherchez avec Perplexity. Étape 2 : vérifiez avec la fiche de vérification, ouvrez au moins trois sources. Étape 3 : chargez uniquement les sources vérifiées dans NotebookLM et interrogez-les. Étape 4 : rédigez la note d’une page avec le modèle. »

ANIMATION — Lancer le minuteur. Le point clé à observer : est-ce que les binômes écartent des sources ? Valoriser publiquement un binôme qui a écarté une affirmation non confirmée.

TRANSITION — « La fiche de vérification. »`,
  `⏱ (support du cas pratique) · FICHE DE VÉRIFICATION (interactive)

OBJECTIF — Donner un outil de traçabilité.

DIRE — « Une ligne par affirmation clé. Le type de source, et le statut : à vérifier, confirmé, incertain, écarté. Seules les affirmations confirmées entrent dans la note. »

ANIMATION — Remplir en direct avec un binôme pendant la restitution : cliquer type et statut selon ce qu’il annonce.

TRANSITION — « Et le modèle de note. »`,
  `⏱ (support du cas pratique) · MODÈLE DE NOTE

OBJECTIF — Fournir une structure de note et un prompt de rédaction.

DIRE — « Cinq parties : objet, l’essentiel en trois points, éléments clés sourcés, recommandation, sources et limites. Le prompt à droite impose deux choses : n’utiliser que les sources fournies, et écrire “non trouvé dans les sources” plutôt qu’inventer. Et le dernier contrôle : relire chaque chiffre face à la fiche. »

TRANSITION — « Quiz du module 4. »`,
  `⏱ 4 min · QUIZ MODULE 4

OBJECTIF — Vérifier : choix de l’outil selon la source, vérification, Consensus Meter, fiabilité des sources, lecture des études.

DIRE — « Cinq questions. »

TRANSITION — « On a trouvé l’information. Maintenant, rédigeons plus vite et mieux. »`,
  `⏱ 1 min · MODULE 5 · 14:15

OBJECTIF — Annoncer les outils n° 10 à 13 : rédaction, traduction, présentations, visuels.

DIRE — « On a trouvé et vérifié l’information. Maintenant, on la met en forme. Quatre outils spécialisés : Grammarly pour corriger, DeepL pour traduire et reformuler, Canva pour illustrer, Gamma pour présenter. »

TRANSITION — « Voyons comment ils s’enchaînent. »`,
  `⏱ 2 min · LA CHAÎNE RÉDACTIONNELLE (5 clics)

OBJECTIF — Positionner chaque outil sur une étape.

DIRE — Clic par clic : « Écrire le premier jet avec votre assistant. Corriger avec Grammarly. Traduire avec DeepL. Présenter avec Gamma. Illustrer avec Canva. » Puis : « Un généraliste fait tout correctement ; un spécialiste fait sa tâche très bien. »

TRANSITION — « Premier spécialiste : Grammarly. »`,
  `⏱ 3 min · OUTIL 10 · GRAMMARLY (2 clics)

OBJECTIF — Correction et amélioration des textes.

DIRE — « Grammarly corrige pendant que vous écrivez, partout : navigateur, Outlook, Word. Il détecte aussi votre ton. Exemple : un email en anglais un peu bancal. » Clic 1 : « Trois corrections, et le ton passe d’hésitant à confiant. » Clic 2 : « Vigilance importante : Grammarly est pensé d’abord pour l’anglais. Pour vos textes en français, DeepL Write ou le correcteur de votre suite sont plus adaptés. »

TRANSITION — « Justement : DeepL. »`,
  `⏱ 4 min · OUTIL 11 · DEEPL / DEEPL WRITE (2 clics)

OBJECTIF — Traduction, reformulation et amélioration rédactionnelle.

DIRE — « DeepL, entreprise européenne, est réputé pour la qualité de ses traductions. Deux fonctions clés : traduire des documents entiers en gardant la mise en page, et DeepL Write pour reformuler. Exemple : une phrase typique de mail administratif. » Clic 1 : « 36 mots deviennent 20, plus clairs, plus professionnels. » Clic 2 : « Vigilance : en gratuit, vos textes peuvent être conservés. La version Pro garantit leur suppression. »

ASTUCE — Le glossaire pour les termes métier.

TRANSITION — « Passons au visuel : Canva. »`,
  `⏱ 4 min · OUTIL 12 · CANVA AI (2 clics)

OBJECTIF — Création de contenus et supports visuels.

DIRE — « Canva, beaucoup le connaissent déjà. Ce qui change avec l’IA : vous décrivez votre support, il propose des mises en page ; il écrit les textes, génère des images, et décline un visuel dans tous les formats. Exemple : une affiche de portes ouvertes. » Clic 1 : « Trois propositions en quelques secondes. » Clic 2 : « Vigilance : droits d’usage des images générées selon votre offre, et personnalisez — un modèle brut se reconnaît. »

ASTUCE — Le kit de marque pour appliquer la charte.

TRANSITION — « Et les présentations : Gamma. »`,
  `⏱ 4 min · OUTIL 13 · GAMMA (2 clics)

OBJECTIF — Création rapide de présentations.

DIRE — « Gamma génère une présentation complète à partir d’un sujet, de notes ou d’un fichier. Exemple : le bilan d’un projet pour le comité de direction. » Clic 1 : « Huit slides structurés, une idée par slide. » Clic 2 : « Vigilance : si vos notes sont maigres, Gamma invente du contenu. L’astuce : choisissez de conserver votre texte plutôt que de le générer. Et l’export PowerPoint peut demander des retouches. »

ANIMATION — Démo en direct très parlante : coller la note du cas pratique M4 et générer.

TRANSITION — « Avant l’atelier, trois exemples de reformulation. »`,
  `⏱ 3 min · AVANT / APRÈS (cartes)

OBJECTIF — Montrer trois intentions de reformulation : simplifier, raccourcir, adoucir.

DIRE — « Même information, trois intentions. » Retourner chaque carte. « Simplifier : le jargon devient une phrase que tout le monde comprend. Raccourcir : une relance de 45 mots devient 15. Adoucir : un message agacé devient un message clair et respectueux, avec en prime les pièces précises demandées. »

INSISTER — Pour adoucir, c’est l’IA qui aide à prendre du recul : utile quand on écrit sous le coup de l’agacement.

TRANSITION — « À vous : l’atelier en cinq tâches. »`,
  `⏱ 25 min · ATELIER 5 · CIRCUIT RÉDACTIONNEL (minuteur)

OBJECTIF — Notes → email, reformuler, traduire et améliorer, contenu → présentation, brief → visuel.

DIRE — « Vingt-cinq minutes, en binôme. Au moins trois tâches sur cinq, avec trois outils différents. Notez le temps passé, et comparez avec votre façon habituelle de faire. Les matériaux sont sur la page suivante. »

ANIMATION — Laisser la page des matériaux affichée. Faire circuler : les tâches 4 et 5 demandent un compte Gamma et Canva. Restitution : chaque binôme annonce son meilleur gain de temps et une limite rencontrée.

TRANSITION — « Les matériaux. »`,
  `⏱ (support de l’atelier 5) · MATÉRIAUX (onglets)

OBJECTIF — Fournir un matériau fictif et un prompt de départ par tâche.

DIRE — Cliquer chaque onglet : « Tâche 1 : des notes brutes de rendez-vous client. Tâche 2 : un paragraphe jargonneux. Tâche 3 : une fiche produit Word à traduire. Tâche 4 : la note du module 4 à transformer en slides. Tâche 5 : un brief pour un Café IA. »

INSISTER — Dans chaque prompt, une contrainte anti-invention : « N’invente aucune information », « Conserve mes chiffres ».

TRANSITION — « Quiz du module 5. »`,
  `⏱ 4 min · QUIZ MODULE 5

OBJECTIF — Vérifier : traduction de documents, usage de Grammarly, contenus inventés par Gamma, redimensionnement Canva, données en version gratuite.

DIRE — « Cinq questions, puis pause. »

TRANSITION — « Ensuite : les réunions, ou comment ne plus jamais rédiger un compte rendu à la main. »`,
  `⏱ 1 min · MODULE 6 · 15:05

OBJECTIF — Annoncer les outils n° 14 à 16 : réunions et organisation.

DIRE — « Qui a eu au moins trois réunions cette semaine ? » Laisser lever les mains. « Ce module est pour vous. Trois outils : Otter et Fireflies pour transcrire et faire le compte rendu, Notion AI pour organiser et retrouver. Et des règles, parce qu’enregistrer des personnes n’est jamais anodin. »

TRANSITION — « D’abord, où passe le temps. »`,
  `⏱ 3 min · LE TEMPS CACHÉ (3 clics)

OBJECTIF — Rendre visible le travail administratif qui suit une réunion.

DIRE — Clic 1 : « Sans IA : prendre des notes, rédiger le compte rendu, lister les tâches, écrire l’email. Environ soixante-dix minutes pour une heure de réunion. » Clic 2 : « Avec IA : il reste surtout de la relecture. » Clic 3 : « De soixante-dix à dix minutes. Et le bénéfice le plus sous-estimé : vous écoutez vraiment pendant la réunion. »

INSISTER — Ordres de grandeur illustratifs : à faire réagir le groupe.

TRANSITION — « Premier outil : Otter. »`,
  `⏱ 3 min · OUTIL 14 · OTTER.AI (2 clics)

OBJECTIF — Transcription et synthèse de réunions.

DIRE — « Otter transcrit en temps réel, reconnaît les intervenants, peut rejoindre seul vos visios, et produit un résumé. Sa fonction la plus pratique : interroger la réunion. » Clic 1 : « Qu’a dit Julie sur le budget ? Réponse, avec l’horodatage pour réécouter. » Clic 2 : « Vigilance : Otter est historiquement très orienté anglais ; vérifiez le français pour vos usages. Et on informe toujours les participants. »

TRANSITION — « Fireflies va plus loin sur les actions. »`,
  `⏱ 3 min · OUTIL 15 · FIREFLIES.AI (2 clics)

OBJECTIF — Compte rendu et extraction des actions.

DIRE — « Fireflies rejoint vos réunions, transcrit dans de nombreuses langues dont le français, et surtout extrait les actions : qui fait quoi, pour quand. » Clic 1 : « Un résumé et trois actions, sans que personne n’ait pris de notes. » Clic 2 : « Vigilance : le robot est visible dans la réunion, il doit être annoncé. Et jamais d’entretiens RH ou de sujets confidentiels. »

ASTUCE — L’envoi automatique vers Notion ou par email.

TRANSITION — « Ces comptes rendus, il faut les ranger et les retrouver : Notion AI. »`,
  `⏱ 3 min · OUTIL 16 · NOTION AI (2 clics)

OBJECTIF — Organisation, rédaction et gestion des connaissances.

DIRE — « Notion est un espace de travail : pages, bases de données, projets. Notion AI y ajoute la rédaction, les notes de réunion, et surtout la recherche : on pose une question sur tout l’espace. » Clic 1 : « Décisions et retards du projet Horizon, avec les pages sources. » Clic 2 : « Vigilance : il ne sait que ce qui est dans vos pages ; un espace mal tenu donne des réponses incomplètes. »

TRANSITION — « Avant de pratiquer : les règles de l’enregistrement. »`,
  `⏱ 4 min · LES RÈGLES (cartes)

OBJECTIF — Poser le cadre légal et éthique de l’enregistrement.

DIRE — « Une voix est une donnée personnelle. Quatre situations : votez, je retourne. » Puis : « Les quatre règles en bas : informer, recueillir l’accord, outil autorisé, supprimer dès que possible. »

ADAPTER — Rappeler que la politique de votre entreprise prime : certaines interdisent tout enregistrement par un outil externe.

TRANSITION — « Voyons la chaîne complète en démonstration. »`,
  `⏱ 3 min · LA CHAÎNE APRÈS-RÉUNION (démo, 6 clics)

OBJECTIF — Visualiser la chaîne réunion → transcription → synthèse → décisions → tâches → email.

DIRE — Clic par clic : « La réunion, avec le robot annoncé. La transcription. La synthèse. Les décisions. Les tâches dans la base projet Notion. L’email de suivi. » Puis le point de contrôle : « Entre décisions et email, un humain relit. Une décision mal comprise, envoyée à dix personnes, devient une vraie décision. »

TRANSITION — « À vous de jouer. »`,
  `⏱ 20 min · CAS PRATIQUE · APRÈS-RÉUNION (minuteur)

OBJECTIF — De la réunion à l’email de suivi, en réduisant le temps administratif.

DIRE — « Deux options. Option A, la plus amusante : en groupe de quatre, jouez trois minutes du comité projet avec Fireflies ou Otter qui transcrit. Option B : utilisez la transcription fournie. Ensuite, synthèse et décisions, tâches dans une base Notion, email de suivi. »

ANIMATION — L’option A fonctionne très bien et crée de l’énergie en fin d’après-midi : encourager au moins un groupe à la tenter. Lancer le minuteur.

TRANSITION — « La transcription et le prompt. »`,
  `⏱ (support du cas pratique) · LA TRANSCRIPTION

OBJECTIF — Fournir le matériau et un prompt de traitement.

DIRE — « Un extrait de comité projet, fictif. Le prompt à droite demande cinq livrables d’un coup, avec une règle : n’inventer aucune date ni aucun responsable. »

INSISTER — La consigne « écris à définir » évite que l’IA comble les trous.

TRANSITION — « Comparons avec un corrigé. »`,
  `⏱ 4 min · CORRIGÉ (3 clics)

OBJECTIF — Montrer un résultat attendu et le contrôle humain nécessaire.

DIRE — Clic 1 : « La synthèse et la décision, avec l’option écartée. » Clic 2 : « Les quatre tâches. » Clic 3 : « L’email de suivi. Mais regardez : l’échéance d’Inès n’a jamais été dite. Elle est déduite de “un mois avant”. Un humain doit la confirmer. »

ANIMATION — Demander aux groupes : avez-vous trouvé les quatre tâches ? Le parking en suspens ?

TRANSITION — « Quiz du module 6, puis pause. »`,
  `⏱ 4 min · QUIZ MODULE 6

OBJECTIF — Vérifier : consentement, extraction des actions, recherche Notion, réunions sensibles, information déduite.

DIRE — « Cinq questions. »

TRANSITION — « Pause de quinze minutes. Ensuite, on passe au visuel : images et vidéos. »`,
  `⏱ 1 min · MODULE 7 · 16:00

OBJECTIF — Annoncer les outils n° 17 à 20 : images et vidéos.

DIRE — « Après la pause, on passe au visuel. Quatre outils : Adobe Firefly pour les images, Canva pour la création graphique, Runway pour générer des vidéos, CapCut pour les monter. Et un atelier pour produire une mini-campagne complète en vingt-cinq minutes. »

TRANSITION — « D’abord, comment parler à une IA d’image. »`,
  `⏱ 4 min · PROMPT D’IMAGE (simulateur)

OBJECTIF — Transposer les 5 briques du prompting à l’image : sujet, style, composition, lumière, format.

DIRE — « Demande de départ : “un café”. L’IA choisit tout au hasard. » Activer Sujet : « on sait ce qu’on veut voir. » Style : « illustration flat, pastel. » Composition : « la tasse à gauche, un espace pour le titre — c’est ce qui rend l’image utilisable. » Lumière : « l’ambiance. » Format : « carré pour LinkedIn. »

INSISTER — La composition est la brique la plus oubliée, et la plus utile pour un usage professionnel : on prévoit la place du texte.

TRANSITION — « Premier outil d’image : Adobe Firefly. »`,
  `⏱ 4 min · OUTIL 17 · ADOBE FIREFLY (2 clics)

OBJECTIF — Création et modification d’images.

DIRE — « Firefly, d’Adobe, génère des images à partir d’un texte, et surtout modifie des images existantes : remplissage génératif, extension du cadre. Son argument : ses modèles maison sont entraînés sur des contenus sous licence, pensés pour l’usage professionnel. » Clic 1 : « Quatre variantes. » Clic 2 : « Vigilance : Firefly donne aussi accès à des modèles partenaires, qui n’offrent pas les mêmes garanties. Et jamais de personne ni de marque réelle. »

TRANSITION — « Canva, cette fois côté création graphique. »`,
  `⏱ 3 min · OUTIL 18 · CANVA AI CRÉATION (2 clics)

OBJECTIF — Création graphique assistée par IA.

DIRE — « On a vu Canva pour mettre en page. Ici, son atelier graphique : génération d’images, retouche magique, et la déclinaison d’une campagne dans tous les formats. » Clic 1 : « Une affiche devient post, story, bannière. » Clic 2 : « On relit chaque déclinaison : un texte coupé arrive vite. »

TRANSITION — « Passons à la vidéo : Runway. »`,
  `⏱ 4 min · OUTIL 19 · RUNWAY (2 clics)

OBJECTIF — Création et modification de vidéos.

DIRE — « Runway génère des plans vidéo de quelques secondes à partir d’un texte ou d’une image, avec des mouvements de caméra. Il retouche aussi des vidéos existantes. » Clic 1 : « Une photo produit devient un travelling de cinq secondes. » Clic 2 : « Vigilance : clips courts, incohérences fréquentes, crédits. Et une ligne rouge : jamais le visage ou la voix d’une personne réelle. »

TRANSITION — « Pour monter le tout : CapCut. »`,
  `⏱ 3 min · OUTIL 20 · CAPCUT AI (2 clics)

OBJECTIF — Montage et création de contenus vidéo.

DIRE — « CapCut est l’outil de montage des réseaux sociaux. Ses fonctions IA : sous-titres automatiques, détourage, voix off, recadrage vertical. » Clic 1 : « 87 sous-titres en quelques secondes… dont deux noms propres à corriger. » Clic 2 : « Vigilance : lisez les conditions d’utilisation et la politique de votre entreprise ; certaines interdisent CapCut. Musiques : droits limités. »

TRANSITION — « Avant de créer : les règles. »`,
  `⏱ 4 min · CINQ RÈGLES (5 clics)

OBJECTIF — Droits, éthique et transparence des contenus générés.

DIRE — Clic par clic : « La licence de l’outil. Pas de personne réelle. Pas de marque ni d’œuvre d’autrui — le “à la manière de” tel artiste vivant est risqué. La transparence : le règlement européen sur l’IA impose de signaler les hypertrucages ; mentionnez “généré par IA”. Et relire comme un client. »

INSISTER — Ces règles valent pour l’atelier : la mention « contenu généré par IA » fait partie des critères.

TRANSITION — « À vous : la mini-campagne. »`,
  `⏱ 25 min · ATELIER 7 · MINI-CAMPAGNE (minuteur)

OBJECTIF — Brief → texte → visuel → présentation → courte vidéo.

DIRE — « Le brief : lancer Pause Verte, des paniers de fruits bio livrés dans les entreprises. Trois rôles : la plume écrit, le graphiste fait le visuel puis les slides, le vidéaste monte quinze secondes. L’enjeu : la cohérence. Même message, mêmes couleurs. »

ANIMATION — Lancer le minuteur. Restitution en mode « pitch » : chaque groupe montre sa campagne en 1 minute. Faire voter la plus cohérente.

TRANSITION — « Les prompts de la chaîne. »`,
  `⏱ (support de l’atelier 7) · LES PROMPTS

OBJECTIF — Donner un prompt de départ par étape.

DIRE — « Quatre prompts. Remarquez comme chacun reprend un élément du précédent : le slogan, les couleurs, l’espace pour le texte. C’est ce qui crée la cohérence d’une campagne. »

TRANSITION — « Quiz du module 7. »`,
  `⏱ 4 min · QUIZ MODULE 7

OBJECTIF — Vérifier : remplissage génératif, CapCut, hypertrucage, composition, contrôle du rendu vidéo.

DIRE — « Cinq questions. »

TRANSITION — « Dernier module : faire travailler l’IA toute seule, et le faire de façon responsable. »`,
  `⏱ 1 min · MODULE 8 · 16:40

OBJECTIF — Annoncer le dernier module : automatisation, usage responsable, plan d’action.

DIRE — « Dernier module. Jusqu’ici, c’est vous qui demandiez à l’IA. Maintenant : et si certaines tâches se faisaient toutes seules ? On découvre l’automatisation, sans devenir expert. Puis on rassemble les règles d’un usage responsable. Et vous repartez avec votre plan. »

TRANSITION — « Qu’est-ce qu’un workflow ? »`,
  `⏱ 3 min · QU’EST-CE QU’UN WORKFLOW ? (4 clics)

OBJECTIF — Définir déclencheur, étapes, action.

DIRE — « Un workflow, c’est une recette que l’ordinateur suit seul. » Clic par clic : « Quand un email arrive… l’IA le résume et le classe… une ligne s’ajoute au tableau… et un humain répond avec le brouillon préparé. » Puis : « Trois briques : un déclencheur, des étapes, une action. L’IA n’est qu’une étape parmi d’autres. »

TRANSITION — « Toutes les tâches ne s’y prêtent pas. Testons. »`,
  `⏱ 3 min · QUELLES TÂCHES AUTOMATISER ? (checklist)

OBJECTIF — Donner des critères d’automatisabilité.

DIRE — « Reprenez une tâche de votre fiche de l’atelier 1. Six critères : fréquente, toujours les mêmes étapes, numérique, règles simples, erreur peu grave, copier-coller entre outils. » Faire cocher un volontaire. « Et ce qu’on n’automatise pas : décisions sur des personnes, engagements juridiques ou financiers, situations émotionnelles. »

TRANSITION — « Trois exemples typiques. »`,
  `⏱ 4 min · TROIS WORKFLOWS (onglets)

OBJECTIF — Illustrer les exemples du programme : email → résumé → réponse, formulaire → analyse → rapport, réunion → compte rendu → tâches.

DIRE — Onglet 1 : « Le support client : l’IA résume, classe, prépare un brouillon ; un conseiller relit et envoie. » Onglet 2 : « L’enquête de satisfaction : chaque lundi, un rapport d’analyse arrive tout seul. » Onglet 3 : « La réunion : on a vu la chaîne au module 6 ; ici elle tourne seule, avec une validation de l’animateur. »

INSISTER — Où est le contrôle humain à chaque fois ? Faire répondre le groupe.

TRANSITION — « Avec quels outils ? »`,
  `⏱ 4 min · ZAPIER, MAKE, POWER AUTOMATE

OBJECTIF — Découvrir les trois outils du programme.

DIRE — « Zapier : le plus simple pour débuter, des milliers d’applications, une logique “quand… alors…”. Make : le plus visuel, on dessine des scénarios avec des embranchements. Power Automate : le natif de Microsoft 365, souvent déjà inclus dans vos licences. Les trois intègrent l’IA, et permettent même de décrire un workflow en langage courant. »

INSISTER — L’objectif n’est pas de devenir expert : savoir ce qui est possible, et en parler à votre service informatique.

TRANSITION — « Un exemple concret. »`,
  `⏱ 4 min · DÉMONSTRATION ZAPIER (5 clics)

OBJECTIF — Montrer un workflow réaliste de bout en bout.

DIRE — Clic 1 : « Le déclencheur : un email avec “devis” dans l’objet. » Clic 2 : « L’étape IA, avec son prompt : extraire client, besoin, budget, urgence, en JSON, sans rien inventer. » Clic 3 : « Une ligne dans le suivi des devis. » Clic 4 : « Le commercial est prévenu si c’est urgent. » Clic 5 : « Zéro saisie manuelle. Et le contrôle : c’est le commercial qui répond, et il vérifie le tableau chaque semaine. »

ANIMATION — Si une connexion est disponible, montrer un modèle de Zap réel dans Zapier.

TRANSITION — « Passons à l’usage responsable. Premier sujet : les données. »`,
  `⏱ 5 min · FEU TRICOLORE DES DONNÉES (glisser-déposer, 1 clic)

OBJECTIF — Ne pas transmettre de données confidentielles sans vérifier les règles ; confidentialité clients et collaborateurs.

DIRE — « Neuf données. Vert : je peux coller librement. Orange : seulement dans un outil professionnel validé par l’entreprise. Rouge : jamais. » Faire voter et glisser. Clic : « Notre proposition. Les mots de passe, la paie, la santé : jamais. L’email client avec nom et adresse : orange, et en minimisant. »

ADAPTER — La politique de votre entreprise prime : certaines classent tout en orange par défaut.

TRANSITION — « Les six réflexes, rassemblés. »`,
  `⏱ 3 min · SIX RÉFLEXES (6 clics)

OBJECTIF — Synthèse de l’usage responsable : vérifier, hallucinations, données, confidentialité, propriété intellectuelle, validation humaine.

DIRE — Clic par clic, en reliant chaque réflexe à un moment de la journée : « Vérifier — le module 4. Les hallucinations — le rapport annuel inventé du module 1. Les données — le feu tricolore. Clients et collègues — le RGPD et l’enregistrement des réunions. Propriété intellectuelle — les images du module 7. Validation humaine — l’email de suivi du module 6. »

TRANSITION — « Dernier atelier : votre plan. »`,
  `⏱ 15 min · ATELIER FINAL · MON MINI-PLAN (minuteur)

OBJECTIF — Chaque participant construit son mini-plan : tâche → outil IA → méthode → résultat attendu → contrôle humain.

DIRE — « Reprenez votre fiche de l’atelier 1. Choisissez la tâche numéro un. Puis remplissez les cinq colonnes. Et fixez une date : quand allez-vous le tester pour de vrai ? »

ANIMATION — Afficher le canevas (page suivante) avec l’exemple devis. Lancer le minuteur. Pour la restitution, saisir en direct le plan d’un ou deux volontaires dans le canevas vide.

TRANSITION — « Le canevas. »`,
  `⏱ (support de l’atelier final) · CANEVAS ÉDITABLE

OBJECTIF — Fournir un modèle à compléter, avec deux exemples.

DIRE — « Exemple devis : Copilot dans Outlook, un prompt modèle, deux heures gagnées par semaine, et un contrôle précis : prix, délais, nom du client. Exemple veille : Perplexity puis NotebookLM, et le contrôle : les trois sources principales ouvertes. » Puis « Canevas vide » pour la restitution.

INSISTER — Le contrôle humain doit être précis : qui vérifie quoi, quand. « Je ferai attention » n’est pas un contrôle.

TRANSITION — « Dernier quiz de module. »`,
  `⏱ 4 min · QUIZ MODULE 8

OBJECTIF — Vérifier : déclencheur, Power Automate, tâche à ne pas automatiser, données personnelles, contrôle humain précis.

DIRE — « Cinq questions. »

TRANSITION — « Il est temps de faire le bilan de la journée. »`,
  `⏱ 3 min · LE MÉMO · 17:20

OBJECTIF — Synthétiser les 20 outils par usage.

DIRE — « Voici la page à photographier. Les neuf verbes de ce matin, et pour chacun les outils de la journée qui y répondent le mieux. Vous n’avez pas besoin des vingt : commencez par un assistant, puis ajoutez le spécialiste de la tâche qui vous coûte le plus de temps. »

ANIMATION — Laisser une minute pour photographier.

TRANSITION — « Un dernier quiz, sur toute la journée. »`,
  `⏱ 5 min · GRAND QUIZ

OBJECTIF — Évaluer les acquis transversaux : fonctionnement, prompting, choix d’outils, posture.

DIRE — « Six questions, une par grand thème de la journée. Votez à main levée. »

ANIMATION — Faire répondre en équipe (moitié de salle contre moitié) pour l’énergie de fin de journée.

TRANSITION — « Mesurons votre progression. »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT FINAL

OBJECTIF — Mesurer la progression par rapport au début de journée.

DIRE — « Les mêmes huit affirmations que ce matin. Cochez ce que vous savez faire maintenant. Comparez avec votre score du matin. » Faire annoncer quelques progressions à voix haute.

INSISTER — Les points non cochés indiquent quoi revoir : le mémo et les pages d’outils restent disponibles.

TRANSITION — « Et maintenant, comment ne pas tout oublier ? »`,
  `⏱ 3 min · LES 30 PROCHAINS JOURS

OBJECTIF — Ancrer la mise en pratique.

DIRE — « Dès demain : testez votre mini-plan et créez votre document “Mes prompts”. Semaines deux et trois : un nouvel outil par semaine, sur une vraie tâche. Jour trente : mesurez le temps gagné et partagez une astuce. Et gardez en tête le fil conducteur : l’IA propose, vous disposez. »

TRANSITION — « Votre avis, avant de nous quitter. »`,
  `⏱ 3 min · VOTRE AVIS (sondage)

OBJECTIF — Recueillir un retour à chaud et l’intention d’usage.

DIRE — « Deux votes. L’utilité de la journée, et l’outil que vous utilisez dès demain. Le questionnaire détaillé vous arrive par email. »

ANIMATION — Cliquer une ligne par main levée. Commenter le second vote : c’est un bon indicateur d’engagement.

TRANSITION — « Merci à toutes et à tous. »`,
  `⏱ 2 min · MERCI

OBJECTIF — Clore et ouvrir les questions.

DIRE — « Merci pour votre énergie et votre curiosité. Vingt outils, une méthode, et une règle : l’IA propose, vous disposez. Je reste disponible pour vos questions, maintenant ou après la formation. »

ANIMATION — Laisser la page affichée pendant les questions et les échanges informels.`,
];
