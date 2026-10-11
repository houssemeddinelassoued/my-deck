// ─── Ouverture Jour 2 + Module 4 · Exploitation de l'intersession ──────────

const J2_Cover: Page = () => (
  <Frame mod={0} chrome={false}>
    <Slab x={-60} y={-60} w={700} h={1200} r={56} cls={A.left}>
      <div style={{ position: 'absolute', left: 150, top: 240 }}>
        <div className={A.in} style={{ fontFamily: display, fontWeight: 700, fontSize: 26, letterSpacing: '0.24em', color: '#AEB9E6', ...dl(300) }}>
          BONJOUR !
        </div>
        <div className={A.pop} style={{ marginTop: 6, fontFamily: display, fontWeight: 800, fontSize: 300, lineHeight: 1, letterSpacing: '-0.04em', color: '#fff', ...dl(450) }}>
          J2
        </div>
        <div className={A.grow} style={{ marginTop: 26, width: 150, height: 8, borderRadius: 4, background: G.violet, ...dl(650) }} />
      </div>
      <div style={{ position: 'absolute', left: 150, bottom: 150 }}>
        <DapLogo size={24} color="#FFFFFF" />
      </div>
    </Slab>
    <Outline x={1480} y={-40} w={520} h={150} r={40} />
    <div style={{ position: 'absolute', left: 760, top: 210, width: 1040 }}>
      <div className={A.in} style={{ display: 'flex', gap: 12 }}>
        <Tag tone="violet" size={22}>
          <Icon name="calendar" size={22} /> Jour 2 · 9:00 → 17:30
        </Tag>
      </div>
      <h1 className={A.in} style={{ margin: '24px 0 0', fontFamily: display, fontWeight: 800, fontSize: 76, lineHeight: 1.06, letterSpacing: '-0.015em', color: C.navy, ...dl(120) }}>
        Sécurité, optimisation
        <br />
        et mise en pratique
      </h1>
      <p className={A.in} style={{ margin: '22px 0 0', fontSize: 30, lineHeight: 1.4, color: C.soft, ...dl(240) }}>
        Hier, on a posé les fondations. Aujourd’hui, on développe, on sécurise, on fiabilise… et on publie FrigoMalin.
      </p>
      <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SecItem n={1}>M4 · Exploitation de l’intersession</SecItem>
        <SecItem n={2}>M5 · Cybersécurité et IA</SecItem>
        <SecItem n={3}>M6 · Évaluer et fiabiliser le code</SecItem>
        <SecItem n={4}>M7 · Synthèse et plan d’action</SecItem>
      </div>
    </div>
    <Footer left={760} short />
  </Frame>
);
J2_Cover.transition = BLOOM;

// ─── Quiz de réactivation ───────────────────────────────────────────────────
const J2_Quiz: Page = () => (
  <Frame mod={4} kind="quiz" label="Réactivation · ce qu’il faut retenir d’hier">
    <Title>Quiz flash : cinq questions sur le jour 1</Title>
    <Lede>Main levée, puis on clique. Objectif : 5 sur 5 du premier coup pour le groupe.</Lede>
    <QuizSeries y={260}>
      <QuizQ q="Pourquoi un LLM peut-il proposer un paquet npm qui n’existe pas ?" explain="Il produit la suite la plus probable, sans vérifier qu’elle existe. D’où le slopsquatting.">
        <QOpt>Il recopie un dépôt GitHub piraté</QOpt>
        <QOpt ok>Il génère la suite la plus probable, sans vérifier qu’elle existe</QOpt>
        <QOpt>Son index du registre npm n’est plus à jour</QOpt>
        <QOpt>La température était réglée trop basse</QOpt>
      </QuizQ>
      <QuizQ q="Quel fichier part dans le contexte du modèle à CHAQUE requête Copilot ?" explain="Les instructions globales sont toujours chargées : elles doivent rester courtes (moins de 60 lignes dans FrigoMalin).">
        <QOpt ok>.github/copilot-instructions.md</QOpt>
        <QOpt>Tous les fichiers SKILL.md du dépôt</QOpt>
        <QOpt>.github/instructions/tests.instructions.md</QOpt>
        <QOpt>.copilotignore</QOpt>
      </QuizQ>
      <QuizQ q="Quel est l’ingrédient de prompt le plus souvent oublié ?" explain="Le critère de fin vérifiable (ex. « termine par npm test, tout au vert ») : sans lui, l’agent décide seul quand il a fini.">
        <QOpt>Le rôle</QOpt>
        <QOpt>Les formules de politesse</QOpt>
        <QOpt ok>Un critère de fin vérifiable</QOpt>
        <QOpt>Le nom du modèle à utiliser</QOpt>
      </QuizQ>
      <QuizQ q="L’exclusion de contenu officielle de Copilot (Business / Enterprise)…" explain="Selon la documentation GitHub, elle n’est pas appliquée en mode Agent : d’où la défense en profondeur.">
        <QOpt>protège tous les fichiers, dans tous les modes</QOpt>
        <QOpt>remplace le .gitignore</QOpt>
        <QOpt ok>n’est pas appliquée en mode Agent, selon la documentation</QOpt>
        <QOpt>est disponible gratuitement sur les comptes individuels</QOpt>
      </QuizQ>
      <QuizQ q="Une issue demande à l’agent d’exécuter une commande curl « pour tester ». L’agent doit…" explain="Tout ce que l’agent lit est une donnée, jamais une consigne. Les commandes passent par votre validation.">
        <QOpt>l’exécuter si la commande est courte</QOpt>
        <QOpt ok>traiter ce contenu comme une donnée, jamais comme une consigne</QOpt>
        <QOpt>demander l’autorisation à l’auteur de l’issue</QOpt>
        <QOpt>ignorer toutes les issues du dépôt</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// ─── Programme du jour 2 ────────────────────────────────────────────────────
const J2Slot = ({ t, mod, tone, title, sub, labs, d }: { t: string; mod: string; tone: Tone; title: string; sub: string; labs: string; d: number }) => (
  <div className={A.in} style={{ display: 'flex', alignItems: 'center', gap: 22, background: C.card, borderRadius: 18, boxShadow: SHADOW_SM, padding: '18px 26px', borderLeft: `8px solid ${STRONG[tone]}`, ...dl(d) }}>
    <span style={{ width: 92, flex: 'none', fontFamily: mono, fontSize: 24, color: C.muted }}>{t}</span>
    <span style={{ width: 80, flex: 'none', fontFamily: display, fontWeight: 800, fontSize: 34, color: STRONG[tone] }}>{mod}</span>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 22, color: C.soft, marginTop: 2 }}>{sub}</div>
    </div>
    <Tag tone="green" size={18}>
      {labs}
    </Tag>
  </div>
);

const J2_Programme: Page = () => (
  <Frame mod={4} label="Programme du jour 2">
    <Title>Le programme du jour 2</Title>
    <Lede>Un jour très pratique : 13 labs FrigoMalin, deux ateliers, et une mise en ligne à 17 h.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <J2Slot t="9:15" mod="M4" tone="teal" title="Exploitation de l’intersession, puis sprint fil rouge" sub="Vos cas d’usage · skills · de l’issue au code · TDD · micro-tâches" labs="4.2 · 5.1 · 4.3 · 5.2 · 5.4" d={100} />
      <J2Slot t="11:15" mod="M5" tone="coral" title="Cybersécurité et IA" sub="Risques, secrets, données envoyées, journalisation, RGPD et AI Act · analyse d’incidents" labs="7.1 en démo" d={200} />
      <J2Slot t="14:00" mod="M6" tone="green" title="Évaluer et fiabiliser le code" sub="Agents spécialisés et orchestration · hooks · tests · optimisation · atelier en binômes" labs="6.1 → 6.3 · 8.1 · 8.2 · 7.2 · 7.3" d={300} />
      <J2Slot t="16:55" mod="M7" tone="navy" title="Synthèse et plan d’action" sub="CI/CD et publication sur GitHub Pages · votre feuille de route · évaluation" labs="9.1" d={400} />
    </div>
    <div className={A.fade} style={{ position: 'absolute', left: 120, top: 860, width: 1680, display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, color: C.muted, ...dl(700) }}>
      <Icon name="clock" size={26} color={T.yellow.fg} /> Pauses vers 10:30 et 15:30 · déjeuner 12:30 – 14:00 · fin 17:30
    </div>
  </Frame>
);

// ─── Module 4 ───────────────────────────────────────────────────────────────
const M4_Divider: Page = () => (
  <Section
    n={4}
    title={
      <>
        Exploitation de
        <br />
        l’intersession
      </>
    }
    sub="Vos cas d’usage, analysés ensemble : bénéfices, limites, ajustements. Puis on accélère sur FrigoMalin."
    dur="9:15 – 11:15 · sprint inclus"
    labs={
      <>
        <Tag tone="green" size={19}>4.2</Tag>
        <Tag tone="green" size={19}>5.1</Tag>
        <Tag tone="green" size={19}>4.3</Tag>
        <Tag tone="green" size={19}>5.2</Tag>
        <Tag tone="green" size={19}>5.4</Tag>
        <Tag tone="pink" size={19}>Bonus 5.3</Tag>
      </>
    }
  >
    <SecItem n={1}>Présentation des cas d’usage</SecItem>
    <SecItem n={2}>Analyse collective : bénéfices et limites</SecItem>
    <SecItem n={3}>La matrice de bonnes pratiques du groupe</SecItem>
    <SecItem n={4}>Sprint FrigoMalin : skills et features</SecItem>
  </Section>
);
M4_Divider.transition = BLOOM;

// ─── Tour de table : grille d'écoute ────────────────────────────────────────
const M4_Format: Page = () => (
  <Frame mod={4} kind="atelier">
    <Title>Tour de table : 5 minutes de présentation, 3 de questions</Title>
    <Lede>Pendant chaque présentation, le groupe compte ce qu’il entend : un clic par bénéfice ou limite cité.</Lede>
    <Timer id="m4-talk" minutes={8} label="Présentation + Q/R" cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 440 }} />
    <div className={A.in} style={{ position: 'absolute', left: 120, top: 560, width: 440, background: C.card, borderRadius: 18, boxShadow: SHADOW, padding: '20px 24px', ...dl(150) }}>
      <PanelTitle icon="note">Pour chaque cas</PanelTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 22, lineHeight: 1.4, color: C.soft }}>
        <div>1 · Contexte, outil, prompts clés</div>
        <div>2 · Résultat mesuré</div>
        <div>3 · Limites et incidents</div>
        <div>4 · Je garde / je change</div>
      </div>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 620, top: 262, width: 570, ...dl(200) }}>
      <Eyebrow c={T.green.fg} style={{ marginBottom: 12 }}>
        Bénéfices observés
      </Eyebrow>
      <Poll>
        <PollRow id="m4-b1" label="Gain de temps réel" tone="green" icon="bolt" />
        <PollRow id="m4-b2" label="Meilleure qualité / tests" tone="green" icon="checkCircle" />
        <PollRow id="m4-b3" label="Solution non envisagée" tone="green" icon="bulb" />
        <PollRow id="m4-b4" label="Montée en compétence" tone="green" icon="book" />
      </Poll>
    </div>
    <div className={A.in} style={{ position: 'absolute', left: 1230, top: 262, width: 570, ...dl(300) }}>
      <Eyebrow c={T.coral.fg} style={{ marginBottom: 12 }}>
        Limites rencontrées
      </Eyebrow>
      <Poll>
        <PollRow id="m4-l1" label="Contexte insuffisant" tone="coral" icon="eyeOff" />
        <PollRow id="m4-l2" label="Hallucinations, erreurs" tone="coral" icon="bug" />
        <PollRow id="m4-l3" label="Règles internes, confidentialité" tone="coral" icon="lock" />
        <PollRow id="m4-l4" label="Coût, quotas, lenteur" tone="coral" icon="euro" />
      </Poll>
    </div>
    <Hint cls={A.fade} style={{ position: 'absolute', left: 620, top: 680, width: 1180, ...dl(500) }}>
      Les compteurs alimentent l’analyse collective : on part des limites les plus citées.
    </Hint>
  </Frame>
);

// ─── Matrice valeur × effort ────────────────────────────────────────────────
const M4Quad = ({ x, y, title, sub, tone }: { x: number; y: number; title: string; sub: string; tone: Tone }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 600, height: 300, boxSizing: 'border-box', borderRadius: 18, background: T[tone].bg, boxShadow: `inset 0 0 0 2px ${T[tone].bd}`, padding: '14px 20px' }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: T[tone].fg }}>{title}</div>
    <div style={{ fontSize: 19, color: C.soft }}>{sub}</div>
  </div>
);

const M4_Matrix: Page = () => (
  <Frame mod={4} kind="exercice">
    <Title>Analyse collective : valeur × effort</Title>
    <Lede>Placez les cas présentés (et ceux-ci) dans la matrice. Glisser-déposer, double-clic pour remettre en place.</Lede>
    <M4Quad x={560} y={262} title="Quick wins" sub="forte valeur, faible effort : à généraliser" tone="green" />
    <M4Quad x={1180} y={262} title="Projets" sub="forte valeur, effort élevé : à cadrer" tone="blue" />
    <M4Quad x={560} y={582} title="Bonus" sub="faible valeur, faible effort : à volonté" tone="grey" />
    <M4Quad x={1180} y={582} title="À éviter" sub="faible valeur, effort élevé" tone="coral" />
    <div style={{ position: 'absolute', left: 520, top: 262, width: 30, height: 620, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap', fontSize: 19, fontWeight: 700, letterSpacing: '0.1em', color: C.muted }}>VALEUR ↑</span>
    </div>
    <div style={{ position: 'absolute', left: 560, top: 890, width: 1220, textAlign: 'center', fontSize: 19, fontWeight: 700, letterSpacing: '0.1em', color: C.muted }}>EFFORT →</div>
    <Drag x={120} y={262} w={370} tone="violet" size={21}>Tests d’un module legacy</Drag>
    <Drag x={120} y={330} w={370} tone="violet" size={21}>Documentation d’API</Drag>
    <Drag x={120} y={398} w={370} tone="violet" size={21}>Refactorisation d’un monolithe</Drag>
    <Drag x={120} y={466} w={370} tone="violet" size={21}>Script de migration</Drag>
    <Drag x={120} y={534} w={370} tone="violet" size={21}>Analyse de logs anonymisés</Drag>
    <Drag x={120} y={602} w={370} tone="violet" size={21}>Revue de PR assistée</Drag>
    <Drag x={120} y={670} w={370} tone="violet" size={21}>Prototype d’écran</Drag>
    <Drag x={120} y={738} w={370} tone="violet" size={21}>Agent qui merge seul en prod</Drag>
    <Drag x={120} y={806} w={370} tone="violet" size={21}>Messages de commit</Drag>
  </Frame>
);

// ─── Matrice de bonnes pratiques ────────────────────────────────────────────
const M4Row = ({ sit, tool, tech, guard, beat }: { sit: string; tool: string; tech: string; guard: string; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'grid', gridTemplateColumns: '330px 1fr 1fr 1fr', gap: 18, alignItems: 'stretch' }}>
    <div style={{ background: G.navy, color: '#fff', borderRadius: 14, padding: '16px 20px', fontSize: 23, fontWeight: 700, display: 'flex', alignItems: 'center' }}>{sit}</div>
    <div style={{ background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 18px', fontSize: 21, lineHeight: 1.38, color: C.ink }}>{tool}</div>
    <div style={{ background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 18px', fontSize: 21, lineHeight: 1.38, color: C.ink }}>{tech}</div>
    <div style={{ background: T.green.bg, borderRadius: 14, padding: '14px 18px', fontSize: 21, lineHeight: 1.38, color: C.ink }}>{guard}</div>
  </div>
);

const M4_Practices: Page = () => (
  <Frame mod={4} kind="synthese" beats={3}>
    <Title>La matrice de bonnes pratiques du groupe</Title>
    <Lede>Ce que l’on retient des retours : pour chaque situation, l’outil, la technique et le garde-fou. À compléter ensemble.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 262, width: 1680, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '330px 1fr 1fr 1fr', gap: 18, fontSize: 18, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>
        <span>SITUATION</span>
        <span>OUTIL / MODE</span>
        <span>TECHNIQUE DE PROMPT</span>
        <span>GARDE-FOU</span>
      </div>
      <M4Row sit="Tâche répétitive" tool="Complétion, chat inline ou skill dédié" tech="Exemples (few-shot), format imposé" guard="Lint + tests automatiques" beat={0} />
      <M4Row sit="Code legacy" tool="Ask pour comprendre, Plan pour migrer" tech="Expliquer d’abord, migrer par lots" guard="Tests de caractérisation avant tout changement" beat={1} />
      <M4Row sit="Besoin flou" tool="Ask (sparring partner)" tech="« Pose-moi tes questions d’abord »" guard="Validation par le PO, critères Gherkin" beat={2} />
      <M4Row sit="Code ou données sensibles" tool="Offre entreprise ou modèle local" tech="Abstraire, anonymiser, données fictives" guard="Exclusions, revue, aucune donnée réelle" beat={3} />
    </div>
  </Frame>
);

// ─── Skills ─────────────────────────────────────────────────────────────────
const M4Load = ({ n, tone, title, tok, desc, beat }: { n: number; tone: Tone; title: string; tok: string; desc: string; beat: number }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
    <Num n={n} tone={tone} size={48} />
    <div style={{ flex: 1, background: C.card, borderRadius: 14, boxShadow: SHADOW_SM, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
        <div style={{ fontSize: 20, color: C.soft }}>{desc}</div>
      </div>
      <Tag tone={tone} size={18}>
        {tok}
      </Tag>
    </div>
  </div>
);

const M4_Skills: Page = () => (
  <Frame mod={4} beats={2} label="Fil rouge · Sprint 4 — Skills & features">
    <Title>Les skills : industrialiser un savoir-faire</Title>
    <Lede>Un dossier, un fichier SKILL.md, des ressources. Format ouvert, partagé par plusieurs agents (Copilot, Claude Code…).</Lede>
    <CodeDark file=".github/skills/create-component/SKILL.md" size={22} cls={A.in} style={{ position: 'absolute', left: 120, top: 262, width: 820 }}>
      <Cc>---</Cc>
      {'\n'}
      <Ck>name</Ck>: create-component{'\n'}
      <Ck>description</Ck>: <Cs>Crée un composant React dans src/ui</Cs>
      {'\n  '}
      <Cs>avec ses tests. À utiliser pour créer ou</Cs>
      {'\n  '}
      <Cs>ajouter un composant d’interface.</Cs>
      {'\n'}
      <Cc>---</Cc>
      {'\n'}# Créer un composant{'\n'}1. Lire src/ui/tokens.css{'\n'}2. Partir de template/Component.tsx.txt{'\n'}3. Lancer node check.mjs, corriger{'\n'}
      <Cc>{'+ template/ · check.mjs (ressources)'}</Cc>
    </CodeDark>
    <div style={{ position: 'absolute', left: 1000, top: 262, width: 800, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Eyebrow c={C.navy} cls={A.in}>
        Chargement progressif
      </Eyebrow>
      <M4Load n={1} tone="navy" title="Nom + description" tok="toujours · quelques dizaines de tokens" desc="Le modèle les lit pour décider : la description est le déclencheur." beat={0} />
      <M4Load n={2} tone="blue" title="Corps du SKILL.md" tok="si la tâche correspond" desc="Les étapes, les règles, les commandes." beat={1} />
      <M4Load n={3} tone="green" title="Ressources" tok="à la demande" desc="Gabarits, scripts, exemples, documentation réduite." beat={2} />
      <div className={b.on(2)}>
        <Callout title="Conséquence" tone="violet" icon="gauge" size={22}>
          20 skills ne coûtent presque rien tant qu’ils ne servent pas. Une description floue, en revanche, et le skill ne se déclenche jamais.
        </Callout>
      </div>
    </div>
  </Frame>
);

const M4_Lab42: Page = () => (
  <LabPage
    mod={4}
    n="4.2"
    title="Skill create-component"
    defi="squelette"
    who="Développeurs · Tech Leads"
    label="Fil rouge · Sprint 4 — Skills & features"
    where={
      <>
        <PathChip>.github/skills/create-component/</PathChip> SKILL.md + template/ + check.mjs
      </>
    }
    objective="Créer le skill create-component, avec des gabarits et un script de vérification (fichiers présents, aucune couleur en dur)."
    feats={
      <>
        <Tag tone="blue" size={18}>Agent Skills</Tag>
        <Tag tone="blue" size={18}>SKILL.md</Tag>
        <Tag tone="blue" size={18}>Chargement progressif</Tag>
      </>
    }
    minutes={15}
    crit={
      <>
        <CheckItem id="l42a" size={22}>Se déclenche sans être appelé</CheckItem>
        <CheckItem id="l42b" size={22}>Les gabarits sont utilisés</CheckItem>
        <CheckItem id="l42c" size={22}>Le script de vérification passe</CheckItem>
      </>
    }
  >
    Complétez SKILL.md. Soignez surtout la <strong>description</strong> : c’est elle qui déclenche (ou non) le skill. Testez : « ajoute un composant BadgeUrgence »,
    sans nommer le skill.
    <CodeDark size={21} wrap style={{ marginTop: 12 }}>
      <Cc>---</Cc>
      {'\n'}
      <Ck>name</Ck>: <Hole>…</Hole>
      {'\n'}
      <Ck>description</Ck>: <Hole>QUOI + QUAND, 1024 caractères max</Hole>
      {'\n'}
      <Cc>---</Cc>
      {'\n'}# <Hole>titre</Hole>
      {'\n'}1. <Hole>étapes</Hole>
      {'\n'}2. Utiliser les gabarits de <Hole>…</Hole>
      {'\n'}3. Lancer <Hole>…</Hole> et corriger jusqu’à succès
    </CodeDark>
  </LabPage>
);

// ─── De l'issue au code ─────────────────────────────────────────────────────
const M4Flow = ({ icon, tone, title, sub, beat, human }: { icon: IconName; tone: Tone; title: string; sub: string; beat: number; human?: boolean }) => (
  <div className={beat ? b.on(beat) : A.in} style={{ width: 254, boxSizing: 'border-box', background: human ? T.green.bg : C.card, borderRadius: 18, boxShadow: human ? `inset 0 0 0 2.5px ${C.green}` : SHADOW, padding: '18px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
    <IconTile name={icon} tone={tone} size={52} solid={human} />
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 23, color: C.ink, lineHeight: 1.2 }}>{title}</div>
    <div style={{ fontSize: 19, lineHeight: 1.38, color: C.soft }}>{sub}</div>
  </div>
);

const M4_IssueToCode: Page = () => (
  <Frame mod={4} beats={5} label="Fil rouge · Sprint 4 — Skills & features">
    <Title>De l’issue au code, en lots relus</Title>
    <Lede>Le quotidien du développeur augmenté : un plan validé, puis des petits lots testés et committés un par un.</Lede>
    <div style={{ position: 'absolute', left: 120, top: 280, width: 1680, display: 'flex', justifyContent: 'space-between' }}>
      <M4Flow icon="note" tone="blue" title="Issue" sub="critères Gherkin : Étant donné… Quand… Alors…" beat={0} />
      <M4Flow icon="map" tone="blue" title="Agent Plan" sub="lots de 1 à 3 fichiers, tests d’abord" beat={1} />
      <M4Flow icon="humanCheck" tone="green" title="Plan validé" sub="vous corrigez, ajoutez, retirez" beat={2} human />
      <M4Flow icon="bot" tone="violet" title="Un lot en mode Agent" sub="tests, code, npm test + lint" beat={3} />
      <M4Flow icon="humanCheck" tone="green" title="Diff relu + commit" sub="un commit par lot" beat={4} human />
      <M4Flow icon="loop" tone="teal" title="Lot suivant" sub="nouvelle session si le contexte enfle (Ctrl+N)" beat={5} />
    </div>
    <div className={b.on(5)} style={{ position: 'absolute', left: 120, top: 680, width: 1680, display: 'flex', gap: 24 }}>
      <Card tone="green" icon="git" title="Pourquoi des lots ?" style={{ flex: 1 }} size={22}>
        Un diff de 40 lignes se relit vraiment. Un diff de 800 lignes se valide… les yeux fermés.
      </Card>
      <Card tone="blue" icon="reset" title="Pourquoi des commits par lot ?" style={{ flex: 1 }} size={22}>
        Un lot raté se défait d’un geste, sans perdre les précédents.
      </Card>
      <Card tone="violet" icon="layers" title="Pourquoi une nouvelle session ?" style={{ flex: 1 }} size={22}>
        Une tâche = une session : l’historique de la précédente ne pollue pas la suivante.
      </Card>
    </div>
  </Frame>
);

const M4_Lab51: Page = () => (
  <LabPage
    mod={4}
    n="5.1"
    title="Inventaire : de l’issue au code"
    defi="construire"
    who="Développeurs"
    label="Fil rouge · Sprint 4 — Skills & features"
    where={
      <>
        <PathChip>src/domain/</PathChip> <PathChip>src/data/</PathChip> <PathChip>src/ui/Inventory/</PathChip>
      </>
    }
    objective="Implémenter « Inventaire et dates de péremption » : plan avec l’agent Plan, puis implémentation par lots en mode Agent, tests d’abord."
    feats={
      <>
        <Tag tone="blue" size={18}>Agent Plan</Tag>
        <Tag tone="blue" size={18}>Mode Agent</Tag>
        <Tag tone="blue" size={18}>Lots</Tag>
      </>
    }
    minutes={25}
    crit={
      <>
        <CheckItem id="l51a" size={21}>Chaque scénario Gherkin a son test</CheckItem>
        <CheckItem id="l51b" size={21}>Au moins 3 commits relus, un par lot</CheckItem>
        <CheckItem id="l51c" size={21}>npm test et lint passent, l’écran marche</CheckItem>
      </>
    }
  >
    Votre stratégie en deux temps : le prompt de planification, puis les prompts par lots. Précisez quand vous relisez, committez et ouvrez une nouvelle session.
    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 7, fontSize: 21, color: C.ink }}>
      <Bullet tone="green" size={21}>issues du lab 1.3 ou ligne Inventaire de #docs/mvp.md</Bullet>
      <Bullet tone="green" size={21}>#PRODUCT.md (glossaire) · #docs/adr/0001-stockage.md · #src/domain/types.ts</Bullet>
      <Bullet tone="green" size={21}>principes de copilot-instructions.md · composant StockItemCard · skill create-component</Bullet>
      <Bullet tone="green" size={21}>npm test, npm run lint · un commit par lot · Ctrl+N</Bullet>
    </div>
  </LabPage>
);

const M4_Lab43: Page = () => (
  <LabPage
    mod={4}
    n="4.3"
    title="Skill openfoodfacts-api → scan"
    defi="construire"
    who="Développeurs"
    label="Fil rouge · Sprint 4 — Skills & features"
    where={
      <>
        <PathChip>.github/skills/openfoodfacts-api/</PathChip> · code dans <PathChip>src/data/off.ts</PathChip>
      </>
    }
    objective="Créer un skill qui embarque la documentation utile de l’API Open Food Facts, puis l’utiliser pour implémenter le scan et la fiche produit."
    feats={
      <>
        <Tag tone="blue" size={18}>Ressources de skill</Tag>
        <Tag tone="blue" size={18}>Doc externe réduite</Tag>
      </>
    }
    minutes={15}
    crit={
      <>
        <CheckItem id="l43a" size={21}>Scan réussi sur un produit réel</CheckItem>
        <CheckItem id="l43b" size={21}>Inconnu ou hors ligne → saisie manuelle</CheckItem>
        <CheckItem id="l43c" size={21}>Les tests n’appellent jamais le réseau</CheckItem>
      </>
    }
  >
    Construisez le skill (structure + description), puis le prompt d’implémentation. Récupérez vous-même un exemple de réponse réelle de l’API. Souvenez-vous
    de l’audit d’hier !
    <CodeDark size={20} wrap style={{ marginTop: 12 }}>
      <Cc>{'// Ingrédients'}</Cc>
      {'\n'}URL : <Cs>https://world.openfoodfacts.org/api/v2/product/{'{code}'}.json</Cs>
      {'\n'}• une réponse réelle, réduite aux champs utiles{'\n'}• cas : trouvé / inconnu / hors ligne / lent{'\n'}• détection : BarcodeDetector ou bibliothèque
      {'\n'}• principe « hors ligne d’abord »
    </CodeDark>
  </LabPage>
);

// ─── TDD avec l'IA ──────────────────────────────────────────────────────────
const M4Tdd = ({ x, color, title, sub, d }: { x: number; color: string; title: string; sub: string; d: number }) => (
  <div className={A.pop} style={{ position: 'absolute', left: x, top: 300, width: 360, height: 360, borderRadius: 999, background: '#fff', boxShadow: `inset 0 0 0 10px ${color}, ${SHADOW}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40, boxSizing: 'border-box', ...dl(d) }}>
    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 44, color }}>{title}</div>
    <div style={{ marginTop: 12, fontSize: 22, lineHeight: 1.4, color: C.soft }}>{sub}</div>
  </div>
);

const M4_TDD: Page = () => (
  <Frame mod={4} beats={1} label="Fil rouge · Sprint 4 — Skills & features">
    <Title>Le TDD, meilleur allié de l’IA</Title>
    <Lede>Les tests écrits d’abord fixent le comportement attendu : l’agent ne peut plus « valider » son propre bug.</Lede>
    <M4Tdd x={160} color={C.coral} title="Rouge" sub="« Écris uniquement les tests. Lance-les : ils doivent échouer. »" d={100} />
    <M4Tdd x={780} color={C.green} title="Vert" sub="« Implémente sans modifier les tests. » #testFailure aide à corriger." d={300} />
    <M4Tdd x={1400} color={C.blue} title="Refactor" sub="« Simplifie sans changer le comportement : tests verts à chaque étape. »" d={500} />
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <Arrow x1={530} y1={480} x2={770} y2={480} color={C.faint} />
      <Arrow x1={1150} y1={480} x2={1390} y2={480} color={C.faint} />
    </svg>
    <div className={b.on(1)} style={{ position: 'absolute', left: 120, top: 720, width: 1680 }}>
      <Callout title="Le piège à surveiller" tone="coral" icon="alert" size={24}>
        Un agent bloqué peut <strong>modifier le test</strong> pour le faire passer. Règle écrite dans les instructions de test, et vérification dans le diff :
        en phase verte, aucun fichier <code style={{ fontFamily: mono }}>*.test.ts</code> ne doit changer.
      </Callout>
    </div>
  </Frame>
);

const M4_Lab52: Page = () => (
  <LabPage
    mod={4}
    n="5.2"
    title="« Que cuisiner ? » en TDD"
    defi="trous"
    who="Développeurs"
    label="Fil rouge · Sprint 4 — Skills & features"
    where={
      <>
        <PathChip>src/domain/recipes.test.ts</PathChip> puis <PathChip>src/domain/recipes.ts</PathChip>
      </>
    }
    objective="Développer l’algorithme de suggestion de recettes (score selon les produits qui expirent) en écrivant les tests d’abord."
    feats={
      <>
        <Tag tone="blue" size={18}>TDD</Tag>
        <Tag tone="blue" size={18}>#testFailure</Tag>
      </>
    }
    minutes={15}
    crit={
      <>
        <CheckItem id="l52a" size={21}>Les tests échouent d’abord, pour la bonne raison</CheckItem>
        <CheckItem id="l52b" size={21}>L’implémentation ne modifie pas les tests</CheckItem>
        <CheckItem id="l52c" size={21}>Ordre stable en cas d’égalité</CheckItem>
      </>
    }
    bonus={
      <Callout title="Bonus · Lab 5.3" tone="pink" icon="sparkles" size={20}>
        La liste de courses en autonomie : issue, plan, lots, vérification. Sans aucune amorce.
      </Callout>
    }
  >
    Complétez le prompt de l’étape 1 (tests uniquement). Écrivez vous-même celui de l’étape 2.
    <CodeDark size={20} wrap style={{ marginTop: 12 }}>
      Dans src/domain/recipes.test.ts, écris les tests de suggestRecipes(<Hole>paramètres</Hole>) qui renvoie <Hole>…</Hole>.{'\n'}Règles du score :{' '}
      <Hole>au moins 3</Hole>.{'\n'}Cas limites : <Hole>au moins 4</Hole>.{'\n'}N’écris pas <Hole>…</Hole>. Lance les tests et montre-moi qu’ils <Hole>…</Hole>.
    </CodeDark>
  </LabPage>
);

// ─── Lab 5.4 · QCM micro-tâches ─────────────────────────────────────────────
const M4_Lab54: Page = () => (
  <Frame mod={4} kind="lab" label="Fil rouge · Sprint 4 — Skills & features">
    <Title>
      <span style={{ color: C.green }}>Lab 5.4</span> · Micro-tâches : le bon outil au bon moment
    </Title>
    <Lede>Prendre une session agent pour renommer une variable, c’est prendre un taxi pour traverser la rue.</Lede>
    <QuizSeries y={255}>
      <QuizQ q="Renommer expiresOn en expiryDate dans tout le projet." explain="« Renommer le symbole » (F2) s’appuie sur l’analyse du code : exact, instantané, zéro token.">
        <QOpt>Une session agent : « renomme expiresOn partout »</QOpt>
        <QOpt>Le chat inline sur chaque fichier concerné</QOpt>
        <QOpt ok>La commande de l’éditeur « Renommer le symbole » (F2)</QOpt>
        <QOpt>Un skill dédié aux renommages</QOpt>
      </QuizQ>
      <QuizQ q="Ajouter un paramètre locale à formatDate, puis mettre à jour ses 6 appels." explain="Les suggestions d’édition suivante devinent la suite : après la signature, Tab accepte chaque appel mis à jour.">
        <QOpt ok>Next Edit Suggestions : modifier la signature, puis Tab sur chaque appel</QOpt>
        <QOpt>Une session agent avec tout le projet en contexte</QOpt>
        <QOpt>Le chat inline sur chaque appel, un par un</QOpt>
        <QOpt>Modifier la fonction et laisser les tests échouer</QOpt>
      </QuizQ>
      <QuizQ q="Écrire la JSDoc de suggestRecipes." explain="La complétion génère la JSDoc depuis la signature et le corps : le plus rapide. Le chat inline est aussi acceptable.">
        <QOpt>Une session agent, en commençant par l’agent Plan</QOpt>
        <QOpt ok>La complétion inline : taper /** au-dessus de la fonction</QOpt>
        <QOpt>Un skill « documentation »</QOpt>
        <QOpt>Une nouvelle règle dans copilot-instructions.md</QOpt>
      </QuizQ>
      <QuizQ q="Convertir une boucle for en reduce dans impact.ts." explain="Le chat inline travaille sur la sélection : contexte minimal, réponse rapide, diff relisible immédiatement.">
        <QOpt>Une session agent avec tout src/ en contexte</QOpt>
        <QOpt ok>Le chat inline (Ctrl+I) sur la sélection, « sans changer le comportement »</QOpt>
        <QOpt>Une nouvelle instruction dans copilot-instructions.md</QOpt>
        <QOpt>La commande « Renommer le symbole »</QOpt>
      </QuizQ>
      <QuizQ q="Ajouter un mode sombre à toute l’application." explain="Beaucoup de fichiers, un plan nécessaire : c’est le bon usage d’une session agent, Plan d’abord.">
        <QOpt>La complétion inline, fichier par fichier</QOpt>
        <QOpt>Le chat inline sur tokens.css uniquement</QOpt>
        <QOpt ok>Une session agent, en commençant par l’agent Plan</QOpt>
        <QOpt>La commande « Renommer le symbole »</QOpt>
      </QuizQ>
      <QuizQ q="Pourquoi éviter une session agent pour une micro-tâche ?" explain="Chaque requête agent embarque instructions, définitions d’outils et historique : du coût et de la latence sans valeur ajoutée.">
        <QOpt>Les sessions agent sont interdites sur les petits fichiers</QOpt>
        <QOpt ok>Elle consomme crédits et contexte pour un gain nul</QOpt>
        <QOpt>L’agent ne sait pas modifier une seule ligne</QOpt>
        <QOpt>Les complétions utilisent toujours un meilleur modèle</QOpt>
      </QuizQ>
    </QuizSeries>
  </Frame>
);

// @@PAGES-BEGIN
export const __pages = [
  J2_Cover,
  J2_Quiz,
  J2_Programme,
  M4_Divider,
  M4_Format,
  M4_Matrix,
  M4_Practices,
  M4_Skills,
  M4_Lab42,
  M4_IssueToCode,
  M4_Lab51,
  M4_Lab43,
  M4_TDD,
  M4_Lab52,
  M4_Lab54,
];
// @@PAGES-END

// @@NOTES-BEGIN
export const __notes = [
  `⏱ 2 min · COUVERTURE JOUR 2 · 9:00

OBJECTIF — Relancer la dynamique, annoncer la journée.

DIRE — « Bonjour à toutes et à tous ! Hier, on a posé les fondations : comprendre les modèles, choisir les outils, construire le contexte, connaître les limites. Aujourd’hui, le programme s’intitule “sécurité, optimisation et mise en pratique”. On commence par vos retours d’intersession, puis on développe les vraies fonctionnalités de FrigoMalin. Ensuite, la cybersécurité, puis l’évaluation et la fiabilisation du code, avec une équipe d’agents spécialisés. Et à 17 heures, si tout va bien, FrigoMalin sera en ligne. »

ANIMATION — Demander en un mot comment s’est passée l’intersession (chat ou tour rapide).

TRANSITION — « D’abord, réveillons la mémoire d’hier : cinq questions flash. »`,
  `⏱ 6 min · QUIZ DE RÉACTIVATION

OBJECTIF — Réactiver les notions clés du jour 1 (évaluation formative).

DIRE — « Cinq questions. Main levée d’abord, puis un volontaire clique. Objectif : cinq sur cinq du premier coup. »

RÉPONSES — Q1 : suite la plus probable, sans vérification (slopsquatting). Q2 : copilot-instructions.md, toujours chargé. Q3 : le critère de fin vérifiable. Q4 : l’exclusion officielle n’est pas appliquée en mode Agent, d’où la défense en profondeur. Q5 : le contenu lu est une donnée, jamais une consigne.

ANIMATION — Les pastilles numérotées permettent de naviguer ; le compteur « du premier coup » mesure le groupe. Sur une erreur, demander à celui qui a voté juste de réexpliquer : c’est plus efficace que ma propre explication.

TRANSITION — « Bonne mémoire ! Voici le programme de la journée. »`,
  `⏱ 2 min · PROGRAMME J2

OBJECTIF — Donner la carte de la journée, alignée sur le programme officiel.

DIRE — « Module 4 : l’exploitation de l’intersession, vos cas d’usage. Puis un sprint FrigoMalin : skills, de l’issue au code, TDD, micro-tâches. Module 5, juste avant le déjeuner : la cybersécurité, avec l’analyse d’incidents réels. Module 6, tout l’après-midi : évaluer et fiabiliser le code. On y crée une équipe d’agents spécialisés pilotée par un lead, on pose des garde-fous déterministes, on écrit des tests et on optimise la consommation. Module 7 : la synthèse, avec la mise en ligne sur GitHub Pages et votre plan d’action. Treize labs aujourd’hui : on va garder un bon rythme. »

ANIMATION — Pointer les labs de chaque bloc.

TRANSITION — « Commençons par vous : module 4. »`,
  `⏱ 1 min · DIVISEUR M4 · 9:15

OBJECTIF — Annoncer le module 4 du programme : exploitation de l’intersession.

DIRE — « Module 4. Le programme dit : présentation et analyse collective des cas réalisés. C’est le moment le plus riche de la formation, parce que vos cas sont réels. On va les écouter, compter ce qu’on entend, les placer dans une matrice valeur-effort, et en tirer une matrice de bonnes pratiques du groupe. Ensuite, on applique tout de suite sur FrigoMalin avec le sprint skills et features. »

ANIMATION — Annoncer l’ordre de passage (volontaires d’abord).

TRANSITION — « Les règles du tour de table. »`,
  `⏱ 25 min (8 min par cas, 3 cas en plénière, le reste en sous-groupes) · ATELIER

OBJECTIF — Faire présenter les cas d’usage et recueillir bénéfices et limites de façon structurée.

DIRE — « Cinq minutes de présentation, trois minutes de questions : je lance le minuteur pour chacun. Suivez la fiche : contexte et outil, résultat mesuré, limites et incidents, ce que vous gardez. Pendant ce temps, le groupe écoute et compte : chaque fois qu’un bénéfice ou une limite est cité, un clic. »

ANIMATION — Réinitialiser le minuteur entre deux présentations (bouton de remise à zéro). Si le groupe est grand : trois cas en plénière, les autres en sous-groupes de trois avec un rapporteur. Relever les incidents (hallucinations, blocages) : ce sont les meilleurs exemples pour la suite.

RÉPONSES TYPES — Bénéfices : gain de temps sur tests et docs, découverte d’une API. Limites : contexte insuffisant, règles internes floues sur les outils autorisés, quotas.

TRANSITION — « Plaçons ces cas dans une matrice. »`,
  `⏱ 5 min · EXERCICE · MATRICE VALEUR × EFFORT

OBJECTIF — Analyser collectivement les cas pour identifier les quick wins.

DIRE — « Quatre zones. Quick wins : forte valeur, faible effort, à généraliser dans l’équipe. Projets : forte valeur, effort élevé, à cadrer. Bonus : faible valeur, faible effort. À éviter. Placez les cas présentés, et ceux de la liste. »

RÉPONSES TYPES — Quick wins : tests d’un module legacy, documentation d’API, messages de commit, revue de PR assistée. Projets : refactorisation d’un monolithe, script de migration. Bonus : prototype d’écran. À éviter : un agent qui merge seul en production. Débat fréquent : l’analyse de logs (valeur forte, mais anonymisation coûteuse).

ANIMATION — Faire glisser les pastilles par les participants dont c’était le cas. Double-clic pour remettre.

TRANSITION — « On consolide tout ça en une matrice de bonnes pratiques. »`,
  `⏱ 4 min · SYNTHÈSE · MATRICE DE BONNES PRATIQUES (3 temps)

OBJECTIF — Produire une synthèse collective réutilisable (programme : synthèse collective des enseignements).

DIRE — « Quatre situations typiques, trois colonnes : l’outil ou le mode, la technique de prompt, le garde-fou. Tâche répétitive : complétion, chat inline ou skill ; exemples et format imposé ; lint et tests. » → clic. « Code legacy : Ask pour comprendre, Plan pour migrer ; expliquer d’abord, migrer par lots ; et surtout des tests de caractérisation avant tout changement. » → clic. « Besoin flou : Ask en sparring partner ; “pose-moi tes questions d’abord” ; validation par le PO. » → clic. « Code ou données sensibles : offre entreprise ou modèle local ; abstraire et anonymiser ; exclusions et revue. »

ANIMATION — Compléter à l’oral avec les apports du groupe ; proposer de recopier la matrice dans le wiki de l’équipe.

TRANSITION — « Place à la pratique : sprint 4 de FrigoMalin, et d’abord les skills. »`,
  `⏱ 3 min · SKILLS (2 temps) · 9:50

OBJECTIF — Comprendre la structure et le chargement progressif des skills.

DIRE — « Un skill, c’est un dossier avec un fichier SKILL.md et des ressources : gabarits, scripts, exemples. C’est un format ouvert, partagé par plusieurs agents, dont Copilot et Claude Code. Le chargement est progressif. En permanence, le modèle ne voit que le nom et la description : quelques dizaines de tokens. » → clic. « Si la tâche correspond, il charge le corps : les étapes, les règles. » → clic. « Et les ressources seulement à la demande. Conséquence : vous pouvez avoir vingt skills sans alourdir les requêtes. Mais si la description est floue, le skill ne se déclenche jamais. La description doit dire quoi et quand, avec les mots que vous taperiez. »

ANIMATION — Pointer dans le code la description : « Crée un composant… À utiliser pour… ».

TRANSITION — « Lab 4.2 : votre premier skill. »`,
  `⏱ 15 min (minuteur) · LAB 4.2

OBJECTIF — Créer un skill qui se déclenche seul, avec gabarits et script de vérification.

DIRE — « Complétez SKILL.md. Le test décisif : demandez “ajoute un composant BadgeUrgence” sans nommer le skill. S’il se charge seul, votre description est bonne. »

CORRIGÉ (formateur) — name: create-component ; description : « Crée un composant React + TypeScript dans src/ui avec son test, à partir des gabarits du skill. À utiliser pour toute création ou ajout de composant d’interface. » Étapes : lire tokens.css et les instructions UI ; copier les gabarits template/ sans recopier leur contenu dans la réponse ; nommer en PascalCase ; lancer node .github/skills/create-component/check.mjs et corriger jusqu’à succès. Le script vérifie la présence des fichiers et l’absence de couleur en dur (hexadécimal, rgb()).

ANIMATION — Lancer le minuteur. Vérifier dans les références de la réponse que le skill a été chargé.

TRANSITION — « Le skill est prêt. Développons la première vraie feature : l’inventaire. »`,
  `⏱ 4 min · DE L’ISSUE AU CODE (5 temps)

OBJECTIF — Installer le workflow quotidien : plan validé, lots, commits, sessions.

DIRE — « Tout part d’une issue avec des critères Gherkin : étant donné, quand, alors. » → clic. « L’agent Plan propose des lots de un à trois fichiers, tests d’abord. » → clic. « Vous validez le plan : vous corrigez, ajoutez, retirez. » → clic. « Un lot en mode Agent : tests, code, npm test et lint. » → clic. « Vous relisez le diff et vous committez : un commit par lot. » → clic. « Lot suivant ; et si le contexte enfle, nouvelle session. Pourquoi des lots ? Un diff de 40 lignes se relit vraiment, un diff de 800 se valide les yeux fermés. Pourquoi un commit par lot ? Un lot raté se défait d’un geste. Pourquoi une nouvelle session ? Une tâche, une session. »

ANIMATION — Les deux étapes vertes sont les points de contrôle humains du module 2.

TRANSITION — « Appliquons-le sur l’inventaire. »`,
  `⏱ 25 min (minuteur) · LAB 5.1 (pause 10:30 à placer pendant ou après)

OBJECTIF — Mener une feature complète en lots relus.

DIRE — « Pas d’amorce, des ingrédients : les critères de la feature, les fichiers de contexte, les principes, le composant et le skill. Écrivez le prompt de plan, puis les prompts par lot. Et notez quand vous relisez, committez, changez de session. »

CORRIGÉ (formateur) — Plan (agent Plan) : « À partir de #docs/mvp.md (ligne Inventaire), #PRODUCT.md, #docs/adr/0001-stockage.md et #src/domain/types.ts, propose un plan en 3 à 5 lots de 1 à 3 fichiers, tests d’abord, sans écrire de code. » Lots typiques : 1) règles de dates dans src/domain (isExpired, daysLeft, DLC/DDM) + tests ; 2) dépôt Dexie dans src/data + tests avec fake-indexeddb ; 3) écran Inventory avec StockItemCard (skill create-component), tri par urgence ; 4) ajout/suppression. Après chaque lot : npm test, npm run lint, relecture, commit. Nouvelle session si le contexte dépasse.

TRANSITION — « L’écran d’ajout existe : branchons le scan de code-barres. »`,
  `⏱ 15 min (minuteur) · LAB 4.3 · 10:45

OBJECTIF — Emballer une documentation externe dans un skill et implémenter le scan proprement.

DIRE — « Ce lab vient après le 5.1, qui a créé l’écran d’ajout. Construisez un skill openfoodfacts-api : une documentation réduite aux champs utiles, avec une vraie réponse que vous récupérez vous-même. Puis le prompt d’implémentation. Et souvenez-vous de l’audit d’hier : https, délai maximal, produit inconnu, hors ligne, pas d’innerHTML. »

CORRIGÉ (formateur) — Skill : SKILL.md (description : « À utiliser pour tout appel à l’API Open Food Facts ou pour le scan de code-barres ») + exemples/produit.json (réponse réduite : code, product_name, brands, quantity, image_small_url) + exemples/inconnu.json. Implémentation : src/data/off.ts avec fetch https, délai de 5 s, res.ok, status 0 → inconnu ; repli saisie manuelle ; BarcodeDetector si disponible, sinon bibliothèque ; tests avec fetch simulé, jamais le vrai réseau.

TRANSITION — « Prochaine feature, la plus “métier” : “Que cuisiner ?”, en TDD. »`,
  `⏱ 3 min · TDD (1 temps)

OBJECTIF — Montrer pourquoi le TDD est particulièrement adapté au travail avec un agent.

DIRE — « Rouge : on demande uniquement les tests, et on les lance : ils doivent échouer, pour la bonne raison. Vert : on implémente sans modifier les tests ; si un test échoue, l’outil #testFailure joint l’échec au prompt. Refactor : on simplifie, comportement inchangé, tests verts à chaque étape. Pourquoi c’est puissant avec l’IA ? Les tests écrits d’abord fixent le comportement attendu : l’agent ne peut plus valider son propre bug. » → clic. « Le piège : un agent bloqué peut modifier le test pour le faire passer. Règle dans les instructions de test, et vérification dans le diff : en phase verte, aucun fichier de test ne change. »

ANIMATION — Demander qui pratique déjà le TDD ; souvent peu. C’est l’occasion de s’y mettre : l’IA rend l’écriture des tests beaucoup moins coûteuse.

TRANSITION — « Lab 5.2. »`,
  `⏱ 15 min (minuteur) · LAB 5.2

OBJECTIF — Développer une règle métier en TDD avec un agent.

DIRE — « Étape 1, prompt à trous : uniquement les tests. Étape 2, à vous : l’implémentation, sans toucher aux tests. »

CORRIGÉ (formateur) — suggestRecipes(stock, recipes, today) renvoie les recettes triées par score. Règles : +3 par ingrédient qui expire dans 2 jours ou moins, +1 par ingrédient disponible, recette exclue si un ingrédient manque et n’est pas « de base » ; égalité → ordre alphabétique (ordre stable). Cas limites : stock vide, aucune recette réalisable, produit périmé (DLC dépassée exclue), DDM dépassée acceptée, égalité de score, quantités insuffisantes. « N’écris pas l’implémentation. Lance les tests et montre-moi qu’ils échouent. » Étape 2 : « Implémente suggestRecipes sans modifier recipes.test.ts ; termine par npm test. »

ANIMATION — Bonus 5.3 pour les plus rapides : la liste de courses en autonomie, avec le cas « en stock mais expire avant les courses ».

TRANSITION — « Dernier lab du sprint : un QCM éclair sur les micro-tâches. »`,
  `⏱ 5 min · LAB 5.4 (QCM) · fin vers 11:15

OBJECTIF — Choisir le niveau d’assistance le moins coûteux qui fait le travail.

DIRE — « Six situations, six choix. Vote, puis clic. »

RÉPONSES — 1 : Renommer le symbole (F2), exact et gratuit. 2 : Next Edit Suggestions, Tab sur chaque appel. 3 : la complétion après /** (le chat inline est acceptable). 4 : chat inline sur la sélection. 5 : session agent, Plan d’abord. 6 : une session agent embarque instructions, outils et historique : coût et latence sans valeur.

MESSAGE CLÉ — L’ordre de réflexe : outil de l’éditeur → complétion ou suggestion d’édition → chat inline → session agent (Plan puis Agent).

ANIMATION — Rapide : c’est la transition naturelle vers le coût et la sécurité.

TRANSITION — « On a développé vite. Maintenant, sécurisons : module 5. »`,
];
// @@NOTES-END
