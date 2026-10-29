// ─── Day 2 · Cover ──────────────────────────────────────────────────────────
// Code → tests → pipeline: three tiles linked by marching arrows.
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
        Formation IA132 · Jour 2
      </Eyebrow>
      <h1 className={A.in} style={{ margin: '18px 0 0', fontFamily: display, fontWeight: 700, fontSize: 118, lineHeight: 1.0, letterSpacing: '-0.01em', color: C.ink, ...dl(120) }}>
        IA pour
        <br />
        développeurs
      </h1>
      <div className={A.in} style={{ marginTop: 46, display: 'inline-flex', alignItems: 'stretch', background: C.card, borderRadius: 14, boxShadow: SHADOW, overflow: 'hidden', ...dl(300) }}>
        <span style={{ display: 'flex', alignItems: 'center', padding: '0 24px', background: G.green, color: '#fff', fontFamily: display, fontWeight: 700, fontSize: 34, letterSpacing: '0.08em' }}>JOUR 2</span>
        <span style={{ padding: '16px 28px', fontSize: 30, fontWeight: 500, color: C.ink }}>Qualité, conception et projet complet</span>
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
    <J2Tile x={1080} y={345} icon="code" tone="violet" label="CODE" d={500} />
    <J2Tile x={1330} y={345} icon="check" tone="blue" label="TESTS" d={800} />
    <J2Tile x={1580} y={345} icon="rocket" tone="green" label="PIPELINE" d={1100} />
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
    back={<div style={{ fontSize: 27, lineHeight: 1.45, color: C.ink }}>{a}</div>}
  />
);

const J2_Recall: Page = () => (
  <Frame mod={0} kind="qcm" label="Jour 2 · Réactivation">
    <Title>Cinq questions pour se réveiller</Title>
    <Lede>Répondez au micro, puis je retourne la carte. Et vos questions d’hier ?</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 530px)', rowGap: 30, columnGap: 45, ...dl(150) }}>
      <J2Flip n={1} q="Comment un assistant choisit-il le code qu’il propose ?" a={<>Il prédit la suite la plus <b>probable</b>. Plausible n’est pas prouvé.</>} />
      <J2Flip n={2} q="Les 5 ingrédients d’une demande de code ?" a={<>Contexte, tâche, contraintes, format, exemples.</>} />
      <J2Flip n={3} q="Avant de refactoriser du code hérité, que faut-il ?" a={<>Des <b>tests de caractérisation</b> qui figent le comportement actuel.</>} />
      <J2Flip n={4} q="Un test échoue : que donner au chat ?" a={<>La trace complète, l’attendu, l’obtenu. Et demander une <b>explication</b>.</>} />
      <J2Flip n={5} q="L’agent propose un paquet inconnu. Réflexe ?" a={<>Vérifier qu’il existe, son mainteneur, son usage. <b>Avant</b> d’installer.</>} />
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
    <Title>Aujourd’hui : qualité, conception, projet</Title>
    <ProgramCols today={2} />
  </Frame>
);

// ─── Module 4 divider ───────────────────────────────────────────────────────
const M4_Divider: Page = () => (
  <Section n={4} title="Revue de code et documentation automatisée" sub="Une documentation juste et à jour, des revues plus rapides et plus sûres." dur="≈ 1 h 15">
    <SecItem n={1}>Générer commentaires et documentation technique</SecItem>
    <SecItem n={2}>Analyse de style et respect des conventions</SecItem>
    <SecItem n={3}>Automatiser les revues de code avec l’IA</SecItem>
  </Section>
);
M4_Divider.transition = BLOOM;

// @@PAGES-BEGIN
export const __pages = [J2_Cover, J2_Recall, J2_Program, M4_Divider];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · ACCUEIL DU JOUR 2 (page affichée pendant l'arrivée)

DIRE — « Bonjour et bienvenue au jour 2. Hier : écrire et corriger du code avec l'IA. Aujourd'hui : la qualité et la conception. Documentation et revue, tests et CI/CD, architecture et planification, puis un projet complet avec un agent. »

LOGISTIQUE — Vérifiez son et caméra, et que le dépôt des labs est toujours cloné (git pull si vous avez publié des corrections).

TRANSITION — « On se réveille avec cinq questions. »`,
  `⏱ 8 min · RÉACTIVATION

ANIMATION — Pour chaque carte : lisez la question, appelez un participant par son prénom, écoutez sa réponse, puis cliquez pour retourner la carte.

PUIS — Carte pointillée : reprenez les questions notées dans les billets de sortie d'hier. Répondez brièvement ; si une question relève d'un module du jour, dites où on y reviendra.

INTERACTION — « Qui a essayé une demande en 5 ingrédients hier soir ? » Une ou deux anecdotes.

TRANSITION — « Le programme du jour. »`,
  `⏱ 1 min

DIRE — « Module 4 jusqu'à la pause : documentation et revue, avec deux labs. Module 5 jusqu'au dîner : tests unitaires, intégration, charge et CI/CD. Module 6 au retour : architecture et planification. Puis le module 7 : un projet complet avec un agent, et vos présentations en partage d'écran. »

TRANSITION — « Module 4. »`,
  `⏱ 1 min · DÉBUT DU MODULE 4 (≈ 9 h 10)

DIRE — « Module 4 : revue de code et documentation automatisée. Trois sujets du programme : générer commentaires et documentation, analyser le style et les conventions, automatiser les revues. Deux labs : documenter un module, puis faire la revue d'une pull request piégée. »

TRANSITION — « Commençons par la documentation. »`,
];
// @@NOTES-END
