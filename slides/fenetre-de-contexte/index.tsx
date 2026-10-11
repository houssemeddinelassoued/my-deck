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
import {
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

export const design: DesignSystem = {
  palette: { bg: '#f4ecdb', text: '#2a2119', accent: '#d8432a' },
  fonts: {
    display: '"Bricolage Grotesque", "Segoe UI", system-ui, sans-serif',
    body: '"Bricolage Grotesque", "Segoe UI", system-ui, sans-serif',
  },
  typeScale: { hero: 140, body: 30 },
  radius: 14,
};

// ─── Webfonts (module-level, slide-keyed) ───────────────────────────────────
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Caveat:wght@500;700&family=JetBrains+Mono:wght@400;700&display=swap';
const FONT_LINK_ID = 'osd-webfont-fenetre-de-contexte';
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

// ─── Palette (kraft paper, green desk mat, pastel sheets) ───────────────────
const ink = {
  text: '#2a2119',
  soft: '#5b4e40',
  muted: '#8b7d6b',
  faint: '#c6b89f',
  rule: '#e2d4ba',
  card: '#fffaf0',
  paper: '#fffdf8',
  pen: '#d8432a',
  chalk: '#fff1cf',
  postit: '#ffe27c',
  mat: '#2f5949',
  matHi: '#3c6d59',
  matLo: '#244839',
};

const st = { green: '#3d9a5b', yellow: '#cf9a12', orange: '#e2772a', red: '#d8432a' };

const display = 'var(--osd-font-display)';
const body = 'var(--osd-font-body)';
const hand = '"Caveat", "Segoe Print", "Bradley Hand", cursive';
const mono = '"JetBrains Mono", ui-monospace, "SF Mono", Consolas, monospace';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const BOUNCE = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';

// One color pair per kind of "sheet" that can land on the desk.
type Cat = 'sys' | 'proj' | 'files' | 'hist' | 'prompt' | 'logs' | 'memo' | 'snip' | 'reply';
const CAT: Record<Cat, { bg: string; bd: string }> = {
  sys: { bg: '#ddd4f6', bd: '#8d7ed3' },
  proj: { bg: '#cfe3f7', bd: '#6c9fd3' },
  files: { bg: '#fbf6ea', bd: '#b8a888' },
  hist: { bg: '#cfeada', bd: '#69b083' },
  prompt: { bg: '#fcd6c1', bd: '#df8a59' },
  logs: { bg: '#f8cdd8', bd: '#cf718c' },
  memo: { bg: '#ffe27c', bd: '#ddb53a' },
  snip: { bg: '#fbf6ea', bd: '#b8a888' },
  reply: { bg: 'transparent', bd: 'rgba(255, 240, 205, 0.5)' },
};

// ─── Small helpers ──────────────────────────────────────────────────────────
// CSS custom properties as inline style (React's CSSProperties has no index signature).
const vars = (o: Record<string, string | number>): CSSProperties => {
  const out: Record<string, string | number> = {};
  for (const k of Object.keys(o)) out[`--${k}`] = o[k];
  return out as CSSProperties;
};
const ms = (v: number) => `${Math.round(v)}ms`;

// French number formatting: narrow no-break space for thousands, decimal comma.
const NNBSP = ' ';
const fmt = (v: number, digits = 0) =>
  digits > 0
    ? v.toFixed(digits).replace('.', ',')
    : String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, NNBSP);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// ─── The desk model: 8 192 tokens = 128 sheets of 64 tokens ─────────────────
const CELL_T = 64;
const COLS = 16;
const ROWS = 8;
const CAP = COLS * ROWS;
const WINDOW = CAP * CELL_T;
const DROP_BASE = 160;
const DROP_STEP = 11;

type Toks = Partial<Record<Cat, number>>;
type DeskSeg = { cat: Cat; t: number; at?: number; hl?: boolean };

const segsOf = (toks: Toks, at = 1): DeskSeg[] =>
  (Object.keys(toks) as Cat[]).map((cat) => ({ cat, t: toks[cat] ?? 0, at }));
const sumOf = (toks: Toks) => (Object.keys(toks) as Cat[]).reduce((a, k) => a + (toks[k] ?? 0), 0);

// Delay at which a payload line's first sheet lands — the receipt line prints in sync.
const rowDelay = (toks: Toks, cat: Cat) => {
  let cum = 0;
  for (const k of Object.keys(toks) as Cat[]) {
    if (k === cat) break;
    cum += toks[k] ?? 0;
  }
  return DROP_BASE + Math.round(cum / CELL_T) * DROP_STEP;
};

// Cumulative rounding so the sheets of every segment add up to the total.
const layoutCells = (segs: DeskSeg[]) => {
  const cells: { cat: Cat; at: number; hl: boolean }[] = [];
  let cum = 0;
  for (const s of segs) {
    const a = Math.round(cum / CELL_T);
    cum += s.t;
    const b = Math.round(cum / CELL_T);
    for (let k = a; k < b; k++) cells.push({ cat: s.cat, at: s.at ?? 1, hl: !!s.hl });
  }
  return cells;
};

// Deterministic "posed by hand" tilt per sheet.
const tilt = (i: number, k = 1) => (((i * 37 + 11) % 13) - 6) * 0.38 * k;

const statusOf = (p: number) =>
  p > 1
    ? { color: st.red, label: 'Débordement' }
    : p > 0.75
      ? { color: st.orange, label: 'Vigilance' }
      : p > 0.5
        ? { color: st.yellow, label: 'Charge modérée' }
        : { color: st.green, label: 'Optimal' };

// ─── Stylesheet (collected, injected once at the bottom) ────────────────────
const CSS: string[] = [];

CSS.push(`
@keyframes ctx-drop-k{from{opacity:0;transform:translateY(-34px) rotate(var(--r,0deg)) scale(1.18)}to{opacity:1;transform:rotate(var(--r,0deg))}}
@keyframes ctx-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes ctx-growy-k{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes ctx-shake{0%,100%{transform:translateX(0)}15%{transform:translateX(-9px) rotate(-.4deg)}30%{transform:translateX(8px) rotate(.4deg)}45%{transform:translateX(-6px)}60%{transform:translateX(5px)}75%{transform:translateX(-3px)}}
.ctx-rot{transform:rotate(var(--r,0deg))}
.ctx-sh{box-shadow:0 2px 0 rgba(0,0,0,0.2)}
.ctx-key{box-shadow:0 4px 0 ${ink.soft}}
.ctx-live .ctx-mount{animation:ctx-drop-k 560ms ${BOUNCE} var(--d,0ms) both}
.ctx-live .ctx-in{animation:ctx-rise 800ms ${EASE} var(--d,0ms) both}
.ctx-growy{transform-origin:50% 100%}
.ctx-live .ctx-growy{animation:ctx-growy-k 1100ms ${EASE} var(--d,0ms) both}
.ctx-live .ctx-shake{animation:ctx-shake 520ms ease-in-out both}
.ctx-btn{transition:transform 120ms ease-out,box-shadow 120ms ease-out,background-color 200ms ease-out}
.ctx-btn:not(:disabled):hover{transform:translate(-1px,-1px)}
.ctx-btn:not(:disabled):active{transform:translate(3px,3px);box-shadow:0 0 0 ${ink.text} !important}
.ctx-btn:disabled{opacity:.4;cursor:default}
.ctx-gfill{transition:width 600ms ${EASE},background-color 400ms ease}
@media (prefers-reduced-motion: reduce){.ctx-page *{animation-duration:1ms !important;animation-delay:0ms !important;transition-duration:0ms !important;transition-delay:0ms !important}}
`);

// Beat utilities: each class reacts when the page's n-th click ("beat") is revealed.
for (let n = 1; n <= 5; n++) {
  const has = `.ctx-page:has([data-osd-step="revealed"] > .ctx-k${n})`;
  CSS.push(`
.ctx-on${n}{opacity:0;transform:translateY(14px);transition:opacity 500ms ${EASE} var(--d,0ms),transform 700ms ${EASE} var(--d,0ms)}
${has} .ctx-on${n}{opacity:1;transform:none}
.ctx-fade${n}{opacity:0;transition:opacity 550ms ${EASE} var(--d,0ms)}
${has} .ctx-fade${n}{opacity:1}
.ctx-drop${n}{opacity:0;transform:translateY(-34px) rotate(var(--r,0deg)) scale(1.18);transition:opacity 220ms ease-out var(--d,0ms),transform 560ms ${BOUNCE} var(--d,0ms)}
${has} .ctx-drop${n}{opacity:1;transform:rotate(var(--r,0deg))}
.ctx-fall${n}{opacity:0;transform:translateY(-90px) rotate(0deg);transition:opacity 240ms ease-out var(--d,0ms),transform 820ms cubic-bezier(.5,0,.7,1.3) var(--d,0ms)}
${has} .ctx-fall${n}{opacity:1;transform:rotate(var(--r,0deg))}
.ctx-grow${n}{transform:scaleX(0);transform-origin:0 50%;transition:transform 1400ms ${EASE} var(--d,0ms)}
${has} .ctx-grow${n}{transform:none}
.ctx-shrink${n}{transform-origin:0 50%;transition:transform 1200ms ${EASE} var(--d,0ms)}
${has} .ctx-shrink${n}{transform:scaleX(var(--s,1))}
.ctx-draw${n}{stroke-dasharray:1 2;stroke-dashoffset:1.01;transition:stroke-dashoffset 1400ms ${EASE} var(--d,0ms)}
${has} .ctx-draw${n}{stroke-dashoffset:0}
.ctx-stamp${n}{opacity:0;transform:rotate(var(--r,0deg)) scale(2.3);transition:opacity 140ms ease-out var(--d,0ms),transform 420ms cubic-bezier(.2,1.5,.45,1) var(--d,0ms)}
${has} .ctx-stamp${n}{opacity:.93;transform:rotate(var(--r,0deg)) scale(1)}
.ctx-stick${n}{opacity:0;transform:rotate(var(--r,0deg)) translateY(-26px) scale(1.06);transition:opacity 300ms ease-out var(--d,0ms),transform 640ms ${BOUNCE} var(--d,0ms)}
${has} .ctx-stick${n}{opacity:1;transform:rotate(var(--r,0deg))}
.ctx-press${n}{transition:transform 120ms ease-out,box-shadow 120ms ease-out}
${has} .ctx-press${n}{transform:translateY(3px);box-shadow:0 1px 0 ${ink.soft}}
.ctx-dimc${n}{transition:opacity 500ms ${EASE} var(--d,0ms)}
${has} .ctx-dimc${n}{opacity:.28}
.ctx-hl${n}{transition:box-shadow 400ms ${EASE} var(--d,0ms)}
${has} .ctx-hl${n}{box-shadow:0 0 0 4px ${ink.pen},0 2px 0 rgba(0,0,0,.2)}
.ctx-strike${n}{transform:scaleX(0);transform-origin:0 50%;transition:transform 500ms ${EASE} var(--d,0ms)}
${has} .ctx-strike${n}{transform:scaleX(1)}
.ctx-mute${n}{transition:opacity 500ms ${EASE} var(--d,0ms)}
${has} .ctx-mute${n}{opacity:.38}
`);
}

// Invisible click markers: each beat is a <Step> whose reveal state drives the
// page's CSS (via :has), so a single click can drop sheets, fill gauges, stamp…
const Beats = ({ count }: { count: number }) => (
  <div aria-hidden style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0 }}>
    <Steps>
      {Array.from({ length: count }, (_, i) => (
        <Step key={i} duration={0}>
          <i className={`ctx-k${i + 1}`} />
        </Step>
      ))}
    </Steps>
  </div>
);

// Revealed beats of the enclosing page, kept in sync with the Steps.
const useBeat = (ref: RefObject<Element | null>) => {
  const [beat, setBeat] = useState(99);
  useLayoutEffect(() => {
    const page = ref.current?.closest('.ctx-page');
    if (!page) return;
    const read = () => setBeat(page.querySelectorAll('[data-osd-step="revealed"]').length);
    read();
    const mo = new MutationObserver(read);
    mo.observe(page, { subtree: true, attributes: true, attributeFilter: ['data-osd-step'] });
    return () => mo.disconnect();
  }, [ref]);
  return beat;
};

// A number that counts up when its beat is revealed (final value when jumped to).
const Count = ({
  to,
  at = 1,
  dur = 1400,
  delay = 0,
  digits = 0,
}: {
  to: number;
  at?: number;
  dur?: number;
  delay?: number;
  digits?: number;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const live = useIsActivePage();
  const beat = useBeat(ref);
  const on = at <= 0 || beat >= at;
  const [v, setV] = useState(to);
  const prev = useRef<boolean | null>(null);
  useLayoutEffect(() => {
    const was = prev.current;
    prev.current = on;
    if (!on) {
      setV(0);
      return;
    }
    if (was !== false || !live || prefersReducedMotion()) {
      setV(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now() + delay;
    const tick = (now: number) => {
      const k = Math.min(1, Math.max(0, (now - t0) / dur));
      setV(to * (1 - (1 - k) ** 3));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, live, to, dur, delay]);
  return <span ref={ref}>{fmt(v, digits)}</span>;
};

// ─── Frame ──────────────────────────────────────────────────────────────────
const TDot = ({ n, stage }: { n: number; stage: number }) => {
  const now = n === stage;
  const past = n < stage;
  return (
    <>
      {n > 1 ? <span style={{ width: 24, height: 3, background: past || now ? ink.soft : ink.rule }} /> : null}
      <span
        style={{
          width: 30,
          height: 30,
          borderRadius: 999,
          boxSizing: 'border-box',
          display: 'grid',
          placeItems: 'center',
          fontFamily: mono,
          fontSize: 15,
          fontWeight: 700,
          background: now ? ink.pen : past ? ink.soft : 'transparent',
          color: now || past ? ink.card : ink.muted,
          border: `2px solid ${now ? ink.pen : past ? ink.soft : ink.faint}`,
          boxShadow: now ? '0 0 0 5px rgba(216, 67, 42, 0.18)' : 'none',
        }}
      >
        {n}
      </span>
    </>
  );
};

const Timeline = ({ stage }: { stage: number }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <span style={{ fontFamily: mono, fontSize: 16, letterSpacing: '0.14em', color: ink.muted, marginRight: 16 }}>
      SESSION
    </span>
    <TDot n={1} stage={stage} />
    <TDot n={2} stage={stage} />
    <TDot n={3} stage={stage} />
    <TDot n={4} stage={stage} />
    <TDot n={5} stage={stage} />
  </div>
);

const Header = ({ eyebrow, stage }: { eyebrow: string; stage: number }) => (
  <div
    style={{
      position: 'absolute',
      left: 120,
      right: 120,
      top: 52,
      height: 34,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <span
      style={{
        fontFamily: mono,
        fontSize: 19,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: ink.pen,
      }}
    >
      {eyebrow}
    </span>
    {stage > 0 ? <Timeline stage={stage} /> : null}
  </div>
);

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        bottom: 34,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        color: ink.muted,
      }}
    >
      <span style={{ fontFamily: hand, fontSize: 28, fontWeight: 500 }}>
        La fenêtre de contexte, expliquée avec un bureau
      </span>
      <span style={{ fontFamily: mono, fontSize: 18, letterSpacing: '0.06em' }}>
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
      className={`ctx-page ctx-${id}${live ? ' ctx-live' : ''}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'var(--osd-bg)',
        color: 'var(--osd-text)',
        fontFamily: body,
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 65% 55% at 16% 10%, rgba(255,255,255,0.7), rgba(255,255,255,0) 70%), radial-gradient(ellipse 60% 50% at 94% 100%, rgba(196,160,110,0.18), rgba(196,160,110,0) 70%)',
        }}
      />
      {eyebrow ? <Header eyebrow={eyebrow} stage={stage} /> : null}
      {children}
      {footer ? <Footer /> : null}
      {beats > 0 ? <Beats count={beats} /> : null}
    </div>
  );
};

// ─── Typography ─────────────────────────────────────────────────────────────
const Title = ({ children, top = 102, size = 60 }: { children: ReactNode; top?: number; size?: number }) => (
  <h2
    style={{
      position: 'absolute',
      left: 120,
      top,
      margin: 0,
      maxWidth: 1680,
      fontFamily: display,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1.1,
      letterSpacing: '-0.022em',
    }}
  >
    {children}
  </h2>
);

const Hand = ({
  children,
  top = 176,
  left = 124,
  size = 40,
  color = ink.pen,
}: {
  children: ReactNode;
  top?: number;
  left?: number;
  size?: number;
  color?: string;
}) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      fontFamily: hand,
      fontSize: size,
      fontWeight: 700,
      lineHeight: 1.1,
      color,
      transform: 'rotate(-1deg)',
      transformOrigin: '0 50%',
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
);

// Inline code
const C = ({ children, size }: { children: ReactNode; size?: number }) => (
  <code
    style={{
      fontFamily: mono,
      fontSize: size ?? '0.84em',
      background: 'rgba(42, 33, 25, 0.08)',
      borderRadius: 6,
      padding: '0.04em 0.28em',
    }}
  >
    {children}
  </code>
);

// Hand-drawn arrow in page coordinates.
const HandArrow = ({
  x1,
  y1,
  x2,
  y2,
  bend = 0.18,
  color = ink.pen,
  w = 3,
  cls,
  d = 0,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  bend?: number;
  color?: string;
  w?: number;
  cls?: string;
  d?: number;
}) => {
  const cx = (x1 + x2) / 2 - (y2 - y1) * bend;
  const cy = (y1 + y2) / 2 + (x2 - x1) * bend;
  const a = Math.atan2(y2 - cy, x2 - cx);
  const h = 15;
  const p1 = `${(x2 - h * Math.cos(a - 0.45)).toFixed(1)} ${(y2 - h * Math.sin(a - 0.45)).toFixed(1)}`;
  const p2 = `${(x2 - h * Math.cos(a + 0.45)).toFixed(1)} ${(y2 - h * Math.sin(a + 0.45)).toFixed(1)}`;
  return (
    <svg
      aria-hidden
      className={cls}
      width={1}
      height={1}
      style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none', ...vars({ d: ms(d) }) }}
    >
      <path d={`M${x1} ${y1} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2} ${y2}`} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" />
      <path d={`M${p1} L${x2} ${y2} L${p2}`} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ─── Paper objects ──────────────────────────────────────────────────────────
const PostIt = ({
  x,
  y,
  w,
  rot = 2,
  at = 0,
  d = 0,
  size = 32,
  color = ink.postit,
  children,
}: {
  x: number;
  y: number;
  w: number;
  rot?: number;
  at?: number;
  d?: number;
  size?: number;
  color?: string;
  children: ReactNode;
}) => (
  <div
    className={at > 0 ? `ctx-stick${at}` : 'ctx-rot'}
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      boxSizing: 'border-box',
      padding: '26px 26px 22px',
      background: `linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0) 45%), ${color}`,
      boxShadow: '0 16px 24px -14px rgba(70, 45, 10, 0.55), 0 1px 0 rgba(0,0,0,0.08)',
      fontFamily: hand,
      fontSize: size,
      fontWeight: 700,
      lineHeight: 1.12,
      color: ink.text,
      ...vars({ r: `${rot}deg`, d: ms(d) }),
    }}
  >
    <span
      aria-hidden
      style={{
        position: 'absolute',
        left: '50%',
        top: -14,
        width: 110,
        height: 28,
        marginLeft: -55,
        background: 'rgba(255, 255, 255, 0.55)',
        border: '1px solid rgba(160, 140, 100, 0.22)',
        transform: 'rotate(-4deg)',
      }}
    />
    {children}
  </div>
);

const Stamp = ({
  children,
  color,
  rot = -8,
  at = 2,
  d = 0,
  size = 32,
}: {
  children: ReactNode;
  color: string;
  rot?: number;
  at?: number;
  d?: number;
  size?: number;
}) => (
  <div
    className={at > 0 ? `ctx-stamp${at}` : 'ctx-rot'}
    style={{
      display: 'inline-block',
      padding: '8px 20px 6px',
      border: `5px solid ${color}`,
      borderRadius: 12,
      outline: `2px solid ${color}`,
      outlineOffset: 4,
      color,
      fontFamily: mono,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      lineHeight: 1.1,
      whiteSpace: 'nowrap',
      mixBlendMode: 'multiply',
      background: 'rgba(255, 253, 248, 0.35)',
      ...vars({ r: `${rot}deg`, d: ms(d) }),
    }}
  >
    {children}
  </div>
);

const Key = ({ at = 1, label = 'Entrée' }: { at?: number; label?: string }) => (
  <span
    className={at > 0 ? `ctx-key ctx-press${at}` : 'ctx-key'}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '3px 12px',
      borderRadius: 8,
      border: `2px solid ${ink.soft}`,
      background: ink.paper,
      fontFamily: mono,
      fontSize: 16,
      fontWeight: 700,
      color: ink.soft,
      whiteSpace: 'nowrap',
    }}
  >
    ⏎ {label}
  </span>
);

// Paper texture of a sheet: a few ruled lines inside the margins.
const sheetBg = (cat: Cat, size: number) =>
  cat === 'memo'
    ? CAT.memo.bg
    : `repeating-linear-gradient(180deg, rgba(60,40,20,0.16) 0 2px, transparent 2px ${Math.max(6, Math.round(size * 0.14))}px) content-box, ${CAT[cat].bg}`;

const Sheet = ({
  cat,
  size,
  x,
  y,
  cls,
  r,
  d,
  over,
}: {
  cat: Cat;
  size: number;
  x: number;
  y: number;
  cls: string;
  r: number;
  d: number;
  over: boolean;
}) => {
  const base: CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
    width: size,
    height: size,
    boxSizing: 'border-box',
    borderRadius: cat === 'memo' ? 2 : 4,
    ...vars({ r: `${r.toFixed(2)}deg`, d: ms(d) }),
  };
  if (cat === 'reply') {
    return (
      <div
        className={cls.replace('ctx-sh', '')}
        style={{
          ...base,
          border: `2px dashed ${over ? '#ff9c84' : CAT.reply.bd}`,
          background: over ? 'rgba(216, 67, 42, 0.25)' : 'transparent',
        }}
      />
    );
  }
  return (
    <div
      className={cls}
      style={{
        ...base,
        border: `1.5px solid ${over ? ink.pen : CAT[cat].bd}`,
        padding: `${Math.round(size * 0.24)}px ${Math.round(size * 0.18)}px`,
        background: sheetBg(cat, size),
        outline: over ? `3px solid rgba(216, 67, 42, 0.6)` : undefined,
      }}
    />
  );
};

// The desk mat: a fixed 16 × 8 grid. Sheets past the 128th fall off the edge.
const Desk = ({
  segs,
  cell = 50,
  gap = 6,
  pad = 24,
  mode = 'beat',
  hlAt = 0,
  epoch = 0,
  maxOver = 16,
}: {
  segs: DeskSeg[];
  cell?: number;
  gap?: number;
  pad?: number;
  mode?: 'beat' | 'mount' | 'static';
  hlAt?: number;
  epoch?: number;
  maxOver?: number;
}) => {
  const cells = layoutCells(segs);
  const pitch = cell + gap;
  const iw = COLS * pitch - gap;
  const ih = ROWS * pitch - gap;
  const first = new Map<number, number>();
  cells.forEach((c, i) => {
    if (!first.has(c.at)) first.set(c.at, i);
  });
  // Mount mode: only the sheets added since the last render drop in.
  const seen = useRef({ epoch, count: 0 });
  const from = seen.current.epoch === epoch ? seen.current.count : 0;
  useEffect(() => {
    seen.current = { epoch, count: cells.length };
  });
  const overCount = Math.max(0, cells.length - CAP);
  return (
    <div style={{ position: 'relative', width: iw + pad * 2, height: ih + pad * 2 }}>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 18,
          background: `radial-gradient(ellipse 80% 70% at 30% 22%, ${ink.matHi}, ${ink.mat} 60%, ${ink.matLo})`,
          boxShadow: '0 22px 40px -22px rgba(50, 30, 10, 0.65), 0 2px 0 rgba(0, 0, 0, 0.15)',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: Math.round(pad * 0.36),
          borderRadius: 12,
          border: '2px dashed rgba(255, 236, 190, 0.3)',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: pad,
          top: pad,
          width: iw,
          height: ih,
          backgroundImage: 'linear-gradient(rgba(255,240,205,0.08), rgba(255,240,205,0.08))',
          backgroundSize: `${cell}px ${cell}px`,
          backgroundRepeat: 'space',
        }}
      />
      {cells.map((c, i) => {
        const over = i >= CAP;
        const m = i - CAP;
        if (over && m >= maxOver) return null;
        const x = pad + (over ? m * pitch : (i % COLS) * pitch);
        const y = over ? ih + pad * 2 + 16 : pad + Math.floor(i / COLS) * pitch;
        const r = over ? tilt(i, 4) : tilt(i);
        let cls = 'ctx-rot ctx-sh';
        let d = 0;
        if (mode === 'beat' && c.at > 0) {
          d = DROP_BASE + (i - (first.get(c.at) ?? 0)) * DROP_STEP + (over ? 260 : 0);
          cls = `${over ? 'ctx-fall' : 'ctx-drop'}${c.at} ctx-sh`;
        } else if (mode === 'mount') {
          d = Math.max(0, i - from) * 9;
          cls = 'ctx-rot ctx-sh ctx-mount';
        }
        if (hlAt > 0) cls += c.hl ? ` ctx-hl${hlAt}` : ` ctx-dimc${hlAt}`;
        return <Sheet key={`${epoch}-${i}`} cat={c.cat} size={cell} x={x} y={y} cls={cls} r={r} d={d} over={over} />;
      })}
      {overCount > maxOver ? (
        <div
          style={{
            position: 'absolute',
            left: pad + maxOver * pitch + 4,
            top: ih + pad * 2 + 16 + cell / 2 - 24,
            fontFamily: hand,
            fontWeight: 700,
            fontSize: 38,
            color: ink.pen,
            whiteSpace: 'nowrap',
          }}
        >
          +{overCount - maxOver}
        </div>
      ) : null}
    </div>
  );
};

const DESK_X = 862;
const DESK_Y = 290;

const DeskLabel = ({ x = DESK_X, y = 256, w = 938 }: { x?: number; y?: number; w?: number }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: mono,
      fontSize: 17,
      color: ink.muted,
      letterSpacing: '0.06em',
    }}
  >
    <span>
      LE BUREAU · fenêtre de <b style={{ color: ink.soft }}>{fmt(WINDOW)} tokens</b>
    </span>
    <span>1 feuille = 64 tokens</span>
  </div>
);

// Memory gauge: 20 segments like the ASCII bar, red hatched spill past 100 %.
const Gauge = ({
  tokens,
  x,
  y,
  w = 640,
  at = 1,
  d = 0,
  sim = false,
}: {
  tokens: number;
  x: number;
  y: number;
  w?: number;
  at?: number;
  d?: number;
  sim?: boolean;
}) => {
  const p = tokens / WINDOW;
  const s = statusOf(p);
  const fill = Math.min(p, 1) * (w - 6);
  const spill = Math.min(Math.max(0, p - 1), 0.2) * w;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 938, height: 44 }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: 44 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            boxSizing: 'border-box',
            borderRadius: 8,
            background: ink.paper,
            border: `3px solid ${ink.text}`,
          }}
        />
        <div
          className={sim ? 'ctx-gfill' : `ctx-grow${at}`}
          style={{
            position: 'absolute',
            left: 3,
            top: 3,
            bottom: 3,
            width: fill,
            borderRadius: 5,
            background: s.color,
            ...vars({ d: ms(d) }),
          }}
        />
        {spill > 0 ? (
          <div
            className={sim ? 'ctx-gfill' : `ctx-grow${at}`}
            style={{
              position: 'absolute',
              left: w - 3,
              top: -5,
              height: 54,
              width: spill,
              borderRadius: '0 9px 9px 0',
              background: `repeating-linear-gradient(135deg, ${st.red} 0 8px, #f29a84 8px 16px)`,
              ...vars({ d: ms(d + 1400) }),
            }}
          />
        ) : null}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: 3,
            right: 3,
            top: 3,
            bottom: 3,
            background:
              'repeating-linear-gradient(90deg, transparent 0 calc(5% - 3px), rgba(255,253,248,0.9) calc(5% - 3px) 5%)',
          }}
        />
      </div>
      <span
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          fontFamily: mono,
          fontWeight: 700,
          fontSize: 36,
          color: s.color,
          whiteSpace: 'pre',
          transition: 'color 400ms ease',
        }}
      >
        {sim ? fmt(p * 100, 1) : <Count to={p * 100} at={at} delay={d} dur={spill > 0 ? 2400 : 1400} digits={1} />}
        {' %'}
      </span>
    </div>
  );
};

// ─── Step board pieces: prompt card, receipt ────────────────────────────────
const PromptCard = ({
  n,
  ctx,
  at = 1,
  top = 256,
  children,
}: {
  n: number;
  ctx?: string;
  at?: number;
  top?: number;
  children: ReactNode;
}) => (
  <div
    style={{
      position: 'absolute',
      left: 120,
      top,
      width: 660,
      boxSizing: 'border-box',
      background: ink.card,
      border: `2.5px solid ${ink.text}`,
      borderRadius: 16,
      padding: '14px 24px 18px',
      boxShadow: `7px 7px 0 ${ink.text}`,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 36 }}>
      <span
        style={{
          width: 34,
          height: 34,
          borderRadius: 999,
          display: 'grid',
          placeItems: 'center',
          background: CAT.prompt.bg,
          border: `2px solid ${CAT.prompt.bd}`,
          fontSize: 19,
        }}
      >
        🧑‍💻
      </span>
      <span style={{ fontFamily: mono, fontSize: 18, fontWeight: 700, letterSpacing: '0.12em' }}>PROMPT {n}</span>
      {ctx ? <span style={{ fontFamily: mono, fontSize: 16, color: ink.muted }}>· {ctx}</span> : null}
      <span style={{ flex: 1 }} />
      <Key at={at} />
    </div>
    <div style={{ marginTop: 8, fontSize: 26, lineHeight: 1.38 }}>{children}</div>
  </div>
);

const Swatch = ({ cat, size = 20 }: { cat: Cat; size?: number }) =>
  cat === 'reply' ? (
    <span
      style={{
        width: size,
        height: size,
        boxSizing: 'border-box',
        border: `2px dashed ${ink.muted}`,
        borderRadius: 4,
        flex: 'none',
      }}
    />
  ) : (
    <span
      style={{
        width: size,
        height: size,
        boxSizing: 'border-box',
        background: CAT[cat].bg,
        border: `1.5px solid ${CAT[cat].bd}`,
        borderRadius: 4,
        flex: 'none',
      }}
    />
  );

const Row = ({
  i,
  cat,
  label,
  t,
  d,
  note,
}: {
  i: number;
  cat: Cat;
  label: string;
  t: number;
  d: number;
  note?: ReactNode;
}) => (
  <div className="ctx-fade1" style={vars({ d: ms(d) })}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 40, fontSize: 21 }}>
      <Swatch cat={cat} />
      <span style={{ color: ink.muted }}>[{i}]</span>
      <span style={{ whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ flex: 1, height: 0, marginTop: 10, borderBottom: `2px dotted ${ink.faint}` }} />
      <span style={{ fontWeight: 700, minWidth: 72, textAlign: 'right', color: t === 0 ? ink.faint : ink.text }}>
        {fmt(t)}
      </span>
    </div>
    {note ? (
      <div
        style={{
          fontFamily: hand,
          fontSize: 27,
          fontWeight: 700,
          color: ink.pen,
          lineHeight: 1,
          height: 28,
          margin: '-4px 0 2px 70px',
          whiteSpace: 'nowrap',
        }}
      >
        ↑ {note}
      </div>
    ) : null}
  </div>
);

const Zigzag = ({ w, h = 11, n = 30 }: { w: number; h?: number; n?: number }) => {
  const step = w / (2 * n);
  const pts: string[] = [];
  for (let i = 2 * n; i >= 0; i--) pts.push(`${(i * step).toFixed(1)},${i % 2 ? h : 0}`);
  return (
    <svg aria-hidden width={w} height={h} style={{ display: 'block' }}>
      <polygon points={`0,0 ${w},0 ${pts.join(' ')}`} fill={ink.paper} />
    </svg>
  );
};

const Receipt = ({
  head,
  turn,
  total,
  stamp,
  children,
}: {
  head: string;
  turn: number;
  total: number;
  stamp: { text: string; color: string };
  children: ReactNode;
}) => {
  const over = total > WINDOW;
  return (
    <div style={{ position: 'absolute', left: 120, top: 512, width: 660 }}>
      <div
        style={{
          position: 'relative',
          boxSizing: 'border-box',
          background: ink.paper,
          padding: '18px 30px 14px',
          border: `1px solid ${ink.rule}`,
          borderBottom: 'none',
          boxShadow: '0 12px 26px -16px rgba(70, 45, 15, 0.5)',
          fontFamily: mono,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 24,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: ink.muted,
          }}
        >
          <span>{head}</span>
          <span>Tour n°{turn}</span>
        </div>
        <div style={{ borderTop: `2px dashed ${ink.faint}`, margin: '10px 0 6px' }} />
        {children}
        <div style={{ borderTop: `4px double ${ink.soft}`, margin: '8px 0 4px' }} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 42,
            fontSize: 24,
            fontWeight: 700,
            color: over ? ink.pen : ink.text,
          }}
        >
          <span>{over ? 'TOTAL BRUT' : 'TOTAL'}</span>
          <span>
            <Count to={total} at={1} delay={DROP_BASE} dur={1500} /> / {fmt(WINDOW)}
            {over ? <span style={{ fontSize: 20 }}> (+{fmt(total - WINDOW)})</span> : null}
          </span>
        </div>
        <div style={{ position: 'absolute', right: 14, top: 404 }}>
          <Stamp color={stamp.color} rot={-5} at={2}>
            {stamp.text}
          </Stamp>
        </div>
      </div>
      <Zigzag w={660} />
    </div>
  );
};

const StepBoard = ({
  id,
  n,
  title,
  hand: handText,
  ctx,
  prompt,
  toks,
  head,
  rows,
  stamp,
  verdict,
  extra,
}: {
  id: string;
  n: number;
  title: ReactNode;
  hand: ReactNode;
  ctx?: string;
  prompt: ReactNode;
  toks: Toks;
  head: string;
  rows: ReactNode;
  stamp: { text: string; color: string };
  verdict: ReactNode;
  extra?: ReactNode;
}) => {
  const total = sumOf(toks);
  return (
    <Frame id={id} eyebrow={`Étape ${n} / 5 · simulation`} stage={n} beats={2}>
      <Title>{title}</Title>
      <Hand>{handText}</Hand>
      <PromptCard n={n} ctx={ctx} at={1}>
        {prompt}
      </PromptCard>
      <Receipt head={head} turn={n} total={total} stamp={stamp}>
        {rows}
      </Receipt>
      <DeskLabel />
      <div style={{ position: 'absolute', left: DESK_X, top: DESK_Y }}>
        <Desk segs={segsOf(toks)} />
      </div>
      {extra}
      <Gauge tokens={total} x={DESK_X} y={878} d={DROP_BASE} />
      <PostIt x={1384} y={584} w={390} rot={3} at={2} d={320} size={31}>
        {verdict}
      </PostIt>
    </Frame>
  );
};

// ─── Shared cards ───────────────────────────────────────────────────────────
const cardBox: CSSProperties = {
  boxSizing: 'border-box',
  background: ink.card,
  border: `2.5px solid ${ink.text}`,
  borderRadius: 18,
  boxShadow: `7px 7px 0 ${ink.text}`,
};

const InfoCard = ({
  x,
  y,
  w,
  icon,
  color,
  title,
  cls,
  d = 0,
  children,
}: {
  x: number;
  y: number;
  w: number;
  icon: ReactNode;
  color: string;
  title: ReactNode;
  cls?: string;
  d?: number;
  children: ReactNode;
}) => (
  <div
    className={cls}
    style={{ ...cardBox, position: 'absolute', left: x, top: y, width: w, padding: '18px 26px 20px', ...vars({ d: ms(d) }) }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 30, fontWeight: 800, lineHeight: 1.2 }}>
      <span
        style={{
          flex: 'none',
          width: 42,
          height: 42,
          borderRadius: 999,
          display: 'grid',
          placeItems: 'center',
          background: color,
          color: ink.card,
          fontSize: 22,
          fontWeight: 800,
        }}
      >
        {icon}
      </span>
      {title}
    </div>
    <div style={{ marginTop: 10, fontSize: 26, lineHeight: 1.4, color: ink.soft }}>{children}</div>
  </div>
);

const Bullet = ({
  icon,
  color,
  title,
  cls,
  d = 0,
  children,
}: {
  icon: ReactNode;
  color: string;
  title: ReactNode;
  cls?: string;
  d?: number;
  children: ReactNode;
}) => (
  <div className={cls} style={{ display: 'flex', gap: 22, alignItems: 'flex-start', ...vars({ d: ms(d) }) }}>
    <span
      style={{
        flex: 'none',
        width: 56,
        height: 56,
        borderRadius: 999,
        display: 'grid',
        placeItems: 'center',
        background: color,
        color: ink.card,
        fontSize: 28,
        fontWeight: 800,
        border: `2.5px solid ${ink.text}`,
        boxShadow: `3px 3px 0 ${ink.text}`,
      }}
    >
      {icon}
    </span>
    <div>
      <div style={{ fontSize: 31, fontWeight: 800, lineHeight: 1.2 }}>{title}</div>
      <div style={{ fontSize: 26, lineHeight: 1.4, color: ink.soft, marginTop: 6 }}>{children}</div>
    </div>
  </div>
);

const Pill = ({ children }: { children: ReactNode }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      height: 44,
      padding: '0 20px',
      borderRadius: 999,
      border: `2px solid ${ink.text}`,
      background: ink.card,
      fontFamily: mono,
      fontSize: 20,
      fontWeight: 700,
      boxShadow: `3px 3px 0 ${ink.text}`,
    }}
  >
    {children}
  </span>
);

// Syntax colors for code blocks (light paper / dark terminal).
const syn = {
  light: { k: '#b2552a', s: '#2f7a4c', c: '#9a8b76', f: '#2f56b0' },
  dark: { k: '#ff9f7d', s: '#a6dcae', c: '#a39581', f: '#9cc0ff' },
};

const CodeBox = ({ dark = false, size = 21, children }: { dark?: boolean; size?: number; children: ReactNode }) => (
  <pre
    style={{
      margin: 0,
      fontFamily: mono,
      fontSize: size,
      fontVariantLigatures: 'none',
      lineHeight: 1.5,
      padding: '16px 22px',
      borderRadius: 12,
      background: dark ? '#2a2119' : ink.paper,
      color: dark ? '#f6ecd8' : ink.text,
      border: dark ? 'none' : `1.5px solid ${ink.rule}`,
      whiteSpace: 'pre',
    }}
  >
    {children}
  </pre>
);

// ═══════════════════════════════════════════════════════════════════════════
// 01 · Cover
// ═══════════════════════════════════════════════════════════════════════════
const COVER_SEGS: DeskSeg[] = [
  { cat: 'sys', t: 450 },
  { cat: 'proj', t: 150 },
  { cat: 'files', t: 3850 },
  { cat: 'hist', t: 1450 },
  { cat: 'prompt', t: 110 },
  { cat: 'reply', t: 600 },
];

const Cover: Page = () => (
  <Frame id="cover" footer={false}>
    <div style={{ position: 'absolute', left: 120, top: 196, width: 940 }}>
      <div
        style={{
          fontFamily: mono,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: ink.pen,
        }}
      >
        Démystifier · IA de code
      </div>
      <h1
        style={{
          margin: '26px 0 0',
          fontFamily: display,
          fontWeight: 800,
          fontSize: 'var(--osd-size-hero)',
          lineHeight: 0.98,
          letterSpacing: '-0.035em',
        }}
      >
        La fenêtre
        <br />
        de contexte
      </h1>
      <div
        style={{
          marginTop: 20,
          fontFamily: hand,
          fontSize: 56,
          fontWeight: 700,
          color: ink.pen,
          transform: 'rotate(-2deg)',
          transformOrigin: '0 50%',
        }}
      >
        …ou l’art de ranger son bureau
      </div>
      <p style={{ margin: '26px 0 0', fontSize: 32, lineHeight: 1.42, color: ink.soft, maxWidth: 840 }}>
        Comment GitHub Copilot, Cursor ou ChatGPT gèrent leur mémoire de travail — suivi pas à pas sur une vraie
        session de développement.
      </p>
      <div style={{ display: 'flex', gap: 16, marginTop: 36 }}>
        <Pill>GitHub Copilot</Pill>
        <Pill>Cursor</Pill>
        <Pill>ChatGPT</Pill>
      </div>
    </div>

    <svg aria-hidden width={180} height={180} style={{ position: 'absolute', left: 1080, top: 700 }}>
      <circle cx={90} cy={90} r={62} fill="none" stroke="#8a5a2b" strokeOpacity={0.16} strokeWidth={10} />
      <circle cx={94} cy={86} r={55} fill="none" stroke="#8a5a2b" strokeOpacity={0.08} strokeWidth={4} />
    </svg>
    <div style={{ position: 'absolute', left: 1100, top: 330, transform: 'rotate(-4deg)' }}>
      <Desk segs={COVER_SEGS} cell={36} gap={5} pad={18} mode="mount" />
    </div>
    <PostIt x={1540} y={248} w={270} rot={6} size={36}>
      8 192 tokens.
      <br />
      Pas un de plus !
    </PostIt>
    <div
      style={{
        position: 'absolute',
        left: 1170,
        top: 760,
        fontFamily: hand,
        fontSize: 30,
        fontWeight: 500,
        color: ink.muted,
        transform: 'rotate(-3deg)',
      }}
    >
      le bureau de l’IA, vu de dessus
    </div>
  </Frame>
);

// ═══════════════════════════════════════════════════════════════════════════
// 02 · Tokens = sheets of paper
// ═══════════════════════════════════════════════════════════════════════════
const TOK_FS = 30;
const TOK_CH = TOK_FS * 0.6;
const TOK_PAD = 9;
const TOK_GAP = 8;
const chipLayout = (toks: string[], x0: number) => {
  let x = x0;
  return toks.map((t) => {
    const w = Math.round(t.length * TOK_CH + TOK_PAD * 2);
    const slot = { x, w, cx: x + w / 2 };
    x += w + TOK_GAP;
    return slot;
  });
};

// Illustrative BPE-style split; "·" stands for the space carried by the token.
const PROSE = ['Le', '·dévelop', 'peur', '·rel', 'it', '·son', '·code', '.'];
const CODE = [
  'const', '·total', 'Price', '·=', '·cart', 'Items', '.reduce', '((', 's', ',',
  '·i', ')', '·=>', '·s', '·+', '·i', '.price', ',', '·0', ');',
];
const PROSE_L = chipLayout(PROSE, 120);
const CODE_L = chipLayout(CODE, 120);
const TOK_TONES: Cat[] = ['sys', 'proj', 'hist', 'prompt', 'memo'];

const TokChip = ({ text, x, y, i, at, d }: { text: string; x: number; y: number; i: number; at: number; d: number }) => {
  const tone = CAT[TOK_TONES[i % TOK_TONES.length]];
  const lead = text.startsWith('·');
  return (
    <div
      className={`ctx-on${at}`}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        height: 60,
        boxSizing: 'border-box',
        padding: `0 ${TOK_PAD - 1.5}px`,
        display: 'flex',
        alignItems: 'center',
        background: tone.bg,
        border: `1.5px solid ${tone.bd}`,
        borderRadius: 8,
        fontFamily: mono,
        fontSize: TOK_FS,
        fontVariantLigatures: 'none',
        whiteSpace: 'pre',
        color: ink.text,
        boxShadow: '0 3px 0 rgba(0,0,0,0.12)',
        ...vars({ d: ms(d) }),
      }}
    >
      {lead ? <span style={{ color: ink.muted }}>·</span> : null}
      {lead ? text.slice(1) : text}
    </div>
  );
};

const RowLabel = ({ y, title, badge, at }: { y: number; title: string; badge: string; at: number }) => (
  <div className={`ctx-on${at}`} style={{ position: 'absolute', left: 120, top: y, display: 'flex', alignItems: 'center', gap: 18 }}>
    <span style={{ fontSize: 30, fontWeight: 800 }}>{title}</span>
    <span
      style={{
        fontFamily: mono,
        fontSize: 18,
        fontWeight: 700,
        padding: '4px 12px',
        borderRadius: 999,
        background: ink.text,
        color: ink.card,
      }}
    >
      {badge}
    </span>
  </div>
);

const TokensPage: Page = () => (
  <Frame id="tokens" eyebrow="Le modèle mental · 1/4" beats={3}>
    <Title>Les tokens sont les feuilles de papier</Title>
    <Hand>1 token ≈ 4 caractères ≈ ¾ de mot</Hand>

    <RowLabel y={262} title="Du texte" badge="30 caractères → 8 tokens" at={1} />
    {PROSE.map((t, i) => (
      <TokChip key={t + i} text={t} x={PROSE_L[i].x} y={312} i={i} at={1} d={120 + i * 70} />
    ))}

    <RowLabel y={424} title="Du code" badge="62 caractères → 20 tokens" at={2} />
    {CODE.map((t, i) => (
      <TokChip key={t + i} text={t} x={CODE_L[i].x} y={474} i={i + 2} at={2} d={120 + i * 45} />
    ))}

    <HandArrow x1={210} y1={640} x2={CODE_L[1].x + 17} y2={546} bend={-0.15} cls="ctx-fade3" />
    <div className="ctx-fade3" style={{ position: 'absolute', left: 120, top: 644, fontFamily: hand, fontSize: 34, fontWeight: 700, color: ink.pen }}>
      les espaces comptent aussi
    </div>
    <HandArrow x1={560} y1={662} x2={CODE_L[2].cx} y2={546} bend={0.12} cls="ctx-fade3" d={150} />
    <HandArrow x1={660} y1={662} x2={CODE_L[5].cx} y2={546} bend={-0.12} cls="ctx-fade3" d={150} />
    <div
      className="ctx-fade3"
      style={{ position: 'absolute', left: 520, top: 666, fontFamily: hand, fontSize: 34, fontWeight: 700, color: ink.pen, ...vars({ d: '150ms' }) }}
    >
      camelCase → coupé en deux
    </div>
    <HandArrow x1={1040} y1={642} x2={CODE_L[7].cx} y2={546} bend={0.12} cls="ctx-fade3" d={300} />
    <HandArrow x1={1190} y1={642} x2={CODE_L[12].cx} y2={546} bend={-0.12} cls="ctx-fade3" d={300} />
    <div
      className="ctx-fade3"
      style={{ position: 'absolute', left: 1000, top: 646, fontFamily: hand, fontSize: 34, fontWeight: 700, color: ink.pen, ...vars({ d: '300ms' }) }}
    >
      chaque symbole compte
    </div>

    <div className="ctx-on3" style={{ position: 'absolute', left: 120, top: 770, fontSize: 30, lineHeight: 1.5, ...vars({ d: '450ms' }) }}>
      <div>
        Prose : <b>≈ 3,8</b> caractères par token
      </div>
      <div>
        Code : <b style={{ color: ink.pen }}>≈ 3,1</b> caractères par token
      </div>
    </div>
    <PostIt x={1180} y={736} w={600} rot={-2} at={3} d={600} size={38}>
      1 ligne de TypeScript ≈ 8 tokens
      <br />→ 500 lignes ≈ 3 850 tokens
    </PostIt>
    <div style={{ position: 'absolute', left: 120, top: 920, fontFamily: mono, fontSize: 17, color: ink.muted }}>
      Découpage illustratif : chaque modèle a son propre tokenizer.
    </div>
  </Frame>
);

// ═══════════════════════════════════════════════════════════════════════════
// 03 · Context window = desk surface
// ═══════════════════════════════════════════════════════════════════════════
const EqRow = ({ big, small, d }: { big: string; small: string; d: number }) => (
  <div className="ctx-on1" style={{ display: 'flex', alignItems: 'baseline', gap: 16, height: 58, ...vars({ d: ms(d) }) }}>
    <span style={{ fontFamily: mono, fontSize: 34, fontWeight: 700, minWidth: 220 }}>{big}</span>
    <span style={{ fontSize: 32, color: ink.soft }}>{small}</span>
  </div>
);

const ChalkNote = ({ x, y, w, at, d = 0, children }: { x: number; y: number; w: number; at: number; d?: number; children: ReactNode }) => (
  <div
    className={`ctx-fade${at}`}
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      fontFamily: hand,
      fontSize: 38,
      fontWeight: 700,
      lineHeight: 1.08,
      color: ink.chalk,
      ...vars({ d: ms(d) }),
    }}
  >
    {children}
  </div>
);

const WINDOW_SEGS: DeskSeg[] = [
  { cat: 'sys', t: 450, at: 2 },
  { cat: 'proj', t: 150, at: 2 },
  { cat: 'reply', t: 800, at: 3 },
];

const WindowPage: Page = () => (
  <Frame id="window" eyebrow="Le modèle mental · 2/4" beats={3}>
    <Title>La fenêtre de contexte = la surface du bureau</Title>
    <Hand>fixe, non extensible… et partagée avec la réponse</Hand>

    <div
      style={{
        position: 'absolute',
        left: 112,
        top: 270,
        fontFamily: display,
        fontWeight: 800,
        fontSize: 176,
        lineHeight: 1,
        letterSpacing: '-0.04em',
      }}
    >
      8{NNBSP}192
    </div>
    <div style={{ position: 'absolute', left: 124, top: 458, fontFamily: mono, fontSize: 28, color: ink.muted }}>
      tokens · la taille du bureau (démo)
    </div>
    <div style={{ position: 'absolute', left: 124, top: 540, width: 680 }}>
      <EqRow big="≈ 32 000" small="caractères" d={0} />
      <EqRow big="≈ 6 000" small="mots" d={120} />
      <EqRow big="≈ 1 000" small="lignes de TypeScript" d={240} />
    </div>
    <p style={{ position: 'absolute', left: 124, top: 770, width: 650, margin: 0, fontSize: 25, lineHeight: 1.45, color: ink.soft }}>
      Les modèles récents vont de 128&nbsp;k à plus d’1&nbsp;M de tokens&nbsp;: bureau plus grand, mêmes règles.
    </p>

    <DeskLabel />
    <div style={{ position: 'absolute', left: DESK_X, top: DESK_Y }}>
      <Desk segs={WINDOW_SEGS} />
    </div>
    <HandArrow x1={1110} y1={462} x2={1150} y2={372} bend={0.15} color={ink.chalk} cls="ctx-fade2" d={500} />
    <ChalkNote x={920} y={470} w={560} at={2} d={500}>
      ≈ 600 tokens déjà pris par les consignes cachées, avant même votre premier mot&nbsp;!
    </ChalkNote>
    <HandArrow x1={1530} y1={650} x2={1583} y2={372} bend={-0.1} color={ink.chalk} cls="ctx-fade3" d={400} />
    <ChalkNote x={920} y={636} w={580} at={3} d={400}>
      …et la réponse s’écrit sur le même bureau&nbsp;:
      <br />
      gardez-lui de la place.
    </ChalkNote>
  </Frame>
);

// ═══════════════════════════════════════════════════════════════════════════
// 04 · Stateless: everything is re-sent
// ═══════════════════════════════════════════════════════════════════════════
const Piece = ({ cat, w, label, copy, fresh }: { cat: Cat; w: number; label: string; copy?: boolean; fresh?: boolean }) => (
  <div
    style={{
      position: 'relative',
      width: w,
      height: 72,
      flex: 'none',
      boxSizing: 'border-box',
      borderRadius: 8,
      background: CAT[cat].bg,
      border: fresh ? `3px solid ${ink.pen}` : `1.5px solid ${CAT[cat].bd}`,
      display: 'grid',
      placeItems: 'center',
      fontFamily: mono,
      fontSize: 18,
      fontWeight: 700,
      color: ink.text,
      boxShadow: '0 3px 0 rgba(0,0,0,0.15)',
    }}
  >
    {copy ? (
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 6,
          background: 'repeating-linear-gradient(135deg, rgba(42,33,25,0.12) 0 5px, transparent 5px 11px)',
        }}
      />
    ) : null}
    <span style={{ position: 'relative' }}>{label}</span>
  </div>
);

const SendRow = ({ y, n, at, children }: { y: number; n: number; at: number; children: ReactNode }) => (
  <div className={`ctx-on${at}`} style={{ position: 'absolute', left: 120, top: y, width: 1200, height: 72 }}>
    <div style={{ position: 'absolute', left: 0, top: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
      <Key at={0} label="" />
      <span style={{ fontFamily: mono, fontSize: 22, fontWeight: 700 }}>Envoi n°{n}</span>
    </div>
    <div style={{ position: 'absolute', left: 260, top: 0, display: 'flex', gap: 8 }}>{children}</div>
  </div>
);

const AmnesiaPage: Page = () => (
  <Frame id="amnesia" eyebrow="Le modèle mental · 3/4" beats={4}>
    <Title>Un LLM ne se souvient de rien</Title>
    <Hand>il est « stateless » : sans état entre deux appels</Hand>
    <p style={{ position: 'absolute', left: 120, top: 248, margin: 0, fontSize: 30, color: ink.soft }}>
      À chaque Entrée, l’application lui ré-envoie <b style={{ color: ink.text }}>toute</b> la conversation, depuis le
      début.
    </p>
    <div
      style={{
        position: 'absolute',
        right: 120,
        top: 254,
        display: 'flex',
        gap: 22,
        alignItems: 'center',
        fontFamily: mono,
        fontSize: 17,
        color: ink.muted,
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            width: 26,
            height: 18,
            borderRadius: 3,
            border: `1.5px solid ${ink.faint}`,
            background: 'repeating-linear-gradient(135deg, rgba(42,33,25,0.18) 0 4px, transparent 4px 8px)',
          }}
        />
        recopié
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 26, height: 18, borderRadius: 3, border: `3px solid ${ink.pen}`, boxSizing: 'border-box' }} />
        nouveau
      </span>
    </div>

    <SendRow y={340} n={1} at={1}>
      <Piece cat="sys" w={140} label="Système" />
      <Piece cat="prompt" w={120} label="Prompt 1" fresh />
    </SendRow>
    <SendRow y={470} n={2} at={2}>
      <Piece cat="sys" w={140} label="Système" copy />
      <Piece cat="prompt" w={120} label="Prompt 1" copy />
      <Piece cat="hist" w={170} label="Réponse 1" copy />
      <Piece cat="prompt" w={120} label="Prompt 2" fresh />
    </SendRow>
    <SendRow y={600} n={3} at={3}>
      <Piece cat="sys" w={140} label="Système" copy />
      <Piece cat="prompt" w={120} label="Prompt 1" copy />
      <Piece cat="hist" w={170} label="Réponse 1" copy />
      <Piece cat="prompt" w={120} label="Prompt 2" copy />
      <Piece cat="hist" w={170} label="Réponse 2" copy />
      <Piece cat="prompt" w={120} label="Prompt 3" fresh />
    </SendRow>
    <HandArrow x1={664} y1={376} x2={1420} y2={420} bend={0.02} color={ink.soft} cls="ctx-fade1" d={300} />
    <HandArrow x1={970} y1={506} x2={1420} y2={510} bend={0.02} color={ink.soft} cls="ctx-fade2" d={300} />
    <HandArrow x1={1276} y1={636} x2={1420} y2={600} bend={0.02} color={ink.soft} cls="ctx-fade3" d={300} />
    <svg aria-hidden className="ctx-fade3" width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', ...vars({ d: '450ms' }) }}>
      <path d="M380 686 v14 h752 v-14" fill="none" stroke={ink.pen} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div
      className="ctx-fade3"
      style={{ position: 'absolute', left: 560, top: 708, fontFamily: hand, fontSize: 34, fontWeight: 700, color: ink.pen, ...vars({ d: '450ms' }) }}
    >
      tout ça est recopié et ré-envoyé, tel quel
    </div>

    <div
      style={{
        position: 'absolute',
        left: 1440,
        top: 330,
        width: 360,
        height: 350,
        boxSizing: 'border-box',
        padding: '26px 28px',
        borderRadius: 22,
        background: ink.text,
        color: ink.card,
        boxShadow: `7px 7px 0 ${ink.pen}`,
        textAlign: 'center',
      }}
    >
      <div style={{ fontFamily: mono, fontSize: 17, letterSpacing: '0.16em', color: ink.faint }}>LE MODÈLE (LLM)</div>
      <div style={{ fontSize: 64, lineHeight: 1.2, marginTop: 8 }}>🤖</div>
      <div style={{ fontSize: 24, marginTop: 6, color: '#e9dcc4' }}>Mémoire entre deux appels</div>
      <div style={{ fontFamily: mono, fontSize: 104, fontWeight: 700, lineHeight: 1.05, color: '#ff8a6c' }}>0</div>
      <div style={{ fontFamily: mono, fontSize: 18, color: ink.faint }}>octet conservé</div>
    </div>

    <PostIt x={120} y={792} w={1180} rot={-1.2} at={4} size={42}>
      Ce n’est pas l’IA qui se souvient&nbsp;:
      <br />
      c’est l’application qui lui relit tout, à chaque fois.
    </PostIt>
    <p
      className="ctx-on4"
      style={{ position: 'absolute', left: 1440, top: 806, width: 360, margin: 0, fontSize: 25, lineHeight: 1.4, color: ink.soft, ...vars({ d: '400ms' }) }}
    >
      Conséquence&nbsp;: chaque tour re‑paie <b style={{ color: ink.text }}>tout l’historique</b> en tokens.
    </p>
  </Frame>
);

// ═══════════════════════════════════════════════════════════════════════════
// 05 · Saturation: three ways out
// ═══════════════════════════════════════════════════════════════════════════
const miniCat = (i: number): Cat => (i < 4 ? 'sys' : i < 5 ? 'proj' : i < 30 ? 'files' : i < 42 ? 'hist' : 'prompt');

const MiniMat = ({ x, y, cols = 10, rows = 5, filled = 50, s = 22, g = 4 }: { x: number; y: number; cols?: number; rows?: number; filled?: number; s?: number; g?: number }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: cols * (s + g) - g + 24,
      height: rows * (s + g) - g + 24,
      borderRadius: 12,
      background: `radial-gradient(ellipse 80% 70% at 30% 22%, ${ink.matHi}, ${ink.mat} 60%, ${ink.matLo})`,
      boxShadow: '0 10px 18px -12px rgba(50, 30, 10, 0.6)',
    }}
  >
    {Array.from({ length: filled }, (_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: 12 + (i % cols) * (s + g),
          top: 12 + Math.floor(i / cols) * (s + g),
          width: s,
          height: s,
          boxSizing: 'border-box',
          borderRadius: 3,
          background: CAT[miniCat(i)].bg,
          border: `1px solid ${CAT[miniCat(i)].bd}`,
        }}
      />
    ))}
  </div>
);

const SatRefuse = () => (
  <div style={{ position: 'relative', width: 464, height: 220 }}>
    <MiniMat x={18} y={40} />
    <div
      style={{
        position: 'absolute',
        left: 330,
        top: 20,
        width: 86,
        height: 108,
        boxSizing: 'border-box',
        padding: '18px 14px',
        borderRadius: 5,
        border: `1.5px solid ${CAT.logs.bd}`,
        background: sheetBg('logs', 86),
        transform: 'rotate(16deg)',
        boxShadow: '0 8px 14px -8px rgba(0,0,0,0.4)',
      }}
    />
    <svg aria-hidden width={464} height={220} style={{ position: 'absolute', left: 0, top: 0 }}>
      <path d="M342 52 L404 120 M404 52 L342 120" stroke={ink.pen} strokeWidth={9} strokeLinecap="round" />
      <path d="M318 168 q20 -18 40 0" fill="none" stroke={ink.faint} strokeWidth={3} strokeDasharray="5 6" />
    </svg>
    <div style={{ position: 'absolute', left: 300, top: 150 }}>
      <Stamp color={st.red} rot={-8} at={0} size={22}>
        Refusé
      </Stamp>
    </div>
  </div>
);

const SatBin = () => (
  <svg aria-hidden width={464} height={220} viewBox="0 0 464 220">
    <path d="M70 70 Q150 -18 214 64" fill="none" stroke={ink.faint} strokeWidth={3} strokeDasharray="6 8" />
    <g transform="translate(62 82)">
      <circle r={24} fill={ink.paper} stroke={ink.muted} strokeWidth={3} />
      <path d="M-13 -6 l9 7 l6 -11 l9 13 l-14 7 M-6 10 l8 -5" fill="none" stroke={ink.faint} strokeWidth={2.5} strokeLinecap="round" />
    </g>
    <circle cx={208} cy={76} r={23} fill={CAT.hist.bg} stroke={CAT.hist.bd} strokeWidth={3} />
    <circle cx={252} cy={70} r={25} fill={ink.paper} stroke={ink.muted} strokeWidth={3} />
    <path d="M240 60 l9 8 l7 -10 l8 12" fill="none" stroke={ink.faint} strokeWidth={2.5} strokeLinecap="round" />
    <path d="M168 92 L296 92 L281 210 L183 210 Z" fill="#dcc59e" stroke={ink.text} strokeWidth={4} strokeLinejoin="round" />
    <path d="M206 104 L210 198 M232 104 L232 198 M258 104 L254 198" stroke={ink.text} strokeOpacity={0.45} strokeWidth={3} strokeLinecap="round" />
    <rect x={158} y={82} width={148} height={16} rx={6} fill="#c9ad80" stroke={ink.text} strokeWidth={4} />
  </svg>
);

const SatMemo = () => (
  <div style={{ position: 'relative', width: 464, height: 220 }}>
    <StackSheet x={40} y={44} r={-6} />
    <StackSheet x={52} y={36} r={-2} />
    <StackSheet x={64} y={30} r={2} />
    <StackSheet x={76} y={26} r={5} />
    <svg aria-hidden width={464} height={220} style={{ position: 'absolute', left: 0, top: 0 }}>
      <path d="M236 112 L290 112" stroke={ink.text} strokeWidth={5} strokeLinecap="round" />
      <path d="M278 100 L292 112 L278 124" fill="none" stroke={ink.text} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div
      style={{
        position: 'absolute',
        left: 300,
        top: 44,
        width: 150,
        height: 140,
        boxSizing: 'border-box',
        padding: '16px 14px',
        background: ink.postit,
        transform: 'rotate(4deg)',
        boxShadow: '0 12px 18px -12px rgba(70, 45, 10, 0.55)',
        fontFamily: hand,
        fontSize: 27,
        fontWeight: 700,
        lineHeight: 1.05,
      }}
    >
      mémo :
      <br />
      Express
      <br />+ taxes ✓
    </div>
  </div>
);

const StackSheet = ({ x, y, r }: { x: number; y: number; r: number }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 128,
      height: 160,
      boxSizing: 'border-box',
      padding: '22px 18px',
      borderRadius: 5,
      border: `1.5px solid ${CAT.files.bd}`,
      background: sheetBg('files', 128),
      transform: `rotate(${r}deg)`,
      boxShadow: '0 4px 8px -4px rgba(0,0,0,0.3)',
    }}
  />
);

const SatCard = ({
  x,
  n,
  title,
  tag,
  at,
  illus,
  children,
}: {
  x: number;
  n: number;
  title: string;
  tag: string;
  at: number;
  illus: ReactNode;
  children: ReactNode;
}) => (
  <div className={`ctx-on${at}`} style={{ ...cardBox, position: 'absolute', left: x, top: 276, width: 520, height: 548, padding: 26 }}>
    <div style={{ height: 220, borderRadius: 12, background: 'rgba(196, 160, 110, 0.14)', display: 'grid', placeItems: 'center' }}>
      {illus}
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 24 }}>
      <span style={{ fontFamily: mono, fontSize: 26, fontWeight: 700, color: ink.pen }}>{n}</span>
      <span style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.1 }}>{title}</span>
    </div>
    <div style={{ marginTop: 10, fontSize: 26, lineHeight: 1.4, color: ink.soft }}>{children}</div>
    <div
      style={{
        position: 'absolute',
        left: 26,
        bottom: 24,
        fontFamily: mono,
        fontSize: 17,
        fontWeight: 700,
        padding: '4px 12px',
        borderRadius: 999,
        border: `1.5px solid ${ink.faint}`,
        color: ink.muted,
      }}
    >
      {tag}
    </div>
  </div>
);

const SaturationPage: Page = () => (
  <Frame id="saturation" eyebrow="Le modèle mental · 4/4" beats={4}>
    <Title>Bureau plein ? Trois issues, toutes coûteuses</Title>
    <Hand>refuser, jeter… ou résumer</Hand>
    <SatCard x={120} n={1} title="Refuser" tag="erreur" at={1} illus={<SatRefuse />}>
      Plus une once de place : la nouvelle feuille est rejetée, la requête échoue.
    </SatCard>
    <SatCard x={700} n={2} title="Jeter" tag="éviction" at={2} illus={<SatBin />}>
      On retire des feuilles anciennes ou volumineuses pour faire de la place.
    </SatCard>
    <SatCard x={1280} n={3} title="Résumer" tag="compactage" at={3} illus={<SatMemo />}>
      On remplace une pile de feuilles par un post-it qui en garde l’essentiel.
    </SatCard>
    <div className="ctx-on4" style={{ position: 'absolute', left: 120, top: 878, fontSize: 34, fontWeight: 600 }}>
      Dans les trois cas, on perd quelque chose :{' '}
      <span style={{ color: ink.pen, fontWeight: 800 }}>le service… ou des détails.</span>
    </div>
  </Frame>
);

// ═══════════════════════════════════════════════════════════════════════════
// 06 · The session (section divider)
// ═══════════════════════════════════════════════════════════════════════════
const SessionCard = ({ x, n, icon, title, sub, d }: { x: number; n: number; icon: string; title: string; sub: string; d: number }) => (
  <div className="ctx-in" style={{ ...cardBox, position: 'absolute', left: x, top: 560, width: 300, height: 300, padding: '22px 24px', ...vars({ d: ms(d) }) }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontFamily: display, fontSize: 76, fontWeight: 800, lineHeight: 1, color: ink.pen }}>{n}</span>
      <span style={{ fontSize: 46 }}>{icon}</span>
    </div>
    <div style={{ marginTop: 26, fontSize: 32, fontWeight: 800, lineHeight: 1.15 }}>{title}</div>
    <div style={{ marginTop: 12, fontFamily: hand, fontSize: 31, fontWeight: 700, lineHeight: 1.05, color: ink.soft }}>{sub}</div>
  </div>
);

const SessionPage: Page = () => (
  <Frame id="session" eyebrow="Simulation pas à pas">
    <Title top={196} size={112}>
      Une session,
      <br />
      cinq échanges
    </Title>
    <Hand top={452} size={44}>
      un dev · une API Express en TypeScript · un bureau de 8 192 tokens
    </Hand>
    <SessionCard x={120} n={1} icon="💬" title="Init du projet" sub="le bureau est propre" d={100} />
    <SessionCard x={465} n={2} icon="📄" title="Fichier de 500 lignes" sub="le bureau se couvre" d={220} />
    <SessionCard x={810} n={3} icon="🔧" title="Refacto TVA" sub="la mémoire s’accumule" d={340} />
    <SessionCard x={1155} n={4} icon="💥" title="Stack trace" sub="alerte rouge !" d={460} />
    <SessionCard x={1500} n={5} icon="🧹" title="Le grand ménage" sub="éviction & résumé" d={580} />
  </Frame>
);

// ═══════════════════════════════════════════════════════════════════════════
// 07 · Step 1 — clean desk
// ═══════════════════════════════════════════════════════════════════════════
const T1 = { sys: 450, proj: 150, files: 0, hist: 0, prompt: 120, reply: 400 } satisfies Toks;

const Step1Page: Page = () => (
  <StepBoard
    id="e1"
    n={1}
    title="Initialisation du projet"
    hand="le bureau est propre"
    prompt={
      <>
        « Initialise une API REST en TypeScript avec Express. Je veux une route <C>/health</C> et un middleware de
        logging personnalisé. »
      </>
    }
    toks={T1}
    head="Payload envoyé au LLM"
    rows={
      <>
        <Row i={1} cat="sys" label="Instructions système" t={T1.sys} d={rowDelay(T1, 'sys')} note="cachées… mais bien sur le bureau !" />
        <Row i={2} cat="proj" label="copilot-instructions.md" t={T1.proj} d={rowDelay(T1, 'proj')} />
        <Row i={3} cat="files" label="Fichiers ouverts" t={T1.files} d={rowDelay(T1, 'files')} />
        <Row i={4} cat="hist" label="Historique" t={T1.hist} d={rowDelay(T1, 'hist')} />
        <Row i={5} cat="prompt" label="Nouveau prompt" t={T1.prompt} d={rowDelay(T1, 'prompt')} />
        <Row i={6} cat="reply" label="Marge réponse" t={T1.reply} d={rowDelay(T1, 'reply')} />
      </>
    }
    stamp={{ text: 'Optimal', color: st.green }}
    verdict={
      <>
        Attention 100 % focalisée.
        <br />
        Elle génère <C size={21}>/health</C>
        <br />+ <C size={21}>customSecurityLogger</C>
        <br />
        <span style={{ color: ink.pen }}>(retenez ce nom !)</span>
      </>
    }
  />
);

// ═══════════════════════════════════════════════════════════════════════════
// 08 · Step 2 — a 500-line file lands
// ═══════════════════════════════════════════════════════════════════════════
const T2 = { sys: 450, proj: 150, files: 3850, hist: 520, prompt: 130, reply: 800 } satisfies Toks;

const Step2Page: Page = () => (
  <StepBoard
    id="e2"
    n={2}
    title="Ajout d’un gros fichier métier"
    hand="le bureau se couvre de feuilles"
    ctx="order_processor.ts ouvert"
    prompt={
      <>
        « Voici notre processeur de commande. Analyse l’architecture et dis-moi si on respecte les principes SOLID. »
      </>
    }
    toks={T2}
    head="Payload envoyé au LLM"
    rows={
      <>
        <Row i={1} cat="sys" label="Instructions système" t={T2.sys} d={rowDelay(T2, 'sys')} />
        <Row i={2} cat="proj" label="Instructions projet" t={T2.proj} d={rowDelay(T2, 'proj')} />
        <Row i={3} cat="files" label="Fichiers ouverts" t={T2.files} d={rowDelay(T2, 'files')} note="500 lignes, injectées en entier !" />
        <Row i={4} cat="hist" label="Historique" t={T2.hist} d={rowDelay(T2, 'hist')} />
        <Row i={5} cat="prompt" label="Nouveau prompt" t={T2.prompt} d={rowDelay(T2, 'prompt')} />
        <Row i={6} cat="reply" label="Marge réponse" t={T2.reply} d={rowDelay(T2, 'reply')} />
      </>
    }
    stamp={{ text: 'Charge modérée', color: st.yellow }}
    verdict={
      <>
        Analyse correcte :
        <br />
        le fichier entier est là.
        <br />
        Mais 70 % du bureau
        <br />
        est du code statique.
      </>
    }
  />
);

// ═══════════════════════════════════════════════════════════════════════════
// 09 · Step 2 — Lost in the middle
// ═══════════════════════════════════════════════════════════════════════════
const LIM = { x0: 70, x1: 950, yb: 400, yt: 70 };
const limW = (t: number) => 0.3 + 0.55 * (2 * t - 1) ** 2 + 0.12 * t;
const limX = (t: number) => LIM.x0 + t * (LIM.x1 - LIM.x0);
const limY = (t: number) => LIM.yb - limW(t) * (LIM.yb - LIM.yt);
const LIM_PATH = Array.from({ length: 61 }, (_, i) => i / 60)
  .map((t, i) => `${i ? 'L' : 'M'}${limX(t).toFixed(1)} ${limY(t).toFixed(1)}`)
  .join(' ');
const LIM_AREA = `${LIM_PATH} L${LIM.x1} ${LIM.yb} L${LIM.x0} ${LIM.yb} Z`;
// Step-2 payload laid along the x axis (reply margin excluded): 5 100 tokens.
const LIM_SCALE = (LIM.x1 - LIM.x0) / 5100;
const limAt = (tok: number) => LIM.x0 + tok * LIM_SCALE;
const LIM_MID = limAt(600 + 3850 / 2);

const StripSeg = ({ from, to, cat }: { from: number; to: number; cat: Cat }) => (
  <rect
    x={limAt(from)}
    y={420}
    width={limAt(to) - limAt(from)}
    height={40}
    fill={CAT[cat].bg}
    stroke={CAT[cat].bd}
    strokeWidth={1.5}
  />
);

const Attention2Page: Page = () => (
  <Frame id="lim" eyebrow="Étape 2 / 5 · dans la tête de l’IA" stage={2} beats={3}>
    <Title>L’attention s’étale : « Lost in the Middle »</Title>
    <Hand>plus le bureau est chargé, plus le milieu s’efface</Hand>

    <svg width={980} height={560} viewBox="0 0 980 560" style={{ position: 'absolute', left: 120, top: 272, overflow: 'visible' }}>
      <line x1={LIM.x0} y1={LIM.yb} x2={LIM.x1 + 10} y2={LIM.yb} stroke={ink.text} strokeWidth={3} />
      <line x1={LIM.x0} y1={LIM.yt - 30} x2={LIM.x0} y2={LIM.yb} stroke={ink.text} strokeWidth={3} />
      <text x={30} y={240} transform="rotate(-90 30 240)" textAnchor="middle" fontFamily={mono} fontSize={17} fill={ink.muted}>
        poids d’attention
      </text>
      <path className="ctx-fade1" d={LIM_AREA} fill={ink.pen} fillOpacity={0.12} style={vars({ d: '500ms' })} />
      <path className="ctx-draw1" d={LIM_PATH} pathLength={1} fill="none" stroke={ink.pen} strokeWidth={5} strokeLinecap="round" />
      <text className="ctx-fade1" x={LIM.x0 + 16} y={limY(0) - 22} fontFamily={hand} fontWeight={700} fontSize={32} fill={ink.text} style={vars({ d: '600ms' })}>
        début : bien lu
      </text>
      <text className="ctx-fade1" x={LIM.x1} y={limY(1) - 22} textAnchor="end" fontFamily={hand} fontWeight={700} fontSize={32} fill={ink.text} style={vars({ d: '900ms' })}>
        fin : bien lu
      </text>

      <g className="ctx-fade2">
        <line x1={LIM_MID} y1={limY(0.495) + 14} x2={LIM_MID} y2={420} stroke={ink.pen} strokeWidth={3} strokeDasharray="7 7" />
        <circle cx={LIM_MID} cy={limY(0.495)} r={13} fill="none" stroke={ink.pen} strokeWidth={4} />
        <text x={LIM_MID} y={limY(0.495) - 30} textAnchor="middle" fontFamily={hand} fontWeight={700} fontSize={34} fill={ink.pen}>
          milieu : un peu moins de poids
        </text>
      </g>

      <StripSeg from={0} to={450} cat="sys" />
      <StripSeg from={450} to={600} cat="proj" />
      <StripSeg from={600} to={4450} cat="files" />
      <StripSeg from={4450} to={4970} cat="hist" />
      <StripSeg from={4970} to={5100} cat="prompt" />
      <text x={limAt(600) + 10} y={446} fontFamily={mono} fontSize={15} fill={ink.muted}>
        L1
      </text>
      <text x={LIM_MID} y={446} textAnchor="middle" fontFamily={mono} fontSize={15} fontWeight={700} fill={ink.pen}>
        L250
      </text>
      <text x={limAt(4450) - 10} y={446} textAnchor="end" fontFamily={mono} fontSize={15} fill={ink.muted}>
        L500
      </text>
      <text x={LIM.x0} y={488} fontFamily={mono} fontSize={16} fill={ink.soft}>
        système
      </text>
      <text x={LIM_MID} y={488} textAnchor="middle" fontFamily={mono} fontSize={16} fill={ink.soft}>
        order_processor.ts — 500 lignes
      </text>
      <text x={LIM.x1} y={488} textAnchor="end" fontFamily={mono} fontSize={16} fill={ink.soft}>
        historique + prompt
      </text>
      <text x={LIM.x0} y={534} fontFamily={mono} fontSize={15} fill={ink.muted}>
        Réf. : Liu et al., « Lost in the Middle: How Language Models Use Long Contexts », 2023
      </text>
    </svg>

    <div style={{ position: 'absolute', left: 1170, top: 296, width: 630, display: 'flex', flexDirection: 'column', gap: 40 }}>
      <Bullet cls="ctx-on1" d={300} icon="✓" color={st.green} title="Analyse réussie">
        Tout le fichier est sous ses yeux.
      </Bullet>
      <Bullet cls="ctx-on2" d={200} icon="~" color={st.yellow} title="Attention répartie">
        Le début et la fin pèsent plus ; les fonctions du milieu, un peu moins.
      </Bullet>
      <Bullet cls="ctx-on3" icon="!" color={st.orange} title="Moins de place pour discuter">
        Plus de 70 % du bureau est occupé par du code statique.
      </Bullet>
    </div>
  </Frame>
);

// ═══════════════════════════════════════════════════════════════════════════
// 10 · Step 3 — targeted refactor
// ═══════════════════════════════════════════════════════════════════════════
const T3 = { sys: 450, proj: 150, files: 3850, hist: 1450, prompt: 110, reply: 600 } satisfies Toks;

const Step3Page: Page = () => (
  <StepBoard
    id="e3"
    n={3}
    title="Refactorisation ciblée"
    hand="le piège de la mémoire cumulative"
    prompt={
      <>
        « Dans la fonction <C>calculateTaxes</C>, applique le taux de TVA réduit pour les livres et gère l’exception si
        le pays n’est pas dans l’UE. »
      </>
    }
    toks={T3}
    head="Payload envoyé au LLM"
    rows={
      <>
        <Row i={1} cat="sys" label="Instructions système" t={T3.sys} d={rowDelay(T3, 'sys')} />
        <Row i={2} cat="proj" label="Instructions projet" t={T3.proj} d={rowDelay(T3, 'proj')} />
        <Row i={3} cat="files" label="order_processor.ts" t={T3.files} d={rowDelay(T3, 'files')} />
        <Row i={4} cat="hist" label="Historique" t={T3.hist} d={rowDelay(T3, 'hist')} note="Prompt 1 + Rép. 1 + Prompt 2 + Rép. 2" />
        <Row i={5} cat="prompt" label="Nouveau prompt" t={T3.prompt} d={rowDelay(T3, 'prompt')} />
        <Row i={6} cat="reply" label="Marge réponse" t={T3.reply} d={rowDelay(T3, 'reply')} />
      </>
    }
    stamp={{ text: 'Vigilance', color: st.orange }}
    verdict={
      <>
        <C size={21}>calculateTaxes</C> ?
        <br />
        Trouvée sans mal.
        <br />
        Le middleware du début ?
        <br />
        Il s’éloigne…
      </>
    }
  />
);

// ═══════════════════════════════════════════════════════════════════════════
// 11 · Step 3 — present ≠ well used
// ═══════════════════════════════════════════════════════════════════════════
const T3_SPLIT: DeskSeg[] = [
  { cat: 'sys', t: 450, at: 0 },
  { cat: 'proj', t: 150, at: 0 },
  { cat: 'files', t: 3850, at: 0 },
  { cat: 'hist', t: 520, at: 0, hl: true },
  { cat: 'hist', t: 930, at: 0 },
  { cat: 'prompt', t: 110, at: 0 },
  { cat: 'reply', t: 600, at: 0 },
];

const Bubble = ({ who, dark, cls, d = 0, children }: { who: string; dark?: boolean; cls: string; d?: number; children: ReactNode }) => (
  <div
    className={cls}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '12px 20px',
      borderRadius: 16,
      background: dark ? ink.text : CAT.prompt.bg,
      color: dark ? ink.card : ink.text,
      border: dark ? 'none' : `2px solid ${CAT.prompt.bd}`,
      fontSize: 25,
      lineHeight: 1.35,
      ...vars({ d: ms(d) }),
    }}
  >
    <span style={{ flex: 'none', fontFamily: mono, fontSize: 15, fontWeight: 700, letterSpacing: '0.1em', opacity: 0.75 }}>{who}</span>
    <span>{children}</span>
  </div>
);

const Fade3Page: Page = () => (
  <Frame id="fade" eyebrow="Étape 3 / 5 · dans la tête de l’IA" stage={3} beats={3}>
    <Title>Toujours sur le bureau… mais enfoui</Title>
    <Hand>présent ne veut pas dire bien utilisé</Hand>

    <div style={{ position: 'absolute', left: 120, top: 284 }}>
      <Desk segs={T3_SPLIT} cell={40} gap={6} pad={20} mode="static" hlAt={2} />
    </div>
    <svg aria-hidden className="ctx-fade2" width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <ellipse cx={597} cy={508} rx={208} ry={44} fill="none" stroke={ink.pen} strokeWidth={4} transform="rotate(-2 597 508)" />
    </svg>
    <div style={{ position: 'absolute', left: 124, top: 706, fontFamily: mono, fontSize: 17, color: ink.muted }}>
      Payload de l’étape 3 · 6 610 tokens · 103 feuilles
    </div>
    <div className="ctx-fade2" style={{ position: 'absolute', left: 120, top: 740, fontFamily: hand, fontSize: 36, fontWeight: 700, color: ink.pen, ...vars({ d: '300ms' }) }}>
      ↑ le middleware de l’Étape 1 : 8 feuilles sur 103
    </div>
    <div className="ctx-on2" style={{ position: 'absolute', left: 120, top: 808, width: 780, fontSize: 30, fontWeight: 800, ...vars({ d: '600ms' }) }}>
      Rien n’est effacé : c’est noyé, pas supprimé.
    </div>

    <InfoCard x={960} y={284} w={840} icon="✓" color={st.green} title={<>Net : <C>calculateTaxes</C></>} cls="ctx-on1">
      Le fichier complet est dans le payload : elle repère la fonction sans mal.
    </InfoCard>
    <InfoCard x={960} y={478} w={840} icon="~" color={st.orange} title="Flou : la consigne de l’Étape 1" cls="ctx-on2">
      520 tokens sur 6 610 (≈ 8 %), loin derrière 3 850 tokens de code.
    </InfoCard>
    <div style={{ position: 'absolute', left: 960, top: 690, width: 840, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Bubble who="DEV" cls="ctx-on3">« Applique ce calcul au middleware créé plus tôt. »</Bubble>
      <Bubble who="IA" dark cls="ctx-on3" d={500}>
        « Bien sûr ! Voici un middleware de logging générique… »
      </Bubble>
    </div>
    <div
      className="ctx-fade3"
      style={{ position: 'absolute', left: 980, top: 854, fontFamily: hand, fontSize: 34, fontWeight: 700, color: ink.pen, ...vars({ d: '1000ms' }) }}
    >
      → variables confondues, implémentation inventée
    </div>
  </Frame>
);

// ═══════════════════════════════════════════════════════════════════════════
// 12 · Step 4 — raw log dump, overflow
// ═══════════════════════════════════════════════════════════════════════════
const T4 = { sys: 450, proj: 150, files: 3850, hist: 2160, logs: 1650, reply: 800 } satisfies Toks;

const Step4Page: Page = () => (
  <StepBoard
    id="e4"
    n={4}
    title="Le « dump » de logs brut"
    hand="alerte rouge : saturation !"
    ctx="bug au runtime"
    prompt={
      <>
        « J’ai cette erreur au runtime, règle-moi ça tout de suite : <C>[1 600 tokens de stack trace brute]</C> »
      </>
    }
    toks={T4}
    head="Payload brut · sans ménage"
    rows={
      <>
        <Row i={1} cat="sys" label="Instructions système" t={T4.sys} d={rowDelay(T4, 'sys')} />
        <Row i={2} cat="proj" label="Instructions projet" t={T4.proj} d={rowDelay(T4, 'proj')} />
        <Row i={3} cat="files" label="order_processor.ts" t={T4.files} d={rowDelay(T4, 'files')} />
        <Row i={4} cat="hist" label="Historique (1 à 3)" t={T4.hist} d={rowDelay(T4, 'hist')} />
        <Row i={5} cat="logs" label="Prompt + stack trace" t={T4.logs} d={rowDelay(T4, 'logs')} note="120 lignes de logs bruts" />
        <Row i={6} cat="reply" label="Marge réponse" t={T4.reply} d={rowDelay(T4, 'reply')} />
      </>
    }
    stamp={{ text: 'Débordement', color: st.red }}
    verdict={
      <>
        868 tokens de trop.
        <br />
        La réponse n’a plus
        <br />
        de place : erreur ou
        <br />
        troncature, inévitable.
      </>
    }
    extra={
      <div
        className="ctx-fade1"
        style={{
          position: 'absolute',
          left: 1690,
          top: 792,
          fontFamily: hand,
          fontSize: 42,
          fontWeight: 700,
          color: ink.pen,
          ...vars({ d: '2000ms' }),
        }}
      >
        +868
      </div>
    }
  />
);

// ═══════════════════════════════════════════════════════════════════════════
// 13 · Step 4 — two ways to break
// ═══════════════════════════════════════════════════════════════════════════
const ScenarioCard = ({ x, n, title, at, foot, children }: { x: number; n: number; title: string; at: number; foot: ReactNode; children: ReactNode }) => (
  <div className={`ctx-on${at}`} style={{ ...cardBox, position: 'absolute', left: x, top: 272, width: 810, height: 520, padding: '24px 28px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <span
        style={{
          width: 46,
          height: 46,
          borderRadius: 999,
          display: 'grid',
          placeItems: 'center',
          background: ink.pen,
          color: ink.card,
          fontFamily: mono,
          fontSize: 24,
          fontWeight: 700,
        }}
      >
        {n}
      </span>
      <span style={{ fontSize: 36, fontWeight: 800 }}>{title}</span>
    </div>
    <div style={{ marginTop: 20 }}>{children}</div>
    <div style={{ position: 'absolute', left: 28, bottom: 22, fontSize: 26, color: ink.soft }}>{foot}</div>
  </div>
);

const Overflow4Page: Page = () => {
  const d = syn.dark;
  const l = syn.light;
  return (
    <Frame id="break" eyebrow="Étape 4 / 5 · sans intervention" stage={4} beats={3}>
      <Title>Débordement : deux façons de casser</Title>
      <Hand>et aucune n’est agréable</Hand>
      <ScenarioCard x={120} n={1} title="L’API rejette la requête" at={1} foot={<>Rien ne sort. Le dev voit une erreur.</>}>
        <CodeBox dark>
          <span style={{ color: d.c }}>$ POST /v1/chat/completions</span>
          {'\n'}
          <span style={{ color: d.k }}>← 400 Bad Request</span>
          {'\n{\n  '}
          <span style={{ color: d.f }}>"error"</span>
          {': {\n    '}
          <span style={{ color: d.f }}>"code"</span>
          {': '}
          <span style={{ color: '#ff8a6c' }}>"context_length_exceeded"</span>
          {',\n    '}
          <span style={{ color: d.f }}>"message"</span>
          {': '}
          <span style={{ color: d.s }}>"max 8192 tokens,</span>
          {'\n               '}
          <span style={{ color: d.s }}>9060 demandés"</span>
          {'\n  }\n}'}
        </CodeBox>
      </ScenarioCard>
      <ScenarioCard x={990} n={2} title="Le client tronque la réponse" at={2} foot={<>Du code incomplet, qui ne compile pas.</>}>
        <div style={{ position: 'relative' }}>
          <CodeBox>
            <span style={{ color: l.c }}>{'// Voici la correction :'}</span>
            {'\n'}
            <span style={{ color: l.k }}>export function</span> <span style={{ color: l.f }}>calculateTaxes</span>
            {'(order: Order) {\n  '}
            <span style={{ color: l.k }}>for</span>
            {' ('}
            <span style={{ color: l.k }}>const</span>
            {' item '}
            <span style={{ color: l.k }}>of</span>
            {' order.items) {\n    '}
            <span style={{ color: l.k }}>const</span>
            {' rate = item.category === '}
            <span style={{ color: l.s }}>'book'</span>
            {'\n      ? VAT_REDUCED : VAT_STANDARD;\n    '}
            <span style={{ color: l.k }}>if</span>
            {' (!EU_COUNTRIES.includes(order.coun'}
          </CodeBox>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
            <span style={{ fontSize: 30, color: ink.pen }}>✂</span>
            <span style={{ flex: 1, borderTop: `3px dashed ${ink.pen}` }} />
            <span style={{ fontFamily: hand, fontSize: 34, fontWeight: 700, color: ink.pen }}>coupée en pleine ligne !</span>
          </div>
        </div>
      </ScenarioCard>
      <PostIt x={420} y={830} w={1080} rot={-1.5} at={3} size={40}>
        Le dilemme : pour continuer, l’assistant doit <span style={{ color: ink.pen }}>sacrifier des informations</span>.
      </PostIt>
    </Frame>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 14 · Step 5 — the big cleanup
// ═══════════════════════════════════════════════════════════════════════════
const SWEEP_W = 740;
const SWEEP_SCALE = SWEEP_W / 3850;

const SweepRow = ({
  y,
  at,
  icon,
  cat,
  name,
  before,
  after,
  children,
}: {
  y: number;
  at: number;
  icon: string;
  cat: Cat;
  name: string;
  before: number;
  after: number;
  children: ReactNode;
}) => {
  const bw = before * SWEEP_SCALE;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: y,
          width: 84,
          height: 84,
          borderRadius: 999,
          display: 'grid',
          placeItems: 'center',
          fontSize: 40,
          background: CAT[cat].bg,
          border: `2.5px solid ${ink.text}`,
          boxShadow: `3px 3px 0 ${ink.text}`,
        }}
      >
        {icon}
      </div>
      <div style={{ position: 'absolute', left: 232, top: y - 2, width: 570 }}>
        <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.2 }}>{name}</div>
        <div style={{ fontSize: 24, lineHeight: 1.38, color: ink.soft, marginTop: 6 }}>{children}</div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 840,
          top: y + 14,
          width: bw,
          height: 56,
          boxSizing: 'border-box',
          borderRadius: 8,
          border: `2px dashed ${ink.faint}`,
        }}
      />
      <div
        className={`ctx-shrink${at}`}
        style={{
          position: 'absolute',
          left: 840,
          top: y + 14,
          width: bw,
          height: 56,
          boxSizing: 'border-box',
          borderRadius: 8,
          padding: '10px 12px',
          background: sheetBg(cat, 56),
          border: `1.5px solid ${CAT[cat].bd}`,
          ...vars({ s: after / before, d: '150ms' }),
        }}
      />
      <div style={{ position: 'absolute', left: 1610, top: y + 4, width: 190, textAlign: 'right', fontFamily: mono }}>
        <div style={{ position: 'relative', display: 'inline-block', fontSize: 25, color: ink.muted }}>
          {fmt(before)} t
          <span
            className={`ctx-strike${at}`}
            style={{ position: 'absolute', left: -4, right: -4, top: '52%', height: 3, background: ink.pen, ...vars({ d: '200ms' }) }}
          />
        </div>
        <div className={`ctx-on${at}`} style={{ fontSize: 31, fontWeight: 700, color: st.green, ...vars({ d: '700ms' }) }}>
          → {fmt(after)} t
        </div>
      </div>
    </>
  );
};

const CleanupPage: Page = () => (
  <Frame id="cleanup" eyebrow="Étape 5 / 5 · context pruning & rolling summary" stage={5} beats={4}>
    <Title>Le grand ménage : éviction & compactage</Title>
    <Hand>l’IDE range le bureau avant d’envoyer le prompt 5</Hand>
    <SweepRow y={290} at={1} icon="✂️" cat="files" name="Éviction du code brut" before={3850} after={900}>
      Le fichier de 500 lignes → l’extrait autour de <C>calculateTaxes</C> (120 lignes).
    </SweepRow>
    <SweepRow y={480} at={2} icon="📝" cat="hist" name="Résumé de l’historique" before={1450} after={150}>
      Les échanges des étapes 1 et 2 → un bref mémo textuel.
    </SweepRow>
    <SweepRow y={670} at={3} icon="🧹" cat="logs" name="Élagage des logs" before={1600} after={400}>
      La stack trace, sans les lignes internes à Node.js et <C>node_modules</C>.
    </SweepRow>
    <div className="ctx-on4" style={{ position: 'absolute', left: 120, top: 868, display: 'flex', alignItems: 'baseline', gap: 22 }}>
      <span style={{ fontFamily: display, fontSize: 64, fontWeight: 800, color: st.green, letterSpacing: '-0.02em' }}>
        −5 450 tokens
      </span>
      <span style={{ fontSize: 32, color: ink.soft }}>libérés : le prompt 5 peut partir.</span>
    </div>
  </Frame>
);

// ═══════════════════════════════════════════════════════════════════════════
// 15 · Step 5 — rebuilt payload
// ═══════════════════════════════════════════════════════════════════════════
const T5 = { sys: 450, proj: 150, memo: 180, snip: 920, prompt: 90, reply: 600 } satisfies Toks;

const Step5Page: Page = () => (
  <StepBoard
    id="e5"
    n={5}
    title="Le prompt 5, après le ménage"
    hand="un bureau rangé… qui a perdu des feuilles"
    prompt={
      <>« Parfait. Maintenant, réécris la route qu’on avait faite au tout début pour qu’elle appelle cette méthode. »</>
    }
    toks={T5}
    head="Payload reconstruit"
    rows={
      <>
        <Row i={1} cat="sys" label="Instructions système" t={T5.sys} d={rowDelay(T5, 'sys')} />
        <Row i={2} cat="proj" label="Instructions projet" t={T5.proj} d={rowDelay(T5, 'proj')} />
        <Row i={3} cat="memo" label="Résumé compacté" t={T5.memo} d={rowDelay(T5, 'memo')} note="« Express + taxes traités »" />
        <Row i={4} cat="snip" label="Code ciblé (extrait)" t={T5.snip} d={rowDelay(T5, 'snip')} />
        <Row i={5} cat="prompt" label="Nouveau prompt" t={T5.prompt} d={rowDelay(T5, 'prompt')} />
        <Row i={6} cat="reply" label="Marge réponse" t={T5.reply} d={rowDelay(T5, 'reply')} />
      </>
    }
    stamp={{ text: 'Rétabli', color: st.green }}
    verdict={
      <>
        Espace récupéré…
        <br />
        au prix d’une perte
        <br />
        de détails.
      </>
    }
  />
);

// ═══════════════════════════════════════════════════════════════════════════
// 16 · Step 5 — what got forgotten
// ═══════════════════════════════════════════════════════════════════════════
const CodeCard = ({ y, label, color, at, children }: { y: number; label: string; color: string; at: number; children: ReactNode }) => (
  <div className={`ctx-on${at}`} style={{ position: 'absolute', left: 860, top: y, width: 940 }}>
    <div style={{ fontFamily: mono, fontSize: 18, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color, marginBottom: 10 }}>
      {label}
    </div>
    {children}
  </div>
);

const Forget5Page: Page = () => {
  const l = syn.light;
  return (
    <Frame id="forget" eyebrow="Étape 5 / 5 · les conséquences" stage={5} beats={4}>
      <Title>Et le middleware de l’Étape 1 ?</Title>
      <Hand>évincé… au moment de résumer</Hand>
      <PromptCard n={5} at={0}>
        « Réécris la route qu’on avait faite au tout début pour qu’elle appelle cette méthode. »
      </PromptCard>
      <PostIt x={150} y={510} w={560} rot={-2} at={1} size={40}>
        Mémo : l’utilisateur a configuré Express et traité les taxes.
      </PostIt>
      <div
        className="ctx-fade1"
        style={{ position: 'absolute', left: 140, top: 724, width: 640, fontFamily: hand, fontSize: 38, fontWeight: 700, lineHeight: 1.1, color: ink.pen, ...vars({ d: '700ms' }) }}
      >
        …et <span style={{ fontFamily: mono, fontSize: 26 }}>customSecurityLogger</span> ? Disparu du mémo.
      </div>

      <CodeCard y={256} label="Votre code · étape 1" color={st.green} at={2}>
        <CodeBox size={22}>
          {'app.'}
          <span style={{ color: l.f }}>use</span>
          {'('}
          <span style={{ color: l.f, fontWeight: 700 }}>customSecurityLogger</span>
          {'({\n  redact: ['}
          <span style={{ color: l.s }}>'authorization'</span>
          {'],\n  level: '}
          <span style={{ color: l.s }}>'audit'</span>
          {',\n}));\napp.'}
          <span style={{ color: l.f }}>get</span>
          {'('}
          <span style={{ color: l.s }}>'/health'</span>
          {', healthCheck);'}
        </CodeBox>
      </CodeCard>
      <CodeCard y={530} label="Ce que l’IA génère · étape 5" color={ink.pen} at={3}>
        <div style={{ position: 'relative' }}>
          <CodeBox size={22}>
            {'app.'}
            <span style={{ color: l.f }}>use</span>
            {'('}
            <span style={{ color: ink.pen, fontWeight: 700 }}>logger</span>
            {');   '}
            <span style={{ color: l.c }}>{'// ← middleware inventé'}</span>
            {'\napp.'}
            <span style={{ color: l.f }}>get</span>
            {'('}
            <span style={{ color: l.s }}>'/health'</span>
            {', (req, res) => {\n  res.'}
            <span style={{ color: l.f }}>json</span>
            {'('}
            <span style={{ color: l.f }}>calculateTaxes</span>
            {'(req.body));\n});'}
          </CodeBox>
          <div style={{ position: 'absolute', right: 26, top: 14 }}>
            <Stamp color={st.red} rot={-10} at={3} d={500} size={28}>
              Inventé
            </Stamp>
          </div>
        </div>
      </CodeCard>
      <div
        className="ctx-on4"
        style={{ position: 'absolute', left: 120, top: 852, width: 1680, fontSize: 34, fontWeight: 600, lineHeight: 1.35 }}
      >
        Vous croyez parler au même interlocuteur…
        <br />
        <span style={{ color: ink.pen, fontWeight: 800 }}>vous parlez à une nouvelle instance, nourrie de notes partielles.</span>
      </div>
    </Frame>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 17 · Summary — five steps, one surface
// ═══════════════════════════════════════════════════════════════════════════
const SYN_BASE = 720;
const SYN_H = 340;

const SynthCol = ({ x, n, name, tokens, state, d, note }: { x: number; n: number; name: string; tokens: number; state: string; d: number; note?: string }) => {
  const p = tokens / WINDOW;
  const s = statusOf(p);
  const h = Math.min(p, 1) * SYN_H;
  const oh = Math.max(0, p - 1) * SYN_H;
  const cx = x + 150;
  return (
    <>
      <div
        className="ctx-growy"
        style={{
          position: 'absolute',
          left: cx - 70,
          top: SYN_BASE - h,
          width: 140,
          height: h,
          borderRadius: oh > 0 ? 0 : '10px 10px 0 0',
          background: `repeating-linear-gradient(0deg, rgba(255,255,255,0.22) 0 2px, transparent 2px 14px), ${s.color}`,
          ...vars({ d: ms(d) }),
        }}
      />
      {oh > 0 ? (
        <div
          className="ctx-growy"
          style={{
            position: 'absolute',
            left: cx - 70,
            top: SYN_BASE - h - oh,
            width: 140,
            height: oh,
            borderRadius: '10px 10px 0 0',
            background: `repeating-linear-gradient(135deg, ${st.red} 0 8px, #f29a84 8px 16px)`,
            ...vars({ d: ms(d + 900) }),
          }}
        />
      ) : null}
      <div
        className="ctx-in"
        style={{
          position: 'absolute',
          left: x,
          top: SYN_BASE - h - oh - 52,
          width: 300,
          textAlign: 'center',
          fontFamily: mono,
          fontSize: 32,
          fontWeight: 700,
          color: s.color,
          ...vars({ d: ms(d + 700) }),
        }}
      >
        {fmt(p * 100)} %
      </div>
      <div style={{ position: 'absolute', left: x, top: SYN_BASE + 18, width: 300, textAlign: 'center' }}>
        <div style={{ fontSize: 30, fontWeight: 800 }}>
          {n} · {name}
        </div>
        <div style={{ fontFamily: mono, fontSize: 22, color: ink.muted, marginTop: 4 }}>
          {fmt(tokens)} t{note ? ` ${note}` : ''}
        </div>
        <div style={{ fontSize: 23, lineHeight: 1.3, color: ink.soft, marginTop: 8 }}>{state}</div>
      </div>
    </>
  );
};

const SummaryPage: Page = () => (
  <Frame id="summary" eyebrow="Synthèse">
    <Title>Cinq étapes, une seule surface</Title>
    <Hand>le bureau ne grandit jamais : seul ce qu’on y pose change</Hand>
    <div style={{ position: 'absolute', left: 120, top: SYN_BASE - SYN_H, width: 1680, borderTop: `3px dashed ${ink.pen}` }} />
    <div
      style={{
        position: 'absolute',
        left: 124,
        top: SYN_BASE - SYN_H - 44,
        fontFamily: hand,
        fontSize: 32,
        fontWeight: 700,
        color: ink.pen,
      }}
    >
      bord du bureau · 8 192
    </div>
    <div style={{ position: 'absolute', left: 120, top: SYN_BASE, width: 1680, borderTop: `3px solid ${ink.text}` }} />
    <SynthCol x={120} n={1} name="Init" tokens={1120} state="Clarté totale, mémoire vierge" d={100} />
    <SynthCol x={465} n={2} name="Fichier 500 L" tokens={5900} state="Analyse correcte, attention diluée" d={250} />
    <SynthCol x={810} n={3} name="Refacto" tokens={6610} state="Les détails du début s’estompent" d={400} />
    <SynthCol x={1155} n={4} name="Stack trace" tokens={9060} note="(théorique)" state="Saturation : blocage technique" d={550} />
    <SynthCol x={1500} n={5} name="Ménage" tokens={2390} state="Espace libéré, détails oubliés" d={700} />
  </Frame>
);

// ═══════════════════════════════════════════════════════════════════════════
// 18 · Simulator — fill the desk yourself
// ═══════════════════════════════════════════════════════════════════════════
type Sim = {
  op: boolean;
  app: boolean;
  spec: boolean;
  snip: boolean;
  hist: number;
  memo: number;
  logs: number;
  turn: number;
};
const SIM0: Sim = { op: false, app: false, spec: false, snip: false, hist: 0, memo: 0, logs: 0, turn: 1 };

const SimLabel = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      height: 26,
      marginBottom: 8,
      fontFamily: mono,
      fontSize: 16,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: ink.muted,
    }}
  >
    {children}
  </div>
);

const SimToggle = ({
  on,
  label,
  t,
  onClick,
}: {
  on: boolean;
  label: string;
  t: number;
  onClick: (e: ReactMouseEvent<HTMLButtonElement>) => void;
}) => (
  <button
    type="button"
    className="ctx-btn"
    onClick={onClick}
    style={{
      width: '100%',
      height: 54,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '0 18px',
      boxSizing: 'border-box',
      border: `2px solid ${ink.text}`,
      borderRadius: 12,
      background: on ? CAT.files.bg : ink.card,
      boxShadow: on ? `inset 0 0 0 3px ${CAT.files.bd}` : `4px 4px 0 ${ink.text}`,
      cursor: 'pointer',
      fontFamily: mono,
      fontSize: 21,
      color: ink.text,
      textAlign: 'left',
    }}
  >
    <span
      style={{
        width: 24,
        height: 24,
        boxSizing: 'border-box',
        borderRadius: 6,
        border: `2px solid ${ink.text}`,
        display: 'grid',
        placeItems: 'center',
        background: on ? ink.text : 'transparent',
        color: ink.card,
        fontSize: 15,
        fontWeight: 700,
      }}
    >
      {on ? '✓' : ''}
    </span>
    <span style={{ fontWeight: 700 }}>{label}</span>
    <span style={{ flex: 1 }} />
    <span style={{ color: ink.muted, fontSize: 18 }}>{fmt(t)} t</span>
  </button>
);

const SimButton = ({
  label,
  hint,
  disabled,
  tone,
  onClick,
}: {
  label: string;
  hint: string;
  disabled?: boolean;
  tone?: string;
  onClick: (e: ReactMouseEvent<HTMLButtonElement>) => void;
}) => (
  <button
    type="button"
    className="ctx-btn"
    disabled={disabled}
    onClick={onClick}
    style={{
      flex: 1,
      height: 54,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      padding: '0 16px',
      boxSizing: 'border-box',
      border: `2px solid ${ink.text}`,
      borderRadius: 12,
      background: tone ?? ink.card,
      boxShadow: `4px 4px 0 ${ink.text}`,
      cursor: 'pointer',
      fontFamily: body,
      fontSize: 21,
      fontWeight: 600,
      color: ink.text,
      whiteSpace: 'nowrap',
    }}
  >
    <span>{label}</span>
    <span style={{ fontFamily: mono, fontSize: 15, color: ink.soft }}>{hint}</span>
  </button>
);

const SimulatorPage: Page = () => {
  const [s, setS] = useState<Sim>(SIM0);
  const act = (f: (s: Sim) => Sim) => (e: ReactMouseEvent<HTMLButtonElement>) => {
    setS(f);
    e.currentTarget.blur();
  };
  const opT = s.snip ? 920 : 3850;
  const files = (s.op ? opT : 0) + (s.app ? 600 : 0) + (s.spec ? 1200 : 0);
  const segs: DeskSeg[] = [
    { cat: 'sys', t: 450 },
    { cat: 'proj', t: 150 },
    { cat: 'files', t: files },
    { cat: 'memo', t: s.memo },
    { cat: 'hist', t: s.hist },
    { cat: 'logs', t: s.logs },
    { cat: 'prompt', t: 120 },
    { cat: 'reply', t: 800 },
  ];
  const total = segs.reduce((a, g) => a + g.t, 0);
  const p = total / WINDOW;
  const status = statusOf(p);
  const reaction =
    p > 1
      ? '💥 context_length_exceeded — je ne peux même pas lire votre message.'
      : p > 0.75
        ? '« Euh… c’était quoi, déjà, le nom du middleware ? »'
        : p > 0.5
          ? '« Beaucoup de code… je lis surtout le début et la fin. »'
          : s.memo > 0
            ? '« J’ai un mémo… mais plus les détails. »'
            : '« Bureau dégagé : je vois tout clairement. »';
  return (
    <Frame id="sim" eyebrow="À vous de jouer">
      <Title>Simulateur : remplissez le bureau</Title>
      <Hand>cliquez — chaque Envoi fait retomber toutes les feuilles</Hand>

      <div data-osd-interactive style={{ position: 'absolute', left: 120, top: 258, width: 660 }}>
        <SimLabel>Onglets ouverts dans l’IDE</SimLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SimToggle on={s.op} label="order_processor.ts" t={opT} onClick={act((v) => ({ ...v, op: !v.op }))} />
          <SimToggle on={s.app} label="app.ts" t={600} onClick={act((v) => ({ ...v, app: !v.app }))} />
          <SimToggle on={s.spec} label="orders.spec.ts" t={1200} onClick={act((v) => ({ ...v, spec: !v.spec }))} />
        </div>
        <div style={{ height: 22 }} />
        <SimLabel>Conversation</SimLabel>
        <div style={{ display: 'flex', gap: 12 }}>
          <SimButton
            label="⏎ Envoyer un prompt"
            hint="+520 t"
            tone={CAT.prompt.bg}
            onClick={act((v) => ({ ...v, hist: v.hist + 520, turn: v.turn + 1 }))}
          />
          <SimButton label="📋 Coller des logs" hint="+1 600 t" tone={CAT.logs.bg} onClick={act((v) => ({ ...v, logs: v.logs + 1600 }))} />
        </div>
        <div style={{ height: 22 }} />
        <SimLabel>Faire le ménage</SimLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <SimButton
              label="✂️ Extrait ciblé"
              hint="3 850 → 920"
              disabled={!s.op || s.snip}
              onClick={act((v) => ({ ...v, snip: true }))}
            />
            <SimButton
              label="📝 Compacter"
              hint="→ 180 t"
              disabled={s.hist === 0}
              onClick={act((v) => ({ ...v, hist: 0, memo: 180 }))}
            />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <SimButton
              label="🧹 Élaguer les logs"
              hint="÷ 4"
              disabled={s.logs < 100}
              onClick={act((v) => ({ ...v, logs: Math.round(v.logs / 4) }))}
            />
            <SimButton
              label="↺ Nouveau fil"
              hint="reset"
              tone={CAT.hist.bg}
              onClick={act((v) => ({ ...SIM0, op: v.op, app: v.app, spec: v.spec, snip: v.snip }))}
            />
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 778, fontFamily: mono, fontSize: 21, color: ink.soft }}>
        Tour n°{s.turn} · <b style={{ color: ink.text }}>{fmt(total)}</b> / {fmt(WINDOW)} tokens envoyés
      </div>
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 826,
          width: 660,
          minHeight: 96,
          boxSizing: 'border-box',
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          padding: '12px 22px',
          borderRadius: 16,
          background: ink.text,
          color: ink.card,
        }}
      >
        <span style={{ fontSize: 40 }}>🤖</span>
        <span style={{ fontFamily: hand, fontSize: 32, fontWeight: 700, lineHeight: 1.1 }}>{reaction}</span>
      </div>

      <DeskLabel />
      <div className={p > 1 ? 'ctx-shake' : undefined} style={{ position: 'absolute', left: DESK_X, top: DESK_Y }}>
        <Desk segs={segs} mode="mount" epoch={s.turn} maxOver={14} />
      </div>
      <Gauge tokens={total} x={DESK_X} y={878} sim />
      <div
        style={{
          position: 'absolute',
          left: DESK_X,
          top: 936,
          fontFamily: mono,
          fontSize: 19,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: status.color,
        }}
      >
        Statut : {status.label}
      </div>
    </Frame>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 19 · Good practices
// ═══════════════════════════════════════════════════════════════════════════
const LogLine = ({ text, cut, d }: { text: string; cut?: boolean; d?: number }) => (
  <div style={{ position: 'relative', whiteSpace: 'pre', color: cut ? '#a39581' : '#f6ecd8' }}>
    {text}
    {cut ? (
      <span
        className="ctx-strike1"
        style={{ position: 'absolute', left: 0, right: 0, top: '52%', height: 3, background: '#ff8a6c', ...vars({ d: ms(d ?? 0) }) }}
      />
    ) : null}
  </div>
);

const PracticeCard = ({
  x,
  n,
  title,
  at,
  tag,
  illus,
  children,
}: {
  x: number;
  n: number;
  title: string;
  at: number;
  tag: string;
  illus: ReactNode;
  children: ReactNode;
}) => (
  <div className={`ctx-on${at}`} style={{ ...cardBox, position: 'absolute', left: x, top: 264, width: 520, height: 614, padding: 26 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 80 }}>
      <span
        style={{
          width: 44,
          height: 44,
          borderRadius: 999,
          display: 'grid',
          placeItems: 'center',
          background: st.green,
          color: ink.card,
          fontFamily: mono,
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        {n}
      </span>
      <span style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.12 }}>{title}</span>
    </div>
    <div style={{ marginTop: 20, height: 226 }}>{illus}</div>
    <div style={{ marginTop: 18, fontSize: 25, lineHeight: 1.4, color: ink.soft }}>{children}</div>
    <div
      style={{
        position: 'absolute',
        left: 26,
        bottom: 22,
        fontFamily: mono,
        fontSize: 18,
        fontWeight: 700,
        color: st.green,
      }}
    >
      {tag}
    </div>
  </div>
);

const TABS = ['app.ts', 'db.ts', 'auth.ts', 'cart.ts', 'user.ts', 'tax.ts', 'api.ts', 'log.ts', 'mail.ts', 'cfg.ts', 'pay.ts', 'ui.tsx', 'env.ts', 'jobs.ts', 'seed.ts'];

const PracticesPage: Page = () => (
  <Frame id="practices" eyebrow="Bonnes pratiques" beats={3}>
    <Title>Gardez le bureau propre</Title>
    <Hand>trois réflexes pour une IA lucide</Hand>
    <PracticeCard
      x={120}
      n={1}
      title="Ne collez jamais de logs bruts"
      at={1}
      tag="1 600 → 400 tokens"
      illus={
        <div style={{ height: 226, boxSizing: 'border-box', borderRadius: 12, background: '#2a2119', padding: '14px 16px', fontFamily: mono, fontSize: 15, lineHeight: 1.62 }}>
          <LogLine text="TypeError: Cannot read 'rate' of undefined" />
          <LogLine text="  at calculateTaxes (order_processor.ts:251)" />
          <LogLine text="  at processOrder (order_processor.ts:88)" />
          <LogLine text="  at Layer.handle (node_modules/express/…)" cut d={500} />
          <LogLine text="  at next (node_modules/express/…)" cut d={650} />
          <LogLine text="  at Route.dispatch (node_modules/express/…)" cut d={800} />
          <LogLine text="  at processTicks (node:internal/…)" cut d={950} />
        </div>
      }
    >
      Supprimez les lignes internes aux librairies (<C>node_modules</C>, Node.js) : gardez ce qui pointe vers votre code.
    </PracticeCard>
    <PracticeCard
      x={700}
      n={2}
      title="Ciblez avec @fichier"
      at={2}
      tag="1 fichier, 1 fonction"
      illus={
        <div style={{ position: 'relative', height: 226 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, width: 468 }}>
            {TABS.map((t) => (
              <span
                key={t}
                style={{
                  width: 88,
                  height: 30,
                  boxSizing: 'border-box',
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '6px 6px 0 0',
                  background: ink.paper,
                  border: `1.5px solid ${ink.faint}`,
                  fontFamily: mono,
                  fontSize: 13,
                  color: ink.muted,
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <svg aria-hidden width={468} height={110} style={{ position: 'absolute', left: 0, top: 0 }}>
            <path d="M40 12 L428 96 M428 12 L40 96" stroke={ink.pen} strokeWidth={6} strokeLinecap="round" opacity={0.85} />
          </svg>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 140,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 16px',
              borderRadius: 10,
              background: CAT.proj.bg,
              border: `2px solid ${CAT.proj.bd}`,
              fontFamily: mono,
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            @order_processor.ts#calculateTaxes
          </div>
        </div>
      }
    >
      Plutôt que 15 onglets ouverts que l’assistant tente d’aspirer, référencez le fichier ou la fonction visée.
    </PracticeCard>
    <PracticeCard
      x={1280}
      n={3}
      title="Faites un « reset » régulier"
      at={3}
      tag="nouvelle tâche = nouveau fil"
      illus={
        <div style={{ position: 'relative', height: 226 }}>
          <MiniMat x={0} y={6} cols={11} rows={4} filled={3} s={24} g={6} />
          <span style={{ position: 'absolute', left: 382, top: 24, fontSize: 64 }}>🧹</span>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 168,
              display: 'inline-flex',
              alignItems: 'center',
              padding: '6px 16px',
              borderRadius: 10,
              border: `2px solid ${ink.text}`,
              background: CAT.hist.bg,
              fontSize: 22,
              fontWeight: 600,
              boxShadow: `3px 3px 0 ${ink.text}`,
            }}
          >
            ＋ Nouveau fil de discussion
          </div>
        </div>
      }
    >
      Vous passez du backend aux tests ? Ouvrez un nouveau fil : bureau propre, zéro bruit des étapes précédentes.
    </PracticeCard>
  </Frame>
);

// ═══════════════════════════════════════════════════════════════════════════
// 20 · Closing
// ═══════════════════════════════════════════════════════════════════════════
const RuleTag = ({ x, icon, children }: { x: number; icon: string; children: ReactNode }) => (
  <div
    style={{
      ...cardBox,
      position: 'absolute',
      left: x,
      top: 660,
      width: 520,
      height: 104,
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      padding: '0 26px',
      fontSize: 30,
      fontWeight: 800,
    }}
  >
    <span style={{ fontSize: 40 }}>{icon}</span>
    {children}
  </div>
);

const ClosingPage: Page = () => (
  <Frame id="closing" eyebrow="À retenir">
    <h2
      style={{
        position: 'absolute',
        left: 120,
        top: 220,
        margin: 0,
        fontFamily: display,
        fontWeight: 800,
        fontSize: 108,
        lineHeight: 1.04,
        letterSpacing: '-0.03em',
      }}
    >
      L’IA ne se souvient pas.
      <br />
      <span style={{ color: ink.pen }}>Elle relit.</span>
    </h2>
    <p style={{ position: 'absolute', left: 124, top: 486, margin: 0, fontSize: 36, color: ink.soft }}>
      Et ce qu’elle relit, c’est vous qui le posez sur son bureau.
    </p>
    <RuleTag x={120} icon="✂️">
      Élaguez vos logs
    </RuleTag>
    <RuleTag x={700} icon="🎯">
      Ciblez avec @fichier
    </RuleTag>
    <RuleTag x={1280} icon="↺">
      Ouvrez un nouveau fil
    </RuleTag>
    <div
      style={{
        position: 'absolute',
        left: 124,
        top: 830,
        fontFamily: hand,
        fontSize: 48,
        fontWeight: 700,
        color: ink.pen,
        transform: 'rotate(-2deg)',
        transformOrigin: '0 50%',
      }}
    >
      Bonne session… et bon rangement !
    </div>
    <PostIt x={1500} y={150} w={300} rot={7} size={40}>
      8 192
      <br />
      tokens,
      <br />
      pas un de plus.
    </PostIt>
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

const STYLE_ID = 'osd-styles-fenetre-de-contexte';
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
  title: 'La fenêtre de contexte, expliquée avec un bureau',
  createdAt: '2026-10-11T18:04:08.105Z',
};

export default [
  Cover,
  TokensPage,
  WindowPage,
  AmnesiaPage,
  SaturationPage,
  SessionPage,
  Step1Page,
  Step2Page,
  Attention2Page,
  Step3Page,
  Fade3Page,
  Step4Page,
  Overflow4Page,
  CleanupPage,
  Step5Page,
  Forget5Page,
  SummaryPage,
  SimulatorPage,
  PracticesPage,
  ClosingPage,
] satisfies Page[];

export const notes: (string | undefined)[] = [
  `Accroche : « Qui a déjà eu l'impression que Copilot avait la mémoire courte ? »
Aujourd'hui on ouvre le capot avec une seule métaphore : un bureau de taille fixe. Les feuilles tombent sur le bureau à l'ouverture.`,
  `Clic 1 : une phrase en français, découpée en 8 morceaux. Les points montrent les espaces : ils font partie des tokens.
Clic 2 : une ligne de code, 62 caractères, 20 tokens.
Clic 3 : camelCase coupé en deux, chaque symbole compte. Ordre de grandeur à retenir : 1 ligne de TypeScript ≈ 8 tokens.
Préciser que le découpage est illustratif : chaque modèle a son tokenizer.`,
  `La fenêtre de contexte, c'est la surface du bureau : 8 192 tokens pour la démo.
Clic 1 : les équivalences.
Clic 2 : avant même votre premier mot, ~600 tokens sont déjà pris par les consignes (système + règles d'équipe).
Clic 3 : la réponse s'écrit sur le même bureau : il faut lui réserver de la place.
Les modèles récents ont des bureaux bien plus grands ; les règles restent identiques.`,
  `Le point le plus contre-intuitif.
Clic 1 : premier envoi. Clic 2 : au deuxième, tout est recopié + le nouveau prompt. Clic 3 : au troisième, encore plus.
Le modèle n'a aucune mémoire entre deux appels.
Clic 4 : c'est l'application qui relit tout. Conséquence : chaque tour coûte plus cher que le précédent.`,
  `Que faire quand le bureau est plein ?
Clic 1 : refuser — erreur. Clic 2 : jeter des feuilles — éviction. Clic 3 : résumer — un post-it à la place d'une pile.
Clic 4 : aucune option n'est gratuite. On va voir ces mécanismes à l'œuvre.`,
  `Le scénario : un dev crée une API Express en TypeScript avec un assistant IA. Cinq échanges.
À chaque étape on regarde ce qui est réellement envoyé au modèle — le payload — et l'état du bureau.`,
  `Premier prompt.
Clic 1 (Entrée) : le payload part. Le ticket s'imprime, les feuilles tombent sur le bureau : 1 120 tokens, 13,7 %.
Noter les 450 tokens d'instructions système, invisibles pour vous.
Clic 2 : tampon OPTIMAL. L'IA génère le middleware customSecurityLogger — retenez ce nom, il revient à l'étape 5.`,
  `Le dev ouvre order_processor.ts : 500 lignes, 3 850 tokens injectés en entier.
Clic 1 : le bureau se couvre — 72 %. Remarquer que l'échange de l'étape 1 (520 tokens) est ré-envoyé.
Clic 2 : charge modérée. L'analyse est bonne car tout le fichier est sous ses yeux.`,
  `Dans la tête du modèle.
Clic 1 : la courbe en U — début et fin bien lus. C'est le phénomène « Lost in the Middle » (Liu et al., 2023).
Clic 2 : la ligne 250 du fichier tombe pile au milieu du payload.
Clic 3 : 70 % du bureau est du code statique ; il reste peu de place pour la conversation.`,
  `Demande de refacto ciblée.
Clic 1 : 6 610 tokens, 80,7 %. L'historique a grossi : 1 450 tokens (P1 + R1 + P2 + R2).
Clic 2 : zone de vigilance.`,
  `Rien n'est effacé — mais tout n'est pas aussi bien utilisé.
Clic 1 : calculateTaxes est trouvée sans problème.
Clic 2 : la consigne du middleware, c'est 8 feuilles sur 103, noyées derrière le code.
Clic 3 : si on lui demande d'appliquer le calcul « au middleware créé plus tôt », elle risque d'inventer une implémentation générique.`,
  `Bug au runtime : le dev colle 120 lignes de stack trace brute.
Clic 1 : le bureau déborde — 9 060 tokens pour 8 192. Les 14 dernières feuilles tombent : c'est surtout la marge réservée à la réponse qui ne tient plus.
Clic 2 : DÉBORDEMENT.`,
  `Sans intervention logicielle, deux issues.
Clic 1 : l'API refuse — context_length_exceeded.
Clic 2 : ou la réponse est coupée en pleine ligne — du code qui ne compile pas.
Clic 3 : le dilemme : il faut sacrifier de l'information.`,
  `L'IDE déclenche son ménage (context pruning + rolling summary).
Clic 1 : le fichier entier est remplacé par l'extrait autour de calculateTaxes.
Clic 2 : les échanges 1 et 2 deviennent un mémo.
Clic 3 : la stack trace est élaguée (on retire node_modules et les internes de Node).
Clic 4 : plus de 5 000 tokens récupérés.`,
  `Le prompt 5.
Clic 1 : payload reconstruit — 2 390 tokens, 29 %. Le post-it jaune : un résumé de 180 tokens remplace tout l'historique.
Clic 2 : rétabli… mais à quel prix ?`,
  `La chute.
Clic 1 : le mémo ne mentionne plus customSecurityLogger.
Clic 2 : votre code d'origine. Clic 3 : ce que l'IA génère — app.use(logger), inventé.
Clic 4 : le message clé : l'illusion d'un interlocuteur continu.`,
  `Récapitulatif : 14 %, 72 %, 81 %, 111 % théorique, puis 29 % après le ménage.
Le bureau ne grandit jamais ; c'est ce qu'on pose dessus qui change.`,
  `Démo live, faire jouer le public.
Ouvrir order_processor.ts, envoyer quelques prompts, coller des logs… jusqu'au débordement (le bureau tremble).
Puis faire le ménage : extrait ciblé, compactage, élagage. Noter que chaque Envoi fait retomber toutes les feuilles : tout est ré-envoyé.`,
  `Trois réflexes.
Clic 1 : élaguer les logs (les lignes node_modules se barrent).
Clic 2 : cibler avec @fichier plutôt que laisser 15 onglets ouverts.
Clic 3 : un nouveau fil à chaque changement de tâche.`,
  `Phrase de fin : l'IA ne se souvient pas, elle relit.
Votre rôle : choisir ce qui est posé sur le bureau. Questions.`,
];
