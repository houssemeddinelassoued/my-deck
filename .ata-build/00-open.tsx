// ─── Cover ──────────────────────────────────────────────────────────────────
// A request travels through a workflow: courriel → IA → tableau → notification.
const OpNode = ({ x, y, icon, tone, label, d }: { x: number; y: number; icon: IconName; tone: Tone; label: string; d: number }) => (
  <div className={A.pop} style={{ position: 'absolute', left: x - 60, top: y - 44, width: 120, textAlign: 'center', ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={88} solid style={{ margin: '0 auto', borderRadius: 999 }} />
    <div style={{ marginTop: 10, fontFamily: display, fontWeight: 700, fontSize: 22, letterSpacing: '0.08em', color: T[tone].fg }}>{label}</div>
  </div>
);

const OP_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <img src={logoStack} alt="Technologia" className={A.fade} style={{ position: 'absolute', left: 112, top: 78, height: 150, display: 'block' }} />
    <div style={{ position: 'absolute', left: 120, top: 318, width: 1000 }}>
      <Eyebrow cls={A.in} size={28}>
        Formation IA135 · 2 jours · Intelligence artificielle
      </Eyebrow>
      <h1
        className={A.in}
        style={{ margin: '18px 0 0', fontFamily: display, fontWeight: 700, fontSize: 116, lineHeight: 1.0, letterSpacing: '-0.01em', color: C.ink, ...dl(120) }}
      >
        Automatisation
        <br />
        des tâches avec l’IA
      </h1>
      <p className={A.in} style={{ margin: '26px 0 0', fontSize: 34, lineHeight: 1.32, color: C.soft, ...dl(240) }}>
        Identifiez, concevez et déployez des workflows automatisés combinant RPA et intelligence artificielle
      </p>
      {isLightExport() ? (
        <Tag cls={A.in} tone="yellow" size={24} style={{ marginTop: 26, ...dl(360) }}>
          <Icon name="book" size={24} /> Version light · à parcourir avant la formation
        </Tag>
      ) : null}
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 842, display: 'flex', alignItems: 'center', gap: 22, ...dl(520) }}>
      <img
        src={formateur}
        alt={AUTHOR}
        style={{ width: 96, height: 96, borderRadius: 999, objectFit: 'cover', objectPosition: '50% 20%', display: 'block', boxShadow: `0 0 0 4px #fff, 0 0 0 7px ${C.yellow}` }}
      />
      <div>
        <div style={{ fontSize: 30, fontWeight: 600, color: C.ink }}>{AUTHOR}</div>
        <div style={{ fontSize: 24, color: C.muted }}>Formateur · Technologia</div>
      </div>
    </div>

    <Squares s={250} x={1532} y={62} delay={200} />
    <div className={A.in} style={{ position: 'absolute', left: 1156, top: 426, width: 660, height: 540, background: C.card, borderRadius: 22, boxShadow: SHADOW, ...dl(300) }}>
      <svg width={660} height={540} viewBox="0 0 660 540" style={{ position: 'absolute', inset: 0 }}>
        <path d="M130 150 C 300 150, 360 150, 530 150 C 610 150, 610 390, 530 390 C 360 390, 300 390, 130 390" fill="none" stroke={C.rule} strokeWidth={10} strokeLinecap="round" />
        <path
          d="M130 150 C 300 150, 360 150, 530 150 C 610 150, 610 390, 530 390 C 360 390, 300 390, 130 390"
          pathLength={1}
          fill="none"
          stroke={C.blue}
          strokeWidth={4}
          strokeDasharray="0.02 0.03"
          className={A.fade}
          style={dl(900)}
        />
        <FlowDot path="M130 150 C 300 150, 360 150, 530 150 C 610 150, 610 390, 530 390 C 360 390, 300 390, 130 390" dur={5} r={10} color={C.yellow} />
      </svg>
      <OpNode x={130} y={150} icon="mail" tone="blue" label="DEMANDE" d={1000} />
      <OpNode x={530} y={150} icon="sparkles" tone="violet" label="IA" d={1200} />
      <OpNode x={530} y={390} icon="table" tone="green" label="REGISTRE" d={1400} />
      <OpNode x={130} y={390} icon="bell" tone="yellow" label="ALERTE" d={1600} />
      <div className={A.fade} style={{ position: 'absolute', left: 0, right: 0, top: 258, textAlign: 'center', fontFamily: display, fontWeight: 700, fontSize: 30, letterSpacing: '0.1em', color: C.muted, ...dl(1800) }}>
        0 COPIER-COLLER
      </div>
    </div>
  </Frame>
);

// ─── Trainer ────────────────────────────────────────────────────────────────
const Pledge = ({ icon, tone, d, children }: { icon: IconName; tone: Tone; d: number; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 24, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={64} />
    <span style={{ fontSize: 30, lineHeight: 1.35, color: C.ink }}>{children}</span>
  </div>
);

const OP_Trainer: Page = () => (
  <Frame mod={0}>
    <Portrait x={210} y={300} w={280} />
    <div style={{ position: 'absolute', left: 720, top: 260, width: 1080 }}>
      <Eyebrow cls={A.in}>Votre formateur</Eyebrow>
      <div className={A.in} style={{ marginTop: 10, fontFamily: display, fontWeight: 700, fontSize: 84, lineHeight: 1.05, color: C.ink, ...dl(100) }}>
        {AUTHOR}
      </div>
      <div className={A.in} style={{ marginTop: 8, fontSize: 32, fontWeight: 600, color: C.blue, ...dl(200) }}>
        Formateur · Technologia
      </div>
      <div className={A.grow} style={{ marginTop: 34, height: 3, width: 1080, background: C.rule, ...dl(300) }} />
      <Eyebrow cls={A.in} c={C.muted} style={{ marginTop: 34, ...dl(380) }}>
        Mes engagements pour ces deux jours
      </Eyebrow>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Pledge icon="target" tone="blue" d={500}>
          Partir d’une tâche réelle de votre quotidien, pas d’un cas d’école
        </Pledge>
        <Pledge icon="puzzle" tone="teal" d={640}>
          Des outils gratuits et sans code, utilisables dès lundi
        </Pledge>
        <Pledge icon="play" tone="violet" d={780}>
          Construire vous-même, pas à pas, sur votre poste
        </Pledge>
        <Pledge icon="rocket" tone="yellow" d={920}>
          Repartir avec un workflow qui tourne et une fiche pour le déployer
        </Pledge>
      </div>
    </div>
  </Frame>
);

// ─── Round table ────────────────────────────────────────────────────────────
const AskCard = ({ n, title, sub, d }: { n: number; title: ReactNode; sub: ReactNode; d: number }) => (
  <div
    className={A.left}
    style={{ boxSizing: 'border-box', height: 132, display: 'flex', alignItems: 'center', gap: 26, padding: '0 30px', background: C.card, borderRadius: 'var(--osd-radius)', boxShadow: SHADOW, ...dl(d) }}
  >
    <Num n={n} size={60} />
    <div>
      <div style={{ fontSize: 32, fontWeight: 600, lineHeight: 1.25, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 24, lineHeight: 1.35, color: C.muted }}>{sub}</div>
    </div>
  </div>
);

const OP_Tour: Page = () => (
  <Frame mod={0} label="Ouverture · Faisons connaissance">
    <Title>Tour de table</Title>
    <Lede>Quarante secondes par personne, micro ouvert. Puis un sondage éclair.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 800, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AskCard n={1} title="Qui êtes-vous ?" sub="Prénom, rôle, organisation" d={100} />
      <AskCard n={2} title="La tâche qui vous fait perdre le plus de temps" sub="Celle que vous rêvez de ne plus jamais faire à la main" d={220} />
    </div>
    <Timer id="op-tour" minutes={8} label="Tour de table" compact cls={A.in} style={{ position: 'absolute', left: 120, top: 600, ...dl(460) }} />
    <div style={{ position: 'absolute', left: 990, top: 290, width: 810 }}>
      <Eyebrow cls={A.in} c={C.violet} style={dl(200)}>
        Sondage éclair · votre point de départ
      </Eyebrow>
      <Hint cls={A.in} style={{ marginTop: 8, ...dl(260) }}>
        Répondez par le numéro de la ligne
      </Hint>
      <Poll cls={A.in} style={{ marginTop: 22, ...dl(360) }}>
        <PollRow id="none" icon="eye" tone="grey" label="1 · Je n’ai jamais automatisé quoi que ce soit" />
        <PollRow id="macro" icon="table" tone="blue" label="2 · Formules, règles Outlook, petites macros" />
        <PollRow id="nocode" icon="puzzle" tone="teal" label="3 · J’ai déjà testé Make, Zapier ou Power Automate" />
        <PollRow id="ai" icon="sparkles" tone="violet" label="4 · J’utilise une IA générative au travail" />
        <PollRow id="both" icon="rocket" tone="green" label="5 · J’ai déjà relié une IA à un workflow" />
      </Poll>
    </div>
  </Frame>
);

// ─── Objectives: a rising staircase ─────────────────────────────────────────
const ObjStep = ({ i, h, tone, verb, when, children }: { i: number; h: number; tone: Tone; verb: string; when: string; children: ReactNode }) => (
  <div style={{ position: 'absolute', left: 120 + (i - 1) * 336, top: 960 - h, width: 316, height: h }}>
    <div className={A.growY} style={{ position: 'absolute', inset: 0, borderRadius: 18, background: C.card, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, ...dl(i * 120) }} />
    <div className={A.in} style={{ position: 'relative', padding: '34px 26px 0', ...dl(420 + i * 140) }}>
      <Num n={i} tone={tone} size={52} />
      <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 40, lineHeight: 1.05, letterSpacing: '0.03em', color: C.ink }}>{verb}</div>
      <div style={{ marginTop: 10, fontSize: 24, lineHeight: 1.38, color: C.soft }}>{children}</div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 26, bottom: 24, ...dl(600 + i * 140) }}>
      <Tag tone={when === 'Jour 1' ? 'blue' : 'green'} size={20}>
        {when}
      </Tag>
    </div>
  </div>
);

const OP_Objectives: Page = () => (
  <Frame mod={0}>
    <Title>Ce que vous saurez faire dans deux jours</Title>
    <Lede>Cinq objectifs, de l’analyse à la mise en production.</Lede>
    <ObjStep i={1} h={420} tone="blue" verb="IDENTIFIER" when="Jour 1">
      Les processus automatisables, avec une analyse structurée : SIPOC, cartographie
    </ObjStep>
    <ObjStep i={2} h={470} tone="teal" verb="CONCEVOIR" when="Jour 2">
      Des workflows clairs : déclencheurs, actions, gestion des données
    </ObjStep>
    <ObjStep i={3} h={520} tone="green" verb="METTRE EN ŒUVRE" when="Jour 1">
      Des automatisations RPA pour les tâches répétitives : courriels, rapports, synchronisation
    </ObjStep>
    <ObjStep i={4} h={570} tone="violet" verb="INTÉGRER L’IA" when="Jour 2">
      Classification, extraction et résumé au cœur d’un processus métier
    </ObjStep>
    <ObjStep i={5} h={620} tone="yellow" verb="DÉPLOYER" when="Jour 2">
      Tester, optimiser, mettre en production et mesurer le temps gagné
    </ObjStep>
  </Frame>
);

// ─── Programme (two days, ten modules) ──────────────────────────────────────
const ProgRow = ({ t, n, icon, tone = 'blue', d, children }: { t: string; n?: number; icon?: IconName; tone?: Tone; d: number; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 50, ...dl(d) }}>
    <span style={{ width: 80, fontFamily: mono, fontSize: 22, color: C.muted }}>{t}</span>
    {n ? (
      <Num n={pad(n)} tone={tone} size={40} />
    ) : (
      <span style={{ width: 40, display: 'flex', justifyContent: 'center' }}>
        <Icon name={icon ?? 'star'} size={30} color={C.muted} />
      </span>
    )}
    <span style={{ fontSize: 27, fontWeight: 500, color: C.ink }}>{children}</span>
  </div>
);

const ProgBreak = ({ t, d, children }: { t: string; d: number; children: ReactNode }) => (
  <div className={A.fade} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 34, ...dl(d) }}>
    <span style={{ width: 80, fontFamily: mono, fontSize: 19, color: C.faint }}>{t}</span>
    <span style={{ width: 40, height: 2, background: C.rule }} />
    <span style={{ fontSize: 22, fontStyle: 'italic', color: C.muted }}>{children}</span>
  </div>
);

const HalfCol = ({ x, title, sub, d, children }: { x: number; title: string; sub: string; d: number; children: ReactNode }) => (
  <div
    className={A.in}
    style={{ position: 'absolute', left: x, top: 210, width: 816, boxSizing: 'border-box', padding: '24px 36px 22px', background: C.card, borderRadius: 'var(--osd-radius)', boxShadow: SHADOW, ...dl(d) }}
  >
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 12 }}>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 46, color: C.ink }}>{title}</span>
      <span style={{ fontSize: 26, color: C.muted }}>{sub}</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>{children}</div>
  </div>
);

const OP_Program: Page = () => (
  <Frame mod={0}>
    <Title>Programme des deux jours</Title>
    <HalfCol x={120} title="Jour 1" sub="Repérer et comprendre" d={0}>
      <ProgRow t="9:00" icon="users" d={150}>
        Accueil, objectifs, votre tâche réelle
      </ProgRow>
      <ProgRow t="9:30" n={1} d={210}>
        Introduction à l’automatisation
      </ProgRow>
      <ProgRow t="10:15" n={2} tone="teal" d={270}>
        Identifier les processus répétitifs
      </ProgRow>
      <ProgBreak t="10:40" d={330}>
        Pause (puis exercices du module 2)
      </ProgBreak>
      <ProgBreak t="12:00" d={390}>
        Dîner
      </ProgBreak>
      <ProgRow t="13:00" n={3} d={450}>
        Les outils d’automatisation
      </ProgRow>
      <ProgRow t="13:50" n={4} d={510}>
        RPA · les robots logiciels
      </ProgRow>
      <ProgBreak t="14:40" d={570}>
        Pause
      </ProgBreak>
      <ProgRow t="14:55" n={5} tone="violet" d={630}>
        Automatiser avec l’IA
      </ProgRow>
      <ProgRow t="15:50" icon="flag" d={690}>
        Bilan du jour 1
      </ProgRow>
    </HalfCol>
    <HalfCol x={984} title="Jour 2" sub="Construire et déployer" d={150}>
      <ProgRow t="9:00" icon="loop" d={300}>
        Reprise et quiz éclair
      </ProgRow>
      <ProgRow t="9:15" n={6} tone="yellow" d={360}>
        Atelier · Un premier flux
      </ProgRow>
      <ProgBreak t="10:15" d={420}>
        Pause
      </ProgBreak>
      <ProgRow t="10:30" n={7} tone="teal" d={480}>
        Méthodologie de conception
      </ProgRow>
      <ProgRow t="11:10" n={8} d={540}>
        Construire un workflow automatisé
      </ProgRow>
      <ProgBreak t="12:00" d={600}>
        Dîner (puis atelier guidé du module 8)
      </ProgBreak>
      <ProgRow t="13:30" n={9} tone="yellow" d={660}>
        Atelier · Un scénario complet
      </ProgRow>
      <ProgBreak t="14:45" d={720}>
        Pause
      </ProgBreak>
      <ProgRow t="15:00" n={10} tone="green" d={780}>
        Tester, optimiser, déployer
      </ProgRow>
      <ProgRow t="15:45" icon="flag" d={840}>
        Plan d’action et évaluation
      </ProgRow>
    </HalfCol>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 916, display: 'flex', alignItems: 'center', gap: 28, fontSize: 23, color: C.soft, ...dl(900) }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Num n="" tone="blue" size={24} /> Notions et démonstrations
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Num n="" tone="teal" size={24} /> Analyse et conception
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Num n="" tone="violet" size={24} /> Intelligence artificielle
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Num n="" tone="yellow" size={24} /> Ateliers individuels
      </span>
    </div>
  </Frame>
);

// ─── How we work ────────────────────────────────────────────────────────────
const ActCard = ({ kind, icon, title, d, children }: { kind: Kind; icon: IconName; title: string; d: number; children: ReactNode }) => {
  const tone = KINDS[kind].tone;
  return (
    <div
      className={A.in}
      style={{ boxSizing: 'border-box', width: 390, height: 380, padding: '30px 30px', background: C.card, borderRadius: 'var(--osd-radius)', boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, ...dl(d) }}
    >
      <KindBadge kind={kind} />
      <IconTile name={icon} tone={tone} size={84} style={{ marginTop: 26 }} />
      <div style={{ marginTop: 20, fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.1, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 8, fontSize: 25, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  );
};

const RuleChip = ({ icon, d, children }: { icon: IconName; d: number; children: ReactNode }) => (
  <div
    className={A.in}
    style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 18, padding: '20px 24px', background: C.panel, borderRadius: 14, fontSize: 25, lineHeight: 1.3, color: C.ink, ...dl(d) }}
  >
    <Icon name={icon} size={34} color={C.blue} />
    <span>{children}</span>
  </div>
);

const OP_HowWeWork: Page = () => (
  <Frame mod={0}>
    <Title>Comment nous allons travailler</Title>
    <Lede>Une formation pratique : on observe, on essaie, on construit… et on mesure.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 40 }}>
      <ActCard kind="qcm" icon="check" title="Votez, vérifiez" d={100}>
        Vous répondez à voix haute, je clique. Les pièges sont voulus.
      </ActCard>
      <ActCard kind="demo" icon="play" title="Observez" d={220}>
        Des démonstrations en partage d’écran, dans de vrais outils.
      </ActCard>
      <ActCard kind="exercice" icon="pointer" title="Analysez" d={340}>
        Votre propre quotidien : tâches, temps perdu, critères.
      </ActCard>
      <ActCard kind="atelier" icon="puzzle" title="Construisez" d={460}>
        Des ateliers individuels, guidés pas à pas, avec minuteur et livrable.
      </ActCard>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 730, width: 1680, display: 'flex', gap: 24 }}>
      <RuleChip icon="chat" d={600}>
        Questions bienvenues, à tout moment, au micro
      </RuleChip>
      <RuleChip icon="lock" d={700}>
        Données fictives seulement dans les outils gratuits
      </RuleChip>
      <RuleChip icon="book" d={800}>
        Un cas différent à chaque module
      </RuleChip>
    </div>
    <Callout
      cls={A.in}
      title="Classe virtuelle"
      icon="video"
      tone="blue"
      size={26}
      style={{ position: 'absolute', left: 120, top: 856, width: 1680, padding: '14px 26px', ...dl(900) }}
    >
      Caméra si possible, micro coupé hors échanges. Idéal : deux écrans, la formation et votre outil d’automatisation.
    </Callout>
  </Frame>
);

// ─── Your real task: the personal thread of the two days ────────────────────
const CarnetStep = ({ n, mod, title, d, children }: { n: number; mod: string; title: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ display: 'flex', alignItems: 'flex-start', gap: 20, ...dl(d) }}>
    <Num n={n} tone={n <= 2 ? 'blue' : n <= 4 ? 'teal' : 'yellow'} size={50} />
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink }}>{title}</span>
        <Tag tone="grey" size={18}>
          {mod}
        </Tag>
      </div>
      <div style={{ fontSize: 23, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const OP_Carnet: Page = () => (
  <Frame mod={0} label="Ouverture · Votre fil conducteur">
    <Title>Votre tâche réelle, du constat au déploiement</Title>
    <Lede>Pas d’entreprise fictive commune : votre carnet de bord suit une vraie tâche de votre quotidien.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 300, width: 1060, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <CarnetStep n={1} mod="Module 2" title="Repérer" d={150}>
        Lister vos tâches répétitives et le temps qu’elles prennent.
      </CarnetStep>
      <CarnetStep n={2} mod="Module 2" title="Choisir" d={270}>
        Noter chaque tâche sur quatre critères, garder la meilleure candidate.
      </CarnetStep>
      <CarnetStep n={3} mod="Module 2" title="Analyser" d={390}>
        La décrire avec un SIPOC : fournisseurs, entrées, étapes, sorties, clients.
      </CarnetStep>
      <CarnetStep n={4} mod="Module 7" title="Concevoir" d={510}>
        Rédiger sa fiche de conception : besoin, étapes, diagramme, données.
      </CarnetStep>
      <CarnetStep n={5} mod="Modules 9 et 10" title="Construire et déployer" d={630}>
        La construire, la tester, mesurer le gain et documenter.
      </CarnetStep>
    </div>
    <div
      className={A.right}
      style={{ position: 'absolute', left: 1250, top: 300, width: 550, boxSizing: 'border-box', background: G.blue, borderRadius: 20, boxShadow: SHADOW, padding: '30px 34px', color: '#fff', ...dl(500) }}
    >
      <Icon name="note" size={48} color={C.yellow} />
      <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 40, lineHeight: 1.1 }}>Votre carnet de bord</div>
      <div style={{ marginTop: 14, fontSize: 25, lineHeight: 1.5, color: '#F2F8FC' }}>
        Ouvrez dès maintenant un document personnel (Word, Google Docs, OneNote…). Le modèle est dans votre guide du participant (et collé dans le Chat). Vous le complétez à chaque module.
      </div>
      <div style={{ marginTop: 22, padding: '14px 18px', borderRadius: 12, background: 'rgba(255,255,255,.14)', fontSize: 22, lineHeight: 1.45 }}>
        Pas d’idée de tâche ? Une liste d’exemples vous attend au module 2.
      </div>
    </div>
  </Frame>
);

// ─── Warm-up quiz (multi-answer) ────────────────────────────────────────────
const OP_Quiz0: Page = () => (
  <Frame mod={0} kind="qcm" beats={2} label="Ouverture · Point de départ">
    <Title>
      <span style={{ color: C.violet }}>Quiz éclair</span> · Vos intuitions de départ
    </Title>
    <Qcm
      multi
      q="Parmi ces affirmations sur l’automatisation, lesquelles sont vraies ?"
      explain="On automatise d’abord ce qui est fréquent et bien décrit. L’IA ajoute la lecture du texte libre, mais elle se trompe parfois : on garde un humain là où l’erreur coûte cher."
    >
      <Opt why="Piège ! Automatiser un processus confus, c’est produire des erreurs plus vite. On le clarifie d’abord : c’est tout le module 2.">
        On peut automatiser n’importe quel processus tel qu’il est
      </Opt>
      <Opt ok why="Oui : Make, Zapier ou Power Automate se construisent par blocs, sans écrire de code. Il faut surtout de la méthode.">
        Il n’est pas nécessaire de savoir programmer
      </Opt>
      <Opt ok why="Oui : un courriel rédigé librement, une facture scannée, une plainte… L’IA sait en extraire des champs ou les classer, là où une règle fixe échoue.">
        L’IA permet d’automatiser des tâches sur du texte non structuré
      </Opt>
      <Opt why="Piège ! L’IA reste probabiliste : elle classe juste la plupart du temps, pas toujours. On prévoit des contrôles et une validation humaine quand l’enjeu le demande.">
        Avec l’IA, un workflow n’a plus besoin d’être vérifié
      </Opt>
    </Qcm>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [OP_Cover, OP_Trainer, OP_Tour, OP_Objectives, OP_Program, OP_HowWeWork, OP_Carnet, OP_Quiz0];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · ACCUEIL (page affichée pendant l'arrivée des participants)

OBJECTIF — Installer un climat chaleureux et annoncer la promesse : en deux jours, chacun transforme une vraie tâche de son quotidien en workflow automatisé.

DIRE — « Bonjour et bienvenue à la formation Automatisation des tâches avec l'IA. Regardez l'animation : une demande arrive, l'IA la lit, elle est enregistrée dans un registre, quelqu'un est prévenu. Zéro copier-coller. Dans deux jours, vous aurez construit ce genre de circuit vous-mêmes. »

LOGISTIQUE — Classe virtuelle, 9 h – 16 h les deux jours. Pauses vers 10 h 40 et 14 h 40 le jour 1, 10 h 15 et 14 h 45 le jour 2, dîner 12 h – 13 h. Vérifiez le son, la caméra et l'accès au Chat. Rappelez les prérequis techniques : un navigateur récent, un compte Google (gratuit) et un accès à un assistant d'IA gratuit (Copilot, Gemini ou ChatGPT). Les comptes Make se créent ensemble au module 3.

TRANSITION — « Quelques mots sur moi avant de commencer. »`,
  `⏱ 2 min

OBJECTIF — Établir votre crédibilité et un contrat pédagogique clair.

DIRE — Présentez-vous en 60 à 90 secondes. À PERSONNALISER : votre parcours, une automatisation qui vous a fait gagner du temps, une qui a mal tourné.

Puis les quatre engagements :
1. « On part de votre réalité : chacun choisit une tâche de son travail. »
2. « Des outils gratuits et sans code : vous pourrez continuer lundi sans budget. »
3. « Vous construisez vous-mêmes, sur votre poste, pas à pas. »
4. « Vous repartez avec un workflow qui tourne et une fiche pour le déployer proprement. »

TRANSITION — « À votre tour maintenant. »`,
  `⏱ 8 min (40 secondes par personne, ajuster selon la taille du groupe)

OBJECTIF — Connaître le groupe et récolter déjà des tâches candidates.

ANIMATION — Lancez le minuteur. Appelez chaque personne par son prénom (ordre de la liste des participants) ; micro ouvert, deux réponses. Notez dans un document à vous les tâches citées : ce sont d'excellents exemples pour les modules 2 et 7, et vous pourrez y revenir par prénom.

SONDAGE — Chacun annonce le numéro de la ligne qui le décrit le mieux (1 à 5). Cliquez une fois la ligne par réponse (« − » corrige une erreur).

LECTURE —
• Majorité 1-2 : prenez votre temps aux modules 3 et 6, montrez chaque clic.
• Majorité 3-4 : accélérez le module 3, approfondissez l'IA (module 5) et les routeurs (module 8).
• Des 5 : proposez-leur les bonus des ateliers et demandez s'ils acceptent de montrer leur réalisation au module 9.

TRANSITION — « Voici ce qu'on vise ensemble. »`,
  `⏱ 1 min

OBJECTIF — Présenter les cinq objectifs officiels comme une progression.

DIRE — « Cinq marches, qui reprennent les objectifs de la formation. »
1. IDENTIFIER — « Repérer ce qui mérite d'être automatisé, avec des outils d'analyse simples : le SIPOC et la cartographie. »
2. CONCEVOIR — « Dessiner un workflow clair avant de cliquer : déclencheur, actions, données. »
3. METTRE EN ŒUVRE — « Les robots logiciels, le RPA, pour les tâches répétitives : courriels, rapports, synchronisation de fichiers. »
4. INTÉGRER L'IA — « Classer, extraire, résumer : l'IA comme une étape du workflow. »
5. DÉPLOYER — « Tester, mettre en production, et mesurer le temps réellement gagné. »

TRANSITION — « Voici comment les deux jours s'organisent. »`,
  `⏱ 1 min

OBJECTIF — Donner de la visibilité sur le déroulement des deux jours.

DIRE — « Le jour 1, on repère et on comprend : ce qu'est l'automatisation, comment choisir une tâche, le panorama des outils, les robots logiciels, puis ce que l'IA ajoute. »

« Le jour 2, on construit : un premier flux simple, une méthode de conception, la construction d'un vrai workflow avec une étape IA, un scénario complet, et pour finir les tests, la mesure du gain et le déploiement. »

À SOULIGNER — Les modules en jaune sont des ateliers : chacun sur son poste, avec un minuteur. Les numéros en haut à droite des pages sont cliquables : ils ramènent au début d'un module.

TRANSITION — « Comment on va travailler. »`,
  `⏱ 1 min

OBJECTIF — Expliquer les codes visuels et le contrat de participation.

DIRE — « Les étiquettes en haut des pages : QCM en violet, vous votez à voix haute et je clique ; DÉMO en bleu, je montre en partage d'écran ; EXERCICE en vert, vous analysez votre propre travail ; ATELIER en jaune, vous construisez. »

LES TROIS RÈGLES —
1. Questions bienvenues à tout moment, au micro.
2. « Dans les outils gratuits, on travaille avec des données fictives. Les offres gratuites d'IA peuvent réutiliser ce que vous envoyez : jamais de données clients ou personnelles réelles pendant la formation. »
3. Un cas différent à chaque module : comptabilité, service client, RH, ventes… pour que chacun s'y retrouve.

CLASSE VIRTUELLE — Caméra si possible, micro coupé hors échanges. Idéal : deux écrans, la formation d'un côté et Make de l'autre.

TRANSITION — « Et le fil qui relie tout : votre propre tâche. »`,
  `⏱ 2 min · CARNET DE BORD

OBJECTIF — Lancer le fil conducteur personnel des deux jours.

DIRE — « Pas d'entreprise imaginaire commune : votre fil rouge, c'est votre travail. Une tâche réelle, qu'on va repérer, choisir, analyser, concevoir, puis construire et déployer. »

LOGISTIQUE — Collez dans le Chat le modèle du carnet de bord (5 rubriques : 1. Mes tâches répétitives · 2. Ma tâche choisie et son score · 3. Mon SIPOC · 4. Ma fiche de conception · 5. Mon plan de test et mon gain). Chacun l'ouvre dans un document personnel.

À DIRE — « Si votre tâche contient des données sensibles, gardez la vraie tâche pour la conception, mais construisez avec des données inventées. »

TRANSITION — « Avant de commencer, testons vos intuitions. »`,
  `⏱ 2 min · QCM À RÉPONSES MULTIPLES

OBJECTIF — Faire émerger les représentations initiales sans juger.

ANIMATION — Lisez la question. Les participants annoncent les lettres qu'ils retiennent (ex. « B et C »). Cochez les options choisies par la majorité, puis « Valider ma sélection ». Cliquez ensuite chaque option pour lire l'explication. Avec →, vous révélez les bonnes réponses, puis l'essentiel.

RÉPONSES — B et C.
• A ✗ PIÈGE — On n'automatise pas le chaos : on clarifie d'abord (module 2).
• B ✓ — Les outils sans code se construisent par blocs.
• C ✓ — C'est l'apport majeur de l'IA : lire du texte libre (module 5).
• D ✗ PIÈGE — L'IA se trompe parfois : tests et validation humaine (modules 8 et 10).

TRANSITION — « Commençons par le commencement : qu'est-ce qu'automatiser ? »`,
];
// @@NOTES-END
