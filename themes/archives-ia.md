---
name: Archives IA
description: 1950s lab-archive look — manila paper with grain and binder holes, typewriter type (Special Elite + Courier Prime), stamp red, index cards, folders, paper-clipped photos and blue handwritten margin notes.
mode: light
---

# Archives IA

Extracted from the "Archives de l'IA" series (`slides/ai-history-sommaire` and `slides/ai-history-00…10`; screenshots in `docs/preview/aih-*.jpg`). Every deck is a *dossier* pulled from a lab archive: the page is a sheet of aged manila paper with a red margin rule and three binder holes, text is typed, key dates are rubber-stamped in red, people appear on ruled index cards ("fiches") with a paper-clipped black-and-white photo, and the author annotates in blue handwriting. It is the only theme in this repo that is **monospaced and textured** — use it for history, storytelling and "case file" decks, not for dense corporate training.

## Palette

| Role     | Value     | Notes                                                           |
| -------- | --------- | --------------------------------------------------------------- |
| bg       | `#ece3ce` | manila paper (plus grain + vignette, see Paper)                 |
| text     | `#27231d` | typewriter ink                                                  |
| accent   | `#b0352a` | stamp red — eyebrows, stamps, key words, highlighted chips      |
| muted    | `#7d7261` | labels, footer, captions                                        |
| soft     | `#4d463b` | body copy, subtitles                                            |
| faint    | `#b1a48a` | dashed borders, separators, dots                                |
| rule     | `#c9bb9c` | header rules, big quote marks                                   |
| sheet    | `#f7f0de` | cards, index cards, chips, polaroid borders (`#fffaf0` for photo borders) |
| redSoft  | `rgba(176,53,42,.12)` | fill of highlighted chips                           |
| blue     | `#2b4a7a` | handwriting (Caveat) and ruled-line ink only                    |

Era / folder tones (timeline ribbons, folders, tags) — golden ages warm, winters cold:

| Name      | Value     | Use                         |
| --------- | --------- | --------------------------- |
| pioneer   | `#d8c8a2` | early years                 |
| gold      | `#e3bd60` | first golden age            |
| goldLight | `#ead08e` | light variant               |
| winter    | `#aab9c5` | "AI winter" (add hatching)  |
| stat      | `#cfc6aa` | statistical era             |
| deep      | `#df9478` | deep-learning era           |
| gen       | `#d47a5e` | generative era              |
| folders   | `#e2cd9c` · `#d9c18f` · `#e7d4a8` | cycled for manila folders |

Effects:

- Bleed (ink spreading): `text-shadow: 0 0 0.8px rgba(39,35,29,.5)` on every typewriter heading.
- Paper shadow: `0 1px 0 rgba(255,255,255,.5) inset, 0 18px 30px -20px rgba(70,45,10,.6)`.
- Margin rule colour: `rgba(176,53,42,.32)`.
- Hatching (winters): `repeating-linear-gradient(135deg, rgba(255,255,255,.38) 0 6px, transparent 6px 14px)`.
- Photos: always `filter: grayscale(1) sepia(.5) contrast(1.05)` with a 5–9 px `#fffaf0` border.
- Radius: 4 px at most (cards and chips are essentially square); stamps 8 px; folder tabs 10 px on top.

Suggested `design` const:

```tsx
export const design: DesignSystem = {
  palette: { bg: '#ece3ce', text: '#27231d', accent: '#b0352a' },
  fonts: {
    display: '"Special Elite", "Courier New", monospace',
    body: '"Courier Prime", "Courier New", monospace',
  },
  typeScale: { hero: 130, body: 30 },
  radius: 4,
};
```

## Typography

- Display (titles, subtitles, big quotes, stamps, card headings): `"Special Elite", "Courier New", monospace` — single weight (400), always with the bleed text-shadow.
- Body (everything else): `"Courier Prime", "Courier New", monospace` — 400, **700 for labels and emphasis**, italic for credits and asides.
- Handwriting (margin notes only, blue): `"Caveat", "Segoe Print", "Bradley Hand", cursive` — weight 600, 32–34 px, slightly rotated (−2°).
- Webfont import: `https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Special+Elite&display=swap` — load it module-level, slide-keyed, per `references/webfonts.md` in `slide-authoring`.
- Type-scale overrides (monospace is wide, so sizes are **smaller than the `slide-authoring` defaults**):
  - Cover title: 130 px, line-height 1.0, typed letter by letter
  - Cover subtitle: 46 px, colour soft
  - Page title: 64 px, line-height 1.15
  - Pull quote: 46 px, line-height 1.3, with a 140 px `«` in `rule` colour
  - Body: 28–30 px, line-height 1.45
  - Labels / eyebrows / header / footer: 21–26 px, uppercase, 0.14–0.18 em tracking, bold
  - Card lines: 25 px; chips: 24 px bold; photo credits: 16–20 px italic

## Layout

- Canvas 1920 × 1080. Content column: **left 170, right 140** (width 1610) — the left margin clears the red margin rule at `x = 114` and the binder holes at `x = 44` (`y = 270 / 540 / 810`).
- Fixed chrome on content pages:
  - header text at `top: 58` ("ARCHIVES DE L'IA · DOSSIER Nº 01 — LE PERCEPTRON", muted, the first part bold in accent), a double rule (`1.5 px` top and bottom, 4 px apart) at `top: 100`, and the year as a small **stamp** at the top-right (`top: 44`, 28 px, −4°);
  - eyebrow at `top: 146` (accent, 24 px, uppercase), title at `top: 184`;
  - content band: `y ≈ 300 → 880`;
  - footer at `bottom: 44`: italic page-subject at the left, `FEUILLET 04 / 20` at the right.
- Cover and index pages drop the chrome: left column with eyebrow, 130 px title, subtitle, a short paragraph (width 800) and an **author card** at the bottom-left; right column with a stack of **manila folders** (tabs numbered `Nº 00…`), a typed label card, and a large tilted stamp (−8°, 64 px) of the date range.
- Two-column content pages: left = index card (width ≈ 660) with a clipped photo overlapping its bottom-right corner, right = quote / chips from `x ≈ 980`.
- Diagrams are boxes, not bubbles: `Chip` boxes with 2 px ink borders joined by plain `→` / `+` operators; the highlighted element uses a red border and `redSoft` fill; connectors are thin red lines (their thickness encodes weight).

## Fixed components

Paste-ready. Copy them verbatim into a slide using this theme. They rely on the `ar-` CSS classes defined in **Motion** below and on module-level constants:

```tsx
const ink = {
  text: '#27231d', soft: '#4d463b', muted: '#7d7261', faint: '#b1a48a', rule: '#c9bb9c',
  sheet: '#f7f0de', red: '#b0352a', redSoft: 'rgba(176, 53, 42, 0.12)', blue: '#2b4a7a',
};
const typewriter = '"Special Elite", "Courier New", monospace';
const mono = '"Courier Prime", "Courier New", monospace';
const hand = '"Caveat", "Segoe Print", "Bradley Hand", cursive';
const BLEED = '0 0 0.8px rgba(39, 35, 29, 0.5)';
const SHADOW = '0 1px 0 rgba(255, 255, 255, 0.5) inset, 0 18px 30px -20px rgba(70, 45, 10, 0.6)';
const MARGIN = 'rgba(176, 53, 42, 0.32)';
const L = 170;
const RIGHT = 140;
const CW = 1920 - L - RIGHT;
const vars = (o: Record<string, string | number>): React.CSSProperties => {
  const out: Record<string, string | number> = {};
  for (const k of Object.keys(o)) out[`--${k}`] = o[k];
  return out as React.CSSProperties;
};
const svgUrl = (s: string) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;
const GRAIN = svgUrl(
  `<svg xmlns='http://www.w3.org/2000/svg' width='360' height='360'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.42  0 0 0 0 0.32  0 0 0 0 0.18  1.2 0 0 0 -0.5'/></filter><rect width='360' height='360' filter='url(#g)'/></svg>`,
);
const GRUNGE = svgUrl(
  `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='m'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='4' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.4 0 0 0 2.05'/></filter><rect width='240' height='240' filter='url(#m)'/></svg>`,
);
```

### Paper (page ground: vignette, grain, margin rule, binder holes)

Render it first inside the page container (`position: relative`, background `#ece3ce`).

```tsx
const Hole = ({ y }: { y: number }) => (
  <div
    aria-hidden
    style={{
      position: 'absolute', left: 44, top: y - 18, width: 36, height: 36, borderRadius: 999,
      background: 'radial-gradient(circle at 42% 38%, #9c8762, #c4b089 72%)',
      boxShadow: 'inset 2px 3px 5px rgba(50, 32, 10, 0.45), 0 0 0 1px rgba(120, 95, 55, 0.25)',
    }}
  />
);

const Paper = () => (
  <>
    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 60% at 42% 38%, rgba(255, 251, 238, 0.6), rgba(255, 251, 238, 0) 72%), radial-gradient(ellipse 115% 100% at 50% 50%, rgba(0, 0, 0, 0) 60%, rgba(115, 82, 34, 0.2) 100%)' }} />
    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: GRAIN, backgroundSize: '360px 360px', opacity: 0.5 }} />
    <div aria-hidden style={{ position: 'absolute', left: 114, top: 0, bottom: 0, width: 4, borderLeft: `1.5px solid ${MARGIN}`, borderRight: `1.5px solid ${MARGIN}` }} />
    <Hole y={270} />
    <Hole y={540} />
    <Hole y={810} />
  </>
);
```

### Stamp (rubber stamp, red, grunge-masked)

```tsx
const Stamp = ({ children, pos, rot = -6, size = 40, color = ink.red, d = 0 }: { children: React.ReactNode; pos: React.CSSProperties; rot?: number; size?: number; color?: string; d?: number }) => (
  <div className="ar-stamp ar-in-st" style={{ ...vars({ r: `${rot}deg`, d: `${d}ms` }), position: 'absolute', transformOrigin: 'center', ...pos }}>
    <div
      style={{
        color,
        border: `${Math.max(3, Math.round(size / 12))}px solid currentColor`,
        borderRadius: 8,
        padding: `${Math.round(size * 0.14)}px ${Math.round(size * 0.32)}px ${Math.round(size * 0.1)}px`,
        fontFamily: typewriter, fontSize: size, lineHeight: 1, letterSpacing: '0.06em', textTransform: 'uppercase',
        whiteSpace: 'nowrap', opacity: 0.88,
        WebkitMaskImage: GRUNGE, maskImage: GRUNGE, WebkitMaskSize: '240px 240px', maskSize: '240px 240px',
      }}
    >
      {children}
    </div>
  </div>
);
```

### Label, Eyebrow, Title

```tsx
const Label = ({ children, c = ink.muted, size = 21 }: { children: React.ReactNode; c?: string; size?: number }) => (
  <span style={{ fontFamily: mono, fontWeight: 700, fontSize: size, letterSpacing: '0.14em', textTransform: 'uppercase', color: c, whiteSpace: 'nowrap' }}>{children}</span>
);

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div className="ar-in-fade" style={{ position: 'absolute', left: L, top: 146, fontFamily: mono, fontWeight: 700, fontSize: 24, letterSpacing: '0.14em', textTransform: 'uppercase', color: ink.red }}>
    {children}
  </div>
);

const Title = ({ text }: { text: string }) => (
  <h2 style={{ position: 'absolute', left: L, top: 184, margin: 0, maxWidth: CW, fontFamily: typewriter, fontWeight: 400, fontSize: 64, lineHeight: 1.15, textShadow: BLEED }}>
    <Typed text={text} d={120} step={24} />
  </h2>
);
```

### Typed (typewriter effect)

Characters appear one by one on entry; `\n` makes a line break.

```tsx
const Typed = ({ text, d = 0, step = 26 }: { text: string; d?: number; step?: number }) => {
  let i = 0;
  return (
    <span className="ar-ty">
      {Array.from(text).map((ch, k) =>
        ch === '\n' ? <br key={k} /> : <span key={k} className="ar-c" style={vars({ d: `${d + i++ * step}ms` })}>{ch}</span>,
      )}
    </span>
  );
};
```

### Header and Footer

Pull the page number from `useSlidePageNumber()` — never hardcode.

```tsx
import { useSlidePageNumber } from '@open-slide/core';

const SERIES = "Archives de l'IA";

const Header = ({ dossier, era }: { dossier: string; era?: string }) => (
  <>
    <div style={{ position: 'absolute', left: L, top: 58, fontFamily: mono, fontSize: 22, letterSpacing: '0.16em', textTransform: 'uppercase', color: ink.muted, whiteSpace: 'nowrap' }}>
      <span style={{ color: ink.red, fontWeight: 700 }}>{SERIES}</span>
      {` · ${dossier}`}
    </div>
    <div style={{ position: 'absolute', left: L, right: RIGHT, top: 100, height: 4, borderTop: `1.5px solid ${ink.rule}`, borderBottom: `1.5px solid ${ink.rule}` }} />
    {era ? <Stamp pos={{ right: RIGHT, top: 44 }} rot={-4} size={28} d={500}>{era}</Stamp> : null}
  </>
);

const Footer = ({ subject }: { subject: string }) => {
  const { current, total } = useSlidePageNumber();
  return (
    <div style={{ position: 'absolute', left: L, right: RIGHT, bottom: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: mono, fontSize: 22, color: ink.muted }}>
      <span style={{ fontStyle: 'italic' }}>{subject}</span>
      <span style={{ letterSpacing: '0.12em' }}>FEUILLET {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
    </div>
  );
};
```

### Hand (blue margin note), PaperClip, Tape

```tsx
const Hand = ({ children, x, y, w, rot = -2, size = 34, c = ink.blue, d = 0 }: { children: React.ReactNode; x: number; y: number; w?: number; rot?: number; size?: number; c?: string; d?: number }) => (
  <div className="ar-in-fade" style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: x, top: y, width: w, fontFamily: hand, fontWeight: 600, fontSize: size, lineHeight: 1.1, color: c, transform: `rotate(${rot}deg)`, transformOrigin: 'left top' }}>
    {children}
  </div>
);

const PaperClip = ({ x, y, rot = -8 }: { x: number; y: number; rot?: number }) => (
  <svg aria-hidden width={46} height={104} style={{ position: 'absolute', left: x, top: y, overflow: 'visible', transform: `rotate(${rot}deg)` }}>
    <path d="M 15 44 V 16 a 8 8 0 0 1 16 0 V 78 a 13 13 0 0 1 -26 0 V 12 a 18 18 0 0 1 36 0 V 64" fill="none" stroke="#868b91" strokeWidth={4} strokeLinecap="round" />
  </svg>
);

const Tape = ({ x, y, rot, w = 130 }: { x: number; y: number; rot: number; w?: number }) => (
  <div aria-hidden style={{ position: 'absolute', left: x, top: y, width: w, height: 38, background: 'rgba(238, 228, 198, 0.75)', boxShadow: '0 1px 3px rgba(80, 60, 20, 0.2)', transform: `rotate(${rot}deg)` }} />
);
```

### Fiche (index card with typed lines) and Chip

The ruled paper has a red header line at `top` px and blue lines every `gap` px.

```tsx
const ruled = (top: number, gap: number): React.CSSProperties => ({
  backgroundColor: ink.sheet,
  backgroundImage: `linear-gradient(to bottom, transparent ${top - 2}px, ${MARGIN} ${top - 2}px, ${MARGIN} ${top}px, transparent ${top}px), repeating-linear-gradient(to bottom, transparent 0, transparent ${gap - 1.5}px, rgba(43, 74, 122, 0.2) ${gap - 1.5}px, rgba(43, 74, 122, 0.2) ${gap}px)`,
  backgroundPosition: `0 0, 0 ${top}px`,
  boxShadow: SHADOW,
});

const CardLine = ({ label, value, d }: { label: string; value: string; d: number }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', height: 50 }}>
    <span style={{ width: 128, flex: 'none', fontWeight: 700, fontSize: 20, letterSpacing: '0.12em', color: ink.muted }}>{label}</span>
    <span style={{ fontSize: 25, color: ink.text }}><Typed text={value} d={d} step={22} /></span>
  </div>
);

const Fiche = ({ no, children }: { no: string; children: React.ReactNode }) => (
  <div style={{ width: '100%', height: '100%', padding: '22px 30px', boxSizing: 'border-box', transform: 'rotate(-1.5deg)', ...ruled(84, 50) }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', height: 56 }}>
      <span style={{ fontFamily: typewriter, fontSize: 30, color: ink.red }}>FICHE Nº {no}</span>
      <Label>Archives</Label>
    </div>
    <div style={{ marginTop: 12 }}>{children}</div>
  </div>
);

const Chip = ({ children, hot }: { children: React.ReactNode; hot?: boolean }) => (
  <span style={{ display: 'inline-block', padding: '6px 14px', border: `2px solid ${hot ? ink.red : ink.text}`, background: hot ? ink.redSoft : ink.sheet, color: hot ? ink.red : ink.text, fontWeight: 700, fontSize: 24, lineHeight: 1.2 }}>
    {children}
  </span>
);

const Op = ({ children }: { children: React.ReactNode }) => (
  <span style={{ margin: '0 12px', fontFamily: 'Arial, "Segoe UI Symbol", sans-serif', fontSize: 30, fontWeight: 700, color: ink.muted }}>{children}</span>
);
```

### Photo (paper-clipped ID photo)

`src` is the imported image (e.g. `import turing from '@assets/ai-history/turing.jpg'`). Always give a credit line below it.

```tsx
const Photo = ({ src, alt, w = 200, h = 260, rot = 3.5 }: { src: string; alt: string; w?: number; h?: number; rot?: number }) => (
  <div style={{ position: 'relative', transform: `rotate(${rot}deg)` }}>
    <img src={src} alt={alt} style={{ display: 'block', width: w, height: h, objectFit: 'cover', border: '9px solid #fffaf0', boxShadow: '0 16px 26px -14px rgba(60, 40, 10, 0.6)', filter: 'grayscale(1) sepia(0.5) contrast(1.05)' }} />
    <PaperClip x={34} y={-14} rot={-6} />
  </div>
);
```

### Folder (manila folder with numbered tab — covers and indexes)

```tsx
const FOLDER_TONES = ['#e2cd9c', '#d9c18f', '#e7d4a8'];

const Folder = ({ n }: { n: number }) => {
  const top = 372 + n * 30;
  const tabX = 24 + (n % 4) * 150;
  return (
    <div className="ar-in-slide" style={{ ...vars({ d: `${900 + n * 90}ms` }), position: 'absolute', left: 1040, top, width: 700, height: 300 }}>
      <div style={{ position: 'absolute', left: tabX, top: -38, width: 128, height: 42, borderRadius: '10px 10px 0 0', background: FOLDER_TONES[n % 3], boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 -1px 0 rgba(120, 90, 40, 0.25)', display: 'grid', placeItems: 'center', fontFamily: typewriter, fontSize: 24, color: ink.soft }}>
        Nº {String(n).padStart(2, '0')}
      </div>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 6, background: FOLDER_TONES[n % 3], boxShadow: '0 -2px 0 rgba(120, 90, 40, 0.18), 0 -10px 18px -12px rgba(70, 45, 10, 0.45)' }} />
    </div>
  );
};
```

### Page shell

```tsx
const Sheet = ({ children }: { children: React.ReactNode }) => (
  <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#ece3ce', color: ink.text, fontFamily: mono, fontSize: 28 }}>
    <Paper />
    {children}
  </div>
);
```

(In a real slide use the `Frame` pattern from `ai-history-sommaire`: it adds `useIsActivePage()` → an `ar-live` class so entrance animations run only on the active page, plus `Beats` for click-driven steps.)

## Motion

- Philosophy: **subtle but tactile** — nothing bounces. Text is *typed* (24–70 ms per character), headings and cards rise 14–16 px, stamps slam down (scale 1.9 → 0.94 → 1 with a slight rotation, 480 ms), folders slide up from below in sequence, connectors are drawn as strokes, and click beats reveal one chip row or annotation at a time. Page transitions are 260 ms (opacity + 6 px rise); the cover adds a 4 px blur-in. `prefers-reduced-motion` disables all animation.
- Entrance classes only animate while the page is active (gate an `ar-live` class with `useIsActivePage()`), so thumbnails stay fully composed.
- Reusable CSS (class names used by the components above):

```css
@keyframes ar-rise  { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes ar-fade  { from { opacity: 0; } to { opacity: 1; } }
@keyframes ar-type  { from { opacity: 0; } to { opacity: 1; } }
@keyframes ar-draw  { from { stroke-dashoffset: 1.01; } to { stroke-dashoffset: 0; } }
@keyframes ar-stamp { 0% { opacity: 0; transform: rotate(var(--r, 0deg)) scale(1.9); } 35% { opacity: 1; } 70% { transform: rotate(var(--r, 0deg)) scale(.94); } 100% { opacity: 1; transform: rotate(var(--r, 0deg)) scale(1); } }
@keyframes ar-slide { from { opacity: 0; transform: translateY(120px); } to { opacity: 1; transform: none; } }
.ar-stamp { transform: rotate(var(--r, 0deg)); }
.ar-in      { animation: ar-rise 800ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
.ar-in-fade { animation: ar-fade 900ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
.ar-in-st   { animation: ar-stamp 480ms cubic-bezier(0, 0, 0.2, 1) var(--d, 0ms) both; }
.ar-in-slide{ animation: ar-slide 900ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
.ar-ty .ar-c{ animation: ar-type 40ms linear var(--d, 0ms) both; }
@media (prefers-reduced-motion: reduce) { .ar-in, .ar-in-fade, .ar-in-st, .ar-in-slide, .ar-ty .ar-c { animation: none !important; } }
```

- Page transitions:

```tsx
export const transition: SlideTransition = {
  duration: 260,
  exit: { duration: 260, easing: 'cubic-bezier(0.4, 0, 1, 1)', keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: {
    duration: 260,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

// Cover: Cover.transition = {…same, duration 280, enter keyframes with
//   { opacity: 0, transform: 'translateY(12px)', filter: 'blur(4px)' } → { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' } }
```

## Aesthetic

A mid-century laboratory archive: warm manila paper, a red margin rule, three binder holes, text struck by a typewriter and dates hit with a red rubber stamp. People are documented, not illustrated — a ruled index card with typed fields, a small black-and-white photo held by a paper clip, a source credit in italics, and one line of blue handwriting in the margin. Diagrams look like forms: square boxes, plain arrows, one red highlighted element per diagram. Colour is almost monochrome (ink on paper) with a single accent, stamp red; blue exists only as pen ink. Everything is slightly imperfect — tilted cards (±1–3°), ink bleed, grain — but never messy: alignment to the 170 px column is strict. Avoid: sans-serif fonts, rounded UI cards, gradients other than paper shading, emoji, saturated colour fills, colour photos (always desaturate and sepia them), more than one stamp per page body.

## Example usage

```tsx
const Cover: Page = () => (
  <Sheet>
    <div style={{ position: 'absolute', left: L, top: 156, fontFamily: mono, fontWeight: 700, fontSize: 26, letterSpacing: '0.18em', textTransform: 'uppercase', color: ink.red }}>
      Dossier Nº 01
    </div>
    <h1 style={{ position: 'absolute', left: L - 6, top: 204, margin: 0, fontFamily: typewriter, fontWeight: 400, fontSize: 130, lineHeight: 1, textShadow: BLEED }}>
      <Typed text={'Le\nPerceptron'} d={250} step={70} />
    </h1>
    <div style={{ position: 'absolute', left: L, top: 488, fontFamily: typewriter, fontSize: 46, lineHeight: 1.12, color: ink.soft, textShadow: BLEED }}>
      <Typed text={'La machine\nqui apprend'} d={1500} step={30} />
    </div>
    <Stamp pos={{ left: 1300, top: 150 }} rot={-8} size={64} d={1300}>1957</Stamp>
  </Sheet>
);
```

(`Sheet` is the *Page shell* above; it is not called `Page` to avoid clashing with the `Page` type.)
