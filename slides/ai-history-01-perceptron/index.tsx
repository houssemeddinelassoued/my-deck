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
import type { CSSProperties, ReactNode } from 'react';
import portrait from './assets/Houssem.jpg';
import neuronPlate from './assets/neurone-vs-perceptron.png';
import perceptronPlate from './assets/perceptron-schema.png';
import rosenblattPhoto from './assets/rosenblatt.jpg';

export const design: DesignSystem = {
  palette: { bg: '#ece3ce', text: '#27231d', accent: '#b0352a' },
  fonts: {
    display: '"Special Elite", "Courier New", monospace',
    body: '"Courier Prime", "Courier New", monospace',
  },
  typeScale: { hero: 150, body: 32 },
  radius: 4,
};

// ─── Webfonts (module-level, slide-keyed) ───────────────────────────────────
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Special+Elite&display=swap';
const FONT_LINK_ID = 'osd-webfont-ai-history-01-perceptron';
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

// ─── Palette (1950s lab archive: manila paper, typewriter ink, stamp red) ───
const ink = {
  text: '#27231d',
  soft: '#4d463b',
  muted: '#7d7261',
  faint: '#b1a48a',
  rule: '#c9bb9c',
  sheet: '#f7f0de',
  card: '#efe1bd',
  print: '#b88a6a',
  hole: '#3a3128',
  pixel: '#2d2822',
  red: '#b0352a',
  redSoft: 'rgba(176, 53, 42, 0.12)',
  blue: '#2b4a7a',
  blueSoft: 'rgba(43, 74, 122, 0.13)',
  grid: 'rgba(70, 120, 115, 0.28)',
  gridFine: 'rgba(70, 120, 115, 0.11)',
};

const typewriter = 'var(--osd-font-display)';
const mono = 'var(--osd-font-body)';
const hand = '"Caveat", "Segoe Print", "Bradley Hand", cursive';

const BLEED = '0 0 0.8px rgba(39, 35, 29, 0.5)';
const SHADOW = '0 1px 0 rgba(255, 255, 255, 0.5) inset, 0 18px 30px -20px rgba(70, 45, 10, 0.6)';
const MARGIN = 'rgba(176, 53, 42, 0.32)';

// Layout grid: punched margin on the left, content from x = 170 to x = 1780.
const L = 170;
const RIGHT = 140;
const CW = 1920 - L - RIGHT;

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
const THUNK = 'cubic-bezier(0.3, 0, 0.35, 1.25)';

// ─── Small helpers ──────────────────────────────────────────────────────────
// CSS custom properties as inline style (React's CSSProperties has no index signature).
const vars = (o: Record<string, string | number>): CSSProperties => {
  const out: Record<string, string | number> = {};
  for (const k of Object.keys(o)) out[`--${k}`] = o[k];
  return out as CSSProperties;
};
const pad2 = (n: number) => String(n).padStart(2, '0');
// French decimal comma.
const fr = (x: number) => x.toFixed(1).replace('.', ',');
const svgUrl = (s: string) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;

// Deterministic pseudo-random generator (same picture on every render).
const rng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

// Arrowhead polygon with its tip at (x, y), pointing towards `ang` degrees.
const head = (x: number, y: number, ang: number, s = 14) => {
  const a = (ang * Math.PI) / 180;
  const p = (dx: number, dy: number) =>
    `${(x + dx * Math.cos(a) - dy * Math.sin(a)).toFixed(1)},${(y + dx * Math.sin(a) + dy * Math.cos(a)).toFixed(1)}`;
  return `${p(0, 0)} ${p(-s, -s * 0.55)} ${p(-s, s * 0.55)}`;
};

// Catmull-Rom spline through the points, as cubic Béziers.
const smooth = (pts: [number, number][]) => {
  const f = (v: number) => v.toFixed(1);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    d += ` C ${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)}, ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)}, ${p2[0]} ${p2[1]}`;
  }
  return d;
};

// Paper grain (brown speckles) and the worn-ink mask used by rubber stamps.
const GRAIN = svgUrl(
  `<svg xmlns='http://www.w3.org/2000/svg' width='360' height='360'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.42  0 0 0 0 0.32  0 0 0 0 0.18  1.2 0 0 0 -0.5'/></filter><rect width='360' height='360' filter='url(#g)'/></svg>`,
);
const GRUNGE = svgUrl(
  `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='m'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='4' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.4 0 0 0 2.05'/></filter><rect width='240' height='240' filter='url(#m)'/></svg>`,
);

// Graph paper (engineering green) and ruled index-card backgrounds.
const graph = (s = 48): CSSProperties => ({
  backgroundColor: ink.sheet,
  backgroundImage: `linear-gradient(${ink.grid} 1px, transparent 1px), linear-gradient(90deg, ${ink.grid} 1px, transparent 1px), linear-gradient(${ink.gridFine} 1px, transparent 1px), linear-gradient(90deg, ${ink.gridFine} 1px, transparent 1px)`,
  backgroundSize: `${s}px ${s}px, ${s}px ${s}px, ${s / 4}px ${s / 4}px, ${s / 4}px ${s / 4}px`,
  boxShadow: SHADOW,
});
const ruled = (top: number, gap: number): CSSProperties => ({
  backgroundColor: ink.sheet,
  backgroundImage: `linear-gradient(to bottom, transparent ${top - 2}px, ${MARGIN} ${top - 2}px, ${MARGIN} ${top}px, transparent ${top}px), repeating-linear-gradient(to bottom, transparent 0, transparent ${gap - 1.5}px, rgba(43, 74, 122, 0.2) ${gap - 1.5}px, rgba(43, 74, 122, 0.2) ${gap}px)`,
  backgroundPosition: `0 0, 0 ${top}px`,
  boxShadow: SHADOW,
});

// ─── Stylesheet (collected from every page, injected once at the bottom) ────
const CSS: string[] = [];

// `has(n)` matches a page once its n-th click ("beat") has been revealed.
const has = (n: number) => `.ah-page:has([data-osd-step="revealed"] > .ah-k${n})`;

CSS.push(`
@keyframes ah-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes ah-fade{from{opacity:0}to{opacity:1}}
@keyframes ah-type{from{opacity:0}to{opacity:1}}
@keyframes ah-draw{from{stroke-dashoffset:1.01}to{stroke-dashoffset:0}}
@keyframes ah-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes ah-pop{0%{opacity:0;transform:scale(.3)}60%{opacity:1;transform:scale(1.15)}100%{opacity:1;transform:scale(1)}}
@keyframes ah-stamp{0%{opacity:0;transform:rotate(var(--r,0deg)) scale(1.9)}35%{opacity:1}70%{transform:rotate(var(--r,0deg)) scale(.94)}100%{opacity:1;transform:rotate(var(--r,0deg)) scale(1)}}
@keyframes ah-blink{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes ah-spin{to{transform:rotate(360deg)}}
@keyframes ah-scan{0%{transform:translateY(0);opacity:0}8%{opacity:.75}92%{opacity:.75}100%{transform:translateY(var(--h,400px));opacity:0}}
@keyframes ah-back{to{stroke-dashoffset:36}}
.ah-stamp{transform:rotate(var(--r,0deg))}
.ah-in-draw{stroke-dasharray:1 2}
.ah-in-pop,.ah-pop{transform-box:fill-box;transform-origin:center}
.ah-in-grow{transform-origin:left center}
.ah-live .ah-in{animation:ah-rise 800ms ${EASE} var(--d,0ms) both}
.ah-live .ah-in-fade{animation:ah-fade 900ms ${EASE} var(--d,0ms) both}
.ah-live .ah-in-draw{animation:ah-draw 1300ms ${EASE} var(--d,0ms) both}
.ah-live .ah-in-grow{animation:ah-grow 600ms ${EASE} var(--d,0ms) both}
.ah-live .ah-in-pop{animation:ah-pop 520ms ${EASE} var(--d,0ms) both}
.ah-live .ah-in-st{animation:ah-stamp 480ms ${EASE_OUT} var(--d,0ms) both}
.ah-live .ah-ty0 .ah-c{animation:ah-type 40ms linear var(--d,0ms) both}
.ah-live .ah-lamp{animation:ah-blink var(--t,1.4s) steps(1,end) var(--d,0ms) infinite}
.ah-reel{transform-box:fill-box;transform-origin:center}
.ah-live .ah-reel{animation:ah-spin var(--t,8s) linear infinite}
.ah-scan{opacity:0}
.ah-live .ah-scan{animation:ah-scan 3.4s ease-in-out var(--d,0ms) infinite}
.ah-live .ah-back{animation:ah-back 900ms linear infinite}
@media (prefers-reduced-motion: reduce){.ah-page *{animation:none !important;transition:none !important}}
`);

// Beat utilities — visible from beat n: on (rise) / fade / typed text / stamp
// (thunk) / grow; hidden from beat n: off; stroke drawn at beat n: draw (path
// needs pathLength={1}); faded back at beat n: dim.
for (let n = 1; n <= 6; n++) {
  const at = has(n);
  CSS.push(`
.ah-on${n}{opacity:0;transform:translateY(14px);transition:opacity 500ms ${EASE} var(--d,0ms),transform 700ms ${EASE} var(--d,0ms)}
${at} .ah-on${n}{opacity:1;transform:none}
.ah-fade${n}{opacity:0;transition:opacity 550ms ${EASE} var(--d,0ms)}
${at} .ah-fade${n}{opacity:1}
.ah-ty${n} .ah-c{opacity:0}
${at} .ah-ty${n} .ah-c{opacity:1;transition:opacity 40ms linear var(--d,0ms)}
.ah-st${n}{opacity:0;transform:rotate(var(--r,0deg)) scale(1.9);transition:opacity 120ms linear var(--d,0ms),transform 440ms ${THUNK} var(--d,0ms)}
${at} .ah-st${n}{opacity:1;transform:rotate(var(--r,0deg)) scale(1)}
.ah-grow${n}{transform:scaleX(0);transform-origin:left center;transition:transform 600ms ${EASE} var(--d,0ms)}
${at} .ah-grow${n}{transform:scaleX(1)}
.ah-off${n}{transition:opacity 380ms ${EASE}}
${at} .ah-off${n}{opacity:0}
.ah-draw${n}{stroke-dasharray:1 2;stroke-dashoffset:1.01;transition:stroke-dashoffset 1000ms ${EASE} var(--d,0ms)}
${at} .ah-draw${n}{stroke-dashoffset:0}
.ah-dim${n}{transition:opacity 500ms ${EASE}}
${at} .ah-dim${n}{opacity:.22}
`);
}

// ─── Frame components ───────────────────────────────────────────────────────
// Invisible click markers: each beat is a <Step> whose reveal state drives the
// page's CSS (via :has), so a single click can animate SVG, bars, stamps…
const Beats = ({ count }: { count: number }) => (
  <div aria-hidden style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0 }}>
    <Steps>
      {Array.from({ length: count }, (_, i) => (
        <Step key={i} duration={0}>
          <i className={`ah-k${i + 1}`} />
        </Step>
      ))}
    </Steps>
  </div>
);

// Binder holes punched in the left margin.
const Hole = ({ y }: { y: number }) => (
  <div
    aria-hidden
    style={{
      position: 'absolute',
      left: 44,
      top: y - 18,
      width: 36,
      height: 36,
      borderRadius: 999,
      background: 'radial-gradient(circle at 42% 38%, #9c8762, #c4b089 72%)',
      boxShadow: 'inset 2px 3px 5px rgba(50, 32, 10, 0.45), 0 0 0 1px rgba(120, 95, 55, 0.25)',
    }}
  />
);

const Paper = () => (
  <>
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background:
          'radial-gradient(ellipse 70% 60% at 42% 38%, rgba(255, 251, 238, 0.6), rgba(255, 251, 238, 0) 72%), radial-gradient(ellipse 115% 100% at 50% 50%, rgba(0, 0, 0, 0) 60%, rgba(115, 82, 34, 0.2) 100%)',
      }}
    />
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage: GRAIN,
        backgroundSize: '360px 360px',
        opacity: 0.5,
      }}
    />
    <div
      aria-hidden
      style={{
        position: 'absolute',
        left: 114,
        top: 0,
        bottom: 0,
        width: 4,
        borderLeft: `1.5px solid ${MARGIN}`,
        borderRight: `1.5px solid ${MARGIN}`,
      }}
    />
    <Hole y={270} />
    <Hole y={540} />
    <Hole y={810} />
  </>
);

// Rubber stamp: worn red (or blue) ink, rotated, lands with a "thunk".
// beat = 0 stamps on page entry (after `d` ms); beat = n stamps on click n.
const Stamp = ({
  children,
  pos,
  rot = -6,
  size = 40,
  color = ink.red,
  beat = 0,
  d = 0,
}: {
  children: ReactNode;
  pos: CSSProperties;
  rot?: number;
  size?: number;
  color?: string;
  beat?: number;
  d?: number;
}) => (
  <div
    className={`ah-stamp ${beat ? `ah-st${beat}` : 'ah-in-st'}`}
    style={{ ...vars({ r: `${rot}deg`, d: `${d}ms` }), position: 'absolute', transformOrigin: 'center', ...pos }}
  >
    <div
      style={{
        color,
        border: `${Math.max(3, Math.round(size / 12))}px solid currentColor`,
        borderRadius: 8,
        padding: `${Math.round(size * 0.14)}px ${Math.round(size * 0.32)}px ${Math.round(size * 0.1)}px`,
        fontFamily: typewriter,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        opacity: 0.88,
        WebkitMaskImage: GRUNGE,
        maskImage: GRUNGE,
        WebkitMaskSize: '240px 240px',
        maskSize: '240px 240px',
      }}
    >
      {children}
    </div>
  </div>
);

const Header = ({ era }: { era?: string }) => (
  <>
    <div
      style={{
        position: 'absolute',
        left: L,
        top: 58,
        fontFamily: mono,
        fontSize: 22,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: ink.muted,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ color: 'var(--osd-accent)', fontWeight: 700 }}>Archives de l'IA</span>
      {' · Dossier nº 01 — Le Perceptron'}
    </div>
    <div
      style={{
        position: 'absolute',
        left: L,
        right: RIGHT,
        top: 100,
        height: 4,
        borderTop: `1.5px solid ${ink.rule}`,
        borderBottom: `1.5px solid ${ink.rule}`,
      }}
    />
    {era ? (
      <Stamp pos={{ right: RIGHT, top: 44 }} rot={-4} size={28} d={500}>
        {era}
      </Stamp>
    ) : null}
  </>
);

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: L,
        right: RIGHT,
        bottom: 44,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        fontFamily: mono,
        fontSize: 22,
        color: ink.muted,
      }}
    >
      <span style={{ fontStyle: 'italic' }}>Le Perceptron — la machine qui apprend</span>
      <span style={{ letterSpacing: '0.12em' }}>
        FEUILLET {pad2(current)} / {pad2(total)}
      </span>
    </div>
  );
};

// Typewriter text: characters appear one by one. beat = 0 types on page entry
// (live page only); beat = n types on click n. `step` = ms per character.
const Typed = ({ text, d = 0, step = 26, beat = 0 }: { text: string; d?: number; step?: number; beat?: number }) => {
  let i = 0;
  return (
    <span className={`ah-ty${beat}`}>
      {Array.from(text).map((ch, k) =>
        ch === '\n' ? (
          <br key={k} />
        ) : (
          <span key={k} className="ah-c" style={vars({ d: `${d + i++ * step}ms` })}>
            {ch}
          </span>
        ),
      )}
    </span>
  );
};

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div
    className="ah-in-fade"
    style={{
      position: 'absolute',
      left: L,
      top: 146,
      fontFamily: mono,
      fontWeight: 700,
      fontSize: 24,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--osd-accent)',
    }}
  >
    {children}
  </div>
);

const Title = ({ text }: { text: string }) => (
  <h2
    style={{
      position: 'absolute',
      left: L,
      top: 184,
      margin: 0,
      maxWidth: CW,
      fontFamily: typewriter,
      fontWeight: 400,
      fontSize: 64,
      lineHeight: 1.15,
      textShadow: BLEED,
    }}
  >
    <Typed text={text} d={120} step={24} />
  </h2>
);

const Frame = ({
  id,
  era,
  eyebrow,
  title,
  beats = 0,
  chrome = true,
  children,
}: {
  id: string;
  era?: string;
  eyebrow?: string;
  title?: string;
  beats?: number;
  chrome?: boolean;
  children: ReactNode;
}) => {
  const live = useIsActivePage();
  return (
    <div
      className={`ah-page ah-${id}${live ? ' ah-live' : ''}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'var(--osd-bg)',
        color: 'var(--osd-text)',
        fontFamily: mono,
        fontSize: 28,
      }}
    >
      <Paper />
      {chrome ? <Header era={era} /> : null}
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {title ? <Title text={title} /> : null}
      {children}
      {chrome ? <Footer /> : null}
      {beats > 0 ? <Beats count={beats} /> : null}
    </div>
  );
};

// ─── Shared paper props ─────────────────────────────────────────────────────
// Handwritten marginalia in fountain-pen blue.
const Hand = ({
  children,
  x,
  y,
  w,
  rot = -2,
  size = 34,
  c = ink.blue,
  className = 'ah-in-fade',
  d = 0,
}: {
  children: ReactNode;
  x: number;
  y: number;
  w?: number;
  rot?: number;
  size?: number;
  c?: string;
  className?: string;
  d?: number;
}) => (
  <div
    className={className}
    style={{
      ...vars({ d: `${d}ms` }),
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      fontFamily: hand,
      fontWeight: 600,
      fontSize: size,
      lineHeight: 1.1,
      color: c,
      transform: `rotate(${rot}deg)`,
      transformOrigin: 'left top',
    }}
  >
    {children}
  </div>
);

// Hand-drawn underline under a word (drawn on entry, or on click `beat`).
const Mark = ({ children, beat = 0, d = 0, c = ink.blue }: { children: ReactNode; beat?: number; d?: number; c?: string }) => (
  <span style={{ position: 'relative', display: 'inline-block' }}>
    {children}
    <svg
      aria-hidden
      viewBox="0 0 300 20"
      preserveAspectRatio="none"
      style={{ position: 'absolute', left: -6, bottom: -14, width: 'calc(100% + 12px)', height: 20, overflow: 'visible' }}
    >
      <path
        d="M 3 13 C 60 5, 120 17, 180 10 S 268 6, 297 12"
        pathLength={1}
        fill="none"
        stroke={c}
        strokeWidth={4}
        strokeLinecap="round"
        className={beat ? `ah-draw${beat}` : 'ah-in-draw'}
        style={vars({ d: `${d}ms` })}
      />
    </svg>
  </span>
);

const Tape = ({ x, y, rot, w = 130 }: { x: number; y: number; rot: number; w?: number }) => (
  <div
    aria-hidden
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: 38,
      background: 'rgba(238, 228, 198, 0.75)',
      boxShadow: '0 1px 3px rgba(80, 60, 20, 0.2)',
      transform: `rotate(${rot}deg)`,
    }}
  />
);

const PaperClip = ({ x, y, rot = -8 }: { x: number; y: number; rot?: number }) => (
  <svg
    aria-hidden
    width={46}
    height={104}
    style={{ position: 'absolute', left: x, top: y, overflow: 'visible', transform: `rotate(${rot}deg)` }}
  >
    <path
      d="M 15 44 V 16 a 8 8 0 0 1 16 0 V 78 a 13 13 0 0 1 -26 0 V 12 a 18 18 0 0 1 36 0 V 64"
      fill="none"
      stroke="#868b91"
      strokeWidth={4}
      strokeLinecap="round"
    />
  </svg>
);

const Label = ({ children, c = ink.muted }: { children: ReactNode; c?: string }) => (
  <span
    style={{
      fontFamily: mono,
      fontWeight: 700,
      fontSize: 21,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: c,
    }}
  >
    {children}
  </span>
);

// ═══ 1 · Couverture ══════════════════════════════════════════════════════════
// Real IBM-style punch card: the top edge prints the text, the holes encode it
// in Hollerith code (rows 12, 11, then digits 0–9).
const HOLLERITH: Record<string, number[]> = {
  P: [1, 9],
  E: [0, 7],
  R: [1, 11],
  C: [0, 5],
  T: [2, 5],
  O: [1, 8],
  N: [1, 7],
  '1': [3],
  '9': [11],
  '5': [7],
  '7': [9],
};
const CARD_TEXT = 'PERCEPTRON 1957';
const PC = { w: 900, h: 330, cols: 40, colW: 20, x0: 50, y0: 64, rowH: 21 };
const pcX = (c: number) => PC.x0 + c * PC.colW + PC.colW / 2;
const pcY = (r: number) => PC.y0 + r * PC.rowH + PC.rowH / 2;
const PC_HOLES: [number, number][] = Array.from(CARD_TEXT).flatMap((ch, i) =>
  (HOLLERITH[ch] ?? []).map((r): [number, number] => [i + 2, r]),
);
const PC_PUNCHED = new Set(PC_HOLES.map(([c, r]) => `${c}:${r}`));

const PunchCard = () => (
  <svg
    width={PC.w}
    height={PC.h}
    style={{ display: 'block', overflow: 'visible', filter: 'drop-shadow(0 14px 16px rgba(70, 45, 10, 0.28))' }}
  >
    <path d={`M 30 0 H ${PC.w} V ${PC.h} H 0 V 30 Z`} fill={ink.card} stroke="rgba(120, 90, 50, 0.4)" strokeWidth={1.5} />
    {Array.from(CARD_TEXT).map((ch, i) => (
      <text
        key={i}
        x={pcX(i + 2)}
        y={42}
        textAnchor="middle"
        style={{ fontFamily: mono, fontSize: 20, fontWeight: 700 }}
        fill={ink.text}
      >
        {ch}
      </text>
    ))}
    <text
      x={PC.w - 30}
      y={42}
      textAnchor="end"
      style={{ fontFamily: mono, fontSize: 15, letterSpacing: '0.12em' }}
      fill={ink.print}
    >
      CARTE DE DONNÉES · DOSSIER Nº 01
    </text>
    {Array.from({ length: PC.cols }, (_, c) =>
      Array.from({ length: 10 }, (_, k) =>
        PC_PUNCHED.has(`${c}:${k + 2}`) ? null : (
          <text
            key={`${c}-${k}`}
            x={pcX(c)}
            y={pcY(k + 2) + 4.5}
            textAnchor="middle"
            style={{ fontFamily: mono, fontSize: 12.5 }}
            fill={ink.print}
          >
            {k}
          </text>
        ),
      ),
    )}
    {PC_HOLES.map(([c, r], i) => (
      <rect
        key={i}
        x={pcX(c) - 4.5}
        y={pcY(r) - 7.5}
        width={9}
        height={15}
        rx={1.5}
        fill={ink.hole}
        className="ah-in-pop"
        style={vars({ d: `${2900 + c * 80}ms` })}
      />
    ))}
  </svg>
);

const CoffeeRing = () => (
  <svg aria-hidden width={360} height={360} style={{ position: 'absolute', left: 1500, top: 850, overflow: 'visible' }}>
    <circle cx={180} cy={180} r={126} fill="none" stroke="rgba(125, 85, 35, 0.14)" strokeWidth={9} strokeDasharray="520 40 190 30" />
    <circle cx={182} cy={178} r={117} fill="none" stroke="rgba(125, 85, 35, 0.08)" strokeWidth={3} />
  </svg>
);

const AuthorCard = () => (
  <div
    className="ah-in-fade"
    style={{ ...vars({ d: '3300ms' }), position: 'absolute', left: 1190, top: 668, width: 590, height: 262 }}
  >
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: ink.sheet,
        boxShadow: SHADOW,
        transform: 'rotate(1.4deg)',
      }}
    >
      <img
        src={portrait}
        alt="Houssem Eddine Lassoued"
        style={{
          position: 'absolute',
          left: 30,
          top: 34,
          width: 160,
          height: 196,
          objectFit: 'cover',
          objectPosition: '56% 30%',
          border: `6px solid #fffaf0`,
          boxShadow: '0 4px 10px -4px rgba(60, 40, 10, 0.5)',
          filter: 'grayscale(1) sepia(0.5) contrast(1.05)',
        }}
      />
      <PaperClip x={48} y={4} />
      <div style={{ position: 'absolute', left: 224, top: 30, right: 24 }}>
        <Label>Conçu par</Label>
        <div
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTop: `2px solid ${MARGIN}`,
            fontFamily: typewriter,
            fontSize: 36,
            lineHeight: 1.15,
            textShadow: BLEED,
          }}
        >
          Houssem Eddine
          <br />
          Lassoued
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 16, fontSize: 26 }}>
          <span style={{ fontWeight: 700 }}>2026</span>
          <span style={{ color: ink.faint }}>·</span>
          <a
            href="https://www.linkedin.com/in/houssemeddinelassoued"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--osd-accent)', textDecoration: 'underline', textUnderlineOffset: 5 }}
          >
            LinkedIn ↗
          </a>
        </div>
      </div>
    </div>
  </div>
);

const Cover: Page = () => (
  <Frame id="cover" chrome={false}>
    <div
      className="ah-in-fade"
      style={{
        position: 'absolute',
        left: L,
        top: 150,
        fontFamily: mono,
        fontWeight: 700,
        fontSize: 26,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--osd-accent)',
      }}
    >
      Archives de l'IA — Dossier nº 01
    </div>
    <h1
      style={{
        position: 'absolute',
        left: L - 6,
        top: 196,
        margin: 0,
        fontFamily: typewriter,
        fontWeight: 400,
        fontSize: 'var(--osd-size-hero)',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        textShadow: BLEED,
      }}
    >
      <Typed text="Le Perceptron" d={250} step={70} />
    </h1>
    <Stamp pos={{ left: 1400, top: 168 }} rot={-10} size={110} d={1300}>
      1957
    </Stamp>
    <div
      style={{
        position: 'absolute',
        left: L,
        top: 380,
        fontFamily: typewriter,
        fontSize: 54,
        lineHeight: 1.1,
        color: ink.soft,
        textShadow: BLEED,
      }}
    >
      <Typed text="La première machine qui apprend" d={1550} step={30} />
    </div>
    <p
      className="ah-in"
      style={{
        ...vars({ d: '2500ms' }),
        position: 'absolute',
        left: L,
        top: 470,
        margin: 0,
        maxWidth: 1000,
        fontSize: 'var(--osd-size-body)',
        lineHeight: 1.45,
        color: ink.soft,
      }}
    >
      1957 : comment une simple cellule de calcul a ouvert la voie au machine learning.
    </p>
    <CoffeeRing />
    <div className="ah-in" style={{ ...vars({ d: '2700ms' }), position: 'absolute', left: L, top: 636 }}>
      <div style={{ transform: 'rotate(-1.5deg)' }}>
        <PunchCard />
      </div>
    </div>
    <AuthorCard />
  </Frame>
);

// ═══ 2 · Le rêve ═════════════════════════════════════════════════════════════
const Dream: Page = () => (
  <Frame id="dream" era="Années 50" eyebrow="Années 1950 · Un rêve étrange" beats={1}>
    <div
      style={{
        position: 'absolute',
        left: L,
        top: 330,
        fontFamily: typewriter,
        fontSize: 70,
        lineHeight: 1.22,
        textShadow: BLEED,
      }}
    >
      <Typed text={"Et si une machine ne se contentait pas\nd'exécuter des instructions…"} d={350} step={30} />
    </div>
    <div
      style={{
        position: 'absolute',
        left: L,
        top: 560,
        fontFamily: typewriter,
        fontSize: 124,
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
        color: 'var(--osd-accent)',
        textShadow: BLEED,
      }}
    >
      <Typed text="…mais " beat={1} step={50} />
      <Mark beat={1} d={820}>
        <Typed text="apprenait" beat={1} d={300} step={50} />
      </Mark>
      <Typed text={' ?'} beat={1} d={760} step={50} />
    </div>
    <div
      className="ah-in-fade"
      style={{
        ...vars({ d: '2600ms' }),
        position: 'absolute',
        left: L,
        top: 830,
        width: CW,
        paddingTop: 22,
        borderTop: `1.5px dashed ${ink.rule}`,
        display: 'flex',
        gap: 72,
        fontSize: 28,
        color: ink.soft,
      }}
    >
      <span>
        <Label>Objet :</Label> une machine qui apprend
      </span>
      <span>
        <Label>Statut :</Label> un rêve
      </span>
    </div>
  </Frame>
);

// ═══ 3 · L'ordinateur de l'époque ════════════════════════════════════════════
const LAMPS = (() => {
  const r = rng(7);
  const out: { x: number; y: number; t: number; d: number; on: boolean }[] = [];
  for (let row = 0; row < 4; row++)
    for (let col = 0; col < 6; col++)
      out.push({ x: 58 + col * 35, y: 176 + row * 34, t: 0.9 + r() * 1.8, d: r() * 1500, on: r() > 0.3 });
  return out;
})();

const Reel = ({ cx, cy, reverse }: { cx: number; cy: number; reverse?: boolean }) => (
  <g>
    <circle cx={cx} cy={cy} r={68} fill={ink.card} stroke={ink.text} strokeWidth={3} />
    <circle cx={cx} cy={cy} r={46} fill="#8a7658" opacity={0.3} />
    <g
      className="ah-reel"
      style={{ ...vars({ t: '7s' }), animationDirection: reverse ? 'reverse' : undefined }}
    >
      <circle cx={cx} cy={cy} r={68} fill="none" />
      <circle cx={cx + 30} cy={cy} r={13} fill={ink.sheet} stroke={ink.text} strokeWidth={2} />
      <circle cx={cx - 15} cy={cy + 26} r={13} fill={ink.sheet} stroke={ink.text} strokeWidth={2} />
      <circle cx={cx - 15} cy={cy - 26} r={13} fill={ink.sheet} stroke={ink.text} strokeWidth={2} />
      <circle cx={cx} cy={cy} r={8} fill={ink.text} />
    </g>
  </g>
);

const Mainframe = () => (
  <svg width={800} height={600} style={{ position: 'absolute', left: L, top: 318, overflow: 'visible' }}>
    <line x1={0} y1={520} x2={800} y2={520} stroke={ink.soft} strokeWidth={2.5} />
    {/* Console with its lamp panel */}
    <g className="ah-in" style={vars({ d: '300ms' })}>
      <rect x={10} y={120} width={270} height={400} fill={ink.sheet} stroke={ink.text} strokeWidth={3} />
      <rect x={34} y={150} width={222} height={150} fill="#2f2a24" />
      {LAMPS.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={8}
          fill={p.on ? '#f2c25c' : '#6b5d48'}
          className={p.on ? 'ah-lamp' : undefined}
          style={vars({ t: `${p.t.toFixed(2)}s`, d: `${Math.round(p.d)}ms` })}
        />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={42 + i * 27} y={318} width={12} height={24} rx={3} fill={ink.soft} />
      ))}
      <rect x={0} y={352} width={290} height={18} fill={ink.card} stroke={ink.text} strokeWidth={2.5} />
      <rect x={34} y={392} width={100} height={108} fill="none" stroke={ink.soft} strokeWidth={2} />
      <rect x={156} y={392} width={100} height={108} fill="none" stroke={ink.soft} strokeWidth={2} />
    </g>
    {/* Magnetic tape drive */}
    <g className="ah-in" style={vars({ d: '450ms' })}>
      <rect x={300} y={60} width={220} height={460} fill={ink.sheet} stroke={ink.text} strokeWidth={3} />
      <Reel cx={410} cy={160} />
      <Reel cx={410} cy={330} reverse />
      <line x1={478} y1={160} x2={478} y2={330} stroke="#5a4a36" strokeWidth={3} />
      <rect x={468} y={232} width={20} height={26} fill={ink.text} />
      <rect x={322} y={428} width={176} height={72} fill="none" stroke={ink.soft} strokeWidth={2} />
      {Array.from({ length: 5 }, (_, i) => (
        <line key={i} x1={338} y1={442 + i * 11} x2={482} y2={442 + i * 11} stroke={ink.faint} strokeWidth={2} />
      ))}
    </g>
    {/* Card reader */}
    <g className="ah-in" style={vars({ d: '600ms' })}>
      <rect x={540} y={230} width={250} height={290} fill={ink.sheet} stroke={ink.text} strokeWidth={3} />
      <rect x={570} y={194} width={190} height={36} fill={ink.card} stroke={ink.text} strokeWidth={2} />
      {Array.from({ length: 4 }, (_, i) => (
        <line key={i} x1={574} y1={202 + i * 7} x2={756} y2={202 + i * 7} stroke={ink.print} strokeWidth={1.5} />
      ))}
      <rect x={566} y={284} width={198} height={12} fill={ink.text} />
      <text x={665} y={334} textAnchor="middle" style={{ fontFamily: mono, fontSize: 16, letterSpacing: '0.1em' }} fill={ink.muted}>
        LECTEUR DE CARTES
      </text>
      <rect x={566} y={420} width={198} height={64} fill="none" stroke={ink.soft} strokeWidth={2} />
    </g>
    {/* Engineering dimension line */}
    <g className="ah-in-fade" style={vars({ d: '1000ms' })}>
      <line x1={16} y1={552} x2={784} y2={552} stroke={ink.blue} strokeWidth={2} />
      <line x1={10} y1={538} x2={10} y2={566} stroke={ink.blue} strokeWidth={2} />
      <line x1={790} y1={538} x2={790} y2={566} stroke={ink.blue} strokeWidth={2} />
      <polygon points={head(10, 552, 180, 16)} fill={ink.blue} />
      <polygon points={head(790, 552, 0, 16)} fill={ink.blue} />
      <text x={400} y={594} textAnchor="middle" style={{ fontFamily: hand, fontWeight: 600, fontSize: 36 }} fill={ink.blue}>
        ≈ une salle entière
      </text>
    </g>
  </svg>
);

const Field = ({ label, value, top, d }: { label: string; value: string; top: number; d: number }) => (
  <div
    className="ah-in"
    style={{
      ...vars({ d: `${d}ms` }),
      position: 'absolute',
      left: 1040,
      top,
      width: 740,
      paddingBottom: 14,
      borderBottom: `1.5px dotted ${ink.faint}`,
    }}
  >
    <Label>{label}</Label>
    <div style={{ marginTop: 6, fontFamily: typewriter, fontSize: 40, lineHeight: 1.2, textShadow: BLEED }}>{value}</div>
  </div>
);

const Computer: Page = () => (
  <Frame id="computer" era="1957" eyebrow="Le contexte" title="Un ordinateur, en 1957" beats={1}>
    <Mainframe />
    <Field label="Taille" value="une salle entière" top={322} d={700} />
    <Field label="Prix" value="une petite fortune" top={452} d={900} />
    <Field label="Ce qu'il fait" value="exactement ce qu'on lui écrit" top={582} d={1100} />
    <div
      className="ah-on1"
      style={{
        position: 'absolute',
        left: 1040,
        top: 722,
        width: 740,
        padding: '22px 28px',
        boxSizing: 'border-box',
        background: ink.sheet,
        boxShadow: SHADOW,
        borderLeft: `6px solid ${ink.red}`,
      }}
    >
      <div style={{ fontSize: 28, lineHeight: 1.4, color: ink.soft }}>
        Pour qu'il distingue deux formes, il faut lui écrire les règles&nbsp;:
      </div>
      <pre style={{ margin: '12px 0 0', fontFamily: mono, fontWeight: 700, fontSize: 28, lineHeight: 1.4, color: ink.text }}>
        {"SI ligne_horiz ET ligne_vert\n   ALORS « c'est un T »"}
      </pre>
    </div>
  </Frame>
);

// ═══ 4 · Rosenblatt ══════════════════════════════════════════════════════════
const CardLine = ({ label, value, d }: { label: string; value: string; d: number }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', height: 50 }}>
    <span
      style={{
        width: 128,
        flex: 'none',
        fontWeight: 700,
        fontSize: 20,
        letterSpacing: '0.12em',
        color: ink.muted,
      }}
    >
      {label}
    </span>
    <span style={{ fontSize: 25, color: ink.text }}>
      <Typed text={value} d={d} step={22} />
    </span>
  </div>
);

const Chip = ({ children, hot }: { children: ReactNode; hot?: boolean }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '6px 14px',
      border: `2px solid ${hot ? ink.red : ink.text}`,
      background: hot ? ink.redSoft : ink.sheet,
      color: hot ? ink.red : ink.text,
      fontWeight: 700,
      fontSize: 24,
      lineHeight: 1.2,
    }}
  >
    {children}
  </span>
);

const Op = ({ children }: { children: ReactNode }) => (
  <span style={{ margin: '0 12px', fontFamily: 'Arial, "Segoe UI Symbol", sans-serif', fontSize: 30, fontWeight: 700, color: ink.muted }}>
    {children}
  </span>
);

const FlowRow = ({ label, beat, top, hot, children }: { label: string; beat: number; top: number; hot?: boolean; children: ReactNode }) => (
  <div className={`ah-on${beat}`} style={{ position: 'absolute', left: 980, top, width: 800 }}>
    <Label c={hot ? ink.red : ink.muted}>{label}</Label>
    <div style={{ marginTop: 10, display: 'flex', alignItems: 'center' }}>{children}</div>
  </div>
);

const Idea: Page = () => (
  <Frame id="idea" era="1957" eyebrow="L'idée" title="Rosenblatt pose une autre question" beats={2}>
    <div className="ah-in" style={{ ...vars({ d: '600ms' }), position: 'absolute', left: L, top: 330, width: 660, height: 400 }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          padding: '22px 30px',
          boxSizing: 'border-box',
          transform: 'rotate(-1.5deg)',
          ...ruled(84, 50),
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', height: 56 }}>
          <span style={{ fontFamily: typewriter, fontSize: 30, color: ink.red }}>FICHE Nº 57-P</span>
          <Label>Archives</Label>
        </div>
        <div style={{ marginTop: 12 }}>
          <CardLine label="NOM" value="Frank Rosenblatt" d={900} />
          <CardLine label="MÉTIER" value="psychologue, chercheur" d={1300} />
          <CardLine label="LABO" value="Cornell Aeronautical Laboratory" d={1750} />
          <CardLine label="VILLE" value="Buffalo, New York" d={2350} />
          <CardLine label="ANNÉE" value="1957" d={2750} />
        </div>
      </div>
    </div>
    {/* ID photo clipped to the corner of the card */}
    <div className="ah-in" style={{ ...vars({ d: '1500ms' }), position: 'absolute', left: 596, top: 590 }}>
      <div style={{ position: 'relative', transform: 'rotate(3.5deg)' }}>
        <img
          src={rosenblattPhoto}
          alt="Frank Rosenblatt, vers 1950"
          style={{
            display: 'block',
            width: 200,
            height: 260,
            objectFit: 'cover',
            border: '9px solid #fffaf0',
            boxShadow: '0 16px 26px -14px rgba(60, 40, 10, 0.6)',
          }}
        />
        <PaperClip x={34} y={-14} rot={-6} />
      </div>
    </div>
    <Hand x={L + 30} y={754} w={400} rot={-2} size={32} d={2000}>
      Frank Rosenblatt, vers 1950
    </Hand>
    <div className="ah-in-fade" style={{ ...vars({ d: '2200ms' }), position: 'absolute', left: L + 30, top: 812, width: 390, fontSize: 16, lineHeight: 1.4, color: ink.muted }}>
      Photo : Heinz Nixdorf MuseumsForum, via Wikimedia Commons — CC BY-SA 4.0
    </div>
    <div
      className="ah-in-fade"
      style={{
        ...vars({ d: '300ms' }),
        position: 'absolute',
        left: 872,
        top: 300,
        fontFamily: typewriter,
        fontSize: 140,
        lineHeight: 1,
        color: ink.rule,
      }}
    >
      «
    </div>
    <div
      style={{
        position: 'absolute',
        left: 980,
        top: 340,
        width: 800,
        fontFamily: typewriter,
        fontSize: 46,
        lineHeight: 1.3,
        textShadow: BLEED,
      }}
    >
      <Typed text={"Et si la machine apprenait\nà partir d'exemples, au lieu\nqu'on lui dicte toutes\nles règles ?"} d={1000} step={24} />
    </div>
    <div
      className="ah-in-fade"
      style={{ ...vars({ d: '3200ms' }), position: 'absolute', left: 980, top: 596, fontSize: 22, fontStyle: 'italic', color: ink.muted }}
    >
      — l'intuition de Rosenblatt, reformulée
    </div>
    <FlowRow label="Avant" beat={1} top={662}>
      <Chip>règles</Chip>
      <Op>+</Op>
      <Chip>données</Chip>
      <Op>→</Op>
      <Chip>machine</Chip>
      <Op>→</Op>
      <Chip>réponses</Chip>
    </FlowRow>
    <FlowRow label="L'idée de Rosenblatt" beat={2} top={784} hot>
      <Chip>exemples</Chip>
      <Op>+</Op>
      <Chip>réponses</Chip>
      <Op>→</Op>
      <Chip>machine</Chip>
      <Op>→</Op>
      <Chip hot>règles</Chip>
    </FlowRow>
  </Frame>
);

// ═══ 5 · L'inspiration : le neurone ══════════════════════════════════════════
// Overlay loops are placed in the source image's pixel space (1367 × 581).
const NS = 1120 / 1367;

const Loop = ({ cx, cy, rx, ry, rot = 0, beat }: { cx: number; cy: number; rx: number; ry: number; rot?: number; beat: number }) => (
  <ellipse
    cx={cx * NS}
    cy={cy * NS}
    rx={rx * NS}
    ry={ry * NS}
    transform={`rotate(${rot} ${cx * NS} ${cy * NS})`}
    fill="none"
    stroke={ink.red}
    strokeWidth={4.5}
    strokeLinecap="round"
    pathLength={1}
    className={`ah-draw${beat}`}
  />
);

const MapItem = ({ term, meaning, beat, top }: { term: string; meaning: string; beat: number; top: number }) => (
  <div className={`ah-on${beat}`} style={{ position: 'absolute', left: 1376, top, width: 404 }}>
    <div style={{ fontFamily: typewriter, fontSize: 36, lineHeight: 1.15, textShadow: BLEED }}>{term}</div>
    <div style={{ marginTop: 6, fontSize: 28, fontWeight: 700, color: 'var(--osd-accent)' }}>→ {meaning}</div>
  </div>
);

const Neuron: Page = () => (
  <Frame id="neuron" era="1957" eyebrow="L'inspiration" title="Inspiré, en partie, du cerveau" beats={3}>
    <div className="ah-in" style={{ ...vars({ d: '500ms' }), position: 'absolute', left: L, top: 318 }}>
      <div style={{ position: 'relative', padding: 14, background: ink.sheet, boxShadow: SHADOW, transform: 'rotate(-0.6deg)' }}>
        <img src={neuronPlate} alt="Neurone biologique et neurone artificiel" style={{ display: 'block', width: 1120, height: 476 }} />
        <svg width={1120} height={476} style={{ position: 'absolute', left: 14, top: 14, overflow: 'visible' }}>
          <g className="ah-dim2">
            <Loop cx={205} cy={300} rx={128} ry={142} rot={-10} beat={1} />
            <Loop cx={888} cy={315} rx={60} ry={212} beat={1} />
          </g>
          <g className="ah-dim3">
            <Loop cx={216} cy={316} rx={64} ry={60} beat={2} />
            <Loop cx={1135} cy={311} rx={92} ry={92} beat={2} />
          </g>
          <Loop cx={458} cy={304} rx={168} ry={100} rot={-10} beat={3} />
          <Loop cx={1258} cy={312} rx={74} ry={46} beat={3} />
        </svg>
        <Tape x={-36} y={-12} rot={-32} />
        <Tape x={1066} y={-12} rot={30} />
      </div>
    </div>
    <div className="ah-in-fade" style={{ ...vars({ d: '900ms' }), position: 'absolute', left: L, top: 850, fontSize: 24, color: ink.muted }}>
      Fig. 1 — Neurone biologique (à gauche) et neurone artificiel (à droite).
    </div>
    <MapItem term="Dendrites" meaning="les entrées" beat={1} top={344} />
    <MapItem term="Corps cellulaire" meaning="la somme" beat={2} top={470} />
    <MapItem term="Axone" meaning="la sortie" beat={3} top={596} />
    <Hand x={1380} y={738} w={400} rot={-3} size={38} className="ah-fade3" d={700}>
      une inspiration… pas une copie&nbsp;!
    </Hand>
  </Frame>
);

// ═══ 6 · Quelque chose de minuscule ══════════════════════════════════════════
const Struck = ({ text, top, d }: { text: string; top: number; d: number }) => (
  <div
    style={{
      position: 'absolute',
      left: L,
      top,
      fontFamily: typewriter,
      fontSize: 58,
      lineHeight: 1.2,
      color: ink.soft,
      textShadow: BLEED,
    }}
  >
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <Typed text={text} d={d} step={34} />
      <span
        aria-hidden
        className="ah-in-grow"
        style={{
          ...vars({ d: `${d + text.length * 34 + 150}ms` }),
          position: 'absolute',
          left: -10,
          right: -10,
          top: '38%',
          height: 6,
          borderRadius: 3,
          background: ink.red,
        }}
      />
    </span>
  </div>
);

const Tiny: Page = () => (
  <Frame id="tiny" era="1957" eyebrow="Le modèle" title="Il part de quelque chose de minuscule" beats={2}>
    <Struck text="ChatGPT" top={330} d={500} />
    <Struck text="Un réseau profond" top={425} d={1050} />
    <Struck text="Un modèle complexe" top={520} d={1900} />
    <div
      style={{
        position: 'absolute',
        left: L,
        top: 684,
        fontFamily: typewriter,
        fontSize: 58,
        lineHeight: 1.2,
        textShadow: BLEED,
      }}
    >
      <Typed text="Juste une petite cellule de calcul." beat={1} step={30} />
    </div>
    <svg className="ah-fade1" width={540} height={320} style={{ position: 'absolute', left: 1240, top: 330, overflow: 'visible' }}>
      <line x1={0} y1={40} x2={330} y2={160} stroke={ink.text} strokeWidth={3} pathLength={1} className="ah-draw1" />
      <line x1={0} y1={120} x2={330} y2={160} stroke={ink.text} strokeWidth={3} pathLength={1} className="ah-draw1" />
      <line x1={0} y1={200} x2={330} y2={160} stroke={ink.text} strokeWidth={3} pathLength={1} className="ah-draw1" />
      <line x1={0} y1={280} x2={330} y2={160} stroke={ink.text} strokeWidth={3} pathLength={1} className="ah-draw1" />
      <circle cx={330} cy={160} r={90} fill={ink.sheet} stroke={ink.text} strokeWidth={4} />
      <line x1={420} y1={160} x2={512} y2={160} stroke={ink.text} strokeWidth={3} />
      <polygon points={head(526, 160, 0, 18)} fill={ink.text} />
      <text x={330} y={306} textAnchor="middle" style={{ fontFamily: hand, fontWeight: 600, fontSize: 36 }} fill={ink.blue}>
        une seule cellule
      </text>
    </svg>
    <Stamp pos={{ left: 960, top: 800 }} rot={-6} size={92} beat={2}>
      Perceptron
    </Stamp>
  </Frame>
);

// ═══ 7 · Étape 1 : les entrées ═══════════════════════════════════════════════
// An 8 × 8 "image" showing a big dark T.
const RG = { x: 60, y: 60, c: 52 };
const T8: [number, number][] = [
  [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6],
  [2, 3], [2, 4], [3, 3], [3, 4], [4, 3], [4, 4], [5, 3], [5, 4], [6, 3], [6, 4],
];

const Retina8 = () => (
  <svg width={560} height={600} style={{ position: 'absolute', left: L - 20, top: 316, overflow: 'visible' }}>
    <rect x={RG.x} y={RG.y} width={RG.c * 8} height={RG.c * 8} fill={ink.sheet} style={{ filter: 'drop-shadow(0 12px 14px rgba(70, 45, 10, 0.25))' }} />
    {Array.from({ length: 9 }, (_, i) => (
      <g key={i}>
        <line x1={RG.x + i * RG.c} y1={RG.y} x2={RG.x + i * RG.c} y2={RG.y + RG.c * 8} stroke={ink.grid} strokeWidth={1.5} />
        <line x1={RG.x} y1={RG.y + i * RG.c} x2={RG.x + RG.c * 8} y2={RG.y + i * RG.c} stroke={ink.grid} strokeWidth={1.5} />
      </g>
    ))}
    {T8.map(([r, c], i) => (
      <rect
        key={i}
        x={RG.x + c * RG.c + 2}
        y={RG.y + r * RG.c + 2}
        width={RG.c - 4}
        height={RG.c - 4}
        fill={ink.pixel}
        className="ah-in-pop"
        style={vars({ d: `${400 + i * 45}ms` })}
      />
    ))}
    {/* x1: horizontal bar */}
    <rect x={104} y={104} width={328} height={68} rx={8} fill="none" stroke={ink.red} strokeWidth={5} pathLength={1} className="ah-draw1" />
    {/* x2: vertical stem */}
    <rect x={208} y={156} width={120} height={276} rx={8} fill="none" stroke={ink.red} strokeWidth={5} pathLength={1} className="ah-draw2" />
    {/* x3: size */}
    <g className="ah-fade3">
      <line x1={112} y1={34} x2={424} y2={34} stroke={ink.blue} strokeWidth={2.5} />
      <polygon points={head(112, 34, 180, 13)} fill={ink.blue} />
      <polygon points={head(424, 34, 0, 13)} fill={ink.blue} />
      <line x1={34} y1={112} x2={34} y2={424} stroke={ink.blue} strokeWidth={2.5} />
      <polygon points={head(34, 112, -90, 13)} fill={ink.blue} />
      <polygon points={head(34, 424, 90, 13)} fill={ink.blue} />
      <text x={268} y={22} textAnchor="middle" style={{ fontFamily: hand, fontWeight: 600, fontSize: 34 }} fill={ink.blue}>
        taille : grande
      </text>
    </g>
    {/* x4: colour */}
    <g className="ah-fade4">
      <path d="M 196 512 Q 204 470 238 440" fill="none" stroke={ink.blue} strokeWidth={2.5} />
      <polygon points={head(240, 438, -42, 13)} fill={ink.blue} />
      <text x={60} y={550} style={{ fontFamily: hand, fontWeight: 600, fontSize: 36 }} fill={ink.blue}>
        couleur : foncée
      </text>
    </g>
  </svg>
);

const InputRow = ({ n, q, v, top }: { n: number; q: string; v: 0 | 1; top: number }) => (
  <div className={`ah-on${n}`} style={{ position: 'absolute', left: 790, top, display: 'flex', alignItems: 'center', gap: 26 }}>
    <span
      style={{
        width: 70,
        height: 70,
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        boxSizing: 'border-box',
        border: `2.5px solid ${ink.text}`,
        background: ink.sheet,
        fontFamily: typewriter,
        fontSize: 34,
      }}
    >
      <span>
        x<sub style={{ fontSize: 20 }}>{n}</sub>
      </span>
    </span>
    <span style={{ width: 660, fontSize: 32 }}>{q}</span>
    <span
      style={{
        width: 70,
        height: 70,
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        boxSizing: 'border-box',
        border: `2.5px solid ${v ? ink.red : ink.faint}`,
        background: v ? ink.redSoft : 'transparent',
        color: v ? ink.red : ink.muted,
        fontFamily: typewriter,
        fontSize: 44,
      }}
    >
      {v}
    </span>
    <Label c={v ? ink.red : ink.muted}>{v ? 'oui' : 'non'}</Label>
  </div>
);

const Inputs: Page = () => (
  <Frame id="inputs" era="1957" eyebrow="Étape 1 · Les entrées" title="D'abord, des questions simples" beats={4}>
    <Retina8 />
    <div className="ah-in" style={{ ...vars({ d: '700ms' }), position: 'absolute', left: 790, top: 330, width: 990, fontSize: 30, lineHeight: 1.45, color: ink.soft }}>
      Cette image contient-elle la forme cherchée&nbsp;? On la décrit par quelques réponses oui&nbsp;/&nbsp;non&nbsp;:
    </div>
    <InputRow n={1} q={'Y a-t-il une ligne horizontale ?'} v={1} top={444} />
    <InputRow n={2} q={'Y a-t-il une ligne verticale ?'} v={1} top={544} />
    <InputRow n={3} q={'La forme est-elle grande ?'} v={1} top={644} />
    <InputRow n={4} q={'Sa couleur est-elle claire ?'} v={0} top={744} />
    <div
      className="ah-on4"
      style={{ ...vars({ d: '450ms' }), position: 'absolute', left: 790, top: 850, display: 'flex', alignItems: 'baseline', gap: 22 }}
    >
      <span style={{ fontSize: 28, color: ink.muted }}>soit les entrées</span>
      <span style={{ fontFamily: typewriter, fontSize: 46, color: 'var(--osd-accent)', textShadow: BLEED }}>x = (1, 1, 1, 0)</span>
    </div>
  </Frame>
);

// ═══ 8 · Étape 2 : peser, additionner, décider ═══════════════════════════════
const WG = { cx: 930, cy: 265, r: 100, x0: 360 };

const WeighInput = ({ y, label, v }: { y: number; label: string; v: 0 | 1 }) => (
  <g>
    <text x={0} y={y + 9} style={{ fontFamily: mono, fontSize: 26 }} fill={ink.soft}>
      {label}
    </text>
    <rect x={300} y={y - 30} width={60} height={60} fill={v ? ink.redSoft : ink.sheet} stroke={v ? ink.red : ink.faint} strokeWidth={2.5} />
    <text x={330} y={y + 14} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: 38 }} fill={v ? ink.red : ink.muted}>
      {v}
    </text>
  </g>
);

const WeighLine = ({ y, w, d }: { y: number; w: number; d: number }) => {
  const t = 0.42;
  const lx = WG.x0 + t * (WG.cx - WG.x0);
  const ly = y + t * (WG.cy - y);
  return (
    <g>
      <line
        x1={WG.x0}
        y1={y}
        x2={WG.cx}
        y2={WG.cy}
        strokeLinecap="round"
        className="ah-wl"
        style={vars({ sw: `${(2 + 14 * w).toFixed(1)}px`, d: `${d}ms` })}
      />
      <text
        x={lx}
        y={ly - 18}
        textAnchor="middle"
        className="ah-fade1"
        style={{
          ...vars({ d: `${d + 300}ms` }),
          fontFamily: typewriter,
          fontSize: 34,
          stroke: 'var(--osd-bg)',
          strokeWidth: 10,
          paintOrder: 'stroke',
          strokeLinejoin: 'round',
        }}
        fill={ink.red}
      >
        × {fr(w)}
      </text>
    </g>
  );
};

CSS.push(`
.ah-wl{stroke:${ink.faint};stroke-width:2px;transition:stroke-width 900ms ${EASE} var(--d,0ms),stroke 600ms ${EASE} var(--d,0ms)}
${has(1)} .ah-wl{stroke:${ink.soft};stroke-width:var(--sw)}
`);

const Weigh: Page = () => (
  <Frame id="weigh" era="1957" eyebrow="Étape 2 · Les poids" title="Peser, additionner, décider" beats={3}>
    <svg width={CW} height={620} style={{ position: 'absolute', left: L, top: 310, overflow: 'visible' }}>
      <WeighLine y={70} w={0.9} d={0} />
      <WeighLine y={200} w={0.8} d={120} />
      <WeighLine y={330} w={0.3} d={240} />
      <WeighLine y={460} w={0.1} d={360} />
      <WeighInput y={70} label="ligne horizontale" v={1} />
      <WeighInput y={200} label="ligne verticale" v={1} />
      <WeighInput y={330} label="grande taille" v={1} />
      <WeighInput y={460} label="couleur claire" v={0} />
      {/* Sum */}
      <circle cx={WG.cx} cy={WG.cy} r={WG.r} fill={ink.sheet} stroke={ink.text} strokeWidth={3.5} />
      <text x={WG.cx} y={WG.cy + 32} textAnchor="middle" style={{ fontFamily: '"Courier Prime", Georgia, serif', fontSize: 96 }} fill={ink.text}>
        Σ
      </text>
      <line x1={WG.cx + WG.r} y1={WG.cy} x2={1104} y2={WG.cy} stroke={ink.text} strokeWidth={3} />
      <polygon points={head(1118, WG.cy, 0, 16)} fill={ink.text} />
      {/* Threshold (step function) */}
      <rect x={1120} y={185} width={200} height={160} fill={ink.sheet} stroke={ink.text} strokeWidth={3} />
      <path d="M 1140 325 H 1302 M 1150 334 V 202" stroke={ink.faint} strokeWidth={2} fill="none" />
      <path d="M 1150 318 H 1226 V 214 H 1300" stroke={ink.red} strokeWidth={4} fill="none" />
      <text x={1220} y={380} textAnchor="middle" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
        seuil = 1,2
      </text>
      {/* Beat 2: the weighted sum */}
      <g className="ah-fade2">
        <text x={WG.cx} y={430} textAnchor="middle" style={{ fontFamily: mono, fontSize: 28 }} fill={ink.soft}>
          1×0,9 + 1×0,8 + 1×0,3 + 0×0,1
        </text>
        <text x={WG.cx} y={486} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: 46 }} fill={ink.red}>
          = 2,0
        </text>
      </g>
      {/* Beat 3: the decision */}
      <line x1={1320} y1={WG.cy} x2={1398} y2={WG.cy} stroke={ink.red} strokeWidth={3} pathLength={1} className="ah-draw3" />
      <g className="ah-fade3" style={vars({ d: '350ms' })}>
        <polygon points={head(1412, WG.cy, 0, 16)} fill={ink.red} />
        <rect x={1416} y={195} width={150} height={140} fill={ink.redSoft} stroke={ink.red} strokeWidth={3} />
        <text x={1491} y={302} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: 110 }} fill={ink.red}>
          1
        </text>
        <text x={1491} y={388} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: 40 }} fill={ink.red}>
          = OUI
        </text>
        <text x={1491} y={436} textAnchor="middle" style={{ fontFamily: mono, fontSize: 24 }} fill={ink.soft}>
          2,0 ≥ 1,2
        </text>
      </g>
      <text
        x={0}
        y={590}
        className="ah-fade1"
        style={{ ...vars({ d: '800ms' }), fontFamily: hand, fontWeight: 600, fontSize: 36 }}
        fill={ink.blue}
      >
        important → poids fort · secondaire → poids faible
      </text>
    </svg>
  </Frame>
);

// ═══ 9 · Planche technique ═══════════════════════════════════════════════════
// The source image is cropped above its English legend (and its watermark).
const PLATE_W = 1060;
const PLATE_CROP = Math.round((610 * PLATE_W) / 1279);

const LegendRow = ({ sym, children, d }: { sym: string; children: ReactNode; d: number }) => (
  <div className="ah-in" style={{ ...vars({ d: `${d}ms` }), display: 'flex', alignItems: 'baseline', height: 60 }}>
    <span style={{ width: 64, flex: 'none', fontFamily: '"Courier Prime", Georgia, serif', fontWeight: 700, fontSize: 40, color: 'var(--osd-accent)' }}>
      {sym}
    </span>
    <span style={{ fontSize: 26, color: ink.soft }}>{children}</span>
  </div>
);

const Plate: Page = () => (
  <Frame id="plate" era="1957" eyebrow="Planche technique" title="La même chose, en notation">
    <div className="ah-in" style={{ ...vars({ d: '400ms' }), position: 'absolute', left: L, top: 318 }}>
      <div style={{ position: 'relative', padding: 14, background: ink.sheet, boxShadow: SHADOW, transform: 'rotate(0.5deg)' }}>
        <div style={{ width: PLATE_W, height: PLATE_CROP, overflow: 'hidden' }}>
          <img src={perceptronPlate} alt="Schéma du perceptron" style={{ display: 'block', width: PLATE_W }} />
        </div>
        <Tape x={-40} y={-14} rot={-30} />
        <Tape x={1010} y={-14} rot={28} />
      </div>
    </div>
    <div className="ah-in-fade" style={{ ...vars({ d: '800ms' }), position: 'absolute', left: L, top: 870, fontSize: 24, color: ink.muted }}>
      Planche 1 — y = f(Σ wᵢ·xᵢ + b) : une somme pondérée, puis une activation.
    </div>
    <div style={{ position: 'absolute', left: 1330, top: 326, width: 450 }}>
      <div className="ah-in-fade" style={{ ...vars({ d: '600ms' }), marginBottom: 14 }}>
        <Label c={ink.red}>Légende</Label>
      </div>
      <LegendRow sym="x" d={800}>les entrées</LegendRow>
      <LegendRow sym="w" d={950}>les poids</LegendRow>
      <LegendRow sym="b" d={1100}>le biais (= − seuil)</LegendRow>
      <LegendRow sym="Σ" d={1250}>la somme pondérée</LegendRow>
      <LegendRow sym="f" d={1400}>l'activation</LegendRow>
      <LegendRow sym="y" d={1550}>la sortie : 0 ou 1</LegendRow>
    </div>
    <Hand x={1334} y={772} w={446} rot={-2} size={32} d={2000}>
      En 1957, f est une simple marche (0 ou 1). La courbe en S du schéma est la version moderne.
    </Hand>
  </Frame>
);

// ═══ 10 · Étape 3 : apprendre de ses erreurs ═════════════════════════════════
// Perceptron rule with η = 0.5 and threshold 1.2. Weights start at
// (0.4, 0.3, 0.3, 0.6) and end exactly at page 8's (0.9, 0.8, 0.3, 0.1).
const BIG_T: [number, number][] = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [2, 2], [3, 2], [4, 2]];
const DISC: [number, number][] = [
  [0, 1], [0, 2], [0, 3],
  [1, 0], [1, 1], [1, 2], [1, 3], [1, 4],
  [2, 0], [2, 1], [2, 2], [2, 3], [2, 4],
  [3, 0], [3, 1], [3, 2], [3, 3], [3, 4],
  [4, 1], [4, 2], [4, 3],
];
const SMALL_T: [number, number][] = [[1, 1], [1, 2], [1, 3], [2, 2], [3, 2]];

const MiniGrid = ({ cells, light }: { cells: [number, number][]; light?: boolean }) => (
  <svg width={130} height={130} style={{ position: 'absolute', left: 24, top: 66 }}>
    <rect x={0} y={0} width={130} height={130} fill="#fffaf0" stroke={ink.rule} strokeWidth={1.5} />
    {[1, 2, 3, 4].map((i) => (
      <g key={i}>
        <line x1={i * 26} y1={0} x2={i * 26} y2={130} stroke={ink.grid} />
        <line x1={0} y1={i * 26} x2={130} y2={i * 26} stroke={ink.grid} />
      </g>
    ))}
    {cells.map(([r, c]) => (
      <rect key={`${r}-${c}`} x={c * 26 + 1.5} y={r * 26 + 1.5} width={23} height={23} fill={light ? '#cdbd94' : ink.pixel} />
    ))}
  </svg>
);

const ExampleCard = ({
  n,
  left,
  name,
  cells,
  light,
  expect,
  got,
  sum,
  ok,
}: {
  n: number;
  left: number;
  name: string;
  cells: [number, number][];
  light?: boolean;
  expect: number;
  got: number;
  sum: string;
  ok?: boolean;
}) => (
  <div className={`ah-on${n}`} style={{ position: 'absolute', left, top: 300, width: 500, height: 290, background: ink.sheet, boxShadow: SHADOW }}>
    <div style={{ position: 'absolute', left: 24, right: 24, top: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <Label>Exemple {n}</Label>
      <span style={{ fontFamily: typewriter, fontSize: 28 }}>{name}</span>
    </div>
    <MiniGrid cells={cells} light={light} />
    <div style={{ position: 'absolute', left: 180, top: 66, fontSize: 26, lineHeight: 1.5 }}>
      <div>
        attendu : <b>{expect}</b>
      </div>
      <div>
        réponse : <b style={{ color: ok ? ink.blue : ink.red }}>{got}</b>
      </div>
      <div style={{ color: ink.muted }}>Σ = {sum}</div>
    </div>
    <Stamp pos={{ left: ok ? 250 : 262, top: 206 }} rot={-7} size={36} color={ok ? ink.blue : ink.red} beat={n} d={550}>
      {ok ? 'Correct' : 'Erreur'}
    </Stamp>
  </div>
);

const abs: CSSProperties = { position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap' };

const Gauge = ({
  n,
  label,
  v,
  top,
  up,
  down,
}: {
  n: number;
  label: string;
  v: [number, number, number];
  top: number;
  up?: boolean;
  down?: boolean;
}) => (
  <div style={{ position: 'absolute', left: L, top, height: 46, display: 'flex', alignItems: 'center' }}>
    <span style={{ width: 370, flex: 'none', fontSize: 26, color: ink.soft }}>
      w<sub style={{ fontSize: 17 }}>{n}</sub> {label}
    </span>
    <span
      style={{
        position: 'relative',
        width: 700,
        height: 24,
        flex: 'none',
        boxSizing: 'border-box',
        border: `1.5px solid ${ink.rule}`,
        background: ink.sheet,
      }}
    >
      <span
        className="ah-gbar"
        style={{
          ...vars({ w0: `${v[0] * 700}px`, w1: `${v[1] * 700}px`, w2: `${v[2] * 700}px` }),
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          background: ink.text,
        }}
      />
    </span>
    <span style={{ position: 'relative', width: 110, height: 40, flex: 'none', marginLeft: 24, fontFamily: typewriter, fontSize: 34 }}>
      <span className="ah-off1" style={abs}>
        {fr(v[0])}
      </span>
      <span className="ah-fade1 ah-off2" style={abs}>
        {fr(v[1])}
      </span>
      <span className="ah-fade2" style={abs}>
        {fr(v[2])}
      </span>
    </span>
    <span style={{ position: 'relative', width: 100, height: 34, flex: 'none', fontWeight: 700, fontSize: 26 }}>
      {up ? (
        <span className="ah-fade1 ah-off2" style={{ ...abs, ...vars({ d: '200ms' }), color: ink.blue }}>
          +0,5
        </span>
      ) : null}
      {down ? (
        <span className="ah-fade2 ah-off3" style={{ ...abs, ...vars({ d: '200ms' }), color: ink.red }}>
          −0,5
        </span>
      ) : null}
    </span>
  </div>
);

CSS.push(`
.ah-gbar{width:var(--w0);transition:width 900ms ${EASE} 250ms}
${has(1)} .ah-gbar{width:var(--w1)}
${has(2)} .ah-gbar{width:var(--w2)}
`);

const Learn: Page = () => (
  <Frame id="learn" era="1957" eyebrow="Étape 3 · Apprendre" title={"Et si les poids s'ajustaient seuls ?"} beats={3}>
    <ExampleCard n={1} left={170} name="un grand T" cells={BIG_T} expect={1} got={0} sum="1,0 < 1,2" />
    <ExampleCard n={2} left={725} name="un rond clair" cells={DISC} light expect={0} got={1} sum="1,4 ≥ 1,2" />
    <ExampleCard n={3} left={1280} name="un petit T" cells={SMALL_T} expect={1} got={1} sum="1,7 ≥ 1,2" ok />
    <div
      className="ah-in-fade"
      style={{
        ...vars({ d: '600ms' }),
        position: 'absolute',
        left: L,
        right: RIGHT,
        top: 640,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        paddingBottom: 10,
        borderBottom: `1.5px solid ${ink.rule}`,
      }}
    >
      <Label c={ink.red}>Les poids</Label>
      <span style={{ fontSize: 24, color: ink.soft }}>règle : w ← w + 0,5 × (attendu − réponse) × x</span>
    </div>
    <Gauge n={1} label="ligne horizontale" v={[0.4, 0.9, 0.9]} top={704} up />
    <Gauge n={2} label="ligne verticale" v={[0.3, 0.8, 0.8]} top={762} up />
    <Gauge n={3} label="grande taille" v={[0.3, 0.8, 0.3]} top={820} up down />
    <Gauge n={4} label="couleur claire" v={[0.6, 0.6, 0.1]} top={878} down />
    <Hand x={1496} y={712} w={290} rot={-3} size={34} className="ah-fade3" d={900}>
      plus d'erreur : ce sont les poids de tout à l'heure&nbsp;!
    </Hand>
  </Frame>
);

// ═══ 11 · Un cousin de la descente de gradient ═══════════════════════════════
const StepGlyph = () => (
  <svg width={180} height={96} style={{ flex: 'none' }}>
    <path d="M 10 86 H 172 M 22 92 V 8" stroke={ink.faint} strokeWidth={2} fill="none" />
    <path d="M 22 78 H 96 V 20 H 170" stroke={ink.red} strokeWidth={4} fill="none" />
  </svg>
);

const BowlGlyph = () => (
  <svg width={180} height={96} style={{ flex: 'none' }}>
    <path d="M 14 10 Q 92 160 170 10" stroke={ink.blue} strokeWidth={4} fill="none" />
    <circle cx={46} cy={44} r={10} fill={ink.red} />
    <path d="M 62 58 Q 74 70 86 74" stroke={ink.red} strokeWidth={2.5} fill="none" strokeDasharray="5 5" />
    <polygon points={head(92, 75, 12, 11)} fill={ink.red} />
  </svg>
);

const CompareCard = ({
  left,
  title,
  sub,
  glyph,
  formula,
  className,
  d = 0,
  children,
}: {
  left: number;
  title: string;
  sub: string;
  glyph: ReactNode;
  formula: string;
  className: string;
  d?: number;
  children: ReactNode;
}) => (
  <div
    className={className}
    style={{
      ...vars({ d: `${d}ms` }),
      position: 'absolute',
      left,
      top: 320,
      width: 770,
      height: 400,
      padding: '28px 34px',
      boxSizing: 'border-box',
      background: ink.sheet,
      boxShadow: SHADOW,
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontFamily: typewriter, fontSize: 36, lineHeight: 1.1, textShadow: BLEED }}>{title}</div>
        <div style={{ marginTop: 8 }}>
          <Label>{sub}</Label>
        </div>
      </div>
      {glyph}
    </div>
    <ul style={{ margin: '20px 0 0', padding: 0, listStyle: 'none', fontSize: 28, lineHeight: 1.55, color: ink.soft }}>{children}</ul>
    <div
      style={{
        position: 'absolute',
        left: 34,
        right: 34,
        bottom: 26,
        paddingTop: 16,
        borderTop: `1.5px dashed ${ink.rule}`,
        fontSize: 32,
        fontWeight: 700,
      }}
    >
      {formula}
    </div>
  </div>
);

const Gradient: Page = () => (
  <Frame id="gradient" era="Note" eyebrow="Un air de famille · cf. dossier précédent" title="Un cousin de la descente de gradient" beats={2}>
    <CompareCard left={170} title="Perceptron" sub="1957" glyph={<StepGlyph />} formula="w ← w + η·(y − ŷ)·x" className="ah-in" d={500}>
      <li>– corrige seulement quand il se trompe</li>
      <li>– sortie tout ou rien : 0 ou 1</li>
      <li>– règle très simple, sans dérivée</li>
    </CompareCard>
    <CompareCard left={1010} title="Descente de gradient" sub="aujourd'hui" glyph={<BowlGlyph />} formula="w ← w − η·∂L/∂w" className="ah-on1">
      <li>– mesure une erreur continue (le coût)</li>
      <li>– suit la pente de cette erreur</li>
      <li>– entraîne tous les poids d'un réseau</li>
    </CompareCard>
    <div style={{ position: 'absolute', left: L, top: 790, fontFamily: typewriter, fontSize: 52, lineHeight: 1.2, textShadow: BLEED }}>
      <span style={{ color: ink.muted }}>
        <Typed text="Point commun : " beat={2} step={30} />
      </span>
      <span style={{ color: 'var(--osd-accent)' }}>
        <Typed text="l'erreur" beat={2} d={450} step={30} />
      </span>
      <Typed text=" guide la correction." beat={2} d={690} step={30} />
    </div>
  </Frame>
);

// ═══ 12 · La leçon ═══════════════════════════════════════════════════════════
const Lesson: Page = () => (
  <Frame id="lesson" eyebrow="Ce qu'il faut retenir" beats={1}>
    <div
      className="ah-in-fade"
      style={{
        position: 'absolute',
        left: L - 16,
        top: 170,
        fontFamily: typewriter,
        fontSize: 300,
        lineHeight: 1,
        color: ink.rule,
      }}
    >
      «
    </div>
    <div
      style={{
        position: 'absolute',
        left: L,
        top: 384,
        fontFamily: typewriter,
        fontSize: 76,
        lineHeight: 1.22,
        textShadow: BLEED,
      }}
    >
      <Typed text={"L'erreur n'est pas\nla fin du processus."} d={400} step={32} />
    </div>
    <div
      style={{
        position: 'absolute',
        left: L,
        top: 624,
        fontFamily: typewriter,
        fontSize: 76,
        lineHeight: 1.22,
        textShadow: BLEED,
      }}
    >
      <Typed text="C'est " beat={1} step={30} />
      <span style={{ color: 'var(--osd-accent)' }}>
        <Mark beat={1} d={1300}>
          <Typed text="l'information" beat={1} d={180} step={30} />
        </Mark>
      </span>
      <Typed text={' qui sert\nà corriger le modèle.'} beat={1} d={570} step={30} />
    </div>
    <Stamp pos={{ left: 1300, top: 846 }} rot={-8} size={56} beat={1} d={1900}>
      À retenir
    </Stamp>
  </Frame>
);

// ═══ 13 · Mark I : la machine fait la une ════════════════════════════════════
const LETTER_A = [
  '....................',
  '.........##.........',
  '........####........',
  '........####........',
  '.......##..##.......',
  '.......##..##.......',
  '......##....##......',
  '......##....##......',
  '.....##......##.....',
  '.....##......##.....',
  '....############....',
  '....############....',
  '...##..........##...',
  '...##..........##...',
  '..##............##..',
  '..##............##..',
  '.##..............##.',
  '.##..............##.',
  '....................',
  '....................',
];
const LIT: [number, number][] = LETTER_A.flatMap((row, r) =>
  Array.from(row).flatMap((ch, c): [number, number][] => (ch === '#' ? [[r, c]] : [])),
);

const Retina20 = () => (
  <svg width={400} height={400} style={{ position: 'absolute', left: L, top: 322, overflow: 'visible' }}>
    <rect x={0} y={0} width={400} height={400} fill={ink.sheet} style={{ filter: 'drop-shadow(0 12px 14px rgba(70, 45, 10, 0.25))' }} />
    {Array.from({ length: 21 }, (_, i) => (
      <g key={i}>
        <line x1={i * 20} y1={0} x2={i * 20} y2={400} stroke={ink.grid} />
        <line x1={0} y1={i * 20} x2={400} y2={i * 20} stroke={ink.grid} />
      </g>
    ))}
    {LIT.map(([r, c]) => (
      <rect
        key={`${r}-${c}`}
        x={c * 20 + 1.5}
        y={r * 20 + 1.5}
        width={17}
        height={17}
        fill={ink.pixel}
        className="ah-in-pop"
        style={vars({ d: `${400 + (r * 20 + c) * 3.5}ms` })}
      />
    ))}
    <rect x={0} y={0} width={400} height={5} fill={ink.red} className="ah-scan" style={vars({ h: '395px', d: '2200ms' })} />
    <rect x={0} y={0} width={400} height={400} fill="none" stroke={ink.text} strokeWidth={2.5} />
  </svg>
);

const Spec = ({ label, value, top, d }: { label: string; value: string; top: number; d: number }) => (
  <div className="ah-in" style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: L, top, display: 'flex', alignItems: 'baseline', fontSize: 24 }}>
    <span style={{ width: 128, flex: 'none' }}>
      <Label>{label}</Label>
    </span>
    <span>{value}</span>
  </div>
);

const TORN = (() => {
  const r = rng(11);
  const pts = ['0% 0%', '100% 0%'];
  for (let i = 0; i <= 30; i++) pts.push(`${(100 - (i * 100) / 30).toFixed(2)}% ${(96.5 + r() * 3.5).toFixed(2)}%`);
  return `polygon(${pts.join(', ')})`;
})();

const Clipping = () => (
  <div
    className="ah-in"
    style={{
      ...vars({ d: '900ms' }),
      position: 'absolute',
      left: 970,
      top: 316,
      width: 810,
      filter: 'drop-shadow(0 14px 14px rgba(70, 45, 10, 0.3))',
    }}
  >
    <div style={{ transform: 'rotate(1.2deg)', background: '#f3e9cb', padding: '24px 34px 34px', clipPath: TORN }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Label>The New York Times</Label>
        <Label>8 juillet 1958</Label>
      </div>
      <div style={{ height: 4, margin: '10px 0 14px', borderTop: `1.5px solid ${ink.soft}`, borderBottom: `1.5px solid ${ink.soft}` }} />
      <div style={{ fontFamily: typewriter, fontSize: 38, lineHeight: 1.1, textShadow: BLEED }}>NEW NAVY DEVICE LEARNS BY DOING</div>
      <div style={{ marginTop: 8, fontSize: 23, fontStyle: 'italic', color: ink.soft }}>
        « Un nouvel appareil de la Navy apprend en faisant »
      </div>
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${ink.rule}`, fontSize: 23, lineHeight: 1.45 }}>
        « La Navy a dévoilé l'embryon d'un ordinateur qui pourra, espère-t-elle, marcher, parler, voir, écrire, se
        reproduire et avoir conscience de son existence. » <span style={{ color: ink.muted }}>(trad.)</span>
      </div>
    </div>
  </div>
);

const EyeIcon = () => (
  <>
    <path d="M 4 28 Q 28 4 52 28 Q 28 52 4 28 Z" fill="none" stroke={ink.text} strokeWidth={3} />
    <circle cx={28} cy={28} r={8} fill={ink.text} />
  </>
);
const EarIcon = () => (
  <>
    <path d="M 34 50 C 22 54 14 44 18 34 C 10 16 22 4 32 4 C 46 4 52 16 48 28 C 46 36 38 36 38 44" fill="none" stroke={ink.text} strokeWidth={3} strokeLinecap="round" />
    <path d="M 26 28 C 25 18 38 16 38 26" fill="none" stroke={ink.text} strokeWidth={3} strokeLinecap="round" />
  </>
);
const CellIcon = () => (
  <>
    <path d="M 2 10 L 26 28 M 2 28 L 26 28 M 2 46 L 26 28 M 46 28 H 56" stroke={ink.red} strokeWidth={3} />
    <circle cx={34} cy={28} r={12} fill={ink.sheet} stroke={ink.red} strokeWidth={3} />
  </>
);

const Vision = ({ beat, top, icon, hot, children }: { beat: number; top: number; icon: ReactNode; hot?: boolean; children: ReactNode }) => (
  <div className={`ah-on${beat}`} style={{ position: 'absolute', left: 990, top, display: 'flex', alignItems: 'center', gap: 26 }}>
    <svg width={58} height={56} style={{ flex: 'none', overflow: 'visible' }}>
      {icon}
    </svg>
    <span style={{ fontFamily: typewriter, fontSize: 42, color: hot ? 'var(--osd-accent)' : ink.text, textShadow: BLEED }}>{children}</span>
  </div>
);

const MarkI: Page = () => (
  <Frame id="mark1" era="1958" eyebrow="1957 – 1960 · Cornell Aeronautical Laboratory" title="Mark I : la machine fait la une" beats={3}>
    <Retina20 />
    <Hand x={600} y={372} w={320} rot={-4} size={34} d={1800}>
      400 « pixels » pour regarder une lettre
    </Hand>
    <Spec label="Rétine" value="20 × 20 cellules photoélectriques" top={752} d={1200} />
    <Spec label="Poids" value="potentiomètres tournés par des moteurs" top={798} d={1350} />
    <Clipping />
    <Vision beat={1} top={706} icon={<EyeIcon />}>
      Des machines qui voient.
    </Vision>
    <Vision beat={2} top={782} icon={<EarIcon />}>
      Des machines qui entendent.
    </Vision>
    <Vision beat={3} top={858} icon={<CellIcon />} hot>
      Des machines qui apprennent.
    </Vision>
  </Frame>
);

// ═══ 14 · Une seule droite ═══════════════════════════════════════════════════
const ONES: [number, number][] = [
  [470, 150], [540, 210], [600, 130], [520, 290], [630, 250], [410, 230], [580, 330], [660, 190],
];
const ZEROS: [number, number][] = [
  [120, 420], [200, 470], [160, 340], [260, 400], [300, 480], [100, 500], [230, 300], [340, 430],
];

const Dot = ({ x, y, v, d }: { x: number; y: number; v: 0 | 1; d: number }) =>
  v ? (
    <circle cx={x} cy={y} r={15} fill={ink.text} className="ah-in-pop" style={vars({ d: `${d}ms` })} />
  ) : (
    <circle cx={x} cy={y} r={13} fill={ink.sheet} stroke={ink.text} strokeWidth={4} className="ah-in-pop" style={vars({ d: `${d}ms` })} />
  );

const Line: Page = () => (
  <Frame id="line" era="1969" eyebrow="La limite" title="Il ne sait tracer qu'une droite" beats={1}>
    <div className="ah-in-fade" style={{ ...vars({ d: '300ms' }), position: 'absolute', left: L, top: 320, width: 720, height: 560, ...graph(48) }}>
      <svg width={720} height={560} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {ONES.map(([x, y], i) => (
          <Dot key={`a${i}`} x={x} y={y} v={1} d={500 + i * 70} />
        ))}
        {ZEROS.map(([x, y], i) => (
          <Dot key={`b${i}`} x={x} y={y} v={0} d={540 + i * 70} />
        ))}
        <line x1={140} y1={30} x2={610} y2={550} stroke={ink.red} strokeWidth={4.5} strokeLinecap="round" pathLength={1} className="ah-in-draw" style={vars({ d: '1500ms' })} />
        <text x={270} y={548} className="ah-in-fade" style={{ ...vars({ d: '2400ms' }), fontFamily: hand, fontWeight: 600, fontSize: 32 }} fill={ink.blue}>
          la frontière : une droite
        </text>
        <text x={696} y={40} textAnchor="end" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
          ● = 1 · ○ = 0
        </text>
      </svg>
    </div>
    <div className="ah-in" style={{ ...vars({ d: '900ms' }), position: 'absolute', left: 980, top: 336, width: 800, fontSize: 32, lineHeight: 1.5 }}>
      Le Perceptron sait apprendre des motifs simples…
    </div>
    <div className="ah-in" style={{ ...vars({ d: '1300ms' }), position: 'absolute', left: 980, top: 466, width: 800, fontSize: 32, lineHeight: 1.5 }}>
      …surtout quand une seule droite suffit à séparer les deux catégories.
    </div>
    <div className="ah-in" style={{ ...vars({ d: '1900ms' }), position: 'absolute', left: 980, top: 620, width: 800, fontFamily: typewriter, fontSize: 40, lineHeight: 1.25, textShadow: BLEED }}>
      On dit : <span style={{ color: 'var(--osd-accent)' }}>linéairement séparable</span>.
    </div>
    <div style={{ position: 'absolute', left: 980, top: 760, width: 800, fontFamily: typewriter, fontSize: 44, lineHeight: 1.25, color: 'var(--osd-accent)', textShadow: BLEED }}>
      <Typed text="Mais certains problèmes ne se laissent pas couper ainsi…" beat={1} step={26} />
    </div>
  </Frame>
);

// ═══ 15 · XOR ════════════════════════════════════════════════════════════════
// XOR board: (x1, x2) ∈ {0, 1}² mapped onto a 560 px square.
const XP = (x1: number) => 90 + 380 * x1;
const YP = (x2: number) => 470 - 380 * x2;

const XorPoint = ({ x1, x2, v }: { x1: number; x2: number; v: 0 | 1 }) => (
  <g>
    {v ? (
      <circle cx={XP(x1)} cy={YP(x2)} r={21} fill={ink.text} />
    ) : (
      <circle cx={XP(x1)} cy={YP(x2)} r={19} fill={ink.sheet} stroke={ink.text} strokeWidth={4.5} />
    )}
    <text x={XP(x1)} y={YP(x2) + 54} textAnchor="middle" style={{ fontFamily: mono, fontSize: 21 }} fill={ink.muted}>
      ({x1}, {x2})
    </text>
  </g>
);

const XorBoard = ({ left, top, children }: { left: number; top: number; children?: ReactNode }) => (
  <div className="ah-in-fade" style={{ ...vars({ d: '300ms' }), position: 'absolute', left, top, width: 560, height: 560, ...graph(38) }}>
    <svg width={560} height={560} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      {children}
      <XorPoint x1={0} x2={0} v={0} />
      <XorPoint x1={0} x2={1} v={1} />
      <XorPoint x1={1} x2={0} v={1} />
      <XorPoint x1={1} x2={1} v={0} />
      <text x={548} y={548} textAnchor="end" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
        x₁ →
      </text>
      <text x={14} y={30} style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
        ↑ x₂
      </text>
    </svg>
  </div>
);

const WrongRing = ({ x1, x2 }: { x1: number; x2: number }) => (
  <g>
    <circle cx={XP(x1)} cy={YP(x2)} r={38} fill="none" stroke={ink.red} strokeWidth={4} strokeDasharray="7 6" />
    <path
      d={`M ${XP(x1) + 30} ${YP(x2) - 46} l 18 18 m 0 -18 l -18 18`}
      stroke={ink.red}
      strokeWidth={4}
      strokeLinecap="round"
    />
  </g>
);

// One attempt: a line, the half-plane it labels "1" (shaded), and its mistakes.
const Attempt = ({
  k,
  poly,
  line,
  children,
}: {
  k: number;
  poly: string;
  line: [number, number, number, number];
  children: ReactNode;
}) => (
  <g className={`ah-fade${k} ah-dim${k + 1}`}>
    <polygon points={poly} fill={ink.blueSoft} />
    <line x1={line[0]} y1={line[1]} x2={line[2]} y2={line[3]} stroke={ink.red} strokeWidth={5} strokeLinecap="round" pathLength={1} className={`ah-draw${k}`} />
    {children}
  </g>
);

const TruthRow = ({ a, b, out, top, d }: { a: number; b: number; out: 0 | 1; top: number; d: number }) => (
  <div
    className="ah-in"
    style={{
      ...vars({ d: `${d}ms` }),
      position: 'absolute',
      left: L,
      top,
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      fontFamily: typewriter,
      fontSize: 48,
      lineHeight: 1.2,
      textShadow: BLEED,
    }}
  >
    <span>
      {a} XOR {b} → <span style={{ color: out ? 'var(--osd-accent)' : ink.text }}>{out}</span>
    </span>
    <svg width={40} height={40} style={{ flex: 'none' }}>
      {out ? (
        <circle cx={20} cy={20} r={15} fill={ink.text} />
      ) : (
        <circle cx={20} cy={20} r={13} fill={ink.sheet} stroke={ink.text} strokeWidth={4} />
      )}
    </svg>
  </div>
);

const AttemptNote = ({ k, top }: { k: number; top: number }) => (
  <div className={`ah-on${k}`} style={{ position: 'absolute', left: 1460, top, fontFamily: typewriter, fontSize: 36, textShadow: BLEED }}>
    essai {k} : <span style={{ color: 'var(--osd-accent)' }}>raté</span>
  </div>
);

const Xor: Page = () => (
  <Frame id="xor" era="1969" eyebrow="Le contre-exemple" title="XOR : le problème qui résiste" beats={3}>
    <TruthRow a={0} b={0} out={0} top={336} d={600} />
    <TruthRow a={0} b={1} out={1} top={410} d={750} />
    <TruthRow a={1} b={0} out={1} top={484} d={900} />
    <TruthRow a={1} b={1} out={0} top={558} d={1050} />
    <div className="ah-in" style={{ ...vars({ d: '1400ms' }), position: 'absolute', left: L, top: 676, width: 600, fontSize: 28, lineHeight: 1.45, color: ink.soft }}>
      XOR vaut 1 quand les deux entrées sont <b>différentes</b>.
    </div>
    <XorBoard left={840} top={320}>
      <Attempt k={1} poly="0,0 560,0 560,560 370,560 0,190" line={[14, 204, 356, 546]}>
        <WrongRing x1={1} x2={1} />
      </Attempt>
      <Attempt k={2} poly="0,0 190,0 560,370 560,560 0,560" line={[204, 14, 546, 356]}>
        <WrongRing x1={0} x2={0} />
      </Attempt>
      <Attempt k={3} poly="280,0 560,0 560,560 280,560" line={[280, 16, 280, 544]}>
        <WrongRing x1={0} x2={1} />
        <WrongRing x1={1} x2={1} />
      </Attempt>
    </XorBoard>
    <AttemptNote k={1} top={380} />
    <AttemptNote k={2} top={450} />
    <AttemptNote k={3} top={520} />
    <Hand x={1462} y={620} w={320} rot={-3} size={34} className="ah-fade3" d={900}>
      aucune droite ne sépare les ● des ○
    </Hand>
    <Stamp pos={{ left: 905, top: 562 }} rot={-12} size={64} beat={3} d={700}>
      Impossible
    </Stamp>
  </Frame>
);

// ═══ 16 · Le doute ═══════════════════════════════════════════════════════════
const CURVE: [number, number][] = [
  [40, 350], [100, 300], [145, 170], [220, 100], [310, 104], [400, 150], [460, 214], [550, 296], [670, 330],
];
const yearX = (y: number) => 40 + (y - 1955) * 30;

const YearTick = ({ year }: { year: number }) => (
  <g>
    <line x1={yearX(year)} y1={370} x2={yearX(year)} y2={380} stroke={ink.soft} strokeWidth={2} />
    <text x={yearX(year)} y={402} textAnchor="middle" style={{ fontFamily: mono, fontSize: 20 }} fill={ink.muted}>
      {year}
    </text>
  </g>
);

const Doubt: Page = () => (
  <Frame id="doubt" era="1969" eyebrow="La critique" title="Le doute s'installe" beats={2}>
    <div className="ah-in" style={{ ...vars({ d: '500ms' }), position: 'absolute', left: L, top: 320, width: 680, height: 410 }}>
      <div style={{ width: '100%', height: '100%', padding: '24px 30px', boxSizing: 'border-box', transform: 'rotate(-1deg)', ...ruled(70, 48) }}>
        <Label c={ink.red}>Réf. bibliographique</Label>
        <div style={{ marginTop: 34, fontFamily: typewriter, fontSize: 32, textShadow: BLEED }}>Marvin Minsky &amp; Seymour Papert</div>
        <div style={{ marginTop: 4, fontFamily: typewriter, fontSize: 64, lineHeight: 1.1, textShadow: BLEED }}>Perceptrons</div>
        <div style={{ marginTop: 4, fontSize: 26, color: ink.muted }}>MIT Press · 1969</div>
        <div style={{ marginTop: 22, fontSize: 26, lineHeight: 1.45, color: ink.soft }}>
          Un perceptron à une seule couche a des limites réelles — XOR en tête.
        </div>
      </div>
    </div>
    <div className="ah-in-fade" style={{ ...vars({ d: '700ms' }), position: 'absolute', left: 960, top: 320, width: 820, height: 410, ...graph(41) }}>
      <svg width={820} height={410} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <line x1={40} y1={370} x2={800} y2={370} stroke={ink.soft} strokeWidth={2} />
        <line x1={40} y1={370} x2={40} y2={24} stroke={ink.soft} strokeWidth={2} />
        <YearTick year={1957} />
        <YearTick year={1969} />
        <YearTick year={1980} />
        <text x={26} y={300} transform="rotate(-90 26 300)" style={{ fontFamily: hand, fontWeight: 600, fontSize: 28 }} fill={ink.muted}>
          enthousiasme
        </text>
        <text x={794} y={38} textAnchor="end" style={{ fontFamily: mono, fontSize: 18 }} fill={ink.muted}>
          (allure indicative)
        </text>
        <path d={smooth(CURVE)} fill="none" stroke={ink.blue} strokeWidth={4.5} strokeLinecap="round" pathLength={1} className="ah-in-draw" style={vars({ d: '1000ms' })} />
        <path d="M 670 330 C 710 340, 750 330, 780 318" fill="none" stroke={ink.blue} strokeWidth={4} strokeDasharray="8 9" className="ah-in-fade" style={vars({ d: '2300ms' })} />
        <g className="ah-in-fade" style={vars({ d: '1700ms' })}>
          <circle cx={145} cy={170} r={7} fill={ink.red} />
          <text x={232} y={64} style={{ fontFamily: hand, fontWeight: 600, fontSize: 30 }} fill={ink.blue}>
            1958 : la presse s'emballe
          </text>
        </g>
        <g className="ah-in-fade" style={vars({ d: '2100ms' })}>
          <circle cx={460} cy={214} r={7} fill={ink.red} />
          <text x={480} y={200} style={{ fontFamily: hand, fontWeight: 600, fontSize: 30 }} fill={ink.blue}>
            1969 : la critique
          </text>
        </g>
        <text x={790} y={300} textAnchor="middle" className="ah-in-fade" style={{ ...vars({ d: '2600ms' }), fontFamily: typewriter, fontSize: 60 }} fill={ink.red}>
          ?
        </text>
      </svg>
    </div>
    <div style={{ position: 'absolute', left: L, top: 784, fontFamily: typewriter, fontSize: 42, lineHeight: 1.25, textShadow: BLEED }}>
      <Typed text={"Pour un temps, le rêve d'une « machine qui apprend »\nsemble trop grand pour les moyens de l'époque."} beat={1} step={22} />
    </div>
    <Stamp pos={{ left: 1010, top: 592 }} rot={-6} size={46} beat={2}>
      Dossier en suspens
    </Stamp>
  </Frame>
);

// ═══ 17 · Plusieurs cellules ═════════════════════════════════════════════════
const NetNode = ({ x, y, r, label, size = 32, beat }: { x: number; y: number; r: number; label: string; size?: number; beat?: number }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={ink.sheet} stroke={ink.faint} strokeWidth={3} />
    {beat ? <circle cx={x} cy={y} r={r} fill={ink.blueSoft} stroke={ink.blue} strokeWidth={4} className={`ah-fade${beat}`} /> : null}
    <text x={x} y={y + size * 0.35} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: size }} fill={ink.text}>
      {label}
    </text>
  </g>
);

const NetEdge = ({ x1, y1, x2, y2, beat }: { x1: number; y1: number; x2: number; y2: number; beat: number }) => (
  <g>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={ink.faint} strokeWidth={2.5} />
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={ink.blue} strokeWidth={4} pathLength={1} className={`ah-draw${beat}`} />
  </g>
);

const CellLine = ({ beat, x1, y1, x2, y2, label, lx, ly }: { beat: number; x1: number; y1: number; x2: number; y2: number; label: string; lx: number; ly: number }) => (
  <g className={`ah-fade${beat}`}>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={ink.blue} strokeWidth={5} strokeLinecap="round" pathLength={1} className={`ah-draw${beat}`} />
    <text x={lx} y={ly} style={{ fontFamily: hand, fontWeight: 600, fontSize: 32 }} fill={ink.blue}>
      {label}
    </text>
  </g>
);

const Many: Page = () => (
  <Frame id="many" era="Plus tard" eyebrow="La réponse" title={'Et si on prenait plusieurs cellules ?'} beats={3}>
    <XorBoard left={L} top={320}>
      <polygon points="0,190 0,0 190,0 560,370 560,560 370,560" fill={ink.blueSoft} className="ah-fade3" />
      <CellLine beat={1} x1={14} y1={204} x2={356} y2={546} label="cellule 1" lx={150} ly={296} />
      <CellLine beat={2} x1={204} y1={14} x2={546} y2={356} label="cellule 2" lx={300} ly={40} />
    </XorBoard>
    <svg width={960} height={560} style={{ position: 'absolute', left: 820, top: 330, overflow: 'visible' }}>
      <NetEdge x1={90} y1={150} x2={440} y2={130} beat={1} />
      <NetEdge x1={90} y1={410} x2={440} y2={130} beat={1} />
      <NetEdge x1={90} y1={150} x2={440} y2={430} beat={2} />
      <NetEdge x1={90} y1={410} x2={440} y2={430} beat={2} />
      <NetEdge x1={440} y1={130} x2={780} y2={280} beat={3} />
      <NetEdge x1={440} y1={430} x2={780} y2={280} beat={3} />
      <NetNode x={90} y={150} r={40} label="x₁" />
      <NetNode x={90} y={410} r={40} label="x₂" />
      <NetNode x={440} y={130} r={72} label="OU" beat={1} />
      <NetNode x={440} y={430} r={72} label="NON-ET" size={26} beat={2} />
      <NetNode x={780} y={280} r={72} label="ET" beat={3} />
      <g className="ah-fade3" style={vars({ d: '600ms' })}>
        <line x1={852} y1={280} x2={930} y2={280} stroke={ink.blue} strokeWidth={4} />
        <polygon points={head(944, 280, 0, 16)} fill={ink.blue} />
        <text x={898} y={336} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: 34 }} fill={ink.blue}>
          XOR
        </text>
      </g>
      <text x={40} y={540} className="ah-in-fade" style={{ ...vars({ d: '800ms' }), fontFamily: hand, fontWeight: 600, fontSize: 32 }} fill={ink.blue}>
        chaque cellule trace sa droite ; la dernière les combine
      </text>
    </svg>
    <Stamp pos={{ left: 1400, top: 736 }} rot={-8} size={46} color={ink.blue} beat={3} d={900}>
      XOR résolu
    </Stamp>
  </Frame>
);

// ═══ 18 · La chaîne ══════════════════════════════════════════════════════════
const ChainCard = ({ i, year, last, children }: { i: number; year?: string; last?: boolean; children: ReactNode }) => {
  const x = L + i * 166;
  const y = 300 + i * 88;
  const d = 500 + i * 420;
  return (
    <>
      {last ? null : (
        <svg width={170} height={70} style={{ position: 'absolute', left: x + 20, top: y + 64, overflow: 'visible' }}>
          <path d="M 20 0 V 56 H 134" fill="none" stroke={ink.soft} strokeWidth={2.5} pathLength={1} className="ah-in-draw" style={vars({ d: `${d + 200}ms` })} />
          <polygon points={head(146, 56, 0, 13)} fill={ink.soft} className="ah-in-fade" style={vars({ d: `${d + 500}ms` })} />
        </svg>
      )}
      <div
        className="ah-in"
        style={{
          ...vars({ d: `${d}ms` }),
          position: 'absolute',
          left: x,
          top: y,
          width: 580,
          height: 64,
          padding: '0 20px',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          background: last ? ink.redSoft : ink.sheet,
          border: `2px solid ${last ? ink.red : ink.text}`,
          boxShadow: SHADOW,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 20, color: ink.muted }}>{pad2(i + 1)}</span>
        <span style={{ fontFamily: typewriter, fontSize: 32, whiteSpace: 'nowrap', color: last ? 'var(--osd-accent)' : ink.text }}>{children}</span>
      </div>
      {year ? (
        <Stamp pos={{ left: x + 600, top: y + 8 }} rot={-5} size={26} d={d + 350}>
          {year}
        </Stamp>
      ) : null}
    </>
  );
};

const Chain: Page = () => (
  <Frame id="chain" era="1957 → 2026" eyebrow="La suite de l'histoire" title="D'une cellule… à l'IA d'aujourd'hui">
    <ChainCard i={0} year="1957">
      Un Perceptron
    </ChainCard>
    <ChainCard i={1}>Plusieurs Perceptrons</ChainCard>
    <ChainCard i={2}>Des couches</ChainCard>
    <ChainCard i={3}>Des réseaux de neurones</ChainCard>
    <ChainCard i={4} year="1986">
      La rétropropagation
    </ChainCard>
    <ChainCard i={5} year="2012">
      Le deep learning
    </ChainCard>
    <ChainCard i={6} last>
      Les systèmes d'aujourd'hui
    </ChainCard>
    <Hand x={L + 20} y={770} w={560} rot={-3} size={38} d={3600}>
      même idée de départ : apprendre à partir d'exemples
    </Hand>
  </Frame>
);

// ═══ 19 · L'idée révolutionnaire ═════════════════════════════════════════════
const Revolution: Page = () => (
  <Frame id="revolution" era="1957" eyebrow="L'idée qui a tout changé" title="Simple… mais révolutionnaire" beats={2}>
    <div style={{ position: 'absolute', left: L, top: 330, fontFamily: typewriter, fontSize: 58, lineHeight: 1.25, color: ink.muted }}>
      <Typed text={"Au lieu d'écrire toutes les règles\npour la machine…"} d={900} step={26} />
    </div>
    <div style={{ position: 'absolute', left: L, top: 530, fontFamily: typewriter, fontSize: 80, lineHeight: 1.2, textShadow: BLEED }}>
      <Typed text={'…laissez-la apprendre les règles\n'} beat={1} step={28} />
      <span style={{ color: 'var(--osd-accent)' }}>
        <Mark beat={1} d={1550}>
          <Typed text="à partir des exemples" beat={1} d={900} step={28} />
        </Mark>
      </span>
      <Typed text="." beat={1} d={1500} step={28} />
    </div>
    <div className="ah-on2" style={{ position: 'absolute', left: L, top: 808, fontSize: 34, color: ink.soft }}>
      C'est là que commence le vrai chemin vers le <b style={{ color: ink.text }}>machine learning</b>.
    </div>
  </Frame>
);

// ─── Series navigation (links to the other decks) ───────────────────────────
// Absolute URL of another deck, built from the current one so it works both
// locally (/s/<id>) and on GitHub Pages (/<repo>/s/<id>).
const deckHref = (id: string) => {
  if (typeof location === 'undefined') return `/s/${id}`;
  const p = location.pathname;
  const i = p.indexOf('/s/');
  const base = i >= 0 ? p.slice(0, i + 1) : p.endsWith('/') ? p : `${p}/`;
  return `${base}s/${id}`;
};

const NavCard = ({ id, kicker, children }: { id: string; kicker: string; children: ReactNode }) => (
  <a href={deckHref(id)} style={{ display: 'block', width: 400, color: 'inherit', textDecoration: 'none' }}>
    <div style={{ padding: '14px 20px 16px', background: ink.sheet, boxShadow: SHADOW, border: `2.5px solid ${ink.red}` }}>
      <Label c={ink.red}>{kicker}</Label>
      <div style={{ marginTop: 6, fontFamily: typewriter, fontSize: 30, lineHeight: 1.15, textShadow: BLEED }}>{children}</div>
    </div>
  </a>
);

// ═══ 20 · La question suivante ═══════════════════════════════════════════════
const NET = (() => {
  const xs = [60, 250, 440, 630];
  const counts = [4, 6, 6, 3];
  const nodes = counts.map((n, l) => Array.from({ length: n }, (_, i) => ({ x: xs[l], y: 300 + (i - (n - 1) / 2) * 92 })));
  const edges: { x1: number; y1: number; x2: number; y2: number; l: number }[] = [];
  for (let l = 0; l < 3; l++) for (const a of nodes[l]) for (const b of nodes[l + 1]) edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, l });
  return { nodes: nodes.flat(), edges };
})();
const QMARKS = [5, 14, 20, 29, 38, 47, 55, 63, 71];
const BACK = NET.edges.filter((e, i) => e.l === 2 || (e.l === 1 && i % 5 === 0) || (e.l === 0 && i % 6 === 0));

const Next: Page = () => (
  <Frame id="next" era="À suivre" eyebrow="La question suivante" title="Une question plus redoutable" beats={2}>
    <div className="ah-in" style={{ ...vars({ d: '800ms' }), position: 'absolute', left: L, top: 318, width: 840, fontSize: 32, lineHeight: 1.5 }}>
      Un réseau de centaines, voire de milliers de cellules, se trompe…
    </div>
    <div style={{ position: 'absolute', left: L, top: 452, fontFamily: typewriter, fontSize: 50, lineHeight: 1.2, textShadow: BLEED }}>
      <Typed text={'Quelle cellule, quel poids\nfaut-il corriger ?'} beat={1} step={28} />
    </div>
    <div className="ah-on2" style={{ position: 'absolute', left: L, top: 628 }}>
      <div style={{ fontSize: 28, color: ink.muted }}>La réponse a un nom :</div>
      <div style={{ marginTop: 4, fontFamily: typewriter, fontSize: 84, lineHeight: 1.15, color: 'var(--osd-accent)', textShadow: BLEED }}>
        Rétropropagation
      </div>
      <div style={{ marginTop: 6, fontSize: 28, color: ink.soft }}>→ dans le prochain dossier, nº 02</div>
    </div>
    <svg width={720} height={620} style={{ position: 'absolute', left: 1060, top: 300, overflow: 'visible' }}>
      {NET.edges.map((e, i) => (
        <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={ink.faint} strokeWidth={1.5} />
      ))}
      <g className="ah-fade2">
        {BACK.map((e, i) => (
          <line
            key={i}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            stroke={ink.red}
            strokeWidth={3}
            strokeDasharray="10 8"
            className="ah-back"
            opacity={e.l === 2 ? 0.9 : 0.6}
          />
        ))}
      </g>
      {NET.nodes.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={20} fill={ink.sheet} stroke={ink.text} strokeWidth={2.5} />
      ))}
      {QMARKS.map((k, i) => {
        const e = NET.edges[k];
        return (
          <g key={k} className="ah-fade1" style={vars({ d: `${300 + i * 90}ms` })}>
            <circle cx={(e.x1 + e.x2) / 2} cy={(e.y1 + e.y2) / 2} r={19} fill={ink.sheet} stroke={ink.red} strokeWidth={2.5} />
            <text
              x={(e.x1 + e.x2) / 2}
              y={(e.y1 + e.y2) / 2 + 10}
              textAnchor="middle"
              style={{ fontFamily: typewriter, fontSize: 30 }}
              fill={ink.red}
            >
              ?
            </text>
          </g>
        );
      })}
      <text x={300} y={604} textAnchor="middle" className="ah-fade2" style={{ ...vars({ d: '500ms' }), fontFamily: hand, fontWeight: 600, fontSize: 34 }} fill={ink.red}>
        ← l'erreur remonte le réseau
      </text>
    </svg>
    <Stamp pos={{ left: 1556, top: 296 }} rot={-8} size={32} d={1200}>
      Erreur
    </Stamp>
    <div className="ah-in" style={{ ...vars({ d: '1400ms' }), position: 'absolute', left: L, top: 846, display: 'flex', gap: 28 }}>
      <NavCard id="ai-history-sommaire" kicker="← Sommaire général">
        Les 11 dossiers
      </NavCard>
      <NavCard id="ai-history-02-retropropagation" kicker="Dossier nº 02 →">
        La rétropropagation
      </NavCard>
    </div>
  </Frame>
);

// ─── Deck wiring ────────────────────────────────────────────────────────────
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

Cover.transition = {
  duration: 280,
  exit: { duration: 280, easing: EASE_IN, keyframes: HOLD },
  enter: {
    duration: 280,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(12px)', filter: 'blur(4px)' },
      { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
    ],
  },
};

const STYLE_ID = 'osd-styles-ai-history-01-perceptron';
const STYLE_CSS = CSS.join('\n');
if (typeof document !== 'undefined') {
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  if (style.textContent !== STYLE_CSS) style.textContent = STYLE_CSS;
}

export const meta: SlideMeta = {
  title: 'Le Perceptron : la machine qui apprend',
  createdAt: '2026-10-04T15:55:31.826Z',
};

export const notes: (string | undefined)[] = [
  `Ouverture. Premier dossier des « archives de l'IA » : le Perceptron, 1957.
Laisser la carte perforée se remplir : ses trous encodent vraiment « PERCEPTRON 1957 » en code Hollerith, comme les cartes de l'époque.`,
  `Dans les années 1950, il y avait un rêve très étrange.
Et si on pouvait construire une machine qui n'exécute pas seulement des instructions…
Clic : … mais qui apprend ?`,
  `À l'époque, l'ordinateur n'avait rien à voir avec ceux d'aujourd'hui : une machine énorme, chère, qui exécute uniquement ce que l'humain lui écrit.
Clic : si on voulait qu'elle distingue deux choses, il fallait lui écrire les règles soi-même, une par une.`,
  `Mais un chercheur américain, Frank Rosenblatt — psychologue de formation, au Cornell Aeronautical Laboratory — pensait à autre chose.
Sa question : et si la machine apprenait à partir d'exemples, au lieu qu'on lui dicte toutes les règles ?
Clic 1 : avant, règles + données → réponses. Clic 2 : son idée, exemples + réponses → la machine en déduit les règles.`,
  `L'idée s'inspire en partie du fonctionnement des neurones du cerveau.
Clic 1 : les dendrites reçoivent les signaux → les entrées. Clic 2 : le corps cellulaire les combine → la somme. Clic 3 : l'axone transmet → la sortie.
Insister : c'est une inspiration, pas une copie ; un vrai neurone est bien plus complexe.`,
  `Il commence donc à construire un modèle très simple.
Pas ChatGPT. Pas un réseau profond. Pas même un modèle complexe.
Clic 1 : juste une petite cellule de calcul. Clic 2 : et il l'appelle… le Perceptron.`,
  `Imaginez que vous voulez que l'ordinateur décide : cette image contient-elle une certaine forme ?
On lui donne des informations, une par clic : ligne horizontale ? ligne verticale ? grande taille ? couleur claire ?
Chaque réponse devient un nombre, 1 pour oui, 0 pour non. Ici x = (1, 1, 1, 0).`,
  `Le Perceptron prend ces informations, mais ne les traite pas toutes avec la même importance.
Clic 1 : il donne à chacune un poids. Information très importante → poids fort ; influence faible → poids faible.
Clic 2 : il additionne tout : 2,0.
Clic 3 : et à la fin il tranche. 2,0 dépasse le seuil de 1,2 → il répond 1, oui. Sinon, ce serait 0, non.`,
  `La même chose en notation : y = f(Σ wᵢxᵢ + b).
Le biais b joue le rôle du seuil (b = − seuil).
Préciser : dans le perceptron de 1957, f est une simple marche (0 ou 1) ; la courbe en S dessinée sur ce schéma est la version moderne.`,
  `Et c'est là qu'arrive l'idée géniale : et si les poids eux-mêmes changeaient pendant l'apprentissage ?
On part de poids quelconques.
Clic 1 : exemple 1, un grand T. Le modèle répond 0 : erreur. On augmente les poids des entrées actives.
Clic 2 : exemple 2, un grand rond clair. Il répond 1 : encore une erreur. On baisse les poids actifs.
Clic 3 : exemple 3, un petit T : cette fois, c'est juste.
Le modèle s'est corrigé à partir de ses erreurs — et on retombe exactement sur les poids de tout à l'heure.`,
  `Remarquez quelque chose de très important : c'est le même principe que la descente de gradient, dont on a parlé dans le dossier précédent.
Clic 1 : mais le Perceptron est bien plus ancien et plus simple, et il n'utilise pas la descente de gradient au sens moderne qu'on utilise pour entraîner les réseaux de neurones.
Clic 2 : l'idée commune…`,
  `« L'erreur n'est pas la fin du processus… »
Clic : « … c'est l'information qu'on utilise pour corriger le modèle. »
Laisser un temps de silence.`,
  `En 1957, Rosenblatt commence à travailler sur une version concrète du Perceptron au Cornell Aeronautical Laboratory.
Le Mark I Perceptron est présenté comme une machine capable d'apprendre à partir d'exemples : une « rétine » de 400 cellules photoélectriques, des poids réglés par de petits moteurs.
La presse s'enthousiasme — New York Times, juillet 1958. Et on commence à imaginer l'avenir :
Clic 1 : des machines qui voient. Clic 2 : qui entendent. Clic 3 : qui apprennent.`,
  `Mais… il y avait un très gros problème.
Le Perceptron peut apprendre des motifs simples, surtout quand on peut séparer les catégories par une ligne droite. Ce n'est pas un hasard : sa décision, c'est « somme pondérée ≥ seuil », donc la frontière est forcément une droite (un plan, en plus de dimensions).
Clic : mais certains problèmes ne se laissent pas couper ainsi.`,
  `Le plus célèbre est un exemple mathématique très simple : XOR.
0 XOR 0 → 0, 0 XOR 1 → 1, 1 XOR 0 → 1, 1 XOR 1 → 0.
Clic 1, 2, 3 : on essaie une droite, puis une autre, puis une autre… il reste toujours un point du mauvais côté.
Impossible : une seule droite ne sépare jamais les réponses 1 des réponses 0.`,
  `Et là, il s'est passé quelque chose d'important dans l'histoire de l'IA.
Une critique forte apparaît — notamment le livre Perceptrons de Minsky et Papert, en 1969 — et il devient clair qu'un modèle à une seule couche a de vraies limites.
Clic 1 : pendant un moment, le rêve d'une machine qui apprend semble trop grand pour les moyens de l'époque.
Clic 2 : le dossier est mis en suspens. (La courbe est indicative, ce n'est pas une mesure.)`,
  `Mais les chercheurs ne s'arrêtent pas. Si une cellule ne suffit pas… et si on en utilisait plusieurs ?
Clic 1 : une première cellule trace une droite (OU).
Clic 2 : une deuxième en trace une autre (NON-ET).
Clic 3 : une troisième combine les deux (ET) : on obtient exactement XOR.
Reste à savoir comment entraîner ces couches : ce sera toute la suite de l'histoire.`,
  `Et là commence une histoire complètement nouvelle.
Un Perceptron… plusieurs Perceptrons… des couches… des réseaux de neurones… la rétropropagation… le deep learning… et, au bout du chemin, les systèmes qu'on utilise aujourd'hui.`,
  `Ce qui est étonnant, c'est que le Perceptron était très simple comparé à ce qu'on a aujourd'hui. Mais son idée de base était révolutionnaire :
au lieu d'écrire toutes les règles pour la machine…
Clic 1 : … laissez-la apprendre les règles à partir des exemples.
Clic 2 : c'est là que commence le vrai chemin vers le machine learning.`,
  `Mais la question suivante devient plus redoutable.
Si on a un réseau de centaines ou de milliers de cellules, et qu'il se trompe…
Clic 1 : comment savoir quelle cellule, et quel poids, il faut corriger ?
Clic 2 : c'est là que commence l'une des histoires les plus importantes de l'IA : la rétropropagation. Ce sera le prochain dossier. Liens vers le sommaire et vers le dossier 2. Merci !`,
];

export default [
  Cover,
  Dream,
  Computer,
  Idea,
  Neuron,
  Tiny,
  Inputs,
  Weigh,
  Plate,
  Learn,
  Gradient,
  Lesson,
  MarkI,
  Line,
  Xor,
  Doubt,
  Many,
  Chain,
  Revolution,
  Next,
] satisfies Page[];
