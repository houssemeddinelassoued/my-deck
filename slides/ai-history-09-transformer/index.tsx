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
import imgTransformer from '@assets/ai-history/transformer.png';

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
const FONT_LINK_ID = 'osd-webfont-ai-history-09-transformer';
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
const has = (n: number) => `.d09-page:has([data-osd-step="revealed"] > .d09-k${n})`;

CSS.push(`
@keyframes d09-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes d09-fade{from{opacity:0}to{opacity:1}}
@keyframes d09-type{from{opacity:0}to{opacity:1}}
@keyframes d09-draw{from{stroke-dashoffset:1.01}to{stroke-dashoffset:0}}
@keyframes d09-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes d09-pop{0%{opacity:0;transform:scale(.3)}60%{opacity:1;transform:scale(1.15)}100%{opacity:1;transform:scale(1)}}
@keyframes d09-stamp{0%{opacity:0;transform:rotate(var(--r,0deg)) scale(1.9)}35%{opacity:1}70%{transform:rotate(var(--r,0deg)) scale(.94)}100%{opacity:1;transform:rotate(var(--r,0deg)) scale(1)}}
@keyframes d09-blink{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes d09-spin{to{transform:rotate(360deg)}}
@keyframes d09-scan{0%{transform:translateY(0);opacity:0}8%{opacity:.75}92%{opacity:.75}100%{transform:translateY(var(--h,400px));opacity:0}}
@keyframes d09-back{to{stroke-dashoffset:36}}
.d09-stamp{transform:rotate(var(--r,0deg))}
.d09-in-draw{stroke-dasharray:1 2}
.d09-in-pop,.d09-pop{transform-box:fill-box;transform-origin:center}
.d09-in-grow{transform-origin:left center}
.d09-live .d09-in{animation:d09-rise 800ms ${EASE} var(--d,0ms) both}
.d09-live .d09-in-fade{animation:d09-fade 900ms ${EASE} var(--d,0ms) both}
.d09-live .d09-in-draw{animation:d09-draw 1300ms ${EASE} var(--d,0ms) both}
.d09-live .d09-in-grow{animation:d09-grow 600ms ${EASE} var(--d,0ms) both}
.d09-live .d09-in-pop{animation:d09-pop 520ms ${EASE} var(--d,0ms) both}
.d09-live .d09-in-st{animation:d09-stamp 480ms ${EASE_OUT} var(--d,0ms) both}
.d09-live .d09-ty0 .d09-c{animation:d09-type 40ms linear var(--d,0ms) both}
.d09-live .d09-lamp{animation:d09-blink var(--t,1.4s) steps(1,end) var(--d,0ms) infinite}
.d09-reel{transform-box:fill-box;transform-origin:center}
.d09-live .d09-reel{animation:d09-spin var(--t,8s) linear infinite}
.d09-scan{opacity:0}
.d09-live .d09-scan{animation:d09-scan 3.4s ease-in-out var(--d,0ms) infinite}
.d09-live .d09-back{animation:d09-back 900ms linear infinite}
@media (prefers-reduced-motion: reduce){.d09-page *{animation:none !important;transition:none !important}}
`);

// Beat utilities — visible from beat n: on (rise) / fade / typed text / stamp
// (thunk) / grow; hidden from beat n: off; stroke drawn at beat n: draw (path
// needs pathLength={1}); faded back at beat n: dim.
for (let n = 1; n <= 6; n++) {
  const at = has(n);
  CSS.push(`
.d09-on${n}{opacity:0;transform:translateY(14px);transition:opacity 500ms ${EASE} var(--d,0ms),transform 700ms ${EASE} var(--d,0ms)}
${at} .d09-on${n}{opacity:1;transform:none}
.d09-fade${n}{opacity:0;transition:opacity 550ms ${EASE} var(--d,0ms)}
${at} .d09-fade${n}{opacity:1}
.d09-ty${n} .d09-c{opacity:0}
${at} .d09-ty${n} .d09-c{opacity:1;transition:opacity 40ms linear var(--d,0ms)}
.d09-st${n}{opacity:0;transform:rotate(var(--r,0deg)) scale(1.9);transition:opacity 120ms linear var(--d,0ms),transform 440ms ${THUNK} var(--d,0ms)}
${at} .d09-st${n}{opacity:1;transform:rotate(var(--r,0deg)) scale(1)}
.d09-grow${n}{transform:scaleX(0);transform-origin:left center;transition:transform 600ms ${EASE} var(--d,0ms)}
${at} .d09-grow${n}{transform:scaleX(1)}
.d09-off${n}{transition:opacity 380ms ${EASE}}
${at} .d09-off${n}{opacity:0}
.d09-draw${n}{stroke-dasharray:1 2;stroke-dashoffset:1.01;transition:stroke-dashoffset 1000ms ${EASE} var(--d,0ms)}
${at} .d09-draw${n}{stroke-dashoffset:0}
.d09-dim${n}{transition:opacity 500ms ${EASE}}
${at} .d09-dim${n}{opacity:.22}
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
          <i className={`d09-k${i + 1}`} />
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
    className={`d09-stamp ${beat ? `d09-st${beat}` : 'd09-in-st'}`}
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
    <span className={`d09-ty${beat}`}>
      {Array.from(text).map((ch, k) =>
        ch === '\n' ? (
          <br key={k} />
        ) : (
          <span key={k} className="d09-c" style={vars({ d: `${d + i++ * step}ms` })}>
            {ch}
          </span>
        ),
      )}
    </span>
  );
};

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div
    className="d09-in-fade"
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
      className={`d09-page d09-${id}${live ? ' d09-live' : ''}`}
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
  className = 'd09-in-fade',
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
        className={beat ? `d09-draw${beat}` : 'd09-in-draw'}
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
  "id": "ai-history-09-transformer",
  "n": 9,
  "short": "Le Transformer",
  "footer": "Le Transformer — l'attention suffit",
  "title": "Le Transformer",
  "subtitle": "« Attention Is All You Need »",
  "lede": "2017 : huit chercheurs de Google proposent de lire tous les mots à la fois. Tous les grands modèles de langage en descendent.",
  "year": "2017",
  "card": "TRANSFORMER 2017",
  "metaTitle": "Le Transformer : « Attention Is All You Need »",
  "next": {
    "n": 10,
    "title": "ChatGPT & l'IA générative",
    "id": "ai-history-10-chatgpt"
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
      <rect key={i} x={pcX(c) - 4.5} y={pcY(r) - 7.5} width={9} height={15} rx={1.5} fill={ink.hole} className="d09-in-pop" style={vars({ d: `${2900 + c * 80}ms` })} />
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
  <div className="d09-in-fade" style={{ ...vars({ d: '3300ms' }), position: 'absolute', left: 1190, top: 668, width: 590, height: 262 }}>
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
      className="d09-in-fade"
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
        fontSize: 146,
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
      className="d09-in"
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
    <div className="d09-in" style={{ ...vars({ d: '2700ms' }), position: 'absolute', left: L, top: 636 }}>
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
  <div className="d09-in" style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left, top, display: 'flex', gap: 28 }}>
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
  <div className={beat ? `d09-on${beat}` : 'd09-in'} style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: x, top: y, width: w + 16 }}>
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
  <div className={beat ? `d09-on${beat}` : 'd09-in'} style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: x, top: y, width: w, height: h }}>
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
  <div className="d09-in-fade" style={{ ...vars({ d: '1500ms' }), position: 'absolute', left: L, right: RIGHT, top, fontSize: 15, lineHeight: 1.35, color: ink.muted }}>
    {children}
  </div>
);

// ═══ 2 · Le point de départ ═════════════════════════════════════════════════
const SeqWord = ({ i, w, beat }: { i: number; w: string; beat: number }) => (
  <div className={beat ? `d09-on${beat}` : 'd09-in'} style={{ ...vars({ d: beat ? `${i * 220}ms` : `${400 + i * 220}ms` }), display: 'flex', alignItems: 'center' }}>
    <span style={{ padding: '10px 18px', background: ink.sheet, border: `2.5px solid ${ink.text}`, fontFamily: typewriter, fontSize: 32 }}>{w}</span>
    {i < 4 ? <span style={{ width: 50, height: 3, background: ink.red }} /> : null}
  </div>
);

const Start: Page = () => (
  <Frame id="start" era="2016" eyebrow="Le point de départ (dossier 7)" title="Les réseaux récurrents lisent un mot à la fois" beats={2}>
    <div style={{ position: 'absolute', left: L, top: 350, display: 'flex' }}>
      <SeqWord i={0} w="le" beat={0} />
      <SeqWord i={1} w="chat" beat={0} />
      <SeqWord i={2} w="dort" beat={0} />
      <SeqWord i={3} w="sur" beat={0} />
      <SeqWord i={4} w="le canapé" beat={0} />
    </div>
    <Hand x={L + 10} y={440} w={1000} rot={-1} size={30} d={1700}>
      chaque mot attend le précédent
    </Hand>
    <div className="d09-on1" style={{ position: 'absolute', left: L, top: 560, width: 1000, fontSize: 28, lineHeight: 1.5 }}>
      <b>Lent</b> : impossible de répartir le travail sur les milliers de cœurs d'une carte graphique.
    </div>
    <div className="d09-on2" style={{ position: 'absolute', left: L, top: 680, width: 1000, fontSize: 28, lineHeight: 1.5 }}>
      <b>Oublieux</b> : le début d'un long texte s'estompe dans la mémoire.
    </div>
  </Frame>
);

// ═══ 3 · L'attention, d'abord un complément ═════════════════════════════════
const SRC = ['the', 'cat', 'is', 'sleeping'];
const AW = [0.06, 0.82, 0.04, 0.08];
const Bahdanau: Page = () => (
  <Frame id="bahdanau" era="2014" eyebrow="Une première idée, en 2014" title="L'attention : regarder où il faut" beats={2}>
    <svg width={1100} height={480} style={{ position: 'absolute', left: L, top: 320, overflow: 'visible' }}>
      {SRC.map((w, i) => (
        <g key={w} className="d09-in" style={vars({ d: `${300 + i * 120}ms` })}>
          <rect x={i * 260} y={30} width={220} height={74} fill={ink.sheet} stroke={ink.text} strokeWidth={2.5} />
          <text x={i * 260 + 110} y={78} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: 32 }}>
            {w}
          </text>
        </g>
      ))}
      <g className="d09-fade1">
        {SRC.map((_, i) => (
          <line key={i} x1={i * 260 + 110} y1={104} x2={390} y2={330} stroke={ink.red} strokeWidth={2 + AW[i] * 22} opacity={0.35 + AW[i] * 0.65} />
        ))}
        {SRC.map((_, i) => (
          <text key={`t${i}`} x={i * 260 + 110} y={18} textAnchor="middle" style={{ fontFamily: mono, fontSize: 22, fontWeight: 700 }} fill={ink.red}>
            {Math.round(AW[i] * 100)} %
          </text>
        ))}
      </g>
      <g className="d09-in" style={vars({ d: '800ms' })}>
        <rect x={280} y={330} width={220} height={74} fill={ink.redSoft} stroke={ink.red} strokeWidth={3} />
        <text x={390} y={378} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: 32 }} fill={ink.red}>
          chat
        </text>
        <text x={390} y={450} textAnchor="middle" style={{ fontFamily: hand, fontWeight: 600, fontSize: 30 }} fill={ink.blue}>
          le mot en cours de traduction
        </text>
      </g>
    </svg>
    <div className="d09-in" style={{ ...vars({ d: '600ms' }), position: 'absolute', left: 1330, top: 340, width: 450, fontSize: 26, lineHeight: 1.5 }}>
      Bahdanau, Cho et Bengio : pour écrire chaque mot, le traducteur relit toute la phrase d'origine…
    </div>
    <div className="d09-on1" style={{ position: 'absolute', left: 1330, top: 520, width: 450, fontSize: 26, lineHeight: 1.5 }}>
      … et donne un <b style={{ color: ink.red }}>poids</b> à chaque mot : ici, presque tout sur « cat ».
    </div>
    <div className="d09-on2" style={{ position: 'absolute', left: 1330, top: 700, width: 450, fontSize: 26, lineHeight: 1.5, color: ink.soft }}>
      Mais l'attention reste un ajout à un réseau récurrent, qui lit toujours mot à mot.
    </div>
  </Frame>
);

// ═══ 4 · L'article ══════════════════════════════════════════════════════════
const Article: Page = () => (
  <Frame id="paper" era="2017" eyebrow="Juin 2017 · Google" title="« L'attention est tout ce dont vous avez besoin »" beats={2}>
    <div className="d09-in" style={{ ...vars({ d: '300ms' }), position: 'absolute', left: L, top: 320, width: 900, height: 520 }}>
      <div style={{ width: '100%', height: '100%', padding: '34px 46px', boxSizing: 'border-box', background: '#fbf6ea', boxShadow: SHADOW, transform: 'rotate(-0.8deg)' }}>
        <div style={{ textAlign: 'center', fontFamily: '"Courier Prime", Georgia, serif', fontWeight: 700, fontSize: 40 }}>Attention Is All You Need</div>
        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 21, lineHeight: 1.6, color: ink.soft }}>
          Ashish Vaswani · Noam Shazeer · Niki Parmar · Jakob Uszkoreit
          <br />
          Llion Jones · Aidan N. Gomez · Łukasz Kaiser · Illia Polosukhin
        </div>
        <div style={{ marginTop: 24, height: 2, background: ink.rule }} />
        <div style={{ marginTop: 20, fontSize: 21, fontWeight: 700, letterSpacing: '0.12em', color: ink.muted }}>ABSTRACT</div>
        <div style={{ marginTop: 10, fontSize: 22, lineHeight: 1.55 }}>
          « We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions
          entirely. »
        </div>
        <div style={{ marginTop: 14, fontSize: 20, fontStyle: 'italic', color: ink.muted }}>
          « …fondée uniquement sur l'attention, sans récurrence ni convolution. »
        </div>
      </div>
    </div>
    <div className="d09-on1" style={{ position: 'absolute', left: 1150, top: 340, width: 630, fontSize: 27, lineHeight: 1.5 }}>
      Huit chercheurs de Google Brain et Google Research. L'article est présenté à la conférence NeurIPS en décembre 2017.
    </div>
    <div className="d09-on2" style={{ position: 'absolute', left: 1150, top: 540, width: 630 }}>
      <div style={{ fontFamily: typewriter, fontSize: 38, lineHeight: 1.25, color: 'var(--osd-accent)', textShadow: BLEED }}>
        L'idée audacieuse : supprimer la lecture mot à mot.
      </div>
      <div style={{ marginTop: 14, fontSize: 26, lineHeight: 1.5, color: ink.soft }}>Il ne reste que l'attention.</div>
    </div>
    <Stamp pos={{ left: 1250, top: 760 }} rot={-6} size={44} d={1600}>
      Article culte
    </Stamp>
  </Frame>
);

// ═══ 5 · Chaque mot regarde tous les autres ═════════════════════════════════
const SENT = ["L'animal", "n'a", 'pas', 'traversé', 'la', 'rue', 'car', 'il', 'était', 'trop', 'fatigué'];
const W_TIRED = [0.62, 0.02, 0.01, 0.06, 0.01, 0.12, 0.02, 0.0, 0.04, 0.03, 0.07];
const W_WIDE = [0.1, 0.02, 0.01, 0.06, 0.03, 0.66, 0.02, 0.0, 0.04, 0.03, 0.03];
const WX = (i: number) => i * 150;

const Links = ({ w, className }: { w: number[]; className: string }) => (
  <g className={className}>
    {w.map((v, i) =>
      i === 7 || v < 0.02 ? null : (
        <path key={i} d={`M ${WX(7) + 60} 104 C ${WX(7) + 60} 40, ${WX(i) + 60} 40, ${WX(i) + 60} 104`} fill="none" stroke={ink.red} strokeWidth={2 + v * 14} opacity={0.3 + v * 0.7} />
      ),
    )}
  </g>
);

const WordRow = ({ last, hot }: { last: string; hot: number }) => (
  <>
    {SENT.map((w, i) => (
      <g key={i}>
        <text
          x={WX(i) + 60}
          y={140}
          textAnchor="middle"
          style={{ fontFamily: typewriter, fontSize: 30 }}
          fill={i === 7 ? ink.blue : i === hot ? ink.red : ink.text}
        >
          {i === 10 ? last : w}
        </text>
      </g>
    ))}
  </>
);

const SelfAttention: Page = () => (
  <Frame id="self" era="2017" eyebrow="L'auto-attention" title="Chaque mot regarde tous les autres, d'un coup" beats={2}>
    <svg width={1650} height={260} style={{ position: 'absolute', left: L - 10, top: 330, overflow: 'visible' }}>
      <g className="d09-off2">
        <WordRow last="fatigué" hot={0} />
      </g>
      <g className="d09-fade2">
        <WordRow last="large" hot={5} />
      </g>
      <Links w={W_TIRED} className="d09-fade1 d09-off2" />
      <Links w={W_WIDE} className="d09-fade2" />
      <rect x={WX(7) + 20} y={150} width={80} height={6} fill={ink.blue} />
    </svg>
    <div className="d09-in" style={{ ...vars({ d: '600ms' }), position: 'absolute', left: L, top: 640, width: CW, fontSize: 28, lineHeight: 1.5 }}>
      À quoi renvoie « <b style={{ color: ink.blue }}>il</b> » ? Le modèle compare « il » à chacun des autres mots et calcule un poids pour chacun.
    </div>
    <div className="d09-on1" style={{ position: 'absolute', left: L, top: 740, width: CW, fontSize: 28, lineHeight: 1.5 }}>
      « … trop <b>fatigué</b> » : l'attention de « il » se porte surtout sur <b style={{ color: ink.red }}>l'animal</b>.
    </div>
    <div className="d09-on2" style={{ position: 'absolute', left: L, top: 820, width: CW, fontSize: 28, lineHeight: 1.5 }}>
      « … trop <b>large</b> » : elle bascule vers <b style={{ color: ink.red }}>la rue</b>. Le sens de chaque mot dépend de toute la phrase.
    </div>
    <Hand x={1300} y={560} w={480} rot={-2} size={28} d={1200}>
      exemple célèbre ; poids illustratifs
    </Hand>
  </Frame>
);

// ═══ 6 · Requête, clé, valeur ═══════════════════════════════════════════════
const QKV = ({ x, beat, k, name, what, c }: { x: number; beat: number; k: string; name: string; what: string; c: string }) => (
  <div className={beat ? `d09-on${beat}` : 'd09-in'} style={{ ...vars({ d: beat ? '0ms' : '400ms' }), position: 'absolute', left: x, top: 340, width: 500, height: 330, padding: '24px 30px', boxSizing: 'border-box', background: ink.sheet, boxShadow: SHADOW, borderTop: `6px solid ${c}` }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
      <span style={{ fontFamily: typewriter, fontSize: 64, color: c }}>{k}</span>
      <span style={{ fontFamily: typewriter, fontSize: 36, textShadow: BLEED }}>{name}</span>
    </div>
    <div style={{ marginTop: 16, fontSize: 26, lineHeight: 1.5 }}>{what}</div>
  </div>
);

const Library: Page = () => (
  <Frame id="qkv" era="2017" eyebrow="Comment le poids est calculé" title="Une recherche dans une bibliothèque" beats={3}>
    <QKV x={170} beat={1} k="Q" name="Requête" what="Ce que le mot cherche. « il » : « qui est le sujet ? »" c={ink.blue} />
    <QKV x={725} beat={2} k="K" name="Clé" what="L'étiquette de chaque mot. « l'animal » : « je suis un être vivant »." c={ink.red} />
    <QKV x={1280} beat={3} k="V" name="Valeur" what="Le contenu qu'on récupère : un mélange des valeurs, pondéré par l'accord requête-clé." c="#3e7a4e" />
    <div className="d09-in" style={{ ...vars({ d: '300ms' }), position: 'absolute', left: L, top: 720, width: CW, fontSize: 27, lineHeight: 1.5, color: ink.soft }}>
      Comme à la bibliothèque : on compare sa question aux étiquettes des livres, puis on lit surtout les livres qui correspondent.
    </div>
    <Hand x={L + 10} y={830} w={1500} rot={-0.8} size={30} d={1200}>
      Requêtes, clés et valeurs sont des vecteurs appris. Le détail est dans « Comment fonctionne un LLM ».
    </Hand>
  </Frame>
);

// ═══ 7 · Tout en parallèle ══════════════════════════════════════════════════
const Lane = ({ top, label, children }: { top: number; label: string; children: ReactNode }) => (
  <div style={{ position: 'absolute', left: L, top, width: CW }}>
    <Label>{label}</Label>
    <div style={{ position: 'relative', marginTop: 12, height: 150 }}>{children}</div>
  </div>
);

CSS.push(`
@keyframes d09-seq{0%,100%{opacity:.35}10%,30%{opacity:1}40%{opacity:.35}}
.d09-live .d09-seqw{animation:d09-seq 4s linear var(--d,0ms) infinite;opacity:.35}
@keyframes d09-par{0%,100%{opacity:.35}10%,30%{opacity:1}40%{opacity:.35}}
.d09-live .d09-parw{animation:d09-par 4s linear infinite;opacity:.35}
`);

const Chip = ({ i, cls, d }: { i: number; cls: string; d?: number }) => (
  <span
    className={cls}
    style={{ ...vars({ d: `${d ?? 0}ms` }), position: 'absolute', left: i * 190, top: 0, width: 170, height: 70, display: 'grid', placeItems: 'center', background: ink.redSoft, border: `2.5px solid ${ink.red}`, fontFamily: typewriter, fontSize: 28 }}
  >
    {['le', 'chat', 'dort', 'sur', 'le', 'canapé', 'ce', 'soir'][i]}
  </span>
);

const Parallel: Page = () => (
  <Frame id="parallel" era="2017" eyebrow="Le vrai avantage" title="Tous les mots calculés en même temps" beats={1}>
    <Lane top={330} label="Réseau récurrent : l'un après l'autre">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <Chip key={i} i={i} cls="d09-seqw" d={i * 450} />
      ))}
    </Lane>
    <div className="d09-on1">
      <Lane top={530} label="Transformer : tous à la fois">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Chip key={i} i={i} cls="d09-parw" />
        ))}
      </Lane>
    </div>
    <div className="d09-on1" style={{ ...vars({ d: '400ms' }), position: 'absolute', left: L, top: 740, width: CW }}>
      <div style={{ fontFamily: typewriter, fontSize: 40, lineHeight: 1.25, textShadow: BLEED }}>
        Parfait pour les cartes graphiques (dossier 6) : <span style={{ color: 'var(--osd-accent)' }}>on peut entraîner beaucoup plus gros, beaucoup plus vite</span>.
      </div>
    </div>
  </Frame>
);

// ═══ 8 · L'architecture ═════════════════════════════════════════════════════
const Part = ({ beat, title, children }: { beat: number; title: string; children: ReactNode }) => (
  <div className={beat ? `d09-on${beat}` : 'd09-in'} style={{ ...vars({ d: beat ? '0ms' : '500ms' }), marginBottom: 24 }}>
    <div style={{ fontFamily: typewriter, fontSize: 32, textShadow: BLEED }}>{title}</div>
    <div style={{ marginTop: 4, fontSize: 24, lineHeight: 1.45, color: ink.soft }}>{children}</div>
  </div>
);

const Architecture: Page = () => (
  <Frame id="arch" era="2017" eyebrow="L'architecture complète" title="Un bloc simple, empilé plusieurs fois" beats={3}>
    <Photo src={imgTransformer} caption="Le schéma du Transformer" x={L} y={318} w={500} h={520} fit="contain" tone={false} d={300} />
    <div style={{ position: 'absolute', left: 800, top: 330, width: 980 }}>
      <Part beat={0} title="1 · Des mots aux vecteurs">
        Chaque mot devient un vecteur (dossier 7), auquel on ajoute sa position dans la phrase.
      </Part>
      <Part beat={1} title="2 · L'attention, à plusieurs têtes">
        Plusieurs attentions en parallèle, chacune cherchant une relation différente (grammaire, sens, références…).
      </Part>
      <Part beat={2} title="3 · Un petit réseau classique">
        Appliqué à chaque mot séparément, pour transformer ce qu'il a recueilli.
      </Part>
      <Part beat={3} title="4 · Empiler">
        Le bloc est répété : 6 fois en 2017, près d'une centaine de fois dans les grands modèles actuels.
      </Part>
    </div>
  </Frame>
);

// ═══ 9 · Les résultats ══════════════════════════════════════════════════════
const Result = ({ beat, value, label, top }: { beat: number; value: string; label: string; top: number }) => (
  <div className={beat ? `d09-on${beat}` : 'd09-in'} style={{ ...vars({ d: beat ? '0ms' : '500ms' }), position: 'absolute', left: L, top, width: 1500, display: 'flex', alignItems: 'baseline', gap: 30 }}>
    <span style={{ width: 380, flex: 'none', fontFamily: typewriter, fontSize: 64, color: ink.red }}>{value}</span>
    <span style={{ fontSize: 27, lineHeight: 1.45 }}>{label}</span>
  </div>
);

const Results: Page = () => (
  <Frame id="results" era="2017" eyebrow="Le résultat en 2017" title="Meilleur, et bien moins cher à entraîner" beats={2}>
    <Result beat={0} top={340} value="28,4" label="score BLEU en traduction anglais → allemand : nouveau record, plus de 2 points devant les meilleurs systèmes." />
    <Result beat={1} top={490} value="3,5 jours" label="d'entraînement sur 8 cartes graphiques pour le plus grand modèle : une fraction du coût des concurrents." />
    <div className="d09-on2" style={{ position: 'absolute', left: L, top: 650, width: 1500, fontSize: 28, lineHeight: 1.5 }}>
      Conçu pour la traduction, le Transformer va très vite servir à tout le reste.
    </div>
    <Hand x={L + 10} y={780} w={1500} rot={-0.8} size={30} d={1200}>
      BLEU : un score qui compare une traduction automatique à des traductions humaines (plus haut = mieux).
    </Hand>
  </Frame>
);

// ═══ 10 · La descendance ════════════════════════════════════════════════════
const Heir = ({ y, beat, year, name, who, children, hot }: { y: number; beat: number; year: string; name: string; who: string; children: ReactNode; hot?: boolean }) => (
  <div className={beat ? `d09-on${beat}` : 'd09-in'} style={{ ...vars({ d: beat ? '0ms' : '400ms' }), position: 'absolute', left: L, top: y, width: CW, display: 'flex', alignItems: 'baseline', gap: 26, paddingBottom: 14, borderBottom: `1.5px dotted ${ink.faint}` }}>
    <span style={{ width: 110, flex: 'none', fontFamily: typewriter, fontSize: 38, color: ink.muted }}>{year}</span>
    <span style={{ width: 260, flex: 'none', fontFamily: typewriter, fontSize: 38, color: hot ? ink.red : ink.text }}>{name}</span>
    <span style={{ width: 230, flex: 'none' }}>
      <Label>{who}</Label>
    </span>
    <span style={{ fontSize: 25, lineHeight: 1.4, color: ink.soft }}>{children}</span>
  </div>
);

const Family: Page = () => (
  <Frame id="family" era="2018–2020" eyebrow="Une descendance immense" title="Le « T » de GPT" beats={4}>
    <Heir y={330} beat={0} year="2018" name="GPT" who="OpenAI">
      « Generative Pre-trained Transformer » : prédire le mot suivant, sur des livres.
    </Heir>
    <Heir y={420} beat={1} year="2018" name="BERT" who="Google">
      Comprendre les phrases. Il améliore la recherche Google dès 2019.
    </Heir>
    <Heir y={510} beat={2} year="2019" name="GPT-2" who="OpenAI">
      1,5 milliard de paramètres. Des textes si crédibles qu'OpenAI le publie par étapes.
    </Heir>
    <Heir y={600} beat={3} year="2020" name="GPT-3" who="OpenAI" hot>
      175 milliards de paramètres. Il apprend une tâche à partir de quelques exemples dans la question.
    </Heir>
    <Heir y={690} beat={4} year="2020" name="ViT" who="Google">
      Le même Transformer, appliqué aux images découpées en petits carrés.
    </Heir>
    <Hand x={L + 10} y={800} w={1500} rot={-0.8} size={30} d={1500}>
      Le Transformer devient l'architecture à tout faire : texte, images, son, protéines.
    </Hand>
  </Frame>
);

// ═══ 11 · La course à la taille ═════════════════════════════════════════════
const SIZES: [string, number, string][] = [
  ['Transformer', 2017, '213 M'],
  ['GPT', 2018, '117 M'],
  ['GPT-2', 2019, '1,5 G'],
  ['GPT-3', 2020, '175 G'],
];
const LOGS = [Math.log10(213e6), Math.log10(117e6), Math.log10(1.5e9), Math.log10(175e9)];

const Scale: Page = () => (
  <Frame id="scale" era="2017–2020" eyebrow="La course à la taille" title="Plus gros, plus de données… et ça marche" beats={2}>
    <div className="d09-in-fade" style={{ ...vars({ d: '300ms' }), position: 'absolute', left: L, top: 320, width: 940, height: 480, ...graph(40) }}>
      <svg width={940} height={480} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <line x1={60} y1={420} x2={910} y2={420} stroke={ink.soft} strokeWidth={2} />
        {[8, 9, 10, 11].map((e) => (
          <line key={e} x1={60} y1={420 - (e - 7.5) * 95} x2={910} y2={420 - (e - 7.5) * 95} stroke={ink.rule} strokeWidth={1.5} strokeDasharray="4 6" />
        ))}
        {SIZES.map(([n, y, s], i) => {
          const h = (LOGS[i] - 7.5) * 95;
          return (
            <g key={n} className="d09-in" style={vars({ d: `${500 + i * 250}ms` })}>
              <rect x={110 + i * 200} y={420 - h} width={110} height={h} fill={i === 3 ? ink.red : ink.blue} />
              <text x={165 + i * 200} y={420 - h - 12} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: 28 }}>
                {s}
              </text>
              <text x={165 + i * 200} y={452} textAnchor="middle" style={{ fontFamily: mono, fontSize: 22 }}>
                {n}
              </text>
              <text x={165 + i * 200} y={476} textAnchor="middle" style={{ fontFamily: mono, fontSize: 19 }} fill={ink.muted}>
                {y}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
    <div className="d09-on1" style={{ position: 'absolute', left: 1180, top: 340, width: 600, fontSize: 27, lineHeight: 1.5 }}>
      <b>2020</b> : des chercheurs d'OpenAI mesurent des « lois d'échelle ». L'erreur baisse de façon prévisible quand on augmente la taille du modèle, les données et le calcul.
    </div>
    <div className="d09-on2" style={{ position: 'absolute', left: 1180, top: 600, width: 600 }}>
      <div style={{ fontFamily: typewriter, fontSize: 36, lineHeight: 1.3, color: 'var(--osd-accent)', textShadow: BLEED }}>Une recette industrielle : il suffit d'investir.</div>
    </div>
    <Hand x={L + 10} y={830} w={940} rot={-1} size={28} d={1600}>
      paramètres, échelle logarithmique (chaque trait = ×10) · M = millions, G = milliards
    </Hand>
  </Frame>
);

// ═══ 12 · Ce qu'il faut retenir ═════════════════════════════════════════════
const Lesson: Page = () => (
  <Frame id="lesson" eyebrow="Ce qu'il faut retenir" beats={1}>
    <div className="d09-in-fade" style={{ position: 'absolute', left: L - 16, top: 170, fontFamily: typewriter, fontSize: 300, lineHeight: 1, color: ink.rule }}>
      «
    </div>
    <div style={{ position: 'absolute', left: L, top: 370, fontFamily: typewriter, fontSize: 70, lineHeight: 1.22, textShadow: BLEED }}>
      <Typed text="Plus besoin de lire mot à mot." d={400} step={30} />
    </div>
    <div style={{ position: 'absolute', left: L, top: 480, fontFamily: typewriter, fontSize: 70, lineHeight: 1.22, textShadow: BLEED }}>
      <Typed text="Chaque mot " beat={1} step={30} />
      <span style={{ color: 'var(--osd-accent)' }}>
        <Mark beat={1} d={1100}>
          <Typed text="regarde tous les autres" beat={1} d={330} step={30} />
        </Mark>
      </span>
      <Typed text="." beat={1} d={1020} step={30} />
    </div>
    <SeriesNav left={L} top={700} d={800} />
    <div className="d09-in" style={{ ...vars({ d: '1000ms' }), position: 'absolute', left: L + 856, top: 700 }}>
      <NavCard id="llm-explique" kicker="Pour aller plus loin">
        Comment fonctionne un LLM
      </NavCard>
    </div>
    <Credits top={930}>Schéma via Wikimedia Commons : architecture du Transformer par dvgodoy (CC BY 4.0).</Credits>
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

const STYLE_ID = 'osd-styles-ai-history-09-transformer';
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
  title: "Le Transformer : « Attention Is All You Need »",
  createdAt: '2026-10-08T04:41:51.704Z',
};

export const notes: (string | undefined)[] = [
  `Dossier 9 : 2017, le Transformer. Toutes les IA de langage actuelles en descendent, ChatGPT compris.
La carte perforée encode « TRANSFORMER 2017 ».`,
  `Rappel du dossier 7 : les réseaux récurrents lisent un mot après l'autre.
Clic 1 : c'est lent, impossible de profiter des cartes graphiques.
Clic 2 : et ils oublient le début des longs textes.`,
  `Une première idée en 2014 : l'attention, par Bahdanau, Cho et Bengio. Pour traduire chaque mot, on relit toute la phrase d'origine.
Clic 1 : et on donne un poids à chaque mot ; pour écrire « chat », presque tout le poids va sur « cat ».
Clic 2 : mais l'attention reste un ajout à un réseau qui lit toujours mot à mot.`,
  `Juin 2017 : huit chercheurs de Google publient « Attention Is All You Need ».
Clic 1 : présenté à NeurIPS en décembre.
Clic 2 : l'idée audacieuse : supprimer complètement la lecture mot à mot. Il ne reste que l'attention. C'est l'un des articles les plus cités de l'histoire de l'informatique.`,
  `L'auto-attention : chaque mot regarde tous les autres.
Exemple célèbre : « l'animal n'a pas traversé la rue car il était trop fatigué ». À quoi renvoie « il » ?
Clic 1 : avec « fatigué », l'attention va sur l'animal. Clic 2 : remplacez par « large », elle bascule vers la rue.
Le sens de chaque mot dépend de toute la phrase. Les poids affichés sont illustratifs.`,
  `Comment le poids est calculé : une recherche dans une bibliothèque.
Clic 1 : la requête, ce que le mot cherche. Clic 2 : la clé, l'étiquette de chaque mot. Clic 3 : la valeur, le contenu qu'on récupère, mélangé selon l'accord entre requête et clé.
Le détail mathématique est dans la présentation « Comment fonctionne un LLM ».`,
  `Le vrai avantage, souvent sous-estimé : le parallélisme.
Un réseau récurrent traite les mots l'un après l'autre.
Clic : le Transformer les traite tous en même temps. Idéal pour les cartes graphiques : on peut entraîner beaucoup plus gros, beaucoup plus vite.`,
  `L'architecture complète, sur le schéma. Des mots aux vecteurs, avec leur position.
Clic 1 : l'attention à plusieurs têtes, chacune cherche une relation différente.
Clic 2 : un petit réseau classique pour chaque mot.
Clic 3 : on empile ce bloc : 6 fois en 2017, près d'une centaine dans les grands modèles actuels.`,
  `Les résultats en 2017 : record en traduction anglais vers allemand, 28,4 de score BLEU.
Clic 1 : et seulement 3,5 jours d'entraînement sur 8 cartes graphiques pour le plus gros modèle.
Clic 2 : conçu pour la traduction, il va servir à tout.`,
  `La descendance. 2018 : GPT chez OpenAI, le T veut dire Transformer.
Clic 1 : BERT chez Google, pour comprendre les phrases. Clic 2 : GPT-2. Clic 3 : GPT-3, 175 milliards de paramètres. Clic 4 : ViT, le Transformer appliqué aux images.`,
  `La course à la taille : des centaines de millions de paramètres, puis des milliards.
Clic 1 : en 2020, les lois d'échelle : l'erreur baisse de façon prévisible avec la taille, les données et le calcul.
Clic 2 : une recette industrielle : il suffit d'investir. Ce qui mène directement à ChatGPT.`,
  `À retenir : plus besoin de lire mot à mot. Clic : chaque mot regarde tous les autres.
Liens vers le sommaire, le dossier 10 sur ChatGPT, et la présentation « Comment fonctionne un LLM ».`,
];

export default [Cover, Start, Bahdanau, Article, SelfAttention, Library, Parallel, Architecture, Results, Family, Scale, Lesson] satisfies Page[];
