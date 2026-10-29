// ─── Cover ──────────────────────────────────────────────────────────────────
// An editor where the assistant's suggestion fades in as ghost text.
const DV_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <img src={logoStack} alt="Technologia" className={A.fade} style={{ position: 'absolute', left: 112, top: 78, height: 150, display: 'block' }} />
    <div style={{ position: 'absolute', left: 120, top: 318, width: 900 }}>
      <Eyebrow cls={A.in} size={28}>
        Formation IA132 · 2 jours
      </Eyebrow>
      <h1
        className={A.in}
        style={{ margin: '18px 0 0', fontFamily: display, fontWeight: 700, fontSize: 118, lineHeight: 1.0, letterSpacing: '-0.01em', color: C.ink, ...dl(120) }}
      >
        IA pour
        <br />
        développeurs
      </h1>
      <p className={A.in} style={{ margin: '26px 0 0', fontSize: 36, lineHeight: 1.3, color: C.soft, ...dl(240) }}>
        Code assisté et programmation intelligente : coder, tester, documenter et concevoir avec un assistant d’IA
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

    <Squares s={250} x={1470} y={660} delay={200} />
    <CodeDark cls={A.in} file="reservations.py" lang="python" size={23} style={{ position: 'absolute', left: 1060, top: 250, width: 740, ...dl(300) }}>
      <Kw>def</Kw> <Fn>cout</Fn>(resa: <Ty>Reservation</Ty>) -&gt; <Ty>Decimal</Ty>:{'\n'}
      {'    '}
      <St>"""Coût, arrondi au cent supérieur."""</St>
      {'\n'}
      {'    '}heures = <Fn>duree_heures</Fn>(resa){'\n'}
      <span className={A.fade} style={dl(1300)}>
        <Ghost>{'    '}montant = resa.tarif * heures</Ghost>
        {'\n'}
        <Ghost>{'    '}return arrondir(montant, cents=2)</Ghost>
      </span>
      <span className={A.blink} style={{ display: 'inline-block', width: 3, height: 30, background: C.yellow, verticalAlign: 'middle', marginLeft: 2 }} />
    </CodeDark>
    <div className={A.fade} style={{ position: 'absolute', left: 1060, top: 560, display: 'flex', alignItems: 'center', gap: 14, ...dl(1700) }}>
      <span style={{ fontFamily: mono, fontSize: 20, color: C.muted }}>Tab pour accepter</span>
      <span style={{ fontFamily: mono, fontSize: 20, color: C.faint }}>·</span>
      <span style={{ fontFamily: mono, fontSize: 20, color: C.muted }}>Échap pour refuser</span>
    </div>
    <div className={A.float} style={{ position: 'absolute', left: 1110, top: 660, width: 150, height: 150 }}>
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

const DV_Trainer: Page = () => (
  <Frame mod={0}>
    <Portrait x={210} y={300} w={280} />
    <div style={{ position: 'absolute', left: 720, top: 250, width: 1080 }}>
      <Eyebrow cls={A.in}>Votre formateur</Eyebrow>
      <div className={A.in} style={{ marginTop: 10, fontFamily: display, fontWeight: 700, fontSize: 84, lineHeight: 1.05, color: C.ink, ...dl(100) }}>
        {AUTHOR}
      </div>
      <div className={A.in} style={{ marginTop: 8, fontSize: 30, fontWeight: 600, color: C.blue, ...dl(200) }}>
        Développeur Java et Python depuis 18 ans · ingénieur IT, doctorant en IA
      </div>
      <div className={A.grow} style={{ marginTop: 30, height: 3, width: 1080, background: C.rule, ...dl(300) }} />
      <Eyebrow cls={A.in} c={C.muted} style={{ marginTop: 30, ...dl(380) }}>
        Mes engagements pour ces 2 jours
      </Eyebrow>
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Pledge icon="code" tone="blue" d={500}>
          Du vrai code, dans votre IDE, dès la première heure
        </Pledge>
        <Pledge icon="tool" tone="teal" d={640}>
          Des outils comparés honnêtement : Copilot, Cursor, JetBrains, Claude Code
        </Pledge>
        <Pledge icon="check" tone="green" d={780}>
          12 labs indépendants, avec des tests qui disent quand c’est fini
        </Pledge>
        <Pledge icon="shieldCheck" tone="yellow" d={920}>
          Un regard lucide : quand l’IA accélère… et quand elle vous ralentit
        </Pledge>
      </div>
    </div>
  </Frame>
);

// ─── How we work (virtual classroom) ────────────────────────────────────────
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
    style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 24px', background: C.panel, borderRadius: 14, fontSize: 25, lineHeight: 1.3, color: C.ink, ...dl(d) }}
  >
    <Icon name={icon} size={34} color={C.blue} />
    <span>{children}</span>
  </div>
);

const DV_HowWeWork: Page = () => (
  <Frame mod={0}>
    <Title>Comment nous allons travailler</Title>
    <Lede>Une formation par la pratique : on montre, on essaie, on mesure, on discute.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 390px)', columnGap: 40 }}>
      <ActCard kind="qcm" icon="check" title="Votez, vérifiez" d={100}>
        Vous annoncez A, B, C ou D ; la rétroaction est immédiate. Les pièges sont voulus.
      </ActCard>
      <ActCard kind="demo" icon="play" title="Observez" d={220}>
        Démonstrations en direct dans l’IDE, avec de vraies demandes… et de vrais ratés.
      </ActCard>
      <ActCard kind="exercice" icon="hand" title="Manipulez" d={340}>
        Cartes à retourner, étiquettes à placer, code où repérer les failles.
      </ActCard>
      <ActCard kind="lab" icon="code" title="Codez" d={460}>
        12 labs individuels, en Python ou en TypeScript, avec un minuteur et des tests.
      </ActCard>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 700, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 24 }}>
      <RuleChip icon="chat" d={600}>
        Questions bienvenues, à tout moment
      </RuleChip>
      <RuleChip icon="lock" d={700}>
        Aucun code de votre entreprise dans les outils
      </RuleChip>
      <RuleChip icon="layers" d={800}>
        Labs indépendants : pas de fil rouge
      </RuleChip>
    </div>
    <Callout
      cls={A.in}
      title="Classe virtuelle"
      icon="video"
      tone="blue"
      size={26}
      style={{ position: 'absolute', left: 120, top: 830, width: 1680, padding: '14px 26px', ...dl(900) }}
    >
      Caméra si possible, micro coupé hors échanges. Idéal : deux écrans, la formation d’un côté, votre IDE de l’autre.
    </Callout>
  </Frame>
);

// ─── Round table + poll ─────────────────────────────────────────────────────
const AskCard = ({ n, title, sub, d }: { n: number; title: ReactNode; sub: ReactNode; d: number }) => (
  <div
    className={A.left}
    style={{ boxSizing: 'border-box', height: 128, display: 'flex', alignItems: 'center', gap: 26, padding: '0 30px', background: C.card, borderRadius: 'var(--osd-radius)', boxShadow: SHADOW, ...dl(d) }}
  >
    <Num n={n} size={60} />
    <div>
      <div style={{ fontSize: 31, fontWeight: 600, lineHeight: 1.25, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 24, lineHeight: 1.35, color: C.muted }}>{sub}</div>
    </div>
  </div>
);

const DV_Roundtable: Page = () => (
  <Frame mod={0} label="Ouverture · Faisons connaissance">
    <Title>Tour de table</Title>
    <Lede>Une minute chacun, micro ouvert, trois questions. Puis un sondage éclair.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 800, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AskCard n={1} title="Qui êtes-vous ?" sub="Prénom, rôle, équipe, langages du quotidien" d={100} />
      <AskCard n={2} title="Avec quel IDE et quel assistant ?" sub="VS Code, IntelliJ, PyCharm… Copilot, Cursor, aucun ?" d={220} />
      <AskCard n={3} title="Votre attente n° 1 pour ces 2 jours ?" sub="Tests, débogage, revue, architecture, agents…" d={340} />
    </div>
    <Timer id="tour" minutes={15} label="Tour de table" compact cls={A.in} style={{ position: 'absolute', left: 120, top: 760, ...dl(460) }} />
    <div style={{ position: 'absolute', left: 990, top: 280, width: 810 }}>
      <Eyebrow cls={A.in} c={C.violet} style={dl(200)}>
        Sondage éclair · votre usage aujourd’hui
      </Eyebrow>
      <Hint cls={A.in} style={{ marginTop: 8, ...dl(260) }}>
        Répondez par le numéro de la ligne
      </Hint>
      <Poll cls={A.in} style={{ marginTop: 22, ...dl(360) }}>
        <PollRow id="none" icon="eye" tone="grey" label="1 · Je n’utilise pas d’assistant de code" />
        <PollRow id="chat" icon="chat" tone="blue" label="2 · Un chat à côté (ChatGPT…), en copier-coller" />
        <PollRow id="compl" icon="code" tone="teal" label="3 · La complétion dans mon IDE, tous les jours" />
        <PollRow id="agent" icon="bot" tone="green" label="4 · Le mode agent, qui modifie plusieurs fichiers" />
        <PollRow id="team" icon="users" tone="violet" label="5 · Mon équipe a des règles d’usage écrites" />
      </Poll>
    </div>
  </Frame>
);

// ─── Objectives: a rising staircase ─────────────────────────────────────────
const ObjStep = ({ i, h, tone, verb, day, children }: { i: number; h: number; tone: Tone; verb: string; day: string; children: ReactNode }) => (
  <div style={{ position: 'absolute', left: 120 + (i - 1) * 336, top: 960 - h, width: 316, height: h }}>
    <div className={A.growY} style={{ position: 'absolute', inset: 0, borderRadius: 18, background: C.card, boxShadow: `${SHADOW}, inset 0 8px 0 ${STRONG[tone]}`, ...dl(i * 120) }} />
    <div className={A.in} style={{ position: 'relative', padding: '32px 26px 0', ...dl(420 + i * 140) }}>
      <Num n={i} tone={tone} size={52} />
      <div style={{ marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 38, lineHeight: 1.05, letterSpacing: '0.03em', color: C.ink }}>{verb}</div>
      <div style={{ marginTop: 10, fontSize: 24, lineHeight: 1.38, color: C.soft }}>{children}</div>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 26, bottom: 24, ...dl(600 + i * 140) }}>
      <Tag tone={day.startsWith('Jour 1') ? 'blue' : 'green'} size={20}>
        {day}
      </Tag>
    </div>
  </div>
);

const DV_Objectives: Page = () => (
  <Frame mod={0}>
    <Title>Ce que vous saurez faire</Title>
    <Lede>Les cinq objectifs de la formation, du code à l’architecture.</Lede>
    <ObjStep i={1} h={420} tone="blue" verb="GÉNÉRER" day="Jour 1 · M2">
      Et refactoriser du code avec des prompts efficaces
    </ObjStep>
    <ObjStep i={2} h={470} tone="coral" verb="CORRIGER" day="Jour 1 · M3">
      Détecter, corriger, optimiser… et valider ce que l’IA propose
    </ObjStep>
    <ObjStep i={3} h={520} tone="violet" verb="DOCUMENTER" day="Jour 2 · M4">
      Automatiser la documentation et les revues de code
    </ObjStep>
    <ObjStep i={4} h={570} tone="green" verb="TESTER" day="Jour 2 · M5">
      Tests unitaires et d’intégration, intégrés à la CI/CD
    </ObjStep>
    <ObjStep i={5} h={620} tone="yellow" verb="CONCEVOIR" day="Jour 2 · M6">
      Architecture, estimation et planification avec l’IA
    </ObjStep>
  </Frame>
);

// ─── Programme ──────────────────────────────────────────────────────────────
const ProgRow = ({ t, n, icon, tone = 'blue', d, children }: { t: string; n?: number; icon?: IconName; tone?: Tone; d: number; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 18, height: 46, ...dl(d) }}>
    <span style={{ width: 76, fontFamily: mono, fontSize: 21, color: C.muted }}>{t}</span>
    {n ? (
      <Num n={pad(n)} tone={tone} size={38} />
    ) : (
      <span style={{ width: 38, display: 'flex', justifyContent: 'center' }}>
        <Icon name={icon ?? 'star'} size={28} color={C.muted} />
      </span>
    )}
    <span style={{ fontSize: 26, fontWeight: 500, color: C.ink }}>{children}</span>
  </div>
);

const ProgBreak = ({ t, d, children }: { t: string; d: number; children: ReactNode }) => (
  <div className={A.fade} style={{ display: 'flex', alignItems: 'center', gap: 18, height: 30, ...dl(d) }}>
    <span style={{ width: 76, fontFamily: mono, fontSize: 19, color: C.faint }}>{t}</span>
    <span style={{ width: 38, height: 2, background: C.rule }} />
    <span style={{ fontSize: 22, fontStyle: 'italic', color: C.muted }}>{children}</span>
  </div>
);

const DayCol = ({ x, day, sub, now, children }: { x: number; day: number; sub: string; now: boolean; children: ReactNode }) => (
  <div
    className={A.in}
    style={{
      position: 'absolute',
      left: x,
      top: 210,
      width: 816,
      boxSizing: 'border-box',
      padding: '24px 34px 22px',
      background: C.card,
      borderRadius: 'var(--osd-radius)',
      boxShadow: now ? `0 0 0 3px ${C.blue}, ${SHADOW}` : SHADOW,
      ...dl(day === 1 ? 0 : 150),
    }}
  >
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 10 }}>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 44, color: now ? C.blue : C.ink }}>Jour {day}</span>
      <span style={{ fontSize: 25, color: C.muted }}>{sub}</span>
      {now ? (
        <Tag tone="blue" size={20} style={{ marginLeft: 'auto' }}>
          Aujourd’hui
        </Tag>
      ) : null}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>{children}</div>
  </div>
);

const ProgramCols = ({ today }: { today: number }) => (
  <>
    <DayCol x={120} day={1} sub="Écrire et corriger du code" now={today === 1}>
      <ProgRow t="9:00" icon="users" d={150}>
        Accueil, tour de table, lab 00
      </ProgRow>
      <ProgRow t="9:30" n={1} d={200}>
        Panorama des assistants · lab 01
      </ProgRow>
      <ProgBreak t="10:30" d={250}>
        Pause
      </ProgBreak>
      <ProgRow t="10:45" n={2} d={300}>
        Génération de code · lab 02
      </ProgRow>
      <ProgBreak t="12:00" d={350}>
        Dîner
      </ProgBreak>
      <ProgRow t="13:00" n={2} d={400}>
        Refactorisation · lab 03
      </ProgRow>
      <ProgRow t="13:30" n={3} d={450}>
        Débogage avec l’IA · lab 04
      </ProgRow>
      <ProgBreak t="14:30" d={500}>
        Pause
      </ProgBreak>
      <ProgRow t="14:45" n={3} d={550}>
        Optimisation · lab 05 · limites
      </ProgRow>
      <ProgRow t="15:40" icon="star" d={600}>
        Bilan du jour 1
      </ProgRow>
    </DayCol>
    <DayCol x={984} day={2} sub="Qualité, conception, projet" now={today === 2}>
      <ProgRow t="9:00" icon="loop" d={300}>
        Réactivation
      </ProgRow>
      <ProgRow t="9:10" n={4} d={350}>
        Documentation et revue · labs 06, 07
      </ProgRow>
      <ProgBreak t="10:30" d={400}>
        Pause
      </ProgBreak>
      <ProgRow t="10:45" n={5} d={450}>
        Tests, charge et CI/CD · labs 08, 09
      </ProgRow>
      <ProgBreak t="12:00" d={500}>
        Dîner
      </ProgBreak>
      <ProgRow t="13:15" n={6} d={550}>
        Architecture et planification · lab 10
      </ProgRow>
      <ProgBreak t="14:15" d={600}>
        Pause
      </ProgBreak>
      <ProgRow t="14:30" n={7} tone="yellow" d={650}>
        Projet final avec un agent · lab 11
      </ProgRow>
      <ProgRow t="15:30" icon="flag" d={700}>
        Présentations, intégration en entreprise
      </ProgRow>
    </DayCol>
  </>
);

const DV_Program: Page = () => (
  <Frame mod={0}>
    <Title>Programme des 2 jours</Title>
    <ProgramCols today={1} />
  </Frame>
);

// ─── The labs repository ────────────────────────────────────────────────────
const RepoStep = ({ n, title, d, children }: { n: number; title: ReactNode; d: number; children: ReactNode }) => (
  <div className={A.left} style={{ display: 'flex', gap: 20, ...dl(d) }}>
    <Num n={n} size={46} />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 28, fontWeight: 600, color: C.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 23, lineHeight: 1.4, color: C.soft }}>{children}</div>
    </div>
  </div>
);

const DV_Repo: Page = () => (
  <Frame mod={0} kind="lab" label="Ouverture · Les labs">
    <Title>Le dépôt des labs</Title>
    <Lede>Un seul dépôt GitHub pour les 12 labs. Je colle le lien dans le clavardage.</Lede>
    <div className={A.pop} style={{ position: 'absolute', left: 120, top: 268, ...dl(100) }}>
      <RepoChip size={34} />
    </div>
    <div style={{ position: 'absolute', left: 120, top: 400, width: 900, display: 'flex', flexDirection: 'column', gap: 28 }}>
      <RepoStep n={1} title="Forkez le dépôt" d={250}>
        Bouton Fork : votre copie, où vous pousserez et ouvrirez vos pull requests.
      </RepoStep>
      <RepoStep n={2} title="Clonez votre fork, vérifiez votre poste" d={370}>
        <span style={{ fontFamily: mono, fontSize: 21 }}>python scripts/verifier_env.py</span>
      </RepoStep>
      <RepoStep n={3} title="Ouvrez le guide PDF des ateliers" d={490}>
        Une fiche par lab : objectif, étapes, livrable, pièges. Aussi dans le bouton « Labs ».
      </RepoStep>
      <RepoStep n={4} title="Choisissez votre langage" d={610}>
        Chaque lab existe en Python (pytest) et en TypeScript (Node 22.18+, sans installation).
      </RepoStep>
    </div>
    <CodeDark cls={A.right} file="ia132-labs/" size={21} style={{ position: 'absolute', left: 1100, top: 400, width: 700, ...dl(400) }}>
      <Fn>labs/</Fn>
      {'\n'}
      {'  '}lab04-debogage/{'\n'}
      {'    '}
      <St>README.md</St>
      {'          '}
      <Cm># la fiche</Cm>
      {'\n'}
      {'    '}rapport-incidents.md{'\n'}
      {'    python/            '}
      <Cm># code + tests</Cm>
      {'\n'}
      {'    typescript/        '}
      <Cm># code + tests</Cm>
      {'\n'}
      <Fn>scripts/</Fn>verifier_env.py{'\n'}
      <Fn>.github/</Fn>copilot-instructions.md{'\n'}
      requirements-dev.txt{'  '}package.json
    </CodeDark>
  </Frame>
);

// ─── Lab map: the 12 labs, their module and objective ───────────────────────
const LabTile = ({ n, mod, tone, title, dur, d, children }: { n: string; mod: string; tone: Tone; title: string; dur: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ boxSizing: 'border-box', height: 218, background: C.card, borderRadius: 16, boxShadow: `${SHADOW_SM}, inset 0 6px 0 ${STRONG[tone]}`, padding: '18px 20px 14px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 38, lineHeight: 1, color: tone === 'yellow' ? C.amber : STRONG[tone] }}>{n}</span>
      <span style={{ fontSize: 18, fontWeight: 600, color: C.muted, letterSpacing: '0.04em' }}>{mod}</span>
      <span style={{ marginLeft: 'auto', fontFamily: mono, fontSize: 17, color: C.muted }}>{dur}</span>
    </div>
    <div style={{ marginTop: 8, fontSize: 23, fontWeight: 700, lineHeight: 1.2, color: C.ink }}>{title}</div>
    <div style={{ marginTop: 6, fontSize: 19, lineHeight: 1.35, color: C.soft }}>{children}</div>
  </div>
);

const DV_LabMap: Page = () => (
  <Frame mod={0} kind="lab" label="Ouverture · Les labs">
    <Title>12 labs, 7 modules, un objectif chacun</Title>
    <div style={{ position: 'absolute', left: 120, top: 200, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(4, 405px)', columnGap: 20, rowGap: 18 }}>
      <LabTile n="00" mod="OUVERTURE" tone="grey" title="Mise en route" dur="10 min" d={60}>
        Dépôt cloné, tests verts, assistant actif
      </LabTile>
      <LabTile n="01" mod="MODULE 1" tone="blue" title="Les 4 modes" dur="20 min" d={120}>
        Complétion, chat, édition, agent : lequel choisir
      </LabTile>
      <LabTile n="02" mod="MODULE 2" tone="teal" title="Générer depuis une spec" dur="25 min" d={180}>
        Prompt structuré, tests comme critère d’acceptation
      </LabTile>
      <LabTile n="03" mod="MODULE 2" tone="teal" title="Refactoriser l’hérité" dur="25 min" d={240}>
        Petites étapes, tests de caractérisation
      </LabTile>
      <LabTile n="04" mod="MODULE 3" tone="coral" title="Chasse aux bogues" dur="25 min" d={300}>
        Reproduire, expliquer, corriger, prouver
      </LabTile>
      <LabTile n="05" mod="MODULE 3" tone="coral" title="Optimiser et mesurer" dur="20 min" d={360}>
        De O(n²) à O(n), gain prouvé par la mesure
      </LabTile>
      <LabTile n="06" mod="MODULE 4" tone="violet" title="Documentation" dur="20 min" d={420}>
        Docstrings conformes, exemples vérifiés
      </LabTile>
      <LabTile n="07" mod="MODULE 4" tone="violet" title="Revue de code" dur="25 min" d={480}>
        IA + analyseur, tri des constats, failles corrigées
      </LabTile>
      <LabTile n="08" mod="MODULE 5" tone="green" title="Tests unitaires" dur="30 min" d={540}>
        Couverture des branches et mutants tués
      </LabTile>
      <LabTile n="09" mod="MODULE 5" tone="green" title="Intégration, charge, CI" dur="35 min" d={600}>
        Vraie API, objectif de service, GitHub Actions
      </LabTile>
      <LabTile n="10" mod="MODULE 6" tone="yellow" title="Architecture" dur="35 min" d={660}>
        Diagramme, ADR, backlog, risques, dépendances
      </LabTile>
      <LabTile n="11" mod="MODULE 7" tone="blue" title="Projet final" dur="55 min" d={720}>
        Un outil complet avec un agent, jusqu’à la PR
      </LabTile>
    </div>
  </Frame>
);

// ─── Lab 00 ─────────────────────────────────────────────────────────────────
const L00_Brief: Page = () => (
  <LabBrief
    mod={0}
    n="00"
    title="Mise en route"
    dur="10 min"
    folder="lab00-mise-en-route"
    objective="Un poste prêt pour 2 jours : dépôt cloné, tests qui passent, assistant d’IA actif dans votre IDE."
    cmd={
      <>
        <Pr>pytest labs/lab00-mise-en-route</Pr>
        {'\n'}
        <Ok>2 passed</Ok>
        {'\n'}
        <Pr>npm run test:lab00</Pr>
        {'\n'}
        <Ok>ℹ pass 2</Ok>
      </>
    }
    deliverable="2 tests verts, et un assistant qui cite les dossiers du dépôt dans sa réponse."
  >
    <LabStep n={1} t="2 min" title="Forkez, clonez">
      Votre copie du dépôt, sur votre compte GitHub
    </LabStep>
    <LabStep n={2} t="3 min" title="Vérifiez le poste">
      scripts/verifier_env.py, puis l’environnement Python ou Node
    </LabStep>
    <LabStep n={3} t="2 min" title="Lancez les tests du lab 00">
      Deux tests verts, en Python et/ou en TypeScript
    </LabStep>
    <LabStep n={4} t="3 min" title="Interrogez votre assistant">
      « Résume ce dépôt en 5 lignes, puis liste les labs avec leur objectif. »
    </LabStep>
  </LabBrief>
);

// ─── Warm-up quiz (multi-answer) ────────────────────────────────────────────
const DV_Quiz0: Page = () => (
  <Frame mod={0} kind="qcm" beats={2} label="Ouverture · Point de départ">
    <Title>
      <span style={{ color: C.violet }}>Quiz éclair</span> · Vos intuitions de départ
    </Title>
    <Qcm
      multi
      q="Un assistant de code d’aujourd’hui peut…"
      explain="L’assistant lit, écrit et exécute : il peut lancer vos tests et itérer. Mais il prédit du code plausible, sans garantie. La responsabilité du code fusionné reste la vôtre : c’est le fil de ces 2 jours."
    >
      <Opt ok why="Oui : en mode agent, il lit le dépôt, modifie plusieurs fichiers, lance les tests et corrige jusqu’à ce qu’ils passent.">
        Modifier plusieurs fichiers et lancer les tests lui-même
      </Opt>
      <Opt why="Piège ! Il produit du code plausible, pas prouvé. Des études mesurent des failles dans près d’un code généré sur deux : on y revient au module 3.">
        Garantir qu’un code qui compile est sûr et correct
      </Opt>
      <Opt ok why="Oui : à partir d’une trace d’erreur et du code, il formule des hypothèses de cause racine. À vous de les vérifier.">
        Expliquer une trace d’erreur et proposer une cause
      </Opt>
      <Opt why="Piège ! Il ne connaît ni vos contraintes métier, ni ce que l’équipe a décidé hier, sauf si vous le lui écrivez (instructions de projet).">
        Connaître les conventions de votre équipe sans qu’on les lui donne
      </Opt>
    </Qcm>
  </Frame>
);

// ─── Module 1 divider ───────────────────────────────────────────────────────
const M1_Divider: Page = () => (
  <Section n={1} title="Panorama des assistants de codage" sub="D’où ils viennent, comment ils fonctionnent, lequel choisir et pour quoi faire." dur="≈ 1 h">
    <SecItem n={1}>Évolution des outils IA pour développeurs</SecItem>
    <SecItem n={2}>GPT-5, Copilot, JetBrains AI, Cursor, Claude Code</SecItem>
    <SecItem n={3}>Complétion, chat, édition, agent : les 4 modes</SecItem>
    <SecItem n={4}>Cas d’usage et bénéfices réels pour les équipes</SecItem>
  </Section>
);
M1_Divider.transition = BLOOM;

// @@PAGES-BEGIN
export const __pages = [DV_Cover, DV_Trainer, DV_HowWeWork, DV_Roundtable, DV_Objectives, DV_Program, DV_Repo, DV_LabMap, L00_Brief, DV_Quiz0, M1_Divider];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · ACCUEIL (page affichée pendant l'arrivée des participants)

OBJECTIF — Poser le cadre : deux jours pour passer de « j'utilise parfois un assistant » à « je sais quand et comment l'utiliser, et comment vérifier ce qu'il produit ».

DIRE — « Bonjour et bienvenue à la formation IA132, IA pour développeurs. Pendant deux jours, on va écrire, corriger, tester, documenter et concevoir du code avec un assistant d'IA, dans votre IDE. »

Montrer l'animation : « À droite, ce que vous verrez souvent : l'assistant propose la suite en gris. Tab pour accepter, Échap pour refuser. Toute la formation tient dans ce geste : accepter en connaissance de cause. »

LOGISTIQUE — Classe virtuelle, 9 h – 16 h, pauses 10 h 30 et 14 h 30 (14 h 15 le jour 2), dîner 12 h – 13 h. Vérifiez son, caméra, partage d'écran. Demandez à chacun d'ouvrir son IDE et un navigateur sur GitHub.

TRANSITION — « Quelques mots sur moi. »`,
  `⏱ 2 min

OBJECTIF — Établir la crédibilité technique et le contrat pédagogique.

DIRE — Présentez-vous en 60 secondes. À PERSONNALISER : vos langages, un projet où un assistant vous a fait gagner une journée… et un où il vous a fait perdre une heure.

Les quatre engagements :
1. « Du vrai code dès la première heure : le lab 00 se fait dans 20 minutes. »
2. « Je ne vends aucun outil. On compare Copilot, Cursor, JetBrains et Claude Code ; prenez celui que vous avez. »
3. « 12 labs indépendants avec des tests : vous saurez objectivement quand c'est fini. »
4. « Un regard lucide : on verra des études où l'IA accélère, et une où elle ralentit des développeurs expérimentés. »

TRANSITION — « Voici comment on va travailler. »`,
  `⏱ 2 min

OBJECTIF — Expliquer les codes visuels et les règles de la classe virtuelle.

DIRE — « Les étiquettes en haut des pages vous disent ce qu'on fait. »
• QCM (violet) — « Vous annoncez votre lettre à voix haute, je clique la réponse majoritaire. »
• DÉMO (bleu) — « Je partage mon IDE. »
• EXERCICE (vert clair) — « On manipule à l'écran : vous me dites où placer chaque étiquette. »
• LAB (vert) — « Chacun sur son poste, minuteur affiché, tests qui valident. »

RÈGLES — Questions à tout moment. Aucun code de votre entreprise dans les outils pendant la formation : tout est fictif dans les labs. Pas de fil rouge : chaque lab est indépendant, vous pourrez les refaire dans n'importe quel ordre.

CLASSE VIRTUELLE — Caméra si possible, micro coupé hors échanges ; deux écrans idéalement.

TRANSITION — « Faisons connaissance. »`,
  `⏱ 15 min (1 min par personne)

OBJECTIF — Connaître le groupe : langages, IDE, outils, attentes. Adapter les démos (Python ou TypeScript ? VS Code ou JetBrains ?).

ANIMATION — Lancez le minuteur. Appelez chaque personne par son prénom, dans l'ordre de la liste des participants ; micro ouvert, trois réponses. Notez les IDE et les langages : faites vos démos dans le plus fréquent.

SONDAGE — Chacun annonce un numéro de 1 à 5. Cliquez la ligne par réponse (« − » corrige).

LECTURE —
• Majorité 1–2 : prenez le temps au module 1 sur la complétion et le contexte.
• Majorité 3–4 : insistez sur la vérification, les instructions de projet et le mode agent.
• Quelqu'un en 5 : demandez-lui de partager ses règles au module 7.

TRANSITION — « Voici ce que vous saurez faire dans deux jours. »`,
  `⏱ 2 min

OBJECTIF — Présenter les cinq objectifs officiels comme une progression.

DIRE — « Cinq marches, qui suivent les objectifs du programme. »
1. GÉNÉRER — « Générer et refactoriser du code avec de bons prompts : module 2. »
2. CORRIGER — « Détecter, corriger, optimiser, en validant : module 3. »
3. DOCUMENTER — « Documentation et revues automatisées : module 4. »
4. TESTER — « Tests unitaires et d'intégration, branchés dans la CI/CD : module 5. »
5. CONCEVOIR — « Architecture, estimation, planification, risques : module 6. »

« Et le module 7 assemble tout dans un projet final avec un agent. »

INTERACTION — « Quelle marche vous intéresse le plus ? Un chiffre. » Deux ou trois réponses.

TRANSITION — « Voici le déroulé. »`,
  `⏱ 2 min

OBJECTIF — Donner de la visibilité sur les deux jours.

DIRE — « Jour 1 : écrire et corriger. Module 1, le panorama. Module 2, générer et refactoriser. Module 3, déboguer, optimiser, et connaître les limites. »

« Jour 2 : la qualité et la conception. Module 4, documentation et revue. Module 5, tests, charge et CI/CD. Module 6, architecture et planification. Puis le module 7 : un projet complet avec un agent, que vous présenterez en partage d'écran. »

À SOULIGNER — Chaque module se termine par un ou deux labs : environ 40 % du temps est de la pratique.

TRANSITION — « Parlons justement des labs. »`,
  `⏱ 3 min · LE DÉPÔT

OBJECTIF — Donner le lien du dépôt et faire forker tout de suite.

ACTION — Collez le lien du dépôt dans le clavardage : https://github.com/houssemeddinelassoued/ia132-labs (à adapter si vous avez publié le dépôt ailleurs). Collez aussi le lien de téléchargement du bouton « Labs » (guide PDF inclus).

DIRE — « Un seul dépôt pour les 12 labs. Forkez-le maintenant : vous aurez votre copie, pour pousser et ouvrir des pull requests, notamment aux labs 09 et 11. »
« Chaque lab a un README qui est aussi sa fiche dans le guide PDF : objectif, point de départ, étapes, livrable, pièges, bonus. »
« Python ou TypeScript, au choix, pour chaque lab. En TypeScript, Node 22.18 ou plus récent suffit : rien à installer. »

TRANSITION — « Voici la carte des 12 labs. »`,
  `⏱ 2 min · CARTE DES LABS

OBJECTIF — Relier chaque lab à son module et à son objectif.

DIRE — « Chaque carte vous donne le numéro du lab, son module, sa durée et son objectif. La couleur est celle du module. »
« Les labs sont indépendants : si vous manquez un lab, ça ne bloque pas le suivant. Et vous pouvez les refaire après la formation, dans l'ordre que vous voulez. »
« Le lab 11 est le projet final : il réutilise tout, avec un agent. »

ASTUCE — Laissez cette page affichée quelques secondes pendant que les participants terminent le fork.

TRANSITION — « On commence tout de suite par le lab 00. »`,
  `⏱ 10 min · LAB 00

OBJECTIF — Que tous les postes soient prêts avant le module 1.

ANIMATION — Laissez 10 minutes. Point d'étape à 5 minutes : « Où en êtes-vous : étape 1, 2, 3 ou 4 ? »

PROBLÈMES FRÉQUENTS —
• Windows : « python » introuvable → « py ».
• Proxy d'entreprise : pip install --proxy.
• Pas de licence Copilot : essai gratuit, ou Cursor / Claude Code / JetBrains AI.
• Node < 22.18 : faire le lab en Python, ou mettre Node à jour.

Si quelqu'un est bloqué plus de 3 minutes : partage d'écran, on règle ensemble. Le reste du groupe peut lire la carte des labs.

TRANSITION — « Tout le monde est prêt ? Testons vos intuitions. »`,
  `⏱ 4 min · QCM À RÉPONSES MULTIPLES

OBJECTIF — Faire émerger les représentations sans juger.

ANIMATION — Lisez la question. Les participants annoncent leurs lettres (« A et C »). Cochez la majorité, « Valider ma sélection », puis cliquez chaque option pour l'explication. → révèle les bonnes réponses, puis l'essentiel.

RÉPONSES — A et C.
• A ✓ — Le mode agent fait exactement cela : on le pratique au lab 01 et au lab 11.
• B ✗ PIÈGE — « Compiler n'est pas être correct. On verra au module 3 une étude où 45 % des extraits générés contenaient une faille. »
• C ✓ — Expliquer une trace : un des usages les plus rentables (lab 04).
• D ✗ PIÈGE — « Il ne connaît vos conventions que si vous les écrivez : fichiers d'instructions, module 2. »

MESSAGE CLÉ — L'IA propose, vous décidez et vous vérifiez.

TRANSITION — « Commençons par le panorama. »`,
  `⏱ 1 min · DÉBUT DU MODULE 1 (≈ 9 h 30)

OBJECTIF — Annoncer le plan du module.

DIRE — « Module 1 : panorama des assistants de codage. D'où viennent ces outils, comment ils produisent du code, ce qui distingue Copilot, Cursor, JetBrains AI ou Claude Code, et surtout les quatre façons de travailler avec eux. »

RYTHME — Environ 35 minutes de contenu, puis le lab 01 (20 min) avant la pause de 10 h 30.

TRANSITION — « Remontons cinq ans en arrière. »`,
];
// @@NOTES-END
