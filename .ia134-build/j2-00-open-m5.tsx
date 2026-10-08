// ─── Cover (Jour 2) ─────────────────────────────────────────────────────────
// Tools orbit the agent: the container spins, each tile counter-spins upright.
const J2oOrbitTile = ({ x, y, icon, tone, d }: { x: number; y: number; icon: IconName; tone: Tone; d: number }) => (
  <div className={A.spinBack} style={{ position: 'absolute', left: x - 50, top: y - 50, width: 100, height: 100 }}>
    <div
      className={A.pop}
      style={{
        width: 100,
        height: 100,
        borderRadius: 24,
        background: C.card,
        boxShadow: SHADOW,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...dl(d),
      }}
    >
      <Icon name={icon} size={50} color={STRONG[tone] === C.yellow ? C.amber : STRONG[tone]} />
    </div>
  </div>
);

const J2o_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <img
      src={logoStack}
      alt="Technologia"
      className={A.fade}
      style={{ position: 'absolute', left: 112, top: 78, height: 150, display: 'block' }}
    />
    <div style={{ position: 'absolute', left: 120, top: 318, width: 1000 }}>
      <Eyebrow cls={A.in} size={28}>
        Formation IA134 · Jour 2 de 2
      </Eyebrow>
      <h1
        className={A.in}
        style={{
          margin: '18px 0 0',
          fontFamily: display,
          fontWeight: 700,
          fontSize: 118,
          lineHeight: 1.0,
          letterSpacing: '-0.01em',
          color: C.ink,
          ...dl(120),
        }}
      >
        Feuille de route
        <br />
        pour l’IA agentique
      </h1>
      <p className={A.in} style={{ margin: '26px 0 0', fontSize: 40, lineHeight: 1.25, color: C.soft, ...dl(240) }}>
        Une exploration complète des agents d’IA
      </p>
      <div
        className={A.in}
        style={{
          marginTop: 46,
          display: 'inline-flex',
          alignItems: 'stretch',
          background: C.card,
          borderRadius: 14,
          boxShadow: SHADOW,
          overflow: 'hidden',
          ...dl(380),
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            background: G.green,
            color: '#fff',
            fontFamily: display,
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: '0.08em',
            whiteSpace: 'nowrap',
          }}
        >
          JOUR 2
        </span>
        <span style={{ padding: '16px 28px', fontSize: 30, fontWeight: 500, color: C.ink }}>
          Construire la feuille de route : de la priorité aux KPI
        </span>
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 870, display: 'flex', alignItems: 'center', gap: 22, ...dl(520) }}>
      <img
        src={formateur}
        alt={AUTHOR}
        style={{
          width: 96,
          height: 96,
          borderRadius: 999,
          objectFit: 'cover',
          objectPosition: '50% 20%',
          display: 'block',
          boxShadow: `0 0 0 4px #fff, 0 0 0 7px ${C.yellow}`,
        }}
      />
      <div>
        <div style={{ fontSize: 30, fontWeight: 600, color: C.ink }}>{AUTHOR}</div>
        <div style={{ fontSize: 24, color: C.muted }}>Formateur · Technologia</div>
      </div>
    </div>

    {/* Orbit: the building blocks of a road map around the agent */}
    <div className={A.spin} style={{ position: 'absolute', left: 1150, top: 250, width: 600, height: 600 }}>
      <svg width={600} height={600} viewBox="0 0 600 600" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <circle cx={300} cy={300} r={290} fill="none" stroke={C.rule} strokeWidth={3} strokeDasharray="4 14" strokeLinecap="round" />
        <path d="M300 300 L300 10" stroke="#B9D7EE" strokeWidth={3} strokeDasharray="10 14" className={A.march} />
        <path d="M300 300 L551 155" stroke="#B9D7EE" strokeWidth={3} strokeDasharray="10 14" className={A.march} />
        <path d="M300 300 L551 445" stroke="#B9D7EE" strokeWidth={3} strokeDasharray="10 14" className={A.march} />
        <path d="M300 300 L300 590" stroke="#B9D7EE" strokeWidth={3} strokeDasharray="10 14" className={A.march} />
        <path d="M300 300 L49 445" stroke="#B9D7EE" strokeWidth={3} strokeDasharray="10 14" className={A.march} />
        <path d="M300 300 L49 155" stroke="#B9D7EE" strokeWidth={3} strokeDasharray="10 14" className={A.march} />
      </svg>
      <J2oOrbitTile x={300} y={10} icon="target" tone="blue" d={600} />
      <J2oOrbitTile x={551} y={155} icon="shield" tone="teal" d={720} />
      <J2oOrbitTile x={551} y={445} icon="tool" tone="green" d={840} />
      <J2oOrbitTile x={300} y={590} icon="rocket" tone="yellow" d={960} />
      <J2oOrbitTile x={49} y={445} icon="gauge" tone="violet" d={1080} />
      <J2oOrbitTile x={49} y={155} icon="map" tone="coral" d={1200} />
    </div>
    <Squares s={240} x={1290} y={410} delay={200} />
    <div className={A.float} style={{ position: 'absolute', left: 1360, top: 470, width: 180, height: 180 }}>
      <div
        className={A.pop}
        style={{
          width: 180,
          height: 180,
          borderRadius: 36,
          background: C.card,
          boxShadow: '0 30px 60px -28px rgba(20,60,100,.55), 0 0 0 1px rgba(0,0,0,.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...dl(450),
        }}
      >
        <Icon name="bot" size={104} color={C.blue} sw={1.8} />
      </div>
    </div>
  </Frame>
);

// ─── Warm-up quiz: what do you remember from day 1? (multi-answer) ─────────
const J2o_Quiz: Page = () => (
  <Frame mod={0} kind="qcm" beats={2} label="Ouverture · Réactivation">
    <Title>
      <span style={{ color: C.violet }}>Quiz éclair</span> · Que retenez-vous du jour 1 ?
    </Title>
    <Qcm
      multi
      q="Parmi ces affirmations sur les agents d’IA, lesquelles sont vraies ?"
      explain="Agent = objectif + outils + boucle d’action. Le RAG apporte des sources sans toucher au modèle. Et plus l’agent agit, plus les garde-fous comptent : c’est exactement ce que nous allons cadrer aujourd’hui."
    >
      <Opt why="Piège ! Le RAG ne modifie pas le modèle : il retrouve les passages pertinents au moment de la question et les lui fournit, avec citations.">
        Le RAG ré-entraîne le modèle sur vos documents pour qu’il les connaisse par cœur
      </Opt>
      <Opt ok why="Oui : percevoir, raisonner, agir, observer. C’est la boucle du module 1 ; un LLM classique, lui, répond en un seul tour.">
        Un agent poursuit un objectif en choisissant lui-même ses actions et ses outils
      </Opt>
      <Opt why="Piège ! Les citations rendent une réponse vérifiable, pas une action sûre. Moindre privilège, plafonds et journalisation restent indispensables.">
        Un agent qui cite ses sources peut agir seul, sans garde-fou ni validation humaine
      </Opt>
      <Opt ok why="Oui : leçons de Replit (2025) et d’Air Canada (2024). L’entreprise reste responsable ; l’humain valide les actions à fort impact.">
        Pour un geste irréversible (remboursement, suppression), on exige une confirmation humaine
      </Opt>
    </Qcm>
  </Frame>
);

// ─── Day 2 programme + what each module produces ───────────────────────────
const J2oRow = ({ t, n, icon, tone = 'blue', d, children }: { t: string; n?: number; icon?: IconName; tone?: Tone; d: number; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 50, ...dl(d) }}>
    <span style={{ width: 80, fontFamily: mono, fontSize: 22, color: C.muted }}>{t}</span>
    {n ? (
      <Num n={pad(n)} tone={tone} size={42} />
    ) : (
      <span style={{ width: 42, display: 'flex', justifyContent: 'center' }}>
        <Icon name={icon ?? 'star'} size={30} color={C.muted} />
      </span>
    )}
    <span style={{ fontSize: 29, fontWeight: 500, color: C.ink }}>{children}</span>
  </div>
);

const J2oBreak = ({ t, d, children }: { t: string; d: number; children: ReactNode }) => (
  <div className={A.fade} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 30, ...dl(d) }}>
    <span style={{ width: 80, fontFamily: mono, fontSize: 20, color: C.faint }}>{t}</span>
    <span style={{ width: 42, height: 2, background: C.rule }} />
    <span style={{ fontSize: 22, fontStyle: 'italic', color: C.muted }}>{children}</span>
  </div>
);

const J2oDeliv = ({ n, icon, tone = 'blue', d, children }: { n: number; icon: IconName; tone?: Tone; d: number; children: ReactNode }) => (
  <div
    className={A.right}
    style={{
      boxSizing: 'border-box',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      padding: '0 20px 0 12px',
      background: C.card,
      borderRadius: 14,
      boxShadow: SHADOW_SM,
      ...dl(d),
    }}
  >
    <Num n={pad(n)} tone={tone} size={40} />
    <Icon name={icon} size={30} color={T[tone].fg} />
    <span style={{ fontSize: 26, color: C.ink }}>{children}</span>
  </div>
);

const J2o_Program: Page = () => (
  <Frame mod={0} label="Ouverture · Programme">
    <Title>Programme du jour 2</Title>
    <div
      className={A.in}
      style={{
        position: 'absolute',
        left: 120,
        top: 230,
        width: 960,
        boxSizing: 'border-box',
        padding: '24px 36px 22px',
        background: C.card,
        borderRadius: 'var(--osd-radius)',
        boxShadow: `0 0 0 3px ${C.blue}, ${SHADOW}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 12 }}>
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 46, color: C.blue }}>Jour 2</span>
        <span style={{ fontSize: 26, color: C.muted }}>Construire la feuille de route</span>
        <Tag tone="blue" size={20} style={{ marginLeft: 'auto' }}>
          Aujourd’hui
        </Tag>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <J2oRow t="9:00" icon="loop" d={150}>
          Réactivation
        </J2oRow>
        <J2oRow t="9:15" n={5} d={210}>
          Analyse de cas d’usage
        </J2oRow>
        <J2oBreak t="10:30" d={270}>
          Pause
        </J2oBreak>
        <J2oRow t="10:45" n={6} d={330}>
          Définition du périmètre
        </J2oRow>
        <J2oBreak t="12:00" d={390}>
          Dîner
        </J2oBreak>
        <J2oRow t="13:00" n={7} d={450}>
          Conception et choix des outils
        </J2oRow>
        <J2oRow t="13:50" n={8} tone="yellow" d={510}>
          Atelier · prototyper un agent
        </J2oRow>
        <J2oBreak t="14:50" d={570}>
          Pause
        </J2oBreak>
        <J2oRow t="15:00" n={9} d={630}>
          Plan de déploiement
        </J2oRow>
        <J2oRow t="15:30" n={10} d={690}>
          Mesure de performance
        </J2oRow>
        <J2oRow t="15:50" icon="flag" d={750}>
          Feuille de route 90 jours et clôture
        </J2oRow>
        <J2oBreak t="16:00" d={810}>
          Fin de la formation
        </J2oBreak>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1150, top: 236, width: 650 }}>
      <Eyebrow cls={A.in} c={C.green} style={dl(300)}>
        Ce que chaque module vous fait produire
      </Eyebrow>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <J2oDeliv n={5} icon="filter" d={500}>
          Vos 3 cas d’usage prioritaires
        </J2oDeliv>
        <J2oDeliv n={6} icon="doc" d={620}>
          La charte de votre agent
        </J2oDeliv>
        <J2oDeliv n={7} icon="tool" d={740}>
          Son schéma et ses outils
        </J2oDeliv>
        <J2oDeliv n={8} icon="puzzle" tone="yellow" d={860}>
          Un prototype en équipe
        </J2oDeliv>
        <J2oDeliv n={9} icon="rocket" d={980}>
          Son plan de déploiement
        </J2oDeliv>
        <J2oDeliv n={10} icon="gauge" d={1100}>
          Ses indicateurs de performance
        </J2oDeliv>
      </div>
      <div
        className={A.pop}
        style={{
          marginTop: 22,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '20px 26px',
          borderRadius: 'var(--osd-radius)',
          background: G.blue,
          color: '#fff',
          boxShadow: SHADOW,
          ...dl(1300),
        }}
      >
        <Icon name="map" size={44} color="#fff" />
        <div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 34, lineHeight: 1.1 }}>Votre feuille de route 90 jours</div>
          <div style={{ fontSize: 22, opacity: 0.9 }}>assemblée à 15 h 50, à rapporter au bureau</div>
        </div>
      </div>
    </div>
  </Frame>
);

// ═══ MODULE 5 · ANALYSE DE CAS D’USAGE ═════════════════════════════════════
const M5_Divider: Page = () => (
  <Section
    n={5}
    title={
      <>
        Analyse de
        <br />
        cas d’usage
      </>
    }
    sub="Repérer, évaluer et prioriser les cas où un agent crée vraiment de la valeur."
    dur="≈ 1 h 15"
  >
    <SecItem n={1}>Pourquoi prioriser avant de construire</SecItem>
    <SecItem n={2}>La matrice impact × complexité</SecItem>
    <SecItem n={3}>Atelier : classer 9 cas réels de Boréal</SecItem>
    <SecItem n={4}>Choisir 3 cas et chiffrer leur ROI</SecItem>
  </Section>
);
M5_Divider.transition = BLOOM;

// ─── Why prioritise: Gartner’s > 40 % cancellations ─────────────────────────
const M5Cause = ({ n, icon, tone, title, children }: { n: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.left(n)}>
    <div
      style={{
        boxSizing: 'border-box',
        height: 146,
        display: 'flex',
        alignItems: 'center',
        gap: 26,
        padding: '0 32px 0 26px',
        background: C.card,
        borderRadius: 'var(--osd-radius)',
        boxShadow: `inset 7px 0 0 ${STRONG[tone]}, ${SHADOW}`,
      }}
    >
      <IconTile name={icon} tone={tone} size={76} />
      <div>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.1, color: C.ink }}>{title}</div>
        <div style={{ marginTop: 6, fontSize: 26, lineHeight: 1.35, color: C.soft }}>{children}</div>
      </div>
    </div>
  </div>
);

const M5Step = ({ n, children }: { n: number; children: ReactNode }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 18px 8px 10px',
      background: C.card,
      borderRadius: 999,
      boxShadow: SHADOW_SM,
      fontSize: 24,
      fontWeight: 600,
      color: T.green.fg,
    }}
  >
    <Num n={n} tone="green" size={34} />
    {children}
  </span>
);

const M5_Why: Page = () => (
  <Frame mod={5} beats={4} label="Pourquoi prioriser">
    <Title>Pourquoi prioriser avant de construire ?</Title>
    <Lede>L’enthousiasme ne suffit pas : la plupart des échecs viennent d’un mauvais point de départ.</Lede>
    <div
      className={A.in}
      style={{
        position: 'absolute',
        left: 120,
        top: 280,
        width: 620,
        height: 480,
        boxSizing: 'border-box',
        padding: '34px 40px',
        background: C.card,
        borderRadius: 'var(--osd-radius)',
        boxShadow: `inset 0 7px 0 ${C.coral}, ${SHADOW}`,
        ...dl(150),
      }}
    >
      <Eyebrow c={C.coral}>Selon Gartner (juin 2025)</Eyebrow>
      <div style={{ marginTop: 14, fontFamily: display, fontWeight: 700, fontSize: 150, lineHeight: 1, color: C.coral }}>
        <CountUp to={40} dur={1400} delay={400} prefix="> " suffix=" %" />
      </div>
      <div style={{ marginTop: 16, fontSize: 30, lineHeight: 1.35, color: C.ink }}>
        des projets d’IA agentique seront <strong>annulés d’ici la fin de 2027</strong>.
      </div>
      <div style={{ marginTop: 22, paddingTop: 18, borderTop: `2px solid ${C.rule}`, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <Icon name="alert" size={30} color={C.amber} style={{ marginTop: 2 }} />
        <div style={{ fontSize: 23, lineHeight: 1.4, color: C.soft }}>
          <strong style={{ color: C.ink }}>« Agent washing »</strong> : beaucoup d’outils se disent « agentiques » sans l’être vraiment.
        </div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 800, top: 280, width: 1000, display: 'flex', flexDirection: 'column', gap: 21 }}>
      <M5Cause n={1} icon="money" tone="coral" title="Des coûts qui s’envolent">
        Appels au modèle, intégrations, supervision : la facture dépasse le pilote.
      </M5Cause>
      <M5Cause n={2} icon="target" tone="yellow" title="Une valeur d’affaires floue">
        On automatise ce qui impressionne, pas ce qui compte pour l’organisation.
      </M5Cause>
      <M5Cause n={3} icon="shield" tone="violet" title="Des risques mal maîtrisés">
        Accès trop larges, aucun plan B quand l’agent se trompe.
      </M5Cause>
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 800, width: 1680 }}>
      <Callout title="La parade" tone="green" icon="target" style={{ alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <span>
            <strong>Commencer petit, mesurer, puis élargir.</strong>
          </span>
          <M5Step n={1}>un cas</M5Step>
          <M5Step n={2}>une équipe</M5Step>
          <M5Step n={3}>des indicateurs</M5Step>
          <M5Step n={4}>90 jours</M5Step>
        </div>
      </Callout>
    </div>
  </Frame>
);

// ─── Criteria: impact vs complexity, scored 1 to 5 ──────────────────────────
const M5Crit = ({ n, d, icon, tone, title, children }: { n: number; d: number; icon: IconName; tone: Tone; title: string; children: ReactNode }) => (
  <div className={b.left(n)} style={dl(d)}>
    <div
      style={{
        boxSizing: 'border-box',
        height: 100,
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '0 26px 0 20px',
        background: C.card,
        borderRadius: 16,
        boxShadow: SHADOW_SM,
      }}
    >
      <IconTile name={icon} tone={tone} size={60} />
      <div>
        <div style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.15, color: C.ink }}>{title}</div>
        <div style={{ fontSize: 23, lineHeight: 1.3, color: C.muted }}>{children}</div>
      </div>
    </div>
  </div>
);

const M5AxisHead = ({ x, tone, icon, title, sub }: { x: number; tone: Tone; icon: IconName; title: string; sub: string }) => (
  <div
    className={A.in}
    style={{
      position: 'absolute',
      left: x,
      top: 280,
      width: 820,
      height: 80,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      padding: '0 26px',
      borderRadius: 16,
      background: STRONG[tone],
      color: '#fff',
      ...dl(x > 500 ? 260 : 120),
    }}
  >
    <Icon name={icon} size={40} color="#fff" />
    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 40 }}>{title}</span>
    <span style={{ marginLeft: 'auto', fontSize: 24, opacity: 0.92 }}>{sub}</span>
  </div>
);

const M5Pip = ({ v, tone }: { v: number; tone: Tone }) => (
  <span
    style={{
      width: 52,
      height: 52,
      borderRadius: 12,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: display,
      fontWeight: 700,
      fontSize: 30,
      background: T[tone].bg,
      color: T[tone].fg,
      boxShadow: `inset 0 0 0 2px ${T[tone].bd}`,
    }}
  >
    {v}
  </span>
);

const M5_Criteria: Page = () => (
  <Frame mod={5} beats={3} label="Critères d’évaluation">
    <Title>Deux axes pour évaluer chaque cas</Title>
    <Lede>On note chaque critère de 1 à 5 ; la moyenne de chaque axe place le cas sur la matrice.</Lede>
    <M5AxisHead x={120} tone="green" icon="trend" title="Impact" sub="plus c’est haut, mieux c’est" />
    <M5AxisHead x={980} tone="coral" icon="puzzle" title="Complexité" sub="plus c’est haut, plus c’est dur" />
    <div style={{ position: 'absolute', left: 120, top: 376, width: 820, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M5Crit n={1} d={0} icon="users" tone="green" title="Volume">
        Combien de fois par mois la tâche revient-elle ?
      </M5Crit>
      <M5Crit n={1} d={120} icon="clock" tone="green" title="Temps gagné">
        Minutes économisées à chaque occurrence
      </M5Crit>
      <M5Crit n={1} d={240} icon="money" tone="green" title="Valeur d’affaires">
        Revenus, satisfaction client, rétention
      </M5Crit>
      <M5Crit n={1} d={360} icon="shieldCheck" tone="green" title="Risque réduit">
        Moins d’erreurs, meilleure conformité
      </M5Crit>
    </div>
    <div style={{ position: 'absolute', left: 980, top: 376, width: 820, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <M5Crit n={2} d={0} icon="database" tone="coral" title="Données">
        Disponibles, propres, accessibles ?
      </M5Crit>
      <M5Crit n={2} d={120} icon="plug" tone="coral" title="Intégrations">
        Combien de systèmes faut-il brancher ?
      </M5Crit>
      <M5Crit n={2} d={240} icon="alert" tone="coral" title="Risque d’erreur">
        Que coûte une mauvaise action de l’agent ?
      </M5Crit>
      <M5Crit n={2} d={360} icon="org" tone="coral" title="Conduite du changement">
        Processus et habitudes à transformer
      </M5Crit>
    </div>
    <div className={b.on(3)} style={{ position: 'absolute', left: 120, top: 848, width: 1680 }}>
      <div
        style={{
          boxSizing: 'border-box',
          height: 104,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '0 30px',
          background: C.panel,
          borderRadius: 16,
        }}
      >
        <span style={{ fontSize: 26, fontWeight: 600, color: C.ink, marginRight: 8 }}>Échelle</span>
        <M5Pip v={1} tone="grey" />
        <M5Pip v={2} tone="grey" />
        <M5Pip v={3} tone="blue" />
        <M5Pip v={4} tone="blue" />
        <M5Pip v={5} tone="blue" />
        <span style={{ fontSize: 24, color: C.soft, marginLeft: 10 }}>1 = très faible · 5 = très fort</span>
        <span style={{ marginLeft: 'auto', fontSize: 24, color: C.soft }}>
          Ex. FAQ RH : impact <strong style={{ color: T.green.fg }}>3,5</strong> · complexité{' '}
          <strong style={{ color: T.coral.fg }}>1,5</strong>
        </span>
      </div>
    </div>
  </Frame>
);

// ─── The matrix, built quadrant by quadrant ─────────────────────────────────
const M5Quad = ({
  n,
  x,
  y,
  tone,
  icon,
  title,
  sub,
  tag,
}: {
  n: number;
  x: number;
  y: number;
  tone: Tone;
  icon: IconName;
  title: string;
  sub: string;
  tag: string;
}) => (
  <div className={b.pop(n)} style={{ position: 'absolute', left: x, top: y, width: 500, height: 280 }}>
    <div
      style={{
        boxSizing: 'border-box',
        width: 500,
        height: 280,
        padding: '26px 30px',
        borderRadius: 'var(--osd-radius)',
        background: T[tone].bg,
        boxShadow: `inset 0 0 0 2px ${T[tone].bd}`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconTile name={icon} tone={tone} size={60} solid />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 42, lineHeight: 1.05, color: T[tone].fg }}>{title}</span>
      </div>
      <div style={{ marginTop: 16, fontSize: 26, color: C.soft }}>{sub}</div>
      <div style={{ marginTop: 'auto' }}>
        <Tag tone={tone} size={24}>
          {tag}
        </Tag>
      </div>
    </div>
  </div>
);

const M5Rule = ({ n, num, tone, children }: { n: number; num: number; tone: Tone; children: ReactNode }) => (
  <div className={b.on(n)} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <Num n={num} tone={tone} size={44} />
    <span style={{ fontSize: 26, lineHeight: 1.3, color: C.ink }}>{children}</span>
  </div>
);

const M5_Matrix: Page = () => (
  <Frame mod={5} beats={6} label="La matrice">
    <Title>La matrice impact × complexité</Title>
    <Lede>Deux notes, une position : la matrice dit par où commencer… et quoi refuser.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1160, height: 690 }}>
      <svg width={1160} height={690} viewBox="0 0 1160 690" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <path d="M100 620 L100 6" stroke={C.ink} strokeWidth={4} fill="none" pathLength={1} className={b.draw(1)} />
        <path d="M100 620 L1150 620" stroke={C.ink} strokeWidth={4} fill="none" pathLength={1} className={b.draw(1)} />
        <path d="M88 20 L100 2 L112 20" stroke={C.ink} strokeWidth={4} fill="none" strokeLinejoin="round" className={b.fade(1)} />
        <path d="M1136 608 L1156 620 L1136 632" stroke={C.ink} strokeWidth={4} fill="none" strokeLinejoin="round" className={b.fade(1)} />
        <path d="M630 20 L630 600" stroke={C.faint} strokeWidth={3} strokeDasharray="8 10" fill="none" className={b.fade(1)} />
        <path d="M120 310 L1140 310" stroke={C.faint} strokeWidth={3} strokeDasharray="8 10" fill="none" className={b.fade(1)} />
        <g className={b.fade(1)}>
          <text x={44} y={315} transform="rotate(-90 44 315)" textAnchor="middle" fontFamily={display} fontWeight={700} fontSize={34} fill={T.green.fg}>
            IMPACT ↑
          </text>
          <text x={84} y={40} textAnchor="end" fontSize={22} fill={C.muted}>
            fort
          </text>
          <text x={84} y={600} textAnchor="end" fontSize={22} fill={C.muted}>
            faible
          </text>
          <text x={630} y={672} textAnchor="middle" fontFamily={display} fontWeight={700} fontSize={34} fill={T.coral.fg}>
            COMPLEXITÉ →
          </text>
          <text x={120} y={658} fontSize={22} fill={C.muted}>
            faible
          </text>
          <text x={1140} y={658} textAnchor="end" fontSize={22} fill={C.muted}>
            élevée
          </text>
        </g>
      </svg>
      <M5Quad n={2} x={120} y={20} tone="green" icon="bolt" title="Quick wins" sub="Fort impact · faible complexité" tag="À lancer maintenant" />
      <M5Quad n={3} x={640} y={20} tone="blue" icon="target" title="Projets stratégiques" sub="Fort impact · complexité élevée" tag="À planifier par étapes" />
      <M5Quad n={4} x={120} y={320} tone="grey" icon="sparkles" title="Gadgets" sub="Faible impact · faible complexité" tag="Seulement si presque gratuit" />
      <M5Quad n={5} x={640} y={320} tone="coral" icon="x" title="À éviter" sub="Faible impact · complexité élevée" tag="À refuser poliment" />
    </div>
    <div style={{ position: 'absolute', left: 1340, top: 290, width: 460 }}>
      <div className={b.fade(2)}>
        <Eyebrow>Ordre de lecture</Eyebrow>
      </div>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <M5Rule n={2} num={1} tone="green">
          Les <strong>quick wins</strong> financent et crédibilisent la suite.
        </M5Rule>
        <M5Rule n={3} num={2} tone="blue">
          Les <strong>stratégiques</strong> se découpent en étapes, quick win en tête.
        </M5Rule>
        <M5Rule n={4} num={3} tone="grey">
          Les <strong>gadgets</strong> amusent, mais ne changent rien.
        </M5Rule>
        <M5Rule n={5} num={4} tone="coral">
          Les cas <strong>à éviter</strong> consomment budget et confiance.
        </M5Rule>
      </div>
      <div className={b.pop(6)} style={{ marginTop: 34 }}>
        <Callout title="Règle d’or" tone="yellow" icon="bulb" size={26}>
          Notez en équipe, pas seul : l’écart entre deux notes révèle un risque caché.
        </Callout>
      </div>
    </div>
  </Frame>
);

// ─── Workshop: place Boréal’s 9 cases on the matrix ─────────────────────────
const M5Id = ({ n, tone = 'blue' }: { n: number; tone?: Tone }) => (
  <span
    style={{
      flex: 'none',
      width: 32,
      height: 32,
      borderRadius: 999,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: STRONG[tone],
      color: '#fff',
      fontFamily: display,
      fontWeight: 700,
      fontSize: 20,
    }}
  >
    {n}
  </span>
);

const M5Zone = ({ x, y, d, tone, icon, title }: { x: number; y: number; d: number; tone: Tone; icon: IconName; title: string }) => (
  <div
    className={A.fade}
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 495,
      height: 288,
      boxSizing: 'border-box',
      padding: '14px 18px',
      borderRadius: 18,
      background: T[tone].bg,
      boxShadow: `inset 0 0 0 2px ${T[tone].bd}`,
      ...dl(d),
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Icon name={icon} size={28} color={T[tone].fg} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: T[tone].fg }}>{title}</span>
    </div>
  </div>
);

const M5SolChip = ({ id, tone, children }: { id: number; tone: Tone; children: ReactNode }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '5px 14px 5px 6px',
      borderRadius: 999,
      background: C.card,
      boxShadow: `0 0 0 2px ${STRONG[tone]}, ${SHADOW_SM}`,
      fontSize: 21,
      fontWeight: 600,
      color: C.ink,
    }}
  >
    <M5Id n={id} tone={tone} />
    {children}
  </span>
);

const M5Sol = ({ n, x, y, children }: { n: number; x: number; y: number; children: ReactNode }) => (
  <div className={b.pop(n)} style={{ position: 'absolute', left: x, top: y, zIndex: 4 }}>
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>{children}</div>
  </div>
);

const M5_Atelier: Page = () => (
  <Frame mod={5} kind="atelier" beats={4} label="Atelier · matrice Boréal">
    <Title>Atelier · Classez les 9 cas de Boréal</Title>
    <Lede>Glissez chaque cas dans un quadrant, puis comparez avec la solution (flèche →).</Lede>

    {/* Matrix frame */}
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <path d="M760 890 L760 270" stroke={C.ink} strokeWidth={4} fill="none" pathLength={1} className={A.draw} />
      <path d="M760 890 L1800 890" stroke={C.ink} strokeWidth={4} fill="none" pathLength={1} className={A.draw} />
      <text x={728} y={580} transform="rotate(-90 728 580)" textAnchor="middle" fontFamily={display} fontWeight={700} fontSize={28} fill={T.green.fg}>
        IMPACT ↑
      </text>
      <text x={1290} y={930} textAnchor="middle" fontFamily={display} fontWeight={700} fontSize={28} fill={T.coral.fg}>
        COMPLEXITÉ →
      </text>
    </svg>
    <M5Zone x={780} y={284} d={150} tone="green" icon="bolt" title="Quick wins" />
    <M5Zone x={1295} y={284} d={250} tone="blue" icon="target" title="Projets stratégiques" />
    <M5Zone x={780} y={592} d={350} tone="grey" icon="sparkles" title="Gadgets" />
    <M5Zone x={1295} y={592} d={450} tone="coral" icon="x" title="À éviter" />

    {/* Solution, revealed one quadrant per beat */}
    <M5Sol n={1} x={796} y={516}>
      <M5SolChip id={1} tone="green">FAQ RH</M5SolChip>
      <M5SolChip id={2} tone="green">Accès TI</M5SolChip>
      <M5SolChip id={7} tone="green">Ventes</M5SolChip>
    </M5Sol>
    <M5Sol n={2} x={1311} y={516}>
      <M5SolChip id={3} tone="blue">RAG (limite)</M5SolChip>
      <M5SolChip id={4} tone="blue">Courriels</M5SolChip>
      <M5SolChip id={5} tone="blue">Factures</M5SolChip>
    </M5Sol>
    <M5Sol n={3} x={796} y={824}>
      <M5SolChip id={8} tone="grey">Mèmes</M5SolChip>
    </M5Sol>
    <M5Sol n={3} x={1311} y={824}>
      <M5SolChip id={6} tone="coral">Négociation autonome</M5SolChip>
    </M5Sol>
    <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 832, width: 600 }}>
      <div
        style={{
          boxSizing: 'border-box',
          height: 128,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '0 20px',
          borderRadius: 16,
          background: T.coral.bg,
          boxShadow: `inset 0 0 0 2px ${C.coral}`,
        }}
      >
        <M5Id n={9} tone="coral" />
        <div>
          <div style={{ fontSize: 25, fontWeight: 700, color: T.coral.fg }}>Piège : hors matrice !</div>
          <div style={{ fontSize: 21, lineHeight: 1.3, color: C.ink }}>
            Les tournées, c’est de l’optimisation classique : un solveur fait mieux, moins cher, sans agent.
          </div>
        </div>
      </div>
    </div>

    {/* The 9 cards to drag */}
    <Drag x={120} y={280} size={22}>
      <M5Id n={1} />
      FAQ RH · 300 demandes/mois
    </Drag>
    <Drag x={120} y={340} size={22}>
      <M5Id n={2} />
      Mots de passe et accès TI
    </Drag>
    <Drag x={120} y={400} size={22}>
      <M5Id n={3} />
      Assistant documentaire (RAG)
    </Drag>
    <Drag x={120} y={460} size={22}>
      <M5Id n={4} />
      Tri et réponse aux courriels clients
    </Drag>
    <Drag x={120} y={520} size={22}>
      <M5Id n={5} />
      Traitement des factures fournisseurs
    </Drag>
    <Drag x={120} y={580} size={22}>
      <M5Id n={6} />
      Négocier seul avec les fournisseurs
    </Drag>
    <Drag x={120} y={640} size={22}>
      <M5Id n={7} />
      Rapport de ventes hebdomadaire
    </Drag>
    <Drag x={120} y={700} size={22}>
      <M5Id n={8} />
      Chatbot d’anniversaires et de mèmes
    </Drag>
    <Drag x={120} y={760} size={22}>
      <M5Id n={9} />
      Planification des tournées de livraison
    </Drag>
  </Frame>
);

// ─── Quick wins: how to recognise them ──────────────────────────────────────
const M5Trait = ({ d, icon, children }: { d: number; icon: IconName; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 86, ...dl(d) }}>
    <IconTile name={icon} tone="green" size={60} />
    <span style={{ fontSize: 29, lineHeight: 1.3, color: C.ink }}>{children}</span>
  </div>
);

const M5Ex = ({ n, icon, team, title, stat, children }: { n: number; icon: IconName; team: string; title: string; stat: string; children: ReactNode }) => (
  <div className={b.on(n)}>
    <div
      style={{
        boxSizing: 'border-box',
        height: 150,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '0 30px 0 24px',
        background: C.card,
        borderRadius: 'var(--osd-radius)',
        boxShadow: `inset 7px 0 0 ${C.green}, ${SHADOW}`,
      }}
    >
      <IconTile name={icon} tone="green" size={72} solid />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Tag tone="green" size={20}>
            {team}
          </Tag>
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 34, color: C.ink }}>{title}</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 24, lineHeight: 1.35, color: C.soft }}>{children}</div>
      </div>
      <div style={{ flex: 'none', textAlign: 'right', fontFamily: display, fontWeight: 700, fontSize: 30, lineHeight: 1.1, color: T.green.fg, width: 150 }}>
        {stat}
      </div>
    </div>
  </div>
);

const M5_QuickWins: Page = () => (
  <Frame mod={5} beats={4} label="Les quick wins">
    <Title>Les quick wins : à quoi les reconnaître ?</Title>
    <Lede>Fréquents, répétitifs, peu risqués, avec des données déjà disponibles.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 700 }}>
      <Eyebrow cls={A.in} c={C.green}>
        Les 5 signes
      </Eyebrow>
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <M5Trait d={150} icon="loop">
          Tâche fréquente et répétitive
        </M5Trait>
        <M5Trait d={270} icon="database">
          Données déjà accessibles
        </M5Trait>
        <M5Trait d={390} icon="shieldCheck">
          Erreur rattrapable, risque faible
        </M5Trait>
        <M5Trait d={510} icon="gauge">
          Gain mesurable en quelques semaines
        </M5Trait>
        <M5Trait d={630} icon="users">
          Un parrain d’affaires motivé
        </M5Trait>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 880, top: 280, width: 920 }}>
      <Eyebrow cls={A.in} style={dl(300)}>
        Chez Boréal
      </Eyebrow>
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <M5Ex n={1} icon="key" team="TI" title="Mots de passe et accès" stat="≈ 630 billets/mois">
          Vérifie l’identité, réinitialise, escalade si doute.
        </M5Ex>
        <M5Ex n={2} icon="chat" team="RH" title="FAQ RH" stat="300 demandes/mois">
          Répond selon la politique RH, sources citées.
        </M5Ex>
        <M5Ex n={3} icon="chart" team="Ventes" title="Rapport hebdomadaire" stat="chaque lundi">
          Compile le CRM et l’ERP, rédige le résumé.
        </M5Ex>
      </div>
    </div>
    <div className={b.on(4)} style={{ position: 'absolute', left: 120, top: 830, width: 1680 }}>
      <Callout title="À retenir" tone="yellow" icon="rocket">
        Un quick win n’est pas une fin : c’est la <strong>preuve de valeur</strong> qui débloque le budget des projets stratégiques.
      </Callout>
    </div>
  </Frame>
);

// ─── Workshop: choose your 3 use cases ──────────────────────────────────────
const M5Do = ({ num, d, title, children }: { num: number; d: number; title: string; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 20, ...dl(d) }}>
    <Num n={num} tone="yellow" size={48} />
    <div>
      <div style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.2, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 2, fontSize: 24, lineHeight: 1.35, color: C.muted }}>{children}</div>
    </div>
  </div>
);

const M5Cell = ({ w, head, ex, children }: { w: number; head?: boolean; ex?: boolean; children?: ReactNode }) => (
  <div
    style={{
      width: w,
      flex: 'none',
      boxSizing: 'border-box',
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      fontSize: head ? 22 : 24,
      fontWeight: head ? 700 : 400,
      letterSpacing: head ? '0.06em' : undefined,
      textTransform: head ? 'uppercase' : undefined,
      fontStyle: ex ? 'italic' : undefined,
      color: head ? C.muted : ex ? C.soft : C.ink,
    }}
  >
    {children}
  </div>
);

const M5Line = ({ h, head, ex, children }: { h: number; head?: boolean; ex?: boolean; children: ReactNode }) => (
  <div
    style={{
      height: h,
      display: 'flex',
      alignItems: 'stretch',
      borderBottom: head ? `3px solid ${C.ink}` : `2px dashed ${C.rule}`,
      background: ex ? T.yellow.bg : undefined,
    }}
  >
    {children}
  </div>
);

const M5Row = ({ id }: { id: string }) => (
  <M5Line h={92}>
    <M5Cell w={340}>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.faint }}>{id}</span>
    </M5Cell>
    <M5Cell w={130}>
      <span style={{ color: C.faint }}>__ / 5</span>
    </M5Cell>
    <M5Cell w={150}>
      <span style={{ color: C.faint }}>__ / 5</span>
    </M5Cell>
    <M5Cell w={180} />
  </M5Line>
);

const M5_Choose: Page = () => (
  <Frame mod={5} kind="atelier" label="Atelier · vos 3 cas">
    <Title>Atelier · Choisissez vos 3 cas d’usage</Title>
    <Lede>En équipe, retenez 3 cas pour votre organisation (ou pour Boréal) et remplissez la fiche.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 284, width: 760, display: 'flex', flexDirection: 'column', gap: 26 }}>
      <M5Do num={1} d={150} title="Listez vos irritants">
        Les 3 notés hier soir, plus ceux de vos collègues
      </M5Do>
      <M5Do num={2} d={270} title="Notez impact et complexité">
        De 1 à 5, avec les 8 critères vus plus tôt
      </M5Do>
      <M5Do num={3} d={390} title="Placez-les sur la matrice">
        Au tableau ou sur votre feuille
      </M5Do>
      <M5Do num={4} d={510} title="Retenez 3 cas">
        Idéalement 1 quick win et 1 ou 2 stratégiques
      </M5Do>
    </div>
    <Timer id="m5-choix" minutes={10} label="Choix des 3 cas" compact cls={A.in} style={{ position: 'absolute', left: 120, top: 800, width: 790, ...dl(650) }} />
    <div
      className={A.right}
      style={{
        position: 'absolute',
        left: 940,
        top: 284,
        width: 860,
        boxSizing: 'border-box',
        padding: '26px 30px 30px',
        background: C.card,
        borderRadius: 'var(--osd-radius)',
        boxShadow: `inset 0 7px 0 ${C.yellow}, ${SHADOW}`,
        ...dl(300),
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <Icon name="note" size={36} color={C.amber} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 36, color: C.ink }}>Fiche de priorisation</span>
      </div>
      <M5Line h={52} head>
        <M5Cell w={340} head>
          Cas d’usage
        </M5Cell>
        <M5Cell w={130} head>
          Impact
        </M5Cell>
        <M5Cell w={150} head>
          Complexité
        </M5Cell>
        <M5Cell w={180} head>
          Parrain
        </M5Cell>
      </M5Line>
      <M5Line h={70} ex>
        <M5Cell w={340} ex>
          Ex. : accès TI
        </M5Cell>
        <M5Cell w={130} ex>
          4,5
        </M5Cell>
        <M5Cell w={150} ex>
          1,5
        </M5Cell>
        <M5Cell w={180} ex>
          Dir. TI
        </M5Cell>
      </M5Line>
      <M5Row id="Cas A" />
      <M5Row id="Cas B" />
      <M5Row id="Cas C" />
      <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.soft }}>
        <Icon name="user" size={26} color={C.amber} />
        <span>
          <strong style={{ color: C.ink }}>Parrain</strong> : le gestionnaire qui portera le cas et en mesurera les gains.
        </span>
      </div>
    </div>
  </Frame>
);

// ─── ROI calculator ─────────────────────────────────────────────────────────
const M5_SETUP = 20000;

const M5Slider = ({
  label,
  value,
  unit,
  children,
}: {
  label: string;
  value: string;
  unit: string;
  children: ReactNode;
}) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
      <span style={{ fontSize: 26, color: C.soft }}>{label}</span>
      <span style={{ marginLeft: 'auto', fontFamily: display, fontWeight: 700, fontSize: 38, color: C.ink, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </span>
      <span style={{ fontSize: 22, color: C.muted, width: 132 }}>{unit}</span>
    </div>
    <div style={{ marginTop: 6 }}>{children}</div>
  </div>
);

const M5Out = ({ label, value, tone }: { label: string; value: string; tone: Tone }) => (
  <div
    style={{
      boxSizing: 'border-box',
      height: 96,
      display: 'flex',
      alignItems: 'center',
      padding: '0 28px',
      background: C.card,
      borderRadius: 16,
      boxShadow: `inset 6px 0 0 ${STRONG[tone]}, ${SHADOW_SM}`,
    }}
  >
    <span style={{ fontSize: 25, color: C.soft }}>{label}</span>
    <span style={{ marginLeft: 'auto', fontFamily: display, fontWeight: 700, fontSize: 44, color: T[tone].fg, fontVariantNumeric: 'tabular-nums' }}>
      {value}
    </span>
  </div>
);

const M5_Roi: Page = () => {
  const [vol, setVol] = useState(630);
  const [mins, setMins] = useState(8);
  const [rate, setRate] = useState(45);
  const [cost, setCost] = useState(1500);
  const hours = (vol * mins * 12) / 60;
  const gross = hours * rate;
  const run = cost * 12;
  const net = gross - run;
  const monthly = net / 12;
  const payback = monthly > 0 ? M5_SETUP / monthly : null;
  const ok = payback !== null && payback <= 12;
  const pct = payback === null ? 100 : Math.min(payback / 24, 1) * 100;
  return (
    <Frame mod={5} kind="atelier" label="Calculateur de ROI">
      <Title>Calculateur de ROI : combien rapporte un agent ?</Title>
      <Lede>Bougez les curseurs. Point de départ : les billets « mot de passe » du TI de Boréal.</Lede>
      <div
        className={A.in}
        style={{
          position: 'absolute',
          left: 120,
          top: 280,
          width: 900,
          boxSizing: 'border-box',
          padding: '28px 36px 30px',
          background: C.card,
          borderRadius: 'var(--osd-radius)',
          boxShadow: SHADOW,
          display: 'flex',
          flexDirection: 'column',
          gap: 26,
          ...dl(120),
        }}
      >
        <M5Slider label="Volume de tâches" value={fr(vol)} unit="par mois">
          <Range value={vol} onChange={setVol} min={50} max={3000} step={10} w={828} />
        </M5Slider>
        <M5Slider label="Temps gagné par tâche" value={fr(mins)} unit="minutes">
          <Range value={mins} onChange={setMins} min={1} max={60} w={828} tone="teal" />
        </M5Slider>
        <M5Slider label="Taux horaire chargé" value={fr(rate)} unit="$ / heure">
          <Range value={rate} onChange={setRate} min={25} max={120} step={5} w={828} tone="green" />
        </M5Slider>
        <M5Slider label="Coût mensuel de l’agent" value={fr(cost)} unit="$ / mois">
          <Range value={cost} onChange={setCost} min={0} max={10000} step={100} w={828} tone="coral" />
        </M5Slider>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.muted }}>
          <Icon name="note" size={24} color={C.muted} />
          Hypothèse : mise en place de {fr(M5_SETUP)} $ (intégration, tests, formation).
        </div>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1080, top: 280, width: 720, display: 'flex', flexDirection: 'column', gap: 14, ...dl(300) }}>
        <M5Out label="Heures libérées par an" value={`${fr(hours)} h`} tone="teal" />
        <M5Out label="Économies brutes par an" value={`${fr(gross)} $`} tone="green" />
        <M5Out label="Coût de l’agent par an" value={`− ${fr(run)} $`} tone="coral" />
        <div
          style={{
            boxSizing: 'border-box',
            padding: '20px 28px 24px',
            borderRadius: 'var(--osd-radius)',
            background: net > 0 ? G.green : C.coral,
            color: '#fff',
            boxShadow: SHADOW,
            transition: 'background 300ms',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 26, opacity: 0.95 }}>Gain net par an</span>
            <span style={{ marginLeft: 'auto', fontFamily: display, fontWeight: 700, fontSize: 64, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {fr(net)} $
            </span>
          </div>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 26, opacity: 0.95 }}>Récupération de l’investissement</span>
            <span style={{ marginLeft: 'auto', fontFamily: display, fontWeight: 700, fontSize: 40, fontVariantNumeric: 'tabular-nums' }}>
              {payback === null ? 'jamais' : `${fr(payback, 1)} mois`}
            </span>
          </div>
          <div style={{ marginTop: 14, height: 14, borderRadius: 999, background: 'rgba(255,255,255,.3)', position: 'relative' }}>
            <div
              style={{
                width: `${pct}%`,
                height: 14,
                borderRadius: 999,
                background: '#fff',
                transition: 'width 300ms',
              }}
            />
            <div style={{ position: 'absolute', left: '50%', top: -6, width: 3, height: 26, background: 'rgba(255,255,255,.85)' }} />
          </div>
          <div style={{ marginTop: 6, display: 'flex', fontSize: 20, opacity: 0.9 }}>
            <span>0</span>
            <span style={{ marginLeft: 'auto', marginRight: 'auto' }}>12 mois</span>
            <span>24 mois</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: ok ? T.green.fg : T.coral.fg }}>
          <Icon name={ok ? 'check' : 'alert'} size={26} color={ok ? C.green : C.coral} />
          {ok ? 'Rentable en moins d’un an : bon candidat pour la feuille de route.' : 'Plus d’un an pour rentrer dans ses frais : à revoir ou à phaser.'}
        </div>
      </div>
    </Frame>
  );
};

// ─── QCM 6: the best first project ──────────────────────────────────────────
const M5_Qcm6: Page = () => (
  <QcmPage
    mod={5}
    n={6}
    title="Le bon premier projet"
    q="Boréal hésite pour son tout premier agent. Quel projet devrait-elle lancer en premier ?"
    explain="Le premier projet sert à prouver la valeur et à apprendre. On vise un quick win : fort volume, faible complexité, risque maîtrisé. Les projets spectaculaires viendront quand l’équipe et les garde-fous seront prêts."
  >
    <Opt why="Piège ! Impressionnant ne veut pas dire prioritaire. Complexité et risque élevés, valeur incertaine : c’est le profil des projets qu’on finit par annuler.">
      La négociation autonome avec les fournisseurs : c’est le cas qui impressionnera le plus la direction
    </Opt>
    <Opt why="Non : beaucoup d’intégrations, c’est de la complexité, pas de l’impact. Bon projet stratégique, mais pas pour débuter.">
      Le traitement des factures, parce qu’il touche le plus grand nombre de systèmes à la fois
    </Opt>
    <Opt ok why="Oui : environ 630 billets par mois, des données déjà là, une erreur rattrapable. Le quick win type, qui prouve la valeur vite.">
      La réinitialisation des mots de passe : fréquente, mesurable et peu risquée
    </Opt>
    <Opt why="Non : attendre, c’est ne rien apprendre. Un quick win bien encadré bâtit la compétence et la confiance dès maintenant.">
      Aucun : mieux vaut attendre que les modèles soient plus fiables avant de commencer
    </Opt>
  </QcmPage>
);

// @@PAGES-BEGIN
export const __pages = [
  J2o_Cover,
  J2o_Quiz,
  J2o_Program,
  M5_Divider,
  M5_Why,
  M5_Criteria,
  M5_Matrix,
  M5_Atelier,
  M5_QuickWins,
  M5_Choose,
  M5_Roi,
  M5_Qcm6,
];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · Accueil du jour 2 (avant 9 h 00, page affichée pendant l'arrivée des participants)

OBJECTIF — Relancer l'énergie et annoncer le changement de posture : hier, on comprenait ; aujourd'hui, on construit.

DIRE — « Bon matin tout le monde ! J'espère que la nuit a été bonne… et que les agents ne vous ont pas suivis dans vos rêves. Hier, on a compris ce qu'est un agent, ses grandes familles et des cas réels, y compris des échecs publics. Aujourd'hui, on passe en mode chantier : on va prioriser des cas d'usage, cadrer un agent, choisir ses outils, le prototyper, planifier son déploiement et définir comment mesurer s'il fonctionne. »

Montrer l'orbite : « Même agent au centre qu'hier, mais regardez ce qui tourne autour : une cible, un bouclier, des outils, une fusée, une jauge et une carte. C'est le programme du jour : objectifs, garde-fous, conception, déploiement, mesure… et la carte, c'est votre feuille de route. »

LOGISTIQUE — Horaire 9 h – 16 h, pauses vers 10 h 30 et 14 h 50, dîner à midi. Rappeler le devoir d'hier soir : noter trois irritants de son équipe. « Gardez-les sous la main : on s'en sert dans moins d'une heure. »

TRANSITION — « Avant tout, un petit échauffement pour réveiller ce qu'on a vu hier. »`,
  `⏱ 8 min · QCM À RÉPONSES MULTIPLES · RÉACTIVATION

OBJECTIF — Réactiver trois notions clés du jour 1 (définition d'un agent, RAG, garde-fous) et repérer ce qui n'est pas encore ancré.

ANIMATION — Lisez la question. Vote à main levée option par option (A, B, C, D). Cochez les options choisies par la majorité, cliquez « Valider ma sélection », puis cliquez chaque option pour afficher l'explication. Flèche → : les bonnes réponses ; flèche → encore : l'essentiel.

RÉPONSES — B et D.
• A ✗ PIÈGE — « Erreur très répandue. Le RAG ne touche pas au modèle : on cherche les bons passages au moment de la question, on les colle dans le contexte, et le modèle répond en les citant. Ré-entraîner, c'est le fine-tuning : beaucoup plus coûteux. »
• B ✓ — La boucle percevoir, raisonner, agir, observer. Demandez : « Quelle différence avec ChatGPT en mode conversation ? » Réponse attendue : un tour de réponse, sans action sur les systèmes.
• C ✗ PIÈGE — « Une citation prouve d'où vient l'information, pas que l'action est bonne. »
• D ✓ — Rappeler Replit (base de production effacée malgré un gel des changements) et Air Canada (l'entreprise tenue responsable de ce que dit son clavardeur).

ADAPTER — Si plus d'un tiers du groupe tombe dans A, prenez deux minutes pour redessiner le pipeline RAG au tableau.

TRANSITION — « Bien réveillés ? Voyons le programme de la journée. »`,
  `⏱ 5 min · Programme (vers 9 h 10)

OBJECTIF — Donner de la visibilité sur la journée et montrer que chaque module produit une pièce concrète de la feuille de route.

DIRE — « La journée suit la vie d'un projet d'agent. Ce matin, module 5 : on choisit quoi faire, avec une matrice impact-complexité. Module 6 : on cadre ce que l'agent fait, ne fait pas et quand il passe la main, avec un œil sur les hallucinations, la sécurité et la Loi 25. »

« Cet après-midi, module 7 : on conçoit le schéma de l'agent et on choisit les outils. Module 8 : atelier, on prototype en équipe le tri des courriels du service client de Boréal. Enfin, modules 9 et 10 : comment passer du prototype à la production, et comment mesurer que ça marche. »

Pointer la colonne de droite : « Chaque module vous laisse un livrable. À 15 h 50, on les assemble : votre feuille de route sur 90 jours, celle que la direction de Boréal attend… et, je l'espère, celle que vous présenterez dans votre organisation. »

À SOULIGNER — Le module 8 (carré jaune) est un atelier long : prévenir qu'on formera des équipes de 3 ou 4 après le dîner.

INTERACTION — « Quel module vous intéresse le plus pour votre propre organisation ? » Deux ou trois réponses.

TRANSITION — « On commence par la question que toutes les directions posent : par où commencer ? »`,
  `⏱ 2 min · INTERCALAIRE · MODULE 5 (9 h 15 – 10 h 30)

OBJECTIF — Ouvrir le module 5 et annoncer son livrable : trois cas d'usage priorisés et chiffrés.

DIRE — « Hier, on a vu une foule de cas d'usage possibles. Le problème, en entreprise, ce n'est jamais le manque d'idées : c'est d'en avoir trop et de choisir les mauvaises. Les directions me demandent toutes la même chose : par où on commence ? »

« Pendant l'heure et quart qui vient, on se donne une méthode simple et défendable devant un comité de direction. Quatre temps : pourquoi prioriser ; la matrice impact × complexité ; un atelier où vous classez neuf vrais cas de Boréal ; puis vous choisissez vos trois cas et vous calculez leur retour sur investissement. »

ANIMATION — Aucune : laissez les quatre puces apparaître d'elles-mêmes, puis enchaînez.

À SOULIGNER — Ressortez les irritants notés hier soir : ils serviront de matière première pour l'atelier « Choisissez vos 3 cas ». Ceux qui ne les ont pas notés ont deux minutes pendant la page suivante.

TRANSITION — « Commençons par un chiffre qui refroidit un peu l'enthousiasme. »`,
  `⏱ 7 min · EXPOSÉ

OBJECTIF — Faire comprendre que la priorisation n'est pas de la bureaucratie : c'est la première protection contre l'échec.

DIRE — « Selon Gartner, plus de 40 % des projets d'IA agentique seront annulés d'ici la fin de 2027. Pas parce que la technologie ne marche pas, mais pour trois raisons très terre à terre. »

ANIMATION — → beat 1 : les coûts. « Le pilote coûte peu ; en production, chaque appel au modèle, chaque intégration et chaque heure de supervision s'additionnent. »
→ beat 2 : la valeur floue. « On choisit le cas qui fait une belle démo, pas celui qui fait gagner du temps à 200 personnes. »
→ beat 3 : les risques. Rappeler Replit et Air Canada : accès trop larges, aucun plan B.
→ beat 4 : la parade. « Un cas, une équipe, des indicateurs, 90 jours. C'est exactement le format de la feuille de route que Boréal vous demande. »

À SOULIGNER — L'« agent washing » : Gartner estime qu'une petite fraction des fournisseurs qui se disent « agentiques » offrent de vrais agents. Conseil : demandez une démonstration sur vos données, avec un cas d'erreur.

INTERACTION — « Avez-vous déjà vu un projet techno annulé dans votre organisation ? Pour quelle raison ? » Une ou deux anecdotes.

TRANSITION — « Pour éviter ces pièges, il faut évaluer chaque idée sur deux axes. »`,
  `⏱ 8 min · EXPOSÉ

OBJECTIF — Donner une grille d'évaluation simple, objective et partageable : quatre critères d'impact, quatre de complexité, notés de 1 à 5.

DIRE — « Pour comparer des idées très différentes, il faut une même règle. On évalue chaque cas sur deux axes. »

ANIMATION — → beat 1 : les critères d'impact. « Le volume : combien de fois par mois ? Le temps gagné à chaque fois. La valeur d'affaires : revenus, satisfaction, rétention. Le risque réduit : moins d'erreurs de saisie, meilleure conformité. »
→ beat 2 : les critères de complexité. « Attention, ici une note élevée est mauvaise. Les données : existent-elles, sont-elles propres ? Les intégrations : combien de systèmes ? Le risque d'erreur : que coûte une mauvaise action ? Et la conduite du changement, souvent sous-estimée. »
→ beat 3 : l'échelle et l'exemple de la FAQ RH. « 300 demandes par mois, des politiques déjà écrites, aucune action risquée : impact 3,5, complexité 1,5. »

À SOULIGNER — La moyenne simple suffit pour commencer. Une organisation plus mature peut pondérer les critères (par exemple doubler le risque en milieu réglementé).

INTERACTION — Faire noter ensemble, à main levée, le volume d'un cas : « Le tri des courriels clients, 5 000 par mois : quelle note de volume ? » Réponse attendue : 5.

TRANSITION — « Deux notes, ça donne une position. Voyons la carte. »`,
  `⏱ 8 min · EXPOSÉ CONSTRUIT

OBJECTIF — Installer la matrice impact × complexité et l'ordre de lecture des quatre quadrants.

ANIMATION — → beat 1 : les axes. « En vertical, l'impact : plus c'est haut, mieux c'est. En horizontal, la complexité : plus c'est à droite, plus c'est difficile. »
→ beat 2 : les quick wins, en haut à gauche. « Fort impact, faible complexité : on les lance maintenant. Ils financent et crédibilisent la suite. »
→ beat 3 : les projets stratégiques. « Très payants mais difficiles : on les découpe en étapes, avec un quick win en tête. »
→ beat 4 : les gadgets. « Faciles mais inutiles : le chatbot qui fait des blagues. Seulement s'il ne coûte presque rien. »
→ beat 5 : à éviter. « Difficiles et peu utiles : on refuse poliment, même si un vice-président y tient. »
→ beat 6 : la règle d'or.

DIRE — « Notez toujours en équipe. Si l'informaticien met 5 en complexité et le gestionnaire met 2, c'est un signal : quelqu'un voit un risque que l'autre ne voit pas. C'est là qu'on apprend le plus. »

À SOULIGNER — La matrice ne remplace pas le jugement : elle structure la discussion et rend la décision défendable devant la direction.

TRANSITION — « À vous de jouer : neuf cas réels de Boréal vous attendent. »`,
  `⏱ 18 min · ATELIER EN ÉQUIPE

OBJECTIF — Appliquer la matrice sur neuf cas concrets et débattre des cas limites.

CONSIGNE — Équipes de 3 ou 4. Chaque équipe classe les 9 cas sur papier (8 min). Puis un volontaire glisse les cartes à l'écran selon le consensus de la salle (5 min). Double-clic sur une carte : elle revient à sa place.

ANIMATION — Révélez la solution, quadrant par quadrant :
→ beat 1 : quick wins. FAQ RH (300 demandes/mois), mots de passe et accès (≈ 35 % des 1 800 billets TI), rapport de ventes hebdomadaire.
→ beat 2 : stratégiques. Courriels clients (5 000/mois, mais ton, escalades, données clients) et factures (2 500/mois, ERP, contrôle). Le RAG est limite : très utile, mais 40 000 documents à nettoyer et des droits d'accès à respecter. « Si vous commencez par un seul dossier propre, il devient un quick win. »
→ beat 3 : gadget (les mèmes) et à éviter (négociation autonome : engage l'entreprise, aucune marge d'erreur, gains incertains).
→ beat 4 : le PIÈGE. « Les tournées de livraison ? Ce n'est pas un problème d'agent ! C'est de l'optimisation classique, résolue depuis des décennies par des solveurs : plus fiables, moins chers et prévisibles. »

À SOULIGNER — Tout ce qui est faisable par l'IA n'a pas besoin d'un agent. Première question : « Un outil plus simple suffit-il ? »

TRANSITION — « Regardons de plus près ce qui fait un bon quick win. »`,
  `⏱ 6 min · EXPOSÉ

OBJECTIF — Rendre reconnaissables les quick wins, pour que les participants sachent les repérer chez eux.

DIRE — « Un quick win a cinq signes. La tâche revient souvent et toujours de la même façon. Les données sont déjà là : pas de grand chantier de nettoyage. Une erreur se rattrape facilement. Le gain se mesure en semaines, pas en années. Et surtout, un gestionnaire le réclame : sans parrain, même le meilleur cas meurt dans un tiroir. »

ANIMATION — → beat 1 : TI. « 1 800 billets par mois, dont 35 % pour des mots de passe ou des accès, soit environ 630. L'agent vérifie l'identité, réinitialise et passe la main au moindre doute. »
→ beat 2 : RH. « 300 demandes par mois sur les vacances, les avantages sociaux, le télétravail. L'agent répond à partir de la politique, en citant la section. »
→ beat 3 : Ventes. « Chaque lundi, quelqu'un passe deux heures à compiler des chiffres. L'agent le fait avant 8 h. »
→ beat 4 : à retenir.

À SOULIGNER — Le quick win est un tremplin : ses résultats mesurés justifient le budget du projet stratégique suivant (le tri des courriels, par exemple).

INTERACTION — « Dans votre organisation, quelle tâche coche les cinq signes ? » Une ou deux réponses.

TRANSITION — « Justement : à votre tour de choisir. »`,
  `⏱ 12 min · ATELIER EN ÉQUIPE

OBJECTIF — Chaque équipe repart avec trois cas d'usage priorisés : le premier livrable de la feuille de route.

CONSIGNE — « En équipe, partez des irritants notés hier soir. Notez chaque idée sur les deux axes, placez-la sur la matrice, puis retenez trois cas : idéalement un quick win et un ou deux projets stratégiques. Pour chacun, nommez un parrain : la personne qui le portera. » Ceux qui manquent d'idées travaillent sur Boréal.

INTERACTION — Cliquez « Démarrer » sur le minuteur (10 min). Circulez entre les équipes. Questions à poser :
• « Qui, concrètement, gagnera du temps ? »
• « Avez-vous accès aux données dès lundi ? »
• « Que se passe-t-il si l'agent se trompe ? »
• « Un outil plus simple suffirait-il ? »
À 1 minute de la fin, annoncez-le. Bouton « + 1 min » si besoin.

DÉBREFFAGE (2 min) — Deux équipes lisent leur quick win. Vérifiez qu'aucun cas « à éviter » ne s'est glissé dans la sélection.

À SOULIGNER — Gardez la fiche : elle servira au module 6 (périmètre) et à la feuille de route de 15 h 50.

TRANSITION — « Vous avez vos cas. Reste la question que posera votre directrice financière : combien ça rapporte ? »`,
  `⏱ 8 min · DÉMONSTRATION INTERACTIVE

OBJECTIF — Montrer qu'un ROI se calcule en cinq minutes, et que quelques hypothèses font basculer la décision.

DIRE — « Prenons les billets "mot de passe" du TI : environ 630 par mois, 8 minutes gagnées chacun, un taux chargé de 45 $ de l'heure, un agent à 1 500 $ par mois. Résultat : environ 1 000 heures libérées et 27 000 $ nets par an, rentabilisés en moins de 9 mois. »

INTERACTION — Faites bouger les curseurs en direct :
• Baissez le temps gagné à 3 minutes : le gain net s'effondre. « Mesurez le temps réel avant de promettre. »
• Montez le coût de l'agent à 4 000 $ : le projet ne se rembourse plus. « Le coût d'exploitation, c'est le premier motif d'annulation selon Gartner. »
• Testez un cas d'équipe : un volontaire donne ses chiffres.

À SOULIGNER — Des heures libérées ne sont pas forcément des dollars économisés : elles servent souvent à mieux servir les clients. Dites-le honnêtement à la direction. Et ajoutez toujours le coût de supervision humaine.

TRANSITION — « Vérifions que le message principal du module est passé. »`,
  `⏱ 6 min · QCM

OBJECTIF — Valider le message central du module : le premier projet doit être un quick win, pas le cas le plus spectaculaire.

ANIMATION — Lisez la question, vote à main levée, cliquez l'option choisie par la majorité. Flèche → : la bonne réponse ; flèche → encore : l'explication.

RÉPONSES — C.
• A ✗ PIÈGE — « C'est le piège classique : le projet qui impressionne en comité. Complexité élevée, risque élevé, gains incertains. C'est exactement le profil des projets annulés. »
• B ✗ — Toucher beaucoup de systèmes augmente la complexité, pas l'impact. Bon projet stratégique, pour plus tard.
• C ✓ — Fort volume, données disponibles, erreur rattrapable, gain mesurable : les cinq signes du quick win.
• D ✗ — L'attentisme est aussi un risque : les concurrents apprennent pendant ce temps.

DIRE — « Le premier projet n'est pas là pour éblouir. Il est là pour prouver et pour apprendre. »

TRANSITION — « On prend une pause de 15 minutes. Au retour, module 6 : on va cadrer précisément ce que votre agent a le droit de faire… et de ne pas faire. »`,
];
// @@NOTES-END
