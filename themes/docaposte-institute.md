---
name: Docaposte Institute
description: Docaposte training look — cool off-white ground, navy slabs, electric blue + violet accents, Montserrat + Open Sans, the three-bar mark and "DOCAPOSTE Institute" lockup, "Together we grow" script signature.
mode: light
---

# Docaposte Institute

Extracted from `slides/docaposte-dev-ia` and `slides/copilot-avance`. It is the **branded** sibling of `navy-flow` (same palette, type and layout skeleton) with the Docaposte signature elements: the three-bar mark (`DapMark`), the `DapLogo` lockup in the footer / section slab / closing page, the handwritten "Together we grow" tagline, and the offset-outline trainer portrait. Use it for any course delivered under the Docaposte Institute banner; use `navy-flow` when no branding is wanted.

## Palette

| Role     | Value     | Notes                                                    |
| -------- | --------- | -------------------------------------------------------- |
| bg       | `#F6F8FC` | page background (cool off-white)                         |
| text     | `#101828` | primary copy (ink)                                       |
| accent   | `#0A62D0` | links, primary buttons, bullets, key numbers             |
| muted    | `#6B7690` | captions, footer, hints                                  |
| navy     | `#0B1F5C` | titles, slabs (cover / section pages), brand stripe      |
| electric | `#1E22E8` | the Docaposte mark + wordmark, eyebrows, signature       |
| violet   | `#7442E0` | secondary accent, quiz, portrait outline, highlights     |
| plum     | `#7A2FA6` | first line of hero titles                                |
| pink     | `#C2369E` | gradient end, human-validation colour                    |
| soft     | `#3B4558` | body copy inside cards, ledes                            |
| faint    | `#A9B3C6` | arrows, disabled, placeholder                            |
| rule     | `#DDE3EE` | dividers, card outlines                                  |
| panel    | `#EBEFF7` | progress tracks, inset panels                            |
| card     | `#FFFFFF` | cards                                                    |
| lilac    | `#AEB9E6` | small labels and outlines on navy slabs                  |
| teal     | `#0E9AAE` | data / documents                                         |
| green    | `#0E9F6E` | success, labs, actions                                   |
| yellow   | `#F2A20C` | conditions, workshops, warnings (text on it: ink)        |
| coral    | `#E04848` | errors, risks, security, "do not"                        |

Tinted tone set (background / border / foreground) for tags, callouts and icon tiles:

| Tone   | bg        | border    | fg        |
| ------ | --------- | --------- | --------- |
| blue   | `#E6F0FC` | `#97BFF0` | `#0A55B5` |
| navy   | `#E7EBF5` | `#9EABCF` | `#0B1F5C` |
| teal   | `#E1F5F7` | `#86D0DA` | `#0B7686` |
| green  | `#E2F6EE` | `#8ED3B6` | `#0A7A55` |
| yellow | `#FEF3DC` | `#F3C566` | `#8A5A00` |
| coral  | `#FDE8E8` | `#F0A3A3` | `#B42F2F` |
| violet | `#EFE9FC` | `#BFA8F2` | `#5A2FC2` |
| pink   | `#FBE8F5` | `#E9A6D5` | `#9C2380` |
| grey   | `#EEF1F6` | `#CDD4E0` | `#3B4558` |

Gradients:

- Brand stripe: `linear-gradient(90deg, #0B1F5C 0%, #1E22E8 55%, #7442E0 100%)`
- Slab: `linear-gradient(160deg, #0B1F5C 0%, #142C7A 100%)`
- Primary bar: `linear-gradient(120deg, #0A62D0 0%, #1E22E8 100%)`
- Accent bar / section underline: `linear-gradient(120deg, #7442E0 0%, #C2369E 100%)`

Shadows: card `0 0 0 1px rgba(16,24,40,.06), 0 18px 40px -26px rgba(11,31,92,.40)` · small `0 0 0 1px rgba(16,24,40,.07), 0 8px 20px -14px rgba(11,31,92,.45)`. Radius: 18 px (cards), 14 px (callouts), 8 px (kind badges), 999 px (tags).

Suggested `design` const:

```tsx
export const design: DesignSystem = {
  palette: { bg: '#F6F8FC', text: '#101828', accent: '#0A62D0' },
  fonts: {
    display: '"Montserrat", "Segoe UI", system-ui, sans-serif',
    body: '"Open Sans", "Segoe UI", system-ui, -apple-system, sans-serif',
  },
  typeScale: { hero: 112, body: 28 },
  radius: 18,
};
```

## Typography

- Display font: `"Montserrat", "Segoe UI", system-ui, sans-serif` — weight 800 for titles, 700 for card titles and eyebrows, 600 for the `DOCAPOSTE` wordmark, letter-spacing −0.01 to −0.02 em on large titles.
- Body font: `"Open Sans", "Segoe UI", system-ui, -apple-system, sans-serif` — weight 400, 600 for emphasis.
- Mono (code, URLs, page numbers): `"JetBrains Mono", ui-monospace, Consolas, monospace`.
- Script (signature only, cover + closing, never for content): `"Mr Dafoe", "Segoe Script", cursive`, 78 px, colour electric, rotated −7°.
- Webfont import: `https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,500;0,600;0,700;0,800;1,700&family=Open+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;700&family=Mr+Dafoe&display=swap` — load it module-level, slide-keyed, per `references/webfonts.md` in `slide-authoring`.
- Type-scale overrides — **denser than the `slide-authoring` defaults** (course decks carry cards, diagrams and polls):
  - Hero title (cover): 84–96 px, weight 800, line-height 1.06–1.1
  - Section title (module divider): 76 px, with a 300 px module number on the navy slab
  - Closing "Merci !": 120 px
  - Page title: 54 px, line-height 1.12, colour navy
  - Lede under the title: 28 px, colour soft
  - Body in cards / bullets: 22–30 px (never below 19 px for secondary lines)
  - Caption / eyebrow / footer: 19–22 px; eyebrows uppercase, 0.14 em tracking

## Layout

- Canvas 1920 × 1080, content padding **120 px** left and right.
- Content pages: top brand stripe (7 px) + left navy stripe (16 px); header at `top: 40` (mark + module label left, `JOUR n` progress squares right); title at `top: 104`, lede at `top: 184`, content from `top: 260–280`; footer at `bottom: 26`, 44 px tall holding the `DapLogo`, trainer name, course title and `Jour n · 05 / 42`.
- Cover and closing pages drop the chrome: a navy **slab** (`x −70, w 370, r 64`) bleeds off the left edge, content starts at `left: 390`, outline frames peek in at the top-right (`x 1450, w 560, r 46`) and bottom-left (lilac). The `DapLogo` (40 px) sits bottom-right at `left 1500, top 720`; the footer starts at `left: 390`.
- Section pages: wide slab (`x −60, w 700, r 56`) with a lilac `MODULE · JOUR n` label, a 300 px white module number, a 150 × 8 violet→pink underline and a white `DapLogo` at the bottom; title block at `left 760, top 200`; outline frames top-right and bottom-right (violet).
- Background: `#F6F8FC` plus three soft radial glows (white top-left, violet bottom-right, electric top-right).
- Content grids: 2, 3 or 4 equal columns with 22–30 px gaps; white cards with a 7 px coloured top bar. One colour per role, identical across all pages (trigger blue · data teal · AI violet · condition yellow · action green · human validation pink · result navy).

## Fixed components

Paste-ready. Copy them verbatim into a slide using this theme (replace `AUTHOR` / `COURSE`). The brand marks are reproduced from the existing decks — never redraw or recolour them beyond `color`.

### DapMark (three-bar mark)

```tsx
const DapMark = ({ h = 28, color = '#1E22E8', style }: { h?: number; color?: string; style?: React.CSSProperties }) => (
  <svg width={(h * 58) / 30} height={h} viewBox="0 0 58 30" style={{ display: 'block', flex: 'none', ...style }} aria-hidden>
    <rect x={6} y={0} width={40} height={6} rx={3} fill={color} />
    <rect x={16} y={12} width={42} height={6} rx={3} fill={color} />
    <rect x={0} y={24} width={42} height={6} rx={3} fill={color} />
  </svg>
);
```

### DapLogo ("DOCAPOSTE Institute" lockup)

`size` is the font size of `DOCAPOSTE`. Electric on light grounds, `#FFFFFF` on navy.

```tsx
const DAP_LS = 0.09;
const DapLogo = ({ size = 26, color = '#1E22E8' }: { size?: number; color?: string }) => (
  <div
    role="img"
    aria-label="Docaposte Institute"
    style={{ display: 'inline-flex', flex: 'none', paddingTop: size * 0.25, paddingRight: size * 1.02, color, fontFamily: '"Montserrat", "Segoe UI", system-ui, sans-serif', lineHeight: 1 }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <span style={{ position: 'relative', fontWeight: 600, fontSize: size, letterSpacing: `${DAP_LS}em`, marginRight: `-${DAP_LS}em`, whiteSpace: 'nowrap' }}>
        DOCAPOSTE
        <DapMark
          h={size * 0.47}
          color={color}
          style={{ position: 'absolute', left: `calc(100% + ${size * (0.11 - DAP_LS)}px)`, top: size * -0.24 }}
        />
      </span>
      <span style={{ fontWeight: 500, fontSize: size * 0.95, letterSpacing: '0.02em', marginRight: '-0.02em', marginTop: size * -0.12, whiteSpace: 'nowrap' }}>
        Institute
      </span>
    </div>
  </div>
);
```

### Title

```tsx
const Title = ({ children, top = 104, size = 54 }: { children: React.ReactNode; top?: number; size?: number }) => (
  <h2
    style={{
      position: 'absolute',
      left: 120,
      top,
      margin: 0,
      maxWidth: 1680,
      fontFamily: '"Montserrat", "Segoe UI", system-ui, sans-serif',
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1.12,
      letterSpacing: '-0.01em',
      color: '#0B1F5C',
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

const AUTHOR = 'Prénom NOM';
const COURSE = 'Intitulé de la formation';

const Footer = ({ left = 120 }: { left?: number }) => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left,
        right: 120,
        bottom: 26,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: '"Open Sans", "Segoe UI", system-ui, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <DapLogo size={19} />
        <span style={{ width: 1.5, height: 24, background: '#DDE3EE' }} />
        <span style={{ fontSize: 19, fontWeight: 700, color: '#0B1F5C', whiteSpace: 'nowrap' }}>{AUTHOR}</span>
        <span style={{ width: 1.5, height: 24, background: '#DDE3EE' }} />
        <span style={{ fontSize: 19, color: '#6B7690', whiteSpace: 'nowrap' }}>{COURSE}</span>
      </div>
      <span style={{ fontFamily: '"JetBrains Mono", ui-monospace, Consolas, monospace', fontSize: 19, color: '#6B7690', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};
```

### Eyebrow

```tsx
const Eyebrow = ({ children, color = '#1E22E8', size = 22 }: { children: React.ReactNode; color?: string; size?: number }) => (
  <div
    style={{
      fontFamily: '"Montserrat", "Segoe UI", system-ui, sans-serif',
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

### Brand stripe, Slab, Outline (chrome)

```tsx
const BrandStripe = () => (
  <>
    <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 7, background: 'linear-gradient(90deg, #0B1F5C 0%, #1E22E8 55%, #7442E0 100%)' }} />
    <div style={{ position: 'absolute', left: 0, top: 7, bottom: 0, width: 16, background: '#0B1F5C', borderRadius: '0 16px 16px 0' }} />
  </>
);

const Slab = ({ x, y, w, h, r = 56, children }: { x: number; y: number; w: number; h: number; r?: number; children?: React.ReactNode }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: r,
      background: 'linear-gradient(160deg, #0B1F5C 0%, #142C7A 100%)',
      boxShadow: '0 30px 60px -30px rgba(11,31,92,.55)',
    }}
  >
    {children}
  </div>
);

const Outline = ({ x, y, w, h, r = 40, color = '#0B1F5C' }: { x: number; y: number; w: number; h: number; r?: number; color?: string }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, boxShadow: `inset 0 0 0 2.5px ${color}` }} />
);
```

### Signature ("Together we grow")

Cover and closing page only, near `left 1330, top 470`.

```tsx
const Signature = () => (
  <div style={{ transform: 'rotate(-7deg)', fontFamily: '"Mr Dafoe", "Segoe Script", cursive', fontSize: 78, color: '#1E22E8', lineHeight: 1 }}>
    Together we grow
  </div>
);
```

### Portrait (trainer, offset outline)

Pass the imported photo as `src` (e.g. `import formateur from '@assets/houssem-formateur.png'`). Photo ratio 230 × 275.

```tsx
const Portrait = ({ src, name, w = 170, x, y }: { src: string; name: string; w?: number; x: number; y: number }) => {
  const h = Math.round((w * 275) / 230);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h }}>
      <div style={{ position: 'absolute', left: Math.round(w * 0.1), top: Math.round(w * 0.1), width: w, height: h, borderRadius: 26, boxShadow: 'inset 0 0 0 3px #7442E0' }} />
      <img
        src={src}
        alt={name}
        style={{ position: 'relative', display: 'block', width: w, height: h, objectFit: 'cover', borderRadius: 22, border: '4px solid #0B1F5C', boxSizing: 'border-box', boxShadow: '0 24px 50px -24px rgba(11,31,92,.6)' }}
      />
    </div>
  );
};
```

### Card

```tsx
const Card = ({ title, color = '#0A62D0', children }: { title: string; color?: string; children: React.ReactNode }) => (
  <div
    style={{
      position: 'relative',
      boxSizing: 'border-box',
      background: '#FFFFFF',
      borderRadius: 18,
      boxShadow: '0 0 0 1px rgba(16,24,40,.06), 0 18px 40px -26px rgba(11,31,92,.40)',
      padding: '34px 30px 30px',
    }}
  >
    <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 7, borderRadius: '18px 18px 0 0', background: color }} />
    <div style={{ fontFamily: '"Montserrat", "Segoe UI", system-ui, sans-serif', fontWeight: 700, fontSize: 28, color: '#101828' }}>{title}</div>
    <div style={{ marginTop: 12, fontSize: 24, lineHeight: 1.45, color: '#3B4558' }}>{children}</div>
  </div>
);
```

## Motion

- Philosophy: **rich** — every page builds itself in on entry (staggered rise / slide / pop, 700–900 ms, `cubic-bezier(0.22, 1, 0.36, 1)`), diagrams draw their arrows, and click-driven beats reveal one idea per press; page transitions stay short (240–260 ms, opacity + 6 px rise, a 0.97 → 1 "bloom" on cover, section and closing pages).
- Entrance animations only run while the page is active (gate a `-live` class with `useIsActivePage()`) so thumbnails and overview stay fully composed.
- Reusable keyframes:

```css
@keyframes dap-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
@keyframes dap-left { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: none; } }
@keyframes dap-pop  { 0% { opacity: 0; transform: scale(.6); } 60% { opacity: 1; transform: scale(1.05); } 100% { opacity: 1; transform: scale(1); } }
@keyframes dap-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.dap-in   { animation: dap-rise 800ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
.dap-left { animation: dap-left 800ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
.dap-pop  { animation: dap-pop 700ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
.dap-grow { transform-origin: left center; animation: dap-grow 1000ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
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

// For cover / section / closing pages: Page.transition = BLOOM
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

Confident corporate editorial for a large French services group's training arm: cool off-white ground, deep navy slabs that bleed off the edge, electric blue and violet used sparingly, generous white cards with a thin coloured top bar, and Montserrat titles that do the talking. The Docaposte signature appears in three places only — the `DapMark` as header ornament and list bullet, the `DapLogo` in the footer, on section slabs (white) and on the cover/closing page, and the handwritten "Together we grow" on cover and closing. Colour is functional, one colour per role and identical on every page. Avoid: dark backgrounds on content pages, photos as filler, emoji, the script font anywhere but the signature, recolouring or stretching the logo, more than one accent gradient per page.

## Example usage

```tsx
const Cover: Page = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#F6F8FC', color: '#101828', fontFamily: '"Open Sans", "Segoe UI", system-ui, sans-serif' }}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} />
    <Outline x={1450} y={-50} w={560} h={170} r={46} />
    <div style={{ position: 'absolute', left: 390, top: 140, width: 1420 }}>
      <Eyebrow>Formation · 2 jours · 14 h</Eyebrow>
      <h1 style={{ margin: '34px 0 0', fontFamily: '"Montserrat", sans-serif', fontWeight: 800, fontSize: 84, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#0B1F5C' }}>
        <span style={{ color: '#7A2FA6' }}>Développeurs</span> │ Boostez vos<br />performances grâce à l’IA
      </h1>
    </div>
    <div style={{ position: 'absolute', left: 1330, top: 470 }}><Signature /></div>
    <div style={{ position: 'absolute', left: 1500, top: 720 }}><DapLogo size={40} /></div>
    <Footer left={390} />
  </div>
);
```
