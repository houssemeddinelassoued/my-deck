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
import imgOpenAI from '@assets/ai-history/openai.png';

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
const FONT_LINK_ID = 'osd-webfont-ai-history-10-chatgpt';
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
const has = (n: number) => `.d10-page:has([data-osd-step="revealed"] > .d10-k${n})`;

CSS.push(`
@keyframes d10-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes d10-fade{from{opacity:0}to{opacity:1}}
@keyframes d10-type{from{opacity:0}to{opacity:1}}
@keyframes d10-draw{from{stroke-dashoffset:1.01}to{stroke-dashoffset:0}}
@keyframes d10-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes d10-pop{0%{opacity:0;transform:scale(.3)}60%{opacity:1;transform:scale(1.15)}100%{opacity:1;transform:scale(1)}}
@keyframes d10-stamp{0%{opacity:0;transform:rotate(var(--r,0deg)) scale(1.9)}35%{opacity:1}70%{transform:rotate(var(--r,0deg)) scale(.94)}100%{opacity:1;transform:rotate(var(--r,0deg)) scale(1)}}
@keyframes d10-blink{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes d10-spin{to{transform:rotate(360deg)}}
@keyframes d10-scan{0%{transform:translateY(0);opacity:0}8%{opacity:.75}92%{opacity:.75}100%{transform:translateY(var(--h,400px));opacity:0}}
@keyframes d10-back{to{stroke-dashoffset:36}}
.d10-stamp{transform:rotate(var(--r,0deg))}
.d10-in-draw{stroke-dasharray:1 2}
.d10-in-pop,.d10-pop{transform-box:fill-box;transform-origin:center}
.d10-in-grow{transform-origin:left center}
.d10-live .d10-in{animation:d10-rise 800ms ${EASE} var(--d,0ms) both}
.d10-live .d10-in-fade{animation:d10-fade 900ms ${EASE} var(--d,0ms) both}
.d10-live .d10-in-draw{animation:d10-draw 1300ms ${EASE} var(--d,0ms) both}
.d10-live .d10-in-grow{animation:d10-grow 600ms ${EASE} var(--d,0ms) both}
.d10-live .d10-in-pop{animation:d10-pop 520ms ${EASE} var(--d,0ms) both}
.d10-live .d10-in-st{animation:d10-stamp 480ms ${EASE_OUT} var(--d,0ms) both}
.d10-live .d10-ty0 .d10-c{animation:d10-type 40ms linear var(--d,0ms) both}
.d10-live .d10-lamp{animation:d10-blink var(--t,1.4s) steps(1,end) var(--d,0ms) infinite}
.d10-reel{transform-box:fill-box;transform-origin:center}
.d10-live .d10-reel{animation:d10-spin var(--t,8s) linear infinite}
.d10-scan{opacity:0}
.d10-live .d10-scan{animation:d10-scan 3.4s ease-in-out var(--d,0ms) infinite}
.d10-live .d10-back{animation:d10-back 900ms linear infinite}
@media (prefers-reduced-motion: reduce){.d10-page *{animation:none !important;transition:none !important}}
`);

// Beat utilities — visible from beat n: on (rise) / fade / typed text / stamp
// (thunk) / grow; hidden from beat n: off; stroke drawn at beat n: draw (path
// needs pathLength={1}); faded back at beat n: dim.
for (let n = 1; n <= 6; n++) {
  const at = has(n);
  CSS.push(`
.d10-on${n}{opacity:0;transform:translateY(14px);transition:opacity 500ms ${EASE} var(--d,0ms),transform 700ms ${EASE} var(--d,0ms)}
${at} .d10-on${n}{opacity:1;transform:none}
.d10-fade${n}{opacity:0;transition:opacity 550ms ${EASE} var(--d,0ms)}
${at} .d10-fade${n}{opacity:1}
.d10-ty${n} .d10-c{opacity:0}
${at} .d10-ty${n} .d10-c{opacity:1;transition:opacity 40ms linear var(--d,0ms)}
.d10-st${n}{opacity:0;transform:rotate(var(--r,0deg)) scale(1.9);transition:opacity 120ms linear var(--d,0ms),transform 440ms ${THUNK} var(--d,0ms)}
${at} .d10-st${n}{opacity:1;transform:rotate(var(--r,0deg)) scale(1)}
.d10-grow${n}{transform:scaleX(0);transform-origin:left center;transition:transform 600ms ${EASE} var(--d,0ms)}
${at} .d10-grow${n}{transform:scaleX(1)}
.d10-off${n}{transition:opacity 380ms ${EASE}}
${at} .d10-off${n}{opacity:0}
.d10-draw${n}{stroke-dasharray:1 2;stroke-dashoffset:1.01;transition:stroke-dashoffset 1000ms ${EASE} var(--d,0ms)}
${at} .d10-draw${n}{stroke-dashoffset:0}
.d10-dim${n}{transition:opacity 500ms ${EASE}}
${at} .d10-dim${n}{opacity:.22}
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
          <i className={`d10-k${i + 1}`} />
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
    className={`d10-stamp ${beat ? `d10-st${beat}` : 'd10-in-st'}`}
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
    <span className={`d10-ty${beat}`}>
      {Array.from(text).map((ch, k) =>
        ch === '\n' ? (
          <br key={k} />
        ) : (
          <span key={k} className="d10-c" style={vars({ d: `${d + i++ * step}ms` })}>
            {ch}
          </span>
        ),
      )}
    </span>
  );
};

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div
    className="d10-in-fade"
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
      className={`d10-page d10-${id}${live ? ' d10-live' : ''}`}
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
  className = 'd10-in-fade',
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
        className={beat ? `d10-draw${beat}` : 'd10-in-draw'}
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
  "id": "ai-history-10-chatgpt",
  "n": 10,
  "short": "ChatGPT & l'IA générative",
  "footer": "ChatGPT — l'IA générative pour tous",
  "title": "ChatGPT",
  "subtitle": "L'IA générative arrive chez tout le monde",
  "lede": "30 novembre 2022 : une simple page de discussion met quatre-vingts ans de recherche entre les mains de tous.",
  "year": "2022",
  "card": "CHATGPT 2022",
  "metaTitle": "ChatGPT : l'IA générative pour tous",
  "next": null
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
      <rect key={i} x={pcX(c) - 4.5} y={pcY(r) - 7.5} width={9} height={15} rx={1.5} fill={ink.hole} className="d10-in-pop" style={vars({ d: `${2900 + c * 80}ms` })} />
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
  <div className="d10-in-fade" style={{ ...vars({ d: '3300ms' }), position: 'absolute', left: 1190, top: 668, width: 590, height: 262 }}>
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
      className="d10-in-fade"
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
      className="d10-in"
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
    <div className="d10-in" style={{ ...vars({ d: '2700ms' }), position: 'absolute', left: L, top: 636 }}>
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
  <div className="d10-in" style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left, top, display: 'flex', gap: 28 }}>
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
  <div className={beat ? `d10-on${beat}` : 'd10-in'} style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: x, top: y, width: w + 16 }}>
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
  <div className={beat ? `d10-on${beat}` : 'd10-in'} style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: x, top: y, width: w, height: h }}>
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
  <div className="d10-in-fade" style={{ ...vars({ d: '1500ms' }), position: 'absolute', left: L, right: RIGHT, top, fontSize: 15, lineHeight: 1.35, color: ink.muted }}>
    {children}
  </div>
);

// ═══ 2 · Le lancement ═══════════════════════════════════════════════════════
const Bubble = ({ who, beat, children }: { who: 'U' | 'A'; beat: number; children: ReactNode }) => (
  <div
    className={beat ? `d10-on${beat}` : 'd10-in'}
    style={{
      ...vars({ d: beat ? '0ms' : '600ms' }),
      alignSelf: who === 'U' ? 'flex-end' : 'flex-start',
      maxWidth: 680,
      marginBottom: 18,
      padding: '14px 20px',
      background: who === 'U' ? ink.blueSoft : '#fffaf0',
      border: `2px solid ${who === 'U' ? ink.blue : ink.rule}`,
      fontSize: 25,
      lineHeight: 1.45,
    }}
  >
    {children}
  </div>
);

const Launch: Page = () => (
  <Frame id="launch" era="30/11/2022" eyebrow="San Francisco, 30 novembre 2022" title="Une « démo de recherche » sans prétention" beats={3}>
    <div className="d10-in" style={{ ...vars({ d: '300ms' }), position: 'absolute', left: L, top: 320, width: 820, height: 540, padding: 26, boxSizing: 'border-box', background: ink.sheet, boxShadow: SHADOW, display: 'flex', flexDirection: 'column' }}>
      <Label>ChatGPT · aperçu de recherche</Label>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column' }}>
        <Bubble who="U" beat={0}>
          Explique-moi le perceptron comme à un enfant de 10 ans.
        </Bubble>
        <Bubble who="A" beat={1}>
          Imagine une petite machine qui doit dire « oui » ou « non ». Elle écoute plusieurs indices, et donne plus d'importance à certains…
        </Bubble>
        <Bubble who="U" beat={2}>
          Et maintenant, en un poème ?
        </Bubble>
      </div>
    </div>
    <div className="d10-in" style={{ ...vars({ d: '800ms' }), position: 'absolute', left: 1080, top: 340, width: 700, fontSize: 27, lineHeight: 1.5 }}>
      OpenAI met en ligne, gratuitement, une interface de discussion au-dessus de son modèle GPT-3.5. Aucune annonce fracassante.
    </div>
    <div className="d10-on3" style={{ position: 'absolute', left: 1080, top: 560, width: 700 }}>
      <div style={{ fontFamily: typewriter, fontSize: 40, lineHeight: 1.25, color: 'var(--osd-accent)', textShadow: BLEED }}>
        Une simple question, en français, et une réponse qui se lit comme celle d'un humain.
      </div>
    </div>
    <Hand x={L + 10} y={880} w={820} rot={-1} size={28} d={1500}>
      conversation illustrative
    </Hand>
  </Frame>
);

// ═══ 3 · L'adoption la plus rapide ══════════════════════════════════════════
const Adoption = ({ beat, name, days, w, hot }: { beat: number; name: string; days: string; w: number; hot?: boolean }) => (
  <div className={beat ? `d10-on${beat}` : 'd10-in'} style={{ ...vars({ d: beat ? '0ms' : '500ms' }), display: 'flex', alignItems: 'center', gap: 26, height: 90 }}>
    <span style={{ width: 260, fontFamily: typewriter, fontSize: 32, color: hot ? ink.red : ink.text }}>{name}</span>
    <span style={{ width: 900, height: 40, background: ink.sheet, border: `1.5px solid ${ink.rule}` }}>
      <span className={beat ? `d10-grow${beat}` : 'd10-in-grow'} style={{ ...vars({ d: '200ms' }), display: 'block', width: w, height: '100%', background: hot ? ink.red : ink.faint }} />
    </span>
    <span style={{ fontFamily: typewriter, fontSize: 30, color: hot ? ink.red : ink.text }}>{days}</span>
  </div>
);

const Adopt: Page = () => (
  <Frame id="adopt" era="2023" eyebrow="Un raz-de-marée" title="Le service le plus vite adopté de l'histoire" beats={2}>
    <div className="d10-in-fade" style={{ ...vars({ d: '300ms' }), position: 'absolute', left: L + 286, top: 320, fontSize: 23, color: ink.muted }}>
      temps pour atteindre 100 millions d'utilisateurs (estimations publiées en 2023)
    </div>
    <div style={{ position: 'absolute', left: L, top: 370 }}>
      <Adoption beat={0} name="TikTok" days="≈ 9 mois" w={300} />
      <Adoption beat={0} name="Instagram" days="≈ 2,5 ans" w={900} />
      <Adoption beat={1} name="ChatGPT" days="≈ 2 mois" w={66} hot />
    </div>
    <div className="d10-on1" style={{ ...vars({ d: '300ms' }), position: 'absolute', left: L, top: 680, width: CW, fontSize: 28, lineHeight: 1.5 }}>
      Un million d'utilisateurs en cinq jours.
    </div>
    <div className="d10-on2" style={{ position: 'absolute', left: L, top: 770, width: CW }}>
      <div style={{ fontFamily: typewriter, fontSize: 40, lineHeight: 1.25, textShadow: BLEED }}>
        Pour la première fois, le grand public utilise directement une IA de pointe.
      </div>
    </div>
  </Frame>
);

// ═══ 4 · Qu'est-ce qu'il y a dedans ? ═══════════════════════════════════════
const Inside: Page = () => (
  <Frame id="inside" era="Méthode" eyebrow="Ce qu'il y a sous le capot" title="Une seule tâche : deviner le mot suivant" beats={3}>
    <div className="d10-in" style={{ ...vars({ d: '300ms' }), position: 'absolute', left: L, top: 340, fontFamily: typewriter, fontSize: 52, textShadow: BLEED }}>
      Le chat dort sur le <span style={{ display: 'inline-block', width: 220, borderBottom: `4px solid ${ink.text}` }} />
    </div>
    <div style={{ position: 'absolute', left: L, top: 450, width: 900 }}>
      <div className="d10-on1" style={{ display: 'flex', alignItems: 'center', gap: 20, height: 56 }}>
        <span style={{ width: 200, fontFamily: typewriter, fontSize: 32, color: ink.red }}>canapé</span>
        <span style={{ width: 420 * 0.41, height: 26, background: ink.red }} />
        <span style={{ fontFamily: mono, fontSize: 24 }}>41 %</span>
      </div>
      <div className="d10-on1" style={{ ...vars({ d: '150ms' }), display: 'flex', alignItems: 'center', gap: 20, height: 56 }}>
        <span style={{ width: 200, fontFamily: typewriter, fontSize: 32 }}>lit</span>
        <span style={{ width: 420 * 0.27, height: 26, background: ink.faint }} />
        <span style={{ fontFamily: mono, fontSize: 24 }}>27 %</span>
      </div>
      <div className="d10-on1" style={{ ...vars({ d: '300ms' }), display: 'flex', alignItems: 'center', gap: 20, height: 56 }}>
        <span style={{ width: 200, fontFamily: typewriter, fontSize: 32 }}>tapis</span>
        <span style={{ width: 420 * 0.12, height: 26, background: ink.faint }} />
        <span style={{ fontFamily: mono, fontSize: 24 }}>12 %</span>
      </div>
    </div>
    <div className="d10-on2" style={{ position: 'absolute', left: 1180, top: 340, width: 600, fontSize: 27, lineHeight: 1.5 }}>
      Un Transformer (dossier 9) qui a lu une grande partie du web écrit. Il choisit un mot, l'ajoute au texte, et recommence.
    </div>
    <div className="d10-on3" style={{ position: 'absolute', left: 1180, top: 560, width: 600, fontSize: 27, lineHeight: 1.5 }}>
      Pour bien deviner la suite de milliards de textes, il a dû apprendre la grammaire, des faits, des styles, des raisonnements.
    </div>
    <div className="d10-on3" style={{ ...vars({ d: '400ms' }), position: 'absolute', left: L, top: 760, width: 900 }}>
      <NavCard id="llm-explique" kicker="Le mécanisme en détail">
        Comment fonctionne un LLM
      </NavCard>
    </div>
    <Hand x={L + 10} y={640} w={800} rot={-1} size={28} d={1500}>
      probabilités illustratives
    </Hand>
  </Frame>
);

// ═══ 5 · Trois étapes d'entraînement ════════════════════════════════════════
const Stage = ({ x, beat, k, title, data, children, c }: { x: number; beat: number; k: string; title: string; data: string; children: ReactNode; c: string }) => (
  <div className={beat ? `d10-on${beat}` : 'd10-in'} style={{ ...vars({ d: beat ? '0ms' : '400ms' }), position: 'absolute', left: x, top: 330, width: 500, height: 500, padding: '24px 30px', boxSizing: 'border-box', background: ink.sheet, boxShadow: SHADOW, borderTop: `6px solid ${c}` }}>
    <div style={{ fontFamily: typewriter, fontSize: 70, lineHeight: 1, color: c }}>{k}</div>
    <div style={{ marginTop: 12, fontFamily: typewriter, fontSize: 34, lineHeight: 1.15, textShadow: BLEED }}>{title}</div>
    <div style={{ marginTop: 14 }}>
      <Label>{data}</Label>
    </div>
    <div style={{ marginTop: 14, fontSize: 24, lineHeight: 1.45, color: ink.soft }}>{children}</div>
  </div>
);

const Stages: Page = () => (
  <Frame id="stages" era="Méthode" eyebrow="Du compléteur de texte à l'assistant" title="Trois étapes pour en faire un assistant" beats={2}>
    <Stage x={170} beat={0} k="1" title="Pré-entraînement" data="Des centaines de milliards de mots" c={ink.text}>
      Deviner le mot suivant sur des livres, des sites, du code. On obtient un modèle qui complète du texte, pas encore un assistant.
    </Stage>
    <Stage x={725} beat={1} k="2" title="Ajustement par l'exemple" data="Des dizaines de milliers de dialogues" c={ink.blue}>
      Des humains écrivent des questions et des réponses modèles. Le modèle apprend le format « question → réponse utile ».
    </Stage>
    <Stage x={1280} beat={2} k="3" title="Apprentissage par retour humain" data="RLHF" c={ink.red}>
      Des humains classent plusieurs réponses du modèle. On renforce celles qu'ils préfèrent, comme AlphaGo renforçait ses coups gagnants (dossier 8).
    </Stage>
  </Frame>
);

// ═══ 6 · Le RLHF ════════════════════════════════════════════════════════════
const Answer = ({ y, beat, rank, children, hot }: { y: number; beat: number; rank: string; children: ReactNode; hot?: boolean }) => (
  <div className={beat ? `d10-on${beat}` : 'd10-in'} style={{ ...vars({ d: beat ? '0ms' : '400ms' }), position: 'absolute', left: L, top: y, width: 1000, display: 'flex', alignItems: 'center', gap: 24 }}>
    <span style={{ width: 760, padding: '14px 20px', background: '#fffaf0', border: `2px solid ${hot ? ink.red : ink.rule}`, fontSize: 24, lineHeight: 1.4 }}>{children}</span>
    <span className="d10-fade1" style={{ width: 90, height: 70, display: 'grid', placeItems: 'center', background: hot ? ink.redSoft : ink.sheet, border: `3px solid ${hot ? ink.red : ink.faint}`, fontFamily: typewriter, fontSize: 40, color: hot ? ink.red : ink.muted }}>
      {rank}
    </span>
  </div>
);

const Rlhf: Page = () => (
  <Frame id="rlhf" era="2022" eyebrow="Le dernier ingrédient : le retour humain" title="Apprendre ce que les humains préfèrent" beats={3}>
    <div className="d10-in" style={{ ...vars({ d: '200ms' }), position: 'absolute', left: L, top: 320, fontFamily: typewriter, fontSize: 32, textShadow: BLEED }}>
      « Comment calmer un enfant qui fait une colère ? »
    </div>
    <Answer y={400} beat={0} rank="2">
      « Les colères sont normales. Voici trois idées : rester calme, nommer l'émotion, proposer un choix simple. »
    </Answer>
    <Answer y={520} beat={0} rank="1" hot>
      « C'est épuisant, et c'est normal. D'abord, gardez votre calme : votre voix posée l'aide à se calmer. Ensuite… »
    </Answer>
    <Answer y={640} beat={0} rank="3">
      « Les colères ont été étudiées par de nombreux psychologues depuis le XXe siècle. »
    </Answer>
    <div className="d10-on2" style={{ position: 'absolute', left: 1240, top: 400, width: 540, fontSize: 26, lineHeight: 1.5 }}>
      Des milliers de classements servent à entraîner un « modèle de récompense » qui imite le jugement humain.
    </div>
    <div className="d10-on3" style={{ position: 'absolute', left: 1240, top: 600, width: 540, fontSize: 26, lineHeight: 1.5 }}>
      Puis le modèle de langage est ajusté par renforcement pour obtenir de bonnes notes : plus utile, plus poli, plus prudent.
    </div>
    <Hand x={L + 10} y={790} w={1000} rot={-1} size={30} d={1300}>
      Méthode décrite par OpenAI en 2022 (InstructGPT). Exemple illustratif.
    </Hand>
  </Frame>
);

// ═══ 7 · Au-delà du texte ═══════════════════════════════════════════════════
const Gen = ({ x, beat, year, name, children }: { x: number; beat: number; year: string; name: string; children: ReactNode }) => (
  <div className={beat ? `d10-on${beat}` : 'd10-in'} style={{ ...vars({ d: beat ? '0ms' : '400ms' }), position: 'absolute', left: x, top: 330, width: 370, height: 420, padding: '22px 26px', boxSizing: 'border-box', background: ink.sheet, boxShadow: SHADOW }}>
    <div style={{ fontFamily: typewriter, fontSize: 48, lineHeight: 1, color: ink.red }}>{year}</div>
    <div style={{ marginTop: 12, fontFamily: typewriter, fontSize: 32, textShadow: BLEED }}>{name}</div>
    <div style={{ marginTop: 14, fontSize: 23, lineHeight: 1.45, color: ink.soft }}>{children}</div>
  </div>
);

const Generative: Page = () => (
  <Frame id="generative" era="2014–2024" eyebrow="L'IA générative" title="Du texte, des images, du son…" beats={3}>
    <Gen x={170} beat={0} year="2014" name="Les GANs">
      Ian Goodfellow fait s'affronter deux réseaux : l'un crée des images, l'autre repère les fausses.
    </Gen>
    <Gen x={570} beat={1} year="2021–22" name="DALL·E, Midjourney">
      Des images à partir d'une phrase, grâce aux modèles de diffusion, qui apprennent à « débruiter ».
    </Gen>
    <Gen x={970} beat={2} year="2023" name="GPT-4 et les autres">
      Des modèles qui lisent aussi les images. Concurrents : Claude, Gemini, Llama, Mistral…
    </Gen>
    <Gen x={1370} beat={3} year="2024" name="Son et vidéo">
      Voix, musique, vidéo : tout ce qui peut devenir une suite de nombres peut être généré.
    </Gen>
    <Hand x={L + 10} y={800} w={1500} rot={-0.8} size={30} d={1500}>
      Même recette partout : des données en masse, un réseau géant, et un objectif simple à prédire.
    </Hand>
  </Frame>
);

// ═══ 8 · Les limites ════════════════════════════════════════════════════════
const Risk = ({ beat, title, children }: { beat: number; title: string; children: ReactNode }) => (
  <div className={beat ? `d10-on${beat}` : 'd10-in'} style={{ ...vars({ d: beat ? '0ms' : '500ms' }), marginBottom: 32 }}>
    <div style={{ fontFamily: typewriter, fontSize: 34, textShadow: BLEED }}>{title}</div>
    <div style={{ marginTop: 6, fontSize: 25, lineHeight: 1.45, color: ink.soft }}>{children}</div>
  </div>
);

const Limits: Page = () => (
  <Frame id="limits" era="Auj." eyebrow="Ce qu'il faut garder en tête" title="Impressionnant, mais pas infaillible" beats={3}>
    <div style={{ position: 'absolute', left: L, top: 330, width: 1050 }}>
      <Risk beat={0} title="Les « hallucinations »">
        Le modèle produit ce qui est plausible, pas forcément ce qui est vrai : sources inventées, dates fausses, avec assurance.
      </Risk>
      <Risk beat={1} title="Les biais">
        Appris sur des textes humains, il en reproduit les stéréotypes (dossier 7).
      </Risk>
      <Risk beat={2} title="Les données et le droit d'auteur">
        D'où viennent les textes et les images d'entraînement ? Des procès sont en cours.
      </Risk>
      <Risk beat={3} title="L'énergie et le coût">
        Entraîner et faire tourner ces modèles demande d'immenses centres de calcul.
      </Risk>
    </div>
    <Stamp pos={{ left: 1360, top: 420 }} rot={-8} size={46} d={1200}>
      À vérifier
    </Stamp>
    <Hand x={1330} y={540} w={450} rot={-2} size={32} d={1500}>
      Un bon réflexe : vérifier tout ce qui compte.
    </Hand>
  </Frame>
);

// ═══ 9 · Toute l'histoire ═══════════════════════════════════════════════════
const StoryLine = ({ i, year, what, beat }: { i: number; year: string; what: string; beat: number }) => (
  <div className={beat ? `d10-on${beat}` : 'd10-in'} style={{ ...vars({ d: beat ? `${i * 120}ms` : `${300 + i * 120}ms` }), position: 'absolute', left: L + (i % 2) * 820, top: 330 + Math.floor(i / 2) * 92, width: 780, display: 'flex', alignItems: 'baseline', gap: 22 }}>
    <span style={{ width: 60, flex: 'none', fontFamily: mono, fontSize: 22, fontWeight: 700, color: ink.red }}>{pad2(i)}</span>
    <span style={{ width: 100, flex: 'none', fontFamily: typewriter, fontSize: 32, color: ink.muted }}>{year}</span>
    <span style={{ fontSize: 27, lineHeight: 1.3 }}>{what}</span>
  </div>
);

const Story: Page = () => (
  <Frame id="story" era="1943 → 2022" eyebrow="Les onze dossiers, en une page" title="Quatre-vingts ans pour en arriver là" beats={1}>
    <StoryLine i={0} year="1943" what="Un neurone, c'est un seuil." beat={0} />
    <StoryLine i={1} year="1957" what="Une machine apprend de ses erreurs." beat={0} />
    <StoryLine i={2} year="1986" what="L'erreur remonte toutes les couches." beat={0} />
    <StoryLine i={3} year="1956" what="L'autre voie : des règles écrites." beat={0} />
    <StoryLine i={4} year="1989" what="Un filtre apprend à voir." beat={0} />
    <StoryLine i={5} year="1997" what="Le calcul bat le champion." beat={0} />
    <StoryLine i={6} year="2012" what="Données + cartes graphiques." beat={1} />
    <StoryLine i={7} year="2013" what="Le sens devient géométrie." beat={1} />
    <StoryLine i={8} year="2016" what="Apprendre en jouant contre soi." beat={1} />
    <StoryLine i={9} year="2017" what="Chaque mot regarde les autres." beat={1} />
    <StoryLine i={10} year="2022" what="L'IA dans toutes les mains." beat={1} />
  </Frame>
);

// ═══ 10 · Ce qu'il faut retenir ═════════════════════════════════════════════
const Lesson: Page = () => (
  <Frame id="lesson" eyebrow="Ce qu'il faut retenir" beats={1}>
    <div className="d10-in-fade" style={{ position: 'absolute', left: L - 16, top: 170, fontFamily: typewriter, fontSize: 300, lineHeight: 1, color: ink.rule }}>
      «
    </div>
    <div style={{ position: 'absolute', left: L, top: 370, fontFamily: typewriter, fontSize: 64, lineHeight: 1.22, textShadow: BLEED }}>
      <Typed text="Les idées viennent de 1943, 1957, 1986…" d={400} step={28} />
    </div>
    <div style={{ position: 'absolute', left: L, top: 470, fontFamily: typewriter, fontSize: 64, lineHeight: 1.22, textShadow: BLEED }}>
      <Typed text="ChatGPT les a mises " beat={1} step={30} />
      <span style={{ color: 'var(--osd-accent)' }}>
        <Mark beat={1} d={1200}>
          <Typed text="dans toutes les mains" beat={1} d={600} step={30} />
        </Mark>
      </span>
      <Typed text="." beat={1} d={1230} step={30} />
    </div>
    <SeriesNav left={L} top={700} d={800} />
    <div className="d10-in" style={{ ...vars({ d: '1000ms' }), position: 'absolute', left: L + 428, top: 700 }}>
      <NavCard id="llm-explique" kicker="Pour aller plus loin">
        Comment fonctionne un LLM
      </NavCard>
    </div>
    <Photo src={imgOpenAI} caption="OpenAI" x={1480} y={640} w={130} h={130} fit="contain" tone={false} rot={-3} d={600} />
    <Credits top={930}>
      Images via Wikimedia Commons : logo OpenAI (domaine public, marque déposée).
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

const STYLE_ID = 'osd-styles-ai-history-10-chatgpt';
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
  title: "ChatGPT : l'IA générative pour tous",
  createdAt: '2026-10-08T05:52:22.289Z',
};

export const notes: (string | undefined)[] = [
  `Dernier dossier, le numéro 10 : novembre 2022, ChatGPT. Le moment où quatre-vingts ans de recherche arrivent entre les mains de tout le monde.
La carte perforée encode « CHATGPT 2022 ».`,
  `30 novembre 2022 : OpenAI met en ligne une « démo de recherche », gratuite, au-dessus de son modèle GPT-3.5.
Clics 1 et 2 : on lui pose une question en langage courant, il répond, on peut enchaîner.
Clic 3 : une réponse qui se lit comme celle d'un humain. La conversation affichée est illustrative.`,
  `Un raz-de-marée. Selon les estimations publiées en 2023 : environ 9 mois pour TikTok, deux ans et demi pour Instagram…
Clic 1 : environ deux mois pour ChatGPT. Un million d'utilisateurs en cinq jours.
Clic 2 : pour la première fois, le grand public utilise directement une IA de pointe.`,
  `Sous le capot, une seule tâche : deviner le mot suivant.
Clic 1 : le modèle donne une probabilité à chaque mot possible.
Clic 2 : c'est un Transformer, du dossier 9, qui a lu une grande partie du web ; il choisit un mot, l'ajoute, et recommence.
Clic 3 : pour deviner la suite de milliards de textes, il a dû apprendre grammaire, faits, styles et raisonnements. Le détail est dans « Comment fonctionne un LLM ».`,
  `Trois étapes d'entraînement. Le pré-entraînement : deviner le mot suivant sur des centaines de milliards de mots ; on obtient un compléteur de texte.
Clic 1 : l'ajustement avec des dialogues écrits par des humains.
Clic 2 : l'apprentissage par retour humain, le RLHF : on renforce les réponses préférées, comme AlphaGo renforçait ses coups gagnants.`,
  `Le RLHF en pratique. Pour une même question, le modèle propose plusieurs réponses.
Clic 1 : des humains les classent.
Clic 2 : ces classements entraînent un modèle de récompense qui imite le jugement humain.
Clic 3 : puis le modèle de langage est ajusté pour obtenir de bonnes notes. C'est la méthode InstructGPT, décrite par OpenAI en 2022.`,
  `L'IA générative ne s'arrête pas au texte. 2014 : les GANs de Ian Goodfellow.
Clic 1 : 2021-2022, les images à partir d'une phrase, avec les modèles de diffusion.
Clic 2 : 2023, GPT-4 et ses concurrents, qui lisent aussi les images.
Clic 3 : le son et la vidéo. Même recette partout.`,
  `Mais attention. Les hallucinations : le modèle produit du plausible, pas forcément du vrai.
Clic 1 : les biais. Clic 2 : les questions de droit d'auteur. Clic 3 : l'énergie et le coût.
Un bon réflexe : vérifier tout ce qui compte.`,
  `Toute l'histoire en une page, un dossier par ligne.
Clic : de 2012 à 2022, tout s'accélère. Chaque étape s'appuie sur les précédentes.`,
  `À retenir : les idées viennent de 1943, 1957, 1986… Clic : ChatGPT les a mises dans toutes les mains.
Fin de la série. Retour au sommaire général, et la présentation « Comment fonctionne un LLM » pour aller plus loin. Merci.`,
];

export default [Cover, Launch, Adopt, Inside, Stages, Rlhf, Generative, Limits, Story, Lesson] satisfies Page[];
