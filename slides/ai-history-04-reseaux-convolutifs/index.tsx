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
import portrait from '@assets/Houssem.jpg';
import imgLeCun from '@assets/ai-history/lecun.jpg';
import imgMnist from '@assets/ai-history/mnist.png';

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
const FONT_LINK_ID = 'osd-webfont-ai-history-04-reseaux-convolutifs';
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
const has = (n: number) => `.d04-page:has([data-osd-step="revealed"] > .d04-k${n})`;

CSS.push(`
@keyframes d04-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes d04-fade{from{opacity:0}to{opacity:1}}
@keyframes d04-type{from{opacity:0}to{opacity:1}}
@keyframes d04-draw{from{stroke-dashoffset:1.01}to{stroke-dashoffset:0}}
@keyframes d04-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes d04-pop{0%{opacity:0;transform:scale(.3)}60%{opacity:1;transform:scale(1.15)}100%{opacity:1;transform:scale(1)}}
@keyframes d04-stamp{0%{opacity:0;transform:rotate(var(--r,0deg)) scale(1.9)}35%{opacity:1}70%{transform:rotate(var(--r,0deg)) scale(.94)}100%{opacity:1;transform:rotate(var(--r,0deg)) scale(1)}}
@keyframes d04-blink{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes d04-spin{to{transform:rotate(360deg)}}
@keyframes d04-scan{0%{transform:translateY(0);opacity:0}8%{opacity:.75}92%{opacity:.75}100%{transform:translateY(var(--h,400px));opacity:0}}
@keyframes d04-back{to{stroke-dashoffset:36}}
.d04-stamp{transform:rotate(var(--r,0deg))}
.d04-in-draw{stroke-dasharray:1 2}
.d04-in-pop,.d04-pop{transform-box:fill-box;transform-origin:center}
.d04-in-grow{transform-origin:left center}
.d04-live .d04-in{animation:d04-rise 800ms ${EASE} var(--d,0ms) both}
.d04-live .d04-in-fade{animation:d04-fade 900ms ${EASE} var(--d,0ms) both}
.d04-live .d04-in-draw{animation:d04-draw 1300ms ${EASE} var(--d,0ms) both}
.d04-live .d04-in-grow{animation:d04-grow 600ms ${EASE} var(--d,0ms) both}
.d04-live .d04-in-pop{animation:d04-pop 520ms ${EASE} var(--d,0ms) both}
.d04-live .d04-in-st{animation:d04-stamp 480ms ${EASE_OUT} var(--d,0ms) both}
.d04-live .d04-ty0 .d04-c{animation:d04-type 40ms linear var(--d,0ms) both}
.d04-live .d04-lamp{animation:d04-blink var(--t,1.4s) steps(1,end) var(--d,0ms) infinite}
.d04-reel{transform-box:fill-box;transform-origin:center}
.d04-live .d04-reel{animation:d04-spin var(--t,8s) linear infinite}
.d04-scan{opacity:0}
.d04-live .d04-scan{animation:d04-scan 3.4s ease-in-out var(--d,0ms) infinite}
.d04-live .d04-back{animation:d04-back 900ms linear infinite}
@media (prefers-reduced-motion: reduce){.d04-page *{animation:none !important;transition:none !important}}
`);

// Beat utilities — visible from beat n: on (rise) / fade / typed text / stamp
// (thunk) / grow; hidden from beat n: off; stroke drawn at beat n: draw (path
// needs pathLength={1}); faded back at beat n: dim.
for (let n = 1; n <= 6; n++) {
  const at = has(n);
  CSS.push(`
.d04-on${n}{opacity:0;transform:translateY(14px);transition:opacity 500ms ${EASE} var(--d,0ms),transform 700ms ${EASE} var(--d,0ms)}
${at} .d04-on${n}{opacity:1;transform:none}
.d04-fade${n}{opacity:0;transition:opacity 550ms ${EASE} var(--d,0ms)}
${at} .d04-fade${n}{opacity:1}
.d04-ty${n} .d04-c{opacity:0}
${at} .d04-ty${n} .d04-c{opacity:1;transition:opacity 40ms linear var(--d,0ms)}
.d04-st${n}{opacity:0;transform:rotate(var(--r,0deg)) scale(1.9);transition:opacity 120ms linear var(--d,0ms),transform 440ms ${THUNK} var(--d,0ms)}
${at} .d04-st${n}{opacity:1;transform:rotate(var(--r,0deg)) scale(1)}
.d04-grow${n}{transform:scaleX(0);transform-origin:left center;transition:transform 600ms ${EASE} var(--d,0ms)}
${at} .d04-grow${n}{transform:scaleX(1)}
.d04-off${n}{transition:opacity 380ms ${EASE}}
${at} .d04-off${n}{opacity:0}
.d04-draw${n}{stroke-dasharray:1 2;stroke-dashoffset:1.01;transition:stroke-dashoffset 1000ms ${EASE} var(--d,0ms)}
${at} .d04-draw${n}{stroke-dashoffset:0}
.d04-dim${n}{transition:opacity 500ms ${EASE}}
${at} .d04-dim${n}{opacity:.22}
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
          <i className={`d04-k${i + 1}`} />
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
    className={`d04-stamp ${beat ? `d04-st${beat}` : 'd04-in-st'}`}
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
      {` · Dossier nº ${pad2(DOSSIER.n)} — ${DOSSIER.short}`}
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
      <span style={{ fontStyle: 'italic' }}>{DOSSIER.footer}</span>
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
    <span className={`d04-ty${beat}`}>
      {Array.from(text).map((ch, k) =>
        ch === '\n' ? (
          <br key={k} />
        ) : (
          <span key={k} className="d04-c" style={vars({ d: `${d + i++ * step}ms` })}>
            {ch}
          </span>
        ),
      )}
    </span>
  );
};

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div
    className="d04-in-fade"
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
      className={`d04-page d04-${id}${live ? ' d04-live' : ''}`}
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
  className = 'd04-in-fade',
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
        className={beat ? `d04-draw${beat}` : 'd04-in-draw'}
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

// ─── This dossier ───────────────────────────────────────────────────────────
const DOSSIER = {
  "id": "ai-history-04-reseaux-convolutifs",
  "n": 4,
  "short": "Les réseaux convolutifs",
  "footer": "Les réseaux convolutifs — apprendre à voir",
  "title": "Apprendre à voir",
  "subtitle": "Les réseaux convolutifs",
  "lede": "1989 : aux laboratoires Bell, un réseau apprend à lire les chiffres écrits à la main.",
  "year": "1989",
  "card": "LENET 1989",
  "metaTitle": "Apprendre à voir : les réseaux convolutifs",
  "next": {
    "n": 5,
    "title": "Deep Blue bat Kasparov",
    "id": "ai-history-05-deep-blue"
  }
} as {
  id: string;
  n: number;
  short: string;
  footer: string;
  title: string;
  subtitle: string;
  lede: string;
  year: string;
  card: string;
  next: { n: number; title: string; id: string } | null;
};

// ═══ Couverture ══════════════════════════════════════════════════════════════
// IBM-style punch card: the top edge prints the text, the holes encode it in
// Hollerith code (rows 12, 11, then digits 0–9).
const hollerith = (ch: string): number[] => {
  const zone = (s: string, z: number, from: number) => (s.includes(ch) ? [z, s.indexOf(ch) + from] : null);
  if (ch >= '0' && ch <= '9') return [Number(ch) + 2];
  return zone('ABCDEFGHI', 0, 3) ?? zone('JKLMNOPQR', 1, 3) ?? zone('STUVWXYZ', 2, 4) ?? [];
};
const PC = { w: 900, h: 330, cols: 40, colW: 20, x0: 50, y0: 64, rowH: 21 };
const pcX = (c: number) => PC.x0 + c * PC.colW + PC.colW / 2;
const pcY = (r: number) => PC.y0 + r * PC.rowH + PC.rowH / 2;
const PC_HOLES: [number, number][] = Array.from(DOSSIER.card).flatMap((ch, i) =>
  hollerith(ch).map((r): [number, number] => [i + 2, r]),
);
const PC_PUNCHED = new Set(PC_HOLES.map(([c, r]) => `${c}:${r}`));

const PunchCard = () => (
  <svg width={PC.w} height={PC.h} style={{ display: 'block', overflow: 'visible', filter: 'drop-shadow(0 14px 16px rgba(70, 45, 10, 0.28))' }}>
    <path d={`M 30 0 H ${PC.w} V ${PC.h} H 0 V 30 Z`} fill={ink.card} stroke="rgba(120, 90, 50, 0.4)" strokeWidth={1.5} />
    {Array.from(DOSSIER.card).map((ch, i) => (
      <text key={i} x={pcX(i + 2)} y={42} textAnchor="middle" style={{ fontFamily: mono, fontSize: 20, fontWeight: 700 }} fill={ink.text}>
        {ch}
      </text>
    ))}
    <text x={PC.w - 30} y={42} textAnchor="end" style={{ fontFamily: mono, fontSize: 15, letterSpacing: '0.12em' }} fill={ink.print}>
      CARTE DE DONNÉES · DOSSIER Nº {pad2(DOSSIER.n)}
    </text>
    {Array.from({ length: PC.cols }, (_, c) =>
      Array.from({ length: 10 }, (_, k) =>
        PC_PUNCHED.has(`${c}:${k + 2}`) ? null : (
          <text key={`${c}-${k}`} x={pcX(c)} y={pcY(k + 2) + 4.5} textAnchor="middle" style={{ fontFamily: mono, fontSize: 12.5 }} fill={ink.print}>
            {k}
          </text>
        ),
      ),
    )}
    {PC_HOLES.map(([c, r], i) => (
      <rect key={i} x={pcX(c) - 4.5} y={pcY(r) - 7.5} width={9} height={15} rx={1.5} fill={ink.hole} className="d04-in-pop" style={vars({ d: `${2900 + c * 80}ms` })} />
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
  <div className="d04-in-fade" style={{ ...vars({ d: '3300ms' }), position: 'absolute', left: 1190, top: 668, width: 590, height: 262 }}>
    <div style={{ position: 'relative', width: '100%', height: '100%', background: ink.sheet, boxShadow: SHADOW, transform: 'rotate(1.4deg)' }}>
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
          border: '6px solid #fffaf0',
          boxShadow: '0 4px 10px -4px rgba(60, 40, 10, 0.5)',
          filter: 'grayscale(1) sepia(0.5) contrast(1.05)',
        }}
      />
      <PaperClip x={48} y={4} />
      <div style={{ position: 'absolute', left: 224, top: 30, right: 24 }}>
        <Label>Conçu par</Label>
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `2px solid ${MARGIN}`, fontFamily: typewriter, fontSize: 36, lineHeight: 1.15, textShadow: BLEED }}>
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
      className="d04-in-fade"
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
      Archives de l'IA — Dossier nº {pad2(DOSSIER.n)}
    </div>
    <h1
      style={{
        position: 'absolute',
        left: L - 6,
        top: 196,
        margin: 0,
        fontFamily: typewriter,
        fontWeight: 400,
        fontSize: 128,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        textShadow: BLEED,
      }}
    >
      <Typed text={DOSSIER.title} d={250} step={70} />
    </h1>
    <Stamp pos={{ left: 1400, top: 168 }} rot={-10} size={110} d={1300}>
      {DOSSIER.year}
    </Stamp>
    <div style={{ position: 'absolute', left: L, top: 380, fontFamily: typewriter, fontSize: 54, lineHeight: 1.1, color: ink.soft, textShadow: BLEED }}>
      <Typed text={DOSSIER.subtitle} d={1550} step={30} />
    </div>
    <p
      className="d04-in"
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
      {DOSSIER.lede}
    </p>
    <CoffeeRing />
    <div className="d04-in" style={{ ...vars({ d: '2700ms' }), position: 'absolute', left: L, top: 636 }}>
      <div style={{ transform: 'rotate(-1.5deg)' }}>
        <PunchCard />
      </div>
    </div>
    <AuthorCard />
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
      <Label c={ink.red}>
        {kicker}
      </Label>
      <div style={{ marginTop: 6, fontFamily: typewriter, fontSize: 30, lineHeight: 1.15, textShadow: BLEED }}>{children}</div>
    </div>
  </a>
);

// "← Sommaire général" + "Dossier suivant →", for the last page.
const SeriesNav = ({ left, top, d = 0 }: { left: number; top: number; d?: number }) => (
  <div className="d04-in" style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left, top, display: 'flex', gap: 28 }}>
    <NavCard id="ai-history-sommaire" kicker="← Sommaire général">
      Les 11 dossiers
    </NavCard>
    {DOSSIER.next ? (
      <NavCard id={DOSSIER.next.id} kicker={`Dossier nº ${pad2(DOSSIER.next.n)} →`}>
        {DOSSIER.next.title}
      </NavCard>
    ) : null}
  </div>
);

// ─── Archive props shared by the dossiers ───────────────────────────────────
// A photo taped onto the page (real images from Wikimedia Commons; credited on
// the last page). beat = 0 shows it on entry (after `d` ms), beat = n on click n.
const Photo = ({
  src,
  caption,
  x,
  y,
  w = 150,
  h = 190,
  rot = 0,
  zoom = 1,
  origin = '50% 50%',
  fit = 'cover',
  tone = true,
  beat = 0,
  d = 0,
}: {
  src: string;
  caption: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  rot?: number;
  zoom?: number;
  origin?: string;
  fit?: 'cover' | 'contain';
  tone?: boolean;
  beat?: number;
  d?: number;
}) => (
  <div className={beat ? `d04-on${beat}` : 'd04-in'} style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: x, top: y, width: w + 16 }}>
    <div style={{ position: 'relative', transform: `rotate(${rot}deg)` }}>
      <div style={{ padding: 8, background: '#fffaf0', boxShadow: '0 12px 20px -12px rgba(60, 40, 10, 0.6)' }}>
        <div style={{ width: w, height: h, overflow: 'hidden', background: fit === 'contain' ? '#fffaf0' : '#d8cdb5' }}>
          <img
            src={src}
            alt={caption}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: fit,
              transform: zoom === 1 ? undefined : `scale(${zoom})`,
              transformOrigin: origin,
              filter: tone ? 'grayscale(1) sepia(0.35) contrast(1.05)' : 'sepia(0.2)',
            }}
          />
        </div>
      </div>
      <div style={{ marginTop: 6, textAlign: 'center', fontFamily: hand, fontWeight: 600, fontSize: 26, lineHeight: 1.05, color: ink.blue }}>{caption}</div>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '50%',
          top: -12,
          width: 70,
          height: 24,
          marginLeft: -35,
          background: 'rgba(238, 228, 198, 0.8)',
          boxShadow: '0 1px 3px rgba(80, 60, 20, 0.2)',
          transform: 'rotate(-4deg)',
        }}
      />
    </div>
  </div>
);

// Index card from the archive drawer, with typed lines.
const FicheLine = ({ label, value, d, w = 150 }: { label: string; value: string; d: number; w?: number }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', height: 46 }}>
    <span style={{ width: w, flex: 'none', fontWeight: 700, fontSize: 19, letterSpacing: '0.12em', color: ink.muted }}>{label}</span>
    <span style={{ fontSize: 25, color: ink.text }}>
      <Typed text={value} d={d} step={20} />
    </span>
  </div>
);

const Fiche = ({
  code,
  x,
  y,
  w,
  h,
  rot = -1,
  beat = 0,
  d = 0,
  children,
}: {
  code: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: number;
  beat?: number;
  d?: number;
  children: ReactNode;
}) => (
  <div className={beat ? `d04-on${beat}` : 'd04-in'} style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: x, top: y, width: w, height: h }}>
    <div style={{ width: '100%', height: '100%', padding: '20px 28px', boxSizing: 'border-box', transform: `rotate(${rot}deg)`, ...ruled(78, 46) }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', height: 52 }}>
        <span style={{ fontFamily: typewriter, fontSize: 28, color: ink.red }}>{code}</span>
        <Label>Archives</Label>
      </div>
      <div style={{ marginTop: 6 }}>{children}</div>
    </div>
  </div>
);

// Small print for image credits (Wikimedia Commons licenses require it).
const Credits = ({ children, top = 1000 }: { children: ReactNode; top?: number }) => (
  <div className="d04-in-fade" style={{ ...vars({ d: '1500ms' }), position: 'absolute', left: L, right: RIGHT, top, fontSize: 15, lineHeight: 1.35, color: ink.muted }}>
    {children}
  </div>
);

// ─── A handwritten "7" (10 × 10) and the maths run on it ─────────────────────
const SEVEN = [
  '..........',
  '.########.',
  '.########.',
  '......##..',
  '.....##...',
  '....##....',
  '....##....',
  '...##.....',
  '...##.....',
  '..........',
];
const toGrid = (rows: string[]) => rows.map((r) => Array.from(r).map((c) => (c === '#' ? 1 : 0)));
const IMG = toGrid(SEVEN);
const shift = (g: number[][], dx: number, dy: number) =>
  g.map((row, r) => row.map((_, c) => (g[r - dy]?.[c - dx] ?? 0)));
const IMG_SHIFTED = shift(IMG, 2, 1);
const COMMON = IMG.flat().filter((v, i) => v && IMG_SHIFTED.flat()[i]).length;
const LIT = IMG.flat().filter(Boolean).length;

type Kernel = number[][];
const K_VERT: Kernel = [
  [-1, 0, 1],
  [-1, 0, 1],
  [-1, 0, 1],
];
const K_HORIZ: Kernel = [
  [-1, -1, -1],
  [0, 0, 0],
  [1, 1, 1],
];
const K_DIAG: Kernel = [
  [0, 1, 1],
  [-1, 0, 1],
  [-1, -1, 0],
];
const conv = (g: number[][], k: Kernel) =>
  Array.from({ length: g.length - 2 }, (_, r) =>
    Array.from({ length: g[0].length - 2 }, (_, c) => {
      let s = 0;
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) s += g[r + i][c + j] * k[i][j];
      return s;
    }),
  );

// Pixel grid drawn in SVG. `mode` "bin" for an image, "map" for a feature map (±).
const Pixels = ({ g, cell, mode = 'bin', x = 0, y = 0, className, style }: { g: number[][]; cell: number; mode?: 'bin' | 'map'; x?: number; y?: number; className?: string; style?: CSSProperties }) => {
  const max = Math.max(1, ...g.flat().map(Math.abs));
  return (
    <g transform={`translate(${x} ${y})`} className={className} style={style}>
      <rect x={0} y={0} width={g[0].length * cell} height={g.length * cell} fill={ink.sheet} stroke={ink.soft} strokeWidth={2} />
      {g.map((row, r) =>
        row.map((v, c) => {
          if (!v) return null;
          const fill =
            mode === 'bin' ? ink.pixel : v > 0 ? `rgba(176, 53, 42, ${(0.18 + (0.82 * v) / max).toFixed(2)})` : `rgba(43, 74, 122, ${(0.18 + (0.82 * -v) / max).toFixed(2)})`;
          return <rect key={`${r}-${c}`} x={c * cell + 1} y={r * cell + 1} width={cell - 2} height={cell - 2} fill={fill} />;
        }),
      )}
      {Array.from({ length: g[0].length + 1 }, (_, i) => (
        <line key={`v${i}`} x1={i * cell} y1={0} x2={i * cell} y2={g.length * cell} stroke={ink.grid} strokeWidth={1} />
      ))}
      {Array.from({ length: g.length + 1 }, (_, i) => (
        <line key={`h${i}`} x1={0} y1={i * cell} x2={g[0].length * cell} y2={i * cell} stroke={ink.grid} strokeWidth={1} />
      ))}
    </g>
  );
};

const KernelBox = ({ k, cell = 54, x, y, title }: { k: Kernel; cell?: number; x: number; y: number; title?: string }) => (
  <g transform={`translate(${x} ${y})`}>
    {title ? (
      <text x={0} y={-14} style={{ fontFamily: mono, fontSize: 21, fontWeight: 700, letterSpacing: '0.1em' }} fill={ink.muted}>
        {title}
      </text>
    ) : null}
    {k.map((row, r) =>
      row.map((v, c) => (
        <g key={`${r}-${c}`}>
          <rect
            x={c * cell}
            y={r * cell}
            width={cell}
            height={cell}
            fill={v > 0 ? ink.redSoft : v < 0 ? ink.blueSoft : ink.sheet}
            stroke={ink.text}
            strokeWidth={2}
          />
          <text x={c * cell + cell / 2} y={r * cell + cell / 2 + 9} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: 26 }} fill={v > 0 ? ink.red : v < 0 ? ink.blue : ink.muted}>
            {v > 0 ? `+${v}` : v < 0 ? `−${-v}` : '0'}
          </text>
        </g>
      )),
    )}
  </g>
);

// Raster scan: the window steps across 8 columns, then down 8 rows, forever.
CSS.push(`
@keyframes d04-scanx{from{transform:translateX(0)}to{transform:translateX(var(--span))}}
@keyframes d04-scany{from{transform:translateY(0)}to{transform:translateY(var(--span))}}
.d04-live .d04-sx{animation:d04-scanx 1.2s steps(8,jump-none) infinite}
.d04-live .d04-sy{animation:d04-scany 9.6s steps(8,jump-none) infinite}
`);

const Scanner = ({ x, y, cell, size, c }: { x: number; y: number; cell: number; size: number; c: string }) => (
  <div className="d04-sy" style={{ ...vars({ span: `${cell * 7}px` }), position: 'absolute', left: x, top: y, width: 0, height: 0 }}>
    <div className="d04-sx" style={{ ...vars({ span: `${cell * 7}px` }), position: 'absolute', left: 0, top: 0 }}>
      <div style={{ width: size, height: size, boxSizing: 'border-box', border: `4px solid ${c}`, background: 'rgba(176, 53, 42, 0.08)' }} />
    </div>
  </div>
);

// ═══ 2 · Le problème ════════════════════════════════════════════════════════
const Shifted: Page = () => (
  <Frame id="shifted" era="1989" eyebrow="Le problème" title="Le même 7… ou presque" beats={2}>
    <svg width={1000} height={520} style={{ position: 'absolute', left: L, top: 330, overflow: 'visible' }}>
      <Pixels g={IMG} cell={42} />
      <text x={210} y={470} textAnchor="middle" style={{ fontFamily: hand, fontWeight: 600, fontSize: 32 }} fill={ink.blue}>
        un 7
      </text>
      <Pixels g={IMG_SHIFTED} cell={42} x={520} />
      <text x={730} y={470} textAnchor="middle" style={{ fontFamily: hand, fontWeight: 600, fontSize: 32 }} fill={ink.blue}>
        le même, décalé de 2 pixels
      </text>
      <g className="d04-fade1">
        {IMG.map((row, r) =>
          row.map((v, c) =>
            v && IMG_SHIFTED[r][c] ? <rect key={`${r}-${c}`} x={520 + c * 42 + 4} y={r * 42 + 4} width={34} height={34} fill="none" stroke={ink.red} strokeWidth={4} /> : null,
          ),
        )}
      </g>
    </svg>
    <div className="d04-on1" style={{ position: 'absolute', left: 1250, top: 340, width: 530 }}>
      <div style={{ fontFamily: typewriter, fontSize: 64, color: ink.red, textShadow: BLEED }}>
        {COMMON} / {LIT}
      </div>
      <div style={{ marginTop: 10, fontSize: 27, lineHeight: 1.45 }}>pixels allumés en commun, encadrés en rouge.</div>
    </div>
    <div className="d04-on2" style={{ position: 'absolute', left: 1250, top: 560, width: 530, fontSize: 27, lineHeight: 1.5 }}>
      Pour un réseau classique, chaque pixel est une entrée séparée : il faudrait réapprendre le 7 à chaque position.
    </div>
    <Hand x={1252} y={800} w={520} rot={-2} size={32} d={600}>
      Pourtant, nous, on voit tout de suite que c'est un 7.
    </Hand>
  </Frame>
);

// ═══ 3 · L'inspiration ══════════════════════════════════════════════════════
const Receptive = ({ x, beat, angle, fires, label }: { x: number; beat: number; angle: number; fires: boolean; label: string }) => (
  <div className={beat ? `d04-on${beat}` : 'd04-in'} style={{ ...vars({ d: beat ? '0ms' : '500ms' }), position: 'absolute', left: x, top: 330, width: 330, textAlign: 'center' }}>
    <svg width={330} height={290} style={{ display: 'block', overflow: 'visible' }}>
      <circle cx={120} cy={130} r={100} fill="#2d2822" />
      <rect x={110} y={50} width={20} height={160} fill="#f5e7b8" transform={`rotate(${angle} 120 130)`} />
      <line x1={220} y1={130} x2={262} y2={130} stroke={ink.soft} strokeWidth={3} />
      <polygon points={head(274, 130, 0, 13)} fill={ink.soft} />
      <path d={fires ? 'M 280 220 V 50 M 296 220 V 50 M 312 220 V 50' : 'M 280 220 V 200'} stroke={fires ? ink.red : ink.muted} strokeWidth={5} strokeLinecap="round" />
    </svg>
    <div style={{ marginTop: 6, fontSize: 25, color: fires ? ink.red : ink.muted, fontWeight: 700 }}>{label}</div>
  </div>
);

const Inspiration: Page = () => (
  <Frame id="cat" era="1959" eyebrow="L'inspiration : le cortex visuel" title="Des neurones qui guettent des bords" beats={2}>
    <Receptive x={170} beat={0} angle={0} fires label="barre verticale : il s'active" />
    <Receptive x={540} beat={1} angle={45} fires={false} label="barre oblique : silence" />
    <Receptive x={910} beat={2} angle={90} fires={false} label="barre horizontale : silence" />
    <div className="d04-in" style={{ ...vars({ d: '700ms' }), position: 'absolute', left: 1320, top: 340, width: 460, fontSize: 26, lineHeight: 1.5, color: ink.soft }}>
      <b style={{ color: ink.text }}>1959–1962</b> : Hubel et Wiesel montrent que, chez le chat, certains neurones du cortex visuel ne réagissent qu'à un bord d'une orientation précise, dans une petite zone du champ visuel. Prix Nobel en 1981.
    </div>
    <div className="d04-on2" style={{ ...vars({ d: '400ms' }), position: 'absolute', left: L, top: 760, width: CW, padding: '20px 28px', boxSizing: 'border-box', background: ink.sheet, boxShadow: SHADOW, borderLeft: `6px solid ${ink.blue}` }}>
      <Label c={ink.blue}>1980 · Kunihiko Fukushima</Label>
      <div style={{ marginTop: 8, fontSize: 26, lineHeight: 1.45 }}>
        Le <b>néocognitron</b> empile des couches de ce type : des détecteurs de traits simples, puis de formes plus complexes.
      </div>
    </div>
  </Frame>
);

// ═══ 4 · Le filtre qui glisse ═══════════════════════════════════════════════
const MAP_V = conv(IMG, K_VERT);

const Filter: Page = () => (
  <Frame id="filter" era="1989" eyebrow="L'idée nº 1 : la convolution" title="Un petit filtre qui glisse sur l'image" beats={2}>
    <svg width={1610} height={560} style={{ position: 'absolute', left: L, top: 340, overflow: 'visible' }}>
      <Pixels g={IMG} cell={42} />
      <text x={0} y={-16} style={{ fontFamily: mono, fontSize: 21, fontWeight: 700, letterSpacing: '0.1em' }} fill={ink.muted}>
        IMAGE 10 × 10
      </text>
      <KernelBox k={K_VERT} x={540} y={110} title="FILTRE 3 × 3" />
      <text x={621} y={330} textAnchor="middle" style={{ fontFamily: hand, fontWeight: 600, fontSize: 30 }} fill={ink.blue}>
        « bord vertical »
      </text>
      <g className="d04-fade1">
        <Pixels g={MAP_V} cell={42} mode="map" x={830} />
        <text x={830} y={-16} style={{ fontFamily: mono, fontSize: 21, fontWeight: 700, letterSpacing: '0.1em' }} fill={ink.muted}>
          CARTE DE CARACTÉRISTIQUES 8 × 8
        </text>
        <text x={1000} y={400} textAnchor="middle" style={{ fontFamily: hand, fontWeight: 600, fontSize: 30 }} fill={ink.red}>
          rouge : bord gauche · bleu : bord droit
        </text>
      </g>
    </svg>
    <Scanner x={L} y={340} cell={42} size={126} c={ink.red} />
    <div className="d04-fade1">
      <Scanner x={L + 830} y={340} cell={42} size={42} c={ink.blue} />
    </div>
    <div style={{ position: 'absolute', left: L, top: 820, width: CW, fontSize: 28, lineHeight: 1.45 }}>
      <div className="d04-in" style={vars({ d: '700ms' })}>
        À chaque position : on multiplie les 9 pixels par les 9 nombres du filtre, et on additionne.
      </div>
      <div className="d04-on2" style={{ marginTop: 12, fontFamily: typewriter, fontSize: 36, color: 'var(--osd-accent)' }}>
        Le résultat : une carte de « où sont les bords verticaux ».
      </div>
    </div>
  </Frame>
);

// ═══ 5 · Partager les poids ═════════════════════════════════════════════════
const Weights = ({ beat, label, n, w, c }: { beat: number; label: string; n: string; w: number; c: string }) => (
  <div className={beat ? `d04-on${beat}` : 'd04-in'} style={{ ...vars({ d: beat ? '0ms' : '500ms' }), marginBottom: 40 }}>
    <div style={{ fontSize: 27 }}>{label}</div>
    <div style={{ marginTop: 4, fontFamily: typewriter, fontSize: 42, color: c }}>{n}</div>
    <div style={{ marginTop: 10, height: 36, background: ink.sheet, border: `1.5px solid ${ink.rule}` }}>
      <div className={beat ? `d04-grow${beat}` : 'd04-in-grow'} style={{ ...vars({ d: '300ms' }), width: w, height: '100%', background: c }} />
    </div>
  </div>
);

const Sharing: Page = () => (
  <Frame id="sharing" era="1989" eyebrow="L'idée nº 2 : le partage des poids" title="Le même filtre partout dans l'image" beats={2}>
    <div style={{ position: 'absolute', left: L, top: 340, width: 980 }}>
      <Weights beat={0} label="Couche classique : chaque pixel relié à chaque neurone" n="78 400 poids" w={980} c={ink.blue} />
      <Weights beat={1} label="Un filtre 5 × 5, réutilisé à toutes les positions" n="25 poids" w={8} c={ink.red} />
    </div>
    <div className="d04-in-fade" style={{ ...vars({ d: '900ms' }), position: 'absolute', left: L, top: 690, width: 980, fontSize: 22, color: ink.muted }}>
      Exemple : une image 28 × 28 (784 pixels) et 100 neurones.
    </div>
    <div className="d04-on2" style={{ position: 'absolute', left: 1250, top: 340, width: 530 }}>
      <div style={{ fontFamily: typewriter, fontSize: 40, lineHeight: 1.2, color: 'var(--osd-accent)', textShadow: BLEED }}>Deux bonus</div>
      <div style={{ marginTop: 18, fontSize: 27, lineHeight: 1.5 }}>– Beaucoup moins de poids à apprendre, donc moins d'exemples nécessaires.</div>
      <div style={{ marginTop: 14, fontSize: 27, lineHeight: 1.5 }}>– Un 7 décalé allume la même carte, simplement décalée.</div>
    </div>
  </Frame>
);

// ═══ 6 · Plusieurs filtres ══════════════════════════════════════════════════
const FilterCol = ({ x, beat, k, title }: { x: number; beat: number; k: Kernel; title: string }) => (
  <svg className={beat ? `d04-on${beat}` : 'd04-in'} width={420} height={560} style={{ ...vars({ d: beat ? '0ms' : '500ms' }), position: 'absolute', left: x, top: 330, overflow: 'visible' }}>
    <KernelBox k={k} cell={44} x={144} y={30} title={title} />
    <line x1={210} y1={180} x2={210} y2={220} stroke={ink.soft} strokeWidth={3} />
    <polygon points={head(210, 234, 90, 14)} fill={ink.soft} />
    <Pixels g={conv(IMG, k)} cell={38} mode="map" x={58} y={250} />
  </svg>
);

const Many: Page = () => (
  <Frame id="many" era="1989" eyebrow="Plusieurs filtres" title="Chaque filtre cherche un motif différent" beats={2}>
    <FilterCol x={170} beat={0} k={K_VERT} title="BORDS VERTICAUX" />
    <FilterCol x={630} beat={1} k={K_HORIZ} title="BORDS HORIZONTAUX" />
    <FilterCol x={1090} beat={2} k={K_DIAG} title="DIAGONALES" />
    <Hand x={1540} y={440} w={240} rot={-3} size={32} d={1200}>
      même 7, trois cartes différentes
    </Hand>
  </Frame>
);

// ═══ 7 · Résumer : le pooling ═══════════════════════════════════════════════
const POOL = [
  [1, 3, 0, 2],
  [5, 2, 1, 0],
  [0, 1, 4, 6],
  [2, 0, 3, 1],
];
const PC2 = 92;

const PoolCell = ({ r, c, v, hot }: { r: number; c: number; v: number; hot: boolean }) => {
  const q = Math.floor(r / 2) * 2 + Math.floor(c / 2) + 1;
  return (
    <g>
      <rect x={c * PC2} y={r * PC2} width={PC2} height={PC2} fill={ink.sheet} stroke={ink.text} strokeWidth={2} />
      {hot ? <rect x={c * PC2 + 6} y={r * PC2 + 6} width={PC2 - 12} height={PC2 - 12} fill={ink.redSoft} stroke={ink.red} strokeWidth={3} className={`d04-fade${q}`} /> : null}
      <text x={c * PC2 + PC2 / 2} y={r * PC2 + PC2 / 2 + 14} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: 40 }} fill={ink.text}>
        {v}
      </text>
    </g>
  );
};

const Pooling: Page = () => (
  <Frame id="pool" era="1989" eyebrow="L'idée nº 3 : le sous-échantillonnage" title="Garder l'essentiel, oublier la position exacte" beats={4}>
    <svg width={1000} height={420} style={{ position: 'absolute', left: L, top: 340, overflow: 'visible' }}>
      {POOL.map((row, r) =>
        row.map((v, c) => {
          const br = Math.floor(r / 2) * 2;
          const bc = Math.floor(c / 2) * 2;
          const m = Math.max(POOL[br][bc], POOL[br][bc + 1], POOL[br + 1][bc], POOL[br + 1][bc + 1]);
          return <PoolCell key={`${r}-${c}`} r={r} c={c} v={v} hot={v === m} />;
        }),
      )}
      <rect x={0} y={0} width={PC2 * 2} height={PC2 * 2} fill="none" stroke={ink.text} strokeWidth={5} />
      <rect x={PC2 * 2} y={0} width={PC2 * 2} height={PC2 * 2} fill="none" stroke={ink.text} strokeWidth={5} />
      <rect x={0} y={PC2 * 2} width={PC2 * 2} height={PC2 * 2} fill="none" stroke={ink.text} strokeWidth={5} />
      <rect x={PC2 * 2} y={PC2 * 2} width={PC2 * 2} height={PC2 * 2} fill="none" stroke={ink.text} strokeWidth={5} />
      <line x1={400} y1={184} x2={520} y2={184} stroke={ink.soft} strokeWidth={3} />
      <polygon points={head(536, 184, 0, 16)} fill={ink.soft} />
      <text x={468} y={160} textAnchor="middle" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
        max
      </text>
      <g transform="translate(560 92)">
        <rect x={0} y={0} width={PC2 * 2} height={PC2 * 2} fill={ink.sheet} stroke={ink.text} strokeWidth={3} />
        <line x1={PC2} y1={0} x2={PC2} y2={PC2 * 2} stroke={ink.text} strokeWidth={2} />
        <line x1={0} y1={PC2} x2={PC2 * 2} y2={PC2} stroke={ink.text} strokeWidth={2} />
        <text x={PC2 / 2} y={PC2 / 2 + 14} textAnchor="middle" className="d04-fade1" style={{ fontFamily: typewriter, fontSize: 40 }} fill={ink.red}>
          5
        </text>
        <text x={PC2 * 1.5} y={PC2 / 2 + 14} textAnchor="middle" className="d04-fade2" style={{ fontFamily: typewriter, fontSize: 40 }} fill={ink.red}>
          2
        </text>
        <text x={PC2 / 2} y={PC2 * 1.5 + 14} textAnchor="middle" className="d04-fade3" style={{ fontFamily: typewriter, fontSize: 40 }} fill={ink.red}>
          2
        </text>
        <text x={PC2 * 1.5} y={PC2 * 1.5 + 14} textAnchor="middle" className="d04-fade4" style={{ fontFamily: typewriter, fontSize: 40 }} fill={ink.red}>
          6
        </text>
      </g>
    </svg>
    <div className="d04-in" style={{ ...vars({ d: '600ms' }), position: 'absolute', left: 1120, top: 350, width: 660, fontSize: 28, lineHeight: 1.5 }}>
      On découpe la carte en carrés de 2 × 2 et on ne garde que la plus forte réponse de chaque carré.
    </div>
    <div className="d04-on4" style={{ ...vars({ d: '400ms' }), position: 'absolute', left: 1120, top: 560, width: 660 }}>
      <div style={{ fontFamily: typewriter, fontSize: 36, lineHeight: 1.25, color: 'var(--osd-accent)', textShadow: BLEED }}>4 fois moins de valeurs.</div>
      <div style={{ marginTop: 12, fontSize: 27, lineHeight: 1.5, color: ink.soft }}>Et si le motif bouge d'un pixel, le résultat change à peine.</div>
    </div>
  </Frame>
);

// ═══ 8 · Empiler : LeNet ════════════════════════════════════════════════════
const Stage = ({ x, w, h, beat, name, dims, what, stack = 1 }: { x: number; w: number; h: number; beat: number; name: string; dims: string; what: string; stack?: number }) => (
  <div className={beat ? `d04-on${beat}` : 'd04-in'} style={{ ...vars({ d: beat ? '0ms' : '500ms' }), position: 'absolute', left: x, top: 330, width: Math.max(w + stack * 10, 150) }}>
    <div style={{ position: 'relative', height: 300 }}>
      {Array.from({ length: stack }, (_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: i * 10,
            top: 150 - h / 2 - i * 10 + stack * 5,
            width: w,
            height: h,
            background: ink.sheet,
            border: `2px solid ${ink.text}`,
            boxShadow: '0 4px 8px -4px rgba(60, 40, 10, 0.4)',
          }}
        />
      ))}
    </div>
    <div style={{ fontFamily: typewriter, fontSize: 28, textShadow: BLEED }}>{name}</div>
    <div style={{ marginTop: 4, fontFamily: mono, fontSize: 20, color: ink.muted }}>{dims}</div>
    <div style={{ marginTop: 10, fontFamily: hand, fontWeight: 600, fontSize: 28, lineHeight: 1.1, color: ink.blue }}>{what}</div>
  </div>
);

const LeNet: Page = () => (
  <Frame id="lenet" era="1998" eyebrow="Tout empiler" title="LeNet-5 : des bords jusqu'au chiffre" beats={4}>
    <Stage x={170} w={150} h={150} beat={0} name="Image" dims="32 × 32" what="des pixels" />
    <Stage x={400} w={120} h={120} beat={1} name="Convolution" dims="6 cartes 28 × 28" what="des bords" stack={6} />
    <Stage x={640} w={60} h={60} beat={1} name="Pooling" dims="6 × 14 × 14" what="résumés" stack={6} />
    <Stage x={860} w={44} h={44} beat={2} name="Convolution" dims="16 cartes 10 × 10" what="traits, coins" stack={12} />
    <Stage x={1110} w={22} h={22} beat={2} name="Pooling" dims="16 × 5 × 5" what="formes" stack={12} />
    <Stage x={1330} w={22} h={220} beat={3} name="Couches finales" dims="120 → 84" what="combinaisons" />
    <Stage x={1580} w={22} h={150} beat={4} name="Sortie" dims="10 neurones" what="« c'est un 7 »" />
    <Hand x={L + 10} y={860} w={1500} rot={-0.8} size={30} d={1300}>
      Version publiée en 1998 par LeCun, Bottou, Bengio et Haffner. Celle de 1989 suivait déjà ce principe.
    </Hand>
  </Frame>
);

// ═══ 9 · Les filtres s'apprennent ═══════════════════════════════════════════
const NOISE: Kernel = [
  [0.3, -0.8, 0.5],
  [-0.2, 0.9, -0.6],
  [0.7, -0.1, -0.4],
];
const LEARNED: Kernel = [
  [-0.9, 0.1, 1.0],
  [-1.0, 0.0, 0.9],
  [-0.8, -0.1, 1.0],
];
const SoftKernel = ({ k, x, y, cell = 70 }: { k: Kernel; x: number; y: number; cell?: number }) => (
  <g transform={`translate(${x} ${y})`}>
    {k.map((row, r) =>
      row.map((v, c) => (
        <g key={`${r}-${c}`}>
          <rect x={c * cell} y={r * cell} width={cell} height={cell} fill={v > 0 ? `rgba(176, 53, 42, ${Math.abs(v).toFixed(2)})` : `rgba(43, 74, 122, ${Math.abs(v).toFixed(2)})`} stroke={ink.text} strokeWidth={2} />
          <text x={c * cell + cell / 2} y={r * cell + cell / 2 + 8} textAnchor="middle" style={{ fontFamily: mono, fontSize: 21, fontWeight: 700 }} fill={ink.sheet}>
            {v.toFixed(1).replace('.', ',').replace('-', '−')}
          </text>
        </g>
      )),
    )}
  </g>
);

const Learned: Page = () => (
  <Frame id="learned" era="1989" eyebrow="Le coup de génie" title="Les filtres s'apprennent tout seuls" beats={2}>
    <svg width={900} height={420} style={{ position: 'absolute', left: L, top: 340, overflow: 'visible' }}>
      <text x={0} y={-14} style={{ fontFamily: mono, fontSize: 21, fontWeight: 700, letterSpacing: '0.1em' }} fill={ink.muted}>
        AU DÉPART : AU HASARD
      </text>
      <SoftKernel k={NOISE} x={0} y={10} />
      <g className="d04-fade1">
        <line x1={250} y1={115} x2={430} y2={115} stroke={ink.red} strokeWidth={4} />
        <polygon points={head(446, 115, 0, 17)} fill={ink.red} />
        <text x={340} y={95} textAnchor="middle" style={{ fontFamily: hand, fontWeight: 600, fontSize: 30 }} fill={ink.red}>
          rétropropagation
        </text>
        <text x={470} y={-14} style={{ fontFamily: mono, fontSize: 21, fontWeight: 700, letterSpacing: '0.1em' }} fill={ink.muted}>
          APRÈS ENTRAÎNEMENT
        </text>
        <SoftKernel k={LEARNED} x={470} y={10} />
        <text x={575} y={270} textAnchor="middle" style={{ fontFamily: hand, fontWeight: 600, fontSize: 30 }} fill={ink.blue}>
          un détecteur de bord vertical
        </text>
      </g>
    </svg>
    <div className="d04-in" style={{ ...vars({ d: '600ms' }), position: 'absolute', left: 1110, top: 340, width: 670, fontSize: 27, lineHeight: 1.5 }}>
      Les nombres des filtres sont des poids comme les autres. La rétropropagation (dossier 2) les règle à partir des exemples.
    </div>
    <div className="d04-on2" style={{ position: 'absolute', left: 1110, top: 560, width: 670, padding: '22px 28px', boxSizing: 'border-box', background: ink.sheet, boxShadow: SHADOW, borderLeft: `6px solid ${ink.red}` }}>
      <Label c={ink.red}>Laboratoires Bell · 1989</Label>
      <div style={{ marginTop: 10, fontFamily: typewriter, fontSize: 28, lineHeight: 1.25, textShadow: BLEED }}>Backpropagation Applied to Handwritten Zip Code Recognition</div>
      <div style={{ marginTop: 10, fontSize: 23, lineHeight: 1.45, color: ink.soft }}>Yann LeCun et ses collègues lisent les codes postaux de lettres américaines.</div>
    </div>
    <Hand x={L + 10} y={800} w={900} rot={-1} size={30} d={1300}>
      exemple illustratif : valeurs arrondies
    </Hand>
  </Frame>
);

// ═══ 10 · En production ═════════════════════════════════════════════════════
const Production: Page = () => (
  <Frame id="prod" era="1990s" eyebrow="Dans la vraie vie" title="Des réseaux qui lisent les chèques" beats={2}>
    <div className="d04-in" style={{ ...vars({ d: '400ms' }), position: 'absolute', left: L, top: 330, width: 900, height: 330 }}>
      <div style={{ width: '100%', height: '100%', padding: '24px 34px', boxSizing: 'border-box', background: '#e9dfc4', boxShadow: SHADOW, transform: 'rotate(-1deg)', border: `2px solid ${ink.rule}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Label>Banque des Archives</Label>
          <span style={{ fontFamily: mono, fontSize: 22 }}>Nº 004217</span>
        </div>
        <div style={{ marginTop: 40, display: 'flex', alignItems: 'baseline', gap: 24 }}>
          <span style={{ fontSize: 24, color: ink.muted }}>Payez contre ce chèque</span>
          <span style={{ flex: 1, borderBottom: `2px solid ${ink.soft}` }} />
        </div>
        <div style={{ marginTop: 50, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ padding: '8px 24px', border: `3px solid ${ink.text}`, fontFamily: hand, fontWeight: 600, fontSize: 56, color: ink.blue }}>
            1 975,40 €
          </div>
        </div>
        <div className="d04-fade1" style={{ position: 'absolute', left: 40, top: 200, padding: '6px 14px', background: ink.redSoft, border: `3px solid ${ink.red}`, fontFamily: mono, fontSize: 24, fontWeight: 700, color: ink.red }}>
          lu : 1975,40
        </div>
      </div>
    </div>
    <div className="d04-on1" style={{ position: 'absolute', left: L, top: 710, width: 900, fontSize: 27, lineHeight: 1.5 }}>
      À la fin des années 1990, des systèmes fondés sur ces réseaux lisent plus de 10 % des chèques émis aux États-Unis.
    </div>
    <div className="d04-on2" style={{ position: 'absolute', left: 1150, top: 330, width: 630 }}>
      <Label c={ink.red}>1998 · la base MNIST</Label>
      <div style={{ marginTop: 10, fontSize: 26, lineHeight: 1.45 }}>70 000 chiffres manuscrits de 28 × 28 pixels. Le « Hello world » de l'apprentissage automatique pendant vingt ans.</div>
    </div>
    <Photo src={imgMnist} caption="Des chiffres de MNIST" x={1150} y={560} w={600} h={298} rot={1.5} beat={2} d={200} />
  </Frame>
);

// ═══ 11 · La traversée du désert ════════════════════════════════════════════
const Desert: Page = () => (
  <Frame id="desert" era="2000s" eyebrow="Une avance mise en pause" title="Pourquoi pas tout de suite partout ?" beats={3}>
    <div style={{ position: 'absolute', left: L, top: 340, width: 1000 }}>
      <div className="d04-in" style={{ ...vars({ d: '400ms' }), display: 'flex', gap: 24, marginBottom: 34 }}>
        <span style={{ fontFamily: typewriter, fontSize: 44, color: ink.red, width: 54, flex: 'none' }}>1</span>
        <span style={{ fontSize: 28, lineHeight: 1.45 }}>Des chiffres en noir et blanc, oui. Des photos en couleur de mille objets, il faut <b>beaucoup plus de données</b>.</span>
      </div>
      <div className="d04-on1" style={{ display: 'flex', gap: 24, marginBottom: 34 }}>
        <span style={{ fontFamily: typewriter, fontSize: 44, color: ink.red, width: 54, flex: 'none' }}>2</span>
        <span style={{ fontSize: 28, lineHeight: 1.45 }}>
          Et <b>beaucoup plus de calcul</b> : entraîner un grand réseau prend des semaines.
        </span>
      </div>
      <div className="d04-on2" style={{ display: 'flex', gap: 24 }}>
        <span style={{ fontFamily: typewriter, fontSize: 44, color: ink.red, width: 54, flex: 'none' }}>3</span>
        <span style={{ fontSize: 28, lineHeight: 1.45 }}>
          Pendant ce temps, d'autres méthodes (SVM, forêts aléatoires) font aussi bien, plus simplement.
        </span>
      </div>
    </div>
    <div className="d04-on3" style={{ position: 'absolute', left: 1250, top: 340, width: 530 }}>
      <div style={{ fontFamily: typewriter, fontSize: 40, lineHeight: 1.25, color: 'var(--osd-accent)', textShadow: BLEED }}>La revanche viendra en 2012.</div>
      <div style={{ marginTop: 16, fontSize: 27, lineHeight: 1.5, color: ink.soft }}>Avec des millions d'images et des cartes graphiques : dossier 6, AlexNet.</div>
    </div>
  </Frame>
);

// ═══ 12 · Aujourd'hui ═══════════════════════════════════════════════════════
const Today: Page = () => (
  <Frame id="today" era="Auj." eyebrow="Aujourd'hui" title="La vision artificielle partout" beats={1}>
    <ul style={{ position: 'absolute', left: L, top: 340, width: 900, margin: 0, padding: 0, listStyle: 'none', fontSize: 30, lineHeight: 1.45 }}>
      <li className="d04-in" style={{ ...vars({ d: '400ms' }), marginBottom: 26 }}>
        – Déverrouiller son téléphone avec son visage.
      </li>
      <li className="d04-in" style={{ ...vars({ d: '600ms' }), marginBottom: 26 }}>
        – Repérer piétons et panneaux dans une voiture.
      </li>
      <li className="d04-in" style={{ ...vars({ d: '800ms' }), marginBottom: 26 }}>
        – Aider à lire radios et images médicales.
      </li>
      <li className="d04-in" style={{ ...vars({ d: '1000ms' }), marginBottom: 26 }}>
        – Trier des photos, lire des documents.
      </li>
    </ul>
    <Photo src={imgLeCun} caption="Yann LeCun, 2024" x={1270} y={330} w={200} h={250} rot={2.5} zoom={1.1} origin="50% 28%" d={500} />
    <div className="d04-on1" style={{ position: 'absolute', left: 1180, top: 690, width: 600, fontSize: 26, lineHeight: 1.5 }}>
      <b>2018</b> : prix Turing pour Yann LeCun, Geoffrey Hinton et Yoshua Bengio, pour le deep learning.
    </div>
  </Frame>
);

// ═══ 13 · Ce qu'il faut retenir ═════════════════════════════════════════════
const Lesson: Page = () => (
  <Frame id="lesson" eyebrow="Ce qu'il faut retenir" beats={1}>
    <div className="d04-in-fade" style={{ position: 'absolute', left: L - 16, top: 170, fontFamily: typewriter, fontSize: 300, lineHeight: 1, color: ink.rule }}>
      «
    </div>
    <div style={{ position: 'absolute', left: L, top: 370, fontFamily: typewriter, fontSize: 70, lineHeight: 1.22, textShadow: BLEED }}>
      <Typed text="Un même petit filtre, partout." d={400} step={30} />
    </div>
    <div style={{ position: 'absolute', left: L, top: 480, fontFamily: typewriter, fontSize: 70, lineHeight: 1.22, textShadow: BLEED }}>
      <Typed text="Des bords, puis des formes, " beat={1} step={30} />
      <span style={{ color: 'var(--osd-accent)' }}>
        <Mark beat={1} d={1300}>
          <Typed text="puis des objets" beat={1} d={810} step={30} />
        </Mark>
      </span>
      <Typed text="." beat={1} d={1260} step={30} />
    </div>
    <SeriesNav left={L} top={700} d={800} />
    <Credits top={930}>
      Images via Wikimedia Commons : Yann LeCun, 2024, par Jérémy Barande (CC BY-SA 2.0) · exemples MNIST par Suvanjanprasai (CC BY-SA 4.0). Images
      recadrées et teintées.
    </Credits>
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

const STYLE_ID = 'osd-styles-ai-history-04-reseaux-convolutifs';
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
  title: "Apprendre à voir : les réseaux convolutifs",
  createdAt: '2026-10-08T01:02:10.458Z',
};

export const notes: (string | undefined)[] = [
  `Dossier 4 : comment une machine a appris à voir. Nous sommes en 1989, aux laboratoires Bell, juste après l'arrivée de la rétropropagation.
La carte perforée encode « LENET 1989 ».`,
  `Le problème : lire un chiffre manuscrit. Voici un 7, puis le même décalé de deux pixels.
Clic 1 : pixel par pixel, ils n'ont presque rien en commun.
Clic 2 : pour un réseau classique, chaque pixel est une entrée à part : il faudrait réapprendre le 7 à chaque position. Nous, on le reconnaît immédiatement.`,
  `L'inspiration vient du cerveau. Hubel et Wiesel, entre 1959 et 1962, chez le chat : certains neurones ne réagissent qu'à une barre d'une orientation précise.
Clic 1 et 2 : on tourne la barre, le neurone se tait.
En 1980, Fukushima empile ces détecteurs dans son néocognitron.`,
  `Première idée : la convolution. Un petit filtre de 3 × 3 nombres glisse sur l'image. À chaque position, on multiplie et on additionne.
Clic 1 : on obtient une carte. Ici le filtre cherche les bords verticaux : rouge pour un bord gauche, bleu pour un bord droit.
Clic 2 : la carte dit où se trouvent les bords verticaux du 7.`,
  `Deuxième idée : le même filtre sert partout.
Une couche classique sur une image de 28 × 28 avec 100 neurones : 78 400 poids.
Clic 1 : un filtre 5 × 5 : 25 poids, réutilisés à toutes les positions.
Clic 2 : moins de poids, donc moins d'exemples nécessaires ; et un 7 décalé donne la même carte, simplement décalée.`,
  `On utilise plusieurs filtres, chacun cherche un motif.
Bords verticaux. Clic 1 : bords horizontaux. Clic 2 : diagonales. Le même 7 donne trois cartes différentes.`,
  `Troisième idée : résumer. On découpe la carte en carrés de 2 × 2 et on garde la plus forte valeur.
Clics 1 à 4 : un carré à la fois. Quatre fois moins de valeurs, et un motif qui bouge d'un pixel change à peine le résultat.`,
  `On empile tout. Image. Clic 1 : convolution et résumé : des bords. Clic 2 : de nouveau : des traits, des coins, des formes. Clic 3 : des couches finales qui combinent. Clic 4 : dix neurones de sortie, un par chiffre.
C'est LeNet-5, publié en 1998 ; la version de 1989 suivait déjà ce principe.`,
  `Le coup de génie : personne ne dessine les filtres.
Au départ, des nombres au hasard. Clic 1 : la rétropropagation les règle, et des détecteurs de bords apparaissent d'eux-mêmes.
Clic 2 : l'article de 1989 aux laboratoires Bell : lire les codes postaux des lettres américaines.`,
  `Et ça marche en production.
Clic 1 : à la fin des années 1990, des systèmes fondés sur ces réseaux lisent plus de 10 % des chèques aux États-Unis.
Clic 2 : 1998, la base MNIST : 70 000 chiffres manuscrits, qui servira de référence pendant vingt ans.`,
  `Pourtant, la révolution attend. Pour des photos en couleur de mille objets, il faut beaucoup plus de données.
Clic 1 : et beaucoup plus de calcul.
Clic 2 : pendant ce temps, d'autres méthodes plus simples font aussi bien.
Clic 3 : la revanche viendra en 2012, avec AlexNet : dossier 6.`,
  `Aujourd'hui, les réseaux convolutifs, ou leurs descendants, sont partout : téléphone, voiture, imagerie médicale.
Clic : en 2018, Yann LeCun reçoit le prix Turing avec Geoffrey Hinton et Yoshua Bengio.`,
  `À retenir : un même petit filtre, partout. Clic : des bords, puis des formes, puis des objets.
Prochain dossier : Deep Blue contre Kasparov, une victoire sans apprentissage.`,
];

export default [Cover, Shifted, Inspiration, Filter, Sharing, Many, Pooling, LeNet, Learned, Production, Desert, Today, Lesson] satisfies Page[];
