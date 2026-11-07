// ─── Ouverture ──────────────────────────────────────────────────────────────

// Shared page helpers (used across parts) ─────────────────────────────────────
const BreakPage = ({ mod, title, back, minutes, icon = 'clock' }: { mod: number; title: string; back: string; minutes: number; icon?: IconName }) => (
  <Frame mod={mod}>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1000 }}>
      <div className={A.in}>
        <IconTile name={icon} tone="yellow" size={96} solid />
      </div>
      <h2 className={A.in} style={{ margin: '40px 0 0', fontFamily: display, fontWeight: 800, fontSize: 96, lineHeight: 1.05, color: C.navy, ...dl(120) }}>
        {title}
      </h2>
      <p className={A.in} style={{ margin: '26px 0 0', fontSize: 34, lineHeight: 1.4, color: C.soft, ...dl(240) }}>
        {back}
      </p>
      <div className={A.fade} style={{ marginTop: 40, display: 'flex', gap: 14, ...dl(500) }}>
        <Tag tone="teal" size={22}>
          <Icon name="eyeOff" size={22} /> Loin de l’écran
        </Tag>
        <Tag tone="grey" size={22}>
          <Icon name="user" size={22} /> Caméra coupée si vous voulez
        </Tag>
      </div>
    </div>
    <Timer id={`pause-${mod}-${minutes}-${title}`} minutes={minutes} label={title} cls={A.right} style={{ position: 'absolute', left: 1240, top: 300, width: 560, ...dl(300) }} />
  </Frame>
);

// Two-line "what you see / what it means" row used by several modules.
const Row2 = ({ icon, tone, title, children, d = 0, cls }: { icon: IconName; tone: Tone; title: ReactNode; children: ReactNode; d?: number; cls?: string }) => (
  <div className={cls ?? A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 18, ...dl(d) }}>
    <IconTile name={icon} tone={tone} size={54} />
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{title}</div>
      <div style={{ fontSize: 22, color: C.soft, lineHeight: 1.4, marginTop: 2 }}>{children}</div>
    </div>
  </div>
);

// Inline code chip (light).
const Ic = ({ children }: { children: ReactNode }) => (
  <code style={{ fontFamily: mono, fontSize: '0.86em', color: C.electric, background: T.blue.bg, borderRadius: 6, padding: '1px 7px' }}>{children}</code>
);

// Quoted prompt.
const Pr = ({ children }: { children: ReactNode }) => (
  <span style={{ fontStyle: 'italic', color: C.navy, background: T.violet.bg, borderRadius: 6, padding: '1px 8px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>{children}</span>
);

// Numbered step line used in lab "Le défi" panels.
const WStep = ({ n, children }: { n: number; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
    <Num n={n} tone="green" size={34} style={{ marginTop: 2 }} />
    <div style={{ fontSize: 22, lineHeight: 1.42, color: C.soft }}>{children}</div>
  </div>
);

// ─── Couverture ─────────────────────────────────────────────────────────────
const O_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <Slab x={-70} y={-60} w={370} h={1200} r={64} cls={A.left} />
    <Outline x={1450} y={-50} w={560} h={170} r={46} cls={A.fade} />
    <Outline x={-40} y={760} w={120} h={360} r={40} color="#AEB9E6" />
    <div style={{ position: 'absolute', left: 390, top: 140, width: 1420 }}>
      <div className={A.in} style={{ display: 'flex', gap: 12 }}>
        <Tag tone="violet" size={22}>
          <Icon name="calendar" size={22} /> Formation · 2 jours · 14 h
        </Tag>
        <Tag tone="blue" size={22}>
          <Icon name="sparkles" size={22} /> Débutant
        </Tag>
        <Tag tone="teal" size={22}>
          <Icon name="globe" size={22} /> Classe virtuelle
        </Tag>
      </div>
      <h1 className={A.in} style={{ margin: '34px 0 0', fontFamily: display, fontWeight: 800, fontSize: 104, lineHeight: 1.04, letterSpacing: '-0.02em', color: C.navy, ...dl(120) }}>
        GitHub Copilot
        <br />
        <span style={{ color: C.electric }}>premiers pas maîtrisés</span>
      </h1>
      <p className={A.in} style={{ margin: '30px 0 0', fontSize: 30, lineHeight: 1.45, color: C.soft, maxWidth: 1060, ...dl(240) }}>
        Configurer, guider, déléguer à un agent, tester… et surtout <strong style={{ color: C.navy }}>vérifier</strong> :
        intégrer Copilot à votre quotidien de développeur, en autonomie.
      </p>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 1360, top: 600, ...dl(900) }}>
      <div style={{ transform: 'rotate(-7deg)', fontFamily: '"Mr Dafoe", "Segoe Script", cursive', fontSize: 78, color: C.electric, lineHeight: 1 }}>Together we grow</div>
    </div>
    <Portrait w={170} x={390} y={660} cls={A.in} />
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 684, ...dl(300) }}>
      <Eyebrow c={C.muted} size={20}>
        Formateur
      </Eyebrow>
      <div style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 40, color: C.navy }}>{AUTHOR}</div>
      <div style={{ marginTop: 8, fontSize: 24, color: C.soft }}>Docaposte Institute · IA appliquée au développement</div>
    </div>
    <div className={A.pop} style={{ position: 'absolute', left: 1500, top: 790, ...dl(600) }}>
      <DapLogo size={40} />
    </div>
    <Footer left={390} />
  </Frame>
);
O_Cover.transition = BLOOM;

// ─── Formateur ──────────────────────────────────────────────────────────────
const OStatCard = ({ icon, tone, title, children, d }: { icon: IconName; tone: Tone; title: string; children: ReactNode; d: number }) => (
  <Card icon={icon} tone={tone} title={title} size={22} pad={24} cls={A.in} style={dl(d)}>
    {children}
  </Card>
);

const O_Formateur: Page = () => (
  <Frame mod={0}>
    <Title>Votre formateur</Title>
    <Portrait w={250} x={130} y={250} cls={A.in} />
    <div style={{ position: 'absolute', left: 490, top: 240, width: 1310, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className={A.in} style={{ fontFamily: display, fontWeight: 800, fontSize: 42, color: C.navy }}>
        {AUTHOR}
      </div>
      <Bullet size={27} cls={A.left} style={dl(120)}>
        Expert IA &amp; ingénierie logicielle · Ingénieur IT et doctorant en intelligence artificielle
      </Bullet>
      <Bullet size={27} cls={A.left} style={dl(200)}>
        Développeur senior depuis 18 ans (Java, Python, Web) &amp; CEO de National Quantum
      </Bullet>
      <Bullet size={27} cls={A.left} style={dl(280)}>
        Chercheur, enseignant universitaire et consultant en transformation numérique
      </Bullet>
      <Bullet size={27} cls={A.left} style={dl(360)}>
        Formateur professionnel depuis 8 ans auprès de grandes entreprises et d’équipes métiers
      </Bullet>
    </div>
    <div style={{ position: 'absolute', left: 490, top: 660, width: 1310, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 26 }}>
      <OStatCard icon="star" tone="blue" title="250+ sessions" d={500}>
        Formations animées en ingénierie logicielle et IA générative
      </OStatCard>
      <OStatCard icon="globe" tone="violet" title="60+ entreprises" d={600}>
        Accompagnées dans l’adoption concrète des outils IA
      </OStatCard>
      <OStatCard icon="users" tone="green" title="3 000+ apprenants" d={700}>
        Développeurs, profils techniques et débutants complets
      </OStatCard>
    </div>
  </Frame>
);

// ─── Classe virtuelle ───────────────────────────────────────────────────────
const O_Virtuel: Page = () => (
  <Frame mod={0}>
    <Title>Classe virtuelle : nos règles de confort</Title>
    <Lede>Chacun sur son poste : je partage mon écran pour les démos, vous codez sur le vôtre, avec votre propre Copilot.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 270, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24 }}>
      <Card title="Caméra & micro" icon="user" tone="blue" size={23} pad={24} cls={A.in} style={dl(100)}>
        Caméra allumée si possible ; micro coupé hors prise de parole, ouvert dès que vous votez, répondez ou posez une question.
      </Card>
      <Card title="Deux écrans, idéalement" icon="code" tone="violet" size={23} pad={24} cls={A.in} style={dl(200)}>
        La classe virtuelle d’un côté, VS Code de l’autre. Un seul écran ? Scindez-le en deux, VS Code en grand.
      </Card>
      <Card title="Ateliers 100 % individuels" icon="target" tone="green" size={23} pad={24} cls={A.in} style={dl(300)}>
        Minuteur affiché, point d’étape oral toutes les 15 à 20 minutes. Bloqué ? Partage d’écran de 2 minutes.
      </Card>
      <Card title="Zéro donnée réelle" icon="shield" tone="coral" size={23} pad={24} cls={A.in} style={dl(400)}>
        Ni code client, ni secret, ni donnée personnelle dans un prompt : le projet Parafo est fictif, exprès.
      </Card>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 790, width: 1680 }}>
      <Callout tone="teal" icon="clock" title="Rythme & vraies pauses" size={25} cls={A.in} style={dl(550)}>
        9 h 00 – 12 h 30 et 13 h 30 – 17 h 30 environ, deux pauses de 15 minutes par jour, loin de l’écran. Le texte à copier arrive dans le Chat.
      </Callout>
    </div>
  </Frame>
);

// ─── Tour de table ──────────────────────────────────────────────────────────
const O_Poll: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Tour de table &amp; point de départ</Title>
    <Lede>Dites-moi à voix haute le numéro qui vous correspond : je compte les voix à l’écran.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 260, width: 1040 }}>
      <Eyebrow c={C.navy} style={{ marginBottom: 14 }}>
        Mon expérience de Copilot aujourd’hui
      </Eyebrow>
      <Poll>
        <PollRow id="o-p1" tone="grey" icon="eyeOff" label="1 · Jamais utilisé, je découvre" />
        <PollRow id="o-p2" tone="blue" icon="eye" label="2 · Vu en démo, jamais sur mon poste" />
        <PollRow id="o-p3" tone="teal" icon="code" label="3 · Quelques suggestions acceptées avec Tab" />
        <PollRow id="o-p4" tone="violet" icon="bot" label="4 · J’utilise déjà le chat ou le mode Agent" />
      </Poll>
      <Eyebrow c={C.navy} style={{ margin: '26px 0 14px' }}>
        Mon langage principal
      </Eyebrow>
      <Poll>
        <PollRow id="o-l1" tone="yellow" icon="code" label="5 · JavaScript / TypeScript" />
        <PollRow id="o-l2" tone="green" icon="code" label="6 · Python" />
        <PollRow id="o-l3" tone="coral" icon="code" label="7 · Java, C# ou autre" />
      </Poll>
    </div>
    <div className={A.right} style={{ position: 'absolute', left: 1230, top: 260, width: 570, ...dl(250) }}>
      <Card title="Tour de table express (30 s)" icon="chat" tone="navy" size={23} pad={26}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <Strong>1.</Strong> Votre prénom
          </div>
          <div>
            <Strong>2.</Strong> Votre métier en une phrase
          </div>
          <div>
            <Strong>3.</Strong> La tâche de code que vous aimeriez déléguer dès lundi
          </div>
        </div>
      </Card>
      <Hint style={{ marginTop: 22 }}>Ordre de la liste des participants, micro ouvert.</Hint>
    </div>
  </Frame>
);

// ─── Objectifs ──────────────────────────────────────────────────────────────
const OObj = ({ n, tone, children, d }: { n: number; tone: Tone; children: ReactNode; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 22, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '14px 26px', ...dl(d) }}>
    <Num n={n} tone={tone} size={46} />
    <div style={{ fontSize: 26, lineHeight: 1.3, color: C.ink }}>{children}</div>
  </div>
);

const OPlus = ({ n, children }: { n: string; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
    <Num n={n} tone="violet" size={38} style={{ marginTop: 2 }} />
    <div style={{ fontSize: 23, lineHeight: 1.4, color: C.ink }}>{children}</div>
  </div>
);

const OBar = ({ label, value, pct, bg, c, d }: { label: string; value: string; pct: number; bg: string; c: string; d: number }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 21, color: C.ink }}>
      <span>{label}</span>
      <strong style={{ color: c }}>{value}</strong>
    </div>
    <div style={{ marginTop: 6, height: 16, borderRadius: 8, background: C.panel, overflow: 'hidden' }}>
      <div className={A.grow} style={{ width: `${pct}%`, height: '100%', background: bg, ...dl(d) }} />
    </div>
  </div>
);

const O_Objectifs: Page = () => (
  <Frame mod={0}>
    <Title>Les 6 objectifs de vos deux jours</Title>
    <Lede>Le programme officiel Docaposte Institute, mot pour mot. À la fin, vous saurez :</Lede>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1040, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <OObj n={1} tone="blue" d={100}>
        <strong>Découvrir GitHub Copilot</strong> et comprendre son fonctionnement
      </OObj>
      <OObj n={2} tone="navy" d={180}>
        <strong>Installer et configurer</strong> Copilot dans Visual Studio Code
      </OObj>
      <OObj n={3} tone="teal" d={260}>
        <strong>Générer</strong> blocs de code, fonctions et commentaires
      </OObj>
      <OObj n={4} tone="violet" d={340}>
        Effectuer un <strong>premier refactoring</strong> assisté par l’IA
      </OObj>
      <OObj n={5} tone="pink" d={420}>
        Initier la génération de <strong>tests unitaires</strong>
      </OObj>
      <OObj n={6} tone="coral" d={500}>
        <strong>Vérifier et valider</strong> le code généré, avec méthode
      </OObj>
    </div>
    <div style={{ position: 'absolute', left: 1220, top: 250, width: 580, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className={A.right} style={{ background: T.violet.bg, borderRadius: 20, padding: '20px 26px', boxShadow: `inset 0 0 0 2px ${T.violet.bd}`, display: 'flex', flexDirection: 'column', gap: 14, ...dl(300) }}>
        <Eyebrow c={T.violet.fg} size={19}>
          En complément · Copilot en 2026
        </Eyebrow>
        <OPlus n="A">
          <strong>Personnaliser</strong> Copilot pour son projet : instructions, agents, skills
        </OPlus>
        <OPlus n="B">
          <strong>Encadrer et outiller</strong> l’agent : harnais, permissions, MCP, plugins
        </OPlus>
      </div>
      <div className={A.right} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '20px 26px', display: 'flex', flexDirection: 'column', gap: 14, ...dl(450) }}>
        <Eyebrow c={C.navy} size={19}>
          Le temps des deux jours
        </Eyebrow>
        <OBar label="Ateliers individuels" value="5 h 25" pct={40} bg={G.green} c={C.green} d={600} />
        <OBar label="QCM, votes, restitutions" value="≈ 1 h 15" pct={10} bg={G.violet} c={C.violet} d={700} />
        <OBar label="Apports et démonstrations" value="≈ 7 h" pct={50} bg={G.blue} c={C.blue} d={800} />
      </div>
    </div>
  </Frame>
);

// ─── Programme ──────────────────────────────────────────────────────────────
const OSlot = ({ t, mod, title, sub, tone, d }: { t: string; mod?: string; title: ReactNode; sub?: ReactNode; tone: Tone; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, ...dl(d) }}>
    <span style={{ flex: 'none', width: 82, fontFamily: mono, fontSize: 22, color: C.muted, paddingTop: 3 }}>{t}</span>
    <span style={{ flex: 'none', width: 12, height: 12, marginTop: 10, borderRadius: 99, background: STRONG[tone] }} />
    <div>
      <div style={{ fontSize: 25, fontWeight: 600, color: C.ink, lineHeight: 1.3 }}>
        {mod ? <span style={{ fontFamily: display, fontWeight: 800, color: STRONG[tone], marginRight: 10 }}>{mod}</span> : null}
        {title}
      </div>
      {sub ? <div style={{ fontSize: 20, color: C.muted, lineHeight: 1.35, marginTop: 2 }}>{sub}</div> : null}
    </div>
  </div>
);

const OHalf = ({ icon, tone, title, sub, d, children }: { icon: IconName; tone: Tone; title: string; sub: string; d: number; children: ReactNode }) => (
  <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', ...dl(d) }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
      <IconTile name={icon} tone={tone} size={50} solid />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.navy }}>{title}</div>
        <div style={{ fontSize: 21, color: C.muted }}>{sub}</div>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>{children}</div>
  </div>
);

const O_Programme: Page = () => (
  <Frame mod={0}>
    <Title>Le programme des deux jours</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 48 }}>
      <OHalf icon="rocket" tone="blue" title="Jour 1" sub="Découvrir, configurer, guider" d={0}>
        <OSlot t="9:00" title={`Ouverture · fil rouge ${PROJECT}`} tone="grey" d={150} />
        <OSlot t="9:30" mod="M1" title="Introduction à GitHub Copilot" sub="Histoire de l’IA, LLM, agents, écosystème · Atelier 1" tone="blue" d={230} />
        <OSlot t="11:10" mod="M2" title="Installer, configurer, choisir" sub="Réglages, quatre modes, choisir son modèle · Atelier 2" tone="navy" d={310} />
        <OSlot t="13:30" mod="M3" title="Prompting et contexte" sub="Anatomie d’un prompt, Plan puis Agent · Atelier 3" tone="teal" d={390} />
        <OSlot t="15:10" mod="M4" title="Les fichiers qui guident Copilot" sub="Instructions du dépôt, testées en A/B · Atelier 4" tone="green" d={470} />
        <OSlot t="16:45" title="Bilan du jour · billet de sortie" tone="grey" d={550} />
      </OHalf>
      <OHalf icon="shieldCheck" tone="violet" title="Jour 2" sub="Déléguer, outiller, vérifier" d={200}>
        <OSlot t="9:00" title="Reprise · quiz du Jour 1" tone="grey" d={450} />
        <OSlot t="9:15" mod="M5" title="Le harnais : boucle, outils, permissions" sub="Régler l’agent puis le circuit de signature · Atelier 5" tone="navy" d={530} />
        <OSlot t="10:50" mod="M6" title="Agents, skills et refactoring" sub="Un agent Refactoreur pour le code de 2019 · Atelier 6" tone="violet" d={610} />
        <OSlot t="13:30" mod="M7" title="Tests et définition de fini" sub="Une skill de tests, couverture, mutation · Atelier 7" tone="pink" d={690} />
        <OSlot t="15:10" mod="M8" title="MCP, plugins et sessions" sub="Annuaire MCP, plugin, deux sessions en parallèle · Atelier 8" tone="teal" d={770} />
        <OSlot t="16:20" mod="M9" title="Vérifier et valider" sub="Revue d’une PR piégée avec un agent relecteur · Atelier 9" tone="coral" d={850} />
        <OSlot t="17:20" title="Restitution · évaluation · clôture" tone="grey" d={930} />
      </OHalf>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 975, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(1000) }}>
      <Icon name="map" size={24} color={C.electric} />
      Le bandeau en haut à droite indique toujours où nous en sommes : M1 → M4 le Jour 1, M5 → M9 le Jour 2.
    </div>
  </Frame>
);

// ─── Fil rouge ──────────────────────────────────────────────────────────────
const OStep = ({ n, tone, title, out, d }: { n: number; tone: Tone; title: string; out: string; d: number }) => (
  <div className={A.right} style={{ display: 'flex', alignItems: 'center', gap: 14, ...dl(d) }}>
    <Num n={n} tone={tone} size={40} />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{title}</div>
      <div style={{ fontSize: 19, color: C.muted, lineHeight: 1.3 }}>{out}</div>
    </div>
  </div>
);

const O_FilRouge: Page = () => (
  <Frame mod={0}>
    <Title>
      Le fil rouge : <span style={{ color: C.green }}>{PROJECT}</span>, un parapheur numérique
    </Title>
    <Lede>Une entreprise fictive fait circuler des documents à signer. Un seul dépôt pour les deux jours : chaque atelier ajoute une brique.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 820, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Row2 icon="doc" tone="blue" title="Des documents à signer" d={100}>
        empreinte SHA-256, brouillon → en circulation → signé, refusé, expiré
      </Row2>
      <Row2 icon="route" tone="teal" title="Un circuit de signature" d={200}>
        signataires ordonnés, en séquentiel ou en parallèle, refus motivé
      </Row2>
      <Row2 icon="archive" tone="coral" title="Des relances écrites en 2019" d={300}>
        jours ouvrés et fériés : du code « legacy » à refactorer
      </Row2>
      <Row2 icon="lock" tone="violet" title="Un journal d’audit chaîné" d={400}>
        chaque entrée porte l’empreinte de la précédente : toute falsification se voit
      </Row2>
      <div className={A.fade} style={{ display: 'flex', gap: 10, marginTop: 4, ...dl(600) }}>
        <Tag tone="navy" size={19}>JavaScript · Node 22</Tag>
        <Tag tone="navy" size={19}>Tests node:test</Tag>
        <Tag tone="grey" size={19}>Aucune dépendance</Tag>
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1010, top: 268, width: 790, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', ...dl(200) }}>
      <Eyebrow c={C.navy} size={20}>
        Vos 9 ateliers
      </Eyebrow>
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px 24px' }}>
        <OStep n={1} tone="blue" title="Premier contact" out="faire expliquer Parafo" d={300} />
        <OStep n={6} tone="violet" title="Refactoring" out="un agent et sa skill" d={800} />
        <OStep n={2} tone="navy" title="Quatre modes" out="un besoin, quatre façons" d={400} />
        <OStep n={7} tone="pink" title="Tests" out="skill, mutation, fini" d={900} />
        <OStep n={3} tone="teal" title="Du brief au code" out="Plan, puis Agent" d={500} />
        <OStep n={8} tone="teal" title="MCP et plugin" out="2 sessions en parallèle" d={1000} />
        <OStep n={4} tone="green" title="Instructions" out="testées en A/B" d={600} />
        <OStep n={9} tone="coral" title="Revue" out="une PR piégée" d={1100} />
        <OStep n={5} tone="navy" title="Harnais" out="droits réglés, circuit livré" d={700} />
      </div>
    </div>
  </Frame>
);

// ─── Le kit d'ateliers ──────────────────────────────────────────────────────
const OKitRow = ({ path, children }: { path: string; children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '250px minmax(0, 1fr)', gap: 16, alignItems: 'baseline' }}>
    <PathChip size={20}>{path}</PathChip>
    <span style={{ fontSize: 21, color: C.soft, lineHeight: 1.35 }}>{children}</span>
  </div>
);

const O_Kit: Page = () => (
  <Frame mod={0}>
    <Title>Votre kit d’ateliers : le dépôt parafo-copilot</Title>
    <Lede>Un modèle de dépôt GitHub (lien à la page suivante) ou le bouton « Labs » de ce support. Vous l’avez reçu avec la fiche d’accueil.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 920, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <PanelTitle icon="archive">Ce qu’il contient</PanelTitle>
      <OKitRow path="src/">le code de Parafo : chaque fichier à écrire porte son contrat</OKitRow>
      <OKitRow path="test/acceptance/">les tests fournis : le contrat, on ne les modifie pas</OKitRow>
      <OKitRow path="ateliers/">un énoncé par atelier, étapes minutées</OKitRow>
      <OKitRow path="mcp/">un petit serveur MCP : l’annuaire (Jour 2)</OKitRow>
      <OKitRow path="reprises/">des points de reprise, si vous êtes bloqué</OKitRow>
      <OKitRow path="JOURNAL.md">votre journal : temps, crédits, ce qui a marché</OKitRow>
      <OKitRow path=".github/">vide au départ : vous l’écrivez au fil des ateliers</OKitRow>
    </div>
    <div style={{ position: 'absolute', left: 1100, top: 262, width: 700, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <CodeDark file="Terminal · parafo-copilot" size={20} cls={A.right} style={dl(200)}>
        <Cf>npm</Cf> run verifier-poste <Cc>{'# avant tout'}</Cc>
        {'\n'}
        <Cf>npm</Cf> run test:atelier3 <Cc>{'  # 2 à 9'}</Cc>
        {'\n'}
        <Cf>npm</Cf> run reprise -- 5 <Cc>{'   # rattraper'}</Cc>
        {'\n'}
        <Cf>npm</Cf> run garde <Cc>{'         # contrat intact ?'}</Cc>
      </CodeDark>
      <Callout tone="green" icon="flask" title="Des tests rouges au départ" size={23} cls={A.right} style={dl(400)}>
        Chaque atelier les fait passer au vert. Un agent qui « répare » un test au lieu du code est pris par <Ic>npm run garde</Ic>.
      </Callout>
    </div>
  </Frame>
);

// ─── Dépôt modèle des ateliers (lien cliquable + copier) ──────────────────────
const REPO_URL = 'https://github.com/houssemeddinelassoued/parafo-copilot';
const REPO_CLONE = `git clone ${REPO_URL}.git`;

const copierTexte = async (txt: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(txt);
    return true;
  } catch {
    const t = document.createElement('textarea');
    t.value = txt;
    t.style.position = 'fixed';
    t.style.opacity = '0';
    document.body.appendChild(t);
    t.select();
    const ok = document.execCommand('copy');
    t.remove();
    return ok;
  }
};

const OUse = ({ n, children }: { n: number; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
    <Num n={n} tone="blue" size={36} style={{ marginTop: 2 }} />
    <div style={{ fontSize: 23, lineHeight: 1.4, color: C.ink }}>{children}</div>
  </div>
);

const O_Depot: Page = () => {
  const [copie, setCopie] = useState<'lien' | 'clone' | null>(null);
  const copier = (quoi: 'lien' | 'clone') => {
    void copierTexte(quoi === 'lien' ? REPO_URL : REPO_CLONE).then((ok) => {
      if (!ok) return;
      setCopie(quoi);
      window.setTimeout(() => setCopie((c) => (c === quoi ? null : c)), 2200);
    });
  };
  return (
    <Frame mod={0}>
      <Title>Le dépôt modèle des ateliers, sur GitHub</Title>
      <Lede>Un clic pour l’ouvrir, un clic pour copier le lien et le coller dans le Chat.</Lede>
      <div style={{ position: 'absolute', left: 120, top: 262, width: 1020, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 32px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          <PanelTitle icon="git">Le lien du dépôt modèle</PanelTitle>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-osd-interactive
            style={{ fontFamily: mono, fontSize: 30, fontWeight: 600, color: T.blue.fg, textDecoration: 'underline', textUnderlineOffset: 6, textDecorationThickness: 2, whiteSpace: 'nowrap', userSelect: 'all' }}
          >
            github.com/houssemeddinelassoued/parafo-copilot
          </a>
          <div style={{ display: 'flex', gap: 18 }}>
            <Btn icon="globe" size={24} onClick={() => window.open(REPO_URL, '_blank', 'noopener')}>
              Ouvrir le dépôt
            </Btn>
            <Btn icon={copie === 'lien' ? 'check' : 'link'} tone={copie === 'lien' ? 'green' : 'blue'} ghost={copie !== 'lien'} size={24} onClick={() => copier('lien')}>
              {copie === 'lien' ? 'Lien copié !' : 'Copier le lien'}
            </Btn>
            <Btn icon={copie === 'clone' ? 'check' : 'code'} tone={copie === 'clone' ? 'green' : 'navy'} ghost={copie !== 'clone'} size={24} onClick={() => copier('clone')}>
              {copie === 'clone' ? 'Copié !' : 'Copier git clone'}
            </Btn>
          </div>
        </div>
        <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 16, ...dl(200) }}>
          <PanelTitle icon="plus">Votre copie, en trois gestes</PanelTitle>
          <OUse n={1}>
            Bouton vert <strong>Use this template › Create a new repository</strong>, dans votre compte GitHub
          </OUse>
          <OUse n={2}>
            <Ic>git clone</Ic> de <strong>votre</strong> dépôt, dans un dossier simple et non synchronisé
          </OUse>
          <OUse n={3}>
            VS Code : <strong>Fichier › Ouvrir le dossier</strong>, puis <Ic>npm run verifier-poste</Ic>
          </OUse>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 1200, top: 262, width: 600, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card tone="teal" icon="archive" title="Pas de compte ou pas de Git ?" size={23} cls={A.right} style={dl(300)}>
          <b>Code › Download ZIP</b>, décompressez, puis <Ic>git init</Ic> et un premier commit. Ou le bouton « Labs » de ce support.
        </Card>
        <Card tone="violet" icon="git" title="Pourquoi un vrai dépôt Git ?" size={23} cls={A.right} style={dl(450)}>
          Le Jour 2, deux agents travaillent en parallèle dans deux copies de travail Git, et vous commitez vos corrections.
        </Card>
        <Callout tone="green" icon="lock" title="Votre copie, votre code" size={23} cls={A.right} style={dl(600)}>
          Vous poussez sur votre dépôt, jamais sur le modèle.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Vérification du poste ──────────────────────────────────────────────────
const O_Setup: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Vérification du poste : cinq minutes avant de coder</Title>
    <Lede>La fiche d’accueil l’a préparée il y a une semaine. Chacun vérifie à nouveau sur son poste, maintenant.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060, display: 'flex', flexDirection: 'column', gap: 13 }}>
        <CheckItem id="su1" size={25}>Votre copie de parafo-copilot ouverte dans VS Code</CheckItem>
        <CheckItem id="su2" size={25}>npm run verifier-poste affiche « poste prêt »</CheckItem>
        <CheckItem id="su3" size={25}>Icône Copilot de la barre d’état : connecté à GitHub</CheckItem>
        <CheckItem id="su4" size={25}>Vue Chat : cible de session « Copilot », modèle « Auto »</CheckItem>
        <CheckItem id="su5" size={25}>« Explique ce dépôt en 3 phrases » : une réponse arrive</CheckItem>
        <CheckItem id="su6" size={25}>Deux fenêtres côte à côte : classe virtuelle et VS Code</CheckItem>
      </div>
      <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Timer id="setup" minutes={5} label="Vérification" cls={A.right} style={{ width: 560, ...dl(200) }} />
        <Callout title="Une ligne qui coince ?" tone="blue" icon="plug" cls={A.right} style={dl(400)} size={23}>
          Dites-le au micro : on règle les réglages ensemble au Module 2. En attendant, suivez en démo partagée.
        </Callout>
      </div>
    </Checklist>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [O_Cover, O_Formateur, O_Virtuel, O_Poll, O_Objectifs, O_Programme, O_FilRouge, O_Kit, O_Depot, O_Setup];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · COUVERTURE · J1 9:00

OBJECTIF — Accueillir chaque participant, vérifier le son et poser la promesse : partir de zéro, finir capable de déléguer à un agent… et de le vérifier.

DIRE — « Bonjour à toutes et à tous, bienvenue dans cette formation GitHub Copilot niveau débutant. Deux jours pour passer de “j’ai entendu parler de Copilot” à “je lui confie une tâche, je règle ce qu’il a le droit de faire, et je vérifie ce qu’il me rend”. Avant tout : est-ce que tout le monde m’entend bien ? Dites-moi “oui” au micro ou d’un pouce dans le Chat. »

ANIMATION — Laisser la page affichée pendant les connexions. Saluer chaque arrivant par son prénom.

TRANSITION — « Quelques mots sur moi. »`,
  `⏱ 2 min · FORMATEUR

OBJECTIF — Asseoir la légitimité en une minute, sans s’étendre.

DIRE — « Je suis développeur depuis dix-huit ans, en Java, Python et Web, chercheur en intelligence artificielle, et je forme des équipes à ces outils depuis huit ans. J’utilise Copilot tous les jours, y compris ses agents : ce que je vais vous montrer, ce sont des usages réels, avec leurs limites. »

TRANSITION — « Comme nous sommes en classe virtuelle, fixons quelques règles de confort. »`,
  `⏱ 2 min · CLASSE VIRTUELLE

OBJECTIF — Fixer les règles de la classe virtuelle : caméra, micro, écrans, ateliers individuels, données.

DIRE — « Caméra allumée si vous le pouvez, c’est plus convivial ; micro coupé quand vous ne parlez pas. L’idéal, deux écrans : la classe d’un côté, VS Code de l’autre. Tous les ateliers sont individuels, sur votre poste : je ne vois pas vos écrans, donc je ferai des points d’étape au micro toutes les quinze à vingt minutes. Si vous êtes bloqué, vous le dites, et vous partagez votre écran deux minutes. Et la règle d’or : aucune donnée réelle dans Copilot pendant la formation. »

ANIMATION — Coller dans le Chat le lien du dépôt modèle (page Dépôt).

TRANSITION — « Faisons connaissance. »`,
  `⏱ 6 min · TOUR DE TABLE (vote oral)

OBJECTIF — Connaître le niveau réel et les langages pour doser les démos et le bonus Python / Java.

DIRE — « Premier vote, à voix haute : votre expérience de Copilot, de 1 à 4. » Cliquer une ligne par voix. « Deuxième vote : votre langage principal, 5, 6 ou 7. » Puis : « Tour de table express, trente secondes chacun, dans l’ordre de la liste : prénom, métier, et la tâche de code que vous aimeriez déléguer dès lundi. »

ANIMATION — 8 à 12 participants : tenir les 30 secondes. Noter les tâches citées : y revenir aux modules 6 à 8.

TRANSITION — « Voici ce que le programme vous promet. »`,
  `⏱ 2 min · OBJECTIFS

OBJECTIF — Présenter les six objectifs officiels, les deux objectifs complémentaires et la part de pratique.

DIRE — « Six objectifs, ceux du programme officiel : découvrir, installer et configurer, générer, refactorer, tester, et surtout vérifier. Le sixième est le plus important : Copilot écrit vite, mais c’est vous qui signez le code. »

DIRE — « À droite, deux objectifs en complément, parce que Copilot a beaucoup changé en 2026 : il travaille maintenant comme un agent. Vous apprendrez donc à le personnaliser pour votre projet, avec des fichiers d’instructions, des agents et des skills ; et à l’encadrer : ce qu’il a le droit de faire, quels outils il utilise. »

ANIMATION — Neuf ateliers individuels, cinq heures vingt-cinq en tout, et un QCM par module.

TRANSITION — « Le déroulé des deux jours. »`,
  `⏱ 2 min · PROGRAMME

OBJECTIF — Donner le déroulé horaire et le repère du bandeau.

DIRE — « Jour 1 : découvrir, configurer, guider. On comprend comment Copilot fonctionne, on le règle, on apprend à lui parler, et on écrit les fichiers qui le guident sur notre projet. Jour 2 : déléguer, outiller, vérifier. On règle l’agent, on lui crée des collègues spécialisés, on lui fait écrire des tests, on lui branche de nouveaux outils, et on termine par une revue de code piégée. »

ANIMATION — Les horaires sont indicatifs : ajuster au rythme du groupe.

TRANSITION — « Parlons du projet sur lequel vous allez travailler. »`,
  `⏱ 3 min · FIL ROUGE PARAFO

OBJECTIF — Présenter Parafo et la chaîne des 9 ateliers.

DIRE — « Parafo est un parapheur numérique fictif : une entreprise imaginaire fait circuler des documents à signer. Il y a des documents avec une empreinte, un circuit de signataires, des relances calculées en jours ouvrés par un vieux code de 2019, et un journal d’audit dont chaque ligne protège la précédente. Le métier est riche en règles testables, et c’est exprès : chaque règle devient un test qui juge ce que Copilot écrit. »

DIRE — « À droite, vos neuf ateliers : chacun ajoute une brique au même dépôt. »

TRANSITION — « Ouvrons ce dépôt. »`,
  `⏱ 3 min · KIT D’ATELIERS

OBJECTIF — Montrer ce que contient le dépôt ; expliquer les tests rouges, les reprises et la garde.

DIRE — « Le dépôt contient le code de départ : les fichiers à écrire portent leur contrat en commentaire. Les tests d’acceptation sont fournis : c’est le contrat, on ne les touche pas. Le dossier .github est vide : c’est vous qui l’écrirez, avec les instructions, les agents et les skills. »

DIRE — « Quatre commandes à connaître : verifier-poste avant tout ; test:atelier suivi du numéro ; reprise, si vous êtes bloqué et que l’atelier suivant commence ; et garde, qui vérifie qu’aucun test fourni n’a été modifié. Ça arrive : un agent pressé préfère parfois corriger le test que le code. »

TRANSITION — « Voici le lien du dépôt. »`,
  `⏱ 3 min · DÉPÔT MODÈLE

OBJECTIF — Que chaque participant ait SA copie Git du dépôt modèle, ouverte dans VS Code.

DIRE — « Le dépôt est un modèle GitHub. Vous cliquez sur Use this template, vous créez votre propre dépôt, et vous le clonez. Pourquoi un vrai dépôt ? Parce que demain, deux agents travailleront en parallèle dans deux copies de travail Git, et vous commiterez vos corrections. Pas de compte, ou Git bloqué : Download ZIP, puis git init. »

ACTION — Cliquer « Copier le lien », le coller dans le Chat : https://github.com/houssemeddinelassoued/parafo-copilot. Cliquer « Ouvrir le dépôt » pour montrer le bouton Use this template en partage d’écran.

ANIMATION — Point d’étape au micro : « Votre copie est ouverte dans VS Code chez tout le monde ? »

TRANSITION — « Cinq minutes pour vérifier vos postes. »`,
  `⏱ 5 min · VÉRIFICATION DU POSTE (minuteur 5 min)

OBJECTIF — Vérifier que chacun peut travailler : dépôt ouvert, verifier-poste vert, Copilot connecté, cible Copilot.

DIRE — « Cinq minutes. Vous avez reçu la fiche d’accueil la semaine dernière : normalement, tout est prêt. On vérifie quand même, ligne par ligne. La quatrième ligne est importante : dans la vue Chat, la cible de session doit être Copilot, et le modèle Auto. »

ANIMATION — Lancer le minuteur. Point d’étape à la fin : « Qui a encore une ligne qui coince ? » Ceux qui n’ont pas répondu à la fiche d’accueil sont les plus à risque : les appeler par leur prénom. Réseau bloqué : suivre en démo partagée et revoir la partie 4 de la fiche avec l’informatique.

TRANSITION — « Tout le monde est prêt ? Module 1 : qu’est-ce que GitHub Copilot ? »`,
];
// @@NOTES-END
