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

export const design: DesignSystem = {
  palette: { bg: '#faf7f0', text: '#1d1b16', accent: '#c8452b' },
  fonts: {
    display: '"Newsreader", "Iowan Old Style", Georgia, serif',
    body: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
  },
  typeScale: { hero: 150, body: 32 },
  radius: 14,
};

// ─── Webfonts (module-level, slide-keyed) ───────────────────────────────────
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&display=swap';
const FONT_LINK_ID = 'osd-webfont-ml-explique';
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

// ─── Palette (paper / ink / pastel tokens) ──────────────────────────────────
const ink = {
  text: '#1d1b16',
  soft: '#4a463d',
  muted: '#7a7466',
  faint: '#b5ae9e',
  rule: '#e2dccd',
  panel: '#f2ede1',
  card: '#fffdf8',
  accent: '#c8452b',
  accentSoft: 'rgba(200, 69, 43, 0.14)',
};

const tone = {
  paper: { bg: '#fffdf8', bd: '#ddd5c3', fg: '#4a463d' },
  peach: { bg: '#fde2cf', bd: '#e9a27c', fg: '#b35a2c' },
  mint: { bg: '#d3ecdc', bd: '#7fbb98', fg: '#2f7a52' },
  lav: { bg: '#e0daf6', bd: '#9a8fda', fg: '#5b4fb0' },
  sky: { bg: '#d3e6f6', bd: '#7eaedb', fg: '#2f6ea8' },
  butter: { bg: '#fbedbb', bd: '#d9b44c', fg: '#8a6a12' },
  rose: { bg: '#f8d6e0', bd: '#d78aa2', fg: '#a8456a' },
  sage: { bg: '#e0e8cb', bd: '#9db46c', fg: '#5d7330' },
  accent: { bg: '#fbe1d9', bd: '#c8452b', fg: '#c8452b' },
};
type Tone = keyof typeof tone;
const CYCLE: Tone[] = ['peach', 'mint', 'lav', 'sky', 'butter', 'rose', 'sage'];

const mono = '"JetBrains Mono", ui-monospace, "SF Mono", Consolas, monospace';
const serif = 'var(--osd-font-display)';
const sans = 'var(--osd-font-body)';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';

// ─── Small helpers ──────────────────────────────────────────────────────────
// CSS custom properties as inline style (React's CSSProperties has no index signature).
const vars = (o: Record<string, string | number>): CSSProperties => {
  const out: Record<string, string | number> = {};
  for (const k of Object.keys(o)) out[`--${k}`] = o[k];
  return out as CSSProperties;
};

// French number formatting: decimal comma, real minus sign, non-breaking thousands.
const fr = (x: number, digits = 2) => x.toFixed(digits).replace('.', ',').replace('-', '−');
const num = (x: number) => {
  const s = String(Math.round(Math.abs(x))).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return x < 0 ? `−${s}` : s;
};

// Deterministic pseudo-random generator (same picture on every render).
const rng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
};
// Roughly standard normal noise (sum of three uniforms, rescaled).
const gauss = (r: () => number) => (r() + r() + r() - 1.5) * 2;
const mean = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
// Linear map from a data interval to a pixel interval.
const lin = (d0: number, d1: number, r0: number, r1: number) => (v: number) =>
  r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
const poly = (pts: [number, number][]) =>
  pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
const deg = (rad: number) => (rad * 180) / Math.PI;

// ─── Stylesheet (collected from every page, injected once at the bottom) ────
const CSS: string[] = [];

// `at(page, n)` matches a page once its n-th click ("beat") has been revealed.
const at = (page: string, n: number) =>
  `.ml-${page}:has([data-osd-step="revealed"] > .ml-k${n})`;
const liveAt = (page: string, n: number) =>
  `.ml-${page}.ml-live:has([data-osd-step="revealed"] > .ml-k${n})`;

CSS.push(`
@keyframes ml-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes ml-fade{from{opacity:0}to{opacity:1}}
@keyframes ml-grow-x{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes ml-draw{from{stroke-dashoffset:1.01}to{stroke-dashoffset:0}}
@keyframes ml-pop{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}
@keyframes ml-dot{0%{opacity:0;transform:scale(0)}60%{opacity:1;transform:scale(1.25)}100%{opacity:1;transform:scale(1)}}
@keyframes ml-pulse{0%{opacity:.7;transform:scale(1)}100%{opacity:0;transform:scale(2.6)}}
@keyframes ml-march{to{stroke-dashoffset:-20}}
.ml-live .ml-in{animation:ml-rise 800ms ${EASE} var(--d,0ms) both}
.ml-live .ml-in-fade{animation:ml-fade 900ms ${EASE} var(--d,0ms) both}
.ml-live .ml-in-grow{animation:ml-grow-x 1000ms ${EASE} var(--d,0ms) both}
.ml-live .ml-in-pop{animation:ml-pop 700ms ${EASE} var(--d,0ms) both}
.ml-in-dot{transform-box:fill-box;transform-origin:center}
.ml-live .ml-in-dot{animation:ml-dot 600ms ${EASE} var(--d,0ms) both}
.ml-in-draw{stroke-dasharray:1 2}
.ml-live .ml-in-draw{animation:ml-draw 1400ms ${EASE} var(--d,0ms) both}
.ml-pulse{transform-box:fill-box;transform-origin:center;opacity:0}
.ml-live .ml-pulse{animation:ml-pulse 1.8s ${EASE_OUT} var(--d,0ms) infinite}
.ml-live .ml-march{animation:ml-march 1s linear infinite}
`);

// Beat utilities: visible from beat n (on / fade / pop), hidden from beat n (off),
// stroke drawn at beat n (draw — path needs pathLength={1}), dimmed at beat n.
for (let n = 1; n <= 8; n++) {
  const has = `.ml-page:has([data-osd-step="revealed"] > .ml-k${n})`;
  CSS.push(`
.ml-on${n}{opacity:0;transform:translateY(14px);transition:opacity 500ms ${EASE} var(--d,0ms),transform 700ms ${EASE} var(--d,0ms)}
${has} .ml-on${n}{opacity:1;transform:none}
.ml-fade${n}{opacity:0;transition:opacity 550ms ${EASE} var(--d,0ms)}
${has} .ml-fade${n}{opacity:1}
.ml-pop${n}{opacity:0;transform:scale(0);transform-box:fill-box;transform-origin:var(--o,center);transition:opacity 300ms ${EASE} var(--d,0ms),transform 650ms ${EASE} var(--d,0ms)}
${has} .ml-pop${n}{opacity:1;transform:none}
.ml-off${n}{transition:opacity 380ms ${EASE} var(--d,0ms)}
${has} .ml-off${n}{opacity:0}
.ml-draw${n}{stroke-dasharray:1 2;stroke-dashoffset:1.01;transition:stroke-dashoffset 1000ms ${EASE} var(--d,0ms)}
${has} .ml-draw${n}{stroke-dashoffset:0}
.ml-dim${n}{transition:opacity 500ms ${EASE}}
${has} .ml-dim${n}{opacity:.22}
`);
}

// ─── Frame components ───────────────────────────────────────────────────────
// Invisible click markers: each beat is a <Step> whose reveal state drives the
// page's CSS (via :has), so a single click can animate SVG, bars, colors…
const Beats = ({ count }: { count: number }) => (
  <div aria-hidden style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0 }}>
    <Steps>
      {Array.from({ length: count }, (_, i) => (
        <Step key={i} duration={0}>
          <i className={`ml-k${i + 1}`} />
        </Step>
      ))}
    </Steps>
  </div>
);

const MapDot = ({ n, stage, first }: { n: number; stage: number; first?: boolean }) => {
  const now = n === stage;
  const past = stage > 6 || n < stage;
  const size = now ? 18 : 12;
  return (
    <>
      {first ? null : (
        <span style={{ width: 30, height: 2, background: past || now ? ink.soft : ink.rule }} />
      )}
      <span
        style={{
          width: size,
          height: size,
          borderRadius: 999,
          boxSizing: 'border-box',
          background: now ? 'var(--osd-accent)' : past ? ink.soft : 'transparent',
          border: `2px solid ${now ? 'var(--osd-accent)' : past ? ink.soft : ink.faint}`,
          boxShadow: now ? `0 0 0 6px ${ink.accentSoft}` : 'none',
        }}
      />
    </>
  );
};

const MiniMap = ({ stage }: { stage: number }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <MapDot n={1} stage={stage} first />
    <MapDot n={2} stage={stage} />
    <MapDot n={3} stage={stage} />
    <MapDot n={4} stage={stage} />
    <MapDot n={5} stage={stage} />
    <MapDot n={6} stage={stage} />
  </div>
);

const Header = ({ eyebrow, stage }: { eyebrow: string; stage: number }) => (
  <div
    style={{
      position: 'absolute',
      left: 140,
      right: 140,
      top: 84,
      height: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <span
      style={{
        fontFamily: mono,
        fontSize: 22,
        fontWeight: 500,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--osd-accent)',
      }}
    >
      {eyebrow}
    </span>
    <MiniMap stage={stage} />
  </div>
);

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 140,
        right: 140,
        bottom: 64,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        fontSize: 22,
        color: ink.muted,
      }}
    >
      <span style={{ fontFamily: serif, fontStyle: 'italic' }}>Comment une machine apprend</span>
      <span style={{ fontFamily: mono, letterSpacing: '0.06em' }}>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

const Frame = ({
  id,
  eyebrow,
  stage = 0,
  beats = 0,
  footer = true,
  children,
}: {
  id: string;
  eyebrow?: string;
  stage?: number;
  beats?: number;
  footer?: boolean;
  children: ReactNode;
}) => {
  const live = useIsActivePage();
  return (
    <div
      className={`ml-page ml-${id}${live ? ' ml-live' : ''}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'var(--osd-bg)',
        color: 'var(--osd-text)',
        fontFamily: sans,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 70% 60% at 22% 18%, rgba(255,255,255,0.75), rgba(255,255,255,0) 70%)',
        }}
      />
      {eyebrow ? <Header eyebrow={eyebrow} stage={stage} /> : null}
      {children}
      {footer ? <Footer /> : null}
      {beats > 0 ? <Beats count={beats} /> : null}
    </div>
  );
};

// ─── Typography & figure components ─────────────────────────────────────────
const Title = ({ children }: { children: ReactNode }) => (
  <h2
    style={{
      position: 'absolute',
      left: 140,
      top: 140,
      margin: 0,
      maxWidth: 1640,
      fontFamily: serif,
      fontWeight: 500,
      fontSize: 66,
      lineHeight: 1.12,
      letterSpacing: '-0.015em',
    }}
  >
    {children}
  </h2>
);

const Lede = ({ children, width = 1400 }: { children: ReactNode; width?: number }) => (
  <p
    style={{
      position: 'absolute',
      left: 140,
      top: 236,
      margin: 0,
      maxWidth: width,
      fontSize: 32,
      lineHeight: 1.45,
      color: ink.soft,
    }}
  >
    {children}
  </p>
);

const Hl = ({ children, c = '#f9e3a1' }: { children: ReactNode; c?: string }) => (
  <mark
    style={{
      background: `linear-gradient(transparent 56%, ${c} 56%)`,
      color: 'inherit',
      padding: '0 3px',
    }}
  >
    {children}
  </mark>
);

const Fig = ({ n, children, style }: { n: number; children: ReactNode; style?: CSSProperties }) => (
  <div
    style={{
      position: 'absolute',
      fontFamily: serif,
      fontStyle: 'italic',
      fontSize: 24,
      lineHeight: 1.4,
      color: ink.muted,
      ...style,
    }}
  >
    <span style={{ fontStyle: 'normal', fontWeight: 500, color: ink.soft }}>Fig. {n}</span> —{' '}
    {children}
  </div>
);

// Small mono caption, absolutely positioned.
const Label = ({
  x,
  y,
  children,
  c = ink.muted,
  className,
  style,
}: {
  x: number;
  y: number;
  children: ReactNode;
  c?: string;
  className?: string;
  style?: CSSProperties;
}) => (
  <div
    className={className}
    style={{ position: 'absolute', left: x, top: y, fontFamily: mono, fontSize: 22, color: c, ...style }}
  >
    {children}
  </div>
);

// Inline chip.
const Chip = ({
  children,
  t = 'paper',
  size = 36,
  className,
  style,
}: {
  children: ReactNode;
  t?: Tone;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) => (
  <span
    className={className}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: mono,
      fontSize: size,
      lineHeight: 1,
      padding: `${Math.round(size * 0.36)}px ${Math.round(size * 0.42)}px`,
      background: tone[t].bg,
      boxShadow: `inset 0 0 0 2px ${tone[t].bd}`,
      borderRadius: 10,
      whiteSpace: 'pre',
      color: ink.text,
      ...style,
    }}
  >
    {children}
  </span>
);

// SVG arrow; drawn on beat `n` when given (line draws, then the head fades in).
const Arrow = ({
  x1,
  y1,
  x2,
  y2,
  color = ink.soft,
  w = 3,
  n,
  d = 0,
  head = 16,
  curve = 0,
  className,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  w?: number;
  n?: number;
  d?: number;
  head?: number;
  curve?: number;
  className?: string;
}) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const mx = (x1 + x2) / 2 - (dy / len) * curve;
  const my = (y1 + y2) / 2 + (dx / len) * curve;
  const tx = curve ? x2 - mx : dx;
  const ty = curve ? y2 - my : dy;
  const tl = Math.hypot(tx, ty) || 1;
  const ex = tx / tl;
  const ey = ty / tl;
  const bx = x2 - ex * head;
  const by = y2 - ey * head;
  const hw = head * 0.55;
  const path = curve ? `M ${x1} ${y1} Q ${mx} ${my} ${bx} ${by}` : `M ${x1} ${y1} L ${bx} ${by}`;
  const pts = `${x2},${y2} ${bx - ey * hw},${by + ex * hw} ${bx + ey * hw},${by - ex * hw}`;
  return (
    <g className={className}>
      <path
        d={path}
        pathLength={1}
        fill="none"
        stroke={color}
        strokeWidth={w}
        strokeLinecap="round"
        className={n ? `ml-draw${n}` : undefined}
        style={vars({ d: `${d}ms` })}
      />
      <polygon
        points={pts}
        fill={color}
        className={n ? `ml-fade${n}` : undefined}
        style={vars({ d: `${d + 450}ms` })}
      />
    </g>
  );
};

// Numbered explanatory note.
const Note = ({
  n,
  title,
  children,
  className,
  style,
}: {
  n?: string;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) => (
  <div className={className} style={{ position: 'absolute', display: 'flex', gap: 22, ...style }}>
    {n ? (
      <span
        style={{
          flex: 'none',
          width: 46,
          height: 46,
          borderRadius: 999,
          boxSizing: 'border-box',
          border: '2px solid var(--osd-accent)',
          color: 'var(--osd-accent)',
          fontFamily: mono,
          fontSize: 22,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 2,
        }}
      >
        {n}
      </span>
    ) : null}
    <div>
      {title ? (
        <div style={{ fontFamily: serif, fontSize: 34, fontWeight: 500, lineHeight: 1.2, marginBottom: 6 }}>
          {title}
        </div>
      ) : null}
      <div style={{ fontSize: 28, lineHeight: 1.45, color: ink.soft }}>{children}</div>
    </div>
  </div>
);

// Formula line inside a Note.
const Formula = ({ children }: { children: ReactNode }) => (
  <div style={{ fontFamily: mono, fontSize: 28, lineHeight: 1.45, color: ink.accent }}>{children}</div>
);

// Card shell shared by the three-column pages.
const Card = ({
  x,
  top = 390,
  w = 520,
  h,
  cls,
  pad = 30,
  children,
}: {
  x: number;
  top?: number;
  w?: number;
  h: number;
  cls?: string;
  pad?: number;
  children: ReactNode;
}) => (
  <div
    className={cls}
    style={{
      position: 'absolute',
      left: x,
      top,
      width: w,
      height: h,
      boxSizing: 'border-box',
      padding: pad,
      background: ink.card,
      borderRadius: 18,
      boxShadow: `0 0 0 1.5px ${ink.rule}, 0 14px 36px -24px rgba(60, 40, 10, 0.35)`,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {children}
  </div>
);

const CardTitle = ({ children, size = 38 }: { children: ReactNode; size?: number }) => (
  <div style={{ fontFamily: serif, fontSize: size, fontWeight: 500, lineHeight: 1.2 }}>{children}</div>
);

const CardText = ({ children, size = 28, c = ink.soft }: { children: ReactNode; size?: number; c?: string }) => (
  <div style={{ fontSize: size, lineHeight: 1.45, color: c, marginTop: 10 }}>{children}</div>
);

const Rule = () => <div style={{ height: 1, background: ink.rule, margin: '18px 0' }} />;

// ─── Plot primitives (SVG) ──────────────────────────────────────────────────
const tick: CSSProperties = { fontFamily: mono, fontSize: 20 };
const axisTitle: CSSProperties = { fontFamily: mono, fontSize: 22 };

const AxisX = ({ x1, x2, y }: { x1: number; x2: number; y: number }) => (
  <line x1={x1} y1={y} x2={x2} y2={y} stroke={ink.soft} strokeWidth={2} />
);
const AxisY = ({ x, y1, y2 }: { x: number; y1: number; y2: number }) => (
  <line x1={x} y1={y1} x2={x} y2={y2} stroke={ink.soft} strokeWidth={2} />
);
const TickX = ({ x, y, label }: { x: number; y: number; label: string }) => (
  <g>
    <line x1={x} y1={y} x2={x} y2={y + 8} stroke={ink.soft} strokeWidth={2} />
    <text x={x} y={y + 32} textAnchor="middle" style={tick} fill={ink.muted}>
      {label}
    </text>
  </g>
);
const TickY = ({ x, y, label }: { x: number; y: number; label: string }) => (
  <g>
    <line x1={x - 8} y1={y} x2={x} y2={y} stroke={ink.soft} strokeWidth={2} />
    <text x={x - 14} y={y + 7} textAnchor="end" style={tick} fill={ink.muted}>
      {label}
    </text>
  </g>
);
const GridY = ({ x1, x2, y }: { x1: number; x2: number; y: number }) => (
  <line x1={x1} y1={y} x2={x2} y2={y} stroke={ink.rule} strokeWidth={1} strokeDasharray="4 8" />
);

// ─── Shared data: the apartments (surface → monthly rent) ───────────────────
// Fictional, deterministic: rent ≈ 12 €/m² × surface + 250 € + noise.
type Apt = { s: number; l: number };
const aptRand = rng(5);
const APT: Apt[] = Array.from({ length: 22 }, (_, i) => {
  const s = 18 + i * 4.6 + (aptRand() - 0.5) * 5;
  return { s, l: 12 * s + 250 + gauss(aptRand) * 70 };
});
const SX = mean(APT.map((p) => p.s));
const LY = mean(APT.map((p) => p.l));
const VS = mean(APT.map((p) => (p.s - SX) ** 2));
// Least squares: the line that minimises the mean squared error.
const W_BEST = mean(APT.map((p) => (p.s - SX) * (p.l - LY))) / VS;
const B_BEST = LY - W_BEST * SX;
const mse = (w: number, b: number, pts: Apt[]) => mean(pts.map((p) => (w * p.s + b - p.l) ** 2));
// Lines through the centroid: b is set so that the line passes through (SX, LY).
const bFor = (w: number) => LY - w * SX;
const L_MIN = mse(W_BEST, B_BEST, APT);
const lossW = (w: number) => L_MIN + VS * (w - W_BEST) ** 2;

// Shared plot frame for the apartment pages (svg 1000 × 490).
const MX = lin(10, 130, 90, 970);
const MY = lin(200, 1900, 430, 20);
const M_CX = MX(SX);
const M_CY = MY(LY);
// On-screen angle of a line of slope w (€/m²).
const angleFor = (w: number) => deg(Math.atan((w * (MY(1) - MY(0))) / (MX(1) - MX(0))));

const AptAxes = () => (
  <g>
    <GridY x1={90} x2={970} y={MY(500)} />
    <GridY x1={90} x2={970} y={MY(1000)} />
    <GridY x1={90} x2={970} y={MY(1500)} />
    <AxisX x1={90} x2={970} y={430} />
    <AxisY x={90} y1={430} y2={14} />
    <TickX x={MX(25)} y={430} label="25" />
    <TickX x={MX(50)} y={430} label="50" />
    <TickX x={MX(75)} y={430} label="75" />
    <TickX x={MX(100)} y={430} label="100" />
    <TickX x={MX(125)} y={430} label="125" />
    <TickY x={90} y={MY(500)} label="500" />
    <TickY x={90} y={MY(1000)} label="1 000" />
    <TickY x={90} y={MY(1500)} label="1 500" />
    <text x={970} y={488} textAnchor="end" style={axisTitle} fill={ink.muted}>
      surface (m²) →
    </text>
    <text x={0} y={-6} style={axisTitle} fill={ink.muted}>
      loyer (€ / mois)
    </text>
  </g>
);

// Shared data: e-mails described by two features (links, % of capitals).
type Mail = { x1: number; x2: number; y: number; z: number };
const SPAM_W1 = 0.45;
const SPAM_W2 = 0.12;
const SPAM_B = -6;
const spamZ = (x1: number, x2: number) => SPAM_W1 * x1 + SPAM_W2 * x2 + SPAM_B;
const mailRand = rng(21);
const MAILS: Mail[] = [];
while (MAILS.length < 36) {
  const x1 = 0.5 + mailRand() * 19;
  const x2 = 2 + mailRand() * 56;
  const z = spamZ(x1, x2);
  const y = z + gauss(mailRand) * 0.9 > 0 ? 1 : 0;
  if (Math.abs(z) >= 0.4) MAILS.push({ x1, x2, y, z });
}
// Shared plot frame for the e-mail pages (svg 780 × 480).
const EX = lin(0, 20, 70, 760);
const EY = lin(0, 60, 420, 20);
const NEW_MAIL = { x1: 10, x2: 28 };
const NEW_Z = spamZ(NEW_MAIL.x1, NEW_MAIL.x2);
const NEW_P = sigmoid(NEW_Z);

const MailAxes = () => (
  <g>
    <AxisX x1={70} x2={760} y={420} />
    <AxisY x={70} y1={420} y2={14} />
    <TickX x={EX(0)} y={420} label="0" />
    <TickX x={EX(5)} y={420} label="5" />
    <TickX x={EX(10)} y={420} label="10" />
    <TickX x={EX(15)} y={420} label="15" />
    <TickX x={EX(20)} y={420} label="20" />
    <TickY x={70} y={EY(20)} label="20" />
    <TickY x={70} y={EY(40)} label="40" />
    <TickY x={70} y={EY(60)} label="60" />
    <text x={760} y={478} textAnchor="end" style={axisTitle} fill={ink.muted}>
      liens dans l'e-mail →
    </text>
    <text x={0} y={-6} style={axisTitle} fill={ink.muted}>
      % de MAJUSCULES
    </text>
  </g>
);

// Spam = filled rose dot; legitimate = hollow mint ring (shape + color).
const MailDot = ({ m, d }: { m: Mail; d: number }) =>
  m.y ? (
    <circle
      cx={EX(m.x1)}
      cy={EY(m.x2)}
      r={10}
      fill={tone.rose.bd}
      stroke={ink.card}
      strokeWidth={3}
      className="ml-in-dot"
      style={vars({ d: `${d}ms` })}
    />
  ) : (
    <circle
      cx={EX(m.x1)}
      cy={EY(m.x2)}
      r={9}
      fill={ink.card}
      stroke={tone.mint.fg}
      strokeWidth={3.5}
      className="ml-in-dot"
      style={vars({ d: `${d}ms` })}
    />
  );

const MailLegend = ({ x, y }: { x: number; y: number }) => (
  <g>
    <circle cx={x} cy={y} r={10} fill={tone.rose.bd} stroke={ink.card} strokeWidth={3} />
    <text x={x + 20} y={y + 8} style={{ fontFamily: sans, fontSize: 22 }} fill={ink.soft}>
      spam
    </text>
    <circle cx={x + 110} cy={y} r={9} fill={ink.card} stroke={tone.mint.fg} strokeWidth={3.5} />
    <text x={x + 130} y={y + 8} style={{ fontFamily: sans, fontSize: 22 }} fill={ink.soft}>
      légitime
    </text>
  </g>
);

// ═══ 1 · Cover ═══════════════════════════════════════════════════════════════
const AUTHOR = 'Houssem Eddine Lassoued';
const AUTHOR_LINKEDIN = 'https://www.linkedin.com/in/houssemeddinelassoued';

// Author portrait: circular crop, card-style ring, accent arc.
const PORTRAIT = 150;
const RING_PAD = 16;
const RING_R = 88;
const RING_C = PORTRAIT / 2 + RING_PAD;
const polar = (a: number) => {
  const r = (a * Math.PI) / 180;
  return `${(RING_C + RING_R * Math.cos(r)).toFixed(1)} ${(RING_C + RING_R * Math.sin(r)).toFixed(1)}`;
};
const RING_ARC = `M ${polar(-100)} A ${RING_R} ${RING_R} 0 0 1 ${polar(10)}`;

const Portrait = () => (
  <div style={{ position: 'relative', flex: 'none', width: PORTRAIT, height: PORTRAIT }}>
    <div
      style={{
        width: PORTRAIT,
        height: PORTRAIT,
        borderRadius: 999,
        overflow: 'hidden',
        background: ink.text,
        boxShadow: `0 0 0 5px ${ink.card}, 0 0 0 6.5px ${ink.rule}, 0 16px 32px -18px rgba(60, 40, 10, 0.5)`,
      }}
    >
      <img
        src={portrait}
        alt={AUTHOR}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scale(1.18)',
          transformOrigin: '56% 36%',
          filter: 'grayscale(1) sepia(0.14) contrast(1.04)',
        }}
      />
    </div>
    <svg
      width={RING_C * 2}
      height={RING_C * 2}
      style={{ position: 'absolute', left: -RING_PAD, top: -RING_PAD, overflow: 'visible', pointerEvents: 'none' }}
    >
      <path
        d={RING_ARC}
        pathLength={1}
        className="ml-in-draw"
        fill="none"
        stroke={ink.accent}
        strokeWidth={3}
        strokeLinecap="round"
        style={vars({ d: '900ms' })}
      />
    </svg>
  </div>
);

// Cover band: the apartment data in miniature, a fitted line, one prediction.
const CV_X = lin(10, 140, 0, 1000);
const CV_Y = lin(300, 1900, 172, 0);
const CV_S = 130;
const CV_PRED = W_BEST * CV_S + B_BEST;
const CV_PX = CV_X(CV_S);
const CV_PY = CV_Y(CV_PRED);

const Cover: Page = () => (
  <Frame id="cover" footer={false}>
    <div
      className="ml-in"
      style={{
        position: 'absolute',
        left: 140,
        top: 196,
        fontFamily: mono,
        fontSize: 24,
        fontWeight: 500,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--osd-accent)',
      }}
    >
      Une visite guidée · pour ingénieurs
    </div>
    <h1
      className="ml-in"
      style={{
        ...vars({ d: '90ms' }),
        position: 'absolute',
        left: 132,
        top: 246,
        margin: 0,
        fontFamily: serif,
        fontWeight: 500,
        fontSize: 'var(--osd-size-hero)',
        lineHeight: 1.0,
        letterSpacing: '-0.025em',
      }}
    >
      Comment une machine
      <br />
      <em style={{ color: 'var(--osd-accent)' }}>apprend</em>
    </h1>
    <p
      className="ml-in"
      style={{
        ...vars({ d: '180ms' }),
        position: 'absolute',
        left: 140,
        top: 580,
        margin: 0,
        maxWidth: 1250,
        fontSize: 36,
        lineHeight: 1.45,
        color: ink.soft,
      }}
    >
      Le machine learning expliqué pas à pas : données, modèle, erreur, gradient et généralisation.
    </p>

    <svg
      width={1080}
      height={180}
      style={{ position: 'absolute', left: 140, top: 706, overflow: 'visible', pointerEvents: 'none' }}
    >
      <line x1={0} y1={180} x2={1000} y2={180} stroke={ink.rule} strokeWidth={2} className="ml-in-fade" style={vars({ d: '300ms' })} />
      {APT.map((p, i) => (
        <circle
          key={i}
          cx={CV_X(p.s)}
          cy={CV_Y(p.l)}
          r={9}
          fill={tone[CYCLE[i % CYCLE.length]].bd}
          stroke={ink.card}
          strokeWidth={3}
          className="ml-in-dot"
          style={vars({ d: `${400 + i * 55}ms` })}
        />
      ))}
      <path
        d={`M ${CV_X(10)} ${CV_Y(W_BEST * 10 + B_BEST)} L ${CV_PX} ${CV_PY}`}
        pathLength={1}
        className="ml-in-draw"
        fill="none"
        stroke={ink.accent}
        strokeWidth={3.5}
        strokeLinecap="round"
        opacity={0.85}
        style={vars({ d: '1700ms' })}
      />
      <line
        x1={CV_PX}
        y1={180}
        x2={CV_PX}
        y2={CV_PY + 16}
        stroke={ink.accent}
        strokeWidth={2}
        strokeDasharray="5 7"
        className="ml-in-fade"
        style={vars({ d: '2500ms' })}
      />
      <circle cx={CV_PX} cy={CV_PY} r={12} fill="none" stroke={ink.accent} strokeWidth={3} className="ml-pulse" style={vars({ d: '3300ms' })} />
      <circle
        cx={CV_PX}
        cy={CV_PY}
        r={12}
        fill={ink.card}
        stroke={ink.accent}
        strokeWidth={4}
        className="ml-in-dot"
        style={vars({ d: '2700ms' })}
      />
      <text
        x={CV_PX + 26}
        y={CV_PY + 9}
        className="ml-in-fade"
        style={{ ...vars({ d: '2900ms' }), fontFamily: mono, fontSize: 24 }}
        fill={ink.accent}
      >
        {CV_S} m² → ≈ {num(Math.round(CV_PRED / 10) * 10)} €
      </text>
    </svg>
    <Fig n={0} style={{ left: 140, top: 905 }}>
      Un modèle apprend une tendance sur des exemples, puis prédit un cas jamais vu.
    </Fig>

    <div
      className="ml-in-fade"
      style={{
        ...vars({ d: '400ms' }),
        position: 'absolute',
        left: 1300,
        top: 770,
        width: 480,
        paddingTop: 24,
        borderTop: `1.5px solid ${ink.rule}`,
        display: 'flex',
        alignItems: 'center',
        gap: 30,
      }}
    >
      <Portrait />
      <div>
        <div
          style={{
            fontFamily: mono,
            fontSize: 22,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: ink.muted,
          }}
        >
          Créé par
        </div>
        <div style={{ fontFamily: serif, fontSize: 36, fontWeight: 500, lineHeight: 1.15, marginTop: 6 }}>
          Houssem Eddine
          <br />
          Lassoued
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 10, fontSize: 26 }}>
          <span style={{ fontFamily: mono, fontWeight: 500, color: ink.text }}>2026</span>
          <span style={{ color: ink.faint }}>·</span>
          <a
            href={AUTHOR_LINKEDIN}
            target="_blank"
            rel="noreferrer"
            style={{
              color: 'var(--osd-accent)',
              textDecoration: 'underline',
              textDecorationThickness: 2,
              textUnderlineOffset: 5,
            }}
          >
            LinkedIn ↗
          </a>
        </div>
      </div>
    </div>
  </Frame>
);

// ═══ 2 · Programmer vs apprendre ═════════════════════════════════════════════
const FlowBox = ({
  x,
  y,
  w,
  t = 'paper',
  children,
}: {
  x: number;
  y: number;
  w: number;
  t?: Tone;
  children: ReactNode;
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: 62,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 28,
      fontWeight: 500,
      background: tone[t].bg,
      boxShadow: `inset 0 0 0 2px ${tone[t].bd}`,
      borderRadius: 12,
      color: t === 'accent' ? ink.accent : ink.text,
    }}
  >
    {children}
  </div>
);

const FlowProc = ({ y, accent, children }: { y: number; accent?: boolean; children: ReactNode }) => (
  <div
    style={{
      position: 'absolute',
      left: 460,
      top: y,
      width: 300,
      height: 84,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: serif,
      fontSize: 36,
      fontStyle: 'italic',
      borderRadius: 14,
      background: accent ? ink.accent : ink.text,
      color: ink.card,
      boxShadow: '0 14px 30px -18px rgba(60, 40, 10, 0.6)',
    }}
  >
    {children}
  </div>
);

const RowLabel = ({ y, accent, className, children }: { y: number; accent?: boolean; className?: string; children: ReactNode }) => (
  <div
    className={className}
    style={{
      position: 'absolute',
      left: 140,
      top: y,
      fontFamily: mono,
      fontSize: 22,
      fontWeight: 500,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: accent ? ink.accent : ink.muted,
    }}
  >
    {children}
  </div>
);

const CodeBox = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      marginTop: 8,
      padding: '12px 18px',
      borderRadius: 10,
      background: ink.panel,
      fontFamily: mono,
      fontSize: 22,
      lineHeight: 1.5,
      color: ink.soft,
      whiteSpace: 'pre',
    }}
  >
    {children}
  </div>
);

const Verdict = ({ c, children }: { c: Tone; children: ReactNode }) => (
  <div style={{ marginTop: 8, fontSize: 24, lineHeight: 1.4, fontWeight: 500, color: tone[c].fg }}>{children}</div>
);

const Idea: Page = () => (
  <Frame id="idea" eyebrow="Introduction" stage={0} beats={3}>
    <Title>Ne plus écrire les règles : les apprendre</Title>
    <Lede>
      En programmation classique, on code la logique. En machine learning, on montre des{' '}
      <Hl>exemples</Hl> et l'algorithme en déduit la logique.
    </Lede>

    <RowLabel y={384}>Programmation classique</RowLabel>
    <FlowBox x={140} y={420} w={220} t="peach">
      Règles
    </FlowBox>
    <FlowBox x={140} y={494} w={220} t="sky">
      Données
    </FlowBox>
    <FlowProc y={446}>Programme</FlowProc>
    <FlowBox x={860} y={457} w={240} t="mint">
      Réponses
    </FlowBox>

    <div className="ml-on1">
      <RowLabel y={594} accent>
        Machine learning
      </RowLabel>
      <FlowBox x={140} y={630} w={220} t="sky">
        Données
      </FlowBox>
      <FlowBox x={140} y={704} w={220} t="mint">
        Réponses
      </FlowBox>
      <FlowProc y={656} accent>
        Apprentissage
      </FlowProc>
      <FlowBox x={860} y={667} w={240} t="accent">
        Règles
      </FlowBox>
      <Label x={860} y={740} c={ink.accent} style={{ width: 240, textAlign: 'center' }}>
        = le modèle
      </Label>
    </div>

    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <Arrow x1={372} y1={488} x2={450} y2={488} head={12} />
      <Arrow x1={772} y1={488} x2={850} y2={488} head={12} />
      <Arrow x1={372} y1={698} x2={450} y2={698} head={12} n={1} color={ink.accent} />
      <Arrow x1={772} y1={698} x2={850} y2={698} head={12} n={1} d={200} color={ink.accent} />
    </svg>

    <Card x={1220} top={384} w={560} h={500} pad={28} cls="ml-on2">
      <div
        style={{
          fontFamily: mono,
          fontSize: 22,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: ink.muted,
        }}
      >
        Exemple · filtre anti-spam
      </div>
      <div style={{ marginTop: 12 }}>
        <CardTitle size={30}>Écrire les règles à la main</CardTitle>
      </div>
      <CodeBox>
        {'si "GRATUIT" dans l\'objet\n  et liens > 5\nalors spam'}
      </CodeBox>
      <Verdict c="rose">✗ fragile : « GR4TUIT » passe</Verdict>
      <Rule />
      <CardTitle size={30}>Les apprendre</CardTitle>
      <div style={{ marginTop: 6, fontSize: 24, lineHeight: 1.45, color: ink.soft }}>
        200 000 e-mails étiquetés : le modèle pondère seul des milliers d'indices.
      </div>
      <Verdict c="mint">✓ on le réentraîne quand le spam change</Verdict>
    </Card>

    <div
      className="ml-on3"
      style={{ position: 'absolute', left: 140, top: 806, width: 1000, fontSize: 28, lineHeight: 1.45 }}
    >
      Idéal quand les règles sont <Hl>trop nombreuses, floues ou changeantes</Hl> : reconnaître un
      visage, traduire, détecter une fraude.
    </div>
  </Frame>
);

// ═══ 3 · Trois façons d'apprendre ════════════════════════════════════════════
const KindCard = ({
  x,
  cls,
  title,
  sub,
  glyph,
  children,
}: {
  x: number;
  cls?: string;
  title: string;
  sub: string;
  glyph: ReactNode;
  children: ReactNode;
}) => (
  <Card x={x} w={500} h={510} cls={cls}>
    <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{glyph}</div>
    <div style={{ marginTop: 22 }}>
      <CardTitle>{title}</CardTitle>
    </div>
    <CardText size={26} c={ink.muted}>
      {sub}
    </CardText>
    <Rule />
    <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: '0.12em', textTransform: 'uppercase', color: ink.muted }}>
      Exemples
    </div>
    <div style={{ marginTop: 6, fontSize: 26, lineHeight: 1.4, color: ink.soft }}>{children}</div>
  </Card>
);

const GDot = ({ x, y, spam }: { x: number; y: number; spam?: boolean }) =>
  spam ? (
    <circle cx={x} cy={y} r={10} fill={tone.rose.bd} stroke={ink.card} strokeWidth={3} />
  ) : (
    <circle cx={x} cy={y} r={9} fill={ink.card} stroke={tone.mint.fg} strokeWidth={3.5} />
  );

const GlyphSupervised = () => (
  <svg width={440} height={150} style={{ overflow: 'visible' }}>
    <line x1={170} y1={150} x2={300} y2={0} stroke={ink.accent} strokeWidth={3} strokeDasharray="8 8" />
    <GDot x={50} y={110} />
    <GDot x={95} y={132} />
    <GDot x={120} y={80} />
    <GDot x={70} y={55} />
    <GDot x={160} y={122} />
    <GDot x={140} y={36} />
    <GDot x={290} y={30} spam />
    <GDot x={340} y={62} spam />
    <GDot x={392} y={30} spam />
    <GDot x={330} y={118} spam />
    <GDot x={396} y={100} spam />
    <GDot x={262} y={92} spam />
  </svg>
);

const Blob = ({ cx, cy, c }: { cx: number; cy: number; c: Tone }) => (
  <g>
    <ellipse cx={cx} cy={cy} rx={62} ry={44} fill={tone[c].bg} fillOpacity={0.6} stroke={tone[c].bd} strokeWidth={2} strokeDasharray="6 7" />
    <circle cx={cx - 22} cy={cy - 10} r={8} fill={ink.muted} />
    <circle cx={cx + 14} cy={cy - 18} r={8} fill={ink.muted} />
    <circle cx={cx + 26} cy={cy + 12} r={8} fill={ink.muted} />
    <circle cx={cx - 8} cy={cy + 18} r={8} fill={ink.muted} />
    <circle cx={cx + 2} cy={cy - 2} r={8} fill={ink.muted} />
  </g>
);

const GlyphUnsupervised = () => (
  <svg width={440} height={150} style={{ overflow: 'visible' }}>
    <Blob cx={80} cy={90} c="lav" />
    <Blob cx={220} cy={50} c="sky" />
    <Blob cx={360} cy={100} c="butter" />
  </svg>
);

const GlyphReinforcement = () => (
  <svg width={440} height={150} style={{ overflow: 'visible' }}>
    <rect x={0} y={45} width={130} height={60} rx={12} fill={tone.lav.bg} stroke={tone.lav.bd} strokeWidth={2} />
    <text x={65} y={83} textAnchor="middle" style={{ fontFamily: mono, fontSize: 22 }} fill={tone.lav.fg}>
      agent
    </text>
    <rect x={270} y={45} width={170} height={60} rx={12} fill={tone.sage.bg} stroke={tone.sage.bd} strokeWidth={2} />
    <text x={355} y={83} textAnchor="middle" style={{ fontFamily: mono, fontSize: 22 }} fill={tone.sage.fg}>
      monde
    </text>
    <Arrow x1={136} y1={55} x2={264} y2={55} curve={-26} head={12} color={ink.soft} />
    <text x={200} y={20} textAnchor="middle" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
      action
    </text>
    <Arrow x1={264} y1={96} x2={136} y2={96} curve={-26} head={12} color={ink.accent} />
    <text x={200} y={146} textAnchor="middle" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.accent}>
      récompense +1
    </text>
  </svg>
);

const Kinds: Page = () => (
  <Frame id="kinds" eyebrow="Introduction" stage={0} beats={2}>
    <Title>Trois façons d'apprendre</Title>
    <Lede>
      Tout dépend de ce qu'on fournit à l'algorithme : des <Hl>réponses</Hl>, rien du tout, ou des
      récompenses.
    </Lede>
    <KindCard
      x={140}
      title="Supervisé"
      sub="Des exemples avec la bonne réponse : des paires (x, y)."
      glyph={<GlyphSupervised />}
    >
      Prix d'un logement, spam, diagnostic médical.
    </KindCard>
    <KindCard
      x={710}
      cls="ml-on1"
      title="Non supervisé"
      sub="Seulement des données x, sans réponse : trouver une structure."
      glyph={<GlyphUnsupervised />}
    >
      Segmenter des clients, repérer des anomalies.
    </KindCard>
    <KindCard
      x={1280}
      cls="ml-on2"
      title="Par renforcement"
      sub="Un agent agit, reçoit des récompenses, et affine sa stratégie."
      glyph={<GlyphReinforcement />}
    >
      Jeux (AlphaGo), robotique, réglage des assistants.
    </KindCard>
  </Frame>
);

// ═══ 4 · La recette ══════════════════════════════════════════════════════════
CSS.push(`
.ml-recipe .ml-recipe-flow{opacity:0;transition:opacity 600ms ${EASE}}
${at('recipe', 6)} .ml-recipe-flow{opacity:.9;transition-delay:900ms}
`);

const PIPE_X = (i: number) => 140 + i * 281;
const PIPE_C = (i: number) => PIPE_X(i) + 118;
const PIPE_LOOP = `M ${PIPE_C(3)} 748 V 790 Q ${PIPE_C(3)} 812 ${PIPE_C(3) - 22} 812 H ${PIPE_C(1) + 22} Q ${PIPE_C(1)} 812 ${PIPE_C(1)} 790 V 766`;

const StageCard = ({
  i,
  title,
  sub,
  className,
  children,
}: {
  i: number;
  title: string;
  sub: string;
  className?: string;
  children: ReactNode;
}) => (
  <div
    className={className}
    style={{
      ...vars({ d: '150ms' }),
      position: 'absolute',
      left: PIPE_X(i),
      top: 400,
      width: 236,
      height: 340,
      boxSizing: 'border-box',
      padding: '22px 22px 20px',
      background: ink.card,
      borderRadius: 16,
      boxShadow: `0 0 0 1.5px ${ink.rule}, 0 12px 30px -20px rgba(60, 40, 10, 0.35)`,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <div style={{ fontFamily: mono, fontSize: 22, fontWeight: 500, color: 'var(--osd-accent)' }}>
      {String(i + 1).padStart(2, '0')}
    </div>
    <div style={{ fontFamily: serif, fontSize: 32, fontWeight: 500, lineHeight: 1.15, marginTop: 4 }}>
      {title}
    </div>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </div>
    <div style={{ fontSize: 22, lineHeight: 1.35, color: ink.muted }}>{sub}</div>
  </div>
);

const MiniRow = ({ s, l, head }: { s: string; l: string; head?: boolean }) => (
  <div style={{ display: 'flex', width: 180, color: head ? ink.muted : ink.text }}>
    <span style={{ width: 48 }}>{s}</span>
    <span style={{ width: 40, textAlign: 'center', color: head ? ink.muted : ink.faint }}>→</span>
    <span style={{ flex: 1, textAlign: 'right', color: head ? ink.muted : ink.accent }}>{l}</span>
  </div>
);

const MiniTable = () => (
  <div style={{ fontFamily: mono, fontSize: 22, lineHeight: 1.55 }}>
    <MiniRow s="m²" l="€" head />
    <MiniRow s="32" l="650" />
    <MiniRow s="46" l="810" />
    <MiniRow s="75" l="1 190" />
  </div>
);

// Tiny scatter (5 dots) used by the "model" and "error" stage cards.
const MINI_PTS: [number, number][] = [
  [20, 92],
  [58, 70],
  [96, 66],
  [134, 36],
  [170, 24],
];
const miniLine = (x: number) => 96 - x * 0.42;

const MiniScatter = ({ resid }: { resid?: boolean }) => (
  <svg width={190} height={110} style={{ overflow: 'visible' }}>
    <line x1={4} y1={miniLine(4)} x2={186} y2={miniLine(186)} stroke={ink.soft} strokeWidth={3} strokeLinecap="round" />
    {resid
      ? MINI_PTS.map(([x, y]) => (
          <line key={x} x1={x} y1={y} x2={x} y2={miniLine(x)} stroke={ink.accent} strokeWidth={3} />
        ))
      : null}
    {MINI_PTS.map(([x, y], i) => (
      <circle key={x} cx={x} cy={y} r={7} fill={tone[CYCLE[i]].bd} stroke={ink.card} strokeWidth={2} />
    ))}
  </svg>
);

// A valley: edges high on screen (small y), bottom at x = 95.
const bowl = (x: number) => 100 - 90 * ((x - 95) / 90) ** 2;

const MiniBowl = () => (
  <svg width={190} height={110} style={{ overflow: 'visible' }}>
    <path
      d={poly(Array.from({ length: 41 }, (_, k) => [5 + k * 4.5, bowl(5 + k * 4.5)] as [number, number]))}
      fill="none"
      stroke={ink.soft}
      strokeWidth={3}
    />
    <circle cx={14} cy={bowl(14)} r={5} fill={ink.faint} />
    <circle cx={50} cy={bowl(50)} r={5} fill={ink.faint} />
    <circle cx={77} cy={bowl(77)} r={5} fill={ink.faint} />
    <circle cx={95} cy={bowl(95) - 10} r={10} fill={ink.accent} />
  </svg>
);

const SplitRow = ({ c, children }: { c: Tone; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: mono, fontSize: 22 }}>
    <span style={{ width: 18, height: 18, borderRadius: 4, background: tone[c].bd }} />
    {children}
  </div>
);

const MiniSplit = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <SplitRow c="mint">train 70 %</SplitRow>
    <SplitRow c="butter">val 15 %</SplitRow>
    <SplitRow c="lav">test 15 %</SplitRow>
  </div>
);

const NET_L = [
  [30, 75],
  [12, 48, 84, 120],
  [40, 92],
];
const MiniNet = () => (
  <svg width={190} height={130} style={{ overflow: 'visible' }}>
    {NET_L.slice(0, -1).flatMap((col, li) =>
      col.flatMap((y1) =>
        NET_L[li + 1].map((y2) => (
          <line key={`${li}-${y1}-${y2}`} x1={20 + li * 75} y1={y1} x2={95 + li * 75} y2={y2} stroke={ink.faint} strokeWidth={1.5} />
        )),
      ),
    )}
    {NET_L.flatMap((col, li) =>
      col.map((y) => (
        <circle key={`${li}-${y}`} cx={20 + li * 75} cy={y} r={9} fill={li === 2 ? ink.accent : tone.lav.bd} stroke={ink.card} strokeWidth={2} />
      )),
    )}
  </svg>
);

const Recipe: Page = () => (
  <Frame id="recipe" eyebrow="Introduction" stage={0} beats={6}>
    <Title>La recette, en six étapes</Title>
    <Lede>
      Nous allons les déplier une à une, sur un fil rouge : <Hl>prédire le loyer</Hl> d'un appartement
      à partir de sa surface.
    </Lede>

    <StageCard i={0} title="Données" sub={'des exemples (x, y)'}>
      <MiniTable />
    </StageCard>
    <StageCard i={1} title="Modèle" sub="une fonction à réglages" className="ml-on1">
      <MiniScatter />
    </StageCard>
    <StageCard i={2} title="Erreur" sub="l'écart entre ŷ et y" className="ml-on2">
      <MiniScatter resid />
    </StageCard>
    <StageCard i={3} title="Optimisation" sub="corriger, pas à pas" className="ml-on3">
      <MiniBowl />
    </StageCard>
    <StageCard i={4} title="Généraliser" sub="réussir sur du neuf" className="ml-on4">
      <MiniSplit />
    </StageCard>
    <StageCard i={5} title="Au-delà" sub="arbres, réseaux, groupes" className="ml-on5">
      <MiniNet />
    </StageCard>

    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <Arrow x1={PIPE_X(0) + 242} y1={570} x2={PIPE_X(1) - 6} y2={570} n={1} head={12} />
      <Arrow x1={PIPE_X(1) + 242} y1={570} x2={PIPE_X(2) - 6} y2={570} n={2} head={12} />
      <Arrow x1={PIPE_X(2) + 242} y1={570} x2={PIPE_X(3) - 6} y2={570} n={3} head={12} />
      <Arrow x1={PIPE_X(3) + 242} y1={570} x2={PIPE_X(4) - 6} y2={570} n={4} head={12} />
      <Arrow x1={PIPE_X(4) + 242} y1={570} x2={PIPE_X(5) - 6} y2={570} n={5} head={12} />
      <path
        d={PIPE_LOOP}
        pathLength={1}
        className="ml-draw6"
        fill="none"
        stroke={ink.accent}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <polygon
        points={`${PIPE_C(1)},748 ${PIPE_C(1) - 9},766 ${PIPE_C(1) + 9},766`}
        fill={ink.accent}
        className="ml-fade6"
        style={vars({ d: '700ms' })}
      />
      <path
        d={PIPE_LOOP}
        className="ml-recipe-flow ml-march"
        fill="none"
        stroke={ink.accent}
        strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray="0 20"
      />
    </svg>
    <div
      className="ml-on6"
      style={{
        ...vars({ d: '450ms' }),
        position: 'absolute',
        left: 140,
        width: 1640,
        top: 834,
        textAlign: 'center',
        fontFamily: serif,
        fontStyle: 'italic',
        fontSize: 30,
        color: ink.soft,
      }}
    >
      … les étapes 02 → 04 tournent en boucle, des milliers de fois : c'est l'entraînement.
    </div>
  </Frame>
);

// State layers: `.ml-st{k}` is visible from beat k until beat k + 1 (state 0 = no beat).
const stateCSS = (page: string, count: number) => {
  let css = `.ml-${page} .ml-st{transition:opacity 450ms ${EASE}}\n`;
  for (let k = 1; k < count; k++) css += `.ml-${page} .ml-st${k}{opacity:0}\n`;
  for (let k = 1; k < count; k++) {
    css += `${at(page, k)} .ml-st${k - 1}{opacity:0}\n${at(page, k)} .ml-st${k}{opacity:1}\n`;
  }
  return css;
};
const stateLayer: CSSProperties = { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 };

// ═══ 5 · Le jeu de données ═══════════════════════════════════════════════════
CSS.push(`
.ml-data .ml-cx,.ml-data .ml-cy{transition:background-color 500ms ${EASE},color 500ms ${EASE}}
${at('data', 1)} .ml-cx{background-color:${tone.lav.bg}}
${at('data', 2)} .ml-cy{background-color:${tone.accent.bg};color:${ink.accent}}
`);

const TB_W = [170, 130, 120, 190, 140, 200];
const TB_X = (c: number) => 140 + TB_W.slice(0, c).reduce((a, b) => a + b, 0);
const TB_ROW = 58;

const TCell = ({ c, head, children }: { c: number; head?: boolean; children: ReactNode }) => (
  <div
    className={c === 5 ? 'ml-cy' : 'ml-cx'}
    style={{
      width: TB_W[c],
      height: TB_ROW,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottom: `${head ? 2 : 1}px solid ${head ? ink.soft : ink.rule}`,
      fontFamily: head ? sans : mono,
      fontSize: head ? 22 : 26,
      fontWeight: head ? 600 : 400,
      color: head ? ink.muted : ink.text,
    }}
  >
    {children}
  </div>
);

const TRow = ({ r, v }: { r: number; v: string[] }) => (
  <div style={{ position: 'absolute', left: 140, top: 488 + r * TB_ROW, display: 'flex' }}>
    <TCell c={0}>{v[0]}</TCell>
    <TCell c={1}>{v[1]}</TCell>
    <TCell c={2}>{v[2]}</TCell>
    <TCell c={3}>{v[3]}</TCell>
    <TCell c={4}>{v[4]}</TCell>
    <TCell c={5}>{v[5]}</TCell>
  </div>
);

const Bracket = ({ x1, x2, c, n }: { x1: number; x2: number; c: string; n: number }) => (
  <path
    d={`M ${x1} 424 V 414 H ${x2} V 424`}
    pathLength={1}
    fill="none"
    stroke={c}
    strokeWidth={3}
    strokeLinejoin="round"
    className={`ml-draw${n}`}
  />
);

const DataTable: Page = () => (
  <Frame id="data" eyebrow="01 · Données" stage={1} beats={3}>
    <Title>Des exemples, rangés dans un tableau</Title>
    <Lede>
      Chaque ligne est un exemple, chaque colonne une <Hl>caractéristique</Hl> (feature). La
      dernière colonne est la réponse à prédire : l'étiquette.
    </Lede>

    <Label x={140} y={378} c={tone.lav.fg} className="ml-fade1">
      x · les caractéristiques
    </Label>
    <Label x={TB_X(5)} y={378} c={ink.accent} className="ml-fade2">
      y · l'étiquette
    </Label>
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <Bracket x1={146} x2={TB_X(5) - 8} c={tone.lav.bd} n={1} />
      <Bracket x1={TB_X(5) + 6} x2={TB_X(6) - 6} c={ink.accent} n={2} />
    </svg>

    <div style={{ position: 'absolute', left: 140, top: 430, display: 'flex' }}>
      <TCell c={0} head>
        surface (m²)
      </TCell>
      <TCell c={1} head>
        pièces
      </TCell>
      <TCell c={2} head>
        étage
      </TCell>
      <TCell c={3} head>
        quartier
      </TCell>
      <TCell c={4} head>
        balcon
      </TCell>
      <TCell c={5} head>
        loyer (€)
      </TCell>
    </div>
    <TRow r={0} v={['32', '1', '3', 'Centre', 'non', '650']} />
    <TRow r={1} v={['46', '2', '1', 'Nord', 'oui', '810']} />
    <TRow r={2} v={['75', '3', '5', 'Centre', 'oui', '1 190']} />
    <TRow r={3} v={['58', '3', '0', 'Sud', 'non', '930']} />
    <TRow r={4} v={['24', '1', '6', 'Est', 'non', '540']} />
    <TRow r={5} v={['90', '4', '2', 'Nord', 'oui', '1 320']} />
    <div
      style={{
        position: 'absolute',
        left: 140,
        width: TB_X(6) - 140,
        top: 488 + 6 * TB_ROW,
        textAlign: 'center',
        fontSize: 28,
        color: ink.faint,
      }}
    >
      ⋮
    </div>
    <Fig n={1} style={{ left: 140, top: 892, width: 950 }}>
      Données fictives. On note X le tableau (n × d) et y la colonne à prédire.
    </Fig>

    <Note n="n" title="Les lignes : des exemples" className="ml-on3" style={{ left: 1180, top: 410, width: 600 }}>
      Des centaines à des milliards. Chacun est une paire (x, y).
    </Note>
    <Note
      n="d"
      title="Les colonnes : des indices"
      className="ml-on3"
      style={{ ...vars({ d: '150ms' }), left: 1180, top: 560, width: 600 }}
    >
      De quelques-unes à des millions (pixels, mots, clics…).
    </Note>
    <Note
      n="!"
      title="La qualité avant tout"
      className="ml-on3"
      style={{ ...vars({ d: '300ms' }), left: 1180, top: 710, width: 600 }}
    >
      Erreurs, doublons, biais : le modèle apprendra tout, y compris le pire.
    </Note>
  </Frame>
);

// ═══ 6 · Tout devient nombre ═════════════════════════════════════════════════
const EncCard = ({
  x,
  cls,
  title,
  glyph,
  children,
}: {
  x: number;
  cls?: string;
  title: string;
  glyph: ReactNode;
  children: ReactNode;
}) => (
  <Card x={x} h={440} cls={cls}>
    <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{glyph}</div>
    <div style={{ marginTop: 24 }}>
      <CardTitle>{title}</CardTitle>
    </div>
    <CardText>{children}</CardText>
  </Card>
);

const OneHot = ({ label, on }: { label: string; on?: boolean }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
    <div
      style={{
        width: 90,
        height: 56,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: mono,
        fontSize: 30,
        fontWeight: on ? 600 : 400,
        background: on ? tone.accent.bg : ink.panel,
        boxShadow: `inset 0 0 0 2px ${on ? ink.accent : ink.rule}`,
        color: on ? ink.accent : ink.muted,
      }}
    >
      {on ? 1 : 0}
    </div>
    <div style={{ fontFamily: mono, fontSize: 22, color: on ? ink.accent : ink.muted }}>{label}</div>
  </div>
);

const GlyphOneHot = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
    <Chip t="lav" size={24}>
      quartier = Centre
    </Chip>
    <div style={{ display: 'flex', gap: 10 }}>
      <OneHot label="Nord" />
      <OneHot label="Centre" on />
      <OneHot label="Sud" />
      <OneHot label="Est" />
    </div>
  </div>
);

// A hand-drawn "7" on a 10 × 10 grid: '#' ink, '+' half-tone, '.' paper.
const DIGIT = [
  '..........',
  '.########.',
  '.#######+.',
  '......##..',
  '.....+#+..',
  '.....##...',
  '....+#+...',
  '....##....',
  '...+#+....',
  '...##.....',
];
const PIX: Record<string, string> = { '#': ink.soft, '+': ink.faint, '.': ink.panel };

const GlyphPixels = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 13px)', gap: 2 }}>
      {DIGIT.flatMap((row, r) => row.split('').map((ch, c) => <span key={`${r}-${c}`} style={{ width: 13, height: 13, borderRadius: 2, background: PIX[ch] }} />))}
    </div>
    <div>
      <div style={{ fontFamily: serif, fontSize: 44, fontWeight: 500, lineHeight: 1.1 }}>28 × 28</div>
      <div style={{ fontFamily: mono, fontSize: 22, color: ink.accent, marginTop: 6 }}>= 784 nombres</div>
    </div>
  </div>
);

const ScaleBar = ({ x, y, w, c }: { x: number; y: number; w: number; c: Tone }) => (
  <rect x={x} y={y} width={w} height={14} rx={7} fill={tone[c].bd} />
);

const GlyphScaling = () => (
  <svg width={440} height={150} style={{ overflow: 'visible' }}>
    <text x={0} y={34} style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
      avant
    </text>
    <line x1={100} y1={58} x2={440} y2={58} stroke={ink.rule} strokeWidth={2} />
    <ScaleBar x={134} y={12} w={306} c="peach" />
    <ScaleBar x={100} y={34} w={23} c="sky" />
    <text x={0} y={118} style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
      après
    </text>
    <line x1={100} y1={142} x2={440} y2={142} stroke={ink.rule} strokeWidth={2} />
    <line x1={270} y1={88} x2={270} y2={148} stroke={ink.faint} strokeWidth={2} strokeDasharray="4 5" />
    <ScaleBar x={190} y={96} w={160} c="peach" />
    <ScaleBar x={196} y={118} w={150} c="sky" />
  </svg>
);

const Encode: Page = () => (
  <Frame id="enc" eyebrow="01 · Données" stage={1} beats={2}>
    <Title>Tout doit devenir des nombres</Title>
    <Lede>
      Un algorithme ne manipule que des nombres. Catégories, images et textes sont donc{' '}
      <Hl>encodés</Hl>, puis mis à la même échelle.
    </Lede>
    <EncCard x={140} title="Catégories → one-hot" glyph={<GlyphOneHot />}>
      Une colonne 0/1 par valeur possible : aucun ordre artificiel entre Nord et Sud.
    </EncCard>
    <EncCard x={700} cls="ml-on1" title="Images → pixels" glyph={<GlyphPixels />}>
      Chaque pixel devient une intensité entre 0 et 1 ; en couleur, trois nombres par pixel.
    </EncCard>
    <EncCard x={1260} cls="ml-on2" title="Mise à l'échelle" glyph={<GlyphScaling />}>
      On centre et réduit chaque colonne : x′ = (x − μ) / σ. Aucune n'écrase les autres.
    </EncCard>
    <Fig n={2} style={{ left: 140, top: 866, width: 1640 }}>
      Le texte suit le même chemin : des tokens, puis des vecteurs (voir « Comment fonctionne un LLM »).
    </Fig>
  </Frame>
);

// ═══ 7 · Le modèle : une droite à régler ═════════════════════════════════════
const W_FLAT = 4;
const W_STEEP = 22;

CSS.push(`
.ml-model .ml-fitline{transform-origin:${M_CX.toFixed(1)}px ${M_CY.toFixed(1)}px;transform:rotate(${angleFor(W_FLAT).toFixed(2)}deg);stroke:${ink.soft};transition:transform 1000ms ${EASE},stroke 600ms ${EASE}}
${at('model', 1)} .ml-fitline{transform:rotate(${angleFor(W_STEEP).toFixed(2)}deg)}
${at('model', 2)} .ml-fitline{transform:rotate(${angleFor(W_BEST).toFixed(2)}deg);stroke:${ink.accent}}
${stateCSS('model', 3)}
`);

const ParamRow = ({ y, sym, desc, v }: { y: number; sym: string; desc: string; v: string[] }) => (
  <div style={{ position: 'absolute', left: 1200, top: y, width: 580, height: 52, display: 'flex', alignItems: 'center' }}>
    <span style={{ width: 56, fontFamily: serif, fontStyle: 'italic', fontSize: 46, color: ink.accent }}>{sym}</span>
    <span style={{ width: 300, fontSize: 24, lineHeight: 1.3, color: ink.muted }}>{desc}</span>
    <span style={{ position: 'relative', flex: 1, height: 52, fontFamily: mono, fontSize: 30, lineHeight: '52px', textAlign: 'right' }}>
      <span className="ml-st ml-st0" style={stateLayer}>
        {v[0]}
      </span>
      <span className="ml-st ml-st1" style={stateLayer}>
        {v[1]}
      </span>
      <span className="ml-st ml-st2" style={{ ...stateLayer, color: ink.accent }}>
        {v[2]}
      </span>
    </span>
  </div>
);

const AptDot = ({ p, d, c = tone.sky.bd }: { p: Apt; d: number; c?: string }) => (
  <circle
    cx={MX(p.s)}
    cy={MY(p.l)}
    r={10}
    fill={c}
    stroke={ink.card}
    strokeWidth={3}
    className="ml-in-dot"
    style={vars({ d: `${d}ms` })}
  />
);

const Model: Page = () => (
  <Frame id="model" eyebrow="02 · Modèle" stage={2} beats={3}>
    <Title>Un modèle : une fonction avec des réglages</Title>
    <Lede>
      On choisit une forme de fonction, puis on cherche ses <Hl>paramètres</Hl>. La plus simple :
      une droite, ŷ = w · x + b.
    </Lede>

    <svg width={1000} height={490} style={{ position: 'absolute', left: 140, top: 396, overflow: 'visible' }}>
      <defs>
        <clipPath id="ml-clip-model">
          <rect x={90} y={14} width={880} height={416} />
        </clipPath>
      </defs>
      <AptAxes />
      <g clipPath="url(#ml-clip-model)">
        <line className="ml-fitline" x1={M_CX - 1100} y1={M_CY} x2={M_CX + 1100} y2={M_CY} strokeWidth={4} strokeLinecap="round" />
      </g>
      {APT.map((p, i) => (
        <AptDot key={i} p={p} d={200 + i * 40} />
      ))}
    </svg>

    <Label x={1200} y={400}>
      le modèle : une droite
    </Label>
    <div style={{ position: 'absolute', left: 1200, top: 432, fontFamily: serif, fontSize: 64, fontWeight: 500, lineHeight: 1.2 }}>
      ŷ = <span style={{ color: ink.accent, fontStyle: 'italic' }}>w</span> · x +{' '}
      <span style={{ color: ink.accent, fontStyle: 'italic' }}>b</span>
    </div>
    <ParamRow
      y={548}
      sym="w"
      desc="pente (€ par m²)"
      v={[`${fr(W_FLAT, 1)} €/m²`, `${fr(W_STEEP, 1)} €/m²`, `${fr(W_BEST, 1)} €/m²`]}
    />
    <ParamRow
      y={616}
      sym="b"
      desc="ordonnée (loyer de base)"
      v={[`${num(bFor(W_FLAT))} €`, `${num(bFor(W_STEEP))} €`, `${num(B_BEST)} €`]}
    />
    <div style={{ position: 'absolute', left: 1200, top: 694, width: 580, height: 44, fontFamily: serif, fontStyle: 'italic', fontSize: 30 }}>
      <span className="ml-st ml-st0" style={{ ...stateLayer, color: ink.soft }}>
        trop plate : rate la tendance
      </span>
      <span className="ml-st ml-st1" style={{ ...stateLayer, color: ink.soft }}>
        trop pentue : exagère
      </span>
      <span className="ml-st ml-st2" style={{ ...stateLayer, color: ink.accent }}>
        ajustée aux données ✓
      </span>
    </div>
    <div
      className="ml-on3"
      style={{
        position: 'absolute',
        left: 1200,
        top: 764,
        width: 580,
        boxSizing: 'border-box',
        padding: '18px 24px',
        background: ink.panel,
        borderLeft: `5px solid ${ink.accent}`,
        borderRadius: '0 12px 12px 0',
        fontSize: 26,
        lineHeight: 1.45,
      }}
    >
      <Hl>Apprendre</Hl> = trouver seul les meilleurs w et b. Ici 2 paramètres ; un grand réseau en a
      des milliards.
    </div>
  </Frame>
);

// ═══ 8 · Classer : une frontière et une probabilité ══════════════════════════
const SZ = lin(-8, 8, 50, 770);
const SP = lin(0, 1, 250, 20);
const SIG_PATH = poly(Array.from({ length: 81 }, (_, k) => {
  const z = -8 + k * 0.2;
  return [SZ(z), SP(sigmoid(z))] as [number, number];
}));
const sigRand = rng(4);
const SIG_JIT = MAILS.map(() => (sigRand() - 0.5) * 14);
const clampZ = (z: number) => Math.max(-7.6, Math.min(7.6, z));

const BOUND_A = { x: EX(0), y: EY(50) };
const BOUND_B = { x: EX(-SPAM_B / SPAM_W1), y: EY(0) };

const SigDot = ({ m, i }: { m: Mail; i: number }) =>
  m.y ? (
    <circle cx={SZ(clampZ(m.z))} cy={SP(1) + SIG_JIT[i]} r={8} fill={tone.rose.bd} stroke={ink.card} strokeWidth={2.5} />
  ) : (
    <circle cx={SZ(clampZ(m.z))} cy={SP(0) + SIG_JIT[i]} r={7} fill={ink.card} stroke={tone.mint.fg} strokeWidth={3} />
  );

const Classify: Page = () => (
  <Frame id="cls" eyebrow="02 · Modèle" stage={2} beats={3}>
    <Title>Classer : une frontière, puis une probabilité</Title>
    <Lede>
      Pour une réponse oui / non, le même calcul w · x + b passe dans une <Hl>sigmoïde</Hl>, qui le
      transforme en probabilité.
    </Lede>

    <svg width={780} height={480} style={{ position: 'absolute', left: 140, top: 400, overflow: 'visible' }}>
      <g className="ml-fade1">
        <polygon
          points={`${BOUND_A.x},${BOUND_A.y} ${EX(0)},${EY(60)} ${EX(20)},${EY(60)} ${EX(20)},${EY(0)} ${BOUND_B.x},${BOUND_B.y}`}
          fill={tone.rose.bg}
          fillOpacity={0.55}
        />
        <polygon points={`${EX(0)},${EY(0)} ${BOUND_A.x},${BOUND_A.y} ${BOUND_B.x},${BOUND_B.y}`} fill={tone.mint.bg} fillOpacity={0.6} />
        <text x={EX(19.6)} y={EY(2.4)} textAnchor="end" style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 30 }} fill={tone.rose.fg}>
          zone spam
        </text>
        <text x={EX(0.6)} y={EY(3)} style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 30 }} fill={tone.mint.fg}>
          zone légitime
        </text>
      </g>
      <MailAxes />
      <path
        d={`M ${BOUND_A.x} ${BOUND_A.y} L ${BOUND_B.x} ${BOUND_B.y}`}
        pathLength={1}
        className="ml-draw1"
        fill="none"
        stroke={ink.accent}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <text
        x={BOUND_A.x + 196}
        y={BOUND_A.y + 120}
        className="ml-fade1"
        style={{ ...vars({ d: '600ms' }), fontFamily: mono, fontSize: 22 }}
        fill={ink.accent}
        transform={`rotate(${deg(Math.atan2(BOUND_B.y - BOUND_A.y, BOUND_B.x - BOUND_A.x)).toFixed(1)} ${BOUND_A.x + 196} ${BOUND_A.y + 120})`}
      >
        z = 0
      </text>
      {MAILS.map((m, i) => (
        <MailDot key={i} m={m} d={200 + i * 30} />
      ))}
      <MailLegend x={548} y={-14} />
      <g className="ml-fade3">
        <circle cx={EX(NEW_MAIL.x1)} cy={EY(NEW_MAIL.x2)} r={15} fill={ink.card} stroke={ink.accent} strokeWidth={4} />
        <text x={EX(NEW_MAIL.x1)} y={EY(NEW_MAIL.x2) + 8} textAnchor="middle" style={{ fontFamily: mono, fontSize: 22, fontWeight: 600 }} fill={ink.accent}>
          ?
        </text>
      </g>
      <text
        x={EX(NEW_MAIL.x1) + 26}
        y={EY(NEW_MAIL.x2) + 8}
        className="ml-fade3"
        style={{ fontFamily: mono, fontSize: 22, fontWeight: 500 }}
        fill={ink.accent}
      >
        nouvel e-mail
      </text>
    </svg>

    <Label x={1000} y={400}>
      de la droite à une probabilité
    </Label>
    <div style={{ position: 'absolute', left: 1000, top: 436, fontFamily: mono, fontSize: 26, color: ink.text }}>
      z = {fr(SPAM_W1)}·liens + {fr(SPAM_W2)}·MAJ − {Math.abs(SPAM_B)}
    </div>
    <svg width={780} height={290} style={{ position: 'absolute', left: 1000, top: 494, overflow: 'visible' }}>
      <line x1={SZ(-8)} y1={SP(1)} x2={SZ(8)} y2={SP(1)} stroke={ink.rule} strokeWidth={2} strokeDasharray="4 8" />
      <AxisX x1={SZ(-8)} x2={SZ(8)} y={SP(0)} />
      <TickX x={SZ(0)} y={SP(0)} label="0" />
      <TickX x={SZ(-6)} y={SP(0)} label="−6" />
      <TickX x={SZ(6)} y={SP(0)} label="6" />
      <text x={SZ(8)} y={SP(0) + 32} textAnchor="end" style={axisTitle} fill={ink.muted}>
        z →
      </text>
      <text x={SZ(-8) - 12} y={SP(1) + 7} textAnchor="end" style={tick} fill={ink.muted}>
        1
      </text>
      <text x={SZ(-8) - 12} y={SP(0) + 7} textAnchor="end" style={tick} fill={ink.muted}>
        0
      </text>
      <g className="ml-fade2">
        <line x1={SZ(-8)} y1={SP(0.5)} x2={SZ(8)} y2={SP(0.5)} stroke={ink.faint} strokeWidth={2} strokeDasharray="6 6" />
        <line x1={SZ(0)} y1={SP(0)} x2={SZ(0)} y2={SP(1)} stroke={ink.faint} strokeWidth={2} strokeDasharray="6 6" />
        <text x={SZ(-8) - 12} y={SP(0.5) + 7} textAnchor="end" style={tick} fill={ink.muted}>
          0,5
        </text>
        {MAILS.map((m, i) => (
          <SigDot key={i} m={m} i={i} />
        ))}
      </g>
      <path d={SIG_PATH} pathLength={1} className="ml-in-draw" fill="none" stroke={ink.accent} strokeWidth={4} style={vars({ d: '500ms' })} />
      <g className="ml-fade3">
        <line x1={SZ(NEW_Z)} y1={SP(0)} x2={SZ(NEW_Z)} y2={SP(NEW_P)} stroke={ink.accent} strokeWidth={2} strokeDasharray="5 6" />
        <line x1={SZ(-8)} y1={SP(NEW_P)} x2={SZ(NEW_Z)} y2={SP(NEW_P)} stroke={ink.accent} strokeWidth={2} strokeDasharray="5 6" />
        <circle cx={SZ(NEW_Z)} cy={SP(NEW_P)} r={12} fill={ink.card} stroke={ink.accent} strokeWidth={4} />
        <text x={SZ(NEW_Z) + 22} y={SP(NEW_P) + 40} style={{ fontFamily: mono, fontSize: 24, fontWeight: 600 }} fill={ink.accent}>
          p = {fr(NEW_P)}
        </text>
      </g>
    </svg>
    <div className="ml-on2" style={{ position: 'absolute', left: 1000, top: 800, fontFamily: mono, fontSize: 24, color: ink.soft }}>
      p = σ(z) = 1 / (1 + e⁻ᶻ), toujours entre 0 et 1
    </div>
    <div className="ml-on3" style={{ position: 'absolute', left: 1000, top: 846, fontFamily: serif, fontSize: 32 }}>
      Nouvel e-mail : p = {fr(NEW_P)} &gt; 0,5 → <span style={{ color: ink.accent, fontStyle: 'italic' }}>spam</span>
    </div>
  </Frame>
);

// ═══ 9 · Mesurer l'erreur ════════════════════════════════════════════════════
const SUB = APT.filter((_, i) => i % 3 === 0);
const SUB_MSE = mse(W_FLAT, bFor(W_FLAT), SUB);
const predFlat = (s: number) => W_FLAT * s + bFor(W_FLAT);

const Residual = ({ p, i }: { p: Apt; i: number }) => {
  const x = MX(p.s);
  const y = MY(p.l);
  const yh = MY(predFlat(p.s));
  const a = Math.abs(yh - y);
  return (
    <g>
      <rect
        x={x}
        y={Math.min(y, yh)}
        width={a}
        height={a}
        fill={ink.accentSoft}
        stroke={ink.accent}
        strokeWidth={2}
        className="ml-pop2"
        style={vars({ d: `${i * 90}ms`, o: '0% 50%' })}
      />
      <line x1={x} y1={y} x2={x} y2={yh} pathLength={1} stroke={ink.accent} strokeWidth={3.5} className="ml-draw1" style={vars({ d: `${i * 80}ms` })} />
    </g>
  );
};

// Residual value, centred in the square drawn on that residual.
const ResLabel = ({ p }: { p: Apt }) => {
  const r = predFlat(p.s) - p.l;
  const side = Math.abs(MY(predFlat(p.s)) - MY(p.l));
  return (
    <text
      x={MX(p.s) + side / 2}
      y={Math.min(MY(p.l), MY(predFlat(p.s))) + side / 2 + 8}
      textAnchor="middle"
      className="ml-fade1"
      style={{ ...vars({ d: '700ms' }), fontFamily: mono, fontSize: 22, fontWeight: 600 }}
      fill={ink.accent}
    >
      {r > 0 ? '+' : ''}
      {num(r)}
    </text>
  );
};

const Loss: Page = () => (
  <Frame id="loss" eyebrow="03 · Erreur" stage={3} beats={3}>
    <Title>Mesurer l'erreur : la fonction de perte</Title>
    <Lede>
      Reprenons la droite trop plate. Pour chaque logement, on compare la prédiction ŷ au vrai loyer
      y : l'écart s'appelle le <Hl>résidu</Hl>.
    </Lede>

    <svg width={1000} height={490} style={{ position: 'absolute', left: 140, top: 396, overflow: 'visible' }}>
      <AptAxes />
      <line
        x1={MX(10)}
        y1={MY(predFlat(10))}
        x2={MX(130)}
        y2={MY(predFlat(130))}
        stroke={ink.soft}
        strokeWidth={4}
        strokeLinecap="round"
      />
      {SUB.map((p, i) => (
        <Residual key={i} p={p} i={i} />
      ))}
      {SUB.map((p, i) => (
        <AptDot key={i} p={p} d={200 + i * 60} />
      ))}
      <ResLabel p={SUB[0]} />
      <ResLabel p={SUB[SUB.length - 1]} />
    </svg>

    <Label x={1200} y={400}>
      pour chaque logement i
    </Label>
    <div className="ml-on1" style={{ position: 'absolute', left: 1200, top: 434, fontFamily: serif, fontSize: 52, fontWeight: 500 }}>
      rᵢ = ŷᵢ − yᵢ
    </div>
    <div className="ml-on1" style={{ ...vars({ d: '150ms' }), position: 'absolute', left: 1200, top: 506, width: 580, fontSize: 26, lineHeight: 1.4, color: ink.muted }}>
      le résidu : ce qu'on prédit, moins la réalité
    </div>

    <Label x={1200} y={584} className="ml-fade2">
      la perte : erreur quadratique moyenne
    </Label>
    <div className="ml-on2" style={{ position: 'absolute', left: 1200, top: 618, fontFamily: serif, fontSize: 52, fontWeight: 500 }}>
      L = <span style={{ fontSize: 40 }}>1⁄n</span> Σ rᵢ²
    </div>
    <div className="ml-on2" style={{ ...vars({ d: '250ms' }), position: 'absolute', left: 1200, top: 694, fontFamily: mono, fontSize: 26, color: ink.accent }}>
      = {num(SUB_MSE)} €² → √L ≈ {num(Math.sqrt(SUB_MSE))} €
    </div>

    <div className="ml-on3" style={{ position: 'absolute', left: 1200, top: 760, width: 580 }}>
      <div style={{ fontFamily: serif, fontSize: 32, fontWeight: 500, lineHeight: 1.2 }}>Pourquoi au carré ?</div>
      <div style={{ fontSize: 26, lineHeight: 1.4, color: ink.soft, marginTop: 6 }}>
        Toujours positif, punit fort les gros écarts, et facile à dériver.
      </div>
    </div>
    <Fig n={3} style={{ left: 140, top: 900, width: 1640 }}>
      Pour classer, on utilise plutôt l'entropie croisée : −log p(bonne classe), comme pour un LLM.
    </Fig>
  </Frame>
);

// ═══ 10 · Le paysage de l'erreur ═════════════════════════════════════════════
const LW = lin(0, 24, 80, 840);
const LL = lin(0, 140000, 360, 10);
const LOSS_CURVE = poly(Array.from({ length: 97 }, (_, k) => [LW(k / 4), LL(lossW(k / 4))] as [number, number]));

const LossPt = ({
  w,
  label,
  c,
  dx,
  dy,
  anchor,
  d,
}: {
  w: number;
  label: string;
  c: string;
  dx: number;
  dy: number;
  anchor: 'start' | 'end' | 'middle';
  d: number;
}) => (
  <g className="ml-fade1" style={vars({ d: `${d}ms` })}>
    <line x1={LW(w)} y1={LL(lossW(w))} x2={LW(w)} y2={360} stroke={c} strokeWidth={2} strokeDasharray="4 6" />
    <circle cx={LW(w)} cy={LL(lossW(w))} r={11} fill={c} stroke={ink.card} strokeWidth={3} />
    <text x={LW(w) + dx} y={LL(lossW(w)) + dy} textAnchor={anchor} style={{ fontFamily: sans, fontSize: 24, fontWeight: 500 }} fill={c}>
      {label}
    </text>
  </g>
);

const Contour = ({ k }: { k: number }) => (
  <ellipse
    cx={0}
    cy={0}
    rx={52 * k}
    ry={20 * k}
    fill={tone.butter.bg}
    fillOpacity={0.32}
    stroke={tone.butter.bd}
    strokeWidth={1.5}
  />
);

const Landscape: Page = () => (
  <Frame id="land" eyebrow="03 · Erreur" stage={3} beats={3}>
    <Title>Le paysage de l'erreur</Title>
    <Lede>
      Chaque réglage (w, b) donne une erreur. Ensemble, elles dessinent un <Hl>paysage</Hl> :
      apprendre, c'est en trouver le point le plus bas.
    </Lede>

    <Label x={140} y={378}>
      une coupe : L selon w
    </Label>
    <svg width={860} height={400} style={{ position: 'absolute', left: 140, top: 430, overflow: 'visible' }}>
      <GridY x1={80} x2={840} y={LL(50000)} />
      <GridY x1={80} x2={840} y={LL(100000)} />
      <AxisX x1={80} x2={840} y={360} />
      <AxisY x={80} y1={360} y2={0} />
      <TickX x={LW(0)} y={360} label="0" />
      <TickX x={LW(4)} y={360} label="4" />
      <TickX x={LW(8)} y={360} label="8" />
      <TickX x={LW(12)} y={360} label="12" />
      <TickX x={LW(16)} y={360} label="16" />
      <TickX x={LW(20)} y={360} label="20" />
      <TickX x={LW(24)} y={360} label="24" />
      <TickY x={80} y={LL(50000)} label="50 k" />
      <TickY x={80} y={LL(100000)} label="100 k" />
      <text x={840} y={420} textAnchor="end" style={axisTitle} fill={ink.muted}>
        w (€/m²) →
      </text>
      <path d={LOSS_CURVE} pathLength={1} className="ml-in-draw" fill="none" stroke={ink.soft} strokeWidth={4} style={vars({ d: '200ms' })} />
      <LossPt w={W_FLAT} label="trop plate" c={ink.soft} dx={20} dy={-14} anchor="start" d={0} />
      <LossPt w={W_STEEP} label="trop pentue" c={ink.soft} dx={-20} dy={-14} anchor="end" d={150} />
      <LossPt w={W_BEST} label={`la meilleure, w ≈ ${fr(W_BEST, 1)}`} c={ink.accent} dx={0} dy={-66} anchor="middle" d={300} />
    </svg>

    <Label x={1080} y={378} className="ml-fade2">
      vue de dessus : L selon (w, b)
    </Label>
    <svg width={700} height={400} className="ml-on2" style={{ position: 'absolute', left: 1080, top: 430, overflow: 'visible' }}>
      <rect x={0} y={0} width={700} height={380} rx={16} fill={ink.card} stroke={ink.rule} strokeWidth={1.5} />
      <g transform="translate(360 190) rotate(-25)">
        <Contour k={6} />
        <Contour k={5} />
        <Contour k={4} />
        <Contour k={3} />
        <Contour k={2} />
        <Contour k={1} />
      </g>
      <circle cx={360} cy={190} r={10} fill={ink.accent} stroke={ink.card} strokeWidth={3} />
      <text x={378} y={226} style={{ fontFamily: mono, fontSize: 22, fontWeight: 500 }} fill={ink.accent} stroke={ink.card} strokeWidth={6} strokeLinejoin="round" paintOrder="stroke">
        minimum
      </text>
      <text x={680} y={366} textAnchor="end" style={axisTitle} fill={ink.muted}>
        w →
      </text>
      <text x={20} y={34} style={axisTitle} fill={ink.muted}>
        b ↑
      </text>
    </svg>
    <div
      className="ml-on3"
      style={{
        position: 'absolute',
        left: 140,
        width: 1640,
        top: 870,
        textAlign: 'center',
        fontFamily: serif,
        fontStyle: 'italic',
        fontSize: 30,
        color: ink.soft,
      }}
    >
      Avec des millions de paramètres, impossible de dessiner ce paysage… mais on peut toujours mesurer sa
      pente.
    </div>
  </Frame>
);

// ═══ 11 · La descente de gradient ════════════════════════════════════════════
const GW = lin(0, 24, 70, 890);
const GL = lin(0, 140000, 400, 20);
const GD_CURVE = poly(Array.from({ length: 97 }, (_, k) => [GW(k / 4), GL(lossW(k / 4))] as [number, number]));
const GD_W0 = 1;
const GD_W = Array.from({ length: 6 }, (_, k) => W_BEST - (W_BEST - GD_W0) * 0.5 ** k);
const GD_P = GD_W.map((w) => [GW(w), GL(lossW(w))] as [number, number]);
const BALL_R = 16;
const ballAt = (k: number) => `translate(${GD_P[k][0].toFixed(1)}px, ${(GD_P[k][1] - BALL_R).toFixed(1)}px)`;

// Tangent at the starting point (screen slope from the derivative).
const GD_SLOPE = 2 * VS * (GD_W0 - W_BEST);
const GD_M = (GD_SLOPE * (GL(1) - GL(0))) / (GW(1) - GW(0));
const GD_TX = 150 / Math.hypot(1, GD_M);
const GD_TAN = {
  x1: GD_P[0][0] - GD_TX * 0.35,
  y1: GD_P[0][1] - GD_M * GD_TX * 0.35,
  x2: GD_P[0][0] + GD_TX,
  y2: GD_P[0][1] + GD_M * GD_TX,
};

CSS.push(`
@keyframes ml-gd-hop{${GD_P.map((_, k) => `${k * 20}%{transform:${ballAt(k)}}`).join('')}}
.ml-gd .ml-gd-ball{transform:${ballAt(0)}}
${at('gd', 2)} .ml-gd-ball{transform:${ballAt(5)}}
${liveAt('gd', 2)} .ml-gd-ball{animation:ml-gd-hop 2600ms ${EASE} 300ms both}
`);

const Hop = ({ k }: { k: number }) => {
  const [x1, y1] = GD_P[k];
  const [x2, y2] = GD_P[k + 1];
  return (
    <g>
      <path
        d={`M ${x1} ${y1 - 22} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - 70} ${x2} ${y2 - 22}`}
        pathLength={1}
        fill="none"
        stroke={ink.accent}
        strokeWidth={2.5}
        opacity={0.7}
        className="ml-draw2"
        style={vars({ d: `${300 + k * 520}ms` })}
      />
      <circle cx={x2} cy={y2} r={6} fill={ink.faint} className="ml-fade2" style={vars({ d: `${700 + k * 520}ms` })} />
    </g>
  );
};

const Gradient: Page = () => (
  <Frame id="gd" eyebrow="04 · Optimisation" stage={4} beats={3}>
    <Title>Descendre la pente : la descente de gradient</Title>
    <Lede>
      Le <Hl>gradient</Hl> indique dans quelle direction l'erreur augmente. On fait donc un petit pas
      dans la direction opposée, et on recommence.
    </Lede>

    <svg width={920} height={460} style={{ position: 'absolute', left: 140, top: 392, overflow: 'visible' }}>
      <AxisX x1={70} x2={890} y={400} />
      <AxisY x={70} y1={400} y2={10} />
      <TickX x={GW(0)} y={400} label="0" />
      <TickX x={GW(6)} y={400} label="6" />
      <TickX x={GW(12)} y={400} label="12" />
      <TickX x={GW(18)} y={400} label="18" />
      <TickX x={GW(24)} y={400} label="24" />
      <text x={890} y={460} textAnchor="end" style={axisTitle} fill={ink.muted}>
        w (€/m²) →
      </text>
      <text x={0} y={-6} style={axisTitle} fill={ink.muted}>
        erreur L
      </text>
      <path d={GD_CURVE} pathLength={1} className="ml-in-draw" fill="none" stroke={ink.soft} strokeWidth={4} style={vars({ d: '200ms' })} />
      <circle cx={GD_P[0][0]} cy={GD_P[0][1]} r={6} fill={ink.faint} />
      <g className="ml-off2">
        <line
          x1={GD_TAN.x1}
          y1={GD_TAN.y1}
          x2={GD_TAN.x2}
          y2={GD_TAN.y2}
          pathLength={1}
          stroke={ink.accent}
          strokeWidth={3}
          strokeLinecap="round"
          className="ml-draw1"
        />
        <text
          x={GD_TAN.x2 + 30}
          y={GD_TAN.y2 - 30}
          className="ml-fade1"
          style={{ ...vars({ d: '500ms' }), fontFamily: mono, fontSize: 22, fontWeight: 500 }}
          fill={ink.accent}
        >
          pente &lt; 0 → augmenter w
        </text>
      </g>
      <Hop k={0} />
      <Hop k={1} />
      <Hop k={2} />
      <Hop k={3} />
      <Hop k={4} />
      <g className="ml-gd-ball">
        <circle cx={0} cy={0} r={BALL_R} fill={ink.accent} stroke={ink.card} strokeWidth={3} />
      </g>
    </svg>
    <Fig n={4} style={{ left: 140, top: 878, width: 920 }}>
      Les pas raccourcissent d'eux-mêmes : près du fond, la pente s'aplatit.
    </Fig>

    <Note n="1" title="Mesurer la pente" className="ml-on1" style={{ left: 1140, top: 400, width: 640 }}>
      ∂L/∂w : l'erreur monte-t-elle quand w augmente ?
    </Note>
    <Note n="2" title="Faire un pas en sens inverse" className="ml-on2" style={{ left: 1140, top: 560, width: 640 }}>
      <Formula>w ← w − η · ∂L/∂w</Formula>η : le taux d'apprentissage.
    </Note>
    <Note n="3" title="Tous les paramètres à la fois" className="ml-on3" style={{ left: 1140, top: 720, width: 640 }}>
      <Formula>θ ← θ − η · ∇L(θ)</Formula>∇L est calculé par rétropropagation.
    </Note>
  </Frame>
);

// ═══ 12 · Le taux d'apprentissage ════════════════════════════════════════════
const RX = lin(0, 24, 20, 440);
const RY = (w: number) => 200 - 180 * ((w - 12) / 12) ** 2;
const R_BOWL = poly(Array.from({ length: 49 }, (_, k) => [RX(k / 2), RY(k / 2)] as [number, number]));
const R_SMALL = Array.from({ length: 10 }, (_, k) => 12 - 11 * 0.85 ** k);
const R_GOOD = Array.from({ length: 6 }, (_, k) => 12 - 11 * 0.45 ** k);
const R_BIG = Array.from({ length: 6 }, (_, k) => 12 - 5 * (-1.18) ** k);

const LrPlot = ({ ws, draw }: { ws: number[]; draw: string }) => (
  <svg width={460} height={220} style={{ overflow: 'visible' }}>
    <path d={R_BOWL} fill="none" stroke={ink.soft} strokeWidth={3} />
    <path
      d={poly(ws.map((w) => [RX(w), RY(w)] as [number, number]))}
      pathLength={1}
      fill="none"
      stroke={ink.accent}
      strokeWidth={2.5}
      strokeLinejoin="round"
      className={draw}
      style={vars({ d: '400ms' })}
    />
    {ws.map((w, k) => (
      <circle key={k} cx={RX(w)} cy={RY(w)} r={k === ws.length - 1 ? 9 : 5} fill={k === ws.length - 1 ? ink.accent : ink.soft} />
    ))}
    <line x1={RX(12)} y1={RY(12) + 8} x2={RX(12)} y2={RY(12) + 18} stroke={ink.faint} strokeWidth={2} />
  </svg>
);

const LrCard = ({
  x,
  cls,
  title,
  verdict,
  c,
  plot,
  children,
}: {
  x: number;
  cls?: string;
  title: string;
  verdict: string;
  c: Tone;
  plot: ReactNode;
  children: ReactNode;
}) => (
  <Card x={x} h={480} cls={cls} pad={28}>
    <div style={{ height: 220 }}>{plot}</div>
    <div style={{ marginTop: 20, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <CardTitle>{title}</CardTitle>
      <span
        style={{
          fontFamily: mono,
          fontSize: 22,
          fontWeight: 500,
          padding: '4px 12px',
          borderRadius: 8,
          background: tone[c].bg,
          boxShadow: `inset 0 0 0 2px ${tone[c].bd}`,
          color: tone[c].fg,
        }}
      >
        {verdict}
      </span>
    </div>
    <CardText>{children}</CardText>
  </Card>
);

const LearningRate: Page = () => (
  <Frame id="lr" eyebrow="04 · Optimisation" stage={4} beats={2}>
    <Title>La taille du pas : le taux d'apprentissage η</Title>
    <Lede>
      Un réglage clé, choisi par nous et non appris : un <Hl>hyperparamètre</Hl>. Même départ, même
      paysage, trois valeurs de η.
    </Lede>
    <LrCard x={140} title="η trop petit" verdict="lent" c="butter" plot={<LrPlot ws={R_SMALL} draw="ml-in-draw" />}>
      Des pas minuscules : après 9 pas, toujours loin du fond. Coûteux.
    </LrCard>
    <LrCard x={700} cls="ml-on1" title="η bien choisi" verdict="converge" c="mint" plot={<LrPlot ws={R_GOOD} draw="ml-draw1" />}>
      Les pas suivent la pente et se posent au fond en quelques itérations.
    </LrCard>
    <LrCard x={1260} cls="ml-on2" title="η trop grand" verdict="diverge" c="rose" plot={<LrPlot ws={R_BIG} draw="ml-draw2" />}>
      Chaque pas saute par-dessus le fond, de plus en plus haut.
    </LrCard>
    <Fig n={5} style={{ left: 140, top: 900, width: 1640 }}>
      En pratique, η se règle sur la validation ; des optimiseurs comme Adam l'adaptent à chaque paramètre.
    </Fig>
  </Frame>
);

// ═══ 13 · Par mini-lots : SGD et époques ═════════════════════════════════════
CSS.push(`
@keyframes ml-lot{0%{opacity:0}2%,18%{opacity:1}20%,100%{opacity:0}}
.ml-sgd .ml-lot{opacity:0}
${at('sgd', 1)} .ml-lot{opacity:.5}
${liveAt('sgd', 1)} .ml-lot{animation:ml-lot 5s linear var(--p,0ms) infinite}
`);

const SQ_X = (i: number) => 140 + i * 34 + Math.floor(i / 8) * 12;
const sqRand = rng(13);
const SQ_T = Array.from({ length: 40 }, () => CYCLE[Math.floor(sqRand() * CYCLE.length)]);
const LOT_W = 8 * 34 - 6;

const LotBox = ({ i }: { i: number }) => (
  <>
    <div
      className="ml-lot"
      style={{
        ...vars({ p: `${i * 1000}ms` }),
        position: 'absolute',
        left: SQ_X(i * 8) - 7,
        top: 437,
        width: LOT_W + 14,
        height: 42,
        boxSizing: 'border-box',
        borderRadius: 10,
        border: `3px solid ${ink.accent}`,
        background: ink.accentSoft,
      }}
    />
    <div
      className="ml-fade1"
      style={{
        ...vars({ d: `${i * 90}ms` }),
        position: 'absolute',
        left: SQ_X(i * 8),
        width: LOT_W,
        top: 490,
        textAlign: 'center',
        fontFamily: mono,
        fontSize: 22,
        color: ink.accent,
        borderTop: `2px solid ${tone.accent.bd}`,
        paddingTop: 6,
      }}
    >
      lot {i + 1}
    </div>
  </>
);

const QX = lin(0, 100, 70, 800);
const QY = lin(0, 1, 220, 10);
const qRand = rng(17);
const Q_FULL = poly(Array.from({ length: 101 }, (_, k) => [QX(k), QY(0.1 + 0.85 * Math.exp(-k / 45))] as [number, number]));
const Q_SGD = poly(
  Array.from({ length: 101 }, (_, k) => {
    const v = 0.1 + 0.85 * Math.exp(-k / 14) + gauss(qRand) * (0.025 + 0.06 * Math.exp(-k / 30));
    return [QX(k), QY(Math.max(0.02, Math.min(1, v)))] as [number, number];
  }),
);

const LegendLine = ({ y, c, dash, children }: { y: number; c: string; dash?: string; children: ReactNode }) => (
  <g>
    <line x1={430} y1={y} x2={470} y2={y} stroke={c} strokeWidth={4} strokeDasharray={dash} />
    <text x={484} y={y + 8} style={{ fontFamily: sans, fontSize: 22 }} fill={ink.soft}>
      {children}
    </text>
  </g>
);

const Term = ({ y, term, children }: { y: number; term: string; children: ReactNode }) => (
  <div
    className="ml-on3"
    style={{
      ...vars({ d: `${(y - 640) * 2}ms` }),
      position: 'absolute',
      left: 1040,
      top: y,
      width: 740,
      display: 'flex',
      alignItems: 'baseline',
      paddingBottom: 14,
      borderBottom: `1px solid ${ink.rule}`,
    }}
  >
    <span style={{ width: 230, fontFamily: serif, fontSize: 32, fontWeight: 500 }}>{term}</span>
    <span style={{ fontSize: 26, color: ink.soft }}>{children}</span>
  </div>
);

const Sgd: Page = () => (
  <Frame id="sgd" eyebrow="04 · Optimisation" stage={4} beats={3}>
    <Title>Par petits lots : la descente stochastique</Title>
    <Lede>
      Calculer le gradient sur tout le jeu de données à chaque pas coûte trop cher. On l'estime sur un{' '}
      <Hl>mini-lot</Hl> tiré au hasard : c'est la SGD.
    </Lede>
    <Label x={140} y={398}>
      le jeu d'entraînement, mélangé : 40 exemples (en vrai, des millions)
    </Label>
    <LotBox i={0} />
    <LotBox i={1} />
    <LotBox i={2} />
    <LotBox i={3} />
    <LotBox i={4} />
    {SQ_T.map((t, i) => (
      <div
        key={i}
        className="ml-in-pop"
        style={{
          ...vars({ d: `${150 + i * 18}ms` }),
          position: 'absolute',
          left: SQ_X(i),
          top: 444,
          width: 28,
          height: 28,
          boxSizing: 'border-box',
          borderRadius: 6,
          background: tone[t].bg,
          boxShadow: `inset 0 0 0 2px ${tone[t].bd}`,
        }}
      />
    ))}
    <div
      className="ml-on1"
      style={{
        ...vars({ d: '500ms' }),
        position: 'absolute',
        left: 140,
        top: 548,
        fontFamily: serif,
        fontStyle: 'italic',
        fontSize: 30,
        color: ink.soft,
      }}
    >
      Chaque lot donne un pas de gradient ; quand les 5 lots sont passés, c'est une époque.
    </div>

    <svg width={820} height={270} className="ml-on2" style={{ position: 'absolute', left: 140, top: 622, overflow: 'visible' }}>
      <AxisX x1={70} x2={800} y={220} />
      <AxisY x={70} y1={220} y2={0} />
      <text x={800} y={256} textAnchor="end" style={axisTitle} fill={ink.muted}>
        temps de calcul →
      </text>
      <text x={56} y={110} textAnchor="middle" transform="rotate(-90 56 110)" style={axisTitle} fill={ink.muted}>
        erreur
      </text>
      <path d={Q_FULL} pathLength={1} fill="none" stroke={ink.soft} strokeWidth={3.5} className="ml-draw2" />
      <path d={Q_SGD} pathLength={1} fill="none" stroke={ink.accent} strokeWidth={2.5} strokeLinejoin="round" className="ml-draw2" style={vars({ d: '200ms' })} />
      <LegendLine y={30} c={ink.soft}>
        tout le jeu : précis, lent
      </LegendLine>
      <LegendLine y={66} c={ink.accent}>
        mini-lots : bruité, rapide
      </LegendLine>
    </svg>

    <Term y={640} term="Lot (batch)">
      32 à 4 096 exemples tirés au hasard
    </Term>
    <Term y={724} term="Itération">
      un lot traité = un pas de gradient
    </Term>
    <Term y={808} term="Époque">
      tout le jeu de données vu une fois
    </Term>
  </Frame>
);

// ═══ 14 · Entraînement, validation, test ═════════════════════════════════════
const SplitSeg = ({
  x,
  w,
  c,
  name,
  share,
  d,
}: {
  x: number;
  w: number;
  c: Tone;
  name: string;
  share: string;
  d: number;
}) => (
  <div
    className="ml-fade1"
    style={{
      ...vars({ d: `${d}ms` }),
      position: 'absolute',
      left: x,
      top: 400,
      width: w,
      height: 76,
      boxSizing: 'border-box',
      borderRadius: 12,
      background: tone[c].bg,
      boxShadow: `inset 0 0 0 2px ${tone[c].bd}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: tone[c].fg,
    }}
  >
    <span style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.2 }}>{name}</span>
    <span style={{ fontFamily: mono, fontSize: 22, lineHeight: 1.2 }}>{share}</span>
  </div>
);

const SplitRole = ({
  y,
  c,
  name,
  d,
  children,
}: {
  y: number;
  c: Tone;
  name: string;
  d: number;
  children: ReactNode;
}) => (
  <div
    className="ml-on2"
    style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: 140, top: y, width: 1640, display: 'flex' }}
  >
    <span style={{ flex: 'none', width: 24, height: 24, marginTop: 12, borderRadius: 6, background: tone[c].bd }} />
    <span style={{ flex: 'none', width: 290, marginLeft: 22, fontFamily: serif, fontSize: 36, fontWeight: 500, lineHeight: 1.3 }}>
      {name}
    </span>
    <span style={{ fontSize: 28, lineHeight: 1.45, color: ink.soft }}>{children}</span>
  </div>
);

const Split: Page = () => (
  <Frame id="split" eyebrow="05 · Généralisation" stage={5} beats={3}>
    <Title>Le vrai test : des données jamais vues</Title>
    <Lede>
      Réussir sur les exemples d'entraînement ne prouve rien. On met de côté des données que le modèle{' '}
      <Hl>ne voit jamais</Hl> pendant l'apprentissage.
    </Lede>
    <div
      className="ml-off1"
      style={{
        position: 'absolute',
        left: 140,
        top: 400,
        width: 1640,
        height: 76,
        borderRadius: 12,
        background: ink.panel,
        boxShadow: `inset 0 0 0 2px ${ink.rule}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 26,
        color: ink.muted,
      }}
    >
      toutes les données étiquetées
    </div>
    <SplitSeg x={140} w={1134} c="mint" name="Entraînement" share="70 %" d={0} />
    <SplitSeg x={1284} w={243} c="butter" name="Validation" share="15 %" d={120} />
    <SplitSeg x={1537} w={243} c="lav" name="Test" share="15 %" d={240} />

    <SplitRole y={540} c="mint" name="Entraînement" d={0}>
      Le modèle y ajuste ses paramètres : il voit et revoit ces exemples à chaque époque.
    </SplitRole>
    <SplitRole y={648} c="butter" name="Validation" d={150}>
      Pour choisir les réglages (η, taille du modèle…) et quand s'arrêter. Variante : la validation
      croisée, qui fait tourner ce rôle sur k blocs.
    </SplitRole>
    <SplitRole y={756} c="lav" name="Test" d={300}>
      Utilisé une seule fois, à la toute fin : l'estimation honnête de la performance réelle.
    </SplitRole>

    <div
      className="ml-on3"
      style={{
        position: 'absolute',
        left: 140,
        top: 880,
        fontFamily: serif,
        fontStyle: 'italic',
        fontSize: 30,
        color: ink.soft,
      }}
    >
      Comme pour un examen : les annales pour réviser, l'examen blanc pour se régler, le vrai examen une
      seule fois.
    </div>
  </Frame>
);

// ═══ 15 · Sous- et sur-apprentissage ═════════════════════════════════════════
// Least squares polynomial fit (normal equations, x rescaled to [−1, 1]).
const polyfit = (xs: number[], ys: number[], degree: number) => {
  const n = degree + 1;
  const A = Array.from({ length: n }, () => Array<number>(n + 1).fill(0));
  xs.forEach((x, k) => {
    const u = x * 2 - 1;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) A[i][j] += u ** (i + j);
      A[i][n] += ys[k] * u ** i;
    }
  });
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      for (let j = c; j <= n; j++) A[r][j] -= f * A[c][j];
    }
  }
  const coef = A.map((row, i) => row[n] / row[i]);
  return (x: number) => coef.reduce((acc, co, i) => acc + co * (x * 2 - 1) ** i, 0);
};
// Interpolating polynomial through every training point (degree n − 1).
const lagrange = (xs: number[], ys: number[]) => (x: number) =>
  xs.reduce((acc, xi, i) => acc + ys[i] * xs.reduce((m, xj, j) => (j === i ? m : (m * (x - xj)) / (xi - xj)), 1), 0);

const fRand = rng(3);
const fTrue = (x: number) => 0.5 + 0.32 * Math.sin(2 * Math.PI * 0.85 * x + 0.3);
const F_TRX = Array.from({ length: 10 }, (_, i) => 0.05 + i * 0.1 + (fRand() - 0.5) * 0.04);
const F_TRY = F_TRX.map((x) => fTrue(x) + gauss(fRand) * 0.06);
const F_TEX = [0.01, 0.28, 0.52, 0.77, 0.99];
const F_TEY = F_TEX.map((x) => fTrue(x) + gauss(fRand) * 0.06);
const FIT1 = polyfit(F_TRX, F_TRY, 1);
const FIT3 = polyfit(F_TRX, F_TRY, 3);
const FIT9 = lagrange(F_TRX, F_TRY);
const fitErr = (g: (x: number) => number, xs: number[], ys: number[]) => mean(xs.map((x, i) => (g(x) - ys[i]) ** 2));

const FX = lin(0, 1, 20, 440);
const FY = lin(-0.05, 1.05, 220, 8);
const fitPath = (g: (x: number) => number) =>
  poly(Array.from({ length: 201 }, (_, k) => [FX(k / 200), Math.max(-300, Math.min(500, FY(g(k / 200))))] as [number, number]));

const FitPlot = ({ id, g, draw }: { id: string; g: (x: number) => number; draw: string }) => (
  <svg width={460} height={230} style={{ overflow: 'visible' }}>
    <defs>
      <clipPath id={id}>
        <rect x={0} y={0} width={460} height={230} />
      </clipPath>
    </defs>
    <rect x={0} y={0} width={460} height={230} rx={10} fill={ink.panel} />
    <g clipPath={`url(#${id})`}>
      <path d={fitPath(g)} pathLength={1} fill="none" stroke={ink.accent} strokeWidth={3.5} strokeLinejoin="round" className={draw} style={vars({ d: '300ms' })} />
    </g>
    {F_TRX.map((x, i) => (
      <circle key={`tr${i}`} cx={FX(x)} cy={FY(F_TRY[i])} r={8} fill={ink.soft} stroke={ink.panel} strokeWidth={2} />
    ))}
    {F_TEX.map((x, i) => (
      <circle key={`te${i}`} cx={FX(x)} cy={FY(F_TEY[i])} r={7} fill={ink.card} stroke={tone.sky.fg} strokeWidth={3} />
    ))}
  </svg>
);

// Error bar: square-root scale so that tiny and huge errors both stay readable.
const ErrBar = ({ label, v }: { label: string; v: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', height: 34 }}>
    <span style={{ width: 170, fontFamily: mono, fontSize: 22, color: ink.muted }}>{label}</span>
    <span style={{ width: 200, height: 16, position: 'relative' }}>
      <span
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: 16,
          width: Math.max(3, Math.round(Math.min(1, Math.sqrt(v) / 0.6) * 196)),
          borderRadius: 4,
          background: Math.sqrt(v) > 0.3 ? ink.accent : ink.soft,
        }}
      />
    </span>
    <span style={{ width: 90, textAlign: 'right', fontFamily: mono, fontSize: 22, color: Math.sqrt(v) > 0.3 ? ink.accent : ink.text }}>
      {fr(v, 3)}
    </span>
  </div>
);

const FitCard = ({
  x,
  cls,
  id,
  g,
  draw,
  title,
  tag,
  c,
  children,
}: {
  x: number;
  cls?: string;
  id: string;
  g: (x: number) => number;
  draw: string;
  title: string;
  tag: string;
  c: Tone;
  children: ReactNode;
}) => (
  <Card x={x} top={400} h={500} cls={cls} pad={26}>
    <FitPlot id={id} g={g} draw={draw} />
    <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <CardTitle size={36}>{title}</CardTitle>
      <span style={{ fontFamily: mono, fontSize: 22, fontWeight: 500, color: tone[c].fg }}>{tag}</span>
    </div>
    <div style={{ marginTop: 6, fontSize: 26, lineHeight: 1.4, color: ink.soft, height: 73 }}>{children}</div>
    <div style={{ marginTop: 10 }}>
      <ErrBar label="entraînement" v={fitErr(g, F_TRX, F_TRY)} />
      <ErrBar label="test" v={fitErr(g, F_TEX, F_TEY)} />
    </div>
  </Card>
);

const Fitting: Page = () => (
  <Frame id="fit" eyebrow="05 · Généralisation" stage={5} beats={2}>
    <Title>Ni trop simple, ni trop souple</Title>
    <Lede>
      Trop simple, le modèle rate la tendance. Trop souple, il <Hl>apprend le bruit par cœur</Hl> et
      échoue sur les données neuves.
    </Lede>
    <div style={{ position: 'absolute', left: 140, top: 346, display: 'flex', gap: 36, fontFamily: mono, fontSize: 22, color: ink.muted }}>
      <span>
        <span style={{ color: ink.soft }}>●</span> entraînement
      </span>
      <span>
        <span style={{ color: tone.sky.fg }}>○</span> test, jamais vu
      </span>
      <span>erreur = MSE</span>
    </div>
    <FitCard x={140} id="ml-clip-fit1" g={FIT1} draw="ml-in-draw" title="Trop simple" tag="sous-apprend" c="butter">
      Une droite ne peut pas suivre la courbe : erreur partout.
    </FitCard>
    <FitCard x={700} cls="ml-on1" id="ml-clip-fit3" g={FIT3} draw="ml-draw1" title="Bien dosé" tag="généralise" c="mint">
      Un polynôme de degré 3 capte la tendance, pas le bruit.
    </FitCard>
    <FitCard x={1260} cls="ml-on2" id="ml-clip-fit9" g={FIT9} draw="ml-draw2" title="Trop souple" tag="sur-apprend" c="rose">
      Degré 9 : il passe par chaque point… et délire entre eux.
    </FitCard>
  </Frame>
);

// ═══ 16 · Les courbes d'apprentissage ════════════════════════════════════════
const CE = lin(0, 100, 70, 960);
const CV = lin(0, 1, 400, 20);
const trainC = (t: number) => 0.07 + 0.88 * Math.exp(-t / 16);
const valC = (t: number) => 0.15 + 0.85 * Math.exp(-t / 18) + 0.00006 * Math.max(0, t - 25) ** 2;
const T_STOP = Array.from({ length: 101 }, (_, t) => t).reduce((b, t) => (valC(t) < valC(b) ? t : b), 0);
const curvePath = (f: (t: number) => number) =>
  poly(Array.from({ length: 101 }, (_, t) => [CE(t), CV(f(t))] as [number, number]));

const Remedy = ({ y, term, children }: { y: number; term: string; children: ReactNode }) => (
  <div className="ml-on3" style={{ ...vars({ d: `${(y - 440) * 1.5}ms` }), position: 'absolute', left: 1200, top: y, width: 580 }}>
    <div style={{ fontFamily: serif, fontSize: 32, fontWeight: 500, lineHeight: 1.2 }}>{term}</div>
    <div style={{ fontSize: 26, lineHeight: 1.4, color: ink.soft, marginTop: 4 }}>{children}</div>
  </div>
);

const Curves: Page = () => (
  <Frame id="curves" eyebrow="05 · Généralisation" stage={5} beats={3}>
    <Title>Repérer le sur-apprentissage</Title>
    <Lede>
      Pendant l'entraînement, on suit deux erreurs. Quand celle de validation <Hl>remonte</Hl>, le modèle
      commence à mémoriser au lieu d'apprendre.
    </Lede>

    <svg width={980} height={440} style={{ position: 'absolute', left: 140, top: 400, overflow: 'visible' }}>
      <g className="ml-fade2">
        <rect x={CE(T_STOP)} y={20} width={960 - CE(T_STOP)} height={380} fill={tone.rose.bg} fillOpacity={0.45} />
        <text x={CE(T_STOP) + 20} y={56} style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 28 }} fill={tone.rose.fg}>
          sur-apprentissage →
        </text>
        <text x={CE(T_STOP) - 20} y={56} textAnchor="end" style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 28 }} fill={ink.muted}>
          ← sous-apprentissage
        </text>
      </g>
      <AxisX x1={70} x2={960} y={400} />
      <AxisY x={70} y1={400} y2={10} />
      <text x={960} y={440} textAnchor="end" style={axisTitle} fill={ink.muted}>
        époques →
      </text>
      <text x={0} y={-6} style={axisTitle} fill={ink.muted}>
        erreur
      </text>
      <path d={curvePath(trainC)} pathLength={1} className="ml-in-draw" fill="none" stroke={tone.mint.fg} strokeWidth={4} style={vars({ d: '200ms' })} />
      <path d={curvePath(valC)} pathLength={1} className="ml-draw1" fill="none" stroke={tone.butter.fg} strokeWidth={4} />
      <g className="ml-fade2" style={vars({ d: '300ms' })}>
        <line x1={CE(T_STOP)} y1={20} x2={CE(T_STOP)} y2={400} stroke={ink.accent} strokeWidth={2.5} strokeDasharray="6 6" />
        <circle cx={CE(T_STOP)} cy={CV(valC(T_STOP))} r={11} fill={ink.accent} stroke={ink.card} strokeWidth={3} />
        <text x={CE(T_STOP) + 18} y={CV(valC(T_STOP)) + 34} style={{ fontFamily: mono, fontSize: 22, fontWeight: 600 }} fill={ink.accent}>
          arrêt précoce
        </text>
      </g>
      <g>
        <line x1={560} y1={-14} x2={600} y2={-14} stroke={tone.mint.fg} strokeWidth={4} />
        <text x={612} y={-6} style={{ fontFamily: sans, fontSize: 22 }} fill={ink.soft}>
          entraînement
        </text>
      </g>
      <g className="ml-fade1">
        <line x1={790} y1={-14} x2={830} y2={-14} stroke={tone.butter.fg} strokeWidth={4} />
        <text x={842} y={-6} style={{ fontFamily: sans, fontSize: 22 }} fill={ink.soft}>
          validation
        </text>
      </g>
    </svg>

    <Label x={1200} y={400} className="ml-fade3">
      les remèdes
    </Label>
    <Remedy y={440} term="Plus de données">
      le bruit se moyenne, le signal reste
    </Remedy>
    <Remedy y={545} term="Régularisation">
      pénaliser les grands poids : L + λ‖w‖²
    </Remedy>
    <Remedy y={650} term="Dropout">
      éteindre des neurones au hasard
    </Remedy>
    <Remedy y={755} term="Arrêt précoce">
      garder le modèle du meilleur point
    </Remedy>
  </Frame>
);

// ═══ 17 · Mesurer la qualité ═════════════════════════════════════════════════
const CM = { vp: 42, fn: 8, fp: 15, vn: 935 };
const CM_N = CM.vp + CM.fn + CM.fp + CM.vn;
// !important: the cells carry their resting box-shadow inline.
const hot = `box-shadow:inset 0 0 0 4px ${ink.accent} !important`;

CSS.push(`
.ml-metrics .ml-cell{transition:opacity 500ms ${EASE},box-shadow 500ms ${EASE}}
${at('metrics', 1)} .ml-c-fn,${at('metrics', 1)} .ml-c-fp{opacity:.32}
${at('metrics', 1)} .ml-c-vp,${at('metrics', 1)} .ml-c-vn{${hot}}
${at('metrics', 2)} .ml-c-fp{opacity:1;${hot}}
${at('metrics', 2)} .ml-c-vn{opacity:.32;box-shadow:inset 0 0 0 2px ${tone.mint.bd} !important}
${at('metrics', 3)} .ml-c-fn{opacity:1;${hot}}
${at('metrics', 3)} .ml-c-fp{opacity:.32;box-shadow:inset 0 0 0 2px ${tone.rose.bd} !important}
`);

const CmCell = ({
  x,
  y,
  k,
  c,
  v,
  code,
  children,
}: {
  x: number;
  y: number;
  k: string;
  c: Tone;
  v: number;
  code: string;
  children: ReactNode;
}) => (
  <div
    className={`ml-cell ml-c-${k}`}
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 250,
      height: 150,
      boxSizing: 'border-box',
      padding: '16px 20px',
      borderRadius: 14,
      background: tone[c].bg,
      boxShadow: `inset 0 0 0 2px ${tone[c].bd}`,
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontFamily: serif, fontSize: 60, fontWeight: 500, lineHeight: 1.05 }}>{num(v)}</span>
      <span style={{ fontFamily: mono, fontSize: 22, fontWeight: 600, color: tone[c].fg }}>{code}</span>
    </div>
    <div style={{ fontSize: 24, lineHeight: 1.3, color: tone[c].fg, marginTop: 6 }}>{children}</div>
  </div>
);

const Metric = ({
  y,
  n,
  name,
  value,
  children,
}: {
  y: number;
  n: number;
  name: string;
  value: string;
  children: ReactNode;
}) => (
  <div className={`ml-on${n}`} style={{ position: 'absolute', left: 1000, top: y, width: 780 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontFamily: serif, fontSize: 40, fontWeight: 500 }}>{name}</span>
      <span style={{ fontFamily: serif, fontSize: 52, fontWeight: 500, color: ink.accent }}>{value}</span>
    </div>
    <div style={{ fontSize: 24, lineHeight: 1.4, color: ink.muted, borderTop: `1px solid ${ink.rule}`, paddingTop: 8, marginTop: 4 }}>
      {children}
    </div>
  </div>
);

const Metrics: Page = () => (
  <Frame id="metrics" eyebrow="05 · Généralisation" stage={5} beats={3}>
    <Title>Mesurer la qualité : au-delà du score</Title>
    <Lede>
      Sur 1 000 e-mails dont 50 spams, un modèle qui répond toujours « légitime » a 95 % d'exactitude…
      et ne sert à rien. Il faut <Hl>regarder les erreurs</Hl>.
    </Lede>

    <div style={{ position: 'absolute', left: 400, top: 400, width: 250, textAlign: 'center', fontFamily: mono, fontSize: 22, color: ink.muted }}>
      prédit : spam
    </div>
    <div style={{ position: 'absolute', left: 662, top: 400, width: 250, textAlign: 'center', fontFamily: mono, fontSize: 22, color: ink.muted }}>
      prédit : légitime
    </div>
    <div style={{ position: 'absolute', left: 140, top: 498, width: 236, textAlign: 'right', fontFamily: mono, fontSize: 22, color: ink.muted }}>
      réel : spam
    </div>
    <div style={{ position: 'absolute', left: 140, top: 660, width: 236, textAlign: 'right', fontFamily: mono, fontSize: 22, color: ink.muted }}>
      réel : légitime
    </div>
    <CmCell x={400} y={440} k="vp" c="mint" v={CM.vp} code="VP">
      spams attrapés
    </CmCell>
    <CmCell x={662} y={440} k="fn" c="rose" v={CM.fn} code="FN">
      spams manqués
    </CmCell>
    <CmCell x={400} y={602} k="fp" c="rose" v={CM.fp} code="FP">
      fausses alertes
    </CmCell>
    <CmCell x={662} y={602} k="vn" c="mint" v={CM.vn} code="VN">
      légitimes bien classés
    </CmCell>
    <Fig n={6} style={{ left: 400, top: 780, width: 520 }}>
      Matrice de confusion : réalité en lignes, prédiction en colonnes.
    </Fig>

    <Metric y={410} n={1} name="Exactitude" value={`${fr(((CM.vp + CM.vn) / CM_N) * 100, 1)} %`}>
      (VP + VN) / total : la part de bonnes réponses
    </Metric>
    <Metric y={560} n={2} name="Précision" value={`${Math.round((CM.vp / (CM.vp + CM.fp)) * 100)} %`}>
      VP / (VP + FP) : quand il crie au spam, a-t-il raison ?
    </Metric>
    <Metric y={710} n={3} name="Rappel" value={`${Math.round((CM.vp / (CM.vp + CM.fn)) * 100)} %`}>
      VP / (VP + FN) : quelle part des spams attrape-t-il ?
    </Metric>
    <div
      className="ml-on3"
      style={{ ...vars({ d: '400ms' }), position: 'absolute', left: 1000, top: 862, width: 780, fontFamily: serif, fontStyle: 'italic', fontSize: 28, color: ink.soft }}
    >
      Le bon compromis dépend du coût de chaque erreur.
    </div>
  </Frame>
);

// ═══ 18 · Les arbres de décision ═════════════════════════════════════════════
const TREE_A = 7;
const TREE_R = 12;
const TREE_L = 38;
const treeSays = (m: Mail) => (m.x1 > TREE_A ? (m.x2 > TREE_R ? 1 : 0) : m.x2 > TREE_L ? 1 : 0);
const TREE_MISS = MAILS.filter((m) => treeSays(m) !== m.y);

const TNode = ({
  cx,
  y,
  kind,
  cls,
  children,
}: {
  cx: number;
  y: number;
  kind: 'q' | 'spam' | 'ok';
  cls?: string;
  children: ReactNode;
}) => {
  const t = kind === 'spam' ? tone.rose : kind === 'ok' ? tone.mint : null;
  return (
    <div
      className={cls}
      style={{ position: 'absolute', left: cx - 200, top: y, width: 400, display: 'flex', justifyContent: 'center' }}
    >
      <div
        style={{
          height: 56,
          padding: '0 22px',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          borderRadius: kind === 'q' ? 12 : 999,
          fontFamily: mono,
          fontSize: 24,
          fontWeight: kind === 'q' ? 400 : 600,
          background: t ? t.bg : ink.card,
          boxShadow: `inset 0 0 0 2px ${t ? t.bd : ink.soft}`,
          color: t ? t.fg : ink.text,
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Edge = ({ x1, y1, x2, y2, n, label }: { x1: number; y1: number; x2: number; y2: number; n: number; label: string }) => (
  <g>
    <path d={`M ${x1} ${y1} L ${x2} ${y2}`} pathLength={1} stroke={ink.soft} strokeWidth={2.5} fill="none" className={`ml-draw${n}`} />
    <text
      x={(x1 + x2) / 2 + (x2 > x1 ? 18 : -18)}
      y={(y1 + y2) / 2 + 2}
      textAnchor={x2 > x1 ? 'start' : 'end'}
      className={`ml-fade${n}`}
      style={{ fontFamily: mono, fontSize: 22 }}
      fill={ink.muted}
    >
      {label}
    </text>
  </g>
);

const Tree: Page = () => (
  <Frame id="tree" eyebrow="06 · Au-delà" stage={6} beats={4}>
    <Title>Les arbres de décision</Title>
    <Lede>
      Même problème de spam, autre modèle : une suite de questions oui / non, apprises sur les données.
      Chaque question <Hl>coupe l'espace</Hl> en deux.
    </Lede>

    <svg width={780} height={480} style={{ position: 'absolute', left: 140, top: 400, overflow: 'visible' }}>
      <g className="ml-fade3" style={vars({ d: '500ms' })}>
        <rect x={EX(TREE_A)} y={EY(60)} width={EX(20) - EX(TREE_A)} height={EY(TREE_R) - EY(60)} fill={tone.rose.bg} fillOpacity={0.55} />
        <rect x={EX(0)} y={EY(60)} width={EX(TREE_A) - EX(0)} height={EY(TREE_L) - EY(60)} fill={tone.rose.bg} fillOpacity={0.55} />
        <rect x={EX(TREE_A)} y={EY(TREE_R)} width={EX(20) - EX(TREE_A)} height={EY(0) - EY(TREE_R)} fill={tone.mint.bg} fillOpacity={0.6} />
        <rect x={EX(0)} y={EY(TREE_L)} width={EX(TREE_A) - EX(0)} height={EY(0) - EY(TREE_L)} fill={tone.mint.bg} fillOpacity={0.6} />
      </g>
      <MailAxes />
      <path d={`M ${EX(TREE_A)} ${EY(0)} V ${EY(60)}`} pathLength={1} className="ml-draw1" stroke={ink.accent} strokeWidth={4} fill="none" />
      <path d={`M ${EX(TREE_A)} ${EY(TREE_R)} H ${EX(20)}`} pathLength={1} className="ml-draw2" stroke={ink.accent} strokeWidth={4} fill="none" />
      <path d={`M ${EX(0)} ${EY(TREE_L)} H ${EX(TREE_A)}`} pathLength={1} className="ml-draw3" stroke={ink.accent} strokeWidth={4} fill="none" />
      <text x={EX(TREE_A) + 10} y={EY(57)} className="ml-fade1" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.accent}>
        liens = {TREE_A}
      </text>
      <text x={EX(TREE_A) + 10} y={EY(TREE_R) - 12} className="ml-fade2" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.accent}>
        MAJ = {TREE_R} %
      </text>
      <text x={EX(0) + 10} y={EY(TREE_L) - 12} className="ml-fade3" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.accent}>
        MAJ = {TREE_L} %
      </text>
      {MAILS.map((m, i) => (
        <MailDot key={i} m={m} d={200 + i * 30} />
      ))}
      {TREE_MISS.map((m, i) => (
        <circle
          key={i}
          cx={EX(m.x1)}
          cy={EY(m.x2)}
          r={19}
          fill="none"
          stroke={ink.accent}
          strokeWidth={2.5}
          strokeDasharray="4 4"
          className="ml-fade3"
          style={vars({ d: '900ms' })}
        />
      ))}
      <MailLegend x={548} y={-14} />
    </svg>

    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <Edge x1={1370} y1={456} x2={1600} y2={540} n={2} label="oui" />
      <Edge x1={1370} y1={456} x2={1140} y2={540} n={3} label="non" />
      <Edge x1={1600} y1={596} x2={1500} y2={680} n={2} label="non" />
      <Edge x1={1600} y1={596} x2={1700} y2={680} n={2} label="oui" />
      <Edge x1={1140} y1={596} x2={1040} y2={680} n={3} label="non" />
      <Edge x1={1140} y1={596} x2={1240} y2={680} n={3} label="oui" />
    </svg>
    <TNode cx={1370} y={400} kind="q" cls="ml-on1">
      liens &gt; {TREE_A} ?
    </TNode>
    <TNode cx={1600} y={540} kind="q" cls="ml-on2">
      MAJ &gt; {TREE_R} % ?
    </TNode>
    <TNode cx={1140} y={540} kind="q" cls="ml-on3">
      MAJ &gt; {TREE_L} % ?
    </TNode>
    <TNode cx={1500} y={680} kind="ok" cls="ml-on2">
      légitime
    </TNode>
    <TNode cx={1700} y={680} kind="spam" cls="ml-on2">
      spam
    </TNode>
    <TNode cx={1040} y={680} kind="ok" cls="ml-on3">
      légitime
    </TNode>
    <TNode cx={1240} y={680} kind="spam" cls="ml-on3">
      spam
    </TNode>
    <Label x={960} y={760} c={ink.accent} className="ml-fade3" style={vars({ d: '900ms' })}>
      ◌ {TREE_MISS.length} erreurs sur {MAILS.length} e-mails : la frontière devient un escalier
    </Label>
    <div className="ml-on4" style={{ position: 'absolute', left: 960, top: 818, width: 820, fontSize: 28, lineHeight: 1.45 }}>
      <Hl>Forêts aléatoires</Hl>, <Hl>gradient boosting</Hl> : des centaines d'arbres combinés, souvent
      imbattables sur des tableaux.
    </div>
  </Frame>
);

// ═══ 19 · Les réseaux de neurones ════════════════════════════════════════════
CSS.push(`
@keyframes ml-flow{0%{stroke-dashoffset:0;opacity:0}12%,88%{opacity:1}100%{stroke-dashoffset:-1;opacity:0}}
.ml-nn .ml-flow{opacity:0;transition:opacity 400ms ${EASE}}
${at('nn', 2)} .ml-flow{opacity:1}
${liveAt('nn', 2)} .ml-flow{animation:ml-flow 1.6s linear var(--p,0ms) infinite}
`);

// Single neuron (left diagram, svg coordinates).
const NEU_IN = [50, 160, 270];
const NEU_SUM = { x: 390, y: 160, r: 66 };
const neuEdge = (y: number) => {
  const dx = NEU_SUM.x - 96;
  const dy = NEU_SUM.y - y;
  const l = Math.hypot(dx, dy);
  return { x1: 96, y1: y, x2: NEU_SUM.x - (dx / l) * (NEU_SUM.r + 4), y2: NEU_SUM.y - (dy / l) * (NEU_SUM.r + 4) };
};

const NeuIn = ({ i }: { i: number }) => {
  const e = neuEdge(NEU_IN[i]);
  return (
    <g>
      <Arrow {...e} head={12} color={ink.soft} />
      <circle cx={60} cy={NEU_IN[i]} r={36} fill={tone.sky.bg} stroke={tone.sky.bd} strokeWidth={2.5} />
      <text x={60} y={NEU_IN[i] + 11} textAnchor="middle" style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 34 }} fill={tone.sky.fg}>
        x
        <tspan dy={8} style={{ fontSize: 22 }}>
          {i + 1}
        </tspan>
      </text>
      <text
        x={e.x1 + (e.x2 - e.x1) * 0.45}
        y={e.y1 + (e.y2 - e.y1) * 0.45 - 14}
        textAnchor="middle"
        style={{ fontFamily: mono, fontSize: 24, fontWeight: 600 }}
        fill={ink.accent}
      >
        w{['₁', '₂', '₃'][i]}
      </text>
    </g>
  );
};

// Network (right diagram, svg coordinates).
const NET_X = [60, 300, 540, 760];
const NET_N = [3, 5, 5, 2];
const netY = (n: number, i: number) => 180 + (i - (n - 1) / 2) * 75;
const NET_EDGES = NET_N.slice(0, -1).flatMap((n, l) =>
  Array.from({ length: n }, (_, i) =>
    Array.from({ length: NET_N[l + 1] }, (_, j) => ({ l, x1: NET_X[l], y1: netY(n, i), x2: NET_X[l + 1], y2: netY(NET_N[l + 1], j) })),
  ).flat(),
);
const NET_FILL = [tone.sky.bd, tone.lav.bd, tone.lav.bd, ink.accent];

const NetLayer = ({ l }: { l: number }) => (
  <g>
    {Array.from({ length: NET_N[l] }, (_, i) => (
      <circle key={i} cx={NET_X[l]} cy={netY(NET_N[l], i)} r={22} fill={NET_FILL[l]} stroke={ink.card} strokeWidth={4} />
    ))}
  </g>
);

const NetLabel = ({ x, children }: { x: number; children: ReactNode }) => (
  <text x={x} y={376} textAnchor="middle" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
    {children}
  </text>
);

const Neural: Page = () => (
  <Frame id="nn" eyebrow="06 · Au-delà" stage={6} beats={3}>
    <Title>Les réseaux de neurones</Title>
    <Lede>
      Un neurone : une somme pondérée, puis une fonction non linéaire. On en <Hl>empile des couches</Hl>,
      et la descente de gradient règle tous les poids.
    </Lede>

    <svg width={760} height={330} style={{ position: 'absolute', left: 140, top: 384, overflow: 'visible' }}>
      <NeuIn i={0} />
      <NeuIn i={1} />
      <NeuIn i={2} />
      <circle cx={NEU_SUM.x} cy={NEU_SUM.y} r={NEU_SUM.r} fill={ink.card} stroke={ink.soft} strokeWidth={3} />
      <text x={NEU_SUM.x} y={NEU_SUM.y + 22} textAnchor="middle" style={{ fontFamily: serif, fontSize: 68 }} fill={ink.text}>
        Σ
      </text>
      <text x={NEU_SUM.x} y={NEU_SUM.y + NEU_SUM.r + 34} textAnchor="middle" style={{ fontFamily: mono, fontSize: 24, fontWeight: 600 }} fill={ink.accent}>
        + b
      </text>
      <Arrow x1={NEU_SUM.x + NEU_SUM.r + 4} y1={160} x2={506} y2={160} head={12} color={ink.soft} />
      <text x={590} y={86} textAnchor="middle" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
        activation
      </text>
      <rect x={510} y={100} width={160} height={120} rx={12} fill={ink.card} stroke={ink.soft} strokeWidth={2.5} />
      <line x1={526} y1={196} x2={654} y2={196} stroke={ink.faint} strokeWidth={2} />
      <path d="M 528 196 L 590 196 L 652 120" fill="none" stroke={ink.accent} strokeWidth={4} strokeLinejoin="round" />
      <Arrow x1={674} y1={160} x2={718} y2={160} head={12} color={ink.soft} />
      <text x={728} y={174} style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 46 }} fill={ink.accent}>
        ŷ
      </text>
    </svg>
    <div style={{ position: 'absolute', left: 140, top: 728, fontFamily: mono, fontSize: 28, color: ink.text }}>
      ŷ = f(w₁x₁ + w₂x₂ + w₃x₃ + b)
    </div>
    <div style={{ position: 'absolute', left: 140, top: 774, width: 760, fontSize: 24, lineHeight: 1.4, color: ink.muted }}>
      f = ReLU, max(0, z) : sans elle, tout resterait linéaire.
    </div>

    <svg width={820} height={390} className="ml-on1" style={{ position: 'absolute', left: 960, top: 372, overflow: 'visible' }}>
      {NET_EDGES.map((e, k) => (
        <line key={k} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={ink.rule} strokeWidth={1.5} />
      ))}
      {NET_EDGES.map((e, k) => (
        <line
          key={`f${k}`}
          x1={e.x1}
          y1={e.y1}
          x2={e.x2}
          y2={e.y2}
          pathLength={1}
          stroke={ink.accent}
          strokeWidth={9}
          strokeLinecap="round"
          strokeDasharray="0.001 2"
          strokeDashoffset={0}
          className="ml-flow"
          style={vars({ p: `${e.l * 530}ms` })}
        />
      ))}
      <NetLayer l={0} />
      <NetLayer l={1} />
      <NetLayer l={2} />
      <NetLayer l={3} />
      <NetLabel x={NET_X[0]}>entrée</NetLabel>
      <NetLabel x={(NET_X[1] + NET_X[2]) / 2}>couches cachées</NetLabel>
      <NetLabel x={NET_X[3]}>sortie</NetLabel>
    </svg>
    <Label x={960} y={782} c={ink.accent} className="ml-fade2">
      → passe avant : prédire · ← rétropropagation : corriger
    </Label>

    <div className="ml-on3" style={{ position: 'absolute', left: 140, top: 852, width: 760, fontSize: 28, lineHeight: 1.45 }}>
      Couche après couche, des motifs de plus en plus abstraits : <Hl>bords → formes → objets</Hl>.
    </div>
    <div
      className="ml-on3"
      style={{ ...vars({ d: '150ms' }), position: 'absolute', left: 960, top: 852, width: 820, fontSize: 28, lineHeight: 1.45 }}
    >
      « Deep learning » = beaucoup de couches. Un LLM en est un, avec des <Hl>milliards de poids</Hl>.
    </div>
  </Frame>
);

// ═══ 20 · Sans étiquettes : k-means ══════════════════════════════════════════
type Pt = [number, number];
const kmRand = rng(8);
const KM_TRUE: Pt[] = [
  [25, 68],
  [72, 74],
  [55, 24],
];
const KM_P: Pt[] = KM_TRUE.flatMap(([cx, cy]) =>
  Array.from({ length: 16 }, () => [cx + gauss(kmRand) * 8, cy + gauss(kmRand) * 8] as Pt),
);
const KM_INIT: Pt[] = [
  [12, 30],
  [40, 52],
  [92, 40],
];
const kmAssign = (cs: Pt[]) =>
  KM_P.map((p) => cs.reduce((b, c, i) => (Math.hypot(p[0] - c[0], p[1] - c[1]) < Math.hypot(p[0] - cs[b][0], p[1] - cs[b][1]) ? i : b), 0));
// Lloyd's algorithm: alternate "assign to nearest centre" and "move centre to the mean".
const KM = (() => {
  const first = kmAssign(KM_INIT);
  let cs = KM_INIT;
  let a = first;
  let iters = 0;
  for (; iters < 50; ) {
    iters++;
    cs = cs.map((c, i) => {
      const g = KM_P.filter((_, k) => a[k] === i);
      return g.length ? ([mean(g.map((p) => p[0])), mean(g.map((p) => p[1]))] as Pt) : c;
    });
    const next = kmAssign(cs);
    if (next.every((v, k) => v === a[k])) break;
    a = next;
  }
  return { first, last: a, centres: cs, iters };
})();

const KX = lin(0, 100, 30, 870);
const KY = lin(0, 100, 450, 20);
const KM_COL = [tone.peach, tone.sky, tone.mint];

CSS.push(`
.ml-km .ml-kp{fill:${ink.faint};transition:fill 600ms ${EASE} var(--d,0ms)}
${at('km', 2)} .ml-kp{fill:var(--f1)}
${at('km', 3)} .ml-kp{fill:var(--f2);transition-delay:calc(var(--d,0ms) + 600ms)}
.ml-km .ml-kc{opacity:0;transform:translate(var(--x0),var(--y0));transition:opacity 500ms ${EASE},transform 1400ms ${EASE}}
${at('km', 1)} .ml-kc{opacity:1}
${at('km', 3)} .ml-kc{transform:translate(var(--x1),var(--y1))}
.ml-km .ml-km-step{opacity:.35;transition:opacity 500ms ${EASE}}
${at('km', 1)} .ml-km-s1,${at('km', 2)} .ml-km-s2,${at('km', 3)} .ml-km-s3,${at('km', 3)} .ml-km-s4{opacity:1}
`);

const KmCentre = ({ i }: { i: number }) => (
  <g>
    <path
      d={`M ${KX(KM_INIT[i][0])} ${KY(KM_INIT[i][1])} L ${KX(KM.centres[i][0])} ${KY(KM.centres[i][1])}`}
      pathLength={1}
      fill="none"
      stroke={KM_COL[i].fg}
      strokeWidth={2.5}
      className="ml-draw3"
      style={vars({ d: '200ms' })}
    />
    <g
      className="ml-kc"
      style={vars({
        x0: `${KX(KM_INIT[i][0]).toFixed(1)}px`,
        y0: `${KY(KM_INIT[i][1]).toFixed(1)}px`,
        x1: `${KX(KM.centres[i][0]).toFixed(1)}px`,
        y1: `${KY(KM.centres[i][1]).toFixed(1)}px`,
      })}
    >
      <circle cx={0} cy={0} r={19} fill={ink.card} stroke={KM_COL[i].fg} strokeWidth={4} />
      <path d="M -9 0 H 9 M 0 -9 V 9" stroke={KM_COL[i].fg} strokeWidth={4} strokeLinecap="round" />
    </g>
  </g>
);

const KmStep = ({ k, y, title, children }: { k: number; y: number; title: string; children: ReactNode }) => (
  <div className={`ml-km-step ml-km-s${k}`} style={{ position: 'absolute', left: 1140, top: y, width: 640, display: 'flex', gap: 22 }}>
    <span
      style={{
        flex: 'none',
        width: 46,
        height: 46,
        borderRadius: 999,
        boxSizing: 'border-box',
        border: '2px solid var(--osd-accent)',
        color: 'var(--osd-accent)',
        fontFamily: mono,
        fontSize: 22,
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
      }}
    >
      {k}
    </span>
    <div>
      <div style={{ fontFamily: serif, fontSize: 32, fontWeight: 500, lineHeight: 1.2 }}>{title}</div>
      <div style={{ fontSize: 26, lineHeight: 1.4, color: ink.soft, marginTop: 4 }}>{children}</div>
    </div>
  </div>
);

const KMeans: Page = () => (
  <Frame id="km" eyebrow="06 · Au-delà" stage={6} beats={3}>
    <Title>Sans étiquettes : regrouper avec k-means</Title>
    <Lede>
      Aucune bonne réponse fournie : l'algorithme cherche seul une <Hl>structure</Hl>, ici k groupes de
      points proches.
    </Lede>

    <svg width={900} height={470} style={{ position: 'absolute', left: 140, top: 392, overflow: 'visible' }}>
      <rect x={0} y={0} width={900} height={470} rx={16} fill={ink.card} stroke={ink.rule} strokeWidth={1.5} />
      {KM_P.map((p, i) => (
        <circle
          key={i}
          cx={KX(p[0])}
          cy={KY(p[1])}
          r={10}
          stroke={ink.card}
          strokeWidth={3}
          className="ml-kp"
          style={vars({ d: `${(i % 16) * 25}ms`, f1: KM_COL[KM.first[i]].bd, f2: KM_COL[KM.last[i]].bd })}
        />
      ))}
      <KmCentre i={0} />
      <KmCentre i={1} />
      <KmCentre i={2} />
    </svg>
    <Fig n={7} style={{ left: 140, top: 884, width: 900 }}>
      Usages : segmenter des clients, compresser une image, repérer l'inhabituel.
    </Fig>

    <KmStep k={1} y={400} title="Placer k centres">
      au hasard (ici k = 3)
    </KmStep>
    <KmStep k={2} y={508} title="Affecter">
      chaque point au centre le plus proche
    </KmStep>
    <KmStep k={3} y={616} title="Recentrer">
      chaque centre au milieu de son groupe
    </KmStep>
    <KmStep k={4} y={724} title="Répéter">
      jusqu'à ce que plus rien ne bouge
    </KmStep>
    <Label x={1140} y={840} c={ink.accent} className="ml-on3" style={{ ...vars({ d: '1400ms' }), fontSize: 24 }}>
      convergé en {KM.iters} itérations · 3 × {KM.last.filter((v) => v === 0).length} points
    </Label>
  </Frame>
);

// ═══ 21 · Les limites ════════════════════════════════════════════════════════
const LimitCard = ({
  x,
  cls,
  title,
  glyph,
  children,
}: {
  x: number;
  cls?: string;
  title: string;
  glyph: ReactNode;
  children: ReactNode;
}) => (
  <Card x={x} h={500} cls={cls}>
    <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{glyph}</div>
    <div style={{ marginTop: 24 }}>
      <CardTitle>{title}</CardTitle>
    </div>
    <CardText>{children}</CardText>
  </Card>
);

const BiasRow = ({ label, w, c, share }: { label: string; w: number; c: Tone; share: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 40 }}>
    <span style={{ width: 120, fontFamily: mono, fontSize: 22, color: ink.muted }}>{label}</span>
    <span style={{ width: w, height: 22, borderRadius: 5, background: tone[c].bd }} />
    <span style={{ fontFamily: mono, fontSize: 22, color: ink.soft }}>{share}</span>
  </div>
);

const GlyphBias = () => (
  <div style={{ width: 440 }}>
    <div style={{ fontFamily: mono, fontSize: 22, color: ink.muted, marginBottom: 6 }}>données d'entraînement</div>
    <BiasRow label="groupe A" w={220} c="mint" share="85 %" />
    <BiasRow label="groupe B" w={40} c="peach" share="15 %" />
    <div style={{ marginTop: 4, fontFamily: mono, fontSize: 22, fontWeight: 500, color: tone.rose.fg }}>
      ✗ taux d'erreur sur B : × 3
    </div>
  </div>
);

const wave = (x0: number, y0: number, amp: number, seed: number) => {
  const r = rng(seed);
  return poly(Array.from({ length: 13 }, (_, k) => [x0 + k * 26, y0 - k * 4 + Math.sin(k * 1.3) * amp + (r() - 0.5) * 6] as Pt));
};

const GlyphCorrelation = () => (
  <svg width={440} height={150} style={{ overflow: 'visible' }}>
    <text x={0} y={34} style={{ fontSize: 36 }} fill={tone.butter.bd}>
      ☀
    </text>
    <text x={44} y={30} style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
      cause commune : l'été
    </text>
    <path d={wave(0, 136, 9, 2)} fill="none" stroke={tone.sky.fg} strokeWidth={3.5} strokeLinejoin="round" />
    <path d={wave(0, 100, 9, 9)} fill="none" stroke={tone.peach.fg} strokeWidth={3.5} strokeLinejoin="round" />
    <text x={326} y={50} style={{ fontFamily: mono, fontSize: 22 }} fill={tone.peach.fg}>
      coups de
    </text>
    <text x={326} y={72} style={{ fontFamily: mono, fontSize: 22 }} fill={tone.peach.fg}>
      soleil
    </text>
    <text x={326} y={100} style={{ fontFamily: mono, fontSize: 22 }} fill={tone.sky.fg}>
      glaces
    </text>
  </svg>
);

const bell = (cx: number, h: number) =>
  poly(Array.from({ length: 41 }, (_, k) => {
    const x = cx - 100 + k * 5;
    return [x, 140 - h * Math.exp(-(((x - cx) / 38) ** 2))] as Pt;
  }));

const GlyphDrift = () => (
  <svg width={440} height={150} style={{ overflow: 'visible' }}>
    <line x1={0} y1={140} x2={440} y2={140} stroke={ink.rule} strokeWidth={2} />
    <path d={bell(120, 96)} fill={ink.panel} stroke={ink.faint} strokeWidth={3} />
    <path d={bell(320, 96)} fill="none" stroke={ink.accent} strokeWidth={3.5} />
    <text x={120} y={28} textAnchor="middle" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
      entraînement
    </text>
    <text x={320} y={28} textAnchor="middle" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.accent}>
      aujourd'hui
    </text>
    <Arrow x1={164} y1={66} x2={276} y2={66} head={12} color={ink.accent} />
  </svg>
);

const Limits: Page = () => (
  <Frame id="limits" eyebrow="Conclusion" stage={7} beats={2}>
    <Title>Ce que le machine learning ne fait pas</Title>
    <Lede>Un modèle ne sait que ce que ses données lui ont montré. Trois pièges classiques.</Lede>
    <LimitCard x={140} title="Des biais hérités" glyph={<GlyphBias />}>
      Il reproduit les régularités de ses données, y compris leurs injustices et leurs angles morts.
    </LimitCard>
    <LimitCard x={700} cls="ml-on1" title="Corrélation ≠ causalité" glyph={<GlyphCorrelation />}>
      Il exploite ce qui va ensemble, pas ce qui cause : un raccourci peut casser hors de son terrain.
    </LimitCard>
    <LimitCard x={1260} cls="ml-on2" title="Un monde qui bouge" glyph={<GlyphDrift />}>
      Quand les données réelles dérivent, la performance baisse : il faut surveiller et réentraîner.
    </LimitCard>
  </Frame>
);

// ═══ 22 · Conclusion ═════════════════════════════════════════════════════════
CSS.push(`
@keyframes ml-recap{0%,24%,100%{transform:none}8%{transform:translateY(-8px)}}
.ml-end.ml-live .ml-recap{animation:ml-recap 3.6s ${EASE} var(--p,0ms) infinite}
`);

const RecapChip = ({ c, k, children }: { c: Tone; k: number; children: ReactNode }) => (
  <span className="ml-in" style={vars({ d: `${700 + k * 110}ms` })}>
    <span
      className="ml-recap"
      style={{
        ...vars({ p: `${2000 + k * 450}ms` }),
        display: 'inline-block',
        padding: '12px 18px',
        borderRadius: 12,
        background: tone[c].bg,
        boxShadow: `inset 0 0 0 2px ${tone[c].bd}`,
        fontSize: 26,
        fontWeight: 500,
        color: tone[c].fg,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  </span>
);

const Sep = ({ k }: { k: number }) => (
  <span className="ml-in-fade" style={{ ...vars({ d: `${760 + k * 110}ms` }), fontSize: 30, color: ink.faint }}>
    →
  </span>
);

const Closing: Page = () => (
  <Frame id="end" eyebrow="Conclusion" stage={7}>
    <p
      className="ml-in"
      style={{
        position: 'absolute',
        left: 140,
        top: 180,
        width: 1600,
        margin: 0,
        fontFamily: serif,
        fontSize: 60,
        fontWeight: 400,
        lineHeight: 1.28,
        letterSpacing: '-0.01em',
      }}
    >
      Apprendre, pour une machine, c'est <Hl>ajuster les paramètres d'une fonction</Hl> pour réduire son
      erreur sur des exemples — puis vérifier qu'elle tient sur des données neuves.
    </p>
    <div
      style={{
        position: 'absolute',
        left: 140,
        width: 1640,
        top: 520,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
      }}
    >
      <RecapChip c="peach" k={0}>Données</RecapChip>
      <Sep k={0} />
      <RecapChip c="mint" k={1}>Modèle</RecapChip>
      <Sep k={1} />
      <RecapChip c="lav" k={2}>Erreur</RecapChip>
      <Sep k={2} />
      <RecapChip c="sky" k={3}>Gradient</RecapChip>
      <span className="ml-in-fade" style={{ ...vars({ d: '1100ms' }), fontSize: 40, color: ink.accent }}>
        ↺
      </span>
      <Sep k={3} />
      <RecapChip c="butter" k={4}>Généralisation</RecapChip>
      <Sep k={4} />
      <RecapChip c="accent" k={5}>Prédiction</RecapChip>
    </div>
    <div
      className="ml-in"
      style={{
        ...vars({ d: '1300ms' }),
        position: 'absolute',
        left: 140,
        top: 680,
        fontFamily: serif,
        fontSize: 120,
        fontWeight: 500,
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
      }}
    >
      Merci<span style={{ color: 'var(--osd-accent)' }}>.</span>
    </div>
    <div
      className="ml-in"
      style={{ ...vars({ d: '1450ms' }), position: 'absolute', left: 146, top: 830, fontSize: 40, color: ink.soft }}
    >
      Des questions ?
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

const STYLE_ID = 'osd-styles-ml-explique';
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
  title: 'Comment une machine apprend',
  createdAt: '2026-10-04T10:30:14.704Z',
};

export const notes: (string | undefined)[] = [
  `Ouverture. Laisser l'animation se jouer : les logements apparaissent, la droite se trace, puis la prédiction pour 130 m².
Message : tout ce qu'on va voir sert à produire ce dernier point, une prédiction sur un cas jamais vu.`,
  `On part de ce que tout ingénieur connaît : écrire des règles.
Clic 1 : le machine learning inverse le schéma — on fournit données ET réponses, il en sort les règles, c'est-à-dire le modèle.
Clic 2 : l'exemple du spam. Les règles à la main sont fragiles ; un modèle appris se réentraîne.
Clic 3 : quand l'utiliser — règles trop nombreuses, floues ou changeantes.`,
  `Trois familles selon ce qu'on donne à l'algorithme.
Supervisé : des paires (x, y) — c'est le cœur de la présentation.
Clic 1 : non supervisé, pas de réponse, on cherche une structure (on y reviendra avec k-means).
Clic 2 : renforcement, des récompenses ; c'est aussi ce qui sert à régler les assistants (RLHF).`,
  `Le plan. 6 clics : chaque étape apparaît avec sa flèche.
Au dernier clic, la boucle : prédire, mesurer l'erreur, corriger — répété des milliers de fois. C'est ça, « entraîner ».
Annoncer le fil rouge : le loyer d'un appartement selon sa surface.`,
  `Vocabulaire de base. Une ligne = un exemple, une colonne = une caractéristique.
Clic 1 : les features, notées x. Clic 2 : l'étiquette y, ce qu'on veut prédire.
Clic 3 : ordres de grandeur, et insister sur la qualité des données — « garbage in, garbage out ».`,
  `Tout doit devenir nombre.
Catégories : one-hot, une colonne par valeur — sinon le modèle croirait que Sud = 2 × Nord.
Clic 1 : images, chaque pixel est une intensité. Clic 2 : mise à l'échelle, pour qu'aucune colonne n'écrase les autres (et pour que la descente de gradient converge mieux).`,
  `Le modèle le plus simple : une droite, deux paramètres.
État initial : w = 4, trop plate. Clic 1 : w = 22, trop pentue. Clic 2 : la meilleure droite, w ≈ 12,2 €/m² et b ≈ 225 €.
Clic 3 : apprendre, c'est trouver ces valeurs automatiquement. Un grand réseau fait la même chose avec des milliards de paramètres.`,
  `Même idée pour une réponse oui/non : deux features par e-mail (liens, % de majuscules).
Clic 1 : la frontière, là où z = 0. Clic 2 : la sigmoïde transforme z en probabilité ; les e-mails d'entraînement se rangent en haut (spam) ou en bas.
Clic 3 : un nouvel e-mail, p ≈ 0,87, au-dessus du seuil 0,5 → spam. C'est la régression logistique.`,
  `Comment savoir si une droite est mauvaise ? On mesure.
Clic 1 : les résidus, prédiction moins réalité. Clic 2 : on les met au carré — littéralement, les carrés dessinés — et on fait la moyenne : c'est la MSE. Sa racine (≈ 256 €) se lit en euros.
Clic 3 : pourquoi le carré. Mentionner l'entropie croisée pour la classification.`,
  `Chaque réglage a une erreur : on obtient une courbe, et avec deux paramètres une cuvette.
Clic 1 : les trois droites de tout à l'heure sur la courbe ; la meilleure est au fond.
Clic 2 : vue de dessus, en courbes de niveau. Clic 3 : en grande dimension on ne voit plus rien, mais on peut calculer la pente.`,
  `La balle part de w = 1.
Clic 1 : la tangente, la pente est négative : il faut augmenter w.
Clic 2 : la balle fait cinq pas ; chacun est proportionnel à la pente, donc les pas raccourcissent près du fond.
Clic 3 : la même règle pour tous les paramètres à la fois ; la rétropropagation calcule le gradient efficacement.`,
  `η est un hyperparamètre : on le choisit, il n'est pas appris.
Trop petit : lent. Clic 1 : bien choisi, on converge. Clic 2 : trop grand, on rebondit de plus en plus haut et l'entraînement diverge.
Citer Adam, qui adapte le pas à chaque paramètre.`,
  `En pratique on ne calcule pas le gradient sur tout le jeu de données.
Clic 1 : on le découpe en mini-lots ; chaque lot donne un pas. Tous les lots = une époque.
Clic 2 : la courbe est bruitée, mais on avance bien plus vite pour le même temps de calcul.
Clic 3 : le vocabulaire — lot, itération, époque.`,
  `Le point le plus important de la présentation : réussir sur l'entraînement ne prouve rien.
Clic 1 : on découpe en trois. Clic 2 : le rôle de chaque morceau ; la validation croisée quand on a peu de données.
Clic 3 : l'analogie de l'examen. Le test ne sert qu'une fois, sinon on triche sans le savoir.`,
  `Mêmes points, trois modèles. Points pleins : entraînement ; ronds vides : test.
La droite rate la tendance : erreur partout.
Clic 1 : degré 3, erreurs faibles des deux côtés. Clic 2 : degré 9 passe par tous les points (erreur d'entraînement nulle) mais s'envole entre eux : erreur de test énorme. C'est le sur-apprentissage.`,
  `On suit l'erreur d'entraînement, qui baisse toujours.
Clic 1 : l'erreur de validation baisse… puis remonte. Clic 2 : on s'arrête au minimum, c'est l'arrêt précoce ; à droite, le modèle mémorise.
Clic 3 : les remèdes classiques, dont la régularisation L2 et le dropout.`,
  `Le piège de l'exactitude quand les classes sont déséquilibrées.
Clic 1 : exactitude 97,7 %, mais elle est dominée par les 935 vrais négatifs.
Clic 2 : précision, 74 % — un quart des alertes sont fausses. Clic 3 : rappel, 84 % — on rate 8 spams sur 50.
Le bon compromis dépend du coût de chaque type d'erreur (fraude, médical…).`,
  `Même problème que la régression logistique, autre modèle.
Clic 1 : première question, sur les liens. Clic 2 : à droite, une question sur les majuscules. Clic 3 : à gauche, une autre ; la frontière devient un escalier, avec 3 erreurs.
Clic 4 : en combinant des centaines d'arbres (forêts aléatoires, gradient boosting), on obtient souvent le meilleur modèle sur des données tabulaires.`,
  `Un neurone = une régression logistique : somme pondérée, biais, activation.
La non-linéarité est essentielle : sans elle, empiler des couches reste une simple droite.
Clic 1 : on empile des couches. Clic 2 : la passe avant pour prédire, la rétropropagation pour corriger — c'est la descente de gradient de tout à l'heure.
Clic 3 : abstraction croissante ; et un LLM n'est qu'un très grand réseau de ce type.`,
  `Apprentissage non supervisé : aucun label, les points sont gris.
Clic 1 : trois centres placés au hasard. Clic 2 : chaque point prend la couleur du centre le plus proche — au départ, c'est très déséquilibré.
Clic 3 : les centres se déplacent au milieu de leur groupe, on recommence ; ici ça converge en quelques itérations sur trois groupes de 16.`,
  `Trois limites qui découlent directement du mécanisme.
Les biais : le modèle apprend ce qu'on lui montre, y compris les injustices.
Clic 1 : corrélation n'est pas causalité. Clic 2 : la dérive des données ; un modèle en production se surveille.`,
  `Résumé en une phrase, puis les six étapes, avec la boucle d'entraînement. Remercier et ouvrir les questions.`,
];

export default [
  Cover,
  Idea,
  Kinds,
  Recipe,
  DataTable,
  Encode,
  Model,
  Classify,
  Loss,
  Landscape,
  Gradient,
  LearningRate,
  Sgd,
  Split,
  Fitting,
  Curves,
  Metrics,
  Tree,
  Neural,
  KMeans,
  Limits,
  Closing,
] satisfies Page[];
