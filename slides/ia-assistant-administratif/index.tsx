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
const FONT_LINK_ID = 'osd-webfont-ia-assistant-administratif';
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
const SLIDE_ID = 'ia-assistant-administratif';
const P = 'iad'; // CSS class prefix, unique per deck
const COURSE = 'IA pour l’assistant administratif';
const AUTHOR = 'Houssem Eddine LASSOUED';

// Module numbers: 0 = ouverture, 1–6 = modules de la journée, 7 = cas fil rouge & clôture.
const MOD_TITLES: Record<number, string> = {
  1: 'Découvrir l’IA au bureau',
  2: 'Maîtriser les prompts',
  3: 'Emails & courriers',
  4: 'Documents & comptes rendus',
  5: 'Organisation du travail',
  6: 'Tableaux & données',
  7: 'Cas fil rouge & bonnes pratiques',
};
const MATIN = [1, 2, 3];
const APREM = [4, 5, 6];

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
// A neutral flow glyph: request → AI step → result, joined by one stroke.
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
      <span style={{ fontWeight: 800, fontSize: size, letterSpacing: '0.04em', color, whiteSpace: 'nowrap' }}>L’IA AU BUREAU</span>
      <span style={{ fontWeight: 600, fontSize: size * 0.62, letterSpacing: '0.22em', color: color === C.navy ? C.violet : color, whiteSpace: 'nowrap' }}>ASSISTANT ADMINISTRATIF</span>
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

const ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 8];
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

// Matin : M1–M3 · Après-midi : M4–M6 + cas fil rouge (★ = module 7).
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
    <ProgSq n={7} mod={mod} text="★" />
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
          {MATIN.includes(n) ? 'MATIN · MODULE' : APREM.includes(n) ? 'APRÈS-MIDI · MODULE' : 'CAS PRATIQUE FINAL'}
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

// ─── Atelier briefing page ──────────────────────────────────────────────────
const DEFIS = {
  reperage: { label: 'Repérage des tâches', icon: 'search' as IconName, tone: 'blue' as Tone, aide: 'Fréquent, chronophage, à base de texte : c’est là que l’IA fait gagner du temps.' },
  prompts: { label: 'Bibliothèque de prompts', icon: 'chat' as IconName, tone: 'violet' as Tone, aide: 'Rôle, contexte, tâche, contraintes, format : un prompt qu’on réutilise demain.' },
  courrier: { label: 'Communication écrite', icon: 'mail' as IconName, tone: 'teal' as Tone, aide: 'Le bon ton, le bon destinataire, zéro faute : et c’est vous qui envoyez.' },
  synthese: { label: 'Compte rendu', icon: 'doc' as IconName, tone: 'navy' as Tone, aide: 'Notes brutes → compte rendu structuré → plan d’action : qui, quoi, quand.' },
  orga: { label: 'Organisation', icon: 'calendar' as IconName, tone: 'green' as Tone, aide: 'Une journée, une réunion, une checklist : l’IA propose, vous arbitrez.' },
  donnees: { label: 'Tableaux & données', icon: 'table' as IconName, tone: 'yellow' as Tone, aide: 'Nettoyer, structurer, résumer : et vérifier chaque chiffre.' },
  filrouge: { label: 'Cas fil rouge', icon: 'flag' as IconName, tone: 'coral' as Tone, aide: 'Une demande, de la réception au suivi : toute la journée en un seul cas.' },
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
      <Icon name="chat" size={20} color={C.electric} /> Assistant IA au choix :{' '}
      <span style={{ fontWeight: 600, color: C.navy }}>ChatGPT · Microsoft Copilot · Gemini · Le Chat</span> · données fictives uniquement
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
              <strong style={{ color: T.coral.fg }}>✗ Pas tout à fait. </strong>Relisez la question : quel choix tient compte du risque et du contrôle humain ? Réessayez.
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

// Cover: five everyday tasks, "avant / avec l'IA" bars shrinking.
const OCoverTask = ({ icon, tone, label, before, after, y, d }: { icon: IconName; tone: Tone; label: string; before: number; after: number; y: number; d: number }) => (
  <div className={A.right} style={{ position: 'absolute', left: 0, top: y, width: 470, ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={48} solid />
      <div style={{ flex: 1, fontSize: 23, fontWeight: 600, color: C.ink }}>{label}</div>
    </div>
    <div style={{ marginTop: 10, marginLeft: 62, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ height: 10, width: before * 7, borderRadius: 5, background: C.rule }} />
        <span style={{ fontFamily: mono, fontSize: 17, color: C.muted }}>{before} min</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className={A.grow} style={{ height: 10, width: after * 7, borderRadius: 5, background: STRONG[tone], ...dl(d + 500) }} />
        <span style={{ fontFamily: mono, fontSize: 17, fontWeight: 700, color: STRONG[tone] }}>{after} min avec l’IA</span>
      </div>
    </div>
  </div>
);

const O_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={110} r={46} cls={A.fade} />
    <Outline x={-40} y={760} w={120} h={360} r={40} color="#AEB9E6" />
    <div style={{ position: 'absolute', left: 390, top: 120, width: 920 }}>
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
        style={{ margin: '34px 0 0', fontFamily: display, fontWeight: 800, fontSize: 84, lineHeight: 1.04, letterSpacing: '-0.02em', color: C.navy, ...dl(120) }}
      >
        L’IA pour
        <br />
        <span style={{ color: C.plum }}>l’assistant administratif</span>
      </h1>
      <p className={A.in} style={{ margin: '26px 0 0', fontSize: 28, lineHeight: 1.45, color: C.soft, maxWidth: 900, ...dl(240) }}>
        Gagner du temps et améliorer son efficacité : rédiger, résumer, organiser et analyser{' '}
        <strong style={{ color: C.navy }}>avec un assistant IA, en toute sécurité</strong>.
      </p>
    </div>
    <Portrait w={170} x={390} y={700} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 720, ...dl(300) }}>
      <Eyebrow c={C.muted} size={20}>
        Formateur
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>IA appliquée aux métiers · efficacité administrative</div>
      <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
        <Tag tone="violet" size={19}>
          <Icon name="chat" size={19} /> Prompts
        </Tag>
        <Tag tone="teal" size={19}>
          <Icon name="mail" size={19} /> Emails
        </Tag>
        <Tag tone="blue" size={19}>
          <Icon name="doc" size={19} /> Synthèses
        </Tag>
        <Tag tone="yellow" size={19}>
          <Icon name="table" size={19} /> Tableaux
        </Tag>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1360, top: 150, width: 470, height: 760 }}>
      <Eyebrow c={C.navy} size={19} cls={A.fade} style={{ marginBottom: 22 }}>
        Temps passé · exemples typiques
      </Eyebrow>
      <OCoverTask icon="mail" tone="teal" label="Répondre à une réclamation" before={20} after={5} y={50} d={400} />
      <OCoverTask icon="doc" tone="blue" label="Compte rendu de réunion" before={45} after={12} y={190} d={520} />
      <OCoverTask icon="bell" tone="violet" label="Relancer trois clients" before={25} after={6} y={330} d={640} />
      <OCoverTask icon="table" tone="yellow" label="Synthèse d’un tableau de suivi" before={30} after={8} y={470} d={760} />
      <OCoverTask icon="calendar" tone="green" label="Préparer l’ordre du jour" before={15} after={4} y={610} d={880} />
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
    <Title>Bienvenue ! Une journée pour travailler autrement</Title>
    <Lede>Aucune connaissance technique requise : si vous savez écrire un email, vous savez parler à une IA.</Lede>
    <Portrait w={230} x={130} y={300} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 130, top: 615, width: 300, ...dl(200) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy, lineHeight: 1.2 }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 22, color: C.soft, lineHeight: 1.4 }}>Votre formateur pour la journée</div>
    </div>
    <div style={{ position: 'absolute', left: 520, top: 300, width: 1280, display: 'flex', gap: 26 }}>
      <OPromise value={<CountUp to={7} suffix=" h" />} label="de pratique : chaque notion est testée tout de suite sur un cas de bureau" tone="blue" d={150} />
      <OPromise value={<CountUp to={6} />} label="modules, du premier prompt jusqu’aux tableaux de données" tone="violet" d={280} />
      <OPromise value={<CountUp to={20} suffix="+" />} label="prompts prêts à l’emploi dans votre bibliothèque personnelle" tone="green" d={410} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 520, top: 640, width: 1280, ...dl(600) }}>
      <Callout title="Notre contrat" tone="blue" icon="hand">
        Vous repartez avec une méthode, une bibliothèque de prompts et des modèles réutilisables dès lundi.
        Je montre, vous pratiquez : <strong>c’est vous qui tenez le clavier</strong>.
      </Callout>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 520, top: 860, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.muted, ...dl(800) }}>
      <Icon name="bulb" size={26} color={C.violet} />
      Fil conducteur : « L’IA prépare, vous vérifiez, vous signez. »
    </div>
  </Frame>
);

// ─── Tour de table (sondage) ────────────────────────────────────────────────
const O_Poll: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Tour de table : d’où partez-vous ?</Title>
    <Lede>Main levée : cliquez une ligne par vote. Le « − » retire un vote.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 800 }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        J’ai déjà utilisé…
      </Eyebrow>
      <Poll>
        <PollRow id="o-t1" label="ChatGPT" tone="green" icon="chat" />
        <PollRow id="o-t2" label="Microsoft Copilot" tone="blue" icon="chat" />
        <PollRow id="o-t3" label="Gemini" tone="violet" icon="chat" />
        <PollRow id="o-t4" label="Le Chat (Mistral) ou un autre" tone="yellow" icon="chat" />
        <PollRow id="o-t5" label="Jamais essayé : je découvre" tone="grey" icon="smile" />
      </Poll>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 980, top: 270, width: 820, ...dl(200) }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Ce qui me prend le plus de temps
      </Eyebrow>
      <Poll>
        <PollRow id="o-a1" label="Les emails : écrire, répondre, relancer" tone="teal" icon="mail" />
        <PollRow id="o-a2" label="Les comptes rendus et les synthèses" tone="blue" icon="doc" />
        <PollRow id="o-a3" label="Les plannings, réunions et agendas" tone="green" icon="calendar" />
        <PollRow id="o-a4" label="Les tableaux et le reporting" tone="yellow" icon="table" />
        <PollRow id="o-a5" label="Chercher l’information dans les documents" tone="violet" icon="search" />
      </Poll>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(500) }}>
      On garde ces résultats en tête : on insistera sur les deux tâches les plus votées.
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
    <Lede>Dix objectifs pédagogiques, regroupés en quatre gestes professionnels.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 24 }}>
      <OGoal icon="chat" tone="blue" title="Demander" d={100}>
        <Bullet size={22}>Utiliser efficacement un assistant IA</Bullet>
        <Bullet size={22}>Rédiger des prompts adaptés aux tâches administratives</Bullet>
        <Bullet size={22}>Repérer les tâches que l’IA peut assister</Bullet>
      </OGoal>
      <OGoal icon="pen" tone="violet" title="Rédiger" d={220}>
        <Bullet size={22} tone="violet">Rédiger et reformuler emails et courriers</Bullet>
        <Bullet size={22} tone="violet">Produire comptes rendus et synthèses</Bullet>
        <Bullet size={22} tone="violet">Créer des modèles réutilisables</Bullet>
      </OGoal>
      <OGoal icon="layers" tone="green" title="Organiser" d={340}>
        <Bullet size={22} tone="green">Analyser et exploiter des documents</Bullet>
        <Bullet size={22} tone="green">Créer et améliorer tableaux et documents</Bullet>
        <Bullet size={22} tone="green">Organiser son activité avec l’IA</Bullet>
      </OGoal>
      <OGoal icon="shieldCheck" tone="coral" title="Sécuriser" d={460}>
        <Bullet size={22} tone="coral">Utiliser l’IA de manière sécurisée</Bullet>
        <Bullet size={22} tone="coral">Vérifier chaque résultat avant de l’utiliser</Bullet>
        <Bullet size={22} tone="coral">Protéger les données personnelles</Bullet>
      </OGoal>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted, ...dl(800) }}>
      <Icon name="checkCircle" size={24} color={C.green} />
      Évaluation continue : quiz à chaque module, productions d’atelier, cas fil rouge final, auto-positionnement début / fin.
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>{children}</div>
  </div>
);

const O_Programme: Page = () => (
  <Frame mod={0}>
    <Title>Le programme de la journée</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'flex', gap: 50 }}>
      <OHalf icon="chat" tone="violet" title="Matin · Bien demander" sub="L’IA, les prompts, les écrits" d={0}>
        <OSlot t="9:00" title="Ouverture · objectifs · règles du jeu" tone="grey" d={150} />
        <OSlot t="9:20" mod="M1" title="Découvrir l’IA dans les métiers administratifs" sub="Apports, limites, outils · atelier 5 tâches" tone="blue" d={230} />
        <OSlot t="10:15" title="Pause" tone="grey" d={310} />
        <OSlot t="10:30" mod="M2" title="Maîtriser les prompts" sub="Structure, contexte, format · atelier bibliothèque" tone="violet" d={390} />
        <OSlot t="11:30" mod="M3" title="Emails, courriers, communication" sub="Rédiger, reformuler, relancer · atelier" tone="teal" d={470} />
        <OSlot t="12:30" title="Déjeuner" tone="grey" d={550} />
      </OHalf>
      <OHalf icon="layers" tone="green" title="Après-midi · Bien produire" sub="Documents, organisation, données" d={200}>
        <OSlot t="13:30" mod="M4" title="Documents, comptes rendus et synthèses" sub="Résumer, extraire, comparer · atelier CR" tone="navy" d={350} />
        <OSlot t="14:30" mod="M5" title="IA et organisation du travail" sub="Journée, priorités, réunions, modèles" tone="green" d={430} />
        <OSlot t="15:10" title="Pause" tone="grey" d={510} />
        <OSlot t="15:20" mod="M6" title="IA, tableaux et données" sub="Analyser, nettoyer, préparer un reporting" tone="yellow" d={590} />
        <OSlot t="16:00" mod="★" title="Cas fil rouge et bonnes pratiques" sub="De la demande au suivi · sécurité · bilan" tone="coral" d={670} />
        <OSlot t="17:00" title="Fin de la journée" tone="grey" d={750} />
      </OHalf>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 920, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(1000) }}>
      <Icon name="map" size={24} color={C.electric} />
      Le bandeau en haut à droite indique toujours où nous en sommes : M1 → M3 le matin, M4 → M6 puis ★ l’après-midi.
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
        <CheckItem id="ap1">Expliquer ce qu’une IA générative sait faire… et ce qu’elle ne sait pas faire</CheckItem>
        <CheckItem id="ap2">Écrire une demande précise avec contexte, contraintes et format attendu</CheckItem>
        <CheckItem id="ap3">Faire rédiger ou reformuler un email dans le bon ton</CheckItem>
        <CheckItem id="ap4">Transformer des notes de réunion en compte rendu avec plan d’action</CheckItem>
        <CheckItem id="ap5">Faire extraire des informations précises d’un long document</CheckItem>
        <CheckItem id="ap6">Faire résumer un tableau de chiffres et en vérifier le résultat</CheckItem>
        <CheckItem id="ap7">Réutiliser des modèles de prompts au lieu de repartir de zéro</CheckItem>
        <CheckItem id="ap8">Dire quelles informations ne jamais coller dans une IA</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau de départ"
          levels={[
            { min: 0, text: 'Découverte : la journée est faite pour vous.', tone: 'grey' },
            { min: 3, text: 'Utilisateur occasionnel : on va structurer vos usages.', tone: 'blue' },
            { min: 6, text: 'Déjà à l’aise : visez les bonus des ateliers.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Notez votre score : il servira de référence pour mesurer votre progression à 17 h.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Règles du jeu & persona ────────────────────────────────────────────────
const O_Regles: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Règles du jeu et outils de la journée</Title>
    <Lede>Un seul assistant IA suffit : prenez celui que votre organisation autorise.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 980, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="su1" size={26}>Un assistant IA ouvert : ChatGPT, Copilot, Gemini ou Le Chat</CheckItem>
        <CheckItem id="su2" size={26}>De préférence le compte professionnel fourni par l’employeur</CheckItem>
        <CheckItem id="su3" size={26}>Un traitement de texte et un tableur (Word / Excel ou équivalent)</CheckItem>
        <CheckItem id="su4" size={26}>Un document vierge pour coller vos meilleurs prompts</CheckItem>
        <CheckItem id="su5" size={26}>Les données fictives de la formation, aucune donnée réelle</CheckItem>
      </div>
    </Checklist>
    <div style={{ position: 'absolute', left: 1160, top: 270, width: 640, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div className={A.right} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', ...dl(200) }}>
        <Eyebrow c={C.navy} size={19}>
          Notre terrain de jeu (fictif)
        </Eyebrow>
        <div style={{ marginTop: 14, display: 'flex', gap: 18, alignItems: 'center' }}>
          <IconTile name="org" tone="violet" size={64} solid />
          <div>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>Les Ateliers Morel</div>
            <div style={{ fontSize: 21, color: C.soft, lineHeight: 1.4 }}>PME de 85 salariés · mobilier de bureau · Nantes</div>
          </div>
        </div>
        <div style={{ marginTop: 16, fontSize: 22, lineHeight: 1.45, color: C.soft }}>
          Vous êtes <strong style={{ color: C.navy }}>Nadia</strong>, assistante de direction de M. Garnier. Tous les exemples de la journée viennent de son bureau.
        </div>
      </div>
      <Callout title="Règle d’or" tone="coral" icon="lock" cls={A.right} style={dl(400)} size={24}>
        Aucune donnée réelle de client, de collègue ou de contrat pendant les exercices. On travaille sur des cas inventés.
      </Callout>
    </div>
  </Frame>
);

// ═══ 10-m1 ═════════════════════════════════════════════════════════════

// ─── Module 1 · Découvrir l’IA dans les métiers administratifs ──────────────
const M1_Section: Page = () => (
  <Section
    n={1}
    title={
      <>
        Découvrir l’IA dans
        <br />
        les métiers administratifs
      </>
    }
    sub="Ce que l’IA générative apporte vraiment à un assistant, ce qu’elle ne sait pas faire, et comment choisir son outil."
    dur="9:20 – 10:15 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 1 · identifier 5 tâches
      </Tag>
    }
  >
    <SecItem n={1}>Ce que l’IA peut apporter à un assistant</SecItem>
    <SecItem n={2}>Les tâches adaptées… et les autres</SecItem>
    <SecItem n={3}>Les limites à connaître</SecItem>
    <SecItem n={4}>Choisir le bon outil, adopter les bons réflexes</SecItem>
  </Section>
);
M1_Section.transition = BLOOM;

// ─── L’IA générative, c’est quoi ? ──────────────────────────────────────────
const M1_NEXT = [
  { w: 'réception', p: 91, tone: 'violet' as Tone },
  { w: 'note', p: 5, tone: 'grey' as Tone },
  { w: 'suite', p: 3, tone: 'grey' as Tone },
  { w: 'humeur', p: 1, tone: 'grey' as Tone },
];

const M1_Quoi: Page = () => (
  <Frame mod={1} beats={3}>
    <Title>L’IA générative, en une image</Title>
    <Lede>Un modèle qui a lu des milliards de textes et qui prédit, mot après mot, la suite la plus probable.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 900, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 34px', ...dl(150) }}>
      <Eyebrow c={C.navy} size={19}>
        Ce que fait l’IA quand elle écrit
      </Eyebrow>
      <div style={{ marginTop: 18, fontSize: 34, lineHeight: 1.4, color: C.ink }}>
        « Madame, nous accusons bonne <span style={{ display: 'inline-block', minWidth: 170, borderBottom: `4px dashed ${C.violet}`, color: C.violet, fontWeight: 700 }}><span className={b.fade(1)}>réception</span></span> de votre courrier… »
      </div>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {M1_NEXT.map((n, i) => (
          <div key={n.w} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ width: 150, fontFamily: mono, fontSize: 22, color: i === 0 ? C.violet : C.muted, fontWeight: i === 0 ? 700 : 400 }}>{n.w}</span>
            <div style={{ flex: 1, height: 22, background: C.panel, borderRadius: 11, overflow: 'hidden' }}>
              <div className={A.grow} style={{ height: '100%', width: `${n.p}%`, borderRadius: 11, background: STRONG[n.tone], ...dl(400 + i * 120) }} />
            </div>
            <span style={{ width: 70, textAlign: 'right', fontFamily: mono, fontSize: 21, color: C.muted }}>{n.p} %</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18, fontSize: 20, color: C.faint }}>Probabilités illustratives</div>
    </div>
    <div style={{ position: 'absolute', left: 1080, top: 280, width: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card tone="blue" icon="book" title="Il a énormément lu" cls={b.on(1)} size={23}>
        Courriers, procédures, articles : il connaît les formules et les usages de l’écrit professionnel.
      </Card>
      <Card tone="coral" icon="eyeOff" title="Il ne connaît pas votre bureau" cls={b.on(2)} size={23}>
        Vos clients, vos tarifs, vos procédures : il ne sait que ce que vous lui donnez.
      </Card>
      <Card tone="green" icon="bulb" title="Il écrit vite, pas forcément juste" cls={b.on(3)} size={23}>
        Une réponse fluide n’est pas une réponse vraie. D’où le réflexe : je relis.
      </Card>
    </div>
    <div className={b.fade(3)} style={{ position: 'absolute', left: 120, top: 860, width: 900, fontSize: 25, color: C.soft, display: 'flex', alignItems: 'center', gap: 14 }}>
      <Icon name="user" size={30} color={C.violet} />
      <span>Imaginez <strong style={{ color: C.navy }}>un stagiaire brillant et très rapide</strong>, à qui il faut tout expliquer.</span>
    </div>
  </Frame>
);

// ─── Ce que l’IA apporte (flip cards) ───────────────────────────────────────
const M1Cap = ({ icon, tone, title, desc, ex }: { icon: IconName; tone: Tone; title: string; desc: string; ex: ReactNode }) => (
  <FlipCard
    w={536}
    h={300}
    tone={tone}
    backTone={tone}
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
        <Eyebrow c={T[tone].fg} size={18}>
          Exemple de demande
        </Eyebrow>
        <div style={{ marginTop: 12, fontSize: 23, lineHeight: 1.45, color: C.ink, fontStyle: 'italic' }}>{ex}</div>
      </>
    }
  />
);

const M1_Apports: Page = () => (
  <Frame mod={1} kind="exercice">
    <Title>Ce que l’IA peut apporter à un assistant</Title>
    <Lede>Six super-pouvoirs du quotidien. Cliquez une carte pour voir une demande type.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 536px)', gap: 36, rowGap: 32 }}>
      <M1Cap icon="pen" tone="blue" title="Rédiger" desc="Un premier jet d’email, de courrier, de note en quelques secondes." ex="« Rédige un email pour confirmer à M. Lambert son rendez-vous du jeudi 14 à 10 h avec M. Garnier. Ton cordial, 5 lignes. »" />
      <M1Cap icon="loop" tone="violet" title="Reformuler" desc="Plus clair, plus court, plus diplomate : le même message, en mieux." ex="« Reformule ce message pour qu’il soit ferme mais courtois, sans reproche : [texte]. »" />
      <M1Cap icon="doc" tone="teal" title="Résumer" desc="Un document de 20 pages ramené à l’essentiel, pour le bon lecteur." ex="« Résume ce rapport en 5 points pour mon directeur, qui a 2 minutes pour le lire. »" />
      <M1Cap icon="layers" tone="green" title="Structurer" desc="Des notes en vrac transformées en compte rendu, plan ou procédure." ex="« Transforme ces notes en compte rendu : décisions, actions, responsables, échéances. »" />
      <M1Cap icon="search" tone="yellow" title="Extraire" desc="Retrouver une date, un montant, une clause dans un long document." ex="« Dans ce contrat, liste la durée, le préavis de résiliation et les pénalités. »" />
      <M1Cap icon="globe" tone="pink" title="Traduire" desc="Traduire et adapter un message pour un interlocuteur étranger." ex="« Traduis cet email en anglais professionnel, en adaptant les formules de politesse. »" />
    </div>
  </Frame>
);

// ─── Simulateur de gain de temps ────────────────────────────────────────────
const M1Slider = ({ label, hint, v, set, min, max, step = 1, unit, tone }: { label: string; hint: string; v: number; set: (n: number) => void; min: number; max: number; step?: number; unit: string; tone: Tone }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 25, fontWeight: 600, color: C.ink }}>{label}</span>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 36, color: STRONG[tone] }}>
        {v} {unit}
      </span>
    </div>
    <div style={{ fontSize: 19, color: C.muted, marginBottom: 10 }}>{hint}</div>
    <Range value={v} onChange={set} min={min} max={max} step={step} w={900} tone={tone} />
  </div>
);

const M1_Gain: Page = () => {
  const [mails, setMails] = useState(40);
  const [docs, setDocs] = useState(4);
  const [share, setShare] = useState(50);
  const minutes = (mails * 8 + docs * 45) * (share / 100);
  const hWeek = minutes / 60;
  const days = (hWeek * 45) / 7;
  return (
    <Frame mod={1} kind="simu">
      <Title>Simulateur : combien de temps pourriez-vous gagner ?</Title>
      <Lede>Réglez les curseurs sur votre propre semaine. Hypothèses : 8 min par email, 45 min par document.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 980, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 40px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <M1Slider label="Emails rédigés par semaine" hint="réponses, relances, confirmations…" v={mails} set={setMails} min={0} max={150} step={5} unit="" tone="teal" />
        <M1Slider label="Documents produits par semaine" hint="comptes rendus, notes, synthèses, procédures" v={docs} set={setDocs} min={0} max={20} unit="" tone="blue" />
        <M1Slider label="Part du temps économisée avec l’IA" hint="prudent : 30 % · réaliste : 50 % · relecture comprise" v={share} set={setShare} min={10} max={70} step={5} unit="%" tone="violet" />
      </div>
      <div style={{ position: 'absolute', left: 1160, top: 280, width: 640, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div className={A.right} style={{ background: G.navy, borderRadius: 20, padding: '28px 34px', color: '#fff', ...dl(200) }}>
          <Eyebrow c="#AEB9E6" size={19}>
            Temps libéré par semaine
          </Eyebrow>
          <div style={{ marginTop: 8, fontFamily: display, fontWeight: 800, fontSize: 110, lineHeight: 1 }}>
            {fr(hWeek, 1)}
            <span style={{ fontSize: 50 }}> h</span>
          </div>
        </div>
        <div className={A.right} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 34px', ...dl(300) }}>
          <Eyebrow c={C.navy} size={19}>
            Sur une année (45 semaines)
          </Eyebrow>
          <div style={{ marginTop: 8, fontFamily: display, fontWeight: 800, fontSize: 64, lineHeight: 1, color: C.green }}>
            ≈ {fr(days, 0)} <span style={{ fontSize: 34 }}>journées de 7 h</span>
          </div>
        </div>
        <Callout title="Honnêtement" tone="blue" icon="scale" size={22} cls={A.right} style={dl(400)}>
          Le gain réel dépend du temps de relecture. Un mauvais prompt, ou un résultat non vérifié, fait perdre plus de temps qu’il n’en fait gagner.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Exercice : tâches adaptées ou non (drag) ───────────────────────────────
const M1Zone = ({ x, tone, icon, title, sub, sol }: { x: number; tone: Tone; icon: IconName; title: string; sub: string; sol: string }) => (
  <div style={{ position: 'absolute', left: x, top: 420, width: 548, height: 520, boxSizing: 'border-box', borderRadius: 18, background: T[tone].bg, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, padding: '16px 20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Icon name={icon} size={30} color={STRONG[tone]} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: T[tone].fg }}>{title}</span>
    </div>
    <div style={{ fontSize: 19, color: T[tone].fg, marginTop: 2 }}>{sub}</div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 20, right: 20, bottom: 14, display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, fontWeight: 700, color: T[tone].fg }}>
      <Icon name="checkCircle" size={26} color={STRONG[tone]} /> {sol}
    </div>
  </div>
);

const M1Chip = ({ n, x, y, children }: { n: number; x: number; y: number; children: ReactNode }) => (
  <Drag x={x} y={y} w={548} tone="navy" size={21}>
    <Num n={n} tone="navy" size={32} />
    <span>{children}</span>
  </Drag>
);

const M1_Tri: Page = () => (
  <Frame mod={1} kind="exercice" beats={1}>
    <Title size={46}>Exercice : l’IA, oui, avec prudence, ou non ?</Title>
    <M1Zone x={120} tone="green" icon="checkCircle" title="Idéal pour l’IA" sub="texte, répétitif, facile à relire" sol="Solution : 1 · 4 · 7" />
    <M1Zone x={686} tone="yellow" icon="alert" title="Oui, avec vigilance" sub="chiffres, faits, enjeu pour un client" sol="Solution : 2 · 5 · 8" />
    <M1Zone x={1252} tone="coral" icon="x" title="À éviter" sub="données sensibles, décision engageante" sol="Solution : 3 · 6 · 9" />
    <M1Chip n={1} x={120} y={190}>Reformuler un email trop sec</M1Chip>
    <M1Chip n={2} x={686} y={190}>Résumer un contrat fournisseur</M1Chip>
    <M1Chip n={3} x={1252} y={190}>Coller le dossier médical d’un salarié</M1Chip>
    <M1Chip n={4} x={120} y={258}>Préparer l’ordre du jour d’une réunion</M1Chip>
    <M1Chip n={5} x={686} y={258}>Calculer le total des notes de frais</M1Chip>
    <M1Chip n={6} x={1252} y={258}>Décider seule d’accorder un avoir de 2 000 €</M1Chip>
    <M1Chip n={7} x={120} y={326}>Traduire une invitation en anglais</M1Chip>
    <M1Chip n={8} x={686} y={326}>Rédiger une réponse à une réclamation</M1Chip>
    <M1Chip n={9} x={1252} y={326}>Envoyer la paie d’un collègue pour vérification</M1Chip>
    <Hint style={{ position: 'absolute', left: 120, top: 952 }}>Glissez chaque étiquette dans une colonne · double-clic pour la remettre en place · → pour la solution.</Hint>
  </Frame>
);

// ─── Les limites de l’IA ────────────────────────────────────────────────────
const M1Lim = ({ icon, tone, title, children, n }: { icon: IconName; tone: Tone; title: string; children: ReactNode; n: number }) => (
  <div className={b.left(n)} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 20px' }}>
    <IconTile name={icon} tone={tone} size={48} />
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 20, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M1_Limites: Page = () => (
  <Frame mod={1} beats={5}>
    <Title>Les limites de l’IA : ce qu’il faut savoir</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 900, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Bubble who="user" cls={A.in} w={700} size={24}>
        Quel est le délai légal pour répondre à une réclamation client ?
      </Bubble>
      <Bubble who="agent" name="Assistant IA" cls={A.in} w={760} size={24} style={dl(400)}>
        Selon l’article L. 218-4 du Code de la consommation, vous disposez de <strong>15 jours ouvrés</strong> pour répondre à toute réclamation écrite d’un client.
      </Bubble>
      <div className={b.pop(1)} style={{ marginLeft: 68, display: 'flex', alignItems: 'center', gap: 14, background: T.coral.bg, borderRadius: 14, padding: '14px 20px', boxShadow: `inset 0 0 0 2px ${T.coral.bd}` }}>
        <Icon name="alert" size={34} color={C.coral} />
        <span style={{ fontSize: 23, lineHeight: 1.4, color: C.ink }}>
          <strong style={{ color: T.coral.fg }}>Réponse inventée.</strong> Ton assuré, article cité… mais cette règle générale n’existe pas sous cette forme. C’est une <strong>hallucination</strong>.
        </span>
      </div>
      <div className={b.fade(1)} style={{ marginLeft: 68, fontSize: 21, color: C.muted }}>
        Exemple fictif construit pour la formation : vérifiez toujours une référence juridique à la source.
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1080, top: 200, width: 720, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M1Lim n={1} icon="alert" tone="coral" title="Elle peut inventer">
        Faits, chiffres, références : avec aplomb.
      </M1Lim>
      <M1Lim n={2} icon="clock" tone="yellow" title="Ses connaissances ont une date">
        Lois, tarifs, actualités récentes : à vérifier.
      </M1Lim>
      <M1Lim n={3} icon="gauge" tone="blue" title="Elle calcule mal">
        Totaux et pourcentages : laissez le tableur compter.
      </M1Lim>
      <M1Lim n={4} icon="eyeOff" tone="violet" title="Elle ignore votre contexte">
        Sans consignes, elle répond « en général ».
      </M1Lim>
      <M1Lim n={5} icon="lock" tone="navy" title="Ce que vous collez peut sortir">
        Selon l’outil, vos textes peuvent être conservés.
      </M1Lim>
    </div>
  </Frame>
);

// ─── Choisir le bon outil ───────────────────────────────────────────────────
const M1Tool = ({ who, where, plus, watch }: { who: string; where: string; plus: ReactNode; watch: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
    <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '24px 30px' }}>
      <PanelTitle icon="org">Éditeur et environnement</PanelTitle>
      <div style={{ fontSize: 25, lineHeight: 1.45, color: C.ink }}>{who}</div>
      <div style={{ marginTop: 10, fontSize: 22, lineHeight: 1.45, color: C.soft }}>{where}</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Callout title="Points forts" tone="green" icon="star" size={23}>
        {plus}
      </Callout>
      <Callout title="Points d’attention" tone="yellow" icon="alert" size={23}>
        {watch}
      </Callout>
    </div>
  </div>
);

const M1_Outils: Page = () => (
  <Frame mod={1}>
    <Title>Choisir le bon outil</Title>
    <Lede>Le meilleur outil est souvent celui que votre organisation fournit déjà : il est intégré et encadré.</Lede>
    <Tabs initial="copilot" cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 26 }}>
        <TabBtn id="copilot" tone="blue" icon="chat">
          Microsoft Copilot
        </TabBtn>
        <TabBtn id="gemini" tone="violet" icon="chat">
          Gemini
        </TabBtn>
        <TabBtn id="chatgpt" tone="green" icon="chat">
          ChatGPT
        </TabBtn>
        <TabBtn id="lechat" tone="yellow" icon="chat">
          Le Chat
        </TabBtn>
      </div>
      <TabPane id="copilot">
        <M1Tool
          who="Microsoft. Disponible dans le navigateur et, selon la licence, dans Outlook, Word, Excel, PowerPoint et Teams."
          where="Pertinent si votre bureau travaille déjà sous Microsoft 365."
          plus="Travaille directement dans vos documents et emails ; compte professionnel souvent déjà géré par l’entreprise."
          watch="Les fonctions intégrées aux applications dépendent de la licence souscrite : vérifiez ce qui est activé chez vous."
        />
      </TabPane>
      <TabPane id="gemini">
        <M1Tool
          who="Google. Disponible dans le navigateur et, selon l’abonnement, dans Gmail, Docs, Sheets et Agenda."
          where="Pertinent si votre bureau travaille sous Google Workspace."
          plus="Intégration naturelle à la messagerie et aux documents Google."
          watch="Comme pour tout outil : utilisez le compte professionnel, pas un compte personnel."
        />
      </TabPane>
      <TabPane id="chatgpt">
        <M1Tool
          who="OpenAI. Application web, mobile et de bureau, avec des offres pour les entreprises."
          where="L’outil le plus connu, très polyvalent pour rédiger, résumer, analyser."
          plus="Très à l’aise pour la rédaction et la reformulation ; peut analyser des fichiers joints."
          watch="Une version gratuite ou personnelle n’offre pas les mêmes garanties qu’une offre entreprise sur les données."
        />
      </TabPane>
      <TabPane id="lechat">
        <M1Tool
          who="Mistral AI, entreprise française. Application web et mobile, avec des offres pour les entreprises."
          where="Pertinent pour qui privilégie un acteur européen."
          plus="Bon niveau en français ; acteur soumis au droit européen."
          watch="Mêmes règles qu’ailleurs : compte professionnel et aucune donnée sensible."
        />
      </TabPane>
    </Tabs>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 830, width: 1680, display: 'flex', gap: 16, alignItems: 'center', fontSize: 23, color: C.soft, ...dl(500) }}>
      <Icon name="checkCircle" size={28} color={C.green} />
      <span>
        Trois questions pour choisir : <strong style={{ color: C.navy }}>Est-ce autorisé chez nous ?</strong> · <strong style={{ color: C.navy }}>Est-ce intégré à mes outils ?</strong> · <strong style={{ color: C.navy }}>Où vont mes données ?</strong>
      </span>
    </div>
  </Frame>
);

// ─── Bonnes pratiques ───────────────────────────────────────────────────────
const M1Rule = ({ n, tone, title, children }: { n: number; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', alignItems: 'flex-start', gap: 20, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '18px 24px' }}>
    <Num n={n} tone={tone} size={50} />
    <div>
      <div style={{ fontSize: 27, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M1_Pratiques: Page = () => (
  <Frame mod={1} beats={6}>
    <Title>Six réflexes pour bien démarrer</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
      <M1Rule n={1} tone="blue" title="Expliquez comme à un nouveau collègue">
        Qui, quoi, pour qui, pourquoi : le contexte fait la qualité.
      </M1Rule>
      <M1Rule n={2} tone="violet" title="Une demande, un objectif">
        Mieux vaut trois demandes simples qu’une demande fourre-tout.
      </M1Rule>
      <M1Rule n={3} tone="teal" title="Dialoguez, ne vous contentez pas du premier jet">
        « Plus court », « plus formel », « ajoute une date » : on affine.
      </M1Rule>
      <M1Rule n={4} tone="green" title="Relisez tout, vérifiez les faits">
        Noms, dates, montants, références : vous signez, vous vérifiez.
      </M1Rule>
      <M1Rule n={5} tone="coral" title="Anonymisez avant de coller">
        Pas de nom, d’adresse, de numéro ou de donnée sensible réelle.
      </M1Rule>
      <M1Rule n={6} tone="yellow" title="Gardez ce qui marche">
        Un bon prompt se copie dans votre bibliothèque et se réutilise.
      </M1Rule>
    </div>
    <div className={b.fade(6)} style={{ position: 'absolute', left: 120, top: 830, width: 1680 }}>
      <Quote by="Le fil conducteur de la journée">L’IA prépare, vous vérifiez, vous signez.</Quote>
    </div>
  </Frame>
);

// ─── Quiz M1 ────────────────────────────────────────────────────────────────
const M1_Quiz: Page = () => (
  <Frame mod={1} kind="quiz">
    <Title>Quiz : vrai ou faux ?</Title>
    <QuizSeries y={220}>
      <QuizQ q="« L’IA connaît les tarifs et les procédures de mon entreprise. »" explain="Elle ne sait que ce que vous lui donnez dans la conversation (texte collé, document joint). Sinon, elle invente une réponse plausible.">
        <QOpt>Vrai, elle a tout lu sur Internet</QOpt>
        <QOpt ok>Faux, sauf si je les lui fournis</QOpt>
        <QOpt>Vrai, si mon entreprise a un site web</QOpt>
      </QuizQ>
      <QuizQ q="« Une réponse bien écrite et sûre d’elle est forcément juste. »" explain="C’est le piège principal : l’IA peut inventer avec aplomb (hallucination). Plus l’enjeu est fort, plus on vérifie à la source.">
        <QOpt>Vrai</QOpt>
        <QOpt ok>Faux : le ton ne garantit rien</QOpt>
        <QOpt>Vrai, avec les modèles récents</QOpt>
      </QuizQ>
      <QuizQ q="Pour additionner 200 lignes de notes de frais, le mieux est…" explain="L’IA prédit du texte : elle peut se tromper sur un calcul. Elle peut en revanche vous écrire la formule à utiliser dans le tableur.">
        <QOpt>de demander le total à l’IA</QOpt>
        <QOpt ok>d’utiliser une formule du tableur (que l’IA peut m’aider à écrire)</QOpt>
        <QOpt>de demander deux fois à l’IA et de comparer</QOpt>
      </QuizQ>
      <QuizQ q="Quel compte utiliser pour un usage professionnel ?" explain="Le compte fourni par l’employeur est encadré : contrat, paramètres de confidentialité, règles internes. Un compte personnel ne l’est pas.">
        <QOpt>Mon compte personnel gratuit, c’est plus simple</QOpt>
        <QOpt ok>Le compte professionnel autorisé par mon organisation</QOpt>
        <QOpt>Peu importe, ce sont les mêmes outils</QOpt>
      </QuizQ>
      <QuizQ q="Votre premier jet ne convient pas. Que faire ?" explain="On dialogue : on précise ce qui ne va pas (« trop long », « plus formel », « ajoute la date »). C’est souvent au 2e ou 3e échange que le texte devient bon.">
        <QOpt>Abandonner : l’IA ne sait pas faire</QOpt>
        <QOpt ok>Préciser ce qui ne va pas et redemander</QOpt>
        <QOpt>Reposer exactement la même question</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Atelier 1 ──────────────────────────────────────────────────────────────
const M1_Atelier: Page = () => (
  <LabPage
    mod={1}
    n="1"
    title="Identifier 5 tâches à confier à l’IA"
    defi="reperage"
    who="Seul, puis en binôme"
    minutes={15}
    where={
      <>
        Une liste de <strong>5 tâches</strong> réelles de votre poste, chacune avec : fréquence, temps passé, ce que l’IA ferait, ce que vous vérifieriez.
      </>
    }
    objective={
      <>
        Repérer dans <strong>votre propre semaine</strong> cinq tâches que l’IA pourrait accélérer ou améliorer, et les classer par gain attendu.
      </>
    }
    crit={
      <>
        <CheckItem id="a1-c1" size={21}>5 tâches concrètes, pas des généralités</CheckItem>
        <CheckItem id="a1-c2" size={21}>Fréquence et durée estimées</CheckItem>
        <CheckItem id="a1-c3" size={21}>Pour chacune, le point de vérification</CheckItem>
        <CheckItem id="a1-c4" size={21}>Aucune tâche « à éviter » retenue</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Bullet size={22} tone="blue">
        <strong>Fréquence</strong> : chaque jour (3), chaque semaine (2), chaque mois (1)
      </Bullet>
      <Bullet size={22} tone="violet">
        <strong>Temps</strong> : plus de 30 min (3), 10 à 30 min (2), moins (1)
      </Bullet>
      <Bullet size={22} tone="green">
        <strong>Texte</strong> : la tâche consiste surtout à lire ou écrire (3), en partie (2), peu (1)
      </Bullet>
      <Bullet size={22} tone="coral">
        Multipliez les trois notes : <strong>au-dessus de 12</strong>, c’est une priorité.
      </Bullet>
    </div>
    <Bonus>Pour votre n°1, écrivez déjà la demande que vous feriez à l’IA : on l’améliorera au module 2.</Bonus>
  </LabPage>
);

// ═══ 20-m2 ═════════════════════════════════════════════════════════════

// ─── Module 2 · Maîtriser les prompts ───────────────────────────────────────
const M2_Section: Page = () => (
  <Section
    n={2}
    title={
      <>
        Maîtriser les prompts
        <br />
        pour les tâches administratives
      </>
    }
    sub="Un prompt, c’est une consigne. Bien écrite, elle donne un résultat utilisable du premier coup ; floue, elle fait perdre du temps."
    dur="10:30 – 11:30 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 2 · bibliothèque de prompts
      </Tag>
    }
  >
    <SecItem n={1}>La structure d’un prompt efficace</SecItem>
    <SecItem n={2}>Contexte, résultat attendu, contraintes</SecItem>
    <SecItem n={3}>Obtenir une réponse structurée</SecItem>
    <SecItem n={4}>Créer des prompts réutilisables</SecItem>
  </Section>
);
M2_Section.transition = BLOOM;

// ─── Avant / après ──────────────────────────────────────────────────────────
const M2_AvantApres: Page = () => {
  const [good, setGood] = useState(false);
  return (
    <Frame mod={2} kind="demo">
      <Title>Même besoin, deux demandes, deux résultats</Title>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, display: 'flex', alignItems: 'center', gap: 30 }}>
        <Toggle on={good} onChange={setGood} tone="green" size={28} label={<strong>Afficher la demande précise</strong>} />
        <Tag tone={good ? 'green' : 'coral'} size={22}>
          {good ? 'Prêt à envoyer après relecture' : 'À réécrire presque entièrement'}
        </Tag>
      </div>
      <div key={good ? 'g' : 'v'} className={A.fade} style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: '700px 1fr', gap: 40, animationDuration: '400ms' } as CSSProperties}>
        <div>
          <Eyebrow c={C.navy} size={19} style={{ marginBottom: 12 }}>
            La demande
          </Eyebrow>
          <Bubble who="user" w={660} size={good ? 22 : 26}>
            {good ? (
              <>
                Tu es assistante de direction. M. Garnier doit <strong>reporter le comité de direction du jeudi 14 au jeudi 21 novembre</strong>, même heure (9 h, salle Loire), à cause d’un déplacement client. Rédige l’email aux 6 participants. Ton cordial, 100 mots maximum, demande de confirmer sa présence avant le vendredi 15. Donne l’objet puis le corps, sans signature.
              </>
            ) : (
              <>Écris un mail pour décaler la réunion.</>
            )}
          </Bubble>
        </div>
        <div>
          <Eyebrow c={C.navy} size={19} style={{ marginBottom: 12 }}>
            La réponse de l’IA
          </Eyebrow>
          <div style={{ background: good ? T.green.bg : T.coral.bg, borderRadius: 18, boxShadow: `inset 0 0 0 2px ${good ? T.green.bd : T.coral.bd}`, padding: '22px 28px', fontSize: 23, lineHeight: 1.5, color: C.ink }}>
            {good ? (
              <>
                <strong>Objet : Report du comité de direction au jeudi 21 novembre</strong>
                <br />
                <br />
                Bonjour à toutes et à tous,
                <br />
                En raison d’un déplacement client de M. Garnier, le comité de direction prévu le jeudi 14 novembre est reporté au <strong>jeudi 21 novembre, à 9 h, salle Loire</strong>. L’ordre du jour reste inchangé.
                <br />
                Merci de bien vouloir confirmer votre présence avant le vendredi 15 novembre.
                <br />
                Belle journée à vous,
              </>
            ) : (
              <>
                <strong>Objet : Changement de date de la réunion</strong>
                <br />
                <br />
                Bonjour [Nom],
                <br />
                Je me permets de vous contacter afin de vous informer que la réunion prévue le <strong>[date]</strong> doit malheureusement être décalée pour des raisons d’organisation. Nous vous proposons de la reporter au <strong>[nouvelle date]</strong>. N’hésitez pas à revenir vers moi pour toute question.
                <br />
                Cordialement, [Votre nom]
              </>
            )}
          </div>
        </div>
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, color: C.soft, ...dl(400) }}>
        <Icon name="bulb" size={28} color={C.violet} />
        <span>30 secondes de plus pour écrire la demande, <strong style={{ color: C.navy }}>5 minutes de moins à corriger</strong>.</span>
      </div>
    </Frame>
  );
};

// ─── Structure d’un prompt (R-C-T-C-F) ──────────────────────────────────────
const M2_BLOCKS: { k: string; label: string; tone: Tone; txt: string; q: string }[] = [
  { k: 'R', label: 'Rôle', tone: 'blue', txt: 'Tu es assistante de direction dans une PME de 85 salariés.', q: 'Qui l’IA doit-elle être ?' },
  { k: 'C', label: 'Contexte', tone: 'violet', txt: 'Un client, M. Lambert, se plaint d’une livraison de bureaux arrivée avec 10 jours de retard.', q: 'Que se passe-t-il ?' },
  { k: 'T', label: 'Tâche', tone: 'teal', txt: 'Rédige la réponse à son email de réclamation.', q: 'Que doit-elle produire ?' },
  { k: 'C', label: 'Contraintes', tone: 'coral', txt: 'Ton empathique et professionnel, 150 mots max., aucune promesse de remboursement.', q: 'Quelles règles respecter ?' },
  { k: 'F', label: 'Format', tone: 'green', txt: 'Donne l’objet puis le corps de l’email, sans signature.', q: 'Sous quelle forme ?' },
];

const M2_Structure: Page = () => (
  <Frame mod={2} beats={5}>
    <Title>La structure d’un prompt efficace : R · C · T · C · F</Title>
    <Lede>Cinq ingrédients. Tous ne sont pas obligatoires, mais chacun améliore le résultat.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {M2_BLOCKS.map((bk, i) => (
        <div key={bk.label} className={b.left(i + 1)} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '14px 20px' }}>
          <Num n={bk.k} tone={bk.tone} size={56} />
          <div>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: STRONG[bk.tone] }}>{bk.label}</div>
            <div style={{ fontSize: 21, color: C.muted }}>{bk.q}</div>
          </div>
        </div>
      ))}
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 740, top: 280, width: 1060, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 34px', ...dl(200) }}>
      <Eyebrow c={C.navy} size={19}>
        Le prompt, construit pas à pas
      </Eyebrow>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {M2_BLOCKS.map((bk, i) => (
          <div key={bk.label} className={b.fade(i + 1)} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{ flex: 'none', width: 10, alignSelf: 'stretch', borderRadius: 5, background: STRONG[bk.tone] }} />
            <span style={{ fontSize: 27, lineHeight: 1.45, color: C.ink }}>{bk.txt}</span>
          </div>
        ))}
      </div>
    </div>
    <div className={b.on(5)} style={{ position: 'absolute', left: 740, top: 790, width: 1060 }}>
      <Callout title="Moyen mnémotechnique" tone="violet" icon="bulb" size={24}>
        « <strong>R</strong>édiger <strong>C</strong>orrectement <strong>T</strong>outes <strong>C</strong>es <strong>F</strong>ormules » : rôle, contexte, tâche, contraintes, format.
      </Callout>
    </div>
  </Frame>
);

// ─── Donner un contexte (toggles) ───────────────────────────────────────────
const M2_CTX: { label: string; guess: string; tone: Tone }[] = [
  { label: 'Qui je suis', guess: 'Qui écrit, au nom de qui ?', tone: 'blue' },
  { label: 'À qui j’écris', guess: 'Un client, un collègue, un fournisseur ?', tone: 'violet' },
  { label: 'La situation', guess: 'Que s’est-il passé, quand, où ?', tone: 'teal' },
  { label: 'L’historique', guess: 'Premier contact ou troisième relance ?', tone: 'yellow' },
  { label: 'L’objectif', guess: 'Informer, rassurer, obtenir une réponse ?', tone: 'green' },
];

const M2_Contexte: Page = () => {
  const [on, setOn] = useState([false, false, false, false, false]);
  const n = on.filter(Boolean).length;
  const pct = 20 + n * 16;
  return (
    <Frame mod={2} kind="simu">
      <Title>Donner un contexte : ce que l’IA ne peut pas deviner</Title>
      <Lede>Activez les éléments de contexte : à chaque ajout, l’IA a une question de moins à deviner.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 760, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 32px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        {M2_CTX.map((c, i) => (
          <Toggle key={c.label} on={on[i]} onChange={() => setOn((o) => o.map((x, j) => (j === i ? !x : x)))} tone={c.tone} size={27} label={<span style={{ fontWeight: 600 }}>{c.label}</span>} />
        ))}
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 960, top: 280, width: 840, ...dl(150) }}>
        <Eyebrow c={C.navy} size={19}>
          Ce que l’IA doit encore deviner
        </Eyebrow>
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {M2_CTX.map((c, i) => (
            <div
              key={c.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                fontSize: 25,
                color: on[i] ? C.faint : C.ink,
                textDecoration: on[i] ? 'line-through' : 'none',
                transition: `color 400ms ${EASE}`,
              }}
            >
              <Icon name={on[i] ? 'checkCircle' : 'alert'} size={28} color={on[i] ? C.green : C.amber} />
              {c.guess}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 34 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 24, fontWeight: 600, color: C.ink }}>Pertinence de la réponse</span>
            <span style={{ fontFamily: display, fontWeight: 800, fontSize: 44, color: n >= 4 ? C.green : n >= 2 ? C.amber : C.coral }}>{pct} %</span>
          </div>
          <div style={{ marginTop: 10, height: 22, borderRadius: 11, background: C.panel, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, borderRadius: 11, background: n >= 4 ? G.green : n >= 2 ? STRONG.yellow : STRONG.coral, transition: `width 600ms ${EASE}` }} />
          </div>
          <div style={{ marginTop: 10, fontSize: 19, color: C.faint }}>Jauge illustrative</div>
        </div>
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 870, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, color: C.soft, ...dl(500) }}>
        <Icon name="user" size={28} color={C.violet} />
        <span>Le bon test : <strong style={{ color: C.navy }}>un intérimaire arrivé ce matin comprendrait-il ma demande ?</strong></span>
      </div>
    </Frame>
  );
};

// ─── Résultat attendu & contraintes ─────────────────────────────────────────
const M2Item = ({ n, icon, tone, label, ex }: { n: number; icon: IconName; tone: Tone; label: string; ex: string }) => (
  <div className={b.on(n)} style={{ display: 'flex', alignItems: 'center', gap: 16, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '12px 18px' }}>
    <IconTile name={icon} tone={tone} size={46} />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{label}</div>
      <div style={{ fontSize: 20, color: C.soft, fontStyle: 'italic' }}>{ex}</div>
    </div>
  </div>
);

const M2_Resultat: Page = () => (
  <Frame mod={2} beats={2}>
    <Title>Définir le résultat attendu, poser les contraintes</Title>
    <Lede>Dites ce que vous voulez recevoir, et ce que vous ne voulez surtout pas.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 810 }}>
      <div className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <IconTile name="target" tone="blue" size={44} solid />
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy }}>Le résultat attendu</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <M2Item n={1} icon="doc" tone="blue" label="Le type de document" ex="un email, une note interne, un tableau, un courrier" />
        <M2Item n={1} icon="user" tone="blue" label="Le lecteur" ex="« pour mon directeur », « pour un client mécontent »" />
        <M2Item n={1} icon="gauge" tone="blue" label="La longueur" ex="« 5 lignes », « 150 mots », « une page maximum »" />
        <M2Item n={1} icon="chat" tone="blue" label="Le ton" ex="cordial, ferme, rassurant, institutionnel" />
      </div>
    </div>
    <div style={{ position: 'absolute', left: 990, top: 270, width: 810 }}>
      <div className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, ...dl(150) }}>
        <IconTile name="shield" tone="coral" size={44} solid />
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy }}>Les contraintes</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <M2Item n={2} icon="check" tone="green" label="À faire" ex="« vouvoie », « rappelle la référence de commande »" />
        <M2Item n={2} icon="x" tone="coral" label="À ne pas faire" ex="« aucune promesse de délai », « pas de jargon »" />
        <M2Item n={2} icon="book" tone="violet" label="À respecter" ex="« utilise uniquement les informations ci-dessous »" />
        <M2Item n={2} icon="alert" tone="yellow" label="En cas de doute" ex="« si une information manque, signale-la entre crochets »" />
      </div>
    </div>
    <div className={b.fade(2)} style={{ position: 'absolute', left: 120, top: 830, width: 1680 }}>
      <Callout title="La contrainte qui change tout" tone="green" icon="shieldCheck" size={24}>
        « <strong>Si une information manque, ne l’invente pas : écris [À COMPLÉTER].</strong> » Vous repérez ensuite les trous d’un coup d’œil.
      </Callout>
    </div>
  </Frame>
);

// ─── Obtenir une réponse structurée (onglets) ───────────────────────────────
const M2_TH: CSSProperties = { textAlign: 'left', padding: '12px 18px', fontFamily: display, fontWeight: 700, fontSize: 21, color: '#fff', background: C.navy };
const M2_TD: CSSProperties = { padding: '12px 18px', fontSize: 22, color: C.ink, borderBottom: `1.5px solid ${C.rule}` };

const M2_Format: Page = () => (
  <Frame mod={2} kind="demo">
    <Title>Obtenir une réponse structurée</Title>
    <Lede>
      Demande : « Présente les 3 devis de traiteur reçus pour le séminaire de mars. » Puis on choisit la forme.
    </Lede>
    <Tabs initial="tab" cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <TabBtn id="tab" tone="blue" icon="table">
          « …sous forme de tableau »
        </TabBtn>
        <TabBtn id="puces" tone="violet" icon="layers">
          « …en 3 puces »
        </TabBtn>
        <TabBtn id="reco" tone="green" icon="star">
          « …avec une recommandation »
        </TabBtn>
      </div>
      <TabPane id="tab">
        <table style={{ width: 1400, borderCollapse: 'separate', borderSpacing: 0, background: C.card, borderRadius: 16, overflow: 'hidden', boxShadow: SHADOW }}>
          <thead>
            <tr>
              <th style={M2_TH}>Traiteur</th>
              <th style={M2_TH}>Prix / personne</th>
              <th style={M2_TH}>Option végétarienne</th>
              <th style={M2_TH}>Délai de confirmation</th>
              <th style={M2_TH}>Point d’attention</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={M2_TD}>Saveurs d’Erdre</td>
              <td style={M2_TD}>38 € HT</td>
              <td style={M2_TD}>Oui</td>
              <td style={M2_TD}>J − 10</td>
              <td style={M2_TD}>Boissons en supplément</td>
            </tr>
            <tr>
              <td style={M2_TD}>Le Panier Nantais</td>
              <td style={M2_TD}>32 € HT</td>
              <td style={M2_TD}>Sur demande</td>
              <td style={M2_TD}>J − 15</td>
              <td style={M2_TD}>Minimum 40 couverts</td>
            </tr>
            <tr>
              <td style={{ ...M2_TD, borderBottom: 'none' }}>Maison Corbin</td>
              <td style={{ ...M2_TD, borderBottom: 'none' }}>45 € HT</td>
              <td style={{ ...M2_TD, borderBottom: 'none' }}>Oui</td>
              <td style={{ ...M2_TD, borderBottom: 'none' }}>J − 7</td>
              <td style={{ ...M2_TD, borderBottom: 'none' }}>Service et vaisselle inclus</td>
            </tr>
          </tbody>
        </table>
      </TabPane>
      <TabPane id="puces">
        <div style={{ width: 1400, background: C.card, borderRadius: 16, boxShadow: SHADOW, padding: '26px 34px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Bullet size={26} tone="violet">
            <strong>Le Panier Nantais</strong> est le moins cher (32 € HT), mais exige 40 couverts minimum et une confirmation à J − 15.
          </Bullet>
          <Bullet size={26} tone="violet">
            <strong>Saveurs d’Erdre</strong> est intermédiaire (38 € HT), boissons non comprises.
          </Bullet>
          <Bullet size={26} tone="violet">
            <strong>Maison Corbin</strong> est le plus cher (45 € HT), mais inclut service et vaisselle.
          </Bullet>
        </div>
      </TabPane>
      <TabPane id="reco">
        <div style={{ width: 1400, background: C.card, borderRadius: 16, boxShadow: SHADOW, padding: '26px 34px', fontSize: 26, lineHeight: 1.5, color: C.ink }}>
          Pour 35 participants, <strong>Le Panier Nantais</strong> est exclu (minimum 40 couverts). Entre les deux autres, <strong>Maison Corbin</strong> coûte 7 € de plus par personne mais inclut service et vaisselle, ce qui évite une location séparée.{' '}
          <span style={{ color: T.blue.fg, fontWeight: 600 }}>Recommandation : demander à Saveurs d’Erdre le prix des boissons avant de trancher.</span>
        </div>
      </TabPane>
    </Tabs>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, display: 'flex', gap: 14, flexWrap: 'wrap', ...dl(400) }}>
      <Tag tone="grey" size={22}>
        <Icon name="table" size={22} /> tableau avec colonnes imposées
      </Tag>
      <Tag tone="grey" size={22}>
        <Icon name="layers" size={22} /> liste à puces
      </Tag>
      <Tag tone="grey" size={22}>
        <Icon name="check" size={22} /> checklist à cocher
      </Tag>
      <Tag tone="grey" size={22}>
        <Icon name="doc" size={22} /> plan avec titres
      </Tag>
      <Tag tone="grey" size={22}>
        <Icon name="mail" size={22} /> objet + corps d’email
      </Tag>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 850, width: 1680, fontSize: 23, color: C.soft, ...dl(500) }}>
      Astuce : nommez les colonnes vous-même (« colonnes : traiteur, prix, délai ») pour pouvoir coller le tableau directement dans Excel.
    </div>
  </Frame>
);

// ─── Itérer : la conversation ───────────────────────────────────────────────
const M2_Iterer: Page = () => (
  <Frame mod={2} beats={4}>
    <Title>Le premier jet n’est qu’un brouillon : affinez</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1080, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Bubble who="user" w={900} size={22} cls={A.in}>
        Rédige une note interne annonçant la fermeture du parking du 2 au 6 décembre pour travaux.
      </Bubble>
      <Bubble who="agent" name="Version 1" w={940} size={22} cls={b.on(1)}>
        Chers collaborateurs, nous souhaitons vous informer que, dans le cadre de travaux de rénovation indispensables à l’amélioration de nos infrastructures, le parking sera fermé… <span style={{ color: C.muted }}>(12 lignes)</span>
      </Bubble>
      <Bubble who="user" w={900} size={22} cls={b.on(2)}>
        Trop long. 5 lignes maximum, et ajoute la solution : le parking municipal rue Paul-Bert, avec badge remis à l’accueil.
      </Bubble>
      <Bubble who="agent" name="Version 2" w={940} size={22} cls={b.on(3)}>
        <strong>Parking fermé du 2 au 6 décembre (travaux).</strong> Pendant cette période, vous pouvez stationner au parking municipal, rue Paul-Bert. Les badges d’accès sont à retirer à l’accueil dès le 28 novembre. Merci de votre compréhension.
      </Bubble>
    </div>
    <div style={{ position: 'absolute', left: 1260, top: 190, width: 540 }}>
      <Eyebrow c={C.navy} size={19} cls={A.fade}>
        Les relances qui marchent
      </Eyebrow>
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {['« Plus court / plus long »', '« Plus formel / plus chaleureux »', '« Ajoute… / retire… »', '« Propose 3 versions »', '« Que manque-t-il ? »', '« Corrige l’orthographe uniquement »'].map((t, i) => (
          <div key={t} className={b.left(4)} style={{ display: 'flex', alignItems: 'center', gap: 12, background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '12px 18px', fontSize: 23, color: C.ink, ...dl(i * 90) }}>
            <Icon name="loop" size={24} color={C.violet} /> {t}
          </div>
        ))}
      </div>
    </div>
  </Frame>
);

// ─── Prompts réutilisables (modèle à trous) ─────────────────────────────────
const M2V = ({ children }: { children: ReactNode }) => (
  <span style={{ color: '#FFD27A', background: 'rgba(255,255,255,.08)', borderRadius: 6, padding: '0 6px' }}>[{children}]</span>
);

const M2_Modele: Page = () => (
  <Frame mod={2} beats={2}>
    <Title>Créer des prompts réutilisables</Title>
    <Lede>Écrivez-le une fois, avec des [CROCHETS] à la place de ce qui change. Réutilisez-le cent fois.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060 }}>
      <CodeDark file="modèle · réponse à une demande de devis" size={24} wrap>
        Tu es assistante commerciale chez <M2V>ENTREPRISE</M2V>, qui vend <M2V>PRODUITS</M2V>.{'\n'}
        Un prospect, <M2V>NOM</M2V>, demande un devis pour <M2V>BESOIN</M2V>.{'\n'}
        Rédige un email qui :{'\n'}
        {'  '}1. le remercie de sa demande ;{'\n'}
        {'  '}2. confirme l’envoi du devis sous <M2V>DÉLAI</M2V> ;{'\n'}
        {'  '}3. pose les questions manquantes : <M2V>QUESTIONS</M2V>.{'\n'}
        Ton professionnel et chaleureux, 120 mots maximum.{'\n'}
        Format : objet, puis corps de l’email, sans signature.
      </CodeDark>
    </div>
    <div style={{ position: 'absolute', left: 1240, top: 270, width: 560, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card tone="violet" icon="archive" title="Où les ranger ?" cls={b.on(1)} size={22}>
        Un document « Ma bibliothèque de prompts », classé par usage : emails, comptes rendus, tableaux…
      </Card>
      <Card tone="blue" icon="gear" title="Encore mieux" cls={b.on(1)} size={22} style={dl(120)}>
        Selon l’outil : instructions personnalisées, assistants ou « gems » pré-configurés avec vos règles.
      </Card>
      <Card tone="green" icon="users" title="À partager" cls={b.on(2)} size={22}>
        Une bibliothèque d’équipe harmonise le ton de tous les courriers du service.
      </Card>
    </div>
    <div className={b.fade(2)} style={{ position: 'absolute', left: 120, top: 800, width: 1060, fontSize: 23, color: C.soft, display: 'flex', gap: 14, alignItems: 'center' }}>
      <Icon name="bulb" size={28} color={C.violet} /> Astuce : demandez à l’IA de transformer votre meilleur échange en modèle à crochets.
    </div>
  </Frame>
);

// ─── Exercice : défauts d’un prompt (hotspots) ──────────────────────────────
const M2_Defauts: Page = () => (
  <Frame mod={2} kind="exercice">
    <Title>Exercice : cinq défauts dans cette demande</Title>
    <Lede>Trouvez-les à l’oral, puis cliquez les pastilles. Ensuite, réécrivez-la avec R · C · T · C · F.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1100 }}>
      <CodeDark file="demande de Nadia (version 0)" size={25}>
        Fais-moi un compte rendu de la réunion d’hier.{'\n'}
        Il faut que ce soit bien et pas trop long.{'\n'}
        Mets aussi les chiffres du trimestre dedans,{'\n'}
        et envoie-le à toute l’équipe.{'\n'}
        {'\n'}
        Notes : voir pièce jointe CR_RH_salaires_2025.xlsx
      </CodeDark>
    </div>
    <Hotspot n={1} x={1245} y={340} title="Aucun contexte" w={480}>
      Quelle réunion, quels participants ? Les notes ne sont même pas fournies dans le texte.
    </Hotspot>
    <Hotspot n={2} x={1245} y={380} title="Critères flous" w={480}>
      « Bien », « pas trop long » : quel plan, combien de mots, pour quel lecteur ?
    </Hotspot>
    <Hotspot n={3} x={1245} y={420} title="Chiffres non fournis" w={480}>
      L’IA ne les connaît pas : elle risque de les inventer.
    </Hotspot>
    <Hotspot n={4} x={1245} y={460} title="Elle n’envoie rien" w={480}>
      L’IA rédige ; c’est vous qui relisez puis envoyez.
    </Hotspot>
    <Hotspot n={5} x={1245} y={540} title="Données sensibles" w={480}>
      Un fichier de salaires n’a rien à faire dans un assistant IA.
    </Hotspot>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 640, width: 1100, ...dl(500) }}>
      <Callout title="Version corrigée, en résumé" tone="green" icon="checkCircle" size={23}>
        Rôle + réunion (date, participants, objet) + notes collées et anonymisées + plan imposé (décisions, actions, responsables, échéances) + 1 page max. + « signale ce qui manque ».
      </Callout>
    </div>
  </Frame>
);

// ─── QCM M2 ─────────────────────────────────────────────────────────────────
const M2_Qcm: Page = () => (
  <QcmPage
    mod={2}
    n={1}
    title="Quel est le meilleur prompt ?"
    q="Nadia doit relancer un fournisseur qui n’a pas livré les ramettes de papier commandées il y a 3 semaines. Quelle demande donnera le meilleur résultat ?"
    explain="La réponse C contient un rôle, le contexte (commande, date, retard), la tâche, des contraintes (ton, longueur, demande de date) et un format. Les autres obligent l’IA à deviner, ou lui demandent d’agir à votre place."
  >
    <Opt why="Aucun contexte : quel fournisseur, quelle commande, quel ton ? Le résultat sera générique.">Écris une relance fournisseur.</Opt>
    <Opt why="La menace et le ton agressif sont imposés sans nuance : risqué pour la relation commerciale.">Écris un email très sec au fournisseur pour qu’il comprenne qu’on n’est pas contents.</Opt>
    <Opt ok why="Exact : rôle, contexte, tâche, contraintes et format sont présents.">
      Tu es assistante de direction. Commande n° 4521 de 50 ramettes passée le 2 octobre, non livrée. Rédige une relance ferme mais courtoise, 80 mots, qui demande une date de livraison ferme. Objet + corps.
    </Opt>
    <Opt why="L’IA n’envoie pas d’email à votre place dans un assistant classique, et vous devez relire avant l’envoi.">Envoie une relance au fournisseur de papier.</Opt>
  </QcmPage>
);

// ─── Atelier 2 ──────────────────────────────────────────────────────────────
const M2_Atelier: Page = () => (
  <LabPage
    mod={2}
    n="2"
    title="Créer votre bibliothèque de prompts"
    defi="prompts"
    who="En binôme"
    minutes={25}
    where={
      <>
        Un document <strong>« Ma bibliothèque de prompts »</strong> avec au moins 5 modèles à crochets, chacun testé une fois dans votre assistant IA.
      </>
    }
    objective={
      <>
        Rédiger cinq prompts <strong>réutilisables</strong> pour vos tâches les plus fréquentes, en appliquant la structure R · C · T · C · F.
      </>
    }
    crit={
      <>
        <CheckItem id="a2-c1" size={21}>Les 5 ingrédients sont présents</CheckItem>
        <CheckItem id="a2-c2" size={21}>Ce qui change est entre [CROCHETS]</CheckItem>
        <CheckItem id="a2-c3" size={21}>Chaque prompt a été testé</CheckItem>
        <CheckItem id="a2-c4" size={21}>Un nom clair pour le retrouver</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Bullet size={22} tone="violet">
        Partez des <strong>5 tâches de l’atelier 1</strong> ou des modèles proposés page suivante.
      </Bullet>
      <Bullet size={22} tone="violet">
        Testez chaque prompt avec un cas fictif, puis améliorez-le <strong>une fois</strong>.
      </Bullet>
      <Bullet size={22} tone="violet">
        Ajoutez la ligne : « si une information manque, écris [À COMPLÉTER] ».
      </Bullet>
    </div>
    <Bonus>Demandez à l’IA : « Pose-moi les questions dont tu as besoin avant de rédiger. » Comparez le résultat.</Bonus>
  </LabPage>
);

// ─── Exemples de bibliothèque ───────────────────────────────────────────────
const M2Lib = ({ icon, tone, name, use, prompt }: { icon: IconName; tone: Tone; name: string; use: string; prompt: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, alignItems: 'center', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 22px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <IconTile name={icon} tone={tone} size={48} />
      <div>
        <div style={{ fontSize: 23, fontWeight: 700, color: C.ink }}>{name}</div>
        <div style={{ fontSize: 18, color: C.muted }}>{use}</div>
      </div>
    </div>
    <div style={{ fontFamily: mono, fontSize: 19, lineHeight: 1.5, color: C.soft }}>{prompt}</div>
  </div>
);

const M2_Biblio: Page = () => (
  <Frame mod={2} kind="lab">
    <Title>Atelier 2 · Cinq modèles pour démarrer</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M2Lib icon="mail" tone="teal" name="Réponse type" use="emails entrants" prompt="Tu es [RÔLE]. Réponds à cet email de [EXPÉDITEUR] : [EMAIL]. Objectif : [OBJECTIF]. Ton [TON], [N] mots max. Objet + corps." />
      <M2Lib icon="loop" tone="violet" name="Reformulation" use="tous écrits" prompt="Reformule ce texte pour [LECTEUR] : plus [clair / court / diplomate]. Garde tous les faits, ne rajoute rien. Texte : [TEXTE]" />
      <M2Lib icon="doc" tone="navy" name="Compte rendu" use="réunions" prompt="À partir de ces notes de la réunion [OBJET] du [DATE] : [NOTES]. Rédige un CR : contexte, décisions, actions (qui / quoi / quand). 1 page max." />
      <M2Lib icon="search" tone="yellow" name="Extraction" use="documents" prompt="Dans ce document : [TEXTE]. Extrais [INFOS] dans un tableau. Si une info est absente, écris « non trouvé ». N’invente rien." />
      <M2Lib icon="calendar" tone="green" name="Ordre du jour" use="réunions" prompt="Prépare l’ordre du jour de [RÉUNION] ([DURÉE], [PARTICIPANTS]). Sujets : [SUJETS]. Minutage par point, objectif de chaque point." />
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(400) }}>
      Copiez, adaptez, testez. Un bon modèle est court, précis, et dit quoi faire quand une information manque.
    </Hint>
  </Frame>
);

// ═══ 30-m3 ═════════════════════════════════════════════════════════════

// ─── Module 3 · Emails, courriers et communication professionnelle ──────────
const M3_Section: Page = () => (
  <Section
    n={3}
    title={
      <>
        Emails, courriers
        <br />
        et communication pro
      </>
    }
    sub="Rédiger, reformuler, adapter le ton, répondre, relancer, traduire : l’IA écrit le premier jet, vous gardez la main sur ce qui part."
    dur="11:30 – 12:30 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 3 · communications à partir de cas réels
      </Tag>
    }
  >
    <SecItem n={1}>Rédiger un email, reformuler, adapter le ton</SecItem>
    <SecItem n={2}>Répondre à une réclamation, relancer un client</SecItem>
    <SecItem n={3}>Rédiger une note interne</SecItem>
    <SecItem n={4}>Traduire et adapter un message</SecItem>
  </Section>
);
M3_Section.transition = BLOOM;

// ─── Rédiger un email (anatomie annotée) ────────────────────────────────────
const M3Note = ({ n, y, tone, children }: { n: number; y: number; tone: Tone; children: ReactNode }) => (
  <div className={b.left(n)} style={{ position: 'absolute', left: 1440, top: y, width: 360, display: 'flex', alignItems: 'center', gap: 12 }}>
    <span style={{ flex: 'none', width: 30, height: 4, borderRadius: 2, background: STRONG[tone] }} />
    <Tag tone={tone} size={20}>
      {children}
    </Tag>
  </div>
);

const M3Line = ({ tone, children, style }: { n: number; tone: Tone; children: ReactNode; style?: CSSProperties }) => (
  <div style={{ borderRadius: 10, padding: '6px 12px', boxShadow: `inset 4px 0 0 ${STRONG[tone]}`, ...style }}>
    {children}
  </div>
);

const M3_Email: Page = () => (
  <Frame mod={3} beats={5}>
    <Title>Rédiger un email : ce qu’on demande, ce qu’on obtient</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 560 }}>
      <Eyebrow c={C.navy} size={19} style={{ marginBottom: 12 }}>
        La demande de Nadia
      </Eyebrow>
      <Bubble who="user" w={500} size={21}>
        Tu es assistante de direction aux Ateliers Morel. L’imprimante du 2e étage affiche « erreur E-52 » depuis ce matin. Rédige un email à notre prestataire, InfoServ, pour demander une intervention avant jeudi. Contrat n° MS-2291. Ton cordial et précis, 100 mots max.
      </Bubble>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 740, top: 200, width: 660, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 26px', fontSize: 22, lineHeight: 1.5, color: C.ink, display: 'flex', flexDirection: 'column', gap: 8, ...dl(200) }}>
      <M3Line n={1} tone="blue">
        <strong>Objet : Demande d’intervention – imprimante 2e étage – contrat MS-2291</strong>
      </M3Line>
      <M3Line n={2} tone="violet">Bonjour,</M3Line>
      <M3Line n={3} tone="teal">
        Depuis ce matin, l’imprimante du 2e étage de nos locaux affiche le message « erreur E-52 » et ne fonctionne plus.
      </M3Line>
      <M3Line n={4} tone="green">
        Pourriez-vous programmer une intervention <strong>avant jeudi</strong> ? Je reste disponible au 02 40 00 00 00 pour convenir d’un créneau.
      </M3Line>
      <M3Line n={5} tone="yellow">
        Je vous remercie par avance pour votre réactivité.
        <br />
        Bien cordialement,
      </M3Line>
    </div>
    <M3Note n={1} y={232} tone="blue">
      Objet clair et retrouvable
    </M3Note>
    <M3Note n={2} y={300} tone="violet">
      Formule d’appel
    </M3Note>
    <M3Note n={3} y={380} tone="teal">
      Le contexte en une phrase
    </M3Note>
    <M3Note n={4} y={480} tone="green">
      L’action attendue + l’échéance
    </M3Note>
    <M3Note n={5} y={590} tone="yellow">
      Formule de politesse
    </M3Note>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(500) }}>
      <Callout title="Avant d’envoyer" tone="coral" icon="eye" size={23}>
        Vérifiez le numéro de contrat, le téléphone (ici fictif) et l’échéance. Ajoutez votre signature. L’IA a écrit, <strong>c’est vous qui envoyez</strong>.
      </Callout>
    </div>
  </Frame>
);

// ─── Reformuler / adapter le ton (curseur) ──────────────────────────────────
const M3_TONES: { label: string; tone: Tone; txt: ReactNode; when: string }[] = [
  {
    label: 'Familier',
    tone: 'green',
    when: 'Collègue proche, messagerie interne',
    txt: (
      <>
        Salut Julie ! Petite mauvaise nouvelle : le mobilier pour Rennes arrive avec 5 jours de retard, le transporteur a un souci. Je te tiens au courant dès que j’ai la nouvelle date !
      </>
    ),
  },
  {
    label: 'Cordial',
    tone: 'blue',
    when: 'Client habituel, partenaire',
    txt: (
      <>
        Bonjour Madame Roux,
        <br />
        Je vous informe que la livraison du mobilier de votre site de Rennes aura 5 jours de retard, en raison d’un incident chez notre transporteur. Je reviens vers vous dès que j’ai la nouvelle date.
        <br />
        Bien cordialement,
      </>
    ),
  },
  {
    label: 'Formel',
    tone: 'navy',
    when: 'Courrier officiel, administration',
    txt: (
      <>
        Madame,
        <br />
        Nous vous informons que la livraison du mobilier destiné à votre site de Rennes subira un retard de cinq jours, consécutif à un incident chez notre transporteur. Nous vous communiquerons la nouvelle date dans les meilleurs délais.
        <br />
        Nous vous prions d’agréer, Madame, l’expression de nos salutations distinguées.
      </>
    ),
  },
  {
    label: 'Empathique',
    tone: 'violet',
    when: 'Client déjà mécontent, situation sensible',
    txt: (
      <>
        Bonjour Madame Roux,
        <br />
        Je sais combien ce mobilier est attendu pour l’ouverture de votre site de Rennes, et je suis sincèrement désolée : un incident chez notre transporteur retarde la livraison de 5 jours. Je suis personnellement le dossier et vous appelle demain avec une date ferme.
      </>
    ),
  },
];

const M3_Ton: Page = () => {
  const [i, setI] = useState(1);
  const t = M3_TONES[i];
  return (
    <Frame mod={3} kind="simu">
      <Title>Reformuler et adapter le ton</Title>
      <Lede>Le même fait : « la livraison aura 5 jours de retard ». Faites glisser le curseur.</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', alignItems: 'center', gap: 30 }}>
        <span style={{ fontSize: 24, fontWeight: 600, color: C.ink, whiteSpace: 'nowrap' }}>« Reformule ce message sur un ton… »</span>
        <Range value={i} onChange={setI} min={0} max={3} w={520} tone={t.tone} />
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: STRONG[t.tone] }}>{t.label}</span>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 360, width: 1680, display: 'flex', gap: 10 }}>
        {M3_TONES.map((x, j) => (
          <span key={x.label} style={{ flex: 1, height: 8, borderRadius: 4, background: j === i ? STRONG[x.tone] : C.rule, transition: `background 300ms ${EASE}` }} />
        ))}
      </div>
      <div key={i} className={A.fade} style={{ position: 'absolute', left: 120, top: 400, width: 1180, background: C.card, borderRadius: 20, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[t.tone]}`, padding: '30px 36px', fontSize: 27, lineHeight: 1.55, color: C.ink, animationDuration: '400ms' } as CSSProperties}>
        {t.txt}
      </div>
      <div style={{ position: 'absolute', left: 1360, top: 400, width: 440, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div key={`w${i}`} className={A.fade} style={{ background: T[t.tone].bg, borderRadius: 16, padding: '18px 22px', animationDuration: '400ms' } as CSSProperties}>
          <Eyebrow c={T[t.tone].fg} size={17}>
            Pour qui ?
          </Eyebrow>
          <div style={{ marginTop: 6, fontSize: 24, fontWeight: 600, color: C.ink }}>{t.when}</div>
        </div>
        <Callout title="Autres consignes" tone="grey" icon="loop" size={21}>
          « plus court » · « plus clair » · « sans jargon » · « plus positif » · « en gardant tous les faits »
        </Callout>
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 880, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.soft, ...dl(400) }}>
        <Icon name="bulb" size={28} color={C.violet} />
        <span>Précisez toujours : « <strong style={{ color: C.navy }}>garde tous les faits, n’ajoute rien</strong> ». Une reformulation ne doit pas inventer de promesse.</span>
      </div>
    </Frame>
  );
};

// ─── Répondre à une réclamation ─────────────────────────────────────────────
const M3_ARSS: { k: string; label: string; tone: Tone; txt: ReactNode }[] = [
  { k: 'A', label: 'Accuser réception', tone: 'blue', txt: 'Monsieur Lambert, je vous remercie pour votre message concernant la livraison de vos bureaux (commande n° 7710).' },
  { k: 'R', label: 'Reconnaître', tone: 'violet', txt: 'Vous avez raison : un retard de 10 jours n’est pas acceptable, et je comprends la gêne pour l’installation de votre équipe.' },
  { k: 'S', label: 'Solution', tone: 'green', txt: 'Le mobilier est désormais en stock. Nous vous proposons une livraison et un montage ce vendredi 15, sans frais.' },
  { k: 'S', label: 'Suite', tone: 'teal', txt: 'Je vous appelle jeudi pour confirmer le créneau. Vous pouvez me joindre directement d’ici là.' },
];

const M3_Reclamation: Page = () => (
  <Frame mod={3} beats={5}>
    <Title>Répondre à une réclamation : la méthode A · R · S · S</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 700 }}>
      <Eyebrow c={C.coral} size={19} style={{ marginBottom: 12 }}>
        Le message reçu
      </Eyebrow>
      <div style={{ background: T.coral.bg, borderRadius: 16, boxShadow: `inset 0 0 0 2px ${T.coral.bd}`, padding: '18px 24px', fontSize: 22, lineHeight: 1.5, color: C.ink, fontStyle: 'italic' }}>
        « Commande 7710 : on m’avait promis les bureaux pour le 1er, nous sommes le 11 et toujours rien. Mon équipe travaille sur des tables pliantes. C’est inadmissible. J’attends une réponse rapide. »
        <div style={{ marginTop: 8, fontStyle: 'normal', fontSize: 19, color: C.muted }}>M. Lambert, client</div>
      </div>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {M3_ARSS.map((s, i) => (
          <div key={s.label} className={b.left(i + 1)} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Num n={s.k} tone={s.tone} size={46} />
            <span style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: STRONG[s.tone] }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 880, top: 190, width: 920, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(200) }}>
      <Eyebrow c={C.navy} size={19}>
        Le projet de réponse (après relecture)
      </Eyebrow>
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {M3_ARSS.map((s, i) => (
          <div key={s.label} className={b.fade(i + 1)} style={{ fontSize: 23, lineHeight: 1.5, color: C.ink, paddingLeft: 16, borderLeft: `5px solid ${STRONG[s.tone]}` }}>
            {s.txt}
          </div>
        ))}
      </div>
    </div>
    <div className={b.on(5)} style={{ position: 'absolute', left: 880, top: 790, width: 920 }}>
      <Callout title="Dans le prompt, précisez" tone="coral" icon="shield" size={22}>
        ce que vous pouvez proposer (livraison, geste) et ce qui est exclu. <strong>L’IA ne promet jamais ce que l’entreprise n’a pas décidé.</strong>
      </Callout>
    </div>
  </Frame>
);

// ─── Relancer un client (onglets) ───────────────────────────────────────────
const M3Relance = ({ day, tone, ton, obj, txt }: { day: string; tone: Tone; ton: string; obj: string; txt: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 28 }}>
    <div style={{ background: T[tone].bg, borderRadius: 18, padding: '22px 26px' }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 64, color: STRONG[tone], lineHeight: 1 }}>{day}</div>
      <div style={{ marginTop: 12, fontSize: 24, fontWeight: 600, color: C.ink }}>{ton}</div>
    </div>
    <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 28px', fontSize: 23, lineHeight: 1.5, color: C.ink }}>
      <strong>Objet : {obj}</strong>
      <div style={{ marginTop: 10 }}>{txt}</div>
    </div>
  </div>
);

const M3_Relance: Page = () => (
  <Frame mod={3} kind="demo">
    <Title>Relancer un client : trois relances, trois tons</Title>
    <Lede>Facture F-2025-118 de 4 800 € TTC, échue le 30/09. Un seul modèle, un paramètre : [NIVEAU].</Lede>
    <Tabs initial="r1" cls={A.in} style={{ position: 'absolute', left: 120, top: 280, width: 1680 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <TabBtn id="r1" tone="green" icon="bell">
          Relance 1 · J + 7
        </TabBtn>
        <TabBtn id="r2" tone="yellow" icon="bell">
          Relance 2 · J + 15
        </TabBtn>
        <TabBtn id="r3" tone="coral" icon="alert">
          Relance 3 · J + 30
        </TabBtn>
      </div>
      <TabPane id="r1">
        <M3Relance day="J + 7" tone="green" ton="Courtoise : on suppose un simple oubli" obj="Facture F-2025-118 – petit rappel" txt="Bonjour Monsieur Dupré, sauf erreur de notre part, la facture F-2025-118 de 4 800 € TTC, échue le 30 septembre, ne nous est pas encore parvenue. Il s’agit sans doute d’un oubli : vous la trouverez à nouveau en pièce jointe. Bien cordialement," />
      </TabPane>
      <TabPane id="r2">
        <M3Relance day="J + 15" tone="yellow" ton="Ferme : on demande une date" obj="Facture F-2025-118 – second rappel" txt="Monsieur Dupré, malgré notre rappel du 7 octobre, la facture F-2025-118 de 4 800 € TTC reste impayée. Nous vous remercions de procéder au règlement sous 8 jours ou de nous indiquer la date prévue. En cas de difficulté, contactez-moi pour en parler." />
      </TabPane>
      <TabPane id="r3">
        <M3Relance day="J + 30" tone="coral" ton="Formelle : on annonce la suite" obj="Facture F-2025-118 – dernier rappel avant recouvrement" txt="Monsieur, en l’absence de règlement de la facture F-2025-118 (4 800 € TTC) malgré nos relances des 7 et 15 octobre, nous vous informons que le dossier sera transmis à notre service recouvrement le 10 novembre. Nous restons disposés à convenir d’un échéancier." />
      </TabPane>
    </Tabs>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(400) }}>
      <Callout title="À valider avant l’envoi" tone="yellow" icon="alert" size={23}>
        Les montants, dates et numéros viennent de votre logiciel, pas de l’IA. La relance 3 évoque une suite : <strong>elle doit être validée par votre responsable</strong>.
      </Callout>
    </div>
  </Frame>
);

// ─── Rédiger une note interne ───────────────────────────────────────────────
const M3_Note: Page = () => {
  const [ok, setOk] = useState(false);
  return (
    <Frame mod={3} kind="demo">
      <Title>Rédiger une note interne qu’on lit vraiment</Title>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, display: 'flex', alignItems: 'center', gap: 30 }}>
        <Toggle on={ok} onChange={setOk} tone="green" size={28} label={<strong>« Structure cette note : objet, ce qui change, pour qui, quand, que faire, contact »</strong>} />
      </div>
      <div key={ok ? 'o' : 'k'} className={A.fade} style={{ position: 'absolute', left: 120, top: 280, width: 1200, animationDuration: '400ms' } as CSSProperties}>
        {ok ? (
          <div style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: C.navy }}>Notes de frais : une application dès le 1er décembre</div>
            {[
              ['Ce qui change', 'Fini les formulaires papier : les notes de frais se saisissent sur l’application Fraizy.'],
              ['Pour qui', 'Tous les salariés qui engagent des frais professionnels.'],
              ['Quand', 'À partir du 1er décembre. Les notes de novembre restent sur papier.'],
              ['Que faire', 'Installer l’application, photographier chaque justificatif, valider avant le 5 du mois.'],
              ['Contact', 'Service comptabilité, poste 214.'],
            ].map(([h, v]) => (
              <div key={h} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 18, fontSize: 23, lineHeight: 1.45 }}>
                <span style={{ fontWeight: 700, color: C.green }}>{h}</span>
                <span style={{ color: C.ink }}>{v}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: T.grey.bg, borderRadius: 20, boxShadow: `inset 0 0 0 2px ${T.grey.bd}`, padding: '26px 32px', fontSize: 23, lineHeight: 1.6, color: C.soft, fontStyle: 'italic' }}>
            « Bon alors pour les notes de frais la compta a dit qu’à partir de décembre faudrait passer par l’appli Fraizy, plus de papier, sauf pour novembre qui reste comme avant je crois, et il faut prendre les justificatifs en photo, et valider avant le 5, ça concerne tout le monde qui a des frais, si question voir la compta poste 214… »
            <div style={{ marginTop: 10, fontStyle: 'normal', fontSize: 19, color: C.muted }}>Notes prises au téléphone par Nadia</div>
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', left: 1380, top: 280, width: 420, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Card tone="blue" icon="eye" title="Lue en 20 secondes" size={21} cls={A.right}>
          Titre informatif, une info par ligne, l’action à faire bien visible.
        </Card>
        <Card tone="yellow" icon="alert" title="« je crois »" size={21} cls={A.right} style={dl(150)}>
          Une info incertaine dans les notes reste incertaine : vérifiez-la auprès de la compta avant diffusion.
        </Card>
      </div>
    </Frame>
  );
};

// ─── Traduire et adapter ────────────────────────────────────────────────────
const M3Adapt = ({ n, fr: f, en, why }: { n: number; fr: string; en: string; why: string }) => (
  <div className={b.on(n)} style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr 1fr', gap: 16, alignItems: 'center', background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 20px' }}>
    <span style={{ fontSize: 22, color: C.soft, fontStyle: 'italic' }}>{f}</span>
    <Icon name="arrow" size={26} color={C.faint} />
    <span style={{ fontSize: 22, fontWeight: 600, color: C.navy }}>{en}</span>
    <span style={{ fontSize: 19, color: C.muted }}>{why}</span>
  </div>
);

const M3_Traduire: Page = () => (
  <Frame mod={3} beats={4}>
    <Title>Traduire… et adapter le message</Title>
    <Lede>« Traduis cet email en anglais professionnel pour un fournisseur britannique. Adapte les formules et les formats, signale-moi ce que tu as adapté. »</Lede>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 300, width: 1680, display: 'grid', gridTemplateColumns: '1fr 40px 1fr 1fr', gap: 16, padding: '0 20px', boxSizing: 'border-box' }}>
      <Eyebrow c={C.muted} size={17}>
        Français
      </Eyebrow>
      <span />
      <Eyebrow c={C.muted} size={17}>
        Anglais adapté
      </Eyebrow>
      <Eyebrow c={C.muted} size={17}>
        Pourquoi
      </Eyebrow>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 340, width: 1680, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <M3Adapt n={1} fr="Madame, Monsieur," en="Dear Mr Hall," why="On s’adresse à une personne nommée" />
      <M3Adapt n={2} fr="livraison le 03/11" en="delivery on 3 November" why="03/11 se lit « 11 mars » aux États-Unis : date en toutes lettres" />
      <M3Adapt n={3} fr="1 250,50 € HT" en="€1,250.50 excl. VAT" why="Virgule et point inversés, « HT » se dit « excl. VAT »" />
      <M3Adapt n={4} fr="Veuillez agréer, Monsieur, l’expression de…" en="Kind regards," why="Les formules longues n’existent pas en anglais" />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(400) }}>
      <Callout title="Le bon réflexe" tone="blue" icon="globe" size={23}>
        Pour un message important, demandez une <strong>retraduction vers le français</strong> : si le sens a dérivé, vous le verrez tout de suite.
      </Callout>
    </div>
  </Frame>
);

// ─── Quiz M3 ────────────────────────────────────────────────────────────────
const M3_Quiz: Page = () => (
  <Frame mod={3} kind="quiz">
    <Title>Quiz : emails et courriers</Title>
    <QuizSeries y={220}>
      <QuizQ q="Que faut-il absolument préciser pour faire reformuler un message ?" explain="Sans cette consigne, l’IA peut ajouter une excuse, une promesse ou un détail qui n’existait pas. Une reformulation change la forme, pas le fond.">
        <QOpt>La police de caractères</QOpt>
        <QOpt ok>« Garde tous les faits, n’ajoute rien »</QOpt>
        <QOpt>Le nombre de paragraphes</QOpt>
      </QuizQ>
      <QuizQ q="Dans la méthode A·R·S·S, que signifie le R ?" explain="Accuser réception, Reconnaître le problème (sans forcément reconnaître une faute juridique), proposer une Solution, annoncer la Suite.">
        <QOpt>Rembourser</QOpt>
        <QOpt ok>Reconnaître le problème du client</QOpt>
        <QOpt>Relancer</QOpt>
      </QuizQ>
      <QuizQ q="L’IA propose dans une réponse « un avoir de 20 % ». Personne ne l’a décidé. Que faire ?" explain="Un engagement commercial se décide par l’entreprise, pas par l’IA. On retire la phrase et on précise dans le prompt ce qui peut ou non être proposé.">
        <QOpt>L’envoyer, le client sera content</QOpt>
        <QOpt ok>Retirer la phrase et cadrer le prompt</QOpt>
        <QOpt>Passer l’avoir à 10 % pour limiter</QOpt>
      </QuizQ>
      <QuizQ q="Pourquoi écrire « 3 November » plutôt que « 03/11 » à un interlocuteur américain ?" explain="Aux États-Unis, la date s’écrit mois/jour : 03/11 se lit « 11 mars ». Le mois en toutes lettres évite toute ambiguïté.">
        <QOpt>C’est plus élégant</QOpt>
        <QOpt ok>03/11 peut se lire « 11 mars »</QOpt>
        <QOpt>Les chiffres ne se traduisent pas</QOpt>
      </QuizQ>
      <QuizQ q="Une relance à J + 30 annonce une transmission au recouvrement. Qui valide ?" explain="Annoncer une suite contentieuse engage l’entreprise : la décision et la validation reviennent au responsable, l’IA ne fait que rédiger.">
        <QOpt>Personne, c’est un modèle</QOpt>
        <QOpt>L’IA, qui a fait le calcul des jours</QOpt>
        <QOpt ok>Votre responsable</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Atelier 3 ──────────────────────────────────────────────────────────────
const M3Sit = ({ n, tone, title, children }: { n: number; tone: Tone; title: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
    <Num n={n} tone={tone} size={34} />
    <div style={{ fontSize: 21, lineHeight: 1.4 }}>
      <strong style={{ color: C.ink }}>{title}</strong> · {children}
    </div>
  </div>
);

const M3_Atelier: Page = () => (
  <LabPage
    mod={3}
    n="3"
    title="Quatre situations réelles à traiter"
    defi="courrier"
    who="En binôme, une situation chacun puis échange"
    minutes={25}
    where={
      <>
        Pour chaque situation : <strong>le prompt</strong> utilisé, <strong>le texte final</strong> relu, et la liste de ce que vous avez <strong>corrigé</strong>.
      </>
    }
    objective={
      <>
        Produire plusieurs communications professionnelles <strong>prêtes à envoyer</strong> à partir de situations du bureau des Ateliers Morel.
      </>
    }
    crit={
      <>
        <CheckItem id="a3-c1" size={21}>Le ton est adapté au destinataire</CheckItem>
        <CheckItem id="a3-c2" size={21}>Aucun fait inventé, aucune promesse</CheckItem>
        <CheckItem id="a3-c3" size={21}>L’action attendue est claire</CheckItem>
        <CheckItem id="a3-c4" size={21}>Prompt rangé dans la bibliothèque</CheckItem>
      </>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <M3Sit n={1} tone="coral" title="Réclamation">
        une cliente reçoit des chaises de la mauvaise couleur, 2e erreur en un an.
      </M3Sit>
      <M3Sit n={2} tone="yellow" title="Relance">
        un devis de 12 000 € envoyé il y a 3 semaines, sans réponse.
      </M3Sit>
      <M3Sit n={3} tone="navy" title="Note interne">
        l’accueil fermera à 16 h tous les vendredis à partir de janvier.
      </M3Sit>
      <M3Sit n={4} tone="pink" title="Traduction">
        invitation d’un partenaire espagnol au salon de Lyon, en anglais.
      </M3Sit>
    </div>
    <Bonus>Faites réécrire la réclamation pour un client VIP, puis comparez les deux versions.</Bonus>
  </LabPage>
);

// ═══ 40-m4 ═════════════════════════════════════════════════════════════

// ─── Module 4 · Documents, comptes rendus et synthèses ──────────────────────
const M4_Section: Page = () => (
  <Section
    n={4}
    title={
      <>
        Documents, comptes
        <br />
        rendus et synthèses
      </>
    }
    sub="Résumer, extraire, comparer, structurer : l’IA lit vite et organise bien. À vous de vérifier qu’elle n’a rien oublié ni inventé."
    dur="13:30 – 14:30 · atelier inclus"
    labs={
      <Tag tone="green" size={19}>
        Atelier 4 · notes brutes → CR → plan d’action
      </Tag>
    }
  >
    <SecItem n={1}>Résumer un document, extraire des informations</SecItem>
    <SecItem n={2}>Comparer plusieurs documents</SecItem>
    <SecItem n={3}>Préparer un compte rendu à partir de notes</SecItem>
    <SecItem n={4}>Créer une procédure</SecItem>
  </Section>
);
M4_Section.transition = BLOOM;

// ─── Résumer pour un lecteur (onglets) ──────────────────────────────────────
const M4Sum = ({ prompt, children }: { prompt: string; children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '560px 1fr', gap: 28 }}>
    <Bubble who="user" w={520} size={22}>
      {prompt}
    </Bubble>
    <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 28px', fontSize: 23, lineHeight: 1.5, color: C.ink }}>{children}</div>
  </div>
);

const M4_Resumer: Page = () => (
  <Frame mod={4} kind="demo">
    <Title>Résumer un document : pour qui, et pour quoi faire ?</Title>
    <Lede>Le même rapport d’audit énergétique des locaux (18 pages), résumé pour trois lecteurs différents.</Lede>
    <Tabs initial="dir" cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <TabBtn id="dir" tone="navy" icon="user">
          Le directeur · 2 minutes
        </TabBtn>
        <TabBtn id="equipe" tone="green" icon="users">
          Les salariés · ce qui change
        </TabBtn>
        <TabBtn id="compta" tone="yellow" icon="euro">
          La comptabilité · les coûts
        </TabBtn>
      </div>
      <TabPane id="dir">
        <M4Sum prompt="Résume ce rapport en 3 points pour mon directeur, qui a 2 minutes. Termine par la décision à prendre.">
          <Bullet size={23} tone="navy">Les locaux consomment 30 % de plus que la moyenne, surtout à cause du chauffage.</Bullet>
          <Bullet size={23} tone="navy">Trois travaux sont recommandés ; l’isolation des combles est le plus rentable.</Bullet>
          <Bullet size={23} tone="navy">Des aides publiques peuvent couvrir une partie du coût.</Bullet>
          <div style={{ marginTop: 12, fontWeight: 700, color: C.navy }}>Décision : lancer ou non les devis d’isolation avant fin décembre.</div>
        </M4Sum>
      </TabPane>
      <TabPane id="equipe">
        <M4Sum prompt="Résume ce rapport pour les salariés : uniquement ce qui change pour eux au quotidien, ton simple, 80 mots.">
          Bonne nouvelle : des travaux vont améliorer le confort des bureaux. Dès janvier, le chauffage sera programmé (19 °C en journée, réduit la nuit et le week-end). Pensez à éteindre écrans et imprimantes le soir : c’est le geste le plus efficace. Les éventuels travaux d’isolation seront annoncés à l’avance.
        </M4Sum>
      </TabPane>
      <TabPane id="compta">
        <M4Sum prompt="Extrais du rapport tous les montants (coûts, économies, aides) dans un tableau. Indique la page de chaque chiffre.">
          <div style={{ fontFamily: mono, fontSize: 21, lineHeight: 1.7 }}>
            Isolation combles · coût 18 000 € · économie 4 200 €/an · p. 11
            <br />
            Programmation chauffage · coût 3 500 € · économie 1 800 €/an · p. 12
            <br />
            Remplacement fenêtres · coût 46 000 € · économie 3 100 €/an · p. 13
          </div>
          <div style={{ marginTop: 10, fontSize: 20, color: C.coral, fontWeight: 600 }}>→ Les numéros de page servent à vérifier chaque chiffre dans l’original.</div>
        </M4Sum>
      </TabPane>
    </Tabs>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 840, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.soft, ...dl(400) }}>
      <Icon name="bulb" size={28} color={C.violet} />
      <span>Rapport et chiffres fictifs. Un résumé utile dit <strong style={{ color: C.navy }}>pour qui</strong>, <strong style={{ color: C.navy }}>combien de points</strong> et <strong style={{ color: C.navy }}>ce qu’il faut décider</strong>.</span>
    </div>
  </Frame>
);

// ─── Extraire des informations ──────────────────────────────────────────────
const M4_FIELDS: [string, string, Tone][] = [
  ['Prestataire', 'NetClair SARL', 'blue'],
  ['Durée', '12 mois, renouvelable par tacite reconduction', 'blue'],
  ['Prix', '1 450 € HT / mois, révisable au 1er janvier', 'yellow'],
  ['Préavis de résiliation', '3 mois avant l’échéance, par lettre recommandée', 'coral'],
  ['Pénalités', 'non trouvé dans le document', 'grey'],
];

const M4_Extraire: Page = () => (
  <Frame mod={4} beats={5}>
    <Title>Extraire des informations d’un long document</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 760 }}>
      <Eyebrow c={C.navy} size={19} style={{ marginBottom: 12 }}>
        Contrat de nettoyage · extrait (page 4 sur 14)
      </Eyebrow>
      <div style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW, padding: '22px 26px', fontFamily: 'Georgia, serif', fontSize: 20, lineHeight: 1.6, color: C.soft }}>
        <strong>Article 5 – Durée.</strong> Le présent contrat est conclu pour une durée de douze (12) mois à compter de sa signature. Il se renouvelle par tacite reconduction pour des périodes successives de même durée…
        <br />
        <strong>Article 6 – Prix.</strong> En contrepartie des prestations, le Client verse au Prestataire la somme mensuelle de 1 450 € HT, révisable au 1er janvier de chaque année selon l’indice…
        <br />
        <strong>Article 9 – Résiliation.</strong> Chaque partie peut résilier le contrat par lettre recommandée avec accusé de réception, moyennant un préavis de trois (3) mois avant l’échéance…
      </div>
      <div className={A.fade} style={{ marginTop: 18, ...dl(300) }}>
        <Bubble who="user" w={700} size={21}>
          Extrais : prestataire, durée, prix, préavis, pénalités. Tableau à 2 colonnes. Si une info est absente, écris « non trouvé ». N’invente rien.
        </Bubble>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 940, top: 222, width: 860, background: C.card, borderRadius: 18, boxShadow: SHADOW, overflow: 'hidden' }}>
      {M4_FIELDS.map(([k2, v, tone], i) => (
        <div key={k2} className={b.fade(i + 1)} style={{ display: 'grid', gridTemplateColumns: '290px 1fr', borderBottom: i < 4 ? `1.5px solid ${C.rule}` : 'none' }}>
          <div style={{ padding: '18px 22px', fontWeight: 700, fontSize: 23, color: C.navy, background: C.panel }}>{k2}</div>
          <div style={{ padding: '18px 22px', fontSize: 23, color: tone === 'grey' ? C.muted : C.ink, fontStyle: tone === 'grey' ? 'italic' : 'normal', boxShadow: `inset 5px 0 0 ${STRONG[tone]}` }}>{v}</div>
        </div>
      ))}
    </div>
    <div className={b.on(5)} style={{ position: 'absolute', left: 940, top: 720, width: 860 }}>
      <Callout title="« non trouvé » est une bonne réponse" tone="green" icon="checkCircle" size={22}>
        Sans cette consigne, l’IA aurait pu inventer une pénalité « standard ». Une case vide se vérifie ; une invention passe inaperçue.
      </Callout>
    </div>
  </Frame>
);

// ─── Comparer plusieurs documents ───────────────────────────────────────────
const M4Diff = ({ n, topic, a, b2, tone, impact }: { n: number; topic: string; a: string; b2: string; tone: Tone; impact: string }) => (
  <div className={b.on(n)} style={{ display: 'grid', gridTemplateColumns: '240px 1fr 1fr 300px', gap: 0, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, overflow: 'hidden', fontSize: 22 }}>
    <div style={{ padding: '14px 18px', fontWeight: 700, color: C.navy, background: C.panel }}>{topic}</div>
    <div style={{ padding: '14px 18px', color: C.muted, textDecoration: 'line-through' }}>{a}</div>
    <div style={{ padding: '14px 18px', color: C.ink, fontWeight: 600 }}>{b2}</div>
    <div style={{ padding: '14px 18px', background: T[tone].bg, color: T[tone].fg, fontWeight: 600, fontSize: 20 }}>{impact}</div>
  </div>
);

const M4_Comparer: Page = () => (
  <Frame mod={4} beats={4}>
    <Title>Comparer deux versions d’un document</Title>
    <Lede>« Compare la version 2024 et la version 2025 du règlement télétravail. Tableau : sujet, avant, après, impact pour les salariés. »</Lede>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'grid', gridTemplateColumns: '240px 1fr 1fr 300px', fontFamily: display, fontWeight: 700, fontSize: 18, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted }}>
      <span style={{ padding: '0 18px' }}>Sujet</span>
      <span style={{ padding: '0 18px' }}>Version 2024</span>
      <span style={{ padding: '0 18px' }}>Version 2025</span>
      <span style={{ padding: '0 18px' }}>Impact</span>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 330, width: 1680, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M4Diff n={1} topic="Jours par semaine" a="2 jours maximum" b2="3 jours maximum" tone="green" impact="Plus de souplesse" />
      <M4Diff n={2} topic="Demande" a="Par email au manager" b2="Via le portail RH, 48 h avant" tone="yellow" impact="Nouvelle démarche" />
      <M4Diff n={3} topic="Indemnité" a="Aucune" b2="2,50 € par jour télétravaillé" tone="green" impact="Gain financier" />
      <M4Diff n={4} topic="Jour de présence" a="Libre" b2="Mardi obligatoire sur site" tone="coral" impact="Contrainte nouvelle" />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 750, width: 1680, ...dl(400) }}>
      <Callout title="Vérification indispensable" tone="coral" icon="eye" size={23}>
        L’IA peut <strong>manquer une différence</strong> discrète (un mot, un chiffre). Pour un texte qui engage (contrat, règlement), utilisez aussi la fonction « Comparer » de votre traitement de texte.
      </Callout>
    </div>
  </Frame>
);

// ─── Préparer un compte rendu (structure) ───────────────────────────────────
const M4_CR: { icon: IconName; tone: Tone; t: string; d: string }[] = [
  { icon: 'calendar', tone: 'blue', t: 'En-tête', d: 'Réunion, date, lieu, présents, excusés' },
  { icon: 'target', tone: 'violet', t: 'Objet', d: 'Pourquoi on s’est réunis, en une phrase' },
  { icon: 'chat', tone: 'teal', t: 'Points abordés', d: 'Un paragraphe court par sujet' },
  { icon: 'checkCircle', tone: 'green', t: 'Décisions', d: 'Ce qui a été tranché, sans ambiguïté' },
  { icon: 'flag', tone: 'coral', t: 'Actions', d: 'Qui fait quoi, pour quand' },
  { icon: 'clock', tone: 'yellow', t: 'Prochaine réunion', d: 'Date et sujets à suivre' },
];

const M4_CompteRendu: Page = () => (
  <Frame mod={4} beats={6}>
    <Title>Préparer un compte rendu : la structure à imposer</Title>
    <Lede>L’IA met en forme vos notes. Donnez-lui le plan : elle le suivra à la lettre.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
      {M4_CR.map((c, i) => (
        <div key={c.t} className={b.pop(i + 1)} style={{ background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 6px 0 ${STRONG[c.tone]}`, padding: '24px 26px', display: 'flex', gap: 18, alignItems: 'flex-start' }}>
          <IconTile name={c.icon} tone={c.tone} size={56} />
          <div>
            <div style={{ fontSize: 15, fontFamily: display, fontWeight: 700, letterSpacing: '0.12em', color: C.muted }}>{pad(i + 1)}</div>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{c.t}</div>
            <div style={{ marginTop: 4, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{c.d}</div>
          </div>
        </div>
      ))}
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 720, width: 1680, ...dl(300) }}>
      <CodeDark file="consigne à ajouter" size={22} wrap>
        N’ajoute <Ck>aucune</Ck> décision ni action absente des notes. Si un responsable ou une échéance manque, écris <Cs>[À PRÉCISER]</Cs>. Ne cite pas les propos personnels, seulement les positions.
      </CodeDark>
    </div>
  </Frame>
);

// ─── Notes brutes → CR → plan d’action (stepper) ────────────────────────────
const M4_STEPS = ['Notes brutes', 'Compte rendu', 'Plan d’action'];
const M4_ACT: [string, string, string, Tone][] = [
  ['Demander 3 devis de traiteur', 'Nadia', '20 nov.', 'blue'],
  ['Réserver la salle Loire (35 pers.)', 'Nadia', '18 nov.', 'blue'],
  ['Valider le budget séminaire', 'M. Garnier', '22 nov.', 'violet'],
  ['Préparer le programme de la journée', 'Mme Roux', '29 nov.', 'green'],
  ['Choisir l’intervenant extérieur', '[À PRÉCISER]', '[À PRÉCISER]', 'coral'],
];

const M4_Transformer: Page = () => {
  const [s, setS] = useState(0);
  return (
    <Frame mod={4} kind="demo">
      <Title>Notes brutes → compte rendu → plan d’action</Title>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, display: 'flex', alignItems: 'center', gap: 14 }}>
        {M4_STEPS.map((l, i) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Btn tone={i === 0 ? 'grey' : i === 1 ? 'navy' : 'green'} ghost={s !== i} onClick={() => setS(i)} size={23}>
              {i + 1}. {l}
            </Btn>
            {i < 2 ? <Icon name="arrow" size={26} color={C.faint} /> : null}
          </div>
        ))}
      </div>
      <div key={s} className={A.fade} style={{ position: 'absolute', left: 120, top: 280, width: 1680, animationDuration: '400ms' } as CSSProperties}>
        {s === 0 ? (
          <div style={{ background: '#FFFBEA', borderRadius: 16, boxShadow: `inset 0 0 0 2px ${T.yellow.bd}`, padding: '24px 30px', fontFamily: mono, fontSize: 22, lineHeight: 1.65, color: C.soft, transform: 'rotate(-0.4deg)' }}>
            réu séminaire 12/11 – Garnier, Roux, Petit, Nadia (Moreau excusé)
            <br />- séminaire mars, 35 pers, Nantes ou proche
            <br />- budget ?? Garnier valide d’ici 22/11 – pas plus de 15k
            <br />- traiteur : Nadia demande 3 devis avt 20/11
            <br />- salle Loire OK si dispo → Nadia réserve (18/11)
            <br />- programme : Roux s’en charge fin nov
            <br />- intervenant ext. ? idée coach / pas tranché
            <br />- prochaine réu début déc
          </div>
        ) : s === 1 ? (
          <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '24px 32px', fontSize: 22, lineHeight: 1.5, color: C.ink, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 40px' }}>
            <div>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>Compte rendu · Préparation du séminaire</div>
              <div style={{ color: C.muted, fontSize: 20 }}>12 novembre · Présents : M. Garnier, Mme Roux, M. Petit, Nadia · Excusé : M. Moreau</div>
              <div style={{ marginTop: 12 }}>
                <strong>Objet</strong> : organiser le séminaire annuel de mars (35 personnes, Nantes ou proximité).
              </div>
              <div style={{ marginTop: 8 }}>
                <strong>Points abordés</strong> : lieu, restauration, budget, programme, intervenant extérieur.
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: C.green }}>Décisions</div>
              <Bullet size={21} tone="green">Plafond de budget : 15 000 €, validation finale le 22/11.</Bullet>
              <Bullet size={21} tone="green">Salle Loire retenue, sous réserve de disponibilité.</Bullet>
              <div style={{ marginTop: 8, fontWeight: 700, color: C.coral }}>Non tranché</div>
              <Bullet size={21} tone="coral">Intervenant extérieur (piste : un coach).</Bullet>
              <div style={{ marginTop: 8 }}>
                <strong>Prochaine réunion</strong> : début décembre [date À PRÉCISER].
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px 220px', background: C.navy, color: '#fff', fontFamily: display, fontWeight: 700, fontSize: 21 }}>
              <span style={{ padding: '14px 22px' }}>Action</span>
              <span style={{ padding: '14px 22px' }}>Responsable</span>
              <span style={{ padding: '14px 22px' }}>Échéance</span>
            </div>
            {M4_ACT.map(([a, w, d, tone]) => (
              <div key={a} style={{ display: 'grid', gridTemplateColumns: '1fr 280px 220px', fontSize: 23, borderBottom: `1.5px solid ${C.rule}`, boxShadow: `inset 6px 0 0 ${STRONG[tone]}` }}>
                <span style={{ padding: '13px 22px', color: C.ink }}>{a}</span>
                <span style={{ padding: '13px 22px', color: w.startsWith('[') ? C.coral : C.ink, fontWeight: 600 }}>{w}</span>
                <span style={{ padding: '13px 22px', color: d.startsWith('[') ? C.coral : C.ink, fontFamily: mono, fontSize: 21 }}>{d}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <Hint cls={A.fade} style={{ position: 'absolute', left: 120, top: 905, ...dl(400) }}>
        Cliquez les étapes. Remarquez les [À PRÉCISER] : l’IA signale ce qui manque au lieu de l’inventer.
      </Hint>
    </Frame>
  );
};

// ─── Créer une procédure ────────────────────────────────────────────────────
const M4_PROC = [
  'Accueillir le visiteur et lui demander l’objet de sa visite.',
  'Vérifier son nom sur le planning des rendez-vous du jour.',
  'Lui faire signer le registre et lui remettre un badge « Visiteur ».',
  'Prévenir la personne qu’il vient voir (poste ou Teams).',
  'Lui indiquer la salle d’attente et lui proposer une boisson.',
  'À son départ : récupérer le badge et noter l’heure de sortie.',
];

const M4_Procedure: Page = () => (
  <Frame mod={4} beats={6}>
    <Title>Créer une procédure à partir d’une explication</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 640 }}>
      <Eyebrow c={C.navy} size={19} style={{ marginBottom: 12 }}>
        Ce que Nadia explique à l’intérimaire
      </Eyebrow>
      <Bubble who="user" w={600} size={21}>
        Transforme mon explication en procédure numérotée pour l’accueil des visiteurs. Verbes à l’infinitif, une action par étape, 8 étapes max. Ajoute à la fin « en cas de problème ».
        <div style={{ marginTop: 10, fontStyle: 'italic', color: C.soft }}>
          « Quand quelqu’un arrive, tu lui demandes qui il vient voir, tu regardes dans le planning, il signe le registre, tu donnes un badge, tu appelles la personne, tu l’installes… et quand il part tu récupères le badge, n’oublie pas l’heure. »
        </div>
      </Bubble>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 820, top: 200, width: 980, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(200) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy, marginBottom: 14 }}>Procédure · Accueil d’un visiteur</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {M4_PROC.map((p, i) => (
          <div key={p} className={b.left(i + 1)} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Num n={i + 1} tone="teal" size={40} />
            <span style={{ fontSize: 23, lineHeight: 1.35, color: C.ink }}>{p}</span>
          </div>
        ))}
      </div>
      <div className={b.fade(6)} style={{ marginTop: 16, background: T.coral.bg, borderRadius: 12, padding: '12px 18px', fontSize: 21, color: C.ink }}>
        <strong style={{ color: T.coral.fg }}>En cas de problème</strong> : visiteur non attendu → appeler le responsable avant de le laisser entrer.
      </div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 640, fontSize: 22, lineHeight: 1.45, color: C.soft, ...dl(400) }}>
      <Icon name="checkCircle" size={26} color={C.green} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 10 }} />
      Testez la procédure : <strong style={{ color: C.navy }}>donnez-la à un collègue</strong> qui ne connaît pas la tâche. Là où il hésite, il manque une étape.
    </div>
  </Frame>
);

// ─── Exercice : vérifier un CR généré (hotspots) ────────────────────────────
const M4_Verifier: Page = () => (
  <Frame mod={4} kind="exercice">
    <Title>Exercice : ce compte rendu généré contient 4 erreurs</Title>
    <Lede>Comparez-le aux notes brutes de la page précédente (séminaire). Trouvez, puis cliquez les pastilles.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1060, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 32px', fontSize: 23, lineHeight: 1.75, color: C.ink }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 27, color: C.navy }}>Compte rendu · Séminaire de mars</div>
      <div>Présents : M. Garnier, Mme Roux, M. Petit, M. Moreau, Nadia</div>
      <div>Budget validé : 15 000 €.</div>
      <div>Traiteur : Nadia demande 3 devis avant le 20 novembre.</div>
      <div>Intervenant : il a été décidé de faire appel à un coach.</div>
      <div>Programme : Mme Roux, pour fin novembre.</div>
      <div>Prochaine réunion : lundi 2 décembre à 14 h.</div>
    </div>
    <Hotspot n={1} x={1150} y={358} title="Excusé devenu présent" w={520}>
      M. Moreau était excusé : il ne doit pas figurer parmi les présents.
    </Hotspot>
    <Hotspot n={2} x={1150} y={398} title="Budget pas encore validé" w={520}>
      Les notes disent : plafond 15 000 €, validation par M. Garnier d’ici le 22/11.
    </Hotspot>
    <Hotspot n={3} x={1150} y={478} title="Décision inventée" w={520}>
      Le coach n’était qu’une idée : « pas tranché ».
    </Hotspot>
    <Hotspot n={4} x={1150} y={559} title="Date inventée" w={520}>
      Les notes disent seulement « début décembre ».
    </Hotspot>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 740, width: 1060, ...dl(500) }}>
      <Callout title="Le piège" tone="coral" icon="alert" size={23}>
        Ces erreurs sont <strong>plausibles</strong> : rien ne les signale à la lecture. Seule la comparaison avec les notes les révèle.
      </Callout>
    </div>
  </Frame>
);

// ─── QCM M4 ─────────────────────────────────────────────────────────────────
const M4_Qcm: Page = () => (
  <QcmPage
    mod={4}
    n={2}
    title="Extraire sans risque"
    q="Vous demandez à l’IA d’extraire les dates clés d’un contrat de 30 pages. Quelle consigne réduit le plus le risque d’erreur ?"
    explain="Demander la page (ou l’article) de chaque information permet de vérifier rapidement dans l’original, et « non trouvé » empêche l’invention. Les deux ensemble rendent l’extraction contrôlable."
  >
    <Opt why="La demande est polie, mais rien ne permet de vérifier ni n’empêche l’invention.">« Merci de bien vouloir extraire les dates. »</Opt>
    <Opt why="Demander de « bien vérifier » ne change pas la façon dont l’IA produit sa réponse.">« Extrais les dates et vérifie bien. »</Opt>
    <Opt ok why="Exact : la référence permet le contrôle, « non trouvé » empêche l’invention.">
      « Extrais les dates avec l’article et la page de chacune ; écris “non trouvé” si une date est absente. »
    </Opt>
    <Opt why="Plus court n’est pas plus fiable : un résumé peut perdre des dates.">« Résume le contrat en 5 lignes. »</Opt>
  </QcmPage>
);

// ─── Atelier 4 ──────────────────────────────────────────────────────────────
const M4_Atelier: Page = () => (
  <LabPage
    mod={4}
    n="4"
    title="Notes brutes → compte rendu → plan d’action"
    defi="synthese"
    who="Seul, puis relecture croisée en binôme"
    minutes={20}
    where={
      <>
        Un <strong>compte rendu</strong> d’une page et un <strong>tableau d’actions</strong> (qui / quoi / quand), plus la liste des corrections faites après relecture.
      </>
    }
    objective={
      <>
        À partir des notes brutes fournies (réunion « déménagement des archives »), produire un compte rendu professionnel puis un plan d’action <strong>fidèle aux notes</strong>.
      </>
    }
    crit={
      <>
        <CheckItem id="a4-c1" size={21}>Les 6 rubriques du CR sont présentes</CheckItem>
        <CheckItem id="a4-c2" size={21}>Aucune décision ni date inventée</CheckItem>
        <CheckItem id="a4-c3" size={21}>Chaque action a un responsable</CheckItem>
        <CheckItem id="a4-c4" size={21}>Les manques sont signalés</CheckItem>
      </>
    }
  >
    <div style={{ fontFamily: mono, fontSize: 18, lineHeight: 1.55, background: '#FFFBEA', borderRadius: 10, padding: '10px 14px', color: C.soft }}>
      réu archives 08/11 – Garnier, Petit, Nadia, Leroy (SI)
      <br />- déménagement archives sous-sol → box ext., janvier ?
      <br />- tri avant : Petit propose 2 j, ok Garnier
      <br />- devis transport : Nadia, 2 devis min, avt 25/11
      <br />- docs RH : à part, Leroy voit avec juriste
      <br />- budget pas évoqué / reparler
    </div>
    <Bonus>Demandez ensuite un email de diffusion du CR aux participants, 60 mots.</Bonus>
  </LabPage>
);

// ═══ 50-m5 ═════════════════════════════════════════════════════════════

// ─── Module 5 · IA et organisation du travail ───────────────────────────────
const M5_Section: Page = () => (
  <Section
    n={5}
    title={
      <>
        IA et organisation
        <br />
        du travail
      </>
    }
    sub="Planifier une journée, prioriser, préparer une réunion, bâtir une checklist ou un planning : l’IA propose une structure, vous arbitrez."
    dur="14:30 – 15:10 · exercices inclus"
  >
    <SecItem n={1}>Organiser une journée, prioriser les tâches</SecItem>
    <SecItem n={2}>Préparer une réunion et ses agendas</SecItem>
    <SecItem n={3}>Créer une checklist, construire un planning</SecItem>
    <SecItem n={4}>Générer des modèles réutilisables</SecItem>
  </Section>
);
M5_Section.transition = BLOOM;

// ─── Prioriser (matrice urgent / important, glisser-déposer) ────────────────
const M5Quad = ({ x, y, tone, title, verb, sol }: { x: number; y: number; tone: Tone; title: string; verb: string; sol: string }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 540, height: 340, boxSizing: 'border-box', borderRadius: 18, background: T[tone].bg, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, padding: '14px 20px' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: T[tone].fg }}>{title}</span>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 18, letterSpacing: '0.12em', textTransform: 'uppercase', color: STRONG[tone] }}>{verb}</span>
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 20, right: 20, bottom: 12, display: 'flex', alignItems: 'center', gap: 10, fontSize: 21, fontWeight: 700, color: T[tone].fg }}>
      <Icon name="checkCircle" size={24} color={STRONG[tone]} /> {sol}
    </div>
  </div>
);

const M5Chip = ({ n, y, children }: { n: number; y: number; children: ReactNode }) => (
  <Drag x={120} y={y} w={500} tone="navy" size={20}>
    <Num n={n} tone="navy" size={30} />
    <span>{children}</span>
  </Drag>
);

const M5_Prioriser: Page = () => (
  <Frame mod={5} kind="exercice" beats={1}>
    <Title size={46}>Prioriser : la matrice urgent / important</Title>
    <Eyebrow c={C.coral} size={18} cls={A.fade} style={{ position: 'absolute', left: 720, top: 158 }}>
      ← Urgent
    </Eyebrow>
    <Eyebrow c={C.blue} size={18} cls={A.fade} style={{ position: 'absolute', left: 1280, top: 158 }}>
      Pas urgent →
    </Eyebrow>
    <M5Quad x={700} y={190} tone="coral" title="Urgent et important" verb="Faire" sol="2 · 5" />
    <M5Quad x={1260} y={190} tone="blue" title="Important, pas urgent" verb="Planifier" sol="3 · 7" />
    <M5Quad x={700} y={550} tone="yellow" title="Urgent, pas important" verb="Déléguer" sol="1 · 8" />
    <M5Quad x={1260} y={550} tone="grey" title="Ni l’un ni l’autre" verb="Abandonner" sol="4 · 6" />
    <M5Chip n={1} y={200}>Réserver un taxi pour un visiteur à 11 h</M5Chip>
    <M5Chip n={2} y={272}>Dossier de subvention à déposer ce soir</M5Chip>
    <M5Chip n={3} y={344}>Mettre à jour la procédure d’accueil</M5Chip>
    <M5Chip n={4} y={416}>Trier les newsletters non lues</M5Chip>
    <M5Chip n={5} y={488}>Client important furieux au téléphone</M5Chip>
    <M5Chip n={6} y={560}>Reclasser les vieux dossiers de 2015 par couleur</M5Chip>
    <M5Chip n={7} y={632}>Préparer le séminaire de mars</M5Chip>
    <M5Chip n={8} y={704}>Commander des capsules de café</M5Chip>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 790, width: 500, ...dl(400) }}>
      <Callout title="Le prompt" tone="violet" icon="chat" size={20}>
        « Classe ces tâches dans la matrice urgent / important. Pour chaque tâche, une phrase de justification. Signale celles où tu manques d’information. »
      </Callout>
    </div>
  </Frame>
);

// ─── Organiser une journée ──────────────────────────────────────────────────
const M5_DAY: [string, string, Tone, number][] = [
  ['8:30', 'Emails urgents et appels (30 min)', 'yellow', 1],
  ['9:00', 'Dossier de subvention : bloc sans interruption', 'coral', 1],
  ['11:00', 'Taxi du visiteur · accueil', 'yellow', 2],
  ['11:30', 'Rappel du client mécontent (préparé avec A·R·S·S)', 'coral', 2],
  ['14:00', 'Préparation du séminaire : devis traiteur', 'blue', 3],
  ['16:00', 'Emails non urgents, classement', 'grey', 3],
  ['16:45', 'Bilan et liste de demain', 'green', 3],
];

const M5_Journee: Page = () => (
  <Frame mod={5} beats={4}>
    <Title>Organiser sa journée avec l’IA</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 640 }}>
      <Bubble who="user" w={600} size={21}>
        Voici mes tâches du jour et mes contraintes : réunion de 10 h à 11 h, pause déjeuner 12 h 30 – 13 h 30, je pars à 17 h 30. Propose un planning heure par heure. Les tâches importantes le matin, des blocs de concentration de 1 h 30 maximum, 15 min de marge l’après-midi.
      </Bubble>
      <div className={b.on(4)} style={{ marginTop: 24 }}>
        <Callout title="Vous gardez la main" tone="blue" icon="hand" size={21}>
          L’IA ne connaît ni votre énergie, ni les imprévus de votre directeur : le planning est une proposition à ajuster.
        </Callout>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 820, top: 200, width: 980, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {M5_DAY.map(([h, t, tone, n]) => (
        <div key={h} className={b.left(n)} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.card, borderRadius: 14, boxShadow: `${SHADOW_SM}, inset 6px 0 0 ${STRONG[tone]}`, padding: '13px 20px' }}>
          <span style={{ width: 80, fontFamily: mono, fontSize: 22, fontWeight: 700, color: STRONG[tone] }}>{h}</span>
          <span style={{ fontSize: 23, color: C.ink }}>{t}</span>
        </div>
      ))}
      <div className={b.fade(3)} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, marginTop: 6 }}>
        <Icon name="alert" size={24} color={C.amber} /> Les newsletters et le classement de 2015 ? Repoussés : ni urgents ni importants.
      </div>
    </div>
  </Frame>
);

// ─── Préparer une réunion (onglets) ─────────────────────────────────────────
const M5Prep = ({ prompt, children }: { prompt: string; children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '560px 1fr', gap: 28 }}>
    <Bubble who="user" w={520} size={21}>
      {prompt}
    </Bubble>
    <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 28px', fontSize: 22, lineHeight: 1.5, color: C.ink }}>{children}</div>
  </div>
);

const M5Ag = ({ t, d, who }: { t: string; d: string; who: string }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 170px', gap: 14, padding: '6px 0', borderBottom: `1.5px solid ${C.rule}` }}>
    <span style={{ fontFamily: mono, fontWeight: 700, color: C.green }}>{d}</span>
    <span>{t}</span>
    <span style={{ color: C.muted }}>{who}</span>
  </div>
);

const M5_Reunion: Page = () => (
  <Frame mod={5} kind="demo">
    <Title>Préparer une réunion : avant, pendant, après</Title>
    <Lede>Comité de direction mensuel · 1 h 30 · 6 participants · trois moments où l’IA vous aide.</Lede>
    <Tabs initial="avant" cls={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <TabBtn id="avant" tone="green" icon="calendar">
          Avant · l’ordre du jour
        </TabBtn>
        <TabBtn id="pendant" tone="blue" icon="note">
          Pendant · la trame de notes
        </TabBtn>
        <TabBtn id="apres" tone="violet" icon="send">
          Après · le suivi
        </TabBtn>
      </div>
      <TabPane id="avant">
        <M5Prep prompt="Prépare l’ordre du jour du comité de direction (1 h 30). Sujets : résultats d’octobre, séminaire de mars, recrutement d’un commercial, divers. Minutage, responsable et objectif (informer / décider) par point.">
          <M5Ag d="10’" t="Validation du CR précédent · informer" who="M. Garnier" />
          <M5Ag d="25’" t="Résultats d’octobre · informer" who="Mme Roux" />
          <M5Ag d="25’" t="Séminaire de mars · décider du budget" who="Nadia" />
          <M5Ag d="20’" t="Recrutement commercial · décider du profil" who="M. Petit" />
          <M5Ag d="10’" t="Divers et prochaine date" who="Tous" />
        </M5Prep>
      </TabPane>
      <TabPane id="pendant">
        <M5Prep prompt="À partir de cet ordre du jour, crée une trame de prise de notes : pour chaque point, des cases « décision », « action / qui / quand », « questions ouvertes ».">
          <div style={{ fontFamily: mono, fontSize: 20, lineHeight: 1.7, color: C.soft }}>
            3. Séminaire de mars (25’)
            <br />
            {'   '}Décision : ______________________
            <br />
            {'   '}Action / qui / quand : __________
            <br />
            {'   '}Questions ouvertes : ____________
          </div>
          <div style={{ marginTop: 10, fontSize: 20, color: C.green, fontWeight: 600 }}>→ Des notes déjà rangées = un compte rendu en 5 minutes.</div>
        </M5Prep>
      </TabPane>
      <TabPane id="apres">
        <M5Prep prompt="À partir de mes notes : 1) le compte rendu (module 4) ; 2) un email de diffusion de 60 mots ; 3) un message de rappel pour chaque responsable d’action, 2 jours avant l’échéance.">
          <Bullet size={22} tone="violet">Compte rendu structuré, à relire avec les notes.</Bullet>
          <Bullet size={22} tone="violet">Email de diffusion avec le CR en pièce jointe.</Bullet>
          <Bullet size={22} tone="violet">Rappels personnalisés à programmer dans votre messagerie (envoi différé).</Bullet>
        </M5Prep>
      </TabPane>
    </Tabs>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 830, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.soft, ...dl(400) }}>
      <Icon name="bulb" size={28} color={C.violet} />
      <span>Un ordre du jour qui distingue <strong style={{ color: C.navy }}>informer</strong> et <strong style={{ color: C.navy }}>décider</strong> raccourcit les réunions.</span>
    </div>
  </Frame>
);

// ─── Créer une checklist (interactive) ──────────────────────────────────────
const M5_Checklist: Page = () => (
  <Frame mod={5} kind="exercice">
    <Title>Créer une checklist : l’arrivée d’un nouveau salarié</Title>
    <Lede>« Crée la checklist d’accueil d’un nouveau commercial, de J − 7 à J + 7, regroupée par moment. Une ligne = une action vérifiable. »</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 300, width: 1150, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 30px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Eyebrow c={C.blue} size={18}>
            J − 7 · avant l’arrivée
          </Eyebrow>
          <CheckItem id="m5-1" size={23} tone="blue">Commander poste, téléphone et badge</CheckItem>
          <CheckItem id="m5-2" size={23} tone="blue">Créer les comptes informatiques</CheckItem>
          <CheckItem id="m5-3" size={23} tone="blue">Envoyer le mail de bienvenue</CheckItem>
          <Eyebrow c={C.green} size={18} style={{ marginTop: 8 }}>
            Jour J
          </Eyebrow>
          <CheckItem id="m5-4" size={23}>Accueil et visite des locaux</CheckItem>
          <CheckItem id="m5-5" size={23}>Remise du livret d’accueil</CheckItem>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <CheckItem id="m5-6" size={23}>Déjeuner avec l’équipe</CheckItem>
          <Eyebrow c={C.violet} size={18} style={{ marginTop: 8 }}>
            J + 1 à J + 7
          </Eyebrow>
          <CheckItem id="m5-7" size={23} tone="violet">Planifier les rendez-vous avec chaque service</CheckItem>
          <CheckItem id="m5-8" size={23} tone="violet">Formation au logiciel CRM</CheckItem>
          <CheckItem id="m5-9" size={23} tone="violet">Point d’étonnement à J + 7 avec le manager</CheckItem>
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 300, width: 470, ...dl(300) }}>
        <CheckScore
          max={9}
          label="Avancement de l’accueil"
          levels={[
            { min: 0, text: 'Tout reste à faire.', tone: 'grey' },
            { min: 3, text: 'Les préparatifs avancent.', tone: 'blue' },
            { min: 6, text: 'Presque prêt !', tone: 'yellow' },
            { min: 9, text: 'Accueil réussi.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 21, lineHeight: 1.45, color: C.muted }}>
          Demandez ensuite : « Qu’ai-je oublié ? » L’IA suggère souvent les accès, la mutuelle ou la carte de visite.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Construire un planning (rétroplanning) ─────────────────────────────────
const M5_WEEKS = ['S−12', 'S−10', 'S−8', 'S−6', 'S−4', 'S−2', 'J'];
const M5_TASKS: [string, number, number, Tone, number][] = [
  ['Valider budget et date', 0, 1, 'navy', 1],
  ['Réserver lieu et traiteur', 1, 2, 'blue', 1],
  ['Construire le programme', 2, 3, 'green', 2],
  ['Envoyer les invitations', 3, 1, 'violet', 2],
  ['Relancer les non-réponses', 4, 1, 'yellow', 3],
  ['Logistique : badges, supports', 5, 1, 'teal', 3],
];

const M5_Planning: Page = () => (
  <Frame mod={5} beats={4}>
    <Title>Construire un planning : le rétroplanning du séminaire</Title>
    <Lede>« Construis le rétroplanning d’un séminaire de 35 personnes le 20 mars : tâches, durée, ordre. Tableau prêt pour Excel. »</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 290, width: 1680, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 28px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', alignItems: 'center' }}>
        <span />
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${M5_WEEKS.length}, 1fr)`, fontFamily: mono, fontSize: 19, color: C.muted }}>
          {M5_WEEKS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
      </div>
      {M5_TASKS.map(([t, s, d, tone, n]) => (
        <div key={t} style={{ display: 'grid', gridTemplateColumns: '400px 1fr', alignItems: 'center', height: 62, borderTop: `1.5px solid ${C.rule}` }}>
          <span style={{ fontSize: 23, color: C.ink }}>{t}</span>
          <div style={{ position: 'relative', height: 30 }}>
            <div className={b.grow(n)} style={{ position: 'absolute', left: `${(s / M5_WEEKS.length) * 100}%`, width: `${(d / M5_WEEKS.length) * 100}%`, top: 0, bottom: 0, borderRadius: 8, background: STRONG[tone] }} />
          </div>
        </div>
      ))}
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 800, width: 1680 }}>
      <Callout title="À vérifier" tone="yellow" icon="calendar" size={22}>
        Les vacances scolaires, les jours fériés et les délais réels de vos prestataires : l’IA propose des durées types, <strong>pas les vôtres</strong>.
      </Callout>
    </div>
  </Frame>
);

// ─── Modèles réutilisables (cartes) ─────────────────────────────────────────
const M5Tpl = ({ icon, tone, title, desc, ex }: { icon: IconName; tone: Tone; title: string; desc: string; ex: string }) => (
  <FlipCard
    w={536}
    h={280}
    tone={tone}
    backTone={tone}
    front={
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <IconTile name={icon} tone={tone} size={56} />
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 29, color: C.navy }}>{title}</div>
        </div>
        <div style={{ marginTop: 14, fontSize: 23, lineHeight: 1.42, color: C.soft }}>{desc}</div>
      </>
    }
    back={
      <>
        <Eyebrow c={T[tone].fg} size={17}>
          Demande pour créer le modèle
        </Eyebrow>
        <div style={{ marginTop: 10, fontSize: 22, lineHeight: 1.45, color: C.ink, fontStyle: 'italic' }}>{ex}</div>
      </>
    }
  />
);

const M5_Modeles: Page = () => (
  <Frame mod={5} kind="exercice">
    <Title>Générer des modèles réutilisables</Title>
    <Lede>Ce que vous refaites chaque mois mérite un modèle. Cliquez une carte pour voir comment le faire créer.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 536px)', gap: 36, rowGap: 30 }}>
      <M5Tpl icon="calendar" tone="green" title="Ordre du jour" desc="Une trame avec minutage, objectif et responsable par point." ex="« Crée un modèle d’ordre du jour avec des [CHAMPS] pour : date, participants, points, durée, objectif. »" />
      <M5Tpl icon="doc" tone="navy" title="Compte rendu" desc="Les 6 rubriques, prêtes à remplir pendant la réunion." ex="« Crée un modèle Word de compte rendu en 6 rubriques, avec un tableau d’actions qui / quoi / quand. »" />
      <M5Tpl icon="mail" tone="teal" title="Emails types" desc="Confirmation de rendez-vous, accusé de réception, relance." ex="« Rédige 5 emails types d’accusé de réception, avec des [CHAMPS] pour le nom, l’objet et le délai. »" />
      <M5Tpl icon="checkCircle" tone="violet" title="Checklists" desc="Accueil, déplacement, événement, clôture de mois." ex="« Crée la checklist d’organisation d’un déplacement professionnel : transport, hôtel, documents, notes de frais. »" />
      <M5Tpl icon="table" tone="yellow" title="Tableaux de suivi" desc="Courriers, contrats, échéances, fournitures." ex="« Propose les colonnes d’un tableau de suivi des contrats : prestataire, objet, échéance, préavis, responsable. »" />
      <M5Tpl icon="book" tone="blue" title="Procédures" desc="La mémoire du poste, utile en cas d’absence." ex="« Transforme mes explications en procédure numérotée pour mon remplaçant pendant mes congés. »" />
    </div>
  </Frame>
);

// ─── Quiz M5 ────────────────────────────────────────────────────────────────
const M5_Quiz: Page = () => (
  <Frame mod={5} kind="quiz">
    <Title>Quiz : organisation du travail</Title>
    <QuizSeries y={220}>
      <QuizQ q="« Préparer le séminaire de mars » se range dans quel quadrant ?" explain="C’est important (l’événement engage l’entreprise) mais pas urgent aujourd’hui : on le planifie, sinon il deviendra urgent.">
        <QOpt>Urgent et important : je fais tout maintenant</QOpt>
        <QOpt ok>Important, pas urgent : je planifie</QOpt>
        <QOpt>Ni l’un ni l’autre : j’abandonne</QOpt>
      </QuizQ>
      <QuizQ q="Pour qu’un planning proposé par l’IA soit utile, il faut d’abord lui donner…" explain="Sans vos contraintes (réunions, horaires, échéances), l’IA produit une journée théorique qui ne tient pas compte de votre agenda réel.">
        <QOpt>Votre mot de passe d’agenda</QOpt>
        <QOpt ok>Vos tâches et vos contraintes horaires</QOpt>
        <QOpt>Rien, elle connaît les bonnes pratiques</QOpt>
      </QuizQ>
      <QuizQ q="Quelle question poser à l’IA après avoir créé une checklist ?" explain="« Qu’ai-je oublié ? » fait relire la liste sous un autre angle et fait souvent remonter des points manquants.">
        <QOpt ok>« Qu’ai-je oublié ? »</QOpt>
        <QOpt>« Es-tu sûre ? »</QOpt>
        <QOpt>« Peux-tu la raccourcir ? »</QOpt>
      </QuizQ>
      <QuizQ q="Un ordre du jour efficace précise pour chaque point…" explain="Durée, responsable et objectif (informer ou décider) : chacun sait ce qu’on attend de lui, et la réunion tient dans le temps.">
        <QOpt>Uniquement le titre</QOpt>
        <QOpt ok>La durée, le responsable et l’objectif (informer / décider)</QOpt>
        <QOpt>Les noms des absents</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ═══ 60-m6 ═════════════════════════════════════════════════════════════

// ─── Module 6 · IA, tableaux et données ─────────────────────────────────────
const M6_Section: Page = () => (
  <Section
    n={6}
    title={
      <>
        IA, tableaux
        <br />
        et données
      </>
    }
    sub="Analyser un tableau, repérer des tendances, nettoyer, structurer, préparer un reporting : l’IA commente, le tableur calcule."
    dur="15:20 – 16:00 · exercices inclus"
  >
    <SecItem n={1}>Analyser un tableau, identifier des tendances</SecItem>
    <SecItem n={2}>Nettoyer des données simples</SecItem>
    <SecItem n={3}>Transformer des données en synthèse</SecItem>
    <SecItem n={4}>Créer des tableaux structurés, préparer un reporting</SecItem>
  </Section>
);
M6_Section.transition = BLOOM;

// ─── Données partagées du module ────────────────────────────────────────────
const M6_ROWS: [string, number, number, number][] = [
  ['Commercial', 1240, 1310, 1980],
  ['Administration', 820, 640, 860],
  ['Production', 2100, 1950, 2230],
  ['RH', 310, 290, 1150],
];
const M6_COL = [0, 1, 2].map((j) => M6_ROWS.reduce((s, r) => s + (r[j + 1] as number), 0));
const M6_TOTAL = M6_COL.reduce((s, x) => s + x, 0);

const M6Table = ({ hiRow, w = 900 }: { hiRow?: number; w?: number }) => (
  <div style={{ width: w, background: C.card, borderRadius: 16, boxShadow: SHADOW, overflow: 'hidden', fontSize: 22 }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1fr', background: C.navy, color: '#fff', fontFamily: display, fontWeight: 700, fontSize: 19 }}>
      {['Service', 'Juillet', 'Août', 'Sept.', 'Total'].map((h) => (
        <span key={h} style={{ padding: '12px 16px', textAlign: h === 'Service' ? 'left' : 'right' }}>
          {h}
        </span>
      ))}
    </div>
    {M6_ROWS.map((r, i) => (
      <div key={r[0]} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1fr', borderBottom: `1.5px solid ${C.rule}`, background: hiRow === i ? T.yellow.bg : 'transparent' }}>
        <span style={{ padding: '11px 16px', fontWeight: 600, color: C.ink }}>{r[0]}</span>
        {[r[1], r[2], r[3], r[1] + r[2] + r[3]].map((v, j) => (
          <span key={j} style={{ padding: '11px 16px', textAlign: 'right', fontFamily: mono, fontSize: 20, color: j === 3 ? C.navy : C.soft, fontWeight: j === 3 ? 700 : 400 }}>
            {fr(v)} €
          </span>
        ))}
      </div>
    ))}
    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1fr', background: C.panel }}>
      <span style={{ padding: '11px 16px', fontWeight: 800, color: C.navy }}>Total</span>
      {[...M6_COL, M6_TOTAL].map((v, j) => (
        <span key={j} style={{ padding: '11px 16px', textAlign: 'right', fontFamily: mono, fontSize: 20, fontWeight: 700, color: C.navy }}>
          {fr(v)} €
        </span>
      ))}
    </div>
  </div>
);

// ─── Analyser un tableau ────────────────────────────────────────────────────
const M6_Analyser: Page = () => (
  <Frame mod={6} beats={4}>
    <Title>Analyser un tableau : ce que l’IA voit… et ce qu’elle rate</Title>
    <Lede>Dépenses de fournitures par service, 3e trimestre (données fictives). « Analyse ce tableau en 4 points. »</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 280 }}>
      <M6Table hiRow={3} w={900} />
    </div>
    <div style={{ position: 'absolute', left: 1080, top: 280, width: 720, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Card tone="blue" icon="trend" title="Septembre en forte hausse" cls={b.on(1)} size={21} pad={22}>
        + 48 % par rapport à août, tous services confondus.
      </Card>
      <Card tone="yellow" icon="alert" title="RH : × 4 en septembre" cls={b.on(2)} size={21} pad={22}>
        Dépense inhabituelle. <em>Hypothèse</em> : le salon de recrutement ? À vérifier.
      </Card>
      <Card tone="green" icon="chart" title="La production pèse 42 %" cls={b.on(3)} size={21} pad={22}>
        Premier poste de dépense, stable sur le trimestre.
      </Card>
      <div className={b.pop(4)} style={{ background: T.coral.bg, borderRadius: 16, boxShadow: `inset 0 0 0 2px ${T.coral.bd}`, padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <Icon name="x" size={30} color={C.coral} />
        <div style={{ fontSize: 21, lineHeight: 1.4, color: C.ink }}>
          « Total du trimestre : <strong>14 980 €</strong>. » <strong style={{ color: T.coral.fg }}>Faux</strong> : le tableur dit {fr(M6_TOTAL)} €. L’IA a mal additionné.
        </div>
      </div>
    </div>
    <div className={b.fade(4)} style={{ position: 'absolute', left: 120, top: 800, width: 900, fontSize: 23, lineHeight: 1.45, color: C.soft, display: 'flex', gap: 14, alignItems: 'center' }}>
      <Icon name="shieldCheck" size={30} color={C.green} />
      <span>L’IA est bonne pour <strong style={{ color: C.navy }}>commenter</strong>. Pour <strong style={{ color: C.navy }}>calculer</strong>, faites confiance aux formules.</span>
    </div>
  </Frame>
);

// ─── Identifier des tendances (graphique) ───────────────────────────────────
const M6_MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const M6_REQ = [118, 112, 131, 138, 135, 149, 96, 58, 162, 171, 178, 139];

const M6_Tendances: Page = () => {
  const max = 200;
  return (
    <Frame mod={6} beats={3}>
      <Title>Identifier des tendances</Title>
      <Lede>Demandes reçues à l’accueil par mois (fictif). « Quelles tendances vois-tu ? Distingue saisonnalité et évolution. Toute explication doit être présentée comme une hypothèse. »</Lede>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 320, width: 1060, height: 520, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 30px 20px', boxSizing: 'border-box' }}>
        <div style={{ position: 'relative', height: 400, display: 'flex', alignItems: 'flex-end', gap: 18, borderBottom: `2px solid ${C.rule}` }}>
          {M6_REQ.map((v, i) => {
            const summer = i === 6 || i === 7;
            const autumn = i >= 8 && i <= 10;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <span style={{ fontFamily: mono, fontSize: 16, color: C.muted, marginBottom: 6 }}>{v}</span>
                <div className={A.growY} style={{ width: '100%', height: `${(v / max) * 340}px`, borderRadius: '8px 8px 0 0', background: summer ? STRONG.yellow : autumn ? STRONG.violet : STRONG.blue, ...dl(200 + i * 60) }} />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: 10 }}>
          {M6_MONTHS.map((m, i) => (
            <span key={i} style={{ flex: 1, textAlign: 'center', fontFamily: mono, fontSize: 18, color: C.muted }}>
              {m}
            </span>
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 1240, top: 320, width: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card tone="blue" icon="trend" title="Évolution" cls={b.on(1)} size={21} pad={22}>
          Hausse régulière de janvier à juin : environ + 25 %.
        </Card>
        <Card tone="yellow" icon="calendar" title="Saisonnalité" cls={b.on(2)} size={21} pad={22}>
          Creux en juillet-août (fermeture estivale ?), à comparer avec l’an dernier.
        </Card>
        <Card tone="violet" icon="bolt" title="Pic d’automne" cls={b.on(3)} size={21} pad={22}>
          Septembre à novembre au plus haut : renfort d’accueil à prévoir ?
        </Card>
      </div>
      <div className={b.fade(3)} style={{ position: 'absolute', left: 1240, top: 905, width: 560, fontSize: 21, color: C.muted, lineHeight: 1.4 }}>
        Les « ? » sont voulus : l’IA voit les chiffres, pas les causes.
      </div>
    </Frame>
  );
};

// ─── Nettoyer des données simples ───────────────────────────────────────────
const M6_DIRTY = [
  ['DURAND marie', '06.12.34.56.78', '3/1/25', 'nantes'],
  ['Marie Durand', '0612345678', '03/01/2025', 'Nantes'],
  ['lefèvre Paul ', '+33 6 98 76 54 32', '2025-01-15', ''],
  ['Sophie  MARTIN', '06 11 22 33 44', '15 janv.', 'REZÉ'],
];
const M6_CLEAN = [
  ['Durand', 'Marie', '06 12 34 56 78', '03/01/2025', 'Nantes'],
  ['Lefèvre', 'Paul', '06 98 76 54 32', '15/01/2025', '[À COMPLÉTER]'],
  ['Martin', 'Sophie', '06 11 22 33 44', '15/01/2025 ?', 'Rezé'],
];

const M6_Nettoyer: Page = () => {
  const [clean, setClean] = useState(false);
  const rows = clean ? M6_CLEAN : M6_DIRTY;
  const head = clean ? ['Nom', 'Prénom', 'Téléphone', 'Inscription', 'Ville'] : ['Contact', 'Téléphone', 'Date', 'Ville'];
  const cols = clean ? '1fr 1fr 1.3fr 1.2fr 1.2fr' : '1.4fr 1.3fr 1fr 1fr';
  return (
    <Frame mod={6} kind="demo">
      <Title>Nettoyer des données simples</Title>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, display: 'flex', alignItems: 'center', gap: 30 }}>
        <Toggle on={clean} onChange={setClean} tone="green" size={28} label={<strong>« Nettoie cette liste : sépare nom et prénom, harmonise les formats, supprime les doublons, signale les manques »</strong>} />
      </div>
      <div key={clean ? 'c' : 'd'} className={A.fade} style={{ position: 'absolute', left: 120, top: 290, width: 1180, background: C.card, borderRadius: 18, boxShadow: SHADOW, overflow: 'hidden', animationDuration: '400ms' } as CSSProperties}>
        <div style={{ display: 'grid', gridTemplateColumns: cols, background: clean ? C.green : C.muted, color: '#fff', fontFamily: display, fontWeight: 700, fontSize: 19 }}>
          {head.map((h) => (
            <span key={h} style={{ padding: '12px 16px' }}>
              {h}
            </span>
          ))}
        </div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: cols, borderBottom: `1.5px solid ${C.rule}`, fontSize: 22 }}>
            {r.map((c, j) => (
              <span key={j} style={{ padding: '12px 16px', fontFamily: mono, fontSize: 20, color: c.startsWith('[') || c.endsWith('?') ? C.coral : c === '' ? C.faint : C.ink, whiteSpace: 'pre' }}>
                {c === '' ? '—' : c}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 1360, top: 290, width: 440, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card tone="green" icon="checkCircle" title="Ce qu’elle fait bien" size={21} pad={22} cls={A.right}>
          Majuscules, espaces, formats de téléphone et de date, doublons évidents.
        </Card>
        <Card tone="coral" icon="alert" title="Ce qu’il faut vérifier" size={21} pad={22} cls={A.right} style={dl(150)}>
          « 15 janv. » : quelle année ? Elle a supposé 2025 et l’a signalé. Toujours contrôler les suppositions.
        </Card>
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(400) }}>
        <Callout title="Données personnelles" tone="coral" icon="lock" size={22}>
          Une vraie liste de contacts ne se colle pas dans un assistant grand public. Demandez plutôt <strong>la méthode ou les formules</strong> (SUPPRESPACE, NOMPROPRE…) et appliquez-les vous-même dans Excel.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Transformer des données en synthèse ────────────────────────────────────
const M6_Synthese: Page = () => (
  <Frame mod={6} beats={3}>
    <Title>Transformer des données en synthèse</Title>
    <Lede>« À partir de ce tableau, rédige une synthèse de 5 lignes pour le directeur administratif et financier. Chiffres arrondis, une recommandation. »</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 300 }}>
      <M6Table w={760} />
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 940, top: 300, width: 860, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 30px', ...dl(200) }}>
      <Eyebrow c={C.navy} size={19}>
        Synthèse · fournitures T3
      </Eyebrow>
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 23, lineHeight: 1.5, color: C.ink }}>
        <div className={b.fade(1)}>
          Les dépenses de fournitures du 3e trimestre atteignent <strong>environ 14 900 €</strong>, dont plus de 40 % pour la production.
        </div>
        <div className={b.fade(2)}>
          Septembre concentre 42 % du trimestre, porté par le commercial et surtout les RH (dépense multipliée par quatre).
        </div>
        <div className={b.fade(3)} style={{ background: T.green.bg, borderRadius: 12, padding: '10px 14px' }}>
          <strong style={{ color: T.green.fg }}>Recommandation</strong> : vérifier la dépense RH de septembre et fixer un budget trimestriel par service.
        </div>
      </div>
    </div>
    <div className={b.fade(3)} style={{ position: 'absolute', left: 940, top: 800, width: 860, fontSize: 21, color: C.muted, display: 'flex', alignItems: 'center', gap: 12 }}>
      <Icon name="eye" size={26} color={C.blue} /> Avant d’envoyer : chaque chiffre de la synthèse se retrouve dans le tableau.
    </div>
  </Frame>
);

// ─── Créer des tableaux structurés (texte → tableau + formule) ──────────────
const M6_Structurer: Page = () => (
  <Frame mod={6} beats={3}>
    <Title>Créer des tableaux structurés… et leurs formules</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 200, width: 760 }}>
      <Eyebrow c={C.navy} size={19} style={{ marginBottom: 12 }}>
        Trois emails d’inscription à la formation sécurité
      </Eyebrow>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 21, lineHeight: 1.45, color: C.soft, fontStyle: 'italic' }}>
        <div style={{ background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '10px 16px' }}>« Je m’inscris pour la session du 4 décembre. Paul, service production. Je serai en fauteuil. »</div>
        <div style={{ background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '10px 16px' }}>« Inscription de Lina Haddad, commerciale, session du 11/12. »</div>
        <div style={{ background: C.card, borderRadius: 12, boxShadow: SHADOW_SM, padding: '10px 16px' }}>« Bonjour, Hugo de l’admin, le 4 si possible, sinon le 11. »</div>
      </div>
      <div className={A.fade} style={{ marginTop: 16, ...dl(300) }}>
        <Bubble who="user" w={720} size={20}>
          Range ces inscriptions dans un tableau : nom, prénom, service, session, besoin particulier. Une info absente = « ? ».
        </Bubble>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 940, top: 230, width: 860 }}>
      <div className={b.on(1)} style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW, overflow: 'hidden', fontSize: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.9fr 1fr 1fr 1.3fr', background: C.navy, color: '#fff', fontFamily: display, fontWeight: 700, fontSize: 18 }}>
          {['Nom', 'Prénom', 'Service', 'Session', 'Besoin'].map((h) => (
            <span key={h} style={{ padding: '10px 14px' }}>
              {h}
            </span>
          ))}
        </div>
        {[
          ['?', 'Paul', 'Production', '04/12', 'Accès PMR'],
          ['Haddad', 'Lina', 'Commercial', '11/12', '—'],
          ['?', 'Hugo', 'Administration', '04/12 ou 11/12', '—'],
        ].map((r) => (
          <div key={r[1]} style={{ display: 'grid', gridTemplateColumns: '1fr 0.9fr 1fr 1fr 1.3fr', borderBottom: `1.5px solid ${C.rule}` }}>
            {r.map((c, j) => (
              <span key={j} style={{ padding: '10px 14px', color: c === '?' || c.includes(' ou ') ? C.coral : C.ink, fontWeight: c === '?' ? 700 : 400 }}>
                {c}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className={b.on(2)} style={{ marginTop: 22 }}>
        <Bubble who="user" w={820} size={20}>
          Donne-moi la formule Excel qui compte les inscrits par session.
        </Bubble>
      </div>
      <div className={b.on(3)} style={{ marginTop: 14 }}>
        <CodeDark file="formule proposée" size={22}>
          <Cf>=NB.SI</Cf>(D2:D50; <Cs>"04/12"</Cs>)
        </CodeDark>
        <div style={{ marginTop: 10, fontSize: 20, color: C.muted }}>Testez-la sur 3 lignes dont vous connaissez le résultat avant de lui faire confiance.</div>
      </div>
    </div>
  </Frame>
);

// ─── Préparer un reporting ──────────────────────────────────────────────────
const M6Kpi = ({ v, label, delta, tone, d }: { v: ReactNode; label: string; delta: string; tone: Tone; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 6px 0 ${STRONG[tone]}`, padding: '20px 24px', ...dl(d) }}>
    <div style={{ fontSize: 20, color: C.muted }}>{label}</div>
    <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 56, lineHeight: 1, color: C.navy }}>{v}</div>
    <div style={{ marginTop: 8, fontSize: 20, fontWeight: 700, color: STRONG[tone] }}>{delta}</div>
  </div>
);

const M6_Reporting: Page = () => (
  <Frame mod={6} beats={2}>
    <Title>Préparer un reporting mensuel en 15 minutes</Title>
    <Lede>Les chiffres viennent du tableur. L’IA rédige le commentaire, dans un format identique chaque mois.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'flex', gap: 22 }}>
      <M6Kpi v={<CountUp to={171} />} label="Demandes reçues · octobre" delta="▲ + 6 % vs septembre" tone="blue" d={100} />
      <M6Kpi v={<CountUp to={94} suffix=" %" />} label="Traitées sous 48 h" delta="▲ + 3 points" tone="green" d={200} />
      <M6Kpi v={<CountUp to={12} />} label="Réclamations" delta="▼ − 4 vs septembre" tone="green" d={300} />
      <M6Kpi v={<CountUp to={2.4} digits={1} suffix=" j" />} label="Délai moyen de réponse" delta="▲ + 0,3 jour" tone="coral" d={400} />
    </div>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 500, width: 820 }}>
      <CodeDark file="prompt · reporting mensuel (modèle)" size={20} wrap>
        Voici les indicateurs de <Cn>[MOIS]</Cn> et du mois précédent : <Cn>[INDICATEURS]</Cn>.{'\n'}
        Rédige le commentaire du reporting : 3 faits marquants, 1 point de vigilance, 1 action proposée. 100 mots. N’utilise que ces chiffres ; ne recalcule rien.
      </CodeDark>
    </div>
    <div className={b.on(2)} style={{ position: 'absolute', left: 980, top: 500, width: 820, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 28px', fontSize: 22, lineHeight: 1.5, color: C.ink }}>
      <Eyebrow c={C.navy} size={18}>
        Commentaire généré
      </Eyebrow>
      <div style={{ marginTop: 8 }}>
        Octobre confirme le pic d’automne (171 demandes, + 6 %), avec un meilleur taux de traitement sous 48 h (94 %) et moins de réclamations (12).{' '}
        <strong style={{ color: C.coral }}>Vigilance</strong> : le délai moyen remonte à 2,4 jours. <strong style={{ color: C.green }}>Action</strong> : renfort d’accueil le lundi matin en novembre.
      </div>
    </div>
  </Frame>
);

// ─── Quiz M6 ────────────────────────────────────────────────────────────────
const M6_Quiz: Page = () => (
  <Frame mod={6} kind="quiz">
    <Title>Quiz : tableaux et données</Title>
    <QuizSeries y={220}>
      <QuizQ q="L’IA annonce un total de 14 980 €. Que faites-vous ?" explain="L’IA peut se tromper en additionnant. Le total se vérifie avec une formule (SOMME) dans le tableur, qui fait foi.">
        <QOpt>Je le reporte tel quel</QOpt>
        <QOpt ok>Je le vérifie avec une formule SOMME</QOpt>
        <QOpt>Je lui demande si elle est sûre</QOpt>
      </QuizQ>
      <QuizQ q="« Les demandes baissent en août à cause des congés. » Comment présenter cette phrase ?" explain="L’IA voit les chiffres, pas les causes. Une explication proposée par l’IA reste une hypothèse à confirmer.">
        <QOpt>Comme un fait établi</QOpt>
        <QOpt ok>Comme une hypothèse à vérifier</QOpt>
        <QOpt>Il faut la supprimer</QOpt>
      </QuizQ>
      <QuizQ q="Vous devez nettoyer un fichier de 2 000 contacts clients réels. Le bon réflexe ?" explain="Des données personnelles réelles ne vont pas dans un assistant non autorisé. On demande la méthode et les formules, puis on les applique soi-même dans le tableur.">
        <QOpt>Coller tout le fichier dans l’IA</QOpt>
        <QOpt ok>Demander la méthode et les formules, puis les appliquer dans Excel</QOpt>
        <QOpt>Envoyer le fichier par email à l’IA</QOpt>
      </QuizQ>
      <QuizQ q="Dans un prompt de reporting, pourquoi écrire « ne recalcule rien » ?" explain="On veut que l’IA commente les chiffres du tableur, pas qu’elle en produise de nouveaux, potentiellement faux.">
        <QOpt>Pour aller plus vite</QOpt>
        <QOpt ok>Pour qu’elle n’utilise que les chiffres fournis</QOpt>
        <QOpt>Parce qu’elle ne sait pas compter du tout</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ═══ 70-m7 ═════════════════════════════════════════════════════════════

// ─── Cas fil rouge, bonnes pratiques & clôture ──────────────────────────────
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
    sub="Une demande, du premier email jusqu’au suivi : toute la journée en un seul cas. Puis les règles pour utiliser l’IA en sécurité."
    dur="16:00 – 17:00 · atelier final"
    labs={
      <Tag tone="green" size={19}>
        Atelier final · de la demande au suivi
      </Tag>
    }
  >
    <SecItem n={1}>Réception → analyse → rédaction → document → synthèse → suivi</SecItem>
    <SecItem n={2}>Vérifier les résultats</SecItem>
    <SecItem n={3}>Confidentialité et données personnelles</SecItem>
    <SecItem n={4}>Bonnes pratiques professionnelles</SecItem>
  </Section>
);
M7_Section.transition = BLOOM;

// ─── Le cas : la chaîne en 6 étapes ─────────────────────────────────────────
const M7_CHAIN: { icon: IconName; tone: Tone; t: string; mod: string }[] = [
  { icon: 'inbox', tone: 'blue', t: 'Réception', mod: 'M1' },
  { icon: 'search', tone: 'yellow', t: 'Analyse', mod: 'M4' },
  { icon: 'mail', tone: 'teal', t: 'Rédaction', mod: 'M3' },
  { icon: 'doc', tone: 'navy', t: 'Document', mod: 'M4' },
  { icon: 'layers', tone: 'violet', t: 'Synthèse', mod: 'M6' },
  { icon: 'bell', tone: 'green', t: 'Suivi', mod: 'M5' },
];

const M7_Cas: Page = () => (
  <Frame mod={7} beats={6}>
    <Title>Le cas fil rouge : une demande arrive</Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 1680, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 30px', display: 'flex', gap: 24 }}>
      <IconTile name="mail" tone="blue" size={64} solid />
      <div style={{ fontSize: 23, lineHeight: 1.5, color: C.ink }}>
        <div style={{ fontSize: 19, color: C.muted }}>De : Mme Benali, services généraux, Cabinet Arvel · À : contact@ · Lundi 8 h 12</div>
        « Bonjour, nous emménageons dans de nouveaux locaux le 15 décembre et cherchons <strong>12 postes de travail complets</strong> (bureau, fauteuil, caisson), plus une table de réunion pour 8. Budget autour de 20 000 €. Pouvez-vous aussi <strong>reprendre nos anciens bureaux</strong> ? Il nous faudrait une proposition rapidement. »
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 470, width: 1680, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      {M7_CHAIN.map((c, i) => (
        <div key={c.t} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1 }}>
          <div className={b.pop(i + 1)} style={{ flex: 1, background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 6px 0 ${STRONG[c.tone]}`, padding: '22px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <IconTile name={c.icon} tone={c.tone} size={64} solid />
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: C.navy }}>{c.t}</div>
            <Tag tone="grey" size={17}>
              revu en {c.mod}
            </Tag>
          </div>
          {i < 5 ? <Icon name="arrow" size={28} color={C.faint} style={{ marginTop: 70 }} /> : null}
        </div>
      ))}
    </div>
    <div className={b.fade(6)} style={{ position: 'absolute', left: 120, top: 790, width: 1680 }}>
      <Callout title="Le principe" tone="blue" icon="route" size={23}>
        Un prompt par étape, chacun avec un résultat que <strong>vous relisez avant de passer au suivant</strong>. Une erreur à l’étape 2 se propage sinon jusqu’au client.
      </Callout>
    </div>
  </Frame>
);

// ─── Étape par étape (onglets) ──────────────────────────────────────────────
const M7Step = ({ prompt, children }: { prompt: string; children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '600px 1fr', gap: 28 }}>
    <Bubble who="user" w={560} size={21}>
      {prompt}
    </Bubble>
    <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 26px', fontSize: 21, lineHeight: 1.5, color: C.ink }}>{children}</div>
  </div>
);

const M7_Etapes: Page = () => (
  <Frame mod={7} kind="demo">
    <Title>Le cas, étape par étape</Title>
    <Tabs initial="s1" cls={A.in} style={{ position: 'absolute', left: 120, top: 190, width: 1680 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <TabBtn id="s1" tone="blue" icon="inbox">
          1 · Réception
        </TabBtn>
        <TabBtn id="s2" tone="yellow" icon="search">
          2 · Analyse
        </TabBtn>
        <TabBtn id="s3" tone="teal" icon="mail">
          3 · Rédaction
        </TabBtn>
        <TabBtn id="s4" tone="navy" icon="doc">
          4 · Document
        </TabBtn>
        <TabBtn id="s5" tone="violet" icon="layers">
          5 · Synthèse
        </TabBtn>
        <TabBtn id="s6" tone="green" icon="bell">
          6 · Suivi
        </TabBtn>
      </div>
      <TabPane id="s1">
        <M7Step prompt="Classe cette demande : type (devis, réclamation, information…), urgence (1 à 3) avec justification, service concerné.">
          <Bullet size={22} tone="blue"><strong>Type</strong> : demande de devis (+ question de reprise de mobilier)</Bullet>
          <Bullet size={22} tone="blue"><strong>Urgence</strong> : 2 : échéance 15 décembre, « rapidement »</Bullet>
          <Bullet size={22} tone="blue"><strong>Service</strong> : commercial (devis) + logistique (reprise)</Bullet>
        </M7Step>
      </TabPane>
      <TabPane id="s2">
        <M7Step prompt="Extrais les éléments de la demande dans un tableau. Liste ensuite les informations manquantes pour établir le devis.">
          <div style={{ fontFamily: mono, fontSize: 19, lineHeight: 1.65 }}>
            Postes complets · 12 · Table réunion · 8 places
            <br />
            Échéance · 15/12 · Budget · ≈ 20 000 €
            <br />
            Reprise anciens bureaux · demandée
          </div>
          <div style={{ marginTop: 8, color: C.coral, fontWeight: 600 }}>Manque : adresse de livraison, étage / ascenseur, gamme souhaitée, nombre de bureaux à reprendre.</div>
        </M7Step>
      </TabPane>
      <TabPane id="s3">
        <M7Step prompt="Rédige l’accusé de réception à Mme Benali : remercie, confirme un devis sous 48 h, pose les 4 questions manquantes. Ne t’engage ni sur la reprise ni sur le délai de livraison. 120 mots.">
          Bonjour Madame Benali, merci pour votre demande. Nous vous adresserons une proposition sous 48 heures. Pour l’établir au plus juste, pourriez-vous nous préciser : l’adresse de livraison, l’étage et l’accès (ascenseur), la gamme souhaitée, et le nombre de bureaux à reprendre ? Concernant la reprise, je reviens vers vous après étude par notre service logistique. Bien cordialement,
        </M7Step>
      </TabPane>
      <TabPane id="s4">
        <M7Step prompt="Crée une fiche de demande interne pour le commercial : client, contact, besoin détaillé, échéance, budget, points en attente, prochaine action.">
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '6px 16px' }}>
            <strong>Client</strong>
            <span>Cabinet Arvel · Mme Benali</span>
            <strong>Besoin</strong>
            <span>12 postes complets + table 8 places</span>
            <strong>Échéance</strong>
            <span>Livraison avant le 15/12</span>
            <strong>En attente</strong>
            <span style={{ color: C.coral }}>Adresse, accès, gamme, reprise</span>
            <strong>Action</strong>
            <span>Devis à envoyer avant mercredi 10 h</span>
          </div>
        </M7Step>
      </TabPane>
      <TabPane id="s5">
        <M7Step prompt="Résume ce dossier en 3 lignes pour M. Garnier, avec la décision qu’il doit prendre.">
          Nouvelle demande du Cabinet Arvel : 12 postes + table de réunion, environ 20 000 €, livraison avant le 15/12. Accusé de réception envoyé, devis sous 48 h.
          <div style={{ marginTop: 8, fontWeight: 700, color: C.violet }}>Décision : accepter ou non la reprise des anciens bureaux (non proposée à ce jour).</div>
        </M7Step>
      </TabPane>
      <TabPane id="s6">
        <M7Step prompt="Propose les étapes de suivi : ligne pour le tableau de suivi, relance si pas de réponse, rappel interne.">
          <Bullet size={22} tone="green">Tableau de suivi : Arvel · devis · envoyé le [DATE] · statut « attente infos »</Bullet>
          <Bullet size={22} tone="green">Relance client à J + 3 si pas de réponse (modèle « Relance 1 »)</Bullet>
          <Bullet size={22} tone="green">Rappel au commercial mercredi 9 h : devis à envoyer</Bullet>
        </M7Step>
      </TabPane>
    </Tabs>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 22, color: C.soft, ...dl(400) }}>
      <Icon name="shieldCheck" size={28} color={C.green} /> À l’étape 3, la contrainte « ne t’engage pas » évite une promesse que l’entreprise n’a pas décidée.
    </div>
  </Frame>
);

// ─── Atelier final ──────────────────────────────────────────────────────────
const M7_Atelier: Page = () => (
  <LabPage
    mod={7}
    n="5"
    title="Traiter une demande de bout en bout"
    defi="filrouge"
    who="En binôme"
    minutes={25}
    label="Cas fil rouge & bonnes pratiques"
    where={
      <>
        Les <strong>6 productions</strong> (classement, tableau, email, fiche, synthèse, suivi) et les <strong>prompts</strong> utilisés, à ranger dans votre bibliothèque.
      </>
    }
    objective={
      <>
        Appliquer toute la journée à une nouvelle demande : <strong>réception → analyse → rédaction → document → synthèse → suivi</strong>, en relisant chaque étape.
      </>
    }
    crit={
      <>
        <CheckItem id="a5-c1" size={21}>Les 6 étapes sont produites</CheckItem>
        <CheckItem id="a5-c2" size={21}>Les infos manquantes sont listées</CheckItem>
        <CheckItem id="a5-c3" size={21}>Aucun engagement non autorisé</CheckItem>
        <CheckItem id="a5-c4" size={21}>Chaque étape a été relue</CheckItem>
      </>
    }
  >
    <div style={{ background: T.blue.bg, borderRadius: 12, padding: '12px 16px', fontSize: 20, lineHeight: 1.5, color: C.ink, fontStyle: 'italic' }}>
      « Bonjour, je suis M. Caron, de l’école Jules-Verne. Trois de nos chaises livrées le mois dernier sont déjà cassées et nous voudrions aussi commander 30 chaises supplémentaires pour la rentrée de janvier. Que pouvez-vous faire ? »
    </div>
    <div style={{ marginTop: 10, fontSize: 21, color: C.soft }}>
      Attention : une <strong>réclamation</strong> et une <strong>commande</strong> dans le même message. Deux traitements, deux tons.
    </div>
    <Bonus>Présentez en 1 minute au groupe l’étape où l’IA vous a fait gagner le plus de temps.</Bonus>
  </LabPage>
);

// ─── Vérification des résultats ─────────────────────────────────────────────
const M7_Verifier: Page = () => (
  <Frame mod={7} kind="exercice">
    <Title>Vérifier avant d’utiliser : la grille en 6 points</Title>
    <Lede>À passer sur chaque texte produit par l’IA, en particulier ceux qui sortent de l’entreprise.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="v1" size={26} tone="blue">
          <strong>Les faits</strong> : chaque information figure dans mes sources
        </CheckItem>
        <CheckItem id="v2" size={26} tone="blue">
          <strong>Les chiffres</strong> : montants, dates, quantités recalculés ou recopiés
        </CheckItem>
        <CheckItem id="v3" size={26} tone="blue">
          <strong>Les noms</strong> : personnes, titres, orthographe, références
        </CheckItem>
        <CheckItem id="v4" size={26} tone="violet">
          <strong>Les engagements</strong> : aucune promesse que je ne peux pas tenir
        </CheckItem>
        <CheckItem id="v5" size={26} tone="violet">
          <strong>Le ton</strong> : adapté au destinataire et à la situation
        </CheckItem>
        <CheckItem id="v6" size={26} tone="coral">
          <strong>Les données</strong> : rien de confidentiel n’a été transmis ou recopié
        </CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={6}
          label="Prêt à envoyer ?"
          levels={[
            { min: 0, text: 'Pas encore : relisez.', tone: 'coral' },
            { min: 4, text: 'Presque : terminez la grille.', tone: 'yellow' },
            { min: 6, text: 'Vous pouvez signer.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 21, lineHeight: 1.45, color: C.muted }}>
          Plus l’enjeu est fort (client, juridique, finances), plus la vérification est poussée, et plus on la fait valider.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Confidentialité : le feu tricolore ─────────────────────────────────────
const M7Light = ({ n, tone, title, rule, items, x }: { n: number; tone: Tone; title: string; rule: string; items: string[]; x: number }) => (
  <div className={b.on(n)} style={{ position: 'absolute', left: x, top: 200, width: 540, height: 640, boxSizing: 'border-box', background: C.card, borderRadius: 20, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, padding: '26px 28px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <span style={{ width: 54, height: 54, borderRadius: 999, background: STRONG[tone], boxShadow: `0 0 0 8px ${T[tone].bg}` }} />
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: C.navy }}>{title}</span>
    </div>
    <div style={{ marginTop: 16, fontSize: 22, fontWeight: 600, color: T[tone].fg, lineHeight: 1.4 }}>{rule}</div>
    <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((it) => (
        <Bullet key={it} size={22} tone={tone}>
          {it}
        </Bullet>
      ))}
    </div>
  </div>
);

const M7_Confidentialite: Page = () => (
  <Frame mod={7} beats={3}>
    <Title>Confidentialité : le feu tricolore</Title>
    <M7Light
      n={1}
      x={120}
      tone="green"
      title="Vert"
      rule="Sans risque, avec tout outil autorisé"
      items={['Informations publiques', 'Textes génériques sans nom', 'Modèles, trames, procédures neutres', 'Questions de méthode (formules, plan)']}
    />
    <M7Light
      n={2}
      x={690}
      tone="yellow"
      title="Orange"
      rule="Uniquement avec l’outil professionnel, après anonymisation"
      items={['Emails clients ou fournisseurs', 'Comptes rendus internes', 'Tableaux de suivi, chiffres internes', 'Documents de travail']}
    />
    <M7Light
      n={3}
      x={1260}
      tone="coral"
      title="Rouge"
      rule="Jamais dans un assistant IA, sauf règle interne explicite"
      items={['Santé, salaires, RIB, n° de sécurité sociale', 'Mots de passe, codes d’accès', 'Données RH, sanctions, recrutement', 'Contrats et documents confidentiels']}
    />
    <div className={b.fade(3)} style={{ position: 'absolute', left: 120, top: 870, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.soft }}>
      <Icon name="book" size={28} color={C.blue} />
      <span>La règle qui prime : <strong style={{ color: C.navy }}>la politique de votre organisation</strong>. En cas de doute, on demande au service informatique ou au DPO.</span>
    </div>
  </Frame>
);

// ─── Anonymiser (interrupteur) ──────────────────────────────────────────────
const M7X = ({ on, real, fake }: { on: boolean; real: string; fake: string }) =>
  on ? <span style={{ background: T.green.bg, color: T.green.fg, fontWeight: 700, borderRadius: 6, padding: '0 6px' }}>{fake}</span> : <span style={{ background: T.coral.bg, color: T.coral.fg, fontWeight: 700, borderRadius: 6, padding: '0 6px' }}>{real}</span>;

const M7_Anonymiser: Page = () => {
  const [on, setOn] = useState(false);
  return (
    <Frame mod={7} kind="demo">
      <Title>Données personnelles : anonymiser avant de coller</Title>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 190, display: 'flex', alignItems: 'center', gap: 30 }}>
        <Toggle on={on} onChange={setOn} tone="green" size={28} label={<strong>Anonymiser le texte</strong>} />
        <Tag tone={on ? 'green' : 'coral'} size={22}>
          {on ? 'Prêt à être collé dans l’outil pro' : '5 données personnelles exposées'}
        </Tag>
      </div>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 290, width: 1180, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 34px', fontSize: 27, lineHeight: 1.7, color: C.ink, ...dl(150) }}>
        Rédige un courrier à <M7X on={on} real="M. Julien Fabre" fake="[CLIENT]" />, domicilié <M7X on={on} real="12 rue des Lilas, 44000 Nantes" fake="[ADRESSE]" />, pour l’informer que son dossier de prise en charge de <M7X on={on} real="son arrêt maladie" fake="[MOTIF]" /> est complet. Rappeler sa référence <M7X on={on} real="n° SS 1 85 05 44 109 087" fake="[RÉFÉRENCE]" /> et son téléphone <M7X on={on} real="06 52 18 44 90" fake="[TÉLÉPHONE]" />.
      </div>
      <div style={{ position: 'absolute', left: 1360, top: 290, width: 440, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card tone="green" icon="checkCircle" title="Le résultat reste utile" size={21} pad={22} cls={A.right}>
          L’IA rédige le courrier avec des [CHAMPS]. Vous les remplacez dans Word, chez vous.
        </Card>
        <Card tone="coral" icon="alert" title="Santé = rouge" size={21} pad={22} cls={A.right} style={dl(150)}>
          Même anonymisé, un motif médical précis reste une donnée sensible : remplacez-le par un champ.
        </Card>
      </div>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 760, width: 1680, ...dl(400) }}>
        <Callout title="Ce que dit le RGPD, en une phrase" tone="blue" icon="shield" size={23}>
          Une donnée personnelle ne peut être utilisée que pour une finalité prévue, par un outil autorisé : <strong>la coller dans un service non validé, c’est la transmettre à un tiers</strong>.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Bonnes pratiques professionnelles ──────────────────────────────────────
const M7_RULES: [IconName, Tone, string, string][] = [
  ['book', 'blue', 'Je respecte la politique interne', 'Outils autorisés, usages permis, règles de mon service.'],
  ['lock', 'coral', 'Je protège les données', 'Feu tricolore, anonymisation, compte professionnel.'],
  ['eye', 'violet', 'Je vérifie tout ce qui sort', 'Faits, chiffres, noms, engagements, ton.'],
  ['pen', 'teal', 'Je signe, donc j’assume', 'L’IA ne porte aucune responsabilité : vous, si.'],
  ['chat', 'green', 'Je reste transparente', 'Je signale l’usage de l’IA quand la règle ou le contexte l’exige.'],
  ['archive', 'yellow', 'Je capitalise', 'Bibliothèque de prompts et modèles partagés avec l’équipe.'],
];

const M7_Pratiques: Page = () => (
  <Frame mod={7} beats={6}>
    <Title>Bonnes pratiques professionnelles : ma charte</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      {M7_RULES.map(([icon, tone, t, d], i) => (
        <div key={t} className={b.pop(i + 1)} style={{ background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 0 6px 0 ${STRONG[tone]}`, padding: '26px 28px', minHeight: 250, boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <IconTile name={icon} tone={tone} size={58} solid />
            <span style={{ fontFamily: display, fontWeight: 800, fontSize: 22, color: C.muted }}>{pad(i + 1)}</span>
          </div>
          <div style={{ marginTop: 16, fontFamily: display, fontWeight: 800, fontSize: 28, lineHeight: 1.2, color: C.navy }}>{t}</div>
          <div style={{ marginTop: 8, fontSize: 22, lineHeight: 1.45, color: C.soft }}>{d}</div>
        </div>
      ))}
    </div>
    <div className={b.fade(6)} style={{ position: 'absolute', left: 120, top: 830, width: 1680 }}>
      <Quote by="Le fil conducteur de la journée">L’IA prépare, vous vérifiez, vous signez.</Quote>
    </div>
  </Frame>
);

// ─── Quiz final ─────────────────────────────────────────────────────────────
const M7_Quiz: Page = () => (
  <Frame mod={7} kind="quiz">
    <Title>Quiz final : êtes-vous prêt·e pour lundi ?</Title>
    <QuizSeries y={220}>
      <QuizQ q="Une collègue vous demande de faire résumer par l’IA le dossier disciplinaire d’un salarié. Feu…" explain="Données RH et sanctions : feu rouge. Elles ne vont pas dans un assistant IA, sauf règle interne explicite avec un outil validé.">
        <QOpt>Vert</QOpt>
        <QOpt>Orange, en anonymisant</QOpt>
        <QOpt ok>Rouge</QOpt>
      </QuizQ>
      <QuizQ q="Dans le cas fil rouge, pourquoi relire après chaque étape ?" explain="Chaque étape réutilise la précédente : une erreur d’analyse se retrouve dans l’email, la fiche, la synthèse… jusqu’au client.">
        <QOpt>Pour faire plaisir au responsable</QOpt>
        <QOpt ok>Parce qu’une erreur se propage aux étapes suivantes</QOpt>
        <QOpt>Ce n’est pas utile si le prompt est bon</QOpt>
      </QuizQ>
      <QuizQ q="Quel est le premier réflexe pour un prompt qui marche bien ?" explain="Un bon prompt se range dans la bibliothèque, avec des [CROCHETS] pour ce qui change : il resservira la semaine prochaine.">
        <QOpt ok>Le ranger dans ma bibliothèque, avec des [CROCHETS]</QOpt>
        <QOpt>Le garder dans l’historique de l’outil</QOpt>
        <QOpt>Le réécrire de mémoire la prochaine fois</QOpt>
      </QuizQ>
      <QuizQ q="Un email généré contient une date que vous ne retrouvez dans aucune source. Vous…" explain="Une information introuvable dans les sources est probablement inventée : on la supprime ou on la vérifie avant tout envoi.">
        <QOpt>la gardez, l’IA a sûrement raison</QOpt>
        <QOpt ok>la vérifiez ou la retirez avant l’envoi</QOpt>
        <QOpt>ajoutez « sous réserve »</QOpt>
      </QuizQ>
      <QuizQ q="Qui est responsable d’un courrier rédigé avec l’IA et envoyé à un client ?" explain="L’IA est un outil. La personne qui envoie, et l’organisation au nom de laquelle elle écrit, restent responsables du contenu.">
        <QOpt>L’éditeur de l’IA</QOpt>
        <QOpt ok>Moi et mon organisation</QOpt>
        <QOpt>Personne, c’est automatique</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Auto-positionnement final ──────────────────────────────────────────────
const M7_AutoPos: Page = () => (
  <Frame mod={7} kind="exercice" label="Clôture · auto-positionnement">
    <Title>Auto-positionnement : et maintenant ?</Title>
    <Lede>Les huit affirmations de ce matin : cochez ce que vous savez faire maintenant.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CheckItem id="apf1">Expliquer ce qu’une IA générative sait faire… et ce qu’elle ne sait pas faire</CheckItem>
        <CheckItem id="apf2">Écrire une demande précise avec contexte, contraintes et format attendu</CheckItem>
        <CheckItem id="apf3">Faire rédiger ou reformuler un email dans le bon ton</CheckItem>
        <CheckItem id="apf4">Transformer des notes de réunion en compte rendu avec plan d’action</CheckItem>
        <CheckItem id="apf5">Faire extraire des informations précises d’un long document</CheckItem>
        <CheckItem id="apf6">Faire résumer un tableau de chiffres et en vérifier le résultat</CheckItem>
        <CheckItem id="apf7">Réutiliser des modèles de prompts au lieu de repartir de zéro</CheckItem>
        <CheckItem id="apf8">Dire quelles informations ne jamais coller dans une IA</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 270, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau ce soir"
          levels={[
            { min: 0, text: 'Reprenez les fiches du support à tête reposée.', tone: 'grey' },
            { min: 4, text: 'Belle progression : pratiquez dès lundi.', tone: 'blue' },
            { min: 7, text: 'Objectifs atteints : partagez vos prompts !', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Écart avec ce matin = votre progression du jour. Notez-le sur la fiche d’évaluation.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Mon plan pour lundi ────────────────────────────────────────────────────
const M7Plan = ({ when, tone, icon, children, d }: { when: string; tone: Tone; icon: IconName; children: ReactNode; d: number }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: `${SHADOW}, inset 6px 0 0 ${STRONG[tone]}`, padding: '20px 26px', display: 'flex', gap: 18, alignItems: 'flex-start', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={54} solid />
    <div>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.navy }}>{when}</div>
      <div style={{ marginTop: 4, fontSize: 22, lineHeight: 1.45, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const M7_Lundi: Page = () => (
  <Frame mod={7} kind="exercice" label="Clôture · mon plan d’action">
    <Title>Mon plan d’action : dès lundi matin</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 860, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <M7Plan when="Lundi" tone="blue" icon="bolt" d={100}>
        Vérifier quel outil IA mon organisation autorise, et me connecter avec le compte professionnel.
      </M7Plan>
      <M7Plan when="Cette semaine" tone="violet" icon="chat" d={200}>
        Utiliser l’IA sur ma tâche n° 1 de l’atelier 1, avec un prompt de ma bibliothèque.
      </M7Plan>
      <M7Plan when="Ce mois-ci" tone="green" icon="archive" d={300}>
        Créer 3 modèles (email type, compte rendu, reporting) et les partager à l’équipe.
      </M7Plan>
      <M7Plan when="Toujours" tone="coral" icon="shieldCheck" d={400}>
        Feu tricolore avant de coller, grille de vérification avant d’envoyer.
      </M7Plan>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1040, top: 200, width: 760, ...dl(300) }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        La tâche que je confie à l’IA en premier
      </Eyebrow>
      <Poll>
        <PollRow id="l-1" label="Répondre aux emails et relancer" tone="teal" icon="mail" />
        <PollRow id="l-2" label="Rédiger les comptes rendus" tone="navy" icon="doc" />
        <PollRow id="l-3" label="Préparer réunions et plannings" tone="green" icon="calendar" />
        <PollRow id="l-4" label="Analyser tableaux et reporting" tone="yellow" icon="table" />
        <PollRow id="l-5" label="Résumer et extraire des documents" tone="violet" icon="search" />
      </Poll>
    </div>
  </Frame>
);

// ─── Merci ──────────────────────────────────────────────────────────────────
const M7_Merci: Page = () => (
  <Frame mod={7} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={110} r={46} cls={A.fade} />
    <Outline x={1700} y={930} w={300} h={200} r={40} color={C.violet} />
    <div style={{ position: 'absolute', left: 390, top: 150, width: 1000 }}>
      <Eyebrow c={C.violet} size={24} cls={A.in}>
        Fin de la formation
      </Eyebrow>
      <h1 className={A.in} style={{ margin: '20px 0 0', fontFamily: display, fontWeight: 800, fontSize: 120, lineHeight: 1, letterSpacing: '-0.02em', color: C.navy, ...dl(120) }}>
        Merci !
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 32, lineHeight: 1.45, color: C.soft, maxWidth: 940, ...dl(240) }}>
        Vous repartez avec une méthode, une bibliothèque de prompts et des réflexes de sécurité. Le reste, c’est la pratique : <strong style={{ color: C.navy }}>un peu chaque jour</strong>.
      </p>
      <div className={A.in} style={{ marginTop: 40, ...dl(400) }}>
        <Quote>L’IA prépare, vous vérifiez, vous signez.</Quote>
      </div>
    </div>
    <Portrait w={170} x={390} y={700} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 724, ...dl(500) }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 36, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>Questions, retours, prompts à partager : je reste disponible.</div>
      <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
        <Tag tone="green" size={20}>
          <Icon name="checkCircle" size={20} /> Fiche d’évaluation
        </Tag>
        <Tag tone="violet" size={20}>
          <Icon name="archive" size={20} /> Bibliothèque commune envoyée
        </Tag>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1460, top: 190, width: 360, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {M7_CHAIN.map((c, i) => (
        <div key={c.t} className={A.right} style={{ display: 'flex', alignItems: 'center', gap: 16, ...dl(600 + i * 100) }}>
          <IconTile name={c.icon} tone={c.tone} size={56} solid />
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 26, color: C.navy }}>{c.t}</span>
        </div>
      ))}
    </div>
    <Footer left={390} />
  </Frame>
);
M7_Merci.transition = BLOOM;

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
  title: "IA pour l’assistant administratif",
  createdAt: '2026-10-12T21:30:00.000Z',
};

export default [
  O_Cover,
  O_Welcome,
  O_Poll,
  O_Objectifs,
  O_Programme,
  O_AutoPos,
  O_Regles,
  M1_Section,
  M1_Quoi,
  M1_Apports,
  M1_Gain,
  M1_Tri,
  M1_Limites,
  M1_Outils,
  M1_Pratiques,
  M1_Quiz,
  M1_Atelier,
  M2_Section,
  M2_AvantApres,
  M2_Structure,
  M2_Contexte,
  M2_Resultat,
  M2_Format,
  M2_Iterer,
  M2_Modele,
  M2_Defauts,
  M2_Qcm,
  M2_Atelier,
  M2_Biblio,
  M3_Section,
  M3_Email,
  M3_Ton,
  M3_Reclamation,
  M3_Relance,
  M3_Note,
  M3_Traduire,
  M3_Quiz,
  M3_Atelier,
  M4_Section,
  M4_Resumer,
  M4_Extraire,
  M4_Comparer,
  M4_CompteRendu,
  M4_Transformer,
  M4_Verifier,
  M4_Procedure,
  M4_Qcm,
  M4_Atelier,
  M5_Section,
  M5_Prioriser,
  M5_Journee,
  M5_Reunion,
  M5_Checklist,
  M5_Planning,
  M5_Modeles,
  M5_Quiz,
  M6_Section,
  M6_Analyser,
  M6_Tendances,
  M6_Nettoyer,
  M6_Synthese,
  M6_Structurer,
  M6_Reporting,
  M6_Quiz,
  M7_Section,
  M7_Cas,
  M7_Etapes,
  M7_Atelier,
  M7_Verifier,
  M7_Confidentialite,
  M7_Anonymiser,
  M7_Pratiques,
  M7_Quiz,
  M7_AutoPos,
  M7_Lundi,
  M7_Merci,
] satisfies Page[];

// Speaker notes — one entry per page, same order as the default export.
export const notes: (string | undefined)[] = [
  `⏱ 2 min · COUVERTURE · 9:00

OBJECTIF — Accueillir le groupe et donner tout de suite le ton : concret, utile, accessible.

DIRE — « Bonjour à toutes et à tous, et bienvenue. Aujourd’hui, on va parler d’un outil qui peut vous faire gagner plusieurs heures par semaine : l’intelligence artificielle générative. Regardez à droite : une réponse à une réclamation, un compte rendu, des relances, une synthèse de tableau, un ordre du jour. Ce sont des tâches que vous faites toutes les semaines. Les durées sont des ordres de grandeur, pas des promesses : mais l’écart est réel, et ce soir vous saurez le reproduire. »

ANIMATION — Laisser les barres se réduire. Ne pas commenter chaque ligne : demander « Qui reconnaît sa semaine dans cette liste ? »

TRANSITION — « Avant de commencer, quelques mots sur la journée. »`,
  `⏱ 2 min · BIENVENUE

OBJECTIF — Se présenter, poser le contrat pédagogique et le fil conducteur.

DIRE — « Je suis votre formateur pour la journée. Ma promesse tient en trois chiffres : sept heures de pratique, six modules, et plus de vingt prompts que vous emporterez dans votre bibliothèque personnelle. Aucune compétence technique n’est nécessaire : si vous savez écrire un email clair, vous savez parler à une IA. Notre contrat : je montre, vous pratiquez. Et le fil conducteur, que vous allez entendre souvent : l’IA prépare, vous vérifiez, vous signez. C’est toujours vous qui êtes responsable de ce qui part. »

INSISTER — Rassurer les débutants : on part de zéro, personne ne sera mis en difficulté.

TRANSITION — « Faisons connaissance. »`,
  `⏱ 4 min · TOUR DE TABLE (sondage)

OBJECTIF — Connaître les outils déjà utilisés et les tâches les plus chronophages pour adapter les exemples.

DIRE — « Premier vote, main levée : quels assistants IA avez-vous déjà utilisés, même une seule fois ? » Compter, cliquer. « Deuxième vote : qu’est-ce qui vous prend le plus de temps dans votre semaine ? Vous pouvez voter deux fois. »

ANIMATION — Cliquer une ligne par main levée. Noter les deux tâches les plus votées et y faire référence pendant la journée (« vous l’aviez voté ce matin… »). Si un participant n’a jamais utilisé d’IA, le rassurer et le mettre en binôme avec quelqu’un de plus habitué.

TRANSITION — « Voici ce que vous saurez faire ce soir. »`,
  `⏱ 2 min · OBJECTIFS

OBJECTIF — Présenter les dix objectifs du programme, regroupés en quatre gestes faciles à retenir.

DIRE — « Le programme compte dix objectifs. Pour les retenir, je les range en quatre gestes. Demander : savoir parler à l’IA et repérer les tâches où elle aide. Rédiger : emails, courriers, comptes rendus, modèles. Organiser : documents, tableaux, planning. Et sécuriser : vérifier les résultats et protéger les données. Ce dernier geste n’est pas en option : on y revient dans chaque module. »

TRANSITION — « Voici comment la journée est découpée. »`,
  `⏱ 2 min · PROGRAMME

OBJECTIF — Donner la carte de la journée.

DIRE — « Le matin, on apprend à bien demander : comprendre l’IA, construire un prompt, puis l’appliquer à vos écrits. L’après-midi, on apprend à bien produire : documents et comptes rendus, organisation, tableaux. On termine par un cas fil rouge qui reprend toute la journée, de la réception d’une demande jusqu’à son suivi, et par les bonnes pratiques de sécurité. Le bandeau en haut à droite vous indique toujours où nous en sommes. »

ANIMATION — Les horaires sont indicatifs : ajuster au rythme du groupe, mais protéger le temps des ateliers.

TRANSITION — « Avant de commencer, mesurons votre point de départ. »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT (exercice)

OBJECTIF — Mesurer le niveau de départ, comme le demande le dispositif d’évaluation.

DIRE — « Huit affirmations, une par grande compétence de la journée. Cochez uniquement ce que vous savez faire aujourd’hui, seul et sans chercher. Notez votre score sur un coin de feuille : on refera exactement le même exercice à la fin de la journée. »

ANIMATION — Faire cocher un volontaire à l’écran, ou laisser chacun noter sur papier. Repérer les scores élevés : leur proposer les bonus des ateliers et un rôle d’entraide.

TRANSITION — « Dernière étape avant de commencer : les règles du jeu. »`,
  `⏱ 3 min · RÈGLES DU JEU ET PERSONA

OBJECTIF — Vérifier les outils et présenter le contexte fictif utilisé dans tous les exemples.

DIRE — « Pour pratiquer, il vous faut un assistant IA ouvert : idéalement le compte professionnel fourni par votre employeur, parce qu’il protège mieux vos données. Et un document vierge où coller vos meilleurs prompts : ce sera votre bibliothèque. Tous nos exemples viennent d’une entreprise inventée : les Ateliers Morel, une PME nantaise. Vous êtes Nadia, assistante de direction. Et la règle d’or : aucune donnée réelle pendant les exercices. »

ANIMATION — Faire cocher la liste. Si un participant n’a pas d’accès, il travaille en binôme. Expliquer brièvement qu’on reviendra en détail sur la confidentialité au module final.

TRANSITION — « Tout le monde est prêt ? Module 1 : découvrir l’IA dans les métiers administratifs. »`,
  `⏱ 1 min · SECTION MODULE 1 · 9:20

OBJECTIF — Annoncer le module : comprendre avant d’utiliser.

DIRE — « Premier module : découvrir l’IA dans nos métiers. En une heure, on va voir ce qu’elle apporte vraiment à un assistant, quelles tâches lui confier, lesquelles éviter, ses limites, et comment choisir son outil. On finira par un atelier où vous identifierez cinq tâches de votre propre poste. »

TRANSITION — « D’abord, qu’est-ce que c’est, une IA générative ? »`,
  `⏱ 5 min · L’IA GÉNÉRATIVE EN UNE IMAGE (3 clics)

OBJECTIF — Donner une image mentale simple et juste du fonctionnement, sans technique.

DIRE — « Une IA générative, c’est un programme qui a lu des milliards de textes et qui a appris une chose : prédire le mot suivant le plus probable. Regardez : “Madame, nous accusons bonne…” Vous avez toutes et tous pensé “réception”. L’IA aussi, et elle le fait mot après mot, très vite. » Clic 1 : « Elle a énormément lu, donc elle maîtrise les formules de l’écrit professionnel. » Clic 2 : « Mais elle ne connaît pas votre bureau : ni vos clients, ni vos tarifs. » Clic 3 : « Et comme elle prédit ce qui est probable, pas ce qui est vrai, elle peut écrire très bien quelque chose de faux. Imaginez un stagiaire brillant, très rapide, qui vient d’arriver : il faut tout lui expliquer, et relire son travail. »

INSISTER — L’image du stagiaire servira toute la journée.

TRANSITION — « Concrètement, qu’est-ce que ce stagiaire sait faire pour vous ? »`,
  `⏱ 5 min · CE QUE L’IA APPORTE (cartes à retourner)

OBJECTIF — Montrer six usages concrets, chacun avec une demande type.

DIRE — « Six super-pouvoirs du quotidien. Rédiger, reformuler, résumer, structurer, extraire, traduire. Je retourne une carte, et je vous demande pour chacune : quand l’avez-vous fait pour la dernière fois ? »

ANIMATION — Cliquer les cartes une par une ou faire choisir le groupe. Lire la demande type au dos à voix haute : remarquer qu’elle précise toujours un destinataire, une longueur ou un ton. C’est un avant-goût du module 2.

TRANSITION — « Combien de temps cela peut-il vous faire gagner ? Faisons le calcul pour vous. »`,
  `⏱ 5 min · SIMULATEUR DE GAIN DE TEMPS (interactif)

OBJECTIF — Rendre le bénéfice concret et personnel, tout en restant honnête sur la relecture.

DIRE — « Prenons un volontaire. Combien d’emails rédigez-vous par semaine ? Combien de documents : comptes rendus, notes, synthèses ? » Régler les curseurs. « Avec une hypothèse prudente de 50 % de temps gagné, relecture comprise, on arrive à… » Lire le résultat. « Sur une année, c’est ce nombre de journées entières. Mais attention : ce gain suppose deux choses que l’on va apprendre aujourd’hui. Bien demander, sinon on passe son temps à corriger. Et bien vérifier, parce qu’une erreur envoyée coûte bien plus cher que le temps gagné. »

ANIMATION — Faire varier la part économisée de 30 à 70 % pour montrer la sensibilité. Les flèches du clavier ajustent le curseur sélectionné.

TRANSITION — « Toutes les tâches ne se prêtent pas à l’IA. Faisons le tri. »`,
  `⏱ 6 min · EXERCICE DE TRI (glisser-déposer, 1 clic pour la solution)

OBJECTIF — Apprendre à distinguer les tâches idéales, à surveiller et à éviter.

DIRE — « Neuf tâches, trois colonnes. Idéal : du texte, du répétitif, facile à relire. Avec vigilance : il y a des chiffres, des faits ou un enjeu pour un client. À éviter : des données sensibles, ou une décision qui engage l’entreprise. À vous de me dire où va chaque étiquette. »

ANIMATION — Faire glisser les étiquettes selon les propositions du groupe. Débattre des cas 2, 5 et 8 : le résumé d’un contrat est utile mais à vérifier ; le calcul des frais, c’est le tableur ; la réponse à une réclamation est une très bonne tâche… à condition de relire. Clic pour la solution.

INSISTER — Les cas 3 et 9 ne sont pas des problèmes techniques mais de confidentialité. Le cas 6 est une décision : l’IA peut préparer, jamais décider.

TRANSITION — « Parlons justement de ce que l’IA fait mal. »`,
  `⏱ 6 min · LES LIMITES (5 clics)

OBJECTIF — Faire vivre une hallucination et lister les cinq limites à connaître.

DIRE — « Une question, une réponse qui a l’air parfaite : un article de loi, un délai précis. » Clic 1 : « Sauf que cette règle, sous cette forme, n’existe pas. C’est ce qu’on appelle une hallucination : l’IA produit le texte le plus plausible, pas le plus vrai. C’est un exemple construit pour la formation, mais il est très représentatif. » Puis clics 2 à 5 : « Ses connaissances s’arrêtent à une date ; elle calcule mal ; elle ignore votre contexte ; et ce que vous collez peut être conservé selon l’outil et le compte. »

INSISTER — Aucune référence juridique, aucun chiffre, aucun nom ne part sans vérification à la source.

TRANSITION — « Quel outil choisir, alors ? »`,
  `⏱ 4 min · CHOISIR LE BON OUTIL (onglets)

OBJECTIF — Présenter les principaux assistants sans faire de publicité, et donner trois critères de choix.

DIRE — « Quatre grands outils, qui font tous à peu près la même chose pour nos besoins. » Cliquer chaque onglet brièvement. « Le critère numéro un n’est pas la qualité, elles se valent pour l’écrit : c’est ce que votre organisation autorise. Le compte professionnel est encadré par un contrat, un compte personnel non. Ensuite : est-ce intégré à mes outils, Outlook ou Gmail, Word ou Docs ? Et enfin : où vont mes données ? »

ANIMATION — Demander qui a accès à un outil fourni par son employeur. Les offres et fonctions évoluent vite : rester factuel et inviter à vérifier auprès du service informatique.

TRANSITION — « Quel que soit l’outil, six réflexes. »`,
  `⏱ 4 min · SIX RÉFLEXES (6 clics)

OBJECTIF — Ancrer les bonnes pratiques de base avant de pratiquer.

DIRE — Un clic par réflexe. « Un : expliquez comme à un nouveau collègue. Deux : une demande, un objectif. Trois : dialoguez, le premier jet n’est qu’un brouillon. Quatre : relisez et vérifiez. Cinq : anonymisez avant de coller. Six : gardez ce qui marche dans votre bibliothèque. » Dernier clic : la citation. « Retenez la phrase : l’IA prépare, vous vérifiez, vous signez. »

TRANSITION — « Vérifions que c’est acquis avec un petit quiz. »`,
  `⏱ 4 min · QUIZ M1 (5 questions)

OBJECTIF — Valider les notions clés du module.

DIRE — « Cinq questions, une à la fois. Votez à main levée, puis je clique. »

ANIMATION — Cliquer la réponse choisie par la majorité : le retour s’affiche immédiatement. Lire l’explication à voix haute à chaque fois. Le score s’affiche en fin de série.

TRANSITION — « À vous de jouer : premier atelier. »`,
  `⏱ 15 min · ATELIER 1 (minuteur)

OBJECTIF — Chaque participant identifie cinq tâches de son poste à confier à l’IA, avec la vérification associée.

DIRE — « Pendant dix minutes, seul, listez cinq tâches réelles de votre semaine. Pour chacune, donnez trois notes : fréquence, temps, part de texte, et multipliez-les. Au-dessus de 12, c’est une priorité. Notez aussi ce que vous vérifieriez. Puis cinq minutes en binôme : comparez vos listes, challengez-vous. »

ANIMATION — Lancer le minuteur. Passer dans les rangs, aider à rendre les tâches concrètes (« les emails » devient « répondre aux demandes de devis »). Recueillir deux ou trois exemples à l’oral à la fin.

TRANSITION — « Vous avez vos tâches. Maintenant, apprenons à bien les demander. Petite pause, puis module 2. »`,
  `⏱ 1 min · SECTION MODULE 2 · 10:30

OBJECTIF — Annoncer le module central de la matinée.

DIRE — « Bon retour de pause. Module 2 : les prompts. Un prompt, c’est simplement la consigne que vous donnez à l’IA. C’est la compétence qui fait toute la différence : bien écrite, la consigne donne un résultat utilisable du premier coup ; floue, elle fait perdre du temps. On termine par la création de votre bibliothèque de prompts. »

TRANSITION — « Commençons par une démonstration. »`,
  `⏱ 4 min · AVANT / APRÈS (interrupteur)

OBJECTIF — Montrer l’effet spectaculaire d’une consigne précise.

DIRE — « Même besoin : prévenir que le comité de direction est décalé. Demande vague à gauche : “Écris un mail pour décaler la réunion.” Regardez la réponse : des crochets partout, une raison inventée, un texte passe-partout. Il faut tout réécrire. » Basculer l’interrupteur. « Maintenant la demande précise : qui je suis, ce qui se passe, la nouvelle date, le ton, la longueur, le format. Résultat : un email prêt à envoyer après relecture. »

ANIMATION — Basculer plusieurs fois pour comparer. Demander : « Qu’est-ce qui a fait la différence ? » Noter les réponses : elles annoncent la page suivante.

TRANSITION — « Ces éléments, on peut les ranger dans une structure simple. »`,
  `⏱ 6 min · STRUCTURE R-C-T-C-F (5 clics)

OBJECTIF — Donner une méthode mémorisable pour construire un prompt.

DIRE — Un clic par ingrédient. « R comme Rôle : qui l’IA doit-elle être ? Ici, une assistante de direction. C comme Contexte : que se passe-t-il ? Un client se plaint d’un retard de 10 jours. T comme Tâche : que doit-elle produire ? La réponse à la réclamation. C comme Contraintes : le ton, la longueur, et surtout ce qu’il ne faut pas faire, ici aucune promesse de remboursement. F comme Format : l’objet puis le corps, sans signature. » Dernier clic : « Pour le retenir : Rédiger Correctement Toutes Ces Formules. »

INSISTER — Tous les ingrédients ne sont pas obligatoires pour une demande simple, mais le contexte et la tâche le sont toujours.

TRANSITION — « Le contexte est l’ingrédient le plus souvent oublié. Zoom dessus. »`,
  `⏱ 4 min · DONNER UN CONTEXTE (interrupteurs)

OBJECTIF — Faire comprendre que tout ce qui n’est pas dit doit être deviné par l’IA.

DIRE — « Sans contexte, l’IA doit deviner cinq choses : qui écrit, à qui, la situation, l’historique, l’objectif. Activons-les une par une. » Activer les interrupteurs en commentant. « Chaque élément ajouté, c’est une question qu’elle n’a plus à deviner, donc une réponse plus juste. Le bon test : un intérimaire arrivé ce matin comprendrait-il ma demande ? Si non, l’IA non plus. »

ANIMATION — La jauge est illustrative. Faire activer les interrupteurs par un participant.

TRANSITION — « Deux autres ingrédients : le résultat attendu et les contraintes. »`,
  `⏱ 4 min · RÉSULTAT ATTENDU ET CONTRAINTES (2 clics)

OBJECTIF — Apprendre à préciser le livrable et à encadrer l’IA.

DIRE — Clic 1 : « Le résultat attendu : le type de document, le lecteur, la longueur, le ton. Dire “pour mon directeur qui a deux minutes” change complètement le résumé. » Clic 2 : « Les contraintes : ce qu’il faut faire, ce qu’il ne faut pas faire, les sources à respecter, et quoi faire en cas de doute. » Puis l’encadré : « La contrainte qui change tout : si une information manque, ne l’invente pas, écris À COMPLÉTER entre crochets. Vous repérez les trous d’un coup d’œil, au lieu de découvrir une date inventée après l’envoi. »

TRANSITION — « Et pour la forme de la réponse, vous avez le choix. »`,
  `⏱ 4 min · RÉPONSE STRUCTURÉE (onglets)

OBJECTIF — Montrer qu’on peut imposer la forme : tableau, puces, recommandation.

DIRE — « Trois devis de traiteur. Même contenu, trois formes. » Cliquer chaque onglet. « Le tableau, pour comparer : si vous nommez les colonnes, vous pouvez le coller directement dans Excel. Les puces, pour un message rapide. La recommandation, pour un directeur qui veut une décision. Remarquez qu’ici l’IA a raisonné : 35 participants, donc le traiteur à 40 couverts minimum est exclu. »

INSISTER — Les chiffres viennent des devis fournis : il faut toujours les recouper avec les documents d’origine.

TRANSITION — « Et si le résultat ne convient pas ? On dialogue. »`,
  `⏱ 3 min · ITÉRER (4 clics)

OBJECTIF — Installer le réflexe du dialogue plutôt que de l’abandon.

DIRE — Clic 1 : « Première version : douze lignes, beaucoup trop long pour une note sur le parking. » Clic 2 : « On ne recommence pas : on précise. Cinq lignes, et ajoute la solution. » Clic 3 : « Deuxième version : courte, utile, avec la solution. » Clic 4 : « Voici les relances qui marchent le mieux. Ma préférée : “Que manque-t-il ?” L’IA repère souvent elle-même les oublis. »

TRANSITION — « Quand un prompt marche bien, on le garde. »`,
  `⏱ 4 min · PROMPTS RÉUTILISABLES (2 clics)

OBJECTIF — Montrer comment transformer un bon prompt en modèle à crochets.

DIRE — « Voici un modèle pour répondre aux demandes de devis. Tout ce qui change d’une fois à l’autre est entre crochets : l’entreprise, le nom, le besoin, le délai. Il suffit de remplacer les crochets. » Clic 1 : « Où les ranger ? Dans un simple document, classé par usage. Selon l’outil, vous pouvez aussi enregistrer des instructions personnalisées ou créer un assistant pré-configuré. » Clic 2 : « Et partagez-les : une bibliothèque d’équipe harmonise le ton de tous les courriers. Astuce : demandez à l’IA de transformer votre meilleur échange en modèle. »

TRANSITION — « Avant de créer les vôtres, un exercice d’œil critique. »`,
  `⏱ 4 min · EXERCICE : CINQ DÉFAUTS (pastilles)

OBJECTIF — Apprendre à repérer les défauts d’une demande.

DIRE — « Voici une demande de Nadia. Elle contient cinq défauts. Trouvez-les. » Laisser chercher une minute. Cliquer chaque pastille au fur et à mesure des propositions. « Pas de contexte, des critères flous, des chiffres non fournis donc inventés, une action que l’IA ne fait pas, et surtout un fichier de salaires : donnée sensible. »

INSISTER — Le défaut numéro 5 est le plus grave : il ne produit pas un mauvais texte, il crée un risque pour l’entreprise.

TRANSITION — « Petit QCM pour vérifier. »`,
  `⏱ 3 min · QCM M2

OBJECTIF — Vérifier que la structure R-C-T-C-F est acquise.

DIRE — « Quatre propositions pour relancer un fournisseur. Laquelle donnera le meilleur résultat ? » Faire voter. Cliquer la réponse de la majorité : le retour s’affiche. Clic suivant : la bonne réponse, puis l’explication.

ANIMATION — Insister sur la réponse D : dans un assistant classique, l’IA n’envoie rien, et même quand un outil le permet, on relit avant.

TRANSITION — « À vous : construisez votre bibliothèque. »`,
  `⏱ 25 min · ATELIER 2 (minuteur)

OBJECTIF — Chaque participant repart avec au moins cinq prompts réutilisables testés.

DIRE — « En binôme, vingt-cinq minutes. Partez de vos cinq tâches de l’atelier 1, ou des modèles de la page suivante. Pour chaque prompt : les cinq ingrédients, des crochets pour ce qui change, un test avec un cas fictif, une amélioration. Donnez-lui un nom pour le retrouver. »

ANIMATION — Lancer le minuteur, afficher la page suivante pendant l’atelier. Passer dans les rangs : vérifier la présence de la contrainte À COMPLÉTER. À la fin, faire lire deux prompts et les améliorer collectivement.

TRANSITION — Afficher la page suivante comme support.`,
  `⏱ (support de l’atelier 2) · CINQ MODÈLES

OBJECTIF — Fournir des points de départ aux participants qui manquent d’idées.

DIRE — « Voici cinq modèles génériques : réponse type, reformulation, compte rendu, extraction, ordre du jour. Copiez-les, adaptez-les à votre poste et testez-les. On les réutilisera tout au long de la journée. »

ANIMATION — Laisser cette page affichée pendant l’atelier. En fin d’atelier, recueillir les meilleurs prompts du groupe pour une bibliothèque commune (à envoyer après la formation).

TRANSITION — « Votre bibliothèque est lancée. Appliquons-la à ce qui vous prend le plus de temps : les emails. Module 3. »`,
  `⏱ 1 min · SECTION MODULE 3 · 11:30

OBJECTIF — Annoncer le module le plus attendu (souvent le plus voté au sondage).

DIRE — « Module 3 : les emails et courriers. Ce matin, beaucoup d’entre vous ont voté pour les emails comme tâche la plus chronophage. On va voir comment rédiger, reformuler, adapter le ton, répondre à une réclamation, relancer, rédiger une note interne et traduire. Toujours avec la même règle : l’IA écrit le premier jet, c’est vous qui envoyez. »

TRANSITION — « Commençons par un email simple. »`,
  `⏱ 4 min · RÉDIGER UN EMAIL (5 clics)

OBJECTIF — Montrer ce que produit une demande bien construite et l’anatomie d’un bon email.

DIRE — « À gauche, la demande de Nadia : rôle, contexte précis avec le code d’erreur, destinataire, échéance, numéro de contrat, ton, longueur. À droite, le résultat. » Un clic par partie : « Un objet clair qu’on retrouve facilement dans une boîte mail. Une formule d’appel. Le contexte en une phrase. L’action attendue avec l’échéance : c’est le cœur. La formule de politesse. »

INSISTER — L’encadré du bas : le téléphone est ici fictif, et en vrai c’est à vous de vérifier chaque information et d’ajouter la signature.

TRANSITION — « Et quand on a déjà le texte, mais pas le bon ton ? »`,
  `⏱ 4 min · ADAPTER LE TON (curseur)

OBJECTIF — Montrer qu’un même fait peut se dire de quatre façons, selon le destinataire.

DIRE — « Un seul fait : la livraison aura cinq jours de retard. » Faire glisser le curseur. « Familier pour une collègue proche. Cordial pour un client habituel. Formel pour un courrier officiel. Empathique pour un client déjà mécontent. Remarquez que dans la version empathique, l’IA ajoute “je vous appelle demain” : c’est un engagement. Si vous ne pouvez pas le tenir, vous le retirez. »

INSISTER — La consigne « garde tous les faits, n’ajoute rien » protège contre les promesses inventées.

TRANSITION — « Le cas le plus délicat : la réclamation. »`,
  `⏱ 5 min · RÉCLAMATION A-R-S-S (5 clics)

OBJECTIF — Donner une méthode simple pour répondre à un client mécontent.

DIRE — « M. Lambert est en colère, et il a de bonnes raisons. Méthode A-R-S-S. » Un clic par étape : « Accuser réception : je le remercie, je cite sa commande. Reconnaître : je montre que j’ai compris la gêne, sans me justifier. Solution : quelque chose de concret, avec une date. Suite : je dis ce qui va se passer et comment me joindre. » Dernier clic : « Dans le prompt, précisez ce que vous avez le droit de proposer. Ici, la livraison gratuite vendredi a été décidée par le responsable. L’IA ne doit jamais promettre ce que l’entreprise n’a pas décidé. »

ANIMATION — Demander au groupe : « Qu’auriez-vous écrit spontanément ? » Souvent, on commence par se justifier : la méthode évite ce piège.

TRANSITION — « Autre tâche répétitive : les relances. »`,
  `⏱ 4 min · RELANCER UN CLIENT (onglets)

OBJECTIF — Montrer la gradation des relances et l’intérêt d’un modèle paramétré.

DIRE — « Une facture impayée. Trois relances, trois tons. » Cliquer chaque onglet. « À J + 7, on suppose un oubli. À J + 15, on est ferme et on demande une date, tout en ouvrant la porte au dialogue. À J + 30, on annonce la suite. Un seul modèle de prompt suffit, avec un paramètre : le niveau de relance. »

INSISTER — Les montants et dates viennent du logiciel de facturation, pas de l’IA. La troisième relance engage l’entreprise : validation par le responsable.

TRANSITION — « Passons à la communication interne. »`,
  `⏱ 3 min · NOTE INTERNE (interrupteur)

OBJECTIF — Transformer des notes en vrac en note interne claire.

DIRE — « Voici ce que Nadia a noté au téléphone avec la comptabilité. Tout y est, mais personne ne lira ça. » Basculer l’interrupteur. « Avec une consigne de structure : objet, ce qui change, pour qui, quand, que faire, contact. Lue en vingt secondes. »

INSISTER — Le « je crois » des notes : l’IA l’a transformé en affirmation. Une information incertaine doit être vérifiée avant diffusion, sinon l’IA la rend officielle.

TRANSITION — « Dernier usage : traduire. »`,
  `⏱ 3 min · TRADUIRE ET ADAPTER (4 clics)

OBJECTIF — Montrer que traduire, c’est aussi adapter les usages.

DIRE — « La demande ne dit pas seulement “traduis” : elle dit pour qui, et demande de signaler les adaptations. » Un clic par ligne : « La formule d’appel nominative. La date : 03/11 se lit 11 mars aux États-Unis, donc on l’écrit en toutes lettres. Les nombres : virgule et point s’inversent, et HT devient excl. VAT. La formule de politesse : courte en anglais. »

INSISTER — Astuce de la retraduction vers le français pour contrôler le sens d’un message important.

TRANSITION — « Petit quiz avant l’atelier. »`,
  `⏱ 4 min · QUIZ M3 (5 questions)

OBJECTIF — Valider les réflexes de rédaction.

DIRE — « Cinq questions. Votez, je clique. »

ANIMATION — Lire chaque explication. Insister sur la question 3 (l’avoir inventé) : c’est le risque principal des réponses aux clients.

TRANSITION — « À vous d’écrire. »`,
  `⏱ 25 min · ATELIER 3 (minuteur)

OBJECTIF — Produire plusieurs communications professionnelles à partir de situations réalistes.

DIRE — « Quatre situations. En binôme, chacun en traite au moins deux, puis vous échangez pour relire le travail de l’autre. Pour chaque situation, gardez le prompt, le texte final et ce que vous avez corrigé. Ce dernier point est le plus important : il montre ce que l’IA ne sait pas faire seule. »

ANIMATION — Lancer le minuteur. Passer dans les rangs : vérifier l’absence de promesses inventées dans les réclamations et le bon ton des relances. Faire lire à voix haute une réclamation et une relance en fin d’atelier. Les participants qui ont leurs propres situations réelles peuvent les utiliser, à condition d’anonymiser.

TRANSITION — « Bravo, la matinée est terminée. Bon déjeuner ! On reprend à 13 h 30 avec les documents et comptes rendus. »`,
  `⏱ 1 min · SECTION MODULE 4 · 13:30

OBJECTIF — Relancer l’énergie après le déjeuner et annoncer le module.

DIRE — « Bon retour ! Cet après-midi, on passe des emails aux documents. Module 4 : résumer, extraire, comparer, faire un compte rendu, écrire une procédure. L’IA lit très vite et organise très bien. Mais elle peut oublier un point ou en inventer un : c’est pour ça qu’on va beaucoup parler de vérification. »

ANIMATION — Petit réveil : « Levez la main si vous avez déjà passé plus d’une heure sur un compte rendu. »

TRANSITION — « Premier usage : résumer. »`,
  `⏱ 4 min · RÉSUMER POUR UN LECTEUR (onglets)

OBJECTIF — Montrer qu’un bon résumé dépend du lecteur et de l’usage.

DIRE — « Le même rapport de 18 pages, trois résumés. » Cliquer chaque onglet. « Pour le directeur : trois points et la décision à prendre. Pour les salariés : seulement ce qui change pour eux, avec un ton simple. Pour la comptabilité : les montants, avec la page de chaque chiffre. Ce dernier détail est précieux : vous pouvez vérifier chaque chiffre dans l’original en quelques secondes. »

INSISTER — Le rapport est fictif. Un résumé, c’est des choix : il faut dire à l’IA ce qui compte.

TRANSITION — « Parfois, on ne veut pas un résumé mais une information précise. »`,
  `⏱ 4 min · EXTRAIRE (5 clics)

OBJECTIF — Apprendre à extraire des informations de façon contrôlable.

DIRE — « Un contrat de nettoyage de 14 pages. On veut cinq informations. La demande précise la forme, un tableau, et deux consignes de sécurité : écrire “non trouvé” si l’info est absente, et ne rien inventer. » Un clic par ligne. Au dernier : « Pénalités : non trouvé. C’est une excellente réponse. Sans la consigne, l’IA aurait pu écrire une pénalité qui “se pratique habituellement”. »

INSISTER — Le préavis de résiliation : c’est typiquement l’information qu’on cherche une fois par an, au mauvais moment. Une extraction à la signature, rangée dans le dossier, fait gagner beaucoup de temps.

TRANSITION — « Et pour comparer deux documents ? »`,
  `⏱ 3 min · COMPARER (4 clics)

OBJECTIF — Montrer la comparaison de versions, et sa limite.

DIRE — « Deux versions du règlement télétravail. On demande un tableau avec une colonne impact pour les salariés : c’est elle qui rend la comparaison utile. » Un clic par ligne. « Trois jours au lieu de deux, une nouvelle démarche, une indemnité, et une contrainte nouvelle : le mardi sur site. »

INSISTER — L’IA peut manquer une différence discrète. Pour un contrat ou un règlement, on utilise aussi la fonction de comparaison du traitement de texte, qui ne rate rien.

TRANSITION — « Passons au document le plus fréquent : le compte rendu. »`,
  `⏱ 3 min · STRUCTURE D’UN COMPTE RENDU (6 clics)

OBJECTIF — Donner le plan à imposer à l’IA.

DIRE — Un clic par rubrique : « En-tête, objet, points abordés, décisions, actions, prochaine réunion. Si vous donnez ce plan, l’IA le suit. » Puis la consigne : « Et surtout trois règles : aucune décision absente des notes, À PRÉCISER pour ce qui manque, et on rapporte des positions, pas des propos personnels. »

TRANSITION — « Voyons la transformation complète. »`,
  `⏱ 5 min · NOTES → CR → PLAN D’ACTION (boutons)

OBJECTIF — Montrer la chaîne complète, cœur de l’atelier qui suit.

DIRE — Étape 1 : « Les notes de Nadia : abréviations, points d’interrogation, rien n’est rédigé. » Étape 2 : « Le compte rendu : structuré, avec une rubrique non tranché pour l’intervenant. » Étape 3 : « Le plan d’action : qui, quoi, quand. Et quand l’information manque, À PRÉCISER en rouge. »

ANIMATION — Revenir à l’étape 1 et demander : « L’IA a-t-elle bien tout repris ? » Cela prépare l’exercice suivant.

TRANSITION — « Justement, voici un compte rendu moins sage… »`,
  `⏱ 4 min · EXERCICE : 4 ERREURS (pastilles)

OBJECTIF — Entraîner l’œil à la vérification d’un compte rendu.

DIRE — « Voici un compte rendu généré à partir des mêmes notes, mais sans les consignes de sécurité. Il contient quatre erreurs. Comparez avec les notes. » Revenir si besoin à la page précédente. Cliquer chaque pastille au fil des trouvailles : « Un excusé devenu présent, un budget présenté comme validé, une décision inventée, une date inventée. »

INSISTER — Ces erreurs sont plausibles : on ne les voit pas en lisant, seulement en comparant. C’est la règle d’or du compte rendu : on relit avec les notes à côté.

TRANSITION — « Dernier usage : écrire une procédure. »`,
  `⏱ 3 min · CRÉER UNE PROCÉDURE (6 clics)

OBJECTIF — Montrer comment transformer une explication orale en procédure.

DIRE — « Nadia explique l’accueil des visiteurs à un intérimaire, comme on le fait tous, à l’oral. La demande impose la forme : numéroté, verbes à l’infinitif, une action par étape, et une rubrique en cas de problème. » Un clic par étape. « Le test ultime : donner la procédure à quelqu’un qui ne connaît pas la tâche. Là où il hésite, il manque une étape. »

TRANSITION — « Petit QCM. »`,
  `⏱ 2 min · QCM M4

OBJECTIF — Vérifier le réflexe d’extraction contrôlable.

DIRE — « Quelle consigne réduit le plus le risque d’erreur ? » Faire voter, cliquer la réponse de la majorité, puis révéler la bonne réponse et l’explication.

TRANSITION — « À vous : l’atelier compte rendu. »`,
  `⏱ 20 min · ATELIER 4 (minuteur)

OBJECTIF — Produire un compte rendu et un plan d’action fidèles à des notes brutes.

DIRE — « Voici les notes d’une réunion sur le déménagement des archives. Vingt minutes. Produisez le compte rendu avec les six rubriques, puis le plan d’action. Ensuite, échangez avec votre binôme : chacun relit le travail de l’autre, les notes sous les yeux. »

ANIMATION — Lancer le minuteur. Points à surveiller : la date de janvier suivie d’un point d’interrogation (non décidée), le budget non évoqué (à signaler), les documents RH (sujet sensible à traiter à part). Faire lire un plan d’action en fin d’atelier.

TRANSITION — « Vos documents sont faits. Voyons maintenant comment l’IA peut organiser votre travail. Module 5. »`,
  `⏱ 1 min · SECTION MODULE 5 · 14:30

OBJECTIF — Annoncer un module court et très pratique.

DIRE — « Module 5 : l’organisation du travail. L’IA ne remplacera pas votre agenda, mais elle est très bonne pour proposer une structure : un planning, un ordre du jour, une checklist, un rétroplanning. Elle propose, vous arbitrez. »

TRANSITION — « Commençons par la question de tous les matins : par quoi je commence ? »`,
  `⏱ 6 min · PRIORISER (glisser-déposer, 1 clic pour la solution)

OBJECTIF — Rappeler la matrice urgent / important et montrer que l’IA peut faire un premier tri.

DIRE — « Huit tâches de Nadia ce matin. Quatre cases : urgent et important, je fais ; important mais pas urgent, je planifie ; urgent mais pas important, je fais vite ou je délègue ; ni l’un ni l’autre, j’abandonne. À vous de placer les étiquettes. »

ANIMATION — Faire glisser selon les propositions du groupe, débattre, puis clic pour la solution. Montrer ensuite le prompt en bas à gauche : l’IA peut proposer ce tri, avec une justification par tâche, mais elle ne sait pas que le client mécontent est votre plus gros client. C’est vous qui arbitrez.

TRANSITION — « Une fois les priorités posées, on construit la journée. »`,
  `⏱ 4 min · ORGANISER SA JOURNÉE (4 clics)

OBJECTIF — Montrer un planning de journée proposé à partir de contraintes.

DIRE — « La demande donne les tâches et les contraintes : la réunion de 10 h, le déjeuner, l’heure de départ, et des règles : l’important le matin, des blocs de concentration, de la marge. » Clics successifs pour faire apparaître le planning. « Le dossier de subvention en bloc protégé le matin, le client rappelé avant midi, les tâches légères en fin de journée. Les tâches du quatrième quadrant sont repoussées. » Dernier clic : « C’est une proposition : l’IA ne connaît ni votre énergie ni les imprévus de votre directeur. »

TRANSITION — « Autre grand consommateur de temps : les réunions. »`,
  `⏱ 5 min · PRÉPARER UNE RÉUNION (onglets)

OBJECTIF — Montrer l’aide de l’IA avant, pendant et après une réunion.

DIRE — Onglet Avant : « Un ordre du jour minuté, avec un responsable et un objectif par point : informer ou décider. » Onglet Pendant : « Une trame de prise de notes déjà rangée par point, avec les cases décision, action, questions. Avec ça, le compte rendu prend cinq minutes. » Onglet Après : « Le compte rendu, l’email de diffusion et des rappels à programmer avant chaque échéance. »

INSISTER — Le lien avec le module 4 : la trame de notes rend le compte rendu beaucoup plus fiable.

TRANSITION — « Les checklists, maintenant. »`,
  `⏱ 4 min · CRÉER UNE CHECKLIST (interactive)

OBJECTIF — Montrer une checklist générée et rangée par moment.

DIRE — « La demande impose une organisation par moment, de J − 7 à J + 7, et une règle : une ligne égale une action vérifiable. Voici le résultat. » Cocher quelques lignes pour montrer le score. « Et la question magique : qu’ai-je oublié ? L’IA suggère souvent les accès, la mutuelle, la carte de visite. »

ANIMATION — Demander au groupe ce qui manque à leurs yeux : il y a toujours une particularité de l’entreprise que l’IA ne peut pas connaître.

TRANSITION — « Pour les projets plus longs : le rétroplanning. »`,
  `⏱ 3 min · RÉTROPLANNING (4 clics)

OBJECTIF — Montrer un planning de projet généré à partir d’une date cible.

DIRE — « Séminaire le 20 mars. On part de la date et on remonte. » Clics : « Valider budget et date, réserver lieu et traiteur, construire le programme, envoyer les invitations, relancer, préparer la logistique. On demande un tableau prêt pour Excel pour le retravailler. » Dernier clic : « Les durées sont des durées types : vérifiez les vacances scolaires, les jours fériés et les délais réels de vos prestataires. »

TRANSITION — « Tout ce que vous refaites régulièrement mérite un modèle. »`,
  `⏱ 4 min · MODÈLES RÉUTILISABLES (cartes à retourner)

OBJECTIF — Faire le lien avec la bibliothèque de prompts : des modèles de documents cette fois.

DIRE — « Six modèles qui font gagner du temps chaque mois. Je retourne une carte : voici la demande pour créer le modèle. » Retourner deux ou trois cartes. « Notez l’usage des champs entre crochets, comme pour les prompts. Et la procédure pour votre remplaçant : c’est la mémoire du poste, très utile pendant vos congés. »

ANIMATION — Demander à chacun de choisir le modèle qu’il créera en premier en rentrant.

TRANSITION — « Petit quiz, puis pause. »`,
  `⏱ 3 min · QUIZ M5 (4 questions)

OBJECTIF — Valider les notions d’organisation.

DIRE — « Quatre questions rapides. »

ANIMATION — Cliquer la réponse majoritaire, lire les explications.

TRANSITION — « Pause de dix minutes. On reprend avec les tableaux et les données. »`,
  `⏱ 1 min · SECTION MODULE 6 · 15:20

OBJECTIF — Annoncer le module données, souvent redouté, et le dédramatiser.

DIRE — « Module 6 : les tableaux et les données. Pas besoin d’être expert d’Excel. L’IA est très utile pour commenter un tableau, repérer des tendances, nettoyer une liste, structurer des informations, rédiger un reporting. Une règle à retenir pour tout le module : l’IA commente, le tableur calcule. »

TRANSITION — « Premier exemple : analyser un tableau. »`,
  `⏱ 5 min · ANALYSER UN TABLEAU (4 clics)

OBJECTIF — Montrer la valeur de l’analyse… et le risque de calcul.

DIRE — « Un tableau de dépenses de fournitures. On demande une analyse en quatre points. » Clic 1 : « Septembre en forte hausse : c’est juste, + 48 %. » Clic 2 : « Les RH ont quadruplé leur dépense : bien vu, et l’IA présente l’explication comme une hypothèse. » Clic 3 : « La production pèse 42 % : juste. » Clic 4 : « Et le total : 14 980 euros. Faux. Le tableur dit 14 880. L’IA a mal additionné, avec le même aplomb que pour le reste. »

INSISTER — L’IA repère très bien ce qui est inhabituel. Les calculs, eux, se font dans le tableur.

TRANSITION — « Sur une année entière, on peut chercher des tendances. »`,
  `⏱ 4 min · TENDANCES (3 clics)

OBJECTIF — Distinguer évolution, saisonnalité et hypothèse.

DIRE — « Douze mois de demandes reçues à l’accueil. La demande est précise : distingue saisonnalité et évolution, et présente toute explication comme une hypothèse. » Clics : « Une hausse régulière au premier semestre. Un creux en été, peut-être la fermeture estivale : à comparer avec l’an dernier. Un pic à l’automne : faut-il un renfort ? »

INSISTER — Les points d’interrogation sont voulus : l’IA voit les chiffres, pas les causes. Les causes, c’est vous qui les connaissez.

TRANSITION — « Avant d’analyser, il faut souvent nettoyer. »`,
  `⏱ 4 min · NETTOYER (interrupteur)

OBJECTIF — Montrer le nettoyage d’une liste et ses limites.

DIRE — « Une liste de contacts typique : majuscules au hasard, téléphones dans tous les formats, dates de trois façons, un doublon, une ville manquante. » Basculer. « Nom et prénom séparés, formats harmonisés, doublon supprimé, manque signalé. Mais regardez “15 janvier” : l’IA a supposé 2025 et l’a signalé. Il faut contrôler chaque supposition. »

INSISTER — L’encadré rouge : une vraie liste de contacts contient des données personnelles. Avec un outil non autorisé, on demande la méthode et les formules, on n’envoie pas les données.

TRANSITION — « Une fois les données propres, on peut les raconter. »`,
  `⏱ 3 min · SYNTHÈSE (3 clics)

OBJECTIF — Transformer un tableau en texte pour un décideur.

DIRE — « Même tableau, autre demande : cinq lignes pour le directeur financier, chiffres arrondis, une recommandation. » Clics : « Le total arrondi, la répartition, le mois de septembre, et une recommandation concrète. Avant d’envoyer : chaque chiffre de la synthèse doit se retrouver dans le tableau. »

TRANSITION — « L’IA peut aussi faire l’inverse : transformer du texte en tableau. »`,
  `⏱ 4 min · TABLEAUX STRUCTURÉS ET FORMULES (3 clics)

OBJECTIF — Montrer la structuration d’informations éparses et l’aide aux formules.

DIRE — « Trois emails d’inscription, rédigés chacun à sa manière. On demande un tableau avec des colonnes imposées, et un point d’interrogation quand l’info manque. » Clic 1 : « Le tableau : les noms manquants et la session hésitante d’Hugo sont signalés. Le fauteuil est devenu un besoin d’accès PMR. » Clic 2 et 3 : « Et l’IA peut écrire la formule Excel dont vous avez besoin. NB.SI compte les inscrits par session. »

INSISTER — Une formule se teste sur quelques lignes dont on connaît le résultat avant de lui faire confiance.

TRANSITION — « Dernier usage : le reporting mensuel. »`,
  `⏱ 4 min · REPORTING (2 clics)

OBJECTIF — Montrer un reporting régulier : chiffres du tableur, commentaire de l’IA, modèle réutilisable.

DIRE — « Quatre indicateurs du mois, calculés dans le tableur. » Clic 1 : « Le prompt modèle : trois faits marquants, un point de vigilance, une action. Et deux consignes clés : n’utilise que ces chiffres, ne recalcule rien. » Clic 2 : « Le commentaire obtenu. Chaque mois, même format : votre directeur sait où regarder. Quinze minutes au lieu d’une heure. »

TRANSITION — « Quiz, puis le grand final de la journée. »`,
  `⏱ 3 min · QUIZ M6 (4 questions)

OBJECTIF — Ancrer la règle « l’IA commente, le tableur calcule » et le réflexe données personnelles.

DIRE — « Quatre questions. »

ANIMATION — Cliquer les réponses majoritaires, lire les explications. La question 3 fait le lien avec le module final sur la confidentialité.

TRANSITION — « Vous avez tous les outils. Place au cas fil rouge, qui reprend toute la journée. »`,
  `⏱ 1 min · SECTION CAS FIL ROUGE · 16:00

OBJECTIF — Annoncer la dernière heure : tout assembler, puis sécuriser.

DIRE — « Dernière ligne droite. On va reprendre toute la journée sur un seul cas : une demande arrive, on la traite de bout en bout, de la réception jusqu’au suivi. Puis on termine par ce qui conditionne tout le reste : vérifier, protéger les données, et les bonnes pratiques professionnelles. »

TRANSITION — « Voici la demande. »`,
  `⏱ 3 min · LE CAS FIL ROUGE (6 clics)

OBJECTIF — Présenter la demande et la chaîne en six étapes.

DIRE — « Lundi, 8 h 12, un email arrive sur l’adresse générique. Mme Benali veut 12 postes de travail, une table de réunion, un budget, une échéance… et une question sur la reprise des anciens bureaux. » Un clic par étape : « Réception : on qualifie. Analyse : on extrait et on repère ce qui manque. Rédaction : on répond. Document : on prépare la fiche interne. Synthèse : on informe le directeur. Suivi : on programme les relances. Chaque étape mobilise un module de la journée. » Dernier clic : « Le principe : un prompt par étape, et vous relisez avant de passer à la suivante. »

TRANSITION — « Voyons chaque étape. »`,
  `⏱ 6 min · ÉTAPE PAR ÉTAPE (onglets)

OBJECTIF — Montrer le prompt et le résultat de chaque étape.

DIRE — Cliquer chaque onglet. « 1 : classer la demande, avec une justification de l’urgence. 2 : extraire dans un tableau, et surtout lister ce qui manque. 3 : l’accusé de réception, qui pose les questions manquantes et ne s’engage ni sur la reprise ni sur le délai. 4 : la fiche interne pour le commercial. 5 : trois lignes pour M. Garnier, avec la décision qu’il doit prendre. 6 : le suivi : ligne de tableau, relance, rappel. »

INSISTER — L’étape 3 : sans la contrainte « ne t’engage pas », l’IA aurait volontiers promis la reprise des bureaux.

TRANSITION — « À vous de jouer sur une nouvelle demande. »`,
  `⏱ 25 min · ATELIER FINAL (minuteur)

OBJECTIF — Appliquer toute la journée à un cas nouveau, en binôme.

DIRE — « Une nouvelle demande, de M. Caron, d’une école. Attention : elle contient une réclamation et une commande. Deux traitements, deux tons. Vous produisez les six étapes, en relisant chacune. Vingt-cinq minutes. Rangez vos prompts dans votre bibliothèque. »

ANIMATION — Lancer le minuteur. Passer dans les rangs : vérifier que la réclamation est traitée avec A-R-S-S, qu’aucun remplacement gratuit n’est promis sans décision, et que les informations manquantes (références des chaises, date de livraison, adresse) sont listées. Garder dix minutes en fin d’atelier pour deux ou trois restitutions d’une minute.

TRANSITION — « Avant de conclure, la grille de vérification. »`,
  `⏱ 3 min · VÉRIFIER LES RÉSULTATS (checklist)

OBJECTIF — Donner une grille de vérification simple et réutilisable.

DIRE — « Six points à passer sur chaque texte produit par l’IA. Les faits, les chiffres, les noms : c’est là que se cachent les inventions. Les engagements : aucune promesse non décidée. Le ton. Et les données : rien de confidentiel. » Cocher les lignes avec le groupe en reprenant l’email de l’atelier. « Plus l’enjeu est fort, plus la vérification est poussée, et plus on fait valider. »

TRANSITION — « Le dernier point mérite qu’on s’y arrête : les données. »`,
  `⏱ 4 min · FEU TRICOLORE (3 clics)

OBJECTIF — Donner une règle simple pour savoir ce qu’on peut coller.

DIRE — Clic 1 : « Vert : informations publiques, textes génériques, questions de méthode. Aucun risque. » Clic 2 : « Orange : emails clients, comptes rendus, chiffres internes. Uniquement avec l’outil professionnel autorisé, et après anonymisation. » Clic 3 : « Rouge : santé, salaires, coordonnées bancaires, mots de passe, données RH, contrats confidentiels. Jamais, sauf règle interne explicite. » Puis : « Et au-dessus de tout, la politique de votre organisation. En cas de doute, demandez au service informatique ou au délégué à la protection des données. »

ANIMATION — Faire classer à l’oral deux ou trois exemples apportés par le groupe.

TRANSITION — « Comment anonymiser concrètement ? »`,
  `⏱ 3 min · ANONYMISER (interrupteur)

OBJECTIF — Montrer une anonymisation simple et efficace.

DIRE — « Une demande banale : un courrier à un salarié. Mais regardez : nom, adresse, numéro de sécurité sociale, téléphone, et un motif médical. Cinq données personnelles. » Basculer. « Chaque donnée devient un champ entre crochets. L’IA rédige le courrier aussi bien, et vous remplacez les champs dans Word. Notez que le motif médical reste sensible même sans le nom : on le remplace aussi. »

INSISTER — La phrase du RGPD : coller une donnée personnelle dans un service non validé, c’est la transmettre à un tiers.

TRANSITION — « Pour finir, votre charte personnelle. »`,
  `⏱ 3 min · CHARTE DES BONNES PRATIQUES (6 clics)

OBJECTIF — Synthétiser les règles professionnelles de la journée.

DIRE — Un clic par règle : « Je respecte la politique interne. Je protège les données. Je vérifie tout ce qui sort. Je signe, donc j’assume : l’IA n’est jamais responsable, vous l’êtes. Je reste transparente quand la règle ou le contexte l’exige. Et je capitalise : prompts et modèles partagés. » Dernier clic : la citation.

TRANSITION — « Un dernier quiz pour valider la journée. »`,
  `⏱ 4 min · QUIZ FINAL (5 questions)

OBJECTIF — Évaluer les acquis de la journée, notamment sécurité et vérification.

DIRE — « Cinq questions qui reprennent toute la journée. »

ANIMATION — Cliquer les réponses majoritaires, lire les explications. Le score s’affiche à la fin : le commenter positivement.

TRANSITION — « Mesurons votre progression. »`,
  `⏱ 3 min · AUTO-POSITIONNEMENT FINAL

OBJECTIF — Mesurer la progression, exigence du dispositif d’évaluation.

DIRE — « Les huit mêmes affirmations que ce matin. Cochez ce que vous savez faire maintenant, sans aide. Comparez avec votre score de ce matin et notez l’écart sur la fiche d’évaluation. »

ANIMATION — Faire un tour rapide : « Qui a gagné plus de trois points ? » Valoriser la progression.

TRANSITION — « Et maintenant, que faites-vous lundi ? »`,
  `⏱ 3 min · PLAN D’ACTION (sondage)

OBJECTIF — Transformer la formation en engagements concrets.

DIRE — « Quatre horizons. Lundi : vérifier l’outil autorisé et se connecter avec le compte pro. Cette semaine : votre tâche numéro un de ce matin. Ce mois-ci : trois modèles partagés. Et toujours : le feu tricolore et la grille de vérification. » Puis le sondage : « Quelle tâche allez-vous confier à l’IA en premier ? »

ANIMATION — Cliquer une ligne par vote. Comparer avec le sondage du matin sur les tâches chronophages.

TRANSITION — « Il ne me reste qu’à vous remercier. »`,
  `⏱ 2 min · MERCI · 17:00

OBJECTIF — Clore sur le fil conducteur et les suites.

DIRE — « Merci pour votre participation et votre énergie. Vous repartez avec une méthode, R-C-T-C-F, une bibliothèque de prompts, et des réflexes de sécurité. Le reste, c’est la pratique : un peu chaque jour. Je vous envoie la bibliothèque commune construite aujourd’hui. Et souvenez-vous : l’IA prépare, vous vérifiez, vous signez. »

ANIMATION — Distribuer ou rappeler la fiche d’évaluation à chaud. Laisser la page affichée pendant les questions.`,
];
