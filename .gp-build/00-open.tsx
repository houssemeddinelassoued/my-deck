// ─── Cover ──────────────────────────────────────────────────────────────────
// A project schedule draws itself; the AI tile floats over it.
const CovBar = ({ label, x, w, row, tone, d }: { label: string; x: number; w: number; row: number; tone: Tone; d: number }) => (
  <>
    <div
      className={A.fade}
      style={{ position: 'absolute', left: 28, top: 92 + row * 74, width: 170, fontSize: 21, fontWeight: 600, color: C.soft, lineHeight: '40px', ...dl(d - 200) }}
    >
      {label}
    </div>
    <div
      className={A.grow}
      style={{ position: 'absolute', left: 210 + x, top: 92 + row * 74, width: w, height: 40, borderRadius: 8, background: STRONG[tone], ...dl(d) }}
    />
  </>
);

const GP_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <img src={logoStack} alt="Technologia" className={A.fade} style={{ position: 'absolute', left: 112, top: 78, height: 150, display: 'block' }} />
    <div style={{ position: 'absolute', left: 120, top: 318, width: 960 }}>
      <Eyebrow cls={A.in} size={28}>
        Formation IA124 · 2 jours
      </Eyebrow>
      <h1
        className={A.in}
        style={{ margin: '18px 0 0', fontFamily: display, fontWeight: 700, fontSize: 118, lineHeight: 1.0, letterSpacing: '-0.01em', color: C.ink, ...dl(120) }}
      >
        IA appliquée à la
        <br />
        gestion de projet
      </h1>
      <p className={A.in} style={{ margin: '26px 0 0', fontSize: 36, lineHeight: 1.3, color: C.soft, ...dl(240) }}>
        Utiliser l’intelligence artificielle pour planifier, suivre et automatiser efficacement les projets
      </p>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 870, display: 'flex', alignItems: 'center', gap: 22, ...dl(520) }}>
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

    <Squares s={250} x={1470} y={640} delay={200} />
    <div
      className={A.in}
      style={{ position: 'absolute', left: 1130, top: 250, width: 680, height: 560, background: C.card, borderRadius: 22, boxShadow: SHADOW, ...dl(300) }}
    >
      <div style={{ position: 'absolute', left: 28, top: 26, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon name="gantt" size={30} color={C.blue} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 26, letterSpacing: '0.08em', color: C.ink }}>PLAN DE PROJET</span>
      </div>
      <CovBar label="Cadrage" x={0} w={110} row={0} tone="blue" d={700} />
      <CovBar label="Planification" x={70} w={160} row={1} tone="teal" d={900} />
      <CovBar label="Exécution" x={180} w={230} row={2} tone="green" d={1100} />
      <CovBar label="Suivi" x={150} w={290} row={3} tone="violet" d={1300} />
      <CovBar label="Communication" x={30} w={390} row={4} tone="yellow" d={1500} />
      <div className={A.fade} style={{ position: 'absolute', left: 28, top: 462, fontSize: 21, fontWeight: 600, color: C.coral, lineHeight: '40px', ...dl(1700) }}>
        Ouverture
      </div>
      <div style={{ position: 'absolute', left: 622, top: 469, width: 26, height: 26, transform: 'rotate(45deg)' }}>
        <div className={A.pop} style={{ width: 26, height: 26, background: C.coral, ...dl(1800) }} />
      </div>
    </div>
    <div className={A.float} style={{ position: 'absolute', left: 1075, top: 745, width: 150, height: 150 }}>
      <div
        className={A.pop}
        style={{ width: 150, height: 150, borderRadius: 32, background: C.card, boxShadow: '0 30px 60px -28px rgba(20,60,100,.55), 0 0 0 1px rgba(0,0,0,.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...dl(1900) }}
      >
        <Icon name="sparkles" size={84} color={C.blue} sw={1.8} />
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

const GP_Trainer: Page = () => (
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
        Mes engagements pour ces 2 jours
      </Eyebrow>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Pledge icon="bulb" tone="blue" d={500}>
          De l’IA expliquée simplement, sans jargon ni équations
        </Pledge>
        <Pledge icon="tool" tone="teal" d={640}>
          Des outils que vous avez déjà (ou presque), testés en direct
        </Pledge>
        <Pledge icon="note" tone="green" d={780}>
          Des modèles de demandes (prompts) prêts à réutiliser lundi
        </Pledge>
        <Pledge icon="shieldCheck" tone="yellow" d={920}>
          Un regard lucide : ce que l’IA fait bien… et ce qu’elle rate
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

const GP_Roundtable: Page = () => (
  <Frame mod={0} label="Ouverture · Faisons connaissance">
    <Title>Tour de table</Title>
    <Lede>Une minute par personne, micro ouvert, trois questions. Puis un sondage éclair dans le clavardage.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 800, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AskCard n={1} title="Qui êtes-vous ?" sub="Prénom, rôle, service (RH, marketing, TI…)" d={100} />
      <AskCard n={2} title="Quel projet menez-vous en ce moment ?" sub="Une phrase : son objectif et son échéance" d={220} />
      <AskCard n={3} title="Qu’est-ce qui vous prend le plus de temps ?" sub="Planifier, relancer, rédiger, faire des rapports…" d={340} />
    </div>
    <Timer id="tour" minutes={15} label="Tour de table" compact cls={A.in} style={{ position: 'absolute', left: 120, top: 770, ...dl(460) }} />
    <div style={{ position: 'absolute', left: 990, top: 290, width: 810 }}>
      <Eyebrow cls={A.in} c={C.violet} style={dl(200)}>
        Sondage éclair · votre usage de l’IA
      </Eyebrow>
      <Hint cls={A.in} style={{ marginTop: 8, ...dl(260) }}>
        Répondez dans le clavardage par le numéro de la ligne
      </Hint>
      <Poll cls={A.in} style={{ marginTop: 22, ...dl(360) }}>
        <PollRow id="none" icon="eye" tone="grey" label="1 · Je ne l’ai jamais vraiment essayée" />
        <PollRow id="perso" icon="smile" tone="blue" label="2 · Je l’utilise à titre personnel" />
        <PollRow id="work" icon="chat" tone="teal" label="3 · Je l’utilise parfois au travail" />
        <PollRow id="project" icon="kanban" tone="green" label="4 · Je l’utilise déjà dans mes projets" />
        <PollRow id="team" icon="users" tone="violet" label="5 · Mon équipe a des règles d’usage" />
      </Poll>
    </div>
  </Frame>
);

// ─── Objectives: a rising staircase ─────────────────────────────────────────
const ObjStep = ({ i, h, tone, verb, day, children }: { i: number; h: number; tone: Tone; verb: string; day: number; children: ReactNode }) => (
  <div style={{ position: 'absolute', left: 120 + (i - 1) * 336, top: 960 - h, width: 316, height: h }}>
    <div className={A.growY} style={{ position: 'absolute', inset: 0, borderRadius: 18, background: C.card, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, ...dl(i * 120) }} />
    <div className={A.in} style={{ position: 'relative', padding: '34px 26px 0', ...dl(420 + i * 140) }}>
      <Num n={i} tone={tone} size={52} />
      <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 40, lineHeight: 1.05, letterSpacing: '0.03em', color: C.ink }}>{verb}</div>
      <div style={{ marginTop: 10, fontSize: 25, lineHeight: 1.38, color: C.soft }}>{children}</div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 26, bottom: 24, ...dl(600 + i * 140) }}>
      <Tag tone={day === 1 ? 'blue' : 'green'} size={20}>
        Jour {day}
      </Tag>
    </div>
  </div>
);

const GP_Objectives: Page = () => (
  <Frame mod={0}>
    <Title>Ce que vous saurez faire</Title>
    <Lede>À la fin des 2 jours, vous serez capable de…</Lede>
    <ObjStep i={1} h={400} tone="blue" verb="COMPRENDRE" day={1}>
      Les usages concrets de l’IA pour planifier, suivre et communiquer
    </ObjStep>
    <ObjStep i={2} h={450} tone="teal" verb="UTILISER" day={1}>
      Les outils génériques et intégrés pour générer un plan de projet
    </ObjStep>
    <ObjStep i={3} h={500} tone="green" verb="AUTOMATISER" day={2}>
      Comptes rendus, résumés de réunions et suivi des tâches
    </ObjStep>
    <ObjStep i={4} h={550} tone="yellow" verb="COLLABORER" day={2}>
      Mettre en place des pratiques d’équipe efficaces avec l’IA
    </ObjStep>
    <ObjStep i={5} h={600} tone="coral" verb="MAÎTRISER" day={2}>
      Les limites, les risques et les enjeux éthiques de l’IA
    </ObjStep>
  </Frame>
);

// ─── Programme ──────────────────────────────────────────────────────────────
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
    <span style={{ fontSize: 28, fontWeight: 500, color: C.ink }}>{children}</span>
  </div>
);

const ProgBreak = ({ t, d, children }: { t: string; d: number; children: ReactNode }) => (
  <div className={A.fade} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 30, ...dl(d) }}>
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
      top: 240,
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

const ProgramCols = ({ today }: { today: number }) => (
  <>
    <DayCol x={120} day={1} sub="Comprendre et planifier" now={today === 1}>
      <ProgRow t="9:00" icon="users" d={150}>
        Accueil et tour de table
      </ProgRow>
      <ProgRow t="9:30" n={1} d={210}>
        Introduction à l’intelligence artificielle
      </ProgRow>
      <ProgBreak t="10:30" d={270}>
        Pause
      </ProgBreak>
      <ProgRow t="11:15" n={2} d={330}>
        L’IA dans la gestion de projet
      </ProgRow>
      <ProgBreak t="12:00" d={390}>
        Dîner
      </ProgBreak>
      <ProgRow t="13:00" n={2} d={450}>
        Outils du quotidien et bonnes demandes
      </ProgRow>
      <ProgRow t="13:45" n={3} tone="yellow" d={510}>
        Atelier 1 · générer un plan de projet
      </ProgRow>
      <ProgBreak t="14:30" d={570}>
        Pause
      </ProgBreak>
      <ProgRow t="15:40" icon="star" d={630}>
        Bilan du jour 1
      </ProgRow>
      <ProgBreak t="16:00" d={690}>
        Fin de la journée
      </ProgBreak>
    </DayCol>
    <DayCol x={984} day={2} sub="Automatiser et adopter" now={today === 2}>
      <ProgRow t="9:00" icon="loop" d={300}>
        Réactivation
      </ProgRow>
      <ProgRow t="9:15" n={4} d={360}>
        Automatiser et collaborer avec l’IA
      </ProgRow>
      <ProgBreak t="10:30" d={420}>
        Pause
      </ProgBreak>
      <ProgRow t="10:45" n={5} d={480}>
        Limites, éthique et adoption
      </ProgRow>
      <ProgBreak t="12:00" d={540}>
        Dîner
      </ProgBreak>
      <ProgRow t="13:00" n={6} tone="yellow" d={600}>
        Atelier 2 · mini-projet avec l’IA
      </ProgRow>
      <ProgBreak t="14:30" d={660}>
        Pause
      </ProgBreak>
      <ProgRow t="14:45" n={6} tone="yellow" d={720}>
        Présentations et rétroaction
      </ProgRow>
      <ProgRow t="15:40" icon="flag" d={780}>
        Plan d’action et clôture
      </ProgRow>
      <ProgBreak t="16:00" d={840}>
        Fin de la formation
      </ProgBreak>
    </DayCol>
  </>
);

const GP_Program: Page = () => (
  <Frame mod={0}>
    <Title>Programme des 2 jours</Title>
    <ProgramCols today={1} />
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

const GP_HowWeWork: Page = () => (
  <Frame mod={0}>
    <Title>Comment nous allons travailler</Title>
    <Lede>Une formation active : on essaie, on compare, on se trompe… et on comprend.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 40 }}>
      <ActCard kind="qcm" icon="check" title="Cliquez, vérifiez" d={100}>
        Rétroaction immédiate. Les pièges sont voulus : c’est là qu’on apprend.
      </ActCard>
      <ActCard kind="exercice" icon="hand" title="Manipulez" d={220}>
        Cartes à retourner, éléments à glisser, simulateurs à l’écran.
      </ActCard>
      <ActCard kind="demo" icon="play" title="Observez" d={340}>
        Des démonstrations en partage d’écran, avec de vraies demandes.
      </ActCard>
      <ActCard kind="atelier" icon="users" title="Pratiquez" d={460}>
        Deux ateliers individuels, guidés pas à pas, avec un livrable.
      </ActCard>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 740, width: 1680, display: 'flex', gap: 24 }}>
      <RuleChip icon="chat" d={600}>
        Questions dans le clavardage, à tout moment
      </RuleChip>
      <RuleChip icon="lock" d={700}>
        Aucune donnée confidentielle dans les outils
      </RuleChip>
      <RuleChip icon="bike" d={800}>
        Fil rouge : Vélo Fleuve inc.
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
      Caméra si possible, micro coupé hors échanges, clavardage ouvert. Idéal : deux écrans, la formation et l’outil d’IA.
    </Callout>
  </Frame>
);

// ─── Running case: Vélo Fleuve inc. ─────────────────────────────────────────
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
    <div style={{ width: 420, flex: 'none' }}>
      <Who id={id} size={28} />
    </div>
    <div style={{ fontSize: 24, lineHeight: 1.35, color: C.soft }}>{children}</div>
  </div>
);

const GP_Velo: Page = () => (
  <Frame mod={0} kind="cas" label="Ouverture · Fil rouge">
    <Title>Notre fil rouge : Vélo Fleuve inc.</Title>
    <Lede>Une entreprise fictive aux chiffres réalistes. Nous la retrouverons dans chaque module.</Lede>
    <div
      className={A.left}
      style={{ position: 'absolute', left: 120, top: 290, width: 540, height: 650, boxSizing: 'border-box', padding: '30px 32px', background: C.card, borderRadius: 'var(--osd-radius)', boxShadow: `${SHADOW}, inset 0 8px 0 ${C.teal}`, display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <IconTile name="bike" tone="teal" size={76} solid />
        <div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 40, lineHeight: 1.05, color: C.ink }}>Vélo Fleuve inc.</div>
          <div style={{ fontSize: 22, color: C.muted }}>Vélos électriques · Lévis</div>
        </div>
      </div>
      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Fact icon="users">180 employés</Fact>
        <Fact icon="store">3 boutiques-ateliers</Fact>
        <Fact icon="map">Lévis, Sherbrooke, Trois-Rivières</Fact>
        <Fact icon="trend">Ventes en hausse de 30 %</Fact>
      </div>
      <Callout title="Le projet" icon="flag" tone="yellow" size={25} style={{ marginTop: 'auto', padding: '16px 22px' }}>
        Ouvrir une 4ᵉ boutique-atelier à Québec, dans Limoilou, au printemps.
      </Callout>
    </div>
    <div style={{ position: 'absolute', left: 700, top: 290, width: 1100, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <CastCard id="karim" d={200}>
        Premier grand projet. Vient de l’atelier, pas de la gestion de projet.
      </CastCard>
      <CastCard id="luc" d={320}>
        Veut une ouverture à la date prévue et un budget tenu.
      </CastCard>
      <CastCard id="julie" d={440}>
        Doit recruter et former 8 personnes pour la boutique.
      </CastCard>
      <CastCard id="maxime" d={560}>
        Prépare la campagne locale et la journée portes ouvertes.
      </CastCard>
      <CastCard id="annie" d={680}>
        Installe la caisse, l’inventaire, le Wi-Fi et la prise de rendez-vous.
      </CastCard>
    </div>
  </Frame>
);

// ─── The project brief ──────────────────────────────────────────────────────
const KeyNum = ({ value, label, tone, d }: { value: ReactNode; label: string; tone: Tone; d: number }) => (
  <div className={A.in} style={{ flex: 1, background: C.card, borderRadius: 'var(--osd-radius)', boxShadow: `${SHADOW}, inset 0 7px 0 ${STRONG[tone]}`, padding: '30px 30px 24px', ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 700, fontSize: 72, lineHeight: 1, color: tone === 'yellow' ? C.amber : STRONG[tone] }}>{value}</div>
    <div style={{ marginTop: 10, fontSize: 25, lineHeight: 1.35, color: C.soft }}>{label}</div>
  </div>
);

const Pain = ({ icon, d, children }: { icon: IconName; d: number; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 20, ...dl(d) }}>
    <IconTile name={icon} tone="coral" size={56} />
    <span style={{ fontSize: 27, lineHeight: 1.35, color: C.ink }}>{children}</span>
  </div>
);

const GP_Brief: Page = () => (
  <Frame mod={0} kind="cas" label="Ouverture · Fil rouge">
    <Title>Le projet Limoilou en quatre chiffres</Title>
    <Lede>Karim a reçu le mandat lundi. Il a beaucoup à organiser… et peu de temps pour le faire.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 28 }}>
      <KeyNum value="22 sem." label="pour ouvrir, le samedi 10 avril" tone="blue" d={100} />
      <KeyNum value="420 k$" label="de budget, travaux compris" tone="green" d={220} />
      <KeyNum value="5" label="services impliqués dans l’équipe" tone="yellow" d={340} />
      <KeyNum value="8" label="embauches avant l’ouverture" tone="violet" d={460} />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 560, width: 1000 }}>
      <Eyebrow cls={A.in} c={C.coral} style={dl(560)}>
        Ce qui inquiète Karim
      </Eyebrow>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Pain icon="calendar" d={640}>
          Bâtir un échéancier réaliste à partir de zéro
        </Pain>
        <Pain icon="chat" d={760}>
          Une réunion de suivi par semaine… et ses comptes rendus
        </Pain>
        <Pain icon="bell" d={880}>
          Savoir à temps ce qui glisse, sans relancer tout le monde
        </Pain>
        <Pain icon="mail" d={1000}>
          Informer Luc, l’équipe et les fournisseurs, chacun à sa façon
        </Pain>
      </div>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1200, top: 560, width: 600, ...dl(1100) }}>
      <Callout title="Notre question pour 2 jours" icon="sparkles" tone="blue" size={28} style={{ padding: '26px 30px' }}>
        Où l’IA peut-elle faire gagner du temps à Karim, sans lui faire perdre le contrôle de son projet ?
      </Callout>
    </div>
  </Frame>
);

// ─── Warm-up quiz (multi-answer) ────────────────────────────────────────────
const GP_Quiz0: Page = () => (
  <Frame mod={0} kind="qcm" beats={2} label="Ouverture · Point de départ">
    <Title>
      <span style={{ color: C.violet }}>Quiz éclair</span> · Vos intuitions de départ
    </Title>
    <Qcm
      multi
      q="Pour Karim, que peut faire l’IA dès aujourd’hui ?"
      explain="L’IA accélère la préparation : plans, comptes rendus, rapports. Mais elle ne connaît ni le contexte réel ni les engagements pris. Karim reste responsable de ce qui sort : c’est le fil de ces 2 jours."
    >
      <Opt ok why="Oui : à partir d’un bon brief, un assistant produit en une minute une première découpe des tâches que Karim va ensuite corriger.">
        Proposer une première liste de tâches pour le projet
      </Opt>
      <Opt why="Piège ! L’IA ne sait pas ce que l’entrepreneur ou le fournisseur ont promis. Elle propose des durées plausibles, pas des engagements.">
        Garantir que l’échéancier proposé sera respecté
      </Opt>
      <Opt ok why="Oui : à partir d’une transcription ou de notes, elle sépare décisions, actions et points ouverts. Karim relit avant d’envoyer.">
        Rédiger le compte rendu de la réunion de suivi
      </Opt>
      <Opt why="Piège ! Une décision de budget engage l’organisation : elle reste humaine. L’IA peut préparer les options, pas trancher.">
        Décider seule de couper 30 000 $ dans le budget
      </Opt>
    </Qcm>
  </Frame>
);

// ─── Module 1 divider ───────────────────────────────────────────────────────
const M1_Divider: Page = () => (
  <Section n={1} title="Introduction à l’intelligence artificielle" sub="Ce que c’est, ce que ce n’est pas, et où vous la croisez déjà." dur="≈ 1 h 30">
    <SecItem n={1}>Qu’est-ce que l’IA ? Définitions et exemples</SecItem>
    <SecItem n={2}>Comment une machine apprend, comment un LLM écrit</SecItem>
    <SecItem n={3}>IA, automatisation ou robotisation ?</SecItem>
    <SecItem n={4}>Panorama des usages, au quotidien et en entreprise</SecItem>
  </Section>
);
M1_Divider.transition = BLOOM;

// @@PAGES-BEGIN
export const __pages = [GP_Cover, GP_Trainer, GP_Roundtable, GP_Objectives, GP_Program, GP_HowWeWork, GP_Velo, GP_Brief, GP_Quiz0, M1_Divider];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · ACCUEIL (page affichée pendant l'arrivée des participants)

OBJECTIF — Installer un climat chaleureux et poser le cadre : deux jours pour passer de « j'entends parler de l'IA partout » à « je sais où elle m'aide dans mes projets, et où elle ne m'aide pas ».

DIRE — « Bonjour et bienvenue à la formation IA appliquée à la gestion de projet. Pendant deux jours, on va comprendre ce qu'est l'intelligence artificielle, sans jargon, puis l'utiliser pour planifier, suivre et communiquer dans un projet. Aujourd'hui : comprendre et planifier. Demain : automatiser, collaborer, et adopter l'IA de façon responsable. »

Montrer l'animation : « À droite, un plan de projet qui se construit tout seul. Ce n'est pas de la magie : c'est ce qu'on fera ensemble cet après-midi, avec une IA, puis en vérifiant tout. »

LOGISTIQUE — Classe virtuelle : horaire (9 h – 16 h), pauses (10 h 30 et 14 h 30), dîner (12 h – 13 h). Vérifiez son, caméra et clavardage ; demandez à chacun d'ouvrir dès maintenant un assistant d'IA dans un autre onglet ou sur un second écran (un compte gratuit ChatGPT, Gemini, Copilot ou Claude suffit). Évaluation à la fin du jour 2.

TRANSITION — « Avant d'entrer dans le sujet, quelques mots sur moi. »`,
  `⏱ 3 min

OBJECTIF — Établir votre crédibilité et un contrat pédagogique clair.

DIRE — Présentez-vous en 60 à 90 secondes. À PERSONNALISER : votre parcours, les projets que vous avez menés ou accompagnés, et un exemple où l'IA vous a fait gagner du temps (ou vous a joué un tour).

Puis les quatre engagements :
1. Sans jargon — « Vous n'avez besoin d'aucune connaissance technique. Si j'utilise un mot compliqué, arrêtez-moi. »
2. Vos outils — « On travaille avec ce que vous avez déjà : Outlook, Teams, Google, Notion, Trello… ou une version gratuite d'un assistant. »
3. Des modèles réutilisables — « Vous repartez avec des demandes types : plan de projet, compte rendu, rapport d'avancement. »
4. Un regard lucide — « L'IA se trompe. On verra quand, pourquoi, et comment s'en protéger. »

INTERACTION — « Qui a déjà demandé quelque chose à ChatGPT ou à Copilot cette semaine ? » Réponses dans le clavardage (« oui » / « non ») : souvent la majorité. « Parfait, on part de là. »

TRANSITION — « À votre tour maintenant. »`,
  `⏱ 15 min (1 min par personne, ajuster selon la taille du groupe)

OBJECTIF — Connaître le groupe, ses projets et ses irritants, pour adapter les exemples des deux jours.

ANIMATION — Lancez le minuteur. Appelez chaque personne par son prénom (ordre de la liste des participants) ; elle ouvre son micro et répond aux trois questions. Notez dans un document à vous les tâches qui « prennent le plus de temps » : vous y reviendrez au module 2 (cas d'usage) et à l'atelier 2 (mini-projet).

SONDAGE ÉCLAIR — Chacun écrit dans le clavardage le numéro de la ligne qui le décrit (1 à 5). Cliquez une fois la ligne par réponse (le bouton « − » corrige une erreur). Les barres se comparent automatiquement. Variante : le sondage intégré de Teams ou Zoom.

LECTURE DU RÉSULTAT —
• Majorité « jamais / personnel » : prenez votre temps au module 1, multipliez les démonstrations en direct.
• Majorité « au travail / dans mes projets » : accélérez les définitions, insistez sur les outils intégrés et la vérification.
• Quelqu'un répond « Mon équipe a des règles d'usage » : demandez-lui de les partager au module 5.

TRANSITION — « Merci ! Voici ce que je vous propose d'atteindre ensemble. »`,
  `⏱ 2 min

OBJECTIF — Présenter les cinq objectifs officiels comme une progression.

DIRE — « Cinq marches, qui reprennent les objectifs de la formation. »
1. COMPRENDRE — « Ce matin : ce qu'est l'IA, et ce qu'elle fait concrètement dans un projet. »
2. UTILISER — « Cet après-midi : les assistants génériques, ChatGPT, Gemini, Copilot, Claude, et l'IA intégrée dans Notion, ClickUp ou Teams. Atelier : générer un plan de projet. »
3. AUTOMATISER — « Demain matin : comptes rendus, résumés de réunions, suivi des tâches et alertes. »
4. COLLABORER — « Des pratiques d'équipe : bibliothèque de demandes, règles communes. »
5. MAÎTRISER — « Les biais, les erreurs, la confidentialité, et comment embarquer une équipe. »

INTERACTION — « Laquelle de ces marches vous intéresse le plus ? » Deux ou trois réponses rapides suffisent.

TRANSITION — « Voici comment ces deux jours s'organisent. »`,
  `⏱ 2 min

OBJECTIF — Donner de la visibilité sur le déroulement.

DIRE — « Jour 1 : comprendre et planifier. Module 1, l'IA expliquée simplement. Module 2, l'IA dans la gestion de projet : cas d'usage et outils du quotidien. Puis l'atelier 1 : vous générez un plan de projet avec l'IA et vous le vérifiez. »

« Jour 2 : automatiser et adopter. Module 4, comptes rendus, résumés de réunions et suivi des tâches. Module 5, limites, éthique et conduite du changement. Puis l'atelier 2, le gros morceau : un mini-projet complet avec l'IA, que vous présenterez au groupe. »

À SOULIGNER — Les ateliers sont les carrés jaunes (modules 3 et 6). Précisez qu'ils se font en autonomie, chacun sur son poste, avec des points d'étape dans le clavardage.

TRANSITION — « Parlons de la façon dont on va travailler. »`,
  `⏱ 2 min

OBJECTIF — Expliquer les codes visuels et le contrat de participation.

DIRE — « Vous verrez des étiquettes en haut des pages. »
• QCM (violet) — « Vous votez dans le clavardage, je clique la réponse majoritaire, la rétroaction est immédiate. Les mauvaises réponses sont des pièges volontaires. »
• EXERCICE (vert) — « On manipule à l'écran : cartes, glisser-déposer, simulateurs. »
• DÉMO (bleu) — « Je montre en direct, en partage d'écran. »
• ATELIER (jaune) — « Chacun sur son poste, guidé pas à pas, avec un minuteur et un livrable. »

LES TROIS RÈGLES —
1. Questions dans le clavardage, à tout moment ; je les lis aux transitions.
2. « Aucune donnée confidentielle dans les outils pendant la formation. » C'est déjà une bonne pratique : on y reviendra au module 5.
3. Fil rouge : Vélo Fleuve, présenté juste après.

CLASSE VIRTUELLE — Caméra si possible, micro coupé hors échanges. Idéal : deux écrans, ou la formation dans une fenêtre et l'outil d'IA dans l'autre. En atelier, on travaille sur le projet fictif ou sur une version anonymisée du sien.

TRANSITION — « Faisons connaissance avec Vélo Fleuve. »`,
  `⏱ 3 min · FIL ROUGE

OBJECTIF — Ancrer la formation dans un projet concret et transversal, réutilisé dans chaque module et dans les deux ateliers.

DIRE — « Vélo Fleuve est une entreprise fictive, mais réaliste : un fabricant de vélos électriques de Lévis, 180 employés, trois boutiques-ateliers. Les ventes montent, alors la direction ouvre une quatrième boutique à Québec, dans Limoilou. »

Présenter l'équipe (les cartes apparaissent une à une) :
• Karim, chargé de projet. « Il vient de l'atelier. C'est son premier grand projet : il ressemble à beaucoup d'entre vous. »
• Luc, le commanditaire : la date et le budget.
• Julie, RH : huit embauches.
• Maxime, marketing : campagne et portes ouvertes.
• Annie, TI : caisse, inventaire, Wi-Fi, prise de rendez-vous.

INSISTER — Un projet transversal : RH, marketing, TI, opérations. Chacun d'entre vous s'y retrouvera.

TRANSITION — « Regardons le mandat de Karim. »`,
  `⏱ 3 min · FIL ROUGE

OBJECTIF — Poser les données du projet et la question de la formation.

DIRE — « 22 semaines pour ouvrir, le samedi 10 avril. 420 000 $ de budget, travaux compris. Cinq services autour de la table. Huit embauches. »

« Et voici ce qui inquiète Karim. » Lire les quatre irritants : l'échéancier à bâtir, la réunion hebdomadaire et ses comptes rendus, savoir ce qui glisse sans relancer tout le monde, informer chacun à sa façon. « Ces quatre irritants correspondent aux quatre usages de l'IA qu'on verra au module 2 : planifier, suivre, faire rapport, communiquer. »

QUESTION — Pointer l'encadré : « Où l'IA peut-elle faire gagner du temps à Karim, sans lui faire perdre le contrôle ? C'est la question qu'on se posera pendant deux jours. »

INTERACTION — « Lequel de ces quatre irritants vivez-vous en ce moment ? » Réponse dans le clavardage (1 à 4).

TRANSITION — « Testons vos intuitions avant de commencer. »`,
  `⏱ 4 min · QCM À RÉPONSES MULTIPLES

OBJECTIF — Faire émerger les représentations initiales sans juger.

ANIMATION — Lisez la question. Les participants écrivent dans le clavardage les lettres qu'ils retiennent (ex. « A C »). Cochez les options choisies par la majorité, puis « Valider ma sélection ». Cliquez ensuite chaque option pour lire l'explication. Avec →, vous révélez les bonnes réponses, puis l'essentiel.

RÉPONSES — A et C.
• A ✓ — Une première découpe des tâches : l'IA est très bonne pour proposer une structure de départ.
• B ✗ PIÈGE — « L'IA ne connaît ni l'entrepreneur, ni les délais de livraison du fournisseur. Elle propose des durées plausibles, pas des engagements. »
• C ✓ — Le compte rendu : un usage très rentable, à condition de relire.
• D ✗ PIÈGE — « Couper dans le budget, c'est une décision. Elle reste humaine. L'IA peut préparer trois scénarios chiffrés ; Luc tranche. »

MESSAGE CLÉ — L'IA prépare, l'humain décide et vérifie.

TRANSITION — « Mais d'abord : qu'est-ce que c'est, au juste, l'intelligence artificielle ? »`,
  `⏱ 1 min · DÉBUT DU MODULE 1 (≈ 9 h 30)

OBJECTIF — Annoncer le plan du module.

DIRE — « Module 1 : introduction à l'intelligence artificielle. Le but n'est pas de faire de vous des spécialistes, mais que vous compreniez assez bien la machine pour savoir quand lui faire confiance. »

« Au programme : une définition simple et des exemples ; comment une machine apprend et comment un outil comme ChatGPT écrit ses réponses, avec des animations ; la différence entre IA, automatisation et robotisation, trois mots souvent mélangés ; et un panorama des usages, dans votre vie et en entreprise. »

RYTHME — Environ 1 h 30, avec la pause de 10 h 30 vers la page « IA, automatisation, robotisation ».

TRANSITION — « Commençons par une journée ordinaire. »`,
];
// @@NOTES-END
