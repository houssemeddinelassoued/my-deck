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
import { type CSSProperties, type ReactNode, useEffect, useId, useRef, useState } from 'react';
import imgPalette from './assets/artist-palette.png';
import imgBackpack from './assets/backpack.png';
import imgBalloon from './assets/balloon.png';
import imgBasketball from './assets/basketball.png';
import imgBooks from './assets/books.png';
import imgClap from './assets/clapping-hands.png';
import imgCrayon from './assets/crayon.png';
import imgEar from './assets/ear.png';
import imgEyes from './assets/eyes.png';
import imgDie from './assets/game-die.png';
import imgGlowStar from './assets/glowing-star.png';
import imgGrin from './assets/grinning-face.png';
import imgHeadphone from './assets/headphone.png';
import imgBulb from './assets/light-bulb.png';
import imgMagnifier from './assets/magnifier.png';
import imgMic from './assets/microphone.png';
import imgNotes from './assets/musical-notes.png';
import imgOpenBook from './assets/open-book.png';
import imgParty from './assets/party-popper.png';
import imgPencil from './assets/pencil.png';
import imgRainbow from './assets/rainbow.png';
import imgRaise from './assets/raising-hands.png';
import imgHeart from './assets/red-heart.png';
import imgSmile from './assets/slightly-smiling-face.png';
import imgSoccer from './assets/soccer-ball.png';
import imgSparkles from './assets/sparkles.png';
import imgSpeak from './assets/speaking-head.png';
import imgBubble from './assets/speech-balloon.png';
import imgStar from './assets/star.png';
import imgStopwatch from './assets/stopwatch.png';
import imgThink from './assets/thinking-face.png';
import imgThumb from './assets/thumbs-up.png';
import imgTrophy from './assets/trophy.png';
import imgTurns from './assets/turns.png';
import imgWave from './assets/waving-hand.png';
import imgDancer from './assets/woman-dancing.png';

// Stickers: Microsoft Fluent Emoji 3D (MIT licence). Clothes and children are
// drawn below in SVG so their colours can change with the lesson.

export const design: DesignSystem = {
  palette: { bg: '#fff6e6', text: '#22305a', accent: '#ff5a5f' },
  fonts: {
    display: '"Fredoka", "Baloo 2", "Trebuchet MS", sans-serif',
    body: '"Nunito", "Segoe UI", system-ui, sans-serif',
  },
  typeScale: { hero: 150, body: 40 },
  radius: 28,
};

// ─── Webfonts (module-level, slide-keyed) ───────────────────────────────────
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:ital,wght@0,600;0,700;0,800;0,900;1,700&display=swap';
const FONT_LINK_ID = 'osd-webfont-meet-my-classmates';
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

// ─── Palette (sticker book: cream paper, bright primaries, navy ink) ────────
const C = {
  ink: '#22305a',
  soft: '#4b5785',
  muted: '#8a92b2',
  faint: '#d5d8e6',
  card: '#ffffff',
  paper: '#fffaf1',
  line: '#f0dfc0',
};

type Tone = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'teal';
const STRONG: Record<Tone, string> = {
  red: '#ff5a5f',
  orange: '#ff9330',
  yellow: '#ffc531',
  green: '#2fbf71',
  blue: '#3d8bfd',
  purple: '#8b6cf0',
  pink: '#ff6fae',
  teal: '#1fb5c9',
};
const SOFT: Record<Tone, string> = {
  red: '#ffe1df',
  orange: '#ffe8d1',
  yellow: '#fff1c4',
  green: '#d8f5e5',
  blue: '#dceaff',
  purple: '#ebe4ff',
  pink: '#ffe0ee',
  teal: '#d4f4f8',
};
const DEEP: Record<Tone, string> = {
  red: '#c7363b',
  orange: '#c4620b',
  yellow: '#b07e00',
  green: '#1b8a4f',
  blue: '#2161c9',
  purple: '#5f43c4',
  pink: '#c63c7e',
  teal: '#11808f',
};
const onTone = (t: Tone) => (t === 'yellow' ? C.ink : '#fff');

const display = 'var(--osd-font-display)';
const body = 'var(--osd-font-body)';

const PAD = 110;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
const BOUNCE = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

// ─── Small helpers ──────────────────────────────────────────────────────────
// CSS custom properties as inline style (React's CSSProperties has no index signature).
const vars = (o: Record<string, string | number>): CSSProperties => {
  const out: Record<string, string | number> = {};
  for (const k of Object.keys(o)) out[`--${k}`] = o[k];
  return out as CSSProperties;
};

// Deterministic pseudo-random generator (same picture on every render).
const rng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

const rgb = (h: string) => {
  const n = Number.parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (a: string, b: string, t: number) => {
  const A = rgb(a);
  const B = rgb(b);
  return `#${A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
};
const OUTLINE = '#1f2547';
const edge = (c: string) => mix(c, OUTLINE, 0.6);

// React ids contain characters SVG url(#…) references dislike.
const useSvgId = () => `mmc${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

// Re-triggerable animation: bump() changes the key, which restarts the CSS animation.
const useBump = () => {
  const [n, setN] = useState(0);
  return [n, () => setN((v) => v + 1)] as const;
};

// ─── Voice (Web Speech API) ─────────────────────────────────────────────────
let voices: SpeechSynthesisVoice[] = [];
const loadVoices = () => {
  try {
    voices = window.speechSynthesis.getVoices();
  } catch {
    voices = [];
  }
};
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}
const pickVoice = () => {
  if (!voices.length) loadVoices();
  const en = voices.filter((v) => /^en[-_]/i.test(v.lang));
  return (
    en.find((v) => /en[-_]GB/i.test(v.lang) && /(Sonia|Libby|Hazel|Maisie|Female)/i.test(v.name)) ??
    en.find((v) => /en[-_]GB/i.test(v.lang)) ??
    en.find((v) => /en[-_]US/i.test(v.lang)) ??
    en[0]
  );
};
const say = (text: string, rate = 0.82) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const v = pickVoice();
  if (v) u.voice = v;
  u.lang = v?.lang ?? 'en-GB';
  u.rate = rate;
  u.pitch = 1.05;
  synth.speak(u);
};
const hush = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
};

// ─── Sound effects (Web Audio, synthesized: no files) ───────────────────────
let actx: AudioContext | null = null;
const chime = (ok: boolean) => {
  try {
    const W = window as Window & { webkitAudioContext?: typeof AudioContext };
    const Ctx = window.AudioContext ?? W.webkitAudioContext;
    if (!Ctx) return;
    actx ??= new Ctx();
    const ctx = actx;
    if (ctx.state === 'suspended') void ctx.resume();
    const t0 = ctx.currentTime + 0.01;
    const notes: [number, number][] = ok
      ? [
          [784, 0],
          [1047, 0.09],
          [1319, 0.18],
        ]
      : [
          [233, 0],
          [185, 0.13],
        ];
    for (const [f, dt] of notes) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = ok ? 'sine' : 'triangle';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0 + dt);
      g.gain.exponentialRampToValueAtTime(ok ? 0.16 : 0.22, t0 + dt + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dt + (ok ? 0.38 : 0.3));
      o.connect(g).connect(ctx.destination);
      o.start(t0 + dt);
      o.stop(t0 + dt + 0.42);
    }
  } catch {
    // Sound is a bonus; ignore browsers that refuse it.
  }
};

// ─── Stylesheet (collected, injected once at the bottom) ────────────────────
const CSS: string[] = [];
CSS.push(`
@keyframes mmc-pop{0%{opacity:0;transform:scale(.4)}65%{opacity:1;transform:scale(1.08)}100%{opacity:1;transform:scale(1)}}
@keyframes mmc-rise{0%{opacity:0;transform:translateY(34px)}100%{opacity:1;transform:none}}
@keyframes mmc-drop{0%{opacity:0;transform:translateY(-60px) rotate(-8deg)}60%{opacity:1;transform:translateY(8px) rotate(2deg)}100%{opacity:1;transform:none}}
@keyframes mmc-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes mmc-sway{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
@keyframes mmc-wiggle{0%{transform:none}20%{transform:rotate(-5deg) scale(1.06)}45%{transform:rotate(4deg) scale(1.06)}70%{transform:rotate(-2deg) scale(1.02)}100%{transform:none}}
@keyframes mmc-shake{0%,100%{transform:none}20%{transform:translateX(-14px)}40%{transform:translateX(12px)}60%{transform:translateX(-8px)}80%{transform:translateX(5px)}}
@keyframes mmc-halo{0%,100%{opacity:.25}50%{opacity:1}}
@keyframes mmc-throb{0%,100%{transform:scale(1)}50%{transform:scale(1.045)}}
@keyframes mmc-fill{0%{opacity:0;transform:translateY(-18px) scale(.6)}70%{opacity:1;transform:translateY(2px) scale(1.08)}100%{opacity:1;transform:none}}
@keyframes mmc-badge{0%{opacity:0;transform:scale(0)}70%{opacity:1;transform:scale(1.25)}100%{opacity:1;transform:scale(1)}}
@keyframes mmc-bit{0%{opacity:1;transform:translate(0,0) rotate(0) scale(.5)}55%{opacity:1;transform:translate(calc(var(--dx) * .9),calc(var(--dy) * .9)) rotate(calc(var(--rot) * .6)) scale(1)}100%{opacity:0;transform:translate(var(--dx),calc(var(--dy) + 170px)) rotate(var(--rot)) scale(.9)}}
@keyframes mmc-spin{to{transform:rotate(360deg)}}
.mmc-live .mmc-pop{animation:mmc-pop 640ms ${BOUNCE} var(--d,0ms) both}
.mmc-live .mmc-rise{animation:mmc-rise 700ms ${EASE} var(--d,0ms) both}
.mmc-live .mmc-drop{animation:mmc-drop 780ms ${EASE} var(--d,0ms) both}
.mmc-live .mmc-bob{animation:mmc-bob var(--t,3.6s) ease-in-out var(--d,0ms) infinite}
.mmc-live .mmc-sway{animation:mmc-sway var(--t,4s) ease-in-out var(--d,0ms) infinite}
.mmc-wiggle{animation:mmc-wiggle 560ms ease both}
.mmc-shake{animation:mmc-shake 460ms ease both}
.mmc-fill{display:inline-block;animation:mmc-fill 520ms ${BOUNCE} both}
.mmc-badge{animation:mmc-badge 440ms ${BOUNCE} var(--d,0ms) both;transform-box:fill-box;transform-origin:center}
.mmc-halo{animation:mmc-halo 1s ease-in-out infinite}
.mmc-throb{animation:mmc-throb 1s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
.mmc-bit{position:absolute;left:0;top:0;animation:mmc-bit 1150ms cubic-bezier(.15,.7,.35,1) var(--d,0ms) both}
.mmc-btn{transition:transform 120ms ease,box-shadow 120ms ease,background 160ms ease,opacity 160ms ease}
.mmc-btn:hover{transform:translateY(-2px)}
.mmc-btn:active{transform:translateY(4px)}
.mmc-btn:focus-visible{outline:4px solid ${STRONG.yellow};outline-offset:4px}
@media (prefers-reduced-motion: reduce){.mmc-page *{animation:none !important;transition:none !important}}
`);

// ─── Page shell ─────────────────────────────────────────────────────────────
const Tag = ({ tone, children, rot = -2 }: { tone: Tone; children: ReactNode; rot?: number }) => (
  <div
    style={{
      display: 'inline-block',
      fontFamily: display,
      fontWeight: 600,
      fontSize: 26,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: onTone(tone),
      background: STRONG[tone],
      padding: '8px 24px 9px',
      borderRadius: 999,
      transform: `rotate(${rot}deg)`,
      boxShadow: `0 5px 0 ${DEEP[tone]}`,
    }}
  >
    {children}
  </div>
);

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: PAD,
        right: PAD,
        bottom: 30,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: display,
        fontWeight: 500,
        fontSize: 22,
        color: C.muted,
      }}
    >
      <span>Lesson 4 · Meet my classmates</span>
      <span
        style={{
          background: '#fff',
          borderRadius: 999,
          padding: '6px 18px',
          boxShadow: `0 3px 0 ${C.line}`,
          color: C.soft,
          fontWeight: 600,
        }}
      >
        {current} / {total}
      </span>
    </div>
  );
};

const Shell = ({
  tag,
  tone = 'blue',
  title,
  right,
  children,
  footer = true,
}: {
  tag?: string;
  tone?: Tone;
  title?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  footer?: boolean;
}) => {
  const live = useIsActivePage();
  return (
    <div
      className={`mmc-page${live ? ' mmc-live' : ''}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: 'var(--osd-bg)',
        backgroundImage: 'radial-gradient(circle, rgba(34, 48, 90, 0.07) 2.6px, transparent 3px)',
        backgroundSize: '40px 40px',
        backgroundPosition: '20px 20px',
        color: 'var(--osd-text)',
        fontFamily: body,
      }}
    >
      {title ? (
        <div
          style={{
            position: 'absolute',
            left: PAD,
            right: PAD,
            top: 60,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div className="mmc-drop">
            {tag ? <Tag tone={tone}>{tag}</Tag> : null}
            <h2
              style={{
                fontFamily: display,
                fontWeight: 700,
                fontSize: 68,
                lineHeight: 1.08,
                margin: '16px 0 0',
                color: 'var(--osd-text)',
              }}
            >
              {title}
            </h2>
          </div>
          {right}
        </div>
      ) : null}
      {children}
      {footer ? <Footer /> : null}
    </div>
  );
};

// Content box under the header: y 236 → 990.
const Area = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div style={{ position: 'absolute', left: PAD, right: PAD, top: 236, bottom: 90, ...style }}>{children}</div>
);

// ─── Stickers & instruction icons ───────────────────────────────────────────
const STICKER =
  'drop-shadow(3px 0 0 #fff) drop-shadow(-3px 0 0 #fff) drop-shadow(0 3px 0 #fff) drop-shadow(0 -3px 0 #fff) drop-shadow(0 10px 10px rgba(34, 48, 90, 0.22))';

const Sticker = ({ src, size, rot = 0, style }: { src: string; size: number; rot?: number; style?: CSSProperties }) => (
  <img
    src={src}
    alt=""
    draggable={false}
    style={{
      display: 'block',
      width: size,
      height: size,
      objectFit: 'contain',
      filter: STICKER,
      transform: rot ? `rotate(${rot}deg)` : undefined,
      flex: 'none',
      ...style,
    }}
  />
);

// Animation wrapper: kind = pop | rise | drop | bob | sway, d = delay (ms).
const Anim = ({
  kind = 'pop',
  d = 0,
  t,
  children,
  style,
}: {
  kind?: 'pop' | 'rise' | 'drop' | 'bob' | 'sway';
  d?: number;
  t?: number;
  children: ReactNode;
  style?: CSSProperties;
}) => (
  <div className={`mmc-${kind}`} style={{ ...vars({ d: `${d}ms`, ...(t ? { t: `${t}ms` } : {}) }), ...style }}>
    {children}
  </div>
);

const Hint = ({ src, label }: { src: string; label: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 108 }}>
    <Sticker src={src} size={70} />
    <span style={{ fontFamily: display, fontWeight: 600, fontSize: 23, color: C.soft, whiteSpace: 'nowrap' }}>{label}</span>
  </div>
);
const Hints = ({ children }: { children: ReactNode }) => (
  <div className="mmc-pop" style={{ display: 'flex', gap: 8, ...vars({ d: '250ms' }) }}>
    {children}
  </div>
);

// ─── Buttons ────────────────────────────────────────────────────────────────
// Every interactive element is a <button> (or carries data-osd-interactive),
// so clicking it never turns the page.
const Btn = ({
  children,
  onClick,
  tone = 'blue',
  ghost = false,
  size = 30,
  disabled = false,
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: Tone;
  ghost?: boolean;
  size?: number;
  disabled?: boolean;
  style?: CSSProperties;
}) => (
  <button
    type="button"
    data-osd-interactive
    className="mmc-btn"
    disabled={disabled}
    onClick={(e) => {
      e.currentTarget.blur();
      onClick?.();
    }}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      fontFamily: display,
      fontWeight: 600,
      fontSize: size,
      lineHeight: 1,
      padding: `${Math.round(size * 0.5)}px ${Math.round(size * 0.9)}px`,
      borderRadius: 999,
      border: 'none',
      background: ghost ? '#fff' : STRONG[tone],
      color: ghost ? DEEP[tone] : onTone(tone),
      boxShadow: ghost ? `inset 0 0 0 3px ${STRONG[tone]}, 0 5px 0 ${SOFT[tone]}` : `0 6px 0 ${DEEP[tone]}`,
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      whiteSpace: 'nowrap',
      flex: 'none',
      ...style,
    }}
  >
    {children}
  </button>
);

const SpeakerIcon = ({ size = 34, color = '#fff' }: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill={color} />
    <path d="M15.5 9a4 4 0 0 1 0 6" />
    <path d="M18.5 6.5a7.5 7.5 0 0 1 0 11" />
  </svg>
);

const SpeakBtn = ({ text, tone = 'blue', size = 62 }: { text: string; tone?: Tone; size?: number }) => (
  <button
    type="button"
    data-osd-interactive
    className="mmc-btn"
    aria-label={`Listen: ${text}`}
    onClick={(e) => {
      e.stopPropagation();
      e.currentTarget.blur();
      say(text);
    }}
    style={{
      width: size,
      height: size,
      padding: 0,
      borderRadius: '50%',
      border: 'none',
      background: STRONG[tone],
      boxShadow: `0 5px 0 ${DEEP[tone]}`,
      display: 'grid',
      placeItems: 'center',
      cursor: 'pointer',
      flex: 'none',
    }}
  >
    <SpeakerIcon size={Math.round(size * 0.56)} color={onTone(tone)} />
  </button>
);

// ─── Confetti burst ─────────────────────────────────────────────────────────
// Rendered inside a position:relative box; a new `k` restarts the burst.
const Burst = ({ k, x = '50%', y = '50%', n = 28, spread = 240 }: { k: number; x?: string; y?: string; n?: number; spread?: number }) => {
  if (!k) return null;
  const r = rng(k * 7919 + n * 31);
  const colors = [STRONG.red, STRONG.yellow, STRONG.blue, STRONG.green, STRONG.purple, STRONG.orange, STRONG.pink];
  const bits: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2;
    const dist = spread * (0.4 + r() * 0.6);
    const w = 10 + r() * 10;
    bits.push(
      <span
        key={i}
        className="mmc-bit"
        style={{
          ...vars({
            dx: `${Math.round(Math.cos(a) * dist)}px`,
            dy: `${Math.round(Math.sin(a) * dist * 0.85 - 60)}px`,
            rot: `${Math.round(r() * 720 - 360)}deg`,
            d: `${Math.round(r() * 90)}ms`,
          }),
          width: w,
          height: r() > 0.5 ? w : w * 0.55,
          marginLeft: -w / 2,
          background: colors[i % colors.length],
          borderRadius: r() > 0.5 ? 3 : 99,
        }}
      />,
    );
  }
  return (
    <>
      <div
        key={k}
        aria-hidden
        style={{ position: 'absolute', left: x, top: y, width: 0, height: 0, pointerEvents: 'none', zIndex: 30 }}
      >
        {bits}
      </div>
    </>
  );
};

// ─── Clothes: colours & words ───────────────────────────────────────────────
const CLOTH = {
  red: '#ef4141',
  orange: '#ff8a26',
  yellow: '#ffd23a',
  green: '#35b45c',
  blue: '#2f6fe0',
  pink: '#ff7eb3',
  purple: '#8a55e0',
  brown: '#9a5a2c',
  black: '#2d2e38',
  white: '#f8f8f4',
  grey: '#9aa1ab',
} as const;
type ColorName = keyof typeof CLOTH;
const DENIM = '#3d67ba';
const cText = (c: ColorName) =>
  c === 'white' ? C.ink : mix(CLOTH[c], OUTLINE, c === 'yellow' ? 0.5 : c === 'orange' ? 0.3 : 0.12);

type GKind = 'tshirt' | 'shirt' | 'pullover' | 'dress' | 'coat' | 'jacket' | 'trousers' | 'jeans' | 'skirt' | 'trainers' | 'shoes';
type Wear = { k: GKind; c: ColorName };
const WORD: Record<GKind, string> = {
  tshirt: 'T-shirt',
  shirt: 'shirt',
  pullover: 'pullover',
  dress: 'dress',
  coat: 'coat',
  jacket: 'jacket',
  trousers: 'trousers',
  jeans: 'jeans',
  skirt: 'skirt',
  trainers: 'trainers',
  shoes: 'shoes',
};
const PLURAL = new Set<GKind>(['trousers', 'jeans', 'trainers', 'shoes']);
const phrase = (w: Wear) => {
  const p = `${w.c} ${WORD[w.k]}`;
  return PLURAL.has(w.k) ? p : `${/^[aeiou]/.test(w.c) ? 'an' : 'a'} ${p}`;
};
const listJoin = (xs: string[]) =>
  xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;
const fillOf = (w: Wear) => (w.k === 'jeans' && w.c === 'blue' ? DENIM : CLOTH[w.c]);

// A colour word with its swatch, so "white" still reads on a white card.
const ColorWord = ({ c, children }: { c: ColorName; children: ReactNode }) => (
  <span style={{ whiteSpace: 'nowrap' }}>
    <span
      style={{
        display: 'inline-block',
        width: '0.62em',
        height: '0.62em',
        borderRadius: '50%',
        background: CLOTH[c],
        boxShadow: `inset 0 0 0 0.09em ${edge(CLOTH[c])}`,
        marginRight: '0.2em',
        verticalAlign: '0.02em',
      }}
    />
    <b style={{ color: cText(c), fontWeight: 900 }}>{children}</b>
  </span>
);

// ─── Clothes: SVG geometry ──────────────────────────────────────────────────
// One 300 × 600 body frame. Every garment is drawn in that frame, so the same
// drawing dresses a child (Doll) or stands alone on a flashcard (Garment).
const f1 = (n: number) => Math.round(n * 10) / 10;
const circ = (cx: number, cy: number, r: number) =>
  `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
const ell = (cx: number, cy: number, rx: number, ry: number) =>
  `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${2 * rx} 0 a ${rx} ${ry} 0 1 0 ${-2 * rx} 0 Z`;
// Mirror a path around x = 150 (absolute M/L/C/Q coordinates only).
const flip = (d: string) =>
  d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_m, x: string, y: string) => `${f1(300 - Number(x))} ${y}`);

// Sleeves follow an arm axis from the shoulder (150 ± x0, y0) to the wrist
// (150 ± x1, y1); `t` is the fraction along it. On a child the arms hang down;
// on a flashcard the sleeves spread out so the garment reads at a glance.
type ArmG = { x0: number; y0: number; x1: number; y1: number };
const DOLL_ARM: ArmG = { x0: 34, y0: 212, x1: 64, y1: 356 };
const FLAT_ARM: ArmG = { x0: 36, y0: 214, x1: 104, y1: 322 };
const armPt = (g: ArmG, s: number, t: number) =>
  [150 + s * (g.x0 + (g.x1 - g.x0) * t), g.y0 + (g.y1 - g.y0) * t] as const;
const perp = (g: ArmG, s: number) => {
  const dx = g.x1 - g.x0;
  const dy = g.y1 - g.y0;
  const l = Math.hypot(dx, dy);
  return [dy / l, (-s * dx) / l] as const;
};
const sleeve = (g: ArmG, s: 1 | -1, t1: number, w0: number, w1: number) => {
  const [nx, ny] = perp(g, s);
  const p = (x: number, y: number, k: number) => `${f1(x + nx * k)} ${f1(y + ny * k)}`;
  const [ax, ay] = armPt(g, s, 0);
  const [bx, by] = armPt(g, s, t1);
  return `M ${p(ax, ay, w0 / 2)} L ${p(bx, by, w1 / 2)} L ${p(bx, by, -w1 / 2)} L ${p(ax, ay, -w0 / 2)} Z`;
};
const across = (g: ArmG, s: 1 | -1, t: number, w: number) => {
  const [nx, ny] = perp(g, s);
  const [x, y] = armPt(g, s, t);
  return `M ${f1(x + (nx * w) / 2)} ${f1(y + (ny * w) / 2)} L ${f1(x - (nx * w) / 2)} ${f1(y - (ny * w) / 2)}`;
};
const shoulder = (g: ArmG, s: number, r: number) => circ(150 + s * g.x0, g.y0 + 6, r);
// Both sleeves (+ rounded shoulders) of one garment.
const sleeves = (g: ArmG, t1: number, w0: number, w1: number) => [
  sleeve(g, -1, t1, w0, w1),
  sleeve(g, 1, t1, w0, w1),
  shoulder(g, -1, w0 / 2),
  shoulder(g, 1, w0 / 2),
];
const cuffs = (g: ArmG, t: number, w: number) => `${across(g, -1, t, w)} ${across(g, 1, t, w)}`;

const TORSO =
  'M 106 214 C 106 204 112 200 122 199 L 134 199 C 140 214 160 214 166 199 L 178 199 C 188 200 194 204 194 214 L 202 338 C 168 346 132 346 98 338 Z';
const NECK_BACK = 'M 134 200 C 137 190 163 190 166 200 C 160 212 140 212 134 200 Z';
const DRESS =
  'M 106 214 C 106 204 112 200 122 199 L 134 199 C 140 214 160 214 166 199 L 178 199 C 188 200 194 204 194 214 L 196 292 L 230 440 C 182 456 118 456 70 440 L 104 292 Z';
const COAT_L = 'M 100 214 C 100 203 108 197 120 196 L 134 196 L 131 280 L 128 454 C 112 454 98 452 84 448 Z';
const COAT_LINING = 'M 124 200 L 176 200 L 177 452 L 123 452 Z';
const LAPEL_L = 'M 134 196 L 131 266 L 115 228 L 121 200 Z';
const JACKET = 'M 100 214 C 100 202 110 196 124 195 L 176 195 C 190 196 200 202 200 214 L 206 350 C 170 360 130 360 94 350 Z';
const COLLAR_L = 'M 124 182 L 141 182 C 142 194 145 205 150 214 L 121 214 C 118 204 119 192 124 182 Z';
const COLLAR_BACK = 'M 124 182 L 176 182 L 178 214 L 122 214 Z';
const TROUSERS = 'M 98 326 L 202 326 L 205 534 L 158 534 L 152 388 L 148 388 L 142 534 L 95 534 Z';
const SKIRT = 'M 104 326 L 196 326 L 222 432 C 174 444 126 444 78 432 Z';
const SHOE_L =
  'M 102 526 L 140 526 C 146 526 149 531 149 538 L 149 552 L 82 552 C 76 552 74 545 79 540 C 86 533 94 528 102 526 Z';
const SOLE_L = 'M 77 548 L 151 548 L 151 558 C 151 562 148 564 144 564 L 84 564 C 78 564 75 560 77 548 Z';

const Ln = ({ d, s, w = 3, o = 1, dash }: { d: string; s: string; w?: number; o?: number; dash?: string }) => (
  <path
    d={d}
    fill="none"
    stroke={s}
    strokeWidth={w}
    strokeOpacity={o}
    strokeDasharray={dash}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);
const Dot = ({ x, y, r, fill, s }: { x: number; y: number; r: number; fill: string; s: string }) => (
  <circle cx={x} cy={y} r={r} fill={fill} stroke={s} strokeWidth={2} />
);

const lite = (c: string) => mix(c, '#ffffff', 0.42);
const dark = (c: string) => mix(c, OUTLINE, 0.3);

type Spec = { shapes: string[]; soles?: string[]; back?: string[]; details?: (c: string) => ReactNode };

const JeansStitch = ({ c }: { c: string }) => {
  const st = c === CLOTH.black ? '#b9bcc8' : '#f4b942';
  return (
    <>
      <Ln d="M 98 342 L 202 342" s={edge(c)} />
      <Ln d="M 100 334 L 200 334" s={st} w={2.5} dash="5 4" />
      <Ln d="M 104 349 Q 118 368 132 349" s={st} w={2.5} dash="5 4" />
      <Ln d="M 196 349 Q 182 368 168 349" s={st} w={2.5} dash="5 4" />
      <Ln d="M 157 344 L 157 374 Q 157 384 150 387" s={st} w={2.5} dash="5 4" />
      <Ln d="M 102 352 L 100 524" s={st} w={2.5} dash="5 4" />
      <Ln d="M 198 352 L 200 524" s={st} w={2.5} dash="5 4" />
      <Ln d="M 98 524 L 141 524" s={st} w={2.5} dash="5 4" />
      <Ln d="M 159 524 L 202 524" s={st} w={2.5} dash="5 4" />
      <Ln d="M 117 420 Q 121 446 118 476" s="#ffffff" w={7} o={0.18} />
      <Ln d="M 183 420 Q 179 446 182 476" s="#ffffff" w={7} o={0.18} />
      <Dot x={150} y={336} r={4.5} fill="#d9a441" s={edge(c)} />
    </>
  );
};

const makeSpecs = (g: ArmG): Record<GKind, Spec> => ({
  tshirt: {
    shapes: [TORSO, ...sleeves(g, 0.375, 36, 40)],
    back: [NECK_BACK],
    details: (c) => (
      <>
        <Ln d="M 134 199 C 140 214 160 214 166 199" s={edge(c)} w={4} />
        <Ln d="M 138 203 C 143 211 157 211 162 203" s={lite(c)} />
        <Ln d={cuffs(g, 0.306, 38)} s={edge(c)} o={0.5} />
        <Ln d="M 103 330 C 134 337 166 337 197 330" s={edge(c)} o={0.35} />
      </>
    ),
  },
  shirt: {
    shapes: [TORSO, ...sleeves(g, 0.889, 34, 32)],
    back: [NECK_BACK],
    details: (c) => (
      <>
        <Ln d={cuffs(g, 0.79, 32)} s={edge(c)} o={0.6} />
        <Ln d="M 150 216 L 150 340" s={edge(c)} o={0.7} />
        <Dot x={150} y={240} r={4} fill={lite(c)} s={edge(c)} />
        <Dot x={150} y={268} r={4} fill={lite(c)} s={edge(c)} />
        <Dot x={150} y={296} r={4} fill={lite(c)} s={edge(c)} />
        <Dot x={150} y={324} r={4} fill={lite(c)} s={edge(c)} />
        <path d="M 164 242 L 184 242 L 184 260 C 178 264 170 264 164 260 Z" fill="none" stroke={edge(c)} strokeWidth={2.5} strokeOpacity={0.6} />
        <path d="M 133 197 L 150 215 L 127 227 Z" fill={lite(c)} stroke={edge(c)} strokeWidth={3} strokeLinejoin="round" />
        <path d={flip('M 133 197 L 150 215 L 127 227 Z')} fill={lite(c)} stroke={edge(c)} strokeWidth={3} strokeLinejoin="round" />
      </>
    ),
  },
  pullover: {
    shapes: [TORSO, ...sleeves(g, 0.903, 36, 34)],
    back: [NECK_BACK],
    details: (c) => (
      <>
        <path d="M 103.5 262 L 196.5 262 L 197.6 280 L 102.4 280 Z" fill={lite(c)} />
        <Ln d="M 133 199 C 139 216 161 216 167 199" s={dark(c)} w={7} />
        <Ln d="M 100 326 C 132 334 168 334 200 326" s={edge(c)} o={0.6} />
        <Ln d="M 110 332 L 110 340 M 122 334 L 122 342 M 134 335 L 134 343 M 146 335 L 146 343 M 158 335 L 158 343 M 170 335 L 170 343 M 182 334 L 182 342 M 194 332 L 194 340" s={edge(c)} w={2.5} o={0.45} />
        <Ln d={cuffs(g, 0.806, 34)} s={edge(c)} o={0.6} />
      </>
    ),
  },
  dress: {
    shapes: [DRESS, ...sleeves(g, 0.264, 38, 44)],
    back: [NECK_BACK],
    details: (c) => (
      <>
        <Ln d="M 134 199 C 140 214 160 214 166 199" s={edge(c)} w={4} />
        <Ln d="M 126 306 L 110 444 M 150 308 L 150 450 M 174 306 L 190 444" s={edge(c)} o={0.3} />
        <Ln d="M 74 432 C 120 446 180 446 226 432" s={lite(c)} w={4} o={0.7} />
        <Ln d={cuffs(g, 0.208, 42)} s={lite(c)} w={4} o={0.8} />
        <Ln d="M 105 289 Q 150 299 195 289" s={dark(c)} w={9} />
        <path d="M 150 294 L 135 283 L 135 305 Z M 150 294 L 165 283 L 165 305 Z" fill={dark(c)} stroke={edge(c)} strokeWidth={2} strokeLinejoin="round" />
        <Dot x={150} y={294} r={5} fill={dark(c)} s={edge(c)} />
      </>
    ),
  },
  coat: {
    shapes: [COAT_L, flip(COAT_L), ...sleeves(g, 0.917, 40, 40)],
    back: [COAT_LINING],
    details: (c) => (
      <>
        <path d={LAPEL_L} fill={dark(c)} stroke={edge(c)} strokeWidth={2.5} strokeLinejoin="round" />
        <path d={flip(LAPEL_L)} fill={dark(c)} stroke={edge(c)} strokeWidth={2.5} strokeLinejoin="round" />
        <Dot x={177} y={300} r={5.5} fill={dark(c)} s={edge(c)} />
        <Dot x={177} y={344} r={5.5} fill={dark(c)} s={edge(c)} />
        <Dot x={177} y={388} r={5.5} fill={dark(c)} s={edge(c)} />
        <Ln d="M 93 386 L 119 388 M 207 386 L 181 388" s={edge(c)} w={4} />
        <Ln d={cuffs(g, 0.819, 40)} s={edge(c)} o={0.55} />
      </>
    ),
  },
  jacket: {
    shapes: [JACKET, ...sleeves(g, 0.903, 44, 42), COLLAR_L, flip(COLLAR_L)],
    back: [COLLAR_BACK],
    details: (c) => (
      <>
        <Ln d="M 99 246 Q 150 254 201 246 M 98 278 Q 150 286 202 278 M 97 310 Q 150 318 203 310" s={edge(c)} o={0.45} />
        <Ln d="M 106 238 Q 126 243 144 242 M 106 270 Q 126 275 144 274 M 105 302 Q 125 307 144 306" s={lite(c)} w={4} o={0.55} />
        <Ln d={`${cuffs(g, 0.347, 44)} ${cuffs(g, 0.611, 43)}`} s={edge(c)} o={0.45} />
        <Ln d={cuffs(g, 0.833, 42)} s={edge(c)} o={0.6} />
        <Ln d="M 96 340 C 130 349 170 349 204 340" s={edge(c)} o={0.5} />
        <Ln d="M 150 214 L 150 356" s={edge(c)} />
        <path d="M 146.5 222 L 153.5 222 L 153.5 240 L 146.5 240 Z" fill={lite(c)} stroke={edge(c)} strokeWidth={2} />
      </>
    ),
  },
  trousers: {
    shapes: [TROUSERS],
    details: (c) => (
      <>
        <Ln d="M 98 342 L 202 342" s={edge(c)} />
        <Ln d="M 119 352 L 118 528 M 181 352 L 182 528" s={lite(c)} o={0.6} />
        <Ln d="M 150 342 L 150 384" s={edge(c)} o={0.7} />
        <Ln d="M 101 350 L 112 372 M 199 350 L 188 372" s={edge(c)} w={2.5} o={0.5} />
      </>
    ),
  },
  jeans: {
    shapes: [TROUSERS],
    details: (c) => <JeansStitch c={c} />,
  },
  skirt: {
    shapes: [SKIRT],
    details: (c) => (
      <>
        <Ln d="M 104 340 L 196 340" s={edge(c)} />
        <Ln d="M 127 342 L 114 437 M 150 342 L 150 442 M 173 342 L 186 437" s={edge(c)} o={0.4} />
        <Ln d="M 82 426 C 128 438 172 438 218 426" s={lite(c)} w={4} o={0.6} />
        <Dot x={188} y={333} r={4} fill={lite(c)} s={edge(c)} />
      </>
    ),
  },
  trainers: {
    shapes: [SHOE_L, flip(SHOE_L)],
    soles: [SOLE_L, flip(SOLE_L)],
    details: (c) => (
      <>
        <Ln d="M 78 548 L 150 548 M 150 548 L 222 548" s={edge(c)} w={2.5} />
        <Ln d="M 89 545 Q 110 544 131 534 M 211 545 Q 190 544 169 534" s={lite(c)} w={5} />
        <Ln d="M 113 530 L 119 538 M 122 528 L 128 536 M 131 527 L 137 535" s="#ffffff" w={3} />
        <Ln d="M 187 530 L 181 538 M 178 528 L 172 536 M 169 527 L 163 535" s="#ffffff" w={3} />
      </>
    ),
  },
  shoes: {
    shapes: [SHOE_L, flip(SHOE_L)],
    soles: [SOLE_L, flip(SOLE_L)],
    details: (c) => (
      <>
        <Ln d="M 78 548 L 150 548 M 150 548 L 222 548" s={edge(c)} w={2.5} />
        <Ln d="M 106 531 L 139 537 M 194 531 L 161 537" s={edge(c)} w={4} />
        <Ln d="M 88 541 Q 96 535 104 533 M 212 541 Q 204 535 196 533" s="#ffffff" w={4} o={0.45} />
      </>
    ),
  },
});
const SPECS = makeSpecs(DOLL_ARM);
const FLAT = makeSpecs(FLAT_ARM);

const GarmentBack = ({ w, flat = false }: { w: Wear; flat?: boolean }) => {
  const spec = (flat ? FLAT : SPECS)[w.k];
  if (!spec.back) return null;
  const c = fillOf(w);
  return (
    <g>
      {spec.back.map((d, i) => (
        <path key={i} d={d} fill={mix(c, OUTLINE, 0.42)} stroke={edge(c)} strokeWidth={5} strokeLinejoin="round" />
      ))}
    </g>
  );
};

const GarmentFront = ({ w, glow = false, flat = false }: { w: Wear; glow?: boolean; flat?: boolean }) => {
  const spec = (flat ? FLAT : SPECS)[w.k];
  const c = fillOf(w);
  const id = useSvgId();
  const ol = edge(c);
  const all = [...spec.shapes, ...(spec.soles ?? [])];
  return (
    <g className={glow ? 'mmc-throb' : undefined}>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={70} y1={0} x2={235} y2={0}>
          <stop offset={0} stopColor={mix(c, '#ffffff', 0.16)} />
          <stop offset={0.5} stopColor={c} />
          <stop offset={1} stopColor={mix(c, OUTLINE, 0.18)} />
        </linearGradient>
      </defs>
      {glow ? (
        <g className="mmc-halo">
          {all.map((d, i) => (
            <path key={i} d={d} fill={STRONG.yellow} stroke={STRONG.yellow} strokeWidth={26} strokeLinejoin="round" />
          ))}
        </g>
      ) : null}
      {all.map((d, i) => (
        <path key={`o${i}`} d={d} fill={ol} stroke={ol} strokeWidth={8} strokeLinejoin="round" />
      ))}
      {spec.shapes.map((d, i) => (
        <path key={`f${i}`} d={d} fill={`url(#${id})`} />
      ))}
      {spec.soles?.map((d, i) => (
        <path key={`s${i}`} d={d} fill={w.k === 'shoes' ? mix(c, OUTLINE, 0.45) : '#fbfbf6'} />
      ))}
      {spec.details?.(c)}
    </g>
  );
};

// Standalone garment for flashcards (cropped to the garment, sticker outline).
const GBOX: Record<GKind, string> = {
  tshirt: '62 182 176 176',
  shirt: '32 176 236 182',
  pullover: '32 176 236 182',
  dress: '44 182 212 284',
  coat: '28 182 244 284',
  jacket: '28 174 244 196',
  trousers: '70 318 160 224',
  jeans: '70 318 160 224',
  skirt: '64 316 172 140',
  trainers: '70 518 160 52',
  shoes: '70 518 160 52',
};
const Garment = ({ w, size, style }: { w: Wear; size: number; style?: CSSProperties }) => (
  <svg
    viewBox={GBOX[w.k]}
    width={size}
    height={size}
    aria-hidden
    style={{ display: 'block', overflow: 'visible', filter: STICKER, flex: 'none', ...style }}
  >
    <GarmentBack w={w} flat />
    <GarmentFront w={w} flat />
  </svg>
);

// ─── Children (SVG dolls) ───────────────────────────────────────────────────
type Hair = 'short' | 'spiky' | 'curly' | 'long' | 'bob' | 'ponytails' | 'bun';
type Kid = {
  skin: string;
  hair: Hair;
  hairColor: string;
  glasses?: boolean;
  top?: Wear;
  bottom?: Wear;
  outer?: Wear;
  shoes?: Wear;
  socks?: string;
};
const SKIN = ['#fcd9bf', '#f1c09b', '#d99c6e', '#a86a40'];
const HAIR = { black: '#2a2126', dark: '#4a2e20', brown: '#7c4a25', blond: '#e6b44a', ginger: '#c4602b' };

const LONG_FRONT =
  'M 76 136 C 66 66 104 38 150 38 C 196 38 234 66 224 136 C 218 112 208 100 198 94 C 172 104 160 92 150 80 C 140 92 128 104 102 96 C 92 104 82 118 76 136 Z';
const CURLS = (() => {
  const out = ['M 80 124 C 74 64 108 44 150 44 C 192 44 226 64 220 124 C 200 100 100 100 80 124 Z'];
  for (let i = 0; i <= 8; i++) {
    const a = Math.PI * (1.08 + (0.84 * i) / 8);
    out.push(circ(f1(150 + 74 * Math.cos(a)), f1(108 + 64 * Math.sin(a)), 23));
  }
  out.push(circ(122, 84, 18), circ(150, 80, 19), circ(178, 84, 18));
  return out;
})();
const HAIR_SHAPES: Record<Hair, { back?: string[]; front: string[] }> = {
  short: {
    front: [
      'M 78 128 C 70 70 104 40 150 40 C 196 40 230 70 222 128 C 214 108 204 96 192 90 C 176 100 150 104 128 96 C 110 100 92 108 78 128 Z',
    ],
  },
  spiky: {
    front: [
      'M 78 126 C 72 72 102 42 150 40 C 198 42 228 72 222 126 L 210 104 L 198 112 L 190 92 L 174 104 L 162 86 L 148 102 L 134 88 L 122 106 L 108 96 L 96 112 Z',
    ],
  },
  curly: { front: CURLS },
  long: {
    back: ['M 72 120 C 66 50 106 34 150 34 C 194 34 234 50 228 120 L 236 268 C 196 284 104 284 64 268 Z'],
    front: [LONG_FRONT],
  },
  bob: {
    back: ['M 70 120 C 64 52 106 36 150 36 C 194 36 236 52 230 120 L 232 196 C 200 206 100 206 68 196 Z'],
    front: [
      'M 76 132 C 68 64 104 38 150 38 C 196 38 232 64 224 132 C 220 116 214 104 208 98 Q 179 108 150 98 Q 121 108 92 98 C 86 104 80 116 76 132 Z',
    ],
  },
  ponytails: { back: [ell(62, 178, 22, 46), ell(238, 178, 22, 46)], front: [LONG_FRONT] },
  bun: {
    back: [circ(150, 40, 30)],
    front: [
      'M 78 130 C 70 66 106 40 150 40 C 194 40 230 66 222 130 C 214 108 196 92 170 88 C 158 92 142 92 130 88 C 104 92 86 108 78 130 Z',
    ],
  },
};

const Blob = ({ ds, fill, stroke, sw = 8 }: { ds: string[]; fill: string; stroke: string; sw?: number }) => (
  <g>
    {ds.map((d, i) => (
      <path key={`o${i}`} d={d} fill={stroke} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
    ))}
    {ds.map((d, i) => (
      <path key={`f${i}`} d={d} fill={fill} />
    ))}
  </g>
);
const Limbs = ({ ds, color, stroke, w }: { ds: string[]; color: string; stroke: string; w: number }) => (
  <g fill="none" strokeLinecap="round">
    {ds.map((d, i) => (
      <path key={`o${i}`} d={d} stroke={stroke} strokeWidth={w + 8} />
    ))}
    {ds.map((d, i) => (
      <path key={`f${i}`} d={d} stroke={color} strokeWidth={w} />
    ))}
  </g>
);

const skinEdge = (s: string) => mix(s, '#4a2a1e', 0.55);
const EYE = '#2a2340';

const Head = ({ kid }: { kid: Kid }) => {
  const se = skinEdge(kid.skin);
  const he = mix(kid.hairColor, OUTLINE, 0.45);
  return (
    <g>
      <Blob ds={[circ(150, 118, 70), circ(80, 126, 14), circ(220, 126, 14)]} fill={kid.skin} stroke={se} />
      <Ln d="M 76 120 Q 86 126 79 134 M 224 120 Q 214 126 221 134" s={se} o={0.6} />
      <ellipse cx={108} cy={150} rx={12} ry={7} fill="#ff6f86" opacity={0.32} />
      <ellipse cx={192} cy={150} rx={12} ry={7} fill="#ff6f86" opacity={0.32} />
      <ellipse cx={124} cy={128} rx={8.5} ry={11} fill={EYE} />
      <ellipse cx={176} cy={128} rx={8.5} ry={11} fill={EYE} />
      <circle cx={127} cy={123} r={3.2} fill="#fff" />
      <circle cx={179} cy={123} r={3.2} fill="#fff" />
      <Ln d="M 145 141 Q 150 145 155 141" s={se} />
      <path d="M 134 155 Q 150 173 166 155 Z" fill="#8c2f39" stroke="#8c2f39" strokeWidth={3} strokeLinejoin="round" />
      <ellipse cx={150} cy={163.5} rx={6.5} ry={3.2} fill="#ff8a95" />
      <Blob ds={HAIR_SHAPES[kid.hair].front} fill={kid.hairColor} stroke={he} sw={7} />
      <Ln d="M 114 64 Q 130 54 150 52" s="#ffffff" w={6} o={0.3} />
      <Ln d="M 113 106 Q 124 100 135 105 M 187 106 Q 176 100 165 105" s={he} w={4.5} />
      {kid.hair === 'ponytails' ? (
        <>
          <Dot x={70} y={136} r={7} fill={STRONG.pink} s={edge(STRONG.pink)} />
          <Dot x={230} y={136} r={7} fill={STRONG.pink} s={edge(STRONG.pink)} />
        </>
      ) : null}
      {kid.glasses ? (
        <g fill="none" stroke={EYE} strokeWidth={4.5} strokeLinecap="round">
          <circle cx={124} cy={128} r={19} fill="#ffffff" fillOpacity={0.18} />
          <circle cx={176} cy={128} r={19} fill="#ffffff" fillOpacity={0.18} />
          <path d="M 143 125 Q 150 120 157 125 M 105 124 L 86 120 M 195 124 L 214 120" />
        </g>
      ) : null}
    </g>
  );
};

const Doll = ({
  kid,
  h,
  glow = null,
  bust = false,
  x,
  y,
}: {
  kid: Kid;
  h: number;
  glow?: GKind | null;
  bust?: boolean;
  x?: number;
  y?: number;
}) => {
  const vb = bust ? [30, 18, 240, 330] : [24, 14, 252, 568];
  const se = skinEdge(kid.skin);
  const hs = HAIR_SHAPES[kid.hair];
  const lit = (w?: Wear) => !!w && glow === w.k;
  return (
    <svg
      x={x}
      y={y}
      width={f1((h * vb[2]) / vb[3])}
      height={h}
      viewBox={vb.join(' ')}
      aria-hidden
      style={{ display: 'block', overflow: bust ? 'hidden' : 'visible', flex: 'none' }}
    >
      {hs.back ? <Blob ds={hs.back} fill={kid.hairColor} stroke={mix(kid.hairColor, OUTLINE, 0.45)} sw={7} /> : null}
      {kid.outer ? <GarmentBack w={kid.outer} /> : null}
      <Limbs ds={['M 124 336 L 122 540', 'M 176 336 L 178 540']} color={kid.skin} stroke={se} w={30} />
      {kid.socks ? (
        <Limbs ds={['M 123 502 L 122 536', 'M 177 502 L 178 536']} color={kid.socks} stroke={edge(kid.socks)} w={32} />
      ) : null}
      {kid.shoes ? <GarmentFront w={kid.shoes} glow={lit(kid.shoes)} /> : null}
      {kid.bottom ? <GarmentFront w={kid.bottom} glow={lit(kid.bottom)} /> : null}
      <Limbs ds={['M 116 214 L 87 352', 'M 184 214 L 213 352']} color={kid.skin} stroke={se} w={26} />
      {kid.top ? <GarmentBack w={kid.top} /> : null}
      <Blob ds={['M 137 168 L 163 168 L 164 214 L 136 214 Z']} fill={kid.skin} stroke={se} />
      {kid.top ? <GarmentFront w={kid.top} glow={lit(kid.top)} /> : null}
      {kid.outer ? <GarmentFront w={kid.outer} glow={lit(kid.outer)} /> : null}
      <Blob ds={[circ(85, 362, 15.5), circ(215, 362, 15.5)]} fill={kid.skin} stroke={se} />
      <Head kid={kid} />
    </svg>
  );
};

const outfitOf = (k: Kid) => [k.outer, k.top, k.bottom, k.shoes].filter((w): w is Wear => !!w);
const describe = (k: Kid, who: string) => `${who} wearing ${listJoin(outfitOf(k).map(phrase))}.`;

// ─── The class ──────────────────────────────────────────────────────────────
const KATE: Kid = {
  skin: SKIN[0],
  hair: 'bob',
  hairColor: HAIR.brown,
  outer: { k: 'coat', c: 'brown' },
  top: { k: 'pullover', c: 'yellow' },
  bottom: { k: 'trousers', c: 'blue' },
  shoes: { k: 'trainers', c: 'red' },
};
const LIWA: Kid = {
  skin: SKIN[1],
  hair: 'short',
  hairColor: HAIR.black,
  glasses: true,
  top: { k: 'shirt', c: 'white' },
  bottom: { k: 'trousers', c: 'grey' },
  shoes: { k: 'shoes', c: 'black' },
};
const IHEB: Kid = {
  skin: SKIN[2],
  hair: 'curly',
  hairColor: HAIR.dark,
  top: { k: 'tshirt', c: 'green' },
  bottom: { k: 'jeans', c: 'blue' },
  shoes: { k: 'trainers', c: 'orange' },
};
const AHMED: Kid = {
  skin: SKIN[2],
  hair: 'short',
  hairColor: HAIR.black,
  outer: { k: 'coat', c: 'yellow' },
  top: { k: 'tshirt', c: 'white' },
  bottom: { k: 'jeans', c: 'black' },
  shoes: { k: 'trainers', c: 'blue' },
};
const AMY: Kid = {
  skin: SKIN[0],
  hair: 'long',
  hairColor: HAIR.blond,
  top: { k: 'dress', c: 'purple' },
  socks: '#ffffff',
  shoes: { k: 'shoes', c: 'pink' },
};
const SARRA: Kid = {
  skin: SKIN[1],
  hair: 'ponytails',
  hairColor: HAIR.black,
  top: { k: 'tshirt', c: 'yellow' },
  bottom: { k: 'skirt', c: 'pink' },
  socks: '#ffffff',
  shoes: { k: 'trainers', c: 'white' },
};
const SAMI: Kid = {
  skin: SKIN[1],
  hair: 'spiky',
  hairColor: HAIR.dark,
  top: { k: 'pullover', c: 'red' },
  bottom: { k: 'jeans', c: 'blue' },
  shoes: { k: 'trainers', c: 'white' },
};
const LINA: Kid = {
  skin: SKIN[3],
  hair: 'bun',
  hairColor: HAIR.black,
  top: { k: 'shirt', c: 'white' },
  bottom: { k: 'skirt', c: 'red' },
  socks: '#ffffff',
  shoes: { k: 'shoes', c: 'blue' },
};
const ADAM: Kid = {
  skin: SKIN[0],
  hair: 'short',
  hairColor: HAIR.brown,
  top: { k: 'tshirt', c: 'yellow' },
  bottom: { k: 'jeans', c: 'blue' },
  shoes: { k: 'shoes', c: 'green' },
};

// ─── Shared bits for pages ──────────────────────────────────────────────────
const card = (tone: Tone, extra?: CSSProperties): CSSProperties => ({
  background: '#fff',
  borderRadius: 32,
  boxShadow: `0 8px 0 ${SOFT[tone]}, 0 18px 30px -20px rgba(34, 48, 90, 0.4)`,
  ...extra,
});

// Plays a list of words one after the other ("Play all"), stops when the page is left.
const usePlayAll = (words: string[], gap = 2600) => {
  const live = useIsActivePage();
  const [on, setOn] = useState(false);
  const [i, setI] = useState(-1);
  useEffect(() => {
    if (!on || !live) return;
    let k = 0;
    const tick = () => {
      if (k >= words.length) {
        setOn(false);
        setI(-1);
        return;
      }
      setI(k);
      say(words[k]);
      k += 1;
    };
    tick();
    const id = window.setInterval(tick, gap);
    return () => window.clearInterval(id);
  }, [on, live, words, gap]);
  useEffect(() => {
    if (!live) {
      setOn(false);
      setI(-1);
    }
  }, [live]);
  const toggle = () => {
    if (on) {
      hush();
      setI(-1);
    }
    setOn(!on);
  };
  return { on, i, toggle, setI };
};

const PlayAll = ({ on, toggle, tone }: { on: boolean; toggle: () => void; tone: Tone }) => (
  <div className="mmc-pop" style={{ ...vars({ d: '300ms' }), marginTop: 30 }}>
    <Btn tone={tone} onClick={toggle} size={30}>
      {on ? (
        <svg width={26} height={26} viewBox="0 0 24 24" aria-hidden>
          <rect x={5} y={5} width={14} height={14} rx={3} fill="currentColor" />
        </svg>
      ) : (
        <svg width={26} height={26} viewBox="0 0 24 24" aria-hidden>
          <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
        </svg>
      )}
      {on ? 'Stop' : 'Play all'}
    </Btn>
  </div>
);

// ─── 01 · Cover ─────────────────────────────────────────────────────────────
const RAINBOW: Tone[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];
const RainbowWord = ({ text }: { text: string }) => (
  <span>
    {text.split('').map((ch, i) => (
      <span
        key={i}
        style={{
          display: 'inline-block',
          color: STRONG[RAINBOW[i % RAINBOW.length]],
          textShadow: `0 6px 0 ${DEEP[RAINBOW[i % RAINBOW.length]]}`,
          transform: `rotate(${i % 2 ? 3 : -3}deg)`,
        }}
      >
        {ch}
      </span>
    ))}
  </span>
);

const Cover: Page = () => (
  <Shell footer={false}>
    <div style={{ position: 'absolute', left: PAD, top: 210, width: 960 }}>
      <Anim kind="drop">
        <Tag tone="red">Lesson 4</Tag>
      </Anim>
      <h1
        className="mmc-rise"
        style={{
          ...vars({ d: '120ms' }),
          fontFamily: display,
          fontWeight: 700,
          fontSize: 'var(--osd-size-hero)',
          lineHeight: 1.02,
          margin: '28px 0 0',
          color: 'var(--osd-text)',
        }}
      >
        Meet my
        <br />
        <RainbowWord text="classmates" />
      </h1>
      <div
        className="mmc-rise"
        style={{ ...vars({ d: '260ms' }), fontFamily: display, fontWeight: 500, fontSize: 42, color: C.soft, marginTop: 34 }}
      >
        English · 5th grade
      </div>
      <Anim kind="pop" d={520} style={{ marginTop: 44, display: 'inline-block' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            background: '#fff',
            borderRadius: 999,
            padding: '12px 36px 12px 18px',
            boxShadow: `0 7px 0 ${SOFT.yellow}`,
          }}
        >
          <Anim kind="sway" t={1600}>
            <Sticker src={imgWave} size={76} />
          </Anim>
          <span style={{ fontFamily: display, fontWeight: 600, fontSize: 46 }}>Hello, friends!</span>
        </div>
      </Anim>
    </div>

    <div
      style={{
        position: 'absolute',
        right: 120,
        bottom: 96,
        width: 740,
        height: 60,
        borderRadius: '50%',
        background: 'rgba(34, 48, 90, 0.09)',
      }}
    />
    <div style={{ position: 'absolute', right: 140, bottom: 110, display: 'flex', alignItems: 'flex-end' }}>
      <Anim kind="rise" d={300} style={{ marginRight: -30 }}>
        <Doll kid={LIWA} h={540} />
      </Anim>
      <Anim kind="rise" d={420} style={{ position: 'relative', zIndex: 2 }}>
        <Doll kid={KATE} h={600} />
      </Anim>
      <Anim kind="rise" d={540} style={{ marginLeft: -30 }}>
        <Doll kid={IHEB} h={540} />
      </Anim>
    </div>

    <Anim kind="pop" d={700} style={{ position: 'absolute', right: 120, top: 110 }}>
      <Anim kind="bob" d={700}>
        <Sticker src={imgStar} size={120} rot={12} />
      </Anim>
    </Anim>
    <Anim kind="pop" d={800} style={{ position: 'absolute', left: 1040, top: 300 }}>
      <Anim kind="bob" d={1200} t={4200}>
        <Sticker src={imgSparkles} size={92} />
      </Anim>
    </Anim>
    <Anim kind="pop" d={900} style={{ position: 'absolute', right: 560, top: 130 }}>
      <Anim kind="bob" d={300} t={3900}>
        <Sticker src={imgPencil} size={96} rot={-24} />
      </Anim>
    </Anim>
    <Anim kind="pop" d={1000} style={{ position: 'absolute', right: 96, bottom: 120 }}>
      <Sticker src={imgBackpack} size={124} rot={8} />
    </Anim>
  </Shell>
);
Cover.transition = {
  duration: 280,
  exit: { duration: 280, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: {
    duration: 280,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(12px)', filter: 'blur(4px)' },
      { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
    ],
  },
};

// ─── 02 · Objectives ────────────────────────────────────────────────────────
const ObjCard = ({
  n,
  tone,
  title,
  example,
  d,
  children,
}: {
  n: number;
  tone: Tone;
  title: string;
  example: ReactNode;
  d: number;
  children: ReactNode;
}) => (
  <Anim kind="rise" d={d} style={{ flex: 1 }}>
    <div style={card(tone, { position: 'relative', padding: '40px 40px 38px', height: 530 })}>
      <div
        style={{
          position: 'absolute',
          left: -18,
          top: -22,
          width: 76,
          height: 76,
          borderRadius: '50%',
          background: STRONG[tone],
          color: onTone(tone),
          display: 'grid',
          placeItems: 'center',
          fontFamily: display,
          fontWeight: 700,
          fontSize: 44,
          boxShadow: `0 5px 0 ${DEEP[tone]}`,
          transform: 'rotate(-6deg)',
        }}
      >
        {n}
      </div>
      <div
        style={{
          height: 220,
          borderRadius: 26,
          background: SOFT[tone],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {children}
      </div>
      <div style={{ fontFamily: display, fontWeight: 600, fontSize: 46, lineHeight: 1.12, marginTop: 30, height: 104 }}>
        {title}
      </div>
      <div
        style={{
          marginTop: 22,
          fontSize: 30,
          fontStyle: 'italic',
          fontWeight: 700,
          lineHeight: 1.35,
          color: DEEP[tone],
          background: C.paper,
          borderRadius: 18,
          padding: '14px 20px',
        }}
      >
        {example}
      </div>
    </div>
  </Anim>
);

const Objectives: Page = () => (
  <Shell
    tag="Today"
    tone="green"
    title="Today I will learn to…"
    right={
      <Anim kind="pop" d={300}>
        <Anim kind="bob">
          <Sticker src={imgBulb} size={120} rot={10} />
        </Anim>
      </Anim>
    }
  >
    <Area style={{ display: 'flex', gap: 56, paddingTop: 44 }}>
      <ObjCard n={1} tone="blue" title="introduce a classmate" example="“This is my friend Sami.”" d={150}>
        <Doll kid={SAMI} h={200} bust />
        <Sticker src={imgWave} size={92} rot={-10} />
        <Doll kid={SARRA} h={200} bust />
      </ObjCard>
      <ObjCard n={2} tone="orange" title="describe a classmate" example="“He is wearing a yellow coat.”" d={300}>
        <Doll kid={AHMED} h={200} bust />
        <Sticker src={imgMagnifier} size={110} rot={-14} />
      </ObjCard>
      <ObjCard n={3} tone="pink" title="name clothes" example="jeans · T-shirt · dress · coat" d={450}>
        <Garment w={{ k: 'tshirt', c: 'green' }} size={150} />
        <Garment w={{ k: 'jeans', c: 'blue' }} size={150} />
        <Garment w={{ k: 'dress', c: 'purple' }} size={150} />
      </ObjCard>
    </Area>
  </Shell>
);

// ─── 03 · Song (Activity 1) ─────────────────────────────────────────────────
const SONG_I: Kid = { ...IHEB };
const SONG_HE: Kid = {
  skin: SKIN[0],
  hair: 'spiky',
  hairColor: HAIR.ginger,
  outer: { k: 'jacket', c: 'blue' },
  bottom: { k: 'trousers', c: 'grey' },
  shoes: { k: 'trainers', c: 'red' },
};
const SONG_SHE: Kid = {
  skin: SKIN[2],
  hair: 'long',
  hairColor: HAIR.dark,
  top: { k: 'dress', c: 'red' },
  outer: { k: 'coat', c: 'blue' },
  socks: '#ffffff',
  shoes: { k: 'shoes', c: 'black' },
};

const LyricLine = ({ text, tone, on, onClick }: { text: string; tone: Tone; on: boolean; onClick: () => void }) => (
  <button
    type="button"
    data-osd-interactive
    className="mmc-btn"
    onClick={(e) => {
      e.currentTarget.blur();
      onClick();
    }}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      width: '100%',
      height: 58,
      padding: '0 12px 0 20px',
      border: 'none',
      borderRadius: 16,
      background: on ? STRONG[tone] : C.paper,
      color: on ? onTone(tone) : C.ink,
      fontFamily: body,
      fontWeight: 800,
      fontSize: 29,
      cursor: 'pointer',
      textAlign: 'left',
      whiteSpace: 'nowrap',
    }}
  >
    <span>{text}</span>
    <span
      style={{
        fontFamily: display,
        fontWeight: 600,
        fontSize: 22,
        padding: '4px 10px',
        borderRadius: 999,
        background: on ? 'rgba(255,255,255,0.3)' : SOFT[tone],
        color: on ? onTone(tone) : DEEP[tone],
      }}
    >
      ×2
    </span>
  </button>
);

const VerseCard = ({ n, who, tone, kid, lines }: { n: number; who: string; tone: Tone; kid: Kid; lines: string[] }) => {
  const [on, setOn] = useState(-1);
  const pick = (i: number) => {
    setOn(i);
    say(lines[i]);
  };
  return (
    <div style={card(tone, { width: 536, padding: 26 })}>
      <div
        style={{
          position: 'relative',
          height: 300,
          borderRadius: 24,
          background: SOFT[tone],
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
      >
        <Doll kid={kid} h={286} />
        <div style={{ position: 'absolute', left: 18, top: 16 }}>
          <Tag tone={tone}>Verse {n}</Tag>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 18,
            top: 14,
            fontFamily: display,
            fontWeight: 700,
            fontSize: 54,
            color: DEEP[tone],
          }}
        >
          {who}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 18 }}>
        <LyricLine text={lines[0]} tone={tone} on={on === 0} onClick={() => pick(0)} />
        <LyricLine text={lines[1]} tone={tone} on={on === 1} onClick={() => pick(1)} />
        <LyricLine text={lines[2]} tone={tone} on={on === 2} onClick={() => pick(2)} />
        <LyricLine text={lines[3]} tone={tone} on={on === 3} onClick={() => pick(3)} />
      </div>
    </div>
  );
};

const Song: Page = () => (
  <Shell
    tag="Activity 1"
    tone="purple"
    title="Let’s sing!"
    right={
      <Anim kind="pop" d={250}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            background: '#fff',
            borderRadius: 999,
            padding: '10px 30px 10px 14px',
            boxShadow: `0 6px 0 ${SOFT.purple}`,
            marginTop: 30,
          }}
        >
          <Anim kind="sway" t={2400}>
            <Sticker src={imgNotes} size={70} />
          </Anim>
          <span style={{ fontFamily: display, fontWeight: 600, fontSize: 32, color: C.soft }}>
            Tune: <span style={{ color: DEEP.purple }}>Listening</span>
          </span>
        </div>
      </Anim>
    }
  >
    <Area style={{ display: 'flex', alignItems: 'flex-start', gap: 46, top: 250 }}>
      <Steps>
        <VerseCard
          n={1}
          who="I"
          tone="green"
          kid={SONG_I}
          lines={['What are you wearing?', 'Tell me, please!', 'I’m wearing a T-shirt', 'and blue jeans!']}
        />
        <Step duration={260}>
          <VerseCard
            n={2}
            who="He"
            tone="blue"
            kid={SONG_HE}
            lines={['What is he wearing?', 'Tell me, please!', 'He’s wearing a jacket', 'and trainers!']}
          />
        </Step>
        <Step duration={260}>
          <VerseCard
            n={3}
            who="She"
            tone="red"
            kid={SONG_SHE}
            lines={['What is she wearing?', 'Tell me, please!', 'She’s wearing a red dress', 'and a coat!']}
          />
        </Step>
      </Steps>
    </Area>
  </Shell>
);

// ─── 04 · Look at the picture (Activity 2) ──────────────────────────────────
type CountMode = 'pupils' | 'boys' | 'girls' | null;
// Reading order: back row left → right, then front row.
const BOYS_ORDER = [1, 2, 4, 6];
const GIRLS_ORDER = [0, 3, 5];
const NUMBERS = ['One', 'two', 'three', 'four', 'five', 'six', 'seven'];

const Desk = ({ x, y, w }: { x: number; y: number; w: number }) => (
  <g>
    <rect x={x + 14} y={y + 20} width={w - 28} height={62} fill="#b0743b" stroke="#7a4a22" strokeWidth={5} />
    <rect x={x} y={y} width={w} height={24} rx={9} fill="#d0935a" stroke="#7a4a22" strokeWidth={5} />
  </g>
);

const Pupil = ({
  kid,
  x,
  y,
  h,
  n,
  dim,
  label,
  mode,
}: {
  kid: Kid;
  x: number;
  y: number;
  h: number;
  n: number;
  dim: boolean;
  label?: string;
  mode: CountMode;
}) => {
  const w = (h * 240) / 330;
  return (
    <g style={{ opacity: dim ? 0.3 : 1, transition: 'opacity 300ms ease' }}>
      <Doll kid={kid} h={h} bust x={x} y={y} />
      {label ? (
        <g>
          <rect x={x + w / 2 - 58} y={y - 44} width={116} height={44} rx={22} fill="#fff" stroke={C.ink} strokeWidth={3} />
          <text
            x={x + w / 2}
            y={y - 13}
            textAnchor="middle"
            style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 600, fontSize: 27, fill: C.ink }}
          >
            {label}
          </text>
        </g>
      ) : null}
      {n ? (
        <g key={`${mode}-${n}`} className="mmc-badge" style={vars({ d: `${(n - 1) * 650}ms` })}>
          <circle cx={x + w * 0.86} cy={y + 34} r={30} fill={STRONG.red} stroke="#fff" strokeWidth={6} />
          <text
            x={x + w * 0.86}
            y={y + 46}
            textAnchor="middle"
            style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 700, fontSize: 34, fill: '#fff' }}
          >
            {n}
          </text>
        </g>
      ) : null}
    </g>
  );
};

const Classroom = ({ mode }: { mode: CountMode }) => {
  const clip = useSvgId();
  const num = (i: number) =>
    mode === 'pupils' ? i + 1 : mode === 'boys' ? BOYS_ORDER.indexOf(i) + 1 : mode === 'girls' ? GIRLS_ORDER.indexOf(i) + 1 : 0;
  const pupil = (i: number) => ({ n: num(i), dim: mode !== null && num(i) === 0, mode });
  return (
    <svg viewBox="0 0 1000 640" width={1000} height={640} style={{ display: 'block', filter: STICKER }} aria-hidden>
      <defs>
        <clipPath id={clip}>
          <rect x={0} y={0} width={1000} height={640} rx={40} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect x={0} y={0} width={1000} height={430} fill="#fde7b3" />
        <rect x={0} y={398} width={1000} height={32} fill="#f6cf86" />
        <rect x={0} y={430} width={1000} height={210} fill="#e9b779" />
        <Ln d="M 0 488 L 1000 488 M 0 548 L 1000 548 M 0 608 L 1000 608" s="#d39e5f" />
        {/* window */}
        <rect x={40} y={40} width={170} height={160} rx={14} fill="#fff" stroke="#c9a36a" strokeWidth={5} />
        <rect x={54} y={54} width={142} height={132} rx={6} fill="#bfe7ff" />
        <circle cx={168} cy={84} r={17} fill="#ffd23a" />
        <path d={`${ell(96, 100, 26, 14)} ${ell(118, 92, 20, 14)}`} fill="#fff" />
        <Ln d="M 125 54 L 125 186 M 54 120 L 196 120" s="#fff" w={8} />
        {/* board */}
        <rect x={300} y={30} width={400} height={124} rx={12} fill="#b5824a" />
        <rect x={312} y={42} width={376} height={100} rx={6} fill="#2f6b4f" />
        <text
          x={500}
          y={106}
          textAnchor="middle"
          style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 500, fontSize: 40, fill: '#ffffff', opacity: 0.92 }}
        >
          Hello, class!
        </text>
        {/* clock */}
        <circle cx={790} cy={90} r={40} fill="#fff" stroke={STRONG.red} strokeWidth={8} />
        <Ln d="M 790 90 L 790 64 M 790 90 L 810 100" s={C.ink} w={5} />
        <circle cx={790} cy={90} r={5} fill={C.ink} />
        {/* bookshelf */}
        <rect x={858} y={164} width={124} height={266} rx={6} fill="#a86d3a" />
        <rect x={868} y={176} width={104} height={70} fill="#7b4a22" />
        <rect x={868} y={258} width={104} height={70} fill="#7b4a22" />
        <rect x={868} y={340} width={104} height={78} fill="#7b4a22" />
        <rect x={874} y={196} width={14} height={50} fill={STRONG.red} />
        <rect x={890} y={186} width={12} height={60} fill={STRONG.blue} />
        <rect x={904} y={202} width={16} height={44} fill={STRONG.yellow} />
        <rect x={922} y={190} width={12} height={56} fill={STRONG.green} />
        <rect x={938} y={198} width={14} height={48} fill={STRONG.purple} />
        <rect x={874} y={272} width={16} height={56} fill={STRONG.orange} />
        <rect x={892} y={266} width={12} height={62} fill={STRONG.teal} />
        <rect x={906} y={280} width={18} height={48} fill={STRONG.pink} />
        <rect x={928} y={270} width={12} height={58} fill={STRONG.blue} />
        <rect x={944} y={276} width={14} height={52} fill={STRONG.red} />
        {/* back row */}
        <Pupil kid={SARRA} x={74} y={196} h={210} {...pupil(0)} />
        <Pupil kid={LIWA} x={294} y={196} h={210} label="Liwa" {...pupil(1)} />
        <Pupil kid={IHEB} x={514} y={196} h={210} label="Iheb" {...pupil(2)} />
        <Pupil kid={AMY} x={734} y={196} h={210} {...pupil(3)} />
        <Desk x={60} y={372} w={180} />
        <Desk x={280} y={372} w={180} />
        <Desk x={500} y={372} w={180} />
        <Desk x={720} y={372} w={180} />
        {/* front row */}
        <Pupil kid={SAMI} x={173} y={352} h={240} {...pupil(4)} />
        <Pupil kid={LINA} x={413} y={352} h={240} {...pupil(5)} />
        <Pupil kid={ADAM} x={653} y={352} h={240} {...pupil(6)} />
        <Desk x={155} y={548} w={210} />
        <Desk x={395} y={548} w={210} />
        <Desk x={635} y={548} w={210} />
      </g>
    </svg>
  );
};

const QRow = ({
  letter,
  q,
  a,
  open,
  onClick,
  tone,
}: {
  letter: string;
  q: string;
  a: string;
  open: boolean;
  onClick: () => void;
  tone: Tone;
}) => (
  <button
    type="button"
    data-osd-interactive
    className="mmc-btn"
    onClick={(e) => {
      e.currentTarget.blur();
      onClick();
    }}
    style={{
      display: 'block',
      width: '100%',
      textAlign: 'left',
      border: 'none',
      borderRadius: 24,
      background: '#fff',
      padding: '15px 22px',
      boxShadow: `0 6px 0 ${open ? STRONG[tone] : SOFT[tone]}`,
      cursor: 'pointer',
      color: C.ink,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <span
        style={{
          width: 46,
          height: 46,
          borderRadius: '50%',
          background: STRONG[tone],
          color: onTone(tone),
          display: 'grid',
          placeItems: 'center',
          fontFamily: display,
          fontWeight: 600,
          fontSize: 28,
          flex: 'none',
        }}
      >
        {letter}
      </span>
      <span style={{ fontFamily: body, fontWeight: 800, fontSize: 33 }}>{q}</span>
    </div>
    {open ? (
      <div className="mmc-fill" style={{ margin: '8px 0 0 62px', fontWeight: 800, fontSize: 31, color: DEEP.green }}>
        ✓ {a}
      </div>
    ) : null}
  </button>
);

const LookPicture: Page = () => {
  const [open, setOpen] = useState<boolean[]>([false, false, false, false, false]);
  const [mode, setMode] = useState<CountMode>(null);
  const toggle = (i: number, answer: string, m?: CountMode, count = 0) => {
    const next = open.slice();
    next[i] = !open[i];
    setOpen(next);
    if (!next[i]) {
      if (m && mode === m) setMode(null);
      hush();
      return;
    }
    if (m) {
      setMode(m);
      say(`${NUMBERS.slice(0, count).join('. ')}. ${answer}`, 0.72);
    } else {
      say(answer);
    }
  };
  return (
    <Shell
      tag="Activity 2"
      tone="blue"
      title="Look at the picture"
      right={
        <Hints>
          <Hint src={imgEyes} label="Look" />
          <Hint src={imgBubble} label="Answer" />
        </Hints>
      }
    >
      <Area>
        <Anim kind="rise" d={100} style={{ position: 'absolute', left: 0, top: 0 }}>
          <Classroom mode={mode} />
        </Anim>
        <Anim kind="pop" d={600} style={{ position: 'absolute', left: 0, top: 672 }}>
          <div
            style={{
              display: 'inline-block',
              background: '#fff',
              borderRadius: 999,
              padding: '10px 30px',
              boxShadow: `0 5px 0 ${SOFT.blue}`,
              fontWeight: 800,
              fontSize: 30,
            }}
          >
            <span style={{ color: DEEP.blue }}>How many</span> boy<b style={{ color: STRONG.red }}>s</b>?
            <span style={{ color: C.muted, margin: '0 14px' }}>→</span>
            There are <b style={{ color: DEEP.blue }}>4</b> boy<b style={{ color: STRONG.red }}>s</b>.
          </div>
        </Anim>
        <div style={{ position: 'absolute', left: 1040, right: 0, top: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Anim kind="rise" d={200}>
            <QRow letter="a" tone="blue" q="Where are they?" a="They are in the classroom." open={open[0]} onClick={() => toggle(0, 'They are in the classroom.')} />
          </Anim>
          <Anim kind="rise" d={300}>
            <QRow letter="b" tone="blue" q="Who are they?" a="They are pupils. They are classmates." open={open[1]} onClick={() => toggle(1, 'They are pupils. They are classmates.')} />
          </Anim>
          <Anim kind="rise" d={400}>
            <QRow letter="c" tone="orange" q="How many pupils are there?" a="There are seven pupils." open={open[2]} onClick={() => toggle(2, 'There are seven pupils.', 'pupils', 7)} />
          </Anim>
          <Anim kind="rise" d={500}>
            <QRow letter="d" tone="green" q="How many boys are there?" a="There are four boys." open={open[3]} onClick={() => toggle(3, 'There are four boys.', 'boys', 4)} />
          </Anim>
          <Anim kind="rise" d={600}>
            <QRow letter="e" tone="pink" q="How many girls are there?" a="There are three girls." open={open[4]} onClick={() => toggle(4, 'There are three girls.', 'girls', 3)} />
          </Anim>
        </div>
      </Area>
    </Shell>
  );
};

// ─── 05 · Kate (Activity 3) ─────────────────────────────────────────────────
const KATE_ITEMS: Wear[] = outfitOf(KATE);
const KATE_SENTENCE = describe(KATE, 'Kate is');

const PhraseText = ({ w }: { w: Wear }) => (
  <span>
    {PLURAL.has(w.k) ? '' : /^[aeiou]/.test(w.c) ? 'an ' : 'a '}
    <ColorWord c={w.c}>{w.c}</ColorWord> <span style={{ whiteSpace: 'nowrap' }}>{WORD[w.k]}</span>
  </span>
);

const WearChip = ({ w, on, onClick, d }: { w: Wear; on: boolean; onClick: () => void; d: number }) => (
  <Anim kind="pop" d={d}>
    <button
      type="button"
      data-osd-interactive
      className="mmc-btn"
      onClick={(e) => {
        e.currentTarget.blur();
        onClick();
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        width: '100%',
        height: 132,
        padding: '0 24px 0 14px',
        border: 'none',
        borderRadius: 28,
        background: on ? SOFT.yellow : '#fff',
        boxShadow: on ? `0 0 0 5px ${STRONG.yellow}, 0 8px 0 ${DEEP.yellow}` : `0 7px 0 ${C.line}`,
        cursor: 'pointer',
        color: C.ink,
        fontFamily: body,
        fontWeight: 800,
        fontSize: 37,
      }}
    >
      <span
        style={{
          width: 108,
          height: 108,
          borderRadius: 22,
          background: C.paper,
          display: 'grid',
          placeItems: 'center',
          flex: 'none',
        }}
      >
        <Garment w={w} size={92} />
      </span>
      <span style={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap' }}>
        <PhraseText w={w} />
      </span>
    </button>
  </Anim>
);

const KatePage: Page = () => {
  const live = useIsActivePage();
  const [glow, setGlow] = useState<GKind | null>(null);
  const timers = useRef<number[]>([]);
  const clear = () => {
    for (const t of timers.current) window.clearTimeout(t);
    timers.current = [];
  };
  useEffect(() => {
    if (!live) {
      clear();
      setGlow(null);
    }
  }, [live]);
  useEffect(() => clear, []);
  const listen = () => {
    clear();
    say(KATE_SENTENCE, 0.78);
    const at = [900, 2300, 3700, 4900];
    KATE_ITEMS.forEach((w, i) => {
      timers.current.push(window.setTimeout(() => setGlow(w.k), at[i]));
    });
    timers.current.push(window.setTimeout(() => setGlow(null), 6600));
  };
  const pick = (w: Wear) => {
    clear();
    setGlow(glow === w.k ? null : w.k);
    say(phrase(w));
  };
  return (
    <Shell
      tag="Activity 3"
      tone="orange"
      title="Look, listen and repeat"
      right={
        <Hints>
          <Hint src={imgEyes} label="Look" />
          <Hint src={imgEar} label="Listen" />
          <Hint src={imgSpeak} label="Repeat" />
        </Hints>
      }
    >
      <div
        style={{ position: 'absolute', left: 150, top: 940, width: 380, height: 50, borderRadius: '50%', background: 'rgba(34, 48, 90, 0.1)' }}
      />
      <Anim kind="rise" d={100} style={{ position: 'absolute', left: 176, top: 226 }}>
        <Doll kid={KATE} h={740} glow={glow} />
      </Anim>
      <Anim kind="pop" d={500} style={{ position: 'absolute', left: 470, top: 270 }}>
        <div
          style={{
            fontFamily: display,
            fontWeight: 600,
            fontSize: 40,
            background: '#fff',
            borderRadius: 999,
            padding: '8px 28px',
            boxShadow: `0 5px 0 ${SOFT.orange}`,
            transform: 'rotate(5deg)',
          }}
        >
          Kate
        </div>
      </Anim>
      <div style={{ position: 'absolute', left: 660, right: PAD, top: 250 }}>
        <Anim kind="rise" d={200}>
          <p style={{ margin: 0, fontWeight: 800, fontSize: 48, lineHeight: 1.42 }}>
            Kate is wearing <PhraseText w={KATE_ITEMS[0]} />, <PhraseText w={KATE_ITEMS[1]} />,{' '}
            <PhraseText w={KATE_ITEMS[2]} /> and <PhraseText w={KATE_ITEMS[3]} />.
          </p>
        </Anim>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26, marginTop: 44 }}>
          <WearChip w={KATE_ITEMS[0]} on={glow === KATE_ITEMS[0].k} onClick={() => pick(KATE_ITEMS[0])} d={400} />
          <WearChip w={KATE_ITEMS[1]} on={glow === KATE_ITEMS[1].k} onClick={() => pick(KATE_ITEMS[1])} d={500} />
          <WearChip w={KATE_ITEMS[2]} on={glow === KATE_ITEMS[2].k} onClick={() => pick(KATE_ITEMS[2])} d={600} />
          <WearChip w={KATE_ITEMS[3]} on={glow === KATE_ITEMS[3].k} onClick={() => pick(KATE_ITEMS[3])} d={700} />
        </div>
        <Anim kind="pop" d={850} style={{ marginTop: 50, display: 'flex', alignItems: 'center', gap: 26 }}>
          <Btn tone="orange" size={34} onClick={listen}>
            <SpeakerIcon size={36} color="#fff" /> Listen
          </Btn>
          <span style={{ fontFamily: display, fontWeight: 500, fontSize: 32, color: C.soft }}>
            then say it with me!
          </span>
        </Anim>
      </div>
    </Shell>
  );
};

// ─── 06 · Clothes flashcards (Activity 4a) ──────────────────────────────────
const CLOTHES_WORDS = ['jeans', 'T-shirt', 'jacket', 'coat', 'trousers', 'skirt', 'trainers', 'shirt', 'dress'];

const FlashCard = ({
  w,
  word,
  tone,
  on,
  onTap,
  d,
}: {
  w: Wear;
  word: string;
  tone: Tone;
  on: boolean;
  onTap: () => void;
  d: number;
}) => {
  const [k, bump] = useBump();
  return (
    <Anim kind="pop" d={d}>
      <button
        type="button"
        data-osd-interactive
        className="mmc-btn"
        onClick={(e) => {
          e.currentTarget.blur();
          bump();
          onTap();
          say(word);
        }}
        style={{
          ...card(tone),
          display: 'block',
          width: 300,
          height: 336,
          padding: 16,
          border: 'none',
          cursor: 'pointer',
          boxShadow: on
            ? `0 0 0 6px ${STRONG[tone]}, 0 10px 0 ${DEEP[tone]}`
            : `0 8px 0 ${SOFT[tone]}, 0 18px 30px -20px rgba(34, 48, 90, 0.4)`,
          transform: on ? 'scale(1.06)' : undefined,
          transition: 'transform 200ms ease, box-shadow 200ms ease',
        }}
      >
        <div key={k} className={k ? 'mmc-wiggle' : undefined}>
          <div
            style={{
              height: 220,
              borderRadius: 24,
              background: SOFT[tone],
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Garment w={w} size={186} />
          </div>
          <div style={{ fontFamily: display, fontWeight: 600, fontSize: 46, color: C.ink, marginTop: 20, lineHeight: 1.1 }}>
            {word}
          </div>
        </div>
      </button>
    </Anim>
  );
};

const ClothesCards: Page = () => {
  const p = usePlayAll(CLOTHES_WORDS);
  const tap = (i: number) => {
    if (p.on) p.toggle();
    p.setI(i);
  };
  return (
    <Shell
      tag="Activity 4 · Clothes"
      tone="pink"
      title="Look, listen and repeat"
      right={
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 30 }}>
          <PlayAll on={p.on} toggle={p.toggle} tone="pink" />
          <Hints>
            <Hint src={imgEar} label="Listen" />
            <Hint src={imgSpeak} label="Repeat" />
          </Hints>
        </div>
      }
    >
      <Area style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40, top: 250 }}>
        <div style={{ display: 'flex', gap: 40 }}>
          <FlashCard w={{ k: 'jeans', c: 'blue' }} word="jeans" tone="blue" on={p.i === 0} onTap={() => tap(0)} d={100} />
          <FlashCard w={{ k: 'tshirt', c: 'green' }} word="T-shirt" tone="green" on={p.i === 1} onTap={() => tap(1)} d={160} />
          <FlashCard w={{ k: 'jacket', c: 'orange' }} word="jacket" tone="orange" on={p.i === 2} onTap={() => tap(2)} d={220} />
          <FlashCard w={{ k: 'coat', c: 'red' }} word="coat" tone="red" on={p.i === 3} onTap={() => tap(3)} d={280} />
          <FlashCard w={{ k: 'trousers', c: 'brown' }} word="trousers" tone="yellow" on={p.i === 4} onTap={() => tap(4)} d={340} />
        </div>
        <div style={{ display: 'flex', gap: 40 }}>
          <FlashCard w={{ k: 'skirt', c: 'pink' }} word="skirt" tone="pink" on={p.i === 5} onTap={() => tap(5)} d={400} />
          <FlashCard w={{ k: 'trainers', c: 'yellow' }} word="trainers" tone="teal" on={p.i === 6} onTap={() => tap(6)} d={460} />
          <FlashCard w={{ k: 'shirt', c: 'blue' }} word="shirt" tone="blue" on={p.i === 7} onTap={() => tap(7)} d={520} />
          <FlashCard w={{ k: 'dress', c: 'purple' }} word="dress" tone="purple" on={p.i === 8} onTap={() => tap(8)} d={580} />
        </div>
      </Area>
    </Shell>
  );
};

// ─── 07 · Game: listen and click ────────────────────────────────────────────
const GAME_ITEMS: Wear[] = [
  { k: 'jeans', c: 'blue' },
  { k: 'tshirt', c: 'green' },
  { k: 'jacket', c: 'orange' },
  { k: 'coat', c: 'red' },
  { k: 'trousers', c: 'brown' },
  { k: 'skirt', c: 'pink' },
  { k: 'trainers', c: 'yellow' },
  { k: 'shirt', c: 'blue' },
  { k: 'dress', c: 'purple' },
];
const FIRST_ORDER = [3, 0, 7, 5, 1, 8, 2, 6, 4];
const findPrompt = (i: number) => `Find the ${WORD[GAME_ITEMS[i].k]}!`;

const GameTile = ({
  i,
  done,
  shake,
  burst,
  onPick,
}: {
  i: number;
  done: boolean;
  shake: number;
  burst: number;
  onPick: (i: number) => void;
}) => (
  <div style={{ position: 'relative' }}>
    <button
      type="button"
      data-osd-interactive
      className="mmc-btn"
      onClick={(e) => {
        e.currentTarget.blur();
        onPick(i);
      }}
      style={{
        ...card(done ? 'green' : 'blue'),
        display: 'block',
        width: 310,
        height: 220,
        padding: 0,
        border: 'none',
        cursor: 'pointer',
        background: done ? SOFT.green : '#fff',
        boxShadow: done ? `0 0 0 5px ${STRONG.green}, 0 8px 0 ${DEEP.green}` : `0 8px 0 ${C.line}`,
      }}
    >
      <div
        key={shake}
        className={shake ? 'mmc-shake' : undefined}
        style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}
      >
        <Garment w={GAME_ITEMS[i]} size={done ? 130 : 160} />
        {done ? (
          <span className="mmc-fill" style={{ fontFamily: display, fontWeight: 600, fontSize: 36, color: DEEP.green }}>
            ✓ {WORD[GAME_ITEMS[i].k]}
          </span>
        ) : null}
      </div>
    </button>
    <Burst k={burst} />
  </div>
);

const StarRow = ({ n }: { n: number }) => (
  <div style={{ display: 'flex', gap: 8 }}>
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <svg key={i} width={46} height={46} viewBox="0 0 24 24" aria-hidden>
        <path
          d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.2 6.1 20.4l1.3-6.5L2.5 9.3l6.6-.8z"
          fill={i < n ? STRONG.yellow : '#fff'}
          stroke={i < n ? DEEP.yellow : C.faint}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      </svg>
    ))}
  </div>
);

const ListenClick: Page = () => {
  const live = useIsActivePage();
  const [order, setOrder] = useState(FIRST_ORDER);
  const [round, setRound] = useState(0);
  const [done, setDone] = useState<boolean[]>(Array(9).fill(false));
  const [shakes, setShakes] = useState<number[]>(Array(9).fill(0));
  const [bursts, setBursts] = useState<number[]>(Array(9).fill(0));
  const [party, setParty] = useState(0);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    if (!live) window.clearTimeout(timer.current);
  }, [live]);
  const finished = round >= 9;
  const listen = () => {
    if (finished) say('Well done!');
    else say(findPrompt(order[round]));
  };
  const pick = (i: number) => {
    if (finished || done[i]) {
      say(WORD[GAME_ITEMS[i].k]);
      return;
    }
    if (i === order[round]) {
      chime(true);
      const d = done.slice();
      d[i] = true;
      setDone(d);
      const b = bursts.slice();
      b[i] += 1;
      setBursts(b);
      const next = round + 1;
      setRound(next);
      window.clearTimeout(timer.current);
      if (next >= 9) {
        setParty((p) => p + 1);
        timer.current = window.setTimeout(() => say('Well done! Nine out of nine!'), 700);
      } else {
        timer.current = window.setTimeout(() => say(findPrompt(order[next])), 1400);
      }
    } else {
      chime(false);
      const s = shakes.slice();
      s[i] += 1;
      setShakes(s);
    }
  };
  const restart = () => {
    const o = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let k = o.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1));
      [o[k], o[j]] = [o[j], o[k]];
    }
    window.clearTimeout(timer.current);
    setOrder(o);
    setRound(0);
    setDone(Array(9).fill(false));
    setParty(0);
  };
  return (
    <Shell tag="Game" tone="blue" title="Listen and click!" right={<Hints><Hint src={imgEar} label="Listen" /><Hint src={imgMagnifier} label="Find" /></Hints>}>
      <Area>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 620, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Anim kind="pop" d={150} style={{ position: 'relative', marginTop: 20 }}>
            <button
              type="button"
              data-osd-interactive
              className="mmc-btn"
              aria-label="Listen"
              onClick={(e) => {
                e.currentTarget.blur();
                listen();
              }}
              style={{
                width: 300,
                height: 300,
                borderRadius: '50%',
                border: 'none',
                background: STRONG.blue,
                boxShadow: `0 12px 0 ${DEEP.blue}, 0 0 0 18px ${SOFT.blue}`,
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
              }}
            >
              <SpeakerIcon size={150} color="#fff" />
            </button>
            <div style={{ position: 'absolute', right: -40, top: -20 }}>
              <Anim kind="sway" t={1800}>
                <Sticker src={imgEar} size={110} rot={14} />
              </Anim>
            </div>
          </Anim>
          <Anim kind="rise" d={300} style={{ marginTop: 56, textAlign: 'center' }}>
            <div style={{ fontFamily: display, fontWeight: 600, fontSize: 44 }}>
              {finished ? 'Great job!' : `Round ${round + 1} / 9`}
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: C.soft, marginTop: 6 }}>
              {finished ? 'You found all the clothes.' : 'Press, listen, then click the picture.'}
            </div>
          </Anim>
          <Anim kind="rise" d={400} style={{ marginTop: 30 }}>
            <StarRow n={round} />
          </Anim>
          <Anim kind="rise" d={500} style={{ marginTop: 34, position: 'relative' }}>
            <Btn tone="blue" ghost size={28} onClick={restart}>
              New game
            </Btn>
            <Burst k={party} n={44} spread={420} />
          </Anim>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 6,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 310px)',
            gap: 30,
          }}
        >
          <GameTile i={0} done={done[0]} shake={shakes[0]} burst={bursts[0]} onPick={pick} />
          <GameTile i={1} done={done[1]} shake={shakes[1]} burst={bursts[1]} onPick={pick} />
          <GameTile i={2} done={done[2]} shake={shakes[2]} burst={bursts[2]} onPick={pick} />
          <GameTile i={3} done={done[3]} shake={shakes[3]} burst={bursts[3]} onPick={pick} />
          <GameTile i={4} done={done[4]} shake={shakes[4]} burst={bursts[4]} onPick={pick} />
          <GameTile i={5} done={done[5]} shake={shakes[5]} burst={bursts[5]} onPick={pick} />
          <GameTile i={6} done={done[6]} shake={shakes[6]} burst={bursts[6]} onPick={pick} />
          <GameTile i={7} done={done[7]} shake={shakes[7]} burst={bursts[7]} onPick={pick} />
          <GameTile i={8} done={done[8]} shake={shakes[8]} burst={bursts[8]} onPick={pick} />
        </div>
      </Area>
    </Shell>
  );
};

// ─── 08 · Grammar: am / is + wearing ────────────────────────────────────────
const Block = ({ tone, children }: { tone: Tone; children: ReactNode }) => (
  <span
    style={{
      display: 'inline-block',
      fontFamily: display,
      fontWeight: 600,
      fontSize: 40,
      padding: '6px 20px',
      borderRadius: 16,
      background: STRONG[tone],
      color: onTone(tone),
      boxShadow: `0 5px 0 ${DEEP[tone]}`,
    }}
  >
    {children}
  </span>
);
const Plus = () => <span style={{ fontFamily: display, fontWeight: 700, fontSize: 36, color: C.muted }}>+</span>;

const WearingCard = ({
  kid,
  tone,
  q,
  who,
  be,
  short,
  w,
}: {
  kid: Kid;
  tone: Tone;
  q: string;
  who: string;
  be: string;
  short: string;
  w: Wear;
}) => (
  <div style={card(tone, { width: 530, padding: 26 })}>
    <div
      style={{
        fontStyle: 'italic',
        fontWeight: 800,
        fontSize: 30,
        color: DEEP[tone],
        background: C.paper,
        borderRadius: 18,
        padding: '10px 20px',
        textAlign: 'center',
      }}
    >
      {q}
    </div>
    <div
      style={{
        height: 270,
        marginTop: 16,
        borderRadius: 24,
        background: SOFT[tone],
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
      }}
    >
      <Doll kid={kid} h={258} />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 26 }}>
      <Block tone={tone}>{who}</Block>
      <Plus />
      <Block tone="yellow">{be}</Block>
      <Plus />
      <Block tone="purple">wearing</Block>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 26 }}>
      <SpeakBtn text={`${short} wearing ${phrase(w)}.`} tone={tone} size={56} />
      <div style={{ fontWeight: 800, fontSize: 31, lineHeight: 1.3 }}>
        <span style={{ color: DEEP[tone] }}>{short}</span> wearing <PhraseText w={w} />.
      </div>
    </div>
  </div>
);

const GrammarWearing: Page = () => (
  <Shell
    tag="Grammar"
    tone="teal"
    title="I’m · He’s · She’s wearing"
    right={
      <Anim kind="pop" d={300}>
        <Anim kind="bob">
          <Sticker src={imgBulb} size={110} rot={10} />
        </Anim>
      </Anim>
    }
  >
    <Area style={{ display: 'flex', alignItems: 'flex-start', gap: 55, top: 250 }}>
      <Steps>
        <WearingCard kid={ADAM} tone="green" q="What are you wearing?" who="I" be="am" short="I’m" w={{ k: 'tshirt', c: 'yellow' }} />
        <Step duration={260}>
          <WearingCard kid={SAMI} tone="blue" q="What is he wearing?" who="He" be="is" short="He’s" w={{ k: 'pullover', c: 'red' }} />
        </Step>
        <Step duration={260}>
          <WearingCard kid={SARRA} tone="pink" q="What is she wearing?" who="She" be="is" short="She’s" w={{ k: 'skirt', c: 'pink' }} />
        </Step>
      </Steps>
    </Area>
  </Shell>
);

// ─── 09 · Pair conversation (Activity 4b) ───────────────────────────────────
const Bubble = ({
  side,
  tone,
  text,
  children,
}: {
  side: 'A' | 'B';
  tone: Tone;
  text: string;
  children: ReactNode;
}) => (
  <div style={{ display: 'flex', justifyContent: side === 'A' ? 'flex-start' : 'flex-end' }}>
    <div
      style={{
        position: 'relative',
        maxWidth: 880,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        background: '#fff',
        borderRadius: 34,
        padding: '22px 30px',
        boxShadow: `0 7px 0 ${SOFT[tone]}, inset 0 0 0 4px ${SOFT[tone]}`,
        flexDirection: side === 'A' ? 'row' : 'row-reverse',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 30,
          [side === 'A' ? 'left' : 'right']: -22,
          width: 0,
          height: 0,
          borderTop: '16px solid transparent',
          borderBottom: '16px solid transparent',
          [side === 'A' ? 'borderRight' : 'borderLeft']: `24px solid ${SOFT[tone]}`,
        }}
      />
      <span
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          flex: 'none',
          display: 'grid',
          placeItems: 'center',
          background: STRONG[tone],
          color: onTone(tone),
          fontFamily: display,
          fontWeight: 700,
          fontSize: 30,
        }}
      >
        {side}
      </span>
      <div style={{ fontWeight: 800, fontSize: 36, lineHeight: 1.35 }}>{children}</div>
      <SpeakBtn text={text} tone={tone} size={54} />
    </div>
  </div>
);

const PairTalk: Page = () => (
  <Shell
    tag="Activity 4b · Pairs"
    tone="teal"
    title="What are you wearing?"
    right={
      <Hints>
        <Hint src={imgBubble} label="Talk" />
        <Hint src={imgTurns} label="Take turns" />
      </Hints>
    }
  >
    <div style={{ position: 'absolute', left: 120, top: 330, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Anim kind="rise" d={100}>
        <Doll kid={ADAM} h={560} />
      </Anim>
      <div style={{ marginTop: 18 }}>
        <Tag tone="yellow" rot={0}>Learner A</Tag>
      </div>
    </div>
    <div style={{ position: 'absolute', right: 120, top: 330, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Anim kind="rise" d={200}>
        <Doll kid={LINA} h={560} />
      </Anim>
      <div style={{ marginTop: 18 }}>
        <Tag tone="red" rot={0}>Learner B</Tag>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 450, right: 450, top: 270, display: 'flex', flexDirection: 'column', gap: 30 }}>
      <Steps>
        <Bubble side="A" tone="yellow" text="What are you wearing?">
          What are you wearing?
        </Bubble>
        <Step duration={260}>
          <Bubble
            side="B"
            tone="red"
            text="I am wearing a red skirt, a white shirt and blue shoes. What about you? What are you wearing?"
          >
            I am wearing a <ColorWord c="red">red</ColorWord> skirt, a <ColorWord c="white">white</ColorWord> shirt and{' '}
            <ColorWord c="blue">blue</ColorWord> shoes. What about you? What are you wearing?
          </Bubble>
        </Step>
        <Step duration={260}>
          <Bubble side="A" tone="yellow" text="I’m wearing a yellow T-shirt, blue jeans and green shoes.">
            I’m wearing a <ColorWord c="yellow">yellow</ColorWord> T-shirt, <ColorWord c="blue">blue</ColorWord> jeans and{' '}
            <ColorWord c="green">green</ColorWord> shoes.
          </Bubble>
        </Step>
        <Step duration={260}>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                background: STRONG.green,
                color: '#fff',
                borderRadius: 999,
                padding: '12px 34px 12px 16px',
                boxShadow: `0 7px 0 ${DEEP.green}`,
                fontFamily: display,
                fontWeight: 600,
                fontSize: 40,
              }}
            >
              <Sticker src={imgRaise} size={70} />
              Your turn! Ask your partner.
            </div>
          </div>
        </Step>
      </Steps>
    </div>
  </Shell>
);

// ─── 10 · Dress up (Your turn) ──────────────────────────────────────────────
type Who = 'I' | 'He' | 'She';
const SWATCHES: ColorName[] = ['red', 'orange', 'yellow', 'green', 'blue', 'pink', 'brown', 'black', 'white'];
const BOY_LOOK = { skin: SKIN[1], hair: 'short' as Hair, hairColor: HAIR.black };
const GIRL_LOOK = { skin: SKIN[1], hair: 'ponytails' as Hair, hairColor: HAIR.dark };

const KindChip = ({ w, on, onClick, label }: { w?: Wear; on: boolean; onClick: () => void; label?: string }) => (
  <button
    type="button"
    data-osd-interactive
    className="mmc-btn"
    aria-label={label ?? (w ? WORD[w.k] : 'none')}
    onClick={(e) => {
      e.currentTarget.blur();
      onClick();
    }}
    style={{
      width: 96,
      height: 82,
      borderRadius: 20,
      border: 'none',
      padding: 0,
      display: 'grid',
      placeItems: 'center',
      cursor: 'pointer',
      background: on ? SOFT.green : '#fff',
      boxShadow: on ? `0 0 0 4px ${STRONG.green}, 0 5px 0 ${DEEP.green}` : `0 5px 0 ${C.line}`,
      fontFamily: display,
      fontWeight: 600,
      fontSize: 22,
      color: C.muted,
      flex: 'none',
    }}
  >
    {w ? <Garment w={w} size={62} /> : label}
  </button>
);

const Swatch = ({ c, on, onClick }: { c: ColorName; on: boolean; onClick: () => void }) => (
  <button
    type="button"
    data-osd-interactive
    className="mmc-btn"
    aria-label={c}
    title={c}
    onClick={(e) => {
      e.currentTarget.blur();
      onClick();
    }}
    style={{
      width: 48,
      height: 48,
      borderRadius: '50%',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      background: CLOTH[c],
      boxShadow: on ? `0 0 0 4px #fff, 0 0 0 8px ${C.ink}` : `inset 0 0 0 3px ${edge(CLOTH[c])}`,
      flex: 'none',
    }}
  />
);

const SlotRow = ({
  label,
  kinds,
  value,
  none,
  disabled,
  onKind,
  onColor,
}: {
  label: string;
  kinds: GKind[];
  value: Wear | null;
  none?: boolean;
  disabled?: boolean;
  onKind: (k: GKind | null) => void;
  onColor: (c: ColorName) => void;
}) => {
  const color = value?.c ?? 'blue';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: disabled ? 0.35 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
      <span style={{ width: 120, fontFamily: display, fontWeight: 600, fontSize: 30, color: C.soft }}>{label}</span>
      {none ? <KindChip on={!value} onClick={() => onKind(null)} label="none" /> : null}
      {kinds.map((k) => (
        <KindChip key={k} w={{ k, c: color }} on={value?.k === k} onClick={() => onKind(k)} />
      ))}
      <span style={{ width: 18 }} />
      {SWATCHES.map((c) => (
        <Swatch key={c} c={c} on={!!value && value.c === c} onClick={() => onColor(c)} />
      ))}
    </div>
  );
};

const Sentence = ({ who, items }: { who: string; items: Wear[] }) => (
  <span>
    {who} wearing{' '}
    {items.map((w, i) => (
      <span key={`${w.k}-${i}`}>
        <PhraseText w={w} />
        {i < items.length - 2 ? ', ' : i === items.length - 2 ? ' and ' : '.'}
      </span>
    ))}
  </span>
);

const DressUp: Page = () => {
  const [who, setWho] = useState<Who>('She');
  const [girl, setGirl] = useState(true);
  const [top, setTop] = useState<Wear>({ k: 'tshirt', c: 'yellow' });
  const [bottom, setBottom] = useState<Wear | null>({ k: 'skirt', c: 'blue' });
  const [outer, setOuter] = useState<Wear | null>(null);
  const [shoes, setShoes] = useState<Wear>({ k: 'trainers', c: 'red' });
  const isDress = top.k === 'dress';
  const items = [outer, top, isDress ? null : bottom, shoes].filter((w): w is Wear => !!w);
  const lead = who === 'I' ? 'I’m' : who === 'He' ? 'He’s' : 'She’s';
  const text = `${lead} wearing ${listJoin(items.map(phrase))}.`;
  const kid: Kid = {
    ...(girl ? GIRL_LOOK : BOY_LOOK),
    top,
    bottom: isDress ? undefined : bottom ?? undefined,
    outer: outer ?? undefined,
    shoes,
    socks: isDress || bottom?.k === 'skirt' ? '#ffffff' : undefined,
  };
  const pickWho = (w: Who) => {
    setWho(w);
    if (w === 'He') setGirl(false);
    if (w === 'She') setGirl(true);
    say(w === 'I' ? 'I' : w);
  };
  const surprise = () => {
    const r = Math.random;
    const tk = any<GKind>(['tshirt', 'shirt', 'pullover', 'dress']);
    setTop({ k: tk, c: any(SWATCHES) });
    setBottom({ k: any<GKind>(['trousers', 'jeans', 'skirt']), c: any(SWATCHES) });
    setOuter(r() < 0.5 ? null : { k: any<GKind>(['coat', 'jacket']), c: any(SWATCHES) });
    setShoes({ k: any<GKind>(['trainers', 'shoes']), c: any(SWATCHES) });
  };
  return (
    <Shell
      tag="Your turn"
      tone="green"
      title="Dress up and describe!"
      right={
        <div className="mmc-pop" style={{ ...vars({ d: '300ms' }), marginTop: 30 }}>
          <Btn tone="purple" size={30} onClick={surprise}>
            <img src={imgDie} alt="" style={{ width: 40, height: 40 }} />
            Surprise me!
          </Btn>
        </div>
      }
    >
      <div
        style={{ position: 'absolute', left: 150, top: 930, width: 360, height: 46, borderRadius: '50%', background: 'rgba(34, 48, 90, 0.1)' }}
      />
      <Anim kind="rise" d={100} style={{ position: 'absolute', left: 175, top: 240 }}>
        <Doll kid={kid} h={720} />
      </Anim>
      <div style={{ position: 'absolute', left: 620, right: PAD, top: 246, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 120, fontFamily: display, fontWeight: 600, fontSize: 30, color: C.soft }}>Who?</span>
          <Btn tone="green" ghost={who !== 'I'} size={30} onClick={() => pickWho('I')}>
            I
          </Btn>
          <Btn tone="blue" ghost={who !== 'He'} size={30} onClick={() => pickWho('He')}>
            He
          </Btn>
          <Btn tone="pink" ghost={who !== 'She'} size={30} onClick={() => pickWho('She')}>
            She
          </Btn>
        </div>
        <SlotRow
          label="Top"
          kinds={['tshirt', 'shirt', 'pullover', 'dress']}
          value={top}
          onKind={(k) => {
            if (k) setTop({ k, c: top.c });
            if (k) say(WORD[k]);
          }}
          onColor={(c) => {
            setTop({ ...top, c });
            say(c);
          }}
        />
        <SlotRow
          label="Bottom"
          kinds={['trousers', 'jeans', 'skirt']}
          value={bottom}
          disabled={isDress}
          onKind={(k) => {
            if (k) setBottom({ k, c: bottom?.c ?? 'blue' });
            if (k) say(WORD[k]);
          }}
          onColor={(c) => {
            setBottom({ k: bottom?.k ?? 'trousers', c });
            say(c);
          }}
        />
        <SlotRow
          label="Over"
          kinds={['coat', 'jacket']}
          value={outer}
          none
          onKind={(k) => {
            setOuter(k ? { k, c: outer?.c ?? 'orange' } : null);
            if (k) say(WORD[k]);
          }}
          onColor={(c) => {
            setOuter({ k: outer?.k ?? 'jacket', c });
            say(c);
          }}
        />
        <SlotRow
          label="Shoes"
          kinds={['trainers', 'shoes']}
          value={shoes}
          onKind={(k) => {
            if (k) setShoes({ k, c: shoes.c });
            if (k) say(WORD[k]);
          }}
          onColor={(c) => {
            setShoes({ ...shoes, c });
            say(c);
          }}
        />
        <div
          style={card('green', {
            marginTop: 12,
            padding: '22px 26px',
            display: 'flex',
            alignItems: 'center',
            gap: 22,
          })}
        >
          <SpeakBtn text={text} tone="green" size={66} />
          <div style={{ fontWeight: 800, fontSize: 37, lineHeight: 1.36 }}>
            <Sentence who={lead} items={items} />
          </div>
        </div>
      </div>
    </Shell>
  );
};

// ─── 11 · Game: who is it? ──────────────────────────────────────────────────
const RAYEN: Kid = {
  skin: SKIN[1],
  hair: 'short',
  hairColor: HAIR.black,
  top: { k: 'pullover', c: 'red' },
  bottom: { k: 'jeans', c: 'blue' },
  shoes: { k: 'trainers', c: 'white' },
};
const YOUSSEF: Kid = {
  skin: SKIN[2],
  hair: 'curly',
  hairColor: HAIR.black,
  outer: { k: 'jacket', c: 'green' },
  bottom: { k: 'jeans', c: 'blue' },
  shoes: { k: 'trainers', c: 'red' },
};
const MARIEM: Kid = {
  skin: SKIN[0],
  hair: 'ponytails',
  hairColor: HAIR.brown,
  top: { k: 'pullover', c: 'red' },
  bottom: { k: 'skirt', c: 'pink' },
  socks: '#ffffff',
  shoes: { k: 'trainers', c: 'white' },
};
const YASMINE: Kid = {
  skin: SKIN[3],
  hair: 'long',
  hairColor: HAIR.black,
  top: { k: 'dress', c: 'green' },
  socks: '#ffffff',
  shoes: { k: 'shoes', c: 'black' },
};
const WHO_ROUNDS = [2, 0, 3, 1];
const WHO_TEXT = [
  describe(RAYEN, 'He is'),
  describe(YOUSSEF, 'He is'),
  describe(MARIEM, 'She is'),
  describe(YASMINE, 'She is'),
];
const WHO_NAME = ['Rayen', 'Youssef', 'Mariem', 'Yasmine'];

const Suspect = ({
  i,
  kid,
  tone,
  state,
  shake,
  burst,
  onPick,
}: {
  i: number;
  kid: Kid;
  tone: Tone;
  state: 'idle' | 'right';
  shake: number;
  burst: number;
  onPick: (i: number) => void;
}) => (
  <Anim kind="rise" d={200 + i * 100} style={{ position: 'relative' }}>
    <button
      type="button"
      data-osd-interactive
      className="mmc-btn"
      onClick={(e) => {
        e.currentTarget.blur();
        onPick(i);
      }}
      style={{
        ...card(tone),
        width: 380,
        height: 560,
        border: 'none',
        padding: 18,
        cursor: 'pointer',
        background: state === 'right' ? SOFT.green : '#fff',
        boxShadow: state === 'right' ? `0 0 0 6px ${STRONG.green}, 0 9px 0 ${DEEP.green}` : `0 8px 0 ${SOFT[tone]}`,
      }}
    >
      <div key={shake} className={shake ? 'mmc-shake' : undefined}>
        <div
          style={{
            height: 448,
            borderRadius: 24,
            background: SOFT[tone],
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <Doll kid={kid} h={430} />
        </div>
        <div style={{ fontFamily: display, fontWeight: 600, fontSize: 42, color: C.ink, marginTop: 14 }}>
          {state === 'right' ? `✓ ${WHO_NAME[i]}` : WHO_NAME[i]}
        </div>
      </div>
    </button>
    <Burst k={burst} y="40%" n={36} spread={300} />
  </Anim>
);

const WhoIsIt: Page = () => {
  const [round, setRound] = useState(0);
  const [show, setShow] = useState(false);
  const [right, setRight] = useState(-1);
  const [shakes, setShakes] = useState([0, 0, 0, 0]);
  const [bursts, setBursts] = useState([0, 0, 0, 0]);
  const target = WHO_ROUNDS[round];
  const pick = (i: number) => {
    if (i === target) {
      chime(true);
      setRight(i);
      setShow(true);
      const b = bursts.slice();
      b[i] += 1;
      setBursts(b);
      say(`Yes! It’s ${WHO_NAME[i]}!`);
    } else {
      chime(false);
      const s = shakes.slice();
      s[i] += 1;
      setShakes(s);
    }
  };
  const next = () => {
    const r = (round + 1) % WHO_ROUNDS.length;
    setRound(r);
    setRight(-1);
    setShow(false);
    say(WHO_TEXT[WHO_ROUNDS[r]]);
  };
  return (
    <Shell
      tag="Game"
      tone="purple"
      title="Who is it?"
    >
      <Anim kind="pop" d={100} style={{ position: 'absolute', left: PAD + 520, right: PAD, top: 92 }}>
        <div
          style={card('purple', {
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            padding: '14px 18px 14px 14px',
            borderRadius: 999,
          })}
        >
          <SpeakBtn text={WHO_TEXT[target]} tone="purple" size={70} />
          <div style={{ flex: 1, fontWeight: 800, fontSize: 31, lineHeight: 1.25, color: show ? C.ink : C.muted }}>
            {show ? WHO_TEXT[target] : 'Listen… who is it?'}
          </div>
          <Btn tone="purple" ghost size={24} onClick={() => setShow(!show)}>
            {show ? 'Hide' : 'Read'}
          </Btn>
          <Btn tone="purple" size={24} onClick={next}>
            Next ▸
          </Btn>
        </div>
      </Anim>
      <Area style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', top: 270 }}>
        <Suspect i={0} kid={RAYEN} tone="red" state={right === 0 ? 'right' : 'idle'} shake={shakes[0]} burst={bursts[0]} onPick={pick} />
        <Suspect i={1} kid={YOUSSEF} tone="green" state={right === 1 ? 'right' : 'idle'} shake={shakes[1]} burst={bursts[1]} onPick={pick} />
        <Suspect i={2} kid={MARIEM} tone="pink" state={right === 2 ? 'right' : 'idle'} shake={shakes[2]} burst={bursts[2]} onPick={pick} />
        <Suspect i={3} kid={YASMINE} tone="teal" state={right === 3 ? 'right' : 'idle'} shake={shakes[3]} burst={bursts[3]} onPick={pick} />
      </Area>
    </Shell>
  );
};

// ─── 12 · Hobbies flashcards (Activity 5a) ──────────────────────────────────
const HOBBY_WORDS = ['dancing', 'drawing', 'listening to music', 'singing', 'playing sports', 'reading books'];

const HobbyCard = ({
  word,
  tone,
  main,
  extra,
  on,
  onTap,
  d,
}: {
  word: string;
  tone: Tone;
  main: string;
  extra?: string;
  on: boolean;
  onTap: () => void;
  d: number;
}) => {
  const [k, bump] = useBump();
  return (
    <Anim kind="pop" d={d}>
      <button
        type="button"
        data-osd-interactive
        className="mmc-btn"
        onClick={(e) => {
          e.currentTarget.blur();
          bump();
          onTap();
          say(word);
        }}
        style={{
          ...card(tone),
          display: 'block',
          width: 520,
          height: 330,
          padding: 18,
          border: 'none',
          cursor: 'pointer',
          boxShadow: on
            ? `0 0 0 6px ${STRONG[tone]}, 0 10px 0 ${DEEP[tone]}`
            : `0 8px 0 ${SOFT[tone]}, 0 18px 30px -20px rgba(34, 48, 90, 0.4)`,
          transform: on ? 'scale(1.04)' : undefined,
          transition: 'transform 200ms ease, box-shadow 200ms ease',
        }}
      >
        <div key={k} className={k ? 'mmc-wiggle' : undefined}>
          <div
            style={{
              height: 210,
              borderRadius: 24,
              background: SOFT[tone],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            <Sticker src={main} size={170} />
            {extra ? <Sticker src={extra} size={96} rot={12} style={{ alignSelf: 'flex-start', marginTop: 18 }} /> : null}
          </div>
          <div
            style={{
              fontFamily: display,
              fontWeight: 600,
              fontSize: 48,
              color: C.ink,
              marginTop: 18,
              lineHeight: 1.1,
            }}
          >
            {word[0].toUpperCase() + word.slice(1)}
          </div>
        </div>
      </button>
    </Anim>
  );
};

const Hobbies: Page = () => {
  const p = usePlayAll(HOBBY_WORDS, 2800);
  const tap = (i: number) => {
    if (p.on) p.toggle();
    p.setI(i);
  };
  return (
    <Shell
      tag="Activity 5 · Hobbies"
      tone="teal"
      title="Look, listen and read"
      right={
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 30 }}>
          <PlayAll on={p.on} toggle={p.toggle} tone="teal" />
          <Hints>
            <Hint src={imgEyes} label="Look" />
            <Hint src={imgEar} label="Listen" />
          </Hints>
        </div>
      }
    >
      <Area style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 520px)', gap: 40, justifyContent: 'center', top: 252 }}>
        <HobbyCard word="dancing" tone="pink" main={imgDancer} on={p.i === 0} onTap={() => tap(0)} d={100} />
        <HobbyCard word="drawing" tone="yellow" main={imgCrayon} extra={imgPalette} on={p.i === 1} onTap={() => tap(1)} d={180} />
        <HobbyCard word="listening to music" tone="purple" main={imgHeadphone} extra={imgNotes} on={p.i === 2} onTap={() => tap(2)} d={260} />
        <HobbyCard word="singing" tone="red" main={imgMic} extra={imgSparkles} on={p.i === 3} onTap={() => tap(3)} d={340} />
        <HobbyCard word="playing sports" tone="green" main={imgSoccer} extra={imgBasketball} on={p.i === 4} onTap={() => tap(4)} d={420} />
        <HobbyCard word="reading books" tone="blue" main={imgBooks} extra={imgOpenBook} on={p.i === 5} onTap={() => tap(5)} d={500} />
      </Area>
    </Shell>
  );
};

// ─── 13 · Grammar: and / but ────────────────────────────────────────────────
const Joiner = ({ tone, children }: { tone: Tone; children: ReactNode }) => (
  <b
    style={{
      color: onTone(tone),
      background: STRONG[tone],
      borderRadius: 12,
      padding: '0 12px 2px',
      boxShadow: `0 4px 0 ${DEEP[tone]}`,
    }}
  >
    {children}
  </b>
);

const MiniPanel = ({ tone, children, label }: { tone: Tone; children: ReactNode; label: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
    <div
      style={{
        width: 250,
        height: 190,
        borderRadius: 26,
        background: SOFT[tone],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}
    >
      {children}
    </div>
    <span style={{ fontFamily: display, fontWeight: 600, fontSize: 28, color: DEEP[tone] }}>{label}</span>
  </div>
);

const JoinCard = ({
  tone,
  word,
  idea,
  text,
  visual,
  children,
}: {
  tone: Tone;
  word: string;
  idea: string;
  text: string;
  visual: ReactNode;
  children: ReactNode;
}) => (
  <div style={card(tone, { width: 812, padding: '30px 36px 34px' })}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <span
        style={{
          fontFamily: display,
          fontWeight: 700,
          fontSize: 76,
          lineHeight: 1,
          color: onTone(tone),
          background: STRONG[tone],
          borderRadius: 24,
          padding: '8px 30px 14px',
          boxShadow: `0 7px 0 ${DEEP[tone]}`,
        }}
      >
        {word}
      </span>
      <span style={{ fontSize: 32, fontWeight: 800, color: C.soft, lineHeight: 1.3 }}>{idea}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 24, marginTop: 34, height: 240 }}>
      {visual}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 30 }}>
      <SpeakBtn text={text} tone={tone} size={62} />
      <div style={{ fontWeight: 800, fontSize: 40, lineHeight: 1.35 }}>{children}</div>
    </div>
  </div>
);

const AndBut: Page = () => (
  <Shell
    tag="Grammar"
    tone="yellow"
    title="and · but"
    right={
      <Anim kind="pop" d={300}>
        <Anim kind="bob">
          <Sticker src={imgBulb} size={110} rot={10} />
        </Anim>
      </Anim>
    }
  >
    <Area style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', top: 250 }}>
      <Steps>
        <JoinCard
          tone="green"
          word="and"
          idea="adds one more thing"
          text="I like drawing and dancing."
          visual={
            <>
              <MiniPanel tone="green" label="drawing">
                <Sticker src={imgCrayon} size={150} />
              </MiniPanel>
              <span style={{ fontFamily: display, fontWeight: 700, fontSize: 70, color: STRONG.green, alignSelf: 'center' }}>+</span>
              <MiniPanel tone="green" label="dancing">
                <Sticker src={imgDancer} size={150} />
              </MiniPanel>
            </>
          }
        >
          I like drawing <Joiner tone="green">and</Joiner> dancing.
        </JoinCard>
        <Step duration={260}>
          <JoinCard
            tone="orange"
            word="but"
            idea="shows a difference"
            text="I like singing but Amy loves reading."
            visual={
              <>
                <MiniPanel tone="blue" label="I">
                  <Doll kid={SAMI} h={170} bust />
                  <Sticker src={imgMic} size={90} />
                </MiniPanel>
                <span style={{ fontFamily: display, fontWeight: 700, fontSize: 60, color: STRONG.orange, alignSelf: 'center' }}>≠</span>
                <MiniPanel tone="purple" label="Amy">
                  <Doll kid={AMY} h={170} bust />
                  <Sticker src={imgBooks} size={90} />
                </MiniPanel>
              </>
            }
          >
            I like singing <Joiner tone="orange">but</Joiner> Amy loves reading.
          </JoinCard>
        </Step>
      </Steps>
    </Area>
  </Shell>
);

// ─── 14 · Complete the sentences (Activity 5b) ──────────────────────────────
type Gap = { answer: string; options: string[] };

const Blank = ({ value, w }: { value?: string; w: number }) => (
  <span
    style={{
      display: 'inline-block',
      minWidth: w,
      textAlign: 'center',
      borderBottom: value ? `4px solid ${STRONG.green}` : `4px dashed ${C.muted}`,
      margin: '0 6px',
      lineHeight: 1.15,
    }}
  >
    {value ? (
      <span className="mmc-fill" style={{ color: DEEP.green }}>
        {value}
      </span>
    ) : (
      ' '
    )}
  </span>
);

const FillIn = ({
  n,
  tone,
  cues,
  parts,
  gaps,
  d,
}: {
  n: number;
  tone: Tone;
  cues: [string, string];
  parts: string[];
  gaps: Gap[];
  d: number;
}) => {
  const [filled, setFilled] = useState(0);
  const [shake, setShake] = useState(0);
  const [burst, setBurst] = useState(0);
  const done = filled >= gaps.length;
  const choose = (o: string) => {
    if (done) return;
    if (o === gaps[filled].answer) {
      chime(true);
      const next = filled + 1;
      setFilled(next);
      if (next >= gaps.length) {
        setBurst((b) => b + 1);
        let s = parts[0];
        for (let i = 0; i < gaps.length; i++) s += gaps[i].answer + parts[i + 1];
        say(s);
      }
    } else {
      chime(false);
      setShake((k) => k + 1);
    }
  };
  return (
    <Anim kind="rise" d={d} style={{ position: 'relative' }}>
      <div style={card(done ? 'green' : tone, { display: 'flex', alignItems: 'center', gap: 34, padding: '20px 30px 20px 20px' })}>
        <div
          style={{
            position: 'relative',
            width: 280,
            height: 170,
            flex: 'none',
            borderRadius: 24,
            background: SOFT[tone],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <Sticker src={cues[0]} size={112} />
          <Sticker src={cues[1]} size={112} />
          <span
            style={{
              position: 'absolute',
              left: -12,
              top: -12,
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: STRONG[tone],
              color: onTone(tone),
              display: 'grid',
              placeItems: 'center',
              fontFamily: display,
              fontWeight: 700,
              fontSize: 28,
            }}
          >
            {n}
          </span>
        </div>
        <div style={{ flex: 1 }}>
          <div key={shake} className={shake ? 'mmc-shake' : undefined} style={{ fontWeight: 800, fontSize: 40, lineHeight: 1.45 }}>
            {parts[0]}
            <Blank value={filled > 0 ? gaps[0].answer : undefined} w={210} />
            {parts[1]}
            {gaps[1] ? <Blank value={filled > 1 ? gaps[1].answer : undefined} w={210} /> : null}
            {parts[2] ?? ''}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14, minHeight: 60 }}>
            {done ? (
              <span className="mmc-fill" style={{ fontFamily: display, fontWeight: 600, fontSize: 34, color: DEEP.green }}>
                ✓ Well done!
              </span>
            ) : (
              <>
                <span style={{ fontFamily: display, fontWeight: 500, fontSize: 26, color: C.muted, marginRight: 4 }}>
                  Blank {filled + 1}:
                </span>
                <Btn tone={tone} ghost size={27} onClick={() => choose(gaps[filled].options[0])}>
                  {gaps[filled].options[0]}
                </Btn>
                <Btn tone={tone} ghost size={27} onClick={() => choose(gaps[filled].options[1])}>
                  {gaps[filled].options[1]}
                </Btn>
                <Btn tone={tone} ghost size={27} onClick={() => choose(gaps[filled].options[2])}>
                  {gaps[filled].options[2]}
                </Btn>
              </>
            )}
          </div>
        </div>
      </div>
      <Burst k={burst} x="70%" y="40%" n={34} spread={320} />
    </Anim>
  );
};

const Complete: Page = () => (
  <Shell
    tag="Activity 5b"
    tone="orange"
    title="Complete the sentences"
    right={
      <Hints>
        <Hint src={imgEyes} label="Look" />
        <Hint src={imgPencil} label="Complete" />
      </Hints>
    }
  >
    <Area style={{ display: 'flex', flexDirection: 'column', gap: 26, top: 246 }}>
      <FillIn
        n={1}
        tone="red"
        cues={[imgMic, imgBooks]}
        parts={['I like', 'but Amy loves', 'stories.']}
        gaps={[
          { answer: 'singing', options: ['dancing', 'singing', 'reading'] },
          { answer: 'reading', options: ['reading', 'drawing', 'singing'] },
        ]}
        d={150}
      />
      <FillIn
        n={2}
        tone="yellow"
        cues={[imgCrayon, imgDancer]}
        parts={['Liwa likes', 'and', '.']}
        gaps={[
          { answer: 'drawing', options: ['sports', 'reading', 'drawing'] },
          { answer: 'dancing', options: ['dancing', 'singing', 'music'] },
        ]}
        d={300}
      />
      <FillIn
        n={3}
        tone="purple"
        cues={[imgHeadphone, imgSoccer]}
        parts={['Iheb loves', 'to music but Kate likes playing', '.']}
        gaps={[
          { answer: 'listening', options: ['singing', 'listening', 'reading'] },
          { answer: 'sports', options: ['books', 'music', 'sports'] },
        ]}
        d={450}
      />
    </Area>
  </Shell>
);

// ─── 15 · Grammar: this is / these are · he / she ───────────────────────────
const ExampleRow = ({ tone, visual, text, children }: { tone: Tone; visual: ReactNode; text: string; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
    <div
      style={{
        width: 200,
        height: 140,
        flex: 'none',
        borderRadius: 22,
        background: SOFT[tone],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {visual}
    </div>
    <div style={{ flex: 1, fontWeight: 800, fontSize: 36, lineHeight: 1.3 }}>{children}</div>
    <SpeakBtn text={text} tone={tone} size={56} />
  </div>
);

const ThisThese: Page = () => (
  <Shell
    tag="Grammar"
    tone="blue"
    title="This is · These are"
    right={
      <Anim kind="pop" d={300}>
        <Anim kind="bob">
          <Sticker src={imgBulb} size={110} rot={10} />
        </Anim>
      </Anim>
    }
  >
    <Area style={{ top: 248 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Anim kind="rise" d={120}>
          <div style={card('blue', { width: 818, padding: '26px 30px 30px' })}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <Block tone="blue">This is</Block>
              <span style={{ fontSize: 30, fontWeight: 800, color: C.soft }}>one person or thing</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 24 }}>
              <ExampleRow tone="blue" text="This is my coat." visual={<Garment w={{ k: 'coat', c: 'red' }} size={120} />}>
                <Joiner tone="blue">This is</Joiner> my coat.
              </ExampleRow>
              <ExampleRow tone="blue" text="This is my friend Ahmed." visual={<Doll kid={AHMED} h={150} bust />}>
                <Joiner tone="blue">This is</Joiner> my friend Ahmed.
              </ExampleRow>
            </div>
          </div>
        </Anim>
        <Anim kind="rise" d={260}>
          <div style={card('pink', { width: 818, padding: '26px 30px 30px' })}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <Block tone="pink">These are</Block>
              <span style={{ fontSize: 30, fontWeight: 800, color: C.soft }}>two or more</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 24 }}>
              <ExampleRow tone="pink" text="These are my trainers." visual={<Garment w={{ k: 'trainers', c: 'blue' }} size={160} />}>
                <Joiner tone="pink">These are</Joiner> my trainers.
              </ExampleRow>
              <ExampleRow
                tone="pink"
                text="These are my friends, Liwa and Iheb."
                visual={
                  <>
                    <Doll kid={LIWA} h={140} bust />
                    <Doll kid={IHEB} h={140} bust />
                  </>
                }
              >
                <Joiner tone="pink">These are</Joiner> my friends, Liwa and Iheb.
              </ExampleRow>
            </div>
          </div>
        </Anim>
      </div>
      <div style={{ display: 'flex', gap: 30, marginTop: 34 }}>
        <Anim kind="pop" d={450} style={{ flex: 1.25 }}>
          <div style={card('yellow', { display: 'flex', alignItems: 'center', gap: 22, padding: '18px 28px', height: 130 })}>
            <Garment w={{ k: 'jeans', c: 'blue' }} size={92} />
            <div style={{ fontWeight: 800, fontSize: 31, lineHeight: 1.3 }}>
              <b style={{ color: DEEP.orange }}>jeans · trousers · trainers</b>: always plural!
              <br />
              <Joiner tone="pink">These are</Joiner> my jeans.
            </div>
          </div>
        </Anim>
        <Anim kind="pop" d={560} style={{ flex: 1 }}>
          <div style={card('green', { display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '18px 24px', height: 130 })}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Doll kid={SAMI} h={100} bust />
              <span style={{ fontWeight: 800, fontSize: 34 }}>
                boy → <Joiner tone="blue">He</Joiner>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Doll kid={SARRA} h={100} bust />
              <span style={{ fontWeight: 800, fontSize: 34 }}>
                girl → <Joiner tone="pink">She</Joiner>
              </span>
            </div>
          </div>
        </Anim>
      </div>
    </Area>
  </Shell>
);

// ─── 16 · Quiz: this is or these are? ───────────────────────────────────────
type ThisAns = 'This is' | 'These are';

const QuizTile = ({
  answer,
  rest,
  tone,
  d,
  children,
}: {
  answer: ThisAns;
  rest: string;
  tone: Tone;
  d: number;
  children: ReactNode;
}) => {
  const [ok, setOk] = useState(false);
  const [shake, setShake] = useState(0);
  const [burst, setBurst] = useState(0);
  const choose = (a: ThisAns) => {
    if (ok) return;
    if (a === answer) {
      chime(true);
      setOk(true);
      setBurst((b) => b + 1);
      say(`${answer} ${rest}`);
    } else {
      chime(false);
      setShake((k) => k + 1);
    }
  };
  return (
    <Anim kind="pop" d={d} style={{ position: 'relative' }}>
      <div
        style={card(ok ? 'green' : tone, {
          height: 330,
          padding: 18,
          background: ok ? SOFT.green : '#fff',
          boxShadow: ok ? `0 0 0 5px ${STRONG.green}, 0 8px 0 ${DEEP.green}` : `0 8px 0 ${SOFT[tone]}`,
        })}
      >
        <div
          style={{
            height: 150,
            borderRadius: 22,
            background: ok ? '#fff' : SOFT[tone],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          {children}
        </div>
        <div
          key={shake}
          className={shake ? 'mmc-shake' : undefined}
          style={{ textAlign: 'center', fontWeight: 800, fontSize: 38, marginTop: 14 }}
        >
          <Blank value={ok ? answer : undefined} w={190} /> {rest}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 16 }}>
          <Btn tone="blue" ghost={!(ok && answer === 'This is')} size={27} onClick={() => choose('This is')}>
            This is
          </Btn>
          <Btn tone="pink" ghost={!(ok && answer === 'These are')} size={27} onClick={() => choose('These are')}>
            These are
          </Btn>
        </div>
      </div>
      <Burst k={burst} y="30%" n={30} spread={260} />
    </Anim>
  );
};

const QuizThis: Page = () => (
  <Shell
    tag="Quiz"
    tone="pink"
    title="This is or These are?"
    right={
      <Hints>
        <Hint src={imgEyes} label="Look" />
        <Hint src={imgThumb} label="Choose" />
      </Hints>
    }
  >
    <Area style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '36px 40px', top: 248 }}>
      <QuizTile answer="This is" rest="my coat." tone="red" d={100}>
        <Garment w={{ k: 'coat', c: 'red' }} size={130} />
      </QuizTile>
      <QuizTile answer="These are" rest="my trainers." tone="blue" d={180}>
        <Garment w={{ k: 'trainers', c: 'green' }} size={190} />
      </QuizTile>
      <QuizTile answer="These are" rest="my jeans." tone="yellow" d={260}>
        <Garment w={{ k: 'jeans', c: 'blue' }} size={130} />
      </QuizTile>
      <QuizTile answer="These are" rest="my friends." tone="purple" d={340}>
        <Doll kid={SARRA} h={140} bust />
        <Doll kid={AMY} h={140} bust />
      </QuizTile>
      <QuizTile answer="This is" rest="my friend." tone="green" d={420}>
        <Doll kid={IHEB} h={140} bust />
      </QuizTile>
      <QuizTile answer="This is" rest="my dress." tone="pink" d={500}>
        <Garment w={{ k: 'dress', c: 'pink' }} size={130} />
      </QuizTile>
    </Area>
  </Shell>
);

// ─── 17 · Introduce your classmate: the model (Activity 5c) ─────────────────
const IdField = ({ label, children }: { label: string; children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <span style={{ fontFamily: display, fontWeight: 500, fontSize: 24, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
      {label}
    </span>
    <span style={{ fontFamily: display, fontWeight: 600, fontSize: 46, color: C.ink, display: 'flex', alignItems: 'center', gap: 12 }}>
      {children}
    </span>
  </div>
);

const IdCard = ({ name, age, hobby, hobbyImg, tone }: { name: string; age: number; hobby: string; hobbyImg: string; tone: Tone }) => (
  <div style={card(tone, { position: 'relative', display: 'flex', alignItems: 'center', gap: 70, padding: '46px 44px 28px' })}>
    <div style={{ position: 'absolute', left: 30, top: -24 }}>
      <Tag tone={tone}>My friend</Tag>
    </div>
    <IdField label="Name">{name}</IdField>
    <IdField label="Age">{age}</IdField>
    <IdField label="Hobby">
      <Sticker src={hobbyImg} size={60} />
      {hobby}
    </IdField>
  </div>
);

const SayRow = ({ n, tone, text, children }: { n: number; tone: Tone; text: string; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
    <span
      style={{
        width: 50,
        height: 50,
        borderRadius: '50%',
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        background: STRONG[tone],
        color: onTone(tone),
        fontFamily: display,
        fontWeight: 700,
        fontSize: 28,
      }}
    >
      {n}
    </span>
    <div style={{ flex: 1, fontWeight: 800, fontSize: 40, lineHeight: 1.32 }}>{children}</div>
    <SpeakBtn text={text} tone={tone} size={56} />
  </div>
);

const IntroModel: Page = () => (
  <Shell
    tag="Activity 5c"
    tone="green"
    title="Introduce your classmate"
    right={
      <Hints>
        <Hint src={imgEar} label="Listen" />
        <Hint src={imgSpeak} label="Say" />
      </Hints>
    }
  >
    <div
      style={{ position: 'absolute', left: 140, top: 935, width: 360, height: 46, borderRadius: '50%', background: 'rgba(34, 48, 90, 0.1)' }}
    />
    <Anim kind="rise" d={100} style={{ position: 'absolute', left: 168, top: 250 }}>
      <Doll kid={AHMED} h={705} />
    </Anim>
    <div style={{ position: 'absolute', left: 600, right: PAD, top: 268 }}>
      <Anim kind="pop" d={250}>
        <IdCard name="Ahmed" age={10} hobby="playing sports" hobbyImg={imgSoccer} tone="green" />
      </Anim>
      <div style={card('yellow', { marginTop: 40, padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: 18 })}>
        <Steps>
          <SayRow n={1} tone="blue" text="This is my friend Ahmed.">
            This is my friend <b style={{ color: DEEP.blue }}>Ahmed</b>.
          </SayRow>
          <Step duration={240}>
            <SayRow n={2} tone="orange" text="He is 10.">
              He is <b style={{ color: DEEP.orange }}>10</b>.
            </SayRow>
          </Step>
          <Step duration={240}>
            <SayRow n={3} tone="green" text="He likes playing sports.">
              He likes <b style={{ color: DEEP.green }}>playing sports</b>.
            </SayRow>
          </Step>
          <Step duration={240}>
            <SayRow n={4} tone="pink" text="He is wearing a yellow coat, black jeans and blue trainers.">
              He is wearing <PhraseText w={AHMED.outer as Wear} />, <PhraseText w={AHMED.bottom as Wear} /> and{' '}
              <PhraseText w={AHMED.shoes as Wear} />.
            </SayRow>
          </Step>
        </Steps>
      </div>
    </div>
  </Shell>
);

// ─── 18 · Group work + timer (Activity 5c) ──────────────────────────────────
const AskChip = ({ text, tone }: { text: string; tone: Tone }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      background: SOFT[tone],
      borderRadius: 999,
      padding: '7px 8px 7px 22px',
      fontWeight: 800,
      fontSize: 30,
    }}
  >
    {text}
    <SpeakBtn text={text} tone={tone} size={46} />
  </div>
);

const TaskCard = ({ n, tone, title, children }: { n: number; tone: Tone; title: string; children?: ReactNode }) => (
  <div style={card(tone, { display: 'flex', alignItems: 'flex-start', gap: 22, padding: '20px 28px' })}>
    <span
      style={{
        width: 54,
        height: 54,
        borderRadius: '50%',
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        background: STRONG[tone],
        color: onTone(tone),
        fontFamily: display,
        fontWeight: 700,
        fontSize: 30,
      }}
    >
      {n}
    </span>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 800, fontSize: 36, lineHeight: 1.45 }}>{title}</div>
      {children ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>{children}</div> : null}
    </div>
  </div>
);

const Value = ({ src, label }: { src: string; label: string }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      background: '#fff',
      borderRadius: 999,
      padding: '7px 24px 7px 10px',
      boxShadow: `0 5px 0 ${C.line}`,
      fontFamily: display,
      fontWeight: 600,
      fontSize: 28,
      whiteSpace: 'nowrap',
    }}
  >
    <Sticker src={src} size={50} />
    {label}
  </div>
);

const RING_R = 160;
const RING_C = 2 * Math.PI * RING_R;

const Timer = () => {
  const [total, setTotal] = useState(15 * 60);
  const [left, setLeft] = useState(15 * 60);
  const [run, setRun] = useState(false);
  const [party, setParty] = useState(0);
  useEffect(() => {
    if (!run) return;
    const id = window.setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [run]);
  useEffect(() => {
    if (run && left === 0) {
      setRun(false);
      chime(true);
      setParty((p) => p + 1);
    }
  }, [run, left]);
  const preset = (m: number) => {
    setRun(false);
    setTotal(m * 60);
    setLeft(m * 60);
  };
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  return (
    <div style={card('purple', { position: 'relative', padding: '28px 30px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center' })}>
      <div style={{ position: 'relative', width: 380, height: 380 }}>
        <svg width={380} height={380} viewBox="0 0 380 380" aria-hidden>
          <circle cx={190} cy={190} r={RING_R} fill={C.paper} stroke={SOFT.purple} strokeWidth={28} />
          <circle
            cx={190}
            cy={190}
            r={RING_R}
            fill="none"
            stroke={left === 0 ? STRONG.green : STRONG.purple}
            strokeWidth={28}
            strokeLinecap="round"
            strokeDasharray={RING_C}
            strokeDashoffset={RING_C * (1 - left / total)}
            transform="rotate(-90 190 190)"
            style={{ transition: 'stroke-dashoffset 900ms linear' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Sticker src={imgStopwatch} size={62} />
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 92, lineHeight: 1, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
            {mm}:{ss}
          </span>
        </div>
        <Burst k={party} n={50} spread={360} />
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
        <Btn tone="purple" size={30} onClick={() => setRun(!run)} disabled={left === 0}>
          {run ? 'Pause' : 'Start'}
        </Btn>
        <Btn tone="purple" ghost size={30} onClick={() => preset(total / 60)}>
          Reset
        </Btn>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
        <span style={{ fontFamily: display, fontWeight: 500, fontSize: 24, color: C.muted }}>minutes:</span>
        <Btn tone="teal" ghost={total !== 300} size={22} onClick={() => preset(5)}>
          5
        </Btn>
        <Btn tone="teal" ghost={total !== 600} size={22} onClick={() => preset(10)}>
          10
        </Btn>
        <Btn tone="teal" ghost={total !== 900} size={22} onClick={() => preset(15)}>
          15
        </Btn>
      </div>
    </div>
  );
};

const GroupWork: Page = () => (
  <Shell tag="Activity 5c · Groups of 3" tone="purple" title="Meet my classmates!">
    <div style={{ position: 'absolute', left: PAD, width: 1060, top: 250, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Anim kind="rise" d={100}>
        <TaskCard n={1} tone="blue" title="Ask your friends:">
          <AskChip text="What’s your name?" tone="blue" />
          <AskChip text="How old are you?" tone="blue" />
          <AskChip text="What’s your hobby?" tone="blue" />
        </TaskCard>
      </Anim>
      <Anim kind="rise" d={200}>
        <TaskCard n={2} tone="orange" title="Introduce your partner to another group." />
      </Anim>
      <Anim kind="rise" d={300}>
        <TaskCard n={3} tone="pink" title="Describe what he or she is wearing." />
      </Anim>
      <Anim kind="pop" d={500} style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 14 }}>
        <Value src={imgTurns} label="Take turns" />
        <Value src={imgEar} label="Listen to your friends" />
        <Value src={imgHeart} label="Be kind" />
        <Value src={imgThumb} label="Speak up: you can do it!" />
      </Anim>
    </div>
    <Anim kind="pop" d={250} style={{ position: 'absolute', right: PAD, width: 580, top: 210 }}>
      <Timer />
    </Anim>
  </Shell>
);

// ─── 19 · Game: mystery classmate ───────────────────────────────────────────
const BOY_NAMES = ['Adam', 'Rayen', 'Youssef', 'Aziz', 'Omar', 'Ilyes', 'Hamza'];
const GIRL_NAMES = ['Nour', 'Eya', 'Salma', 'Amira', 'Lina', 'Mariem', 'Yasmine'];
const HOBBY_IMG = [imgDancer, imgCrayon, imgHeadphone, imgMic, imgSoccer, imgBooks];
type Mystery = { name: string; girl: boolean; age: number; hobby: number; kid: Kid };
const FIRST_MYSTERY: Mystery = {
  name: 'Nour',
  girl: true,
  age: 10,
  hobby: 5,
  kid: {
    skin: SKIN[2],
    hair: 'bob',
    hairColor: HAIR.dark,
    outer: { k: 'jacket', c: 'pink' },
    bottom: { k: 'jeans', c: 'blue' },
    shoes: { k: 'trainers', c: 'white' },
  },
};
const any = <T,>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)];
const randomMystery = (): Mystery => {
  const girl = Math.random() < 0.5;
  const top: Wear = { k: any<GKind>(girl ? ['tshirt', 'shirt', 'pullover', 'dress'] : ['tshirt', 'shirt', 'pullover']), c: any(SWATCHES) };
  const outerKind = Math.random() < 0.45 ? any<GKind>(['coat', 'jacket']) : null;
  const dress = top.k === 'dress';
  const bottom: Wear | undefined = dress ? undefined : { k: any<GKind>(girl ? ['trousers', 'jeans', 'skirt'] : ['trousers', 'jeans']), c: any(SWATCHES) };
  const kid: Kid = {
    skin: any(SKIN),
    hair: any<Hair>(girl ? ['long', 'bob', 'ponytails', 'bun'] : ['short', 'spiky', 'curly']),
    hairColor: any(Object.values(HAIR)),
    // A closed jacket hides the top, so we don't name a top we can't see.
    top: outerKind === 'jacket' && !dress ? undefined : top,
    bottom,
    outer: outerKind ? { k: outerKind, c: any(SWATCHES) } : undefined,
    shoes: { k: any<GKind>(['trainers', 'shoes']), c: any(SWATCHES) },
    socks: dress || bottom?.k === 'skirt' ? '#ffffff' : undefined,
  };
  return {
    name: any(girl ? GIRL_NAMES : BOY_NAMES),
    girl,
    age: 9 + Math.floor(Math.random() * 3),
    hobby: Math.floor(Math.random() * HOBBY_WORDS.length),
    kid,
  };
};

const MysteryGame: Page = () => {
  const [m, setM] = useState<Mystery>(FIRST_MYSTERY);
  const [show, setShow] = useState(false);
  const [pop, bump] = useBump();
  const P = m.girl ? 'She' : 'He';
  const lines = [
    `This is my friend ${m.name}.`,
    `${P} is ${m.age}.`,
    `${P} likes ${HOBBY_WORDS[m.hobby]}.`,
    describe(m.kid, `${P} is`),
  ];
  const fresh = () => {
    setM(randomMystery());
    setShow(false);
    bump();
  };
  return (
    <Shell
      tag="Game"
      tone="orange"
      title="Mystery classmate"
      right={
        <div className="mmc-pop" style={{ ...vars({ d: '300ms' }), marginTop: 30 }}>
          <Btn tone="orange" size={30} onClick={fresh}>
            <img src={imgDie} alt="" style={{ width: 40, height: 40 }} />
            New classmate
          </Btn>
        </div>
      }
    >
      <div
        style={{ position: 'absolute', left: 140, top: 935, width: 360, height: 46, borderRadius: '50%', background: 'rgba(34, 48, 90, 0.1)' }}
      />
      <div key={pop} className={pop ? 'mmc-wiggle' : undefined} style={{ position: 'absolute', left: 168, top: 250 }}>
        <Anim kind="rise" d={100}>
          <Doll kid={m.kid} h={705} />
        </Anim>
      </div>
      <div style={{ position: 'absolute', left: 600, right: PAD, top: 268 }}>
        <Anim kind="pop" d={250}>
          <IdCard name={m.name} age={m.age} hobby={HOBBY_WORDS[m.hobby]} hobbyImg={HOBBY_IMG[m.hobby]} tone="orange" />
        </Anim>
        <Anim kind="rise" d={400}>
          <div style={card('yellow', { marginTop: 40, padding: '28px 32px', minHeight: 380 })}>
            {show ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <SayRow n={1} tone="blue" text={lines[0]}>
                  {lines[0]}
                </SayRow>
                <SayRow n={2} tone="orange" text={lines[1]}>
                  {lines[1]}
                </SayRow>
                <SayRow n={3} tone="green" text={lines[2]}>
                  {lines[2]}
                </SayRow>
                <SayRow n={4} tone="pink" text={lines[3]}>
                  <Sentence who={`${P}’s`} items={outfitOf(m.kid)} />
                </SayRow>
              </div>
            ) : (
              <div>
                <div style={{ fontFamily: display, fontWeight: 600, fontSize: 46 }}>Can you introduce {m.name}?</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: C.soft, lineHeight: 1.65, marginTop: 14 }}>
                  This is my friend … · {P} is … ·
                  <br />
                  {P} likes … · {P} is wearing …
                </div>
                <div style={{ marginTop: 26 }}>
                  <Btn tone="green" size={30} onClick={() => setShow(true)}>
                    Show the answer
                  </Btn>
                </div>
              </div>
            )}
          </div>
        </Anim>
      </div>
    </Shell>
  );
};

// ─── 20 · How did I do? ─────────────────────────────────────────────────────
const FaceBtn = ({ src, label, on, onClick }: { src: string; label: string; on: boolean; onClick: () => void }) => (
  <button
    type="button"
    data-osd-interactive
    className="mmc-btn"
    onClick={(e) => {
      e.currentTarget.blur();
      onClick();
    }}
    style={{
      width: 150,
      height: 150,
      border: 'none',
      borderRadius: 28,
      background: on ? SOFT.yellow : 'transparent',
      boxShadow: on ? `0 0 0 5px ${STRONG.yellow}` : 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      cursor: 'pointer',
      flex: 'none',
    }}
  >
    <Sticker src={src} size={on ? 92 : 78} style={{ transition: 'width 200ms ease, height 200ms ease' }} />
    <span style={{ fontFamily: display, fontWeight: 600, fontSize: 23, color: on ? DEEP.yellow : C.muted }}>{label}</span>
  </button>
);

const CanRow = ({ tone, d, visual, children }: { tone: Tone; d: number; visual: ReactNode; children: ReactNode }) => {
  const [pick, setPick] = useState(-1);
  const [burst, setBurst] = useState(0);
  const choose = (i: number) => {
    setPick(i);
    if (i === 0) {
      chime(true);
      setBurst((b) => b + 1);
    }
  };
  return (
    <Anim kind="rise" d={d} style={{ position: 'relative' }}>
      <div style={card(tone, { display: 'flex', alignItems: 'center', gap: 30, padding: '10px 26px 10px 14px', height: 172 })}>
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 24,
            background: SOFT[tone],
            display: 'grid',
            placeItems: 'center',
            flex: 'none',
          }}
        >
          {visual}
        </div>
        <div style={{ flex: 1, fontFamily: display, fontWeight: 600, fontSize: 50 }}>{children}</div>
        <FaceBtn src={imgGrin} label="Yes, I can!" on={pick === 0} onClick={() => choose(0)} />
        <FaceBtn src={imgSmile} label="Almost" on={pick === 1} onClick={() => choose(1)} />
        <FaceBtn src={imgThink} label="Not yet" on={pick === 2} onClick={() => choose(2)} />
      </div>
      <Burst k={burst} x="78%" y="50%" n={30} spread={260} />
    </Anim>
  );
};

const SelfCheck: Page = () => (
  <Shell
    tag="My progress"
    tone="green"
    title="How did I do?"
    right={
      <Anim kind="pop" d={300}>
        <Anim kind="bob">
          <Sticker src={imgGlowStar} size={116} rot={-8} />
        </Anim>
      </Anim>
    }
  >
    <Area style={{ display: 'flex', flexDirection: 'column', gap: 30, top: 262 }}>
      <CanRow tone="blue" d={150} visual={<Sticker src={imgWave} size={110} />}>
        I can introduce a classmate.
      </CanRow>
      <CanRow tone="orange" d={300} visual={<Sticker src={imgMagnifier} size={110} />}>
        I can describe a classmate.
      </CanRow>
      <CanRow tone="pink" d={450} visual={<Garment w={{ k: 'tshirt', c: 'pink' }} size={112} />}>
        I can name clothes.
      </CanRow>
    </Area>
  </Shell>
);

// ─── 21 · Well done! ────────────────────────────────────────────────────────
const WellDone: Page = () => {
  const live = useIsActivePage();
  return (
    <Shell footer={false}>
      <Burst k={live ? 1 : 0} x="50%" y="300px" n={70} spread={700} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 90, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Anim kind="drop" d={100}>
          <Anim kind="bob" t={3000}>
            <Sticker src={imgTrophy} size={210} />
          </Anim>
        </Anim>
        <h1
          className="mmc-pop"
          style={{
            ...vars({ d: '300ms' }),
            fontFamily: display,
            fontWeight: 700,
            fontSize: 136,
            lineHeight: 1.05,
            margin: '24px 0 0',
          }}
        >
          Well done, <RainbowWord text="class!" />
        </h1>
        <Anim kind="rise" d={550} style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 18 }}>
          <span style={{ fontFamily: display, fontWeight: 500, fontSize: 52, color: C.soft }}>Goodbye! See you next time</span>
          <Anim kind="sway" t={1600}>
            <Sticker src={imgWave} size={80} />
          </Anim>
        </Anim>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 40, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 6 }}>
        <Anim kind="rise" d={700}>
          <Doll kid={SARRA} h={330} />
        </Anim>
        <Anim kind="rise" d={760}>
          <Doll kid={LIWA} h={330} />
        </Anim>
        <Anim kind="rise" d={820}>
          <Doll kid={AMY} h={330} />
        </Anim>
        <Anim kind="rise" d={880}>
          <Doll kid={KATE} h={350} />
        </Anim>
        <Anim kind="rise" d={940}>
          <Doll kid={AHMED} h={330} />
        </Anim>
        <Anim kind="rise" d={1000}>
          <Doll kid={LINA} h={330} />
        </Anim>
        <Anim kind="rise" d={1060}>
          <Doll kid={IHEB} h={330} />
        </Anim>
      </div>
      <Anim kind="pop" d={900} style={{ position: 'absolute', left: 150, top: 150 }}>
        <Anim kind="bob" t={3400}>
          <Sticker src={imgParty} size={140} rot={-12} />
        </Anim>
      </Anim>
      <Anim kind="pop" d={1000} style={{ position: 'absolute', right: 160, top: 130 }}>
        <Anim kind="bob" d={500} t={3800}>
          <Sticker src={imgBalloon} size={150} rot={10} />
        </Anim>
      </Anim>
      <Anim kind="pop" d={1100} style={{ position: 'absolute', left: 260, top: 470 }}>
        <Sticker src={imgClap} size={110} rot={-10} />
      </Anim>
      <Anim kind="pop" d={1200} style={{ position: 'absolute', right: 250, top: 460 }}>
        <Sticker src={imgRainbow} size={120} rot={6} />
      </Anim>
    </Shell>
  );
};
WellDone.transition = Cover.transition;

// ─── Deck plumbing ──────────────────────────────────────────────────────────
// House transition: RISE (6 px, 260 ms). Cover and the last page use SETTLE.
export const transition: SlideTransition = {
  duration: 260,
  exit: { duration: 260, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: {
    duration: 260,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

const STYLE_ID = 'osd-styles-meet-my-classmates';
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
  title: 'Lesson 4 · Meet my classmates',
  createdAt: '2026-10-11T18:01:41.009Z',
};

export const notes: (string | undefined)[] = [
  `Accueil (1 min). « Hello, class! Today is Lesson 4: Meet my classmates. »
Présenter Liwa, Kate et Iheb : ce sont les camarades qui accompagnent toute la leçon.
Astuce : tous les boutons 🔊 utilisent la voix anglaise de l'ordinateur. Vérifier le son avant le cours.`,
  `Les objectifs, en mots d'enfants : présenter un camarade, le décrire, nommer les vêtements.
Lire les exemples avec la classe. On y revient à la fin avec « How did I do? ».`,
  `Activité 1 · Chanson (05 min). Air : « Frère Jacques ». Chaque ligne se chante deux fois (×2).
Couplet 1 affiché. Clic : couplet 2 (he). Clic : couplet 3 (she).
Cliquer sur une ligne la surligne et la fait lire, pour travailler la prononciation.
Faire montrer ses vêtements pour « I », un garçon pour « he », une fille pour « she ».`,
  `Activité 2 · Look at the picture (05 min). Poser les questions a à e, laisser répondre, puis cliquer pour afficher la réponse.
a. They are in the classroom. b. They are pupils / classmates.
c, d, e : le clic numérote les enfants un par un et la voix compte. 7 pupils, 4 boys, 3 girls.
Grammaire : How many + nom au pluriel → There are + nombre + pluriel (boys, girls, pupils).`,
  `Activité 3 · Look, listen and repeat (05 min).
Bouton « Listen » : la phrase est lue et chaque vêtement de Kate s'allume au fur et à mesure.
Cliquer une étiquette pour allumer un seul vêtement. Répétition en chœur, puis individuelle.
Phrase modèle : Kate is wearing a brown coat, a yellow pullover, blue trousers and red trainers.`,
  `Activité 4a · Flashcards (05 min). « Play all » lit les neuf mots avec une pause pour répéter.
Ou cliquer une carte : elle bouge et le mot est prononcé.
Ordre du guide : jeans, T-shirt, jacket, coat, trousers, skirt, trainers, shirt, dress.`,
  `Jeu · Listen and click. Un élève vient au tableau (ou la classe montre du doigt).
Gros bouton bleu : « Find the jacket! ». Bonne réponse = étoile + confettis, la consigne suivante part seule.
Mauvaise réponse : la carte tremble. « New game » mélange l'ordre.`,
  `Grammaire · present progressive. I am wearing / He is wearing / She is wearing.
Clic : he. Clic : she. Insister sur les formes courtes I'm, He's, She's.
Les questions : What are you wearing? What is he/she wearing?`,
  `Activité 4b · Conversation en binômes (10 min). Clic pour faire apparaître chaque réplique, 🔊 pour l'écouter.
Puis les élèves jouent le dialogue deux par deux avec leurs propres vêtements, et inversent les rôles.`,
  `À vous · Dress up and describe. Choisir I / He / She, puis un vêtement et une couleur par ligne.
La phrase se construit seule : laisser les élèves la dire d'abord, puis vérifier avec 🔊.
« Surprise me! » tire une tenue au hasard. Points de langue : an orange coat ; pas de « a » devant trousers, jeans, trainers, shoes.`,
  `Jeu · Who is it? Appuyer sur 🔊 (ou « Read » pour afficher la phrase). Les élèves trouvent l'enfant décrit et répondent « It's Mariem! ».
Attention : Rayen et Mariem portent tous les deux un pull rouge, et Rayen et Youssef un jean bleu. Il faut écouter toute la phrase.
« Next » passe à la description suivante.`,
  `Activité 5a · Look, listen and read (10 min). Loisirs : dancing, drawing, listening to music, singing, playing sports, reading books.
« Play all » ou clic sur chaque carte. Demander : « Do you like dancing? » → « Yes, I do! / No, I don't. »`,
  `Grammaire · and / but. AND ajoute une chose de plus (même idée). BUT montre une différence.
Clic : la carte BUT. Exemple du guide : I like singing but Amy loves reading.`,
  `Activité 5b · Compléter avec les mots de l'activité a. Cliquer le bon mot pour chaque trou. Une erreur fait trembler la phrase.
Réponses : 1. singing / reading. 2. drawing / dancing. 3. listening / sports.`,
  `Grammaire · This is (un seul) / These are (plusieurs). Jeans, trousers et trainers sont toujours au pluriel : These are my jeans.
Rappel : un garçon → He, une fille → She.`,
  `Quiz · This is ou These are ? Faire voter la classe avant de cliquer.
Réponses : coat → This is ; trainers → These are ; jeans → These are ; friends → These are ; friend → This is ; dress → This is.`,
  `Activité 5c · Le modèle. Clic pour chaque phrase : 1 le nom, 2 l'âge, 3 le loisir, 4 les vêtements.
« This is my friend Ahmed. He is 10. He likes playing sports. He is wearing a yellow coat, black jeans and blue trainers. »`,
  `Activité 5c · Groupes de trois (15 min). Lancer le minuteur (Start). Les élèves se posent les trois questions, puis présentent leur camarade à un autre groupe et décrivent ses vêtements.
Petites classes : un groupe circule dans la classe et chacun présente l'autre à tour de rôle.
Compétences de vie : prendre la parole avec confiance, attendre son tour, respecter les autres.`,
  `Jeu · Mystery classmate. « New classmate » crée un camarade au hasard. Un élève le présente avec les quatre phrases (le cadre l'aide).
« Show the answer » affiche le modèle, que la classe peut écouter avec 🔊.`,
  `Auto-évaluation. Pour chaque phrase, les élèves choisissent un visage : « Yes, I can! », « Almost » ou « Not yet ». On peut aussi faire voter à main levée.`,
  `Fin. « Well done, class! Goodbye! See you next time! » Rechanter la chanson si le temps le permet.`,
];

export default [
  Cover,
  Objectives,
  Song,
  LookPicture,
  KatePage,
  ClothesCards,
  ListenClick,
  GrammarWearing,
  PairTalk,
  DressUp,
  WhoIsIt,
  Hobbies,
  AndBut,
  Complete,
  ThisThese,
  QuizThis,
  IntroModel,
  GroupWork,
  MysteryGame,
  SelfCheck,
  WellDone,
] satisfies Page[];
