---
name: Technologia
description: Technologia training look — light cool-grey ground, anthracite text, Barlow Condensed titles, and the brand's overlapping blue / yellow / green squares used as mark, section number, portrait frame and progress squares.
mode: light
---

# Technologia

Extracted from `slides/ia-agentique-feuille-de-route` (formation IA134). A clean, airy training identity built around one signature motif — **two overlapping squares, blue (top-left) and yellow (bottom-right), green where they overlap** — taken from the Technologia logo. Compared with the Docaposte / Navy Flow themes it is lighter and more neutral: anthracite ink instead of navy, square (not rounded) brand shapes, condensed headlines, and a tri-colour stripe on top.

## Palette

| Role     | Value     | Notes                                                       |
| -------- | --------- | ----------------------------------------------------------- |
| bg       | `#F4F7F9` | page background (cool off-white)                            |
| text     | `#2B2F33` | primary copy and titles (anthracite, same as the wordmark)  |
| accent   | `#1F78C1` | eyebrows, links, active progress square, key numbers        |
| muted    | `#77818A` | captions, footer, hints                                     |
| blue     | `#1F78C1` | brand blue (flat); gradient start `#2A74BF`                 |
| sky      | `#3D9FCB` | mid blue of the logo gradient, mini-mark square             |
| aqua     | `#6CCBD0` | light end of the blue gradient                              |
| teal     | `#22A6B3` | data / documents                                            |
| green    | `#3A9F45` | overlap square, success, exercises                          |
| yellow   | `#FFD000` | brand yellow — marker highlights, workshops (text on it: ink) |
| amber    | `#E8A600` | yellow used as text or icon colour on white                 |
| coral    | `#E0573D` | errors, risks, "do not"                                     |
| violet   | `#6B57C9` | quizzes, secondary accent (use sparingly)                   |
| soft     | `#4B545B` | body copy inside cards, ledes                               |
| faint    | `#AFB8C0` | arrows, disabled, placeholder                               |
| rule     | `#DCE3E8` | dividers, empty progress squares                            |
| panel    | `#EAF0F4` | progress tracks, inset panels                               |
| card     | `#FFFFFF` | cards                                                       |

Tinted tone set (background / border / foreground) for tags, callouts and icon tiles:

| Tone   | bg        | border    | fg        |
| ------ | --------- | --------- | --------- |
| blue   | `#E4F0FA` | `#93C1E8` | `#1A65A3` |
| teal   | `#DFF3F5` | `#86D0D6` | `#137C87` |
| green  | `#E4F3E3` | `#95CD93` | `#2B7A33` |
| yellow | `#FFF5CC` | `#F0CB45` | `#7D6000` |
| coral  | `#FCE7E2` | `#EFA593` | `#B3432B` |
| violet | `#ECE8F9` | `#B6A9E6` | `#5644A6` |
| grey   | `#EEF2F5` | `#CBD4DB` | `#4B545B` |

Gradients (the three brand squares and the blue bar):

- Blue: `linear-gradient(135deg, #2A74BF 0%, #3D9FCB 55%, #6CCBD0 100%)`
- Green: `linear-gradient(135deg, #0F9A4A 0%, #47A83F 60%, #7DB83A 100%)`
- Yellow: `linear-gradient(135deg, #FFE24D 0%, #FFD000 55%, #F4B400 100%)`
- Brand stripe (8 px, top of every page): blue→aqua `flex 6`, flat green `flex 2`, yellow gradient `flex 3`.

Shadows: card `0 0 0 1px rgba(43,47,51,.06), 0 18px 40px -26px rgba(20,60,100,.40)` · small `0 0 0 1px rgba(43,47,51,.07), 0 8px 20px -14px rgba(20,60,100,.45)`. Radius: 18 px (cards), 14 px (callouts), 8 px (kind badges), 999 px (tags). **Brand squares, progress squares and the portrait have square corners — never round them.**

Suggested `design` const:

```tsx
export const design: DesignSystem = {
  palette: { bg: '#F4F7F9', text: '#2B2F33', accent: '#1F78C1' },
  fonts: {
    display: '"Barlow Condensed", "Arial Narrow", "Segoe UI", sans-serif',
    body: '"Barlow", "Segoe UI", system-ui, -apple-system, sans-serif',
  },
  typeScale: { hero: 128, body: 30 },
  radius: 18,
};
```

## Typography

- Display font: `"Barlow Condensed", "Arial Narrow", "Segoe UI", sans-serif` — weight 700 for titles, 600 for eyebrows and labels, uppercase + 0.14 em tracking on eyebrows.
- Body font: `"Barlow", "Segoe UI", system-ui, -apple-system, sans-serif` — weight 400, 500–600 for emphasis.
- Mono (page numbers, code): `"JetBrains Mono", ui-monospace, Consolas, monospace`.
- Webfont import: `https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Barlow+Condensed:wght@500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap` — load it module-level, slide-keyed, per `references/webfonts.md` in `slide-authoring`.
- Type-scale overrides (condensed type reads smaller, so sizes run larger than the Navy Flow family):
  - Hero title (cover): 118–128 px, weight 700, line-height 1.0
  - Section title: 104 px, beside a 300 px white number on the squares
  - Page title: 64 px, line-height 1.08, anthracite
  - Lede under the title: 30 px, colour soft
  - Body in cards / bullets: 24–32 px
  - Eyebrow: 24–28 px; header / footer text: 20–24 px (never below 19 px)

## Layout

- Canvas 1920 × 1080, content padding **120 px** left and right.
- Every page carries the 8 px tri-colour **brand stripe** at the very top.
- Content pages: header at `top: 42` (mini squares + uppercase blue module label left, `JOUR n` + numbered progress squares right); title at `top: 108`, lede at `top: 192`, content from `top: 270–290`; footer at `bottom: 28`, 46 px tall (logo · trainer · course | `Jour n · 05 / 42`).
- Cover and closing pages drop the header: stacked logo at `left: 112, top: 78, height 150` (120 on closing), content block at `left: 120, top: 318`, trainer chip (96 px round photo with a 4 px white + 3 px yellow ring) at `top: 870`, a large illustration or the big `Squares` on the right.
- Section pages: `Squares s=430` at `x 130, y 250` with a 300 px white module number in the blue square; text block at `left: 820, top: 230` (eyebrow `Module 03` + duration tag, 104 px title, 32 px sub, items with a `MiniSquares` bullet); the logo sits bottom-left and the page number bottom-right.
- Background: `#F4F7F9` plus two soft radial glows (white top-left, aqua `rgba(108,203,208,.10)` bottom-right).
- Cards: 2, 3 or 4 equal columns with 22–30 px gaps, white, 7 px coloured top bar. Colour is functional and identical across pages.

## Fixed components

Paste-ready. Copy them verbatim into a slide using this theme (replace `AUTHOR` / `COURSE`). In a real slide, replace `Logo` by the official artwork — `<img src={logoWide} alt="Technologia" style={{ height: 40, display: 'block', mixBlendMode: 'multiply' }} />` with `import logoWide from '@assets/technologia/logo-horizontal.png'` (and `logo-stack.png` for covers). `Logo` below is a self-contained stand-in so the demo can preview without assets.

### MiniSquares (small brand mark)

```tsx
const MiniSquares = ({ size = 22 }: { size?: number }) => {
  const s = Math.round(size * 0.75);
  const o = size - s;
  return (
    <span style={{ position: 'relative', display: 'inline-block', flex: 'none', width: size, height: size }}>
      <span style={{ position: 'absolute', left: o, top: o, width: s, height: s, background: '#FFD000' }} />
      <span style={{ position: 'absolute', left: 0, top: 0, width: s, height: s, background: '#3D9FCB' }} />
      <span style={{ position: 'absolute', left: o, top: o, width: s - o, height: s - o, background: '#3A9F45' }} />
    </span>
  );
};
```

### Logo (stand-in lockup)

```tsx
const Logo = ({ h = 40 }: { h?: number }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(h * 0.3), flex: 'none' }}>
    <MiniSquares size={h} />
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
      <span style={{ fontFamily: '"Barlow Condensed", "Arial Narrow", sans-serif', fontWeight: 700, fontSize: h * 0.82, letterSpacing: '0.02em', color: '#2B2F33' }}>TECHNOLOGIA</span>
      <span style={{ marginTop: h * 0.08, fontFamily: '"Barlow", sans-serif', fontWeight: 500, fontSize: h * 0.26, color: '#4B545B', whiteSpace: 'nowrap' }}>
        Former. Performer. Transformer.
      </span>
    </div>
  </div>
);
```

### Squares (large brand motif)

Blue top-left, yellow bottom-right, green overlap. `s` is the square side; the overall box is `s × 1.33`. Children are placed inside (e.g. the section number).

```tsx
const Squares = ({ s, x, y, children }: { s: number; x: number; y: number; children?: React.ReactNode }) => {
  const o = Math.round(s * 0.33);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: s + o, height: s + o }}>
      <div className="tc-sqb" style={{ position: 'absolute', left: o, top: o, width: s, height: s, background: 'linear-gradient(135deg, #FFE24D 0%, #FFD000 55%, #F4B400 100%)' }} />
      <div className="tc-sqa" style={{ position: 'absolute', left: 0, top: 0, width: s, height: s, background: 'linear-gradient(135deg, #2A74BF 0%, #3D9FCB 55%, #6CCBD0 100%)' }} />
      <div className="tc-sqc" style={{ position: 'absolute', left: o, top: o, width: s - o, height: s - o, background: 'linear-gradient(135deg, #0F9A4A 0%, #47A83F 60%, #7DB83A 100%)' }} />
      {children}
    </div>
  );
};
```

### BrandStripe

```tsx
const BrandStripe = () => (
  <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 8, display: 'flex' }}>
    <div style={{ flex: 6, background: 'linear-gradient(90deg, #2A74BF, #6CCBD0)' }} />
    <div style={{ flex: 2, background: '#3A9F45' }} />
    <div style={{ flex: 3, background: 'linear-gradient(135deg, #FFE24D 0%, #FFD000 55%, #F4B400 100%)' }} />
  </div>
);
```

### Title

```tsx
const Title = ({ children, top = 108, size = 64 }: { children: React.ReactNode; top?: number; size?: number }) => (
  <h2
    style={{
      position: 'absolute',
      left: 120,
      top,
      margin: 0,
      maxWidth: 1680,
      fontFamily: '"Barlow Condensed", "Arial Narrow", "Segoe UI", sans-serif',
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.08,
      letterSpacing: '-0.005em',
      color: '#2B2F33',
    }}
  >
    {children}
  </h2>
);
```

### Footer

Pull the page number from `useSlidePageNumber()` — never hardcode `pageNum` / `total` props.

```tsx
import { useSlidePageNumber } from '@open-slide/core';

const AUTHOR = 'Prénom Nom';
const COURSE = 'Intitulé de la formation';

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        bottom: 28,
        height: 46,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: '"Barlow", "Segoe UI", system-ui, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <Logo h={34} />
        <span style={{ width: 1.5, height: 26, background: '#DCE3E8' }} />
        <span style={{ fontSize: 20, fontWeight: 600, color: '#4B545B' }}>{AUTHOR}</span>
        <span style={{ width: 1.5, height: 26, background: '#DCE3E8' }} />
        <span style={{ fontSize: 20, color: '#77818A' }}>{COURSE}</span>
      </div>
      <span style={{ fontFamily: '"JetBrains Mono", ui-monospace, Consolas, monospace', fontSize: 20, color: '#77818A', letterSpacing: '0.04em' }}>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};
```

### Eyebrow

```tsx
const Eyebrow = ({ children, color = '#1F78C1', size = 24 }: { children: React.ReactNode; color?: string; size?: number }) => (
  <div
    style={{
      fontFamily: '"Barlow Condensed", "Arial Narrow", "Segoe UI", sans-serif',
      fontWeight: 600,
      fontSize: size,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color,
    }}
  >
    {children}
  </div>
);
```

### Progress square (header, optional)

Numbered squares — blue = current, pale blue = done, outlined = to come.

```tsx
const ProgSq = ({ n, mod }: { n: number; mod: number }) => {
  const now = n === mod;
  const past = mod > n;
  return (
    <span
      style={{
        width: 34,
        height: 34,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Barlow Condensed", "Arial Narrow", sans-serif',
        fontWeight: 700,
        fontSize: 18,
        background: now ? '#1F78C1' : past ? '#D3E6F5' : 'transparent',
        color: now ? '#fff' : past ? '#1F78C1' : '#AFB8C0',
        boxShadow: now || past ? 'none' : 'inset 0 0 0 2px #DCE3E8',
      }}
    >
      {String(n).padStart(2, '0')}
    </span>
  );
};
```

### Portrait (trainer photo framed by the squares)

Pass the imported photo as `src` (e.g. `import formateur from '@assets/houssem-formateur.png'`). Photo ratio 230 × 275; square corners.

```tsx
const Portrait = ({ src, name, w = 280, x, y }: { src: string; name: string; w?: number; x: number; y: number }) => {
  const h = Math.round((w * 275) / 230);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h }}>
      <div style={{ position: 'absolute', left: Math.round(w * 0.2), top: Math.round(h * 0.2), width: w, height: h, background: 'linear-gradient(135deg, #FFE24D 0%, #FFD000 55%, #F4B400 100%)' }} />
      <div style={{ position: 'absolute', left: -Math.round(w * 0.14), top: -Math.round(w * 0.14), width: Math.round(w * 0.55), height: Math.round(w * 0.55), background: 'linear-gradient(135deg, #2A74BF 0%, #3D9FCB 55%, #6CCBD0 100%)' }} />
      <img src={src} alt={name} style={{ position: 'relative', display: 'block', width: w, height: h, objectFit: 'cover', boxShadow: '0 24px 50px -24px rgba(0,0,0,.55)' }} />
    </div>
  );
};
```

### Card

```tsx
const Card = ({ title, color = '#1F78C1', children }: { title: string; color?: string; children: React.ReactNode }) => (
  <div
    style={{
      position: 'relative',
      boxSizing: 'border-box',
      background: '#FFFFFF',
      borderRadius: 18,
      boxShadow: '0 0 0 1px rgba(43,47,51,.06), 0 18px 40px -26px rgba(20,60,100,.40)',
      padding: '36px 30px 30px',
    }}
  >
    <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 7, borderRadius: '18px 18px 0 0', background: color }} />
    <div style={{ fontFamily: '"Barlow Condensed", "Arial Narrow", sans-serif', fontWeight: 700, fontSize: 34, lineHeight: 1.08, color: '#2B2F33' }}>{title}</div>
    <div style={{ marginTop: 12, fontSize: 26, lineHeight: 1.45, color: '#4B545B' }}>{children}</div>
  </div>
);
```

### Highlight (yellow marker)

```tsx
const Hl = ({ children }: { children: React.ReactNode }) => (
  <mark style={{ background: 'linear-gradient(transparent 58%, rgba(255,208,0,.55) 58%)', color: 'inherit', padding: '0 3px' }}>{children}</mark>
);
```

## Motion

- Philosophy: **rich** — each page builds in on entry (staggered rise / slide / pop, 700–1100 ms, `cubic-bezier(0.22, 1, 0.36, 1)`); the brand squares slide in from opposite corners (blue from top-left, yellow from bottom-right) and the green overlap pops last; diagrams use drawn or marching dashed arrows; one idea per press. Page transitions stay short (240–260 ms).
- Entrance animations only run while the page is active (gate a `-live` class with `useIsActivePage()`) so thumbnails and overview stay fully composed.
- Reusable keyframes:

```css
@keyframes tc-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
@keyframes tc-left { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: none; } }
@keyframes tc-pop  { 0% { opacity: 0; transform: scale(.6); } 60% { opacity: 1; transform: scale(1.05); } 100% { opacity: 1; transform: scale(1); } }
@keyframes tc-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes tc-sqa  { from { opacity: 0; transform: translate(-46px, -46px); } to { opacity: 1; transform: none; } }
@keyframes tc-sqb  { from { opacity: 0; transform: translate(46px, 46px); } to { opacity: 1; transform: none; } }
.tc-in   { animation: tc-rise 800ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
.tc-left { animation: tc-left 800ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
.tc-pop  { animation: tc-pop 700ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
.tc-grow { transform-origin: left center; animation: tc-grow 1000ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
.tc-sqa  { animation: tc-sqa 1100ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
.tc-sqb  { animation: tc-sqb 1100ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
.tc-sqc  { animation: tc-pop 800ms cubic-bezier(0.22, 1, 0.36, 1) calc(var(--d, 0ms) + 700ms) both; }
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

// For section dividers: Page.transition = BLOOM
export const BLOOM: SlideTransition = {
  duration: 240,
  exit: { duration: 240, easing: 'cubic-bezier(0.4, 0, 1, 1)', keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: {
    duration: 240,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
    keyframes: [
      { opacity: 0, transform: 'scale(0.97)' },
      { opacity: 1, transform: 'scale(1)' },
    ],
  },
};
```

## Aesthetic

Bright, confident and orderly: a cool off-white ground, anthracite condensed headlines that do the talking, and the Technologia squares — blue, yellow and their green overlap — as the single decorative device, reused as logo, section number, bullet, portrait frame and progress squares. Everything brand-related is **square-cornered**; only content cards, callouts and tags are rounded. Yellow is a highlighter (marker underline, workshop badge), not a fill for large areas; blue is the action colour. It feels like a modern, practical training firm — "Former. Performer. Transformer." — not a corporate slab deck. Avoid: dark backgrounds on content pages, rounded or recoloured brand squares, gradients other than the three brand ones, emoji, decorative stock photos.

## Example usage

```tsx
const Cover: Page = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#F4F7F9', color: '#2B2F33', fontFamily: '"Barlow", "Segoe UI", system-ui, sans-serif' }}>
    <BrandStripe />
    <div style={{ position: 'absolute', left: 112, top: 78 }}><Logo h={64} /></div>
    <div style={{ position: 'absolute', left: 120, top: 318, width: 1000 }}>
      <Eyebrow size={28}>Formation IA134 · 2 jours · 14 h</Eyebrow>
      <h1 style={{ margin: '18px 0 0', fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: 118, lineHeight: 1, letterSpacing: '-0.01em' }}>
        Feuille de route<br />pour l’IA agentique
      </h1>
      <p style={{ margin: '26px 0 0', fontSize: 40, lineHeight: 1.25, color: '#4B545B' }}>Une exploration complète des agents d’IA</p>
    </div>
    <Squares s={380} x={1280} y={260} />
    <Footer />
  </div>
);
```
