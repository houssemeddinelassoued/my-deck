// ─── Day 2 · Cover ──────────────────────────────────────────────────────────
// Meeting → notes → tasks: three tiles linked by marching arrows.
const J2Tile = ({ x, y, icon, tone, label, d }: { x: number; y: number; icon: IconName; tone: Tone; label: string; d: number }) => (
  <div className={A.pop} style={{ position: 'absolute', left: x, top: y, width: 190, ...dl(d) }}>
    <div style={{ width: 190, height: 190, borderRadius: 32, background: C.card, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <IconTile name={icon} tone={tone} size={110} solid />
    </div>
    <div style={{ marginTop: 14, textAlign: 'center', fontFamily: display, fontWeight: 700, fontSize: 28, letterSpacing: '0.06em', color: C.ink }}>{label}</div>
  </div>
);

const J2_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <img src={logoStack} alt="Technologia" className={A.fade} style={{ position: 'absolute', left: 112, top: 78, height: 150, display: 'block' }} />
    <div style={{ position: 'absolute', left: 120, top: 318, width: 960 }}>
      <Eyebrow cls={A.in} size={28}>
        Formation IA124 · Jour 2
      </Eyebrow>
      <h1 className={A.in} style={{ margin: '18px 0 0', fontFamily: display, fontWeight: 700, fontSize: 118, lineHeight: 1.0, letterSpacing: '-0.01em', color: C.ink, ...dl(120) }}>
        IA appliquée à la
        <br />
        gestion de projet
      </h1>
      <div className={A.in} style={{ marginTop: 46, display: 'inline-flex', alignItems: 'stretch', background: C.card, borderRadius: 14, boxShadow: SHADOW, overflow: 'hidden', ...dl(300) }}>
        <span style={{ display: 'flex', alignItems: 'center', padding: '0 24px', background: G.green, color: '#fff', fontFamily: display, fontWeight: 700, fontSize: 34, letterSpacing: '0.08em' }}>JOUR 2</span>
        <span style={{ padding: '16px 28px', fontSize: 30, fontWeight: 500, color: C.ink }}>Automatiser, collaborer et adopter l’IA</span>
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 870, display: 'flex', alignItems: 'center', gap: 22, ...dl(520) }}>
      <img src={formateur} alt={AUTHOR} style={{ width: 96, height: 96, borderRadius: 999, objectFit: 'cover', objectPosition: '50% 20%', display: 'block', boxShadow: `0 0 0 4px #fff, 0 0 0 7px ${C.yellow}` }} />
      <div>
        <div style={{ fontSize: 30, fontWeight: 600, color: C.ink }}>{AUTHOR}</div>
        <div style={{ fontSize: 24, color: C.muted }}>Formateur · Technologia</div>
      </div>
    </div>
    <Squares s={230} x={1500} y={650} delay={200} />
    <svg width={1920} height={120} style={{ position: 'absolute', left: 0, top: 380, overflow: 'visible' }}>
      <path d="M1278 60 H1326" stroke={C.blue} strokeWidth={4} strokeDasharray="10 14" className={A.march} />
      <path d="M1528 60 H1576" stroke={C.blue} strokeWidth={4} strokeDasharray="10 14" className={A.march} />
    </svg>
    <J2Tile x={1080} y={345} icon="video" tone="violet" label="RÉUNION" d={500} />
    <J2Tile x={1330} y={345} icon="note" tone="blue" label="COMPTE RENDU" d={800} />
    <J2Tile x={1580} y={345} icon="kanban" tone="green" label="TÂCHES" d={1100} />
  </Frame>
);

// ─── Day 2 · Reactivation (flip cards) ──────────────────────────────────────
const J2Flip = ({ n, q, a }: { n: number; q: string; a: ReactNode }) => (
  <FlipCard
    w={530}
    h={280}
    tone="violet"
    backTone="green"
    front={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Num n={n} tone="violet" size={50} />
        <div style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.3, color: C.ink }}>{q}</div>
      </div>
    }
    back={<div style={{ fontSize: 28, lineHeight: 1.45, color: C.ink }}>{a}</div>}
  />
);

const J2_Recall: Page = () => (
  <Frame mod={0} kind="qcm" label="Jour 2 · Réactivation">
    <Title>Cinq questions pour se réveiller</Title>
    <Lede>Répondez dans le clavardage, puis on retourne la carte. Et vos questions d’hier ?</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 530px)', rowGap: 30, columnGap: 45, ...dl(150) }}>
      <J2Flip n={1} q="À partir de quoi une IA apprend-elle ?" a={<>D’<b>exemples</b>, pas de règles écrites à la main. Elle en tire un modèle.</>} />
      <J2Flip n={2} q="Comment un LLM choisit-il ses mots ?" a={<>Il prédit le mot le plus <b>probable</b>, pas le plus vrai. D’où les hallucinations.</>} />
      <J2Flip n={3} q="Les cinq ingrédients d’une bonne demande ?" a={<>Rôle, contexte, tâche, format, contraintes.</>} />
      <J2Flip n={4} q="Combien de A par ligne dans une RACI ?" a={<>Un seul. Deux A, c’est personne ; aucun A, c’est personne non plus.</>} />
      <J2Flip n={5} q="Automatisation ou IA : « si retard, alors courriel » ?" a={<>Automatisation : une règle fixe. L’IA <b>anticiperait</b> le retard.</>} />
      <div style={{ width: 530, height: 280, boxSizing: 'border-box', borderRadius: 18, border: `3px dashed ${C.rule}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, color: C.muted }}>
        <Icon name="chat" size={56} color={C.violet} />
        <span style={{ fontSize: 28, fontWeight: 600, color: C.ink }}>Vos questions d’hier</span>
        <span style={{ fontSize: 22 }}>Billets de sortie</span>
      </div>
    </div>
  </Frame>
);

const J2_Program: Page = () => (
  <Frame mod={0} label="Jour 2 · Programme">
    <Title>Aujourd’hui : automatiser, collaborer, adopter</Title>
    <ProgramCols today={2} />
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [J2_Cover, J2_Recall, J2_Program];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · ACCUEIL DU JOUR 2 (page affichée à l'arrivée)

OBJECTIF — Relancer l'énergie et annoncer le fil de la journée.

DIRE — « Bonjour et bienvenue au jour 2 ! Hier, on a compris l'IA et on a planifié avec elle. Aujourd'hui, on automatise ce qui se répète dans un projet : les réunions, les comptes rendus, le suivi. On parle des limites et de l'éthique. Et cet après-midi, vous menez un mini-projet complet avec l'IA. »

Montrer l'animation : « Réunion, compte rendu, tâches. C'est la chaîne qu'on va automatiser ce matin. »

LOGISTIQUE — Mêmes horaires qu'hier. Évaluation de la formation en fin de journée.

TRANSITION — « D'abord, réveillons ce qu'on a appris hier. »`,
  `⏱ 10 min · RÉACTIVATION (cartes à retourner)

OBJECTIF — Réactiver les notions clés du jour 1 et répondre aux questions des billets de sortie.

ANIMATION — Lisez chaque question, laissez répondre dans le clavardage (ou au micro), puis cliquez pour retourner la carte.

RÉPONSES —
1. D'exemples : l'IA en tire un modèle.
2. Le mot le plus probable, pas le plus vrai.
3. Rôle, contexte, tâche, format, contraintes.
4. Un seul A par ligne.
5. Automatisation : une règle fixe. L'IA anticiperait le retard.

VOS QUESTIONS D'HIER — Sur la 6ᵉ case, répondez aux questions recueillies dans les billets de sortie (préparez-les la veille). Si quelqu'un a essayé une demande en cinq ingrédients sur son vrai projet, demandez-lui de raconter.

TRANSITION — « Voici le programme de la journée. »`,
  `⏱ 1 min · PROGRAMME DU JOUR 2

DIRE — « Ce matin, module 4 : automatiser et collaborer. Comptes rendus, résumés de réunions, suivi des tâches et alertes, pratiques d'équipe. Après la pause, module 5 : limites, éthique et adoption. Cet après-midi, l'atelier 2 : un mini-projet complet avec l'IA, que vous présenterez au groupe, avec une rétroaction collective. On termine par votre plan d'action. »

TRANSITION — « Commençons par ce qui occupe une grande partie de la semaine de Karim : les réunions. »`,
];
// @@NOTES-END
