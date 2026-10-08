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
import imgFeiFei from '@assets/ai-history/feifei.jpg';
import imgHinton from '@assets/ai-history/hinton.jpg';
import imgLeCun from '@assets/ai-history/lecun.jpg';
import imgLeeSedol from '@assets/ai-history/leesedol.jpg';
import imgMcCarthy from '@assets/ai-history/mccarthy.jpg';
import imgMinsky from '@assets/ai-history/minsky.jpg';
import imgMnist from '@assets/ai-history/mnist.png';
import imgOpenAI from '@assets/ai-history/openai.png';
import imgPitts from '@assets/ai-history/pitts.jpg';
import imgRosenblatt from '@assets/ai-history/rosenblatt.jpg';
import imgRumelhart from '@assets/ai-history/rumelhart.jpg';
import imgSchmidhuber from '@assets/ai-history/schmidhuber.jpg';
import imgTransformer from '@assets/ai-history/transformer.png';
import imgTuring from '@assets/ai-history/turing.jpg';
import imgVax from '@assets/ai-history/vax.jpg';
import imgWeizenbaum from '@assets/ai-history/weizenbaum.jpg';

export const design: DesignSystem = {
  palette: { bg: '#ece3ce', text: '#27231d', accent: '#b0352a' },
  fonts: {
    display: '"Special Elite", "Courier New", monospace',
    body: '"Courier Prime", "Courier New", monospace',
  },
  typeScale: { hero: 130, body: 30 },
  radius: 4,
};

// ─── Webfonts (module-level, slide-keyed) ───────────────────────────────────
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Special+Elite&display=swap';
const FONT_LINK_ID = 'osd-webfont-ai-history-sommaire';
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

// ─── The series: which dossiers already have a deck ─────────────────────────
// When a dossier's presentation exists, add its slide id here: every card,
// tag and index entry for that dossier becomes a link ("ouvrir ↗").
const DECKS: Partial<Record<number, string>> = {
  0: 'ai-history-00-neurone-formel',
  1: 'ai-history-01-perceptron',
  2: 'ai-history-02-retropropagation',
  3: 'ai-history-03-ia-symbolique',
  4: 'ai-history-04-reseaux-convolutifs',
  5: 'ai-history-05-deep-blue',
  6: 'ai-history-06-alexnet',
  7: 'ai-history-07-word2vec',
  8: 'ai-history-08-alphago',
  9: 'ai-history-09-transformer',
  10: 'ai-history-10-chatgpt',
};

// Absolute URL of another deck, built from the current one so it works both
// locally (/s/<id>) and on GitHub Pages (/<repo>/s/<id>).
const deckHref = (id: string) => {
  if (typeof location === 'undefined') return `/s/${id}`;
  const p = location.pathname;
  const i = p.indexOf('/s/');
  const base = i >= 0 ? p.slice(0, i + 1) : p.endsWith('/') ? p : `${p}/`;
  return `${base}s/${id}`;
};

const DeckLink = ({ id, children }: { id?: string; children: ReactNode }) =>
  id ? (
    <a href={deckHref(id)} style={{ display: 'block', color: 'inherit', textDecoration: 'none', pointerEvents: 'auto' }}>
      {children}
    </a>
  ) : (
    <div>{children}</div>
  );

// ─── Palette (1950s lab archive: manila paper, typewriter ink, stamp red) ───
const ink = {
  text: '#27231d',
  soft: '#4d463b',
  muted: '#7d7261',
  faint: '#b1a48a',
  rule: '#c9bb9c',
  sheet: '#f7f0de',
  red: '#b0352a',
  redSoft: 'rgba(176, 53, 42, 0.12)',
  blue: '#2b4a7a',
};

// Era colours on the ribbon: golden ages warm, winters cold and hatched.
const band = {
  pioneer: '#d8c8a2',
  gold: '#e3bd60',
  goldLight: '#ead08e',
  winter: '#aab9c5',
  stat: '#cfc6aa',
  deep: '#df9478',
  gen: '#d47a5e',
};
type Tone = keyof typeof band;

const typewriter = 'var(--osd-font-display)';
const mono = 'var(--osd-font-body)';
const hand = '"Caveat", "Segoe Print", "Bradley Hand", cursive';

const BLEED = '0 0 0.8px rgba(39, 35, 29, 0.5)';
const SHADOW = '0 1px 0 rgba(255, 255, 255, 0.5) inset, 0 18px 30px -20px rgba(70, 45, 10, 0.6)';
const MARGIN = 'rgba(176, 53, 42, 0.32)';

const L = 170;
const RIGHT = 140;
const CW = 1920 - L - RIGHT;

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';

// ─── Small helpers ──────────────────────────────────────────────────────────
const vars = (o: Record<string, string | number>): CSSProperties => {
  const out: Record<string, string | number> = {};
  for (const k of Object.keys(o)) out[`--${k}`] = o[k];
  return out as CSSProperties;
};
const pad2 = (n: number) => String(n).padStart(2, '0');
const svgUrl = (s: string) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;

const GRAIN = svgUrl(
  `<svg xmlns='http://www.w3.org/2000/svg' width='360' height='360'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.42  0 0 0 0 0.32  0 0 0 0 0.18  1.2 0 0 0 -0.5'/></filter><rect width='360' height='360' filter='url(#g)'/></svg>`,
);
const GRUNGE = svgUrl(
  `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='m'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='4' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.4 0 0 0 2.05'/></filter><rect width='240' height='240' filter='url(#m)'/></svg>`,
);
const HATCH = 'repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.38) 0 6px, transparent 6px 14px)';

// ─── Stylesheet (collected, injected once at the bottom) ────────────────────
const CSS: string[] = [];
const has = (n: number) => `.aa-page:has([data-osd-step="revealed"] > .aa-k${n})`;

CSS.push(`
@keyframes aa-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes aa-fade{from{opacity:0}to{opacity:1}}
@keyframes aa-type{from{opacity:0}to{opacity:1}}
@keyframes aa-draw{from{stroke-dashoffset:1.01}to{stroke-dashoffset:0}}
@keyframes aa-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes aa-pop{0%{opacity:0;transform:scale(.3)}60%{opacity:1;transform:scale(1.15)}100%{opacity:1;transform:scale(1)}}
@keyframes aa-stamp{0%{opacity:0;transform:rotate(var(--r,0deg)) scale(1.9)}35%{opacity:1}70%{transform:rotate(var(--r,0deg)) scale(.94)}100%{opacity:1;transform:rotate(var(--r,0deg)) scale(1)}}
@keyframes aa-slide{from{opacity:0;transform:translateY(120px)}to{opacity:1;transform:none}}
.aa-stamp{transform:rotate(var(--r,0deg))}
.aa-in-draw{stroke-dasharray:1 2}
.aa-in-grow{transform-origin:left center}
.aa-in-pop{transform-box:fill-box;transform-origin:center}
.aa-live .aa-in{animation:aa-rise 800ms ${EASE} var(--d,0ms) both}
.aa-live .aa-in-fade{animation:aa-fade 900ms ${EASE} var(--d,0ms) both}
.aa-live .aa-in-draw{animation:aa-draw 1100ms ${EASE} var(--d,0ms) both}
.aa-live .aa-in-grow{animation:aa-grow 700ms ${EASE} var(--d,0ms) both}
.aa-live .aa-in-pop{animation:aa-pop 520ms ${EASE} var(--d,0ms) both}
.aa-live .aa-in-st{animation:aa-stamp 480ms ${EASE_OUT} var(--d,0ms) both}
.aa-live .aa-in-slide{animation:aa-slide 900ms ${EASE} var(--d,0ms) both}
.aa-live .aa-ty0 .aa-c{animation:aa-type 40ms linear var(--d,0ms) both}
.aa-link{transition:transform 200ms ${EASE},box-shadow 200ms ${EASE}}
a:hover > .aa-link{transform:translateY(-4px) rotate(-0.4deg);box-shadow:0 26px 34px -22px rgba(70,45,10,.7)}
@media (prefers-reduced-motion: reduce){.aa-page *{animation:none !important;transition:none !important}}
`);

// Beat utilities (n = click number): on (rise in), fade, typed text, stamp.
for (let n = 1; n <= 8; n++) {
  const at = has(n);
  CSS.push(`
.aa-on${n}{opacity:0;transform:translateY(14px);transition:opacity 500ms ${EASE} var(--d,0ms),transform 700ms ${EASE} var(--d,0ms)}
${at} .aa-on${n}{opacity:1;transform:none}
.aa-fade${n}{opacity:0;transition:opacity 550ms ${EASE} var(--d,0ms)}
${at} .aa-fade${n}{opacity:1}
.aa-ty${n} .aa-c{opacity:0}
${at} .aa-ty${n} .aa-c{opacity:1;transition:opacity 40ms linear var(--d,0ms)}
`);
}

// ─── Frame components ───────────────────────────────────────────────────────
const Beats = ({ count }: { count: number }) => (
  <div aria-hidden style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0 }}>
    <Steps>
      {Array.from({ length: count }, (_, i) => (
        <Step key={i} duration={0}>
          <i className={`aa-k${i + 1}`} />
        </Step>
      ))}
    </Steps>
  </div>
);

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
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: GRAIN, backgroundSize: '360px 360px', opacity: 0.5 }}
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

const Stamp = ({
  children,
  pos,
  rot = -6,
  size = 40,
  color = ink.red,
  d = 0,
}: {
  children: ReactNode;
  pos: CSSProperties;
  rot?: number;
  size?: number;
  color?: string;
  d?: number;
}) => (
  <div
    className="aa-stamp aa-in-st"
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

const Label = ({ children, c = ink.muted, size = 21 }: { children: ReactNode; c?: string; size?: number }) => (
  <span
    style={{
      fontFamily: mono,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: c,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </span>
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
      {' · Sommaire général'}
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
      <span style={{ fontStyle: 'italic' }}>Archives de l'IA — de 1943 à aujourd'hui</span>
      <span style={{ letterSpacing: '0.12em' }}>
        FEUILLET {pad2(current)} / {pad2(total)}
      </span>
    </div>
  );
};

// Typewriter text: characters appear one by one (on entry, or on click `beat`).
const Typed = ({ text, d = 0, step = 26, beat = 0 }: { text: string; d?: number; step?: number; beat?: number }) => {
  let i = 0;
  return (
    <span className={`aa-ty${beat}`}>
      {Array.from(text).map((ch, k) =>
        ch === '\n' ? (
          <br key={k} />
        ) : (
          <span key={k} className="aa-c" style={vars({ d: `${d + i++ * step}ms` })}>
            {ch}
          </span>
        ),
      )}
    </span>
  );
};

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div
    className="aa-in-fade"
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
      className={`aa-page aa-${id}${live ? ' aa-live' : ''}`}
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

const Hand = ({
  children,
  x,
  y,
  w,
  rot = -2,
  size = 34,
  c = ink.blue,
  d = 0,
}: {
  children: ReactNode;
  x: number;
  y: number;
  w?: number;
  rot?: number;
  size?: number;
  c?: string;
  d?: number;
}) => (
  <div
    className="aa-in-fade"
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

const PaperClip = ({ x, y, rot = -8 }: { x: number; y: number; rot?: number }) => (
  <svg aria-hidden width={46} height={104} style={{ position: 'absolute', left: x, top: y, overflow: 'visible', transform: `rotate(${rot}deg)` }}>
    <path
      d="M 15 44 V 16 a 8 8 0 0 1 16 0 V 78 a 13 13 0 0 1 -26 0 V 12 a 18 18 0 0 1 36 0 V 64"
      fill="none"
      stroke="#868b91"
      strokeWidth={4}
      strokeLinecap="round"
    />
  </svg>
);

// "ouvrir ↗" when the dossier's deck exists, "à paraître" otherwise.
const Status = ({ deck, size = 20 }: { deck?: string; size?: number }) =>
  deck ? (
    <span style={{ fontWeight: 700, fontSize: size, color: ink.red, whiteSpace: 'nowrap' }}>ouvrir ↗</span>
  ) : (
    <span style={{ fontSize: size - 2, fontStyle: 'italic', color: ink.muted, whiteSpace: 'nowrap' }}>à paraître</span>
  );

const cardFrame = (deck?: string): CSSProperties => ({
  background: ink.sheet,
  boxShadow: SHADOW,
  boxSizing: 'border-box',
  border: deck ? `2.5px solid ${ink.red}` : `2px dashed ${ink.faint}`,
});

// ═══ 1 · Couverture ══════════════════════════════════════════════════════════
const FOLDER_TONES = ['#e2cd9c', '#d9c18f', '#e7d4a8'];

// One manila folder of the drawer; its tab carries the dossier number.
const Folder = ({ n }: { n: number }) => {
  const top = 372 + n * 30;
  const tabX = 24 + (n % 4) * 150;
  return (
    <div className="aa-in-slide" style={{ ...vars({ d: `${900 + n * 90}ms` }), position: 'absolute', left: 1040, top, width: 700, height: 300 }}>
      <div
        style={{
          position: 'absolute',
          left: tabX,
          top: -38,
          width: 128,
          height: 42,
          borderRadius: '10px 10px 0 0',
          background: FOLDER_TONES[n % 3],
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 -1px 0 rgba(120, 90, 40, 0.25)',
          display: 'grid',
          placeItems: 'center',
          fontFamily: typewriter,
          fontSize: 24,
          color: ink.soft,
        }}
      >
        Nº {pad2(n)}
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 6,
          background: FOLDER_TONES[n % 3],
          boxShadow: '0 -2px 0 rgba(120, 90, 40, 0.18), 0 -10px 18px -12px rgba(70, 45, 10, 0.45)',
        }}
      />
    </div>
  );
};

const DrawerLabel = () => (
  <div
    className="aa-in-fade"
    style={{
      ...vars({ d: '2100ms' }),
      position: 'absolute',
      left: 1180,
      top: 760,
      width: 420,
      padding: '16px 22px',
      background: ink.sheet,
      boxShadow: '0 2px 6px rgba(70, 45, 10, 0.25)',
      transform: 'rotate(-1deg)',
      textAlign: 'center',
    }}
  >
    <Label c={ink.red}>Archives de l'IA</Label>
    <div style={{ marginTop: 8, fontFamily: typewriter, fontSize: 30, textShadow: BLEED }}>11 dossiers · 1943 → 2022</div>
  </div>
);

const AuthorCard = () => (
  <div className="aa-in-fade" style={{ ...vars({ d: '2600ms' }), position: 'absolute', left: L, top: 780, width: 560, height: 180 }}>
    <div style={{ position: 'relative', width: '100%', height: '100%', background: ink.sheet, boxShadow: SHADOW, transform: 'rotate(-1deg)' }}>
      <img
        src={portrait}
        alt="Houssem Eddine Lassoued"
        style={{
          position: 'absolute',
          left: 24,
          top: 22,
          width: 112,
          height: 136,
          objectFit: 'cover',
          objectPosition: '56% 30%',
          border: '5px solid #fffaf0',
          boxShadow: '0 4px 10px -4px rgba(60, 40, 10, 0.5)',
          filter: 'grayscale(1) sepia(0.5) contrast(1.05)',
        }}
      />
      <PaperClip x={40} y={-2} />
      <div style={{ position: 'absolute', left: 166, top: 20, right: 20 }}>
        <Label>Conçu par</Label>
        <div style={{ marginTop: 8, fontFamily: typewriter, fontSize: 32, lineHeight: 1.12, textShadow: BLEED }}>
          Houssem Eddine
          <br />
          Lassoued
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 8, fontSize: 24 }}>
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
      className="aa-in-fade"
      style={{
        position: 'absolute',
        left: L,
        top: 156,
        fontFamily: mono,
        fontWeight: 700,
        fontSize: 26,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--osd-accent)',
      }}
    >
      Sommaire général
    </div>
    <h1
      style={{
        position: 'absolute',
        left: L - 6,
        top: 204,
        margin: 0,
        fontFamily: typewriter,
        fontWeight: 400,
        fontSize: 'var(--osd-size-hero)',
        lineHeight: 1,
        textShadow: BLEED,
      }}
    >
      <Typed text={"Archives\nde l'IA"} d={250} step={70} />
    </h1>
    <div style={{ position: 'absolute', left: L, top: 488, fontFamily: typewriter, fontSize: 46, lineHeight: 1.12, color: ink.soft, textShadow: BLEED }}>
      <Typed text={"De 1943 à aujourd'hui,\nen 11 dossiers"} d={1500} step={30} />
    </div>
    <p
      className="aa-in"
      style={{
        ...vars({ d: '2400ms' }),
        position: 'absolute',
        left: L,
        top: 618,
        margin: 0,
        width: 800,
        fontSize: 'var(--osd-size-body)',
        lineHeight: 1.45,
        color: ink.soft,
      }}
    >
      Une frise pour situer chaque moment clé de l'intelligence artificielle, et un lien vers chaque dossier.
    </p>
    <Folder n={0} />
    <Folder n={1} />
    <Folder n={2} />
    <Folder n={3} />
    <Folder n={4} />
    <Folder n={5} />
    <Folder n={6} />
    <Folder n={7} />
    <Folder n={8} />
    <Folder n={9} />
    <Folder n={10} />
    <DrawerLabel />
    <Stamp pos={{ left: 1300, top: 150 }} rot={-8} size={64} d={1300}>
      1943 → 2022
    </Stamp>
    <AuthorCard />
  </Frame>
);

// ═══ 2 · Vue d'ensemble ══════════════════════════════════════════════════════
// Linear scale 1940 → 2025 across the content width.
const OX = (y: number) => L + ((y - 1940) * CW) / 85;
const ORIB = { y: 575, h: 56 };
const O_UP = 470; // bottom edge of the tags above the ribbon
const O_DOWN = 740; // top edge of the tags below

const OBand = ({ from, to, tone, d, small, children }: { from: number; to: number; tone: Tone; d: number; small?: boolean; children: ReactNode }) => (
  <div
    className="aa-in-grow"
    style={{
      ...vars({ d: `${d}ms` }),
      position: 'absolute',
      left: OX(from),
      top: ORIB.y,
      width: OX(to) - OX(from),
      height: ORIB.h,
      boxSizing: 'border-box',
      borderRight: `2px solid ${ink.sheet}`,
      backgroundColor: band[tone],
      backgroundImage: tone === 'winter' ? HATCH : undefined,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      fontWeight: 700,
      fontSize: small ? 18 : 20,
      lineHeight: 1.05,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: ink.text,
    }}
  >
    <span>{children}</span>
  </div>
);

// A dossier tag on the overview frise, with its leader line to the ribbon.
const Tag = ({ n, year, title, cx, up, k }: { n: number; year: number; title: string; cx: number; up?: boolean; k: number }) => {
  const deck = DECKS[n];
  const tx = OX(year);
  const y1 = up ? O_UP : O_DOWN;
  const y2 = up ? ORIB.y : ORIB.y + ORIB.h;
  const d = 900 + k * 150;
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        <line
          x1={cx}
          y1={y1}
          x2={tx}
          y2={y2}
          stroke={deck ? ink.red : ink.soft}
          strokeWidth={2.5}
          pathLength={1}
          className="aa-in-draw"
          style={vars({ d: `${d + 150}ms` })}
        />
        <circle cx={tx} cy={y2} r={7} fill={deck ? ink.red : ink.text} stroke={ink.sheet} strokeWidth={3} className="aa-in-pop" style={vars({ d: `${d + 500}ms` })} />
      </svg>
      <div className="aa-in" style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: cx - 120, width: 240, ...(up ? { bottom: 1080 - O_UP } : { top: O_DOWN }) }}>
        <DeckLink id={deck}>
          <div className="aa-link" style={{ ...cardFrame(deck), height: 150, padding: '12px 14px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Label c={ink.red} size={18}>
                Nº {pad2(n)}
              </Label>
              <Status deck={deck} size={18} />
            </div>
            <div style={{ marginTop: 4, fontFamily: typewriter, fontSize: 40, lineHeight: 1, textShadow: BLEED }}>{year}</div>
            <div style={{ marginTop: 6, fontSize: 21, fontWeight: 700, lineHeight: 1.25, color: ink.soft }}>{title}</div>
          </div>
        </DeckLink>
      </div>
    </>
  );
};

const Overview: Page = () => (
  <Frame id="overview" era="Index" eyebrow="La frise · vue d'ensemble" title="80 ans d'IA, 11 dossiers">
    <Hand x={1250} y={204} w={530} rot={-2} size={32} d={2800}>
      ouvrir ↗ = dossier disponible : cliquez dessus
    </Hand>
    <OBand from={1940} to={1956} tone="pioneer" d={300}>
      Les pionniers
    </OBand>
    <OBand from={1956} to={1974} tone="gold" d={420}>
      1er âge d'or
    </OBand>
    <OBand from={1974} to={1980} tone="winter" d={540} small>
      1er hiver
    </OBand>
    <OBand from={1980} to={1987} tone="goldLight" d={620} small>
      Systèmes
      <br />
      experts
    </OBand>
    <OBand from={1987} to={1993} tone="winter" d={700} small>
      2e hiver
    </OBand>
    <OBand from={1993} to={2012} tone="stat" d={780}>
      Apprentissage statistique
    </OBand>
    <OBand from={2012} to={2025} tone="deep" d={900}>
      Deep learning
    </OBand>
    <Tag n={0} year={1943} title="Le neurone formel" cx={290} up k={0} />
    <Tag n={3} year={1956} title="L'IA symbolique" cx={473} k={1} />
    <Tag n={1} year={1957} title="Le Perceptron" cx={545} up k={2} />
    <Tag n={2} year={1986} title="La rétropropagation" cx={910} k={3} />
    <Tag n={4} year={1989} title="Les réseaux convolutifs" cx={910} up k={4} />
    <Tag n={5} year={1997} title="Deep Blue bat Kasparov" cx={1160} k={5} />
    <Tag n={6} year={2012} title="AlexNet & ImageNet" cx={1160} up k={6} />
    <Tag n={7} year={2013} title="Les mots en nombres" cx={1410} k={7} />
    <Tag n={8} year={2016} title="AlphaGo" cx={1410} up k={8} />
    <Tag n={9} year={2017} title="Le Transformer" cx={1660} k={9} />
    <Tag n={10} year={2022} title="ChatGPT & l'IA générative" cx={1660} up k={10} />
  </Frame>
);

// ═══ 3–6 · Les quatre époques ════════════════════════════════════════════════
// Each era page: a ribbon at y 580–620, events above (bottom-aligned at 540)
// or below (top-aligned at 660), revealed one per click in date order.
const RIB = { y: 580, h: 40 };
const UP = 540;
const DOWN = 660;

const Band = ({ x1, x2, tone, children }: { x1: number; x2: number; tone: Tone; children?: ReactNode }) => (
  <div
    className="aa-in-grow"
    style={{
      ...vars({ d: '500ms' }),
      position: 'absolute',
      left: x1,
      top: RIB.y,
      width: x2 - x1,
      height: RIB.h,
      boxSizing: 'border-box',
      borderRight: `2px solid ${ink.sheet}`,
      backgroundColor: band[tone],
      backgroundImage: tone === 'winter' ? HATCH : undefined,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: 20,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      color: ink.text,
    }}
  >
    {children}
  </div>
);

// Line from an event (centre cx) to its date on the ribbon (tx), with a dot.
const Connector = ({ cx, tx, up, hot }: { cx: number; tx: number; up?: boolean; hot?: boolean }) => {
  const y1 = up ? UP : DOWN;
  const y2 = up ? RIB.y : RIB.y + RIB.h;
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
      <line x1={cx} y1={y1} x2={tx} y2={y2} stroke={hot ? ink.red : ink.soft} strokeWidth={2.5} strokeDasharray={hot ? undefined : '5 5'} />
      <circle cx={tx} cy={y2} r={7} fill={hot ? ink.red : ink.text} stroke={ink.sheet} strokeWidth={3} />
    </svg>
  );
};

const placeAt = (cx: number, w: number, up?: boolean): CSSProperties => ({
  position: 'absolute',
  left: cx - w / 2,
  width: w,
  pointerEvents: 'auto',
  ...(up ? { bottom: 1080 - UP } : { top: DOWN }),
});

// A dossier on an era page: big card, linked when its deck exists.
const DossierEvent = ({
  n,
  year,
  title,
  sub,
  cx,
  tx,
  up,
  beat,
}: {
  n: number;
  year: number;
  title: string;
  sub: string;
  cx: number;
  tx: number;
  up?: boolean;
  beat: number;
}) => {
  const deck = DECKS[n];
  return (
    <div className={`aa-on${beat}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <Connector cx={cx} tx={tx} up={up} hot />
      <div style={placeAt(cx, 340, up)}>
        <DeckLink id={deck}>
          <div className="aa-link" style={{ ...cardFrame(deck), padding: '14px 18px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Label c={ink.red} size={19}>
                Dossier nº {pad2(n)}
              </Label>
              <Status deck={deck} />
            </div>
            <div style={{ marginTop: 6, fontFamily: typewriter, fontSize: 44, lineHeight: 1, textShadow: BLEED }}>{year}</div>
            <div style={{ marginTop: 8, fontFamily: typewriter, fontSize: 30, lineHeight: 1.12, textShadow: BLEED }}>{title}</div>
            <div style={{ marginTop: 8, fontSize: 21, lineHeight: 1.35, color: ink.soft }}>{sub}</div>
          </div>
        </DeckLink>
      </div>
    </div>
  );
};

// A secondary milestone: just a typed note, no card.
const Milestone = ({ year, cx, tx, up, beat, children }: { year: number; cx: number; tx: number; up?: boolean; beat: number; children: ReactNode }) => (
  <div className={`aa-on${beat}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
    <Connector cx={cx} tx={tx} up={up} />
    <div style={placeAt(cx, 270, up)}>
      <div style={{ fontFamily: typewriter, fontSize: 36, lineHeight: 1.1, color: ink.soft }}>{year}</div>
      <div style={{ marginTop: 4, fontSize: 22, lineHeight: 1.35 }}>{children}</div>
    </div>
  </div>
);

// A photo pinned next to its event, appearing on the same click. Real images
// from Wikimedia Commons (see the credits page); `zoom` + `origin` crop on a face.
const Print = ({
  src,
  caption,
  x,
  y,
  beat,
  w = 130,
  h = 160,
  rot = 0,
  zoom = 1,
  origin = '50% 50%',
  fit = 'cover',
  tone = true,
}: {
  src: string;
  caption: string;
  x: number;
  y: number;
  beat: number;
  w?: number;
  h?: number;
  rot?: number;
  zoom?: number;
  origin?: string;
  fit?: 'cover' | 'contain';
  tone?: boolean;
}) => (
  <div className={`aa-on${beat}`} style={{ ...vars({ d: '250ms' }), position: 'absolute', inset: 0, pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', left: x, top: y, width: w + 16, transform: `rotate(${rot}deg)` }}>
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
      <div style={{ marginTop: 6, textAlign: 'center', fontFamily: hand, fontWeight: 600, fontSize: 25, lineHeight: 1.05, color: ink.blue }}>
        {caption}
      </div>
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

// Era I · 1940 → 1974
const X1 = (y: number) => 210 + (y - 1940) * 45;
const EraI: Page = () => (
  <Frame id="era1" era="1943–1973" eyebrow="Époque I · 1943 – 1973" title="Les pionniers et le premier âge d'or" beats={6}>
    <Band x1={X1(1940)} x2={X1(1956)} tone="pioneer">
      Les pionniers
    </Band>
    <Band x1={X1(1956)} x2={X1(1974)} tone="gold">
      Le premier âge d'or
    </Band>
    <DossierEvent n={0} year={1943} title="Le neurone formel" sub="McCulloch & Pitts : un neurone, un calcul logique." cx={345} tx={X1(1943)} up beat={1} />
    <Milestone year={1950} cx={660} tx={X1(1950)} beat={2}>
      <b>Turing</b> : « Les machines peuvent-elles penser ? » Le jeu de l'imitation.
    </Milestone>
    <DossierEvent n={3} year={1956} title="L'IA symbolique" sub="Dartmouth baptise l'IA : règles et symboles." cx={1016} tx={X1(1956)} up beat={3} />
    <DossierEvent n={1} year={1957} title="Le Perceptron" sub="Rosenblatt : une machine qui apprend." cx={975} tx={X1(1957)} beat={4} />
    <Milestone year={1966} cx={1380} tx={X1(1966)} up beat={5}>
      <b>ELIZA</b> : Weizenbaum crée le premier chatbot.
    </Milestone>
    <Milestone year={1969} cx={1470} tx={X1(1969)} beat={6}>
      <b>Minsky & Papert</b> : le livre <i>Perceptrons</i> montre les limites d'une seule couche.
    </Milestone>
    <Print src={imgPitts} caption="Walter Pitts, 1954" x={528} y={330} rot={-3} zoom={1.9} origin="56% 24%" beat={1} />
    <Print src={imgTuring} caption="Alan Turing, 1951" x={360} y={676} rot={-2.5} beat={2} />
    <Print src={imgMcCarthy} caption="John McCarthy" x={684} y={336} rot={2.5} zoom={1.1} origin="62% 30%" beat={3} />
    <Print src={imgRosenblatt} caption="Frank Rosenblatt" x={1162} y={676} rot={2.5} beat={4} />
    <Print src={imgWeizenbaum} caption="Joseph Weizenbaum" x={1540} y={304} rot={3} zoom={1.25} origin="50% 22%" beat={5} />
    <Print src={imgMinsky} caption="Marvin Minsky" x={1622} y={676} rot={-3} zoom={1.15} origin="58% 25%" beat={6} />
  </Frame>
);

// Era II · 1973 → 1994
const X2 = (y: number) => 210 + ((y - 1973) * 1530) / 21;
const EraII: Page = () => (
  <Frame id="era2" era="1973–1993" eyebrow="Époque II · 1973 – 1993" title="Hivers et renaissances" beats={6}>
    <Band x1={X2(1973)} x2={X2(1980)} tone="winter">
      1er hiver
    </Band>
    <Band x1={X2(1980)} x2={X2(1987)} tone="goldLight">
      Boom des systèmes experts
    </Band>
    <Band x1={X2(1987)} x2={X2(1993)} tone="winter">
      2e hiver
    </Band>
    <Band x1={X2(1993)} x2={X2(1994)} tone="stat" />
    <Milestone year={1973} cx={305} tx={X2(1973.5)} up beat={1}>
      <b>Rapport Lighthill</b> : au Royaume-Uni, les crédits de l'IA s'effondrent.
    </Milestone>
    <Milestone year={1980} cx={720} tx={X2(1980)} beat={2}>
      <b>Néocognitron</b> : Fukushima imagine une vision artificielle en couches.
    </Milestone>
    <Milestone year={1980} cx={790} tx={X2(1980.5)} up beat={3}>
      <b>Systèmes experts</b> : XCON configure les ordinateurs de DEC.
    </Milestone>
    <DossierEvent n={2} year={1986} title="La rétropropagation" sub="Corriger chaque poids d'un réseau multicouche." cx={1157} tx={X2(1986)} up beat={4} />
    <DossierEvent n={4} year={1989} title="Les réseaux convolutifs" sub="LeCun apprend à lire les chiffres manuscrits." cx={1376} tx={X2(1989)} beat={5} />
    <Milestone year={1989} cx={1520} tx={X2(1989.3)} up beat={6}>
      <b>Cybenko</b> : une seule couche cachée peut approcher toute fonction continue.
    </Milestone>
    <Print src={imgVax} caption="VAX-11/780 de DEC" x={476} y={304} rot={-2.5} beat={3} />
    <Print src={imgRumelhart} caption="David Rumelhart, 1991" x={1010} y={676} rot={2.5} zoom={1.6} origin="38% 22%" beat={4} />
    <Print src={imgLeCun} caption="Yann LeCun" x={1566} y={676} rot={-2.5} zoom={1.1} origin="50% 28%" beat={5} />
  </Frame>
);

// Era III · 1992 → 2011
const X3 = (y: number) => 210 + ((y - 1992) * 1530) / 19;
const EraIII: Page = () => (
  <Frame id="era3" era="1993–2011" eyebrow="Époque III · 1993 – 2011" title="L'apprentissage statistique" beats={6}>
    <Band x1={X3(1992)} x2={X3(1993)} tone="winter" />
    <Band x1={X3(1993)} x2={X3(2011)} tone="stat">
      Les réseaux de neurones en retrait
    </Band>
    <Milestone year={1995} cx={305} tx={X3(1995)} beat={1}>
      <b>SVM</b> : Cortes & Vapnik, les séparateurs à vaste marge.
    </Milestone>
    <DossierEvent n={5} year={1997} title="Deep Blue bat Kasparov" sub="La victoire du calcul et de la recherche." cx={613} tx={X3(1997)} up beat={2} />
    <Milestone year={1997} cx={600} tx={X3(1997.3)} beat={3}>
      <b>LSTM</b> : Hochreiter & Schmidhuber donnent une mémoire aux réseaux.
    </Milestone>
    <Milestone year={1998} cx={930} tx={X3(1998)} up beat={4}>
      <b>LeNet-5</b> : les réseaux convolutifs lisent des chèques bancaires.
    </Milestone>
    <Milestone year={2006} cx={1337} tx={X3(2006)} up beat={5}>
      <b>Hinton</b> : les « deep belief nets » relancent les réseaux profonds.
    </Milestone>
    <Milestone year={2009} cx={1579} tx={X3(2009)} beat={6}>
      <b>ImageNet</b> : Fei-Fei Li publie des millions d'images annotées.
    </Milestone>
    <Print src={imgDeepBlue} caption="Deep Blue (IBM)" x={276} y={304} rot={-3} origin="40% 50%" beat={2} />
    <Print src={imgSchmidhuber} caption="Jürgen Schmidhuber" x={752} y={676} rot={2.5} origin="50% 30%" beat={3} />
    <Print src={imgMnist} caption="MNIST : les chiffres à lire" x={922} y={690} w={260} h={129} rot={-1.5} beat={4} />
    <Print src={imgHinton} caption="Geoffrey Hinton" x={1494} y={304} rot={3} zoom={1.25} origin="50% 24%" beat={5} />
    <Print src={imgFeiFei} caption="Fei-Fei Li" x={1272} y={676} rot={-2.5} zoom={1.9} origin="60% 14%" beat={6} />
  </Frame>
);

// Era IV · 2011 → 2023
const X4 = (y: number) => 210 + ((y - 2011) * 1530) / 12;
const EraIV: Page = () => (
  <Frame id="era4" era="2012–2022" eyebrow="Époque IV · 2012 – 2022" title="L'explosion du deep learning" beats={7}>
    <Band x1={X4(2011)} x2={X4(2017)} tone="deep">
      Le deep learning
    </Band>
    <Band x1={X4(2017)} x2={X4(2023)} tone="gen">
      Transformers & IA générative
    </Band>
    <DossierEvent n={6} year={2012} title="AlexNet & ImageNet" sub="Un réseau profond sur GPU écrase la compétition." cx={345} tx={X4(2012)} up beat={1} />
    <DossierEvent n={7} year={2013} title="Les mots en nombres" sub="word2vec : chaque mot devient un vecteur." cx={430} tx={X4(2013)} beat={2} />
    <Milestone year={2014} cx={660} tx={X4(2014)} up beat={3}>
      <b>GANs</b> : Goodfellow fait s'affronter deux réseaux pour créer des images.
    </Milestone>
    <DossierEvent n={8} year={2016} title="AlphaGo" sub="Bat Lee Sedol au go, 4 victoires à 1." cx={847} tx={X4(2016)} beat={4} />
    <DossierEvent n={9} year={2017} title="Le Transformer" sub="« Attention Is All You Need »." cx={975} tx={X4(2017)} up beat={5} />
    <Milestone year={2020} cx={1357} tx={X4(2020)} beat={6}>
      <b>GPT-3</b> : 175 milliards de paramètres.
    </Milestone>
    <DossierEvent n={10} year={2022} title="ChatGPT & l'IA générative" sub="L'IA générative arrive chez tout le monde." cx={1608} tx={X4(2022)} up beat={7} />
    <Print src={imgLeeSedol} caption="Lee Sedol, 2016" x={1036} y={676} rot={2.5} origin="50% 22%" beat={4} />
    <Print src={imgTransformer} caption="L'architecture Transformer" x={1180} y={300} w={200} h={200} rot={-2} fit="contain" tone={false} beat={5} />
    <Print src={imgOpenAI} caption="ChatGPT (OpenAI)" x={1580} y={676} w={120} h={120} rot={-2.5} fit="contain" tone={false} beat={7} />
  </Frame>
);

// ═══ 7 · Le sommaire ═════════════════════════════════════════════════════════
const COLS = [170, 580, 990, 1400];
const ROWS = [300, 524, 748];

const IndexCard = ({ n, year, title }: { n: number; year: number; title: string }) => {
  const deck = DECKS[n];
  return (
    <div
      className="aa-in"
      style={{ ...vars({ d: `${300 + n * 70}ms` }), position: 'absolute', left: COLS[n % 4], top: ROWS[Math.floor(n / 4)], width: 380 }}
    >
      <DeckLink id={deck}>
        <div className="aa-link" style={{ ...cardFrame(deck), height: 200, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Label c={ink.red} size={20}>
              Dossier nº {pad2(n)}
            </Label>
            <Status deck={deck} />
          </div>
          <div style={{ marginTop: 8, fontFamily: typewriter, fontSize: 40, lineHeight: 1, color: ink.muted }}>{year}</div>
          <div style={{ marginTop: 8, fontFamily: typewriter, fontSize: 30, lineHeight: 1.12, textShadow: BLEED }}>{title}</div>
        </div>
      </DeckLink>
    </div>
  );
};

const Index: Page = () => (
  <Frame id="index" era="Index" eyebrow="Sommaire" title="Les 11 dossiers">
    <IndexCard n={0} year={1943} title="Le premier neurone mathématique" />
    <IndexCard n={1} year={1957} title="Le Perceptron" />
    <IndexCard n={2} year={1986} title="La rétropropagation" />
    <IndexCard n={3} year={1956} title="L'autre IA : règles, symboles et hivers" />
    <IndexCard n={4} year={1989} title="Les réseaux convolutifs" />
    <IndexCard n={5} year={1997} title="Deep Blue bat Kasparov" />
    <IndexCard n={6} year={2012} title="AlexNet & ImageNet" />
    <IndexCard n={7} year={2013} title="Les mots deviennent des nombres" />
    <IndexCard n={8} year={2016} title="AlphaGo : apprendre en jouant" />
    <IndexCard n={9} year={2017} title="Le Transformer" />
    <IndexCard n={10} year={2022} title="ChatGPT & l'IA générative" />
    <Hand x={COLS[3] + 16} y={ROWS[2] + 22} w={360} rot={-3} size={32} d={1300}>
      Cliquez sur un dossier pour l'ouvrir. Chaque dossier se termine par un lien de retour ici.
    </Hand>
  </Frame>
);

// ═══ 8 · Pour aller plus loin ════════════════════════════════════════════════
const SeriesCard = ({ id, left, title, children, related, d }: { id: string; left: number; title: string; children: ReactNode; related: string; d: number }) => (
  <div className="aa-in" style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left, top: 320, width: 770 }}>
    <DeckLink id={id}>
      <div className="aa-link" style={{ ...cardFrame(id), padding: '24px 30px 26px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Label>Série « explique »</Label>
          <Status deck={id} size={22} />
        </div>
        <div style={{ marginTop: 14, fontFamily: typewriter, fontSize: 46, lineHeight: 1.1, textShadow: BLEED }}>{title}</div>
        <div style={{ marginTop: 14, fontSize: 26, lineHeight: 1.45, color: ink.soft }}>{children}</div>
        <div style={{ marginTop: 14, fontFamily: hand, fontWeight: 600, fontSize: 32, color: ink.blue }}>{related}</div>
      </div>
    </DeckLink>
  </div>
);

const Further: Page = () => (
  <Frame id="further" era="Fin" eyebrow="Pour aller plus loin" title="Comprendre les mécanismes">
    <SeriesCard id="ml-explique" left={170} title="Comment une machine apprend" related="→ complète les dossiers 1, 2 et 6" d={400}>
      Données, modèle, erreur, descente de gradient, généralisation.
    </SeriesCard>
    <SeriesCard id="llm-explique" left={1010} title="Comment fonctionne un LLM" related="→ complète les dossiers 7, 9 et 10" d={600}>
      Tokens, vecteurs, attention, Transformer, entraînement.
    </SeriesCard>
    <div
      className="aa-in"
      style={{ ...vars({ d: '1000ms' }), position: 'absolute', left: L, top: 730, fontFamily: typewriter, fontSize: 110, lineHeight: 1, textShadow: BLEED }}
    >
      Merci<span style={{ color: 'var(--osd-accent)' }}>.</span>
    </div>
    <div className="aa-in-fade" style={{ ...vars({ d: '1300ms' }), position: 'absolute', left: 1010, top: 790, display: 'flex', alignItems: 'center', gap: 22 }}>
      <img
        src={portrait}
        alt="Houssem Eddine Lassoued"
        style={{
          width: 84,
          height: 84,
          borderRadius: 999,
          objectFit: 'cover',
          objectPosition: '56% 30%',
          filter: 'grayscale(1) sepia(0.5) contrast(1.05)',
          boxShadow: `0 0 0 3px ${ink.sheet}, 0 0 0 4.5px ${ink.rule}`,
        }}
      />
      <div>
        <Label>Conçu par</Label>
        <div style={{ marginTop: 4, fontFamily: typewriter, fontSize: 32 }}>Houssem Eddine Lassoued</div>
        <a
          href="https://www.linkedin.com/in/houssemeddinelassoued"
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: 24, color: 'var(--osd-accent)', textDecoration: 'underline', textUnderlineOffset: 5 }}
        >
          LinkedIn ↗
        </a>
      </div>
    </div>
  </Frame>
);

// ═══ 9 · Crédits des images ══════════════════════════════════════════════════
const Credit = ({ name, by, lic }: { name: string; by: string; lic: string }) => (
  <div style={{ marginBottom: 13 }}>
    <div style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.3 }}>{name}</div>
    <div style={{ fontSize: 19, lineHeight: 1.3, color: ink.muted }}>
      {by} · {lic}
    </div>
  </div>
);

const Credits: Page = () => (
  <Frame id="credits" era="Sources" eyebrow="Sources" title="Crédits des images">
    <div className="aa-in" style={{ ...vars({ d: '300ms' }), position: 'absolute', left: L, top: 300, width: 790 }}>
      <Credit name="Walter Pitts (1954)" by="Francis Bello" lic="domaine public" />
      <Credit name="Alan Turing (1951)" by="Elliott & Fry" lic="domaine public" />
      <Credit name="John McCarthy (2006)" by="« null0 »" lic="CC BY-SA 2.0" />
      <Credit name="Frank Rosenblatt (vers 1950)" by="Heinz Nixdorf MuseumsForum" lic="CC BY-SA 4.0" />
      <Credit name="Joseph Weizenbaum (1982)" by="Rochester Institute of Technology" lic="domaine public" />
      <Credit name="Marvin Minsky (2008)" by="Sethwoodworth, Wikipédia anglophone" lic="CC BY 3.0" />
      <Credit name="VAX-11/780 de DEC" by="Emiliano Russo, VerdeBinario" lic="domaine public" />
      <Credit name="David Rumelhart (1991)" by="Rolf Kickuth" lic="CC BY-SA 4.0" />
      <Credit name="Yann LeCun (2024)" by="Jérémy Barande" lic="CC BY-SA 2.0" />
    </div>
    <div className="aa-in" style={{ ...vars({ d: '450ms' }), position: 'absolute', left: 990, top: 300, width: 790 }}>
      <Credit name="Deep Blue (2007)" by="James the photographer" lic="CC BY 2.0" />
      <Credit name="Jürgen Schmidhuber (2017)" by="ITU / R. Farrell" lic="CC BY 2.0" />
      <Credit name="Exemples MNIST" by="Suvanjanprasai" lic="CC BY-SA 4.0" />
      <Credit name="Geoffrey Hinton (2026)" by="Cmichel67" lic="CC BY-SA 4.0" />
      <Credit name="Fei-Fei Li (2017)" by="ITU Pictures" lic="CC BY 2.0" />
      <Credit name="Architecture Transformer" by="dvgodoy" lic="CC BY 4.0" />
      <Credit name="Lee Sedol (2016)" by="LG Electronics" lic="CC BY 2.0" />
      <Credit name="Logo OpenAI" by="OpenAI" lic="domaine public, marque déposée" />
    </div>
    <div className="aa-in-fade" style={{ ...vars({ d: '700ms' }), position: 'absolute', left: L, right: RIGHT, top: 902, fontSize: 20, lineHeight: 1.35, color: ink.soft }}>
      Toutes les images viennent de Wikimedia Commons. Elles sont recadrées et teintées en sépia à l'affichage ; chacune reste sous la licence indiquée.
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

const STYLE_ID = 'osd-styles-ai-history-sommaire';
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
  title: "Archives de l'IA : sommaire général",
  createdAt: '2026-10-04T20:47:22.181Z',
};

export const notes: (string | undefined)[] = [
  `Ouverture de la série. Onze dossiers, de 1943 à aujourd'hui : chacun raconte un moment clé de l'intelligence artificielle.
Cette présentation est le point d'entrée : une frise pour se repérer, et un lien vers chaque dossier.`,
  `La vue d'ensemble. En bas de chaque étiquette, le fil rejoint sa date sur le ruban.
Le ruban montre les grandes périodes : les pionniers, le premier âge d'or, le premier hiver, le boom des systèmes experts, le deuxième hiver, l'apprentissage statistique, puis le deep learning.
Les étiquettes rouges marquées « ouvrir ↗ » sont des dossiers déjà disponibles : un clic ouvre la présentation.`,
  `Époque I, une révélation par clic.
1 : 1943, McCulloch et Pitts, le premier neurone mathématique (dossier 0).
2 : 1950, Turing pose la question « les machines peuvent-elles penser ? ».
3 : 1956, Dartmouth, le mot « intelligence artificielle » s'impose (dossier 3, l'IA symbolique).
4 : 1957, le Perceptron de Rosenblatt (dossier 1).
5 : 1966, ELIZA, le premier chatbot.
6 : 1969, Minsky et Papert montrent les limites d'une seule couche.`,
  `Époque II : les hivers et les rebonds.
1 : 1973, le rapport Lighthill ; les crédits s'effondrent, c'est le premier hiver.
2 : 1980, le Néocognitron de Fukushima, ancêtre des réseaux convolutifs.
3 : 1980, les systèmes experts entrent dans les entreprises (XCON chez DEC) : le boom de l'IA des règles.
4 : 1986, la rétropropagation (dossier 2).
5 : 1989, LeCun et les réseaux convolutifs (dossier 4).
6 : 1989, le théorème d'approximation universelle : une seule couche cachée suffit en théorie. Le deuxième hiver dure jusqu'en 1993.`,
  `Époque III : les réseaux de neurones passent au second plan, l'apprentissage statistique domine.
1 : 1995, les SVM.
2 : 1997, Deep Blue bat Kasparov (dossier 5) — la victoire du calcul, pas de l'apprentissage.
3 : 1997, les LSTM donnent une mémoire aux réseaux.
4 : 1998, LeNet-5 lit des chèques bancaires.
5 : 2006, Hinton relance les réseaux profonds.
6 : 2009, ImageNet : les données arrivent. Tout est prêt pour l'explosion.`,
  `Époque IV : l'explosion.
1 : 2012, AlexNet écrase ImageNet (dossier 6).
2 : 2013, word2vec, les mots deviennent des vecteurs (dossier 7).
3 : 2014, les GANs génèrent des images.
4 : 2016, AlphaGo bat Lee Sedol (dossier 8).
5 : 2017, le Transformer (dossier 9).
6 : 2020, GPT-3.
7 : 2022, ChatGPT (dossier 10).`,
  `Le sommaire : les onze dossiers. Ceux qui sont disponibles s'ouvrent d'un clic ; pour revenir, flèche retour du navigateur.`,
  `Pour aller plus loin, deux présentations de la série « explique » détaillent les mécanismes : comment une machine apprend, et comment fonctionne un LLM.
Merci.`,
  `Crédits des images, pour référence : toutes viennent de Wikimedia Commons, avec leur auteur et leur licence. Pas besoin de s'y arrêter pendant la présentation.`,
];

export default [Cover, Overview, EraI, EraII, EraIII, EraIV, Index, Further, Credits] satisfies Page[];
