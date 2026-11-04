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
const FONT_LINK_ID = 'osd-webfont-vibe-coding-docaposte';
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
const SLIDE_ID = 'vibe-coding-docaposte';
const P = 'vc'; // CSS class prefix, unique per deck
const COURSE = 'Vibe Coding · Créer des mini-apps interactives avec l’IA';
const AUTHOR = 'Houssem Eddine LASSOUED';
const PROJECT = 'VibePulse';

// Modules: 0 = ouverture, 1–6 = Jour 1, 7–10 = Jour 2, 11–14 = Jour 3.
const MOD_TITLES: Record<number, string> = {
  0: 'Ouverture & Fil rouge',
  1: 'Programmer en Vibe Coding avec l’IA',
  2: 'Variables, types & état de l’interface',
  3: 'Conditions & boucles visuelles',
  4: 'Fonctions & actions d’interface',
  5: 'Entrées / sorties UI & Prompt itératif',
  6: 'TP Jour 1 · VibeQuiz & VibeCalc',
  7: 'Listes & objets : les cartes de données',
  8: 'Code propre, découpage & auto-tests',
  9: 'Données JSON / CSV & visualisations',
  10: 'TP Jour 2 · TaskFlow, le Kanban complet',
  11: 'Passer à VS Code : Ask, Edit & Agent',
  12: 'Instructions, Skill & équipe de 3 agents',
  13: 'Fonctionnalité phare orchestrée par 3 agents',
  14: 'GitHub, GitHub Pages & démo finale',
};
const dayOf = (mod: number) => (mod <= 6 ? 1 : mod <= 10 ? 2 : 3);

// ─── Palette (Docaposte Institute) ──────────────────────────────────────────
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
  lilac: '#AEB9E6',
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
const EASE_BACK = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

const SHADOW = '0 0 0 1px rgba(16, 24, 40, 0.06), 0 18px 40px -26px rgba(11, 31, 92, 0.40)';
const SHADOW_SM = '0 0 0 1px rgba(16, 24, 40, 0.07), 0 8px 20px -14px rgba(11, 31, 92, 0.45)';

// ─── Small helpers ──────────────────────────────────────────────────────────
const vars = (o: Record<string, string | number>): CSSProperties => {
  const out: Record<string, string | number> = {};
  for (const key of Object.keys(o)) out[`--${key}`] = o[key];
  return out as CSSProperties;
};
const dl = (ms: number): CSSProperties => vars({ d: `${ms}ms` });
const cx = (...xs: (string | false | null | undefined)[]) => xs.filter(Boolean).join(' ');
const pad = (n: number) => String(n).padStart(2, '0');
const clock = (s: number) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
const fr = (x: number, digits = 0) => {
  const [i, d] = Math.abs(x).toFixed(digits).split('.');
  const s = i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (d ? `,${d}` : '');
  return x < 0 ? `−${s}` : s;
};

// ─── Stylesheet (collected from every component, injected once at the bottom)
const CSS: string[] = [];
const k = (name: string) => `${P}-${name}`;
const at = (n: number) => `.${P}-page:has([data-osd-step="revealed"] > .${P}-k${n})`;

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
  pulse: k('pulse'),
  march: k('march'),
  float: k('float'),
  blink: k('blink'),
  glow: k('glow'),
};

const b = {
  on: (n: number) => k(`on${n}`),
  fade: (n: number) => k(`fd${n}`),
  pop: (n: number) => k(`pp${n}`),
  left: (n: number) => k(`lf${n}`),
  draw: (n: number) => k(`dr${n}`),
  grow: (n: number) => k(`gr${n}`),
  growY: (n: number) => k(`gy${n}`),
  dim: (n: number) => k(`dm${n}`),
  off: (n: number) => k(`of${n}`),
  hi: (n: number) => k(`hi${n}`),
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
@keyframes ${P}-pulse{0%{opacity:.7;transform:scale(1)}100%{opacity:0;transform:scale(2.4)}}
@keyframes ${P}-march{to{stroke-dashoffset:-24}}
@keyframes ${P}-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes ${P}-blink{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes ${P}-glow{0%,100%{box-shadow:0 0 0 0 rgba(10,98,208,0)}50%{box-shadow:0 0 0 12px rgba(10,98,208,.18)}}
.${P}-live .${P}-in{animation:${P}-rise 750ms ${EASE} var(--d,0ms) both}
.${P}-live .${P}-in-fade{animation:${P}-fade 850ms ${EASE} var(--d,0ms) both}
.${P}-live .${P}-in-left{animation:${P}-left 750ms ${EASE} var(--d,0ms) both}
.${P}-live .${P}-in-right{animation:${P}-right 750ms ${EASE} var(--d,0ms) both}
.${P}-live .${P}-in-down{animation:${P}-down 750ms ${EASE} var(--d,0ms) both}
.${P}-in-grow{transform-origin:left center}
.${P}-live .${P}-in-grow{animation:${P}-grow 950ms ${EASE} var(--d,0ms) both}
.${P}-in-growy{transform-origin:center bottom;transform-box:fill-box}
.${P}-live .${P}-in-growy{animation:${P}-growy 950ms ${EASE} var(--d,0ms) both}
.${P}-live .${P}-in-pop{animation:${P}-pop 680ms ${EASE} var(--d,0ms) both}
.${P}-in-draw{stroke-dasharray:1 2}
.${P}-live .${P}-in-draw{animation:${P}-draw 1300ms ${EASE} var(--d,0ms) both}
.${P}-pulse{transform-box:fill-box;transform-origin:center;opacity:0}
.${P}-live .${P}-pulse{animation:${P}-pulse 2s ${EASE_OUT} var(--d,0ms) infinite}
.${P}-live .${P}-march{animation:${P}-march 1.2s linear infinite}
.${P}-live .${P}-float{animation:${P}-float 4s ease-in-out var(--d,0ms) infinite}
.${P}-live .${P}-blink{animation:${P}-blink 1.2s ease-in-out infinite}
.${P}-live .${P}-glow{animation:${P}-glow 2.4s ease-in-out infinite}
.${P}-range{-webkit-appearance:none;appearance:none;height:12px;border-radius:6px;background:${C.panel};outline:none;cursor:pointer}
.${P}-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:28px;height:28px;border-radius:50%;background:${C.electric};box-shadow:0 2px 8px rgba(11,31,92,.45);cursor:pointer}
.${P}-flip{perspective:1800px;cursor:pointer}
.${P}-flip-in{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform 700ms ${EASE}}
.${P}-flipped > .${P}-flip-in{transform:rotateY(180deg)}
.${P}-flip-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;box-sizing:border-box;border-radius:18px;display:flex;flex-direction:column}
.${P}-hs-tip{opacity:0;transform:translateY(10px) scale(.98);pointer-events:none;transition:opacity 350ms ${EASE},transform 450ms ${EASE}}
.${P}-hs-open + .${P}-hs-tip{opacity:1;transform:none}
`);

for (let n = 1; n <= 12; n++) {
  const has = at(n);
  CSS.push(`
.${P}-on${n}{opacity:0;transform:translateY(16px);transition:opacity 500ms ${EASE} var(--d,0ms),transform 680ms ${EASE} var(--d,0ms)}
${has} .${P}-on${n}{opacity:1;transform:none}
.${P}-fd${n}{opacity:0;transition:opacity 520ms ${EASE} var(--d,0ms)}
${has} .${P}-fd${n}{opacity:1}
.${P}-pp${n}{opacity:0;transform:scale(.55);transform-box:fill-box;transform-origin:var(--o,center);transition:opacity 300ms ${EASE} var(--d,0ms),transform 620ms ${EASE_BACK} var(--d,0ms)}
${has} .${P}-pp${n}{opacity:1;transform:none}
.${P}-lf${n}{opacity:0;transform:translateX(-28px);transition:opacity 500ms ${EASE} var(--d,0ms),transform 680ms ${EASE} var(--d,0ms)}
${has} .${P}-lf${n}{opacity:1;transform:none}
.${P}-dr${n}{stroke-dasharray:1 2;stroke-dashoffset:1.01;transition:stroke-dashoffset 950ms ${EASE} var(--d,0ms)}
${has} .${P}-dr${n}{stroke-dashoffset:0}
.${P}-gr${n}{transform:scaleX(0);transform-origin:left center;transition:transform 850ms ${EASE} var(--d,0ms)}
${has} .${P}-gr${n}{transform:none}
.${P}-gy${n}{transform:scaleY(0);transform-origin:center bottom;transform-box:fill-box;transition:transform 850ms ${EASE} var(--d,0ms)}
${has} .${P}-gy${n}{transform:none}
.${P}-dm${n}{transition:opacity 480ms ${EASE},filter 480ms ${EASE}}
${has} .${P}-dm${n}{opacity:.28;filter:grayscale(.7)}
.${P}-of${n}{transition:opacity 400ms ${EASE} var(--d,0ms)}
${has} .${P}-of${n}{opacity:0}
.${P}-hi${n}{transition:box-shadow 480ms ${EASE},transform 480ms ${EASE}}
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
  sparkles: (
    <>
      <path d="M12 3l2 5.5L19.5 10.5 14 12.5 12 18l-2-5.5-5.5-2 5.5-2z" />
      <path d="M19 16l.8 2.2 2.2.8-2.2.8L19 22l-.8-2.2-2.2-.8 2.2-.8z" />
    </>
  ),
  spark: <path d="M12 3l2.2 6.3L21 12l-6.8 2.7L12 21l-2.2-6.3L3 12l6.8-2.7z" />,
  wand: (
    <>
      <path d="M4 20L15 9M13 7l4 4" />
      <path d="M18 2.5v3M16.5 4h3M20.5 8.5v2M19.5 9.5h2M9 3v2M8 4h2" />
    </>
  ),
  code: <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" />,
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
  layers: <path d="M12 3L2.5 8 12 13 21.5 8 12 3zM2.5 12.5L12 17.5l9.5-5M2.5 17L12 22l9.5-5" />,
  puzzle: <path d="M9 3.5h3.5a2 2 0 1 1 4 0H20v4.5a2 2 0 1 0 0 4V16.5h-3.5a2 2 0 1 0-4 0H9V13a2 2 0 1 1 0-4z" />,
  target: (
    <>
      <circle cx={12} cy={12} r={9} />
      <circle cx={12} cy={12} r={5} />
      <circle cx={12} cy={12} r={1.6} {...dotFill} />
    </>
  ),
  check: <path d="M4.5 12.5l5 5 10-11" />,
  checkCircle: (
    <>
      <circle cx={12} cy={12} r={9} />
      <path d="M8 12.5l2.8 2.8L16.5 9.5" />
    </>
  ),
  x: <path d="M6 6l12 12M18 6L6 18" />,
  alert: (
    <>
      <path d="M12 3.5L2.5 20h19L12 3.5z" />
      <path d="M12 10v4.5" />
      <circle cx={12} cy={17.3} r={1} {...dotFill} />
    </>
  ),
  shield: <path d="M12 3l8 3.2v5.3c0 5-3.4 8.3-8 9.8-4.6-1.5-8-4.8-8-9.8V6.2z" />,
  lock: (
    <>
      <rect x={5} y={11} width={14} height={9} rx={2} />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  key: (
    <>
      <circle cx={8} cy={15} r={4} />
      <path d="M11 12l9-9M17 6l3 3M14 9l2.5 2.5" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx={12} cy={12} r={3} />
    </>
  ),
  search: (
    <>
      <circle cx={11} cy={11} r={7} />
      <path d="M20.5 20.5L16 16" />
    </>
  ),
  filter: <path d="M3.5 4.5h17l-6.5 8v6l-4 2v-8z" />,
  sliders: (
    <>
      <path d="M4 6h16M4 12h16M4 18h16" />
      <circle cx={9} cy={6} r={2.2} fill="#fff" />
      <circle cx={15} cy={12} r={2.2} fill="#fff" />
      <circle cx={11} cy={18} r={2.2} fill="#fff" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 17a8.5 8.5 0 1 1 16 0" />
      <path d="M12 14l4.5-4.5" />
      <circle cx={12} cy={14} r={1.6} {...dotFill} />
    </>
  ),
  trend: <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M21 20H3" />,
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
      <path d="M14 2.5v5h5M9 13h6M9 17h6" />
    </>
  ),
  folder: <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2.5h8.5A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z" />,
  save: (
    <>
      <path d="M5 3.5h11l3.5 3.5V19.5A1.5 1.5 0 0 1 18 21H5a1.5 1.5 0 0 1-1.5-1.5v-14.5A1.5 1.5 0 0 1 5 3.5z" />
      <path d="M8 3.5v5h7v-5M7.5 21v-6.5h9V21" />
    </>
  ),
  loop: (
    <>
      <path d="M17 3l3.5 3.5L17 10" />
      <path d="M4 11V9a2.5 2.5 0 0 1 2.5-2.5H20" />
      <path d="M7 21l-3.5-3.5L7 14" />
      <path d="M20 13v2a2.5 2.5 0 0 1-2.5 2.5H4" />
    </>
  ),
  reset: (
    <>
      <path d="M4 12a8 8 0 1 0 2.6-5.9" />
      <path d="M4 4v5h5" />
    </>
  ),
  play: <path d="M7 4.5l12 7.5-12 7.5z" />,
  pause: <path d="M8 5v14M16 5v14" />,
  clock: (
    <>
      <circle cx={12} cy={12} r={9} />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  calendar: (
    <>
      <rect x={3} y={5} width={18} height={16} rx={2} />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  chat: <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8A2.5 2.5 0 0 1 17.5 16H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5z" />,
  send: <path d="M21 3L10.5 13.5M21 3l-6.5 18-4-7.5L3 9.5z" />,
  bulb: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M8.5 14.5C7 13.3 6 11.5 6 9.5a6 6 0 1 1 12 0c0 2-1 3.8-2.5 5l-.8 1.5H9.3z" />
    </>
  ),
  star: <path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z" />,
  rocket: (
    <>
      <path d="M14 4c3 0 6 1 6 1s1 3 1 6c0 4-4 8-8 9l-4-4c1-4 5-8 9-8z" />
      <path d="M9 15l-4 4M5 13l-2 2 4 4 2-2" />
      <circle cx={15} cy={9} r={1.4} {...dotFill} />
    </>
  ),
  compass: (
    <>
      <circle cx={12} cy={12} r={9} />
      <polygon points="10,10 16,8 14,14 8,16" />
    </>
  ),
  globe: (
    <>
      <circle cx={12} cy={12} r={9} />
      <path d="M3 12h18M12 3c2.8 2.8 4 5.8 4 9s-1.2 6.2-4 9c-2.8-2.8-4-5.8-4-9s1.2-6.2 4-9z" />
    </>
  ),
  laptop: (
    <>
      <rect x={4} y={4.5} width={16} height={11} rx={2} />
      <path d="M2 18.5h20" />
    </>
  ),
  phone: (
    <>
      <rect x={6.5} y={2.5} width={11} height={19} rx={2.5} />
      <path d="M10.5 18.5h3" />
    </>
  ),
  grid: (
    <>
      <rect x={3.5} y={3.5} width={7} height={7} rx={1.5} />
      <rect x={13.5} y={3.5} width={7} height={7} rx={1.5} />
      <rect x={3.5} y={13.5} width={7} height={7} rx={1.5} />
      <rect x={13.5} y={13.5} width={7} height={7} rx={1.5} />
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
  link: (
    <>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </>
  ),
  arrow: <path d="M4.5 12h15M13.5 6l6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  upload: (
    <>
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 17v2a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 19v-2" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v12M7 11l5 5 5-5" />
      <path d="M4 17v2a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 19v-2" />
    </>
  ),
  gear: (
    <>
      <circle cx={12} cy={12} r={3.2} />
      <path d="M12 2.5v2.3M12 19.2v2.3M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.3M19.2 12h2.3M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7" />
    </>
  ),
};
type IconName = keyof typeof ICONS;

const Icon = ({
  name,
  size = 24,
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
    stroke={color}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cls}
    style={{ display: 'block', flex: 'none', ...style }}
    aria-hidden
  >
    {ICONS[name]}
  </svg>
);

const IconTile = ({
  name,
  tone = 'blue',
  size = 58,
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
      borderRadius: Math.round(size * 0.22),
      background: solid ? STRONG[tone] : T[tone].bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}
  >
    <Icon name={name} size={Math.round(size * 0.55)} color={solid ? (tone === 'yellow' ? C.ink : '#fff') : T[tone].fg} />
  </div>
);

// ─── Brand marks (theme: Docaposte Institute) ───────────────────────────────
const DapMark = ({ h = 28, color = '#1E22E8', style }: { h?: number; color?: string; style?: CSSProperties }) => (
  <svg width={(h * 58) / 30} height={h} viewBox="0 0 58 30" style={{ display: 'block', flex: 'none', ...style }} aria-hidden>
    <rect x={6} y={0} width={40} height={6} rx={3} fill={color} />
    <rect x={16} y={12} width={42} height={6} rx={3} fill={color} />
    <rect x={0} y={24} width={42} height={6} rx={3} fill={color} />
  </svg>
);

const DAP_LS = 0.09;
const DapLogo = ({ size = 26, color = '#1E22E8' }: { size?: number; color?: string }) => (
  <div
    role="img"
    aria-label="Docaposte Institute"
    style={{
      display: 'inline-flex',
      flex: 'none',
      paddingTop: size * 0.25,
      paddingRight: size * 1.1,
      color,
      fontFamily: display,
      lineHeight: 1,
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <span style={{ position: 'relative', fontWeight: 600, fontSize: size, letterSpacing: `${DAP_LS}em`, marginRight: `-${DAP_LS}em`, whiteSpace: 'nowrap' }}>
        DOCAPOSTE
        <DapMark
          h={size * 0.47}
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

const BrandStripe = () => (
  <>
    <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 7, background: G.brand }} />
    <div style={{ position: 'absolute', left: 0, top: 7, bottom: 0, width: 16, background: C.navy, borderRadius: '0 16px 16px 0' }} />
  </>
);

const Slab = ({ x, y, w, h, r = 56, children }: { x: number; y: number; w: number; h: number; r?: number; children?: ReactNode }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: r,
      background: G.navy,
      boxShadow: '0 30px 60px -30px rgba(11,31,92,.55)',
    }}
  >
    {children}
  </div>
);

const Outline = ({ x, y, w, h, r = 40, color = C.navy }: { x: number; y: number; w: number; h: number; r?: number; color?: string }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, boxShadow: `inset 0 0 0 2.5px ${color}` }} />
);

const Signature = () => (
  <div style={{ transform: 'rotate(-7deg)', fontFamily: '"Mr Dafoe", "Segoe Script", cursive', fontSize: 78, color: C.electric, lineHeight: 1, whiteSpace: 'nowrap' }}>
    Together we grow
  </div>
);

const Portrait = ({ w = 170, x, y, cls }: { w?: number; x: number; y: number; cls?: string }) => {
  const h = Math.round((w * 275) / 230);
  return (
    <div className={cls} style={{ position: 'absolute', left: x, top: y, width: w, height: h }}>
      <div style={{ position: 'absolute', left: Math.round(w * 0.1), top: Math.round(w * 0.1), width: w, height: h, borderRadius: 26, boxShadow: `inset 0 0 0 3px ${C.violet}` }} />
      <img
        src={formateur}
        alt={AUTHOR}
        style={{ position: 'relative', display: 'block', width: w, height: h, objectFit: 'cover', borderRadius: 22, border: `4px solid ${C.navy}`, boxSizing: 'border-box', boxShadow: '0 24px 50px -24px rgba(11,31,92,.6)' }}
      />
    </div>
  );
};

// ─── Typography & layout primitives ─────────────────────────────────────────
const Eyebrow = ({ children, c = C.electric, size = 22, cls, style }: { children: ReactNode; c?: string; size?: number; cls?: string; style?: CSSProperties }) => (
  <div
    className={cls}
    style={{ fontFamily: display, fontWeight: 600, fontSize: size, letterSpacing: '0.14em', textTransform: 'uppercase', color: c, ...style }}
  >
    {children}
  </div>
);

const Title = ({ children, top = 104, size = 52, w = 1680, cls }: { children: ReactNode; top?: number; size?: number; w?: number; cls?: string }) => (
  <h2
    className={cls}
    style={{ position: 'absolute', left: 120, top: top, margin: 0, maxWidth: w, fontFamily: display, fontWeight: 800, fontSize: '38px', lineHeight: 1.12, letterSpacing: '-0.01em', color: C.navy }}
  >
    {children}
  </h2>
);

const Lede = ({ children, top = 180, w = 1640, cls }: { children: ReactNode; top?: number; w?: number; cls?: string }) => (
  <p className={cls} style={{ position: 'absolute', left: 120, top, margin: 0, maxWidth: w, fontSize: 27, lineHeight: 1.42, color: C.soft }}>
    {children}
  </p>
);

const Hl = ({ children, c = 'rgba(116, 66, 224, 0.20)' }: { children: ReactNode; c?: string }) => (
  <mark style={{ background: `linear-gradient(transparent 58%, ${c} 58%)`, color: 'inherit', padding: '0 3px' }}>{children}</mark>
);

const Strong = ({ children, c = C.blue }: { children: ReactNode; c?: string }) => (
  <strong style={{ fontWeight: 600, color: c }}>{children}</strong>
);

const Ic = ({ children }: { children: ReactNode }) => {
  const long = typeof children === 'string' && children.length > 30;
  return (
    <code
      style={{
        fontFamily: mono,
        background: C.panel,
        color: C.navy,
        padding: '1px 9px',
        borderRadius: 8,
        fontSize: '0.9em',
        whiteSpace: long ? 'normal' : 'nowrap',
        overflowWrap: 'anywhere',
        boxDecorationBreak: 'clone',
        WebkitBoxDecorationBreak: 'clone',
      }}
    >
      {children}
    </code>
  );
};

// Long prompt to copy: wraps on several lines (unlike Ic).
const Pr = ({ children }: { children: ReactNode }) => (
  <span
    style={{
      display: 'block',
      marginTop: 8,
      padding: '8px 14px',
      borderRadius: 10,
      background: T.violet.bg,
      borderLeft: `5px solid ${C.violet}`,
      color: C.ink,
      fontSize: '0.86em',
      lineHeight: 1.4,
      fontStyle: 'italic',
      whiteSpace: 'normal',
      overflowWrap: 'anywhere',
    }}
  >
    {children}
  </span>
);

const PathChip = ({ children }: { children: ReactNode }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: mono, fontSize: '0.9em', fontWeight: 600, background: T.navy.bg, color: C.navy, borderRadius: 8, padding: '2px 10px', boxShadow: `inset 0 0 0 1.5px ${T.navy.bd}` }}>
    <Icon name="doc" size={18} color={C.electric} />
    {children}
  </span>
);

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

const Grid = ({ top = 270, cols = 3, gap = 26, left = 120, w = 1680, style, children }: { top?: number; cols?: number; gap?: number; left?: number; w?: number; style?: CSSProperties; children: ReactNode }) => (
  <div style={{ position: 'absolute', left, top, width: w, display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap, ...style }}>{children}</div>
);

const Col = ({ gap = 18, w, style, children }: { gap?: number; w?: number; style?: CSSProperties; children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap, width: w, ...style }}>{children}</div>
);

const Bullet = ({ children, size = 28, c = C.ink, cls, d = 0, style }: { children: ReactNode; size?: number; c?: string; cls?: string; d?: number; style?: CSSProperties }) => (
  <div className={cls ?? A.in} style={{ ...dl(d), display: 'flex', alignItems: 'flex-start', gap: 18, fontSize: size, lineHeight: 1.36, color: c, ...style }}>
    <DapMark h={Math.round(size * 0.55)} color={C.electric} style={{ marginTop: Math.round(size * 0.4) }} />
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

const Num = ({ n, tone = 'blue', size = 46, cls, style }: { n: number | string; tone?: Tone; size?: number; cls?: string; style?: CSSProperties }) => (
  <span
    className={cls}
    style={{
      flex: 'none',
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: Math.round(size * 0.26),
      background: STRONG[tone],
      color: '#fff',
      fontFamily: display,
      fontWeight: 800,
      fontSize: Math.round(size * 0.52),
      lineHeight: 1,
      ...style,
    }}
  >
    {n}
  </span>
);

const Tag = ({ tone = 'blue', children, size = 20, icon, cls, style }: { tone?: Tone; children: ReactNode; size?: number; icon?: IconName; cls?: string; style?: CSSProperties }) => (
  <span
    className={cls}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: T[tone].bg,
      color: T[tone].fg,
      boxShadow: `inset 0 0 0 1.5px ${T[tone].bd}`,
      borderRadius: 999,
      padding: '5px 15px',
      fontFamily: display,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.15,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {icon ? <Icon name={icon} size={size + 1} color={T[tone].fg} sw={2.3} /> : null}
    {children}
  </span>
);

// ─── Cards, Callouts & Notes ────────────────────────────────────────────────
const Card = ({
  title,
  tone = 'blue',
  icon,
  children,
  cls,
  d = 0,
  style,
  tsz = 27,
  bsz = 23,
  bar = true,
  pad: p = 26,
}: {
  title?: ReactNode;
  tone?: Tone;
  icon?: IconName;
  children?: ReactNode;
  cls?: string;
  d?: number;
  style?: CSSProperties;
  tsz?: number;
  bsz?: number;
  bar?: boolean;
  pad?: number;
}) => (
  <div
    className={cls ?? A.in}
    style={{
      ...dl(d),
      position: 'relative',
      boxSizing: 'border-box',
      background: C.card,
      borderRadius: 18,
      boxShadow: SHADOW,
      padding: p,
      paddingTop: bar ? p + 6 : p,
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }}
  >
    {bar ? <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 7, borderRadius: '18px 18px 0 0', background: tone === 'blue' ? G.blue : STRONG[tone] }} /> : null}
    {icon || title ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: children ? 12 : 0 }}>
        {icon ? <IconTile name={icon} tone={tone} size={52} /> : null}
        {title ? <div style={{ fontFamily: display, fontWeight: 700, fontSize: tsz, color: C.ink, lineHeight: 1.18 }}>{title}</div> : null}
      </div>
    ) : null}
    {children ? <div style={{ fontSize: bsz, lineHeight: 1.44, color: C.soft, flex: 1 }}>{children}</div> : null}
  </div>
);

const Callout = ({
  title = 'À retenir',
  label,
  tone = 'yellow',
  icon = 'bulb',
  children,
  size = 25,
  cls,
  d = 0,
  style,
}: {
  title?: ReactNode;
  label?: ReactNode;
  tone?: Tone;
  icon?: IconName;
  children: ReactNode;
  size?: number;
  cls?: string;
  d?: number;
  style?: CSSProperties;
}) => {
  const heading = label ?? title;
  return (
    <div
      className={cls ?? A.in}
      style={{
        ...dl(d),
        display: 'flex',
        gap: 20,
        alignItems: 'flex-start',
        boxSizing: 'border-box',
        background: T[tone].bg,
        borderLeft: `7px solid ${STRONG[tone]}`,
        borderRadius: 14,
        padding: '16px 24px',
        ...style,
      }}
    >
      <Icon name={icon} size={32} color={T[tone].fg} style={{ marginTop: 2 }} />
      <div style={{ flex: 1 }}>
        {heading ? (
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 19, letterSpacing: '0.1em', textTransform: 'uppercase', color: T[tone].fg, marginBottom: 4 }}>
            {heading}
          </div>
        ) : null}
        <div style={{ fontSize: size, lineHeight: 1.4, color: C.ink }}>{children}</div>
      </div>
    </div>
  );
};
const Note = Callout;

// ─── Animated counters & stats ──────────────────────────────────────────────
const CountUp = ({
  to,
  dur = 1400,
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

const Stat = ({ value, label, tone = 'blue', size = 110, cls, d = 0 }: { value: ReactNode; label: ReactNode; tone?: Tone; size?: number; cls?: string; d?: number }) => (
  <div className={cls ?? A.pop} style={{ ...dl(d), textAlign: 'center' }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: size, lineHeight: 1, color: STRONG[tone] }}>{value}</div>
    <div style={{ marginTop: 12, fontSize: 24, color: C.soft, lineHeight: 1.35 }}>{label}</div>
  </div>
);

// ─── Diagram & flow primitives ──────────────────────────────────────────────
const Arr = ({ size = 38, color = C.faint, style }: { size?: number; color?: string; style?: CSSProperties }) => (
  <div style={{ alignSelf: 'center', flex: 'none', ...style }}>
    <Icon name="arrow" size={size} color={color} sw={2.4} />
  </div>
);

const FlowArrow = ({ w = 68, color = C.faint, dashed = false, cls }: { w?: number; color?: string; dashed?: boolean; cls?: string }) => (
  <svg width={w} height={28} viewBox={`0 0 ${w} 28`} className={cls} style={{ flex: 'none', display: 'block', alignSelf: 'center' }}>
    <path
      d={`M3 14 H${w - 10}`}
      stroke={color}
      strokeWidth={4}
      strokeLinecap="round"
      strokeDasharray={dashed ? '8 10' : undefined}
      className={dashed ? A.march : undefined}
    />
    <path d={`M${w - 17} 5 L${w - 4} 14 L${w - 17} 23`} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FlowDot = ({ path, dur = 2.4, begin = 0, r = 7, color = C.electric }: { path: string; dur?: number; begin?: number; r?: number; color?: string }) => {
  const live = useIsActivePage();
  if (!live) return null;
  return (
    <circle r={r} fill={color}>
      <animateMotion path={path} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
    </circle>
  );
};

// ─── Chat bubbles (User prompt ↔ AI Copilot / Artifact) ─────────────────────
const Bubble = ({
  who = 'vous',
  tool,
  children,
  cls,
  d = 0,
  style,
  size = 23,
}: {
  who?: 'vous' | 'ia';
  tool?: string;
  children: ReactNode;
  cls?: string;
  d?: number;
  style?: CSSProperties;
  size?: number;
}) => {
  const isUser = who === 'vous';
  const tone: Tone = isUser ? 'blue' : 'violet';
  return (
    <div
      className={cls ?? A.in}
      style={{
        ...dl(d),
        display: 'flex',
        gap: 16,
        alignItems: 'flex-start',
        boxSizing: 'border-box',
        borderRadius: 18,
        padding: '16px 22px',
        fontSize: size,
        lineHeight: 1.42,
        background: T[tone].bg,
        boxShadow: `inset 0 0 0 2px ${T[tone].bd}`,
        color: C.ink,
        ...style,
      }}
    >
      <IconTile name={isUser ? 'user' : 'sparkles'} tone={tone} solid size={46} style={{ marginTop: 2 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Eyebrow c={T[tone].fg} size={17}>
            {isUser ? 'Votre prompt (consigne)' : 'Réponse de l’IA'}
          </Eyebrow>
          {tool ? <Tag tone={tone} size={15}>{tool}</Tag> : null}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

// ─── Interactive buttons, toggles, sliders & persistent timers ──────────────
const Btn = ({
  children,
  icon,
  onClick,
  ghost = false,
  tone = 'blue',
  size = 21,
  disabled = false,
  style,
}: {
  children?: ReactNode;
  icon?: IconName;
  onClick?: () => void;
  ghost?: boolean;
  tone?: Tone;
  size?: number;
  disabled?: boolean;
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
      gap: 9,
      padding: children ? '11px 20px' : '11px 13px',
      border: 'none',
      borderRadius: 12,
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      fontFamily: display,
      fontWeight: 700,
      fontSize: size,
      background: ghost ? T[tone].bg : STRONG[tone],
      color: ghost ? T[tone].fg : tone === 'yellow' ? C.ink : '#fff',
      boxShadow: ghost ? `inset 0 0 0 1.5px ${T[tone].bd}` : SHADOW_SM,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {icon ? <Icon name={icon} size={size + 1} sw={2.5} /> : null}
    {children}
  </button>
);

const Toggle = ({
  on,
  onChange,
  label,
  tone = 'blue',
  size = 23,
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
      gap: 14,
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
        width: 60,
        height: 34,
        borderRadius: 999,
        background: on ? STRONG[tone] : '#CBD4E1',
        transition: 'background 220ms ease',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 4,
          left: on ? 30 : 4,
          width: 26,
          height: 26,
          borderRadius: 999,
          background: '#fff',
          boxShadow: '0 2px 6px rgba(0,0,0,.25)',
          transition: `left 220ms ${EASE}`,
        }}
      />
    </span>
    <span>{label}</span>
  </button>
);

const Range = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  w = 360,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  w?: number;
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
    style={{ width: w }}
  />
);

type TimerRec = { total: number; left: number; t0: number | null };
const TIMERS = new Map<string, TimerRec>();
const timerLeft = (r: TimerRec) => (r.t0 === null ? r.left : Math.max(0, r.left - (Date.now() - r.t0) / 1000));

const Timer = ({
  id = 'default',
  minutes,
  big = false,
  compact = false,
  label = 'Chronomètre',
  cls,
  style,
}: {
  id?: string;
  minutes: number;
  big?: boolean;
  compact?: boolean;
  label?: string;
  cls?: string;
  style?: CSSProperties;
}) => {
  const key = `${SLIDE_ID}:${id}:${minutes}`;
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
  const left = Math.ceil(timerLeft(r));
  if (running && left <= 0) {
    r.left = 0;
    r.t0 = null;
  }
  const toggle = () => {
    if (r.t0 === null) {
      if (timerLeft(r) > 0) r.t0 = Date.now();
    } else {
      r.left = timerLeft(r);
      r.t0 = null;
    }
    tick((x) => x + 1);
  };
  const reset = () => {
    r.t0 = null;
    r.left = r.total;
    tick((x) => x + 1);
  };
  const done = left === 0;
  if (compact) {
    return (
      <div className={cls} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...style }}>
        <div>
          <Eyebrow c={C.muted} size={17}>{label}</Eyebrow>
          <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 44, lineHeight: 1.05, color: done ? C.coral : C.navy }}>
            {clock(left)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn icon={running ? 'pause' : 'play'} size={20} onClick={toggle} />
          <Btn icon="reset" ghost tone="grey" size={20} onClick={reset} />
        </div>
      </div>
    );
  }
  return (
    <div className={cls} style={{ display: 'flex', alignItems: 'center', gap: 18, ...style }}>
      <div style={{ fontFamily: mono, fontWeight: 700, fontSize: big ? 112 : 56, lineHeight: 1, letterSpacing: '0.02em', color: done ? C.coral : C.navy }}>
        {clock(left)}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <Btn icon={running ? 'pause' : 'play'} size={big ? 28 : 22} onClick={toggle} />
        <Btn icon="reset" ghost tone="grey" size={big ? 28 : 22} onClick={reset} />
      </div>
    </div>
  );
};

// ─── Code panel (dark VS Code-like) & UI Mockup window ──────────────────────
const CODE = { kw: '#B9A4FF', str: '#7EE2B8', num: '#FFD479', com: '#8FA0D8', fn: '#7CC4FF', txt: '#EAF0FF' };
const Ck = ({ children }: { children: ReactNode }) => <span style={{ color: CODE.kw, fontWeight: 600 }}>{children}</span>;
const Cs = ({ children }: { children: ReactNode }) => <span style={{ color: CODE.str }}>{children}</span>;
const Cn = ({ children }: { children: ReactNode }) => <span style={{ color: CODE.num }}>{children}</span>;
const Cc = ({ children }: { children: ReactNode }) => <span style={{ color: CODE.com, fontStyle: 'italic' }}>{children}</span>;
const Cf = ({ children }: { children: ReactNode }) => <span style={{ color: CODE.fn }}>{children}</span>;

const KW = new Set([
  'let', 'const', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'of', 'in', 'true', 'false', 'null',
  'undefined', 'new', 'async', 'await', 'typeof', 'export', 'import', 'from',
]);
const TOK = /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_$][\w$]*\b)/g;

const highlight = (line: string): ReactNode[] => {
  const out: ReactNode[] = [];
  let last = 0;
  TOK.lastIndex = 0;
  let m: RegExpExecArray | null = TOK.exec(line);
  while (m) {
    const t = m[0];
    if (m.index > last) out.push(line.slice(last, m.index));
    let col: string | undefined;
    if (m[1]) col = CODE.com;
    else if (m[2]) col = CODE.str;
    else if (m[3]) col = CODE.num;
    else if (m[4]) {
      if (KW.has(t)) col = CODE.kw;
      else if (line[m.index + t.length] === '(') col = CODE.fn;
    }
    out.push(col ? <span key={m.index} style={{ color: col }}>{t}</span> : t);
    last = m.index + t.length;
    m = TOK.exec(line);
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
};

const Code = ({
  code,
  children,
  size = 22,
  hi = [],
  file,
  w,
  wrap = false,
  cls,
  d = 0,
  style,
}: {
  code?: string;
  children?: ReactNode;
  size?: number;
  hi?: number[];
  file?: string;
  w?: number;
  wrap?: boolean;
  cls?: string;
  d?: number;
  style?: CSSProperties;
}) => {
  const lines = code ? code.replace(/^\n/, '').replace(/\s+$/, '').split('\n') : null;
  return (
    <div
      className={cls ?? A.in}
      style={{ ...dl(d), width: w, boxSizing: 'border-box', borderRadius: 16, background: G.navy, boxShadow: SHADOW, overflow: 'hidden', ...style }}
    >
      {file ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', background: 'rgba(255,255,255,.07)' }}>
          <span style={{ width: 11, height: 11, borderRadius: 6, background: '#FF6B6B' }} />
          <span style={{ width: 11, height: 11, borderRadius: 6, background: '#FFD479' }} />
          <span style={{ width: 11, height: 11, borderRadius: 6, background: '#7EE2B8' }} />
          <span style={{ marginLeft: 10, fontFamily: mono, fontSize: 18, color: C.lilac }}>{file}</span>
        </div>
      ) : null}
      {lines ? (
        <div style={{ padding: '14px 0', fontFamily: mono, fontSize: size, lineHeight: 1.48, color: CODE.txt }}>
          {lines.map((l, i) => (
            <div
              key={i}
              style={{ display: 'flex', background: hi.includes(i + 1) ? 'rgba(124,196,255,.20)' : 'transparent', boxShadow: hi.includes(i + 1) ? 'inset 5px 0 0 #7CC4FF' : 'none', fontSize: '18px' }}
            >
              <span style={{ flex: 'none', width: 48, textAlign: 'right', paddingRight: 16, color: 'rgba(174,185,230,.5)', userSelect: 'none' }}>{i + 1}</span>
              <span style={{ flex: 1, minWidth: 0, whiteSpace: wrap ? 'pre-wrap' : 'pre', overflowWrap: wrap ? 'anywhere' : 'normal', paddingRight: 20 }}>{highlight(l) || ' '}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '16px 22px', fontFamily: mono, fontSize: size, lineHeight: 1.5, color: CODE.txt, whiteSpace: wrap ? 'pre-wrap' : 'pre' }}>
          {children}
        </div>
      )}
    </div>
  );
};
const CodeDark = Code;

const Term = ({ lines, title = 'Console / Aperçu', size = 22, w, cls, d = 0, style }: { lines: string[]; title?: string; size?: number; w?: number; cls?: string; d?: number; style?: CSSProperties }) => (
  <div className={cls ?? A.in} style={{ ...dl(d), width: w, boxSizing: 'border-box', borderRadius: 16, background: '#101828', boxShadow: SHADOW, overflow: 'hidden', ...style }}>
    <div style={{ padding: '9px 18px', background: 'rgba(255,255,255,.07)', fontFamily: mono, fontSize: 17, color: '#9AA6C4', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{title}</div>
    <div style={{ padding: '14px 20px 16px', fontFamily: mono, fontSize: size, lineHeight: 1.48 }}>
      {lines.map((l, i) => {
        const err = l.startsWith('!');
        const usr = l.startsWith('»');
        return (
          <div key={i} style={{ whiteSpace: 'pre-wrap', color: err ? '#FF8A8A' : usr ? '#FFD479' : '#9FE8C8' }}>
            <span style={{ color: '#5E6B8C', marginRight: 12 }}>{err ? '✗' : usr ? '›' : '·'}</span>
            {err ? l.slice(1) : usr ? l.slice(1).trim() : l}
          </div>
        );
      })}
    </div>
  </div>
);

// Visual UI preview frame (Claude Artifact / ChatGPT Canvas / Browser live app)
const UiMock = ({
  title = 'Aperçu UI en direct',
  tool = 'Claude Artifacts · ChatGPT Canvas',
  tone = 'violet',
  w,
  h,
  cls,
  d = 0,
  style,
  children,
}: {
  title?: string;
  tool?: string;
  tone?: Tone;
  w?: number;
  h?: number;
  cls?: string;
  d?: number;
  style?: CSSProperties;
  children: ReactNode;
}) => (
  <div
    className={cls ?? A.in}
    style={{
      ...dl(d),
      width: w,
      height: h,
      boxSizing: 'border-box',
      borderRadius: 20,
      background: '#FFFFFF',
      boxShadow: '0 0 0 2px #DDE3EE, 0 24px 48px -26px rgba(11,31,92,.45)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', background: '#F1F5FB', borderBottom: `1.5px solid ${C.rule}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 11, height: 11, borderRadius: 6, background: '#FF6B6B' }} />
        <span style={{ width: 11, height: 11, borderRadius: 6, background: '#FFD479' }} />
        <span style={{ width: 11, height: 11, borderRadius: 6, background: '#0E9F6E' }} />
        <span style={{ marginLeft: 8, fontFamily: display, fontWeight: 700, fontSize: 18, color: C.navy }}>{title}</span>
      </div>
      <Tag tone={tone} size={15} icon="sparkles">{tool}</Tag>
    </div>
    <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column', gap: 12, boxSizing: 'border-box' }}>{children}</div>
  </div>
);

// ─── FlipCard, Drag chip, Hotspot ───────────────────────────────────────────
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
  w?: number;
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
      style={{ width: w ?? '100%', height: h, ...style }}
    >
      <div className={k('flip-in')}>
        <div className={k('flip-face')} style={{ background: C.card, boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '26px 26px 20px' }}>
          {front}
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, color: C.faint }}>
            <Icon name="loop" size={18} /> Cliquez pour retourner
          </div>
        </div>
        <div className={k('flip-face')} style={{ transform: 'rotateY(180deg)', background: T[backTone].bg, boxShadow: `inset 0 0 0 3px ${STRONG[backTone]}`, padding: '24px 26px' }}>
          {back}
        </div>
      </div>
    </div>
  );
};

const Drag = ({
  x,
  y,
  w,
  tone = 'blue',
  children,
  size = 22,
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
        gap: 10,
        padding: '12px 16px',
        background: C.card,
        borderRadius: 12,
        boxShadow: drag ? `0 0 0 3px ${STRONG[tone]}, 0 24px 40px -18px rgba(11,31,92,.6)` : `inset 5px 0 0 ${STRONG[tone]}, ${SHADOW_SM}`,
        fontSize: size,
        fontWeight: 600,
        lineHeight: 1.25,
        color: C.ink,
        cursor: drag ? 'grabbing' : 'grab',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {children}
    </div>
  );
};

const Hotspot = ({
  n,
  x,
  y,
  title,
  children,
  at: beat,
  w = 420,
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
    side === 'right' ? { left: 48, top: -20 } : side === 'left' ? { right: 48, top: -20 } : { left: -w / 2, top: 48 };
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 0, height: 0, zIndex: open ? 15 : 5 }}>
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
          left: -22,
          top: -22,
          width: 44,
          height: 44,
          borderRadius: 999,
          border: '3px solid #fff',
          background: C.coral,
          color: '#fff',
          fontFamily: display,
          fontWeight: 800,
          fontSize: 21,
          cursor: 'pointer',
          boxShadow: '0 8px 20px -6px rgba(224,72,72,.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
          background: C.card,
          borderRadius: 14,
          boxShadow: `${SHADOW}, inset 0 0 0 2.5px ${C.coral}`,
          padding: '14px 18px',
        }}
      >
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 20, color: T.coral.fg }}>{title}</div>
        <div style={{ marginTop: 4, fontSize: 19, lineHeight: 1.38, color: C.ink }}>{children}</div>
      </div>
    </div>
  );
};

// ─── Interactive Checklist & Live Score ─────────────────────────────────────
const CheckCtx = createContext<{ on: Record<string, number>; toggle: (id: string, w: number) => void } | null>(null);

const Checklist = ({ children, cls, style }: { children: ReactNode; cls?: string; style?: CSSProperties }) => {
  const [on, setOn] = useState<Record<string, number>>({});
  const toggle = (id: string, w: number) =>
    setOn((o) => {
      const next = { ...o };
      if (id in next) delete next[id];
      else next[id] = w;
      return next;
    });
  return (
    <CheckCtx.Provider value={{ on, toggle }}>
      <div className={cls} style={style}>
        {children}
      </div>
    </CheckCtx.Provider>
  );
};

const CheckItem = ({ id, w = 1, children, size = 21, tone = 'green' }: { id: string; w?: number; children: ReactNode; size?: number; tone?: Tone }) => {
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
        gap: 14,
        width: '100%',
        boxSizing: 'border-box',
        padding: '10px 14px',
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
      }}
    >
      <span
        style={{
          flex: 'none',
          width: 30,
          height: 30,
          borderRadius: 8,
          background: on ? STRONG[tone] : '#fff',
          boxShadow: on ? 'none' : `inset 0 0 0 2px ${C.faint}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {on ? <Icon name="check" size={20} color="#fff" sw={3} /> : null}
      </span>
      <span style={{ flex: 1 }}>{children}</span>
    </button>
  );
};

const CheckScore = ({
  max,
  levels,
  label = 'Score qualité',
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
    <div style={{ boxSizing: 'border-box', background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '22px 26px', ...style }}>
      <Eyebrow c={C.muted} size={18}>{label}</Eyebrow>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 80, lineHeight: 1, color: STRONG[lv.tone] === C.yellow ? C.amber : STRONG[lv.tone] }}>
          {score}
        </span>
        <span style={{ fontFamily: display, fontWeight: 600, fontSize: 36, color: C.faint }}>/ {max}</span>
      </div>
      <div style={{ marginTop: 12, height: 12, borderRadius: 6, background: C.panel, overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(100, (score / max) * 100)}%`, height: '100%', background: STRONG[lv.tone], transition: `width 400ms ${EASE}` }} />
      </div>
      <div style={{ marginTop: 14, fontSize: 23, lineHeight: 1.35, fontWeight: 600, color: T[lv.tone].fg }}>{lv.text}</div>
    </div>
  );
};

// ─── Frame: header (module + day progress), footer, beats ───────────────────
type Kind = 'cours' | 'demo' | 'atelier' | 'qcm' | 'tp' | 'pause' | 'bilan';
const KINDS: Record<Kind, { label: string; tone: Tone }> = {
  cours: { label: 'Cours', tone: 'blue' },
  demo: { label: 'Démo interactive', tone: 'violet' },
  atelier: { label: 'Atelier Vibe Coding', tone: 'green' },
  qcm: { label: 'QCM', tone: 'violet' },
  tp: { label: 'TP Fil Rouge', tone: 'yellow' },
  pause: { label: 'Pause', tone: 'grey' },
  bilan: { label: 'Bilan', tone: 'pink' },
};

const Header = ({ mod, kind }: { mod: number; kind?: Kind }) => {
  const day = dayOf(mod);
  return (
    <div style={{ position: 'absolute', left: 120, right: 120, top: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <DapMark h={20} color={C.electric} />
        <Eyebrow c={C.electric} size={19}>
          {mod === 0 ? 'Ouverture & Fil rouge' : `Module ${mod} · ${MOD_TITLES[mod]}`}
        </Eyebrow>
        {kind ? <Tag tone={KINDS[kind].tone} size={17}>{KINDS[kind].label}</Tag> : null}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Eyebrow c={C.muted} size={18}>Jour {day}</Eyebrow>
        <span style={{ width: 24, height: 10, borderRadius: 5, background: day >= 1 ? C.electric : C.rule }} />
        <span style={{ width: 24, height: 10, borderRadius: 5, background: day >= 2 ? C.electric : C.rule }} />
        <span style={{ width: 24, height: 10, borderRadius: 5, background: day >= 3 ? C.electric : C.rule }} />
      </div>
    </div>
  );
};

const Footer = ({ left = 120, day }: { left?: number; day: number }) => {
  const { current, total } = useSlidePageNumber();
  return (
    <div style={{ position: 'absolute', left, right: 120, bottom: 26, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: body }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <DapLogo size={19} />
        <span style={{ width: 1.5, height: 24, background: C.rule }} />
        <span style={{ fontSize: 19, fontWeight: 700, color: C.navy, whiteSpace: 'nowrap' }}>{AUTHOR}</span>
        <span style={{ width: 1.5, height: 24, background: C.rule }} />
        <span style={{ fontSize: 19, color: C.muted, whiteSpace: 'nowrap' }}>{COURSE}</span>
      </div>
      <span style={{ fontFamily: mono, fontSize: 19, color: C.muted, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
        {`Jour ${day} · ${pad(current)} / ${pad(total)}`}
      </span>
    </div>
  );
};

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

const Frame = ({
  mod,
  kind,
  beats = 0,
  chrome = true,
  children,
}: {
  mod: number;
  kind?: Kind;
  beats?: number;
  chrome?: boolean;
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
        background: 'var(--osd-bg)',
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
      {chrome ? <Header mod={mod} kind={kind} /> : null}
      {children}
      {chrome ? <Footer day={dayOf(mod)} /> : null}
      {beats > 0 ? <Beats count={beats} /> : null}
    </div>
  );
};

// ─── Page templates (Cover, Divider, Pause, VibeLab, Takeaways) ─────────────
const Cover = ({
  mod,
  eyebrow,
  children,
  sub,
  day,
  signature = false,
  trainer = false,
}: {
  mod: number;
  eyebrow: ReactNode;
  children: ReactNode;
  sub?: ReactNode;
  day: number;
  signature?: boolean;
  trainer?: boolean;
}) => (
  <Frame mod={mod} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} />
    <Outline x={1450} y={-50} w={560} h={170} r={46} />
    <Outline x={-120} y={900} w={520} h={260} r={50} color={C.lilac} />
    <Box x={390} y={140} w={1180} cls={A.in}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 style={{ margin: '28px 0 0', fontFamily: display, fontWeight: 800, fontSize: 84, lineHeight: 1.07, letterSpacing: '-0.02em', color: C.navy }}>{children}</h1>
      {sub ? <p style={{ margin: '30px 0 0', fontSize: 30, lineHeight: 1.44, color: C.soft, maxWidth: 830 }}>{sub}</p> : null}
    </Box>
    {signature ? (
      <Box x={1250} y={520} cls={A.in} style={dl(500)}>
        <Signature />
      </Box>
    ) : null}
    <Box x={1500} y={760} cls={A.pop} style={dl(600)}>
      <DapLogo size={40} />
    </Box>
    {trainer ? <Portrait w={170} x={390} y={720} cls={A.in} /> : null}
    {trainer ? (
      <Box x={620} y={748} cls={A.in} style={dl(300)}>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 34, color: C.navy }}>{AUTHOR}</div>
        <div style={{ marginTop: 8, fontSize: 25, color: C.soft }}>Expert IA &amp; Ingénierie Logicielle · Formateur Docaposte Institute</div>
      </Box>
    ) : null}
    <Footer left={390} day={day} />
  </Frame>
);

const Divider = ({ mod, title, children, kicker }: { mod: number; title: ReactNode; children?: ReactNode; kicker?: ReactNode }) => (
  <Frame mod={mod} chrome={false}>
    <Slab x={-60} y={-60} w={700} h={1200} r={56}>
      <div style={{ position: 'absolute', left: 120, top: 150, fontFamily: display, fontWeight: 700, fontSize: 24, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.lilac }}>
        Module · Jour {dayOf(mod)}
      </div>
      <div className={A.pop} style={{ position: 'absolute', left: 110, top: 200, fontFamily: display, fontWeight: 800, fontSize: 290, lineHeight: 1, color: '#fff' }}>{pad(mod)}</div>
      <div className={A.in} style={{ ...dl(400), position: 'absolute', left: 120, top: 550, width: 150, height: 8, borderRadius: 4, background: G.violet }} />
      <div style={{ position: 'absolute', left: 120, bottom: 110 }}>
        <DapLogo size={30} color="#FFFFFF" />
      </div>
    </Slab>
    <Outline x={1450} y={-60} w={560} h={190} r={46} color={C.violet} />
    <Outline x={1500} y={820} w={520} h={330} r={50} color={C.violet} />
    <Box x={760} y={190} w={1020} cls={A.in}>
      {kicker ? <Eyebrow>{kicker}</Eyebrow> : null}
      <h2 style={{ margin: '22px 0 0', fontFamily: display, fontWeight: 800, fontSize: 70, lineHeight: 1.1, letterSpacing: '-0.02em', color: C.navy }}>{title}</h2>
      <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 20 }}>{children}</div>
    </Box>
    <Footer left={760} day={dayOf(mod)} />
  </Frame>
);

const Pause = ({ mod, title, back, minutes }: { mod: number; title: ReactNode; back: string; minutes: number }) => (
  <Frame mod={mod} kind="pause">
    <Box x={120} y={230} w={1000} cls={A.in}>
      <Eyebrow c={C.muted}>{back}</Eyebrow>
      <h2 style={{ margin: '22px 0 0', fontFamily: display, fontWeight: 800, fontSize: 104, lineHeight: 1.05, color: C.navy }}>{title}</h2>
      <div style={{ marginTop: 50 }}>
        <Timer id={`pause-${mod}-${minutes}`} minutes={minutes} big />
      </div>
    </Box>
    <Box x={1180} y={250} w={620} cls={A.in} style={dl(250)}>
      <Card title="Pendant la pause" icon="clock" tone="teal" bsz={25}>
        <Col gap={14}>
          <div>Éloignez-vous de l’écran et reposez vos yeux.</div>
          <div>Levez-vous, étirez-vous, buvez un verre d’eau.</div>
          <div>Gardez votre outil IA ou VS Code ouvert : on reprend ensemble.</div>
        </Col>
      </Card>
    </Box>
  </Frame>
);

const WStep = ({ n, children, cls, d = 0 }: { n: number; children: ReactNode; cls?: string; d?: number }) => (
  <div className={cls ?? A.in} style={{ ...dl(d), display: 'flex', alignItems: 'flex-start', gap: 18 }}>
    <div
      style={{
        flex: 'none',
        width: 48,
        height: 48,
        borderRadius: 13,
        background: G.blue,
        color: '#fff',
        fontFamily: display,
        fontWeight: 800,
        fontSize: 25,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {n}
    </div>
    <div style={{ flex: 1, minWidth: 0, fontSize: 25, lineHeight: 1.38, color: C.ink, paddingTop: 3 }}>{children}</div>
  </div>
);

const DEFIS = {
  trous: { label: 'Prompt à trous', icon: 'puzzle' as IconName, tone: 'blue' as Tone, aide: 'Complétez chaque [___] avant d’envoyer à l’IA : chaque trou est un choix de conception.' },
  ameliorer: { label: 'Prompt à améliorer', icon: 'wand' as IconName, tone: 'yellow' as Tone, aide: 'Ce prompt de départ est trop vague : enrichissez-le pour obtenir une vraie interface.' },
  retro: { label: 'Rétro-prompt UI', icon: 'eye' as IconName, tone: 'violet' as Tone, aide: 'Observez l’interface cible et rédigez le prompt structuré qui la génère.' },
  inspecter: { label: 'Générer & Inspecter', icon: 'search' as IconName, tone: 'teal' as Tone, aide: 'Faites générer l’UI, puis repérez et modifiez la variable ou condition cible dans le code.' },
  construire: { label: 'Co-création guidée', icon: 'layers' as IconName, tone: 'green' as Tone, aide: 'Avancez par prompts successifs : structure UI → logique & données → vérifications.' },
  skill: { label: 'VS Code · Skill & Agent', icon: 'bot' as IconName, tone: 'pink' as Tone, aide: 'Configurez votre fichier d’instructions, votre SKILL.md ou votre Agent personnalisé dans VS Code.' },
};
type Defi = keyof typeof DEFIS;

const VibeLab = ({
  mod,
  n,
  title,
  defi = 'construire',
  tools = 'ChatGPT Canvas · Claude Artifacts · Gemini',
  objective,
  minutes,
  crit,
  children,
  kind = 'atelier',
  suivi = 'Point d’étape toutes les 15 min au micro. Bloqué sur un prompt ou un bug UI ? Partage d’écran 2 minutes !',
}: {
  mod: number;
  n: string;
  title: ReactNode;
  defi?: Defi;
  tools?: string;
  objective: ReactNode;
  minutes: number;
  crit: ReactNode;
  children: ReactNode;
  kind?: Kind;
  suivi?: ReactNode;
}) => {
  const df = DEFIS[defi];
  return (
    <Frame mod={mod} kind={kind}>
      <Title size={47}>
        <span style={{ color: C.green }}>Atelier {n}</span> · {title}
      </Title>
      <div className={A.fade} style={{ position: 'absolute', left: 120, top: 172, right: 120, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Tag tone={df.tone} size={18} icon={df.icon}>{df.label}</Tag>
        <Tag tone="violet" size={18} icon="sparkles">{tools}</Tag>
        <Tag tone="grey" size={18} icon="user">Individuel · sur votre poste</Tag>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 234, width: 1020, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className={A.in} style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 24px', borderLeft: `8px solid ${C.green}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Icon name="target" size={24} color={T.green.fg} />
            <Eyebrow c={T.green.fg} size={18}>Objectif &amp; Livrable UI</Eyebrow>
          </div>
          <div style={{ fontSize: 23, lineHeight: 1.38, color: C.ink }}>{objective}</div>
        </div>
        <div className={A.in} style={{ ...dl(140), background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Icon name={df.icon} size={24} color={T[df.tone].fg} />
            <Eyebrow c={T[df.tone].fg} size={18}>Marche à suivre en Vibe Coding</Eyebrow>
          </div>
          <div style={{ fontSize: 19, fontStyle: 'italic', color: C.muted, marginBottom: 12 }}>{df.aide}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 22, lineHeight: 1.38, color: C.ink }}>{children}</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 1180, top: 234, width: 620, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Timer id={`vibelab-${n}`} minutes={minutes} label={`Atelier ${n}`} compact cls={A.right} style={dl(150)} />
        <div className={A.right} style={{ ...dl(260), background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Icon name="checkCircle" size={24} color={T.green.fg} />
            <Eyebrow c={T.green.fg} size={18}>Critères de réussite (à vérifier)</Eyebrow>
          </div>
          <Checklist style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>{crit}</Checklist>
        </div>
        <Note tone="yellow" icon="chat" label="Suivi en classe virtuelle" size={20} d={380}>
          {suivi}
        </Note>
      </div>
    </Frame>
  );
};

const Takeaways = ({ mod, kind = 'bilan', title, children, lede }: { mod: number; kind?: Kind; title: ReactNode; lede?: ReactNode; children: ReactNode }) => (
  <Frame mod={mod} kind={kind}>
    <Title>{title}</Title>
    {lede ? <Lede>{lede}</Lede> : null}
    <Box x={120} y={lede ? 280 : 230} w={1680} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {children}
    </Box>
  </Frame>
);

// ─── Poll (oral vote — the trainer clicks one tick per voice) ───────────────
const PollCtx = createContext<{ c: Record<string, number>; add: (id: string, d: number) => void } | null>(null);

const Poll = ({ children, x = 120, y = 270, w = 1040 }: { children: ReactNode; x?: number; y?: number; w?: number }) => {
  const [c, setC] = useState<Record<string, number>>({});
  const add = (id: string, d: number) => setC((s) => ({ ...s, [id]: Math.max(0, (s[id] ?? 0) + d) }));
  return (
    <PollCtx.Provider value={{ c, add }}>
      <div style={{ position: 'absolute', left: x, top: y, width: w, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {children}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4 }}>
          <Btn icon="reset" ghost tone="grey" size={19} onClick={() => setC({})}>
            Remettre à zéro
          </Btn>
          <span style={{ fontSize: 20, color: C.muted }}>Vote oral en direct : un clic = une voix (clic droit ou bouton − pour retirer).</span>
        </div>
      </div>
    </PollCtx.Provider>
  );
};

const PollRow = ({ id, label, tone = 'blue', icon }: { id: string; label: ReactNode; tone?: Tone; icon?: IconName }) => {
  const ctx = useContext(PollCtx);
  if (!ctx) return null;
  const n = ctx.c[id] ?? 0;
  const max = Math.max(1, ...Object.values(ctx.c));
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <button
        type="button"
        data-osd-interactive
        onClick={(e) => {
          e.currentTarget.blur();
          ctx.add(id, 1);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          ctx.add(id, -1);
        }}
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '15px 22px',
          border: 'none',
          borderRadius: 14,
          background: '#fff',
          boxShadow: `inset 0 0 0 2px ${C.rule}`,
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: body,
          fontSize: 25,
          color: C.ink,
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(n / max) * 100}%`, background: T[tone].bg, transition: `width 400ms ${EASE}` }} />
        {icon ? <Icon name={icon} size={28} color={T[tone].fg} style={{ position: 'relative' }} /> : null}
        <span style={{ position: 'relative', flex: 1 }}>{label}</span>
        <span style={{ position: 'relative', fontFamily: display, fontWeight: 800, fontSize: 34, color: n ? T[tone].fg : C.faint, minWidth: 40, textAlign: 'right' }}>{n}</span>
      </button>
      <button
        type="button"
        data-osd-interactive
        onClick={(e) => {
          e.currentTarget.blur();
          ctx.add(id, -1);
        }}
        style={{ width: 48, border: 'none', borderRadius: 12, background: C.panel, color: C.muted, cursor: 'pointer', fontSize: 28, fontWeight: 700 }}
      >
        −
      </button>
    </div>
  );
};

// ─── QCM series (oral vote A–D, instant feedback & score) ───────────────────
const LETTERS = ['A', 'B', 'C', 'D', 'E'];
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
        padding: '13px 20px 13px 14px',
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
          width: 48,
          height: 48,
          borderRadius: 12,
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
        {state === 'ok' ? <Icon name="check" size={24} color="#fff" sw={3} /> : state === 'ko' ? <Icon name="x" size={22} color="#fff" sw={3} /> : LETTERS[oi]}
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
      <div style={{ display: active ? 'flex' : 'none', flexDirection: 'column', gap: 13 }}>
        <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.3, color: C.navy, marginBottom: 4 }}>{q}</div>
        {opts.map((o, i) => cloneElement(o, { oi: i, key: i }))}
        <div
          style={{
            marginTop: 4,
            minHeight: 98,
            boxSizing: 'border-box',
            borderRadius: 14,
            padding: '14px 20px',
            background: solved ? T.green.bg : lastWrong ? T.coral.bg : T.grey.bg,
            fontSize: 23,
            lineHeight: 1.38,
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
              <strong style={{ color: T.coral.fg }}>✗ Piège classique ! </strong>Observez bien la consigne ou le comportement de l’IA, puis votez à nouveau.
            </>
          ) : (
            <span style={{ color: C.muted }}>Votez à voix haute (A, B, C ou D) : le formateur clique la réponse majoritaire.</span>
          )}
        </div>
      </div>
    </QItemCtx.Provider>
  );
};

const QuizSeries = ({ children, x = 120, y = 210, w = 1680 }: { children: ReactNode; x?: number; y?: number; w?: number }) => {
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

// ─── Transitions: RISE for the house, BLOOM for covers / dividers / closing ─
const HOLD: Keyframe[] = [{ opacity: 1 }, { opacity: 1 }];
export const transition: SlideTransition = {
  duration: 260,
  exit: { duration: 260, easing: 'cubic-bezier(0.4, 0, 1, 1)', keyframes: HOLD },
  enter: {
    duration: 260,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};
const BLOOM: SlideTransition = {
  duration: 240,
  exit: { duration: 240, easing: 'cubic-bezier(0.4, 0, 1, 1)', keyframes: HOLD },
  enter: {
    duration: 240,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
    keyframes: [
      { opacity: 0, transform: 'scale(0.97)' },
      { opacity: 1, transform: 'scale(1)' },
    ],
  },
};

// ════════════════════════════════════════════════════════════════════════════
// OUVERTURE & FIL ROUGE (Module 0 — 10 pages)
// ════════════════════════════════════════════════════════════════════════════
const O_Cover: Page = () => (
  <Cover
    mod={0}
    day={1}
    signature
    trainer
    eyebrow="Formation · 3 jours · 21 h · Niveau débutant · Classe virtuelle"
    sub="Apprendre la logique du code et bâtir pas à pas de vraies mini-applications graphiques en dialoguant avec ChatGPT, Claude, Gemini et VS Code."
  >
    <span style={{ color: C.plum }}>Vibe Coding</span>
    <br />
    Créez vos applications avec l’IA
  </Cover>
);
O_Cover.transition = BLOOM;

const O_Welcome: Page = () => (
  <Frame mod={0}>
    <Title>Trois jours pour passer de l’idée à l’application</Title>
    <Lede>Aucun prérequis en programmation : l’IA générative est votre copilote dès la première heure, et c’est vous qui gardez le volant.</Lede>
    <Grid top={265} cols={4} gap={24}>
      <Card tone="blue" d={100}>
        <Stat value={<CountUp to={21} suffix=" h" />} label="de formation guidée sur 3 jours" tone="blue" size={96} d={150} />
      </Card>
      <Card tone="green" d={200}>
        <Stat value={<CountUp to={60} prefix="+ " suffix=" %" />} label="de pratique en Vibe Coding" tone="green" size={96} d={250} />
      </Card>
      <Card tone="violet" d={300}>
        <Stat value={<CountUp to={10} />} label="ateliers & TP avec vraie interface UI" tone="violet" size={96} d={350} />
      </Card>
      <Card tone="teal" d={400}>
        <Stat value={<CountUp to={4} />} label="environnements : ChatGPT, Claude, Gemini, VS Code" tone="teal" size={96} d={450} />
      </Card>
    </Grid>
    <Box x={120} y={700} w={1680}>
      <Callout tone="blue" icon="sparkles" title="Notre contrat pédagogique" d={600} size={26}>
        Vous n’allez pas mémoriser du code par cœur sur un écran noir : vous allez <Strong>concevoir des mini-apps visuelles avec l’IA</Strong>, tout en comprenant les briques du code (variables, conditions, boucles, fonctions, données) pour savoir <Strong c={C.plum}>lire, orienter, tester et corriger</Strong>.
      </Callout>
    </Box>
  </Frame>
);

const O_Formateur: Page = () => (
  <Frame mod={0}>
    <Title>Votre formateur</Title>
    <Portrait w={250} x={130} y={270} cls={A.in} />
    <Box x={490} y={260} w={1310}>
      <Col gap={20}>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 42, color: C.navy }}>{AUTHOR}</div>
        <Bullet d={120}>Expert IA &amp; ingénierie logicielle · Ingénieur IT et doctorant en intelligence artificielle</Bullet>
        <Bullet d={200}>Développeur senior depuis 18 ans (Java, Python, Web) &amp; CEO de National Quantum</Bullet>
        <Bullet d={280}>Chercheur, enseignant universitaire et consultant en transformation numérique</Bullet>
        <Bullet d={360}>Formateur professionnel depuis 8 ans auprès de grandes entreprises et équipes métiers</Bullet>
      </Col>
    </Box>
    <Grid top={690} cols={3} gap={26} left={490} w={1310}>
      <Card tone="blue" icon="star" title="250+ sessions" d={500} bsz={22}>
        Formations animées en ingénierie logicielle et IA générative
      </Card>
      <Card tone="violet" icon="globe" title="60+ entreprises" d={600} bsz={22}>
        Accompagnées dans l’adoption concrète des outils IA
      </Card>
      <Card tone="green" icon="users" title="3 000+ apprenants" d={700} bsz={22}>
        Profils techniques, métiers et débutants complets
      </Card>
    </Grid>
  </Frame>
);

const O_Virtuel: Page = () => (
  <Frame mod={0}>
    <Title>Classe virtuelle : nos règles de confort</Title>
    <Lede>Chacun depuis son poste : je partage mon écran pour les démos, vous créez vos mini-apps sur le vôtre.</Lede>
    <Grid top={265} cols={2} gap={26}>
      <Card title="Caméra & micro" icon="user" tone="blue" d={100} bsz={24}>
        Caméra allumée si possible pour la convivialité ; micro coupé hors prise de parole, ouvert dès que vous votez ou posez une question.
      </Card>
      <Card title="Organisation de l’écran" icon="laptop" tone="violet" d={200} bsz={24}>
        Idéalement deux écrans (ou votre écran scindé en deux) : la classe virtuelle d’un côté, votre assistant IA (ChatGPT, Claude, Gemini ou VS Code) de l’autre.
      </Card>
      <Card title="Ateliers 100 % individuels" icon="target" tone="green" d={300} bsz={24}>
        Chaque atelier se réalise individuellement avec un minuteur affiché. Toutes les 15 min, point d’étape oral ; en cas de blocage, partage d’écran de 2 minutes.
      </Card>
      <Card title="Zéro donnée sensible" icon="shield" tone="coral" d={400} bsz={24}>
        Dans les outils d’IA (ChatGPT, Claude, Gemini), nous n’utilisons que des données fictives ou pédagogiques : jamais de données clients ni de mots de passe.
      </Card>
    </Grid>
    <Box x={120} y={760} w={1680}>
      <Callout tone="teal" icon="clock" title="Rythme & vraies pauses" d={550} size={25}>
        9 h 00 – 12 h 30 et 14 h 00 – 17 h 30, avec deux pauses de 15 minutes par journée loin de l’écran.
      </Callout>
    </Box>
  </Frame>
);

const O_Poll: Page = () => (
  <Frame mod={0}>
    <Title>Tour de table &amp; point de départ</Title>
    <Lede>Dites-moi à voix haute le numéro (1 à 4) qui vous correspond le mieux aujourd’hui.</Lede>
    <Poll y={265} w={1060}>
      <PollRow id="p1" tone="blue" icon="sparkles" label="1 · J’utilise déjà ChatGPT / Claude / Gemini, mais je n’ai jamais codé" />
      <PollRow id="p2" tone="teal" icon="compass" label="2 · Je débute à la fois en programmation et avec l’IA générative" />
      <PollRow id="p3" tone="green" icon="code" label="3 · J’ai déjà lu ou modifié quelques lignes (HTML, Excel, petits scripts)" />
      <PollRow id="p4" tone="violet" icon="rocket" label="4 · J’ai déjà généré une petite page ou un script avec une IA" />
    </Poll>
    <Box x={1240} y={265} w={560}>
      <Card title="Tour de table express (1 min)" icon="chat" tone="navy" d={250} bsz={23}>
        <Col gap={12}>
          <div><Strong>1.</Strong> Votre prénom et votre métier</div>
          <div><Strong>2.</Strong> L’outil IA auquel vous avez accès aujourd’hui</div>
          <div><Strong>3.</Strong> Une idée de petite application qui vous ferait plaisir de créer d’ici mercredi soir !</div>
        </Col>
      </Card>
    </Box>
  </Frame>
);

const O_Objectifs: Page = () => (
  <Frame mod={0} beats={1}>
    <Title>Les 6 objectifs officiels de vos trois jours</Title>
    <Lede>Le programme officiel Docaposte Institute, vécu de bout en bout en mode Vibe Coding assisté par l’IA.</Lede>
    <Grid top={255} cols={3} gap={24}>
      <Card title="1 · Concepts de base" icon="sliders" tone="blue" d={100} tsz={25} bsz={22}>
        Comprendre les variables, types, conditions et boucles pour piloter le comportement d’une application.
      </Card>
      <Card title="2 · Structure & fonctions" icon="layers" tone="violet" d={180} tsz={25} bsz={22}>
        Identifier l’architecture d’une page web (HTML, CSS, JS) et le rôle des fonctions déclenchées par les boutons.
      </Card>
      <Card title="3 · Bonnes pratiques" icon="checkCircle" tone="teal" d={260} tsz={25} bsz={22}>
        Appliquer les réflexes essentiels : lisibilité, nommage clair, commentaires utiles et tests simples.
      </Card>
      <Card title="4 · Cycle itératif" icon="loop" tone="green" d={340} tsz={25} bsz={22}>
        Pratiquer le cycle décrire – générer – tester – corriger dans un environnement accessible aux débutants.
      </Card>
      <Card title="5 · Mini-app avec UI" icon="palette" tone="yellow" d={420} tsz={25} bsz={22}>
        Construire pas à pas une mini-application interactive dotée d’une vraie interface graphique.
      </Card>
      <Card title="6 · IA générative copilote" icon="sparkles" tone="pink" d={500} tsz={25} bsz={22}>
        Mobiliser ChatGPT, Claude, Gemini dès le Jour 1, puis VS Code avec Agents et Skills au Jour 3.
      </Card>
    </Grid>
    <Box x={120} y={770} w={1680}>
      <Callout tone="violet" icon="wand" title="Pourquoi comprendre le code si l’IA l’écrit ?" cls={b.on(1)} size={25}>
        Sans les bases (variables, conditions, données, tests), on subit les bugs de l’IA. Avec ces bases, <Strong c={C.violet}>vous savez exactement quoi demander et où vérifier</Strong>.
      </Callout>
    </Box>
  </Frame>
);

const O_Programme: Page = () => (
  <Frame mod={0}>
    <Title>Votre parcours sur 3 jours</Title>
    <Lede>L’IA générative nous accompagne dès la première matinée, avec une montée en puissance jusqu’à VS Code.</Lede>
    <Grid top={250} cols={3} gap={26}>
      <Card title="Jour 1 · Logique, Bases & 1re UI" icon="sparkles" tone="blue" d={100} tsz={25} bsz={22} style={{ minHeight: 500 }}>
        <Col gap={10}>
          <div><Tag tone="blue" size={16}>Matin</Tag> Programmer en Vibe Coding (ChatGPT, Claude, Gemini)</div>
          <div>Algorithmes, prompts &amp; les 3 familles d’erreurs</div>
          <div>Variables, types, opérateurs &amp; jauges UI</div>
          <div>Conditions (<Ic>if/else</Ic>) &amp; boucles visuelles</div>
          <div style={{ marginTop: 4 }}><Tag tone="blue" size={16}>Après-midi</Tag> Fonctions &amp; boutons d’action</div>
          <div>Entrées / sorties graphiques &amp; prompt itératif</div>
          <div><Strong>TP 1 · Mini-app Quiz ou Calculateur avec UI</Strong></div>
        </Col>
      </Card>
      <Card title="Jour 2 · Projet, Données & Tests" icon="database" tone="teal" d={220} tsz={25} bsz={22} style={{ minHeight: 500 }}>
        <Col gap={10}>
          <div><Tag tone="teal" size={16}>Matin</Tag> Listes &amp; objets : le backlog produit</div>
          <div>Trier, filtrer, chercher… sans casser l’original</div>
          <div>Bonnes pratiques : nommage, découpage en 3 blocs</div>
          <div>Kanban, règles métier &amp; auto-tests</div>
          <div style={{ marginTop: 4 }}><Tag tone="teal" size={16}>Après-midi</Tag> Import CSV robuste &amp; export JSON</div>
          <div>Tableau de bord, glisser-déposer &amp; sauvegarde</div>
          <div><Strong c={C.teal}>TP 2 · TaskFlow, outil Kanban de gestion de projet</Strong></div>
        </Col>
      </Card>
      <Card title="Jour 3 · VS Code, Agents & Démo" icon="rocket" tone="violet" d={340} tsz={25} bsz={22} style={{ minHeight: 500 }}>
        <Col gap={10}>
          <div><Tag tone="violet" size={16}>Matin</Tag> Découvrir VS Code sans stress</div>
          <div>Les 3 modes : Ask, Edit et Agent multi-fichiers</div>
          <div>Personnaliser l’IA : <Ic>AGENTS.md</Ic>, <Ic>SKILL.md</Ic> &amp; Agents</div>
          <div>Une équipe de 3 agents : PO, Dev JS, Testeur</div>
          <div style={{ marginTop: 4 }}><Tag tone="violet" size={16}>Après-midi</Tag> Fonctionnalité phare livrée par relais</div>
          <div>Git, GitHub &amp; déploiement sur GitHub Pages</div>
          <div><Strong c={C.violet}>TP Final · Démo live depuis votre URL publique</Strong></div>
        </Col>
      </Card>
    </Grid>
  </Frame>
);

const O_FilRouge: Page = () => (
  <Frame mod={0}>
    <Title>
      Le fil rouge : <span style={{ color: C.violet }}>VibePulse</span>, votre suite de mini-apps interactives
    </Title>
    <Lede>Chaque journée aboutit à une vraie application graphique que vous pouvez utiliser et montrer dans votre navigateur.</Lede>
    <Box x={120} y={260} w={920}>
      <Col gap={18}>
        <Card title="Jour 1 · VibeQuiz & VibeCalc" icon="gauge" tone="blue" d={100} bsz={22} pad={20}>
          Simulateur interactif et quiz visuel avec barre de progression, cartes de réponse colorées, calcul de score et feedback personnalisé.
        </Card>
        <Card title="Jour 2 · TaskFlow, gestion de projet" icon="database" tone="teal" d={220} bsz={22} pad={20}>
          Backlog produit puis tableau Kanban évolutif : règles métier testées, import CSV, tableau de bord, glisser-déposer et sauvegarde <Ic>localStorage</Ic>.
        </Card>
        <Card title="Jour 3 · TaskFlow, livré et en ligne" icon="bot" tone="violet" d={340} bsz={22} pad={20}>
          Projet VS Code multi-fichiers, une fonctionnalité phare livrée par une <Strong c={C.violet}>équipe de 3 agents</Strong> guidée par un <Strong c={C.violet}>Skill</Strong>, puis publiée sur <Strong c={C.violet}>GitHub Pages</Strong>.
        </Card>
      </Col>
    </Box>
    <Box x={1080} y={260} w={720}>
      <UiMock title="VibePulse · Aperçu de votre application" tool="Rendu HTML / CSS / JS" tone="violet" d={300}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: G.navy, color: '#fff', borderRadius: 14, padding: '14px 18px' }}>
          <div>
            <div style={{ fontSize: 15, color: C.lilac }}>MINI-APP INTERACTIVE · VIBE CODING</div>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 24 }}>VibePulse Studio</div>
          </div>
          <Tag tone="green" size={16}>Score : 85 %</Tag>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <div style={{ background: T.blue.bg, borderRadius: 12, padding: '10px 14px' }}>
            <div style={{ fontSize: 15, color: T.blue.fg, fontWeight: 700 }}>CARTES ACTIVES</div>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>12</div>
          </div>
          <div style={{ background: T.green.bg, borderRadius: 12, padding: '10px 14px' }}>
            <div style={{ fontSize: 15, color: T.green.fg, fontWeight: 700 }}>AUTO-TESTS</div>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: T.green.fg }}>5 / 5 ✓</div>
          </div>
          <div style={{ background: T.violet.bg, borderRadius: 12, padding: '10px 14px' }}>
            <div style={{ fontSize: 15, color: T.violet.fg, fontWeight: 700 }}>SAUVEGARDE</div>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: T.violet.fg }}>Auto JSON</div>
          </div>
        </div>
        <div style={{ background: '#F6F8FC', borderRadius: 12, padding: '12px 16px', border: `1.5px solid ${C.rule}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 19, fontWeight: 600, color: C.ink }}>1. Préparer la démo client avec le Skill UI</span>
          <Tag tone="coral" size={15}>Priorité Haute</Tag>
        </div>
        <div style={{ background: '#F6F8FC', borderRadius: 12, padding: '12px 16px', border: `1.5px solid ${C.rule}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 19, fontWeight: 600, color: C.ink }}>2. Vérifier le cas limite « liste vide »</span>
          <Tag tone="green" size={15}>Validé ✓</Tag>
        </div>
      </UiMock>
    </Box>
  </Frame>
);

const O_Outils: Page = () => (
  <Frame mod={0} beats={1}>
    <Title>Vos ateliers de Vibe Coding sur les 3 jours</Title>
    <Lede>On démarre sans aucune installation complexe dans le navigateur, puis on découvre VS Code le Jour 3.</Lede>
    <Grid top={255} cols={4} gap={22}>
      <Card title="ChatGPT · Canvas" icon="sparkles" tone="green" d={100} tsz={24} bsz={21}>
        <Tag tone="green" size={15}>Jours 1 &amp; 2</Tag>
        <div style={{ marginTop: 10 }}>Génère une application HTML/CSS/JS et l’affiche directement en aperçu interactif à droite du chat.</div>
      </Card>
      <Card title="Claude · Artifacts" icon="wand" tone="violet" d={200} tsz={24} bsz={21}>
        <Tag tone="violet" size={15}>Jours 1 &amp; 2</Tag>
        <div style={{ marginTop: 10 }}>Excellente qualité visuelle : bascule en un clic entre l’application en direct et son code source.</div>
      </Card>
      <Card title="Gemini · Canvas" icon="globe" tone="blue" d={300} tsz={24} bsz={21}>
        <Tag tone="blue" size={15}>Jours 1 &amp; 2</Tag>
        <div style={{ marginTop: 10 }}>Édition en direct avec prévisualisation web immédiate et explication ligne par ligne.</div>
      </Card>
      <Card title="VS Code + Agents" icon="laptop" tone="navy" d={400} tsz={24} bsz={21}>
        <Tag tone="navy" size={15}>Jour 3</Tag>
        <div style={{ marginTop: 10 }}>L’éditeur pro : multi-fichiers, fichiers <Ic>AGENTS.md</Ic>, <Ic>SKILL.md</Ic> et agents spécialisés.</div>
      </Card>
    </Grid>
    <Box x={120} y={690} w={1680}>
      <Callout tone="yellow" icon="bulb" title="Astuce universelle (plan B garanti)" cls={b.on(1)} size={24}>
        Quel que soit votre outil IA, un simple fichier nommé <PathChip>index.html</PathChip> enregistré sur votre bureau s’ouvre d’un double-clic dans Chrome, Edge ou Firefox !
      </Callout>
    </Box>
  </Frame>
);

const O_Defis: Page = () => (
  <Frame mod={0}>
    <Title>Pourquoi nos ateliers ne sont jamais du « copier-coller »</Title>
    <Lede>Pour apprendre vraiment en Vibe Coding, chaque exercice vous place en posture de pilote et d’inspecteur.</Lede>
    <Grid top={260} cols={3} gap={24}>
      <Card title="1 · Prompt à améliorer" icon="wand" tone="yellow" d={100} tsz={24} bsz={21}>
        Vous partez d’une demande floue (« fais-moi un quiz ») et vous la structurez pour obtenir une interface précise et vérifiable.
      </Card>
      <Card title="2 · Prompt à trous" icon="puzzle" tone="blue" d={180} tsz={24} bsz={21}>
        La structure du prompt est fournie, mais vous décidez des variables, des seuils conditionnels et des règles métier.
      </Card>
      <Card title="3 · Rétro-prompt UI" icon="eye" tone="violet" d={260} tsz={24} bsz={21}>
        Vous observez une maquette d’interface et vous rédigez le prompt capable de la reproduire.
      </Card>
      <Card title="4 · Générer & Inspecter" icon="search" tone="teal" d={340} tsz={24} bsz={21}>
        Une fois l’UI générée, vous ouvrez l’onglet Code pour modifier vous-même une variable, une couleur ou une condition.
      </Card>
      <Card title="5 · Chasse aux bugs & Tests" icon="bug" tone="coral" d={420} tsz={24} bsz={21}>
        Vous testez les cas limites (champ vide, valeur négative) et faites ajouter un panneau d’auto-tests à l’IA.
      </Card>
      <Card title="6 · Skills & Agents (J3)" icon="bot" tone="pink" d={500} tsz={24} bsz={21}>
        Vous capitalisez vos règles dans un fichier <Ic>SKILL.md</Ic> et un Agent personnalisé dans VS Code.
      </Card>
    </Grid>
  </Frame>
);

// ════════════════════════════════════════════════════════════════════════════
// MODULE 1 — Qu'est-ce que programmer en Vibe Coding ? (10 pages)
// ════════════════════════════════════════════════════════════════════════════
const M1_Divider: Page = () => (
  <Divider mod={1} kicker="Jour 1 · Matin" title="Qu’est-ce que programmer à l’ère du Vibe Coding ?">
    <Bullet size={30}>Du code écrit caractère par caractère au dialogue avec l’IA</Bullet>
    <Bullet size={30}>Comment raisonne une IA générative (et pourquoi elle peut se tromper)</Bullet>
    <Bullet size={30}>Algorithmes, instructions, erreurs et première mini-app UI</Bullet>
  </Divider>
);
M1_Divider.transition = BLOOM;

const M1_Paradigme: Page = () => (
  <Frame mod={1} kind="cours" beats={2}>
    <Title>Trois époques pour créer une application</Title>
    <Lede>Popularisé par Andrej Karpathy en 2025, le « Vibe Coding » change la porte d’entrée de la programmation.</Lede>
    <Grid top={260} cols={3} gap={26}>
      <Card title="Hier · Coder à la main" icon="terminal" tone="navy" d={100} bsz={22}>
        <Tag tone="navy" size={16}>Approche classique</Tag>
        <div style={{ marginTop: 12 }}>Apprendre toute la syntaxe avant de voir le moindre bouton à l’écran. Un point-virgule oublié bloque tout.</div>
      </Card>
      <Card title="Piège · Le copier-coller aveugle" icon="alert" tone="coral" cls={b.on(1)} bsz={22}>
        <Tag tone="coral" size={16}>Faux Vibe Coding</Tag>
        <div style={{ marginTop: 12 }}>Demander « fais-moi une appli » sans comprendre ni vérifier. Dès le 3e changement, plus rien ne marche.</div>
      </Card>
      <Card title="Aujourd’hui · Le Vibe Coding maîtrisé" icon="sparkles" tone="green" cls={b.on(2)} bsz={22}>
        <Tag tone="green" size={16}>Notre méthode</Tag>
        <div style={{ marginTop: 12 }}>Exprimer la logique clairement, faire générer l’UI, <Strong c={C.green}>lire les briques clés du code</Strong> et tester chaque étape.</div>
      </Card>
    </Grid>
    <Box x={120} y={700} w={1680}>
      <Callout tone="blue" icon="compass" title="La règle d’or de ces 3 jours" d={500} size={25}>
        L’IA écrit la syntaxe HTML, CSS et JavaScript ; <Strong>vous êtes l’architecte</Strong> qui définit les variables, les règles, les données et les tests.
      </Callout>
    </Box>
  </Frame>
);

const M1_CanvasArtifacts: Page = () => (
  <Frame mod={1} kind="cours" beats={2}>
    <Title>Votre atelier : Chat à gauche, Application + Code à droite</Title>
    <Lede>Dans Claude Artifacts, ChatGPT Canvas ou Gemini Canvas, chaque consigne produit une vraie interface testable immédiatement.</Lede>
    <Box x={120} y={260} w={740}>
      <Bubble who="vous" tool="Claude / ChatGPT / Gemini" d={100} size={22}>
        Crée une mini-application « Calculateur d’Énergie » avec un curseur d’heures de sommeil (0 à 10 h), un bouton « Analyser » et une carte qui affiche un score en % et un conseil coloré.
      </Bubble>
      <div className={b.on(1)} style={{ marginTop: 18 }}>
        <Bubble who="ia" tool="Mode Canvas / Artifact" size={22}>
          Voici votre application interactive. Vous pouvez la tester dans l’onglet <Strong c={C.violet}>Aperçu</Strong> ou inspecter les variables et fonctions dans l’onglet <Strong c={C.blue}>Code</Strong>.
        </Bubble>
      </div>
    </Box>
    <Box x={900} y={260} w={900}>
      <UiMock title="Calculateur d’Énergie · Onglet Aperçu ↔ Onglet Code" tool="Aperçu interactif" tone="green" d={250}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'stretch' }}>
          <div style={{ flex: 1, background: '#F6F8FC', borderRadius: 14, padding: 16, border: `1.5px solid ${C.rule}` }}>
            <Eyebrow c={C.blue} size={15}>1 · Ce que voit l’utilisateur (UI)</Eyebrow>
            <div style={{ marginTop: 10, fontSize: 20, fontWeight: 700, color: C.navy }}>Sommeil : 8 heures</div>
            <div style={{ marginTop: 8, height: 14, borderRadius: 7, background: C.panel, overflow: 'hidden' }}>
              <div style={{ width: '80%', height: '100%', background: C.green }} />
            </div>
            <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: T.green.bg, color: T.green.fg, fontSize: 19, fontWeight: 700 }}>
              Énergie : 90 % · Pleine forme !
            </div>
          </div>
          <div className={b.on(2)} style={{ flex: 1.1 }}>
            <Code
              file="2 · Ce qu’il y a derrière (Code)"
              size={18}
              hi={[1, 3]}
              code={`let heures = 8;\nlet score = heures * 11;\nif (heures >= 7) {\n  afficher("Pleine forme !");\n}`}
            />
          </div>
        </div>
      </UiMock>
    </Box>
    <Box x={120} y={760} w={1680}>
      <Callout tone="violet" icon="eye" title="Le réflexe Vibe Coding" d={500} size={24}>
        Après chaque génération, cliquez sur <Strong c={C.violet}>Aperçu</Strong> pour essayer l’application, puis sur <Strong c={C.blue}>Code</Strong> pour repérer où se trouvent les valeurs et les règles.
      </Callout>
    </Box>
  </Frame>
);

const M1_Determinisme: Page = () => {
  const [classic, setClassic] = useState(0);
  const [aiRun, setAiRun] = useState(0);
  const variants = [
    { badge: 'Design minimaliste bleu', code: 'let remise = total >= 100 ? total * 0.10 : 0;', note: 'Correct : applique 10 % à partir de 100 €.' },
    { badge: 'Carte moderne violette', code: 'if (total > 100) { remise = total * 0.10; }', note: 'Attention : à 100 € pile, la remise vaut 0 € (> au lieu de >=) !' },
    { badge: 'Style tableau de bord', code: 'let remise = total * 0.15; // seuil inventé', note: 'Hallucination : l’IA a inventé 15 % car le prompt ne précisait pas le taux.' },
  ];
  const cur = variants[aiRun % variants.length];
  return (
    <Frame mod={1} kind="demo">
      <Title>Code déterministe vs IA générative probabiliste</Title>
      <Lede>Un programme exécute toujours la même règle ; une IA génère à chaque fois une proposition nouvelle. Cliquez sur « Relancer » !</Lede>
      <Box x={120} y={260} w={810}>
        <Card title="1 · Le code : 100 % déterministe" icon="gear" tone="navy" bsz={22}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span>Même entrée → <Strong c={C.navy}>toujours la même sortie</Strong></span>
            <Btn icon="reset" ghost tone="navy" size={19} onClick={() => setClassic((x) => x + 1)}>
              Relancer ({classic + 1})
            </Btn>
          </div>
          <Code size={20} code={`function calculerRemise(total) {\n  if (total >= 100) return total * 0.10;\n  return 0;\n}\ncalculerRemise(100);`} />
          <div key={classic} className={A.pop} style={{ marginTop: 14, padding: '12px 18px', borderRadius: 12, background: T.green.bg, color: T.green.fg, fontFamily: display, fontWeight: 800, fontSize: 28 }}>
            Résultat n° {classic + 1} → Remise = 10,00 €
          </div>
        </Card>
      </Box>
      <Box x={970} y={260} w={830}>
        <Card title="2 · L’IA : probabiliste (créative)" icon="sparkles" tone="violet" bsz={22}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span>Même prompt → <Strong c={C.violet}>plusieurs codes possibles</Strong></span>
            <Btn icon="sparkles" tone="violet" size={19} onClick={() => setAiRun((x) => x + 1)}>
              Générer v{aiRun + 1}
            </Btn>
          </div>
          <div key={aiRun} className={A.fade}>
            <Tag tone="violet" size={17}>Variante {aiRun + 1} · {cur.badge}</Tag>
            <Code size={20} style={{ marginTop: 10 }} code={cur.code} />
            <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 12, background: aiRun % 3 === 0 ? T.green.bg : T.coral.bg, color: aiRun % 3 === 0 ? T.green.fg : T.coral.fg, fontSize: 20, fontWeight: 600 }}>
              {cur.note}
            </div>
          </div>
        </Card>
      </Box>
      <Box x={120} y={765} w={1680}>
        <Callout tone="yellow" icon="bulb" title="Pourquoi c’est une force… à condition de vérifier" size={24}>
          L’IA est probabiliste : c’est génial pour explorer 3 designs d’interface, mais <Strong>les règles de calcul doivent être précisées dans le prompt et vérifiées dans le code</Strong>.
        </Callout>
      </Box>
    </Frame>
  );
};

const M1_CANDS = [
  { tok: ' score + 10', p: 0.62, label: 'Logique attendue (+10 pts)', tone: 'green' as Tone },
  { tok: ' score + 1', p: 0.21, label: 'Plausible mais barème différent', tone: 'yellow' as Tone },
  { tok: ' 100', p: 0.11, label: 'Écrase le score précédent !', tone: 'coral' as Tone },
  { tok: ' "10"', p: 0.06, label: 'Bug : texte au lieu d’un nombre', tone: 'coral' as Tone },
];

const M1_TokenTemp: Page = () => {
  const [temp, setTemp] = useState(0.5);
  const [picked, setPicked] = useState<number>(0);
  const w = M1_CANDS.map((c) => c.p ** (1 / Math.max(0.1, temp)));
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
  };
  return (
    <Frame mod={1} kind="demo">
      <Title>Comment l’IA écrit du code : mot après mot (Tokens)</Title>
      <Lede>Un grand modèle de langage (LLM) prédit la suite la plus probable selon votre consigne. Testez l’effet de la température !</Lede>
      <Box x={120} y={255} w={1680}>
        <Code file="En cours de génération par l’IA..." size={23}>
          <Cc>{'// Quand le joueur clique sur la bonne réponse, augmenter son score'}</Cc>
          {'\n'}
          <Ck>if</Ck> (reponseEstCorrecte) {'{'}
          {'\n  '}score = <span style={{ background: 'rgba(255,212,121,.22)', color: '#FFD479', padding: '2px 10px', borderRadius: 6 }}>{M1_CANDS[picked].tok}</span>;
          {'\n}'}
        </Code>
      </Box>
      <Box x={120} y={485} w={1080} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {M1_CANDS.map((c, i) => {
          const pct = Math.round(probs[i] * 100);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: picked === i ? T.blue.bg : C.card, padding: '10px 16px', borderRadius: 12, boxShadow: picked === i ? `inset 0 0 0 2.5px ${C.blue}` : SHADOW_SM }}>
              <code style={{ width: 170, fontFamily: mono, fontWeight: 700, fontSize: 22, color: C.navy }}>{c.tok}</code>
              <div style={{ flex: 1, height: 22, borderRadius: 8, background: C.panel, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: STRONG[c.tone], transition: `width 350ms ${EASE}` }} />
              </div>
              <span style={{ width: 68, textAlign: 'right', fontFamily: display, fontWeight: 800, fontSize: 22 }}>{pct} %</span>
              <Tag tone={c.tone} size={16}>{c.label}</Tag>
            </div>
          );
        })}
      </Box>
      <Box x={1240} y={485} w={560}>
        <Card title="Température (créativité)" icon="sliders" tone="violet" bsz={21}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
            <span style={{ fontFamily: display, fontWeight: 800, fontSize: 44, color: C.electric }}>{fr(temp, 1)}</span>
            <span style={{ color: C.muted }}>{temp <= 0.4 ? 'Précis & prévisible (idéal code)' : temp <= 1.0 ? 'Équilibré' : 'Très créatif (risque de bugs)'}</span>
          </div>
          <Range value={temp} onChange={setTemp} min={0.1} max={1.8} step={0.1} w={480} />
          <div style={{ marginTop: 14 }}>
            <Btn icon="sparkles" size={20} onClick={sample}>
              Tirer le prochain morceau de code
            </Btn>
          </div>
        </Card>
      </Box>
    </Frame>
  );
};

const M1_Algorithme: Page = () => (
  <Frame mod={1} kind="cours" beats={2}>
    <Title>Un algorithme : une recette étape par étape</Title>
    <Lede>En Vibe Coding, c’est vous qui écrivez l’algorithme en français dans votre prompt ; l’IA le traduit en JavaScript.</Lede>
    <Box x={120} y={255} w={1680} style={{ display: 'flex', alignItems: 'stretch', gap: 14 }}>
      <Card title="1 · Entrées" icon="user" tone="blue" d={100} style={{ flex: 1 }} bsz={22}>
        Ce que l’utilisateur saisit ou clique dans l’interface (ex. montant de l’addition, nombre de convives).
      </Card>
      <FlowArrow />
      <Card title="2 · Étapes logiques" icon="gear" tone="violet" d={220} style={{ flex: 1.2 }} bsz={22}>
        La suite d’instructions dans l’ordre : calculer le pourboire, additionner, diviser par personne.
      </Card>
      <FlowArrow />
      <Card title="3 · Sortie visuelle (UI)" icon="palette" tone="green" d={340} style={{ flex: 1 }} bsz={22}>
        Ce qui s’affiche à l’écran : le montant par personne arrondi et un badge récapitulatif.
      </Card>
    </Box>
    <Grid top={535} cols={2} gap={26}>
      <Card title="Prompt flou (algorithme absent)" icon="x" tone="coral" cls={b.on(1)} bsz={21}>
        « Fais une application pour partager l’addition au restaurant. »
        <div style={{ marginTop: 8, color: T.coral.fg, fontWeight: 600 }}>→ L’IA doit deviner les champs, le pourboire et l’arrondi.</div>
      </Card>
      <Card title="Prompt algorithmique (clair & précis)" icon="check" tone="green" cls={b.on(2)} bsz={21}>
        « Entrées : montant total (€), nb de personnes (1 à 20), pourboire (0 %, 5 %, 10 %). Calcul : (montant + pourboire) / personnes. Sortie : carte avec part par personne arrondie à 2 décimales. »
      </Card>
    </Grid>
  </Frame>
);

const M1_Erreurs: Page = () => (
  <Frame mod={1} kind="cours" beats={3}>
    <Title>Les 3 familles d’erreurs (et comment les reconnaître à l’écran)</Title>
    <Lede>Même avec une excellente IA, vous rencontrerez ces trois situations. Savoir les nommer permet de les corriger en 30 secondes.</Lede>
    <Grid top={255} cols={3} gap={26}>
      <Card title="1 · Erreur de syntaxe" icon="code" tone="coral" d={100} bsz={21}>
        <Tag tone="coral" size={16}>Code incomplet / coupé</Tag>
        <div style={{ marginTop: 10 }}>Une parenthèse ou accolade manque (souvent quand la génération s’est coupée).</div>
        <Code size={19} style={{ marginTop: 12 }} code={`function calculer(prix {\n  return prix * 1.2;\n}`} />
        <div style={{ marginTop: 10, fontWeight: 600, color: T.coral.fg }}>Symptôme UI : page blanche ou bouton inerte.</div>
      </Card>
      <Card title="2 · Erreur d’exécution" icon="alert" tone="yellow" cls={b.on(1)} bsz={21}>
        <Tag tone="yellow" size={16}>Plante au clic</Tag>
        <div style={{ marginTop: 10 }}>L’interface s’affiche, mais plante quand on clique (ex. appel à un élément ou une variable au mauvais nom).</div>
        <Code size={19} style={{ marginTop: 12 }} code={`let total = montantHT * 1.2;\n// ReferenceError: montantHT is not defined`} />
        <div style={{ marginTop: 10, fontWeight: 600, color: T.yellow.fg }}>Symptôme UI : rien ne se met à jour au clic.</div>
      </Card>
      <Card title="3 · Erreur de logique" icon="bug" tone="violet" cls={b.on(2)} bsz={21}>
        <Tag tone="violet" size={16}>Plausible mais faux</Tag>
        <div style={{ marginTop: 10 }}>Tout fonctionne visuellement, aucune erreur technique… mais la formule est fausse !</div>
        <Code size={19} style={{ marginTop: 12 }} code={`// Remise de 20 % :\nlet prixFinal = prix + (prix * 0.20);`} />
        <div style={{ marginTop: 10, fontWeight: 600, color: T.violet.fg }}>Symptôme UI : additionne la remise au lieu de la déduire !</div>
      </Card>
    </Grid>
    <Box x={120} y={765} w={1680}>
      <Callout tone="blue" icon="shield" title="Qui attrape quelle erreur ?" cls={b.on(3)} size={24}>
        L’IA corrige très bien les erreurs 1 et 2 si vous lui collez le message. <Strong c={C.violet}>L’erreur 3 (logique) nécessite votre œil humain et un test simple !</Strong>
      </Callout>
    </Box>
  </Frame>
);

const M1_CorrigerIA: Page = () => (
  <Frame mod={1} kind="cours" beats={2}>
    <Title>Comment parler à l’IA quand l’application a un bug</Title>
    <Lede>Ne dites jamais simplement « ça ne marche pas ». Donnez-lui les 3 indices du détective !</Lede>
    <Grid top={260} cols={3} gap={26}>
      <Card title="Indice 1 · L’action" icon="play" tone="blue" d={100} bsz={23}>
        « Quand je saisis <Strong>100 €</Strong> et que je clique sur le bouton <Strong>Calculer la remise</Strong>… »
      </Card>
      <Card title="Indice 2 · Le résultat observé" icon="eye" tone="coral" d={220} bsz={23}>
        « … la carte affiche <Strong c={C.coral}>120 €</Strong> (ou rien ne s’affiche et la console indique <Ic>ReferenceError</Ic>)… »
      </Card>
      <Card title="Indice 3 · Le résultat attendu" icon="checkCircle" tone="green" d={340} bsz={23}>
        « … alors qu’avec 20 % de remise, je devrais obtenir <Strong c={C.green}>80 €</Strong>. Corrige uniquement cette formule sans changer le design. »
      </Card>
    </Grid>
    <Box x={120} y={590} w={1680}>
      <Bubble who="vous" tool="Prompt de correction chirurgical" cls={b.on(1)} size={23}>
        Quand je saisis 100 € avec 20 % de remise et que je clique sur « Calculer », l’application affiche 120 € au lieu de 80 €. Explique-moi en une phrase d’où vient l’erreur dans le code, puis corrige uniquement la ligne du calcul sans modifier le reste de l’interface.
      </Bubble>
    </Box>
    <Box x={120} y={785} w={1680}>
      <Callout tone="green" icon="lock" title="Astuce précieuse : « sans modifier le reste de l’interface »" cls={b.on(2)} size={24}>
        Préciser <Strong c={C.green}>« corrige uniquement cette fonction sans toucher au reste »</Strong> empêche l’IA de redessiner toute votre page à chaque correction.
      </Callout>
    </Box>
  </Frame>
);

const M1_Lab1: Page = () => (
  <VibeLab
    mod={1}
    n="1.1"
    title="Ma première mini-app visuelle en 3 prompts"
    defi="inspecter"
    objective={
      <>
        Générer dans <strong>ChatGPT Canvas, Claude Artifacts ou Gemini</strong> une mini-application graphique <strong>« Convertisseur &amp; Jauge d’Objectif »</strong>, la tester en direct, puis modifier deux valeurs directement dans l’onglet Code.
      </>
    }
    minutes={15}
    crit={
      <>
        <CheckItem id="m1l1a">L’application s’affiche avec un curseur ou champ, un bouton et une jauge colorée</CheckItem>
        <CheckItem id="m1l1b">J’ai ouvert l’onglet Code et changé moi-même le titre ou l’objectif</CheckItem>
        <CheckItem id="m1l1c">J’ai demandé à l’IA une petite amélioration visuelle ciblée</CheckItem>
      </>
    }
  >
    <WStep n={1}>
      Ouvrez ChatGPT, Claude ou Gemini et envoyez ce prompt : <Pr>« Crée une mini-application web interactive en un seul fichier HTML/CSS/JS : un suivi d’objectif d’hydratation (en verres d’eau par jour, objectif = 8 verres) avec boutons +1 / -1, barre de progression colorée et message d’encouragement. Active l’aperçu interactif. »</Pr>
    </WStep>
    <WStep n={2}>
      Testez les boutons <Ic>+1</Ic> et <Ic>-1</Ic> dans l’aperçu, puis basculez sur l’onglet <Strong>Code</Strong> : repérez le nombre <Ic>8</Ic> et remplacez-le par <Ic>10</Ic>.
    </WStep>
    <WStep n={3}>
      Envoyez un 2e prompt d’itération : <Pr>« Ajoute un bouton Réinitialiser et passe la jauge en vert quand l’objectif est atteint, sans changer le reste. »</Pr>
    </WStep>
  </VibeLab>
);

const M1_QCM: Page = () => (
  <Frame mod={1} kind="qcm">
    <Title>QCM · Programmer en Vibe Coding avec l’IA</Title>
    <QuizSeries y={195}>
      <QuizQ
        q="En Vibe Coding, qu’est-ce qui joue le rôle de l’algorithme avant même qu’une ligne de code ne soit écrite ?"
        explain="Votre prompt décrit les entrées, les étapes logiques et la sortie attendue : c’est exactement la définition d’un algorithme."
      >
        <QOpt>La couleur des boutons choisie par l’IA</QOpt>
        <QOpt ok>Votre prompt structuré (entrées, étapes de calcul, sortie attendue)</QOpt>
        <QOpt>La vitesse de connexion Internet</QOpt>
        <QOpt>Le navigateur web utilisé</QOpt>
      </QuizQ>
      <QuizQ
        q="Votre mini-app générée par l’IA est magnifique et ne plante pas, mais elle additionne la remise au lieu de la déduire. De quelle erreur s’agit-il ?"
        explain="Tout s’exécute sans message d’erreur, mais le raisonnement est faux : c’est une erreur de logique (une hallucination fonctionnelle de l’IA)."
      >
        <QOpt>Une erreur de syntaxe</QOpt>
        <QOpt>Une erreur d’exécution</QOpt>
        <QOpt ok>Une erreur de logique (résultat plausible mais faux)</QOpt>
        <QOpt>Une panne d’écran</QOpt>
      </QuizQ>
      <QuizQ
        q="Pourquoi deux participants qui envoient exactement le même prompt à une IA obtiennent-ils deux codes légèrement différents ?"
        explain="Les modèles de langage sont probabilistes : ils tirent les prochains tokens selon des probabilités (température)."
      >
        <QOpt>Parce que l’un des deux ordinateurs calcule mal</QOpt>
        <QOpt ok>Parce que l’IA générative est probabiliste (elle échantillonne parmi les suites probables)</QOpt>
        <QOpt>Parce que JavaScript change ses règles toutes les heures</QOpt>
        <QOpt>C’est un bug du navigateur</QOpt>
      </QuizQ>
      <QuizQ
        q="Quelle est la meilleure formulation pour faire corriger un bug à l’IA sans qu’elle refasse toute votre interface ?"
        explain="Décrire l’action, le résultat obtenu, le résultat attendu, et demander de ne modifier que la partie concernée."
      >
        <QOpt>« Ça ne marche pas, recommence tout »</QOpt>
        <QOpt>« Ton code est nul »</QOpt>
        <QOpt ok>« Quand je clique sur Calculer avec 100 €, j’obtiens 120 € au lieu de 80 € : corrige uniquement la formule sans toucher au design »</QOpt>
        <QOpt>Supprimer la conversation et changer de sujet</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ════════════════════════════════════════════════════════════════════════════
// MODULE 2 — Variables, types & opérateurs : piloter l'interface (10 pages)
// ════════════════════════════════════════════════════════════════════════════
const M2_Divider: Page = () => (
  <Divider mod={2} kicker="Jour 1 · Matin" title="Variables, types et opérateurs : les réglages de votre UI">
    <Bullet size={30}>Repérer les variables qui pilotent votre écran</Bullet>
    <Bullet size={30}>Nombres, textes, booléens (vrai / faux) dans une interface</Bullet>
    <Bullet size={30}>Calculer, comparer et éviter le piège du texte + nombre</Bullet>
  </Divider>
);
M2_Divider.transition = BLOOM;

const M2_VariablesUI: Page = () => (
  <Frame mod={2} kind="cours" beats={2}>
    <Title>Une variable : boîte mémoire qui pilote un élément de l’écran</Title>
    <Lede>Chaque chiffre, texte ou badge visible dans votre mini-application correspond à une variable dans le code.</Lede>
    <Box x={120} y={260} w={820}>
      <Code
        file="Dans l’onglet Code (JavaScript)"
        size={23}
        hi={[1, 2, 3, 4]}
        code={`let prenom = "Camille";\nlet verresBus = 6;\nconst objectif = 8;\nlet modeSombre = false;`}
      />
      <Callout tone="blue" icon="sliders" title="Pourquoi les repérer ?" cls={b.on(1)} style={{ marginTop: 20 }} size={23}>
        Pour changer l’objectif de 8 à 10 verres ou le prénom par défaut, pas besoin de relancer un long prompt : <Strong>changez la valeur de la variable en 2 secondes !</Strong>
      </Callout>
    </Box>
    <Box x={980} y={260} w={820}>
      <UiMock title="Ce que ces 4 variables affichent dans l’UI" tool="Aperçu UI" tone="blue" d={200}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>
            Bonjour <span style={{ background: T.blue.bg, color: T.blue.fg, padding: '2px 10px', borderRadius: 8 }}>Camille</span> <span style={{ fontFamily: mono, fontSize: 16, color: C.muted }}>← prenom</span>
          </div>
          <Tag tone="grey" size={16}>modeSombre = false</Tag>
        </div>
        <div style={{ marginTop: 10, padding: 16, borderRadius: 14, background: '#F6F8FC', border: `1.5px solid ${C.rule}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 21, fontWeight: 700 }}>
            <span>Progression : <span style={{ color: C.electric }}>6</span> / <span style={{ color: C.violet }}>8</span> verres</span>
            <span style={{ fontFamily: mono, fontSize: 16, color: C.muted }}>← verresBus / objectif</span>
          </div>
          <div style={{ marginTop: 10, height: 18, borderRadius: 9, background: C.panel, overflow: 'hidden' }}>
            <div style={{ width: '75%', height: '100%', background: G.blue }} />
          </div>
        </div>
      </UiMock>
      <div className={b.on(2)} style={{ marginTop: 16 }}>
        <Callout tone="yellow" icon="key" title="Le signe = en programmation" size={23}>
          <Ic>let verresBus = 6</Ic> se lit : <Strong>« range la valeur 6 dans la boîte verresBus »</Strong>.
        </Callout>
      </div>
    </Box>
  </Frame>
);

const M2_LetConstNom: Page = () => (
  <Frame mod={2} kind="cours" beats={2}>
    <Title>let, const et l’importance des noms explicites</Title>
    <Lede>Un bon nom de variable aide à la fois l’humain qui relit ET l’IA qui complète le code !</Lede>
    <Grid top={255} cols={2} gap={28}>
      <Card title="let vs const : qui a le droit de changer ?" icon="lock" tone="blue" d={100} bsz={22}>
        <Code
          size={21}
          style={{ marginTop: 6 }}
          code={`const tauxTVA = 0.20;   // fixe : ne bouge jamais\nlet panierHT = 50;      // évolue quand l’utilisateur clique\npanierHT = panierHT + 25; // maintenant 75`}
        />
        <div style={{ marginTop: 12 }}>
          <Strong>const</Strong> protège vos règles fixes ; <Strong c={C.violet}>let</Strong> stocke l’état qui évolue avec les clics de l’utilisateur.
        </div>
      </Card>
      <Card title="Noms muets vs noms explicites" icon="eye" tone="green" cls={b.on(1)} bsz={22}>
        <Code
          size={21}
          style={{ marginTop: 6 }}
          code={`// ❌ Illisible (et trompeur pour l’IA)\nlet x = 1500; let y = 900;\n\n// ✅ Explicite (auto-documenté)\nlet budgetMensuel = 1500;\nlet depensesTotales = 900;`}
        />
        <div style={{ marginTop: 12 }}>
          Dans vos prompts, <Strong c={C.green}>nommez vos concepts métiers</Strong> : l’IA reprendra exactement votre vocabulaire dans le code.
        </div>
      </Card>
    </Grid>
    <Box x={120} y={760} w={1680}>
      <Callout tone="violet" icon="sparkles" title="Astuce de prompt" cls={b.on(2)} size={24}>
        Ajoutez à la fin de vos prompts : <Pr>« Utilise des noms de variables en français clairs et explicites (ex. budgetMensuel, resteADepenser). »</Pr>
      </Callout>
    </Box>
  </Frame>
);

const M2_TypesUI: Page = () => (
  <Frame mod={2} kind="cours" beats={1}>
    <Title>Les 3 types de valeurs… vus depuis votre interface</Title>
    <Lede>Dans le code généré, chaque type de variable correspond à un type de composant visuel bien précis.</Lede>
    <Grid top={255} cols={3} gap={26}>
      <Card title="1 · Nombre (number)" icon="gauge" tone="blue" d={100} bsz={22}>
        <div>Pour compter, calculer un prix, un score ou un pourcentage.</div>
        <Code size={20} style={{ marginTop: 12 }} code={`let budget = 1200;\nlet remise = 15.5;\n// Sans guillemets !`} />
        <div style={{ marginTop: 12 }}>
          <Tag tone="blue" size={16}>Côté UI</Tag> Curseur, compteur, jauge, graphique.
        </div>
      </Card>
      <Card title="2 · Texte (string)" icon="chat" tone="violet" d={220} bsz={22}>
        <div>Toujours entouré de guillemets <Ic>"..."</Ic>, <Ic>'...'</Ic> ou <Ic>`...`</Ic>.</div>
        <Code size={20} style={{ marginTop: 12 }} code={`let categorie = "Loisirs";\nlet devise = "€";\nlet message = \`Total : \${budget} €\`;`} />
        <div style={{ marginTop: 12 }}>
          <Tag tone="violet" size={16}>Côté UI</Tag> Champ texte, titre, badge, alerte.
        </div>
      </Card>
      <Card title="3 · Booléen (boolean)" icon="checkCircle" tone="green" d={340} bsz={22}>
        <div>Deux valeurs possibles uniquement : <Ic>true</Ic> (vrai) ou <Ic>false</Ic> (faux).</div>
        <Code size={20} style={{ marginTop: 12 }} code={`let modeSombre = true;\nlet estValide = false;\nlet alerteActive = budget > 1000;`} />
        <div style={{ marginTop: 12 }}>
          <Tag tone="green" size={16}>Côté UI</Tag> Interrupteur, case à cocher, afficher/masquer.
        </div>
      </Card>
    </Grid>
    <Box x={120} y={760} w={1680}>
      <Callout tone="teal" icon="search" title="Comment vérifier le type dans le code ?" cls={b.on(1)} size={24}>
        Pas de guillemets = <Strong>nombre</Strong> ou <Strong c={C.green}>booléen</Strong> (<Ic>true</Ic>/<Ic>false</Ic>). Entre guillemets = <Strong c={C.violet}>texte</Strong>.
      </Callout>
    </Box>
  </Frame>
);

const M2_PiegeInput: Page = () => (
  <Frame mod={2} kind="cours" beats={2}>
    <Title>Le bug n°1 des mini-apps web : « 50 + 20 = 5020 » !</Title>
    <Lede>Dans une page HTML, tout ce qu’un utilisateur tape dans un champ de saisie arrive sous forme de texte.</Lede>
    <Grid top={255} cols={2} gap={28}>
      <Card title="Le piège : coller deux textes" icon="bug" tone="coral" d={100} bsz={22}>
        <Code
          size={21}
          hi={[3]}
          style={{ marginTop: 6 }}
          code={`let saisie = "50"; // vient d’un champ <input>\nlet frais = 20;\nlet total = saisie + frais;\n// Résultat affiché : "5020" € !`}
        />
        <div style={{ marginTop: 12 }}>
          Avec du texte, l’opérateur <Ic>+</Ic> ne fait pas une addition : il <Strong c={C.coral}>colle les caractères bout à bout</Strong> !
        </div>
      </Card>
      <Card title="La parade : convertir en nombre" icon="check" tone="green" cls={b.on(1)} bsz={22}>
        <Code
          size={21}
          hi={[1, 3]}
          style={{ marginTop: 6 }}
          code={`let saisie = Number(champ.value); // ou parseFloat\nlet frais = 20;\nlet total = saisie + frais;\n// Résultat affiché : 70 € ✓`}
        />
        <div style={{ marginTop: 12 }}>
          <Ic>Number(...)</Ic> transforme le texte <Ic>"50"</Ic> en vrai nombre <Ic>50</Ic> avant de calculer.
        </div>
      </Card>
    </Grid>
    <Box x={120} y={735} w={1680}>
      <Callout tone="yellow" icon="bulb" title="Symptôme à reconnaître immédiatement en testant votre UI" cls={b.on(2)} size={24}>
        Si votre calculatrice affiche <Strong c={C.coral}>10020 €</Strong> au lieu de <Strong c={C.green}>120 €</Strong>, dites simplement à l’IA : <Pr>« Convertis la valeur du champ en nombre avec Number() avant l’addition. »</Pr>
      </Callout>
    </Box>
  </Frame>
);

const M2_Operateurs: Page = () => (
  <Frame mod={2} kind="cours" beats={2}>
    <Title>Calculer et comparer dans les règles de votre application</Title>
    <Lede>Voici les seuls symboles que vous avez besoin de reconnaître quand vous inspectez le code généré par l’IA.</Lede>
    <Grid top={255} cols={2} gap={28}>
      <Card title="Opérateurs de calcul (produisent un nombre)" icon="sliders" tone="blue" d={100} bsz={22}>
        <Code
          size={21}
          style={{ marginTop: 6 }}
          code={`let ttc = ht * 1.20;        // multiplication (*)\nlet part = ttc / convives;  // division (/)\nlet reste = budget - ttc;   // soustraction (-)\nlet Modulo = 10 % 3;        // reste de division (1)`}
        />
      </Card>
      <Card title="Comparaisons (produisent true ou false)" icon="checkCircle" tone="violet" cls={b.on(1)} bsz={22}>
        <Code
          size={21}
          style={{ marginTop: 6 }}
          code={`score === 100          // strictement égal à 100\ndepense > budget       // dépasse le budget\nage >= 18 && inscrit   // ET : les 2 sont vrais\njour === "sam" || jour === "dim" // OU : l’un des 2`}
        />
      </Card>
    </Grid>
    <Box x={120} y={720} w={1680}>
      <Callout tone="coral" icon="alert" title="Ne jamais confondre = et ===" cls={b.on(2)} size={25}>
        Un seul <Ic>=</Ic> <Strong>modifie</Strong> la variable (<Ic>score = 10</Ic>). Trois <Ic>===</Ic> <Strong c={C.violet}>posent une question</Strong> sans rien modifier (<Ic>score === 10</Ic> → vrai ou faux).
      </Callout>
    </Box>
  </Frame>
);

const M2_SimVariables: Page = () => {
  const [ht, setHt] = useState(200);
  const [remisePct, setRemisePct] = useState(10);
  const [vip, setVip] = useState(false);
  const tauxEffectif = vip ? remisePct + 5 : remisePct;
  const montantRemise = Math.round(ht * (tauxEffectif / 100));
  const net = ht - montantRemise;
  return (
    <Frame mod={2} kind="demo">
      <Title>Simulateur : manipulez les variables, observez le code et l’UI</Title>
      <Lede>Bougez les curseurs et l’interrupteur : voyez comment les variables mettent à jour l’interface en temps réel.</Lede>
      <Box x={120} y={255} w={540}>
        <Card title="1 · Vos contrôles (Entrées)" icon="sliders" tone="blue" bsz={21}>
          <Col gap={16}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>montantHT (number)</span>
                <span style={{ color: C.blue }}>{ht} €</span>
              </div>
              <Range value={ht} onChange={setHt} min={50} max={500} step={25} w={460} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>remisePct (number)</span>
                <span style={{ color: C.violet }}>{remisePct} %</span>
              </div>
              <Range value={remisePct} onChange={setRemisePct} min={0} max={30} step={5} w={460} />
            </div>
            <Toggle on={vip} onChange={setVip} tone="green" size={21} label={<strong>clientVIP (boolean : +5 % bonus)</strong>} />
          </Col>
        </Card>
      </Box>
      <Box x={690} y={255} w={560}>
        <Code
          file="2 · État des variables dans le code"
          size={20}
          hi={[5, 6]}
          code={`let montantHT = ${ht};\nlet remisePct = ${remisePct};\nlet clientVIP = ${vip};\n\nlet taux = clientVIP ? remisePct + 5 : remisePct;\nlet netAPayer = montantHT - (montantHT * taux / 100);\n// netAPayer vaut ${net} €`}
        />
      </Box>
      <Box x={1280} y={255} w={520}>
        <UiMock title="3 · Rendu carte UI" tool="Live UI" tone="green">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 19, color: C.muted }}>Devis instantané</span>
            <Tag tone={vip ? 'green' : 'grey'} size={15}>{vip ? '★ Client VIP (+5 %)' : 'Standard'}</Tag>
          </div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 48, color: C.navy, marginTop: 4 }}>{net} €</div>
          <div style={{ fontSize: 19, color: T.green.fg, fontWeight: 600 }}>
            Économie : {montantRemise} € ({tauxEffectif} %)
          </div>
          <div style={{ marginTop: 6, height: 12, borderRadius: 6, background: C.panel, overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, (net / 500) * 100)}%`, height: '100%', background: G.blue }} />
          </div>
        </UiMock>
      </Box>
      <Box x={120} y={760} w={1680}>
        <Callout tone="blue" icon="eye" title="Ce qu’il faut retenir" size={24}>
          Une interface interactive n’est rien d’autre qu’un <Strong>ensemble de variables</Strong> reliées à une <Strong c={C.violet}>formule de calcul</Strong> et à un <Strong c={C.green}>affichage</Strong>.
        </Callout>
      </Box>
    </Frame>
  );
};

const M2_PromptVars: Page = () => (
  <Frame mod={2} kind="cours" beats={1}>
    <Title>Dicter ses variables et formules dans un prompt</Title>
    <Lede>Pour obtenir le calcul exact du premier coup, donnez à l’IA les noms des variables, leurs valeurs par défaut et la formule.</Lede>
    <Box x={120} y={260} w={1680}>
      <Bubble who="vous" tool="Modèle de prompt structuré (Variables + Formule + UI)" size={23}>
        Crée une mini-application « Simulateur d’Épargne Mensuelle » avec une interface claire.
        <br />
        <Strong>Variables d’entrée (avec curseurs) :</Strong> <Ic>revenuMensuel</Ic> (défaut : 2500 €), <Ic>tauxEpargne</Ic> (défaut : 15 %), <Ic>dureeMois</Ic> (défaut : 12 mois), et un interrupteur booléen <Ic>arrondiAutomatique</Ic> (+20 € / mois).
        <br />
        <Strong>Formule :</Strong> <Ic>epargneMensuelle = (revenuMensuel * tauxEpargne / 100) + (arrondiAutomatique ? 20 : 0)</Ic>, et <Ic>totalCumule = epargneMensuelle * dureeMois</Ic>.
        <br />
        <Strong>Sortie UI :</Strong> deux grandes cartes affichant <Ic>epargneMensuelle</Ic> et <Ic>totalCumule</Ic>, et une barre visuelle.
      </Bubble>
    </Box>
    <Box x={120} y={640} w={1680}>
      <Callout tone="green" icon="checkCircle" title="Pourquoi ce prompt est redoutable" cls={b.on(1)} size={25}>
        Quand vous ouvrirez l’onglet <Strong>Code</Strong> de Claude, ChatGPT ou Gemini, vous retrouverez mot pour mot <Ic>revenuMensuel</Ic>, <Ic>tauxEpargne</Ic> et <Ic>totalCumule</Ic> : <Strong c={C.green}>vous êtes en terrain connu !</Strong>
      </Callout>
    </Box>
  </Frame>
);

const M2_Lab2: Page = () => (
  <VibeLab
    mod={2}
    n="2.1"
    title="Calculatrice de Budget & Partage avec jauges visuelles"
    defi="trous"
    objective={
      <>
        Compléter un <strong>prompt à trous</strong> pour générer un calculateur de budget d’équipe ou de voyage dans <strong>ChatGPT, Claude ou Gemini</strong>, puis modifier une constante et une formule dans le code.
      </>
    }
    minutes={20}
    crit={
      <>
        <CheckItem id="m2l2a">Mes 3 variables d’entrée ont des noms explicites en français</CheckItem>
        <CheckItem id="m2l2b">J’ai vérifié à la main que le calcul affiché est exact (ex. 100 € / 4 = 25 €)</CheckItem>
        <CheckItem id="m2l2c">J’ai modifié dans le code la valeur par défaut et la devise (€ → $ ou CHF)</CheckItem>
      </>
    }
  >
    <WStep n={1}>
      Complétez les <Ic>[___]</Ic> et envoyez à votre IA : <Pr>« Crée une mini-app UI de partage de frais. Variables d’entrée : montantTotal (défaut [___] €), nbParticipants (défaut [___]), et un booléen inclurePourboire (ajoute [___] %). Affiche la part par personne en grand et une barre de répartition. »</Pr>
    </WStep>
    <WStep n={2}>
      Vérifiez le calcul avec des chiffres ronds (ex. 100 €, 4 personnes, sans pourboire = 25 €).
    </WStep>
    <WStep n={3}>
      Ouvrez l’onglet <Strong>Code</Strong> : changez le taux de pourboire (ex. de 10 % à 15 %) directement dans le code et observez le nouveau résultat dans l’aperçu !
    </WStep>
  </VibeLab>
);

const M2_Pause: Page = () => <Pause mod={2} title="Pause" back="Reprise dans 15 minutes" minutes={15} />;

// ════════════════════════════════════════════════════════════════════════════
// MODULE 3 — Conditions et boucles : rendre l'UI dynamique (9 pages)
// ════════════════════════════════════════════════════════════════════════════
const M3_Divider: Page = () => (
  <Divider mod={3} kicker="Jour 1 · Matin" title="Conditions et boucles : donner vie à l’interface">
    <Bullet size={30}>Prendre des décisions visuelles avec if / else if / else</Bullet>
    <Bullet size={30}>Répéter automatiquement des cartes UI avec les boucles</Bullet>
    <Bullet size={30}>Lire et piloter les règles métier générées par l’IA</Bullet>
  </Divider>
);
M3_Divider.transition = BLOOM;

const M3_ConditionsUI: Page = () => (
  <Frame mod={3} kind="cours" beats={2}>
    <Title>if / else : comment l’application adapte son affichage</Title>
    <Lede>Chaque fois qu’un badge change de couleur ou qu’une alerte apparaît selon un seuil, c’est un bloc if / else qui travaille.</Lede>
    <Box x={120} y={260} w={880}>
      <Code
        file="Logique conditionnelle dans le code"
        size={22}
        hi={[1, 3, 5]}
        code={`if (depense > budget) {\n  afficherBadge("Dépassement !", "rouge");\n} else if (depense >= budget * 0.8) {\n  afficherBadge("Attention (80 %)", "orange");\n} else {\n  afficherBadge("Budget maîtrisé ✓", "vert");\n}`}
      />
    </Box>
    <Box x={1040} y={260} w={760} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card title="Cas 1 · depense > budget (Vrai)" icon="alert" tone="coral" d={150} bsz={21} pad={18}>
        Le 1er test est vrai : l’écran affiche le badge <Tag tone="coral" size={16}>Dépassement !</Tag> et ignore la suite.
      </Card>
      <Card title="Cas 2 · Entre 80 % et 100 %" icon="clock" tone="yellow" cls={b.on(1)} bsz={21} pad={18}>
        Le 1er est faux, le <Ic>else if</Ic> est vrai : badge <Tag tone="yellow" size={16}>Attention (80 %)</Tag>.
      </Card>
      <Card title="Cas 3 · Sinon (else)" icon="checkCircle" tone="green" cls={b.on(2)} bsz={21} pad={18}>
        Dans tous les autres cas : badge <Tag tone="green" size={16}>Budget maîtrisé ✓</Tag>.
      </Card>
    </Box>
  </Frame>
);

const M3_TableDecision: Page = () => (
  <Frame mod={3} kind="cours" beats={1}>
    <Title>Le secret d’un prompt conditionnel sans faille : la table de seuils</Title>
    <Lede>Si vous dites « affiche une alerte quand c’est élevé », l’IA choisit un seuil au hasard. Donnez-lui une table claire !</Lede>
    <Grid top={260} cols={2} gap={28}>
      <Card title="Ce que vous écrivez dans votre prompt" icon="chat" tone="blue" d={100} bsz={22}>
        <div style={{ background: T.blue.bg, borderRadius: 12, padding: 16, fontSize: 21, color: C.ink }}>
          « Affiche un badge d’état selon le <Ic>tauxOccupation</Ic> :
          <br />• <Strong c={C.green}>Moins de 70 %</Strong> : badge Vert « Fluide »
          <br />• <Strong c={C.amber}>De 70 % à 90 % inclus</Strong> : badge Orange « Chargé »
          <br />• <Strong c={C.coral}>Plus de 90 %</Strong> : badge Rouge « Saturé » »
        </div>
      </Card>
      <Card title="Ce que vous vérifiez dans le code généré" icon="search" tone="violet" cls={b.on(1)} bsz={22}>
        <Code
          size={20}
          hi={[1, 3]}
          code={`if (tauxOccupation < 70) {\n  etat = "Fluide";\n} else if (tauxOccupation <= 90) {\n  etat = "Chargé";\n} else {\n  etat = "Saturé";\n}`}
        />
        <div style={{ marginTop: 10, fontSize: 20 }}>
          Vérifiez toujours les bornes : <Ic>&lt;</Ic> (strictement moins) vs <Ic>&lt;=</Ic> (inclus) !
        </div>
      </Card>
    </Grid>
  </Frame>
);

const M3_BouclesUI: Page = () => (
  <Frame mod={3} kind="cours" beats={2}>
    <Title>Les boucles : générer 10 cartes UI avec 4 lignes de code</Title>
    <Lede>Dès qu’une interface affiche une série d’éléments (questions de quiz, cartes, étapes), l’IA utilise une boucle.</Lede>
    <Box x={120} y={260} w={880}>
      <Code
        file="Boucle for...of dans le code généré"
        size={22}
        hi={[2, 3]}
        code={`let categories = ["Logement", "Repas", "Transport", "Loisirs"];\nfor (let nom of categories) {\n  creerCarteUI(nom);\n}`}
      />
      <Callout tone="blue" icon="loop" title="Comment se lit for (let nom of categories) ?" cls={b.on(1)} style={{ marginTop: 20 }} size={23}>
        « <Strong>Pour chaque élément</Strong> de la liste <Ic>categories</Ic>, crée une carte à l’écran. » Si vous ajoutez un 5e mot dans la liste, une 5e carte apparaît automatiquement !
      </Callout>
    </Box>
    <Box x={1040} y={260} w={760}>
      <UiMock title="Rendu automatique des 4 cartes" tool="Généré par la boucle" tone="teal" d={200}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <div style={{ padding: 16, borderRadius: 12, background: T.blue.bg, fontWeight: 700, color: T.blue.fg }}>1 · Carte « Logement »</div>
          <div style={{ padding: 16, borderRadius: 12, background: T.violet.bg, fontWeight: 700, color: T.violet.fg }}>2 · Carte « Repas »</div>
          <div style={{ padding: 16, borderRadius: 12, background: T.teal.bg, fontWeight: 700, color: T.teal.fg }}>3 · Carte « Transport »</div>
          <div style={{ padding: 16, borderRadius: 12, background: T.green.bg, fontWeight: 700, color: T.green.fg }}>4 · Carte « Loisirs »</div>
        </div>
        <div className={b.on(2)} style={{ marginTop: 8, padding: '10px 14px', borderRadius: 10, background: T.yellow.bg, color: T.yellow.fg, fontSize: 19, fontWeight: 600 }}>
          Astuce : ajoutez <Ic>"Épargne"</Ic> dans la liste, la 5e carte se crée toute seule !
        </div>
      </UiMock>
    </Box>
  </Frame>
);

const M3_BoucleStop: Page = () => (
  <Frame mod={3} kind="cours" beats={1}>
    <Title>Trois façons de répéter que vous verrez dans le code de l’IA</Title>
    <Lede>Pas besoin de les écrire de mémoire : sachez simplement les reconnaître d’un coup d’œil.</Lede>
    <Grid top={255} cols={3} gap={26}>
      <Card title="1 · for...of (parcourir)" icon="layers" tone="blue" d={100} bsz={21}>
        <Code size={19} style={{ marginTop: 8 }} code={`for (let question of quiz) {\n  afficher(question);\n}`} />
        <div style={{ marginTop: 12 }}>Parcourt chaque élément d’une liste du premier au dernier. S’arrête tout seul.</div>
      </Card>
      <Card title="2 · for (compter de 1 à N)" icon="clock" tone="violet" d={220} bsz={21}>
        <Code size={19} style={{ marginTop: 8 }} code={`for (let i = 1; i <= 5; i++) {\n  creerEtoile(i);\n}`} />
        <div style={{ marginTop: 12 }}>Répète un nombre précis de tours (ici 5 étoiles de notation de 1 à 5).</div>
      </Card>
      <Card title="3 · while (tant que...)" icon="alert" tone="yellow" d={340} bsz={21}>
        <Code size={19} style={{ marginTop: 8 }} code={`while (essaisRestants > 0) {\n  jouerUnTour();\n  essaisRestants--;\n}`} />
        <div style={{ marginTop: 12 }}>Continue tant que la condition est vraie. <Strong c={C.coral}>Attention</Strong> : si rien ne fait baisser <Ic>essaisRestants</Ic>, la boucle est infinie !</div>
      </Card>
    </Grid>
    <Box x={120} y={760} w={1680}>
      <Callout tone="green" icon="bulb" title="En résumé" cls={b.on(1)} size={24}>
        Dans 90 % des mini-apps web générées par ChatGPT, Claude ou Gemini, vous verrez <Ic>for...of</Ic> ou son cousin <Ic>.forEach / .map</Ic> pour afficher des listes à l’écran.
      </Callout>
    </Box>
  </Frame>
);

const M3_FlipCodeUI: Page = () => (
  <Frame mod={3} kind="demo">
    <Title>Jeu collectif : que va afficher l’interface ? (Cartes à retourner)</Title>
    <Lede>Lisez chaque extrait de code généré par l’IA, dites votre pronostic à voix haute, puis je retourne la carte !</Lede>
    <Grid top={255} cols={2} gap={26}>
      <FlipCard
        h={340}
        tone="blue"
        backTone="green"
        front={
          <>
            <Eyebrow c={C.blue} size={18}>Défi 1 · Condition sur un score</Eyebrow>
            <Code size={20} style={{ marginTop: 10 }} code={`let score = 70;\nlet badge = "Bronze";\nif (score >= 80) {\n  badge = "Or";\n} else if (score >= 60) {\n  badge = "Argent";\n}`} />
          </>
        }
        back={
          <>
            <Eyebrow c={T.green.fg} size={18}>Réponse UI · Défi 1</Eyebrow>
            <div style={{ marginTop: 14, fontFamily: display, fontWeight: 800, fontSize: 36, color: C.navy }}>Badge affiché : « Argent »</div>
            <div style={{ marginTop: 10, fontSize: 22, color: C.ink }}>70 n’est pas ≥ 80, mais 70 est bien ≥ 60 : la deuxième branche gagne !</div>
          </>
        }
      />
      <FlipCard
        h={340}
        tone="violet"
        backTone="green"
        front={
          <>
            <Eyebrow c={C.violet} size={18}>Défi 2 · Boucle de badges</Eyebrow>
            <Code size={20} style={{ marginTop: 10 }} code={`let niveaux = ["Débutant", "Confirmé", "Expert"];\nfor (let niv of niveaux) {\n  creerBouton(niv);\n}`} />
          </>
        }
        back={
          <>
            <Eyebrow c={T.green.fg} size={18}>Réponse UI · Défi 2</Eyebrow>
            <div style={{ marginTop: 14, fontFamily: display, fontWeight: 800, fontSize: 34, color: C.navy }}>3 boutons créés à l’écran</div>
            <div style={{ marginTop: 10, fontSize: 22, color: C.ink }}>Un bouton « Débutant », un « Confirmé » et un « Expert », dans cet ordre.</div>
          </>
        }
      />
      <FlipCard
        h={340}
        tone="coral"
        backTone="coral"
        front={
          <>
            <Eyebrow c={C.coral} size={18}>Défi 3 · Cherchez le bug de l’IA !</Eyebrow>
            <Code size={20} style={{ marginTop: 10 }} code={`// Gratuit à partir de 50 € d’achat :\nlet panier = 50;\nif (panier > 50) {\n  fraisPort = 0;\n} else {\n  fraisPort = 5;\n}`} />
          </>
        }
        back={
          <>
            <Eyebrow c={T.coral.fg} size={18}>Piège repéré · Défi 3</Eyebrow>
            <div style={{ marginTop: 14, fontFamily: display, fontWeight: 800, fontSize: 32, color: T.coral.fg }}>Facturé 5 € au lieu de 0 € !</div>
            <div style={{ marginTop: 10, fontSize: 22, color: C.ink }}>L’IA a écrit <Ic>&gt; 50</Ic> au lieu de <Ic>&gt;= 50</Ic>. À 50 € pile, la condition est fausse !</div>
          </>
        }
      />
      <FlipCard
        h={340}
        tone="teal"
        backTone="green"
        front={
          <>
            <Eyebrow c={C.teal} size={18}>Défi 4 · Texte ou Nombre ?</Eyebrow>
            <Code size={20} style={{ marginTop: 10 }} code={`let saisieChamp = "30";\nlet bonus = 10;\nlet resultat = Number(saisieChamp) + bonus;`} />
          </>
        }
        back={
          <>
            <Eyebrow c={T.green.fg} size={18}>Réponse UI · Défi 4</Eyebrow>
            <div style={{ marginTop: 14, fontFamily: display, fontWeight: 800, fontSize: 36, color: C.navy }}>Affiche 40 (et pas "3010")</div>
            <div style={{ marginTop: 10, fontSize: 22, color: C.ink }}>Grâce à <Ic>Number(saisieChamp)</Ic>, la conversion en nombre a bien eu lieu avant l’addition.</div>
          </>
        }
      />
    </Grid>
  </Frame>
);

const M3_Lab3: Page = () => (
  <VibeLab
    mod={3}
    n="3.1"
    title="Jauge intelligente à 3 paliers & cartes générées par boucle"
    defi="ameliorer"
    objective={
      <>
        Enrichir votre calculateur dans <strong>ChatGPT, Claude ou Gemini</strong> avec une <strong>table de décision à 3 couleurs</strong> (Vert / Orange / Rouge) et une série de boutons de scénarios générés par une boucle.
      </>
    }
    minutes={20}
    crit={
      <>
        <CheckItem id="m3l3a">La couleur et le message changent exactement aux seuils demandés</CheckItem>
        <CheckItem id="m3l3b">J’ai testé la valeur pile sur la frontière (ex. 80 % ou 100 %)</CheckItem>
        <CheckItem id="m3l3c">J’ai ajouté un 4e scénario dans la liste du code et vu le 4e bouton apparaître</CheckItem>
      </>
    }
  >
    <WStep n={1}>
      Envoyez un prompt avec une table de seuils précise : <Pr>« Ajoute un badge diagnostic selon le résultat : moins de 50 = Vert (Économe), de 50 à 100 inclus = Orange (Équilibré), plus de 100 = Rouge (Alerte). »</Pr>
    </WStep>
    <WStep n={2}>
      Demandez ensuite : <Pr>« Ajoute en haut 3 boutons de scénarios rapides générés par une boucle à partir d’une liste (Petit budget : 30, Moyen : 75, Grand : 140) qui remplissent automatiquement les champs au clic. »</Pr>
    </WStep>
    <WStep n={3}>
      Dans l’onglet <Strong>Code</Strong>, repérez la liste des 3 scénarios et ajoutez-en un 4e vous-même !
    </WStep>
  </VibeLab>
);

const M3_QCM: Page = () => (
  <Frame mod={3} kind="qcm">
    <Title>QCM · Variables, types, conditions et boucles</Title>
    <QuizSeries y={195}>
      <QuizQ
        q="Dans une mini-application générée par l’IA, vous voyez : let total = champPrix.value + 10; et l’écran affiche « 2510 € » quand vous tapez 25. Pourquoi ?"
        explain="champPrix.value est du texte ('25'). Sans Number(), l’opérateur + colle '25' et '10' en '2510'."
      >
        <QOpt>Parce que l’ordinateur multiplie par 100</QOpt>
        <QOpt ok>Parce que la saisie d’un champ HTML est du texte : il faut la convertir avec Number()</QOpt>
        <QOpt>Parce qu’on a utilisé let au lieu de const</QOpt>
        <QOpt>Parce que l’écran est trop petit</QOpt>
      </QuizQ>
      <QuizQ
        q="Quelle différence y a-t-il entre let score = 10; et score === 10 ?"
        explain="Un seul = range la valeur 10 dans la boîte score. Trois === comparent score à 10 et répondent true ou false."
      >
        <QOpt>Aucune, ce sont deux écritures identiques</QOpt>
        <QOpt ok>= range une valeur dans la variable, tandis que === compare deux valeurs (vrai/faux)</QOpt>
        <QOpt>=== sert uniquement pour le texte</QOpt>
        <QOpt>= compare trois variables à la fois</QOpt>
      </QuizQ>
      <QuizQ
        q="Vous voulez que la livraison soit gratuite dès 50 € d’achat inclus. Quelle condition devez-vous voir dans le code de l’IA ?"
        explain="« Dès 50 € inclus » se traduit par >= 50 (supérieur ou égal). Avec > 50, un panier de 50 € paierait encore la livraison."
      >
        <QOpt>if (panier &gt; 50)</QOpt>
        <QOpt ok>if (panier &gt;= 50)</QOpt>
        <QOpt>if (panier = 50)</QOpt>
        <QOpt>if (panier &lt;= 50)</QOpt>
      </QuizQ>
      <QuizQ
        q="Quel est l’intérêt de demander à l’IA d’afficher 6 cartes à partir d’une liste et d’une boucle for...of plutôt que de copier-coller 6 fois le code d’une carte ?"
        explain="Le code est court, lisible, et il suffit d’ajouter un élément dans la liste pour créer automatiquement une nouvelle carte."
      >
        <QOpt>Cela consomme plus de mémoire</QOpt>
        <QOpt ok>On modifie le style d’une carte à un seul endroit et on ajoute une 7e carte en une ligne</QOpt>
        <QOpt>Les boucles changent automatiquement les couleurs</QOpt>
        <QOpt>C’est obligatoire pour utiliser des nombres</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M3_Dejeuner: Page = () => <Pause mod={3} title="Pause déjeuner" back="Reprise à 14 h 00" minutes={90} />;

const PAGES_O: Page[] = [O_Cover, O_Welcome, O_Formateur, O_Virtuel, O_Poll, O_Objectifs, O_Programme, O_FilRouge, O_Outils, O_Defis];
const PAGES_M1: Page[] = [M1_Divider, M1_Paradigme, M1_CanvasArtifacts, M1_Determinisme, M1_TokenTemp, M1_Algorithme, M1_Erreurs, M1_CorrigerIA, M1_Lab1, M1_QCM];
const PAGES_M2: Page[] = [M2_Divider, M2_VariablesUI, M2_LetConstNom, M2_TypesUI, M2_PiegeInput, M2_Operateurs, M2_SimVariables, M2_PromptVars, M2_Lab2, M2_Pause];
const PAGES_M3: Page[] = [M3_Divider, M3_ConditionsUI, M3_TableDecision, M3_BouclesUI, M3_BoucleStop, M3_FlipCodeUI, M3_Lab3, M3_QCM, M3_Dejeuner];

const NOTES_O: string[] = [
  // O_Cover
  `⏱ 3 min · COUVERTURE · 9:00

OBJECTIF — Accueillir chaleureusement, lancer la dynamique Vibe Coding dès la première minute.

DIRE — « Bonjour à toutes et à tous, bienvenue dans cette formation Vibe Coding chez Docaposte Institute. Je suis Houssem Eddine Lassoued et je vais vous accompagner pendant ces trois jours. Dès ce matin, nous allons utiliser l’IA générative — ChatGPT, Claude ou Gemini — pour créer de vraies mini-applications interactives avec une interface graphique, tout en apprenant à lire et piloter les briques fondamentales du code. »

ANIMATION — Vérifier le son, la caméra et le partage d’écran.

TRANSITION — « Voyons tout de suite notre promesse pour ces trois jours. »`,
  // O_Welcome
  `⏱ 3 min · PROMESSE & CONTRAT PÉDAGOGIQUE

OBJECTIF — Donner les repères chiffrés et rassurer les débutants complets.

DIRE — « Quatre repères : 21 heures sur 3 jours, plus de 60 % de pratique en Vibe Coding, 10 ateliers et TP où vous construisez de vraies interfaces visuelles, et 4 environnements complémentaires : ChatGPT, Claude, Gemini dans le navigateur, puis VS Code au jour 3. Notre contrat est simple : l’IA écrit la syntaxe, mais c’est vous qui comprenez la logique pour diriger et vérifier. »

ANIMATION — Les quatre compteurs s’animent à l’ouverture de la page.

TRANSITION — « Je me présente en deux minutes avant de vous écouter. »`,
  // O_Formateur
  `⏱ 2 min · VOTRE FORMATEUR

OBJECTIF — Présenter le parcours du formateur de manière concise et accessible.

DIRE — « Je suis développeur depuis 18 ans, ingénieur et doctorant en IA, et j’ai animé plus de 250 sessions de formation. Mon objectif pendant ces trois jours est de démystifier totalement le code : vous montrer qu’avec une bonne méthode et l’IA comme copilote, chacun peut bâtir une mini-application propre et utile. »

ANIMATION — Lecture rapide des trois cartes du bas.

TRANSITION — « Posons nos règles de confort en classe virtuelle. »`,
  // O_Virtuel
  `⏱ 3 min · CLASSE VIRTUELLE

OBJECTIF — Fixer les règles de la classe virtuelle et des ateliers individuels.

DIRE — « Nous sommes à distance : caméra allumée si possible, micro coupé hors prise de parole, mais n’hésitez jamais à l’ouvrir pour voter ou poser une question. Idéalement, partagez votre écran en deux : la formation d’un côté, votre outil IA de l’autre. Tous les ateliers sont individuels sur votre poste, avec des points d’étape toutes les 15 minutes et un partage d’écran de 2 minutes si vous bloquez. Et règle absolue : zéro donnée réelle ou confidentielle dans les prompts. »

ANIMATION — Faire confirmer oralement que chacun a bien ouvert ChatGPT, Claude ou Gemini.

TRANSITION — « Faisons un tour de table rapide et notre premier vote. »`,
  // O_Poll
  `⏱ 6 min · TOUR DE TABLE & SONDAGE

OBJECTIF — Connaître le profil de chaque participant et l’outil IA qu’il utilise.

DIRE — « Dites-moi à voix haute un chiffre de 1 à 4, je clique au fur et à mesure. Puis je vous appelle chacun par votre prénom pour une minute : votre métier, l’outil IA que vous utilisez aujourd’hui, et une idée de mini-app qui vous ferait plaisir. »

ANIMATION — Cliquer sur les barres du sondage à chaque voix orale, puis appeler chaque participant dans l’ordre de la liste.

TRANSITION — « Regardons les 6 objectifs officiels de la formation. »`,
  // O_Objectifs
  `⏱ 3 min · LES 6 OBJECTIFS OFFICIELS

OBJECTIF — Montrer comment le programme officiel s’articule avec l’IA générative dès le jour 1.

DIRE — « Voici les six objectifs officiels : comprendre les concepts de base (variables, types, conditions, boucles), identifier la structure d’un programme et les fonctions, découvrir les bonnes pratiques et les tests simples, pratiquer le cycle éditer-tester-corriger, construire une mini-app interactive pas à pas, et intégrer l’IA générative pour accélérer. Au lieu d’attendre le dernier jour pour voir l’IA, nous l’utilisons dès ce matin pour rendre chaque notion concrète et visuelle. »

ANIMATION — → beat 1 : faire apparaître l’encadré violet en bas.

TRANSITION — « Voici comment ces objectifs se répartissent sur nos trois journées. »`,
  // O_Programme
  `⏱ 3 min · PROGRAMME DES 3 JOURS

OBJECTIF — Donner la feuille de route claire des 3 journées.

DIRE — « Jour 1 : la logique et les bases du code en Vibe Coding avec ChatGPT, Claude ou Gemini, jusqu’à votre premier Quiz ou Calculateur graphique cet après-midi. Jour 2 : structurer un projet et manipuler des données — listes, objets, JSON/CSV, tests simples et sauvegarde dans le navigateur. Jour 3 : VS Code, un Skill et une équipe de trois agents — un Product Owner, un développeur JavaScript et un testeur — qui livrent une nouvelle fonctionnalité, puis la mise en ligne sur GitHub Pages et la démo finale. »

ANIMATION — Parcourir les trois colonnes de gauche à droite.

TRANSITION — « Découvrons notre fil rouge applicatif : VibePulse. »`,
  // O_FilRouge
  `⏱ 3 min · LE FIL ROUGE VIBEPULSE

OBJECTIF — Montrer concrètement le rendu visuel des applications que les participants vont créer.

DIRE — « Fini les exercices abstraits sur fond noir : chaque journée produit une vraie interface graphique. Aujourd’hui, VibeQuiz ou VibeCalc. Demain, TaskFlow : un outil de gestion de projet avec backlog, Kanban en glisser-déposer et sauvegarde automatique, construit en quatre incréments. Et mercredi, TaskFlow passe dans VS Code, gagne une fonctionnalité livrée par une équipe d’agents, et part en ligne sur GitHub Pages. »

ANIMATION — Pointer l’aperçu UI à droite : montrer les compteurs, le statut des auto-tests et les cartes.

TRANSITION — « Quels outils allons-nous utiliser concrètement ? »`,
  // O_Outils
  `⏱ 3 min · BOÎTE À OUTILS VIBE CODING

OBJECTIF — Expliquer le rôle de ChatGPT Canvas, Claude Artifacts, Gemini Canvas et VS Code.

DIRE — « Aujourd’hui et demain, vous utilisez l’outil web de votre choix : ChatGPT (avec Canvas), Claude (avec Artifacts) ou Gemini (avec Canvas). Tous trois permettent de générer une page web et de la voir fonctionner en direct sans rien installer. Et si jamais l’aperçu intégré est indisponible, plan B universel : on enregistre le code dans un fichier index.html et on double-clique dessus ! Mercredi, nous ouvrirons ce projet dans VS Code avec les Agents et les Skills. »

ANIMATION — → beat 1 : afficher l’astuce du fichier index.html.

TRANSITION — « Dernier point avant de plonger dans le module 1 : nos formats d’exercices. »`,
  // O_Defis
  `⏱ 2 min · LES 6 FORMATS DE DÉFIS

OBJECTIF — Expliquer la pédagogie active des ateliers.

DIRE — « Dans nos ateliers, vous n’allez jamais copier-coller passivement un prompt tout fait. Vous aurez des prompts à améliorer, des prompts à trous où vous choisissez les variables, des rétro-prompts à partir d’une maquette, et des missions d’inspection où vous modifiez directement une ligne ciblée dans le code généré. C’est parti pour le Module 1 ! »

ANIMATION — Balayer les 6 cartes.

TRANSITION — « Ouvrons le Module 1 : qu’est-ce que programmer en Vibe Coding ? »`,
];

const NOTES_M1: string[] = [
  // M1_Divider
  `⏱ 1 min · MODULE 1

DIRE — « Module 1 : qu’est-ce que programmer à l’ère du Vibe Coding ? Nous allons relier la logique algorithmique au fonctionnement réel des IA génératives. »

TRANSITION — « Commençons par définir ce qu’est — et ce que n’est pas — le Vibe Coding. »`,
  // M1_Paradigme
  `⏱ 5 min · TROIS ÉPOQUES

OBJECTIF — Positionner le Vibe Coding maîtrisé face au code manuel et au copier-coller aveugle.

DIRE — « Autrefois, il fallait des semaines de syntaxe avant d’afficher un bouton. À l’inverse, le piège actuel est de demander à l’IA “fais-moi une appli” sans rien lire ni comprendre : au troisième changement, tout casse. Le vrai Vibe Coding, c’est la troisième carte : vous exprimez la logique clairement, l’IA génère l’interface, et vous savez lire les variables, les conditions et les fonctions pour piloter et vérifier. »

ANIMATION — → beat 1 : carte rouge (piège). → beat 2 : carte verte (Vibe Coding maîtrisé).

TRANSITION — « Voyons à quoi ressemble concrètement notre établi de travail. »`,
  // M1_CanvasArtifacts
  `⏱ 5 min · CHAT À GAUCHE, APERÇU + CODE À DROITE

OBJECTIF — Montrer la mécanique Aperçu UI ↔ Onglet Code dans Claude/ChatGPT/Gemini.

DIRE — « Dans votre outil IA, vous avez deux panneaux : à gauche la conversation où vous donnez vos consignes ; à droite l’application qui tourne en direct avec un bouton pour basculer entre l’Aperçu visuel et le Code source. Regardez à droite : quand l’utilisateur voit “Sommeil : 8 heures” et une jauge à 80 %, dans le code il y a simplement let heures = 8 et une condition if. »

ANIMATION — → beat 1 : réponse de l’IA. → beat 2 : panneau Code en regard de l’UI. Faire une démo rapide de 60 secondes en direct.

TRANSITION — « Mais comment l’IA fabrique-t-elle ce code ? C’est la différence fondamentale entre déterministe et probabiliste. »`,
  // M1_Determinisme
  `⏱ 6 min · DÉTERMINISTE VS PROBABILISTE (SIMULATEUR)

OBJECTIF — Faire expérimenter la différence entre l’exécution du code et la génération par l’IA.

DIRE — « À gauche, une fonction JavaScript qui calcule une remise de 10 % dès 100 €. Si je clique dix fois sur Relancer, elle donne dix fois 10,00 € : le code est déterministe. À droite, je demande trois fois la même chose à l’IA : cliquez sur Générer. Première fois : code juste. Deuxième fois : elle écrit strictement supérieur à 100 au lieu de supérieur ou égal ! Troisième fois : elle invente 15 % ! L’IA est probabiliste : elle génère du code plausible, c’est à nous de fixer les règles et de vérifier. »

ANIMATION — Cliquer plusieurs fois sur « Relancer » à gauche puis sur « Générer » à droite pour montrer les 3 variantes.

TRANSITION — « Pourquoi varie-t-elle ainsi ? Regardons sous le capot avec les tokens et la température. »`,
  // M1_TokenTemp
  `⏱ 6 min · TOKENS & TEMPÉRATURE (SIMULATEUR)

OBJECTIF — Comprendre la prédiction du mot suivant et le rôle de la température.

DIRE — « Un LLM écrit le code morceau par morceau — on appelle ces morceaux des tokens. Ici, après score =, le modèle calcule les probabilités : score + 10 a 62 % de chances, mais score + 1 ou même une erreur comme "10" entre guillemets ont une petite probabilité. Si je monte le curseur de température, le hasard augmente. Pour du code, on veut réduire le flou grâce à une consigne très précise ! »

ANIMATION — Bouger le curseur de température et cliquer sur « Tirer le prochain morceau de code » 3 ou 4 fois.

TRANSITION — « Comment réduire l’incertitude de l’IA ? En lui donnant un algorithme clair. »`,
  // M1_Algorithme
  `⏱ 5 min · VOTRE PROMPT EST L’ALGORITHME

OBJECTIF — Apprendre à structurer un prompt comme un algorithme (Entrées → Étapes → Sortie).

DIRE — « Un algorithme, c’est tout simplement une recette : quelles sont les entrées, quelles sont les étapes de calcul dans l’ordre, et quelle est la sortie. En Vibe Coding, votre prompt EST l’algorithme ! Comparez en bas : avec un prompt flou, l’IA devine. Avec Entrées / Calcul / Sortie UI, elle traduit fidèlement votre pensée en code. »

ANIMATION — → beat 1 : prompt flou. → beat 2 : prompt algorithmique.

TRANSITION — « Et quand une erreur survient malgré tout, comment la reconnaître ? »`,
  // M1_Erreurs
  `⏱ 6 min · LES 3 FAMILLES D’ERREURS

OBJECTIF — Savoir diagnostiquer erreur de syntaxe, d’exécution et de logique sur une mini-app.

DIRE — « Trois familles à connaître. Un : l’erreur de syntaxe, une accolade ou parenthèse manque, la page reste blanche. Deux : l’erreur d’exécution, l’interface s’affiche mais quand vous cliquez sur le bouton, rien ne se passe parce qu’un nom est mal orthographié. Trois : l’erreur de logique, la plus fréquente avec l’IA : le bouton marche, mais l’IA a additionné la remise au lieu de la soustraire ! »

ANIMATION — → beat 1 : erreur d’exécution. → beat 2 : erreur de logique. → beat 3 : encadré récapitulatif.

TRANSITION — « Voyons comment formuler un prompt de correction efficace. »`,
  // M1_CorrigerIA
  `⏱ 4 min · DIALOGUER POUR CORRIGER UN BUG

OBJECTIF — Donner la méthode en 3 indices pour faire corriger un bug par l’IA.

DIRE — « Quand un bug apparaît, donnez trois informations à l’IA : 1. l’action effectuée, 2. le résultat observé (ou le message d’erreur), 3. le résultat attendu. Et ajoutez toujours la formule magique : “corrige uniquement ce calcul sans modifier le reste de l’interface”. »

ANIMATION — → beat 1 : bulle de prompt. → beat 2 : encadré vert.

TRANSITION — « À vous de jouer : votre toute première mini-application en Vibe Coding ! »`,
  // M1_Lab1
  `⏱ 15 min · ATELIER VIBE 1.1 · PREMIÈRE MINI-APP EN 3 PROMPTS

OBJECTIF — Générer une première application graphique, la tester et modifier une valeur dans le code.

DIRE — « Quinze minutes, chacun sur son poste dans ChatGPT, Claude ou Gemini. Je vous colle le prompt de départ dans le clavardage. Étape 1 : générez le suivi d’hydratation et testez les boutons +1 et -1. Étape 2 : ouvrez l’onglet Code, cherchez le chiffre 8 de l’objectif et passez-le à 10. Étape 3 : demandez par prompt d’ajouter un bouton Réinitialiser. »

ANIMATION — Lancer le minuteur de 15 minutes. Point d’étape oral à 7 minutes : « Qui voit sa jauge bouger ? ». Si un participant n’a pas l’aperçu automatique, lui faire enregistrer en index.html.

TRANSITION — « Faisons le QCM du Module 1 à voix haute. »`,
  // M1_QCM
  `⏱ 6 min · QCM MODULE 1

OBJECTIF — Valider la compréhension du Vibe Coding, des algorithmes et des 3 types d’erreurs.

DIRE — « Quatre questions : vous votez à voix haute avec A, B, C ou D, et je clique la réponse majoritaire. »

ANIMATION — Parcourir les 4 questions avec le bouton « Suivante ».

TRANSITION — « Passons au Module 2 : les variables, les types et les opérateurs qui pilotent votre interface. »`,
];

const NOTES_M2: string[] = [
  // M2_Divider
  `⏱ 1 min · MODULE 2

DIRE — « Module 2 : variables, types et opérateurs. Vous venez de modifier un chiffre dans le code : comprenons maintenant comment fonctionnent toutes ces boîtes mémoires qui pilotent l’écran. »

TRANSITION — « Regardons le lien direct entre une variable et l’interface. »`,
  // M2_VariablesUI
  `⏱ 5 min · VARIABLES & INTERFACE

OBJECTIF — Relier visuellement les variables du code aux éléments affichés dans l’interface.

DIRE — « Une variable est une boîte avec une étiquette. À gauche dans le code : prenom contient Camille, verresBus contient 6, objectif contient 8. À droite dans l’interface : chaque variable s’affiche à un endroit précis ! Le signe = veut dire “range cette valeur dans la boîte”. »

ANIMATION — → beat 1 : pourquoi les repérer. → beat 2 : sens du signe =.

TRANSITION — « Pourquoi certaines lignes commencent par let et d’autres par const ? »`,
  // M2_LetConstNom
  `⏱ 5 min · LET, CONST & NOMMAGE

OBJECTIF — Distinguer let et const et imposer un bon nommage à l’IA.

DIRE — « const sert pour une valeur fixe qui ne doit pas bouger, comme le taux de TVA ou l’objectif maximum. let sert pour une valeur qui évolue quand l’utilisateur clique, comme le panier ou le score. Et regardez à droite : x et y ne veulent rien dire, alors que budgetMensuel et depensesTotales se lisent comme du français. Exigez toujours des noms explicites dans vos prompts ! »

ANIMATION — → beat 1 : noms explicites. → beat 2 : astuce de prompt.

TRANSITION — « Quels types de valeurs peut-on ranger dans ces variables ? »`,
  // M2_TypesUI
  `⏱ 5 min · LES 3 TYPES DE VALEURS CÔTÉ UI

OBJECTIF — Reconnaître number, string et boolean et leur équivalent visuel.

DIRE — « Trois types suffisent. Le nombre, sans guillemets : c’est un curseur, un prix, une jauge. Le texte (string), toujours entre guillemets : c’est un titre, un nom, un message. Et le booléen, true ou false : c’est un interrupteur, comme activer le mode sombre ou cocher une option. »

ANIMATION — → beat 1 : repère visuel avec ou sans guillemets.

TRANSITION — « Attention maintenant au bug numéro 1 que tout le monde rencontre dans une interface web. »`,
  // M2_PiegeInput
  `⏱ 5 min · LE PIÈGE DU CHAMP TEXTE (50 + 20 = 5020)

OBJECTIF — Comprendre pourquoi un champ HTML renvoie du texte et comment le convertir avec Number().

DIRE — « Quand un utilisateur tape 50 dans un champ de saisie HTML, le navigateur donne le texte "50" entre guillemets. Si le code fait "50" + 20, JavaScript colle le texte et affiche 5020 € ! La solution tient en un mot : Number(champ.value) pour transformer le texte en vrai nombre avant d’additionner. »

ANIMATION — → beat 1 : la parade Number(). → beat 2 : comment le demander à l’IA.

TRANSITION — « Voyons l’ensemble des opérateurs de calcul et de comparaison. »`,
  // M2_Operateurs
  `⏱ 5 min · CALCULER ET COMPARER

OBJECTIF — Lire les opérateurs arithmétiques et logiques dans le code généré.

DIRE — « À gauche, les calculs classiques : +, -, * pour multiplier, / pour diviser. À droite, les comparaisons qui répondent vrai ou faux : === pour tester l’égalité, >= pour supérieur ou égal, && pour ET, || pour OU. Retenez surtout la règle du bas : un seul = range une valeur, trois === comparent. »

ANIMATION — → beat 1 : comparaisons. → beat 2 : encadré = vs ===.

TRANSITION — « Manipulons ces variables en direct sur notre simulateur. »`,
  // M2_SimVariables
  `⏱ 6 min · SIMULATEUR : INSPECTEUR DE VARIABLES UI

OBJECTIF — Visualiser en temps réel l’impact des variables (number, boolean) sur le code et le rendu UI.

DIRE — « Regardez les trois colonnes : à gauche je bouge le curseur montantHT et remisePct, et j’active l’interrupteur booléen clientVIP. Au milieu, vous voyez les variables cambiar en direct dans le code. À droite, la carte UI recalcule le net à payer ! Demander à un participant : que vaudra le taux si je mets remisePct à 15 % et que j’active clientVIP ? »

ANIMATION — Faire varier les curseurs et le bouton Toggle en direct devant les participants.

TRANSITION — « Comment rédiger un prompt pour que l’IA crée exactement ces variables ? »`,
  // M2_PromptVars
  `⏱ 4 min · DICTER SES VARIABLES DANS LE PROMPT

OBJECTIF — Montrer un modèle de prompt qui nomme les variables et la formule.

DIRE — « Voici le secret : dans votre prompt, donnez les noms des variables d’entrée, la formule de calcul, et les cartes de sortie. Non seulement l’IA ne se trompe pas de formule, mais quand vous ouvrez le code, vous retrouvez vos propres mots ! »

ANIMATION — → beat 1 : encadré vert.

TRANSITION — « À vous de pratiquer avec l’Atelier 2.1 ! »`,
  // M2_Lab2
  `⏱ 20 min · ATELIER VIBE 2.1 · CALCULATRICE DE BUDGET & PARTAGE

OBJECTIF — Compléter un prompt à trous, vérifier un calcul et modifier une variable dans le code.

DIRE — « Vingt minutes individuelles. Je vous colle le prompt à trous dans le clavardage : choisissez vos valeurs par défaut, générez l’application dans ChatGPT, Claude ou Gemini, vérifiez le calcul avec 100 € pour 4 personnes, puis allez dans l’onglet Code pour changer le pourcentage de pourboire et la devise. »

ANIMATION — Lancer le minuteur de 20 minutes. Point d’étape à 10 minutes.

TRANSITION — « Quinze minutes de pause bien méritée loin de l’écran ! »`,
  // M2_Pause
  `⏱ 15 min · PAUSE MATIN

DIRE — « Quinze minutes de pause, reposez vos yeux, on se retrouve juste après pour les conditions et les boucles. »

ANIMATION — Lancer le minuteur de 15 minutes.`,
];

const NOTES_M3: string[] = [
  // M3_Divider
  `⏱ 1 min · MODULE 3

DIRE — « Module 3 : les conditions et les boucles. C’est ce qui rend votre interface intelligente et capable d’afficher des dizaines d’éléments sans effort. »

TRANSITION — « Commençons par les décisions visuelles avec if / else. »`,
  // M3_ConditionsUI
  `⏱ 5 min · IF / ELSE CÔTÉ INTERFACE

OBJECTIF — Comprendre comment un bloc if / else if / else pilote les couleurs et messages d’une UI.

DIRE — « Regardez ce code : si la dépense dépasse le budget, on affiche un badge rouge. Sinon, si elle atteint au moins 80 % du budget, un badge orange. Sinon, un badge vert. Les conditions sont testées du haut vers le bas : dès qu’une branche est vraie, elle s’exécute. »

ANIMATION — → beat 1 : branche orange. → beat 2 : branche verte.

TRANSITION — « Comment demander une telle règle à l’IA sans ambiguïté ? »`,
  // M3_TableDecision
  `⏱ 5 min · LA TABLE DE DÉCISION DANS LE PROMPT

OBJECTIF — Apprendre à spécifier des seuils précis dans un prompt et à vérifier < vs <= dans le code.

DIRE — « Au lieu d’écrire “change la couleur selon le taux”, écrivez une petite liste à puces avec les bornes exactes : moins de 70 %, de 70 à 90 % inclus, plus de 90 %. Et dans le code généré, jetez un coup d’œil aux signes < et <= : c’est là que se jouent les cas limites ! »

ANIMATION — → beat 1 : code correspondant à droite.

TRANSITION — « Deuxième super-pouvoir du matin : les boucles. »`,
  // M3_BouclesUI
  `⏱ 5 min · LES BOUCLES POUR GÉNÉRER DES CARTES UI

OBJECTIF — Comprendre comment une boucle transforme une liste de mots en cartes visuelles.

DIRE — « Imaginez que vous vouliez 4 cartes de catégories dans votre interface. On ne va pas écrire 4 fois le même bloc HTML : on met les 4 noms dans une liste, et la boucle for...of répète automatiquement la création de la carte pour chaque nom. Si vous ajoutez “Épargne” dans la liste, la 5e carte apparaît toute seule ! »

ANIMATION — → beat 1 : explication de for...of. → beat 2 : ajout d’un 5e élément.

TRANSITION — « Voici les 3 formes de boucles que vous croiserez dans le code généré. »`,
  // M3_BoucleStop
  `⏱ 4 min · FOR...OF, FOR ET WHILE

OBJECTIF — Savoir reconnaître les 3 boucles de base et comprendre le risque de boucle infinie.

DIRE — « Trois formes à reconnaître visuellement : for...of pour parcourir une liste, for avec un compteur i de 1 à 5 pour répéter un nombre connu de fois, et while qui tourne tant qu’une condition reste vraie. Dans 90 % de vos mini-apps web, c’est la première qui servira à générer vos cartes ! »

ANIMATION — → beat 1 : encadré récapitulatif.

TRANSITION — « Jouons ensemble avec 4 cartes à retourner ! »`,
  // M3_FlipCodeUI
  `⏱ 8 min · JEU COLLECTIF : DEVINETTE CODE ↔ UI (FLIPCARDS)

OBJECTIF — S’entraîner à lire un court bloc généré par l’IA et à prédire son effet visuel.

DIRE — « Quatre extraits de code générés par l’IA. Pour chaque carte, lisez les 5 lignes, dites-moi à voix haute ce que l’écran va afficher, puis je clique sur la carte pour révéler la réponse ! Attention au défi 3, il contient un piège classique de l’IA. »

ANIMATION — Faire voter les participants à l’oral sur chaque carte, puis cliquer dessus pour la retourner.

TRANSITION — « À vous d’ajouter des paliers conditionnels et une boucle dans votre application ! »`,
  // M3_Lab3
  `⏱ 20 min · ATELIER VIBE 3.1 · JAUGE À 3 PALIERS & BOUTONS EN BOUCLE

OBJECTIF — Ajouter une règle conditionnelle à 3 seuils et une rangée de boutons générés par boucle.

DIRE — « Vingt minutes sur votre poste. Étape 1 : demandez à l’IA d’ajouter un badge diagnostic à 3 couleurs avec des seuils précis. Étape 2 : faites générer 3 boutons de scénarios rapides via une boucle. Étape 3 : ouvrez l’onglet Code et ajoutez vous-même un 4e scénario dans la liste ! »

ANIMATION — Lancer le minuteur de 20 minutes. Tester avec un participant le cas pile sur la borne (ex. 50 ou 100).

TRANSITION — « Clôturons la matinée avec le QCM des Modules 2 et 3. »`,
  // M3_QCM
  `⏱ 7 min · QCM MODULES 2 & 3

OBJECTIF — Valider la maîtrise des variables, types, comparaisons, conditions et boucles.

DIRE — « Quatre questions à voix haute : dites A, B, C ou D. »

ANIMATION — Cliquer les réponses votées et commenter chaque explication.

TRANSITION — « Excellente matinée ! Pause déjeuner d’une heure trente, on se retrouve à 14 h 00. »`,
  // M3_Dejeuner
  `⏱ 90 min · PAUSE DÉJEUNER

DIRE — « Bon appétit à toutes et à tous ! On se retrouve à 14 h 00 pour les fonctions, le constructeur de prompts UI et le grand TP du Jour 1. »

ANIMATION — Lancer le minuteur de 90 minutes.`,
];

// ════════════════════════════════════════════════════════════════════════════
// MODULE 4 — Fonctions : organiser le code & brancher les boutons (7 pages)
// ════════════════════════════════════════════════════════════════════════════
const M4_Divider: Page = () => (
  <Divider mod={4} kicker="Jour 1 · Après-midi" title="Fonctions : organiser le code et brancher les boutons">
    <Bullet size={30}>L’anatomie d’une mini-app : HTML, CSS et JavaScript</Bullet>
    <Bullet size={30}>Comprendre les paramètres, le traitement et le return</Bullet>
    <Bullet size={30}>Relier chaque bouton de l’écran à une fonction claire</Bullet>
  </Divider>
);
M4_Divider.transition = BLOOM;

const M4_TriniteWeb: Page = () => (
  <Frame mod={4} kind="cours" beats={2}>
    <Title>L’anatomie d’une mini-application web générée par l’IA</Title>
    <Lede>Quand ChatGPT, Claude ou Gemini crée votre mini-application, son fichier combine trois rôles complémentaires.</Lede>
    <Grid top={260} cols={3} gap={26}>
      <Card title="1 · HTML : le squelette" icon="layers" tone="blue" d={100} bsz={21}>
        <Tag tone="blue" size={16}>Les éléments visibles</Tag>
        <div style={{ marginTop: 10 }}>Titres, champs de saisie, boutons et cartes.</div>
        <Code size={18} style={{ marginTop: 12 }} code={`<input id="montant" />\n<button onclick="calculer()">\n  Calculer\n</button>\n<div id="resultat"></div>`} />
      </Card>
      <Card title="2 · CSS : l’habillage" icon="palette" tone="violet" cls={b.on(1)} bsz={21}>
        <Tag tone="violet" size={16}>Le design &amp; les couleurs</Tag>
        <div style={{ marginTop: 10 }}>Couleurs, arrondis, ombres, polices et mise en page.</div>
        <Code size={18} style={{ marginTop: 12 }} code={`.carte {\n  background: #ffffff;\n  border-radius: 16px;\n  padding: 20px;\n}`} />
      </Card>
      <Card title="3 · JS : le cerveau (fonctions)" icon="gear" tone="green" cls={b.on(2)} bsz={21}>
        <Tag tone="green" size={16}>Les actions &amp; calculs</Tag>
        <div style={{ marginTop: 10 }}>Les fonctions qui s’exécutent quand on clique sur un bouton.</div>
        <Code size={18} style={{ marginTop: 12 }} code={`function calculer() {\n  let ht = Number(montant.value);\n  resultat.textContent = ht * 1.2;\n}`} />
      </Card>
    </Grid>
    <Box x={120} y={765} w={1680}>
      <Callout tone="blue" icon="compass" title="Pourquoi ce découpage vous aide à prompter" d={400} size={24}>
        Vous voulez changer une couleur ? Demandez une retouche <Strong c={C.violet}>CSS / style</Strong>. Vous voulez changer une formule au clic ? Demandez de modifier uniquement la <Strong c={C.green}>fonction JavaScript</Strong>.
      </Callout>
    </Box>
  </Frame>
);

const M4_RoleFonction: Page = () => (
  <Frame mod={4} kind="cours" beats={3}>
    <Title>Qu’est-ce qu’une fonction ? Une recette réutilisable</Title>
    <Lede>Une fonction porte un nom verbe d’action, reçoit des ingrédients (paramètres) et renvoie un résultat (return).</Lede>
    <Box x={120} y={260} w={920}>
      <Code
        file="Une fonction propre générée par l’IA"
        size={22}
        hi={[1, 2, 3]}
        code={`function calculerMensualite(montant, nbMois) {\n  let parMois = montant / nbMois;\n  return Math.round(parMois);\n}\n\n// On peut l’utiliser autant de fois qu’on veut :\nlet offreA = calculerMensualite(1200, 12); // → 100 €\nlet offreB = calculerMensualite(1200, 6);  // → 200 €`}
      />
    </Box>
    <Box x={1080} y={260} w={720} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card title="1 · Le nom (verbe d’action)" icon="code" tone="blue" d={150} bsz={21} pad={18}>
        <Ic>calculerMensualite</Ic> indique immédiatement ce que fait ce bloc.
      </Card>
      <Card title="2 · Les paramètres (entrées)" icon="sliders" tone="violet" cls={b.on(1)} bsz={21} pad={18}>
        <Ic>(montant, nbMois)</Ic> : les valeurs qu’on lui fournit à chaque appel.
      </Card>
      <Card title="3 · Le return (sortie)" icon="checkCircle" tone="green" cls={b.on(2)} bsz={21} pad={18}>
        <Ic>return</Ic> renvoie la valeur calculée pour l’afficher dans la carte UI.
      </Card>
    </Box>
    <Box x={120} y={770} w={1680}>
      <Callout tone="yellow" icon="bulb" title="La règle d’or : 1 fonction = 1 seule responsabilité" cls={b.on(3)} size={24}>
        Une fonction qui calcule le score ne doit pas en même temps changer les couleurs et réinitialiser le jeu : <Strong>une tâche par fonction !</Strong>
      </Callout>
    </Box>
  </Frame>
);

const M4_SimClic: Page = () => {
  const [choice, setChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const pick = (opt: string) => {
    setChoice(opt);
    if (opt === 'Number()') setScore((s) => s + 10);
  };
  const ok = choice === 'Number()';
  return (
    <Frame mod={4} kind="demo">
      <Title>Démo interactive : du clic sur le bouton jusqu’à la fonction</Title>
      <Lede>Cliquez sur l’une des 3 réponses dans la mini-app à gauche et observez comment la fonction s’exécute à droite !</Lede>
      <Box x={120} y={255} w={760}>
        <UiMock title="Mini-Quiz interactif (cliquez sur une réponse)" tool="Aperçu UI" tone="blue">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tag tone="blue" size={16}>Question 1 / 5</Tag>
            <span style={{ fontFamily: display, fontWeight: 800, fontSize: 22, color: C.navy }}>Score : {score} pts</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.ink, marginTop: 4 }}>
            Quelle fonction transforme le texte "42" en nombre 42 ?
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
            <Btn tone={choice === 'String()' ? 'coral' : 'blue'} ghost={choice !== 'String()'} size={20} onClick={() => pick('String()')}>
              A · String()
            </Btn>
            <Btn tone={choice === 'Number()' ? 'green' : 'blue'} ghost={choice !== 'Number()'} size={20} onClick={() => pick('Number()')}>
              B · Number()
            </Btn>
            <Btn tone={choice === 'Alert()' ? 'coral' : 'blue'} ghost={choice !== 'Alert()'} size={20} onClick={() => pick('Alert()')}>
              C · Alert()
            </Btn>
          </div>
          <div style={{ marginTop: 10, padding: '12px 16px', borderRadius: 12, background: choice === null ? T.grey.bg : ok ? T.green.bg : T.coral.bg, color: choice === null ? C.muted : ok ? T.green.fg : T.coral.fg, fontSize: 20, fontWeight: 600 }}>
            {choice === null ? 'Cliquez sur A, B ou C pour déclencher verifierReponse(choix)…' : ok ? '✓ Bravo ! +10 points ajoutés au score.' : '✗ Pas tout à fait : Number() convertit en nombre.'}
          </div>
        </UiMock>
      </Box>
      <Box x={920} y={255} w={880}>
        <Code
          file="Trace en direct dans app.js"
          size={20}
          hi={choice === null ? [1] : ok ? [2, 3, 4] : [6]}
          code={`function verifierReponse(choixUtilisateur) {\n  if (choixUtilisateur === "Number()") {\n    score = score + 10;\n    afficherFeedback("✓ Bravo ! +10 points", "vert");\n  } else {\n    afficherFeedback("✗ Pas tout à fait", "rouge");\n  }\n}\n// Dernier appel : verifierReponse(${choice ? `"${choice}"` : '...'})`}
        />
      </Box>
      <Box x={120} y={765} w={1680}>
        <Callout tone="violet" icon="play" title="Ce qui vient de se passer en 4 millisecondes" size={24}>
          <Strong>1.</Strong> Clic sur le bouton → <Strong>2.</Strong> Appel de <Ic>verifierReponse({choice ? `"${choice}"` : 'choix'})</Ic> → <Strong>3.</Strong> Test <Ic>if / else</Ic> → <Strong>4.</Strong> Mise à jour du score et du bandeau à l’écran.
        </Callout>
      </Box>
    </Frame>
  );
};

const M4_DecouperPrompt: Page = () => (
  <Frame mod={4} kind="cours" beats={1}>
    <Title>Exiger des fonctions bien découpées dans vos prompts</Title>
    <Lede>Si vous ne précisez rien, l’IA met parfois toute la logique dans un seul bloc confus. Imposez-lui vos fonctions !</Lede>
    <Grid top={255} cols={2} gap={28}>
      <Card title="Sans consigne : le bloc monolithique" icon="x" tone="coral" d={100} bsz={21}>
        <Code
          size={19}
          style={{ marginTop: 8 }}
          code={`bouton.onclick = () => {\n  // 60 lignes mélangées :\n  // lecture des champs + calculs\n  // + couleurs + confettis + reset...\n};`}
        />
        <div style={{ marginTop: 12 }}>Difficile à relire : si vous demandez une modification, l’IA risque de casser une autre partie du bloc.</div>
      </Card>
      <Card title="Avec consigne : 1 fonction par bouton" icon="check" tone="green" cls={b.on(1)} bsz={21}>
        <Code
          size={19}
          style={{ marginTop: 8 }}
          code={`function calculerScore() { ... }\nfunction mettreAJourEcran() { ... }\nfunction reinitialiserQuiz() { ... }`}
        />
        <div style={{ marginTop: 12 }}>Chaque bouton appelle sa fonction dédiée : <Strong c={C.green}>clair, lisible et facile à faire évoluer</Strong>.</div>
      </Card>
    </Grid>
    <Box x={120} y={735} w={1680}>
      <Bubble who="vous" tool="Phrase à ajouter dans vos prompts" size={22}>
        Organise le code JavaScript en petites fonctions bien nommées en français : une fonction <Ic>calculerResultat()</Ic>, une fonction <Ic>afficherResultat()</Ic> et une fonction <Ic>reinitialiser()</Ic>.
      </Bubble>
    </Box>
  </Frame>
);

// Numbered pin placed in a margin (never over text), revealed on beat `beat`.
const Pin = ({ n, x, y, beat, tone = 'coral' }: { n: number; x: number; y: number; beat: number; tone?: Tone }) => (
  <div
    className={b.pop(beat)}
    style={{
      position: 'absolute',
      left: x - 16,
      top: y - 16,
      width: 32,
      height: 32,
      zIndex: 6,
      borderRadius: 999,
      border: '2px solid #fff',
      background: STRONG[tone],
      color: '#fff',
      fontFamily: display,
      fontWeight: 800,
      fontSize: 17,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 20px -6px rgba(11,31,92,.6)',
    }}
  >
    {n}
  </div>
);

// Explanation matching a Pin, revealed on the same beat.
const PinNote = ({ n, beat, title, tone = 'coral', children, size = 21 }: { n: number; beat: number; title: ReactNode; tone?: Tone; children: ReactNode; size?: number }) => (
  <div
    className={b.on(beat)}
    style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '14px 18px', borderLeft: `6px solid ${STRONG[tone]}` }}
  >
    <Num n={n} tone={tone} size={40} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: size + 1, color: T[tone].fg, lineHeight: 1.25 }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: size, lineHeight: 1.38, color: C.ink }}>{children}</div>
    </div>
  </div>
);

const M4_HotspotCode: Page = () => (
  <Frame mod={4} kind="demo" beats={4}>
    <Title>Repérez les 4 repères clés dans le code généré</Title>
    <Lede>Avancez au clavier : chaque repère s’allume un par un, avec son explication à droite.</Lede>
    <Box x={120} y={260} w={960}>
      <Code
        file="convertisseur.js · Généré par Claude / ChatGPT"
        size={22}
        hi={[1, 2, 6, 11]}
        code={`function convertirDevise(montantEuros, tauxChange) {\n  if (montantEuros <= 0) {\n    return "Veuillez saisir un montant positif";\n  }\n  let converti = montantEuros * tauxChange;\n  let arrondi = converti.toFixed(2);\n  return arrondi + " $";\n}\n\nboutonConvertir.onclick = () => {\n  ecranResultat.textContent = convertirDevise(100, 1.08);\n};`}
      />
      <Pin n={1} beat={1} x={925} y={72} />
      <Pin n={2} beat={2} x={925} y={105} />
      <Pin n={3} beat={3} x={925} y={235} />
      <Pin n={4} beat={4} x={925} y={397} />
    </Box>
    <Box x={1120} y={260} w={680} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <PinNote n={1} beat={1} title="Signature & paramètres">
        La fonction <Ic>convertirDevise</Ic> attend deux entrées : <Ic>montantEuros</Ic> et <Ic>tauxChange</Ic>.
      </PinNote>
      <PinNote n={2} beat={2} title="Garde-fou (cas limite)">
        Avant de calculer, ce <Ic>if</Ic> refuse un montant nul ou négatif.
      </PinNote>
      <PinNote n={3} beat={3} title="Calcul & formatage">
        Multiplie par le taux, puis arrondit à 2 décimales avec <Ic>toFixed(2)</Ic>.
      </PinNote>
      <PinNote n={4} beat={4} title="Branchement au bouton UI">
        Au clic sur <Ic>boutonConvertir</Ic>, le résultat s’affiche dans <Ic>ecranResultat</Ic>.
      </PinNote>
    </Box>
    <Box x={120} y={760} w={960}>
      <Callout tone="blue" icon="eye" title="Lecture en 15 secondes" size={22}>
        Repérer <Strong>le nom</Strong>, <Strong>le garde-fou</Strong>, <Strong>la formule</Strong> et <Strong>le bouton</Strong> suffit pour lire 95 % des mini-apps.
      </Callout>
    </Box>
  </Frame>
);

const M4_Lab4: Page = () => (
  <VibeLab
    mod={4}
    n="4.1"
    title="Convertisseur multi-actions modulaire (3 boutons, 3 fonctions)"
    defi="retro"
    objective={
      <>
        Générer une mini-app <strong>« Boîte à outils Express »</strong> comportant 3 boutons d’action reliés à 3 fonctions distinctes dans <strong>ChatGPT, Claude ou Gemini</strong>, puis personnaliser l’une des fonctions dans le code.
      </>
    }
    minutes={20}
    crit={
      <>
        <CheckItem id="m4l4a">Mon prompt demande explicitement 3 fonctions nommées en français</CheckItem>
        <CheckItem id="m4l4b">Les 3 boutons de l’interface fonctionnent et gèrent un champ vide sans planter</CheckItem>
        <CheckItem id="m4l4c">J’ai repéré les 3 blocs function dans l’onglet Code et modifié l’un d’eux</CheckItem>
      </>
    }
  >
    <WStep n={1}>
      Demandez à votre IA : <Pr>« Crée une mini-app boîte à outils pour un montant en euros avec 3 boutons : 1. Ajouter la TVA (+20 %), 2. Appliquer une remise (-15 %), 3. Convertir en dollars (×1.08). Écris 3 fonctions JavaScript distinctes bien nommées (calculerTVA, appliquerRemise, convertirDollars) et affiche un message doux si le champ est vide ou ≤ 0. »</Pr>
    </WStep>
    <WStep n={2}>
      Testez les 3 boutons dans l’aperçu (avec 100 €, puis avec 0 € ou un champ vide).
    </WStep>
    <WStep n={3}>
      Dans l’onglet <Strong>Code</Strong>, trouvez uniquement la fonction <Ic>appliquerRemise</Ic> et passez la remise de 15 % à 25 % sans toucher aux deux autres fonctions !
    </WStep>
  </VibeLab>
);

// ════════════════════════════════════════════════════════════════════════════
// MODULE 5 — Entrées / sorties UI & Prompt itératif (8 pages)
// ════════════════════════════════════════════════════════════════════════════
const M5_Divider: Page = () => (
  <Divider mod={5} kicker="Jour 1 · Après-midi" title="Entrées / sorties graphiques & Prompt itératif">
    <Bullet size={30}>Le vocabulaire des composants UI pour guider l’IA</Bullet>
    <Bullet size={30}>Le constructeur de prompt Vibe Coding en 5 briques</Bullet>
    <Bullet size={30}>Comparer ChatGPT, Claude et Gemini sur un même défi</Bullet>
  </Divider>
);
M5_Divider.transition = BLOOM;

const M5_ComposantsES: Page = () => (
  <Frame mod={5} kind="cours">
    <Title>Les vrais composants d’entrée et de sortie à nommer dans vos prompts</Title>
    <Lede>Plus vous nommez précisément les composants visuels souhaités, plus l’interface générée par l’IA est ergonomique.</Lede>
    <Grid top={255} cols={2} gap={28}>
      <Card title="Entrées (ce que l’utilisateur manipule)" icon="sliders" tone="blue" d={100} bsz={22}>
        <Col gap={12}>
          <div><Tag tone="blue" size={16}>Curseur (slider)</Tag> Idéal pour varier un nombre de 0 à 100 en direct</div>
          <div><Tag tone="blue" size={16}>Champ numérique / texte</Tag> Pour saisir un montant, un prénom ou une question</div>
          <div><Tag tone="blue" size={16}>Boutons de choix / Onglets</Tag> Pour sélectionner une catégorie ou répondre à un quiz</div>
          <div><Tag tone="blue" size={16}>Interrupteur (toggle)</Tag> Pour activer/désactiver une option booléenne</div>
        </Col>
      </Card>
      <Card title="Sorties (ce que l’application affiche)" icon="palette" tone="violet" d={220} bsz={22}>
        <Col gap={12}>
          <div><Tag tone="violet" size={16}>Carte KPI (chiffre clé)</Tag> Affiche le résultat principal en très grand</div>
          <div><Tag tone="violet" size={16}>Barre de progression / Jauge</Tag> Montre visuellement l’avancement en %</div>
          <div><Tag tone="violet" size={16}>Badge d’état coloré</Tag> Vert / Orange / Rouge selon vos conditions <Ic>if/else</Ic></div>
          <div><Tag tone="violet" size={16}>Encadré de feedback</Tag> Explique pourquoi la réponse est juste ou fausse</div>
        </Col>
      </Card>
    </Grid>
  </Frame>
);

const M5_CycleVibe: Page = () => (
  <Frame mod={5} kind="cours" beats={2}>
    <Title>La boucle du Vibe Coding : avancer par petites touches</Title>
    <Lede>Ne demandez jamais 15 fonctionnalités d’un coup : procédez en 4 étapes courtes.</Lede>
    <Box x={120} y={265} w={1680} style={{ display: 'flex', alignItems: 'stretch', gap: 12 }}>
      <Card title="1 · Décrire" icon="chat" tone="blue" d={100} style={{ flex: 1 }} bsz={21}>
        Un prompt structuré centré sur 1 objectif clair.
      </Card>
      <FlowArrow />
      <Card title="2 · Tester l’UI" icon="play" tone="violet" d={200} style={{ flex: 1 }} bsz={21}>
        Cliquer sur tous les boutons, essayer 0, un texte vide, un grand nombre.
      </Card>
      <FlowArrow />
      <Card title="3 · Inspecter" icon="search" tone="teal" d={300} style={{ flex: 1 }} bsz={21}>
        Ouvrir l’onglet Code : vérifier les variables, conditions et fonctions.
      </Card>
      <FlowArrow />
      <Card title="4 · Affiner" icon="wand" tone="green" d={400} style={{ flex: 1 }} bsz={21}>
        Demander une amélioration ciblée sans casser ce qui marche.
      </Card>
    </Box>
    <Box x={120} y={590} w={1680}>
      <Callout tone="yellow" icon="bulb" title="La règle du « point de sauvegarde »" cls={b.on(1)} size={24}>
        Quand votre version 1 fonctionne bien, <Strong>gardez-en une copie</Strong> (ou téléchargez le fichier <Ic>v1.html</Ic>) avant de demander une grosse modification !
      </Callout>
    </Box>
    <Box x={120} y={755} w={1680}>
      <Callout tone="green" icon="checkCircle" title="Une seule demande nouvelle par prompt d’itération" cls={b.on(2)} size={24}>
        « Ajoute un chronomètre de 15 secondes » → on teste → puis « Ajoute un récapitulatif final ». Pas les deux en même temps !
      </Callout>
    </Box>
  </Frame>
);

const M5_PARTS = [
  { label: '1 · Objectif & Public', tone: 'blue' as Tone, text: 'Crée une mini-application web interactive « Quiz Cybersécurité au quotidien » pour des collaborateurs.' },
  { label: '2 · Composants d’entrée UI', tone: 'violet' as Tone, text: 'Interface : 1 carte centrale avec la question, 4 boutons de réponse (A, B, C, D) et un bouton « Question suivante ».' },
  { label: '3 · Variables & Fonctions', tone: 'teal' as Tone, text: 'Logique JS : variables score et indexQuestion ; fonctions verifierReponse(choix), questionSuivante() et recommencer().' },
  { label: '4 · Conditions & Feedback', tone: 'green' as Tone, text: 'Règles : si la réponse est juste (+1 pt, encadré vert avec explication), sinon encadré rouge. À la fin : badge Or (≥4/5), Argent (3/5) ou Bronze.' },
  { label: '5 · Garde-fous & Propreté', tone: 'pink' as Tone, text: 'Contraintes : un seul fichier HTML/CSS/JS autonome, noms de variables en français, empêcher de cliquer deux fois sur la même question.' },
];

const M5_PromptBuilder: Page = () => {
  const [on, setOn] = useState<boolean[]>([true, false, false, false, false]);
  const flip = (i: number) => setOn((o) => o.map((x, j) => (j === i ? !x : x)));
  const count = on.filter(Boolean).length;
  return (
    <Frame mod={5} kind="demo">
      <Title>Constructeur interactif : 5 briques d’un prompt Vibe Coding</Title>
      <Lede>Activez les 5 ingrédients à gauche et voyez votre prompt passer du flou total à un cahier des charges chirurgical.</Lede>
      <Box x={120} y={255} w={500}>
        <Card title="Ingrédients du prompt" icon="layers" tone="navy" bsz={21}>
          <Col gap={14}>
            {M5_PARTS.map((p, i) => (
              <Toggle key={i} on={on[i]} onChange={() => flip(i)} tone={p.tone} size={20} label={<strong>{p.label}</strong>} />
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <Btn size={18} icon="sparkles" onClick={() => setOn([true, true, true, true, true])}>
                Tout activer
              </Btn>
              <Btn size={18} icon="reset" ghost tone="grey" onClick={() => setOn([false, false, false, false, false])}>
                Vider
              </Btn>
            </div>
          </Col>
        </Card>
      </Box>
      <Box x={650} y={255} w={1150}>
        <Code file="Votre prompt prêt à envoyer dans ChatGPT / Claude / Gemini" size={20} wrap style={{ minHeight: 380 }}>
          {count === 0 ? (
            <span style={{ color: '#FFD479' }}>Fais-moi un quiz sur la cybersécurité.</span>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {M5_PARTS.map((p, i) =>
                on[i] ? (
                  <div key={i} style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,.07)' }}>
                    <span style={{ color: '#7EE2B8', fontWeight: 700 }}>[{p.label}]</span> {p.text}
                  </div>
                ) : null,
              )}
            </div>
          )}
        </Code>
        <div style={{ marginTop: 16 }}>
          <Callout
            tone={count === 5 ? 'green' : count >= 3 ? 'yellow' : 'coral'}
            icon={count === 5 ? 'checkCircle' : 'alert'}
            title={`Niveau de précision : ${count} / 5`}
            size={22}
          >
            {count <= 1
              ? 'Prompt trop vague : l’IA va choisir au hasard le nombre de questions, le barème et l’interface.'
              : count < 5
                ? 'Bien mieux ! Ajoutez les briques manquantes pour verrouiller les fonctions et les cas limites.'
                : 'Prompt complet : l’UI, les variables, les fonctions, les seuils et les garde-fous sont tous spécifiés !'}
          </Callout>
        </div>
      </Box>
    </Frame>
  );
};

const M5_DefisCartes: Page = () => (
  <Frame mod={5} kind="demo">
    <Title>4 mini-défis d’itération UI &amp; logique (Cartes à retourner)</Title>
    <Lede>Comment formuleriez-vous le prompt pour ajouter chacune de ces 4 fonctionnalités ? Dites-le à l’oral, puis retournez !</Lede>
    <Grid top={255} cols={2} gap={26}>
      <FlipCard
        h={335}
        tone="blue"
        backTone="blue"
        front={
          <>
            <Eyebrow c={C.blue} size={18}>Mini-défi 1 · Validation de saisie</Eyebrow>
            <div style={{ marginTop: 12, fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>
              Empêcher un calcul si le champ est vide ou négatif
            </div>
            <div style={{ marginTop: 10, fontSize: 22, color: C.soft }}>Quelle condition et quel affichage demander à l’IA ?</div>
          </>
        }
        back={
          <>
            <Eyebrow c={T.blue.fg} size={18}>Prompt + Code attendu · Défi 1</Eyebrow>
            <div style={{ marginTop: 8, fontSize: 20, color: C.ink }}>
              <Strong>Prompt :</Strong> « Si le champ est vide ou <Ic>&lt;= 0</Ic>, affiche une bannière orange explicative et ne lance pas le calcul. »
            </div>
            <Code size={18} style={{ marginTop: 10 }} code={`if (!saisie || Number(saisie) <= 0) {\n  afficherAlerte("Saisissez un nombre > 0");\n  return;\n}`} />
          </>
        }
      />
      <FlipCard
        h={335}
        tone="violet"
        backTone="violet"
        front={
          <>
            <Eyebrow c={C.violet} size={18}>Mini-défi 2 · Hasard (Math.random)</Eyebrow>
            <div style={{ marginTop: 12, fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>
              Ajouter un bouton « Exemple au hasard »
            </div>
            <div style={{ marginTop: 10, fontSize: 22, color: C.soft }}>Comment remplir l’interface avec un cas tiré aléatoirement ?</div>
          </>
        }
        back={
          <>
            <Eyebrow c={T.violet.fg} size={18}>Prompt + Code attendu · Défi 2</Eyebrow>
            <div style={{ marginTop: 8, fontSize: 20, color: C.ink }}>
              <Strong>Prompt :</Strong> « Ajoute un bouton Surprise qui tire au hasard un exemple parmi 5 avec <Ic>Math.random()</Ic> et lance le calcul. »
            </div>
            <Code size={18} style={{ marginTop: 10 }} code={`let i = Math.floor(Math.random() * exemples.length);\nremplirChamps(exemples[i]);`} />
          </>
        }
      />
      <FlipCard
        h={335}
        tone="teal"
        backTone="teal"
        front={
          <>
            <Eyebrow c={C.teal} size={18}>Mini-défi 3 · Booléen UI</Eyebrow>
            <div style={{ marginTop: 12, fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>
              Ajouter un bouton « Mode Sombre / Clair »
            </div>
            <div style={{ marginTop: 10, fontSize: 22, color: C.soft }}>Quelle variable booléenne pilote le thème de la page ?</div>
          </>
        }
        back={
          <>
            <Eyebrow c={T.teal.fg} size={18}>Prompt + Code attendu · Défi 3</Eyebrow>
            <div style={{ marginTop: 8, fontSize: 20, color: C.ink }}>
              <Strong>Prompt :</Strong> « Ajoute un interrupteur Mode Sombre piloté par un booléen <Ic>modeSombre</Ic> qui inverse les couleurs de fond et de texte. »
            </div>
            <Code size={18} style={{ marginTop: 10 }} code={`modeSombre = !modeSombre;\ndocument.body.classList.toggle("dark", modeSombre);`} />
          </>
        }
      />
      <FlipCard
        h={335}
        tone="green"
        backTone="green"
        front={
          <>
            <Eyebrow c={C.green} size={18}>Mini-défi 4 · Compteur &amp; boucle</Eyebrow>
            <div style={{ marginTop: 12, fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>
              Garder l’historique des 5 derniers calculs à l’écran
            </div>
            <div style={{ marginTop: 10, fontSize: 22, color: C.soft }}>Comment afficher la liste des derniers essais sous le résultat ?</div>
          </>
        }
        back={
          <>
            <Eyebrow c={T.green.fg} size={18}>Prompt + Code attendu · Défi 4</Eyebrow>
            <div style={{ marginTop: 8, fontSize: 20, color: C.ink }}>
              <Strong>Prompt :</Strong> « Stocke chaque calcul dans une liste <Ic>historique</Ic> et affiche les 5 derniers sous forme de badges avec une boucle. »
            </div>
            <Code size={18} style={{ marginTop: 10 }} code={`historique.push(resultat);\nfor (let item of historique.slice(-5)) { ... }`} />
          </>
        }
      />
    </Grid>
  </Frame>
);

const M5_Lab5: Page = () => (
  <VibeLab
    mod={5}
    n="5.1"
    title="Relever 3 mini-défis d’affilée par prompts itératifs"
    defi="construire"
    objective={
      <>
        Partir de votre application de l’atelier précédent et lui ajouter, <strong>un prompt à la fois</strong>, trois améliorations : validation de saisie, bouton « Exemple aléatoire » et historique des derniers résultats.
      </>
    }
    minutes={20}
    crit={
      <>
        <CheckItem id="m5l5a">Défi 1 validé : un champ vide ou négatif affiche un message clair sans planter</CheckItem>
        <CheckItem id="m5l5b">Défi 2 validé : le bouton « Exemple au hasard » tire des valeurs variées</CheckItem>
        <CheckItem id="m5l5c">Défi 3 validé : l’historique des calculs s’affiche en bas de la carte</CheckItem>
      </>
    }
  >
    <WStep n={1}>
      <Strong>Itération 1 (Validation) :</Strong> demandez d’ajouter une vérification au début de la fonction pour bloquer les valeurs vides ou négatives, puis testez-la !
    </WStep>
    <WStep n={2}>
      <Strong>Itération 2 (Hasard) :</Strong> une fois l’itération 1 validée, demandez d’ajouter un bouton « Surprise » qui remplit les champs au hasard avec <Ic>Math.random()</Ic>.
    </WStep>
    <WStep n={3}>
      <Strong>Itération 3 (Historique) :</Strong> demandez d’afficher sous la carte la liste des 5 derniers calculs effectués.
    </WStep>
  </VibeLab>
);

const M5_CompareOutils: Page = () => {
  const [scores, setScores] = useState<Record<string, number>>({
    'c-ui': 4, 'l-ui': 5, 'g-ui': 4,
    'c-code': 4, 'l-code': 5, 'g-code': 4,
    'c-iter': 4, 'l-iter': 5, 'g-iter': 4,
    'c-expl': 5, 'l-expl': 4, 'g-expl': 4,
  });
  const bump = (id: string) => setScores((s) => ({ ...s, [id]: ((s[id] ?? 3) % 5) + 1 }));
  const rows = [
    { key: 'ui', label: 'Qualité visuelle de l’interface du 1er coup' },
    { key: 'code', label: 'Lisibilité du code (noms en français, fonctions)' },
    { key: 'iter', label: 'Respect de « modifie uniquement cette partie »' },
    { key: 'expl', label: 'Clarté des explications pour un débutant' },
  ];
  const sum = (p: string) => rows.reduce((a, r) => a + (scores[`${p}-${r.key}`] ?? 0), 0);
  return (
    <Frame mod={5} kind="demo">
      <Title>Comparatif en direct : ChatGPT vs Claude Artifacts vs Gemini</Title>
      <Lede>Même prompt, trois assistants. Dites-moi vos notes de 1 à 5 selon ce que vous observez sur votre poste !</Lede>
      <Box x={120} y={260} w={1120}>
        <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 26px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 160px 160px', gap: 16, paddingBottom: 12, borderBottom: `2px solid ${C.rule}`, fontFamily: display, fontWeight: 800, fontSize: 19 }}>
            <span style={{ color: C.muted }}>CRITÈRE (cliquez pour noter de 1 à 5)</span>
            <span style={{ color: C.green, textAlign: 'center' }}>ChatGPT</span>
            <span style={{ color: C.violet, textAlign: 'center' }}>Claude</span>
            <span style={{ color: C.blue, textAlign: 'center' }}>Gemini</span>
          </div>
          {rows.map((r) => (
            <div key={r.key} style={{ display: 'grid', gridTemplateColumns: '1fr 160px 160px 160px', gap: 16, alignItems: 'center', padding: '14px 0', borderBottom: `1px solid ${C.rule}`, fontSize: 22 }}>
              <span style={{ fontWeight: 600, color: C.ink }}>{r.label}</span>
              {(['c', 'l', 'g'] as const).map((p, idx) => {
                const id = `${p}-${r.key}`;
                const val = scores[id] ?? 3;
                const tone: Tone = idx === 0 ? 'green' : idx === 1 ? 'violet' : 'blue';
                return (
                  <div key={p} style={{ textAlign: 'center' }}>
                    <Btn tone={tone} ghost size={20} onClick={() => bump(id)}>
                      {val} / 5
                    </Btn>
                  </div>
                );
              })}
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 160px 160px', gap: 16, alignItems: 'center', paddingTop: 14, fontFamily: display, fontWeight: 800, fontSize: 26 }}>
            <span style={{ color: C.navy }}>Total sur 20</span>
            <span style={{ color: C.green, textAlign: 'center' }}>{sum('c')} / 20</span>
            <span style={{ color: C.violet, textAlign: 'center' }}>{sum('l')} / 20</span>
            <span style={{ color: C.blue, textAlign: 'center' }}>{sum('g')} / 20</span>
          </div>
        </div>
      </Box>
      <Box x={1280} y={260} w={520}>
        <Card title="Bilan du comparatif" icon="compass" tone="navy" bsz={22}>
          <Col gap={12}>
            <div>Les 3 outils génèrent du HTML/CSS/JS standard qui fonctionne dans n’importe quel navigateur.</div>
            <div><Strong c={C.violet}>Votre compétence n’est pas liée à une marque d’IA</Strong> : un bon prompt algorithmique donne un bon résultat partout !</div>
          </Col>
        </Card>
      </Box>
    </Frame>
  );
};

const M5_Pause: Page = () => <Pause mod={5} title="Pause après-midi" back="Reprise dans 15 minutes" minutes={15} />;

// ════════════════════════════════════════════════════════════════════════════
// MODULE 6 — TP Jour 1 : Créer un Quiz ou Calculateur interactif avec UI (8 pages)
// ════════════════════════════════════════════════════════════════════════════
const M6_Divider: Page = () => (
  <Divider mod={6} kicker="Jour 1 · TP Fil Rouge" title="TP Jour 1 : Créer votre première mini-app interactive">
    <Bullet size={30}>Au choix : VibeQuiz (quiz interactif) ou VibeCalc (simulateur métier)</Bullet>
    <Bullet size={30}>Mobiliser variables, conditions, boucles et fonctions avec une vraie UI</Bullet>
    <Bullet size={30}>Relever un twist client à la minute 20, soigner le design et présenter son application au groupe</Bullet>
  </Divider>
);
M6_Divider.transition = BLOOM;

const M6_CahierCharges: Page = () => (
  <Frame mod={6} kind="tp">
    <Title>TP du Jour 1 : choisissez votre mini-application interactive</Title>
    <Lede>Même socle pédagogique (variables, conditions, boucles, fonctions, UI soignée) — deux sujets au choix selon vos envies !</Lede>
    <Grid top={255} cols={2} gap={28}>
      <Card title="Option A · VibeQuiz (Quiz interactif thématique)" icon="puzzle" tone="blue" d={100} bsz={21}>
        <Col gap={10}>
          <div><Strong>Thème libre :</Strong> culture générale, métier, écologie, cinéma, sport…</div>
          <div><Strong>Variables :</Strong> <Ic>score</Ic>, <Ic>indexQuestion</Ic>, <Ic>serieBonnesReponses</Ic></div>
          <div><Strong>Boucle &amp; Liste :</Strong> 5 questions avec 4 choix et une explication</div>
          <div><Strong>Conditions :</Strong> feedback Vert/Rouge à chaque clic + badge final Or / Argent / Bronze</div>
          <div><Strong>Fonctions :</Strong> <Ic>afficherQuestion()</Ic>, <Ic>verifierReponse()</Ic>, <Ic>rejouer()</Ic></div>
        </Col>
      </Card>
      <Card title="Option B · VibeCalc (Simulateur / Calculatrice métier)" icon="gauge" tone="violet" d={220} bsz={21}>
        <Col gap={10}>
          <div><Strong>Thème libre :</Strong> impact carbone, prêt / emprunt, devis freelance, ROI…</div>
          <div><Strong>Variables :</Strong> 3 curseurs/champs numériques + 1 option booléenne</div>
          <div><Strong>Boucle &amp; Liste :</Strong> 4 boutons de pré-réglages (« Profils types »)</div>
          <div><Strong>Conditions :</Strong> diagnostic Vert / Orange / Rouge + règles imbriquées (si <Ic>X &gt; 10</Ic> et <Ic>Y &lt; 5</Ic> : coefficient dynamique)</div>
          <div><Strong>Fonctions :</Strong> <Ic>calculerTotal()</Ic>, <Ic>appliquerProfil()</Ic>, <Ic>reinitialiser()</Ic></div>
        </Col>
      </Card>
    </Grid>
    <Box x={120} y={760} w={1680}>
      <Callout tone="green" icon="sparkles" title="Livrable attendu au bout de 45 minutes" d={400} size={24}>
        Une application fonctionnelle dans votre navigateur (Canvas / Artifact ou fichier <PathChip>index.html</PathChip>) dont vous savez expliquer une variable, une condition et une fonction. <Strong c={C.green}>Attention :</Strong> le client change ses exigences à la minute 20, puis le TP finit sur un cahier des charges « Vibe Design ».
      </Callout>
    </Box>
  </Frame>
);

const M6_Strategie3Prompts: Page = () => (
  <Frame mod={6} kind="tp" beats={3}>
    <Title>Votre plan de bataille en 4 temps pour réussir le TP</Title>
    <Lede>45 minutes, un twist à la minute 20 : gardez le contrôle sur ce que génère l’IA.</Lede>
    <Grid top={260} cols={4} gap={22}>
      <Card title="1 · Générer le cœur (0–12 min)" icon="wand" tone="blue" d={100} tsz={23} bsz={20}>
        Les <Strong>5 briques du constructeur de prompt</Strong> pour une première version jouable : 5 questions ou 3 curseurs + profils.
      </Card>
      <Card title="2 · Inspecter & retoucher (12–20 min)" icon="code" tone="teal" cls={b.on(1)} tsz={23} bsz={20}>
        Onglet <Strong>Code</Strong> : modifiez <Strong c={C.teal}>2 questions ou seuils</Strong>, un texte de feedback, et vérifiez les conditions <Ic>&gt;=</Ic>.
      </Card>
      <Card title="3 · Le twist client (20–35 min)" icon="rocket" tone="pink" cls={b.on(2)} tsz={23} bsz={20}>
        <Strong c={C.pink}>Nouvelle exigence</Strong> révélée à la minute 20 : refactorisez le code par prompt (données JSON, <Ic>localStorage</Ic>, export…).
      </Card>
      <Card title="4 · Vibe Design (35–45 min)" icon="sparkles" tone="violet" cls={b.on(3)} tsz={23} bsz={20}>
        Mode <Strong c={C.violet}>sombre / clair</Strong>, micro-animation de feedback et affichage <Strong c={C.violet}>mobile-first</Strong> testé dans les devtools.
      </Card>
    </Grid>
    <Box x={120} y={670} w={1680}>
      <Bubble who="vous" tool="Amorce de prompt (étape 1) collée dans le clavardage" size={21}>
        Crée une mini-application web interactive en un seul fichier HTML/CSS/JS : [VibeQuiz sur le thème … / VibeCalc pour calculer …]. Utilise des variables et fonctions nommées en français, une barre de progression, un feedback coloré selon 3 seuils (Vert / Orange / Rouge) et un bouton pour recommencer.
      </Bubble>
    </Box>
  </Frame>
);

const M6_LabTP1: Page = () => (
  <VibeLab
    mod={6}
    n="TP 1"
    kind="tp"
    title="Phase 1 · Construire votre mini-app (0–20 min)"
    defi="construire"
    objective={
      <>
        En 20 minutes, obtenir avec <strong>ChatGPT, Claude ou Gemini</strong> une première version complète de votre VibeQuiz ou VibeCalc, puis la personnaliser à la main dans le code.
      </>
    }
    minutes={20}
    crit={
      <>
        <CheckItem id="tp1a">L’interface est claire, moderne et répond immédiatement aux clics</CheckItem>
        <CheckItem id="tp1b">Les variables, une boucle et une condition if/else à 3 paliers sont présentes</CheckItem>
        <CheckItem id="tp1c">J’ai modifié moi-même des valeurs ou questions directement dans le code</CheckItem>
        <CheckItem id="tp1d">Le bouton « Rejouer / Réinitialiser » remet bien tous les compteurs à zéro</CheckItem>
      </>
    }
    suivi="Points d’étape au micro à 12 min (version 1 qui tourne) et à 20 min (twist). Bloqué ? Partage d’écran 2 minutes !"
  >
    <WStep n={1}>
      <Strong>Minutes 0–12 · Prompt 1 :</Strong> générez votre VibeQuiz (5 questions) ou VibeCalc (3 entrées + profils) et testez le parcours de bout en bout.
    </WStep>
    <WStep n={2}>
      <Strong>Minutes 12–20 · Inspection du code :</Strong> repérez vos variables, votre boucle et vos fonctions, et personnalisez textes et seuils à la main.
    </WStep>
    <WStep n={3}>
      <Strong>Minute 20 · Twist :</Strong> le client change ses exigences, la page suivante les dévoile. Gardez votre version 1 de côté.
    </WStep>
  </VibeLab>
);

const M6_LabTwist: Page = () => (
  <Frame mod={6} kind="tp" beats={1}>
    <Title size={47}>
      <span style={{ color: C.green }}>Atelier TP 1</span> · Phase 2 : le twist du client !
    </Title>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 172, right: 120, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <Tag tone="pink" size={18} icon="rocket">Minutes 20–45</Tag>
      <Tag tone="violet" size={18} icon="sparkles">Refactoriser par prompt, puis soigner le design</Tag>
      <Tag tone="grey" size={18} icon="user">Individuel · sur votre poste</Tag>
    </div>
    <Box x={120} y={234} w={1020}>
      <Card title="Minute 20 · Nouvelle exigence du client" icon="rocket" tone="pink" d={100} tsz={25} bsz={21} pad={22}>
        <Col gap={10}>
          <div>
            <Tag tone="blue" size={17}>VibeQuiz</Tag> Les questions ne sont plus « en dur » : chargez-les depuis un <Ic>questions.json</Ic> (ou un bloc de données séparé), sauvegardez les scores dans le <Ic>localStorage</Ic> et affichez un <Strong>classement local</Strong> (Top 5).
          </div>
          <div>
            <Tag tone="violet" size={17}>VibeCalc</Tag> Le client veut un <Strong c={C.violet}>export instantané</Strong> du résultat : rapport imprimable / PDF ou graphique interactif (mini-librairie de charts, ou SVG natif) généré par prompt.
          </div>
        </Col>
      </Card>
    </Box>
    <Box x={120} y={560} w={1020} cls={b.on(1)}>
      <div style={{ marginBottom: 12 }}>
        <Tag tone="violet" size={20} icon="sparkles">Minute 35 · Cahier des charges Vibe Design</Tag>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 18 }}>
        <Card title="Mode sombre / clair" icon="eye" tone="blue" cls="" tsz={21} bsz={19} pad={18}>
          Bascule native, avec une transition fluide en <Strong>CSS pur</Strong> (variables).
        </Card>
        <Card title="Micro-animation" icon="sparkles" tone="pink" cls="" tsz={21} bsz={19} pad={18}>
          Bonne réponse : <Strong c={C.pink}>confettis</Strong> en JS natif ou jauge SVG animée.
        </Card>
        <Card title="Mobile-first" icon="laptop" tone="teal" cls="" tsz={21} bsz={19} pad={18}>
          100 % responsive, testé en mode appareil mobile des <Strong c={C.teal}>devtools</Strong>.
        </Card>
      </div>
    </Box>
    <div style={{ position: 'absolute', left: 1180, top: 234, width: 620, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Timer id="tp1-twist" minutes={25} label="Phase 2 · Twist" compact cls={A.right} style={dl(150)} />
      <div className={A.right} style={{ ...dl(260), background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <Icon name="checkCircle" size={24} color={T.green.fg} />
          <Eyebrow c={T.green.fg} size={18}>Critères de réussite (à vérifier)</Eyebrow>
        </div>
        <Checklist style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <CheckItem id="tp1e">Le twist est intégré sans casser le jeu de base : scores et calculs restent justes</CheckItem>
          <CheckItem id="tp1f">Après rechargement, vos données (scores) ou votre export fonctionnent encore</CheckItem>
          <CheckItem id="tp1g">Mode sombre / clair, micro-animation et rendu mobile sont validés</CheckItem>
          <CheckItem id="tp1h">J’ai relu et corrigé moi-même une condition ou un calcul généré par l’IA</CheckItem>
        </Checklist>
      </div>
      <Note tone="yellow" icon="chat" label="Suivi en classe virtuelle" size={20} d={380}>
        Points d’étape au micro à 10:00 restantes (twist intégré) et à 00:00 (fin du TP). Bloqué ? Partage d’écran 2 minutes !
      </Note>
    </div>
  </Frame>
);

const M6_Restitution: Page = () => (
  <Frame mod={6} kind="tp" beats={1}>
    <Title>Showtime : démonstration de vos mini-apps du Jour 1 !</Title>
    <Lede>Partage d’écran individuel de 2 à 3 minutes : on teste vos créations en direct.</Lede>
    <Box x={120} y={260} w={820}>
      <Card title="Format de votre démo (2 à 3 min)" icon="laptop" tone="blue" d={100} bsz={23}>
        <Col gap={12}>
          <div><Strong>1.</Strong> Vous partagez votre écran et faites jouer le groupe à voix haute sur 1 ou 2 questions / scénarios.</div>
          <div><Strong>2.</Strong> Vous ouvrez l’onglet <Strong>Code</Strong> 30 secondes pour nous montrer <Strong>1 variable</Strong> et <Strong>1 condition ou fonction</Strong> que vous avez personnalisée.</div>
        </Col>
        <div style={{ marginTop: 18 }}>
          <Timer id="restit-j1" minutes={3} />
        </div>
      </Card>
    </Box>
    <Box x={980} y={260} w={820}>
      <Card title="Ce qu’on célèbre ensemble" icon="star" tone="green" d={220} bsz={23}>
        <Col gap={12}>
          <div><Strong c={C.green}>L’interface fonctionne</Strong> de bout en bout sans blocage.</div>
          <div><Strong c={C.green}>Les règles métier</Strong> (scores, seuils, remises) sont exactes.</div>
          <div><Strong c={C.green}>Le code est compris</Strong> : vous savez où habitent vos données et vos actions.</div>
          <div><Strong c={C.green}>La touche personnelle</Strong> ajoutée par itération.</div>
        </Col>
      </Card>
    </Box>
    <Box x={120} y={785} w={1680}>
      <Callout tone="pink" icon="chat" title="Rétroaction bienveillante au micro" cls={b.on(1)} size={24}>
        Un point fort + une idée d’évolution par présentation, puis : « Participant suivant ! »
      </Callout>
    </Box>
  </Frame>
);

const M6_BilanJ1: Page = () => (
  <Takeaways mod={6} title="Bilan du Jour 1 : vous pratiquez déjà le vrai Vibe Coding" lede="En une seule journée, vous avez découvert toutes les briques de base de la programmation par la pratique avec l’IA.">
    <Bullet d={100}><Strong>Programmer en Vibe Coding</Strong> : écrire l’algorithme dans le prompt, laisser l’IA générer la syntaxe, puis inspecter et tester</Bullet>
    <Bullet d={200}><Strong>Variables, types &amp; opérateurs</Strong> : <Ic>let</Ic>, <Ic>const</Ic>, nombres, textes, booléens et conversion <Ic>Number()</Ic></Bullet>
    <Bullet d={300}><Strong>Conditions &amp; boucles</Strong> : tables de décision <Ic>if / else</Ic> et génération automatique de cartes avec <Ic>for...of</Ic></Bullet>
    <Bullet d={400}><Strong>Fonctions &amp; événements</Strong> : organiser le code en actions nommées clairement et reliées aux boutons</Bullet>
    <Bullet d={500}><Strong>Première mini-app UI</Strong> : conçue, personnalisée dans le code et démontrée en direct !</Bullet>
  </Takeaways>
);

const M6_SortieJ1: Page = () => (
  <Frame mod={6} kind="bilan">
    <Title>Billet de sortie du Jour 1</Title>
    <Lede>Tour rapide au micro (1 minute par personne, appelé par prénom).</Lede>
    <Grid top={265} cols={3} gap={26}>
      <Card title="1 · Mon déclic du jour" icon="bulb" tone="green" d={100} bsz={24}>
        La notion de code ou d’IA qui vous semblait obscure ce matin et qui est devenue claire.
      </Card>
      <Card title="2 · Mon moment préféré" icon="sparkles" tone="violet" d={220} bsz={24}>
        La fonctionnalité de votre mini-app dont vous êtes le plus fier aujourd’hui.
      </Card>
      <Card title="3 · Ma question pour demain" icon="chat" tone="yellow" d={340} bsz={24}>
        Un point sur lequel vous aimeriez revenir demain matin en ouverture.
      </Card>
    </Grid>
    <Box x={120} y={710} w={1680}>
      <Callout tone="blue" icon="calendar" title="Programme de demain · Jour 2" d={500} size={25}>
        Demain, un seul projet toute la journée : <Strong>TaskFlow, un outil de gestion de projet avec backlog, Kanban en glisser-déposer, règles testées, import CSV et sauvegarde.</Strong>
      </Callout>
    </Box>
  </Frame>
);

const PAGES_M4: Page[] = [M4_Divider, M4_TriniteWeb, M4_RoleFonction, M4_SimClic, M4_DecouperPrompt, M4_HotspotCode, M4_Lab4];
const PAGES_M5: Page[] = [M5_Divider, M5_ComposantsES, M5_CycleVibe, M5_PromptBuilder, M5_DefisCartes, M5_Lab5, M5_CompareOutils, M5_Pause];
const PAGES_M6: Page[] = [M6_Divider, M6_CahierCharges, M6_Strategie3Prompts, M6_LabTP1, M6_LabTwist, M6_Restitution, M6_BilanJ1, M6_SortieJ1];

const NOTES_M4: string[] = [
  // M4_Divider
  `⏱ 1 min · MODULE 4 · 14:00

DIRE — « Bon retour à toutes et à tous ! Cet après-midi, nous attaquons le Module 4 : les fonctions et la structure d’une application web. C’est ce qui relie vos boutons à l’écran aux calculs que nous avons vus ce matin. »

TRANSITION — « Regardons d’abord les trois briques qui composent toute page web générée par l’IA. »`,
  // M4_TriniteWeb
  `⏱ 5 min · HTML, CSS ET JAVASCRIPT

OBJECTIF — Identifier le rôle de HTML, CSS et JS dans un fichier généré par l’IA.

DIRE — « Quand ChatGPT, Claude ou Gemini génère votre mini-app, il assemble trois langages dans le même fichier. Le HTML, c’est le squelette : les champs, les boutons, les textes. Le CSS, c’est la peinture et la décoration : couleurs, arrondis, ombres. Et le JavaScript, ce sont les fonctions : le cerveau qui réagit quand on clique ! »

ANIMATION — → beat 1 : carte CSS. → beat 2 : carte JS.

TRANSITION — « Zoomons sur cette troisième brique : qu’est-ce qu’une fonction ? »`,
  // M4_RoleFonction
  `⏱ 6 min · ANATOMIE D’UNE FONCTION

OBJECTIF — Comprendre le nom, les paramètres d’entrée et le return d’une fonction.

DIRE — « Une fonction, c’est une recette rangée sous un nom d’action : ici calculerMensualite. Entre parenthèses, ses paramètres : les ingrédients qu’on lui donne, montant et nbMois. Et à la fin, le mot-clé return qui renvoie le résultat calculé. Une fois la recette écrite, on peut l’appeler dix fois avec des valeurs différentes sans jamais réécrire la formule ! »

ANIMATION — → beat 1 : paramètres. → beat 2 : return. → beat 3 : règle d’or 1 fonction = 1 responsabilité.

TRANSITION — « Voyons en direct ce qui se passe quand vous cliquez sur un bouton de quiz. »`,
  // M4_SimClic
  `⏱ 6 min · SIMULATEUR : DU CLIC À LA FONCTION

OBJECTIF — Visualiser la chaîne Événement clic → Appel de fonction → Condition → Mise à jour de l’UI.

DIRE — « Regardez cette mini-app à gauche : cliquez avec moi sur la réponse A, puis sur la réponse B. À droite, vous voyez la fonction verifierReponse(choixUtilisateur) s’illuminer sur la branche correspondante : quand je clique sur B · Number(), la condition if est vraie, le score augmente de 10 et le bandeau vert s’affiche ! »

ANIMATION — Cliquer sur une mauvaise réponse puis sur la bonne réponse « B · Number() » pour montrer la mise à jour simultanée de l’UI et du code.

TRANSITION — « Pourquoi est-il si important de demander à l’IA de bien découper ses fonctions ? »`,
  // M4_DecouperPrompt
  `⏱ 5 min · EXIGER DES FONCTIONS DÉCOUPÉES

OBJECTIF — Apprendre à demander des fonctions séparées et nommées dans ses prompts.

DIRE — « Si vous ne dites rien à l’IA, elle met parfois 60 lignes en vrac derrière le clic du bouton. Si vous lui demandez ensuite de changer le calcul, elle risque de casser l’affichage. Prenez l’habitude d’ajouter cette phrase dans vos prompts : “Organise le code en petites fonctions bien nommées en français : calculerResultat(), afficherResultat(), reinitialiser()”. »

ANIMATION — → beat 1 : colonne de droite avec les 3 fonctions propres.

TRANSITION — « Entraînons-nous à repérer les 4 zones d’une fonction avec un jeu de Hotspots. »`,
  // M4_HotspotCode
  `⏱ 6 min · HOTSPOTS : LIRE UNE FONCTION EN 15 SECONDES

OBJECTIF — Savoir localiser la signature, le garde-fou, le calcul et le branchement au bouton.

DIRE — « Voici un vrai code généré par Claude. Quatre repères suffisent pour tout comprendre : 1. le nom et les paramètres en haut, 2. le garde-fou if qui bloque les montants négatifs, 3. la formule avec l’arrondi toFixed(2), et 4. en bas, le branchement onclick sur le bouton. »

ANIMATION — Cliquer sur les pastilles 1, 2, 3 et 4 (ou avancer avec → beats 1 à 4).

TRANSITION — « À vous de jouer dans l’Atelier 4.1 ! »`,
  // M4_Lab4
  `⏱ 20 min · ATELIER VIBE 4.1 · CONVERTISSEUR MULTI-ACTIONS (3 FONCTIONS)

OBJECTIF — Générer une interface à 3 boutons reliés à 3 fonctions distinctes et en modifier une dans le code.

DIRE — « Vingt minutes sur votre poste. Je vous colle la consigne dans le clavardage : faites générer une boîte à outils avec 3 boutons (TVA, Remise, Dollars) et 3 fonctions distinctes nommées en français. Testez l’interface, puis ouvrez l’onglet Code et changez uniquement le taux dans la fonction appliquerRemise ! »

ANIMATION — Lancer le minuteur de 20 minutes. Point d’étape à 10 minutes.

TRANSITION — « Passons au Module 5 : maîtriser le vocabulaire UI et le prompt itératif ! »`,
];

const NOTES_M5: string[] = [
  // M5_Divider
  `⏱ 1 min · MODULE 5

DIRE — « Module 5 : entrées / sorties graphiques et prompt itératif. Comment décrire exactement les composants visuels que vous voulez et faire évoluer votre application étape par étape. »

TRANSITION — « Voici le catalogue des composants à nommer dans vos prompts. »`,
  // M5_ComposantsES
  `⏱ 5 min · LE VOCABULAIRE DES COMPOSANTS UI

OBJECTIF — Connaître les noms exacts des composants d’entrée et de sortie pour mieux guider l’IA.

DIRE — « En Vibe Coding, les mots ont un pouvoir direct sur le design. Pour les entrées, demandez un curseur (slider), un champ numérique, des boutons d’onglets ou un interrupteur (toggle). Pour les sorties, demandez une carte KPI avec le chiffre en grand, une barre de progression, un badge d’état coloré ou un encadré de feedback. »

ANIMATION — Parcourir les deux colonnes Entrées / Sorties.

TRANSITION — « Comment enchaîner plusieurs prompts sans jamais perdre le fil ? »`,
  // M5_CycleVibe
  `⏱ 5 min · LA BOUCLE DU VIBE CODING

OBJECTIF — Ancrer le cycle Décrire → Tester l’UI → Inspecter le code → Affiner par petites touches.

DIRE — « Le secret des développeurs qui utilisent l’IA efficacement tient en quatre étapes : 1. Décrire une intention claire, 2. Tester l’interface en essayant même de la piéger avec 0 ou un champ vide, 3. Inspecter le code, 4. Affiner en ne demandant qu’une seule nouveauté par prompt. Et pensez toujours à garder une copie quand une version marche bien ! »

ANIMATION — → beat 1 : règle du point de sauvegarde. → beat 2 : une seule nouveauté par prompt.

TRANSITION — « Voyons comment assembler un prompt parfait grâce à notre constructeur interactif. »`,
  // M5_PromptBuilder
  `⏱ 7 min · CONSTRUCTEUR INTERACTIF DE PROMPT EN 5 BRIQUES

OBJECTIF — Montrer l’impact des 5 ingrédients d’un prompt sur la prévisibilité du résultat.

DIRE — « Regardez ce qui se passe quand on écrit juste “Fais-moi un quiz sur la cybersécurité” : niveau 1 sur 5, l’IA improvise tout. Activons maintenant les 5 briques une par une : 1. Objectif et public, 2. Composants d’entrée UI, 3. Variables et fonctions nommées, 4. Conditions et barème, 5. Garde-fous techniques. En 5 lignes structurées, vous avez un cahier des charges complet ! »

ANIMATION — Activer les interrupteurs 2, 3, 4 et 5 un par un devant les participants.

TRANSITION — « Entraînons-nous sur 4 mini-défis d’itération avec des cartes à retourner. »`,
  // M5_DefisCartes
  `⏱ 7 min · 4 MINI-DÉFIS D’ITÉRATION (FLIPCARDS)

OBJECTIF — Formuler à l’oral des prompts d’itération pour la validation, le hasard, le mode sombre et l’historique.

DIRE — « Quatre fonctionnalités classiques qu’on adore ajouter à une mini-app : bloquer une saisie négative, tirer un exemple au hasard avec Math.random(), ajouter un interrupteur Mode Sombre, et afficher l’historique des 5 derniers essais. Pour chaque carte, proposez-moi un prompt à voix haute, puis je retourne la carte ! »

ANIMATION — Retourner les 4 cartes une par une après les propositions orales des participants.

TRANSITION — « À vous de relever 3 de ces défis sur votre propre application ! »`,
  // M5_Lab5
  `⏱ 20 min · ATELIER VIBE 5.1 · 3 ITÉRATIONS MAÎTRISÉES

OBJECTIF — Pratiquer l’itération pas-à-pas (1 fonctionnalité par prompt + vérification).

DIRE — « Vingt minutes sur votre poste. Reprenez votre application et ajoutez-lui trois améliorations en trois prompts séparés : 1. bloquer les champs vides ou négatifs avec un message doux, 2. un bouton Surprise qui remplit un exemple au hasard, 3. l’historique des 5 derniers calculs en bas de page. Testez bien entre chaque prompt ! »

ANIMATION — Lancer le minuteur de 20 minutes. Point d’étape à 10 minutes.

TRANSITION — « Comparons maintenant ce que donnent ChatGPT, Claude et Gemini sur un même prompt. »`,
  // M5_CompareOutils
  `⏱ 6 min · COMPARATIF INTERACTIF DES OUTILS

OBJECTIF — Comparer les forces de ChatGPT Canvas, Claude Artifacts et Gemini avec les retours du groupe.

DIRE — « Vous utilisez plusieurs outils dans le groupe : donnez-moi à voix haute vos notes de 1 à 5 sur ces quatre critères — beauté de l’UI du premier coup, lisibilité du code en français, respect de la consigne “ne modifie que cette partie”, et clarté des explications. »

ANIMATION — Cliquer sur les boutons de score selon les retours oraux des participants.

TRANSITION — « Quinze minutes de pause avant le grand TP de fin de première journée ! »`,
  // M5_Pause
  `⏱ 15 min · PAUSE APRÈS-MIDI

DIRE — « Quinze minutes de pause loin de l’écran. À la reprise, vous créez votre première mini-application complète de A à Z ! »

ANIMATION — Lancer le minuteur de 15 minutes.`,
];

const NOTES_M6: string[] = [
  // M6_Divider
  `⏱ 1 min · MODULE 6 · TP JOUR 1

DIRE — « C’est le moment du grand TP du Jour 1 : vous allez concevoir et réaliser votre première mini-application interactive complète en Vibe Coding. »

TRANSITION — « Voici les deux sujets au choix. »`,
  // M6_CahierCharges
  `⏱ 5 min · PRÉSENTATION DU TP JOUR 1 (VIBEQUIZ OU VIBECALC)

OBJECTIF — Présenter clairement les deux options du TP officiel du Jour 1.

DIRE — « Vous avez le choix entre deux projets qui mobilisent exactement les mêmes briques du programme officiel. Option A : VibeQuiz, un quiz interactif de 5 questions sur le thème de votre choix, avec score, explications immédiates et badge final Or/Argent/Bronze. Option B : VibeCalc, un simulateur métier, par exemple impact carbone ou prêt, avec 3 curseurs, 4 profils types et un diagnostic à 3 couleurs, plus des règles imbriquées du type : si X dépasse 10 et Y reste sous 5, on applique un coefficient dynamique. Attention : l’IA se trompe souvent sur les conditions imbriquées, c’est à vous de les relire et de les corriger dans le code. »

ANIMATION — Demander rapidement à voix haute qui choisit l’Option A et qui choisit l’Option B. Ne pas révéler le twist : le callout vert dit seulement que le client changera ses exigences à la minute 20.

TRANSITION — « Voici la méthode en 4 temps pour réussir à coup sûr en 45 minutes. »`,
  // M6_Strategie3Prompts
  `⏱ 4 min · PLAN DE BATAILLE EN 4 TEMPS

OBJECTIF — Cadencer les 45 minutes du TP : 12 + 8 + 15 + 10 minutes.

DIRE — « Quatre temps. De 0 à 12 minutes : générer le cœur de l’application avec les 5 briques du prompt. De 12 à 20 : ouvrir le code et personnaliser vous-même vos questions ou vos seuils. À la minute 20, je vous annonce une nouvelle exigence du client : vous aurez 15 minutes pour refactoriser par prompt. Enfin, de 35 à 45 : le Vibe Design, avec mode sombre ou clair, micro-animation et affichage mobile. Je vous colle l’amorce de l’étape 1 dans le clavardage ! »

ANIMATION — → beat 1 : étape 2. → beat 2 : étape 3 (twist). → beat 3 : étape 4. Coller l’amorce dans le clavardage.

TRANSITION — « C’est parti pour la phase 1 : 20 minutes de création ! »`,
  // M6_LabTP1
  `⏱ 20 min · TP JOUR 1 · PHASE 1 · VIBEQUIZ OU VIBECALC

OBJECTIF — Obtenir une version 1 complète (variables, conditions, boucles, fonctions, UI) puis la personnaliser dans le code.

DIRE — « Vingt minutes individuelles pour cette première phase. Point d’étape oral à 12 minutes : votre version 1 doit tourner. À 20 minutes, vous avez modifié vos questions ou seuils dans le code. Si quelqu’un bloque, partage d’écran de 2 minutes ! »

ANIMATION — Lancer le minuteur de 20 minutes. Cocher les critères de réussite au fil des points d’étape. Quand le minuteur arrive à zéro, passer à la page suivante : c’est le twist.

TRANSITION — « Stop ! Le client vient de vous écrire… »`,
  // M6_LabTwist
  `⏱ 25 min · TP JOUR 1 · PHASE 2 · TWIST CLIENT PUIS VIBE DESIGN

OBJECTIF — Apprendre à faire évoluer un code généré par l’IA face à une exigence qui change, puis soigner l’ergonomie.

DIRE — « Nouvelle exigence. VibeQuiz : plus de questions en dur, elles viennent d’un JSON, les scores sont sauvegardés dans le localStorage et vous affichez un classement local. VibeCalc : le client veut un export instantané du résultat, rapport imprimable ou graphique interactif. Vous avez 15 minutes pour refactoriser par prompts, sans repartir de zéro. À 35 minutes, je vous donne le cahier des charges Vibe Design. »

ANIMATION — Lancer le minuteur de 25 minutes. À 35 minutes (reste 10 min), cliquer une fois : cahier des charges Vibe Design (mode sombre / clair avec transition CSS pure, micro-animation de feedback type confettis ou jauge SVG, mobile-first testé dans les devtools). Point d’étape oral quand le minuteur affiche 10:00 puis 00:00. Si la librairie de graphiques n’est pas chargeable dans l’outil, proposer un graphique en SVG ou Canvas natif.

TRANSITION — « Place aux démonstrations de vos applications ! »`,
  // M6_Restitution
  `⏱ 20 min · RESTITUTION & DÉMONSTRATIONS

OBJECTIF — Valoriser les réalisations et vérifier la lecture du code.

DIRE — « Deux à trois minutes par participant : vous partagez votre écran, vous nous faites tester une question ou un scénario à voix haute, puis vous ouvrez l’onglet Code 30 secondes pour nous pointer une variable et une condition ou fonction que vous avez modifiée. »

ANIMATION — Lancer le minuteur de 3 minutes pour chaque passage. Au-delà de 8-10 participants, faire passer 5-6 volontaires et inviter les autres à déposer une capture dans le clavardage.

TRANSITION — « Faisons le bilan de cette première journée ! »`,
  // M6_BilanJ1
  `⏱ 4 min · BILAN DU JOUR 1

OBJECTIF — Synthétiser les acquis de la première journée.

DIRE — « Bravo à toutes et à tous ! Aujourd’hui, vous avez appris ce qu’est un algorithme, comment fonctionne une IA générative, comment lire et utiliser les variables, les types, les conditions, les boucles et les fonctions, et vous avez créé votre première mini-application graphique. »

ANIMATION — Faire défiler les 5 points clés.

TRANSITION — « Terminons par notre billet de sortie en une minute chacun. »`,
  // M6_SortieJ1
  `⏱ 5 min · BILLET DE SORTIE JOUR 1

OBJECTIF — Recueillir le déclic du jour et les questions pour le lendemain.

DIRE — « Je vous appelle chacun par votre prénom pour 45 secondes au micro : votre déclic du jour, ce dont vous êtes le plus fier dans votre mini-app, et éventuellement une question pour demain matin. Très belle soirée à tous, à demain 9 h 00 ! »

ANIMATION — Tour de table par prénom. Noter les éventuelles questions pour l’ouverture du Jour 2.`,
];

// ════════════════════════════════════════════════════════════════════════════
// JOUR 2 — Ouverture & Module 7 : Listes et objets (10 pages)
// ════════════════════════════════════════════════════════════════════════════
const J2_Cover: Page = () => (
  <Cover
    mod={7}
    day={2}
    eyebrow="Jour 2 · Structurer un vrai projet et manipuler des données"
    sub="Un seul projet toute la journée : TaskFlow, votre outil de gestion de projet. Backlog, tableau Kanban, règles métier testées, import/export, glisser-déposer et sauvegarde."
  >
    <span style={{ color: C.plum }}>Jour 2</span>
    <br />
    Données, structure &amp; fiabilité
  </Cover>
);
J2_Cover.transition = BLOOM;

// Code snippet inside a QCM question (same palette as <Code>, compact)
const QCode = ({ children }: { children: string }) => (
  <div style={{ marginTop: 12, padding: '12px 20px', borderRadius: 14, background: G.navy, fontFamily: mono, fontSize: 21, fontWeight: 500, lineHeight: 1.45, color: CODE.txt }}>
    {children.split('\n').map((l, i) => (
      <div key={i} style={{ whiteSpace: 'pre' }}>
        {highlight(l) || ' '}
      </div>
    ))}
  </div>
);

const J2_QuizRappel: Page = () => (
  <Frame mod={7} kind="qcm">
    <Title>QCM de réactivation · 7 pièges du Jour 1</Title>
    <QuizSeries y={190}>
      <QuizQ
        q={
          <>
            Le champ « Bonus » contient 5. Quel score s’affiche ?
            <QCode>{`let score = 10;\nlet bonus = document.querySelector("#bonus").value;\nscore = score + bonus;\nafficher(score);`}</QCode>
          </>
        }
        explain="« .value » renvoie toujours du texte : 10 + « 5 » colle les deux → « 105 ». Piège : 10 * « 5 » donnerait bien 50, le bug n’apparaît qu’avec +. Correctif : Number(...)."
      >
        <QOpt>15</QOpt>
        <QOpt ok>105</QOpt>
        <QOpt>NaN</QOpt>
        <QOpt>Une erreur dans la console</QOpt>
      </QuizQ>
      <QuizQ
        q={
          <>
            Le joueur termine avec 95 points. Quel badge obtient-il ?
            <QCode>{`if (score >= 50) badge = "Bronze";\nelse if (score >= 80) badge = "Argent";\nelse if (score >= 95) badge = "Or";\nelse badge = "Aucun";`}</QCode>
          </>
        }
        explain="La première condition vraie gagne : 95 >= 50 dès la ligne 1, les autres ne sont jamais lues. On teste toujours du seuil le plus haut au plus bas."
      >
        <QOpt>Or</QOpt>
        <QOpt>Argent</QOpt>
        <QOpt ok>Bronze</QOpt>
        <QOpt>Aucun</QOpt>
      </QuizQ>
      <QuizQ
        q={
          <>
            Que se passe-t-il avec ce branchement d’événement ?
            <QCode>{`function verifier() { console.log("clic !"); }\nbouton.addEventListener("click", verifier());`}</QCode>
          </>
        }
        explain="verifier() avec parenthèses exécute la fonction immédiatement et transmet son résultat (undefined). Il faut passer la fonction elle-même : verifier, sans parenthèses."
      >
        <QOpt>« clic ! » s’affiche à chaque clic</QOpt>
        <QOpt ok>« clic ! » s’affiche une fois au chargement, puis plus rien au clic</QOpt>
        <QOpt>Erreur de syntaxe : la page reste blanche</QOpt>
        <QOpt>« clic ! » s’affiche deux fois par clic</QOpt>
      </QuizQ>
      <QuizQ
        q={
          <>
            Qu’observe-t-on à l’écran ?
            <QCode>{`let questions = ["Q1", "Q2", "Q3"];\nfor (let i = 0; i <= questions.length; i++) {\n  afficher(questions[i].toUpperCase());\n}`}</QCode>
          </>
        }
        explain="i va de 0 à 3 : questions[3] n’existe pas (undefined) et undefined.toUpperCase() plante. Avec < au lieu de <=, la boucle s’arrête au dernier indice, 2."
      >
        <QOpt>Q1, Q2, Q3</QOpt>
        <QOpt ok>Q1, Q2, Q3, puis une TypeError dans la console</QOpt>
        <QOpt>Q2, Q3 seulement : l’indice 0 est ignoré</QOpt>
        <QOpt>Une boucle infinie qui fige l’onglet</QOpt>
      </QuizQ>
      <QuizQ
        q={
          <>
            Le joueur répond « A » aux 5 questions. Quel score obtient-il ?
            <QCode>{`if (reponse = "B") {\n  score = score + 1;\n}`}</QCode>
          </>
        }
        explain="« = » affecte « B » à reponse : la condition vaut un texte non vide, donc vraie à chaque fois. Comparer, c’est « === ». Un seul caractère fausse tout le jeu."
      >
        <QOpt>0</QOpt>
        <QOpt ok>5 : toutes les réponses sont comptées justes</QOpt>
        <QOpt>Une erreur au chargement de la page</QOpt>
        <QOpt>Le score dépend de la bonne réponse de chaque question</QOpt>
      </QuizQ>
      <QuizQ
        q={
          <>
            Quelle(s) ligne(s) provoque(nt) une erreur ?
            <QCode>{`const joueur = { nom: "Léa", score: 0 };\njoueur.score = 10;     // ligne 2\nconst total = 0;\ntotal = total + 5;     // ligne 4`}</QCode>
          </>
        }
        explain="const interdit de réaffecter la variable (ligne 4 : TypeError), pas de modifier l’intérieur de l’objet qu’elle désigne : la ligne 2 est autorisée."
      >
        <QOpt>Les lignes 2 et 4</QOpt>
        <QOpt ok>La ligne 4 seulement</QOpt>
        <QOpt>La ligne 2 seulement</QOpt>
        <QOpt>Aucune</QOpt>
      </QuizQ>
      <QuizQ
        q="Après 6 prompts, le filtre fonctionne mais le compteur affiche NaN quand on choisit « Urgent ». Quel prompt de correction est le plus efficace ?"
        explain="Symptôme observé + résultat attendu + périmètre limité : l’IA corrige la cause sans réécrire ce qui marchait. Masquer l’erreur (D) laisse un faux chiffre à l’écran."
      >
        <QOpt>« Corrige le bug du compteur. »</QOpt>
        <QOpt>« Voici tout mon code : trouve les bugs et améliore-le. »</QOpt>
        <QOpt ok>« Filtre Urgent → NaN, attendu 3. Corrige seulement calculerTotal(), ne touche à rien d’autre. »</QOpt>
        <QOpt>« Entoure le compteur d’un try/catch pour masquer l’erreur. »</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const J2_STEPS = [
  {
    v: 'v1',
    lab: 'Atelier 7.1',
    title: 'Backlog produit',
    icon: 'layers' as IconName,
    tone: 'blue' as Tone,
    items: ['Modèle de données imposé', 'Formulaire validé', 'Tri priorité → points', 'Recherche + 2 filtres combinés'],
  },
  {
    v: 'v2',
    lab: 'Atelier 8.1',
    title: 'Kanban & règles',
    icon: 'grid' as IconName,
    tone: 'violet' as Tone,
    items: ['Colonnes pilotées par la config', 'Limite WIP, Definition of Ready', 'Fonctions pures en Zone 2', '6 auto-tests + test de mutation'],
  },
  {
    v: 'v3',
    lab: 'Atelier 9.1',
    title: 'Import & pilotage',
    icon: 'chart' as IconName,
    tone: 'teal' as Tone,
    items: ['Import d’un CSV piégé', 'Rapport d’import exact', 'Export / import JSON sans perte', 'Tableau de bord en direct'],
  },
  {
    v: 'v4',
    lab: 'TP Jour 2',
    title: 'Kanban complet',
    icon: 'rocket' as IconName,
    tone: 'pink' as Tone,
    items: ['Glisser-déposer natif', 'Sauvegarde versionnée', 'Twist du Product Owner', 'Migration des données'],
  },
];

const J2_FilRouge: Page = () => (
  <Frame mod={7} kind="tp" beats={1}>
    <Title>Le fil rouge du Jour 2 : TaskFlow, votre outil de gestion de projet</Title>
    <Lede>Un seul projet, quatre incréments. Chaque atelier repart de votre version précédente : rien n’est jeté, tout s’empile.</Lede>
    <Grid top={260} cols={4} gap={22}>
      {J2_STEPS.map((s, i) => (
        <div key={s.v} className={A.in} style={{ ...dl(100 + i * 120), background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 24px', borderTop: `8px solid ${STRONG[s.tone]}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: display, fontWeight: 800, fontSize: 44, color: STRONG[s.tone] }}>{s.v}</span>
            <Tag tone={s.tone} size={17} icon={s.icon}>{s.lab}</Tag>
          </div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy, marginTop: 6 }}>{s.title}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
            {s.items.map((it) => (
              <div key={it} style={{ display: 'flex', gap: 10, fontSize: 21, lineHeight: 1.35, color: C.ink }}>
                <Icon name="check" size={20} color={T[s.tone].fg} style={{ flex: 'none', marginTop: 4 }} />
                <span>{it}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </Grid>
    <Box x={120} y={660} w={1680}>
      <Callout tone="yellow" icon="save" title="Réflexe de chef de projet : une version qui marche, on la garde" cls={b.on(1)} size={24}>
        Avant chaque atelier, enregistrez votre version stable (<PathChip>taskflow-v1.html</PathChip>, <PathChip>taskflow-v2.html</PathChip>…). Si un prompt casse tout, vous repartez de la dernière version saine au lieu de supplier l’IA de réparer.
      </Callout>
    </Box>
  </Frame>
);

const M7_Divider: Page = () => (
  <Divider mod={7} kicker="Jour 2 · Matin" title="Listes et objets : le cœur des applications de données">
    <Bullet size={30}>Les listes (tableaux) : ranger une collection dans l’ordre</Bullet>
    <Bullet size={30}>Les objets : la fiche d’identité d’un ticket de projet</Bullet>
    <Bullet size={30}>Filtrer, trier, retrouver… et poser le backlog de TaskFlow v1</Bullet>
  </Divider>
);
M7_Divider.transition = BLOOM;

const M7_ListesUI: Page = () => (
  <Frame mod={7} kind="cours" beats={2}>
    <Title>Une liste (tableau) : plusieurs éléments rangés entre crochets [ ]</Title>
    <Lede>Chaque élément possède un numéro de place (son indice), qui commence toujours à 0.</Lede>
    <Box x={120} y={255} w={940}>
      <Code
        file="Manipuler une liste en JavaScript"
        size={22}
        hi={[1, 4]}
        code={`let etapes = ["Idée", "Maquette", "Tests", "Démo"];\nconsole.log(etapes[0]);      // "Idée" (le 1er est à l’indice 0)\nconsole.log(etapes.length);  // 4 éléments\netapes.push("Publication");  // ajoute un 5e élément à la fin`}
      />
    </Box>
    <Box x={1100} y={255} w={700}>
      <Card title="Visualiser les indices (0 à 3)" icon="grid" tone="blue" bsz={21}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 8 }}>
          {['Idée', 'Maquette', 'Tests', 'Démo'].map((v, i) => (
            <div key={i} style={{ textAlign: 'center', background: T.blue.bg, borderRadius: 12, padding: '12px 8px', boxShadow: `inset 0 0 0 2px ${T.blue.bd}` }}>
              <div style={{ fontFamily: mono, fontSize: 16, color: C.muted }}>[{i}]</div>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 20, color: C.navy, marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>
        <div className={b.on(1)} style={{ marginTop: 14, fontSize: 20, color: C.soft }}>
          <Ic>.length</Ic> donne le nombre total de cartes ; <Ic>.push(...)</Ic> ajoute une nouvelle carte à la fin.
        </div>
      </Card>
    </Box>
    <Box x={120} y={740} w={1680}>
      <Callout tone="yellow" icon="bulb" title="Le petit décalage à retenir : premier élément = indice 0" cls={b.on(2)} size={24}>
        Dans une liste de <Strong>4 éléments</Strong>, le premier est <Ic>etapes[0]</Ic> et le dernier est <Ic>etapes[3]</Ic> (c’est-à-dire <Ic>etapes.length - 1</Ic>).
      </Callout>
    </Box>
  </Frame>
);

const M7_ObjetsUI: Page = () => (
  <Frame mod={7} kind="cours" beats={1}>
    <Title>Un objet {`{ ... }`} : la fiche d’identité complète d’une carte UI</Title>
    <Lede>Une simple liste de textes ne suffit pas quand une carte a un titre, une catégorie, une priorité et un statut !</Lede>
    <Box x={120} y={260} w={840}>
      <Code
        file="Un objet JavaScript (paires clé : valeur)"
        size={22}
        hi={[2, 3, 4, 5]}
        code={`let tache = {\n  titre: "Préparer le support client",\n  categorie: "Produit",\n  priorite: "Haute",\n  termine: false\n};\n\n// Lire ou modifier une propriété avec le point :\nconsole.log(tache.titre);\ntache.termine = true;`}
      />
    </Box>
    <Box x={1000} y={260} w={800}>
      <UiMock title="La carte UI produite par cet objet" tool="Correspondance 1 pour 1" tone="violet" d={200}>
        <div style={{ background: '#F6F8FC', borderRadius: 16, padding: 20, border: `2px solid ${C.rule}`, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tag tone="blue" size={16}>categorie : "Produit"</Tag>
            <Tag tone="coral" size={16}>priorite : "Haute"</Tag>
          </div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 25, color: C.navy }}>
            Préparer le support client <span style={{ fontFamily: mono, fontSize: 16, color: C.muted }}>← tache.titre</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, color: C.soft }}>
            <span style={{ width: 24, height: 24, borderRadius: 6, border: `2px solid ${C.navy}`, display: 'inline-block' }} />
            <span>Statut : À faire (<Ic>tache.termine === false</Ic>)</span>
          </div>
        </div>
      </UiMock>
      <div className={b.on(1)} style={{ marginTop: 16 }}>
        <Callout tone="green" icon="key" title="Clé : valeur" size={23}>
          Chaque <Strong c={C.green}>propriété de l’objet</Strong> (<Ic>tache.priorite</Ic>) devient un élément visuel de votre carte !
        </Callout>
      </div>
    </Box>
  </Frame>
);

const M7_TableauObjets: Page = () => (
  <Frame mod={7} kind="cours" beats={1}>
    <Title>Le duo roi du Web : le tableau d’objets [ {`{...}`}, {`{...}`} ]</Title>
    <Lede>99 % des applications modernes (To-Do list, boutique, agenda, tableau de bord) reposent sur une liste d’objets.</Lede>
    <Box x={120} y={255} w={1020}>
      <Code
        file="Une collection de cartes dans votre application"
        size={21}
        hi={[2, 3, 4]}
        code={`let taches = [\n  { id: 1, titre: "Créer la maquette UI", categorie: "Design", urgent: true, fait: true },\n  { id: 2, titre: "Vérifier les formules", categorie: "Code", urgent: true, fait: false },\n  { id: 3, titre: "Rédiger le README", categorie: "Doc", urgent: false, fait: false }\n];\n\n// Parcourir toutes les cartes :\nfor (let t of taches) {\n  afficherCarte(t.titre, t.categorie, t.urgent);\n}`}
      />
    </Box>
    <Box x={1180} y={255} w={620}>
      <Card title="Comment le demander à l’IA ?" icon="sparkles" tone="violet" bsz={22}>
        <Col gap={12}>
          <div>Dans votre prompt, décrivez simplement <Strong c={C.violet}>les champs d’un élément</Strong> :</div>
          <div style={{ background: T.violet.bg, padding: 14, borderRadius: 12, fontSize: 20, color: C.ink }}>
            « Stocke les éléments dans un tableau d’objets avec les propriétés : <Ic>id</Ic>, <Ic>titre</Ic>, <Ic>categorie</Ic>, <Ic>urgent</Ic> (booléen) et <Ic>fait</Ic> (booléen). »
          </div>
        </Col>
      </Card>
    </Box>
    <Box x={120} y={765} w={1680}>
      <Callout tone="blue" icon="layers" title="Pourquoi l’identifiant unique (id) est-il précieux ?" cls={b.on(1)} size={24}>
        Grâce à <Ic>id</Ic>, quand vous cliquez sur « Supprimer » ou « Cocher » sur la carte n° 2, l’application sait exactement quel objet modifier !
      </Callout>
    </Box>
  </Frame>
);

const M7_Operations: Page = () => (
  <Frame mod={7} kind="cours">
    <Title>Les 4 opérations reines sur vos listes d’objets</Title>
    <Lede>Voici les 4 briques que l’IA génère dès que vous lui demandez une barre de recherche, des filtres ou un formulaire d’ajout.</Lede>
    <Grid top={255} cols={2} gap={26}>
      <Card title="1 · Filtrer une catégorie (.filter)" icon="filter" tone="blue" d={100} bsz={21}>
        <div>Garde uniquement les objets qui respectent une condition :</div>
        <Code size={19} style={{ marginTop: 8 }} code={`let urgentes = taches.filter(t => t.urgent === true);`} />
      </Card>
      <Card title="2 · Chercher un mot-clé (.includes)" icon="search" tone="violet" d={200} bsz={21}>
        <div>Vérifie si le titre contient les lettres tapées dans la barre de recherche :</div>
        <Code size={19} style={{ marginTop: 8 }} code={`let trouves = taches.filter(t =>\n  t.titre.toLowerCase().includes(recherche.toLowerCase())\n);`} />
      </Card>
      <Card title="3 · Ajouter une carte (.push)" icon="plus" tone="green" d={300} bsz={21}>
        <div>Crée un nouvel objet à partir du formulaire et l’ajoute au tableau :</div>
        <Code size={19} style={{ marginTop: 8 }} code={`taches.push({ id: Date.now(), titre: saisie, fait: false });`} />
      </Card>
      <Card title="4 · Compter / Synthétiser (.length)" icon="chart" tone="teal" d={400} bsz={21}>
        <div>Calcule en direct les compteurs en haut de votre application :</div>
        <Code size={19} style={{ marginTop: 8 }} code={`let nbFaites = taches.filter(t => t.fait).length;`} />
      </Card>
    </Grid>
  </Frame>
);

const M7_ITEMS = [
  { id: 1, titre: 'Concevoir l’écran d’accueil', cat: 'Design', urgent: true, fait: true },
  { id: 2, titre: 'Brancher le filtre par priorité', cat: 'Code', urgent: true, fait: false },
  { id: 3, titre: 'Tester le cas liste vide', cat: 'Qualité', urgent: true, fait: false },
  { id: 4, titre: 'Choisir la palette de couleurs', cat: 'Design', urgent: false, fait: true },
  { id: 5, titre: 'Rédiger le guide utilisateur', cat: 'Doc', urgent: false, fait: false },
];

const M7_SimFilter: Page = () => {
  const [mode, setMode] = useState<'all' | 'urgent' | 'todo' | 'done'>('all');
  const filtered = M7_ITEMS.filter((it) => {
    if (mode === 'urgent') return it.urgent;
    if (mode === 'todo') return !it.fait;
    if (mode === 'done') return it.fait;
    return true;
  });
  const expr =
    mode === 'all'
      ? 'taches // toutes les cartes (5)'
      : mode === 'urgent'
        ? 'taches.filter(t => t.urgent === true)'
        : mode === 'todo'
          ? 'taches.filter(t => t.fait === false)'
          : 'taches.filter(t => t.fait === true)';
  return (
    <Frame mod={7} kind="demo">
      <Title>Simulateur : filtrez le tableau d’objets, voyez le code et les cartes</Title>
      <Lede>Cliquez sur les boutons de filtre : observez l’instruction JavaScript .filter() et le mur de cartes se mettre à jour.</Lede>
      <Box x={120} y={250} w={1680} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <Btn tone="navy" ghost={mode !== 'all'} size={20} onClick={() => setMode('all')}>
            Toutes ({M7_ITEMS.length})
          </Btn>
          <Btn tone="coral" ghost={mode !== 'urgent'} size={20} onClick={() => setMode('urgent')}>
            Urgentes uniquement
          </Btn>
          <Btn tone="blue" ghost={mode !== 'todo'} size={20} onClick={() => setMode('todo')}>
            À faire
          </Btn>
          <Btn tone="green" ghost={mode !== 'done'} size={20} onClick={() => setMode('done')}>
            Terminées ✓
          </Btn>
        </div>
        <div style={{ fontFamily: mono, fontSize: 21, background: G.navy, color: '#7EE2B8', padding: '10px 20px', borderRadius: 12 }}>
          {expr} → <strong>{filtered.length} carte(s)</strong>
        </div>
      </Box>
      <Box x={120} y={335} w={1680} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {filtered.map((it) => (
          <div key={it.id} className={A.pop} style={{ background: C.card, borderRadius: 16, boxShadow: SHADOW, padding: '20px 22px', borderTop: `6px solid ${it.urgent ? C.coral : C.blue}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Tag tone="blue" size={15}>{it.cat}</Tag>
              <Tag tone={it.urgent ? 'coral' : 'grey'} size={15}>{it.urgent ? 'Urgent' : 'Normal'}</Tag>
            </div>
            <div style={{ fontFamily: display, fontWeight: 700, fontSize: 23, color: C.ink, marginTop: 10 }}>{it.titre}</div>
            <div style={{ marginTop: 10, fontSize: 19, fontWeight: 600, color: it.fait ? T.green.fg : C.muted }}>
              {it.fait ? '✓ Terminée (fait: true)' : '○ À faire (fait: false)'}
            </div>
          </div>
        ))}
      </Box>
      <Box x={120} y={780} w={1680}>
        <Callout tone="blue" icon="filter" title="Ce que fait .filter() sans jamais détruire vos données" size={24}>
          Filtrer ne supprime rien du tableau d’origine : cela crée une <Strong>vue temporaire</Strong> affichée à l’écran. Quand vous recliquez sur « Toutes », les 5 cartes reviennent !
        </Callout>
      </Box>
    </Frame>
  );
};

const M7_TrierTrouver: Page = () => (
  <Frame mod={7} kind="cours" beats={1}>
    <Title>Trier, retrouver, modifier : .sort, .find et .map… et leurs pièges</Title>
    <Lede>Les trois opérations qu’un outil de gestion de projet utilise à chaque clic. Chacune cache un piège que l’IA ne signale jamais.</Lede>
    <Grid top={255} cols={3} gap={24}>
      <Card title="Trier le backlog (.sort)" icon="sliders" tone="blue" d={100} bsz={20} pad={20}>
        <Code size={18} style={{ marginTop: 6 }} code={`const tries = [...tickets].sort((a, b) =>\n  a.priorite - b.priorite ||\n  (a.points ?? 99) - (b.points ?? 99)\n);`} />
        <div style={{ marginTop: 12 }}>
          Priorité 1 en haut, puis les plus petits points. <Strong c={C.coral}>Piège :</Strong> <Ic>.sort()</Ic> réordonne le tableau d’origine, d’où la copie <Ic>[...tickets]</Ic>.
        </div>
      </Card>
      <Card title="Retrouver un ticket (.find)" icon="search" tone="violet" d={220} bsz={20} pad={20}>
        <Code size={18} style={{ marginTop: 6 }} code={`const t = tickets.find(t => t.id === id);\nif (!t) return; // id inconnu : on sort`} />
        <div style={{ marginTop: 12 }}>
          Renvoie l’objet trouvé… ou <Ic>undefined</Ic>. <Strong c={C.coral}>Piège :</Strong> un id lu dans le HTML est un texte, <Ic>"42" === 42</Ic> est faux.
        </div>
      </Card>
      <Card title="Modifier sans casser (.map)" icon="loop" tone="green" d={340} bsz={20} pad={20}>
        <Code size={18} style={{ marginTop: 6 }} code={`const maj = tickets.map(t =>\n  t.id === id ? { ...t, statut } : t\n);`} />
        <div style={{ marginTop: 12 }}>
          Renvoie un <Strong c={C.green}>nouveau tableau</Strong> : l’ancien reste intact, donc comparable dans un test (et annulable plus tard).
        </div>
      </Card>
    </Grid>
    <Box x={120} y={790} w={1680}>
      <Callout tone="violet" icon="sparkles" title="À exiger dans vos prompts dès maintenant" cls={b.on(1)} size={23}>
        « Ne modifie jamais le tableau <Ic>tickets</Ic> directement : trie une copie, et renvoie un nouveau tableau avec <Ic>.map</Ic> pour chaque modification. »
      </Callout>
    </Box>
  </Frame>
);

const M7_SpecV1: Page = () => (
  <Frame mod={7} kind="tp" beats={1}>
    <Title>TaskFlow v1 · Le backlog produit : cahier de l’incrément</Title>
    <Lede>Ce matin, le cœur de données de tout le reste. Le modèle est imposé : tous les incréments suivants en dépendent.</Lede>
    <Box x={120} y={255} w={860}>
      <Code
        file="Modèle d’un ticket (imposé, à recopier dans votre prompt)"
        size={20}
        hi={[4, 6, 7]}
        code={`{\n  id: 1,                   // nombre unique\n  titre: "Connexion SSO",  // obligatoire, 3 à 80 caractères\n  type: "story",           // "story" | "bug" | "tache"\n  priorite: 1,             // 1 haute · 2 moyenne · 3 basse\n  points: 5,               // 1, 2, 3, 5, 8, 13 ou null\n  statut: "backlog",       // backlog | afaire | encours | termine\n  creeLe: "2026-11-03"     // date ISO\n}`}
      />
    </Box>
    <Box x={1020} y={255} w={780}>
      <Card title="5 user stories de l’incrément 1" icon="doc" tone="blue" d={150} bsz={20} pad={22}>
        <Col gap={11}>
          <div><Tag tone="blue" size={15}>US1</Tag> Ajouter un ticket par un formulaire <Strong>validé</Strong> : titre 3–80 caractères, points dans la suite 1-2-3-5-8-13 ou « non estimé ».</div>
          <div><Tag tone="blue" size={15}>US2</Tag> Lire le backlog <Strong>trié</Strong> : priorité 1 en haut, puis les plus petits points, non estimés en bas.</div>
          <div><Tag tone="blue" size={15}>US3</Tag> <Strong>Combiner</Strong> recherche texte + filtre type + filtre priorité (les trois à la fois).</div>
          <div><Tag tone="blue" size={15}>US4</Tag> Voir en en-tête : nombre de tickets, total des points, tickets non estimés.</div>
          <div><Tag tone="blue" size={15}>US5</Tag> Supprimer un ticket avec une confirmation <Strong>dans l’interface</Strong> (pas de <Ic>confirm()</Ic>).</div>
        </Col>
      </Card>
    </Box>
    <Box x={120} y={700} w={860}>
      <Callout tone="coral" icon="alert" title="Les 3 cas que l’IA rate le plus souvent" cls={b.on(1)} size={21}>
        Points « 4 » acceptés · tri cassé juste après un ajout · recherche « LOGIN » qui ne trouve pas « login ».
      </Callout>
    </Box>
    <Box x={1020} y={700} w={780}>
      <Callout tone="green" icon="database" title="Jeu de données de départ" d={300} size={21}>
        12 tickets fictifs du projet « Refonte de l’espace client », dont 2 non estimés et 1 bug priorité 1.
      </Callout>
    </Box>
  </Frame>
);

const M7_Lab7: Page = () => (
  <VibeLab
    mod={7}
    n="7.1"
    title="TaskFlow v1 · Construire le backlog produit"
    defi="trous"
    objective={
      <>
        Obtenir dans <strong>ChatGPT, Claude ou Gemini</strong> la v1 de TaskFlow : un backlog trié, filtrable et alimenté par un formulaire validé, fondé <strong>exactement</strong> sur le modèle de ticket imposé.
      </>
    }
    minutes={35}
    crit={
      <>
        <CheckItem id="m7l7a">Recherche + filtre type + filtre priorité fonctionnent ensemble (ex. « login » + bug + priorité 1)</CheckItem>
        <CheckItem id="m7l7b">Le formulaire refuse un titre vide et des points hors suite (4, 7, -1)</CheckItem>
        <CheckItem id="m7l7c">Le tri priorité → points reste correct juste après chaque ajout</CheckItem>
        <CheckItem id="m7l7d">Les 3 compteurs d’en-tête se recalculent en direct</CheckItem>
      </>
    }
    suivi="Points d’étape au micro à 15 min (la v1 tourne) et à 30 min (écarts corrigés). Bloqué ? Partage d’écran 2 minutes !"
  >
    <WStep n={1}>
      Complétez les trous puis envoyez : <Pr>« Crée TaskFlow, un outil de backlog en un seul fichier HTML/CSS/JS. Chaque ticket suit ce modèle : [___]. Pré-remplis [___] tickets fictifs du projet [___]. Trie par [___] puis par [___]. Ajoute une recherche + des filtres combinables, un formulaire validé et 3 compteurs. »</Pr>
    </WStep>
    <WStep n={2}>
      Testez les 5 user stories <Strong>une par une</Strong> et notez chaque écart. Corrigez-les par des prompts ciblés : <Strong>1 écart = 1 prompt</Strong> (symptôme + attendu).
    </WStep>
    <WStep n={3}>
      Dans l’onglet <Strong>Code</Strong>, ajoutez à la main un 13e ticket priorité 1 de 1 point : il doit remonter en tête du backlog. Enregistrez <PathChip>taskflow-v1.html</PathChip>.
    </WStep>
  </VibeLab>
);

const M7_Pause: Page = () => <Pause mod={7} title="Pause matin" back="Reprise dans 15 minutes" minutes={15} />;

// ════════════════════════════════════════════════════════════════════════════
// MODULE 8 — Bonnes pratiques & Tests simples (10 pages)
// ════════════════════════════════════════════════════════════════════════════
const M8_Divider: Page = () => (
  <Divider mod={8} kicker="Jour 2 · Matin" title="Bonnes pratiques et tests simples">
    <Bullet size={30}>Éviter le piège du code spaghetti au fil des prompts</Bullet>
    <Bullet size={30}>Découper son application en 3 zones lisibles</Bullet>
    <Bullet size={30}>Intégrer un panneau « Auto-Tests ✓ » directement dans l’UI</Bullet>
  </Divider>
);
M8_Divider.transition = BLOOM;

const M8_Spaghetti: Page = () => (
  <Frame mod={8} kind="cours" beats={2}>
    <Title>Pourquoi tant de projets Vibe Coding cassent au 8e prompt ?</Title>
    <Lede>Sans règles d’architecture, le code grossit en vrac jusqu’à ce que chaque nouveau prompt casse la fonctionnalité précédente.</Lede>
    <Grid top={260} cols={2} gap={28}>
      <Card title="Sans hygiène : l’effet boule de neige" icon="alert" tone="coral" d={100} bsz={22}>
        <Col gap={10}>
          <div>• Variables nommées <Ic>data</Ic>, <Ic>temp</Ic>, <Ic>x</Ic>, <Ic>res2</Ic></div>
          <div>• Les calculs sont mélangés au milieu des balises HTML</div>
          <div>• Aucune vérification sur les listes vides ou champs vides</div>
          <div>• Au 8e prompt, corriger un filtre casse le compteur total !</div>
        </Col>
      </Card>
      <Card title="Avec nos 3 garde-fous : un projet sain" icon="shield" tone="green" cls={b.on(1)} bsz={22}>
        <Col gap={10}>
          <div><Strong c={C.green}>1. Nommage &amp; commentaires :</Strong> un code qui s’explique</div>
          <div><Strong c={C.green}>2. Découpage en 3 blocs :</Strong> Données / Calculs / Affichage UI</div>
          <div><Strong c={C.green}>3. Petits tests automatiques :</Strong> un bouton vérifie que les calculs restent justes après chaque modification !</div>
        </Col>
      </Card>
    </Grid>
    <Box x={120} y={750} w={1680}>
      <Callout tone="blue" icon="compass" title="Bonne nouvelle : c’est l’IA qui fait le rangement si vous le lui demandez !" cls={b.on(2)} size={24}>
        Vous n’avez pas à réorganiser 200 lignes à la main : vous donnez la <Strong>consigne d’architecture</Strong> à l’IA et vous vérifiez le résultat.
      </Callout>
    </Box>
  </Frame>
);

const M8_NommageComm: Page = () => (
  <Frame mod={8} kind="cours" beats={1}>
    <Title>Nommage explicite &amp; commentaires utiles</Title>
    <Lede>Comparez ces deux fonctions qui font exactement le même calcul : laquelle pouvez-vous vérifier en 5 secondes ?</Lede>
    <Grid top={255} cols={2} gap={28}>
      <Card title="Code opaque (difficile à auditer)" icon="x" tone="coral" d={100} bsz={21}>
        <Code
          size={19}
          style={{ marginTop: 8 }}
          code={`function calc(arr) {\n  let s = 0;\n  for (let x of arr) {\n    if (!x.d) s += x.p;\n  }\n  return s;\n}`}
        />
        <div style={{ marginTop: 12 }}>Que veulent dire <Ic>x.d</Ic> et <Ic>x.p</Ic> ? Même l’IA finit par les confondre quelques prompts plus tard !</div>
      </Card>
      <Card title="Code lisible & commenté (facile à piloter)" icon="check" tone="green" cls={b.on(1)} bsz={21}>
        <Code
          size={19}
          style={{ marginTop: 8 }}
          code={`// Calcule le budget restant des dépenses non réglées\nfunction calculerResteAPayer(depenses) {\n  let totalRestant = 0;\n  for (let depense of depenses) {\n    if (depense.estReglee === false) {\n      totalRestant = totalRestant + depense.montant;\n    }\n  }\n  return totalRestant;\n}`}
        />
      </Card>
    </Grid>
  </Frame>
);

const M8_Decoupage3: Page = () => (
  <Frame mod={8} kind="cours" beats={2}>
    <Title>La règle d’or de structure : séparer en 3 zones claires</Title>
    <Lede>Demandez toujours à l’IA d’organiser la partie JavaScript avec ces 3 bandeaux de commentaires.</Lede>
    <Box x={120} y={260} w={1680} style={{ display: 'flex', alignItems: 'stretch', gap: 16 }}>
      <Card title="Zone 1 · Données & État" icon="database" tone="blue" d={100} style={{ flex: 1 }} bsz={21}>
        <Code size={18} style={{ marginTop: 8 }} code={`// === 1. DONNÉES & ÉTAT ===\nlet taches = [ ... ];\nlet filtreActif = "toutes";`} />
        <div style={{ marginTop: 10 }}>Toutes vos variables et listes de départ au même endroit, tout en haut.</div>
      </Card>
      <FlowArrow />
      <Card title="Zone 2 · Fonctions métier (Calculs)" icon="gear" tone="violet" d={220} style={{ flex: 1 }} bsz={21}>
        <Code size={18} style={{ marginTop: 8 }} code={`// === 2. LOGIQUE MÉTIER ===\nfunction filtrerTaches(liste, f) {\n  ...\n  return resultat;\n}`} />
        <div style={{ marginTop: 10 }}>Des fonctions pures qui calculent et retournent un résultat, <Strong c={C.violet}>faciles à tester</Strong> !</div>
      </Card>
      <FlowArrow />
      <Card title="Zone 3 · Affichage UI & Clics" icon="palette" tone="green" d={340} style={{ flex: 1 }} bsz={21}>
        <Code size={18} style={{ marginTop: 8 }} code={`// === 3. INTERFACE UI ===\nfunction mettreAJourEcran() {\n  ...\n}`} />
        <div style={{ marginTop: 10 }}>Met à jour le HTML à partir des fonctions métier de la Zone 2.</div>
      </Card>
    </Box>
    <Box x={120} y={735} w={1680}>
      <Bubble who="vous" tool="Consigne de structuration à donner à l’IA" cls={b.on(1)} size={22}>
        Organise le code JavaScript en 3 sections clairement séparées par des commentaires : <Ic>1. DONNÉES &amp; ÉTAT</Ic>, <Ic>2. FONCTIONS MÉTIER (calculs et filtres purs avec return)</Ic>, <Ic>3. AFFICHAGE UI &amp; ÉVÉNEMENTS</Ic>.
      </Bubble>
    </Box>
  </Frame>
);

const M8_HotspotAudit: Page = () => (
  <Frame mod={8} kind="demo" beats={4}>
    <Title>Jeu d’audit : repérez les 4 pièges laissés par l’IA !</Title>
    <Lede>Ce code calcule la moyenne des notes d’une formation. Proposez un piège à voix haute, puis j’en révèle un par un.</Lede>
    <Box x={120} y={260} w={880}>
      <Code
        file="moyenne.js · Code à auditer"
        size={21}
        hi={[1, 4, 8]}
        code={`function f(a) {\n  let s = 0;\n  for (let x of a) {\n    if (x > 10) {\n      s = s + x;\n    }\n  }\n  return s / a.length;\n}`}
      />
      <Pin n={1} beat={1} x={845} y={72} />
      <Pin n={2} beat={2} x={845} y={165} />
      <Pin n={3} beat={3} x={845} y={289} />
      <Pin n={4} beat={4} x={845} y={320} />
    </Box>
    <Box x={1040} y={260} w={760} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <PinNote n={1} beat={1} title="Noms muets (f, a, s, x)" size={20}>
        Impossible de deviner ce que fait <Ic>f(a)</Ic> : renommer en <Ic>calculerMoyenne(notes)</Ic>.
      </PinNote>
      <PinNote n={2} beat={2} title="Condition parasite (x > 10)" size={20}>
        L’IA ne garde que les notes supérieures à 10 sans qu’on le demande : la moyenne est faussée.
      </PinNote>
      <PinNote n={3} beat={3} title="Liste vide : 0 / 0 = NaN" size={20}>
        Si la liste est vide, la division renvoie <Ic>NaN</Ic> qui s’affiche à l’écran.
      </PinNote>
      <PinNote n={4} beat={4} title="Aucun test de vérification" size={20}>
        Un test avec <Ic>[10, 20]</Ic> et un avec <Ic>[]</Ic> auraient démasqué les pièges 2 et 3.
      </PinNote>
    </Box>
    <Box x={120} y={650} w={880}>
      <Card title="Le réflexe d’audit" icon="search" tone="coral" bsz={21}>
        <Col gap={8}>
          <div><Strong c={C.coral}>1.</Strong> Que donne la fonction sur un exemple simple calculé de tête ?</div>
          <div><Strong c={C.coral}>2.</Strong> Que se passe-t-il si la liste est <Strong>vide</Strong> (<Ic>[]</Ic>) ?</div>
        </Col>
      </Card>
    </Box>
  </Frame>
);

const M8_IntroTests: Page = () => (
  <Frame mod={8} kind="cours" beats={2}>
    <Title>Introduction aux tests simples : vérifier avant de croire</Title>
    <Lede>Un test automatique est une simple phrase de code qui compare le résultat obtenu au résultat attendu.</Lede>
    <Box x={120} y={255} w={980}>
      <Code
        file="3 tests simples pour vérifier une fonction"
        size={21}
        hi={[6, 7, 8]}
        code={`function compterTachesRestantes(taches) {\n  if (!taches || taches.length === 0) return 0;\n  return taches.filter(t => t.fait === false).length;\n}\n\n// 1. Cas normal : 2 tâches dont 1 non faite → doit donner 1\nconsole.assert(compterTachesRestantes([{fait:true}, {fait:false}]) === 1, "Cas normal");\n// 2. Cas limite : liste vide [] → doit donner 0\nconsole.assert(compterTachesRestantes([]) === 0, "Cas liste vide");\n// 3. Cas tout terminé → doit donner 0\nconsole.assert(compterTachesRestantes([{fait:true}]) === 0, "Tout terminé");`}
      />
    </Box>
    <Box x={1140} y={255} w={660} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card title="Les 3 familles de tests à demander" icon="flask" tone="green" bsz={21}>
        <Col gap={10}>
          <div><Tag tone="blue" size={16}>1 · Cas normal</Tag> Des données habituelles (ex. 3 tâches).</div>
          <div><Tag tone="yellow" size={16}>2 · Cas limite</Tag> Liste vide <Ic>[]</Ic>, valeur <Ic>0</Ic>, texte avec espaces.</div>
          <div><Tag tone="coral" size={16}>3 · Cas particulier</Tag> Toutes les tâches déjà cochées, majuscules/minuscules.</div>
        </Col>
      </Card>
      <Callout tone="violet" icon="sparkles" title="L’astuce Vibe Coding" cls={b.on(1)} size={22}>
        Puisque vous travaillez dans une interface graphique, demandez à l’IA d’afficher le résultat de ces tests <Strong c={C.violet}>dans un petit panneau visuel en bas de votre mini-app !</Strong>
      </Callout>
    </Box>
  </Frame>
);

const M8_SimTestsUI: Page = () => {
  const [fixed, setFixed] = useState(false);
  const tests = [
    { name: 'Test 1 · Cas normal : moyenne de [10, 20] === 15', ok: true, got: '15' },
    { name: 'Test 2 · Un seul élément : moyenne de [14] === 14', ok: true, got: '14' },
    { name: 'Test 3 · Cas limite : liste vide [] === 0', ok: fixed, got: fixed ? '0' : 'NaN (division par 0 !)' },
    { name: 'Test 4 · Décimales : moyenne de [10, 11] === 10.5', ok: true, got: '10.5' },
  ];
  const passed = tests.filter((t) => t.ok).length;
  return (
    <Frame mod={8} kind="demo">
      <Title>Démo interactive : le panneau « Auto-Tests ✓ » dans votre UI</Title>
      <Lede>Voyez comment un panneau de tests intégré dans votre mini-app démasque immédiatement le bug de la liste vide !</Lede>
      <Box x={120} y={255} w={800}>
        <Code
          file="Zone 2 · Fonction métier dans le code"
          size={20}
          hi={fixed ? [2] : [3]}
          code={
            fixed
              ? `function calculerMoyenne(notes) {\n  if (notes.length === 0) return 0; // ✓ Garde-fou ajouté !\n  let somme = 0;\n  for (let n of notes) somme += n;\n  return somme / notes.length;\n}`
              : `function calculerMoyenne(notes) {\n  let somme = 0;\n  for (let n of notes) somme += n;\n  return somme / notes.length; // ✗ 0 / 0 = NaN si vide !\n}`
          }
        />
        <div style={{ marginTop: 18, display: 'flex', gap: 14 }}>
          <Btn icon={fixed ? 'checkCircle' : 'wand'} tone={fixed ? 'green' : 'violet'} size={21} onClick={() => setFixed((f) => !f)}>
            {fixed ? '✓ Correctif appliqué (revenir au bug)' : 'Demander à l’IA de corriger le Test 3'}
          </Btn>
        </div>
      </Box>
      <Box x={960} y={255} w={840}>
        <UiMock title="Panneau Auto-Tests intégré à l’application" tool={`${passed} / 4 tests réussis`} tone={passed === 4 ? 'green' : 'coral'}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tests.map((t, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: t.ok ? T.green.bg : T.coral.bg,
                  boxShadow: `inset 0 0 0 2px ${t.ok ? T.green.bd : T.coral.bd}`,
                }}
              >
                <span style={{ fontSize: 19, fontWeight: 700, color: C.ink }}>
                  {t.ok ? '✓ ' : '✗ '}
                  {t.name}
                </span>
                <Tag tone={t.ok ? 'green' : 'coral'} size={15}>Obtenu : {t.got}</Tag>
              </div>
            ))}
          </div>
        </UiMock>
      </Box>
      <Box x={120} y={760} w={1680}>
        <Callout tone="green" icon="flask" title="Votre filet de sécurité pour toute la suite de la formation" size={24}>
          Avec un bouton <Strong c={C.green}>« Vérifier les auto-tests (4/4 ✓) »</Strong> dans votre interface, vous savez en une seconde si une nouvelle modification de l’IA a préservé vos calculs !
        </Callout>
      </Box>
    </Frame>
  );
};

const M8_SpecV2: Page = () => (
  <Frame mod={8} kind="tp" beats={1}>
    <Title>TaskFlow v2 · Du backlog au Kanban, avec des règles testées</Title>
    <Lede>Le même tableau d’objets, une colonne par statut. Les règles vivent dans des fonctions pures, prouvées par des tests.</Lede>
    <Box x={120} y={255} w={860} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Code
        file="Zone 1 · Colonnes pilotées par les données"
        size={20}
        hi={[4]}
        code={`const COLONNES = [\n  { id: "backlog", titre: "Backlog",  wip: null },\n  { id: "afaire",  titre: "À faire",  wip: null },\n  { id: "encours", titre: "En cours", wip: 3 },\n  { id: "termine", titre: "Terminé",  wip: null },\n];\n// L’interface boucle sur COLONNES : aucune colonne en dur`}
      />
      <Code
        file="Zone 2 · Signature imposée"
        size={20}
        code={`deplacerTicket(tickets, id, versStatut)\n  // → { ok: true,  tickets: nouveauTableau }\n  // → { ok: false, erreur: "WIP atteint (3/3)" }`}
        d={150}
      />
    </Box>
    <Box x={1020} y={255} w={780} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card title="Règles métier (Zone 2)" icon="shield" tone="violet" d={200} bsz={20} pad={20}>
        <Col gap={9}>
          <div><Strong c={C.violet}>R1 · WIP :</Strong> 3 tickets maximum « En cours » ; au-delà, refus + message.</div>
          <div><Strong c={C.violet}>R2 · Definition of Ready :</Strong> un ticket non estimé ne quitte pas le Backlog.</div>
          <div><Strong c={C.violet}>R3 · Boutons ◀ ▶</Strong> sur chaque carte (le glisser-déposer viendra au TP).</div>
          <div><Strong c={C.violet}>R4 · Immuable :</Strong> le tableau reçu n’est jamais modifié.</div>
        </Col>
      </Card>
      <Card title="Les 6 auto-tests attendus" icon="flask" tone="green" cls={b.on(1)} bsz={19} pad={20}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px 18px' }}>
          <div>T1 · déplacement valide</div>
          <div>T2 · non estimé bloqué</div>
          <div><Strong c={C.green}>T3 · 3 en cours → 4e refusé</Strong></div>
          <div>T4 · id inconnu, sans planter</div>
          <div>T5 · tableau d’origine intact</div>
          <div>T6 · stats vides : 0 %, pas NaN</div>
        </div>
      </Card>
    </Box>
  </Frame>
);

const M8_Lab8: Page = () => (
  <VibeLab
    mod={8}
    n="8.1"
    title="TaskFlow v2 · Kanban, règles métier et auto-tests"
    defi="construire"
    objective={
      <>
        Transformer votre backlog en <strong>Kanban à 4 colonnes générées depuis COLONNES</strong>, avec les règles R1–R4 dans des fonctions pures et un panneau <strong>Auto-Tests (6 tests)</strong> qui prouve qu’elles tiennent.
      </>
    }
    minutes={35}
    crit={
      <>
        <CheckItem id="m8l8a">Les colonnes sont générées par une boucle sur COLONNES (une ligne ajoutée = une colonne)</CheckItem>
        <CheckItem id="m8l8b">Le 4e ticket « En cours » est refusé avec un message clair, sans alert()</CheckItem>
        <CheckItem id="m8l8c">6 / 6 auto-tests au vert, dont la limite WIP exacte et la liste vide</CheckItem>
        <CheckItem id="m8l8d">Le test de mutation a fait passer au moins un test au rouge</CheckItem>
      </>
    }
    suivi="Points d’étape au micro à 15 min (Kanban affiché) et à 30 min (tests au vert). Bloqué ? Partage d’écran 2 minutes !"
  >
    <WStep n={1}>
      Prompt d’architecture : <Pr>« Organise le code en 3 zones. Ajoute une vue Kanban générée depuis COLONNES et la fonction pure deplacerTicket(tickets, id, versStatut) qui applique R1 à R4 et renvoie {'{ ok, tickets, erreur }'}. Ne casse pas le backlog. »</Pr>
    </WStep>
    <WStep n={2}>
      Faites ajouter le panneau Auto-Tests avec les 6 tests T1–T6, puis <Strong>vérifiez dans le code</Strong> que chaque test appelle vraiment <Ic>deplacerTicket</Ic> (et non une copie de sa logique).
    </WStep>
    <WStep n={3}>
      <Strong>Test de mutation :</Strong> changez à la main la comparaison de la règle WIP (<Ic>&gt;=</Ic> ↔ <Ic>&gt;</Ic>). Un test doit passer au rouge ✗. Sinon, votre filet a un trou : faites écrire le test manquant, puis rétablissez.
    </WStep>
  </VibeLab>
);

const M8_QCM: Page = () => (
  <Frame mod={8} kind="qcm">
    <Title>QCM · Les pièges des listes d’objets et des tests</Title>
    <QuizSeries y={190}>
      <QuizQ
        q={
          <>
            Qu’affiche la console ?
            <QCode>{`const backlog = [{ titre: "B", points: 8 }, { titre: "A", points: 2 }];\nconst tries = backlog.sort((a, b) => a.points - b.points);\nconsole.log(backlog[0].titre);`}</QCode>
          </>
        }
        explain=".sort() trie le tableau d’origine sur place, contrairement à .filter(). backlog est donc réordonné partout. Pour trier sans toucher l’original : [...backlog].sort(...)."
      >
        <QOpt>B</QOpt>
        <QOpt ok>A</QOpt>
        <QOpt>undefined</QOpt>
        <QOpt>Une erreur : on ne peut pas trier un const</QOpt>
      </QuizQ>
      <QuizQ
        q={
          <>
            tickets contient 5 tickets dont 1 terminé. Que se passe-t-il ?
            <QCode>{`const finis = tickets.filter(t => t.statut = "termine");`}</QCode>
          </>
        }
        explain="« = » affecte : chaque ticket reçoit le statut « termine », et la condition vaut un texte non vide (vrai). Un seul caractère manquant corrompt toutes les données."
      >
        <QOpt>finis contient 1 ticket</QOpt>
        <QOpt ok>finis contient 5 tickets, et les 5 tickets sont désormais « termine »</QOpt>
        <QOpt>finis est vide</QOpt>
        <QOpt>Erreur de syntaxe : la page ne charge pas</QOpt>
      </QuizQ>
      <QuizQ
        q={
          <>
            Après ces deux lignes, le ticket est-il modifié dans tickets ?
            <QCode>{`const enCours = tickets.filter(t => t.statut === "encours");\nenCours[0].statut = "termine";`}</QCode>
          </>
        }
        explain="filter crée un nouveau tableau, mais il contient les mêmes objets. Modifier enCours[0] modifie le ticket original : pratique, ou bug sournois si on croyait travailler sur une copie."
      >
        <QOpt>Non : filter a créé une copie indépendante</QOpt>
        <QOpt ok>Oui : le tableau est nouveau, mais les objets dedans sont les mêmes</QOpt>
        <QOpt>Non, et la ligne 2 provoque une erreur</QOpt>
        <QOpt>Oui, mais seulement après rechargement de la page</QOpt>
      </QuizQ>
      <QuizQ
        q={
          <>
            Les id des tickets sont des nombres. Que se passe-t-il au clic sur la carte ?
            <QCode>{`// <div class="carte" data-id="42">\nconst id = carte.dataset.id;\nconst ticket = tickets.find(t => t.id === id);\nticket.statut = "afaire";`}</QCode>
          </>
        }
        explain="dataset renvoie toujours du texte : « 42 » === 42 est faux, find ne trouve rien et renvoie undefined. Correctif : Number(carte.dataset.id), plus un garde-fou if (!ticket)."
      >
        <QOpt>Le ticket 42 passe « À faire »</QOpt>
        <QOpt ok>TypeError : impossible de modifier undefined</QOpt>
        <QOpt>Tous les tickets passent « À faire »</QOpt>
        <QOpt>Les tickets 4 et 2 sont modifiés</QOpt>
      </QuizQ>
      <QuizQ
        q={
          <>
            Cette règle WIP est fausse. Quel test la démasque ?
            <QCode>{`function peutEntrerEnCours(tickets) {\n  const n = tickets.filter(t => t.statut === "encours").length;\n  return n <= 3; // limite WIP : 3 maximum\n}`}</QCode>
          </>
        }
        explain="Avec 3 tickets déjà en cours, n <= 3 laisse entrer un 4e. Seul le test à la valeur limite exacte révèle l’erreur : à 0, 2 ou 5 tickets, tout reste au vert."
      >
        <QOpt>0 ticket en cours → doit répondre true</QOpt>
        <QOpt>2 tickets en cours → doit répondre true</QOpt>
        <QOpt ok>3 tickets en cours → doit répondre false</QOpt>
        <QOpt>5 tickets en cours → doit répondre false</QOpt>
      </QuizQ>
      <QuizQ
        q="Quelle version de deplacer est la plus facile à vérifier par un auto-test ?"
        explain="B est pure : mêmes entrées → même résultat, sans lire l’écran ni rien modifier. Le test compare simplement le tableau renvoyé. A, C et D dépendent du DOM ou de l’utilisateur."
      >
        <QOpt><Ic>deplacer(id, statut)</Ic> : modifie l’objet trouvé puis appelle <Ic>afficherTableau()</Ic></QOpt>
        <QOpt ok><Ic>deplacer(tickets, id, statut)</Ic> : renvoie <Ic>tickets.map(...)</Ic> avec le ticket mis à jour</QOpt>
        <QOpt><Ic>deplacer()</Ic> : demande l’id avec <Ic>prompt("Id ?")</Ic>, puis met à jour la carte</QOpt>
        <QOpt><Ic>deplacer(e)</Ic> : déplace l’élément HTML <Ic>e.target</Ic> dans la colonne voisine</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M8_Dejeuner: Page = () => <Pause mod={8} title="Pause déjeuner" back="Reprise à 14 h 00" minutes={90} />;

// ════════════════════════════════════════════════════════════════════════════
// MODULE 9 — Données JSON / CSV & Visualisations légères (9 pages)
// ════════════════════════════════════════════════════════════════════════════
const M9_Divider: Page = () => (
  <Divider mod={9} kicker="Jour 2 · Après-midi" title="Données JSON / CSV, affichage formaté et visualisations">
    <Bullet size={30}>Comprendre et convertir des données JSON et CSV avec l’IA</Bullet>
    <Bullet size={30}>Charger, importer et exporter des données dans sa mini-app</Bullet>
    <Bullet size={30}>Importer un backlog piégé et piloter avec un tableau de bord</Bullet>
  </Divider>
);
M9_Divider.transition = BLOOM;

const M9_FormatsJsonCsv: Page = () => (
  <Frame mod={9} kind="cours" beats={1}>
    <Title>JSON et CSV : les deux formats universels pour vos données</Title>
    <Lede>Que vos données viennent d’Excel ou d’une autre application, elles voyagent sous l’une de ces deux formes.</Lede>
    <Grid top={255} cols={2} gap={28}>
      <Card title="1 · Le format CSV (le cousin d’Excel)" icon="grid" tone="teal" d={100} bsz={21}>
        <Tag tone="teal" size={16}>1 ligne = 1 enregistrement · virgules entre colonnes</Tag>
        <Code
          size={19}
          style={{ marginTop: 10 }}
          code={`titre,categorie,budget,statut\nRefonte site,Web,1200,En cours\nAtelier IA,Formation,800,Terminé\nAudit RGPD,Sécurité,600,À faire`}
        />
        <div style={{ marginTop: 10 }}>Très compact, s’ouvre directement dans Excel ou Google Sheets.</div>
      </Card>
      <Card title="2 · Le format JSON (le cousin des objets JS)" icon="code" tone="blue" d={220} bsz={21}>
        <Tag tone="blue" size={16}>Tableau d’objets avec clés entre guillemets</Tag>
        <Code
          size={19}
          style={{ marginTop: 10 }}
          code={`[\n  { "titre": "Refonte site", "categorie": "Web", "budget": 1200 },\n  { "titre": "Atelier IA", "categorie": "Formation", "budget": 800 }\n]`}
        />
        <div style={{ marginTop: 10 }}>Directement compris par JavaScript grâce à <Ic>JSON.parse()</Ic> !</div>
      </Card>
    </Grid>
    <Box x={120} y={760} w={1680}>
      <Callout tone="violet" icon="sparkles" title="L’IA est un traducteur instantané CSV ↔ JSON" cls={b.on(1)} size={24}>
        Collez 10 lignes d’un tableau fictif à ChatGPT, Claude ou Gemini : il vous génère le JSON propre et prêt à intégrer dans votre mini-application en 3 secondes.
      </Callout>
    </Box>
  </Frame>
);

const M9_PromptsDonnees: Page = () => (
  <Frame mod={9} kind="cours" beats={2}>
    <Title>Utiliser l’IA pour générer ou convertir des jeux de données de test</Title>
    <Lede>Une application paraît tout de suite professionnelle quand elle tourne avec 15 données réalistes plutôt que « Test 1, Test 2 ».</Lede>
    <Box x={120} y={255} w={1680} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Bubble who="vous" tool="Prompt 1 · Générer un jeu de données fictif réaliste" d={100} size={22}>
        Génère un tableau JSON de <Strong>12 demandes d’assistance informatique réalistes mais 100 % fictives</Strong> avec les clés : <Ic>id</Ic> (nombre), <Ic>titre</Ic> (texte court), <Ic>service</Ic> ("RH", "Comptabilité", "Accueil" ou "Logistique"), <Ic>priorite</Ic> ("Haute", "Moyenne", "Basse"), <Ic>delaiHeures</Ic> (nombre entre 1 et 48) et <Ic>resolu</Ic> (booléen).
      </Bubble>
      <div className={b.on(1)}>
        <Bubble who="vous" tool="Prompt 2 · Convertir un CSV en JSON vérifié" size={22}>
          Convertis ces lignes CSV en tableau JSON valide. Convertis les nombres en vrais nombres (sans guillemets) et <Ic>"oui"/"non"</Ic> en booléens <Ic>true/false</Ic>.
        </Bubble>
      </div>
    </Box>
    <Box x={120} y={695} w={1680}>
      <Callout tone="coral" icon="shield" title="Règle absolue RGPD & confidentialité" cls={b.on(2)} size={24}>
        Ne collez <Strong c={C.coral}>jamais un vrai fichier CSV d’entreprise</Strong> (noms de clients, salaires, emails) dans un outil IA : donnez uniquement <Strong>les noms des colonnes</Strong> et demandez à l’IA d’inventer des lignes fictives !
      </Callout>
    </Box>
  </Frame>
);

const M9_ChargerExporter: Page = () => (
  <Frame mod={9} kind="cours" beats={1}>
    <Title>Importer et exporter des fichiers JSON / CSV dans votre UI</Title>
    <Lede>En une consigne, votre mini-application peut lire un fichier choisi sur votre ordinateur ou télécharger vos données.</Lede>
    <Grid top={255} cols={2} gap={28}>
      <Card title="Transformer le texte du fichier en objets" icon="upload" tone="blue" d={100} bsz={21}>
        <Code
          size={19}
          style={{ marginTop: 8 }}
          code={`// Si c’est un fichier .json :\nlet donnees = JSON.parse(texteDuFichier);\n\n// Si c’est un fichier .csv :\nlet lignes = texteDuFichier.trim().split("\\n");\nlet colonnes = lignes[1].split(",");`}
        />
        <div style={{ marginTop: 12 }}>
          <Ic>JSON.parse</Ic> transforme le texte en vrai tableau d’objets manipulable par vos filtres.
        </div>
      </Card>
      <Card title="Ce qu’on demande d’ajouter dans l’UI" icon="download" tone="green" cls={b.on(1)} bsz={21}>
        <Col gap={12}>
          <div><Tag tone="blue" size={16}>1 · Jeu de démo pré-chargé</Tag> Pour que l’application soit remplie dès l’ouverture.</div>
          <div><Tag tone="teal" size={16}>2 · Bouton « Importer JSON / CSV »</Tag> Pour charger un fichier depuis son poste.</div>
          <div><Tag tone="green" size={16}>3 · Bouton « Exporter en JSON / CSV »</Tag> Pour télécharger ses données modifiées en un clic.</div>
        </Col>
      </Card>
    </Grid>
  </Frame>
);

const M9_SimDashboard: Page = () => {
  const [tab, setTab] = useState<'csv' | 'json' | 'ui'>('ui');
  return (
    <Frame mod={9} kind="demo">
      <Title>Simulateur : la même donnée vue en CSV, en JSON et en Dashboard UI</Title>
      <Lede>Cliquez sur les 3 onglets pour voir comment un fichier brut devient un tableau de bord visuel.</Lede>
      <Box x={120} y={250} w={1680} style={{ display: 'flex', gap: 14 }}>
        <Btn icon="grid" tone="teal" ghost={tab !== 'csv'} size={21} onClick={() => setTab('csv')}>
          1 · Vue fichier CSV brut
        </Btn>
        <Btn icon="code" tone="blue" ghost={tab !== 'json'} size={21} onClick={() => setTab('json')}>
          2 · Vue objets JSON (JSON.parse)
        </Btn>
        <Btn icon="chart" tone="violet" ghost={tab !== 'ui'} size={21} onClick={() => setTab('ui')}>
          3 · Rendu Dashboard &amp; Graphiques UI
        </Btn>
      </Box>
      <Box x={120} y={330} w={1680}>
        {tab === 'csv' ? (
          <Code
            file="projets.csv · Texte brut séparé par des virgules"
            size={23}
            code={`service,projets,budgetK,termine\nFormation,8,120,true\nProduit,12,240,false\nSupport,5,80,true\nMarketing,7,110,false`}
          />
        ) : tab === 'json' ? (
          <Code
            file="projets.json · Tableau d’objets structuré"
            size={21}
            code={`[\n  { "service": "Formation", "projets": 8,  "budgetK": 120, "termine": true },\n  { "service": "Produit",   "projets": 12, "budgetK": 240, "termine": false },\n  { "service": "Support",   "projets": 5,  "budgetK": 80,  "termine": true },\n  { "service": "Marketing", "projets": 7,  "budgetK": 110, "termine": false }\n]`}
          />
        ) : (
          <UiMock title="Dashboard de suivi des projets · Généré à partir des données" tool="KPI + Barres CSS" tone="violet">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <div style={{ background: T.blue.bg, borderRadius: 14, padding: '14px 18px' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.blue.fg }}>TOTAL PROJETS</div>
                <div style={{ fontFamily: display, fontWeight: 800, fontSize: 38, color: C.navy }}>32 projets</div>
              </div>
              <div style={{ background: T.violet.bg, borderRadius: 14, padding: '14px 18px' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.violet.fg }}>BUDGET CUMULÉ</div>
                <div style={{ fontFamily: display, fontWeight: 800, fontSize: 38, color: C.violet }}>550 k€</div>
              </div>
              <div style={{ background: T.green.bg, borderRadius: 14, padding: '14px 18px' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.green.fg }}>SERVICES AU VERT</div>
                <div style={{ fontFamily: display, fontWeight: 800, fontSize: 38, color: T.green.fg }}>2 / 4 ✓</div>
              </div>
            </div>
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { s: 'Produit (12 projets)', w: '100%', v: '240 k€', t: 'blue' as Tone },
                { s: 'Formation (8 projets)', w: '50%', v: '120 k€', t: 'green' as Tone },
                { s: 'Marketing (7 projets)', w: '46%', v: '110 k€', t: 'violet' as Tone },
                { s: 'Support (5 projets)', w: '33%', v: '80 k€', t: 'teal' as Tone },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ width: 250, fontSize: 20, fontWeight: 700, color: C.ink }}>{b.s}</span>
                  <div style={{ flex: 1, height: 24, borderRadius: 8, background: C.panel, overflow: 'hidden' }}>
                    <div style={{ width: b.w, height: '100%', background: STRONG[b.t] }} />
                  </div>
                  <span style={{ width: 90, textAlign: 'right', fontFamily: display, fontWeight: 800, fontSize: 20, color: C.navy }}>{b.v}</span>
                </div>
              ))}
            </div>
          </UiMock>
        )}
      </Box>
    </Frame>
  );
};

const M9_SpecV3: Page = () => (
  <Frame mod={9} kind="tp" beats={1}>
    <Title>TaskFlow v3 · Importer un backlog piégé, piloter avec un tableau de bord</Title>
    <Lede>Le chef de projet vous envoie l’export CSV de son ancien outil. Réaliste, donc piégé : à vous de trouver où.</Lede>
    <Box x={120} y={255} w={960}>
      <Code
        file="backlog-import.csv · fichier complet collé dans le clavardage"
        size={20}
        code={`id,titre,type,priorite,points,statut\n21,"Corriger le login, page d’accueil",bug,1,3,afaire\n22,Export PDF des factures,Story ,2,8,backlog\n23,,tache,3,2,backlog\n24,Notifications e-mail,story,2,?,backlog\n21,Tableau de bord client,story,1,5,encours\n25,Audit accessibilité,tache,4,3,backlog`}
      />
      <div className={b.on(1)} style={{ marginTop: 18 }}>
        <Callout tone="green" icon="checkCircle" title="Rapport d’import attendu, au caractère près" size={22}>
          <Strong c={C.green}>4 importés · 2 rejetés</Strong>, chaque rejet affiché avec son numéro de ligne et son motif.
        </Callout>
      </div>
    </Box>
    <Box x={1120} y={255} w={680} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card title="Règles d’import (Zone 2)" icon="filter" tone="teal" d={150} bsz={19} pad={20}>
        <Col gap={8}>
          <div><Strong c={C.teal}>I1</Strong> Respecter les guillemets : une virgule dans un titre ne décale rien.</div>
          <div><Strong c={C.teal}>I2</Strong> Normaliser : « Story␣ » → <Ic>"story"</Ic>, points « ? » → <Ic>null</Ic>.</div>
          <div><Strong c={C.teal}>I3</Strong> Rejeter avec motif : titre vide, priorité hors 1–3, type inconnu.</div>
          <div><Strong c={C.teal}>I4</Strong> Id déjà pris : nouvel id, ne jamais écraser un ticket.</div>
          <div><Strong c={C.teal}>I5</Strong> Afficher le rapport d’import dans l’interface.</div>
        </Col>
      </Card>
      <Card title="Tableau de bord en direct" icon="gauge" tone="violet" d={260} bsz={19} pad={20}>
        <Col gap={8}>
          <div>KPI : points terminés / total, % d’avancement, WIP « 2 / 3 », non estimés.</div>
          <div>Barres : points par colonne, recalculées à chaque déplacement.</div>
          <div>Export JSON → Import JSON : <Strong c={C.violet}>aller-retour sans aucune perte</Strong>.</div>
        </Col>
      </Card>
    </Box>
  </Frame>
);

const M9_Lab9: Page = () => (
  <VibeLab
    mod={9}
    n="9.1"
    title="TaskFlow v3 · Import CSV robuste, export JSON et pilotage"
    defi="inspecter"
    objective={
      <>
        Ajouter à TaskFlow un <strong>import CSV qui résiste au fichier piégé</strong> (rapport exact), un <strong>export / import JSON sans perte</strong> et un tableau de bord qui se recalcule à chaque déplacement.
      </>
    }
    minutes={35}
    crit={
      <>
        <CheckItem id="m9l9a">Le fichier piégé donne exactement « 4 importés · 2 rejetés », avec les motifs</CheckItem>
        <CheckItem id="m9l9b">« Corriger le login, page d’accueil » garde son titre complet et le type bug</CheckItem>
        <CheckItem id="m9l9c">Aucun id en double après l’import (le second 21 a reçu un nouvel id)</CheckItem>
        <CheckItem id="m9l9d">Export → Réinitialiser → Import JSON redonne un tableau identique</CheckItem>
      </>
    }
    suivi="Points d’étape au micro à 15 min (rapport d’import) et à 30 min (tableau de bord). Bloqué ? Partage d’écran 2 minutes !"
  >
    <WStep n={1}>
      Avant de coder : <Pr>« Liste tous les pièges de ce CSV et la règle de traitement de chacun. »</Pr> Comparez sa liste aux règles I1–I5 : quel piège l’IA a-t-elle oublié ?
    </WStep>
    <WStep n={2}>
      Faites générer <Ic>parserCSV(texte)</Ic> et <Ic>importerTickets(lignes, existants)</Ic> en fonctions pures (Zone 2), avec le rapport d’import, puis le bouton Importer. Ajoutez 2 auto-tests sur le fichier piégé.
    </WStep>
    <WStep n={3}>
      Ajoutez les KPI et les barres par colonne, puis faites l’aller-retour <Strong>Export JSON → Réinitialiser → Import JSON</Strong>. Enregistrez <PathChip>taskflow-v3.html</PathChip>.
    </WStep>
  </VibeLab>
);

const M9_Pause: Page = () => <Pause mod={9} title="Pause après-midi" back="Reprise dans 15 minutes" minutes={15} />;

// ════════════════════════════════════════════════════════════════════════════
// MODULE 10 — TP Jour 2 : Mini-projet données avec sauvegarde (7 pages)
// ════════════════════════════════════════════════════════════════════════════
const M10_Divider: Page = () => (
  <Divider mod={10} kicker="Jour 2 · TP Fil Rouge" title="TP Jour 2 : TaskFlow devient un vrai Kanban">
    <Bullet size={30}>Glisser-déposer natif, sans casser les règles métier</Bullet>
    <Bullet size={30}>Une sauvegarde versionnée qui survit aux évolutions du projet</Bullet>
    <Bullet size={30}>Le twist du Product Owner : faire évoluer sans régression</Bullet>
  </Divider>
);
M10_Divider.transition = BLOOM;

type KCol = 'backlog' | 'afaire' | 'encours' | 'termine';
const M10_COLS: { id: KCol; titre: string; wip: number | null; tone: Tone }[] = [
  { id: 'backlog', titre: 'Backlog', wip: null, tone: 'grey' },
  { id: 'afaire', titre: 'À faire', wip: null, tone: 'blue' },
  { id: 'encours', titre: 'En cours', wip: 3, tone: 'violet' },
  { id: 'termine', titre: 'Terminé', wip: null, tone: 'green' },
];
type KTicket = { id: number; titre: string; type: 'story' | 'bug' | 'tache'; priorite: number; points: number | null; statut: KCol };
const M10_DEMO: KTicket[] = [
  { id: 1, titre: 'Connexion SSO', type: 'story', priorite: 1, points: 5, statut: 'encours' },
  { id: 2, titre: 'Login KO sur mobile', type: 'bug', priorite: 1, points: 3, statut: 'encours' },
  { id: 3, titre: 'Export PDF des factures', type: 'story', priorite: 2, points: 8, statut: 'encours' },
  { id: 4, titre: 'Page profil client', type: 'story', priorite: 2, points: 3, statut: 'afaire' },
  { id: 5, titre: 'Script de migration', type: 'tache', priorite: 3, points: 2, statut: 'afaire' },
  { id: 6, titre: 'Notifications e-mail', type: 'story', priorite: 2, points: null, statut: 'backlog' },
  { id: 7, titre: 'Audit accessibilité', type: 'tache', priorite: 3, points: 5, statut: 'backlog' },
  { id: 8, titre: 'Maquettes tableau de bord', type: 'tache', priorite: 1, points: 2, statut: 'termine' },
];

// Same rules as the participants' deplacerTicket(): pure, returns { ok, tickets | erreur }
const deplacerTicket = (tickets: KTicket[], id: number, vers: KCol): { ok: true; tickets: KTicket[] } | { ok: false; erreur: string } => {
  const t = tickets.find((x) => x.id === id);
  if (!t) return { ok: false, erreur: `Ticket ${id} introuvable` };
  if (t.statut === vers) return { ok: true, tickets };
  if (t.points === null && vers !== 'backlog') return { ok: false, erreur: 'Definition of Ready : estimez le ticket avant de le sortir du Backlog' };
  const col = M10_COLS.find((c) => c.id === vers);
  const n = tickets.filter((x) => x.statut === vers).length;
  if (col?.wip && n >= col.wip) return { ok: false, erreur: `WIP atteint (${n}/${col.wip}) : terminez un ticket avant d’en commencer un autre` };
  return { ok: true, tickets: tickets.map((x) => (x.id === id ? { ...x, statut: vers } : x)) };
};

const M10_SimKanban: Page = () => {
  const [tickets, setTickets] = useState<KTicket[]>(M10_DEMO);
  const [over, setOver] = useState<KCol | null>(null);
  const [last, setLast] = useState<{ call: string; res: string; ok: boolean } | null>(null);
  const drop = (id: number, vers: KCol) => {
    const r = deplacerTicket(tickets, id, vers);
    setLast({ call: `deplacerTicket(tickets, ${id}, "${vers}")`, res: r.ok ? '{ ok: true, tickets: [...] }' : `{ ok: false, erreur: "${r.erreur.split(' :')[0]}" }`, ok: r.ok });
    if (r.ok) setTickets(r.tickets);
  };
  const pts = (c: KCol) => tickets.filter((t) => t.statut === c).reduce((s, t) => s + (t.points ?? 0), 0);
  const total = tickets.reduce((s, t) => s + (t.points ?? 0), 0);
  return (
    <Frame mod={10} kind="demo">
      <Title>Démo : le Kanban cible, règles comprises</Title>
      <Lede>Dites-moi où déplacer chaque carte, je la glisse. Tentez un 4e ticket « En cours », ou de sortir un ticket non estimé.</Lede>
      <div data-osd-interactive style={{ position: 'absolute', left: 120, top: 250, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 20 }}>
        {M10_COLS.map((c) => {
          const items = tickets.filter((t) => t.statut === c.id).sort((a, b) => a.priorite - b.priorite);
          const full = c.wip !== null && items.length >= c.wip;
          return (
            <div
              key={c.id}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(c.id);
              }}
              onDragLeave={() => setOver((o) => (o === c.id ? null : o))}
              onDrop={(e) => {
                e.preventDefault();
                setOver(null);
                drop(Number(e.dataTransfer.getData('text/plain')), c.id);
              }}
              style={{
                height: 480,
                boxSizing: 'border-box',
                borderRadius: 18,
                padding: 14,
                background: over === c.id ? T[c.tone].bg : C.panel,
                boxShadow: over === c.id ? `inset 0 0 0 3px ${STRONG[c.tone]}` : 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                transition: `all 160ms ${EASE}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 6px 4px' }}>
                <span style={{ fontFamily: display, fontWeight: 800, fontSize: 23, color: C.navy }}>{c.titre}</span>
                <Tag tone={full ? 'coral' : c.tone} size={15}>
                  {c.wip ? `WIP ${items.length} / ${c.wip}` : `${items.length}`} · {pts(c.id)} pts
                </Tag>
              </div>
              {items.map((t) => (
                <div
                  key={t.id}
                  draggable
                  data-osd-interactive
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', String(t.id));
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  className={A.pop}
                  style={{
                    background: C.card,
                    borderRadius: 12,
                    padding: '10px 14px',
                    boxShadow: SHADOW_SM,
                    borderLeft: `5px solid ${t.type === 'bug' ? C.coral : t.type === 'story' ? C.blue : C.teal}`,
                    cursor: 'grab',
                    userSelect: 'none',
                  }}
                >
                  <div style={{ fontSize: 19, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{t.titre}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    <Tag tone={t.priorite === 1 ? 'coral' : t.priorite === 2 ? 'yellow' : 'grey'} size={14}>P{t.priorite}</Tag>
                    <Tag tone={t.points === null ? 'coral' : 'blue'} size={14}>{t.points === null ? '? pts' : `${t.points} pts`}</Tag>
                    <Tag tone="grey" size={14}>{t.type}</Tag>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <Box x={120} y={760} w={1680} style={{ display: 'flex', gap: 20, alignItems: 'stretch' }}>
        <div style={{ flex: 1, minWidth: 0, background: G.navy, borderRadius: 16, padding: '14px 22px', fontFamily: mono, fontSize: 20, lineHeight: 1.5, color: CODE.txt }}>
          {last ? (
            <>
              <div>{highlight(last.call)}</div>
              <div style={{ color: last.ok ? '#7EE2B8' : '#FF8A8A' }}>→ {last.res}</div>
            </>
          ) : (
            <div style={{ color: CODE.com }}>// Chaque dépôt appelle la même fonction pure que les boutons ◀ ▶</div>
          )}
        </div>
        <div style={{ width: 300, flex: 'none', display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
          <div style={{ fontSize: 20, color: C.soft }}>
            Avancement : <strong style={{ fontFamily: display, fontSize: 28, color: C.green }}>{fr((pts('termine') / total) * 100)} %</strong> des points
          </div>
          <Btn
            icon="reset"
            ghost
            tone="grey"
            size={19}
            onClick={() => {
              setTickets(M10_DEMO);
              setLast(null);
            }}
          >
            Réinitialiser la démo
          </Btn>
        </div>
      </Box>
    </Frame>
  );
};

const M10_DragDrop: Page = () => (
  <Frame mod={10} kind="cours" beats={2}>
    <Title>Le glisser-déposer natif : trois événements, trois pièges</Title>
    <Lede>Aucune bibliothèque nécessaire : le navigateur sait déjà le faire. Mais l’IA oublie souvent un des trois pièges.</Lede>
    <Box x={120} y={255} w={1000}>
      <Code
        file="Zone 3 · Brancher le glisser-déposer"
        size={19}
        hi={[5, 8, 9]}
        code={`carte.draggable = true;\ncarte.addEventListener("dragstart", (e) =>\n  e.dataTransfer.setData("text/plain", ticket.id));\n\ncolonne.addEventListener("dragover", (e) => e.preventDefault());\n\ncolonne.addEventListener("drop", (e) => {\n  const id = Number(e.dataTransfer.getData("text/plain"));\n  const r = deplacerTicket(tickets, id, colonne.dataset.statut);\n  if (!r.ok) return afficherErreur(r.erreur);\n  tickets = r.tickets;\n  sauvegarder(tickets);\n  afficherTableau();\n});`}
      />
    </Box>
    <Box x={1160} y={255} w={640} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card title="Piège 1 · Le dépôt ne se déclenche jamais" icon="alert" tone="coral" d={150} bsz={19} pad={18}>
        Sans <Ic>e.preventDefault()</Ic> sur <Ic>dragover</Ic>, le navigateur refuse le dépôt : la carte revient à sa place, sans aucune erreur.
      </Card>
      <Card title="Piège 2 · L’id revient en texte" icon="alert" tone="coral" cls={b.on(1)} bsz={19} pad={18}>
        <Ic>getData</Ic> renvoie toujours du texte : sans <Ic>Number(...)</Ic>, <Ic>find</Ic> ne trouve rien.
      </Card>
      <Card title="Piège 3 · Le dépôt contourne les règles" icon="shield" tone="violet" cls={b.on(2)} bsz={19} pad={18}>
        Le dépôt n’est qu’un autre bouton : il <Strong c={C.violet}>doit</Strong> passer par <Ic>deplacerTicket</Ic>, sinon la limite WIP saute.
      </Card>
    </Box>
    <Box x={120} y={800} w={1680}>
      <Callout tone="blue" icon="key" title="Gardez les boutons ◀ ▶ de la v2" d={300} size={22}>
        Le glisser-déposer ne marche ni au clavier ni sur tous les écrans tactiles : les boutons restent l’alternative accessible, branchés sur la même fonction.
      </Callout>
    </Box>
  </Frame>
);

const M10_LocalStorage: Page = () => (
  <Frame mod={10} kind="cours" beats={2}>
    <Title>Une sauvegarde qui survit aux évolutions : localStorage versionné</Title>
    <Lede>Sauvegarder est facile. Recharger des données écrites par une ancienne version de votre application, beaucoup moins.</Lede>
    <Box x={120} y={255} w={1000}>
      <Code
        file="Zone 1 · Sauvegarder et charger"
        size={19}
        hi={[3, 7, 10, 13]}
        code={`const CLE = "taskflow";\nfunction sauvegarder(tickets) {\n  localStorage.setItem(CLE, JSON.stringify({ version: 2, tickets }));\n}\nfunction charger() {\n  try {\n    const brut = JSON.parse(localStorage.getItem(CLE));\n    if (!brut) return DEMO;               // premier lancement\n    if (Array.isArray(brut))              // format v1 : tableau nu\n      return migrerV1versV2(brut);\n    return brut.tickets;\n  } catch {\n    return DEMO;                          // donnée corrompue\n  }\n}`}
      />
    </Box>
    <Box x={1160} y={255} w={640} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card title="1 · Une enveloppe versionnée" icon="save" tone="blue" d={150} bsz={19} pad={18}>
        On ne sauvegarde pas un tableau nu mais <Ic>{'{ version, tickets }'}</Ic> : l’application sait toujours qui a écrit la donnée.
      </Card>
      <Card title="2 · Une migration explicite" icon="loop" tone="violet" cls={b.on(1)} bsz={19} pad={18}>
        Nouveau champ ? <Ic>migrerV1versV2</Ic> le complète avec une valeur par défaut, au lieu de laisser des <Ic>undefined</Ic> partout.
      </Card>
      <Card title="3 · Un plan B si la donnée est corrompue" icon="shield" tone="green" cls={b.on(2)} bsz={19} pad={18}>
        <Ic>try / catch</Ic> + bouton « Réinitialiser la démo » : jamais d’écran blanc au démarrage.
      </Card>
    </Box>
  </Frame>
);

const M10_LabTP2: Page = () => (
  <VibeLab
    mod={10}
    n="TP 2"
    kind="tp"
    title="Phase 1 · Glisser-déposer et sauvegarde (0–30 min)"
    defi="construire"
    objective={
      <>
        Faire de TaskFlow v3 un <strong>Kanban complet</strong> : cartes déplaçables entre colonnes, règles R1–R4 respectées au dépôt, et données qui <strong>survivent au rechargement</strong> grâce à la sauvegarde versionnée.
      </>
    }
    minutes={30}
    crit={
      <>
        <CheckItem id="tp2a">Un dépôt interdit (WIP, ticket non estimé) est refusé avec le même message qu’avec ◀ ▶</CheckItem>
        <CheckItem id="tp2b">Après F5, cartes, colonnes et filtres actifs sont restaurés</CheckItem>
        <CheckItem id="tp2c">Une valeur corrompue dans localStorage n’affiche pas d’écran blanc</CheckItem>
        <CheckItem id="tp2d">Les auto-tests restent au vert, dont un nouveau test de charger()</CheckItem>
      </>
    }
    suivi="Points d’étape au micro à 15 min (le dépôt fonctionne) et à 30 min (twist). Bloqué ? Partage d’écran 2 minutes !"
  >
    <WStep n={1}>
      <Strong>Minutes 0–12 ·</Strong> Faites brancher le glisser-déposer natif sur <Ic>deplacerTicket</Ic> (aucune bibliothèque), avec la colonne survolée en surbrillance. Vérifiez les 3 pièges dans le code.
    </WStep>
    <WStep n={2}>
      <Strong>Minutes 12–24 ·</Strong> Sauvegarde versionnée <Ic>{'{ version: 2, tickets }'}</Ic> à chaque modification, chargement protégé par <Ic>try/catch</Ic>, bouton « Réinitialiser la démo ».
    </WStep>
    <WStep n={3}>
      <Strong>Minutes 24–30 · Sabotage :</Strong> dans les outils de développement (F12 → Application → Local Storage), remplacez la valeur par <Ic>{'{oups'}</Ic> puis rechargez. L’application doit redémarrer proprement. Enregistrez <PathChip>taskflow-v4.html</PathChip>.
    </WStep>
  </VibeLab>
);

const M10_LabTwist: Page = () => (
  <Frame mod={10} kind="tp" beats={1}>
    <Title size={47}>
      <span style={{ color: C.green }}>Atelier TP 2</span> · Phase 2 : le Product Owner change le process !
    </Title>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 172, right: 120, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <Tag tone="pink" size={18} icon="rocket">Minutes 30–60</Tag>
      <Tag tone="violet" size={18} icon="sparkles">Faire évoluer sans régression</Tag>
      <Tag tone="grey" size={18} icon="user">Individuel · sur votre poste</Tag>
    </div>
    <Box x={120} y={234} w={1020}>
      <Card title="Minute 30 · Le message du Product Owner" icon="chat" tone="pink" d={100} tsz={25} bsz={21} pad={22}>
        <Col gap={10}>
          <div>
            <Tag tone="pink" size={17}>1</Tag> Une colonne <Strong>« En revue »</Strong> entre En cours et Terminé, <Strong>WIP 2</Strong>. On n’entre dans Terminé <Strong>que depuis</Strong> En revue.
          </div>
          <div>
            <Tag tone="pink" size={17}>2</Tag> Un champ <Ic>assigne</Ic> et un filtre « Mes tickets ». Les tickets sauvegardés hier n’ont pas ce champ : ils doivent se charger quand même.
          </div>
          <div>
            <Tag tone="pink" size={17}>3</Tag> Un journal des 10 derniers déplacements et un bouton <Strong>« Annuler »</Strong> le dernier.
          </div>
        </Col>
      </Card>
    </Box>
    <Box x={120} y={590} w={1020} cls={b.on(1)}>
      <Callout tone="violet" icon="bulb" title="Ce que ce twist met à l’épreuve" size={22}>
        Si vos colonnes sont bien générées depuis <Ic>COLONNES</Ic>, l’exigence 1 tient en <Strong c={C.violet}>une ligne de configuration plus une règle</Strong>. Si vos tableaux sont immuables, « Annuler » revient à <Strong c={C.violet}>restaurer l’état précédent</Strong>. Vos choix du matin paient maintenant.
      </Callout>
    </Box>
    <div style={{ position: 'absolute', left: 1180, top: 234, width: 620, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Timer id="tp2-twist" minutes={30} label="Phase 2 · Twist" compact cls={A.right} style={dl(150)} />
      <div className={A.right} style={{ ...dl(260), background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <Icon name="checkCircle" size={24} color={T.green.fg} />
          <Eyebrow c={T.green.fg} size={18}>Critères de réussite (à vérifier)</Eyebrow>
        </div>
        <Checklist style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <CheckItem id="tp2e">Un ticket « En cours » ne peut pas sauter directement dans « Terminé »</CheckItem>
          <CheckItem id="tp2f">Une sauvegarde v2 sans « assigne » se recharge sans erreur (migration v2 → v3)</CheckItem>
          <CheckItem id="tp2g">« Annuler » restaure exactement l’état précédent, y compris après F5</CheckItem>
          <CheckItem id="tp2h">Les anciens auto-tests passent encore et 2 nouveaux couvrent les exigences du PO</CheckItem>
        </Checklist>
      </div>
      <Note tone="yellow" icon="chat" label="Suivi en classe virtuelle" size={20} d={380}>
        Points d’étape au micro à 20:00 restantes (colonne « En revue ») et à 10:00 (migration). Bloqué ? Partage d’écran 2 minutes !
      </Note>
    </div>
  </Frame>
);

const M10_Restitution: Page = () => (
  <Frame mod={10} kind="tp" beats={1}>
    <Title>Restitution du Jour 2 : la démo qui ne pardonne pas</Title>
    <Lede>Partage d’écran individuel de 2 à 3 minutes. Le groupe vous dicte les déplacements, à vous de prouver que les règles tiennent.</Lede>
    <Box x={120} y={260} w={820}>
      <Card title="Le parcours de démo en 4 gestes" icon="play" tone="blue" d={100} bsz={22}>
        <Col gap={12}>
          <div><Strong>1.</Strong> Glissez une carte vers « En revue », puis tentez un dépôt interdit : le refus doit s’afficher.</div>
          <div><Strong>2.</Strong> Appuyez sur F5 : tout est encore là, y compris le filtre actif.</div>
          <div><Strong>3.</Strong> Cliquez « Annuler » : le dernier déplacement est défait.</div>
          <div><Strong>4.</Strong> Lancez les auto-tests et montrez <Ic>deplacerTicket</Ic> dans le code.</div>
        </Col>
        <div style={{ marginTop: 18 }}>
          <Timer id="restit-j2" minutes={3} />
        </div>
      </Card>
    </Box>
    <Box x={980} y={260} w={820}>
      <Card title="Grille de validation" icon="checkCircle" tone="green" d={220} bsz={22}>
        <Col gap={12}>
          <div><Strong c={C.green}>Données :</Strong> modèle de ticket respecté, import CSV robuste, aucun id en double.</div>
          <div><Strong c={C.green}>Règles :</Strong> WIP, Definition of Ready et passage par « En revue », au dépôt comme aux boutons.</div>
          <div><Strong c={C.green}>Persistance :</Strong> sauvegarde versionnée, migration, plan B si corruption.</div>
          <div><Strong c={C.green}>Fiabilité :</Strong> auto-tests sur les valeurs limites, test de mutation réussi.</div>
        </Col>
      </Card>
    </Box>
    <Box x={120} y={785} w={1680}>
      <Callout tone="pink" icon="star" title="Votre fichier taskflow-v4.html est prêt pour demain matin" cls={b.on(1)} size={24}>
        Gardez-le précieusement : demain, nous l’ouvrons dans <Strong c={C.violet}>VS Code</Strong>, nous le découpons en fichiers et nous le faisons évoluer avec des <Strong c={C.violet}>Agents</Strong> et des <Strong c={C.violet}>Skills</Strong>.
      </Callout>
    </Box>
  </Frame>
);

const M10_BilanJ2: Page = () => (
  <Takeaways mod={10} title="Bilan du Jour 2 : un vrai outil de gestion de projet, fiable et évolutif" lede="Vous n’avez pas empilé des démos : vous avez fait évoluer un même produit en quatre incréments, sans le casser.">
    <Bullet d={100}><Strong>Modéliser</Strong> : un ticket = un objet, un backlog = un tableau d’objets, des colonnes décrites par les données</Bullet>
    <Bullet d={200}><Strong>Manipuler sans casser</Strong> : <Ic>.filter</Ic>, <Ic>.find</Ic>, <Ic>.map</Ic> et <Ic>[...].sort</Ic>, sans jamais modifier l’original</Bullet>
    <Bullet d={300}><Strong>Prouver</Strong> : règles métier en fonctions pures, tests aux valeurs limites, test de mutation</Bullet>
    <Bullet d={400}><Strong>Importer avec méfiance</Strong> : CSV piégé, normalisation, rejets motivés, aller-retour JSON sans perte</Bullet>
    <Bullet d={500}><Strong>Durer</Strong> : glisser-déposer branché sur les règles, sauvegarde versionnée et migration</Bullet>
  </Takeaways>
);

const M10_SortieJ2: Page = () => (
  <Frame mod={10} kind="bilan">
    <Title>Billet de sortie du Jour 2</Title>
    <Lede>Tour rapide au micro (1 minute chacun, appelé par prénom).</Lede>
    <Grid top={265} cols={3} gap={26}>
      <Card title="1 · Le bug qui m’a le plus appris" icon="bug" tone="coral" d={100} bsz={24}>
        Le piège attrapé aujourd’hui : <Ic>.sort</Ic> qui modifie l’original, id en texte, limite WIP, CSV piégé…
      </Card>
      <Card title="2 · La décision qui a payé" icon="shield" tone="green" d={220} bsz={24}>
        Un choix du matin (colonnes en données, fonctions pures, tests) qui vous a sauvé pendant le twist.
      </Card>
      <Card title="3 · Ma prochaine fonctionnalité" icon="rocket" tone="violet" d={340} bsz={24}>
        Ce que vous ajouteriez à TaskFlow demain avec VS Code, les Agents et les Skills.
      </Card>
    </Grid>
    <Box x={120} y={710} w={1680}>
      <Callout tone="violet" icon="laptop" title="Demain · Jour 3 · TaskFlow passe dans VS Code" d={500} size={25}>
        Nous découvrons <Strong c={C.violet}>VS Code</Strong>, les modes <Strong>Ask / Edit / Agent</Strong> et une équipe de trois agents guidée par un Skill pour livrer une nouvelle fonctionnalité, puis TaskFlow part en ligne sur <Strong c={C.violet}>GitHub Pages</Strong>.
      </Callout>
    </Box>
  </Frame>
);

const PAGES_J2: Page[] = [J2_Cover, J2_QuizRappel, J2_FilRouge];
const PAGES_M7: Page[] = [M7_Divider, M7_ListesUI, M7_ObjetsUI, M7_TableauObjets, M7_Operations, M7_SimFilter, M7_TrierTrouver, M7_SpecV1, M7_Lab7, M7_Pause];
const PAGES_M8: Page[] = [M8_Divider, M8_Spaghetti, M8_NommageComm, M8_Decoupage3, M8_HotspotAudit, M8_IntroTests, M8_SimTestsUI, M8_SpecV2, M8_Lab8, M8_QCM, M8_Dejeuner];
const PAGES_M9: Page[] = [M9_Divider, M9_FormatsJsonCsv, M9_PromptsDonnees, M9_ChargerExporter, M9_SimDashboard, M9_SpecV3, M9_Lab9, M9_Pause];
const PAGES_M10: Page[] = [M10_Divider, M10_SimKanban, M10_DragDrop, M10_LocalStorage, M10_LabTP2, M10_LabTwist, M10_Restitution, M10_BilanJ2, M10_SortieJ2];

const NOTES_J2: string[] = [
  // J2_Cover
  `⏱ 8 min · OUVERTURE JOUR 2 & QUESTIONS DE LA VEILLE

OBJECTIF — Accueillir les participants, répondre aux questions de la veille et annoncer le projet unique de la journée : TaskFlow.

DIRE — « Bonjour à toutes et à tous, bienvenue dans ce deuxième jour ! Hier, vous avez créé une mini-application en une séance. Aujourd’hui, on change d’échelle : un seul projet toute la journée, TaskFlow, un vrai outil de gestion de projet avec backlog, Kanban, glisser-déposer et sauvegarde. Chaque atelier ajoute un incrément à votre version précédente. Avant de commencer, je réponds aux questions que vous avez laissées hier en billet de sortie. »

ANIMATION — Traiter les questions de la veille en direct. Vérifier son, caméra et accès à ChatGPT, Claude ou Gemini.

TRANSITION — « Réveillons les neurones : sept questions, et elles piquent. »`,
  // J2_QuizRappel
  `⏱ 10 min · QCM DE RÉACTIVATION · 7 PIÈGES DU JOUR 1

OBJECTIF — Réactiver le Jour 1 sur des pièges réels du code généré : concaténation texte + nombre, ordre des else if, fonction appelée au lieu d’être passée, borne de boucle, = au lieu de ===, const et objets, prompt de correction ciblé.

DIRE — « Sept questions, toutes tirées de bugs que l’IA produit vraiment. Lisez le code ligne par ligne avant de voter : la réponse intuitive est rarement la bonne. Votez à voix haute, A, B, C ou D. »

ANIMATION — Laisser 30 secondes de lecture par question avant le vote. Après chaque réponse, faire expliquer le piège par un volontaire avant de lire l’explication.
Q1 → « 105 » : .value renvoie du texte ; c’est le + qui colle.
Q2 → « Bronze » : la première condition vraie gagne ; on teste du plus haut au plus bas.
Q3 → verifier() s’exécute au chargement ; on passe verifier sans parenthèses.
Q4 → <= fait lire questions[3], undefined, d’où la TypeError.
Q5 → = affecte, la condition est toujours vraie : 5 points.
Q6 → const bloque la réaffectation, pas la modification de l’objet.
Q7 → symptôme + attendu + périmètre limité.

TRANSITION — « Ces pièges vont revenir toute la journée, sur un vrai projet. Je vous le présente. »`,
  // J2_FilRouge
  `⏱ 4 min · LE FIL ROUGE DU JOUR 2 : TASKFLOW

OBJECTIF — Donner la feuille de route des quatre incréments et le réflexe de versionnement.

DIRE — « Toute la journée, vous construisez TaskFlow, un outil de gestion de projet. Ce matin, la v1 : le backlog produit, trié et filtrable. Avant le déjeuner, la v2 : la vue Kanban, avec des règles métier testées comme la limite de travail en cours. Cet après-midi, la v3 : l’import d’un vrai fichier CSV piégé et un tableau de bord. Et au TP, la v4 : glisser-déposer, sauvegarde et une demande surprise du Product Owner. Chaque incrément repart du précédent. »

ANIMATION — Parcourir les quatre colonnes. → beat 1 : insister sur la sauvegarde des versions stables, taskflow-v1.html, v2, etc.

TRANSITION — « Pour construire le backlog, il nous faut la bonne structure de données : listes et objets. »`,
];

const NOTES_M7: string[] = [
  // M7_Divider
  `⏱ 1 min · MODULE 7

DIRE — « Module 7 : listes et objets. Comment passer d’une variable isolée à un mur complet de cartes filtrables et cherchables. »

TRANSITION — « Commençons par la liste, qu’on appelle aussi tableau en JavaScript. »`,
  // M7_ListesUI
  `⏱ 5 min · LES LISTES (TABLEAUX)

OBJECTIF — Reconnaître un tableau [...], ses indices à partir de 0, .length et .push().

DIRE — « Une liste s’écrit entre crochets. Chaque élément a un numéro de place — son indice — qui commence toujours à zéro : etapes[0] vaut Idée, etapes[3] vaut Démo. .length donne le nombre total d’éléments, et .push() ajoute un nouvel élément à la fin. »

ANIMATION — → beat 1 : .length et .push. → beat 2 : rappel sur le décalage de l’indice 0.

TRANSITION — « Mais que faire quand chaque carte contient plusieurs informations à la fois ? On utilise un objet. »`,
  // M7_ObjetsUI
  `⏱ 5 min · LES OBJETS { ... } CÔTÉ UI

OBJECTIF — Comprendre qu’un objet regroupe des paires clé:valeur qui correspondent aux zones d’une carte UI.

DIRE — « Regardez la correspondance entre la gauche et la droite : un objet s’écrit entre accolades avec des paires clé : valeur. titre, categorie, priorite, termine. Et sur la carte visuelle à droite, chaque propriété de l’objet pilote un badge ou un texte ! On lit une propriété avec le point : tache.titre, tache.priorite. »

ANIMATION — → beat 1 : encadré clé:valeur.

TRANSITION — « Et maintenant, combinons les deux : une liste d’objets ! »`,
  // M7_TableauObjets
  `⏱ 5 min · LE TABLEAU D’OBJETS

OBJECTIF — Comprendre la structure universelle [{...}, {...}] et le rôle de l’id.

DIRE — « Voici la structure reine de 99 % des applications web : un crochet ouvrant, et à l’intérieur une série d’objets. Chaque objet est une carte. Pour guider l’IA dans vos prompts, listez simplement les propriétés que vous voulez dans chaque objet, sans oublier un identifiant unique id qui permet de supprimer ou cocher la bonne carte ! »

ANIMATION — → beat 1 : rôle de l’identifiant id.

TRANSITION — « Quelles sont les 4 opérations que l’on fait tout le temps sur ce tableau d’objets ? »`,
  // M7_Operations
  `⏱ 5 min · LES 4 OPÉRATIONS REINES (.FILTER, .INCLUDES, .PUSH, .LENGTH)

OBJECTIF — Reconnaître .filter, .includes, .push et .length dans le code généré.

DIRE — « Quatre opérations suffisent pour faire vivre toute votre application : 1. .filter() pour garder uniquement les cartes d’une catégorie ou les urgences, 2. .includes() combiné à .toLowerCase() pour la barre de recherche instantanée, 3. .push() pour ajouter une carte depuis un formulaire, et 4. .length pour afficher les compteurs en haut de l’écran. »

ANIMATION — Parcourir les 4 cartes.

TRANSITION — « Manipulons .filter() en direct sur notre simulateur ! »`,
  // M7_SimFilter
  `⏱ 6 min · SIMULATEUR : FILTRER UN TABLEAU D’OBJETS EN DIRECT

OBJECTIF — Visualiser comment .filter() met à jour le mur de cartes sans détruire les données.

DIRE — « Cliquez avec moi sur les boutons en haut : Toutes, Urgentes uniquement, À faire, Terminées. Regardez la barre sombre à droite : vous voyez l’instruction JavaScript exacte taches.filter(...) et le nombre de cartes trouvées. Important : filtrer ne détruit jamais vos données, cela choisit simplement lesquelles afficher ! »

ANIMATION — Cliquer sur les 4 boutons de filtre et faire observer l’expression JavaScript correspondante.

TRANSITION — « Il nous manque trois opérations pour un outil de gestion de projet : trier, retrouver, modifier. »`,
  // M7_TrierTrouver
  `⏱ 6 min · TRIER, RETROUVER, MODIFIER : .SORT, .FIND, .MAP

OBJECTIF — Connaître les trois opérations d’un outil de gestion de projet et leurs pièges : .sort modifie l’original, .find peut renvoyer undefined, .map renvoie un nouveau tableau.

DIRE — « Trois opérations de plus, et toutes servent à chaque clic dans TaskFlow. .sort pour trier le backlog : attention, contrairement à .filter, il réordonne le tableau d’origine, d’où la copie avec les trois points. .find pour retrouver le ticket cliqué : s’il ne trouve rien, il renvoie undefined, et un id lu dans le HTML est toujours un texte. Et .map pour modifier un ticket en fabriquant un nouveau tableau : l’ancien reste intact, et c’est ce qui rendra vos tests et votre bouton Annuler possibles cet après-midi. »

ANIMATION — Parcourir les trois cartes. → beat 1 : la consigne à recopier dans tous les prompts.

TRANSITION — « Vous avez tout pour poser la v1 de TaskFlow. Voici son cahier. »`,
  // M7_SpecV1
  `⏱ 5 min · TASKFLOW V1 · CAHIER DE L’INCRÉMENT

OBJECTIF — Présenter le modèle de ticket imposé et les 5 user stories de la v1.

DIRE — « Le modèle de ticket est imposé, et vous le recopiez tel quel dans votre prompt : tous les incréments suivants en dépendent, notamment les statuts, qui deviendront les colonnes du Kanban. Cinq user stories : formulaire validé, backlog trié, filtres combinés, compteurs, suppression avec confirmation dans l’interface. Et voici les trois écarts que l’IA produit presque toujours : vérifiez-les en premier. »

ANIMATION — Pointer les lignes surlignées : type, points, statut. → beat 1 : les trois cas que l’IA rate. Coller le modèle de ticket dans le clavardage.

TRANSITION — « À vous : Atelier 7.1, trente-cinq minutes. »`,
  // M7_Lab7
  `⏱ 35 min · ATELIER VIBE 7.1 · TASKFLOW V1 · LE BACKLOG PRODUIT

OBJECTIF — Obtenir un backlog conforme au modèle, puis débusquer et corriger chaque écart par un prompt ciblé.

DIRE — « Trente-cinq minutes, individuellement. Complétez les trous du prompt : c’est vous qui décidez du projet et des tris. Ensuite, testez les cinq user stories une par une, comme un testeur, et notez chaque écart. Règle d’or : un écart, un prompt, avec le symptôme et le résultat attendu. Pour finir, ajoutez vous-même un ticket dans le code : s’il ne remonte pas en tête, votre tri est faux. »

ANIMATION — Lancer le minuteur de 35 minutes. Coller le prompt à trous et le modèle de ticket dans le clavardage. Points d’étape à 15 min (« La v1 tourne-t-elle ? ») et 30 min (« Combien d’écarts trouvés ? »). Rappeler d’enregistrer taskflow-v1.html.

TRANSITION — « Quinze minutes de pause. »`,
  // M7_Pause
  `⏱ 15 min · PAUSE MATIN

DIRE — « Quinze minutes de pause. À la reprise : comment garder un code propre et intégrer un panneau d’auto-tests dans votre interface ! »

ANIMATION — Lancer le minuteur de 15 minutes.`,
];

const NOTES_M8: string[] = [
  // M8_Divider
  `⏱ 1 min · MODULE 8

DIRE — « Module 8 : bonnes pratiques débutant et introduction aux tests simples. C’est le module qui fait la différence entre un jouet qui casse au bout de dix minutes et une application fiable. »

TRANSITION — « Pourquoi tant de projets en Vibe Coding finissent-ils par se bloquer ? »`,
  // M8_Spaghetti
  `⏱ 5 min · ÉVITER LE CODE SPAGHETTI

OBJECTIF — Comprendre pourquoi il faut imposer une structure et des tests à l’IA.

DIRE — « Quand on enchaîne dix prompts sans règle, le code devient un plat de spaghettis : variables mal nommées, calculs mélangés à l’affichage, si bien que corriger un bouton casse la recherche. Nos trois garde-fous sont simples : des noms explicites, un découpage en 3 zones, et de petits tests automatiques. Et la bonne nouvelle, c’est que l’IA applique cette discipline dès qu’on la lui demande ! »

ANIMATION — → beat 1 : les 3 garde-fous. → beat 2 : encadré bleu.

TRANSITION — « Regardons d’abord le nommage et les commentaires. »`,
  // M8_NommageComm
  `⏱ 5 min · NOMMAGE EXPLICITE & COMMENTAIRES

OBJECTIF — Comparer un code opaque et un code explicite commenté.

DIRE — « Comparez gauche et droite : c’est exactement le même calcul. À gauche, calc(arr), x.d, x.p : personne ne sait si x.d veut dire “dépense” ou “déjà payé”. À droite, calculerResteAPayer(depenses) et depense.estReglee === false : tout est limpide, pour vous comme pour l’IA lors des prochains prompts ! »

ANIMATION — → beat 1 : version lisible et commentée à droite.

TRANSITION — « Deuxième garde-fou : le découpage en 3 zones. »`,
  // M8_Decoupage3
  `⏱ 5 min · DÉCOUPER EN 3 ZONES CLAIRES

OBJECTIF — Apprendre à demander à l’IA les 3 sections : 1. Données, 2. Fonctions métier, 3. Affichage UI.

DIRE — « Dans toutes vos applications, demandez à l’IA de séparer le JavaScript en trois zones bien visibles avec des commentaires : Zone 1 en haut pour les données et l’état, Zone 2 au milieu pour les fonctions métier qui calculent et filtrent, et Zone 3 en bas pour l’affichage HTML. Ainsi, vous savez toujours où regarder ! »

ANIMATION — → beat 1 : la phrase exacte à copier dans ses prompts.

TRANSITION — « Entraînons notre œil avec un jeu d’audit en 4 Hotspots ! »`,
  // M8_HotspotAudit
  `⏱ 7 min · JEU D’AUDIT : REPÉREZ LES 4 PIÈGES DE L’IA (HOTSPOTS)

OBJECTIF — Identifier 4 défauts classiques dans une fonction générée par l’IA (noms muets, condition parasite, division par zéro sur liste vide, absence de test).

DIRE — « Voici une fonction générée par une IA pour calculer la moyenne d’une liste de notes. Quatre défauts s’y cachent : qui en repère un à voix haute ? Puis je clique sur les pastilles 1 à 4 ! Regardez surtout le piège 3 : si la liste est vide, 0 divisé par 0 affiche NaN (Not a Number) en plein milieu de votre interface ! »

ANIMATION — Faire participer le groupe à l’oral, puis ouvrir les Hotspots 1, 2, 3 et 4.

TRANSITION — « Comment attraper ces bugs automatiquement sans tout vérifier à la main ? Avec des tests simples ! »`,
  // M8_IntroTests
  `⏱ 5 min · INTRODUCTION AUX TESTS SIMPLES

OBJECTIF — Comprendre le principe d’une assertion et les 3 familles de cas à tester.

DIRE — « Un test automatique, c’est une ligne qui vérifie : “quand je donne telle entrée à ma fonction, j’attends telle sortie”. On teste toujours trois choses : 1. le cas normal, 2. le cas limite (comme la liste vide []), et 3. un cas particulier. Et en Vibe Coding, on va même faire mieux : afficher ces tests directement dans notre interface ! »

ANIMATION — → beat 1 : l’astuce du panneau visuel d’Auto-Tests.

TRANSITION — « Voyons ce panneau d’Auto-Tests en action sur notre simulateur. »`,
  // M8_SimTestsUI
  `⏱ 6 min · SIMULATEUR : LE PANNEAU AUTO-TESTS INTÉGRÉ À L’UI

OBJECTIF — Montrer comment un panneau d’auto-tests visuel signale un bug sur cas limite et valide sa correction.

DIRE — « Regardez à droite le panneau Auto-Tests intégré à la mini-app : 3 tests sont verts, mais le Test 3 sur la liste vide [] est Rouge ✗ parce que la fonction renvoie NaN ! Je clique maintenant sur le bouton pour ajouter le garde-fou if (notes.length === 0) return 0 : instantanément, la ligne 2 s’ajoute et nos 4 tests passent au Vert ✓ ! »

ANIMATION — Cliquer sur le bouton « Demander à l’IA de corriger le Test 3 » pour montrer le passage de 3/4 (Rouge) à 4/4 (Vert).

TRANSITION — « Appliquons tout cela à TaskFlow : la v2 passe en Kanban, avec des règles testées. »`,
  // M8_SpecV2
  `⏱ 5 min · TASKFLOW V2 · KANBAN ET RÈGLES TESTÉES

OBJECTIF — Présenter la vue Kanban pilotée par COLONNES, la fonction pure deplacerTicket, les règles R1 à R4 et les 6 auto-tests.

DIRE — « Même tableau d’objets, autre affichage : une colonne par statut. Les colonnes ne sont pas écrites en dur dans le HTML, elles viennent d’un tableau COLONNES : retenez-le, ce choix vous sauvera au TP. Toutes les règles passent par une seule fonction pure, deplacerTicket, qui renvoie soit ok avec un nouveau tableau, soit une erreur. Limite de 3 tickets en cours, pas de ticket non estimé hors du backlog. Et six tests, dont le plus important : avec exactement 3 tickets en cours, le quatrième est refusé. »

ANIMATION — Pointer la ligne wip: 3. → beat 1 : les 6 tests, insister sur T3 (valeur limite exacte) et T5 (tableau d’origine intact).

TRANSITION — « Atelier 8.1, trente-cinq minutes. »`,
  // M8_Lab8
  `⏱ 35 min · ATELIER VIBE 8.1 · TASKFLOW V2 · KANBAN, RÈGLES ET AUTO-TESTS

OBJECTIF — Construire le Kanban, isoler les règles dans deplacerTicket, prouver qu’elles tiennent par 6 tests et vérifier la qualité des tests par mutation.

DIRE — « Trente-cinq minutes, individuellement. Repartez de taskflow-v1. D’abord l’architecture et le Kanban. Ensuite les six tests, et là, soyez méfiants : l’IA écrit parfois des tests qui recopient la logique au lieu d’appeler la vraie fonction, et qui passent donc toujours. Enfin, le test de mutation : vous cassez volontairement la règle WIP. Si aucun test ne passe au rouge, vos tests ne protègent rien. »

ANIMATION — Lancer le minuteur de 35 minutes. Points d’étape à 15 min (Kanban affiché) et 30 min (« Le test de mutation a-t-il fait rougir un test ? »). Rappeler d’enregistrer taskflow-v2.html.

TRANSITION — « Six questions avant le déjeuner, et elles portent sur les pièges que vous venez de rencontrer. »`,
  // M8_QCM
  `⏱ 10 min · QCM MODULES 7 & 8 · LES PIÈGES DES LISTES D’OBJETS

OBJECTIF — Vérifier la maîtrise des pièges réels : .sort qui modifie l’original, = dans un filter, références partagées, id en texte, test à la valeur limite, fonction pure testable.

DIRE — « Six questions. Lisez le code ligne par ligne : chaque mauvaise réponse est un bug que l’IA produit réellement. Votez à voix haute, A, B, C ou D. »

ANIMATION — 30 secondes de lecture par question. Faire justifier chaque vote par un volontaire.
Q1 → A : .sort trie sur place.
Q2 → 5 tickets, tous corrompus : = au lieu de ===.
Q3 → oui : nouveau tableau, mêmes objets.
Q4 → TypeError : « 42 » !== 42.
Q5 → le test à 3 exactement.
Q6 → B, la fonction pure.

TRANSITION — « Bon appétit ! Cet après-midi : importer un vrai fichier piégé, puis le TP Kanban. »`,
  // M8_Dejeuner
  `⏱ 90 min · PAUSE DÉJEUNER

DIRE — « Pause déjeuner d’une heure trente, reposez-vous bien, reprise à 14 h 00 ! »

ANIMATION — Lancer le minuteur de 90 minutes.`,
];

const NOTES_M9: string[] = [
  // M9_Divider
  `⏱ 1 min · MODULE 9 · 14:00

DIRE — « Bon retour ! Module 9 : charger des données JSON et CSV, formater l’affichage et créer vos premières visualisations graphiques. »

TRANSITION — « Comparons d’abord les deux formats que vous rencontrerez partout : CSV et JSON. »`,
  // M9_FormatsJsonCsv
  `⏱ 5 min · JSON ET CSV

OBJECTIF — Reconnaître visuellement un fichier CSV et un fichier JSON.

DIRE — « À gauche, le CSV : c’est un tableau où la première ligne donne le nom des colonnes, et chaque ligne suivante sépare les valeurs par une virgule. À droite, le JSON : vous le reconnaissez tout de suite, c’est exactement le tableau d’objets que nous avons utilisé ce matin, avec des guillemets autour des clés ! »

ANIMATION — → beat 1 : l’IA comme traducteur instantané entre CSV et JSON.

TRANSITION — « Comment utiliser l’IA pour fabriquer ou convertir des jeux de données sans aucun risque de confidentialité ? »`,
  // M9_PromptsDonnees
  `⏱ 5 min · GÉNÉRER ET CONVERTIR DES DONNÉES AVEC L’IA

OBJECTIF — Savoir demander un jeu de données fictif réaliste tout en respectant le RGPD.

DIRE — « Au lieu de tester votre application avec deux lignes “Test 1, Test 2”, demandez à l’IA de vous générer 12 entrées fictives réalistes avec des catégories et des montants variés. Et souvenez-vous de notre règle absolue : si vous avez un vrai fichier CSV au travail, ne collez jamais les lignes des clients dans l’IA — donnez uniquement l’en-tête des colonnes ! »

ANIMATION — → beat 1 : prompt de conversion CSV → JSON. → beat 2 : alerte RGPD.

TRANSITION — « Comment charger ou exporter ces fichiers dans votre mini-application ? »`,
  // M9_ChargerExporter
  `⏱ 5 min · IMPORTER ET EXPORTER JSON / CSV

OBJECTIF — Comprendre JSON.parse() et les boutons Importer / Exporter d’une interface.

DIRE — « Côté code, JSON.parse() transforme le texte d’un fichier JSON en tableau d’objets, et split('\\n') découpe les lignes d’un CSV. Côté interface, demandez toujours trois choses à l’IA : un jeu de démo déjà présent à l’ouverture, un bouton Importer un fichier JSON/CSV, et un bouton Exporter ! »

ANIMATION — → beat 1 : les 3 éléments à demander dans l’UI.

TRANSITION — « Voyons en direct comment la même donnée passe du CSV au JSON puis au Dashboard graphique ! »`,
  // M9_SimDashboard
  `⏱ 6 min · SIMULATEUR : DU CSV/JSON AU DASHBOARD VISUEL

OBJECTIF — Visualiser la transformation d’un fichier brut en cartes KPI et barres de progression.

DIRE — « Cliquez avec moi sur l’onglet 1 : voici 4 lignes CSV brutes. Onglet 2 : les mêmes lignes transformées en objets JSON. Et onglet 3 : ce que votre mini-app affiche à l’écran — 3 cartes KPI en haut (Total projets, Budget cumulé, Services au vert) et 4 barres horizontales proportionnelles au budget ! »

ANIMATION — Basculer entre les 3 onglets CSV, JSON et Dashboard UI.

TRANSITION — « Place à la v3 de TaskFlow : un vrai fichier à importer, et il est piégé. »`,
  // M9_SpecV3
  `⏱ 5 min · TASKFLOW V3 · IMPORTER UN BACKLOG PIÉGÉ

OBJECTIF — Présenter le CSV piégé, les règles d’import I1 à I5, le rapport attendu et le tableau de bord.

DIRE — « Le chef de projet vous envoie l’export de son ancien outil. Ne cherchez pas les pièges tout de suite, ce sera la première étape de l’atelier. Ce que je vous donne, c’est le résultat exact attendu : quatre importés, deux rejetés, avec leur motif. Si votre application annonce autre chose, il reste un piège non traité. Les règles I1 à I5 disent comment traiter chaque cas, et le tableau de bord doit se recalculer à chaque déplacement de ticket. »

ANIMATION — Coller le fichier backlog-import.csv complet dans le clavardage. → beat 1 : le rapport attendu. Ne pas commenter les lignes piégées.

TRANSITION — « Atelier 9.1, trente-cinq minutes. »`,
  // M9_Lab9
  `⏱ 35 min · ATELIER VIBE 9.1 · TASKFLOW V3 · IMPORT ROBUSTE ET PILOTAGE

OBJECTIF — Écrire un import CSV qui résiste aux pièges réels, garantir un aller-retour JSON sans perte et afficher un tableau de bord en direct.

DIRE — « Trente-cinq minutes, individuellement. Étape 1 : faites lister les pièges par l’IA avant d’écrire une ligne de code, et comparez avec les règles. Il y a presque toujours un piège qu’elle rate : le doublon d’id ou l’espace après Story. Étape 2 : les deux fonctions pures, le rapport d’import et deux auto-tests sur ce fichier. Étape 3 : le tableau de bord et l’aller-retour Export, Réinitialiser, Import. »

ANIMATION — Lancer le minuteur de 35 minutes. Points d’étape à 15 min (« Votre rapport dit-il 4 importés, 2 rejetés ? ») et 30 min (tableau de bord). Lignes du CSV, pour le formateur : ligne 2, virgule dans le titre ; ligne 3, « Story » avec espace et majuscule ; ligne 4, titre vide (rejet) ; ligne 5, points « ? » → null ; ligne 6, id 21 en double → nouvel id ; ligne 7, priorité 4 (rejet). Rappeler d’enregistrer taskflow-v3.html.

TRANSITION — « Quinze minutes de pause avant le TP Kanban ! »`,
  // M9_Pause
  `⏱ 15 min · PAUSE APRÈS-MIDI

DIRE — « Quinze minutes de pause loin de l’écran. À la reprise, le TP : TaskFlow devient un vrai Kanban, avec glisser-déposer et sauvegarde ! »

ANIMATION — Lancer le minuteur de 15 minutes.`,
];

const NOTES_M10: string[] = [
  // M10_Divider
  `⏱ 1 min · MODULE 10 · TP JOUR 2

DIRE — « Module 10 : le TP du Jour 2. TaskFlow devient un vrai Kanban : glisser-déposer, sauvegarde qui résiste aux évolutions, et un Product Owner qui change le process en cours de route. »

TRANSITION — « Je vous montre d’abord la cible, règles comprises. »`,
  // M10_SimKanban
  `⏱ 6 min · DÉMO : LE KANBAN CIBLE

OBJECTIF — Montrer le comportement attendu : glisser-déposer, refus WIP, Definition of Ready, et lien avec la fonction pure deplacerTicket.

DIRE — « Voici la cible. Dites-moi où déplacer les cartes, je les glisse. Regardez le bandeau sombre en bas : chaque dépôt appelle deplacerTicket, la même fonction que vos boutons ◀ ▶ de ce matin. Qui veut tenter de faire entrer un quatrième ticket En cours ? Refusé : WIP atteint. Et Notifications e-mail, qui n’est pas estimé ? Refusé aussi : Definition of Ready. »

ANIMATION — Glisser Page profil client vers En cours (refus WIP), puis Notifications e-mail vers À faire (refus DoR). Faire terminer un ticket, puis rejouer le déplacement refusé : il passe. Montrer le pourcentage d’avancement qui bouge. Bouton Réinitialiser à la fin.

TRANSITION — « Comment brancher ce glisser-déposer sans bibliothèque ? Trois événements, trois pièges. »`,
  // M10_DragDrop
  `⏱ 6 min · LE GLISSER-DÉPOSER NATIF

OBJECTIF — Connaître dragstart, dragover et drop, et les trois pièges : preventDefault, id en texte, contournement des règles.

DIRE — « Le navigateur sait faire du glisser-déposer tout seul. dragstart : on range l’id du ticket. dragover : on autorise le dépôt. drop : on récupère l’id et on appelle deplacerTicket. Premier piège : sans preventDefault sur dragover, le dépôt ne se déclenche jamais, et sans aucun message d’erreur. Deuxième piège : getData renvoie du texte, d’où le Number. Troisième piège, le plus grave : si le drop modifie directement le statut, votre limite WIP saute. »

ANIMATION — → beat 1 : piège 2, l’id en texte, déjà vu au QCM du matin. → beat 2 : piège 3, le dépôt doit passer par les règles.

TRANSITION — « Dernière brique avant le TP : une sauvegarde qui survit aux évolutions. »`,
  // M10_LocalStorage
  `⏱ 6 min · LOCALSTORAGE VERSIONNÉ

OBJECTIF — Comprendre l’enveloppe { version, tickets }, la migration explicite et le plan B try/catch.

DIRE — « localStorage ne stocke que du texte : JSON.stringify pour écrire, JSON.parse pour relire. Mais le vrai problème arrive quand votre application évolue : demain, vos tickets auront un champ de plus, et les données d’hier ne l’auront pas. D’où trois règles : on sauvegarde dans une enveloppe versionnée, on écrit une migration explicite, et on protège le chargement par un try/catch pour ne jamais afficher un écran blanc. »

ANIMATION — → beat 1 : la migration. → beat 2 : le plan B. Pointer la ligne Array.isArray : c’est comme ça qu’on reconnaît un ancien format.

TRANSITION — « À vous : phase 1 du TP, trente minutes. »`,
  // M10_LabTP2
  `⏱ 30 min · TP JOUR 2 · PHASE 1 · GLISSER-DÉPOSER ET SAUVEGARDE

OBJECTIF — Brancher le glisser-déposer sur deplacerTicket, ajouter la sauvegarde versionnée et la tester par sabotage.

DIRE — « Trente minutes, individuellement. Repartez de votre taskflow-v3. Premier temps : le glisser-déposer, branché sur deplacerTicket, et vous vérifiez vous-même les trois pièges dans le code. Deuxième temps : la sauvegarde versionnée. Dernier temps, le sabotage : F12, onglet Application, Local Storage, vous remplacez la valeur par du texte invalide et vous rechargez. Si l’écran devient blanc, votre plan B ne marche pas. »

ANIMATION — Lancer le minuteur de 30 minutes. Coller dans le clavardage le chemin F12 → Application → Local Storage. Point d’étape à 15 min : « Le dépôt marche-t-il ? Le refus WIP aussi ? »

TRANSITION — « Minute 30 : le Product Owner a un message pour vous. »`,
  // M10_LabTwist
  `⏱ 30 min · TP JOUR 2 · PHASE 2 · LE TWIST DU PRODUCT OWNER

OBJECTIF — Faire évoluer l’application sans régression : nouvelle colonne avec règle de passage, nouveau champ avec migration, annulation du dernier déplacement.

DIRE — « Le Product Owner change le process, comme dans la vraie vie. Une colonne En revue, limitée à deux, par laquelle on doit passer avant Terminé. Un champ assigne, alors que vos données sauvegardées ne l’ont pas : migration obligatoire. Et un bouton Annuler. Bonne nouvelle : si vos colonnes viennent de COLONNES et si vos tableaux sont immuables, c’est beaucoup plus simple qu’il n’y paraît. Faites passer vos anciens tests à chaque étape. »

ANIMATION — Lancer le minuteur de 30 minutes. → beat 1 : ce que le twist met à l’épreuve. Points d’étape quand le minuteur affiche 20:00 (colonne En revue) et 10:00 (migration). Rappeler à 05:00 d’enregistrer taskflow-v4.html.

TRANSITION — « Place aux démos, et le groupe va essayer de casser vos règles. »`,
  // M10_Restitution
  `⏱ 20 min · RESTITUTION JOUR 2

OBJECTIF — Prouver en direct que les règles, la sauvegarde et l’annulation tiennent.

DIRE — « Deux à trois minutes chacun. Le groupe vous dicte un déplacement interdit, vous montrez le refus. Puis F5, puis Annuler, puis vos auto-tests et la fonction deplacerTicket. Pour chaque démo : un point fort et une piste, au micro. »

ANIMATION — Minuteur de 3 minutes par participant. Au-delà de 10 participants : 5 ou 6 volontaires, les autres déposent une capture dans le clavardage. « Participant suivant ». → beat 1 : conserver taskflow-v4.html pour le Jour 3.

TRANSITION — « Faisons le bilan de cette journée. »`,
  // M10_BilanJ2
  `⏱ 4 min · BILAN DU JOUR 2

OBJECTIF — Récapituler les compétences acquises à travers les quatre incréments de TaskFlow.

DIRE — « Aujourd’hui, vous n’avez pas empilé des démos : vous avez fait évoluer un même produit sans le casser. Vous savez modéliser des données, les manipuler sans modifier l’original, prouver vos règles par des tests aux valeurs limites, importer un fichier avec méfiance, et faire durer vos données d’une version à l’autre. »

ANIMATION — Dérouler les 5 points clés.

TRANSITION — « Terminons par le billet de sortie. »`,
  // M10_SortieJ2
  `⏱ 5 min · BILLET DE SORTIE JOUR 2

OBJECTIF — Clôturer la journée et préparer le passage sur VS Code au Jour 3.

DIRE — « Une minute chacun au micro : le bug qui vous a le plus appris, la décision du matin qui vous a sauvé pendant le twist, et la prochaine fonctionnalité que vous ajouteriez à TaskFlow. Très bonne soirée à toutes et à tous ! »

ANIMATION — Tour de table par prénom. Vérifier que chacun a enregistré taskflow-v4.html et que VS Code (ou vscode.dev / GitHub Codespaces) est prêt pour demain, et que chacun a un compte GitHub (gratuit, à créer soi-même ce soir) pour publier en ligne.`,
];

// ════════════════════════════════════════════════════════════════════════════
// JOUR 3 — Ouverture, VS Code, Agents, Skills & Démo finale (29 pages)
// ════════════════════════════════════════════════════════════════════════════
const J3_Cover: Page = () => (
  <Cover
    mod={11}
    day={3}
    eyebrow="Jour 3 · VS Code, Skill, équipe d’agents et mise en ligne"
    sub="TaskFlow passe dans VS Code : une équipe de trois agents (Product Owner, développeur JavaScript, testeur) livre votre fonctionnalité phare, puis vous la publiez sur GitHub Pages."
  >
    <span style={{ color: C.plum }}>Jour 3</span>
    <br />
    Agents, GitHub &amp; Démo
  </Cover>
);
J3_Cover.transition = BLOOM;

const J3_QuizRappel: Page = () => (
  <Frame mod={11} kind="qcm">
    <Title>QCM éclair · Réactivation du Jour 2</Title>
    <QuizSeries y={195}>
      <QuizQ
        q="Quelle structure de données permet de représenter un mur de cartes où chaque carte possède un id, un titre, une catégorie et un statut fait ?"
        explain="Un tableau d’objets [{ id, titre, categorie, fait }, ...] associe un objet complet à chaque carte de l’interface."
      >
        <QOpt>Un simple nombre</QOpt>
        <QOpt ok>Un tableau d’objets [ &#123; id, titre, categorie, fait &#125;, ... ]</QOpt>
        <QOpt>Une couleur CSS</QOpt>
        <QOpt>Une seule variable booléenne</QOpt>
      </QuizQ>
      <QuizQ
        q="À quoi sert le couple JSON.stringify() et JSON.parse() lorsqu’on utilise localStorage ?"
        explain="localStorage ne stocke que du texte : JSON.stringify transforme les objets en texte pour sauvegarder, et JSON.parse recrée les objets au chargement."
      >
        <QOpt>À changer la police de caractères</QOpt>
        <QOpt ok>À convertir le tableau d’objets en texte pour le sauvegarder, puis à le relire en objets</QOpt>
        <QOpt>À supprimer toutes les fonctions</QOpt>
        <QOpt>À accélérer la connexion Internet</QOpt>
      </QuizQ>
      <QuizQ
        q="Quel cas limite faut-il toujours inclure dans votre panneau d’Auto-Tests quand une fonction calcule une moyenne ou un pourcentage sur une liste ?"
        explain="Si la liste est vide ([]), diviser par 0 produit NaN : le test sur la liste vide vérifie que la fonction renvoie proprement 0."
      >
        <QOpt>Le cas où l’écran est éteint</QOpt>
        <QOpt ok>Le cas de la liste vide [] (pour éviter une division par zéro qui affiche NaN)</QOpt>
        <QOpt>Uniquement le cas avec 1000 éléments</QOpt>
        <QOpt>Aucun, le cas normal suffit toujours</QOpt>
      </QuizQ>
      <QuizQ
        q="Que devez-vous envoyer à une IA si vous voulez qu’elle génère un script pour traiter un fichier CSV interne de votre entreprise ?"
        explain="Par confidentialité et conformité RGPD, on ne partage que la structure (noms des colonnes) et des lignes fictives."
      >
        <QOpt>Le fichier complet avec les vrais noms et emails des clients</QOpt>
        <QOpt ok>Uniquement l’en-tête des colonnes et 2 ou 3 lignes fictives anonymisées</QOpt>
        <QOpt>Vos identifiants de connexion</QOpt>
        <QOpt>Une capture d’écran des données bancaires</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M11_Divider: Page = () => (
  <Divider mod={11} kicker="Jour 3 · Matin" title="De l’outil web à VS Code : l’IA au cœur du projet">
    <Bullet size={30}>Pourquoi passer du navigateur à VS Code pour un vrai projet</Bullet>
    <Bullet size={30}>Visite guidée de VS Code en 4 zones (sans jargon)</Bullet>
    <Bullet size={30}>Les 3 modes du copilote : Ask, Edit et Agent multi-fichiers</Bullet>
  </Divider>
);
M11_Divider.transition = BLOOM;

const M11_PourquoiVSCode: Page = () => (
  <Frame mod={11} kind="cours" beats={1}>
    <Title><span style={{ fontSize: '44px' }}>Pourquoi passer de ChatGPT / Claude Web à VS Code aujourd’hui ?</span></Title>
    <Lede>Les outils web sont parfaits pour prototyper un fichier unique ; VS Code vous ouvre les portes d’un vrai projet structuré.</Lede>
    <Grid top={255} cols={2} gap={28}>
      <Card title="Jours 1 & 2 · Dans le navigateur (Canvas / Artifacts)" icon="globe" tone="blue" d={100} bsz={22}>
        <Col gap={10}>
          <div>✓ Démarrage immédiat en 0 seconde</div>
          <div>✓ Parfait pour une maquette en 1 seul fichier</div>
          <div style={{ color: T.coral.fg }}>• Tout (HTML + CSS + JS + données) est tassé dans un seul long fichier</div>
          <div style={{ color: T.coral.fg }}>• Il faut répéter ses préférences à chaque nouvelle conversation</div>
        </Col>
      </Card>
      <Card title="Jour 3 · Dans VS Code avec Agent & Skills" icon="laptop" tone="violet" d={220} bsz={22}>
        <Col gap={10}>
          <div><Strong c={C.violet}>✓ Un vrai dossier de projet</Strong> (<Ic>index.html</Ic>, <Ic>style.css</Ic>, <Ic>app.js</Ic>, <Ic>data.json</Ic>, <Ic>README.md</Ic>)</div>
          <div><Strong c={C.violet}>✓ L’IA voit tous vos fichiers</Strong> et propose des modifications ciblées (Diff Vert/Rouge)</div>
          <div><Strong c={C.violet}>✓ Mémoire permanente du projet</Strong> grâce aux fichiers <Ic>AGENTS.md</Ic>, <Ic>SKILL.md</Ic> et <Ic>.agent.md</Ic> !</div>
        </Col>
      </Card>
    </Grid>
    <Box x={120} y={755} w={1680}>
      <Callout tone="green" icon="checkCircle" title="Rassurez-vous : vous ne changez pas de méthode !" cls={b.on(1)} size={24}>
        Dans VS Code, vous dialoguez toujours en français dans un panneau de Chat IA — mais l’IA écrit directement dans vos fichiers au lieu de vous obliger à copier-coller.
      </Callout>
    </Box>
  </Frame>
);

const M11_TourVSCode: Page = () => (
  <Frame mod={11} kind="demo" beats={4}>
    <Title>Visite guidée de VS Code pour débutants :4 zones seulement</Title>
    <Lede>Oubliez les 50 menus : en Vibe Coding, vous n’utilisez que ces 4 zones. Cliquez sur les pastilles 1 à 4 !</Lede>
    <Box x={120} y={255} w={1680}>
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 460px', gap: 16, height: 470, background: '#0F172A', borderRadius: 20, padding: 18, boxShadow: SHADOW, color: '#E2E8F0' }}>
        <div style={{ background: '#1E293B', borderRadius: 14, padding: 16 }}>
          <Eyebrow c="#93C5FD" size={16}>1 · Explorateur de fichiers</Eyebrow>
          <div style={{ fontFamily: mono, fontSize: 19, lineHeight: 1.85, marginTop: 10 }}>
            <div>📁 mon-projet-vibe/</div>
            <div style={{ paddingLeft: 18, color: '#7EE2B8' }}>📄 AGENTS.md</div>
            <div style={{ paddingLeft: 18, color: '#C4B5FD' }}>📁 .github/skills/</div>
            <div style={{ paddingLeft: 18, color: '#C4B5FD' }}>📁 .github/agents/</div>
            <div style={{ paddingLeft: 18 }}>📄 index.html</div>
            <div style={{ paddingLeft: 18 }}>📄 style.css</div>
            <div style={{ paddingLeft: 18, color: '#FDE047' }}>📄 app.js</div>
            <div style={{ paddingLeft: 18 }}>📄 README.md</div>
          </div>
        </div>
        <div style={{ background: '#1E293B', borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Eyebrow c="#93C5FD" size={16}>2 · Éditeur central &amp; Diff Vert / Rouge</Eyebrow>
          <div style={{ fontFamily: mono, fontSize: 19, background: 'rgba(224,72,72,.22)', padding: '6px 12px', borderRadius: 8, color: '#FCA5A5' }}>
            - let limite = 50;
          </div>
          <div style={{ fontFamily: mono, fontSize: 19, background: 'rgba(14,159,110,.25)', padding: '6px 12px', borderRadius: 8, color: '#86EFAC' }}>
            + const seuilLivraisonGratuite = 50;
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <Tag tone="green" size={15}>✓ Accepter (Keep)</Tag>
            <Tag tone="coral" size={15}>✗ Annuler (Undo)</Tag>
          </div>
          <div style={{ marginTop: 'auto', background: '#0F172A', borderRadius: 12, padding: 14 }}>
            <Eyebrow c="#7EE2B8" size={15}>4 · Aperçu dans le navigateur</Eyebrow>
            <div style={{ fontSize: 18, marginTop: 4, color: '#CBD5E1' }}>Ouvrez <Ic>index.html</Ic> dans Chrome/Edge : un simple F5 recharge vos changements !</div>
          </div>
        </div>
        <div style={{ background: '#1E293B', borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Eyebrow c="#C4B5FD" size={16}>3 · Panneau Chat IA (Ask / Edit / Agent)</Eyebrow>
          <div style={{ background: '#334155', borderRadius: 10, padding: 12, fontSize: 18 }}>
            <strong style={{ color: '#93C5FD' }}>Vous :</strong> Sépare le style dans <Ic>style.css</Ic> et vérifie que les 5 auto-tests restent verts.
          </div>
          <div style={{ background: 'rgba(116,66,224,.28)', borderRadius: 10, padding: 12, fontSize: 18 }}>
            <strong style={{ color: '#DDD6FE' }}>Agent IA :</strong> J’ai mis à jour <Ic>index.html</Ic> et créé <Ic>style.css</Ic>. Vérifiez le diff au centre !
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
            <Tag tone="violet" size={15}>Mode : Agent</Tag>
            <Tag tone="teal" size={15}>@Dev-JS</Tag>
          </div>
        </div>
      </div>
      <Pin n={1} beat={1} x={312} y={44} tone="blue" />
      <Pin n={2} beat={2} x={1160} y={44} tone="blue" />
      <Pin n={3} beat={3} x={1636} y={44} tone="blue" />
      <Pin n={4} beat={4} x={1160} y={380} tone="blue" />
    </Box>
    <Grid top={745} cols={4} gap={18}>
      <PinNote n={1} beat={1} tone="blue" title="Le dossier du projet" size={19}>
        Chaque rôle a son fichier : <Ic>index.html</Ic>, <Ic>style.css</Ic>, <Ic>app.js</Ic>.
      </PinNote>
      <PinNote n={2} beat={2} tone="blue" title="Le Diff vert / rouge" size={19}>
        Vous voyez chaque ligne changée, puis Accepter ou Annuler.
      </PinNote>
      <PinNote n={3} beat={3} tone="blue" title="Le Chat IA intégré" size={19}>
        Choix du mode Ask / Edit / Agent et appel de vos agents.
      </PinNote>
      <PinNote n={4} beat={4} tone="blue" title="L’aperçu navigateur" size={19}>
        Après avoir accepté, rafraîchissez pour tester l’interface.
      </PinNote>
    </Grid>
  </Frame>
);

const M11_TroisModes: Page = () => (
  <Frame mod={11} kind="cours" beats={1}>
    <Title>Les 3 modes de votre copilote dans VS Code : Ask, Edit, Agent</Title>
    <Lede>Choisir le bon mode selon votre besoin vous fait gagner du temps et évite les modifications non désirées.</Lede>
    <Grid top={255} cols={3} gap={26}>
      <Card title="1 · Mode Ask (Poser une question)" icon="chat" tone="blue" d={100} bsz={21}>
        <Tag tone="blue" size={16}>Lecture seule · 0 modification</Tag>
        <div style={{ marginTop: 12 }}>Pour demander une explication ligne par ligne, comprendre un bug ou réfléchir à des idées <Strong>sans toucher à vos fichiers</Strong>.</div>
        <div style={{ marginTop: 12, fontFamily: mono, fontSize: 18, color: C.blue }}>« Explique-moi comment fonctionne chargerDonnees() »</div>
      </Card>
      <Card title="2 · Mode Edit / Inline (Retoucher)" icon="wand" tone="teal" d={220} bsz={21}>
        <Tag tone="teal" size={16}>Ciblé sur 1 zone ou 1 fichier</Tag>
        <div style={{ marginTop: 12 }}>Pour modifier une fonction précise, ajuster une couleur dans <Ic>style.css</Ic> ou ajouter un test dans <Ic>app.js</Ic>.</div>
        <div style={{ marginTop: 12, fontFamily: mono, fontSize: 18, color: C.teal }}>« Dans calculerRemise, passe le seuil de 50 à 80 € »</div>
      </Card>
      <Card title="3 · Mode Agent (Co-créer)" icon="bot" tone="violet" d={340} bsz={21}>
        <Tag tone="violet" size={16}>Multi-fichiers + Outils + Skills</Tag>
        <div style={{ marginTop: 12 }}>Pour créer une fonctionnalité complète qui touche à la fois <Ic>index.html</Ic>, <Ic>style.css</Ic> et <Ic>app.js</Ic>, ou découper un projet.</div>
        <div style={{ marginTop: 12, fontFamily: mono, fontSize: 18, color: C.violet }}>« Ajoute un filtre par priorité dans le HTML et le JS »</div>
      </Card>
    </Grid>
    <Box x={120} y={760} w={1680}>
      <Callout tone="yellow" icon="bulb" title="Règle de bon sens" cls={b.on(1)} size={24}>
        Vous voulez <Strong>comprendre</Strong> ? → <Strong>Ask</Strong>. Changer <Strong c={C.teal}>un détail local</Strong> ? → <Strong c={C.teal}>Edit</Strong>. Construire une <Strong c={C.violet}>fonctionnalité complète</Strong> ? → <Strong c={C.violet}>Agent</Strong>.
      </Callout>
    </Box>
  </Frame>
);

const M11_DragModes: Page = () => (
  <Frame mod={11} kind="demo">
    <Title>Jeu de tri : Ask, Edit ou Agent ?</Title>
    <Lede>Pour chacune des 6 situations en bas, dites à voix haute dans quelle colonne elle va : je déplace l’étiquette !</Lede>
    <Grid top={250} cols={3} gap={26}>
      <Card title="Colonne 1 · Mode ASK" icon="chat" tone="blue" style={{ height: 340 }} bsz={20}>
        Comprendre, expliquer, trouver des idées (ne modifie aucun fichier).
      </Card>
      <Card title="Colonne 2 · Mode EDIT" icon="wand" tone="teal" style={{ height: 340 }} bsz={20}>
        Petite retouche précise dans une fonction ou une règle CSS.
      </Card>
      <Card title="Colonne 3 · Mode AGENT" icon="bot" tone="violet" style={{ height: 340 }} bsz={20}>
        Action sur plusieurs fichiers (<Ic>html</Ic> + <Ic>css</Ic> + <Ic>js</Ic>) ou création de fichier.
      </Card>
    </Grid>
    <Drag x={120} y={635} w={530} tone="blue">1 · « Que veut dire JSON.parse à la ligne 14 ? »</Drag>
    <Drag x={695} y={635} w={530} tone="violet">2 · « Sépare mon index.html en 3 fichiers html/css/js »</Drag>
    <Drag x={1270} y={635} w={530} tone="teal">3 · « Change la couleur du bouton principal en bleu #0A62D0 »</Drag>
    <Drag x={120} y={725} w={530} tone="violet">4 · « Ajoute un bouton Export CSV dans l’UI et sa fonction JS »</Drag>
    <Drag x={695} y={725} w={530} tone="blue">5 · « Propose-moi 3 idées d’améliorations visuelles »</Drag>
    <Drag x={1270} y={725} w={530} tone="teal">6 · « Renomme la variable x en budgetTotal dans cette fonction »</Drag>
  </Frame>
);

const M11_DiffReview: Page = () => (
  <Frame mod={11} kind="cours" beats={1}>
    <Title>Lire le Diff Vert / Rouge avant d’accepter : <span style={{ fontSize: '48px' }}>votre super-pouvoir</span></Title>
    <Lede>Dans VS Code, l’Agent vous montre exactement ce qu’il souhaite ajouter (en vert) et supprimer (en rouge).</Lede>
    <Box x={120} y={260} w={1000}>
      <Code file="Aperçu d’un Diff dans app.js" size={21}>
        <div style={{ color: '#94A3B8' }}>{'function calculerPourcentage(faites, total) {'}</div>
        <div style={{ background: 'rgba(224,72,72,.25)', color: '#FCA5A5', padding: '2px 8px' }}>
          {'-  return Math.round((faites / total) * 100);'}
        </div>
        <div style={{ background: 'rgba(14,159,110,.25)', color: '#86EFAC', padding: '2px 8px' }}>
          {'+  if (total === 0) return 0;'}
        </div>
        <div style={{ background: 'rgba(14,159,110,.25)', color: '#86EFAC', padding: '2px 8px' }}>
          {'+  return Math.round((faites / total) * 100);'}
        </div>
        <div style={{ color: '#94A3B8' }}>{'}'}</div>
      </Code>
    </Box>
    <Box x={1160} y={260} w={640}>
      <Card title="Les 3 questions avant de cliquer Accepter" icon="checkCircle" tone="green" bsz={22}>
        <Col gap={12}>
          <div><Strong>1.</Strong> Est-ce qu’il touche uniquement à la fonction demandée ?</div>
          <div><Strong>2.</Strong> Est-ce qu’il n’a pas supprimé en rouge une fonction ou une donnée importante par erreur ?</div>
          <div><Strong>3.</Strong> Mes auto-tests restent-ils au vert après le changement ?</div>
        </Col>
      </Card>
    </Box>
    <Box x={120} y={740} w={1680}>
      <Callout tone="blue" icon="reset" title="Et si le changement casse quelque chose ?" cls={b.on(1)} size={24}>
        Un clic sur <Strong>Annuler (Undo)</Strong> ou <Ic>Ctrl+Z</Ic> remet immédiatement votre fichier dans son état précédent !
      </Callout>
    </Box>
  </Frame>
);

// ════════════════════════════════════════════════════════════════════════════
// MODULE 12 — Instructions, Skills & Agents dans VS Code (10 pages)
// ════════════════════════════════════════════════════════════════════════════
const M12_Divider: Page = () => (
  <Divider mod={12} kicker="Jour 3 · Matin" title="Instructions, Skills & Agents personnalisés dans VS Code">
    <Bullet size={30}>Donner une mémoire permanente au projet avec AGENTS.md</Bullet>
    <Bullet size={30}>Un Skill partagé : la recette d’une fonctionnalité TaskFlow</Bullet>
    <Bullet size={30}>Trois agents qui se passent le relais : PO, Dev JS, Testeur</Bullet>
  </Divider>
);
M12_Divider.transition = BLOOM;

const M12_PyramideContexte: Page = () => (
  <Frame mod={12} kind="cours" beats={3}>
    <Title>Comment dresser votre IA dans VS Code : les 4 couches de guidage</Title>
    <Lede>Au lieu de répéter « je suis débutant, écris en français, ajoute des tests » dans chaque prompt, rangez ces règles dans votre dossier !</Lede>
    <Box x={120} y={255} w={1680} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className={A.in} style={{ display: 'grid', gridTemplateColumns: '480px 1fr', gap: 22, alignItems: 'center', background: C.card, padding: '16px 24px', borderRadius: 16, boxShadow: SHADOW_SM, borderLeft: `8px solid ${C.navy}` }}>
        <div>
          <Tag tone="navy" size={16}>1 · Toujours lu à chaque message</Tag>
          <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 22, color: C.navy, marginTop: 6 }}>AGENTS.md · .github/copilot-instructions.md</div>
        </div>
        <div style={{ fontSize: 22, color: C.soft }}>Les règles générales du projet : HTML/CSS/JS simple sans bibliothèque complexe, variables en français, découpage en 3 zones, auto-tests.</div>
      </div>
      <div className={b.on(1)} style={{ display: 'grid', gridTemplateColumns: '480px 1fr', gap: 22, alignItems: 'center', background: C.card, padding: '16px 24px', borderRadius: 16, boxShadow: SHADOW_SM, borderLeft: `8px solid ${C.green}` }}>
        <div>
          <Tag tone="green" size={16}>2 · Chargé quand la tâche correspond</Tag>
          <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 22, color: T.green.fg, marginTop: 6 }}>.github/skills/&lt;nom&gt;/SKILL.md</div>
        </div>
        <div style={{ fontSize: 22, color: C.soft }}>Une recette de savoir-faire spécialisée : ici, comment ajouter une fonctionnalité à TaskFlow (modèle, migration, tests, Definition of Done).</div>
      </div>
      <div className={b.on(2)} style={{ display: 'grid', gridTemplateColumns: '480px 1fr', gap: 22, alignItems: 'center', background: C.card, padding: '16px 24px', borderRadius: 16, boxShadow: SHADOW_SM, borderLeft: `8px solid ${C.violet}` }}>
        <div>
          <Tag tone="violet" size={16}>3 · Appelé quand vous le choisissez</Tag>
          <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 22, color: T.violet.fg, marginTop: 6 }}>.github/agents/&lt;nom&gt;.agent.md</div>
        </div>
        <div style={{ fontSize: 22, color: C.soft }}>Un coéquipier au rôle précis : <Ic>@Analyste-PO</Ic> (spécifie), <Ic>@Testeur-QA</Ic> (prouve), <Ic>@Dev-JS</Ic> (implémente).</div>
      </div>
      <div className={b.on(3)} style={{ display: 'grid', gridTemplateColumns: '480px 1fr', gap: 22, alignItems: 'center', background: C.card, padding: '16px 24px', borderRadius: 16, boxShadow: SHADOW_SM, borderLeft: `8px solid ${C.blue}` }}>
        <div>
          <Tag tone="blue" size={16}>4 · Votre consigne courte du moment</Tag>
          <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 22, color: C.blue, marginTop: 6 }}>Votre prompt dans le Chat</div>
        </div>
        <div style={{ fontSize: 22, color: C.soft }}>Grâce aux couches 1, 2 et 3, un prompt d’une seule phrase suffit désormais pour obtenir un résultat sur-mesure !</div>
      </div>
    </Box>
  </Frame>
);

const M12_FichierInstructions: Page = () => (
  <Frame mod={12} kind="cours" beats={1}>
    <Title>Couche 1 : AGENTS.md, la constitution commune de toute l’équipe</Title>
    <Lede>Placé à la racine du dossier, il est lu à chaque requête, par chacun de vos agents. Court, stable, non négociable.</Lede>
    <Box x={120} y={255} w={1040}>
      <Code
        file="AGENTS.md (à la racine du dossier taskflow)"
        size={19}
        hi={[9, 10, 11, 14]}
        code={`# TaskFlow · Règles du projet\n\n## Stack\n- HTML, CSS et JavaScript natifs : aucune bibliothèque, aucun framework.\n- 4 fichiers : index.html, style.css, app.js, tests.js.\n\n## Conventions obligatoires\n- Noms de variables et de fonctions explicites, en français.\n- app.js en 3 zones : 1. Données & état, 2. Fonctions métier pures, 3. UI.\n- Ne jamais modifier un tableau reçu : renvoyer un nouveau tableau.\n- Toute règle métier est couverte par un test dans tests.js.\n- Toute évolution du modèle de ticket = nouvelle version + migration.\n\n## Équipe : @Analyste-PO spécifie · @Testeur-QA prouve · @Dev-JS code`}
      />
    </Box>
    <Box x={1200} y={255} w={600}>
      <Card title="Ce qui y va… et ce qui n’y va pas" icon="filter" tone="navy" bsz={21}>
        <Col gap={12}>
          <div><Strong c={C.green}>Oui :</Strong> les règles vraies pour <Strong>toute</Strong> demande, même « renomme ce bouton ».</div>
          <div><Strong c={C.coral}>Non :</Strong> les recettes longues et spécialisées. Elles encombrent chaque requête et diluent les règles importantes : leur place est dans un Skill.</div>
        </Col>
      </Card>
      <div className={b.on(1)} style={{ marginTop: 16 }}>
        <Callout tone="green" icon="globe" title="Un standard ouvert" size={22}>
          <PathChip>AGENTS.md</PathChip> est reconnu par GitHub Copilot dans VS Code comme par Claude Code, Cursor ou Gemini.
        </Callout>
      </div>
    </Box>
  </Frame>
);

const M12_SkillsExplique: Page = () => (
  <Frame mod={12} kind="cours" beats={1}>
    <Title>Couche 2 : un Skill partagé, la recette d’une fonctionnalité TaskFlow</Title>
    <Lede>Un Skill est une fiche de savoir-faire que l’agent ouvre seulement quand votre demande correspond à sa description.</Lede>
    <Box x={120} y={255} w={1000}>
      <Code
        file=".github/skills/fonctionnalite-taskflow/SKILL.md"
        size={18}
        hi={[2, 3, 4]}
        code={`---\nname: fonctionnalite-taskflow\ndescription: Recette pour spécifier, coder ou tester une nouvelle\n  fonctionnalité de TaskFlow (modèle, règles, migration, tests).\n---\n\n# Ajouter une fonctionnalité à TaskFlow\n1. Partir du modèle de ticket actuel (app.js, zone 1).\n2. Nouveau champ : valeur par défaut + fonction migrerV4versV5().\n3. Règles en fonctions pures (zone 2) : ni DOM, ni Date.now().\n   La date du jour est passée en paramètre « aujourdhui ».\n4. Erreur métier : renvoyer { ok: false, erreur }, jamais alert().\n5. Definition of Done :\n   - tous les tests de tests.js au vert, + 1 test de mutation ;\n   - aucune régression sur deplacerTicket et l’import CSV ;\n   - README.md mis à jour (fonctionnalité + rôle de l’IA).`}
      />
    </Box>
    <Box x={1160} y={255} w={640} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card title="Comment l’agent décide de l’ouvrir" icon="wand" tone="green" bsz={20} pad={22}>
        <Col gap={10}>
          <div><Strong c={C.navy}>1. L’en-tête</Strong> (name + description) est connu en permanence.</div>
          <div><Strong c={C.green}>2. Le corps</Strong> n’est chargé que si la demande correspond : « ajoute les sprints », « teste les dépendances »…</div>
          <div><Strong c={C.coral}>Donc :</Strong> une description vague (« mon skill ») = un Skill jamais utilisé.</div>
        </Col>
      </Card>
      <Callout tone="violet" icon="layers" title="Un seul Skill, trois agents" cls={b.on(1)} size={21}>
        Le PO, le développeur et le testeur appliquent la même recette et la même Definition of Done : ils parlent la même langue, chacun depuis son rôle.
      </Callout>
    </Box>
  </Frame>
);

const M12_AGENTS: { nom: string; tone: Tone; icon: IconName; ecrit: string; jamais: string }[] = [
  { nom: '@Analyste-PO', tone: 'blue', icon: 'doc', ecrit: 'docs/spec.md : user stories, critères d’acceptation, cas limites, impact sur les données', jamais: 'Écrire du code' },
  { nom: '@Testeur-QA', tone: 'green', icon: 'flask', ecrit: 'tests.js : tests écrits d’après la spec, tests de mutation, rapport', jamais: 'Toucher app.js' },
  { nom: '@Dev-JS', tone: 'violet', icon: 'code', ecrit: 'app.js, index.html, style.css : une règle à la fois, petits diffs', jamais: 'Toucher tests.js' },
];

const M12_AgentsExplique: Page = () => (
  <Frame mod={12} kind="cours" beats={1}>
    <Title>Couche 3 : une équipe de trois agents aux droits séparés</Title>
    <Lede>Chaque fichier .github/agents/*.agent.md crée un coéquipier sélectionnable dans le menu du Chat de VS Code.</Lede>
    <Box x={120} y={255} w={960}>
      <Code
        file=".github/agents/dev-js.agent.md"
        size={18}
        hi={[2, 3, 4, 13, 14]}
        code={`---\nname: Dev-JS\ndescription: Développeur JavaScript expert. Implémente une spec\n  validée en fonctions pures, sans dépendance.\nhandoffs:\n  - label: Faire vérifier par le testeur\n    agent: Testeur-QA\n    prompt: Lance tous les tests de tests.js, puis un test de mutation.\n    send: false\n---\nTu es un développeur JavaScript senior (vanilla, ES2022).\n- Tu implémentes uniquement ce que décrit docs/spec.md.\n- Tu ne modifies JAMAIS tests.js : si un test te semble faux,\n  tu l’expliques au lieu de le changer.\n- Une règle métier à la fois, puis tu t’arrêtes.\n- Tu termines par : fichiers modifiés, fonctions ajoutées, risques.`}
      />
    </Box>
    <Box x={1120} y={255} w={680} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {M12_AGENTS.map((a, i) => (
        <div key={a.nom} className={A.right} style={{ ...dl(150 + i * 120), background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '14px 20px', borderLeft: `6px solid ${STRONG[a.tone]}` }}>
          <Tag tone={a.tone} size={17} icon={a.icon}>{a.nom}</Tag>
          <div style={{ fontSize: 19, lineHeight: 1.35, color: C.ink, marginTop: 8 }}><Strong c={T[a.tone].fg}>Écrit :</Strong> {a.ecrit}</div>
          <div style={{ fontSize: 19, lineHeight: 1.35, color: C.ink, marginTop: 4 }}><Strong c={C.coral}>Jamais :</Strong> {a.jamais}</div>
        </div>
      ))}
      <Callout tone="pink" icon="shield" title="Pourquoi séparer les droits ?" cls={b.on(1)} size={20}>
        Un développeur qui écrit aussi ses tests finit par tester ce qu’il a codé, pas ce qui était demandé.
      </Callout>
    </Box>
  </Frame>
);

const M12_RELAIS: { qui: string; tone: Tone; icon: IconName; quoi: string; fichier: string }[] = [
  { qui: 'Vous', tone: 'pink', icon: 'user', quoi: 'Formulez le besoin', fichier: 'une phrase' },
  { qui: '@Analyste-PO', tone: 'blue', icon: 'doc', quoi: 'Spécifie', fichier: 'docs/spec.md' },
  { qui: '@Testeur-QA', tone: 'green', icon: 'flask', quoi: 'Tests d’abord (rouges)', fichier: 'tests.js' },
  { qui: '@Dev-JS', tone: 'violet', icon: 'code', quoi: 'Code jusqu’au vert', fichier: 'app.js' },
  { qui: '@Testeur-QA', tone: 'green', icon: 'search', quoi: 'Contre-vérifie', fichier: 'mutation' },
];

const M12_Orchestration: Page = () => (
  <Frame mod={12} kind="cours" beats={2}>
    <Title>Orchestrer : chaque agent passe le relais au suivant</Title>
    <Lede>Un « handoff » ajoute un bouton en fin de réponse : il bascule vers l’agent suivant avec un prompt pré-rempli.</Lede>
    <Box x={120} y={255} w={1680} style={{ display: 'flex', alignItems: 'stretch', gap: 10 }}>
      {M12_RELAIS.map((r, i) => (
        <div key={i} style={{ display: 'contents' }}>
          {i > 0 ? <FlowArrow w={44} /> : null}
          <div className={A.in} style={{ ...dl(100 + i * 110), flex: 1, minWidth: 0, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 16px', borderTop: `6px solid ${STRONG[r.tone]}`, textAlign: 'center' }}>
            <Icon name={r.icon} size={30} color={T[r.tone].fg} />
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 21, color: C.navy, marginTop: 6 }}>{r.qui}</div>
            <div style={{ fontSize: 19, color: C.ink, marginTop: 4 }}>{r.quoi}</div>
            <div style={{ fontFamily: mono, fontSize: 16, color: C.muted, marginTop: 6 }}>{r.fichier}</div>
          </div>
        </div>
      ))}
    </Box>
    <Box x={120} y={470} w={900}>
      <Code
        file=".github/agents/analyste-po.agent.md · en-tête"
        size={18}
        hi={[4, 5, 6, 7, 8]}
        code={`---\nname: Analyste-PO\ndescription: Transforme une demande en spec testable. Ne code jamais.\nhandoffs:\n  - label: Écrire les tests de la spec\n    agent: Testeur-QA\n    prompt: Écris dans tests.js les tests de docs/spec.md, sans toucher app.js.\n    send: false\n---`}
      />
    </Box>
    <Box x={1060} y={470} w={740} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Callout tone="blue" icon="compass" title="send: false · vous restez chef d’orchestre" size={21}>
        Le bouton pré-remplit le prompt sans l’envoyer : vous relisez le travail, ajustez la consigne, puis vous lancez le relais.
      </Callout>
      <Callout tone="yellow" icon="save" title="Un relais = un diff relu + un commit" cls={b.on(1)} size={21}>
        Si une passe casse quelque chose, vous revenez au commit précédent au lieu de négocier avec l’agent.
      </Callout>
      <Callout tone="violet" icon="loop" title="La boucle Dev ⇄ Testeur" cls={b.on(2)} size={21}>
        Tant qu’un test est rouge ou qu’une mutation survit, le relais repart vers @Dev-JS.
      </Callout>
    </Box>
  </Frame>
);

const M12_RefactoMulti: Page = () => (
  <Frame mod={12} kind="cours" beats={2}>
    <Title>Préparer le terrain : de 1 fichier géant à 4 fichiers aux rôles clairs</Title>
    <Lede>Refactoriser, c’est réorganiser le code sans rien changer pour l’utilisateur. Ici, c’est aussi ce qui permet de séparer les droits des agents.</Lede>
    <Box x={120} y={260} w={1680} style={{ display: 'flex', alignItems: 'stretch', gap: 18 }}>
      <Card title="Avant · taskflow-v4.html (un seul fichier)" icon="doc" tone="coral" d={100} style={{ flex: 0.85 }} bsz={21}>
        <Code size={18} style={{ marginTop: 8 }} code={`index.html (≈ 700 lignes)\n├─ <style>  ... CSS          </style>\n├─ <div>    ... HTML         </div>\n├─ <script> ... app          </script>\n└─ <script> ... auto-tests   </script>`} />
      </Card>
      <FlowArrow />
      <Card title="Après · le dossier taskflow dans VS Code" icon="folder" tone="green" cls={b.on(1)} style={{ flex: 1.15 }} bsz={21}>
        <Code
          size={18}
          style={{ marginTop: 8 }}
          code={`taskflow/\n├─ index.html   structure de la page\n├─ style.css    design, thèmes, animations\n├─ app.js       1. Données · 2. Règles · 3. UI   ← @Dev-JS\n├─ tests.js     auto-tests                       ← @Testeur-QA\n├─ docs/        spécifications                    ← @Analyste-PO\n├─ AGENTS.md\n└─ .github/  skills/  agents/`}
        />
      </Card>
    </Box>
    <Box x={120} y={680} w={1680}>
      <Bubble who="vous" tool="Prompt de découpage en mode Agent" cls={b.on(2)} size={22}>
        Découpe <Ic>index.html</Ic> en <Ic>index.html</Ic>, <Ic>style.css</Ic>, <Ic>app.js</Ic> et <Ic>tests.js</Ic> (panneau Auto-Tests et tous les tests), sans changer aucun comportement. Garde les 3 zones de <Ic>app.js</Ic>. Tous les tests doivent rester au vert.
      </Bubble>
    </Box>
  </Frame>
);

const M12_GitLocal: Page = () => (
  <Frame mod={12} kind="cours" beats={1}>
    <Title>Git dans VS Code : une photo du projet après chaque relais</Title>
    <Lede>Les agents écrivent vite et beaucoup. Sans point de sauvegarde entre deux passes, impossible de savoir qui a cassé quoi.</Lede>
    <Grid top={255} cols={3} gap={24} w={1060}>
      <Card title="1 · Initialiser" icon="git" tone="blue" d={100} bsz={20} pad={20}>
        Vue <Strong>Contrôle de code source</Strong> (<Ic>Ctrl+Maj+G</Ic>) → <Strong>Initialiser le dépôt</Strong>. Une seule fois par projet.
      </Card>
      <Card title="2 · Commiter" icon="save" tone="green" d={220} bsz={20} pad={20}>
        Message court qui dit <Strong c={C.green}>quoi et qui</Strong>, puis <Strong>Valider</Strong>. Ex. « tests sprints (rouges) ».
      </Card>
      <Card title="3 · Revenir" icon="reset" tone="coral" d={340} bsz={20} pad={20}>
        Clic sur un fichier modifié : le diff. <Strong c={C.coral}>Ignorer les modifications</Strong> : retour au dernier commit.
      </Card>
    </Grid>
    <Box x={1220} y={255} w={580}>
      <Term
        title="Les mêmes gestes en ligne de commande"
        size={19}
        lines={[
          '» git init',
          'Initialized empty Git repository',
          '» git add .',
          '» git commit -m "v4 : TaskFlow du Jour 2"',
          '[main (root-commit) 3f2a91c] v4 : TaskFlow du Jour 2',
          '» git log --oneline',
          '3f2a91c v4 : TaskFlow du Jour 2',
        ]}
      />
    </Box>
    <Box x={120} y={640} w={1060}>
      <Code
        file="L’historique visé en fin de journée"
        size={18}
        code={`a91e0d4  feat(dependances) : contre-vérifié, mutation tuée\n7c3b112  feat(dependances) : implémentation, 25/25\n52f8e9a  test(dependances) : 7 tests écrits, rouges\n1d0c6f3  docs(dependances) : spec relue, 7 critères\n3f2a91c  v4 : TaskFlow du Jour 2`}
      />
    </Box>
    <Box x={1220} y={640} w={580}>
      <Callout tone="yellow" icon="key" title="Votre filet de sécurité" cls={b.on(1)} size={21}>
        Un commit par relais d’agent. L’historique raconte qui a fait quoi : il servira aussi dans votre README et votre démo.
      </Callout>
    </Box>
  </Frame>
);

const M12_Pause: Page = () => <Pause mod={12} title="Pause matin" back="Reprise dans 15 minutes" minutes={15} />;

const M12_Lab12: Page = () => (
  <VibeLab
    mod={12}
    n="12.1"
    title="Monter l’équipe : projet découpé, Skill et trois agents"
    defi="skill"
    tools="VS Code · GitHub Copilot (agents personnalisés)"
    objective={
      <>
        Faire de TaskFlow un projet VS Code en 4 fichiers versionné avec Git, doté d’<PathChip>AGENTS.md</PathChip>, du Skill <PathChip>fonctionnalite-taskflow</PathChip> et des agents <Ic>@Analyste-PO</Ic>, <Ic>@Dev-JS</Ic> et <Ic>@Testeur-QA</Ic>, puis faire une répétition du relais.
      </>
    }
    minutes={50}
    crit={
      <>
        <CheckItem id="m12l1a">Après le découpage en 4 fichiers, tous les tests restent au vert</CheckItem>
        <CheckItem id="m12l1b">Les 3 agents apparaissent dans le menu du Chat et le Skill est présent</CheckItem>
        <CheckItem id="m12l1c">@Testeur-QA a ajouté 3 tests sans modifier app.js (vérifié dans le diff)</CheckItem>
        <CheckItem id="m12l1d">L’historique Git compte au moins 3 commits lisibles</CheckItem>
      </>
    }
    suivi="Points d’étape au micro à 15 min (découpage), 30 min (agents visibles) et 45 min (relais). Bloqué ? Partage d’écran 2 minutes !"
  >
    <WStep n={1}>
      Ouvrez le dossier <Ic>taskflow</Ic> avec <PathChip>taskflow-v4.html</PathChip> renommé <PathChip>index.html</PathChip>. Initialisez Git et commitez. En mode Agent, lancez le prompt de découpage en 4 fichiers, vérifiez les tests, commitez.
    </WStep>
    <WStep n={2}>
      Créez <PathChip>AGENTS.md</PathChip>, <PathChip>.github/skills/fonctionnalite-taskflow/SKILL.md</PathChip> et les 3 fichiers <PathChip>.github/agents/*.agent.md</PathChip> (modèles dans le clavardage). Commitez.
    </WStep>
    <WStep n={3}>
      <Strong>Répétition du relais :</Strong> avec <Ic>@Testeur-QA</Ic>, <Pr>« Audite deplacerTicket et importerTickets : ajoute dans tests.js 3 tests sur des cas limites non couverts. »</Pr> Un test rouge ? Passez le relais à <Ic>@Dev-JS</Ic>. Commitez.
    </WStep>
  </VibeLab>
);

const M12_QCM: Page = () => (
  <Frame mod={12} kind="qcm">
    <Title>QCM · Skills, agents et orchestration : les vrais pièges</Title>
    <QuizSeries y={190}>
      <QuizQ
        q="Vous collez votre recette de 60 lignes « ajouter une fonctionnalité » dans AGENTS.md plutôt que dans un Skill. Quel est l’effet principal ?"
        explain="AGENTS.md est lu à chaque requête : la recette encombre même « renomme ce bouton » et noie les règles courtes et vitales. Un Skill n’est chargé que lorsque la demande correspond."
      >
        <QOpt>Aucun : AGENTS.md et un Skill sont lus exactement de la même façon</QOpt>
        <QOpt ok>Elle est chargée à chaque requête, et dilue les règles importantes du projet</QOpt>
        <QOpt>Elle ne sera jamais lue : AGENTS.md est limité à 20 lignes</QOpt>
        <QOpt>Elle désactive les agents personnalisés</QOpt>
      </QuizQ>
      <QuizQ
        q={
          <>
            Ce Skill n’est jamais utilisé par vos agents. Cause la plus probable ?
            <QCode>{`---\nname: skill1\ndescription: Mon skill\n---`}</QCode>
          </>
        }
        explain="L’agent ne voit que l’en-tête et décide d’ouvrir le Skill d’après sa description. « Mon skill » ne correspond à aucune demande : il faut dire quand l’utiliser."
      >
        <QOpt>Le nom doit être écrit en majuscules</QOpt>
        <QOpt ok>La description ne dit pas à quelles demandes le Skill répond</QOpt>
        <QOpt>Un Skill ne fonctionne qu’en mode Ask</QOpt>
        <QOpt>Il manque un fichier SKILL.json à côté</QOpt>
      </QuizQ>
      <QuizQ
        q="Le test T3 est rouge. @Dev-JS répond « corrigé ✓ » ; le diff montre qu’il a changé, dans tests.js, l’attendu de false à true. Que faites-vous ?"
        explain="Le code doit satisfaire la spec, pas l’inverse. Rejetez le diff et renvoyez au testeur, qui tranche avec docs/spec.md : c’est le test ou la spec qui a tort, jamais par commodité."
      >
        <QOpt>J’accepte : tous les tests sont verts</QOpt>
        <QOpt ok>Je rejette le diff et renvoie au testeur pour trancher avec la spec</QOpt>
        <QOpt>Je supprime T3, qui bloque l’avancement</QOpt>
        <QOpt>Je demande au Dev d’entourer le code d’un try/catch</QOpt>
      </QuizQ>
      <QuizQ
        q="Pourquoi @Testeur-QA écrit-il les tests avant que @Dev-JS n’implémente ?"
        explain="Écrit d’après la spec et vu rouge, un test prouve qu’il vérifie la demande. Écrit après le code, il risque de photographier le comportement réel, bugs compris, et de passer toujours."
      >
        <QOpt>Parce que des tests écrits en premier s’exécutent plus vite</QOpt>
        <QOpt>Parce que VS Code refuse un handoff vers un agent sans tests</QOpt>
        <QOpt ok>Pour vérifier la demande, pas recopier ce que le code fait déjà</QOpt>
        <QOpt>Pour que le développeur puisse ensuite les adapter à son code</QOpt>
      </QuizQ>
      <QuizQ
        q={
          <>
            Pourquoi @Testeur-QA refuse-t-il cette fonction ?
            <QCode>{`function estEnRetard(ticket) {\n  return new Date(ticket.echeance) < new Date();\n}`}</QCode>
          </>
        }
        explain="new Date() dépend du jour où l’on lance le test : vert aujourd’hui, rouge demain. On passe la date du jour en paramètre, estEnRetard(ticket, aujourdhui), et le test fixe cette date."
      >
        <QOpt>Parce qu’on ne peut pas comparer deux dates avec &lt;</QOpt>
        <QOpt ok>Parce que son résultat dépend du jour où l’on lance le test</QOpt>
        <QOpt>Parce que new Date() ne fonctionne pas sur GitHub Pages</QOpt>
        <QOpt>Parce qu’une fonction métier doit afficher un console.log</QOpt>
      </QuizQ>
      <QuizQ
        q="Dans l’en-tête d’un agent, que change send: false sur un handoff ?"
        explain="Le bouton de relais bascule vers l’agent suivant et pré-remplit le prompt, sans l’envoyer : vous relisez le travail et ajustez la consigne avant de lancer la passe suivante."
      >
        <QOpt>L’agent suivant ne peut pas lire les fichiers du projet</QOpt>
        <QOpt ok>Le prompt du relais est pré-rempli mais pas envoyé : vous le relisez d’abord</QOpt>
        <QOpt>Le relais est désactivé jusqu’au prochain commit</QOpt>
        <QOpt>La réponse de l’agent n’est pas sauvegardée</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

const M12_Dejeuner: Page = () => <Pause mod={12} title="Pause déjeuner" back="Reprise à 14 h 00" minutes={90} />;

// ════════════════════════════════════════════════════════════════════════════
// MODULE 13 — Fonctionnalité phare orchestrée par 3 agents (5 pages)
// ════════════════════════════════════════════════════════════════════════════
const M13_Divider: Page = () => (
  <Divider mod={13} kicker="Jour 3 · Après-midi" title="La fonctionnalité phare, livrée par votre équipe d’agents">
    <Bullet size={30}>Choisir une fonctionnalité exigeante parmi trois</Bullet>
    <Bullet size={30}>Passer le relais : PO → Testeur → Développeur → Testeur</Bullet>
    <Bullet size={30}>Garder la main : périmètre, diffs relus, un commit par passe</Bullet>
  </Divider>
);
M13_Divider.transition = BLOOM;

const M13_FEATURES: { id: string; titre: string; verbe: string; icon: IconName; tone: Tone; us: string[]; piege: string; donnees: string }[] = [
  {
    id: 'A',
    titre: 'Sprints & burndown',
    verbe: 'Planifier',
    icon: 'chart',
    tone: 'blue',
    us: ['Créer un sprint : nom, dates, capacité en points', 'Y glisser des tickets, avec une jauge de capacité', 'Clôturer : le non-terminé revient au backlog', 'Burndown en SVG : restant vs ligne idéale'],
    piege: 'Capacité atteinte pile, ticket non estimé, sprint d’un seul jour (division par zéro de la ligne idéale).',
    donnees: 'sprints[] · ticket.sprintId',
  },
  {
    id: 'B',
    titre: 'Dépendances & blocages',
    verbe: 'Sécuriser',
    icon: 'link',
    tone: 'violet',
    us: ['Déclarer « bloqué par » un ou plusieurs tickets', 'Interdit d’entrer En cours si un bloquant n’est pas terminé', 'Badge 🔒 listant les bloquants', 'Supprimer un ticket nettoie toutes les références'],
    piege: 'Les cycles A → B → C → A : refusés, avec le cycle affiché dans le message.',
    donnees: 'ticket.bloquePar = []',
  },
  {
    id: 'C',
    titre: 'Échéances & calendrier',
    verbe: 'Anticiper',
    icon: 'calendar',
    tone: 'teal',
    us: ['Date d’échéance, badges « En retard » et « J-2 »', 'Tri et filtre par urgence', 'Vue calendrier mensuelle, mois par mois', 'Résumé des retards par colonne'],
    piege: 'Mois numérotés de 0 à 11, « 31 janvier + 1 mois », et la date du jour à injecter pour pouvoir tester.',
    donnees: 'ticket.echeance = null',
  },
];

const M13_Fonctionnalites: Page = () => (
  <Frame mod={13} kind="tp" beats={1}>
    <Title>Choisissez votre fonctionnalité phare : trois sujets, une même exigence</Title>
    <Lede>Chacune touche le modèle de données, impose une règle qui piège et demande des tests sérieux. Choisissez au micro : A, B ou C.</Lede>
    <Grid top={250} cols={3} gap={24}>
      {M13_FEATURES.map((f, i) => (
        <div key={f.id} className={A.in} style={{ ...dl(100 + i * 120), background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 24px', borderTop: `8px solid ${STRONG[f.tone]}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontFamily: display, fontWeight: 800, fontSize: 46, color: STRONG[f.tone], lineHeight: 1 }}>{f.id}</span>
            <div>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.navy }}>{f.titre}</div>
              <Tag tone={f.tone} size={15} icon={f.icon}>{f.verbe}</Tag>
            </div>
          </div>
          {f.us.map((u) => (
            <div key={u} style={{ display: 'flex', gap: 10, fontSize: 19, lineHeight: 1.33, color: C.ink }}>
              <Icon name="check" size={19} color={T[f.tone].fg} style={{ flex: 'none', marginTop: 3 }} />
              <span>{u}</span>
            </div>
          ))}
          <div style={{ background: T.coral.bg, borderRadius: 12, padding: '10px 14px', fontSize: 18, lineHeight: 1.35, color: C.ink }}>
            <Strong c={C.coral}>La règle qui piège :</Strong> {f.piege}
          </div>
          <div style={{ fontFamily: mono, fontSize: 16, color: C.muted }}>Données : {f.donnees}</div>
        </div>
      ))}
    </Grid>
    <Box x={120} y={730} w={1680}>
      <Callout tone="navy" icon="target" title="Même barre pour les trois" cls={b.on(1)} size={21}>
        Spec relue et réduite par vous, au moins 6 tests écrits avant le code, migration v4 → v5 de vos données d’hier, aucune régression.
      </Callout>
    </Box>
  </Frame>
);

const M13_PASSES: { qui: string; tone: Tone; icon: IconName; titre: string; fichier: string; msg: string; ok: number; ko: number; relais: string | null; vous: string }[] = [
  {
    qui: '@Analyste-PO',
    tone: 'blue',
    icon: 'doc',
    titre: 'Spécifier',
    fichier: 'docs/spec-dependances.md',
    msg: '8 critères d’acceptation, dont : « A bloqué par B et B bloqué par A → refus, message « Cycle : A → B → A » ». Hors périmètre : dépendances entre projets.',
    ok: 18,
    ko: 0,
    relais: 'Écrire les tests de la spec',
    vous: 'Je retire un critère trop ambitieux (le chemin critique) : il en reste 7.',
  },
  {
    qui: '@Testeur-QA',
    tone: 'green',
    icon: 'flask',
    titre: 'Tests d’abord',
    fichier: 'tests.js · +7 tests',
    msg: '7 tests ajoutés d’après la spec. Ils sont rouges : ajouterDependance() n’existe pas encore. C’est attendu.',
    ok: 18,
    ko: 7,
    relais: 'Implémenter pour faire passer les tests',
    vous: 'Je vérifie qu’ils sont rouges pour la bonne raison, puis je commite.',
  },
  {
    qui: '@Dev-JS',
    tone: 'violet',
    icon: 'code',
    titre: 'Implémenter',
    fichier: 'app.js · zones 1, 2 et 3',
    msg: 'ajouterDependance() et detecterCycle() (parcours en profondeur), migration v4 → v5 (bloquePar: []), badge 🔒 sur la carte. tests.js non modifié.',
    ok: 25,
    ko: 0,
    relais: 'Faire vérifier par le testeur',
    vous: 'Je relis le diff : aucune ligne de tests.js n’a bougé. Commit.',
  },
  {
    qui: '@Testeur-QA',
    tone: 'green',
    icon: 'search',
    titre: 'Contre-vérifier',
    fichier: 'tests.js · +1 test',
    msg: 'Mutation : peutDemarrer() renvoie toujours true → 25/25 restent verts ! Trou dans le filet : test 26 ajouté (ticket bloqué par un ticket « En cours »).',
    ok: 26,
    ko: 0,
    relais: 'Rendre la main',
    vous: 'Je relance la mutation : le test 26 passe au rouge. Le filet tient.',
  },
  {
    qui: 'Vous',
    tone: 'pink',
    icon: 'user',
    titre: 'Valider',
    fichier: 'git commit',
    msg: 'feat(dependances) : blocages + détection de cycles, 8 tests, migration v5.',
    ok: 26,
    ko: 0,
    relais: null,
    vous: 'Démo à la main : je crée un cycle, il est refusé. Ma sauvegarde d’hier se recharge.',
  },
];

const M13_SimOrchestration: Page = () => {
  const [step, setStep] = useState(0);
  const p = M13_PASSES[step];
  const total = p.ok + p.ko;
  return (
    <Frame mod={13} kind="demo">
      <Title>Simulateur : une fonctionnalité, cinq passes, un relais à chaque fois</Title>
      <Lede>Exemple avec la fonctionnalité B, Dépendances. Cliquez sur chaque passe : qui travaille, sur quel fichier, et l’état des tests.</Lede>
      <div style={{ position: 'absolute', left: 120, top: 250, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 16 }}>
        {M13_PASSES.map((s, i) => (
          <button
            key={i}
            type="button"
            data-osd-interactive
            onClick={(e) => {
              e.currentTarget.blur();
              setStep(i);
            }}
            style={{
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              borderRadius: 16,
              padding: '14px 18px',
              fontFamily: body,
              background: i === step ? T[s.tone].bg : C.card,
              boxShadow: i === step ? `inset 0 0 0 3px ${STRONG[s.tone]}` : SHADOW_SM,
              opacity: i <= step ? 1 : 0.55,
              transition: `all 200ms ${EASE}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: STRONG[s.tone] }}>{i + 1}</span>
              <Icon name={s.icon} size={24} color={T[s.tone].fg} />
              <span style={{ fontFamily: display, fontWeight: 800, fontSize: 20, color: C.navy }}>{s.titre}</span>
            </div>
            <div style={{ fontSize: 18, color: C.soft, marginTop: 6 }}>{s.qui}</div>
          </button>
        ))}
      </div>
      <Box x={120} y={400} w={1060}>
        <UiMock title={`Chat VS Code · ${p.qui}`} tool={p.fichier} tone={p.tone}>
          <div key={step} className={A.fade} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 22, lineHeight: 1.42, color: C.ink, minHeight: 130 }}>{p.msg}</div>
            {p.relais ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <Btn icon="arrow" tone={M13_PASSES[step + 1].tone} size={19} onClick={() => setStep(step + 1)}>
                  {p.relais} → {M13_PASSES[step + 1].qui}
                </Btn>
                <span style={{ fontSize: 17, color: C.muted }}>bouton de handoff · send: false</span>
              </div>
            ) : (
              <Btn icon="reset" ghost tone="grey" size={19} onClick={() => setStep(0)}>
                Rejouer depuis la spec
              </Btn>
            )}
          </div>
        </UiMock>
      </Box>
      <Box x={1220} y={400} w={580} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '18px 22px' }}>
          <Eyebrow c={C.muted} size={17}>tests.js</Eyebrow>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 6 }}>
            <span style={{ fontFamily: display, fontWeight: 800, fontSize: 52, color: p.ko ? C.coral : C.green }}>
              {p.ok} / {total}
            </span>
            <span style={{ fontSize: 20, color: C.soft }}>{p.ko ? `${p.ko} rouges` : 'tous verts'}</span>
          </div>
          <div style={{ display: 'flex', height: 16, borderRadius: 8, overflow: 'hidden', marginTop: 10, background: C.panel }}>
            <div style={{ width: `${(p.ok / total) * 100}%`, background: C.green, transition: `width 400ms ${EASE}` }} />
            <div style={{ width: `${(p.ko / total) * 100}%`, background: C.coral, transition: `width 400ms ${EASE}` }} />
          </div>
        </div>
        <Callout tone="pink" icon="user" title="Votre rôle à cette passe" size={20}>
          <span key={step}>{p.vous}</span>
        </Callout>
      </Box>
    </Frame>
  );
};

const M13_LabFeature: Page = () => (
  <VibeLab
    mod={13}
    n="TP Final"
    kind="tp"
    title="Phase 1 · Livrer la fonctionnalité phare avec vos agents"
    defi="skill"
    tools="VS Code · GitHub Copilot (agents personnalisés)"
    objective={
      <>
        Livrer la fonctionnalité <strong>A, B ou C</strong> en faisant passer le relais <Ic>@Analyste-PO</Ic> → <Ic>@Testeur-QA</Ic> → <Ic>@Dev-JS</Ic> → <Ic>@Testeur-QA</Ic>, avec un commit à chaque passe, sans casser TaskFlow.
      </>
    }
    minutes={60}
    crit={
      <>
        <CheckItem id="tpf1">J’ai relu et réduit docs/spec.md : 6 à 8 critères d’acceptation</CheckItem>
        <CheckItem id="tpf2">Au moins 6 nouveaux tests, écrits avant le code et vus rouges</CheckItem>
        <CheckItem id="tpf3">Tout est vert, et aucun diff de @Dev-JS ne touche tests.js</CheckItem>
        <CheckItem id="tpf4">Ma sauvegarde d’hier se recharge sans erreur (migration v4 → v5)</CheckItem>
      </>
    }
    suivi="Points d’étape au micro à 15 min (spec), 30 min (tests rouges) et 45 min (vert). Bloqué ? Partage d’écran 2 minutes !"
  >
    <WStep n={1}>
      <Strong>0–15 min ·</Strong> Avec <Ic>@Analyste-PO</Ic> : <Pr>« Spécifie la fonctionnalité [A, B ou C] pour TaskFlow en suivant le Skill fonctionnalite-taskflow. »</Pr> Relisez <PathChip>docs/spec.md</PathChip>, coupez ce qui dépasse, commitez.
    </WStep>
    <WStep n={2}>
      <Strong>15–45 min ·</Strong> Relais vers <Ic>@Testeur-QA</Ic> (tests rouges, commit), puis vers <Ic>@Dev-JS</Ic>, une règle à la fois jusqu’au vert (commit). <Strong c={C.coral}>Refusez</Strong> tout diff du Dev qui touche <Ic>tests.js</Ic>.
    </WStep>
    <WStep n={3}>
      <Strong>45–60 min ·</Strong> Relais final vers <Ic>@Testeur-QA</Ic> : test de mutation et chargement de votre sauvegarde d’hier. Déroulez la spec à la main dans l’interface, commitez.
    </WStep>
  </VibeLab>
);

const M13_Pause: Page = () => <Pause mod={13} title="Pause après-midi" back="Reprise dans 15 minutes" minutes={15} />;

// ════════════════════════════════════════════════════════════════════════════
// MODULE 14 — Publier sur GitHub Pages, README, démo finale & clôture
// ════════════════════════════════════════════════════════════════════════════
const M14_Divider: Page = () => (
  <Divider mod={14} kicker="Jour 3 · Fin d’après-midi" title="Publier : de votre poste à une adresse publique">
    <Bullet size={30}>Pousser le dépôt sur GitHub depuis VS Code</Bullet>
    <Bullet size={30}>Déployer sur GitHub Pages, sans serveur ni installation</Bullet>
    <Bullet size={30}>Démontrer TaskFlow en ligne, devant tout le groupe</Bullet>
  </Divider>
);
M14_Divider.transition = BLOOM;

const M14_GitHubPush: Page = () => (
  <Frame mod={14} kind="cours" beats={1}>
    <Title>Pousser le code sur GitHub depuis VS Code</Title>
    <Lede>Votre dépôt local a déjà son historique. Il suffit de lui donner une copie en ligne, puis de la synchroniser à chaque commit.</Lede>
    <Box x={120} y={255} w={1000} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <WStep n={1} d={100}>
        <Strong>Se connecter :</Strong> icône <Strong>Comptes</Strong> en bas à gauche de VS Code → <Strong>Se connecter avec GitHub</Strong>. Chacun s’authentifie lui-même dans son navigateur.
      </WStep>
      <WStep n={2} d={220}>
        <Strong>Publier :</Strong> vue Contrôle de code source → <Strong>Publier sur GitHub</Strong> → nom <Ic>taskflow</Ic> → <Strong>dépôt public</Strong>.
      </WStep>
      <WStep n={3} d={340}>
        <Strong>Ensuite :</Strong> chaque commit → bouton <Strong>Synchroniser les modifications</Strong> (push). Le dépôt en ligne suit votre historique.
      </WStep>
    </Box>
    <Box x={1160} y={255} w={640}>
      <Term
        title="Équivalent en ligne de commande"
        size={18}
        lines={[
          '» git remote add origin https://github.com/<vous>/taskflow.git',
          '» git branch -M main',
          '» git push -u origin main',
          'Enumerating objects: 42, done.',
          'To https://github.com/<vous>/taskflow.git',
          ' * [new branch]      main -> main',
        ]}
      />
    </Box>
    <Box x={120} y={610} w={1680}>
      <Callout tone="coral" icon="shield" title="Public veut dire lisible par tous, historique compris" cls={b.on(1)} size={23}>
        Avant de pousser : uniquement des <Strong c={C.coral}>données fictives</Strong>, aucun mot de passe, aucune clé d’API, aucun export réel. Un secret supprimé dans un commit récent reste visible dans les anciens.
      </Callout>
    </Box>
  </Frame>
);

const M14_GitHubPages: Page = () => (
  <Frame mod={14} kind="cours" beats={2}>
    <Title>Déployer sur GitHub Pages : quatre réglages… et quatre pièges</Title>
    <Lede>GitHub Pages publie gratuitement un dépôt public comme site web. TaskFlow n’a besoin d’aucun serveur.</Lede>
    <Box x={120} y={255} w={820}>
      <UiMock title="Dépôt taskflow · Settings → Pages" tool="github.com" tone="navy" d={100}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 19, color: C.ink }}>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 21, color: C.navy }}>Build and deployment</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 90, color: C.muted }}>Source</span>
            <Tag tone="blue" size={16}>Deploy from a branch ▾</Tag>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 90, color: C.muted }}>Branch</span>
            <Tag tone="blue" size={16}>main ▾</Tag>
            <Tag tone="blue" size={16}>/ (root) ▾</Tag>
            <Tag tone="green" size={16}>Save</Tag>
          </div>
          <div style={{ background: T.green.bg, borderRadius: 10, padding: '10px 14px', fontSize: 18 }}>
            ✓ Your site is live at <Strong c={T.green.fg}>https://&lt;vous&gt;.github.io/taskflow/</Strong>
          </div>
        </div>
      </UiMock>
      <div className={A.in} style={{ ...dl(250), marginTop: 16, fontSize: 20, lineHeight: 1.4, color: C.soft }}>
        Comptez une à deux minutes : l’onglet <Strong>Actions</Strong> montre le déploiement « pages build and deployment ». Chaque nouveau push redéploie automatiquement.
      </div>
    </Box>
    <Box x={980} y={255} w={820} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
      <Card title="1 · Page 404" icon="alert" tone="coral" d={150} bsz={18} pad={18}>
        <Ic>index.html</Ic> doit être <Strong>à la racine</Strong> et en minuscules.
      </Card>
      <Card title="2 · Styles absents" icon="alert" tone="coral" d={230} bsz={18} pad={18}>
        <Ic>Style.css</Ic> ≠ <Ic>style.css</Ic> : Windows tolère la casse, GitHub Pages non.
      </Card>
      <Card title="3 · Chemin absolu" icon="link" tone="coral" cls={b.on(1)} bsz={18} pad={18}>
        <Ic>/style.css</Ic> vise <Ic>&lt;vous&gt;.github.io/style.css</Ic>. Écrivez <Ic>style.css</Ic> ou <Ic>./style.css</Ic>.
      </Card>
      <Card title="4 · « Mes tickets ont disparu »" icon="database" tone="violet" cls={b.on(1)} bsz={18} pad={18}>
        <Ic>localStorage</Ic> dépend de l’adresse : en ligne, TaskFlow repart des données de démo. Normal.
      </Card>
    </Box>
    <Box x={980} y={640} w={820}>
      <Callout tone="blue" icon="search" title="Le réflexe de vérification" cls={b.on(2)} size={20}>
        Ouvrez l’URL en fenêtre privée, puis <Ic>F12</Ic> → Console et Réseau : aucune erreur 404.
      </Callout>
    </Box>
  </Frame>
);

const CODE_README_FINAL = `# TaskFlow · Kanban de gestion de projet co-créé avec l’IA
Démo en ligne : https://<votre-compte>.github.io/taskflow/

## 1. Objectif
Backlog et Kanban : limites WIP, import CSV, tableau de bord, glisser-déposer, sauvegarde locale et [fonctionnalité phare].

## 2. Lancer le projet
Via le lien ci-dessus, ou en local en ouvrant index.html. Aucune installation.

## 3. Architecture
- index.html · style.css · app.js (3 zones) · tests.js (auto-tests)
- docs/spec-<fonctionnalité>.md : spécification validée
- AGENTS.md · .github/skills/ · .github/agents/ : consignes des agents

## 4. Rôle de l’IA & vérifications humaines
- Agents : @Analyste-PO (spec), @Testeur-QA (tests), @Dev-JS (code).
- Mes décisions : périmètre réduit à 7 critères, 2 diffs refusés.
- Mes vérifications : 26 tests verts, mutation tuée, migration v5 testée.`;

const M14_ReadmeRoleIA: Page = () => (
  <Frame mod={14} kind="cours" beats={1}>
    <Title>Le README.md : présenter le projet, et qui a fait quoi</Title>
    <Lede>C’est la première chose que l’on voit sur votre dépôt GitHub. Quatre parties, honnêtes et vérifiables.</Lede>
    <Box x={120} y={250} w={1060}>
      <Code file="README.md · modèle à personnaliser" size={17} wrap hi={[2, 16, 17, 18]} code={CODE_README_FINAL} />
    </Box>
    <Box x={1220} y={250} w={580} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card title="Pourquoi détailler le rôle de l’IA ?" icon="checkCircle" tone="green" bsz={21}>
        <Col gap={10}>
          <div><Strong c={C.green}>Transparence :</Strong> vous montrez ce que les agents ont produit.</div>
          <div><Strong c={C.green}>Preuve de maîtrise :</Strong> vos décisions (périmètre coupé, diffs refusés) et vos vérifications sont ce qui fait la qualité.</div>
        </Col>
      </Card>
      <Callout tone="violet" icon="bot" title="Faites-le rédiger, puis vérifiez" cls={b.on(1)} size={21}>
        Avec <Ic>@Analyste-PO</Ic> : <Pr>« Mets à jour README.md selon cette structure, à partir de docs/spec.md et de l’historique Git. »</Pr> Chaque chiffre annoncé doit être vrai.
      </Callout>
    </Box>
  </Frame>
);

const M14_LabPublier: Page = () => (
  <VibeLab
    mod={14}
    n="TP Final"
    kind="tp"
    title="Phase 2 · Publier TaskFlow sur GitHub Pages"
    defi="construire"
    tools="VS Code · GitHub · GitHub Pages"
    objective={
      <>
        Mettre TaskFlow en ligne à l’adresse <Ic>https://&lt;vous&gt;.github.io/taskflow/</Ic>, avec votre fonctionnalité phare, des tests verts et un <PathChip>README.md</PathChip> qui pointe vers la démo.
      </>
    }
    minutes={25}
    crit={
      <>
        <CheckItem id="tpf5">Mon dépôt public a index.html à la racine et aucune donnée réelle</CheckItem>
        <CheckItem id="tpf6">L’URL s’affiche avec styles et scripts : F12 ne montre aucune erreur 404</CheckItem>
        <CheckItem id="tpf7">Ma fonctionnalité phare et le panneau Auto-Tests marchent en ligne</CheckItem>
        <CheckItem id="tpf8">Le README.md commence par le lien vers la démo en ligne</CheckItem>
      </>
    }
    suivi="Point d’étape à 10 min (dépôt publié). GitHub inaccessible depuis votre poste d’entreprise ? Dites-le au micro : plan B en partage d’écran."
  >
    <WStep n={1}>
      <Strong>Contrôle avant publication :</Strong> avec <Ic>@Testeur-QA</Ic>, <Pr>« Vérifie que le projet est prêt pour GitHub Pages : chemins relatifs, casse des noms de fichiers, aucune donnée réelle ni secret, tests verts. »</Pr> Corrigez, commitez.
    </WStep>
    <WStep n={2}>
      <Strong>Publier :</Strong> Contrôle de code source → <Strong>Publier sur GitHub</Strong> (dépôt public <Ic>taskflow</Ic>), puis sur github.com : <Strong>Settings → Pages → main / (root) → Save</Strong>.
    </WStep>
    <WStep n={3}>
      <Strong>Vérifier en ligne :</Strong> ouvrez l’URL en fenêtre privée, déroulez votre spec. Ajoutez le lien en tête du <PathChip>README.md</PathChip>, commitez, synchronisez : la page se met à jour en une minute.
    </WStep>
  </VibeLab>
);

const M14_ChecklistDemo: Page = () => (
  <Frame mod={14} kind="demo">
    <Title>Checklist : votre TaskFlow est-il prêt pour la démo ?</Title>
    <Lede>Comptez vos points pour vous-même ; je coche à l’écran pour illustrer le score.</Lede>
    <Checklist>
      <Box x={120} y={255} w={1060} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CheckItem id="ck1" w={2} size={22}>1 · Projet en 4 fichiers + AGENTS.md, un Skill et trois agents (2 pts)</CheckItem>
        <CheckItem id="ck2" w={2} size={22}>2 · Fonctionnalité phare livrée par le relais PO → Testeur → Dev (2 pts)</CheckItem>
        <CheckItem id="ck3" w={2} size={22}>3 · 6 tests ou plus écrits avant le code, tous verts, mutation vérifiée (2 pts)</CheckItem>
        <CheckItem id="ck4" w={1} size={22}>4 · Sauvegarde d’hier rechargée sans erreur (migration v5) (1 pt)</CheckItem>
        <CheckItem id="ck5" w={1} size={22}>5 · Historique Git lisible : un commit par passe d’agent (1 pt)</CheckItem>
        <CheckItem id="ck6" w={2} size={22}>6 · En ligne sur GitHub Pages + README avec lien et rôle de l’IA (2 pts)</CheckItem>
      </Box>
      <Box x={1220} y={255} w={580}>
        <CheckScore
          max={10}
          label="Prêt pour la démo"
          levels={[
            { min: 0, text: 'En construction : avancez passe par passe.', tone: 'coral' },
            { min: 5, text: 'Solide ! Finalisez la mise en ligne et le README.', tone: 'yellow' },
            { min: 8, text: 'Prêt pour le showtime : livré, testé et en ligne !', tone: 'green' },
          ]}
        />
      </Box>
    </Checklist>
  </Frame>
);

const M14_Restitution: Page = () => (
  <Frame mod={14} kind="tp" beats={1}>
    <Title>Grandes démonstrations finales : TaskFlow, en ligne !</Title>
    <Lede>Partage d’écran individuel de 4 à 5 minutes, depuis votre adresse GitHub Pages. Le groupe peut tester en même temps que vous.</Lede>
    <Box x={120} y={255} w={820}>
      <Card title="Le fil de votre démonstration (4 à 5 min)" icon="rocket" tone="violet" d={100} bsz={22}>
        <Col gap={10}>
          <div><Strong>1. En ligne (2 min) :</Strong> votre URL, la fonctionnalité phare, et une règle qui refuse une action interdite.</div>
          <div><Strong>2. L’orchestration (1 min 30) :</Strong> <Ic>docs/spec.md</Ic>, un diff que vous avez refusé, l’historique Git.</div>
          <div><Strong>3. Le recul (1 min) :</Strong> votre <Ic>README.md</Ic> et le bug que les tests ont attrapé.</div>
        </Col>
        <div style={{ marginTop: 14 }}>
          <Timer id="restit-j3" minutes={5} />
        </div>
      </Card>
    </Box>
    <Box x={980} y={255} w={820}>
      <Card title="Grille d’appréciation finale" icon="star" tone="green" d={220} bsz={22}>
        <Col gap={12}>
          <div><Strong c={C.green}>Utilité &amp; ergonomie :</Strong> l’outil est clair, fluide et utile à un chef de projet.</div>
          <div><Strong c={C.green}>Fondations :</Strong> données, règles métier et tests sont compris, pas seulement générés.</div>
          <div><Strong c={C.green}>Orchestration :</Strong> rôles respectés, tests avant le code, un commit par passe.</div>
          <div><Strong c={C.green}>Mise en ligne &amp; recul :</Strong> URL fonctionnelle et README honnête sur le rôle de l’IA.</div>
        </Col>
      </Card>
    </Box>
    <Box x={120} y={790} w={1680}>
      <Callout tone="pink" icon="link" title="Déposez votre URL dans le clavardage" cls={b.on(1)} size={24}>
        Chacun peut ouvrir les TaskFlow des autres pendant les démos. Après chaque passage : un point fort au micro !
      </Callout>
    </Box>
  </Frame>
);

const M14_Bilan3J: Page = () => (
  <Frame mod={14} kind="bilan">
    <Title>Bilan des 3 jours &amp; votre feuille de route après la formation</Title>
    <Lede>Vous repartez avec une méthode complète pour transformer vos idées en mini-applications fiables avec l’IA.</Lede>
    <Grid top={255} cols={3} gap={26}>
      <Card title="Dès la semaine prochaine" icon="play" tone="blue" d={100} bsz={22}>
        <Col gap={10}>
          <div>• Créer un petit outil ou simulateur utile pour votre activité quotidienne</div>
          <div>• Réutiliser votre structure en <Strong>5 briques de prompt</Strong></div>
          <div>• Toujours exiger le découpage en <Strong>3 zones</Strong> et le panneau d’<Strong>Auto-Tests</Strong></div>
        </Col>
      </Card>
      <Card title="À 30 jours" icon="layers" tone="violet" d={220} bsz={22}>
        <Col gap={10}>
          <div>• Constituer votre bibliothèque personnelle de 3 ou 4 <PathChip>SKILL.md</PathChip> dans VS Code</div>
          <div>• Affiner vos agents <Ic>@Analyste-PO</Ic>, <Ic>@Dev-JS</Ic> et <Ic>@Testeur-QA</Ic></div>
          <div>• Partager l’URL GitHub Pages de vos outils avec vos collègues</div>
        </Col>
      </Card>
      <Card title="Pour aller plus loin" icon="rocket" tone="green" d={340} bsz={22}>
        <Col gap={10}>
          <div>• Livrer une 2e fonctionnalité phare avec votre équipe d’agents</div>
          <div>• Connecter une API publique ouverte (météo, Open Data)</div>
          <div>• Approfondir JavaScript ou Python avec votre agent tuteur</div>
        </Col>
      </Card>
    </Grid>
    <Box x={120} y={735} w={1680}>
      <Callout tone="navy" icon="compass" title="La phrase à garder en tête" d={500} size={25}>
        « <Strong>L’IA générative multiplie votre vitesse ; votre compréhension de la logique et des tests garantit votre liberté.</Strong> »
      </Callout>
    </Box>
  </Frame>
);

const M14_AutoPosFinal: Page = () => (
  <Frame mod={14} kind="bilan">
    <Title>Auto-positionnement final &amp; évaluations Docaposte</Title>
    <Lede>Votez à voix haute (1 à 4) pour mesurer le chemin parcouru depuis lundi matin !</Lede>
    <Poll y={260} w={1060}>
      <PollRow id="f1" tone="blue" icon="compass" label="1 · Je comprends les bases et je sais guider l’IA sur un exemple simple" />
      <PollRow id="f2" tone="teal" icon="code" label="2 · Je sais lire et modifier les variables, conditions et données dans le code généré" />
      <PollRow id="f3" tone="green" icon="checkCircle" label="3 · Je crée une mini-app UI complète et je la vérifie avec des auto-tests" />
      <PollRow id="f4" tone="violet" icon="rocket" label="4 · Je suis autonome avec ChatGPT/Claude/Gemini et VS Code (Agents & Skills) !" />
    </Poll>
    <Box x={1220} y={260} w={580}>
      <Card title="Modalités d’évaluation Docaposte" icon="checkCircle" tone="green" d={250} bsz={22}>
        <Col gap={12}>
          <div><Strong>1. Auto-positionnement final</Strong> dans votre extranet apprenant pour mesurer vos acquis.</div>
          <div><Strong>2. Questionnaire « à chaud »</Strong> aujourd’hui en fin de session (votre avis est précieux !).</div>
          <div><Strong>3. Questionnaire « à froid » à 45 jours</Strong> pour évaluer la mise en pratique dans votre quotidien.</div>
        </Col>
      </Card>
    </Box>
  </Frame>
);

const M14_Merci: Page = () => (
  <Cover
    mod={14}
    day={3}
    signature
    trainer
    eyebrow="Formation Vibe Coding · Docaposte Institute · 3 jours"
    sub="Bravo pour vos réalisations et votre curiosité tout au long de ces trois jours. Continuez à imaginer, prompter, inspecter et tester !"
  >
    <span style={{ color: C.plum }}>Merci !</span>
    <br />
    À très bientôt
  </Cover>
);
M14_Merci.transition = BLOOM;

const PAGES_J3: Page[] = [J3_Cover, J3_QuizRappel];
const PAGES_M11: Page[] = [M11_Divider, M11_PourquoiVSCode, M11_TourVSCode, M11_TroisModes, M11_DragModes, M11_DiffReview];
const PAGES_M12: Page[] = [M12_Divider, M12_PyramideContexte, M12_FichierInstructions, M12_SkillsExplique, M12_AgentsExplique, M12_Orchestration, M12_RefactoMulti, M12_GitLocal, M12_Pause, M12_Lab12, M12_QCM, M12_Dejeuner];
const PAGES_M13: Page[] = [M13_Divider, M13_Fonctionnalites, M13_SimOrchestration, M13_LabFeature, M13_Pause];
const PAGES_M14: Page[] = [M14_Divider, M14_GitHubPush, M14_GitHubPages, M14_ReadmeRoleIA, M14_LabPublier, M14_ChecklistDemo, M14_Restitution, M14_Bilan3J, M14_AutoPosFinal, M14_Merci];

const NOTES_J3: string[] = [
  // J3_Cover
  `⏱ 8 min · OUVERTURE JOUR 3 & QUESTIONS DE LA VEILLE

OBJECTIF — Accueillir les participants pour la 3e journée et annoncer le passage dans VS Code avec les Agents et les Skills.

DIRE — « Bonjour à toutes et à tous, bienvenue dans cette troisième et dernière journée ! Pendant deux jours, vous avez appris toutes les bases du code et des données en co-créant des mini-applications dans le navigateur avec ChatGPT, Claude ou Gemini. Aujourd’hui, nous passons dans l’atelier professionnel : VS Code. Ce matin, vous montez une équipe de trois agents — un Product Owner, un développeur JavaScript et un testeur — guidée par un Skill. Cet après-midi, cette équipe livre une nouvelle fonctionnalité de TaskFlow, et vous publiez le tout sur GitHub Pages pour la démo finale ! »

ANIMATION — Vérifier que chacun a son dossier contenant le fichier taskflow-v4.html d’hier, renommé index.html, VS Code ouvert avec GitHub Copilot actif, et un compte GitHub accessible depuis son poste (sinon, le signaler dès maintenant : plan B en partage d’écran).

TRANSITION — « Commençons par notre QCM éclair de réactivation du Jour 2. »`,
  // J3_QuizRappel
  `⏱ 7 min · QCM DE RÉACTIVATION JOUR 2

OBJECTIF — Réactiver tableaux d’objets, localStorage + JSON, cas limites et confidentialité des données.

DIRE — « Quatre questions : votez à voix haute avec A, B, C ou D. »

ANIMATION — Parcourir les 4 questions.

TRANSITION — « Ouvrons le Module 11 : découvrir VS Code et l’IA intégrée au projet. »`,
];

const NOTES_M11: string[] = [
  // M11_Divider
  `⏱ 1 min · MODULE 11

DIRE — « Module 11 : passer de l’outil web à VS Code sans aucun stress. Vous allez voir pourquoi cet environnement rend le Vibe Coding dix fois plus confortable dès qu’une application grandit. »

TRANSITION — « Comparons tout de suite le navigateur et VS Code. »`,
  // M11_PourquoiVSCode
  `⏱ 5 min · POURQUOI PASSER À VS CODE ?

OBJECTIF — Comprendre les 3 avantages de VS Code : multi-fichiers, modification directe avec Diff, et mémoire permanente via AGENTS.md/Skills.

DIRE — « Dans le navigateur, tout tenait dans un seul fichier de 400 lignes et il fallait copier-coller. Dans VS Code, vous ouvrez un simple dossier sur votre ordinateur : l’IA voit tous vos fichiers (index.html, style.css, app.js, README.md), les modifie directement sous vos yeux en surlignant les changements, et retient vos règles grâce aux fichiers AGENTS.md et SKILL.md ! »

ANIMATION — → beat 1 : encadré vert rassurant.

TRANSITION — « Faisons la visite guidée de VS Code en 4 zones seulement. »`,
  // M11_TourVSCode
  `⏱ 7 min · VISITE GUIDÉE DE VS CODE (4 HOTSPOTS)

OBJECTIF — Démystifier l’interface de VS Code en montrant les 4 seules zones utiles en Vibe Coding.

DIRE — « Oubliez tous les boutons techniques : vous n’avez besoin que de quatre zones. Zone 1 à gauche : l’explorateur qui montre les fichiers de votre dossier. Zone 2 au centre : le fichier ouvert avec les propositions de l’IA en vert (ajouté) et en rouge (supprimé), et deux boutons Accepter ou Annuler. Zone 3 à droite : le panneau Chat où vous écrivez vos consignes en français. Et Zone 4 : votre navigateur habituel pour voir le rendu ! »

ANIMATION — Cliquer sur les Hotspots 1, 2, 3 et 4 (ou avancer avec → beats 1 à 4), puis montrer rapidement votre vrai VS Code en partage d’écran.

TRANSITION — « Dans ce panneau de Chat à droite, vous avez 3 modes : Ask, Edit et Agent. »`,
  // M11_TroisModes
  `⏱ 5 min · LES 3 MODES : ASK, EDIT, AGENT

OBJECTIF — Savoir choisir entre Ask, Edit et Agent selon son intention.

DIRE — « Trois modes très simples. Le mode Ask est en lecture seule : parfait pour demander “explique-moi cette fonction” ou “donne-moi 3 idées” sans risquer de modifier vos fichiers. Le mode Edit (ou Inline) retouche un passage précis dans un fichier. Et le mode Agent est le mode roi du Vibe Coding : il peut créer ou modifier plusieurs fichiers d’un coup et appliquer vos Skills ! »

ANIMATION — → beat 1 : règle mémo en bas de page.

TRANSITION — « Entraînons-nous à choisir le bon mode avec un jeu de tri ! »`,
  // M11_DragModes
  `⏱ 6 min · JEU DE TRI : ASK, EDIT OU AGENT ? (DRAG)

OBJECTIF — Classer 6 situations concrètes dans la bonne colonne (Ask, Edit ou Agent).

DIRE — « Six demandes en bas de l’écran. Pour chacune, dites-moi à voix haute : Ask, Edit ou Agent ? Je déplace l’étiquette dans la colonne que vous me dictez ! »

ANIMATION — Déplacer chaque étiquette selon les réponses orales des participants (Ask : 1 et 5 ; Edit : 3 et 6 ; Agent : 2 et 4).

TRANSITION — « Voyons maintenant le geste de sécurité numéro 1 dans VS Code : lire un Diff. »`,
  // M11_DiffReview
  `⏱ 5 min · LIRE UN DIFF VERT / ROUGE AVANT D’ACCEPTER

OBJECTIF — Prendre l’habitude d’inspecter les lignes vertes et rouges avant de cliquer sur Accepter.

DIRE — « Quand l’Agent modifie un fichier, il affiche un Diff : en rouge ce qu’il retire, en vert ce qu’il ajoute. Ici, on voit en une seconde qu’il a simplement ajouté la ligne if (total === 0) return 0; sans rien casser autour. On clique sur Accepter ! Et si jamais le résultat ne vous plaît pas, le bouton Annuler (ou Ctrl+Z) revient en arrière instantanément. »

ANIMATION — → beat 1 : encadré Annuler / Ctrl+Z.

TRANSITION — « Passons au Module 12 : comment donner des super-pouvoirs à VS Code avec AGENTS.md, les Skills et les Agents personnalisés ! »`,
];

const NOTES_M12: string[] = [
  // M12_Divider
  `⏱ 1 min · MODULE 12

DIRE — « Module 12 : on monte votre équipe. Une constitution commune, une recette partagée, et trois agents spécialisés qui se passent le relais. Cet après-midi, c’est cette équipe qui livrera votre nouvelle fonctionnalité. »

TRANSITION — « D’abord, comprendre les quatre couches qui guident l’IA dans VS Code. »`,
  // M12_PyramideContexte
  `⏱ 5 min · LES 4 COUCHES DE GUIDAGE

OBJECTIF — Distinguer ce qui est toujours lu (AGENTS.md), chargé à la demande (Skill), choisi (agent) et ponctuel (prompt).

DIRE — « Quatre couches, de la plus permanente à la plus ponctuelle. AGENTS.md est lu à chaque message. Un Skill n’est ouvert que si votre demande correspond. Un agent, c’est vous qui le choisissez dans le menu. Et le prompt du moment peut alors tenir en une phrase. »

ANIMATION — → beat 1 : Skill. → beat 2 : agents, citer les trois rôles de l’équipe. → beat 3 : le prompt court.

TRANSITION — « Couche 1 : la constitution de TaskFlow. »`,
  // M12_FichierInstructions
  `⏱ 5 min · AGENTS.MD, LA CONSTITUTION COMMUNE

OBJECTIF — Savoir ce qui a sa place dans AGENTS.md, et ce qui n’y va pas.

DIRE — « Ce fichier, vos trois agents le lisent à chaque requête. On y met ce qui est vrai pour toute demande : la stack sans bibliothèque, les quatre fichiers, les trois zones, l’immutabilité, et la règle d’or : toute règle métier a son test. Ce qu’on n’y met pas : les recettes longues. Elles encombrent chaque requête, même pour renommer un bouton, et noient les règles vitales. »

ANIMATION — Pointer les lignes surlignées. → beat 1 : standard ouvert. Coller le modèle complet dans le clavardage.

TRANSITION — « La recette longue, justement, va dans un Skill. »`,
  // M12_SkillsExplique
  `⏱ 6 min · LE SKILL FONCTIONNALITE-TASKFLOW

OBJECTIF — Comprendre le déclenchement par la description et le rôle d’une Definition of Done partagée.

DIRE — « Voici la recette que vos trois agents suivront cet après-midi. Retenez deux lignes. La 3 : pas de Date.now() dans une règle métier, la date du jour est passée en paramètre, sinon le test change de résultat chaque jour. Et la Definition of Done : tests verts plus un test de mutation, aucune régression, README à jour. Côté déclenchement, l’agent ne voit que l’en-tête : une description vague, et votre Skill ne sera jamais ouvert. »

ANIMATION — → beat 1 : un seul Skill pour trois agents. Coller le modèle dans le clavardage.

TRANSITION — « Qui sont ces trois agents ? »`,
  // M12_AgentsExplique
  `⏱ 6 min · TROIS AGENTS AUX DROITS SÉPARÉS

OBJECTIF — Connaître le rôle de @Analyste-PO, @Testeur-QA et @Dev-JS, et ce que chacun n’a pas le droit de faire.

DIRE — « Trois coéquipiers. L’analyste écrit la spec et ne code jamais. Le testeur écrit les tests et ne touche jamais app.js. Le développeur, expert JavaScript, code une règle à la fois et ne touche jamais tests.js. Regardez la ligne surlignée dans son fichier : si un test lui semble faux, il l’explique au lieu de le modifier. C’est la séparation des droits qui rend l’ensemble fiable. »

ANIMATION — Pointer le bloc handoffs, on y revient juste après. → beat 1 : pourquoi séparer les droits.

TRANSITION — « Comment ces agents se passent-ils le travail ? »`,
  // M12_Orchestration
  `⏱ 7 min · ORCHESTRER PAR HANDOFFS

OBJECTIF — Comprendre le relais Vous → PO → Testeur → Dev → Testeur, la syntaxe handoffs et le rôle de send: false.

DIRE — « Un handoff, c’est un bouton qui apparaît à la fin de la réponse d’un agent. Il bascule vers l’agent suivant avec un prompt déjà écrit. Avec send: false, le prompt n’est pas envoyé : vous relisez le travail, vous ajustez, puis vous lancez. Vous restez le chef d’orchestre. Et à chaque relais : on relit le diff et on commite. Si une passe casse tout, on revient au commit précédent. »

ANIMATION — Parcourir les cinq étapes. → beat 1 : un relais, un commit. → beat 2 : la boucle Dev ⇄ Testeur.
Plan B à annoncer : si les boutons de relais n’apparaissent pas (version de VS Code ou de Copilot), on change d’agent à la main dans le menu du Chat et on colle le prompt du relais.

TRANSITION — « Pour séparer les droits, il faut d’abord séparer les fichiers. »`,
  // M12_RefactoMulti
  `⏱ 5 min · DE 1 FICHIER À 4 FICHIERS

OBJECTIF — Savoir demander un découpage sans régression, avec tests.js séparé.

DIRE — « Hier soir, TaskFlow tenait dans un seul fichier. Pour que le testeur et le développeur travaillent chacun chez soi, on découpe : index.html, style.css, app.js, et tests.js pour les auto-tests. Refactoriser, c’est ne rien changer pour l’utilisateur : la preuve, ce sont vos tests qui restent verts. »

ANIMATION — → beat 1 : l’arborescence cible et qui écrit où. → beat 2 : le prompt de découpage.

TRANSITION — « Dernier outil avant l’atelier : Git, votre filet de sécurité. »`,
  // M12_GitLocal
  `⏱ 6 min · GIT DANS VS CODE

OBJECTIF — Savoir initialiser un dépôt, commiter et revenir en arrière depuis VS Code.

DIRE — « Git prend une photo de votre projet à chaque commit. Trois gestes dans la vue Contrôle de code source : initialiser une fois, commiter avec un message qui dit quoi et qui, et ignorer les modifications pour revenir à la dernière photo. Regardez l’historique visé ce soir : une ligne par passe d’agent. Il servira dans votre README et votre démo. »

ANIMATION — Montrer en partage d’écran la vue Contrôle de code source (Ctrl+Maj+G). → beat 1 : le filet de sécurité.

TRANSITION — « Quinze minutes de pause, puis vous montez votre équipe. »`,
  // M12_Pause
  `⏱ 15 min · PAUSE MATIN

DIRE — « Quinze minutes de pause loin de l’écran. À la reprise, vous montez votre équipe de trois agents. »

ANIMATION — Lancer le minuteur de 15 minutes. Pendant la pause, coller dans le clavardage les modèles : AGENTS.md, SKILL.md et les trois fichiers .agent.md.`,
  // M12_Lab12
  `⏱ 50 min · ATELIER VIBE 12.1 · MONTER L’ÉQUIPE

OBJECTIF — Obtenir un projet VS Code en 4 fichiers versionné, doté d’AGENTS.md, du Skill et des 3 agents, et répéter un relais Testeur → Dev.

DIRE — « Cinquante minutes, individuellement. Trois étapes. Un : le dossier, Git, le découpage en quatre fichiers, et vos tests doivent rester verts. Deux : les cinq fichiers de l’équipe, modèles dans le clavardage ; vérifiez que les trois agents apparaissent dans le menu du Chat. Trois : la répétition. Le testeur ajoute trois tests sur des cas limites. S’il en trouve un rouge, vous passez le relais au développeur. Et vous vérifiez dans le diff que le testeur n’a pas touché app.js. »

ANIMATION — Lancer le minuteur de 50 minutes. Points d’étape à 15 min (« Découpage fait, tests verts ? »), 30 min (« Les trois agents sont-ils dans le menu ? ») et 45 min (« Combien de commits ? »).

TRANSITION — « Six questions avant le déjeuner, sur les pièges que vous allez rencontrer cet après-midi. »`,
  // M12_QCM
  `⏱ 10 min · QCM MODULES 11 & 12 · SKILLS, AGENTS, ORCHESTRATION

OBJECTIF — Vérifier la compréhension des choix d’architecture : AGENTS.md vs Skill, déclenchement d’un Skill, séparation des droits, tests d’abord, testabilité, send: false.

DIRE — « Six questions, toutes tirées de situations réelles avec des agents. Votez à voix haute, A, B, C ou D. »

ANIMATION — 30 secondes de lecture, puis vote. Faire justifier par un volontaire.
Q1 → B : AGENTS.md est lu à chaque requête.
Q2 → B : la description décide du déclenchement.
Q3 → B : rejeter le diff, le testeur tranche avec la spec.
Q4 → C : tester la demande, pas recopier le code.
Q5 → B : la date du jour doit être un paramètre.
Q6 → B : prompt pré-rempli, vous relisez.

TRANSITION — « Bon appétit ! Cet après-midi, votre équipe livre une vraie fonctionnalité, puis TaskFlow part en ligne. »`,
  // M12_Dejeuner
  `⏱ 90 min · PAUSE DÉJEUNER

DIRE — « Pause déjeuner, reprise à 14 h 00. Pendant la pause, réfléchissez à la fonctionnalité qui vous tente : je vous en présente trois à la reprise. »

ANIMATION — Lancer le minuteur.`,
];

const NOTES_M13: string[] = [
  // M13_Divider
  `⏱ 1 min · MODULE 13 · 14:00

DIRE — « Bon retour ! Module 13 : votre équipe d’agents livre une fonctionnalité phare. Vous choisissez le sujet, ils se passent le relais, et vous gardez la main à chaque passe. »

TRANSITION — « Voici les trois sujets au choix. »`,
  // M13_Fonctionnalites
  `⏱ 6 min · CHOISIR LA FONCTIONNALITÉ PHARE

OBJECTIF — Présenter les 3 sujets (A Sprints & burndown, B Dépendances & blocages, C Échéances & calendrier) et la barre commune.

DIRE — « Trois sujets, choisis parce qu’ils sont utiles à un vrai chef de projet et qu’ils piègent l’IA. A, les sprints : la capacité atteinte pile et le sprint d’un seul jour. B, les dépendances : les cycles, A bloqué par B bloqué par A. C, les échéances : les mois numérotés de zéro à onze et la date du jour qu’il faut injecter pour tester. Même exigence pour les trois. Choisissez au micro : A, B ou C. »

ANIMATION — Recueillir le choix de chacun par prénom et le noter. → beat 1 : la barre commune.
Pour le formateur — B est le plus algorithmique (détection de cycle), A le plus visuel (burndown SVG), C le plus piégeux sur les dates.

TRANSITION — « Avant de lancer, voyons à quoi ressemble un relais complet. »`,
  // M13_SimOrchestration
  `⏱ 7 min · SIMULATEUR DU RELAIS

OBJECTIF — Montrer les cinq passes d’une livraison et le rôle humain à chacune, sur l’exemple B.

DIRE — « Exemple avec les dépendances. Passe 1, le PO écrit huit critères ; moi, j’en retire un trop ambitieux. Passe 2, le testeur écrit sept tests : ils sont rouges, et c’est voulu. Passe 3, le développeur implémente : 25 sur 25, et je vérifie qu’il n’a pas touché tests.js. Passe 4, la plus importante : le testeur casse volontairement une règle… et tout reste vert. Il y avait un trou dans le filet, il ajoute le test 26. Passe 5, je valide à la main et je commite. »

ANIMATION — Cliquer les cinq passes dans l’ordre, en utilisant le bouton de relais. Insister sur la passe 4 : un test qui ne rougit jamais ne protège rien.

TRANSITION — « À vous : soixante minutes. »`,
  // M13_LabFeature
  `⏱ 60 min · TP FINAL · PHASE 1 · LIVRER LA FONCTIONNALITÉ PHARE

OBJECTIF — Livrer la fonctionnalité choisie par relais d’agents, avec tests écrits avant le code, migration v4 → v5 et un commit par passe.

DIRE — « Soixante minutes, individuellement. Quinze minutes de spec : le PO va trop loin, c’est à vous de couper. Trente minutes de tests puis de code, et vous refusez tout diff du développeur qui touche tests.js. Quinze minutes de contre-vérification : mutation, et rechargement de votre sauvegarde d’hier, qui doit passer par la migration. »

ANIMATION — Lancer le minuteur de 60 minutes. Points d’étape à 15 min (« Combien de critères dans votre spec ? »), 30 min (« Vos tests sont-ils rouges pour la bonne raison ? ») et 45 min (« Tout est vert ? »). Si un agent boucle sans converger : revenir au dernier commit et redécouper la demande.

TRANSITION — « Quinze minutes de pause, puis on met tout ça en ligne. »`,
  // M13_Pause
  `⏱ 15 min · PAUSE APRÈS-MIDI

DIRE — « Quinze minutes de pause. À la reprise, TaskFlow part sur GitHub, puis en ligne sur GitHub Pages. »

ANIMATION — Lancer le minuteur. Pendant la pause, rappeler au clavardage que chacun doit pouvoir se connecter à son compte GitHub.`,
];

const NOTES_M14: string[] = [
  // M14_Divider
  `⏱ 1 min · MODULE 14

DIRE — « Module 14 : publier. Votre TaskFlow va quitter votre poste pour une adresse publique que vous pourrez partager à vos collègues dès ce soir. »

TRANSITION — « Première étape : pousser le code sur GitHub. »`,
  // M14_GitHubPush
  `⏱ 6 min · POUSSER SUR GITHUB DEPUIS VS CODE

OBJECTIF — Savoir se connecter, publier un dépôt public et synchroniser, et connaître la règle de confidentialité.

DIRE — « Votre dépôt local a déjà tout son historique. Trois gestes : se connecter avec son compte GitHub, chacun pour soi dans son navigateur ; publier sur GitHub en dépôt public ; puis synchroniser après chaque commit. Attention : public veut dire lisible par tout le monde, historique compris. Un mot de passe supprimé dans le dernier commit reste visible dans les précédents. »

ANIMATION — Montrer le bouton Comptes et le bouton Publier sur GitHub en partage d’écran. → beat 1 : la règle de confidentialité.
Pour le formateur — GitHub Pages gratuit exige un dépôt public. Si GitHub est bloqué par le réseau de l’entreprise : le participant suit en partage d’écran et refera la publication depuis un autre poste.

TRANSITION — « Le dépôt est en ligne. Transformons-le en site. »`,
  // M14_GitHubPages
  `⏱ 6 min · DÉPLOYER SUR GITHUB PAGES

OBJECTIF — Connaître les réglages Settings → Pages et les quatre pièges : index.html à la racine, casse des noms, chemins absolus, localStorage par adresse.

DIRE — « Dans les réglages du dépôt, rubrique Pages : déployer depuis une branche, main, dossier racine, Save. Une à deux minutes plus tard, votre site est en ligne. Quatre pièges. Pas d’index.html à la racine : 404. Style.css avec une majuscule : Windows ne dit rien, GitHub Pages ne trouve pas le fichier. Un chemin qui commence par une barre oblique vise la racine du domaine, pas votre projet. Et vos tickets d’hier n’apparaissent pas en ligne : localStorage dépend de l’adresse, c’est normal et c’est même rassurant. »

ANIMATION — → beat 1 : pièges 3 et 4. → beat 2 : le réflexe fenêtre privée + F12.

TRANSITION — « Votre dépôt public a besoin d’une vitrine : le README. »`,
  // M14_ReadmeRoleIA
  `⏱ 5 min · LE README.MD ET LE RÔLE DE L’IA

OBJECTIF — Savoir structurer le README en 4 parties, lien de démo en tête, et rendre compte honnêtement du travail des agents.

DIRE — « Le README est la première chose qu’on voit sur votre dépôt. En haut, le lien vers la démo. Puis l’objectif, comment lancer, l’architecture, et le rôle de l’IA : quel agent a fait quoi, et surtout vos décisions et vos vérifications. Faites-le rédiger par l’analyste, mais chaque chiffre annoncé doit être vrai. »

ANIMATION — Pointer les lignes surlignées. → beat 1 : le prompt de rédaction. Coller le modèle dans le clavardage.

TRANSITION — « À vous : vingt-cinq minutes pour publier. »`,
  // M14_LabPublier
  `⏱ 25 min · TP FINAL · PHASE 2 · PUBLIER SUR GITHUB PAGES

OBJECTIF — Mettre TaskFlow en ligne, vérifier qu’il fonctionne à son adresse publique et lier la démo dans le README.

DIRE — « Vingt-cinq minutes. D’abord, le testeur contrôle que le projet est publiable : chemins relatifs, casse, aucune donnée réelle ni secret. Ensuite vous publiez et vous activez Pages. Enfin vous ouvrez votre adresse en fenêtre privée, vous déroulez votre spec, et vous ajoutez le lien en tête du README. »

ANIMATION — Lancer le minuteur de 25 minutes. Point d’étape à 10 min (« Votre dépôt est-il publié ? »). Faire déposer les URL dans le clavardage au fur et à mesure.

TRANSITION — « Faisons le point avec la checklist avant les démos. »`,
  // M14_ChecklistDemo
  `⏱ 4 min · CHECKLIST AVANT DÉMO (10 POINTS)

OBJECTIF — Permettre à chacun de se situer avant de présenter.

DIRE — « Six critères, dix points. Comptez pour vous-même ; je coche à l’écran pour illustrer. À huit et plus, vous êtes prêts. »

ANIMATION — Cocher les critères pour montrer la jauge de score.

TRANSITION — « Place aux démonstrations, en ligne ! »`,
  // M14_Restitution
  `⏱ 30 min · GRANDES DÉMONSTRATIONS FINALES

OBJECTIF — Démontrer TaskFlow depuis son adresse publique, expliquer l’orchestration et le rôle de l’IA.

DIRE — « Quatre à cinq minutes chacun, depuis votre URL GitHub Pages. La fonctionnalité en action et une règle qui refuse, puis votre spec, un diff refusé et votre historique Git, et enfin votre README. Les autres peuvent ouvrir votre URL pendant que vous parlez. Après chaque démo : un point fort au micro. »

ANIMATION — Minuteur de 5 minutes par participant. Au-delà de 6 participants : 4 ou 5 volontaires, les autres déposent leur URL dans le clavardage. « Participant suivant ». → beat 1 : URL au clavardage.

TRANSITION — « Faisons le bilan de ces trois jours. »`,
  // M14_Bilan3J
  `⏱ 5 min · BILAN DES 3 JOURS & FEUILLE DE ROUTE

OBJECTIF — Ancrer la méthode sur le long terme (semaine prochaine, 30 jours, suite du parcours).

DIRE — « Regardez le chemin parcouru depuis lundi 9 h : vous savez désormais lire et piloter les briques du code (variables, conditions, boucles, fonctions, listes d’objets, JSON/CSV, localStorage, tests), utiliser ChatGPT, Claude et Gemini pour prototyper, structurer un vrai projet dans VS Code, faire livrer une fonctionnalité par une équipe d’agents que vous orchestrez, et la publier sur GitHub Pages. Notez dès maintenant une petite application que vous allez créer la semaine prochaine ! »

ANIMATION — Faire dire une phrase d’action concrète au micro par chaque participant.

TRANSITION — « Faisons notre vote d’auto-positionnement final ! »`,
  // M14_AutoPosFinal
  `⏱ 5 min · AUTO-POSITIONNEMENT FINAL & ÉVALUATIONS DOCAPOSTE

OBJECTIF — Mesurer la progression du groupe et rappeler les questionnaires d’évaluation Docaposte Institute.

DIRE — « Dites-moi à voix haute où vous vous situez maintenant de 1 à 4, je clique en direct ! Et je vous invite à remplir dès maintenant dans votre extranet apprenant Docaposte l’auto-positionnement final ainsi que le questionnaire de satisfaction à chaud. Vous recevrez également un questionnaire à froid dans 45 jours. »

ANIMATION — Cliquer les votes oraux et laisser 3 minutes pour ouvrir l’extranet d’évaluation.

TRANSITION — « Un dernier mot pour clôturer ensemble ces trois jours. »`,
  // M14_Merci
  `⏱ 2 min · CLÔTURE · MERCI !

OBJECTIF — Remercier chaleureusement chaque participant et conclure la formation.

DIRE — « Merci à toutes et à tous pour votre énergie, votre curiosité et la qualité de vos projets tout au long de ces trois jours. Gardez cette posture de pilote curieux et exigeant : l’IA propose, vous comprenez, vous testez et vous décidez. Together we grow — très bonne continuation à chacune et chacun d’entre vous ! »

ANIMATION — Saluer chaque participant par son prénom avant de clore la classe virtuelle.`,
];

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
  title: 'Vibe Coding — Docaposte Institute (3 jours)',
  createdAt: '2026-11-01T21:31:21.749Z',
  theme: 'docaposte-institute',
};

export default [
  ...PAGES_O,
  ...PAGES_M1,
  ...PAGES_M2,
  ...PAGES_M3,
  ...PAGES_M4,
  ...PAGES_M5,
  ...PAGES_M6,
  ...PAGES_J2,
  ...PAGES_M7,
  ...PAGES_M8,
  ...PAGES_M9,
  ...PAGES_M10,
  ...PAGES_J3,
  ...PAGES_M11,
  ...PAGES_M12,
  ...PAGES_M13,
  ...PAGES_M14,
] satisfies Page[];

export const notes: (string | undefined)[] = [
  ...NOTES_O,
  ...NOTES_M1,
  ...NOTES_M2,
  ...NOTES_M3,
  ...NOTES_M4,
  ...NOTES_M5,
  ...NOTES_M6,
  ...NOTES_J2,
  ...NOTES_M7,
  ...NOTES_M8,
  ...NOTES_M9,
  ...NOTES_M10,
  ...NOTES_J3,
  ...NOTES_M11,
  ...NOTES_M12,
  ...NOTES_M13,
  ...NOTES_M14,
];

