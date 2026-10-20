import { type DesignSystem, type Page, useSlidePageNumber } from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';

export const design: DesignSystem = {
  palette: { bg: '#F4F7F9', text: '#2B2F33', accent: '#1F78C1' },
  fonts: {
    display: '"Barlow Condensed", "Arial Narrow", "Segoe UI", sans-serif',
    body: '"Barlow", "Segoe UI", system-ui, -apple-system, sans-serif',
  },
  typeScale: { hero: 128, body: 30 },
  radius: 18,
};

const AUTHOR = 'Prénom Nom';
const COURSE = 'Intitulé de la formation';

// Webfonts + entrance keyframes (inline <style> is fine in a preview-only demo).
const Styles = () => (
  <style>{`
@import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Barlow+Condensed:wght@500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
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
`}</style>
);

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

// ─── Fixed components (verbatim from themes/technologia.md) ─────────────────
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

const Squares = ({ s, x, y, children }: { s: number; x: number; y: number; children?: ReactNode }) => {
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

const BrandStripe = () => (
  <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 8, display: 'flex' }}>
    <div style={{ flex: 6, background: 'linear-gradient(90deg, #2A74BF, #6CCBD0)' }} />
    <div style={{ flex: 2, background: '#3A9F45' }} />
    <div style={{ flex: 3, background: 'linear-gradient(135deg, #FFE24D 0%, #FFD000 55%, #F4B400 100%)' }} />
  </div>
);

const Title = ({ children, top = 108, size = 64 }: { children: ReactNode; top?: number; size?: number }) => (
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

const Eyebrow = ({ children, color = '#1F78C1', size = 24 }: { children: ReactNode; color?: string; size?: number }) => (
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

const Card = ({ title, color = '#1F78C1', children }: { title: string; color?: string; children: ReactNode }) => (
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

const Hl = ({ children }: { children: ReactNode }) => (
  <mark style={{ background: 'linear-gradient(transparent 58%, rgba(255,208,0,.55) 58%)', color: 'inherit', padding: '0 3px' }}>{children}</mark>
);

// ─── Demo-only helper ───────────────────────────────────────────────────────
const Ground = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      background: '#F4F7F9',
      color: '#2B2F33',
      fontFamily: '"Barlow", "Segoe UI", system-ui, sans-serif',
    }}
  >
    <Styles />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background:
          'radial-gradient(ellipse 60% 55% at 12% 8%, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%), radial-gradient(ellipse 50% 50% at 100% 100%, rgba(108,203,208,0.10), rgba(108,203,208,0) 70%)',
      }}
    />
    <BrandStripe />
    {children}
  </div>
);

// ─── Pages ──────────────────────────────────────────────────────────────────
const Cover: Page = () => (
  <Ground>
    <div className="tc-in" style={{ position: 'absolute', left: 112, top: 78 }}>
      <Logo h={64} />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 318, width: 1050 }}>
      <div className="tc-in">
        <Eyebrow size={28}>Formation IA134 · 2 jours · 14 h</Eyebrow>
      </div>
      <h1
        className="tc-in"
        style={{ margin: '18px 0 0', fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: 118, lineHeight: 1, letterSpacing: '-0.01em', color: '#2B2F33', ...d(120) }}
      >
        Titre de la formation
        <br />
        sur deux lignes
      </h1>
      <p className="tc-in" style={{ margin: '26px 0 0', fontSize: 40, lineHeight: 1.25, color: '#4B545B', ...d(240) }}>
        Un sous-titre qui dit ce que l’on saura <Hl>faire en repartant</Hl>
      </p>
      <div
        className="tc-in"
        style={{ marginTop: 46, display: 'inline-flex', alignItems: 'stretch', background: '#FFFFFF', borderRadius: 14, boxShadow: '0 0 0 1px rgba(43,47,51,.06), 0 18px 40px -26px rgba(20,60,100,.40)', overflow: 'hidden', ...d(380) }}
      >
        <span style={{ display: 'flex', alignItems: 'center', padding: '0 24px', background: 'linear-gradient(135deg, #2A74BF 0%, #3D9FCB 55%, #6CCBD0 100%)', color: '#fff', fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: 34, letterSpacing: '0.08em' }}>
          JOUR 1
        </span>
        <span style={{ padding: '16px 28px', fontSize: 30, fontWeight: 500, color: '#2B2F33' }}>Comprendre : concepts, types et cas réels</span>
      </div>
    </div>
    <div className="tc-in" style={{ position: 'absolute', left: 120, top: 870, display: 'flex', alignItems: 'center', gap: 22, ...d(520) }}>
      <div style={{ width: 96, height: 96, borderRadius: 999, background: '#EAF0F4', boxShadow: '0 0 0 4px #fff, 0 0 0 7px #FFD000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: 40, color: '#1F78C1' }}>
        PN
      </div>
      <div>
        <div style={{ fontSize: 30, fontWeight: 600, color: '#2B2F33' }}>{AUTHOR}</div>
        <div style={{ fontSize: 24, color: '#77818A' }}>Formateur · Technologia</div>
      </div>
    </div>
    <Squares s={400} x={1280} y={260} />
  </Ground>
);

const Content: Page = () => (
  <Ground>
    <div style={{ position: 'absolute', left: 120, right: 120, top: 42, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <MiniSquares size={24} />
        <Eyebrow size={24}>Module 02 · Titre du module</Eyebrow>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 600, fontSize: 20, letterSpacing: '0.14em', color: '#77818A', marginRight: 10 }}>JOUR 1</span>
        <ProgSq n={1} mod={2} />
        <ProgSq n={2} mod={2} />
        <ProgSq n={3} mod={2} />
        <ProgSq n={4} mod={2} />
      </div>
    </div>
    <Title>Une page de contenu type</Title>
    <p className="tc-in" style={{ position: 'absolute', left: 120, top: 192, margin: 0, maxWidth: 1520, fontSize: 30, lineHeight: 1.45, color: '#4B545B' }}>
      Titre condensé anthracite, lede en gris doux, cartes blanches à barre de couleur et <Hl>surlignage jaune</Hl> pour l’essentiel.
    </p>
    <div style={{ position: 'absolute', left: 120, top: 300, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
      <div className="tc-in" style={d(100)}>
        <Card title="Comprendre" color="#1F78C1">
          Les concepts clés, expliqués avec des exemples tirés du terrain.
        </Card>
      </div>
      <div className="tc-in" style={d(220)}>
        <Card title="Pratiquer" color="#3A9F45">
          Un exercice court en sous-groupes, puis une restitution en plénière.
        </Card>
      </div>
      <div className="tc-in" style={d(340)}>
        <Card title="Appliquer" color="#FFD000">
          Un livrable réutilisable dès le lendemain dans votre contexte.
        </Card>
      </div>
    </div>
    <div className="tc-in" style={{ position: 'absolute', left: 120, top: 650, width: 1680, display: 'flex', gap: 22, ...d(500) }}>
      <div style={{ flex: 1, display: 'flex', gap: 22, alignItems: 'flex-start', background: '#FFF5CC', borderLeft: '8px solid #FFD000', borderRadius: 14, padding: '20px 28px' }}>
        <div>
          <Eyebrow color="#7D6000" size={24}>À retenir</Eyebrow>
          <div style={{ marginTop: 2, fontSize: 30, lineHeight: 1.4, color: '#2B2F33' }}>
            Un bon projet commence par un périmètre clair et mesurable.
          </div>
        </div>
      </div>
      <div style={{ width: 520, background: '#FFFFFF', borderRadius: 18, boxShadow: '0 0 0 1px rgba(43,47,51,.06), 0 18px 40px -26px rgba(20,60,100,.40)', padding: '22px 28px' }}>
        <Eyebrow color="#77818A" size={22}>Part de pratique</Eyebrow>
        <div style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: 84, lineHeight: 1.05, color: '#3A9F45' }}>+ 60 %</div>
        <div style={{ marginTop: 10, height: 14, background: '#EAF0F4', overflow: 'hidden' }}>
          <div className="tc-grow" style={{ width: '62%', height: '100%', background: 'linear-gradient(135deg, #0F9A4A 0%, #47A83F 60%, #7DB83A 100%)', ...d(700) }} />
        </div>
      </div>
    </div>
    <Footer />
  </Ground>
);

const Section: Page = () => (
  <Ground>
    <Squares s={430} x={130} y={250}>
      <div
        className="tc-pop"
        style={{ position: 'absolute', left: 0, top: 0, width: 430, height: 430, padding: '18px 0 0 34px', boxSizing: 'border-box', fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: 300, lineHeight: 1, color: '#fff', letterSpacing: '-0.02em', ...d(500) }}
      >
        03
      </div>
    </Squares>
    <div style={{ position: 'absolute', left: 820, top: 230, width: 980 }}>
      <div className="tc-in" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <Eyebrow size={28}>Module 03</Eyebrow>
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '5px 13px', borderRadius: 999, background: '#EEF2F5', color: '#4B545B', boxShadow: 'inset 0 0 0 1.5px #CBD4DB', fontSize: 22, fontWeight: 600 }}>
          1 h 30
        </span>
      </div>
      <h1
        className="tc-in"
        style={{ margin: '22px 0 0', fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: 104, lineHeight: 1, letterSpacing: '-0.01em', color: '#2B2F33', ...d(120) }}
      >
        Titre de la section
      </h1>
      <p className="tc-in" style={{ margin: '24px 0 0', fontSize: 32, lineHeight: 1.4, color: '#4B545B', ...d(240) }}>
        Une phrase qui annonce ce que l’on va voir et pourquoi.
      </p>
      <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {['Premier point abordé', 'Deuxième point abordé', 'Un atelier pour conclure'].map((t, i) => (
          <div key={t} className="tc-left" style={{ display: 'flex', alignItems: 'center', gap: 20, ...d(700 + (i + 1) * 140) }}>
            <MiniSquares size={26} />
            <span style={{ fontSize: 32, lineHeight: 1.3, color: '#2B2F33' }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, bottom: 40 }}>
      <Logo h={44} />
    </div>
  </Ground>
);

export default [Cover, Content, Section];
