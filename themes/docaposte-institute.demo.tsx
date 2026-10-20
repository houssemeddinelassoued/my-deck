import { type DesignSystem, type Page, useSlidePageNumber } from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';

export const design: DesignSystem = {
  palette: { bg: '#F6F8FC', text: '#101828', accent: '#0A62D0' },
  fonts: {
    display: '"Montserrat", "Segoe UI", system-ui, sans-serif',
    body: '"Open Sans", "Segoe UI", system-ui, -apple-system, sans-serif',
  },
  typeScale: { hero: 112, body: 28 },
  radius: 18,
};

const AUTHOR = 'Prénom NOM';
const COURSE = 'Intitulé de la formation';

// Webfonts + entrance keyframes (inline <style> is fine in a preview-only demo).
const Styles = () => (
  <style>{`
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,500;0,600;0,700;0,800;1,700&family=Open+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;700&family=Mr+Dafoe&display=swap');
@keyframes dap-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
@keyframes dap-left { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: none; } }
@keyframes dap-pop  { 0% { opacity: 0; transform: scale(.6); } 60% { opacity: 1; transform: scale(1.05); } 100% { opacity: 1; transform: scale(1); } }
@keyframes dap-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.dap-in   { animation: dap-rise 800ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
.dap-left { animation: dap-left 800ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
.dap-pop  { animation: dap-pop 700ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
.dap-grow { transform-origin: left center; animation: dap-grow 1000ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
`}</style>
);

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

// ─── Fixed components (verbatim from themes/docaposte-institute.md) ─────────
const DapMark = ({ h = 28, color = '#1E22E8', style }: { h?: number; color?: string; style?: CSSProperties }) => (
  <svg width={(h * 58) / 30} height={h} viewBox="0 0 58 30" style={{ display: 'block', flex: 'none', ...style }} aria-hidden>
    <rect x={6} y={0} width={40} height={6} rx={3} fill={color} />
    <rect x={16} y={12} width={42} height={6} rx={3} fill={color} />
    <rect x={0} y={24} width={42} height={6} rx={3} fill={color} />
  </svg>
);

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

const Title = ({ children, top = 104, size = 54 }: { children: ReactNode; top?: number; size?: number }) => (
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

const Eyebrow = ({ children, color = '#1E22E8', size = 22 }: { children: ReactNode; color?: string; size?: number }) => (
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

const BrandStripe = () => (
  <>
    <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 7, background: 'linear-gradient(90deg, #0B1F5C 0%, #1E22E8 55%, #7442E0 100%)' }} />
    <div style={{ position: 'absolute', left: 0, top: 7, bottom: 0, width: 16, background: '#0B1F5C', borderRadius: '0 16px 16px 0' }} />
  </>
);

const Slab = ({ x, y, w, h, r = 56, children }: { x: number; y: number; w: number; h: number; r?: number; children?: ReactNode }) => (
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

const Signature = () => (
  <div style={{ transform: 'rotate(-7deg)', fontFamily: '"Mr Dafoe", "Segoe Script", cursive', fontSize: 78, color: '#1E22E8', lineHeight: 1 }}>
    Together we grow
  </div>
);

const Card = ({ title, color = '#0A62D0', children }: { title: string; color?: string; children: ReactNode }) => (
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

// ─── Demo-only helpers ──────────────────────────────────────────────────────
const Ground = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      background: '#F6F8FC',
      color: '#101828',
      fontFamily: '"Open Sans", "Segoe UI", system-ui, sans-serif',
    }}
  >
    <Styles />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background:
          'radial-gradient(ellipse 55% 50% at 10% 6%, rgba(255,255,255,0.95), rgba(255,255,255,0) 70%), radial-gradient(ellipse 45% 45% at 100% 100%, rgba(116,66,224,0.07), rgba(116,66,224,0) 70%), radial-gradient(ellipse 40% 40% at 100% 0%, rgba(30,34,232,0.05), rgba(30,34,232,0) 70%)',
      }}
    />
    {children}
  </div>
);

const Tag = ({ children, bg, bd, fg }: { children: ReactNode; bg: string; bd: string; fg: string }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '5px 13px',
      borderRadius: 999,
      background: bg,
      color: fg,
      boxShadow: `inset 0 0 0 1.5px ${bd}`,
      fontSize: 22,
      fontWeight: 600,
      lineHeight: 1.2,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </span>
);

// ─── Pages ──────────────────────────────────────────────────────────────────
const Cover: Page = () => (
  <Ground>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} />
    <Outline x={1450} y={-50} w={560} h={170} r={46} />
    <Outline x={-40} y={760} w={120} h={360} r={40} color="#AEB9E6" />
    <div style={{ position: 'absolute', left: 390, top: 170, width: 1420 }}>
      <div className="dap-in" style={{ display: 'flex', gap: 12 }}>
        <Tag bg="#EFE9FC" bd="#BFA8F2" fg="#5A2FC2">Formation · 2 jours · 14 h</Tag>
        <Tag bg="#E6F0FC" bd="#97BFF0" fg="#0A55B5">Édition 2026</Tag>
      </div>
      <h1
        className="dap-in"
        style={{ margin: '34px 0 0', fontFamily: '"Montserrat", sans-serif', fontWeight: 800, fontSize: 84, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#0B1F5C', ...d(120) }}
      >
        <span style={{ color: '#7A2FA6' }}>Titre court</span> <span style={{ fontWeight: 500 }}>│</span> Titre de la
        <br />
        formation en deux lignes
      </h1>
      <p className="dap-in" style={{ margin: '30px 0 0', fontSize: 30, lineHeight: 1.45, color: '#3B4558', maxWidth: 980, ...d(240) }}>
        Un sous-titre qui dit en une phrase ce que les participants sauront faire en repartant, avec{' '}
        <strong style={{ color: '#0B1F5C' }}>un mot clé en navy</strong>.
      </p>
      <div className="dap-in" style={{ marginTop: 56, ...d(360) }}>
        <Eyebrow color="#6B7690" size={20}>Formateur</Eyebrow>
        <div style={{ marginTop: 6, fontFamily: '"Montserrat", sans-serif', fontWeight: 800, fontSize: 40, color: '#0B1F5C' }}>{AUTHOR}</div>
      </div>
    </div>
    <div className="dap-in" style={{ position: 'absolute', left: 1330, top: 470, ...d(900) }}>
      <Signature />
    </div>
    <div className="dap-pop" style={{ position: 'absolute', left: 1500, top: 720, ...d(600) }}>
      <DapLogo size={40} />
    </div>
    <Footer left={390} />
  </Ground>
);

const Content: Page = () => (
  <Ground>
    <BrandStripe />
    <div style={{ position: 'absolute', left: 120, right: 120, top: 40, height: 40, display: 'flex', alignItems: 'center', gap: 16 }}>
      <DapMark h={16} />
      <Eyebrow color="#0B1F5C" size={19}>
        Module 2 · Intégrer l’IA dans le workflow
      </Eyebrow>
    </div>
    <Title>Une page de contenu type</Title>
    <p className="dap-in" style={{ position: 'absolute', left: 120, top: 184, margin: 0, maxWidth: 1560, fontSize: 28, lineHeight: 1.45, color: '#3B4558' }}>
      Titre navy, lede en gris doux, puis des cartes blanches à barre de couleur : une couleur par rôle.
    </p>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
      <div className="dap-in" style={d(100)}>
        <Card title="Cadrer" color="#7442E0">
          Décrire la tâche, le contexte et le format attendu avant de laisser l’assistant produire.
        </Card>
      </div>
      <div className="dap-in" style={d(220)}>
        <Card title="Générer" color="#0E9AAE">
          Itérer en petites étapes, avec des exemples et des contraintes explicites.
        </Card>
      </div>
      <div className="dap-in" style={d(340)}>
        <Card title="Valider" color="#C2369E">
          Relire, tester, tracer : la responsabilité du livrable reste humaine.
        </Card>
      </div>
    </div>
    <div className="dap-in" style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'flex', gap: 22, ...d(500) }}>
      <div style={{ flex: 1, background: '#FEF3DC', borderLeft: '8px solid #F2A20C', borderRadius: 14, padding: '20px 28px' }}>
        <Eyebrow color="#8A5A00" size={22}>À retenir</Eyebrow>
        <div style={{ marginTop: 4, fontSize: 28, lineHeight: 1.4, color: '#101828' }}>
          L’IA est un accélérateur, mais c’est le développeur qui crée la valeur.
        </div>
      </div>
      <div style={{ width: 520, background: '#FFFFFF', borderRadius: 18, boxShadow: '0 0 0 1px rgba(16,24,40,.06), 0 18px 40px -26px rgba(11,31,92,.40)', padding: '22px 28px' }}>
        <Eyebrow color="#6B7690" size={19}>Part de pratique</Eyebrow>
        <div style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 800, fontSize: 72, lineHeight: 1.05, color: '#0E9F6E' }}>+ 60 %</div>
        <div style={{ marginTop: 12, height: 16, borderRadius: 8, background: '#EBEFF7', overflow: 'hidden' }}>
          <div className="dap-grow" style={{ width: '62%', height: '100%', background: 'linear-gradient(120deg, #0E9F6E 0%, #0E9AAE 100%)', ...d(700) }} />
        </div>
      </div>
    </div>
    <Footer />
  </Ground>
);

const Closer: Page = () => (
  <Ground>
    <Slab x={-60} y={-60} w={700} h={1200} r={56}>
      <div style={{ position: 'absolute', left: 150, top: 240 }}>
        <div className="dap-in" style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, fontSize: 26, letterSpacing: '0.24em', color: '#AEB9E6', ...d(300) }}>
          MODULE · JOUR 2
        </div>
        <div className="dap-pop" style={{ marginTop: 6, fontFamily: '"Montserrat", sans-serif', fontWeight: 800, fontSize: 300, lineHeight: 1, letterSpacing: '-0.04em', color: '#fff', ...d(450) }}>
          07
        </div>
        <div className="dap-grow" style={{ marginTop: 26, width: 150, height: 8, borderRadius: 4, background: 'linear-gradient(120deg, #7442E0 0%, #C2369E 100%)', ...d(650) }} />
      </div>
      <div style={{ position: 'absolute', left: 150, bottom: 150 }}>
        <DapLogo size={24} color="#FFFFFF" />
      </div>
    </Slab>
    <Outline x={1480} y={-40} w={520} h={150} r={40} />
    <Outline x={1700} y={930} w={300} h={200} r={40} color="#7442E0" />
    <div style={{ position: 'absolute', left: 760, top: 200, width: 1040 }}>
      <h1
        className="dap-in"
        style={{ margin: 0, fontFamily: '"Montserrat", sans-serif', fontWeight: 800, fontSize: 76, lineHeight: 1.06, letterSpacing: '-0.015em', color: '#0B1F5C' }}
      >
        Synthèse & plan d’action
      </h1>
      <p className="dap-in" style={{ margin: '24px 0 0', fontSize: 30, lineHeight: 1.45, color: '#3B4558', ...d(160) }}>
        Page de section : grande dalle navy, numéro du module, logo en blanc.
      </p>
      <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {['Ce que je retiens', 'Ce que je teste lundi', 'Mon plan à 45 jours'].map((t, i) => (
          <div key={t} className="dap-left" style={{ display: 'flex', alignItems: 'center', gap: 18, ...d(500 + i * 140) }}>
            <DapMark h={16} />
            <span style={{ fontSize: 30, lineHeight: 1.3, color: '#101828' }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="dap-in" style={{ position: 'absolute', left: 1230, top: 740, ...d(900) }}>
      <Signature />
    </div>
  </Ground>
);

export default [Cover, Content, Closer];
