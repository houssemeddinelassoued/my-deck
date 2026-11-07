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
      <div className={A.in} style={{ marginTop: 30, display: 'inline-flex', alignItems: 'center', gap: 14, padding: '10px 22px', borderRadius: 999, background: C.panel, fontSize: 27, fontWeight: 600, color: C.ink, ...dl(360) }}>
        <Icon name="facade" size={30} color={C.blue} />
        Préparé pour le Groupe Lessard
      </div>
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
      <CovBar label="Transfert" x={0} w={80} row={0} tone="blue" d={700} />
      <CovBar label="Dessins" x={50} w={150} row={1} tone="teal" d={900} />
      <CovBar label="Commande" x={170} w={100} row={2} tone="green" d={1100} />
      <CovBar label="Fabrication" x={230} w={150} row={3} tone="violet" d={1300} />
      <CovBar label="Installation" x={330} w={110} row={4} tone="yellow" d={1500} />
      <div className={A.fade} style={{ position: 'absolute', left: 28, top: 462, fontSize: 21, fontWeight: 600, color: C.coral, lineHeight: '40px', ...dl(1700) }}>
        Bâtiment fermé
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
          Copilot dans vos outils : Outlook, Teams, Word, Excel
        </Pledge>
        <Pledge icon="note" tone="green" d={780}>
          Des modèles de demandes (prompts) pour vos courriels, relances et comptes rendus
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
    <Lede>Une minute par personne, micro ouvert, trois questions. Puis un sondage éclair.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 800, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AskCard n={1} title="Qui êtes-vous ?" sub="Prénom, rôle (chargé de projet, adjointe…), années chez Lessard" d={100} />
      <AskCard n={2} title="Quel projet vous occupe le plus ?" sub="Une phrase : le bâtiment, les systèmes, l’échéance" d={220} />
      <AskCard n={3} title="Qu’est-ce qui vous prend le plus de temps ?" sub="Courriels, relances, comptes rendus, classement…" d={340} />
    </div>
    <Timer id="tour" minutes={15} label="Tour de table" compact cls={A.in} style={{ position: 'absolute', left: 120, top: 770, ...dl(460) }} />
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
      Copilot et les autres assistants pour planifier et rédiger
    </ObjStep>
    <ObjStep i={3} h={500} tone="green" verb="AUTOMATISER" day={2}>
      Comptes rendus de réunion et de visite, tri des courriels, relances
    </ObjStep>
    <ObjStep i={4} h={550} tone="yellow" verb="COLLABORER" day={2}>
      Des pratiques communes entre chargés de projet et adjointes
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
        Copilot au quotidien et bonnes demandes
      </ProgRow>
      <ProgRow t="13:45" n={3} tone="yellow" d={510}>
        Atelier 1 · plan de projet et courriels
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
        Réunions, visites, relances : automatiser
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
        Questions bienvenues, à tout moment
      </RuleChip>
      <RuleChip icon="lock" d={700}>
        Aucune donnée confidentielle dans les outils
      </RuleChip>
      <RuleChip icon="facade" d={800}>
        Fil rouge : le Centre sportif des Méandres
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

// ─── Running case: Centre sportif des Méandres ──────────────────────────────────────────────────────────────────────
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

const GP_Case: Page = () => (
  <Frame mod={0} kind="cas" label="Ouverture · Fil rouge">
    <Title>Notre fil rouge : le Centre sportif des Méandres</Title>
    <Lede>Un projet fictif, mais typique de vos dossiers. Nous le retrouverons dans chaque module.</Lede>
    <div
      className={A.left}
      style={{ position: 'absolute', left: 120, top: 290, width: 540, height: 650, boxSizing: 'border-box', padding: '30px 32px', background: C.card, borderRadius: 'var(--osd-radius)', boxShadow: `${SHADOW}, inset 0 8px 0 ${C.teal}`, display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <IconTile name="facade" tone="teal" size={76} solid />
        <div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.05, color: C.ink }}>Centre sportif des Méandres</div>
          <div style={{ fontSize: 22, color: C.muted }}>Ville de Rivière-Claire · institutionnel</div>
        </div>
      </div>
      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Fact icon="facade">Mur-rideau du hall · 420 m²</Fact>
        <Fact icon="layers">46 fenêtres · 6 portes d’entrée</Fact>
        <Fact icon="sparkles">1 verrière au-dessus de l’accueil</Fact>
        <Fact icon="org">EG : Construction Boréa</Fact>
        <Fact icon="doc">Architecte : Atelier Mercier</Fact>
      </div>
      <Callout title="Le mandat" icon="flag" tone="yellow" size={25} style={{ marginTop: 'auto', padding: '16px 22px' }}>
        Concevoir, fabriquer et installer l’enveloppe en aluminium et verre.
      </Callout>
    </div>
    <div style={{ position: 'absolute', left: 700, top: 290, width: 1100, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <CastCard id="mathieu" d={200}>
        Suit 13 projets en parallèle, dont celui-ci. Reçoit plus de 80 courriels par jour.
      </CastCard>
      <CastCard id="helene" d={320}>
        Veut voir chaque vendredi où en est chaque projet, sans fouiller.
      </CastCard>
      <CastCard id="nadia" d={440}>
        Reçoit les transferts de Mathieu, fait les suivis, classe les documents.
      </CastCard>
      <CastCard id="eric" d={560}>
        A vendu le contrat. Transmet la soumission, les exclusions et ses promesses.
      </CastCard>
      <CastCard id="patrice" d={680}>
        Prend les relevés au chantier, dirige la pose, signale les déficiences.
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
    <Title>Le projet des Méandres en quatre chiffres</Title>
    <Lede>Éric a transmis le dossier lundi. Mathieu doit le lancer… entre douze autres projets.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 290, width: 1680, display: 'flex', gap: 28 }}>
      <KeyNum value="27 sem." label="avant le bâtiment fermé, le vendredi 14 mai" tone="blue" d={100} />
      <KeyNum value="1,2 M$" label="de contrat pour le lot enveloppe" tone="green" d={220} />
      <KeyNum value="8 sem." label="de délai pour le verre, une fois commandé" tone="yellow" d={340} />
      <KeyNum value="13" label="projets suivis par Mathieu en même temps" tone="violet" d={460} />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 560, width: 1000 }}>
      <Eyebrow cls={A.in} c={C.coral} style={dl(560)}>
        Ce qui inquiète Mathieu
      </Eyebrow>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Pain icon="calendar" d={640}>
          Tenir l’échéancier : dessins d’atelier, verre, usine, pose
        </Pain>
        <Pain icon="mail" d={760}>
          80 courriels par jour : quoi traiter, transférer à Nadia, classer ?
        </Pain>
        <Pain icon="chat" d={880}>
          Réunions de chantier et visites : des comptes rendus chaque semaine
        </Pain>
        <Pain icon="bell" d={1000}>
          Relancer l’architecte, le verrier et l’EG, sans y passer ses matinées
        </Pain>
      </div>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1200, top: 560, width: 600, ...dl(1100) }}>
      <Callout title="Notre question pour 2 jours" icon="sparkles" tone="blue" size={28} style={{ padding: '26px 30px' }}>
        Où l’IA peut-elle faire gagner du temps à Mathieu et à Nadia, sans leur faire perdre le contrôle de leurs projets ?
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
      q="Pour Mathieu, que peut faire l’IA dès aujourd’hui ?"
      explain="L’IA accélère la préparation : résumés, brouillons, comptes rendus. Mais elle ne connaît ni les engagements pris ni la réalité du chantier. Mathieu reste responsable de ce qui sort : c’est le fil de ces 2 jours."
    >
      <Opt why="Piège ! L’IA ne sait pas ce que le verrier a réellement en usine. Elle propose des délais plausibles, pas des engagements.">
        Garantir la date de livraison du verre
      </Opt>
      <Opt ok why="Oui : collé dans Copilot, un fil de 25 courriels devient en une minute un résumé des demandes, des réponses et de ce qui reste ouvert.">
        Résumer un long fil de courriels avec l’entrepreneur général
      </Opt>
      <Opt why="Piège ! Accepter un avis de modification engage Lessard : c’est une décision humaine. L’IA peut comparer le prix au devis, pas trancher.">
        Accepter seule un avis de modification de 18 000 $
      </Opt>
      <Opt ok why="Oui : à partir des faits donnés par Mathieu (dessins envoyés le 23 novembre, toujours pas de retour), elle propose une relance polie et précise. Mathieu relit avant d’envoyer.">
        Rédiger une relance à l’architecte pour les dessins d’atelier
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
export const __pages = [GP_Cover, GP_Trainer, GP_Roundtable, GP_Objectives, GP_Program, GP_HowWeWork, GP_Case, GP_Brief, GP_Quiz0, M1_Divider];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · ACCUEIL (page affichée pendant l'arrivée des participants)

OBJECTIF — Installer un climat chaleureux et poser le cadre : deux jours pour passer de « j'entends parler de l'IA partout » à « je sais où elle m'aide dans mes projets, et où elle ne m'aide pas ».

DIRE — « Bonjour et bienvenue. Cette formation a été préparée pour l'équipe de gestion de projet du Groupe Lessard : chargés de projet et adjointes. Pendant deux jours, on va comprendre ce qu'est l'intelligence artificielle, sans jargon, puis l'utiliser sur ce qui vous prend du temps : les courriels, les relances, les comptes rendus de réunion et de visite, l'échéancier. Aujourd'hui : comprendre et planifier. Demain : automatiser, collaborer, et adopter l'IA de façon responsable. »

Montrer l'animation : « À droite, l'échéancier d'un lot d'enveloppe : transfert des ventes, dessins d'atelier, commande, fabrication, installation, jusqu'au bâtiment fermé. On le construira cet après-midi avec l'IA, puis on vérifiera tout. »

LOGISTIQUE — Classe virtuelle : horaire (9 h – 16 h), pauses (10 h 30 et 14 h 30), dîner (12 h – 13 h). Vérifiez son, caméra et Chat ; demandez à chacun d'ouvrir dès maintenant Copilot (copilot.microsoft.com avec le compte Lessard, ou le bouton Copilot dans Outlook) dans un autre onglet ou sur un second écran. Ceux qui ont un compte Claude peuvent l'ouvrir aussi. Évaluation à la fin du jour 2.

TRANSITION — « Avant d'entrer dans le sujet, quelques mots sur moi. »`,
  `⏱ 3 min

OBJECTIF — Établir votre crédibilité et un contrat pédagogique clair.

DIRE — Présentez-vous en 60 à 90 secondes. À PERSONNALISER : votre parcours, les projets que vous avez menés ou accompagnés, et un exemple où l'IA vous a fait gagner du temps (ou vous a joué un tour).

Puis les quatre engagements :
1. Sans jargon — « Vous n'avez besoin d'aucune connaissance technique. Si j'utilise un mot compliqué, arrêtez-moi. »
2. Vos outils — « On travaille avec Copilot, celui de votre compte Microsoft 365, dans Outlook, Teams, Word et Excel. Je montrerai aussi Claude, puisque certains d'entre vous y ont accès, et on parlera de Smartsheet, Procore et Bluebeam. »
3. Des modèles réutilisables — « Vous repartez avec des demandes types : relance, tri de courriels, compte rendu de réunion, rapport de visite. »
4. Un regard lucide — « L'IA se trompe. On verra quand, pourquoi, et comment s'en protéger. »

INTERACTION — « Qui a déjà demandé quelque chose à Copilot ou à ChatGPT cette semaine ? » Réponses à voix haute. Le questionnaire préalable indique que tout le monde connaît Copilot et ChatGPT : « Parfait, on part de là. »

TRANSITION — « À votre tour maintenant. »`,
  `⏱ 15 min (1 min par personne, ajuster selon la taille du groupe)

OBJECTIF — Connaître le groupe, ses projets et ses irritants, pour adapter les exemples des deux jours.

ANIMATION — Lancez le minuteur. Appelez chaque personne par son prénom (ordre de la liste des participants) ; elle ouvre son micro et répond aux trois questions. Notez dans un document à vous les tâches qui « prennent le plus de temps » : vous y reviendrez au module 2 (cas d'usage) et à l'atelier 2 (mini-projet sur un vrai dossier).

CE QUE LE QUESTIONNAIRE A DÉJÀ DIT (3 réponses) — Suivis automatiques auprès des clients, rédaction de documents, comptes rendus de réunion, gestion des priorités, classement, remplacement de pages dans la voûte. Outils : Office, Outlook, Excel, Smartsheet, Bluebeam, Autodesk, Procore, Epicor Kinetic. Citez-les : « Vous m'avez parlé de… : on va le traiter. »

SONDAGE ÉCLAIR — Chacun annonce à voix haute le numéro de la ligne qui le décrit (1 à 5). Cliquez une fois la ligne par réponse (le bouton « − » corrige une erreur). Variante : le sondage intégré de Teams.

LECTURE DU RÉSULTAT — Le questionnaire montre des niveaux très différents (de « débutant total » à « avancé »).
• Majorité « jamais / personnel » : prenez votre temps au module 1, multipliez les démonstrations en direct.
• Majorité « au travail / dans mes projets » : accélérez les définitions, insistez sur Copilot dans Outlook et Teams, et sur la vérification.
• Repérez les utilisateurs avancés : proposez-leur les variantes « pour aller plus loin » des ateliers.

TRANSITION — « Merci ! Voici ce que je vous propose d'atteindre ensemble. »`,
  `⏱ 2 min

OBJECTIF — Présenter les cinq objectifs officiels comme une progression.

DIRE — « Cinq marches, qui reprennent les objectifs de la formation. »
1. COMPRENDRE — « Ce matin : ce qu'est l'IA, et ce qu'elle fait concrètement dans un projet comme les vôtres. »
2. UTILISER — « Cet après-midi : Copilot et les autres assistants. Atelier : lancer un projet à partir du dossier des ventes et reprendre le contrôle d'une boîte de réception. »
3. AUTOMATISER — « Demain matin : comptes rendus de réunion de chantier, rapports de visite, tri des courriels, relances. »
4. COLLABORER — « Des pratiques communes entre chargés de projet et adjointes : transferts, bibliothèque de demandes, règles. »
5. MAÎTRISER — « Les erreurs, la confidentialité des données de vos clients, et comment adopter l'IA en équipe. »

INTERACTION — « Laquelle de ces marches vous intéresse le plus ? » Deux ou trois réponses rapides suffisent.

TRANSITION — « Voici comment ces deux jours s'organisent. »`,
  `⏱ 2 min

OBJECTIF — Donner de la visibilité sur le déroulement.

DIRE — « Jour 1 : comprendre et planifier. Module 1, l'IA expliquée simplement. Module 2, l'IA dans la gestion de projet : vos cas d'usage et Copilot au quotidien. Puis l'atelier 1 : vous lancez le projet des Méandres avec l'IA et vous triez sa boîte de réception. »

« Jour 2 : automatiser et adopter. Module 4, réunions de chantier, visites, relances et suivi. Module 5, limites, confidentialité et adoption. Puis l'atelier 2 : un mini-projet complet, si possible sur un de vos vrais dossiers, anonymisé. »

À SOULIGNER — Les ateliers sont les carrés jaunes (modules 3 et 6). Ils se font en autonomie, chacun sur son poste, avec des points d'étape réguliers.

TRANSITION — « Parlons de la façon dont on va travailler. »`,
  `⏱ 2 min

OBJECTIF — Expliquer les codes visuels et le contrat de participation.

DIRE — « Vous verrez des étiquettes en haut des pages. »
• QCM (violet) — « Vous votez à voix haute, je clique la réponse majoritaire, la rétroaction est immédiate. Les mauvaises réponses sont des pièges volontaires. »
• EXERCICE (vert) — « On manipule à l'écran : cartes, glisser-déposer, simulateurs. Vous me dites quoi faire, je clique. »
• DÉMO (bleu) — « Je montre en direct, en partage d'écran. »
• ATELIER (jaune) — « Chacun sur son poste, guidé pas à pas, avec un minuteur et un livrable. »

LES TROIS RÈGLES —
1. Questions bienvenues à tout moment, au micro ou par écrit.
2. « Aucune donnée confidentielle dans les outils pendant la formation : pas de nom de client, pas de prix, pas d'adresse. » On y reviendra au module 5.
3. Fil rouge : le Centre sportif des Méandres, présenté juste après.

CLASSE VIRTUELLE — Caméra si possible, micro coupé hors échanges. Idéal : deux écrans, ou la formation dans une fenêtre et Copilot dans l'autre.

TRANSITION — « Faisons connaissance avec le projet des Méandres. »`,
  `⏱ 3 min · FIL ROUGE

OBJECTIF — Ancrer la formation dans un projet qui ressemble aux leurs, réutilisé dans chaque module et dans les deux ateliers.

DIRE — « Le Centre sportif des Méandres est un projet fictif, mais il devrait vous sembler familier : un bâtiment institutionnel pour une ville, un entrepreneur général, un architecte, et votre lot, l'enveloppe en aluminium et verre. Un mur-rideau de 420 m² dans le hall, 46 fenêtres, 6 portes d'entrée et une verrière. »

« Les noms sont inventés : Construction Boréa, Atelier Mercier, Ville de Rivière-Claire. Aucun vrai client n'apparaît dans la formation. »

Présenter l'équipe (les cartes apparaissent une à une) :
• Mathieu, chargé de projet. « Treize projets en parallèle, plus de 80 courriels par jour. Il devrait ressembler à beaucoup d'entre vous. »
• Hélène, directrice de projets : chaque vendredi, elle veut savoir où en est chaque projet.
• Nadia, adjointe : elle reçoit les transferts, fait les suivis, classe les documents.
• Éric, aux ventes : il a vendu le contrat et transmet le dossier, avec ses exclusions et ses promesses.
• Patrice, contremaître : relevés au chantier, pose, déficiences.

INSISTER — Tout le cycle est là : de la vente à l'installation et au service après-vente. « Les adjointes sont des personnages à part entière : plusieurs exercices se font de leur point de vue. »

TRANSITION — « Regardons le dossier que Mathieu vient de recevoir. »`,
  `⏱ 3 min · FIL ROUGE

OBJECTIF — Poser les données du projet et la question de la formation.

DIRE — « 27 semaines avant le bâtiment fermé, le vendredi 14 mai : c'est la date à laquelle l'EG veut l'enveloppe étanche pour lancer les finitions intérieures. 1,2 million de dollars de contrat. 8 semaines de délai pour le verre, une fois la commande passée, donc une commande qui dépend de l'approbation des dessins d'atelier. Et 13 projets suivis par Mathieu en même temps. »

« Voici ce qui inquiète Mathieu. » Lire les quatre irritants : l'échéancier en cascade, le volume de courriels, les comptes rendus de réunion et de visite, les relances. « Ces quatre irritants viennent du questionnaire que vous avez rempli, et du cadrage avec votre direction. Ils correspondent aux quatre usages qu'on verra au module 2 : planifier, suivre, faire rapport, communiquer. »

QUESTION — Pointer l'encadré : « Où l'IA peut-elle faire gagner du temps à Mathieu et à Nadia, sans leur faire perdre le contrôle ? C'est la question qu'on se posera pendant deux jours. »

INTERACTION — « Lequel de ces quatre irritants vivez-vous le plus ? » Réponses à voix haute (1 à 4).

TRANSITION — « Testons vos intuitions avant de commencer. »`,
  `⏱ 4 min · QCM À RÉPONSES MULTIPLES

OBJECTIF — Faire émerger les représentations initiales sans juger.

ANIMATION — Lisez la question. Les participants annoncent les lettres qu'ils retiennent (ex. « B et D »). Cochez les options choisies par la majorité, puis « Valider ma sélection ». Cliquez ensuite chaque option pour lire l'explication. Avec →, vous révélez les bonnes réponses, puis l'essentiel.

RÉPONSES — B et D.
• A ✗ PIÈGE — « L'IA ne voit pas l'usine du verrier. Elle propose des délais plausibles, pas des engagements. »
• B ✓ — Résumer un long fil de courriels : un des usages les plus rentables pour vous.
• C ✗ PIÈGE — « Accepter un avis de modification, c'est engager Lessard. L'IA peut comparer le prix demandé au contrat et préparer la réponse ; Mathieu, et souvent Hélène, décident. »
• D ✓ — Une relance précise, à partir des faits que Mathieu fournit. Il relit avant d'envoyer.

MESSAGE CLÉ — L'IA prépare, l'humain décide et vérifie.

TRANSITION — « Mais d'abord : qu'est-ce que c'est, au juste, l'intelligence artificielle ? »`,
  `⏱ 1 min · DÉBUT DU MODULE 1 (≈ 9 h 30)

OBJECTIF — Annoncer le plan du module.

DIRE — « Module 1 : introduction à l'intelligence artificielle. Le but n'est pas de faire de vous des spécialistes, mais que vous compreniez assez bien la machine pour savoir quand lui faire confiance. »

« Au programme : une définition simple et des exemples ; comment une machine apprend et comment un outil comme Copilot écrit ses réponses, avec des animations ; la différence entre IA, automatisation et robotisation, trois mots souvent mélangés ; et un panorama des usages, dans votre vie et dans une entreprise comme Lessard. »

RYTHME — Environ 1 h 30, avec la pause de 10 h 30 vers la page « IA, automatisation, robotisation ».

TRANSITION — « Commençons par une journée ordinaire. »`,
];
// @@NOTES-END
