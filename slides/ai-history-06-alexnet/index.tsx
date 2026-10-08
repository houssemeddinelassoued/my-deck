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
import imgFeiFei from '@assets/ai-history/feifei.jpg';
import imgHinton from '@assets/ai-history/hinton.jpg';

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
const FONT_LINK_ID = 'osd-webfont-ai-history-06-alexnet';
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
const has = (n: number) => `.d06-page:has([data-osd-step="revealed"] > .d06-k${n})`;

CSS.push(`
@keyframes d06-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes d06-fade{from{opacity:0}to{opacity:1}}
@keyframes d06-type{from{opacity:0}to{opacity:1}}
@keyframes d06-draw{from{stroke-dashoffset:1.01}to{stroke-dashoffset:0}}
@keyframes d06-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes d06-pop{0%{opacity:0;transform:scale(.3)}60%{opacity:1;transform:scale(1.15)}100%{opacity:1;transform:scale(1)}}
@keyframes d06-stamp{0%{opacity:0;transform:rotate(var(--r,0deg)) scale(1.9)}35%{opacity:1}70%{transform:rotate(var(--r,0deg)) scale(.94)}100%{opacity:1;transform:rotate(var(--r,0deg)) scale(1)}}
@keyframes d06-blink{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes d06-spin{to{transform:rotate(360deg)}}
@keyframes d06-scan{0%{transform:translateY(0);opacity:0}8%{opacity:.75}92%{opacity:.75}100%{transform:translateY(var(--h,400px));opacity:0}}
@keyframes d06-back{to{stroke-dashoffset:36}}
.d06-stamp{transform:rotate(var(--r,0deg))}
.d06-in-draw{stroke-dasharray:1 2}
.d06-in-pop,.d06-pop{transform-box:fill-box;transform-origin:center}
.d06-in-grow{transform-origin:left center}
.d06-live .d06-in{animation:d06-rise 800ms ${EASE} var(--d,0ms) both}
.d06-live .d06-in-fade{animation:d06-fade 900ms ${EASE} var(--d,0ms) both}
.d06-live .d06-in-draw{animation:d06-draw 1300ms ${EASE} var(--d,0ms) both}
.d06-live .d06-in-grow{animation:d06-grow 600ms ${EASE} var(--d,0ms) both}
.d06-live .d06-in-pop{animation:d06-pop 520ms ${EASE} var(--d,0ms) both}
.d06-live .d06-in-st{animation:d06-stamp 480ms ${EASE_OUT} var(--d,0ms) both}
.d06-live .d06-ty0 .d06-c{animation:d06-type 40ms linear var(--d,0ms) both}
.d06-live .d06-lamp{animation:d06-blink var(--t,1.4s) steps(1,end) var(--d,0ms) infinite}
.d06-reel{transform-box:fill-box;transform-origin:center}
.d06-live .d06-reel{animation:d06-spin var(--t,8s) linear infinite}
.d06-scan{opacity:0}
.d06-live .d06-scan{animation:d06-scan 3.4s ease-in-out var(--d,0ms) infinite}
.d06-live .d06-back{animation:d06-back 900ms linear infinite}
@media (prefers-reduced-motion: reduce){.d06-page *{animation:none !important;transition:none !important}}
`);

// Beat utilities — visible from beat n: on (rise) / fade / typed text / stamp
// (thunk) / grow; hidden from beat n: off; stroke drawn at beat n: draw (path
// needs pathLength={1}); faded back at beat n: dim.
for (let n = 1; n <= 6; n++) {
  const at = has(n);
  CSS.push(`
.d06-on${n}{opacity:0;transform:translateY(14px);transition:opacity 500ms ${EASE} var(--d,0ms),transform 700ms ${EASE} var(--d,0ms)}
${at} .d06-on${n}{opacity:1;transform:none}
.d06-fade${n}{opacity:0;transition:opacity 550ms ${EASE} var(--d,0ms)}
${at} .d06-fade${n}{opacity:1}
.d06-ty${n} .d06-c{opacity:0}
${at} .d06-ty${n} .d06-c{opacity:1;transition:opacity 40ms linear var(--d,0ms)}
.d06-st${n}{opacity:0;transform:rotate(var(--r,0deg)) scale(1.9);transition:opacity 120ms linear var(--d,0ms),transform 440ms ${THUNK} var(--d,0ms)}
${at} .d06-st${n}{opacity:1;transform:rotate(var(--r,0deg)) scale(1)}
.d06-grow${n}{transform:scaleX(0);transform-origin:left center;transition:transform 600ms ${EASE} var(--d,0ms)}
${at} .d06-grow${n}{transform:scaleX(1)}
.d06-off${n}{transition:opacity 380ms ${EASE}}
${at} .d06-off${n}{opacity:0}
.d06-draw${n}{stroke-dasharray:1 2;stroke-dashoffset:1.01;transition:stroke-dashoffset 1000ms ${EASE} var(--d,0ms)}
${at} .d06-draw${n}{stroke-dashoffset:0}
.d06-dim${n}{transition:opacity 500ms ${EASE}}
${at} .d06-dim${n}{opacity:.22}
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
          <i className={`d06-k${i + 1}`} />
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
    className={`d06-stamp ${beat ? `d06-st${beat}` : 'd06-in-st'}`}
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
    <span className={`d06-ty${beat}`}>
      {Array.from(text).map((ch, k) =>
        ch === '\n' ? (
          <br key={k} />
        ) : (
          <span key={k} className="d06-c" style={vars({ d: `${d + i++ * step}ms` })}>
            {ch}
          </span>
        ),
      )}
    </span>
  );
};

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div
    className="d06-in-fade"
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
      className={`d06-page d06-${id}${live ? ' d06-live' : ''}`}
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
  className = 'd06-in-fade',
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
        className={beat ? `d06-draw${beat}` : 'd06-in-draw'}
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
  "id": "ai-history-06-alexnet",
  "n": 6,
  "short": "AlexNet & ImageNet",
  "footer": "AlexNet — le big bang du deep learning",
  "title": "AlexNet",
  "subtitle": "Le big bang du deep learning",
  "lede": "2012 : un réseau de neurones profond, entraîné sur deux cartes graphiques, écrase le grand concours de vision.",
  "year": "2012",
  "card": "ALEXNET 2012",
  "metaTitle": "AlexNet et ImageNet : le big bang du deep learning",
  "next": {
    "n": 7,
    "title": "Les mots deviennent des nombres",
    "id": "ai-history-07-word2vec"
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
      <rect key={i} x={pcX(c) - 4.5} y={pcY(r) - 7.5} width={9} height={15} rx={1.5} fill={ink.hole} className="d06-in-pop" style={vars({ d: `${2900 + c * 80}ms` })} />
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
  <div className="d06-in-fade" style={{ ...vars({ d: '3300ms' }), position: 'absolute', left: 1190, top: 668, width: 590, height: 262 }}>
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
      className="d06-in-fade"
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
      className="d06-in"
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
    <div className="d06-in" style={{ ...vars({ d: '2700ms' }), position: 'absolute', left: L, top: 636 }}>
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
  <div className="d06-in" style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left, top, display: 'flex', gap: 28 }}>
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
  <div className={beat ? `d06-on${beat}` : 'd06-in'} style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: x, top: y, width: w + 16 }}>
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
  <div className={beat ? `d06-on${beat}` : 'd06-in'} style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: x, top: y, width: w, height: h }}>
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
  <div className="d06-in-fade" style={{ ...vars({ d: '1500ms' }), position: 'absolute', left: L, right: RIGHT, top, fontSize: 15, lineHeight: 1.35, color: ink.muted }}>
    {children}
  </div>
);

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

// ═══ 2 · Trois ingrédients ══════════════════════════════════════════════════
const Ingredient = ({ x, beat, k, title, then, now }: { x: number; beat: number; k: string; title: string; then: string; now: string }) => (
  <div className={beat ? `d06-on${beat}` : 'd06-in'} style={{ ...vars({ d: beat ? '0ms' : '400ms' }), position: 'absolute', left: x, top: 330, width: 500, height: 470, padding: '26px 30px', boxSizing: 'border-box', background: ink.sheet, boxShadow: SHADOW }}>
    <div style={{ fontFamily: typewriter, fontSize: 80, lineHeight: 1, color: ink.red }}>{k}</div>
    <div style={{ marginTop: 14, fontFamily: typewriter, fontSize: 40, textShadow: BLEED }}>{title}</div>
    <div style={{ marginTop: 24 }}>
      <Label>Années 1990</Label>
      <div style={{ marginTop: 6, fontSize: 26, lineHeight: 1.4, color: ink.soft }}>{then}</div>
    </div>
    <div style={{ marginTop: 22 }}>
      <Label c={ink.red}>2012</Label>
      <div style={{ marginTop: 6, fontSize: 26, lineHeight: 1.4 }}>{now}</div>
    </div>
  </div>
);

const Ingredients: Page = () => (
  <Frame id="ingredients" era="2012" eyebrow="Ce qui manquait aux réseaux" title="Trois ingrédients enfin réunis" beats={2}>
    <Ingredient x={170} beat={0} k="1" title="Des données" then="des milliers d'images" now="1,2 million de photos annotées" />
    <Ingredient x={725} beat={1} k="2" title="Du calcul" then="des semaines par réseau" now="des cartes graphiques de jeu vidéo" />
    <Ingredient x={1280} beat={2} k="3" title="Des astuces" then="sigmoïde, signal qui s'efface" now="ReLU, dropout, augmentation" />
    <Hand x={L + 10} y={840} w={1500} rot={-0.8} size={31} d={1300}>
      Les idées de base, elles, existent depuis 1989 (dossier 4) et 1986 (dossier 2).
    </Hand>
  </Frame>
);

// ═══ 3 · ImageNet ═══════════════════════════════════════════════════════════
const Tile = ({ x, y, label, c }: { x: number; y: number; label: string; c: string }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 150, height: 112, background: c, display: 'grid', placeItems: 'end start', padding: 8, boxSizing: 'border-box', boxShadow: '0 4px 8px -4px rgba(60, 40, 10, 0.4)' }}>
    <span style={{ background: '#fffaf0', padding: '2px 8px', fontSize: 18, fontWeight: 700 }}>{label}</span>
  </div>
);

const ImageNet: Page = () => (
  <Frame id="imagenet" era="2009" eyebrow="L'ingrédient nº 1 : les données" title="ImageNet : le monde en photos annotées" beats={2}>
    <div className="d06-in" style={{ ...vars({ d: '400ms' }), position: 'absolute', left: L, top: 330, width: 640, height: 384 }}>
      <Tile x={0} y={0} label="chat" c="#c9b08a" />
      <Tile x={162} y={0} label="tigre" c="#d39a5c" />
      <Tile x={324} y={0} label="léopard" c="#b8925f" />
      <Tile x={486} y={0} label="lynx" c="#a8977e" />
      <Tile x={0} y={124} label="tasse" c="#9eb0bf" />
      <Tile x={162} y={124} label="théière" c="#8f9f87" />
      <Tile x={324} y={124} label="cafetière" c="#7d6a58" />
      <Tile x={486} y={124} label="bol" c="#c4b8a0" />
      <Tile x={0} y={248} label="voilier" c="#8aa5bd" />
      <Tile x={162} y={248} label="paquebot" c="#6f8aa3" />
      <Tile x={324} y={248} label="canoë" c="#a3b98c" />
      <Tile x={486} y={248} label="épave" c="#7f8f86" />
    </div>
    <Hand x={L + 10} y={740} w={640} rot={-1} size={30} d={1200}>
      schéma : des étiquettes très fines, catégorie par catégorie
    </Hand>
    <div className="d06-in" style={{ ...vars({ d: '700ms' }), position: 'absolute', left: 900, top: 340, width: 600 }}>
      <div style={{ fontFamily: typewriter, fontSize: 64, lineHeight: 1, color: ink.red }}>14 millions</div>
      <div style={{ marginTop: 10, fontSize: 26, lineHeight: 1.45 }}>d'images, classées dans plus de 20 000 catégories.</div>
    </div>
    <div className="d06-on1" style={{ position: 'absolute', left: 900, top: 530, width: 600, fontSize: 26, lineHeight: 1.5 }}>
      Étiquetées par des dizaines de milliers de personnes payées à la tâche sur Amazon Mechanical Turk.
    </div>
    <div className="d06-on2" style={{ position: 'absolute', left: 900, top: 700, width: 600, fontSize: 26, lineHeight: 1.5 }}>
      <b>Dès 2010</b>, un concours annuel : 1 000 catégories, 1,2 million d'images d'entraînement.
    </div>
    <Photo src={imgFeiFei} caption="Fei-Fei Li, 2017" x={1560} y={330} w={170} h={220} rot={2.5} zoom={1.9} origin="60% 14%" d={500} />
  </Frame>
);

// ═══ 4 · La règle du jeu ════════════════════════════════════════════════════
const Guess = ({ k, label, p, hot }: { k: number; label: string; p: number; hot?: boolean }) => (
  <div className="d06-in" style={{ ...vars({ d: `${400 + k * 160}ms` }), display: 'flex', alignItems: 'center', height: 64, gap: 20 }}>
    <span style={{ width: 40, fontFamily: typewriter, fontSize: 30, color: ink.muted }}>{k}.</span>
    <span style={{ width: 260, fontSize: 28, fontWeight: hot ? 700 : 400, color: hot ? ink.red : ink.text }}>{label}</span>
    <span style={{ width: 420, height: 26, background: ink.sheet, border: `1.5px solid ${ink.rule}` }}>
      <span style={{ display: 'block', width: 420 * p, height: '100%', background: hot ? ink.red : ink.faint }} />
    </span>
    <span style={{ fontFamily: mono, fontSize: 24, color: ink.muted }}>{Math.round(p * 100)} %</span>
  </div>
);

const Rules: Page = () => (
  <Frame id="rules" era="2010" eyebrow="La règle du concours" title="Cinq essais pour trouver la bonne réponse" beats={2}>
    <div className="d06-in" style={{ ...vars({ d: '400ms' }), position: 'absolute', left: L, top: 330, width: 320, height: 300, padding: 14, boxSizing: 'border-box', background: '#fffaf0', boxShadow: SHADOW, transform: 'rotate(-1.5deg)' }}>
      <div style={{ width: '100%', height: 230, background: 'linear-gradient(160deg, #d6a868, #a8743f 60%, #5a4632)', display: 'grid', placeItems: 'center', fontFamily: hand, fontWeight: 600, fontSize: 34, color: '#fffaf0' }}>
        photo à classer
      </div>
      <div style={{ marginTop: 12, textAlign: 'center', fontSize: 22 }}>
        réponse attendue : <b>léopard</b>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 560, top: 330 }}>
      <Guess k={1} label="jaguar" p={0.41} />
      <Guess k={2} label="léopard" p={0.33} hot />
      <Guess k={3} label="guépard" p={0.12} />
      <Guess k={4} label="chat sauvage" p={0.06} />
      <Guess k={5} label="lynx" p={0.03} />
    </div>
    <Stamp pos={{ left: 1500, top: 380 }} rot={-8} size={48} color={ink.blue} beat={1} d={1000}>
      Réussi
    </Stamp>
    <div className="d06-on2" style={{ position: 'absolute', left: L, top: 720, width: CW }}>
      <div style={{ fontFamily: typewriter, fontSize: 40, lineHeight: 1.25, textShadow: BLEED }}>
        L'<span style={{ color: 'var(--osd-accent)' }}>erreur top-5</span> : la part des photos où la bonne réponse n'est dans aucun des 5 essais.
      </div>
      <div style={{ marginTop: 12, fontSize: 26, color: ink.soft }}>En 2010 et 2011, les meilleurs programmes se trompent encore sur plus d'une photo sur quatre.</div>
    </div>
    <Hand x={560} y={660} w={700} rot={-1} size={28} d={1500}>
      exemple illustratif
    </Hand>
  </Frame>
);

// ═══ 5 · 30 septembre 2012 ══════════════════════════════════════════════════
const RESULTS: [string, number, boolean][] = [
  ['SuperVision (AlexNet)', 15.3, true],
  ['ISI (Tokyo)', 26.2, false],
  ['Oxford VGG', 27.0, false],
  ['XRCE / INRIA', 27.1, false],
];
const BarRow = ({ name, v, hot, k }: { name: string; v: number; hot: boolean; k: number }) => (
  <div className={hot ? 'd06-on1' : 'd06-in'} style={{ ...vars({ d: hot ? '0ms' : `${400 + k * 200}ms` }), display: 'flex', alignItems: 'center', height: 92, gap: 24 }}>
    <span style={{ width: 380, fontFamily: typewriter, fontSize: 30, color: hot ? ink.red : ink.text }}>{name}</span>
    <span style={{ position: 'relative', width: 900, height: 44 }}>
      <span
        className={hot ? 'd06-grow1' : 'd06-in-grow'}
        style={{ ...vars({ d: hot ? '200ms' : `${500 + k * 200}ms` }), position: 'absolute', left: 0, top: 0, bottom: 0, width: v * 30, background: hot ? ink.red : ink.faint }}
      />
    </span>
    <span style={{ width: 130, fontFamily: typewriter, fontSize: 36, color: hot ? ink.red : ink.text }}>{String(v).replace('.', ',')} %</span>
  </div>
);

const Result: Page = () => (
  <Frame id="result" era="2012" eyebrow="Florence, octobre 2012 · résultats du concours" title="Un écart que personne n'avait jamais vu" beats={2}>
    <div className="d06-in-fade" style={{ ...vars({ d: '300ms' }), position: 'absolute', left: L + 404, top: 316, fontSize: 22, color: ink.muted }}>
      erreur top-5 · plus court = meilleur
    </div>
    <div style={{ position: 'absolute', left: L, top: 360 }}>
      {RESULTS.slice(1).map(([n, v, h], i) => (
        <BarRow key={n} name={n} v={v} hot={h} k={i} />
      ))}
      <BarRow name={RESULTS[0][0]} v={RESULTS[0][1]} hot k={3} />
    </div>
    <div className="d06-on2" style={{ position: 'absolute', left: L, top: 760, width: CW }}>
      <div style={{ fontFamily: typewriter, fontSize: 44, lineHeight: 1.25, textShadow: BLEED }}>
        Près de <span style={{ color: 'var(--osd-accent)' }}>11 points d'avance</span> sur le deuxième.
      </div>
      <div style={{ marginTop: 12, fontSize: 26, color: ink.soft }}>D'habitude, on gagnait le concours avec un ou deux points d'avance.</div>
    </div>
  </Frame>
);

// ═══ 6 · L'équipe ═══════════════════════════════════════════════════════════
const Team: Page = () => (
  <Frame id="team" era="2012" eyebrow="Université de Toronto" title="Trois chercheurs, deux cartes graphiques" beats={2}>
    <Fiche code="FICHE Nº 12-T" x={L} y={318} w={760} h={330} rot={-1} d={400}>
      <FicheLine label="ÉQUIPE" value="Alex Krizhevsky (doctorant)" d={700} w={170} />
      <FicheLine label="" value="Ilya Sutskever (doctorant)" d={1250} w={170} />
      <FicheLine label="" value="Geoffrey Hinton (directeur)" d={1750} w={170} />
      <FicheLine label="MATÉRIEL" value="2 cartes Nvidia GTX 580, 3 Go" d={2250} w={170} />
      <FicheLine label="DURÉE" value="5 à 6 jours d'entraînement" d={2850} w={170} />
    </Fiche>
    <Photo src={imgHinton} caption="Geoffrey Hinton" x={1010} y={330} w={170} h={220} rot={2.5} zoom={1.25} origin="50% 24%" d={600} />
    <div className="d06-on1" style={{ position: 'absolute', left: 1250, top: 340, width: 530, fontSize: 27, lineHeight: 1.5 }}>
      Des cartes conçues pour les jeux vidéo, achetées dans le commerce, branchées sur un ordinateur chez les parents de Krizhevsky.
    </div>
    <div className="d06-on2" style={{ position: 'absolute', left: L, top: 720, width: CW }}>
      <div style={{ fontFamily: typewriter, fontSize: 40, lineHeight: 1.25, textShadow: BLEED }}>Le réseau prend le nom de son auteur principal : AlexNet.</div>
      <div style={{ marginTop: 12, fontSize: 26, color: ink.soft }}>
        Hinton a cru aux réseaux de neurones pendant les deux hivers (dossiers 2 et 3).
      </div>
    </div>
  </Frame>
);

// ═══ 7 · Pourquoi les cartes graphiques ═════════════════════════════════════
const Chip = ({ x, label, sub, cols, rows, core, gap, beat }: { x: number; label: string; sub: string; cols: number; rows: number; core: number; gap: number; beat: number }) => (
  <div className={beat ? `d06-on${beat}` : 'd06-in'} style={{ ...vars({ d: beat ? '0ms' : '400ms' }), position: 'absolute', left: x, top: 330 }}>
    <div style={{ fontFamily: typewriter, fontSize: 38, textShadow: BLEED }}>{label}</div>
    <div style={{ marginTop: 4, fontSize: 24, color: ink.muted }}>{sub}</div>
    <svg width={cols * (core + gap) + gap} height={rows * (core + gap) + gap} style={{ display: 'block', marginTop: 18 }}>
      <rect x={0} y={0} width={cols * (core + gap) + gap} height={rows * (core + gap) + gap} fill="#2d2822" />
      {Array.from({ length: cols * rows }, (_, i) => (
        <rect key={i} x={gap + (i % cols) * (core + gap)} y={gap + Math.floor(i / cols) * (core + gap)} width={core} height={core} fill={beat ? '#e3b55a' : '#c9bb9c'} />
      ))}
    </svg>
  </div>
);

const Gpu: Page = () => (
  <Frame id="gpu" era="2012" eyebrow="L'ingrédient nº 2 : le calcul" title="Mille petites mains plutôt que quatre grandes" beats={2}>
    <Chip x={170} label="Processeur (CPU)" sub="quelques cœurs puissants" cols={2} rows={2} core={110} gap={14} beat={0} />
    <Chip x={700} label="Carte graphique (GPU)" sub="512 petits cœurs (GTX 580)" cols={32} rows={16} core={13} gap={3} beat={1} />
    <div className="d06-on2" style={{ position: 'absolute', left: L, top: 760, width: CW }}>
      <div style={{ fontSize: 28, lineHeight: 1.5 }}>
        Un réseau de neurones, c'est surtout des millions de multiplications indépendantes : exactement ce qu'une carte graphique sait faire en parallèle.
      </div>
      <div style={{ marginTop: 14, fontFamily: typewriter, fontSize: 38, color: 'var(--osd-accent)' }}>Des semaines de calcul deviennent quelques jours.</div>
    </div>
  </Frame>
);

// ═══ 8 · L'architecture ═════════════════════════════════════════════════════
const Block = ({ x, w, h, label, sub, beat, c = ink.sheet }: { x: number; w: number; h: number; label: string; sub: string; beat: number; c?: string }) => (
  <div className={beat ? `d06-on${beat}` : 'd06-in'} style={{ ...vars({ d: beat ? '0ms' : '400ms' }), position: 'absolute', left: x, top: 470 - h / 2, width: w + 40 }}>
    <div style={{ width: w, height: h, background: c, border: `2.5px solid ${ink.text}`, boxShadow: '0 6px 10px -6px rgba(60, 40, 10, 0.5)' }} />
    <div style={{ position: 'absolute', top: h + 14, left: 0, width: 160, fontFamily: typewriter, fontSize: 24, lineHeight: 1.1 }}>{label}</div>
    <div style={{ position: 'absolute', top: h + 46, left: 0, width: 160, fontFamily: mono, fontSize: 18, color: ink.muted }}>{sub}</div>
  </div>
);

const Architecture: Page = () => (
  <Frame id="arch" era="2012" eyebrow="L'architecture" title="Un LeNet géant : 8 couches, 60 millions de poids" beats={2}>
    <Block x={170} w={150} h={150} label="Image" sub="224 × 224 × 3" beat={0} />
    <Block x={360} w={30} h={210} label="Conv 1" sub="96 filtres" beat={0} c={ink.redSoft} />
    <Block x={520} w={36} h={160} label="Conv 2" sub="256" beat={0} c={ink.redSoft} />
    <Block x={680} w={44} h={120} label="Conv 3" sub="384" beat={0} c={ink.redSoft} />
    <Block x={840} w={44} h={120} label="Conv 4" sub="384" beat={0} c={ink.redSoft} />
    <Block x={1000} w={40} h={110} label="Conv 5" sub="256" beat={0} c={ink.redSoft} />
    <Block x={1160} w={22} h={260} label="Dense" sub="4 096" beat={1} c={ink.blueSoft} />
    <Block x={1300} w={22} h={260} label="Dense" sub="4 096" beat={1} c={ink.blueSoft} />
    <Block x={1440} w={22} h={200} label="Sortie" sub="1 000 classes" beat={1} c={ink.blueSoft} />
    <div className="d06-on2" style={{ position: 'absolute', left: L, top: 790, display: 'flex', gap: 60, width: CW }}>
      <div>
        <div style={{ fontFamily: typewriter, fontSize: 50, color: ink.muted }}>≈ 60 000</div>
        <div style={{ fontSize: 23, color: ink.soft }}>poids dans LeNet-5 (1998)</div>
      </div>
      <div>
        <div style={{ fontFamily: typewriter, fontSize: 50, color: ink.red }}>≈ 60 000 000</div>
        <div style={{ fontSize: 23, color: ink.soft }}>poids dans AlexNet : mille fois plus</div>
      </div>
    </div>
  </Frame>
);

// ═══ 9 · Les astuces ════════════════════════════════════════════════════════
const PW = 520;
const PH = 300;
const gx = (z: number) => 30 + ((z + 4) / 8) * (PW - 60);
const gy = (v: number) => PH - 30 - (v / 4) * (PH - 60);
const SIG = Array.from({ length: 33 }, (_, i) => -4 + i * 0.25)
  .map((z, i) => `${i ? 'L' : 'M'} ${gx(z).toFixed(1)} ${gy(sigmoid(z) * 1).toFixed(1)}`)
  .join(' ');

const Trick = ({ x, beat, title, children, art }: { x: number; beat: number; title: string; children: ReactNode; art: ReactNode }) => (
  <div className={beat ? `d06-on${beat}` : 'd06-in'} style={{ ...vars({ d: beat ? '0ms' : '400ms' }), position: 'absolute', left: x, top: 320, width: 520 }}>
    <div style={{ height: PH, ...graph(30), position: 'relative' }}>{art}</div>
    <div style={{ marginTop: 18, fontFamily: typewriter, fontSize: 36, textShadow: BLEED }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 24, lineHeight: 1.45, color: ink.soft }}>{children}</div>
  </div>
);

const Tricks: Page = () => (
  <Frame id="tricks" era="2012" eyebrow="L'ingrédient nº 3 : des astuces" title="Trois astuces qui changent tout" beats={2}>
    <Trick
      x={170}
      beat={0}
      title="ReLU"
      art={
        <svg width={PW} height={PH} style={{ position: 'absolute', left: 0, top: 0 }}>
          <line x1={20} y1={gy(0)} x2={PW - 20} y2={gy(0)} stroke={ink.soft} strokeWidth={2} />
          <line x1={gx(0)} y1={20} x2={gx(0)} y2={PH - 20} stroke={ink.soft} strokeWidth={2} />
          <path d={SIG} fill="none" stroke={ink.faint} strokeWidth={4} strokeDasharray="8 6" />
          <path d={`M ${gx(-4)} ${gy(0)} L ${gx(0)} ${gy(0)} L ${gx(4)} ${gy(4)}`} fill="none" stroke={ink.red} strokeWidth={5} />
          <text x={gx(1.2)} y={gy(3)} style={{ fontFamily: hand, fontWeight: 600, fontSize: 28 }} fill={ink.red}>
            max(0, z)
          </text>
          <text x={gx(-3.8)} y={gy(1.6)} style={{ fontFamily: hand, fontWeight: 600, fontSize: 26 }} fill={ink.muted}>
            sigmoïde
          </text>
        </svg>
      }
    >
      Pente de 1 quand le neurone est actif : le signal d'erreur ne s'efface plus (dossier 2). L'entraînement va six fois plus vite.
    </Trick>
    <Trick
      x={725}
      beat={1}
      title="Dropout"
      art={
        <svg width={PW} height={PH} style={{ position: 'absolute', left: 0, top: 0 }}>
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3, 4, 5].map((c) => {
              const off = (r * 7 + c * 3) % 5 === 0 || (r + c) % 4 === 1;
              return (
                <g key={`${r}${c}`}>
                  <circle cx={60 + c * 80} cy={50 + r * 66} r={20} fill={off ? 'transparent' : ink.sheet} stroke={off ? ink.faint : ink.text} strokeWidth={3} strokeDasharray={off ? '5 5' : undefined} />
                  {off ? <path d={`M ${48 + c * 80} ${38 + r * 66} l 24 24 m 0 -24 l -24 24`} stroke={ink.red} strokeWidth={3} /> : null}
                </g>
              );
            }),
          )}
        </svg>
      }
    >
      À chaque exemple, on éteint au hasard la moitié des neurones de certaines couches. Le réseau ne peut plus compter sur un seul : il mémorise moins, il généralise mieux.
    </Trick>
    <Trick
      x={1280}
      beat={2}
      title="Augmentation"
      art={
        <svg width={PW} height={PH} style={{ position: 'absolute', left: 0, top: 0 }}>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${40 + i * 160} 70) ${i === 1 ? 'scale(-1 1) translate(-130 0)' : ''}`}>
              <rect x={0} y={0} width={130} height={150} fill="#c9a26b" stroke={ink.text} strokeWidth={2} />
              <path d={`M 20 120 L ${50 + i * 8} 40 L 110 120 Z`} fill="#8a6a3e" />
              <circle cx={98} cy={34} r={14} fill="#f3e2b0" />
            </g>
          ))}
          <text x={PW / 2} y={268} textAnchor="middle" style={{ fontFamily: hand, fontWeight: 600, fontSize: 26 }} fill={ink.blue}>
            recadrer, retourner, changer les couleurs
          </text>
        </svg>
      }
    >
      Chaque photo est déclinée en variantes légèrement modifiées : bien plus d'exemples, sans rien étiqueter de plus.
    </Trick>
  </Frame>
);

// ═══ 10 · Ce que voit la première couche ════════════════════════════════════
const FILTERS = (() => {
  const out: { angle: number; hue: string; kind: 'edge' | 'blob' }[] = [];
  const hues = ['#2b4a7a', '#b0352a', '#3e7a4e', '#c9a14a', '#6b4a8a', '#27231d'];
  for (let i = 0; i < 32; i++) out.push({ angle: (i * 37) % 180, hue: hues[i % hues.length], kind: i % 5 === 3 ? 'blob' : 'edge' });
  return out;
})();

const FilterTile = ({ angle, hue, kind, i }: { angle: number; hue: string; kind: 'edge' | 'blob'; i: number }) => {
  const s = 92;
  const id = `g${i}`;
  return (
    <svg width={s} height={s} className="d06-in-pop" style={{ ...vars({ d: `${400 + i * 40}ms` }), display: 'block' }}>
      <defs>
        {kind === 'edge' ? (
          <linearGradient id={`d06-${id}`} gradientTransform={`rotate(${angle} 0.5 0.5)`}>
            <stop offset="0" stopColor="#f3ead2" />
            <stop offset="0.45" stopColor="#f3ead2" />
            <stop offset="0.5" stopColor={hue} />
            <stop offset="0.62" stopColor="#1f1b16" />
            <stop offset="1" stopColor="#8a8070" />
          </linearGradient>
        ) : (
          <radialGradient id={`d06-${id}`}>
            <stop offset="0" stopColor={hue} />
            <stop offset="0.6" stopColor="#8a8070" />
            <stop offset="1" stopColor="#5a5246" />
          </radialGradient>
        )}
      </defs>
      <rect x={0} y={0} width={s} height={s} fill={`url(#d06-${id})`} />
    </svg>
  );
};

const FirstLayer: Page = () => (
  <Frame id="filters" era="2012" eyebrow="Dans la tête du réseau" title="Ce que la première couche a appris seule" beats={1}>
    <div style={{ position: 'absolute', left: L, top: 330, display: 'grid', gridTemplateColumns: 'repeat(8, 92px)', gap: 8, padding: 16, background: '#2d2822', boxShadow: SHADOW }}>
      {FILTERS.map((f, i) => (
        <FilterTile key={i} {...f} i={i} />
      ))}
    </div>
    <div className="d06-in" style={{ ...vars({ d: '800ms' }), position: 'absolute', left: 1130, top: 340, width: 650, fontSize: 27, lineHeight: 1.5 }}>
      Des bords dans toutes les directions, et des taches de couleur : les mêmes motifs que les neurones du cortex visuel (dossier 4).
    </div>
    <div className="d06-on1" style={{ position: 'absolute', left: 1130, top: 560, width: 650, fontSize: 27, lineHeight: 1.5 }}>
      Les couches suivantes combinent ces motifs : textures, puis morceaux d'objets (un œil, une roue), puis objets entiers.
    </div>
    <Hand x={L + 10} y={790} w={880} rot={-1} size={30} d={1600}>
      schéma inspiré des filtres publiés en 2012, pas les filtres réels
    </Hand>
  </Frame>
);

// ═══ 11 · La ruée ═══════════════════════════════════════════════════════════
const YEARS: [number, number, string][] = [
  [2010, 28.2, 'NEC'],
  [2011, 25.8, 'XRCE'],
  [2012, 15.3, 'AlexNet'],
  [2013, 11.7, 'Clarifai'],
  [2014, 6.7, 'GoogLeNet'],
  [2015, 3.6, 'ResNet'],
];
const CH = { w: 960, h: 420, x0: 70, base: 380 };
const cy = (v: number) => CH.base - (v / 30) * (CH.base - 80);
const cx = (i: number) => CH.x0 + 60 + i * 150;

const Rush: Page = () => (
  <Frame id="rush" era="2012–2015" eyebrow="La ruée" title="En trois ans, la machine dépasse l'humain" beats={2}>
    <div className="d06-in-fade" style={{ ...vars({ d: '300ms' }), position: 'absolute', left: L, top: 320, width: CH.w, height: CH.h + 60, ...graph(40) }}>
      <svg width={CH.w} height={CH.h + 60} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <line x1={CH.x0} y1={CH.base} x2={CH.w - 30} y2={CH.base} stroke={ink.soft} strokeWidth={2} />
        <text x={CH.x0} y={26} style={{ fontFamily: mono, fontSize: 21 }} fill={ink.muted}>
          erreur top-5 du gagnant (%)
        </text>
        {YEARS.map(([y, v, who], i) => (
          <g key={y} className={i < 3 ? 'd06-in' : 'd06-on1'} style={vars({ d: `${i < 3 ? 400 + i * 150 : (i - 3) * 200}ms` })}>
            <rect x={cx(i) - 40} y={cy(v)} width={80} height={CH.base - cy(v)} fill={i === 2 ? ink.red : i > 2 ? ink.blue : ink.faint} />
            <text x={cx(i)} y={cy(v) - 12} textAnchor="middle" style={{ fontFamily: typewriter, fontSize: 28 }} fill={ink.text}>
              {String(v).replace('.', ',')}
            </text>
            <text x={cx(i)} y={CH.base + 30} textAnchor="middle" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.text}>
              {y}
            </text>
            <text x={cx(i)} y={CH.base + 56} textAnchor="middle" style={{ fontFamily: mono, fontSize: 18 }} fill={ink.muted}>
              {who}
            </text>
          </g>
        ))}
        <g className="d06-fade2">
          <line x1={CH.x0} y1={cy(5.1)} x2={CH.w - 30} y2={cy(5.1)} stroke={ink.red} strokeWidth={3} strokeDasharray="10 8" />
          <text x={CH.x0 + 8} y={cy(5.1) - 12} style={{ fontFamily: hand, fontWeight: 600, fontSize: 30, stroke: ink.sheet, strokeWidth: 8, paintOrder: 'stroke' }} fill={ink.red}>
            humain entraîné ≈ 5,1 %
          </text>
        </g>
      </svg>
    </div>
    <div className="d06-on1" style={{ position: 'absolute', left: 1220, top: 340, width: 560, fontSize: 26, lineHeight: 1.5 }}>
      Dès 2013, presque toutes les équipes du concours utilisent des réseaux profonds, de plus en plus profonds : 152 couches pour ResNet en 2015.
    </div>
    <div className="d06-on2" style={{ position: 'absolute', left: 1220, top: 600, width: 560, fontSize: 26, lineHeight: 1.5 }}>
      En 2013, Google rachète la petite société de Hinton et de ses deux étudiants. La course industrielle commence.
    </div>
  </Frame>
);

// ═══ 12 · Ce qu'il faut retenir ═════════════════════════════════════════════
const Lesson: Page = () => (
  <Frame id="lesson" eyebrow="Ce qu'il faut retenir" beats={1}>
    <div className="d06-in-fade" style={{ position: 'absolute', left: L - 16, top: 170, fontFamily: typewriter, fontSize: 300, lineHeight: 1, color: ink.rule }}>
      «
    </div>
    <div style={{ position: 'absolute', left: L, top: 370, fontFamily: typewriter, fontSize: 70, lineHeight: 1.22, textShadow: BLEED }}>
      <Typed text="Les idées avaient vingt ans." d={400} step={30} />
    </div>
    <div style={{ position: 'absolute', left: L, top: 480, fontFamily: typewriter, fontSize: 70, lineHeight: 1.22, textShadow: BLEED }}>
      <Typed text="Il leur manquait " beat={1} step={30} />
      <span style={{ color: 'var(--osd-accent)' }}>
        <Mark beat={1} d={1300}>
          <Typed text="données et calcul" beat={1} d={510} step={30} />
        </Mark>
      </span>
      <Typed text="." beat={1} d={1020} step={30} />
    </div>
    <SeriesNav left={L} top={700} d={800} />
    <Credits top={930}>
      Photos via Wikimedia Commons : Fei-Fei Li, 2017, ITU Pictures (CC BY 2.0) · Geoffrey Hinton par Cmichel67 (CC BY-SA 4.0). Images recadrées et teintées.
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

const STYLE_ID = 'osd-styles-ai-history-06-alexnet';
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
  title: "AlexNet et ImageNet : le big bang du deep learning",
  createdAt: '2026-10-08T02:02:26.590Z',
};

export const notes: (string | undefined)[] = [
  `Dossier 6 : 2012, le big bang du deep learning. Un réseau de neurones écrase le plus grand concours de vision artificielle.
La carte perforée encode « ALEXNET 2012 ».`,
  `Pourquoi pas plus tôt ? Il manquait trois ingrédients.
Des données : clic 1, du calcul : clic 2, et quelques astuces.
Les idées de base, elles, existaient depuis la fin des années 1980.`,
  `Le premier ingrédient : ImageNet, lancé par Fei-Fei Li. 14 millions d'images, plus de 20 000 catégories.
Clic 1 : étiquetées par des dizaines de milliers de personnes sur Amazon Mechanical Turk.
Clic 2 : dès 2010, un concours annuel : 1 000 catégories et 1,2 million d'images d'entraînement.`,
  `La règle : le programme a cinq essais. Ici, la bonne réponse, léopard, est son deuxième choix.
Clic 1 : réussi.
Clic 2 : on mesure l'erreur top-5 : la part des photos où la bonne réponse n'est dans aucun des cinq essais. En 2010 et 2011, les meilleurs se trompent encore sur plus d'une photo sur quatre.`,
  `Octobre 2012, les résultats. Les meilleures équipes tournent autour de 26 à 27 % d'erreur.
Clic 1 : l'équipe SuperVision, avec AlexNet : 15,3 %.
Clic 2 : près de 11 points d'avance. D'habitude, on gagnait avec un ou deux points.`,
  `Qui ? À Toronto, deux doctorants, Alex Krizhevsky et Ilya Sutskever, avec leur directeur Geoffrey Hinton. Deux cartes graphiques de jeu vidéo, cinq à six jours d'entraînement.
Clic 1 : des cartes achetées dans le commerce, sur un ordinateur chez les parents de Krizhevsky.
Clic 2 : le réseau prend son nom. Hinton avait cru aux réseaux de neurones pendant les deux hivers.`,
  `Pourquoi les cartes graphiques ? Un processeur a quelques cœurs puissants.
Clic 1 : une carte graphique en a des centaines, petits et simples.
Clic 2 : or un réseau, c'est surtout des millions de multiplications indépendantes. Des semaines de calcul deviennent quelques jours.`,
  `L'architecture : c'est un LeNet géant. Cinq couches de convolution, clic 1, puis trois couches denses, et 1 000 sorties.
Clic 2 : environ 60 millions de poids, mille fois plus que LeNet.`,
  `Trois astuces. ReLU : la fonction max(0, z). Sa pente vaut 1 quand le neurone est actif, le signal d'erreur ne s'efface plus ; l'entraînement va environ six fois plus vite.
Clic 1 : le dropout : on éteint au hasard la moitié des neurones à chaque exemple ; le réseau mémorise moins et généralise mieux.
Clic 2 : l'augmentation : on recadre, on retourne, on change les couleurs ; bien plus d'exemples sans rien étiqueter.`,
  `Ce que la première couche a appris toute seule : des bords dans toutes les directions et des taches de couleur, comme le cortex visuel.
Clic : les couches suivantes combinent ces motifs jusqu'aux objets entiers.
Préciser que l'image est un schéma inspiré des filtres publiés, pas les vrais.`,
  `La ruée. Erreur du gagnant : 28 %, 26 %, puis 15 % avec AlexNet.
Clic 1 : 11,7 % en 2013, 6,7 % en 2014, 3,6 % en 2015 avec ResNet et ses 152 couches.
Clic 2 : un humain entraîné fait environ 5,1 % : la machine l'a dépassé sur ce test précis. En 2013, Google rachète la société de Hinton et ses étudiants.`,
  `À retenir : les idées avaient vingt ans. Clic : il leur manquait les données et le calcul.
Prochain dossier : comment les mots deviennent des nombres.`,
];

export default [Cover, Ingredients, ImageNet, Rules, Result, Team, Gpu, Architecture, Tricks, FirstLayer, Rush, Lesson] satisfies Page[];
