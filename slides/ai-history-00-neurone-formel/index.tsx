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
import imgPitts from '@assets/ai-history/pitts.jpg';

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
const FONT_LINK_ID = 'osd-webfont-ai-history-00-neurone-formel';
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
const has = (n: number) => `.d00-page:has([data-osd-step="revealed"] > .d00-k${n})`;

CSS.push(`
@keyframes d00-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes d00-fade{from{opacity:0}to{opacity:1}}
@keyframes d00-type{from{opacity:0}to{opacity:1}}
@keyframes d00-draw{from{stroke-dashoffset:1.01}to{stroke-dashoffset:0}}
@keyframes d00-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes d00-pop{0%{opacity:0;transform:scale(.3)}60%{opacity:1;transform:scale(1.15)}100%{opacity:1;transform:scale(1)}}
@keyframes d00-stamp{0%{opacity:0;transform:rotate(var(--r,0deg)) scale(1.9)}35%{opacity:1}70%{transform:rotate(var(--r,0deg)) scale(.94)}100%{opacity:1;transform:rotate(var(--r,0deg)) scale(1)}}
@keyframes d00-blink{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes d00-spin{to{transform:rotate(360deg)}}
@keyframes d00-scan{0%{transform:translateY(0);opacity:0}8%{opacity:.75}92%{opacity:.75}100%{transform:translateY(var(--h,400px));opacity:0}}
@keyframes d00-back{to{stroke-dashoffset:36}}
.d00-stamp{transform:rotate(var(--r,0deg))}
.d00-in-draw{stroke-dasharray:1 2}
.d00-in-pop,.d00-pop{transform-box:fill-box;transform-origin:center}
.d00-in-grow{transform-origin:left center}
.d00-live .d00-in{animation:d00-rise 800ms ${EASE} var(--d,0ms) both}
.d00-live .d00-in-fade{animation:d00-fade 900ms ${EASE} var(--d,0ms) both}
.d00-live .d00-in-draw{animation:d00-draw 1300ms ${EASE} var(--d,0ms) both}
.d00-live .d00-in-grow{animation:d00-grow 600ms ${EASE} var(--d,0ms) both}
.d00-live .d00-in-pop{animation:d00-pop 520ms ${EASE} var(--d,0ms) both}
.d00-live .d00-in-st{animation:d00-stamp 480ms ${EASE_OUT} var(--d,0ms) both}
.d00-live .d00-ty0 .d00-c{animation:d00-type 40ms linear var(--d,0ms) both}
.d00-live .d00-lamp{animation:d00-blink var(--t,1.4s) steps(1,end) var(--d,0ms) infinite}
.d00-reel{transform-box:fill-box;transform-origin:center}
.d00-live .d00-reel{animation:d00-spin var(--t,8s) linear infinite}
.d00-scan{opacity:0}
.d00-live .d00-scan{animation:d00-scan 3.4s ease-in-out var(--d,0ms) infinite}
.d00-live .d00-back{animation:d00-back 900ms linear infinite}
@media (prefers-reduced-motion: reduce){.d00-page *{animation:none !important;transition:none !important}}
`);

// Beat utilities — visible from beat n: on (rise) / fade / typed text / stamp
// (thunk) / grow; hidden from beat n: off; stroke drawn at beat n: draw (path
// needs pathLength={1}); faded back at beat n: dim.
for (let n = 1; n <= 6; n++) {
  const at = has(n);
  CSS.push(`
.d00-on${n}{opacity:0;transform:translateY(14px);transition:opacity 500ms ${EASE} var(--d,0ms),transform 700ms ${EASE} var(--d,0ms)}
${at} .d00-on${n}{opacity:1;transform:none}
.d00-fade${n}{opacity:0;transition:opacity 550ms ${EASE} var(--d,0ms)}
${at} .d00-fade${n}{opacity:1}
.d00-ty${n} .d00-c{opacity:0}
${at} .d00-ty${n} .d00-c{opacity:1;transition:opacity 40ms linear var(--d,0ms)}
.d00-st${n}{opacity:0;transform:rotate(var(--r,0deg)) scale(1.9);transition:opacity 120ms linear var(--d,0ms),transform 440ms ${THUNK} var(--d,0ms)}
${at} .d00-st${n}{opacity:1;transform:rotate(var(--r,0deg)) scale(1)}
.d00-grow${n}{transform:scaleX(0);transform-origin:left center;transition:transform 600ms ${EASE} var(--d,0ms)}
${at} .d00-grow${n}{transform:scaleX(1)}
.d00-off${n}{transition:opacity 380ms ${EASE}}
${at} .d00-off${n}{opacity:0}
.d00-draw${n}{stroke-dasharray:1 2;stroke-dashoffset:1.01;transition:stroke-dashoffset 1000ms ${EASE} var(--d,0ms)}
${at} .d00-draw${n}{stroke-dashoffset:0}
.d00-dim${n}{transition:opacity 500ms ${EASE}}
${at} .d00-dim${n}{opacity:.22}
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
          <i className={`d00-k${i + 1}`} />
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
    className={`d00-stamp ${beat ? `d00-st${beat}` : 'd00-in-st'}`}
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
    <span className={`d00-ty${beat}`}>
      {Array.from(text).map((ch, k) =>
        ch === '\n' ? (
          <br key={k} />
        ) : (
          <span key={k} className="d00-c" style={vars({ d: `${d + i++ * step}ms` })}>
            {ch}
          </span>
        ),
      )}
    </span>
  );
};

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div
    className="d00-in-fade"
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
      className={`d00-page d00-${id}${live ? ' d00-live' : ''}`}
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
  className = 'd00-in-fade',
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
        className={beat ? `d00-draw${beat}` : 'd00-in-draw'}
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
  "id": "ai-history-00-neurone-formel",
  "n": 0,
  "short": "Le neurone formel",
  "footer": "Le neurone formel — le cerveau comme une machine logique",
  "title": "Le neurone formel",
  "subtitle": "Le premier modèle mathématique du neurone",
  "lede": "1943 : un neurophysiologiste et un jeune logicien décrivent le neurone comme un calcul de 0 et de 1.",
  "year": "1943",
  "card": "NEURONE FORMEL 1943",
  "metaTitle": "Le neurone formel : le premier modèle mathématique du neurone",
  "next": {
    "n": 1,
    "title": "Le Perceptron",
    "id": "ai-history-01-perceptron"
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
      <rect key={i} x={pcX(c) - 4.5} y={pcY(r) - 7.5} width={9} height={15} rx={1.5} fill={ink.hole} className="d00-in-pop" style={vars({ d: `${2900 + c * 80}ms` })} />
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
  <div className="d00-in-fade" style={{ ...vars({ d: '3300ms' }), position: 'absolute', left: 1190, top: 668, width: 590, height: 262 }}>
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
      className="d00-in-fade"
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
        fontSize: 120,
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
      className="d00-in"
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
    <div className="d00-in" style={{ ...vars({ d: '2700ms' }), position: 'absolute', left: L, top: 636 }}>
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
  <div className="d00-in" style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left, top, display: 'flex', gap: 28 }}>
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
  <div className={beat ? `d00-on${beat}` : 'd00-in'} style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: x, top: y, width: w + 16 }}>
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
  <div className={beat ? `d00-on${beat}` : 'd00-in'} style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: x, top: y, width: w, height: h }}>
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
  <div className="d00-in-fade" style={{ ...vars({ d: '1500ms' }), position: 'absolute', left: L, right: RIGHT, top, fontSize: 15, lineHeight: 1.35, color: ink.muted }}>
    {children}
  </div>
);

// Point on the rim of a circle (cx, cy, r) in the direction of (x, y).
const rim = (cx: number, cy: number, r: number, x: number, y: number): [number, number] => {
  const dx = x - cx;
  const dy = y - cy;
  const k = r / Math.hypot(dx, dy);
  return [cx + dx * k, cy + dy * k];
};
const angle = (x1: number, y1: number, x2: number, y2: number) => (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

// Excitatory connection (arrowhead) or inhibitory one (open circle), ending on a neuron's rim.
const Wire = ({
  x,
  y,
  cx,
  cy,
  r,
  inhib,
  c = ink.text,
  w = 3,
  className,
}: {
  x: number;
  y: number;
  cx: number;
  cy: number;
  r: number;
  inhib?: boolean;
  c?: string;
  w?: number;
  className?: string;
}) => {
  const [ex, ey] = rim(cx, cy, r + (inhib ? 11 : 2), x, y);
  const a = angle(x, y, ex, ey);
  return (
    <g className={className}>
      <line x1={x} y1={y} x2={ex} y2={ey} stroke={c} strokeWidth={w} />
      {inhib ? (
        <circle cx={ex} cy={ey} r={9} fill={ink.sheet} stroke={c} strokeWidth={w} />
      ) : (
        <polygon points={head(ex, ey, a, 15)} fill={c} />
      )}
    </g>
  );
};

// ═══ 2 · Deux chercheurs ════════════════════════════════════════════════════
const Duo: Page = () => (
  <Frame id="duo" era="1943" eyebrow="Chicago, 1943" title="Deux chercheurs, une question" beats={1}>
    <Fiche code="FICHE Nº 43-A" x={L} y={318} w={600} h={290} rot={-1} d={400}>
      <FicheLine label="NOM" value="Warren McCulloch" d={700} />
      <FicheLine label="MÉTIER" value="neurophysiologiste" d={1050} />
      <FicheLine label="ÂGE" value="44 ans" d={1450} />
      <FicheLine label="LIEU" value="université de l'Illinois" d={1650} />
    </Fiche>
    <Fiche code="FICHE Nº 43-B" x={L} y={640} w={600} h={290} rot={1} d={900}>
      <FicheLine label="NOM" value="Walter Pitts" d={1300} />
      <FicheLine label="MÉTIER" value="logicien autodidacte" d={1600} />
      <FicheLine label="ÂGE" value="20 ans" d={2050} />
      <FicheLine label="DIPLÔME" value="aucun, jamais" d={2250} />
    </Fiche>
    <Photo src={imgPitts} caption="Walter Pitts, 1954" x={800} y={600} w={160} h={210} rot={3} zoom={1.7} origin="56% 24%" d={1800} />
    <div
      className="d00-in-fade"
      style={{ ...vars({ d: '300ms' }), position: 'absolute', left: 950, top: 300, fontFamily: typewriter, fontSize: 140, lineHeight: 1, color: ink.rule }}
    >
      «
    </div>
    <div style={{ position: 'absolute', left: 1040, top: 336, width: 740, fontFamily: typewriter, fontSize: 52, lineHeight: 1.25, textShadow: BLEED }}>
      <Typed text={"Et si le cerveau\nn'était qu'une machine\nqui calcule ?"} d={1000} step={30} />
    </div>
    <div
      className="d00-on1"
      style={{ position: 'absolute', left: 1040, top: 600, width: 740, padding: '22px 28px', boxSizing: 'border-box', background: ink.sheet, boxShadow: SHADOW, borderLeft: `6px solid ${ink.red}` }}
    >
      <Label c={ink.red}>Bulletin of Mathematical Biophysics · décembre 1943</Label>
      <div style={{ marginTop: 12, fontFamily: typewriter, fontSize: 31, lineHeight: 1.2, textShadow: BLEED }}>
        A Logical Calculus of the Ideas Immanent in Nervous Activity
      </div>
      <div style={{ marginTop: 12, fontSize: 23, lineHeight: 1.4, fontStyle: 'italic', color: ink.soft }}>
        « Un calcul logique des idées immanentes à l'activité nerveuse »
      </div>
    </div>
  </Frame>
);

// ═══ 3 · Tout ou rien ═══════════════════════════════════════════════════════
const NeuronSketch = () => (
  <svg width={720} height={460} style={{ position: 'absolute', left: L - 20, top: 330, overflow: 'visible' }}>
    <g fill="none" stroke={ink.text} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="d00-in-draw" style={vars({ d: '400ms' })}>
      <path pathLength={1} d="M 250 205 L 170 140 L 110 80" />
      <path pathLength={1} d="M 170 140 L 95 150" />
      <path pathLength={1} d="M 248 250 L 160 280 L 90 262" />
      <path pathLength={1} d="M 160 280 L 125 345" />
      <path pathLength={1} d="M 278 178 L 245 95 L 265 45" />
      <path pathLength={1} d="M 285 285 L 255 365 L 290 415" />
    </g>
    <circle cx={310} cy={230} r={62} fill={ink.sheet} stroke={ink.text} strokeWidth={3.5} className="d00-in-fade" style={vars({ d: '300ms' })} />
    <circle cx={310} cy={230} r={20} fill={ink.faint} className="d00-in-fade" style={vars({ d: '500ms' })} />
    <g className="d00-in-fade" style={vars({ d: '900ms' })}>
      <line x1={372} y1={230} x2={610} y2={230} stroke={ink.text} strokeWidth={4} />
      <rect x={398} y={219} width={44} height={22} rx={11} fill={ink.card} stroke={ink.text} strokeWidth={2} />
      <rect x={458} y={219} width={44} height={22} rx={11} fill={ink.card} stroke={ink.text} strokeWidth={2} />
      <rect x={518} y={219} width={44} height={22} rx={11} fill={ink.card} stroke={ink.text} strokeWidth={2} />
      <path d="M 610 230 L 670 185 M 610 230 L 680 232 M 610 230 L 668 280" stroke={ink.text} strokeWidth={3} strokeLinecap="round" />
    </g>
    <g className="d00-in-fade" style={{ ...vars({ d: '1300ms' }), fontFamily: hand, fontWeight: 600, fontSize: 32 }} fill={ink.blue}>
      <text x={30} y={34}>dendrites : reçoivent</text>
      <text x={335} y={335}>corps : additionne</text>
      <text x={450} y={180}>axone : transmet</text>
    </g>
  </svg>
);

const TRACK = 360;
const THRESHOLD = 0.55;

const StimRow = ({ beat, label, level, top }: { beat: number; label: string; level: number; top: number }) => {
  const fires = level >= THRESHOLD;
  return (
    <div className={`d00-on${beat}`} style={{ position: 'absolute', left: 930, top, width: 850, height: 140 }}>
      <Label>{label}</Label>
      <div style={{ position: 'absolute', left: 0, top: 44, width: TRACK, height: 34, boxSizing: 'border-box', border: `1.5px solid ${ink.rule}`, background: ink.sheet }}>
        <div className={`d00-grow${beat}`} style={{ ...vars({ d: '150ms' }), position: 'absolute', left: 0, top: 0, bottom: 0, width: level * TRACK, background: fires ? ink.red : ink.faint }} />
      </div>
      <div style={{ position: 'absolute', left: THRESHOLD * TRACK, top: 32, width: 0, height: 60, borderLeft: `2.5px dashed ${ink.text}` }} />
      <svg width={420} height={110} style={{ position: 'absolute', left: 400, top: 6, overflow: 'visible' }}>
        <line x1={0} y1={55} x2={50} y2={55} stroke={ink.soft} strokeWidth={2.5} />
        <polygon points={head(62, 55, 0, 13)} fill={ink.soft} />
        <path
          d={fires ? 'M 80 92 H 170 L 182 6 L 194 92 H 300' : 'M 80 92 H 300'}
          fill="none"
          stroke={fires ? ink.red : ink.muted}
          strokeWidth={4}
          strokeLinejoin="round"
          pathLength={1}
          className={`d00-draw${beat}`}
          style={vars({ d: '650ms' })}
        />
      </svg>
      <div
        className={`d00-fade${beat}`}
        style={{
          ...vars({ d: '1300ms' }),
          position: 'absolute',
          left: 740,
          top: 30,
          width: 80,
          height: 80,
          display: 'grid',
          placeItems: 'center',
          boxSizing: 'border-box',
          border: `3px solid ${fires ? ink.red : ink.faint}`,
          background: fires ? ink.redSoft : 'transparent',
          fontFamily: typewriter,
          fontSize: 50,
          color: fires ? ink.red : ink.muted,
        }}
      >
        {fires ? 1 : 0}
      </div>
    </div>
  );
};

const AllOrNone: Page = () => (
  <Frame id="allornone" era="1943" eyebrow="Le point de départ" title="Un neurone s'allume… ou pas" beats={3}>
    <NeuronSketch />
    <div className="d00-in-fade" style={{ ...vars({ d: '800ms' }), position: 'absolute', left: 930, top: 300, display: 'flex', gap: 80, fontSize: 22, color: ink.muted }}>
      <span>stimulus reçu (┆ = seuil)</span>
      <span style={{ marginLeft: 48 }}>signal émis</span>
    </div>
    <StimRow beat={1} label="Stimulus faible" level={0.3} top={350} />
    <StimRow beat={2} label="Stimulus moyen" level={0.7} top={510} />
    <StimRow beat={3} label="Stimulus fort" level={0.95} top={670} />
    <div style={{ position: 'absolute', left: L, top: 850, fontFamily: typewriter, fontSize: 44, lineHeight: 1.2, color: 'var(--osd-accent)', textShadow: BLEED }}>
      <Typed text="Tout ou rien : on peut l'écrire 0 ou 1." beat={3} d={1800} step={30} />
    </div>
  </Frame>
);

// ═══ 4 · Le modèle ══════════════════════════════════════════════════════════
const MN = { cx: 600, cy: 290, r: 112 };

const InBox = ({ y, label, children }: { y: number; label: string; children: ReactNode }) => (
  <g>
    <text x={0} y={y + 10} style={{ fontFamily: typewriter, fontSize: 30 }} fill={ink.text}>
      {label}
    </text>
    <rect x={120} y={y - 34} width={70} height={68} fill={ink.sheet} stroke={ink.text} strokeWidth={2.5} />
    <g style={{ fontFamily: typewriter, fontSize: 42 }} textAnchor="middle">
      {children}
    </g>
  </g>
);

const Model: Page = () => (
  <Frame id="model" era="1943" eyebrow="Le modèle de 1943" title="Le neurone formel" beats={3}>
    <svg width={1020} height={640} style={{ position: 'absolute', left: L, top: 300, overflow: 'visible' }}>
      <Wire x={190} y={90} cx={MN.cx} cy={MN.cy} r={MN.r} />
      <Wire x={190} y={230} cx={MN.cx} cy={MN.cy} r={MN.r} />
      <Wire x={190} y={370} cx={MN.cx} cy={MN.cy} r={MN.r} />
      <Wire x={190} y={530} cx={MN.cx} cy={MN.cy} r={MN.r} inhib c={ink.red} />
      <InBox y={90} label="x₁">
        <text x={155} y={104} fill={ink.red}>1</text>
      </InBox>
      <InBox y={230} label="x₂">
        <text x={155} y={244} fill={ink.red}>1</text>
      </InBox>
      <InBox y={370} label="x₃">
        <text x={155} y={384} fill={ink.muted}>0</text>
      </InBox>
      <InBox y={530} label="i">
        <text x={155} y={544} fill={ink.muted} className="d00-off3">0</text>
        <text x={155} y={544} fill={ink.red} className="d00-fade3">1</text>
      </InBox>
      <text x={0} y={600} style={{ fontFamily: hand, fontWeight: 600, fontSize: 28 }} fill={ink.red}>
        entrée inhibitrice
      </text>
      <circle cx={MN.cx} cy={MN.cy} r={MN.r} fill={ink.sheet} stroke={ink.text} strokeWidth={4} />
      <text x={MN.cx} y={MN.cy + 6} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: 52 }} fill={ink.text}>
        Σ ≥ θ
      </text>
      <text x={MN.cx} y={MN.cy + 56} textAnchor="middle" style={{ fontFamily: mono, fontSize: 26 }} fill={ink.muted}>
        θ = 2
      </text>
      <line x1={MN.cx + MN.r} y1={MN.cy} x2={850} y2={MN.cy} stroke={ink.text} strokeWidth={3} />
      <polygon points={head(864, MN.cy, 0, 16)} fill={ink.text} />
      <rect x={870} y={MN.cy - 50} width={110} height={100} fill={ink.sheet} stroke={ink.text} strokeWidth={3} />
      <g textAnchor="middle" style={{ fontFamily: typewriter, fontSize: 64 }}>
        <text x={925} y={MN.cy + 22} fill={ink.faint} className="d00-off2">
          ?
        </text>
        <text x={925} y={MN.cy + 22} fill={ink.red} className="d00-fade2 d00-off3">
          1
        </text>
        <text x={925} y={MN.cy + 22} fill={ink.text} className="d00-fade3">
          0
        </text>
      </g>
      <text x={925} y={MN.cy - 70} textAnchor="middle" style={{ fontFamily: mono, fontSize: 24 }} fill={ink.muted}>
        sortie y
      </text>
      <g className="d00-fade1" style={{ fontFamily: mono, fontSize: 28 }}>
        <text x={MN.cx} y={128} textAnchor="middle" fill={ink.soft}>
          1 + 1 + 0 = 2
        </text>
      </g>
      <g className="d00-fade2 d00-off3" style={{ fontFamily: mono, fontSize: 28 }}>
        <text x={MN.cx} y={470} textAnchor="middle" fill={ink.red}>
          2 ≥ 2 → elle s'allume
        </text>
      </g>
      <g className="d00-fade3" style={{ fontFamily: mono, fontSize: 28 }}>
        <text x={MN.cx} y={470} textAnchor="middle" fill={ink.red}>
          i = 1 → bloquée
        </text>
      </g>
    </svg>
    <Stamp pos={{ left: 1000, top: 700 }} rot={-8} size={46} beat={3} d={300}>
      Bloqué
    </Stamp>
    <ul style={{ position: 'absolute', left: 1250, top: 330, width: 530, margin: 0, padding: 0, listStyle: 'none', fontSize: 27, lineHeight: 1.35 }}>
      <li className="d00-in" style={{ ...vars({ d: '600ms' }), marginBottom: 22 }}>
        – Chaque entrée vaut 0 ou 1.
      </li>
      <li className="d00-in" style={{ ...vars({ d: '800ms' }), marginBottom: 22 }}>
        – Toutes les entrées comptent pareil.
      </li>
      <li className="d00-in" style={{ ...vars({ d: '1000ms' }), marginBottom: 22 }}>
        – Le seuil θ est choisi à la main.
      </li>
      <li className="d00-in" style={{ ...vars({ d: '1200ms' }), marginBottom: 22 }}>
        – Sortie 1 si la somme atteint θ.
      </li>
      <li className="d00-in" style={{ ...vars({ d: '1400ms' }), color: ink.red }}>
        – Une entrée inhibitrice active bloque tout.
      </li>
    </ul>
  </Frame>
);

// ═══ 5 · Des portes logiques ════════════════════════════════════════════════
const GN = { cx: 270, cy: 95, r: 54 };

const TruthRow = ({ cells, out }: { cells: string[]; out: 0 | 1 }) => (
  <div style={{ display: 'flex', height: 50, alignItems: 'center', borderBottom: `1.5px dotted ${ink.faint}`, fontFamily: typewriter, fontSize: 32 }}>
    {cells.map((c, i) => (
      <span key={i} style={{ width: 90, textAlign: 'center' }}>
        {c}
      </span>
    ))}
    <span style={{ width: 50, textAlign: 'center', color: ink.muted }}>→</span>
    <span style={{ width: 90, textAlign: 'center', color: out ? ink.red : ink.muted, fontWeight: 700 }}>{out}</span>
  </div>
);

const GateCard = ({
  x,
  beat,
  name,
  sub,
  theta,
  not,
  note,
  children,
}: {
  x: number;
  beat: number;
  name: string;
  sub: string;
  theta: number;
  not?: boolean;
  note: string;
  children: ReactNode;
}) => (
  <div
    className={beat ? `d00-on${beat}` : 'd00-in'}
    style={{ ...vars({ d: beat ? '0ms' : '500ms' }), position: 'absolute', left: x, top: 310, width: 500, height: 630, padding: '22px 24px', boxSizing: 'border-box', background: ink.sheet, boxShadow: SHADOW }}
  >
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
      <span style={{ fontFamily: typewriter, fontSize: 54, color: ink.red, textShadow: BLEED }}>{name}</span>
      <Label>{sub}</Label>
    </div>
    <svg width={452} height={190} style={{ display: 'block', marginTop: 8, overflow: 'visible' }}>
      {not ? (
        <>
          <Wire x={58} y={95} cx={GN.cx} cy={GN.cy} r={GN.r} inhib c={ink.red} />
          <circle cx={36} cy={95} r={22} fill={ink.sheet} stroke={ink.text} strokeWidth={2.5} />
          <text x={36} y={105} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: 28 }}>
            a
          </text>
        </>
      ) : (
        <>
          <Wire x={58} y={45} cx={GN.cx} cy={GN.cy} r={GN.r} />
          <Wire x={58} y={145} cx={GN.cx} cy={GN.cy} r={GN.r} />
          <circle cx={36} cy={45} r={22} fill={ink.sheet} stroke={ink.text} strokeWidth={2.5} />
          <circle cx={36} cy={145} r={22} fill={ink.sheet} stroke={ink.text} strokeWidth={2.5} />
          <text x={36} y={55} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: 28 }}>
            a
          </text>
          <text x={36} y={155} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: 28 }}>
            b
          </text>
        </>
      )}
      <circle cx={GN.cx} cy={GN.cy} r={GN.r} fill={ink.sheet} stroke={ink.text} strokeWidth={3.5} />
      <text x={GN.cx} y={GN.cy + 11} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: 30 }}>
        θ={theta}
      </text>
      <line x1={GN.cx + GN.r} y1={GN.cy} x2={400} y2={GN.cy} stroke={ink.text} strokeWidth={3} />
      <polygon points={head(414, GN.cy, 0, 14)} fill={ink.text} />
      <text x={440} y={GN.cy + 11} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: 30 }}>
        y
      </text>
    </svg>
    <div style={{ marginTop: 10 }}>{children}</div>
    <div style={{ position: 'absolute', left: 24, right: 24, bottom: 22, fontFamily: hand, fontWeight: 600, fontSize: 30, lineHeight: 1.1, color: ink.blue }}>
      {note}
    </div>
  </div>
);

const Gates: Page = () => (
  <Frame id="gates" era="1943" eyebrow="Des seuils à la logique" title="Un seuil, et voilà une porte logique" beats={2}>
    <GateCard x={170} beat={0} name="ET" sub="les deux à la fois" theta={2} note="il faut 1 + 1 = 2 pour atteindre le seuil">
      <TruthRow cells={['0', '0']} out={0} />
      <TruthRow cells={['0', '1']} out={0} />
      <TruthRow cells={['1', '0']} out={0} />
      <TruthRow cells={['1', '1']} out={1} />
    </GateCard>
    <GateCard x={725} beat={1} name="OU" sub="au moins un" theta={1} note="une seule entrée suffit : 1 ≥ 1">
      <TruthRow cells={['0', '0']} out={0} />
      <TruthRow cells={['0', '1']} out={1} />
      <TruthRow cells={['1', '0']} out={1} />
      <TruthRow cells={['1', '1']} out={1} />
    </GateCard>
    <GateCard x={1280} beat={2} name="NON" sub="l'inverse" theta={0} not note="seuil 0 : toujours allumé… sauf si a l'inhibe">
      <TruthRow cells={['0']} out={1} />
      <TruthRow cells={['1']} out={0} />
    </GateCard>
  </Frame>
);

// ═══ 6 · Combiner : XOR ═════════════════════════════════════════════════════
const XN = {
  a: [80, 150] as const,
  b: [80, 450] as const,
  or: [430, 150] as const,
  and: [430, 450] as const,
  out: [800, 300] as const,
};

const NetNeuron = ({ at, r, title, theta, beat }: { at: readonly [number, number]; r: number; title: string; theta?: number; beat?: number }) => (
  <g>
    <circle cx={at[0]} cy={at[1]} r={r} fill={ink.sheet} stroke={ink.text} strokeWidth={3.5} />
    {beat ? <circle cx={at[0]} cy={at[1]} r={r} fill={ink.blueSoft} stroke={ink.blue} strokeWidth={4.5} className={`d00-fade${beat}`} /> : null}
    <text x={at[0]} y={at[1] + (theta === undefined ? 12 : -2)} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: 34 }} fill={ink.text}>
      {title}
    </text>
    {theta === undefined ? null : (
      <text x={at[0]} y={at[1] + 34} textAnchor="middle" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
        θ = {theta}
      </text>
    )}
  </g>
);

const XorCell = ({ v, col, hot }: { v: 0 | 1; col?: number; hot?: boolean }) => (
  <span className={col ? `d00-fade${col}` : undefined} style={{ width: 96, textAlign: 'center', color: hot && v ? ink.red : v ? ink.text : ink.muted, fontWeight: hot ? 700 : 400 }}>
    {v}
  </span>
);

const XorLine = ({ a, b, or, and, y }: { a: 0 | 1; b: 0 | 1; or: 0 | 1; and: 0 | 1; y: 0 | 1 }) => (
  <div style={{ display: 'flex', height: 62, alignItems: 'center', borderBottom: `1.5px dotted ${ink.faint}`, fontFamily: typewriter, fontSize: 34 }}>
    <XorCell v={a} />
    <XorCell v={b} />
    <XorCell v={or} col={1} />
    <XorCell v={and} col={2} />
    <XorCell v={y} col={3} hot />
  </div>
);

const XorHead = ({ children, col }: { children: ReactNode; col?: number }) => (
  <span className={col ? `d00-fade${col}` : undefined} style={{ width: 96, textAlign: 'center' }}>
    {children}
  </span>
);

const Combine: Page = () => (
  <Frame id="xor" era="1943" eyebrow="Combiner les neurones" title="En les combinant, on calcule tout" beats={3}>
    <svg width={1000} height={600} style={{ position: 'absolute', left: L, top: 320, overflow: 'visible' }}>
      <Wire x={XN.a[0] + 40} y={XN.a[1]} cx={XN.or[0]} cy={XN.or[1]} r={64} />
      <Wire x={XN.b[0] + 36} y={XN.b[1] - 18} cx={XN.or[0]} cy={XN.or[1]} r={64} />
      <Wire x={XN.a[0] + 36} y={XN.a[1] + 18} cx={XN.and[0]} cy={XN.and[1]} r={64} />
      <Wire x={XN.b[0] + 40} y={XN.b[1]} cx={XN.and[0]} cy={XN.and[1]} r={64} />
      <Wire x={XN.or[0] + 64} y={XN.or[1] + 8} cx={XN.out[0]} cy={XN.out[1]} r={72} />
      <Wire x={XN.and[0] + 64} y={XN.and[1] - 8} cx={XN.out[0]} cy={XN.out[1]} r={72} inhib c={ink.red} />
      <NetNeuron at={XN.a} r={40} title="a" />
      <NetNeuron at={XN.b} r={40} title="b" />
      <NetNeuron at={XN.or} r={64} title="OU" theta={1} beat={1} />
      <NetNeuron at={XN.and} r={64} title="ET" theta={2} beat={2} />
      <NetNeuron at={XN.out} r={72} title="y" theta={1} beat={3} />
      <line x1={872} y1={300} x2={940} y2={300} stroke={ink.text} strokeWidth={3} />
      <polygon points={head(954, 300, 0, 15)} fill={ink.text} />
      <g style={{ fontFamily: hand, fontWeight: 600, fontSize: 30 }} fill={ink.blue}>
        <text x={510} y={70} className="d00-fade1">
          au moins un
        </text>
        <text x={510} y={548} className="d00-fade2">
          les deux
        </text>
        <text x={640} y={430} className="d00-fade3" fill={ink.red}>
          …l'inhibe
        </text>
      </g>
    </svg>
    <div style={{ position: 'absolute', left: 1240, top: 330, width: 480 }}>
      <div style={{ display: 'flex', height: 52, alignItems: 'center', fontWeight: 700, fontSize: 22, letterSpacing: '0.1em', color: ink.muted, borderBottom: `2px solid ${ink.text}` }}>
        <XorHead>a</XorHead>
        <XorHead>b</XorHead>
        <XorHead col={1}>OU</XorHead>
        <XorHead col={2}>ET</XorHead>
        <XorHead col={3}>
          <span style={{ color: ink.red }}>y</span>
        </XorHead>
      </div>
      <XorLine a={0} b={0} or={0} and={0} y={0} />
      <XorLine a={0} b={1} or={1} and={0} y={1} />
      <XorLine a={1} b={0} or={1} and={0} y={1} />
      <XorLine a={1} b={1} or={1} and={1} y={0} />
    </div>
    <div className="d00-on3" style={{ ...vars({ d: '500ms' }), position: 'absolute', left: 1240, top: 680, width: 540 }}>
      <div style={{ fontFamily: typewriter, fontSize: 36, lineHeight: 1.2, color: 'var(--osd-accent)', textShadow: BLEED }}>y = XOR(a, b)</div>
      <div style={{ marginTop: 14, fontFamily: hand, fontWeight: 600, fontSize: 30, lineHeight: 1.15, color: ink.blue }}>
        XOR fera trébucher le Perceptron (dossier 1)… mais câblé à la main, c'est facile.
      </div>
    </div>
  </Frame>
);

// ═══ 7 · Une boucle, une mémoire ════════════════════════════════════════════
const LN = { cx: 420, cy: 300, r: 82 };
const T_STEPS = [0, 1, 2, 3, 4, 5, 6, 7];

const TimeCell = ({ v, beat, hot }: { v: 0 | 1; beat?: number; hot?: boolean }) => (
  <span
    className={beat ? `d00-fade${beat}` : undefined}
    style={{
      width: 72,
      height: 56,
      display: 'grid',
      placeItems: 'center',
      boxSizing: 'border-box',
      border: `1.5px solid ${ink.rule}`,
      background: v ? (hot ? ink.redSoft : ink.blueSoft) : ink.sheet,
      fontFamily: typewriter,
      fontSize: 30,
      color: v ? (hot ? ink.red : ink.blue) : ink.faint,
    }}
  >
    {v}
  </span>
);

const TimeRow = ({ label, beat, children }: { label: string; beat?: number; children: ReactNode }) => (
  <div className={beat ? `d00-on${beat}` : undefined} style={{ display: 'flex', alignItems: 'center', marginTop: 18 }}>
    <span style={{ width: 150, flex: 'none' }}>
      <Label>{label}</Label>
    </span>
    {children}
  </div>
);

const Loop: Page = () => (
  <Frame id="loop" era="1943" eyebrow="Réseaux en boucle" title="Une boucle, et le réseau se souvient" beats={3}>
    <svg width={820} height={620} style={{ position: 'absolute', left: L - 40, top: 300, overflow: 'visible' }}>
      <line x1={70} y1={LN.cy} x2={LN.cx - LN.r - 4} y2={LN.cy} stroke={ink.text} strokeWidth={3} />
      <polygon points={head(LN.cx - LN.r - 2, LN.cy, 0, 15)} fill={ink.text} />
      <line x1={70} y1={LN.cy} x2={LN.cx - LN.r - 4} y2={LN.cy} stroke={ink.blue} strokeWidth={6} className="d00-fade1" />
      <text x={70} y={LN.cy - 22} style={{ fontFamily: mono, fontSize: 24 }} fill={ink.soft}>
        impulsion
      </text>
      <path d={`M ${LN.cx + LN.r} ${LN.cy} H 640 C 720 300, 720 90, 560 90 C 480 90, 450 150, ${LN.cx + 30} ${LN.cy - LN.r + 6}`} fill="none" stroke={ink.text} strokeWidth={3} />
      <polygon points={head(LN.cx + 30, LN.cy - LN.r + 4, 118, 15)} fill={ink.text} />
      <path
        d={`M ${LN.cx + LN.r} ${LN.cy} H 640 C 720 300, 720 90, 560 90 C 480 90, 450 150, ${LN.cx + 30} ${LN.cy - LN.r + 6}`}
        fill="none"
        stroke={ink.blue}
        strokeWidth={6}
        strokeDasharray="14 10"
        className="d00-fade2 d00-back"
      />
      <Wire x={LN.cx} y={560} cx={LN.cx} cy={LN.cy} r={LN.r} inhib c={ink.red} w={3} />
      <line x1={LN.cx} y1={560} x2={LN.cx} y2={LN.cy + LN.r + 20} stroke={ink.red} strokeWidth={6} className="d00-fade3" />
      <text x={LN.cx + 20} y={580} style={{ fontFamily: mono, fontSize: 24 }} fill={ink.red}>
        reset (inhibitrice)
      </text>
      <circle cx={LN.cx} cy={LN.cy} r={LN.r} fill={ink.sheet} stroke={ink.text} strokeWidth={4} />
      <circle cx={LN.cx} cy={LN.cy} r={LN.r} fill={ink.blueSoft} stroke={ink.blue} strokeWidth={5} className="d00-fade1 d00-off3" />
      <text x={LN.cx} y={LN.cy + 12} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: 38 }}>
        θ = 1
      </text>
      <line x1={640} y1={LN.cy} x2={760} y2={LN.cy} stroke={ink.text} strokeWidth={3} />
      <polygon points={head(774, LN.cy, 0, 15)} fill={ink.text} />
      <text x={800} y={LN.cy + 12} style={{ fontFamily: typewriter, fontSize: 38 }}>
        y
      </text>
      <text x={590} y={70} className="d00-fade2" style={{ fontFamily: hand, fontWeight: 600, fontSize: 32 }} fill={ink.blue}>
        la sortie se réalimente
      </text>
    </svg>
    <div className="d00-in" style={{ ...vars({ d: '500ms' }), position: 'absolute', left: 1040, top: 330 }}>
      <div style={{ display: 'flex', marginLeft: 150 }}>
        {T_STEPS.map((t) => (
          <span key={t} style={{ width: 72, textAlign: 'center', fontSize: 21, color: ink.muted }}>
            t{t}
          </span>
        ))}
      </div>
      <TimeRow label="Impulsion">
        <TimeCell v={0} />
        <TimeCell v={1} />
        <TimeCell v={0} />
        <TimeCell v={0} />
        <TimeCell v={0} />
        <TimeCell v={0} />
        <TimeCell v={0} />
        <TimeCell v={0} />
      </TimeRow>
      <TimeRow label="Reset" beat={3}>
        <TimeCell v={0} />
        <TimeCell v={0} />
        <TimeCell v={0} />
        <TimeCell v={0} />
        <TimeCell v={0} />
        <TimeCell v={1} hot />
        <TimeCell v={0} />
        <TimeCell v={0} />
      </TimeRow>
      <TimeRow label="Sortie y">
        <TimeCell v={0} />
        <TimeCell v={0} />
        <TimeCell v={1} beat={1} />
        <TimeCell v={1} beat={2} />
        <TimeCell v={1} beat={2} />
        <TimeCell v={1} beat={2} />
        <TimeCell v={0} beat={3} />
        <TimeCell v={0} beat={3} />
      </TimeRow>
    </div>
    <div className="d00-in-fade" style={{ ...vars({ d: '900ms' }), position: 'absolute', left: 1040, top: 610, width: 740, fontSize: 24, lineHeight: 1.4, color: ink.muted }}>
      Chaque neurone répond au pas de temps suivant.
    </div>
    <div style={{ position: 'absolute', left: 1040, top: 700, width: 740, fontFamily: typewriter, fontSize: 40, lineHeight: 1.25, color: 'var(--osd-accent)', textShadow: BLEED }}>
      <Typed text={'Une mémoire d’un bit, faite\nuniquement de neurones.'} beat={2} d={900} step={26} />
    </div>
  </Frame>
);

// ═══ 8 · La descendance ═════════════════════════════════════════════════════
const HeirCard = ({
  x,
  beat,
  year,
  who,
  children,
  arrow,
}: {
  x: number;
  beat: number;
  year: string;
  who: string;
  children: ReactNode;
  arrow: ReactNode;
}) => (
  <div
    className={beat ? `d00-on${beat}` : 'd00-in'}
    style={{ ...vars({ d: beat ? '0ms' : '500ms' }), position: 'absolute', left: x, top: 320, width: 500, height: 560, padding: '26px 30px', boxSizing: 'border-box', background: ink.sheet, boxShadow: SHADOW }}
  >
    <div style={{ fontFamily: typewriter, fontSize: 64, lineHeight: 1, color: ink.red, textShadow: BLEED }}>{year}</div>
    <div style={{ marginTop: 12 }}>
      <Label>{who}</Label>
    </div>
    <div style={{ marginTop: 22, fontSize: 27, lineHeight: 1.45, color: ink.soft }}>{children}</div>
    <div style={{ position: 'absolute', left: 30, right: 30, bottom: 26, paddingTop: 16, borderTop: `1.5px dashed ${ink.rule}`, fontFamily: hand, fontWeight: 600, fontSize: 32, lineHeight: 1.1, color: ink.blue }}>
      {arrow}
    </div>
  </div>
);

const Legacy: Page = () => (
  <Frame id="legacy" era="1945–2026" eyebrow="Une descendance inattendue" title="Le neurone formel a fait des petits" beats={2}>
    <HeirCard x={170} beat={0} year="1945" who="John von Neumann" arrow="→ l'architecture de nos ordinateurs">
      Pour décrire les circuits de l'EDVAC, l'un des premiers ordinateurs à programme enregistré, il emprunte les « neurones » de McCulloch et Pitts.
    </HeirCard>
    <HeirCard x={725} beat={1} year="1956" who="Stephen Kleene" arrow={<>→ les regex : <span style={{ fontFamily: mono, fontSize: 26 }}>^[0-9]+$</span></>}>
      Il étudie ce que ces réseaux de neurones savent reconnaître et invente pour cela les expressions régulières.
    </HeirCard>
    <HeirCard x={1280} beat={2} year="Auj." who="Les réseaux modernes" arrow="→ ChatGPT inclus">
      Chaque neurone artificiel reste une somme suivie d'un seuil, simplement adouci en courbe.
    </HeirCard>
  </Frame>
);

// ═══ 9 · La pièce manquante ═════════════════════════════════════════════════
const HandMade = ({ q, a, top, d }: { q: string; a: string; top: number; d: number }) => (
  <div className="d00-in" style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: L, top, width: 760, display: 'flex', alignItems: 'baseline', gap: 18, paddingBottom: 14, borderBottom: `1.5px dotted ${ink.faint}` }}>
    <span style={{ width: 330, flex: 'none', fontFamily: typewriter, fontSize: 36, textShadow: BLEED }}>{q}</span>
    <span style={{ fontSize: 28, color: ink.red, fontWeight: 700 }}>{a}</span>
  </div>
);

const Missing: Page = () => (
  <Frame id="missing" era="1943" eyebrow="La pièce manquante" title="Mais il ne sait rien apprendre" beats={2}>
    <HandMade q="Les connexions ?" a="câblées à la main" top={340} d={500} />
    <HandMade q="Les seuils ?" a="choisis à la main" top={440} d={700} />
    <HandMade q="Les poids ?" a="tous égaux" top={540} d={900} />
    <Stamp pos={{ left: 330, top: 660 }} rot={-7} size={58} d={1500}>
      Fait main
    </Stamp>
    <div
      className="d00-on1"
      style={{ position: 'absolute', left: 1040, top: 330, width: 740, padding: '24px 30px', boxSizing: 'border-box', background: ink.sheet, boxShadow: SHADOW, borderLeft: `6px solid ${ink.blue}` }}
    >
      <Label c={ink.blue}>1949 · Donald Hebb, psychologue</Label>
      <div style={{ marginTop: 14, fontFamily: typewriter, fontSize: 34, lineHeight: 1.3, textShadow: BLEED }}>
        Quand un neurone en active souvent un autre, leur connexion se renforce.
      </div>
      <div style={{ marginTop: 14, fontSize: 24, color: ink.soft }}>Première idée d'un apprentissage par les connexions.</div>
    </div>
    <div className="d00-on2" style={{ position: 'absolute', left: 1040, top: 700, width: 740 }}>
      <div style={{ fontSize: 28, lineHeight: 1.45 }}>
        <b>1957</b> : Rosenblatt donne aux connexions des <b>poids réglables</b>… et une règle pour les apprendre à partir d'exemples.
      </div>
    </div>
    <Stamp pos={{ left: 1300, top: 850 }} rot={-6} size={36} beat={2} d={600}>
      Suite : dossier nº 01
    </Stamp>
  </Frame>
);

// ═══ 10 · Ce qu'il faut retenir ═════════════════════════════════════════════
const Lesson: Page = () => (
  <Frame id="lesson" eyebrow="Ce qu'il faut retenir" beats={1}>
    <div className="d00-in-fade" style={{ position: 'absolute', left: L - 16, top: 170, fontFamily: typewriter, fontSize: 300, lineHeight: 1, color: ink.rule }}>
      «
    </div>
    <div style={{ position: 'absolute', left: L, top: 370, fontFamily: typewriter, fontSize: 76, lineHeight: 1.22, textShadow: BLEED }}>
      <Typed text="Un neurone, c'est un seuil." d={400} step={34} />
    </div>
    <div style={{ position: 'absolute', left: L, top: 490, fontFamily: typewriter, fontSize: 76, lineHeight: 1.22, textShadow: BLEED }}>
      <Typed text="Un réseau de seuils, " beat={1} step={30} />
      <span style={{ color: 'var(--osd-accent)' }}>
        <Mark beat={1} d={1300}>
          <Typed text="c'est de la logique" beat={1} d={630} step={30} />
        </Mark>
      </span>
      <Typed text="." beat={1} d={1200} step={30} />
    </div>
    <SeriesNav left={L} top={720} d={800} />
    <Credits top={962}>Photo : Walter Pitts, 1954, par Francis Bello — domaine public, via Wikimedia Commons.</Credits>
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

const STYLE_ID = 'osd-styles-ai-history-00-neurone-formel';
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
  title: "Le neurone formel : le premier modèle mathématique du neurone",
  createdAt: '2026-10-07T23:45:28.815Z',
};

export const notes: (string | undefined)[] = [
  `Premier dossier de la série, le numéro zéro : avant même les machines qui apprennent, il fallait une idée simple. Un neurone peut se décrire comme un calcul.
Laisser la carte perforée se remplir : ses trous encodent « NEURONE FORMEL 1943 ».`,
  `Chicago, 1943. Deux hommes très différents : Warren McCulloch, neurophysiologiste de 44 ans, et Walter Pitts, logicien autodidacte d'à peine 20 ans, qui n'a jamais obtenu de diplôme.
Leur question : et si le cerveau n'était qu'une machine qui calcule ?
Clic : leur article de décembre 1943, « Un calcul logique des idées immanentes à l'activité nerveuse ».`,
  `Leur point de départ est un fait connu des biologistes : un neurone fonctionne en tout ou rien.
Les dendrites reçoivent, le corps additionne, l'axone transmet.
Clic 1 : stimulus faible, sous le seuil : rien. Clic 2 : au-dessus du seuil : une impulsion. Clic 3 : stimulus plus fort : la même impulsion, pas plus grande.
Donc on peut l'écrire 0 ou 1.`,
  `Le modèle de 1943. Des entrées à 0 ou 1, toutes de même importance, et un seuil θ fixé à la main.
Clic 1 : on additionne : 2. Clic 2 : 2 atteint le seuil, le neurone s'allume.
Clic 3 : particularité du modèle, une entrée inhibitrice active bloque tout, quelle que soit la somme.`,
  `Avec ce seul mécanisme, on fabrique les portes logiques.
ET : seuil 2, il faut les deux entrées. Clic 1 : OU, seuil 1, une seule suffit. Clic 2 : NON, seuil 0 : le neurone est allumé sauf si l'entrée l'inhibe.`,
  `Et en combinant les portes, on calcule n'importe quelle fonction logique.
Exemple : XOR, vrai quand les deux entrées diffèrent.
Clic 1 : un neurone OU. Clic 2 : un neurone ET. Clic 3 : la sortie s'allume avec OU, sauf si ET l'inhibe : c'est exactement XOR.
Clin d'œil : XOR posera un gros problème au Perceptron en 1969, parce qu'il devra l'apprendre seul. Ici, on le câble à la main.`,
  `McCulloch et Pitts étudient aussi des réseaux avec des boucles.
Clic 1 : une impulsion allume le neurone. Clic 2 : sa sortie revient sur sa propre entrée : il reste allumé, même quand l'impulsion a disparu. C'est une mémoire d'un bit.
Clic 3 : une entrée inhibitrice remet la mémoire à zéro.`,
  `L'article a une descendance inattendue.
1945 : von Neumann reprend ces « neurones » pour décrire les circuits de l'EDVAC, l'un des premiers ordinateurs à programme enregistré.
Clic 1 : 1956, Kleene étudie ce que ces réseaux reconnaissent et invente les expressions régulières, les regex qu'on utilise encore.
Clic 2 : aujourd'hui, chaque neurone artificiel reste une somme suivie d'un seuil adouci.`,
  `Mais il manque l'essentiel : tout est réglé à la main. Les connexions, les seuils, et tous les poids sont égaux.
Clic 1 : en 1949, Donald Hebb propose une idée d'apprentissage : quand un neurone en active souvent un autre, leur connexion se renforce.
Clic 2 : en 1957, Rosenblatt donnera aux connexions des poids réglables et une règle pour les apprendre. C'est le dossier 1.`,
  `À retenir : un neurone, c'est un seuil. Clic : un réseau de seuils, c'est de la logique.
Liens vers le sommaire et vers le dossier suivant, le Perceptron.`,
];

export default [Cover, Duo, AllOrNone, Model, Gates, Combine, Loop, Legacy, Missing, Lesson] satisfies Page[];
