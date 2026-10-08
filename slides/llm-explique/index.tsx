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
import { type CSSProperties, type ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
const FONT_LINK_ID = 'osd-webfont-llm-explique';
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

// French number formatting: decimal comma, real minus sign.
const fr = (x: number, digits = 2) => x.toFixed(digits).replace('.', ',').replace('-', '−');
const pct = (p: number) => (p < 0.005 ? '< 1 %' : `${Math.round(p * 100)} %`);

const softmax = (z: number[], t = 1) => {
  const s = z.map((v) => v / t);
  const m = Math.max(...s);
  const e = s.map((v) => Math.exp(v - m));
  const sum = e.reduce((a, b) => a + b, 0);
  return e.map((v) => v / sum);
};

// Deterministic pseudo-random generator (same picture on every render).
const rng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

// Diverging color for vector components: orange = positive, blue = negative.
const divColor = (v: number) => {
  const a = 0.12 + 0.78 * Math.min(1, Math.abs(v));
  return v >= 0 ? `rgba(224, 122, 79, ${a.toFixed(3)})` : `rgba(79, 127, 196, ${a.toFixed(3)})`;
};

// Token boxes laid out on a row (monospace → width is deterministic).
type Slot = { x: number; w: number; cx: number };
const layoutRow = (labels: string[], size: number, pad: number, gap: number, x0: number): Slot[] => {
  let x = x0;
  return labels.map((l) => {
    const w = Math.round(l.length * size * 0.6 + pad * 2);
    const slot = { x, w, cx: x + w / 2 };
    x += w + gap;
    return slot;
  });
};

// Cubic arc above (h > 0) or below (h < 0) a baseline, between two x positions.
const arc = (x1: number, x2: number, y: number, h: number) =>
  `M ${x1} ${y} C ${x1} ${y - h}, ${x2} ${y - h}, ${x2} ${y}`;

// ─── Stylesheet (collected from every page, injected once at the bottom) ────
const CSS: string[] = [];

// `at(page, n)` matches a page once its n-th click ("beat") has been revealed.
const at = (page: string, n: number) =>
  `.llm-${page}:has([data-osd-step="revealed"] > .llm-k${n})`;
const liveAt = (page: string, n: number) =>
  `.llm-${page}.llm-live:has([data-osd-step="revealed"] > .llm-k${n})`;

CSS.push(`
@keyframes llm-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes llm-fade{from{opacity:0}to{opacity:1}}
@keyframes llm-grow-x{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes llm-grow-y{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes llm-draw{from{stroke-dashoffset:1.01}to{stroke-dashoffset:0}}
@keyframes llm-pop{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}
@keyframes llm-blink{0%,49%{opacity:1}50%,100%{opacity:0}}
@keyframes llm-march{to{stroke-dashoffset:-20}}
@keyframes llm-settle{from{opacity:0;transform:translate(var(--dx),var(--dy))}to{opacity:1;transform:none}}
.llm-live .llm-in{animation:llm-rise 800ms ${EASE} var(--d,0ms) both}
.llm-live .llm-in-fade{animation:llm-fade 900ms ${EASE} var(--d,0ms) both}
.llm-live .llm-in-grow{animation:llm-grow-x 1000ms ${EASE} var(--d,0ms) both}
.llm-live .llm-in-grow-y{animation:llm-grow-y 1000ms ${EASE} var(--d,0ms) both}
.llm-live .llm-in-pop{animation:llm-pop 700ms ${EASE} var(--d,0ms) both}
.llm-live .llm-in-settle{animation:llm-settle 1400ms ${EASE} var(--d,0ms) both}
.llm-in-draw{stroke-dasharray:1 2}
.llm-live .llm-in-draw{animation:llm-draw 1400ms ${EASE} var(--d,0ms) both}
.llm-live .llm-blink{animation:llm-blink 1.1s linear infinite}
.llm-live .llm-march{animation:llm-march 1s linear infinite}
`);

// Beat utilities: visible from beat n (on / fade), hidden from beat n (off),
// stroke drawn at beat n (draw — path needs pathLength={1}), dimmed at beat n.
for (let n = 1; n <= 8; n++) {
  const has = `.llm-page:has([data-osd-step="revealed"] > .llm-k${n})`;
  CSS.push(`
.llm-on${n}{opacity:0;transform:translateY(14px);transition:opacity 500ms ${EASE} var(--d,0ms),transform 700ms ${EASE} var(--d,0ms)}
${has} .llm-on${n}{opacity:1;transform:none}
.llm-fade${n}{opacity:0;transition:opacity 550ms ${EASE} var(--d,0ms)}
${has} .llm-fade${n}{opacity:1}
.llm-off${n}{transition:opacity 380ms ${EASE} var(--d,0ms)}
${has} .llm-off${n}{opacity:0}
.llm-draw${n}{stroke-dasharray:1 2;stroke-dashoffset:1.01;transition:stroke-dashoffset 1000ms ${EASE} var(--d,0ms)}
${has} .llm-draw${n}{stroke-dashoffset:0}
.llm-dim${n}{transition:opacity 500ms ${EASE}}
${has} .llm-dim${n}{opacity:.22}
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
          <i className={`llm-k${i + 1}`} />
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
      <span style={{ fontFamily: serif, fontStyle: 'italic' }}>Comment fonctionne un LLM</span>
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
      className={`llm-page llm-${id}${live ? ' llm-live' : ''}`}
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

// Inline token chip.
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

// Absolutely positioned token box (geometry from layoutRow).
const TokBox = ({
  s,
  y,
  h,
  size,
  t = 'paper',
  className,
  style,
  children,
}: {
  s: Slot;
  y: number;
  h: number;
  size: number;
  t?: Tone;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) => (
  <div
    className={className}
    style={{
      position: 'absolute',
      left: s.x,
      top: y,
      width: s.w,
      height: h,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: mono,
      fontSize: size,
      lineHeight: 1,
      whiteSpace: 'pre',
      color: ink.text,
      background: tone[t].bg,
      boxShadow: `inset 0 0 0 2px ${tone[t].bd}`,
      borderRadius: 10,
      ...style,
    }}
  >
    {children}
  </div>
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
        className={n ? `llm-draw${n}` : undefined}
        style={vars({ d: `${d}ms` })}
      />
      <polygon
        points={pts}
        fill={color}
        className={n ? `llm-fade${n}` : undefined}
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

// Shared next-token example ("Le chat dort sur le …") used on several pages.
const NEXT = ['canapé', 'lit', 'tapis', 'toit', 'rebord', 'piano'];
const NEXT_LOGITS = [3.1, 2.5, 2.0, 1.6, 1.2, 0.3];
const NEXT_P = softmax(NEXT_LOGITS);

// ═══ 1 · Cover ═══════════════════════════════════════════════════════════════
const COVER = layoutRow(['Le', 'chat', 'dort', 'sur', 'le', 'canapé'], 40, 16, 14, 140);
const COVER_Y = 800;
const AUTHOR = 'Houssem Eddine Lassoued';
const AUTHOR_LINKEDIN = 'https://www.linkedin.com/in/houssemeddinelassoued';

// Author portrait: circular crop, card-style ring, accent arc echoing the cover arcs.
const PORTRAIT = 150;
const RING_PAD = 16;
const RING_R = 88;
const RING_C = PORTRAIT / 2 + RING_PAD;
const polar = (deg: number) => {
  const a = (deg * Math.PI) / 180;
  return `${(RING_C + RING_R * Math.cos(a)).toFixed(1)} ${(RING_C + RING_R * Math.sin(a)).toFixed(1)}`;
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
        className="llm-in-draw"
        fill="none"
        stroke={ink.accent}
        strokeWidth={3}
        strokeLinecap="round"
        style={vars({ d: '900ms' })}
      />
    </svg>
  </div>
);

const CoverArc = ({ to, h, w, d }: { to: number; h: number; w: number; d: number }) => (
  <path
    d={arc(COVER[5].cx, COVER[to].cx, COVER_Y, h)}
    pathLength={1}
    className="llm-in-draw"
    fill="none"
    stroke={ink.accent}
    strokeWidth={w}
    strokeLinecap="round"
    opacity={0.8}
    style={vars({ d: `${d}ms` })}
  />
);

const Cover: Page = () => (
  <Frame id="cover" footer={false}>
    <div
      className="llm-in"
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
      className="llm-in"
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
      Comment fonctionne
      <br />
      un <em style={{ color: 'var(--osd-accent)' }}>LLM</em>
    </h1>
    <p
      className="llm-in"
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
      Du texte au prochain token : tokens, vecteurs, attention et entraînement, expliqués pas à pas.
    </p>
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <CoverArc to={1} h={130} w={4.5} d={2000} />
      <CoverArc to={2} h={100} w={3} d={2150} />
      <CoverArc to={3} h={70} w={2} d={2300} />
    </svg>
    <TokBox s={COVER[0]} y={COVER_Y} h={70} size={40} t="peach" className="llm-in" style={vars({ d: '500ms' })}>
      Le
    </TokBox>
    <TokBox s={COVER[1]} y={COVER_Y} h={70} size={40} t="mint" className="llm-in" style={vars({ d: '620ms' })}>
      chat
    </TokBox>
    <TokBox s={COVER[2]} y={COVER_Y} h={70} size={40} t="lav" className="llm-in" style={vars({ d: '740ms' })}>
      dort
    </TokBox>
    <TokBox s={COVER[3]} y={COVER_Y} h={70} size={40} t="sky" className="llm-in" style={vars({ d: '860ms' })}>
      sur
    </TokBox>
    <TokBox s={COVER[4]} y={COVER_Y} h={70} size={40} t="butter" className="llm-in" style={vars({ d: '980ms' })}>
      le
    </TokBox>
    <TokBox
      s={COVER[5]}
      y={COVER_Y}
      h={70}
      size={40}
      t="accent"
      className="llm-in-pop"
      style={{ ...vars({ d: '1500ms' }), color: ink.accent, fontWeight: 500 }}
    >
      canapé
    </TokBox>
    <div
      className="llm-blink"
      style={{
        position: 'absolute',
        left: COVER[5].x + COVER[5].w + 14,
        top: COVER_Y + 11,
        width: 4,
        height: 48,
        background: ink.text,
      }}
    />
    <div
      className="llm-in-fade"
      style={{
        ...vars({ d: '1900ms' }),
        position: 'absolute',
        left: COVER[5].x + COVER[5].w + 46,
        top: COVER_Y + 20,
        fontFamily: mono,
        fontSize: 26,
        color: ink.accent,
      }}
    >
      p(canapé) = {fr(NEXT_P[0])}
    </div>
    <Fig n={0} style={{ left: 140, top: 905 }}>
      Un modèle de langage complète un texte, un token à la fois, en regardant ce qui précède.
    </Fig>
    <div
      className="llm-in-fade"
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

// ═══ 2 · L'idée centrale ═════════════════════════════════════════════════════
CSS.push(`
.llm-idea .llm-idea-top{transition:background-color 600ms ${EASE}}
${at('idea', 1)} .llm-idea-top{background-color:${ink.accent} !important}
${at('idea', 1)} .llm-idea-top-label{color:${ink.accent} !important;font-weight:600}
`);

const IdeaBar = ({ label, p, i }: { label: string; p: number; i: number }) => (
  <div
    style={{
      position: 'absolute',
      left: 1180,
      top: 430 + i * 72,
      width: 600,
      height: 60,
      display: 'flex',
      alignItems: 'center',
      gap: 18,
    }}
  >
    <span
      className={i === 0 ? 'llm-idea-top-label' : undefined}
      style={{ width: 150, textAlign: 'right', fontFamily: mono, fontSize: 28, color: ink.text }}
    >
      {label}
    </span>
    <div style={{ width: 330, height: 40, position: 'relative' }}>
      <div
        className={`llm-in-grow${i === 0 ? ' llm-idea-top' : ''}`}
        style={{
          ...vars({ d: `${300 + i * 110}ms` }),
          position: 'absolute',
          left: 0,
          top: 0,
          height: 40,
          width: Math.round((p / 0.45) * 330),
          background: ink.soft,
          borderRadius: 6,
          transformOrigin: 'left center',
        }}
      />
    </div>
    <span style={{ width: 90, fontFamily: mono, fontSize: 26, color: ink.muted }}>{pct(p)}</span>
  </div>
);

const Idea: Page = () => (
  <Frame id="idea" eyebrow="Introduction" stage={0} beats={2}>
    <Title>Une seule tâche : prédire le token suivant</Title>
    <Lede>
      Raisonner, traduire, coder : tout <Hl>émerge de cette prédiction</Hl>, répétée à très grande
      échelle.
    </Lede>
    <div
      style={{
        position: 'absolute',
        left: 140,
        top: 450,
        display: 'flex',
        alignItems: 'baseline',
        gap: 22,
        fontFamily: serif,
        fontSize: 76,
        lineHeight: 1.1,
      }}
    >
      <span>Le chat dort sur le</span>
      <span
        style={{
          position: 'relative',
          display: 'inline-block',
          width: 270,
          height: 84,
          borderBottom: `4px dashed ${ink.faint}`,
          textAlign: 'center',
        }}
      >
        <span className="llm-off1" style={{ position: 'absolute', inset: 0, color: ink.faint }}>
          ?
        </span>
        <span
          className="llm-on1"
          style={{ position: 'absolute', inset: 0, color: ink.accent, fontStyle: 'italic' }}
        >
          canapé
        </span>
        <span
          className="llm-on1"
          style={{
            ...vars({ d: '200ms' }),
            position: 'absolute',
            top: 104,
            left: -40,
            right: -40,
            fontFamily: sans,
            fontSize: 24,
            lineHeight: 1.3,
            color: ink.accent,
          }}
        >
          ↑ le plus probable ({pct(NEXT_P[0])})
        </span>
      </span>
    </div>
    <div
      className="llm-on2"
      style={{
        position: 'absolute',
        left: 140,
        top: 680,
        width: 880,
        boxSizing: 'border-box',
        padding: '26px 32px',
        background: ink.panel,
        borderLeft: `5px solid ${ink.accent}`,
        borderRadius: '0 12px 12px 0',
        fontSize: 30,
        lineHeight: 1.45,
      }}
    >
      Ni base de faits, ni règles écrites à la main : seulement des{' '}
      <Hl>probabilités apprises</Hl> sur d'énormes quantités de texte.
    </div>
    <div
      style={{ position: 'absolute', left: 1180, top: 390, fontFamily: mono, fontSize: 22, color: ink.muted }}
    >
      P( token suivant | « Le chat dort sur le » )
    </div>
    <IdeaBar label={NEXT[0]} p={NEXT_P[0]} i={0} />
    <IdeaBar label={NEXT[1]} p={NEXT_P[1]} i={1} />
    <IdeaBar label={NEXT[2]} p={NEXT_P[2]} i={2} />
    <IdeaBar label={NEXT[3]} p={NEXT_P[3]} i={3} />
    <IdeaBar label={NEXT[4]} p={NEXT_P[4]} i={4} />
    <IdeaBar label={NEXT[5]} p={NEXT_P[5]} i={5} />
    <Fig n={1} style={{ left: 1180, top: 878, width: 600 }}>
      Distribution illustrative ; un vrai modèle note chaque token de son vocabulaire.
    </Fig>
  </Frame>
);

// ═══ 3 · Le pipeline ═════════════════════════════════════════════════════════
CSS.push(`
.llm-pipe .llm-pipe-flow{opacity:0;transition:opacity 600ms ${EASE}}
${at('pipe', 6)} .llm-pipe-flow{opacity:.9;transition-delay:900ms}
`);

const PIPE_X = (i: number) => 140 + i * 281;
const PIPE_LOOP = 'M 1663 748 V 790 Q 1663 812 1641 812 H 280 Q 258 812 258 790 V 766';

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

const pipeRand = rng(7);
const PIPE_VEC = Array.from({ length: 5 }, () => Array.from({ length: 6 }, () => pipeRand() * 2 - 1));

const MiniBar = ({ w, accent }: { w: number; accent?: boolean }) => (
  <div style={{ width: w, height: 16, borderRadius: 4, background: accent ? ink.accent : ink.soft }} />
);

const StackLayer = ({ dx, dy, o, children }: { dx: number; dy: number; o: number; children?: ReactNode }) => (
  <div
    style={{
      position: 'absolute',
      left: dx,
      top: dy,
      width: 140,
      height: 78,
      borderRadius: 10,
      background: tone.lav.bg,
      boxShadow: `inset 0 0 0 2px ${tone.lav.bd}`,
      opacity: o,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: mono,
      fontSize: 22,
      lineHeight: 1.2,
      color: tone.lav.fg,
    }}
  >
    {children}
  </div>
);

const Pipeline: Page = () => (
  <Frame id="pipe" eyebrow="Introduction" stage={0} beats={6}>
    <Title>Le voyage d'une phrase</Title>
    <Lede>Six étapes, que nous allons déplier une à une.</Lede>

    <StageCard i={0} title="Texte" sub="une chaîne de caractères">
      <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 30, lineHeight: 1.3, textAlign: 'center' }}>
        « Le chat dort sur le »
      </div>
    </StageCard>
    <StageCard i={1} title="Tokens" sub="des morceaux, puis des entiers" className="llm-on1">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
        <Chip t="peach" size={22}>Le</Chip>
        <Chip t="mint" size={22}>chat</Chip>
        <Chip t="lav" size={22}>dort</Chip>
        <Chip t="sky" size={22}>sur</Chip>
        <Chip t="butter" size={22}>le</Chip>
      </div>
    </StageCard>
    <StageCard i={2} title="Vecteurs" sub="un vecteur par token" className="llm-on2">
      <div style={{ display: 'flex', gap: 10 }}>
        {PIPE_VEC.map((col, c) => (
          <div key={c} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {col.map((v, r) => (
              <div key={r} style={{ width: 22, height: 16, borderRadius: 3, background: divColor(v) }} />
            ))}
          </div>
        ))}
      </div>
    </StageCard>
    <StageCard i={3} title="Transformer" sub="le contexte enrichit chaque vecteur" className="llm-on3">
      <div style={{ position: 'relative', width: 170, height: 110 }}>
        <StackLayer dx={30} dy={0} o={0.4} />
        <StackLayer dx={15} dy={14} o={0.7} />
        <StackLayer dx={0} dy={28} o={1}>
          <span>attention</span>
          <span>+ MLP</span>
        </StackLayer>
        <span
          style={{
            position: 'absolute',
            right: -6,
            top: -6,
            fontFamily: serif,
            fontSize: 30,
            fontStyle: 'italic',
            color: ink.accent,
          }}
        >
          ×N
        </span>
      </div>
    </StageCard>
    <StageCard i={4} title="Probabilités" sub="un score par token du vocabulaire" className="llm-on4">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 150 }}>
        <MiniBar w={140} accent />
        <MiniBar w={80} />
        <MiniBar w={48} />
        <MiniBar w={30} />
      </div>
    </StageCard>
    <StageCard i={5} title="Token suivant" sub="le texte s'allonge d'un token" className="llm-on5">
      <Chip t="accent" size={30} style={{ color: ink.accent, fontWeight: 500 }}>
        canapé
      </Chip>
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
        className="llm-draw6"
        fill="none"
        stroke={ink.accent}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <polygon
        points="258,748 249,766 267,766"
        fill={ink.accent}
        className="llm-fade6"
        style={vars({ d: '700ms' })}
      />
      <path
        d={PIPE_LOOP}
        className="llm-pipe-flow llm-march"
        fill="none"
        stroke={ink.accent}
        strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray="0 20"
      />
    </svg>
    <div
      className="llm-on6"
      style={{
        ...vars({ d: '450ms' }),
        position: 'absolute',
        left: 140,
        width: 1640,
        top: 830,
        textAlign: 'center',
        fontFamily: serif,
        fontStyle: 'italic',
        fontSize: 30,
        color: ink.soft,
      }}
    >
      … on ajoute le token à la phrase, et on recommence.
    </div>
  </Frame>
);

// ═══ 4 · Tokenisation ════════════════════════════════════════════════════════
CSS.push(`
.llm-tok .llm-ts{position:relative;display:inline-flex;align-items:center;padding:14px 0;margin:0;border-radius:10px;background-color:transparent;box-shadow:inset 0 0 0 2px transparent;transition:padding 650ms ${EASE} var(--d,0ms),margin 650ms ${EASE} var(--d,0ms),background-color 500ms ${EASE} var(--d,0ms),box-shadow 500ms ${EASE} var(--d,0ms)}
${at('tok', 1)} .llm-ts{padding:14px 12px;margin:0 4px;background-color:var(--bg);box-shadow:inset 0 0 0 2px var(--bd)}
.llm-tok .llm-sp{position:relative;display:inline-block;width:.6em;height:1em}
.llm-tok .llm-sp::before{content:'·';position:absolute;left:0;right:0;top:0;text-align:center;color:${ink.faint};opacity:0;transition:opacity 400ms}
${at('tok', 1)} .llm-sp::before{opacity:1}
`);

const TokSplit = ({ t, id, c, i, sp }: { t: string; id: number; c: Tone; i: number; sp?: boolean }) => (
  <span className="llm-ts" style={vars({ bg: tone[c].bg, bd: tone[c].bd, d: `${i * 40}ms` })}>
    {sp ? <span className="llm-sp" /> : null}
    {t}
    <span
      className="llm-fade2"
      style={{
        ...vars({ d: `${i * 50}ms` }),
        position: 'absolute',
        top: '100%',
        left: '50%',
        marginTop: 16,
        transform: 'translateX(-50%)',
        fontFamily: mono,
        fontSize: 22,
        color: tone[c].fg,
      }}
    >
      {id}
    </span>
  </span>
);

const Fact = ({ x, big, d, children }: { x: number; big: string; d: number; children: ReactNode }) => (
  <div
    className="llm-on3"
    style={{
      ...vars({ d: `${d}ms` }),
      position: 'absolute',
      left: x,
      top: 650,
      width: 520,
      boxSizing: 'border-box',
      padding: '26px 30px',
      background: ink.card,
      borderRadius: 16,
      boxShadow: `0 0 0 1.5px ${ink.rule}`,
    }}
  >
    <div style={{ fontFamily: serif, fontSize: 50, fontWeight: 500, lineHeight: 1.1, color: 'var(--osd-accent)' }}>
      {big}
    </div>
    <div style={{ fontSize: 28, lineHeight: 1.4, color: ink.soft, marginTop: 10 }}>{children}</div>
  </div>
);

const Tokens: Page = () => (
  <Frame id="tok" eyebrow="01 · Tokens" stage={1} beats={3}>
    <Title>D'abord, découper le texte en tokens</Title>
    <Lede>
      Le modèle ne lit ni lettres ni mots, mais des <Hl>morceaux fréquents</Hl> appris sur son corpus :
      les tokens.
    </Lede>
    <div
      style={{
        position: 'absolute',
        left: 140,
        width: 1640,
        top: 450,
        display: 'flex',
        justifyContent: 'center',
        fontFamily: mono,
        fontSize: 40,
        lineHeight: 1,
        whiteSpace: 'pre',
        color: ink.text,
      }}
    >
      <TokSplit t="Bon" id={33012} c="peach" i={0} />
      <TokSplit t="jour" id={4123} c="mint" i={1} />
      <TokSplit t="!" sp id={758} c="lav" i={2} />
      <TokSplit t="Les" sp id={11712} c="sky" i={3} />
      <TokSplit t="LL" sp id={9473} c="butter" i={4} />
      <TokSplit t="M" id={44} c="rose" i={5} />
      <TokSplit t="token" sp id={4037} c="sage" i={6} />
      <TokSplit t="isent" id={13187} c="peach" i={7} />
      <TokSplit t="l" sp id={326} c="mint" i={8} />
      <TokSplit t="'" id={6} c="lav" i={9} />
      <TokSplit t="in" id={258} c="sky" i={10} />
      <TokSplit t="imagin" id={47592} c="butter" i={11} />
      <TokSplit t="able" id={481} c="rose" i={12} />
      <TokSplit t="." id={13} c="sage" i={13} />
    </div>
    <Fact x={140} big="≈ 4 caractères" d={0}>
      par token en anglais ; le français en demande un peu plus
    </Fact>
    <Fact x={700} big="50 k → 200 k" d={120}>
      tokens dans le vocabulaire d'un modèle récent
    </Fact>
    <Fact x={1260} big="Des entiers" d={240}>
      c'est tout ce que le réseau reçoit en entrée
    </Fact>
    <Fig n={2} style={{ left: 140, top: 890 }}>
      Découpage illustratif de type BPE ; une couleur par token, identifiants fictifs.
    </Fig>
  </Frame>
);

// ═══ 5 · Embeddings ══════════════════════════════════════════════════════════
const EMB_CHAT = [0.12, -0.83, 0.47, 0.05, -0.31, 0.92, -0.14, 0.66, -0.52, 0.28, 0.09, -0.71];
const embRand = rng(42);
const embRow = () => Array.from({ length: 12 }, () => embRand() * 2 - 1);
const EMB_R = Array.from({ length: 7 }, embRow);
const EMB_Y = (r: number) => 440 + r * 46;

const EmbRow = ({ r, id, vals, hot }: { r: number; id: string; vals: number[]; hot?: boolean }) => (
  <div
    className={hot ? undefined : 'llm-dim1'}
    style={{ position: 'absolute', left: 470, top: EMB_Y(r), height: 40, display: 'flex', alignItems: 'center', gap: 4 }}
  >
    <span
      style={{
        width: 96,
        marginRight: 12,
        textAlign: 'right',
        fontFamily: mono,
        fontSize: 22,
        fontWeight: hot ? 600 : 400,
        color: hot ? ink.accent : ink.muted,
      }}
    >
      {id}
    </span>
    {vals.map((v, k) => (
      <span key={k} style={{ width: 30, height: 30, borderRadius: 4, background: divColor(v) }} />
    ))}
  </div>
);

const VecEntry = ({ i, v }: { i: number; v: number }) => (
  <div
    className="llm-on2"
    style={{
      ...vars({ d: `${200 + i * 70}ms` }),
      position: 'absolute',
      left: 1130,
      top: 440 + i * 50,
      height: 40,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}
  >
    <span style={{ width: 40, height: 40, borderRadius: 6, background: divColor(v) }} />
    <span style={{ fontFamily: mono, fontSize: 30, color: ink.text }}>{fr(v)}</span>
  </div>
);

const Embeddings: Page = () => (
  <Frame id="emb" eyebrow="02 · Vecteurs" stage={2} beats={3}>
    <Title>Chaque token devient un vecteur</Title>
    <Lede>
      Une immense table associe à chaque identifiant une liste de nombres : son{' '}
      <Hl>embedding</Hl>. C'est la « carte d'identité » du token.
    </Lede>

    <div style={{ position: 'absolute', left: 140, top: 610 }}>
      <Chip t="mint" size={40}>
        chat
      </Chip>
    </div>
    <div style={{ position: 'absolute', left: 140, top: 694, fontFamily: mono, fontSize: 24, color: ink.muted }}>
      ID 9012
    </div>

    <div style={{ position: 'absolute', left: 470, top: 398, fontFamily: mono, fontSize: 22, color: ink.muted }}>
      table d'embeddings · vocabulaire × d
    </div>
    <EmbRow r={0} id="9008" vals={EMB_R[0]} />
    <EmbRow r={1} id="9009" vals={EMB_R[1]} />
    <EmbRow r={2} id="9010" vals={EMB_R[2]} />
    <EmbRow r={3} id="9011" vals={EMB_R[3]} />
    <EmbRow r={4} id="9012" vals={EMB_CHAT} hot />
    <EmbRow r={5} id="9013" vals={EMB_R[4]} />
    <EmbRow r={6} id="9014" vals={EMB_R[5]} />
    <EmbRow r={7} id="9015" vals={EMB_R[6]} />
    <div
      className="llm-dim1"
      style={{ position: 'absolute', left: 574, width: 404, top: EMB_Y(8), textAlign: 'center', fontSize: 28, color: ink.faint }}
    >
      ⋮
    </div>
    <div
      className="llm-fade1"
      style={{
        ...vars({ d: '300ms' }),
        position: 'absolute',
        left: 568,
        top: EMB_Y(4) - 7,
        width: 420,
        height: 54,
        boxSizing: 'border-box',
        border: `3px solid ${ink.accent}`,
        borderRadius: 10,
      }}
    />

    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <Arrow x1={290} y1={644} x2={462} y2={644} n={1} color={ink.accent} />
      <Arrow x1={1000} y1={644} x2={1112} y2={644} n={2} color={ink.accent} />
    </svg>

    <div
      className="llm-on2"
      style={{ position: 'absolute', left: 1130, top: 398, fontFamily: mono, fontSize: 22, color: ink.accent }}
    >
      embedding(« chat »)
    </div>
    <VecEntry i={0} v={EMB_CHAT[0]} />
    <VecEntry i={1} v={EMB_CHAT[1]} />
    <VecEntry i={2} v={EMB_CHAT[2]} />
    <VecEntry i={3} v={EMB_CHAT[3]} />
    <VecEntry i={4} v={EMB_CHAT[4]} />
    <VecEntry i={5} v={EMB_CHAT[5]} />
    <VecEntry i={6} v={EMB_CHAT[6]} />
    <VecEntry i={7} v={EMB_CHAT[7]} />
    <div
      className="llm-on2"
      style={{
        ...vars({ d: '800ms' }),
        position: 'absolute',
        left: 1130,
        top: 846,
        fontFamily: mono,
        fontSize: 24,
        color: ink.muted,
      }}
    >
      ⋮ d = 4 096 valeurs
    </div>

    <Note
      className="llm-on3"
      title="Appris, pas écrits"
      style={{ left: 1390, top: 440, width: 390 }}
    >
      Personne ne choisit ces nombres : ils sont ajustés pendant l'entraînement, comme tous les
      autres paramètres.
      <div style={{ marginTop: 18, fontSize: 24, color: ink.muted }}>
        d = 4 096 pour Llama 3 8B, 12 288 pour GPT‑3.
      </div>
    </Note>
  </Frame>
);

// ═══ 6 · L'espace des sens ═══════════════════════════════════════════════════
const PLOT_W = 1080;
const PLOT_H = 540;

// Shorten a segment by r at both ends (so arrows stop at the dots).
const trim = (x1: number, y1: number, x2: number, y2: number, r: number) => {
  const l = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / l;
  const uy = (y2 - y1) / l;
  return { x1: x1 + ux * r, y1: y1 + uy * r, x2: x2 - ux * r, y2: y2 - uy * r };
};

const Pt = ({ x, y, label, c, d }: { x: number; y: number; label: string; c: Tone; d: number }) => (
  <g
    className="llm-in-settle"
    style={vars({ d: `${d}ms`, dx: `${Math.round((PLOT_W / 2 - x) * 0.75)}px`, dy: `${Math.round((PLOT_H / 2 - y) * 0.75)}px` })}
  >
    <circle cx={x} cy={y} r={10} fill={tone[c].bd} stroke={ink.card} strokeWidth={3} />
    <text x={x + 17} y={y + 9} style={{ fontFamily: sans, fontSize: 26 }} fill={ink.text}>
      {label}
    </text>
  </g>
);

const Cluster = ({
  cx,
  cy,
  rx,
  ry,
  c,
  label,
  lx,
  ly,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  c: Tone;
  label: string;
  lx: number;
  ly: number;
}) => (
  <g className="llm-fade1">
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={tone[c].bg} fillOpacity={0.55} stroke={tone[c].bd} strokeWidth={2} strokeDasharray="6 8" />
    <text x={lx} y={ly} style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 28 }} fill={tone[c].fg}>
      {label}
    </text>
  </g>
);

const Eq = ({ top, n, label, children }: { top: number; n: number; label: string; children: ReactNode }) => (
  <div className={`llm-on${n}`} style={{ ...vars({ d: '600ms' }), position: 'absolute', left: 1290, top, width: 490 }}>
    <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: '0.1em', textTransform: 'uppercase', color: ink.muted }}>
      {label}
    </div>
    <div style={{ fontFamily: mono, fontSize: 34, lineHeight: 1.45, marginTop: 8 }}>{children}</div>
  </div>
);

const W = ({ c, children }: { c: Tone; children: ReactNode }) => (
  <span style={{ color: tone[c].fg, fontWeight: 600 }}>{children}</span>
);

const a1 = trim(560, 430, 620, 280, 16);
const a2 = trim(740, 460, 800, 310, 16);
const a3 = trim(600, 150, 700, 90, 16);
const a4 = trim(840, 170, 940, 110, 16);

const Space: Page = () => (
  <Frame id="space" eyebrow="02 · Vecteurs" stage={2} beats={3}>
    <Title>Le sens devient de la géométrie</Title>
    <Lede>
      Des tokens de sens voisin ont des vecteurs voisins, et certaines <Hl>directions</Hl> encodent
      des concepts.
    </Lede>
    <svg
      width={PLOT_W}
      height={PLOT_H}
      viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
      style={{ position: 'absolute', left: 140, top: 384, overflow: 'visible' }}
    >
      <rect x={0} y={0} width={PLOT_W} height={PLOT_H} rx={16} fill={ink.card} stroke={ink.rule} strokeWidth={1.5} />
      {Array.from({ length: 17 }, (_, i) => (
        <line key={`v${i}`} x1={(i + 1) * 60} y1={0} x2={(i + 1) * 60} y2={PLOT_H} stroke={ink.rule} strokeWidth={1} opacity={0.6} />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`h${i}`} x1={0} y1={(i + 1) * 60} x2={PLOT_W} y2={(i + 1) * 60} stroke={ink.rule} strokeWidth={1} opacity={0.6} />
      ))}

      <Cluster cx={200} cy={190} rx={165} ry={122} c="mint" label="animaux" lx={44} ly={56} />
      <Cluster cx={250} cy={425} rx={165} ry={92} c="peach" label="nourriture" lx={424} ly={478} />
      <Cluster cx={680} cy={370} rx={205} ry={142} c="lav" label="personnes" lx={896} ly={430} />
      <Cluster cx={770} cy={125} rx={245} ry={86} c="sky" label="lieux" lx={1016} ly={62} />

      <Pt x={170} y={150} label="chat" c="mint" d={100} />
      <Pt x={260} y={110} label="chien" c="mint" d={160} />
      <Pt x={210} y={230} label="lion" c="mint" d={220} />
      <Pt x={310} y={200} label="tigre" c="mint" d={280} />
      <Pt x={100} y={285} label="cheval" c="mint" d={340} />
      <Pt x={200} y={400} label="pain" c="peach" d={400} />
      <Pt x={290} y={370} label="fromage" c="peach" d={460} />
      <Pt x={140} y={470} label="croissant" c="peach" d={520} />
      <Pt x={330} y={450} label="pomme" c="peach" d={580} />
      <Pt x={560} y={430} label="homme" c="lav" d={640} />
      <Pt x={740} y={460} label="femme" c="lav" d={700} />
      <Pt x={620} y={280} label="roi" c="lav" d={760} />
      <Pt x={800} y={310} label="reine" c="lav" d={820} />
      <Pt x={600} y={150} label="France" c="sky" d={880} />
      <Pt x={700} y={90} label="Paris" c="sky" d={940} />
      <Pt x={840} y={170} label="Italie" c="sky" d={1000} />
      <Pt x={940} y={110} label="Rome" c="sky" d={1060} />

      <Arrow {...a1} n={2} color={ink.accent} w={4} />
      <Arrow {...a2} n={2} d={250} color={ink.accent} w={4} />
      <text
        x={578}
        y={362}
        textAnchor="end"
        className="llm-fade2"
        style={{ ...vars({ d: '700ms' }), fontFamily: serif, fontStyle: 'italic', fontSize: 26 }}
        fill={ink.accent}
      >
        + royauté
      </text>
      <Arrow {...a3} n={3} color={tone.sky.fg} w={4} />
      <Arrow {...a4} n={3} d={250} color={tone.sky.fg} w={4} />
      <text
        x={636}
        y={104}
        textAnchor="end"
        className="llm-fade3"
        style={{ ...vars({ d: '700ms' }), fontFamily: serif, fontStyle: 'italic', fontSize: 26 }}
        fill={tone.sky.fg}
      >
        + capitale
      </text>
    </svg>

    <Eq top={420} n={2} label="Analogie 1">
      <W c="lav">roi</W> − <W c="lav">homme</W> + <W c="lav">femme</W>
      <br />≈ <W c="lav">reine</W>
    </Eq>
    <Eq top={600} n={3} label="Analogie 2">
      <W c="sky">Paris</W> − <W c="sky">France</W> + <W c="sky">Italie</W>
      <br />≈ <W c="sky">Rome</W>
    </Eq>
    <Fig n={3} style={{ left: 1290, top: 800, width: 490 }}>
      Projection 2D illustrative : les vrais embeddings ont des milliers de dimensions.
    </Fig>
  </Frame>
);

// ═══ Shared: arc with arrowhead (h > 0 above the baseline, h < 0 below) ══════
const ArcArrow = ({
  x1,
  x2,
  y,
  h,
  color,
  w = 3,
  n,
  d = 0,
  o = 1,
}: {
  x1: number;
  x2: number;
  y: number;
  h: number;
  color: string;
  w?: number;
  n?: number;
  d?: number;
  o?: number;
}) => {
  const dir = h > 0 ? 1 : -1;
  const yEnd = y - dir * 14;
  return (
    <g opacity={o}>
      <path
        d={`M ${x1} ${y} C ${x1} ${y - h}, ${x2} ${y - h}, ${x2} ${yEnd}`}
        pathLength={1}
        className={n ? `llm-draw${n}` : undefined}
        fill="none"
        stroke={color}
        strokeWidth={w}
        strokeLinecap="round"
        style={vars({ d: `${d}ms` })}
      />
      <polygon
        points={`${x2},${y} ${x2 - 8},${yEnd} ${x2 + 8},${yEnd}`}
        fill={color}
        className={n ? `llm-fade${n}` : undefined}
        style={vars({ d: `${d + 550}ms` })}
      />
    </g>
  );
};

const arcH = (x1: number, x2: number, k = 0.3, base = 40) => base + Math.abs(x2 - x1) * k;

// ═══ 7 · La même carte, en 3D ════════════════════════════════════════════════
const DEG = Math.PI / 180;
const S3_W = 420; // half-width of the map in world px (page 6 plot is 1080 × 540)
const S3_K = S3_W / 540; // page-6 plot px → world px
const S3_F = 2400; // perspective focal length
const S3_CX = 500;
const S3_UP = 260; // length of the dim 3 axis
const S3_MS = 1400; // camera move duration
const S3_ORBIT = 12; // degrees of slow back-and-forth rotation once words have risen

// Same words and families as page 6; `h` is the new third number (dim 3).
type S3Pt = { label: string; c: Tone; px: number; py: number; h: number };
const S3_PTS: S3Pt[] = [
  { label: 'chat', c: 'mint', px: 170, py: 150, h: 210 },
  { label: 'chien', c: 'mint', px: 260, py: 110, h: 160 },
  { label: 'lion', c: 'mint', px: 210, py: 230, h: 100 },
  { label: 'tigre', c: 'mint', px: 310, py: 200, h: 150 },
  { label: 'cheval', c: 'mint', px: 100, py: 285, h: 150 },
  { label: 'pain', c: 'peach', px: 200, py: 400, h: 70 },
  { label: 'fromage', c: 'peach', px: 290, py: 370, h: 120 },
  { label: 'croissant', c: 'peach', px: 140, py: 470, h: 50 },
  { label: 'pomme', c: 'peach', px: 330, py: 450, h: 20 },
  { label: 'homme', c: 'lav', px: 560, py: 430, h: 10 },
  { label: 'femme', c: 'lav', px: 740, py: 460, h: 200 },
  { label: 'roi', c: 'lav', px: 620, py: 280, h: 10 },
  { label: 'reine', c: 'lav', px: 800, py: 310, h: 200 },
  { label: 'France', c: 'sky', px: 600, py: 150, h: 170 },
  { label: 'Paris', c: 'sky', px: 700, py: 90, h: 220 },
  { label: 'Italie', c: 'sky', px: 840, py: 170, h: 230 },
  { label: 'Rome', c: 'sky', px: 940, py: 110, h: 260 },
];
const s3Pt = (label: string) => S3_PTS.find((p) => p.label === label) as S3Pt;

type S3Zone = { c: Tone; label: string; cx: number; cy: number; rx: number; ry: number; lx: number; ly: number };
const S3_ZONES: S3Zone[] = [
  { c: 'mint', label: 'animaux', cx: 200, cy: 190, rx: 165, ry: 122, lx: 44, ly: 56 },
  { c: 'peach', label: 'nourriture', cx: 250, cy: 425, rx: 165, ry: 92, lx: 440, ly: 505 },
  { c: 'lav', label: 'personnes', cx: 680, cy: 370, rx: 205, ry: 142, lx: 896, ly: 430 },
  { c: 'sky', label: 'lieux', cx: 770, cy: 125, rx: 245, ry: 86, lx: 1016, ly: 62 },
];

// Camera: e = elevation (90° = straight above), yaw = turn around the vertical axis.
type S3Cam = { e: number; yaw: number; cy: number; lift: number; ax3: number; arrows: number; orbit: number };
// One state per beat: top view (= page 6) → tilted floor → words rise → analogy.
const S3_CAMS: S3Cam[] = [
  { e: 90, yaw: 0, cy: 300, lift: 0, ax3: 0, arrows: 0, orbit: 0 },
  { e: 28, yaw: -20, cy: 370, lift: 0, ax3: 1, arrows: 0, orbit: 0 },
  { e: 28, yaw: -20, cy: 370, lift: 1, ax3: 1, arrows: 0, orbit: 1 },
  { e: 28, yaw: -20, cy: 370, lift: 1, ax3: 1, arrows: 1, orbit: 1 },
];
const S3_LAST = S3_CAMS.length - 1;
const S3_KEYS = Object.keys(S3_CAMS[0]) as (keyof S3Cam)[];

const lerpCam = (a: S3Cam, b: S3Cam, k: number): S3Cam => {
  const out = { ...a };
  for (const key of S3_KEYS) out[key] = a[key] + (b[key] - a[key]) * k;
  return out;
};
const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);

const s3Projector = (e: number, yaw: number, cy: number) => {
  const ce = Math.cos(e * DEG);
  const se = Math.sin(e * DEG);
  const cw = Math.cos(yaw * DEG);
  const sw = Math.sin(yaw * DEG);
  // (px, py) on the page-6 map, h = height above it.
  return (px: number, py: number, h = 0) => {
    const a = (px - 540) * S3_K;
    const b = (270 - py) * S3_K;
    const a1 = a * cw - b * sw;
    const b1 = a * sw + b * cw;
    const up = b1 * se + h * ce;
    const depth = -b1 * ce + h * se;
    const s = S3_F / (S3_F - depth);
    return { x: S3_CX + a1 * s, y: cy - up * s, s, d: depth };
  };
};

// Revealed beats of the enclosing page (see Beats).
const revealedBeats = (el: Element | null) =>
  el?.closest('.llm-page')?.querySelectorAll('[data-osd-step="revealed"]').length ?? 0;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Arrowhead polygon at (x2, y2), pointing along (x1, y1) → (x2, y2).
const headPts = (x1: number, y1: number, x2: number, y2: number, size = 14) => {
  const l = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / l;
  const uy = (y2 - y1) / l;
  const bx = x2 - ux * size;
  const by = y2 - uy * size;
  const hw = size * 0.55;
  return { bx, by, pts: `${x2},${y2} ${bx - uy * hw},${by + ux * hw} ${bx + uy * hw},${by - ux * hw}` };
};

const halo: CSSProperties = {
  paintOrder: 'stroke',
  stroke: 'var(--osd-bg)',
  strokeWidth: 6,
  strokeLinejoin: 'round',
};

const S3Axis = ({ x1, y1, x2, y2, label, lx, ly, o = 1, hot }: { x1: number; y1: number; x2: number; y2: number; label: string; lx: number; ly: number; o?: number; hot?: boolean }) => {
  const h = headPts(x1, y1, x2, y2, 16);
  const color = hot ? ink.accent : ink.soft;
  return (
    <g opacity={o}>
      <line x1={x1} y1={y1} x2={h.bx} y2={h.by} stroke={color} strokeWidth={3} strokeLinecap="round" />
      <polygon points={h.pts} fill={color} />
      <text x={lx} y={ly} textAnchor="middle" style={{ ...halo, fontFamily: mono, fontSize: 24, fontWeight: 500 }} fill={color}>
        {label}
      </text>
    </g>
  );
};

// A 3D arrow between two lifted words, growing with `k` (0 → 1).
const S3Link = ({ from, to, k, color }: { from: { x: number; y: number }; to: { x: number; y: number }; k: number; color: string }) => {
  if (k <= 0.01) return null;
  const l = Math.hypot(to.x - from.x, to.y - from.y) || 1;
  const ux = (to.x - from.x) / l;
  const uy = (to.y - from.y) / l;
  const x1 = from.x + ux * 18;
  const y1 = from.y + uy * 18;
  const x2 = x1 + (to.x - ux * 18 - x1) * k;
  const y2 = y1 + (to.y - uy * 18 - y1) * k;
  const h = headPts(x1, y1, x2, y2, 16);
  return (
    <g opacity={Math.min(1, k * 3)}>
      <line x1={x1} y1={y1} x2={h.bx} y2={h.by} stroke={color} strokeWidth={4} strokeLinecap="round" />
      <polygon points={h.pts} fill={color} />
    </g>
  );
};

const Scene3D = () => {
  const live = useIsActivePage();
  const ref = useRef<SVGSVGElement>(null);
  const [view, setView] = useState({ cam: S3_CAMS[live ? 0 : S3_LAST], t: 0 });

  // Layout effect: the reveal state is already in the DOM, so the first paint
  // shows the right camera (also when arriving backward, fully revealed).
  useLayoutEffect(() => {
    if (!live) return;
    const el = ref.current;
    const reduce = prefersReducedMotion();
    let beat = Math.min(S3_LAST, revealedBeats(el));
    let from = S3_CAMS[beat];
    let cur = from;
    let t0 = Number.NEGATIVE_INFINITY;
    const start = performance.now();
    setView({ cam: cur, t: 0 });
    let raf = 0;
    const tick = (now: number) => {
      const b = Math.min(S3_LAST, revealedBeats(el));
      if (b !== beat) {
        beat = b;
        from = cur;
        t0 = reduce ? Number.NEGATIVE_INFINITY : now;
      }
      cur = lerpCam(from, S3_CAMS[beat], easeInOut(Math.min(1, (now - t0) / S3_MS)));
      setView({ cam: cur, t: reduce ? 0 : (now - start) / 1000 });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live]);

  const { cam, t } = view;
  const yaw = cam.yaw + cam.orbit * S3_ORBIT * Math.sin((t * 2 * Math.PI) / 16);
  const P = s3Projector(cam.e, yaw, cam.cy);
  const flat = Math.sin(cam.e * DEG);
  // Words are read in the top view and once risen; on the bare tilted floor they would pile up.
  const wordsO = Math.max(1 - cam.ax3, cam.lift);

  const floor = [P(0, 0), P(1080, 0), P(1080, 540), P(0, 540)];
  const lifted = (p: S3Pt) => P(p.px, p.py, p.h * cam.lift);
  const pts = S3_PTS.map((p) => ({ p, q: lifted(p), g: P(p.px, p.py) })).sort((u, v) => u.q.d - v.q.d);

  const o = P(0, 540);
  const x1 = P(1130, 540);
  const y2 = P(0, -50);
  const z3 = P(0, 540, S3_UP * cam.ax3);
  const xl = P(1130, 590);
  const yl = P(0, -80);

  const homme = lifted(s3Pt('homme'));
  const femme = lifted(s3Pt('femme'));
  const roi = lifted(s3Pt('roi'));
  const reine = lifted(s3Pt('reine'));
  const chat = lifted(s3Pt('chat'));

  return (
    <svg ref={ref} width={1000} height={620} style={{ position: 'absolute', left: 140, top: 360, overflow: 'visible' }}>
      <polygon points={floor.map((c) => `${c.x},${c.y}`).join(' ')} fill={ink.card} stroke={ink.rule} strokeWidth={1.5} strokeLinejoin="round" />
      {Array.from({ length: 17 }, (_, i) => {
        const a = P((i + 1) * 60, 0);
        const b = P((i + 1) * 60, 540);
        return <line key={`v${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ink.rule} strokeWidth={1} opacity={0.6} />;
      })}
      {Array.from({ length: 8 }, (_, i) => {
        const a = P(0, (i + 1) * 60);
        const b = P(1080, (i + 1) * 60);
        return <line key={`h${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ink.rule} strokeWidth={1} opacity={0.6} />;
      })}
      {S3_ZONES.map((z) => {
        const ring = Array.from({ length: 48 }, (_, k) => {
          const th = (k / 48) * 2 * Math.PI;
          const c = P(z.cx + z.rx * Math.cos(th), z.cy + z.ry * Math.sin(th));
          return `${c.x.toFixed(1)},${c.y.toFixed(1)}`;
        }).join(' ');
        const l = P(z.lx, z.ly);
        return (
          <g key={z.label}>
            <polygon points={ring} fill={tone[z.c].bg} fillOpacity={0.55} stroke={tone[z.c].bd} strokeWidth={2} strokeDasharray="6 8" />
            <text x={l.x} y={l.y} opacity={1 - cam.ax3} style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 28 }} fill={tone[z.c].fg}>
              {z.label}
            </text>
          </g>
        );
      })}

      <S3Axis x1={o.x} y1={o.y} x2={x1.x} y2={x1.y} label="dim 1" lx={xl.x} ly={xl.y + 8} />
      <S3Axis x1={o.x} y1={o.y} x2={y2.x} y2={y2.y} label="dim 2" lx={yl.x - 85 * cam.ax3} ly={yl.y + 40 * cam.ax3} />

      {pts.map(({ p, q, g }) =>
        cam.lift > 0.01 ? (
          <g key={`drop-${p.label}`} opacity={cam.lift}>
            <ellipse cx={g.x} cy={g.y} rx={8 * g.s} ry={Math.max(2, 8 * g.s * flat)} fill={tone[p.c].bd} opacity={0.5} />
            <line x1={g.x} y1={g.y} x2={q.x} y2={q.y} stroke={tone[p.c].fg} strokeWidth={2} strokeDasharray="3 6" opacity={0.7} />
          </g>
        ) : null,
      )}

      {cam.ax3 > 0.01 ? <S3Axis x1={o.x} y1={o.y} x2={z3.x} y2={z3.y} label="dim 3" lx={z3.x} ly={z3.y - 16} o={cam.ax3} hot /> : null}

      <S3Link from={homme} to={roi} k={cam.arrows} color={ink.accent} />
      <S3Link from={femme} to={reine} k={cam.arrows} color={ink.accent} />
      <S3Link from={homme} to={femme} k={cam.arrows} color={tone.lav.fg} />
      <S3Link from={roi} to={reine} k={cam.arrows} color={tone.lav.fg} />
      {pts.map(({ p, q }) => (
        <g key={p.label}>
          <circle cx={q.x} cy={q.y} r={10 * q.s} fill={tone[p.c].bd} stroke={ink.card} strokeWidth={3} />
          <text x={q.x + 17 * q.s} y={q.y + 9 * q.s} opacity={wordsO} style={{ ...halo, fontFamily: sans, fontSize: 26 * q.s }} fill={ink.text}>
            {p.label}
          </text>
        </g>
      ))}
      <circle cx={chat.x} cy={chat.y} r={18 * chat.s} fill="none" stroke={ink.accent} strokeWidth={3} />

      <g opacity={cam.arrows}>
        <text x={(homme.x + roi.x) / 2 - 60} y={(homme.y + roi.y) / 2 - 48} textAnchor="middle" style={{ ...halo, fontFamily: serif, fontStyle: 'italic', fontSize: 28 }} fill={ink.accent}>
          + royauté
        </text>
        <text x={(roi.x + reine.x) / 2 + 60} y={(roi.y + reine.y) / 2 + 32} textAnchor="middle" style={{ ...halo, fontFamily: serif, fontStyle: 'italic', fontSize: 28 }} fill={tone.lav.fg}>
          + féminin
        </text>
      </g>
    </svg>
  );
};

CSS.push(`
.llm-s3 .llm-s3-grow{max-width:0;opacity:0;margin-left:-14px;overflow:hidden;transition:max-width 800ms ${EASE},opacity 500ms ${EASE} 250ms,margin-left 800ms ${EASE}}
${at('s3', 2)} .llm-s3-grow{max-width:120px;opacity:1;margin-left:0}
`);

const S3Cell = ({ v, dim }: { v: number; dim: number }) => (
  <div style={{ flex: 'none', width: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
    <div
      style={{
        width: 110,
        height: 58,
        borderRadius: 8,
        background: divColor(v),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: mono,
        fontSize: 28,
        color: ink.text,
      }}
    >
      {fr(v, 1)}
    </div>
    <div style={{ fontFamily: mono, fontSize: 22, color: dim === 3 ? ink.accent : ink.muted }}>dim {dim}</div>
  </div>
);

const Bracket = ({ children }: { children: ReactNode }) => (
  <span style={{ flex: 'none', fontFamily: mono, fontSize: 60, lineHeight: '58px', color: ink.faint }}>{children}</span>
);

const S3_CHAT = s3Pt('chat');

const Space3D: Page = () => (
  <Frame id="s3" eyebrow="02 · Vecteurs" stage={2} beats={3}>
    <Title>La même carte, en trois dimensions</Title>
    <Lede>
      Vue du dessus, c'est la carte précédente. Penchons-la, puis <Hl>ajoutons un 3e nombre</Hl> à chaque
      mot : sa hauteur.
    </Lede>
    <Scene3D />

    <div style={{ position: 'absolute', left: 1240, top: 400, width: 540 }}>
      <div style={{ fontFamily: mono, fontSize: 22, color: ink.muted }}>« chat » sur cette carte · illustratif</div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginTop: 16 }}>
        <Bracket>[</Bracket>
        <S3Cell v={(S3_CHAT.px - 540) / 540} dim={1} />
        <S3Cell v={(270 - S3_CHAT.py) / 540} dim={2} />
        <div className="llm-s3-grow" style={{ flex: 'none' }}>
          <S3Cell v={S3_CHAT.h / S3_W} dim={3} />
        </div>
        <Bracket>]</Bracket>
      </div>
    </div>
    <Note n="1" title="Vue du dessus = la carte 2D" className="llm-on1" style={{ left: 1240, top: 600, width: 540 }}>
      on la penche : c'est un sol plat
    </Note>
    <Note n="2" title="Un 3e nombre : la hauteur" className="llm-on2" style={{ left: 1240, top: 710, width: 540 }}>
      la carte 2D n'en était que l'ombre
    </Note>
    <Note n="3" title="Une direction = un concept" className="llm-on3" style={{ left: 1240, top: 820, width: 540 }}>
      « féminin » monte, « royauté » reste à plat
    </Note>
  </Frame>
);

// ═══ 8 · Des milliers de dimensions ══════════════════════════════════════════
const ND_PW = 300;
const ND_PH = 370;
const ND_TOP = 410;
const ND_X = (i: number) => 140 + i * (ND_PW + 35);
const ND_VEC = [0.4, 0.7, -0.2, 0.9];

// Seconds since mount on the audience-facing page; frozen at `still` elsewhere.
const useClock = (still: number) => {
  const live = useIsActivePage();
  const [t, setT] = useState(still);
  useEffect(() => {
    if (!live || prefersReducedMotion()) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      setT(still + (now - t0) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live, still]);
  return t;
};

// 4 096 illustrative values; the first four are the ones shown in panels 1–4.
const ndRand = rng(2026);
const ndGauss = () => Math.max(-1, Math.min(1, (ndRand() + ndRand() + ndRand() - 1.5) / 1.1));
const ND_VALS = Array.from({ length: 4096 }, (_, i) => (i < ND_VEC.length ? ND_VEC[i] : ndGauss()));

// The 64 × 64 mosaic as one SVG data URI (one path per color level).
const ND_MOSAIC = (() => {
  const LV = 8;
  const cells: string[][] = Array.from({ length: LV * 2 }, () => []);
  ND_VALS.forEach((v, i) => {
    const q = Math.min(LV - 1, Math.floor(Math.abs(v) * LV));
    cells[(v >= 0 ? LV : 0) + q].push(`M${i % 64} ${Math.floor(i / 64)}h1v1h-1z`);
  });
  const body = cells
    .map((d, k) => {
      if (!d.length) return '';
      const v = ((k >= LV ? 1 : -1) * ((k % LV) + 0.5)) / LV;
      return `<path fill='${divColor(v)}' d='${d.join('')}'/>`;
    })
    .join('');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' shape-rendering='crispEdges'>${body}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
})();

const cosine = (u: number[], v: number[]) => {
  let uv = 0;
  let uu = 0;
  let vv = 0;
  for (let i = 0; i < u.length; i++) {
    uv += u[i] * v[i];
    uu += u[i] * u[i];
    vv += v[i] * v[i];
  }
  return uv / Math.sqrt(uu * vv);
};

const ND_BARS = 114;
const ND_CHAT = ND_VALS.slice(0, ND_BARS);
const ndRand2 = rng(77);
const ndNoise = () => (ndRand2() + ndRand2() + ndRand2() - 1.5) / 1.1;
const ND_CHIEN = ND_CHAT.map((v) => Math.max(-1, Math.min(1, 0.85 * v + 0.4 * ndNoise())));
const ND_VOITURE = ND_CHAT.map(() => Math.max(-1, Math.min(1, ndNoise())));

CSS.push(`
@keyframes llm-sweep{from{transform:translateX(-140%)}to{transform:translateX(320%)}}
.llm-nd.llm-live .llm-sweep{animation:llm-sweep 3.4s ${EASE} 1s infinite}
.llm-nd .llm-bc{transform:scaleX(0);transform-origin:left center;transition:transform 900ms ${EASE} var(--d,0ms)}
${at('nd', 5)} .llm-bc{transform:scaleX(1)}
`);

const NdCell = ({ v }: { v: number }) => (
  <span
    style={{
      flex: 'none',
      width: 56,
      height: 38,
      borderRadius: 6,
      background: divColor(v),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: mono,
      fontSize: 22,
      color: ink.text,
    }}
  >
    {fr(v, 1)}
  </span>
);

const NdPanel = ({
  i,
  n,
  unit,
  caption,
  dims,
  more,
  className,
  children,
}: {
  i: number;
  n: string;
  unit: string;
  caption: string;
  dims: number;
  more?: boolean;
  className?: string;
  children: ReactNode;
}) => (
  <div
    className={className}
    style={{
      ...vars({ d: '150ms' }),
      position: 'absolute',
      left: ND_X(i),
      top: ND_TOP,
      width: ND_PW,
      height: ND_PH,
      boxSizing: 'border-box',
      padding: '16px 20px 18px',
      background: ink.card,
      borderRadius: 16,
      boxShadow: `0 0 0 1.5px ${ink.rule}, 0 12px 30px -20px rgba(60, 40, 10, 0.35)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'baseline', gap: 10 }}>
      <span style={{ fontFamily: serif, fontSize: 46, fontWeight: 500, lineHeight: 1.1, color: 'var(--osd-accent)' }}>{n}</span>
      <span style={{ fontSize: 24, color: ink.muted }}>{unit}</span>
    </div>
    <div style={{ position: 'relative', width: 260, height: 192, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 38, marginTop: 10 }}>
      {ND_VEC.slice(0, dims).map((v, k) => (
        <NdCell key={k} v={v} />
      ))}
      {more ? <span style={{ fontFamily: mono, fontSize: 24, color: ink.muted, marginLeft: 2 }}>…</span> : null}
    </div>
    <div style={{ marginTop: 10, fontSize: 22, lineHeight: 1.3, color: ink.soft, textAlign: 'center' }}>{caption}</div>
  </div>
);

const ndLabel: CSSProperties = { fontFamily: mono, fontSize: 22 };

const NdLine = () => (
  <svg width={260} height={192} style={{ overflow: 'visible' }}>
    <line x1={20} y1={100} x2={240} y2={100} stroke={ink.soft} strokeWidth={2.5} />
    {[-1, 0, 1].map((v) => (
      <g key={v}>
        <line x1={130 + v * 100} y1={91} x2={130 + v * 100} y2={109} stroke={ink.soft} strokeWidth={2} />
        <text x={130 + v * 100} y={142} textAnchor="middle" style={ndLabel} fill={ink.muted}>
          {fr(v, 0)}
        </text>
      </g>
    ))}
    <text x={240} y={72} textAnchor="end" style={ndLabel} fill={ink.muted}>
      dim 1
    </text>
    <circle
      cx={130 + ND_VEC[0] * 100}
      cy={100}
      r={11}
      fill={ink.accent}
      className="llm-in-pop"
      style={{ ...vars({ d: '700ms' }), transformBox: 'fill-box', transformOrigin: 'center' }}
    />
  </svg>
);

const NdPlane = () => {
  const cx = 130;
  const cy = 104;
  const r = 66;
  const px = cx + ND_VEC[0] * r;
  const py = cy - ND_VEC[1] * r;
  return (
    <svg width={260} height={192} style={{ overflow: 'visible' }}>
      <rect x={cx - r} y={cy - r} width={2 * r} height={2 * r} fill="none" stroke={ink.rule} strokeWidth={1.5} />
      <line x1={cx - r / 2} y1={cy - r} x2={cx - r / 2} y2={cy + r} stroke={ink.rule} strokeWidth={1} />
      <line x1={cx + r / 2} y1={cy - r} x2={cx + r / 2} y2={cy + r} stroke={ink.rule} strokeWidth={1} />
      <line x1={cx - r} y1={cy - r / 2} x2={cx + r} y2={cy - r / 2} stroke={ink.rule} strokeWidth={1} />
      <line x1={cx - r} y1={cy + r / 2} x2={cx + r} y2={cy + r / 2} stroke={ink.rule} strokeWidth={1} />
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={ink.soft} strokeWidth={2.5} />
      <line x1={cx} y1={cy + r} x2={cx} y2={cy - r} stroke={ink.soft} strokeWidth={2.5} />
      <g className="llm-fade1" style={vars({ d: '600ms' })}>
        <line x1={px} y1={py} x2={px} y2={cy} stroke={ink.accent} strokeWidth={2} strokeDasharray="4 5" />
        <line x1={px} y1={py} x2={cx} y2={py} stroke={ink.accent} strokeWidth={2} strokeDasharray="4 5" />
      </g>
      <circle cx={px} cy={py} r={10} fill={ink.accent} />
      <text x={cx + r + 6} y={cy + 30} textAnchor="end" style={ndLabel} fill={ink.muted}>
        dim 1
      </text>
      <text x={cx + 10} y={cy - r - 10} style={ndLabel} fill={ink.muted}>
        dim 2
      </text>
    </svg>
  );
};

const CUBE_EDGES: [number, number][] = [];
for (let i = 0; i < 8; i++) for (let b = 0; b < 3; b++) if (i < (i ^ (1 << b))) CUBE_EDGES.push([i, i ^ (1 << b)]);
const cubeVertex = (i: number) => [i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1];

const NdCube = () => {
  const t = useClock(0.9);
  const th = t * 0.45;
  const ph = 24 * DEG;
  const S = 52;
  const pr = (x: number, y: number, z: number) => {
    const x1 = x * Math.cos(th) + z * Math.sin(th);
    const z1 = -x * Math.sin(th) + z * Math.cos(th);
    const up = y * Math.cos(ph) - z1 * Math.sin(ph);
    const d = y * Math.sin(ph) + z1 * Math.cos(ph);
    const s = 7 / (7 - d);
    return { x: 130 + x1 * S * s, y: 100 - up * S * s };
  };
  const v = Array.from({ length: 8 }, (_, i) => {
    const [x, y, z] = cubeVertex(i);
    return pr(x, y, z);
  });
  const p = pr(ND_VEC[0], ND_VEC[1], ND_VEC[2]);
  const g = pr(ND_VEC[0], -1, ND_VEC[2]);
  return (
    <svg width={260} height={192} style={{ overflow: 'visible' }}>
      {CUBE_EDGES.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={v[a].x} y1={v[a].y} x2={v[b].x} y2={v[b].y} stroke={ink.soft} strokeWidth={2} opacity={0.5} />
      ))}
      <ellipse cx={g.x} cy={g.y} rx={8} ry={3.5} fill={ink.faint} />
      <line x1={p.x} y1={p.y} x2={g.x} y2={g.y} stroke={ink.accent} strokeWidth={2} strokeDasharray="4 5" />
      <circle cx={p.x} cy={p.y} r={10} fill={ink.accent} />
    </svg>
  );
};

const TESS_EDGES: [number, number][] = [];
for (let i = 0; i < 16; i++) for (let b = 0; b < 4; b++) if (i < (i ^ (1 << b))) TESS_EDGES.push([i, i ^ (1 << b)]);

const NdTesseract = () => {
  const t = useClock(1.4);
  const a = t * 0.55;
  const b = t * 0.3;
  const yaw = 30 * DEG;
  const pitch = 18 * DEG;
  const D = 2.6;
  const v = Array.from({ length: 16 }, (_, i) => {
    let x = i & 1 ? 1 : -1;
    let y = i & 2 ? 1 : -1;
    let z = i & 4 ? 1 : -1;
    let w = i & 8 ? 1 : -1;
    [x, w] = [x * Math.cos(a) - w * Math.sin(a), x * Math.sin(a) + w * Math.cos(a)];
    [y, z] = [y * Math.cos(b) - z * Math.sin(b), y * Math.sin(b) + z * Math.cos(b)];
    // 4D → 3D: the 4th axis becomes a size change (its shadow)
    const k = 1 / (D - w);
    x *= k;
    y *= k;
    z *= k;
    const x1 = x * Math.cos(yaw) + z * Math.sin(yaw);
    const z1 = -x * Math.sin(yaw) + z * Math.cos(yaw);
    const up = y * Math.cos(pitch) - z1 * Math.sin(pitch);
    return { x: 130 + x1 * 68, y: 100 - up * 68, k };
  });
  const near = (k: number) => Math.max(0, Math.min(1, (k - 0.25) / 0.6));
  return (
    <svg width={260} height={192} style={{ overflow: 'visible' }}>
      {TESS_EDGES.map(([p, q]) => (
        <line
          key={`${p}-${q}`}
          x1={v[p].x}
          y1={v[p].y}
          x2={v[q].x}
          y2={v[q].y}
          stroke={tone.lav.fg}
          strokeWidth={2}
          opacity={0.2 + 0.7 * near((v[p].k + v[q].k) / 2)}
        />
      ))}
      {v.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={tone.lav.fg} opacity={0.3 + 0.7 * near(p.k)} />
      ))}
    </svg>
  );
};

const NdMosaic = () => (
  <div
    style={{
      position: 'relative',
      width: 192,
      height: 192,
      borderRadius: 4,
      overflow: 'hidden',
      backgroundColor: ink.card,
      backgroundImage: ND_MOSAIC,
      backgroundSize: '100% 100%',
      boxShadow: `0 0 0 1.5px ${ink.rule}`,
    }}
  >
    <div style={{ position: 'absolute', left: 0, top: 0, width: 12, height: 3, outline: `2px solid ${ink.accent}`, outlineOffset: 1 }} />
    <div
      className="llm-sweep"
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: '40%',
        transform: 'translateX(-140%)',
        background: 'linear-gradient(90deg, rgba(255, 253, 248, 0), rgba(255, 253, 248, 0.6), rgba(255, 253, 248, 0))',
      }}
    />
  </div>
);

const NdStep = ({ i, label }: { i: number; label: string }) => {
  const x1 = ND_X(i) + ND_PW / 2;
  const x2 = ND_X(i + 1) + ND_PW / 2;
  return (
    <div
      className={`llm-fade${i + 1}`}
      style={{
        ...vars({ d: '500ms' }),
        position: 'absolute',
        left: (x1 + x2) / 2 - 110,
        top: ND_TOP - 66,
        width: 220,
        height: 32,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          padding: '2px 12px',
          borderRadius: 8,
          background: 'var(--osd-bg)',
          fontFamily: mono,
          fontSize: 22,
          fontWeight: 500,
          color: 'var(--osd-accent)',
        }}
      >
        {label}
      </span>
    </div>
  );
};

const NdBar = ({ top, label, vals, d, children }: { top: number; label: string; vals: number[]; d: number; children: ReactNode }) => (
  <div
    className="llm-on5"
    style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: 880, top, height: 34, display: 'flex', alignItems: 'center' }}
  >
    <span style={{ width: 120, marginRight: 16, textAlign: 'right', fontFamily: mono, fontSize: 24 }}>{label}</span>
    <svg className="llm-bc" width={ND_BARS * 5} height={34} style={vars({ d: `${d + 150}ms` })}>
      {vals.map((v, k) => (
        <rect key={k} x={k * 5} y={0} width={5} height={34} fill={divColor(v)} />
      ))}
    </svg>
    <span style={{ marginLeft: 20, whiteSpace: 'nowrap' }}>{children}</span>
  </div>
);

const Dimensions: Page = () => (
  <Frame id="nd" eyebrow="02 · Vecteurs" stage={2} beats={5}>
    <Title>Et avec des milliers de dimensions ?</Title>
    <Lede width={1640}>
      Impossible à dessiner… mais chaque dimension n'est qu'<Hl>un nombre de plus</Hl> dans la liste.
    </Lede>

    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <ArcArrow x1={ND_X(0) + ND_PW / 2} x2={ND_X(1) + ND_PW / 2} y={ND_TOP - 8} h={56} color={ink.accent} n={1} />
      <ArcArrow x1={ND_X(1) + ND_PW / 2} x2={ND_X(2) + ND_PW / 2} y={ND_TOP - 8} h={56} color={ink.accent} n={2} />
      <ArcArrow x1={ND_X(2) + ND_PW / 2} x2={ND_X(3) + ND_PW / 2} y={ND_TOP - 8} h={56} color={ink.accent} n={3} />
      <ArcArrow x1={ND_X(3) + ND_PW / 2} x2={ND_X(4) + ND_PW / 2} y={ND_TOP - 8} h={56} color={ink.accent} n={4} />
    </svg>
    <NdStep i={0} label="+1 nombre" />
    <NdStep i={1} label="+1 nombre" />
    <NdStep i={2} label="+1 nombre" />
    <NdStep i={3} label="+4 092 nombres" />

    <NdPanel i={0} n="1" unit="dimension" caption="une droite" dims={1} className="llm-in">
      <NdLine />
    </NdPanel>
    <NdPanel i={1} n="2" unit="dimensions" caption="un plan" dims={2} className="llm-on1">
      <NdPlane />
    </NdPanel>
    <NdPanel i={2} n="3" unit="dimensions" caption="un volume" dims={3} className="llm-on2">
      <NdCube />
    </NdPanel>
    <NdPanel i={3} n="4" unit="dimensions" caption="seulement son ombre" dims={4} className="llm-on3">
      <NdTesseract />
    </NdPanel>
    <NdPanel i={4} n={'4 096'} unit="dimensions" caption="une mosaïque 64 × 64" dims={4} more className="llm-on4">
      <NdMosaic />
    </NdPanel>

    <div className="llm-on5" style={{ position: 'absolute', left: 140, top: 812, width: 680 }}>
      <div style={{ fontFamily: serif, fontSize: 38, fontWeight: 500, lineHeight: 1.2 }}>
        On ne la voit pas : <em style={{ color: 'var(--osd-accent)' }}>on la calcule</em>.
      </div>
      <div style={{ fontSize: 28, lineHeight: 1.45, color: ink.soft, marginTop: 10 }}>
        Deux mots proches = deux listes qui pointent dans <Hl>la même direction</Hl>.
      </div>
    </div>
    <NdBar top={812} label="chat" vals={ND_CHAT} d={150}>
      <span style={{ fontSize: 24, color: ink.muted }}>référence</span>
    </NdBar>
    <NdBar top={858} label="chien" vals={ND_CHIEN} d={300}>
      <span style={{ fontFamily: mono, fontSize: 24, fontWeight: 600, color: tone.mint.fg }}>
        cos = {fr(cosine(ND_CHAT, ND_CHIEN))}
      </span>
    </NdBar>
    <NdBar top={904} label="voiture" vals={ND_VOITURE} d={450}>
      <span style={{ fontFamily: mono, fontSize: 24, color: ink.muted }}>cos = {fr(cosine(ND_CHAT, ND_VOITURE))}</span>
    </NdBar>
  </Frame>
);

// ═══ 9 · Le problème du contexte ═════════════════════════════════════════════
const CTX_A = layoutRow(["J'ai", 'mangé', 'un', 'avocat', 'bien', 'mûr', '.'], 38, 16, 14, 140);
const CTX_B = layoutRow(['Au', 'tribunal', ',', "l'", 'avocat', 'a', 'argumenté', '.'], 38, 16, 14, 140);
const CTX_YA = 500;
const CTX_YB = 750;
const CTX_H = 66;

const CTX_V0 = [0.4, -0.6, 0.2, 0.8, -0.3, 0.5, -0.7, 0.1, 0.6, -0.2];
const CTX_VA = [0.7, 0.2, 0.9, 0.3, 0.6, 0.1, 0.8, 0.4, 0.5, 0.9];
const CTX_VB = [0.3, 0.8, 0.1, 0.6, 0.9, 0.4, 0.2, 0.9, 0.3, 0.6];

CSS.push(`
.llm-ctx .llm-ctx-src,.llm-ctx .llm-ctx-av{transition:background-color 700ms ${EASE},box-shadow 700ms ${EASE}}
${at('ctx', 1)} .llm-ctx-a{background-color:${tone.mint.bg} !important;box-shadow:inset 0 0 0 2px ${tone.mint.bd} !important}
${at('ctx', 1)} .llm-ctx-b{background-color:${tone.lav.bg} !important;box-shadow:inset 0 0 0 2px ${tone.lav.bd} !important}
${at('ctx', 2)} .llm-ctx-avA{background-color:${tone.mint.bg} !important;box-shadow:inset 0 0 0 3px ${tone.mint.fg} !important}
${at('ctx', 2)} .llm-ctx-avB{background-color:${tone.lav.bg} !important;box-shadow:inset 0 0 0 3px ${tone.lav.fg} !important}
.llm-ctx .llm-vc{background-color:var(--c0);transition:background-color 800ms ${EASE} var(--d,0ms)}
${at('ctx', 2)} .llm-vc{background-color:var(--c1)}
`);

const CtxStrip = ({ top, rgb, vals, label, c }: { top: number; rgb: string; vals: number[]; label: string; c: Tone }) => (
  <>
    <div style={{ position: 'absolute', left: 1250, top: top - 44, fontFamily: mono, fontSize: 22, color: ink.muted }}>
      vecteur de « avocat »
    </div>
    <div style={{ position: 'absolute', left: 1250, top, display: 'flex', gap: 6 }}>
      {vals.map((v, k) => (
        <span
          key={k}
          className="llm-vc"
          style={{
            ...vars({ c0: divColor(CTX_V0[k]), c1: `rgba(${rgb}, ${(0.15 + 0.75 * v).toFixed(2)})`, d: `${k * 50}ms` }),
            width: 40,
            height: 44,
            borderRadius: 6,
          }}
        />
      ))}
    </div>
    <div style={{ position: 'absolute', left: 1250, top: top + 58, width: 520, height: 40, fontSize: 28 }}>
      <span className="llm-off2" style={{ position: 'absolute', left: 0, top: 0, color: ink.muted, fontStyle: 'italic', fontFamily: serif }}>
        même vecteur au départ
      </span>
      <span className="llm-fade2" style={{ ...vars({ d: '500ms' }), position: 'absolute', left: 0, top: 0, color: tone[c].fg, fontWeight: 600 }}>
        {label}
      </span>
    </div>
  </>
);

const Context: Page = () => (
  <Frame id="ctx" eyebrow="03 · Attention" stage={3} beats={3}>
    <Title>Un même token, plusieurs sens</Title>
    <Lede>
      Au sortir de la table, « avocat » a <Hl>le même vecteur</Hl> dans les deux phrases. C'est le
      contexte qui doit trancher.
    </Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <ArcArrow x1={CTX_A[1].cx} x2={CTX_A[3].cx} y={CTX_YA} h={arcH(CTX_A[1].cx, CTX_A[3].cx)} color={tone.mint.fg} w={5} n={1} />
      <ArcArrow x1={CTX_A[2].cx} x2={CTX_A[3].cx - 36} y={CTX_YA} h={arcH(CTX_A[2].cx, CTX_A[3].cx - 36)} color={tone.mint.fg} w={2} n={1} d={200} o={0.45} />
      <ArcArrow x1={CTX_B[1].cx} x2={CTX_B[4].cx} y={CTX_YB} h={arcH(CTX_B[1].cx, CTX_B[4].cx)} color={tone.lav.fg} w={5} n={1} d={300} />
      <ArcArrow x1={CTX_B[3].cx} x2={CTX_B[4].cx - 36} y={CTX_YB} h={arcH(CTX_B[3].cx, CTX_B[4].cx - 36)} color={tone.lav.fg} w={2} n={1} d={500} o={0.45} />
    </svg>

    <TokBox s={CTX_A[0]} y={CTX_YA} h={CTX_H} size={38}>J'ai</TokBox>
    <TokBox s={CTX_A[1]} y={CTX_YA} h={CTX_H} size={38} className="llm-ctx-src llm-ctx-a">mangé</TokBox>
    <TokBox s={CTX_A[2]} y={CTX_YA} h={CTX_H} size={38}>un</TokBox>
    <TokBox s={CTX_A[3]} y={CTX_YA} h={CTX_H} size={38} t="butter" className="llm-ctx-av llm-ctx-avA">avocat</TokBox>
    <TokBox s={CTX_A[4]} y={CTX_YA} h={CTX_H} size={38}>bien</TokBox>
    <TokBox s={CTX_A[5]} y={CTX_YA} h={CTX_H} size={38}>mûr</TokBox>
    <TokBox s={CTX_A[6]} y={CTX_YA} h={CTX_H} size={38}>.</TokBox>

    <TokBox s={CTX_B[0]} y={CTX_YB} h={CTX_H} size={38}>Au</TokBox>
    <TokBox s={CTX_B[1]} y={CTX_YB} h={CTX_H} size={38} className="llm-ctx-src llm-ctx-b">tribunal</TokBox>
    <TokBox s={CTX_B[2]} y={CTX_YB} h={CTX_H} size={38}>,</TokBox>
    <TokBox s={CTX_B[3]} y={CTX_YB} h={CTX_H} size={38}>l'</TokBox>
    <TokBox s={CTX_B[4]} y={CTX_YB} h={CTX_H} size={38} t="butter" className="llm-ctx-av llm-ctx-avB">avocat</TokBox>
    <TokBox s={CTX_B[5]} y={CTX_YB} h={CTX_H} size={38}>a</TokBox>
    <TokBox s={CTX_B[6]} y={CTX_YB} h={CTX_H} size={38}>argumenté</TokBox>
    <TokBox s={CTX_B[7]} y={CTX_YB} h={CTX_H} size={38}>.</TokBox>

    <CtxStrip top={CTX_YA + 11} rgb="47, 122, 82" vals={CTX_VA} label="→ le fruit" c="mint" />
    <CtxStrip top={CTX_YB + 11} rgb="91, 79, 176" vals={CTX_VB} label="→ le juriste" c="lav" />

    <div className="llm-on3" style={{ position: 'absolute', left: 140, top: 878, fontSize: 34, lineHeight: 1.4 }}>
      Ce mécanisme d'échange entre tokens s'appelle <Hl>l'attention</Hl>.
    </div>
  </Frame>
);

// ═══ 10 · Requête, clé, valeur ════════════════════════════════════════════════
const QKV = layoutRow(['Hier', "j'ai", 'mangé', 'un', 'avocat'], 38, 18, 70, 160);
const QKV_Y = 790;
const QKV_BY = 742;
const QKV_SCORES = [0.3, 0.8, 3.1, 0.6, 1.2];
const QKV_W = softmax(QKV_SCORES);
const QX = QKV[4].cx + 30;
const KX = (i: number) => (i === 4 ? QKV[4].cx - 30 : QKV[i].cx);
const qh = (i: number) => arcH(QX, KX(i), 0.42, 40);

CSS.push(`
.llm-qkv .llm-qa{stroke-width:3px;opacity:.6;transition:stroke-dashoffset 1000ms ${EASE} var(--d,0ms),stroke-width 900ms ${EASE},opacity 900ms ${EASE}}
${at('qkv', 3)} .llm-qa{stroke-width:var(--w);opacity:var(--o)}
.llm-qkv .llm-qkv-av{transition:background-color 800ms ${EASE},box-shadow 800ms ${EASE}}
${at('qkv', 4)} .llm-qkv-av{background-color:${tone.mint.bg} !important;box-shadow:inset 0 0 0 3px ${tone.mint.fg} !important}
`);

const QArc = ({ i }: { i: number }) => {
  const w = QKV_W[i];
  return (
    <>
      <path
        d={arc(QX, KX(i), QKV_BY, qh(i))}
        pathLength={1}
        className="llm-draw2 llm-qa"
        fill="none"
        stroke={ink.accent}
        strokeLinecap="round"
        style={vars({ d: `${i * 120}ms`, w: `${(2 + 14 * w).toFixed(1)}px`, o: (0.3 + 0.7 * w).toFixed(2) })}
      />
      <path
        d={arc(KX(i), QX, QKV_BY, qh(i))}
        className="llm-fade4 llm-march"
        fill="none"
        stroke={tone.mint.fg}
        strokeLinecap="round"
        strokeDasharray="0 20"
        strokeWidth={Number((5 + 12 * w).toFixed(1))}
        style={vars({ d: '300ms' })}
      />
    </>
  );
};

const pill: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: mono,
  fontSize: 24,
  background: 'var(--osd-bg)',
  borderRadius: 8,
};

const QLabel = ({ i }: { i: number }) => {
  const x = (QX + KX(i)) / 2;
  const y = QKV_BY - 0.75 * qh(i) - (i === 4 ? 30 : 0);
  return (
    <div style={{ position: 'absolute', left: x - 55, top: y - 22, width: 110, height: 40 }}>
      <span className="llm-fade2 llm-off3" style={{ ...vars({ d: `${500 + i * 120}ms` }), ...pill, color: ink.soft }}>
        {fr(QKV_SCORES[i], 1)}
      </span>
      <span className="llm-fade3" style={{ ...vars({ d: `${i * 80}ms` }), ...pill, color: ink.accent, fontWeight: 600 }}>
        {pct(QKV_W[i])}
      </span>
    </div>
  );
};

const Badge = ({
  cx,
  y,
  label,
  c,
  className,
  d = 0,
  w = 48,
}: {
  cx: number;
  y: number;
  label: string;
  c: Tone;
  className?: string;
  d?: number;
  w?: number;
}) => (
  <div
    className={className}
    style={{
      ...vars({ d: `${d}ms` }),
      position: 'absolute',
      left: cx - w / 2,
      top: y,
      width: w,
      height: 34,
      boxSizing: 'border-box',
      borderRadius: 8,
      background: tone[c].bg,
      boxShadow: `inset 0 0 0 2px ${tone[c].bd}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: mono,
      fontSize: 22,
      fontWeight: 600,
      color: tone[c].fg,
    }}
  >
    {label}
  </div>
);

const LegendRow = ({
  top,
  n,
  badge,
  c,
  title,
  children,
}: {
  top: number;
  n: number;
  badge: string;
  c: Tone;
  title: string;
  children: ReactNode;
}) => (
  <div className={`llm-on${n}`} style={{ position: 'absolute', left: 1300, top, width: 480, display: 'flex', gap: 20 }}>
    <div
      style={{
        flex: 'none',
        width: 64,
        height: 40,
        marginTop: 2,
        borderRadius: 8,
        background: tone[c].bg,
        boxShadow: `inset 0 0 0 2px ${tone[c].bd}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: mono,
        fontSize: 22,
        fontWeight: 600,
        color: tone[c].fg,
      }}
    >
      {badge}
    </div>
    <div>
      <div style={{ fontFamily: serif, fontSize: 32, fontWeight: 500, lineHeight: 1.2 }}>{title}</div>
      <div style={{ fontSize: 28, lineHeight: 1.4, color: ink.soft }}>{children}</div>
    </div>
  </div>
);

const QueryKeyValue: Page = () => (
  <Frame id="qkv" eyebrow="03 · Attention" stage={3} beats={4}>
    <Title>Requête, clé, valeur</Title>
    <Lede>
      Chaque token produit trois vecteurs. La <Hl>requête</Hl> de « avocat » est comparée aux{' '}
      <Hl c="#cfe3f5">clés</Hl> des tokens qui le précèdent.
    </Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <QArc i={0} />
      <QArc i={1} />
      <QArc i={2} />
      <QArc i={3} />
      <QArc i={4} />
    </svg>
    <QLabel i={0} />
    <QLabel i={1} />
    <QLabel i={2} />
    <QLabel i={3} />
    <QLabel i={4} />

    <Badge cx={KX(0)} y={QKV_BY} label="K" c="sky" className="llm-on2" d={0} />
    <Badge cx={KX(1)} y={QKV_BY} label="K" c="sky" className="llm-on2" d={80} />
    <Badge cx={KX(2)} y={QKV_BY} label="K" c="sky" className="llm-on2" d={160} />
    <Badge cx={KX(3)} y={QKV_BY} label="K" c="sky" className="llm-on2" d={240} />
    <Badge cx={KX(4)} y={QKV_BY} label="K" c="sky" className="llm-on2" d={320} />
    <Badge cx={QX} y={QKV_BY} label="Q" c="accent" className="llm-on1" />

    <TokBox s={QKV[0]} y={QKV_Y} h={70} size={38}>Hier</TokBox>
    <TokBox s={QKV[1]} y={QKV_Y} h={70} size={38}>j'ai</TokBox>
    <TokBox s={QKV[2]} y={QKV_Y} h={70} size={38}>mangé</TokBox>
    <TokBox s={QKV[3]} y={QKV_Y} h={70} size={38}>un</TokBox>
    <TokBox s={QKV[4]} y={QKV_Y} h={70} size={38} t="butter" className="llm-qkv-av">avocat</TokBox>

    <div
      className="llm-on4"
      style={{ ...vars({ d: '700ms' }), position: 'absolute', left: 160, top: 884, fontSize: 28, color: tone.mint.fg, fontWeight: 500 }}
    >
      « avocat » puise surtout dans les valeurs de « mangé » : ici, c'est un fruit.
    </div>

    <LegendRow top={400} n={1} badge="Q" c="accent" title="Requête">
      ce que je cherche
    </LegendRow>
    <LegendRow top={510} n={2} badge="K" c="sky" title="Clé">
      ce que je propose
    </LegendRow>
    <LegendRow top={620} n={3} badge="σ" c="butter" title="Softmax">
      scores → pourcentages
    </LegendRow>
    <LegendRow top={730} n={4} badge="V" c="mint" title="Valeur">
      ce que je transmets
    </LegendRow>
    <div
      className="llm-on4"
      style={{ ...vars({ d: '400ms' }), position: 'absolute', left: 1300, top: 852, fontFamily: mono, fontSize: 28, color: ink.text }}
    >
      softmax(Q·Kᵀ / √d) · V
    </div>
  </Frame>
);

// ═══ 11 · La matrice d'attention ══════════════════════════════════════════════
const MAT_T = ['Le', 'chat', 'qui', 'dormait', 'a', 'soudain', 'miaulé'];
const MAT_W = [
  [1],
  [0.35, 0.65],
  [0.1, 0.7, 0.2],
  [0.05, 0.45, 0.35, 0.15],
  [0.05, 0.5, 0.1, 0.15, 0.2],
  [0.05, 0.15, 0.05, 0.2, 0.35, 0.2],
  [0.04, 0.62, 0.03, 0.08, 0.13, 0.05, 0.05],
];
const MGX = 340;
const MGY = 450;
const MP = 68;
const MC = 64;

CSS.push(`
.llm-mat .llm-mcell{transition:opacity 500ms ${EASE}}
${at('mat', 1)} .llm-mcell:not(.llm-hot){opacity:.16}
${at('mat', 3)} .llm-mcell.llm-mcell:not(.llm-hot){opacity:1}
`);

const MatRow = ({ r }: { r: number }) => (
  <div className="llm-in-fade" style={vars({ d: `${250 + r * 140}ms` })}>
    <div
      style={{
        position: 'absolute',
        left: 140,
        width: MGX - 140 - 16,
        top: MGY + r * MP,
        height: MC,
        lineHeight: `${MC}px`,
        textAlign: 'right',
        fontFamily: mono,
        fontSize: 26,
        color: r === 6 ? ink.text : ink.soft,
      }}
    >
      {MAT_T[r]}
    </div>
    {MAT_T.map((_, c) => {
      const w = MAT_W[r][c];
      const left = MGX + c * MP;
      const top = MGY + r * MP;
      if (w === undefined) {
        return (
          <div
            key={c}
            style={{ position: 'absolute', left, top, width: MC, height: MC, boxSizing: 'border-box', borderRadius: 6, border: `1.5px dashed ${ink.rule}` }}
          >
            <div
              className="llm-fade2"
              style={{
                ...vars({ d: `${(c - r) * 60}ms` }),
                position: 'absolute',
                inset: 0,
                borderRadius: 5,
                background: `repeating-linear-gradient(45deg, ${ink.rule} 0 3px, transparent 3px 11px)`,
              }}
            />
          </div>
        );
      }
      return (
        <div
          key={c}
          className={`llm-mcell${r === 6 ? ' llm-hot' : ''}`}
          style={{
            position: 'absolute',
            left,
            top,
            width: MC,
            height: MC,
            borderRadius: 6,
            background: `rgba(200, 69, 43, ${(0.07 + 0.9 * w).toFixed(3)})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {r === 6 ? (
            <span className="llm-fade1" style={{ ...vars({ d: `${c * 60}ms` }), fontFamily: mono, fontSize: 22, color: w > 0.4 ? '#fff' : ink.text }}>
              {Math.round(w * 100)}
            </span>
          ) : null}
        </div>
      );
    })}
  </div>
);

const ColLabel = ({ c }: { c: number }) => (
  <div
    style={{
      position: 'absolute',
      left: MGX + c * MP + 24,
      top: MGY - 40,
      transformOrigin: 'left bottom',
      transform: 'rotate(-45deg)',
      fontFamily: mono,
      fontSize: 24,
      color: c === 1 ? ink.text : ink.soft,
      whiteSpace: 'pre',
    }}
  >
    {MAT_T[c]}
  </div>
);

const Matrix: Page = () => (
  <Frame id="mat" eyebrow="03 · Attention" stage={3} beats={3}>
    <Title>Tous les tokens à la fois</Title>
    <Lede>
      Chaque token calcule ses poids vers tous les précédents : on obtient une <Hl>matrice</Hl>, une
      ligne par token.
    </Lede>
    <ColLabel c={0} />
    <ColLabel c={1} />
    <ColLabel c={2} />
    <ColLabel c={3} />
    <ColLabel c={4} />
    <ColLabel c={5} />
    <ColLabel c={6} />
    <MatRow r={0} />
    <MatRow r={1} />
    <MatRow r={2} />
    <MatRow r={3} />
    <MatRow r={4} />
    <MatRow r={5} />
    <MatRow r={6} />
    <div
      className="llm-fade1"
      style={{
        position: 'absolute',
        left: MGX - 7,
        top: MGY + 6 * MP - 7,
        width: 7 * MP - 4 + 14,
        height: MC + 14,
        boxSizing: 'border-box',
        border: `3px solid ${ink.text}`,
        borderRadius: 10,
      }}
    />
    <div
      className="llm-fade2"
      style={{
        ...vars({ d: '400ms' }),
        position: 'absolute',
        left: MGX + 3 * MP + 30,
        top: MGY + 40,
        padding: '4px 12px',
        background: 'var(--osd-bg)',
        borderRadius: 8,
        fontFamily: serif,
        fontStyle: 'italic',
        fontSize: 28,
        color: ink.soft,
      }}
    >
      le futur est masqué
    </div>

    <div style={{ position: 'absolute', left: 1000, top: 380, fontFamily: mono, fontSize: 22, color: ink.muted }}>
      ligne = token qui regarde · colonne = token regardé
    </div>
    <Note n="1" title="« miaulé » → « chat »" className="llm-on1" style={{ left: 1000, top: 440, width: 780 }}>
      62 % de son attention va vers le sujet : c'est bien le chat qui miaule.
    </Note>
    <Note n="2" title="Masque causal" className="llm-on2" style={{ left: 1000, top: 610, width: 780 }}>
      Un token ne voit jamais la suite ; sinon, prédire le mot suivant serait tricher.
    </Note>
    <Note n="3" title="Tout en parallèle" className="llm-on3" style={{ left: 1000, top: 780, width: 780 }}>
      Toutes les lignes se calculent d'un coup : des produits de matrices, idéal pour les GPU.
    </Note>
  </Frame>
);

// ═══ 12 · Plusieurs têtes ════════════════════════════════════════════════════
const HD = layoutRow(['Marie', 'a', 'prêté', 'son', 'livre', 'à', 'Paul', 'car', 'elle', 'part'], 30, 14, 16, 140);
const HD_Y = 660;
const HD_H = 56;

CSS.push(`
.llm-heads .llm-hA,.llm-heads .llm-hB,.llm-heads .llm-hC{transition:opacity 600ms ${EASE}}
${at('heads', 2)} .llm-hA{opacity:.22}
${at('heads', 3)} .llm-hB{opacity:.22}
${at('heads', 4)} .llm-hA,${at('heads', 4)} .llm-hB{opacity:1}
`);

const HeadCard = ({ top, n, c, title, children }: { top: number; n: number; c: Tone; title: string; children: ReactNode }) => (
  <div
    className={`llm-on${n}`}
    style={{
      position: 'absolute',
      left: 1290,
      top,
      width: 490,
      boxSizing: 'border-box',
      padding: '20px 26px',
      background: ink.card,
      borderRadius: 14,
      boxShadow: `0 0 0 1.5px ${ink.rule}`,
      borderLeft: `6px solid ${tone[c].bd}`,
    }}
  >
    <div style={{ fontFamily: serif, fontSize: 30, fontWeight: 500, lineHeight: 1.2, color: tone[c].fg }}>{title}</div>
    <div style={{ fontSize: 28, lineHeight: 1.4, color: ink.soft, marginTop: 4 }}>{children}</div>
  </div>
);

const Heads: Page = () => (
  <Frame id="heads" eyebrow="03 · Attention" stage={3} beats={4}>
    <Title>Plusieurs têtes, plusieurs regards</Title>
    <Lede>
      Chaque couche fait tourner de nombreuses <Hl>têtes d'attention</Hl> en parallèle ; chacune
      apprend à repérer sa propre relation.
    </Lede>
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <g className="llm-hA">
        <ArcArrow x1={HD[2].cx} x2={HD[0].cx + 22} y={HD_Y} h={arcH(HD[2].cx, HD[0].cx, 0.3, 30)} color={tone.sky.fg} w={4} n={1} />
        <ArcArrow x1={HD[9].cx} x2={HD[8].cx + 10} y={HD_Y} h={arcH(HD[9].cx, HD[8].cx, 0.3, 30)} color={tone.sky.fg} w={4} n={1} d={200} />
      </g>
      <g className="llm-hB">
        <ArcArrow x1={HD[8].cx} x2={HD[0].cx - 22} y={HD_Y} h={arcH(HD[8].cx, HD[0].cx, 0.36, 30)} color={tone.rose.fg} w={4} n={2} />
        <ArcArrow x1={HD[3].cx} x2={HD[0].cx} y={HD_Y} h={arcH(HD[3].cx, HD[0].cx, 0.36, 30)} color={tone.rose.fg} w={4} n={2} d={200} />
      </g>
      <g className="llm-hC">
        <ArcArrow x1={HD[1].cx} x2={HD[0].cx} y={HD_Y + HD_H} h={-44} color={tone.butter.fg} w={3} n={3} />
        <ArcArrow x1={HD[2].cx} x2={HD[1].cx} y={HD_Y + HD_H} h={-44} color={tone.butter.fg} w={3} n={3} d={60} />
        <ArcArrow x1={HD[3].cx} x2={HD[2].cx} y={HD_Y + HD_H} h={-44} color={tone.butter.fg} w={3} n={3} d={120} />
        <ArcArrow x1={HD[4].cx} x2={HD[3].cx} y={HD_Y + HD_H} h={-44} color={tone.butter.fg} w={3} n={3} d={180} />
        <ArcArrow x1={HD[5].cx} x2={HD[4].cx} y={HD_Y + HD_H} h={-44} color={tone.butter.fg} w={3} n={3} d={240} />
        <ArcArrow x1={HD[6].cx} x2={HD[5].cx} y={HD_Y + HD_H} h={-44} color={tone.butter.fg} w={3} n={3} d={300} />
        <ArcArrow x1={HD[7].cx} x2={HD[6].cx} y={HD_Y + HD_H} h={-44} color={tone.butter.fg} w={3} n={3} d={360} />
        <ArcArrow x1={HD[8].cx} x2={HD[7].cx} y={HD_Y + HD_H} h={-44} color={tone.butter.fg} w={3} n={3} d={420} />
        <ArcArrow x1={HD[9].cx} x2={HD[8].cx} y={HD_Y + HD_H} h={-44} color={tone.butter.fg} w={3} n={3} d={480} />
      </g>
    </svg>

    <TokBox s={HD[0]} y={HD_Y} h={HD_H} size={30}>Marie</TokBox>
    <TokBox s={HD[1]} y={HD_Y} h={HD_H} size={30}>a</TokBox>
    <TokBox s={HD[2]} y={HD_Y} h={HD_H} size={30}>prêté</TokBox>
    <TokBox s={HD[3]} y={HD_Y} h={HD_H} size={30}>son</TokBox>
    <TokBox s={HD[4]} y={HD_Y} h={HD_H} size={30}>livre</TokBox>
    <TokBox s={HD[5]} y={HD_Y} h={HD_H} size={30}>à</TokBox>
    <TokBox s={HD[6]} y={HD_Y} h={HD_H} size={30}>Paul</TokBox>
    <TokBox s={HD[7]} y={HD_Y} h={HD_H} size={30}>car</TokBox>
    <TokBox s={HD[8]} y={HD_Y} h={HD_H} size={30}>elle</TokBox>
    <TokBox s={HD[9]} y={HD_Y} h={HD_H} size={30}>part</TokBox>

    <HeadCard top={390} n={1} c="sky" title="Tête 1 · qui fait l'action ?">
      relie chaque verbe à son sujet
    </HeadCard>
    <HeadCard top={565} n={2} c="rose" title="Tête 2 · de qui parle-t-on ?">
      relie les pronoms à ce qu'ils désignent
    </HeadCard>
    <HeadCard top={740} n={3} c="butter" title="Tête 3 · juste avant ?">
      regarde toujours le token précédent
    </HeadCard>

    <div className="llm-on4" style={{ position: 'absolute', left: 140, top: 800, width: 1060, fontSize: 30, lineHeight: 1.45 }}>
      GPT‑3 : 96 couches × 96 têtes. Personne ne programme ces rôles :{' '}
      <Hl>ils émergent de l'entraînement</Hl>.
    </div>
  </Frame>
);

// ═══ 13 · Le bloc Transformer ════════════════════════════════════════════════
CSS.push(`
.llm-block .llm-blk-box{fill:${ink.panel};stroke:${ink.rule};transition:fill 700ms ${EASE},stroke 700ms ${EASE}}
${at('block', 1)} .llm-blk-att{fill:${tone.lav.bg};stroke:${tone.lav.bd}}
${at('block', 2)} .llm-blk-mlp{fill:${tone.mint.bg};stroke:${tone.mint.bd}}
`);

const BlockBox = ({ y, cls, title, sub }: { y: number; cls: string; title: string; sub: string }) => (
  <g>
    <rect x={390} y={y} width={230} height={80} rx={12} strokeWidth={2.5} className={`llm-blk-box ${cls}`} />
    <text x={505} y={y + 38} textAnchor="middle" style={{ fontFamily: serif, fontSize: 30, fontWeight: 500 }} fill={ink.text}>
      {title}
    </text>
    <text x={505} y={y + 66} textAnchor="middle" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
      {sub}
    </text>
  </g>
);

const PlusNode = ({ y }: { y: number }) => (
  <g>
    <circle cx={300} cy={y} r={18} fill={ink.card} stroke={ink.soft} strokeWidth={2.5} />
    <path d={`M 291 ${y} H 309 M 300 ${y - 9} V ${y + 9}`} stroke={ink.soft} strokeWidth={2.5} strokeLinecap="round" />
  </g>
);

const Branch = ({ yIn, yTop, yNode, n }: { yIn: number; yTop: number; yNode: number; n: number }) => {
  const out = `M 505 ${yTop} V ${yNode} H 334`;
  return (
    <g>
      <path d={`M 300 ${yIn} H 374`} stroke={ink.soft} strokeWidth={2.5} fill="none" />
      <polygon points={`390,${yIn} 374,${yIn - 8} 374,${yIn + 8}`} fill={ink.soft} />
      <path d={out} stroke={ink.soft} strokeWidth={2.5} fill="none" />
      <polygon points={`318,${yNode} 334,${yNode - 8} 334,${yNode + 8}`} fill={ink.soft} />
      <path
        d={`M 300 ${yIn} H 388`}
        className={`llm-fade${n} llm-march`}
        stroke={ink.accent}
        strokeWidth={7}
        strokeLinecap="round"
        strokeDasharray="0 20"
        fill="none"
      />
      <path
        d={`M 505 ${yTop} V ${yNode} H 320`}
        className={`llm-fade${n} llm-march`}
        stroke={ink.accent}
        strokeWidth={7}
        strokeLinecap="round"
        strokeDasharray="0 20"
        fill="none"
      />
    </g>
  );
};

const Ghost = ({ o, k }: { o: number; k: number }) => (
  <rect
    x={150 + o}
    y={92 - o}
    width={500}
    height={342}
    rx={18}
    fill="none"
    stroke={ink.faint}
    strokeWidth={2}
    strokeDasharray="8 8"
    className="llm-fade3"
    style={vars({ d: `${k * 180}ms` })}
  />
);

const Block: Page = () => (
  <Frame id="block" eyebrow="04 · Transformer" stage={4} beats={3}>
    <Title>Un bloc Transformer, empilé N fois</Title>
    <Lede>
      L'attention fait circuler l'information <Hl>entre</Hl> les tokens ; le MLP la transforme,{' '}
      <Hl c="#cfeadb">token par token</Hl>.
    </Lede>
    <svg width={920} height={500} style={{ position: 'absolute', left: 140, top: 380, overflow: 'visible' }}>
      <Ghost o={32} k={1} />
      <Ghost o={16} k={0} />
      <rect x={150} y={92} width={500} height={342} rx={18} fill={ink.card} fillOpacity={0.6} stroke={ink.rule} strokeWidth={2} />

      <line x1={300} y1={452} x2={300} y2={48} stroke="#e8e1d1" strokeWidth={16} strokeLinecap="round" />
      <path d="M 300 446 V 54" className="llm-march" stroke={ink.accent} strokeOpacity={0.55} strokeWidth={7} strokeLinecap="round" strokeDasharray="0 20" fill="none" />
      <text x={262} y={262} textAnchor="middle" transform="rotate(-90 262 262)" style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 24 }} fill={ink.muted}>
        flux résiduel
      </text>

      <Branch yIn={370} yTop={330} yNode={280} n={1} />
      <Branch yIn={210} yTop={170} yNode={120} n={2} />
      <BlockBox y={330} cls="llm-blk-att" title="Attention" sub="multi-têtes" />
      <BlockBox y={170} cls="llm-blk-mlp" title="MLP" sub="feed-forward" />
      <PlusNode y={280} />
      <PlusNode y={120} />

      <rect x={170} y={0} width={260} height={48} rx={10} fill={ink.card} stroke={ink.rule} strokeWidth={2} />
      <text x={300} y={32} textAnchor="middle" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.soft}>
        vecteurs enrichis
      </text>
      <rect x={170} y={452} width={260} height={48} rx={10} fill={ink.card} stroke={ink.rule} strokeWidth={2} />
      <text x={300} y={484} textAnchor="middle" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.soft}>
        vecteurs d'entrée
      </text>

      <text x={700} y={290} className="llm-fade3" style={{ ...vars({ d: '400ms' }), fontFamily: serif, fontStyle: 'italic', fontSize: 76 }} fill={ink.accent}>
        × N
      </text>
      <text x={702} y={334} className="llm-fade3" style={{ ...vars({ d: '500ms' }), fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
        32 à 96+ blocs
      </text>
    </svg>

    <Note n="1" title="Attention" className="llm-on1" style={{ left: 1080, top: 400, width: 700 }}>
      Les tokens échangent de l'information : c'est ce que l'on vient de voir.
    </Note>
    <Note n="2" title="MLP" className="llm-on2" style={{ left: 1080, top: 560, width: 700 }}>
      Chaque vecteur est transformé seul. Environ ⅔ des paramètres sont ici.
    </Note>
    <Note n="3" title="× N blocs" className="llm-on3" style={{ left: 1080, top: 720, width: 700 }}>
      32 blocs pour Llama 3 8B, 96 pour GPT‑3. Chacun affine un peu plus les vecteurs.
    </Note>
    <Fig n={4} style={{ left: 140, top: 900 }}>
      Le flux résiduel : chaque étape y ajoute (+) sa contribution.
    </Fig>
  </Frame>
);

// ═══ 14 · Du vecteur au mot ══════════════════════════════════════════════════
const LG_Z = [...NEXT_LOGITS, -4.2];
const LG_P = softmax(LG_Z);
const LG_VEC = [0.6, -0.4, 0.9, -0.8, 0.2, 0.5, -0.1, 0.7];
const LG_ZERO = 856;
const LG_K = 45;

CSS.push(`
.llm-logits .llm-lg{transform:scaleX(0);transition:transform 800ms ${EASE} var(--d,0ms)}
${at('logits', 1)} .llm-lg{transform:scaleX(1)}
.llm-logits .llm-pb{transform:scaleX(0);transition:transform 900ms ${EASE} var(--d,0ms)}
${at('logits', 2)} .llm-pb{transform:scaleX(1)}
`);

const LogitRow = ({ i, label }: { i: number; label: string }) => {
  const z = LG_Z[i];
  const p = LG_P[i];
  const top = 446 + i * 50;
  const zw = Math.abs(z) * LG_K;
  return (
    <>
      <div className="llm-fade1" style={{ ...vars({ d: `${i * 70}ms` }), position: 'absolute', left: 520, top, width: 130, height: 40, lineHeight: '40px', textAlign: 'right', fontFamily: mono, fontSize: 26 }}>
        {label}
      </div>
      <div
        className="llm-lg"
        style={{
          ...vars({ d: `${i * 70}ms` }),
          position: 'absolute',
          left: z >= 0 ? LG_ZERO : LG_ZERO - zw,
          top: top + 6,
          width: zw,
          height: 28,
          borderRadius: 5,
          background: z >= 0 ? ink.soft : tone.sky.bd,
          transformOrigin: z >= 0 ? 'left center' : 'right center',
        }}
      />
      <div
        className="llm-fade1"
        style={{
          ...vars({ d: `${300 + i * 70}ms` }),
          position: 'absolute',
          left: (z >= 0 ? LG_ZERO + zw : LG_ZERO) + 12,
          top,
          height: 40,
          lineHeight: '40px',
          fontFamily: mono,
          fontSize: 24,
          color: z >= 0 ? ink.soft : tone.sky.fg,
        }}
      >
        {fr(z, 1)}
      </div>

      <div className="llm-fade2" style={{ ...vars({ d: `${i * 70}ms` }), position: 'absolute', left: 1200, top, width: 130, height: 40, lineHeight: '40px', textAlign: 'right', fontFamily: mono, fontSize: 26, color: i === 0 ? ink.accent : ink.text, fontWeight: i === 0 ? 600 : 400 }}>
        {label}
      </div>
      <div
        className="llm-pb"
        style={{
          ...vars({ d: `${200 + i * 70}ms` }),
          position: 'absolute',
          left: 1346,
          top: top + 6,
          width: Math.max(2, Math.round((p / 0.45) * 300)),
          height: 28,
          borderRadius: 5,
          background: i === 0 ? ink.accent : ink.soft,
          transformOrigin: 'left center',
        }}
      />
      <div
        className="llm-fade2"
        style={{
          ...vars({ d: `${500 + i * 70}ms` }),
          position: 'absolute',
          left: 1346 + Math.max(2, Math.round((p / 0.45) * 300)) + 14,
          top,
          height: 40,
          lineHeight: '40px',
          fontFamily: mono,
          fontSize: 24,
          color: ink.muted,
        }}
      >
        {pct(p)}
      </div>
    </>
  );
};

const Logits: Page = () => (
  <Frame id="logits" eyebrow="05 · Prédiction" stage={5} beats={3}>
    <Title>Du dernier vecteur au prochain token</Title>
    <Lede>
      Le vecteur final est projeté sur tout le vocabulaire : <Hl>un score par token</Hl>. Puis
      softmax en fait des probabilités.
    </Lede>

    <div style={{ position: 'absolute', left: 140, top: 398, fontFamily: mono, fontSize: 22, color: ink.muted }}>
      vecteur de « le »
    </div>
    <div style={{ position: 'absolute', left: 150, top: 446, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {LG_VEC.map((v, k) => (
        <span key={k} style={{ width: 40, height: 36, borderRadius: 5, background: divColor(v) }} />
      ))}
      <span style={{ textAlign: 'center', fontSize: 26, color: ink.faint }}>⋮</span>
    </div>
    <div
      style={{
        position: 'absolute',
        left: 262,
        top: 540,
        width: 196,
        height: 120,
        boxSizing: 'border-box',
        borderRadius: 14,
        background: ink.card,
        boxShadow: `0 0 0 2px ${ink.rule}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: mono,
        fontSize: 22,
        lineHeight: 1.35,
        textAlign: 'center',
      }}
    >
      <span>× matrice</span>
      <span>de sortie</span>
      <span style={{ color: ink.muted }}>d × vocab</span>
    </div>
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <Arrow x1={204} y1={600} x2={256} y2={600} head={12} />
      <Arrow x1={466} y1={600} x2={512} y2={600} head={12} n={1} color={ink.accent} />
      <line className="llm-fade1" x1={LG_ZERO} y1={438} x2={LG_ZERO} y2={850} stroke={ink.faint} strokeWidth={2} />
      <Arrow x1={1066} y1={600} x2={1176} y2={600} n={2} color={ink.accent} w={4} />
    </svg>

    <div className="llm-fade1" style={{ position: 'absolute', left: 520, top: 398, fontFamily: mono, fontSize: 22, color: ink.muted }}>
      logits : scores bruts
    </div>
    <LogitRow i={0} label={NEXT[0]} />
    <LogitRow i={1} label={NEXT[1]} />
    <LogitRow i={2} label={NEXT[2]} />
    <LogitRow i={3} label={NEXT[3]} />
    <LogitRow i={4} label={NEXT[4]} />
    <LogitRow i={5} label={NEXT[5]} />
    <LogitRow i={6} label="zèbre" />
    <div className="llm-fade1" style={{ ...vars({ d: '600ms' }), position: 'absolute', left: 520, top: 806, width: 520, fontFamily: mono, fontSize: 22, color: ink.muted }}>
      … et ~100 000 autres tokens
    </div>

    <div className="llm-fade2" style={{ position: 'absolute', left: 1066, width: 110, top: 552, textAlign: 'center', fontFamily: mono, fontSize: 24, color: ink.accent }}>
      softmax
    </div>
    <div className="llm-fade2" style={{ ...vars({ d: '300ms' }), position: 'absolute', left: 1046, width: 150, top: 618, textAlign: 'center', fontFamily: mono, fontSize: 22, color: ink.muted }}>
      eᶻ / Σ eᶻ
    </div>
    <div className="llm-fade2" style={{ position: 'absolute', left: 1200, top: 398, fontFamily: mono, fontSize: 22, color: ink.muted }}>
      probabilités · somme = 100 %
    </div>

    <div className="llm-on3" style={{ position: 'absolute', left: 140, top: 878, fontSize: 32, lineHeight: 1.4 }}>
      Le modèle ne choisit rien : il produit une <Hl>distribution</Hl>. Choisir, c'est l'étape
      suivante.
    </div>
  </Frame>
);

// ═══ 15 · La température ═════════════════════════════════════════════════════
const TEMPS = [1, 0.2, 2];
const TP = TEMPS.map((t) => softmax(NEXT_LOGITS, t));
const T_MAX_H = 400;
const tX = (t: number) => `${1160 + (t / 2) * 600 - 14}px`;

CSS.push(`
.llm-temp .llm-tb{height:var(--h0);transition:height 900ms ${EASE}}
${at('temp', 1)} .llm-tb{height:var(--h1)}
${at('temp', 2)} .llm-tb{height:var(--h2)}
.llm-temp .llm-tA,.llm-temp .llm-tB,.llm-temp .llm-tC{transition:opacity 450ms ${EASE}}
.llm-temp .llm-tB,.llm-temp .llm-tC{opacity:0}
${at('temp', 1)} .llm-tA{opacity:0}
${at('temp', 1)} .llm-tB{opacity:1}
${at('temp', 2)} .llm-tB{opacity:0}
${at('temp', 2)} .llm-tC{opacity:1}
.llm-temp .llm-tmark{left:var(--x0);transition:left 900ms ${EASE}}
${at('temp', 1)} .llm-tmark{left:var(--x1)}
${at('temp', 2)} .llm-tmark{left:var(--x2)}
`);

const stateLayer: CSSProperties = { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 };

const TempBar = ({ i }: { i: number }) => (
  <div
    style={{
      position: 'absolute',
      left: 170 + i * 150,
      top: 860 - T_MAX_H - 44,
      width: 110,
      height: T_MAX_H + 44,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    }}
  >
    <div style={{ position: 'relative', height: 40, marginBottom: 4, fontFamily: mono, fontSize: 24, textAlign: 'center', color: i === 0 ? ink.accent : ink.soft }}>
      <span className="llm-tA" style={stateLayer}>{pct(TP[0][i])}</span>
      <span className="llm-tB" style={stateLayer}>{pct(TP[1][i])}</span>
      <span className="llm-tC" style={stateLayer}>{pct(TP[2][i])}</span>
    </div>
    <div
      className="llm-tb"
      style={{
        ...vars({
          h0: `${Math.max(3, Math.round(TP[0][i] * T_MAX_H))}px`,
          h1: `${Math.max(3, Math.round(TP[1][i] * T_MAX_H))}px`,
          h2: `${Math.max(3, Math.round(TP[2][i] * T_MAX_H))}px`,
        }),
        borderRadius: '6px 6px 0 0',
        background: i === 0 ? ink.accent : ink.soft,
      }}
    />
    <div style={{ position: 'absolute', top: '100%', left: -20, right: -20, marginTop: 14, textAlign: 'center', fontFamily: mono, fontSize: 26 }}>
      {NEXT[i]}
    </div>
  </div>
);

const Temperature: Page = () => (
  <Frame id="temp" eyebrow="05 · Prédiction" stage={5} beats={3}>
    <Title>Choisir un token : la température</Title>
    <Lede>
      On divise les logits par <Hl>T</Hl> avant le softmax. Petit T : prudent, répétitif. Grand T :
      créatif… et risqué.
    </Lede>

    <div style={{ position: 'absolute', left: 170, top: 382, fontFamily: mono, fontSize: 22, color: ink.muted }}>
      P(token | « Le chat dort sur le »)
    </div>
    <TempBar i={0} />
    <TempBar i={1} />
    <TempBar i={2} />
    <TempBar i={3} />
    <TempBar i={4} />
    <TempBar i={5} />
    <div style={{ position: 'absolute', left: 150, top: 860, width: 900, height: 2, background: ink.faint }} />

    <div style={{ position: 'absolute', left: 1160, top: 392, fontFamily: mono, fontSize: 22, color: ink.muted }}>
      température
    </div>
    <div style={{ position: 'absolute', left: 1160, top: 424, width: 600, height: 80, fontFamily: serif, fontSize: 64, fontWeight: 500, lineHeight: '80px' }}>
      <span className="llm-tA" style={stateLayer}>T = 1,0</span>
      <span className="llm-tB" style={{ ...stateLayer, color: tone.sky.fg }}>T = 0,2</span>
      <span className="llm-tC" style={{ ...stateLayer, color: ink.accent }}>T = 2,0</span>
    </div>
    <div
      style={{
        position: 'absolute',
        left: 1160,
        top: 540,
        width: 600,
        height: 8,
        borderRadius: 4,
        background: `linear-gradient(90deg, ${tone.sky.bd}, ${tone.peach.bd}, ${ink.accent})`,
      }}
    />
    <div
      className="llm-tmark"
      style={{
        ...vars({ x0: tX(TEMPS[0]), x1: tX(TEMPS[1]), x2: tX(TEMPS[2]) }),
        position: 'absolute',
        top: 530,
        width: 28,
        height: 28,
        boxSizing: 'border-box',
        borderRadius: 999,
        background: ink.card,
        border: `4px solid ${ink.text}`,
      }}
    />
    <div style={{ position: 'absolute', left: 1150, top: 568, fontFamily: mono, fontSize: 22, color: ink.muted }}>0</div>
    <div style={{ position: 'absolute', left: 1453, top: 568, fontFamily: mono, fontSize: 22, color: ink.muted }}>1</div>
    <div style={{ position: 'absolute', left: 1753, top: 568, fontFamily: mono, fontSize: 22, color: ink.muted }}>2</div>

    <div style={{ position: 'absolute', left: 1160, top: 628, fontFamily: mono, fontSize: 22, color: ink.muted }}>
      trois tirages
    </div>
    <div style={{ position: 'absolute', left: 1160, top: 664, width: 620, height: 64 }}>
      <div className="llm-tA" style={{ ...stateLayer, display: 'flex', gap: 12 }}>
        <Chip size={28}>canapé</Chip>
        <Chip size={28}>lit</Chip>
        <Chip size={28}>tapis</Chip>
      </div>
      <div className="llm-tB" style={{ ...stateLayer, display: 'flex', gap: 12 }}>
        <Chip size={28}>canapé</Chip>
        <Chip size={28}>canapé</Chip>
        <Chip size={28}>canapé</Chip>
      </div>
      <div className="llm-tC" style={{ ...stateLayer, display: 'flex', gap: 12 }}>
        <Chip size={28}>piano</Chip>
        <Chip size={28}>toit</Chip>
        <Chip size={28}>rebord</Chip>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1160, top: 748, width: 620, height: 44, fontFamily: serif, fontStyle: 'italic', fontSize: 30, color: ink.soft }}>
      <span className="llm-tA" style={stateLayer}>varié, mais sensé</span>
      <span className="llm-tB" style={stateLayer}>prévisible, presque déterministe</span>
      <span className="llm-tC" style={stateLayer}>surprenant… parfois absurde</span>
    </div>
    <div className="llm-on3" style={{ position: 'absolute', left: 1160, top: 818, width: 620, fontSize: 28, lineHeight: 1.4, color: ink.text }}>
      T → 0 : toujours le plus probable (greedy). Variantes : top‑k, top‑p.
    </div>
  </Frame>
);

// ═══ 16 · La boucle autorégressive ═══════════════════════════════════════════
const LOOP = layoutRow(['Le', 'chat', 'dort', 'sur', 'le', 'canapé', '.', '<fin>'], 36, 16, 12, 140);
const LOOP_Y = 760;
const LOOP_FEED = 'M 1450 572 Q 1440 792 1102 792';

CSS.push(`
@keyframes llm-pass{0%,100%{background-color:${ink.rule}}14%,34%{background-color:${ink.accent}}}
.llm-loop.llm-live .llm-layer{animation:llm-pass 1.8s ${EASE} var(--d,0ms) infinite}
`);

const Layer = ({ k }: { k: number }) => (
  <span className="llm-layer" style={{ ...vars({ d: `${k * 150}ms` }), width: 300, height: 7, borderRadius: 4, background: ink.rule }} />
);

const OutState = ({ cls, token, p, special }: { cls: string; token: string; p: string; special?: boolean }) => (
  <div className={cls} style={{ ...stateLayer, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
    <span style={{ fontFamily: mono, fontSize: 44, fontWeight: 500, color: special ? ink.muted : ink.accent }}>{token}</span>
    <span style={{ fontFamily: mono, fontSize: 22, color: ink.muted }}>{p}</span>
  </div>
);

const Loop: Page = () => (
  <Frame id="loop" eyebrow="05 · Prédiction" stage={5} beats={4}>
    <Title>Un token à la fois, en boucle</Title>
    <Lede>
      Le token choisi est <Hl>ajouté à la fin du texte</Hl>, et tout recommence. C'est ainsi qu'un LLM
      écrit.
    </Lede>

    <div
      style={{
        position: 'absolute',
        left: 760,
        top: 390,
        width: 400,
        height: 210,
        boxSizing: 'border-box',
        padding: '22px 0',
        borderRadius: 18,
        background: ink.card,
        boxShadow: `0 0 0 2px ${ink.rule}, 0 16px 40px -24px rgba(60, 40, 10, 0.4)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ fontFamily: serif, fontSize: 48, fontWeight: 500, lineHeight: 1.1 }}>LLM</div>
      <div style={{ fontFamily: mono, fontSize: 22, color: ink.muted, marginTop: 2 }}>Transformer × N</div>
      <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 6, marginTop: 18 }}>
        <Layer k={0} />
        <Layer k={1} />
        <Layer k={2} />
        <Layer k={3} />
        <Layer k={4} />
      </div>
    </div>

    <div style={{ position: 'absolute', left: 1280, top: 392, fontFamily: mono, fontSize: 22, color: ink.muted }}>
      prochain token
    </div>
    <div
      style={{
        position: 'absolute',
        left: 1280,
        top: 430,
        width: 340,
        height: 130,
        boxSizing: 'border-box',
        borderRadius: 16,
        border: `2.5px dashed ${ink.accent}`,
        background: ink.card,
      }}
    >
      <div className="llm-off1" style={{ ...stateLayer, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontSize: 44, color: ink.faint }}>
        ?
      </div>
      <OutState cls="llm-fade1 llm-off2" token="canapé" p={`p = ${pct(NEXT_P[0])}`} />
      <OutState cls="llm-fade2 llm-off3" token="." p="p = 71 %" />
      <OutState cls="llm-fade3" token="<fin>" p="p = 88 % · on s'arrête" special />
    </div>

    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <Arrow x1={540} y1={752} x2={748} y2={495} curve={-140} />
      <Arrow x1={1166} y1={495} x2={1272} y2={495} />
      <path d={LOOP_FEED} fill="none" stroke={ink.accent} strokeWidth={3} />
      <polygon points="1084,792 1102,783 1102,801" fill={ink.accent} />
      <path d={LOOP_FEED} className="llm-march" fill="none" stroke={ink.accent} strokeWidth={8} strokeLinecap="round" strokeDasharray="0 20" opacity={0.7} />
    </svg>
    <div style={{ position: 'absolute', left: 140, top: 676, fontFamily: mono, fontSize: 22, color: ink.muted }}>
      entrée : tout le texte
    </div>
    <div style={{ position: 'absolute', left: 1480, top: 640, fontFamily: serif, fontStyle: 'italic', fontSize: 28, color: ink.accent }}>
      ajouté à la suite
    </div>

    <TokBox s={LOOP[0]} y={LOOP_Y} h={64} size={36}>Le</TokBox>
    <TokBox s={LOOP[1]} y={LOOP_Y} h={64} size={36}>chat</TokBox>
    <TokBox s={LOOP[2]} y={LOOP_Y} h={64} size={36}>dort</TokBox>
    <TokBox s={LOOP[3]} y={LOOP_Y} h={64} size={36}>sur</TokBox>
    <TokBox s={LOOP[4]} y={LOOP_Y} h={64} size={36}>le</TokBox>
    <TokBox s={LOOP[5]} y={LOOP_Y} h={64} size={36} t="accent" className="llm-on1" style={{ ...vars({ d: '350ms' }), color: ink.accent }}>
      canapé
    </TokBox>
    <TokBox s={LOOP[6]} y={LOOP_Y} h={64} size={36} t="accent" className="llm-on2" style={{ ...vars({ d: '350ms' }), color: ink.accent }}>
      .
    </TokBox>
    <TokBox
      s={LOOP[7]}
      y={LOOP_Y}
      h={64}
      size={36}
      className="llm-on3"
      style={{ ...vars({ d: '350ms' }), boxShadow: 'none', border: `2px dashed ${ink.faint}`, color: ink.muted, background: 'transparent' }}
    >
      {'<fin>'}
    </TokBox>

    <div className="llm-on4" style={{ position: 'absolute', left: 140, top: 872, fontSize: 30, lineHeight: 1.4 }}>
      Chaque passe relit tout le contexte ; le <Hl>cache KV</Hl> garde les calculs déjà faits pour
      aller plus vite.
    </div>
  </Frame>
);

// ═══ 17 · Pré-entraînement ═══════════════════════════════════════════════════
const TR = ['Paris', 'Lyon', 'une', 'située', 'Marseille'];
const TR_P0 = [0.31, 0.22, 0.12, 0.09, 0.06];
const TR_P1 = [0.58, 0.12, 0.09, 0.07, 0.04];
const TR_SCALE = 620;

const lossRand = rng(11);
const LOSS_PATH = (() => {
  let d = '';
  for (let k = 0; k <= 80; k++) {
    const t = k / 80;
    const loss = 0.12 + 0.88 * Math.exp(-4.5 * t);
    const noise = (lossRand() - 0.5) * 18 * (1 - 0.6 * t);
    const x = 70 + t * 680;
    const y = Math.min(328, 330 - loss * 280 + noise);
    d += `${k === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d.trim();
})();

CSS.push(`
.llm-train .llm-trb{width:var(--w0);transition:width 1000ms ${EASE},background-color 600ms ${EASE}}
${at('train', 2)} .llm-trb{width:var(--w1)}
${at('train', 1)} .llm-trb-ok{background-color:${tone.mint.fg} !important}
${at('train', 1)} .llm-trl-ok{color:${tone.mint.fg} !important;font-weight:600}
`);

const TrainRow = ({ i }: { i: number }) => (
  <div style={{ position: 'absolute', left: 140, top: 500 + i * 56, height: 44, display: 'flex', alignItems: 'center' }}>
    <span
      className={i === 0 ? 'llm-trl-ok' : undefined}
      style={{ width: 150, textAlign: 'right', fontFamily: mono, fontSize: 26, marginRight: 20 }}
    >
      {TR[i]}
    </span>
    <span
      className={`llm-trb${i === 0 ? ' llm-trb-ok' : ''}`}
      style={{
        ...vars({ w0: `${Math.round(TR_P0[i] * TR_SCALE)}px`, w1: `${Math.round(TR_P1[i] * TR_SCALE)}px` }),
        height: 30,
        borderRadius: 5,
        background: ink.soft,
      }}
    />
    <span style={{ position: 'absolute', left: 560, width: 100, height: 44, lineHeight: '44px', fontFamily: mono, fontSize: 24, color: ink.muted }}>
      <span className="llm-off2" style={{ position: 'absolute', left: 0, top: 0 }}>{pct(TR_P0[i])}</span>
      <span className="llm-fade2" style={{ position: 'absolute', left: 0, top: 0, color: i === 0 ? tone.mint.fg : ink.muted }}>
        {pct(TR_P1[i])}
      </span>
    </span>
  </div>
);

const Training: Page = () => (
  <Frame id="train" eyebrow="06 · Entraînement" stage={6} beats={4}>
    <Title>Apprendre en devinant le token suivant</Title>
    <Lede>
      On prend un vrai texte, on cache la suite, le modèle parie. <Hl>L'erreur</Hl> sert à ajuster ses
      milliards de paramètres.
    </Lede>

    <div style={{ position: 'absolute', left: 140, top: 392, display: 'flex', alignItems: 'baseline', gap: 16, fontFamily: serif, fontSize: 46, lineHeight: 1.1 }}>
      <span>La capitale de la France est</span>
      <span style={{ position: 'relative', display: 'inline-block', width: 170, height: 52, borderBottom: `3px dashed ${ink.faint}`, textAlign: 'center' }}>
        <span className="llm-off1" style={{ position: 'absolute', inset: 0, color: ink.faint }}>?</span>
        <span className="llm-on1" style={{ position: 'absolute', inset: 0, color: tone.mint.fg, fontStyle: 'italic' }}>Paris</span>
      </span>
    </div>
    <div style={{ position: 'absolute', left: 140, top: 462, fontFamily: mono, fontSize: 22, color: ink.muted }}>
      prédiction du modèle
    </div>
    <TrainRow i={0} />
    <TrainRow i={1} />
    <TrainRow i={2} />
    <TrainRow i={3} />
    <TrainRow i={4} />

    <div style={{ position: 'absolute', left: 140, top: 790, width: 800, height: 44, fontFamily: mono, fontSize: 30 }}>
      <span className="llm-fade1 llm-off2" style={{ position: 'absolute', left: 0, top: 0, color: ink.accent }}>
        erreur = −log({fr(TR_P0[0])}) = {fr(-Math.log(TR_P0[0]))}
      </span>
      <span className="llm-fade2" style={{ ...vars({ d: '500ms' }), position: 'absolute', left: 0, top: 0, color: tone.mint.fg }}>
        erreur = −log({fr(TR_P1[0])}) = {fr(-Math.log(TR_P1[0]))} ↓
      </span>
    </div>
    <div className="llm-on2" style={{ position: 'absolute', left: 140, top: 850, width: 780, fontSize: 28, lineHeight: 1.4, color: ink.soft }}>
      Rétropropagation : chaque paramètre bouge d'un pas minuscule dans le sens qui réduit l'erreur.
    </div>

    <svg width={780} height={380} style={{ position: 'absolute', left: 1000, top: 400, overflow: 'visible' }}>
      <line x1={70} y1={330} x2={760} y2={330} stroke={ink.soft} strokeWidth={2} />
      <line x1={70} y1={330} x2={70} y2={20} stroke={ink.soft} strokeWidth={2} />
      <text x={56} y={176} textAnchor="middle" transform="rotate(-90 56 176)" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
        erreur moyenne
      </text>
      <text x={760} y={368} textAnchor="end" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>
        tokens vus →
      </text>
      <path d={LOSS_PATH} pathLength={1} className="llm-draw3" fill="none" stroke={ink.accent} strokeWidth={3} strokeLinejoin="round" style={vars({ d: '0ms' })} />
      <circle cx={750} cy={293} r={8} fill={ink.accent} className="llm-fade3" style={vars({ d: '900ms' })} />
    </svg>
    <div className="llm-on4" style={{ position: 'absolute', left: 1070, top: 812, width: 710, fontSize: 28, lineHeight: 1.5 }}>
      <div>
        <strong style={{ fontFamily: serif, fontSize: 36, fontWeight: 500, color: ink.accent }}>≈ 15 000 milliards</strong> de tokens lus
        (Llama 3)
      </div>
      <div style={{ color: ink.soft }}>des milliers de GPU, pendant des semaines</div>
    </div>
  </Frame>
);

// ═══ 18 · Du compléteur à l'assistant ════════════════════════════════════════
const AlignCard = ({
  x,
  cls,
  title,
  sub,
  children,
}: {
  x: number;
  cls?: string;
  title: string;
  sub: string;
  children: ReactNode;
}) => (
  <div
    className={cls}
    style={{
      position: 'absolute',
      left: x,
      top: 390,
      width: 500,
      height: 520,
      boxSizing: 'border-box',
      padding: 30,
      background: ink.card,
      borderRadius: 18,
      boxShadow: `0 0 0 1.5px ${ink.rule}, 0 14px 36px -24px rgba(60, 40, 10, 0.35)`,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <div style={{ fontFamily: serif, fontSize: 34, fontWeight: 500, lineHeight: 1.2 }}>{title}</div>
    <div style={{ fontSize: 26, lineHeight: 1.35, color: ink.muted, marginTop: 10 }}>{sub}</div>
    <div style={{ height: 1, background: ink.rule, margin: '18px 0' }} />
    {children}
  </div>
);

const Bubble = ({ children, c, mark }: { children: ReactNode; c?: Tone; mark?: string }) => (
  <div
    style={{
      position: 'relative',
      padding: '10px 16px',
      borderRadius: 12,
      background: c ? tone[c].bg : ink.panel,
      boxShadow: c ? `inset 0 0 0 2px ${tone[c].bd}` : 'none',
      fontSize: 24,
      lineHeight: 1.4,
      paddingRight: mark ? 52 : 16,
    }}
  >
    {children}
    {mark ? (
      <span style={{ position: 'absolute', right: 14, top: 8, fontSize: 26, fontWeight: 600, color: c ? tone[c].fg : ink.soft }}>{mark}</span>
    ) : null}
  </div>
);

const Output = ({ children }: { children: ReactNode }) => (
  <div style={{ marginTop: 14, paddingLeft: 16, borderLeft: `4px solid ${ink.accent}`, fontSize: 26, lineHeight: 1.4 }}>{children}</div>
);

const Verdict = ({ children }: { children: ReactNode }) => (
  <div style={{ marginTop: 'auto', fontFamily: serif, fontStyle: 'italic', fontSize: 25, color: ink.soft }}>{children}</div>
);

const Align: Page = () => (
  <Frame id="align" eyebrow="06 · Entraînement" stage={6} beats={2}>
    <Title>Du compléteur de texte à l'assistant</Title>
    <Lede>
      Le pré-entraînement produit un modèle qui <Hl>continue n'importe quel texte</Hl>. Deux étapes de
      plus en font un assistant.
    </Lede>
    <AlignCard x={140} title="1 · Pré-entraînement" sub="lire une large part du web, des livres, du code">
      <Bubble>Quelle est la capitale de la France ?</Bubble>
      <Output>Quelle est la capitale de l'Allemagne ? Quelle est la capitale de…</Output>
      <Verdict>il continue le texte, comme un quiz</Verdict>
    </AlignCard>
    <AlignCard x={710} cls="llm-on1" title="2 · Ajustement supervisé" sub="imiter des dialogues rédigés par des humains">
      <Bubble>Quelle est la capitale de la France ?</Bubble>
      <Output>La capitale de la France est Paris.</Output>
      <Verdict>il répond, au format assistant</Verdict>
    </AlignCard>
    <AlignCard x={1280} cls="llm-on2" title="3 · Préférences (RLHF)" sub="comparer des réponses et renforcer les meilleures">
      <div style={{ fontSize: 24, color: ink.muted, marginBottom: 10 }}>même question, deux réponses :</div>
      <Bubble c="mint" mark="✓">Paris, qui est aussi sa plus grande ville.</Bubble>
      <div style={{ height: 12 }} />
      <Bubble c="rose" mark="✗">Je crois que c'est Lyon.</Bubble>
      <Verdict>utile, honnête, sûr : on renforce</Verdict>
    </AlignCard>
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <Arrow x1={648} y1={650} x2={702} y2={650} n={1} head={12} color={ink.accent} />
      <Arrow x1={1218} y1={650} x2={1272} y2={650} n={2} head={12} color={ink.accent} />
    </svg>
  </Frame>
);

// ═══ 19 · Limites ════════════════════════════════════════════════════════════
CSS.push(`
@keyframes llm-scroll{from{transform:translateX(0)}to{transform:translateX(-480px)}}
.llm-limits.llm-live .llm-scroll{animation:llm-scroll 9s linear infinite}
`);

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
  <div
    className={cls}
    style={{
      position: 'absolute',
      left: x,
      top: 390,
      width: 520,
      height: 500,
      boxSizing: 'border-box',
      padding: 30,
      background: ink.card,
      borderRadius: 18,
      boxShadow: `0 0 0 1.5px ${ink.rule}, 0 14px 36px -24px rgba(60, 40, 10, 0.35)`,
    }}
  >
    <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{glyph}</div>
    <div style={{ fontFamily: serif, fontSize: 38, fontWeight: 500, lineHeight: 1.2, marginTop: 24 }}>{title}</div>
    <div style={{ fontSize: 28, lineHeight: 1.45, color: ink.soft, marginTop: 10 }}>{children}</div>
  </div>
);

const ScrollTok = ({ c }: { c: Tone }) => (
  <span style={{ flex: 'none', width: 34, height: 34, borderRadius: 6, background: tone[c].bg, boxShadow: `inset 0 0 0 2px ${tone[c].bd}` }} />
);

const ScrollSet = () => (
  <>
    <ScrollTok c="peach" />
    <ScrollTok c="mint" />
    <ScrollTok c="lav" />
    <ScrollTok c="sky" />
    <ScrollTok c="butter" />
    <ScrollTok c="rose" />
    <ScrollTok c="sage" />
    <ScrollTok c="mint" />
    <ScrollTok c="peach" />
    <ScrollTok c="sky" />
    <ScrollTok c="lav" />
    <ScrollTok c="butter" />
  </>
);

const GlyphHallu = () => (
  <div style={{ position: 'relative', width: 440 }}>
    <Bubble>La tour Eiffel a été achevée en 1921.</Bubble>
    <div
      style={{
        position: 'absolute',
        right: 4,
        bottom: -46,
        padding: '4px 12px',
        borderRadius: 8,
        background: tone.rose.bg,
        boxShadow: `inset 0 0 0 2px ${tone.rose.bd}`,
        fontFamily: mono,
        fontSize: 22,
        color: tone.rose.fg,
        transform: 'rotate(-3deg)',
      }}
    >
      ✗ en réalité : 1889
    </div>
  </div>
);

const GlyphWindow = () => (
  <div style={{ position: 'relative', width: 460, height: 110 }}>
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 28,
        width: 460,
        height: 54,
        overflow: 'hidden',
        WebkitMaskImage: 'linear-gradient(90deg, transparent 0, #000 40%)',
        maskImage: 'linear-gradient(90deg, transparent 0, #000 40%)',
      }}
    >
      <div className="llm-scroll" style={{ display: 'flex', gap: 6, paddingTop: 10 }}>
        <ScrollSet />
        <ScrollSet />
        <ScrollSet />
      </div>
    </div>
    <div style={{ position: 'absolute', left: 180, top: 22, width: 280, height: 66, boxSizing: 'border-box', borderRadius: 10, border: `3px solid ${ink.accent}` }} />
    <div style={{ position: 'absolute', left: 180, top: 92, fontFamily: mono, fontSize: 22, color: ink.accent }}>
      fenêtre de contexte
    </div>
    <div style={{ position: 'absolute', left: 0, top: 92, fontFamily: mono, fontSize: 22, color: ink.faint }}>oublié</div>
  </div>
);

const GlyphCutoff = () => (
  <svg width={460} height={130}>
    <line x1={10} y1={70} x2={300} y2={70} stroke={ink.soft} strokeWidth={4} strokeLinecap="round" />
    <line x1={300} y1={70} x2={450} y2={70} stroke={ink.faint} strokeWidth={4} strokeDasharray="4 10" strokeLinecap="round" />
    <circle cx={60} cy={70} r={7} fill={ink.soft} />
    <circle cx={150} cy={70} r={7} fill={ink.soft} />
    <circle cx={240} cy={70} r={7} fill={ink.soft} />
    <text x={60} y={110} textAnchor="middle" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>2023</text>
    <text x={150} y={110} textAnchor="middle" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>2024</text>
    <text x={240} y={110} textAnchor="middle" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.muted}>2025</text>
    <line x1={300} y1={22} x2={300} y2={92} stroke={ink.accent} strokeWidth={3} strokeDasharray="6 6" />
    <text x={300} y={16} textAnchor="middle" style={{ fontFamily: mono, fontSize: 22 }} fill={ink.accent}>coupure</text>
    <text x={390} y={58} textAnchor="middle" style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 34 }} fill={ink.faint}>?</text>
  </svg>
);

const Limits: Page = () => (
  <Frame id="limits" eyebrow="Conclusion" stage={7} beats={2}>
    <Title>Ce que ce mécanisme implique</Title>
    <Lede>Comprendre comment un LLM fonctionne, c'est aussi comprendre où il se trompe.</Lede>
    <LimitCard x={140} title="Plausible ≠ vrai" glyph={<GlyphHallu />}>
      Il produit la suite la plus probable, pas la plus exacte : il peut inventer avec aplomb.
    </LimitCard>
    <LimitCard x={700} cls="llm-on1" title="Une fenêtre finie" glyph={<GlyphWindow />}>
      Il ne voit que son contexte, de quelques milliers à ~1 million de tokens. Au-delà, rien.
    </LimitCard>
    <LimitCard x={1260} cls="llm-on2" title="Un savoir figé" glyph={<GlyphCutoff />}>
      Ses connaissances s'arrêtent à ses données d'entraînement ; recherche et outils complètent.
    </LimitCard>
  </Frame>
);

// ═══ 20 · Conclusion ═════════════════════════════════════════════════════════
CSS.push(`
@keyframes llm-recap{0%,24%,100%{transform:none}8%{transform:translateY(-8px)}}
.llm-end.llm-live .llm-recap{animation:llm-recap 3.6s ${EASE} var(--p,0ms) infinite}
`);

const RecapChip = ({ c, k, children }: { c: Tone; k: number; children: ReactNode }) => (
  <span className="llm-in" style={vars({ d: `${700 + k * 110}ms` })}>
    <span
      className="llm-recap"
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
  <span className="llm-in-fade" style={{ ...vars({ d: `${760 + k * 110}ms` }), fontSize: 30, color: ink.faint }}>
    →
  </span>
);

const Closing: Page = () => (
  <Frame id="end" eyebrow="Conclusion" stage={7}>
    <p
      className="llm-in"
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
      Un LLM est une fonction qui, à partir d'une suite de tokens, prédit{' '}
      <Hl>la distribution du token suivant</Hl> — apprise sur d'immenses corpus, puis appliquée en
      boucle.
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
      <RecapChip c="peach" k={0}>Tokens</RecapChip>
      <Sep k={0} />
      <RecapChip c="mint" k={1}>Vecteurs</RecapChip>
      <Sep k={1} />
      <RecapChip c="lav" k={2}>Attention</RecapChip>
      <Sep k={2} />
      <RecapChip c="sky" k={3}>Transformer × N</RecapChip>
      <Sep k={3} />
      <RecapChip c="butter" k={4}>Probabilités</RecapChip>
      <Sep k={4} />
      <RecapChip c="accent" k={5}>Token suivant</RecapChip>
      <span className="llm-in-fade" style={{ ...vars({ d: '1500ms' }), fontSize: 40, color: ink.accent }}>
        ↺
      </span>
    </div>
    <div
      className="llm-in"
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
      className="llm-in"
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

const STYLE_ID = 'osd-styles-llm-explique';
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
  title: 'Comment fonctionne un LLM',
  createdAt: '2026-10-03T21:52:37.409Z',
};

export const notes: (string | undefined)[] = [
  `Ouverture. Laisser l'animation se jouer : la phrase se construit token par token, puis « canapé » apparaît.
Message : tout ce qu'on va voir sert à produire ce dernier mot.`,
  `Clic 1 : le blanc se remplit avec le candidat le plus probable.
Clic 2 : insister — pas de base de faits, pas de règles. Juste une distribution de probabilités apprise.`,
  `Le plan de la présentation. 6 clics : chaque étape apparaît avec sa flèche.
Au dernier clic, la boucle : le token choisi est réinjecté. On va déplier chaque carte.`,
  `Clic 1 : le texte se découpe en tokens (une couleur par token, les points montrent les espaces).
Clic 2 : chaque token devient un entier. Clic 3 : ordres de grandeur.
Préciser que le découpage et les identifiants sont illustratifs.`,
  `Clic 1 : on cherche la ligne de l'ID 9012 dans la table.
Clic 2 : cette ligne EST l'embedding de « chat ». Clic 3 : ces valeurs sont apprises, pas choisies.`,
  `Les points se rangent tout seuls par familles de sens.
Clic 1 : les groupes. Clic 2 : la direction « royauté » est la même pour homme→roi et femme→reine.
Clic 3 : idem pour « capitale ». Rappeler que c'est une projection 2D.`,
  `Vue du dessus : c'est exactement la carte de la page précédente — 2 nombres par mot (dim 1, dim 2).
Clic 1 : on penche la carte. C'est un sol plat ; la 3e direction (dim 3) est encore vide.
Clic 2 : on ajoute un 3e nombre à chaque mot : il s'élève. Les pointillés tombent sur son ombre au sol — la carte 2D n'était que cette ombre. La scène tourne doucement : le mouvement aide à percevoir la profondeur.
Clic 3 : le parallélogramme homme/roi/femme/reine. « royauté » reste à plat, « féminin » monte en dim 3 : chaque direction peut porter un concept. Valeurs illustratives.`,
  `Personne ne peut visualiser 4 096 dimensions, et ce n'est pas nécessaire.
1 dimension : un nombre, un point sur une droite. Clic 1 : 2 nombres, un plan. Clic 2 : 3 nombres, un volume.
Clic 3 : 4 nombres. On ne voit plus que l'ombre d'un hypercube qui tourne : sa 4e dimension apparaît comme un cube qui grandit et rapetisse.
Clic 4 : 4 096 nombres, une mosaïque 64 × 64. Les 4 premiers sont ceux d'avant.
Clic 5 : on ne la voit pas, on la calcule. Le cosinus mesure si deux listes pointent dans la même direction : chat/chien élevé, chat/voiture proche de 0. Ce produit scalaire reviendra dans l'attention.`,
  `Même vecteur de départ pour « avocat » dans les deux phrases.
Clic 1 : les tokens précédents « parlent » à avocat. Clic 2 : son vecteur change selon le contexte.
Clic 3 : ce mécanisme, c'est l'attention. Noter qu'un token ne regarde que ce qui le précède.`,
  `Analogie : une recherche. Clic 1 : la requête de avocat. Clic 2 : les clés de chaque token, et les scores Q·K.
Clic 3 : softmax, les scores deviennent des pourcentages (72 % pour « mangé »).
Clic 4 : les valeurs circulent, pondérées ; avocat devient « le fruit ». Montrer la formule.`,
  `Une ligne par token, calculée en parallèle.
Clic 1 : la ligne « miaulé » regarde surtout « chat ». Clic 2 : le masque causal, pas de triche.
Clic 3 : tout est un produit de matrices, d'où l'efficacité sur GPU.`,
  `Clic 1 à 3 : trois têtes, trois relations (sujet, pronom, token précédent).
Clic 4 : des milliers de têtes au total, et personne ne leur assigne de rôle.`,
  `Le flux résiduel monte en continu ; chaque étape y ajoute sa contribution.
Clic 1 : attention. Clic 2 : MLP, l'essentiel des paramètres. Clic 3 : on empile N blocs.`,
  `Clic 1 : projection sur le vocabulaire, des scores bruts, parfois négatifs.
Clic 2 : softmax, des probabilités qui somment à 100 %. Clic 3 : le modèle ne choisit pas encore.`,
  `Départ à T = 1. Clic 1 : T = 0,2, la distribution se resserre, toujours « canapé ».
Clic 2 : T = 2, elle s'aplatit, on peut tirer « piano ». Clic 3 : greedy, top-k, top-p.`,
  `Les couches du modèle s'allument en boucle : une passe complète par token.
Clics 1 à 3 : canapé, point, puis le token de fin qui arrête la génération.
Clic 4 : le cache KV, d'où la vitesse des réponses en streaming.`,
  `Clic 1 : la bonne réponse et l'erreur (−log p). Clic 2 : rétropropagation, la probabilité de Paris monte, l'erreur baisse.
Clic 3 : répété des milliards de fois, la courbe d'erreur descend. Clic 4 : l'échelle.`,
  `Le modèle brut complète du texte : face à une question, il peut écrire d'autres questions.
Clic 1 : ajustement supervisé, il apprend le format d'un assistant.
Clic 2 : préférences, on renforce les réponses jugées meilleures.`,
  `Trois conséquences directes du mécanisme.
Clic 1 : la fenêtre de contexte. Clic 2 : la date de coupure des connaissances.`,
  `Résumé en une phrase, puis les six étapes. Remercier et ouvrir les questions.`,
];

export default [
  Cover,
  Idea,
  Pipeline,
  Tokens,
  Embeddings,
  Space,
  Space3D,
  Dimensions,
  Context,
  QueryKeyValue,
  Matrix,
  Heads,
  Block,
  Logits,
  Temperature,
  Loop,
  Training,
  Align,
  Limits,
  Closing,
] satisfies Page[];
