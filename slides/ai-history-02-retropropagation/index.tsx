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
import imgHinton from '@assets/ai-history/hinton.jpg';
import imgRumelhart from '@assets/ai-history/rumelhart.jpg';

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
const FONT_LINK_ID = 'osd-webfont-ai-history-02-retropropagation';
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
const has = (n: number) => `.d02-page:has([data-osd-step="revealed"] > .d02-k${n})`;

CSS.push(`
@keyframes d02-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes d02-fade{from{opacity:0}to{opacity:1}}
@keyframes d02-type{from{opacity:0}to{opacity:1}}
@keyframes d02-draw{from{stroke-dashoffset:1.01}to{stroke-dashoffset:0}}
@keyframes d02-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes d02-pop{0%{opacity:0;transform:scale(.3)}60%{opacity:1;transform:scale(1.15)}100%{opacity:1;transform:scale(1)}}
@keyframes d02-stamp{0%{opacity:0;transform:rotate(var(--r,0deg)) scale(1.9)}35%{opacity:1}70%{transform:rotate(var(--r,0deg)) scale(.94)}100%{opacity:1;transform:rotate(var(--r,0deg)) scale(1)}}
@keyframes d02-blink{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes d02-spin{to{transform:rotate(360deg)}}
@keyframes d02-scan{0%{transform:translateY(0);opacity:0}8%{opacity:.75}92%{opacity:.75}100%{transform:translateY(var(--h,400px));opacity:0}}
@keyframes d02-back{to{stroke-dashoffset:36}}
.d02-stamp{transform:rotate(var(--r,0deg))}
.d02-in-draw{stroke-dasharray:1 2}
.d02-in-pop,.d02-pop{transform-box:fill-box;transform-origin:center}
.d02-in-grow{transform-origin:left center}
.d02-live .d02-in{animation:d02-rise 800ms ${EASE} var(--d,0ms) both}
.d02-live .d02-in-fade{animation:d02-fade 900ms ${EASE} var(--d,0ms) both}
.d02-live .d02-in-draw{animation:d02-draw 1300ms ${EASE} var(--d,0ms) both}
.d02-live .d02-in-grow{animation:d02-grow 600ms ${EASE} var(--d,0ms) both}
.d02-live .d02-in-pop{animation:d02-pop 520ms ${EASE} var(--d,0ms) both}
.d02-live .d02-in-st{animation:d02-stamp 480ms ${EASE_OUT} var(--d,0ms) both}
.d02-live .d02-ty0 .d02-c{animation:d02-type 40ms linear var(--d,0ms) both}
.d02-live .d02-lamp{animation:d02-blink var(--t,1.4s) steps(1,end) var(--d,0ms) infinite}
.d02-reel{transform-box:fill-box;transform-origin:center}
.d02-live .d02-reel{animation:d02-spin var(--t,8s) linear infinite}
.d02-scan{opacity:0}
.d02-live .d02-scan{animation:d02-scan 3.4s ease-in-out var(--d,0ms) infinite}
.d02-live .d02-back{animation:d02-back 900ms linear infinite}
@media (prefers-reduced-motion: reduce){.d02-page *{animation:none !important;transition:none !important}}
`);

// Beat utilities — visible from beat n: on (rise) / fade / typed text / stamp
// (thunk) / grow; hidden from beat n: off; stroke drawn at beat n: draw (path
// needs pathLength={1}); faded back at beat n: dim.
for (let n = 1; n <= 6; n++) {
  const at = has(n);
  CSS.push(`
.d02-on${n}{opacity:0;transform:translateY(14px);transition:opacity 500ms ${EASE} var(--d,0ms),transform 700ms ${EASE} var(--d,0ms)}
${at} .d02-on${n}{opacity:1;transform:none}
.d02-fade${n}{opacity:0;transition:opacity 550ms ${EASE} var(--d,0ms)}
${at} .d02-fade${n}{opacity:1}
.d02-ty${n} .d02-c{opacity:0}
${at} .d02-ty${n} .d02-c{opacity:1;transition:opacity 40ms linear var(--d,0ms)}
.d02-st${n}{opacity:0;transform:rotate(var(--r,0deg)) scale(1.9);transition:opacity 120ms linear var(--d,0ms),transform 440ms ${THUNK} var(--d,0ms)}
${at} .d02-st${n}{opacity:1;transform:rotate(var(--r,0deg)) scale(1)}
.d02-grow${n}{transform:scaleX(0);transform-origin:left center;transition:transform 600ms ${EASE} var(--d,0ms)}
${at} .d02-grow${n}{transform:scaleX(1)}
.d02-off${n}{transition:opacity 380ms ${EASE}}
${at} .d02-off${n}{opacity:0}
.d02-draw${n}{stroke-dasharray:1 2;stroke-dashoffset:1.01;transition:stroke-dashoffset 1000ms ${EASE} var(--d,0ms)}
${at} .d02-draw${n}{stroke-dashoffset:0}
.d02-dim${n}{transition:opacity 500ms ${EASE}}
${at} .d02-dim${n}{opacity:.22}
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
          <i className={`d02-k${i + 1}`} />
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
    className={`d02-stamp ${beat ? `d02-st${beat}` : 'd02-in-st'}`}
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
    <span className={`d02-ty${beat}`}>
      {Array.from(text).map((ch, k) =>
        ch === '\n' ? (
          <br key={k} />
        ) : (
          <span key={k} className="d02-c" style={vars({ d: `${d + i++ * step}ms` })}>
            {ch}
          </span>
        ),
      )}
    </span>
  );
};

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div
    className="d02-in-fade"
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
      className={`d02-page d02-${id}${live ? ' d02-live' : ''}`}
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
  className = 'd02-in-fade',
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
        className={beat ? `d02-draw${beat}` : 'd02-in-draw'}
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
  "id": "ai-history-02-retropropagation",
  "n": 2,
  "short": "La rétropropagation",
  "footer": "La rétropropagation — l'erreur remonte le réseau",
  "title": "La rétropropagation",
  "subtitle": "Corriger chaque poids d'un réseau",
  "lede": "1986 : une méthode pour savoir quel poids corriger, et de combien, dans un réseau à plusieurs couches.",
  "year": "1986",
  "card": "BACKPROPAGATION 1986",
  "metaTitle": "La rétropropagation : corriger chaque poids d'un réseau",
  "next": {
    "n": 3,
    "title": "L'IA symbolique",
    "id": "ai-history-03-ia-symbolique"
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
      <rect key={i} x={pcX(c) - 4.5} y={pcY(r) - 7.5} width={9} height={15} rx={1.5} fill={ink.hole} className="d02-in-pop" style={vars({ d: `${2900 + c * 80}ms` })} />
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
  <div className="d02-in-fade" style={{ ...vars({ d: '3300ms' }), position: 'absolute', left: 1190, top: 668, width: 590, height: 262 }}>
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
      className="d02-in-fade"
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
        fontSize: 107,
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
      className="d02-in"
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
    <div className="d02-in" style={{ ...vars({ d: '2700ms' }), position: 'absolute', left: L, top: 636 }}>
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
  <div className="d02-in" style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left, top, display: 'flex', gap: 28 }}>
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
  <div className={beat ? `d02-on${beat}` : 'd02-in'} style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: x, top: y, width: w + 16 }}>
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
  <div className={beat ? `d02-on${beat}` : 'd02-in'} style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: x, top: y, width: w, height: h }}>
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
  <div className="d02-in-fade" style={{ ...vars({ d: '1500ms' }), position: 'absolute', left: L, right: RIGHT, top, fontSize: 15, lineHeight: 1.35, color: ink.muted }}>
    {children}
  </div>
);

const rim = (cx: number, cy: number, r: number, x: number, y: number): [number, number] => {
  const k = r / Math.hypot(x - cx, y - cy);
  return [cx + (x - cx) * k, cy + (y - cy) * k];
};
const deg = (x1: number, y1: number, x2: number, y2: number) => (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

// Text with a paper-coloured halo, readable on top of lines.
const halo: CSSProperties = { stroke: 'var(--osd-bg)', strokeWidth: 9, paintOrder: 'stroke', strokeLinejoin: 'round' };

// ═══ 2 · La question en suspens ═════════════════════════════════════════════
const DEEP = (() => {
  const xs = [70, 320, 570, 820];
  const counts = [3, 4, 4, 1];
  const nodes = counts.map((n, l) => Array.from({ length: n }, (_, i) => ({ x: xs[l], y: 270 + (i - (n - 1) / 2) * 120, l })));
  const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let l = 0; l < 3; l++) for (const a of nodes[l]) for (const b of nodes[l + 1]) edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
  return { nodes: nodes.flat(), edges };
})();
const ASK = [2, 7, 13, 17, 22, 26, 30];

const Pending: Page = () => (
  <Frame id="suspense" era="1969" eyebrow="La question laissée en suspens" title="Qui est responsable de l'erreur ?" beats={2}>
    <svg width={900} height={560} style={{ position: 'absolute', left: L + 10, top: 330, overflow: 'visible' }}>
      {DEEP.edges.map((e, i) => (
        <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={ink.faint} strokeWidth={2} />
      ))}
      {DEEP.nodes.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.l === 3 ? 40 : 26} fill={p.l === 3 ? ink.redSoft : ink.sheet} stroke={p.l === 3 ? ink.red : ink.text} strokeWidth={3} />
      ))}
      <text x={820} y={280} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: 30 }} fill={ink.red}>
        ŷ
      </text>
      <text x={820} y={360} textAnchor="middle" style={{ fontFamily: hand, fontWeight: 600, fontSize: 32 }} fill={ink.red}>
        erreur !
      </text>
      {ASK.map((k, i) => {
        const e = DEEP.edges[k];
        const mx = (e.x1 + e.x2) / 2;
        const my = (e.y1 + e.y2) / 2;
        return (
          <g key={k} className="d02-fade1" style={vars({ d: `${200 + i * 90}ms` })}>
            <circle cx={mx} cy={my} r={18} fill={ink.sheet} stroke={ink.red} strokeWidth={2.5} />
            <text x={mx} y={my + 9} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: 26 }} fill={ink.red}>
              ?
            </text>
          </g>
        );
      })}
    </svg>
    <div className="d02-in" style={{ ...vars({ d: '700ms' }), position: 'absolute', left: 1120, top: 336, width: 660, fontSize: 29, lineHeight: 1.5, color: ink.soft }}>
      Le Perceptron corrigeait sa couche unique : il connaissait la bonne réponse de chaque neurone.
    </div>
    <div style={{ position: 'absolute', left: 1120, top: 520, width: 660, fontFamily: typewriter, fontSize: 44, lineHeight: 1.25, textShadow: BLEED }}>
      <Typed text={'Avec plusieurs couches,\nquel poids faut-il\ncorriger ?'} beat={1} step={28} />
    </div>
    <div className="d02-on2" style={{ position: 'absolute', left: 1120, top: 760, width: 660 }}>
      <Label c={ink.red}>Le problème de l'attribution du crédit</Label>
      <div style={{ marginTop: 10, fontSize: 25, lineHeight: 1.45, color: ink.soft }}>Il occupe les chercheurs pendant près de vingt ans.</div>
    </div>
  </Frame>
);

// ═══ 3 · Pas de professeur pour les couches cachées ═════════════════════════
const N3 = { x1: [90, 160], x2: [90, 440], h1: [470, 160], h2: [470, 440], o: [850, 300] } as const;

const Edge = ({ a, b, ra, rb, c = ink.text, w = 3, className, style }: { a: readonly [number, number]; b: readonly [number, number]; ra: number; rb: number; c?: string; w?: number; className?: string; style?: CSSProperties }) => {
  const [sx, sy] = rim(a[0], a[1], ra, b[0], b[1]);
  const [ex, ey] = rim(b[0], b[1], rb + 2, a[0], a[1]);
  return (
    <g className={className} style={style}>
      <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={c} strokeWidth={w} />
      <polygon points={head(ex, ey, deg(sx, sy, ex, ey), 14)} fill={c} />
    </g>
  );
};

const Node = ({ at, r, label, fill = ink.sheet, stroke = ink.text, size = 32 }: { at: readonly [number, number]; r: number; label: string; fill?: string; stroke?: string; size?: number }) => (
  <g>
    <circle cx={at[0]} cy={at[1]} r={r} fill={fill} stroke={stroke} strokeWidth={3.5} />
    <text x={at[0]} y={at[1] + size * 0.35} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: size }} fill={ink.text}>
      {label}
    </text>
  </g>
);

const Tag = ({ x, y, children, c = ink.text, className }: { x: number; y: number; children: ReactNode; c?: string; className?: string }) => (
  <text x={x} y={y} textAnchor="middle" className={className} style={{ fontFamily: mono, fontSize: 25, ...halo }} fill={c}>
    {children}
  </text>
);

const NoTeacher: Page = () => (
  <Frame id="teacher" era="1969" eyebrow="Le vrai obstacle" title="Les couches cachées n'ont pas de professeur" beats={2}>
    <svg width={1000} height={600} style={{ position: 'absolute', left: L, top: 320, overflow: 'visible' }}>
      <Edge a={N3.x1} b={N3.h1} ra={44} rb={58} />
      <Edge a={N3.x1} b={N3.h2} ra={44} rb={58} />
      <Edge a={N3.x2} b={N3.h1} ra={44} rb={58} />
      <Edge a={N3.x2} b={N3.h2} ra={44} rb={58} />
      <Edge a={N3.h1} b={N3.o} ra={58} rb={58} />
      <Edge a={N3.h2} b={N3.o} ra={58} rb={58} />
      <Node at={N3.x1} r={44} label="x₁" />
      <Node at={N3.x2} r={44} label="x₂" />
      <Node at={N3.h1} r={58} label="h₁" />
      <Node at={N3.h2} r={58} label="h₂" />
      <Node at={N3.o} r={58} label="ŷ" fill={ink.redSoft} stroke={ink.red} />
      <Tag x={850} y={205}>
        attendu : 1
      </Tag>
      <Tag x={850} y={410} c={ink.red}>
        obtenu : 0
      </Tag>
      <g className="d02-fade1">
        <Tag x={470} y={70} c={ink.red}>
          attendu : ???
        </Tag>
        <Tag x={470} y={545} c={ink.red}>
          attendu : ???
        </Tag>
      </g>
    </svg>
    <div className="d02-in" style={{ ...vars({ d: '700ms' }), position: 'absolute', left: 1230, top: 340, width: 550, fontSize: 28, lineHeight: 1.5, color: ink.soft }}>
      Pour la sortie, on connaît la bonne réponse : on peut mesurer l'erreur.
    </div>
    <div className="d02-on1" style={{ position: 'absolute', left: 1230, top: 500, width: 550, fontSize: 28, lineHeight: 1.5 }}>
      Mais personne ne dit ce que <b>h₁</b> et <b>h₂</b> auraient dû répondre.
    </div>
    <div className="d02-on2" style={{ position: 'absolute', left: 1230, top: 660, width: 550, fontSize: 28, lineHeight: 1.5 }}>
      Et avec une sortie en marche d'escalier, un petit changement de poids ne change… <b style={{ color: ink.red }}>rien</b>, puis tout d'un coup.
    </div>
  </Frame>
);

// ═══ 4 · Idée 1 : adoucir la marche ═════════════════════════════════════════
const PW = 620;
const PH = 380;
const px = (z: number) => 40 + ((z + 6) / 12) * (PW - 70);
const py = (v: number) => PH - 50 - v * (PH - 100);
const SIG_PATH = smooth(Array.from({ length: 25 }, (_, i): [number, number] => {
  const z = -6 + i * 0.5;
  return [Number(px(z).toFixed(1)), Number(py(sigmoid(z)).toFixed(1))];
}));
const TZ = 0.6;
const TS = sigmoid(TZ) * (1 - sigmoid(TZ));

const Axes = () => (
  <g>
    <line x1={30} y1={py(0)} x2={PW - 20} y2={py(0)} stroke={ink.soft} strokeWidth={2} />
    <line x1={px(0)} y1={PH - 30} x2={px(0)} y2={30} stroke={ink.soft} strokeWidth={2} />
    <text x={PW - 24} y={py(0) + 32} textAnchor="end" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
      z →
    </text>
    <text x={px(0) - 12} y={py(1) + 6} textAnchor="end" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
      1
    </text>
  </g>
);

const Panel = ({ left, title, sub, children, className = 'd02-in-fade', d = 300 }: { left: number; title: string; sub: string; children: ReactNode; className?: string; d?: number }) => (
  <div className={className} style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left, top: 310, width: PW + 40 }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
      <span style={{ fontFamily: typewriter, fontSize: 36, textShadow: BLEED }}>{title}</span>
      <Label>{sub}</Label>
    </div>
    <div style={{ position: 'relative', marginTop: 14, width: PW, height: PH, ...graph(40) }}>
      <svg width={PW} height={PH} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {children}
      </svg>
    </div>
  </div>
);

const Smooth: Page = () => (
  <Frame id="smooth" era="Idée 1" eyebrow="Idée nº 1" title="Remplacer la marche par une pente douce" beats={2}>
    <Panel left={L} title="La marche" sub="Perceptron, 1957">
      <Axes />
      <path d={`M ${px(-6)} ${py(0)} H ${px(0)} V ${py(1)} H ${px(6)}`} fill="none" stroke={ink.red} strokeWidth={5} />
      <g className="d02-fade1">
        <line x1={px(-4.5)} y1={py(0) - 6} x2={px(-1.5)} y2={py(0) - 6} stroke={ink.blue} strokeWidth={4} strokeDasharray="8 6" />
        <text x={px(-3)} y={py(0) - 22} textAnchor="middle" style={{ fontFamily: hand, fontWeight: 600, fontSize: 30 }} fill={ink.blue}>
          pente nulle
        </text>
        <text x={px(3)} y={py(1) + 48} textAnchor="middle" style={{ fontFamily: hand, fontWeight: 600, fontSize: 30 }} fill={ink.blue}>
          aucun indice
        </text>
      </g>
    </Panel>
    <Panel left={990} title="La sigmoïde" sub="σ(z) = 1 / (1 + e⁻ᶻ)" d={600}>
      <Axes />
      <path d={SIG_PATH} fill="none" stroke={ink.blue} strokeWidth={5} pathLength={1} className="d02-in-draw" style={vars({ d: '900ms' })} />
      <g className="d02-fade2">
        <line
          x1={px(TZ - 2.2)}
          y1={py(sigmoid(TZ) - 2.2 * TS)}
          x2={px(TZ + 2.2)}
          y2={py(sigmoid(TZ) + 2.2 * TS)}
          stroke={ink.red}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <circle cx={px(TZ)} cy={py(sigmoid(TZ))} r={9} fill={ink.red} />
        <text x={px(TZ) + 24} y={py(sigmoid(TZ)) + 50} style={{ fontFamily: hand, fontWeight: 600, fontSize: 30 }} fill={ink.red}>
          une pente, partout
        </text>
      </g>
    </Panel>
    <div style={{ position: 'absolute', left: L, top: 800, width: CW, fontFamily: typewriter, fontSize: 40, lineHeight: 1.3, color: 'var(--osd-accent)', textShadow: BLEED }}>
      <Typed text="Un petit changement de poids → un petit changement de sortie." beat={2} d={500} step={24} />
    </div>
  </Frame>
);

// ═══ 5 · Idée 2 : mesurer l'erreur, descendre la pente ══════════════════════
const BW = 760;
const BH = 470;
const bx = (w: number) => 60 + (w / 4) * (BW - 120);
const by = (w: number) => BH - 60 - ((w - 2.4) ** 2 / 6) * (BH - 140);
const BOWL = smooth(Array.from({ length: 21 }, (_, i): [number, number] => [Number(bx(i * 0.2).toFixed(1)), Number(by(i * 0.2).toFixed(1))]));
const STEPS = [0.3, 1.0, 1.55, 1.95, 2.2];

const Ball = ({ w, k }: { w: number; k: number }) => (
  <g className="d02-fade2" style={vars({ d: `${k * 420}ms` })}>
    <circle cx={bx(w)} cy={by(w) - 13} r={13} fill={k === STEPS.length - 1 ? ink.red : ink.blue} />
  </g>
);

const Descent: Page = () => (
  <Frame id="descent" era="Idée 2" eyebrow="Idée nº 2" title="Mesurer l'erreur, puis descendre la pente" beats={2}>
    <div className="d02-in-fade" style={{ ...vars({ d: '300ms' }), position: 'absolute', left: L, top: 320, width: BW, height: BH, ...graph(47) }}>
      <svg width={BW} height={BH} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <path d={BOWL} fill="none" stroke={ink.text} strokeWidth={4.5} pathLength={1} className="d02-in-draw" style={vars({ d: '500ms' })} />
        <text x={BW - 30} y={BH - 24} textAnchor="end" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
          valeur du poids w →
        </text>
        <text x={24} y={40} style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
          ↑ erreur E
        </text>
        <g className="d02-fade1">
          <line x1={bx(0.3) - 70} y1={by(0.3) - 13 - 70 * 1.44} x2={bx(0.3) + 110} y2={by(0.3) - 13 + 110 * 1.44} stroke={ink.red} strokeWidth={3.5} strokeDasharray="10 7" />
          <text x={bx(0.3) + 70} y={by(0.3) - 40} style={{ fontFamily: hand, fontWeight: 600, fontSize: 30 }} fill={ink.red}>
            la pente dit où descendre
          </text>
        </g>
        <Ball w={STEPS[0]} k={0} />
        <Ball w={STEPS[1]} k={1} />
        <Ball w={STEPS[2]} k={2} />
        <Ball w={STEPS[3]} k={3} />
        <Ball w={STEPS[4]} k={4} />
      </svg>
    </div>
    <div className="d02-in" style={{ ...vars({ d: '700ms' }), position: 'absolute', left: 1010, top: 330, width: 770 }}>
      <Label>L'erreur d'une réponse</Label>
      <div style={{ marginTop: 10, fontFamily: typewriter, fontSize: 48, textShadow: BLEED }}>E = ½ (ŷ − y)²</div>
      <div style={{ marginTop: 10, fontSize: 25, lineHeight: 1.45, color: ink.soft }}>Toujours positive, nulle quand la réponse est juste. Le ½ simplifie les calculs.</div>
    </div>
    <div className="d02-on1" style={{ position: 'absolute', left: 1010, top: 560, width: 770 }}>
      <Label>La règle de mise à jour</Label>
      <div style={{ marginTop: 10, fontFamily: typewriter, fontSize: 48, textShadow: BLEED }}>w ← w − η · ∂E/∂w</div>
      <div style={{ marginTop: 10, fontSize: 25, lineHeight: 1.45, color: ink.soft }}>
        ∂E/∂w : la pente de l'erreur. η : la taille du pas.
      </div>
    </div>
    <Hand x={1014} y={800} w={760} rot={-1.5} size={32} d={300}>
      Tout le problème : calculer ∂E/∂w pour chaque poids, même tout au fond du réseau.
    </Hand>
  </Frame>
);

// ═══ 6 · La règle de la chaîne ══════════════════════════════════════════════
const ChainBox = ({ x, top, label, value, k }: { x: number; top: number; label: string; value: string; k: number }) => (
  <div
    className="d02-in"
    style={{ ...vars({ d: `${400 + k * 250}ms` }), position: 'absolute', left: x, top, width: 250, height: 150, boxSizing: 'border-box', background: ink.sheet, boxShadow: SHADOW, border: `2.5px solid ${k === 3 ? ink.red : ink.text}`, textAlign: 'center', paddingTop: 18 }}
  >
    <div style={{ fontFamily: typewriter, fontSize: 52, lineHeight: 1, color: k === 3 ? ink.red : ink.text }}>{label}</div>
    <div style={{ marginTop: 16, fontSize: 24, color: ink.soft }}>{value}</div>
  </div>
);

const Slope = ({ x, beat, value, what }: { x: number; beat: number; value: string; what: string }) => (
  <div className={`d02-on${beat}`} style={{ position: 'absolute', left: x, top: 330, width: 170, textAlign: 'center' }}>
    <div style={{ fontFamily: typewriter, fontSize: 40, color: ink.blue }}>× {value}</div>
    <div style={{ marginTop: 4, fontSize: 21, lineHeight: 1.3, color: ink.soft }}>{what}</div>
  </div>
);

const Chain: Page = () => (
  <Frame id="chain" era="Calcul" eyebrow="Le cœur de la méthode" title="La règle de la chaîne : multiplier les effets" beats={3}>
    <ChainBox x={170} top={470} label="w" value="poids = 0,5" k={0} />
    <ChainBox x={590} top={470} label="z" value="z = w · 2 = 1" k={1} />
    <ChainBox x={1010} top={470} label="a" value="a = σ(z) = 0,73" k={2} />
    <ChainBox x={1430} top={470} label="E" value="½(a − 1)² = 0,036" k={3} />
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', overflow: 'visible' }}>
      <line x1={426} y1={545} x2={578} y2={545} stroke={ink.text} strokeWidth={3} />
      <polygon points={head(590, 545, 0, 15)} fill={ink.text} />
      <line x1={846} y1={545} x2={998} y2={545} stroke={ink.text} strokeWidth={3} />
      <polygon points={head(1010, 545, 0, 15)} fill={ink.text} />
      <line x1={1266} y1={545} x2={1418} y2={545} stroke={ink.text} strokeWidth={3} />
      <polygon points={head(1430, 545, 0, 15)} fill={ink.text} />
    </svg>
    <Slope x={427} beat={1} value="2" what="z bouge 2 fois plus que w" />
    <Slope x={847} beat={2} value="0,20" what="pente de la sigmoïde" />
    <Slope x={1267} beat={3} value="(−0,27)" what="pente de l'erreur" />
    <div className="d02-on3" style={{ ...vars({ d: '600ms' }), position: 'absolute', left: L, top: 700, width: CW }}>
      <div style={{ fontFamily: typewriter, fontSize: 46, lineHeight: 1.2, textShadow: BLEED }}>
        ∂E/∂w = 2 × 0,20 × (−0,27) ≈ <span style={{ color: 'var(--osd-accent)' }}>−0,11</span>
      </div>
      <div style={{ marginTop: 16, fontSize: 27, lineHeight: 1.45, color: ink.soft }}>
        Pente négative : augmenter w fait baisser l'erreur. Chaque maillon ne calcule qu'une petite pente locale.
      </div>
    </div>
  </Frame>
);

// ═══ 7–9 · Un exemple complet : passe avant, passe arrière, correction ══════
const NX = { x1: [90, 150], x2: [90, 450], h1: [470, 150], h2: [470, 450], o: [850, 300] } as const;
const NR = { in: 44, hid: 60 };

const WLabel = ({ a, b, t = 0.42, children, c = ink.muted }: { a: readonly [number, number]; b: readonly [number, number]; t?: number; children: ReactNode; c?: string }) => (
  <text
    x={a[0] + (b[0] - a[0]) * t}
    y={a[1] + (b[1] - a[1]) * t + 8}
    textAnchor="middle"
    style={{ fontFamily: mono, fontSize: 22, ...halo }}
    fill={c}
  >
    {children}
  </text>
);

// The 2-2-1 network with its weights (x₁ = 1, x₂ = 0, target y = 1).
const ExampleNet = ({ children }: { children?: ReactNode }) => (
  <svg width={1000} height={620} style={{ position: 'absolute', left: L, top: 330, overflow: 'visible' }}>
    <Edge a={NX.x1} b={NX.h1} ra={NR.in} rb={NR.hid} />
    <Edge a={NX.x1} b={NX.h2} ra={NR.in} rb={NR.hid} />
    <Edge a={NX.x2} b={NX.h1} ra={NR.in} rb={NR.hid} c={ink.faint} />
    <Edge a={NX.x2} b={NX.h2} ra={NR.in} rb={NR.hid} c={ink.faint} />
    <Edge a={NX.h1} b={NX.o} ra={NR.hid} rb={NR.hid} />
    <Edge a={NX.h2} b={NX.o} ra={NR.hid} rb={NR.hid} />
    <WLabel a={NX.x1} b={NX.h1} t={0.5}>
      1,0
    </WLabel>
    <WLabel a={NX.x1} b={NX.h2} t={0.3}>
      −0,5
    </WLabel>
    <WLabel a={NX.x2} b={NX.h1} t={0.3}>
      0,5
    </WLabel>
    <WLabel a={NX.x2} b={NX.h2} t={0.5}>
      1,0
    </WLabel>
    <WLabel a={NX.h1} b={NX.o} t={0.45}>
      1,2
    </WLabel>
    <WLabel a={NX.h2} b={NX.o} t={0.45}>
      −0,8
    </WLabel>
    <Node at={NX.x1} r={NR.in} label="1" size={36} />
    <Node at={NX.x2} r={NR.in} label="0" size={36} />
    <Node at={NX.h1} r={NR.hid} label="h₁" />
    <Node at={NX.h2} r={NR.hid} label="h₂" />
    <Node at={NX.o} r={NR.hid} label="ŷ" />
    <text x={20} y={80} style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
      entrées
    </text>
    {children}
  </svg>
);

// A value badge stuck on a neuron.
const Badge = ({ at, dy, children, c, beat, d = 0 }: { at: readonly [number, number]; dy: number; children: ReactNode; c: string; beat: number; d?: number }) => (
  <g className={`d02-fade${beat}`} style={vars({ d: `${d}ms` })}>
    <rect x={at[0] - 74} y={at[1] + dy - 26} width={148} height={42} rx={6} fill={ink.sheet} stroke={c} strokeWidth={2.5} />
    <text x={at[0]} y={at[1] + dy + 4} textAnchor="middle" style={{ fontFamily: mono, fontSize: 25, fontWeight: 700 }} fill={c}>
      {children}
    </text>
  </g>
);

const StepLine = ({ beat, k, children }: { beat: number; k: string; children: ReactNode }) => (
  <div className={beat ? `d02-on${beat}` : 'd02-in'} style={{ ...vars({ d: beat ? '0ms' : '600ms' }), display: 'flex', gap: 16, marginBottom: 26, fontSize: 26, lineHeight: 1.4 }}>
    <span style={{ fontFamily: typewriter, fontSize: 30, color: ink.red, width: 34, flex: 'none' }}>{k}</span>
    <span>{children}</span>
  </div>
);

const Forward: Page = () => (
  <Frame id="forward" era="Exemple" eyebrow="Exemple · 1. la passe avant" title="D'abord, calculer la réponse" beats={3}>
    <ExampleNet>
      <Badge at={NX.h1} dy={-88} c={ink.blue} beat={1}>
        0,731
      </Badge>
      <Badge at={NX.h2} dy={100} c={ink.blue} beat={1}>
        0,378
      </Badge>
      <Badge at={NX.o} dy={-88} c={ink.blue} beat={2}>
        0,640
      </Badge>
      <Badge at={NX.o} dy={100} c={ink.red} beat={3}>
        visé : 1
      </Badge>
    </ExampleNet>
    <div style={{ position: 'absolute', left: 1230, top: 340, width: 550 }}>
      <StepLine beat={0} k="1">
        Entrées : x₁ = 1, x₂ = 0.
      </StepLine>
      <StepLine beat={1} k="2">
        Couche cachée : h = σ(somme pondérée).
      </StepLine>
      <StepLine beat={2} k="3">
        Sortie : ŷ = σ(1,2·h₁ − 0,8·h₂) = 0,640.
      </StepLine>
      <StepLine beat={3} k="4">
        <>
          Erreur : E = ½ (0,640 − 1)² = <b style={{ color: ink.red }}>0,065</b>.
        </>
      </StepLine>
    </div>
  </Frame>
);

const BackArrow = ({ from, to, beat, d = 0 }: { from: readonly [number, number]; to: readonly [number, number]; beat: number; d?: number }) => {
  const [sx, sy] = rim(from[0], from[1], NR.hid + 6, to[0], to[1]);
  const [ex, ey] = rim(to[0], to[1], NR.hid + 10, from[0], from[1]);
  const off = 18;
  const ang = Math.atan2(ey - sy, ex - sx);
  const ox = -Math.sin(ang) * off;
  const oy = Math.cos(ang) * off;
  return (
    <g className={`d02-fade${beat}`} style={vars({ d: `${d}ms` })}>
      <line x1={sx + ox} y1={sy + oy} x2={ex + ox} y2={ey + oy} stroke={ink.red} strokeWidth={5} strokeDasharray="12 8" className="d02-back" />
      <polygon points={head(ex + ox, ey + oy, deg(sx, sy, ex, ey), 16)} fill={ink.red} />
    </g>
  );
};

const Backward: Page = () => (
  <Frame id="backward" era="Exemple" eyebrow="Exemple · 2. la passe arrière" title="Puis faire remonter l'erreur" beats={3}>
    <ExampleNet>
      <Badge at={NX.o} dy={-88} c={ink.red} beat={1}>
        δ = −0,083
      </Badge>
      <BackArrow from={NX.o} to={NX.h1} beat={2} />
      <BackArrow from={NX.o} to={NX.h2} beat={2} />
      <Badge at={NX.h1} dy={-88} c={ink.red} beat={2} d={500}>
        δ = −0,020
      </Badge>
      <Badge at={NX.h2} dy={100} c={ink.red} beat={2} d={500}>
        δ = +0,016
      </Badge>
    </ExampleNet>
    <div style={{ position: 'absolute', left: 1230, top: 340, width: 550 }}>
      <StepLine beat={1} k="1">
        Signal d'erreur de la sortie : δ = (ŷ − y) · σ′.
      </StepLine>
      <StepLine beat={2} k="2">
        Chaque neurone caché reçoit sa part : δ de la sortie × poids × σ′.
      </StepLine>
      <StepLine beat={3} k="3">
        <>
          Pente d'un poids = <b>δ de son arrivée × son entrée</b>. Ex. : 1,2 → −0,083 × 0,731 = −0,061.
        </>
      </StepLine>
    </div>
    <Hand x={L + 20} y={900} w={900} rot={-1} size={32} d={600}>
      Les mêmes poids, parcourus à l'envers : c'est la rétropropagation.
    </Hand>
  </Frame>
);

const WRow = ({ name, from, to, beat, still }: { name: string; from: string; to: string; beat: number; still?: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', height: 58, borderBottom: `1.5px dotted ${ink.faint}`, fontFamily: typewriter, fontSize: 32 }}>
    <span style={{ width: 230 }}>{name}</span>
    <span style={{ width: 150, textAlign: 'right', color: ink.muted }}>{from}</span>
    <span style={{ width: 90, textAlign: 'center', color: ink.muted }}>→</span>
    <span className={`d02-fade${beat}`} style={{ width: 150, textAlign: 'right', color: still ? ink.muted : ink.red }}>
      {to}
    </span>
    <span className={`d02-fade${beat}`} style={{ marginLeft: 26, fontFamily: mono, fontSize: 21, color: ink.muted }}>
      {still ? 'x₂ = 0 : rien à corriger' : ''}
    </span>
  </div>
);

const Update: Page = () => (
  <Frame id="update" era="Exemple" eyebrow="Exemple · 3. la correction" title="Enfin, corriger tous les poids d'un coup" beats={2}>
    <div className="d02-in" style={{ ...vars({ d: '400ms' }), position: 'absolute', left: L, top: 330, width: 1000 }}>
      <div style={{ display: 'flex', height: 46, alignItems: 'center', borderBottom: `2px solid ${ink.text}` }}>
        <span style={{ width: 230 }}>
          <Label>Poids</Label>
        </span>
        <span style={{ width: 150, textAlign: 'right' }}>
          <Label>avant</Label>
        </span>
        <span style={{ width: 90 }} />
        <span style={{ width: 150, textAlign: 'right' }}>
          <Label>après</Label>
        </span>
      </div>
      <WRow name="h₁ → ŷ" from="1,200" to="1,261" beat={1} />
      <WRow name="h₂ → ŷ" from="−0,800" to="−0,769" beat={1} />
      <WRow name="x₁ → h₁" from="1,000" to="1,020" beat={1} />
      <WRow name="x₁ → h₂" from="−0,500" to="−0,516" beat={1} />
      <WRow name="x₂ → h₁" from="0,500" to="0,500" beat={1} still />
      <WRow name="x₂ → h₂" from="1,000" to="1,000" beat={1} still />
    </div>
    <div className="d02-in" style={{ ...vars({ d: '700ms' }), position: 'absolute', left: 1250, top: 340, width: 530 }}>
      <Label>Avec η = 1</Label>
      <div style={{ marginTop: 10, fontFamily: typewriter, fontSize: 38, textShadow: BLEED }}>w ← w − η · pente</div>
    </div>
    <div className="d02-on2" style={{ position: 'absolute', left: 1250, top: 520, width: 530, fontSize: 28, lineHeight: 1.6 }}>
      <div>
        sortie : 0,640 → <b style={{ color: ink.red }}>0,655</b>
      </div>
      <div>
        erreur : 0,065 → <b style={{ color: ink.red }}>0,060</b>
      </div>
    </div>
    <Stamp pos={{ left: 1300, top: 700 }} rot={-7} size={50} beat={2} d={400}>
      Un peu mieux
    </Stamp>
    <Hand x={L + 10} y={760} w={1000} rot={-1} size={32} d={1200}>
      Un seul exemple, un tout petit pas. On recommence des milliers de fois, sur des milliers d'exemples.
    </Hand>
  </Frame>
);

// ═══ 10 · XOR appris ════════════════════════════════════════════════════════
const LOSS = smooth([
  [40, 70],
  [120, 74],
  [220, 80],
  [300, 86],
  [360, 110],
  [410, 210],
  [460, 300],
  [540, 340],
  [660, 356],
  [720, 360],
]);
const XP = (v: number) => 70 + 300 * v;
const YP = (v: number) => 370 - 300 * v;

const XorPt = ({ a, b, v }: { a: number; b: number; v: 0 | 1 }) =>
  v ? <circle cx={XP(a)} cy={YP(b)} r={20} fill={ink.text} /> : <circle cx={XP(a)} cy={YP(b)} r={18} fill={ink.sheet} stroke={ink.text} strokeWidth={4.5} />;

const Learned: Page = () => (
  <Frame id="xor" era="Résultat" eyebrow="Répéter, répéter, répéter" title="Et le réseau apprend XOR tout seul" beats={2}>
    <div className="d02-in-fade" style={{ ...vars({ d: '300ms' }), position: 'absolute', left: L, top: 330, width: 760, height: 420, ...graph(42) }}>
      <svg width={760} height={420} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <path d={LOSS} fill="none" stroke={ink.blue} strokeWidth={4.5} pathLength={1} className="d02-draw1" />
        <text x={30} y={40} style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
          ↑ erreur moyenne
        </text>
        <text x={730} y={400} textAnchor="end" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
          passages sur les exemples →
        </text>
        <text x={160} y={130} className="d02-fade1" style={{ ...vars({ d: '600ms' }), fontFamily: hand, fontWeight: 600, fontSize: 30 }} fill={ink.blue}>
          long plateau…
        </text>
        <text x={470} y={260} className="d02-fade1" style={{ ...vars({ d: '1000ms' }), fontFamily: hand, fontWeight: 600, fontSize: 30 }} fill={ink.blue}>
          …puis la chute
        </text>
      </svg>
    </div>
    <div className="d02-in-fade" style={{ ...vars({ d: '300ms' }), position: 'absolute', left: 1040, top: 330, width: 440, height: 440, ...graph(37) }}>
      <svg width={440} height={440} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <polygon points="0,0 150,0 440,290 440,440 290,440 0,150" fill={ink.blueSoft} className="d02-fade2" />
        <XorPt a={0} b={0} v={0} />
        <XorPt a={0} b={1} v={1} />
        <XorPt a={1} b={0} v={1} />
        <XorPt a={1} b={1} v={0} />
      </svg>
    </div>
    <div className="d02-in-fade" style={{ ...vars({ d: '600ms' }), position: 'absolute', left: 1040, top: 790, width: 740, fontSize: 24, lineHeight: 1.4, color: ink.muted }}>
      En bleu : la zone où le réseau répond 1. Personne ne lui a dicté ses frontières.
    </div>
    <Stamp pos={{ left: 1520, top: 640 }} rot={-10} size={42} color={ink.blue} beat={2} d={500}>
      XOR appris
    </Stamp>
    <Hand x={L + 10} y={800} w={760} rot={-1} size={30} d={1400}>
      allure typique d'un apprentissage de XOR (2 neurones cachés)
    </Hand>
  </Frame>
);

// ═══ 11 · Qui l'a inventée ? ════════════════════════════════════════════════
const HistCard = ({ x, w, beat, year, who, children, hot }: { x: number; w: number; beat: number; year: string; who: string; children: ReactNode; hot?: boolean }) => (
  <div
    className={beat ? `d02-on${beat}` : 'd02-in'}
    style={{ ...vars({ d: beat ? '0ms' : '400ms' }), position: 'absolute', left: x, top: 320, width: w, height: 330, padding: '24px 28px', boxSizing: 'border-box', background: ink.sheet, boxShadow: SHADOW, border: hot ? `2.5px solid ${ink.red}` : undefined }}
  >
    <div style={{ fontFamily: typewriter, fontSize: 56, lineHeight: 1, color: hot ? ink.red : ink.text, textShadow: BLEED }}>{year}</div>
    <div style={{ marginTop: 10 }}>
      <Label>{who}</Label>
    </div>
    <div style={{ marginTop: 18, fontSize: 25, lineHeight: 1.45, color: ink.soft }}>{children}</div>
  </div>
);

const History: Page = () => (
  <Frame id="history" era="1970–1986" eyebrow="Une idée découverte plusieurs fois" title="Qui a inventé la rétropropagation ?" beats={2}>
    <HistCard x={170} w={400} beat={0} year="1970" who="Seppo Linnainmaa">
      Dans son mémoire de master, une méthode générale pour calculer des dérivées « à rebours ».
    </HistCard>
    <HistCard x={600} w={400} beat={1} year="1974" who="Paul Werbos">
      Sa thèse propose de l'appliquer aux réseaux de neurones. Peu de monde la remarque.
    </HistCard>
    <HistCard x={1030} w={750} beat={2} year="1986" who="Rumelhart, Hinton & Williams" hot>
      Dans <i>Nature</i>, « Learning representations by back-propagating errors » montre que la méthode marche, et que les neurones cachés inventent leurs propres représentations. Cette fois, tout le monde l'adopte.
    </HistCard>
    <Photo src={imgRumelhart} caption="David Rumelhart, 1991" x={1060} y={690} w={150} h={180} rot={-3} zoom={1.6} origin="38% 22%" beat={2} d={300} />
    <Photo src={imgHinton} caption="Geoffrey Hinton" x={1290} y={690} w={150} h={180} rot={2.5} zoom={1.25} origin="50% 24%" beat={2} d={500} />
    <Hand x={L + 10} y={720} w={800} rot={-1.5} size={34} d={1200}>
      Souvent, en science, ce n'est pas le premier qui gagne : c'est celui qui convainc.
    </Hand>
  </Frame>
);

// ═══ 12 · Le piège de la profondeur ═════════════════════════════════════════
const Fade = ({ n, v, shown, beat, top }: { n: number; v: number; shown: string; beat: number; top: number }) => (
  <div className={beat ? `d02-on${beat}` : 'd02-in'} style={{ ...vars({ d: beat ? '0ms' : '500ms' }), position: 'absolute', left: L, top, display: 'flex', alignItems: 'center', gap: 24 }}>
    <span style={{ width: 220, fontFamily: typewriter, fontSize: 32 }}>{n} couche{n > 1 ? 's' : ''}</span>
    <span style={{ position: 'relative', width: 900, height: 34, boxSizing: 'border-box', border: `1.5px solid ${ink.rule}`, background: ink.sheet }}>
      <span
        className={beat ? `d02-grow${beat}` : 'd02-in-grow'}
        style={{ ...vars({ d: beat ? '200ms' : '700ms' }), position: 'absolute', left: 0, top: 0, bottom: 0, width: Math.max(3, 900 * v * 4), background: v < 0.01 ? ink.red : ink.blue }}
      />
    </span>
    <span style={{ width: 250, fontFamily: mono, fontSize: 26, color: v < 0.01 ? ink.red : ink.text }}>
      {shown}
    </span>
  </div>
);

const Vanishing: Page = () => (
  <Frame id="vanish" era="1990s" eyebrow="La limite de l'époque" title="Le signal s'efface avec la profondeur" beats={3}>
    <div className="d02-in" style={{ ...vars({ d: '300ms' }), position: 'absolute', left: L, top: 320, width: CW, fontSize: 27, lineHeight: 1.45, color: ink.soft }}>
      La pente de la sigmoïde ne dépasse jamais 0,25. À chaque couche traversée, le signal d'erreur est multiplié par au plus 0,25.
    </div>
    <Fade n={1} v={0.25} shown="0,25" beat={0} top={450} />
    <Fade n={2} v={0.0625} shown="0,0625" beat={1} top={530} />
    <Fade n={5} v={0.25 ** 5} shown="≈ 0,001" beat={2} top={610} />
    <Fade n={10} v={0.25 ** 10} shown="≈ 0,000 001" beat={3} top={690} />
    <div className="d02-on3" style={{ ...vars({ d: '500ms' }), position: 'absolute', left: L, top: 800, width: CW, fontFamily: typewriter, fontSize: 38, lineHeight: 1.3, color: 'var(--osd-accent)', textShadow: BLEED }}>
      Les premières couches n'apprennent presque plus rien.
    </div>
    <Hand x={L + 10} y={880} w={1500} rot={-0.8} size={30} d={300}>
      Ajoutez peu de données et des ordinateurs lents : les réseaux restent peu profonds… jusqu'en 2012 (dossier 6).
    </Hand>
  </Frame>
);

// ═══ 13 · Aujourd'hui ═══════════════════════════════════════════════════════
const Code = ({ children, top, d }: { children: ReactNode; top: number; d: number }) => (
  <div className="d02-in" style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: L, top, display: 'flex', gap: 30, alignItems: 'baseline' }}>
    {children}
  </div>
);

const Today: Page = () => (
  <Frame id="today" era="2026" eyebrow="Aujourd'hui" title="Tous les réseaux modernes s'entraînent ainsi" beats={1}>
    <div className="d02-in" style={{ ...vars({ d: '300ms' }), position: 'absolute', left: L, top: 320, width: 1060, height: 330, ...graph(40) }} />
    <Code top={350} d={500}>
      <span style={{ fontFamily: mono, fontSize: 32, width: 640, paddingLeft: 30 }}>prediction = model(x)</span>
      <span style={{ fontFamily: hand, fontWeight: 600, fontSize: 30, color: ink.blue }}># passe avant</span>
    </Code>
    <Code top={430} d={800}>
      <span style={{ fontFamily: mono, fontSize: 32, width: 640, paddingLeft: 30 }}>loss = erreur(prediction, y)</span>
      <span style={{ fontFamily: hand, fontWeight: 600, fontSize: 30, color: ink.blue }}># mesurer</span>
    </Code>
    <Code top={510} d={1100}>
      <span style={{ fontFamily: mono, fontSize: 32, width: 640, paddingLeft: 30, color: ink.red, fontWeight: 700 }}>loss.backward()</span>
      <span style={{ fontFamily: hand, fontWeight: 600, fontSize: 30, color: ink.red }}># la rétropropagation</span>
    </Code>
    <Code top={590} d={1400}>
      <span style={{ fontFamily: mono, fontSize: 32, width: 640, paddingLeft: 30 }}>optimizer.step()</span>
      <span style={{ fontFamily: hand, fontWeight: 600, fontSize: 30, color: ink.blue }}># corriger les poids</span>
    </Code>
    <div className="d02-in" style={{ ...vars({ d: '1700ms' }), position: 'absolute', left: 1290, top: 340, width: 490, fontSize: 27, lineHeight: 1.5, color: ink.soft }}>
      Les bibliothèques actuelles (PyTorch, JAX…) calculent toutes les pentes automatiquement.
    </div>
    <div className="d02-on1" style={{ position: 'absolute', left: L, top: 720, width: CW }}>
      <div style={{ fontFamily: typewriter, fontSize: 44, lineHeight: 1.25, textShadow: BLEED }}>
        Des milliards de poids, <span style={{ color: 'var(--osd-accent)' }}>une seule méthode</span>.
      </div>
      <div style={{ marginTop: 14, fontSize: 27, lineHeight: 1.45, color: ink.soft }}>
        Reconnaissance d'images, traduction, ChatGPT : tous apprennent par rétropropagation.
      </div>
    </div>
  </Frame>
);

// ═══ 14 · Ce qu'il faut retenir ═════════════════════════════════════════════
const Lesson: Page = () => (
  <Frame id="lesson" eyebrow="Ce qu'il faut retenir" beats={1}>
    <div className="d02-in-fade" style={{ position: 'absolute', left: L - 16, top: 170, fontFamily: typewriter, fontSize: 300, lineHeight: 1, color: ink.rule }}>
      «
    </div>
    <div style={{ position: 'absolute', left: L, top: 370, fontFamily: typewriter, fontSize: 72, lineHeight: 1.22, textShadow: BLEED }}>
      <Typed text="On calcule la réponse en avant." d={400} step={30} />
    </div>
    <div style={{ position: 'absolute', left: L, top: 480, fontFamily: typewriter, fontSize: 72, lineHeight: 1.22, textShadow: BLEED }}>
      <Typed text="Puis " beat={1} step={30} />
      <span style={{ color: 'var(--osd-accent)' }}>
        <Mark beat={1} d={1100}>
          <Typed text="l'erreur remonte" beat={1} d={150} step={30} />
        </Mark>
      </span>
      <Typed text=" le réseau." beat={1} d={630} step={30} />
    </div>
    <SeriesNav left={L} top={720} d={800} />
    <Credits top={940}>
      Photos via Wikimedia Commons : David Rumelhart, 1991, par Rolf Kickuth (CC BY-SA 4.0) · Geoffrey Hinton par Cmichel67 (CC BY-SA 4.0). Images recadrées et teintées.
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

const STYLE_ID = 'osd-styles-ai-history-02-retropropagation';
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
  title: "La rétropropagation : corriger chaque poids d'un réseau",
  createdAt: '2026-10-08T00:03:39.984Z',
};

export const notes: (string | undefined)[] = [
  `Dossier 2. On reprend exactement là où le Perceptron nous avait laissés : un réseau à plusieurs couches se trompe… quel poids corriger ?
La carte perforée encode « BACKPROPAGATION 1986 ».`,
  `Le Perceptron corrigeait sa couche unique parce qu'il connaissait la bonne réponse de chaque neurone.
Clic 1 : avec plusieurs couches, des centaines de poids peuvent être responsables de l'erreur.
Clic 2 : c'est le problème de l'attribution du crédit. Il va bloquer le domaine pendant près de vingt ans.`,
  `Pour la sortie, on sait ce qu'il fallait répondre : on peut mesurer l'erreur.
Clic 1 : mais les neurones cachés n'ont pas de professeur ; personne ne dit ce qu'ils auraient dû répondre.
Clic 2 : et avec la marche du Perceptron, un petit changement de poids ne change rien… puis tout bascule d'un coup. Impossible de savoir dans quel sens corriger.`,
  `Première idée : remplacer la marche par une courbe douce, la sigmoïde.
Clic 1 : sur la marche, la pente est nulle presque partout : aucun indice.
Clic 2 : sur la sigmoïde, il y a une pente partout. Un petit changement de poids donne un petit changement de sortie : on sait dans quel sens aller.`,
  `Deuxième idée : mesurer l'erreur avec un nombre, E = ½(ŷ − y)², puis descendre la pente, comme une bille dans une cuvette.
Clic 1 : la règle : on retire au poids sa pente multipliée par un petit pas η.
Clic 2 : la bille descend, et ses pas raccourcissent près du fond. C'est la descente de gradient (voir « Comment une machine apprend »).
Tout le problème : calculer cette pente pour chaque poids, même au fond du réseau.`,
  `La clé, c'est la règle de la chaîne. Un poids agit sur l'erreur à travers une chaîne d'étapes.
Clic 1 : quand w bouge, z bouge deux fois plus. Clic 2 : la sigmoïde transmet 0,20 de ce mouvement. Clic 3 : l'erreur réagit avec une pente de −0,27.
L'effet total est le produit : environ −0,11. Pente négative : augmenter w fait baisser l'erreur. Chaque maillon ne calcule qu'une petite pente locale.`,
  `Un exemple complet sur un mini-réseau : deux entrées, deux neurones cachés, une sortie. On veut qu'il réponde 1.
Clic 1 : couche cachée, 0,731 et 0,378. Clic 2 : la sortie, 0,640. Clic 3 : on visait 1, l'erreur vaut 0,065.`,
  `La passe arrière.
Clic 1 : le signal d'erreur de la sortie, δ = −0,083.
Clic 2 : il remonte par les mêmes connexions ; chaque neurone caché reçoit sa part, pondérée par le poids qui le relie à la sortie : −0,020 et +0,016.
Clic 3 : la pente de chaque poids, c'est le δ du neurone d'arrivée multiplié par l'entrée du poids.`,
  `Et on corrige tous les poids en même temps.
Clic 1 : les nouveaux poids. Les connexions de x₂ ne bougent pas : x₂ valait 0, elles n'ont pas contribué à l'erreur.
Clic 2 : on refait le calcul : la sortie passe à 0,655, l'erreur descend à 0,060. Un tout petit pas. On le répète des milliers de fois, sur des milliers d'exemples.`,
  `Résultat : le XOR qui avait fait tomber le Perceptron.
Clic 1 : la courbe d'erreur, avec son allure typique : un long plateau, puis une chute brutale quand les neurones cachés trouvent leur rôle.
Clic 2 : la zone où le réseau répond 1 : une bande entre deux frontières. Personne ne la lui a dictée.`,
  `Une idée découverte plusieurs fois.
1970 : Seppo Linnainmaa, une méthode générale pour calculer des dérivées à rebours.
Clic 1 : 1974, Paul Werbos propose de l'appliquer aux réseaux de neurones ; peu de monde le remarque.
Clic 2 : 1986, l'article de Rumelhart, Hinton et Williams dans Nature. Il montre que ça marche, et que les neurones cachés inventent leurs propres représentations. Cette fois, tout le monde l'adopte.`,
  `Mais il reste un piège. La pente de la sigmoïde ne dépasse jamais 0,25.
Clic 1, 2, 3 : à chaque couche traversée, le signal d'erreur est divisé par au moins quatre. Après dix couches, il ne reste presque rien.
C'est le problème du gradient qui s'évanouit. Avec peu de données et des ordinateurs lents, les réseaux restent peu profonds jusqu'en 2012.`,
  `Aujourd'hui, ces quatre lignes résument l'entraînement de n'importe quel réseau. La troisième, loss.backward(), c'est la rétropropagation, calculée automatiquement.
Clic : des milliards de poids, une seule méthode. ChatGPT compris.`,
  `À retenir : on calcule la réponse en avant. Clic : puis l'erreur remonte le réseau.
Prochain dossier : un retour en arrière, l'autre IA, celle des règles et des symboles.`,
];

export default [Cover, Pending, NoTeacher, Smooth, Descent, Chain, Forward, Backward, Update, Learned, History, Vanishing, Today, Lesson] satisfies Page[];
