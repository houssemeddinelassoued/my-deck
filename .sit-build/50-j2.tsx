// ─── Ouverture · Jour 2 ─────────────────────────────────────────────────────

const J2_Cover: Page = () => (
  <Frame mod={10} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={110} r={46} cls={A.fade} />
    <div style={{ position: 'absolute', left: 390, top: 150, width: 980 }}>
      <div className={A.in} style={{ display: 'flex', gap: 12 }}>
        <Tag tone="green" size={22}>
          <Icon name="calendar" size={22} /> Jour 2 · 7 h
        </Tag>
        <Tag tone="blue" size={22}>
          <Icon name="route" size={22} /> Analyser et automatiser
        </Tag>
      </div>
      <h1 className={A.in} style={{ margin: '34px 0 0', fontFamily: display, fontWeight: 800, fontSize: 92, lineHeight: 1.06, letterSpacing: '-0.02em', color: C.navy, ...dl(120) }}>
        Analyser,
        <br />
        <span style={{ color: C.green }}>puis automatiser</span>
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 30, lineHeight: 1.45, color: C.soft, maxWidth: 900, ...dl(240) }}>
        Hier, vous avez produit avec l’IA. Aujourd’hui, vous analysez vos données et vos incidents, puis vous automatisez ce qui revient chaque semaine.
      </p>
      <div className={A.in} style={{ marginTop: 50, display: 'flex', gap: 12, flexWrap: 'wrap', ...dl(400) }}>
        <Tag tone="yellow" size={21}>
          M5 · Vos retours
        </Tag>
        <Tag tone="blue" size={21}>
          M6 · Analyser
        </Tag>
        <Tag tone="green" size={21}>
          M7 · Automatiser
        </Tag>
        <Tag tone="navy" size={21}>
          M8 · Plan d’action
        </Tag>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1420, top: 150, width: 420, height: 720 }}>
      <svg width={64} height={720} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
        <path d="M32 32 V 672" stroke={C.rule} strokeWidth={4} strokeDasharray="8 10" className={A.march} />
        <FlowDot path="M32 32 V 672" dur={3.2} r={8} color={C.green} />
      </svg>
      <OCoverStep kind="trigger" label="Lundi 8:00, chaque semaine" y={0} d={400} />
      <OCoverStep kind="data" label="Export des tickets récupéré" y={160} d={520} />
      <OCoverStep kind="ai" label="Indicateurs calculés et commentés" y={320} d={640} />
      <OCoverStep kind="human" label="Claire relit et valide" y={480} d={760} />
      <OCoverStep kind="action" label="Rapport envoyé à la direction" y={640} d={880} />
    </div>
    <Footer left={390} />
  </Frame>
);
J2_Cover.transition = BLOOM;

// ─── Quiz flash ─────────────────────────────────────────────────────────────
const J2_Quiz: Page = () => (
  <Frame mod={10} kind="quiz">
    <Title>Quiz flash : cinq questions pour se réveiller</Title>
    <QuizSeries y={200}>
      <QuizQ q="L’information est dans vos e-mails et vos réunions Teams. Quel outil ?" explain="Microsoft 365 Copilot lit vos données Microsoft 365 sur place, dans la limite de vos droits.">
        <QOpt ok>Microsoft 365 Copilot</QOpt>
        <QOpt>Claude, en copiant tout</QOpt>
        <QOpt>N’importe lequel</QOpt>
      </QuizQ>
      <QuizQ q="Quel ingrédient du prompt adapte la réponse au lecteur ?" explain="Les contraintes (ton, jargon, longueur) et le rôle adaptent la réponse au lecteur ; le contexte apporte les faits.">
        <QOpt>Le format</QOpt>
        <QOpt ok>Les contraintes</QOpt>
        <QOpt>La politesse</QOpt>
      </QuizQ>
      <QuizQ q="Première passe d’une synthèse de long rapport ?" explain="La carte : le plan et ce que couvre chaque partie. On vérifie ainsi que tout a été lu.">
        <QOpt>La note finale</QOpt>
        <QOpt ok>La carte du document</QOpt>
        <QOpt>Les fautes d’orthographe</QOpt>
      </QuizQ>
      <QuizQ q="Un export de tickets contient des noms d’utilisateurs. Feu…" explain="Orange : utile, mais on anonymise d’abord, en local.">
        <QOpt>Vert</QOpt>
        <QOpt ok>Orange</QOpt>
        <QOpt>Rouge</QOpt>
      </QuizQ>
      <QuizQ q="Que fait l’option -WhatIf d’une commande PowerShell ?" explain="Elle simule : la commande décrit ce qu’elle ferait, sans rien modifier.">
        <QOpt>Elle accélère la commande</QOpt>
        <QOpt ok>Elle simule sans rien modifier</QOpt>
        <QOpt>Elle demande un mot de passe</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Programme du jour 2 ────────────────────────────────────────────────────
const J2Slot = ({ t, mod, tone, title, sub, labs, d }: { t: string; mod: string; tone: Tone; title: string; sub: string; labs: string; d: number }) => (
  <div className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 22, background: C.card, borderRadius: 18, boxShadow: SHADOW_SM, padding: '18px 26px', borderLeft: `8px solid ${STRONG[tone]}`, ...dl(d) }}>
    <span style={{ width: 92, flex: 'none', fontFamily: mono, fontSize: 24, color: C.muted }}>{t}</span>
    <span style={{ width: 80, flex: 'none', fontFamily: display, fontWeight: 800, fontSize: 34, color: STRONG[tone] }}>{mod}</span>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, color: C.soft, marginTop: 2 }}>{sub}</div>
    </div>
    <Tag tone="green" size={18}>
      {labs}
    </Tag>
  </div>
);

const J2_Programme: Page = () => (
  <Frame mod={10}>
    <Title>Le programme du jour 2</Title>
    <Lede>Un jour très pratique : priorité à l’automatisation, que vous avez tous cochée dans le questionnaire.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <J2Slot t="9:15" mod="M5" tone="yellow" title="Retours d’intersession" sub="Vos cas réels · temps gagné · matrice valeur-effort" labs="vos cas" d={100} />
      <J2Slot t="10:45" mod="M6" tone="blue" title="Analyser : données et causes racines" sub="Excel, reporting de support, 5 pourquoi, post-mortem" labs="6.1 · 6.2" d={200} />
      <J2Slot t="14:00" mod="M7" tone="green" title="Automatiser les tâches administratives" sub="Modèles, agent Copilot, flux sans code, scripts en vibe coding" labs="7.1 · 7.2 · 7.3 · binômes" d={300} />
      <J2Slot t="16:30" mod="M8" tone="navy" title="Synthèse et plan d’action" sub="Kit d’équipe · plan à 30 jours · QCM final · évaluation" labs="plan" d={400} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.muted, ...dl(700) }}>
      <Icon name="clock" size={26} color={T.yellow.fg} /> Pauses vers 10:30 et 15:30 · déjeuner 12:30 – 14:00 · fin 17:30
    </div>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [J2_Cover, J2_Quiz, J2_Programme];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · COUVERTURE JOUR 2 · 9:00

OBJECTIF — Relancer la dynamique et annoncer la journée.

DIRE — « Bonjour à toutes et à tous ! Hier, vous avez produit avec l’IA : des messages, des synthèses, des articles, des procédures. Aujourd’hui, on passe à la suite : analyser vos données et vos incidents, puis automatiser ce qui revient chaque semaine. À droite, l’exemple qu’on aura en tête toute la journée : le reporting du lundi qui se prépare tout seul, et que Claire n’a plus qu’à relire. »

TRANSITION — « Mais d’abord, un petit réveil. »`,
  `⏱ 4 min · QUIZ FLASH J1

OBJECTIF — Réactiver les notions clés du jour 1.

DIRE — « Cinq questions sur hier. Vote à main levée. »

ANIMATION — Réexpliquer en une phrase toute question ratée par plus de la moitié du groupe ; reprendre aussi les points notés « flous » au bilan d’hier.

TRANSITION — « Bonne mémoire ! Voici le programme de la journée. »`,
  `⏱ 2 min · PROGRAMME J2

OBJECTIF — Donner la carte de la journée.

DIRE — « On commence par vous : vos missions d’intersession. Puis le module 6 : analyser des données Excel, produire un reporting, mener une analyse de causes racines. Tout l’après-midi, le module 7 : l’automatisation, avec un agent, un flux, et des scripts écrits par l’IA, sans apprendre à coder. Et pour finir, votre plan d’action. »

TRANSITION — « Module 5 : vos retours. »`,
];
// @@NOTES-END
