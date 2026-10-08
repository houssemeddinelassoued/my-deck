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
import imgDeepBlue from '@assets/ai-history/deepblue.jpg';
import imgKasparov from '@assets/ai-history/kasparov.jpg';

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
const FONT_LINK_ID = 'osd-webfont-ai-history-05-deep-blue';
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
const has = (n: number) => `.d05-page:has([data-osd-step="revealed"] > .d05-k${n})`;

CSS.push(`
@keyframes d05-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes d05-fade{from{opacity:0}to{opacity:1}}
@keyframes d05-type{from{opacity:0}to{opacity:1}}
@keyframes d05-draw{from{stroke-dashoffset:1.01}to{stroke-dashoffset:0}}
@keyframes d05-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes d05-pop{0%{opacity:0;transform:scale(.3)}60%{opacity:1;transform:scale(1.15)}100%{opacity:1;transform:scale(1)}}
@keyframes d05-stamp{0%{opacity:0;transform:rotate(var(--r,0deg)) scale(1.9)}35%{opacity:1}70%{transform:rotate(var(--r,0deg)) scale(.94)}100%{opacity:1;transform:rotate(var(--r,0deg)) scale(1)}}
@keyframes d05-blink{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes d05-spin{to{transform:rotate(360deg)}}
@keyframes d05-scan{0%{transform:translateY(0);opacity:0}8%{opacity:.75}92%{opacity:.75}100%{transform:translateY(var(--h,400px));opacity:0}}
@keyframes d05-back{to{stroke-dashoffset:36}}
.d05-stamp{transform:rotate(var(--r,0deg))}
.d05-in-draw{stroke-dasharray:1 2}
.d05-in-pop,.d05-pop{transform-box:fill-box;transform-origin:center}
.d05-in-grow{transform-origin:left center}
.d05-live .d05-in{animation:d05-rise 800ms ${EASE} var(--d,0ms) both}
.d05-live .d05-in-fade{animation:d05-fade 900ms ${EASE} var(--d,0ms) both}
.d05-live .d05-in-draw{animation:d05-draw 1300ms ${EASE} var(--d,0ms) both}
.d05-live .d05-in-grow{animation:d05-grow 600ms ${EASE} var(--d,0ms) both}
.d05-live .d05-in-pop{animation:d05-pop 520ms ${EASE} var(--d,0ms) both}
.d05-live .d05-in-st{animation:d05-stamp 480ms ${EASE_OUT} var(--d,0ms) both}
.d05-live .d05-ty0 .d05-c{animation:d05-type 40ms linear var(--d,0ms) both}
.d05-live .d05-lamp{animation:d05-blink var(--t,1.4s) steps(1,end) var(--d,0ms) infinite}
.d05-reel{transform-box:fill-box;transform-origin:center}
.d05-live .d05-reel{animation:d05-spin var(--t,8s) linear infinite}
.d05-scan{opacity:0}
.d05-live .d05-scan{animation:d05-scan 3.4s ease-in-out var(--d,0ms) infinite}
.d05-live .d05-back{animation:d05-back 900ms linear infinite}
@media (prefers-reduced-motion: reduce){.d05-page *{animation:none !important;transition:none !important}}
`);

// Beat utilities — visible from beat n: on (rise) / fade / typed text / stamp
// (thunk) / grow; hidden from beat n: off; stroke drawn at beat n: draw (path
// needs pathLength={1}); faded back at beat n: dim.
for (let n = 1; n <= 6; n++) {
  const at = has(n);
  CSS.push(`
.d05-on${n}{opacity:0;transform:translateY(14px);transition:opacity 500ms ${EASE} var(--d,0ms),transform 700ms ${EASE} var(--d,0ms)}
${at} .d05-on${n}{opacity:1;transform:none}
.d05-fade${n}{opacity:0;transition:opacity 550ms ${EASE} var(--d,0ms)}
${at} .d05-fade${n}{opacity:1}
.d05-ty${n} .d05-c{opacity:0}
${at} .d05-ty${n} .d05-c{opacity:1;transition:opacity 40ms linear var(--d,0ms)}
.d05-st${n}{opacity:0;transform:rotate(var(--r,0deg)) scale(1.9);transition:opacity 120ms linear var(--d,0ms),transform 440ms ${THUNK} var(--d,0ms)}
${at} .d05-st${n}{opacity:1;transform:rotate(var(--r,0deg)) scale(1)}
.d05-grow${n}{transform:scaleX(0);transform-origin:left center;transition:transform 600ms ${EASE} var(--d,0ms)}
${at} .d05-grow${n}{transform:scaleX(1)}
.d05-off${n}{transition:opacity 380ms ${EASE}}
${at} .d05-off${n}{opacity:0}
.d05-draw${n}{stroke-dasharray:1 2;stroke-dashoffset:1.01;transition:stroke-dashoffset 1000ms ${EASE} var(--d,0ms)}
${at} .d05-draw${n}{stroke-dashoffset:0}
.d05-dim${n}{transition:opacity 500ms ${EASE}}
${at} .d05-dim${n}{opacity:.22}
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
          <i className={`d05-k${i + 1}`} />
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
    className={`d05-stamp ${beat ? `d05-st${beat}` : 'd05-in-st'}`}
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
    <span className={`d05-ty${beat}`}>
      {Array.from(text).map((ch, k) =>
        ch === '\n' ? (
          <br key={k} />
        ) : (
          <span key={k} className="d05-c" style={vars({ d: `${d + i++ * step}ms` })}>
            {ch}
          </span>
        ),
      )}
    </span>
  );
};

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div
    className="d05-in-fade"
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
      className={`d05-page d05-${id}${live ? ' d05-live' : ''}`}
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
  className = 'd05-in-fade',
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
        className={beat ? `d05-draw${beat}` : 'd05-in-draw'}
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
  "id": "ai-history-05-deep-blue",
  "n": 5,
  "short": "Deep Blue bat Kasparov",
  "footer": "Deep Blue — la victoire du calcul",
  "title": "Deep Blue",
  "subtitle": "La machine bat le champion du monde",
  "lede": "Mai 1997 : un ordinateur d'IBM bat Garry Kasparov aux échecs, sans rien avoir appris.",
  "year": "1997",
  "card": "DEEP BLUE 1997",
  "metaTitle": "Deep Blue bat Kasparov : la victoire du calcul",
  "next": {
    "n": 6,
    "title": "AlexNet & ImageNet",
    "id": "ai-history-06-alexnet"
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
      <rect key={i} x={pcX(c) - 4.5} y={pcY(r) - 7.5} width={9} height={15} rx={1.5} fill={ink.hole} className="d05-in-pop" style={vars({ d: `${2900 + c * 80}ms` })} />
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
  <div className="d05-in-fade" style={{ ...vars({ d: '3300ms' }), position: 'absolute', left: 1190, top: 668, width: 590, height: 262 }}>
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
      className="d05-in-fade"
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
      className="d05-in"
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
    <div className="d05-in" style={{ ...vars({ d: '2700ms' }), position: 'absolute', left: L, top: 636 }}>
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
  <div className="d05-in" style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left, top, display: 'flex', gap: 28 }}>
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
  <div className={beat ? `d05-on${beat}` : 'd05-in'} style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: x, top: y, width: w + 16 }}>
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
  <div className={beat ? `d05-on${beat}` : 'd05-in'} style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: x, top: y, width: w, height: h }}>
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
  <div className="d05-in-fade" style={{ ...vars({ d: '1500ms' }), position: 'absolute', left: L, right: RIGHT, top, fontSize: 15, lineHeight: 1.35, color: ink.muted }}>
    {children}
  </div>
);

// ═══ 2 · Le défi ════════════════════════════════════════════════════════════
const Board = ({ x, y, cell }: { x: number; y: number; cell: number }) => (
  <svg width={cell * 8} height={cell * 8} style={{ position: 'absolute', left: x, top: y, filter: 'drop-shadow(0 14px 16px rgba(70, 45, 10, 0.3))' }}>
    {Array.from({ length: 64 }, (_, i) => {
      const r = Math.floor(i / 8);
      const c = i % 8;
      return <rect key={i} x={c * cell} y={r * cell} width={cell} height={cell} fill={(r + c) % 2 ? '#a88a5e' : '#efe1bd'} />;
    })}
    <rect x={0} y={0} width={cell * 8} height={cell * 8} fill="none" stroke={ink.text} strokeWidth={4} />
  </svg>
);

const BigNum = ({ beat, value, label, top }: { beat: number; value: ReactNode; label: string; top: number }) => (
  <div className={beat ? `d05-on${beat}` : 'd05-in'} style={{ ...vars({ d: beat ? '0ms' : '500ms' }), position: 'absolute', left: 900, top, width: 880 }}>
    <div style={{ fontFamily: typewriter, fontSize: 70, lineHeight: 1, color: ink.red, textShadow: BLEED }}>{value}</div>
    <div style={{ marginTop: 10, fontSize: 27, lineHeight: 1.45, color: ink.soft }}>{label}</div>
  </div>
);

const Challenge: Page = () => (
  <Frame id="challenge" era="1950" eyebrow="Le défi" title="Les échecs, épreuve reine de l'intelligence" beats={2}>
    <Board x={L} y={330} cell={70} />
    <BigNum beat={0} top={340} value="≈ 35" label="coups possibles à chaque tour, en moyenne." />
    <BigNum
      beat={1}
      top={520}
      value={
        <>
          ≈ 10<sup style={{ fontSize: 44 }}>120</sup>
        </>
      }
      label="parties différentes possibles, selon Claude Shannon (1950). Bien plus que d'atomes dans l'univers observable."
    />
    <div className="d05-on2" style={{ position: 'absolute', left: 900, top: 760, width: 880, fontSize: 27, lineHeight: 1.5 }}>
      Impossible de tout calculer. Depuis Turing et Shannon, battre un grand maître aux échecs est le grand objectif de l'IA.
    </div>
  </Frame>
);

// ═══ 3 · 1996 : Kasparov gagne ══════════════════════════════════════════════
const GameCell = ({ n, r, beat }: { n: number; r: 'K' | 'D' | '½'; beat: number }) => (
  <div className={beat ? `d05-on${beat}` : 'd05-in'} style={{ ...vars({ d: beat ? `${n * 120}ms` : `${400 + n * 120}ms` }), width: 150, textAlign: 'center' }}>
    <div style={{ fontSize: 21, color: ink.muted }}>Partie {n}</div>
    <div
      style={{
        marginTop: 8,
        height: 90,
        display: 'grid',
        placeItems: 'center',
        background: ink.sheet,
        border: `2.5px solid ${r === 'D' ? ink.blue : r === 'K' ? ink.red : ink.faint}`,
        fontFamily: typewriter,
        fontSize: r === '½' ? 34 : 25,
        color: r === 'D' ? ink.blue : r === 'K' ? ink.red : ink.muted,
      }}
    >
      {r === 'D' ? 'Deep Blue' : r === 'K' ? 'Kasparov' : 'nulle'}
    </div>
  </div>
);

const ScoreLine = ({ top, games, beat }: { top: number; games: ('K' | 'D' | '½')[]; beat: number }) => (
  <div style={{ position: 'absolute', left: L, top, display: 'flex', gap: 18 }}>
    {games.map((g, i) => (
      <GameCell key={i} n={i + 1} r={g} beat={beat} />
    ))}
  </div>
);

const Match96: Page = () => (
  <Frame id="m96" era="1996" eyebrow="Philadelphie, février 1996" title="Premier match : Kasparov gagne" beats={2}>
    <ScoreLine top={340} games={['D', 'K', '½', '½', 'K', 'K']} beat={0} />
    <div className="d05-on1" style={{ position: 'absolute', left: L, top: 520, width: 1000, fontSize: 28, lineHeight: 1.5 }}>
      Partie 1 : pour la première fois, un ordinateur bat un champion du monde en cadence de tournoi.
    </div>
    <div className="d05-on2" style={{ position: 'absolute', left: L, top: 640, fontFamily: typewriter, fontSize: 64, lineHeight: 1, textShadow: BLEED }}>
      Kasparov 4 – <span style={{ color: ink.blue }}>2</span> Deep Blue
    </div>
    <Photo src={imgKasparov} caption="Garry Kasparov" x={1290} y={330} w={210} h={270} rot={2.5} zoom={1.1} origin="45% 30%" d={500} />
    <Hand x={1260} y={680} w={520} rot={-2} size={32} d={1300}>
      IBM améliore sa machine et demande une revanche.
    </Hand>
  </Frame>
);

// ═══ 4 · Minimax ════════════════════════════════════════════════════════════
// Classic two-ply example: MAX chooses, MIN replies, leaves are evaluations.
const LEAVES = [
  [3, 12, 8],
  [2, 4, 6],
  [14, 5, 2],
];
const TX = { root: 560, kids: [220, 560, 900], leafDx: 100 };
const TY = { root: 60, kid: 250, leaf: 440 };

const TreeNode = ({ x, y, kind, value, className, hot, cut }: { x: number; y: number; kind: 'max' | 'min' | 'leaf'; value?: string; className?: string; hot?: boolean; cut?: boolean }) => (
  <g className={className}>
    {kind === 'max' ? (
      <polygon points={`${x},${y - 42} ${x + 46},${y + 30} ${x - 46},${y + 30}`} fill={hot ? ink.redSoft : ink.sheet} stroke={hot ? ink.red : ink.text} strokeWidth={3.5} />
    ) : kind === 'min' ? (
      <polygon points={`${x},${y + 42} ${x + 46},${y - 30} ${x - 46},${y - 30}`} fill={hot ? ink.redSoft : ink.sheet} stroke={hot ? ink.red : ink.text} strokeWidth={3.5} />
    ) : (
      <rect x={x - 32} y={y - 30} width={64} height={60} fill={cut ? 'transparent' : ink.sheet} stroke={cut ? ink.faint : ink.text} strokeWidth={2.5} strokeDasharray={cut ? '6 6' : undefined} />
    )}
    {value ? (
      <text x={x} y={y + (kind === 'max' ? 18 : kind === 'min' ? 4 : 11)} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: 32 }} fill={cut ? ink.faint : hot ? ink.red : ink.text}>
        {value}
      </text>
    ) : null}
  </g>
);

const TreeEdge = ({ x1, y1, x2, y2, hot, className, cut }: { x1: number; y1: number; x2: number; y2: number; hot?: boolean; className?: string; cut?: boolean }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={cut ? ink.faint : hot ? ink.red : ink.soft} strokeWidth={hot ? 5 : 2.5} strokeDasharray={cut ? '6 6' : undefined} className={className} />
);

const leafX = (b: number, i: number) => TX.kids[b] + (i - 1) * TX.leafDx;

const Tree = ({ mins, root, pruned, best }: { mins: string[]; root: string; pruned?: boolean; best?: string }) => (
  <svg width={1300} height={520} style={{ position: 'absolute', left: L, top: 330, overflow: 'visible' }}>
    {TX.kids.map((kx, b) => (
      <g key={b}>
        <TreeEdge x1={TX.root} y1={TY.root + 30} x2={kx} y2={TY.kid - 30} hot={b === 0} className={best} />
        {LEAVES[b].map((_, i) => (
          <TreeEdge key={i} x1={kx} y1={TY.kid + 42} x2={leafX(b, i)} y2={TY.leaf - 30} cut={pruned && b === 1 && i > 0} />
        ))}
      </g>
    ))}
    {LEAVES.map((row, b) =>
      row.map((v, i) => <TreeNode key={`${b}${i}`} x={leafX(b, i)} y={TY.leaf} kind="leaf" value={String(v)} cut={pruned && b === 1 && i > 0} />),
    )}
    {TX.kids.map((kx, b) => (
      <TreeNode key={b} x={kx} y={TY.kid} kind="min" value={mins[b]} />
    ))}
    <TreeNode x={TX.root} y={TY.root} kind="max" value={root} hot={!!root} />
    <g style={{ fontFamily: mono, fontSize: 21, fontWeight: 700, letterSpacing: '0.08em' }} fill={ink.muted}>
      <text x={0} y={TY.root + 8}>DEEP BLUE</text>
      <text x={0} y={TY.root + 34} style={{ fontWeight: 400 }}>(MAX)</text>
      <text x={0} y={TY.kid - 4}>ADVERSAIRE</text>
      <text x={0} y={TY.kid + 22} style={{ fontWeight: 400 }}>(MIN)</text>
      <text x={0} y={TY.leaf + 8}>NOTE</text>
    </g>
  </svg>
);

const Minimax: Page = () => (
  <Frame id="minimax" era="Méthode" eyebrow="Comment ça marche : minimax" title="Imaginer les coups, et les réponses" beats={2}>
    <div className="d05-off1">
      <Tree mins={['', '', '']} root="" />
    </div>
    <div className="d05-fade1 d05-off2">
      <Tree mins={['3', '2', '2']} root="" />
    </div>
    <div className="d05-fade2">
      <Tree mins={['3', '2', '2']} root="3" />
    </div>
    <div className="d05-in" style={{ ...vars({ d: '700ms' }), position: 'absolute', left: 1280, top: 340, width: 500, fontSize: 27, lineHeight: 1.45, color: ink.soft }}>
      Chaque feuille note une position finale : positif = bon pour Deep Blue.
    </div>
    <div className="d05-on1" style={{ position: 'absolute', left: 1280, top: 500, width: 500, fontSize: 27, lineHeight: 1.45 }}>
      L'adversaire choisit <b>le pire</b> pour nous : le minimum.
    </div>
    <div className="d05-on2" style={{ position: 'absolute', left: 1280, top: 660, width: 500, fontSize: 27, lineHeight: 1.45 }}>
      Nous choisissons <b style={{ color: ink.red }}>le meilleur</b> de ces pires : 3, le coup de gauche.
    </div>
  </Frame>
);

// ═══ 5 · Alpha-bêta ═════════════════════════════════════════════════════════
const AlphaBeta: Page = () => (
  <Frame id="alphabeta" era="Méthode" eyebrow="L'astuce : l'élagage alpha-bêta" title="Inutile d'explorer ce qui ne changera rien" beats={2}>
    <div className="d05-off1">
      <Tree mins={['3', '', '']} root="" />
    </div>
    <div className="d05-fade1">
      <Tree mins={['3', '≤ 2', '2']} root="3" pruned />
    </div>
    <svg className="d05-fade1" width={300} height={100} style={{ position: 'absolute', left: L + 440, top: 330 + TY.leaf + 40, overflow: 'visible' }}>
      <path d="M 40 0 L 220 0" stroke={ink.red} strokeWidth={4} />
      <text x={130} y={50} textAnchor="middle" style={{ fontFamily: hand, fontWeight: 600, fontSize: 32 }} fill={ink.red}>
        pas regardées
      </text>
    </svg>
    <div className="d05-in" style={{ ...vars({ d: '700ms' }), position: 'absolute', left: 1280, top: 340, width: 500, fontSize: 27, lineHeight: 1.45, color: ink.soft }}>
      La branche de gauche nous garantit déjà 3.
    </div>
    <div className="d05-on1" style={{ position: 'absolute', left: 1280, top: 470, width: 500, fontSize: 27, lineHeight: 1.45 }}>
      Au milieu, la première réponse vaut 2 : cette branche vaudra <b>au plus 2</b>. On arrête là.
    </div>
    <div className="d05-on2" style={{ position: 'absolute', left: 1280, top: 680, width: 500, fontSize: 27, lineHeight: 1.45 }}>
      <b style={{ color: ink.red }}>Même résultat</b>, moins de calcul. Sur un vrai arbre, on peut aller environ deux fois plus profond.
    </div>
  </Frame>
);

// ═══ 6 · La force brute ═════════════════════════════════════════════════════
const Rate = ({ beat, who, value, w, c }: { beat: number; who: string; value: string; w: number; c: string }) => (
  <div className={beat ? `d05-on${beat}` : 'd05-in'} style={{ ...vars({ d: beat ? '0ms' : '500ms' }), marginBottom: 44 }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
      <span style={{ fontFamily: typewriter, fontSize: 34 }}>{who}</span>
      <span style={{ fontSize: 26, color: c, fontWeight: 700 }}>{value}</span>
    </div>
    <div style={{ marginTop: 10, height: 34, width: 1000, background: ink.sheet, border: `1.5px solid ${ink.rule}` }}>
      <div className={beat ? `d05-grow${beat}` : 'd05-in-grow'} style={{ ...vars({ d: '300ms' }), width: w, height: '100%', background: c }} />
    </div>
  </div>
);

const Brute: Page = () => (
  <Frame id="brute" era="1997" eyebrow="La force brute" title="200 millions de positions par seconde" beats={2}>
    <div style={{ position: 'absolute', left: L, top: 340 }}>
      <Rate beat={0} who="Kasparov" value="quelques positions par seconde" w={4} c={ink.red} />
      <Rate beat={1} who="Deep Blue" value="≈ 200 000 000 positions par seconde" w={1000} c={ink.blue} />
    </div>
    <div className="d05-on2" style={{ position: 'absolute', left: L, top: 610, width: 1000, fontSize: 27, lineHeight: 1.5 }}>
      Un supercalculateur IBM RS/6000 SP de 30 processeurs, épaulé par <b>480 puces</b> conçues uniquement pour les échecs. Il voit en général 12 coups à l'avance, parfois bien plus.
    </div>
    <Photo src={imgDeepBlue} caption="Une des deux armoires de Deep Blue" x={1300} y={330} w={240} h={360} rot={2} origin="40% 50%" d={600} />
    <Hand x={L + 10} y={830} w={1000} rot={-1} size={30} d={1500}>
      Kasparov, lui, ne regarde que quelques coups prometteurs, mais il les choisit très bien.
    </Hand>
  </Frame>
);

// ═══ 7 · Le savoir des grands maîtres ═══════════════════════════════════════
const Ingredient = ({ beat, k, title, children }: { beat: number; k: string; title: string; children: ReactNode }) => (
  <div className={beat ? `d05-on${beat}` : 'd05-in'} style={{ ...vars({ d: beat ? '0ms' : '500ms' }), display: 'flex', gap: 26, marginBottom: 36 }}>
    <span style={{ fontFamily: typewriter, fontSize: 48, color: ink.red, width: 56, flex: 'none' }}>{k}</span>
    <div>
      <div style={{ fontFamily: typewriter, fontSize: 36, textShadow: BLEED }}>{title}</div>
      <div style={{ marginTop: 6, fontSize: 26, lineHeight: 1.45, color: ink.soft }}>{children}</div>
    </div>
  </div>
);

const Knowledge: Page = () => (
  <Frame id="knowledge" era="1997" eyebrow="Pas seulement du calcul" title="Le savoir des grands maîtres, écrit à la main" beats={2}>
    <div style={{ position: 'absolute', left: L, top: 340, width: 1050 }}>
      <Ingredient beat={0} k="1" title="Une fonction d'évaluation">
        Environ 8 000 critères pour noter une position (sécurité du roi, pions, cases contrôlées…), réglés avec l'aide de grands maîtres.
      </Ingredient>
      <Ingredient beat={1} k="2" title="Une bibliothèque d'ouvertures">
        Des milliers de débuts de partie préparés à l'avance, pour jouer les premiers coups sans calculer.
      </Ingredient>
      <Ingredient beat={2} k="3" title="Une base de fins de partie">
        Les positions avec peu de pièces, déjà résolues : le coup parfait est connu.
      </Ingredient>
    </div>
    <Stamp pos={{ left: 1350, top: 420 }} rot={-8} size={46} d={1200}>
      Rien d'appris
    </Stamp>
    <Hand x={1340} y={560} w={440} rot={-2} size={32} d={1500}>
      C'est l'IA symbolique du dossier 3 : des règles et une recherche.
    </Hand>
  </Frame>
);

// ═══ 8 · Mai 1997 ═══════════════════════════════════════════════════════════
const Match97: Page = () => (
  <Frame id="m97" era="1997" eyebrow="New York, mai 1997" title="La revanche : la machine gagne" beats={3}>
    <ScoreLine top={340} games={['K', 'D', '½', '½', '½', 'D']} beat={0} />
    <div className="d05-on1" style={{ position: 'absolute', left: L, top: 520, width: 1000, fontSize: 27, lineHeight: 1.5 }}>
      Partie 2 : un coup de Deep Blue paraît si « humain » que Kasparov soupçonne une aide extérieure. IBM dément.
    </div>
    <div className="d05-on2" style={{ position: 'absolute', left: L, top: 640, width: 1000, fontSize: 27, lineHeight: 1.5 }}>
      Partie 6, le 11 mai : Kasparov abandonne après seulement 19 coups.
    </div>
    <div className="d05-on3" style={{ position: 'absolute', left: L, top: 760, fontFamily: typewriter, fontSize: 64, lineHeight: 1, textShadow: BLEED }}>
      Deep Blue 3½ – <span style={{ color: ink.red }}>2½</span> Kasparov
    </div>
    <Photo src={imgKasparov} caption="Garry Kasparov" x={1310} y={330} w={190} h={240} rot={-2.5} zoom={1.1} origin="45% 30%" d={500} />
    <Stamp pos={{ left: 1290, top: 680 }} rot={-8} size={50} beat={3} d={400}>
      Une première
    </Stamp>
  </Frame>
);

// ═══ 9 · Ce que Deep Blue n'était pas ═══════════════════════════════════════
const Not: Page = () => (
  <Frame id="not" era="1997" eyebrow="Une victoire, mais laquelle ?" title="Ce que Deep Blue n'était pas" beats={3}>
    <ul style={{ position: 'absolute', left: L, top: 340, width: 1000, margin: 0, padding: 0, listStyle: 'none', fontSize: 29, lineHeight: 1.45 }}>
      <li className="d05-in" style={{ ...vars({ d: '400ms' }), marginBottom: 30 }}>
        – Il <b>n'apprenait pas</b> : ses règles avaient été écrites et réglées par ses concepteurs.
      </li>
      <li className="d05-on1" style={{ marginBottom: 30 }}>
        – Il ne savait faire <b>qu'une chose</b> : jouer aux échecs.
      </li>
      <li className="d05-on2" style={{ marginBottom: 30 }}>
        – Après le match, IBM l'a démonté ; Kasparov n'a jamais eu de troisième match.
      </li>
    </ul>
    <div className="d05-on3" style={{ position: 'absolute', left: 1250, top: 340, width: 530, padding: '24px 28px', boxSizing: 'border-box', background: ink.sheet, boxShadow: SHADOW, borderLeft: `6px solid ${ink.blue}` }}>
      <Label c={ink.blue}>Vingt ans plus tard</Label>
      <div style={{ marginTop: 12, fontSize: 26, lineHeight: 1.5 }}>
        Au jeu de go, cette méthode échoue : trop de coups possibles. Il faudra une machine qui <b>apprend</b> à juger une position : AlphaGo, dossier 8.
      </div>
    </div>
  </Frame>
);

// ═══ 10 · Ce qu'il faut retenir ═════════════════════════════════════════════
const Lesson: Page = () => (
  <Frame id="lesson" eyebrow="Ce qu'il faut retenir" beats={1}>
    <div className="d05-in-fade" style={{ position: 'absolute', left: L - 16, top: 170, fontFamily: typewriter, fontSize: 300, lineHeight: 1, color: ink.rule }}>
      «
    </div>
    <div style={{ position: 'absolute', left: L, top: 370, fontFamily: typewriter, fontSize: 70, lineHeight: 1.22, textShadow: BLEED }}>
      <Typed text="Deep Blue n'a rien appris." d={400} step={30} />
    </div>
    <div style={{ position: 'absolute', left: L, top: 480, fontFamily: typewriter, fontSize: 70, lineHeight: 1.22, textShadow: BLEED }}>
      <Typed text="Il a gagné en " beat={1} step={30} />
      <span style={{ color: 'var(--osd-accent)' }}>
        <Mark beat={1} d={1000}>
          <Typed text="calculant plus" beat={1} d={420} step={30} />
        </Mark>
      </span>
      <Typed text="." beat={1} d={840} step={30} />
    </div>
    <SeriesNav left={L} top={700} d={800} />
    <Credits top={930}>
      Photos via Wikimedia Commons : Deep Blue (Computer History Museum) par James the photographer (CC BY 2.0) · Garry Kasparov, 2015, par Fryta 73 (CC BY-SA
      2.0). Images recadrées et teintées.
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

const STYLE_ID = 'osd-styles-ai-history-05-deep-blue';
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
  title: "Deep Blue bat Kasparov : la victoire du calcul",
  createdAt: '2026-10-08T01:36:58.714Z',
};

export const notes: (string | undefined)[] = [
  `Dossier 5 : mai 1997, une machine bat le champion du monde d'échecs. Une victoire historique… obtenue sans aucun apprentissage.
La carte perforée encode « DEEP BLUE 1997 ».`,
  `Pourquoi les échecs ? Environ 35 coups possibles à chaque tour.
Clic 1 : Claude Shannon estime en 1950 le nombre de parties possibles à environ 10 puissance 120, bien plus que d'atomes dans l'univers observable.
Clic 2 : impossible de tout calculer. Depuis Turing et Shannon, battre un grand maître est le grand objectif de l'IA.`,
  `Février 1996, Philadelphie : premier match contre Kasparov.
Clic 1 : Deep Blue gagne la première partie, une première face à un champion du monde en cadence de tournoi.
Clic 2 : mais Kasparov gagne le match 4 à 2. IBM améliore la machine et demande une revanche.`,
  `Comment joue-t-il ? Avec l'algorithme minimax. On imagine nos coups, puis les réponses de l'adversaire, puis on note les positions obtenues.
Clic 1 : l'adversaire choisit la réponse la pire pour nous : le minimum de chaque branche, 3, 2 et 2.
Clic 2 : nous choisissons le meilleur de ces pires : 3, le coup de gauche.`,
  `L'astuce qui change tout : l'élagage alpha-bêta.
La branche de gauche nous garantit déjà 3.
Clic 1 : au milieu, la première réponse vaut 2 ; cette branche vaudra au plus 2, elle ne sera jamais choisie. Inutile de regarder les deux autres feuilles.
Clic 2 : même résultat, moins de calcul ; sur un vrai arbre, on peut chercher environ deux fois plus profond dans le même temps.`,
  `La force brute. Kasparov examine quelques positions par seconde.
Clic 1 : Deep Blue, environ 200 millions.
Clic 2 : un supercalculateur IBM avec 480 puces dédiées aux échecs ; il voit en général une douzaine de coups à l'avance.
Kasparov, lui, ne regarde que quelques coups, mais il les choisit très bien.`,
  `Mais ce n'est pas que du calcul. Une fonction d'évaluation avec environ 8 000 critères, réglés avec des grands maîtres.
Clic 1 : une bibliothèque d'ouvertures. Clic 2 : une base de fins de partie résolues.
Rien d'appris : c'est l'IA symbolique du dossier 3.`,
  `Mai 1997, New York. Kasparov gagne la première partie.
Clic 1 : partie 2, un coup de Deep Blue paraît si humain que Kasparov soupçonne une aide extérieure ; IBM dément.
Clic 2 : partie 6, le 11 mai : Kasparov abandonne après 19 coups.
Clic 3 : 3,5 à 2,5. Pour la première fois, une machine bat le champion du monde en match.`,
  `Mais Deep Blue n'apprenait pas. Clic 1 : il ne savait faire qu'une chose. Clic 2 : IBM l'a démonté après le match.
Clic 3 : au go, cette méthode échoue : trop de coups possibles. Il faudra une machine qui apprend à juger une position : AlphaGo, dossier 8.`,
  `À retenir : Deep Blue n'a rien appris. Clic : il a gagné en calculant plus.
Prochain dossier : 2012, AlexNet, quand les réseaux de neurones prennent leur revanche.`,
];

export default [Cover, Challenge, Match96, Minimax, AlphaBeta, Brute, Knowledge, Match97, Not, Lesson] satisfies Page[];
