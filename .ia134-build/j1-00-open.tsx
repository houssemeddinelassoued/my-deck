// ─── Cover ──────────────────────────────────────────────────────────────────
// Tools orbit the agent: the container spins, each tile counter-spins upright.
const OrbitTile = ({ x, y, icon, tone, d }: { x: number; y: number; icon: IconName; tone: Tone; d: number }) => (
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

const J1_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <img
      src={logoStack}
      alt="Technologia"
      className={A.fade}
      style={{ position: 'absolute', left: 112, top: 78, height: 150, display: 'block' }}
    />
    <div style={{ position: 'absolute', left: 120, top: 318, width: 1000 }}>
      <Eyebrow cls={A.in} size={28}>
        Formation IA134 · 2 jours · 14 h
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
            background: G.blue,
            color: '#fff',
            fontFamily: display,
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: '0.08em',
          }}
        >
          JOUR 1
        </span>
        <span style={{ padding: '16px 28px', fontSize: 30, fontWeight: 500, color: C.ink }}>
          Comprendre les agents : concepts, types et cas réels
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

    {/* Orbit of tools around the agent */}
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
      <OrbitTile x={300} y={10} icon="mail" tone="blue" d={600} />
      <OrbitTile x={551} y={155} icon="database" tone="teal" d={720} />
      <OrbitTile x={551} y={445} icon="calendar" tone="green" d={840} />
      <OrbitTile x={300} y={590} icon="search" tone="yellow" d={960} />
      <OrbitTile x={49} y={445} icon="doc" tone="violet" d={1080} />
      <OrbitTile x={49} y={155} icon="chat" tone="coral" d={1200} />
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

// ─── Trainer ────────────────────────────────────────────────────────────────
const Pledge = ({ icon, tone, d, children }: { icon: IconName; tone: Tone; d: number; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 24, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={64} />
    <span style={{ fontSize: 30, lineHeight: 1.35, color: C.ink }}>{children}</span>
  </div>
);

const J1_Trainer: Page = () => (
  <Frame mod={0}>
    <Portrait x={210} y={300} w={280} />
    <div style={{ position: 'absolute', left: 720, top: 260, width: 1080 }}>
      <Eyebrow cls={A.in}>Votre formateur</Eyebrow>
      <div
        className={A.in}
        style={{ marginTop: 10, fontFamily: display, fontWeight: 700, fontSize: 84, lineHeight: 1.05, color: C.ink, ...dl(100) }}
      >
        {AUTHOR}
      </div>
      <div className={A.in} style={{ marginTop: 8, fontSize: 32, fontWeight: 600, color: C.blue, ...dl(200) }}>
        Formateur · Technologia
      </div>
      <div className={A.grow} style={{ marginTop: 34, height: 3, width: 1080, background: C.rule, ...dl(300) }} />
      <Eyebrow cls={A.in} c={C.muted} style={{ marginTop: 34, ...dl(380) }}>
        Mes engagements pour ces 2 jours
      </Eyebrow>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Pledge icon="target" tone="blue" d={500}>
          Du concret : des cas d’entreprise réels, pas de science-fiction
        </Pledge>
        <Pledge icon="tool" tone="teal" d={640}>
          Des outils réutilisables dès lundi : canevas, grilles, checklists
        </Pledge>
        <Pledge icon="chat" tone="green" d={780}>
          Du dialogue : vos questions et vos cas passent avant les diapos
        </Pledge>
        <Pledge icon="map" tone="yellow" d={920}>
          Un livrable : l’ébauche de la feuille de route de votre organisation
        </Pledge>
      </div>
    </div>
  </Frame>
);

// ─── Round table ────────────────────────────────────────────────────────────
const AskCard = ({ n, title, sub, d }: { n: number; title: ReactNode; sub: ReactNode; d: number }) => (
  <div
    className={A.left}
    style={{
      boxSizing: 'border-box',
      height: 132,
      display: 'flex',
      alignItems: 'center',
      gap: 26,
      padding: '0 30px',
      background: C.card,
      borderRadius: 'var(--osd-radius)',
      boxShadow: SHADOW,
      ...dl(d),
    }}
  >
    <Num n={n} size={60} />
    <div>
      <div style={{ fontSize: 32, fontWeight: 600, lineHeight: 1.25, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 24, lineHeight: 1.35, color: C.muted }}>{sub}</div>
    </div>
  </div>
);

const J1_Roundtable: Page = () => (
  <Frame mod={0} label="Ouverture · Faisons connaissance">
    <Title>Tour de table</Title>
    <Lede>Une minute par personne, trois questions — et un sondage éclair pour situer le groupe.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 800, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AskCard n={1} title="Qui êtes-vous ?" sub="Prénom, rôle, organisation" d={100} />
      <AskCard n={2} title="Votre rapport à l’IA aujourd’hui ?" sub="Outils utilisés, une réussite… ou une frustration" d={220} />
      <AskCard n={3} title="Qu’attendez-vous de ces 2 jours ?" sub="Un problème concret, une idée d’agent, une crainte" d={340} />
    </div>
    <Timer id="tour" minutes={15} label="Tour de table" compact cls={A.in} style={{ position: 'absolute', left: 120, top: 770, ...dl(460) }} />
    <div style={{ position: 'absolute', left: 990, top: 290, width: 810 }}>
      <Eyebrow cls={A.in} c={C.violet} style={dl(200)}>
        Sondage éclair · votre usage de l’IA
      </Eyebrow>
      <Hint cls={A.in} style={{ marginTop: 8, ...dl(260) }}>
        Main levée : cliquez une ligne pour compter les votes
      </Hint>
      <Poll cls={A.in} style={{ marginTop: 22, ...dl(360) }}>
        <PollRow id="none" icon="eye" tone="grey" label="Je ne l’utilise pas encore" />
        <PollRow id="try" icon="chat" tone="blue" label="J’essaie à l’occasion (ChatGPT, Copilot…)" />
        <PollRow id="weekly" icon="sparkles" tone="teal" label="Je l’utilise chaque semaine au travail" />
        <PollRow id="auto" icon="gear" tone="green" label="J’automatise des tâches avec l’IA" />
        <PollRow id="agent" icon="bot" tone="violet" label="J’ai déjà construit un agent" />
      </Poll>
    </div>
  </Frame>
);

// ─── Objectives: a rising staircase = the road map ─────────────────────────
const ObjStep = ({
  i,
  h,
  tone,
  verb,
  day,
  children,
}: {
  i: number;
  h: number;
  tone: Tone;
  verb: string;
  day: number;
  children: ReactNode;
}) => (
  <div style={{ position: 'absolute', left: 120 + (i - 1) * 336, top: 960 - h, width: 316, height: h }}>
    <div
      className={A.growY}
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 18,
        background: C.card,
        boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`,
        ...dl(i * 120),
      }}
    />
    <div className={A.in} style={{ position: 'relative', padding: '34px 26px 0', ...dl(420 + i * 140) }}>
      <Num n={i} tone={tone} size={52} />
      <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 40, lineHeight: 1.05, letterSpacing: '0.03em', color: C.ink }}>
        {verb}
      </div>
      <div style={{ marginTop: 10, fontSize: 26, lineHeight: 1.38, color: C.soft }}>{children}</div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 26, bottom: 24, ...dl(600 + i * 140) }}>
      <Tag tone={day === 1 ? 'blue' : 'green'} size={20}>
        Jour {day}
      </Tag>
    </div>
  </div>
);

const J1_Objectives: Page = () => (
  <Frame mod={0}>
    <Title>Objectifs de la formation</Title>
    <Lede>À la fin des 2 jours, vous serez capable de…</Lede>
    <ObjStep i={1} h={380} tone="blue" verb="COMPRENDRE" day={1}>
      Expliquer ce qu’est un agent IA et ce qui le distingue d’un LLM
    </ObjStep>
    <ObjStep i={2} h={430} tone="teal" verb="RECONNAÎTRE" day={1}>
      Identifier les types d’agents et leurs usages en entreprise
    </ObjStep>
    <ObjStep i={3} h={480} tone="green" verb="PRIORISER" day={2}>
      Évaluer et prioriser les cas d’usage de votre organisation
    </ObjStep>
    <ObjStep i={4} h={530} tone="yellow" verb="CONCEVOIR" day={2}>
      Cadrer le périmètre, choisir les outils, prototyper un agent
    </ObjStep>
    <ObjStep i={5} h={580} tone="coral" verb="DÉPLOYER" day={2}>
      Planifier le déploiement et mesurer la performance
    </ObjStep>
    <div className={A.pop} style={{ position: 'absolute', left: 1490, top: 300, display: 'flex', alignItems: 'center', gap: 12, ...dl(1400) }}>
      <Icon name="flag" size={44} color={C.coral} />
      <Eyebrow c={C.coral}>Votre feuille de route</Eyebrow>
    </div>
  </Frame>
);

// ─── Programme ──────────────────────────────────────────────────────────────
const ProgRow = ({ t, n, icon, tone = 'blue', d, children }: { t: string; n?: number; icon?: IconName; tone?: Tone; d: number; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 48, ...dl(d) }}>
    <span style={{ width: 80, fontFamily: mono, fontSize: 22, color: C.muted }}>{t}</span>
    {n ? (
      <Num n={pad(n)} tone={tone} size={40} />
    ) : (
      <span style={{ width: 40, display: 'flex', justifyContent: 'center' }}>
        <Icon name={icon ?? 'star'} size={30} color={C.muted} />
      </span>
    )}
    <span style={{ fontSize: 28, fontWeight: 500, color: C.ink }}>{children}</span>
  </div>
);

const ProgBreak = ({ t, d, children }: { t: string; d: number; children: ReactNode }) => (
  <div className={A.fade} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 28, ...dl(d) }}>
    <span style={{ width: 80, fontFamily: mono, fontSize: 19, color: C.faint }}>{t}</span>
    <span style={{ width: 40, height: 2, background: C.rule }} />
    <span style={{ fontSize: 22, fontStyle: 'italic', color: C.muted }}>{children}</span>
  </div>
);

const DayCol = ({ x, day, sub, now, children }: { x: number; day: number; sub: string; now: boolean; children: ReactNode }) => (
  <div
    className={A.in}
    style={{
      position: 'absolute',
      left: x,
      top: 250,
      width: 816,
      boxSizing: 'border-box',
      padding: '26px 36px 24px',
      background: C.card,
      borderRadius: 'var(--osd-radius)',
      boxShadow: now ? `0 0 0 3px ${C.blue}, ${SHADOW}` : SHADOW,
      ...dl(day === 1 ? 0 : 150),
    }}
  >
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 14 }}>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 46, color: now ? C.blue : C.ink }}>Jour {day}</span>
      <span style={{ fontSize: 26, color: C.muted }}>{sub}</span>
      {now ? (
        <Tag tone="blue" size={20} style={{ marginLeft: 'auto' }}>
          Aujourd’hui
        </Tag>
      ) : null}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{children}</div>
  </div>
);

const J1_Program: Page = () => (
  <Frame mod={0}>
    <Title>Programme des 2 jours</Title>
    <DayCol x={120} day={1} sub="Comprendre les agents" now={DAY === 1}>
      <ProgRow t="9:00" icon="users" d={150}>
        Accueil et tour de table
      </ProgRow>
      <ProgRow t="9:30" n={1} d={210}>
        Introduction aux agents IA
      </ProgRow>
      <ProgBreak t="10:30" d={270}>
        Pause
      </ProgBreak>
      <ProgRow t="11:30" n={2} tone="yellow" d={330}>
        Atelier · identifier un agent
      </ProgRow>
      <ProgBreak t="12:00" d={390}>
        Dîner
      </ProgBreak>
      <ProgRow t="13:00" n={3} d={450}>
        Typologie des agents
      </ProgRow>
      <ProgBreak t="14:15" d={510}>
        Pause
      </ProgBreak>
      <ProgRow t="14:30" n={4} tone="teal" d={570}>
        Études de cas réels
      </ProgRow>
      <ProgRow t="15:40" icon="star" d={630}>
        Synthèse du jour 1
      </ProgRow>
      <ProgBreak t="16:00" d={690}>
        Fin de la journée
      </ProgBreak>
    </DayCol>
    <DayCol x={984} day={2} sub="Construire la feuille de route" now={DAY === 2}>
      <ProgRow t="9:00" icon="loop" d={300}>
        Réactivation
      </ProgRow>
      <ProgRow t="9:15" n={5} d={360}>
        Analyse de cas d’usage
      </ProgRow>
      <ProgBreak t="10:30" d={420}>
        Pause
      </ProgBreak>
      <ProgRow t="10:45" n={6} d={480}>
        Définition du périmètre
      </ProgRow>
      <ProgBreak t="12:00" d={540}>
        Dîner
      </ProgBreak>
      <ProgRow t="13:00" n={7} d={600}>
        Conception et choix des outils
      </ProgRow>
      <ProgRow t="13:50" n={8} tone="yellow" d={660}>
        Atelier · prototyper un agent
      </ProgRow>
      <ProgBreak t="14:50" d={720}>
        Pause
      </ProgBreak>
      <ProgRow t="15:00" n={9} d={780}>
        Plan de déploiement
      </ProgRow>
      <ProgRow t="15:30" n={10} d={840}>
        Mesure de performance
      </ProgRow>
      <ProgRow t="15:50" icon="flag" d={900}>
        Feuille de route et clôture
      </ProgRow>
    </DayCol>
  </Frame>
);

// ─── How we work ────────────────────────────────────────────────────────────
const ActCard = ({ kind, icon, title, d, children }: { kind: Kind; icon: IconName; title: string; d: number; children: ReactNode }) => {
  const tone = KINDS[kind].tone;
  return (
    <div
      className={A.in}
      style={{
        boxSizing: 'border-box',
        width: 390,
        height: 390,
        padding: '30px 30px',
        background: C.card,
        borderRadius: 'var(--osd-radius)',
        boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`,
        ...dl(d),
      }}
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
    style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      padding: '20px 24px',
      background: C.panel,
      borderRadius: 14,
      fontSize: 26,
      lineHeight: 1.3,
      color: C.ink,
      ...dl(d),
    }}
  >
    <Icon name={icon} size={34} color={C.blue} />
    <span>{children}</span>
  </div>
);

const J1_HowWeWork: Page = () => (
  <Frame mod={0}>
    <Title>Comment nous allons travailler</Title>
    <Lede>Une formation active : on manipule, on se trompe, on comprend.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 40 }}>
      <ActCard kind="qcm" icon="check" title="Cliquez, vérifiez" d={100}>
        Rétroaction immédiate. Les pièges sont voulus : c’est là qu’on apprend.
      </ActCard>
      <ActCard kind="exercice" icon="hand" title="Manipulez" d={220}>
        Cartes à retourner, éléments à glisser, curseurs, simulateurs.
      </ActCard>
      <ActCard kind="atelier" icon="users" title="Coconstruisez" d={340}>
        En sous-groupes, avec minuteur et canevas à remplir.
      </ActCard>
      <ActCard kind="cas" icon="book" title="Analysez" d={460}>
        Des déploiements réels : leurs réussites… et leurs échecs.
      </ActCard>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 740, width: 1680, display: 'flex', gap: 24 }}>
      <RuleChip icon="chat" d={600}>
        Questions bienvenues, à tout moment
      </RuleChip>
      <RuleChip icon="lock" d={700}>
        Vos cas restent dans la salle
      </RuleChip>
      <RuleChip icon="truck" d={800}>
        Fil rouge : Boréal Distribution
      </RuleChip>
    </div>
    <Callout cls={A.in} title="Un livrable à la clé" icon="map" tone="blue" size={26} style={{ position: 'absolute', left: 120, top: 862, width: 1680, padding: '14px 26px', ...dl(900) }}>
      Chaque atelier alimente votre feuille de route : gardez vos notes, on les assemble à la fin du jour 2.
    </Callout>
  </Frame>
);

// ─── Running case: Boréal Distribution ──────────────────────────────────────
const Fact = ({ icon, children }: { icon: IconName; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 27, color: C.ink }}>
    <Icon name={icon} size={30} color={C.teal} />
    <span>{children}</span>
  </div>
);

const DeptTile = ({
  icon,
  tone,
  dept,
  value,
  unit,
  d,
  w = 535,
  children,
}: {
  icon: IconName;
  tone: Tone;
  dept: string;
  value: number;
  unit: string;
  d: number;
  w?: number;
  children: ReactNode;
}) => (
  <div
    className={A.in}
    style={{
      boxSizing: 'border-box',
      width: w,
      height: 194,
      display: 'flex',
      gap: 22,
      padding: '22px 26px',
      background: C.card,
      borderRadius: 'var(--osd-radius)',
      boxShadow: SHADOW,
      ...dl(d),
    }}
  >
    <IconTile name={icon} tone={tone} size={64} />
    <div style={{ flex: 1 }}>
      <Eyebrow c={T[tone].fg} size={20}>
        {dept}
      </Eyebrow>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 54, lineHeight: 1.05, color: C.ink }}>
          <CountUp to={value} delay={d} />
        </span>
        <span style={{ fontSize: 24, fontWeight: 600, color: C.soft }}>{unit}</span>
      </div>
      <div style={{ marginTop: 2, fontSize: 22, lineHeight: 1.35, color: C.muted }}>{children}</div>
    </div>
  </div>
);

const J1_Boreal: Page = () => (
  <Frame mod={0} kind="cas" label="Ouverture · Fil rouge">
    <Title>Notre fil rouge : Boréal Distribution</Title>
    <Lede>Une entreprise fictive aux chiffres réalistes. Nous la retrouverons dans chaque module.</Lede>
    <div
      className={A.left}
      style={{
        position: 'absolute',
        left: 120,
        top: 290,
        width: 540,
        height: 622,
        boxSizing: 'border-box',
        padding: '30px 32px',
        background: C.card,
        borderRadius: 'var(--osd-radius)',
        boxShadow: `${SHADOW}, inset 0 8px 0 ${C.teal}`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <IconTile name="truck" tone="teal" size={76} solid />
        <div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 40, lineHeight: 1.05, color: C.ink }}>Boréal Distribution inc.</div>
          <div style={{ fontSize: 22, color: C.muted }}>Distributeur B2B · Québec</div>
        </div>
      </div>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Fact icon="users">1 200 employés</Fact>
        <Fact icon="map">Sièges à Québec et à Montréal</Fact>
        <Fact icon="archive">3 centres de distribution</Fact>
        <Fact icon="org">≈ 4 000 clients d’affaires</Fact>
      </div>
      <Callout title="Votre mandat" icon="flag" tone="yellow" size={25} style={{ marginTop: 'auto', padding: '16px 22px' }}>
        Proposer à la direction une feuille de route IA agentique réaliste, sur 90 jours.
      </Callout>
    </div>
    <div style={{ position: 'absolute', left: 700, top: 290, width: 1110, display: 'flex', flexWrap: 'wrap', gap: 20, columnGap: 30 }}>
      <DeptTile icon="users" tone="blue" dept="Ressources humaines" value={300} unit="demandes / mois" d={200}>
        Congés, attestations, avantages sociaux : souvent les mêmes questions
      </DeptTile>
      <DeptTile icon="ticket" tone="violet" dept="Soutien TI" value={1800} unit="billets / mois" d={320}>
        Dont ≈ 35 % de mots de passe oubliés et de demandes d’accès
      </DeptTile>
      <DeptTile icon="mail" tone="green" dept="Service à la clientèle" value={5000} unit="courriels / mois" d={440}>
        Suivi de commande, facturation, retours… et clients mécontents
      </DeptTile>
      <DeptTile icon="money" tone="yellow" dept="Finance" value={2500} unit="factures / mois" d={560}>
        Fournisseurs en PDF, papier numérisé ou EDI : saisie manuelle
      </DeptTile>
      <DeptTile icon="book" tone="coral" dept="Documentation interne" value={40000} unit="documents" d={680} w={1100}>
        Procédures, politiques et fiches produits dispersées entre SharePoint, Google Drive et un vieux wiki
      </DeptTile>
    </div>
  </Frame>
);

// ─── Warm-up quiz (multi-answer) ────────────────────────────────────────────
const J1_Quiz0: Page = () => (
  <Frame mod={0} kind="qcm" beats={2} label="Ouverture · Point de départ">
    <Title>
      <span style={{ color: C.violet }}>Quiz éclair</span> · Qu’est-ce qu’un agent sait faire ?
    </Title>
    <Qcm
      multi
      q="Selon vous, que peut faire un agent IA en entreprise aujourd’hui ?"
      explain="Un agent agit à travers des outils : c’est sa force. Mais il reste probabiliste, et les décisions à fort impact restent humaines. Puissance + garde-fous : c’est le fil de ces 2 jours."
    >
      <Opt ok why="Oui : il perçoit (le courriel), raisonne (comprendre la demande) et agit (créer le billet). C’est l’usage typique d’un agent outillé.">
        Lire un courriel, comprendre la demande et créer le billet dans l’outil TI
      </Opt>
      <Opt why="Piège ! Techniquement faisable, mais inacceptable : une décision à fort impact sur une personne exige un humain. La Loi 25 encadre d’ailleurs les décisions entièrement automatisées.">
        Décider seul de congédier un employé à partir de ses indicateurs
      </Opt>
      <Opt ok why="Oui : c’est un agent documentaire (RAG). Il cherche, synthétise et cite ses sources, ce qui permet de vérifier sa réponse.">
        Chercher dans la documentation interne et répondre en citant ses sources
      </Opt>
      <Opt why="Piège ! Même branché sur vos données, un agent reste probabiliste : il peut mal lire, mal combiner ou inventer. On mesure et on encadre.">
        Garantir des réponses exactes à 100 %, puisqu’il consulte vos données
      </Opt>
    </Qcm>
  </Frame>
);

// ─── Module 1 divider ───────────────────────────────────────────────────────
const M1_Divider: Page = () => (
  <Section n={1} title="Introduction aux agents IA" sub="Du modèle qui répond… au système qui agit." dur="≈ 1 h 45">
    <SecItem n={1}>Définition et anatomie d’un agent</SecItem>
    <SecItem n={2}>Agent ou LLM classique : ce qui change</SecItem>
    <SecItem n={3}>Objectifs, mémoire et capacité d’agir</SecItem>
    <SecItem n={4}>Panorama des outils, MCP et A2A</SecItem>
  </Section>
);
M1_Divider.transition = BLOOM;

// @@PAGES-BEGIN
export const __pages = [J1_Cover, J1_Trainer, J1_Roundtable, J1_Objectives, J1_Program, J1_HowWeWork, J1_Boreal, J1_Quiz0, M1_Divider];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · Accueil (avant 9 h 00, cette page est affichée pendant l'arrivée des participants)

OBJECTIF — Installer un climat chaleureux et poser le cadre : deux jours pour passer de « j'entends parler des agents » à « je sais quoi proposer à mon organisation ».

DIRE — « Bonjour et bienvenue ! Vous êtes à la formation Feuille de route pour l'IA agentique. Pendant deux jours, on va comprendre ce qu'est vraiment un agent d'IA, voir où il crée de la valeur… et où il crée des problèmes. Aujourd'hui, jour 1 : comprendre — concepts, types d'agents et cas réels. Demain, jour 2 : construire — prioriser, cadrer, concevoir, déployer et mesurer. »

Montrer l'animation : « Au centre, l'agent. Autour, ses outils : courriel, base de données, calendrier, recherche, documents, clavardage. Toute la différence entre un simple chatbot et un agent tient dans ces liens. Gardez cette image en tête. »

LOGISTIQUE — Horaire (9 h – 16 h), pauses (10 h 30 et 14 h 15), dîner (12 h – 13 h), Wi-Fi, toilettes, évaluation à la fin du jour 2.

TRANSITION — « Avant d'entrer dans le vif du sujet, quelques mots sur moi. »`,
  `⏱ 3 min

OBJECTIF — Établir votre crédibilité et un contrat pédagogique clair.

DIRE — Présentez-vous en 60 à 90 secondes. À PERSONNALISER : votre parcours, vos domaines d'intervention, un ou deux projets d'IA que vous avez accompagnés, et pourquoi le sujet des agents vous passionne. Une anecdote courte (un agent qui a surpris, en bien ou en mal) fonctionne très bien pour capter l'attention.

Puis les quatre engagements, en les liant à leurs besoins :
1. Du concret — « On ne fera pas de science-fiction : tous les exemples viennent d'entreprises réelles, y compris des échecs publics. »
2. Des outils réutilisables — « Vous repartirez avec des canevas, des grilles de priorisation et des checklists que vous pourrez utiliser dès lundi. »
3. Du dialogue — « Si une question vous brûle les lèvres, posez-la. Vos cas passent avant mes diapos. »
4. Un livrable — « À la fin du jour 2, vous aurez l'ébauche d'une feuille de route pour votre organisation. »

INTERACTION — Demandez : « Qui a déjà entendu le mot "agentique" cette semaine, dans un courriel, une réunion ou un article ? » Mains levées : en général presque tout le monde. « Parfait : on va mettre de l'ordre dans ce mot à la mode. »

TRANSITION — « Maintenant, c'est à votre tour. »`,
  `⏱ 15 min (1 min par personne, ajuster selon la taille du groupe)

OBJECTIF — Connaître le groupe, son niveau et ses attentes, pour adapter le rythme et les exemples.

ANIMATION — Lancez le minuteur de 15 min. Chaque personne répond aux trois questions en une minute. Notez au tableau (ou sur un papier) les attentes et les cas d'usage mentionnés : vous y ferez référence pendant les deux jours, et surtout dans l'atelier du module 2 et l'atelier de priorisation du jour 2.

SONDAGE ÉCLAIR — Avant ou après le tour, posez la question du sondage et faites lever les mains pour chaque ligne ; cliquez autant de fois qu'il y a de mains (le bouton « − » corrige une erreur). Les barres se comparent automatiquement.

LECTURE DU RÉSULTAT —
• Majorité « pas encore / à l'occasion » : prenez plus de temps sur les fondamentaux du module 1 (LLM, prompt, outils).
• Majorité « chaque semaine / automatise » : accélérez les définitions, insistez sur les architectures et les risques.
• Quelqu'un a « déjà construit un agent » : faites-en un allié ! Invitez cette personne à partager son expérience pendant les études de cas.

ASTUCE — Si une attente sort du périmètre (ex. : coder un agent en Python de A à Z), dites-le honnêtement et proposez une ressource à la fin.

TRANSITION — « Merci ! Voici ce que je vous propose d'atteindre ensemble. »`,
  `⏱ 3 min

OBJECTIF — Présenter les cinq objectifs d'apprentissage comme une progression : un escalier qui mène à la feuille de route.

DIRE — « Regardez la forme : c'est un escalier. Chaque marche s'appuie sur la précédente. »
1. COMPRENDRE — « Ce matin : qu'est-ce qu'un agent, et en quoi est-ce différent d'un ChatGPT qui répond à vos questions ? »
2. RECONNAÎTRE — « Cet après-midi : les grandes familles d'agents, et des cas réels en RH, en TI et en gestion documentaire. »
3. PRIORISER — « Demain matin : comment choisir les bons cas d'usage, ceux qui rapportent vite sans prendre de risques démesurés. »
4. CONCEVOIR — « Cadrer un agent : ce qu'il fait, ce qu'il ne fait pas, ses outils, ses garde-fous. On prototypera ensemble. »
5. DÉPLOYER — « Passer du prototype à la production, et mesurer si ça marche vraiment. »

Pointer le drapeau : « En haut de l'escalier : votre feuille de route. C'est le livrable de la formation. »

INTERACTION — « Parmi ces cinq marches, laquelle est la plus importante pour vous aujourd'hui ? » Deux ou trois réponses rapides suffisent. Faites le lien avec les attentes exprimées au tour de table.

TRANSITION — « Voyons comment ces objectifs se répartissent dans le temps. »`,
  `⏱ 2 min

OBJECTIF — Donner de la visibilité sur le déroulement : les participants se détendent quand ils savent où ils vont et quand sont les pauses.

DIRE — « Jour 1 : comprendre. Quatre modules. Le module 1, ce matin, pose les bases. Le module 2 est un court atelier juste avant le dîner : vous identifierez un agent possible dans votre propre contexte. Cet après-midi, la typologie des agents, puis des études de cas réels. On termine par une synthèse à 15 h 40. »

« Jour 2 : construire. On part de vos cas d'usage pour les prioriser, cadrer un agent, choisir les outils, le prototyper en atelier, planifier son déploiement et définir comment mesurer sa performance. On termine par la feuille de route sur 90 jours. »

Repères : pauses à 10 h 30 et 14 h 15 environ, dîner à 12 h. « Si vous avez besoin d'une pause avant, faites-moi signe : un cerveau saturé n'apprend plus rien. »

À SOULIGNER — Les ateliers (carrés jaunes : modules 2 et 8) sont les moments où vous travaillez sur VOS cas. Prévenez que vous ferez des sous-groupes.

TRANSITION — « Justement, parlons de la façon dont on va travailler. »`,
  `⏱ 2 min

OBJECTIF — Expliquer les codes visuels de la formation et le contrat de participation.

DIRE — « Vous verrez quatre étiquettes en haut des pages. »
• QCM (violet) — « Vous votez, je clique, la rétroaction est immédiate. Les mauvaises réponses sont des pièges volontaires : ce sont des idées reçues fréquentes. Se tromper ici ne coûte rien ; se tromper en production coûte cher. »
• EXERCICE (vert) — « On manipule à l'écran : on retourne des cartes, on glisse des éléments, on joue avec des curseurs. »
• ATELIER (jaune) — « En sous-groupes, avec un minuteur et un canevas. »
• ÉTUDE DE CAS (turquoise) — « Des déploiements réels, et on parlera aussi des échecs : Air Canada, Klarna, l'agent de Replit qui a effacé une base de données… »

Les trois règles du jeu :
1. Les questions sont bienvenues à tout moment.
2. Confidentialité : ce que vous partagez sur votre organisation reste dans la salle.
3. Fil rouge : Boréal Distribution, l'entreprise fictive présentée juste après.

LIVRABLE — « Chaque atelier produit un morceau de votre feuille de route. Gardez vos notes : on les assemble à la fin du jour 2. »

TRANSITION — « Faisons connaissance avec Boréal. »`,
  `⏱ 4 min · ÉTUDE DE CAS FIL ROUGE

OBJECTIF — Ancrer toute la formation dans un contexte d'entreprise concret et réaliste, réutilisé dans chaque module et chaque atelier.

DIRE — « Boréal Distribution est une entreprise fictive, mais ses chiffres sont typiques d'un distributeur québécois de taille moyenne : 1 200 employés, deux sièges à Québec et à Montréal, trois centres de distribution, environ 4 000 clients d'affaires. »

Parcourir les cinq services (les compteurs s'animent) :
• RH — 300 demandes par mois, souvent répétitives : congés, attestations, avantages sociaux.
• Soutien TI — 1 800 billets par mois, dont environ 35 % de mots de passe oubliés et de demandes d'accès.
• Service à la clientèle — 5 000 courriels par mois : suivi de commande, facturation, retours… et quelques clients très mécontents.
• Finance — 2 500 factures fournisseurs par mois, dans tous les formats possibles.
• Documentation — 40 000 documents dispersés entre trois outils. « Personne ne sait où se trouve la dernière version de la procédure. »

LE MANDAT — « La direction vous confie une mission : proposer une feuille de route IA agentique réaliste sur 90 jours. C'est exactement ce que nous construirons ensemble. »

INTERACTION — « Qui se reconnaît dans au moins un de ces services ? » Laissez 2 ou 3 personnes faire le parallèle avec leur organisation.

TRANSITION — « Avant de définir quoi que ce soit, testons vos intuitions. »`,
  `⏱ 4 min · QCM À RÉPONSES MULTIPLES

OBJECTIF — Activer les représentations initiales, faire émerger les mythes (« l'agent décide de tout », « avec nos données, c'est exact ») sans juger.

ANIMATION — Lisez la question. Faites voter à main levée pour chaque option (A, B, C, D). Cochez les options choisies par la majorité, puis cliquez « Valider ma sélection ». Cliquez ensuite chaque option pour lire l'explication. Avec la flèche →, vous révélez les bonnes réponses, puis l'essentiel.

RÉPONSES — A et C.
• A ✓ — Percevoir, raisonner, agir : la définition même d'un agent outillé. On la formalisera dans quelques minutes.
• B ✗ PIÈGE — « Ce n'est pas une limite technique, c'est une limite éthique et légale. Au Québec, la Loi 25 oblige à informer une personne lorsqu'une décision la concernant est fondée exclusivement sur un traitement automatisé. Une décision de congédiement reste humaine. »
• C ✓ — L'agent documentaire (RAG), que nous verrons au module 3. Les sources citées rendent la réponse vérifiable.
• D ✗ PIÈGE — « Le piège le plus répandu. Brancher un modèle sur vos données réduit les erreurs, mais ne les élimine pas. Un agent peut mal lire un document, mal combiner deux sources ou inventer un détail. »

MESSAGE CLÉ — Puissance + garde-fous. Ce duo reviendra à chaque module.

TRANSITION — « Entrons dans le module 1 : qu'est-ce qu'un agent, exactement ? »`,
  `⏱ 1 min · DÉBUT DU MODULE 1 (≈ 9 h 30)

OBJECTIF — Marquer le passage au contenu et annoncer le plan du module.

DIRE — « Module 1 : introduction aux agents IA. Le sous-titre résume tout : on passe du modèle qui répond au système qui agit. »

« Au programme : une définition claire et l'anatomie d'un agent, c'est-à-dire ses composants ; la différence avec un LLM classique comme ChatGPT utilisé en mode conversation ; les trois notions qui font un agent : des objectifs, de la mémoire et la capacité d'agir ; puis un panorama des outils et des standards dont tout le monde parle : MCP et A2A. »

« On terminera par un exercice et deux QCM pour vérifier que tout est bien ancré avant l'atelier. »

RYTHME — Ce module dure environ 1 h 45, avec la pause de 10 h 30 au milieu (vers la page « Workflow ou agent ? »).

TRANSITION — « Commençons par un peu d'histoire récente : comment est-on passé de l'IA qui répond à l'IA qui agit ? »`,
];
// @@NOTES-END
