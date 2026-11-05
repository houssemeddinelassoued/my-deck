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
        Installer, comprendre, générer, refactorer, tester… et surtout <strong style={{ color: C.navy }}>vérifier</strong> :
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
        Ni code client, ni secret, ni donnée personnelle dans un prompt : le projet TaskFlow est fictif, exprès.
      </Card>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 790, width: 1680 }}>
      <Callout tone="teal" icon="clock" title="Rythme & vraies pauses" size={25} cls={A.in} style={dl(550)}>
        9 h 00 – 12 h 30 et 14 h 00 – 17 h 30, deux pauses de 15 minutes par jour, loin de l’écran. Le texte à copier arrive dans le clavardage.
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
        <PollRow id="o-p4" tone="violet" icon="chat" label="4 · J’utilise déjà le chat de temps en temps" />
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
      <Card title="Tour de table express (1 min)" icon="chat" tone="navy" size={23} pad={26}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <Strong>1.</Strong> Votre prénom et votre métier
          </div>
          <div>
            <Strong>2.</Strong> Votre langage du quotidien
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
  <div className={A.left} style={{ display: 'flex', alignItems: 'center', gap: 22, background: C.card, borderRadius: 16, boxShadow: SHADOW_SM, padding: '16px 26px', ...dl(d) }}>
    <Num n={n} tone={tone} size={50} />
    <div style={{ fontSize: 27, lineHeight: 1.3, color: C.ink }}>{children}</div>
  </div>
);

const OBar = ({ label, value, pct, bg, c, d }: { label: string; value: string; pct: number; bg: string; c: string; d: number }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: C.ink }}>
      <span>{label}</span>
      <strong style={{ color: c }}>{value}</strong>
    </div>
    <div style={{ marginTop: 8, height: 22, borderRadius: 11, background: C.panel, overflow: 'hidden' }}>
      <div className={A.grow} style={{ width: `${pct}%`, height: '100%', background: bg, ...dl(d) }} />
    </div>
  </div>
);

const O_Objectifs: Page = () => (
  <Frame mod={0}>
    <Title>Les 6 objectifs de vos deux jours</Title>
    <Lede>Le programme officiel Docaposte Institute. À la fin, vous saurez :</Lede>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1080, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <OObj n={1} tone="blue" d={100}>
        <strong>Découvrir GitHub Copilot</strong> et comprendre son fonctionnement
      </OObj>
      <OObj n={2} tone="navy" d={200}>
        <strong>Installer et configurer</strong> Copilot dans Visual Studio Code
      </OObj>
      <OObj n={3} tone="teal" d={300}>
        <strong>Générer</strong> blocs de code, fonctions et commentaires
      </OObj>
      <OObj n={4} tone="violet" d={400}>
        Effectuer un <strong>premier refactoring</strong> assisté par l’IA
      </OObj>
      <OObj n={5} tone="pink" d={500}>
        Initier la génération de <strong>tests unitaires</strong>
      </OObj>
      <OObj n={6} tone="coral" d={600}>
        <strong>Vérifier et valider</strong> le code généré, avec méthode
      </OObj>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1260, top: 260, width: 540, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '28px 32px', ...dl(300) }}>
      <Eyebrow c={C.navy}>Équilibre des deux jours</Eyebrow>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <OBar label="Ateliers, exercices, échanges" value="≈ 60 %" pct={60} bg={G.green} c={C.green} d={600} />
        <OBar label="Apports et démonstrations" value="≈ 40 %" pct={40} bg={G.blue} c={C.blue} d={750} />
      </div>
      <div style={{ marginTop: 28, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
        8 ateliers individuels sur un même projet, un QCM par module, auto-positionnement au début et à la fin.
      </div>
    </div>
  </Frame>
);

// ─── Programme ──────────────────────────────────────────────────────────────
const OSlot = ({ t, mod, title, sub, tone, d }: { t: string; mod?: string; title: ReactNode; sub?: ReactNode; tone: Tone; d: number }) => (
  <div className={A.left} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, ...dl(d) }}>
    <span style={{ flex: 'none', width: 82, fontFamily: mono, fontSize: 23, color: C.muted, paddingTop: 3 }}>{t}</span>
    <span style={{ flex: 'none', width: 12, height: 12, marginTop: 10, borderRadius: 99, background: STRONG[tone] }} />
    <div>
      <div style={{ fontSize: 26, fontWeight: 600, color: C.ink, lineHeight: 1.3 }}>
        {mod ? <span style={{ fontFamily: display, fontWeight: 800, color: STRONG[tone], marginRight: 10 }}>{mod}</span> : null}
        {title}
      </div>
      {sub ? <div style={{ fontSize: 21, color: C.muted, lineHeight: 1.35, marginTop: 3 }}>{sub}</div> : null}
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>{children}</div>
  </div>
);

const O_Programme: Page = () => (
  <Frame mod={0}>
    <Title>Le programme des deux jours</Title>
    <div style={{ position: 'absolute', left: 120, top: 190, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 48 }}>
      <OHalf icon="rocket" tone="blue" title="Jour 1" sub="Découverte et premières générations" d={0}>
        <OSlot t="9:00" title={`Ouverture · fil rouge ${PROJECT}`} tone="grey" d={150} />
        <OSlot t="9:30" mod="M1" title="Introduction à GitHub Copilot" sub="Histoire de l’IA, LLM, agents, écosystème · Atelier 1" tone="blue" d={230} />
        <OSlot t="11:10" mod="M2" title="Installation et configuration" sub="Licence, réglages, raccourcis, panneau Chat · Atelier 2" tone="navy" d={310} />
        <OSlot t="12:15" mod="M3" title="Comprendre les suggestions" sub="Contexte, inline ou chat, lire avant d’accepter · Atelier 3" tone="teal" d={390} />
        <OSlot t="14:55" mod="M4" title="Génération de code simple" sub="Commentaires guides, 3 langages · Atelier 4 : TaskFlow v1" tone="green" d={470} />
        <OSlot t="16:55" title="Bilan du jour · billet de sortie" tone="grey" d={550} />
      </OHalf>
      <OHalf icon="shieldCheck" tone="violet" title="Jour 2" sub="Approfondissement et bonnes pratiques" d={200}>
        <OSlot t="9:00" title="Reprise · quiz du Jour 1" tone="grey" d={450} />
        <OSlot t="9:15" mod="M5" title="Fonctions et blocs de code" sub="Classes, fichiers, API HTTP, parseurs, JSDoc · Atelier 5" tone="teal" d={530} />
        <OSlot t="11:00" mod="M6" title="Refactoring avec Copilot" sub="Renommer, extraire, comparer, legacy · Atelier 6" tone="violet" d={610} />
        <OSlot t="14:00" mod="M7" title="Tests unitaires avec Copilot" sub="Générer, organiser, vérifier, mocks · Atelier 7" tone="pink" d={690} />
        <OSlot t="15:15" mod="M8" title="Bonnes pratiques et vérification" sub="Checklist, hallucinations, droits, revue · Atelier 8" tone="coral" d={770} />
      <OSlot t="16:40" mod="M9" title="Les agents dans Copilot" sub="Agents, Skills, orchestration · Atelier 9" tone="violet" d={800} />
        <OSlot t="17:20" title="Évaluation · clôture" tone="grey" d={850} />
      </OHalf>
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 925, display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: C.muted, ...dl(1000) }}>
      <Icon name="map" size={24} color={C.electric} />
      Le bandeau en haut à droite indique toujours où nous en sommes : M1 → M4 le Jour 1, M5 → M8 le Jour 2.
    </div>
  </Frame>
);

// ─── Auto-positionnement ────────────────────────────────────────────────────
const O_AutoPos: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Auto-positionnement : votre point de départ</Title>
    <Lede>Comptez pour vous, sur papier, ce que vous savez déjà faire. Je coche à l’écran pour illustrer.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1150, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CheckItem id="ap1" size={26}>Expliquer ce qu’est un LLM et pourquoi Copilot peut se tromper</CheckItem>
        <CheckItem id="ap2" size={26}>Installer Copilot dans VS Code et vérifier ma licence</CheckItem>
        <CheckItem id="ap3" size={26}>Accepter, refuser ou parcourir les suggestions au clavier</CheckItem>
        <CheckItem id="ap4" size={26}>Choisir entre suggestion inline, chat en ligne et vue Chat</CheckItem>
        <CheckItem id="ap5" size={26}>Écrire un commentaire qui guide une génération précise</CheckItem>
        <CheckItem id="ap6" size={26}>Refactorer un code sans changer son comportement</CheckItem>
        <CheckItem id="ap7" size={26}>Faire générer des tests et vérifier leurs assertions</CheckItem>
        <CheckItem id="ap8" size={26}>Relire du code généré : logique, performance, sécurité, licence</CheckItem>
      </div>
      <div className={A.right} style={{ position: 'absolute', left: 1330, top: 262, width: 470, ...dl(300) }}>
        <CheckScore
          max={8}
          label="Mon niveau de départ"
          levels={[
            { min: 0, text: 'Découverte : vous êtes au bon endroit.', tone: 'grey' },
            { min: 3, text: 'Bonnes bases : on va structurer.', tone: 'blue' },
            { min: 6, text: 'Déjà à l’aise : visez les bonus.', tone: 'green' },
          ]}
        />
        <div style={{ marginTop: 20, fontSize: 22, lineHeight: 1.45, color: C.muted }}>
          Notez votre score : on refera exactement le même exercice à la fin du Jour 2.
        </div>
      </div>
    </Checklist>
  </Frame>
);

// ─── Fil rouge TaskFlow ─────────────────────────────────────────────────────
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
      Le fil rouge : <span style={{ color: C.green }}>{PROJECT}</span>, votre outil de tickets
    </Title>
    <Lede>Un backlog, un tableau Kanban, des règles métier. Un seul dépôt pour les deux jours : chaque atelier ajoute une brique.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 820, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Row2 icon="ticket" tone="blue" title="Des tickets" d={100}>
        story, bug ou tâche · priorité 1 à 3 · points 1-2-3-5-8-13
      </Row2>
      <Row2 icon="filter" tone="teal" title="Un backlog trié et filtrable" d={200}>
        recherche sans accents, filtres combinés, statistiques
      </Row2>
      <Row2 icon="layers" tone="violet" title="Un Kanban à 4 colonnes" d={300}>
        limite de 3 tickets en cours, ticket non estimé bloqué
      </Row2>
      <Row2 icon="archive" tone="coral" title="Un vieux module à reprendre" d={400}>
        du code « legacy » de 2019 à refactorer, tests à l’appui
      </Row2>
      <div className={A.fade} style={{ display: 'flex', gap: 10, marginTop: 4, ...dl(600) }}>
        <Tag tone="navy" size={19}>JavaScript · Node 22</Tag>
        <Tag tone="navy" size={19}>Tests node:test</Tag>
        <Tag tone="grey" size={19}>Variantes Python · Java</Tag>
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1010, top: 268, width: 790, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', ...dl(200) }}>
      <Eyebrow c={C.navy} size={20}>
        Vos 8 ateliers
      </Eyebrow>
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px 24px' }}>
        <OStep n={1} tone="blue" title="Premier contact" out="explorer TaskFlow" d={300} />
        <OStep n={5} tone="teal" title="Backlog & import" out="fonctions, classe, CSV" d={700} />
        <OStep n={2} tone="navy" title="Configuration" out="réglages, 8 gestes" d={400} />
        <OStep n={6} tone="violet" title="Refactoring" out="le legacy, tests verts" d={800} />
        <OStep n={3} tone="teal" title="Contexte" out="4 expériences" d={500} />
        <OStep n={7} tone="pink" title="Tests" out="suite + mocks" d={900} />
        <OStep n={4} tone="green" title="TaskFlow v1" out="le modèle de ticket" d={600} />
        <OStep n={8} tone="coral" title="Revue & livraison" out="8 défauts à trouver" d={1000} />
      </div>
    </div>
  </Frame>
);

// ─── Le kit d'ateliers ──────────────────────────────────────────────────────
const OKitRow = ({ path, children }: { path: string; children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '230px minmax(0, 1fr)', gap: 16, alignItems: 'baseline' }}>
    <PathChip size={20}>{path}</PathChip>
    <span style={{ fontSize: 21, color: C.soft, lineHeight: 1.35 }}>{children}</span>
  </div>
);

const O_Kit: Page = () => (
  <Frame mod={0}>
    <Title>Votre kit d’ateliers : le dépôt taskflow-copilot</Title>
    <Lede>Sur GitHub (lien à la page suivante) ou via le bouton « Labs » de ce support : le dépôt et le guide PDF des 8 ateliers.</Lede>
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 900, background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 13 }}>
      <PanelTitle icon="archive">Ce qu’il contient</PanelTitle>
      <OKitRow path="src/">le code de TaskFlow, à générer, guidé par des commentaires</OKitRow>
      <OKitRow path="test/">les tests d’acceptation fournis : votre juge de paix</OKitRow>
      <OKitRow path="src/legacy/">un vieux code à refactorer (Jour 2)</OKitRow>
      <OKitRow path="katas/">petits exercices du Jour 1, variantes Python / Java</OKitRow>
      <OKitRow path="ateliers/">un énoncé README par atelier</OKitRow>
      <OKitRow path="public/">l’interface Kanban, qui s’allume au fil des ateliers</OKitRow>
      <OKitRow path="JOURNAL.md">votre journal de bord, à remplir</OKitRow>
    </div>
    <div style={{ position: 'absolute', left: 1080, top: 262, width: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <CodeDark file="Terminal · taskflow-copilot" size={21} cls={A.right} style={dl(200)}>
        <Cc>{'# aucune dépendance à installer'}</Cc>
        {'\n'}
        <Cf>node</Cf> --version <Cc>{'      # 22 ou plus'}</Cc>
        {'\n'}
        <Cf>npm</Cf> test <Cc>{'            # rouge : normal !'}</Cc>
        {'\n'}
        <Cf>npm</Cf> run test:atelier4
        {'\n'}
        <Cf>npm</Cf> run serveur <Cc>{'    # localhost:3000'}</Cc>
      </CodeDark>
      <Callout tone="green" icon="flask" title="Des tests rouges au départ" size={23} cls={A.right} style={dl(400)}>
        Chaque atelier les fait passer au vert. Les tests fournis ne se modifient pas : c’est votre code qui s’adapte.
      </Callout>
    </div>
  </Frame>
);

// ─── Dépôt GitHub des ateliers (lien cliquable + copier) ──────────────────────
const REPO_URL = 'https://github.com/houssemeddinelassoued/taskflow-copilot';
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
      <Title>Le dépôt des ateliers, en ligne sur GitHub</Title>
      <Lede>Un clic pour l’ouvrir, un clic pour copier le lien et le coller dans le clavardage.</Lede>
      <div style={{ position: 'absolute', left: 120, top: 262, width: 1020, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '26px 32px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          <PanelTitle icon="git">Le lien du dépôt</PanelTitle>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-osd-interactive
            style={{ fontFamily: mono, fontSize: 30, fontWeight: 600, color: T.blue.fg, textDecoration: 'underline', textUnderlineOffset: 6, textDecorationThickness: 2, whiteSpace: 'nowrap', userSelect: 'all' }}
          >
            github.com/houssemeddinelassoued/taskflow-copilot
          </a>
          <div style={{ display: 'flex', gap: 18 }}>
            <Btn icon="globe" size={24} onClick={() => window.open(REPO_URL, '_blank', 'noopener')}>
              Ouvrir le dépôt
            </Btn>
            <Btn icon={copie === 'lien' ? 'check' : 'link'} tone={copie === 'lien' ? 'green' : 'blue'} ghost={copie !== 'lien'} size={24} onClick={() => copier('lien')}>
              {copie === 'lien' ? 'Lien copié !' : 'Copier le lien'}
            </Btn>
          </div>
        </div>
        <div className={A.in} style={{ background: C.card, borderRadius: 20, boxShadow: SHADOW, padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 18, ...dl(200) }}>
          <PanelTitle icon="terminal">Ou en ligne de commande</PanelTitle>
          <CodeDark file="Terminal" size={20}>
            <Cf>git</Cf> clone {REPO_URL}.git
            {'\n'}
            <Cf>cd</Cf> taskflow-copilot
            {'\n'}
            <Cf>npm</Cf> test <Cc>{'   # rouge : normal !'}</Cc>
          </CodeDark>
          <div style={{ display: 'flex' }}>
            <Btn icon={copie === 'clone' ? 'check' : 'code'} tone={copie === 'clone' ? 'green' : 'navy'} ghost={copie !== 'clone'} size={22} onClick={() => copier('clone')}>
              {copie === 'clone' ? 'Commande copiée !' : 'Copier la commande git clone'}
            </Btn>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 1200, top: 262, width: 600, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card tone="teal" icon="archive" title="Pas de Git ?" cls={A.right} style={dl(300)}>
          Sur la page du dépôt : bouton vert <b>Code › Download ZIP</b>, puis décompressez. Ou le bouton « Labs » de ce support.
        </Card>
        <Card tone="violet" icon="doc" title="Le guide PDF" cls={A.right} style={dl(450)}>
          Guide-des-ateliers-Copilot-Debutant.pdf, à la racine du dépôt : les 8 énoncés.
        </Card>
        <Callout tone="green" icon="lock" title="Vous codez en local" size={23} cls={A.right} style={dl(600)}>
          Pas besoin de forker ni de pousser : vous codez dans votre copie locale.
        </Callout>
      </div>
    </Frame>
  );
};

// ─── Check-up technique ─────────────────────────────────────────────────────
const O_Setup: Page = () => (
  <Frame mod={0} kind="exercice">
    <Title>Check-up technique : cinq minutes avant de coder</Title>
    <Lede>Chacun vérifie sur son poste. Ce qui n’est pas prêt maintenant vous coûtera dix minutes en plein atelier.</Lede>
    <Checklist>
      <div className={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 1060, display: 'flex', flexDirection: 'column', gap: 13 }}>
        <CheckItem id="su1" size={25}>VS Code à jour (menu Aide › Rechercher les mises à jour)</CheckItem>
        <CheckItem id="su2" size={25}>Compte GitHub accessible (identifiant et double authentification)</CheckItem>
        <CheckItem id="su3" size={25}>Node.js 22 ou plus : node --version dans le terminal</CheckItem>
        <CheckItem id="su4" size={25}>Dépôt taskflow-copilot cloné (ou zip décompressé) et ouvert</CheckItem>
        <CheckItem id="su5" size={25}>npm test s’exécute (des tests rouges : c’est normal)</CheckItem>
        <CheckItem id="su6" size={25}>Deux fenêtres côte à côte : classe virtuelle et VS Code</CheckItem>
      </div>
      <div style={{ position: 'absolute', left: 1240, top: 262, width: 560, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Timer id="setup" minutes={5} label="Check-up" cls={A.right} style={{ width: 560, ...dl(200) }} />
        <Callout title="Installation de Copilot" tone="blue" icon="plug" cls={A.right} style={dl(400)} size={24}>
          On la fait ensemble au Module 2. Déjà installé ? Parfait, vous aiderez au point d’étape.
        </Callout>
      </div>
    </Checklist>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [O_Cover, O_Formateur, O_Virtuel, O_Poll, O_Objectifs, O_Programme, O_AutoPos, O_FilRouge, O_Kit, O_Depot, O_Setup];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · COUVERTURE · J1 9:00

OBJECTIF — Accueillir chaque participant, vérifier le son et poser la promesse : partir de zéro, finir autonome et méfiant à bon escient.

DIRE — « Bonjour à toutes et à tous, bienvenue dans cette formation GitHub Copilot niveau débutant. Deux jours pour passer de “j’ai entendu parler de Copilot” à “je l’utilise tous les jours, et je sais vérifier ce qu’il me propose”. Avant tout : est-ce que tout le monde m’entend bien ? Dites-moi “oui” au micro ou d’un pouce dans le clavardage. »

ANIMATION — Laisser la page affichée pendant les connexions. Saluer chaque arrivant par son prénom.

TRANSITION — « Quelques mots sur moi. »`,
  `⏱ 2 min · FORMATEUR

OBJECTIF — Asseoir la légitimité en une minute, sans s’étendre.

DIRE — « Je suis développeur depuis dix-huit ans, en Java, Python et Web, chercheur en intelligence artificielle, et je forme des équipes à ces outils depuis huit ans. J’utilise Copilot tous les jours dans mon propre travail : ce que je vais vous montrer, ce sont des usages réels, avec leurs limites. »

TRANSITION — « Comme nous sommes en classe virtuelle, fixons quelques règles de confort. »`,
  `⏱ 2 min · CLASSE VIRTUELLE

OBJECTIF — Fixer les règles de la classe virtuelle : caméra, micro, écrans, ateliers individuels, données.

DIRE — « Caméra allumée si vous le pouvez, c’est plus convivial ; micro coupé quand vous ne parlez pas. L’idéal, deux écrans : la classe d’un côté, VS Code de l’autre. Tous les ateliers sont individuels, sur votre poste : je ne vois pas vos écrans, donc je ferai des points d’étape au micro toutes les quinze à vingt minutes. Si vous êtes bloqué, vous le dites, et vous partagez votre écran deux minutes. Et la règle d’or : aucune donnée réelle dans Copilot pendant la formation. »

ANIMATION — Coller dans le clavardage le lien du zip des ateliers.

TRANSITION — « Faisons connaissance. »`,
  `⏱ 6 min · TOUR DE TABLE (vote oral)

OBJECTIF — Connaître le niveau réel et les langages pour doser les démos et les variantes.

DIRE — « Premier vote, à voix haute : votre expérience de Copilot, de 1 à 4. » Cliquer une ligne par voix. « Deuxième vote : votre langage principal, 5, 6 ou 7. » Puis : « Tour de table express, une minute chacun, dans l’ordre de la liste : prénom, métier, langage, et la tâche de code que vous aimeriez déléguer dès lundi. »

ANIMATION — Noter les tâches citées : y revenir dans les modules 4 à 7. Beaucoup de Python ou de Java ? Annoncer les variantes de l’Atelier 4.

TRANSITION — « Voici ce que le programme vous promet. »`,
  `⏱ 2 min · OBJECTIFS

OBJECTIF — Présenter les six objectifs officiels et l’équilibre pratique.

DIRE — « Six objectifs, ceux du programme officiel : découvrir, installer et configurer, générer, refactorer, tester, et surtout vérifier. Le sixième est le plus important : Copilot écrit vite, mais c’est vous qui signez le code. Environ 60 % du temps, vous pratiquez : huit ateliers individuels sur un même projet, un QCM à la fin de chaque module. »

TRANSITION — « Le déroulé des deux jours. »`,
  `⏱ 2 min · PROGRAMME

OBJECTIF — Donner le déroulé horaire et le repère du bandeau.

DIRE — « Jour 1 : découverte et premières générations. On comprend comment Copilot fonctionne, on l’installe, on apprend à lire ses suggestions, et on génère le premier morceau de TaskFlow. Jour 2 : approfondissement. Des fonctions complètes et des classes, du refactoring, des tests, et pour finir une revue de code où vous chasserez huit défauts. Le bandeau en haut à droite vous dit toujours où nous en sommes. »

ANIMATION — Les horaires sont indicatifs : ajuster au rythme du groupe.

TRANSITION — « Mesurons votre point de départ. »`,
  `⏱ 4 min · AUTO-POSITIONNEMENT (exercice)

OBJECTIF — Mesurer le niveau de départ (exigence du dispositif d’évaluation).

DIRE — « Huit compétences, celles que nous allons travailler. Comptez pour vous, sur une feuille, celles que vous savez déjà faire sans aide. Pas de jugement : on refera exactement le même exercice à la fin du Jour 2, et c’est l’écart qui compte. »

ANIMATION — Cocher à l’écran les lignes d’un exemple fictif pour illustrer, puis tout décocher. Demander à chacun de noter son score dans son JOURNAL.md.

TRANSITION — « Parlons du projet sur lequel vous allez travailler. »`,
  `⏱ 3 min · FIL ROUGE TASKFLOW

OBJECTIF — Présenter TaskFlow et la chaîne des 8 ateliers.

DIRE — « TaskFlow est un petit outil de gestion de tickets : un backlog, un tableau Kanban, et quelques règles métier, par exemple pas plus de trois tickets en cours. Le métier est volontairement simple : tout votre cerveau reste disponible pour Copilot. Il est en JavaScript, parce que Node est léger et que vous n’aurez rien à installer, mais vous verrez aussi Python et Java. À droite, vos huit ateliers : chacun ajoute une brique au même dépôt. »

TRANSITION — « Ouvrons ce dépôt. »`,
  `⏱ 3 min · KIT D’ATELIERS

OBJECTIF — Faire télécharger et ouvrir le dépôt ; expliquer le principe des tests rouges.

DIRE — « Le dépôt est sur GitHub, je vous donne le lien à la page suivante ; il est aussi derrière le bouton Labs de ce support. Il contient le code de départ et un guide PDF des huit ateliers. Le code de TaskFlow est presque vide : il contient des commentaires-guides, et c’est Copilot qui va l’écrire avec vous. Les tests, eux, sont fournis. Quand vous lancerez npm test tout à l’heure, vous verrez du rouge partout : c’est normal, c’est votre feuille de route. »

TRANSITION — « Voici le lien du dépôt. »`,
  `⏱ 2 min · DÉPÔT GITHUB DES ATELIERS

OBJECTIF — Que chaque participant ait le dépôt sur son poste avant le check-up.

DIRE — « Le dépôt est public sur GitHub. Je colle le lien dans le clavardage. Ceux qui ont Git : git clone, la commande est juste là. Les autres : sur la page GitHub, bouton vert Code, puis Download ZIP. Le guide PDF est à la racine. Vous ne poussez rien sur ce dépôt : vous travaillez dans votre copie locale. »

ACTION — Cliquer « Copier le lien », le coller dans le clavardage Teams/Zoom : https://github.com/houssemeddinelassoued/taskflow-copilot. Cliquer « Ouvrir le dépôt » pour montrer la page en partage d'écran, puis « Copier la commande git clone » et la coller aussi.

ANIMATION — Point d'étape au micro : « Le dossier est ouvert dans VS Code chez tout le monde ? » Proxy ou Git bloqué : Download ZIP ou bouton Labs.

TRANSITION — « Cinq minutes pour vérifier vos postes. »`,
  `⏱ 5 min · CHECK-UP (minuteur 5 min)

OBJECTIF — Vérifier les prérequis techniques : VS Code, compte GitHub, Node, dépôt ouvert.

DIRE — « Cinq minutes. Chacun vérifie ces six points sur son poste. Copilot lui-même, on l’installe ensemble au Module 2. »

ANIMATION — Lancer le minuteur. Point d’étape au micro à la fin : « Qui a encore une ligne qui coince ? » Si Node manque : nodejs.org, version LTS. Si le compte GitHub est bloqué : avancer en démo partagée jusqu’au Module 2.

TRANSITION — « Tout le monde est prêt ? Module 1 : qu’est-ce que GitHub Copilot ? »`,
];
// @@NOTES-END
