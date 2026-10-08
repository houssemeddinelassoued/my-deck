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
import imgMcCarthy from '@assets/ai-history/mccarthy.jpg';
import imgMinsky from '@assets/ai-history/minsky.jpg';
import imgTuring from '@assets/ai-history/turing.jpg';
import imgVax from '@assets/ai-history/vax.jpg';
import imgWeizenbaum from '@assets/ai-history/weizenbaum.jpg';

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
const FONT_LINK_ID = 'osd-webfont-ai-history-03-ia-symbolique';
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
const has = (n: number) => `.d03-page:has([data-osd-step="revealed"] > .d03-k${n})`;

CSS.push(`
@keyframes d03-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes d03-fade{from{opacity:0}to{opacity:1}}
@keyframes d03-type{from{opacity:0}to{opacity:1}}
@keyframes d03-draw{from{stroke-dashoffset:1.01}to{stroke-dashoffset:0}}
@keyframes d03-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes d03-pop{0%{opacity:0;transform:scale(.3)}60%{opacity:1;transform:scale(1.15)}100%{opacity:1;transform:scale(1)}}
@keyframes d03-stamp{0%{opacity:0;transform:rotate(var(--r,0deg)) scale(1.9)}35%{opacity:1}70%{transform:rotate(var(--r,0deg)) scale(.94)}100%{opacity:1;transform:rotate(var(--r,0deg)) scale(1)}}
@keyframes d03-blink{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes d03-spin{to{transform:rotate(360deg)}}
@keyframes d03-scan{0%{transform:translateY(0);opacity:0}8%{opacity:.75}92%{opacity:.75}100%{transform:translateY(var(--h,400px));opacity:0}}
@keyframes d03-back{to{stroke-dashoffset:36}}
.d03-stamp{transform:rotate(var(--r,0deg))}
.d03-in-draw{stroke-dasharray:1 2}
.d03-in-pop,.d03-pop{transform-box:fill-box;transform-origin:center}
.d03-in-grow{transform-origin:left center}
.d03-live .d03-in{animation:d03-rise 800ms ${EASE} var(--d,0ms) both}
.d03-live .d03-in-fade{animation:d03-fade 900ms ${EASE} var(--d,0ms) both}
.d03-live .d03-in-draw{animation:d03-draw 1300ms ${EASE} var(--d,0ms) both}
.d03-live .d03-in-grow{animation:d03-grow 600ms ${EASE} var(--d,0ms) both}
.d03-live .d03-in-pop{animation:d03-pop 520ms ${EASE} var(--d,0ms) both}
.d03-live .d03-in-st{animation:d03-stamp 480ms ${EASE_OUT} var(--d,0ms) both}
.d03-live .d03-ty0 .d03-c{animation:d03-type 40ms linear var(--d,0ms) both}
.d03-live .d03-lamp{animation:d03-blink var(--t,1.4s) steps(1,end) var(--d,0ms) infinite}
.d03-reel{transform-box:fill-box;transform-origin:center}
.d03-live .d03-reel{animation:d03-spin var(--t,8s) linear infinite}
.d03-scan{opacity:0}
.d03-live .d03-scan{animation:d03-scan 3.4s ease-in-out var(--d,0ms) infinite}
.d03-live .d03-back{animation:d03-back 900ms linear infinite}
@media (prefers-reduced-motion: reduce){.d03-page *{animation:none !important;transition:none !important}}
`);

// Beat utilities — visible from beat n: on (rise) / fade / typed text / stamp
// (thunk) / grow; hidden from beat n: off; stroke drawn at beat n: draw (path
// needs pathLength={1}); faded back at beat n: dim.
for (let n = 1; n <= 6; n++) {
  const at = has(n);
  CSS.push(`
.d03-on${n}{opacity:0;transform:translateY(14px);transition:opacity 500ms ${EASE} var(--d,0ms),transform 700ms ${EASE} var(--d,0ms)}
${at} .d03-on${n}{opacity:1;transform:none}
.d03-fade${n}{opacity:0;transition:opacity 550ms ${EASE} var(--d,0ms)}
${at} .d03-fade${n}{opacity:1}
.d03-ty${n} .d03-c{opacity:0}
${at} .d03-ty${n} .d03-c{opacity:1;transition:opacity 40ms linear var(--d,0ms)}
.d03-st${n}{opacity:0;transform:rotate(var(--r,0deg)) scale(1.9);transition:opacity 120ms linear var(--d,0ms),transform 440ms ${THUNK} var(--d,0ms)}
${at} .d03-st${n}{opacity:1;transform:rotate(var(--r,0deg)) scale(1)}
.d03-grow${n}{transform:scaleX(0);transform-origin:left center;transition:transform 600ms ${EASE} var(--d,0ms)}
${at} .d03-grow${n}{transform:scaleX(1)}
.d03-off${n}{transition:opacity 380ms ${EASE}}
${at} .d03-off${n}{opacity:0}
.d03-draw${n}{stroke-dasharray:1 2;stroke-dashoffset:1.01;transition:stroke-dashoffset 1000ms ${EASE} var(--d,0ms)}
${at} .d03-draw${n}{stroke-dashoffset:0}
.d03-dim${n}{transition:opacity 500ms ${EASE}}
${at} .d03-dim${n}{opacity:.22}
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
          <i className={`d03-k${i + 1}`} />
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
    className={`d03-stamp ${beat ? `d03-st${beat}` : 'd03-in-st'}`}
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
    <span className={`d03-ty${beat}`}>
      {Array.from(text).map((ch, k) =>
        ch === '\n' ? (
          <br key={k} />
        ) : (
          <span key={k} className="d03-c" style={vars({ d: `${d + i++ * step}ms` })}>
            {ch}
          </span>
        ),
      )}
    </span>
  );
};

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div
    className="d03-in-fade"
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
      className={`d03-page d03-${id}${live ? ' d03-live' : ''}`}
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
  className = 'd03-in-fade',
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
        className={beat ? `d03-draw${beat}` : 'd03-in-draw'}
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
  "id": "ai-history-03-ia-symbolique",
  "n": 3,
  "short": "L'IA symbolique",
  "footer": "L'IA symbolique — règles, symboles et hivers",
  "title": "L'IA symbolique",
  "subtitle": "Règles, symboles et hivers",
  "lede": "1950–1993 : l'autre voie de l'IA, celle qui écrit l'intelligence en règles au lieu de l'apprendre.",
  "year": "1956",
  "card": "DARTMOUTH 1956",
  "metaTitle": "L'IA symbolique : règles, symboles et hivers",
  "next": {
    "n": 4,
    "title": "Les réseaux convolutifs",
    "id": "ai-history-04-reseaux-convolutifs"
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
      <rect key={i} x={pcX(c) - 4.5} y={pcY(r) - 7.5} width={9} height={15} rx={1.5} fill={ink.hole} className="d03-in-pop" style={vars({ d: `${2900 + c * 80}ms` })} />
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
  <div className="d03-in-fade" style={{ ...vars({ d: '3300ms' }), position: 'absolute', left: 1190, top: 668, width: 590, height: 262 }}>
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
      className="d03-in-fade"
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
        fontSize: 136,
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
      className="d03-in"
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
    <div className="d03-in" style={{ ...vars({ d: '2700ms' }), position: 'absolute', left: L, top: 636 }}>
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
  <div className="d03-in" style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left, top, display: 'flex', gap: 28 }}>
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
  <div className={beat ? `d03-on${beat}` : 'd03-in'} style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: x, top: y, width: w + 16 }}>
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
  <div className={beat ? `d03-on${beat}` : 'd03-in'} style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: x, top: y, width: w, height: h }}>
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
  <div className="d03-in-fade" style={{ ...vars({ d: '1500ms' }), position: 'absolute', left: L, right: RIGHT, top, fontSize: 15, lineHeight: 1.35, color: ink.muted }}>
    {children}
  </div>
);

// A typed paper slip (a message in the imitation game, a fact, a rule…).
const Slip = ({ x, y, w, children, c = ink.text, beat = 0, d = 0, rot = 0 }: { x: number; y: number; w: number; children: ReactNode; c?: string; beat?: number; d?: number; rot?: number }) => (
  <div className={beat ? `d03-on${beat}` : 'd03-in'} style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: x, top: y, width: w }}>
    <div style={{ padding: '12px 18px', background: '#fffaf0', boxShadow: '0 8px 16px -10px rgba(60, 40, 10, 0.55)', transform: `rotate(${rot}deg)`, fontSize: 24, lineHeight: 1.4, color: c }}>{children}</div>
  </div>
);

// ═══ 2 · Turing, 1950 ═══════════════════════════════════════════════════════
const Person = ({ x, y, c = ink.text }: { x: number; y: number; c?: string }) => (
  <g fill="none" stroke={c} strokeWidth={3.5} strokeLinecap="round">
    <circle cx={x} cy={y - 34} r={20} />
    <path d={`M ${x - 34} ${y + 40} C ${x - 32} ${y}, ${x + 32} ${y}, ${x + 34} ${y + 40}`} />
  </g>
);

const Machine = ({ x, y }: { x: number; y: number }) => (
  <g>
    <rect x={x - 40} y={y - 56} width={80} height={96} rx={4} fill={ink.sheet} stroke={ink.text} strokeWidth={3.5} />
    <circle cx={x - 16} cy={y - 32} r={6} fill="#e3b55a" />
    <circle cx={x + 2} cy={y - 32} r={6} fill={ink.faint} />
    <circle cx={x + 20} cy={y - 32} r={6} fill="#e3b55a" />
    <rect x={x - 26} y={y - 10} width={52} height={30} fill="none" stroke={ink.soft} strokeWidth={2} />
  </g>
);

const Room = ({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label: string }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={ink.sheet} stroke={ink.soft} strokeWidth={2.5} />
    <text x={x + 16} y={y + 34} style={{ fontFamily: mono, fontSize: 22, fontWeight: 700, letterSpacing: '0.1em' }} fill={ink.muted}>
      {label}
    </text>
  </g>
);

const Turing: Page = () => (
  <Frame id="turing" era="1950" eyebrow="Manchester, 1950" title="« Les machines peuvent-elles penser ? »" beats={2}>
    <svg width={960} height={560} style={{ position: 'absolute', left: L, top: 330, overflow: 'visible' }}>
      <Room x={0} y={170} w={300} h={230} label="LE JUGE" />
      <Person x={150} y={310} />
      <rect x={410} y={10} width={26} height={540} fill={ink.soft} />
      <rect x={410} y={250} width={26} height={60} fill={ink.sheet} />
      <Room x={540} y={10} w={420} h={240} label="A · UN HUMAIN" />
      <Person x={750} y={160} />
      <Room x={540} y={310} w={420} h={240} label="B · UNE MACHINE" />
      <Machine x={750} y={460} />
      <text x={423} y={580} textAnchor="middle" style={{ fontFamily: hand, fontWeight: 600, fontSize: 28 }} fill={ink.blue}>
        des messages tapés, rien d'autre
      </text>
    </svg>
    <Slip x={L + 20} y={350} w={360} beat={1} rot={-1.5}>
      « Écrivez-moi un sonnet sur le pont du Forth. »
    </Slip>
    <Slip x={L} y={760} w={400} beat={2} rot={1.5} c={ink.red}>
      « Ne comptez pas sur moi. Je n'ai jamais su écrire de poésie. »
      <div style={{ marginTop: 6, fontSize: 20, color: ink.muted }}>… mais qui a répondu, A ou B ?</div>
    </Slip>
    <Photo src={imgTuring} caption="Alan Turing, 1951" x={1250} y={318} w={170} h={210} rot={-2} d={400} />
    <div className="d03-in" style={{ ...vars({ d: '700ms' }), position: 'absolute', left: 1460, top: 330, width: 320 }}>
      <Label c={ink.red}>Mind · octobre 1950</Label>
      <div style={{ marginTop: 10, fontFamily: typewriter, fontSize: 28, lineHeight: 1.2, textShadow: BLEED }}>Computing Machinery and Intelligence</div>
    </div>
    <div className="d03-on2" style={{ ...vars({ d: '600ms' }), position: 'absolute', left: 1250, top: 620, width: 530, fontSize: 27, lineHeight: 1.5 }}>
      Si le juge ne sait plus distinguer la machine de l'humain, Turing propose de dire qu'elle pense.
      <div style={{ marginTop: 14, fontFamily: typewriter, fontSize: 34, color: 'var(--osd-accent)' }}>Le jeu de l'imitation.</div>
    </div>
  </Frame>
);

// ═══ 3 · Dartmouth, 1956 ════════════════════════════════════════════════════
const Dartmouth: Page = () => (
  <Frame id="dartmouth" era="1956" eyebrow="Été 1956 · Dartmouth College, New Hampshire" title="L'intelligence artificielle reçoit son nom" beats={2}>
    <div className="d03-in" style={{ ...vars({ d: '400ms' }), position: 'absolute', left: L, top: 320, width: 1000, height: 470 }}>
      <div style={{ width: '100%', height: '100%', padding: '26px 34px', boxSizing: 'border-box', transform: 'rotate(-0.6deg)', ...ruled(96, 50) }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', height: 60 }}>
          <Label c={ink.red}>Projet de recherche · 31 août 1955</Label>
          <Label>McCarthy · Minsky · Rochester · Shannon</Label>
        </div>
        <div style={{ marginTop: 22, fontFamily: typewriter, fontSize: 31, lineHeight: 1.6, textShadow: BLEED }}>
          <Typed
            text={"« L'étude partira de la conjecture que\nchaque aspect de l'apprentissage, ou de\ntoute autre caractéristique de l'intelligence,\npeut en principe être décrit si précisément\nqu'une machine pourra le simuler. »"}
            d={900}
            step={16}
          />
        </div>
      </div>
    </div>
    <Photo src={imgMcCarthy} caption="John McCarthy" x={1250} y={318} w={150} h={180} rot={2.5} zoom={1.1} origin="62% 30%" d={600} />
    <Photo src={imgMinsky} caption="Marvin Minsky" x={1500} y={340} w={150} h={180} rot={-2.5} zoom={1.15} origin="58% 25%" d={800} />
    <div className="d03-on1" style={{ position: 'absolute', left: 1250, top: 620, width: 530, fontSize: 27, lineHeight: 1.5 }}>
      Pour ce projet, John McCarthy forge l'expression <b>« intelligence artificielle »</b>.
    </div>
    <Stamp pos={{ left: 1260, top: 800 }} rot={-6} size={40} beat={2}>
      Naissance de l'IA
    </Stamp>
    <Hand x={L + 10} y={830} w={980} rot={-1} size={30} d={2000}>
      Deux mois de réunions, une dizaine de chercheurs, et un programme pour les décennies suivantes.
    </Hand>
  </Frame>
);

// ═══ 4 · Des symboles et des règles ═════════════════════════════════════════
const Premise = ({ y, beat, children, hot }: { y: number; beat: number; children: ReactNode; hot?: boolean }) => (
  <div
    className={beat ? `d03-on${beat}` : 'd03-in'}
    style={{ ...vars({ d: beat ? '0ms' : '500ms' }), position: 'absolute', left: L, top: y, width: 860, padding: '18px 26px', boxSizing: 'border-box', background: hot ? ink.redSoft : ink.sheet, border: `2.5px solid ${hot ? ink.red : ink.text}`, boxShadow: SHADOW, fontFamily: typewriter, fontSize: 34, color: hot ? ink.red : ink.text }}
  >
    {children}
  </div>
);

const Symbols: Page = () => (
  <Frame id="symbols" era="1956" eyebrow="L'idée symbolique" title="Penser, c'est manipuler des symboles" beats={2}>
    <Premise y={330} beat={0}>
      FAIT : Socrate est un homme.
    </Premise>
    <Premise y={450} beat={0}>
      RÈGLE : tout homme est mortel.
    </Premise>
    <svg width={100} height={110} style={{ position: 'absolute', left: L + 400, top: 540, overflow: 'visible' }} className="d03-on1">
      <line x1={30} y1={0} x2={30} y2={80} stroke={ink.red} strokeWidth={4} />
      <polygon points={head(30, 96, 90, 18)} fill={ink.red} />
    </svg>
    <Premise y={650} beat={1} hot>
      DONC : Socrate est mortel.
    </Premise>
    <div className="d03-in" style={{ ...vars({ d: '900ms' }), position: 'absolute', left: 1110, top: 340, width: 670, fontSize: 28, lineHeight: 1.5, color: ink.soft }}>
      Des connaissances écrites par des humains, et des règles de déduction appliquées mécaniquement.
    </div>
    <div
      className="d03-on2"
      style={{ position: 'absolute', left: 1110, top: 520, width: 670, padding: '22px 28px', boxSizing: 'border-box', background: ink.sheet, boxShadow: SHADOW, borderLeft: `6px solid ${ink.red}` }}
    >
      <Label c={ink.red}>1956 · Newell, Shaw & Simon</Label>
      <div style={{ marginTop: 10, fontFamily: typewriter, fontSize: 36, textShadow: BLEED }}>Logic Theorist</div>
      <div style={{ marginTop: 10, fontSize: 25, lineHeight: 1.45, color: ink.soft }}>
        Il démontre 38 des 52 premiers théorèmes d'un chapitre des <i>Principia Mathematica</i> de Russell et Whitehead.
      </div>
    </div>
  </Frame>
);

// ═══ 5 · Deux écoles ════════════════════════════════════════════════════════
const SchoolRow = ({ beat, what, sym, con }: { beat: number; what: string; sym: string; con: string }) => (
  <div className={beat ? `d03-on${beat}` : 'd03-in'} style={{ ...vars({ d: beat ? '0ms' : '500ms' }), display: 'flex', alignItems: 'baseline', minHeight: 80, padding: '14px 0', borderBottom: `1.5px dotted ${ink.faint}` }}>
    <span style={{ width: 330, flex: 'none' }}>
      <Label>{what}</Label>
    </span>
    <span style={{ width: 640, fontSize: 27, lineHeight: 1.4 }}>{sym}</span>
    <span style={{ width: 640, fontSize: 27, lineHeight: 1.4, paddingLeft: 30 }}>{con}</span>
  </div>
);

const Schools: Page = () => (
  <Frame id="schools" era="1956–1986" eyebrow="Deux façons de faire" title="Deux écoles qui se disputent l'IA" beats={3}>
    <div style={{ position: 'absolute', left: L, top: 320, width: CW }}>
      <div className="d03-in" style={{ ...vars({ d: '300ms' }), display: 'flex', alignItems: 'baseline', paddingBottom: 14, borderBottom: `2.5px solid ${ink.text}` }}>
        <span style={{ width: 330 }} />
        <span style={{ width: 640, fontFamily: typewriter, fontSize: 40, color: ink.red, textShadow: BLEED }}>Symbolique</span>
        <span style={{ width: 640, fontFamily: typewriter, fontSize: 40, color: ink.blue, paddingLeft: 30, textShadow: BLEED }}>Connexionniste</span>
      </div>
      <SchoolRow beat={0} what="La connaissance" sym="écrite à la main, en règles" con="apprise à partir d'exemples" />
      <SchoolRow beat={1} what="Ses forces" sym="logique, explicable, précise" con="perception, tolère le flou" />
      <SchoolRow beat={2} what="Sa faiblesse" sym="fragile hors de ses règles" con="demande données et calcul" />
      <SchoolRow beat={3} what="Ses figures" sym="McCarthy, Minsky, Newell, Simon" con="Rosenblatt, puis Rumelhart, Hinton" />
    </div>
    <Hand x={L + 10} y={860} w={1500} rot={-0.8} size={32} d={1300}>
      Jusqu'aux années 1990, c'est l'école symbolique qui domine… et qui récolte les crédits.
    </Hand>
  </Frame>
);

// ═══ 6 · ELIZA ══════════════════════════════════════════════════════════════
const Turn = ({ who, beat, children }: { who: 'U' | 'E'; beat: number; children: ReactNode }) => (
  <div className={beat ? `d03-on${beat}` : 'd03-in'} style={{ ...vars({ d: beat ? '0ms' : '600ms' }), display: 'flex', gap: 18, marginBottom: 18, fontSize: 26, lineHeight: 1.4 }}>
    <span style={{ width: 110, flex: 'none', fontWeight: 700, color: who === 'E' ? ink.red : ink.muted }}>{who === 'E' ? 'ELIZA >' : 'Vous >'}</span>
    <span style={{ color: who === 'E' ? ink.red : ink.text }}>{children}</span>
  </div>
);

const Rule = ({ beat, when, then }: { beat: number; when: string; then: string }) => (
  <div className={`d03-on${beat}`} style={{ ...vars({ d: '350ms' }), marginBottom: 16, padding: '12px 18px', background: ink.sheet, boxShadow: SHADOW, borderLeft: `5px solid ${ink.blue}`, fontSize: 23, lineHeight: 1.4 }}>
    <div>
      <b>SI</b> la phrase contient <span style={{ fontFamily: mono, color: ink.blue, fontWeight: 700 }}>{when}</span>
    </div>
    <div>
      <b>ALORS</b> répondre <span style={{ color: ink.blue }}>{then}</span>
    </div>
  </div>
);

const Eliza: Page = () => (
  <Frame id="eliza" era="1966" eyebrow="MIT, 1966" title="ELIZA, le premier chatbot" beats={3}>
    <div className="d03-in" style={{ ...vars({ d: '300ms' }), position: 'absolute', left: L, top: 320, width: 820, height: 520, padding: '26px 30px', boxSizing: 'border-box', background: '#2c2822', boxShadow: SHADOW }}>
      <div style={{ fontFamily: mono, fontSize: 18, letterSpacing: '0.16em', color: '#c9bb9c' }}>TÉLÉSCRIPTEUR · SCRIPT « DOCTOR »</div>
      <div style={{ marginTop: 22, background: '#f5ecd5', padding: '20px 24px', height: 400, boxSizing: 'border-box' }}>
        <Turn who="U" beat={0}>
          Je suis triste ces temps-ci.
        </Turn>
        <Turn who="E" beat={1}>
          Depuis combien de temps êtes-vous triste ces temps-ci ?
        </Turn>
        <Turn who="U" beat={2}>
          Ma mère ne me comprend pas.
        </Turn>
        <Turn who="E" beat={2}>
          Parlez-moi de votre famille.
        </Turn>
        <Turn who="U" beat={3}>
          Bof.
        </Turn>
        <Turn who="E" beat={3}>
          Pouvez-vous préciser ?
        </Turn>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1030, top: 320, width: 520 }}>
      <Rule beat={1} when="« je suis X »" then="« Depuis combien de temps êtes-vous X ? »" />
      <Rule beat={2} when="« mère »" then="« Parlez-moi de votre famille. »" />
      <Rule beat={3} when="aucun motif connu" then="« Pouvez-vous préciser ? »" />
    </div>
    <Photo src={imgWeizenbaum} caption="Joseph Weizenbaum" x={1590} y={330} w={160} h={200} rot={3} zoom={1.25} origin="50% 22%" d={500} />
    <Hand x={L + 10} y={870} w={1560} rot={-0.8} size={31} d={1400}>
      Aucune compréhension : des motifs et des phrases toutes faites. Pourtant, des utilisateurs lui confient leurs secrets.
    </Hand>
  </Frame>
);

// ═══ 7 · Les prédictions ════════════════════════════════════════════════════
const Prophecy = ({ x, beat, who, year, children }: { x: number; beat: number; who: string; year: string; children: ReactNode }) => (
  <div className={beat ? `d03-on${beat}` : 'd03-in'} style={{ ...vars({ d: beat ? '0ms' : '400ms' }), position: 'absolute', left: x, top: 330, width: 760, height: 400 }}>
    <div style={{ width: '100%', height: '100%', padding: '28px 34px', boxSizing: 'border-box', background: ink.sheet, boxShadow: SHADOW }}>
      <Label c={ink.red}>
        {who} · {year}
      </Label>
      <div style={{ marginTop: 22, fontFamily: typewriter, fontSize: 36, lineHeight: 1.35, textShadow: BLEED }}>{children}</div>
    </div>
  </div>
);

const Optimism: Page = () => (
  <Frame id="optimism" era="1965–1967" eyebrow="Un optimisme débordant" title="« D'ici vingt ans… »" beats={2}>
    <Prophecy x={170} beat={0} who="Herbert Simon" year="1965">
      « Les machines seront capables, d'ici vingt ans, de faire tout travail qu'un homme peut faire. »
    </Prophecy>
    <Prophecy x={1020} beat={1} who="Marvin Minsky" year="1967">
      « D'ici une génération, le problème de la création d'une "intelligence artificielle" sera en grande partie résolu. »
    </Prophecy>
    <Stamp pos={{ left: 260, top: 640 }} rot={-10} size={52} beat={2}>
      Prédiction ratée
    </Stamp>
    <Stamp pos={{ left: 1110, top: 640 }} rot={7} size={52} beat={2} d={250}>
      Prédiction ratée
    </Stamp>
    <Hand x={L + 10} y={800} w={1500} rot={-0.8} size={32} d={1500}>
      Ces promesses attirent les financements… et préparent la déception.
    </Hand>
  </Frame>
);

// ═══ 8 · Le premier hiver ═══════════════════════════════════════════════════
const Depth = ({ k, n, beat }: { k: number; n: string; beat: number }) => (
  <div className={beat ? `d03-on${beat}` : 'd03-in'} style={{ ...vars({ d: beat ? '0ms' : '500ms' }), display: 'flex', alignItems: 'baseline', height: 66, borderBottom: `1.5px dotted ${ink.faint}` }}>
    <span style={{ width: 300, fontSize: 26 }}>
      {k} coup{k > 1 ? 's' : ''} d'avance
    </span>
    <span style={{ fontFamily: typewriter, fontSize: 40, color: k >= 4 ? ink.red : ink.text }}>{n}</span>
  </div>
);

const WinterEvent = ({ beat, year, children }: { beat: number; year: string; children: ReactNode }) => (
  <div className={`d03-on${beat}`} style={{ display: 'flex', gap: 22, alignItems: 'baseline', marginBottom: 22 }}>
    <span style={{ fontFamily: typewriter, fontSize: 36, color: ink.blue, width: 100, flex: 'none' }}>{year}</span>
    <span style={{ fontSize: 26, lineHeight: 1.4 }}>{children}</span>
  </div>
);

const Winter: Page = () => (
  <Frame id="winter" era="1974–1980" eyebrow="Le premier hiver de l'IA" title="L'explosion combinatoire" beats={4}>
    <div style={{ position: 'absolute', left: L, top: 330, width: 720 }}>
      <div className="d03-in" style={{ ...vars({ d: '300ms' }), fontSize: 26, lineHeight: 1.45, color: ink.soft, marginBottom: 16 }}>
        Aux échecs, environ 35 coups possibles à chaque tour. Positions à examiner :
      </div>
      <Depth k={1} n="35" beat={0} />
      <Depth k={2} n="1 225" beat={0} />
      <Depth k={3} n="42 875" beat={1} />
      <Depth k={4} n="1,5 million" beat={1} />
      <Depth k={6} n="1,8 milliard" beat={1} />
    </div>
    <div style={{ position: 'absolute', left: 1040, top: 330, width: 740 }}>
      <WinterEvent beat={2} year="1966">
        Rapport ALPAC : la traduction automatique déçoit, ses crédits sont coupés.
      </WinterEvent>
      <WinterEvent beat={3} year="1973">
        Rapport Lighthill : au Royaume-Uni, l'IA ne tient pas ses promesses.
      </WinterEvent>
      <WinterEvent beat={4} year="1974">
        Aux États-Unis, la DARPA réduit fortement ses financements.
      </WinterEvent>
    </div>
    <Stamp pos={{ left: 1220, top: 780 }} rot={-6} size={56} color={ink.blue} beat={4} d={400}>
      Hiver
    </Stamp>
    <Hand x={L + 10} y={790} w={760} rot={-1} size={30} d={1300}>
      Ce qui marche sur un jouet explose sur un vrai problème.
    </Hand>
  </Frame>
);

// ═══ 9 · Les systèmes experts ═══════════════════════════════════════════════
const Fact = ({ x, y, beat, children, hot }: { x: number; y: number; beat: number; children: ReactNode; hot?: boolean }) => (
  <div
    className={beat ? `d03-on${beat}` : 'd03-in'}
    style={{ ...vars({ d: beat ? '200ms' : '500ms' }), position: 'absolute', left: x, top: y, width: 330, padding: '14px 18px', boxSizing: 'border-box', background: hot ? ink.redSoft : ink.sheet, border: `2px solid ${hot ? ink.red : ink.soft}`, fontSize: 24, lineHeight: 1.35, color: hot ? ink.red : ink.text }}
  >
    {children}
  </div>
);

const Engine = ({ y, beat, children }: { y: number; beat: number; children: ReactNode }) => (
  <div className={`d03-on${beat}`} style={{ position: 'absolute', left: 620, top: y, width: 600, padding: '12px 20px', boxSizing: 'border-box', background: ink.sheet, boxShadow: SHADOW, borderLeft: `5px solid ${ink.blue}`, fontSize: 23, lineHeight: 1.4 }}>
    {children}
  </div>
);

const Experts: Page = () => (
  <Frame id="experts" era="1980s" eyebrow="Les années 1980" title="Les systèmes experts : un expert mis en règles" beats={3}>
    <div className="d03-in-fade" style={{ ...vars({ d: '300ms' }), position: 'absolute', left: L, top: 310 }}>
      <Label>Faits observés</Label>
    </div>
    <Fact x={L} y={350} beat={0}>
      Le moteur ne démarre pas.
    </Fact>
    <Fact x={L} y={450} beat={0}>
      Les phares sont faibles.
    </Fact>
    <div className="d03-in-fade" style={{ ...vars({ d: '300ms' }), position: 'absolute', left: 620, top: 310 }}>
      <Label c={ink.blue}>Base de règles (écrite avec un garagiste)</Label>
    </div>
    <Engine y={350} beat={1}>
      <b>SI</b> le moteur ne démarre pas <b>ET</b> les phares sont faibles <b>ALORS</b> la batterie est faible.
    </Engine>
    <Engine y={480} beat={2}>
      <b>SI</b> la batterie est faible <b>ALORS</b> recharger ou remplacer la batterie.
    </Engine>
    <Fact x={L} y={560} beat={1} hot>
      Déduit : la batterie est faible.
    </Fact>
    <Fact x={L} y={680} beat={2} hot>
      Conseil : remplacer la batterie.
    </Fact>
    <div className="d03-on3" style={{ position: 'absolute', left: 1290, top: 340, width: 490 }}>
      <div style={{ fontFamily: typewriter, fontSize: 36, lineHeight: 1.2, textShadow: BLEED }}>Le moteur d'inférence</div>
      <div style={{ marginTop: 14, fontSize: 26, lineHeight: 1.5, color: ink.soft }}>
        enchaîne les règles jusqu'à une conclusion, et peut expliquer son raisonnement règle par règle.
      </div>
    </div>
    <Hand x={620} y={650} w={600} rot={-1} size={30} d={1400}>
      Un « ingénieur de la connaissance » interroge l'expert pendant des mois pour écrire ces règles.
    </Hand>
  </Frame>
);

// ═══ 10 · Le boom ═══════════════════════════════════════════════════════════
const BoomCard = ({ x, beat, year, name, children }: { x: number; beat: number; year: string; name: string; children: ReactNode }) => (
  <div className={beat ? `d03-on${beat}` : 'd03-in'} style={{ ...vars({ d: beat ? '0ms' : '400ms' }), position: 'absolute', left: x, top: 330, width: 410, height: 430, padding: '24px 28px', boxSizing: 'border-box', background: ink.sheet, boxShadow: SHADOW }}>
    <div style={{ fontFamily: typewriter, fontSize: 54, lineHeight: 1, color: ink.red, textShadow: BLEED }}>{year}</div>
    <div style={{ marginTop: 12, fontFamily: typewriter, fontSize: 32, textShadow: BLEED }}>{name}</div>
    <div style={{ marginTop: 16, fontSize: 25, lineHeight: 1.45, color: ink.soft }}>{children}</div>
  </div>
);

const Boom: Page = () => (
  <Frame id="boom" era="1980–1987" eyebrow="Le boom" title="L'IA entre dans les entreprises" beats={2}>
    <BoomCard x={170} beat={0} year="1970s" name="MYCIN">
      À Stanford, environ 600 règles pour identifier les bactéries d'une infection et proposer un antibiotique.
    </BoomCard>
    <BoomCard x={600} beat={1} year="1980" name="XCON">
      Chez DEC, des milliers de règles configurent les commandes d'ordinateurs VAX. Des millions de dollars économisés chaque année.
    </BoomCard>
    <Photo src={imgVax} caption="Un VAX-11/780 de DEC" x={1500} y={330} w={230} h={300} rot={2.5} d={700} />
    <BoomCard x={1030} beat={2} year="1982" name="5e génération">
      Le Japon lance un programme national géant pour des ordinateurs « intelligents ». L'Europe et les États-Unis répliquent.
    </BoomCard>
    <Hand x={L + 10} y={800} w={1500} rot={-0.8} size={32} d={1300}>
      Des entreprises spécialisées, des machines dédiées au langage Lisp, des milliards investis.
    </Hand>
  </Frame>
);

// ═══ 11 · Le deuxième hiver ═════════════════════════════════════════════════
const Crack = ({ beat, title, children }: { beat: number; title: string; children: ReactNode }) => (
  <div className={beat ? `d03-on${beat}` : 'd03-in'} style={{ ...vars({ d: beat ? '0ms' : '500ms' }), display: 'flex', gap: 26, marginBottom: 30 }}>
    <span style={{ fontFamily: typewriter, fontSize: 44, color: ink.red, width: 50, flex: 'none' }}>✗</span>
    <div>
      <div style={{ fontFamily: typewriter, fontSize: 34, textShadow: BLEED }}>{title}</div>
      <div style={{ marginTop: 6, fontSize: 25, lineHeight: 1.45, color: ink.soft }}>{children}</div>
    </div>
  </div>
);

const SecondWinter: Page = () => (
  <Frame id="winter2" era="1987–1993" eyebrow="Le deuxième hiver de l'IA" title="Quand le monde déborde des règles" beats={3}>
    <div style={{ position: 'absolute', left: L, top: 330, width: 1000 }}>
      <Crack beat={0} title="Fragiles">
        Une question juste à côté des règles, et le système répond n'importe quoi, sans le savoir.
      </Crack>
      <Crack beat={1} title="Coûteux à entretenir">
        Des milliers de règles qui finissent par se contredire. Chaque ajout en casse une autre.
      </Crack>
      <Crack beat={2} title="Impossibles à écrire en entier">
        Une grande partie de ce que savent les experts ne se met pas en mots.
      </Crack>
    </div>
    <div className="d03-on3" style={{ position: 'absolute', left: 1250, top: 340, width: 530, fontSize: 27, lineHeight: 1.5 }}>
      <b>1987</b> : le marché des machines Lisp s'effondre, remplacé par des ordinateurs de bureau moins chers. Les crédits suivent.
    </div>
    <Stamp pos={{ left: 1300, top: 620 }} rot={-7} size={60} color={ink.blue} beat={3} d={500}>
      2e hiver
    </Stamp>
  </Frame>
);

// ═══ 12 · Ce qu'il en reste ═════════════════════════════════════════════════
const Legacy: Page = () => (
  <Frame id="legacy" era="Auj." eyebrow="Ce qu'il en reste" title="Les règles n'ont jamais disparu" beats={2}>
    <ul style={{ position: 'absolute', left: L, top: 330, width: 900, margin: 0, padding: 0, listStyle: 'none', fontSize: 29, lineHeight: 1.45 }}>
      <li className="d03-in" style={{ ...vars({ d: '400ms' }), marginBottom: 26 }}>
        – Logiciels métier, impôts, assurance : des moteurs de règles partout.
      </li>
      <li className="d03-in" style={{ ...vars({ d: '600ms' }), marginBottom: 26 }}>
        – Planification, vérification de programmes, GPS : de la recherche symbolique.
      </li>
      <li className="d03-in" style={{ ...vars({ d: '800ms' }), marginBottom: 26 }}>
        – Deep Blue en 1997 : du calcul et des règles, sans apprentissage (dossier 5).
      </li>
    </ul>
    <div className="d03-on1" style={{ position: 'absolute', left: 1170, top: 330, width: 610, padding: '24px 30px', boxSizing: 'border-box', background: ink.sheet, boxShadow: SHADOW, borderLeft: `6px solid ${ink.blue}` }}>
      <Label c={ink.blue}>Le retour du débat</Label>
      <div style={{ marginTop: 12, fontSize: 26, lineHeight: 1.5 }}>
        Les grands modèles de langage apprennent tout… mais se trompent en logique. Beaucoup de chercheurs veulent marier les deux écoles : l'IA « neuro-symbolique ».
      </div>
    </div>
    <div style={{ position: 'absolute', left: L, top: 760, width: CW, fontFamily: typewriter, fontSize: 44, lineHeight: 1.25, color: 'var(--osd-accent)', textShadow: BLEED }}>
      <Typed text="Mais pour voir, entendre ou lire, il faudra apprendre." beat={2} step={26} />
    </div>
  </Frame>
);

// ═══ 13 · Ce qu'il faut retenir ═════════════════════════════════════════════
const Lesson: Page = () => (
  <Frame id="lesson" eyebrow="Ce qu'il faut retenir" beats={1}>
    <div className="d03-in-fade" style={{ position: 'absolute', left: L - 16, top: 170, fontFamily: typewriter, fontSize: 300, lineHeight: 1, color: ink.rule }}>
      «
    </div>
    <div style={{ position: 'absolute', left: L, top: 370, fontFamily: typewriter, fontSize: 66, lineHeight: 1.22, textShadow: BLEED }}>
      <Typed text="On peut écrire l'intelligence en règles…" d={400} step={30} />
    </div>
    <div style={{ position: 'absolute', left: L, top: 470, fontFamily: typewriter, fontSize: 66, lineHeight: 1.22, textShadow: BLEED }}>
      <Typed text="…jusqu'à ce que " beat={1} step={30} />
      <span style={{ color: 'var(--osd-accent)' }}>
        <Mark beat={1} d={1300}>
          <Typed text="le monde déborde" beat={1} d={480} step={30} />
        </Mark>
      </span>
      <Typed text=" des règles." beat={1} d={960} step={30} />
    </div>
    <SeriesNav left={L} top={700} d={800} />
    <Credits top={900}>
      Photos via Wikimedia Commons : Alan Turing, 1951, Elliott &amp; Fry (domaine public) · John McCarthy par « null0 » (CC BY-SA 2.0) · Marvin Minsky par
      Sethwoodworth (CC BY 3.0) · Joseph Weizenbaum, Rochester Institute of Technology (domaine public) · VAX-11/780 par Emiliano Russo, VerdeBinario
      (domaine public). Images recadrées et teintées.
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

const STYLE_ID = 'osd-styles-ai-history-03-ia-symbolique';
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
  title: "L'IA symbolique : règles, symboles et hivers",
  createdAt: '2026-10-08T00:21:39.538Z',
};

export const notes: (string | undefined)[] = [
  `Dossier 3, un retour en arrière. Pendant que les réseaux de neurones vivaient leurs hauts et leurs bas, une autre IA dominait : celle des règles et des symboles.
La carte perforée encode « DARTMOUTH 1956 ».`,
  `1950 : Alan Turing publie « Computing Machinery and Intelligence ». Sa question : les machines peuvent-elles penser ?
Plutôt que de définir « penser », il propose un jeu. Un juge échange des messages tapés avec un humain et une machine, cachés derrière un mur.
Clic 1 : le juge demande un sonnet. Clic 2 : la réponse, tirée de l'article : « Ne comptez pas sur moi. » Mais qui a répondu ?
Si le juge ne fait plus la différence, Turing propose de dire que la machine pense. C'est le jeu de l'imitation, qu'on appelle aujourd'hui le test de Turing.`,
  `Été 1956, Dartmouth. Le projet, rédigé en 1955 par McCarthy, Minsky, Rochester et Shannon, part d'une conjecture : tout aspect de l'intelligence peut être décrit assez précisément pour qu'une machine le simule.
Clic 1 : c'est pour ce projet que McCarthy invente l'expression « intelligence artificielle ».
Clic 2 : on date généralement la naissance du domaine de cet été-là.`,
  `L'idée qui domine alors : penser, c'est manipuler des symboles avec des règles.
Un fait, une règle… Clic 1 : une déduction, appliquée mécaniquement.
Clic 2 : dès 1956, le Logic Theorist de Newell, Shaw et Simon démontre 38 des 52 premiers théorèmes d'un chapitre des Principia Mathematica.`,
  `Deux écoles s'affrontent.
Symbolique : la connaissance s'écrit en règles. Connexionniste : elle s'apprend à partir d'exemples, comme le Perceptron.
Clic 1 : leurs forces. Clic 2 : leurs faiblesses. Clic 3 : leurs figures.
Jusqu'aux années 1990, l'école symbolique domine et récolte l'essentiel des crédits.`,
  `1966, au MIT : Joseph Weizenbaum crée ELIZA, qui imite un psychothérapeute.
Clic 1 : « je suis X » devient « depuis combien de temps êtes-vous X ? ». Clic 2 : le mot « mère » déclenche « parlez-moi de votre famille ». Clic 3 : sinon, une phrase passe-partout.
Aucune compréhension, et pourtant des utilisateurs lui confiaient leurs secrets. Weizenbaum en sera profondément inquiet. C'est l'« effet ELIZA », qu'on retrouve avec les chatbots d'aujourd'hui.`,
  `L'optimisme est immense. 1965, Herbert Simon : d'ici vingt ans, les machines feront tout travail humain.
Clic 1 : 1967, Marvin Minsky : d'ici une génération, le problème sera en grande partie résolu.
Clic 2 : deux prédictions ratées. Ces promesses attirent l'argent… et préparent la déception.`,
  `Le premier hiver. Le problème de fond : l'explosion combinatoire.
Aux échecs, environ 35 coups possibles par tour. Clic 1 : à six coups d'avance, près de deux milliards de positions.
Clic 2 : 1966, le rapport ALPAC enterre la traduction automatique. Clic 3 : 1973, le rapport Lighthill au Royaume-Uni. Clic 4 : 1974, la DARPA coupe ses financements. C'est le premier hiver de l'IA.`,
  `Années 1980 : le retour, avec les systèmes experts. On interroge un expert et on écrit son savoir en règles.
Exemple : deux faits observés sur une voiture. Clic 1 : une règle en déduit que la batterie est faible. Clic 2 : une autre règle propose de la remplacer.
Clic 3 : le moteur d'inférence enchaîne les règles et peut expliquer son raisonnement.`,
  `Le boom. MYCIN à Stanford, environ 600 règles pour les infections bactériennes.
Clic 1 : 1980, XCON chez DEC configure les commandes d'ordinateurs VAX et fait économiser des millions chaque année.
Clic 2 : 1982, le Japon lance son projet d'ordinateurs de cinquième génération. Des milliards sont investis.`,
  `Puis le deuxième hiver. Les systèmes experts sont fragiles : juste à côté de leurs règles, ils répondent n'importe quoi.
Clic 1 : coûteux à entretenir, les règles finissent par se contredire.
Clic 2 : et une grande partie du savoir des experts ne se met pas en mots.
Clic 3 : 1987, le marché des machines Lisp s'effondre. Deuxième hiver, jusqu'au début des années 1990.`,
  `Pourtant, les règles n'ont jamais disparu : logiciels métier, planification, et même Deep Blue en 1997.
Clic 1 : et le débat revient : les grands modèles de langage apprennent tout mais se trompent en logique ; on cherche à marier les deux écoles.
Clic 2 : mais pour voir, entendre ou lire, il faudra apprendre. C'est le sujet du dossier suivant.`,
  `À retenir : on peut écrire l'intelligence en règles… Clic : jusqu'à ce que le monde déborde des règles.
Prochain dossier : les réseaux convolutifs, ou comment une machine apprend à voir.`,
];

export default [Cover, Turing, Dartmouth, Symbols, Schools, Eliza, Optimism, Winter, Experts, Boom, SecondWinter, Legacy, Lesson] satisfies Page[];
