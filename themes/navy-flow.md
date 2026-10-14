---
name: Navy Flow
description: Corporate training look — light ground, deep navy slabs, electric blue and violet accents, Montserrat + Open Sans, a neutral three-node "flow" mark.
mode: light
---

# Navy Flow

Extracted from `slides/ia-avancee-automatisation`. A clean, confident corporate-training identity built for dense, interactive course decks (modules, ateliers, quiz). It carries **no organisation branding**: the only mark is the generic `FlowMark` (three nodes on a path).

## Palette

| Role     | Value     | Notes                                                    |
| -------- | --------- | -------------------------------------------------------- |
| bg       | `#F6F8FC` | page background (cool off-white)                         |
| text     | `#101828` | primary copy (ink)                                       |
| accent   | `#0A62D0` | links, primary buttons, bullets, key numbers             |
| muted    | `#6B7690` | captions, footer, hints                                  |
| navy     | `#0B1F5C` | titles, slabs (cover / section pages), brand stripe      |
| electric | `#1E22E8` | marks, active progress square, eyebrows                  |
| violet   | `#7442E0` | secondary accent, quiz, highlights, outline frames       |
| plum     | `#7A2FA6` | second line of hero titles                               |
| pink     | `#C2369E` | gradient end, human-validation colour                    |
| soft     | `#3B4558` | body copy inside cards, ledes                            |
| faint    | `#A9B3C6` | arrows, disabled, placeholder                            |
| rule     | `#DDE3EE` | dividers, card outlines                                  |
| panel    | `#EBEFF7` | progress-bar tracks, inset panels                        |
| card     | `#FFFFFF` | cards                                                    |
| teal     | `#0E9AAE` | data / documents                                         |
| green    | `#0E9F6E` | success, ateliers, actions                               |
| yellow   | `#F2A20C` | conditions, warnings (text on it: ink)                   |
| coral    | `#E04848` | errors, risks, "do not"                                  |

Tinted tone set (background / border / foreground) used by tags, callouts and icon tiles:

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
- Accent bar: `linear-gradient(120deg, #7442E0 0%, #C2369E 100%)`

Shadows: card `0 0 0 1px rgba(16,24,40,.06), 0 18px 40px -26px rgba(11,31,92,.40)` · small `0 0 0 1px rgba(16,24,40,.07), 0 8px 20px -14px rgba(11,31,92,.45)`. Radius: 18 px (cards), 14 px (callouts), 999 px (tags).

Suggested `design` const for a slide using this theme:

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

- Display font: `"Montserrat", "Segoe UI", system-ui, sans-serif` — weight 800 for titles, 700 for card titles and eyebrows, letter-spacing −0.01 to −0.02 em on large titles.
- Body font: `"Open Sans", "Segoe UI", system-ui, -apple-system, sans-serif` — weight 400, 600 for emphasis.
- Mono (code, data, page numbers): `"JetBrains Mono", ui-monospace, Consolas, monospace`.
- Webfont import: `https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,500;0,600;0,700;0,800;1,700&family=Open+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap` — load it module-level, slide-keyed, per `references/webfonts.md` in `slide-authoring`.
- Type-scale overrides — this theme is **denser than the `slide-authoring` defaults**, because course decks carry diagrams, cards and interactive widgets on most pages:
  - Hero title (cover): 96 px, weight 800, line-height 1.06 (default 140–200 — deliberately smaller, the cover also carries a visual)
  - Section title (module divider): 76 px, with a 300 px module number on the navy slab
  - Page title: 54 px (48 on atelier pages), line-height 1.12, colour navy
  - Lede under the title: 28 px, colour soft
  - Body in cards / bullets: 22–30 px (never below 19 px for secondary lines)
  - Caption / eyebrow / footer: 19–22 px; eyebrows uppercase, 0.14 em tracking

## Layout

- Canvas 1920 × 1080, content padding **120 px** left and right.
- Fixed chrome on content pages:
  - top brand stripe, 7 px, brand gradient; left stripe, 16 px navy with a 16 px right-hand radius;
  - header at `top: 40` (module label left, day/module progress squares right);
  - page title at `top: 104`, lede at `top: 184`, content starts at `top: 260–270`;
  - footer at `bottom: 26`, 44 px tall.
- Usable content band: roughly `y = 260 → 960`.
- Background: `#F6F8FC` plus three soft radial glows (white top-left, violet bottom-right, electric top-right).
- Cover and section pages drop the chrome: a navy rounded **slab** bleeds off the left edge (`x: -60…-70`, radius 56–64), and thin **outline frames** (2.5 px inset border, radius 34–46) peek in from the canvas edges.
- Content grids: 2, 3 or 4 equal columns with 22–30 px gaps; cards with a 6–8 px coloured top bar.
- Workflow diagrams use one fixed colour code: trigger blue · data teal · AI step violet · condition yellow · action green · human validation pink · result navy.

## Fixed components

These are paste-ready. Copy them verbatim into a slide that uses this theme (replace `AUTHOR` / `COURSE`).

### FlowMark (the theme's only mark)

```tsx
const FlowMark = ({ h = 28, color = '#1E22E8', accent = '#7442E0' }: { h?: number; color?: string; accent?: string }) => (
  <svg width={(h * 64) / 30} height={h} viewBox="0 0 64 30" style={{ display: 'block', flex: 'none' }} aria-hidden>
    <path d="M8 22 C 20 22, 20 8, 32 8 S 44 22, 56 22" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />
    <circle cx={8} cy={22} r={6} fill={color} />
    <rect x={25} y={1} width={14} height={14} rx={4} fill={accent} />
    <circle cx={56} cy={22} r={6} fill={color} />
  </svg>
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
        <FlowMark h={22} />
        <span style={{ width: 1.5, height: 24, background: '#DDE3EE' }} />
        <span style={{ fontSize: 19, fontWeight: 700, color: '#0B1F5C', whiteSpace: 'nowrap' }}>{AUTHOR}</span>
        <span style={{ width: 1.5, height: 24, background: '#DDE3EE' }} />
        <span style={{ fontSize: 19, color: '#6B7690', whiteSpace: 'nowrap' }}>{COURSE}</span>
      </div>
      <span style={{ fontFamily: '"JetBrains Mono", ui-monospace, Consolas, monospace', fontSize: 19, color: '#6B7690', letterSpacing: '0.04em' }}>
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

### Brand stripes and slab (chrome)

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

- Philosophy: **rich** — every page builds itself in on entry (staggered rise / slide / pop, 700–900 ms, `cubic-bezier(0.22, 1, 0.36, 1)`), diagrams use drawn arrows and travelling dots, and click-driven beats reveal one idea per press; transitions between pages stay short (240–260 ms, opacity + 6 px rise, a 0.97 → 1 scale "bloom" on section pages).
- Entrance animations only run while the page is active (gate a `-live` class with `useIsActivePage()`), so thumbnails and overview stay fully composed.
- Reusable keyframes:

```css
@keyframes nf-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
@keyframes nf-left { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: none; } }
@keyframes nf-pop  { 0% { opacity: 0; transform: scale(.6); } 60% { opacity: 1; transform: scale(1.05); } 100% { opacity: 1; transform: scale(1); } }
@keyframes nf-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes nf-march { to { stroke-dashoffset: -24; } }
.nf-in   { animation: nf-rise 800ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
.nf-pop  { animation: nf-pop 700ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
.nf-grow { transform-origin: left center; animation: nf-grow 1000ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
```

- Page transition (module-level default):

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
```

## Aesthetic

Confident corporate editorial for professional training: a cool off-white ground, deep navy slabs that bleed off the edge, electric-blue and violet accents used sparingly, generous white cards with a thin coloured top bar, and Montserrat titles that do the talking. It feels structured, modern and trustworthy, close to a large French services group's training identity but deliberately **unbranded** — no company name, logo, tagline or script font; the three-node `FlowMark` is the only signature. Colour is functional (one colour per role or node type, kept identical across every page), never decorative. Avoid: dark backgrounds on content pages, photos as filler, emoji, more than one accent gradient per page, and any organisation's name or mark.

## Example usage

```tsx
const Cover: Page = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#F6F8FC', color: '#101828', fontFamily: '"Open Sans", "Segoe UI", system-ui, sans-serif' }}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} />
    <div style={{ position: 'absolute', left: 390, top: 180, width: 1100 }}>
      <Eyebrow>Formation · 2 jours</Eyebrow>
      <h1 style={{ margin: '28px 0 0', fontFamily: '"Montserrat", sans-serif', fontWeight: 800, fontSize: 96, lineHeight: 1.06, letterSpacing: '-0.02em', color: '#0B1F5C' }}>
        IA avancée<br />
        <span style={{ color: '#7A2FA6' }}>& automatisation</span>
      </h1>
      <p style={{ marginTop: 30, fontSize: 30, lineHeight: 1.45, color: '#3B4558', maxWidth: 900 }}>
        Concevoir et automatiser ses processus professionnels avec l’IA.
      </p>
    </div>
    <Footer left={390} />
  </div>
);
```
