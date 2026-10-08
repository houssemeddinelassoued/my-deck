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
import imgGoban from '@assets/ai-history/goban.jpg';
import imgHassabis from '@assets/ai-history/hassabis.jpg';
import imgLeeSedol from '@assets/ai-history/leesedol.jpg';

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
const FONT_LINK_ID = 'osd-webfont-ai-history-08-alphago';
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
const has = (n: number) => `.d08-page:has([data-osd-step="revealed"] > .d08-k${n})`;

CSS.push(`
@keyframes d08-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes d08-fade{from{opacity:0}to{opacity:1}}
@keyframes d08-type{from{opacity:0}to{opacity:1}}
@keyframes d08-draw{from{stroke-dashoffset:1.01}to{stroke-dashoffset:0}}
@keyframes d08-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes d08-pop{0%{opacity:0;transform:scale(.3)}60%{opacity:1;transform:scale(1.15)}100%{opacity:1;transform:scale(1)}}
@keyframes d08-stamp{0%{opacity:0;transform:rotate(var(--r,0deg)) scale(1.9)}35%{opacity:1}70%{transform:rotate(var(--r,0deg)) scale(.94)}100%{opacity:1;transform:rotate(var(--r,0deg)) scale(1)}}
@keyframes d08-blink{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes d08-spin{to{transform:rotate(360deg)}}
@keyframes d08-scan{0%{transform:translateY(0);opacity:0}8%{opacity:.75}92%{opacity:.75}100%{transform:translateY(var(--h,400px));opacity:0}}
@keyframes d08-back{to{stroke-dashoffset:36}}
.d08-stamp{transform:rotate(var(--r,0deg))}
.d08-in-draw{stroke-dasharray:1 2}
.d08-in-pop,.d08-pop{transform-box:fill-box;transform-origin:center}
.d08-in-grow{transform-origin:left center}
.d08-live .d08-in{animation:d08-rise 800ms ${EASE} var(--d,0ms) both}
.d08-live .d08-in-fade{animation:d08-fade 900ms ${EASE} var(--d,0ms) both}
.d08-live .d08-in-draw{animation:d08-draw 1300ms ${EASE} var(--d,0ms) both}
.d08-live .d08-in-grow{animation:d08-grow 600ms ${EASE} var(--d,0ms) both}
.d08-live .d08-in-pop{animation:d08-pop 520ms ${EASE} var(--d,0ms) both}
.d08-live .d08-in-st{animation:d08-stamp 480ms ${EASE_OUT} var(--d,0ms) both}
.d08-live .d08-ty0 .d08-c{animation:d08-type 40ms linear var(--d,0ms) both}
.d08-live .d08-lamp{animation:d08-blink var(--t,1.4s) steps(1,end) var(--d,0ms) infinite}
.d08-reel{transform-box:fill-box;transform-origin:center}
.d08-live .d08-reel{animation:d08-spin var(--t,8s) linear infinite}
.d08-scan{opacity:0}
.d08-live .d08-scan{animation:d08-scan 3.4s ease-in-out var(--d,0ms) infinite}
.d08-live .d08-back{animation:d08-back 900ms linear infinite}
@media (prefers-reduced-motion: reduce){.d08-page *{animation:none !important;transition:none !important}}
`);

// Beat utilities — visible from beat n: on (rise) / fade / typed text / stamp
// (thunk) / grow; hidden from beat n: off; stroke drawn at beat n: draw (path
// needs pathLength={1}); faded back at beat n: dim.
for (let n = 1; n <= 6; n++) {
  const at = has(n);
  CSS.push(`
.d08-on${n}{opacity:0;transform:translateY(14px);transition:opacity 500ms ${EASE} var(--d,0ms),transform 700ms ${EASE} var(--d,0ms)}
${at} .d08-on${n}{opacity:1;transform:none}
.d08-fade${n}{opacity:0;transition:opacity 550ms ${EASE} var(--d,0ms)}
${at} .d08-fade${n}{opacity:1}
.d08-ty${n} .d08-c{opacity:0}
${at} .d08-ty${n} .d08-c{opacity:1;transition:opacity 40ms linear var(--d,0ms)}
.d08-st${n}{opacity:0;transform:rotate(var(--r,0deg)) scale(1.9);transition:opacity 120ms linear var(--d,0ms),transform 440ms ${THUNK} var(--d,0ms)}
${at} .d08-st${n}{opacity:1;transform:rotate(var(--r,0deg)) scale(1)}
.d08-grow${n}{transform:scaleX(0);transform-origin:left center;transition:transform 600ms ${EASE} var(--d,0ms)}
${at} .d08-grow${n}{transform:scaleX(1)}
.d08-off${n}{transition:opacity 380ms ${EASE}}
${at} .d08-off${n}{opacity:0}
.d08-draw${n}{stroke-dasharray:1 2;stroke-dashoffset:1.01;transition:stroke-dashoffset 1000ms ${EASE} var(--d,0ms)}
${at} .d08-draw${n}{stroke-dashoffset:0}
.d08-dim${n}{transition:opacity 500ms ${EASE}}
${at} .d08-dim${n}{opacity:.22}
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
          <i className={`d08-k${i + 1}`} />
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
    className={`d08-stamp ${beat ? `d08-st${beat}` : 'd08-in-st'}`}
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
    <span className={`d08-ty${beat}`}>
      {Array.from(text).map((ch, k) =>
        ch === '\n' ? (
          <br key={k} />
        ) : (
          <span key={k} className="d08-c" style={vars({ d: `${d + i++ * step}ms` })}>
            {ch}
          </span>
        ),
      )}
    </span>
  );
};

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div
    className="d08-in-fade"
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
      className={`d08-page d08-${id}${live ? ' d08-live' : ''}`}
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
  className = 'd08-in-fade',
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
        className={beat ? `d08-draw${beat}` : 'd08-in-draw'}
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
  "id": "ai-history-08-alphago",
  "n": 8,
  "short": "AlphaGo",
  "footer": "AlphaGo — apprendre en jouant",
  "title": "AlphaGo",
  "subtitle": "Apprendre en jouant",
  "lede": "Mars 2016 : une machine bat l'un des meilleurs joueurs de go du monde, un jeu que l'on croyait hors de portée.",
  "year": "2016",
  "card": "ALPHAGO 2016",
  "metaTitle": "AlphaGo : apprendre en jouant",
  "next": {
    "n": 9,
    "title": "Le Transformer",
    "id": "ai-history-09-transformer"
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
      <rect key={i} x={pcX(c) - 4.5} y={pcY(r) - 7.5} width={9} height={15} rx={1.5} fill={ink.hole} className="d08-in-pop" style={vars({ d: `${2900 + c * 80}ms` })} />
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
  <div className="d08-in-fade" style={{ ...vars({ d: '3300ms' }), position: 'absolute', left: 1190, top: 668, width: 590, height: 262 }}>
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
      className="d08-in-fade"
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
        fontSize: 150,
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
      className="d08-in"
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
    <div className="d08-in" style={{ ...vars({ d: '2700ms' }), position: 'absolute', left: L, top: 636 }}>
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
  <div className="d08-in" style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left, top, display: 'flex', gap: 28 }}>
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
  <div className={beat ? `d08-on${beat}` : 'd08-in'} style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: x, top: y, width: w + 16 }}>
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
  <div className={beat ? `d08-on${beat}` : 'd08-in'} style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: x, top: y, width: w, height: h }}>
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
  <div className="d08-in-fade" style={{ ...vars({ d: '1500ms' }), position: 'absolute', left: L, right: RIGHT, top, fontSize: 15, lineHeight: 1.35, color: ink.muted }}>
    {children}
  </div>
);

// ─── A go board (n × n) with stones ─────────────────────────────────────────
type Stone = [number, number, 'b' | 'w'];
const GoBoard = ({ n, cell, stones, mark, x, y, className, style }: { n: number; cell: number; stones: Stone[]; mark?: [number, number]; x: number; y: number; className?: string; style?: CSSProperties }) => {
  const size = cell * (n - 1) + cell * 2;
  const p = (i: number) => cell + i * cell;
  return (
    <svg className={className} width={size} height={size} style={{ position: 'absolute', left: x, top: y, filter: 'drop-shadow(0 14px 16px rgba(70, 45, 10, 0.3))', ...style }}>
      <rect x={0} y={0} width={size} height={size} fill="#dcb46e" />
      {Array.from({ length: n }, (_, i) => (
        <g key={i}>
          <line x1={p(0)} y1={p(i)} x2={p(n - 1)} y2={p(i)} stroke="#3a2a14" strokeWidth={1.4} />
          <line x1={p(i)} y1={p(0)} x2={p(i)} y2={p(n - 1)} stroke="#3a2a14" strokeWidth={1.4} />
        </g>
      ))}
      {n === 19
        ? [3, 9, 15].flatMap((a) => [3, 9, 15].map((b) => <circle key={`${a}${b}`} cx={p(a)} cy={p(b)} r={3.5} fill="#3a2a14" />))
        : null}
      {stones.map(([c, r, col], i) => (
        <circle key={i} cx={p(c)} cy={p(r)} r={cell * 0.46} fill={col === 'b' ? '#1d1a16' : '#f7f2e6'} stroke={col === 'b' ? '#000' : '#9c9282'} strokeWidth={1} />
      ))}
      {mark ? <circle cx={p(mark[0])} cy={p(mark[1])} r={cell * 0.85} fill="none" stroke={ink.red} strokeWidth={4} /> : null}
    </svg>
  );
};

const OPENING: Stone[] = [
  [3, 3, 'b'], [15, 15, 'w'], [15, 3, 'b'], [3, 15, 'w'], [2, 9, 'b'], [16, 10, 'w'], [9, 2, 'b'], [10, 16, 'w'],
  [13, 15, 'b'], [16, 13, 'w'], [5, 2, 'b'], [2, 5, 'w'], [12, 3, 'b'], [16, 6, 'w'],
];

// ═══ 2 · Le go ══════════════════════════════════════════════════════════════
const Compare = ({ beat, label, chess, go, top }: { beat: number; label: string; chess: ReactNode; go: ReactNode; top: number }) => (
  <div className={beat ? `d08-on${beat}` : 'd08-in'} style={{ ...vars({ d: beat ? '0ms' : '500ms' }), position: 'absolute', left: 900, top, width: 880, display: 'flex', alignItems: 'baseline', paddingBottom: 18, borderBottom: `1.5px dotted ${ink.faint}` }}>
    <span style={{ width: 340, fontSize: 25, color: ink.soft }}>{label}</span>
    <span style={{ width: 240, fontFamily: typewriter, fontSize: 40, color: ink.muted }}>{chess}</span>
    <span style={{ fontFamily: typewriter, fontSize: 46, color: ink.red }}>{go}</span>
  </div>
);

const Go: Page = () => (
  <Frame id="go" era="−2500" eyebrow="Le jeu de go" title="Des règles simples, une complexité vertigineuse" beats={2}>
    <GoBoard n={19} cell={30} stones={OPENING} x={L} y={318} className="d08-in" style={vars({ d: '300ms' })} />
    <div className="d08-in" style={{ ...vars({ d: '500ms' }), position: 'absolute', left: 900, top: 320, width: 880, display: 'flex', fontWeight: 700, fontSize: 21, letterSpacing: '0.12em', color: ink.muted }}>
      <span style={{ width: 340 }} />
      <span style={{ width: 240 }}>ÉCHECS</span>
      <span style={{ color: ink.red }}>GO</span>
    </div>
    <Compare beat={0} top={380} label="cases" chess="64" go="361" />
    <Compare beat={1} top={470} label="coups possibles par tour" chess="≈ 35" go="≈ 250" />
    <Compare
      beat={2}
      top={560}
      label="positions possibles"
      chess={
        <>
          ≈ 10<sup style={{ fontSize: 24 }}>44</sup>
        </>
      }
      go={
        <>
          ≈ 10<sup style={{ fontSize: 28 }}>170</sup>
        </>
      }
    />
    <Hand x={904} y={700} w={870} rot={-1} size={31} d={1500}>
      On pose des pierres pour entourer des territoires. Le jeu existe en Chine depuis plus de 2 500 ans.
    </Hand>
  </Frame>
);

// ═══ 3 · Pourquoi Deep Blue ne suffit pas ═══════════════════════════════════
const WhyHard: Page = () => (
  <Frame id="whyhard" era="2014" eyebrow="Pourquoi la méthode de Deep Blue échoue" title="Impossible d'écrire ce qu'est une bonne position" beats={2}>
    <div style={{ position: 'absolute', left: L, top: 340, width: 1000 }}>
      <div className="d08-in" style={{ ...vars({ d: '400ms' }), display: 'flex', gap: 24, marginBottom: 36 }}>
        <span style={{ fontFamily: typewriter, fontSize: 48, color: ink.red, width: 54, flex: 'none' }}>1</span>
        <span style={{ fontSize: 28, lineHeight: 1.5 }}>
          <b>Trop de coups</b> : avec 250 possibilités par tour, l'arbre de recherche du dossier 5 explose dès quelques coups.
        </span>
      </div>
      <div className="d08-on1" style={{ display: 'flex', gap: 24 }}>
        <span style={{ fontFamily: typewriter, fontSize: 48, color: ink.red, width: 54, flex: 'none' }}>2</span>
        <span style={{ fontSize: 28, lineHeight: 1.5 }}>
          <b>Pas de bonne note</b> : aux échecs, on compte les pièces. Au go, toutes les pierres se valent ; les grands joueurs parlent de « forme » et d'intuition.
        </span>
      </div>
    </div>
    <div className="d08-on2" style={{ position: 'absolute', left: 1250, top: 340, width: 530, padding: '24px 28px', boxSizing: 'border-box', background: ink.sheet, boxShadow: SHADOW, borderLeft: `6px solid ${ink.red}` }}>
      <Label c={ink.red}>L'avis des experts, vers 2014</Label>
      <div style={{ marginTop: 12, fontFamily: typewriter, fontSize: 32, lineHeight: 1.3, textShadow: BLEED }}>« Une machine au niveau des meilleurs ? Pas avant une dizaine d'années. »</div>
    </div>
    <Photo src={imgGoban} caption="Un goban traditionnel" x={1360} y={640} w={250} h={190} rot={2} d={700} />
  </Frame>
);

// ═══ 4 · Le renforcement ════════════════════════════════════════════════════
const LoopBox = ({ x, y, w, title, sub }: { x: number; y: number; w: number; title: string; sub: string }) => (
  <g>
    <rect x={x} y={y} width={w} height={130} rx={10} fill={ink.sheet} stroke={ink.text} strokeWidth={3} />
    <text x={x + w / 2} y={y + 60} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: 38 }}>
      {title}
    </text>
    <text x={x + w / 2} y={y + 98} textAnchor="middle" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
      {sub}
    </text>
  </g>
);

const Reinforcement: Page = () => (
  <Frame id="rl" era="Méthode" eyebrow="L'apprentissage par renforcement" title="Apprendre par essais, erreurs et récompenses" beats={3}>
    <svg width={1000} height={520} style={{ position: 'absolute', left: L, top: 320, overflow: 'visible' }}>
      <LoopBox x={0} y={180} w={300} title="L'agent" sub="le joueur" />
      <LoopBox x={640} y={180} w={330} title="Le jeu" sub="l'environnement" />
      <g className="d08-fade1">
        <path d="M 150 170 C 150 40, 805 40, 805 166" fill="none" stroke={ink.blue} strokeWidth={4} />
        <polygon points={head(805, 176, 90, 16)} fill={ink.blue} />
        <text x={478} y={60} textAnchor="middle" style={{ fontFamily: hand, fontWeight: 600, fontSize: 34 }} fill={ink.blue}>
          une action : jouer un coup
        </text>
      </g>
      <g className="d08-fade2">
        <path d="M 805 320 C 805 470, 150 470, 150 324" fill="none" stroke={ink.red} strokeWidth={4} />
        <polygon points={head(150, 314, -90, 16)} fill={ink.red} />
        <text x={478} y={480} textAnchor="middle" style={{ fontFamily: hand, fontWeight: 600, fontSize: 34 }} fill={ink.red}>
          la nouvelle position… et, à la fin, gagné ou perdu
        </text>
      </g>
    </svg>
    <div className="d08-in" style={{ ...vars({ d: '500ms' }), position: 'absolute', left: 1250, top: 340, width: 530, fontSize: 27, lineHeight: 1.5 }}>
      Personne ne donne la bonne réponse à chaque coup. Seulement une récompense : <b>+1</b> si on gagne, <b>−1</b> si on perd.
    </div>
    <div className="d08-on3" style={{ position: 'absolute', left: 1250, top: 580, width: 530, fontSize: 27, lineHeight: 1.5 }}>
      Après des millions de parties, on renforce les choix qui ont mené à la victoire.
      <div style={{ marginTop: 12, fontFamily: typewriter, fontSize: 32, color: 'var(--osd-accent)' }}>Comme un enfant qui apprend en jouant.</div>
    </div>
  </Frame>
);

// ═══ 5 · Deux réseaux ═══════════════════════════════════════════════════════
const NetCard = ({ x, beat, name, q, children, c }: { x: number; beat: number; name: string; q: string; children: ReactNode; c: string }) => (
  <div className={beat ? `d08-on${beat}` : 'd08-in'} style={{ ...vars({ d: beat ? '0ms' : '400ms' }), position: 'absolute', left: x, top: 320, width: 770, height: 520, padding: '24px 30px', boxSizing: 'border-box', background: ink.sheet, boxShadow: SHADOW, borderTop: `6px solid ${c}` }}>
    <div style={{ fontFamily: typewriter, fontSize: 40, color: c, textShadow: BLEED }}>{name}</div>
    <div style={{ marginTop: 8, fontFamily: hand, fontWeight: 600, fontSize: 34, color: ink.blue }}>{q}</div>
    <div style={{ marginTop: 14 }}>{children}</div>
  </div>
);

const HEAT: [number, number, number][] = [
  [9, 4, 0.9], [8, 4, 0.5], [10, 5, 0.6], [9, 5, 0.35], [4, 9, 0.3], [14, 9, 0.25], [10, 4, 0.2],
];

const TwoNets: Page = () => (
  <Frame id="nets" era="2016" eyebrow="Le cerveau d'AlphaGo" title="Deux réseaux pour regarder le plateau" beats={2}>
    <NetCard x={170} beat={0} name="Réseau de politique" q="« Quels coups valent la peine d'être essayés ? »" c={ink.red}>
      <svg width={700} height={300}>
        <g transform="translate(0 6) scale(0.62)">
          <rect x={0} y={0} width={420} height={420} fill="#dcb46e" />
          {Array.from({ length: 13 }, (_, i) => (
            <g key={i}>
              <line x1={30} y1={30 + i * 30} x2={390} y2={30 + i * 30} stroke="#3a2a14" />
              <line x1={30 + i * 30} y1={30} x2={30 + i * 30} y2={390} stroke="#3a2a14" />
            </g>
          ))}
          {HEAT.map(([c, r, p], i) => (
            <circle key={i} cx={30 + c * 30 - 60} cy={30 + r * 30} r={13} fill={`rgba(176, 53, 42, ${p})`} />
          ))}
        </g>
        <text x={300} y={50} style={{ fontSize: 24 }} fill={ink.text}>
          Une probabilité
        </text>
        <text x={300} y={82} style={{ fontSize: 24 }} fill={ink.text}>
          pour chaque case.
        </text>
        <text x={300} y={120} style={{ fontSize: 24 }} fill={ink.text}>
          On ne cherche que parmi
        </text>
        <text x={300} y={152} style={{ fontSize: 24 }} fill={ink.text}>
          les plus prometteurs.
        </text>
        <text x={300} y={220} style={{ fontFamily: hand, fontWeight: 600, fontSize: 30 }} fill={ink.red}>
          → l'arbre devient étroit
        </text>
      </svg>
    </NetCard>
    <NetCard x={1010} beat={1} name="Réseau de valeur" q="« Qui va gagner depuis cette position ? »" c={ink.blue}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 30, marginTop: 30 }}>
        <div style={{ flex: 'none', whiteSpace: 'nowrap', fontFamily: typewriter, fontSize: 90, color: ink.blue }}>68 %</div>
        <div style={{ fontSize: 24, lineHeight: 1.45 }}>de chances de victoire pour Noir (exemple)</div>
      </div>
      <div style={{ marginTop: 30, fontSize: 24, lineHeight: 1.45 }}>Plus besoin de jouer la partie jusqu'au bout pour juger une position.</div>
      <div style={{ marginTop: 26, fontFamily: hand, fontWeight: 600, fontSize: 30, color: ink.blue }}>→ l'arbre devient court</div>
    </NetCard>
    <Hand x={L + 10} y={870} w={1500} rot={-0.8} size={30} d={0}>
      Les deux guident une recherche dans l'arbre des coups, comme celle de Deep Blue, mais bien plus ciblée.
    </Hand>
  </Frame>
);

// ═══ 6 · Comment il apprend ═════════════════════════════════════════════════
const Phase = ({ x, beat, k, title, n, children }: { x: number; beat: number; k: string; title: string; n: string; children: ReactNode }) => (
  <div className={beat ? `d08-on${beat}` : 'd08-in'} style={{ ...vars({ d: beat ? '0ms' : '400ms' }), position: 'absolute', left: x, top: 330, width: 500, height: 470, padding: '24px 30px', boxSizing: 'border-box', background: ink.sheet, boxShadow: SHADOW }}>
    <div style={{ fontFamily: typewriter, fontSize: 70, lineHeight: 1, color: ink.red }}>{k}</div>
    <div style={{ marginTop: 12, fontFamily: typewriter, fontSize: 36, textShadow: BLEED }}>{title}</div>
    <div style={{ marginTop: 14, fontFamily: typewriter, fontSize: 30, color: ink.blue }}>{n}</div>
    <div style={{ marginTop: 14, fontSize: 24, lineHeight: 1.45, color: ink.soft }}>{children}</div>
  </div>
);

const Training: Page = () => (
  <Frame id="training" era="2015" eyebrow="L'entraînement" title="Imiter les humains, puis se dépasser seul" beats={2}>
    <Phase x={170} beat={0} k="1" title="Imiter" n="30 millions de coups">
      tirés de parties de bons joueurs en ligne. Le réseau apprend à prédire le coup qu'un expert jouerait.
    </Phase>
    <Phase x={725} beat={1} k="2" title="Jouer contre soi" n="des millions de parties">
      contre ses versions précédentes. C'est l'apprentissage par renforcement : il devient plus fort que ses modèles.
    </Phase>
    <Phase x={1280} beat={2} k="3" title="Juger" n="30 millions de positions">
      tirées de ces parties, chacune avec son résultat final. Le réseau de valeur apprend à prédire le gagnant.
    </Phase>
  </Frame>
);

// ═══ 7 · Séoul, mars 2016 ═══════════════════════════════════════════════════
const GameBox = ({ n, w, beat }: { n: number; w: 'A' | 'L'; beat: number }) => (
  <div className={beat ? `d08-on${beat}` : 'd08-in'} style={{ ...vars({ d: beat ? '0ms' : `${400 + n * 120}ms` }), width: 170, textAlign: 'center' }}>
    <div style={{ fontSize: 21, color: ink.muted }}>Partie {n}</div>
    <div style={{ marginTop: 8, height: 90, display: 'grid', placeItems: 'center', background: ink.sheet, border: `2.5px solid ${w === 'A' ? ink.blue : ink.red}`, fontFamily: typewriter, fontSize: 25, color: w === 'A' ? ink.blue : ink.red }}>
      {w === 'A' ? 'AlphaGo' : 'Lee Sedol'}
    </div>
  </div>
);

const Seoul: Page = () => (
  <Frame id="seoul" era="2016" eyebrow="Séoul, 9 – 15 mars 2016" title="AlphaGo contre Lee Sedol" beats={2}>
    <div style={{ position: 'absolute', left: L, top: 340, display: 'flex', gap: 18 }}>
      <GameBox n={1} w="A" beat={0} />
      <GameBox n={2} w="A" beat={0} />
      <GameBox n={3} w="A" beat={0} />
      <GameBox n={4} w="L" beat={1} />
      <GameBox n={5} w="A" beat={2} />
    </div>
    <div className="d08-in" style={{ ...vars({ d: '900ms' }), position: 'absolute', left: L, top: 520, width: 950, fontSize: 27, lineHeight: 1.5 }}>
      Lee Sedol, 18 titres internationaux, l'un des meilleurs joueurs de la décennie. Des dizaines de millions de spectateurs suivent le match.
    </div>
    <div className="d08-on2" style={{ position: 'absolute', left: L, top: 680, fontFamily: typewriter, fontSize: 64, lineHeight: 1, textShadow: BLEED }}>
      AlphaGo 4 – <span style={{ color: ink.red }}>1</span> Lee Sedol
    </div>
    <Photo src={imgLeeSedol} caption="Lee Sedol, 2016" x={1290} y={330} w={210} h={270} rot={2.5} origin="50% 22%" d={500} />
    <Stamp pos={{ left: 1260, top: 700 }} rot={-8} size={46} beat={2} d={300}>
      Dix ans d'avance
    </Stamp>
  </Frame>
);

// ═══ 8 · Le coup 37 ═════════════════════════════════════════════════════════
const M37: Stone[] = [
  [3, 3, 'b'], [15, 3, 'w'], [3, 15, 'w'], [15, 15, 'b'], [13, 2, 'b'], [16, 5, 'w'], [16, 8, 'w'], [13, 4, 'b'],
  [15, 10, 'w'], [12, 16, 'w'], [9, 15, 'b'], [2, 12, 'b'], [5, 16, 'b'], [16, 12, 'b'], [17, 11, 'w'], [13, 9, 'b'],
];

const Move37: Page = () => (
  <Frame id="m37" era="2016" eyebrow="Partie 2 · 10 mars 2016" title="Le coup 37 : impensable pour un humain" beats={2}>
    <GoBoard n={19} cell={28} stones={M37} mark={[13, 9]} x={L} y={318} className="d08-in" style={vars({ d: '300ms' })} />
    <div className="d08-in" style={{ ...vars({ d: '700ms' }), position: 'absolute', left: 820, top: 340, width: 960, fontSize: 27, lineHeight: 1.5 }}>
      AlphaGo pose une pierre noire sur la <b>5e ligne</b>, loin du bord, là où la tradition dit de jouer plus bas.
    </div>
    <div className="d08-on1" style={{ position: 'absolute', left: 820, top: 480, width: 960, fontSize: 27, lineHeight: 1.5 }}>
      Les commentateurs croient à une erreur. Lee Sedol quitte la salle et met près de quinze minutes à répondre.
    </div>
    <div className="d08-on2" style={{ position: 'absolute', left: 820, top: 630, width: 960 }}>
      <div style={{ fontFamily: typewriter, fontSize: 40, lineHeight: 1.25, color: 'var(--osd-accent)', textShadow: BLEED }}>
        Son réseau estimait à 1 sur 10 000 la chance qu'un humain le joue.
      </div>
      <div style={{ marginTop: 12, fontSize: 26, color: ink.soft }}>Cent coups plus tard, ce coup s'avère décisif. Il est aujourd'hui étudié par les joueurs.</div>
    </div>
    <Hand x={L + 10} y={880} w={600} rot={-1} size={28} d={1500}>
      schéma illustratif, pas la position réelle
    </Hand>
  </Frame>
);

// ═══ 9 · Le coup 78 ═════════════════════════════════════════════════════════
const Move78: Page = () => (
  <Frame id="m78" era="2016" eyebrow="Partie 4 · 13 mars 2016" title="Le coup 78 : la réponse de l'humain" beats={2}>
    <div className="d08-in" style={{ ...vars({ d: '400ms' }), position: 'absolute', left: L, top: 340, width: 1000, fontSize: 28, lineHeight: 1.5 }}>
      Mené 3 à 0, Lee Sedol joue un coup en plein centre que personne n'attendait, ni les commentateurs, ni AlphaGo.
    </div>
    <div className="d08-on1" style={{ position: 'absolute', left: L, top: 500, width: 1000, fontSize: 28, lineHeight: 1.5 }}>
      AlphaGo l'avait jugé très improbable. Il se met alors à jouer des coups étranges, et perd.
    </div>
    <div className="d08-on2" style={{ position: 'absolute', left: L, top: 660, width: 1000 }}>
      <div style={{ fontFamily: typewriter, fontSize: 44, lineHeight: 1.25, textShadow: BLEED }}>
        La seule victoire humaine du match. Les joueurs l'appellent « <span style={{ color: 'var(--osd-accent)' }}>le coup divin</span> ».
      </div>
    </div>
    <Photo src={imgLeeSedol} caption="Lee Sedol" x={1350} y={340} w={200} h={260} rot={-2.5} origin="50% 22%" d={600} />
    <Hand x={1300} y={660} w={480} rot={-2} size={30} d={1300}>
      En 2019, Lee Sedol prend sa retraite : « il y a désormais une entité qu'on ne peut pas battre ».
    </Hand>
  </Frame>
);

// ═══ 10 · AlphaGo Zero ══════════════════════════════════════════════════════
const ZeroBar = ({ beat, label, w, c, note }: { beat: number; label: string; w: number; c: string; note: string }) => (
  <div className={beat ? `d08-on${beat}` : 'd08-in'} style={{ ...vars({ d: beat ? '0ms' : '500ms' }), marginBottom: 34 }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
      <span style={{ fontFamily: typewriter, fontSize: 32 }}>{label}</span>
      <span style={{ fontSize: 23, color: ink.muted }}>{note}</span>
    </div>
    <div style={{ marginTop: 8, width: 1000, height: 32, background: ink.sheet, border: `1.5px solid ${ink.rule}` }}>
      <div className={beat ? `d08-grow${beat}` : 'd08-in-grow'} style={{ ...vars({ d: '300ms' }), width: w, height: '100%', background: c }} />
    </div>
  </div>
);

const Zero: Page = () => (
  <Frame id="zero" era="2017" eyebrow="Octobre 2017" title="AlphaGo Zero : plus besoin des humains" beats={3}>
    <div style={{ position: 'absolute', left: L, top: 340 }}>
      <ZeroBar beat={0} label="AlphaGo (2016)" note="parties humaines + jeu contre soi" w={720} c={ink.faint} />
      <ZeroBar beat={1} label="AlphaGo Zero (2017)" note="seulement les règles, rien d'autre" w={1000} c={ink.red} />
    </div>
    <div className="d08-on2" style={{ position: 'absolute', left: L, top: 580, width: 1000, fontSize: 28, lineHeight: 1.5 }}>
      Il part de coups au hasard et ne joue que contre lui-même. Après trois jours, il bat la version qui avait vaincu Lee Sedol… <b style={{ color: ink.red }}>100 parties à 0</b>.
    </div>
    <div className="d08-on3" style={{ position: 'absolute', left: L, top: 740, width: 1000, fontSize: 28, lineHeight: 1.5 }}>
      <b>Fin 2017, AlphaZero</b> : la même méthode apprend aussi les échecs et le shogi, et bat les meilleurs programmes spécialisés.
    </div>
    <GoBoard n={9} cell={46} stones={[[2, 2, 'b'], [6, 6, 'w'], [6, 2, 'b'], [2, 6, 'w'], [4, 4, 'b'], [5, 3, 'w']]} x={1320} y={340} className="d08-in" style={vars({ d: '600ms' })} />
    <Hand x={1320} y={830} w={460} rot={-2} size={30} d={1200}>
      Il redécouvre seul des stratégies humaines… et en invente d'autres.
    </Hand>
  </Frame>
);

// ═══ 11 · Au-delà des jeux ══════════════════════════════════════════════════
const Beyond: Page = () => (
  <Frame id="beyond" era="2020–2024" eyebrow="Au-delà des jeux" title="Des jeux à la science" beats={2}>
    <div className="d08-in" style={{ ...vars({ d: '400ms' }), position: 'absolute', left: L, top: 340, width: 1000, padding: '22px 28px', boxSizing: 'border-box', background: ink.sheet, boxShadow: SHADOW, borderLeft: `6px solid ${ink.red}` }}>
      <Label c={ink.red}>2020 · AlphaFold 2</Label>
      <div style={{ marginTop: 10, fontSize: 27, lineHeight: 1.5 }}>
        La même équipe, DeepMind, prédit la forme 3D des protéines à partir de leur séquence, un problème ouvert depuis 50 ans.
      </div>
      <div style={{ marginTop: 10, fontSize: 24, color: ink.soft }}>Prix Nobel de chimie 2024 pour Demis Hassabis et John Jumper (avec David Baker).</div>
    </div>
    <div className="d08-on1" style={{ position: 'absolute', left: L, top: 680, width: 1000, padding: '22px 28px', boxSizing: 'border-box', background: ink.sheet, boxShadow: SHADOW, borderLeft: `6px solid ${ink.blue}` }}>
      <Label c={ink.blue}>Le renforcement, ailleurs</Label>
      <div style={{ marginTop: 10, fontSize: 27, lineHeight: 1.5 }}>
        Récompenser les bonnes réponses sert aussi à régler les assistants comme ChatGPT, avec des notes données par des humains (dossier 10).
      </div>
    </div>
    <Photo src={imgHassabis} caption="Demis Hassabis, 2024" x={1340} y={340} w={200} h={260} rot={2.5} zoom={1.05} origin="50% 25%" d={600} />
    <Hand x={1300} y={690} w={480} rot={-2} size={30} d={1500}>
      Hassabis, joueur d'échecs prodige, a cofondé DeepMind en 2010.
    </Hand>
  </Frame>
);

// ═══ 12 · Ce qu'il faut retenir ═════════════════════════════════════════════
const Lesson: Page = () => (
  <Frame id="lesson" eyebrow="Ce qu'il faut retenir" beats={1}>
    <div className="d08-in-fade" style={{ position: 'absolute', left: L - 16, top: 170, fontFamily: typewriter, fontSize: 300, lineHeight: 1, color: ink.rule }}>
      «
    </div>
    <div style={{ position: 'absolute', left: L, top: 370, fontFamily: typewriter, fontSize: 66, lineHeight: 1.22, textShadow: BLEED }}>
      <Typed text="Deep Blue calculait. AlphaGo a appris" d={400} step={28} />
    </div>
    <div style={{ position: 'absolute', left: L, top: 470, fontFamily: typewriter, fontSize: 66, lineHeight: 1.22, textShadow: BLEED }}>
      <Typed text="à juger, " beat={1} step={30} />
      <span style={{ color: 'var(--osd-accent)' }}>
        <Mark beat={1} d={1100}>
          <Typed text="en jouant contre lui-même" beat={1} d={270} step={30} />
        </Mark>
      </span>
      <Typed text="." beat={1} d={1050} step={30} />
    </div>
    <SeriesNav left={L} top={700} d={800} />
    <Credits top={930}>
      Photos via Wikimedia Commons : goban par Goban1 (domaine public) · Lee Sedol, 2016, LG Electronics (CC BY 2.0) · Demis Hassabis, 2024, par John Sears (CC BY-SA 4.0). Images recadrées et
      teintées.
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

const STYLE_ID = 'osd-styles-ai-history-08-alphago';
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
  title: "AlphaGo : apprendre en jouant",
  createdAt: '2026-10-08T03:54:35.853Z',
};

export const notes: (string | undefined)[] = [
  `Dossier 8 : mars 2016, une machine bat l'un des meilleurs joueurs de go du monde. Cette fois, elle a appris.
La carte perforée encode « ALPHAGO 2016 ».`,
  `Le go : un plateau de 19 sur 19, des pierres noires et blanches, on entoure des territoires. Un jeu vieux de plus de 2 500 ans.
Clic 1 : environ 250 coups possibles par tour, contre 35 aux échecs.
Clic 2 : environ 10 puissance 170 positions possibles, contre 10 puissance 44 aux échecs.`,
  `Pourquoi la méthode de Deep Blue échoue : trop de coups, l'arbre explose.
Clic 1 : et surtout, impossible d'écrire une bonne note pour une position ; les grands joueurs parlent de forme et d'intuition.
Clic 2 : vers 2014, les experts pensaient qu'il faudrait encore une dizaine d'années.`,
  `L'outil : l'apprentissage par renforcement. Un agent agit dans un environnement.
Clic 1 : il joue un coup. Clic 2 : il observe le résultat, et à la fin, une récompense : +1 s'il gagne, −1 s'il perd.
Clic 3 : après des millions de parties, on renforce les choix qui ont mené à la victoire.`,
  `AlphaGo utilise deux réseaux convolutifs, comme ceux du dossier 4, qui regardent le plateau comme une image.
Le réseau de politique propose les coups prometteurs : l'arbre devient étroit.
Clic 1 : le réseau de valeur estime qui va gagner : plus besoin de jouer jusqu'au bout, l'arbre devient court.
Les deux guident une recherche comme celle de Deep Blue, en bien plus ciblée.`,
  `L'entraînement en trois temps. D'abord imiter : 30 millions de coups de bons joueurs.
Clic 1 : puis jouer contre ses propres versions, des millions de parties : il dépasse ses modèles.
Clic 2 : enfin apprendre à juger une position à partir des résultats de ces parties.`,
  `Séoul, mars 2016. Face à lui, Lee Sedol, 18 titres internationaux.
AlphaGo gagne les trois premières parties. Clic 1 : Lee Sedol gagne la quatrième. Clic 2 : AlphaGo gagne la cinquième : 4 à 1. Une décennie d'avance sur les prévisions.`,
  `Le moment le plus célèbre : le coup 37 de la deuxième partie. Une pierre sur la cinquième ligne, contre toute tradition.
Clic 1 : les commentateurs croient à une erreur ; Lee Sedol quitte la salle et met près de quinze minutes à répondre.
Clic 2 : le réseau d'AlphaGo estimait à une chance sur 10 000 qu'un humain joue ce coup. Il s'avère décisif.`,
  `Mais l'humain a sa revanche. Partie 4, coup 78 : Lee Sedol joue un coup au centre que personne n'attendait.
Clic 1 : AlphaGo l'avait jugé improbable, il se met à jouer bizarrement et perd.
Clic 2 : la seule victoire humaine, surnommée le coup divin. Lee Sedol prendra sa retraite en 2019.`,
  `2017 : AlphaGo Zero. Clic 1 : plus aucune partie humaine, seulement les règles.
Clic 2 : après trois jours de jeu contre lui-même, il bat la version de 2016 cent parties à zéro.
Clic 3 : AlphaZero applique la même méthode aux échecs et au shogi.`,
  `Au-delà des jeux : en 2020, AlphaFold prédit la forme des protéines ; prix Nobel de chimie 2024 pour Demis Hassabis et John Jumper.
Clic 1 : et l'idée de récompenser les bonnes réponses servira à régler ChatGPT : dossier 10.`,
  `À retenir : Deep Blue calculait. AlphaGo a appris à juger, clic, en jouant contre lui-même.
Prochain dossier : le Transformer, l'architecture derrière tous les modèles de langage.`,
];

export default [Cover, Go, WhyHard, Reinforcement, TwoNets, Training, Seoul, Move37, Move78, Zero, Beyond, Lesson] satisfies Page[];
