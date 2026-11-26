// ─── Cover ──────────────────────────────────────────────────────────────────
// A balance weighs "IA" against "humain"; the brand squares sit behind it.
const OP_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <img src={logoStack} alt="Technologia" className={A.fade} style={{ position: 'absolute', left: 112, top: 78, height: 150, display: 'block' }} />
    <div style={{ position: 'absolute', left: 120, top: 318, width: 980 }}>
      <Eyebrow cls={A.in} size={28}>
        <ByClient apsm="Formation IA114 · 1 jour" sobeys="Formation IA114 · 2 matinées" />
      </Eyebrow>
      <h1
        className={A.in}
        style={{ margin: '18px 0 0', fontFamily: display, fontWeight: 700, fontSize: 118, lineHeight: 1.0, letterSpacing: '-0.01em', color: C.ink, ...dl(120) }}
      >
        Introduction à l’IA
        <br />
        et à l’éthique
      </h1>
      <p className={A.in} style={{ margin: '26px 0 0', fontSize: 36, lineHeight: 1.3, color: C.soft, ...dl(240) }}>
        Comprendre les enjeux, les usages et les cadres responsables de l’intelligence artificielle
      </p>
    </div>
    <ClientSwitch cls={A.in} style={{ position: 'absolute', left: 120, top: 770, ...dl(420) }} />
    <div className={A.in} style={{ position: 'absolute', left: 660, top: 862, display: 'flex', alignItems: 'center', gap: 22, ...dl(520) }}>
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
        <path d="M330 110 V430" stroke={C.ink} strokeWidth={8} strokeLinecap="round" className={A.growY} style={dl(600)} />
        <path d="M250 440 H410" stroke={C.ink} strokeWidth={10} strokeLinecap="round" className={A.grow} style={dl(700)} />
        <g className={A.fade} style={dl(900)}>
          <g className={A.float}>
            <path d="M120 150 L540 130" stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
            <circle cx={330} cy={140} r={14} fill={C.yellow} stroke={C.ink} strokeWidth={4} />
            <path d="M120 150 L70 290 M120 150 L170 290" stroke={C.faint} strokeWidth={3} />
            <path d="M540 130 L490 270 M540 130 L590 270" stroke={C.faint} strokeWidth={3} />
            <path d="M55 290 H185 a65 30 0 0 1 -130 0" fill={T.blue.bg} stroke={C.blue} strokeWidth={4} />
            <path d="M475 270 H605 a65 30 0 0 1 -130 0" fill={T.green.bg} stroke={C.green} strokeWidth={4} />
          </g>
        </g>
      </svg>
      <div className={A.pop} style={{ position: 'absolute', left: 60, top: 330, width: 140, textAlign: 'center', ...dl(1200) }}>
        <IconTile name="cpu" tone="blue" size={72} solid style={{ margin: '0 auto' }} />
        <div style={{ marginTop: 10, fontFamily: display, fontWeight: 700, fontSize: 26, letterSpacing: '0.08em', color: C.blue }}>PERFORMANCE</div>
      </div>
      <div className={A.pop} style={{ position: 'absolute', left: 460, top: 310, width: 160, textAlign: 'center', ...dl(1400) }}>
        <IconTile name="humanCheck" tone="green" size={72} solid style={{ margin: '0 auto' }} />
        <div style={{ marginTop: 10, fontFamily: display, fontWeight: 700, fontSize: 26, letterSpacing: '0.08em', color: T.green.fg }}>CONFIANCE</div>
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
        Mes engagements pour aujourd’hui
      </Eyebrow>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Pledge icon="bulb" tone="blue" d={500}>
          L’IA expliquée simplement, sans jargon ni équations
        </Pledge>
        <Pledge icon="play" tone="teal" d={640}>
          Des outils essayés en direct, par vous, sur votre poste
        </Pledge>
        <Pledge icon="scale" tone="violet" d={780}>
          De vrais cas, pour juger par vous-même
        </Pledge>
        <Pledge icon="shieldCheck" tone="yellow" d={920}>
          Une mini-charte éthique à rapporter dans votre organisation
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

const OP_Roundtable: Page = () => (
  <Frame mod={0} label="Ouverture · Faisons connaissance">
    <Title>Tour de table</Title>
    <Lede>Trente secondes par personne, micro ouvert, deux questions. Puis un sondage éclair.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 800, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AskCard n={1} title="Qui êtes-vous ?" sub="Prénom, rôle, organisation ou secteur" d={100} />
      <AskCard n={2} title="Un mot sur l’IA, aujourd’hui ?" sub="Curiosité, inquiétude, enthousiasme, méfiance…" d={220} />
    </div>
    <Timer id="op-tour" minutes={7} label="Tour de table" compact cls={A.in} style={{ position: 'absolute', left: 120, top: 640, ...dl(460) }} />
    <div style={{ position: 'absolute', left: 990, top: 290, width: 810 }}>
      <Eyebrow cls={A.in} c={C.violet} style={dl(200)}>
        Sondage éclair · votre usage de l’IA
      </Eyebrow>
      <Hint cls={A.in} style={{ marginTop: 8, ...dl(260) }}>
        Répondez par le numéro de la ligne
      </Hint>
      <Poll cls={A.in} style={{ marginTop: 22, ...dl(360) }}>
        <PollRow id="none" icon="eye" tone="grey" label="1 · Je ne l’ai jamais vraiment essayée" />
        <PollRow id="perso" icon="smile" tone="blue" label="2 · Je l’utilise à titre personnel" />
        <PollRow id="work" icon="chat" tone="teal" label="3 · Je l’utilise parfois au travail" />
        <PollRow id="project" icon="rocket" tone="green" label="4 · Mon organisation a des projets d’IA" />
        <PollRow id="rules" icon="shieldCheck" tone="violet" label="5 · Mon organisation a des règles d’usage" />
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
      <div style={{ marginTop: 10, fontSize: 25, lineHeight: 1.38, color: C.soft }}>{children}</div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 26, bottom: 24, ...dl(600 + i * 140) }}>
      <Tag tone={when === 'Matin' ? 'blue' : 'green'} size={20}>
        <ByClient apsm={when} sobeys={when === 'Matin' ? 'Matinée 1' : 'Matinée 2'} />
      </Tag>
    </div>
  </div>
);

const OP_Objectives: Page = () => (
  <Frame mod={0}>
    <Title>
      <ByClient apsm="Ce que vous saurez faire ce soir" sobeys="Ce que vous saurez faire après les deux matinées" />
    </Title>
    <Lede>Cinq objectifs, du plus simple au plus engageant.</Lede>
    <ObjStep i={1} h={400} tone="blue" verb="COMPRENDRE" when="Matin">
      Les concepts clés : IA, machine learning, deep learning
    </ObjStep>
    <ObjStep i={2} h={450} tone="teal" verb="IDENTIFIER" when="Matin">
      Des cas d’usage concrets dans plusieurs secteurs
    </ObjStep>
    <ObjStep i={3} h={500} tone="violet" verb="ANALYSER" when="Matin">
      Les enjeux de biais, de transparence et de données
    </ObjStep>
    <ObjStep i={4} h={550} tone="green" verb="APPLIQUER" when="Après-midi">
      La Loi 25 et les principes de l’IA responsable
    </ObjStep>
    <ObjStep i={5} h={600} tone="yellow" verb="ÉLABORER" when="Après-midi">
      Une mini-charte éthique pour encadrer l’IA
    </ObjStep>
  </Frame>
);

// ─── Programme (one day, eight modules) ─────────────────────────────────────
const ProgRow = ({ t, n, icon, tone = 'blue', d, children }: { t: string; n?: number; icon?: IconName; tone?: Tone; d: number; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 52, ...dl(d) }}>
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
  <div className={A.fade} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 34, ...dl(d) }}>
    <span style={{ width: 80, fontFamily: mono, fontSize: 19, color: C.faint }}>{t}</span>
    <span style={{ width: 40, height: 2, background: C.rule }} />
    <span style={{ fontSize: 22, fontStyle: 'italic', color: C.muted }}>{children}</span>
  </div>
);

const HalfCol = ({ x, title, sub, d, children }: { x: number; title: string; sub: string; d: number; children: ReactNode }) => (
  <div
    className={A.in}
    style={{ position: 'absolute', left: x, top: 230, width: 816, boxSizing: 'border-box', padding: '26px 36px 24px', background: C.card, borderRadius: 'var(--osd-radius)', boxShadow: SHADOW, ...dl(d) }}
  >
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 14 }}>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 46, color: C.ink }}>{title}</span>
      <span style={{ fontSize: 26, color: C.muted }}>{sub}</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
  </div>
);

const ProgramColsSobeys = () => (
  <>
    <HalfCol x={120} title="Matinée 1" sub="Fondamentaux de l’IA" d={0}>
      <ProgRow t="9:00" icon="users" d={150}>
        Accueil et tour de table
      </ProgRow>
      <ProgRow t="9:15" n={1} d={210}>
        Qu’est-ce que l’intelligence artificielle ?
      </ProgRow>
      <ProgRow t="10:05" n={2} d={270}>
        Applications concrètes et démonstrations
      </ProgRow>
      <ProgBreak t="10:35" d={330}>
        Pause
      </ProgBreak>
      <ProgRow t="10:50" n={3} tone="yellow" d={390}>
        Atelier 1 · Explorer des outils IA
      </ProgRow>
      <ProgRow t="11:30" n={4} tone="violet" d={450}>
        Les grands enjeux éthiques
      </ProgRow>
      <ProgBreak t="12:00" d={510}>
        Fin de la matinée 1
      </ProgBreak>
    </HalfCol>
    <HalfCol x={984} title="Matinée 2" sub="Éthique et gouvernance" d={150}>
      <ProgRow t="9:00" n={5} tone="violet" d={300}>
        Rappel, Loi 25 et principes de l’IA responsable
      </ProgRow>
      <ProgRow t="9:40" n={6} tone="yellow" d={360}>
        Atelier 2 · Étude de cas éthique
      </ProgRow>
      <ProgBreak t="10:20" d={420}>
        Pause
      </ProgBreak>
      <ProgRow t="10:35" n={7} tone="violet" d={480}>
        Vers une gouvernance de l’IA
      </ProgRow>
      <ProgRow t="11:00" n={8} tone="yellow" d={540}>
        Atelier 3 · Mini-charte éthique
      </ProgRow>
      <ProgRow t="11:45" icon="flag" d={600}>
        Bilan, plan d’action et évaluation
      </ProgRow>
      <ProgBreak t="12:00" d={660}>
        Fin de la formation
      </ProgBreak>
    </HalfCol>
  </>
);

const ProgramCols = () => (
  useClient() === 'sobeys' ? <ProgramColsSobeys /> : <ProgramColsApsm />
);

const ProgramColsApsm = () => (
  <>
    <HalfCol x={120} title="Matin" sub="Fondamentaux de l’IA" d={0}>
      <ProgRow t="9:00" icon="users" d={150}>
        Accueil et tour de table
      </ProgRow>
      <ProgRow t="9:15" n={1} d={210}>
        Qu’est-ce que l’intelligence artificielle ?
      </ProgRow>
      <ProgRow t="10:05" n={2} d={270}>
        Applications concrètes et démonstrations
      </ProgRow>
      <ProgBreak t="10:35" d={330}>
        Pause
      </ProgBreak>
      <ProgRow t="10:50" n={3} tone="yellow" d={390}>
        Atelier 1 · Explorer des outils IA
      </ProgRow>
      <ProgRow t="11:30" n={4} tone="violet" d={450}>
        Les grands enjeux éthiques
      </ProgRow>
      <ProgBreak t="12:00" d={510}>
        Dîner
      </ProgBreak>
    </HalfCol>
    <HalfCol x={984} title="Après-midi" sub="Éthique et gouvernance" d={150}>
      <ProgRow t="13:00" n={5} tone="violet" d={300}>
        Loi 25 et principes de l’IA responsable
      </ProgRow>
      <ProgRow t="13:40" n={6} tone="yellow" d={360}>
        Atelier 2 · Étude de cas éthique
      </ProgRow>
      <ProgBreak t="14:20" d={420}>
        Pause
      </ProgBreak>
      <ProgRow t="14:35" n={7} tone="violet" d={480}>
        Vers une gouvernance de l’IA
      </ProgRow>
      <ProgRow t="15:00" n={8} tone="yellow" d={540}>
        Atelier 3 · Mini-charte éthique
      </ProgRow>
      <ProgRow t="15:45" icon="flag" d={600}>
        Bilan, plan d’action et évaluation
      </ProgRow>
      <ProgBreak t="16:00" d={660}>
        Fin de la formation
      </ProgBreak>
    </HalfCol>
  </>
);

const OP_Program: Page = () => (
  <Frame mod={0}>
    <Title>
      <ByClient apsm="Programme de la journée" sobeys="Programme des deux matinées" />
    </Title>
    <ProgramCols />
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 900, display: 'flex', alignItems: 'center', gap: 28, fontSize: 24, color: C.soft, ...dl(800) }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Num n="" tone="blue" size={26} /> Fondamentaux
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Num n="" tone="violet" size={26} /> Éthique et cadres
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Num n="" tone="yellow" size={26} /> Ateliers individuels
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
      style={{ boxSizing: 'border-box', width: 390, height: 390, padding: '30px 30px', background: C.card, borderRadius: 'var(--osd-radius)', boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, ...dl(d) }}
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
    style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 18, padding: '20px 24px', background: C.panel, borderRadius: 14, fontSize: 26, lineHeight: 1.3, color: C.ink, ...dl(d) }}
  >
    <Icon name={icon} size={34} color={C.blue} />
    <span>{children}</span>
  </div>
);

const OP_HowWeWork: Page = () => (
  <Frame mod={0}>
    <Title>Comment nous allons travailler</Title>
    <Lede>Une formation active : on essaie, on discute, on se trompe… et on comprend.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 40 }}>
      <ActCard kind="qcm" icon="check" title="Votez, vérifiez" d={100}>
        Vous répondez à voix haute, je clique. Les pièges sont voulus.
      </ActCard>
      <ActCard kind="demo" icon="play" title="Observez" d={220}>
        Des démonstrations en partage d’écran, avec de vrais outils.
      </ActCard>
      <ActCard kind="cas" icon="book" title="Jugez" d={340}>
        De vrais cas où l’IA a dérapé. Qu’auriez-vous fait ?
      </ActCard>
      <ActCard kind="atelier" icon="pointer" title="Pratiquez" d={460}>
        Trois ateliers individuels, guidés pas à pas, avec un livrable.
      </ActCard>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 740, width: 1680, display: 'flex', gap: 24 }}>
      <RuleChip icon="chat" d={600}>
        Questions bienvenues, à tout moment
      </RuleChip>
      <RuleChip icon="lock" d={700}>
        Aucune donnée confidentielle dans les outils
      </RuleChip>
      <RuleChip icon="leaf" d={800}>
        Fil rouge : la Mutuelle des Érables
      </RuleChip>
    </div>
    <Callout
      cls={A.in}
      title="Classe virtuelle"
      icon="video"
      tone="blue"
      size={26}
      style={{ position: 'absolute', left: 120, top: 862, width: 1680, padding: '14px 26px', ...dl(900) }}
    >
      Caméra si possible, micro coupé hors échanges. Idéal : deux écrans, la formation et l’outil d’IA.
    </Callout>
  </Frame>
);

// ─── Running case: la Mutuelle des Érables ──────────────────────────────────
const Fact = ({ icon, children }: { icon: IconName; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 27, color: C.ink }}>
    <Icon name={icon} size={30} color={C.teal} />
    <span>{children}</span>
  </div>
);

const CastCard = ({ id, d, children }: { id: CastId; d: number; children: ReactNode }) => (
  <div
    className={A.in}
    style={{ boxSizing: 'border-box', height: 116, display: 'flex', alignItems: 'center', gap: 24, padding: '0 28px', background: C.card, borderRadius: 'var(--osd-radius)', boxShadow: SHADOW, ...dl(d) }}
  >
    <div style={{ width: 560, flex: 'none' }}>
      <Who id={id} size={28} />
    </div>
    <div style={{ fontSize: 24, lineHeight: 1.35, color: C.soft }}>{children}</div>
  </div>
);

const OP_Mutuelle: Page = () => (
  <Frame mod={0} kind="cas" label="Ouverture · Fil rouge">
    <Title>Notre fil rouge : la Mutuelle des Érables</Title>
    <Lede>Une organisation fictive aux enjeux réalistes. Nous la retrouverons dans chaque module.</Lede>
    <div
      className={A.left}
      style={{ position: 'absolute', left: 120, top: 290, width: 520, height: 650, boxSizing: 'border-box', padding: '30px 32px', background: C.card, borderRadius: 'var(--osd-radius)', boxShadow: `${SHADOW}, inset 0 8px 0 ${C.teal}`, display: 'flex', flexDirection: 'column' }}
    >
      <Photo id="troisRivieres" w="calc(100% + 64px)" h={170} radius={0} style={{ margin: '-30px -32px 20px', borderRadius: 'var(--osd-radius) var(--osd-radius) 0 0' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <IconTile name="leaf" tone="teal" size={70} solid />
        <div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 40, lineHeight: 1.05, color: C.ink }}>Mutuelle des Érables</div>
          <div style={{ fontSize: 22, color: C.muted }}>Assurance de personnes · Québec</div>
        </div>
      </div>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Fact icon="users">650 employés</Fact>
        <Fact icon="heart">310 000 membres assurés</Fact>
        <Fact icon="shield">Vie, invalidité, assurance collective</Fact>
        <Fact icon="map">Siège à Trois-Rivières</Fact>
      </div>
      <Callout title="Le projet" icon="flag" tone="yellow" size={25} style={{ marginTop: 'auto', padding: '16px 22px' }}>
        Un « Programme IA » de quatre projets, à lancer en 2027.
      </Callout>
    </div>
    <div style={{ position: 'absolute', left: 680, top: 290, width: 1120, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <CastCard id="nathalie" d={200}>
        Porte le programme. Veut aller vite, sans faire de vagues.
      </CastCard>
      <CastCard id="samir" d={320}>
        Reçoit 4 000 CV par an. Rêve d’un tri automatique.
      </CastCard>
      <CastCard id="chloe" d={440}>
        Gardienne de la Loi 25. Veut être consultée avant, pas après.
      </CastCard>
      <CastCard id="vincent" d={560}>
        Veut un agent conversationnel et des campagnes personnalisées.
      </CastCard>
      <CastCard id="mei" d={680}>
        Construit les modèles. Se demande ce qu’ils ont appris.
      </CastCard>
    </div>
  </Frame>
);

// ─── The question of the day ────────────────────────────────────────────────
const OP_Question: Page = () => (
  <Frame mod={0} kind="cas" label="Ouverture · Fil rouge">
    <Title>
      <ByClient apsm="La question qui nous suivra toute la journée" sobeys="La question qui nous suivra pendant les deux matinées" />
    </Title>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 1680, ...dl(100) }}>
      <Quote by="Nathalie, au comité de direction de la Mutuelle">
        Comment profiter de l’IA <Hl>sans trahir la confiance</Hl> de nos membres et de nos employés ?
      </Quote>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 520, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', columnGap: 30 }}>
      <Card tone="blue" icon="bulb" title={<ByClient apsm="Ce matin" sobeys="Matinée 1 · début" />} size={26} cls={A.in} style={{ height: 300, ...dl(300) }}>
        Comprendre ce qu’est l’IA, ce qu’elle sait faire, et l’essayer vous-même.
      </Card>
      <Card tone="violet" icon="scale" title={<ByClient apsm="Avant et après le dîner" sobeys="Fin de la matinée 1 et début de la matinée 2" />} size={26} cls={A.in} style={{ height: 300, ...dl(450) }}>
        Repérer les risques : biais, opacité, données. Connaître la Loi 25.
      </Card>
      <Card tone="yellow" icon="shieldCheck" title={<ByClient apsm="Cet après-midi" sobeys="Matinée 2" />} size={26} cls={A.in} style={{ height: 300, ...dl(600) }}>
        Juger un cas de votre secteur, puis écrire les règles du jeu : une mini-charte.
      </Card>
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
      q="Parmi ces affirmations sur l’IA, lesquelles sont vraies ?"
      explain="L’IA est utile et déjà partout, mais elle n’est ni neutre ni infaillible. Et au Québec, la loi encadre déjà les décisions automatisées. C’est tout le programme de la formation."
    >
      <Opt why="Piège ! Une IA apprend à partir de données produites par des humains. Elle hérite de leurs déséquilibres : on le verra au module 4.">
        Une IA est neutre, puisque c’est une machine
      </Opt>
      <Opt ok why="Oui : filtre anti-pourriel, GPS, traduction, recommandations… On l’utilise des dizaines de fois par jour, souvent sans le savoir.">
        Vous utilisez déjà l’IA plusieurs fois par jour
      </Opt>
      <Opt why="Piège ! Elle produit le texte le plus probable, pas le plus vrai. Elle peut inventer une source avec aplomb.">
        Si une IA l’affirme avec assurance, c’est fiable
      </Opt>
      <Opt ok why="Oui : depuis septembre 2023, la Loi 25 impose d’informer une personne quand une décision la concernant repose uniquement sur un traitement automatisé.">
        Au Québec, une loi encadre déjà certaines décisions automatisées
      </Opt>
    </Qcm>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [OP_Cover, OP_Trainer, OP_Roundtable, OP_Objectives, OP_Program, OP_HowWeWork, OP_Mutuelle, OP_Question, OP_Quiz0];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 1 min · ACCUEIL (page affichée pendant l'arrivée des participants)

VERSION CLIENT — AVANT LA SESSION, cliquez le logo du client sur cette page : APSM ou Sobeys. Le choix est mémorisé et suivi par la vue présentateur. Il change les trois ateliers (pages des modules 3, 6 et 8), le logo en pied de page et le lien vers le guide PDF. Tout le reste est commun.
• APSM : session du 1er décembre 2026, six heures. Priorités du cadrage : vérification de l'information, éthique, Loi 25. Outils gratuits seulement (aucun outil sous licence d'entreprise choisi).
• Sobeys : ateliers adaptés à l'épicerie et au commerce de détail.

OBJECTIF — Installer un climat chaleureux et poser le cadre : une journée pour passer de « on entend parler de l'IA partout » à « je comprends ce qu'elle fait, ce qu'elle risque, et comment l'encadrer ».

SOBEYS — Deux matinées de trois heures (matinée 1, puis matinée 2), pas une journée. Même objectif pour l'ensemble.

DIRE — « Bonjour et bienvenue à la formation Introduction à l'IA et à l'éthique. Ce matin, on comprend ce qu'est l'intelligence artificielle et ce qu'elle sait faire ; on l'essaie. Cet après-midi, on regarde ses risques en face, la Loi 25, et on écrit ensemble les règles du jeu. »

SOBEYS — Dites plutôt : « Bonjour et bienvenue à la formation Introduction à l'IA et à l'éthique. À la matinée 1, on comprend ce qu'est l'intelligence artificielle et ce qu'elle sait faire ; on l'essaie ; puis on ouvre le dossier des risques. À la matinée 2, on regarde la Loi 25, on juge un cas de votre secteur, et on écrit ensemble les règles du jeu. »

Montrer l'animation : « Une balance : d'un côté la performance de l'IA, de l'autre la confiance. Toute la journée, on va chercher l'équilibre. »

SOBEYS — Dites « Pendant nos deux matinées » au lieu de « Toute la journée ».

LOGISTIQUE — Classe virtuelle : horaire 9 h – 16 h, pauses vers 10 h 35 et 14 h 20, dîner 12 h – 13 h. Vérifiez le son, la caméra et l'accès au Chat. Demandez à chacun d'ouvrir dès maintenant un assistant d'IA dans un autre onglet ou sur un second écran : un compte gratuit ChatGPT, Copilot, Gemini ou Claude suffit. Évaluation à la fin de la journée.

SOBEYS — Deux matinées de 9 h à 12 h, sans dîner : pause vers 10 h 35 à la matinée 1, vers 10 h 20 à la matinée 2. Confirmez la date et l'heure de la matinée 2. Demandez de garder le document de l'atelier 1 (les trois constats) : on s'en resservira à la matinée 2. L'évaluation a lieu à la fin de la matinée 2.

TRANSITION — « Avant d'entrer dans le sujet, quelques mots sur moi. »`,
  `⏱ 2 min

OBJECTIF — Établir votre crédibilité et un contrat pédagogique clair.

DIRE — Présentez-vous en 60 à 90 secondes. À PERSONNALISER : votre parcours, les organisations que vous avez accompagnées, et un exemple où l'IA vous a impressionné… ou inquiété.

Puis les quatre engagements :
1. Sans jargon — « Aucune connaissance technique n'est nécessaire. Si j'utilise un mot compliqué, arrêtez-moi. »
2. Vous essayez — « Trois ateliers, chacun sur votre poste. On ne fait pas que regarder. »
3. De vrais cas — « Des histoires réelles, documentées, où l'IA a dérapé. Vous jugerez par vous-mêmes. »
4. Un livrable — « Vous repartez avec une mini-charte éthique, prête à proposer dans votre organisation. »

TRANSITION — « À votre tour maintenant. »`,
  `⏱ 7 min (30 secondes par personne, ajuster selon la taille du groupe)

OBJECTIF — Connaître le groupe, ses secteurs et son humeur face à l'IA, pour adapter les exemples de la journée.

SOBEYS — « Exemples de la journée » = exemples des deux matinées.

ANIMATION — Lancez le minuteur. Appelez chaque personne par son prénom (ordre de la liste des participants) ; elle ouvre son micro et répond aux deux questions. Notez dans un document à vous les secteurs (RH, santé, finance, marketing, public…) : vous y reviendrez au module 2. Notez aussi les mots d'humeur : « inquiétude » et « méfiance » sont de très bonnes portes d'entrée pour l'après-midi.

SONDAGE ÉCLAIR — Chacun annonce à voix haute le numéro de la ligne qui le décrit (1 à 5). Cliquez une fois la ligne par réponse (le bouton « − » corrige une erreur). Variante : le sondage intégré de Teams ou Zoom.

LECTURE DU RÉSULTAT —
• Majorité 1 ou 2 : prenez votre temps au module 1, multipliez les démonstrations.
• Majorité 3 ou 4 : accélérez les définitions, insistez sur les enjeux et la Loi 25.
• Quelqu'un répond 5 (règles d'usage) : demandez-lui s'il accepte d'en parler au module 7, sur la gouvernance.

TRANSITION — « Merci ! Voici ce que je vous propose d'atteindre ensemble. »`,
  `⏱ 1 min

OBJECTIF — Présenter les cinq objectifs officiels comme une progression.

DIRE — « Cinq marches, qui reprennent les objectifs de la formation. »
1. COMPRENDRE — « IA, machine learning, deep learning : trois mots qu'on mélange souvent. »
2. IDENTIFIER — « Des usages concrets en RH, en santé, en finance, en marketing. »
3. ANALYSER — « Les biais, la transparence, la protection des données. »
4. APPLIQUER — « La Loi 25 et les principes de l'IA responsable. »
5. ÉLABORER — « Votre mini-charte éthique, la dernière marche, celle qui engage. »

TRANSITION — « Voici comment la journée s'organise. »

SOBEYS — Dites « Voici comment nos deux matinées s'organisent. »`,
  `⏱ 1 min

OBJECTIF — Donner de la visibilité sur le déroulement.

DIRE — « Le matin, les fondamentaux : ce qu'est l'IA, ses applications, avec des démonstrations, puis l'atelier 1 où vous explorez vous-mêmes un agent conversationnel et un outil de génération. Avant le dîner, on ouvre le dossier éthique : biais, transparence, vie privée. »

SOBEYS — Dites plutôt : « La matinée 1 : les fondamentaux, ce qu'est l'IA, ses applications avec des démonstrations, puis l'atelier 1 où vous explorez vous-mêmes un agent conversationnel et un outil de génération. En fin de matinée, on ouvre le dossier éthique : biais, transparence, vie privée. »

« L'après-midi : la Loi 25 et les principes de l'IA responsable, puis l'atelier 2, une étude de cas de votre secteur. Après la pause, la gouvernance : qui fait quoi dans une organisation. Et l'atelier 3 : votre mini-charte. »

SOBEYS — Dites plutôt : « La matinée 2 : la Loi 25 et les principes de l'IA responsable, puis l'atelier 2, une étude de cas de votre secteur. Après la pause, la gouvernance : qui fait quoi dans une organisation. Et l'atelier 3 : votre mini-charte. Chaque matinée va de 9 h à 12 h. »

À SOULIGNER — Les modules en jaune sont les ateliers : chacun sur son poste, guidé pas à pas, avec un minuteur. Les numéros en haut à droite de chaque page sont cliquables : ils vous ramènent au début d'un module.

TRANSITION — « Comment on va travailler. »`,
  `⏱ 1 min

OBJECTIF — Expliquer les codes visuels et le contrat de participation.

DIRE — « Vous verrez des étiquettes en haut des pages. »
• QCM (violet) — « Vous votez à voix haute, je clique la réponse majoritaire. Les mauvaises réponses sont des pièges volontaires. »
• DÉMO (bleu) — « Je montre en direct, en partage d'écran. »
• ÉTUDE DE CAS (sarcelle) — « Des histoires vraies. »
• ATELIER (jaune) — « Chacun sur son poste, avec un minuteur et un livrable. »

LES TROIS RÈGLES —
1. Questions bienvenues à tout moment, au micro.
2. « Aucune donnée confidentielle dans les outils pendant la formation. » C'est déjà de l'éthique appliquée : on y reviendra.
3. Fil rouge : la Mutuelle des Érables, présentée juste après.

CLASSE VIRTUELLE — Caméra si possible, micro coupé hors échanges. Idéal : deux écrans, ou la formation dans une fenêtre et l'outil d'IA dans l'autre.

TRANSITION — « Faisons connaissance avec la Mutuelle. »`,
  `⏱ 2 min · FIL ROUGE

OBJECTIF — Ancrer la journée dans une organisation transversale, où chaque secteur du programme officiel se retrouve : RH, santé, finance, marketing.

DIRE — « La Mutuelle des Érables est fictive, mais ses enjeux sont réels. Une mutuelle d'assurance de personnes : vie, invalidité, assurance collective. 650 employés, 310 000 membres, siège à Trois-Rivières. Elle manipule tous les jours des données parmi les plus sensibles qui soient : la santé, les revenus, la famille. »

Présenter les personnages (les cartes apparaissent une à une) :
• Nathalie, vice-présidente transformation numérique : elle porte le Programme IA et veut aller vite.
• Samir, RH : 4 000 CV par an, il rêve d'un tri automatique.
• Chloé, responsable de la protection des renseignements personnels, la RPRP exigée par la Loi 25 : elle veut être consultée avant, pas après.
• Vincent, marketing : un agent conversationnel et des campagnes personnalisées.
• Mei, analyste de données : elle construit les modèles et se demande ce qu'ils ont appris.

INSISTER — Chacun a raison de son point de vue. L'éthique, c'est souvent arbitrer entre des personnes qui ont toutes un peu raison.

TRANSITION — « Et voici la question que se pose Nathalie. »`,
  `⏱ 1 min · FIL ROUGE

DIRE — Lisez la citation lentement : « Comment profiter de l'IA sans trahir la confiance de nos membres et de nos employés ? »

« Ce matin, on comprend et on essaie. Autour du dîner, on repère les risques. Cet après-midi, on juge un cas de votre secteur et on écrit les règles du jeu. »

SOBEYS — Dites plutôt : « À la matinée 1, on comprend, on essaie, puis on repère les risques. À la matinée 2, on juge un cas de votre secteur et on écrit les règles du jeu. »

INTERACTION — « Dans votre organisation, qui se pose cette question aujourd'hui ? » Une ou deux réponses au micro suffisent.

TRANSITION — « Testons vos intuitions avant de commencer. »`,
  `⏱ 2 min · QCM À RÉPONSES MULTIPLES

OBJECTIF — Faire émerger les représentations initiales sans juger.

ANIMATION — Lisez la question. Les participants annoncent les lettres qu'ils retiennent (ex. « B et D »). Cochez les options choisies par la majorité, puis « Valider ma sélection ». Cliquez ensuite chaque option pour lire l'explication. Avec →, vous révélez les bonnes réponses, puis l'essentiel.

RÉPONSES — B et D.
• A ✗ PIÈGE — « Une machine n'est pas neutre : elle apprend de nos données, avec nos travers. »
• B ✓ — Filtre anti-pourriel, GPS, traduction, recommandations.
• C ✗ PIÈGE — L'aplomb n'est pas une preuve : on verra comment un modèle invente.
• D ✓ — L'article 12.1 de la loi sur le secteur privé, modifiée par la Loi 25, en vigueur depuis le 22 septembre 2023.

MESSAGE CLÉ — Utile, partout… et ni neutre ni infaillible.

TRANSITION — « Mais d'abord : qu'est-ce que c'est, au juste, l'intelligence artificielle ? »`,
];
// @@NOTES-END
