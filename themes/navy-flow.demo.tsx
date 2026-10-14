import { type DesignSystem, type Page, useSlidePageNumber } from '@open-slide/core';
import type { ReactNode } from 'react';

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
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,500;0,600;0,700;0,800;1,700&family=Open+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap');
@keyframes nf-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
@keyframes nf-pop  { 0% { opacity: 0; transform: scale(.6); } 60% { opacity: 1; transform: scale(1.05); } 100% { opacity: 1; transform: scale(1); } }
@keyframes nf-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes nf-march { to { stroke-dashoffset: -24; } }
.nf-in   { animation: nf-rise 800ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
.nf-pop  { animation: nf-pop 700ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
.nf-grow { transform-origin: left center; animation: nf-grow 1000ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
.nf-march { animation: nf-march 1.2s linear infinite; }
`}</style>
);

const d = (ms: number) => ({ '--d': `${ms}ms` }) as React.CSSProperties;

// ─── Fixed components (verbatim from themes/navy-flow.md) ───────────────────
const FlowMark = ({ h = 28, color = '#1E22E8', accent = '#7442E0' }: { h?: number; color?: string; accent?: string }) => (
  <svg width={(h * 64) / 30} height={h} viewBox="0 0 64 30" style={{ display: 'block', flex: 'none' }} aria-hidden>
    <path d="M8 22 C 20 22, 20 8, 32 8 S 44 22, 56 22" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />
    <circle cx={8} cy={22} r={6} fill={color} />
    <rect x={25} y={1} width={14} height={14} rx={4} fill={accent} />
    <circle cx={56} cy={22} r={6} fill={color} />
  </svg>
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
const Outline = ({ x, y, w, h, r = 40, color = '#0B1F5C' }: { x: number; y: number; w: number; h: number; r?: number; color?: string }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, boxShadow: `inset 0 0 0 2.5px ${color}` }} />
);

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

const Step = ({ color, label, kind, y, ms }: { color: string; label: string; kind: string; y: number; ms: number }) => (
  <div className="nf-in" style={{ position: 'absolute', left: 0, top: y, display: 'flex', alignItems: 'center', gap: 18, ...d(ms) }}>
    <div style={{ width: 64, height: 64, borderRadius: 13, background: color, boxShadow: '0 0 0 6px #F6F8FC' }} />
    <div>
      <div style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: '0.12em', textTransform: 'uppercase', color }}>{kind}</div>
      <div style={{ fontSize: 25, fontWeight: 600, color: '#101828' }}>{label}</div>
    </div>
  </div>
);

// ─── Pages ──────────────────────────────────────────────────────────────────
const Cover: Page = () => (
  <Ground>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} />
    <Outline x={1450} y={-50} w={560} h={110} r={46} />
    <Outline x={-40} y={760} w={120} h={360} r={40} color="#AEB9E6" />
    <div style={{ position: 'absolute', left: 390, top: 170, width: 960 }}>
      <div className="nf-in">
        <Eyebrow>Formation · 2 jours · 14 h</Eyebrow>
      </div>
      <h1
        className="nf-in"
        style={{ margin: '30px 0 0', fontFamily: '"Montserrat", sans-serif', fontWeight: 800, fontSize: 96, lineHeight: 1.06, letterSpacing: '-0.02em', color: '#0B1F5C', ...d(120) }}
      >
        Titre de la formation
        <br />
        <span style={{ color: '#7A2FA6' }}>sur deux lignes</span>
      </h1>
      <p className="nf-in" style={{ margin: '30px 0 0', fontSize: 30, lineHeight: 1.45, color: '#3B4558', maxWidth: 880, ...d(240) }}>
        Un sous-titre qui dit en une phrase ce que les participants sauront faire en repartant.
      </p>
    </div>
    <div style={{ position: 'absolute', left: 1420, top: 170, width: 400, height: 700 }}>
      <svg width={64} height={700} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
        <path className="nf-march" d="M32 32 V 672" stroke="#DDE3EE" strokeWidth={4} strokeDasharray="8 10" />
      </svg>
      <Step color="#0A62D0" kind="Déclencheur" label="Formulaire reçu" y={0} ms={400} />
      <Step color="#7442E0" kind="Étape IA" label="L’IA classe et résume" y={160} ms={520} />
      <Step color="#F2A20C" kind="Condition" label="Demande urgente ?" y={320} ms={640} />
      <Step color="#C2369E" kind="Validation" label="Un humain valide" y={480} ms={760} />
      <Step color="#0E9F6E" kind="Action" label="Réponse envoyée" y={640} ms={880} />
    </div>
    <Footer left={390} />
  </Ground>
);

const Content: Page = () => (
  <Ground>
    <BrandStripe />
    <div style={{ position: 'absolute', left: 120, right: 120, top: 40, height: 40, display: 'flex', alignItems: 'center', gap: 16 }}>
      <FlowMark h={16} />
      <Eyebrow color="#0B1F5C" size={19}>
        Module 2 · Prompting pour les workflows
      </Eyebrow>
    </div>
    <Title>Une page de contenu type</Title>
    <p className="nf-in" style={{ position: 'absolute', left: 120, top: 184, margin: 0, maxWidth: 1560, fontSize: 28, lineHeight: 1.45, color: '#3B4558' }}>
      Titre navy, lede en gris doux, puis des cartes blanches à barre de couleur : une couleur par rôle.
    </p>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
      <div className="nf-in" style={d(100)}>
        <Card title="Tâche précise" color="#7442E0">
          Indiquer la catégorie (parmi 6), l’urgence (1 à 3) et un résumé de 15 mots.
        </Card>
      </div>
      <div className="nf-in" style={d(220)}>
        <Card title="Format imposé" color="#0E9AAE">
          Uniquement un JSON valide, valeurs autorisées, null si l’information manque.
        </Card>
      </div>
      <div className="nf-in" style={d(340)}>
        <Card title="Validation humaine" color="#C2369E">
          Avant toute action externe : un humain approuve, la décision est tracée.
        </Card>
      </div>
    </div>
    <div className="nf-in" style={{ position: 'absolute', left: 120, top: 640, width: 1680, display: 'flex', gap: 22, ...d(500) }}>
      <div style={{ flex: 1, display: 'flex', gap: 22, alignItems: 'flex-start', background: '#FEF3DC', borderLeft: '8px solid #F2A20C', borderRadius: 14, padding: '20px 28px' }}>
        <div>
          <Eyebrow color="#8A5A00" size={22}>
            À retenir
          </Eyebrow>
          <div style={{ marginTop: 4, fontSize: 28, lineHeight: 1.4, color: '#101828' }}>
            Le format est un contrat entre l’IA et la suite du workflow.
          </div>
        </div>
      </div>
      <div style={{ width: 520, background: '#FFFFFF', borderRadius: 18, boxShadow: '0 0 0 1px rgba(16,24,40,.06), 0 18px 40px -26px rgba(11,31,92,.40)', padding: '22px 28px' }}>
        <Eyebrow color="#6B7690" size={19}>
          Temps libéré
        </Eyebrow>
        <div style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 800, fontSize: 72, lineHeight: 1.05, color: '#0E9F6E' }}>21 h / mois</div>
        <div style={{ marginTop: 12, height: 16, borderRadius: 8, background: '#EBEFF7', overflow: 'hidden' }}>
          <div className="nf-grow" style={{ width: '70%', height: '100%', background: 'linear-gradient(120deg, #0A62D0 0%, #1E22E8 100%)', ...d(700) }} />
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
        <Eyebrow color="#AEB9E6" size={26}>
          Jour 2 · Module
        </Eyebrow>
        <div className="nf-pop" style={{ marginTop: 6, fontFamily: '"Montserrat", sans-serif', fontWeight: 800, fontSize: 300, lineHeight: 1, letterSpacing: '-0.04em', color: '#FFFFFF', ...d(200) }}>
          09
        </div>
        <div className="nf-grow" style={{ marginTop: 26, width: 150, height: 8, borderRadius: 4, background: 'linear-gradient(120deg, #7442E0 0%, #C2369E 100%)', ...d(450) }} />
      </div>
      <div style={{ position: 'absolute', left: 150, bottom: 150 }}>
        <FlowMark h={30} color="#FFFFFF" accent="#C2369E" />
      </div>
    </Slab>
    <Outline x={1480} y={-40} w={520} h={150} r={40} />
    <Outline x={1700} y={930} w={300} h={200} r={40} color="#7442E0" />
    <div style={{ position: 'absolute', left: 760, top: 240, width: 1040 }}>
      <h1 className="nf-in" style={{ margin: 0, fontFamily: '"Montserrat", sans-serif', fontWeight: 800, fontSize: 76, lineHeight: 1.06, letterSpacing: '-0.015em', color: '#0B1F5C' }}>
        Page de section
        <br />
        sur deux lignes
      </h1>
      <p className="nf-in" style={{ margin: '22px 0 0', fontSize: 30, lineHeight: 1.4, color: '#3B4558', ...d(150) }}>
        Grand numéro de module sur la dalle navy, titre à droite, puis le sommaire du module.
      </p>
      <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="nf-in" style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 30, ...d(300) }}>
          <FlowMark h={16} /> Hallucinations, erreurs et vérification
        </div>
        <div className="nf-in" style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 30, ...d(420) }}>
          <FlowMark h={16} /> Données personnelles et confidentielles
        </div>
        <div className="nf-in" style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 30, ...d(540) }}>
          <FlowMark h={16} /> Quand ne pas automatiser ?
        </div>
      </div>
    </div>
    <Footer left={760} />
  </Ground>
);

export default [Cover, Content, Closer] satisfies Page[];
