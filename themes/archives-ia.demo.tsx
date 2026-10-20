import { type DesignSystem, type Page, useSlidePageNumber } from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';

export const design: DesignSystem = {
  palette: { bg: '#ece3ce', text: '#27231d', accent: '#b0352a' },
  fonts: {
    display: '"Special Elite", "Courier New", monospace',
    body: '"Courier Prime", "Courier New", monospace',
  },
  typeScale: { hero: 130, body: 30 },
  radius: 4,
};

// Webfonts + entrance keyframes (inline <style> is fine in a preview-only demo).
const Styles = () => (
  <style>{`
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Special+Elite&display=swap');
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
.ar-in-draw { stroke-dasharray: 1 2; animation: ar-draw 1100ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
.ar-ty .ar-c{ animation: ar-type 40ms linear var(--d, 0ms) both; }
@media (prefers-reduced-motion: reduce) { .ar-in, .ar-in-fade, .ar-in-st, .ar-in-slide, .ar-in-draw, .ar-ty .ar-c { animation: none !important; } }
`}</style>
);

// ─── Fixed components (verbatim from themes/archives-ia.md) ─────────────────
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
const vars = (o: Record<string, string | number>): CSSProperties => {
  const out: Record<string, string | number> = {};
  for (const k of Object.keys(o)) out[`--${k}`] = o[k];
  return out as CSSProperties;
};
const svgUrl = (s: string) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;
const GRAIN = svgUrl(
  `<svg xmlns='http://www.w3.org/2000/svg' width='360' height='360'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.42  0 0 0 0 0.32  0 0 0 0 0.18  1.2 0 0 0 -0.5'/></filter><rect width='360' height='360' filter='url(#g)'/></svg>`,
);
const GRUNGE = svgUrl(
  `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='m'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='4' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.4 0 0 0 2.05'/></filter><rect width='240' height='240' filter='url(#m)'/></svg>`,
);

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

const Stamp = ({ children, pos, rot = -6, size = 40, color = ink.red, d = 0 }: { children: ReactNode; pos: CSSProperties; rot?: number; size?: number; color?: string; d?: number }) => (
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

const Label = ({ children, c = ink.muted, size = 21 }: { children: ReactNode; c?: string; size?: number }) => (
  <span style={{ fontFamily: mono, fontWeight: 700, fontSize: size, letterSpacing: '0.14em', textTransform: 'uppercase', color: c, whiteSpace: 'nowrap' }}>{children}</span>
);

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

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div className="ar-in-fade" style={{ position: 'absolute', left: L, top: 146, fontFamily: mono, fontWeight: 700, fontSize: 24, letterSpacing: '0.14em', textTransform: 'uppercase', color: ink.red }}>
    {children}
  </div>
);

const Title = ({ text }: { text: string }) => (
  <h2 style={{ position: 'absolute', left: L, top: 184, margin: 0, maxWidth: CW, fontFamily: typewriter, fontWeight: 400, fontSize: 64, lineHeight: 1.15, textShadow: BLEED }}>
    <Typed text={text} d={120} step={24} />
  </h2>
);

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

const Hand = ({ children, x, y, w, rot = -2, size = 34, c = ink.blue, d = 0 }: { children: ReactNode; x: number; y: number; w?: number; rot?: number; size?: number; c?: string; d?: number }) => (
  <div className="ar-in-fade" style={{ ...vars({ d: `${d}ms` }), position: 'absolute', left: x, top: y, width: w, fontFamily: hand, fontWeight: 600, fontSize: size, lineHeight: 1.1, color: c, transform: `rotate(${rot}deg)`, transformOrigin: 'left top' }}>
    {children}
  </div>
);

const PaperClip = ({ x, y, rot = -8 }: { x: number; y: number; rot?: number }) => (
  <svg aria-hidden width={46} height={104} style={{ position: 'absolute', left: x, top: y, overflow: 'visible', transform: `rotate(${rot}deg)` }}>
    <path d="M 15 44 V 16 a 8 8 0 0 1 16 0 V 78 a 13 13 0 0 1 -26 0 V 12 a 18 18 0 0 1 36 0 V 64" fill="none" stroke="#868b91" strokeWidth={4} strokeLinecap="round" />
  </svg>
);

const ruled = (top: number, gap: number): CSSProperties => ({
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

const Fiche = ({ no, children }: { no: string; children: ReactNode }) => (
  <div style={{ width: '100%', height: '100%', padding: '22px 30px', boxSizing: 'border-box', transform: 'rotate(-1.5deg)', ...ruled(84, 50) }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', height: 56 }}>
      <span style={{ fontFamily: typewriter, fontSize: 30, color: ink.red }}>FICHE Nº {no}</span>
      <Label>Archives</Label>
    </div>
    <div style={{ marginTop: 12 }}>{children}</div>
  </div>
);

const Chip = ({ children, hot }: { children: ReactNode; hot?: boolean }) => (
  <span style={{ display: 'inline-block', padding: '6px 14px', border: `2px solid ${hot ? ink.red : ink.text}`, background: hot ? ink.redSoft : ink.sheet, color: hot ? ink.red : ink.text, fontWeight: 700, fontSize: 24, lineHeight: 1.2 }}>
    {children}
  </span>
);

const Op = ({ children }: { children: ReactNode }) => (
  <span style={{ margin: '0 12px', fontFamily: 'Arial, "Segoe UI Symbol", sans-serif', fontSize: 30, fontWeight: 700, color: ink.muted }}>{children}</span>
);

const Photo = ({ src, alt, w = 200, h = 260, rot = 3.5 }: { src: string; alt: string; w?: number; h?: number; rot?: number }) => (
  <div style={{ position: 'relative', transform: `rotate(${rot}deg)` }}>
    <img src={src} alt={alt} style={{ display: 'block', width: w, height: h, objectFit: 'cover', border: '9px solid #fffaf0', boxShadow: '0 16px 26px -14px rgba(60, 40, 10, 0.6)', filter: 'grayscale(1) sepia(0.5) contrast(1.05)' }} />
    <PaperClip x={34} y={-14} rot={-6} />
  </div>
);

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

const Sheet = ({ children }: { children: ReactNode }) => (
  <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#ece3ce', color: ink.text, fontFamily: mono, fontSize: 28 }}>
    <Styles />
    <Paper />
    {children}
  </div>
);

// ─── Demo-only: portrait silhouette standing in for a photo ─────────────────
const SILHOUETTE = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='260'><rect width='200' height='260' fill='#9a948a'/><circle cx='100' cy='100' r='46' fill='#5c574f'/><path d='M20 260 C 20 176 64 156 100 156 S 180 176 180 260 Z' fill='#5c574f'/></svg>`,
)}`;

// ─── Pages ──────────────────────────────────────────────────────────────────
const Cover: Page = () => (
  <Sheet>
    <div className="ar-in-fade" style={{ position: 'absolute', left: L, top: 156, fontFamily: mono, fontWeight: 700, fontSize: 26, letterSpacing: '0.18em', textTransform: 'uppercase', color: ink.red }}>
      Dossier Nº 01
    </div>
    <h1 style={{ position: 'absolute', left: L - 6, top: 204, margin: 0, fontFamily: typewriter, fontWeight: 400, fontSize: 130, lineHeight: 1, textShadow: BLEED }}>
      <Typed text={'Titre du\ndossier'} d={250} step={70} />
    </h1>
    <div style={{ position: 'absolute', left: L, top: 488, fontFamily: typewriter, fontSize: 46, lineHeight: 1.12, color: ink.soft, textShadow: BLEED }}>
      <Typed text={'Un sous-titre\nen deux lignes'} d={1500} step={30} />
    </div>
    <p className="ar-in" style={{ ...vars({ d: '2400ms' }), position: 'absolute', left: L, top: 618, margin: 0, width: 800, fontSize: 30, lineHeight: 1.45, color: ink.soft }}>
      Une phrase qui situe le dossier : de quoi il s’agit, de quelle époque, et pourquoi il compte.
    </p>
    {[0, 1, 2, 3, 4, 5].map((n) => (
      <Folder key={n} n={n} />
    ))}
    <div className="ar-in-fade" style={{ ...vars({ d: '2100ms' }), position: 'absolute', left: 1180, top: 760, width: 420, padding: '16px 22px', background: ink.sheet, boxShadow: '0 2px 6px rgba(70, 45, 10, 0.25)', transform: 'rotate(-1deg)', textAlign: 'center' }}>
      <Label c={ink.red}>Archives de l’IA</Label>
      <div style={{ marginTop: 8, fontFamily: typewriter, fontSize: 30, textShadow: BLEED }}>6 dossiers · 1943 → 1986</div>
    </div>
    <Stamp pos={{ left: 1300, top: 150 }} rot={-8} size={64} d={1300}>
      1943 → 1986
    </Stamp>
  </Sheet>
);

const Idea: Page = () => (
  <Sheet>
    <Header dossier="Dossier Nº 01 — Titre du dossier" era="1957" />
    <Eyebrow>L’idée</Eyebrow>
    <Title text="Une autre question est posée" />
    <div className="ar-in" style={{ ...vars({ d: '600ms' }), position: 'absolute', left: L, top: 330, width: 660, height: 400 }}>
      <Fiche no="57-P">
        <CardLine label="NOM" value="Prénom Nom" d={900} />
        <CardLine label="MÉTIER" value="psychologue, chercheur" d={1300} />
        <CardLine label="LABO" value="Nom du laboratoire" d={1750} />
        <CardLine label="VILLE" value="Buffalo, New York" d={2350} />
        <CardLine label="ANNÉE" value="1957" d={2750} />
      </Fiche>
    </div>
    <div className="ar-in" style={{ ...vars({ d: '1500ms' }), position: 'absolute', left: 596, top: 590 }}>
      <Photo src={SILHOUETTE} alt="Portrait (illustration)" />
    </div>
    <Hand x={L + 30} y={754} w={400} rot={-2} size={32} d={2000}>
      Prénom Nom, vers 1950
    </Hand>
    <div className="ar-in-fade" style={{ ...vars({ d: '2200ms' }), position: 'absolute', left: L + 30, top: 812, width: 390, fontSize: 16, lineHeight: 1.4, color: ink.muted, fontStyle: 'italic' }}>
      Photo : source de l’image — licence
    </div>
    <div className="ar-in-fade" style={{ ...vars({ d: '300ms' }), position: 'absolute', left: 872, top: 300, fontFamily: typewriter, fontSize: 140, lineHeight: 1, color: ink.rule }}>
      «
    </div>
    <div style={{ position: 'absolute', left: 980, top: 340, width: 800, fontFamily: typewriter, fontSize: 46, lineHeight: 1.3, textShadow: BLEED }}>
      <Typed text={'Et si la machine apprenait\nà partir d’exemples, au lieu\nqu’on lui dicte toutes\nles règles ?'} d={1000} step={24} />
    </div>
    <div className="ar-in-fade" style={{ ...vars({ d: '3200ms' }), position: 'absolute', left: 980, top: 596, fontSize: 22, fontStyle: 'italic', color: ink.muted }}>
      — l’intuition du chercheur, reformulée
    </div>
    <div className="ar-in" style={{ ...vars({ d: '3400ms' }), position: 'absolute', left: 980, top: 662, width: 800 }}>
      <Label>Avant</Label>
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center' }}>
        <Chip>règles</Chip>
        <Op>+</Op>
        <Chip>données</Chip>
        <Op>→</Op>
        <Chip>machine</Chip>
        <Op>→</Op>
        <Chip>réponses</Chip>
      </div>
    </div>
    <div className="ar-in" style={{ ...vars({ d: '3700ms' }), position: 'absolute', left: 980, top: 784, width: 800 }}>
      <Label c={ink.red}>L’idée</Label>
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center' }}>
        <Chip>exemples</Chip>
        <Op>+</Op>
        <Chip>réponses</Chip>
        <Op>→</Op>
        <Chip>machine</Chip>
        <Op>→</Op>
        <Chip hot>règles</Chip>
      </div>
    </div>
    <Footer subject="Titre du dossier — sous-titre" />
  </Sheet>
);

const WORDS = [
  { w: 'the', pct: 6, x: 0 },
  { w: 'cat', pct: 82, x: 1 },
  { w: 'is', pct: 4, x: 2 },
  { w: 'sleeping', pct: 8, x: 3 },
];
const XS = [170, 300, 430, 560];
const WS = [140, 140, 140, 180];

const Attention: Page = () => (
  <Sheet>
    <Header dossier="Dossier Nº 09 — Le Transformer" era="2014" />
    <Eyebrow>Une première idée, en 2014</Eyebrow>
    <Title text="L’attention : regarder où il faut" />
    <svg width={900} height={420} style={{ position: 'absolute', left: 0, top: 300, overflow: 'visible' }}>
      {WORDS.map((it, i) => (
        <line
          key={it.w}
          className="ar-in-draw"
          style={vars({ d: `${900 + i * 150}ms` })}
          pathLength={1}
          x1={XS[i] + WS[i] / 2}
          y1={90}
          x2={XS[1] + 52}
          y2={250}
          stroke={ink.red}
          strokeOpacity={it.pct > 50 ? 0.9 : 0.4}
          strokeWidth={Math.max(2, it.pct / 8)}
          strokeLinecap="round"
        />
      ))}
    </svg>
    {WORDS.map((it, i) => (
      <div key={it.w} className="ar-in" style={{ ...vars({ d: `${400 + i * 120}ms` }), position: 'absolute', left: XS[i], top: 330, width: WS[i], textAlign: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 18, color: ink.red, letterSpacing: '0.1em' }}>{it.pct} %</div>
        <div style={{ marginTop: 10, padding: '12px 0', border: `2px solid ${ink.text}`, background: ink.sheet, fontFamily: typewriter, fontSize: 30 }}>{it.w}</div>
      </div>
    ))}
    <div className="ar-in" style={{ ...vars({ d: '1700ms' }), position: 'absolute', left: XS[1] - 76, top: 550 }}>
      <Chip hot>chat</Chip>
    </div>
    <Hand x={XS[1] - 90} y={612} w={400} rot={-2} size={30} d={2100}>
      le mot en cours de traduction
    </Hand>
    <div className="ar-in" style={{ ...vars({ d: '1200ms' }), position: 'absolute', left: 1230, top: 330, width: 540, fontSize: 28, lineHeight: 1.45, color: ink.soft }}>
      <p style={{ margin: 0 }}>Pour écrire chaque mot, le traducteur relit toute la phrase d’origine…</p>
      <p style={{ margin: '24px 0 0' }}>
        … et donne un <strong style={{ color: ink.red }}>poids</strong> à chaque mot : ici, presque tout sur « cat ».
      </p>
    </div>
    <Footer subject="Le Transformer — l’attention suffit" />
  </Sheet>
);

export default [Cover, Idea, Attention];
